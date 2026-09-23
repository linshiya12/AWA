import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/users/[id]/adjustments — Support adjustments for credits/access (API-027, FEAT-041)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const credits = Number(body.credit_amount) || 0;
    const reason = body.reason;

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'An explicit reason is mandatory for any support adjustment (FEAT-041).' },
        { status: 400 }
      );
    }

    if (credits === 0) {
      return NextResponse.json(
        { error: 'Credit adjustment amount cannot be zero.' },
        { status: 400 }
      );
    }

    const result = privateDb.adjustUserAllowance(id, credits, reason.trim(), auth.adminUser.user_id);

    return NextResponse.json({
      message: `Adjusted allowance by ${credits > 0 ? '+' : ''}${credits} credits.`,
      user: result.user,
      ledgerEntry: result.ledgerEntry,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to apply adjustment' }, { status: 400 });
  }
}
