import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ stepId: string }>;
}

// GET /api/v1/admin/guidance/steps/[stepId] — Get step details with image metadata (API-025, FEAT-036)
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { stepId } = await context.params;
  const step = publicDb.getGuidanceStepById(stepId);

  if (!step) {
    return NextResponse.json({ error: 'Guidance step not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    step: {
      ...step,
      image_url: step.image_url || (step.media ? step.media.storage_reference : null),
      image_alt: step.image_alt || null,
      media: step.media || null,
    },
  });
}

// PUT /api/v1/admin/guidance/steps/[stepId] — Update step text, order, and image association / replace image (API-025)
export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { stepId } = await context.params;
  const existing = publicDb.getGuidanceStepById(stepId);
  if (!existing) {
    return NextResponse.json({ error: 'Guidance step not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.instruction !== undefined) updates.instruction = String(body.instruction);
    if (body.title !== undefined) updates.title = String(body.title);
    if (body.tip !== undefined) updates.tip = String(body.tip);
    if (typeof body.position === 'number') updates.position = body.position;

    // Image association & replacement
    if (body.media_id !== undefined) updates.media_id = body.media_id || null;
    if (body.image_url !== undefined) updates.image_url = body.image_url || null;
    if (body.image_alt !== undefined) updates.image_alt = body.image_alt || null;

    const updated = publicDb.updateGuidanceStep(stepId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update step' }, { status: 400 });
    }

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_guidance_step',
      'guidance_step',
      stepId,
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      step: {
        ...updated,
        image_url: updated.image_url || (updated.media ? updated.media.storage_reference : null),
        image_alt: updated.image_alt || null,
        media: updated.media || null,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update guidance step' },
      { status: 400 }
    );
  }
}

// DELETE /api/v1/admin/guidance/steps/[stepId] — Delete step without leaving broken references (API-025, 07 §4.7)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { stepId } = await context.params;
  const existing = publicDb.getGuidanceStepById(stepId);
  if (!existing) {
    return NextResponse.json({ error: 'Guidance step not found' }, { status: 404 });
  }

  const result = publicDb.deleteGuidanceStep(stepId);
  if (!result.success) {
    return NextResponse.json({ error: 'Failed to delete guidance step' }, { status: 400 });
  }

  // Follow media retention: check whether the deleted step's image is used elsewhere
  let mediaStatus = 'none';
  if (existing.media_id) {
    const refs = publicDb.getMediaReferenceCount(existing.media_id);
    mediaStatus = refs.total > 0
      ? `Retained (in use by ${refs.total} other catalog item(s))`
      : 'Retained per administrative media retention policy';
  }

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'delete_guidance_step',
    'guidance_step',
    stepId,
    existing as unknown as Record<string, unknown>,
    { remainingStepsCount: result.remainingSteps.length, mediaStatus }
  );

  return NextResponse.json({
    success: true,
    deleted_step_id: stepId,
    media_status: mediaStatus,
    remaining_steps: result.remainingSteps,
  });
}
