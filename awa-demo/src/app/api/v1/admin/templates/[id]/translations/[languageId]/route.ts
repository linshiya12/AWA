import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { findTemplate } from '@/lib/mockData';

interface RouteContext {
  params: Promise<{ id: string; languageId: string }>;
}

// GET /api/v1/admin/templates/[id]/translations/[languageId]
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: templateId, languageId } = await context.params;
  const versions = privateDb.getVersionsForTemplate(templateId);
  const currentVer = versions.find((v) => v.is_current) || versions[0];

  const translation = privateDb.getPromptTranslation(templateId, languageId, currentVer?.version_id);
  if (!translation) {
    return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
  }

  return NextResponse.json({ translation });
}

// PUT /api/v1/admin/templates/[id]/translations/[languageId] — Review and correct translation (FEAT-039)
export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: templateId, languageId } = await context.params;
  const versions = privateDb.getVersionsForTemplate(templateId);
  let currentVer = versions.find((v) => v.is_current) || versions[0];

  if (!currentVer) {
    const catalogMatch = findTemplate(templateId);
    if (catalogMatch) {
      const created = privateDb.createPromptVersion(
        templateId,
        catalogMatch.template.basePrompt,
        'Initial version',
        auth.adminUser.user_id,
        true,
        catalogMatch.template.uiPrompt,
        catalogMatch.template.contextPrompt
      );
      currentVer = created.version;
    } else {
      return NextResponse.json({ error: 'Template has no prompt versions' }, { status: 404 });
    }
  }

  try {
    const body = await request.json();
    const existing = privateDb.getPromptTranslation(templateId, languageId, currentVer.version_id);

    let updated;
    if (existing) {
      updated = privateDb.updatePromptTranslation(
        existing.translation_id,
        {
          ui_prompt_translated: body.ui_prompt_translated !== undefined ? body.ui_prompt_translated : existing.ui_prompt_translated,
          context_prompt_translated: body.context_prompt_translated !== undefined ? body.context_prompt_translated : existing.context_prompt_translated,
          prompt_text_translated: body.prompt_text_translated !== undefined ? body.prompt_text_translated : existing.prompt_text_translated,
          review_status: body.review_status || 'reviewed',
          status: 'completed',
          reviewed_at: new Date().toISOString(),
          reviewed_by: auth.adminUser.user_id,
        },
        auth.adminUser.user_id
      );
    } else {
      updated = privateDb.savePromptTranslation({
        template_id: templateId,
        version_id: currentVer.version_id,
        version_number: currentVer.version_number,
        language_id: languageId,
        ui_prompt_source: currentVer.ui_prompt,
        context_prompt_source: currentVer.context_prompt,
        prompt_text_source: currentVer.prompt_text,
        ui_prompt_translated: body.ui_prompt_translated || null,
        context_prompt_translated: body.context_prompt_translated || null,
        prompt_text_translated: body.prompt_text_translated || '',
        status: 'completed',
        review_status: body.review_status || 'reviewed',
      });
    }

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'review_correct_translation',
      'prompt_translation',
      updated.translation_id,
      null,
      { template_id: templateId, language_id: languageId, review_status: updated.review_status }
    );

    return NextResponse.json({ translation: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to update translation' },
      { status: 400 }
    );
  }
}
