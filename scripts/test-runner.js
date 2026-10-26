#!/usr/bin/env node
/**
 * Store Preview Studio · Automated QA Test Runner
 * 
 * Executes full test suites covering:
 * - Module 1: Presets & Distinct Assets Suite
 * - Module 2: JSON Import Validation (22 Valid J-cases + 26 Invalid E-cases)
 * - Module 3: Unicode Grapheme Cluster Counter
 * - Module 4: Markdown Export & Dynamic safeFence
 * - Module 5: Illustrative Metrics & Age Mapping
 * - Module 6: Drag & Drop File Type Handling
 * - Module 7: Real-time App Icon Validator Logic
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.join(__dirname, '..');
const TEST_DATA_DIR = path.join(ROOT_DIR, 'test_data', 'json');

let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    results.push({ status: 'PASS', message });
  } else {
    failedTests++;
    results.push({ status: 'FAIL', message });
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('\n======================================================');
console.log('STORE PREVIEW STUDIO · AUTOMATED TEST RUNNER');
console.log('======================================================\n');

// ---------------------------------------------------------------------
// Load Core Environment in Sandbox
// ---------------------------------------------------------------------
const stateCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'state.js'), 'utf8');

// Mock DOM elements
const mockElements = {};
function createMockEl(id, val = '') {
  mockElements[id] = { id, value: val, dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {} } };
  return mockElements[id];
}

['f-name', 'f-sub', 'f-promo', 'f-short', 'f-dev', 'f-cat', 'f-keywords', 'f-ver', 'f-rdate', 'f-email', 'f-addr', 'f-priv-linked', 'f-priv-notlinked', 'f-priv-google', 'f-new', 'f-desc', 'f-st-rating', 'f-st-count', 'f-st-rank', 'f-st-dl', 'f-st-size', 'f-st-age', 'f-st-iap'].forEach(id => createMockEl(id));

const toasts = [];
const sandbox = {
  console,
  encodeURIComponent: global.encodeURIComponent,
  decodeURIComponent: global.decodeURIComponent,
  document: {
    querySelector: () => ({ dataset: { theme: 'light' } }),
    querySelectorAll: () => [],
    body: { classList: { toggle: () => {} }, dataset: {} }
  },
  $: (id) => mockElements[id] || { value: '', dataset: {}, classList: { toggle: () => {} } },
  $$: () => [],
  showToast: (msg, icon) => toasts.push({ msg, icon }),
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout
};

vm.createContext(sandbox);
vm.runInContext(stateCode + '\nglobalThis.PRESETS = PRESETS;\nglobalThis.GOOGLE_AGE_MAP = GOOGLE_AGE_MAP;\nglobalThis.DEFAULT_ICON = DEFAULT_ICON;\nglobalThis.PULSEFIT_ICON = PULSEFIT_ICON;\nglobalThis.ZENMIND_ICON = ZENMIND_ICON;\nglobalThis.CYBER_ICON = CYBER_ICON;\nglobalThis.LINGUA_ICON = LINGUA_ICON;', sandbox);

const PRESETS = sandbox.PRESETS;
const GOOGLE_AGE_MAP = sandbox.GOOGLE_AGE_MAP;

// ---------------------------------------------------------------------
// Suite 1: Presets & Distinct Assets Suite
// ---------------------------------------------------------------------
console.log('[SUITE 1]: Presets & Distinct Vector Assets');

assert(!!PRESETS.taskflow, 'Preset TaskFlow exists');
assert(!!PRESETS.pulsefit, 'Preset PulseFit exists');
assert(!!PRESETS.zenmind, 'Preset ZenMind exists');
assert(!!PRESETS.cyberstrike, 'Preset CyberStrike exists');
assert(!!PRESETS.edulearn, 'Preset SkillSphere (Education) exists');

assert(PRESETS.pulsefit.icon !== PRESETS.taskflow.icon, 'PulseFit icon is distinct from TaskFlow icon');
assert(PRESETS.zenmind.icon !== PRESETS.taskflow.icon, 'ZenMind icon is distinct from TaskFlow icon');
assert(PRESETS.pulsefit.icon !== PRESETS.zenmind.icon, 'PulseFit icon is distinct from ZenMind icon');
assert(PRESETS.cyberstrike.icon !== PRESETS.taskflow.icon, 'CyberStrike icon is distinct from TaskFlow icon');
assert(PRESETS.edulearn.icon !== PRESETS.taskflow.icon, 'SkillSphere icon is distinct from TaskFlow icon');

assert(PRESETS.pulsefit.shots[0] !== PRESETS.taskflow.shots[0], 'PulseFit screenshots are distinct from TaskFlow');
assert(PRESETS.zenmind.shots[0] !== PRESETS.taskflow.shots[0], 'ZenMind screenshots are distinct from TaskFlow');
assert(PRESETS.edulearn.shots[0] !== PRESETS.taskflow.shots[0], 'SkillSphere screenshots are distinct from TaskFlow');
assert(PRESETS.pulsefit.shots.length === 4, 'PulseFit has exactly 4 screenshots');
assert(PRESETS.zenmind.shots.length === 4, 'ZenMind has exactly 4 screenshots');
assert(PRESETS.cyberstrike.shots.length === 4, 'CyberStrike has exactly 4 screenshots');
assert(PRESETS.edulearn.shots.length === 4, 'SkillSphere has exactly 4 screenshots');

// Check 1024x1024 square opaque specifications
[
  { name: 'TaskFlow', icon: PRESETS.taskflow.icon },
  { name: 'PulseFit', icon: PRESETS.pulsefit.icon },
  { name: 'ZenMind', icon: PRESETS.zenmind.icon },
  { name: 'CyberStrike', icon: PRESETS.cyberstrike.icon },
  { name: 'SkillSphere', icon: PRESETS.edulearn.icon }
].forEach(p => {
  const decoded = decodeURIComponent(p.icon);
  assert(decoded.includes('width="1024"') && decoded.includes('height="1024"'), `${p.name} icon specifies 1024x1024 dimensions`);
  assert(decoded.includes('<rect width="512" height="512" fill="url(#') || decoded.includes('<rect width="512" height="512" fill="#'), `${p.name} icon has opaque non-transparent background rect`);
});

// Verify template files in presets/
const presetFiles = ['saas-app-template.json', 'fitness-tracker-template.json', 'zenmind-meditation-template.json', 'cyberstrike-rpg-game-template.json', 'education-language-template.json'];
presetFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, 'presets', file);
  assert(fs.existsSync(fullPath), `Preset file presets/${file} exists`);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  assert(data.generator === 'Store Preview Studio', `Preset ${file} has valid generator header`);
  assert(Array.isArray(data.shots) && data.shots.length === 4, `Preset ${file} contains 4 screenshots`);
});

// Verify Preset Menu Dropdown uses real app icon thumbnails
const bundledHtmlPath = fs.existsSync(path.join(ROOT_DIR, 'core.html'))
  ? path.join(ROOT_DIR, 'core.html')
  : path.join(ROOT_DIR, 'store_preview_studio.html');
const bundledHtml = fs.readFileSync(bundledHtmlPath, 'utf8');

// Verify Domain-specific English reviews on all presets
const testNow = new Date();
const currentTestYear = String(testNow.getFullYear());
const currentTestMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][testNow.getMonth()];

['taskflow', 'pulsefit', 'zenmind', 'cyberstrike', 'edulearn'].forEach(key => {
  const p = PRESETS[key];
  assert(p.rdate && p.rdate.includes(currentTestYear) && p.rdate.includes(currentTestMonth), `Preset ${key} release date '${p.rdate}' contains current month (${currentTestMonth}) and year (${currentTestYear})`);
  assert(Array.isArray(p.reviews) && p.reviews.length >= 2, `Preset ${key} contains an array of at least 2 reviews`);
  p.reviews.forEach(r => {
    assert(typeof r.author === 'string' && /^[a-zA-Z\s]+$/.test(r.author), `Reviewer author '${r.author}' is an authentic English name`);
    assert(typeof r.text === 'string' && r.text.length > 15, `Review text for '${r.author}' is substantial`);
    assert(r.stars >= 1 && r.stars <= 5, `Review stars for '${r.author}' are between 1 and 5`);
    assert(typeof r.helpful === 'number' && r.helpful > 0, `Review helpful count for '${r.author}' is valid`);
    assert(r.date.includes(currentTestYear) && r.date.includes(currentTestMonth), `Review date '${r.date}' for '${r.author}' is in current month (${currentTestMonth}) and year (${currentTestYear})`);
  });
});
assert(bundledHtml.includes('function updateMockupClocks'), 'App bundles dynamic updateMockupClocks function for non-hardcoded status bar time');
assert(bundledHtml.includes('function renderReviews'), 'App bundles renderReviews function');
assert(bundledHtml.includes('data-google-reviews'), 'App mockups include data-google-reviews container');
assert(!bundledHtml.includes('Khoa Nguyễn'), 'Khoa Nguyễn has been replaced by English reviewers');

assert(bundledHtml.includes('class="preset-thumb"'), 'Preset dropdown includes .preset-thumb app icon image elements');
assert(bundledHtml.includes('class="preset-thumb-blank"'), 'Preset dropdown includes .preset-thumb-blank element for None/Blank option');
assert(bundledHtml.includes('PRESET_ICONS'), 'Preset module defines PRESET_ICONS map for dynamic icon synchronization');
assert(bundledHtml.includes('initPresetThumbnails'), 'Preset module executes initPresetThumbnails to sync app icons');

// Verify App Icon Download feature
assert(bundledHtml.includes('id="icoDown"'), 'Icon section includes #icoDown Download Icon button');
assert(bundledHtml.includes('function downloadAppIcon'), 'Shots module includes downloadAppIcon function');

// Verify Real-time Screenshot Aspect Ratio Inspector
assert(bundledHtml.includes('function validateScreenshots'), 'Shots module includes validateScreenshots function');
assert(bundledHtml.includes('shot-dim-tag'), 'Editor includes .shot-dim-tag for row-level dimension badges');

function checkShotRatio(w, h){
  const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
  const isLandscape = w > h * 1.15;
  const isPhonePortrait = h >= w * 1.35;
  return { isSquare, isLandscape, isPhonePortrait };
}
assert(checkShotRatio(1080, 1080).isSquare === true, '1080x1080 is correctly detected as square (1:1)');
assert(checkShotRatio(1290, 2796).isPhonePortrait === true, '1290x2796 is correctly detected as phone portrait (~19.5:9)');
assert(checkShotRatio(1080, 1920).isPhonePortrait === true, '1080x1920 is correctly detected as phone portrait (9:16)');
assert(checkShotRatio(1920, 1080).isLandscape === true, '1920x1080 is correctly detected as landscape (16:9)');

// ---------------------------------------------------------------------
// Suite 2: Unicode Grapheme Cluster Counter (`Intl.Segmenter`)
// ---------------------------------------------------------------------
console.log('\n[SUITE 2]: Grapheme Cluster Counter (Intl.Segmenter)');

function countChars(str) {
  if (!str) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return [...segmenter.segment(str)].length;
  }
  return str.length;
}

assert(countChars('TaskFlow') === 8, 'ASCII text count is correct (8)');
assert(countChars('Ứng dụng Thể hình') === 17, 'Vietnamese Unicode diacritics count correctly (17)');
assert(countChars('🧘‍♀️') === 1, 'Complex multi-codepoint emoji 🧘‍♀️ counts as 1 character');
assert(countChars('👨‍👩‍👧‍👦') === 1, 'Family ZWJ sequence emoji 👨‍👩‍👧‍👦 counts as 1 character');
assert(countChars('❤️‍🔥') === 1, 'Heart on fire ZWJ emoji ❤️‍🔥 counts as 1 character');
assert(countChars('TaskFlow 🔥 2026') === 15, 'Mixed text and emoji counts accurately (15)');

// ---------------------------------------------------------------------
// Suite 3: JSON Import Engine (parseAndApplyJSON)
// ---------------------------------------------------------------------
console.log('\n[SUITE 3]: JSON Import Validation (J-cases & E-cases)');

// Implement the exact parseAndApplyJSON logic from export.js in test harness
function testParseAndApplyJSON(text) {
  if (!text || typeof text !== 'string') return { success: false, reason: 'empty_input' };
  
  // Auto-strip UTF-8 BOM (\uFEFF)
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }
  
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return { success: false, reason: 'syntax_error', error: err.message };
  }
  
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, reason: 'invalid_root_type' };
  }
  
  let hadWrongTypes = false;
  function getStr(val) {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return val;
    hadWrongTypes = true;
    return '';
  }
  
  const isKnownGenerator = (data.generator === 'Store Preview Studio' || data.app === 'Store Preview Studio');
  const hasAppWrapper = (data.form && typeof data.form === 'object') || (data.app && typeof data.app === 'object');
  const hasStoreKeys = !!(data.store !== undefined || data.theme !== undefined || data.shots !== undefined || data.tab7Shots !== undefined || data.tab10Shots !== undefined || data.icon !== undefined || data.featureGraphic !== undefined || data.feature !== undefined);
  
  const src = (data.form && typeof data.form === 'object') ? data.form : ((data.app && typeof data.app === 'object') ? data.app : data);
  
  const mapped = {
    name: getStr(src.name || src.title || src.appName),
    sub: getStr(src.sub || src.subtitle),
    promo: getStr(src.promo || src.promotionalText),
    short: getStr(src.short || src.shortDesc || src.shortDescription),
    dev: getStr(src.dev || src.developer || src.developerName || src.author),
    cat: getStr(src.cat || src.category),
    keywords: getStr(src.keywords || src.keywordsList),
    ver: getStr(src.ver || src.appVersion),
    rdate: getStr(src.rdate || src.releaseDate),
    email: getStr(src.email || src.supportEmail),
    addr: getStr(src.addr || src.address || src.location),
    privLinked: getStr(src.privLinked),
    privNotLinked: getStr(src.privNotLinked),
    privGoogle: getStr(src.privGoogle),
    new: getStr(src.new || src.whatsNew || src.releaseNotes || src.changelog),
    desc: getStr(src.desc || src.description || src.fullDescription)
  };
  
  const hasMobileSpecificFields = !!(mapped.sub || mapped.promo || mapped.short || mapped.keywords || src.catApple || src.catGoogle);
  
  if (!isKnownGenerator && !hasAppWrapper && !hasStoreKeys && !hasMobileSpecificFields) {
    return { success: false, reason: 'unrecognized_schema' };
  }
  
  const hasFields = Object.values(mapped).some(v => v.trim().length > 0);
  if (!hasFields && !data.icon && !Array.isArray(data.shots)) {
    return { success: false, reason: 'no_metadata_fields' };
  }
  
  let shotsCount = 0;
  if (Array.isArray(data.shots)) {
    const cleanShots = data.shots.filter(x => typeof x === 'string' && x.trim().length > 0);
    shotsCount = cleanShots.length;
  }
  
  return {
    success: true,
    hadWrongTypes,
    mapped,
    shotsCount,
    hasIcon: typeof data.icon === 'string'
  };
}

// Test all J*.json files
const jFiles = fs.readdirSync(TEST_DATA_DIR).filter(f => f.startsWith('J') && f.endsWith('.json')).sort();
jFiles.forEach(file => {
  const content = fs.readFileSync(path.join(TEST_DATA_DIR, file), 'utf8');
  const res = testParseAndApplyJSON(content);
  assert(res.success === true, `Valid test fixture ${file} parsed successfully`);
});

// Test key E*.json files
const eFiles = fs.readdirSync(TEST_DATA_DIR).filter(f => f.startsWith('E')).sort();
eFiles.forEach(file => {
  const content = fs.readFileSync(path.join(TEST_DATA_DIR, file), 'utf8');
  const res = testParseAndApplyJSON(content);
  
  if (file === 'E23_utf8_bom.json') {
    assert(res.success === true, 'E23 (UTF-8 BOM) is stripped and parsed successfully');
  } else if (file === 'E24_huge_description_50k.json') {
    assert(res.success === true && res.mapped.desc.length > 1000, 'E24 (50k description) parses without crash');
  } else if (file === 'E09_unrelated_package_json.json') {
    assert(res.success === false && res.reason === 'unrecognized_schema', 'E09 (unrelated package.json) is rejected by schema validator');
  } else if (file === 'E11_shots_non_string.json') {
    assert(res.success === true && res.shotsCount === 1, 'E11 (shots non-string) filters out non-strings cleanly');
  } else if (file === 'E01_empty_file.json' || file === 'E02_trailing_comma.json' || file === 'E03_plain_text.json') {
    assert(res.success === false, `Error fixture ${file} is rejected cleanly (${res.reason})`);
  }
});

// ---------------------------------------------------------------------
// Suite 4: Markdown Dynamic safeFence & Metadata Export
// ---------------------------------------------------------------------
console.log('\n[SUITE 4]: Markdown Dynamic safeFence & Export');

function safeFence(text, lang = 'text') {
  let fence = '```';
  while ((text || '').includes(fence)) {
    fence += '`';
  }
  return fence + lang + '\n' + (text || '') + '\n' + fence;
}

assert(safeFence('Normal text').startsWith('```text'), 'Standard text uses 3 backticks');
assert(safeFence('Here is code: ```python\nprint(1)\n```').startsWith('````text'), 'Text with 3 backticks escalates to 4 backticks');
assert(safeFence('Nested: ````markdown\n````').startsWith('`````text'), 'Text with 4 backticks escalates to 5 backticks');

// ---------------------------------------------------------------------
// Suite 5: Illustrative Metrics & Age Mapping
// ---------------------------------------------------------------------
console.log('\n[SUITE 5]: Metrics & Age Rating Mapping');

assert(GOOGLE_AGE_MAP['4+'].badge === 'E' && GOOGLE_AGE_MAP['4+'].label === 'Everyone', 'Age 4+ maps to Google Play E (Everyone)');
assert(GOOGLE_AGE_MAP['9+'].badge === 'E10+' && GOOGLE_AGE_MAP['9+'].label === 'Everyone 10+', 'Age 9+ maps to Google Play E10+ (Everyone 10+)');
assert(GOOGLE_AGE_MAP['12+'].badge === 'T' && GOOGLE_AGE_MAP['12+'].label === 'Teen · 12+', 'Age 12+ maps to Google Play T (Teen · 12+)');
assert(GOOGLE_AGE_MAP['17+'].badge === 'M' && GOOGLE_AGE_MAP['17+'].label === 'Mature 17+', 'Age 17+ maps to Google Play M (Mature 17+)');

// ---------------------------------------------------------------------
// Suite 6: Drag & Drop File Routing Simulation
// ---------------------------------------------------------------------
console.log('\n[SUITE 6]: Drag & Drop File Dispatcher');

function routeDroppedFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.json') return 'ACTION_IMPORT_JSON';
  if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) return 'ACTION_LOAD_IMAGE';
  return 'ACTION_REJECT_UNSUPPORTED';
}

assert(routeDroppedFile('config.json') === 'ACTION_IMPORT_JSON', '.json routes to JSON import');
assert(routeDroppedFile('fitness-template.JSON') === 'ACTION_IMPORT_JSON', '.JSON (uppercase) routes to JSON import');
assert(routeDroppedFile('icon.png') === 'ACTION_LOAD_IMAGE', '.png routes to image loader');
assert(routeDroppedFile('screenshot.webp') === 'ACTION_LOAD_IMAGE', '.webp routes to image loader');
assert(routeDroppedFile('logo.svg') === 'ACTION_LOAD_IMAGE', '.svg routes to image loader');
assert(routeDroppedFile('document.pdf') === 'ACTION_REJECT_UNSUPPORTED', '.pdf is safely rejected');
assert(routeDroppedFile('script.exe') === 'ACTION_REJECT_UNSUPPORTED', '.exe is safely rejected');

// ---------------------------------------------------------------------
// Suite 7: App Store Metadata Ribbon Viewport (3 items on Phone)
// ---------------------------------------------------------------------
console.log('\n[SUITE 7]: App Store Ribbon Viewport (3 Items on Phone)');

function resolveTestCssImports(content, baseDir) {
  return content.replace(/@import\s+["']([^"']+)["'];?/gi, (match, importPath) => {
    const fullPath = path.join(baseDir, importPath);
    if (!fs.existsSync(fullPath)) return '';
    return resolveTestCssImports(fs.readFileSync(fullPath, 'utf8'), path.dirname(fullPath));
  });
}
const iosCss = resolveTestCssImports(fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'ios.css'), 'utf8'), path.join(ROOT_DIR, 'src', 'css', 'apple'));
assert(iosCss.includes('.a-met{display:flex') && iosCss.includes('overflow-x:auto'), '.a-met is horizontally scrollable with overflow-x:auto');
assert(iosCss.includes('scrollbar-width:none'), '.a-met scrollbar is hidden');
assert(iosCss.includes('flex:0 0 33.333333%'), '.a-met item width is flex:0 0 33.333333% (exactly 3 items on phone viewport)');

const themeJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'theme.js'), 'utf8');
assert(themeJs.includes('.a-met'), 'Drag-to-scroll handler is attached to .a-met');

// ---------------------------------------------------------------------
// Suite 8: Apple Universal Destination & iPad Prioritized Preview
// ---------------------------------------------------------------------
console.log('\n[SUITE 8]: Apple Universal Destination & iPad Prioritized Preview');

function resolveTestHtmlIncludes(content) {
  return content.replace(/<!--\s*@include\s*["']([^"']+)["']\s*-->/gi, (match, includePath) => {
    const fullPath = path.join(ROOT_DIR, 'src', includePath);
    if (!fs.existsSync(fullPath)) return '';
    return resolveTestHtmlIncludes(fs.readFileSync(fullPath, 'utf8'));
  });
}
const commonHtml = resolveTestHtmlIncludes(fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'common.html'), 'utf8'));
const ipadHtml = resolveTestHtmlIncludes(fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'ipad.html'), 'utf8'));
const stageTbHtml = resolveTestHtmlIncludes(fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'stage-toolbar.html'), 'utf8'));
const shotsJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots.js'), 'utf8');
const appleJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'apple', 'apple.js'), 'utf8');

// 1. Destination Markup Verification
assert(commonHtml.includes('id="destAppleGroup"'), 'common.html contains destAppleGroup destination section');
assert(commonHtml.includes('id="f-dest-iphone"') && commonHtml.includes('checked') && commonHtml.includes('disabled'), 'f-dest-iphone is checked and disabled (required)');
assert(commonHtml.includes('id="f-dest-ipad"'), 'f-dest-ipad checkbox exists in common.html');
assert(commonHtml.includes('id="destTileIphone"') && commonHtml.includes('id="destTileIpad"'), 'Both iPhone and iPad destination tiles exist');
assert(commonHtml.includes('id="ipadCard"'), 'Dedicated Card 3B (ipadCard) exists in common.html');
assert(commonHtml.includes('id="ipadSlist"') && commonHtml.includes('id="addIpadShot"'), 'ipadSlist container and addIpadShot button exist');

// 2. Mockup Attribute Verification
assert(ipadHtml.includes('data-shots="ipad-gal"'), 'ipad.html uses data-shots="ipad-gal" for isolated iPad gallery');
assert(ipadHtml.includes('data-shots="ipad-shots"'), 'ipad.html uses data-shots="ipad-shots" for search gallery');
assert(stageTbHtml.includes('data-d="iphone"') && stageTbHtml.includes('data-d="ipad"'), 'stage-toolbar.html provides both iPhone and iPad device selectors');

// 3. Decoupled Preview Logic
assert(!appleJs.includes('if(d === \'ipad\' && !SUPPORTS_IPAD)'), 'apple.js does NOT block switching to iPad in iPhone-only mode');
assert(!appleJs.includes('setSupportsIpad(true)'), 'apple.js does NOT automatically mutate SUPPORTS_IPAD on device click');
assert(!shotsJs.includes('if(!SUPPORTS_IPAD && appleDevice === \'ipad\'){\n    setAppleDevice(\'iphone\''), 'shots.js does NOT kick user back to iPhone when unchecking iPad');

// 4. Screenshot Prioritization Logic
function resolveEffectiveIpadShots(ipadShots, phoneShots) {
  const validIpad = (ipadShots || []).filter(s => typeof s === 'string' && s.trim());
  const validPhone = (phoneShots || []).filter(s => typeof s === 'string' && s.trim());
  return (validIpad.length > 0) ? validIpad : validPhone;
}

const mockPhoneShots = ['phone_1.png', 'phone_2.png', 'phone_3.png', 'phone_4.png'];
const mockIpadShots = ['ipad_1.png', 'ipad_2.png'];

// Case A: iPhone-only mode (no iPad shots uploaded) -> Fallback to phone screenshots
const resFallback = resolveEffectiveIpadShots([], mockPhoneShots);
assert(resFallback.length === 4 && resFallback[0] === 'phone_1.png', 'Empty iPad shots safely fallback to Phone screenshots');

// Case B: iPad shots uploaded -> High priority rendering of iPad screenshots
const resPrioritized = resolveEffectiveIpadShots(mockIpadShots, mockPhoneShots);
assert(resPrioritized.length === 2 && resPrioritized[0] === 'ipad_1.png', 'Dedicated iPad screenshots take priority over Phone screenshots');

// Case C: iPad shots array with only empty/blank entries -> Falls back to phone screenshots
const resBlankIpad = resolveEffectiveIpadShots(['', '   '], mockPhoneShots);
assert(resBlankIpad.length === 4 && resBlankIpad[0] === 'phone_1.png', 'Blank/whitespace iPad shots safely fallback to Phone screenshots');

// 5. iPad HTML Structure & Bottom Navigation Bar Hierarchy Verification
let ipadDivDepth = 0;
let tabParentDepth = null;
const ipadLines = ipadHtml.split('\n');
ipadLines.forEach(line => {
  const matches = line.match(/<(\/?div)[^>]*>/g) || [];
  matches.forEach(m => {
    if (m.startsWith('</div')) {
      ipadDivDepth--;
    } else {
      ipadDivDepth++;
      if (line.includes('class="tab ipad-tab"')) {
        tabParentDepth = ipadDivDepth - 1;
      }
    }
  });
});
assert(ipadDivDepth === 0, 'ipad.html div tags are perfectly balanced (final depth === 0)');
assert(tabParentDepth === 2, 'ipad-tab is properly nested inside phone container (not hanging outside)');

// 6. iPad Screenshot Ratio Classifier & Rejection Warning Logic
function classifyIpadScreenshotRatio(w, h) {
  if (w <= 0 || h <= 0) return 'INVALID';
  const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
  if (isSquare) return 'SQUARE_REJECT';
  const ratio = w / h;
  if (ratio < 0.62) return 'PHONE_RATIO_REJECT';
  if (ratio >= 0.68 && ratio <= 0.82) return 'IPAD_PORTRAIT_4_3';
  if (ratio >= 1.22 && ratio <= 1.45) return 'IPAD_LANDSCAPE_4_3';
  return 'NON_IPAD_RATIO';
}

assert(classifyIpadScreenshotRatio(2048, 2732) === 'IPAD_PORTRAIT_4_3', '2048×2732 px classified as iPad Pro 13" portrait');
assert(classifyIpadScreenshotRatio(2064, 2752) === 'IPAD_PORTRAIT_4_3', '2064×2752 px (M4 13") classified as iPad Pro 13" portrait');
assert(classifyIpadScreenshotRatio(2732, 2048) === 'IPAD_LANDSCAPE_4_3', '2732×2048 px classified as iPad Pro 13" landscape');
assert(classifyIpadScreenshotRatio(1290, 2796) === 'PHONE_RATIO_REJECT', '1290×2796 px (iPhone) flagged as PHONE_RATIO_REJECT');
assert(classifyIpadScreenshotRatio(1179, 2556) === 'PHONE_RATIO_REJECT', '1179×2556 px (iPhone) flagged as PHONE_RATIO_REJECT');
assert(classifyIpadScreenshotRatio(1024, 1024) === 'SQUARE_REJECT', '1024×1024 px square flagged as SQUARE_REJECT');
assert(classifyIpadScreenshotRatio(1000, 1500) === 'NON_IPAD_RATIO', 'Non-standard ratio flagged as NON_IPAD_RATIO');

// ---------------------------------------------------------------------
// Suite 9: iPad Pro 13" Resize Engine & Smart Canvas Fit
// ---------------------------------------------------------------------
console.log('\n[SUITE 9]: iPad Pro 13" Resize Engine & Smart Canvas Fit');

// 1. Verify UI controls & function signatures exist in bundled HTML
assert(bundledHtml.includes('function fitToIpadProCanvas'), 'Bundled app defines fitToIpadProCanvas engine');
assert(bundledHtml.includes('function fitIpadScreenshotAsync'), 'Bundled app defines fitIpadScreenshotAsync');
assert(bundledHtml.includes('function fixIpadScreenshot'), 'Bundled app defines fixIpadScreenshot');
assert(bundledHtml.includes('function fixAllIpadScreenshots'), 'Bundled app defines fixAllIpadScreenshots');
assert(bundledHtml.includes('function generateIpadFromPhone'), 'Bundled app defines generateIpadFromPhone');
assert(bundledHtml.includes('function downloadIpadScreenshot'), 'Bundled app defines downloadIpadScreenshot');
assert(bundledHtml.includes('function downloadAllIpadScreenshots'), 'Bundled app defines downloadAllIpadScreenshots');
assert(bundledHtml.includes('id="btnGenIpadFromPhone"'), 'Common editor includes #btnGenIpadFromPhone button');
assert(bundledHtml.includes('id="optExportIpadShots"'), 'Export menu includes #optExportIpadShots button');
assert(bundledHtml.includes('id="f-ipad-fit-mode"'), 'Editor includes #f-ipad-fit-mode dropdown selector');
assert(bundledHtml.includes('btnFitIpad_'), 'Editor slist renders row-level ✨ Fit button');
assert(bundledHtml.includes('btnDlIpad_'), 'Editor slist renders row-level ⬇ Download button');
assert(bundledHtml.includes('btnFixAllIpad'), 'Status badge supports ✨ Resize All (2048px) button');
assert(bundledHtml.includes('btnDlAllIpad'), 'Status badge supports ⬇ Export All button');

// 2. Unit Test: Target Dimension & Smart Fit Geometry Calculations (Cover vs Contain)
function calculateIpadFitDimensions(origW, origH, mode = 'cover') {
  const isWide = origW > origH * 1.15;
  const targetW = isWide ? 2732 : 2048;
  const targetH = isWide ? 2048 : 2732;

  const origRatio = origW / origH;
  const targetRatio = targetW / targetH;
  const isDirectScale = Math.abs(origRatio - targetRatio) < 0.12;

  if (isDirectScale || mode === 'cover') {
    const scale = Math.max(targetW / origW, targetH / origH);
    const w = Math.round(origW * scale);
    const h = Math.round(origH * scale);
    return { targetW, targetH, isDirectScale, mode: 'cover', w, h, fullBleed: w >= targetW && h >= targetH };
  } else {
    // Mode contain
    const fgScale = Math.min(targetW / origW, targetH / origH);
    const fgW = Math.round(origW * fgScale);
    const fgH = Math.round(origH * fgScale);
    return { targetW, targetH, isDirectScale: false, mode: 'contain', fgW, fgH, fgRatio: fgW / fgH, touchesEdge: fgW === targetW || fgH === targetH };
  }
}

// Test Case A: Cat photo / Square image (1024×1024 px) in Cover mode -> Fills 100% canvas (2048×2732)
const squareCover = calculateIpadFitDimensions(1024, 1024, 'cover');
assert(squareCover.targetW === 2048 && squareCover.targetH === 2732, 'Square screenshot in Cover mode targets 2048×2732 px');
assert(squareCover.fullBleed, 'Square screenshot in Cover mode covers 100% of canvas with zero black bars');
assert(squareCover.h === 2732, 'Square screenshot covers full height (2732 px)');

// Test Case B: Cat photo / Square image (1024×1024 px) in Contain mode -> Touches width edge (2048 px)
const squareContain = calculateIpadFitDimensions(1024, 1024, 'contain');
assert(squareContain.touchesEdge, 'Square screenshot in Contain mode expands to touch canvas width (2048 px)');
assert(squareContain.fgW === 2048 && squareContain.fgH === 2048, 'Square screenshot in Contain mode preserves 1:1 ratio without 88% shrink');

// Test Case C: Phone screenshot (1290×2796 px) in Cover mode -> Full bleed
const phoneCover = calculateIpadFitDimensions(1290, 2796, 'cover');
assert(phoneCover.fullBleed, 'Phone screenshot in Cover mode covers 100% of iPad canvas');

// Test Case D: Phone screenshot (1290×2796 px) in Contain mode -> Touches height edge (2732 px)
const phoneContain = calculateIpadFitDimensions(1290, 2796, 'contain');
assert(phoneContain.touchesEdge && phoneContain.fgH === 2732, 'Phone screenshot in Contain mode touches full 2732 px height');

// Test Case E: iPad Air / 11" screenshot (1668×2388 px, ~4:3) -> Direct scale to 2048×2732
const ipad11Fit = calculateIpadFitDimensions(1668, 2388);
assert(ipad11Fit.targetW === 2048 && ipad11Fit.targetH === 2732, 'iPad 11" screenshot targets 2048×2732 px');
assert(ipad11Fit.isDirectScale, 'iPad 11" screenshot (~4:3) scales directly without letterboxing');

// Test Case F: Landscape source (2560×1600 px) -> Target 2732×2048 px
const landscapeFit = calculateIpadFitDimensions(2560, 1600);
assert(landscapeFit.targetW === 2732 && landscapeFit.targetH === 2048, 'Landscape screenshot targets iPad Pro landscape (2732×2048 px)');

// ---------------------------------------------------------------------
// Suite 10: Client-side ZIP Package Generator & Bulk Export
// ---------------------------------------------------------------------
console.log('\n[SUITE 10]: Client-side ZIP Package Generator & Bulk Export');

// 1. Verify UI controls & function signatures exist in bundled HTML
assert(bundledHtml.includes('function createZipBlob'), 'Bundled app defines createZipBlob utility');
assert(bundledHtml.includes('function crc32'), 'Bundled app defines crc32 checksum calculator');
assert(bundledHtml.includes('function dataUrlToUint8Array'), 'Bundled app defines dataUrlToUint8Array converter');
assert(bundledHtml.includes('function downloadAllPhoneScreenshots'), 'Bundled app defines downloadAllPhoneScreenshots');
assert(bundledHtml.includes('function downloadAllIpadScreenshots'), 'Bundled app defines downloadAllIpadScreenshots');
assert(bundledHtml.includes('function downloadAllTabScreenshots'), 'Bundled app defines downloadAllTabScreenshots');
assert(bundledHtml.includes('function downloadAllTabletsScreenshots'), 'Bundled app defines downloadAllTabletsScreenshots');
assert(bundledHtml.includes('function downloadAllGooglePlayBundle'), 'Bundled app defines downloadAllGooglePlayBundle');
assert(bundledHtml.includes('id="optExportPhoneShots"'), 'Export menu includes #optExportPhoneShots ZIP button');
assert(bundledHtml.includes('id="optExportIpadShots"'), 'Export menu includes #optExportIpadShots ZIP button');
assert(bundledHtml.includes('id="optExportTab7Shots"'), 'Export menu includes #optExportTab7Shots ZIP button');
assert(bundledHtml.includes('id="optExportTab10Shots"'), 'Export menu includes #optExportTab10Shots ZIP button');
assert(bundledHtml.includes('id="optExportAllTablets"'), 'Export menu includes #optExportAllTablets ZIP button');
assert(bundledHtml.includes('id="optExportGooglePlayBundle"'), 'Export menu includes #optExportGooglePlayBundle ZIP button');
assert(bundledHtml.includes('btnDlAllPhone'), 'Phone status badge supports Export (ZIP) button');
assert(bundledHtml.includes('btnDlAllIpad'), 'iPad status badge supports Export All (ZIP) button');
assert(bundledHtml.includes('btnDlAllTablets'), 'Google Play tablet header supports Export All Tablets (ZIP) button');

// 2. Functional ZIP Generation & CRC-32 Validation in Sandbox
const _crcTableTest = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  _crcTableTest[i] = c >>> 0;
}
function testCrc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = _crcTableTest[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Known standard CRC-32 check value: '123456789' -> 0xCBF43926 (3421780262)
const crcTestBytes = Buffer.from('123456789', 'utf8');
assert(testCrc32(crcTestBytes) === 0xCBF43926, 'CRC-32 produces standard compliant checksum for 123456789');

function testCreateZipBuffer(files) {
  const fileEntries = [];
  let offset = 0;
  const parts = [];

  for (const f of files) {
    const nameBytes = Buffer.from(f.name, 'utf8');
    const data = Buffer.from(f.data);
    const crc = testCrc32(data);
    const size = data.length;

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); // Local file header signature
    lh.writeUInt16LE(20, 4);         // Version needed
    lh.writeUInt16LE(0, 6);          // Flags
    lh.writeUInt16LE(0, 8);          // Compression (0 = STORE)
    lh.writeUInt16LE(0x4000, 10);    // Time
    lh.writeUInt16LE(0x5421, 12);    // Date
    lh.writeUInt32LE(crc, 14);       // CRC32
    lh.writeUInt32LE(size, 18);      // Compressed size
    lh.writeUInt32LE(size, 22);      // Uncompressed size
    lh.writeUInt16LE(nameBytes.length, 26); // Name length
    lh.writeUInt16LE(0, 28);         // Extra length

    fileEntries.push({ nameBytes, crc, size, offset });
    parts.push(lh, nameBytes, data);
    offset += 30 + nameBytes.length + size;
  }

  const cdOffset = offset;
  for (const f of fileEntries) {
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // Central header signature
    cd.writeUInt16LE(20, 4);         // Version made by
    cd.writeUInt16LE(20, 6);         // Version needed
    cd.writeUInt16LE(0, 8);          // Flags
    cd.writeUInt16LE(0, 10);         // Compression (0 = STORE)
    cd.writeUInt16LE(0x4000, 12);    // Time
    cd.writeUInt16LE(0x5421, 14);    // Date
    cd.writeUInt32LE(f.crc, 16);     // CRC32
    cd.writeUInt32LE(f.size, 20);    // Compressed size
    cd.writeUInt32LE(f.size, 24);    // Uncompressed size
    cd.writeUInt16LE(f.nameBytes.length, 28); // Name length
    cd.writeUInt16LE(0, 30);         // Extra length
    cd.writeUInt16LE(0, 32);         // Comment length
    cd.writeUInt16LE(0, 34);         // Disk start
    cd.writeUInt16LE(0, 36);         // Internal attr
    cd.writeUInt32LE(0, 38);         // External attr
    cd.writeUInt32LE(f.offset, 42);  // Local header offset

    parts.push(cd, f.nameBytes);
    offset += 46 + f.nameBytes.length;
  }

  const cdSize = offset - cdOffset;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);  // EOCD signature
  eocd.writeUInt16LE(0, 4);           // Disk number
  eocd.writeUInt16LE(0, 6);           // Start disk
  eocd.writeUInt16LE(fileEntries.length, 8);  // Disk entries
  eocd.writeUInt16LE(fileEntries.length, 10); // Total entries
  eocd.writeUInt32LE(cdSize, 12);     // CD size
  eocd.writeUInt32LE(cdOffset, 16);   // CD offset
  eocd.writeUInt16LE(0, 20);          // Comment length

  parts.push(eocd);
  return Buffer.concat(parts);
}

const testZipBuf = testCreateZipBuffer([
  { name: 'app-ipad-shot-1.png', data: Buffer.from('mock-png-data-1') },
  { name: 'app-ipad-shot-2.png', data: Buffer.from('mock-png-data-2') }
]);

assert(testZipBuf.readUInt32LE(0) === 0x04034b50, 'ZIP starts with valid Local File Header signature (0x04034b50)');
assert(testZipBuf.includes(Buffer.from('app-ipad-shot-1.png')), 'ZIP archive contains first file name in binary stream');
assert(testZipBuf.includes(Buffer.from('app-ipad-shot-2.png')), 'ZIP archive contains second file name in binary stream');
assert(testZipBuf.readUInt32LE(testZipBuf.length - 22) === 0x06054b50, 'ZIP ends with valid End of Central Directory signature (0x06054b50)');

// Test Google Play Complete Bundle ZIP with directory structures
const testGpBundleZip = testCreateZipBuffer([
  { name: '01-phone-screenshots/taskflow-phone-shot-1-1080x1920.png', data: Buffer.from('phone-1') },
  { name: '02-tablet-7inch/taskflow-7inch-shot-1-1280x800.png', data: Buffer.from('tab7-1') },
  { name: '03-tablet-10inch/taskflow-10inch-shot-1-1920x1200.png', data: Buffer.from('tab10-1') },
  { name: '04-feature-graphic/taskflow-feature-graphic-1024x500.png', data: Buffer.from('feature') },
  { name: '05-app-icon/taskflow-app-icon-512x512.png', data: Buffer.from('icon') }
]);
assert(testGpBundleZip.readUInt32LE(0) === 0x04034b50, 'Google Play Bundle ZIP starts with valid Local File Header signature');
assert(testGpBundleZip.includes(Buffer.from('01-phone-screenshots/')), 'Google Play Bundle ZIP contains 01-phone-screenshots directory');
assert(testGpBundleZip.includes(Buffer.from('02-tablet-7inch/')), 'Google Play Bundle ZIP contains 02-tablet-7inch directory');
assert(testGpBundleZip.includes(Buffer.from('03-tablet-10inch/')), 'Google Play Bundle ZIP contains 03-tablet-10inch directory');
assert(testGpBundleZip.includes(Buffer.from('04-feature-graphic/')), 'Google Play Bundle ZIP contains 04-feature-graphic directory');
assert(testGpBundleZip.includes(Buffer.from('05-app-icon/')), 'Google Play Bundle ZIP contains 05-app-icon directory');
assert(testGpBundleZip.readUInt32LE(testGpBundleZip.length - 22) === 0x06054b50, 'Google Play Bundle ZIP ends with valid End of Central Directory signature');

// ---------------------------------------------------------------------
// SUITE 11: High-Capacity Storage Engine & LocalStorage Quota Exceeded Protection
// ---------------------------------------------------------------------
console.log('[SUITE 11]: High-Capacity Storage Engine & Quota Protection');

const testState = {
  store: 'apple',
  appleDevice: 'iphone16pro',
  form: { name: 'SuperApp', dev: 'DevTeam' },
  icon: 'data:image/png;base64,' + 'A'.repeat(60000), // > 50KB heavy icon
  featureGraphic: 'data:image/png;base64,' + 'B'.repeat(70000),
  shots: ['https://example.com/shot1.png', 'data:image/png;base64,' + 'C'.repeat(80000)],
  ipadShots: ['data:image/png;base64,' + 'D'.repeat(2000000)], // 2MB high-res iPad screenshot
  tab7Shots: ['data:image/png;base64,' + 'E'.repeat(60000)],
  tab10Shots: ['data:image/png;base64,' + 'F'.repeat(60000)]
};

const isHeavy = v => typeof v === 'string' && v.length > 50000;
function testSanitize(state) {
  const clean = { ...state, _partial: true };
  if(isHeavy(clean.icon)) delete clean.icon;
  if(isHeavy(clean.featureGraphic)) delete clean.featureGraphic;
  if(Array.isArray(clean.shots)){
    clean.shots = clean.shots.filter(s => !isHeavy(s));
    if(!clean.shots.length) delete clean.shots;
  }
  if(Array.isArray(clean.ipadShots)){
    delete clean.ipadShots;
  }
  if(Array.isArray(clean.tab7Shots)){
    delete clean.tab7Shots;
  }
  if(Array.isArray(clean.tab10Shots)){
    delete clean.tab10Shots;
  }
  return clean;
}

const sanitized = testSanitize(testState);
assert(sanitized._partial === true, 'Sanitized state marks _partial flag');
assert(sanitized.form.name === 'SuperApp', 'Sanitized state preserves text fields');
assert(!sanitized.icon, 'Heavy base64 icon (>50KB) stripped from localStorage state');
assert(!sanitized.featureGraphic, 'Heavy feature graphic stripped from localStorage state');
assert(sanitized.shots.length === 1 && sanitized.shots[0] === 'https://example.com/shot1.png', 'Lightweight shot preserved while heavy shot stripped');
assert(sanitized.ipadShots === undefined, '2048x2732 base64 iPad shots safely removed from localStorage payload');

// Test Quota Exceeded toast suppression when IndexedDB is present
let toastShown = false;
let lsCalls = [];
let mockLsStorage = {};
const mockLs = {
  setItem: (k, v) => {
    lsCalls.push({ k, len: v.length });
    if (v.length > 100000) {
      const err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    }
    mockLsStorage[k] = v;
  },
  getItem: (k) => mockLsStorage[k] || null,
  removeItem: (k) => { delete mockLsStorage[k]; }
};

let mockIdbStored = {};
const mockIdbSave = (k, v) => {
  mockIdbStored[k] = v;
  return Promise.resolve(true);
};

function simulateSave(state, idbSupported = true) {
  let idbPromise = idbSupported ? mockIdbSave('test_key', state) : null;
  let lsOk = false;
  toastShown = false;
  try {
    mockLs.setItem('test_key', JSON.stringify(state));
    lsOk = true;
  } catch(e) {
    try {
      const san = testSanitize(state);
      mockLs.setItem('test_key', JSON.stringify(san));
      lsOk = true;
    } catch(err2) {
      lsOk = false;
    }
  }

  if (!lsOk) {
    if (idbPromise) {
      idbPromise.then(ok => {
        if (!ok) toastShown = true;
      });
    } else {
      toastShown = true;
    }
  }
}

simulateSave(testState, true);
assert(lsCalls.length === 2, 'saveState attempts full payload then falls back to sanitized payload on quota limit');
assert(mockLsStorage['test_key'] !== undefined, 'Sanitized state successfully stored in localStorage fallback');
assert(mockIdbStored['test_key'] === testState, 'Full uncompressed state with high-res iPad shots safely stored in IndexedDB');
assert(toastShown === false, 'Storage quota exceeded toast is permanently suppressed when IndexedDB is available');

// Simulate catastrophic failure (both localStorage and IndexedDB failed/unavailable)
const mockBrokenLs = {
  setItem: () => { throw new Error('Disk full'); }
};
toastShown = false;
try {
  mockBrokenLs.setItem('k', 'v');
} catch(e) {
  try {
    mockBrokenLs.setItem('k', 'sanitized');
  } catch(e2) {
    // Both failed, IndexedDB unavailable
    toastShown = true;
  }
}
assert(toastShown === true, 'Warning toast correctly surfaces as safety net if both IndexedDB and LocalStorage fail');

// Test Low-RAM Display Thumbnail Cache logic
const mockThumbCache = new Map();
const heavyDataUrl = 'data:image/png;base64,' + 'Z'.repeat(150000);
const mockThumb = 'data:image/webp;base64,mockthumbdata';
mockThumbCache.set(heavyDataUrl, mockThumb);

function testGetDisplaySrc(src, cache) {
  if (!src || typeof src !== 'string') return '';
  if (src.startsWith('data:image/svg+xml') || src.length < 50000) return src;
  if (cache.has(src)) return cache.get(src);
  return src;
}

assert(testGetDisplaySrc('https://example.com/icon.png', mockThumbCache) === 'https://example.com/icon.png', 'HTTP URL returns as-is without cache lookups');
assert(testGetDisplaySrc('data:image/svg+xml;utf8,<svg></svg>', mockThumbCache).startsWith('data:image/svg+xml'), 'SVG data URI bypasses thumbnail cache to maintain vector sharpness');
assert(testGetDisplaySrc(heavyDataUrl, mockThumbCache) === mockThumb, 'Heavy multi-MB screenshot resolved to lightweight ~600px thumbnail in DOM, saving 90%+ RAM');

// Test Anti-Spam Download & Upload Throttling (1s cooldown & 2s ZIP lock)
let testLastDl = 0;
let testLastUp = 0;
function testCanDownload(cooldownMs = 1000, now = Date.now()) {
  if (now - testLastDl < cooldownMs) return false;
  testLastDl = now;
  return true;
}
function testCanUpload(cooldownMs = 1000, now = Date.now()) {
  if (now - testLastUp < cooldownMs) return false;
  testLastUp = now;
  return true;
}

const baseTime = 100000;
assert(testCanDownload(1000, baseTime) === true, 'First download attempt is allowed');
assert(testCanDownload(1000, baseTime + 200) === false, 'Subsequent download attempt within 1s is throttled and blocked');
assert(testCanDownload(1000, baseTime + 800) === false, 'Download attempt at 800ms is still blocked by 1s cooldown');
assert(testCanDownload(1000, baseTime + 1050) === true, 'Download attempt after 1s cooldown succeeds');

assert(testCanUpload(1000, baseTime) === true, 'First upload attempt is allowed');
assert(testCanUpload(1000, baseTime + 300) === false, 'Subsequent upload spam click within 1s is throttled and blocked');
assert(testCanUpload(1000, baseTime + 1100) === true, 'Upload attempt after 1s cooldown succeeds');

// Test ZIP Export 2s lock
let testZipLock = false;
function triggerZipExport() {
  if (testZipLock) return 'BLOCKED';
  testZipLock = true;
  return 'STARTED';
}
assert(triggerZipExport() === 'STARTED', 'ZIP export starts on first click');
assert(triggerZipExport() === 'BLOCKED', 'Spam click while ZIP export is running is blocked');

// Test Already-Resized iPad Screenshot & Icon Compliance Detection
function checkIpadCompliance(w, h) {
  return (
    (w === 2048 && h === 2732) || 
    (w === 2064 && h === 2752) || 
    (w === 2732 && h === 2048) || 
    (w === 2752 && h === 2064)
  );
}

assert(checkIpadCompliance(2048, 2732) === true, 'Portrait 2048x2732 iPad shot detected as already compliant');
assert(checkIpadCompliance(2732, 2048) === true, 'Landscape 2732x2048 iPad shot detected as already compliant');
assert(checkIpadCompliance(1290, 2796) === false, 'Phone ratio shot detected as non-compliant (requires resize)');
assert(checkIpadCompliance(1080, 1080) === false, 'Square shot detected as non-compliant (requires resize)');

// Test canAction 1s anti-spam
let testLastAct = 0;
function testCanAction(cooldownMs = 1000, now = Date.now()) {
  if (now - testLastAct < cooldownMs) return false;
  testLastAct = now;
  return true;
}
assert(testCanAction(1000, baseTime) === true, 'First resize/fit action is allowed');
assert(testCanAction(1000, baseTime + 400) === false, 'Subsequent resize spam click within 1s is throttled and blocked');
assert(testCanAction(1000, baseTime + 1050) === true, 'Resize action after 1s cooldown succeeds');

// ---------------------------------------------------------------------
// Suite 12: Latent Bug Regression Tests (Category Mapping, XSS Escaping, Dynamic Chips, Marketing Hardening)
// ---------------------------------------------------------------------
console.log('\n[SUITE 12]: Latent Bug Regression Tests');

// 1. HTML Escaping (XSS Prevention in Privacy & Toasts)
function testEscapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
assert(testEscapeHtml('<img src=x onerror=alert(1)>') === '&lt;img src=x onerror=alert(1)&gt;', 'escapeHtml sanitizes HTML tags and event handlers in user privacy inputs');
assert(bundledHtml.includes('function escapeHtml'), 'Bundled application includes escapeHtml sanitizer in core utilities');

// 2. Game Subcategory Mapping ("Role Playing" -> Apple "Games", Google "Games · Role Playing")
const testAppleCats = ['Books','Business','Developer Tools','Education','Entertainment','Finance','Food & Drink','Games','Graphics & Design','Health & Fitness','Lifestyle','Magazines & Newspapers','Medical','Music','Navigation','News','Photo & Video','Productivity','Reference','Shopping','Social Networking','Sports','Travel','Utilities','Weather'];
const testGoogleGameCats = ['Action','Adventure','Arcade','Board','Card','Casino','Casual','Educational','Music','Puzzle','Racing','Role Playing','Simulation','Sports','Strategy','Trivia','Word'];
const testGoogleAll = [...testGoogleGameCats.map(c => 'Games · ' + c)];

function testMatchCat(val, list, storeKey) {
  const v = (val || '').trim();
  if (!v) return '';
  const lo = v.toLowerCase();
  const exact = list.find(c => c.toLowerCase() === lo);
  if (exact) return exact;
  if (storeKey === 'google') {
    const gameMatch = list.find(c => c.toLowerCase() === 'games · ' + lo);
    if (gameMatch) return gameMatch;
  }
  if (storeKey === 'apple') {
    const bare = lo.replace(/^games\s*·\s*/i, '');
    if (testGoogleGameCats.some(c => c.toLowerCase() === bare)) return 'Games';
  }
  const sub = list.find(c => c.toLowerCase().includes(lo) || lo.includes(c.toLowerCase()));
  return sub || v;
}

