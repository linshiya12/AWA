import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { resolveUserFromRequest } from '@/lib/server/auth';
import { SupportTicketCategory } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

function getEffectiveUser(request: NextRequest) {
  // Check header or cookie first
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
  // Check search param
  const url = new URL(request.url);
  const paramUserId = url.searchParams.get('userId');
  if (paramUserId) {
    const u = privateDb.getUserById(paramUserId);
    if (u) return u;
  }
  // Default to member persona Alex Morgan for smooth demo testing
  const member = privateDb.getUserById('usr-alex-sub');
  return member || resolveUserFromRequest(request);
}

/**
 * GET /api/v1/support/tickets
 * Returns the current signed-in user's support tickets.
 * Internal notes are strictly excluded.
 */
export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = privateDb.getSupportTicketsForUser(user.user_id);
    return NextResponse.json({
      tickets,
      currentUser: {
        user_id: user.user_id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/support/tickets
 * Creates a new support ticket submitted by the user.
 */
export async function POST(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      category,
      description,
      screenshotUrl,
      relatedTemplateId,
      relatedAttemptId,
    } = body;

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const validCategories: SupportTicketCategory[] = [
      'account',
      'subscription_or_payment',
      'credits',
      'prompt_customization',
      'template_or_guidance',
      'other',
    ];

    const effectiveCategory: SupportTicketCategory = validCategories.includes(category)
      ? category
      : 'other';

    const newTicket = privateDb.createSupportTicket({
      userId: user.user_id,
      subject: subject.trim(),
      category: effectiveCategory,
      description: description.trim(),
      screenshotUrl: screenshotUrl || undefined,
      relatedTemplateId: relatedTemplateId || undefined,
      relatedAttemptId: relatedAttemptId || undefined,
    });

    return NextResponse.json(
      {
        ticket: newTicket,
        message: 'Support ticket submitted successfully.',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to submit ticket' },
      { status: 500 }
    );
  }
}
