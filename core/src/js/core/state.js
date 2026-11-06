// Store Preview Studio · Constants & Active State
// --- Dynamic Date Helpers for Current Month & Year (Zero Hardcoded Dates) ---
if (typeof SPS_MONTH_NAMES === 'undefined') {
  var SPS_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
function getCurrentMonthDateStr(dayOffset = 0, withYear = true) {
  const now = new Date();
  const year = now.getFullYear();
  const month = SPS_MONTH_NAMES[now.getMonth()];
  const today = now.getDate();
  const day = Math.max(1, today - dayOffset);
  return withYear ? `${month} ${day}, ${year}` : `${month} ${day}`;
}

// --- Illustrative stats (rating / chart / downloads / age / IAP shown in mockups) ---
const STATS_DEFAULT = {rating:'4.9', count:'1.8K', rank:'1', dl:'50K+', size:'86 MB', age:'4+', iap:'iap'};
const STATS = {...STATS_DEFAULT};
let STATS_OFF = false;   // hide all illustrative numbers in the mockups
let EXPORT_WM = false;   // illustrative mockup watermark note (disabled by default)
const STAT_INPUTS = {rating:'f-st-rating', count:'f-st-count', rank:'f-st-rank', dl:'f-st-dl', size:'f-st-size', age:'f-st-age', iap:'f-st-iap'};

const GOOGLE_AGE_MAP = {
  '4+':  {badge:'E',    label:'Everyone'},
  '9+':  {badge:'E10+', label:'Everyone 10+'},
  '12+': {badge:'T',    label:'Teen · 12+'},
  '17+': {badge:'M',    label:'Mature 17+'},
  '18+': {badge:'18+',  label:'Adults Only 18+'}
};

function renderStats(){
  $$('[data-stat]').forEach(e => {
    if (e.dataset.stat !== 'size-num' && e.dataset.stat !== 'size-unit') {
      e.textContent = STATS[e.dataset.stat] || '';
    }
  });

  // Parse Size into numeric value and unit for iPad metrics ribbon (e.g. "116.3" and "MB")
  const sizeRaw = (STATS.size || '86.4 MB').trim();
  const sizeMatch = sizeRaw.match(/^([\d.,]+)\s*([a-zA-Z]+)?$/);
  const sizeNum = sizeMatch ? sizeMatch[1] : sizeRaw.replace(/\s*[a-zA-Z]+$/, '');
  const sizeUnit = (sizeMatch && sizeMatch[2]) ? sizeMatch[2].toUpperCase() : (sizeRaw.match(/[a-zA-Z]+/)?.[0] || 'MB');
  $$('[data-stat="size-num"]').forEach(e => { e.textContent = sizeNum || '86.4'; });
  $$('[data-stat="size-unit"]').forEach(e => { e.textContent = sizeUnit || 'MB'; });

  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || { badge: ageVal, label: 'Rated for ' + ageVal };
  $$('[data-age-apple]').forEach(e => { e.textContent = ageVal; });
  $$('[data-age-google-badge]').forEach(e => { e.textContent = gAge.badge; });
  $$('[data-age-google-lbl]').forEach(e => { e.textContent = gAge.label; });

  const hasRating = !!(STATS.rating && STATS.rating.trim() && STATS.rating.trim() !== '0');
  $$('[data-gmet-rating]').forEach(e => { e.style.display = hasRating ? '' : 'none'; });
  $$('.dev:not(.gtab7) [data-gmet-size]').forEach(e => { e.style.display = hasRating ? 'none' : ''; });
  $$('.dev.gtab7 [data-gmet-size]').forEach(e => { e.style.display = 'flex'; });

  const iapVal = STATS.iap || 'iap';
  const hasIap = (iapVal === 'iap' || iapVal === 'ads_iap');
  $$('[data-iap-apple]').forEach(e => { e.style.display = hasIap ? '' : 'none'; });
  $$('[data-iap-yesno]').forEach(e => { e.textContent = hasIap ? 'Yes' : 'No'; });
  const gMetaMap = {
    iap: 'In-app purchases',
    ads_iap: 'Contains ads · In-app purchases',
    ads: 'Contains ads',
    free: ''
  };
  const gMetaText = gMetaMap[iapVal] !== undefined ? gMetaMap[iapVal] : 'In-app purchases';
  $$('[data-iap-google]').forEach(e => {
    e.textContent = gMetaText;
    e.style.display = gMetaText ? '' : 'none';
  });

  document.body.classList.remove('stats-off');
}
function syncStatInputs(){
  Object.entries(STAT_INPUTS).forEach(([k,id]) => { const el = $(id); if(el) el.value = STATS[k]; });
  const wm = $('f-st-wm');
  if(wm) wm.checked = EXPORT_WM;
  if(typeof syncAgeUI === 'function') syncAgeUI();
  if(typeof syncIapUI === 'function') syncIapUI();
}
function applyStatsFromObject(o){
  if(!o || typeof o !== 'object') return;
  Object.keys(STATS_DEFAULT).forEach(k => { if(typeof o[k] === 'string') STATS[k] = o[k].slice(0, 16); });
  STATS_OFF = false;
  if(typeof o.wm === 'boolean') EXPORT_WM = o.wm;
}
function statsToObject(){ return {...STATS, off: false, wm: EXPORT_WM}; }
function resetStats(){ Object.assign(STATS, STATS_DEFAULT); STATS_OFF = false; EXPORT_WM = true; syncStatInputs(); renderStats(); }

// --- Built-in Neutral Vector Icon & Screenshot Mockups (100% Offline, 1024x1024 Opaque Square) ---
function makeSvgDataUri(svg){
  let s = svg.trim();
  if(!/<\s*svg[^>]*\bwidth\s*=/i.test(s) && !/<\s*svg[^>]*\bheight\s*=/i.test(s)){
    const vb = s.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
    if(vb){
      let w = Math.round(parseFloat(vb[1]));
      let h = Math.round(parseFloat(vb[2]));
      if(w === 460 && h === 996){ w = 1290; h = 2796; }
      else if(w === 1024 && h === 500){ w = 1024; h = 500; }
      s = s.replace(/<svg\b([^>]*)>/i, `<svg$1 width="${w}" height="${h}">`);
    }
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s.replace(/\s+/g,' '));
}

const DEFAULT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="tfBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="50%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="tfG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#tfBg)"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="24" stroke-dasharray="680 180" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="url(#tfG)" stroke-width="24" stroke-dasharray="480 500" stroke-linecap="round"/>
  <path d="M185 262 L235 312 L332 205" fill="none" stroke="#ffffff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="370" cy="145" r="18" fill="#93c5fd"/>
</svg>
`);

const STUDIO_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="std-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F211F" />
      <stop offset="100%" stop-color="#121312" />
    </linearGradient>
    <filter id="std-k-sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>
  <!-- Full-bleed Opaque Supabase Dark Background (Opaque Zero Alpha Compliant) -->
  <rect width="100" height="100" fill="url(#std-sq-bg)" />
  <!-- Pure Interlocking K: Dual-Store Ribbon (Primary #006636 + Secondary #00D085) -->
  <g transform="scale(0.72) translate(19, 19)">
    <path
      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
      fill="#006636"
    />
    <g filter="url(#std-k-sh)">
      <path
        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
        fill="#00D085"
      />
    </g>
  </g>
</svg>
`);

// --- Professional ASO App Icon Blueprint Grid (Draft / Placeholder Icon) ---
const BLUEPRINT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#172033"/>
    </linearGradient>
    <linearGradient id="bp-grid-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <pattern id="bp-dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="1.2" fill="#38bdf8" opacity="0.12"/>
    </pattern>
  </defs>
  <!-- Full-bleed Opaque Studio Blueprint Dark Surface (Opaque Zero Alpha Compliant) -->
  <rect width="1024" height="1024" fill="url(#bp-bg)"/>
  <rect width="1024" height="1024" fill="url(#bp-dots)"/>

  <!-- Outer Safe Area Squircle Boundary (Apple HIG 1024px Squircle Keyline) -->
  <rect x="102" y="102" width="820" height="820" rx="185" fill="rgba(56,189,248,0.03)" stroke="#38bdf8" stroke-width="2.5" opacity="0.4"/>

  <!-- Keyline Rectangles: Landscape (740x480) & Portrait (480x740) -->
  <rect x="142" y="272" width="740" height="480" rx="24" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.25"/>
  <rect x="272" y="142" width="480" height="740" rx="24" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.25"/>

  <!-- Central Keyline Square (512x512) -->
  <rect x="256" y="256" width="512" height="512" rx="32" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.3"/>

  <!-- Golden Ratio & HIG Keyline Circles -->
  <circle cx="512" cy="512" r="420" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.35"/>
  <circle cx="512" cy="512" r="370" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.25"/>
  <circle cx="512" cy="512" r="256" fill="none" stroke="url(#bp-grid-glow)" stroke-width="2" opacity="0.45"/>
  <circle cx="512" cy="512" r="145" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.35"/>

  <!-- Center Crosshairs & 45-degree Diagonal Guide Axes -->
  <line x1="512" y1="80" x2="512" y2="944" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
  <line x1="80" y1="512" x2="944" y2="512" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
  <line x1="140" y1="140" x2="884" y2="884" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.2"/>
  <line x1="140" y1="884" x2="884" y2="140" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.2"/>

  <!-- Center Upload Target Pill & Icon Glyph -->
  <circle cx="512" cy="512" r="64" fill="#0f172a" stroke="url(#bp-grid-glow)" stroke-width="2.5" opacity="0.9"/>
  <g transform="translate(512, 512)" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 -22 L0 22"/>
    <path d="M-22 0 L22 0"/>
  </g>

  <!-- Technical Spec Blueprint Labels -->
  <text x="512" y="805" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="700" letter-spacing="3" fill="#7dd3fc" text-anchor="middle" opacity="0.85">APP ICON 1024×1024</text>
  <text x="512" y="842" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="18" font-weight="600" letter-spacing="2" fill="#94a3b8" text-anchor="middle" opacity="0.75">BLUEPRINT GRID · UPLOAD ICON</text>
</svg>
`);

const BLANK_ICON = BLUEPRINT_ICON;
const LEGACY_BLANK_ICON = STUDIO_ICON;

const SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="50%" stop-color="#111827"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#818cf8"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">PRODUCTIVITY &amp; HABITS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Master Your Daily</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc)" text-anchor="middle">Habits &amp; Routines</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Stay consistent and celebrate daily streaks</text>
  <g transform="translate(30, 240)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#0284c7" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">🧘</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Morning Meditation</text>
    <text x="96" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">15 mins mindfulness · 8:00 AM</text>
    <circle cx="355" cy="52" r="18" fill="#10b981"/>
    <path d="M347 52 L353 58 L363 46" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(30, 365)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#818cf8" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">📚</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Read 20 Pages</text>
    <text x="96" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Deep Work · Atomic Habits</text>
    <circle cx="355" cy="52" r="18" fill="#10b981"/>
    <path d="M347 52 L353 58 L363 46" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(30, 490)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#f59e0b" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">💧</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Drink 2.5L Water</text>
    <text x="96" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">2.0 / 2.5 Liters logged</text>
    <rect x="96" y="82" width="220" height="6" rx="3" fill="#334155"/>
    <rect x="96" y="82" width="176" height="6" rx="3" fill="url(#acc)"/>
    <circle cx="355" cy="52" r="18" fill="none" stroke="#64748b" stroke-width="2"/>
  </g>
  <g transform="translate(30, 620)">
    <rect width="400" height="90" rx="20" fill="#1e1b4b" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="45" y="55" font-size="34">🔥</text>
    <text x="90" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="800" fill="#fde68a">24 DAYS STREAK</text>
    <text x="90" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#fbbf24">Top 5% among TaskFlow habit builders</text>
  </g>
  <g transform="translate(30, 735)">
    <rect width="400" height="175" rx="24" fill="#0b1329" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Today's Goal Completion</text>
    <text x="350" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="end">85%</text>
    <rect x="50" y="65" width="300" height="10" rx="5" fill="#1e293b"/>
    <rect x="50" y="65" width="255" height="10" rx="5" fill="url(#acc)"/>
    <text x="200" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#64748b" text-anchor="middle">5 of 6 daily habits completed</text>
    <rect x="130" y="130" width="140" height="32" rx="16" fill="rgba(56,189,248,0.15)"/>
    <text x="200" y="151" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">⚡ Keep It Up!</text>
  </g>
</svg>
`);

const SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090d16"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#818cf8" text-anchor="middle">DEEP WORK SESSIONS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Deep Focus Pomodoro</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#ring)" text-anchor="middle">Zero Distractions</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Built-in ambient soundscapes &amp; interval timers</text>
  <g transform="translate(230, 420)">
    <circle cx="0" cy="0" r="140" fill="none" stroke="#1e293b" stroke-width="16"/>
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#ring)" stroke-width="16" stroke-dasharray="600 300" stroke-linecap="round"/>
    <text x="0" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff" text-anchor="middle">25:00</text>
    <text x="0" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">POMODORO FOCUS</text>
  </g>
  <g transform="translate(50, 620)">
    <rect width="360" height="70" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="30" y="42" font-size="24">🎯</text>
    <text x="70" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Current Milestone Task</text>
    <text x="70" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Finalize System Architecture &amp; Mockup</text>
  </g>
  <g transform="translate(50, 710)">
    <rect width="360" height="70" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="30" y="42" font-size="24">🌧</text>
    <text x="70" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Ambient Background Audio</text>
    <text x="70" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#38bdf8">Binaural Lo-Fi Beats &amp; Gentle Rain</text>
  </g>
  <g transform="translate(50, 810)">
    <rect width="360" height="60" rx="30" fill="url(#ring)"/>
    <text x="180" y="37" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#0f172a" text-anchor="middle">▶ Start 25m Session</text>
  </g>
</svg>
`);

const SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">ACTIONABLE INSIGHTS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Track Progress &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#38bdf8" text-anchor="middle">Peak Productivity</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Visualize completion patterns and optimal hours</text>
  <g transform="translate(30, 240)">
    <rect width="400" height="240" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Weekly Activity</text>
    <text x="375" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">+18% vs Last Wk</text>
    <!-- Bar charts -->
    <g transform="translate(30, 70)">
      <rect x="0" y="60" width="30" height="80" rx="6" fill="#334155"/>
      <rect x="50" y="30" width="30" height="110" rx="6" fill="#334155"/>
      <rect x="100" y="20" width="30" height="120" rx="6" fill="url(#bar)"/>
      <rect x="150" y="10" width="30" height="130" rx="6" fill="url(#bar)"/>
      <rect x="200" y="40" width="30" height="100" rx="6" fill="url(#bar)"/>
      <rect x="250" y="15" width="30" height="125" rx="6" fill="url(#bar)"/>
      <rect x="300" y="0" width="30" height="140" rx="6" fill="#10b981"/>
      <text x="15" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">M</text>
      <text x="65" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">T</text>
      <text x="115" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W</text>
      <text x="165" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">T</text>
      <text x="215" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">F</text>
      <text x="265" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">S</text>
      <text x="315" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#10b981" text-anchor="middle">S</text>
    </g>
  </g>
  <g transform="translate(30, 505)">
    <rect width="190" height="110" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Completion Rate</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="800" fill="#38bdf8">94%</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#10b981">● All-time high</text>
  </g>
  <g transform="translate(240, 505)">
    <rect width="190" height="110" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Total Focus Time</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="800" fill="#c084fc">42h</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#c084fc">● This month</text>
  </g>
  <g transform="translate(30, 640)">
    <rect width="400" height="240" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Consistency Calendar</text>
    <text x="25" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">30 consecutive days of goal attainment</text>
    <g transform="translate(25, 90)">
      <!-- Calendar mini dots matrix -->
      <circle cx="15" cy="15" r="8" fill="#10b981"/><circle cx="45" cy="15" r="8" fill="#10b981"/><circle cx="75" cy="15" r="8" fill="#10b981"/><circle cx="105" cy="15" r="8" fill="#10b981"/><circle cx="135" cy="15" r="8" fill="#10b981"/><circle cx="165" cy="15" r="8" fill="#10b981"/><circle cx="195" cy="15" r="8" fill="#10b981"/><circle cx="225" cy="15" r="8" fill="#10b981"/><circle cx="255" cy="15" r="8" fill="#10b981"/><circle cx="285" cy="15" r="8" fill="#10b981"/><circle cx="315" cy="15" r="8" fill="#10b981"/>
      <circle cx="15" cy="45" r="8" fill="#10b981"/><circle cx="45" cy="45" r="8" fill="#10b981"/><circle cx="75" cy="45" r="8" fill="#10b981"/><circle cx="105" cy="45" r="8" fill="#10b981"/><circle cx="135" cy="45" r="8" fill="#10b981"/><circle cx="165" cy="45" r="8" fill="#10b981"/><circle cx="195" cy="45" r="8" fill="#10b981"/><circle cx="225" cy="45" r="8" fill="#10b981"/><circle cx="255" cy="45" r="8" fill="#10b981"/><circle cx="285" cy="45" r="8" fill="#10b981"/><circle cx="315" cy="45" r="8" fill="#10b981"/>
      <circle cx="15" cy="75" r="8" fill="#10b981"/><circle cx="45" cy="75" r="8" fill="#10b981"/><circle cx="75" cy="75" r="8" fill="#10b981"/><circle cx="105" cy="75" r="8" fill="#10b981"/><circle cx="135" cy="75" r="8" fill="#10b981"/><circle cx="165" cy="75" r="8" fill="#10b981"/><circle cx="195" cy="75" r="8" fill="#10b981"/><circle cx="225" cy="75" r="8" fill="#38bdf8"/><circle cx="255" cy="75" r="8" fill="#38bdf8"/><circle cx="285" cy="75" r="8" fill="#38bdf8"/><circle cx="315" cy="75" r="8" fill="#38bdf8"/>
    </g>
  </g>
</svg>
`);

const SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#c084fc" text-anchor="middle">HOME &amp; LOCK SCREEN</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Interactive Widgets</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#c084fc" text-anchor="middle">One-Tap Check Off</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">iOS 18 &amp; Android 15 dynamic interactive widgets</text>
  <g transform="translate(30, 250)">
    <rect width="400" height="200" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">TaskFlow Today Widget</text>
    <g transform="translate(25, 60)">
      <rect width="350" height="40" rx="10" fill="#0f172a"/>
      <circle cx="20" cy="20" r="10" fill="#10b981"/>
      <text x="45" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#fff">Finish Daily Journaling</text>
      <text x="330" y="25" font-size="12" fill="#10b981" text-anchor="end">Done</text>
    </g>
    <g transform="translate(25, 110)">
      <rect width="350" height="40" rx="10" fill="#0f172a"/>
      <circle cx="20" cy="20" r="10" fill="#38bdf8"/>
      <text x="45" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#fff">Take 10,000 Steps</text>
      <text x="330" y="25" font-size="12" fill="#38bdf8" text-anchor="end">7.8K</text>
    </g>
  </g>
  <g transform="translate(30, 480)">
    <rect width="190" height="190" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-size="28">🔥</text>
    <text x="25" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#fde68a">24</text>
    <text x="25" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Days Streak</text>
    <text x="25" y="145" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">Active Consistency</text>
  </g>
  <g transform="translate(240, 480)">
    <rect width="190" height="190" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-size="28">⏱</text>
    <text x="25" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#38bdf8">25m</text>
    <text x="25" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Quick Focus</text>
    <text x="25" y="145" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#38bdf8">Tap to start</text>
  </g>
</svg>
`);

// Fallback placeholder images for empty screenshot slots & offline previews
const PH = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1290 2796" width="1290" height="2796">
  <defs>
    <linearGradient id="ph_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1290" height="2796" fill="url(#ph_bg)"/>
  <rect x="50" y="50" width="1190" height="2696" rx="84" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <rect x="495" y="95" width="300" height="80" rx="40" fill="#030712" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <g transform="translate(645, 1280)">
    <circle cx="0" cy="0" r="140" fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.2)" stroke-width="3"/>
    <rect x="-60" y="-45" width="120" height="90" rx="16" fill="none" stroke="url(#ph_glow)" stroke-width="7"/>
    <circle cx="-25" cy="-18" r="12" fill="url(#ph_glow)"/>
    <path d="M-55 35 L-15 -5 L20 30 L40 10 L55 35" fill="none" stroke="url(#ph_glow)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="35" r="28" fill="#6366f1"/>
    <path d="M50 22 L50 48 M37 35 L63 35" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="210" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="52" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="-0.5">No Screenshot Uploaded</text>
    <text x="0" y="275" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#94a3b8" text-anchor="middle">iPhone 6.9&quot; Target: 1290 × 2796 px</text>
    <text x="0" y="335" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#64748b" text-anchor="middle">PNG or JPEG · Max 8 MB · Drag &amp; drop to upload</text>
  </g>
</svg>
`);

const PH_IPAD = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2732" width="2048" height="2732">
  <defs>
    <linearGradient id="ph_ipad_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_ipad_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="2048" height="2732" fill="url(#ph_ipad_bg)"/>
  <rect x="65" y="65" width="1918" height="2602" rx="72" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <circle cx="1024" cy="115" r="10" fill="rgba(255,255,255,0.15)"/>
  <g transform="translate(1024, 1260)">
    <circle cx="0" cy="0" r="180" fill="rgba(139,92,246,0.07)" stroke="rgba(139,92,246,0.2)" stroke-width="3"/>
    <rect x="-80" y="-105" width="160" height="210" rx="20" fill="none" stroke="url(#ph_ipad_glow)" stroke-width="7"/>
    <circle cx="0" cy="-88" r="5" fill="url(#ph_ipad_glow)"/>
    <line x1="-30" y1="88" x2="30" y2="88" stroke="url(#ph_ipad_glow)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="65" cy="80" r="34" fill="#8b5cf6"/>
    <path d="M65 64 L65 96 M49 80 L81 80" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <text x="0" y="240" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="64" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="-0.5">No iPad Screenshot Uploaded</text>
    <text x="0" y="320" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="38" font-weight="500" fill="#94a3b8" text-anchor="middle">iPad Target: 2048 × 2732 px (3:4 Ratio)</text>
    <text x="0" y="385" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="32" font-weight="400" fill="#64748b" text-anchor="middle">PNG or JPEG · Up to 8 MB · Supports Landscape &amp; Portrait</text>
  </g>
</svg>
`);

const PH_TAB = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1600" width="2560" height="1600">
  <defs>
    <linearGradient id="ph_tab_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_tab_glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="2560" height="1600" fill="url(#ph_tab_bg)"/>
  <rect x="60" y="60" width="2440" height="1480" rx="60" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <g transform="translate(1280, 750)">
    <circle cx="0" cy="0" r="160" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.2)" stroke-width="3"/>
    <rect x="-100" y="-65" width="200" height="130" rx="16" fill="none" stroke="url(#ph_tab_glow)" stroke-width="7"/>
    <circle cx="85" cy="0" r="5" fill="url(#ph_tab_glow)"/>
    <circle cx="75" cy="50" r="30" fill="#10b981"/>
    <path d="M75 36 L75 64 M61 50 L89 50" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="220" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="56" font-weight="700" fill="#f8fafc" text-anchor="middle">No Tablet Screenshot Uploaded</text>
    <text x="0" y="295" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#94a3b8" text-anchor="middle">Google Play Target: 16:10 or 16:9 Landscape · Up to 8 MB</text>
    <text x="0" y="355" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#64748b" text-anchor="middle">If empty, tablet mockups automatically display phone screenshots</text>
  </g>
</svg>
`);

// Light theme placeholder equivalents for bright, clean UI mode
const PH_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1290 2796" width="1290" height="2796">
  <defs>
    <linearGradient id="ph_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_light_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1290" height="2796" fill="url(#ph_light_bg)"/>
  <rect x="50" y="50" width="1190" height="2696" rx="84" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <rect x="495" y="95" width="300" height="80" rx="40" fill="#ffffff" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
  <g transform="translate(645, 1280)">
    <circle cx="0" cy="0" r="140" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" stroke-width="3"/>
    <rect x="-60" y="-45" width="120" height="90" rx="16" fill="none" stroke="url(#ph_light_glow)" stroke-width="7"/>
    <circle cx="-25" cy="-18" r="12" fill="url(#ph_light_glow)"/>
    <path d="M-55 35 L-15 -5 L20 30 L40 10 L55 35" fill="none" stroke="url(#ph_light_glow)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="35" r="28" fill="#6366f1"/>
    <path d="M50 22 L50 48 M37 35 L63 35" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="210" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="52" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.5">No Screenshot Uploaded</text>
    <text x="0" y="275" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#64748b" text-anchor="middle">iPhone 6.9&quot; Target: 1290 × 2796 px</text>
    <text x="0" y="335" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#94a3b8" text-anchor="middle">PNG or JPEG · Max 8 MB · Drag &amp; drop to upload</text>
  </g>
</svg>
`);

const PH_IPAD_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2732" width="2048" height="2732">
  <defs>
    <linearGradient id="ph_ipad_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_ipad_light_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="2048" height="2732" fill="url(#ph_ipad_light_bg)"/>
  <rect x="65" y="65" width="1918" height="2602" rx="72" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <circle cx="1024" cy="115" r="10" fill="rgba(0,0,0,0.12)"/>
  <g transform="translate(1024, 1260)">
    <circle cx="0" cy="0" r="180" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" stroke-width="3"/>
    <rect x="-80" y="-105" width="160" height="210" rx="20" fill="none" stroke="url(#ph_ipad_light_glow)" stroke-width="7"/>
    <circle cx="0" cy="-88" r="5" fill="url(#ph_ipad_light_glow)"/>
    <line x1="-30" y1="88" x2="30" y2="88" stroke="url(#ph_ipad_light_glow)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="65" cy="80" r="34" fill="#8b5cf6"/>
    <path d="M65 64 L65 96 M49 80 L81 80" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <text x="0" y="240" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="64" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.5">No iPad Screenshot Uploaded</text>
    <text x="0" y="320" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="38" font-weight="500" fill="#64748b" text-anchor="middle">iPad Target: 2048 × 2732 px (3:4 Ratio)</text>
    <text x="0" y="385" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="32" font-weight="400" fill="#94a3b8" text-anchor="middle">PNG or JPEG · Up to 8 MB · Supports Landscape &amp; Portrait</text>
  </g>
</svg>
`);

const PH_TAB_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1600" width="2560" height="1600">
  <defs>
    <linearGradient id="ph_tab_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_tab_light_glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="2560" height="1600" fill="url(#ph_tab_light_bg)"/>
  <rect x="60" y="60" width="2440" height="1480" rx="60" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <g transform="translate(1280, 750)">
    <circle cx="0" cy="0" r="160" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" stroke-width="3"/>
    <rect x="-100" y="-65" width="200" height="130" rx="16" fill="none" stroke="url(#ph_tab_light_glow)" stroke-width="7"/>
    <circle cx="85" cy="0" r="5" fill="url(#ph_tab_light_glow)"/>
    <circle cx="75" cy="50" r="30" fill="#10b981"/>
    <path d="M75 36 L75 64 M61 50 L89 50" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="220" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="56" font-weight="700" fill="#0f172a" text-anchor="middle">No Tablet Screenshot Uploaded</text>
    <text x="0" y="295" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#64748b" text-anchor="middle">Google Play Target: 16:10 or 16:9 Landscape · Up to 8 MB</text>
    <text x="0" y="355" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#94a3b8" text-anchor="middle">If empty, tablet mockups automatically display phone screenshots</text>
  </g>
</svg>
`);

// --- Feature Graphics (1024×500 px for Google Play) ---
const DEFAULT_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="fglow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#818cf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#fbg)"/>
  <circle cx="850" cy="180" r="260" fill="#38bdf8" opacity="0.12"/>
  <g transform="translate(80, 105)">
    <rect width="100" height="100" rx="24" fill="#1e1b4b" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <circle cx="50" cy="50" r="32" fill="none" stroke="url(#fglow)" stroke-width="6" stroke-linecap="round"/>
    <path d="M36 51 L46 61 L66 41" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="205" y="152" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-0.5">TaskFlow</text>
  <text x="205" y="190" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="url(#fglow)">HABIT TRACKER &amp; PRODUCTIVITY PLANNER</text>
  <text x="80" y="265" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Organize Daily Habits, Build Momentum</text>
  <text x="80" y="305" font-family="-apple-system,system-ui,sans-serif" font-size="16" fill="#94a3b8">Smart streaks, focus timer sessions, and seamless cross-device cloud sync.</text>
  <g transform="translate(80, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">🔥 24-Day Streak</text>
  </g>
  <g transform="translate(280, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(129,140,248,0.15)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#c084fc" text-anchor="middle">⏱ Focus Timer</text>
  </g>
  <g transform="translate(480, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#34d399" text-anchor="middle">★ 4.9 Rated</text>
  </g>
  <g transform="translate(710, 85)">
    <rect width="240" height="330" rx="24" fill="#182238" stroke="#334155" stroke-width="2"/>
    <text x="25" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Daily Progress</text>
    <text x="215" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#38bdf8" text-anchor="end">85%</text>
    <rect x="25" y="65" width="190" height="8" rx="4" fill="#334155"/>
    <rect x="25" y="65" width="160" height="8" rx="4" fill="url(#fglow)"/>
    <g transform="translate(25, 95)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#10b981"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Morning Routine</text></g>
    <g transform="translate(25, 165)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#38bdf8"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Deep Focus 25m</text></g>
    <g transform="translate(25, 235)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#f59e0b"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Evening Reading</text></g>
  </g>
</svg>
`);

// --- PulseFit Workout & Fitness Assets ---
const PULSEFIT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="pfitBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e18"/>
      <stop offset="50%" stop-color="#0f1b2d"/>
      <stop offset="100%" stop-color="#16273f"/>
    </linearGradient>
    <linearGradient id="pfG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b35"/>
      <stop offset="50%" stop-color="#ff8c42"/>
      <stop offset="100%" stop-color="#ffc107"/>
    </linearGradient>
    <filter id="pfGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#ff7a00" flood-opacity="0.55"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#pfitBg)"/>
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#pfG)" stroke-width="20" stroke-dasharray="640 200" stroke-linecap="round" opacity="0.35"/>
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#pfG)" stroke-width="20" stroke-dasharray="460 500" stroke-linecap="round" filter="url(#pfGlow)"/>
  <!-- Barbell Plates & Shaft -->
  <rect x="156" y="246" width="200" height="20" rx="10" fill="#ffffff" filter="url(#pfGlow)"/>
  <rect x="128" y="206" width="28" height="100" rx="10" fill="url(#pfG)"/>
  <rect x="96" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9"/>
  <rect x="356" y="206" width="28" height="100" rx="10" fill="url(#pfG)"/>
  <rect x="392" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9"/>
  <!-- Heart Pulse Beat -->
  <path d="M120 256 L180 256 L205 185 L240 335 L272 205 L300 285 L325 256 L392 256" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" filter="url(#pfGlow)"/>
  <circle cx="205" cy="185" r="9" fill="#ffc107"/>
</svg>
`);

const PULSEFIT_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="50%" stop-color="#0f1929"/><stop offset="100%" stop-color="#182538"/></linearGradient>
    <linearGradient id="pfr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff5722"/><stop offset="100%" stop-color="#ff9800"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">WORKOUT &amp; SET LOGGER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Track Heavy Sets &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#pfr)" text-anchor="middle">Auto Rest Timers</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Progressive overload tracking for muscle hypertrophy</text>

  <g transform="translate(30, 240)">
    <rect width="400" height="260" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#fff">🏋️ Barbell Bench Press</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">Set 3 of 4</text>
    
    <!-- Table Rows -->
    <g transform="translate(25, 65)">
      <rect width="350" height="38" rx="8" fill="#1b283d"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 1</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">90 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">10 reps</text>
      <text x="320" y="24" font-size="14" fill="#10b981">✓</text>
    </g>
    <g transform="translate(25, 110)">
      <rect width="350" height="38" rx="8" fill="#1b283d"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 2</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">95 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">8 reps</text>
      <text x="320" y="24" font-size="14" fill="#10b981">✓</text>
    </g>
    <g transform="translate(25, 155)">
      <rect width="350" height="42" rx="10" fill="rgba(255,107,53,0.18)" stroke="#ff6b35" stroke-width="1.5"/>
      <text x="20" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ff8c42">SET 3 (ACTIVE)</text>
      <text x="120" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">100 kg</text>
      <text x="220" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">8 reps</text>
      <rect x="290" y="8" width="50" height="26" rx="13" fill="#ff6b35"/>
      <text x="315" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">Log</text>
    </g>
    <g transform="translate(25, 205)">
      <rect width="350" height="38" rx="8" fill="#1b283d" opacity="0.6"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 4</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#64748b">100 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#64748b">6–8 reps</text>
      <text x="320" y="24" font-size="13" fill="#64748b">⋯</text>
    </g>
  </g>

  <!-- Rest Timer Banner -->
  <g transform="translate(30, 520)">
    <rect width="400" height="120" rx="20" fill="#152135" stroke="#ff6b35" stroke-width="1.5"/>
    <circle cx="65" cy="60" r="38" fill="none" stroke="#223654" stroke-width="7"/>
    <circle cx="65" cy="60" r="38" fill="none" stroke="#ff6b35" stroke-width="7" stroke-dasharray="160 80" stroke-linecap="round"/>
    <text x="65" y="66" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">01:45</text>
    <text x="125" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Rest Interval</text>
    <text x="125" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Next up: Set 4 Heavy Push</text>
    <rect x="315" y="42" width="70" height="36" rx="18" fill="rgba(255,255,255,0.1)"/>
    <text x="350" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">+30s</text>
  </g>

  <!-- Next Exercise -->
  <g transform="translate(30, 660)">
    <rect width="400" height="85" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="25" y="38" font-size="22">🦵</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Barbell Back Squat</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">4 Sets · 120 kg Target</text>
    <text x="375" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">Up Next →</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="50%" stop-color="#0e1828"/><stop offset="100%" stop-color="#172439"/></linearGradient>
    <linearGradient id="hrGlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff9800"/><stop offset="50%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">LIVE CARDIAC METRICS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Heart Rate Zones &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#hrGlow)" text-anchor="middle">Active Burn</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Synchronized with Apple Watch &amp; Wear OS sensors</text>

  <!-- Big Heart Rate Gauge -->
  <g transform="translate(230, 390)">
    <circle cx="0" cy="0" r="130" fill="none" stroke="#1a273b" stroke-width="18"/>
    <circle cx="0" cy="0" r="130" fill="none" stroke="url(#hrGlow)" stroke-width="18" stroke-dasharray="580 250" stroke-linecap="round"/>
    <text x="0" y="-15" font-size="34" text-anchor="middle">❤️</text>
    <text x="0" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">154</text>
    <text x="0" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#ff8c42" text-anchor="middle">BPM · ZONE 4 (HARD)</text>
  </g>

  <!-- Live Stats Grid -->
  <g transform="translate(30, 560)">
    <rect width="190" height="110" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Active Burn</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="900" fill="#ff6b35">520</text>
    <text x="85" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#ff8c42">kcal</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#10b981">● Target on track</text>
  </g>
  <g transform="translate(240, 560)">
    <rect width="190" height="110" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Session Duration</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="900" fill="#ffc107">38:20</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#ffc107">● 82% in Zone 3/4</text>
  </g>

  <g transform="translate(30, 690)">
    <rect width="400" height="85" rx="18" fill="#152135" stroke="#ff6b35" stroke-width="1"/>
    <text x="25" y="48" font-size="26">⌚</text>
    <text x="65" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Apple Watch Ultra Linked</text>
    <text x="65" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#10b981">● Real-time optical HR &amp; GPS tracking active</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="100%" stop-color="#162235"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ffc107" text-anchor="middle">MACRO &amp; MEAL SCANNER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Precision Nutrition &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ff6b35" text-anchor="middle">Daily Protein Target</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Instant barcode scanning with verified nutritional database</text>

  <g transform="translate(30, 240)">
    <rect width="400" height="230" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Daily Calorie Balance</text>
    <text x="375" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffc107" text-anchor="end">250 kcal Left</text>
    <text x="25" y="85" font-family="-apple-system,system-ui,sans-serif" font-size="38" font-weight="900" fill="#fff">2,150 <tspan font-size="18" fill="#94a3b8">/ 2,400 kcal</tspan></text>
    
    <!-- Macro Bars -->
    <g transform="translate(25, 120)">
      <text x="0" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff6b35">Protein</text>
      <text x="350" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">175g / 180g (97%)</text>
      <rect x="0" y="24" width="350" height="10" rx="5" fill="#1b283d"/>
      <rect x="0" y="24" width="340" height="10" rx="5" fill="#ff6b35"/>
    </g>
    <g transform="translate(25, 165)">
      <text x="0" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffc107">Carbs</text>
      <text x="350" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffc107" text-anchor="end">210g / 250g (84%)</text>
      <rect x="0" y="24" width="350" height="10" rx="5" fill="#1b283d"/>
      <rect x="0" y="24" width="294" height="10" rx="5" fill="#ffc107"/>
    </g>
  </g>

  <!-- Meal Logs -->
  <g transform="translate(30, 495)">
    <rect width="400" height="75" rx="16" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="44" font-size="22">🍳</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Breakfast: 3 Eggs &amp; Oatmeal</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">650 kcal · 42g Protein</text>
    <text x="375" y="44" font-size="14" fill="#10b981" text-anchor="end">✓ Logged</text>
  </g>
  <g transform="translate(30, 585)">
    <rect width="400" height="75" rx="16" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="44" font-size="22">🥗</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Lunch: Grilled Salmon &amp; Rice</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">780 kcal · 58g Protein</text>
    <text x="375" y="44" font-size="14" fill="#10b981" text-anchor="end">✓ Logged</text>
  </g>
  <g transform="translate(30, 675)">
    <rect width="400" height="75" rx="16" fill="rgba(255,107,53,0.14)" stroke="#ff6b35" stroke-width="1.5"/>
    <text x="20" y="44" font-size="22">📷</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">Scan Barcode / Log Dinner</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#ff8c42">Remaining: 250 kcal · 5g Protein</text>
    <text x="375" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ff6b35" text-anchor="end">+ Scan</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="100%" stop-color="#162235"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">STRENGTH ANALYTICS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Personal Records &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#gold)" text-anchor="middle">Volume Progression</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Automated 1-Rep Max curves &amp; recovery indicators</text>

  <!-- Big PR Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="150" rx="22" fill="#18253a" stroke="#fbbf24" stroke-width="2"/>
    <text x="30" y="45" font-size="28">🏆</text>
    <text x="75" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="url(#gold)">NEW ALL-TIME RECORD</text>
    <text x="75" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#fff">Deadlift: 185 kg</text>
    <text x="75" y="98" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">+10 kg over previous personal best</text>
    <rect x="75" y="112" width="120" height="24" rx="12" fill="rgba(245,158,11,0.2)"/>
    <text x="135" y="128" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fbbf24" text-anchor="middle">Top 5% Lifter</text>
  </g>

  <!-- Monthly Volume Chart -->
  <g transform="translate(30, 415)">
    <rect width="400" height="230" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Monthly Lifted Volume</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#10b981" text-anchor="end">+14.2% Gain</text>
    <!-- Bar graph -->
    <g transform="translate(30, 75)">
      <rect x="0" y="50" width="35" height="90" rx="6" fill="#1e2c44"/>
      <rect x="60" y="40" width="35" height="100" rx="6" fill="#1e2c44"/>
      <rect x="120" y="25" width="35" height="115" rx="6" fill="#ff6b35"/>
      <rect x="180" y="30" width="35" height="110" rx="6" fill="#ff6b35"/>
      <rect x="240" y="15" width="35" height="125" rx="6" fill="#ff6b35"/>
      <rect x="300" y="0" width="35" height="140" rx="6" fill="url(#gold)"/>
      <text x="17" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W1</text>
      <text x="77" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W2</text>
      <text x="137" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W3</text>
      <text x="197" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W4</text>
      <text x="257" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W5</text>
      <text x="317" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fbbf24" text-anchor="middle">Current</text>
    </g>
  </g>

  <!-- Recovery State -->
  <g transform="translate(30, 670)">
    <rect width="400" height="85" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="25" y="48" font-size="24">🔋</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Muscle Recovery: 92% Ready</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#10b981">Chest &amp; Triceps fully primed for today's push workout</text>
  </g>
</svg>
`);

