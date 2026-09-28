import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { requireAdminApi } from '@/lib/server/auth';
import { SupportTicketStatus } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/v1/admin/support/[id]/status
 * Updates the ticket status (open, in_progress, waiting_for_user, resolved).
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
    const { status, note } = body;

    const validStatuses: SupportTicketStatus[] = [
      'open',
      'in_progress',
      'waiting_for_user',
      'resolved',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing status' },
        { status: 400 }
      );
    }

    const ticket = privateDb.updateTicketStatus(
      id,
      status,
      auth.adminUser.user_id,
      note
    );

    return NextResponse.json({
      ticket,
      success: true,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update status' },
      { status: 400 }
    );
  }
}
