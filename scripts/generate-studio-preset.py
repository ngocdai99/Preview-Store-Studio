import json, urllib.parse, os

def enc_svg(s):
    # clean extra spaces and newlines
    clean = " ".join(line.strip() for line in s.strip().splitlines())
    return "data:image/svg+xml;utf8," + urllib.parse.quote(clean)

# 1. ICON SVG
icon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1024" height="1024">
  <defs>
    <linearGradient id="c6-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="c6-front" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="url(#c6-bg)"/>
  <rect x="10.5" y="4.5" width="16.5" height="18" rx="2.5" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="1.6"/>
  <circle cx="18.75" cy="6.2" r="0.65" fill="#ffffff"/>
  <rect x="12.5" y="8.5" width="6" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="19.5" y="8.5" width="5.5" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="12.5" y="17" width="12.5" height="3" rx="0.8" fill="#ffffff" opacity="0.5"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="url(#c6-front)"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="rgba(255,255,255,0.22)" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="8.5" y="9.8" width="4.5" height="1.2" rx="0.6" fill="#ffffff"/>
  <rect x="6.8" y="12.5" width="8" height="7.5" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="6.8" y="21.5" width="8" height="3.5" rx="0.8" fill="#ffffff" opacity="0.6"/>
</svg>"""

# 2. FEATURE GRAPHIC SVG (1024x500)
feature_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070d1c"/>
      <stop offset="50%" stop-color="#0d1527"/>
      <stop offset="100%" stop-color="#1e1845"/>
    </linearGradient>
    <linearGradient id="fglow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1024" height="500" fill="url(#fbg)"/>
  <rect width="1024" height="500" fill="url(#grid)"/>
  <circle cx="850" cy="180" r="280" fill="#38bdf8" opacity="0.08"/>
  <circle cx="200" cy="400" r="240" fill="#8b5cf6" opacity="0.08"/>
  <g transform="translate(80, 75)">
    <rect width="72" height="72" rx="18" fill="url(#fglow)"/>
    <rect x="23" y="10" width="37" height="40" rx="6" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="3"/>
    <rect x="11" y="18" width="26" height="44" rx="6" fill="#1e1b4b" stroke="#fff" stroke-width="3.5"/>
  </g>
  <text x="175" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="38" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Store Preview Studio</text>
  <text x="175" y="142" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="url(#fglow)" letter-spacing="1.5">DUAL-STORE PREVIEW &amp; METADATA STUDIO</text>
  <text x="80" y="215" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Design &amp; Validate Pixel-Perfect Store Mockups</text>
  <text x="80" y="250" font-family="-apple-system,system-ui,sans-serif" font-size="16" fill="#94a3b8">App Store &amp; Google Play live viewports, pre-flight audits, 100% offline in your browser.</text>
  <g transform="translate(80, 290)">
    <rect width="200" height="44" rx="22" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="100" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#38bdf8" text-anchor="middle">📱 Dual Live Viewports</text>
  </g>
  <g transform="translate(300, 290)">
    <rect width="200" height="44" rx="22" fill="rgba(129,140,248,0.15)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="100" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#c084fc" text-anchor="middle">🛡️ Pre-Flight Audit</text>
  </g>
  <g transform="translate(520, 290)">
    <rect width="200" height="44" rx="22" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="100" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#34d399" text-anchor="middle">🔒 100% Client-Side</text>
  </g>
  <g transform="translate(750, 70)">
    <rect width="200" height="360" rx="28" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <rect x="20" y="24" width="160" height="42" rx="12" fill="#1e293b"/>
    <circle cx="42" cy="45" r="14" fill="#3b82f6"/>
    <text x="65" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff">Preview Studio</text>
    <text x="65" y="56" font-family="-apple-system,system-ui,sans-serif" font-size="9" fill="#94a3b8">Store Mockup Pro</text>
    <rect x="20" y="80" width="160" height="100" rx="14" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" stroke-width="1"/>
    <text x="100" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#38bdf8" text-anchor="middle">4.9 ★</text>
    <text x="100" y="150" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="600" fill="#fff" text-anchor="middle">#1 Developer Tools</text>
    <rect x="20" y="195" width="160" height="60" rx="12" fill="#1e293b"/>
    <text x="35" y="222" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399">✓ ITMS-90717 Pass</text>
    <text x="35" y="240" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#38bdf8">✓ 3x PNG Mockup</text>
    <rect x="35" y="280" width="130" height="40" rx="20" fill="url(#fglow)"/>
    <text x="100" y="305" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">EXPORT MOCKUP</text>
  </g>
</svg>"""

# 3. SHOT 1: DUAL-STORE VIEWPORTS (460x996)
shot1_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996" width="1080" height="2340">
  <defs>
    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070d1a"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1845"/>
    </linearGradient>
    <linearGradient id="acc1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">DUAL-STORE VIEWPORTS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Live Side-by-Side</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc1)" text-anchor="middle">App Store &amp; Google Play</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Instant simultaneous preview across iPhone &amp; Android</text>
  <!-- Mini Duo Phones Container -->
  <g transform="translate(30, 240)">
    <rect width="400" height="420" rx="24" fill="#0f1629" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Left Phone (Apple) -->
    <g transform="translate(25, 30)">
      <rect width="165" height="340" rx="24" fill="#000" stroke="#334155" stroke-width="3"/>
      <rect x="52" y="10" width="60" height="14" rx="7" fill="#1e293b"/>
      <text x="82" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">App Store</text>
      <rect x="20" y="70" width="36" height="36" rx="9" fill="url(#acc1)"/>
      <rect x="62" y="75" width="80" height="8" rx="4" fill="#fff"/>
      <rect x="62" y="90" width="55" height="6" rx="3" fill="#64748b"/>
      <rect x="20" y="120" width="125" height="26" rx="13" fill="#0284c7"/>
      <text x="82" y="137" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">GET</text>
      <!-- Mini Shots Row -->
      <rect x="20" y="165" width="58" height="120" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
      <rect x="86" y="165" width="58" height="120" rx="8" fill="#1e293b"/>
      <rect x="60" y="325" width="45" height="4" rx="2" fill="#fff"/>
    </g>
    <!-- Right Phone (Android) -->
    <g transform="translate(210, 30)">
      <rect width="165" height="340" rx="20" fill="#000" stroke="#334155" stroke-width="3"/>
      <circle cx="82" cy="16" r="4" fill="#1e293b"/>
      <text x="82" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">Google Play</text>
      <rect x="20" y="70" width="36" height="36" rx="9" fill="url(#acc1)"/>
      <rect x="62" y="75" width="80" height="8" rx="4" fill="#fff"/>
      <rect x="62" y="90" width="55" height="6" rx="3" fill="#64748b"/>
      <rect x="20" y="120" width="125" height="26" rx="8" fill="#047857"/>
      <text x="82" y="137" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">Install</text>
      <rect x="20" y="165" width="58" height="120" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
      <rect x="86" y="165" width="58" height="120" rx="8" fill="#1e293b"/>
    </g>
  </g>
  <!-- Bottom Feature Pill Banner -->
  <g transform="translate(30, 690)">
    <rect width="400" height="100" rx="20" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="40" y="44" font-size="28">⚡</text>
    <text x="85" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Simultaneous 1-Click Sync</text>
    <text x="85" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Edit metadata once · Instantly audits both platforms</text>
  </g>
  <g transform="translate(30, 810)">
    <rect width="400" height="130" rx="20" fill="#111827" stroke="#1e293b" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#38bdf8">✓ iPhone, iPad &amp; Android Viewports</text>
    <text x="25" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#c084fc">✓ Real Device Aspect Ratios</text>
    <text x="25" y="100" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#34d399">✓ 100% Client-Side Privacy</text>
  </g>
