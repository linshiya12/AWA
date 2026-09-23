import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string; vid: string }>;
}

// POST /api/v1/admin/templates/[id]/versions/[vid]/restore — Restore older prompt version (API-022, 08 §4)
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id, vid } = await context.params;
  const template = publicDb.getTemplateById(id);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  try {
    const newVersion = privateDb.restorePromptVersion(id, vid, auth.adminUser.user_id);

    return NextResponse.json({
      message: `Restored version ${vid} as new version ${newVersion.version_number}`,
      version: newVersion,
      template: publicDb.getTemplateById(id),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to restore version' }, { status: 400 });
  }
}