const PULSEFIT_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#080d16"/><stop offset="100%" stop-color="#152134"/></linearGradient>
    <linearGradient id="porange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#ff9800"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#pbg)"/>
  <circle cx="850" cy="200" r="260" fill="#ff6b35" opacity="0.12"/>
  <text x="80" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff">PulseFit: Workout &amp; Fitness</text>
  <text x="80" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="600" fill="url(#porange)">STRENGTH LOGGER · HIIT PLANS · MACRO NUTRITION</text>
  <text x="80" y="280" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Crush Your Personal Fitness Records</text>
  <text x="80" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Over 300+ guided workouts, Apple Health &amp; Health Connect synchronization.</text>
  <g transform="translate(80, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(255,107,53,0.15)" stroke="#ff6b35" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#ff8c42" text-anchor="middle">🏋️ 300+ Routines</text>
  </g>
  <g transform="translate(280, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fde68a" text-anchor="middle">❤️ Heart Rate Live</text>
  </g>
</svg>
`);

// --- ZenMind Meditation & Sleep Assets ---
const ZENMIND_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="zmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05140e"/>
      <stop offset="50%" stop-color="#0c2319"/>
      <stop offset="100%" stop-color="#143527"/>
    </linearGradient>
    <linearGradient id="zmGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="zmGlow" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0"/>
      <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="zmRadial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="#059669" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#05140e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#zmBg)"/>
  <circle cx="256" cy="256" r="210" fill="url(#zmRadial)"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(52,211,153,0.25)" stroke-width="2"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="rgba(110,231,183,0.2)" stroke-width="1.5" stroke-dasharray="6 6"/>

  <!-- Crescent Moon Glow -->
  <g transform="translate(256, 150)">
    <path d="M 0 -45 A 36 36 0 0 0 32 -10 A 42 42 0 1 1 -5 -45 Z" fill="#fde68a" opacity="0.95"/>
    <circle cx="15" cy="-28" r="3" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Sacred Lotus Petals in Emerald & Mint Bamboo -->
  <g transform="translate(256, 300)">
    <!-- Aura behind lotus -->
    <ellipse cx="0" cy="15" rx="110" ry="25" fill="url(#zmGlow)"/>
    <!-- Outer Left Petal -->
    <path d="M 0 20 C -70 10 -115 -25 -100 -70 C -75 -65 -35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.7"/>
    <!-- Outer Right Petal -->
    <path d="M 0 20 C 70 10 115 -25 100 -70 C 75 -65 35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.7"/>
    <!-- Mid Left Petal -->
    <path d="M 0 20 C -55 -15 -80 -70 -50 -105 C -35 -80 -10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.88"/>
    <!-- Mid Right Petal -->
    <path d="M 0 20 C 55 -15 80 -70 50 -105 C 35 -80 10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.88"/>
    <!-- Center Lotus Petal -->
    <path d="M 0 20 C -35 -35 -35 -105 0 -130 C 35 -105 35 -35 0 20 Z" fill="#ffffff" opacity="0.95"/>
    <!-- Lotus Core Light -->
    <circle cx="0" cy="-20" r="12" fill="#fde68a"/>
    <!-- Gentle Water Ripple Base -->
    <ellipse cx="0" cy="22" rx="70" ry="8" fill="none" stroke="#34d399" stroke-width="3" opacity="0.6"/>
    <ellipse cx="0" cy="28" rx="45" ry="5" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.4"/>
  </g>
</svg>
`);

const ZENMIND_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="50%" stop-color="#0c2319"/><stop offset="100%" stop-color="#143527"/></linearGradient>
    <linearGradient id="zmHeadGlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#34d399" text-anchor="middle">DAILY GUIDED MEDITATION</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Start Your Morning with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#zmHeadGlow)" text-anchor="middle">Clarity &amp; Inner Peace</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">5 to 20-minute guided practices for a calm, centered mind</text>

  <!-- Player Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="340" rx="24" fill="#0d2319" stroke="#1c4733" stroke-width="1.5"/>
    
    <!-- Audio Waveform Graphic -->
    <g transform="translate(35, 30)">
      <circle cx="165" cy="80" r="75" fill="rgba(52,211,153,0.12)"/>
      <circle cx="165" cy="80" r="50" fill="rgba(110,231,183,0.18)"/>
      <text x="165" y="88" font-size="36" text-anchor="middle">🧘‍♀️</text>
    </g>

    <text x="200" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="19" font-weight="800" fill="#fff" text-anchor="middle">Morning Gratitude &amp; Focus</text>
    <text x="200" y="224" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Voice: Sarah Jenkins · 15 Min Practice</text>

    <!-- Progress Bar -->
    <g transform="translate(35, 250)">
      <rect width="330" height="6" rx="3" fill="#183b2b"/>
      <rect width="190" height="6" rx="3" fill="url(#zmHeadGlow)"/>
      <circle cx="190" cy="3" r="7" fill="#ffffff"/>
      <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">08:42</text>
      <text x="330" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8" text-anchor="end">15:00</text>
    </g>

    <!-- Playback Controls -->
    <g transform="translate(200, 305)">
      <circle cx="-50" cy="0" r="18" fill="rgba(255,255,255,0.08)"/>
      <text x="-50" y="5" font-size="14" fill="#fff" text-anchor="middle">↺ 15</text>
      <circle cx="0" cy="0" r="26" fill="url(#zmHeadGlow)"/>
      <polygon points="-5,-10 -5,10 8,0" fill="#05140e"/>
      <circle cx="50" cy="0" r="18" fill="rgba(255,255,255,0.08)"/>
      <text x="50" y="5" font-size="14" fill="#fff" text-anchor="middle">15 ↻</text>
    </g>
  </g>

  <!-- Daily Intention Quote Card -->
  <g transform="translate(30, 605)">
    <rect width="400" height="95" rx="18" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="25" y="34" font-size="20">✨</text>
    <text x="58" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fde68a">DAILY INTENTION</text>
    <text x="58" y="56" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="600" fill="#ffffff">"Breathe in calm presence, exhale yesterday's tension."</text>
    <text x="58" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#34d399">Day 14 of 30 · Mindful Awareness Series</text>
  </g>

  <!-- Sound Atmosphere Pill -->
  <g transform="translate(30, 720)">
    <rect width="400" height="80" rx="18" fill="#0f2b1f" stroke="#22583e" stroke-width="1"/>
    <text x="25" y="46" font-size="24">🔔</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Ambient Background: Tibetan Singing Bowls</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#86efac">432 Hz Solfeggio Harmonics · Volume 35%</text>
    <text x="375" y="46" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">Active ♫</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="50%" stop-color="#0c2217"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="moonG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#86efac" text-anchor="middle">NEURO-ACOUSTIC SOUNDSCAPES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Fall Asleep Fast to</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#moonG)" text-anchor="middle">3D Binaural Soundscapes</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Layer rain, ocean waves, night crickets, and delta waves</text>

  <!-- 3D Sound Mixer Box -->
  <g transform="translate(30, 240)">
    <rect width="400" height="375" rx="24" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Live Soundscape Mixer</text>
    <rect x="290" y="24" width="85" height="26" rx="13" fill="rgba(52,211,153,0.15)"/>
    <text x="332" y="41" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">4 Layers</text>

    <!-- Track 1: Rain on Window -->
    <g transform="translate(25, 75)">
      <text x="0" y="22" font-size="20">🌧️</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Soft Rain on Skylight</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#6ee7b7" text-anchor="end">75%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="236" height="8" rx="4" fill="#34d399"/>
    </g>

    <!-- Track 2: Distant Thunder -->
    <g transform="translate(25, 145)">
      <text x="0" y="22" font-size="20">⚡</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Distant Rolling Thunder</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#a7f3d0" text-anchor="end">40%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="126" height="8" rx="4" fill="#6ee7b7"/>
    </g>

    <!-- Track 3: Pine Forest Wind -->
    <g transform="translate(25, 215)">
      <text x="0" y="22" font-size="20">🌲</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Highland Pine Wind</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">55%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="173" height="8" rx="4" fill="#10b981"/>
    </g>

    <!-- Track 4: Delta Brainwaves (Sleep Induction) -->
    <g transform="translate(25, 285)">
      <text x="0" y="22" font-size="20">🧠</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Delta Sleep Induction (2.5 Hz)</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#86efac" text-anchor="end">30%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="94" height="8" rx="4" fill="#86efac"/>
    </g>
  </g>

  <!-- Sleep Timer Card -->
  <g transform="translate(30, 640)">
    <rect width="400" height="85" rx="18" fill="#0f291d" stroke="#1d523b" stroke-width="1.5"/>
    <text x="25" y="48" font-size="26">🌙</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Smart Sleep Timer Enabled</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Auto-fades volume smoothly in 45 mins</text>
    <rect x="305" y="30" width="75" height="28" rx="14" fill="#173b2a"/>
    <text x="342" y="49" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#6ee7b7" text-anchor="middle">45m ⏱</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="orbG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#34d399" text-anchor="middle">PACED BREATHWORK</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Soothe Anxiety with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">4-7-8 Breathing Orb</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Stimulate the vagus nerve and regulate heart rate variability</text>

  <!-- Big Breathing Orb Visual -->
  <g transform="translate(230, 390)">
    <circle cx="0" cy="0" r="140" fill="rgba(52,211,153,0.08)"/>
    <circle cx="0" cy="0" r="115" fill="rgba(110,231,183,0.15)"/>
    <circle cx="0" cy="0" r="90" fill="url(#orbG)" opacity="0.9"/>
    <circle cx="0" cy="0" r="65" fill="#ffffff" opacity="0.3"/>
    <text x="0" y="-10" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">HOLD</text>
    <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">7s</text>
    <text x="0" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#062215" text-anchor="middle">CYCLE 3 OF 6</text>
  </g>

  <!-- Technique Selector -->
  <g transform="translate(30, 580)">
    <rect width="400" height="75" rx="18" fill="#0c2217" stroke="#34d399" stroke-width="1.5"/>
    <text x="20" y="44" font-size="22">🫁</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">4-7-8 Relaxing Breath (Active)</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#6ee7b7">Inhale 4s · Hold 7s · Exhale 8s · Anxiety Relief</text>
  </g>

  <g transform="translate(30, 670)">
    <rect width="190" height="85" rx="16" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="18" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Box Breathing</text>
    <text x="18" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">4-4-4-4 Navy SEAL focus</text>
    <text x="18" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399">Switch Mode →</text>
  </g>

  <g transform="translate(240, 670)">
    <rect width="190" height="85" rx="16" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="18" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Awake Energizer</text>
    <text x="18" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">6-0-2-0 Morning alertness</text>
    <text x="18" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399">Switch Mode →</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#6ee7b7" text-anchor="middle">MINDFUL HABITS &amp; SLEEP</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Track Mindful Minutes &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#greenGrad)" text-anchor="middle">Restorative Sleep Score</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Apple Health Mindful Minutes &amp; Sleep Stages sync</text>

  <!-- Sleep Quality Score Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="200" rx="22" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Last Night's Sleep Quality</text>
    <text x="375" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">✓ Restorative</text>

    <g transform="translate(25, 75)">
      <circle cx="45" cy="45" r="42" fill="none" stroke="#173b2a" stroke-width="8"/>
      <circle cx="45" cy="45" r="42" fill="none" stroke="#34d399" stroke-width="8" stroke-dasharray="240 70" stroke-linecap="round"/>
      <text x="45" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#fff" text-anchor="middle">91</text>
      <text x="45" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">SCORE</text>

      <g transform="translate(110, 10)">
        <text x="0" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Total Time Asleep: 7h 48m</text>
        <text x="0" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Deep Sleep: 2h 15m (Optimal)</text>
        <text x="0" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">REM Sleep: 1h 52m · Latency: 12m</text>
      </g>
    </g>
  </g>

  <!-- 7-Day Mindful Consistency -->
  <g transform="translate(30, 460)">
    <rect width="400" height="210" rx="22" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Weekly Mindful Streak</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fde68a" text-anchor="end">🔥 21 Days</text>

    <!-- 7 Day Circles -->
    <g transform="translate(25, 75)">
      <g transform="translate(15,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" font-size="12" fill="#fff" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">M</text></g>
      <g transform="translate(65,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">T</text></g>
      <g transform="translate(115,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">W</text></g>
      <g transform="translate(165,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">T</text></g>
      <g transform="translate(215,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">F</text></g>
      <g transform="translate(265,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">S</text></g>
      <g transform="translate(315,0)"><circle cx="15" cy="15" r="18" fill="url(#greenGrad)"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">★</text><text x="15" y="50" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">Today</text></g>
    </g>

    <text x="25" y="175" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Total this week: <tspan font-weight="800" fill="#fff">145 Mindful Minutes</tspan> logged.</text>
  </g>

  <!-- Health Badge -->
  <g transform="translate(30, 690)">
    <rect width="400" height="75" rx="18" fill="#0f291d" stroke="#22583e" stroke-width="1"/>
    <text x="25" y="44" font-size="22">❤️</text>
    <text x="65" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Apple Health &amp; Health Connect Sync</text>
    <text x="65" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#86efac">All mindful sessions saved to your personal health record</text>
  </g>
