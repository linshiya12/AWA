import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/media — List media assets (API-026)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const assets = publicDb.getMediaAssets();
  return NextResponse.json({ assets });
}

// POST /api/v1/admin/media — Upload/register media asset (API-026, 06 §13)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.storage_reference || !body.kind) {
      return NextResponse.json(
        { error: 'storage_reference and kind are required' },
        { status: 400 }
      );
    }

    const asset = publicDb.addMediaAsset({
      storage_reference: body.storage_reference,
      kind: body.kind,
      original_filename: body.original_filename || 'media.jpg',
      size: body.size || 102400,
      uploaded_by: auth.adminUser.user_id,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'upload_media_asset',
      'media_asset',
      asset.media_id,
      null,
      asset as unknown as Record<string, unknown>
    );

    return NextResponse.json({ asset }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to register media' }, { status: 400 });
  }
}

// DELETE /api/v1/admin/media — Delete media asset (API-026)
export async function DELETE(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
  }

  const success = publicDb.deleteMediaAsset(id);
  return NextResponse.json({ success });
}
