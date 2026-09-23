import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/v1/admin/templates/[id]/attributes — Get template attributes (API-021)
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const attributes = publicDb.getTemplateAttributes(id);
  return NextResponse.json({ attributes });
}

// PATCH /api/v1/admin/templates/[id]/attributes — Set template attributes (API-021, FEAT-004)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.attributes)) {
      return NextResponse.json({ error: 'attributes array is required' }, { status: 400 });
    }

    const updated = publicDb.setTemplateAttributes(id, body.attributes);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'set_template_attributes',
      'template',
      id,
      null,
      { attributesCount: updated.length }
    );

    return NextResponse.json({ attributes: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update attributes' }, { status: 400 });
  }
}
