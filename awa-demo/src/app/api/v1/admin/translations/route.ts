import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/translations — List translations (API-041, FEAT-039)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entity_type') || undefined;
  const entityId = searchParams.get('entity_id') || undefined;
  const languageId = searchParams.get('language_id') || undefined;

  const translations = publicDb.getTranslations(entityType, entityId, languageId);
  return NextResponse.json({ translations });
}

// POST /api/v1/admin/translations — Set field translation (API-041, FEAT-039)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.language_id || !body.entity_type || !body.entity_id || !body.field_name || body.translated_text === undefined) {
      return NextResponse.json(
        { error: 'language_id, entity_type, entity_id, field_name, and translated_text are required' },
        { status: 400 }
      );
    }

    const translation = publicDb.setTranslation({
      language_id: body.language_id,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      field_name: body.field_name,
      translated_text: body.translated_text,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'set_translation',
      'translation',
      translation.translation_id,
      null,
      translation as unknown as Record<string, unknown>
    );

    return NextResponse.json({ translation });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to set translation' }, { status: 400 });
  }
}
