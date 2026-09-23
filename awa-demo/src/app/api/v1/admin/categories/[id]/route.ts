import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/v1/admin/categories/[id] — Update category (API-020)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getCategoryById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = publicDb.updateCategory(id, body);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_category',
      'category',
      id,
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({ category: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update category' }, { status: 400 });
  }
}

// DELETE /api/v1/admin/categories/[id] — Hide/remove category with counts (API-020, 07 §9)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getCategoryById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const result = publicDb.deleteCategory(id);

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'hide_category_branch',
    'category',
    id,
    existing as unknown as Record<string, unknown>,
    { is_visible: false, ...result }
  );

  return NextResponse.json(result);
}
