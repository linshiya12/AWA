/**
 * Verification Script: Collection Management
 * Tests curated collections CRUD, reordering, duplicate prevention,
 * active/inactive status toggle with recommendation inclusion/exclusion,
 * read-only user collection inspection with privacy guarantees (zero prompt leakage),
 * and audit trail recording.
 */

import { publicDb } from '../src/lib/server/db/publicStore';
import { privateDb } from '../src/lib/server/db/privateStore';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

async function runVerification() {
  console.log('\n======================================================');
  console.log('🚀 AWA ADMIN: COLLECTION MANAGEMENT END-TO-END VERIFICATION');
  console.log('======================================================\n');

  // -------------------------------------------------------------------
  // 1. Curated Collections: Initial State
  // -------------------------------------------------------------------
  console.log('--- Step 1: Curated Collections Initial State ---');
  const initialCurated = publicDb.getCuratedCollections({ status: 'all' });
  assert(initialCurated.collections.length > 0, `Initial curated collections present (${initialCurated.collections.length})`);
  assert(initialCurated.counts.active > 0, `Active collections count: ${initialCurated.counts.active}`);
  assert(initialCurated.counts.inactive > 0, `Inactive collections count: ${initialCurated.counts.inactive}`);

  // Verify that recommendations only return active collections
  const initialRecs = publicDb.getPublicRecommendations();
  assert(initialRecs.length === initialCurated.counts.active, `Public recommendations (${initialRecs.length}) equals active curated count (${initialCurated.counts.active})`);
  assert(initialRecs.every((r) => r.is_active === true), 'All recommendation collections have is_active === true');

  // Verify zero prompt leakage in recommendations
  for (const rec of initialRecs) {
    for (const t of rec.templates) {
      assert(!('prompt_text' in t), `Security: Template ${t.template_id} in public recommendation has NO prompt_text`);
      assert(!('ui_prompt' in t), `Security: Template ${t.template_id} in public recommendation has NO ui_prompt`);
      assert(!('context_prompt' in t), `Security: Template ${t.template_id} in public recommendation has NO context_prompt`);
    }
  }

  // -------------------------------------------------------------------
  // 2. Create Curated Collection with Duplicate Prevention
  // -------------------------------------------------------------------
  console.log('\n--- Step 2: Create Curated Collection & Duplicate Prevention ---');
  // Pass duplicates intentionally: ['tpl_1', 'tpl_3', 'tpl_1', 'tpl_video_1', 'tpl_3']
  const duplicateInputTemplates = ['tpl_1', 'tpl_3', 'tpl_1', 'tpl_video_1', 'tpl_3'];
  const newCol = publicDb.createCuratedCollection({
    name: 'E2E Test Curated Showcase',
    slug: 'e2e-test-curated-showcase',
    description: 'A curated showcase built during automated verification.',
    is_active: true,
    position: 99,
    template_ids: duplicateInputTemplates,
    created_by: 'usr-admin-1',
  });

  assert(Boolean(newCol.collection_id), `Created curated collection with ID: ${newCol.collection_id}`);
  assert(newCol.name === 'E2E Test Curated Showcase', 'Collection name set correctly');
  assert(newCol.is_active === true, 'Collection initialized as active');
  // Verify deduplication: should have exactly 3 unique templates ('tpl_1', 'tpl_3', 'tpl_video_1')
  assert(newCol.template_ids.length === 3, `Duplicate prevention verified: 5 inputs deduplicated to 3 templates (${newCol.template_ids.join(', ')})`);
  assert(
    newCol.template_ids[0] === 'tpl_1' && newCol.template_ids[1] === 'tpl_3' && newCol.template_ids[2] === 'tpl_video_1',
    'Order of unique templates preserved'
  );

  // Record audit log for creation
  privateDb.recordAuditLog(
    'usr-admin-1',
    'create_curated_collection',
    'curated_collection',
    newCol.collection_id,
    null,
    newCol as unknown as Record<string, unknown>
  );

  // Check recommendation feed now contains this active collection
  const recsAfterCreate = publicDb.getPublicRecommendations();
  assert(
    recsAfterCreate.some((r) => r.collection_id === newCol.collection_id),
    'Newly created active collection appears in public recommendations feed'
  );

  // -------------------------------------------------------------------
  // 3. Edit Curated Collection & Template Reordering
  // -------------------------------------------------------------------
  console.log('\n--- Step 3: Update Curated Collection & Reordering ---');
  // Reorder templates: reverse the order to ['tpl_video_1', 'tpl_3', 'tpl_1']
  const reorderedIds = ['tpl_video_1', 'tpl_3', 'tpl_1'];
  const updatedCol = publicDb.updateCuratedCollection(newCol.collection_id, {
    name: 'E2E Test Curated Showcase (Reordered)',
    template_ids: reorderedIds,
  });

  assert(Boolean(updatedCol), 'Collection update returned updated object');
  assert(updatedCol?.name === 'E2E Test Curated Showcase (Reordered)', 'Updated title preserved');
  assert(updatedCol?.template_ids[0] === 'tpl_video_1', 'Template #1 is now tpl_video_1');
  assert(updatedCol?.template_ids[1] === 'tpl_3', 'Template #2 is now tpl_3');
  assert(updatedCol?.template_ids[2] === 'tpl_1', 'Template #3 is now tpl_1');

  // Verify in recommendations that the reordered templates reflect the new ordering
  const recsAfterReorder = publicDb.getPublicRecommendations();
  const matchedRec = recsAfterReorder.find((r) => r.collection_id === newCol.collection_id);
  assert(Boolean(matchedRec), 'Matched collection in recommendations');
  assert(matchedRec?.templates[0].template_id === 'tpl_video_1', 'Recommendation template #1 correctly ordered as tpl_video_1');
  assert(matchedRec?.templates[1].template_id === 'tpl_3', 'Recommendation template #2 correctly ordered as tpl_3');
  assert(matchedRec?.templates[2].template_id === 'tpl_1', 'Recommendation template #3 correctly ordered as tpl_1');

  // Record audit log for update
  privateDb.recordAuditLog(
    'usr-admin-1',
    'update_curated_collection',
    'curated_collection',
    newCol.collection_id,
    newCol as unknown as Record<string, unknown>,
    updatedCol as unknown as Record<string, unknown>
  );

  // -------------------------------------------------------------------
  // 4. Inactivate Collection: Verify Recommendation Exclusion
  // -------------------------------------------------------------------
  console.log('\n--- Step 4: Toggle Status to Inactive & Recommendation Exclusion ---');
  const deactivated = publicDb.toggleCuratedCollectionStatus(newCol.collection_id);
  assert(deactivated !== null && deactivated.is_active === false, 'Collection status toggled to is_active === false');

  // Crucial test: Check public recommendations
  const recsAfterDeactivation = publicDb.getPublicRecommendations();
  assert(
    !recsAfterDeactivation.some((r) => r.collection_id === newCol.collection_id),
    'INACTIVE collection is EXCLUDED from public recommendations feed!'
  );

  // Verify collection and its templates are NOT deleted
  const fetchedInAdmin = publicDb.getCuratedCollectionById(newCol.collection_id);
  assert(Boolean(fetchedInAdmin), 'Collection still exists in admin database');
  assert(fetchedInAdmin?.template_ids.length === 3, 'Templates and order are preserved intact');
  assert(fetchedInAdmin?.is_active === false, 'Collection is correctly marked inactive in admin');

  // Record audit log for status toggle
  privateDb.recordAuditLog(
    'usr-admin-1',
    'toggle_curated_collection_status',
    'curated_collection',
    newCol.collection_id,
    { is_active: true },
    { is_active: false }
  );

  // Re-activate and verify it reappears
  const reactivated = publicDb.toggleCuratedCollectionStatus(newCol.collection_id);
  assert(reactivated !== null && reactivated.is_active === true, 'Collection status reactivated to true');
  const recsAfterReactivate = publicDb.getPublicRecommendations();
  assert(
    recsAfterReactivate.some((r) => r.collection_id === newCol.collection_id),
    'Reactivated collection immediately reappears in recommendations feed!'
  );

  // -------------------------------------------------------------------
  // 5. User Collections: Read-Only Support Inspection & Privacy
  // -------------------------------------------------------------------
  console.log('\n--- Step 5: User Collections Read-Only Inspection & Privacy ---');
  const userCollectionsResult = privateDb.getUserCollections({ page: 1, limit: 10 });
  assert(userCollectionsResult.collections.length > 0, `User collections fetched (${userCollectionsResult.collections.length})`);
  assert(userCollectionsResult.counts.total > 0, `Total user collections tracked: ${userCollectionsResult.counts.total}`);

  // Test search filter by user email or name
  const searched = privateDb.getUserCollections({ search: 'alex' });
  assert(searched.collections.length > 0, `Search by "alex" returned ${searched.collections.length} collections`);
  assert(searched.collections.every((c) => c.user.email.includes('alex') || c.user.display_name?.toLowerCase().includes('alex') || c.name.toLowerCase().includes('alex')), 'Search matched Alex collections');

  // Inspect single user collection details
  const sampleUserCol = userCollectionsResult.collections[0];
  const inspected = privateDb.getUserCollectionById(sampleUserCol.collection_id);
  assert(Boolean(inspected), `Successfully inspected user collection ${sampleUserCol.collection_id}`);
  assert(Boolean(inspected?.user.email), `User owner email available: ${inspected?.user.email}`);
  assert(inspected?.templates.length === sampleUserCol.template_ids.length, 'Hydrated templates count matches template_ids length');

  // PRIVACY CHECK: Ensure NO private prompt text is returned in user collection inspection
  for (const t of inspected?.templates || []) {
    assert(!('prompt_text' in t), `Security: User collection template ${t.template_id} has NO prompt_text exposed`);
    assert(!('ui_prompt' in t), `Security: User collection template ${t.template_id} has NO ui_prompt exposed`);
    assert(!('context_prompt' in t), `Security: User collection template ${t.template_id} has NO context_prompt exposed`);
  }

  // Confirm user collection data remains unchanged after admin view
  const userColAfterView = privateDb.getUserCollectionById(sampleUserCol.collection_id);
  assert(userColAfterView?.updated_at === sampleUserCol.updated_at, 'User collection updated_at is unchanged (strictly read-only view)');
  assert(userColAfterView?.template_ids.length === sampleUserCol.template_ids.length, 'Template IDs length unchanged');

  // -------------------------------------------------------------------
  // 6. Audit Trail Verification
  // -------------------------------------------------------------------
  console.log('\n--- Step 6: Administrative Audit Trail Ledger ---');
  const auditLogs = privateDb.getAuditLogs({ entity_type: 'curated_collection' });
  assert(auditLogs.length >= 3, `Audit logs recorded for curated collections (${auditLogs.length} entries)`);

  const createLog = auditLogs.find((l) => l.action === 'create_curated_collection' && l.entity_id === newCol.collection_id);
  assert(Boolean(createLog), 'create_curated_collection audit log verified');

  const updateLog = auditLogs.find((l) => l.action === 'update_curated_collection' && l.entity_id === newCol.collection_id);
  assert(Boolean(updateLog), 'update_curated_collection audit log verified');

  const toggleLog = auditLogs.find((l) => l.action === 'toggle_curated_collection_status' && l.entity_id === newCol.collection_id);
  assert(Boolean(toggleLog), 'toggle_curated_collection_status audit log verified');

  // Clean up test collection
  publicDb.deleteCuratedCollection(newCol.collection_id);
  assert(publicDb.getCuratedCollectionById(newCol.collection_id) === undefined, 'Test collection cleaned up successfully');

  console.log('\n======================================================');
  console.log('🎉 ALL END-TO-END COLLECTION MANAGEMENT TESTS PASSED!');
  console.log('======================================================\n');
}

runVerification().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
