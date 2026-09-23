import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/audit — Administrative audit log entries (API-030, NFR-016)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entity_type') || undefined;
  const action = searchParams.get('action') || undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

  const logs = privateDb.getAuditLogs({
    entity_type: entityType,
    action,
    limit,
  });

  return NextResponse.json({ logs });
}
