import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// POST /api/v1/admin/commerce/test-connection — Test payment gateway credentials (11-UI-UX A7, 13 §10)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const result = privateDb.testPaymentConnection();
  return NextResponse.json(result);
}
