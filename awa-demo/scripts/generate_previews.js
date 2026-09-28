const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/images/templates');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function writeAsset(filename, content) {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Generated: ${filename}`);
}

// -------------------------------------------------------------
// PITCH DECK SLIDES (tpl_slide_1: 4 slides)
// -------------------------------------------------------------
writeAsset('tpl_slide_1_1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_p1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080E1E"/>
      <stop offset="60%" stop-color="#0F1B38"/>
      <stop offset="100%" stop-color="#050811"/>
    </linearGradient>
    <linearGradient id="glow_cyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg_p1)"/>
  <circle cx="1600" cy="200" r="450" fill="#38BDF8" opacity="0.08"/>
  <circle cx="300" cy="800" r="400" fill="#818CF8" opacity="0.06"/>
  
  <rect x="120" y="100" width="160" height="40" rx="20" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
  <text x="200" y="125" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="1.5">SEED ROUND 2026</text>
  <text x="1780" y="125" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="end">CONFIDENTIAL · INVESTOR DECK</text>

  <text x="120" y="340" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="78" font-weight="900" letter-spacing="-1.5">AURA INTELLIGENCE</text>
  <text x="120" y="430" fill="url(#glow_cyan)" font-family="system-ui, sans-serif" font-size="40" font-weight="700">Autonomous Enterprise Prompt &amp; Asset Pipelines</text>
  <text x="120" y="510" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="22" font-weight="400">Eliminating manual workflow bottlenecks between design, marketing, and engineering.</text>

  <g transform="translate(120, 680)">
    <rect width="360" height="160" rx="20" fill="#131F3B" stroke="#1E2E56" stroke-width="2"/>
    <text x="40" y=\"65\" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="44" font-weight="900">$1.8M ARR</text>
    <text x="40" y=\"110\" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Triple-digit YoY Velocity</text>
  </g>
  <g transform="translate(520, 680)">
    <rect width="360" height="160" rx="20" fill="#131F3B" stroke="#1E2E56" stroke-width="2"/>
    <text x="40" y=\"65\" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="44" font-weight="900">18 Enterprise</text>
    <text x="40" y=\"110\" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Paid Tier-1 Pilot Cohorts</text>
  </g>
  <g transform="translate(920, 680)">
    <rect width="360" height="160" rx="20" fill="#131F3B" stroke="#1E2E56" stroke-width="2"/>
    <text x="40" y=\"65\" fill="#818CF8" font-family="system-ui, sans-serif" font-size="44" font-weight="900">$3.5M Ask</text>
    <text x="40" y=\"110\" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" font-weight="600">Seed Financing Round</text>
  </g>

  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">01 / 04</text>
</svg>`);

writeAsset('tpl_slide_1_2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#080E1E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">02 · THE BOTTLENECK</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Creative Production is Siloed and Costly</text>

  <g transform="translate(120, 290)">
    <rect width="520" height="520" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <rect x="40" y="40" width="56" height="56" rx="16" fill="#EF4444" opacity="0.2"/>
    <text x="68" y="76" fill="#EF4444" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">!</text>
    <text x="40" y="150" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="28" font-weight="800">Tool Fragmentation</text>
    <text x="40" y="205" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Teams juggle Midjourney, Runway, Framer, and Gamma with zero persistent state.</text>
    <text x="40" y="420" fill="#EF4444" font-family="system-ui, sans-serif" font-size="42" font-weight="900">-42%</text>
    <text x="40" y="460" fill="#64748B" font-family="system-ui, sans-serif" font-size="16">Creative Velocity Lost</text>
  </g>
  <g transform="translate(680, 290)">
    <rect width="520" height="520" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <rect x="40" y="40" width="56" height="56" rx="16" fill="#F59E0B" opacity="0.2"/>
    <text x="68" y="76" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">$</text>
    <text x="40" y="150" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="28" font-weight="800">Wasted Compute</text>
    <text x="40" y="205" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Uncalibrated prompt inputs burn GPU tokens without hitting brand standards.</text>
    <text x="40" y="420" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="42" font-weight="900">$14.2B</text>
    <text x="40" y="460" fill="#64748B" font-family="system-ui, sans-serif" font-size="16">Annual Enterprise GPU Loss</text>
  </g>
  <g transform="translate(1240, 290)">
    <rect width="520" height="520" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <rect x="40" y="40" width="56" height="56" rx="16" fill="#38BDF8" opacity="0.2"/>
    <text x="68" y="76" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">✓</text>
    <text x="40" y="150" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="28" font-weight="800">Brand Drift</text>
    <text x="40" y="205" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Ad-hoc generations deviate from corporate design rules and legal compliance.</text>
    <text x="40" y="420" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="42" font-weight="900">89%</text>
    <text x="40" y="460" fill="#64748B" font-family="system-ui, sans-serif" font-size="16">Audit Guideline Breaches</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">02 / 04</text>
</svg>`);

