import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =========================================================================
// MIDDLEWARE FOR ADMIN PATHS
// Source: 13-SECURITY.md §3.1 & 12-IMPLEMENTATION-PLAN.md T05
// Rule: Admin paths for non-admin return not-found (404), do not confirm surface exists!
// =========================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate admin paths
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/v1/admin');
  const isSessionEndpoint = pathname === '/api/v1/admin/session';

  if (!isAdminPath || isSessionEndpoint) {
    return NextResponse.next();
  }

  // Check header or cookie for active persona
  const headerUserId = request.headers.get('x-awa-user-id');
  const cookieUserId = request.cookies.get('awa_user_id')?.value || request.cookies.get('awa_session')?.value;
  const activeUserId = headerUserId || cookieUserId;

  // In this demo platform, usr-admin-1 is the administrator account
  // If explicitly visitor, or member (e.g. usr-alex-sub), block with 404 Not Found
  if (activeUserId === 'visitor' || (activeUserId && activeUserId !== 'usr-admin-1')) {
    // Return 404 response
    return new NextResponse(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/v1/admin/:path*'],
};
