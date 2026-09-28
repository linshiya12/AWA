import { ALL_GUIDANCE_CATALOG } from './guidanceCatalog';

export interface Tool {
  id: string;
  name: string;
  logo: string;
  isFree: boolean;
  qualityLabel: string;
  reason: string;
  url: string;
}

export interface GuidanceStep {
  step: number;
  title: string;
  description: string;
  image: string;
  image_alt?: string;
  media_id?: string | null;
  tip?: string;
  actionText?: string;
  actionUrl?: string;
  text?: string;
}

export interface Template {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  produces: string;
  mainCategory: 'Image' | 'Video' | 'Slides' | 'Websites';
  media: {
    thumbnail: string;
    primaryImage?: string;
    gallery?: string[];
    videoUrl?: string;
    poster?: string;
    slides?: string[];
    desktopPreview?: string;
    mobilePreview?: string;
    motionPreviewUrl?: string;
  };
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  models: string[];
  basePrompt: string;
  uiPrompt?: string;
  contextPrompt?: string;
  tools: Tool[];
  guidance: GuidanceStep[];
  previewAccent: string;
  charCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  templates: Template[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export const toolsDB: Record<string, Tool> = {
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    logo: '/images/tools/midjourney.png',
    isFree: false,
    qualityLabel: 'Pro Quality',
    reason: 'Produces the most photorealistic lighting and textures for product photography.',
    url: 'https://midjourney.com',
  },
  firefly: {
    id: 'firefly',
    name: 'Adobe Firefly',
    logo: '/images/tools/firefly.png',
    isFree: false,
    qualityLabel: 'Commercial Safe',
    reason: 'Trained exclusively on licensed content, ideal for enterprise e-commerce and commercial advertising.',
    url: 'https://firefly.adobe.com',
  },
  dalle3: {
    id: 'dalle3',
    name: 'DALL-E 3',
    logo: '/images/tools/dalle3.png',
    isFree: false,
    qualityLabel: 'High Accuracy',
    reason: 'Follows prompt instructions strictly, great for precise staging requirements.',
    url: 'https://chatgpt.com',
  },
  flux: {
    id: 'flux',
    name: 'FLUX.1 Pro',
    logo: '/images/tools/flux.png',
    isFree: false,
    qualityLabel: 'Next-Gen Detail',
    reason: 'Exceptional text rendering and micro-texture fidelity for industrial design.',
    url: 'https://blackforestlabs.ai',
  },
  runway: {
    id: 'runway',
    name: 'Runway Gen-2',
    logo: '',
    isFree: false,
    qualityLabel: 'Pro Video',
    reason: 'Industry standard for high-fidelity generative video and camera control.',
    url: 'https://runwayml.com',
  },
  pika: {
    id: 'pika',
    name: 'Pika Labs',
    logo: '',
    isFree: false,
    qualityLabel: 'Cinematic Motion',
    reason: 'Excellent for fluid character animation and cinematic motion.',
    url: 'https://pika.art',
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    logo: '',
    isFree: true,
    qualityLabel: 'Fast Presentations',
    reason: 'Best for rapidly generating beautiful, responsive slides from text.',
    url: 'https://gamma.app',
  },
  v0: {
    id: 'v0',
    name: 'v0 by Vercel',
    logo: '',
    isFree: true,
    qualityLabel: 'React/Tailwind',
    reason: 'Produces clean, production-ready React components using Tailwind CSS.',
    url: 'https://v0.dev',
  },
  framer: {
    id: 'framer',
    name: 'Framer AI',
    logo: '',
    isFree: false,
    qualityLabel: 'Website Builder',
    reason: 'Generates entire responsive marketing sites with a single prompt.',
    url: 'https://framer.com',
  }
};

export const HERO_BASE_PROMPT = `Studio product photograph of a generic unbranded cylindrical ceramic tumbler, centered composition. Seamless pure white infinity cove background (hex #FFFFFF), no visible horizon line.

Lighting: Three-point softbox setup — key light at 45-degrees camera left through a 120cm octabox, soft rim light from behind camera right for crisp edge separation, fill card camera right at 2:1 ratio for subtle shadow fill.

Camera & Optics: Shot on Hasselblad H6D-100c, 120mm macro prime lens, f/11 aperture for edge-to-edge tack-sharp focus, ISO 64, 1/160s shutter speed. Neutral color profile, true-to-life surface textures, zero chromatic aberration, crisp contact shadow directly beneath product.

Parameters: --ar 1:1 --v 6.0 --style raw --q 2`;

export const FESTIVE_BANNER_PROMPT = `Cinematic wide advertising hero banner of a luxury product set amidst a lavish festive holiday composition. Deep crimson and champagne gold color palette with subtle ambient bokeh particles.

Lighting: Warm 3200K tungsten backlight creating crisp amber rim lighting around the silhouette. Soft frontal diffused fill card revealing rich product textures without specular glare.

Camera & Optics: Shot on ARRI Alexa Mini LF with Zeiss Supreme Prime 50mm T1.5 at T2.8. Smooth cinematic shallow depth of field, natural anamorphic lens flare accents, zero chromatic aberration.

Parameters: --ar 16:9 --v 6.0 --style raw`;

export const mockCatalog: Category[] = [
  {
    id: 'image',
    name: 'Image',
    description: 'Master-crafted prompts for e-commerce, advertising, and commercial photography.',
    subcategories: [
      {
        id: 'ecommerce-listing-shots',
        name: 'E-commerce Listing Shots',
        description: 'Clean, compliant hero and catalog shots designed for Amazon, Shopify, and mobile storefronts.',
        templates: [
          {
            id: 'tpl_1',
            name: 'Plain product on white',
            title: 'Plain product on white',
            subtitle: 'E-commerce white background isolation',
            category: 'Product Photography',
            description: 'A clean, minimalist product photograph on a seamless white background, ready for Amazon or Shopify.',
            produces: 'Studio-grade, color-accurate isolated product photography on a pure white infinity cove with crisp contact shadows.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/tpl_1.jpg',
              primaryImage: '/images/templates/tpl_1.jpg',
              gallery: ['/images/templates/tpl_1.jpg', '/images/templates/tpl_1_wide.jpg']
            },
            tags: ['Product', 'Minimalist', 'E-commerce', 'Amazon-Ready'],
            difficulty: 'Easy',
            models: ['Midjourney v6', 'DALL-E 3'],
            uiPrompt: "[UI & OPTICS PROMPT]\nCamera & Optics: Shot on Hasselblad H6D-100c, 120mm macro prime lens, f/11 aperture for edge-to-edge tack-sharp focus, ISO 64, 1/160s shutter speed. Neutral commercial color profile, true-to-life surface micro-textures, zero chromatic aberration, natural soft contact shadow directly beneath base.\nStudio Environment: Seamless pure white infinity cove background (hex #FFFFFF), no visible horizon line or floor seam.\nLighting Architecture: Three-point softbox studio lighting — key light at 45-degree camera left through a 120cm octabox, rim light from camera right behind for crisp rim highlight and edge separation, 2:1 white foam fill card camera right for subtle shadow recovery.\nParameters: --ar 1:1 --v 6.0 --style raw --q 2",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject: Luxury cylindrical ceramic tumbler with tactile matte glaze, centered macro composition.\nCommercial Purpose: Clean hero asset suitable for Amazon, Shopify, or print catalogs requiring 100% white background (#FFFFFF) isolation and compliant Amazon hero standards.\nAudience & Tone: Discerning modern consumers looking for minimalist home goods and high-end ceramics. Clean, premium, uncluttered, and trustworthy.\nContent Requirements: The product must be centered, upright, fully isolated without cropping, displaying clean rim geometry, subtle matte reflections, and grounded contact shadows.",
            basePrompt: HERO_BASE_PROMPT,
            charCount: HERO_BASE_PROMPT.length,
            previewAccent: 'from-amber-500/20 via-rose-500/10 to-transparent',
            tools: [toolsDB.midjourney, toolsDB.dalle3],
            guidance: [
              {
                step: 1,
                title: 'Select AI Generation Tool',
                description: 'Open Midjourney (via web console or Discord) or DALL-E 3. Midjourney v6 is recommended for high-resolution edge definition and tactile ceramic/glass textures.',
                image: '/images/guidance/tpl_1/step-1.svg',
                tip: 'Ensure Midjourney v6.0 mode is active by typing /settings or appending --v 6.0.',
                actionText: 'Open Midjourney',
                actionUrl: 'https://midjourney.com',
                text: 'Select Midjourney v6.0 or DALL-E 3 for optimal surface textures and studio lighting.'
              },
              {
                step: 2,
                title: 'Setup Pure White Infinity Cove',
                description: 'Configure a pure white #FFFFFF seamless backdrop with a 3-point softbox setup: key octabox at 45° camera left, rim light from behind right, and a 2:1 white fill card.',
                image: '/images/guidance/tpl_1/step-2.svg',
                tip: 'Seamless infinity sweeps eliminate distracting floor-wall horizon lines.',
                text: 'Setup 3-point softbox studio lighting and #FFFFFF pure white infinity sweep.'
              },
              {
                step: 3,
                title: 'Configure Camera Optics & Shadows',
                description: 'Specify a Hasselblad H6D-100c with 120mm macro prime lens at f/11. This creates edge-to-edge tack sharpness with a grounded contact shadow directly beneath the base.',
                image: '/images/guidance/tpl_1/step-3.svg',
                tip: 'High f-stop (f/11) prevents unwanted optical blur on the outer edges of your product.',
                text: 'Specify 120mm macro optics at f/11 for tack-sharp focus and subtle contact shadows.'
              },
              {
                step: 4,
                title: 'Customize Subject & Parameters',
                description: 'Replace "cylindrical ceramic tumbler" with your specific product (e.g., "frosted glass cosmetic bottle") and verify the production flags: --ar 1:1 --v 6.0 --style raw --q 2.',
                image: '/images/guidance/tpl_1/step-4.svg',
                tip: 'The --style raw parameter prevents Midjourney from adding unwanted artistic embellishments.',
                text: 'Replace subject placeholder with your product and preserve the raw parameters.'
              },
              {
                step: 5,
                title: 'Generate & Inspect Quad Preview',
                description: 'Submit your prompt. Midjourney will generate a 4-image grid in 30-60 seconds. Inspect the variants for clean silhouette edges and balanced lighting symmetry.',
                image: '/images/guidance/tpl_1/step-5.svg',
                tip: 'Click U1, U2, U3, or U4 under the grid to upscale your favorite variant.',
                text: 'Submit the prompt, evaluate the 4-quadrant preview, and select your top variant.'
              },
              {
                step: 6,
                title: 'Upscale & Verify Background Compliance',
                description: 'Download the high-resolution render and inspect the background pixels using an eyedropper tool to confirm clean RGB 255, 255, 255 values required by Amazon and Shopify.',
                image: '/images/guidance/tpl_1/step-6.svg',
                tip: 'If slight grey tones appear around edges, use Photoshop or an automated clipping tool for 100% white cutout.',
                actionText: 'Download Master',
                text: 'Upscale to full resolution and confirm pure white background for catalog compliance.'
              }
            ]
          },
          {
            id: 'tpl_2',
            name: 'Lifestyle shot, in-use',
            title: 'Lifestyle shot, in-use',
            subtitle: 'Real-world Scandinavian interior setting',
            category: 'Lifestyle',
            description: 'Place your product in a realistic living room or kitchen environment with natural sunlight.',
            produces: 'Editorial lifestyle composition placing consumer goods in architectural interior spaces with warm ambient daylight.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/tpl_2.jpg',
              primaryImage: '/images/templates/tpl_2.jpg',
              gallery: ['/images/templates/tpl_2.jpg', '/images/templates/tpl_2_wide.jpg']
            },
            tags: ['Lifestyle', 'Context', 'Social Media'],
            difficulty: 'Medium',
            models: ['Midjourney v6', 'Adobe Firefly'],
            uiPrompt: "[UI & OPTICS PROMPT]\nCamera & Optics: Leica SL2, Summilux-SL 50mm f/1.4 ASPH at f/2.2 for cinematic shallow depth of field, creamy background bokeh, ISO 100, 1/250s. Medium-close angle, rule-of-thirds framing, product held at chest height in sharp focus.\nLighting Architecture: Golden hour morning sunlight at 3800K entering from camera left through sheer curtains, soft diffused bounce fill card camera right for delicate facial and mug shadow detail.\nPalette & Atmosphere: Warm ivory, natural oak honey tones, soft terracotta glaze, and muted sage green with gentle morning haze.\nParameters: --ar 4:5 --v 6.0 --style raw",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject & Setting: Authentic human hands holding a handcrafted textured ceramic coffee mug with both hands, seated near a sunlit window at a honed white oak breakfast bar in a modern Scandinavian kitchen.\nPurpose & Narrative: Editorial in-context photograph capturing mindful morning rituals, warmth, and daily grounding for brand lookbooks and digital lifestyle campaigns.\nAudience & Tone: Contemporary lifestyle consumers, specialty coffee lovers, and interior design advocates seeking cozy authenticity and tactile connection.",
            basePrompt: `Editorial lifestyle photograph of a consumer lifestyle product placed on a solid white oak coffee table in a sun-drenched Scandinavian apartment. Warm 10am morning daylight streaming through floor-to-ceiling loft windows, casting natural organic shadows.

Environment: Clean minimalist interior with textured linen sofa and fiddle-leaf fig plant in soft background bokeh. Natural warm earth tones.

Camera & Optics: Shot on Sony A7R V with 50mm f/1.4 GM lens, shot wide open at f/2.0 for cinematic shallow depth of field. Film-like grain, subtle Kodak Portra 400 color science, crisp foreground focus on the product.

Parameters: --ar 4:5 --v 6.0 --style raw`,
            charCount: 684,
            previewAccent: 'from-teal-500/20 via-amber-500/10 to-transparent',
            tools: [toolsDB.midjourney, toolsDB.firefly],
            guidance: [
              {
                step: 1,
                title: 'Choose Lifestyle Generation Tool',
                description: 'Open Adobe Firefly for commercially safe advertising campaigns, or Midjourney v6 for maximum interior atmosphere and warm cinematic realism.',
                image: '/images/guidance/tpl_2/step-1.svg',
                tip: 'Adobe Firefly is trained exclusively on licensed stock, making it safe for enterprise commercial use.',
                actionText: 'Open Adobe Firefly',
                actionUrl: 'https://firefly.adobe.com',
                text: 'Open Adobe Firefly or Midjourney v6 for lifestyle interior generation.'
              },
              {
                step: 2,
                title: 'Stage the Scandinavian Interior',
                description: 'Place your product on a solid white oak coffee table in a sun-drenched Scandinavian apartment. Include textured linen and a fiddle-leaf fig in soft background bokeh.',
                image: '/images/guidance/tpl_2/step-2.svg',
                tip: 'Keep staging props minimal (1-2 curated items) so attention remains on your product.',
                text: 'Stage interior setting with oak tabletop, textured linen, and organic greenery.'
              },
              {
                step: 3,
                title: 'Calibrate Morning Daylight & Shadows',
                description: 'Instruct the model to cast warm 10am morning daylight streaming through floor-to-ceiling loft windows, creating natural organic diagonal shadows across the surface.',
                image: '/images/guidance/tpl_2/step-3.svg',
                tip: 'Warm morning light (~4500K) feels much more genuine and welcoming than direct camera flash.',
                text: 'Simulate natural 10am morning sunlight streaming through loft windows.'
              },
              {
                step: 4,
                title: 'Tune Aperture & Depth of Field',
                description: 'Specify a Sony A7R V with 50mm f/1.4 GM lens shot wide open at f/2.0. This yields creamy background blur that makes your product pop dramatically in the foreground.',
                image: '/images/guidance/tpl_2/step-4.svg',
                tip: 'Shooting at f/2.0 keeps the product tack-sharp while softening furniture in the background.',
                text: 'Set optics to 50mm f/1.4 shot at f/2.0 for cinematic shallow depth of field.'
              },
              {
                step: 5,
                title: 'Swap In Your Product Subject',
                description: 'Replace "consumer lifestyle product" with your real product (e.g., "minimalist white ceramic pour-over dripper") and set aspect ratio to vertical --ar 4:5.',
                image: '/images/guidance/tpl_2/step-5.svg',
                tip: 'Vertical 4:5 ratio is the optimal aspect ratio for Instagram feeds and mobile Shopify hero banners.',
                text: 'Insert your exact product name and maintain the 4:5 vertical aspect ratio.'
              },
              {
                step: 6,
                title: 'Review Kodak Portra 400 Grading',
                description: 'Generate and review variations for authentic film-like color science. Select the take with warm earth tones, subtle grain, and natural highlights on the product rim.',
                image: '/images/guidance/tpl_2/step-6.svg',
                tip: 'Hover over your favorite take in Firefly or Midjourney and download the high-resolution asset.',
                actionText: 'Save High-Res Image',
                text: 'Inspect filmic Kodak Portra color tones and download your finished lifestyle visual.'
              }
            ]
          },
          {
            id: 'tpl_3',
            name: 'Festive campaign banner',
            title: 'Festive campaign banner',
            subtitle: 'High-energy holiday promotional hero',
            category: 'Advertising & Campaigns',
            description: 'A vibrant, cinematic holiday campaign banner with seasonal lighting, glitter bokeh, and luxury packaging.',
            produces: 'Commercial-grade holiday campaign visual with rich atmospheric depth, dramatic warm rim lighting, and festive bokeh.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/tpl_3.jpg',
              primaryImage: '/images/templates/tpl_3.jpg',
              gallery: ['/images/templates/tpl_3.jpg']
            },
            tags: ['Campaign', 'Holiday', 'Banner', 'E-commerce'],
            difficulty: 'Medium',
            models: ['Adobe Firefly', 'Midjourney v6'],
            uiPrompt: "[UI & OPTICS PROMPT]\nCamera & Optics: ARRI Alexa Mini LF, Zeiss Supreme Prime 50mm T1.5 at T2.8, cinematic anamorphic horizontal streak flares, edge sharpness, zero optical distortion.\nLighting Architecture: Warm 3200K tungsten backlight creating crisp golden rim lighting around the bottle silhouette, soft frontal 5600K diffused fill card revealing rich label typography without glare.\nColor Palette: Deep royal crimson (#881337), champagne gold (#D4AF37), forest evergreen, and warm amber bokeh particles.\nParameters: --ar 16:9 --v 6.0 --style raw --q 2",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject & Setting: Luxury cosmetic glass flacon set amidst a lavish festive holiday composition on a dark midnight velvet drape, accented by frosted pine sprigs, champagne gold satin ribbon loops, and delicate crystal snowflakes.\nCommercial Purpose: High-converting seasonal advertising banner for holiday e-commerce sales, email headers, and social announcements.\nComposition Layout: Asymmetrical composition with product anchored in the left third, leaving soft, uncluttered negative space in the right two-thirds for typography overlay.\nAudience & Tone: Holiday gift shoppers and luxury beauty consumers looking for celebratory indulgence and premium gifting.",
            basePrompt: FESTIVE_BANNER_PROMPT,
            charCount: FESTIVE_BANNER_PROMPT.length,
            previewAccent: 'from-rose-500/20 via-amber-500/15 to-transparent',
            tools: [toolsDB.firefly, toolsDB.midjourney],
            guidance: [
              {
                step: 1,
                title: 'Set 16:9 Widescreen Banner Canvas',
                description: 'Select Midjourney v6 or DALL-E 3 and specify the widescreen 16:9 aspect ratio (--ar 16:9) designed for desktop web hero banners and paid ad carousels.',
                image: '/images/guidance/tpl_3/step-1.svg',
                tip: '16:9 leaves generous negative space on either side for marketing copy and promotional badges.',
                actionText: 'Open Midjourney',
                actionUrl: 'https://midjourney.com',
                text: 'Configure 16:9 widescreen canvas for web hero and advertising placements.'
              },
              {
                step: 2,
                title: 'Establish Holiday Palette & Atmosphere',
                description: 'Define an opulent seasonal mood using deep crimson and champagne gold color palettes, accented by subtle ambient glitter bokeh particles suspended in the air.',
                image: '/images/guidance/tpl_3/step-2.svg',
                tip: 'Champagne gold reflects warm ambient tones without appearing tacky or oversaturated.',
                text: 'Set deep crimson and champagne gold tones with suspended bokeh particles.'
              },
              {
                step: 3,
                title: 'Configure 3200K Tungsten Rim Lighting',
                description: 'Request warm 3200K tungsten backlighting to create a crisp amber rim outline around your product silhouette, paired with soft frontal fill to preserve label legibility.',
                image: '/images/guidance/tpl_3/step-3.svg',
                tip: 'Backlit rim separation ensures dark luxury packaging stands out against rich dark holiday backgrounds.',
                text: 'Apply 3200K warm tungsten backlighting for a glowing product silhouette.'
              },
              {
                step: 4,
                title: 'Insert Luxury Packaging & Details',
                description: 'Replace "luxury product" with your product subject, specifying tactile materials such as frosted glass, embossed gold foil, or satin ribbon.',
                image: '/images/guidance/tpl_3/step-4.svg',
                tip: 'Tangible texture descriptions (e.g. "frosted matte glass with embossed gold foil") produce far higher fidelity.',
                text: 'Customize the prompt with your specific packaging and luxury materials.'
              },
              {
                step: 5,
                title: 'Refine Bokeh & Export Retina Master',
                description: 'Generate the banner and upscale the variant with the smoothest lens flares and cleanest product typography. Export in 4K resolution (3840 x 2160).',
                image: '/images/guidance/tpl_3/step-5.svg',
                tip: 'Use Midjourney Vary (Region) inpainting if you want to clear particles away from the product label.',
                actionText: 'Export 4K Banner',
                text: 'Select the cleanest bokeh take and export in high-resolution 4K.'
              }
            ]
          },
          {
            id: 'tpl_4',
            name: 'Flat lay composition',
            title: 'Flat lay composition',
            subtitle: 'Knolling tabletop arrangement',
            category: 'Social & Editorial',
            description: 'A top-down view of your product arranged neatly with complementary props.',
            produces: 'Overhead 90-degree knolling arrangement with balanced negative space and coordinated styling accessories.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/tpl_4.jpg',
              primaryImage: '/images/templates/tpl_4.jpg',
              gallery: ['/images/templates/tpl_4.jpg', '/images/templates/tpl_4_wide.jpg']
            },
            tags: ['Flat Lay', 'Top-down', 'Instagram'],
            difficulty: 'Medium',
            models: ['DALL-E 3', 'Midjourney v6'],
            uiPrompt: "[UI & OPTICS PROMPT]\nCamera & Perspective: Phase One XF 100MP, Schneider Kreuznach 80mm LS f/2.8 at f/10 for corner-to-corner clarity, zero barrel distortion, ISO 50. Perfectly level 90-degree overhead bird's-eye perspective (orthogonal knolling).\nSurface & Colors: Matte light-grey concrete surface (#E5E7EB), muted slate, rich cognac leather, warm brass accents, and neutral white linen.\nLighting Architecture: Large overhead diffused softbox creating gentle, natural directional cast shadows downward without harsh specular hotspots.\nParameters: --ar 4:3 --v 6.0 --style raw --q 2",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject & Items: Premium everyday carry essentials: full-grain cognac leather notebook, matte black brass rollerball pen, minimalist stainless steel mechanical timepiece with leather strap, raw linen textile swatch, and artisanal ceramic espresso cup.\nComposition & Purpose: Geometric knolling layout with intentional 25mm negative spacing between objects for editorial lookbooks, design blogs, and lifestyle brand storytelling.\nAudience & Tone: Creative professionals, architects, and industrial design enthusiasts valuing precision craftsmanship, curated utility, and organized calm.",
            basePrompt: `High-end commercial overhead flat-lay knolling photograph of an artisanal accessory centered on a matte concrete tabletop. Carefully arranged with minimal tonal props: an open textured linen notebook, brass mechanical pencil, and ceramic espresso cup.

Lighting: Overhead diffused softbox lighting eliminating harsh directional glare, balanced 360-degree soft contact shadows.

Camera & Optics: Canon EOS R5 with 35mm f/2.8 macro lens positioned perpendicular at a strict 90-degree top-down zenith angle. Tack-sharp edge-to-edge focal plane, hyper-detailed surface macro-textures.

Parameters: --ar 1:1 --v 6.0 --q 2`,
            charCount: 618,
            previewAccent: 'from-rose-500/20 via-teal-500/10 to-transparent',
            tools: [toolsDB.dalle3, toolsDB.midjourney],
            guidance: [
              {
                step: 1,
                title: 'Lock 90° Perpendicular Zenith Angle',
                description: 'Launch ChatGPT (DALL-E 3) or FLUX.1 Pro and set a strict top-down zenith camera angle looking straight down onto the table surface.',
                image: '/images/guidance/tpl_4/step-1.svg',
                tip: 'Specifying "perpendicular at a strict 90-degree zenith top-down angle" prevents tilted camera perspectives.',
                actionText: 'Open FLUX.1 Pro',
                actionUrl: 'https://blackforestlabs.ai',
                text: 'Establish a strict 90-degree perpendicular overhead zenith camera angle.'
              },
              {
                step: 2,
                title: 'Curate Matte Concrete & Styling Props',
                description: 'Arrange minimal, tonally harmonious props on a matte concrete tabletop: an open textured linen notebook, brass mechanical pencil, and ceramic espresso cup.',
                image: '/images/guidance/tpl_4/step-2.svg',
                tip: 'Limit accessory props to 2-3 items to keep the visual hierarchy centered on your primary product.',
                text: 'Arrange notebook, brass pencil, and ceramic cup in geometric harmony.'
              },
              {
                step: 3,
                title: 'Diffuse Overhead Softbox Lighting',
                description: 'Configure large overhead diffusion scrims to eradicate harsh directional shadows and generate soft 360-degree contact shadows beneath every item.',
                image: '/images/guidance/tpl_4/step-3.svg',
                tip: 'Balanced 360° contact shadows ground objects flatly on the table without distracting shadows.',
                text: 'Set overhead diffused lighting for soft 360-degree contact shadows.'
              },
              {
                step: 4,
                title: 'Replace Artisanal Accessory Subject',
                description: 'Swap out "artisanal accessory" with your hero item (e.g. full-grain leather wallet, luxury watch, or sunglasses) and execute with --ar 1:1 --v 6.0.',
                image: '/images/guidance/tpl_4/step-4.svg',
                tip: 'Ensure your hero item is positioned in the optical center of the knolling layout.',
                text: 'Replace placeholder with your hero item and retain 1:1 square ratio.'
              },
              {
                step: 5,
                title: 'Verify Parallel Alignment & Export',
                description: 'Inspect the generated knolling composition to verify that lines are parallel and margins are balanced, then download the full-resolution master.',
                image: '/images/guidance/tpl_4/step-5.svg',
                tip: 'If props appear slightly cluttered, re-run with fewer accessory items for a cleaner minimalist feel.',
                actionText: 'Download Square Master',
                text: 'Check geometric alignment and download the high-resolution square asset.'
              }
            ]
          },
          {
            id: 'tpl_img_aquatic',
            name: 'Aquatic Luxury Fragrance',
            title: 'Aquatic Luxury Fragrance',
            subtitle: 'High-speed marine water splash and glass refraction',
            category: 'Advertising & Campaigns',
            description: 'A dramatic commercial advertising photograph of a luxury azure glass fragrance bottle with explosive high-speed ocean water splash ripples, suspended droplets, and crisp volumetric rim lighting.',
            produces: 'High-speed commercial advertising visual with crystal-clear fluid crown dynamics and pristine refraction optics.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/spray.jpg',
              primaryImage: '/images/templates/spray.jpg',
              gallery: ['/images/templates/spray.jpg']
            },
            tags: ['Fragrance', 'Water Splash', 'High-Speed', 'Luxury', 'Commercial'],
            difficulty: 'Medium',
            models: ['Midjourney v6', 'FLUX.1 Pro'],
            uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: Hasselblad H6D-100c with HC 120mm II Macro lens, shot at f/8 for tack-sharp focus across both glass bottle facets and airborne water droplets, ISO 64, ultra-fast 1/8000s flash sync speed to freeze water droplets in mid-air with zero motion blur.
Lighting Architecture: Dual Broncolor high-speed flash strobes positioned at 45-degree angles camera left and right, paired with a blue gelled background backlight (4800K) illuminating crystalline water crown ripples and creating glowing sapphire rim contours.
Color Science: Marine azure (#0284C7), deep ocean navy (#0F172A), pristine foam white, and subtle platinum highlights on bottle cap.
Parameters: --ar 3:4 --v 6.0 --style raw --q 2`,
            contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Sleek geometric translucent marine-blue eau de parfum glass flacon with brushed titanium atomizer, submerged in shallow crystal water on a wet slate pedestal as a dynamic cresting ocean wave erupts around it.
Commercial Purpose: High-impact hero advertising campaign visual for summer fragrance launches, billboard key visuals, and luxury department store displays.
Audience & Tone: Luxury perfume aficionados and modern consumers seeking freshness, sensory elevation, and oceanic vitality. Clean, exhilarating, and uncompromisingly premium.`,
            basePrompt: `Commercial advertising photograph of an azure glass luxury perfume bottle centered amidst a dramatic high-speed water splash. Crystal clear water crown erupts around the base with micro-droplets frozen in mid-air.

Lighting: High-speed studio flash strobes with dramatic rim backlighting illuminating water transparency and multifaceted glass refractions.

Camera & Optics: Shot on Hasselblad H6D-100c, 120mm macro lens at f/8, 1/8000s shutter speed, ISO 64. Pin-sharp focus on the embossed metallic label and suspended water beads.

Parameters: --ar 3:4 --v 6.0 --style raw --q 2`,
            charCount: 620,
            previewAccent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
            tools: [toolsDB.midjourney, toolsDB.flux],
            guidance: ALL_GUIDANCE_CATALOG.tpl_img_aquatic || []
          },
          {
            id: 'tpl_img_couture',
            name: 'Editorial Luxury Leather Tote',
            title: 'Editorial Luxury Leather Tote',
            subtitle: 'Architectural studio lighting with warm leather grain',
            category: 'Social & Editorial',
            description: 'A refined editorial studio photograph of a bespoke full-grain caramel leather designer tote bag resting on a raw travertine stone slab, illuminated by warm raking window sunlight.',
            produces: 'High-end editorial fashion photography with tactile leather micro-texture fidelity and natural shadow gradation.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/bag2.jpg',
              primaryImage: '/images/templates/bag2.jpg',
              gallery: ['/images/templates/bag2.jpg']
            },
            tags: ['Fashion', 'Leather Goods', 'Editorial', 'Luxury', 'Accessories'],
            difficulty: 'Easy',
            models: ['Midjourney v6', 'FLUX.1 Pro'],
            uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: Phase One IQ4 150MP with Schneider Kreuznach 80mm LS f/2.8 lens stopped down to f/7.1 for exquisite surface micro-detail, ISO 50, tripod-mounted.
Lighting Architecture: Directional raking sunlight (3600K) through a tall industrial loft window camera right, creating long soft diagonal shadows; large white foam-core reflector camera left for 3:1 shadow fill.
Color Palette: Rich cognac leather (#9A3412), warm travertine cream (#F5F5F0), and neutral limestone grey.
Parameters: --ar 3:4 --v 6.0 --style raw`,
            contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Handcrafted full-grain calfskin leather tote bag in warm cognac brown with hand-stitched saddle seams and polished brass hardware, displayed upright on a monolithic honed travertine plinth.
Commercial Purpose: Luxury fashion lookbook, editorial e-commerce hero asset, and seasonal print campaign for high-end artisanal leather houses.
Audience & Tone: Discerning luxury buyers, bespoke accessories connoisseurs, and architectural fashion collectors valuing generational craftsmanship.`,
            basePrompt: `High-end editorial studio still of a luxury handcrafted full-grain caramel leather tote bag standing upright on a raw travertine stone block. Soft raking morning sunlight entering from camera right, revealing genuine leather grain texture, precise tonal saddle stitching, and polished brass hardware clasps.

Environment: Minimalist architectural gallery setting with subtle plaster wall texture in soft defocus.

Camera & Optics: Phase One IQ4 150MP, 80mm lens at f/7.1, ISO 50. True-to-life color fidelity and subtle natural contact shadows.

Parameters: --ar 3:4 --v 6.0 --style raw`,
            charCount: 590,
            previewAccent: 'from-amber-600/20 via-orange-500/10 to-transparent',
            tools: [toolsDB.midjourney, toolsDB.flux],
            guidance: ALL_GUIDANCE_CATALOG.tpl_img_couture || []
          },
          {
            id: 'tpl_img_museum',
            name: 'Haute Couture Architectural Silhouette',
            title: 'Haute Couture Architectural Silhouette',
            subtitle: 'High-fashion editorial drapery against brutalist limestone',
            category: 'Social & Editorial',
            description: 'An avant-garde high-fashion editorial portrait showcasing sculptural silk organza couture drapery set against monumental brutalist limestone architecture.',
            produces: 'Museum-grade avant-garde fashion editorial photography with sculptural composition and dramatic tonal chiaroscuro.',
            mainCategory: 'Image',
            media: {
              thumbnail: '/images/templates/dress3.jpg',
              primaryImage: '/images/templates/dress3.jpg',
              gallery: ['/images/templates/dress3.jpg']
            },
            tags: ['Haute Couture', 'Editorial', 'Architecture', 'High Fashion', 'Vogue'],
            difficulty: 'Hard',
            models: ['Midjourney v6', 'Adobe Firefly'],
            uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: Leica S3 medium format with Summarit-S 70mm f/2.5 ASPH at f/4.0 for sharp garment geometry with gentle spatial rolloff, ISO 100, 1/500s shutter speed.
Lighting Architecture: Natural high-noon Mediterranean direct sun softened by a 20-foot overhead silk scrim, sculpting dramatic chiaroscuro drapery shadows along the garment folds without blowing out fabric highlights.
Color Palette: Alabaster silk (#F8FAFC), warm Portuguese limestone (#E2E8F0), and subtle charcoal shadows.
Parameters: --ar 3:4 --v 6.0 --style raw --q 2`,
            contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Avant-garde haute couture evening gown featuring billowing architectural pleats and pleated silk organza wings, modeled in a poised statuesque posture at the sunlit colonnade of a contemporary brutalist art pavilion.
Commercial Purpose: Cover-worthy editorial spread for international fashion publications (Vogue, Harper's Bazaar, Dazed) and Paris Fashion Week digital lookbooks.
Audience & Tone: Haute couture collectors, fashion designers, and visual art directors looking for dramatic silhouettes, emotional grandeur, and spatial harmony.`,
            basePrompt: `Avant-garde haute couture fashion editorial photograph of a sculptural silk evening gown featuring billowing architectural pleating. The model stands poised within a monumental brutalist limestone colonnade with dramatic angular shadows.

Lighting: Strong directional sunbeams cutting between concrete pillars, creating high-contrast graphic shadow lines across the flowing alabaster fabric.

Camera & Optics: Shot on Leica S3, Summarit-S 70mm lens at f/4.0, ISO 100. Editorial Vogue aesthetic, rich tonal gradation, tack-sharp textile weave.

Parameters: --ar 3:4 --v 6.0 --style raw --q 2`,
            charCount: 610,
            previewAccent: 'from-purple-500/20 via-rose-500/10 to-transparent',
            tools: [toolsDB.midjourney, toolsDB.firefly],
            guidance: ALL_GUIDANCE_CATALOG.tpl_img_museum || []
          }
        ]
      }
    ]
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Generative video prompts for cinematic motion and product demos.',
    subcategories: [
      {
        id: 'product-demo-videos',
        name: 'Product Demo Videos',
        description: 'Smooth camera movements and transitions for product showcases.',
        templates: [
          {
            id: 'tpl_video_1',
            name: 'Dynamic 360 Spin',
            title: 'Dynamic 360 Spin',
            subtitle: 'Smooth orbiting camera showcase',
            category: 'Product Demo Videos',
            description: 'A slow, elegant 360-degree camera pan around a stationary product.',
            produces: '4-second video loop of a seamless 360-degree camera orbit.',
            mainCategory: 'Video',
            media: {
              thumbnail: '/images/templates/tpl_video_1.jpg',
              poster: '/images/templates/tpl_video_1.jpg',
              videoUrl: '/videos/product_bottle_spin.mp4',
              gallery: ['/images/templates/tpl_video_1.jpg']
            },
            tags: ['Video', 'Orbit', 'Demo'],
            difficulty: 'Medium',
            models: ['Runway Gen-2'],
            uiPrompt: "[UI & MOTION PROMPT]\nCamera Movement & Trajectory: Static level eye-line camera with subtle continuous optical zoom (+1.1x magnification) locked onto the golden cap. Horizontal circular pedestal orbital rotation at constant 90 deg/sec angular velocity with zero wobble.\nTiming & Frame Rate: 4.0 seconds duration, seamless loop point at frame 96 (24fps cadence).\nVisual Style: High-end luxury television advertisement, sharp metallic reflections, anamorphic glint flares on bottle facets, polished black marble turntable surface.\nAspect Ratio: 16:9 widescreen (1920x1080).",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject: Premium geometric perfume flacon with embossed metallic branding and multifaceted crystal glass body.\nCommercial Intent: Seamless product video loop for high-converting e-commerce PDP hero sections, digital billboards, and luxury retail displays.\nAudience & Tone: Discerning luxury fragrance buyers seeking elegance, sensory sophistication, and exquisite industrial design.\nEnding Criteria: Completes exact 360-degree rotation, aligning seamlessly back to frame 1 for an imperceptible infinite loop.",
            basePrompt: `Cinematic 360-degree slow pan around a modern geometric perfume bottle resting on a black marble pedestal. The camera moves smoothly in a continuous orbit.

Lighting: Dramatic studio lighting with a soft rim light tracking the bottle's edges.
Camera: Slow, stabilized motion, cinematic depth of field, 4k resolution, 24fps.

Parameters: --camera orbit_left`,
            charCount: 300,
            previewAccent: 'from-blue-500/20 via-indigo-500/10 to-transparent',
            tools: [toolsDB.runway],
            guidance: [
              {
                step: 1,
                title: 'Open Runway Gen-2 Video Studio',
                description: 'Go to runwayml.com, sign into your dashboard, and open Gen-2 (Text/Image to Video). Gen-2 is the premier engine for controlled 3D camera orbits.',
                image: '/images/guidance/tpl_video_1/step-1.svg',
                tip: 'Using Image + Description mode gives vastly higher consistency than text-only generation.',
                actionText: 'Open Runway Gen-2',
                actionUrl: 'https://runwayml.com',
                text: 'Open Runway Gen-2 and select Image + Description generation mode.'
              },
              {
                step: 2,
                title: 'Upload High-Res Product Reference Still',
                description: 'Click the "Image" tab above the prompt box and upload a clean studio still of your product centered on a pedestal or sweep.',
                image: '/images/guidance/tpl_video_1/step-2.svg',
                tip: 'Providing an initial reference image locks your exact branding, labels, and geometry.',
                text: 'Upload a clean studio photograph of your product to lock geometry.'
              },
              {
                step: 3,
                title: 'Configure Orbit Left Camera Motion',
                description: 'Click the "Camera Motion" button below the prompt box. Adjust the "Pan" slider slightly to the left (around -2.5) to create a slow, elegant 360° orbiting sweep.',
                image: '/images/guidance/tpl_video_1/step-3.svg',
                tip: 'Keep pan speed moderate (-2.0 to -3.0) to prevent motion blur and object warping.',
                text: 'Set Camera Pan slider to -2.5 for a smooth, continuous orbiting motion.'
              },
              {
                step: 4,
                title: 'Paste Video Prompt & Lighting Details',
                description: 'Paste the AWA prompt specifying slow camera orbit around the pedestal, tracking rim lighting, and 24fps motion fidelity. Append --camera orbit_left.',
                image: '/images/guidance/tpl_video_1/step-4.svg',
                tip: 'Describing tracking rim lighting helps Runway maintain consistent specular highlights as the camera revolves.',
                text: 'Enter the motion prompt describing camera orbit and tracking rim lights.'
              },
              {
                step: 5,
                title: 'Render 4-Second Timeline Video',
                description: 'Click "Generate 4s". Runway will compute 24 frames per second across the 4-second sequence while displaying a real-time progress bar.',
                image: '/images/guidance/tpl_video_1/step-5.svg',
                tip: 'Review the 2-second midpoint keyframe to verify the rear of your product maintains realistic geometry.',
                text: 'Click Generate 4s and watch Runway render smooth 24fps video vectors.'
              },
              {
                step: 6,
                title: 'Export 4K MP4 Seamless Loop',
                description: 'Hover over the rendered video and download the high-bitrate MP4 file. The 360 orbit loops seamlessly on Shopify product pages and social video ads.',
                image: '/images/guidance/tpl_video_1/step-6.svg',
                tip: 'You can extend generation by an additional +4s in Runway if you require a slower, full 8-second rotation.',
                actionText: 'Download MP4 Loop',
                text: 'Download high-bitrate MP4 video ready for looping Shopify embeds.'
              }
            ]
          },
          {
            id: 'tpl_video_2',
            name: 'Macro Fluid Splash',
            title: 'Macro Fluid Splash',
            subtitle: 'High-speed beverage or cosmetics ad',
            category: 'Product Demo Videos',
            description: 'A slow-motion macro shot of liquid splashing elegantly.',
            produces: 'High-speed phantom camera style fluid physics.',
            mainCategory: 'Video',
            media: {
              thumbnail: '/images/templates/tpl_video_2.jpg',
              poster: '/images/templates/tpl_video_2.jpg',
              videoUrl: '/videos/macro_fluid_splash.webm',
              gallery: ['/images/templates/tpl_video_2.jpg']
            },
            tags: ['Video', 'Macro', 'Slow Motion'],
            difficulty: 'Hard',
            models: ['Pika Labs'],
            uiPrompt: "[UI & MOTION PROMPT]\nCamera & Time Dilation: Micro slow-motion dolly forward (-camera zoom in 1.2), tack-sharp focus locked on water droplets. 3.5 seconds duration, ultra-slow 1000fps time-dilation aesthetic rendered at 24fps playback.\nVisual Physics: Pristine crystalline liquid physics, suspended micro-droplets with surface tension, backlit golden morning sunbeams refracting through droplets.\nAspect Ratio: 16:9 widescreen (1920x1080).",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject: Crystal-clear hydrating cosmetics skincare vial resting on a submerged smooth river stone in a shallow pure water basin.\nCommercial Narrative: Illustrates deep hydration, purity, and organic bio-actives for a breakthrough skincare product launch.\nAudience & Tone: Clean beauty enthusiasts, dermatological skincare consumers, and wellness shoppers looking for refreshing, pristine efficacy.\nEnding State: Droplets settle into calm surface ripples, leaving cosmetics flacon pristine with no water spots on label.",
            basePrompt: `Extreme macro slow motion video of crystal clear water splashing over a smooth river stone. Tiny droplets suspended in mid-air.

Lighting: Bright commercial studio lighting, backlit to highlight the fluid transparency.
Camera: High-speed phantom flex camera style, 1000fps look, tack sharp focus on the central splash.

Parameters: -motion 3`,
            charCount: 350,
            previewAccent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
            tools: [toolsDB.pika],
            guidance: [
              {
                step: 1,
                title: 'Launch Pika Labs Generation Console',
                description: 'Open pika.art in your browser or launch the Pika Discord bot. Pika is renowned for realistic liquid viscosity and suspended droplet physics.',
                image: '/images/guidance/tpl_video_2/step-1.svg',
                tip: 'Pika 1.0 features specialized fluid simulation algorithms that prevent water from turning into mist.',
                actionText: 'Open Pika Labs',
                actionUrl: 'https://pika.art',
                text: 'Open Pika Labs generation console and select fluid dynamics mode.'
              },
              {
                step: 2,
                title: 'Configure Backlit Fluid Transparency',
                description: 'Prompt extreme macro slow-motion water splashing over a river stone or product base, requesting bright commercial backlighting to make droplets glisten.',
                image: '/images/guidance/tpl_video_2/step-2.svg',
                tip: 'Backlighting is crucial for liquids — it highlights internal refraction and transparency.',
                text: 'Set backlit studio lighting to highlight crystal water droplet transparency.'
              },
              {
                step: 3,
                title: 'Set Motion Intensity Parameter (-motion 3)',
                description: 'Append the parameter -motion 3 at the end of your prompt. This dials in moderate liquid velocity without explosive or chaotic splashing.',
                image: '/images/guidance/tpl_video_2/step-3.svg',
                tip: 'Motion values above 4 can cause liquid artifacts; motion 3 produces elegant slow-motion arcs.',
                text: 'Lock the -motion 3 parameter for balanced fluid speed and viscosity.'
              },
              {
                step: 4,
                title: 'Customize Fluid Type & Product',
                description: 'Swap "river stone" with your product (e.g. skincare serum bottle or beverage can) and specify liquid type (pure water, milk splash, or champagne).',
                image: '/images/guidance/tpl_video_2/step-4.svg',
                tip: 'Generate 2-3 variations simultaneously to capture the most aesthetically pleasing droplet crest.',
                text: 'Customize prompt with your product and desired liquid splash type.'
              },
              {
                step: 5,
                title: 'Scrub & Export Peak Splash Moment',
                description: 'Review the generated clips, choose the take with the sharpest droplet clarity and cleanest lighting glints, and download the 1080p MP4 clip.',
                image: '/images/guidance/tpl_video_2/step-5.svg',
                tip: 'You can extract high-res still frames from the peak splash moment for matching print advertising banners.',
                actionText: 'Download Video',
                text: 'Select the take with best droplet crest and download 1080p MP4 video.'
              }
            ]
          },
          {
            id: 'tpl_video_3',
            name: 'Cinematic Reveal',
            title: 'Cinematic Reveal',
            subtitle: 'Dark to light lighting transition',
            category: 'Social Media Clips',
            description: 'A dramatic lighting reveal for a new product announcement.',
            produces: 'A video where lights slowly fade in to reveal the product.',
            mainCategory: 'Video',
            media: {
              thumbnail: '/images/templates/tpl_video_3.jpg',
              poster: '/images/templates/tpl_video_3.jpg',
              videoUrl: '/videos/cinematic_reveal.mp4',
              gallery: ['/images/templates/tpl_video_3.jpg']
            },
            tags: ['Video', 'Reveal', 'Lighting'],
            difficulty: 'Easy',
            models: ['Runway Gen-2'],
            uiPrompt: "[UI & MOTION PROMPT]\nCamera Movement & Optics: Slow vertical tilt-up (Tilt Up +2.0) combined with smooth optical rack focus shifting from misty foreground foliage to illuminated gold-embossed brand label.\nVisual Style: Moody cinematic film stock, anamorphic streak flare, soft morning crepuscular light beams cutting through greenhouse mist.\nTiming & Cadence: 5.0 seconds duration, dramatic build-up cadence at 24fps.\nAspect Ratio: 9:16 vertical full-screen smartphone format (1080x1920).",
            contextPrompt: "[CONTEXT & SUBJECT PROMPT]\nSubject & Setting: Artisanal organic botanical skincare elixir with amber liquid inside a frosted dropper bottle, situated in a misty, lush greenhouse surrounded by monstera foliage.\nCampaign Goal: Vertical mobile video hook for TikTok, Instagram Reels, and YouTube Shorts to build anticipation ahead of a seasonal product drop.\nAudience & Tone: Eco-luxury consumers and wellness enthusiasts captivated by botanical ingredients, sensory tranquility, and artisanal craftsmanship.",
            basePrompt: `A sleek sports car sitting in complete darkness. A single overhead light tube flickers on, slowly revealing the glossy metallic paint. The camera slowly pushes in.

Lighting: Transition from pitch black to dramatic high-contrast overhead strip lighting.
Camera: Slow push in, tracking forward, cinematic framing.

Parameters: --camera zoom_in`,
            charCount: 340,
            previewAccent: 'from-zinc-500/20 via-neutral-500/10 to-transparent',
            tools: [toolsDB.runway],
            guidance: [
              {
                step: 1,
                title: 'Open Runway Gen-2 Video Studio',
                description: 'Go to runwayml.com, access Gen-2, and prepare a Text-to-Video generation canvas designed for dynamic studio lighting transitions.',
                image: '/images/guidance/tpl_video_3/step-1.svg',
                tip: 'Text-to-Video gives Runway full freedom to build the dramatic pitch-black starting environment.',
                actionText: 'Open Runway Gen-2',
                actionUrl: 'https://runwayml.com',
                text: 'Open Runway Gen-2 and prepare dynamic lighting transition canvas.'
              },
              {
                step: 2,
                title: 'Define Dark-to-Light Transition Sequence',
                description: 'Describe the dramatic sequence: starting in complete pitch darkness, a single overhead fluorescent tube flickers on, slowly revealing glossy contours.',
                image: '/images/guidance/tpl_video_3/step-2.svg',
                tip: 'Describing the light as "flickering on" triggers realistic electrical warmup and specular glints.',
                text: 'Specify pitch-black opening with overhead strip light flickering on.'
              },
              {
                step: 3,
                title: 'Configure Slow Push-In Camera Motion',
                description: 'Open Camera Motion settings and adjust the Zoom slider to positive +2.0 (Slow Push In) while locking Tilt and Pan at 0 for stabilized forward movement.',
                image: '/images/guidance/tpl_video_3/step-3.svg',
                tip: 'A steady forward push-in builds dramatic suspense for product unveilings and teasers.',
                text: 'Set Camera Zoom to +2.0 for a slow, cinematic forward push-in.'
              },
              {
                step: 4,
                title: 'Customize Product Subject & Parameters',
                description: 'Replace "sports car" with your flagship hardware or luxury product, and verify parameter --camera zoom_in is attached to the prompt.',
                image: '/images/guidance/tpl_video_3/step-4.svg',
                tip: 'High-contrast metallic or glass surfaces reflect overhead strip lighting with greatest drama.',
                text: 'Insert your product subject and verify the --camera zoom_in flag.'
              },
              {
                step: 5,
                title: 'Review Black Levels & Export Teaser MP4',
                description: 'Render the 4-second clip, inspect the deep shadows to ensure no pixel banding in the blacks, and export the cinematic reveal video.',
                image: '/images/guidance/tpl_video_3/step-5.svg',
                tip: 'Ideal for keynote presentations, product launch countdowns, and viral social teasers.',
                actionText: 'Export Teaser Video',
                text: 'Inspect contrast levels and download finished cinematic reveal MP4.'
              }
            ]
          },
          {
            id: 'tpl_video_reel',
            name: 'Dynamic Social Launch Reel',
            title: 'Dynamic Social Launch Reel',
            subtitle: 'Vertical 4:5 / 9:16 mobile-first product video clip',
            category: 'Social Media Clips',
            description: 'A fast-paced, high-energy vertical product launch reel with rhythmic camera zooms, kinetic graphic overlays, and neon ambient rim glow tailored for TikTok and Instagram Reels.',
            produces: 'High-conversion 5-second vertical video reel with kinetic momentum and viral social media retention.',
            mainCategory: 'Video',
            media: {
              thumbnail: '/images/templates/tpl_social_launch.svg',
              poster: '/images/templates/tpl_social_launch.svg',
              videoUrl: '/videos/social_reel_motion.mp4',
              gallery: ['/images/templates/tpl_social_launch.svg']
            },
            tags: ['Reels', 'TikTok', 'Vertical Video', 'Launch', 'Motion', 'Social'],
            difficulty: 'Medium',
            models: ['Runway Gen-2', 'Pika Labs'],
            uiPrompt: `[UI & MOTION PROMPT]
Camera Movement & Optics: Rapid snap-zoom in (+2.5x) followed by continuous dynamic Dutch angle tilt (+15 degrees). High-octane kinetic cadence synced to a 128 BPM electronic trap rhythm.
Visual Dynamics: Neon magenta (#D946EF) and electric cyan (#06B6D4) laser rim outlines tracing the product silhouette against dark carbon fiber studio walls; subtle motion blur streaks on quick whip-pans.
Aspect Ratio: 9:16 vertical mobile format (1080x1920) or 4:5 vertical feed format.
Duration: 5.0 seconds at 30fps.`,
            contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Next-generation wireless noise-canceling headphones with forged carbon earcups and pulsating LED status ring, floating weightlessly before rapidly snapping toward the camera.
Commercial Intent: Viral organic TikTok and Instagram Reels drop video engineered for 3-second hook rate (>70%) and immediate click-through to product checkout.
Audience & Tone: Gen Z and Millennial tech enthusiasts, street fashion fans, and audiophiles seeking high energy, bold cyber aesthetics, and instant hype.`,
            basePrompt: `High-energy vertical product launch video reel for a futuristic tech accessory. Camera performs an explosive snap zoom into the product, accompanied by rhythmic neon rim pulses and kinetic rotational momentum.

Lighting: Dark cyberpunk studio with pulsating electric violet and cyan neon edge lights tracing metallic bevels.
Camera & Motion: Fast whip-pan transitions, dynamic Dutch angle, 9:16 vertical mobile aspect ratio, 30fps cinematic fluidity.

Parameters: --camera zoom_in_fast --motion 4`,
            charCount: 480,
            previewAccent: 'from-fuchsia-500/20 via-indigo-500/10 to-transparent',
            tools: [toolsDB.runway, toolsDB.pika],
            guidance: ALL_GUIDANCE_CATALOG.tpl_video_reel || []
          },
          {
            id: 'tpl_video_jellyfish',
            name: 'Deep Sea Bioluminescence Loop',
            title: 'Deep Sea Bioluminescence Loop',
            subtitle: 'Slow-motion macro fluid & ethereal marine life motion',
            category: 'Product Demo Videos',
            description: 'A hypnotic, meditative slow-motion generative motion loop of translucent bioluminescent deep-sea jellyfish pulsing gently through midnight abyss waters with chromatic filament trails.',
            produces: 'Seamless 4-second ambient video loop with ethereal micro-physics and tranquil organic rhythm.',
            mainCategory: 'Video',
            media: {
              thumbnail: '/images/templates/tpl_video_4_poster.svg',
              poster: '/images/templates/tpl_video_4_poster.svg',
              videoUrl: '/videos/sample_jellyfish.mp4',
              gallery: ['/images/templates/tpl_video_4_poster.svg']
            },
            tags: ['Video', 'Bioluminescence', 'Ambient', 'Slow Motion', 'Loop'],
            difficulty: 'Hard',
            models: ['Runway Gen-2'],
            uiPrompt: `[UI & MOTION PROMPT]
Camera Movement: Slow stabilized vertical tracking shot rising alongside pulsating tentacles with subtle rotational drift (yaw +0.8).
Physics & Timing: Ethereal fluid dynamics with rhythmic hydrostatic bell contraction every 2.0 seconds; trailing glowing micro-filaments reacting smoothly to water viscosity.
Atmosphere & Lighting: Deep midnight abyss (#030712) with internal bioluminescent cyan (#2DD4BF) and ultraviolet (#818CF8) organ glow casting delicate caustic ripples through suspended marine snow particles.
Aspect Ratio: 16:9 widescreen (1920x1080).`,
            contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Translucent pelagic jellyfish with delicate crystalline umbrella and flowing luminescent oral arms pulsing serenely in deep ocean pelagic waters.
Commercial Purpose: Mesmerizing ambient video background for wellness brand websites, digital art installations, luxury spa video walls, and calming sleep app visuals.
Audience & Tone: Meditative viewers, ocean lovers, and premium brand visual directors looking for tranquility, organic beauty, and hypnotic natural rhythms.`,
            basePrompt: `Cinematic slow-motion ambient loop of a translucent deep-sea jellyfish pulsing serenely through dark ocean waters. Ethereal bioluminescent blue and cyan glow radiating from within its bell, illuminating delicate trailing tentacles and floating ambient marine snow.

Lighting: Volumetric internal glow with soft light refractions through crystalline organic tissues.
Camera: Slow upward tracking camera, shallow depth of field, 24fps fluid motion fidelity.

Parameters: --camera track_up --motion 2`,
            charCount: 460,
            previewAccent: 'from-teal-500/20 via-cyan-500/10 to-transparent',
            tools: [toolsDB.runway],
            guidance: ALL_GUIDANCE_CATALOG.tpl_video_jellyfish || []
          }
        ]
      }
    ]
  },
  {
    id: 'slides',
    name: 'Slides',
    description: 'Rapid presentation and pitch deck generation.',
    subcategories: [
      {
        id: 'pitch-decks',
        name: 'Pitch Decks',
        description: 'Clean, persuasive slides for startups and agencies.',
        templates: [
          {
            id: 'tpl_slide_1',
            name: 'Seed Pitch Deck',
            title: 'Seed Pitch Deck',
            subtitle: 'Minimalist tech startup presentation',
            category: 'Pitch Decks',
            description: 'A 10-slide outline for a seed-stage SaaS startup.',
            produces: 'A complete Gamma presentation draft with headers and layouts.',
            mainCategory: 'Slides',
            media: {
              thumbnail: '/images/templates/tpl_slide_1.jpg',
              slides: ['/images/templates/tpl_slide_1.jpg']
            },
            tags: ['Slides', 'Pitch', 'Startup'],
            difficulty: 'Easy',
            models: ['Gamma'],
            uiPrompt: "[UI & PRESENTATION PROMPT]\nLayout & Architecture: 10-slide responsive presentation deck built on Gamma App. Card-based layout with clean metric callout chips and split-screen diagrams.\nVisual Style: Modern institutional dark theme, deep sapphire blue (#1D4ED8) accents on slate (#0F172A), typography in Inter & Plus Jakarta Sans, high-contrast numerical highlights ($1.2M ARR, 142% NRR).\nAspect Ratio: 16:9 widescreen presentation mode.",
            contextPrompt: "[CONTEXT & NARRATIVE PROMPT]\nTopic & Company: Seed Capital Investment Pitch Deck for 'Vektor AI' — an enterprise agentic creative workflow automation platform.\nAudience: Early-stage venture capital partners and angel syndicates investing in enterprise AI infrastructure.\nKey Narrative & Ask: Secure a $3.5M Seed round by presenting market timing ($42B TAM by 2028), multi-modal routing architecture, 85% gross margins, and founder credentials from DeepMind and Stripe.\nContent Structure: 1. Title/Value Prop, 2. Problem Sprawl, 3. Unified Solution, 4. Architecture, 5. Market TAM, 6. Unit Economics, 7. Traction Proof, 8. Moat, 9. Founding Team, 10. The Ask ($3.5M).",
            basePrompt: `Create a 10-slide seed pitch deck for a B2B SaaS company that automates HR workflows.
The tone should be professional, data-driven, and minimalist.
Include these sections: Title, Problem, Solution, Market Size, Business Model, Go-To-Market, Traction, Team, Financial Projections, and The Ask.
Theme: Dark mode with neon blue accents.`,
            charCount: 350,
            previewAccent: 'from-purple-500/20 via-indigo-500/10 to-transparent',
            tools: [toolsDB.gamma],
            guidance: [
              {
                step: 1,
                title: 'Launch Gamma Presentation Generator',
                description: 'Navigate to gamma.app in your browser, click "Create New" in your dashboard, and select "Generate" → "Presentation".',
                image: '/images/guidance/tpl_slide_1/step-1.svg',
                tip: 'Gamma structures presentations as responsive, interactive cards rather than rigid legacy slides.',
                actionText: 'Open Gamma App',
                actionUrl: 'https://gamma.app',
                text: 'Open Gamma and select AI Presentation generation mode.'
              },
              {
                step: 2,
                title: 'Input 10-Slide Pitch Deck Structure',
                description: 'Paste the AWA Seed Pitch Deck prompt into the topic box, confirming all 10 essential VC sections: Title, Problem, Solution, TAM, Business Model, Go-To-Market, Traction, Team, Financials, and The Ask.',
                image: '/images/guidance/tpl_slide_1/step-2.svg',
                tip: 'Gamma converts each named section into a tailored, visually structured slide card.',
                text: 'Paste the prompt containing all 10 essential investor deck sections.'
              },
              {
                step: 3,
                title: 'Generate & Review Slide Outline',
                description: 'Click "Generate outline" to view Gamma\'s proposed 10-slide flow. You can tweak slide titles or reorder cards before the final deck is generated.',
                image: '/images/guidance/tpl_slide_1/step-3.svg',
                tip: 'Keep slide titles focused on value (e.g. "Problem: The $14B Workflow Bottleneck").',
                text: 'Review the generated 10-card outline and customize slide headers.'
              },
              {
                step: 4,
                title: 'Select Minimalist Dark Tech Theme',
                description: 'Click Continue and select a dark theme with electric blue or neon accents from the theme gallery on the right. This conveys modern tech authority.',
                image: '/images/guidance/tpl_slide_1/step-4.svg',
                tip: 'Dark themes with vibrant accent colors maximize readability during investor pitch meetings.',
                text: 'Choose a minimalist dark theme with electric blue or neon accents.'
              },
              {
                step: 5,
                title: 'Populate Real Metrics & Export PDF',
                description: 'Watch Gamma generate all 10 cards in real-time. Click any placeholder card to type in your real MRR, team bios, and traction numbers, then export to PDF.',
                image: '/images/guidance/tpl_slide_1/step-5.svg',
                tip: 'You can share a live Gamma link with investors to track page view analytics in real-time.',
                actionText: 'Export Presentation',
                text: 'Input your startup numbers into placeholder cards and export to PDF.'
              }
            ]
          },
          {
            id: 'tpl_slide_2',
            name: 'Marketing Report',
            title: 'Marketing Report',
            subtitle: 'Monthly performance summary',
            category: 'Report Summaries',
            description: 'A template for presenting monthly marketing KPIs.',
            produces: 'A structured slide deck summarizing key marketing metrics.',
            mainCategory: 'Slides',
            media: {
              thumbnail: '/images/templates/tpl_slide_2.jpg',
              slides: ['/images/templates/tpl_slide_2.jpg']
            },
            tags: ['Slides', 'Report', 'Marketing'],
            difficulty: 'Easy',
            models: ['Gamma'],
            uiPrompt: "[UI & PRESENTATION PROMPT]\nVisual System: Clean executive white or deep navy, vibrant violet (#7C3AED) and cyan (#06B6D4) data visualization charts, clean tables, Plus Jakarta Sans typography.\nSlide Components: KPI dashboard cards (CAC $42, LTV:CAC 4.8x), multi-channel attribution bar charts, funnel drop-off diagrams, and budget reallocation matrix tables.\nAspect Ratio: 16:9 widescreen.",
            contextPrompt: "[CONTEXT & NARRATIVE PROMPT]\nTopic & Scope: Q3/Q4 Omni-Channel Growth Marketing Strategy & Performance Review Presentation for executive leadership.\nAudience: C-suite executives, VP of Marketing, and cross-functional department heads.\nGoal & Strategy: Present customer acquisition efficiency (CAC down 24%), channel performance attribution across Meta/Google/LinkedIn, and secure an H2 budget reallocation of $850k towards high-yield generative video creatives.",
            basePrompt: `Generate a monthly marketing performance report presentation.
Include slides for: Executive Summary, Traffic Growth, Conversion Rates, Campaign Highlights, and Next Month Goals.
Use a clean, corporate theme with ample whitespace and large metric callouts.`,
            charCount: 260,
            previewAccent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
            tools: [toolsDB.gamma],
            guidance: [
              {
                step: 1,
                title: 'Open Gamma Executive Report Preset',
                description: 'Open gamma.app, create a new presentation, and select the executive report layout designed for monthly data reporting and stakeholder reviews.',
                image: '/images/guidance/tpl_slide_2/step-1.svg',
                tip: 'Gamma\'s data layout cards are ideal for side-by-side metric comparisons.',
                actionText: 'Open Gamma App',
                actionUrl: 'https://gamma.app',
                text: 'Open Gamma and select Executive Report presentation mode.'
              },
              {
                step: 2,
                title: 'Structure 5 Key Performance Pillars',
                description: 'Input the 5 reporting sections: Executive Summary, Traffic Growth, Conversion Rates, Campaign Highlights, and Next Month Goals.',
                image: '/images/guidance/tpl_slide_2/step-2.svg',
                tip: 'Explicitly requesting large metric callouts instructs the AI to generate giant stat numbers.',
                text: 'Structure prompt with 5 reporting pillars and large metric callouts.'
              },
              {
                step: 3,
                title: 'Apply Corporate Clean Theme',
                description: 'Choose a clean, bright, corporate theme (such as "Minimalist" or "Breeze") with high white-space margins and crisp navy typography.',
                image: '/images/guidance/tpl_slide_2/step-3.svg',
                tip: 'Light, spacious themes maximize readability in executive boardrooms and printouts.',
                text: 'Select a corporate clean theme with ample white space and navy type.'
              },
              {
                step: 4,
                title: 'Generate Layouts & Embed Live Charts',
                description: 'Click Generate. Gamma will format comparative column cards and data tables. Replace placeholder images with screenshots from your analytics tool.',
                image: '/images/guidance/tpl_slide_2/step-4.svg',
                tip: 'Use Gamma\'s native chart editor to adjust bar and line values directly inside the slide.',
                text: 'Allow Gamma to build data cards and embed live analytics charts.'
              },
              {
                step: 5,
                title: 'Export Executive PDF Deck',
                description: 'Review slide flow, verify that all percentage growth figures are accurate, and export as an executive PDF presentation ready for your stakeholders.',
                image: '/images/guidance/tpl_slide_2/step-5.svg',
                tip: 'Gamma decks can also be exported to PowerPoint (.pptx) if offline boardroom presenting is needed.',
                actionText: 'Export Executive PDF',
                text: 'Verify KPI numbers and download the executive boardroom presentation.'
              }
            ]
          },
          {
            id: 'tpl_slide_3',
            name: 'Agency Case Study',
            title: 'Agency Case Study',
            subtitle: 'Visual heavy portfolio presentation',
            category: 'Pitch Decks',
            description: 'Showcase your best client work in a visually rich slide deck.',
            produces: 'A highly visual presentation layout for creative agencies.',
            mainCategory: 'Slides',
            media: {
              thumbnail: '/images/templates/tpl_slide_3.jpg',
              slides: ['/images/templates/tpl_slide_3.jpg']
            },
            tags: ['Slides', 'Portfolio', 'Agency'],
            difficulty: 'Medium',
            models: ['Gamma'],
            uiPrompt: "[UI & PRESENTATION PROMPT]\nVisual System & Theme: Sleek editorial dark mode, emerald green (#10B981) performance accents on matte obsidian (#0B0F17), typography in Space Grotesk and Inter.\nCard Structure: 8-card slide deck with high-contrast before/after KPI comparison cards, biometrics login mockup frames, and an executive quote card block.\nAspect Ratio: 16:9 widescreen presentation format.",
            contextPrompt: "[CONTEXT & NARRATIVE PROMPT]\nTopic & Engagement: Digital Transformation & Performance Overhaul Agency Case Study for 'Solaris Global' fintech platform.\nTarget Audience: Enterprise CMOs, VP of Product, and procurement directors evaluating premium digital design agencies.\nNarrative & Business Proof: How an agency redesign reduced mobile onboarding friction from 62% drop-off to a +280% completion surge, generating $1.4B in transaction volume and closing $250k enterprise client retainers.",
            basePrompt: `Create a case study presentation for a creative agency.
Focus heavily on large image placeholders and minimal text.
Include: Client Overview, The Challenge, Our Approach, The Work (3 slides), and Results.
Theme: Brutalist, high contrast, black and white.`,
            charCount: 280,
            previewAccent: 'from-zinc-800/20 via-black/10 to-transparent',
            tools: [toolsDB.gamma],
            guidance: [
              {
                step: 1,
                title: 'Open Visual-Heavy Canvas in Gamma',
                description: 'Launch gamma.app and select AI Presentation generation designed for creative agency portfolios and client pitch decks.',
                image: '/images/guidance/tpl_slide_3/step-1.svg',
                tip: 'Use full-bleed image card layouts to let your creative work lead the conversation.',
                actionText: 'Open Gamma App',
                actionUrl: 'https://gamma.app',
                text: 'Open Gamma and select visual-first presentation generation mode.'
              },
              {
                step: 2,
                title: 'Specify Case Study Narrative Flow',
                description: 'Input the case study structure: Client Overview, The Challenge, Our Approach, The Work (3 dedicated image slides), and Measurable Results.',
                image: '/images/guidance/tpl_slide_3/step-2.svg',
                tip: 'Dedicating 3 distinct slides to "The Work" ensures high-res visual mockups aren\'t cramped.',
                text: 'Input narrative case study chapters with 3 dedicated work slides.'
              },
              {
                step: 3,
                title: 'Select Brutalist High-Contrast Theme',
                description: 'Choose a striking high-contrast theme (such as "Void" or "Mono") featuring deep black backgrounds, stark white type, and razor-sharp borders.',
                image: '/images/guidance/tpl_slide_3/step-3.svg',
                tip: 'Brutalist black-and-white palettes prevent presentation styling from clashing with your client\'s brand colors.',
                text: 'Apply brutalist monochrome theme to keep attention on client visuals.'
              },
              {
                step: 4,
                title: 'Replace Placeholders with Hero Artwork',
                description: 'Click each image placeholder, select "Upload", and insert your actual client branding, packaging, or UI designs, then publish a shareable web link.',
                image: '/images/guidance/tpl_slide_3/step-4.svg',
                tip: 'Gamma web presentations support video embeds and interactive prototypes right inside the slide.',
                text: 'Upload high-resolution client project assets into image placeholders.'
              },
              {
                step: 5,
                title: 'Publish Interactive Web Deck Link',
                description: 'Click "Share" to generate a live web presentation link with full-screen presentation mode and responsive mobile viewing support.',
                image: '/images/guidance/tpl_slide_3/step-5.svg',
                tip: 'Shareable Gamma links can be embedded directly inside Notion or client portals.',
                actionText: 'Publish Case Study',
                text: 'Generate responsive web showcase link ready to send to prospective clients.'
              }
            ]
          },
          {
            id: 'tpl_slide_edu',
            name: 'Executive Masterclass Deck',
            title: 'Executive Masterclass Deck',
            subtitle: 'Modern modular slides for workshops and educational keynotes',
            category: 'Report Summaries',
            description: 'A clean, structured 12-slide masterclass and executive workshop presentation template with modular frameworks, mental model diagrams, and interactive exercise cards.',
            produces: 'Comprehensive 12-slide educational keynote presentation deck with clear pedagogical structure.',
            mainCategory: 'Slides',
            media: {
              thumbnail: '/images/templates/tpl_slide_edu_1_1.svg',
              slides: [
                '/images/templates/tpl_slide_edu_1_1.svg',
                '/images/templates/tpl_slide_edu_1_2.svg',
                '/images/templates/tpl_slide_edu_1_3.svg',
                '/images/templates/tpl_slide_edu_1_4.svg'
              ],
              gallery: ['/images/templates/tpl_slide_edu_1_1.svg']
            },
            tags: ['Slides', 'Masterclass', 'Workshop', 'Education', 'Keynote', 'Gamma'],
            difficulty: 'Easy',
            models: ['Gamma'],
            uiPrompt: `[UI & PRESENTATION PROMPT]
Visual System: Clean editorial light or deep indigo theme, vibrant violet (#6366F1) and amber (#F59E0B) focus highlights, Plus Jakarta Sans typography with high typographic hierarchy.
Card Layouts: 12-card responsive educational presentation deck in Gamma App. Includes agenda cards, 2x2 mental model matrix diagrams, stepped 4-phase framework flows, and break-out workshop exercise prompt cards with timer chips.
Aspect Ratio: 16:9 widescreen presentation mode.`,
            contextPrompt: `[CONTEXT & NARRATIVE PROMPT]
Topic & Program: "Agentic AI Systems in Enterprise: Architecture, Governance & Workflow Automation" — an executive 1-day masterclass for Fortune 500 product leaders and CTOs.
Audience: Technical executives, VP of Engineering, Chief Digital Officers, and enterprise product directors.
Pedagogical Strategy: Break down complex autonomous agent loops (Perception, Planning, Execution, Verification) into actionable architectural diagrams, ROI case studies, and hands-on governance sandbox exercises.`,
            basePrompt: `Create a 12-slide executive masterclass presentation for a workshop on "Agentic AI Systems in Enterprise".
The tone should be authoritative, pedagogical, and highly structured with visual frameworks.
Include: Title Slide, Workshop Agenda, The Paradigm Shift, 4-Phase Agentic Loop, Architecture Blueprint, Real-World Case Studies, ROI & Efficiency Benchmarks, Risk & Governance Matrix, Interactive Team Exercise, Pitfalls to Avoid, Implementation Roadmap, and Resource Kit.
Theme: Clean high-contrast navy and violet with crisp metric callout chips.`,
            charCount: 450,
            previewAccent: 'from-indigo-500/20 via-purple-500/10 to-transparent',
            tools: [toolsDB.gamma],
            guidance: ALL_GUIDANCE_CATALOG.tpl_slide_edu || []
          }
        ]
      }
    ]
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Prompts for generating UI components and full landing pages.',
    subcategories: [
      {
        id: 'landing-pages',
        name: 'Landing Pages',
        description: 'High-converting marketing pages and hero sections.',
        templates: [
          {
            id: 'tpl_web_1',
            name: 'SaaS Hero Section',
            title: 'SaaS Hero Section',
            subtitle: 'High-converting landing page header',
            category: 'Landing Pages',
            description: 'A production-grade developer workflow SaaS hero component with live telemetry preview, waitlist input, and sleek dark-mode glassmorphism.',
            produces: 'Clean React & Tailwind CSS component code for an interactive split-screen SaaS hero section.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_web_1.jpg',
              desktopPreview: '/images/templates/tpl_web_1.jpg',
              gallery: ['/images/templates/tpl_web_1.jpg']
            },
            tags: ['Web', 'Hero', 'UI', 'React', 'Tailwind', 'SaaS'],
            difficulty: 'Easy',
            models: ['v0 by Vercel', 'Cursor', 'Lovable'],
            uiPrompt: `Create a high-converting, modern SaaS landing page hero component using React, TypeScript, and Tailwind CSS.

Layout & Architecture:
- Split-screen asymmetric desktop hero (60/40 ratio) contained in a max-w-7xl mx-auto container.
- Left column: Announcement badge pill ("New: Automated PR Reviews v2.4"), bold display headline (H1), supporting paragraph, inline email waitlist input with submit button, and a social proof avatar stack with active user metric ("Joined by 12,000+ developers").
- Right column: Interactive glassmorphism preview dashboard card showing a simulated real-time CI/CD deployment pipeline with animated pulsing status indicators and sleek telemetry graphs.

Styling, Theme & Tokens:
- Dark theme: Background #0A0E1A, card surface #0F172A with border border-slate-800/80 and backdrop-blur-xl.
- Accent palette: Electric blue (#3B82F6) and vibrant violet (#8B5CF6) gradients. Subtle radial mesh glow behind the right preview card.
- Typography: Inter font family for body text; Geist or Outfit font for bold display headings with tight tracking (tracking-tight). High contrast ratios (WCAG AAA compliant).

Responsive Behavior:
- Desktop (lg: 1024px+): Side-by-side split grid with right preview aligned center.
- Tablet (md: 768px): Stacked vertically with preview card full width below headline.
- Mobile (375px+): Single-column stack, full-width inputs, comfortable 48px touch targets, padding px-4 py-12.

Interactions & Accessibility:
- Smooth button hover states (hover:scale-[1.02] active:scale-[0.98]) with glowing gradient transition.
- Accessible ARIA labels on all form controls, explicit focus-visible:ring-2 focus-visible:ring-blue-500 rings.
- Semantic HTML: <header>, <main>, <form>, <section>.`,
            contextPrompt: `Website Identity & Purpose:
This website is the marketing launch page for 'DevFlow AI', an automated continuous integration and code review engine for engineering teams. It connects with GitHub and GitLab to autonomously catch regression bugs, generate unit tests, and streamline pull request reviews.

Target Audience & User Persona:
- Engineering Managers, Lead Architects, and Full-Stack Developers who suffer from PR bottlenecks, slow code review cycles, and flaky test suites.
- Tech-forward startup teams seeking to ship code 3x faster without compromising code quality.

Primary Business Goals:
- Capture developer email registrations for the private beta release.
- Build immediate engineering credibility through concrete performance metrics and clean tech aesthetics.

Key Page Sections & Flow:
1. Hero Header: Clear one-sentence value proposition ("Ship Clean Code 3x Faster with Autonomous AI Code Reviews").
2. Beta Waitlist Capture: Frictionless 1-field email form with instant feedback.
3. Trust Proof: "Trusted by engineers at 400+ tech companies" with subtle monochrome company logos.
4. Interactive Dashboard Preview: Visual proof of automated PR comments and test coverage telemetry.

Tone of Voice & Content Direction:
- Authoritative, developer-first, concise, and no-nonsense. Avoid marketing fluff or exaggerated claims.
- Use engineering terminology naturally (e.g., CI/CD pipelines, AST analysis, zero false positives, SOC2 Type II).

Calls to Action (CTAs):
- Primary CTA: "Request Early Access →"
- Secondary Action: "View Interactive Demo"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Create a high-converting, modern SaaS landing page hero component using React, TypeScript, and Tailwind CSS.
Layout: Split-screen asymmetric desktop hero (60/40 ratio). Left side features an announcement pill, bold H1 display headline, email capture form, and social proof avatars. Right side features an interactive glassmorphism deployment pipeline preview card.
Style: Dark mode (background #0A0E1A, card surface #0F172A), electric blue (#3B82F6) and violet (#8B5CF6) accents, Inter + Geist typography.
Responsive: Full-width stacked single-column layout on mobile, side-by-side grid on desktop.
Accessibility: Full ARIA form compliance, high-contrast text, focus rings.

[BUSINESS CONTEXT PROMPT]
Product: 'DevFlow AI' — Autonomous continuous integration & AI code review engine for engineering teams.
Target Audience: Senior software engineers, tech leads, and DevOps architects suffering from review bottlenecks.
Goals: High-converting beta waitlist email capture; establish instant engineering authority.
Tone: Concise, developer-first, technical, authoritative.
Primary CTA: "Request Early Access →"`,
            charCount: 2840,
            previewAccent: 'from-blue-500/20 via-cyan-500/10 to-transparent',
            tools: [toolsDB.v0],
            guidance: [
              {
                step: 1,
                title: 'Open v0 or Cursor Prompt Studio',
                description: 'Open v0.dev or your Cursor IDE composer. v0 is optimized for streaming interactive React and Tailwind CSS components.',
                image: '/images/guidance/tpl_web_1/step-1.svg',
                tip: 'Provide both the UI Prompt and Context Prompt for complete layout and realistic dummy data.',
                actionText: 'Open v0 by Vercel',
                actionUrl: 'https://v0.dev',
                text: 'Open v0.dev and log in to start generative React component creation.'
              },
              {
                step: 2,
                title: 'Paste the Dedicated UI Prompt',
                description: 'Paste the AWA UI Prompt into the code generator to construct the split-screen layout, glassmorphic cards, and Tailwind tokens.',
                image: '/images/guidance/tpl_web_1/step-2.svg',
                tip: 'Mentioning TypeScript and Tailwind ensures production-ready code with zero runtime bloat.',
                text: 'Paste the split-screen hero prompt specifying React and Tailwind CSS.'
              },
              {
                step: 3,
                title: 'Provide Context Prompt for Realistic Content',
                description: 'Feed the Context Prompt to generate authentic developer-centric headlines, metrics, and microcopy instead of generic lorem ipsum.',
                image: '/images/guidance/tpl_web_1/step-3.svg',
                tip: 'The context prompt grounds the AI in DevFlow AI\'s value proposition.',
                text: 'Supply context prompt to populate developer telemetry and copy.'
              },
              {
                step: 4,
                title: 'Inspect Live Interactive Preview',
                description: 'Test the responsive viewport controls and verify waitlist email input hover and focus states.',
                image: '/images/guidance/tpl_web_1/step-4.svg',
                tip: 'Verify flex-col lg:flex-row classes in the generated markup.',
                text: 'Toggle viewport preview controls to verify mobile vertical stacking.'
              }
            ]
          },
          {
            id: 'tpl_web_2',
            name: 'Creative Portfolio',
            title: 'Creative Portfolio',
            subtitle: 'Bento-box style personal site',
            category: 'Portfolio Sites',
            description: 'An editorial bento-grid personal portfolio website for product designers, creative technologists, and design system leads.',
            produces: 'Responsive multi-breakpoint portfolio layout with bento-grid mosaic cards.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_web_2.jpg',
              desktopPreview: '/images/templates/tpl_web_2.jpg',
              gallery: ['/images/templates/tpl_web_2.jpg']
            },
            tags: ['Web', 'Portfolio', 'Bento', 'Framer', 'Editorial'],
            difficulty: 'Medium',
            models: ['Framer AI', 'v0 by Vercel'],
            uiPrompt: `Design a responsive personal creative portfolio website using a modern Bento-Grid layout in React and Tailwind CSS (or Framer canvas).

Layout & Bento Grid:
- Asymmetric 4-column CSS grid (grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6).
- Cell 1 (2-col span, 2-row span): Hero bio card with large portrait photograph, animated status badge ("Available for Q4 contracts"), and location marker.
- Cell 2 (2-col span): Featured Case Study card with live interactive prototype preview and client metric badge ("+142% conversion").
- Cell 3 (1-col span): Interactive Tech & Design Skills stack with Lucide icons (Figma, Next.js, WebGL, Design Systems).
- Cell 4 (1-col span): Experience timeline card with previous leadership roles at fintech and AI scaleups.
- Cell 5 (2-col span): Direct booking consultation card with integrated meeting scheduler trigger.

Styling, Theme & Palette:
- Theme: Clean, minimal light aesthetic with dark mode support. Light background #FAFAF9 with warm off-white card surfaces #FFFFFF and subtle border border-stone-200/70.
- Accents: Soft editorial terracotta (#C2410C) and warm sand (#F5F5F4).
- Typography: Editorial serif heading font (Playfair Display or Newsreader) paired with neutral sans-serif body (Plus Jakarta Sans).

Responsive Behavior:
- Mobile (<640px): 1-column vertical flow preserving visual hierarchy.
- Tablet (640px - 1024px): 2-column balanced grid.
- Desktop (1024px+): Full 4-column bento mosaic.

Interactions & Accessibility:
- Card hover elevation (hover:-translate-y-1 hover:shadow-xl transition-all duration-300).
- Image lightbox preview on case study cards. Full keyboard tab navigation and semantic landmark regions.`,
            contextPrompt: `Website Identity & Purpose:
This site is the official personal design portfolio and client portal for Elena Vance, a Senior Staff Product Designer and Design Systems Architect with 9+ years of experience crafting enterprise SaaS and generative AI tools.

Target Audience & User Persona:
- Design Directors, VP of Products, and Startup Founders looking for high-caliber contract design leadership or full product overhaul engagements.
- Creative Agencies seeking a specialized collaborator for complex interface architectures.

Primary Business Goals:
- Showcase 3 flagship case studies detailing end-to-end design thinking, measurable business outcomes, and tactile component design.
- Convert visitors into high-ticket freelance inquiries and design advisory consultations.

Key Page Sections & Flow:
1. Introduction & Positioning: "Crafting thoughtful digital interfaces at the intersection of systems, craft, and human behavior."
2. Flagship Case Studies: In-depth breakdowns of FinTech dashboards, healthcare mobile apps, and developer portals.
3. Design Philosophy & Toolkit: Bento card highlighting modular design token architecture and rapid prototyping.
4. Social Proof & Testimonials: Recommendations from VP of Design at Stripe and Linear.
5. Inquiries & Booking: Direct contact form and meeting reservation link.

Tone of Voice & Content Direction:
- Confident, understated luxury, articulate, and craft-obsessed. Let the work and metrics speak for themselves.

Calls to Action (CTAs):
- Primary CTA: "Inquire About Projects →"
- Secondary Action: "Read Case Studies"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Design a modern Bento-Grid portfolio layout in React/Tailwind. Asymmetric 4-column grid featuring a main portrait bio cell, featured case study preview card, interactive skills stack, and consultation booking module. Light stone palette (#FAFAF9), editorial serif headings with neutral sans-serif body, smooth hover elevation micro-interactions.

[BUSINESS CONTEXT PROMPT]
Product: Personal design portfolio for Elena Vance, Senior Staff Product Designer.
Audience: VPs of Product, founders, and design directors seeking senior design advisory.
Goals: Highlighting 3 deep case studies and driving project consultation bookings.
Tone: Understated luxury, craft-oriented, articulate.
Primary CTA: "Inquire About Projects →"`,
            charCount: 2950,
            previewAccent: 'from-pink-500/20 via-rose-500/10 to-transparent',
            tools: [toolsDB.framer, toolsDB.v0],
            guidance: [
              {
                step: 1,
                title: 'Open Framer AI or v0 Canvas',
                description: 'Launch Framer or v0.dev. Framer is ideal for interactive multi-breakpoint bento canvas generation.',
                image: '/images/guidance/tpl_web_2/step-1.svg',
                tip: 'Framer automatically generates responsive desktop, tablet, and mobile breakpoints.',
                actionText: 'Open Framer AI',
                actionUrl: 'https://framer.com',
                text: 'Open Framer and launch AI Generation mode on a new canvas.'
              },
              {
                step: 2,
                title: 'Input Bento-Grid UI Specifications',
                description: 'Paste the UI prompt to establish the 4-column asymmetric CSS grid, card aspect ratios, and editorial typography tokens.',
                image: '/images/guidance/tpl_web_2/step-2.svg',
                tip: 'Bento-box layouts combine cards of differing aspect ratios into an eye-catching asymmetric grid.',
                text: 'Enter bento-grid prompt detailing project showcase and skills cards.'
              },
              {
                step: 3,
                title: 'Apply Context Prompt for Real Case Studies',
                description: 'Supply the context prompt to fill the cards with Elena Vance\'s product design case studies, client quotes, and booking triggers.',
                image: '/images/guidance/tpl_web_2/step-3.svg',
                tip: 'Replace placeholder images with high-resolution Figma prototype exports.',
                text: 'Populate bento cards with real case studies and testimonials.'
              }
            ]
          },
          {
            id: 'tpl_web_3',
            name: 'Feature Grid',
            title: 'Feature Grid',
            subtitle: 'B2B product feature showcase',
            category: 'Landing Pages',
            description: 'A modular, high-impact 3-column enterprise cloud compliance feature grid with checklist badges and hover lift dynamics.',
            produces: 'Modular React & Tailwind CSS component code for B2B product marketing sections.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_web_3.jpg',
              desktopPreview: '/images/templates/tpl_web_3.jpg',
              gallery: ['/images/templates/tpl_web_3.jpg']
            },
            tags: ['Web', 'Component', 'UI', 'Security', 'B2B'],
            difficulty: 'Easy',
            models: ['v0 by Vercel', 'Cursor'],
            uiPrompt: `Create a modular 3-column enterprise B2B product feature grid component using React, Tailwind CSS, and Lucide icons.

Layout & Grid:
- Max-width 7xl container with a centered section header (kicker pill, title H2, subtitle paragraph).
- 3-column responsive grid (grid grid-cols-1 md:grid-cols-3 gap-8).
- Each card includes: Top icon badge in a rounded square with subtle gradient fill, bold feature title, 2-line description, checklist of 3 key sub-capabilities with checkmark icons, and an arrow link ("Learn more →").

Styling & Aesthetic:
- Clean enterprise aesthetic: Crisp white/dark slate card surfaces, border border-slate-200 dark:border-slate-800, subtle hover glow border-blue-500/40.
- Color Tokens: Deep enterprise navy (#0F172A), vibrant cyan (#06B6D4), and emerald (#10B981) status indicators.
- Typography: Inter font, 600-weight headings, relaxed line height on descriptions for readability.

Responsive Behavior & Accessibility:
- Seamless stacking: 1-column on mobile (<768px), 3-column on desktop (768px+).
- Minimum 48px touch targets for mobile buttons.
- Full ARIA compliance: semantic <section>, aria-labelledby heading hierarchy, high contrast color ratios (WCAG AA).`,
            contextPrompt: `Website Identity & Purpose:
This component is the core features section for 'SecureCloud', an automated cloud compliance and zero-trust security platform that helps B2B SaaS companies achieve continuous SOC 2, ISO 27001, and HIPAA compliance in weeks instead of months.

Target Audience & User Persona:
- CISOs, Security Engineers, and Chief Technology Officers at fast-growing B2B software companies.
- DevSecOps engineers responsible for AWS, GCP, and Azure cloud infrastructure security posture.

Primary Business Goals:
- Explain complex compliance automation clearly across 3 distinct operational pillars.
- Drive security directors to download the automated compliance checklist and book a technical architecture demo.

Three Pillar Features:
1. Automated Cloud Evidence Collection: Real-time API monitoring across 120+ cloud services with zero manual screenshots.
2. Continuous Vulnerability Scanning: Automated daily penetration checks and IAM permission drift alerts.
3. One-Click Audit Readiness: Auditor-approved compliance reports ready to export directly to CPA auditors.

Tone of Voice & Content Direction:
- Reassuring, uncompromisingly secure, rigorous, and enterprise-grade. Emphasize speed, accuracy, and peace of mind.

Calls to Action (CTAs):
- Primary CTA: "Request Security Architecture Demo →"
- Secondary Action: "Download SOC 2 Checklist"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Create an enterprise 3-column feature grid component in React and Tailwind CSS.
Features: 3 responsive cards with gradient icon containers, 2-line descriptions, checkmark capability lists, and hover elevation effects. Semantic HTML structure, high-contrast dark/light mode tokens.

[BUSINESS CONTEXT PROMPT]
Product: 'SecureCloud' — Automated SOC 2, ISO 27001, and HIPAA cloud compliance platform.
Audience: CISOs and DevSecOps leaders requiring continuous audit evidence collection.
Pillars: 1) Automated Evidence, 2) Continuous Vulnerability Scanning, 3) 1-Click Audit Readiness.
Primary CTA: "Request Security Architecture Demo →"`,
            charCount: 2680,
            previewAccent: 'from-emerald-500/20 via-green-500/10 to-transparent',
            tools: [toolsDB.v0],
            guidance: [
              {
                step: 1,
                title: 'Open v0 Component Studio',
                description: 'Open v0.dev to generate an isolated, reusable 3-column marketing feature grid.',
                image: '/images/guidance/tpl_web_3/step-1.svg',
                tip: 'Isolated components can be dropped into any existing Next.js or React page.',
                actionText: 'Open v0 by Vercel',
                actionUrl: 'https://v0.dev',
                text: 'Access v0.dev component builder for modular component generation.'
              },
              {
                step: 2,
                title: 'Paste UI & Context Prompts',
                description: 'Provide both prompts to render the exact 3-column grid with SecureCloud compliance data and Lucide icons.',
                image: '/images/guidance/tpl_web_3/step-2.svg',
                tip: 'Mentioning hover:shadow-lg creates natural micro-interactions.',
                text: 'Paste prompt specifying 3 columns, Lucide icons, and hover lift effects.'
              }
            ]
          },
          {
            id: 'tpl_future_machine',
            name: 'Future Machine',
            title: 'Future Machine',
            subtitle: 'Advanced robotics & cybernetics studio',
            category: 'Robotics',
            description: 'A striking robotics studio landing page with mecha branding, live hardware telemetry readouts, electric blue accents, and technology showcase.',
            produces: 'High-tech robotics studio website with bold visual branding and live telemetry.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_robotics_1.jpg',
              poster: '/images/templates/tpl_robotics_1.jpg',
              desktopPreview: '/images/templates/tpl_robotics_1.jpg',
              motionPreviewUrl: '/videos/web_3d_robotics.mp4',
              gallery: ['/images/templates/tpl_robotics_1.jpg']
            },
            tags: ['Robotics', 'Studio', 'Web', 'Mecha', 'Hardware'],
            difficulty: 'Medium',
            models: ['v0 by Vercel', 'Framer AI'],
            uiPrompt: `Build a futuristic, high-tech robotics hardware studio website landing page using React, Tailwind CSS, and WebGL/3D canvas integration.

Layout & Structure:
- Full-bleed cinematic hero section with an interactive 3D robot manipulator arm model canvas.
- Sticky navigation bar with technical telemetry coordinates, live system clock, and Mecha badge.
- Floating HUD (Heads-Up Display) data panels displaying live actuator torque stats, servo latency, and degrees of freedom.
- 4-column tech specs table comparing industrial payload capabilities and battery endurance.

Styling, Theme & Palette:
- Deep obsidian dark background (#080C14) with electric cobalt blue (#1D4ED8) and neon cyan (#22D3EE) accents.
- Hardware aesthetic: Chamfered card corners, subtle carbon fiber micro-textures, and fine 1px tech grid lines.
- Typography: Monospace font (JetBrains Mono or Space Mono) for data metrics and telemetry; bold techno-grotesque sans-serif for headlines (Chakra Petch or Orbitron).

Responsive & Interactive Details:
- Mouse parallax tilt on telemetry cards.
- Mobile viewport: 3D canvas gracefully scales with touch rotation gestures; data panels collapse into clean swipeable cards.
- Accessible ARIA labels on all live hardware readouts and interactive canvas controls.`,
            contextPrompt: `Website Identity & Purpose:
This site represents 'Future Machine', an elite advanced robotics and autonomous cybernetics R&D studio that designs next-generation collaborative robotic arms and autonomous warehouse logistics systems.

Target Audience & User Persona:
- VP of Automation, Factory Directors, and Lead Mechatronics Engineers at modern manufacturing and logistics enterprises.
- Venture capital and sovereign tech funds investing in deep-tech physical automation.

Primary Business Goals:
- Showcase industrial pilot deployments across automotive assembly and pharmaceutical packing facilities.
- Drive qualified industrial enterprise leads to schedule an on-site hardware pilot deployment.

Key Page Sections & Flow:
1. Hero Header: "Physical Intelligence Engineered for Extreme Industrial Automation."
2. Interactive Hardware Viewer: Real-time 3D model showing 7-axis freedom and modular gripper tool heads.
3. Performance Telemetry: Concrete specs (0.02mm repeatability, 25kg payload, IP67 waterproof certification).
4. Pilot Case Studies: Automotive line throughput improvements with live customer metrics.
5. Deployment Inquiry: Technical qualification form for warehouse automation pilots.

Tone of Voice & Content Direction:
- Cutting-edge, uncompromisingly engineered, industrial, and visionary. Avoid sci-fi tropes; focus on real physics, mechanical durability, and ROI.

Calls to Action (CTAs):
- Primary CTA: "Schedule On-Site Hardware Pilot →"
- Secondary Action: "Download Industrial Specs Sheet (PDF)"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Futuristic robotics hardware studio website with 3D canvas hero, floating HUD telemetry readouts, cobalt blue & cyan color accents against #080C14 obsidian backdrop. Monospace typography for real-time actuator telemetry.

[BUSINESS CONTEXT PROMPT]
Company: 'Future Machine' — Advanced collaborative robotics & industrial automation studio.
Audience: Factory automation directors and logistics executives.
Goals: Announcing next-gen 7-axis robotic arm and driving hardware pilot bookings.
Primary CTA: "Schedule On-Site Hardware Pilot →"`,
            charCount: 2820,
            previewAccent: 'from-blue-600/20 via-cyan-500/10 to-transparent',
            tools: [toolsDB.v0, toolsDB.framer],
            guidance: [
              {
                step: 1,
                title: 'Open v0 or Framer Canvas',
                description: 'Generate the robotics studio layout specifying high-contrast cobalt blue and electric cyan accents.',
                image: '/images/guidance/tpl_web_1/step-1.svg',
                text: 'Launch builder and paste robotics studio prompt.'
              }
            ]
          },
          {
            id: 'tpl_quantum_human',
            name: 'Quantum Human',
            title: 'Quantum Human',
            subtitle: 'Augmented human mind AI hero',
            category: 'AI',
            description: 'A dark, cinematic AI platform hero featuring neural network particles, deep cognition themes, and futuristic typography.',
            produces: 'Dark cinematic hero section for AI and neural interface products.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_ai_1.jpg',
              desktopPreview: '/images/templates/tpl_ai_1.jpg',
              gallery: ['/images/templates/tpl_ai_1.jpg']
            },
            tags: ['AI', 'Neural', 'Hero', 'Dark Mode', 'Cognition'],
            difficulty: 'Hard',
            models: ['Framer AI', 'v0 by Vercel'],
            uiPrompt: `Create a dark cinematic AI website hero section for 'Quantum Human' using React, Tailwind CSS, and canvas particle animations.

Layout & Structure:
- Centered cinematic stage layout with a dramatic silhouette of a human head illuminated by an interactive neural network particle mesh.
- Minimalist top navigation with subtle frosted glass background and sound toggle indicator.
- Hero center: Clean futuristic typography with subtle letter-spacing (tracking-[0.25em]), glowing subtitle, and dual minimalist pill buttons.
- Bottom status bar showing real-time EEG channel frequency readouts (Alpha, Beta, Theta waves).

Styling, Theme & Palette:
- Background: Pitch black #030712 with deep indigo ambient radial gradients (#1E1B4B / #312E81).
- Accent Colors: Bioluminescent cyan (#38BDF8) and electric amethyst (#A855F7).
- Typography: Modern geometric sans-serif (Inter or Syne) with delicate weights, wide tracking on uppercase kickers, and high contrast body copy.

Responsive Behavior & Accessibility:
- Canvas animation automatically throttles frame rate on mobile to conserve battery and avoid UI stutter.
- Breakpoints: Full viewport height (min-h-screen) on desktop; clean vertical stack on mobile with reduced particle count.
- Respects prefers-reduced-motion CSS media query by pausing particle canvas.`,
            contextPrompt: `Website Identity & Purpose:
This landing page introduces 'Quantum Human', a neurotechnology company developing non-invasive neural interface headbands that decode cognitive focus, reduce mental fatigue, and enhance deep creative flow states through real-time neurofeedback.

Target Audience & User Persona:
- High-performance knowledge workers, software engineers, professional creatives, and biohackers seeking sustained focus.
- Cognitive neuroscience researchers and clinical sleep/focus specialists.

Primary Business Goals:
- Explain non-invasive EEG brainwave tracking simply without confusing medical jargon.
- Collect pre-order waitlist reservations for the Founder's Edition neuro-band launch.

Key Page Sections & Flow:
1. Cinematic Hero: "Augmented Human Mind — Neural Clarity Powered by Real-Time Cognitive AI."
2. The Science of Neuro-Synapse Mapping: Visual explanation of medical-grade 16-channel EEG sensors.
3. Clinical Trial Results: Peer-reviewed metrics showing 42% reduction in cognitive distraction within 14 days.
4. Companion Mobile App: Real-time mental bandwidth telemetry and adaptive binaural audio.
5. Founder's Edition Reservation: Tiered pre-order form with guaranteed priority delivery.

Tone of Voice & Content Direction:
- Enigmatic, scientific, visionary, and deeply human-centered. Grounded in neuroscience rather than exaggerated science fiction.

Calls to Action (CTAs):
- Primary CTA: "Reserve Founder's Edition →"
- Secondary Action: "Read Clinical Validation Paper"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Cinematic AI neural interface hero section in React & Tailwind CSS. Deep black canvas (#030712), bioluminescent cyan & amethyst neural particle mesh, delicate tracking-[0.25em] typography, EEG frequency status dock.

[BUSINESS CONTEXT PROMPT]
Company: 'Quantum Human' — Non-invasive neural cognition interface headband for sustained creative flow.
Audience: High-performance knowledge workers, researchers, and biohackers.
Goals: Demystifying EEG brainwave telemetry and capturing Founder's Edition pre-orders.
Primary CTA: "Reserve Founder's Edition →"`,
            charCount: 2740,
            previewAccent: 'from-indigo-600/20 via-blue-500/10 to-transparent',
            tools: [toolsDB.framer, toolsDB.v0],
            guidance: [
              {
                step: 1,
                title: 'Generate Neural Hero Layout',
                description: 'Specify dark mode (#030712), glowing neural synapses, and clean geometric typography.',
                image: '/images/guidance/tpl_web_1/step-1.svg',
                text: 'Configure neural network lighting and dark interface.'
              }
            ]
          },
          {
            id: 'tpl_mind_ai',
            name: 'Mind AI',
            title: 'Mind AI',
            subtitle: 'Holographic iridescent 3D website',
            category: '3D',
            description: 'A cutting-edge 3D generative AI site featuring an iridescent liquid-chrome holographic human bust with rainbow refractions.',
            produces: 'Futuristic 3D creative platform website layout with iridescent visual elements.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_3d_1.jpg',
              poster: '/images/templates/tpl_3d_1.jpg',
              desktopPreview: '/images/templates/tpl_3d_1.jpg',
              motionPreviewUrl: '/videos/web_3d_spatial.mp4',
              gallery: ['/images/templates/tpl_3d_1.jpg']
            },
            tags: ['3D', 'Holographic', 'Creative', 'Web', 'Generative'],
            difficulty: 'Medium',
            models: ['v0 by Vercel', 'Framer AI'],
            uiPrompt: `Design an avant-garde 3D creative AI platform website using React, Tailwind CSS, and iridescent chrome shader effects.

Layout & Architecture:
- Dynamic asymmetric split layout.
- Left column: Editorial headline with mixed typographic weights, live creative prompt playground, and model export badges (GLTF, USDZ, FBX, OBJ).
- Right column: Central 3D liquid-chrome iridescent human bust asset with interactive mouse-drag rotation and rainbow light refraction reflections.
- Bottom horizontal marquee showcasing real-time community generative 3D meshes with creator tags.

Styling, Theme & Palette:
- Aesthetic: Clean minimalist off-white / silver backdrop (#F8FAFC) contrasting with iridescent liquid chrome rainbow refractions (#E0E7FF, #FCE7F3, #CFFAFE).
- Typography: High-fashion typographic pairing (Syne or Clash Display for bold expressive headlines; Archivo for crisp monospace technical metadata).
- Glassmorphism: Ultra-fine 1px semi-transparent borders with multi-layer specular drop shadows.

Responsive Behavior & Accessibility:
- Interactive 3D container supports both WebGL shader rendering and high-res WebP fallback.
- Mobile layout: 3D canvas positioned prominently at top with touch-orbit support, followed by prompt input and export buttons.
- Full ARIA accessibility for screen readers on all 3D mesh controls.`,
            contextPrompt: `Website Identity & Purpose:
This website is the product showcase and creator studio for 'Mind AI', a generative 3D artificial intelligence platform that transforms natural language prompts and 2D concept art into production-ready 3D meshes, textured shaders, and game-engine rigs.

Target Audience & User Persona:
- 3D Modellers, Game Developers, VFX Supervisors, and Digital Fashion Designers looking to accelerate 3D asset prototyping from days to minutes.
- Creative Directors at digital agencies designing interactive spatial web experiences.

Primary Business Goals:
- Drive creators to start a free trial inside the web-based 3D workspace.
- Showcase high-fidelity topology, PBR texture maps, and instant Unreal Engine / Unity exports.

Key Page Sections & Flow:
1. Expressive Hero: "Where Mind Meets Matter — Instant Generative 3D Mesh Synthesis."
2. Live Interactive Canvas: Rotate and inspect an iridescent liquid-chrome procedural sculpture.
3. Asset Pipeline Integration: 1-click export to Blender, Unreal Engine 5, Unity, and Apple Vision Pro.
4. Community Showcase: Curated gallery of game-ready avatars, vehicles, and architecture.
5. Creator Studio Signup: Free tier with 20 complimentary 3D mesh generations.

Tone of Voice & Content Direction:
- Avant-garde, inspiring, boundary-breaking, and artistic. Speak directly to creative craftspeople who care about topology, UV unwrapping, and artistic control.

Calls to Action (CTAs):
- Primary CTA: "Launch 3D Web Studio →"
- Secondary Action: "Explore Community Gallery"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Avant-garde 3D generative AI web platform. Clean silver canvas (#F8FAFC), iridescent liquid-chrome 3D sculpture viewer with rainbow refraction highlights. High-fashion typographic pairing, export dock for GLTF/USDZ/FBX.

[BUSINESS CONTEXT PROMPT]
Product: 'Mind AI' — Text-to-3D asset synthesis platform for game designers and 3D artists.
Audience: 3D modellers, digital fashion creators, and game development studios.
Goals: High-converting free studio signups and asset topology showcase.
Primary CTA: "Launch 3D Web Studio →"`,
            charCount: 2810,
            previewAccent: 'from-purple-600/20 via-pink-500/10 to-transparent',
            tools: [toolsDB.v0, toolsDB.framer],
            guidance: [
              {
                step: 1,
                title: 'Set Iridescent 3D Aesthetic',
                description: 'Prompt 3D holographic glass and chrome visual assets with modern typographic layout.',
                image: '/images/guidance/tpl_web_2/step-1.svg',
                text: 'Build modern 3D showcase platform.'
              }
            ]
          },
          {
            id: 'tpl_web_bakery',
            name: 'Artisan Bakery & Cafe',
            title: 'Artisan Bakery & Cafe',
            subtitle: 'Warm neighborhood bakery storefront',
            category: 'Local Business',
            description: 'A warm, mouth-watering landing page for an artisan sourdough bakery and cafe with daily bake schedule and pickup ordering.',
            produces: 'Clean responsive website layout with interactive menu showcase and pre-order flow.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_web_bakery.jpg',
              desktopPreview: '/images/templates/tpl_web_bakery.jpg',
              gallery: ['/images/templates/tpl_web_bakery.jpg']
            },
            tags: ['Web', 'Bakery', 'Food', 'Cafe', 'Local', 'Ecommerce'],
            difficulty: 'Easy',
            models: ['v0 by Vercel', 'Framer AI'],
            uiPrompt: `Design a warm, tactile, and mouth-watering landing page for an artisan sourdough bakery and cafe using React, Tailwind CSS, and Lucide icons.

Layout & Composition:
- Hero: Full-width warm photographic banner of freshly baked artisanal sourdough loaves dusted with flour, rustic wooden textures, and morning sunlight.
- Navigation: Clean header with logo, Menu, Daily Bakes, Catering, Our Story, and a prominent "Order for Pickup" button.
- Daily Bake Schedule: 4-column card grid showing today's fresh bread rotation with dietary badges (Organic, Vegan, Sourdough, Gluten-Free Friendly).
- Interactive Coffee & Pastry Showcase: Visual tabbed menu with real photography, flavor notes, and price tags.
- Location & Hours Section: Embedded interactive map, subway directions, and live bakery status ("Baking Now — Open until 4:00 PM").

Styling, Theme & Palette:
- Warm artisanal palette: Warm wheat (#FDF8F0), flour white (#FFFFFF), toasted crust caramel (#9A3412), rich espresso (#3E2723), and soft sage green (#E2E8F0).
- Typography: Classic bakery serif heading (Fraunces or Recoleta) paired with warm humanist sans-serif body (DM Sans).
- Textures: Soft rounded corners (rounded-2xl), delicate border border-amber-900/10, subtle drop shadows.

Responsive Behavior & Accessibility:
- Mobile-first ordering flow: Menu cards easily scrollable horizontally on mobile with large touch-friendly "Add to Box" buttons.
- Full accessibility: High contrast text on warm backgrounds, clear image alt text describing bakery items, accessible menu modal.`,
            contextPrompt: `Website Identity & Purpose:
This site is the local storefront and online pre-ordering website for 'Crumb & Crust', an independent neighborhood artisan bakery and specialty espresso bar specializing in naturally fermented wild sourdough, French viennoiserie, and direct-trade single-origin coffee.

Target Audience & User Persona:
- Neighborhood residents, food enthusiasts, and morning commuters looking for exceptional fresh bread, morning pastries, and specialty espresso.
- Local event hosts and offices ordering catering boxes for morning meetings.

Primary Business Goals:
- Drive morning foot traffic and announce the daily sourdough bake schedule.
- Allow customers to pre-order specialty loaves and pastry boxes 24 hours in advance to guarantee availability.

Key Page Sections & Flow:
1. Warm Hero: "Naturally Fermented Sourdough, Handcrafted Daily with Organic Heritage Grains."
2. Today's Bake Schedule: Live countdown to the morning bread pull (8:00 AM & 1:00 PM).
3. Pastry & Espresso Menu: Croissants, pain au chocolat, cardamom buns, and specialty pour-overs.
4. Heritage Grain Philosophy: 36-hour slow fermentation and 100% locally sourced organic wheat.
5. Visit Us & Pickup Ordering: Store address, opening hours, and online pre-order cart.

Tone of Voice & Content Direction:
- Warm, welcoming, sensory, and rooted in neighborhood community. Describe textures and aromas vividly (crisp blistering crust, airy crumb, rich buttery layers).

Calls to Action (CTAs):
- Primary CTA: "Pre-Order for Today's Pickup →"
- Secondary Action: "View Daily Bake Menu"`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Warm, tactile artisan sourdough bakery and cafe landing page in React and Tailwind CSS. Warm wheat & toasted caramel palette (#FDF8F0, #9A3412), Fraunces serif typography, daily bake rotation schedule, interactive pastry & espresso menu cards with pickup pre-order drawer.

[BUSINESS CONTEXT PROMPT]
Business: 'Crumb & Crust' — Neighborhood artisan wild sourdough bakery and specialty espresso bar.
Audience: Local residents, commuters, and food lovers seeking fresh morning bakes.
Goals: Highlighting morning bake pull times and driving advance pickup pre-orders.
Primary CTA: "Pre-Order for Today's Pickup →"`,
            charCount: 2890,
            previewAccent: 'from-amber-600/20 via-orange-500/10 to-transparent',
            tools: [toolsDB.v0, toolsDB.framer],
            guidance: [
              {
                step: 1,
                title: 'Launch v0 or Framer Canvas',
                description: 'Open v0.dev or Framer AI and paste the UI Prompt to generate the warm bakery layout and menu grid.',
                image: '/images/guidance/tpl_web_1/step-1.svg',
                tip: 'Using warm palette tokens creates an inviting neighborhood storefront feel.',
                actionText: 'Open v0 by Vercel',
                actionUrl: 'https://v0.dev',
                text: 'Launch builder and input bakery UI prompt.'
              },
              {
                step: 2,
                title: 'Apply Context Prompt for Bakery Content',
                description: 'Input the Context Prompt to generate mouth-watering sourdough descriptions, daily schedules, and store hours.',
                image: '/images/guidance/tpl_web_1/step-2.svg',
                tip: 'Sensory descriptions increase menu conversion by over 30%.',
                text: 'Supply context prompt to populate sourdough menu and bake times.'
              }
            ]
          },
          {
            id: 'tpl_3d_timepiece',
            name: 'Haute Horology 3D Showcase',
            title: 'Haute Horology 3D Showcase',
            subtitle: 'Interactive WebGL mechanical watch viewer with kinetic gearwork',
            category: '3D Websites',
            description: 'A state-of-the-art interactive 3D WebGL website showcase for an ultra-luxury skeleton tourbillon timepiece featuring real-time exploded component view, camera orbit, and Swiss watchmaking heritage.',
            produces: 'Production-grade Three.js / React Three Fiber interactive 3D web experience with exploded CAD assembly inspection.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_3d_timepiece_poster.svg',
              poster: '/images/templates/tpl_3d_timepiece_poster.svg',
              desktopPreview: '/images/templates/tpl_3d_timepiece_poster.svg',
              mobilePreview: '/images/templates/tpl_3d_timepiece_mobile.svg',
              motionPreviewUrl: '/videos/web_3d_timepiece.mp4',
              gallery: ['/images/templates/tpl_3d_timepiece_poster.svg']
            },
            tags: ['3D', 'WebGL', 'Luxury', 'Horology', 'Three.js', 'Interactive'],
            difficulty: 'Hard',
            models: ['v0 by Vercel', 'Framer AI'],
            uiPrompt: `Create an ultra-luxury 3D interactive timepiece web application using Next.js, React Three Fiber (Three.js), and Tailwind CSS.

Layout & 3D Canvas Architecture:
- Fullscreen WebGL viewport with smooth mouse-orbit controls, spring damping, and focal lock on the balance wheel.
- Exploded View Toggle: Smooth cinematic camera animation transitioning between assembled case and 7-layer exploded component view (sapphire crystal, bezel, dial ring, tourbillon cage, balance spring, mainplate, exhibition caseback).
- Minimalist HUD Overlay: Clean technical coordinates, current Swiss time in Geneva (GMT+1), jewel count (38 Jewels), power reserve meter (72 Hours), and frequency indicator (28,800 vph).
- Audio Integration: Subtle mechanical tick-sound toggle button using Web Audio API.

Styling, Theme & Tokens:
- Dark luxury theme: Background #050508, metallic satin gold (#D4AF37), polished grade-5 titanium (#64748B), and deep slate (#0F172A).
- Typography: Swiss geometric sans-serif (Suisse Int'l or Archivo) with tabular figures (tabular-nums) for watch specs.
- Accessibility & Fallbacks: Graceful high-resolution WebP/SVG fallback for non-WebGL devices with full ARIA inspection controls.`,
            contextPrompt: `Website Identity & Purpose:
This site is the bespoke digital launch boutique for 'Vaucher & Co.', an independent Geneva manufacture producing limited-run skeleton tourbillon timepieces for high-net-worth collectors.

Target Audience & User Persona:
- Ultra-high-net-worth watch collectors, connoisseurs of haute horology, and luxury auction participants.
- Mechanical engineers and industrial designers fascinated by micro-mechanical tolerance and hand-beveled anglage finishing.

Primary Business Goals:
- Build brand mystique and educate collectors on the 480 hours of hand finishing invested into each movement.
- Secure direct private consultation bookings and bespoke allocation requests ($85,000+ MSRP).

Key Sections & Flow:
1. Interactive Tourbillon Viewer: Real-time 3D exploded view with component click hotspots.
2. Manufacture Heritage: Hand-finishing atelier tour in Le Brassus, Switzerland.
3. Technical Specifications Matrix: Monolithic titanium case, silicon hairspring, twin barrels.
4. Bespoke Atelier Configurator: Strap leather selection and personalized case engraving preview.
5. Private Allocation Request: White-glove concierge booking form.`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Ultra-luxury 3D interactive Swiss mechanical timepiece website using Next.js, React Three Fiber, and Tailwind CSS.
Features: Interactive 3D WebGL tourbillon watch canvas with exploded view toggle, orbital camera controls, Geneva time clock HUD, and 38-jewel movement telemetry. Palette: #050508 obsidian with satin gold (#D4AF37) and titanium accents.

[BUSINESS CONTEXT PROMPT]
Brand: 'Vaucher & Co.' — Independent Geneva haute horology manufacture.
Audience: High-net-worth collectors and connoisseurs.
Goal: Exploded movement inspection and private allocation requests ($85,000+ timepiece).
Primary CTA: "Request Private Atelier Allocation →"`,
            charCount: 2750,
            previewAccent: 'from-amber-500/20 via-yellow-500/10 to-transparent',
            tools: [toolsDB.v0, toolsDB.framer],
            guidance: ALL_GUIDANCE_CATALOG.tpl_3d_timepiece || []
          },
          {
            id: 'tpl_3d_pavilion',
            name: 'Spatial Architecture & Pavilion 3D',
            title: 'Spatial Architecture & Pavilion 3D',
            subtitle: 'Brutalist concrete architecture portfolio with interactive sun path',
            category: '3D Websites',
            description: 'An architectural studio showcase website featuring an interactive 3D spatial pavilion model with simulated sun-path shadows, material shaders (cast concrete, glass, water), and spatial walkthroughs.',
            produces: 'Interactive 3D architectural design website with real-time solar study lighting and spatial portfolio cards.',
            mainCategory: 'Websites',
            media: {
              thumbnail: '/images/templates/tpl_3d_pavilion_poster.svg',
              poster: '/images/templates/tpl_3d_pavilion_poster.svg',
              desktopPreview: '/images/templates/tpl_3d_pavilion_poster.svg',
              mobilePreview: '/images/templates/tpl_3d_pavilion_mobile.svg',
              motionPreviewUrl: '/videos/web_3d_pavilion.mp4',
              gallery: ['/images/templates/tpl_3d_pavilion_poster.svg']
            },
            tags: ['Architecture', '3D', 'Spatial', 'Brutalist', 'Interactive', 'Portfolio'],
            difficulty: 'Medium',
            models: ['v0 by Vercel', 'Framer AI'],
            uiPrompt: `Build a modern architectural studio website with interactive 3D spatial model viewer and real-time solar sun-path simulation using React, Three.js, and Tailwind CSS.

Layout & Architecture:
- Split-screen spatial layout: Left side contains architectural project statement, floorplan toggle, and solar time-of-day slider (6:00 AM dawn to 8:00 PM dusk); Right side houses the real-time 3D pavilion model canvas with physically based concrete and reflecting pool shaders.
- Floorplan Blueprint Overlay: Clean vector CAD wireframe toggle displaying spatial dimensions in meters.
- Project Gallery Grid: Below the hero, a 3-column asymmetric grid of completed public pavilions, art galleries, and residential retreats.

Styling, Theme & Palette:
- Architectural minimalism: Warm bone white background (#F4F4F0) with deep graphite type (#18181B) and warm rust-red accents (#991B1B).
- Typography: Architectural monospaced typography (Space Mono or Roboto Mono) for coordinates and dimensions, paired with elegant geometric sans (Neue Haas Grotesk).`,
            contextPrompt: `Website Identity & Purpose:
This site represents 'Atelier Kōso', an award-winning Tokyo & Zurich architectural practice specializing in minimalist cast concrete cultural pavilions, meditation centers, and civic amphitheaters.

Target Audience & User Persona:
- Cultural Foundation Boards, Museum Curators, and Municipal Arts Councils commissioning public cultural architecture.
- Private patrons seeking bespoke architectural residences integrated seamlessly into natural landscapes.

Primary Business Goals:
- Demonstrate spatial mastery of light, shadow, and materiality through an interactive solar sun-study simulation.
- Attract prestigious institutional design competitions and high-budget residential commissions.

Key Sections & Flow:
1. Hero Spatial Viewer: "Form Follows Light — Spatial Architecture for Contemplation."
2. Real-Time Solar Study: Interactive slider showing shifting daylight cast shadows through concrete skylights.
3. Monograph & Projects: Selected works featuring Kyoto Water Pavilion and Zurich Stone Sanctuary.
4. Materiality & Craft: Board-formed concrete, hand-chiseled granite, and acoustic cedar woodwork.
5. Commission Inquiries: Direct partner consultation request form.`,
            basePrompt: `[UI & IMPLEMENTATION PROMPT]
Architectural studio spatial website with interactive 3D pavilion viewer and solar sun-path lighting slider in React, Three.js, and Tailwind CSS. Warm bone palette (#F4F4F0), graphite typography, blueprint wireframe overlay, and 3-column monograph project grid.

[BUSINESS CONTEXT PROMPT]
Practice: 'Atelier Kōso' — Minimalist cast concrete and cultural architecture studio (Tokyo & Zurich).
Audience: Museum curators, cultural foundation boards, and private patrons.
Goal: Demonstrating mastery of natural lighting and winning architectural commissions.
Primary CTA: "Commission an Architectural Project →"`,
            charCount: 2690,
            previewAccent: 'from-slate-500/20 via-stone-500/10 to-transparent',
            tools: [toolsDB.v0, toolsDB.framer],
            guidance: ALL_GUIDANCE_CATALOG.tpl_3d_pavilion || []
          }
        ]
      }
    ]
  }
];