writeAsset('tpl_slide_1_3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#080E1E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">03 · TRACTION &amp; METRICS</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Proven Organic Pull &amp; Strong Cohorts</text>

  <g transform="translate(120, 290)">
    <rect width="1020" height="540" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <text x="50" y="70" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">ARR Growth Trajectory ($M)</text>
    <rect x="100" y="430" width="140" height="140" rx="8" fill="#1E293B"/>
    <text x="170" y="415" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle">$0.3M</text>
    <text x="170" y="605" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" text-anchor="middle">Q1</text>

    <rect x="320" y="360" width="140" height="210" rx="8" fill="#1E293B"/>
    <text x="390" y="345" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle">$0.7M</text>
    <text x="390" y="605" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" text-anchor="middle">Q2</text>

    <rect x="540" y="270" width="140" height="300" rx="8" fill="#1E2E56"/>
    <text x="610" y="255" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle">$1.2M</text>
    <text x="610" y="605" fill="#64748B" font-family="system-ui, sans-serif" font-size="16" text-anchor="middle">Q3</text>

    <rect x="760" y="170" width="140" height="400" rx="8" fill="#38BDF8"/>
    <text x="830" y="155" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">$1.8M</text>
    <text x="830" y="605" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Q4 (Current)</text>
  </g>

  <g transform="translate(1180, 290)">
    <rect width="620" height="250" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <text x="50" y="70" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">NET REVENUE RETENTION</text>
    <text x="50" y="150" fill="#34D399" font-family="system-ui, sans-serif" font-size="64" font-weight="900">142%</text>
    <text x="50" y="195" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Enterprise expansion without dedicated sales rep</text>
  </g>
  <g transform="translate(1180, 580)">
    <rect width="620" height="250" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <text x="50" y="70" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">GROSS MARGIN</text>
    <text x="50" y="150" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="64" font-weight="900">84%</text>
    <text x="50" y="195" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Optimized model orchestration &amp; caching</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">03 / 04</text>
</svg>`);

writeAsset('tpl_slide_1_4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#080E1E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">04 · FINANCING &amp; USE OF FUNDS</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Raising $3.5M Seed to Scale Enterprise GTM</text>

  <g transform="translate(120, 290)">
    <rect width="800" height="540" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <text x="50" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Allocation Breakdown</text>
    <rect x="50" y="110" width="700" height="48" rx="12" fill="#38BDF8"/>
    <text x="70" y="141" fill="#080E1E" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">50% Core AI Architecture &amp; Prompt Engineering</text>
    <rect x="50" y="180" width="420" height="48" rx="12" fill="#818CF8"/>
    <text x="70" y="211" fill="#080E1E" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">30% Enterprise Sales &amp; DevRel</text>
    <rect x="50" y="250" width="280" height="48" rx="12" fill="#34D399"/>
    <text x="70" y="281" fill="#080E1E" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">20% Infrastructure &amp; Security</text>

    <text x="50" y="380" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">18-Month Target Milestones:</text>
    <text x="50" y="420" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">• Triple revenue run-rate to $5.5M ARR</text>
    <text x="50" y="460" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">• Launch collaborative Enterprise Workspace suite</text>
    <text x="50" y="500" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">• Achieve SOC2 Type II &amp; ISO 27001 readiness</text>
  </g>

  <g transform="translate(960, 290)">
    <rect width="840" height="540" rx="24" fill="#111C36" stroke="#223259" stroke-width="2"/>
    <text x="50" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Round Structure</text>
    
    <g transform="translate(50, 110)">
      <rect width="740" height="90" rx="16" fill="#18284A"/>
      <text x="30" y="55" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Round Format:</text>
      <text x="220" y="55" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Priced Preferred Seed Equity</text>
    </g>
    <g transform="translate(50, 220)">
      <rect width="740" height="90" rx="16" fill="#18284A"/>
      <text x="30" y="55" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Operational Runway:</text>
      <text x="240" y="55" fill="#34D399" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">24 Months to Series A</text>
    </g>
    <g transform="translate(50, 330)">
      <rect width="740" height="150" rx="16" fill="#18284A"/>
      <text x="30" y="45" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Syndicate Status:</text>
      <text x="30" y="85" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">$2.0M Committed by Tier-1 DeepTech Seed Fund</text>
      <text x="30" y="120" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18">$1.5M Allocation open to strategic partners</text>
    </g>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">04 / 04</text>
</svg>`);

