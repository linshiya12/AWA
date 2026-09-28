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
 * POST /api/v1/support/tickets/[id]/reply
 * Adds a user reply to an existing support ticket.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getEffectiveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, screenshotUrl } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reply content cannot be empty' },
        { status: 400 }
      );
    }

    const message = privateDb.addUserReplyToTicket(
      id,
      user.user_id,
      content.trim(),
      screenshotUrl || undefined
    );

    return NextResponse.json({
      message,
      success: true,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to post reply' },
      { status: 400 }
    );
  }
}
