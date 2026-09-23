import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public/images/guidance');

// Template guidance definition with visual metadata
const templateGuidanceData = {
  // ─────────────────────────────────────────────────────────────
  // 1. IMAGE TEMPLATES
  // ─────────────────────────────────────────────────────────────
  tpl_1: {
    name: 'Plain product on white',
    category: 'Product Photography',
    tool: 'Midjourney v6 & DALL-E 3',
    domain: 'midjourney.com/app',
    accentColor: '#3B82F6',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // ENGINE SELECTION',
        title: 'Select Midjourney v6 Engine',
        subtitle: 'Launch Midjourney web console or Discord and lock v6 model',
        type: 'tool_select',
        toolName: 'Midjourney v6.0',
        toolMeta: 'Raw Style Engine • Version 6.0 Active • Pro Plan',
        badge: 'v6.0 RAW ACTIVE',
        details: [
          'Engine: Midjourney v6.0 High-Fidelity',
          'Stylization: --style raw (Preserves Geometry)',
          'Default Resolution: 2048 x 2048 px'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // STUDIO STAGING',
        title: 'Setup Pure White Infinity Cove',
        subtitle: 'Configure 3-point softbox lighting and #FFFFFF seamless backdrop',
        type: 'studio_lighting',
        keyLight: 'Key Octabox 120cm (45° Left)',
        rimLight: 'Rim Light 3200K (Camera Right)',
        fillCard: '2:1 White Foam Fill Board',
        backdrop: 'Seamless Infinity Sweep (#FFFFFF)'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // OPTICS & SHADOWS',
        title: 'Hasselblad 120mm Macro Optics',
        subtitle: 'Dial aperture to f/11 for tack-sharp focus and contact shadows',
        type: 'camera_optics',
        cameraModel: 'Hasselblad H6D-100c',
        lens: '120mm Macro Prime Lens',
        aperture: 'f/11 (Edge-to-Edge Sharpness)',
        shadow: 'Grounded Contact Shadow (< 5% Opacity)'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // PROMPT CUSTOMIZATION',
        title: 'Customize Subject & Parameters',
        subtitle: 'Insert your exact product name and append raw production flags',
        type: 'prompt_box',
        subject: 'Cylindrical ceramic tumbler [Replace with Your Product]',
        parameters: '--ar 1:1 --v 6.0 --style raw --q 2',
        promptSnippet: 'Studio product photograph of [Your Product], centered composition. Seamless pure white infinity cove background #FFFFFF... --ar 1:1 --v 6.0 --style raw'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // QUAD PREVIEW',
        title: 'Generate & Inspect 4-Way Quad',
        subtitle: 'Examine lighting symmetry and clean silhouette borders',
        type: 'quad_preview',
        gridLabels: ['Variant U1', 'Variant U2', 'Variant U3', 'Variant U4'],
        selected: 'U1 (Optimal Edge Isolation)',
        actionBtn: 'Upscale (Creative / Subtle)'
      },
      {
        num: 6,
        stepTag: 'STEP 06 // RESOLUTION & CUTOUT',
        title: 'Upscale & Verify #FFFFFF Background',
        subtitle: 'Check RGB pixel values (255, 255, 255) for Amazon / Shopify compliance',
        type: 'export_verify',
        exportFormat: '2048 x 2048 PNG (Amazon / Shopify Compliant)',
        bgVerify: 'Background RGB: 255, 255, 255 (#FFFFFF)',
        verdict: 'READY FOR E-COMMERCE CATALOG'
      }
    ]
  },

  tpl_2: {
    name: 'Lifestyle shot, in-use',
    category: 'Lifestyle',
    tool: 'Adobe Firefly & Midjourney v6',
    domain: 'firefly.adobe.com/generate',
    accentColor: '#14B8A6',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // ENGINE SELECTION',
        title: 'Launch Adobe Firefly / Midjourney',
        subtitle: 'Open Text-to-Image with commercial licensing safety enabled',
        type: 'tool_select',
        toolName: 'Adobe Firefly Text-to-Image',
        toolMeta: 'Enterprise Safe • Stock Library Trained • High Dynamic Range',
        badge: 'COMMERCIAL SAFE',
        details: [
          'Tool: Adobe Firefly Image 3 Model',
          'Aspect Ratio: 4:5 Vertical Mobile Ready',
          'Content Type: Photo (Natural Staging)'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // INTERIOR STAGING',
        title: 'Stage Scandinavian Interior',
        subtitle: 'Position solid white oak coffee table with linen and plant accents',
        type: 'studio_lighting',
        keyLight: 'Floor-to-Ceiling Loft Window',
        rimLight: 'Warm Ambient Room Bounce',
        fillCard: 'Textured Linen Sofa & Fiddle-Leaf Fig',
        backdrop: 'Sun-Drenched Scandinavian Loft'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // NATURAL SUNLIGHT',
        title: 'Calibrate 10am Morning Sunlight',
        subtitle: 'Simulate 4500K warm organic morning rays with soft diagonal shadows',
        type: 'camera_optics',
        cameraModel: 'Sony A7R V Full-Frame',
        lens: '50mm f/1.4 G-Master Prime',
        aperture: 'f/2.0 (Creamy Background Bokeh)',
        shadow: 'Natural 10am Sunbeam Shadows'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // SUBJECT CUSTOMIZATION',
        title: 'Customize Product in Environment',
        subtitle: 'Replace generic placeholder with your lifestyle consumer product',
        type: 'prompt_box',
        subject: 'Ceramic pour-over coffee dripper on oak table',
        parameters: '--ar 4:5 --v 6.0 --style raw',
        promptSnippet: 'Editorial lifestyle photograph of [Your Product] on a solid white oak coffee table in a sun-drenched Scandinavian apartment... --ar 4:5 --v 6.0'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // DEPTH OF FIELD TUNING',
        title: 'Tune Foreground Focus & Bokeh',
        subtitle: 'Verify the product is razor sharp while background dissolves smoothly',
        type: 'quad_preview',
        gridLabels: ['Take 1: Soft Glow', 'Take 2: Sharp Rim', 'Take 3: Wide Angle', 'Take 4: Close Up'],
        selected: 'Take 2 (Best Sunlight Reflection)',
        actionBtn: 'Download High-Res 4:5 Asset'
      },
      {
        num: 6,
        stepTag: 'STEP 06 // EDITORIAL GRADING',
        title: 'Apply Kodak Portra 400 Color Science',
        subtitle: 'Warm filmic tones ready for Instagram and direct-to-consumer store',
        type: 'export_verify',
        exportFormat: '3000 x 3750 px (4:5 Mobile Ratio)',
        bgVerify: 'Color Profile: Kodak Portra Warmth',
        verdict: 'READY FOR INSTAGRAM & SHOPIFY HERO'
      }
    ]
  },

  tpl_3: {
    name: 'Festive campaign banner',
    category: 'Advertising & Campaigns',
    tool: 'Midjourney v6 & DALL-E 3',
    domain: 'midjourney.com/app',
    accentColor: '#F43F5E',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // CANVAS SETUP',
        title: 'Set 16:9 Widescreen Ratio',
        subtitle: 'Configure wide banner canvas designed for paid ads and hero banners',
        type: 'tool_select',
        toolName: 'Midjourney v6 Widescreen',
        toolMeta: 'Aspect Ratio: --ar 16:9 • High Dynamic Range • Advertising Grade',
        badge: '16:9 WIDESCREEN',
        details: [
          'Aspect Ratio: 16:9 Landscape Banner',
          'Negative Space: Left/Right Copy Safe Zones',
          'Model: Midjourney v6.0 Raw Mode'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // PALETTE & ATMOSPHERE',
        title: 'Deep Crimson & Champagne Palette',
        subtitle: 'Formulate opulent holiday mood with suspended micro-glitter particles',
        type: 'studio_lighting',
        keyLight: 'Frontal Diffused Softbox (Label Fill)',
        rimLight: '3200K Warm Tungsten Backlight',
        fillCard: 'Champagne Gold Foil Reflector',
        backdrop: 'Deep Crimson Velvet with Ambient Bokeh'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // CINEMATIC OPTICS',
        title: 'ARRI Alexa Mini & Anamorphic Flare',
        subtitle: 'Zeiss Supreme Prime 50mm T1.5 shot at T2.8 for oval bokeh circles',
        type: 'camera_optics',
        cameraModel: 'ARRI Alexa Mini LF Cinema',
        lens: 'Zeiss Supreme Prime 50mm T1.5',
        aperture: 'T2.8 Anamorphic Depth',
        shadow: 'Subtle Lens Flare & Golden Halo'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // PACKAGING INSERTION',
        title: 'Specify Product & Luxury Packaging',
        subtitle: 'Insert luxury item details (frosted glass, embossed foil, silk ribbon)',
        type: 'prompt_box',
        subject: 'Luxury perfume bottle with gold embossed label',
        parameters: '--ar 16:9 --v 6.0 --style raw',
        promptSnippet: 'Cinematic wide advertising hero banner of [Your Product] amidst a lavish festive holiday composition... --ar 16:9 --v 6.0'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // RETINA EXPORT',
        title: 'Export Retina Advertising Banner',
        subtitle: 'High-res 3840x2160 output with copy space ready for seasonal campaigns',
        type: 'export_verify',
        exportFormat: '3840 x 2160 4K UHD Banner',
        bgVerify: 'Color Space: DCI-P3 Commercial Gamut',
        verdict: 'READY FOR BLACK FRIDAY & HOLIDAY ADS'
      }
    ]
  },

  tpl_4: {
    name: 'Flat lay composition',
    category: 'Social & Editorial',
    tool: 'FLUX.1 Pro & DALL-E 3',
    domain: 'blackforestlabs.ai/flux',
    accentColor: '#EC4899',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // ZENITH ANGLE',
        title: 'Lock 90° Top-Down Zenith Angle',
        subtitle: 'Set perpendicular knolling camera position directly above tabletop',
        type: 'camera_optics',
        cameraModel: 'Canon EOS R5 Perpendicular Mount',
        lens: '35mm f/2.8 Macro Lens',
        aperture: 'f/8 Perpendicular Zenith Plane',
        shadow: 'Balanced 360° Soft Contact Shadows'
      },
      {
        num: 2,
        stepTag: 'STEP 02 // PROPS CURATION',
        title: 'Curate Matte Concrete & Props',
        subtitle: 'Arrange notebook, brass pencil, and ceramic cup in geometric harmony',
        type: 'studio_lighting',
        keyLight: 'Large Overhead Diffused Softbox',
        rimLight: 'Perimeter Ambient Fill Scrim',
        fillCard: 'Matte Grey Negative Fill Card',
        backdrop: 'Minimalist Matte Concrete Surface'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // BALANCED GRID',
        title: 'Define Negative Space & Margins',
        subtitle: 'Maintain equal margins around the center hero product accessory',
        type: 'tool_select',
        toolName: 'FLUX.1 Pro Macro Knolling',
        toolMeta: 'Knolling Composition • Precision Geometry • Micro-Texture Engine',
        badge: 'FLAT-LAY KNOLLING',
        details: [
          'Geometry: Strict 90° Overhead Axis',
          'Props: 3 Coordinated Tonal Items',
          'Focal Plane: Edge-to-Edge Sharpness'
        ]
      },
      {
        num: 4,
        stepTag: 'STEP 04 // SUBJECT SWAP',
        title: 'Replace Artisanal Accessory',
        subtitle: 'Insert your hero item (leather wallet, watch, sunglasses) into center',
        type: 'prompt_box',
        subject: 'Full-grain leather bifold wallet [Replace with Item]',
        parameters: '--ar 1:1 --v 6.0 --q 2',
        promptSnippet: 'Commercial overhead flat-lay knolling photograph of [Your Product] centered on matte concrete tabletop... --ar 1:1'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // EXPORT & ALIGNMENT CHECK',
        title: 'Verify Parallel Lines & Export',
        subtitle: 'Ensure props are geometrically aligned and export 1:1 square master',
        type: 'export_verify',
        exportFormat: '2048 x 2048 px (1:1 Square Post)',
        bgVerify: 'Alignment: Precision 90° Grid Alignment',
        verdict: 'READY FOR INSTAGRAM & PINTEREST FEED'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. VIDEO TEMPLATES
  // ─────────────────────────────────────────────────────────────
  tpl_video_1: {
    name: 'Dynamic 360 Spin',
    category: 'Product Demo Videos',
    tool: 'Runway Gen-2 & Luma',
    domain: 'runwayml.com/gen-2',
    accentColor: '#3B82F6',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // GEN-2 STUDIO',
        title: 'Open Runway Gen-2 Video Studio',
        subtitle: 'Select Gen-2 engine with Image+Description multi-modal inputs',
        type: 'tool_select',
        toolName: 'Runway Gen-2 Studio',
        toolMeta: 'Generative Video AI • Camera Motion Controls • 4K Upscaler',
        badge: 'GEN-2 ENGINE',
        details: [
          'Mode: Image + Description Video',
          'Output Duration: 4 Seconds (Extendable)',
          'Frame Rate: 24 FPS Smooth Cinematic'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // REFERENCE IMAGE',
        title: 'Upload Clean Product Still',
        subtitle: 'Drop in a high-resolution studio photograph on pedestal',
        type: 'studio_lighting',
        keyLight: 'Frontal Product Stills Reference',
        rimLight: 'Dynamic Edge Tracking Light',
        fillCard: 'Dark Pedestal Surface',
        backdrop: 'Black Marble Pedestal Base'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // CAMERA ORBIT SLIDER',
        title: 'Configure Orbit Left Motion',
        subtitle: 'Set Camera Pan / Orbit slider to -2.5 for continuous slow rotation',
        type: 'camera_optics',
        cameraModel: 'Runway Camera Motion Controller',
        lens: 'Continuous 360° Circular Orbit',
        aperture: 'Pan Speed: -2.5 (Gentle Orbit)',
        shadow: 'Dynamic Specular Light Reflection'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // VIDEO PROMPT',
        title: 'Enter Cinematic Motion Prompt',
        subtitle: 'Specify pedestal rotation, tracking rim lights, and 4k resolution',
        type: 'prompt_box',
        subject: 'Perfume bottle on black marble pedestal',
        parameters: '--camera orbit_left',
        promptSnippet: 'Cinematic 360-degree slow pan around [Your Product] on black marble pedestal. Camera moves smoothly... --camera orbit_left'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // GENERATE 4S TIMELINE',
        title: 'Render 4-Second Keyframe Video',
        subtitle: 'Watch Runway compute fluid 24fps motion vectors across timeline',
        type: 'quad_preview',
        gridLabels: ['Frame 00:00 (Front)', 'Frame 01:00 (Angle)', 'Frame 02:00 (Profile)', 'Frame 03:00 (Rear)'],
        selected: 'Continuous 360° Orbit Validated',
        actionBtn: 'Render 4s Video'
      },
      {
        num: 6,
        stepTag: 'STEP 06 // SEAMLESS LOOP EXPORT',
        title: 'Export 4K MP4 Seamless Loop',
        subtitle: 'Download broadcast-quality MP4 optimized for Shopify and TikTok ads',
        type: 'export_verify',
        exportFormat: 'MP4 Video (H.264 / 24fps / 4K)',
        bgVerify: 'Motion: 360° Seamless Infinite Loop',
        verdict: 'READY FOR SHOPIFY & SOCIAL ADS'
      }
    ]
  },

  tpl_video_2: {
    name: 'Macro Fluid Splash',
    category: 'Product Demo Videos',
    tool: 'Pika Labs & Kling AI',
    domain: 'pika.art/generate',
    accentColor: '#06B6D4',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // PIKA CONSOLE',
        title: 'Open Pika Labs Generation Console',
        subtitle: 'Access the generative video console with high-speed fluid physics',
        type: 'tool_select',
        toolName: 'Pika Labs Generative Video',
        toolMeta: 'High-Speed Fluid Physics • Macro Focus Engine • 60 FPS Interpolation',
        badge: 'HIGH-SPEED FLUID',
        details: [
          'Engine: Pika 1.0 Fluid Dynamics',
          'Speed Preset: 1000 FPS Slow Motion',
          'Focus Mode: Extreme Macro'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // BACKLIT FLUID SETUP',
        title: 'Backlit Fluid Transparency',
        subtitle: 'Configure bright commercial backlighting to illuminate water droplets',
        type: 'studio_lighting',
        keyLight: 'Rear Backlit High-Lumen Softbox',
        rimLight: 'Prismatic Droplet Edge Refraction',
        fillCard: 'River Stone / Product Base',
        backdrop: 'Crystal Clear Water Dynamics'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // MOTION PARAMETER',
        title: 'Lock -motion 3 Parameter',
        subtitle: 'Set motion velocity slider to level 3 for realistic fluid viscosity',
        type: 'camera_optics',
        cameraModel: 'Phantom Flex4K High-Speed',
        lens: '100mm Macro Close-Up Lens',
        aperture: '1000 FPS Equivalent Look',
        shadow: 'Suspended Micro-Droplets in Air'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // SPLASH PROMPT',
        title: 'Customize Splash Liquid & Object',
        subtitle: 'Specify clear water, milk, or cosmetics serum splashing over item',
        type: 'prompt_box',
        subject: 'Crystal water splashing over smooth stone / bottle',
        parameters: '-motion 3',
        promptSnippet: 'Extreme macro slow motion video of crystal clear water splashing over [Your Product]. Tiny droplets suspended... -motion 3'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // EXPORT PEAK SPLASH',
        title: 'Scrub & Export Peak Splash MP4',
        subtitle: 'Select the take with maximum droplet refraction and download 1080p',
        type: 'export_verify',
        exportFormat: '1080p MP4 Video (Slow Motion)',
        bgVerify: 'Physics: 1000fps Viscosity Simulation',
        verdict: 'READY FOR BEVERAGE & COSMETIC ADS'
      }
    ]
  },

  tpl_video_3: {
    name: 'Cinematic Reveal',
    category: 'Social Media Clips',
    tool: 'Runway Gen-2 & Sora',
    domain: 'runwayml.com/gen-2',
    accentColor: '#6366F1',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // DARK STUDIO CANVAS',
        title: 'Open Runway Dark Studio Canvas',
        subtitle: 'Prepare Text-to-Video generation starting in pitch-black shadow',
        type: 'tool_select',
        toolName: 'Runway Gen-2 Video',
        toolMeta: 'Dramatic Lighting Transition • Push-In Camera • High Dynamic Contrast',
        badge: 'LIGHTING REVEAL',
        details: [
          'Lighting Mode: Dynamic Dark-to-Light',
          'Camera Track: Slow Push In (+2.0)',
          'Atmosphere: Pitch-Black Mystery'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // LIGHTING TIMELINE',
        title: 'Dark-to-Light Transition Sequence',
        subtitle: 'Specify a flickering overhead fluorescent tube illuminating metallic contours',
        type: 'studio_lighting',
        keyLight: 'Single Overhead Strip Light Tube',
        rimLight: 'Specular Gloss Edge Gleam',
        fillCard: 'Zero Fill (Pitch-Black Shadows)',
        backdrop: 'Deep Black Cyc Studio Void'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // PUSH-IN MOTION SLIDER',
        title: 'Configure Slow Push-In Camera',
        subtitle: 'Set Camera Zoom to +2.0 to steadily push toward product silhouette',
        type: 'camera_optics',
        cameraModel: 'Runway Camera Zoom Controller',
        lens: 'Cinematic Anamorphic Prime',
        aperture: 'Zoom Slider: +2.0 (Push In)',
        shadow: 'High-Contrast Specular Reflection'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // REVEAL PROMPT',
        title: 'Enter Reveal Prompt & Subject',
        subtitle: 'Insert your sports car, luxury watch, or new tech hardware',
        type: 'prompt_box',
        subject: 'Sleek sports car sitting in complete darkness',
        parameters: '--camera zoom_in',
        promptSnippet: 'A sleek [Your Product] sitting in complete darkness. Single overhead light tube flickers on, slowly revealing... --camera zoom_in'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // EXPORT CINEMATIC TEASER',
        title: 'Export Teaser Video Clip',
        subtitle: 'Download dramatic reveal MP4 for keynote teasers and launch campaigns',
        type: 'export_verify',
        exportFormat: '4K MP4 Cinematic Video',
        bgVerify: 'Contrast: Zero Banding in Blacks',
        verdict: 'READY FOR PRODUCT LAUNCH KEYNOTE'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SLIDES TEMPLATES
  // ─────────────────────────────────────────────────────────────
  tpl_slide_1: {
    name: 'Seed Pitch Deck',
    category: 'Pitch Decks',
    tool: 'Gamma App & Tome',
    domain: 'gamma.app/create',
    accentColor: '#A855F7',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // AI PRESENTATION MODE',
        title: 'Launch Gamma Presentation Generator',
        subtitle: 'Click "Create New" → "Generate" → "Presentation" in Gamma dashboard',
        type: 'tool_select',
        toolName: 'Gamma Presentation AI',
        toolMeta: 'Interactive Web Slides • Responsive Card Canvas • Instant Export',
        badge: '10-SLIDE DECK',
        details: [
          'Format: 10-Slide Web-Responsive Deck',
          'Audience: Seed & Series A Investors',
          'Output: Interactive Link & PDF'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // OUTLINE STRUCTURE',
        title: 'Paste 10-Slide Investor Structure',
        subtitle: 'Provide Title, Problem, Solution, TAM, Business Model, Traction, Ask',
        type: 'prompt_box',
        subject: 'B2B SaaS startup automating HR workflows',
        parameters: 'Theme: Dark mode with neon blue accents',
        promptSnippet: 'Create a 10-slide seed pitch deck for [Your Startup]. Sections: Title, Problem, Solution, Market Size, Traction, Team, The Ask...'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // OUTLINE VERIFICATION',
        title: 'Review Slide Header Flow',
        subtitle: 'Confirm Gamma generates 10 distinct cards matching VC expectations',
        type: 'studio_lighting',
        keyLight: 'Slide 1-3: Problem & Solution',
        rimLight: 'Slide 4-6: Market & Business Model',
        fillCard: 'Slide 7-9: Traction & Founding Team',
        backdrop: 'Slide 10: The Ask & Financial Runway'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // DARK TECH THEME',
        title: 'Select Minimalist Dark Theme',
        subtitle: 'Pick high-contrast dark theme with electric blue accents for authority',
        type: 'camera_optics',
        cameraModel: 'Gamma Theme Styler',
        lens: 'Theme: "Midnight Tech" / "Neon Navy"',
        aperture: 'Font: Inter / Syne Heading',
        shadow: 'High-Contrast Card Borders'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // METRICS & PDF EXPORT',
        title: 'Populate Real Metrics & Export',
        subtitle: 'Replace placeholder MRR and growth stats, then export PDF or live URL',
        type: 'export_verify',
        exportFormat: 'Vector PDF & Live Web Deck URL',
        bgVerify: 'Analytics: Investor View Tracking Active',
        verdict: 'READY FOR VENTURE CAPITAL MEETINGS'
      }
    ]
  },

  tpl_slide_2: {
    name: 'Marketing Report',
    category: 'Report Summaries',
    tool: 'Gamma App & Beautiful.ai',
    domain: 'gamma.app/create',
    accentColor: '#10B981',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // REPORT PRESET',
        title: 'Open Gamma Monthly Report Preset',
        subtitle: 'Select presentation mode optimized for KPI tables and growth metrics',
        type: 'tool_select',
        toolName: 'Gamma Executive Reports',
        toolMeta: 'Data-Dense Cards • Chart Embeds • Clean Corporate Typography',
        badge: 'KPI REPORTING',
        details: [
          'Slides: 5 Structured Executive Cards',
          'Metrics: Traffic, Conversion, MRR Growth',
          'Audience: C-Suite & Stakeholders'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // 5-PILLAR STRUCTURE',
        title: 'Define 5 Executive KPI Pillars',
        subtitle: 'Structure: Summary, Traffic Growth, Conversions, Highlights, Next Month',
        type: 'prompt_box',
        subject: 'Monthly marketing performance & KPI summary',
        parameters: 'Corporate clean theme, large stat callouts',
        promptSnippet: 'Generate a monthly marketing performance report presentation. Slides: Executive Summary, Traffic Growth, Conversion Rates... clean theme'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // CORPORATE CLEAN THEME',
        title: 'Apply Spacious Corporate Theme',
        subtitle: 'Select "Minimalist" or "Breeze" theme with ample white space',
        type: 'camera_optics',
        cameraModel: 'Gamma Corporate Palette',
        lens: 'Theme: "Minimalist Light" / "Executive"',
        aperture: 'Layout: Split Data Grid & Callouts',
        shadow: 'Subtle Corporate Card Elevations'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // CHART EMBEDDING',
        title: 'Embed Live Growth Charts',
        subtitle: 'Connect Google Analytics or Stripe screenshot cards into placeholders',
        type: 'studio_lighting',
        keyLight: 'Traffic Growth Bar Chart',
        rimLight: 'Conversion Funnel Sankey Diagram',
        fillCard: 'CAC / LTV Ratio Metric Cards',
        backdrop: 'Executive Highlights Grid'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // BOARDROOM PDF EXPORT',
        title: 'Export Executive PDF Deck',
        subtitle: 'Download presentation ready for board reviews and executive meetings',
        type: 'export_verify',
        exportFormat: 'High-Res Presentation PDF / PPTX',
        bgVerify: 'Typography: Crisp Executive Clean',
        verdict: 'READY FOR MONTHLY BOARD MEETING'
      }
    ]
  },

  tpl_slide_3: {
    name: 'Agency Case Study',
    category: 'Pitch Decks',
    tool: 'Gamma App & SlidesAI',
    domain: 'gamma.app/create',
    accentColor: '#8B5CF6',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // VISUAL CANVAS',
        title: 'Open Visual-Heavy Gamma Canvas',
        subtitle: 'Start agency portfolio deck emphasizing full-bleed image cards',
        type: 'tool_select',
        toolName: 'Gamma Visual Presentation',
        toolMeta: 'Visual-First Layouts • Hero Media Cards • Client Pitch Ready',
        badge: 'PORTFOLIO DECK',
        details: [
          'Structure: Overview, Challenge, Approach, 3x The Work, Results',
          'Visual Ratio: 70% Media / 30% Copy',
          'Theme: High-Contrast Brutalist'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // CASE STUDY PROMPT',
        title: 'Paste Narrative Case Study Flow',
        subtitle: 'Detail Client Overview, Challenge, Approach, 3 Work slides, Results',
        type: 'prompt_box',
        subject: 'Creative design agency client case study',
        parameters: 'Theme: Brutalist, high contrast, black and white',
        promptSnippet: 'Create a case study presentation for a creative agency. Include: Client Overview, Challenge, Our Approach, The Work (3 slides), Results...'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // BRUTALIST MONOCHROME',
        title: 'Select Brutalist High-Contrast Theme',
        subtitle: 'Apply "Void" monochrome black/white styling so client artwork pops',
        type: 'camera_optics',
        cameraModel: 'Gamma Monochrome Styler',
        lens: 'Theme: "Void" Black & White',
        aperture: 'Borders: 1px Razor Clean Wireframes',
        shadow: 'Zero Vignette (Pure Gallery Framing)'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // CLIENT ARTWORK UPLOAD',
        title: 'Replace Placeholders with Real Work',
        subtitle: 'Upload your high-resolution branding, UI designs, and campaign stills',
        type: 'studio_lighting',
        keyLight: 'Slide 4: Hero Branding Stills',
        rimLight: 'Slide 5: Mobile App UI Mockups',
        fillCard: 'Slide 6: Packaging & Print Collateral',
        backdrop: 'Slide 7: Measurable ROI & Metrics'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // SHAREABLE WEB LINK',
        title: 'Publish Live Client Showcase URL',
        subtitle: 'Generate responsive web presentation link with video embeds support',
        type: 'export_verify',
        exportFormat: 'Interactive Web Link & PDF',
        bgVerify: 'Media: Retina Image Containers Active',
        verdict: 'READY FOR CLIENT PROPOSALS'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. WEBSITES TEMPLATES
  // ─────────────────────────────────────────────────────────────
  tpl_web_1: {
    name: 'SaaS Hero Section',
    category: 'Landing Pages',
    tool: 'v0 by Vercel',
    domain: 'v0.dev/chat',
    accentColor: '#3B82F6',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // V0 PROMPT STUDIO',
        title: 'Open v0 by Vercel Console',
        subtitle: 'Navigate to v0.dev and log in with GitHub/Vercel for React generation',
        type: 'tool_select',
        toolName: 'v0 by Vercel',
        toolMeta: 'Generative React Engine • Tailwind CSS 3/4 • Lucide Icons',
        badge: 'REACT + TAILWIND',
        details: [
          'Framework: Next.js / React 19 Compatible',
          'Styling: Pure Tailwind CSS Utilities',
          'Icons: Lucide React Icons'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // SPLIT-SCREEN PROMPT',
        title: 'Input Split-Screen Hero Prompt',
        subtitle: 'Specify headline, waitlist form with hover states, and 3D illustration',
        type: 'prompt_box',
        subject: 'Modern SaaS hero with email waitlist form',
        parameters: 'React, Tailwind CSS, Lucide icons, dark mode',
        promptSnippet: 'Create a modern SaaS hero section using React, Tailwind CSS, and Lucide icons. Split screen: Left headline & waitlist form, Right 3D illustration...'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // LIVE CODE STREAMING',
        title: 'Watch Real-Time JSX Generation',
        subtitle: 'v0 streams clean TypeScript code and renders live component preview',
        type: 'quad_preview',
        gridLabels: ['JSX Code Stream', 'Live Component Preview', 'Tailwind Utility Tree', 'Interactive Form State'],
        selected: 'Code Stream Complete (25s)',
        actionBtn: 'Test Interactive Form'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // CHAT REFINEMENT',
        title: 'Refine Buttons & Micro-Interactions',
        subtitle: 'Use conversational chat to polish gradient glows and focus rings',
        type: 'studio_lighting',
        keyLight: 'Glow Accent: Blue/Indigo Gradient',
        rimLight: 'Focus Ring: 2px Electric Blue',
        fillCard: 'Button: Hover Scale & Loading State',
        backdrop: 'Dark Glassmorphism Backdrop'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // RESPONSIVE BREAKPOINTS',
        title: 'Verify Mobile & Tablet Breakpoints',
        subtitle: 'Toggle viewport controls to ensure hero stacks cleanly on phone screens',
        type: 'camera_optics',
        cameraModel: 'v0 Viewport Previewer',
        lens: 'Desktop (1280px) • Tablet (768px) • Mobile (375px)',
        aperture: 'Tailwind: flex-col lg:flex-row',
        shadow: 'Zero Horizontal Scroll Overflow'
      },
      {
        num: 6,
        stepTag: 'STEP 06 // PRODUCTION CODE EXPORT',
        title: 'Copy Clean React Code / CLI Add',
        subtitle: 'Copy component JSX or run `npx v0 add` to drop into Next.js project',
        type: 'export_verify',
        exportFormat: 'HeroSection.tsx (React + Tailwind)',
        bgVerify: 'CLI Command: npx v0 add saas-hero',
        verdict: 'READY TO PASTE INTO NEXT.JS PROJECT'
      }
    ]
  },

  tpl_web_2: {
    name: 'Creative Portfolio',
    category: 'Portfolio Sites',
    tool: 'Framer AI & v0',
    domain: 'framer.com/project',
    accentColor: '#EC4899',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // FRAMER AI CANVAS',
        title: 'Open Framer AI Studio Canvas',
        subtitle: 'Create a new project and click "Start with AI" in the top canvas toolbar',
        type: 'tool_select',
        toolName: 'Framer AI Web Builder',
        toolMeta: 'Canvas-Based AI Generation • Multi-Device Sync • Live Hosting',
        badge: 'FRAMER AI',
        details: [
          'Layout: Bento-Box Asymmetric Grid',
          'Breakpoints: Desktop, Tablet, Mobile Simultaneous',
          'Hosting: Built-In SSL & Custom Domain'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // BENTO-GRID PROMPT',
        title: 'Specify Bento-Box Grid Layout',
        subtitle: 'Prompt sections for Intro, Recent Projects, Skills, and Contact card',
        type: 'prompt_box',
        subject: 'Product designer portfolio with bento-grid layout',
        parameters: 'Minimalist, soft shadows, pastel color palette',
        promptSnippet: 'Design a personal portfolio website for a product designer using a modern bento-box grid layout. Sections: Intro, Projects, Skills, Contact...'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // MULTI-CANVAS GENERATION',
        title: 'Watch Real-Time Multi-Canvas Build',
        subtitle: 'Framer draws desktop, tablet, and mobile layouts simultaneously on canvas',
        type: 'quad_preview',
        gridLabels: ['Desktop Canvas 1200px', 'Tablet Canvas 810px', 'Mobile Canvas 390px', 'Global Design Tokens'],
        selected: 'All 3 Responsive Breakpoints Built',
        actionBtn: 'Inspect Layout Layers'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // PALETTE SHUFFLE',
        title: 'Shuffle Pastel Palettes & Fonts',
        subtitle: 'Click shuffle in Theme panel to cycle curated aesthetic color harmonies',
        type: 'camera_optics',
        cameraModel: 'Framer Theme Styler',
        lens: 'Theme: "Rose Quartz" / "Soft Sage"',
        aperture: 'Typography: Editorial Serif + Clean Sans',
        shadow: 'Card Radius: 24px Rounded Pill'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // ONE-CLICK PUBLISHING',
        title: 'Publish Instant Live Staging Link',
        subtitle: 'Double click text to add real projects, then click Publish for live web URL',
        type: 'export_verify',
        exportFormat: 'Live Production Website URL',
        bgVerify: 'Hosting: Global CDN + Free SSL',
        verdict: 'READY TO SHARE WITH CLIENTS & RECRUITERS'
      }
    ]
  },

  tpl_web_3: {
    name: 'Feature Grid',
    category: 'Landing Pages',
    tool: 'v0 by Vercel',
    domain: 'v0.dev/chat',
    accentColor: '#10B981',
    steps: [
      {
        num: 1,
        stepTag: 'STEP 01 // COMPONENT BUILDER',
        title: 'Open v0 Component Builder',
        subtitle: 'Prepare to generate an isolated, modular 3-column marketing feature grid',
        type: 'tool_select',
        toolName: 'v0 Component Workspace',
        toolMeta: 'Modular Components • Tailwind Hover States • Accessible Semantics',
        badge: 'FEATURE GRID',
        details: [
          'Columns: 3 Responsive Columns',
          'Components: Lucide Icons, Headings, Copy',
          'Interactivity: Hover Lift & Border Glow'
        ]
      },
      {
        num: 2,
        stepTag: 'STEP 02 // 3-COLUMN PROMPT',
        title: 'Input 3-Column Specifications',
        subtitle: 'Prompt Lucide icons, titles, short descriptions, and hover elevation cards',
        type: 'prompt_box',
        subject: '3-column feature grid for marketing landing page',
        parameters: 'Light mode, subtle borders, hover lift effects',
        promptSnippet: 'Create a 3-column feature grid for a marketing landing page. Each card: Lucide icon, title, description. Hover effects lift card slightly...'
      },
      {
        num: 3,
        stepTag: 'STEP 03 // REAL-TIME RENDERING',
        title: 'Stream Responsive Card Grid',
        subtitle: 'v0 writes semantic <section> and renders 3 feature cards with icon badges',
        type: 'quad_preview',
        gridLabels: ['Feature Card 1 (Speed)', 'Feature Card 2 (Security)', 'Feature Card 3 (Analytics)', 'Responsive CSS Container'],
        selected: 'Grid Rendered with Lucide Icons',
        actionBtn: 'Preview Card Hover States'
      },
      {
        num: 4,
        stepTag: 'STEP 04 // ICON CUSTOMIZATION',
        title: 'Customize Lucide Icons via Chat',
        subtitle: 'Chat follow-up to switch icons to Zap, ShieldCheck, and Cpu components',
        type: 'studio_lighting',
        keyLight: 'Icon 1: Zap (Performance)',
        rimLight: 'Icon 2: ShieldCheck (Enterprise Security)',
        fillCard: 'Icon 3: Cpu (AI Integration)',
        backdrop: 'Subtle Slate Card Backgrounds'
      },
      {
        num: 5,
        stepTag: 'STEP 05 // RESPONSIVE STACKING',
        title: 'Verify Mobile Vertical Stacking',
        subtitle: 'Check that grid seamlessly folds from 3 columns down to 1 column on mobile',
        type: 'camera_optics',
        cameraModel: 'v0 Responsive Inspector',
        lens: 'grid-cols-1 md:grid-cols-3 gap-6',
        aperture: 'Touch Margins: 24px Spacing',
        shadow: 'Smooth Hover Translate-Y (-4px)'
      },
      {
        num: 6,
        stepTag: 'STEP 06 // EXPORT & CODE INTEGRATION',
        title: 'Copy Clean Component Code',
        subtitle: 'Export FeatureGrid.tsx and import straight into your landing page',
        type: 'export_verify',
        exportFormat: 'FeatureGrid.tsx (React Component)',
        bgVerify: 'Dependencies: lucide-react, tailwindcss',
        verdict: 'READY TO IMPORT INTO LANDING PAGE'
      }
    ]
  }
};

