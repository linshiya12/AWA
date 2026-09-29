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
  UserCollection,
  UserCollectionWithDetails,
  TemplatePromptTranslation,
  LanguageTranslationProgress,
  SupportTicket,
  SupportTicketMessage,
  SupportTicketStatus,
  SupportTicketCategory,
  SupportTicketSummaryCounts,
  SupportTicketAttachment,
  SupportTicketStatusHistoryItem,
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
  private userCollections: UserCollection[] = [];
  private promptTranslations: TemplatePromptTranslation[] = [];
  private languageProgress: Map<string, LanguageTranslationProgress> = new Map();
  private supportTickets: SupportTicket[] = [];

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
      {
        transaction_id: 'tx-failed-renewal-881',
        user_id: 'usr-david-unpaid',
        purchase_type: 'plan',
        purchase_id: 'plan-yearly',
        provider_reference: 'pay_rzp_fail_8812',
        amount: 199,
        currency: 'INR',
        state: 'failed', // Real failed payment for needs-attention tracking
        occurred_at: new Date(now - 1 * 86400000).toISOString(),
      },
    ];

    // 8. User Saved Collections (Member Personal Collections)
    this.userCollections = [
      {
        collection_id: 'col-user-1',
        user_id: 'usr-alex-sub',
        name: 'Q4 Product Showcase',
        description: 'Clean studio hero shots and marine splash assets for our upcoming bottle packaging launch.',
        template_ids: ['tpl_1', 'tpl_img_aquatic', 'tpl_3'],
        created_at: new Date(now - 8 * 86400000).toISOString(),
        updated_at: new Date(now - 2 * 86400000).toISOString(),
      },
      {
        collection_id: 'col-user-2',
        user_id: 'usr-alex-sub',
        name: 'Social Launch Reel Assets',
        description: 'Short form dynamic video templates for TikTok & Instagram Reels.',
        template_ids: ['tpl_video_reel', 'tpl_video_1'],
        created_at: new Date(now - 4 * 86400000).toISOString(),
        updated_at: new Date(now - 1 * 86400000).toISOString(),
      },
      {
        collection_id: 'col-user-3',
        user_id: 'usr-sara-solo',
        name: 'SaaS Redesign & Hero Options',
        description: 'Dark mode landing pages with telemetry and interactive 3D components.',
        template_ids: ['tpl_web_1', 'tpl_web_2', 'tpl_3d_timepiece', 'tpl_web_3'],
        created_at: new Date(now - 14 * 86400000).toISOString(),
        updated_at: new Date(now - 6 * 86400000).toISOString(),
      },
      {
        collection_id: 'col-user-4',
        user_id: 'usr-jordan-life',
        name: 'Executive Keynotes 2026',
        description: 'Boardroom reports and investor pitch deck slides with clean data cards.',
        template_ids: ['tpl_slide_1', 'tpl_slide_edu', 'tpl_slide_3'],
        created_at: new Date(now - 20 * 86400000).toISOString(),
        updated_at: new Date(now - 5 * 86400000).toISOString(),
      },
      {
        collection_id: 'col-user-5',
        user_id: 'usr-elena-exp',
        name: 'Fashion Lookbook Editorial',
        description: 'Sculptural drapery, leather goods, and high-fashion Scandinavian interior staging.',
        template_ids: ['tpl_img_couture', 'tpl_img_museum', 'tpl_2'],
        created_at: new Date(now - 12 * 86400000).toISOString(),
        updated_at: new Date(now - 3 * 86400000).toISOString(),
      },
      {
        collection_id: 'col-user-6',
        user_id: 'usr-marcus-past',
        name: 'Ambient Motion Backgrounds',
        description: 'Deep sea bioluminescence and macro fluid splash loops for web banners.',
        template_ids: ['tpl_video_jellyfish', 'tpl_video_2'],
        created_at: new Date(now - 18 * 86400000).toISOString(),
        updated_at: new Date(now - 10 * 86400000).toISOString(),
      },
    ];

    // 8. Seed Support Tickets (Private Support Database)
    this.seedSupportTickets();
  }

  seedSupportTickets() {
    const now = Date.now();
    this.supportTickets = [
      {
        ticket_id: 'tkt-1001',
        ticket_number: 1001,
        user_id: 'usr-alex-sub',
        user_email: 'alex@creative.io',
        user_name: 'Alex Morgan',
        subject: "Prompt rewrite didn't preserve the metallic rim detail",
        category: 'prompt_customization',
        status: 'open',
        related_template_id: 'tpl_1',
        related_attempt_id: 'att-alex-01',
        assigned_to_user_id: null,
        assigned_to_name: null,
        is_read_by_admin: false,
        is_read_by_user: true,
        created_at: new Date(now - 3 * 3600000).toISOString(),
        updated_at: new Date(now - 3 * 3600000).toISOString(),
        status_history: [
          {
            history_id: 'sh-101',
            status: 'open',
            changed_by_user_id: 'usr-alex-sub',
            changed_by_name: 'Alex Morgan',
            changed_at: new Date(now - 3 * 3600000).toISOString(),
            note: 'Ticket created by user',
          },
        ],
        messages: [
          {
            message_id: 'msg-1001',
            ticket_id: 'tkt-1001',
            sender_id: 'usr-alex-sub',
            sender_role: 'user',
            sender_name: 'Alex Morgan',
            content:
              'Hi team! I tried customizing the "Plain product on white" template to add brushed gold metallic rims to the tumbler. However, the generated prompt rewrote the lighting completely and dropped the rim texture. Could you advise how to phrase the customization so Midjourney keeps the lighting setup intact?',
            is_internal_note: false,
            attachments: [
              {
                attachment_id: 'att-scr-1',
                file_name: 'customization-error.png',
                file_type: 'image/png',
                url: '/images/guidance/tpl_1/step-1.svg',
                size_bytes: 42100,
              },
            ],
            created_at: new Date(now - 3 * 3600000).toISOString(),
          },
        ],
      },
      {
        ticket_id: 'tkt-1002',
        ticket_number: 1002,
        user_id: 'usr-sara-solo',
        user_email: 'sara@marketing.co',
        user_name: 'Sara Chen',
        subject: 'Customization timeout deducted 1 credit from my balance',
        category: 'credits',
        status: 'in_progress',
        related_template_id: 'tpl_img_aquatic',
        related_attempt_id: null,
        assigned_to_user_id: 'usr-admin-1',
        assigned_to_name: 'Lead Curator (Admin)',
        is_read_by_admin: true,
        is_read_by_user: true,
        created_at: new Date(now - 14 * 3600000).toISOString(),
        updated_at: new Date(now - 2 * 3600000).toISOString(),
        status_history: [
          {
            history_id: 'sh-102a',
            status: 'open',
            changed_by_user_id: 'usr-sara-solo',
            changed_by_name: 'Sara Chen',
            changed_at: new Date(now - 14 * 3600000).toISOString(),
          },
          {
            history_id: 'sh-102b',
            status: 'in_progress',
            changed_by_user_id: 'usr-admin-1',
            changed_by_name: 'Lead Curator (Admin)',
            changed_at: new Date(now - 8 * 3600000).toISOString(),
            note: 'Investigating allowance ledger and timeout event',
          },
        ],
        messages: [
          {
            message_id: 'msg-1002a',
            ticket_id: 'tkt-1002',
            sender_id: 'usr-sara-solo',
            sender_role: 'user',
            sender_name: 'Sara Chen',
            content:
              'Hello! Yesterday around 4 PM I clicked customize on the Dynamic Cosmetic Splash template. The spinner ran for 30 seconds and then gave a 504 Gateway Timeout. My credit balance decreased from 10 to 9, but no customized prompt was saved.',
            is_internal_note: false,
            created_at: new Date(now - 14 * 3600000).toISOString(),
          },
          {
            message_id: 'msg-1002b',
            ticket_id: 'tkt-1002',
            sender_id: 'usr-admin-1',
            sender_role: 'administrator',
            sender_name: 'Lead Curator (Admin)',
            content:
              'Internal note: Verified server logs. Worker process timed out on LLM gateway during peak hour. Credited +1 back to user ledger under ald-support-1002. Ready to notify user.',
            is_internal_note: true, // Internal note — strictly hidden from user!
            created_at: new Date(now - 6 * 3600000).toISOString(),
          },
          {
            message_id: 'msg-1002c',
            ticket_id: 'tkt-1002',
            sender_id: 'usr-admin-1',
            sender_role: 'administrator',
            sender_name: 'Lead Curator (Admin)',
            content:
              'Hi Sara, thank you for reaching out and alerting us. We checked the gateway logs and confirmed the timeout occurred before prompt generation completed. We have credited 1 customization allowance back to your account. Could you please refresh your dashboard and verify your balance?',
            is_internal_note: false,
            created_at: new Date(now - 2 * 3600000).toISOString(),
          },
        ],
      },
      {
        ticket_id: 'tkt-1003',
        ticket_number: 1003,
        user_id: 'usr-jordan-life',
        user_email: 'jordan@studio.design',
        user_name: 'Jordan Lee',
        subject: 'Runway Gen-3 camera parameters for product rotation',
        category: 'template_or_guidance',
        status: 'waiting_for_user',
        related_template_id: 'tpl_video_1',
        related_attempt_id: null,
        assigned_to_user_id: 'usr-admin-1',
        assigned_to_name: 'Lead Curator (Admin)',
        is_read_by_admin: true,
        is_read_by_user: true,
        created_at: new Date(now - 28 * 3600000).toISOString(),
        updated_at: new Date(now - 10 * 3600000).toISOString(),
        status_history: [
          {
            history_id: 'sh-103a',
            status: 'open',
            changed_by_user_id: 'usr-jordan-life',
            changed_by_name: 'Jordan Lee',
            changed_at: new Date(now - 28 * 3600000).toISOString(),
          },
          {
            history_id: 'sh-103b',
            status: 'waiting_for_user',
            changed_by_user_id: 'usr-admin-1',
            changed_by_name: 'Lead Curator (Admin)',
            changed_at: new Date(now - 10 * 3600000).toISOString(),
          },
        ],
        messages: [
          {
            message_id: 'msg-1003a',
            ticket_id: 'tkt-1003',
            sender_id: 'usr-jordan-life',
            sender_role: 'user',
            sender_name: 'Jordan Lee',
            content:
              'In the guidance steps for template "Product in studio rotation", Step 3 specifies a 360 orbit camera. When importing the prompt into Runway Gen-3 Alpha, the camera speed is too quick. Is there an exact motion brush value recommended?',
            is_internal_note: false,
            created_at: new Date(now - 28 * 3600000).toISOString(),
          },
          {
            message_id: 'msg-1003b',
            ticket_id: 'tkt-1003',
            sender_id: 'usr-admin-1',
            sender_role: 'administrator',
            sender_name: 'Lead Curator (Admin)',
            content:
              'Hi Jordan! For Gen-3 Alpha, set Horizontal Pan to +1.5 and Motion to 3 (instead of the default 5). Also ensure "Smooth Loop" is checked in Advanced Settings. Let us know if that produces the expected slow commercial rotation.',
            is_internal_note: false,
            created_at: new Date(now - 10 * 3600000).toISOString(),
          },
        ],
      },
      {
        ticket_id: 'tkt-1004',
        ticket_number: 1004,
        user_id: 'usr-david-unpaid',
        user_email: 'david@startups.io',
        user_name: 'David Kim',
        subject: 'Tax invoice receipt with GST number',
        category: 'subscription_or_payment',
        status: 'resolved',
        related_template_id: null,
        related_attempt_id: null,
        assigned_to_user_id: 'usr-admin-1',
        assigned_to_name: 'Lead Curator (Admin)',
        is_read_by_admin: true,
        is_read_by_user: true,
        created_at: new Date(now - 50 * 3600000).toISOString(),
        updated_at: new Date(now - 20 * 3600000).toISOString(),
        resolved_at: new Date(now - 20 * 3600000).toISOString(),
        status_history: [
          {
            history_id: 'sh-104a',
            status: 'open',
            changed_by_user_id: 'usr-david-unpaid',
            changed_by_name: 'David Kim',
            changed_at: new Date(now - 50 * 3600000).toISOString(),
          },
          {
            history_id: 'sh-104b',
            status: 'resolved',
            changed_by_user_id: 'usr-admin-1',
            changed_by_name: 'Lead Curator (Admin)',
            changed_at: new Date(now - 20 * 3600000).toISOString(),
            note: 'Invoice with GSTIN generated and delivered',
          },
        ],
        messages: [
          {
            message_id: 'msg-1004a',
            ticket_id: 'tkt-1004',
            sender_id: 'usr-david-unpaid',
            sender_role: 'user',
            sender_name: 'David Kim',
            content:
              'Could I please get a formal B2B invoice with our company GSTIN included for our corporate tax filing?',
            is_internal_note: false,
            created_at: new Date(now - 50 * 3600000).toISOString(),
          },
          {
            message_id: 'msg-1004b',
            ticket_id: 'tkt-1004',
            sender_id: 'usr-admin-1',
            sender_role: 'administrator',
            sender_name: 'Lead Curator (Admin)',
            content:
              'Hello David! We have re-issued your receipt with your organization details and GSTIN. You can view and download it directly from your billing statement.',
            is_internal_note: false,
            created_at: new Date(now - 20 * 3600000).toISOString(),
          },
        ],
      },
    ];
  }

  // -----------------------------------------------------------------------
  // PAYMENT TRANSACTIONS
  // -----------------------------------------------------------------------
  getTransactions(filter?: {
    state?: string;
    purchase_type?: string;
    userId?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
  }): PaymentTransaction[] {
    let result = [...this.transactions];
    if (filter?.state) {
      result = result.filter((tx) => tx.state === filter.state);
    }
    if (filter?.purchase_type) {
      result = result.filter((tx) => tx.purchase_type === filter.purchase_type);
    }
    if (filter?.userId) {
      result = result.filter((tx) => tx.user_id === filter.userId);
    }
    if (filter?.fromDate) {
      const from = new Date(filter.fromDate);
      result = result.filter((tx) => new Date(tx.occurred_at) >= from);
    }
    if (filter?.toDate) {
      const to = new Date(filter.toDate);
      result = result.filter((tx) => new Date(tx.occurred_at) <= to);
    }
    result.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }
    return result;
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
      // When a source prompt is revised, mark its existing translations as needing an update
      this.markTranslationsNeedUpdate(templateId, versionId);
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
  // Supports language-aware delivery and strict fallback to default language (07 §4.9)
  deliverPrompt(
    userId: string,
    templateId: string,
    isCustomized: boolean = false,
    parentPromptId?: string | null,
    promptTextOverride?: string,
    uiPromptOverride?: string,
    contextPromptOverride?: string,
    languageId?: string | null
  ): DeliveredPrompt & {
    language_id?: string;
    is_fallback?: boolean;
    fallback_language?: string;
  } {
    const versions = this.getVersionsForTemplate(templateId);
    const currentVersion = versions.find((v) => v.is_current) || versions[0];
    if (!currentVersion && !promptTextOverride) {
      throw new Error('No prompt version available for template');
    }

    let promptText = promptTextOverride || currentVersion?.prompt_text || '';
    let uiPrompt = uiPromptOverride !== undefined ? uiPromptOverride : (currentVersion?.ui_prompt || null);
    let contextPrompt = contextPromptOverride !== undefined ? contextPromptOverride : (currentVersion?.context_prompt || null);
    let deliveredLang = 'en';
    let isFallback = false;

    // Check language translation and fallback (07 §4.9)
    if (languageId && languageId !== 'en' && !promptTextOverride) {
      const translation = this.promptTranslations.find(
        (t) =>
          t.template_id === templateId &&
          (currentVersion ? t.version_id === currentVersion.version_id : true) &&
          t.language_id === languageId &&
          (t.status === 'completed' || t.review_status === 'published')
      );

      if (translation && (translation.prompt_text_translated || translation.ui_prompt_translated)) {
        promptText = translation.prompt_text_translated || promptText;
        uiPrompt = translation.ui_prompt_translated ?? uiPrompt;
        contextPrompt = translation.context_prompt_translated ?? contextPrompt;
        deliveredLang = languageId;
        isFallback = false;
      } else {
        // Documented fallback to default language (English)
        deliveredLang = 'en';
        isFallback = true;
      }
    }

    const delivered: DeliveredPrompt = {
      delivered_prompt_id: `dp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      template_id: templateId,
      base_version_id: currentVersion?.version_id || 'custom',
      prompt_text: promptText,
      ui_prompt: uiPrompt,
      context_prompt: contextPrompt,
      is_customized: isCustomized,
      parent_delivered_prompt_id: parentPromptId || null,
      delivered_at: new Date().toISOString(),
    };

    this.deliveredPrompts.push(delivered);
    return {
      ...delivered,
      language_id: deliveredLang,
      is_fallback: isFallback,
      fallback_language: isFallback ? 'en' : undefined,
    };
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

  // -----------------------------------------------------------------------
  // USER COLLECTIONS (ADMIN SUPPORT & REPORTING - READ-ONLY)
  // -----------------------------------------------------------------------
  getUserCollections(options?: {
    search?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): {
    collections: UserCollectionWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    counts: { total: number; totalUsers: number; avgTemplates: number };
  } {
    let list = [...this.userCollections];

    if (options?.userId) {
      list = list.filter((c) => c.user_id === options.userId);
    }

    if (options?.search?.trim()) {
      const q = options.search.trim().toLowerCase();
      list = list.filter((c) => {
        const user = this.getUserById(c.user_id);
        const nameMatch = c.name.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q) || false;
        const userMatch =
          user?.email.toLowerCase().includes(q) ||
          user?.display_name?.toLowerCase().includes(q) ||
          c.user_id.toLowerCase().includes(q);
        return nameMatch || descMatch || userMatch;
      });
    }

    if (options?.dateFrom) {
      const fromTime = new Date(options.dateFrom).getTime();
      list = list.filter((c) => new Date(c.created_at).getTime() >= fromTime);
    }

    if (options?.dateTo) {
      const toTime = new Date(options.dateTo).getTime();
      list = list.filter((c) => new Date(c.created_at).getTime() <= toTime);
    }

    // Sort by created_at descending
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = list.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, Math.min(100, options?.limit || 20));
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginated = list.slice((page - 1) * limit, page * limit);

    const totalUsers = new Set(this.userCollections.map((c) => c.user_id)).size;
    const totalTemplatesSum = this.userCollections.reduce((acc, c) => acc + c.template_ids.length, 0);
    const avgTemplates =
      this.userCollections.length > 0 ? +(totalTemplatesSum / this.userCollections.length).toFixed(1) : 0;

    const detailedCollections: UserCollectionWithDetails[] = paginated.map((c) => {
      const user = this.getUserById(c.user_id);
      const templates = c.template_ids
        .map((tId) => {
          const t = publicDb.getTemplateById(tId);
          if (!t) return null;
          return {
            template_id: t.template_id,
            name: t.name,
            description: t.description,
            preview_image: t.preview_image,
            mainCategory: allTemplates.find((at) => at.id === t.template_id)?.mainCategory || 'Image',
            difficulty: t.difficulty,
          };
        })
        .filter(Boolean) as Array<{
          template_id: string;
          name: string;
          description: string;
          preview_image?: string;
          mainCategory?: string;
          difficulty?: string;
        }>;

      return {
        ...c,
        user: {
          user_id: c.user_id,
          email: user?.email || 'unknown@user.com',
          display_name: user?.display_name || null,
        },
        templates,
      };
    });

    return {
      collections: detailedCollections,
      total,
      page,
      limit,
      totalPages,
      counts: {
        total: this.userCollections.length,
        totalUsers,
        avgTemplates,
      },
    };
  }

  getUserCollectionById(collectionId: string): UserCollectionWithDetails | null {
    const col = this.userCollections.find((c) => c.collection_id === collectionId);
    if (!col) return null;

    const user = this.getUserById(col.user_id);
    const templates = col.template_ids
      .map((tId) => {
        const t = publicDb.getTemplateById(tId);
        if (!t) return null;
        return {
          template_id: t.template_id,
          name: t.name,
          description: t.description,
          preview_image: t.preview_image,
          mainCategory: allTemplates.find((at) => at.id === t.template_id)?.mainCategory || 'Image',
          difficulty: t.difficulty,
        };
      })
      .filter(Boolean) as Array<{
        template_id: string;
        name: string;
        description: string;
        preview_image?: string;
        mainCategory?: string;
        difficulty?: string;
      }>;

    return {
      ...col,
      user: {
        user_id: col.user_id,
        email: user?.email || 'unknown@user.com',
        display_name: user?.display_name || null,
      },
      templates,
    };
  }

  // Member-initiated actions (User collection mutations)
  createUserCollection(userId: string, name: string, templateIds: string[] = []): UserCollection {
    const newCollection: UserCollection = {
      collection_id: `col-user-${Date.now()}`,
      user_id: userId,
      name: name.trim() || 'Untitled Collection',
      description: null,
      template_ids: Array.from(new Set(templateIds)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.userCollections.push(newCollection);
    return newCollection;
  }

  addTemplateToUserCollection(userId: string, collectionId: string, templateId: string): boolean {
    const col = this.userCollections.find((c) => c.collection_id === collectionId && c.user_id === userId);
    if (!col) return false;
    if (!col.template_ids.includes(templateId)) {
      col.template_ids.push(templateId);
      col.updated_at = new Date().toISOString();
    }
    return true;
  }

  removeTemplateFromUserCollection(userId: string, collectionId: string, templateId: string): boolean {
    const col = this.userCollections.find((c) => c.collection_id === collectionId && c.user_id === userId);
    if (!col) return false;
    col.template_ids = col.template_ids.filter((id) => id !== templateId);
    col.updated_at = new Date().toISOString();
    return true;
  }

  deleteUserCollection(userId: string, collectionId: string): boolean {
    const initial = this.userCollections.length;
    this.userCollections = this.userCollections.filter((c) => !(c.collection_id === collectionId && c.user_id === userId));
    return this.userCollections.length < initial;
  }

  // -----------------------------------------------------------------------
  // PROMPT TRANSLATIONS (PRIVATE STORE — THE TRANSLATED PRODUCT)
  // Preserves prompt structure & rules; stored in private database
  // -----------------------------------------------------------------------
  getPromptTranslations(filter?: {
    template_id?: string;
    language_id?: string;
    version_id?: string;
  }): TemplatePromptTranslation[] {
    let result = [...this.promptTranslations];
    if (filter?.template_id) {
      result = result.filter((t) => t.template_id === filter.template_id);
    }
    if (filter?.language_id) {
      result = result.filter((t) => t.language_id === filter.language_id);
    }
    if (filter?.version_id) {
      result = result.filter((t) => t.version_id === filter.version_id);
    }
    return result;
  }

  getPromptTranslation(
    templateId: string,
    languageId: string,
    versionId?: string
  ): TemplatePromptTranslation | undefined {
    return this.promptTranslations.find((t) => {
      const matchTpl = t.template_id === templateId;
      const matchLang = t.language_id === languageId;
      const matchVer = versionId ? t.version_id === versionId : true;
      return matchTpl && matchLang && matchVer;
    });
  }

  savePromptTranslation(data: {
    template_id: string;
    version_id: string;
    version_number: number;
    language_id: string;
    ui_prompt_source?: string | null;
    ui_prompt_translated?: string | null;
    context_prompt_source?: string | null;
    context_prompt_translated?: string | null;
    prompt_text_source: string;
    prompt_text_translated: string;
    status: TemplatePromptTranslation['status'];
    review_status?: TemplatePromptTranslation['review_status'];
    error_message?: string | null;
    service_cost?: number | null;
  }): TemplatePromptTranslation {
    // Safe retry: Find existing by (template_id, version_id, language_id) to avoid duplicates
    const existingIndex = this.promptTranslations.findIndex(
      (t) =>
        t.template_id === data.template_id &&
        t.version_id === data.version_id &&
        t.language_id === data.language_id
    );

    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const existing = this.promptTranslations[existingIndex];
      const revStatus = data.review_status || existing.review_status || 'draft';
      const updated: TemplatePromptTranslation = {
        ...existing,
        ...data,
        review_status: revStatus,
        publish_status: revStatus,
        published_at: revStatus === 'published' ? (existing.published_at || now) : null,
        updated_at: now,
      };
      this.promptTranslations[existingIndex] = updated;
      return updated;
    }

    const revStatus = data.review_status || 'draft';
    const newTrans: TemplatePromptTranslation = {
      translation_id: `ptrans-${data.template_id}-${data.language_id}-${Date.now()}`,
      template_id: data.template_id,
      version_id: data.version_id,
      version_number: data.version_number,
      language_id: data.language_id,
      ui_prompt_source: data.ui_prompt_source ?? null,
      ui_prompt_translated: data.ui_prompt_translated ?? null,
      context_prompt_source: data.context_prompt_source ?? null,
      context_prompt_translated: data.context_prompt_translated ?? null,
      prompt_text_source: data.prompt_text_source,
      prompt_text_translated: data.prompt_text_translated,
      status: data.status,
      review_status: revStatus,
      publish_status: revStatus,
      published_at: revStatus === 'published' ? now : null,
      error_message: data.error_message || null,
      service_cost: data.service_cost ?? null,
      created_at: now,
      updated_at: now,
    };

    this.promptTranslations.push(newTrans);
    return newTrans;
  }

  updatePromptTranslation(
    translationId: string,
    updates: Partial<TemplatePromptTranslation>,
    actorId?: string
  ): TemplatePromptTranslation {
    const item = this.promptTranslations.find((t) => t.translation_id === translationId);
    if (!item) {
      throw new Error(`Translation ${translationId} not found`);
    }

    const before = { ...item };
    if (updates.review_status) {
      updates.publish_status = updates.review_status;
      if (updates.review_status === 'published' && !item.published_at && !updates.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }
    Object.assign(item, updates, { updated_at: new Date().toISOString() });

    if (actorId) {
      this.recordAuditLog(actorId, 'update_prompt_translation', 'prompt_translation', translationId, before, { ...item });
    }

    return item;
  }

  markTranslationsNeedUpdate(templateId: string, currentVersionId: string): void {
    // When a source prompt is revised, mark its existing translations as needing an update
    this.promptTranslations.forEach((t) => {
      if (t.template_id === templateId && t.version_id !== currentVersionId) {
        t.status = 'needs_update';
        t.review_status = 'draft';
        t.publish_status = 'draft';
        t.updated_at = new Date().toISOString();
      }
    });
  }

  // -----------------------------------------------------------------------
  // LANGUAGE TRANSLATION PROGRESS & SPEND CAP
  // -----------------------------------------------------------------------
  getLanguageProgress(languageId: string): LanguageTranslationProgress {
    const publishedTemplates = publicDb.getPublishedTemplates();
    const total = publishedTemplates.length;

    // Aggregate translations for this language on current versions of published templates
    const translationsForLang = publishedTemplates.map((t) => {
      const versions = this.getVersionsForTemplate(t.template_id);
      const curVersion = versions.find((v) => v.is_current) || versions[0];
      const curVersionId = curVersion ? curVersion.version_id : t.current_version_id;
      return this.promptTranslations.find(
        (tr) =>
          tr.template_id === t.template_id &&
          (curVersionId ? tr.version_id === curVersionId : true) &&
          tr.language_id === languageId
      );
    });

    let completed = 0;
    let pending = 0;
    let failed = 0;
    let inProgress = 0;

    const pendingTemplateIds: string[] = [];
    translationsForLang.forEach((tr, idx) => {
      const t = publishedTemplates[idx];
      if (!tr) {
        pendingTemplateIds.push(`${t.template_id} (no-trans)`);
        pending++;
      } else if (tr.status === 'completed') {
        completed++;
      } else if (tr.status === 'failed') {
        failed++;
      } else if (tr.status === 'translating') {
        inProgress++;
      } else if (tr.status === 'pending' || tr.status === 'needs_update') {
        pendingTemplateIds.push(`${t.template_id} (${tr.status})`);
        pending++;
      }
    });

    // Derive status: Do not report a language as complete while any template is pending or failed.
    let status: LanguageTranslationProgress['status'] = 'idle';
    if (total === 0) {
      status = 'idle';
    } else if (failed > 0) {
      status = 'failed';
    } else if (inProgress > 0 || (pending > 0 && completed > 0)) {
      status = 'in_progress';
    } else if (pending === total) {
      status = 'pending';
    } else if (completed === total && total > 0) {
      status = 'completed';
    }

    const progress: LanguageTranslationProgress & { pending_template_ids?: string[] } = {
      language_id: languageId,
      total_templates: total,
      completed,
      pending,
      failed,
      in_progress: inProgress,
      completed_templates: completed,
      pending_templates: pending,
      failed_templates: failed,
      pending_template_ids: pendingTemplateIds,
      status,
      updated_at: new Date().toISOString(),
    };

    return progress;
  }

  getAllLanguageProgress(): Record<string, LanguageTranslationProgress> {
    const languages = publicDb.getLanguages();
    const result: Record<string, LanguageTranslationProgress> = {};
    for (const lang of languages) {
      result[lang.language_id] = this.getLanguageProgress(lang.language_id);
    }
    return result;
  }

  checkAiSpendCap(cost: number = 0.1): {
    allowed: boolean;
    isApproaching: boolean;
    isPaused: boolean;
    spent: number;
    limit: number;
  } {
    const isPaused = this.spendPeriod.spent >= this.spendPeriod.limit;
    const allowed = !isPaused && this.spendPeriod.spent + cost <= this.spendPeriod.limit;
    const isApproaching = this.spendPeriod.spent >= this.spendPeriod.limit * 0.8;
    return {
      allowed,
      isApproaching,
      isPaused,
      spent: this.spendPeriod.spent,
      limit: this.spendPeriod.limit,
    };
  }

  recordAiSpend(cost: number, reason: string): { spent: number; limit: number } {
    this.spendPeriod.spent = Number((this.spendPeriod.spent + cost).toFixed(4));
    if (this.spendPeriod.spent >= this.spendPeriod.limit * 0.8 && !this.spendPeriod.notified_at) {
      this.spendPeriod.notified_at = new Date().toISOString();
    }
    return { spent: this.spendPeriod.spent, limit: this.spendPeriod.limit };
  }

  // =========================================================================
  // USER SUPPORT TICKET METHODS (PRIVATE DATABASE)
  // Enforces 13-SECURITY.md: User isolation & internal notes privacy
  // =========================================================================

  ensureSupportTickets(): SupportTicket[] {
    if (!this.supportTickets || !Array.isArray(this.supportTickets) || this.supportTickets.length === 0) {
      this.seedSupportTickets();
    }
    return this.supportTickets;
  }

  /**
   * Returns all tickets belonging to a specific user.
   * STRICT SECURITY: Completely strips internal notes!
   */
  getSupportTicketsForUser(userId: string): SupportTicket[] {
    const tickets = this.ensureSupportTickets();
    const userTickets = tickets.filter((t) => t.user_id === userId);
    return userTickets
      .map((t) => ({
        ...t,
        messages: t.messages
          .filter((m) => !m.is_internal_note)
          .map((m) => ({ ...m })),
        status_history: [...t.status_history],
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  /**
   * Returns a single ticket thread for a user.
   * Validates user ownership. Marks ticket as read by user.
   * STRICT SECURITY: Completely strips internal notes!
   */
  getSupportTicketForUserById(ticketId: string, userId: string): SupportTicket | null {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) return null;
    if (ticket.user_id !== userId) {
      return null;
    }

    ticket.is_read_by_user = true;

    return {
      ...ticket,
      messages: ticket.messages
        .filter((m) => !m.is_internal_note)
        .map((m) => ({ ...m })),
      status_history: [...ticket.status_history],
    };
  }

  /**
   * Creates a new support ticket submitted by a signed-in user.
   */
  createSupportTicket(data: {
    userId: string;
    subject: string;
    category: SupportTicketCategory;
    description: string;
    screenshotUrl?: string;
    relatedTemplateId?: string;
    relatedAttemptId?: string;
  }): SupportTicket {
    const user = this.getUserById(data.userId);
    if (!user) throw new Error('User not found or unauthenticated');

    if (!data.subject || data.subject.trim().length === 0) {
      throw new Error('Subject is required');
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    const tickets = this.ensureSupportTickets();
    const ticketNumber = 1000 + tickets.length + 1;
    const ticketId = `tkt-${ticketNumber}`;
    const nowIso = new Date().toISOString();

    const initialMessage: SupportTicketMessage = {
      message_id: `msg-${Date.now()}-1`,
      ticket_id: ticketId,
      sender_id: user.user_id,
      sender_role: 'user',
      sender_name: user.display_name || user.email,
      content: data.description.trim(),
      is_internal_note: false,
      attachments: data.screenshotUrl
        ? [
            {
              attachment_id: `att-${Date.now()}`,
              file_name: 'screenshot.png',
              file_type: 'image/png',
              url: data.screenshotUrl,
            },
          ]
        : undefined,
      created_at: nowIso,
    };

    const newTicket: SupportTicket = {
      ticket_id: ticketId,
      ticket_number: ticketNumber,
      user_id: user.user_id,
      user_email: user.email,
      user_name: user.display_name || user.email,
      subject: data.subject.trim(),
      category: data.category || 'other',
      status: 'open',
      related_template_id: data.relatedTemplateId || null,
      related_attempt_id: data.relatedAttemptId || null,
      assigned_to_user_id: null,
      assigned_to_name: null,
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: nowIso,
      updated_at: nowIso,
      status_history: [
        {
          history_id: `sh-${Date.now()}`,
          status: 'open',
          changed_by_user_id: user.user_id,
          changed_by_name: user.display_name || user.email,
          changed_at: nowIso,
          note: 'Ticket submitted by user',
        },
      ],
      messages: [initialMessage],
    };

    tickets.unshift(newTicket);
    return newTicket;
  }

  /**
   * Adds a user reply to an existing open ticket.
   */
  addUserReplyToTicket(
    ticketId: string,
    userId: string,
    content: string,
    screenshotUrl?: string
  ): SupportTicketMessage {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    if (ticket.user_id !== userId) throw new Error('Unauthorized');

    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const nowIso = new Date().toISOString();
    const user = this.getUserById(userId);

    const message: SupportTicketMessage = {
      message_id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticket_id: ticketId,
      sender_id: userId,
      sender_role: 'user',
      sender_name: user?.display_name || user?.email || ticket.user_name,
      content: content.trim(),
      is_internal_note: false,
      attachments: screenshotUrl
        ? [
            {
              attachment_id: `att-${Date.now()}`,
              file_name: 'attachment.png',
              file_type: 'image/png',
              url: screenshotUrl,
            },
          ]
        : undefined,
      created_at: nowIso,
    };

    ticket.messages.push(message);
    ticket.updated_at = nowIso;
    ticket.is_read_by_admin = false;
    ticket.is_read_by_user = true;

    // If ticket was resolved or waiting for user, reopen to open / in_progress
    if (ticket.status === 'resolved' || ticket.status === 'waiting_for_user') {
      const prevStatus = ticket.status;
      ticket.status = ticket.assigned_to_user_id ? 'in_progress' : 'open';
      ticket.status_history.push({
        history_id: `sh-${Date.now()}`,
        status: ticket.status,
        changed_by_user_id: userId,
        changed_by_name: user?.display_name || ticket.user_name,
        changed_at: nowIso,
        note: `User replied; status reopened from ${prevStatus}`,
      });
    }

    return message;
  }

  /**
   * Admin view: lists tickets with filters, counts, search, and pagination.
   */
  getAdminSupportTickets(filters: {
    search?: string;
    status?: string;
    category?: string;
    userId?: string;
    dateRange?: string;
    page?: number;
    pageSize?: number;
  }): {
    tickets: SupportTicket[];
    counts: SupportTicketSummaryCounts;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  } {
    const tickets = this.ensureSupportTickets();
    let openCount = 0;
    let inProgressCount = 0;
    let waitingForUserCount = 0;
    let resolvedCount = 0;
    let unreadCount = 0;

    for (const t of tickets) {
      if (t.status === 'open') openCount++;
      else if (t.status === 'in_progress') inProgressCount++;
      else if (t.status === 'waiting_for_user') waitingForUserCount++;
      else if (t.status === 'resolved') resolvedCount++;

      if (!t.is_read_by_admin) unreadCount++;
    }

    const counts: SupportTicketSummaryCounts = {
      total: tickets.length,
      open: openCount,
      in_progress: inProgressCount,
      waiting_for_user: waitingForUserCount,
      resolved: resolvedCount,
      unread: unreadCount,
    };

    let filtered = [...tickets];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.userId && filters.userId !== 'all') {
      filtered = filtered.filter((t) => t.user_id === filters.userId);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.user_name.toLowerCase().includes(q) ||
          t.user_email.toLowerCase().includes(q) ||
          t.ticket_id.toLowerCase().includes(q) ||
          `#${t.ticket_number}`.includes(q)
      );
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = Date.now();
      let cutoff = 0;
      if (filters.dateRange === 'today') cutoff = now - 24 * 3600000;
      else if (filters.dateRange === '7d') cutoff = now - 7 * 86400000;
      else if (filters.dateRange === '30d') cutoff = now - 30 * 86400000;
      else if (filters.dateRange === '90d') cutoff = now - 90 * 86400000;

      if (cutoff > 0) {
        filtered = filtered.filter((t) => new Date(t.created_at).getTime() >= cutoff);
      }
    }

    filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    const totalItems = filtered.length;
    const pageSize = filters.pageSize || 10;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(Math.max(1, filters.page || 1), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTickets = filtered.slice(startIndex, startIndex + pageSize);

    return {
      tickets: paginatedTickets,
      counts,
      totalItems,
      totalPages,
      currentPage,
    };
  }

  /**
   * Admin view: get single ticket detail with all messages and mark read by admin.
   */
  getAdminSupportTicketById(ticketId: string): SupportTicket | null {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) return null;
    ticket.is_read_by_admin = true;
    return ticket;
  }

  /**
   * Admin action: reply to user OR add internal note.
   */
  addAdminReplyToTicket(
    ticketId: string,
    adminUserId: string,
    content: string,
    isInternalNote: boolean = false
  ): SupportTicketMessage {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const admin = this.getUserById(adminUserId);
    if (!admin || admin.role !== 'administrator') {
      throw new Error('Only administrators can post replies or notes here');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const nowIso = new Date().toISOString();
    const message: SupportTicketMessage = {
      message_id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticket_id: ticketId,
      sender_id: adminUserId,
      sender_role: 'administrator',
      sender_name: admin.display_name || admin.email,
      content: content.trim(),
      is_internal_note: isInternalNote,
      created_at: nowIso,
    };

    ticket.messages.push(message);
    ticket.updated_at = nowIso;

    if (!isInternalNote) {
      ticket.is_read_by_user = false;
      if (ticket.status === 'open') {
        const prevStatus = ticket.status;
        ticket.status = 'waiting_for_user';
        ticket.status_history.push({
          history_id: `sh-${Date.now()}`,
          status: 'waiting_for_user',
          changed_by_user_id: adminUserId,
          changed_by_name: admin.display_name || admin.email,
          changed_at: nowIso,
          note: `Status updated from ${prevStatus} upon admin reply`,
        });
      }
    }

    this.recordAuditLog(
      adminUserId,
      isInternalNote ? 'add_internal_note' : 'reply_to_ticket',
      'support_ticket',
      ticketId,
      null,
      { is_internal_note: isInternalNote, message_id: message.message_id }
    );

    return message;
  }

  /**
   * Admin action: update ticket status (open, in_progress, waiting_for_user, resolved).
   */
  updateTicketStatus(
    ticketId: string,
    newStatus: SupportTicketStatus,
    adminUserId: string,
    note?: string
  ): SupportTicket {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const admin = this.getUserById(adminUserId);
    if (!admin || admin.role !== 'administrator') {
      throw new Error('Only administrators can update ticket status');
    }

    const prevStatus = ticket.status;
    if (prevStatus === newStatus) return ticket;

    const nowIso = new Date().toISOString();
    ticket.status = newStatus;
    ticket.updated_at = nowIso;
    if (newStatus === 'resolved') {
      ticket.resolved_at = nowIso;
    } else {
      ticket.resolved_at = null;
    }

    ticket.status_history.push({
      history_id: `sh-${Date.now()}`,
      status: newStatus,
      changed_by_user_id: adminUserId,
      changed_by_name: admin.display_name || admin.email,
      changed_at: nowIso,
      note: note || `Status changed from ${prevStatus} to ${newStatus}`,
    });

    this.recordAuditLog(
      adminUserId,
      'update_ticket_status',
      'support_ticket',
      ticketId,
      { status: prevStatus },
      { status: newStatus, note }
    );

    return ticket;
  }

  /**
   * Admin action: assign ticket to an administrator.
   */
  assignTicket(
    ticketId: string,
    assignToAdminId: string | null,
    adminUserId: string
  ): SupportTicket {
    const tickets = this.ensureSupportTickets();
    const ticket = tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    let assignedAdminName: string | null = null;
    if (assignToAdminId) {
      const targetAdmin = this.getUserById(assignToAdminId);
      if (!targetAdmin) throw new Error('Target administrator not found');
      assignedAdminName = targetAdmin.display_name || targetAdmin.email;
    }

    const prevAssigned = ticket.assigned_to_user_id;
    ticket.assigned_to_user_id = assignToAdminId;
    ticket.assigned_to_name = assignedAdminName;
    ticket.updated_at = new Date().toISOString();

    if (ticket.status === 'open' && assignToAdminId) {
      ticket.status = 'in_progress';
      ticket.status_history.push({
        history_id: `sh-${Date.now()}`,
        status: 'in_progress',
        changed_by_user_id: adminUserId,
        changed_by_name: this.getUserById(adminUserId)?.display_name || 'Admin',
        changed_at: new Date().toISOString(),
        note: `Ticket assigned to ${assignedAdminName}; moved to In Progress`,
      });
    }

    this.recordAuditLog(
      adminUserId,
      'assign_ticket',
      'support_ticket',
      ticketId,
      { assigned_to: prevAssigned },
      { assigned_to: assignToAdminId }
    );

    return ticket;
  }

  /**
   * Fast counts query for sidebar badge and header widgets.
   */
  getSupportSummaryCounts(): SupportTicketSummaryCounts {
    const tickets = this.ensureSupportTickets();
    let open = 0;
    let inProgress = 0;
    let waiting = 0;
    let resolved = 0;
    let unread = 0;

    for (const t of tickets) {
      if (t.status === 'open') open++;
      else if (t.status === 'in_progress') inProgress++;
      else if (t.status === 'waiting_for_user') waiting++;
      else if (t.status === 'resolved') resolved++;

      if (!t.is_read_by_admin) unread++;
    }

    return {
      total: tickets.length,
      open,
      in_progress: inProgress,
      waiting_for_user: waiting,
      resolved,
      unread,
    };
  }
}

// Global singleton instance for private store
declare global {
  var __awa_private_db__: PrivateDatabaseStore | undefined;
}

if (globalThis.__awa_private_db__) {
  Object.setPrototypeOf(globalThis.__awa_private_db__, PrivateDatabaseStore.prototype);
  globalThis.__awa_private_db__.ensureSupportTickets();
}

export const privateDb: PrivateDatabaseStore =
  globalThis.__awa_private_db__ ?? (globalThis.__awa_private_db__ = new PrivateDatabaseStore());