// -------------------------------------------------------------
// AGENCY CASE STUDY SLIDES (tpl_slide_3: 4 slides)
// -------------------------------------------------------------
writeAsset('tpl_slide_3_1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#06121E"/>
  <rect x="120" y="100" width="180" height="36" rx="18" fill="#1E293B"/>
  <text x="210" y="123" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">AGENCY CASE STUDY</text>
  <text x="120" y="320" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="70" font-weight="900">SOLARIS GLOBAL</text>
  <text x="120" y="400" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="36" font-weight="700">Digital Experience &amp; Brand Modernization</text>
  <text x="120" y="480" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="22">How Vertex Studio rearchitected a legacy FinTech platform for next-gen web performance.</text>
  <g transform="translate(120, 680)">
    <rect width="360" height="160" rx="20" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="65" fill="#34D399" font-family="system-ui, sans-serif" font-size="44" font-weight="900">+312%</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Conversion Lift</text>
  </g>
  <g transform="translate(520, 680)">
    <rect width="360" height="160" rx="20" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="65" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="44" font-weight="900">-54%</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Load Time Latency</text>
  </g>
  <g transform="translate(920, 680)">
    <rect width="360" height="160" rx="20" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="65" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="44" font-weight="900">2 Awards</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Awwwards SOTD &amp; Webby</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">01 / 04</text>
</svg>`);

writeAsset('tpl_slide_3_2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#06121E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">THE CHALLENGE</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Legacy Architecture Causing High Friction</text>
  <g transform="translate(120, 290)">
    <rect width="780" height="520" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="50" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Audit Findings</text>
    <text x="50" y="120" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">• Mobile onboarding abandonment reached 48% due to excessive form friction.</text>
    <text x="50" y="180" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">• Inconsistent color contrast failing WCAG AA enterprise accessibility audits.</text>
    <text x="50" y="240" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">• 4.2-second average First Contentful Paint on mobile 4G networks.</text>
    <text x="50" y="300" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">• Fragmented design assets across 4 disparate regional sub-brands.</text>
  </g>
  <g transform="translate(940, 290)">
    <rect width="860" height="520" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="50" y="60" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Target Transformation Goals</text>
    <text x="50" y="130" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">1. Sub-1-second Global Edge Delivery</text>
    <text x="50" y="220" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">2. Single Unified Design System (Design Tokens)</text>
    <text x="50" y="310" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">3. 1-Tap Mobile Micro-Payment Experience</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">02 / 04</text>
</svg>`);

