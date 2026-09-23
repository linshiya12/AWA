import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/v1/admin/templates/[id]/versions/preview — Live preview prompt before publish (API-022, 08 §4)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const promptText = body.prompt_text || '';

    const preview = privateDb.previewPrompt(id, promptText);

    return NextResponse.json(preview);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to generate preview' }, { status: 400 });
  }
}
