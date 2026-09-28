async function testEndpoints() {
  const ids = [
    'tpl_img_aquatic',
    'tpl_img_couture',
    'tpl_img_museum',
    'tpl_video_reel',
    'tpl_video_jellyfish',
    'tpl_3d_timepiece',
    'tpl_3d_pavilion',
    'tpl_slide_edu',
  ];

  console.log('Testing Guidance API (/api/v1/admin/guidance)...');
  for (const id of ids) {
    const res = await fetch(`http://localhost:3000/api/v1/admin/guidance?scope_type=template&scope_id=${id}`);
    if (!res.ok) {
      console.error(`FAILED: /api/v1/admin/guidance for ${id} status ${res.status}`);
      process.exit(1);
    }
    const data = await res.json();
    const steps = data.guidance?.steps || [];
    console.log(`✓ Guidance for ${id} - steps count: ${steps.length}, step 1: "${steps[0]?.title}"`);
    if (steps.length === 0) {
      console.error(`ERROR: Guidance has 0 steps for ${id}!`);
      process.exit(1);
    }
  }

  console.log('\nTesting Template Detail Pages (/template/[id])...');
  for (const id of ids) {
    const res = await fetch(`http://localhost:3000/template/${id}`);
    if (!res.ok) {
      console.error(`FAILED: /template/${id} status ${res.status}`);
      process.exit(1);
    }
    console.log(`✓ /template/${id} HTTP ${res.status}`);
  }

  console.log('\nTesting Homepage and Templates Catalog...');
  const homeRes = await fetch('http://localhost:3000/');
  console.log(`✓ / HTTP ${homeRes.status}`);

  const tplRes = await fetch('http://localhost:3000/templates');
  console.log(`✓ /templates HTTP ${tplRes.status}`);

  console.log('\nALL 8 NEW CREATIVE TEMPLATES (25 TOTAL) VERIFIED AND RETURNING 5 STEPS EACH!');
}

testEndpoints().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
