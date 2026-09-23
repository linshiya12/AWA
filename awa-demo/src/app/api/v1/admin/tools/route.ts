import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/tools — List all external AI tools (API-023)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const tools = publicDb.getTools();
  return NextResponse.json({ tools });
}

// POST /api/v1/admin/tools — Create external AI tool (API-023, FEAT-034)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.name || !body.destination || !body.reasoning) {
      return NextResponse.json(
        { error: 'name, destination URL, and reasoning line are required (FEAT-016)' },
        { status: 400 }
      );
    }

    const tool = publicDb.createTool({
      name: body.name.trim(),
      destination: body.destination.trim(),
      reasoning: body.reasoning.trim(),
      pricing_note: body.pricing_note || '',
      quality_note: body.quality_note || '',
      logo_media_id: body.logo_media_id || null,
      is_available: body.is_available ?? true,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_ai_tool',
      'ai_tool',
      tool.tool_id,
      null,
      tool as unknown as Record<string, unknown>
    );

    return NextResponse.json({ tool }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to create tool' }, { status: 400 });
  }
}
