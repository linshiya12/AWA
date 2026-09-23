import { NextRequest, NextResponse } from 'next/server';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { resolveUserFromRequest } from '@/lib/server/auth';
import { findTemplate } from '@/lib/mockData';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/templates/[id]/prompt — Deliver prompt text (API-003, 07 §6.1, 08-API.md)
// Enforces protected delivery boundary: prompt text is never exposed in public catalog payloads
export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  // 1. Locate template in Public DB or Mock Catalog fallback
  const publicTemplate = publicDb.getTemplateById(id);
  const catalogMatch = findTemplate(id);

  if (!publicTemplate && !catalogMatch) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const isSample = publicTemplate?.is_sample ?? (catalogMatch?.template.id === 'tpl_web_1' || catalogMatch?.template.id === 'tpl_web_bakery' || catalogMatch?.template.id === 'tpl_1');

  // 2. Resolve User & Verify Subscription Entitlement
  const user = resolveUserFromRequest(request);
  const isSubscriberHeader = request.headers.get('x-awa-subscribed') === 'true';
  const isSubscriberCookie = request.cookies.get('awa_subscribed')?.value === 'true';
  const isAdmin = user?.role === 'administrator';

  // Sample templates are accessible without subscription (05-MVP.md §3.3)
  const isEntitled = isSample || isAdmin || isSubscriberHeader || isSubscriberCookie;

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
        body.context_prompt
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
      };
    } else {
      return NextResponse.json({ error: 'No prompt available for this template' }, { status: 404 });
    }

    return NextResponse.json({
      deliveredPromptId: delivered.delivered_prompt_id,
      promptText: delivered.prompt_text,
      uiPrompt: delivered.ui_prompt,
      contextPrompt: delivered.context_prompt,
      versionId: delivered.base_version_id,
      isSample,
      isCustomized: delivered.is_customized,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to deliver prompt' },
      { status: 500 }
    );
  }
}
