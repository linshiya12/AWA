import {
  Category,
  Template,
  TemplateAttribute,
  AiTool,
  AiModel,
  ToolAssignment,
  Guidance,
  GuidanceStep,
  MediaAsset,
  Language,
  Translation,
  CuratedCollection,
} from '../types';
import { ALL_GUIDANCE_CATALOG, ALL_GUIDANCE_MEDIA_ASSETS } from '@/lib/guidanceCatalog';
import { allTemplates } from '@/lib/mockData';

export const TEMPLATE_ALIASES: Record<string, string> = {
  'tpl-hero-product': 'tpl_1',
  'tpl-festive-banner': 'tpl_3',
  'tpl-liquid-splash': 'tpl_video_2',
  'tpl-isometric-stage': 'tpl_mind_ai',
  'tpl-saas-hero': 'tpl_web_1',
  'tpl-robotics-ai': 'tpl_future_machine',
};

export const REVERSE_TEMPLATE_ALIASES: Record<string, string> = {
  'tpl_1': 'tpl-hero-product',
  'tpl_3': 'tpl-festive-banner',
  'tpl_video_2': 'tpl-liquid-splash',
  'tpl_mind_ai': 'tpl-isometric-stage',
  'tpl_web_1': 'tpl-saas-hero',
  'tpl_future_machine': 'tpl-robotics-ai',
};

// =========================================================================
// PUBLIC DATABASE STORE
// Holds catalog content: categories, templates (no prompts!), tools, etc.
// Enforces 07-DATABASE.md & 08-API.md contracts
// =========================================================================

class PublicDatabaseStore {
  private categories: Category[] = [];
  private templates: Template[] = [];
  private attributes: TemplateAttribute[] = [];
  private tools: AiTool[] = [];
  private models: AiModel[] = [];
  private assignments: ToolAssignment[] = [];
  private guidanceList: Guidance[] = [];
  private guidanceSteps: GuidanceStep[] = [];
  private mediaAssets: MediaAsset[] = [];
  private languages: Language[] = [];
  private translations: Translation[] = [];
  private curatedCollections: CuratedCollection[] = [];

  constructor() {
    this.seedInitialData();
  }