// SVG Generator Helper Function
function generateSvgForStep(templateId, tplData, step) {
  const width = 800;
  const height = 500;
  const accent = tplData.accentColor || '#3B82F6';
  const domain = tplData.domain || 'awa.guide';

  // SVG Header & Defs
  let content = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050B17"/>
      <stop offset="50%" stop-color="#091428"/>
      <stop offset="100%" stop-color="#060D1E"/>
    </linearGradient>
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0E1E38" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#081426" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#142647" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0A162B" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .font-mono { font-family: "JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace; }
  </style>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" rx="20" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" rx="20" fill="none" stroke="#1E3A8A" stroke-width="1.5" stroke-opacity="0.5"/>

  <!-- Ambient Glow -->
  <ellipse cx="400" cy="180" rx="350" ry="140" fill="url(#glowGrad)"/>

  <!-- Top Browser / App Window Chrome -->
  <rect x="0" y="0" width="${width}" height="48" rx="20" fill="#0A152A" fill-opacity="0.9"/>
  <line x1="0" y1="48" x2="${width}" y2="48" stroke="#1E3A8A" stroke-width="1" stroke-opacity="0.6"/>

  <!-- Window Controls -->
  <circle cx="28" cy="24" r="6" fill="#EF4444" fill-opacity="0.85"/>
  <circle cx="48" cy="24" r="6" fill="#F59E0B" fill-opacity="0.85"/>
  <circle cx="68" cy="24" r="6" fill="#10B981" fill-opacity="0.85"/>

  <!-- Address / Tool Tab Pill -->
  <rect x="180" y="10" width="440" height="28" rx="8" fill="#0E1E38" stroke="#2563EB" stroke-width="0.8" stroke-opacity="0.4"/>
  <circle cx="200" cy="24" r="4" fill="${accent}"/>
  <text x="214" y="28" fill="#93C5FD" font-size="11" class="font-mono font-sans" opacity="0.85">${domain}</text>

  <!-- Top Right Tool Badge -->
  <rect x="660" y="12" width="116" height="24" rx="6" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="1" stroke-opacity="0.5"/>
  <text x="718" y="28" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle" class="font-sans">${tplData.category.toUpperCase()}</text>

  <!-- Step Header Banner -->
  <g transform="translate(32, 66)">
    <!-- Step Badge -->
    <rect x="0" y="0" width="190" height="22" rx="6" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1" stroke-opacity="0.7"/>
    <text x="10" y="15" fill="${accent}" font-size="10" font-weight="800" letter-spacing="1" class="font-mono">${step.stepTag}</text>

    <!-- Step Title -->
    <text x="0" y="44" fill="#F8FAFC" font-size="20" font-weight="800" class="font-sans">${step.title}</text>
    <!-- Step Subtitle -->
    <text x="0" y="64" fill="#94A3B8" font-size="12" class="font-sans">${step.subtitle}</text>
  </g>
`;

  // Visual Body based on step.type
  if (step.type === 'tool_select') {
    content += `
  <!-- Visual Type: Tool / Engine Selection -->
  <g transform="translate(32, 146)">
    <!-- Main Tool Workspace Card -->
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- Left Active Tool Showcase -->
    <rect x="24" y="24" width="320" height="272" rx="12" fill="url(#cardGrad)" stroke="${accent}" stroke-width="1.2"/>
    <rect x="44" y="44" width="56" height="56" rx="12" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1.5"/>
    <circle cx="72" cy="72" r="14" fill="${accent}"/>
    <path d="M66 72 L70 76 L78 68" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

    <text x="114" y="66" fill="#F8FAFC" font-size="16" font-weight="800" class="font-sans">${step.toolName}</text>
    <text x="114" y="86" fill="${accent}" font-size="11" font-weight="600" class="font-sans">${step.badge}</text>

    <line x1="44" y1="120" x2="320" y2="120" stroke="#1E3A8A" stroke-width="1"/>

    <!-- Config Details -->
    <g transform="translate(44, 136)">
      ${step.details.map((d, i) => `
        <g transform="translate(0, ${i * 38})">
          <circle cx="6" cy="10" r="3" fill="${accent}"/>
          <text x="18" y="14" fill="#E2E8F0" font-size="12" font-weight="500" class="font-sans">${d}</text>
        </g>
      `).join('')}
    </g>

    <!-- Right Configuration Drawer -->
    <rect x="368" y="24" width="344" height="272" rx="12" fill="#0A162B" stroke="#1E3A8A" stroke-width="1"/>
    
    <text x="392" y="54" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" class="font-mono">ENVIRONMENT STATUS</text>

    <!-- Active Indicator -->
    <rect x="392" y="70" width="296" height="42" rx="8" fill="#0F2447" stroke="#2563EB" stroke-width="1"/>
    <circle cx="414" cy="91" r="5" fill="#10B981"/>
    <text x="430" y="95" fill="#F8FAFC" font-size="12" font-weight="600" class="font-sans">Engine Ready: ${step.toolName}</text>

    <!-- Secondary Parameter Badges -->
    <text x="392" y="144" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" class="font-mono">RECOMMENDED SETTINGS</text>
    <rect x="392" y="158" width="140" height="32" rx="6" fill="#142647" stroke="#1E3A8A" stroke-width="1"/>
    <text x="462" y="178" fill="#93C5FD" font-size="11" font-weight="600" text-anchor="middle" class="font-sans">Mode: Text-to-Image</text>

    <rect x="548" y="158" width="140" height="32" rx="6" fill="#142647" stroke="#1E3A8A" stroke-width="1"/>
    <text x="618" y="178" fill="#93C5FD" font-size="11" font-weight="600" text-anchor="middle" class="font-sans">Tier: Pro / Standard</text>

    <!-- Bottom Launch Button -->
    <rect x="392" y="234" width="296" height="46" rx="10" fill="url(#accentGrad)"/>
    <text x="540" y="262" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" class="font-sans">Ready to Configure Workflow →</text>
  </g>
`;
  } else if (step.type === 'studio_lighting') {
    content += `
  <!-- Visual Type: Studio Lighting & Staging Schematic -->
  <g transform="translate(32, 146)">
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- Studio Floor Grid (Isometric Perspective) -->
    <g stroke="#1E3A8A" stroke-opacity="0.4" stroke-width="0.8">
      <line x1="120" y1="280" x2="360" y2="40"/>
      <line x1="200" y1="280" x2="440" y2="40"/>
      <line x1="280" y1="280" x2="520" y2="40"/>
      <line x1="160" y1="120" x2="520" y2="120"/>
      <line x1="120" y1="200" x2="560" y2="200"/>
    </g>

    <!-- Center Stage / Pedestal -->
    <ellipse cx="360" cy="180" rx="90" ry="40" fill="#0D2347" stroke="${accent}" stroke-width="1.5"/>
    <ellipse cx="360" cy="170" rx="70" ry="28" fill="#14325E" stroke="#60A5FA" stroke-width="1"/>
    <!-- Product Silhouette -->
    <rect x="340" y="90" width="40" height="70" rx="8" fill="#38BDF8" fill-opacity="0.8" stroke="#FFFFFF" stroke-width="1.2"/>
    <text x="360" y="130" fill="#0A162B" font-size="9" font-weight="800" text-anchor="middle" class="font-mono">HERO</text>

    <!-- Key Light Softbox (Top-Left) -->
    <g transform="translate(110, 60)">
      <polygon points="0,15 45,0 55,30 10,45" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="1.5"/>
      <line x1="45" y1="20" x2="280" y2="130" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.7"/>
      <circle cx="25" cy="22" r="5" fill="#FFFFFF"/>
      <text x="0" y="-8" fill="#93C5FD" font-size="11" font-weight="700" class="font-sans">${step.keyLight}</text>
    </g>

    <!-- Rim Light (Right Back) -->
    <g transform="translate(560, 70)">
      <circle cx="20" cy="20" r="16" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="1.5"/>
      <line x1="10" y1="30" x2="-140" y2="100" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.8"/>
      <text x="-40" y="-8" fill="#FCD34D" font-size="11" font-weight="700" class="font-sans">${step.rimLight}</text>
    </g>

    <!-- Fill Card / Reflector (Bottom-Right) -->
    <g transform="translate(480, 200)">
      <rect x="0" y="0" width="60" height="24" rx="4" transform="rotate(-25)" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-width="1.2"/>
      <text x="-10" y="44" fill="#E2E8F0" font-size="11" font-weight="600" class="font-sans">${step.fillCard}</text>
    </g>

    <!-- Bottom Legend Bar -->
    <rect x="24" y="260" width="688" height="38" rx="8" fill="#0A162B" stroke="#1E3A8A" stroke-width="1"/>
    <circle cx="44" cy="279" r="4" fill="${accent}"/>
    <text x="56" y="283" fill="#E2E8F0" font-size="11" font-weight="600" class="font-sans">Staging Target: ${step.backdrop}</text>
    <rect x="580" y="266" width="120" height="26" rx="6" fill="${accent}" fill-opacity="0.2"/>
    <text x="640" y="283" fill="#93C5FD" font-size="10" font-weight="700" text-anchor="middle" class="font-mono">CALIBRATED ✓</text>
  </g>
`;
  } else if (step.type === 'camera_optics') {
    content += `
  <!-- Visual Type: Camera & Optics Dial -->
  <g transform="translate(32, 146)">
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- Left Camera Spec Card -->
    <rect x="24" y="24" width="330" height="272" rx="12" fill="url(#cardGrad)" stroke="#1E3A8A" stroke-width="1"/>
    <text x="44" y="54" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" class="font-mono">CAMERA BODY & SENSOR</text>
    <text x="44" y="80" fill="#F8FAFC" font-size="17" font-weight="800" class="font-sans">${step.cameraModel}</text>

    <!-- Dial Graphic (Aperture / Zoom / Tilt) -->
    <g transform="translate(189, 175)">
      <!-- Outer Dial Ring -->
      <circle cx="0" cy="0" r="64" fill="#081426" stroke="#1E3A8A" stroke-width="6"/>
      <circle cx="0" cy="0" r="54" fill="#0F2447" stroke="${accent}" stroke-width="2"/>
      <!-- Tick Marks -->
      ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => `
        <line x1="0" y1="-54" x2="0" y2="-48" stroke="#60A5FA" stroke-width="1.5" transform="rotate(${deg})"/>
      `).join('')}
      <!-- Needle -->
      <line x1="0" y1="0" x2="28" y2="-28" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="7" fill="#EF4444"/>
      <text x="0" y="32" fill="#F8FAFC" font-size="11" font-weight="700" text-anchor="middle" class="font-mono">OPTICS</text>
    </g>

    <!-- Right Calibration Parameters -->
    <rect x="378" y="24" width="334" height="272" rx="12" fill="#0A162B" stroke="#1E3A8A" stroke-width="1"/>
    <text x="402" y="54" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" class="font-mono">OPTICAL PARAMETERS</text>

    <!-- Parameter Card 1 -->
    <rect x="402" y="70" width="286" height="54" rx="8" fill="#0F2242" stroke="#1E3A8A" stroke-width="1"/>
    <text x="418" y="92" fill="#94A3B8" font-size="10" font-weight="600" class="font-sans">Optics / Focal Length</text>
    <text x="418" y="112" fill="#38BDF8" font-size="13" font-weight="700" class="font-sans">${step.lens}</text>

    <!-- Parameter Card 2 -->
    <rect x="402" y="136" width="286" height="54" rx="8" fill="#0F2242" stroke="${accent}" stroke-width="1"/>
    <text x="418" y="158" fill="#94A3B8" font-size="10" font-weight="600" class="font-sans">Aperture / Motion Value</text>
    <text x="418" y="178" fill="#F8FAFC" font-size="13" font-weight="700" class="font-sans">${step.aperture}</text>

    <!-- Parameter Card 3 -->
    <rect x="402" y="202" width="286" height="54" rx="8" fill="#0F2242" stroke="#1E3A8A" stroke-width="1"/>
    <text x="418" y="224" fill="#94A3B8" font-size="10" font-weight="600" class="font-sans">Contact Shadow & Texture</text>
    <text x="418" y="244" fill="#A7F3D0" font-size="12" font-weight="600" class="font-sans">${step.shadow}</text>
  </g>
