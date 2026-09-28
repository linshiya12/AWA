import { templateEngagementService } from '../src/lib/services/templateEngagementService.ts';

async function runTests() {
  console.log('--- Testing templateEngagementService ---');

  // 1. Summary
  const summaryAll = await templateEngagementService.getEngagementSummary('allTime');
  console.log('Summary (allTime):', {
    totalLikes: summaryAll.totalLikes,
    totalSaves: summaryAll.totalSaves,
    totalEngagement: summaryAll.totalEngagement,
    likedTemplates: summaryAll.likedTemplatesCount,
    savedTemplates: summaryAll.savedTemplatesCount,
    totalTemplates: summaryAll.totalTemplates,
  });

  if (summaryAll.totalLikes <= 0 || summaryAll.totalSaves <= 0) {
    throw new Error('Summary totals should be greater than 0');
  }

  // 2. Date Range Summary
  const summary30d = await templateEngagementService.getEngagementSummary('30d');
  console.log('Summary (30d):', {
    totalLikes: summary30d.totalLikes,
    totalSaves: summary30d.totalSaves,
  });

  if (summary30d.totalLikes >= summaryAll.totalLikes) {
    throw new Error('30d likes should be a subset of allTime likes');
  }

  // 3. Most Liked
  const mostLiked = await templateEngagementService.getMostLikedTemplates(5);
  console.log('Top 3 Most Liked:', mostLiked.slice(0, 3).map(t => `${t.templateName} (${t.likes} likes)`));
  for (let i = 0; i < mostLiked.length - 1; i++) {
    if (mostLiked[i].likes < mostLiked[i + 1].likes) {
      throw new Error('Most liked templates should be sorted descending by likes');
    }
  }

  // 4. Most Saved
  const mostSaved = await templateEngagementService.getMostSavedTemplates(5);
  console.log('Top 3 Most Saved:', mostSaved.slice(0, 3).map(t => `${t.templateName} (${t.saves} saves)`));
  for (let i = 0; i < mostSaved.length - 1; i++) {
    if (mostSaved[i].saves < mostSaved[i + 1].saves) {
      throw new Error('Most saved templates should be sorted descending by saves');
    }
  }

  // 5. Search & Filter
  const searchRes = await templateEngagementService.getTemplateEngagement({
    search: 'Product',
    pageSize: 10,
  });
  console.log(`Search 'Product': found ${searchRes.totalItems} items`);
  if (searchRes.items.length === 0) {
    throw new Error('Search for "Product" should return results');
  }

  // 6. Pagination
  const page1 = await templateEngagementService.getTemplateEngagement({ page: 1, pageSize: 5 });
  const page2 = await templateEngagementService.getTemplateEngagement({ page: 2, pageSize: 5 });
  if (page1.items[0].templateId === page2.items[0].templateId) {
    throw new Error('Page 1 and Page 2 should have different templates');
  }
  console.log(`Pagination verified: Page 1 (${page1.items.length} items), Page 2 (${page2.items.length} items)`);

  // 7. Template Detail by ID
  const item = await templateEngagementService.getTemplateEngagementById('tpl_1');
  if (!item || item.templateId !== 'tpl_1') {
    throw new Error('Failed to find template tpl_1');
  }
  console.log('Template detail fetched:', {
    name: item.templateName,
    likes: item.likes,
    saves: item.saves,
    ratio: item.likeSaveRatio,
    collections: item.collections,
  });

  // 8. CSV Export (Privacy Check)
  const csv = await templateEngagementService.generateExportCsv('allTime');
  const lines = csv.split('\n');
  console.log(`Export CSV generated: ${lines.length} lines`);
  console.log('CSV Header:', lines[0]);
  if (!lines[0].includes('Template Name') || !lines[0].includes('Likes') || !lines[0].includes('Saves')) {
    throw new Error('CSV header missing expected columns');
  }
  if (csv.includes('user_id') || csv.includes('userId') || csv.includes('@') || csv.includes('prompt')) {
    throw new Error('Privacy violation: CSV contains unauthorized private fields');
  }

  console.log('All templateEngagementService tests PASSED!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
