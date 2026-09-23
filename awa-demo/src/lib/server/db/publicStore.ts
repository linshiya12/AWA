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
} from '../types';

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
        category_id: 'cat-websites',
        parent_id: null,
        name: 'Websites',
        description: 'Landing pages, SaaS hero components, portfolio showcases, and web UI layouts',
        position: 4,
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

    // 5. Guidance & Steps (07 §4.6)
    const catGuidance: Guidance = {
      guidance_id: 'guide-cat-image',
      scope_type: 'category',
      scope_id: 'cat-image-gen',
      presentation: 'written',
      media_id: null,
      is_active: true,
    };
    this.guidanceList.push(catGuidance);

    this.guidanceSteps.push(
      {
        step_id: 'step-img-1',
        guidance_id: 'guide-cat-image',
        position: 1,
        instruction: 'Copy the prompt text below and open your external tool (e.g. Midjourney or FLUX).',
      },
      {
        step_id: 'step-img-2',
        guidance_id: 'guide-cat-image',
        position: 2,
        instruction: 'Paste into the prompt input. Add parameter flags such as --ar 16:9 --v 6.1 if using Midjourney.',
      },
      {
        step_id: 'step-img-3',
        guidance_id: 'guide-cat-image',
        position: 3,
        instruction: 'Review the generated 4-up grid and upscale the best variation for your campaign.',
      }
    );

    const webGuidance: Guidance = {
      guidance_id: 'guide-cat-websites',
      scope_type: 'category',
      scope_id: 'cat-websites',
      presentation: 'written',
      media_id: null,
      is_active: true,
    };
    this.guidanceList.push(webGuidance);

    this.guidanceSteps.push(
      {
        step_id: 'step-web-1',
        guidance_id: 'guide-cat-websites',
        position: 1,
        instruction: 'Copy the UI Prompt and paste it into your AI code generator (v0 by Vercel, Cursor, Framer AI, or Lovable).',
      },
      {
        step_id: 'step-web-2',
        guidance_id: 'guide-cat-websites',
        position: 2,
        instruction: 'Copy the Business Context Prompt to supply authentic product identity, audience, copy tone, and CTAs.',
      },
      {
        step_id: 'step-web-3',
        guidance_id: 'guide-cat-websites',
        position: 3,
        instruction: 'Review the generated React/Tailwind code or interactive site preview, refine responsive breakpoints, and deploy to your preferred hosting provider.',
      }
    );

    // 6. Templates (07 §4.2: NO prompt text! Only metadata and current_version_id reference)
    // Note: 3 free sample templates (05-MVP.md §3.3)
    this.templates = [
      {
        template_id: 'tpl-hero-product',
        category_id: 'subcat-product-photo',
        name: 'Studio Product Hero',
        description: 'Clean minimalist studio product photograph on seamless white infinity background with soft shadows.',
        preview_media_id: null,
        preview_image: '/images/templates/tpl_1_wide.jpg',
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
        preview_image: '/images/templates/tpl_2_wide.jpg',
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
        preview_image: '/images/templates/tpl_splash.jpg',
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
    ];

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

  getTemplateById(id: string): Template | undefined {
    return this.templates.find((t) => t.template_id === id);
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
  // GUIDANCE & STEPS (API-025)
  // -----------------------------------------------------------------------
  getGuidanceForScope(scopeType: 'category' | 'template', scopeId: string): (Guidance & { steps: GuidanceStep[]; isInherited: boolean }) | null {
    const direct = this.guidanceList.find((g) => g.scope_type === scopeType && g.scope_id === scopeId && g.is_active);
    if (direct) {
      const steps = this.guidanceSteps.filter((s) => s.guidance_id === direct.guidance_id).sort((a, b) => a.position - b.position);
      return { ...direct, steps, isInherited: false };
    }

    // If template, walk up category ancestors
    if (scopeType === 'template') {
      const template = this.getTemplateById(scopeId);
      if (template) {
        let catId: string | null = template.category_id;
        while (catId) {
          const catGuide = this.guidanceList.find((g) => g.scope_type === 'category' && g.scope_id === catId && g.is_active);
          if (catGuide) {
            const steps = this.guidanceSteps.filter((s) => s.guidance_id === catGuide.guidance_id).sort((a, b) => a.position - b.position);
            return { ...catGuide, steps, isInherited: true };
          }
          const parentCat = this.getCategoryById(catId);
          catId = parentCat?.parent_id || null;
        }
      }
    }
    return null;
  }

  saveGuidance(
    scopeType: 'category' | 'template',
    scopeId: string,
    presentation: 'written' | 'recorded' | 'both',
    steps: string[]
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

    // Replace steps
    this.guidanceSteps = this.guidanceSteps.filter((s) => s.guidance_id !== guide.guidance_id);
    const newSteps: GuidanceStep[] = steps.map((instruction, idx) => ({
      step_id: `step-${guide.guidance_id}-${idx + 1}`,
      guidance_id: guide.guidance_id,
      position: idx + 1,
      instruction,
    }));
    this.guidanceSteps.push(...newSteps);

    return { ...guide, steps: newSteps };
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
  // MEDIA ASSETS (API-026)
  // -----------------------------------------------------------------------
  getMediaAssets(): MediaAsset[] {
    return [...this.mediaAssets];
  }

  addMediaAsset(asset: Omit<MediaAsset, 'media_id' | 'uploaded_at'>): MediaAsset {
    const newAsset: MediaAsset = {
      ...asset,
      media_id: `media-${Date.now()}`,
      uploaded_at: new Date().toISOString(),
    };
    this.mediaAssets.push(newAsset);
    return newAsset;
  }

  deleteMediaAsset(id: string): boolean {
    const initial = this.mediaAssets.length;
    this.mediaAssets = this.mediaAssets.filter((m) => m.media_id !== id);
    return this.mediaAssets.length < initial;
  }
}

// Global singleton instance for public store
declare global {
  var __awa_public_db__: PublicDatabaseStore | undefined;
}

export const publicDb: PublicDatabaseStore =
  globalThis.__awa_public_db__ ?? (globalThis.__awa_public_db__ = new PublicDatabaseStore());
