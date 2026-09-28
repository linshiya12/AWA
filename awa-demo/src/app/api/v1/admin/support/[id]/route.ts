import { NextRequest, NextResponse } from 'next/server';
import { privateDb } from '@/lib/server/db/privateStore';
import { requireAdminApi } from '@/lib/server/auth';
import { allTemplates } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/admin/support/[id]
 * Returns full ticket details for administrators, including internal notes and user profile.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;
    const ticket = privateDb.getAdminSupportTicketById(id);
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Retrieve full user profile context for customer support
    const user = privateDb.getUserById(ticket.user_id);
    const userProfile = user
      ? {
          user_id: user.user_id,
          email: user.email,
          display_name: user.display_name,
          role: user.role,
          status: user.status,
          allowance_balance: user.allowance_balance,
          created_at: user.created_at,
          last_seen_at: user.last_seen_at,
        }
      : null;

    // Retrieve related template details if attached
    let relatedTemplate = null;
    if (ticket.related_template_id) {
      const tpl = allTemplates.find((t) => t.id === ticket.related_template_id);
      if (tpl) {
        relatedTemplate = {
          template_id: tpl.id,
          name: tpl.title,
          category: tpl.category,
          mainCategory: tpl.mainCategory,
          preview_image: tpl.media?.thumbnail || tpl.media?.primaryImage,
        };
      }
    }

    // List of active administrators for re-assignment
    const allUsers = privateDb.getUsers();
    const adminUsers = allUsers
      .filter((u) => u.role === 'administrator' && u.status === 'active')
      .map((u) => ({
        user_id: u.user_id,
        name: u.display_name || u.email,
        email: u.email,
      }));

    return NextResponse.json({
      ticket,
      userProfile,
      relatedTemplate,
      adminUsers,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}
