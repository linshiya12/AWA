import { publicDb } from '../db/publicStore';
import { privateDb } from '../db/privateStore';
import { translatePromptContent } from './translationService';
import { TemplatePromptTranslation, LanguageTranslationProgress } from '../types';
import { findTemplate } from '@/lib/mockData';

// Tracks running background tasks to prevent overlapping runs on the same language
const runningJobs = new Set<string>();

/**
 * Automatically starts a background translation job for every published template's
 * current prompts when a language is added & enabled (or retried).
 *
 * Requirements Met:
 * - Translates UI Prompt and Context Prompt separately
 * - Stores results against template, version, and language
 * - Safe to retry without creating duplicates
 * - Failure for one template does not stop remaining templates
 * - Accurate progress tracking (total, completed, pending, failed)
 * - Never reports language as complete while any template is pending or failed
 */
export async function triggerLanguageTranslationJob(
  languageId: string,
  actorId: string = 'usr-admin-1',
  options?: { retryOnlyFailed?: boolean }
): Promise<LanguageTranslationProgress> {
  const publishedTemplates = publicDb.getPublishedTemplates();

  // 1. Initialize or mark templates as pending
  for (const tpl of publishedTemplates) {
    let versions = privateDb.getVersionsForTemplate(tpl.template_id);
    let currentVer = versions.find((v) => v.is_current) || versions[0];

    // If template has no private version row yet, initialize version 1 from mock catalog
    if (!currentVer) {
      const catalogMatch = findTemplate(tpl.template_id);
      const promptText = catalogMatch?.template.basePrompt || 'High quality cinematic prompt --ar 16:9 --v 6.1';
      const uiPrompt = catalogMatch?.template.uiPrompt || null;
      const contextPrompt = catalogMatch?.template.contextPrompt || null;

      const created = privateDb.createPromptVersion(
        tpl.template_id,
        promptText,
        'Initial published baseline prompt',
        actorId,
        true,
        uiPrompt,
        contextPrompt
      );
      currentVer = created.version;
    }

    const existingTrans = privateDb.getPromptTranslation(tpl.template_id, languageId, currentVer.version_id);

    if (options?.retryOnlyFailed) {
      if (existingTrans && (existingTrans.status === 'failed' || existingTrans.status === 'pending')) {
        privateDb.savePromptTranslation({
          template_id: tpl.template_id,
          version_id: currentVer.version_id,
          version_number: currentVer.version_number,
          language_id: languageId,
          ui_prompt_source: currentVer.ui_prompt,
          context_prompt_source: currentVer.context_prompt,
          prompt_text_source: currentVer.prompt_text,
          prompt_text_translated: existingTrans.prompt_text_translated || '',
          ui_prompt_translated: existingTrans.ui_prompt_translated || null,
          context_prompt_translated: existingTrans.context_prompt_translated || null,
          status: 'pending',
          review_status: existingTrans.review_status || 'draft',
          error_message: null,
        });
      }
    } else {
      // Normal run: if already completed and valid, keep it; otherwise set pending
      if (!existingTrans || existingTrans.status !== 'completed') {
        privateDb.savePromptTranslation({
          template_id: tpl.template_id,
          version_id: currentVer.version_id,
          version_number: currentVer.version_number,
          language_id: languageId,
          ui_prompt_source: currentVer.ui_prompt,
          context_prompt_source: currentVer.context_prompt,
          prompt_text_source: currentVer.prompt_text,
          prompt_text_translated: existingTrans?.prompt_text_translated || '',
          ui_prompt_translated: existingTrans?.ui_prompt_translated || null,
          context_prompt_translated: existingTrans?.context_prompt_translated || null,
          status: 'pending',
          review_status: existingTrans?.review_status || 'draft',
          error_message: null,
        });
      }
    }
  }

  // 2. Compute initial progress
  const initialProgress = privateDb.getLanguageProgress(languageId);

  // 3. Launch background execution asynchronously
  runBackgroundTranslationLoop(languageId, actorId).catch((err) => {
    console.error(`[BackgroundTranslation] Unexpected error for language ${languageId}:`, err);
  });

  return initialProgress;
}

/**
 * Inner processing loop: translates each template sequentially with complete error isolation.
 * A failure on one template is logged and recorded, and the loop safely proceeds to the next.
 */
