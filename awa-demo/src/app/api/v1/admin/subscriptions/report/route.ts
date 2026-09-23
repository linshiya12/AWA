import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/subscriptions/report — Computed subscription metrics and plan breakdown
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all';
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;

  try {
    const report = privateDb.getSubscriptionReport({
      period,
      fromDate: from,
      toDate: to,
    });

    return NextResponse.json({ report });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to generate subscription report' },
      { status: 500 }
    );
  }
}
