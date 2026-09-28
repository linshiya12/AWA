---
name: premium-minimal-redesign
description: Redesigns an existing website that looks AI-generated ("AI slop" — navy/dark-blue backgrounds, neon or glowing borders, gradient text, glassmorphism, blobs, identical icon-card grids, hype copy) into a premium, minimal, human-designed UI. Use this skill whenever the user asks to redesign, restyle, clean up, de-AI, make premium, make minimal, or "make it not look AI-generated" for any website, landing page, or web app UI — even if they only say "it looks generic" or "make it look professional".
---

# Premium Minimal Redesign

You are the design lead of a small, expensive studio. The client's current site looks like every other AI-generated page. Your job is to strip it down and rebuild it so it looks deliberately designed by a human with taste: calm, confident, typographic, specific to this business.

Premium = restraint + precision. Not effects.

## Hard rules (never break)

1. Do NOT change content structure, routes, business logic, forms, APIs, or data fetching unless the user asks. This is a visual + copy redesign.
2. Do NOT introduce any item in the **AI Slop Tells** section at the end of this file. Read it before designing.
3. Do NOT start coding before the design plan (Step 3) is approved by the user.
4. One accent color, used rarely. Everything else is neutral.
5. No glow, no neon, no gradient text, no glassmorphism, no animated backgrounds. Zero exceptions unless the user explicitly asks.

## Workflow

### Step 1 — Audit the current site

1. Map the project: framework (Next.js / React / Vite / plain HTML), styling system (Tailwind, CSS modules, styled-components), where global styles, theme config, and shared components live.
2. Run the slop scan and save results:
   ```bash
   grep -rnEi "glow|neon|shadow-(blue|cyan|indigo|purple|sky)|drop-shadow|bg-gradient|from-(blue|cyan|indigo|purple|violet)|to-(blue|cyan|indigo|purple|violet)|bg-clip-text|text-transparent|backdrop-blur|animate-(pulse|ping|bounce|spin)|border-(blue|cyan|sky|indigo)-[4-9]00|ring-(blue|cyan)|#0?0[0-9a-f]{1,2}ff|#0a0f1|#0b1120|#0f172a|#020617|slate-9[05]0|blur-3xl|mix-blend" --include=*.{tsx,jsx,ts,js,css,scss,html,vue,svelte} . | grep -v node_modules
   ```
3. Screenshot the current site in the browser at 1440px and 390px widths (keep as "before").
4. Write an artifact `design-audit.md` listing: every slop tell found (file + line), the page sections that exist, the current copy that sounds like marketing filler, and what the business actually is.

### Step 2 — Understand the subject

Before any visual choice, answer in the audit:
- What does this business/product actually do, in one plain sentence?
- Who is the buyer? What would make *them* trust it?
- What real material exists (product screenshots, photos, numbers, client names, testimonials)?

Distinctiveness comes from the subject, not from effects. A Kerala training institute, a SaaS tool, and a law firm should not look the same.

### Step 3 — Design plan (get approval)

Read the **Design Directions** section below. Pick ONE direction (or adapt one) that fits the subject. If the user prefers dark mode, use the dark direction — premium dark is neutral charcoal, never navy.

Write `design-plan.md` containing:
- **Palette:** 5–6 named hex values (background, surface, border, text, muted text, accent). Contrast must pass WCAG AA (4.5:1 body text).
- **Type:** 1–2 families with roles, and the type scale (see below).
- **Layout:** ASCII wireframe for the hero and 2 other key sections. State alignment (default: left-aligned).
- **The one memorable thing:** a single bold element (e.g. oversized headline set tight, a full-bleed product image, an unusual grid). Everything else stays quiet.
- **What gets removed:** list the slop tells being deleted.

Then self-review: "Would I produce this same plan for any other website?" If yes for any part, change that part and note why. Present the plan to the user and wait for approval.

### Step 4 — Build tokens first

Put all design decisions in one place before touching components.

