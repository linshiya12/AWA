import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/categories — List all categories (API-020)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const categories = publicDb.getCategories();
  return NextResponse.json({ categories });
}

// POST /api/v1/admin/categories — Create a category at any depth (API-020, FEAT-030)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = publicDb.createCategory({
      parent_id: body.parent_id || null,
      name: body.name.trim(),
      description: body.description || '',
      position: body.position || 1,
      is_visible: body.is_visible ?? true,
      preview_media_id: body.preview_media_id || null,
      extra_prompt_words: body.extra_prompt_words || undefined,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_category',
      'category',
      category.category_id,
      null,
      category as unknown as Record<string, unknown>
    );

    return NextResponse.json({ category }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to create category' }, { status: 400 });
  }
}