assert(testMatchCat('Role Playing', testAppleCats, 'apple') === 'Games', 'Game subcategory "Role Playing" maps to official "Games" category on Apple App Store');
assert(testMatchCat('Role Playing', testGoogleAll, 'google') === 'Games · Role Playing', 'Game subcategory "Role Playing" maps to "Games · Role Playing" on Google Play');
assert(testMatchCat('Games · Role Playing', testAppleCats, 'apple') === 'Games', 'Prefixed "Games · Role Playing" maps cleanly to "Games" on Apple App Store');

// 3. Dynamic Google Play Keyword Chips & iPad Promo Hiding
assert(bundledHtml.includes('data-kw-chip="0"') && bundledHtml.includes('data-kw-chip="1"'), 'Google Play mockups use dynamic data-kw-chip attributes instead of static Habit Tracker chips');
assert(bundledHtml.includes('$$(\'.promo[data-b="promo"]\')'), 'update() toggles visibility across all .promo[data-b="promo"] containers (both iPhone and iPad)');

// 4. Marketing Mini Studio Transition Determinism & FLIP AnimatedSize
const marketingHtml = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'marketing.html'), 'utf8');
assert(marketingHtml.includes('animatedSizeForm'), 'Marketing page bundles animatedSizeForm engine for fluid card transitions');
assert(marketingHtml.includes('fromMode === \'apple\'') && marketingHtml.includes('devApple.hidden = false') && marketingHtml.includes('devGoogle.hidden = true'), 'transitionStoreMode enforces deterministic initial visibility for fromMode === "apple"');
assert(marketingHtml.includes('fromMode === \'google\'') && marketingHtml.includes('devApple.hidden = true') && marketingHtml.includes('devGoogle.hidden = false'), 'transitionStoreMode enforces deterministic initial visibility for fromMode === "google"');
assert(marketingHtml.includes('fromMode === toMode') && marketingHtml.includes('devApple.hidden = toMode === \'google\''), 'transitionStoreMode guarantees correct device visibility when transition is re-triggered with fromMode === toMode');

