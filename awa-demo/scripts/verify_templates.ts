import { allTemplates, categoryTree, getAllTemplateIdsUnderNode } from '../src/lib/mockData';
import { ALL_GUIDANCE_CATALOG } from '../src/lib/guidanceCatalog';
import fs from 'fs';
import path from 'path';

console.log('=== TEMPLATE VERIFICATION ===');
console.log(`Total Templates Count: ${allTemplates.length}`);

let errors = 0;

allTemplates.forEach((t) => {
  const guidance = ALL_GUIDANCE_CATALOG[t.id];
  if (!guidance || guidance.length === 0) {
    console.error(`ERROR: Missing guidance catalog for template ${t.id}`);
    errors++;
  } else {
    // Check that each step's SVG exists
    guidance.forEach((step) => {
      const filePath = path.join(process.cwd(), 'public', step.image);
      if (!fs.existsSync(filePath)) {
        console.error(`ERROR: Guidance image missing on disk: ${filePath} for ${t.id} step ${step.step}`);
        errors++;
      }
    });
  }

  // Check thumbnail
  const thumbPath = path.join(process.cwd(), 'public', t.media.thumbnail);
  if (!fs.existsSync(thumbPath)) {
    console.error(`ERROR: Thumbnail missing on disk: ${thumbPath} for ${t.id}`);
    errors++;
  }

  // Check prompts
  if (!t.basePrompt || t.basePrompt.length < 20) {
    console.error(`ERROR: Missing or short basePrompt for ${t.id}`);
    errors++;
  }
  if (!t.uiPrompt || t.uiPrompt.length < 20) {
    console.error(`ERROR: Missing or short uiPrompt for ${t.id}`);
    errors++;
  }
  if (!t.contextPrompt || t.contextPrompt.length < 20) {
    console.error(`ERROR: Missing or short contextPrompt for ${t.id}`);
    errors++;
  }
});

// Verify categoryTree coverage
console.log('\n=== CATEGORY TREE VERIFICATION ===');
const treeIds = new Set<string>();
categoryTree.forEach((root) => {
  getAllTemplateIdsUnderNode(root).forEach((id) => treeIds.add(id));
});

console.log(`Unique templates in CategoryTree: ${treeIds.size}`);
allTemplates.forEach((t) => {
  if (!treeIds.has(t.id)) {
    console.error(`ERROR: Template ${t.id} not covered in CategoryTree!`);
    errors++;
  }
});

console.log(`\nVerification finished with ${errors} error(s).`);
if (errors > 0) process.exit(1);
