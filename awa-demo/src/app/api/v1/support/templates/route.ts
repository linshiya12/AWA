import { NextRequest, NextResponse } from 'next/server';
import { publicDb } from '@/lib/server/db/publicStore';
import { allTemplates } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/support/templates
 * Returns lightweight list of templates for attaching to support tickets.
 */
export async function GET(request: NextRequest) {
  try {
    const templates = allTemplates.map((t) => ({
      template_id: t.id,
      name: t.title,
      category: t.category,
      format: t.mainCategory,
    }));

    return NextResponse.json({ templates });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