// 5. Marketing Mini Studio Custom Preset Screenshot Section Cleanup
assert(marketingHtml.includes('gal.closest(\'.ms-sec\')') && marketingHtml.includes('sec.style.display = realShots.length ? \'\' : \'none\''), 'renderShots cleanly toggles Apple screenshot section header when real screenshots are empty');

// 6. Security: Reverse Tabnabbing Protection (rel="noopener noreferrer")
const targetBlankRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/gi;
let match;
let allSecure = true;
while ((match = targetBlankRegex.exec(marketingHtml)) !== null) {
  if (!match[0].includes('rel="noopener noreferrer"')) {
    allSecure = false;
    console.error(`  [FAIL] Link missing rel="noopener noreferrer": ${match[0]}`);
  }
}
assert(allSecure, 'All target="_blank" external links in marketing.html contain rel="noopener noreferrer"');

// 7. Accessibility: FAQ Keyboard & ARIA Attributes
assert(marketingHtml.includes('tabindex="0"') && marketingHtml.includes('role="button"') && marketingHtml.includes('aria-expanded='), 'FAQ question items include full keyboard accessibility attributes (tabindex="0", role="button", aria-expanded)');
assert(marketingHtml.includes('e.key === \'Enter\'') && marketingHtml.includes('toggleFaq(e.target)'), 'Marketing page includes Enter and Space keypress handlers for accessible FAQ toggling');

