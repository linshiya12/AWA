import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { privateDb } from '@/lib/server/db/privateStore';

// GET /api/v1/admin/users — List and search accounts (API-027, FEAT-040)
export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;

  const users = privateDb.getUsers(search);
  return NextResponse.json({ users });
}

// PATCH /api/v1/admin/users — Update role or suspend/activate (API-027, FEAT-040)
export async function PATCH(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await request.json();
    if (!body.user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    let updatedUser;
    if (body.role) {
      updatedUser = privateDb.updateUserRole(body.user_id, body.role, auth.adminUser.user_id);
    }
    if (body.status) {
      updatedUser = privateDb.updateUserStatus(body.user_id, body.status, auth.adminUser.user_id);
    }

    return NextResponse.json({ user: updatedUser });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to update user' }, { status: 400 });
  }
}