**CSS variables (global.css):**
```css
:root {
  --bg: ...; --surface: ...; --border: ...;
  --text: ...; --text-muted: ...; --accent: ...;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 14px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --dur: 180ms;
}
```
**Tailwind:** map these into `theme.extend` (colors, borderRadius, fontFamily) and use the token names in components instead of raw `blue-500` / `slate-900` classes. Remove unused default color usage.

**Type scale (1.25 ratio, rem):** 0.8 / 0.875 / 1 (body 16–18px) / 1.25 / 1.563 / 1.953 / 2.441 / 3.052 / 3.815+ for display.
- Body line-height 1.55–1.7; headings 1.05–1.2.
- Large headings: letter-spacing −0.01em to −0.03em. Body: 0.
- Max line length: 60–75ch (`max-width: 65ch`).
- Weights: use 2–3 only (e.g. 400, 500, 600). Avoid 800/900 bold-everything.

### Step 5 — Rebuild components, then pages

Order: layout shell (nav, footer, container) → buttons/links/inputs → cards/sections → each page.

Apply these principles:

**Spacing & layout**
- Generous vertical rhythm: 96–160px between major sections on desktop, 64–96px on mobile.
- Container max-width 1120–1280px; text blocks narrower.
- Use asymmetry: 12-column grid with content spanning 7/5, 8/4, offset columns. Not everything centered.
- Vary section formats. Never three sections in a row with the same "heading + 3 cards" pattern.

**Surfaces**
- Borders: 1px, low contrast (border color only slightly different from background). No colored borders.
- Shadows: none, or one very soft shadow for elevated elements (menus, modals) only.
- Radius hierarchy: small elements (inputs, buttons) smaller radius; large containers slightly larger or none. Not one radius on everything.
- Cards only when content is genuinely a set of comparable items. Otherwise use plain layout with whitespace and rules.

**Color**
- 90% neutrals. Accent only on: primary CTA, active states, links, one key highlight.
- No color-coded icon backgrounds, no rainbow feature tiles.

**Buttons**
- Primary: solid text-color or accent background, 40–48px height, 16–20px horizontal padding, medium weight, sentence case.
- Secondary: text link with underline on hover, or subtle 1px border button.
- Label says exactly what happens ("Book a demo", "See courses"). No arrows or emojis appended by default.

**Icons & imagery**
- Prefer no icons over decorative icons. If needed: one consistent outline set (Lucide/Phosphor), 1.5px stroke, same size, same color as text.
- Real photography or real product screenshots > illustrations > nothing > 3D blobs/abstract AI art. Framed screenshots on a neutral surface look premium.
- Remove all stock "AI brain", circuit, hologram, and gradient-orb images.

**Motion**
- Only user-triggered transitions (hover, open, expand): 150–220ms, `var(--ease)`, opacity/color/transform only.
- At most ONE page-load moment (e.g. hero fades in). No scroll-triggered fade-up on every section. No infinite animations.
- Respect `prefers-reduced-motion`.

**Copy** (rewrite as you go — templated copy makes a design look AI no matter the styling)
- Replace hype with specifics: "Unlock the power of AI-driven solutions" → "We build billing software for clinics."
- Ban list: unlock, unleash, elevate, empower, supercharge, seamless, cutting-edge, next-gen, revolutionize, game-changer, "in today's fast-paced world", "take your X to the next level".
- Sentence case headings. No exclamation marks. Short sentences. Numbers and names where true.
- Remove eyebrow labels above every heading; keep one only where it adds information.

### Step 6 — Verify

1. Open the browser and screenshot every page at 1440px, 768px, 390px.
2. Compare against "before" screenshots.
3. Run the slop scan from Step 1 again — it should return nothing relevant.
4. Walk through **AI Slop Tells** checklist and fix every hit.
5. Check: keyboard focus visible (custom `:focus-visible` ring using accent, 2px offset), text contrast AA, no horizontal scroll on mobile, tap targets ≥ 44px, images have width/height set (no layout shift).
6. Final Chanel check: remove one decorative element from each page. If the page is not worse without it, leave it out.

Write `redesign-report.md`: what changed, before/after screenshots, remaining issues.

## Quick self-test before handing off