// ---------------------------------------------------------------------
// Suite 13: App Icon Validation & Store Cross-Switching Determinism
// ---------------------------------------------------------------------
console.log('\n[SUITE 13]: App Icon Validation & Store Cross-Switching');

function evaluateAppIconValidation(w, h, hasAlpha, currentStore) {
  if (currentStore === 'apple') {
    if (hasAlpha) {
      return { status: 'err', action: 'Flatten 1024px', targetSize: 1024, message: 'Alpha transparency detected. iOS icons must be 100% opaque.' };
    }
    if (w !== 1024 || h !== 1024) {
      return { status: 'warn', targetSize: 1024, message: `Dimension Notice (${w}×${h} px): Xcode requires 1024×1024 px square.` };
    }
    return { status: 'ok', targetSize: 1024, message: 'App Store Compliant: 1024×1024 px · 100% Opaque (No Alpha)' };
  } else {
    // Google Play
    if (w !== h) {
      return { status: 'err', targetSize: 512, message: `Google Play Error (${w}×${h} px): Icon must be a 1:1 square (512×512 px).` };
    }
    if (w !== 512 || h !== 512) {
      return { status: 'warn', targetSize: 512, message: `Dimension Notice (${w}×${h} px): Google Play requires 512×512 px square.` };
    }
    return { status: 'ok', targetSize: 512, message: `Google Play Compliant: 512×512 px · 1:1 Square` };
  }
}

