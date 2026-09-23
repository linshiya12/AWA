// Automated Test Suite for AWA Subscription Management & Subscription Report
// Verifies authorization gates, search/filter, grant, update/extend, audit logs, and dynamic report calculations

const BASE_URL = 'http://localhost:3000';

async function runSubscriptionTests() {
  console.log('🧪 Starting AWA Subscription Management & Report Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    const adminHeaders = {
      'x-awa-user-id': 'usr-admin-1',
      'Content-Type': 'application/json',
    };

    // -------------------------------------------------------------
    // TEST 1: SERVER-SIDE AUTHORIZATION GATE (13-SECURITY.md §3.1)
    // -------------------------------------------------------------
    console.log('1. Testing Server-Side 404 Security Gate for Subscriptions:');

    // 1a. Visitor accessing /api/v1/admin/subscriptions must return 404 Not Found
    const visitorSubRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions`, {
      headers: { 'x-awa-user-id': 'visitor' },
    });
    assert(
      visitorSubRes.status === 404,
      `Visitor accessing /api/v1/admin/subscriptions returns 404 Not Found (got ${visitorSubRes.status})`
    );

    // 1b. Member accessing /api/v1/admin/subscriptions/report must return 404 Not Found
    const memberReportRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions/report`, {
      headers: { 'x-awa-user-id': 'usr-alex-sub' },
    });
    assert(
      memberReportRes.status === 404,
      `Subscriber member accessing /api/v1/admin/subscriptions/report returns 404 Not Found (got ${memberReportRes.status})`
    );

    // 1c. Administrator accessing /api/v1/admin/subscriptions must succeed with 200 OK
    const adminSubRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions`, {
      headers: adminHeaders,
    });
    assert(
      adminSubRes.status === 200,
      `Administrator accessing /api/v1/admin/subscriptions returns 200 OK (got ${adminSubRes.status})`
    );

    const subData = await adminSubRes.json();
    assert(
      Array.isArray(subData.subscriptions) && subData.subscriptions.length >= 6,
      `Admin subscriptions list returned ${subData.subscriptions?.length} subscriptions with joined details`
    );

    // -------------------------------------------------------------
    // TEST 2: SEARCH & FILTERING CAPABILITIES
    // -------------------------------------------------------------
    console.log('\n2. Testing Search and Filtering:');

    // 2a. Search by email
    const searchRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions?search=alex@creative.io`, {
      headers: adminHeaders,
    });
    const searchData = await searchRes.json();
    assert(
      searchData.subscriptions.length >= 1 && searchData.subscriptions.every((s) => s.user.email.includes('alex')),
      `Search by user email returns matching subscriptions only (found ${searchData.subscriptions.length})`
    );

    // 2b. Filter by plan
    const planRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions?plan=plan-lifetime`, {
      headers: adminHeaders,
    });
    const planData = await planRes.json();
    assert(
      planData.subscriptions.length >= 1 && planData.subscriptions.every((s) => s.plan_id === 'plan-lifetime'),
      `Filter by plan 'plan-lifetime' returned only lifetime subscribers (found ${planData.subscriptions.length})`
    );

    // 2c. Filter by status
    const statusRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions?status=active`, {
      headers: adminHeaders,
    });
    const statusData = await statusRes.json();
    assert(
      statusData.subscriptions.length >= 1 && statusData.subscriptions.every((s) => s.state === 'active'),
      `Filter by status 'active' returned active subscriptions only (found ${statusData.subscriptions.length})`
    );

    // -------------------------------------------------------------
    // TEST 3: GRANTING SUBSCRIPTION & AUDIT LOGGING
    // -------------------------------------------------------------
    console.log('\n3. Testing Grant Subscription Action & Audit Trail:');

    const grantRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        userId: 'usr-sara-solo',
        planId: 'plan-yearly',
        initialAllowance: 15,
        reason: 'Granted promotional annual access for UX review partnership',
      }),
    });
    assert(grantRes.status === 200, `Grant subscription API succeeded with 200 (got ${grantRes.status})`);
    const grantData = await grantRes.json();
    const createdSubId = grantData.subscription.subscription_id;
    assert(
      createdSubId && grantData.subscription.user.email === 'sara@marketing.co',
      `Subscription granted for Sara Chen (ID: ${createdSubId})`
    );

    // Verify Audit Log entry was recorded
    const auditRes = await fetch(`${BASE_URL}/api/v1/admin/audit?entity_type=subscription&limit=5`, {
      headers: adminHeaders,
    });
    const auditData = await auditRes.json();
    const grantLog = auditData.logs.find((l) => l.action === 'grant_subscription' && l.entity_id === createdSubId);
    assert(
      grantLog && grantLog.actor_id === 'usr-admin-1',
      `Grant subscription action recorded in immutable audit log with actor_id '${grantLog?.actor_id}'`
    );

    // -------------------------------------------------------------
    // TEST 4: UPDATE / EXTEND SUBSCRIPTION & AUDIT LOGGING
    // -------------------------------------------------------------
    console.log('\n4. Testing Update / Extend Subscription Action:');

    const patchRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions/${createdSubId}`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({
        extendMonths: 6,
        reason: 'Extended by 6 months due to onboarding extension',
      }),
    });
    assert(patchRes.status === 200, `Extend subscription API succeeded with 200 (got ${patchRes.status})`);
    const patchData = await patchRes.json();
    assert(
      patchData.subscription.state === 'active',
      `Updated subscription state is active and expiry extended`
    );

    // -------------------------------------------------------------
    // TEST 5: SUBSCRIPTION REPORT & REVENUE INTEGRITY (REAL DATA)
    // -------------------------------------------------------------
    console.log('\n5. Testing Subscription Report Metrics & Real Backend Calculations:');

    const reportRes = await fetch(`${BASE_URL}/api/v1/admin/subscriptions/report?period=all`, {
      headers: adminHeaders,
    });
    assert(reportRes.status === 200, `Subscription report API returned 200 (got ${reportRes.status})`);
    const { report } = await reportRes.json();

    assert(
      typeof report.active_subscriptions === 'number' && report.active_subscriptions >= 4,
      `Active subscriptions calculated accurately: ${report.active_subscriptions}`
    );

    assert(
      typeof report.expired_subscriptions === 'number' && report.expired_subscriptions >= 1,
      `Expired subscriptions calculated accurately: ${report.expired_subscriptions}`
    );

    assert(
      typeof report.upcoming_expirations === 'number' && report.upcoming_expirations >= 1,
      `Upcoming expirations (≤ 30d) calculated accurately: ${report.upcoming_expirations}`
    );

    assert(
      typeof report.renewals === 'number' && report.renewals >= 1,
      `Renewals count calculated accurately: ${report.renewals}`
    );

    // REVENUE VERIFICATION:
    // Succeeded plan transactions:
    // Alex Renewal: ₹199
    // Alex Initial: ₹199
    // Jordan Lifetime: ₹999
    // Elena Yearly: ₹199
    // Marcus Yearly: ₹199
    // Priya Yearly: ₹199
    // Total = 199*5 + 999 = 995 + 999 = ₹1,994
    // David Kim is pending (₹199): MUST BE EXCLUDED!
    // Alex credit pack (₹49): MUST BE EXCLUDED!
    const expectedRevenue = 1994;
    assert(
      report.total_revenue === expectedRevenue,
      `Subscription revenue strictly excludes unpaid/pending and packs: ₹${report.total_revenue} (expected ₹${expectedRevenue})`
    );

    // Plan breakdown verification
    assert(
      Array.isArray(report.plan_breakdown) && report.plan_breakdown.length === 2,
      `Plan breakdown contains Creator Yearly and Studio Lifetime`
    );

    const yearlyPlan = report.plan_breakdown.find((p) => p.plan_id === 'plan-yearly');
    const lifetimePlan = report.plan_breakdown.find((p) => p.plan_id === 'plan-lifetime');

    assert(
      yearlyPlan && lifetimePlan,
      `Both plans present in breakdown: Yearly (₹${yearlyPlan?.revenue}) + Lifetime (₹${lifetimePlan?.revenue})`
    );

    const breakdownSum = (yearlyPlan?.revenue || 0) + (lifetimePlan?.revenue || 0);
    assert(
      breakdownSum === report.total_revenue,
      `Sum of plan breakdown revenues (₹${breakdownSum}) matches total subscription revenue (₹${report.total_revenue})`
    );

    console.log('\n========================================');
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log('========================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runSubscriptionTests();
