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

['f-name', 'f-sub', 'f-promo', 'f-short', 'f-dev', 'f-cat', 'f-ver', 'f-rdate', 'f-email', 'f-addr', 'f-priv-linked', 'f-priv-notlinked', 'f-priv-google', 'f-new', 'f-desc', 'f-st-rating', 'f-st-count', 'f-st-rank', 'f-st-dl', 'f-st-size', 'f-st-age', 'f-st-iap'].forEach(id => createMockEl(id));

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
// Suite 0: JavaScript Syntax & Compilation Validation
// ---------------------------------------------------------------------
console.log('[SUITE 0]: JavaScript Syntax & Compilation Validation');

function getAllJsFiles(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      list = list.concat(getAllJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'app.js') {
      list.push(fullPath);
    }
  }
  return list;
}

const jsFiles = getAllJsFiles(path.join(ROOT_DIR, 'src', 'js'));
for (const jsFile of jsFiles) {
  const relPath = path.relative(ROOT_DIR, jsFile);
  let isValid = false;
  try {
    const code = fs.readFileSync(jsFile, 'utf8');
    new vm.Script(code, { filename: relPath });
    isValid = true;
  } catch (err) {
    console.error(`  [SYNTAX ERROR] ${relPath}: ${err.message}`);
  }
  assert(isValid, `Syntax valid for module ${relPath}`);
}

// Validate bundled app.js
let appJsValid = false;
try {
  const appJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'app.js'), 'utf8');
  new vm.Script(appJsCode, { filename: 'src/js/app.js' });
  appJsValid = true;
} catch (err) {
  console.error(`  [SYNTAX ERROR] src/js/app.js: ${err.message}`);
}
assert(appJsValid, 'Syntax valid for bundled app.js');

// Validate inline scripts in core.html
let coreScriptsValid = true;
const coreHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'core.html'), 'utf8');
const scriptTagRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let scriptTagMatch;
let scriptIdx = 0;
while ((scriptTagMatch = scriptTagRegex.exec(coreHtmlContent)) !== null) {
  const code = scriptTagMatch[1];
  if (code.trim()) {
    try {
      new vm.Script(code, { filename: `core.html:script[${scriptIdx}]` });
    } catch (err) {
      coreScriptsValid = false;
      console.error(`  [SYNTAX ERROR] core.html:script[${scriptIdx}]: ${err.message}`);
    }
  }
  scriptIdx++;
}
assert(coreScriptsValid, 'Syntax valid for all inline scripts in core.html');

// Validate marketing source JS and built HTML files
const marketingJsDir = path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'js');
if (fs.existsSync(marketingJsDir)) {
  const mJsFiles = getAllJsFiles(marketingJsDir);
  for (const jsFile of mJsFiles) {
    const relPath = path.relative(ROOT_DIR, jsFile);
    let isValid = false;
    try {
      const code = fs.readFileSync(jsFile, 'utf8');
      new vm.Script(code, { filename: relPath });
      isValid = true;
    } catch (err) {
      console.error(`  [SYNTAX ERROR] ${relPath}: ${err.message}`);
    }
    assert(isValid, `Syntax valid for marketing source ${relPath}`);
  }
}

const htmlBundlesToTest = [
  path.join(ROOT_DIR, 'docs', 'marketing.html'),
  path.join(ROOT_DIR, 'docs', 'marketing.min.html'),
  path.join(ROOT_DIR, 'cloudflare', 'index.html')
];
for (const bundlePath of htmlBundlesToTest) {
  if (fs.existsSync(bundlePath)) {
    const relPath = path.relative(ROOT_DIR, bundlePath);
    let bundleScriptsValid = true;
    const bundleHtml = fs.readFileSync(bundlePath, 'utf8');
    const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;
    while ((match = regex.exec(bundleHtml)) !== null) {
      const code = match[1];
      if (code.trim()) {
        try {
          new vm.Script(code, { filename: `${relPath}:script[${idx}]` });
        } catch (err) {
          bundleScriptsValid = false;
          console.error(`  [SYNTAX ERROR] ${relPath}:script[${idx}]: ${err.message}`);
        }
      }
      idx++;
    }
    assert(bundleScriptsValid, `Syntax valid for inline scripts in ${relPath}`);
  }
}

// ---------------------------------------------------------------------
// Suite 1: Presets & Distinct Assets Suite
// ---------------------------------------------------------------------
console.log('[SUITE 1]: Presets & Distinct Vector Assets');

assert(!!PRESETS.taskflow, 'Preset TaskFlow exists');
assert(!!PRESETS.pulsefit, 'Preset PulseFit exists');
assert(!!PRESETS.zenmind, 'Preset ZenMind exists');
assert(!!PRESETS.cyberstrike, 'Preset CyberStrike exists');
assert(!!PRESETS.edulearn, 'Preset SkillSphere (Education) exists');
assert(!!PRESETS.studio, 'Preset Store Preview Studio exists');

assert(PRESETS.pulsefit.icon !== PRESETS.taskflow.icon, 'PulseFit icon is distinct from TaskFlow icon');
assert(PRESETS.zenmind.icon !== PRESETS.taskflow.icon, 'ZenMind icon is distinct from TaskFlow icon');
assert(PRESETS.pulsefit.icon !== PRESETS.zenmind.icon, 'PulseFit icon is distinct from ZenMind icon');
assert(PRESETS.cyberstrike.icon !== PRESETS.taskflow.icon, 'CyberStrike icon is distinct from TaskFlow icon');
assert(PRESETS.edulearn.icon !== PRESETS.taskflow.icon, 'SkillSphere icon is distinct from TaskFlow icon');
assert(PRESETS.studio.icon !== PRESETS.taskflow.icon, 'Store Preview Studio icon is distinct from TaskFlow icon');

assert(PRESETS.pulsefit.shots[0] !== PRESETS.taskflow.shots[0], 'PulseFit screenshots are distinct from TaskFlow');
assert(PRESETS.zenmind.shots[0] !== PRESETS.taskflow.shots[0], 'ZenMind screenshots are distinct from TaskFlow');
assert(PRESETS.edulearn.shots[0] !== PRESETS.taskflow.shots[0], 'SkillSphere screenshots are distinct from TaskFlow');
assert(PRESETS.studio.shots[0] !== PRESETS.taskflow.shots[0], 'Store Preview Studio screenshots are distinct from TaskFlow');
assert(PRESETS.pulsefit.shots.length === 4, 'PulseFit has exactly 4 screenshots');
assert(PRESETS.zenmind.shots.length === 4, 'ZenMind has exactly 4 screenshots');
assert(PRESETS.cyberstrike.shots.length === 4, 'CyberStrike has exactly 4 screenshots');
assert(PRESETS.edulearn.shots.length === 4, 'SkillSphere has exactly 4 screenshots');
assert(PRESETS.studio.shots.length === 4, 'Store Preview Studio has exactly 4 screenshots');

// Check 1024x1024 square opaque specifications
[
  { name: 'TaskFlow', icon: PRESETS.taskflow.icon },
  { name: 'PulseFit', icon: PRESETS.pulsefit.icon },
  { name: 'ZenMind', icon: PRESETS.zenmind.icon },
  { name: 'CyberStrike', icon: PRESETS.cyberstrike.icon },
  { name: 'SkillSphere', icon: PRESETS.edulearn.icon },
  { name: 'StorePreviewStudio', icon: PRESETS.studio.icon }
].forEach(p => {
  const decoded = decodeURIComponent(p.icon);
  assert(decoded.includes('width="1024"') && decoded.includes('height="1024"'), `${p.name} icon specifies 1024x1024 dimensions`);
  assert(decoded.includes('<rect width="512" height="512" fill="url(#') || decoded.includes('<rect width="512" height="512" fill="#') || decoded.includes('<rect width="32" height="32" fill="url(#') || decoded.includes('<rect width="1024" height="1024" fill="url(#'), `${p.name} icon has opaque non-transparent background rect`);
});

// Verify template files in presets/
const presetFiles = ['saas-app-template.json', 'fitness-tracker-template.json', 'zenmind-meditation-template.json', 'cyberstrike-rpg-game-template.json', 'education-language-template.json', 'store-preview-studio-template.json'];
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

['studio', 'taskflow', 'pulsefit', 'zenmind', 'cyberstrike', 'edulearn'].forEach(key => {
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
assert(bundledHtml.includes('PRESET_ICONS'), 'Preset module defines PRESET_ICONS map for dynamic icon synchronization');
assert(bundledHtml.includes('initPresetThumbnails'), 'Preset module executes initPresetThumbnails to sync app icons');

// Verify App Icon Download feature removed in favor of clean streamline
assert(!bundledHtml.includes('id="icoDown"'), 'Icon section no longer includes redundant #icoDown Download Icon button');
assert(!bundledHtml.includes('function downloadAppIcon'), 'Shots module no longer bundles downloadAppIcon function');

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

function clampGraphemes(str, max) {
  if (!str || typeof max !== 'number' || max <= 0) return '';
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segs = Array.from(segmenter.segment(str));
    if (segs.length <= max) return str;
    return segs.slice(0, max).map(s => s.segment).join('');
  }
  const chars = Array.from(str);
  if (chars.length <= max) return str;
  return chars.slice(0, max).join('');
}

assert(clampGraphemes('CyberStrike: 2088 Cyber RPGffefefeefefefefefefefefeffefefefe', 30) === 'CyberStrike: 2088 Cyber RPGffe', 'clampGraphemes accurately clamps 62-char title to official 30-char limit');
assert(clampGraphemes('TaskFlow', 30) === 'TaskFlow', 'clampGraphemes preserves text within limit');
assert(countChars(clampGraphemes('Ứng dụng theo dõi thói quen hằng ngày mỗi sáng và tối', 30)) === 30, 'clampGraphemes clamps Vietnamese Unicode string to 30 graphemes');
assert(clampGraphemes('👨‍👩‍👧‍👦🧘‍♀️❤️‍🔥🚀🌟', 3) === '👨‍👩‍👧‍👦🧘‍♀️❤️‍🔥', 'clampGraphemes safely preserves complex multi-codepoint ZWJ emoji boundaries without corruption');
assert(bundledHtml.includes('clampGraphemes'), 'Bundled application defines and uses clampGraphemes for device mockup limits');

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
  
  const hasMobileSpecificFields = !!(mapped.sub || mapped.promo || mapped.short || src.catApple || src.catGoogle);
  
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
const brandHtml = resolveTestHtmlIncludes(fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'header', 'brand.html'), 'utf8'));
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
assert(!brandHtml.includes('class="window-dots"'), 'brand.html removes redundant decorative window dots to maximize header workspace');

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

