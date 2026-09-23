import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/v1/admin/tools/[id]/models — List model variants for tool (API-023)
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const models = publicDb.getModelsForTool(id);
  return NextResponse.json({ models });
}

// POST /api/v1/admin/tools/[id]/models — Add model variant (API-023, FEAT-034)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const tool = publicDb.getToolById(id);
  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const model = publicDb.createModel({
      tool_id: id,
      name: body.name.trim(),
      is_available: body.is_available ?? true,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_ai_model',
      'ai_model',
      model.model_id,
      null,
      model as unknown as Record<string, unknown>
    );

    return NextResponse.json({ model }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to add model' }, { status: 400 });
  }
}

// PATCH /api/v1/admin/tools/[id]/models — Update model variant (API-023)
export async function PATCH(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.model_id) {
      return NextResponse.json({ error: 'model_id is required' }, { status: 400 });
    }

    const updated = publicDb.updateModel(body.model_id, {
      name: body.name,
      is_available: body.is_available,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json({ model: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update model' }, { status: 400 });
  }
}
