import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/v1/admin/templates/[id] — Template details (API-021)
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const category = publicDb.getCategoryById(template.category_id);
  const attributes = publicDb.getTemplateAttributes(id);
  const resolvedTools = publicDb.resolveAssignmentsForTemplate(id);
  const guidance = publicDb.getGuidanceForScope('template', id);
  const versions = privateDb.getVersionsForTemplate(id);

  return NextResponse.json({
    template,
    category,
    attributes,
    resolvedTools: resolvedTools.assigned,
    guidance,
    versionsCount: versions.length,
    currentVersion: versions.find((v) => v.is_current) || null,
  });
}

// PATCH /api/v1/admin/templates/[id] — Update template metadata (API-021)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getTemplateById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = publicDb.updateTemplate(id, body);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_template',
      'template',
      id,
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({ template: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update template' }, { status: 400 });
  }
}

// DELETE /api/v1/admin/templates/[id] — Hide template (07 §9)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getTemplateById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const updated = publicDb.updateTemplate(id, { status: 'hidden' });
  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'hide_template',
    'template',
    id,
    { status: existing.status },
    { status: 'hidden' }
  );

  return NextResponse.json({ template: updated });
}