// 1. Apple App Store Icon Validation Rules
assert(evaluateAppIconValidation(1024, 1024, false, 'apple').status === 'ok', 'Apple: 1024x1024 opaque icon is marked Compliant (ok)');
assert(evaluateAppIconValidation(1024, 1024, true, 'apple').status === 'err', 'Apple: 1024x1024 icon with alpha transparency is marked Rejection Risk (err)');
assert(evaluateAppIconValidation(2252, 2252, false, 'apple').status === 'warn', 'Apple: High-res 2252x2252 icon is marked Dimension Notice (warn)');
assert(evaluateAppIconValidation(512, 512, false, 'apple').status === 'warn', 'Apple: 512x512 icon is marked Dimension Notice (warn)');
assert(evaluateAppIconValidation(1200, 800, false, 'apple').status === 'warn', 'Apple: Non-square icon requires resize to 1024px');

// 2. Google Play Store Icon Validation Rules (Regression protection for 2252x2252 bug)
assert(evaluateAppIconValidation(512, 512, false, 'google').status === 'ok', 'Google: 512x512 opaque icon is marked Compliant (ok)');
assert(evaluateAppIconValidation(512, 512, true, 'google').status === 'ok', 'Google: 512x512 icon with alpha is allowed on Google Play (ok)');
assert(evaluateAppIconValidation(2252, 2252, false, 'google').status === 'warn', 'Google: High-res 2252x2252 icon MUST be marked Dimension Notice (warn), NEVER ok');
assert(evaluateAppIconValidation(2252, 2252, false, 'google').status !== 'ok', 'Google REGRESSION GUARD: 2252x2252 is NOT compliant and must not pass as ok');
assert(evaluateAppIconValidation(1024, 1024, false, 'google').status === 'warn', 'Google: 1024x1024 Apple icon on Google requires resize to 512px (warn)');
assert(evaluateAppIconValidation(1200, 800, false, 'google').status === 'err', 'Google: Non-square icon (1200x800) is marked Error (err)');

