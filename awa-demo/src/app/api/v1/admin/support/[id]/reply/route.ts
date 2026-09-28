import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { requireAdminApi } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/admin/support/[id]/reply
 * Adds an admin reply (public to user) OR an internal note (private to admins).
 */
export async function POST(
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
    const { content, is_internal_note } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const message = privateDb.addAdminReplyToTicket(
      id,
      auth.adminUser.user_id,
      content.trim(),
      Boolean(is_internal_note)
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
