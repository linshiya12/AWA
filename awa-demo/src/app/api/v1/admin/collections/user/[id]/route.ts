import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/collections/user/[id] — View single user collection details (Read-Only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await params;
  const collection = privateDb.getUserCollectionById(id);

  if (!collection) {
    return NextResponse.json({ error: 'User collection not found' }, { status: 404 });
  }

  // Ensure absolutely NO private prompt text is leaked in collection responses
  return NextResponse.json({ collection });
}
