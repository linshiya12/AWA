import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/collections/user — List user saved collections (Read-Only Support View)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const userId = searchParams.get('user_id') || undefined;
  const dateFrom = searchParams.get('date_from') || undefined;
  const dateTo = searchParams.get('date_to') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const result = privateDb.getUserCollections({
      search,
      userId,
      dateFrom,
      dateTo,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('Error in GET /api/v1/admin/collections/user:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to retrieve user collections', stack: (err as Error).stack },
      { status: 500 }
    );
  }
}