</svg>"""

# 4. SHOT 2: METADATA VALIDATION (460x996)
shot2_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996" width="1080" height="2340">
  <defs>
    <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070d1a"/>
      <stop offset="100%" stop-color="#181c3b"/>
    </linearGradient>
    <linearGradient id="acc2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#818cf8" text-anchor="middle">METADATA COMPLIANCE</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Store Limits &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc2)" text-anchor="middle">Pre-Flight Audit</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Eliminates submission rejection risks before release</text>
  <!-- Card Checklist -->
  <g transform="translate(30, 240)">
    <rect width="400" height="470" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <text x="25" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Metadata Validation Checklist</text>
    <!-- Item 1 -->
    <g transform="translate(25, 75)">
      <rect width="350" height="75" rx="14" fill="#182238" stroke="rgba(56,189,248,0.3)" stroke-width="1.2"/>
      <circle cx="28" cy="38" r="14" fill="#0284c7"/>
      <path d="M22 38 L26 42 L34 33" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="52" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">App Title Length</text>
      <text x="52" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Store Preview Studio · 20 / 30 chars</text>
      <rect x="270" y="25" width="65" height="26" rx="8" fill="rgba(56,189,248,0.2)"/>
      <text x="302" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle">PASSED</text>
    </g>
    <!-- Item 2 -->
    <g transform="translate(25, 165)">
      <rect width="350" height="75" rx="14" fill="#182238" stroke="rgba(192,132,252,0.3)" stroke-width="1.2"/>
      <circle cx="28" cy="38" r="14" fill="#7c3aed"/>
      <path d="M22 38 L26 42 L34 33" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="52" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Subtitle &amp; Short Description</text>
      <text x="52" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Store Mockup Pro · 16 / 30 chars</text>
      <rect x="270" y="25" width="65" height="26" rx="8" fill="rgba(192,132,252,0.2)"/>
      <text x="302" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#c084fc" text-anchor="middle">PASSED</text>
    </g>
    <!-- Item 3 -->
    <g transform="translate(25, 255)">
      <rect width="350" height="75" rx="14" fill="#182238" stroke="rgba(16,185,129,0.3)" stroke-width="1.2"/>
      <circle cx="28" cy="38" r="14" fill="#059669"/>
      <path d="M22 38 L26 42 L34 33" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="52" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Icon Alpha Audit</text>
      <text x="52" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">ITMS-90717 Zero Alpha Compliance</text>
      <rect x="270" y="25" width="65" height="26" rx="8" fill="rgba(16,185,129,0.2)"/>
      <text x="302" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#34d399" text-anchor="middle">PASSED</text>
    </g>
    <!-- Item 4 -->
    <g transform="translate(25, 345)">
      <rect width="350" height="75" rx="14" fill="#182238" stroke="rgba(245,158,11,0.3)" stroke-width="1.2"/>
      <circle cx="28" cy="38" r="14" fill="#d97706"/>
      <path d="M22 38 L26 42 L34 33" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="52" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Age Rating Matrix</text>
      <text x="52" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Apple 4+ &amp; Google Play Everyone</text>
      <rect x="270" y="25" width="65" height="26" rx="8" fill="rgba(245,158,11,0.2)"/>
      <text x="302" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fde047" text-anchor="middle">PASSED</text>
    </g>
  </g>
  <g transform="translate(30, 740)">
    <rect width="400" height="180" rx="20" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="30" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Ready For Submission</text>
    <text x="30" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Export verified metadata and mockups directly into your developer release pipeline.</text>
    <rect x="30" y="105" width="340" height="46" rx="23" fill="url(#acc2)"/>
    <text x="200" y="134" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">100% STORE COMPLIANT</text>
  </g>
</svg>"""

