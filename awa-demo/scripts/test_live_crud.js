async function testLiveCrud() {
  console.log('\n--- LIVE HTTP CRUD & WORKFLOW TEST ---');
  const baseUrl = 'http://localhost:3000';

  // 1. Create curated collection via POST
  console.log('\n1. Creating curated collection via POST...');
  const createRes = await fetch(`${baseUrl}/api/v1/admin/collections/curated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Brand Identity Essentials Live',
      slug: 'brand-identity-essentials-live',
      description: 'Handpicked templates for corporate brand identity packages.',
      is_active: true,
      position: 1,
      template_ids: ['tpl_1', 'tpl_web_1', 'tpl_3', 'tpl_1'], // includes duplicate tpl_1
    }),
  });
  console.log('Create response status:', createRes.status);
  const createData = await createRes.json();
  if (!createRes.ok) throw new Error(`Create failed: ${JSON.stringify(createData)}`);
  const colId = createData.collection.collection_id;
  console.log('Created collection ID:', colId);
  console.log('Template count (duplicate prevention):', createData.collection.template_ids.length);
  if (createData.collection.template_ids.length !== 3) {
    throw new Error('Duplicate prevention failed: duplicate tpl_1 was not stripped');
  }

  // 2. Verify in public recommendations
  console.log('\n2. Verifying presence in /api/v1/collections/recommendations...');
  const recRes1 = await fetch(`${baseUrl}/api/v1/collections/recommendations`);
  const recData1 = await recRes1.json();
  const foundRec1 = recData1.recommendations.find((r) => r.collection_id === colId);
  if (!foundRec1) throw new Error('Newly created active collection not found in public recommendations!');
  console.log('Found active collection in recommendations! Title:', foundRec1.name);

  // 3. Update curated collection & reorder templates via PUT
  console.log('\n3. Updating collection & reordering templates via PUT...');
  const updateRes = await fetch(`${baseUrl}/api/v1/admin/collections/curated/${colId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Brand Identity Essentials Live (Updated)',
      template_ids: ['tpl_3', 'tpl_1', 'tpl_web_1'], // reordered
    }),
  });
  console.log('Update response status:', updateRes.status);
  const updateData = await updateRes.json();
  if (!updateRes.ok) throw new Error(`Update failed: ${JSON.stringify(updateData)}`);
  console.log('Updated title:', updateData.collection.name);
  console.log('Updated is_active in response:', updateData.collection.is_active);
  console.log('New template order:', updateData.collection.template_ids);
  if (updateData.collection.template_ids[0] !== 'tpl_3') {
    throw new Error('Reordering failed: tpl_3 is not at index 0');
  }

  // 4. Inactivate collection via PATCH
  console.log('\n4. Deactivating collection via PATCH /status...');
  const toggleRes1 = await fetch(`${baseUrl}/api/v1/admin/collections/curated/${colId}/status`, {
    method: 'PATCH',
  });
  const toggleData1 = await toggleRes1.json();
  console.log('Toggle response:', toggleData1.message);
  if (toggleData1.collection.is_active !== false) throw new Error('Collection failed to deactivate');

  // Verify it is EXCLUDED from public recommendations
  const recRes2 = await fetch(`${baseUrl}/api/v1/collections/recommendations`);
  const recData2 = await recRes2.json();
  const foundRec2 = recData2.recommendations.find((r) => r.collection_id === colId);
  if (foundRec2) throw new Error('INACTIVE collection is still appearing in public recommendations!');
  console.log('CONFIRMED: Inactive collection is excluded from recommendations feed!');

  // 5. Reactivate collection via PATCH
  console.log('\n5. Reactivating collection via PATCH /status...');
  const toggleRes2 = await fetch(`${baseUrl}/api/v1/admin/collections/curated/${colId}/status`, {
    method: 'PATCH',
  });
  const toggleData2 = await toggleRes2.json();
  console.log('Toggle response:', toggleData2.message);
  if (toggleData2.collection.is_active !== true) throw new Error('Collection failed to reactivate');

  // Verify it REAPPEARS in public recommendations
  const recRes3 = await fetch(`${baseUrl}/api/v1/collections/recommendations`);
  const recData3 = await recRes3.json();
  const foundRec3 = recData3.recommendations.find((r) => r.collection_id === colId);
  if (!foundRec3) throw new Error('Reactivated collection did not reappear in public recommendations!');
  console.log('CONFIRMED: Reactivated collection reappeared in recommendations feed!');

  // 6. Delete collection via DELETE
  console.log('\n6. Deleting test collection via DELETE...');
  const deleteRes = await fetch(`${baseUrl}/api/v1/admin/collections/curated/${colId}`, {
    method: 'DELETE',
  });
  console.log('Delete response status:', deleteRes.status);

  // 7. Verify Audit Logs
  console.log('\n7. Verifying administrative audit logs recorded...');
  const auditRes = await fetch(`${baseUrl}/api/v1/admin/audit?entity_type=curated_collection`);
  const auditData = await auditRes.json();
  console.log('Total curated collection audit entries:', auditData.logs?.length);
  const actions = auditData.logs.map((l) => l.action);
  console.log('Audit actions found:', actions);
  if (!actions.includes('create_curated_collection')) throw new Error('Missing create_curated_collection audit log');
  if (!actions.includes('update_curated_collection')) throw new Error('Missing update_curated_collection audit log');
  if (!actions.includes('toggle_curated_collection_status')) throw new Error('Missing toggle_curated_collection_status audit log');
  if (!actions.includes('delete_curated_collection')) throw new Error('Missing delete_curated_collection audit log');

  console.log('\nALL LIVE HTTP CRUD & AUDIT TESTS PASSED SUCCESSFULLY! 🎉\n');
}

testLiveCrud().catch((err) => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