</svg>
`);

const ZENMIND_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="zbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#143527"/></linearGradient>
    <linearGradient id="zgreen" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#zbg)"/>
  <circle cx="850" cy="200" r="260" fill="#34d399" opacity="0.1"/>
  <text x="80" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff">ZenMind: Meditation &amp; Sleep</text>
  <text x="80" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="600" fill="url(#zgreen)">MINDFULNESS · SLEEP STORIES · 4-7-8 BREATHWORK</text>
  <text x="80" y="280" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Sleep Peacefully &amp; Reduce Daily Stress</text>
  <text x="80" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Binaural 3D nature soundscapes, evidence-based guided meditation sessions.</text>
  <g transform="translate(80, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#6ee7b7" text-anchor="middle">🌙 Sleep Better</text>
  </g>
  <g transform="translate(280, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#a7f3d0" text-anchor="middle">🧘 100+ Journeys</text>
  </g>
</svg>
`);

const BLANK_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="#121a2c"/>
  <rect x="20" y="20" width="984" height="460" rx="16" fill="none" stroke="#2f3e66" stroke-width="2" stroke-dasharray="10 10"/>
  <g transform="translate(480, 218)" stroke="#64748b" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="64" height="64" rx="12"/>
    <circle cx="20" cy="20" r="5"/>
    <path d="M64 44 L46 26 L14 58"/>
    <path d="M40 44 L48 34 L64 50"/>
  </g>
</svg>
`);

const BLANK_FEATURE_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="#f8fafc"/>
  <rect x="20" y="20" width="984" height="460" rx="16" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="10 10"/>
  <g transform="translate(480, 218)" stroke="#94a3b8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="64" height="64" rx="12" fill="#ffffff" fill-opacity="0.9"/>
    <circle cx="20" cy="20" r="5" fill="#94a3b8"/>
    <path d="M64 44 L46 26 L14 58"/>
    <path d="M40 44 L48 34 L64 50"/>
  </g>
</svg>
`);

/* @pro-only-start */
// --- Game Preset Assets (CyberStrike RPG) ---
const CYBER_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#05050b"/><stop offset="40%" stop-color="#0f0e1c"/><stop offset="100%" stop-color="#1e0b2e"/></linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00f5ff"/><stop offset="100%" stop-color="#0077fe"/></linearGradient>
    <linearGradient id="neonPink" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ff007f"/><stop offset="100%" stop-color="#7928ca"/></linearGradient>
    <filter id="c-glow"><feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#00f5ff" flood-opacity="0.8"/></filter>
    <filter id="p-glow"><feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#ff007f" flood-opacity="0.75"/></filter>
  </defs>
  <rect width="512" height="512" fill="url(#cbg)"/>
  <rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="url(#neonPink)" stroke-width="4" opacity="0.4"/>
  <path d="M40 120 L120 120 L160 160 M472 120 L392 120 L352 160 M40 392 L120 392 L160 352 M472 392 L392 392 L352 352" stroke="#00f5ff" stroke-width="3" fill="none" opacity="0.3"/>
  <path d="M160 170 L352 170 L382 250 L322 360 L190 360 L130 250 Z" fill="#131422" stroke="url(#neonCyan)" stroke-width="8" filter="url(#c-glow)"/>
  <polygon points="175,230 337,230 315,268 197,268" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <line x1="160" y1="249" x2="352" y2="249" stroke="#ffffff" stroke-width="4" filter="url(#c-glow)"/>
  <polygon points="170,165 140,90 200,140" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <polygon points="342,165 372,90 312,140" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <rect x="226" y="300" width="12" height="35" rx="4" fill="#00f5ff" opacity="0.8"/>
  <rect x="250" y="295" width="12" height="42" rx="4" fill="#00f5ff" opacity="0.9"/>
  <rect x="274" y="300" width="12" height="35" rx="4" fill="#00f5ff" opacity="0.8"/>
</svg>
`);

const CYBER_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="cfbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#060713"/><stop offset="50%" stop-color="#0e1026"/><stop offset="100%" stop-color="#240e34"/></linearGradient>
    <linearGradient id="neonT" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00f5ff"/><stop offset="50%" stop-color="#ff007f"/><stop offset="100%" stop-color="#ffe600"/></linearGradient>
    <linearGradient id="cgrid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#ff007f" stop-opacity="0.3"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#cfbg)"/>
  <path d="M0 380 L1024 380 L1024 500 L0 500 Z" fill="url(#cgrid)"/>
  <line x1="100" y1="380" x2="0" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="300" y1="380" x2="200" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="512" y1="380" x2="512" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="724" y1="380" x2="824" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="924" y1="380" x2="1024" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="0" y1="420" x2="1024" y2="420" stroke="#ff007f" stroke-width="1.5" opacity="0.3"/>
  <line x1="0" y1="460" x2="1024" y2="460" stroke="#ff007f" stroke-width="1.5" opacity="0.4"/>
  <circle cx="780" cy="220" r="160" fill="none" stroke="#ff007f" stroke-width="6" opacity="0.3"/>
  <circle cx="780" cy="220" r="120" fill="none" stroke="#00f5ff" stroke-width="4" opacity="0.4"/>
  <g transform="translate(620, 40)"><rect width="150" height="34" rx="17" fill="rgba(0,245,255,0.15)" stroke="#00f5ff" stroke-width="1.5"/><text x="75" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#00f5ff" text-anchor="middle">⚡ UNREAL ENGINE 5</text></g>
  <g transform="translate(785, 40)"><rect width="150" height="34" rx="17" fill="rgba(255,0,127,0.15)" stroke="#ff007f" stroke-width="1.5"/><text x="75" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ff007f" text-anchor="middle">🎮 120 FPS ULTRA</text></g>
  <text x="70" y="150" font-family="-apple-system,system-ui,sans-serif" font-size="52" font-weight="900" fill="url(#neonT)" letter-spacing="1">CYBERSTRIKE</text>
  <text x="70" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="3">2088 · OPEN WORLD CYBER RPG</text>
  <text x="70" y="260" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#00f5ff">Season 4: Neon Uprising is Live!</text>
  <text x="70" y="295" font-family="-apple-system,system-ui,sans-serif" font-size="16" fill="#cbd5e1">Pilot combat mechs, master cyber-blade combos, and conquer 10-player co-op raids.</text>
  <g transform="translate(70, 335)"><rect width="170" height="44" rx="12" fill="rgba(0,245,255,0.18)" stroke="#00f5ff" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#00f5ff" text-anchor="middle">⚔️ Real-Time Combat</text></g>
  <g transform="translate(255, 335)"><rect width="170" height="44" rx="12" fill="rgba(255,0,127,0.18)" stroke="#ff007f" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ff007f" text-anchor="middle">🤖 Mech Exosuits</text></g>
  <g transform="translate(440, 335)"><rect width="170" height="44" rx="12" fill="rgba(255,230,0,0.18)" stroke="#ffe600" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ffe600" text-anchor="middle">★ 4.9 · 100K+ Players</text></g>
</svg>
`);

const CYBER_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#0c0e22"/><stop offset="100%" stop-color="#1b0728"/></linearGradient>
    <linearGradient id="nCyan" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00f5ff"/><stop offset="100%" stop-color="#0066fe"/></linearGradient>
    <linearGradient id="nPink" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff007f"/><stop offset="100%" stop-color="#9900ff"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#00f5ff" text-anchor="middle">NEXT-GEN OPEN WORLD</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">EXPLORE NEO-SHINJUKU</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Massive Cyberpunk City with Complete Freedom</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090a18" stroke="#00f5ff" stroke-width="2"/>
    <rect x="20" y="120" width="70" height="480" fill="#121633" opacity="0.6"/>
    <rect x="100" y="80" width="85" height="520" fill="#181c44" opacity="0.8"/>
    <rect x="195" y="40" width="105" height="560" fill="#1f2358"/>
    <rect x="310" y="100" width="80" height="500" fill="#141838" opacity="0.7"/>
    <circle cx="230" cy="90" r="14" fill="#ff007f" opacity="0.7"/>
    <rect x="210" y="140" width="75" height="8" rx="4" fill="#00f5ff" opacity="0.6"/>
    <rect x="210" y="180" width="75" height="8" rx="4" fill="#ff007f" opacity="0.5"/>
    <rect x="210" y="220" width="75" height="8" rx="4" fill="#ffe600" opacity="0.7"/>
    <path d="M140 280 L220 270 L280 282 L180 290 Z" fill="#00f5ff" opacity="0.85"/>
    <line x1="120" y1="285" x2="160" y2="285" stroke="#ff007f" stroke-width="4"/>
    <ellipse cx="206" cy="530" rx="40" ry="12" fill="#00f5ff" opacity="0.4"/>
    <circle cx="206" cy="440" r="22" fill="#00f5ff"/>
    <path d="M186 465 L226 465 L236 530 L176 530 Z" fill="#ffffff"/>
    <line x1="236" y1="470" x2="270" y2="420" stroke="#ff007f" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(20, 20)"><circle cx="36" cy="36" r="34" fill="rgba(15,23,42,0.85)" stroke="#00f5ff" stroke-width="2"/><circle cx="36" cy="36" r="4" fill="#00f5ff"/><circle cx="24" cy="22" r="3" fill="#ff007f"/><circle cx="48" cy="45" r="3" fill="#ffe600"/></g>
    <g transform="translate(100, 28)"><rect width="180" height="12" rx="6" fill="#1e293b"/><rect width="155" height="12" rx="6" fill="url(#nPink)"/><text x="5" y="10" font-family="-apple-system,system-ui,sans-serif" font-size="9" font-weight="800" fill="#fff">HP 4,850 / 5,200</text><rect y="16" width="140" height="8" rx="4" fill="#1e293b"/><rect y="16" width="120" height="8" rx="4" fill="url(#nCyan)"/></g>
    <g transform="translate(260, 620)"><circle cx="40" cy="40" r="34" fill="rgba(255,0,127,0.3)" stroke="#ff007f" stroke-width="2.5"/><text x="40" y="47" font-size="20" text-anchor="middle">⚔️</text><circle cx="100" cy="15" r="22" fill="rgba(0,245,255,0.3)" stroke="#00f5ff" stroke-width="2"/><text x="100" y="21" font-size="14" fill="#fff" text-anchor="middle">⚡</text><circle cx="115" cy="65" r="22" fill="rgba(255,230,0,0.3)" stroke="#ffe600" stroke-width="2"/><text x="115" y="71" font-size="14" fill="#fff" text-anchor="middle">🛡</text></g>
  </g>
</svg>
`);

const CYBER_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#180a1c"/><stop offset="100%" stop-color="#240728"/></linearGradient>
    <linearGradient id="slash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00f5ff"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#ff007f"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#ff007f" text-anchor="middle">HACK &amp; SLASH ACTION</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">HIGH-SPEED COMBAT</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Fluid 60/120 FPS Aerial Combos &amp; Parries</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090a18" stroke="#ff007f" stroke-width="2"/>
    <path d="M60 460 Q210 200 370 420" fill="none" stroke="url(#slash)" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
    <path d="M80 470 Q210 240 350 440" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(40, 90)"><text x="0" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="48" font-weight="900" fill="#ffe600">142</text><text x="95" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="900" fill="#ff007f">COMBO HITS</text><text x="95" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#00f5ff">CRITICAL STRIKE! +380%</text></g>
    <text x="240" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffe600">CRIT 98,420</text>
    <text x="270" y="360" font-family="-apple-system,system-ui,sans-serif" font-size="22" font-weight="800" fill="#ff007f">45,120</text>
    <text x="210" y="390" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="700" fill="#00f5ff">PARRY!</text>
    <circle cx="280" cy="420" r="45" fill="#180e29" stroke="#ff007f" stroke-width="4"/>
    <circle cx="140" cy="490" r="24" fill="#00f5ff"/>
    <path d="M115 515 L165 515 L175 580 L115 580 Z" fill="#ffffff"/>
    <line x1="165" y1="510" x2="230" y2="430" stroke="#00f5ff" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>
`);

const CYBER_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#0a1928"/><stop offset="100%" stop-color="#072233"/></linearGradient>
    <linearGradient id="leg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffe600"/><stop offset="100%" stop-color="#ff9900"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#ffe600" text-anchor="middle">MECH ARSENAL &amp; GEAR</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">UPGRADE COMBAT MECHS</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">50+ Modular Weapons &amp; Cybernetic Exosuits</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090e1c" stroke="#ffe600" stroke-width="2"/>
    <rect x="25" y="30" width="362" height="230" rx="20" fill="#11182c" stroke="#334155" stroke-width="1.5"/>
    <text x="45" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="url(#leg)">★ LEGENDARY EXOSUIT</text>
    <text x="45" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="900" fill="#ffffff">Titan Striker MK-IV</text>
    <circle cx="290" cy="140" r="50" fill="none" stroke="#00f5ff" stroke-width="2" stroke-dasharray="6 4"/>
    <polygon points="290,105 320,140 290,175 260,140" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" stroke-width="2"/>
    <g transform="translate(45, 115)">
      <text x="0" y="15" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">ATK</text><rect x="35" y="6" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="6" width="120" height="9" rx="4" fill="#ff007f"/>
      <text x="0" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">DEF</text><rect x="35" y="29" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="29" width="105" height="9" rx="4" fill="#00f5ff"/>
      <text x="0" y="61" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">SPD</text><rect x="35" y="52" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="52" width="115" height="9" rx="4" fill="#ffe600"/>
    </g>
    <g transform="translate(25, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#ff007f" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🗡</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Plasma Blade</text></g>
    <g transform="translate(150, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#00f5ff" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🔫</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Rail Cannon</text></g>
    <g transform="translate(275, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#ffe600" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🛡</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Force Field</text></g>
    <rect x="25" y="405" width="362" height="50" rx="15" fill="url(#leg)"/>
    <text x="206" y="436" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="900" fill="#000" text-anchor="middle">⚡ UPGRADE TO TIER V (+24% PWR)</text>
  </g>
</svg>
`);

const CYBER_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs><linearGradient id="cs4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#140722"/><stop offset="100%" stop-color="#280520"/></linearGradient></defs>
  <rect width="460" height="996" fill="url(#cs4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#00f5ff" text-anchor="middle">ONLINE MULTIPLAYER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">10-PLAYER CO-OP RAIDS</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Conquer Colossal Titan Bosses Together</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#0b0718" stroke="#ff007f" stroke-width="2"/>
    <rect x="20" y="25" width="372" height="70" rx="16" fill="#190d2e" stroke="#ff007f" stroke-width="1.5"/>
    <text x="35" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="900" fill="#ff007f">☠️ RAID BOSS: TITAN DREADNOUGHT</text>
    <text x="375" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ffe600" text-anchor="end">PHASE 3/3</text>
    <rect x="35" y="60" width="340" height="12" rx="6" fill="#33103e"/><rect x="35" y="60" width="180" height="12" rx="6" fill="#ff007f"/>
    <g transform="translate(20, 115)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#00f5ff" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#00f5ff"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Viper (Tank)</text></g>
    <g transform="translate(20, 165)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#ff007f" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#ff007f"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Nova (DPS)</text></g>
    <g transform="translate(20, 215)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#10b981" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#10b981"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Echo (Heal)</text></g>
    <circle cx="280" cy="220" r="80" fill="#200d36" stroke="#ff007f" stroke-width="3"/>
    <text x="280" y="235" font-size="64" text-anchor="middle">👾</text>
    <line x1="160" y1="360" x2="250" y2="250" stroke="#00f5ff" stroke-width="4" stroke-dasharray="10 5"/>
    <line x1="220" y1="380" x2="270" y2="280" stroke="#ffe600" stroke-width="4"/>
    <line x1="300" y1="380" x2="290" y2="290" stroke="#ff007f" stroke-width="5"/>
  </g>
</svg>
`);

// // --- Online Video Courses & Skills Neutral Vector Assets (SkillSphere - Royal Blue Style) ---
const SKILL_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="skBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050d1a"/>
      <stop offset="50%" stop-color="#0a1931"/>
      <stop offset="100%" stop-color="#0f2b5c"/>
    </linearGradient>
    <linearGradient id="skBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="skCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="skGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="skGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#2563eb" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#skBg)"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#skBlue)" stroke-width="12" stroke-dasharray="720 180" stroke-linecap="round" opacity="0.4"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#skBlue)" stroke-width="12" stroke-dasharray="540 360" stroke-linecap="round" filter="url(#skGlow)"/>
  <rect x="136" y="146" width="240" height="220" rx="44" fill="#0d1f3c" stroke="#1e3a68" stroke-width="3"/>
  <polygon points="216,195 324,256 216,317" fill="url(#skBlue)" filter="url(#skGlow)"/>
  <polygon points="216,195 285,256 216,280" fill="url(#skCyan)" opacity="0.85"/>
  <path d="M190 146 L 256 112 L 322 146" fill="none" stroke="url(#skGold)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="112" r="6" fill="#fbbf24"/>
  <path d="M256 112 Q 330 118 340 155" fill="none" stroke="#fbbf24" stroke-width="3"/>
  <circle cx="176" cy="330" r="4" fill="#38bdf8"/>
  <circle cx="196" cy="330" r="4" fill="#38bdf8"/>
  <circle cx="216" cy="330" r="4" fill="#38bdf8"/>
  <rect x="236" y="328" width="100" height="4" rx="2" fill="#60a5fa"/>
  <path d="M370 140 L 375 152 L 387 157 L 375 162 L 370 174 L 365 162 L 353 157 L 365 152 Z" fill="#fbbf24"/>
