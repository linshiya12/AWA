import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/collections/curated — List curated collections with filters & pagination
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const status = (searchParams.get('status') as 'active' | 'inactive' | 'all') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const result = publicDb.getCuratedCollections({
    search,
    status,
    page,
    limit,
  });

  return NextResponse.json(result);
}

// POST /api/v1/admin/collections/curated — Create new curated recommendation collection
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Collection name is required and must be at least 3 characters.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.template_ids) || body.template_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one template must be selected for the curated collection.' },
        { status: 400 }
      );
    }

    // Deduplicate template IDs
    const uniqueTemplateIds: string[] = Array.from(new Set(body.template_ids as string[]));

    const collection = publicDb.createCuratedCollection({
      name: body.name.trim(),
      slug: body.slug?.trim() || undefined,
      description: body.description?.trim() || '',
      cover_image: body.cover_image || null,
      is_active: body.is_active ?? true,
      position: typeof body.position === 'number' ? body.position : undefined,
      template_ids: uniqueTemplateIds,
      created_by: auth.adminUser.user_id,
    });

    // Record audit log
    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_curated_collection',
      'curated_collection',
      collection.collection_id,
      null,
      collection as unknown as Record<string, unknown>
    );

    return NextResponse.json({ collection }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to create collection' },
      { status: 400 }
    );
  }
}
