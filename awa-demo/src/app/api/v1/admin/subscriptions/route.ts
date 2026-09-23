import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/subscriptions — List, search, and filter subscriptions
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const plan = searchParams.get('plan') || undefined;
  const status = searchParams.get('status') || undefined;
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;

  try {
    const subscriptions = privateDb.getSubscriptions({
      searchQuery: search,
      planId: plan,
      status: status,
      fromDate: from,
      toDate: to,
    });

    const commerce = privateDb.getCommerceOverview();
    const users = privateDb.getUsers();

    return NextResponse.json({
      subscriptions,
      available_plans: commerce.plans,
      users: users.map((u) => ({
        user_id: u.user_id,
        email: u.email,
        display_name: u.display_name,
        allowance_balance: u.allowance_balance,
        status: u.status,
      })),
      total_count: subscriptions.length,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST /api/v1/admin/subscriptions — Grant new subscription to user
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    const { userId, planId, customEndsAt, initialAllowance, reason } = body;

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'userId and planId are required' },
        { status: 400 }
      );
    }

    const subscription = privateDb.grantSubscription(
      {
        userId,
        planId,
        customEndsAt,
        initialAllowance,
        reason,
      },
      auth.adminUser.user_id
    );

    return NextResponse.json({
      message: 'Subscription granted successfully',
      subscription,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to grant subscription' },
      { status: 400 }
    );
  }
}