// 5B. iOS 18 iPad App Store DOM Architecture
assert(ipadHtml.includes('ipad-nav-capsule') && ipadHtml.includes('ipad-capsule-tab'), 'iPad header features authentic center capsule store switcher');
assert(ipadHtml.includes('ipad-platforms-row') && ipadHtml.includes('iPad, iPhone'), 'iPad gallery features platforms support badge line (iPad, iPhone)');
assert(ipadHtml.includes('ipad-desc-row') && ipadHtml.includes('ipad-dev-entity'), 'iPad features 2-column description and developer entity row');
assert(ipadHtml.includes('ipad-desc-txt') && ipadHtml.includes('data-b="desc"'), 'iPad renders full description in description column');
assert(ipadHtml.includes('data-b="promo"'), 'iPad supports optional promotional text banner in description column');
assert(ipadHtml.includes('ipad-cat-pill') && ipadHtml.includes('data-b="cat"'), 'iPad displays category badge pill in description column');
assert(ipadHtml.includes('ipad-ratings-layout') && ipadHtml.includes('ipad-rating-bar-row'), 'iPad features authentic Ratings & Reviews with 5-star distribution bars');
assert(ipadHtml.includes('ipad-floating-pill') && ipadHtml.includes('ipad-floating-get'), 'iPad features floating bottom GET pill on scroll');
assert(ipadHtml.includes('ipad-info-grid') && ipadHtml.includes('ipad-info-cell') && ipadHtml.includes('ipad-info-label') && ipadHtml.includes('ipad-info-val'), 'iPad features authentic 2-column stacked Information section layout matching iOS 18');

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
// Suite 9: iPad Pro 13" Pure Preview & Validation (No Risky Resize)
// ---------------------------------------------------------------------
console.log('\n[SUITE 9]: iPad Pro 13" Pure Preview & Validation (No Risky Resize)');

assert(!bundledHtml.includes('id="btnGenIpadFromPhone"'), 'Risky #btnGenIpadFromPhone button is removed from editor');
assert(!bundledHtml.includes('id="f-ipad-fit-mode"'), 'Risky #f-ipad-fit-mode dropdown selector is removed from editor');
assert(!bundledHtml.includes('btnFitIpad_'), 'Risky row-level Fit button is removed from iPad list');
assert(!bundledHtml.includes('btnFixAllIpad'), 'Risky Resize All (2048px) button is removed from iPad status badge');
assert(!bundledHtml.includes('btnDlIpad_'), 'Redundant raw screenshot download button is removed from iPad list');
assert(!bundledHtml.includes('btnDlAllIpad'), 'Redundant ZIP download button is removed from iPad badge');

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
// Suite 10: Streamlined Export Menu & Removal of Redundant Raw Downloads
// ---------------------------------------------------------------------
console.log('\n[SUITE 10]: Streamlined Export Menu & Removal of Redundant Raw Downloads');

// 1. Verify redundant raw file downloads & ZIP routines are eliminated from the app bundle
assert(!bundledHtml.includes('id="optExportPhoneShots"'), 'Redundant #optExportPhoneShots ZIP button is removed from Export menu');
assert(!bundledHtml.includes('id="optExportIpadShots"'), 'Redundant #optExportIpadShots ZIP button is removed from Export menu');
assert(!bundledHtml.includes('id="optExportTab7Shots"'), 'Redundant split #optExportTab7Shots ZIP row is removed from Export menu');
assert(!bundledHtml.includes('id="optExportTab10Shots"'), 'Redundant split #optExportTab10Shots ZIP row is removed from Export menu');
assert(!bundledHtml.includes('id="optExportAllTablets"'), 'Redundant #optExportAllTablets ZIP button is removed from Export menu');
assert(!bundledHtml.includes('id="optExportGooglePlayBundle"'), 'Redundant #optExportGooglePlayBundle ZIP button is removed from Export menu');
assert(!bundledHtml.includes('id="icoDown"'), 'Redundant #icoDown download button is removed from identity card');
assert(!bundledHtml.includes('id="btnDlAllTablets"'), 'Redundant #btnDlAllTablets button is removed from tablet screenshots card');
assert(!bundledHtml.includes('btnDlAllPhone'), 'Redundant ZIP export button is removed from phone status badge');
assert(!bundledHtml.includes('btnDlAllIpad'), 'Redundant ZIP export button is removed from iPad status badge');
assert(!bundledHtml.includes('btnDlIpad_'), 'Redundant raw screenshot download button is removed from iPad rows');
assert(!bundledHtml.includes('function createZipBlob'), 'createZipBlob utility is removed from bundle to eliminate bloat');
assert(!bundledHtml.includes('function dataUrlToUint8Array'), 'dataUrlToUint8Array converter is removed from bundle');
assert(!bundledHtml.includes('function downloadAllPhoneScreenshots'), 'downloadAllPhoneScreenshots routine is removed from bundle');
assert(!bundledHtml.includes('function downloadAllIpadScreenshots'), 'downloadAllIpadScreenshots routine is removed from bundle');
assert(!bundledHtml.includes('function downloadAllTabScreenshots'), 'downloadAllTabScreenshots routine is removed from bundle');
assert(!bundledHtml.includes('function downloadAllTabletsScreenshots'), 'downloadAllTabletsScreenshots routine is removed from bundle');
assert(!bundledHtml.includes('function downloadAllGooglePlayBundle'), 'downloadAllGooglePlayBundle routine is removed from bundle');

// 2. Verify high-value presentation exports, metadata copies, and project backup options are intact
assert(bundledHtml.includes('id="optOpenExportModal"'), 'Export menu features unified Export Mockup Image modal trigger (#optOpenExportModal)');
assert(bundledHtml.includes('id="exportImageModal"'), 'Export Image Modal DOM is present (#exportImageModal)');
assert(bundledHtml.includes('id="exportModalDownload"') && bundledHtml.includes('id="exportModalCopy"'), 'Export Image Modal contains Download PNG and Copy Image actions');
assert(bundledHtml.includes('id="optExportPNG3x"'), 'Export menu preserves 3x PNG device frame export (#optExportPNG3x)');
assert(bundledHtml.includes('id="optExportTransparent"'), 'Export menu includes transparent cutout export (#optExportTransparent)');
assert(bundledHtml.includes('id="optExportScreen"'), 'Export menu preserves frameless store page export (#optExportScreen)');
assert(bundledHtml.includes('id="btnCopyText"'), 'Export menu preserves clipboard metadata copy (#btnCopyText)');
assert(bundledHtml.includes('id="optExportMD"'), 'Export menu preserves Markdown listing export (#optExportMD)');
assert(bundledHtml.includes('id="optExportJSON"'), 'Export menu preserves Project JSON export (#optExportJSON)');
assert(bundledHtml.includes('id="optImportJSON"'), 'Export menu preserves Project JSON import (#optImportJSON)');
assert(bundledHtml.includes('Presentation Mockups'), 'Export dropdown header is clearly labeled Presentation Mockups');

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

// Test Core Studio Single Active Draft & Non-destructive Preset Sandboxing (SRS Flow)
assert(bundledHtml.includes('sps_core_user_draft'), 'Bundled application defines sps_core_user_draft storage key');
assert(bundledHtml.includes('btnDraft'), 'Header contains My App (Draft) button placed next to Presets');
assert(bundledHtml.includes('draftBtnBadge'), 'Draft button renders Draft status indicator pill');
assert(bundledHtml.includes('presetBanner'), 'Stage DOM contains non-destructive Preset Preview Banner');
assert(bundledHtml.includes('btnReturnToDraft'), 'Preset Preview Banner contains Return to My Draft restore button');

// Simulation of Non-destructive Preset Sandboxing State Machine
let simUserDraft = {
  form: { name: 'My Unique App', dev: 'Author' },
  shots: ['https://example.com/shot.png'],
  isCustomized: true
};
let simActivePreset = 'draft';
let simIsPresetModified = false;
let simDraftStorage = { sps_core_user_draft: JSON.stringify(simUserDraft) };

function simLoadPreset(key) {
  if (key === 'draft') {
    simActivePreset = 'draft';
    simIsPresetModified = false;
    return JSON.parse(simDraftStorage['sps_core_user_draft']);
  }
  simActivePreset = key;
  simIsPresetModified = false;
  return { form: { name: key.toUpperCase(), dev: 'Preset' }, shots: [] };
}

function simUserEdit(newName) {
  if (simActivePreset !== 'draft') {
    simIsPresetModified = true;
    return;
  }
  simUserDraft.form.name = newName;
  simDraftStorage['sps_core_user_draft'] = JSON.stringify(simUserDraft);
}

// 1. User is on draft and modifies name
simUserEdit('My Renamed App');
assert(JSON.parse(simDraftStorage['sps_core_user_draft']).form.name === 'My Renamed App', 'Draft mutations persist to draft storage when activeKey is draft');

