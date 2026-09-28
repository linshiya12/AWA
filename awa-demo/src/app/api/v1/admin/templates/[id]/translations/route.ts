import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { findTemplate } from '@/lib/mockData';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/v1/admin/templates/[id]/translations — List translations for a template with source comparison
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: templateId } = await context.params;
  const template = publicDb.getTemplateById(templateId);
  const catalogMatch = findTemplate(templateId);

  if (!template && !catalogMatch) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const versions = privateDb.getVersionsForTemplate(templateId);
  const currentVersion = versions.find((v) => v.is_current) || versions[0] || null;

  // Fallback to catalog prompts if no version exists
  const sourcePrompts = {
    version_id: currentVersion?.version_id || 'ver-catalog',
    version_number: currentVersion?.version_number || 1,
    prompt_text: currentVersion?.prompt_text || catalogMatch?.template.basePrompt || '',
    ui_prompt: currentVersion?.ui_prompt || catalogMatch?.template.uiPrompt || null,
    context_prompt: currentVersion?.context_prompt || catalogMatch?.template.contextPrompt || null,
  };

  const configuredLanguages = publicDb.getLanguages();
  const translations = privateDb.getPromptTranslations({ template_id: templateId });

  // Map each non-default language to its translation state against current version
  const languageTranslations = configuredLanguages
    .filter((l) => !l.is_default)
    .map((lang) => {
      const trans = translations.find(
        (t) => t.language_id === lang.language_id && (currentVersion ? t.version_id === currentVersion.version_id : true)
      );

      return {
        language_id: lang.language_id,
        language_name: lang.name,
        is_enabled: lang.is_enabled,
        translation_id: trans?.translation_id || null,
        version_id: trans?.version_id || sourcePrompts.version_id,
        version_number: trans?.version_number || sourcePrompts.version_number,
        status: trans?.status || 'pending',
        review_status: trans?.review_status || 'draft',
        ui_prompt_source: sourcePrompts.ui_prompt,
        ui_prompt_translated: trans?.ui_prompt_translated || null,
        context_prompt_source: sourcePrompts.context_prompt,
        context_prompt_translated: trans?.context_prompt_translated || null,
        prompt_text_source: sourcePrompts.prompt_text,
        prompt_text_translated: trans?.prompt_text_translated || null,
        error_message: trans?.error_message || null,
        service_cost: trans?.service_cost || null,
        updated_at: trans?.updated_at || null,
        reviewed_at: trans?.reviewed_at || null,
        reviewed_by: trans?.reviewed_by || null,
      };
    });

  return NextResponse.json({
    templateId,
    templateName: template?.name || catalogMatch?.template.title || 'Template',
    sourcePrompts,
    languages: languageTranslations,
    translations: languageTranslations,
  });
}