</svg>
`);

const SKILL_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="sfeatBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#040b17"/>
      <stop offset="50%" stop-color="#081833"/>
      <stop offset="100%" stop-color="#0d2652"/>
    </linearGradient>
    <linearGradient id="sfeatBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="sfeatCyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#sfeatBg)"/>
  <circle cx="860" cy="180" r="260" fill="#2563eb" opacity="0.14"/>
  <circle cx="160" cy="420" r="180" fill="#0284c7" opacity="0.1"/>
  <g transform="translate(80, 85)">
    <rect width="90" height="90" rx="24" fill="#0b1a36" stroke="#1d4e89" stroke-width="2"/>
    <polygon points="38,28 64,45 38,62" fill="url(#sfeatBlue)"/>
    <rect x="110" y="16" width="180" height="28" rx="14" fill="rgba(37,99,235,0.2)"/>
    <text x="200" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="1.5" fill="#60a5fa" text-anchor="middle">ONLINE VIDEO COURSES</text>
    <text x="110" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="34" font-weight="900" fill="#ffffff">SkillSphere</text>
    <text x="0" y="135" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="900" fill="#ffffff">Learn In-Demand Skills</text>
    <text x="0" y="185" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="900" fill="url(#sfeatBlue)">From Top Tech Mentors</text>
    <text x="0" y="235" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Over 5,000+ video courses in Coding, AI, Design &amp; Business with certificates.</text>
    <g transform="translate(0, 275)">
      <rect width="170" height="42" rx="21" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="1.5"/>
      <text x="85" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#60a5fa" text-anchor="middle">🎬 5,000+ Courses</text>
      <rect x="185" y="0" width="160" height="42" rx="21" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="265" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#38bdf8" text-anchor="middle">⚡ 2x Speed &amp; PiP</text>
      <rect x="360" y="0" width="180" height="42" rx="21" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="450" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fbbf24" text-anchor="middle">🏅 Verified Degrees</text>
    </g>
  </g>
  <g transform="translate(680, 80)">
    <rect width="270" height="340" rx="28" fill="#0b172e" stroke="#1d3d6e" stroke-width="2"/>
    <rect x="20" y="20" width="230" height="135" rx="16" fill="#060f21"/>
    <circle cx="135" cy="80" r="26" fill="url(#sfeatBlue)"/>
    <polygon points="128,70 148,80 128,90" fill="#fff"/>
    <rect x="30" y="30" width="75" height="22" rx="11" fill="rgba(0,0,0,0.6)"/>
    <text x="67" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fbbf24" text-anchor="middle">★ BESTSELLER</text>
    <rect x="175" y="30" width="65" height="22" rx="11" fill="rgba(0,0,0,0.6)"/>
    <text x="207" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">1080p HD</text>
    <text x="20" y="180" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">Full-Stack AI &amp; Web 2026</text>
    <text x="20" y="202" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Dr. Angela Yu · 48 Hours Video</text>
    <text x="20" y="228" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#fbbf24">★ 4.9 (48.5K ratings)</text>
    <rect x="20" y="244" width="230" height="8" rx="4" fill="#13233f"/>
    <rect x="20" y="244" width="160" height="8" rx="4" fill="url(#sfeatBlue)"/>
    <text x="20" y="270" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">Progress: 68% (32/48h)</text>
    <g transform="translate(20, 285)">
      <text x="0" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="900" fill="#fff">$12.99</text>
      <text x="68" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#64748b" text-decoration="line-through">$84.99</text>
      <rect x="150" y="0" width="80" height="28" rx="14" fill="url(#sfeatBlue)"/>
      <text x="190" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">ENROLL</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">5,000+ ONLINE COURSES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Master In-Demand Skills</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp1)" text-anchor="middle">In Tech, AI &amp; Business</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Top-rated video lessons with real projects and certificates</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="52" rx="16" fill="#0a1832" stroke="#1b3660" stroke-width="1.5"/>
    <text x="20" y="32" font-size="16">🔍</text>
    <text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8">Search Python, Figma, AI, Finance...</text>
  </g>
  <g transform="translate(30, 305)">
    <rect x="0" y="0" width="55" height="34" rx="17" fill="#2563eb"/><text x="27" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">All</text>
    <rect x="65" y="0" width="85" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="107" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Coding</text>
    <rect x="160" y="0" width="85" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="202" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">AI &amp; ML</text>
    <rect x="255" y="0" width="75" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="292" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Design</text>
    <rect x="340" y="0" width="60" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="370" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Data</text>
  </g>
  <g transform="translate(30, 355)">
    <rect width="400" height="240" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <rect x="20" y="20" width="130" height="85" rx="12" fill="#060e1f"/>
    <circle cx="85" cy="62" r="18" fill="#2563eb"/>
    <polygon points="81,55 93,62 81,69" fill="#fff"/>
    <rect x="25" y="25" width="60" height="18" rx="9" fill="rgba(0,0,0,0.7)"/>
    <text x="55" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle">★ BESTSELLER</text>
    <text x="165" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">100 Days of Code: Python &amp;</text>
    <text x="165" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#60a5fa">Generative AI Masterclass</text>
    <text x="165" y="86" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Dr. Angela Yu · 62h HD Video</text>
    <text x="165" y="104" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fbbf24">4.9 ★★★★★ <tspan fill="#64748b">(68K reviews)</tspan></text>
    <rect x="20" y="125" width="360" height="8" rx="4" fill="#13233f"/>
    <rect x="20" y="125" width="260" height="8" rx="4" fill="url(#skp1)"/>
    <text x="20" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Progress: 72% Completed (44/62 hrs)</text>
    <text x="380" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="end">Resume Lesson ▶</text>
    <g transform="translate(20, 180)">
      <rect width="360" height="42" rx="21" fill="#2563eb"/>
      <text x="180" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">CONTINUE WATCHING: LESSON 34</text>
    </g>
  </g>
  <g transform="translate(30, 615)">
    <rect width="400" height="150" rx="20" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1"/>
    <rect x="20" y="20" width="110" height="75" rx="12" fill="#060e1f"/>
    <circle cx="75" cy="57" r="16" fill="#0284c7"/>
    <polygon points="72,50 82,57 72,64" fill="#fff"/>
    <text x="145" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">UI/UX Design Systems</text>
    <text x="145" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#38bdf8">Figma to Production Code</text>
    <text x="145" y="86" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Daniel Walter Scott · 24h Video</text>
    <g transform="translate(20, 110)">
      <text x="0" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="900" fill="#fff">$11.99</text>
      <text x="65" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#64748b" text-decoration="line-through">$74.99</text>
      <rect x="250" y="0" width="110" height="30" rx="15" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/>
      <text x="305" y="19" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#60a5fa" text-anchor="middle">Add to Cart</text>
    </g>
  </g>
  <g transform="translate(30, 785)">
    <rect width="400" height="90" rx="20" fill="#0c2044" stroke="#2563eb" stroke-width="1.5"/>
    <text x="45" y="55" font-size="34">🎯</text>
    <text x="90" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#dbeafe">30 MINS DAILY STUDY GOAL</text>
    <text x="90" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#93c5fd">24 consecutive days · Top 2% among tech learners</text>
  </g>
</svg>
`);

const SKILL_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">HD VIDEO CLASSROOM</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Stream in 1080p with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp2)" text-anchor="middle">2x Speed &amp; Transcripts</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Picture-in-picture, bookmarks, and background offline playback</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="235" rx="20" fill="#050e1c" stroke="#163259" stroke-width="2"/>
    <rect x="20" y="20" width="360" height="150" rx="12" fill="#0a172e"/>
    <text x="35" y="50" font-family="Courier,monospace" font-size="13" fill="#60a5fa">import <tspan fill="#38bdf8">torch.nn</tspan> as nn</text>
    <text x="35" y="75" font-family="Courier,monospace" font-size="13" fill="#94a3b8">class <tspan fill="#fbbf24">TransformerBlock</tspan>(nn.Module):</text>
    <text x="55" y="100" font-family="Courier,monospace" font-size="13" fill="#34d399">def __init__(self, d_model, heads):</text>
    <text x="75" y="125" font-family="Courier,monospace" font-size="13" fill="#e2e8f0">self.attention = MultiHead(d_model)</text>
    <circle cx="200" cy="95" r="28" fill="rgba(37,99,235,0.85)"/>
    <rect x="191" y="84" width="6" height="22" rx="2" fill="#fff"/>
    <rect x="203" y="84" width="6" height="22" rx="2" fill="#fff"/>
    <g transform="translate(20, 185)">
      <rect width="360" height="6" rx="3" fill="#132644"/>
      <rect width="210" height="6" rx="3" fill="url(#skp2)"/>
      <circle cx="210" cy="3" r="7" fill="#fff"/>
      <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">14:32 / 28:00</text>
      <rect x="250" y="12" width="45" height="20" rx="10" fill="#132644"/>
      <text x="272" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">1.5x</text>
      <rect x="305" y="12" width="55" height="20" rx="10" fill="#132644"/>
      <text x="332" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#60a5fa" text-anchor="middle">1080p</text>
    </g>
  </g>
  <g transform="translate(30, 495)">
    <rect width="400" height="360" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Section 4: Attention Mechanisms</text>
    <text x="375" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="end">3/8 Completed</text>
    <g transform="translate(20, 60)">
      <rect width="360" height="58" rx="14" fill="#0e2246"/>
      <circle cx="30" cy="29" r="14" fill="#065f46"/>
      <text x="30" y="34" font-size="12" fill="#34d399" text-anchor="middle">✓</text>
      <text x="56" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#e2e8f0">1. Intuition Behind Self-Attention</text>
      <text x="56" y="46" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">08:14 mins · Lecture video</text>
    </g>
    <g transform="translate(20, 130)">
      <rect width="360" height="66" rx="14" fill="#10254c" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="30" cy="33" r="14" fill="#2563eb"/>
      <polygon points="26,26 36,33 26,40" fill="#fff"/>
      <text x="56" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">2. PyTorch Matrix Dot-Product Attention</text>
      <text x="56" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#93c5fd">▶ Currently Playing · 14:32 / 28:00</text>
    </g>
    <g transform="translate(20, 208)">
      <rect width="360" height="58" rx="14" fill="#0e2246"/>
      <circle cx="30" cy="29" r="14" fill="#173362"/>
      <text x="30" y="34" font-size="12" fill="#94a3b8" text-anchor="middle">3</text>
      <text x="56" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">3. Multi-Head Scaled Projection</text>
      <text x="56" y="46" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">21:40 mins · Video &amp; Code Lab</text>
    </g>
    <g transform="translate(20, 285)">
      <rect width="360" height="50" rx="16" fill="#09203a" stroke="#38bdf8" stroke-width="1"/>
      <text x="25" y="31" font-size="18">💾</text>
      <text x="55" y="31" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8">Downloaded for Offline Watching · 1.4 GB</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">HANDS-ON PRACTICE</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Interactive Code Labs &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp3)" text-anchor="middle">Direct Mentor Q&amp;A</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Test your code in real-time and get fast answers from expert instructors</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="340" rx="22" fill="#071326" stroke="#193660" stroke-width="1.5"/>
    <rect x="25" y="20" width="115" height="26" rx="13" fill="rgba(56,189,248,0.18)"/>
    <text x="82" y="37" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle">CODING LAB #14</text>
    <text x="25" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Calculate Scaled Attention Scores</text>
    <rect x="20" y="90" width="360" height="150" rx="14" fill="#050e1c" stroke="#162e52" stroke-width="1"/>
    <text x="35" y="120" font-family="Courier,monospace" font-size="12" fill="#60a5fa">def <tspan fill="#38bdf8">scaled_dot_product</tspan>(q, k, v):</text>
    <text x="50" y="145" font-family="Courier,monospace" font-size="12" fill="#94a3b8">d_k = q.size(-1)</text>
    <text x="50" y="170" font-family="Courier,monospace" font-size="12" fill="#cbd5e1">scores = torch.matmul(q, k.T) / math.sqrt(d_k)</text>
    <text x="50" y="195" font-family="Courier,monospace" font-size="12" fill="#34d399">return torch.softmax(scores, dim=-1) @ v</text>
    <g transform="translate(20, 260)">
      <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="1.5"/>
      <text x="90" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#34d399" text-anchor="middle">✓ 8/8 Tests Passed</text>
      <rect x="200" y="0" width="160" height="46" rx="23" fill="url(#skp3)"/>
      <text x="280" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">SUBMIT LAB ▶</text>
    </g>
  </g>
  <g transform="translate(30, 595)">
    <rect width="400" height="260" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">Course Q&amp;A Community (4,210 Discussions)</text>
    <g transform="translate(20, 55)">
      <circle cx="20" cy="20" r="16" fill="#163259"/>
      <text x="20" y="25" font-size="12" fill="#fff" text-anchor="middle">👨‍💻</text>
      <text x="45" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">Student Alex · 2 hours ago</text>
      <text x="45" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#cbd5e1">&quot;Why do we divide by sqrt(d_k) before softmax?&quot;</text>
    </g>
    <g transform="translate(20, 125)">
      <rect width="360" height="110" rx="16" fill="#0d2248" stroke="#2563eb" stroke-width="1"/>
      <circle cx="25" cy="28" r="16" fill="#2563eb"/>
      <text x="25" y="33" font-size="12" fill="#fff" text-anchor="middle">🎓</text>
      <text x="50" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#60a5fa">INSTRUCTOR DR. ANGELA · VERIFIED ANSWER</text>
      <text x="50" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#34d399">✓ Top Instructor Response</text>
      <text x="20" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#e2e8f0">&quot;For large d_k, dot products grow large, pushing softmax into regions with tiny gradients. Scaling prevents this!&quot;</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp4" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">VERIFIED CERTIFICATES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Earn Credentials &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp4)" text-anchor="middle">Accelerate Your Career</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Shareable LinkedIn credentials backed by hands-on projects</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="260" rx="22" fill="#091b38" stroke="#1d4ed8" stroke-width="2"/>
    <circle cx="350" cy="50" r="26" fill="#fbbf24"/>
    <text x="350" y="58" font-size="24" text-anchor="middle">🏅</text>
    <rect x="30" y="25" width="130" height="24" rx="12" fill="rgba(37,99,235,0.2)"/>
    <text x="95" y="41" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="800" fill="#60a5fa" text-anchor="middle">OFFICIAL CERTIFICATE</text>
    <text x="30" y="82" font-family="-apple-system,system-ui,sans-serif" font-size="19" font-weight="900" fill="#fff">Certificate of Completion</text>
    <text x="30" y="105" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">This certifies that</text>
    <text x="30" y="132" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="900" fill="#38bdf8">Alex Morgan</text>
    <text x="30" y="156" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#cbd5e1">has successfully mastered all requirements for:</text>
    <text x="30" y="180" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fbbf24">Full-Stack Web &amp; AI Engineering (48 Hours)</text>
    <text x="30" y="215" font-family="Courier,monospace" font-size="11" fill="#64748b">ID: SKILL-2026-X94B · Issued Oct 2026</text>
    <text x="370" y="215" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="end">✓ VERIFIED</text>
    <line x1="30" y1="230" x2="370" y2="230" stroke="#163259" stroke-width="1"/>
    <text x="200" y="248" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Accredited by SkillSphere Industry Partner Network</text>
  </g>
  <g transform="translate(30, 515)">
    <rect width="400" height="54" rx="27" fill="#0077b5"/>
    <text x="200" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">in  ADD CERTIFICATE TO LINKEDIN</text>
  </g>
  <g transform="translate(30, 580)">
    <rect width="400" height="50" rx="25" fill="#0b1d3d" stroke="#1d4275" stroke-width="1.5"/>
    <text x="200" y="31" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#cbd5e1" text-anchor="middle">📄 Download High-Res PDF &amp; Badge</text>
  </g>
  <g transform="translate(30, 650)">
    <rect width="400" height="210" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">Mastered Technical Competencies</text>
    <g transform="translate(25, 60)">
      <rect x="0" y="0" width="105" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="52" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">Python 3.12</text>
      <rect x="115" y="0" width="115" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="172" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">PyTorch AI</text>
      <rect x="240" y="0" width="105" height="32" rx="16" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" stroke-width="1"/><text x="292" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fbbf24" text-anchor="middle">React 19</text>
    </g>
    <g transform="translate(25, 105)">
      <rect x="0" y="0" width="115" height="32" rx="16" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1"/><text x="57" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="middle">REST APIs</text>
      <rect x="125" y="0" width="115" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="182" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">UI/UX Figma</text>
      <rect x="250" y="0" width="95" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="297" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">AWS Cloud</text>
    </g>
    <text x="25" y="175" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">3 Capstone Projects verified by senior engineering mentors</text>
  </g>