`;
  } else if (step.type === 'prompt_box') {
    content += `
  <!-- Visual Type: Prompt Customization Box -->
  <g transform="translate(32, 146)">
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- Prompt Editor Surface -->
    <rect x="24" y="24" width="688" height="210" rx="10" fill="#060E1C" stroke="#2563EB" stroke-width="1.2"/>

    <!-- Prompt Chrome Bar -->
    <rect x="24" y="24" width="688" height="32" rx="10" fill="#0D1E3A"/>
    <text x="40" y="45" fill="#93C5FD" font-size="11" font-weight="700" class="font-mono">PROMPT INPUT CONSOLE</text>
    <rect x="610" y="30" width="88" height="20" rx="4" fill="${accent}" fill-opacity="0.25"/>
    <text x="654" y="44" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle" class="font-mono">COPYABLE</text>

    <!-- Formatted Prompt Body -->
    <g transform="translate(44, 76)">
      <!-- Main text -->
      <text x="0" y="20" fill="#E2E8F0" font-size="13" class="font-mono" opacity="0.9">Studio setup: <tspan fill="${accent}" font-weight="700">[${step.subject}]</tspan></text>
      <text x="0" y="46" fill="#94A3B8" font-size="12" class="font-mono">Diffused softbox key lighting, pure seamless background, edge-to-edge tack-sharp...</text>
      <text x="0" y="72" fill="#CBD5E1" font-size="12" class="font-mono">Hasselblad 120mm macro prime, f/11 aperture, true-to-life surface textures.</text>

      <!-- Parameter highlight block -->
      <rect x="0" y="98" width="648" height="36" rx="6" fill="#0E2447" stroke="${accent}" stroke-width="1"/>
      <text x="14" y="121" fill="#F59E0B" font-size="12" font-weight="700" class="font-mono">Parameters: <tspan fill="#38BDF8">${step.parameters}</tspan></text>
    </g>

    <!-- Bottom Controls & Execute Action -->
    <g transform="translate(24, 250)">
      <rect x="0" y="0" width="220" height="42" rx="8" fill="#0E1E38" stroke="#1E3A8A" stroke-width="1"/>
      <circle cx="18" cy="21" r="5" fill="#10B981"/>
      <text x="32" y="25" fill="#E2E8F0" font-size="11" font-weight="600" class="font-sans">Subject Swapped: ✓ Ready</text>

      <!-- Token Meter -->
      <rect x="236" y="0" width="180" height="42" rx="8" fill="#0E1E38" stroke="#1E3A8A" stroke-width="1"/>
      <text x="250" y="25" fill="#94A3B8" font-size="11" class="font-mono">Prompt Length: ~420 chars</text>

      <!-- Execute Button -->
      <rect x="472" y="0" width="216" height="42" rx="8" fill="url(#accentGrad)"/>
      <text x="580" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" class="font-sans">Execute Prompt ↵</text>
    </g>
  </g>
