import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ stepId: string }>;
}

// DELETE /api/v1/admin/guidance/steps/[stepId]/image — Remove image from step (API-025, 07 §4.7)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { stepId } = await context.params;
  const existing = publicDb.getGuidanceStepById(stepId);

  if (!existing) {
    return NextResponse.json({ error: 'Guidance step not found' }, { status: 404 });
  }

  const previousMediaId = existing.media_id;
  const previousImageUrl = existing.image_url;

  const result = publicDb.removeStepImage(stepId);
  if (!result.success || !result.step) {
    return NextResponse.json({ error: 'Failed to remove image from guidance step' }, { status: 400 });
  }

  // Follow project media retention rules (07-DATABASE.md §4.7 & §14)
  // Check if previous media asset is referenced elsewhere before determining status
  let retentionNotice = 'No media was attached';
  if (previousMediaId) {
    const refs = publicDb.getMediaReferenceCount(previousMediaId);
    if (refs.total > 0) {
      retentionNotice = `Underlying media asset retained: currently referenced by ${refs.total} catalog item(s).`;
    } else {
      retentionNotice = 'Underlying media asset dereferenced and retained in asset library per retention rules.';
    }
  }

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'remove_guidance_step_image',
    'guidance_step',
    stepId,
    { previousMediaId, previousImageUrl },
    { imageRemoved: true, retentionNotice }
  );

  return NextResponse.json({
    success: true,
    step: {
      ...result.step,
      media: null,
      image_url: null,
      image_alt: null,
    },
    retention_notice: retentionNotice,
  });
}
