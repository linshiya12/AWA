import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/categories/[id]/move — Relocate category branch (API-020, Rule 13)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getCategoryById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const newParentId = body.new_parent_id !== undefined ? body.new_parent_id : null;

    const result = publicDb.moveCategory(id, newParentId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updated = publicDb.getCategoryById(id);
    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'move_category_branch',
      'category',
      id,
      { parent_id: existing.parent_id, path: existing.path },
      { parent_id: newParentId, path: updated?.path }
    );

    return NextResponse.json({ category: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to move category' }, { status: 400 });
  }
}
