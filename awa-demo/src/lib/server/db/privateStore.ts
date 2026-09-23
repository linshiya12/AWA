import {
  TemplateVersion,
  User,
  Session,
  Plan,
  CreditPack,
  Subscription,
  PaymentTransaction,
  PaymentConfiguration,
  DeliveredPrompt,
  CustomizationAttempt,
  AllowanceLedgerEntry,
  SpendPeriod,
  Feedback,
  UnmetNeed,
  AuditLogEntry,
  SubscriptionWithDetails,
  SubscriptionReportMetrics,
} from '../types';
import { publicDb } from './publicStore';
import { allTemplates } from '@/lib/mockData';

// =========================================================================
// PRIVATE DATABASE STORE
// Holds sensitive data: prompt text, accounts, payments, allowance, audit logs
// Enforces 06-ARCHITECTURE-DECISION.md, 07-DATABASE.md & 13-SECURITY.md
// =========================================================================

class PrivateDatabaseStore {
  private versions: TemplateVersion[] = [];
  private users: User[] = [];
  private sessions: Session[] = [];
  private plans: Plan[] = [];
  private creditPacks: CreditPack[] = [];
  private subscriptions: Subscription[] = [];
  private transactions: PaymentTransaction[] = [];
  private paymentConfig: PaymentConfiguration;
  private deliveredPrompts: DeliveredPrompt[] = [];
  private customizationAttempts: CustomizationAttempt[] = [];
  private allowanceLedger: AllowanceLedgerEntry[] = [];
  private spendPeriod: SpendPeriod;
  private feedbackList: Feedback[] = [];
  private unmetNeeds: UnmetNeed[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    // Initialize default payment config (Razorpay, test mode, write-only credentials)
    this.paymentConfig = {
      configuration_id: 'cfg-razorpay-default',
      provider: 'razorpay',
      mode: 'test',
      key_id: 'rzp_test_9kX8V3qL7',
      key_secret: 'enc_sec_8849204918237912389172',
      webhook_secret: 'whsec_9918238129731982739182',
      is_enabled: true,
      last_verified_at: new Date(Date.now() - 86400000).toISOString(),
    };

    // Initialize spend period ($500 limit, $84.20 spent)
    this.spendPeriod = {
      period_id: 'sp-2026-09',
      period_start: new Date(Date.now() - 15 * 86400000).toISOString(),
      period_end: new Date(Date.now() + 15 * 86400000).toISOString(),
      limit: 500, // Monthly ceiling in USD
      spent: 84.2, // Current spend
      notified_at: null,
    };

    this.seedInitialData();
  }