writeAsset('tpl_slide_3_3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#06121E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">THE SOLUTION</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Modular Headless Design System</text>
  <g transform="translate(120, 300)">
    <rect width="520" height="500" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="60" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Tokenized Theme</text>
    <text x="40" y="120" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Deep slate blue palette (#06121E) paired with high-contrast electric accents.</text>
  </g>
  <g transform="translate(680, 300)">
    <rect width="520" height="500" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="60" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Next.js Edge Runtime</text>
    <text x="40" y="120" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Server-side rendered dynamic routes with instant caching across 300 global PoPs.</text>
  </g>
  <g transform="translate(1240, 300)">
    <rect width="520" height="500" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <text x="40" y="60" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Micro-Interactions</text>
    <text x="40" y="120" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Tactile haptic feedback and fluid 60fps springs on critical checkout actions.</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">03 / 04</text>
</svg>`);

writeAsset('tpl_slide_3_4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#06121E"/>
  <text x="120" y="130" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">BUSINESS IMPACT</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Transformational Returns for Solaris Global</text>
  <g transform="translate(120, 300)">
    <rect width="1680" height="500" rx="24" fill="#0C2138" stroke="#1E3A5F" stroke-width="2"/>
    <g transform="translate(60, 60)">
      <text x="0" y="40" fill="#34D399" font-family="system-ui, sans-serif" font-size="60" font-weight="900">+312%</text>
      <text x="0" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Mobile Conversion Rate</text>
      <text x="0" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Conversion rose from 1.2% to 4.9% across iOS &amp; Android checkouts.</text>
    </g>
    <g transform="translate(60, 240)">
      <text x="0" y="40" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="60" font-weight="900">$22.4M</text>
      <text x="0" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Incremental GMV</text>
      <text x="0" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Net new processed volume achieved within first 90 days post-launch.</text>
    </g>
    <g transform="translate(900, 60)">
      <text x="0" y="40" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="60" font-weight="900">0.8s</text>
      <text x="0" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Average Mobile FCP</text>
      <text x="0" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Google Core Web Vitals score increased from 34 to 98/100.</text>
    </g>
    <g transform="translate(900, 240)">
      <text x="0" y="40" fill="#818CF8" font-family="system-ui, sans-serif" font-size="60" font-weight="900">99.99%</text>
      <text x="0" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Uptime Reliability</text>
      <text x="0" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Flawless Black Friday performance under 18x baseline traffic spikes.</text>
    </g>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">04 / 04</text>
</svg>`);

// -------------------------------------------------------------
// EDUCATIONAL WORKSHOP SLIDES (tpl_slide_edu_1: 4 slides)
// -------------------------------------------------------------
writeAsset('tpl_slide_edu_1_1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0C1427"/>
  <rect x="120" y="100" width="220" height="36" rx="18" fill="#1E293B"/>
  <text x="230" y="123" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">MASTERCLASS SERIES</text>
  <text x="120" y="320" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="70" font-weight="900">GENERATIVE PROMPT ARCHITECTURE</text>
  <text x="120" y="400" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="36" font-weight="700">Engineering Deterministic Outputs from Stochastic AI Models</text>
  <text x="120" y="480" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="22">Curriculum module for senior creatives, technical directors, and prompt engineers.</text>
  <g transform="translate(120, 680)">
    <rect width="360" height="160" rx="20" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="40" y="65" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="44" font-weight="900">4 Modules</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">End-to-End Curriculum</text>
  </g>
  <g transform="translate(520, 680)">
    <rect width="360" height="160" rx="20" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="40" y="65" fill="#34D399" font-family="system-ui, sans-serif" font-size="44" font-weight="900">Hands-on</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Interactive Code &amp; Visual Labs</text>
  </g>
  <g transform="translate(920, 680)">
    <rect width="360" height="160" rx="20" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="40" y="65" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="44" font-weight="900">V6 &amp; FLUX</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">State-of-the-Art Engines</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">01 / 04</text>
</svg>`);

writeAsset('tpl_slide_edu_1_2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0C1427"/>
  <text x="120" y="130" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">02 · PROMPT ANATOMY</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">The 4-Part Production Structure</text>
  <g transform="translate(120, 290)">
    <rect width="380" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="30" y="60" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">1. Subject Staging</text>
    <text x="30" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Specific geometric form, material composition, surface finishes.</text>
  </g>
  <g transform="translate(540, 290)">
    <rect width="380" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="30" y="60" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">2. Lighting Vectors</text>
    <text x="30" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Three-point softbox, rim edge isolation, color temperature (3200K vs 5600K).</text>
  </g>
  <g transform="translate(960, 290)">
    <rect width="380" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="30" y="60" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">3. Camera &amp; Optics</text>
    <text x="30" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Focal length (120mm macro), aperture (f/11 for edge sharpness), shutter speed.</text>
  </g>
  <g transform="translate(1380, 290)">
    <rect width="380" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="30" y="60" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">4. Negative Flags</text>
    <text x="30" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16">Suppressing lens distortion, glare, artifacts, and chromatic aberration.</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">02 / 04</text>
</svg>`);

writeAsset('tpl_slide_edu_1_3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0C1427"/>
  <text x="120" y="130" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">03 · MODEL COMPARISON</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Model Behavior Matrix</text>
  <g transform="translate(120, 290)">
    <rect width="1680" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="50" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Engine</text>
    <text x="400" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Primary Strength</text>
    <text x="900" y="60" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Best Used For</text>
    <line x1="50" y1="90" x2="1630" y2="90" stroke="#253A66" stroke-width="1.5"/>
    
    <text x="50" y="160" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Midjourney v6.0</text>
    <text x="400" y="160" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Tactile photorealism, subtle micro-textures, nuanced rim lights</text>
    <text x="900" y="160" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Luxury e-commerce, commercial still life, editorial fashion</text>

    <text x="50" y="260" fill="#34D399" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">FLUX.1 Pro</text>
    <text x="400" y="260" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Exact typographic fidelity, complex physical anatomy</text>
    <text x="900" y="260" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Packaging with real text labels, isometric diagrams, UI mockups</text>

    <text x="50" y="360" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">DALL-E 3</text>
    <text x="400" y="360" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Strict multi-entity spatial prompt adherence</text>
    <text x="900" y="360" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20">Storyboards, conceptual layouts with strict element placement</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">03 / 04</text>
</svg>`);

writeAsset('tpl_slide_edu_1_4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0C1427"/>
  <text x="120" y="130" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">04 · PRACTICAL LAB</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Hands-on Challenge: Studio Staging</text>
  <g transform="translate(120, 290)">
    <rect width="1680" height="520" rx="24" fill="#14213D" stroke="#253A66" stroke-width="2"/>
    <text x="50" y="70" fill="#34D399" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Assignment Deliverable</text>
    <text x="50" y="130" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20">Craft a commercial studio prompt for a luxury frosted glass cosmetic vial:</text>
    <text x="50" y="180" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">1. Pure white seamless background (#FFFFFF) with true contact shadows.</text>
    <text x="50" y="220" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">2. Dual softbox setup: 45-degree key light left, crisp amber rim light right.</text>
    <text x="50" y="260" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">3. Lens specifications: 120mm macro prime, f/11 aperture, ISO 64.</text>
    <text x="50" y="300" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">4. Evaluation rubric: Zero chromatic aberration, tack-sharp typography on label.</text>
    
    <rect x="50" y="360" width="400" height="60" rx="16" fill="#60A5FA"/>
    <text x="250" y="398" fill="#0C1427" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Open Lab Workspace →</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">04 / 04</text>
</svg>`);

// -------------------------------------------------------------
// MARKETING STRATEGY REPORT SLIDES (tpl_slide_2: 4 slides)
// -------------------------------------------------------------
writeAsset('tpl_slide_2_1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0B132B"/>
  <rect x="120" y="100" width="200" height="36" rx="18" fill="#1C2541"/>
  <text x="220" y="123" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Q3 GROWTH REPORT</text>
  <text x="120" y="320" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="70" font-weight="900">GLOBAL MARKETING &amp; ATTRIBUTION</text>
  <text x="120" y="400" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="36" font-weight="700">Quarterly Executive Performance Briefing</text>
  <g transform="translate(120, 680)">
    <rect width="360" height="160" rx="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="40" y="65" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="44" font-weight="900">4.8x</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Blended ROAS</text>
  </g>
  <g transform="translate(520, 680)">
    <rect width="360" height="160" rx="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="40" y="65" fill="#34D399" font-family="system-ui, sans-serif" font-size="44" font-weight="900">$4,850</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Enterprise LTV</text>
  </g>
  <g transform="translate(920, 680)">
    <rect width="360" height="160" rx="20" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="40" y="65" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="44" font-weight="900">-28%</text>
    <text x="40" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">CAC Reduction</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">01 / 04</text>
</svg>`);

writeAsset('tpl_slide_2_2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0B132B"/>
  <text x="120" y="130" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">02 · UNIT ECONOMICS</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">CAC vs LTV Trend Line</text>
  <g transform="translate(120, 290)">
    <rect width="1680" height="520" rx="24" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="50" y="80" fill="#34D399" font-family="system-ui, sans-serif" font-size="28" font-weight="bold">LTV / CAC Ratio expanded to 5.2x</text>
    <text x="50" y="130" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="18">Driven by high-velocity organic AI search traffic and customer referral loops.</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">02 / 04</text>
</svg>`);

writeAsset('tpl_slide_2_3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0B132B"/>
  <text x="120" y="130" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">03 · CHANNEL DISTRIBUTION</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Attribution by Acquisition Channel</text>
  <g transform="translate(120, 290)">
    <rect width="1680" height="520" rx="24" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="50" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Organic Search &amp; Prompt Indexing: 48% of total volume</text>
    <text x="50" y="150" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Short-form Video Reels &amp; UGC: 32% of total volume</text>
    <text x="50" y="220" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Partner Integrations: 20% of total volume</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">03 / 04</text>
</svg>`);

writeAsset('tpl_slide_2_4.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#0B132B"/>
  <text x="120" y="130" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" letter-spacing="2">04 · STRATEGIC ROADMAP</text>
  <text x="120" y="210" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="56" font-weight="900">Q4 Expansion Priorities</text>
  <g transform="translate(120, 290)">
    <rect width="1680" height="520" rx="24" fill="#1C2541" stroke="#3A506B" stroke-width="2"/>
    <text x="50" y="80" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">1. Enterprise Self-Serve Workspace Onboarding</text>
    <text x="50" y="150" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">2. Localized Multi-Language Prompt Catalog Rollout</text>
    <text x="50" y="220" fill="#48CAE4" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">3. Co-Marketing Integrations with Midjourney &amp; Framer</text>
  </g>
  <text x="1800" y="980" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">04 / 04</text>
</svg>`);

// -------------------------------------------------------------
// MOBILE WEBSITE PREVIEWS
// -------------------------------------------------------------
function createMobileFrame(id, title, subtitle, contentSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 840" width="100%" height="100%">
    <rect width="420" height="840" rx="48" fill="#0B0F19" stroke="#1E293B" stroke-width="6"/>
    <!-- Dynamic Island -->
    <rect x="150" y="18" width="120" height="28" rx="14" fill="#000000"/>
    
    <!-- Header -->
    <text x="32" y="90" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">${title}</text>
    <text x="32" y="115" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">${subtitle}</text>

    <!-- Content Slot -->
    <g transform="translate(24, 140)">
      ${contentSvg}
    </g>

    <!-- Bottom Indicator Bar -->
    <rect x="140" y="818" width="140" height="5" rx="2.5" fill="#475569"/>
  </svg>`;
}

writeAsset('tpl_web_1_mobile.svg', createMobileFrame(
  'tpl_web_1',
  'Pulse AI Platform',
  'Mobile Cloud View',
  `<rect width="372" height="180" rx="16" fill="#111C36" stroke="#253A66"/>
   <text x="24" y="45" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">AUTOMATE PROMPTS</text>
   <text x="24" y="80" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="900">Ship AI 10x Faster</text>
   <text x="24" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Production prompt engineering without code.</text>
   <rect x="24" y="130" width="140" height="34" rx="17" fill="#38BDF8"/>
   <text x="94" y="152" fill="#080E1E" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Start Free →</text>

   <rect y="200" width="372" height="130" rx="16" fill="#111C36" stroke="#253A66"/>
   <text x="24" y="240" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Live Telemetry</text>
   <text x="24" y="275" fill="#34D399" font-family="system-ui, sans-serif" font-size="32" font-weight="900">99.98%</text>
   <text x="24" y="305" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Global edge availability across 42 regions</text>

   <rect y="350" width="372" height="120" rx="16" fill="#111C36" stroke="#253A66"/>
   <text x="24" y="390" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">1-Click Integrations</text>
   <text x="24" y="430" fill="#818CF8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Midjourney · Runway · FLUX</text>`
));

