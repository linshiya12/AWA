import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/reports — Usage, feedback by version & customization, demand signal, cost vs limit, content gaps (API-029)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const reports = privateDb.getReports();
  return NextResponse.json(reports);
}
