import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string; languageId: string }>;
}

// POST /api/v1/admin/templates/[id]/translations/[languageId]/publish — Publish translation according to workflow
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: templateId, languageId } = await context.params;
  const versions = privateDb.getVersionsForTemplate(templateId);
  const currentVer = versions.find((v) => v.is_current) || versions[0];

  const translation = privateDb.getPromptTranslation(templateId, languageId, currentVer?.version_id);
  if (!translation) {
    return NextResponse.json({ error: 'Translation record not found' }, { status: 404 });
  }

  const updated = privateDb.updatePromptTranslation(
    translation.translation_id,
    {
      review_status: 'published',
      status: 'completed',
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.adminUser.user_id,
    },
    auth.adminUser.user_id
  );

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'publish_prompt_translation',
    'prompt_translation',
    updated.translation_id,
    null,
    { template_id: templateId, language_id: languageId, version_id: updated.version_id }
  );

  return NextResponse.json({
    message: `Translation for '${languageId}' published successfully`,
    translation: updated,
  });
}
