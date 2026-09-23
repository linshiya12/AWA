import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/v1/admin/tools/[id] — Update AI tool (API-023)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getToolById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = publicDb.updateTool(id, body);

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'update_ai_tool',
      'ai_tool',
      id,
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return NextResponse.json({ tool: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update tool' }, { status: 400 });
  }
}

// DELETE /api/v1/admin/tools/[id] — Withdraw AI tool (API-023, 11-UI-UX A5)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { id } = await context.params;
  const existing = publicDb.getToolById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  // Count assignments referencing this tool
  const referencing = publicDb.getAssignments().filter((a) => a.tool_id === id);

  // Withdrawal sets is_available = false rather than deleting rows (07 §4.4)
  const updated = publicDb.updateTool(id, { is_available: false });

  privateDb.recordAuditLog(
    auth.adminUser.user_id,
    'withdraw_ai_tool',
    'ai_tool',
    id,
    { is_available: existing.is_available },
    { is_available: false, affectedAssignmentsCount: referencing.length }
  );

  return NextResponse.json({
    tool: updated,
    message: `Withdrawn tool '${existing.name}'. ${referencing.length} assignments reference this tool.`,
    affectedAssignmentsCount: referencing.length,
  });
}