// Enrich mockCatalog templates with specific, verified guidance steps
mockCatalog.forEach((cat) => {
  cat.subcategories.forEach((sub) => {
    sub.templates.forEach((t) => {
      if (ALL_GUIDANCE_CATALOG[t.id]) {
        t.guidance = ALL_GUIDANCE_CATALOG[t.id];
      }
    });
  });
});

export const CATEGORIES = [
  'Image',
  'Video',
  'Slides',
  'Website',
] as const;

export const MODELS = [
  'Midjourney',
  'Adobe Firefly',
  'DALL-E 3',
  'FLUX.1 Pro',
  'Runway Gen-2',
  'Pika Labs',
  'Gamma',
  'v0 by Vercel',
  'Framer AI',
] as const;

export interface CategoryNode {
  id: string;
  name: string;
  description?: string;
  children?: CategoryNode[];
  templateIds?: string[];
}

export const categoryTree: CategoryNode[] = [
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Master-crafted prompts for commercial photography and visual design.',
    children: [
      {
        id: 'product-photography',
        name: 'Product Photography',
        description: 'Clean isolated product visuals and studio tabletop arrangements.',
        templateIds: ['tpl_1', 'tpl_4', 'tpl_img_couture'],
      },
      {
        id: 'lifestyle-context',
        name: 'Lifestyle & Context',
        description: 'Contextual staging in real-world living and architectural spaces.',
        templateIds: ['tpl_2', 'tpl_img_museum'],
      },
      {
        id: 'advertising-campaigns',
        name: 'Advertising & Campaigns',
        description: 'High-impact cinematic hero banners and promotional marketing imagery.',
        templateIds: ['tpl_3', 'tpl_img_aquatic'],
      },
    ],
  },
  {
    id: 'video-generation',
    name: 'Video Generation',
    description: 'Generative video prompts for cinematic motion and product demos.',
    children: [
      {
        id: 'product-demo-videos',
        name: 'Product Demo Videos',
        description: 'Smooth camera movements and transitions for product showcases.',
        templateIds: ['tpl_video_1', 'tpl_video_2', 'tpl_video_jellyfish'],
      },
      {
        id: 'social-media-clips',
        name: 'Social Media Clips',
        description: 'Short-form energetic videos for Instagram and TikTok.',
        templateIds: ['tpl_video_3', 'tpl_video_reel'],
      },
    ],
  },
  {
    id: 'slides-generation',
    name: 'Slides Generation',
    description: 'Rapid presentation and pitch deck generation.',
    children: [
      {
        id: 'pitch-decks',
        name: 'Pitch Decks',
        description: 'Clean, persuasive slides for startups and agencies.',
        templateIds: ['tpl_slide_1', 'tpl_slide_3'],
      },
      {
        id: 'report-summaries',
        name: 'Report Summaries',
        description: 'A template for presenting monthly marketing KPIs.',
        templateIds: ['tpl_slide_2', 'tpl_slide_edu'],
      },
    ],
  },
  {
    id: 'website-generation',
    name: 'Website Generation',
    description: 'Prompts for generating UI components and full landing pages.',
    children: [
      {
        id: 'landing-pages',
        name: 'Landing Pages',
        description: 'High-converting marketing pages and hero sections.',
        templateIds: ['tpl_web_1', 'tpl_web_3', 'tpl_future_machine', 'tpl_quantum_human', 'tpl_web_bakery'],
      },
      {
        id: 'portfolio-sites',
        name: 'Portfolio Sites',
        description: 'Modern bento-grid personal portfolio sites.',
        templateIds: ['tpl_web_2'],
      },
      {
        id: '3d-websites',
        name: '3D & Spatial Websites',
        description: 'Interactive WebGL, Three.js, and spatial web canvases.',
        templateIds: ['tpl_mind_ai', 'tpl_3d_timepiece', 'tpl_3d_pavilion'],
      },
    ],
  }
];

