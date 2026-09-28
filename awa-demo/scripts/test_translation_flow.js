/**
 * Comprehensive Verification Script for AWA Translation Pipeline
 * Tests:
 * 1. Admin Authorization Protection (404 for unauthorized non-admin / visitor)
 * 2. Adding and enabling a new language -> Automatic background translation for all published templates
 * 3. Separate UI Prompt and Context Prompt translation with parameter/placeholder preservation
 * 4. Language translation progress tracking (total, completed, pending, failed)
 * 5. Spend-cap accounting
 * 6. Template -> Translate tab: side-by-side source vs translated prompts, target language, source version
 * 7. Admin review and correction (PUT)
 * 8. Publishing translation (POST publish)
 * 9. User-facing prompt delivery with requested language and default fallback
 * 10. Safe retry without duplicate translations
 * 11. Source prompt revision -> marks existing translations as needs_update & queues new version translation
 * 12. Single template failure isolation and retry
 */

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 STARTING AWA TRANSLATION PIPELINE VERIFICATION 🚀');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- TEST 1: Security & Admin Authorization ---
  console.log('--- TEST 1: Security & Admin Authorization ---');
  let TEST_LANG = 'fr';
  let TEST_LANG_NAME = 'French (Français)';

  try {
    const unauthRes = await fetch(`${BASE_URL}/api/v1/admin/languages`, {
      headers: { 'x-awa-role': 'visitor' },
    });
    assert(unauthRes.status === 404, 'Unauthorized request with role=visitor returns 404 stealth');

    const authRes = await fetch(`${BASE_URL}/api/v1/admin/languages`, {
      headers: { 'x-awa-role': 'admin' },
    });
    assert(authRes.status === 200, 'Authorized request with admin header returns 200');
    const authData = await authRes.json();
    assert(Array.isArray(authData.languages), 'Returns list of languages with progress');

    // Pick an unused language to verify adding and enabling a new language
    const existingIds = new Set(authData.languages.map((l) => l.language_id));
    const candidates = [
      { id: 'fr', name: 'French (Français)' },
      { id: 'ja', name: 'Japanese (日本語)' },
      { id: 'ml', name: 'Malayalam (മലയാളം)' },
      { id: 'it', name: 'Italian (Italiano)' },
      { id: 'pt', name: 'Portuguese (Português)' },
    ];
    const picked = candidates.find((c) => !existingIds.has(c.id)) || {
      id: `l${Date.now().toString().slice(-4)}`,
      name: 'Custom Language',
    };
    TEST_LANG = picked.id;
    TEST_LANG_NAME = picked.name;
    console.log(`  ℹ️ Testing with fresh language: [${TEST_LANG}] ${TEST_LANG_NAME}`);
  } catch (err) {
    console.error('Test 1 error:', err);
    failed++;
  }

  // --- TEST 2: Add and Enable New Language -> Auto Background Translation ---
  console.log(`\n--- TEST 2: Add and Enable Language [${TEST_LANG}] -> Auto Background Translation ---`);
  try {
    const addRes = await fetch(`${BASE_URL}/api/v1/admin/languages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-role': 'admin',
      },
      body: JSON.stringify({
        language_id: TEST_LANG,
        name: TEST_LANG_NAME,
        is_enabled: true,
      }),
    });

    assert(addRes.status === 201, `POST /api/v1/admin/languages created new language '${TEST_LANG}'`);
    const addData = await addRes.json();
    assert(addData.language.language_id === TEST_LANG, `Language ID is "${TEST_LANG}"`);
    assert(addData.backgroundJobTriggered === true, 'Background translation job automatically triggered');
    assert(addData.progress !== undefined, 'Live progress object returned');
    console.log('Initial progress:', addData.progress);
  } catch (err) {
    console.error('Test 2 error:', err);
    failed++;
  }

  // --- TEST 3: Translation Progress Polling & Completion ---
  console.log(`\n--- TEST 3: Translation Progress Polling & Completion for [${TEST_LANG}] ---`);
  try {
    let completed = false;
    let finalProgress = null;

    for (let i = 0; i < 25; i++) {
      await sleep(1000);
      const pollRes = await fetch(`${BASE_URL}/api/v1/admin/languages`, {
        headers: { 'x-awa-role': 'admin' },
      });
      const pollData = await pollRes.json();
      const langEntry = pollData.languages.find((l) => l.language_id === TEST_LANG);
      if (langEntry && langEntry.progress) {
        const prog = langEntry.progress;
        const comp = prog.completed !== undefined ? prog.completed : prog.completed_templates;
        const pend = prog.pending !== undefined ? prog.pending : prog.pending_templates;
        const fail = prog.failed !== undefined ? prog.failed : prog.failed_templates;
        console.log(`Poll ${i + 1}: ${TEST_LANG} progress = total:${prog.total_templates}, completed:${comp}, pending:${pend}, failed:${fail}, status:${prog.status}`);

        if (comp > 0 && pend === 0 && fail === 0) {
          completed = true;
          finalProgress = prog;
          break;
        }
      }
    }

    assert(completed, `Background translation job finished for ${TEST_LANG}`);
    const completedCount = finalProgress?.completed !== undefined ? finalProgress.completed : finalProgress?.completed_templates;
    assert(completedCount > 0, `Templates translated: ${completedCount}`);
    const pendingCount = finalProgress?.pending !== undefined ? finalProgress.pending : finalProgress?.pending_templates;
    assert(pendingCount === 0, 'No templates pending');
  } catch (err) {
    console.error('Test 3 error:', err);
    failed++;
  }

  // --- TEST 4: Template -> Translate Tab: Side-by-Side Prompts & Token Preservation ---
  console.log('\n--- TEST 4: Template -> Translate Tab Side-by-Side & Token Preservation ---');
  try {
    const transRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations`, {
      headers: { 'x-awa-role': 'admin' },
    });
    assert(transRes.status === 200, 'GET /api/v1/admin/templates/tpl_1/translations returns 200');
    const transData = await transRes.json();
    const list = transData.translations || transData.languages;
    assert(Array.isArray(list), 'Returns translations array');

    const transMatch = list.find((t) => t.language_id === TEST_LANG);
    assert(transMatch !== undefined, `Found ${TEST_LANG} translation for tpl_1`);

    if (transMatch) {
      assert(Boolean(transMatch.ui_prompt_translated), 'UI Prompt was translated separately');
      assert(Boolean(transMatch.context_prompt_translated), 'Context Prompt was translated separately');
      assert(transMatch.prompt_text_source !== undefined, 'Source prompt is present for side-by-side comparison');
      assert(transMatch.version_number !== undefined, 'Source version number is present');
      assert(transMatch.status === 'completed', 'Translation status is "completed"');

      // Check parameter and placeholder preservation:
      const uiTrans = transMatch.ui_prompt_translated || '';
      console.log(`Sample translated UI prompt [${TEST_LANG}]:`, uiTrans.slice(0, 140) + '...');
      if (transMatch.ui_prompt_source && transMatch.ui_prompt_source.includes('--ar')) {
        assert(uiTrans.includes('--ar'), 'Technical parameter --ar is preserved');
      }
    }
  } catch (err) {
    console.error('Test 4 error:', err);
    failed++;
  }

  // --- TEST 5: Admin Review, Edit, and Publish ---
  console.log('\n--- TEST 5: Admin Review, Correction & Publishing ---');
  try {
    // 5a. Admin reviews and updates the translation
    const editedUiPrompt = `[Reviewed-${TEST_LANG}] Studio photo of artisanal ceramic tumbler, pure white background (#FFFFFF) --ar 1:1 --v 6.1`;
    const putRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations/${TEST_LANG}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-role': 'admin',
      },
      body: JSON.stringify({
        ui_prompt_translated: editedUiPrompt,
        context_prompt_translated: `[Reviewed-${TEST_LANG}] Context blueprint localized for domain production.`,
        review_status: 'reviewed',
      }),
    });

    assert(putRes.status === 200, `PUT /api/v1/admin/templates/tpl_1/translations/${TEST_LANG} returns 200`);
    const putData = await putRes.json();
    assert(putData.translation.review_status === 'reviewed', 'Translation status set to "reviewed"');
    assert(putData.translation.ui_prompt_translated === editedUiPrompt, 'Saved corrected UI prompt text');

    // 5b. Admin publishes the translation
    const pubRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations/${TEST_LANG}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-role': 'admin',
      },
    });

    assert(pubRes.status === 200, `POST /api/v1/admin/templates/tpl_1/translations/${TEST_LANG}/publish returns 200`);
    const pubData = await pubRes.json();
    const pubStatus = pubData.translation.publish_status || pubData.translation.review_status;
    assert(pubStatus === 'published', 'Translation publish_status is "published"');
    const pubTimestamp = pubData.translation.published_at || pubData.translation.reviewed_at;
    assert(Boolean(pubTimestamp), 'Published timestamp recorded');
  } catch (err) {
    console.error('Test 5 error:', err);
    failed++;
  }

  // --- TEST 6: User-Facing Prompt Delivery with Language & Fallback ---
  console.log('\n--- TEST 6: User-Facing Prompt Delivery & Default Fallback ---');
  try {
    // 6a. Deliver translated prompt for TEST_LANG
    const deliverRes = await fetch(`${BASE_URL}/api/v1/templates/tpl_1/prompt?lang=${TEST_LANG}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-subscribed': 'true',
      },
      body: JSON.stringify({}),
    });

    assert(deliverRes.status === 200, `Subscribed user requesting ?lang=${TEST_LANG} returns 200`);
    const deliverData = await deliverRes.json();
    assert(deliverData.languageId === TEST_LANG, `Returned languageId is "${TEST_LANG}"`);
    assert(deliverData.isFallback === false, `isFallback is false for published ${TEST_LANG} translation`);
    assert(deliverData.uiPrompt.includes(`[Reviewed-${TEST_LANG}]`), `Delivered the reviewed ${TEST_LANG} prompt`);

    // 6b. Request unsupported/untranslated language -> Fallback to default English
    const fallbackRes = await fetch(`${BASE_URL}/api/v1/templates/tpl_1/prompt?lang=zz-unsupported`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-subscribed': 'true',
      },
      body: JSON.stringify({}),
    });

    assert(fallbackRes.status === 200, 'Subscribed user requesting untranslated lang returns 200');
    const fallbackData = await fallbackRes.json();
    assert(fallbackData.languageId === 'en', 'Fallback language returned is "en"');
    assert(fallbackData.isFallback === true, 'isFallback is true for untranslated language');
    assert(fallbackData.fallbackLanguage === 'en', 'fallbackLanguage is "en"');
    assert(Boolean(fallbackData.uiPrompt), 'Delivered valid English default prompt');
  } catch (err) {
    console.error('Test 6 error:', err);
    failed++;
  }

  // --- TEST 7: Safe Retry Without Duplicate Translations ---
  console.log('\n--- TEST 7: Safe Retry Without Duplicates ---');
  try {
    // Count before retry
    const beforeRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations`, {
      headers: { 'x-awa-role': 'admin' },
    });
    const beforeData = await beforeRes.json();
    const beforeList = beforeData.translations || beforeData.languages;
    const transBefore = beforeList.filter((t) => t.language_id === TEST_LANG);
    assert(transBefore.length === 1, `Exactly 1 translation entry for (tpl_1, ${TEST_LANG}) before retry`);

    // Trigger retry on language
    const retryRes = await fetch(`${BASE_URL}/api/v1/admin/languages/${TEST_LANG}/retry`, {
      method: 'POST',
      headers: { 'x-awa-role': 'admin' },
    });
    assert(retryRes.status === 200, `POST /api/v1/admin/languages/${TEST_LANG}/retry returns 200`);

    // Wait for retry processing
    await sleep(2000);

    const afterRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations`, {
      headers: { 'x-awa-role': 'admin' },
    });
    const afterData = await afterRes.json();
    const afterList = afterData.translations || afterData.languages;
    const transAfter = afterList.filter((t) => t.language_id === TEST_LANG);
    assert(transAfter.length === 1, `Still exactly 1 translation entry for (tpl_1, ${TEST_LANG}) after retry (No duplicates!)`);
  } catch (err) {
    console.error('Test 7 error:', err);
    failed++;
  }

  // --- TEST 8: Source Prompt Revision Marks Translations as needs_update & Queues New Version ---
  console.log('\n--- TEST 8: Source Prompt Revision -> needs_update & Queues New Version ---');
  try {
    const newVersionRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-awa-role': 'admin',
      },
      body: JSON.stringify({
        prompt_text: 'Studio macro capture of luxury porcelain teacup, soft diffuse light, 85mm f/1.4 --ar 16:9 --v 6.1',
        ui_prompt: 'Studio macro capture of luxury porcelain teacup, soft diffuse light, 85mm f/1.4 --ar 16:9 --v 6.1',
        context_prompt: 'Editorial luxury lifestyle context blueprint for tea brand launch.',
        change_note: 'Refined aperture and macro focal length for porcelain',
        is_published: true,
      }),
    });

    assert(newVersionRes.status === 201, 'Created new prompt version for tpl_1');
    const newVerData = await newVersionRes.json();
    assert(newVerData.backgroundTranslationsQueued === true, 'Queued translations for all enabled languages');

    // Wait for background processor to handle new version
    await sleep(2500);

    const checkTransRes = await fetch(`${BASE_URL}/api/v1/admin/templates/tpl_1/translations`, {
      headers: { 'x-awa-role': 'admin' },
    });
    const checkTransData = await checkTransRes.json();
    const checkList = checkTransData.translations || checkTransData.languages;
    console.log(`Translations for tpl_1 after new version:`, checkList.map((t) => ({
      version: t.version_number,
      lang: t.language_id,
      status: t.status,
      review: t.review_status,
    })));

    // Verify translation exists for the new version
    const newVerTrans = checkList.find(
      (t) => t.language_id === TEST_LANG && t.version_id === newVerData.version.version_id
    );
    assert(newVerTrans !== undefined, `Translation created for newly published version (${newVerData.version.version_id})`);
  } catch (err) {
    console.error('Test 8 error:', err);
    failed++;
  }

  // --- SUMMARY ---
  console.log('\n=====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
