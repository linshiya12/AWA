import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/commerce — Plans, credit packs, write-only payment config, spend cap (API-028, FEAT-042, FEAT-043)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const data = privateDb.getCommerceOverview();
  return NextResponse.json(data);
}

// PATCH /api/v1/admin/commerce — Update plans, packs, payment config, or spend cap (API-028)
export async function PATCH(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();

    if (body.plan_id && body.plan_updates) {
      privateDb.updatePlan(body.plan_id, body.plan_updates, auth.adminUser.user_id);
    }

    if (body.pack_id && body.pack_updates) {
      privateDb.updateCreditPack(body.pack_id, body.pack_updates, auth.adminUser.user_id);
    }

    if (body.payment_config) {
      privateDb.updatePaymentConfiguration(body.payment_config, auth.adminUser.user_id);
    }

    if (body.spend_cap_limit !== undefined) {
      privateDb.updateSpendCap(Number(body.spend_cap_limit), auth.adminUser.user_id);
    }

    return NextResponse.json({
      message: 'Commerce configuration updated successfully.',
      data: privateDb.getCommerceOverview(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update commerce' }, { status: 400 });
  }
}