  // -----------------------------------------------------------------------
  // SEED INITIAL DATA
  // -----------------------------------------------------------------------
  private seedInitialData() {
    // 1. Languages (07 §4.8: Exactly one has is_default = true)
    this.languages = [
      { language_id: 'en', name: 'English', is_default: true, is_enabled: true },
      { language_id: 'es', name: 'Español', is_default: false, is_enabled: true },
      { language_id: 'fr', name: 'Français', is_default: false, is_enabled: false },
      { language_id: 'ml', name: 'Malayalam', is_default: false, is_enabled: false },
    ];

    // 2. Categories (05-MVP.md §5.4: 1 category at launch Image Generation, expandable day 1)
    this.categories = [
      {
        category_id: 'cat-image-gen',
        parent_id: null,
        name: 'Image Generation',
        description: 'Commercial product photography, editorial banners, 3D assets and icons',
        position: 1,
        is_visible: true,
        preview_media_id: null,
        path: '/image-generation',
        depth: 0,
        extra_prompt_words: 'high resolution, commercial studio lighting, professional quality',
      },
      {
        category_id: 'subcat-product-photo',
        parent_id: 'cat-image-gen',
        name: 'Product Photography',
        description: 'Clean studio product shots on infinite backgrounds',
        position: 1,
        is_visible: true,
        preview_media_id: null,
        path: '/image-generation/product-photography',
        depth: 1,
      },
      {
        category_id: 'subcat-festive-banners',
        parent_id: 'cat-image-gen',
        name: 'Festive & Promotional Banners',
        description: 'Holiday promotional graphics and sale banners',
        position: 2,
        is_visible: true,
        preview_media_id: null,
        path: '/image-generation/festive-banners',
        depth: 1,
      },
      {
        category_id: 'subcat-3d-assets',
        parent_id: 'cat-image-gen',
        name: '3D Assets & Mockups',
        description: 'Isometric product stages, clay models, and device renders',
        position: 3,
        is_visible: true,
        preview_media_id: null,
        path: '/image-generation/3d-assets',
        depth: 1,
      },
      {
        category_id: 'cat-marketing-copy',
        parent_id: null,
        name: 'Marketing Copy',
        description: 'High-converting ad copy, landing page headlines, and email sequences',
        position: 2,
        is_visible: true,
        preview_media_id: null,
        path: '/marketing-copy',
        depth: 0,
      },
      {
        category_id: 'cat-video-gen',
        parent_id: null,
        name: 'Video Generation',
        description: 'Cinematic video b-roll, motion loops, and social reels',
        position: 3,
        is_visible: true,
        preview_media_id: null,
        path: '/video-generation',
        depth: 0,
      },
      {
        category_id: 'cat-slides-gen',
        parent_id: null,
        name: 'Presentation Slides',
        description: 'Executive pitch decks, data visualizations, keynotes, and narrative frameworks',
        position: 4,
        is_visible: true,
        preview_media_id: null,
        path: '/presentation-slides',
        depth: 0,
      },
      {
        category_id: 'cat-websites',
        parent_id: null,
        name: 'Websites',
        description: 'Landing pages, SaaS hero components, portfolio showcases, and web UI layouts',
        position: 5,
        is_visible: true,
        preview_media_id: null,
        path: '/websites',
        depth: 0,
      },
    ];

    // 3. AI Tools & Models (07 §4.4)
    this.tools = [
      {
        tool_id: 'tool-midjourney',
        name: 'Midjourney',
        destination: 'https://midjourney.com',
        reasoning: 'Produces superior studio lighting, textures, and product reflections out of the box.',
        pricing_note: 'Paid subscription required',
        quality_note: 'Industry standard for photorealism',
        logo_media_id: null,
        is_available: true,
      },
      {
        tool_id: 'tool-flux',
        name: 'FLUX.1',
        destination: 'https://blackforestlabs.ai',
        reasoning: 'Exceptional prompt adherence, realistic typography, and clean text on product labels.',
        pricing_note: 'Open weights & hosted API',
        quality_note: 'Highest text precision',
        logo_media_id: null,
        is_available: true,
      },
      {
        tool_id: 'tool-runway',
        name: 'Runway',
        destination: 'https://runwayml.com',
        reasoning: 'Leading cinematic camera motions and hyper-realistic physics simulations.',
        pricing_note: 'Freemium with credit packs',
        quality_note: 'Film grade generative video',
        logo_media_id: null,
        is_available: true,
      },
      {
        tool_id: 'tool-gamma',
        name: 'Gamma App',
        destination: 'https://gamma.app',
        reasoning: 'Produces structured executive slide decks, narrative flow, and high-impact data cards.',
        pricing_note: 'Freemium with credit allowances',
        quality_note: 'Best generative slide layout UX',
        logo_media_id: null,
        is_available: true,
      },
      {
        tool_id: 'tool-v0',
        name: 'v0 by Vercel',
        destination: 'https://v0.dev',
        reasoning: 'Generates clean Next.js React components and Tailwind layouts in seconds.',
        pricing_note: 'Free tier available',
        quality_note: 'Top code generation UX',
        logo_media_id: null,
        is_available: true,
      },
    ];

    this.models = [
      { model_id: 'model-mj-v6', tool_id: 'tool-midjourney', name: 'Midjourney v6.1', is_available: true },
      { model_id: 'model-flux-dev', tool_id: 'tool-flux', name: 'FLUX.1 [dev]', is_available: true },
      { model_id: 'model-flux-pro', tool_id: 'tool-flux', name: 'FLUX.1 [pro]', is_available: true },
      { model_id: 'model-runway-gen3', tool_id: 'tool-runway', name: 'Gen-3 Alpha', is_available: true },
      { model_id: 'model-gamma-deck', tool_id: 'tool-gamma', name: 'Gamma Deck 2.0', is_available: true },
      { model_id: 'model-v0-react', tool_id: 'tool-v0', name: 'v0-1.5 React', is_available: true },
    ];

    // 4. Tool Assignments with inheritance (07 §4.5)
    this.assignments = [
      {
        assignment_id: 'asgn-cat-image-mj',
        scope_type: 'category',
        scope_id: 'cat-image-gen',
        tool_id: 'tool-midjourney',
        model_id: 'model-mj-v6',
        position: 1,
        reasoning_override: null,
        is_active: true,
      },
      {
        assignment_id: 'asgn-cat-image-flux',
        scope_type: 'category',
        scope_id: 'cat-image-gen',
        tool_id: 'tool-flux',
        model_id: 'model-flux-pro',
        position: 2,
        reasoning_override: null,
        is_active: true,
      },
      {
        assignment_id: 'asgn-cat-video-runway',
        scope_type: 'category',
        scope_id: 'cat-video-gen',
        tool_id: 'tool-runway',
        model_id: 'model-runway-gen3',
        position: 1,
        reasoning_override: null,
        is_active: true,
      },
      {
        assignment_id: 'asgn-cat-slides-gamma',
        scope_type: 'category',
        scope_id: 'cat-slides-gen',
        tool_id: 'tool-gamma',
        model_id: 'model-gamma-deck',
        position: 1,
        reasoning_override: null,
        is_active: true,
      },
      {
        assignment_id: 'asgn-cat-websites-v0',
        scope_type: 'category',
        scope_id: 'cat-websites',
        tool_id: 'tool-v0',
        model_id: 'model-v0-react',
        position: 1,
        reasoning_override: null,
        is_active: true,
      },
    ];

    // 5. Media Assets for Guidance Steps (07 §4.7)
    this.mediaAssets = [...ALL_GUIDANCE_MEDIA_ASSETS];

    // 6. Guidance & Steps across Categories and Templates (07 §4.6)
    // Category-level Guidance fallbacks (Used ONLY when template-level guidance is absent)
    this.guidanceList.push(
      {
        guidance_id: 'guide-cat-image',
        scope_type: 'category',
        scope_id: 'cat-image-gen',
        presentation: 'written',
        media_id: null,
        is_active: true,
      },
      {
        guidance_id: 'guide-cat-video',
        scope_type: 'category',
        scope_id: 'cat-video-gen',
        presentation: 'written',
        media_id: null,
        is_active: true,
      },
      {
        guidance_id: 'guide-cat-slides',
        scope_type: 'category',
        scope_id: 'cat-slides-gen',
        presentation: 'written',
        media_id: null,
        is_active: true,
      },
      {
        guidance_id: 'guide-cat-websites',
        scope_type: 'category',
        scope_id: 'cat-websites',
        presentation: 'written',
        media_id: null,
        is_active: true,
      }
    );

    // Category fallback steps
    this.guidanceSteps.push(
      {
        step_id: 'step-cat-image-1',
        guidance_id: 'guide-cat-image',
        position: 1,
        title: 'Select AI Tool',
        instruction: 'Copy the prompt text and open your external image generator (e.g. Midjourney or FLUX.1).',
        tip: 'Ensure Midjourney v6.1 or FLUX.1 [pro] is selected for maximum fidelity.',
        media_id: 'media-guide-tpl_1-s1',
        image_url: '/images/guidance/tpl_1/step-1.svg',
        image_alt: 'External AI tool selection interface',
      },
      {
        step_id: 'step-cat-image-2',
        guidance_id: 'guide-cat-image',
        position: 2,
        title: 'Configure Lighting & Parameters',
        instruction: 'Paste into the prompt input. Add parameter flags such as --ar 16:9 --v 6.1 if using Midjourney.',
        tip: 'Use --style raw to keep photorealistic studio neutrality.',
        media_id: 'media-guide-tpl_1-s2',
        image_url: '/images/guidance/tpl_1/step-2.svg',
        image_alt: 'Studio lighting and parameter flags configuration',
      },
      {
        step_id: 'step-cat-image-3',
        guidance_id: 'guide-cat-image',
        position: 3,
        title: 'Review & Upscale Output',
        instruction: 'Review the generated 4-up grid and upscale the best variation for your campaign.',
        tip: 'Inspect edges and shadows before exporting to your commercial catalog.',
        media_id: 'media-guide-tpl_1-s3',
        image_url: '/images/guidance/tpl_1/step-3.svg',
        image_alt: 'Quad preview grid and upscale verification',
      },
      {
        step_id: 'step-cat-video-1',
        guidance_id: 'guide-cat-video',
        position: 1,
        title: 'Select Video Generator',
        instruction: 'Open your external video generator (e.g. Runway Gen-3 Alpha, Luma Dream Machine, or Pika 2.0).',
        tip: 'Choose Image-to-Video for product continuity or Text-to-Video for greenfield motion.',
        media_id: 'media-guide-tpl_video_1-s1',
        image_url: '/images/guidance/tpl_video_1/step-1.svg',
        image_alt: 'Runway timeline interface',
      },
      {
        step_id: 'step-cat-video-2',
        guidance_id: 'guide-cat-video',
        position: 2,
        title: 'Configure Motion Vectors',
        instruction: 'Paste camera direction, zoom speed, and motion intensity parameters into the timeline workspace.',
        tip: 'Keep camera motion speed below 3 to prevent temporal jitter.',
        media_id: 'media-guide-tpl_video_1-s2',
        image_url: '/images/guidance/tpl_video_1/step-2.svg',
        image_alt: 'Camera orbit motion vector controls',
      },
      {
        step_id: 'step-cat-video-3',
        guidance_id: 'guide-cat-video',
        position: 3,
        title: 'Generate & Export Master',
        instruction: 'Run test render, evaluate temporal consistency across frames, and export high-bitrate ProRes/MP4.',
        tip: 'Upscale to 4K using external interpolation tools for pristine display.',
        media_id: 'media-guide-tpl_video_1-s6',
        image_url: '/images/guidance/tpl_video_1/step-6.svg',
        image_alt: 'High-resolution video master export',
      },
      {
        step_id: 'step-cat-slides-1',
        guidance_id: 'guide-cat-slides',
        position: 1,
        title: 'Initialize Presentation Tool',
        instruction: 'Paste the structured prompt into Gamma, Beautiful.ai, or Claude to outline executive slide hierarchy.',
        tip: 'Keep slide decks between 8-12 cards for concise audience attention.',
        media_id: 'media-guide-tpl_slide_1-s1',
        image_url: '/images/guidance/tpl_slide_1/step-1.svg',
        image_alt: 'Presentation outline initialization',
      },
      {
        step_id: 'step-cat-slides-2',
        guidance_id: 'guide-cat-slides',
        position: 2,
        title: 'Format Layout & Cards',
        instruction: 'Review generated slide layouts, apply consistent typography tokens, and organize financial/narrative metrics.',
        tip: 'Use two distinct fonts maximum across the presentation.',
        media_id: 'media-guide-tpl_slide_1-s3',
        image_url: '/images/guidance/tpl_slide_1/step-3.svg',
        image_alt: 'Executive metric cards formatting',
      },
      {
        step_id: 'step-cat-slides-3',
        guidance_id: 'guide-cat-slides',
        position: 3,
        title: 'Export Vector PDF',
        instruction: 'Inspect card typography contrast, verify vector alignment, and export 16:9 PDF or shareable web deck.',
        tip: 'Embed fonts before sending to external stakeholders.',
        media_id: 'media-guide-tpl_slide_1-s5',
        image_url: '/images/guidance/tpl_slide_1/step-5.svg',
        image_alt: 'Vector PDF presentation export',
      },
      {
        step_id: 'step-cat-web-1',
        guidance_id: 'guide-cat-websites',
        position: 1,
        title: 'Initialize AI Code Generator',
        instruction: 'Copy the UI Prompt and paste it into your AI code generator (v0 by Vercel, Cursor, Framer AI, or Lovable).',
        tip: 'Specify Next.js App Router and Tailwind CSS for instant clean code compatibility.',
        media_id: 'media-guide-tpl_web_1-s1',
        image_url: '/images/guidance/tpl_web_1/step-1.svg',
        image_alt: 'v0 component workspace code initialization',
      },
      {
        step_id: 'step-cat-web-2',
        guidance_id: 'guide-cat-websites',
        position: 2,
        title: 'Inject Business Context',
        instruction: 'Copy the Business Context Prompt to supply authentic product identity, audience, copy tone, and CTAs.',
        tip: 'Realistic copy prevents awkward placeholder text in early user testing.',
        media_id: 'media-guide-tpl_web_1-s2',
        image_url: '/images/guidance/tpl_web_1/step-2.svg',
        image_alt: 'Business context prompt chat injection',
      },
      {
        step_id: 'step-cat-web-3',
        guidance_id: 'guide-cat-websites',
        position: 3,
        title: 'Refine Breakpoints & Deploy',
        instruction: 'Review the generated React/Tailwind code or interactive site preview, refine responsive breakpoints, and deploy to your preferred hosting provider.',
        tip: 'Verify touch target sizes and dark-mode contrast ratios.',
        media_id: 'media-guide-tpl_web_1-s3',
        image_url: '/images/guidance/tpl_web_1/step-3.svg',
        image_alt: 'Responsive breakpoints preview and production deployment',
      }
    );

    // Template-level Specific Guidance for ALL 17 published templates (from ALL_GUIDANCE_CATALOG)
    Object.entries(ALL_GUIDANCE_CATALOG).forEach(([tplId, steps]) => {
      const guideId = `guide-${tplId}`;
      this.guidanceList.push({
        guidance_id: guideId,
        scope_type: 'template',
        scope_id: tplId,
        presentation: 'written',
        media_id: null,
        is_active: true,
      });

      steps.forEach((s) => {
        this.guidanceSteps.push({
          step_id: `step-${tplId}-${s.step}`,
          guidance_id: guideId,
          position: s.step,
          title: s.title,
          instruction: s.description,
          tip: s.tip || '',
          media_id: `media-guide-${tplId}-s${s.step}`,
          image_url: s.image,
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
        });
      });
    });

    // Also register alias template guidance records so both ID styles resolve directly
    Object.entries(TEMPLATE_ALIASES).forEach(([aliasId, canonicalId]) => {
      const aliasGuideId = `guide-${aliasId}`;
      this.guidanceList.push({
        guidance_id: aliasGuideId,
        scope_type: 'template',
        scope_id: aliasId,
        presentation: 'written',
        media_id: null,
        is_active: true,
      });

      const steps = ALL_GUIDANCE_CATALOG[canonicalId] || [];
      steps.forEach((s) => {
        this.guidanceSteps.push({
          step_id: `step-${aliasId}-${s.step}`,
          guidance_id: aliasGuideId,
          position: s.step,
          title: s.title,
          instruction: s.description,
          tip: s.tip || '',
          media_id: `media-guide-${canonicalId}-s${s.step}`,
          image_url: s.image,
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
        });
      });
    });

    // 7. Templates (07 §4.2: NO prompt text! Only metadata and current_version_id reference)
    // Note: 3 free sample templates (05-MVP.md §3.3)
    this.templates = [
      {
        template_id: 'tpl-hero-product',
        category_id: 'subcat-product-photo',
        name: 'Studio Product Hero',
        description: 'Clean minimalist studio product photograph on seamless white infinity background with soft shadows.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_1.jpg',
        status: 'published',
        current_version_id: 'ver-hero-1',
        position: 1,
        is_sample: true, // 1st free sample template
        likes: 142,
        difficulty: 'beginner',
        tags: ['studio', 'ecommerce', 'minimalist', 'white background'],
      },
      {
        template_id: 'tpl-festive-banner',
        category_id: 'subcat-festive-banners',
        name: 'Festive Holiday Sale Banner',
        description: 'Rich cinematic promotional hero banner with champagne gold accents and holiday bokeh particles.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_3.jpg',
        status: 'published',
        current_version_id: 'ver-festive-1',
        position: 2,
        is_sample: true, // 2nd free sample template
        likes: 98,
        difficulty: 'intermediate',
        tags: ['holiday', 'festive', 'luxury', 'banner', 'gold'],
      },
      {
        template_id: 'tpl-liquid-splash',
        category_id: 'subcat-product-photo',
        name: 'Dynamic Cosmetic Splash',
        description: 'High-speed capture of luxury perfume or serum bottle with crystal water crown ripples.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_video_2.jpg',
        status: 'published',
        current_version_id: 'ver-splash-1',
        position: 3,
        is_sample: true, // 3rd free sample template
        likes: 185,
        difficulty: 'advanced',
        tags: ['cosmetic', 'splash', 'luxury', 'water droplets'],
      },
      {
        template_id: 'tpl-isometric-stage',
        category_id: 'subcat-3d-assets',
        name: 'Isometric 3D Tech Pod',
        description: 'Futuristic geometric pedestal stage with volumetric cyan and magenta ambient lighting.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_3d_1.jpg',
        status: 'published',
        current_version_id: 'ver-isometric-1',
        position: 4,
        is_sample: false,
        likes: 74,
        difficulty: 'intermediate',
        tags: ['3d', 'isometric', 'podium', 'neon'],
      },
      {
        template_id: 'tpl-saas-hero',
        category_id: 'cat-image-gen',
        name: 'Dark Futuristic Neural Hero',
        description: 'Sleek dark-mode website hero section with glowing quantum nodes and minimalist typography.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_web_3.jpg',
        status: 'published',
        current_version_id: 'ver-saas-1',
        position: 5,
        is_sample: false,
        likes: 210,
        difficulty: 'intermediate',
        tags: ['saas', 'dark mode', 'neural', 'banner'],
      },
      {
        template_id: 'tpl-robotics-ai',
        category_id: 'cat-image-gen',
        name: 'Cybernetic AI Assistant',
        description: 'High-precision titanium android hand holding a glowing holographic core.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_robotics_1.jpg',
        status: 'published',
        current_version_id: 'ver-robotics-1',
        position: 6,
        is_sample: false,
        likes: 129,
        difficulty: 'advanced',
        tags: ['robotics', 'cyberpunk', 'ai core'],
      },
      {
        template_id: 'tpl_web_1',
        category_id: 'cat-websites',
        name: 'SaaS Hero Section',
        description: 'A production-grade developer workflow SaaS hero component with live telemetry preview, waitlist input, and sleek dark-mode glassmorphism.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_web_1.jpg',
        status: 'published',
        current_version_id: 'ver-web-1',
        position: 7,
        is_sample: true,
        likes: 312,
        difficulty: 'beginner',
        tags: ['Web', 'Hero', 'UI', 'React', 'Tailwind', 'SaaS'],
      },
      {
        template_id: 'tpl_web_2',
        category_id: 'cat-websites',
        name: 'Creative Portfolio',
        description: 'An editorial design director portfolio featuring asymmetric masonry case-study grids, smooth project cards, and bespoke typography.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_web_2.jpg',
        status: 'published',
        current_version_id: 'ver-web-2',
        position: 8,
        is_sample: false,
        likes: 245,
        difficulty: 'intermediate',
        tags: ['Web', 'Portfolio', 'Agency', 'Editorial', 'Creative'],
      },
      {
        template_id: 'tpl_web_3',
        category_id: 'cat-websites',
        name: 'Feature Grid',
        description: 'An enterprise cloud compliance 3-column feature section with glowing icon badges, capability checklists, and subtle hover lifts.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_web_3.jpg',
        status: 'published',
        current_version_id: 'ver-web-3',
        position: 9,
        is_sample: false,
        likes: 198,
        difficulty: 'beginner',
        tags: ['Web', 'Feature Grid', 'B2B', 'Components', 'SaaS'],
      },
      {
        template_id: 'tpl_future_machine',
        category_id: 'cat-websites',
        name: 'Future Machine',
        description: 'A striking robotics studio landing page with mecha branding, live hardware telemetry readouts, electric blue accents, and technology showcase.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_robotics_1.jpg',
        status: 'published',
        current_version_id: 'ver-future-machine-1',
        position: 10,
        is_sample: false,
        likes: 278,
        difficulty: 'intermediate',
        tags: ['Robotics', 'Studio', 'Web', 'Mecha', 'Hardware'],
      },
      {
        template_id: 'tpl_quantum_human',
        category_id: 'cat-websites',
        name: 'Quantum Human',
        description: 'A dark, cinematic AI platform hero featuring neural network particles, deep cognition themes, and futuristic typography.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_ai_1.jpg',
        status: 'published',
        current_version_id: 'ver-quantum-human-1',
        position: 11,
        is_sample: false,
        likes: 340,
        difficulty: 'advanced',
        tags: ['AI', 'Neural', 'Hero', 'Dark Mode', 'Cognition'],
      },
      {
        template_id: 'tpl_mind_ai',
        category_id: 'cat-websites',
        name: 'Mind AI',
        description: 'A cutting-edge 3D generative AI site featuring an iridescent liquid-chrome holographic human bust with rainbow refractions.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_3d_1.jpg',
        status: 'published',
        current_version_id: 'ver-mind-ai-1',
        position: 12,
        is_sample: false,
        likes: 289,
        difficulty: 'intermediate',
        tags: ['3D', 'Holographic', 'Creative', 'Web', 'Generative'],
      },
      {
        template_id: 'tpl_web_bakery',
        category_id: 'cat-websites',
        name: 'Artisan Bakery & Cafe',
        description: 'A warm, mouth-watering landing page for an artisan sourdough bakery and cafe with daily bake schedule and pickup ordering.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_web_bakery.jpg',
        status: 'published',
        current_version_id: 'ver-web-bakery-1',
        position: 13,
        is_sample: true,
        likes: 412,
        difficulty: 'beginner',
        tags: ['Web', 'Bakery', 'Food', 'Cafe', 'Local', 'Ecommerce'],
      },
      {
        template_id: 'tpl_1',
        category_id: 'subcat-product-photo',
        name: 'Studio Product Hero',
        description: 'Clean minimalist studio product photograph on seamless white infinity background with soft shadows.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_1_wide.jpg',
        status: 'published',
        current_version_id: 'ver-hero-1',
        position: 14,
        is_sample: true,
        likes: 342,
        difficulty: 'beginner',
        tags: ['studio', 'ecommerce', 'minimalist', 'white background'],
      },
      {
        template_id: 'tpl_video_1',
        category_id: 'cat-video-gen',
        name: 'Cinematic Product Reveal',
        description: 'Dynamic 4K motion loop with dramatic camera orbit, volumetric atmospheric mist, and studio lighting.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_video_1.jpg',
        status: 'published',
        current_version_id: 'ver-video-1',
        position: 15,
        is_sample: true,
        likes: 378,
        difficulty: 'intermediate',
        tags: ['Video', 'Cinematic', 'Runway', 'Orbit', 'Commercial'],
      },
      {
        template_id: 'tpl_slide_1',
        category_id: 'cat-slides-gen',
        name: 'Executive Keynote Deck',
        description: 'Minimalist high-stakes investor pitch deck layout with typography hierarchy, KPI callouts, and clean data grids.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_slide_1.jpg',
        status: 'published',
        current_version_id: 'ver-slide-1',
        position: 16,
        is_sample: true,
        likes: 420,
        difficulty: 'beginner',
        tags: ['Slides', 'Pitch Deck', 'Keynote', 'Executive', 'Gamma'],
      },
    ];

    // Ensure all 17 templates from mockCatalog are registered in this.templates
    allTemplates.forEach((t) => {
      const already = this.templates.some((existing) => existing.template_id === t.id);
      if (!already) {
        const catId =
          t.mainCategory === 'Image'
            ? 'cat-image-gen'
            : t.mainCategory === 'Video'
            ? 'cat-video-gen'
            : t.mainCategory === 'Slides'
            ? 'cat-slides-gen'
            : 'cat-websites';

        this.templates.push({
          template_id: t.id,
          category_id: catId,
          name: t.title || t.name,
          description: t.description,
          preview_media_id: null,
          preview_image: t.media.primaryImage || t.media.thumbnail,
          status: 'published',
          current_version_id: `ver-${t.id}-1`,
          position: this.templates.length + 1,
          is_sample: t.id === 'tpl_1' || t.id === 'tpl_video_1' || t.id === 'tpl_slide_1' || t.id === 'tpl_web_bakery',
          likes: 240 + this.templates.length * 12,
          difficulty: (t.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
          tags: t.tags,
        });
      }
    });

    // 7. Template Attributes (07 §4.3 & 08 API-021)
    this.attributes = [
      { attribute_id: 'attr-1', template_id: 'tpl-hero-product', attribute_type: 'style', attribute_value: 'minimalist' },
      { attribute_id: 'attr-2', template_id: 'tpl-hero-product', attribute_type: 'format', attribute_value: 'square' },
      { attribute_id: 'attr-3', template_id: 'tpl-festive-banner', attribute_type: 'style', attribute_value: 'luxury' },
      { attribute_id: 'attr-4', template_id: 'tpl-festive-banner', attribute_type: 'format', attribute_value: 'landscape' },
      { attribute_id: 'attr-5', template_id: 'tpl-liquid-splash', attribute_type: 'style', attribute_value: 'cinematic' },
      { attribute_id: 'attr-6', template_id: 'tpl-isometric-stage', attribute_type: 'style', attribute_value: '3d-render' },
    ];

    // 8. Translations (07 §4.9)
    this.translations = [
      {
        translation_id: 'trans-1',
        language_id: 'es',
        entity_type: 'category',
        entity_id: 'cat-image-gen',
        field_name: 'name',
        translated_text: 'Generación de Imágenes',
      },
      {
        translation_id: 'trans-2',
        language_id: 'es',
        entity_type: 'template',
        entity_id: 'tpl-hero-product',
        field_name: 'name',
        translated_text: 'Fotografía de Producto de Estudio',
      },
    ];

    // 9. Curated Recommendation Collections (Admin Collections)
    this.curatedCollections = [
      {
        collection_id: 'col-curated-1',
        name: 'Commercial Advertising Essentials',
        slug: 'commercial-advertising-essentials',
        description: 'High-converting studio product photography, clean infinity white sweeps, and dynamic fluid splashes.',
        cover_image: '/images/templates/spray.jpg',
        is_active: true,
        position: 1,
        template_ids: ['tpl_1', 'tpl_img_aquatic', 'tpl_3', 'tpl_4'],
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_by: 'usr-admin-1',
      },
      {
        collection_id: 'col-curated-2',
        name: 'Cinematic Video & Social Reels',
        slug: 'cinematic-video-and-social-reels',
        description: 'Engaging short-form motion sequences, turntable camera orbits, and bioluminescent ocean loops.',
        cover_image: '/images/templates/tpl_video_1.jpg',
        is_active: true,
        position: 2,
        template_ids: ['tpl_video_1', 'tpl_video_reel', 'tpl_video_2', 'tpl_video_jellyfish'],
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        created_by: 'usr-admin-1',
      },
      {
        collection_id: 'col-curated-3',
        name: 'Next-Gen 3D & Web Experiences',
        slug: 'next-gen-3d-and-web-experiences',
        description: 'Interactive WebGL canvases, mechanical horology viewers, and production-ready SaaS hero sections.',
        cover_image: '/images/templates/tpl_3d_timepiece_poster.svg',
        is_active: true,
        position: 3,
        template_ids: ['tpl_web_1', 'tpl_3d_timepiece', 'tpl_mind_ai', 'tpl_3d_pavilion'],
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        created_by: 'usr-admin-1',
      },
      {
        collection_id: 'col-curated-4',
        name: 'Executive Presentations & Keynotes',
        slug: 'executive-presentations-and-keynotes',
        description: 'Minimalist venture pitch decks and pedagogical masterclass curriculum slide decks.',
        cover_image: '/images/templates/tpl_slide_1.jpg',
        is_active: false, // Inactive: excluded from public recommendations without deleting templates
        position: 4,
        template_ids: ['tpl_slide_1', 'tpl_slide_edu', 'tpl_slide_3'],
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        created_by: 'usr-admin-1',
      },
      {
        collection_id: 'col-curated-5',
        name: 'High Fashion & Editorial Photography',
        slug: 'high-fashion-and-editorial-photography',
        description: 'Museum-grade couture silhouettes, full-grain leather goods, and Scandinavian interior staging.',
        cover_image: '/images/templates/bag2.jpg',
        is_active: true,
        position: 5,
        template_ids: ['tpl_img_couture', 'tpl_img_museum', 'tpl_2'],
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        created_by: 'usr-admin-1',
      },
    ];

    // 10. Languages (07 §4.8) — Exactly one has is_default = true
    this.languages = [
      { language_id: 'en', name: 'English', is_default: true, is_enabled: true },
      { language_id: 'es', name: 'Español', is_default: false, is_enabled: true },
    ];
  }

  // -----------------------------------------------------------------------
  // CATEGORIES API (API-020)
  // -----------------------------------------------------------------------
  getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.position - b.position);
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find((c) => c.category_id === id);
  }

  createCategory(data: Omit<Category, 'category_id' | 'path' | 'depth'> & { category_id?: string }): Category {
    const parent = data.parent_id ? this.getCategoryById(data.parent_id) : null;
    const depth = parent ? parent.depth + 1 : 0;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const path = parent ? `${parent.path}/${slug}` : `/${slug}`;
    const id = data.category_id || `cat-${Date.now()}`;

    const newCategory: Category = {
      ...data,
      category_id: id,
      path,
      depth,
      position: data.position || this.categories.filter((c) => c.parent_id === data.parent_id).length + 1,
      is_visible: data.is_visible ?? true,
      preview_media_id: data.preview_media_id ?? null,
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.categories.findIndex((c) => c.category_id === id);
    if (idx === -1) return null;

    const existing = this.categories[idx];
    const updated = { ...existing, ...updates };

    // If visibility toggled to false, cascade hide (08-API.md §4: Hiding applies to whole subtree)
    if (updates.is_visible === false && existing.is_visible !== false) {
      this.cascadeVisibility(id, false);
    } else if (updates.is_visible === true && existing.is_visible !== true) {
      this.cascadeVisibility(id, true);
    }

    this.categories[idx] = updated;
    return updated;
  }

  private cascadeVisibility(parentId: string, isVisible: boolean) {
    const children = this.categories.filter((c) => c.parent_id === parentId);
    for (const child of children) {
      child.is_visible = isVisible;
      this.cascadeVisibility(child.category_id, isVisible);
    }
  }

  moveCategory(categoryId: string, newParentId: string | null): { success: boolean; error?: string } {
    const node = this.getCategoryById(categoryId);
    if (!node) return { success: false, error: 'Category not found' };

    // Cycle check: A node cannot be moved beneath its own descendant (08-API.md Rule 13)
    if (newParentId) {
      let currentParent = this.getCategoryById(newParentId);
      while (currentParent) {
        if (currentParent.category_id === categoryId) {
          return { success: false, error: 'Cannot move a category beneath its own descendant' };
        }
        currentParent = currentParent.parent_id ? this.getCategoryById(currentParent.parent_id) : undefined;
      }
    }

    node.parent_id = newParentId;
    const parent = newParentId ? this.getCategoryById(newParentId) : null;
    node.depth = parent ? parent.depth + 1 : 0;
    const slug = node.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    node.path = parent ? `${parent.path}/${slug}` : `/${slug}`;

    return { success: true };
  }

  reorderCategories(orderedIds: string[]): boolean {
    orderedIds.forEach((id, index) => {
      const cat = this.categories.find((c) => c.category_id === id);
      if (cat) cat.position = index + 1;
    });
    return true;
  }

  deleteCategory(id: string): { success: boolean; subcategoriesCount: number; templatesCount: number } {
    const subcats = this.categories.filter((c) => c.parent_id === id);
    const templates = this.templates.filter((t) => t.category_id === id);

    // If category has contents, client warns with exact counts (04 §5.1, 11-UI-UX A2)
    // Deleting actually sets is_visible = false rather than dropping rows per 07 §9
    const cat = this.getCategoryById(id);
    if (cat) {
      cat.is_visible = false;
      this.cascadeVisibility(id, false);
      return { success: true, subcategoriesCount: subcats.length, templatesCount: templates.length };
    }
    return { success: false, subcategoriesCount: 0, templatesCount: 0 };
  }

  // -----------------------------------------------------------------------
  // TEMPLATES API (API-021)
  // -----------------------------------------------------------------------
  getTemplates(filter?: { category_id?: string; status?: string; search?: string }): Template[] {
    let result = [...this.templates];
    if (filter?.category_id) {
      result = result.filter((t) => t.category_id === filter.category_id);
    }
    if (filter?.status) {
      result = result.filter((t) => t.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return result.sort((a, b) => a.position - b.position);
  }

  getPublishedTemplates(): Template[] {
    return this.templates.filter((t) => t.status === 'published');
  }

  getTemplateById(id: string): Template | undefined {
    const direct = this.templates.find((t) => t.template_id === id);
    if (direct) return direct;
    const canonical = TEMPLATE_ALIASES[id];
    if (canonical) {
      const match = this.templates.find((t) => t.template_id === canonical);
      if (match) return match;
    }
    const rev = REVERSE_TEMPLATE_ALIASES[id];
    if (rev) {
      const match = this.templates.find((t) => t.template_id === rev);
      if (match) return match;
    }
    return undefined;
  }

  createTemplate(data: Omit<Template, 'template_id' | 'likes'> & { template_id?: string }): Template {
    const id = data.template_id || `tpl-${Date.now()}`;
    const newTemplate: Template = {
      ...data,
      template_id: id,
      likes: 0,
      status: data.status || 'draft',
      current_version_id: data.current_version_id || null,
      is_sample: data.is_sample ?? false,
      position: data.position || this.templates.filter((t) => t.category_id === data.category_id).length + 1,
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<Template>): Template | null {
    const idx = this.templates.findIndex((t) => t.template_id === id);
    if (idx === -1) return null;

    // Rule 12: Cannot publish without a current version! (08-API.md §5 Rule 12 & FEAT-031)
    if (updates.status === 'published') {
      const currentVer = updates.current_version_id !== undefined ? updates.current_version_id : this.templates[idx].current_version_id;
      if (!currentVer) {
        throw new Error('A template cannot be published without a prompt version');
      }
    }

    this.templates[idx] = { ...this.templates[idx], ...updates };
    return this.templates[idx];
  }

  setTemplateAttributes(templateId: string, attributes: Array<{ attribute_type: string; attribute_value: string }>): TemplateAttribute[] {
    // Remove old attributes for template
    this.attributes = this.attributes.filter((a) => a.template_id !== templateId);
    const newRows: TemplateAttribute[] = attributes.map((a, i) => ({
      attribute_id: `attr-${templateId}-${i}-${Date.now()}`,
      template_id: templateId,
      attribute_type: a.attribute_type,
      attribute_value: a.attribute_value,
    }));
    this.attributes.push(...newRows);
    return newRows;
  }

  getTemplateAttributes(templateId: string): TemplateAttribute[] {
    return this.attributes.filter((a) => a.template_id === templateId);
  }

  // -----------------------------------------------------------------------
  // AI TOOLS & MODELS (API-023)
  // -----------------------------------------------------------------------
  getTools(): AiTool[] {
    return [...this.tools];
  }

  getToolById(id: string): AiTool | undefined {
    return this.tools.find((t) => t.tool_id === id);
  }

  createTool(data: Omit<AiTool, 'tool_id'>): AiTool {
    const tool: AiTool = {
      ...data,
      tool_id: `tool-${Date.now()}`,
    };
    this.tools.push(tool);
    return tool;
  }

  updateTool(id: string, updates: Partial<AiTool>): AiTool | null {
    const idx = this.tools.findIndex((t) => t.tool_id === id);
    if (idx === -1) return null;
    this.tools[idx] = { ...this.tools[idx], ...updates };
    return this.tools[idx];
  }

  getModelsForTool(toolId: string): AiModel[] {
    return this.models.filter((m) => m.tool_id === toolId);
  }

  createModel(data: Omit<AiModel, 'model_id'>): AiModel {
    const model: AiModel = {
      ...data,
      model_id: `model-${Date.now()}`,
    };
    this.models.push(model);
    return model;
  }

  updateModel(modelId: string, updates: Partial<AiModel>): AiModel | null {
    const idx = this.models.findIndex((m) => m.model_id === modelId);
    if (idx === -1) return null;
    this.models[idx] = { ...this.models[idx], ...updates };
    return this.models[idx];
  }

  // -----------------------------------------------------------------------
  // TOOL ASSIGNMENTS WITH INHERITANCE (API-024)
  // -----------------------------------------------------------------------
  getAssignments(): ToolAssignment[] {
    return [...this.assignments];
  }

  getAssignmentsForScope(scopeType: 'category' | 'template', scopeId: string): ToolAssignment[] {
    return this.assignments.filter((a) => a.scope_type === scopeType && a.scope_id === scopeId);
  }

  resolveAssignmentsForTemplate(templateId: string): {
    assigned: Array<ToolAssignment & { tool: AiTool; model?: AiModel; isInherited: boolean }>;
  } {
    const template = this.getTemplateById(templateId);
    if (!template) return { assigned: [] };

    const direct = this.assignments.filter((a) => a.scope_type === 'template' && a.scope_id === templateId && a.is_active);
    if (direct.length > 0) {
      return {
        assigned: direct.map((a) => ({
          ...a,
          tool: this.getToolById(a.tool_id)!,
          model: a.model_id ? this.models.find((m) => m.model_id === a.model_id) : undefined,
          isInherited: false,
        })),
      };
    }

    // Walk up category hierarchy to inherit (07 §4.5)
    let currentCategoryId: string | null = template.category_id;
    while (currentCategoryId) {
      const catAssignments = this.assignments.filter((a) => a.scope_type === 'category' && a.scope_id === currentCategoryId && a.is_active);
      if (catAssignments.length > 0) {
        return {
          assigned: catAssignments.map((a) => ({
            ...a,
            tool: this.getToolById(a.tool_id)!,
            model: a.model_id ? this.models.find((m) => m.model_id === a.model_id) : undefined,
            isInherited: true,
          })),
        };
      }
      const cat = this.getCategoryById(currentCategoryId);
      currentCategoryId = cat?.parent_id || null;
    }

    return { assigned: [] };
  }

  createAssignment(data: Omit<ToolAssignment, 'assignment_id'>): ToolAssignment {
    const asgn: ToolAssignment = {
      ...data,
      assignment_id: `asgn-${Date.now()}`,
    };
    this.assignments.push(asgn);
    return asgn;
  }

  updateAssignment(id: string, updates: Partial<ToolAssignment>): ToolAssignment | null {
    const idx = this.assignments.findIndex((a) => a.assignment_id === id);
    if (idx === -1) return null;
    this.assignments[idx] = { ...this.assignments[idx], ...updates };
    return this.assignments[idx];
  }

  deleteAssignment(id: string): boolean {
    const initial = this.assignments.length;
    this.assignments = this.assignments.filter((a) => a.assignment_id !== id);
    return this.assignments.length < initial;
  }

  // -----------------------------------------------------------------------
  // GUIDANCE & STEPS (API-025, FEAT-036)
  // -----------------------------------------------------------------------
  getGuidanceForScope(
    scopeType: 'category' | 'template',
    scopeId: string
  ): (Guidance & { steps: GuidanceStep[]; isInherited: boolean }) | null {
    const isDirectMatch = (g: Guidance) => {
      if (g.scope_type !== scopeType || !g.is_active) return false;
      if (g.scope_id === scopeId) return true;
      if (scopeType === 'template') {
        const canonical = TEMPLATE_ALIASES[scopeId];
        if (canonical && g.scope_id === canonical) return true;
        const rev = REVERSE_TEMPLATE_ALIASES[scopeId];
        if (rev && g.scope_id === rev) return true;
      }
      return false;
    };

    const direct = this.guidanceList.find(isDirectMatch);
    if (direct) {
      const steps = this.guidanceSteps
        .filter((s) => s.guidance_id === direct.guidance_id)
        .sort((a, b) => a.position - b.position);

      const populatedSteps = steps.map((s) => {
        const media = s.media_id ? this.mediaAssets.find((m) => m.media_id === s.media_id) || null : null;
        return {
          ...s,
          media,
          image_url: s.image_url || media?.storage_reference || null,
          image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
        };
      });

      return { ...direct, steps: populatedSteps, isInherited: false };
    }

    // If template, walk up category ancestors
    if (scopeType === 'template') {
      const template = this.getTemplateById(scopeId);
      if (template) {
        let catId: string | null = template.category_id;
        while (catId) {
          const catGuide = this.guidanceList.find((g) => g.scope_type === 'category' && g.scope_id === catId && g.is_active);
          if (catGuide) {
            const steps = this.guidanceSteps
              .filter((s) => s.guidance_id === catGuide.guidance_id)
              .sort((a, b) => a.position - b.position);

            const populatedSteps = steps.map((s) => {
              const media = s.media_id ? this.mediaAssets.find((m) => m.media_id === s.media_id) || null : null;
              return {
                ...s,
                media,
                image_url: s.image_url || media?.storage_reference || null,
                image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
              };
            });

            return { ...catGuide, steps: populatedSteps, isInherited: true };
          }
          const parentCat = this.getCategoryById(catId);
          catId = parentCat?.parent_id || null;
        }
      }
    }
    return null;
  }

  getGuidanceById(guidanceId: string): (Guidance & { steps: GuidanceStep[] }) | null {
    const guide = this.guidanceList.find((g) => g.guidance_id === guidanceId);
    if (!guide) return null;
    const steps = this.getGuidanceSteps(guidanceId);
    return { ...guide, steps };
  }

  getGuidanceSteps(guidanceId: string): GuidanceStep[] {
    const rawSteps = this.guidanceSteps
      .filter((s) => s.guidance_id === guidanceId)
      .sort((a, b) => a.position - b.position);

    return rawSteps.map((s) => {
      const media = s.media_id ? this.mediaAssets.find((m) => m.media_id === s.media_id) || null : null;
      return {
        ...s,
        media,
        image_url: s.image_url || media?.storage_reference || null,
        image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
      };
    });
  }

  getGuidanceStepById(stepId: string): (GuidanceStep & { media?: MediaAsset | null }) | undefined {
    const step = this.guidanceSteps.find((s) => s.step_id === stepId);
    if (!step) return undefined;

    const media = step.media_id ? this.mediaAssets.find((m) => m.media_id === step.media_id) || null : null;
    return {
      ...step,
      media,
      image_url: step.image_url || media?.storage_reference || null,
      image_alt: step.image_alt || (step.title ? `${step.title} preview` : null),
    };
  }

  createGuidanceStep(
    guidanceId: string,
    data: {
      instruction: string;
      title?: string;
      tip?: string;
      media_id?: string | null;
      image_url?: string | null;
      image_alt?: string | null;
      position?: number;
    }
  ): GuidanceStep {
    const existing = this.guidanceSteps.filter((s) => s.guidance_id === guidanceId);
    const position = data.position || existing.length + 1;
    const stepId = `step-${guidanceId}-${Date.now()}`;

    const newStep: GuidanceStep = {
      step_id: stepId,
      guidance_id: guidanceId,
      position,
      instruction: data.instruction,
      title: data.title || `Step ${position}`,
      tip: data.tip || '',
      media_id: data.media_id || null,
      image_url: data.image_url || null,
      image_alt: data.image_alt || null,
    };

    this.guidanceSteps.push(newStep);

    const media = newStep.media_id ? this.mediaAssets.find((m) => m.media_id === newStep.media_id) || null : null;
    return {
      ...newStep,
      media,
      image_url: newStep.image_url || media?.storage_reference || null,
      image_alt: newStep.image_alt || null,
    };
  }

  updateGuidanceStep(stepId: string, updates: Partial<GuidanceStep>): GuidanceStep | null {
    const idx = this.guidanceSteps.findIndex((s) => s.step_id === stepId);
    if (idx === -1) return null;

    const existing = this.guidanceSteps[idx];
    const updated: GuidanceStep = {
      ...existing,
      ...updates,
      step_id: existing.step_id,
      guidance_id: existing.guidance_id,
    };

    if (updates.position && updates.position !== existing.position) {
      const siblings = this.guidanceSteps
        .filter((s) => s.guidance_id === existing.guidance_id && s.step_id !== stepId)
        .sort((a, b) => a.position - b.position);

      const insertIdx = Math.max(0, Math.min(siblings.length, updates.position - 1));
      siblings.splice(insertIdx, 0, updated);
      siblings.forEach((s, i) => {
        s.position = i + 1;
      });
    }

    this.guidanceSteps[idx] = updated;

    const media = updated.media_id ? this.mediaAssets.find((m) => m.media_id === updated.media_id) || null : null;
    return {
      ...updated,
      media,
      image_url: updated.image_url || media?.storage_reference || null,
      image_alt: updated.image_alt || null,
    };
  }

  deleteGuidanceStep(stepId: string): { success: boolean; deletedStep?: GuidanceStep; remainingSteps: GuidanceStep[] } {
    const idx = this.guidanceSteps.findIndex((s) => s.step_id === stepId);
    if (idx === -1) return { success: false, remainingSteps: [] };

    const [deletedStep] = this.guidanceSteps.splice(idx, 1);

    const remaining = this.guidanceSteps
      .filter((s) => s.guidance_id === deletedStep.guidance_id)
      .sort((a, b) => a.position - b.position);

    remaining.forEach((s, i) => {
      s.position = i + 1;
    });

    return { success: true, deletedStep, remainingSteps: remaining };
  }

  removeStepImage(stepId: string): { success: boolean; step?: GuidanceStep; previousMediaId?: string | null } {
    const step = this.guidanceSteps.find((s) => s.step_id === stepId);
    if (!step) return { success: false };

    const previousMediaId = step.media_id;
    step.media_id = null;
    step.image_url = null;
    step.image_alt = null;

    return { success: true, step, previousMediaId };
  }

  reorderGuidanceSteps(guidanceId: string, orderedStepIds: string[]): GuidanceStep[] {
    orderedStepIds.forEach((id, index) => {
      const step = this.guidanceSteps.find((s) => s.step_id === id && s.guidance_id === guidanceId);
      if (step) {
        step.position = index + 1;
      }
    });

    return this.getGuidanceSteps(guidanceId);
  }

  saveGuidance(
    scopeType: 'category' | 'template',
    scopeId: string,
    presentation: 'written' | 'recorded' | 'both',
    steps: Array<
      | string
      | {
          step_id?: string;
          instruction: string;
          title?: string;
          tip?: string;
          media_id?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          position?: number;
        }
    >
  ): Guidance & { steps: GuidanceStep[] } {
    let guide = this.guidanceList.find((g) => g.scope_type === scopeType && g.scope_id === scopeId);
    if (!guide) {
      guide = {
        guidance_id: `guide-${Date.now()}`,
        scope_type: scopeType,
        scope_id: scopeId,
        presentation,
        media_id: null,
        is_active: true,
      };
      this.guidanceList.push(guide);
    } else {
      guide.presentation = presentation;
      guide.is_active = true;
    }

    // Replace steps for this guidance_id
    this.guidanceSteps = this.guidanceSteps.filter((s) => s.guidance_id !== guide.guidance_id);

    const newSteps: GuidanceStep[] = steps.map((rawStep, idx) => {
      if (typeof rawStep === 'string') {
        return {
          step_id: `step-${guide.guidance_id}-${idx + 1}`,
          guidance_id: guide.guidance_id,
          position: idx + 1,
          instruction: rawStep,
          title: `Step ${idx + 1}`,
          tip: '',
          media_id: null,
          image_url: null,
          image_alt: null,
        };
      }
      return {
        step_id: rawStep.step_id || `step-${guide.guidance_id}-${idx + 1}`,
        guidance_id: guide.guidance_id,
        position: rawStep.position || idx + 1,
        instruction: rawStep.instruction,
        title: rawStep.title || `Step ${idx + 1}`,
        tip: rawStep.tip || '',
        media_id: rawStep.media_id || null,
        image_url: rawStep.image_url || null,
        image_alt: rawStep.image_alt || null,
      };
    });

    this.guidanceSteps.push(...newSteps);

    const populated = newSteps.map((s) => {
      const media = s.media_id ? this.mediaAssets.find((m) => m.media_id === s.media_id) || null : null;
      return {
        ...s,
        media,
        image_url: s.image_url || media?.storage_reference || null,
        image_alt: s.image_alt || (s.title ? `${s.title} preview` : null),
      };
    });

    return { ...guide, steps: populated };
  }

  // -----------------------------------------------------------------------
  // LANGUAGES & TRANSLATIONS (API-040 & API-041)
  // -----------------------------------------------------------------------
  getLanguages(): Language[] {
    return [...this.languages];
  }

  addLanguage(language_id: string, name: string): Language {
    if (this.languages.some((l) => l.language_id === language_id)) {
      throw new Error(`Language '${language_id}' already exists.`);
    }
    const lang: Language = {
      language_id,
      name,
      is_default: false,
      is_enabled: true,
    };
    this.languages.push(lang);
    return lang;
  }

  updateLanguage(languageId: string, updates: Partial<Language>): Language {
    const lang = this.languages.find((l) => l.language_id === languageId);
    if (!lang) throw new Error('Language not found');

    // Rule 18: Exactly one language has is_default = true (07 V19, 08 §5 Rule 18)
    if (updates.is_default === false && lang.is_default) {
      throw new Error('Cannot unset the default language. Set another language as default first.');
    }
    if (updates.is_enabled === false && lang.is_default) {
      throw new Error('Cannot disable the default language.');
    }

    if (updates.is_default === true) {
      this.languages.forEach((l) => (l.is_default = l.language_id === languageId));
    }

    Object.assign(lang, updates);
    return lang;
  }

  getTranslations(entityType?: string, entityId?: string, languageId?: string): Translation[] {
    let result = [...this.translations];
    if (entityType) result = result.filter((t) => t.entity_type === entityType);
    if (entityId) result = result.filter((t) => t.entity_id === entityId);
    if (languageId) result = result.filter((t) => t.language_id === languageId);
    return result;
  }

  setTranslation(data: Omit<Translation, 'translation_id'>): Translation {
    const existing = this.translations.find(
      (t) =>
        t.language_id === data.language_id &&
        t.entity_type === data.entity_type &&
        t.entity_id === data.entity_id &&
        t.field_name === data.field_name
    );

    if (existing) {
      existing.translated_text = data.translated_text;
      return existing;
    }

    const newTrans: Translation = {
      ...data,
      translation_id: `trans-${Date.now()}`,
    };
    this.translations.push(newTrans);
    return newTrans;
  }

  // -----------------------------------------------------------------------
  // MEDIA ASSETS (API-026, 07 §4.7 & §14)
  // -----------------------------------------------------------------------
  getMediaAssets(): MediaAsset[] {
    return [...this.mediaAssets];
  }

  getMediaAssetById(id: string): MediaAsset | undefined {
    return this.mediaAssets.find((m) => m.media_id === id);
  }

  addMediaAsset(asset: Omit<MediaAsset, 'media_id' | 'uploaded_at'> & { media_id?: string }): MediaAsset {
    const newAsset: MediaAsset = {
      ...asset,
      media_id: asset.media_id || `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploaded_at: new Date().toISOString(),
    };
    this.mediaAssets.push(newAsset);
    return newAsset;
  }

  getMediaReferenceCount(mediaId: string): {
    total: number;
    steps: string[];
    templates: string[];
    categories: string[];
    tools: string[];
    guidance: string[];
  } {
    const steps = this.guidanceSteps.filter((s) => s.media_id === mediaId).map((s) => s.step_id);
    const templates = this.templates.filter((t) => t.preview_media_id === mediaId).map((t) => t.template_id);
    const categories = this.categories.filter((c) => c.preview_media_id === mediaId).map((c) => c.category_id);
    const tools = this.tools.filter((t) => t.logo_media_id === mediaId).map((t) => t.tool_id);
    const guidance = this.guidanceList.filter((g) => g.media_id === mediaId).map((g) => g.guidance_id);

    const total = steps.length + templates.length + categories.length + tools.length + guidance.length;
    return { total, steps, templates, categories, tools, guidance };
  }

  deleteMediaAsset(id: string, force: boolean = false): { success: boolean; error?: string; referenceCount?: number; references?: ReturnType<PublicDatabaseStore['getMediaReferenceCount']> } {
    const refs = this.getMediaReferenceCount(id);
    if (refs.total > 0 && !force) {
      return {
        success: false,
        error: `Cannot delete media: asset is currently referenced by ${refs.total} catalog item(s) (${refs.steps.length} guidance step(s), ${refs.templates.length} template(s)).`,
        referenceCount: refs.total,
        references: refs,
      };
    }

    const initial = this.mediaAssets.length;
    this.mediaAssets = this.mediaAssets.filter((m) => m.media_id !== id);
    return { success: this.mediaAssets.length < initial, referenceCount: refs.total };
  }

  // -----------------------------------------------------------------------
  // CURATED COLLECTIONS & RECOMMENDATIONS API
  // -----------------------------------------------------------------------
  getCuratedCollections(options?: {
    onlyActive?: boolean;
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    page?: number;
    limit?: number;
  }): {
    collections: CuratedCollection[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    counts: { total: number; active: number; inactive: number; totalTemplates: number };
  } {
    let list = [...this.curatedCollections];

    const counts = {
      total: this.curatedCollections.length,
      active: this.curatedCollections.filter((c) => c.is_active).length,
      inactive: this.curatedCollections.filter((c) => !c.is_active).length,
      totalTemplates: new Set(this.curatedCollections.flatMap((c) => c.template_ids)).size,
    };

    if (options?.onlyActive || options?.status === 'active') {
      list = list.filter((c) => c.is_active);
    } else if (options?.status === 'inactive') {
      list = list.filter((c) => !c.is_active);
    }

    if (options?.search?.trim()) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Sort by position ascending, then updated_at descending
    list.sort((a, b) => {
      if (a.position !== b.position) return a.position - b.position;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, Math.min(100, options?.limit || 20));
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      collections: paginated,
      total,
      page,
      limit,
      totalPages,
      counts,
    };
  }

  getCuratedCollectionById(id: string): CuratedCollection | undefined {
    return this.curatedCollections.find((c) => c.collection_id === id || c.slug === id);
  }

  createCuratedCollection(data: {
    name: string;
    slug?: string;
    description?: string;
    cover_image?: string | null;
    is_active?: boolean;
    position?: number;
    template_ids?: string[];
    created_by?: string;
  }): CuratedCollection {
    const slug =
      (data.slug?.trim() || data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) ||
      `collection-${Date.now()}`;

    // Deduplicate templates preserving order
    const template_ids = Array.from(new Set(data.template_ids || []));
    const position = data.position ?? (this.curatedCollections.length + 1);

    const newCollection: CuratedCollection = {
      collection_id: `col-curated-${Date.now()}`,
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || '',
      cover_image: data.cover_image || (template_ids.length > 0 ? this.getTemplateById(template_ids[0])?.preview_image || null : null),
      is_active: data.is_active ?? true,
      position,
      template_ids,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: data.created_by || 'usr-admin-1',
    };

    this.curatedCollections.push(newCollection);
    return newCollection;
  }

  updateCuratedCollection(
    id: string,
    updates: Partial<CuratedCollection>
  ): CuratedCollection | null {
    const idx = this.curatedCollections.findIndex((c) => c.collection_id === id);
    if (idx === -1) return null;

    const existing = this.curatedCollections[idx];
    const template_ids = updates.template_ids ? Array.from(new Set(updates.template_ids)) : existing.template_ids;

    // Filter out undefined values to prevent overwriting existing values with undefined
    const cleanUpdates: Partial<CuratedCollection> = {};
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        (cleanUpdates as Record<string, unknown>)[key] = val;
      }
    }

    const updated: CuratedCollection = {
      ...existing,
      ...cleanUpdates,
      template_ids,
      updated_at: new Date().toISOString(),
    };

    this.curatedCollections[idx] = updated;
    return updated;
  }

  toggleCuratedCollectionStatus(id: string): CuratedCollection | null {
    const col = this.getCuratedCollectionById(id);
    if (!col) return null;
    return this.updateCuratedCollection(col.collection_id, { is_active: !col.is_active });
  }

  deleteCuratedCollection(id: string): boolean {
    const initial = this.curatedCollections.length;
    this.curatedCollections = this.curatedCollections.filter((c) => c.collection_id !== id);
    return this.curatedCollections.length < initial;
  }

  /**
   * Public Recommendation API:
   * Returns ONLY active collections with safe template summaries.
   * Absolutely NO private prompt text is returned!
   */
  getPublicRecommendations(): Array<
    CuratedCollection & {
      templates: Array<{
        template_id: string;
        name: string;
        description: string;
        preview_image?: string;
        mainCategory?: string;
        tags?: string[];
        difficulty?: string;
      }>;
    }
  > {
    return this.curatedCollections
      .filter((c) => c.is_active)
      .sort((a, b) => a.position - b.position)
      .map((col) => {
        const templates = col.template_ids
          .map((tId) => {
            const t = this.getTemplateById(tId);
            if (!t || t.status === 'archived' || t.status === 'hidden') return null;
            return {
              template_id: t.template_id,
              name: t.name,
              description: t.description,
              preview_image: t.preview_image,
              mainCategory: (allTemplates.find((at) => at.id === t.template_id)?.mainCategory) || 'Image',
              tags: t.tags,
              difficulty: t.difficulty,
            };
          })
          .filter(Boolean) as Array<{
            template_id: string;
            name: string;
            description: string;
            preview_image?: string;
            mainCategory?: string;
            tags?: string[];
            difficulty?: string;
          }>;

        return {
          ...col,
          templates,
        };
      });
  }
}

// Global singleton instance for public store
declare global {
  var __awa_public_db__: PublicDatabaseStore | undefined;
}

export const publicDb: PublicDatabaseStore =
  globalThis.__awa_public_db__ ?? (globalThis.__awa_public_db__ = new PublicDatabaseStore());

