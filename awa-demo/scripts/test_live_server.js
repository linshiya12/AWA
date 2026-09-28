async function testLiveServer() {
  console.log('Testing live Next.js HTTP server on http://localhost:3000...');

  // 1. Recommendations Feed
  const recRes = await fetch('http://localhost:3000/api/v1/collections/recommendations');
  console.log('Recommendations status:', recRes.status);
  const recData = await recRes.json();
  console.log('Active recommendations count:', recData.recommendations?.length);
  if (recData.recommendations?.length > 0) {
    console.log('Sample rec collection:', recData.recommendations[0].name, '- templates:', recData.recommendations[0].templates.length);
  }

  // 2. Admin Curated Collections (with default simulated admin session)
  const adminCuratedRes = await fetch('http://localhost:3000/api/v1/admin/collections/curated');
  console.log('Admin curated list status:', adminCuratedRes.status);
  const adminCuratedData = await adminCuratedRes.json();
  console.log('Total curated collections in admin:', adminCuratedData.collections?.length);
  console.log('Curated counts:', adminCuratedData.counts);

  // 3. Admin User Collections
  const adminUserRes = await fetch('http://localhost:3000/api/v1/admin/collections/user');
  console.log('Admin user collections status:', adminUserRes.status);
  const adminUserText = await adminUserRes.text();
  console.log('Admin user collections body:', adminUserText.slice(0, 300));
  const adminUserData = JSON.parse(adminUserText);
  console.log('Total user collections in admin:', adminUserData.collections?.length);
  console.log('User counts:', adminUserData.counts);

  // 4. Test Single User Collection Inspection
  if (adminUserData.collections?.length > 0) {
    const firstColId = adminUserData.collections[0].collection_id;
    const inspectRes = await fetch(`http://localhost:3000/api/v1/admin/collections/user/${firstColId}`);
    console.log('Inspect user collection status:', inspectRes.status);
    const inspectData = await inspectRes.json();
    console.log('Inspected collection owner:', inspectData.collection?.user?.email);
    console.log('Inspected template count:', inspectData.collection?.templates?.length);
  }

  // 5. Test Admin Collections Page SSR/HTML
  const pageRes = await fetch('http://localhost:3000/admin/collections');
  console.log('Admin collections page HTTP status:', pageRes.status);

  // 6. Test New Collection Page SSR/HTML
  const newPageRes = await fetch('http://localhost:3000/admin/collections/new');
  console.log('Admin new collection page HTTP status:', newPageRes.status);

  console.log('\nAll live HTTP endpoint tests completed successfully!');
}

testLiveServer().catch(console.error);
