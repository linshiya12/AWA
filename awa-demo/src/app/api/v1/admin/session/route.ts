import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { resolveUserFromRequest } from '@/lib/server/auth';

// GET /api/v1/admin/session — Current active persona
export async function GET(request: NextRequest) {
  const user = resolveUserFromRequest(request);
  const allUsers = privateDb.getUsers();

  return NextResponse.json({
    currentUser: user,
    availablePersonas: [
      { id: 'usr-admin-1', label: 'Admin (admin@awa.ai)', role: 'administrator' },
      { id: 'usr-alex-sub', label: 'Subscriber Member (alex@creative.io)', role: 'member' },
      { id: 'visitor', label: 'Unauthenticated Visitor', role: 'visitor' },
    ],
  });
}

// POST /api/v1/admin/session — Switch persona for testing security gates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const personaId = body.user_id;

    const response = NextResponse.json({
      success: true,
      activePersona: personaId,
    });

    if (personaId === 'visitor') {
      response.cookies.set('awa_user_id', 'visitor', { path: '/', httpOnly: true });
      response.cookies.set('awa_session', 'visitor', { path: '/', httpOnly: true });
    } else {
      const user = privateDb.getUserById(personaId);
      if (!user) {
        return NextResponse.json({ error: 'User persona not found' }, { status: 404 });
      }
      response.cookies.set('awa_user_id', user.user_id, { path: '/', httpOnly: true });
      response.cookies.set('awa_session', user.user_id, { path: '/', httpOnly: true });
    }

    return response;
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to switch session' }, { status: 400 });
  }
}