// Helper: collect all template IDs under a node (including all descendants)
export function getAllTemplateIdsUnderNode(node: CategoryNode): string[] {
  let ids: string[] = node.templateIds ? [...node.templateIds] : [];
  if (node.children) {
    for (const child of node.children) {
      ids = ids.concat(getAllTemplateIdsUnderNode(child));
    }
  }
  return ids;
}

// Helper: find a node by ID anywhere in the tree
export function findNodeById(nodes: CategoryNode[], id: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper: get the path of ancestor nodes leading to targetId
export function getNodePath(nodes: CategoryNode[], targetId: string): CategoryNode[] {
  for (const node of nodes) {
    if (node.id === targetId) return [node];
    if (node.children) {
      const subPath = getNodePath(node.children, targetId);
      if (subPath.length > 0) {
        return [node, ...subPath];
      }
    }
  }
  return [];
}

export const allTemplates: Template[] = mockCatalog.flatMap((c) =>
  c.subcategories.flatMap((s) => s.templates)
);

export function findTemplate(templateId: string): {
  template: Template;
  category: Category;
  subcategory: Subcategory;
} | null {
  for (const cat of mockCatalog) {
    for (const sub of cat.subcategories) {
      const t = sub.templates.find(
        (item) =>
          item.id === templateId ||
          (templateId === 'plain-product-on-white' && item.id === 'tpl_1') ||
          (templateId === 'lifestyle-context' && item.id === 'tpl_2') ||
          (templateId === 'flat-lay-composition' && item.id === 'tpl_4') ||
          (templateId === 'festive-banner' && item.id === 'tpl_3')
      );
      if (t) {
        return { template: t, category: cat, subcategory: sub };
      }
    }
  }
  return null;
}

export function findCategory(categoryId: string): Category | undefined {
  return mockCatalog.find((c) => c.id === categoryId);
}

export function findSubcategory(categoryOrId: Category | string, subcategoryId: string): Subcategory | undefined {
  const cat = typeof categoryOrId === 'string' ? findCategory(categoryOrId) : categoryOrId;
  return cat?.subcategories.find((s) => s.id === subcategoryId);
}

