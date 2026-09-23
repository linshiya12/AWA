const templates = [
  'tpl_1', 'tpl_2', 'tpl_3', 'tpl_4',
  'tpl_video_1', 'tpl_video_2', 'tpl_video_3',
  'tpl_slide_1', 'tpl_slide_2', 'tpl_slide_3',
  'tpl_web_1', 'tpl_web_2', 'tpl_web_3'
];

async function testAll() {
  for (const id of templates) {
    const res = await fetch(`http://localhost:3000/template/${id}`);
    const text = await res.text();
    const promptLocked = text.includes('Premium Prompt Locked');
    const guidanceLocked = text.includes('Step-by-Step Guidance Locked');
    console.log(`${id} -> Status: ${res.status} | Prompt Locked: ${promptLocked} | Guidance Locked: ${guidanceLocked}`);
  }
}

testAll();