`;
  } else if (step.type === 'quad_preview') {
    content += `
  <!-- Visual Type: 4-Quadrant Preview / Render Sequence -->
  <g transform="translate(32, 146)">
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- 4-Grid Preview Thumbnails -->
    <g transform="translate(24, 24)">
      ${step.gridLabels.map((lbl, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col * 230;
        const y = row * 128;
        const isSelected = idx === 0;
        return `
          <g transform="translate(${x}, ${y})">
            <rect x="0" y="0" width="216" height="116" rx="8" fill="#071224" stroke="${isSelected ? accent : '#1E3A8A'}" stroke-width="${isSelected ? '2' : '1'}"/>
            <!-- Placeholder Abstract Subject Artwork -->
            <ellipse cx="108" cy="58" rx="42" ry="24" fill="${accent}" fill-opacity="${0.15 + idx * 0.08}"/>
            <rect x="88" y="38" width="40" height="40" rx="6" fill="${isSelected ? '#38BDF8' : '#1E3A8A'}" fill-opacity="0.8"/>
            <!-- Label Tag -->
            <rect x="8" y="8" width="86" height="20" rx="4" fill="#0A162B" fill-opacity="0.8"/>
            <text x="14" y="22" fill="${isSelected ? '#F8FAFC' : '#94A3B8'}" font-size="10" font-weight="700" class="font-mono">${lbl}</text>
            ${isSelected ? `
              <circle cx="196" cy="18" r="7" fill="${accent}"/>
              <path d="M192 18 L195 21 L200 15" stroke="#FFFFFF" stroke-width="2" fill="none"/>
            ` : ''}
          </g>
        `;
      }).join('')}
    </g>

    <!-- Right Control Panel -->
    <g transform="translate(500, 24)">
      <rect x="0" y="0" width="212" height="272" rx="10" fill="#0A162B" stroke="#1E3A8A" stroke-width="1"/>
      <text x="16" y="28" fill="#94A3B8" font-size="10" font-weight="700" letter-spacing="1" class="font-mono">SELECTION & UPSCALING</text>

      <rect x="16" y="44" width="180" height="48" rx="6" fill="#0F2447" stroke="${accent}" stroke-width="1"/>
      <text x="28" y="66" fill="#93C5FD" font-size="11" font-weight="700" class="font-sans">Selected Variant</text>
      <text x="28" y="82" fill="#F8FAFC" font-size="11" class="font-sans">${step.selected}</text>

      <!-- U1-U4 Buttons -->
      <g transform="translate(16, 110)">
        <rect x="0" y="0" width="38" height="32" rx="6" fill="${accent}" stroke="${accent}" stroke-width="1"/>
        <text x="19" y="20" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle" class="font-mono">U1</text>

        <rect x="46" y="0" width="38" height="32" rx="6" fill="#142647" stroke="#1E3A8A" stroke-width="1"/>
        <text x="65" y="20" fill="#94A3B8" font-size="11" font-weight="800" text-anchor="middle" class="font-mono">U2</text>

        <rect x="92" y="0" width="38" height="32" rx="6" fill="#142647" stroke="#1E3A8A" stroke-width="1"/>
        <text x="111" y="20" fill="#94A3B8" font-size="11" font-weight="800" text-anchor="middle" class="font-mono">U3</text>

        <rect x="138" y="0" width="38" height="32" rx="6" fill="#142647" stroke="#1E3A8A" stroke-width="1"/>
        <text x="157" y="20" fill="#94A3B8" font-size="11" font-weight="800" text-anchor="middle" class="font-mono">U4</text>
      </g>

      <!-- Primary Action -->
      <rect x="16" y="210" width="180" height="44" rx="8" fill="url(#accentGrad)"/>
      <text x="106" y="237" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle" class="font-sans">${step.actionBtn}</text>
    </g>
  </g>