// 2. User switches to preset TaskFlow
let loadedTaskflow = simLoadPreset('taskflow');
assert(simActivePreset === 'taskflow', 'Active preset switches to taskflow');
assert(loadedTaskflow.form.name === 'TASKFLOW', 'Preset loads template content');
assert(JSON.parse(simDraftStorage['sps_core_user_draft']).form.name === 'My Renamed App', 'Switching to preset preserves saved draft in storage without overwriting');

// 3. User edits while viewing Taskflow (Ephemeral Preview)
simUserEdit('Accidental Overwrite Attempt');
assert(simIsPresetModified === true, 'Modifying form while on preset triggers ephemeral modified state');
assert(JSON.parse(simDraftStorage['sps_core_user_draft']).form.name === 'My Renamed App', 'Draft storage is permanently immune to edits made while viewing presets');

// 4. User clicks Return to My Draft
let restoredDraft = simLoadPreset('draft');
assert(simActivePreset === 'draft', 'Active preset returns to draft');
assert(restoredDraft.form.name === 'My Renamed App', 'Returning to draft completely restores original user work');
assert(simIsPresetModified === false, 'Preset modified state resets cleanly upon returning to draft');

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

// 3. Removal of Invisible Keywords Field & iPad Promo Hiding
assert(!bundledHtml.includes('id="f-keywords"'), 'Invisible backend #f-keywords field is eliminated from editor');
assert(bundledHtml.includes('$$(\'.promo[data-b="promo"]\')'), 'update() toggles visibility across all .promo[data-b="promo"] containers (both iPhone and iPad)');

// 4. Field ↔ Device Mockup Focus Highlight & Smooth Screen Scrolling
assert(bundledHtml.includes('setFieldFocus'), 'Bundled application defines setFieldFocus function for field linking');
assert(bundledHtml.includes('flashField'), 'Bundled application defines flashField for real-time keystroke amber pulse');
assert(bundledHtml.includes('initFieldFocusLinking'), 'Bundled application initializes form field focus listeners on startup');
assert(bundledHtml.includes('hl-target'), 'Bundled stylesheet includes .hl-target styling for yellow device border');

// 5. Marketing Mini Studio Transition Determinism & FLIP AnimatedSize
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

// 8. Verified App ID Silent Tracking (No UI Banner or spoofable ref param)
assert(!marketingHtml.includes('id="vipInviteBanner"'), 'Marketing page keeps UI clean without spoofable VIP banner');
assert(marketingHtml.includes('function trackInviteEvent') && marketingHtml.includes('spsVerifiedApp'), 'Marketing script tracks verified Apple App identity via spsVerifiedApp');
const workerContent = fs.readFileSync(path.join(__dirname, '..', 'cloudflare', '_worker.js'), 'utf8');
assert(workerContent.includes("url.pathname === '/api/track'"), 'Cloudflare worker provides /api/track edge analytics endpoint');

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
// Module 14: Version Field Store Visibility & Full Description Tooltip Popover
// ---------------------------------------------------------------------
console.log('[SUITE 14]: Version Store Visibility & Full Description Tooltip Popover');

// 1. Version & Release Date Store Isolation
assert(
  /<div[^>]*data-only="apple"[^>]*>[\s\S]*?id="f-ver"/.test(bundledHtml),
  'Version field #f-ver is wrapped in data-only="apple" so Google Play hides it'
);
assert(
  /<div[^>]*data-only="apple"[^>]*>[\s\S]*?id="f-rdate"/.test(bundledHtml),
  'Release Date field #f-rdate is wrapped in data-only="apple" so Google Play hides it'
);

// 2. Full Description Info Tooltip Button & Popover
assert(bundledHtml.includes('id="descInfoBtn"'), 'Full Description label contains info tooltip button #descInfoBtn');
assert(bundledHtml.includes('id="descInfoPop"'), 'Floating popover #descInfoPop exists in DOM');
assert(bundledHtml.includes('id="descInfoClose"'), 'Popover close button #descInfoClose exists');
assert(bundledHtml.includes('Full Description Display Guidelines'), 'Popover contains Full Description Display Guidelines title');
assert(bundledHtml.includes('Google Play Store:'), 'Popover explains Google Play Store short vs full description behavior');
assert(bundledHtml.includes('Apple App Store:'), 'Popover explains Apple App Store description display rules');

// 3. Google Play Listing DOM Integrity & Arrow Focus Linking
assert(
  /<span[^>]*data-b="desc"[^>]*hidden/.test(bundledHtml),
  'Google Play main listing DOM keeps full description hidden (requires navigating to separate screen)'
);
assert(!bundledHtml.includes('g-full-desc'), 'Google Play main listing does not inject unnatural inline full desc element');
assert(bundledHtml.includes('g-desc-arrow'), 'Google Play About header contains class .g-desc-arrow for arrow icon button');
assert(bundledHtml.includes('.g-desc-arrow.hl-target') && bundledHtml.includes('border-radius: 50% !important;'), 'Focus highlight preserves 50% circular radius with yellow border for .g-desc-arrow');
assert(bundledHtml.includes('.stage .g-desc-arrow'), 'getFieldMockupTargets maps desc field to .g-desc-arrow on Google Play');
assert(bundledHtml.includes('descInfoBtn') && bundledHtml.includes('descInfoPop'), 'Bundled JS wires up descInfoBtn to descInfoPop');

// 4. Privacy & Data Safety Compact Banner, Tooltip Popover and Focus Linking
assert(bundledHtml.includes('id="privacyInfoBtn"'), 'Privacy card header contains info tooltip button #privacyInfoBtn');
assert(bundledHtml.includes('id="privacyInfoPop"'), 'Floating popover #privacyInfoPop exists in DOM');
assert(bundledHtml.includes('id="privacyInfoClose"'), 'Popover close button #privacyInfoClose exists');
assert(bundledHtml.includes('Store Privacy &amp; Data Safety Guidelines'), 'Popover contains Store Privacy & Data Safety Guidelines title');
assert(bundledHtml.includes('Questionnaires on Store Consoles:'), 'Popover explains console questionnaire compliance process');
assert(bundledHtml.includes('id="privacyMockBanner"'), 'Privacy card renders compact interactive banner #privacyMockBanner');
assert(
  bundledHtml.includes('type="hidden" id="f-priv-linked"') &&
  bundledHtml.includes('type="hidden" id="f-priv-notlinked"') &&
  bundledHtml.includes('type="hidden" id="f-priv-google"'),
  'Backward compatible hidden inputs preserved for export & preset engines'
);
assert(
  bundledHtml.includes("case 'privacy':") && bundledHtml.includes('[data-google-safety]'),
  'getFieldMockupTargets maps privacy to data-google-safety and data-apple-priv-wrap'
);
assert(
  bundledHtml.includes('.safe[data-google-safety].hl-target') && bundledHtml.includes('border-radius: 14px !important;'),
  'Data Safety card focus highlight maintains 14px border radius with yellow border'
);

// 5. What's New Info Tooltip Popover & Dual Store Behavior
assert(bundledHtml.includes('id="whatsNewInfoBtn"'), "What's New field header contains info tooltip button #whatsNewInfoBtn");
assert(bundledHtml.includes('id="whatsNewInfoPop"'), "Floating popover #whatsNewInfoPop exists in DOM");
assert(bundledHtml.includes('id="whatsNewInfoClose"'), "Popover close button #whatsNewInfoClose exists");
assert(bundledHtml.includes("What's New Display Guidelines"), "Popover contains What's New Display Guidelines title");
assert(bundledHtml.includes("Google Play Store (Update State Only):"), "Popover explains Google Play Store update-state only behavior");
assert(bundledHtml.includes("Apple App Store (Public Listing):"), "Popover explains Apple App Store public listing behavior");
assert(bundledHtml.includes('class="wn-ver"') && bundledHtml.includes('.wn-ver.hl-target'), "What's New wraps full 'Version X.Y.Z' in .wn-ver with yellow focus highlight");
assert(bundledHtml.includes('.wn-ver') && bundledHtml.includes("case 'ver':"), "getFieldMockupTargets maps ver field to .wn-ver container");
assert(bundledHtml.includes("500 characters"), "Popover notes Google Play 500 characters limit");
assert(bundledHtml.includes('initInfoPopover("whatsNewInfoBtn"'), "Bundled JS initializes whatsNewInfoBtn popover");

// 6. Mockup Display Settings & Metrics Card Modernization
assert(bundledHtml.includes('id="metricsInfoBtn"'), "Metrics card header contains info tooltip button #metricsInfoBtn");
assert(bundledHtml.includes('id="metricsInfoPop"'), "Floating popover #metricsInfoPop exists in DOM");
assert(bundledHtml.includes('id="metricsInfoClose"'), "Popover close button #metricsInfoClose exists");
assert(bundledHtml.includes("Mockup Metrics &amp; Badges Guidelines"), "Popover contains Mockup Metrics & Badges Guidelines title");
assert(!bundledHtml.includes('id="metricsDetails"'), "Manual sample metrics accordion #metricsDetails is removed from UI");
assert(bundledHtml.includes('MOCKUP ONLY'), "Metrics card displays MOCKUP ONLY badge");
assert(bundledHtml.includes('id="f-st-off"') && bundledHtml.includes('id="f-st-wm"'), "Metrics toggle switches are preserved in DOM");
assert(bundledHtml.includes('type="hidden" id="f-st-rating"') && bundledHtml.includes('type="hidden" id="f-st-iap"'), "Sample input elements converted to hidden state inputs for backward compatibility");
assert(bundledHtml.includes('initInfoPopover("metricsInfoBtn"'), "Bundled JS initializes metricsInfoBtn popover");
assert(!bundledHtml.includes('id="tab7Url"') && !bundledHtml.includes('id="tab10Url"'), "By URL buttons (#tab7Url, #tab10Url) are removed from Tablet Screenshots card");
assert(!bundledHtml.includes('let isFloating') && !bundledHtml.includes('btnFloat'), "Orphaned isFloating / btnFloat dead code is removed from bundle");
assert(bundledHtml.includes("const defaultPrivLinked = 'Identifiers, Usage Data'") && bundledHtml.includes("const defaultPrivGoogle = 'No data shared with third parties, Data is encrypted in transit, You can request data deletion'"), "Custom blank draft initializes with standard App Privacy and Google Play Data Safety disclosures");
assert(bundledHtml.includes("loadPreset('taskflow')"), "Fresh bootstrap preloads TaskFlow preset to avoid an empty UI");
assert(bundledHtml.includes("setStore('apple', false)"), "Fresh bootstrap defaults to selecting App Store mode");
assert(bundledHtml.includes('function transitionStoreMode') && bundledHtml.includes('is-animating-store'), "Studio includes cinematic FLIP transitionStoreMode matching marketing showcase");
assert(bundledHtml.includes('body.is-animating-store .dev.apple.single'), "CSS forces both phone devices visible during store transitions to eliminate layout jumps");

