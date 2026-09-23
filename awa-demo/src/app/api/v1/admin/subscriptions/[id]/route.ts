import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/subscriptions/[id] — Retrieve single subscription with details
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await props.params;
  const subscription = privateDb.getSubscriptionById(id);

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  return NextResponse.json({ subscription });
}

// PATCH /api/v1/admin/subscriptions/[id] — Update state, plan, or extend expiry
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await props.params;

  try {
    const body = await request.json();
    const { state, planId, endsAt, extendMonths, reason } = body;

    const updated = privateDb.updateSubscription(
      id,
      {
        state,
        planId,
        endsAt,
        extendMonths,
        reason,
      },
      auth.adminUser.user_id
    );

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update subscription' },
      { status: 400 }
    );
  }
}