`;
  } else if (step.type === 'export_verify') {
    content += `
  <!-- Visual Type: Export & Verification Inspection -->
  <g transform="translate(32, 146)">
    <rect x="0" y="0" width="736" height="320" rx="14" fill="url(#panelGrad)" stroke="#1E3A8A" stroke-width="1.2"/>

    <!-- Left High-Resolution Master Display -->
    <rect x="24" y="24" width="360" height="272" rx="12" fill="#060F1E" stroke="${accent}" stroke-width="1.2"/>
    <!-- Simulated Product Render on Clean Background -->
    <ellipse cx="204" cy="210" rx="110" ry="32" fill="#0A1E3C" opacity="0.6"/>
    <rect x="164" y="70" width="80" height="130" rx="14" fill="url(#cardGrad)" stroke="#60A5FA" stroke-width="1.5"/>
    <circle cx="204" cy="110" r="18" fill="${accent}" fill-opacity="0.3"/>
    
    <!-- Eyedropper / Quality Check Callout -->
    <rect x="40" y="40" width="160" height="30" rx="6" fill="#0A162B" stroke="#10B981" stroke-width="1"/>
    <circle cx="54" cy="55" r="4" fill="#10B981"/>
    <text x="66" y="59" fill="#A7F3D0" font-size="10" font-weight="700" class="font-mono">${step.bgVerify}</text>

    <!-- Right Quality Report & Download -->
    <rect x="408" y="24" width="304" height="272" rx="12" fill="#0A162B" stroke="#1E3A8A" stroke-width="1"/>
    <text x="430" y="54" fill="#94A3B8" font-size="10" font-weight="700" letter-spacing="1" class="font-mono">ASSET SPECIFICATIONS</text>

    <!-- Spec 1 -->
    <rect x="430" y="70" width="260" height="46" rx="8" fill="#0E2242" stroke="#1E3A8A" stroke-width="1"/>
    <text x="444" y="90" fill="#94A3B8" font-size="10" class="font-sans">Output Resolution</text>
    <text x="444" y="106" fill="#F8FAFC" font-size="12" font-weight="700" class="font-sans">${step.exportFormat}</text>

    <!-- Spec 2: Verification Status -->
    <rect x="430" y="126" width="260" height="46" rx="8" fill="#063228" stroke="#10B981" stroke-width="1"/>
    <circle cx="448" cy="149" r="6" fill="#10B981"/>
    <text x="462" y="153" fill="#D1FAE5" font-size="11" font-weight="700" class="font-sans">${step.verdict}</text>

    <!-- Download Master Button -->
    <rect x="430" y="224" width="260" height="48" rx="10" fill="url(#accentGrad)"/>
    <path d="M540 242 L540 254 M535 249 L540 254 L545 249" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="560" y="253" fill="#FFFFFF" font-size="13" font-weight="700" class="font-sans">Download Final Asset</text>
  </g>
`;
  }

  content += `
</svg>
`;

  return content;
}

function sanitizeXml(content) {
  return content
    .replace(/<(?=\s|\d)/g, '&lt;')
    .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
}

// Main generation runner
function main() {
  console.log('Starting guidance SVG generation for all templates...');
  let totalGenerated = 0;

  for (const [templateId, tplData] of Object.entries(templateGuidanceData)) {
    const tplFolder = path.join(publicDir, templateId);
    if (!fs.existsSync(tplFolder)) {
      fs.mkdirSync(tplFolder, { recursive: true });
    }

    for (const step of tplData.steps) {
      const fileName = `step-${step.num}.svg`;
      const filePath = path.join(tplFolder, fileName);
      const svgCode = sanitizeXml(generateSvgForStep(templateId, tplData, step));
      fs.writeFileSync(filePath, svgCode.trim(), 'utf8');
      totalGenerated++;
    }
    console.log(`Generated ${tplData.steps.length} guidance SVGs for ${templateId} (${tplData.name})`);
  }

  console.log(`\nDONE! Total ${totalGenerated} guidance SVGs successfully created in ${publicDir}`);
}

main();