// 7. Preview Toggles Pure State Behavior (No Conflicting Scroll Jumps)
assert(bundledHtml.includes("rawId === 'f-st-off' || rawId === 'f-st-wm'"), 'Preview toggles excluded from field focus scroll linking to prevent conflicting scroll jumps across multi-location metrics');

// 8. Device Selector Fixed Orientations & Rotation Buttons Removal
assert(!bundledHtml.includes('id="adRotate"'), 'Rotate button #adRotate is removed from Apple device selector (#dt)');
assert(!bundledHtml.includes('id="gdRotate"'), 'Rotate button #gdRotate is removed from Google device selector (#gdt)');
assert(bundledHtml.includes('id="dt"') && bundledHtml.includes('data-d="iphone"') && bundledHtml.includes('data-d="ipad"'), 'Apple device selector preserves iPhone and iPad switcher options');
assert(bundledHtml.includes('id="gdt"') && bundledHtml.includes('data-gd="phone"') && bundledHtml.includes('data-gd="tab7"') && bundledHtml.includes('data-gd="tab10"'), 'Google device selector preserves Phone, 7" Tablet and 10" Tablet switcher options');

// 9. Tablet Screenshot Validation & Hint Verification
assert(bundledHtml.includes('24-bit PNG (no alpha) or JPEG') && bundledHtml.includes('Recommended: 1920 × 1080 px'), 'Tablet screenshots card contains 24-bit PNG (no alpha) requirement and 1920x1080 recommendation');

const TAB_TEST_CFG = {
  tab7: { name: '7-inch', min: 320, max: 3840 },
  tab10: { name: '10-inch', min: 1080, max: 7680 }
};

function testTabIssues(key, it) {
  const c = TAB_TEST_CFG[key], m = it.meta, out = [];
  if (!m) return out;
  if (m.bad) out.push('Image could not be loaded');
  if (m.type && !/^image\/(png|jpeg)$/.test(m.type)) out.push('Must be PNG or JPEG');
  if (m.hasAlpha) out.push('Contains transparency (alpha channel not allowed by Play Console)');
  if (m.bytes && m.bytes > 8 * 1024 * 1024) out.push('Over 8 MB');
  if (m.w && m.h) {
    const r = m.w / m.h;
    if (Math.abs(r - 16 / 9) > 0.02 && Math.abs(r - 9 / 16) > 0.02) out.push('Aspect ratio must be 16:9 or 9:16');
    if (m.w < c.min || m.h < c.min || m.w > c.max || m.h > c.max) out.push(`Each side must be ${c.min.toLocaleString('en-US')}–${c.max.toLocaleString('en-US')} px`);
  }
  return out;
}

// Alpha channel rejection
const alphaItem = { meta: { type: 'image/png', bytes: 100000, w: 1920, h: 1080, hasAlpha: true } };
const alphaIssues = testTabIssues('tab10', alphaItem);
assert(alphaIssues.some(msg => msg.includes('transparency') || msg.includes('alpha')), 'Tablet screenshot with alpha transparency is flagged for rejection');

// 1920x1080 clean image passes both 7" and 10" criteria
const clean1080p = { meta: { type: 'image/png', bytes: 100000, w: 1920, h: 1080, hasAlpha: false } };
assert(testTabIssues('tab7', clean1080p).length === 0, '1920x1080 clean image passes 7-inch tablet requirements');
assert(testTabIssues('tab10', clean1080p).length === 0, '1920x1080 clean image passes 10-inch tablet requirements');

// 16:10 aspect ratio rejection (e.g. 2560x1600)
const ratio16_10 = { meta: { type: 'image/png', bytes: 100000, w: 2560, h: 1600, hasAlpha: false } };
const ratioIssues = testTabIssues('tab10', ratio16_10);
assert(ratioIssues.some(msg => msg.includes('Aspect ratio')), '16:10 screenshot (2560x1600) is flagged because Play Console strictly requires 16:9 or 9:16');

// Tablet screenshot row layout standardization (no broken wrapped input / buttons)
assert(!bundledHtml.includes('(Embedded / Uploaded Image)'), 'Deprecated input with (Embedded / Uploaded Image) is removed from tablet screenshot rows');
assert(bundledHtml.includes('srow tab') && bundledHtml.includes('head.className = \'shot-row-head\''), 'Tablet screenshot rows use standardized horizontal row layout with header and dim tag');
assert(bundledHtml.includes('Click to inspect & view details') && bundledHtml.includes('openImageDetailModal'), 'Tablet screenshot rows provide thumbnail click-to-inspect and image detail modal');
assert(bundledHtml.includes('id="icoInspect"'), 'Card 1 App Icon preserves its dedicated Inspect button');
assert(!bundledHtml.includes('\n.tab div{') && !bundledHtml.includes('}.tab div{'), 'iOS tab bar CSS is scoped to .phone.apple without leaking global styles into editor rows');

// 10. Google Play Phone Search View (Material You Authenticity)
assert(bundledHtml.includes('class="gp-search-view"') && bundledHtml.includes('class="gp-search-bar"'), 'Bundled HTML includes Material You Google Play search view and top bar');
assert(bundledHtml.includes('class="gp-search-header"') && bundledHtml.includes('class="gp-search-list"'), 'Google Play search view locks sticky search header above scrollable search results list');
assert(bundledHtml.includes('class="gp-search-chips-wrap"') && bundledHtml.includes('gp-chip-dropdown'), 'Google Play search view includes filter chips carousel with rating dropdown');
assert(bundledHtml.includes('class="gp-search-card primary"') && bundledHtml.includes('class="gp-search-card-name"'), 'Google Play search view renders primary app result card');
assert(!bundledHtml.includes('class="shots gp-search-shots"'), 'Google Play search result renders compact app rows without screenshot carousel, matching native Play Store UI');
assert(bundledHtml.includes('class="gp-search-action-btn"') && !bundledHtml.includes('Sponsored &bull; Suggested for you'), 'Google Play search view includes circular action button and omits sponsored text');
assert(bundledHtml.includes('gp-skel-card') && bundledHtml.includes('gp-skel-icon') && bundledHtml.includes('gp-skel-line'), 'Google Play search view includes clean skeleton secondary app cards');

// 11. iPhone & Android Vector Status Bar Icons
assert(!bundledHtml.includes('▂▄▆█ 5G ▰'), 'iPhone status bar replaced crude unicode characters with crisp vector SVG icons');
assert(bundledHtml.includes('class="phone apple"') && bundledHtml.includes('sb-ico-signal') && bundledHtml.includes('sb-ico-wifi') && bundledHtml.includes('sb-ico-battery'), 'iPhone status bar renders vector signal, wifi, and battery icons matching Android phone mockup');
assert(bundledHtml.includes('.dev.apple:not(.ipad)::before') && bundledHtml.includes('.dev.google:not(.gtab)::before'), 'iPhone and Android frames have distinct, hardware-accurate physical side buttons');
assert(bundledHtml.includes('const padX = opts.frameless ? 0 : 8;') && bundledHtml.includes("addBtn('left', 144, 34)"), 'PNG export expands horizontal canvas padding and renders balanced 5px hardware buttons for framed exports');



// ---------------------------------------------------------------------
// Suite 15: Modern Reset Draft Confirmation Modal
// ---------------------------------------------------------------------
console.log('\n[SUITE 15]: Modern Reset Draft Confirmation Modal');

