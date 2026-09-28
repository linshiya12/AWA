import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { requireAdminApi } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/admin/support
 * Returns tickets with search, status/category/user/date filters, and summary counts.
 * Protected: requires administrator role.
 */
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const dateRange = searchParams.get('dateRange') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const result = privateDb.getAdminSupportTickets({
      search,
      status,
      category,
      userId,
      dateRange,
      page,
      pageSize,
    });

    // Provide list of admin users for assignment dropdowns
    const allUsers = privateDb.getUsers();
    const adminUsers = allUsers
      .filter((u) => u.role === 'administrator' && u.status === 'active')
      .map((u) => ({
        user_id: u.user_id,
        name: u.display_name || u.email,
        email: u.email,
      }));

    return NextResponse.json({
      ...result,
      adminUsers,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch admin support tickets' },
      { status: 500 }
    );
  }
}
