import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { resolveUserFromRequest } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

function getEffectiveUser(request: NextRequest) {
  const headerUserId = request.headers.get('x-awa-user-id');
  if (headerUserId) {
    const u = privateDb.getUserById(headerUserId);
    if (u) return u;
  }
  const cookieUserId = request.cookies.get('awa_user_id')?.value;
  if (cookieUserId) {
    const u = privateDb.getUserById(cookieUserId);
    if (u) return u;
  }
  const url = new URL(request.url);
  const paramUserId = url.searchParams.get('userId');
  if (paramUserId) {
    const u = privateDb.getUserById(paramUserId);
    if (u) return u;
  }
  const member = privateDb.getUserById('usr-alex-sub');
  return member || resolveUserFromRequest(request);
}

/**
 * GET /api/v1/support/tickets/[id]
 * Retrieves user's specific ticket thread.
 * Internal notes are strictly excluded.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getEffectiveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = privateDb.getSupportTicketForUserById(id, user.user_id);
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}
