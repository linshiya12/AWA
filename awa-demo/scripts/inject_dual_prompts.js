const fs = require('fs');

const PROMPTS = {
  tpl_1: {
    uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: Shot on Hasselblad H6D-100c, 120mm macro prime lens, f/11 aperture for edge-to-edge tack-sharp focus, ISO 64, 1/160s shutter speed. Neutral commercial color profile, true-to-life surface micro-textures, zero chromatic aberration, natural soft contact shadow directly beneath base.
Studio Environment: Seamless pure white infinity cove background (hex #FFFFFF), no visible horizon line or floor seam.
Lighting Architecture: Three-point softbox studio lighting — key light at 45-degree camera left through a 120cm octabox, rim light from camera right behind for crisp rim highlight and edge separation, 2:1 white foam fill card camera right for subtle shadow recovery.
Parameters: --ar 1:1 --v 6.0 --style raw --q 2`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Luxury cylindrical ceramic tumbler with tactile matte glaze, centered macro composition.
Commercial Purpose: Clean hero asset suitable for Amazon, Shopify, or print catalogs requiring 100% white background (#FFFFFF) isolation and compliant Amazon hero standards.
Audience & Tone: Discerning modern consumers looking for minimalist home goods and high-end ceramics. Clean, premium, uncluttered, and trustworthy.
Content Requirements: The product must be centered, upright, fully isolated without cropping, displaying clean rim geometry, subtle matte reflections, and grounded contact shadows.`
  },
  tpl_4: {
    uiPrompt: `[UI & OPTICS PROMPT]
Camera & Perspective: Phase One XF 100MP, Schneider Kreuznach 80mm LS f/2.8 at f/10 for corner-to-corner clarity, zero barrel distortion, ISO 50. Perfectly level 90-degree overhead bird's-eye perspective (orthogonal knolling).
Surface & Colors: Matte light-grey concrete surface (#E5E7EB), muted slate, rich cognac leather, warm brass accents, and neutral white linen.
Lighting Architecture: Large overhead diffused softbox creating gentle, natural directional cast shadows downward without harsh specular hotspots.
Parameters: --ar 4:3 --v 6.0 --style raw --q 2`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Items: Premium everyday carry essentials: full-grain cognac leather notebook, matte black brass rollerball pen, minimalist stainless steel mechanical timepiece with leather strap, raw linen textile swatch, and artisanal ceramic espresso cup.
Composition & Purpose: Geometric knolling layout with intentional 25mm negative spacing between objects for editorial lookbooks, design blogs, and lifestyle brand storytelling.
Audience & Tone: Creative professionals, architects, and industrial design enthusiasts valuing precision craftsmanship, curated utility, and organized calm.`
  },
  tpl_2: {
    uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: Leica SL2, Summilux-SL 50mm f/1.4 ASPH at f/2.2 for cinematic shallow depth of field, creamy background bokeh, ISO 100, 1/250s. Medium-close angle, rule-of-thirds framing, product held at chest height in sharp focus.
Lighting Architecture: Golden hour morning sunlight at 3800K entering from camera left through sheer curtains, soft diffused bounce fill card camera right for delicate facial and mug shadow detail.
Palette & Atmosphere: Warm ivory, natural oak honey tones, soft terracotta glaze, and muted sage green with gentle morning haze.
Parameters: --ar 4:5 --v 6.0 --style raw`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Authentic human hands holding a handcrafted textured ceramic coffee mug with both hands, seated near a sunlit window at a honed white oak breakfast bar in a modern Scandinavian kitchen.
Purpose & Narrative: Editorial in-context photograph capturing mindful morning rituals, warmth, and daily grounding for brand lookbooks and digital lifestyle campaigns.
Audience & Tone: Contemporary lifestyle consumers, specialty coffee lovers, and interior design advocates seeking cozy authenticity and tactile connection.`
  },
  tpl_3: {
    uiPrompt: `[UI & OPTICS PROMPT]
Camera & Optics: ARRI Alexa Mini LF, Zeiss Supreme Prime 50mm T1.5 at T2.8, cinematic anamorphic horizontal streak flares, edge sharpness, zero optical distortion.
Lighting Architecture: Warm 3200K tungsten backlight creating crisp golden rim lighting around the bottle silhouette, soft frontal 5600K diffused fill card revealing rich label typography without glare.
Color Palette: Deep royal crimson (#881337), champagne gold (#D4AF37), forest evergreen, and warm amber bokeh particles.
Parameters: --ar 16:9 --v 6.0 --style raw --q 2`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Luxury cosmetic glass flacon set amidst a lavish festive holiday composition on a dark midnight velvet drape, accented by frosted pine sprigs, champagne gold satin ribbon loops, and delicate crystal snowflakes.
Commercial Purpose: High-converting seasonal advertising banner for holiday e-commerce sales, email headers, and social announcements.
Composition Layout: Asymmetrical composition with product anchored in the left third, leaving soft, uncluttered negative space in the right two-thirds for typography overlay.
Audience & Tone: Holiday gift shoppers and luxury beauty consumers looking for celebratory indulgence and premium gifting.`
  },
  tpl_img_social_1: {
    uiPrompt: `[UI & OPTICS PROMPT]
Visual Rendering & Style: FLUX.1 Pro photorealistic render, 8k resolution, razor-sharp digital display typography, ray-traced glass refractions, zero noise artifacts.
Studio Environment: Deep matte obsidian (#0B0F17) void with centered floating frosted acrylic glassmorphism pedestal.
Lighting Architecture: Dual-tone cybernetic studio lighting: electric indigo (#4F46E5) key light from camera left and neon cyan (#38BDF8) rim light from behind right, casting soft specular reflections on frosted glass.
Parameters: Centered square 1:1, Guidance Scale 4.5, Steps 28, Resolution 1024x1024`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Next-generation futuristic smartwatch with an illuminated holographic UI dial displaying biometric telemetry metrics.
Purpose & Channel: Scroll-stopping social media launch graphic for Instagram, X/Twitter, and LinkedIn designed to maximize engagement and early-access preorders.
Audience & Tone: Early adopters, tech professionals, and wearable device enthusiasts who value cutting-edge industrial hardware, cyberpunk aesthetics, and sleek digital design.`
  },
  tpl_video_1: {
    uiPrompt: `[UI & MOTION PROMPT]
Camera Movement & Trajectory: Static level eye-line camera with subtle continuous optical zoom (+1.1x magnification) locked onto the golden cap. Horizontal circular pedestal orbital rotation at constant 90 deg/sec angular velocity with zero wobble.
Timing & Frame Rate: 4.0 seconds duration, seamless loop point at frame 96 (24fps cadence).
Visual Style: High-end luxury television advertisement, sharp metallic reflections, anamorphic glint flares on bottle facets, polished black marble turntable surface.
Aspect Ratio: 16:9 widescreen (1920x1080).`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Premium geometric perfume flacon with embossed metallic branding and multifaceted crystal glass body.
Commercial Intent: Seamless product video loop for high-converting e-commerce PDP hero sections, digital billboards, and luxury retail displays.
Audience & Tone: Discerning luxury fragrance buyers seeking elegance, sensory sophistication, and exquisite industrial design.
Ending Criteria: Completes exact 360-degree rotation, aligning seamlessly back to frame 1 for an imperceptible infinite loop.`
  },
  tpl_video_2: {
    uiPrompt: `[UI & MOTION PROMPT]
Camera & Time Dilation: Micro slow-motion dolly forward (-camera zoom in 1.2), tack-sharp focus locked on water droplets. 3.5 seconds duration, ultra-slow 1000fps time-dilation aesthetic rendered at 24fps playback.
Visual Physics: Pristine crystalline liquid physics, suspended micro-droplets with surface tension, backlit golden morning sunbeams refracting through droplets.
Aspect Ratio: 16:9 widescreen (1920x1080).`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: Crystal-clear hydrating cosmetics skincare vial resting on a submerged smooth river stone in a shallow pure water basin.
Commercial Narrative: Illustrates deep hydration, purity, and organic bio-actives for a breakthrough skincare product launch.
Audience & Tone: Clean beauty enthusiasts, dermatological skincare consumers, and wellness shoppers looking for refreshing, pristine efficacy.
Ending State: Droplets settle into calm surface ripples, leaving cosmetics flacon pristine with no water spots on label.`
  },
  tpl_video_3: {
    uiPrompt: `[UI & MOTION PROMPT]
Camera Movement & Optics: Slow vertical tilt-up (Tilt Up +2.0) combined with smooth optical rack focus shifting from misty foreground foliage to illuminated gold-embossed brand label.
Visual Style: Moody cinematic film stock, anamorphic streak flare, soft morning crepuscular light beams cutting through greenhouse mist.
Timing & Cadence: 5.0 seconds duration, dramatic build-up cadence at 24fps.
Aspect Ratio: 9:16 vertical full-screen smartphone format (1080x1920).`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject & Setting: Artisanal organic botanical skincare elixir with amber liquid inside a frosted dropper bottle, situated in a misty, lush greenhouse surrounded by monstera foliage.
Campaign Goal: Vertical mobile video hook for TikTok, Instagram Reels, and YouTube Shorts to build anticipation ahead of a seasonal product drop.
Audience & Tone: Eco-luxury consumers and wellness enthusiasts captivated by botanical ingredients, sensory tranquility, and artisanal craftsmanship.`
  },
  tpl_video_4: {
    uiPrompt: `[UI & MOTION PROMPT]
Camera Kinetics & Velocity: Rapid horizontal camera whip-pan (-camera pan right 4.0) transitioning into dynamic 180-degree orbital arc, freezing for a 0.5s speed-ramp at peak trajectory.
Visual Style: Electric ultraviolet (#8B5CF6) and laser cyan (#06B6D4) volumetric neon lighting, motion blur on extremities, subterranean wet tarmac with glowing embers.
Timing & FPS: 4.0 seconds duration, fast-paced electronic rhythm, 60fps ultra-fluid motion cadence.
Aspect Ratio: 9:16 vertical smartphone format (1080x1920).`,
    contextPrompt: `[CONTEXT & SUBJECT PROMPT]
Subject: High-tech cybernetic athletic shoe propelling forward, flexing and twisting in mid-air with vibrant violet particle trails exploding from the cushioned sole.
Channel & Objective: Viral social ad hook for Gen-Z sneakerheads, fitness creators, and streetwear enthusiasts on TikTok and Instagram Reels.
Audience & Tone: Streetwear collectors and performance athletes drawn to explosive energy, futuristic aesthetics, and bold speed-ramped cinematography.`
  },
  tpl_slide_1: {
    uiPrompt: `[UI & PRESENTATION PROMPT]
Layout & Architecture: 10-slide responsive presentation deck built on Gamma App. Card-based layout with clean metric callout chips and split-screen diagrams.
Visual Style: Modern institutional dark theme, deep sapphire blue (#1D4ED8) accents on slate (#0F172A), typography in Inter & Plus Jakarta Sans, high-contrast numerical highlights ($1.2M ARR, 142% NRR).
Aspect Ratio: 16:9 widescreen presentation mode.`,
    contextPrompt: `[CONTEXT & NARRATIVE PROMPT]
Topic & Company: Seed Capital Investment Pitch Deck for 'Vektor AI' — an enterprise agentic creative workflow automation platform.
Audience: Early-stage venture capital partners and angel syndicates investing in enterprise AI infrastructure.
Key Narrative & Ask: Secure a $3.5M Seed round by presenting market timing ($42B TAM by 2028), multi-modal routing architecture, 85% gross margins, and founder credentials from DeepMind and Stripe.
Content Structure: 1. Title/Value Prop, 2. Problem Sprawl, 3. Unified Solution, 4. Architecture, 5. Market TAM, 6. Unit Economics, 7. Traction Proof, 8. Moat, 9. Founding Team, 10. The Ask ($3.5M).`
  },
  tpl_slide_3: {
    uiPrompt: `[UI & PRESENTATION PROMPT]
Visual System & Theme: Sleek editorial dark mode, emerald green (#10B981) performance accents on matte obsidian (#0B0F17), typography in Space Grotesk and Inter.
Card Structure: 8-card slide deck with high-contrast before/after KPI comparison cards, biometrics login mockup frames, and an executive quote card block.
Aspect Ratio: 16:9 widescreen presentation format.`,
    contextPrompt: `[CONTEXT & NARRATIVE PROMPT]
Topic & Engagement: Digital Transformation & Performance Overhaul Agency Case Study for 'Solaris Global' fintech platform.
Target Audience: Enterprise CMOs, VP of Product, and procurement directors evaluating premium digital design agencies.
Narrative & Business Proof: How an agency redesign reduced mobile onboarding friction from 62% drop-off to a +280% completion surge, generating $1.4B in transaction volume and closing $250k enterprise client retainers.`
  },
  tpl_slide_2: {
    uiPrompt: `[UI & PRESENTATION PROMPT]
Visual System: Clean executive white or deep navy, vibrant violet (#7C3AED) and cyan (#06B6D4) data visualization charts, clean tables, Plus Jakarta Sans typography.
Slide Components: KPI dashboard cards (CAC $42, LTV:CAC 4.8x), multi-channel attribution bar charts, funnel drop-off diagrams, and budget reallocation matrix tables.
Aspect Ratio: 16:9 widescreen.`,
    contextPrompt: `[CONTEXT & NARRATIVE PROMPT]
Topic & Scope: Q3/Q4 Omni-Channel Growth Marketing Strategy & Performance Review Presentation for executive leadership.
Audience: C-suite executives, VP of Marketing, and cross-functional department heads.
Goal & Strategy: Present customer acquisition efficiency (CAC down 24%), channel performance attribution across Meta/Google/LinkedIn, and secure an H2 budget reallocation of $850k towards high-yield generative video creatives.`
  },
  tpl_slide_edu_1: {
    uiPrompt: `[UI & PRESENTATION PROMPT]
Visual Design: Educational masterclass presentation layout with clean split cards, interactive breakout exercise callouts, monospace syntax blocks, and diagnostic audit checklists.
Palette: Deep navy backdrop (#0B1120) with electric blue (#2563EB) accents and crisp white typographic hierarchy.
Aspect Ratio: 16:9 widescreen presentation.`,
    contextPrompt: `[CONTEXT & NARRATIVE PROMPT]
Topic & Curriculum: Masterclass training presentation on Generative AI prompt architecture, token weighting formulas, and optical camera physics.
Audience: Senior creative directors, brand designers, and AI engineers transitioning from naive text prompts to deterministic engineering frameworks.
Learning Objectives: Master the 5-layer prompt stack (Subject, Setting, Optics, Lighting, Flags), diagnose common artifact causes, and standardize team-wide generation benchmarks.`
  }
};

let code = fs.readFileSync('./src/lib/mockData.ts', 'utf-8');

for (const [id, prompts] of Object.entries(PROMPTS)) {
  const idRegex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?models:\\s*\\[[^\\]]+\\],)`);
  if (!idRegex.test(code)) {
    console.error('Could not find template block for', id);
    continue;
  }
  code = code.replace(idRegex, (match, p1) => {
    return `${p1}\n            uiPrompt: ${JSON.stringify(prompts.uiPrompt)},\n            contextPrompt: ${JSON.stringify(prompts.contextPrompt)},`;
  });
  console.log('Updated', id);
}

fs.writeFileSync('./src/lib/mockData.ts', code, 'utf-8');
console.log('Successfully updated mockData.ts');
