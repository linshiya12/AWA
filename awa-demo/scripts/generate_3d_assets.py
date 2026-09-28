import os

assets = {
    'tpl_3d_robotics_poster.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a10"/>
      <stop offset="50%" stop-color="#0d1322"/>
      <stop offset="100%" stop-color="#05070c"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#ff6b00" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>
  
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <circle cx="640" cy="340" r="380" fill="url(#glow)"/>
  
  <!-- Browser Chrome HUD -->
  <rect x="40" y="30" width="1200" height="52" rx="16" fill="#0d1424" stroke="#1e293b" stroke-width="1.5" fill-opacity="0.85"/>
  <circle cx="72" cy="56" r="6" fill="#f43f5e"/>
  <circle cx="94" cy="56" r="6" fill="#fbbf24"/>
  <circle cx="116" cy="56" r="6" fill="#10b981"/>
  <rect x="150" y="42" width="280" height="28" rx="8" fill="#070c18" stroke="#334155" stroke-width="1"/>
  <text x="170" y="60" fill="#94a3b8" font-family="monospace" font-size="12">https://nexus-robotics.awa/3d-canvas</text>
  
  <text x="960" y="61" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">WEBGL 2.0 • 60 FPS • THREE.JS</text>
  
  <!-- 3D Viewport Controls HUD -->
  <rect x="60" y="110" width="220" height="380" rx="16" fill="#090d16" stroke="#1e293b" stroke-width="1" fill-opacity="0.8"/>
  <text x="80" y="145" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">ASSEMBLY TELEMETRY</text>
  <text x="80" y="170" fill="#64748b" font-family="sans-serif" font-size="11">Part ID: RHO-904 Titan Arm</text>
  
  <rect x="80" y="200" width="180" height="32" rx="8" fill="#1e293b" stroke="#ff6b00" stroke-width="1"/>
  <text x="95" y="221" fill="#ff8c38" font-family="sans-serif" font-size="11" font-weight="bold">EXPLODED VIEW: ACTIVE</text>
  
  <rect x="80" y="245" width="180" height="32" rx="8" fill="#0d1424" stroke="#334155" stroke-width="1"/>
  <text x="95" y="266" fill="#cbd5e1" font-family="sans-serif" font-size="11">X-Ray Shading: OFF</text>
  
  <rect x="80" y="290" width="180" height="32" rx="8" fill="#0d1424" stroke="#334155" stroke-width="1"/>
  <text x="95" y="311" fill="#cbd5e1" font-family="sans-serif" font-size="11">Torque Simulation: 420 Nm</text>
  
  <!-- Center 3D Robotic Arm Wireframe Schematic -->
  <g transform="translate(640, 360)">
    <!-- Orbital Rings -->
    <ellipse cx="0" cy="0" rx="240" ry="120" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6 8" opacity="0.4"/>
    <ellipse cx="0" cy="0" rx="180" ry="220" fill="none" stroke="#ff6b00" stroke-width="1.5" stroke-dasharray="12 12" opacity="0.35"/>
    
    <!-- Central Robotic Core Structure -->
    <polygon points="0,-140 90,-70 90,70 0,140 -90,70 -90,-70" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.8"/>
    <polygon points="0,-100 65,-50 65,50 0,100 -65,50 -65,-50" fill="#0f172a" fill-opacity="0.7" stroke="#ff6b00" stroke-width="2"/>
    
    <line x1="0" y1="-140" x2="0" y2="140" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.5"/>
    <line x1="-90" y1="0" x2="90" y2="0" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.5"/>
    <circle cx="0" cy="0" r="35" fill="#ff6b00" fill-opacity="0.8"/>
    <circle cx="0" cy="0" r="16" fill="#ffffff"/>
    
    <!-- Exploded Callout Lines -->
    <line x1="90" y1="-70" x2="170" y2="-120" stroke="#ff6b00" stroke-width="1.5" stroke-dasharray="4 4"/>
    <circle cx="170" cy="-120" r="4" fill="#ff6b00"/>
    <text x="180" y="-115" fill="#ff8c38" font-family="monospace" font-size="12" font-weight="bold">SERVO GEARBOX v4</text>
    
    <line x1="-90" y1="70" x2="-180" y2="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4"/>
    <circle cx="-180" cy="110" r="4" fill="#38bdf8"/>
    <text x="-310" y="115" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">OPTICAL ENCODER 4K</text>
  </g>
  
  <!-- Bottom HUD Orbit Bar -->
  <rect x="440" y="630" width="400" height="48" rx="24" fill="#0d1424" stroke="#38bdf8" stroke-width="1.5" fill-opacity="0.9"/>
  <text x="475" y="660" fill="#f8fafc" font-family="sans-serif" font-size="13" font-weight="bold">DRAG TO ORBIT 360° • SCROLL TO ZOOM</text>
</svg>''',

    'tpl_3d_robotics_mobile.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <linearGradient id="mb_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a10"/>
      <stop offset="60%" stop-color="#0d1322"/>
      <stop offset="100%" stop-color="#05070c"/>
    </linearGradient>
  </defs>
  <rect width="390" height="844" fill="url(#mb_bg)"/>
  <!-- Status bar -->
  <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">9:41</text>
  <rect x="290" y="28" width="60" height="14" rx="7" fill="#1e293b"/>
  <!-- Header -->
  <text x="24" y="90" fill="#ff6b00" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">TITAN RHO-904</text>
  <text x="24" y="118" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">3D Hardware Config</text>
  <!-- 3D Canvas Area -->
  <rect x="20" y="140" width="350" height="420" rx="20" fill="#0b0f19" stroke="#1e293b" stroke-width="1"/>
  <g transform="translate(195, 340)">
    <circle cx="0" cy="0" r="90" fill="none" stroke="#ff6b00" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
    <polygon points="0,-70 50,-35 50,35 0,70 -50,35 -50,-35" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="0" cy="0" r="22" fill="#ff6b00"/>
  </g>
  <rect x="70" y="520" width="250" height="32" rx="16" fill="#1e293b" stroke="#ff6b00" stroke-width="1"/>
  <text x="100" y="541" fill="#fff" font-family="sans-serif" font-size="11" font-weight="bold">TOUCH TO ROTATE 360°</text>
  <!-- Bottom Specs Drawer -->
  <rect x="20" y="580" width="350" height="230" rx="20" fill="#111827" stroke="#1e293b" stroke-width="1"/>
  <text x="40" y="616" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">Actuator Dynamics</text>
  <text x="40" y="642" fill="#94a3b8" font-family="sans-serif" font-size="12">Peak Torque: 420 Nm • Weight: 4.8 kg</text>
  <rect x="40" y="670" width="310" height="44" rx="12" fill="#ff6b00"/>
  <text x="120" y="698" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">Export CAD Mesh</text>
</svg>''',

    'tpl_3d_spatial_poster.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="sp_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050814"/>
      <stop offset="50%" stop-color="#0c1028"/>
      <stop offset="100%" stop-color="#03050d"/>
    </linearGradient>
    <radialGradient id="sp_glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#c084fc" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <rect width="1280" height="720" fill="url(#sp_bg)"/>
  <circle cx="640" cy="360" r="350" fill="url(#sp_glow)"/>
  
  <!-- Browser Chrome HUD -->
  <rect x="40" y="30" width="1200" height="52" rx="16" fill="#0d1428" stroke="#1e293b" stroke-width="1.5" fill-opacity="0.85"/>
  <circle cx="72" cy="56" r="6" fill="#f43f5e"/>
  <circle cx="94" cy="56" r="6" fill="#fbbf24"/>
  <circle cx="116" cy="56" r="6" fill="#10b981"/>
  <text x="160" y="61" fill="#e2e8f0" font-family="sans-serif" font-size="14" font-weight="bold">AURA SPATIAL SOUNDSTAGE</text>
  <text x="980" y="61" fill="#818cf8" font-family="monospace" font-size="11" font-weight="bold">BINAURAL AUDIO • 3D NODES</text>
  
  <!-- Interactive Audio Nodes and Sound Wave Particles -->
  <g transform="translate(640, 360)">
    <!-- Ripple Waves -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="#818cf8" stroke-width="2" opacity="0.8"/>
    <circle cx="0" cy="0" r="160" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0.6" stroke-dasharray="6 6"/>
    <circle cx="0" cy="0" r="240" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.4"/>
    <circle cx="0" cy="0" r="320" fill="none" stroke="#c084fc" stroke-width="0.8" opacity="0.25" stroke-dasharray="10 10"/>
    
    <!-- Central Sound Core -->
    <circle cx="0" cy="0" r="40" fill="#6366f1" opacity="0.9"/>
    <circle cx="0" cy="0" r="20" fill="#ffffff"/>
    
    <!-- Soundstage Spatial Nodes -->
    <g transform="translate(-170, -90)">
      <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="0" cy="0" r="8" fill="#38bdf8"/>
      <text x="32" y="5" fill="#e2e8f0" font-family="sans-serif" font-size="11" font-weight="bold">L-Front (Ambisonics)</text>
    </g>
    
    <g transform="translate(180, -80)">
      <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
      <circle cx="0" cy="0" r="8" fill="#f43f5e"/>
      <text x="32" y="5" fill="#e2e8f0" font-family="sans-serif" font-size="11" font-weight="bold">R-Front (Atmosphere)</text>
    </g>
    
    <g transform="translate(0, 180)">
      <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <circle cx="0" cy="0" r="8" fill="#10b981"/>
      <text x="-70" y="36" fill="#e2e8f0" font-family="sans-serif" font-size="11" font-weight="bold">Sub-Bass Resonator (24Hz)</text>
    </g>
  </g>
  
  <!-- Floating Glass Dock -->
  <rect x="360" y="620" width="560" height="56" rx="28" fill="#090d1c" stroke="#818cf8" stroke-width="1.5" fill-opacity="0.9"/>
  <text x="390" y="654" fill="#cbd5e1" font-family="sans-serif" font-size="12" font-weight="bold">SPATIAL SOUNDSTAGE CANVAS • CLICK ANYWHERE TO EMIT ACOUSTIC WAVES</text>
</svg>''',

    'tpl_3d_spatial_mobile.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <linearGradient id="sp_m_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050814"/>
      <stop offset="50%" stop-color="#0c1028"/>
      <stop offset="100%" stop-color="#03050d"/>
    </linearGradient>
  </defs>
  <rect width="390" height="844" fill="url(#sp_m_bg)"/>
  <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">9:41</text>
  <text x="24" y="90" fill="#818cf8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">AURA SPATIAL</text>
  <text x="24" y="118" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Binaural 3D Canvas</text>
  <rect x="20" y="140" width="350" height="460" rx="20" fill="#0b0f1d" stroke="#1e293b" stroke-width="1"/>
  <g transform="translate(195, 360)">
    <circle cx="0" cy="0" r="100" fill="none" stroke="#818cf8" stroke-width="1.5" opacity="0.6"/>
    <circle cx="0" cy="0" r="50" fill="none" stroke="#c084fc" stroke-width="1" stroke-dasharray="4 4"/>
    <circle cx="0" cy="0" r="24" fill="#6366f1"/>
    <circle cx="-60" cy="-40" r="12" fill="#38bdf8"/>
    <circle cx="60" cy="50" r="12" fill="#f43f5e"/>
  </g>
  <rect x="30" y="630" width="330" height="70" rx="18" fill="#121829" stroke="#818cf8" stroke-width="1"/>
  <text x="50" y="660" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">Active Spatial Field: Stereo 3D</text>
  <text x="50" y="682" fill="#94a3b8" font-family="sans-serif" font-size="11">Move phone to shift gyro acoustic angle</text>
</svg>''',

    'tpl_3d_timepiece_poster.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="tp_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0c"/>
      <stop offset="50%" stop-color="#121115"/>
      <stop offset="100%" stop-color="#070709"/>
    </linearGradient>
    <radialGradient id="tp_gold" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#927220" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <rect width="1280" height="720" fill="url(#tp_bg)"/>
  <circle cx="640" cy="360" r="340" fill="url(#tp_gold)"/>
  
  <!-- Minimalist Luxury Nav -->
  <rect x="40" y="30" width="1200" height="52" rx="16" fill="#121115" stroke="#26232d" stroke-width="1.5" fill-opacity="0.85"/>
  <text x="70" y="62" fill="#e5d5ac" font-family="serif" font-size="17" font-weight="bold" letter-spacing="4">AURÉLIS GENÈVE</text>
  <text x="540" y="61" fill="#a39b89" font-family="sans-serif" font-size="11" letter-spacing="2">CALIBRE 1894 • TOURBILLON 3D</text>
  <text x="1040" y="61" fill="#d4af37" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">CONFIGURE BESPOKE →</text>
  
  <!-- 3D Horology Watch Viewport -->
  <g transform="translate(640, 360)">
    <path d="M -50 -320 L 50 -320 L 60 -190 L -60 -190 Z" fill="#18161c" stroke="#3d372e" stroke-width="1"/>
    <path d="M -60 190 L 60 190 L 50 320 L -50 320 Z" fill="#18161c" stroke="#3d372e" stroke-width="1"/>
    
    <circle cx="0" cy="0" r="185" fill="#1c1a21" stroke="#d4af37" stroke-width="3"/>
    <circle cx="0" cy="0" r="172" fill="#131217" stroke="#8a7029" stroke-width="1.5" stroke-dasharray="2 8"/>
    <ellipse cx="-50" cy="-50" rx="120" ry="80" fill="#ffffff" fill-opacity="0.04" transform="rotate(-35 -50 -50)"/>
    
    <line x1="0" y1="-160" x2="0" y2="-140" stroke="#d4af37" stroke-width="3"/>
    <line x1="0" y1="160" x2="0" y2="140" stroke="#d4af37" stroke-width="3"/>
    <line x1="-160" y1="0" x2="-140" y2="0" stroke="#d4af37" stroke-width="3"/>
    <line x1="160" y1="0" x2="140" y2="0" stroke="#d4af37" stroke-width="3"/>
    
    <circle cx="0" cy="70" r="45" fill="#0d0c10" stroke="#d4af37" stroke-width="1.5"/>
    <polygon points="0,40 18,75 -18,75" fill="none" stroke="#e5d5ac" stroke-width="1.5"/>
    <circle cx="0" cy="70" r="12" fill="#a855f7"/>
    
    <line x1="0" y1="0" x2="-55" y2="-65" stroke="#e5d5ac" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="70" y2="-30" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="8" fill="#d4af37"/>
  </g>
  
  <!-- Right Material Configurator Dock -->
  <rect x="1010" y="160" width="210" height="320" rx="16" fill="#121115" stroke="#2e2a22" stroke-width="1.5" fill-opacity="0.9"/>
  <text x="1030" y="195" fill="#e5d5ac" font-family="sans-serif" font-size="12" font-weight="bold">CASE FINISH</text>
  
  <rect x="1030" y="215" width="170" height="36" rx="8" fill="#1d1b22" stroke="#d4af37" stroke-width="1"/>
  <circle cx="1050" cy="233" r="7" fill="#d4af37"/>
  <text x="1068" y="237" fill="#f8fafc" font-family="sans-serif" font-size="11">Rose Gold 18k</text>
  
  <rect x="1030" y="260" width="170" height="36" rx="8" fill="#16151a" stroke="#333" stroke-width="1"/>
  <circle cx="1050" cy="278" r="7" fill="#94a3b8"/>
  <text x="1068" y="282" fill="#94a3b8" font-family="sans-serif" font-size="11">Brushed Titanium</text>
  
  <rect x="1030" y="305" width="170" height="36" rx="8" fill="#16151a" stroke="#333" stroke-width="1"/>
  <circle cx="1050" cy="323" r="7" fill="#1e293b"/>
  <text x="1068" y="327" fill="#94a3b8" font-family="sans-serif" font-size="11">Ceramic Obsidian</text>
</svg>''',

    'tpl_3d_timepiece_mobile.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <linearGradient id="tp_m_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0c"/>
      <stop offset="50%" stop-color="#121115"/>
      <stop offset="100%" stop-color="#070709"/>
    </linearGradient>
  </defs>
  <rect width="390" height="844" fill="url(#tp_m_bg)"/>
  <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">9:41</text>
  <text x="24" y="90" fill="#d4af37" font-family="serif" font-size="14" font-weight="bold" letter-spacing="3">AURÉLIS GENÈVE</text>
  <text x="24" y="118" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Calibre 1894 3D</text>
  <rect x="20" y="140" width="350" height="420" rx="20" fill="#100f14" stroke="#2e2a22" stroke-width="1"/>
  <g transform="translate(195, 350)">
    <circle cx="0" cy="0" r="100" fill="#18161c" stroke="#d4af37" stroke-width="2"/>
    <circle cx="0" cy="35" r="26" fill="#0d0c10" stroke="#d4af37" stroke-width="1"/>
    <line x1="0" y1="0" x2="-35" y2="-40" stroke="#e5d5ac" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="45" y2="-15" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
  </g>
  <rect x="30" y="580" width="330" height="180" rx="16" fill="#16151b" stroke="#2e2a22" stroke-width="1"/>
  <text x="45" y="612" fill="#d4af37" font-family="sans-serif" font-size="12" font-weight="bold">CASE METALLURGY</text>
  <rect x="45" y="630" width="300" height="40" rx="8" fill="#201e26" stroke="#d4af37" stroke-width="1"/>
  <text x="75" y="655" fill="#ffffff" font-family="sans-serif" font-size="13">18K Honey Gold (Scroll to Inspect)</text>
</svg>''',

    'tpl_3d_pavilion_poster.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="pv_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d14"/>
      <stop offset="50%" stop-color="#0e1520"/>
      <stop offset="100%" stop-color="#070a0e"/>
    </linearGradient>
    <radialGradient id="pv_sun" cx="60%" cy="35%" r="45%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <rect width="1280" height="720" fill="url(#pv_bg)"/>
  <circle cx="750" cy="300" r="350" fill="url(#pv_sun)"/>
  
  <!-- Minimalist Studio Nav -->
  <rect x="40" y="30" width="1200" height="52" rx="16" fill="#0d1420" stroke="#1e293b" stroke-width="1.5" fill-opacity="0.85"/>
  <text x="70" y="62" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="2">STUDIO KHORA ARCHITECTURE</text>
  <text x="540" y="61" fill="#94a3b8" font-family="sans-serif" font-size="11">MONOLITHIC CONCRETE PAVILION • 3D WALKTHROUGH</text>
  <text x="1060" y="61" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">SUN SIMULATOR: 16:40</text>
  
  <!-- 3D Perspective Isometric Pavilion Structure -->
  <g transform="translate(640, 380)">
    <path d="M -450 180 L 0 50 L 450 180 L 0 310 Z" fill="#0b101a" stroke="#1e293b" stroke-width="1"/>
    <line x1="-300" y1="140" x2="150" y2="270" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.6"/>
    <line x1="-150" y1="90" x2="300" y2="220" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.6"/>
    
    <polygon points="-240,60 -120,0 -120,-160 -240,-100" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <polygon points="-260,-90 60,-220 280,-140 -40,-10" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <polygon points="-110,-10 160,-120 160,30 -110,140" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/>
    <polygon points="-180,90 220,-30 320,80 -80,200" fill="#05080e" fill-opacity="0.6"/>
    <ellipse cx="-50" cy="180" rx="160" ry="40" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1"/>
  </g>
  
  <!-- Walkthrough Orbit Controls -->
  <rect x="440" y="630" width="400" height="48" rx="24" fill="#0d1420" stroke="#38bdf8" stroke-width="1.5" fill-opacity="0.9"/>
  <text x="480" y="660" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">DRAG TO WALKTHROUGH • WASD TO FLY</text>
</svg>''',

    'tpl_3d_pavilion_mobile.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <linearGradient id="pv_m_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d14"/>
      <stop offset="50%" stop-color="#0e1520"/>
      <stop offset="100%" stop-color="#070a0e"/>
    </linearGradient>
  </defs>
  <rect width="390" height="844" fill="url(#pv_m_bg)"/>
  <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">9:41</text>
  <text x="24" y="90" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1">STUDIO KHORA</text>
  <text x="24" y="118" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Pavilion 3D Tour</text>
  <rect x="20" y="140" width="350" height="440" rx="20" fill="#0c111a" stroke="#1e293b" stroke-width="1"/>
  <g transform="translate(195, 360)">
    <polygon points="-100,20 -40,-10 -40,-80 -100,-50" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <polygon points="-110,-45 20,-110 110,-70 -20,-5" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <polygon points="-40,-5 60,-60 60,15 -40,70" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1.5"/>
  </g>
  <rect x="30" y="600" width="330" height="150" rx="16" fill="#111722" stroke="#1e293b" stroke-width="1"/>
  <text x="45" y="632" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold">LIGHTING CONDITION</text>
  <text x="45" y="658" fill="#fff" font-family="sans-serif" font-size="13">Equinox Golden Hour (17:30)</text>
</svg>'''
}

os.makedirs('public/images/templates', exist_ok=True)
for filename, content in assets.items():
    path = os.path.join('public/images/templates', filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Generated {filename} ({len(content)} bytes)')