async function runBackgroundTranslationLoop(languageId: string, actorId: string): Promise<void> {
  const jobKey = `lang-${languageId}`;
  if (runningJobs.has(jobKey)) {
    return; // Already running
  }
  runningJobs.add(jobKey);

  try {
    const publishedTemplates = publicDb.getPublishedTemplates();

    for (const tpl of publishedTemplates) {
      const versions = privateDb.getVersionsForTemplate(tpl.template_id);
      const currentVer = versions.find((v) => v.is_current) || versions[0];
      if (!currentVer) continue;

      const trans = privateDb.getPromptTranslation(tpl.template_id, languageId, currentVer.version_id);
      // Process pending or retrying templates
      if (trans && (trans.status === 'pending' || trans.status === 'failed')) {
        // Mark as actively translating
        privateDb.updatePromptTranslation(trans.translation_id, {
          status: 'translating',
        });

        try {
          // Perform separate translation for UI Prompt and Context Prompt
          const result = await translatePromptContent({
            uiPrompt: currentVer.ui_prompt,
            contextPrompt: currentVer.context_prompt,
            promptText: currentVer.prompt_text,
            targetLanguage: languageId,
            templateId: tpl.template_id,
          });

          // Save completed translation in private store
          privateDb.updatePromptTranslation(trans.translation_id, {
            status: 'completed',
            review_status: trans.review_status === 'published' ? 'published' : 'draft',
            ui_prompt_translated: result.uiPromptTranslated,
            context_prompt_translated: result.contextPromptTranslated,
            prompt_text_translated: result.promptTextTranslated,
            service_cost: result.serviceCost,
            error_message: null,
          }, actorId);
        } catch (err: unknown) {
          // Failure on one template must NOT stop remaining templates!
          const errorMsg = (err as Error).message || 'AI translation failed';
          console.warn(`[BackgroundTranslation] Template ${tpl.template_id} failed for ${languageId}:`, errorMsg);

          privateDb.updatePromptTranslation(trans.translation_id, {
            status: 'failed',
            error_message: errorMsg,
          }, actorId);
        }

        // Brief delay between template calls to respect server scheduling
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    }
  } finally {
    runningJobs.delete(jobKey);
  }
}

/**
 * Translates a single template for a specific language (used for single template retry or trigger)
 */
export async function triggerSingleTemplateTranslation(
  templateId: string,
  languageId: string,
  actorId: string = 'usr-admin-1'
): Promise<TemplatePromptTranslation> {
  const versions = privateDb.getVersionsForTemplate(templateId);
  const currentVer = versions.find((v) => v.is_current) || versions[0];

  if (!currentVer) {
    throw new Error(`No current prompt version found for template ${templateId}`);
  }

  // Create or retrieve existing translation record (Safe retry - no duplicates)
  let trans = privateDb.getPromptTranslation(templateId, languageId, currentVer.version_id);
  if (!trans) {
    trans = privateDb.savePromptTranslation({
      template_id: templateId,
      version_id: currentVer.version_id,
      version_number: currentVer.version_number,
      language_id: languageId,
      ui_prompt_source: currentVer.ui_prompt,
      context_prompt_source: currentVer.context_prompt,
      prompt_text_source: currentVer.prompt_text,
      prompt_text_translated: '',
      status: 'translating',
      review_status: 'draft',
    });
  } else {
    trans = privateDb.updatePromptTranslation(trans.translation_id, {
      status: 'translating',
      error_message: null,
    });
  }

  try {
    const result = await translatePromptContent({
      uiPrompt: currentVer.ui_prompt,
      contextPrompt: currentVer.context_prompt,
      promptText: currentVer.prompt_text,
      targetLanguage: languageId,
      templateId,
    });

    const updated = privateDb.updatePromptTranslation(trans.translation_id, {
      status: 'completed',
      ui_prompt_translated: result.uiPromptTranslated,
      context_prompt_translated: result.contextPromptTranslated,
      prompt_text_translated: result.promptTextTranslated,
      service_cost: result.serviceCost,
      error_message: null,
    }, actorId);

    return updated;
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || 'Translation failed';
    const failedTrans = privateDb.updatePromptTranslation(trans.translation_id, {
      status: 'failed',
      error_message: errorMsg,
    }, actorId);
    throw new Error(errorMsg);
  }
}

/**
 * When a source prompt is revised or a new template is published:
 * Queues translations for all enabled non-default languages.
 */
export async function queueTranslationsForEnabledLanguages(
  templateId: string,
  versionId: string,
  actorId: string = 'usr-admin-1'
): Promise<void> {
  const languages = publicDb.getLanguages().filter((l) => l.is_enabled && !l.is_default);
  const version = privateDb.getVersionById(versionId);
  if (!version) return;

  for (const lang of languages) {
    privateDb.savePromptTranslation({
      template_id: templateId,
      version_id: versionId,
      version_number: version.version_number,
      language_id: lang.language_id,
      ui_prompt_source: version.ui_prompt,
      context_prompt_source: version.context_prompt,
      prompt_text_source: version.prompt_text,
      prompt_text_translated: '',
      status: 'pending',
      review_status: 'draft',
      error_message: null,
    });

    // Run in background
    triggerSingleTemplateTranslation(templateId, lang.language_id, actorId).catch(() => {});
  }
}