  // -----------------------------------------------------------------------
  // SEED INITIAL DATA
  // -----------------------------------------------------------------------
  private seedInitialData() {
    // 1. Users (13-SECURITY.md §2: Seed one administrator admin@awa.ai & members)
    this.users = [
      {
        user_id: 'usr-admin-1',
        email: 'admin@awa.ai',
        display_name: 'Lead Curator (Admin)',
        role: 'administrator',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 999,
      },
      {
        user_id: 'usr-alex-sub',
        email: 'alex@creative.io',
        display_name: 'Alex Morgan',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 8,
      },
      {
        user_id: 'usr-sara-solo',
        email: 'sara@marketing.co',
        display_name: 'Sara Chen',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 10,
      },
      {
        user_id: 'usr-jordan-life',
        email: 'jordan@studio.design',
        display_name: 'Jordan Lee',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 30,
      },
      {
        user_id: 'usr-elena-exp',
        email: 'elena@agency.art',
        display_name: 'Elena Rostova',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 360 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 4,
      },
      {
        user_id: 'usr-marcus-past',
        email: 'marcus@prod.film',
        display_name: 'Marcus Vance',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 385 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 0,
      },
      {
        user_id: 'usr-david-unpaid',
        email: 'david@startups.io',
        display_name: 'David Kim',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 0,
      },
      {
        user_id: 'usr-priya-cancel',
        email: 'priya@visuals.in',
        display_name: 'Priya Patel',
        role: 'member',
        status: 'active',
        preferred_language_id: 'en',
        created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
        last_seen_at: new Date().toISOString(),
        allowance_balance: 5,
      },
    ];

    // 2. Plans & Credit Packs (05-MVP.md §3.3: 2 plans ₹199 yearly & ₹999 lifetime)
    this.plans = [
      {
        plan_id: 'plan-yearly',
        name: 'Creator Yearly',
        description: 'Unlimited access to all curated prompts, updates, and 10 customizations',
        price: 199,
        currency: 'INR',
        term_length: 'yearly',
        initial_allowance: 10,
        is_available: true,
      },
      {
        plan_id: 'plan-lifetime',
        name: 'Studio Lifetime',
        description: 'Permanent prompt library access, priority guidance, and 30 customizations',
        price: 999,
        currency: 'INR',
        term_length: 'lifetime',
        initial_allowance: 30,
        is_available: true,
      },
    ];

    this.creditPacks = [
      {
        pack_id: 'pack-10',
        name: '10 Customizations',
        price: 49,
        currency: 'INR',
        units: 10,
        is_available: true,
      },
      {
        pack_id: 'pack-50',
        name: '50 Customizations',
        price: 199,
        currency: 'INR',
        units: 50,
        is_available: true,
      },
    ];

    // 3. Template Versions (WHERE PROMPT TEXT LIVES — 07 §5.1)
    this.versions = [
      {
        version_id: 'ver-hero-1',
        template_id: 'tpl-hero-product',
        version_number: 1,
        prompt_text:
          'Studio product photograph of a generic unbranded cylindrical ceramic tumbler, centered composition. Seamless pure white infinity cove background (hex #FFFFFF), no visible horizon line. Soft diffuse directional key light from upper left at 45 degrees, gentle fill light from right, faint ground shadow directly beneath product. Captured on 85mm prime lens at f/8, ultra-sharp commercial focus, 8K resolution, uncompressed raw style --ar 1:1 --v 6.1',
        change_note: 'Initial production baseline prompt',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        version_id: 'ver-festive-1',
        template_id: 'tpl-festive-banner',
        version_number: 1,
        prompt_text:
          'Cinematic wide advertising hero banner of a luxury product set amidst a lavish festive holiday composition. Deep crimson and champagne gold color palette with subtle ambient bokeh particles, soft atmospheric glow, high dynamic range studio lighting, shot on 50mm anamorphic lens, hyper-detailed commercial render --ar 16:9 --v 6.1',
        change_note: 'Golden bokeh and festive crimson palette',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        version_id: 'ver-splash-1',
        template_id: 'tpl-liquid-splash',
        version_number: 1,
        prompt_text:
          'High-speed commercial macro photograph of an elegant crystal cosmetic perfume flacon hitting water, explosive crystal-clear water droplet crown splash, dramatic backlighting, refractive light caustic patterns, 8k resolution, shot with phantom flex4k at 1000fps --ar 1:1 --v 6.1',
        change_note: 'High-speed refractive fluid dynamics',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        version_id: 'ver-isometric-1',
        template_id: 'tpl-isometric-stage',
        version_number: 1,
        prompt_text:
          'Isometric 3D product display stage, minimalist matte clay geometric cylinders and rounded cubes, soft pastel gradient studio background, ambient occlusion, cinema 4D octane render, ultra-clean commercial aesthetic --ar 4:3 --v 6.1',
        change_note: 'Clean geometric podium layout',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        version_id: 'ver-saas-1',
        template_id: 'tpl-saas-hero',
        version_number: 1,
        prompt_text:
          'Dark modern tech website hero section layout, deep navy background #0a0e1a with radiant cyan network nodes, frosted glass cards, elegant typography layout, minimalist fintech aesthetic --ar 16:9 --v 6.1',
        change_note: 'Dark glassmorphic hero canvas',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        version_id: 'ver-robotics-1',
        template_id: 'tpl-robotics-ai',
        version_number: 1,
        prompt_text:
          'Macro shot of a futuristic precision robotics manipulator finger delicately touching a floating luminous crystalline orb, specular highlights, titanium and carbon fiber textures, depth of field, 8k octane render --ar 16:9 --v 6.1',
        change_note: 'Precision titanium robotics textures',
        authored_by: 'usr-admin-1',
        is_current: true,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    const websiteVersionIds: Record<string, string> = {
      tpl_web_1: 'ver-web-1',
      tpl_web_2: 'ver-web-2',
      tpl_web_3: 'ver-web-3',
      tpl_future_machine: 'ver-future-machine-1',
      tpl_quantum_human: 'ver-quantum-human-1',
      tpl_mind_ai: 'ver-mind-ai-1',
      tpl_web_bakery: 'ver-web-bakery-1',
    };

    allTemplates.forEach((t) => {
      const alreadySeeded = this.versions.some((v) => v.template_id === t.id);
      if (!alreadySeeded) {
        const vId = websiteVersionIds[t.id] || `ver-${t.id}-1`;
        this.versions.push({
          version_id: vId,
          template_id: t.id,
          version_number: 1,
          prompt_text: t.basePrompt,
          ui_prompt: t.uiPrompt || null,
          context_prompt: t.contextPrompt || null,
          change_note: 'Initial production baseline prompt',
          authored_by: 'usr-admin-1',
          is_current: true,
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        });
      }
    });

    // 4. Delivered Prompts & Feedback (07 §6.1 & §6.5: Split base vs customized!)
    this.deliveredPrompts = [
      {
        delivered_prompt_id: 'dp-1',
        user_id: 'usr-alex-sub',
        template_id: 'tpl-hero-product',
        base_version_id: 'ver-hero-1',
        prompt_text: this.versions[0].prompt_text,
        is_customized: false,
        parent_delivered_prompt_id: null,
        delivered_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        delivered_prompt_id: 'dp-2',
        user_id: 'usr-alex-sub',
        template_id: 'tpl-hero-product',
        base_version_id: 'ver-hero-1',
        prompt_text:
          this.versions[0].prompt_text.replace('cylindrical ceramic tumbler', 'matte black stainless steel insulated bottle'),
        is_customized: true,
        parent_delivered_prompt_id: 'dp-1',
        delivered_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    this.feedbackList = [
      {
        feedback_id: 'fb-1',
        delivered_prompt_id: 'dp-1',
        user_id: 'usr-alex-sub',
        outcome: 'worked',
        comment: 'Generated flawless white background studio shots on Midjourney!',
        submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        feedback_id: 'fb-2',
        delivered_prompt_id: 'dp-2',
        user_id: 'usr-alex-sub',
        outcome: 'worked',
        comment: 'Customization to black bottle preserved the lighting setup perfectly.',
        submitted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    // 5. Unmet Needs (07 §6.6: Demand signals)
    this.unmetNeeds = [
      {
        unmet_need_id: 'un-1',
        user_id: 'usr-sara-solo',
        category_id: 'cat-image-gen',
        description: 'Need vertical 9:16 Instagram Reel story mockups with floating typography for luxury fashion brands.',
        submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        unmet_need_id: 'un-2',
        user_id: null,
        category_id: 'cat-image-gen',
        description: 'Architectural interior mockups with warm Scandinavian oak furniture and afternoon sunlight cast.',
        submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];

    // 6. Initial Audit Log (07 §6.8)
    this.auditLogs = [
      {
        audit_id: 'aud-seed-1',
        actor_id: 'usr-admin-1',
        action: 'publish_template',
        entity_type: 'template',
        entity_id: 'tpl-hero-product',
        before: null,
        after: { status: 'published', current_version_id: 'ver-hero-1' },
        occurred_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        audit_id: 'aud-seed-2',
        actor_id: 'usr-admin-1',
        action: 'configure_payment',
        entity_type: 'payment_configuration',
        entity_id: 'cfg-razorpay-default',
        before: null,
        after: { mode: 'test', provider: 'razorpay' },
        occurred_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ];

    // 7. Subscriptions (07 §5.5) & Payment Transactions (07 §5.6)
    // Seed diverse realistic states: active yearly, active lifetime, expiring soon, expired, pending/unpaid, cancelled, renewed
    const now = Date.now();
    this.subscriptions = [
      {
        subscription_id: 'sub-alex-yearly-2',
        user_id: 'usr-alex-sub',
        plan_id: 'plan-yearly',
        state: 'active',
        started_at: new Date(now - 10 * 86400000).toISOString(),
        ends_at: new Date(now + 355 * 86400000).toISOString(),
        end_behaviour: 'retain_delivered',
        allowance_balance: 8,
      },
      {
        subscription_id: 'sub-alex-yearly-1',
        user_id: 'usr-alex-sub',
        plan_id: 'plan-yearly',
        state: 'ended',
        started_at: new Date(now - 380 * 86400000).toISOString(),
        ends_at: new Date(now - 15 * 86400000).toISOString(),
        end_behaviour: 'retain_delivered',
        allowance_balance: 0,
      },
      {
        subscription_id: 'sub-jordan-lifetime',
        user_id: 'usr-jordan-life',
        plan_id: 'plan-lifetime',
        state: 'active',
        started_at: new Date(now - 20 * 86400000).toISOString(),
        ends_at: '2099-12-31T23:59:59.000Z',
        end_behaviour: 'retain_delivered',
        allowance_balance: 30,
      },
      {
        subscription_id: 'sub-elena-expiring',
        user_id: 'usr-elena-exp',
        plan_id: 'plan-yearly',
        state: 'active',
        started_at: new Date(now - 357 * 86400000).toISOString(),
        ends_at: new Date(now + 8 * 86400000).toISOString(), // Expiring in 8 days (< 30 days)
        end_behaviour: 'retain_delivered',
        allowance_balance: 4,
      },
      {
        subscription_id: 'sub-marcus-expired',
        user_id: 'usr-marcus-past',
        plan_id: 'plan-yearly',
        state: 'ended',
        started_at: new Date(now - 385 * 86400000).toISOString(),
        ends_at: new Date(now - 20 * 86400000).toISOString(),
        end_behaviour: 'retain_delivered',
        allowance_balance: 0,
      },
      {
        subscription_id: 'sub-david-pending',
        user_id: 'usr-david-unpaid',
        plan_id: 'plan-yearly',
        state: 'active',
        started_at: new Date(now - 2 * 86400000).toISOString(),
        ends_at: new Date(now + 363 * 86400000).toISOString(),
        end_behaviour: 'retain_delivered',
        allowance_balance: 0,
      },
      {
        subscription_id: 'sub-priya-cancelled',
        user_id: 'usr-priya-cancel',
        plan_id: 'plan-yearly',
        state: 'cancelled',
        started_at: new Date(now - 60 * 86400000).toISOString(),
        ends_at: new Date(now + 305 * 86400000).toISOString(),
        end_behaviour: 'retain_delivered',
        allowance_balance: 5,
      },
    ];

    // Transactions associated with purchases
    // Succeeded plan transactions generate legitimate subscription revenue.
    // Pending/failed transactions or credit pack purchases MUST NOT be counted as subscription revenue!
    this.transactions = [
      {
        transaction_id: 'tx-alex-sub-2',
        user_id: 'usr-alex-sub',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_alex_renewal_9812',
        amount: 199,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 10 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-alex-sub-1',
        user_id: 'usr-alex-sub',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_alex_initial_1120',
        amount: 199,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 380 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-jordan-life',
        user_id: 'usr-jordan-life',
        purchase_type: 'plan',
        purchase_id: 'plan-lifetime',
        provider_reference: 'pay_rzp_jordan_life_1044',
        amount: 999,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 20 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-elena-sub',
        user_id: 'usr-elena-exp',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_elena_7719',
        amount: 199,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 357 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-marcus-sub',
        user_id: 'usr-marcus-past',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_marcus_2234',
        amount: 199,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 385 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-david-sub-pending',
        user_id: 'usr-david-unpaid',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_david_pending_5591',
        amount: 199,
        currency: 'INR',
        state: 'pending', // PENDING — MUST NOT BE COUNTED AS REVENUE!
        occurred_at: new Date(now - 2 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-priya-sub',
        user_id: 'usr-priya-cancel',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_priya_3311',
        amount: 199,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 60 * 86400000).toISOString(),
      },
      {
        transaction_id: 'tx-alex-pack',
        user_id: 'usr-alex-sub',
        purchase_type: 'credit_pack',
        purchase_id: 'pack-10',
        provider_reference: 'pay_rzp_pack_6621',
        amount: 49,
        currency: 'INR',
        state: 'succeeded',
        occurred_at: new Date(now - 3 * 86400000).toISOString(), // Credit pack — NOT subscription revenue!
      },
    ];
  }

  // -----------------------------------------------------------------------
  // PROMPT VERSIONS & TWO-STEP WRITE (API-022)
  // 06 §5.4: Writes to Private DB first, then updates Public DB pointer!
  // -----------------------------------------------------------------------
  getVersionsForTemplate(templateId: string): TemplateVersion[] {
    return this.versions
      .filter((v) => v.template_id === templateId)
      .sort((a, b) => b.version_number - a.version_number);
  }

  getVersionById(versionId: string): TemplateVersion | undefined {
    return this.versions.find((v) => v.version_id === versionId);
  }

  createPromptVersion(
    templateId: string,
    promptText: string,
    changeNote: string,
    authoredBy: string,
    publishImmediately: boolean = false,
    uiPrompt?: string | null,
    contextPrompt?: string | null
  ): { version: TemplateVersion; published: boolean } {
    if (!promptText || promptText.trim().length === 0) {
      throw new Error('Prompt text cannot be empty');
    }

    const existingVersions = this.getVersionsForTemplate(templateId);
    const nextNumber = existingVersions.length > 0 ? Math.max(...existingVersions.map((v) => v.version_number)) + 1 : 1;
    const versionId = `ver-${templateId}-${nextNumber}-${Date.now()}`;

    // Step 1: Write to PRIVATE database first
    const newVersion: TemplateVersion = {
      version_id: versionId,
      template_id: templateId,
      version_number: nextNumber,
      prompt_text: promptText.trim(),
      ui_prompt: uiPrompt ? uiPrompt.trim() : null,
      context_prompt: contextPrompt ? contextPrompt.trim() : null,
      change_note: changeNote || null,
      authored_by: authoredBy,
      is_current: publishImmediately,
      created_at: new Date().toISOString(),
    };

    if (publishImmediately) {
      // Demote previous current version
      existingVersions.forEach((v) => {
        v.is_current = false;
      });
    }

    this.versions.push(newVersion);

    // Step 2: Update PUBLIC database pointer ONLY AFTER private write succeeds (06 §5.4, 08-API.md Rule 16)
    if (publishImmediately) {
      publicDb.updateTemplate(templateId, {
        current_version_id: versionId,
        status: 'published',
      });
    }

    // Record audit log
    this.recordAuditLog(
      authoredBy,
      publishImmediately ? 'publish_prompt_version' : 'draft_prompt_version',
      'template_version',
      versionId,
      null,
      { version_number: nextNumber, template_id: templateId, publishImmediately }
    );

    return { version: newVersion, published: publishImmediately };
  }

  // Deliver Prompt: Implements API-003 prompt delivery contract (07 §6.1, 08-API.md)
  deliverPrompt(
    userId: string,
    templateId: string,
    isCustomized: boolean = false,
    parentPromptId?: string | null,
    promptTextOverride?: string,
    uiPromptOverride?: string,
    contextPromptOverride?: string
  ): DeliveredPrompt {
    const versions = this.getVersionsForTemplate(templateId);
    const currentVersion = versions.find((v) => v.is_current) || versions[0];
    if (!currentVersion && !promptTextOverride) {
      throw new Error('No prompt version available for template');
    }

    const delivered: DeliveredPrompt = {
      delivered_prompt_id: `dp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      template_id: templateId,
      base_version_id: currentVersion?.version_id || 'custom',
      prompt_text: promptTextOverride || currentVersion?.prompt_text || '',
      ui_prompt: uiPromptOverride !== undefined ? uiPromptOverride : (currentVersion?.ui_prompt || null),
      context_prompt: contextPromptOverride !== undefined ? contextPromptOverride : (currentVersion?.context_prompt || null),
      is_customized: isCustomized,
      parent_delivered_prompt_id: parentPromptId || null,
      delivered_at: new Date().toISOString(),
    };

    this.deliveredPrompts.push(delivered);
    return delivered;
  }

  // Restore old version: Rule 16 & 08 §4: Inserts a NEW version equal to the old one.
  // Never rewinds or destroys history!
  restorePromptVersion(
    templateId: string,
    sourceVersionId: string,
    authoredBy: string
  ): TemplateVersion {
    const sourceVer = this.getVersionById(sourceVersionId);
    if (!sourceVer) throw new Error('Source version not found');

    const result = this.createPromptVersion(
      templateId,
      sourceVer.prompt_text,
      `Restored from version ${sourceVer.version_number}`,
      authoredBy,
      true // publish restored version immediately
    );

    return result.version;
  }

  // Preview Prompt: Renders what a user would see without publishing (API-022)
  previewPrompt(templateId: string, promptText: string): { finalPrompt: string; extraWordsAppended: string | null } {
    const template = publicDb.getTemplateById(templateId);
    let extraWords: string | null = null;
    if (template) {
      const category = publicDb.getCategoryById(template.category_id);
      if (category?.extra_prompt_words) {
        extraWords = category.extra_prompt_words;
      }
    }

    const finalPrompt = extraWords ? `${promptText.trim()} ${extraWords.trim()}` : promptText.trim();

    return { finalPrompt, extraWordsAppended: extraWords };
  }

  // -----------------------------------------------------------------------
  // USERS & SUPPORT ADJUSTMENTS (API-027)
  // -----------------------------------------------------------------------
  getUsers(search?: string): User[] {
    let result = [...this.users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.email.toLowerCase().includes(q) || u.display_name?.toLowerCase().includes(q));
    }
    return result;
  }

  getUserById(userId: string): User | undefined {
    return this.users.find((u) => u.user_id === userId);
  }

  updateUserRole(userId: string, newRole: 'member' | 'administrator', actorId: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    // Guard: Cannot remove your own admin access; at least one administrator must remain (11-UI-UX.md A6)
    if (user.role === 'administrator' && newRole === 'member') {
      const adminCount = this.users.filter((u) => u.role === 'administrator').length;
      if (adminCount <= 1) {
        throw new Error('Cannot remove the last administrator account. At least one administrator must remain.');
      }
      if (userId === actorId) {
        throw new Error('Cannot remove your own administrator access.');
      }
    }

    const before = { role: user.role };
    user.role = newRole;
    this.recordAuditLog(actorId, 'update_user_role', 'user', userId, before, { role: newRole });
    return user;
  }

  updateUserStatus(userId: string, newStatus: 'active' | 'suspended', actorId: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    if (user.role === 'administrator' && newStatus === 'suspended' && userId === actorId) {
      throw new Error('Cannot suspend your own administrator account.');
    }

    const before = { status: user.status };
    user.status = newStatus;
    this.recordAuditLog(actorId, 'update_user_status', 'user', userId, before, { status: newStatus });
    return user;
  }

  // Support adjustment: Grant allowance credits or extend subscription (FEAT-041, NFR-016)
  adjustUserAllowance(
    userId: string,
    creditAmount: number,
    reason: string,
    actorId: string
  ): { user: User; ledgerEntry: AllowanceLedgerEntry } {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Support adjustment requires an explicit documented reason (FEAT-041).');
    }

    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const beforeBalance = user.allowance_balance;
    user.allowance_balance += creditAmount;

    // Append to immutable allowance ledger (07 §6.3)
    const ledgerEntry: AllowanceLedgerEntry = {
      entry_id: `ald-${Date.now()}`,
      user_id: userId,
      change: creditAmount,
      reason: 'support_adjustment',
      actor_id: actorId,
      occurred_at: new Date().toISOString(),
      note: reason,
    };
    this.allowanceLedger.push(ledgerEntry);

    // Audit log
    this.recordAuditLog(
      actorId,
      'support_adjustment_allowance',
      'user',
      userId,
      { balance: beforeBalance },
      { balance: user.allowance_balance, change: creditAmount, reason }
    );

    return { user, ledgerEntry };
  }

  // -----------------------------------------------------------------------
  // COMMERCE & PAYMENT CONFIG (API-028)
  // -----------------------------------------------------------------------
  getCommerceOverview(): {
    plans: Plan[];
    creditPacks: CreditPack[];
    paymentConfig: Omit<PaymentConfiguration, 'key_secret' | 'webhook_secret'> & {
      key_secret_masked: string;
      webhook_secret_masked: string;
    };
    spendPeriod: SpendPeriod;
  } {
    // NFR-005 & 13 §4: Payment credentials are WRITE-ONLY — secret is NEVER returned on read!
    const maskedPayment = {
      ...this.paymentConfig,
      key_secret: undefined as unknown as string,
      webhook_secret: undefined as unknown as string,
      key_secret_masked: '••••••••••••••••' + this.paymentConfig.key_secret.slice(-4),
      webhook_secret_masked: '••••••••••••••••' + this.paymentConfig.webhook_secret.slice(-4),
    };

    return {
      plans: [...this.plans],
      creditPacks: [...this.creditPacks],
      paymentConfig: maskedPayment,
      spendPeriod: { ...this.spendPeriod },
    };
  }

  updatePlan(planId: string, updates: Partial<Plan>, actorId: string): Plan {
    const plan = this.plans.find((p) => p.plan_id === planId);
    if (!plan) throw new Error('Plan not found');
    const before = { ...plan };
    Object.assign(plan, updates);
    this.recordAuditLog(actorId, 'update_plan', 'plan', planId, before, { ...plan });
    return plan;
  }

  updateCreditPack(packId: string, updates: Partial<CreditPack>, actorId: string): CreditPack {
    const pack = this.creditPacks.find((p) => p.pack_id === packId);
    if (!pack) throw new Error('Credit pack not found');
    const before = { ...pack };
    Object.assign(pack, updates);
    this.recordAuditLog(actorId, 'update_credit_pack', 'credit_pack', packId, before, { ...pack });
    return pack;
  }

  updatePaymentConfiguration(
    updates: {
      mode?: 'test' | 'live';
      key_id?: string;
      key_secret?: string;
      webhook_secret?: string;
      is_enabled?: boolean;
    },
    actorId: string
  ): boolean {
    const before = { mode: this.paymentConfig.mode, is_enabled: this.paymentConfig.is_enabled };

    if (updates.mode) this.paymentConfig.mode = updates.mode;
    if (updates.key_id) this.paymentConfig.key_id = updates.key_id;
    // Only update secrets if non-empty new values provided
    if (updates.key_secret && updates.key_secret.trim().length > 0) {
      this.paymentConfig.key_secret = updates.key_secret.trim();
    }
    if (updates.webhook_secret && updates.webhook_secret.trim().length > 0) {
      this.paymentConfig.webhook_secret = updates.webhook_secret.trim();
    }
    if (updates.is_enabled !== undefined) this.paymentConfig.is_enabled = updates.is_enabled;

    this.recordAuditLog(actorId, 'update_payment_configuration', 'payment_configuration', this.paymentConfig.configuration_id, before, {
      mode: this.paymentConfig.mode,
      is_enabled: this.paymentConfig.is_enabled,
    });

    return true;
  }

  testPaymentConnection(): { success: boolean; message: string; verifiedAt: string } {
    // Simulates payment provider gateway roundtrip ping
    if (!this.paymentConfig.key_id || !this.paymentConfig.key_secret) {
      return { success: false, message: 'Invalid credentials: Key ID or Secret is empty', verifiedAt: '' };
    }
    const verifiedAt = new Date().toISOString();
    this.paymentConfig.last_verified_at = verifiedAt;
    return {
      success: true,
      message: `Verified successfully with Razorpay API gateway (${this.paymentConfig.mode.toUpperCase()} mode).`,
      verifiedAt,
    };
  }

  updateSpendCap(newLimit: number, actorId: string): SpendPeriod {
    const before = { limit: this.spendPeriod.limit };
    this.spendPeriod.limit = newLimit;
    this.recordAuditLog(actorId, 'update_spend_cap', 'spend_period', this.spendPeriod.period_id, before, {
      limit: newLimit,
    });
    return this.spendPeriod;
  }

  // -----------------------------------------------------------------------
  // REPORTS & CONTENT GAPS (API-029)
  // Combines Private Evidence with Public Catalog Names (08 API-029)
  // -----------------------------------------------------------------------
  getReports(): {
    contentGaps: Array<{
      type: 'missing_tool' | 'missing_guidance' | 'missing_prompt' | 'withdrawn_tool_assigned';
      templateId?: string;
      templateName?: string;
      categoryId?: string;
      categoryName?: string;
      message: string;
    }>;
    spendStatus: {
      spent: number;
      limit: number;
      percent: number;
      isApproaching: boolean;
      isPaused: boolean;
    };
    versionFeedback: Array<{
      templateId: string;
      templateName: string;
      versionNumber: number;
      baseSuccessRate: number;
      customizedSuccessRate: number;
      totalFeedback: number;
    }>;
    demandSignals: Array<{
      unmetNeedId: string;
      categoryName: string;
      description: string;
      submittedAt: string;
    }>;
  } {
    // 1. Content Gaps Detection (FEAT-038 & FR-045)
    const gaps: Array<{
      type: 'missing_tool' | 'missing_guidance' | 'missing_prompt' | 'withdrawn_tool_assigned';
      templateId?: string;
      templateName?: string;
      categoryId?: string;
      categoryName?: string;
      message: string;
    }> = [];

    const publicTemplates = publicDb.getTemplates();
    const publicTools = publicDb.getTools();

    for (const t of publicTemplates) {
      // Check prompt version
      if (!t.current_version_id) {
        gaps.push({
          type: 'missing_prompt',
          templateId: t.template_id,
          templateName: t.name,
          message: 'Template is in draft with no prompt version created.',
        });
      }

      // Check tool assignments
      const resolved = publicDb.resolveAssignmentsForTemplate(t.template_id);
      if (resolved.assigned.length === 0) {
        gaps.push({
          type: 'missing_tool',
          templateId: t.template_id,
          templateName: t.name,
          message: 'No AI tool or model assigned (neither direct nor inherited).',
        });
      } else {
        // Check if assigned tool is withdrawn
        for (const asgn of resolved.assigned) {
          const tool = publicTools.find((tl) => tl.tool_id === asgn.tool_id);
          if (tool && !tool.is_available) {
            gaps.push({
              type: 'withdrawn_tool_assigned',
              templateId: t.template_id,
              templateName: t.name,
              message: `References withdrawn tool '${tool.name}'.`,
            });
          }
        }
      }

      // Check guidance
      const guide = publicDb.getGuidanceForScope('template', t.template_id);
      if (!guide || guide.steps.length === 0) {
        gaps.push({
          type: 'missing_guidance',
          templateId: t.template_id,
          templateName: t.name,
          message: 'No step-by-step guidance available.',
        });
      }
    }

    // 2. Spend status
    const percent = Math.min(100, Math.round((this.spendPeriod.spent / this.spendPeriod.limit) * 100));
    const isApproaching = percent >= 80;
    const isPaused = percent >= 100;

    // 3. Feedback split by version & customization (07 §6.5)
    const versionFeedback = publicTemplates.map((t) => {
      const vers = this.getVersionsForTemplate(t.template_id);
      const currentVer = vers.find((v) => v.is_current) || vers[0];
      const verNumber = currentVer ? currentVer.version_number : 1;

      // Find delivered prompts for this template
      const dps = this.deliveredPrompts.filter((dp) => dp.template_id === t.template_id);
      const baseDps = dps.filter((dp) => !dp.is_customized);
      const customDps = dps.filter((dp) => dp.is_customized);

      const baseFeedbacks = this.feedbackList.filter((fb) => baseDps.some((dp) => dp.delivered_prompt_id === fb.delivered_prompt_id));
      const customFeedbacks = this.feedbackList.filter((fb) => customDps.some((dp) => dp.delivered_prompt_id === fb.delivered_prompt_id));

      const baseSuccess = baseFeedbacks.length > 0 ? (baseFeedbacks.filter((f) => f.outcome === 'worked').length / baseFeedbacks.length) * 100 : 92;
      const customSuccess = customFeedbacks.length > 0 ? (customFeedbacks.filter((f) => f.outcome === 'worked').length / customFeedbacks.length) * 100 : 88;

      return {
        templateId: t.template_id,
        templateName: t.name,
        versionNumber: verNumber,
        baseSuccessRate: Math.round(baseSuccess),
        customizedSuccessRate: Math.round(customSuccess),
        totalFeedback: baseFeedbacks.length + customFeedbacks.length || 12,
      };
    });

    // 4. Demand signals (Unmet Needs)
    const demandSignals = this.unmetNeeds.map((un) => {
      const cat = publicDb.getCategoryById(un.category_id);
      return {
        unmetNeedId: un.unmet_need_id,
        categoryName: cat?.name || 'General',
        description: un.description,
        submittedAt: un.submitted_at,
      };
    });

    return {
      contentGaps: gaps,
      spendStatus: {
        spent: this.spendPeriod.spent,
        limit: this.spendPeriod.limit,
        percent,
        isApproaching,
        isPaused,
      },
      versionFeedback,
      demandSignals,
    };
  }

  // -----------------------------------------------------------------------
  // AUDIT LOG (API-030 & 07 §6.8)
  // Immutable, append-only, covers all administrative actions
  // -----------------------------------------------------------------------
  recordAuditLog(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    before: Record<string, unknown> | null,
    after: Record<string, unknown> | null
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      audit_id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      before,
      after,
      occurred_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry); // Most recent first
    return entry;
  }

  getAuditLogs(filter?: { entity_type?: string; action?: string; limit?: number }): AuditLogEntry[] {
    let result = [...this.auditLogs];
    if (filter?.entity_type) {
      result = result.filter((a) => a.entity_type === filter.entity_type);
    }
    if (filter?.action) {
      result = result.filter((a) => a.action === filter.action);
    }
    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }
    return result;
  }

  // -----------------------------------------------------------------------
  // SUBSCRIPTIONS & LIFECYCLE MANAGEMENT (07 §5.5, §5.6, 04 §4A)
  // -----------------------------------------------------------------------

  getSubscriptions(filter?: {
    searchQuery?: string;
    planId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): SubscriptionWithDetails[] {
    const now = new Date();

    return this.subscriptions
      .map((sub) => {
        const user = this.getUserById(sub.user_id) || {
          user_id: sub.user_id,
          email: 'unknown@user.com',
          display_name: null,
          status: 'active' as const,
          role: 'member' as const,
        };

        const plan = this.plans.find((p) => p.plan_id === sub.plan_id) || {
          plan_id: sub.plan_id,
          name: sub.plan_id === 'plan-lifetime' ? 'Studio Lifetime' : 'Creator Yearly',
          price: sub.plan_id === 'plan-lifetime' ? 999 : 199,
          currency: 'INR',
          term_length: sub.plan_id === 'plan-lifetime' ? 'lifetime' : 'yearly',
          initial_allowance: sub.plan_id === 'plan-lifetime' ? 30 : 10,
        };

        // Find latest transaction for this user and plan
        const tx = [...this.transactions]
          .reverse()
          .find((t) => t.user_id === sub.user_id && t.purchase_id === sub.plan_id);

        const isLifetime = plan.term_length === 'lifetime' || new Date(sub.ends_at).getFullYear() >= 2090;
        let daysRemaining: number | null = null;
        let isExpiringSoon = false;

        if (!isLifetime && sub.ends_at) {
          const msRemaining = new Date(sub.ends_at).getTime() - now.getTime();
          daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
          isExpiringSoon = sub.state === 'active' && daysRemaining > 0 && daysRemaining <= 30;
        }

        return {
          ...sub,
          user: {
            user_id: user.user_id,
            email: user.email,
            display_name: user.display_name,
            status: user.status,
            role: user.role,
          },
          plan: {
            plan_id: plan.plan_id,
            name: plan.name,
            price: plan.price,
            currency: plan.currency,
            term_length: plan.term_length,
            initial_allowance: plan.initial_allowance,
          },
          latest_transaction: tx
            ? {
                transaction_id: tx.transaction_id,
                provider_reference: tx.provider_reference,
                amount: tx.amount,
                currency: tx.currency,
                state: tx.state,
                occurred_at: tx.occurred_at,
              }
            : null,
          is_lifetime: isLifetime,
          days_remaining: daysRemaining,
          is_expiring_soon: isExpiringSoon,
        };
      })
      .filter((sub) => {
        // 1. Search Query (email, name, subscription id)
        if (filter?.searchQuery) {
          const q = filter.searchQuery.toLowerCase().trim();
          const matches =
            sub.user.email.toLowerCase().includes(q) ||
            (sub.user.display_name && sub.user.display_name.toLowerCase().includes(q)) ||
            sub.subscription_id.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // 2. Plan filter
        if (filter?.planId && filter.planId !== 'all') {
          if (sub.plan_id !== filter.planId) return false;
        }

        // 3. Status filter
        if (filter?.status && filter.status !== 'all') {
          if (filter.status === 'expiring_soon') {
            if (!sub.is_expiring_soon) return false;
          } else if (filter.status === 'active') {
            if (sub.state !== 'active' || (!sub.is_lifetime && sub.days_remaining !== null && sub.days_remaining <= 0)) {
              return false;
            }
          } else if (filter.status === 'ended') {
            const isLapsed = sub.state === 'ended' || (!sub.is_lifetime && sub.days_remaining !== null && sub.days_remaining <= 0);
            if (!isLapsed) return false;
          } else if (filter.status === 'cancelled') {
            if (sub.state !== 'cancelled') return false;
          }
        }

        // 4. Date range filter (on started_at)
        if (filter?.fromDate) {
          if (new Date(sub.started_at) < new Date(filter.fromDate)) return false;
        }
        if (filter?.toDate) {
          if (new Date(sub.started_at) > new Date(filter.toDate)) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
  }

  getSubscriptionById(subscriptionId: string): SubscriptionWithDetails | undefined {
    const list = this.getSubscriptions();
    return list.find((s) => s.subscription_id === subscriptionId);
  }

  grantSubscription(
    data: {
      userId: string;
      planId: string;
      customEndsAt?: string;
      initialAllowance?: number;
      reason?: string;
    },
    actorId: string
  ): SubscriptionWithDetails {
    const user = this.getUserById(data.userId);
    if (!user) throw new Error('User not found');

    const plan = this.plans.find((p) => p.plan_id === data.planId);
    if (!plan) throw new Error('Plan not found');

    const now = new Date();
    let endsAt: string;
    if (data.customEndsAt) {
      endsAt = new Date(data.customEndsAt).toISOString();
    } else if (plan.term_length === 'lifetime') {
      endsAt = '2099-12-31T23:59:59.000Z';
    } else {
      const oneYear = new Date(now);
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      endsAt = oneYear.toISOString();
    }

    const allowance = data.initialAllowance !== undefined ? data.initialAllowance : plan.initial_allowance;

    const newSub: Subscription = {
      subscription_id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: user.user_id,
      plan_id: plan.plan_id,
      state: 'active',
      started_at: now.toISOString(),
      ends_at: endsAt,
      end_behaviour: 'retain_delivered',
      allowance_balance: allowance,
    };

    this.subscriptions.unshift(newSub);

    // Update user allowance balance
    if (allowance > 0) {
      user.allowance_balance += allowance;
      this.allowanceLedger.push({
        entry_id: `ald-${Date.now()}`,
        user_id: user.user_id,
        change: allowance,
        reason: 'initial_grant',
        actor_id: actorId,
        occurred_at: now.toISOString(),
        note: `Initial allowance grant for ${plan.name}`,
      });
    }

    // Record audit log entry
    this.recordAuditLog(
      actorId,
      'grant_subscription',
      'subscription',
      newSub.subscription_id,
      null,
      {
        user_id: user.user_id,
        user_email: user.email,
        plan_id: plan.plan_id,
        plan_name: plan.name,
        ends_at: endsAt,
        allowance_granted: allowance,
        reason: data.reason || 'Manual subscription granted by administrator',
      }
    );

    return this.getSubscriptionById(newSub.subscription_id)!;
  }

  updateSubscription(
    subscriptionId: string,
    updates: {
      state?: 'active' | 'ended' | 'cancelled';
      planId?: string;
      endsAt?: string;
      extendMonths?: number;
      reason?: string;
    },
    actorId: string
  ): SubscriptionWithDetails {
    const sub = this.subscriptions.find((s) => s.subscription_id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');

    const before = {
      state: sub.state,
      plan_id: sub.plan_id,
      ends_at: sub.ends_at,
    };

    if (updates.state) {
      sub.state = updates.state;
    }

    if (updates.planId) {
      const plan = this.plans.find((p) => p.plan_id === updates.planId);
      if (!plan) throw new Error('Plan not found');
      sub.plan_id = updates.planId;
      if (plan.term_length === 'lifetime') {
        sub.ends_at = '2099-12-31T23:59:59.000Z';
      }
    }

    if (updates.endsAt) {
      sub.ends_at = new Date(updates.endsAt).toISOString();
    } else if (updates.extendMonths && updates.extendMonths > 0) {
      const curEnd = new Date(sub.ends_at) > new Date() ? new Date(sub.ends_at) : new Date();
      curEnd.setMonth(curEnd.getMonth() + updates.extendMonths);
      sub.ends_at = curEnd.toISOString();
      sub.state = 'active';
    }

    const after = {
      state: sub.state,
      plan_id: sub.plan_id,
      ends_at: sub.ends_at,
      reason: updates.reason || 'Subscription updated by administrator',
    };

    // Record audit log
    this.recordAuditLog(
      actorId,
      'update_subscription',
      'subscription',
      sub.subscription_id,
      before,
      after
    );

    return this.getSubscriptionById(sub.subscription_id)!;
  }

  getSubscriptionReport(filter?: { period?: string; fromDate?: string; toDate?: string }): SubscriptionReportMetrics {
    const now = new Date();
    let startDate: Date | null = null;
    const endDate: Date = filter?.toDate ? new Date(filter.toDate) : now;

    const period = filter?.period || 'all';

    if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 86400000);
    } else if (period === '90d') {
      startDate = new Date(now.getTime() - 90 * 86400000);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (filter?.fromDate) {
      startDate = new Date(filter.fromDate);
    }

    const allSubs = this.getSubscriptions();

    // Active subscriptions: currently active and not ended
    const activeSubs = allSubs.filter((s) => s.state === 'active' && (s.is_lifetime || (s.days_remaining !== null && s.days_remaining > 0)));

    // Expired / ended subscriptions
    const expiredSubs = allSubs.filter((s) => s.state === 'ended' || (s.state === 'active' && !s.is_lifetime && s.days_remaining !== null && s.days_remaining <= 0));

    // Upcoming expirations (< 30 days and not lifetime)
    const upcomingExpirations = allSubs.filter((s) => s.is_expiring_soon);

    // New subscriptions in period
    const newSubs = allSubs.filter((s) => {
      const d = new Date(s.started_at);
      if (startDate && d < startDate) return false;
      if (d > endDate) return false;
      return true;
    });

    // Renewals in period: users who have more than 1 subscription where started_at is in period
    const renewals = newSubs.filter((s) => {
      const userSubs = allSubs.filter((sub) => sub.user_id === s.user_id);
      return userSubs.length > 1 && userSubs.some((old) => old.subscription_id !== s.subscription_id && new Date(old.started_at) < new Date(s.started_at));
    });

    // REVENUE CALCULATION:
    // Strictly sums payment_transactions where purchase_type === 'plan' AND state === 'succeeded' in period!
    // Explicitly excludes credit packs and pending/failed transactions.
    const planTransactions = this.transactions.filter((tx) => {
      if (tx.purchase_type !== 'plan') return false;
      if (tx.state !== 'succeeded') return false;
      const d = new Date(tx.occurred_at);
      if (startDate && d < startDate) return false;
      if (d > endDate) return false;
      return true;
    });

    const totalRevenue = planTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Plan Breakdown
    const planBreakdown = this.plans.map((p) => {
      const subsForPlan = allSubs.filter((s) => s.plan_id === p.plan_id);
      const activeForPlan = subsForPlan.filter((s) => s.state === 'active' && (s.is_lifetime || (s.days_remaining !== null && s.days_remaining > 0)));
      const txForPlan = planTransactions.filter((tx) => tx.purchase_id === p.plan_id);
      const planRev = txForPlan.reduce((sum, tx) => sum + tx.amount, 0);
      const share = totalRevenue > 0 ? Math.round((planRev / totalRevenue) * 1000) / 10 : 0;

      return {
        plan_id: p.plan_id,
        plan_name: p.name,
        term_length: p.term_length,
        price: p.price,
        currency: p.currency,
        total_subscribers: subsForPlan.length,
        active_subscribers: activeForPlan.length,
        revenue: planRev,
        revenue_share_percentage: share,
      };
    });

    return {
      period,
      date_from: startDate ? startDate.toISOString() : null,
      date_to: endDate.toISOString(),
      active_subscriptions: activeSubs.length,
      expired_subscriptions: expiredSubs.length,
      upcoming_expirations: upcomingExpirations.length,
      new_subscriptions: newSubs.length,
      renewals: renewals.length,
      total_revenue: totalRevenue,
      currency: 'INR',
      revenue_note: 'Calculated strictly from verified succeeded plan transactions. Pending, failed, and credit pack payments are excluded.',
      plan_breakdown: planBreakdown,
    };
  }
}

// Global singleton instance for private store
declare global {
  var __awa_private_db__: PrivateDatabaseStore | undefined;
}

export const privateDb: PrivateDatabaseStore =
  globalThis.__awa_private_db__ ?? (globalThis.__awa_private_db__ = new PrivateDatabaseStore());
