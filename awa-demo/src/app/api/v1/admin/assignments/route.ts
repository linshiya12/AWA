import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/assignments — List or resolve assignments (API-024)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('template_id');
  const scopeType = searchParams.get('scope_type') as 'category' | 'template' | null;
  const scopeId = searchParams.get('scope_id');

  if (templateId) {
    const resolved = publicDb.resolveAssignmentsForTemplate(templateId);
    return NextResponse.json(resolved);
  }

  if (scopeType && scopeId) {
    const assignments = publicDb.getAssignmentsForScope(scopeType, scopeId);
    return NextResponse.json({ assignments });
  }

  const all = publicDb.getAssignments();
  return NextResponse.json({ assignments: all });
}

// POST /api/v1/admin/assignments — Create assignment (API-024, FEAT-035)
export async function POST(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.scope_type || !body.scope_id || !body.tool_id) {
      return NextResponse.json(
        { error: 'scope_type, scope_id, and tool_id are required' },
        { status: 400 }
      );
    }

    const asgn = publicDb.createAssignment({
      scope_type: body.scope_type,
      scope_id: body.scope_id,
      tool_id: body.tool_id,
      model_id: body.model_id || null,
      position: body.position || 1,
      reasoning_override: body.reasoning_override || null,
      is_active: body.is_active ?? true,
    });

    privateDb.recordAuditLog(
      auth.adminUser.user_id,
      'create_tool_assignment',
      'tool_assignment',
      asgn.assignment_id,
      null,
      asgn as unknown as Record<string, unknown>
    );

    return NextResponse.json({ assignment: asgn }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to create assignment' }, { status: 400 });
  }
}

// PATCH /api/v1/admin/assignments — Update assignment (API-024)
export async function PATCH(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.assignment_id) {
      return NextResponse.json({ error: 'assignment_id is required' }, { status: 400 });
    }

    const updated = publicDb.updateAssignment(body.assignment_id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ assignment: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update assignment' }, { status: 400 });
  }
}

// DELETE /api/v1/admin/assignments — Delete assignment (API-024)
export async function DELETE(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
  }

  const success = publicDb.deleteAssignment(id);
  return NextResponse.json({ success });
}
