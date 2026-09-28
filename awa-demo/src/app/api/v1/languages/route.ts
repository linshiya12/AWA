import { NextResponse } from 'next/server';
import { publicDb } from '@/lib/server/db/publicStore';

// GET /api/v1/languages — Public endpoint listing enabled display languages (07 §4.8, FEAT-039)
export async function GET() {
  const allLanguages = publicDb.getLanguages();
  const enabledLanguages = allLanguages.filter((l) => l.is_enabled);

  return NextResponse.json({
    languages: enabledLanguages,
    defaultLanguage: allLanguages.find((l) => l.is_default)?.language_id || 'en',
  });
}
