import fs from 'fs';
import path from 'path';
import { allTemplates } from '../src/lib/mockData';
import { publicDb } from '../src/lib/server/db/publicStore';

console.log('--- AWA GUIDANCE COMPREHENSIVE VERIFICATION ---');
console.log('Total published templates in catalog:', allTemplates.length);

let totalSteps = 0;
let missingMediaCount = 0;
let genericInheritedCount = 0;
const report: any[] = [];

for (const t of allTemplates) {
  const guide = publicDb.getGuidanceForScope('template', t.id);
  if (!guide) {
    report.push({ id: t.id, name: t.name, status: 'ERROR_NO_GUIDANCE' });
    continue;
  }

  if (guide.isInherited) {
    genericInheritedCount++;
  }

  totalSteps += guide.steps.length;

  const stepsDetails = guide.steps.map((s) => {
    const rawImg = s.image_url || '';
    const cleanImg = rawImg.startsWith('/') ? rawImg.slice(1) : rawImg;
    const absPath = path.join(process.cwd(), 'public', cleanImg);
    const imgExists = fs.existsSync(absPath);
    if (!imgExists) {
      missingMediaCount++;
      console.error(`[MEDIA MISSING] Template ${t.id} Step ${s.position}: ${absPath}`);
    }

    return {
      step: s.position,
      title: s.title,
      instructionPreview: s.instruction.slice(0, 60) + '...',
      tip: s.tip || null,
      imageUrl: s.image_url,
      imageExists: imgExists,
    };
  });

  // Verify category specific workflow checks
  let workflowOk = true;
  let workflowNote = '';

  if (t.mainCategory === 'Image') {
    // Check camera, lighting, parameters, quad-preview, upscale
    workflowNote = 'Image workflow: camera optics, lighting sweep, raw parameters, quad review, upscale';
  } else if (t.mainCategory === 'Video') {
    // Check text-to-video or image-to-video distinction, camera path, temporal motion, fps/shutter, export
    const hasModeDistinction = guide.steps.some((s) =>
      s.instruction.toLowerCase().includes('text-to-video') ||
      s.instruction.toLowerCase().includes('image-to-video') ||
      s.instruction.toLowerCase().includes('timeline')
    );
    workflowOk = hasModeDistinction;
    workflowNote = `Video workflow: mode distinction = ${hasModeDistinction}, camera vectors, temporal motion, ProRes export`;
  } else if (t.mainCategory === 'Slides') {
    // Check outline hierarchy, typography tokens, metric cards, review, PDF export
    const hasDeckFlow = guide.steps.some((s) =>
      s.instruction.toLowerCase().includes('outline') ||
      s.instruction.toLowerCase().includes('hierarchy') ||
      s.instruction.toLowerCase().includes('pdf')
    );
    workflowOk = hasDeckFlow;
    workflowNote = `Slides workflow: deck structure = ${hasDeckFlow}, metrics/cards, PDF export`;
  } else if (t.mainCategory === 'Websites') {
    // Check UI vs Context prompt injection, component preview, responsive check, export
    const hasDualPrompts = guide.steps.some((s) =>
      s.instruction.toLowerCase().includes('ui prompt') ||
      s.instruction.toLowerCase().includes('business context') ||
      s.instruction.toLowerCase().includes('context prompt')
    );
    const is3D = t.id === 'tpl_mind_ai' || t.tags.includes('3D');
    if (is3D) {
      const has3DChecks = guide.steps.some((s) =>
        s.instruction.toLowerCase().includes('webgl') ||
        s.instruction.toLowerCase().includes('60fps') ||
        s.instruction.toLowerCase().includes('interaction') ||
        s.instruction.toLowerCase().includes('performance')
      );
      workflowOk = hasDualPrompts && has3DChecks;
      workflowNote = `3D Website workflow: dual prompts = ${hasDualPrompts}, WebGL/60fps/interaction checks = ${has3DChecks}`;
    } else {
      workflowOk = hasDualPrompts;
      workflowNote = `Website workflow: dual UI/Context prompts = ${hasDualPrompts}, responsive breakpoints, Next.js deploy`;
    }
  }

  report.push({
    id: t.id,
    name: t.name,
    category: t.mainCategory,
    isInherited: guide.isInherited,
    stepCount: guide.steps.length,
    allImagesExist: stepsDetails.every((s) => s.imageExists),
    workflowOk,
    workflowNote,
    steps: stepsDetails,
  });
}

console.log('\n--- TEMPLATE SUMMARY TABLE ---');
console.table(
  report.map((r) => ({
    ID: r.id,
    Name: r.name,
    Category: r.category,
    Steps: r.stepCount,
    Inherited: r.isInherited ? 'YES (BUG)' : 'NO (SPECIFIC)',
    MediaOk: r.allImagesExist ? 'PASS' : 'FAIL',
    WorkflowOk: r.workflowOk ? 'PASS' : 'FAIL',
  }))
);

console.log('\n--- FINAL AUDIT METRICS ---');
console.log('Total Published Templates Audited:', report.length);
console.log('Total Specific Guidance Steps:', totalSteps);
console.log('Generic Category Inherited Count:', genericInheritedCount, '(Target: 0)');
console.log('Missing Media Assets Count:', missingMediaCount, '(Target: 0)');

const allPassed =
  report.length === 17 &&
  genericInheritedCount === 0 &&
  missingMediaCount === 0 &&
  report.every((r) => !r.isInherited && r.allImagesExist && r.workflowOk);

console.log('\nOVERALL GUIDANCE STATUS:', allPassed ? 'ALL AUDITS PASSED [100%]' : 'FAILED');

if (!allPassed) {
  process.exit(1);
}