writeAsset('tpl_web_2_mobile.svg', createMobileFrame(
  'tpl_web_2',
  'Elena Rostova',
  'Art Director &amp; 3D Designer',
  `<rect width="372" height="230" rx="20" fill="#131B2E" stroke="#253858"/>
   <text x="24" y="40" fill="#A855F7" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">SELECTED WORK 2026</text>
   <text x="24" y="75" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">Kinetic Typography</text>
   <rect x="24" y="95" width="324" height="110" rx="12" fill="#1F2942"/>
   <circle cx="186" cy="150" r="35" fill="#A855F7" opacity="0.4"/>
   <text x="186" y="156" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Interactive 3D Mesh</text>

   <rect y="250" width="372" height="140" rx="20" fill="#131B2E" stroke="#253858"/>
   <text x="24" y="290" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Spatial Audio Packaging</text>
   <text x="24" y="325" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Red Dot Best of the Best 2025</text>
   <text x="24" y="360" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">View Project Case Study →</text>`
));

writeAsset('tpl_web_3_mobile.svg', createMobileFrame(
  'tpl_web_3',
  'Bento Component System',
  'Responsive Feature Stack',
  `<rect width="372" height="150" rx="16" fill="#0F172A" stroke="#334155"/>
   <text x="20" y="40" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">BENTO MODULE 01</text>
   <text x="20" y="75" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Zero-Latency Ingestion</text>
   <text x="20" y="110" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Streams raw prompt telemetry directly to edge nodes.</text>

   <rect y="170" width="372" height="150" rx="16" fill="#0F172A" stroke="#334155"/>
   <text x="20" y="210" fill="#34D399" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">BENTO MODULE 02</text>
   <text x="20" y="245" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Encrypted Key Vault</text>
   <text x="20" y="280" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Hardware-level enclave encryption for enterprise API keys.</text>`
));