# 5. SHOT 3: APP ICON INSPECTOR (460x996)
shot3_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996" width="1080" height="2340">
  <defs>
    <linearGradient id="s3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070d1a"/>
      <stop offset="100%" stop-color="#141838"/>
    </linearGradient>
    <linearGradient id="c6m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="acc3" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">ASSET AUDIT</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">App Icon Inspector &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc3)" text-anchor="middle">ITMS-90717 Compliance</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Instant alpha channel detection &amp; specification checks</text>
  <!-- Hero Icon Box -->
  <g transform="translate(140, 240)">
    <rect width="180" height="180" rx="42" fill="url(#c6m)" filter="drop-shadow(0 20px 30px rgba(59,130,246,0.5))"/>
    <rect x="58" y="25" width="94" height="102" rx="14" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="8"/>
    <circle cx="105" cy="35" r="4" fill="#fff"/>
    <rect x="28" y="45" width="65" height="110" rx="16" fill="#6366f1" stroke="#fff" stroke-width="10"/>
  </g>
  <!-- Spec List Card -->
  <g transform="translate(30, 460)">
    <rect width="400" height="340" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <text x="30" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Master Icon Specifications</text>
    <g transform="translate(30, 75)">
      <rect width="340" height="48" rx="10" fill="#182238"/>
      <text x="20" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Dimension</text>
      <text x="320" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="end">1024 × 1024 px</text>
    </g>
    <g transform="translate(30, 135)">
      <rect width="340" height="48" rx="10" fill="#182238"/>
      <text x="20" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Color Profile</text>
      <text x="320" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="end">sRGB / 24-bit RGB</text>
    </g>
    <g transform="translate(30, 195)">
      <rect width="340" height="48" rx="10" fill="#182238"/>
      <text x="20" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Alpha Channel</text>
      <text x="320" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">Zero Alpha (Passed ✓)</text>
    </g>
    <g transform="translate(30, 255)">
      <rect width="340" height="48" rx="10" fill="#182238"/>
      <text x="20" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Corner Masking</text>
      <text x="320" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="end">Auto Apple Squircle</text>
    </g>
  </g>
  <g transform="translate(30, 830)">
    <rect width="400" height="90" rx="20" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="200" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#34d399" text-anchor="middle">🛡️ 100% ITMS-90717 COMPLIANT</text>
    <text x="200" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">No transparent pixel rejections on App Store Connect</text>
  </g>
