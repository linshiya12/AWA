import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// POST /api/v1/admin/guidance/steps — Create a guidance step (API-025, FEAT-036)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    let guidanceId = body.guidance_id;

    // If guidance_id not directly provided, locate or initialize via scope_type and scope_id
    if (!guidanceId && body.scope_type && body.scope_id) {
      const existing = publicDb.getGuidanceForScope(body.scope_type, body.scope_id);
      if (existing && !existing.isInherited) {
        guidanceId = existing.guidance_id;
      } else {
        const saved = publicDb.saveGuidance(
          body.scope_type,
          body.scope_id,
          body.presentation || 'written',
          []
        );
        guidanceId = saved.guidance_id;
      }
    }

    if (!guidanceId) {
      return NextResponse.json(
        { error: 'guidance_id or (scope_type and scope_id) is required' },
        { status: 400 }
      );
    }

    if (!body.instruction || typeof body.instruction !== 'string' || !body.instruction.trim()) {
      return NextResponse.json(
        { error: 'instruction is required and must not be empty' },
        { status: 400 }
      );
    }

    const step = publicDb.createGuidanceStep(guidanceId, {
      instruction: body.instruction.trim(),
      title: body.title?.trim() || undefined,
      tip: body.tip?.trim() || undefined,
      media_id: body.media_id || null,
      image_url: body.image_url || null,
      image_alt: body.image_alt?.trim() || null,
      position: typeof body.position === 'number' ? body.position : undefined,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_guidance_step',
      'guidance_step',
      step.step_id,
      null,
      { guidance_id: guidanceId, position: step.position, hasImage: Boolean(step.image_url || step.media_id) }
    );

    return NextResponse.json({ success: true, step }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to create guidance step' },
      { status: 400 }
    );
  }
}

// PUT /api/v1/admin/guidance/steps — Bulk reorder guidance steps (API-025, FEAT-036)
export async function PUT(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.guidance_id || !Array.isArray(body.ordered_step_ids)) {
      return NextResponse.json(
        { error: 'guidance_id and ordered_step_ids array are required' },
        { status: 400 }
      );
    }

    const updatedSteps = publicDb.reorderGuidanceSteps(body.guidance_id, body.ordered_step_ids);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'reorder_guidance_steps',
      'guidance',
      body.guidance_id,
      null,
      { stepsCount: updatedSteps.length, ordered_step_ids: body.ordered_step_ids }
    );

    return NextResponse.json({ success: true, steps: updatedSteps });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to reorder guidance steps' },
      { status: 400 }
    );
  }
}
