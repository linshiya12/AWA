import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';
import { triggerLanguageTranslationJob } from '@/lib/server/ai/backgroundTranslation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/languages/[id]/retry — Safe retry of failed/pending translations without duplicate rows
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: languageId } = await context.params;
  const lang = publicDb.getLanguages().find((l) => l.language_id === languageId);

  if (!lang) {
    return NextResponse.json({ error: `Language '${languageId}' not found` }, { status: 404 });
  }

  try {
    const updatedProgress = await triggerLanguageTranslationJob(languageId, auth.adminUser.user_id, {
      retryOnlyFailed: true,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'retry_language_translation',
      'language',
      languageId,
      null,
      { progress: updatedProgress }
    );

    return NextResponse.json({
      message: `Retrying translation job for language '${lang.name}' (${languageId})`,
      languageId,
      progress: updatedProgress,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to retry language translation' },
      { status: 500 }
    );
  }
}