</svg>"""

# 6. SHOT 4: ULTRA HD EXPORT (460x996)
shot4_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996" width="1080" height="2340">
  <defs>
    <linearGradient id="s4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070d1a"/>
      <stop offset="100%" stop-color="#181535"/>
    </linearGradient>
    <linearGradient id="acc4" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#c084fc" text-anchor="middle">PRODUCTION READY</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">1-Click Ultra HD</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc4)" text-anchor="middle">Multi-Format Export</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">3x PNG mockups, bulk ZIP packages &amp; dev Markdown</text>
  <g transform="translate(30, 240)">
    <!-- Format 1 -->
    <rect width="400" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <rect x="25" y="25" width="60" height="60" rx="16" fill="rgba(56,189,248,0.2)"/>
    <text x="55" y="62" font-size="26" text-anchor="middle">🖼️</text>
    <text x="105" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Ultra HD 3x PNG Mockups</text>
    <text x="105" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Pixel-perfect Retina quality for promo</text>
    <rect x="300" y="38" width="75" height="30" rx="10" fill="#0284c7"/>
    <text x="337" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">PNG 3X</text>
  </g>
  <g transform="translate(30, 370)">
    <!-- Format 2 -->
    <rect width="400" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <rect x="25" y="25" width="60" height="60" rx="16" fill="rgba(192,132,252,0.2)"/>
    <text x="55" y="62" font-size="26" text-anchor="middle">📦</text>
    <text x="105" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Client-Side Bulk ZIP</text>
    <text x="105" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">All screenshots, icons &amp; assets in 1 file</text>
    <rect x="300" y="38" width="75" height="30" rx="10" fill="#7c3aed"/>
    <text x="337" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">ZIP FILE</text>
  </g>
  <g transform="translate(30, 500)">
    <!-- Format 3 -->
    <rect width="400" height="110" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <rect x="25" y="25" width="60" height="60" rx="16" fill="rgba(16,185,129,0.2)"/>
    <text x="55" y="62" font-size="26" text-anchor="middle">📄</text>
    <text x="105" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Developer Markdown Spec</text>
    <text x="105" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Clean structured copy for team docs</text>
    <rect x="300" y="38" width="75" height="30" rx="10" fill="#059669"/>
    <text x="337" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">DOC .MD</text>
  </g>
  <g transform="translate(30, 640)">
    <rect width="400" height="130" rx="20" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="40" y="44" font-size="28">🔒</text>
    <text x="85" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">100% Client-Side Generation</text>
    <text x="85" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Generated entirely in your browser using JSZip</text>
    <text x="85" y="85" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">&amp; HTML5 Canvas. Zero bytes sent to servers.</text>
  </g>
  <g transform="translate(30, 800)">
    <rect width="400" height="120" rx="24" fill="url(#acc4)"/>
    <text x="200" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="800" fill="#fff" text-anchor="middle">INSTANT 1-CLICK EXPORT</text>
    <text x="200" y="84" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff" opacity="0.9" text-anchor="middle">No login required · Completely private offline</text>
  </g>
</svg>"""