</svg>
`);

// Backwards compatibility aliases

// Store Preview Studio Preset Assets
const STUDIO_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="sfeat-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0D1322"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="sfeat-kicker" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#00D085"/>
      <stop offset="100%" stop-color="#34D399"/>
    </linearGradient>
    <linearGradient id="sfeat-btn" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#00D085"/>
    </linearGradient>
    <linearGradient id="sfeat-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="sfeat-border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#00D085" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#818CF8" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="sfeat-k-sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-1.5" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <pattern id="sfeat-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1024" height="500" fill="url(#sfeat-bg)"/>
  <rect width="1024" height="500" fill="url(#sfeat-grid)"/>

  <!-- Ambient Multi-Color Lights -->
  <circle cx="860" cy="140" r="280" fill="#38BDF8" opacity="0.12"/>
  <circle cx="160" cy="420" r="240" fill="#818CF8" opacity="0.10"/>
  <circle cx="560" cy="480" r="220" fill="#00D085" opacity="0.08"/>

  <!-- Left Header with App Icon -->
  <g transform="translate(72, 65)">
    <rect width="76" height="76" rx="20" fill="url(#sfeat-sq-bg)" stroke="url(#sfeat-border)" stroke-width="1.5"/>
    <g transform="scale(0.55) translate(20, 20)">
      <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
      <g filter="url(#sfeat-k-sh)">
        <path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/>
      </g>
    </g>
  </g>

  <text x="172" y="105" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Store Preview Studio</text>
  <text x="172" y="132" font-family="-apple-system,system-ui,sans-serif" font-size="12.5" font-weight="700" fill="url(#sfeat-kicker)" letter-spacing="1.5">DUAL-STORE PREVIEW &amp; METADATA STUDIO</text>

  <text x="72" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="27" font-weight="700" fill="#ffffff">Design &amp; Validate Realistic Store Mockups</text>
  <text x="72" y="235" font-family="-apple-system,system-ui,sans-serif" font-size="15" fill="#94A3B8">App Store &amp; Google Play live viewports, pre-flight audits, 100% offline in your browser.</text>

  <!-- 3 Colorful Feature Badges (Zero Emoji, Clean Vector Icons) -->
  <!-- Badge 1: Cyan (Viewports) -->
  <g transform="translate(72, 275)">
    <rect width="190" height="42" rx="21" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.35)" stroke-width="1.2"/>
    <rect x="20" y="12" width="10" height="18" rx="2" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
    <rect x="25" y="15" width="10" height="18" rx="2" fill="#0D1322" stroke="#38BDF8" stroke-width="1.8"/>
    <text x="44" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#38BDF8">Dual Live Viewports</text>
  </g>

  <!-- Badge 2: Violet (Pre-Flight Audit) -->
  <g transform="translate(276, 275)">
    <rect width="180" height="42" rx="21" fill="rgba(192,132,252,0.12)" stroke="rgba(192,132,252,0.35)" stroke-width="1.2"/>
    <path d="M 24 13 L 30 16 L 30 23 C 30 27 24 30 24 30 C 24 30 18 27 18 23 L 18 16 Z" fill="none" stroke="#C084FC" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 21 21 L 23 23 L 27 19" fill="none" stroke="#C084FC" stroke-width="1.8" stroke-linecap="round"/>
    <text x="39" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#C084FC">Pre-Flight Audit</text>
  </g>

  <!-- Badge 3: Emerald (Client-Side) -->
  <g transform="translate(470, 275)">
    <rect width="180" height="42" rx="21" fill="rgba(0,208,133,0.12)" stroke="rgba(0,208,133,0.35)" stroke-width="1.2"/>
    <rect x="18" y="18" width="14" height="11" rx="2" fill="none" stroke="#34D399" stroke-width="1.8"/>
    <path d="M 21 18 L 21 15 C 21 12.8 29 12.8 29 15 L 29 18" fill="none" stroke="#34D399" stroke-width="1.8"/>
    <text x="40" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34D399">100% Client-Side</text>
  </g>

  <!-- Spec Highlights Pill Row -->
  <g transform="translate(72, 345)">
    <rect width="578" height="85" rx="16" fill="#0F172A" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="24" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94A3B8">STANDALONE POWER</text>
    <text x="24" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">Zero Subscriptions · Zero Telemetry · Offline Ready</text>
    <rect x="440" y="24" width="115" height="36" rx="10" fill="rgba(56,189,248,0.15)"/>
    <text x="497" y="47" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#38BDF8" text-anchor="middle">v2.1 PRO</text>
  </g>

  <!-- Right Hero Card (Mockup Pro Window) -->
  <g transform="translate(720, 50)">
    <rect width="245" height="395" rx="26" fill="#0D1322" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.6))"/>
    
    <!-- Window Bar -->
    <circle cx="28" cy="24" r="5" fill="#EF4444"/>
    <circle cx="44" cy="24" r="5" fill="#F59E0B"/>
    <circle cx="60" cy="24" r="5" fill="#10B981"/>
    <text x="140" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">previewstudio.app</text>

    <!-- Mini App Header inside window -->
    <rect x="18" y="44" width="209" height="52" rx="14" fill="#161F33" stroke="rgba(255,255,255,0.06)"/>
    <rect x="28" y="54" width="32" height="32" rx="8" fill="url(#sfeat-sq-bg)" stroke="rgba(0,208,133,0.3)"/>
    <g transform="scale(0.23) translate(128, 240)">
      <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
      <path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/>
    </g>
    <text x="68" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff">Preview Studio</text>
    <text x="68" y="81" font-family="-apple-system,system-ui,sans-serif" font-size="9.5" fill="#94A3B8">Store Mockup Pro</text>

    <!-- Rating Banner (Amber) -->
    <rect x="18" y="106" width="209" height="70" rx="14" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)" stroke-width="1"/>
    <text x="122" y="138" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="800" fill="#FBBF24" text-anchor="middle">4.9 ★</text>
    <text x="122" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle">#1 Developer Tools</text>

    <!-- Checklist Widget (Cyan & Emerald) -->
    <rect x="18" y="186" width="209" height="120" rx="14" fill="#141B2D" stroke="rgba(255,255,255,0.06)"/>
    <text x="32" y="214" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#38BDF8">✓ Opaque Icon (No Alpha)</text>
    <text x="32" y="244" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#34D399">✓ Dual-Store Live Sync</text>
    <text x="32" y="274" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#C084FC">✓ 3x Retina PNG Mockup</text>

    <!-- Action Button -->
    <rect x="24" y="322" width="197" height="44" rx="22" fill="url(#sfeat-btn)"/>
    <text x="122" y="349" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#080C14" text-anchor="middle" letter-spacing="0.5">EXPORT MOCKUP</text>
  </g>
</svg>
`);

// Store Preview Studio :: default preset screenshots (redesigned)
// 4 inline SVGs, viewBox 0 0 460 996, rendered at 1290 x 2796. Self-contained, no external assets.

