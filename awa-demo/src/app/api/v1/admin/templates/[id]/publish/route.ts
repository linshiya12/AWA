import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { queueTranslationsForEnabledLanguages } from '@/lib/server/ai/backgroundTranslation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/templates/[id]/publish — Publish template (API-021, Rule 12)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Acceptance Criteria FR-038 & Rule 12: A template cannot be published without a current version!
  if (!template.current_version_id) {
    return NextResponse.json(
      { error: 'Cannot publish template: no prompt version exists. Write and save a prompt first.' },
      { status: 400 }
    );
  }

  const updated = publicDb.updateTemplate(id, { status: 'published' });

  // Newly published templates should also be queued for every enabled language
  queueTranslationsForEnabledLanguages(id, template.current_version_id, auth.adminUser.user_id).catch(() => {});

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'publish_template',
    'template',
    id,
    { status: template.status },
    { status: 'published', current_version_id: template.current_version_id }
  );

  return NextResponse.json({ template: updated });
}
