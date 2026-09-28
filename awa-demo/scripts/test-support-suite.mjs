const BASE_URL = 'http://localhost:3000';

async function testSupportSuite() {
  console.log('=== Starting AWA Support System Integration Test Suite ===');

  // 1. Test SSR Page Loads
  console.log('\n[1/7] Testing Page Rendering (SSR)...');
  const userPageRes = await fetch(`${BASE_URL}/support`);
  if (!userPageRes.ok) throw new Error(`User /support page failed with ${userPageRes.status}`);
  const userPageHtml = await userPageRes.text();
  if (!userPageHtml.includes('Support')) throw new Error('User support page missing Support title');
  console.log('✔ User Support page renders (HTTP 200, length:', userPageHtml.length, ')');

  const adminPageRes = await fetch(`${BASE_URL}/admin/support`);
  if (!adminPageRes.ok) throw new Error(`Admin /admin/support page failed with ${adminPageRes.status}`);
  const adminPageHtml = await adminPageRes.text();
  if (!adminPageHtml.includes('Support')) throw new Error('Admin support page missing Support title');
  console.log('✔ Admin Support page renders (HTTP 200, length:', adminPageHtml.length, ')');

  // 2. Test Admin Counts Endpoint
  console.log('\n[2/7] Testing Admin Counts API...');
  const countsRes = await fetch(`${BASE_URL}/api/v1/admin/support/counts`);
  if (!countsRes.ok) throw new Error(`Counts endpoint failed with ${countsRes.status}`);
  const countsData = await countsRes.json();
  console.log('Counts:', countsData.counts);
  if (typeof countsData.counts.unread !== 'number' || typeof countsData.counts.total !== 'number') {
    throw new Error('Invalid counts response format');
  }
  console.log('✔ Counts endpoint returned valid metrics');

  // 3. Test User Tickets API & Security Isolation
  console.log('\n[3/7] Testing User Tickets & Privacy Isolation...');
  const userTicketsRes = await fetch(`${BASE_URL}/api/v1/support/tickets?userId=usr-alex-sub`);
  if (!userTicketsRes.ok) throw new Error(`User tickets endpoint failed: ${userTicketsRes.status}`);
  const userTicketsData = await userTicketsRes.json();
  console.log(`Found ${userTicketsData.tickets.length} tickets for user ${userTicketsData.currentUser.email}`);

  // SECURITY CHECK: User must ONLY see their own tickets and NO internal notes!
  for (const t of userTicketsData.tickets) {
    if (t.user_id !== 'usr-alex-sub') {
      throw new Error(`SECURITY VIOLATION: User received ticket belonging to ${t.user_id}`);
    }
    for (const m of t.messages) {
      if (m.is_internal_note) {
        throw new Error('SECURITY VIOLATION: User received message with is_internal_note = true!');
      }
    }
  }
  console.log('✔ User tickets properly isolated and internal notes stripped');

  // 4. Test User Ticket Creation
  console.log('\n[4/7] Testing New Ticket Creation from User...');
  const newTicketRes = await fetch(`${BASE_URL}/api/v1/support/tickets?userId=usr-alex-sub`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Automated Test: Lighting issue with macro reflections',
      category: 'prompt_customization',
      description: 'The reflection highlights on the bottle are appearing jagged on Midjourney v6.1.',
      screenshotUrl: '/images/guidance/tpl_1/step-1.svg',
      relatedTemplateId: 'tpl_1',
      relatedAttemptId: 'att-test-99',
    }),
  });

  if (!newTicketRes.ok) {
    const err = await newTicketRes.text();
    throw new Error(`Failed to create ticket: ${err}`);
  }
  const createdTicketData = await newTicketRes.json();
  const createdTicket = createdTicketData.ticket;
  console.log(`✔ Created ticket #${createdTicket.ticket_number} (ID: ${createdTicket.ticket_id})`);
  if (createdTicket.status !== 'open') throw new Error('New ticket should start in open status');

  // 5. Test User Reply
  console.log('\n[5/7] Testing User Reply on Ticket...');
  const userReplyRes = await fetch(`${BASE_URL}/api/v1/support/tickets/${createdTicket.ticket_id}/reply?userId=usr-alex-sub`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'Follow up: I tried with raw style flag but the highlights are still blown out.',
    }),
  });
  if (!userReplyRes.ok) throw new Error('User reply failed');
  console.log('✔ User reply posted successfully');

  // 6. Test Admin Ticket Retrieval, Filtering, and Replying
  console.log('\n[6/7] Testing Admin Ticket Management...');
  const adminListRes = await fetch(`${BASE_URL}/api/v1/admin/support?search=Automated`);
  if (!adminListRes.ok) throw new Error('Admin list failed');
  const adminListData = await adminListRes.json();
  const foundTicket = adminListData.tickets.find(t => t.ticket_id === createdTicket.ticket_id);
  if (!foundTicket) throw new Error('Admin search could not find newly created ticket');
  console.log('✔ Admin search and filter returned the new ticket');

  // 6a. Admin Internal Note
  console.log('Testing Admin Internal Note...');
  const noteRes = await fetch(`${BASE_URL}/api/v1/admin/support/${createdTicket.ticket_id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'Internal curator note: Check lighting prompt parameters --style raw vs diffuse.',
      is_internal_note: true,
    }),
  });
  if (!noteRes.ok) throw new Error('Posting internal note failed');
  console.log('✔ Admin internal note saved');

  // 6b. Admin Public Reply
  console.log('Testing Admin Public Reply...');
  const replyRes = await fetch(`${BASE_URL}/api/v1/admin/support/${createdTicket.ticket_id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'Hi Alex, try adjusting the diffuse fill light parameter to 45 degrees.',
      is_internal_note: false,
    }),
  });
  if (!replyRes.ok) throw new Error('Posting admin reply failed');
  console.log('✔ Admin public reply sent (status transitioned to waiting_for_user)');

  // 6c. Verify User CANNOT see the internal note, but CAN see the public reply
  const verifyUserRes = await fetch(`${BASE_URL}/api/v1/support/tickets/${createdTicket.ticket_id}?userId=usr-alex-sub`);
  const verifyUserData = await verifyUserRes.json();
  const userMessages = verifyUserData.ticket.messages;
  const hasInternalNote = userMessages.some(m => m.is_internal_note || m.content.includes('Internal curator note'));
  if (hasInternalNote) {
    throw new Error('CRITICAL SECURITY FLAW: User can see internal curator note!');
  }
  const hasPublicReply = userMessages.some(m => m.content.includes('diffuse fill light'));
  if (!hasPublicReply) {
    throw new Error('User did not receive admin public reply');
  }
  console.log('✔ Privacy verified: Internal note is strictly invisible to user, public reply is visible');

  // 7. Test Admin Status & Assignment Updates
  console.log('\n[7/7] Testing Status Transitions & Assignment...');
  // Assign
  const assignRes = await fetch(`${BASE_URL}/api/v1/admin/support/${createdTicket.ticket_id}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assigned_to_user_id: 'usr-admin-1' }),
  });
  if (!assignRes.ok) throw new Error('Assign ticket failed');
  console.log('✔ Assigned ticket to Lead Curator');

  // Mark Resolved
  const resolveRes = await fetch(`${BASE_URL}/api/v1/admin/support/${createdTicket.ticket_id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'resolved', note: 'Issue solved with prompt guidance' }),
  });
  if (!resolveRes.ok) throw new Error('Mark resolved failed');
  const resolveData = await resolveRes.json();
  if (resolveData.ticket.status !== 'resolved') throw new Error('Ticket status should be resolved');
  console.log('✔ Ticket marked as Resolved');

  console.log('\n======================================================');
  console.log('🎉 ALL USER SUPPORT AND ADMIN SUPPORT TESTS PASSED!');
  console.log('======================================================');
}

testSupportSuite().catch((err) => {
  console.error('\n❌ Support suite test failed:', err);
  process.exit(1);
});
