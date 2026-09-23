import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/templates — List templates with filtering (API-021)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const templates = publicDb.getTemplates({
    category_id: categoryId,
    status,
    search,
  });

  return NextResponse.json({ templates });
}

// POST /api/v1/admin/templates — Create new template metadata (API-021, FEAT-031)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.name || !body.category_id) {
      return NextResponse.json({ error: 'Template name and category_id are required' }, { status: 400 });
    }

    const template = publicDb.createTemplate({
      category_id: body.category_id,
      name: body.name.trim(),
      description: body.description || '',
      preview_media_id: body.preview_media_id || null,
      preview_image: body.preview_image || '/images/templates/tpl_1_wide.jpg',
      status: 'draft', // Initial status is draft until prompt version is published (FEAT-031)
      current_version_id: null,
      position: body.position || 1,
      is_sample: body.is_sample ?? false,
      difficulty: body.difficulty || 'beginner',
      tags: body.tags || [],
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_template',
      'template',
      template.template_id,
      null,
      template as unknown as Record<string, unknown>
    );

    return NextResponse.json({ template }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to create template' }, { status: 400 });
  }
}
