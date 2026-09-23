import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDataPath = path.resolve(__dirname, '../src/lib/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// 1. Update GuidanceStep interface
const oldInterface = `export interface GuidanceStep {
  step: number;
  text: string;
}`;

const newInterface = `export interface GuidanceStep {
  step: number;
  title: string;
  description: string;
  image: string;
  tip?: string;
  actionText?: string;
  actionUrl?: string;
  text?: string;
}`;

if (content.includes(oldInterface)) {
  content = content.replace(oldInterface, newInterface);
  console.log('Updated GuidanceStep interface');
} else {
  console.log('GuidanceStep interface already updated or mismatch');
}

// 2. Define guidance data for all 13 templates
const guidanceMap = {
  tpl_1: `[
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
            ]`,

  tpl_2: `[
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
            ]`,

  tpl_3: `[
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
            ]`,

  tpl_4: `[
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
            ]`,

  tpl_video_1: `[
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
                description: 'Click the "Image" tab above the prompt box and upload a clean studio still of your product on a pedestal (generated from template tpl_1).',
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
            ]`,

  tpl_video_2: `[
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
            ]`,

  tpl_video_3: `[
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
            ]`,

  tpl_slide_1: `[
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
                description: 'Click "Generate outline" to view Gamma\\'s proposed 10-slide flow. You can tweak slide titles or reorder cards before the final deck is generated.',
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
            ]`,

  tpl_slide_2: `[
              {
                step: 1,
                title: 'Open Gamma Executive Report Preset',
                description: 'Open gamma.app, create a new presentation, and select the executive report layout designed for monthly data reporting and stakeholder reviews.',
                image: '/images/guidance/tpl_slide_2/step-1.svg',
                tip: 'Gamma\\'s data layout cards are ideal for side-by-side metric comparisons.',
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
                tip: 'Use Gamma\\'s native chart editor to adjust bar and line values directly inside the slide.',
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
            ]`,

  tpl_slide_3: `[
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
                tip: 'Dedicating 3 distinct slides to "The Work" ensures high-res visual mockups aren\\'t cramped.',
                text: 'Input narrative case study chapters with 3 dedicated work slides.'
              },
              {
                step: 3,
                title: 'Select Brutalist High-Contrast Theme',
                description: 'Choose a striking high-contrast theme (such as "Void" or "Mono") featuring deep black backgrounds, stark white type, and razor-sharp borders.',
                image: '/images/guidance/tpl_slide_3/step-3.svg',
                tip: 'Brutalist black-and-white palettes prevent presentation styling from clashing with your client\\'s brand colors.',
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
            ]`,

  tpl_web_1: `[
              {
                step: 1,
                title: 'Open v0 Prompt Studio',
                description: 'Navigate to v0.dev in your browser and log in with your GitHub or Vercel account. v0 is the industry standard for generative React and Tailwind components.',
                image: '/images/guidance/tpl_web_1/step-1.svg',
                tip: 'v0 produces clean, production-ready TypeScript code with zero third-party runtime bloat.',
                actionText: 'Open v0 by Vercel',
                actionUrl: 'https://v0.dev',
                text: 'Open v0.dev and log in to start generative React component creation.'
              },
              {
                step: 2,
                title: 'Input Split-Screen Architecture Prompt',
                description: 'Paste the AWA SaaS Hero prompt specifying split-screen layout: left headline + waitlist form, right 3D abstract graphic placeholder, and dark mode glassmorphism.',
                image: '/images/guidance/tpl_web_1/step-2.svg',
                tip: 'Mentioning "Lucide icons" and "Inter font" ensures v0 uses modern production component libraries.',
                text: 'Paste the split-screen hero prompt specifying React and Tailwind CSS.'
              },
              {
                step: 3,
                title: 'Generate Live Interactive Component',
                description: 'Press Enter. v0 streams the JSX code and renders a live, interactive preview on the right-hand canvas in ~20 seconds.',
                image: '/images/guidance/tpl_web_1/step-3.svg',
                tip: 'You can test typing in the waitlist input and clicking the button right inside the preview iframe.',
                text: 'Watch v0 stream TypeScript code and render live component preview.'
              },
              {
                step: 4,
                title: 'Refine Micro-Interactions via Chat',
                description: 'Use the conversational chat bar at the bottom to tweak nuances (e.g. "Add a glowing blue gradient border around the email input and improve mobile padding").',
                image: '/images/guidance/tpl_web_1/step-4.svg',
                tip: 'Prompting one refinement at a time produces clean, isolated git-like code diffs.',
                text: 'Use chat follow-ups to polish gradient glows and hover states.'
              },
              {
                step: 5,
                title: 'Verify Mobile & Tablet Breakpoints',
                description: 'Toggle the responsive viewport controls at the top of the v0 previewer to ensure the hero section stacks seamlessly on mobile (375px) and tablet (768px).',
                image: '/images/guidance/tpl_web_1/step-5.svg',
                tip: 'Look for flex-col lg:flex-row classes in the Tailwind markup to confirm responsive behavior.',
                text: 'Toggle viewport preview controls to verify mobile vertical stacking.'
              },
              {
                step: 6,
                title: 'Copy Clean React Code / CLI Add',
                description: 'Click the "< > Code" tab in the top right, copy the clean React/Tailwind component, or install directly using the npx v0 add terminal CLI.',
                image: '/images/guidance/tpl_web_1/step-6.svg',
                tip: 'The component has zero external runtime overhead and drops directly into Next.js App Router.',
                actionText: 'Copy React Component',
                text: 'Copy the production React code or add via npx v0 command into your repo.'
              }
            ]`,

  tpl_web_2: `[
              {
                step: 1,
                title: 'Open Framer AI Studio Canvas',
                description: 'Go to framer.com, log into your account, create a new blank project, and click "Start with AI" in the canvas toolbar.',
                image: '/images/guidance/tpl_web_2/step-1.svg',
                tip: 'Framer AI generates full responsive canvas layouts with built-in breakpoints for desktop, tablet, and phone.',
                actionText: 'Open Framer AI',
                actionUrl: 'https://framer.com',
                text: 'Open Framer and launch AI Generation mode on a new canvas.'
              },
              {
                step: 2,
                title: 'Specify Bento-Box Grid Layout Prompt',
                description: 'Enter the AWA Creative Portfolio prompt detailing sections for Introduction, Recent Projects, Skills, and a Contact form in a modern bento-grid structure.',
                image: '/images/guidance/tpl_web_2/step-2.svg',
                tip: 'Bento-box layouts combine cards of differing aspect ratios into an eye-catching asymmetric grid.',
                text: 'Enter bento-grid prompt detailing project showcase and skills cards.'
              },
              {
                step: 3,
                title: 'Watch Multi-Canvas Generation',
                description: 'Press Enter and watch Framer generate all three responsive breakpoints (Desktop 1200px, Tablet 810px, Mobile 390px) simultaneously on canvas.',
                image: '/images/guidance/tpl_web_2/step-3.svg',
                tip: 'Framer configures real flexbox and CSS grid stacks automatically.',
                text: 'Watch Framer generate desktop, tablet, and mobile layouts in parallel.'
              },
              {
                step: 4,
                title: 'Shuffle Pastel Palettes & Typography',
                description: 'Open the Theme properties drawer on the right sidebar and click the shuffle icon to test curated pastel color palettes and modern font pairings.',
                image: '/images/guidance/tpl_web_2/step-4.svg',
                tip: 'You can adjust color tokens globally with one click across the entire site.',
                text: 'Shuffle theme palette to discover pastel color harmonies and typography.'
              },
              {
                step: 5,
                title: 'Publish Instant Live Staging Link',
                description: 'Double-click any text or image card to replace placeholder content with your design case studies, then hit "Publish" for an instant live URL.',
                image: '/images/guidance/tpl_web_2/step-5.svg',
                tip: 'Framer sites include free hosting, SSL, and custom domain support.',
                actionText: 'Publish Live Site',
                text: 'Insert your case studies and publish to a live production web URL.'
              }
            ]`,

  tpl_web_3: `[
              {
                step: 1,
                title: 'Access v0 Component Builder',
                description: 'Open v0.dev in your browser and prepare to generate an isolated, reusable 3-column marketing feature grid.',
                image: '/images/guidance/tpl_web_3/step-1.svg',
                tip: 'Building isolated components in v0 makes them modular and easy to integrate into existing codebases.',
                actionText: 'Open v0 by Vercel',
                actionUrl: 'https://v0.dev',
                text: 'Access v0.dev component builder for modular component generation.'
              },
              {
                step: 2,
                title: 'Input 3-Column Specifications Prompt',
                description: 'Paste the AWA Feature Grid prompt defining a 3-column layout, subtle borders, Lucide icon badges, and smooth hover elevation cards.',
                image: '/images/guidance/tpl_web_3/step-2.svg',
                tip: 'Mentioning "hover:shadow-lg hover:-translate-y-1 transition-all" generates natural micro-interactions.',
                text: 'Paste prompt specifying 3 columns, Lucide icons, and hover lift effects.'
              },
              {
                step: 3,
                title: 'Stream Responsive Component Grid',
                description: 'Press Enter to stream the component. v0 writes clean Tailwind utility classes and renders the 3-column card grid in real time.',
                image: '/images/guidance/tpl_web_3/step-3.svg',
                tip: 'Cards automatically use semantic <section> and <h3> tags for optimal SEO hierarchy.',
                text: 'Watch v0 stream Tailwind markup and render interactive feature cards.'
              },
              {
                step: 4,
                title: 'Customize Lucide Icons via Chat',
                description: 'Send a quick conversational follow-up to customize icons to match your SaaS features (e.g. "Use ShieldCheck, Zap, and Cpu icons for the cards").',
                image: '/images/guidance/tpl_web_3/step-4.svg',
                tip: 'v0 will automatically import and configure the exact Lucide icon components.',
                text: 'Customize Lucide icon components via quick conversational chat.'
              },
              {
                step: 5,
                title: 'Verify Responsive Card Stacking',
                description: 'Toggle between desktop (3 columns) and mobile viewports to confirm cards stack vertically with comfortable touch margins.',
                image: '/images/guidance/tpl_web_3/step-5.svg',
                tip: 'Tailwind\\'s grid grid-cols-1 md:grid-cols-3 gap-6 ensures zero layout overflow on small screens.',
                text: 'Confirm clean 1-column mobile stack versus 3-column desktop layout.'
              },
              {
                step: 6,
                title: 'Export & Integrate Component',
                description: 'Click the Code tab, copy the clean React code snippet, and paste it into your application\\'s components directory.',
                image: '/images/guidance/tpl_web_3/step-6.svg',
                tip: 'Requires no extra CSS configuration beyond Tailwind and lucide-react.',
                actionText: 'Copy Component Code',
                text: 'Copy production React code and import into your landing page.'
              }
            ]`
};

// Replace guidance in each template block
for (const [id, guidanceStr] of Object.entries(guidanceMap)) {
  // Regex to find template by id, then find its guidance: [...]
  // Pattern: id: 'id'[\s\S]*?guidance:\s*\[[\s\S]*?\]
  const regex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?guidance:\\s*)\\[[\\s\\S]*?\\n\\s*\\]`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `$1${guidanceStr}`);
    console.log(`Updated guidance for ${id}`);
  } else {
    console.error(`Could not match guidance for ${id}`);
  }
}

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('Successfully saved mockData.ts');
