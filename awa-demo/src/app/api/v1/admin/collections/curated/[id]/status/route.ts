import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// PATCH /api/v1/admin/collections/curated/[id]/status — Toggle or set active/inactive status
export async function PATCH(
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
    let newStatus: boolean;
    // Check if body supplies explicit status, otherwise toggle
    const text = await request.text();
    if (text) {
      const body = JSON.parse(text);
      newStatus = typeof body.is_active === 'boolean' ? body.is_active : !existing.is_active;
    } else {
      newStatus = !existing.is_active;
    }

    const updated = publicDb.updateCuratedCollection(id, { is_active: newStatus });
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    // Record audit log
    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'toggle_curated_collection_status',
      'curated_collection',
      id,
      { is_active: existing.is_active },
      { is_active: updated.is_active }
    );

    return NextResponse.json({
      collection: updated,
      message: updated.is_active
        ? 'Collection activated. It will now appear in user recommendations.'
        : 'Collection deactivated. It has been removed from recommendations while preserving its templates.',
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update collection status' },
      { status: 400 }
    );
  }
}
