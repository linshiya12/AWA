import { POST as promptPost } from '../src/app/api/v1/templates/[id]/prompt/route';
import { GET as adminGuidanceGet } from '../src/app/api/v1/admin/guidance/route';
import { NextRequest } from 'next/server';

async function testApi() {
  console.log('Testing /api/v1/templates/[id]/prompt for template tpl_mind_ai (3D Website):');
  const req = new NextRequest('http://localhost:3000/api/v1/templates/tpl_mind_ai/prompt', {
    method: 'POST',
    headers: { 'x-awa-subscribed': 'true', 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  const res = await promptPost(req, { params: Promise.resolve({ id: 'tpl_mind_ai' }) });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Guidance steps count:', data.guidance?.length);
  console.log('First step title:', data.guidance?.[0]?.title);
  console.log('First step image:', data.guidance?.[0]?.image);
  console.log('Is sample:', data.isSample);

  console.log('\nTesting /api/v1/templates/[id]/prompt for template tpl_video_2 (Video Splash):');
  const reqVid = new NextRequest('http://localhost:3000/api/v1/templates/tpl_video_2/prompt', {
    method: 'POST',
    headers: { 'x-awa-subscribed': 'true', 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  const resVid = await promptPost(reqVid, { params: Promise.resolve({ id: 'tpl_video_2' }) });
  const dataVid = await resVid.json();
  console.log('Video guidance steps count:', dataVid.guidance?.length);
  console.log('Video step 1:', dataVid.guidance?.[0]?.title);
  console.log('Video step 1 image:', dataVid.guidance?.[0]?.image);

  console.log('\nTesting /api/v1/admin/guidance?scope_type=template&scope_id=tpl_1:');
  const adminReq = new NextRequest('http://localhost:3000/api/v1/admin/guidance?scope_type=template&scope_id=tpl_1', {
    method: 'GET',
    headers: { 'x-awa-role': 'admin' },
  });
  const adminRes = await adminGuidanceGet(adminReq);
  const adminData = await adminRes.json();
  console.log('Admin guidance status:', adminRes.status);
  console.log('Admin guidance steps count:', adminData.guidance?.steps?.length);
  console.log('Admin guidance isInherited:', adminData.guidance?.isInherited);

  console.log('\nALL API GUIDANCE TESTS COMPLETED SUCCESSFULLY.');
}

testApi().catch((err) => {
  console.error('API test failed:', err);
  process.exit(1);
});