writeAsset('tpl_web_bakery_mobile.svg', createMobileFrame(
  'tpl_web_bakery',
  'Crumb &amp; Crust',
  'Artisan Sourdough &amp; Espresso',
  `<rect width="372" height="170" rx="16" fill="#24140D" stroke="#4A2818"/>
   <text x="20" y="38" fill="#F59E0B" font-family="serif" font-size="13" font-weight="bold">MORNING PULL · 8:00 AM</text>
   <text x="20" y="75" fill="#FDF8F0" font-family="serif" font-size="22" font-weight="bold">Wild Sourdough Country Loaf</text>
   <text x="20" y="105" fill="#D97706" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">$12.00</text>
   <rect x="20" y="120" width="130" height="32" rx="16" fill="#F59E0B"/>
   <text x="85" y="141" fill="#24140D" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Pre-Order Now</text>

   <rect y="190" width="372" height="160" rx="16" fill="#24140D" stroke="#4A2818"/>
   <text x="20" y="230" fill="#FDF8F0" font-family="serif" font-size="18" font-weight="bold">Cardamom Morning Bun</text>
   <text x="20" y="260" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Laminated slow-cultured French butter dough with crushed green cardamom.</text>
   <text x="20" y="295" fill="#D97706" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">$6.50 · 6 left today</text>`
));

