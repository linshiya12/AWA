import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// POST /api/v1/admin/categories/reorder — Reorder categories (API-020)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!Array.isArray(body.ordered_ids)) {
      return NextResponse.json({ error: 'ordered_ids array is required' }, { status: 400 });
    }

    publicDb.reorderCategories(body.ordered_ids);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'reorder_categories',
      'category',
      'bulk',
      null,
      { ordered_ids: body.ordered_ids }
    );

    return NextResponse.json({ success: true, categories: publicDb.getCategories() });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to reorder categories' }, { status: 400 });
  }
}
