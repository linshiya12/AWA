import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/admin/support/counts
 * Returns fast summary counts for sidebar badge and top status cards.
 */
export async function GET(request: NextRequest) {
  try {
    const counts = privateDb.getSupportSummaryCounts();
    return NextResponse.json({ counts });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch counts' },
      { status: 500 }
    );
  }
}