// -------------------------------------------------------------
// ARCHITECTURAL PORTFOLIO (tpl_web_portfolio_arch)
// -------------------------------------------------------------
writeAsset('tpl_web_arch_desktop.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
  <rect width="1600" height="1000" fill="#121214"/>
  <!-- Nav -->
  <text x="100" y="80" fill="#FFFFFF" font-family="serif" font-size="24" font-weight="bold" letter-spacing="4">STUDIO MONOLITH</text>
  <text x="1200" y="80" fill="#999999" font-family="system-ui, sans-serif" font-size="14" letter-spacing="2">WORKS</text>
  <text x="1320" y="80" fill="#999999" font-family="system-ui, sans-serif" font-size="14" letter-spacing="2">PRACTICE</text>
  <text x="1460" y="80" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" letter-spacing="2">CONTACT</text>
  <line x1="100" y1="120" x2="1500" y2="120" stroke="#27272A" stroke-width="1"/>

  <!-- Hero Grid -->
  <text x="100" y="240" fill="#FFFFFF" font-family="serif" font-size="64" font-weight="300" letter-spacing="-1">Light, Form &amp; Concrete.</text>
  <text x="100" y="290" fill="#71717A" font-family="system-ui, sans-serif" font-size="18" max-width="600">Selected residential and cultural spaces engineered with brutalist restraint.</text>

  <!-- Gallery Images -->
  <rect x="100" y="360" width="660" height="520" rx="4" fill="#202024"/>
  <text x="130" y="830" fill="#FFFFFF" font-family="serif" font-size="24">The Nordic Pavilion</text>
  <text x="130" y="860" fill="#71717A" font-family="system-ui, sans-serif" font-size="14">Stockholm, 2025</text>

  <rect x="800" y="360" width="700" height="240" rx="4" fill="#202024"/>
  <text x="830" y="550" fill="#FFFFFF" font-family="serif" font-size="22">Kyoto Concrete House</text>
  <text x="830" y="580" fill="#71717A" font-family="system-ui, sans-serif" font-size="14">Kyoto, 2024</text>

  <rect x="800" y="630" width="700" height="250" rx="4" fill="#202024"/>
  <text x="830" y="830" fill="#FFFFFF" font-family="serif" font-size="22">Alpine Monolith Retreat</text>
  <text x="830" y="860" fill="#71717A" font-family="system-ui, sans-serif" font-size="14">Vals, Switzerland</text>
</svg>`);

writeAsset('tpl_web_arch_mobile.svg', createMobileFrame(
  'tpl_web_portfolio_arch',
  'STUDIO MONOLITH',
  'Architectural Practice',
  `<rect width="372" height="260" rx="4" fill="#202024"/>
   <text x="20" y="220" fill="#FFFFFF" font-family="serif" font-size="18">The Nordic Pavilion</text>
   <text x="20" y="244" fill="#71717A" font-family="system-ui, sans-serif" font-size="12">Stockholm, 2025</text>

   <rect y="280" width="372" height="200" rx="4" fill="#202024"/>
   <text x="20" y="440" fill="#FFFFFF" font-family="serif" font-size="18">Kyoto Concrete House</text>
   <text x="20" y="464" fill="#71717A" font-family="system-ui, sans-serif" font-size="12">Kyoto, 2024</text>`
));

// -------------------------------------------------------------
// SOCIAL MEDIA GRAPHICS (tpl_img_social_1)
// -------------------------------------------------------------
writeAsset('tpl_social_launch.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_soc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="glow_grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#grad_soc)"/>
  <circle cx="850" cy="250" r="320" fill="#38BDF8" opacity="0.25"/>
  <circle cx="200" cy="850" r="300" fill="#EC4899" opacity="0.2"/>

  <!-- Card Frame -->
  <rect x="80" y="80" width="920" height="920" rx="40" fill="#0F172A" opacity="0.75" stroke="#334155" stroke-width="2"/>

  <rect x="140" y="140" width="180" height="44" rx="22" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
  <text x="230" y="168" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle" letter-spacing="1">NEW LAUNCH</text>

  <text x="140" y="320" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="64" font-weight="900" line-height="1.1">THE FUTURE OF CREATIVE AI</text>
  <text x="140" y="420" fill="url(#glow_grad)" font-family="system-ui, sans-serif" font-size="38" font-weight="800">Precision Prompts for Visionaries</text>

  <text x="140" y="520" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="22">Transform ideas into production-ready commercial assets in seconds with AWA curated templates.</text>

  <!-- Feature pills -->
  <g transform="translate(140, 620)">
    <rect width="360" height="60" rx="30" fill="#1E293B" stroke="#475569"/>
    <text x="180" y="37" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">✓ Commercial License Safe</text>
  </g>
  <g transform="translate(540, 620)">
    <rect width="360" height="60" rx="30" fill="#1E293B" stroke="#475569"/>
    <text x="180" y="37" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">✓ Studio Lighting Vectors</text>
  </g>

  <!-- CTA Box -->
  <g transform="translate(140, 750)">
    <rect width="800" height="130" rx="28" fill="url(#glow_grad)"/>
    <text x="400" y="75" fill="#020617" font-family="system-ui, sans-serif" font-size="28" font-weight="900" text-anchor="middle">EXPLORE PROMPTS AT AWA.DEV →</text>
  </g>
</svg>`);

// -------------------------------------------------------------
// VIDEO 4 POSTER (tpl_video_4_poster.svg)
// -------------------------------------------------------------
writeAsset('tpl_video_4_poster.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="v4_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180B2B"/>
      <stop offset="50%" stop-color="#2E1065"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#v4_bg)"/>
  <circle cx="960" cy="540" r="350" fill="#A855F7" opacity="0.3"/>
  <rect x="800" y="100" width="320" height="48" rx="24" fill="#3B0764" stroke="#A855F7" stroke-width="2"/>
  <text x="960" y="132" fill="#F3E8FF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" letter-spacing="2">VIRAL SOCIAL REEL</text>
  
  <text x="960" y="480" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="80" font-weight="900" text-anchor="middle">HIGH-ENERGY MOTION</text>
  <text x="960" y="560" fill="#E879F9" font-family="system-ui, sans-serif" font-size="40" font-weight="700" text-anchor="middle">Snappy Cuts &amp; Dynamic Particle Physics</text>

  <!-- Play Triangle -->
  <circle cx="960" cy="720" r="60" fill="#FFFFFF" opacity="0.9"/>
  <polygon points="950,695 980,720 950,745" fill="#2E1065"/>
</svg>`);

console.log('All SVG preview assets generated successfully.');