preset_data = {
  "generator": "Store Preview Studio",
  "version": "2.1.0",
  "timestamp": "2026-10-25T00:00:00.000Z",
  "store": "apple",
  "theme": "dark",
  "form": {
    "name": "Store Preview Studio",
    "sub": "Store Mockup Pro",
    "promo": "🔥 Design, audit & export pixel-perfect App Store & Google Play metadata completely offline with zero recurring subscription fees.",
    "short": "Design, audit & export pixel-perfect App Store & Google Play metadata offline.",
    "dev": "Store Mockup Pro",
    "cat": "Developer Tools",
    "catApple": "Developer Tools",
    "catGoogle": "Tools",
    "keywords": "app store mockup,google play preview,screenshot generator,metadata editor,aso studio,app store connect,indie dev tools",
    "ver": "2.1.0",
    "rdate": "Oct 25, 2026",
    "email": "support@previewstudio.app",
    "phone": "+1 800-555-0199",
    "addr": "San Francisco, CA",
    "privLinked": "User Content, Identifiers",
    "privNotLinked": "Diagnostics",
    "privGoogle": "No data shared with third parties, Data is encrypted in transit, You can request data deletion",
    "new": "Version 2.1.0 Update:\n- Live dual-store viewports (iPhone, iPad & Android layouts)\n- App Icon Inspector with ITMS-90717 alpha compliance audit\n- Ultra HD 3x PNG mockups & 1-click bulk ZIP export\n- Developer Markdown generator\n- 100% standalone offline operation with zero telemetry",
    "desc": "Store Preview Studio is the professional listing designer and pre-flight audit studio for iOS and Android developers, indie creators, and digital agencies.\n\nCraft high-converting App Store Connect and Google Play Console product listings side-by-side with instantaneous real-time sync, automated store limit validation, and Retina-grade mockup generation — 100% offline in your browser.\n\nCORE CAPABILITIES:\n• Dual-Store Live Viewports: Simultaneously visualize how your app listing looks on both iOS and Android before publishing.\n• Pre-Flight Compliance Audit: Automated real-time checking of title lengths, character limits, and store requirements to prevent rejections.\n• App Icon Inspector: Audit master 1024x1024 icons, test transparency compliance against Apple ITMS-90717 guidelines, and preview adaptive squircle shapes.\n• Ultra HD 3x Multi-Format Export: Download pristine 3x Retina PNG device mockups, comprehensive client-side ZIP bundles, and developer Markdown specifications in 1 click.\n• 100% Client-Side Privacy: Operates completely offline with zero tracking, zero server dependencies, and zero monthly subscriptions.\n\nPRICING & LICENSING:\nPay once on Gumroad, own forever. No subscriptions, no cloud vendor lock-in."
  },
  "icon": enc_svg(icon_svg),
  "featureGraphic": enc_svg(feature_svg),
  "shots": [
    enc_svg(shot1_svg),
    enc_svg(shot2_svg),
    enc_svg(shot3_svg),
    enc_svg(shot4_svg)
  ],
  "tab7Shots": [],
  "tab10Shots": [],
  "stats": {
    "rating": "4.9",
    "count": "1.8K",
    "rank": "1",
    "dl": "50K+",
    "size": "42 MB",
    "age": "4+",
    "iap": "iap",
    "off": False,
    "wm": False
  },
  "reviews": [
    {
      "author": "Alex Morgan",
      "avatarBg": "#0b57d0",
      "stars": 5,
      "date": "Oct 21, 2026",
      "title": "Intuitive & beautifully designed",
      "text": "Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction. The side-by-side preview saved me hours before launching!",
      "helpful": 142
    },
    {
      "author": "David Chen",
      "avatarBg": "#7c3aed",
      "stars": 5,
      "date": "Oct 18, 2026",
      "title": "Essential tool for indie app developers",
      "text": "The ITMS-90717 icon inspector and instant 3x PNG export are indispensable. Best investment I made for my App Store launch workflow.",
      "helpful": 89
    },
    {
      "author": "Elena Rostova",
      "avatarBg": "#059669",
      "stars": 5,
      "date": "Oct 14, 2026",
      "title": "Reliable, fast, and completely offline",
      "text": "100% private and client-side. No backend servers, no subscriptions. A permanent essential tool in my agency workflow.",
      "helpful": 67
    }
  ]
}

# Write to presets/store-preview-studio-template.json
out_path = "presets/store-preview-studio-template.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(preset_data, f, indent=2, ensure_ascii=False)

print(f"✓ Preset successfully created at {out_path} ({os.path.getsize(out_path) / 1024:.1f} KB)")
