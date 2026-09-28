import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { triggerLanguageTranslationJob } from '@/lib/server/ai/backgroundTranslation';

// GET /api/v1/admin/languages — List configured languages with translation progress (API-040, FEAT-039)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const languages = publicDb.getLanguages();
  const allProgress = privateDb.getAllLanguageProgress();

  const languagesWithProgress = languages.map((lang) => ({
    ...lang,
    progress: allProgress[lang.language_id] || privateDb.getLanguageProgress(lang.language_id),
  }));

  return NextResponse.json({
    languages: languagesWithProgress,
    totalLanguages: languages.length,
    defaultLanguage: languages.find((l) => l.is_default)?.language_id || 'en',
  });
}

// POST /api/v1/admin/languages — Add a new language & automatically start translation (API-040, FEAT-039)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.language_id || !body.name) {
      return NextResponse.json({ error: 'language_id (code) and name are required' }, { status: 400 });
    }

    const lang = publicDb.addLanguage(body.language_id.trim().toLowerCase(), body.name.trim());

    // When an admin adds and enables a new language, automatically start a background translation job
    // for every published template's current prompts.
    let initialProgress = null;
    if (lang.is_enabled && !lang.is_default) {
      initialProgress = await triggerLanguageTranslationJob(lang.language_id, auth.adminUser.user_id);
    }

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'add_language',
      'language',
      lang.language_id,
      null,
      { ...lang, translation_job_triggered: lang.is_enabled && !lang.is_default }
    );

    const progressObj = initialProgress || privateDb.getLanguageProgress(lang.language_id);
    return NextResponse.json(
      {
        language: {
          ...lang,
          progress: progressObj,
        },
        backgroundJobTriggered: lang.is_enabled && !lang.is_default,
        progress: progressObj,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to add language' }, { status: 400 });
  }
}

// PATCH /api/v1/admin/languages — Enable/disable or set default (API-040, Rule 18)
export async function PATCH(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.language_id) {
      return NextResponse.json({ error: 'language_id is required' }, { status: 400 });
    }

    const updated = publicDb.updateLanguage(body.language_id, {
      is_enabled: body.is_enabled,
      is_default: body.is_default,
    });

    // If language was just enabled and is non-default, ensure background translation is triggered
    if (body.is_enabled === true && !updated.is_default) {
      triggerLanguageTranslationJob(updated.language_id, auth.adminUser.user_id).catch(() => {});
    }

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_language',
      'language',
      body.language_id,
      null,
      updated as unknown as Record<string, unknown>
    );

    const allProgress = privateDb.getAllLanguageProgress();
    const languagesWithProgress = publicDb.getLanguages().map((lang) => ({
      ...lang,
      progress: allProgress[lang.language_id] || privateDb.getLanguageProgress(lang.language_id),
    }));

    return NextResponse.json({
      language: {
        ...updated,
        progress: privateDb.getLanguageProgress(updated.language_id),
      },
      languages: languagesWithProgress,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update language' }, { status: 400 });
  }
}
