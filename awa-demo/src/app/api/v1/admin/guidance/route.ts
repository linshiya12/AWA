import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/guidance — Get guidance for scope (API-025, FEAT-036)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const scopeType = searchParams.get('scope_type') as 'category' | 'template' | null;
  const scopeId = searchParams.get('scope_id');

  if (!scopeType || !scopeId) {
    return NextResponse.json({ error: 'scope_type and scope_id are required' }, { status: 400 });
  }

  const guidance = publicDb.getGuidanceForScope(scopeType, scopeId);
  return NextResponse.json({ guidance });
}

// POST /api/v1/admin/guidance — Save guidance and steps (API-025, FEAT-036)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.scope_type || !body.scope_id || !Array.isArray(body.steps)) {
      return NextResponse.json(
        { error: 'scope_type, scope_id, and steps array are required' },
        { status: 400 }
      );
    }

    const guidance = publicDb.saveGuidance(
      body.scope_type,
      body.scope_id,
      body.presentation || 'written',
      body.steps
    );

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'save_guidance',
      'guidance',
      guidance.guidance_id,
      null,
      { scope_type: body.scope_type, scope_id: body.scope_id, stepsCount: body.steps.length }
    );

    return NextResponse.json({ guidance });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to save guidance' }, { status: 400 });
  }
}