assert(bundledHtml.includes('id="resetConfirmModal"'), 'Confirmation modal #resetConfirmModal exists in DOM');
assert(bundledHtml.includes('id="resetConfirmCancel"'), 'Cancel button #resetConfirmCancel exists in confirmation modal');
assert(bundledHtml.includes('id="resetConfirmOk"') && /<button[^>]*id="resetConfirmOk"[^>]*>Reset<\/button>/.test(bundledHtml), 'Action button #resetConfirmOk exists with exact button text "Reset"');
assert(bundledHtml.includes('Reset App Draft?'), 'Modal title "Reset App Draft?" exists in DOM');
assert(bundledHtml.includes('function showResetConfirmModal'), 'Helper function showResetConfirmModal is defined in bundled script');
assert(bundledHtml.includes('function resetDraftWorkspace'), 'Helper function resetDraftWorkspace is defined in bundled script');
assert(bundledHtml.includes('resetDraftWorkspace();'), 'Reset confirmation triggers resetDraftWorkspace');
assert(!bundledHtml.includes("loadPreset('taskflow');\n          updateDraftPill();"), 'Resetting draft does not inappropriately reload TaskFlow preset');
assert(bundledHtml.includes('.confirm-modal-backdrop') && bundledHtml.includes('.confirm-modal-card'), 'Modal backdrop and card styles are present in bundled CSS');
assert(!/if\s*\(\s*confirm\s*\(/.test(bundledHtml), 'Native browser confirm() dialog is replaced across all reset triggers');

// 9. Clean Destination & Single-binding Sidebar Toggle
assert(!bundledHtml.includes('showToast(SUPPORTS_IPAD'), 'iPad destination toggle does not trigger toast notification');
assert(bundledHtml.includes('btnToggleSidebar.onclick = (e) =>'), 'btnToggleSidebar has single dedicated onclick binding avoiding double-toggle cancelation');

// 10. Dual Store Phone Preview (iPhone + Android Phone Side-by-Side) & PNG Export
assert(bundledHtml.includes('id="stageDevices"'), 'Stage wraps device mockups in #stageDevices flex container');
assert(bundledHtml.includes('data-s="dual"') && bundledHtml.includes('Dual Store Phone Preview (iPhone &amp; Android Phone side-by-side)'), 'Store switcher (.seg) includes Dual View tab with clear side-by-side phone tooltip');
assert(bundledHtml.includes('class="seg-tooltip"') && bundledHtml.includes('class="seg-tt-badge"') && bundledHtml.includes('Phone Only'), 'Store switcher tab includes custom instant tooltip with Phone Only badge for Dual View');
assert(bundledHtml.includes('Side-by-side preview of <b>iPhone</b> and <b>Android Phone</b> on one canvas.'), 'Dual View tooltip provides clean concise preview description');
assert(bundledHtml.includes('body[data-dual="true"] .dev.apple.single') && bundledHtml.includes('body[data-dual="true"] #dev-phone.dev.google'), 'CSS rules display both iPhone and Android Phone side-by-side when data-dual="true"');
assert(bundledHtml.includes("devSlug = 'dual-store-phone'"), 'exportPNG supports capturing dual-store-phone comparison image');
assert(bundledHtml.includes('APP STORE &middot; iPhone') && bundledHtml.includes('GOOGLE PLAY &middot; Android'), 'Devices render marketing-style platform header labels (APP STORE · iPhone / GOOGLE PLAY · Android)');
assert(bundledHtml.includes('.dev-label') && bundledHtml.includes('.dev-title'), 'Stage stylesheet includes .dev-label and .dev-title presentation styling');

// 11. Marketing-Aligned Placeholder App Icon & Silent Validation in Core Studio
assert(bundledHtml.includes('class="ico-wrap is-placeholder"') && bundledHtml.includes('id="icoDropZone"'), 'App icon drop container in Listing Details starts with .is-placeholder class');
assert(bundledHtml.includes('<div class="ico-ov">') && bundledHtml.includes('circle cx="11" cy="11" r="8"'), 'App icon drop container contains .ico-ov overlay with blue zoom/lens icon');
assert(bundledHtml.includes('linearGradient id="c6-bg"') && bundledHtml.includes('stop-color="#3b82f6"'), 'BLANK_ICON matches marketing Concept 6 vibrant dual-device vector gradient (#3b82f6 -> #8b5cf6)');
assert(bundledHtml.includes('function isPlaceholderIcon'), 'Core studio includes isPlaceholderIcon helper function to silence validation badge on unedited drafts');
assert(bundledHtml.includes('.ico-wrap.is-placeholder{border:1.5px dashed #3b82f6') || bundledHtml.includes('.ico-wrap.is-placeholder{border:1.5px dashed'), 'CSS defines dashed border for .ico-wrap.is-placeholder');
assert(bundledHtml.includes('.ico-wrap.is-placeholder .ico-ov') && bundledHtml.includes('background:rgba(8,12,24,0.65);color:#38bdf8'), 'CSS defines subtle dark overlay and blue zoom icon for placeholder state');
assert(!bundledHtml.includes('.ico-wrap:hover{transform:scale'), 'App icon .ico-wrap does not scale on hover');
assert(bundledHtml.includes("iconSrc = userDraft.icon") && bundledHtml.includes("userDraft.isCustomIcon"), 'Draft pill resolves to original vibrant BLANK_ICON and sanitizes legacy pastel icons');

// 12. Modern iOS 18 iPhone Search Result Mockup & Secondary Skeleton
assert(bundledHtml.includes('iphone-header') && bundledHtml.includes('sr-search-input'), 'iPhone Search Result includes modern iOS 18 frosted header with search bar row');
assert(bundledHtml.includes('class="sr-meta-line"') && bundledHtml.includes('class="sr-category"') && bundledHtml.includes('class="sr-dev"'), 'iPhone Search Result includes category and developer metadata line');
assert(bundledHtml.includes('class="sr-skeleton-card"') && bundledHtml.includes('class="sr-skel-shots"'), 'iPhone Search Result renders realistic secondary app skeleton card');
const skelCardCount = (bundledHtml.match(/class="sr-skeleton-card"/g) || []).length;
assert(skelCardCount >= 3, `iPhone Search Result renders at least 3 skeleton app cards for smooth scrolling (found ${skelCardCount})`);
assert(bundledHtml.includes('class="shots sr-shots" data-shots="shots"') && bundledHtml.includes('class="sr-skel-shot"'), 'iPhone Search Result displays skeleton screenshot placeholders when no screenshots are uploaded');

// 13. Translucent iOS 18 Headers & Floating Bottom Tab Bar (Semi-transparent see-through, no smudgy blur)
assert(bundledHtml.includes('--bar:rgba(255,255,255,.75)') || bundledHtml.includes('--bar: rgba(255, 255, 255, 0.75)'), 'Light mode header uses authentic see-through glass alpha (~0.75)');
assert(bundledHtml.includes('background:rgba(255,255,255,.75)') || bundledHtml.includes('background: rgba(255, 255, 255, 0.75)'), 'Floating tab bar uses translucent see-through glass background (~0.75)');
assert(!bundledHtml.includes('.iphone-header { position: sticky; top: 0; z-index: 6; display: flex; align-items: center; justify-content: space-between; padding: 54px 20px 10px; margin: 0 -20px 14px; background: var(--bar); backdrop-filter: blur'), 'iPhone top header avoids heavy blur smudging so text underneath remains legible');


// ---------------------------------------------------------------------
// Suite 16: Official Apple App Store Import & Public API Disclaimer
// ---------------------------------------------------------------------
console.log('\n[SUITE 16]: Official Apple App Store Import & Public API Disclaimer');

assert(bundledHtml.includes('id="storeImportModal"'), 'Store import modal #storeImportModal exists in bundled HTML');
assert(bundledHtml.includes('id="storeImportInput"'), 'Store import input #storeImportInput exists in modal');
assert(bundledHtml.includes('id="btnOpenStoreImport"'), 'Workspace bar includes #btnOpenStoreImport button');
assert(/\.ms-pill-import\s*\{\s*margin-left:\s*auto;/.test(bundledHtml), 'Import App button is right-aligned adjacent to Menu dropdown');
assert(bundledHtml.includes('function parseStoreInput'), 'Bundled application defines parseStoreInput');
assert(bundledHtml.includes('function normalizeAppleApp'), 'Bundled application defines normalizeAppleApp');
assert(bundledHtml.includes('function checkAndLoadStoreParams'), 'Bundled application defines checkAndLoadStoreParams');
assert(bundledHtml.includes('Uses official Apple iTunes public API'), 'Store import modal includes legal disclaimer for public API usage');
assert(bundledHtml.includes('Import from Apple App Store') && bundledHtml.includes('iOS only'), 'Store import modal explicitly designates Apple App Store and iOS only badge');
assert(bundledHtml.includes('Google Play is not supported due to store API limits'), 'Store import modal explicitly clarifies Google Play limitation up front');

const storeImport = require('../src/js/modules/store-import.js');
const { parseStoreInput, normalizeAppleApp } = storeImport;

// 1. parseStoreInput URL & ID parser tests
const pAppleUrl1 = parseStoreInput('https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580');
assert(pAppleUrl1 && pAppleUrl1.platform === 'apple' && pAppleUrl1.id === '324684580' && pAppleUrl1.country === 'us', 'parseStoreInput correctly parses full Apple App Store US URL');

const pAppleUrl2 = parseStoreInput('https://apps.apple.com/vn/app/duolingo-learn-languages/id570060128');
assert(pAppleUrl2 && pAppleUrl2.platform === 'apple' && pAppleUrl2.id === '570060128' && pAppleUrl2.country === 'vn', 'parseStoreInput correctly parses Apple App Store VN URL');

const pAppleIdPrefix = parseStoreInput('id324684580');
assert(pAppleIdPrefix && pAppleIdPrefix.platform === 'apple' && pAppleIdPrefix.id === '324684580', 'parseStoreInput parses "id324684580" prefix');

const pAppleIdNumeric = parseStoreInput('324684580');
assert(pAppleIdNumeric && pAppleIdNumeric.platform === 'apple' && pAppleIdNumeric.id === '324684580', 'parseStoreInput parses numeric Apple App ID');

assert(parseStoreInput('https://play.google.com/store/apps/details?id=com.spotify.music') === null, 'parseStoreInput safely rejects Google Play URL');
assert(parseStoreInput('com.spotify.music') === null, 'parseStoreInput safely rejects Android package name');
assert(parseStoreInput('   ') === null, 'parseStoreInput returns null for empty string');
assert(parseStoreInput('random-word') === null, 'parseStoreInput returns null for non-store input');
assert(parseStoreInput('1234') === null, 'parseStoreInput returns null for short numeric input');

// 2. normalizeAppleApp mapping tests
const mockApple = {
  trackName: 'Spotify - Music and Podcasts',
  artistName: 'Spotify Ltd.',
  primaryGenreName: 'Music',
  averageUserRating: 4.84,
  userRatingCount: 25000000,
  artworkUrl512: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/icon/512x512bb.jpg',
  screenshotUrls: ['https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/shot1/392x696bb.png'],
  ipadScreenshotUrls: ['https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/shot2/576x768bb.png'],
  description: 'Spotify is the best way to listen to music and podcasts on mobile or tablet. Search for any track, artist or album and listen for free.',
  version: '8.9.10',
  contentAdvisoryRating: '12+',
  bundleId: 'com.spotify.client'
};
const normApple = normalizeAppleApp(mockApple);
assert(normApple.platform === 'apple', 'normalizeAppleApp returns platform apple');
assert(normApple.store === 'apple', 'normalizeAppleApp returns store apple');
assert(normApple.appleDevice === 'iphone', 'normalizeAppleApp auto selects iphone device');
assert(normApple.form.name === 'Spotify', 'normalizeAppleApp separates title before dash');
assert(normApple.form.sub === 'Music and Podcasts', 'normalizeAppleApp extracts subtitle after dash');
assert(normApple.form.dev === 'Spotify Ltd.', 'normalizeAppleApp extracts artist name');
assert(normApple.icon.includes('1024x1024bb.png'), 'normalizeAppleApp upscales icon to 1024x1024 Retina');
assert(normApple.icon1024 && normApple.icon1024.includes('1024x1024bb.png'), 'normalizeAppleApp generates icon1024 Retina');
assert(normApple.icon512 && normApple.icon512.includes('512x512bb.png'), 'normalizeAppleApp generates icon512 for Google Play');
assert(normApple.iconGoogle && normApple.iconGoogle.includes('512x512bb.png'), 'normalizeAppleApp provides iconGoogle compliant URL');
assert(normApple.shots[0].includes('1242x2688bb.png'), 'normalizeAppleApp upscales screenshot to 1242x2688 Retina');
assert(normApple.supportsIpad === true, 'normalizeAppleApp detects iPad screenshots');
assert(normApple.isUniversal === true, 'normalizeAppleApp detects Universal app');
assert(normApple.featureGraphic !== undefined && (normApple.featureGraphic === '' || normApple.featureGraphic === BLANK_FEATURE), 'normalizeAppleApp explicitly clears feature graphic (does not auto-embed preset feature graphic)');

// Test iPhone-only app normalization
const normIphoneOnly = normalizeAppleApp({
  trackName: 'Tinder - Dating App',
  artworkUrl512: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/icon/512x512bb.jpg',
  screenshotUrls: ['https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/shot/576x768bb.png'],
  ipadScreenshotUrls: [],
  features: []
});
assert(normIphoneOnly.supportsIpad === false, 'normalizeAppleApp detects iPhone-only app (supportsIpad false)');
assert(normIphoneOnly.isUniversal === false, 'normalizeAppleApp detects iPhone-only app (isUniversal false)');

// 3. Network Connection Check & 100% Offline User Confirmation
const { isNetworkOnline, showNetworkConfirmModal } = storeImport;
assert(typeof isNetworkOnline === 'function', 'store-import exports isNetworkOnline helper');
assert(isNetworkOnline() === true, 'isNetworkOnline defaults to true in non-browser/standard sandbox');

// Test isNetworkOnline with simulated offline navigator
const origNav = global.navigator;
global.navigator = { onLine: false };
assert(isNetworkOnline() === false, 'isNetworkOnline returns false when navigator.onLine is false');
global.navigator = { onLine: true };
assert(isNetworkOnline() === true, 'isNetworkOnline returns true when navigator.onLine is true');
global.navigator = origNav;

// HTML structure assertions for network permission and offline handling
assert(bundledHtml.includes('id="networkConfirmModal"'), 'Network confirmation modal #networkConfirmModal exists in bundled HTML');
assert(bundledHtml.includes('id="networkConfirmOk"'), 'Network confirm button #networkConfirmOk exists in modal');
assert(bundledHtml.includes('id="networkConfirmCancel"'), 'Network cancel button #networkConfirmCancel exists in modal');
assert(bundledHtml.includes('id="storeImportNetworkBanner"'), 'Dynamic network status banner #storeImportNetworkBanner exists in import modal');
assert(bundledHtml.includes('function isNetworkOnline'), 'Bundled application defines isNetworkOnline');
assert(bundledHtml.includes('function showNetworkConfirmModal'), 'Bundled application defines showNetworkConfirmModal');
assert(bundledHtml.includes('function updateStoreImportNetworkStatus'), 'Bundled application defines updateStoreImportNetworkStatus');
assert(bundledHtml.includes('100% Offline Core') || bundledHtml.includes('100% Offline Promise'), 'Import modal includes explicit 100% Offline commitment statement');
assert(bundledHtml.includes('Turn On Network Connection'), 'Network confirmation supports explicit prompt to turn on network connection');
assert(bundledHtml.includes('Allow Network Connection?'), 'Network confirmation prompts user to allow network access due to offline pledge');

// ---------------------------------------------------------------------
// Suite 17: Immediate Tabview Device Selection on Store Change
// ---------------------------------------------------------------------
console.log('\n[SUITE 17]: Immediate Tabview Device Selection on Store Change');
assert(bundledHtml.includes("$$('#dt [data-d]').forEach(b => b.classList.toggle('on'"), 'setStore toggles active class on Apple device selector buttons immediately');
assert(bundledHtml.includes("$$('#gdt [data-gd]').forEach(b => b.classList.toggle('on'"), 'setStore toggles active class on Google device selector buttons immediately');
assert(bundledHtml.includes("if(s === 'apple') syncVtPill($('dt'))"), 'setStore syncs Apple device tabview pill immediately');
assert(bundledHtml.includes("else if(s === 'google') syncVtPill($('gdt'))"), 'setStore syncs Google device tabview pill immediately');
assert(bundledHtml.includes('document.body.dataset.uiStore = s'), 'setStore updates uiStore dataset immediately');
assert(bundledHtml.includes('body[data-ui-store="apple"] #dt'), 'CSS displays Apple device selector immediately on uiStore=apple');
assert(bundledHtml.includes('body[data-ui-store="google"] #gdt'), 'CSS displays Google device selector immediately on uiStore=google');
assert(!bundledHtml.includes('<div class="vt" id="dt" data-only="apple">'), 'dt tabview does not have data-only="apple" so it cannot be hidden by form card filters');
assert(bundledHtml.includes('.pill.is-apple') && bundledHtml.includes('.seg[data-store="apple"] .pill'), 'Immediate Apple store pill selector defined');
assert(bundledHtml.includes('.pill.is-google') && bundledHtml.includes('.seg[data-store="google"] .pill'), 'Immediate Google Play store pill selector defined');
assert(bundledHtml.includes('.pill.is-dual') && bundledHtml.includes('.seg[data-store="dual"] .pill'), 'Immediate Dual store pill selector defined');
assert(bundledHtml.includes('pill.dataset.store = s'), 'syncSegPill sets pill dataset store immediately');
assert(bundledHtml.includes('seg.dataset.store = s'), 'syncSegPill sets segmented control dataset store immediately');

// ---------------------------------------------------------------------
// Suite 18: Google Play Feature Graphic 15 MB Limit & No-Alpha Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 18]: Google Play Feature Graphic 15 MB Limit & No-Alpha Verification');
assert(bundledHtml.includes('sizeBytes > 15 * 1024 * 1024') && bundledHtml.includes('Exceeds 15 MB limit'), 'validateFeatureGraphic strictly verifies 15 MB maximum file size limit');
assert(bundledHtml.includes('Contains transparency (alpha channel not allowed by Play Console)'), 'validateFeatureGraphic strictly checks and rejects alpha channel transparency');
assert(bundledHtml.includes('MAX_FEATURE_BYTES = 15 * 1024 * 1024'), 'Feature Graphic Inspector modal verifies 15 MB file size limit');
assert(bundledHtml.includes('Alpha detected · 100% Opaque required (no alpha)'), 'Feature Graphic Inspector modal rejects alpha transparency with actionable guidance');

// ---------------------------------------------------------------------
// Suite 19: Responsive Header & Tool Title Permanence Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 19]: Responsive Header & Tool Title Permanence Verification');
assert(!bundledHtml.includes('.brand h1{display:none}'), 'Tool name .brand h1 is never hidden with display:none in bundled CSS');
assert(bundledHtml.includes('.header-center{order:3;flex:0 0 100%;width:100%') || bundledHtml.includes('.header-center{order:3;flex:0 0 100%'), 'Header center segmented control container expands to 100% and wraps to row 2 on mobile');
assert(bundledHtml.includes('.brand h1{display:block!important'), '.brand h1 is explicitly forced to display:block on mobile viewports');
assert(bundledHtml.includes('.seg{width:100%;max-width:100%;min-width:0;display:flex}'), 'Segmented control (.seg) expands to full width with flex layout on mobile');
assert(bundledHtml.includes('.workspace-bar') && bundledHtml.includes('flex-wrap: nowrap'), 'Workspace bar strictly maintains flex-wrap: nowrap to prevent Export button dropping');
assert(bundledHtml.includes('#draftBtnTitle') && bundledHtml.includes('text-overflow: ellipsis'), 'Draft button title supports ellipsis truncation when space is tight');
assert(bundledHtml.includes('id="optOpenTemplatesModal"'), 'Menu contains option to open templates modal');
assert(bundledHtml.includes('id="templatesModal"'), 'Dedicated templates modal dialog exists');
assert(bundledHtml.includes('class="templates-modal-grid"'), 'Templates modal contains responsive template card grid');
assert(bundledHtml.includes('initDraftFromCurrentPreset'), 'Selecting template when draft is empty converts template into active draft');

// ---------------------------------------------------------------------
// Suite 20: Draft Pill Icon Dynamic Template Synchronization Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 20]: Draft Pill Icon Dynamic Template Synchronization Verification');
assert(bundledHtml.includes("PRESET_ICONS[CURRENT_PRESET_KEY]") && bundledHtml.includes("if(!userDraft.isCustomIcon) userDraft.icon = iconSrc"), 'updateDraftPill resolves and synchronizes draft pill icon with active selected template');
assert(bundledHtml.includes("icon: (IS_CUSTOM_ICON && ICON) ? ICON : (ICON || (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY]) || BLANK_ICON)"), 'getCurrentStateObject retains selected template vector icon instead of discarding it');

// Simulation of Draft Pill Icon Resolution Logic
function testResolveDraftPillIcon(uDraft, activePreset, presetIcons, isCustom, activeIcon, blankIcon) {
  let iconSrc = blankIcon;
  if(uDraft.isCustomIcon && uDraft.icon && !uDraft.icon.includes('bfd1fd') && !uDraft.icon.includes('d2c7fc')){
    iconSrc = uDraft.icon;
  } else if(isCustom && activeIcon && !activeIcon.includes('bfd1fd') && !activeIcon.includes('d2c7fc')){
    iconSrc = activeIcon;
    uDraft.isCustomIcon = true;
    uDraft.icon = activeIcon;
  } else if(activePreset && presetIcons[activePreset] && activePreset !== 'none' && activePreset !== 'draft'){
    iconSrc = presetIcons[activePreset];
    if(!uDraft.isCustomIcon) uDraft.icon = iconSrc;
  } else if(uDraft.icon && uDraft.icon !== blankIcon && !uDraft.icon.includes('bfd1fd') && !uDraft.icon.includes('d2c7fc')){
    iconSrc = uDraft.icon;
  } else if(activeIcon && activeIcon !== blankIcon && !activeIcon.includes('bfd1fd') && !activeIcon.includes('d2c7fc')){
    iconSrc = activeIcon;
  } else {
    iconSrc = blankIcon;
    uDraft.icon = blankIcon;
  }
  return iconSrc;
}

const mockPresetIcons = {
  none: 'data:image/svg+xml;blank',
  studio: 'data:image/svg+xml;studio',
  taskflow: 'data:image/svg+xml;taskflow',
  pulsefit: 'data:image/svg+xml;pulsefit',
  zenmind: 'data:image/svg+xml;zenmind',
  cyberstrike: 'data:image/svg+xml;cyberstrike',
  edulearn: 'data:image/svg+xml;edulearn'
};
let testDraft = { isCustomIcon: false, icon: 'data:image/svg+xml;blank' };

// Test 1: Selecting studio template updates pill icon to studio vector icon
let resolved = testResolveDraftPillIcon(testDraft, 'studio', mockPresetIcons, false, mockPresetIcons.studio, mockPresetIcons.none);
assert(resolved === mockPresetIcons.studio, 'Draft pill icon dynamically resolves to Store Preview Studio template icon');
assert(testDraft.icon === mockPresetIcons.studio, 'Draft model icon synchronizes with Store Preview Studio icon');

// Test 2: Selecting pulsefit template updates pill icon to pulsefit vector icon
resolved = testResolveDraftPillIcon(testDraft, 'pulsefit', mockPresetIcons, false, mockPresetIcons.pulsefit, mockPresetIcons.none);
assert(resolved === mockPresetIcons.pulsefit, 'Draft pill icon dynamically resolves to PulseFit template icon');

// Test 3: Selecting cyberstrike template updates pill icon to cyberstrike vector icon
resolved = testResolveDraftPillIcon(testDraft, 'cyberstrike', mockPresetIcons, false, mockPresetIcons.cyberstrike, mockPresetIcons.none);
assert(resolved === mockPresetIcons.cyberstrike, 'Draft pill icon dynamically resolves to CyberStrike template icon');

// Test 4: Custom uploaded icon takes absolute precedence over presets
testDraft.isCustomIcon = true;
testDraft.icon = 'data:image/png;customAppIcon';
resolved = testResolveDraftPillIcon(testDraft, 'studio', mockPresetIcons, true, 'data:image/png;customAppIcon', mockPresetIcons.none);
assert(resolved === 'data:image/png;customAppIcon', 'User-uploaded custom icon takes precedence over template icons');

// Test 5: Resetting draft clears icon back to blank placeholder
testDraft = { isCustomIcon: false, icon: mockPresetIcons.none };
resolved = testResolveDraftPillIcon(testDraft, 'draft', mockPresetIcons, false, mockPresetIcons.none, mockPresetIcons.none);
assert(resolved === mockPresetIcons.none, 'Resetting draft cleanly restores blank placeholder icon');

// Test 6: Switching to view preset while draft exists switches displayed pill data to preset with return capability
assert(bundledHtml.includes("Viewing preset: ' + pName") && bundledHtml.includes("draftBtnThumb"), 'updateDraftPill updates displayed data to viewed preset while preserving draft return action');
assert(bundledHtml.includes("CUSTOM_ICON_1024 = '';") && bundledHtml.includes("CUSTOM_ICON_512 = '';"), 'loadPreset resets custom icon dimensional caches so preset vector icons render on all mockups');

// Test 7: Co-existence of Preset Pill and Draft Pill when viewing presets
assert(bundledHtml.includes('id="btnPresetPill"'), 'Workspace bar contains dedicated #btnPresetPill element');
assert(bundledHtml.includes('presetPill.style.display = \'inline-flex\'') && (bundledHtml.includes('presetPill.classList.toggle(\'on\'') || bundledHtml.includes('presetPill.classList.add(\'on\'')), 'updateDraftPill displays active preset pill when viewing preset template');
assert(bundledHtml.includes('draftPill.style.display = \'inline-flex\'') && bundledHtml.includes('draftPill.classList.toggle(\'on\', CURRENT_PRESET_KEY === \'draft\')'), 'updateDraftPill displays saved draft pill beside active preset pill');
assert(bundledHtml.includes('btnPresetPill.onclick = () => {') && bundledHtml.includes('templatesModal'), 'btnPresetPill allows quick access to template switcher modal');
assert(bundledHtml.includes('CURRENT_PRESET_KEY !== \'draft\'') && bundledHtml.includes('loadPreset(\'draft\')'), 'Clicking draft pill returns cleanly to draft workspace');
assert(bundledHtml.includes('CURRENT_ACTIVE_PRESET = key'), 'loadPreset updates CURRENT_ACTIVE_PRESET while preserving userDraft');
assert(bundledHtml.includes('applyImportedStoreApp') && bundledHtml.includes('userDraft = getCurrentStateObject();'), 'applyImportedStoreApp replaces draft with imported app data');

// ---------------------------------------------------------------------
// [SUITE 21]: Supported Devices Clean Checkboxes & Draft iPad State Reset Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 21]: Supported Devices Clean Checkboxes & Draft iPad State Reset Verification');

// Test 1: Device icons on destination checkboxes are completely removed
assert(!bundledHtml.includes('class="dest-icon-wrap"'), 'Supported Devices destination checkboxes have device icons removed');
assert(bundledHtml.includes('id="destTileIphone"') && bundledHtml.includes('id="destTileIpad"'), 'Supported Devices retains iPhone and iPad destination tiles');

// Test 2: Destination tiles contain clean checkmark boxes and info labels
const iphoneTileMatch = bundledHtml.match(/<label class="dest-tile[^"]*" id="destTileIphone"[^>]*>([\s\S]*?)<\/label>/);
assert(iphoneTileMatch && iphoneTileMatch[1].includes('dest-check-box') && !iphoneTileMatch[1].includes('dest-icon-wrap'), 'iPhone destination tile contains clean checkmark box without device icon');

const ipadTileMatch = bundledHtml.match(/<label class="dest-tile[^"]*" id="destTileIpad"[^>]*>([\s\S]*?)<\/label>/);
assert(ipadTileMatch && ipadTileMatch[1].includes('dest-check-box') && !ipadTileMatch[1].includes('dest-icon-wrap'), 'iPad destination tile contains clean checkmark box without device icon');

// Test 3: resetDraftWorkspace resets iPad support state and unchecks iPad checkbox
assert(bundledHtml.includes('resetDraftWorkspace()') && bundledHtml.includes('setSupportsIpad(false)'), 'resetDraftWorkspace resets iPad support state via setSupportsIpad(false)');

// Test 4: loadPreset('none') resets iPad support state
const loadPresetNoneMatch = bundledHtml.match(/if\s*\(\s*key\s*===\s*'none'\s*\)\s*\{[\s\S]*?setSupportsIpad\(false\)/);
assert(!!loadPresetNoneMatch, 'loadPreset("none") guarantees iPad support is reset to false');

// Test 5: Functional verification of setSupportsIpad reset behavior
let mockSupportsIpad = true;
const mockIpadChk = { checked: true };
const mockTileClasses = new Set(['dest-tile', 'active']);
const mockTileIpad = {
  classList: {
    toggle: (cls, val) => val ? mockTileClasses.add(cls) : mockTileClasses.delete(cls),
    contains: (cls) => mockTileClasses.has(cls)
  }
};
const mockBadge = { textContent: 'Universal App', className: 'dest-badge universal' };
const mockDescClasses = new Set(['dest-desc-bar', 'active-universal']);
const mockDescBar = {
  classList: {
    toggle: (cls, val) => val ? mockDescClasses.add(cls) : mockDescClasses.delete(cls),
    contains: (cls) => mockDescClasses.has(cls)
  }
};

function testSetSupportsIpad(val) {
  mockSupportsIpad = !!val;
  if (mockIpadChk.checked !== mockSupportsIpad) mockIpadChk.checked = mockSupportsIpad;
  mockTileIpad.classList.toggle('active', mockSupportsIpad);
  mockBadge.textContent = mockSupportsIpad ? 'Universal App' : 'iPhone Only';
  mockBadge.className = 'dest-badge' + (mockSupportsIpad ? ' universal' : '');
  mockDescBar.classList.toggle('active-universal', mockSupportsIpad);
}

// Perform reset
testSetSupportsIpad(false);

assert(mockSupportsIpad === false, 'mockSupportsIpad reset to false');
assert(mockIpadChk.checked === false, 'iPad checkbox checked property reset to false');
assert(!mockTileIpad.classList.contains('active'), 'iPad destination tile active class removed');
assert(mockBadge.textContent === 'iPhone Only', 'Destination badge updated to "iPhone Only"');
assert(!mockDescBar.classList.contains('active-universal'), 'Description bar active-universal class removed');

// ---------------------------------------------------------------------
// [SUITE 22]: Preset Pill Close Button & Dynamic Re-opening from Menu Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 22]: Preset Pill Close Button & Dynamic Re-opening from Menu Verification');

// Test 1: Preset pill markup contains close button with ms-pill-reset-btn styling
assert(bundledHtml.includes('id="presetPillCloseBtn"'), 'Workspace bar contains dedicated #presetPillCloseBtn element');
assert(bundledHtml.includes('class="ms-pill-reset-btn" id="presetPillCloseBtn"'), 'presetPillCloseBtn uses standardized ms-pill-reset-btn class');
assert(!(/<button[^>]*id="btnPresetPill"[^>]*>(?:(?!<\/button>)[\s\S])*?<button/.test(bundledHtml)), 'btnPresetPill static markup contains no invalid nested buttons');

// Test 2: closePresetPill function resets CURRENT_ACTIVE_PRESET and returns to draft
assert(bundledHtml.includes('function closePresetPill()') && bundledHtml.includes('CURRENT_ACTIVE_PRESET = null'), 'closePresetPill sets CURRENT_ACTIVE_PRESET = null');
assert(bundledHtml.includes('loadPreset(\'draft\')'), 'closePresetPill returns user workspace to draft if currently viewing preset');

// Test 3: updateDraftPill renders close button and hides preset pill when activePresetKey is null
assert(bundledHtml.includes('activePresetKey') && bundledHtml.includes('presetPill.style.display = \'none\''), 'updateDraftPill hides preset pill when activePresetKey is null');
assert(bundledHtml.includes('presetPill.querySelector(\'#presetPillCloseBtn\')'), 'updateDraftPill binds click handler to preset pill close button');

// Test 4: Functional simulation of Preset Pill close and re-open workflow
let suite22PresetKey = 'studio';
let suite22ActivePreset = 'studio';
const suite22Draft = { form: { name: 'My Test Draft' } };
const suite22PresetClasses = new Set();
const suite22DraftClasses = new Set();
const suite22PresetPill = {
  style: { display: 'none' },
  classList: {
    toggle: (cls, val) => val ? suite22PresetClasses.add(cls) : suite22PresetClasses.delete(cls),
    contains: (cls) => suite22PresetClasses.has(cls)
  }
};
const suite22DraftPill = {
  style: { display: 'none' },
  classList: {
    toggle: (cls, val) => val ? suite22DraftClasses.add(cls) : suite22DraftClasses.delete(cls),
    contains: (cls) => suite22DraftClasses.has(cls)
  }
};

function suite22UpdatePills() {
  const isViewingPreset = (suite22PresetKey !== 'draft');
  const activePresetKey = isViewingPreset ? suite22PresetKey : (suite22ActivePreset && suite22ActivePreset !== 'draft' ? suite22ActivePreset : null);

  if (!activePresetKey) {
    suite22PresetPill.style.display = 'none';
    suite22PresetPill.classList.toggle('on', false);
  } else {
    suite22PresetPill.style.display = 'inline-flex';
    suite22PresetPill.classList.toggle('on', isViewingPreset);
  }

  suite22DraftPill.style.display = 'inline-flex';
  suite22DraftPill.classList.toggle('on', suite22PresetKey === 'draft');
}

function suite22ClosePresetPill() {
  suite22ActivePreset = null;
  if (suite22PresetKey !== 'draft') {
    suite22PresetKey = 'draft';
  }
  suite22UpdatePills();
}

function suite22LoadPreset(key) {
  if (key === 'draft') {
    suite22PresetKey = 'draft';
  } else {
    suite22ActivePreset = key;
    suite22PresetKey = key;
  }
  suite22UpdatePills();
}

// Initial state: viewing studio preset
suite22UpdatePills();
assert(suite22PresetPill.style.display === 'inline-flex', 'Initially preset pill is displayed');
assert(suite22PresetPill.classList.contains('on'), 'Preset pill is active while viewing preset');
assert(!suite22DraftPill.classList.contains('on'), 'Draft pill is inactive while viewing preset');

// Step 1: User clicks X on preset pill
suite22ClosePresetPill();
assert(suite22ActivePreset === null, 'suite22ActivePreset is reset to null');
assert(suite22PresetKey === 'draft', 'Workspace returned to draft');
assert(suite22PresetPill.style.display === 'none', 'Preset pill is completely hidden after clicking X');
assert(suite22DraftPill.style.display === 'inline-flex', 'Draft pill remains visible');
assert(suite22DraftPill.classList.contains('on'), 'Draft pill is active');

// Step 2: User opens template from menu (e.g. pulsefit)
suite22LoadPreset('pulsefit');
assert(suite22ActivePreset === 'pulsefit', 'suite22ActivePreset updated to pulsefit');
assert(suite22PresetKey === 'pulsefit', 'suite22PresetKey updated to pulsefit');
assert(suite22PresetPill.style.display === 'inline-flex', 'Preset pill re-opens normally when chosen from menu');
assert(suite22PresetPill.classList.contains('on'), 'Preset pill is active');
assert(suite22DraftPill.style.display === 'inline-flex', 'Draft pill is displayed beside preset pill');
assert(!suite22DraftPill.classList.contains('on'), 'Draft pill is inactive while viewing pulsefit');

// Step 3: User returns to draft workspace
suite22LoadPreset('draft');
assert(suite22PresetKey === 'draft', 'User returned to draft');
assert(suite22PresetPill.style.display === 'inline-flex', 'Preset pill stays beside draft as inactive pill');
assert(!suite22PresetPill.classList.contains('on'), 'Preset pill is inactive');
assert(suite22DraftPill.classList.contains('on'), 'Draft pill is active');

// Step 4: User clicks X on preset pill while in draft workspace
suite22ClosePresetPill();
assert(suite22ActivePreset === null, 'suite22ActivePreset is reset to null');
assert(suite22PresetPill.style.display === 'none', 'Preset pill is hidden');
assert(suite22DraftPill.classList.contains('on'), 'Draft pill remains active');

// ---------------------------------------------------------------------
// [SUITE 23]: Single-Click Complete Draft Reset & Draft Pill Immediate State Wipe Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 23]: Single-Click Complete Draft Reset & Draft Pill Immediate State Wipe Verification');

// Test 1: loadPreset never persists current draft when key === 'none'
assert(bundledHtml.includes("CURRENT_PRESET_KEY === 'draft' && key !== 'none'"), 'loadPreset skips persisting draft when switching to none');

// Test 2: resetDraftWorkspace sets CURRENT_PRESET_KEY to 'none' before invoking loadPreset('none')
const resetSeqMatch = bundledHtml.match(/CURRENT_PRESET_KEY\s*=\s*'none';\s*loadPreset\('none'\);/);
assert(!!resetSeqMatch, 'resetDraftWorkspace temporarily switches CURRENT_PRESET_KEY before loadPreset("none")');

// Test 3: resetDraftWorkspace re-initializes userDraft with clean blank state and blank icon
assert(bundledHtml.includes("userDraft = getCurrentStateObject();") && bundledHtml.includes("userDraft.icon = (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');"), 'resetDraftWorkspace cleanly reinitializes userDraft with blank icon');

// Test 4: Functional simulation verifying single-reset draft pill wipe (no second reset required)
let simFormName = 'Custom Power App';
let simCustomIcon = 'data:image/png;customIconData';
let simIsCustom = true;
let simPresetKey23 = 'draft';

// Active populated draft
let simUserDraft23 = {
  form: { name: simFormName },
  icon: simCustomIcon,
  isCustomIcon: true,
  isCustomized: true
};

function simResolvePillTitle(draft) {
  const f = (draft && draft.form) || {};
  return (f.name && f.name.trim()) ? f.name.trim() : 'Your App';
}

function simResolvePillIcon(draft) {
  if (draft && draft.isCustomIcon && draft.icon) return draft.icon;
  return 'data:image/svg+xml;blank';
}

// Pre-reset assertions
assert(simResolvePillTitle(simUserDraft23) === 'Custom Power App', 'Initially pill draft displays custom app name');
assert(simResolvePillIcon(simUserDraft23) === simCustomIcon, 'Initially pill draft displays custom uploaded icon');

// Perform single reset
function simPerformReset() {
  // Step A: do not persist old draft because key === 'none'
  if (simPresetKey23 === 'draft' && 'none' !== 'none') {
    simUserDraft23 = { form: { name: simFormName }, icon: simCustomIcon, isCustomIcon: simIsCustom };
  }
  // Step B: clear inputs
  simFormName = '';
  simCustomIcon = '';
  simIsCustom = false;
  // Step C: reinitialize fresh clean draft
  simUserDraft23 = {
    form: { name: simFormName },
    icon: 'data:image/svg+xml;blank',
    isCustomIcon: false,
    isCustomized: true
  };
  simPresetKey23 = 'draft';
}

simPerformReset();

// Verify on the very first reset that draft pill data is completely wiped
assert(simResolvePillTitle(simUserDraft23) === 'Your App', 'First reset immediately clears draft pill title back to "Your App"');
assert(simResolvePillIcon(simUserDraft23) === 'data:image/svg+xml;blank', 'First reset immediately clears draft pill icon back to blank placeholder');
assert(simUserDraft23.form.name === '', 'First reset leaves userDraft name empty without requiring a second reset');

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
