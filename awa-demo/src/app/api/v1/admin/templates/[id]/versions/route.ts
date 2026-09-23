import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/v1/admin/templates/[id]/versions — List versions for template (API-022, FEAT-033)
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const versions = privateDb.getVersionsForTemplate(id);
  const currentVersion = versions.find((v) => v.is_current) || null;

  return NextResponse.json({ versions, currentVersion });
}

// POST /api/v1/admin/templates/[id]/versions — Author/revise prompt (API-022, FEAT-032, FEAT-037)
// Enforces TWO-STEP WRITE: Writes to Private DB first, then updates Public DB (06 §5.4, 08 Rule 16)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    let promptText = body.prompt_text;

    if (!promptText && (body.ui_prompt || body.context_prompt)) {
      promptText = [
        body.ui_prompt ? `[UI & IMPLEMENTATION PROMPT]\n${body.ui_prompt}` : '',
        body.context_prompt ? `[BUSINESS CONTEXT PROMPT]\n${body.context_prompt}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    if (!promptText || promptText.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    const publishImmediately = body.publish === true;
    const result = privateDb.createPromptVersion(
      id,
      promptText,
      body.change_note || '',
      auth.adminUser.user_id,
      publishImmediately,
      body.ui_prompt || null,
      body.context_prompt || null
    );

    return NextResponse.json(
      {
        version: result.version,
        published: result.published,
        template: publicDb.getTemplateById(id),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to save prompt version' }, { status: 400 });
  }
}
