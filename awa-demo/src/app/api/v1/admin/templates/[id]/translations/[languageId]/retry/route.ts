import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { triggerSingleTemplateTranslation } from '@/lib/server/ai/backgroundTranslation';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string; languageId: string }>;
}

// POST /api/v1/admin/templates/[id]/translations/[languageId]/retry — Retry a failed or pending translation
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id: templateId, languageId } = await context.params;

  try {
    const updated = await triggerSingleTemplateTranslation(templateId, languageId, auth.adminUser.user_id);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'retry_template_translation',
      'prompt_translation',
      updated.translation_id,
      null,
      { template_id: templateId, language_id: languageId, status: updated.status }
    );

    return NextResponse.json({
      message: `Retried translation for ${templateId} (${languageId})`,
      translation: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to retry translation' },
      { status: 500 }
    );
  }
}