const STUDIO_SHOT_1 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s1bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s1gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s1gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s1ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s1ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s1tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s1sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s1scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s1okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s1btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s1t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s1t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s1t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s1ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s1dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s1ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s1ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s1K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s1ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s1bg)"/><circle cx="60" cy="120" r="270" fill="url(#s1gc)"/><circle cx="440" cy="330" r="250" fill="url(#s1gi)"/><circle cx="90" cy="930" r="300" fill="url(#s1ge)"/><circle cx="450" cy="880" r="190" fill="url(#s1ga)"/><rect width="460" height="996" fill="url(#s1dots)"/><rect x="124" y="50" width="211" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="140" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">DUAL-STORE VIEWPORT</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">Live Side-by-Side</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s1tg)" text-anchor="middle">App Store &amp; Google Play</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Preview both store listings in real time</text><clipPath id="s1ci"><rect x="41" y="237" width="174" height="460" rx="29"/></clipPath><clipPath id="s1ca"><rect x="245" y="267" width="174" height="460" rx="24"/></clipPath><rect x="36" y="232" width="184" height="470" rx="34" fill="#0B1220" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><rect x="39" y="235" width="178" height="464" rx="31" fill="none" stroke="rgba(255,255,255,0.06)"/><rect x="41" y="237" width="174" height="460" rx="29" fill="url(#s1scr)"/><g clip-path="url(#s1ci)"><text x="60" y="258" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">9:41</text><rect x="98" y="245" width="60" height="17" rx="8.5" fill="#000"/><rect x="164" y="255" width="2.5" height="3" rx="1" fill="#fff"/><rect x="168" y="253" width="2.5" height="5" rx="1" fill="#fff"/><rect x="172" y="251" width="2.5" height="7" rx="1" fill="#fff"/><rect x="176" y="249" width="2.5" height="9" rx="1" fill="#fff"/><rect x="187" y="250" width="17" height="8" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.6"/><rect x="188.7" y="251.7" width="12" height="4.6" rx="1.2" fill="#fff"/><path d="M57 297 l-4 4 l4 4" fill="none" stroke="#0A84FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><text x="62" y="304" font-size="9.5" font-weight="500" fill="#0A84FF" text-anchor="start">Search</text><rect x="55" y="316" width="50" height="50" rx="12.5" fill="url(#s1ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s1K" transform="translate(80.0 341.0) scale(0.500)"/><text x="113" y="332" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">Store Preview Studio</text><text x="113" y="344" font-size="8" font-weight="400" fill="#94A3B8" text-anchor="start">Listing designer</text><rect x="113" y="351" width="46" height="19" rx="9.5" fill="#0A84FF"/><text x="136" y="364" font-size="9.5" font-weight="800" fill="#fff" text-anchor="middle">GET</text><text x="79.3" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4.9</text><text x="79.3" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">2.1K RATINGS</text><text x="128.0" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4+</text><text x="128.0" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">AGE</text><text x="176.7" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">#1</text><text x="176.7" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">IN TOOLS</text><line x1="103.7" y1="387" x2="103.7" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="152.3" y1="387" x2="152.3" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="55" y1="426" x2="201" y2="426" stroke="rgba(255,255,255,0.08)"/><text x="55" y="446" font-size="11" font-weight="700" fill="#fff" text-anchor="start">Preview</text><rect x="55" y="456" width="56" height="112" rx="9" fill="url(#s1t1)" stroke="rgba(255,255,255,0.12)"/><rect x="63" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="63" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="63" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="117" y="456" width="56" height="112" rx="9" fill="url(#s1t2)" stroke="rgba(255,255,255,0.12)"/><rect x="125" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="125" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="125" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="179" y="456" width="56" height="112" rx="9" fill="url(#s1t3)" stroke="rgba(255,255,255,0.12)"/><rect x="187" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="187" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="187" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="55" y="588" width="146" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="598" width="120" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="608" width="134" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="618" width="90" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="41" y="646" width="174" height="51" fill="#0B1220"/><line x1="41" y1="646" x2="215" y2="646" stroke="rgba(255,255,255,0.08)"/><rect x="52.4" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="58.4" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Today</text><rect x="87.2" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="93.2" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Games</text><rect x="122.0" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="128.0" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Apps</text><rect x="156.8" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="162.8" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Arcade</text><rect x="191.6" y="655" width="12" height="12" rx="3.5" fill="#0A84FF" fill-opacity="1"/><text x="197.6" y="679" font-size="5.8" font-weight="600" fill="#0A84FF" text-anchor="middle">Search</text><rect x="94" y="689" width="68" height="4" rx="2" fill="#fff" fill-opacity="0.5"/></g><rect x="240" y="262" width="184" height="470" rx="28" fill="#0B1220" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><rect x="243" y="265" width="178" height="464" rx="25" fill="none" stroke="rgba(255,255,255,0.06)"/><rect x="245" y="267" width="174" height="460" rx="24" fill="url(#s1scr)"/><g clip-path="url(#s1ca)"><text x="260" y="285" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">9:41</text><circle cx="332" cy="281" r="5.5" fill="#000" stroke="#1E293B"/><rect x="366" y="283" width="2.5" height="3" rx="1" fill="#fff"/><rect x="370" y="281" width="2.5" height="5" rx="1" fill="#fff"/><rect x="374" y="279" width="2.5" height="7" rx="1" fill="#fff"/><rect x="378" y="277" width="2.5" height="9" rx="1" fill="#fff"/><rect x="390" y="278" width="17" height="8" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.6"/><rect x="391.7" y="279.7" width="12" height="4.6" rx="1.2" fill="#fff"/><path d="M270 308 h-11 m4.5 -4.5 l-4.5 4.5 l4.5 4.5" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="392" cy="307" r="4.2" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M395 310 l3.5 3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="408" cy="308" r="1.1" fill="#fff"/><circle cx="408" cy="304" r="1.1" fill="#fff"/><circle cx="408" cy="312" r="1.1" fill="#fff"/><rect x="259" y="328" width="52" height="52" rx="14" fill="url(#s1ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s1K" transform="translate(285.0 354.0) scale(0.520)"/><text x="319" y="345" font-size="9" font-weight="700" fill="#fff" text-anchor="start">Store Preview Studio</text><text x="319" y="358" font-size="8" font-weight="600" fill="#34D399" text-anchor="start">Listing designer</text><text x="283.3" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4.9</text><text x="283.3" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">2.1K reviews</text><text x="332.0" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">10K+</text><text x="332.0" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Downloads</text><text x="380.7" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3+</text><text x="380.7" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Everyone</text><line x1="307.7" y1="387" x2="307.7" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="356.3" y1="387" x2="356.3" y2="413" stroke="rgba(255,255,255,0.1)"/><rect x="259" y="424" width="146" height="28" rx="14" fill="#01875F"/><text x="332" y="442" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Install</text><text x="332" y="468" font-size="8" font-weight="600" fill="#34D399" text-anchor="middle">Add to wishlist</text><text x="259" y="492" font-size="10.5" font-weight="700" fill="#fff" text-anchor="start">About this app</text><path d="M397 486 l5 5 l-5 5" fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="259" y="502" width="146" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="512" width="122" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="522" width="136" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="540" width="56" height="104" rx="8" fill="url(#s1t2)" stroke="rgba(255,255,255,0.12)"/><rect x="267" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="267" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="267" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="321" y="540" width="56" height="104" rx="8" fill="url(#s1t1)" stroke="rgba(255,255,255,0.12)"/><rect x="329" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="329" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="329" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="383" y="540" width="56" height="104" rx="8" fill="url(#s1t3)" stroke="rgba(255,255,255,0.12)"/><rect x="391" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="391" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="391" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="245" y="668" width="174" height="59" fill="#0B1220"/><circle cx="266.8" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="266.8" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Games</text><circle cx="310.2" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="310.2" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Apps</text><rect x="335.8" y="674" width="36" height="20" rx="10" fill="#01875F" fill-opacity="0.4"/><circle cx="353.8" cy="684" r="5.5" fill="#34D399" fill-opacity="1"/><text x="353.8" y="705" font-size="6.2" font-weight="600" fill="#E2E8F0" text-anchor="middle">Search</text><circle cx="397.2" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="397.2" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Books</text><rect x="302" y="716" width="60" height="4" rx="2" fill="#fff" fill-opacity="0.5"/></g><rect x="70" y="752" width="116" height="26" rx="13.0" fill="#0A84FF" fill-opacity="0.14" stroke="#0A84FF" stroke-opacity="0.38"/><text x="128.0" y="768.42" font-size="9.5" font-weight="700" fill="#7DB8FF" text-anchor="middle" letter-spacing="1.2">APP STORE</text><rect x="266" y="752" width="132" height="26" rx="13.0" fill="#34D399" fill-opacity="0.14" stroke="#34D399" stroke-opacity="0.38"/><text x="332.0" y="768.42" font-size="9.5" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="1.2">GOOGLE PLAY</text><line x1="192" y1="765" x2="260" y2="765" stroke="#38BDF8" stroke-opacity="0.5" stroke-dasharray="3 4"/><circle cx="226" cy="765" r="11" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><g transform="translate(226 765) scale(0.58)" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M-9 -3 a9 9 0 0 1 15 -5"/><path d="M6 -13 v5 h-5"/><path d="M9 3 a9 9 0 0 1 -15 5"/><path d="M-6 13 v-5 h5"/></g><rect x="30" y="806" width="400" height="92" rx="22" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="806" width="400" height="92" rx="22" fill="url(#s1sh)"/><rect x="48" y="824" width="56" height="56" rx="16" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.4)"/><g transform="translate(76 852) scale(1.25)" fill="none" stroke="#38BDF8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-9 -3 a9 9 0 0 1 15 -5"/><path d="M6 -13 v5 h-5"/><path d="M9 3 a9 9 0 0 1 -15 5"/><path d="M-6 13 v-5 h5"/></g><text x="122" y="846" font-size="15" font-weight="700" fill="#fff" text-anchor="start">1-Click Simultaneous Sync</text><text x="122" y="868" font-size="12" font-weight="400" fill="#94A3B8" text-anchor="start">Edit once, audits both stores</text><rect x="372" y="840" width="40" height="22" rx="11" fill="#10B981"/><circle cx="401" cy="851" r="8" fill="#fff"/><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_2 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s2bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s2gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s2gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s2ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s2ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s2tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s2sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s2scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s2okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s2btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s2t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s2t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s2t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s2ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s2dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s2ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s2ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s2K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s2ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s2bg)"/><circle cx="380" cy="110" r="260" fill="url(#s2gc)"/><circle cx="40" cy="420" r="250" fill="url(#s2gi)"/><circle cx="400" cy="800" r="280" fill="url(#s2ge)"/><circle cx="40" cy="960" r="200" fill="url(#s2ga)"/><rect width="460" height="996" fill="url(#s2dots)"/><rect x="134" y="50" width="193" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="150" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">COMPLIANCE ENGINE</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">Pre-Flight ASO Audit</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s2tg)" text-anchor="middle">Pre-Flight Store Review</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Catch common listing issues before submission</text><rect x="30" y="232" width="400" height="446" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="232" width="400" height="446" rx="24" fill="url(#s2sh)"/><text x="50" y="264" font-size="10" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="2">LISTING AUDIT</text><circle cx="378" cy="260.5" r="3" fill="#10B981"/><text x="412" y="264" font-size="9" font-weight="700" fill="#34D399" text-anchor="end" letter-spacing="1.5">LIVE</text><line x1="46" y1="282" x2="414" y2="282" stroke="rgba(255,255,255,0.07)"/><rect x="46" y="296" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="310" width="36" height="36" rx="10" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.4"/><g fill="none" stroke="#7DD3FC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M72 323 h12 M78 323 v11"/></g><text x="108" y="325" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Title Length</text><text x="108" y="343" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">20 / 30 characters</text><rect x="334" y="310" width="66" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="367.0" y="324.42" font-size="9.5" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="356" width="292" height="6" rx="3" fill="#fff" fill-opacity="0.08"/><rect x="108" y="356" width="195" height="6" rx="3" fill="#38BDF8"/><rect x="46" y="390" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="404" width="36" height="36" rx="10" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.4"/><g fill="none" stroke="#C4B5FD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M72 417 h12 M72 422 h12 M72 427 h7"/></g><text x="108" y="419" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Subtitle &amp; Short Description</text><text x="108" y="437" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">16 / 30 characters</text><rect x="334" y="404" width="66" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="367.0" y="418.42" font-size="9.5" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="450" width="292" height="6" rx="3" fill="#fff" fill-opacity="0.08"/><rect x="108" y="450" width="156" height="6" rx="3" fill="#A78BFA"/><rect x="46" y="484" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="498" width="36" height="36" rx="10" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.4"/><g fill="none" stroke="#6EE7B7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="72" y="510" width="12" height="12" rx="2.5"/><path d="M72 516 h12 M78 510 v12" stroke-opacity="0.5"/></g><text x="108" y="513" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">App Icon Transparency</text><text x="108" y="531" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Opaque master icon verified</text><rect x="334" y="498" width="66" height="22" rx="11.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="367.0" y="512.42" font-size="9.5" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="540" width="71" height="20" rx="10.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="143.5" y="553.24" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="0.8">0% ALPHA</text><rect x="187" y="540" width="84" height="20" rx="10.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="229.0" y="553.24" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="0.8">NO ALPHA</text><rect x="46" y="578" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="592" width="36" height="36" rx="10" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.4"/><g fill="none" stroke="#FCD34D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M78 603 l6 2 v5 c0 4 -3 6 -6 7 c-3 -1 -6 -3 -6 -7 v-5 z"/><path d="M75.4 610.5 l2 2 l3.4 -4"/></g><text x="108" y="607" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Age Rating Matrix</text><text x="108" y="625" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Content rating verified</text><rect x="334" y="592" width="66" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="367.0" y="606.42" font-size="9.5" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="634" width="97" height="20" rx="10.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="156.5" y="647.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">4+ APP STORE</text><rect x="213" y="634" width="104" height="20" rx="10.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="265.0" y="647.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">EVERYONE PLAY</text><rect x="30" y="704" width="400" height="60" rx="30" fill="url(#s2okg)" stroke="rgba(16,185,129,0.45)"/><circle cx="64" cy="734" r="18" fill="#10B981"/><path d="M58.0 734.3 L62.5 739.1 L70.9 728.9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="94" y="739" font-size="14" font-weight="700" fill="#fff" text-anchor="start">All 12 Automated Store Checks Passed</text><rect x="30" y="788" width="400" height="110" rx="22" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="788" width="400" height="110" rx="22" fill="url(#s2sh)"/><text x="97" y="837" font-size="28" font-weight="800" fill="#34D399" text-anchor="middle">12/12</text><text x="97" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">CHECKS PASSED</text><text x="230" y="837" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">0</text><text x="230" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">ERRORS</text><text x="363" y="837" font-size="28" font-weight="800" fill="#FBBF24" text-anchor="middle">0</text><text x="363" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">WARNINGS</text><line x1="163" y1="812" x2="163" y2="866" stroke="rgba(255,255,255,0.08)"/><line x1="297" y1="812" x2="297" y2="866" stroke="rgba(255,255,255,0.08)"/><rect x="50" y="878" width="360" height="5" rx="2.5" fill="#fff" fill-opacity="0.08"/><rect x="50" y="878" width="360" height="5" rx="2.5" fill="url(#s2btn)"/><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_3 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s3gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s3gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s3ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s3ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s3tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s3sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s3scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s3okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s3btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s3t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s3t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s3t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s3ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s3dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s3ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s3ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s3K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s3ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s3bg)"/><circle cx="230" cy="430" r="300" fill="url(#s3ge)"/><circle cx="60" cy="110" r="250" fill="url(#s3gc)"/><circle cx="440" cy="700" r="260" fill="url(#s3gi)"/><circle cx="60" cy="920" r="190" fill="url(#s3ga)"/><rect width="460" height="996" fill="url(#s3dots)"/><rect x="138" y="50" width="184" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="154" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">ASSET COMPLIANCE</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">App Icon Inspector</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s3tg)" text-anchor="middle">Icon Transparency Audit</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Inspect the master icon before Apple does</text><clipPath id="s3cc"><rect x="30" y="232" width="400" height="410" rx="24"/></clipPath><rect x="30" y="232" width="400" height="410" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="232" width="400" height="410" rx="24" fill="url(#s3sh)"/><g clip-path="url(#s3cc)"><circle cx="230" cy="437" r="190" fill="url(#s3ig)"/><line x1="30" y1="232" x2="30" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="50" y1="232" x2="50" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="70" y1="232" x2="70" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="90" y1="232" x2="90" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="110" y1="232" x2="110" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="130" y1="232" x2="130" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="150" y1="232" x2="150" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="170" y1="232" x2="170" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="190" y1="232" x2="190" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="210" y1="232" x2="210" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="230" y1="232" x2="230" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="250" y1="232" x2="250" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="270" y1="232" x2="270" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="290" y1="232" x2="290" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="310" y1="232" x2="310" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="330" y1="232" x2="330" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="350" y1="232" x2="350" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="370" y1="232" x2="370" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="390" y1="232" x2="390" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="410" y1="232" x2="410" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="430" y1="232" x2="430" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="232" x2="430" y2="232" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="252" x2="430" y2="252" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="272" x2="430" y2="272" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="292" x2="430" y2="292" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="312" x2="430" y2="312" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="332" x2="430" y2="332" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="352" x2="430" y2="352" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="372" x2="430" y2="372" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="392" x2="430" y2="392" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="412" x2="430" y2="412" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="432" x2="430" y2="432" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="452" x2="430" y2="452" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="472" x2="430" y2="472" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="492" x2="430" y2="492" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="512" x2="430" y2="512" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="532" x2="430" y2="532" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="552" x2="430" y2="552" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="572" x2="430" y2="572" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="592" x2="430" y2="592" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="612" x2="430" y2="612" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="632" x2="430" y2="632" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="20" y1="227" x2="440" y2="647" stroke="#A78BFA" stroke-opacity="0.35" stroke-dasharray="5 5"/><line x1="440" y1="227" x2="20" y2="647" stroke="#A78BFA" stroke-opacity="0.35" stroke-dasharray="5 5"/><line x1="230" y1="232" x2="230" y2="642" stroke="#38BDF8" stroke-opacity="0.35" stroke-dasharray="2 4"/><line x1="30" y1="437" x2="430" y2="437" stroke="#38BDF8" stroke-opacity="0.35" stroke-dasharray="2 4"/><circle cx="230" cy="437" r="150" fill="none" stroke="#38BDF8" stroke-opacity="0.18" stroke-dasharray="1 0"/><circle cx="230" cy="437" r="128" fill="none" stroke="#38BDF8" stroke-opacity="0.28" stroke-dasharray="6 6"/><circle cx="230" cy="437" r="100" fill="none" stroke="#10B981" stroke-opacity="0.55" stroke-dasharray="4 4"/></g><rect x="130" y="337" width="200" height="200" rx="48" fill="url(#s3ib)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/><rect x="130" y="337" width="200" height="200" rx="48" fill="url(#s3ig)"/><use xlink:href="#s3K" transform="translate(230 437) scale(2)"/><path d="M130 351 V337 H144" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(-6 -6)"/><path d="M330 351 V337 H316" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(6 -6)"/><path d="M130 523 V537 H144" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(-6 6)"/><path d="M330 523 V537 H316" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(6 6)"/><line x1="130" y1="306" x2="330" y2="306" stroke="#38BDF8" stroke-opacity="0.8"/><line x1="130" y1="301" x2="130" y2="311" stroke="#38BDF8"/><line x1="330" y1="301" x2="330" y2="311" stroke="#38BDF8"/><rect x="203" y="298" width="54" height="16" rx="8" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><text x="230" y="309.5" font-size="9.5" font-weight="700" fill="#7DD3FC" text-anchor="middle">1024 px</text><text x="50" y="258" font-size="9" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="1.5">BLUEPRINT &#183; 1024 &#215; 1024</text><text x="410" y="258" font-size="9" font-weight="600" fill="#64748B" text-anchor="end" letter-spacing="1.5">RGB &#183; 8-BIT</text><text x="50" y="626" font-size="9" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="1.5">SQUIRCLE CLIP &#183; r = 24%</text><text x="410" y="626" font-size="9" font-weight="700" fill="#34D399" text-anchor="end" letter-spacing="1.5">ALPHA: 0</text><text x="348" y="307" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="start">45&#176;</text><rect x="30" y="660" width="122" height="34" rx="17" fill="#38BDF8" fill-opacity="0.15" stroke="#38BDF8" stroke-opacity="0.55"/><rect x="44" y="671" width="12" height="12" rx="4" fill="none" stroke="#7DD3FC" stroke-width="1.5"/><text x="64" y="681" font-size="11.5" font-weight="600" fill="#7DD3FC" text-anchor="start">Apple Squircle</text><rect x="160" y="660" width="130" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.1"/><circle cx="180" cy="677" r="6" fill="none" stroke="#94A3B8" stroke-width="1.5"/><text x="194" y="681" font-size="11.5" font-weight="600" fill="#94A3B8" text-anchor="start">Android Circle</text><rect x="298" y="660" width="132" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.1"/><rect x="312" y="671" width="12" height="12" rx="0.5" fill="none" stroke="#94A3B8" stroke-width="1.5"/><text x="332" y="681" font-size="11.5" font-weight="600" fill="#94A3B8" text-anchor="start">Square 1024</text><rect x="30" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><rect x="30" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><rect x="62" y="726" width="60" height="60" rx="14" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(92.0 756.0) scale(0.600)"/><circle cx="138" cy="726" r="7" fill="#10B981"/><path d="M135.0 726.15 L137.25 728.55 L141.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="92" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">iOS &#183; App Store</text><rect x="168" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="168" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><circle cx="230.0" cy="756.0" r="30.0" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(230.0 756.0) scale(0.600)"/><circle cx="276" cy="726" r="7" fill="#10B981"/><path d="M273.0 726.15 L275.25 728.55 L279.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="230" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">Android &#183; Adaptive</text><rect x="306" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="306" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><rect x="338" y="726" width="60" height="60" rx="0" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(368.0 756.0) scale(0.600)"/><circle cx="414" cy="726" r="7" fill="#10B981"/><path d="M411.0 726.15 L413.25 728.55 L417.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="368" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">Master &#183; 1024 px</text><rect x="30" y="844" width="400" height="84" rx="22" fill="url(#s3okg)" stroke="rgba(16,185,129,0.45)"/><rect x="48" y="860" width="52" height="52" rx="15" fill="#10B981" fill-opacity="0.18" stroke="#10B981" stroke-opacity="0.5"/><g fill="none" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M74 872 l12 4 v9 c0 7 -5 11 -12 13 c-7 -2 -12 -6 -12 -13 v-9 z"/><path d="M68.5 886 l4 4 l7 -8"/></g><text x="116" y="883" font-size="14" font-weight="700" fill="#fff" text-anchor="start">Opaque Icon &#183; Zero Alpha Pixels</text><text x="116" y="903" font-size="12" font-weight="400" fill="#94A3B8" text-anchor="start">Guards against Apple upload rejection</text><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_4 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s4bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s4gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s4gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s4ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s4ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s4tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s4sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s4scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s4okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s4btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s4t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s4t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s4t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s4ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s4dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s4ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s4ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s4K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s4ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s4bg)"/><circle cx="60" cy="260" r="250" fill="url(#s4gc)"/><circle cx="440" cy="460" r="240" fill="url(#s4ga)"/><circle cx="60" cy="700" r="240" fill="url(#s4gi)"/><circle cx="340" cy="900" r="300" fill="url(#s4ge)"/><rect width="460" height="996" fill="url(#s4dots)"/><rect x="138" y="50" width="184" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="154" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">EXPORT ASSETS</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">1-Click Ultra HD</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s4tg)" text-anchor="middle">Multi-Format Export</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Every release asset, one click away</text><rect x="30" y="236" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="236" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="236" width="4" height="156" rx="2" fill="#38BDF8" fill-opacity="0.0"/><rect x="50" y="262" width="72" height="72" rx="20" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.45"/><g fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="74" y="278" width="24" height="40" rx="5"/><path d="M82 283 h8"/><path d="M74 306 l7 -7 l5 5 l4 -4 l8 8" stroke-width="1.6"/></g><text x="140" y="276" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Ultra HD 3x PNG Mockups</text><text x="140" y="298" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Retina-grade PNG at 3x scale.</text><text x="140" y="315" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Frameless or with device frame.</text><rect x="140" y="340" width="37" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="158.5" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">@3x</text><rect x="185" y="340" width="76" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="223.0" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">FRAMELESS</text><rect x="269" y="340" width="95" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="316.5" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">DEVICE FRAME</text><circle cx="396" cy="270" r="16" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.4"/><g fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 263 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 278 h14"/></g><rect x="30" y="412" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="412" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="412" width="4" height="156" rx="2" fill="#F59E0B" fill-opacity="0.0"/><rect x="50" y="438" width="72" height="72" rx="20" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.45"/><g fill="none" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M69 464 l5 -9 h24 l5 9 z"/><rect x="69" y="464" width="34" height="27" rx="4"/><path d="M86 464 v8 m0 4 v3 m0 4 v3" stroke-dasharray="1 0"/><rect x="82.5" y="479" width="7" height="8" rx="2" stroke-width="1.6"/></g><text x="140" y="452" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Client-Side Bulk ZIP</text><text x="140" y="474" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Structured archive of all shots</text><text x="140" y="491" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">and icons, zipped in your browser.</text><rect x="140" y="516" width="37" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="158.5" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">ZIP</text><rect x="185" y="516" width="50" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="210.0" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">SHOTS</text><rect x="243" y="516" width="50" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="268.0" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">ICONS</text><circle cx="396" cy="446" r="16" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.4"/><g fill="none" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 439 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 454 h14"/></g><rect x="30" y="588" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="588" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="588" width="4" height="156" rx="2" fill="#A78BFA" fill-opacity="0.0"/><rect x="50" y="614" width="72" height="72" rx="20" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.45"/><g fill="none" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M74 631 h17 l8 8 v27 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 v-32 a3 3 0 0 1 3 -3 z"/><path d="M91 631 v8 h8" stroke-width="1.6"/><path d="M79 656 v-6 l3.5 4 l3.5 -4 v6 M91.5 650 v6 m-3 -3 l3 3 l3 -3" stroke-width="1.5"/></g><text x="140" y="628" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Developer Markdown Spec</text><text x="140" y="650" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Ready-to-paste store copy,</text><text x="140" y="667" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">titles, subtitles &amp; descriptions.</text><rect x="140" y="692" width="37" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="158.5" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">.MD</text><rect x="185" y="692" width="50" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="210.0" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">TITLE</text><rect x="243" y="692" width="88" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="287.0" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">DESCRIPTION</text><circle cx="396" cy="622" r="16" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.4"/><g fill="none" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 615 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 630 h14"/></g><rect x="30" y="768" width="400" height="84" rx="42" fill="url(#s4okg)" stroke="rgba(16,185,129,0.5)" stroke-width="1.2"/><circle cx="72" cy="810" r="20" fill="#10B981"/><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="64.5" y="808" width="15" height="11" rx="2.5" fill="#fff" fill-opacity="0.15"/><path d="M67.5 808 v-3.5 a4.5 4.5 0 0 1 9 0 v3.5"/></g><text x="106" y="806" font-size="13.5" font-weight="800" fill="#fff" text-anchor="start" letter-spacing="1.2">100% CLIENT-SIDE EXPORT</text><text x="106" y="826" font-size="11" font-weight="700" fill="#6EE7B7" text-anchor="start" letter-spacing="1.4">0 BYTES SENT TO SERVER</text><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);
const LINGUA_ICON = SKILL_ICON;
const LINGUA_FEATURE = SKILL_FEATURE;
const LINGUA_SHOT_1 = SKILL_SHOT_1;
const LINGUA_SHOT_2 = SKILL_SHOT_2;
const LINGUA_SHOT_3 = SKILL_SHOT_3;
const LINGUA_SHOT_4 = SKILL_SHOT_4;
/* @pro-only-end */

// --- Active State Model ---
let ICON = STUDIO_ICON;
let BLANK_ICON_1024 = '';
let BLANK_ICON_512 = '';
let CUSTOM_ICON_1024 = '';
let CUSTOM_ICON_512 = '';
let CURRENT_PRESET_KEY = 'studio';
let CURRENT_ACTIVE_PRESET = 'studio';
let IS_CUSTOM_ICON = false;
let IS_CUSTOM_FEATURE = false;
let FEATURE_GRAPHIC = STUDIO_FEATURE;
let SHOTS = [STUDIO_SHOT_1, STUDIO_SHOT_2, STUDIO_SHOT_3, STUDIO_SHOT_4];
let IPAD_SHOTS = [];
let SUPPORTS_IPAD = false;
let IPAD_FIT_MODE = 'cover';
let REVIEWS = [];
let CURRENT_PRIVACY = {
  linked: "",
  notLinked: "",
  google: "No data shared with third parties, No data collected, Data is encrypted in transit"
};

// --- Templates / Presets Catalog ---
const PRESETS = {
  studio: {
    name: "Store Preview Studio",
    sub: "Store Mockup Pro",
    promo: "Design, audit & export high-resolution App Store & Google Play metadata completely offline with zero recurring subscription fees.",
    short: "Design, audit & export App Store & Google Play metadata offline.",
    dev: "Store Mockup Pro",
    email: "support@previewstudio.app",
    phone: "+1 800-555-0199",
    addr: "San Francisco, CA",
    category: "Developer Tools",
    whatsNew: "Version 2.1.0 Update:\n- Live dual-store viewports (iPhone, iPad & Android layouts)\n- App Icon Inspector with Apple icon transparency compliance audit\n- Ultra HD 3x PNG mockups & 1-click bulk ZIP export\n- Developer Markdown generator\n- Standalone offline operation with zero telemetry",
    desc: "Store Preview Studio is the professional listing designer and pre-flight audit studio for iOS and Android developers, indie creators, and digital agencies.\n\nCraft high-converting App Store Connect and Google Play Console product listings side-by-side with instantaneous real-time sync, automated store limit validation, and Retina-grade mockup generation — offline in your browser.\n\nCORE CAPABILITIES:\n• Dual-Store Live Viewports: Simultaneously visualize how your app listing looks on both iOS and Android before publishing.\n• Pre-Flight Compliance Audit: Automated real-time checking of title lengths, character limits, and store dimension requirements.\n• App Icon Inspector: Audit master 1024x1024 icons, test transparency compliance against Apple opaque icon guidelines, and preview adaptive squircle shapes.\n• Ultra HD 3x Multi-Format Export: Download pristine 3x Retina PNG device mockups, comprehensive client-side ZIP bundles, and developer Markdown specifications in 1 click.\n• Client-Side Privacy: Operates completely offline with zero tracking, zero server dependencies, and zero monthly subscriptions.\n\nPRICING & LICENSING:\nPay once on Gumroad, own forever. No subscriptions, no cloud dependencies.",
    privLinked: "",
    privNotLinked: "",
    privGoogle: "No data shared with third parties, No data collected, Data is encrypted in transit",
    stats: {
      "rating": "4.9",
      "count": "1.8K",
      "rank": "1",
      "dl": "50K+",
      "size": "42 MB",
      "age": "4+",
      "iap": "iap",
      "off": false,
      "wm": false
},
    rdate: getCurrentMonthDateStr(2, true),
    icon: STUDIO_ICON,
    feature: STUDIO_FEATURE,
    shots: [STUDIO_SHOT_1, STUDIO_SHOT_2, STUDIO_SHOT_3, STUDIO_SHOT_4],
    reviews: [
      {
        author: "Alex Morgan",
        avatarBg: "#0b57d0",
        stars: 5,
        date: getCurrentMonthDateStr(4, true),
        title: "Intuitive & beautifully designed",
        text: "Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction. The side-by-side preview saved me hours before launching!",
        helpful: 142
      },
      {
        author: "David Chen",
        avatarBg: "#7c3aed",
        stars: 5,
        date: getCurrentMonthDateStr(7, true),
        title: "Essential tool for indie app developers",
        text: "The icon transparency inspector and instant 3x PNG export are indispensable. Best investment I made for my App Store launch workflow.",
        helpful: 89
      },
      {
        author: "Elena Rostova",
        avatarBg: "#059669",
        stars: 5,
        date: getCurrentMonthDateStr(11, true),
        title: "Reliable, fast, and completely offline",
        text: "Private and client-side. No backend servers, no subscriptions. A permanent essential tool in my agency workflow.",
        helpful: 67
      }
    ]
  },

  taskflow: {
    name: "TaskFlow: Daily Habit Planner",
    sub: "Build habits & boost focus",
    promo: "Spring Productivity Sale: Unlock TaskFlow Pro with smart recurring habits, Pomodoro focus timer, and seamless cloud sync.",
    short: "Organize daily tasks, build lasting habits, and track your focus effortlessly.",
    dev: "FlowCraft Studio Inc.",
    email: "support@flowcraft.studio",
    phone: "+1 800-555-0199",
    addr: "San Francisco, CA",
    category: "Productivity",
    whatsNew: "Version 2.4.0 Update:\n- Interactive Home Screen and Lock Screen widgets\n- Smart habit streak reminders with custom vibration\n- Refined dark theme with pure OLED black mode\n- Faster cloud sync and performance improvements\n- Minor bug fixes and localization updates",
    desc: `Transform your daily routine with TaskFlow — the all-in-one productivity planner and habit tracker designed to help you stay focused, organized, and motivated.

Whether you're building a new morning routine, tracking daily fitness goals, or managing complex project milestones, TaskFlow adapts to your workflow with elegance and simplicity.

KEY FEATURES:
• Smart Habit Builder: Create recurring habits with flexible scheduling (daily, weekdays, or custom intervals).
• Interactive Streak Tracking: Visual streak counters and milestone celebrations keep you inspired every day.
• Focus Timer & Pomodoro: Integrated timer with ambient focus sounds to eliminate distractions and boost deep work.
• Rich Widgets: Beautiful iOS & Android home screen widgets to check off habits without opening the app.
• Cross-Device Cloud Sync: Real-time end-to-end encrypted sync across your iPhone, iPad, Mac, and Android devices.
• Comprehensive Analytics: Detailed charts and weekly productivity scorecards to understand your peak hours.

PRIVACY FIRST:
We believe your personal data belongs only to you. TaskFlow requires no account to get started and never sells your information to advertisers.

SUBSCRIPTION & TERMS:
TaskFlow Pro is available as an optional monthly ($3.99/mo) or yearly ($29.99/yr) auto-renewable subscription. Payment will be charged to your App Store / Google Play account at confirmation of purchase.`,
    privLinked: "User Content (Tasks & Habits), Contact Info, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "No data shared with third parties, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "1.8K",
      rank: "1",
      dl: "50K+",
      size: "86 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(2, true),
    icon: DEFAULT_ICON,
    feature: DEFAULT_FEATURE,
    shots: [SHOT_1, SHOT_2, SHOT_3, SHOT_4],
    reviews: [
      {
        author: "Marcus Vance",
        avatarBg: "#0b57d0",
        stars: 5,
        date: getCurrentMonthDateStr(4, true),
        title: "Clean UI & effective daily tracking",
        text: "Clean UI, smooth animations, and very effective for daily tracking. The widget integration on iOS and Android is top-notch!",
        helpful: 108
      },
      {
        author: "Sarah Jenkins",
        avatarBg: "#7c3aed",
        stars: 5,
        date: getCurrentMonthDateStr(11, true),
        title: "Transformed my deep work",
        text: "The Pomodoro timer coupled with habit streaks completely transformed my workday focus. Cloud sync across phone and tablet is seamless.",
        helpful: 64
      }
    ]
  },
  pulsefit: {
    name: "PulseFit: Workout & Fitness",
    sub: "HIIT, gym plans & meal log",
    promo: "Get 50% off PulseFit Premium! Access 300+ guided HD workout routines, smart macro calculator, and Apple Health / Health Connect sync.",
    short: "Log workouts, calculate macros, track heart rate, and reach your fitness goals.",
    dev: "PulseFit Health Lab",
    email: "support@pulsefit.io",
    phone: "+1 888-555-0142",
    addr: "Boulder, CO",
    category: "Health & Fitness",
    whatsNew: "Version 3.1.2:\n- Added 45 new bodyweight HIIT workouts\n- Real-time heart rate zone monitoring with Apple Watch & Wear OS\n- Custom meal macro presets and barcode scanner enhancements\n- Improved rest timer audio cues\n- Bug fixes and battery life optimizations",
    desc: `Crush your health goals with PulseFit — the ultimate workout logger, strength tracker, and nutrition companion built for athletes and fitness beginners alike.

From progressive overload tracking in the weight room to high-intensity interval training (HIIT) at home, PulseFit gives you the exact tools and analytics you need to build muscle and burn fat.

WHY ATHLETES LOVE PULSEFIT:
• 300+ Expert Routines: Verified strength, cardio, and mobility programs tailored to your equipment.
• Smart Weight & Rep Logger: Automatic rest timers and 1-rep max calculations.
• Nutrition & Macro Scanner: Fast barcode scanning with extensive food database.
• Health Sync: Seamless two-way integration with Apple Health and Google Health Connect.
• Offline Mode: Log your full workout without an internet connection.

DISCLAIMER:
PulseFit provides fitness and dietary tracking for educational and wellness purposes only. Always consult with a physician before starting any new exercise or diet program.`,
    privLinked: "Health & Fitness (Workouts & Pulse), Contact Info, User Content, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "Data collected: Health & Fitness info, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.8",
      count: "24.6K",
      rank: "3",
      dl: "500K+",
      size: "112 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(1, true),
    icon: PULSEFIT_ICON,
    feature: PULSEFIT_FEATURE,
    shots: [PULSEFIT_SHOT_1, PULSEFIT_SHOT_2, PULSEFIT_SHOT_3, PULSEFIT_SHOT_4],
    reviews: [
      {
        author: "Jason Miller",
        avatarBg: "#16a34a",
        stars: 5,
        date: getCurrentMonthDateStr(5, true),
        title: "Best progressive overload tracker",
        text: "Best progressive overload tracker on mobile. The automatic rest timer and Health Connect integration make gym workouts effortless.",
        helpful: 142
      },
      {
        author: "Emma Watson",
        avatarBg: "#0891b2",
        stars: 5,
        date: getCurrentMonthDateStr(14, true),
        title: "Clean interface & macro calculator",
        text: "Love the macro calculator and quick barcode scanner. Clean interface without clutter or intrusive popups!",
        helpful: 89
      }
    ]
  },
  zenmind: {
    name: "ZenMind: Meditation & Sleep",
    sub: "Guided breathwork & calm sound",
    promo: "Sleep deeper tonight. Experience our new neuro-acoustic 3D soundscapes and calming bedtime journeys voiced by renowned artists.",
    short: "Reduce stress, sleep peacefully, and find calm with guided daily meditations.",
    dev: "ZenMind Studio",
    email: "hello@zenmind.app",
    phone: "+1 800-555-0177",
    addr: "Portland, OR",
    category: "Health & Fitness",
    whatsNew: "Version 1.8.0:\n- 12 new immersive bedtime soundscapes (Binaural beats & rain)\n- Customizable breathwork exercises for anxiety relief\n- Offline listening support for premium journeys\n- Polished interface and sleep timer countdown",
    desc: `Quiet your mind and sleep soundly with ZenMind. Discover hundreds of evidence-based guided meditations, relaxing soundscapes, and breathing exercises crafted by leading mindfulness experts.

Whether you're overcoming midday anxiety, establishing a mindful morning routine, or drifting off to sleep with rain falling on forest leaves, ZenMind is your sanctuary of calm.

WHAT YOU'LL EXPERIENCE:
• Guided Meditations: 3 to 30-minute sessions for stress relief, focus, self-compassion, and deep rest.
• Sleep Stories & Soundscapes: Atmospheric audio journeys designed to naturally guide your brain into restorative REM sleep.
• 4-7-8 Breathwork: Interactive paced breathing exercises to quickly soothe an overactive nervous system.
• Mood & Gratitude Journal: Track emotional shifts and note daily moments of peace.`,
    privLinked: "Health & Fitness (Mindful Minutes), Audio Data, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "No data shared with third parties, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "18.2K",
      rank: "5",
      dl: "250K+",
      size: "74 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(3, true),
    icon: ZENMIND_ICON,
    feature: ZENMIND_FEATURE,
    shots: [ZENMIND_SHOT_1, ZENMIND_SHOT_2, ZENMIND_SHOT_3, ZENMIND_SHOT_4],
    reviews: [
      {
        author: "Clara Hughes",
        avatarBg: "#6366f1",
        stars: 5,
        date: getCurrentMonthDateStr(6, true),
        title: "Calming audio & breathwork",
        text: "The neuro-acoustic rain soundscapes have genuinely helped my sleep. The 4-7-8 breathing exercises are so calming after a stressful workday.",
        helpful: 215
      },
      {
        author: "Oliver Bennett",
        avatarBg: "#059669",
        stars: 5,
        date: getCurrentMonthDateStr(16, true),
        title: "Peaceful & minimalist design",
        text: "Minimalist design, gentle audio transitions, and beautiful bedtime stories. Easily the most peaceful app on my phone.",
        helpful: 97
      }
    ]
  },
  /* @pro-only-start */
  cyberstrike: {
    name: "CyberStrike: 2088 Cyber RPG",
    sub: "Open-world sci-fi action RPG",
    promo: "Season 4: Neon Uprising is LIVE! Claim your free Legendary Cyber-Blade, pilot mech suits, and team up in 10-player co-op raids!",
    short: "Pilot combat mechs, fight in neon cyberpunk worlds, and conquer co-op raids.",
    dev: "OmniArcade Games Ltd.",
    email: "support@omniarcade.games",
    phone: "+81 3 5555 0188",
    addr: "Tokyo, Japan",
    category: "Role Playing",
    whatsNew: "Version 4.2.0 - Neon Uprising:\n- New Open World Sector: Neo-Shinjuku District\n- 5 new Legendary Cybernetic Weapons & Exosuits\n- 10-player Co-op Raid Boss: Titan Dreadnought\n- 120 FPS Ultra Mode on supported devices\n- Gamepad & Razer Kishi / Backbone controller support\n- Engine optimizations and faster asset loading",
    desc: `Step into the year 2088. Welcome to CyberStrike — the groundbreaking open-world sci-fi Action RPG that delivers console-grade combat and breathtaking cybernetic visuals right to your mobile device.

In the neon-drenched megacity of Neo-Shinjuku, corrupt mega-corporations and rogue AI factions battle for supremacy. As an elite augmented mercenary, your choices and combat prowess will decide the fate of humanity's final frontier.

CORE GAMEPLAY FEATURES:
• Breathtaking Open World: Explore sprawling high-tech districts, vertical skyscrapers, and underground neon night markets with complete freedom.
• High-Octane Action Combat: Chain lightning-fast cyber-katana combos, switch to plasma heavy rifles mid-air, and unleash devastating elemental abilities.
• Customizable Combat Mechs: Unlock and pilot heavy exosuits with unique skill trees, custom laser plating, and jump-jet mobility.
• 10-Player Online Co-op Raids: Coordinate tactics with teammates around the world to defeat massive multi-phase Titan bosses and earn Legendary gear.
• Competitive PvP Arena: Test your builds in fast-paced 1v1 and 3v3 ranked cyber-gladiator showdowns.
• Console-Grade 120 FPS Graphics: Built on high-end mobile rendering with dynamic volumetric lighting, screen-space reflections, and full controller support (PlayStation, Xbox, Backbone, Razer Kishi).

JOIN OVER 100,000 CYBER MERCENARIES WORLDWIDE:
Download CyberStrike today and forge your legend in the neon underworld!`,
    privLinked: "Purchases (In-App Gear), User Content (Game Saves), Identifiers (Player ID), Usage Data (Gameplay Stats)",
    privNotLinked: "Diagnostics (Crash Logs & 120 FPS), Approximate Location",
    privGoogle: "Data shared with third parties (Analytics & Leaderboards), Data collected: Purchases & Player ID, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "48.5K",
      rank: "2",
      dl: "100K+",
      size: "1.8 GB",
      age: "12+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(2, true),
    icon: CYBER_ICON,
    feature: CYBER_FEATURE,
    shots: [CYBER_SHOT_1, CYBER_SHOT_2, CYBER_SHOT_3, CYBER_SHOT_4],
    reviews: [
      {
        author: "Alexander Drake",
        avatarBg: "#ea580c",
        stars: 5,
        date: getCurrentMonthDateStr(7, true),
        title: "Incredible mobile performance",
        text: "Unbelievable graphics for mobile! 120 FPS runs rock solid on high settings, and the mech raid bosses require real team coordination.",
        helpful: 340
      },
      {
        author: "Maya Lindqvist",
        avatarBg: "#8b5cf6",
        stars: 5,
        date: getCurrentMonthDateStr(12, true),
        title: "Fast-paced cyber combat",
        text: "Fast-paced cyber combat and deep character skill trees. Controller support works seamlessly right out of the box.",
        helpful: 182
      }
    ]
  },
  edulearn: {
    name: "SkillSphere: Online Courses",
    sub: "Learn coding, business & AI",
    promo: "Flash Sale: Master in-demand skills with 250,000+ top video courses from $9.99. Learn Python, AI, Design & Business with offline downloads.",
    short: "Stream 25,000+ video courses in coding, AI, and business with expert mentors.",
    dev: "SkillSphere Global Inc.",
    email: "support@skillsphere.edu",
    phone: "+44 20 7946 0912",
    addr: "San Francisco, CA",
    category: "Education",
    whatsNew: "Version 4.1.0:\n- Enhanced HD video player with custom playback speeds (0.5x - 2.5x)\n- Background audio mode & offline video download manager\n- Interactive coding exercises & real-time syntax checking\n- Shareable digital certificates direct to LinkedIn\n- Performance enhancements and smoother video streaming",
    desc: `Advance your career and master in-demand technical, creative, and business skills with SkillSphere — the premier video learning marketplace trusted by over 5 million students worldwide.

Explore an expansive catalog of 250,000+ expert-led video courses across Software Engineering, Artificial Intelligence, UI/UX Design, Data Science, Digital Marketing, Cloud Computing, and Leadership.

WHY LEARN WITH SKILLSPHERE:
• 250,000+ High-Definition Courses: Fresh video content updated weekly by industry practitioners and global thought leaders.
• Lifetime Course Access: Learn at your own pace on mobile, tablet, desktop, or Chromecast.
• Offline Video Downloads: Save lessons for flights, commutes, or study sessions without cellular data.
• Hands-On Coding Labs: Practice programming directly in the app with interactive sandboxes for Python, JavaScript, and React.
• Expert Mentor Q&A: Post questions directly to course instructors and collaborate with an active global learning community.
• Accredited Completion Certificates: Earn verified, shareable digital credentials to elevate your LinkedIn profile and resume.
• Audio-Only Background Play: Listen to lectures while commuting or multitasking.

POPULAR TOPICS INCLUDE:
- Software Development: Python, Full-Stack Web, React, iOS Swift, Android Kotlin, Flutter
- Artificial Intelligence: LLMs, PyTorch, Generative AI, Prompt Engineering, Machine Learning
- Design & Creativity: UI/UX Figma, Graphic Design, 3D Animation, Motion Graphics
- Business & Management: Product Management, Agile Scrum, Entrepreneurship, Financial Modeling

PRIVACY & SAFETY:
Your privacy is our priority. Your learning progress and credentials are kept strictly private and never shared with unauthorized third parties.

SUBSCRIPTION & LIFETIME PURCHASES:
Choose between individual lifetime course purchases or our SkillSphere All-Access Annual Pass. Payment will be charged to your App Store / Google Play account upon purchase confirmation.`,
    privLinked: "Purchases (Course Enrollments), User Content (Notes & Code), Identifiers, Usage Data",
    privNotLinked: "Diagnostics, Performance Data",
    privGoogle: "Data collected: Purchases & In-app progress, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.8",
      count: "145K",
      rank: "1",
      dl: "5M+",
      size: "98 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(1, true),
    icon: SKILL_ICON,
    feature: SKILL_FEATURE,
    shots: [SKILL_SHOT_1, SKILL_SHOT_2, SKILL_SHOT_3, SKILL_SHOT_4],
    reviews: [
      {
        author: "Ethan Walker",
        avatarBg: "#2563eb",
        stars: 5,
        date: getCurrentMonthDateStr(3, true),
        title: "Practical learning on the go",
        text: "The interactive in-app Python sandbox and offline video downloads make studying during commutes a breeze. Earned my LinkedIn certificate in 2 weeks!",
        helpful: 194
      },
      {
        author: "Rachel Adams",
        avatarBg: "#d97706",
        stars: 5,
        date: getCurrentMonthDateStr(15, true),
        title: "High production quality courses",
        text: "High production quality courses and very active instructor Q&A forums. Great value compared to desktop course platforms.",
        helpful: 112
      }
    ]
  }
  /* @pro-only-end */
};

REVIEWS = (PRESETS.taskflow && PRESETS.taskflow.reviews) ? JSON.parse(JSON.stringify(PRESETS.taskflow.reviews)) : [];


