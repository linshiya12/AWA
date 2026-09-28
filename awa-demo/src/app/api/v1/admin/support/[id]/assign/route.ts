import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { requireAdminApi } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/v1/admin/support/[id]/assign
 * Assigns a ticket to a designated administrator.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { assigned_to_user_id } = body;

    const ticket = privateDb.assignTicket(
      id,
      assigned_to_user_id || null,
      auth.adminUser.user_id
    );

    return NextResponse.json({
      ticket,
      success: true,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to assign ticket' },
      { status: 400 }
    );
  }
}