- Squint at the hero. Is there any glow, gradient, or blue-on-dark-blue? → Fix.
- Could this page belong to a different company by swapping the logo? → Add specificity (real images, real copy, subject-driven layout).
- Count colors in use (excluding images). More than 6? → Reduce.
- Count font weights. More than 3? → Reduce.
- Any section where every element is centered? → Justify it or left-align.

---

## Design Directions

Pick ONE and adapt it to the subject. These are starting points, not templates — shift hues, swap the accent, or change the type if the subject calls for it. Always verify contrast.

---

### A. Graphite (premium dark)

For users who want dark mode. The fix for "AI dark" is: neutral charcoal instead of navy, no light-emitting effects, text slightly warm instead of pure white, one muted accent.

| Token | Hex | Use |
|---|---|---|
| bg | #161618 | page background (neutral, not blue) |
| surface | #1D1D20 | raised areas, inputs |
| border | #2A2A2E | 1px dividers, card edges |
| text | #ECEBE8 | body and headings (never #FFFFFF) |
| text-muted | #8E8D89 | secondary text |
| accent | #C9B79C | muted brass — CTA, links, focus (alt: #A8B5A2 sage, #B8A4C9 dusk) |

- Primary button: bg `text` color, label `bg` color (light button on dark). Accent reserved for links + focus.
- Imagery: slightly desaturated photos; screenshots on `surface` with 1px `border`.
- Type: a clean grotesk with character — e.g. *General Sans*, *Hanken Grotesk*, *Schibsted Grotesk*; optional serif display *Newsreader* or *Instrument Serif* for the one big headline.
- Feel: a quiet gallery at night.

### B. Porcelain (cool light)

Clean, clinical, confident. Good for software, B2B, education, finance.

| Token | Hex | Use |
|---|---|---|
| bg | #FBFBFA | page |
| surface | #F2F2F0 | subtle panels |
| border | #E4E4E1 | dividers |
| text | #18181A | ink |
| text-muted | #6B6B70 | secondary |
| accent | #2E4A7D | deep ink blue (alt: #1F5E4F forest, #7A2E3A oxblood) |

- Primary button: solid `text` (near-black) with white label, or accent.
- Type: *Satoshi* / *Switzer* / *Figtree* for UI; optional *Source Serif 4* or *Libre Caslon Text* for long reading.
- Feel: a well-printed annual report.

### C. Stone (warm neutral, editorial)

Human, crafted, trustworthy. Good for services, institutes, studios, hospitality, personal brands.

| Token | Hex | Use |
|---|---|---|
| bg | #EFEDE8 | warm grey (not cream) |
| surface | #E6E3DC | panels |
| border | #D6D2C9 | dividers |
| text | #22211F | ink |
| text-muted | #6E6A62 | secondary |
| accent | #4F5B3A | olive (alt: #34495E slate, #6B4E3D walnut) |

- Big photography, generous margins, serif headlines with grotesk body.
- Type: headline *Fraunces* (SOFT axis at 0) or *Gloock*; body *Inter Tight* or *Geist* only if paired deliberately.
- Feel: a good independent bookshop.

---

### Hero patterns that don't look AI

Pick one based on subject. Avoid the centered badge-headline-two-buttons stack.

1. **Statement left, proof right** — plain, large left-aligned headline (5–9 words), one sentence, one CTA; right column: real product screenshot or photo, no glow.
   ```
   | Headline that says what   |  [ real screenshot /    ] |
   | you do, plainly.          |  [ photo, 1px border    ] |
   | One sentence of detail.   |                           |
   | [Primary CTA]  text link  |                           |
   ```
2. **Type as the hero** — one oversized headline spanning the grid, tight tracking, lots of empty space, small supporting line bottom-right.
3. **Full-bleed image** — edge-to-edge real photo, headline in the lower-left over a quiet area, no overlay gradient heavier than 30%.
4. **Product-first** — short line of text, then the product UI at large size as the main visual, framed on a neutral surface.

### Section patterns (rotate — never repeat the same one back-to-back)

- Two-column: small heading left (sticky on desktop), long content right.
- Single wide image with a caption.
- Plain list with 1px rules between items instead of cards.
- One large quote from a real, named customer — no carousel.
- A table for comparisons/pricing instead of glowing cards.
- FAQ as simple disclosure rows.

