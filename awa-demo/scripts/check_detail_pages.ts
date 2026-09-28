async function testDetailPages() {
  const ids = ['tpl_1', 'tpl_2', 'tpl_3', 'tpl_video_1', 'tpl_video_2', 'tpl_slide_1', 'tpl_web_1', 'tpl_mind_ai'];
  for (const id of ids) {
    // 1. Check with no cookie (guest)
    const resGuest = await fetch(`http://localhost:3000/template/${id}`);
    const htmlGuest = await resGuest.text();
    const guestLocked = htmlGuest.includes('section-prompt-locked');
    const guestImgs = Array.from(new Set([...htmlGuest.matchAll(/\/images\/guidance\/[^"'\s]+/g)].map((m) => m[0])));

    // 2. Check with subscriber cookie
    const resSub = await fetch(`http://localhost:3000/template/${id}`, {
      headers: { Cookie: 'awa_subscribed=true' },
    });
    const htmlSub = await resSub.text();
    const subLocked = htmlSub.includes('section-prompt-locked');
    const subImgs = Array.from(new Set([...htmlSub.matchAll(/\/images\/guidance\/[^"'\s]+/g)].map((m) => m[0])));
    const subStepTitles = Array.from(htmlSub.matchAll(/Text Input · Step (\d\d)/g)).map((m) => m[0]);

    console.log(`\n=== Template: ${id} ===`);
    console.log(`Guest view: locked = ${guestLocked}, guidance imgs = ${guestImgs.length}`);
    console.log(`Sub view:   locked = ${subLocked}, step count = ${subStepTitles.length}`);
    console.log(`Guidance images in Sub HTML:`, subImgs);
  }
}

testDetailPages().catch(console.error);