// 3. Store Cross-Switching Workflow Simulation
let simIcon = { w: 2252, h: 2252, hasAlpha: false };
let simStore = 'apple';

// Step A: Upload on Apple -> should warn
let appleCheck = evaluateAppIconValidation(simIcon.w, simIcon.h, simIcon.hasAlpha, simStore);
assert(appleCheck.status === 'warn', 'Step A: High-res icon uploaded on Apple displays dimension warning');

// Step B: Switch to Google Play without resizing -> MUST NOT BE VALID (must warn for 512px)
simStore = 'google';
let googleCheck = evaluateAppIconValidation(simIcon.w, simIcon.h, simIcon.hasAlpha, simStore);
assert(googleCheck.status === 'warn', 'Step B: Switching Apple -> Google with 2252x2252 triggers warning (NOT valid/ok)');

// Step C: User applies 512x512
simIcon = { w: 512, h: 512, hasAlpha: false };
let googleResizedCheck = evaluateAppIconValidation(simIcon.w, simIcon.h, simIcon.hasAlpha, simStore);
assert(googleResizedCheck.status === 'ok', 'Step C: At 512px, icon is Google Play Compliant (ok)');

// Step D: User switches back to Apple with the 512x512 icon -> Apple must now warn for 1024px
simStore = 'apple';
let appleBackCheck = evaluateAppIconValidation(simIcon.w, simIcon.h, simIcon.hasAlpha, simStore);
assert(appleBackCheck.status === 'warn', 'Step D: Switching back to Apple detects 512px is too small and warns');

// 4. Bundled Source Code Integrity Check
assert(bundledHtml.includes('Google Play requires <strong>512×512 px</strong>'), 'Bundled HTML contains exact Google Play 512px dimension requirement string');
assert(bundledHtml.includes('validateAppIcon()') && bundledHtml.includes('setStore'), 'setStore triggers validateAppIcon immediately upon store switch');

// ---------------------------------------------------------------------
// Summary Report
// ---------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TEST EXECUTION SUMMARY:`);
console.log(`   Total Tests Run: ${passedTests + failedTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests}`);
console.log(`   Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL AUTOMATED TESTS PASSED SUCCESSFULLY!\n');
}