### Study the restraint of

Apple product pages (spacing, type scale), Aesop (warm neutrals, photography), Stripe Press (typography), Teenage Engineering (grid discipline), Things 3 site (calm product-first). Borrow principles, never copy layouts or assets.


---

## AI Slop Tells — Removal Checklist

Every item below makes a site read as AI-generated. Remove all of them unless the user explicitly asked for one.

### Color & light
- [ ] Navy / midnight-blue backgrounds (#0a0f1c, #0b1120, #0f172a, #020617, slate-900/950)
- [ ] Neon cyan, electric blue, or violet accents (#00d4ff, #3b82f6 glowing, #8b5cf6)
- [ ] Glow effects: colored box-shadow, drop-shadow, text-shadow, `shadow-blue-500/50`
- [ ] Neon/colored borders around cards or buttons (`border-blue-500`, gradient borders)
- [ ] Gradient text (`bg-clip-text text-transparent bg-gradient-to-r`)
- [ ] Blue→purple / cyan→violet gradients anywhere
- [ ] Blurred gradient orbs/blobs behind content (`blur-3xl` circles)
- [ ] Grid-line or dot-matrix backgrounds with radial fade
- [ ] Glassmorphism (`backdrop-blur` + translucent white panels)
- [ ] Noise/grain overlays added "for texture"

### Layout
- [ ] Centered hero: pill badge → giant gradient headline → subtitle → two buttons → screenshot with glow
- [ ] "Trusted by" row of fake/grey logos
- [ ] Three (or six) identical feature cards with icon in a colored rounded square
- [ ] Every section = eyebrow label + centered heading + subtitle + card grid
- [ ] Bento grid used for content that isn't a bento
- [ ] Numbered markers (01 / 02 / 03) on content that isn't a sequence
- [ ] Stats band: "10K+ users · 99.9% uptime · 24/7 support" with no source
- [ ] Pricing table with a glowing "Most popular" middle card
- [ ] Testimonial carousel with stock avatars and 5 stars
- [ ] Big gradient CTA banner at the bottom of every page

### Typography
- [ ] Default-reach fonts used without thought (Inter/Poppins/Space Grotesk everywhere)
- [ ] One word in the headline highlighted in a different color, italic, or gradient
- [ ] Tracked-out ALL-CAPS eyebrow labels above every heading
- [ ] Monospace used for decoration (small labels, fake "code" feel)
- [ ] Bold 700–900 weight used on most headings and body highlights
- [ ] Meta strings joined with middle dots "A · B · C" as decoration
- [ ] "→" or "↗" appended to every button and link

### Components & decoration
- [ ] "New" / "✨ AI-powered" / "Beta" pill badges
- [ ] Emoji used as icons (🚀 ⚡ 🔥 ✨ 💡)
- [ ] Sparkle icons, "AI brain", circuit, hologram, robot hand imagery
- [ ] One border-radius (usually 12–16px) on everything
- [ ] Same soft grey shadow under every card
- [ ] Animated gradient borders, shimmer buttons, spotlight-follow-cursor cards
- [ ] Marquee/infinite scrolling rows
- [ ] Particle, starfield, or animated mesh backgrounds
- [ ] Fade-and-slide-up scroll animation on every section
- [ ] Typewriter headline effect
- [ ] Hover lift + glow on every card

### Copy
- [ ] "Unlock / unleash / elevate / empower / supercharge / revolutionize"
- [ ] "Seamless", "cutting-edge", "next-generation", "state-of-the-art", "world-class"
- [ ] "In today's fast-paced digital world…"
- [ ] "Take your business to the next level"
- [ ] Vague claims without numbers, names, or proof
- [ ] Headings in Title Case With Every Word Capitalized
- [ ] Exclamation marks in marketing copy
- [ ] Generic CTA labels: "Get started", "Learn more", "Submit" (when a specific label is possible)
- [ ] Lorem-style filler testimonials ("This product changed my life!")

### Pass criteria
Zero unchecked items remain that the user didn't explicitly request.