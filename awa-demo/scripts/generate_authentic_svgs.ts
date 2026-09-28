import fs from 'fs';
import path from 'path';
import { ALL_GUIDANCE_CATALOG } from '../src/lib/guidanceCatalog';

const outputBase = path.resolve('public/images/guidance');

function getCategoryTheme(tplId: string): { category: string; tool: string; accent: string; secondary: string } {
  if (tplId.startsWith('tpl_video')) {
    return { category: 'Video Generation', tool: 'Runway Gen-3 / Pika', accent: '#38BDF8', secondary: '#818CF8' };
  }
  if (tplId.startsWith('tpl_slide')) {
    return { category: 'Executive Presentation', tool: 'Gamma Deck 2.0', accent: '#A855F7', secondary: '#EC4899' };
  }
  if (tplId.startsWith('tpl_web') || tplId.startsWith('tpl_3d') || ['tpl_future_machine', 'tpl_quantum_human', 'tpl_mind_ai'].includes(tplId)) {
    return { category: 'Web & UI Engineering', tool: 'v0 by Vercel', accent: '#3B82F6', secondary: '#10B981' };
  }
  return { category: 'Commercial Photography', tool: 'Midjourney v6.1', accent: '#F59E0B', secondary: '#FB7185' };
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSvgContent(tplId: string, step: any, totalSteps: number): string {
  const theme = getCategoryTheme(tplId);
  const stepNum = String(step.step).padStart(2, '0');
  const safeTitle = escapeXml(step.title);
  const safeDesc = escapeXml(step.description);
  const safeTip = escapeXml(step.tip || '');
  const safeAction = escapeXml(step.actionText || step.toolOrAction || theme.tool);
  const safeResult = escapeXml(step.expectedResult || 'Production output verified.');

  // Determine schematic type based on step title and category
  let schematicType = 'workflow';
  const tLower = step.title.toLowerCase();
  if (tLower.includes('tool') || tLower.includes('workspace') || tLower.includes('launch') || tLower.includes('select') || tLower.includes('open')) {
    schematicType = 'tool_setup';
  } else if (tLower.includes('stage') || tLower.includes('lighting') || tLower.includes('cove') || tLower.includes('palette') || tLower.includes('upload') || tLower.includes('props')) {
    schematicType = 'staging_input';
  } else if (tLower.includes('optic') || tLower.includes('motion') || tLower.includes('camera') || tLower.includes('vector') || tLower.includes('angle')) {
    schematicType = 'optics_motion';
  } else if (tLower.includes('prompt') || tLower.includes('inject') || tLower.includes('custom') || tLower.includes('subject')) {
    schematicType = 'prompt_custom';
  } else if (tLower.includes('quad') || tLower.includes('preview') || tLower.includes('scrub') || tLower.includes('breakpoint') || tLower.includes('review') || tLower.includes('layout')) {
    schematicType = 'review_inspect';
  } else if (tLower.includes('export') || tLower.includes('master') || tLower.includes('loop') || tLower.includes('deploy') || tLower.includes('pdf') || tLower.includes('code')) {
    schematicType = 'export_delivery';
  }

  let centerGraphic = '';

  if (schematicType === 'tool_setup') {
    centerGraphic = `
      <!-- Tool Setup Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>
        
        <!-- Engine Spec Card Left -->
        <rect x="24" y="24" width="320" height="252" rx="10" fill="#070D1A" stroke="${theme.accent}" stroke-width="1.2" stroke-opacity="0.6"/>
        <rect x="40" y="40" width="48" height="48" rx="10" fill="${theme.accent}" fill-opacity="0.15" stroke="${theme.accent}" stroke-width="1.5"/>
        <circle cx="64" cy="64" r="10" fill="${theme.accent}"/>
        <text x="100" y="60" fill="#F8FAFC" font-size="16" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeAction}</text>
        <text x="100" y="78" fill="${theme.accent}" font-size="11" font-weight="600" font-family="monospace">${theme.category.toUpperCase()}</text>
        
        <line x1="40" y1="108" x2="320" y2="108" stroke="#1E293B" stroke-width="1"/>
        
        <g transform="translate(40, 128)">
          <g transform="translate(0, 0)">
            <circle cx="6" cy="8" r="3" fill="${theme.accent}"/>
            <text x="18" y="12" fill="#E2E8F0" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Mode: Production Pipeline</text>
          </g>
          <g transform="translate(0, 36)">
            <circle cx="6" cy="8" r="3" fill="${theme.accent}"/>
            <text x="18" y="12" fill="#E2E8F0" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Engine: Verified Model Stack</text>
          </g>
          <g transform="translate(0, 72)">
            <circle cx="6" cy="8" r="3" fill="${theme.accent}"/>
            <text x="18" y="12" fill="#E2E8F0" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Fidelity: Master High-Res Mode</text>
          </g>
          <g transform="translate(0, 108)">
            <circle cx="6" cy="8" r="3" fill="#10B981"/>
            <text x="18" y="12" fill="#34D399" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Status: Ready for Staging</text>
          </g>
        </g>

        <!-- Right Configuration Checklist -->
        <rect x="368" y="24" width="328" height="252" rx="10" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
        <text x="392" y="52" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" font-family="monospace">STAGE SPECIFICATIONS</text>
        
        <rect x="392" y="68" width="280" height="48" rx="8" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
        <text x="408" y="90" fill="#94A3B8" font-size="10" font-family="monospace">INPUT PROTOCOL</text>
        <text x="408" y="106" fill="#F8FAFC" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeAction}</text>

        <rect x="392" y="126" width="280" height="48" rx="8" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
        <text x="408" y="148" fill="#94A3B8" font-size="10" font-family="monospace">EXPECTED OUTCOME</text>
        <text x="408" y="164" fill="#38BDF8" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeResult.slice(0, 42)}...</text>

        <rect x="392" y="184" width="280" height="68" rx="8" fill="#0F1B30" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.4"/>
        <text x="408" y="206" fill="${theme.accent}" font-size="10" font-weight="700" font-family="monospace">CREATOR GUIDANCE NOTE</text>
        <text x="408" y="226" fill="#CBD5E1" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeTip.slice(0, 48)}...</text>
      </g>
    `;
  } else if (schematicType === 'staging_input') {
    centerGraphic = `
      <!-- Staging & Reference Input Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>
        
        <!-- Floor / Grid Perspective -->
        <g stroke="#1E293B" stroke-opacity="0.7" stroke-width="1">
          <line x1="80" y1="260" x2="320" y2="40"/>
          <line x1="180" y1="260" x2="420" y2="40"/>
          <line x1="280" y1="260" x2="520" y2="40"/>
          <line x1="120" y1="120" x2="600" y2="120"/>
          <line x1="80" y1="200" x2="640" y2="200"/>
        </g>

        <!-- Center Subject / Target Pedestal -->
        <ellipse cx="360" cy="180" rx="90" ry="38" fill="#080F1E" stroke="${theme.accent}" stroke-width="1.8"/>
        <ellipse cx="360" cy="170" rx="72" ry="26" fill="#13233F" stroke="#60A5FA" stroke-width="1.2"/>
        <rect x="338" y="90" width="44" height="74" rx="8" fill="${theme.accent}" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="360" y="132" fill="#080F1E" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">HERO</text>

        <!-- Key Lighting / Input Ray 1 (Left) -->
        <g transform="translate(110, 50)">
          <polygon points="0,15 45,0 55,30 10,45" fill="${theme.accent}" fill-opacity="0.3" stroke="${theme.accent}" stroke-width="1.5"/>
          <line x1="45" y1="20" x2="260" y2="130" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.8"/>
          <circle cx="25" cy="22" r="5" fill="#FFFFFF"/>
          <text x="0" y="-8" fill="#93C5FD" font-size="11" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Key Illumination Vector</text>
        </g>

        <!-- Rim Lighting / Input Ray 2 (Right) -->
        <g transform="translate(560, 60)">
          <circle cx="20" cy="20" r="16" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="10" y1="30" x2="-140" y2="100" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.8"/>
          <text x="-40" y="-8" fill="#FCD34D" font-size="11" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Edge Contrast &amp; Separation</text>
        </g>

        <!-- Bottom Staging Metadata Bar -->
        <rect x="24" y="246" width="672" height="38" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
        <circle cx="44" cy="265" r="4" fill="${theme.accent}"/>
        <text x="56" y="269" fill="#E2E8F0" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Staging Specification: ${safeTitle}</text>
        <rect x="548" y="252" width="136" height="26" rx="6" fill="${theme.accent}" fill-opacity="0.2"/>
        <text x="616" y="269" fill="#93C5FD" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">CALIBRATED ✓</text>
      </g>
    `;
  } else if (schematicType === 'optics_motion') {
    centerGraphic = `
      <!-- Optics, Camera & Motion Trajectory Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>

        <!-- Left Optics / Orbit Dial Card -->
        <rect x="24" y="24" width="320" height="252" rx="10" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
        <text x="44" y="52" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" font-family="monospace">TRAJECTORY / OPTICS DIAL</text>

        <!-- Circular Trajectory Graphic -->
        <g transform="translate(184, 160)">
          <!-- Outer Track -->
          <circle cx="0" cy="0" r="70" fill="none" stroke="#1E293B" stroke-width="8"/>
          <circle cx="0" cy="0" r="60" fill="#060C18" stroke="${theme.accent}" stroke-width="2" stroke-dasharray="6,4"/>
          <!-- Hero Center -->
          <circle cx="0" cy="0" r="18" fill="#13233F" stroke="#60A5FA" stroke-width="1.5"/>
          <rect x="-8" y="-12" width="16" height="24" rx="3" fill="${theme.accent}"/>
          
          <!-- Orbit Trajectory Arrow -->
          <path d="M 0 -60 A 60 60 0 0 1 60 0" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
          <polygon points="60,0 52,-8 58,-12" fill="#38BDF8"/>
          
          <!-- Camera Marker -->
          <circle cx="0" cy="-60" r="7" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5"/>
          <text x="0" y="-72" fill="#F59E0B" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">CAM</text>
          
          <!-- Degree Markers -->
          <text x="68" y="4" fill="#94A3B8" font-size="9" font-family="monospace">90°</text>
          <text x="-4" y="76" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="monospace">180°</text>
          <text x="-76" y="4" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">270°</text>
        </g>

        <!-- Right Motion Vectors & Controls -->
        <rect x="368" y="24" width="328" height="252" rx="10" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
        <text x="392" y="52" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" font-family="monospace">MOTION &amp; OPTICS MATRIX</text>

        <!-- Card 1 -->
        <rect x="392" y="68" width="280" height="54" rx="8" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
        <text x="408" y="90" fill="#94A3B8" font-size="10" font-family="monospace">PRIMARY AXIS</text>
        <text x="408" y="110" fill="#38BDF8" font-size="13" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeTitle}</text>

        <!-- Card 2 -->
        <rect x="392" y="132" width="280" height="54" rx="8" fill="#0F1B30" stroke="${theme.accent}" stroke-width="1"/>
        <text x="408" y="154" fill="#94A3B8" font-size="10" font-family="monospace">SPEED &amp; VELOCITY RATIO</text>
        <text x="408" y="174" fill="#F8FAFC" font-size="13" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Smooth Stabilized Continuous Sweep</text>

        <!-- Card 3 -->
        <rect x="392" y="196" width="280" height="60" rx="8" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
        <text x="408" y="218" fill="#94A3B8" font-size="10" font-family="monospace">CRITICAL REFINEMENT TIP</text>
        <text x="408" y="238" fill="#34D399" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeTip.slice(0, 44)}...</text>
      </g>
    `;
  } else if (schematicType === 'prompt_custom') {
    centerGraphic = `
      <!-- Prompt Customization Console Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>

        <!-- Prompt Terminal Box -->
        <rect x="24" y="24" width="672" height="198" rx="10" fill="#060C17" stroke="#2563EB" stroke-width="1.2"/>
        
        <!-- Terminal Header -->
        <rect x="24" y="24" width="672" height="32" rx="10" fill="#0B162C"/>
        <text x="40" y="45" fill="#93C5FD" font-size="11" font-weight="700" font-family="monospace">PRODUCTION PROMPT WORKSPACE</text>
        <rect x="584" y="30" width="100" height="20" rx="4" fill="${theme.accent}" fill-opacity="0.25"/>
        <text x="634" y="44" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">STANDARDIZED</text>

        <!-- Prompt Text Rows -->
        <g transform="translate(44, 76)">
          <text x="0" y="20" fill="#E2E8F0" font-size="13" font-family="monospace">Directive: <tspan fill="${theme.accent}" font-weight="700">[${safeTitle}]</tspan></text>
          <text x="0" y="46" fill="#94A3B8" font-size="12" font-family="monospace">${safeDesc.slice(0, 75)}...</text>
          <text x="0" y="70" fill="#CBD5E1" font-size="12" font-family="monospace">${safeTip.slice(0, 80)}...</text>

          <!-- Parameter highlight box -->
          <rect x="0" y="92" width="632" height="34" rx="6" fill="#0E2140" stroke="${theme.accent}" stroke-width="1"/>
          <text x="14" y="114" fill="#F59E0B" font-size="11" font-weight="700" font-family="monospace">Parameters: <tspan fill="#38BDF8">Engine-Optimized Precision Flags Enabled ✓</tspan></text>
        </g>

        <!-- Bottom Status Line -->
        <g transform="translate(24, 238)">
          <rect width="210" height="38" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
          <circle cx="18" cy="19" r="4" fill="#10B981"/>
          <text x="32" y="23" fill="#E2E8F0" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Placeholders Injected: Ready</text>

          <rect x="226" width="220" height="38" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
          <text x="242" y="23" fill="#94A3B8" font-size="11" font-family="monospace">Adherence Score: 99.4%</text>

          <rect x="462" width="234" height="38" rx="8" fill="${theme.accent}"/>
          <text x="579" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Stage Prompt Execution →</text>
        </g>
      </g>
    `;
  } else if (schematicType === 'review_inspect') {
    centerGraphic = `
      <!-- Review & Quality Inspection Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>

        <!-- 3-Viewport / Grid Layout -->
        <g transform="translate(24, 24)">
          <!-- Item 1 -->
          <g transform="translate(0, 0)">
            <rect width="216" height="118" rx="8" fill="#070D1A" stroke="${theme.accent}" stroke-width="1.5"/>
            <rect x="12" y="12" width="192" height="60" rx="4" fill="#13233F" fill-opacity="0.6"/>
            <text x="108" y="46" fill="#38BDF8" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">VIEWPORT / DESKTOP</text>
            <text x="14" y="98" fill="#E2E8F0" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Primary Candidate</text>
            <circle cx="196" cy="98" r="6" fill="#10B981"/>
          </g>

          <!-- Item 2 -->
          <g transform="translate(228, 0)">
            <rect width="216" height="118" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
            <rect x="12" y="12" width="192" height="60" rx="4" fill="#0B1424"/>
            <text x="108" y="46" fill="#94A3B8" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">VIEWPORT / TABLET</text>
            <text x="14" y="98" fill="#94A3B8" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Responsive Wrap</text>
          </g>

          <!-- Item 3 -->
          <g transform="translate(0, 130)">
            <rect width="216" height="118" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
            <rect x="12" y="12" width="192" height="60" rx="4" fill="#0B1424"/>
            <text x="108" y="46" fill="#94A3B8" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">VIEWPORT / MOBILE</text>
            <text x="14" y="98" fill="#94A3B8" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Touch Target Check</text>
          </g>

          <!-- Item 4 -->
          <g transform="translate(228, 130)">
            <rect width="216" height="118" rx="8" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
            <rect x="12" y="12" width="192" height="60" rx="4" fill="#0B1424"/>
            <text x="108" y="46" fill="#94A3B8" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">ASPECT RATIO / OPTICS</text>
            <text x="14" y="98" fill="#94A3B8" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Edge Contrast Audit</text>
          </g>
        </g>

        <!-- Right Audit Sidebar -->
        <g transform="translate(488, 24)">
          <rect width="208" height="248" rx="10" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
          <text x="16" y="28" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" font-family="monospace">QUALITY AUDIT CHECK</text>

          <rect x="16" y="44" width="176" height="46" rx="6" fill="#0F1B30" stroke="${theme.accent}" stroke-width="1"/>
          <text x="26" y="64" fill="#93C5FD" font-size="10" font-family="monospace">ACTIVE VARIANT</text>
          <text x="26" y="80" fill="#F8FAFC" font-size="12" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Top Fidelity Match ✓</text>

          <rect x="16" y="100" width="176" height="74" rx="6" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
          <text x="26" y="120" fill="#94A3B8" font-size="10" font-family="monospace">AUDIT CRITERIA</text>
          <text x="26" y="138" fill="#CBD5E1" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">• Edge crispness clean</text>
          <text x="26" y="156" fill="#CBD5E1" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">• Surface reflection true</text>

          <rect x="16" y="186" width="176" height="44" rx="8" fill="${theme.accent}"/>
          <text x="104" y="213" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Confirm &amp; Proceed</text>
        </g>
      </g>
    `;
  } else {
    // export_delivery
    centerGraphic = `
      <!-- Master Delivery & Export Schematic -->
      <g transform="translate(40, 140)">
        <rect width="720" height="300" rx="14" fill="#0C1425" stroke="#1E293B" stroke-width="1.2"/>

        <!-- Left Finished Asset Preview Canvas -->
        <rect x="24" y="24" width="360" height="252" rx="10" fill="#070D1A" stroke="${theme.accent}" stroke-width="1.4"/>
        <ellipse cx="204" cy="190" rx="110" ry="32" fill="#13233F" opacity="0.6"/>
        <rect x="164" y="60" width="80" height="120" rx="12" fill="#1E3A8A" stroke="#60A5FA" stroke-width="1.5"/>
        <circle cx="204" cy="95" r="16" fill="${theme.accent}" fill-opacity="0.4"/>
        <text x="204" y="145" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">MASTER</text>

        <!-- Compliance & Verification Pill -->
        <rect x="40" y="40" width="168" height="28" rx="6" fill="#070D1A" stroke="#10B981" stroke-width="1"/>
        <circle cx="54" cy="54" r="4" fill="#10B981"/>
        <text x="66" y="58" fill="#34D399" font-size="10" font-weight="700" font-family="monospace">100% SPEC COMPLIANT</text>

        <!-- Right Export Parameters & Actions -->
        <rect x="404" y="24" width="292" height="252" rx="10" fill="#070D1A" stroke="#1E293B" stroke-width="1"/>
        <text x="424" y="52" fill="#94A3B8" font-size="11" font-weight="700" letter-spacing="1" font-family="monospace">DELIVERY MANIFEST</text>

        <rect x="424" y="68" width="252" height="46" rx="8" fill="#0F1B30" stroke="#1E293B" stroke-width="1"/>
        <text x="438" y="88" fill="#94A3B8" font-size="10" font-family="monospace">TARGET OUTPUT</text>
        <text x="438" y="104" fill="#F8FAFC" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeTitle}</text>

        <rect x="424" y="122" width="252" height="66" rx="8" fill="#0F1B30" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.4"/>
        <text x="438" y="142" fill="${theme.accent}" font-size="10" font-weight="700" font-family="monospace">EXPECTED ASSET DELIVERABLE</text>
        <text x="438" y="160" fill="#CBD5E1" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${safeResult.slice(0, 50)}...</text>

        <rect x="424" y="200" width="252" height="44" rx="8" fill="${theme.accent}"/>
        <text x="550" y="227" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif">Download Production Master ↓</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060A14"/>
      <stop offset="50%" stop-color="#091224"/>
      <stop offset="100%" stop-color="#070C18"/>
    </linearGradient>
    <pattern id="gridDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#1E293B" fill-opacity="0.5"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="500" rx="16" fill="url(#bgGrad)"/>
  <rect width="800" height="500" rx="16" fill="url(#gridDots)"/>
  <rect width="800" height="500" rx="16" fill="none" stroke="#1E293B" stroke-width="1.5"/>

  <!-- Step Header (Clean, Authentic, No Fabricated Browser Controls) -->
  <g transform="translate(40, 36)">
    <!-- Top Step Pill -->
    <rect x="0" y="0" width="160" height="24" rx="6" fill="${theme.accent}" fill-opacity="0.15" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.6"/>
    <text x="12" y="16" fill="${theme.accent}" font-size="10" font-weight="800" letter-spacing="1" font-family="monospace">STEP ${stepNum} // OF ${String(totalSteps).padStart(2, '0')}</text>

    <!-- Right Side Tool Indicator -->
    <rect x="580" y="0" width="140" height="24" rx="6" fill="#0C1425" stroke="#1E293B" stroke-width="1"/>
    <circle cx="592" cy="12" r="4" fill="${theme.accent}"/>
    <text x="604" y="16" fill="#E2E8F0" font-size="10" font-weight="600" font-family="monospace">${escapeXml(theme.tool)}</text>

    <!-- Main Step Title -->
    <text x="0" y="52" fill="#F8FAFC" font-size="20" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${safeTitle}</text>
    <!-- Subtitle / Action directive -->
    <text x="0" y="74" fill="#94A3B8" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${safeDesc.slice(0, 85)}...</text>
  </g>

  ${centerGraphic}
</svg>`;
}

async function run() {
  console.log('Generating authentic, template-specific SVGs for all published templates...');
  let count = 0;

  for (const [tplId, steps] of Object.entries(ALL_GUIDANCE_CATALOG)) {
    const tplDir = path.join(outputBase, tplId);
    if (!fs.existsSync(tplDir)) {
      fs.mkdirSync(tplDir, { recursive: true });
    }

    for (const step of steps) {
      const svg = generateSvgContent(tplId, step, steps.length);
      const filePath = path.join(tplDir, `step-${step.step}.svg`);
      fs.writeFileSync(filePath, svg, 'utf8');
      count++;
    }
  }

  console.log(`Successfully generated ${count} authentic, tailored guidance SVGs across all templates!`);
}

run();
