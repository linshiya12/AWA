import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/templates/[id]/hide — Hide template (API-021)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const updated = publicDb.updateTemplate(id, { status: 'hidden' });

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'hide_template',
    'template',
    id,
    { status: template.status },
    { status: 'hidden' }
  );

  return NextResponse.json({ template: updated });
}
