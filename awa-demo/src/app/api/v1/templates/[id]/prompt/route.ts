import { NextRequest, NextResponse } from 'next/server';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { resolveUserFromRequest } from '@/lib/server/auth';
import { findTemplate } from '@/lib/mockData';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/templates/[id]/prompt — Deliver prompt text and guidance steps (API-003, 07 §6.1, 08-API.md)
// Enforces protected delivery boundary: prompt text is never exposed in public catalog payloads
export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  // 1. Locate template in Public DB or Mock Catalog fallback
  const publicTemplate = publicDb.getTemplateById(id);
  const catalogMatch = findTemplate(id);

  if (!publicTemplate && !catalogMatch) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const isSample = publicTemplate?.is_sample ?? false;

  // 2. Resolve User & Verify Subscription Entitlement
  const user = resolveUserFromRequest(request);
  const isSubscriberHeader = request.headers.get('x-awa-subscribed') === 'true';
  const isSubscriberCookie = request.cookies.get('awa_subscribed')?.value === 'true';
  const isExplicitAdmin = request.headers.get('x-awa-role') === 'admin' || request.cookies.get('awa_role')?.value === 'admin';
  const isAdminUser = user?.role === 'administrator';
  const hasDbActiveSubscription = Boolean(
    user && privateDb.getSubscriptions({ status: 'active' }).some((s) => s.user_id === user.user_id)
  );

  // Subscribed users or explicit admins only
  const isEntitled = isSubscriberHeader || isSubscriberCookie || isExplicitAdmin || isAdminUser || hasDbActiveSubscription;

  if (!isEntitled) {
    return NextResponse.json(
      {
        error: 'Active subscription required to access full prompt',
        code: 'SUBSCRIPTION_REQUIRED',
        templateId: id,
        isSample: false,
      },
      { status: 403 }
    );
  }

  // 3. Parse optional customization payload
  let body: {
    is_customized?: boolean;
    parent_delivered_prompt_id?: string;
    prompt_text?: string;
    ui_prompt?: string;
    context_prompt?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  const userId = user?.user_id || 'usr-anonymous-visitor';

  const requestedLang =
    request.nextUrl.searchParams.get('lang') ||
    request.headers.get('x-awa-language') ||
    request.cookies.get('awa_lang')?.value ||
    user?.preferred_language_id ||
    'en';

  // 4. Retrieve or synthesize prompt content
  try {
    let delivered;
    const versions = privateDb.getVersionsForTemplate(id);

    if (versions.length > 0) {
      delivered = privateDb.deliverPrompt(
        userId,
        id,
        body.is_customized || false,
        body.parent_delivered_prompt_id || null,
        body.prompt_text,
        body.ui_prompt,
        body.context_prompt,
        requestedLang
      );
    } else if (catalogMatch) {
      // Fallback to rich catalog template data
      delivered = {
        delivered_prompt_id: `dp-cat-${Date.now()}`,
        user_id: userId,
        template_id: id,
        base_version_id: 'ver-catalog-1',
        prompt_text: body.prompt_text || catalogMatch.template.basePrompt,
        ui_prompt: body.ui_prompt || catalogMatch.template.uiPrompt || null,
        context_prompt: body.context_prompt || catalogMatch.template.contextPrompt || null,
        is_customized: body.is_customized || false,
        parent_delivered_prompt_id: body.parent_delivered_prompt_id || null,
        delivered_at: new Date().toISOString(),
        language_id: 'en',
        is_fallback: requestedLang !== 'en',
        fallback_language: requestedLang !== 'en' ? 'en' : undefined,
      };
    } else {
      return NextResponse.json({ error: 'No prompt available for this template' }, { status: 404 });
    }

    const finalUiPrompt = delivered.ui_prompt || catalogMatch?.template.uiPrompt || null;
    const finalContextPrompt = delivered.context_prompt || catalogMatch?.template.contextPrompt || null;

    const publicGuidance = publicDb.getGuidanceForScope('template', id);
    let resolvedGuidance = catalogMatch?.template.guidance || [];

    if (publicGuidance && publicGuidance.steps.length > 0) {
      // If publicGuidance is directly assigned to this template, use it (enables admin edits)
      if (!publicGuidance.isInherited) {
        resolvedGuidance = publicGuidance.steps.map((s, idx) => ({
          step: s.position || idx + 1,
          title: s.title || `Step ${s.position || idx + 1}`,
          description: s.instruction,
          image: s.image_url || (s.media ? s.media.storage_reference : '') || '/images/guidance/tpl_1/step-1.svg',
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : `Guidance step ${s.position || idx + 1}`),
          media_id: s.media_id || null,
          tip: s.tip || undefined,
          text: s.instruction,
        }));
      } else if (!resolvedGuidance || resolvedGuidance.length === 0) {
        // Only fall back to inherited category guidance if template-specific guidance is completely absent
        resolvedGuidance = publicGuidance.steps.map((s, idx) => ({
          step: s.position || idx + 1,
          title: s.title || `Step ${s.position || idx + 1}`,
          description: s.instruction,
          image: s.image_url || (s.media ? s.media.storage_reference : '') || '/images/guidance/tpl_1/step-1.svg',
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : `Guidance step ${s.position || idx + 1}`),
          media_id: s.media_id || null,
          tip: s.tip || undefined,
          text: s.instruction,
        }));
      }
    }

    return NextResponse.json({
      deliveredPromptId: delivered.delivered_prompt_id,
      promptText: delivered.prompt_text,
      uiPrompt: finalUiPrompt,
      contextPrompt: finalContextPrompt,
      guidance: resolvedGuidance,
      versionId: delivered.base_version_id,
      isSample,
      isCustomized: delivered.is_customized,
      languageId: delivered.language_id || 'en',
      isFallback: delivered.is_fallback ?? false,
      fallbackLanguage: delivered.fallback_language,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to deliver prompt' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return POST(request, context);
}

