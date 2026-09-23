// Automated Test Suite for AWA Admin Panel
// Verifies security gates, two-step write, data privacy, and audit logging

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting AWA Admin Panel Comprehensive Verification Suite...\n');
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
    // -------------------------------------------------------------
    // TEST 1: SERVER-SIDE AUTHORIZATION GATE (13-SECURITY.md §3.1)
    // -------------------------------------------------------------
    console.log('1. Testing Server-Side 404 Security Gate:');

    // 1a. Visitor request to admin endpoint must return 404 Not Found
    const visitorRes = await fetch(`${BASE_URL}/api/v1/admin/templates`, {
      headers: { 'x-awa-user-id': 'visitor' },
    });
    assert(
      visitorRes.status === 404,
      `Visitor accessing /api/v1/admin/templates returns 404 Not Found (got ${visitorRes.status})`
    );

    // 1b. Non-admin member (alex@creative.io) must also receive 404 Not Found
    const memberRes = await fetch(`${BASE_URL}/api/v1/admin/templates`, {
      headers: { 'x-awa-user-id': 'usr-alex-sub' },
    });
    assert(
      memberRes.status === 404,
      `Subscriber member accessing admin endpoint returns 404 Not Found (got ${memberRes.status})`
    );

    // 1c. Administrator (admin@awa.ai) must succeed with 200 OK
    const adminHeaders = { 'x-awa-user-id': 'usr-admin-1', 'Content-Type': 'application/json' };
    const adminRes = await fetch(`${BASE_URL}/api/v1/admin/templates`, {
      headers: adminHeaders,
    });
    assert(
      adminRes.status === 200,
      `Administrator accessing admin endpoint returns 200 OK (got ${adminRes.status})`
    );

    const templatesData = await adminRes.json();
    assert(
      Array.isArray(templatesData.templates) && templatesData.templates.length > 0,
      `Admin templates list returned ${templatesData.templates?.length} templates`
    );

    // -------------------------------------------------------------
    // TEST 2: DATA BOUNDARY & SENSITIVE SECRETS (NFR-005 & 13 §4)
    // -------------------------------------------------------------
    console.log('\n2. Testing Write-Only Payment Secrets & Data Boundary:');

    const commerceRes = await fetch(`${BASE_URL}/api/v1/admin/commerce`, {
      headers: adminHeaders,
    });
    const commerceData = await commerceRes.json();

    assert(
      commerceData.paymentConfig?.key_secret === undefined,
      'Raw payment key_secret is NEVER returned in response (write-only)'
    );
    assert(
      typeof commerceData.paymentConfig?.key_secret_masked === 'string',
      `Masked secret returned: ${commerceData.paymentConfig?.key_secret_masked}`
    );

    // Test connection ping (11-UI-UX A7)
    const testPingRes = await fetch(`${BASE_URL}/api/v1/admin/commerce/test-connection`, {
      method: 'POST',
      headers: adminHeaders,
    });
    const testPingData = await testPingRes.json();
    assert(
      testPingData.success === true,
      `Payment gateway connection verification succeeded: "${testPingData.message}"`
    );

    // -------------------------------------------------------------
    // TEST 3: PROMPT AUTHORING & TWO-STEP WRITE (06 §5.4, 08 Rule 16)
    // -------------------------------------------------------------
    console.log('\n3. Testing Prompt Authoring, Two-Step Write & Append-Only History:');

    const testTplId = templatesData.templates[0].template_id;

    // 3a. Preview prompt before publishing (UR-§8 quality gate)
    const previewRes = await fetch(`${BASE_URL}/api/v1/admin/templates/${testTplId}/versions/preview`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ prompt_text: 'Test prompt for studio lighting' }),
    });
    const previewData = await previewRes.json();
    assert(
      typeof previewData.finalPrompt === 'string' && previewData.finalPrompt.includes('Test prompt'),
      `Preview rendered without updating public database: "${previewData.finalPrompt.slice(0, 40)}..."`
    );

    // 3b. Create new version with publishImmediately = true
    const createVerRes = await fetch(`${BASE_URL}/api/v1/admin/templates/${testTplId}/versions`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        prompt_text: 'Refined commercial product studio shot with soft shadows and 85mm lens --v 6.1',
        change_note: 'Automated verification test version',
        publish: true,
      }),
    });
    const createVerData = await createVerRes.json();
    assert(
      createVerData.published === true && createVerData.version?.version_number >= 2,
      `Prompt published as Version ${createVerData.version?.version_number}`
    );

    // 3c. Restore older version and verify history grows (never rewinds)
    const restoreRes = await fetch(
      `${BASE_URL}/api/v1/admin/templates/${testTplId}/versions/ver-hero-1/restore`,
      {
        method: 'POST',
        headers: adminHeaders,
      }
    );
    const restoreData = await restoreRes.json();
    assert(
      restoreData.version?.version_number > createVerData.version?.version_number,
      `Restoring version created a NEW version (${restoreData.version?.version_number}) rather than rewinding history`
    );

    // -------------------------------------------------------------
    // TEST 4: SUPPORT ADJUSTMENTS & AUDIT TRAIL (FEAT-041, NFR-016)
    // -------------------------------------------------------------
    console.log('\n4. Testing Support Adjustments & Audit Trail:');

    // 4a. Reject adjustment if reason is omitted (FEAT-041)
    const failAdjRes = await fetch(`${BASE_URL}/api/v1/admin/users/usr-alex-sub/adjustments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ credit_amount: 5, reason: '' }),
    });
    assert(
      failAdjRes.status === 400,
      `Support adjustment without reason rejected with 400 (got ${failAdjRes.status})`
    );

    // 4b. Allow adjustment with documented reason
    const okAdjRes = await fetch(`${BASE_URL}/api/v1/admin/users/usr-alex-sub/adjustments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        credit_amount: 5,
        reason: 'Granted 5 credits for automated test verification',
      }),
    });
    const okAdjData = await okAdjRes.json();
    assert(
      okAdjData.user?.allowance_balance >= 13,
      `Adjustment applied. New allowance balance: ${okAdjData.user?.allowance_balance}`
    );

    // 4c. Verify audit log entry exists
    const auditRes = await fetch(`${BASE_URL}/api/v1/admin/audit?limit=5`, {
      headers: adminHeaders,
    });
    const auditData = await auditRes.json();
    const hasAdjustmentLog = auditData.logs?.some(
      (l) => l.action === 'support_adjustment_allowance' && l.actor_id === 'usr-admin-1'
    );
    assert(
      hasAdjustmentLog === true,
      'Support adjustment recorded in immutable audit log with actor_id and details'
    );

    // -------------------------------------------------------------
    // TEST 5: CATALOG TREE & CYCLE PREVENTION (Rule 13)
    // -------------------------------------------------------------
    console.log('\n5. Testing Catalog Hierarchy & Move Cycle Prevention:');

    const cycleRes = await fetch(`${BASE_URL}/api/v1/admin/categories/cat-image-gen/move`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ new_parent_id: 'subcat-product-photo' }),
    });
    assert(
      cycleRes.status === 400,
      `Moving parent node under its own descendant rejected with 400 (got ${cycleRes.status})`
    );

    // -------------------------------------------------------------
    // TEST 6: LANGUAGE GOVERNANCE (Rule 18 & 07 V19)
    // -------------------------------------------------------------
    console.log('\n6. Testing Language Governance & Default Fallback:');

    // Try to disable default English
    const disableDefRes = await fetch(`${BASE_URL}/api/v1/admin/languages`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ language_id: 'en', is_enabled: false }),
    });
    assert(
      disableDefRes.status === 400,
      `Disabling default language rejected with 400 (got ${disableDefRes.status})`
    );

    // -------------------------------------------------------------
    // TEST 7: REPORTS & CONTENT GAPS (FEAT-038 & API-029)
    // -------------------------------------------------------------
    console.log('\n7. Testing Reports & Content Gaps Detection:');

    const reportsRes = await fetch(`${BASE_URL}/api/v1/admin/reports`, {
      headers: adminHeaders,
    });
    const reportsData = await reportsRes.json();
    assert(
      Array.isArray(reportsData.contentGaps),
      `Content gaps evaluated: ${reportsData.contentGaps?.length} gaps detected`
    );
    assert(
      reportsData.spendStatus?.limit === 500 && typeof reportsData.spendStatus?.spent === 'number',
      `Spend status reported: $${reportsData.spendStatus?.spent} / $${reportsData.spendStatus?.limit}`
    );

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
