import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/languages — List configured languages (API-040, FEAT-039)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const languages = publicDb.getLanguages();
  return NextResponse.json({ languages });
}

// POST /api/v1/admin/languages — Add a new language (API-040, FEAT-039)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.language_id || !body.name) {
      return NextResponse.json({ error: 'language_id (code) and name are required' }, { status: 400 });
    }

    const lang = publicDb.addLanguage(body.language_id.trim().toLowerCase(), body.name.trim());

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'add_language',
      'language',
      lang.language_id,
      null,
      lang as unknown as Record<string, unknown>
    );

    return NextResponse.json({ language: lang }, { status: 201 });
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

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_language',
      'language',
      body.language_id,
      null,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({ language: updated, languages: publicDb.getLanguages() });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update language' }, { status: 400 });
  }
}
