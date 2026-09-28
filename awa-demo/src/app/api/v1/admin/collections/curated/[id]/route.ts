import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { CuratedCollection } from '@/lib/server/types';

// GET /api/v1/admin/collections/curated/[id] — Get single curated collection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await params;
  const collection = publicDb.getCuratedCollectionById(id);

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json({ collection });
}

// PUT /api/v1/admin/collections/curated/[id] — Update curated collection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await params;
  const existing = publicDb.getCuratedCollectionById(id);

  if (!existing) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length < 3)) {
      return NextResponse.json(
        { error: 'Collection name must be at least 3 characters.' },
        { status: 400 }
      );
    }

    if (body.template_ids !== undefined) {
      if (!Array.isArray(body.template_ids) || body.template_ids.length === 0) {
        return NextResponse.json(
          { error: 'At least one template must be in the curated collection.' },
          { status: 400 }
        );
      }
    }

    const uniqueTemplateIds: string[] | undefined = body.template_ids
      ? Array.from(new Set(body.template_ids as string[]))
      : undefined;

    const updates: Partial<CuratedCollection> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.slug !== undefined) updates.slug = body.slug.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.cover_image !== undefined) updates.cover_image = body.cover_image;
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (typeof body.position === 'number') updates.position = body.position;
    if (uniqueTemplateIds !== undefined) updates.template_ids = uniqueTemplateIds;

    const updated = publicDb.updateCuratedCollection(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 400 });
    }

    // Record audit log
    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_curated_collection',
      'curated_collection',
      id,
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({ collection: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update collection' },
      { status: 400 }
    );
  }
}

// DELETE /api/v1/admin/collections/curated/[id] — Delete curated collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await params;
  const existing = publicDb.getCuratedCollectionById(id);

  if (!existing) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const success = publicDb.deleteCuratedCollection(id);

  if (!success) {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }

  // Record audit log
  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'delete_curated_collection',
    'curated_collection',
    id,
    existing as unknown as Record<string, unknown>,
    null
  );

  return NextResponse.json({ success: true, message: 'Collection deleted successfully.' });
}
