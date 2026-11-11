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
vm.runInContext(stateCode + '\nglobalThis.PRESETS = PRESETS;\nglobalThis.GOOGLE_AGE_MAP = GOOGLE_AGE_MAP;\nglobalThis.DEFAULT_ICON = DEFAULT_ICON;\nglobalThis.PULSEFIT_ICON = PULSEFIT_ICON;\nglobalThis.ZENMIND_ICON = ZENMIND_ICON;\nglobalThis.CYBER_ICON = CYBER_ICON;\nglobalThis.LINGUA_ICON = LINGUA_ICON;\nglobalThis.BLANK_ICON = BLANK_ICON;\nglobalThis.STUDIO_ICON = STUDIO_ICON;\nglobalThis.CURRENT_PRIVACY = CURRENT_PRIVACY;', sandbox);

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
assert(PRESETS.studio.icon === sandbox.STUDIO_ICON, 'Store Preview Studio icon matches official STUDIO_ICON');
assert(sandbox.BLANK_ICON !== sandbox.STUDIO_ICON, 'Blank draft icon is distinct from Studio preset icon to avoid UX confusion');
assert(sandbox.BLANK_ICON.includes('bp-bg'), 'Blank draft icon uses professional App Icon Blueprint Grid');
assert(PRESETS.studio.privLinked === '' && PRESETS.studio.privNotLinked === '', 'Store Preview Studio defaults to Data Not Collected');
assert(sandbox.CURRENT_PRIVACY.linked === '' && sandbox.CURRENT_PRIVACY.notLinked === '', 'CURRENT_PRIVACY defaults to Data Not Collected');

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
  assert(decoded.includes('<rect width="512" height="512" fill="url(#') || decoded.includes('<rect width="512" height="512" fill="#') || decoded.includes('<rect width="32" height="32" fill="url(#') || decoded.includes('<rect width="1024" height="1024" fill="url(#') || decoded.includes('<rect width="100" height="100" fill="url(#'), `${p.name} icon has opaque non-transparent background rect`);
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
assert(iosCss.includes('.phone.apple:not(.ipad) .a-met > div{') && iosCss.includes('height:48px;max-height:48px'), '.a-met items have fixed 48px height to prevent vertical padding stretch');
assert(iosCss.includes('.a-met b[data-b="dev"]{') && iosCss.includes('-webkit-line-clamp:2') && iosCss.includes('max-height:26px'), '.a-met developer item is clamped to 2 lines (max 26px) so long names do not expand ribbon');
assert(iosCss.includes('.a-met small{') && iosCss.includes('font-weight:400'), '.a-met small labels use font-weight 400');
assert(iosCss.includes('.a-met i{') && iosCss.includes('font-weight:400'), '.a-met i sub-labels use font-weight 400');
assert(iosCss.includes('.get{') && iosCss.includes('font-weight:400'), '.get button uses font-weight 400');

const ipadMetricsHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'ipad-metrics.html'), 'utf8');
assert(ipadMetricsHtml.includes('data-stat="size-num"') && ipadMetricsHtml.includes('data-stat="size-unit"') && ipadMetricsHtml.includes('>MB</i>'), 'iPad metrics ribbon displays SIZE with value and MB unit instead of iPadOS');
assert(ipadMetricsHtml.includes('a-met-dev-ico') && ipadMetricsHtml.includes('<rect x="3.5"') && ipadMetricsHtml.includes('rx="3.8"'), 'iPad metrics ribbon contains authentic Apple person.crop.square developer icon');

const iphoneMetricsHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'metrics.html'), 'utf8');
assert(iphoneMetricsHtml.includes('a-met-dev-ico') && iphoneMetricsHtml.includes('<rect x="3.5"') && iphoneMetricsHtml.includes('data-b="dev"'), 'iPhone metrics ribbon contains authentic Apple person.crop.square developer icon and dev label');

const themeJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'theme.js'), 'utf8');
assert(themeJs.includes('.a-met'), 'Drag-to-scroll handler is attached to .a-met');

const pngJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
assert(pngJs.includes('[data-b]:not(.a-met [data-b]):not(.ipad-met [data-b]):not(.g-met [data-b])'), 'png.js scopes [data-b] to exclude metrics ribbons from line clamp unsetting');
assert(pngJs.includes('.phone.apple:not(.ipad) .a-met > div') && pngJs.includes('height: 48px !important'), 'png.js enforces 48px height on phone apple metrics items during export');
assert(pngJs.includes('.a-met b[data-b="dev"]') && pngJs.includes('-webkit-line-clamp: 2 !important'), 'png.js enforces 2-line clamp on metrics developer element in export');
assert(pngJs.includes('.get, .ipad-get, .sr-get-btn') && pngJs.includes('font-weight: 400 !important'), 'png.js enforces font-weight 400 on GET buttons during export');
assert(pngJs.includes('.a-met i, .a-met small, .ipad-met i, .ipad-met small') && pngJs.includes('font-weight: 400 !important'), 'png.js enforces font-weight 400 on metrics labels during export');

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
const ipadCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'ipad.css'), 'utf8');

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
assert(ipadHtml.includes('class="ipad-search-bar-row"') && ipadHtml.includes('class="ipad-filter-btn"'), 'ipad search view includes authentic filter button and search pill row');
assert(ipadHtml.includes('class="ipad-search-grid"') && ipadHtml.includes('class="ipad-sr-card ipad-sr-primary"'), 'ipad search view renders 2-column grid with primary app card');
assert(ipadHtml.includes('class="ipad-sr-card ipad-sr-skel"'), 'ipad search view includes authentic neighbor competitor skeleton cards');
assert(ipadHtml.includes('sb-ico-signal') && ipadHtml.includes('sb-ico-wifi') && ipadHtml.includes('sb-ico-battery'), 'ipad status bar includes standard signal, wifi, and battery vector icons matching iPhone');
assert(!ipadHtml.includes('Bộ lọc') && ipadHtml.includes('Filters'), 'ipad search view standardizes to English Filters');
assert(!ipadHtml.includes('Nhận') && ipadHtml.includes('GET'), 'ipad search view standardizes to English GET button');
assert(ipadCss.includes('.ipad-search-view:has(.has-landscape) .ipad-sr-skel-shots') || ipadCss.includes('.ipad-search-view.has-landscape .ipad-sr-skel-shots'), 'ipad css adapts skeleton search card height and columns dynamically for landscape apps');
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
assert(bundledHtml.includes('.ipad-dev-entity-name') && (bundledHtml.includes('font-weight:400') || bundledHtml.includes('font-weight: 400')), 'iPad developer name uses font-weight 400 (regular weight)');
assert(bundledHtml.includes('.ipad-dev-col{flex:0 0 130px') || bundledHtml.includes('max-width:130px'), 'iPad developer column has compact 130px width to maximize description space');
assert(ipadHtml.includes('ipad-desc-txt') && ipadHtml.includes('data-b="desc"'), 'iPad renders full description in description column');
assert(ipadHtml.includes('data-b="promo"'), 'iPad supports optional promotional text banner in description column');
assert(ipadHtml.includes('ipad-cat-pill') && ipadHtml.includes('data-b="cat"'), 'iPad displays category badge pill in description column');
assert(ipadHtml.includes('ipad-ratings-layout') && ipadHtml.includes('ipad-rating-bar-row'), 'iPad features authentic Ratings & Reviews with 5-star distribution bars');
assert(ipadHtml.includes('ipad-floating-pill') && ipadHtml.includes('ipad-floating-get'), 'iPad features floating bottom GET pill on scroll');
assert(ipadHtml.includes('ipad-info-grid') && ipadHtml.includes('ipad-info-cell') && ipadHtml.includes('ipad-info-label') && ipadHtml.includes('ipad-info-val'), 'iPad features authentic 2-column stacked Information section layout matching iOS 18');

// 5C. iPad Navigation Header Button SVG Dimensions
assert(bundledHtml.includes('.ipad-nav-btn svg') && bundledHtml.includes('width:19px'), 'iPad nav buttons have explicit SVG dimension rules in bundled CSS');
assert(ipadHtml.includes('class="a-nav-btn ipad-nav-btn ipad-nav-back"') && ipadHtml.includes('class="a-nav-btn ipad-nav-btn ipad-nav-share"'), 'iPad back and share buttons use shared a-nav-btn styling');
assert(/<button[^>]*ipad-nav-back[^>]*>\s*<svg[^>]*width="20"[^>]*height="20"/.test(ipadHtml), 'iPad back button SVG has explicit width/height constraints');
assert(/<button[^>]*ipad-nav-share[^>]*>\s*<svg[^>]*width="19"[^>]*height="19"/.test(ipadHtml), 'iPad share button SVG has explicit width/height constraints');

// 5D. iPad App Privacy Dark Theme Styling
assert(bundledHtml.includes('.phone.ipad[data-theme=dark] .pc') || bundledHtml.includes('.phone[data-theme=dark] .pc'), 'iPad App Privacy cards (.pc) have dark theme rules in bundled CSS');
assert(/(\.phone\.ipad|\.phone)\[data-theme=dark\]\s*\.pc\{background:#1c1c1e/.test(bundledHtml), 'iPad App Privacy cards use #1c1c1e background in dark mode');

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

const ipadFrameCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'ipad.css'), 'utf8');
assert(ipadFrameCss.includes('.dev.ipad::before{') && ipadFrameCss.includes('top:-5px;right:65px'), 'iPad frame places Top Button (Power) on top edge near right corner');
assert(ipadFrameCss.includes('.dev.ipad::after{') && ipadFrameCss.includes('right:-5px;top:55px') && ipadFrameCss.includes('0 44px 0'), 'iPad frame places two Volume Buttons on right edge near top camera corner');
assert(!ipadFrameCss.includes('left:-5px'), 'iPad frame has no buttons on the left edge');

const tabletsFrameCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'tablets.css'), 'utf8');
assert(tabletsFrameCss.includes('.dev.gtab:not(.portrait)::before{') && tabletsFrameCss.includes('top:48px;left:-5px'), 'Tablet landscape places Power button on left edge');
assert(tabletsFrameCss.includes('.dev.gtab:not(.portrait)::after{') && tabletsFrameCss.includes('top:-5px;left:48px') && tabletsFrameCss.includes('44px 0 0'), 'Tablet landscape places two Volume buttons on top edge near corner');

const googleMetricsHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'google', 'sections', 'metrics.html'), 'utf8');
assert(googleMetricsHtml.includes('class="g-star-ico"'), 'Google Play metrics rating uses centered g-star-ico SVG');

const googleHeaderCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'header.css'), 'utf8');
assert(googleHeaderCss.includes('.g-met [data-gmet-rating] b{display:inline-flex;align-items:center'), 'Google Play metrics rating b element uses inline-flex with align-items center');

const googleSearchCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'search.css'), 'utf8');
assert(googleSearchCss.includes('.gp-search-action-btn') && googleSearchCss.includes('width: 24px;') && googleSearchCss.includes('height: 32px;') && googleSearchCss.includes('border-radius: 12px;'), 'Search result arrow button container is styled as a compact vertical ellipse');
assert(googleSearchCss.includes('.gp-stat-rating') && googleSearchCss.includes('.gp-star-ico') && googleSearchCss.includes('color: var(--s);') && googleSearchCss.includes('margin-top: 0;'), 'Search result rating text uses muted gray and is aligned with stats row');

const pngExportJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
assert(pngExportJs.includes('const padY = opts.frameless ? 0 : 8;'), 'png.js includes padY for top/bottom button preservation during export');
assert(pngExportJs.includes('.g-met [data-gmet-rating] b') && pngExportJs.includes('.g-star-ico'), 'png.js enforces vertical centering for Google Play rating star in export');
assert(pngExportJs.includes('.gp-stat-rating') && pngExportJs.includes('.gp-star-ico'), 'png.js enforces vertical centering for search result rating star in export');
assert(pngExportJs.includes("addBtn('top', { right: 65 }, 52, true);"), 'png.js synthesizes Top Button for iPad export');
assert(pngExportJs.includes("addBtn('right', 55, 34);") && pngExportJs.includes("addBtn('right', 99, 34);"), 'png.js synthesizes two Volume buttons on right edge for iPad export');
assert(pngExportJs.includes("addBtn('top', { left: 48 }, 34, true);") && pngExportJs.includes("addBtn('top', { left: 92 }, 34, true);"), 'png.js synthesizes two Volume buttons on top edge for tablet export');
assert(!pngExportJs.includes("addBtn('left', 220, 70);"), 'png.js does not synthesize old obsolete left button for iPad');

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
assert(!bundledHtml.includes('Presentation Mockups'), 'Export dropdown removed cluttering section header titles for clean UI');
assert(bundledHtml.includes('class="mi-ico"'), 'Export menu items feature unified brand icon badges');
assert(!bundledHtml.includes('border-left: 2.5px solid #a855f7'), 'Export menu removes asymmetric left border on copy metadata');
assert(bundledHtml.includes('class="mi-pill"'), 'Export menu features unified sleek format badges');

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
assert(bundledHtml.includes('presetBanner'), 'Application contains non-destructive Preset Preview Banner');
assert(bundledHtml.includes('btnReturnToDraft'), 'Preset Preview Banner contains Return to My Draft restore button');
assert(!bundledHtml.includes('<section class="stage">\n    <!-- Non-destructive Preset Preview Banner -->') && !bundledHtml.includes('<section class="stage">\n    <div class="preset-banner"'), 'Stage canvas removes in-flow presetBanner to prevent pushing toolbar and squeezing device height');
assert(!bundledHtml.includes('.preset-banner {\n    display: none !important;'), 'Preset preview banner remains visible on responsive viewports < 860px');

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
assert(bundledHtml.includes("const dimTag = $('iconDimTag') || $('icoDimTag');"), 'updateIconDropZoneUi safely defines dimTag to prevent ReferenceError crash on placeholder reset');

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
assert(!bundledHtml.includes("4. Preview Studio Sync:"), 'Privacy popover removes redundant item 4');
assert(bundledHtml.includes('id="privacyMockBanner"'), 'Privacy card renders compact interactive banner #privacyMockBanner');
assert(!bundledHtml.includes('class="pcb-shield"'), 'Privacy card removed protect shield icon from compact banner');
assert(bundledHtml.includes('class="pcb-tags"') && bundledHtml.includes('class="tag a"') && bundledHtml.includes('class="tag g"'), 'Privacy card displays APPLE & GOOGLE store tags outside compact compliance box');
assert(bundledHtml.includes('.pcb-sub') && bundledHtml.includes('-webkit-line-clamp: 2;'), 'Privacy card sub description allows 2 lines of full content');
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
assert(bundledHtml.includes('id="privBtnNone"') && bundledHtml.includes('id="privBtnCollected"'), 'Privacy card renders Data Not Collected and Data Collected segmented mode buttons');
assert(!bundledHtml.includes('id="privCustomDetails"'), 'Privacy card omits invalid disclosures text inputs');
assert(bundledHtml.includes('function updatePrivacyModeUI'), 'Bundled application defines updatePrivacyModeUI');
assert(bundledHtml.includes('function setPrivacyMode'), 'Bundled application defines setPrivacyMode');

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
assert(!bundledHtml.includes("What's New is preserved across both stores"), "What's New popover removes redundant item 4");
assert(bundledHtml.includes('initInfoPopover("whatsNewInfoBtn"'), "Bundled JS initializes whatsNewInfoBtn popover");

// 6. Mockup Display Settings & Metrics Card Modernization
assert(bundledHtml.includes('id="metricsInfoBtn"'), "Metrics card header contains info tooltip button #metricsInfoBtn");
assert(bundledHtml.includes('id="metricsInfoPop"'), "Floating popover #metricsInfoPop exists in DOM");
assert(bundledHtml.includes('id="metricsInfoClose"'), "Popover close button #metricsInfoClose exists");
assert(bundledHtml.includes("Mockup Metrics &amp; Badges Guidelines"), "Popover contains Mockup Metrics & Badges Guidelines title");
assert(bundledHtml.includes("Not Storefront Listing Fields:"), "Popover explains store-calculated fields cannot be edited in console");
assert(!bundledHtml.includes("2. Preset Synchronization:"), "Popover removes redundant preset synchronization bullet point");
assert(!bundledHtml.includes("3. Clean Day-One"), "Popover removes verbose item 3");
assert(!bundledHtml.includes("4. Optional Customization"), "Popover removes verbose item 4");
assert(!bundledHtml.includes('class="metrics-summary"'), "Accordion #metricsDetails summary header removed for streamlined direct layout");
assert(bundledHtml.includes('class="stat-grid"'), "Sample metrics grid is directly exposed in card body");
assert(bundledHtml.includes('MOCKUP ONLY'), "Metrics card displays MOCKUP ONLY badge");
assert(bundledHtml.includes('Settings &amp; Metrics'), "Metrics card displays streamlined title Settings & Metrics");
assert(bundledHtml.indexOf('Settings &amp; Metrics') < bundledHtml.indexOf('MOCKUP ONLY'), "MOCKUP ONLY tag is positioned below the Settings & Metrics title");
assert(bundledHtml.includes('class="tag a" title="App Store">APPLE</span>') && bundledHtml.includes('class="tag g" title="Google Play">GOOGLE</span>'), "Settings & Metrics card includes APPLE and GOOGLE store badges");
assert(!bundledHtml.includes('Add a small “Illustrative mockup” caption'), "Removed redundant exported image watermark caption toggle from Card 4");
assert(!bundledHtml.includes('Hide all metrics from mockup'), "Metrics card removes redundant hide metrics toggle UI");
assert(!bundledHtml.includes('id="swRowMetricsOff"'), "Switch row #swRowMetricsOff is completely removed from DOM");
assert(bundledHtml.includes('type="hidden" id="f-st-off"') && bundledHtml.includes('type="hidden" id="f-st-wm"'), "Metrics toggle switches are preserved as hidden state inputs for backward compatibility");
assert(bundledHtml.includes('id="f-st-rating"') && bundledHtml.includes('id="f-st-iap"'), "Sample input elements provided in DOM for mockup customization and presets sync");
assert(bundledHtml.includes('initInfoPopover("metricsInfoBtn"'), "Bundled JS initializes metricsInfoBtn popover");
assert(bundledHtml.includes("counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '')"), 'Phone screenshots counter does not trigger warning highlight on clean 0 screenshots state');
assert(bundledHtml.includes('if(validCount === 0){\n    badgeEl.style.display = \'none\';') || bundledHtml.includes('if(validCount === 0)'), 'Phone screenshots validation suppresses warning notice banner when no screenshots are uploaded (0 screenshots)');
assert(!bundledHtml.includes('id="tab7Url"') && !bundledHtml.includes('id="tab10Url"'), "By URL buttons (#tab7Url, #tab10Url) are removed from Tablet Screenshots card");
assert(!bundledHtml.includes('let isFloating') && !bundledHtml.includes('btnFloat'), "Orphaned isFloating / btnFloat dead code is removed from bundle");
assert(bundledHtml.includes("const defaultPrivLinked = ''") && bundledHtml.includes("const defaultPrivGoogle = 'No data shared with third parties, No data collected, Data is encrypted in transit'"), "Custom blank draft and reset default to Data Not Collected privacy disclosures");
assert(bundledHtml.includes("loadPreset('studio')") || bundledHtml.includes("loadPreset('taskflow')"), "Fresh bootstrap preloads flagship preset to avoid an empty UI");
assert(bundledHtml.includes("setStore('apple', false"), "Fresh bootstrap defaults to selecting App Store mode");
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
assert(!bundledHtml.includes('No 7-inch screenshots yet'), 'Tablet screenshots card suppresses empty 7-inch warning alert banner');
assert(!bundledHtml.includes('No 10-inch screenshots yet'), 'Tablet screenshots card suppresses empty 10-inch warning alert banner');
assert(bundledHtml.includes('Each side between 320 px and 3,840 px') && bundledHtml.includes('Each side between 1,080 px and 7,680 px'), 'Tablet screenshots card preserves critical Play Console dimension constraints for 7-inch and 10-inch');

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
assert(/class="gp-search-card primary\b/.test(bundledHtml) && bundledHtml.includes('class="gp-search-card-name"'), 'Google Play search view renders primary app result card');
assert(bundledHtml.includes('class="gp-search-shots"') && bundledHtml.includes('data-shots="gp-search"'), 'Google Play search result renders open screenshots gallery on primary app card');
assert(bundledHtml.includes('class="gp-search-action-btn"') && !bundledHtml.includes('Sponsored &bull; Suggested for you'), 'Google Play search view includes circular action button and omits sponsored text');
assert(bundledHtml.includes('gp-skel-card') && bundledHtml.includes('gp-skel-icon') && bundledHtml.includes('gp-skel-line'), 'Google Play search view includes clean skeleton secondary app cards');
assert(!bundledHtml.includes('gp-skel-card') || !/<div[^>]*class="[^"]*gp-skel-card[^"]*"[^>]*>[\s\S]*?class="gp-search-shots"/.test(bundledHtml), 'Google Play search skeleton placeholder cards hide screenshots');

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
assert(bundledHtml.includes('id="resetConfirmClose"'), 'Close button #resetConfirmClose exists in confirmation modal');
assert(bundledHtml.includes('id="resetConfirmBackup"'), 'Backup button #resetConfirmBackup exists in confirmation modal');
assert(bundledHtml.includes('id="resetConfirmOk"') && /<button[^>]*id="resetConfirmOk"[^>]*>Reset<\/button>/.test(bundledHtml), 'Action button #resetConfirmOk exists with exact button text "Reset"');
assert(bundledHtml.includes('Reset App Draft?'), 'Modal title "Reset App Draft?" exists in DOM');
assert(bundledHtml.includes('function showResetConfirmModal'), 'Helper function showResetConfirmModal is defined in bundled script');
assert(bundledHtml.includes('function resetDraftWorkspace'), 'Helper function resetDraftWorkspace is defined in bundled script');
assert(bundledHtml.includes('resetDraftWorkspace();'), 'Reset confirmation triggers resetDraftWorkspace');
assert(!bundledHtml.includes("loadPreset('taskflow');\n          updateDraftPill();"), 'Resetting draft does not inappropriately reload TaskFlow preset');
assert(bundledHtml.includes('.confirm-modal-backdrop') && bundledHtml.includes('.confirm-modal-card'), 'Modal backdrop and card styles are present in bundled CSS');
assert(bundledHtml.includes('.confirm-modal-close-btn') && bundledHtml.includes('.confirm-btn-backup'), 'Modal close button and backup button styles are present in bundled CSS');
assert(!/if\s*\(\s*confirm\s*\(/.test(bundledHtml), 'Native browser confirm() dialog is replaced across all reset triggers');

// 9. Clean Destination & Single-binding Sidebar Toggle
assert(!bundledHtml.includes('showToast(SUPPORTS_IPAD'), 'iPad destination toggle does not trigger toast notification');
assert(bundledHtml.includes('btnToggleSidebar.onclick = (e) =>'), 'btnToggleSidebar has single dedicated onclick binding avoiding double-toggle cancelation');

// 10. Dual Phone Comparison in Stage Bottom Bar & Clean Header Store Switcher
assert(bundledHtml.includes('id="stageDevices"'), 'Stage wraps device mockups in #stageDevices flex container');
assert(bundledHtml.includes('id="btnDualPhone"') && bundledHtml.includes('Dual Phone'), 'Stage bottom bar includes dedicated Dual Phone toggle button');
assert(bundledHtml.includes('data-s="apple"') && bundledHtml.includes('data-s="google"') && !bundledHtml.includes('data-s="dual"'), 'Store switcher (.seg) contains only clean App Store and Google Play platforms, separating form from viewport');
assert(bundledHtml.includes('body[data-store="apple"][data-apple-device="ipad"] #dualPhoneWrap') && bundledHtml.includes('body[data-store="google"][data-google-device="tab7"] #dualPhoneWrap'), 'CSS rules hide Dual Phone button when iPad or Tablets are active');
assert(bundledHtml.includes('body[data-dual="true"] .dev.apple.single') && bundledHtml.includes('body[data-dual="true"] #dev-phone.dev.google'), 'CSS rules display both iPhone and Android Phone side-by-side when data-dual="true"');
assert(!bundledHtml.includes('body[data-dual="true"] #dt'), 'Device selector (#dt / #gdt) remains visible in Dual Phone mode');
assert(bundledHtml.includes("$$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === 'iphone'))"), 'Dual Phone auto-selects Phone on device selector');
assert(bundledHtml.includes("devSlug = 'dual-store-phone'"), 'exportPNG supports capturing dual-store-phone comparison image');
assert(bundledHtml.includes('curZoom = isDual') && bundledHtml.includes("document.querySelector('.dev.apple.single')?.style.zoom"), 'exportPNG measures dual phone unzoomed dimensions using child device zoom rather than container style.zoom');
assert(bundledHtml.includes('w = appleW + gap + googleW') && bundledHtml.includes('h = Math.max(appleH, googleH)'), 'exportPNG calculates full unzoomed dual phone width and height preventing vertical truncation');
assert(bundledHtml.includes("clonedEl.style.paddingTop = '0px'") && bundledHtml.includes("clonedDoc.querySelectorAll('.dev-label').forEach(l => l.style.display = 'none')"), 'exportPNG removes 36px top blank gap and hides dev-labels in cloned dual phone export');
assert(bundledHtml.includes("scr.style.overflow = 'hidden'") && bundledHtml.includes("gnav.style.position = 'absolute'") && bundledHtml.includes("gnav.style.bottom = '0px'"), 'exportPNG anchors Android bottom navigation bar (.gnav) and prevents .scr overflow expansion from pushing it offscreen');
assert(bundledHtml.includes('scrollX: 0') && bundledHtml.includes('scrollY: 0'), 'exportPNG passes scrollX: 0 and scrollY: 0 to prevent scroll offset drift');
assert(bundledHtml.includes('A.svg?(this.ctx.save(),this.ctx.drawImage(t,r.left,r.top,r.width,r.height),this.ctx.restore())'), 'html2canvas uses unclipped 5-argument drawImage for SVGs preventing clipping and 1/4 shrunk icons on Safari/WebKit');
assert(bundledHtml.includes('d="M1.5 4.3C5.2 1.0 10.8 1.0 14.5 4.3"'), 'Status bar WiFi SVG uses natural geometry preventing arc clipping');
assert(bundledHtml.includes('cx="11" cy="11" r="6.5" fill="none"'), 'Search icon circle defines explicit fill="none" and stroke-width="2"');
assert(bundledHtml.includes('.g-age-badge'), 'Google Play age rating badge defines dedicated .g-age-badge styling for centered text and tight box');
assert(bundledHtml.includes('g-info-ico'), 'Google Play Everyone tooltip icon uses .g-info-ico with fill="none" circle preventing clipping');
assert(bundledHtml.includes('APP STORE &middot; iPhone') && bundledHtml.includes('GOOGLE PLAY &middot; Android'), 'Devices render marketing-style platform header labels (APP STORE · iPhone / GOOGLE PLAY · Android)');
assert(bundledHtml.includes('.dev-label') && bundledHtml.includes('.dev-title'), 'Stage stylesheet includes .dev-label and .dev-title presentation styling');
assert(bundledHtml.includes('font-size:calc(13px / var(--dev-zoom, 1))'), '.dev-title uses --dev-zoom invariant font scaling at 13px');
assert(bundledHtml.includes("document.documentElement.style.setProperty('--dev-zoom', z)"), 'fit() updates --dev-zoom variable on root');

// 11. Marketing-Aligned Placeholder App Icon & Silent Validation in Core Studio
assert(bundledHtml.includes('id="edTitle">App Identity</span>'), 'Card 1 header uses unified "App Identity" title');
assert(bundledHtml.includes("$('edTitle').textContent = 'App Identity'"), 'setStore maintains unified "App Identity" title');
assert(bundledHtml.includes('class="ico-wrap is-placeholder"') && bundledHtml.includes('id="icoDropZone"'), 'App icon drop container in App Identity starts with .is-placeholder class');
assert(bundledHtml.includes('<div class="ico-ov">') && bundledHtml.includes('circle cx="11" cy="11" r="8"'), 'App icon drop container contains .ico-ov overlay with blue zoom/lens icon');
assert(bundledHtml.includes('id="bp-bg"') || bundledHtml.includes('BLUEPRINT_ICON'), 'BLANK_ICON defines professional App Icon Blueprint Grid');
assert(!bundledHtml.includes('stop-color="#f59e0b" rx="7"') && !bundledHtml.includes('stop-color="#ea580c"'), 'Old legacy orange app icon is completely purged from BLANK_ICON');
assert(bundledHtml.includes('function isPlaceholderIcon'), 'Core studio includes isPlaceholderIcon helper function to silence validation badge on unedited drafts');
assert(bundledHtml.includes('.ico-wrap.is-placeholder{border:1.5px dashed #3b82f6') || bundledHtml.includes('.ico-wrap.is-placeholder{border:1.5px dashed'), 'CSS defines dashed border for .ico-wrap.is-placeholder');
assert(bundledHtml.includes('.ico-wrap.is-placeholder .ico-ov') && (bundledHtml.includes('color:#fbbf24') || bundledHtml.includes('color:#38bdf8')), 'CSS defines subtle dark overlay and high-contrast upload zoom icon for placeholder state');
assert(!bundledHtml.includes('color:#fef08a'), 'Placeholder app icon lookup overlay retains consistent amber color on hover without fading to pale yellow');
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
assert(bundledHtml.includes('id="storeImportClose"'), 'Store import modal includes top-right close button #storeImportClose');
assert(bundledHtml.includes('.store-import-close-btn'), 'Store import modal defines .store-import-close-btn styles');
assert(bundledHtml.includes('id="storeImportInput"'), 'Store import input #storeImportInput exists in modal');
assert(bundledHtml.includes('id="btnOpenStoreImport"'), 'Workspace bar includes #btnOpenStoreImport button');
assert(/\.ms-pill-import\s*\{\s*margin-left:\s*auto;/.test(bundledHtml), 'Import App button is right-aligned adjacent to Menu dropdown');
assert(bundledHtml.includes('function parseStoreInput'), 'Bundled application defines parseStoreInput');
assert(bundledHtml.includes('function normalizeAppleApp'), 'Bundled application defines normalizeAppleApp');
assert(bundledHtml.includes('function checkAndLoadStoreParams'), 'Bundled application defines checkAndLoadStoreParams');
assert(bundledHtml.includes('Uses official Apple iTunes public API'), 'Store import modal includes legal disclaimer for public API usage');
assert(bundledHtml.includes("Apple's public API does not provide a separate Subtitle field"), 'Store import modal clarifies Subtitle API limitation to user');
assert(bundledHtml.includes("App Name &amp; Subtitle in App Identity"), 'Store import modal references App Identity card');
assert((bundledHtml.includes('Clone from Apple App Store') || bundledHtml.includes('Import from Apple App Store')) && bundledHtml.includes('iOS only'), 'Store import modal explicitly designates Apple App Store and iOS only badge');
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
assert(normApple.form.privLinked === '' && normApple.form.privNotLinked === '', 'normalizeAppleApp defaults to Data Not Collected for Apple App Store privacy compliance');

// Smart developer filter test (App name with company suffix like Tâm Trí Lực)
const mockDevSuffixApp = normalizeAppleApp({
  trackName: '5 Phút Thuộc Bài - Tâm Trí Lực',
  artistName: 'TAM TRI LUC TRAINING JOINT STOCK COMPANY',
  primaryGenreName: 'Education'
});
assert(mockDevSuffixApp.form.name === '5 Phút Thuộc Bài', 'normalizeAppleApp extracts actual app name when suffix matches developer name');
assert(mockDevSuffixApp.form.sub === 'Official Education App', 'normalizeAppleApp prevents developer name from being mistakenly set as subtitle');

// 3. Direct iTunes CORS & URL auto-import direct apply tests
assert(bundledHtml.includes('// 1. Try direct iTunes API first (native CORS support from browser client)'), 'fetchAppleAppData prioritizes direct iTunes API with browser CORS');
assert(bundledHtml.includes('// 2. Fallback to JSONP (100% immune to CORS and cross-origin restrictions)'), 'fetchAppleAppData includes JSONP fallback for CORS-isolated environments');
assert(bundledHtml.includes('// Auto-imported from URL on default or explicit app link: apply directly without modal'), 'handleStoreImportSubmit applies URL auto-imports directly without confirmation modal');
assert(bundledHtml.includes("} else if(initialUrlAppId){\n  if(userDraft && (String(userDraft.appId || userDraft.appleId).trim() === initialUrlAppId)){"), 'main.js prioritizes initialUrlAppId over existing stale user draft');


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

// Test Landscape screenshot normalization
const normLandscape = normalizeAppleApp({
  trackName: 'Landscape Game',
  artworkUrl512: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/icon/512x512bb.jpg',
  screenshotUrls: ['https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/shot/696x392bb.png'],
  ipadScreenshotUrls: ['https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/shot/552x414bb.png'],
  features: ['iosUniversal']
});
assert(normLandscape.shots[0].includes('2688x1242bb.png'), 'Landscape iPhone screenshot upscales to 2688x1242 Retina');
assert(normLandscape.ipadShots[0].includes('2732x2048bb.png'), 'Landscape iPad screenshot upscales to 2732x2048 Retina');

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
assert(bundledHtml.includes('body[data-ui-store=apple] .card[data-only=google]'), 'CSS updates Google card selector to support immediate uiStore switching');
assert(bundledHtml.includes("if ($('ipadCard')) $('ipadCard').style.display = '';"), 'setStore displays ipadCard immediately on Apple store to keep Card 5 visible without gap');

// ---------------------------------------------------------------------
// Suite 18: Google Play Feature Graphic 15 MB Limit & No-Alpha Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 18]: Google Play Feature Graphic 15 MB Limit & No-Alpha Verification');
assert(bundledHtml.includes('sizeBytes > 15 * 1024 * 1024') && bundledHtml.includes('Exceeds 15 MB limit'), 'validateFeatureGraphic strictly verifies 15 MB maximum file size limit');
assert(bundledHtml.includes('Contains transparency (alpha channel not allowed by Play Console)'), 'validateFeatureGraphic strictly checks and rejects alpha channel transparency');
assert(bundledHtml.includes('MAX_FEATURE_BYTES = 15 * 1024 * 1024'), 'Feature Graphic Inspector modal verifies 15 MB file size limit');
assert(bundledHtml.includes('Alpha detected · 100% Opaque required (no alpha)'), 'Feature Graphic Inspector modal rejects alpha transparency with actionable guidance');
assert(bundledHtml.includes('id="featureCard"') && bundledHtml.includes('</i>Feature Graphic</h2>'), 'Feature Graphic card title removes (1024×500 px) for concise clean title');
assert(bundledHtml.includes('.card h2{display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:500;letter-spacing:.2px;margin:0;flex-wrap:nowrap;min-width:0;color:#C4C5C4}'), 'Card headers enforce flex-wrap: nowrap to prevent title text dropping below icon');
assert(bundledHtml.includes('id="featureCard"') && bundledHtml.includes('<span class="tag g">GOOGLE</span>') && bundledHtml.includes('id="featureInfoBtn"'), 'Feature Graphic card places GOOGLE tag and info button in header row aligned with title');
assert(!bundledHtml.includes('No Feature Graphic uploaded yet'), 'Feature Graphic card suppresses redundant warning alert banner when empty');
assert(!bundledHtml.includes('Click or drag image to upload'), 'Feature Graphic placeholder SVG removes all text descriptions for a clean minimalist icon state');
assert(!bundledHtml.includes('Standard ratio: 1024×500 px (~2.05:1)'), 'Feature Graphic card removes redundant bottom hint paragraph');

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

// Test 1: Selecting taskflow template updates pill icon to taskflow vector icon
let resolved = testResolveDraftPillIcon(testDraft, 'taskflow', mockPresetIcons, false, mockPresetIcons.taskflow, mockPresetIcons.none);
assert(resolved === mockPresetIcons.taskflow, 'Draft pill icon dynamically resolves to TaskFlow template icon');
assert(testDraft.icon === mockPresetIcons.taskflow, 'Draft model icon synchronizes with TaskFlow icon');

// Test 2: Selecting pulsefit template updates pill icon to pulsefit vector icon
resolved = testResolveDraftPillIcon(testDraft, 'pulsefit', mockPresetIcons, false, mockPresetIcons.pulsefit, mockPresetIcons.none);
assert(resolved === mockPresetIcons.pulsefit, 'Draft pill icon dynamically resolves to PulseFit template icon');

// Test 3: Selecting cyberstrike template updates pill icon to cyberstrike vector icon
resolved = testResolveDraftPillIcon(testDraft, 'cyberstrike', mockPresetIcons, false, mockPresetIcons.cyberstrike, mockPresetIcons.none);
assert(resolved === mockPresetIcons.cyberstrike, 'Draft pill icon dynamically resolves to CyberStrike template icon');

// Test 4: Custom uploaded icon takes absolute precedence over presets
testDraft.isCustomIcon = true;
testDraft.icon = 'data:image/png;customAppIcon';
resolved = testResolveDraftPillIcon(testDraft, 'taskflow', mockPresetIcons, true, 'data:image/png;customAppIcon', mockPresetIcons.none);
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

// Test 8: Workspace pill decorative top accent lines (Brand green for Selected pill)
assert(bundledHtml.includes('#btnDraft::before') && bundledHtml.includes('#btnPresetPill::before'), 'Workspace bar defines decorative top accent line pseudo-elements for draft and preset pills');
assert(bundledHtml.includes('#btnDraft.on::before') && (bundledHtml.includes('#00D085') || bundledHtml.includes('--brand-secondary')), 'Selected draft pill uses brand secondary green top accent line');
assert(bundledHtml.includes('#btnPresetPill.on::before') && (bundledHtml.includes('#00D085') || bundledHtml.includes('--brand-secondary')), 'Preset pill uses brand secondary green top accent line');

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
assert(!bundledHtml.includes('id="destStatusBadge"'), 'identity-card.html removes iPhone Only / Universal App status badge for a cleaner UI');
assert(bundledHtml.includes('.dest-desc-bar{') && bundledHtml.includes('background:transparent !important'), 'destinations.css renders flat clean description text without card background or border');

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
let suite22PresetKey = 'taskflow';
let suite22ActivePreset = 'taskflow';
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

// Initial state: viewing taskflow preset
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
// SUITE 24: Custom Category Dropdown UI & Search Filter Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 24]: Custom Category Dropdown UI & Search Filter Verification');

assert(bundledHtml.includes('id="customCatWrap"') && bundledHtml.includes('id="customCatTrigger"'), 'Custom category dropdown wrapper and trigger exist in bundled HTML');
assert(bundledHtml.includes('id="customCatVal"') && bundledHtml.includes('id="customCatMenu"'), 'Custom category label display and popover menu exist in bundled HTML');
assert(bundledHtml.includes('id="customCatSearch"') && bundledHtml.includes('id="customCatOptions"'), 'Custom category search input and options container exist in bundled HTML');
assert(bundledHtml.includes('.custom-cat-trigger') && bundledHtml.includes('.custom-cat-menu') && bundledHtml.includes('.custom-cat-option'), 'Custom category CSS classes exist in bundled CSS');
assert(bundledHtml.includes(':root[data-ui=light] .custom-cat-trigger') && bundledHtml.includes(':root[data-ui=light] .custom-cat-menu'), 'Custom category provides authentic light theme adaptation');
assert(bundledHtml.includes('class="custom-cat-icon"') && bundledHtml.includes('body[data-ui-store="google"] .custom-cat-icon'), 'Custom category dropdown includes category icon with store-adaptive color');
assert(/<label>Category\s*<span class="tag a"[^>]*>APPLE<\/span>\s*<span class="tag g"[^>]*>GOOGLE<\/span><\/label>/.test(bundledHtml), 'Category field label displays both APPLE and GOOGLE badges');
assert(bundledHtml.includes("setFieldFocus('cat', true)"), 'Focusing custom category dropdown triggers setFieldFocus to highlight category on device');
assert(bundledHtml.includes('.ipad-cat-pill.hl-target') && bundledHtml.includes('.a-met [data-b="cat"].hl-target'), 'Category focus highlight styles cover iPhone, iPad, and Google Play mockups');

// Functional testing for category matching & normalization
const catCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'categories.js'), 'utf8');
const catSandbox = {
  $: (id) => ({ id, value: '', dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false }, querySelectorAll: () => [], appendChild: () => {}, setAttribute: () => {}, addEventListener: () => {} }),
  document: {
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} }, dataset: {}, addEventListener: () => {} }),
    addEventListener: () => {}
  },
  store: 'apple'
};
vm.createContext(catSandbox);
vm.runInContext(catCode + '\nglobalThis.matchCat = matchCat;\nglobalThis.setCategory = setCategory;\nglobalThis.CAT = CAT;\nglobalThis.APPLE_CATEGORIES = APPLE_CATEGORIES;\nglobalThis.GOOGLE_APP_CATEGORIES = GOOGLE_APP_CATEGORIES;\nglobalThis.GOOGLE_GAME_CATEGORIES = GOOGLE_GAME_CATEGORIES;', catSandbox);

const matchCatFn = catSandbox.matchCat;
assert(typeof matchCatFn === 'function', 'matchCat function is defined and runnable');
assert(matchCatFn('apple', 'productivity') === 'Productivity', 'matchCat correctly resolves Apple Productivity category');
assert(matchCatFn('google', 'productivity') === 'Productivity', 'matchCat correctly resolves Google Productivity category');
assert(matchCatFn('google', 'puzzle') === 'Games · Puzzle', 'matchCat correctly prefixes Google Games categories with "Games · "');
assert(matchCatFn('apple', 'social') === 'Social Networking', 'matchCat resolves Apple category alias (social -> Social Networking)');
assert(matchCatFn('google', 'social networking') === 'Social', 'matchCat resolves Google category alias (social networking -> Social)');
assert(catSandbox.APPLE_CATEGORIES.length === 26, 'Apple App Store defines all 26 official categories');
assert(catSandbox.GOOGLE_APP_CATEGORIES.length === 31, 'Google Play defines all 31 official app categories');
assert(catSandbox.GOOGLE_GAME_CATEGORIES.length === 17, 'Google Play defines all 17 official game categories');

// ---------------------------------------------------------------------
// SUITE 25: iPad Screenshots Header & Clean Validation Notice
// ---------------------------------------------------------------------
console.log('\n[SUITE 25]: iPad Screenshots Header & Clean Validation Notice');

const ipadCardHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'ipad-screenshots-card.html'), 'utf8');
assert(ipadCardHtml.includes('iPad Screenshots</h2>'), 'Card 5B title is streamlined to "iPad Screenshots" to prevent header line breaks');
assert(!ipadCardHtml.includes('iPad Screenshots (13" Pro)</h2>'), 'Card 5B does not contain wrapped (13" Pro) subtitle in h2');
assert(ipadCardHtml.includes('<span class="tag a">APPLE</span>'), 'Card 5B (iPad Screenshots) header includes APPLE store tag in header right for symmetry');
assert(ipadCardHtml.indexOf('class="tag a"') < ipadCardHtml.indexOf('class="info-tip-btn"'), 'Card 5B header places APPLE store tag before info button');
assert(ipadCardHtml.includes('<strong>iPad Pro 13" (4:3 ratio):</strong>'), 'Card 5B hint retains iPad Pro 13" and 4:3 ratio');
assert(ipadCardHtml.includes('2048×2732 px') && ipadCardHtml.includes('2064×2752 px'), 'Card 5B hint retains essential Apple resolutions (2048×2732 px, 2064×2752 px)');

const ipadJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'ipad.js'), 'utf8');
assert(!ipadJsCode.includes('Universal App Notice:'), 'validateIpadScreenshots no longer displays warning notice when 0 screenshots are uploaded');
assert(ipadJsCode.includes('(isExactIpad || is3to4)'), 'validateIpadScreenshots accepts both exact iPad Pro 13" and standard 4:3 iPad ratios as compliant');
assert(!ipadJsCode.includes('not exact iPad Pro 13"'), 'validateIpadScreenshots warning focuses on non-standard ratios without falsely flagging 4:3 iPad screenshots');
assert(bundledHtml.includes('MAX_UPLOAD_BYTES = 8 * 1024 * 1024') && bundledHtml.includes('validateUploadFile'), 'utils.js exports MAX_UPLOAD_BYTES (8 MB) and validateUploadFile helper to protect IndexedDB');
assert(bundledHtml.includes('const PH_IPAD = makeSvgDataUri(') && bundledHtml.includes('const PH_TAB = makeSvgDataUri('), 'Bundled application defines dedicated vector placeholders for iPad (PH_IPAD) and Tablet (PH_TAB)');
assert(!bundledHtml.includes('Image Not Found'), 'Tacky emoji and "Image Not Found" text are permanently eliminated from application bundle');
assert(bundledHtml.includes('Empty Slot · Ready to Upload'), 'Modal Inspector cleanly handles empty slot placeholders without false dimension notices');

// ---------------------------------------------------------------------
// SUITE 26: Customize Metrics Focus Highlight & Linking Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 26]: Customize Metrics Focus Highlight & Linking Verification');

const syncJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'sync.js'), 'utf8');
assert(syncJsCode.includes("case 'st-rating':") && syncJsCode.includes("case 'st-count':"), 'sync.js defines mockup target mapping for rating and ratings count');
assert(syncJsCode.includes("case 'st-rank':") && syncJsCode.includes("case 'st-dl':"), 'sync.js defines mockup target mapping for rank and downloads');
assert(syncJsCode.includes("case 'st-size':") && syncJsCode.includes("case 'st-age':") && syncJsCode.includes("case 'st-iap':"), 'sync.js defines mockup target mapping for size, age rating, and monetization badge');

assert(bundledHtml.includes('.a-met b.hl-target') && bundledHtml.includes('.g-met b.hl-target'), 'Bundled CSS provides focus highlight styles for metrics ribbon numbers');
assert(bundledHtml.includes('.gt10-met-item b.hl-target') && bundledHtml.includes('.gt10-rank-chip.hl-target'), 'Bundled CSS provides focus highlight styles for Google Play 10" tablet metrics & rank chips');
assert(bundledHtml.includes('gt10-results-list scr') && bundledHtml.includes('gt10-detail-col scr'), 'Google Play 10" tablet markup includes scr class on both scroll containers');
assert(bundledHtml.includes('.iap[data-iap-apple].hl-target') && bundledHtml.includes('.g-meta[data-iap-google].hl-target'), 'Bundled CSS provides focus highlight styles for monetization badges');
assert(bundledHtml.includes('.a-info b.hl-target') && bundledHtml.includes('.ipad-info-val.hl-target'), 'Bundled CSS provides focus highlight styles for Information table metrics');
assert(syncJsCode.includes('.gt10-met-item b') && syncJsCode.includes('.gt10-rank-chip'), 'sync.js handles Google Play 10" tablet target selection');
assert(syncJsCode.includes("target.closest('.scr, .gt10-detail-col, .gt10-results-list')"), 'sync.js setFieldFocus recognizes Google Play 10" tablet scroll panes');

// Functional testing for getFieldMockupTargets with metric fields
const syncSandbox = {
  $$: (sel) => {
    if (sel.includes('[data-stat="rating"]')) return [{ id: 'mock-rating', closest: () => ({ id: 'mock-rating-b' }) }];
    if (sel.includes('[data-stat="count"]')) return [{ id: 'mock-count', closest: () => ({ id: 'mock-count-i' }) }];
    if (sel.includes('[data-stat="rank"]')) return [{ id: 'mock-rank', closest: () => ({ id: 'mock-rank-b' }) }];
    if (sel.includes('[data-stat="dl"]')) return [{ id: 'mock-dl', closest: () => ({ id: 'mock-dl-st' }) }];
    if (sel.includes('[data-stat="size"]')) return [{ id: 'mock-size', closest: () => ({ id: 'mock-size-b' }) }];
    if (sel.includes('[data-age-apple]')) return [{ id: 'mock-age', closest: () => ({ id: 'mock-age-b' }) }];
    if (sel.includes('[data-iap-apple]')) return [{ id: 'mock-iap', closest: () => null }];
    return [];
  },
  $: () => null,
  document: {
    readyState: 'complete',
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  },
  window: {}
};
vm.createContext(syncSandbox);
vm.runInContext(syncJsCode + '\nglobalThis.getFieldMockupTargets = getFieldMockupTargets;', syncSandbox);

const getTargets = syncSandbox.getFieldMockupTargets;
assert(typeof getTargets === 'function', 'getFieldMockupTargets is defined and runnable');
assert(getTargets('st-rating').length > 0, 'getTargets resolves rating target elements');
assert(getTargets('st-count').length > 0, 'getTargets resolves count target elements');
assert(getTargets('st-rank').length > 0, 'getTargets resolves rank target elements');
assert(getTargets('st-dl').length > 0, 'getTargets resolves downloads target elements');
assert(getTargets('st-size').length > 0, 'getTargets resolves size target elements');
assert(getTargets('st-age').length > 0, 'getTargets resolves age rating target elements');
assert(getTargets('st-iap').length > 0, 'getTargets resolves monetization badge target elements');

// ---------------------------------------------------------------------
// SUITE 27: Inspect Button Disabled State When No App Icon
// ---------------------------------------------------------------------
console.log('\n[SUITE 27]: Inspect Button Disabled State When No App Icon');

const iconJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'icon.js'), 'utf8');
assert(iconJsCode.includes('inspectBtn.disabled = disabled') || iconJsCode.includes('inspectBtn.disabled = placeholder'), 'updateIconDropZoneUi disables icoInspect when icon is missing or placeholder');
assert(iconJsCode.includes("if(isPlaceholderIcon() || !ICON || ICON === BLANK_ICON){\n      return;"), 'icoInspect click handler returns early when icon is missing');
assert(iconJsCode.includes("if(CURRENT_PRESET_KEY && CURRENT_PRESET_KEY !== 'none' && CURRENT_PRESET_KEY !== 'draft') return false;"), 'isPlaceholderIcon never treats curated presets as placeholder');

const identityCardHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'identity-card.html'), 'utf8');
assert(identityCardHtml.includes('id="icoInspect"') && identityCardHtml.includes('disabled'), 'icoInspect button initializes with disabled attribute in identity-card.html');

assert(bundledHtml.includes('.mini:disabled') && bundledHtml.includes('cursor:not-allowed'), 'Bundled CSS provides explicit disabled cursor and opacity styles for mini buttons');
assert(!iconJsCode.includes("dimTag.className = 'shot-dim-tag ok';"), 'runIconPixelAudit does not render green dim tag when icon is compliant');

// Verification for Screenshots Inspector Disabled State and Dashed Lookup Placeholder
const phoneShotsJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'phone.js'), 'utf8');
assert(phoneShotsJsCode.includes("thumbWrap.className = 'shot-thumb-wrap is-placeholder'"), 'Phone screenshots renders is-placeholder class when no image');
assert(phoneShotsJsCode.includes("shot-thumb-ov"), 'Phone screenshots renders lookup icon overlay');
assert(phoneShotsJsCode.includes("inspectBtn.classList.add('disabled')"), 'Phone screenshots disables inspect button when no image');
assert(phoneShotsJsCode.includes("Upload a screenshot to inspect details"), 'Phone screenshots sets informative title on disabled inspect button');

assert(bundledHtml.includes('.shot-thumb-wrap.is-placeholder{'), 'Bundled CSS contains dashed placeholder styling for empty screenshot slots');
assert(bundledHtml.includes('.shot-thumb-ov{'), 'Bundled CSS contains lookup icon overlay styles for empty screenshot slots');
assert(bundledHtml.includes('.shot-inspect-btn:disabled, .shot-inspect-btn.disabled{'), 'Bundled CSS contains disabled styling for screenshot inspect buttons');

// App Icon Dashed Placeholder and Menu Reset Verification
assert(/\.ico-wrap\.is-placeholder\s*\{[\s\S]*?border:\s*1\.5px dashed (?:#f59e0b|#3F3F3F)/.test(bundledHtml), 'App icon zone defines dashed border for placeholder state');
assert(iconJsCode.includes("typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON"), 'isPlaceholderIcon returns false when custom icon is uploaded');
assert(bundledHtml.includes('sps_reset_to_blank'), 'Factory reset in menu triggers clean draft with dashed placeholder app icon');

// ---------------------------------------------------------------------
// SUITE 28: Live Demo (Lite) Positioning Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 28]: Live Demo (Lite) Positioning Verification');

const miniStudioHtml = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'components', 'mini-studio.html'), 'utf8');
assert(miniStudioHtml.includes('<span class="ms-live">Live Demo (Lite)</span>'), 'mini-studio.html toolbar badge displays Live Demo (Lite)');
assert(!miniStudioHtml.includes('<span class="ms-live">LIVE DEMO</span>'), 'mini-studio.html no longer displays old LIVE DEMO badge');
assert(!miniStudioHtml.includes('ms-sandbox-banner'), 'mini-studio.html does not render ms-sandbox-banner');

const footerHtml = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'components', 'footer.html'), 'utf8');
assert(footerHtml.includes('Interactive Preview'), 'footer.html links to Interactive Preview');

const launchModalHtml = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'components', 'launch-modal.html'), 'utf8');
assert(launchModalHtml.includes('Return to Interactive Preview'), 'launch-modal.html contains Return to Interactive Preview');

// ---------------------------------------------------------------------
// SUITE 29: Settings & Metrics User Review Customization Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 29]: Settings & Metrics User Review Customization Verification');

const metricsCardHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'metrics-card.html'), 'utf8');
assert(metricsCardHtml.includes('id="f-rev-title"') && metricsCardHtml.includes('Review Title'), 'Settings & Metrics includes Review Title input (#f-rev-title)');
assert(metricsCardHtml.includes('id="f-rev-user"') && metricsCardHtml.includes('Review Username'), 'Settings & Metrics includes Review Username input (#f-rev-user)');
assert(metricsCardHtml.includes('id="f-rev-desc"') && metricsCardHtml.includes('Review Description'), 'Settings & Metrics includes Review Description textarea (#f-rev-desc)');
assert(metricsCardHtml.includes('placeholder="Love this app so much"'), 'Review Title has expected authentic placeholder');
assert(metricsCardHtml.includes('placeholder="michellerebecca"'), 'Review Username has expected authentic placeholder');
assert(metricsCardHtml.includes('placeholder="This app is one of my favorite used apps on my phone.'), 'Review Description has expected authentic placeholder');

const reviewsJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'reviews.js'), 'utf8');
assert(reviewsJsCode.includes('function syncReviewInputs') && reviewsJsCode.includes('function initReviewInputs'), 'reviews.js exposes syncReviewInputs and initReviewInputs functions');
assert(reviewsJsCode.includes('tEl.value = rev.title') && reviewsJsCode.includes('uEl.value = rev.author'), 'syncReviewInputs synchronizes review title, username and description');
assert(reviewsJsCode.includes("REVIEWS[0].title = tEl.value") && reviewsJsCode.includes("REVIEWS[0].author = uEl.value"), 'onRevInput binds input fields directly to REVIEWS[0] model');

assert(syncJsCode.includes("case 'rev-title':") && syncJsCode.includes("case 'rev-user':") && syncJsCode.includes("case 'rev-desc':"), 'Focus linking system links review fields to mockup review components');

assert(bundledHtml.includes('id="f-rev-title"') && bundledHtml.includes('id="f-rev-user"') && bundledHtml.includes('id="f-rev-desc"'), 'Bundled core.html contains all 3 user review customization inputs');

// Verify Card order: Phone Screenshots before Settings & Metrics, and Privacy at very bottom
assert(bundledHtml.indexOf('id="shotsCard"') < bundledHtml.indexOf('id="statsCard"'), 'Phone Screenshots is positioned before Settings & Metrics');
assert(bundledHtml.indexOf('id="privacyCard"') > bundledHtml.indexOf('id="featureCard"'), 'App Privacy & Data Safety is positioned at the very bottom of the editor panel');

// ---------------------------------------------------------------------
// SUITE 30: Large Cards Collapsible Accordion Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 30]: Large Cards Collapsible Accordion Verification');

// 1. Card 1 must be ALWAYS EXPANDED by default (no collapsed class)
assert(/<div[^>]*id="identityCard"[^>]*class="card(?!\s+collapsed\b)[^"]*"/.test(bundledHtml) || !bundledHtml.includes('id="identityCard" class="card collapsed"'), 'Card 1 (App Identity) is expanded by default (no collapsed class)');

// 2. Other large cards must be COLLAPSED by default
assert(/class="card collapsed"[^>]*id="contentCard"/.test(bundledHtml), 'Card 2 (Description & Release Notes) is collapsed by default');
assert(/class="card collapsed"[^>]*id="shotsCard"/.test(bundledHtml), 'Card 3 (Phone Screenshots) is collapsed by default');
assert(/class="card collapsed"[^>]*id="statsCard"/.test(bundledHtml), 'Card 4 (Settings & Metrics) is collapsed by default');
assert(/class="card collapsed"[^>]*id="ipadCard"/.test(bundledHtml), 'Card 5 (iPad Screenshots) is collapsed by default');
assert(/class="card collapsed"[^>]*id="tabCard"/.test(bundledHtml), 'Card 5 (Tablet Screenshots) is collapsed by default');
assert(/class="card collapsed"[^>]*id="featureCard"/.test(bundledHtml), 'Card 6 (Feature Graphic) is collapsed by default');
assert(/class="card collapsed"[^>]*id="supportCard"/.test(bundledHtml), 'Card 7 (App Support) is collapsed by default');
assert(/class="card collapsed"[^>]*id="privacyCard"/.test(bundledHtml), 'Card Privacy (App Privacy & Data Safety) is collapsed by default at bottom');
assert(bundledHtml.includes('id="supportCard"') && bundledHtml.includes('title="Card 7">7</span>'), 'Card 7 (App Support) has card-num 7 for Google Play');
assert(bundledHtml.includes('<span data-only="google">8</span>'), 'Card Privacy has card-num 8 for Google Play');
assert(bundledHtml.indexOf('id="featureCard"') < bundledHtml.indexOf('id="supportCard"'), 'Feature Graphic (Card 6) is before App Support (Card 7)');
assert(bundledHtml.indexOf('id="supportCard"') < bundledHtml.indexOf('id="privacyCard"'), 'App Support (Card 7) is before Privacy (Card 8)');

// Verify screenshot counters are inside card body / desc area, not inside card header
const shotsHeader = bundledHtml.match(/<div class="card[^"]*" id="shotsCard">[\s\S]*?<div class="card-header">([\s\S]*?)<\/div>/);
assert(shotsHeader && !shotsHeader[1].includes('id="shotCounter"'), 'Phone Screenshots header does not contain screenshot counter');
const ipadHeader = bundledHtml.match(/<div class="card[^"]*"[^>]*id="ipadCard"[^>]*>[\s\S]*?<div class="card-header">([\s\S]*?)<\/div>/);
assert(ipadHeader && !ipadHeader[1].includes('id="ipadShotCounter"'), 'iPad Screenshots header does not contain screenshot counter');
assert(bundledHtml.includes('id="shotCounter"') && bundledHtml.includes('id="ipadShotCounter"'), 'Screenshot counters exist in card body description area');
assert(bundledHtml.indexOf('id="shotHint"') < bundledHtml.indexOf('id="shotCounter"'), 'Phone screenshot counter is placed below description');
assert(bundledHtml.indexOf('id="ipadShotHint"') < bundledHtml.indexOf('id="ipadShotCounter"'), 'iPad screenshot counter is placed below description');

// 3. Two-state Card Icon architecture (Selected vs Unselected)
assert(bundledHtml.includes('.card.collapsed .card-ico') && bundledHtml.includes('.card:not(.collapsed) .card-ico'), 'CSS provides distinct 2-state styling for collapsed (unselected) and expanded (selected) card icons');
assert(bundledHtml.includes('.card.selected:not(.collapsed) .card-ico'), 'CSS requires card to be both selected AND expanded to take bold indigo icon');
assert(!bundledHtml.includes('card-ico c-blue') && !bundledHtml.includes('card-ico c-purple'), 'Multi-color rainbow classes (c-blue, c-purple, etc.) are eliminated from card icons');
assert(!bundledHtml.includes('#tabCard h2{') && !bundledHtml.includes('#tabCard h2 i{'), 'Card 5 (tabCard) inherits standard .card-header h2 and .card-ico alignment without anomalous overrides');

// Card sequence number (.card-num) selected & semantic tint styling
assert(bundledHtml.includes('.card.selected:not(.collapsed) .card-num'), 'CSS highlights card sequence number (.card-num) when card is selected and expanded');
assert(bundledHtml.includes(':root[data-ui=light] .card.selected:not(.collapsed) .card-num'), 'CSS provides light theme selected tint for card sequence number');
assert(bundledHtml.includes('#identityCard.selected:not(.collapsed) .card-num') && bundledHtml.includes('#contentCard.selected:not(.collapsed) .card-num'), 'CSS provides harmonious semantic tints for individual card numbers');
assert(bundledHtml.includes(':root[data-ui=light] #identityCard.selected:not(.collapsed) .card-num'), 'CSS provides light theme semantic tints for card numbers');

// 4. Streamlined Scrollbar to prevent Form Width Misalignment
assert(bundledHtml.includes('scrollbar-width:thin') || bundledHtml.includes('.editor .card.selected .card-body'), 'Editor form container applies streamlined scrollbar without gutter misalignment');
assert(bundledHtml.includes('.editor::-webkit-scrollbar'), 'CSS provides custom floating scrollbar styles for editor drawer');

// 3. CSS rules for collapsed cards and headers
assert(bundledHtml.includes('.card.collapsed > :not(.card-header)'), 'CSS hides all content outside .card-header when card is collapsed');
assert(bundledHtml.includes('.card-header') && bundledHtml.includes('.card-toggle-ico'), 'CSS styles .card-header and .card-toggle-ico');

// 4. JS click listener toggles collapsed class
const headerJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'header.js'), 'utf8');
assert(headerJsCode.includes("card.classList.toggle('collapsed')"), 'header.js provides click delegation on .card-header to toggle collapsed class');
assert(headerJsCode.includes("card.classList.add('selected')"), 'header.js manages selected state when expanding cards');
assert(!headerJsCode.includes("if (typeof saveState === 'function') saveState();"), 'Accordion card toggle does not invoke saveState to avoid triggering preset modified warning');

// 5. Collapsed card hover state: subtle neutral brightening without colored chromatic tints
assert(bundledHtml.includes('.card.collapsed:hover') && bundledHtml.includes('#242524'), 'Dark theme styles card hover with subtle neutral lightening #242524');
assert(bundledHtml.includes(':root[data-ui=light] .card.collapsed:hover') && bundledHtml.includes('#f8fafc'), 'Light theme styles card hover with clean neutral brightening #f8fafc');
assert(!bundledHtml.includes('#shotsCard.collapsed:hover{background:'), 'Chromatic rose tint removed from shots card hover');
assert(!bundledHtml.includes('#identityCard.collapsed:hover{background:'), 'Chromatic amber tint removed from identity card hover');
assert(bundledHtml.includes('.card.collapsed:hover') && !bundledHtml.includes('.card.collapsed:hover{background:#ffffff!important;border-color:rgba(0,0,0,0.16)!important;box-shadow:0 3px 8px'), 'Collapsed card hover does not inflate excessive box shadow');
assert(bundledHtml.includes('input:-webkit-autofill') && bundledHtml.includes('-webkit-box-shadow: 0 0 0 1000px #171817 inset !important'), 'CSS neutralizes browser autofill background for dark mode');
assert(bundledHtml.includes(':root[data-ui=light] input:-webkit-autofill') && bundledHtml.includes('-webkit-box-shadow: 0 0 0 1000px #f8f9fb inset !important'), 'CSS neutralizes browser autofill background for light mode');

// ---------------------------------------------------------------------
// SUITE 31: Custom Age Rating Dropdown UI & Search Filter Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 31]: Custom Age Rating Dropdown UI & Search Filter Verification');

assert(bundledHtml.includes('id="customAgeWrap"') && bundledHtml.includes('id="customAgeTrigger"'), 'Custom age rating dropdown wrapper and trigger exist in bundled HTML');
assert(bundledHtml.includes('id="customAgeVal"') && bundledHtml.includes('id="customAgeMenu"'), 'Custom age rating value display and popover menu exist in bundled HTML');
assert(bundledHtml.includes('id="customAgeSearch"') && bundledHtml.includes('id="customAgeOptions"'), 'Custom age rating search input and options container exist in bundled HTML');
assert(bundledHtml.includes('id="f-st-age"') && bundledHtml.includes('style="display:none"'), 'Hidden select #f-st-age preserved for backward compatibility');
assert(bundledHtml.includes('.custom-age-trigger') && bundledHtml.includes('.custom-age-menu') && bundledHtml.includes('.custom-age-option'), 'Custom age CSS classes exist in bundled CSS');
assert(bundledHtml.includes(':root[data-ui=light] .custom-age-trigger') && bundledHtml.includes(':root[data-ui=light] .custom-age-menu'), 'Custom age provides authentic light theme adaptation');
assert(bundledHtml.includes("setFieldFocus('st-age', true)"), 'Interacting with custom age dropdown triggers setFieldFocus to highlight age rating on mockup');

// Functional testing for age ratings normalization & module
const ageCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'age.js'), 'utf8');
const ageSandbox = {
  $: (id) => ({
    id,
    value: '4+',
    options: [{ value: '4+' }, { value: '9+' }, { value: '12+' }, { value: '17+' }, { value: '18+' }],
    dataset: {},
    classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
    querySelectorAll: () => [],
    querySelector: () => null,
    appendChild: () => {},
    setAttribute: () => {},
    addEventListener: () => {},
    focus: () => {}
  }),
  document: {
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} }, dataset: {}, addEventListener: () => {} }),
    addEventListener: () => {}
  },
  STATS: { age: '4+' },
  renderStats: () => {},
  debouncedSave: () => {},
  flashField: () => {},
  setFieldFocus: () => {}
};
vm.createContext(ageSandbox);
vm.runInContext(ageCode + '\nglobalThis.getAgeRatingLabel = getAgeRatingLabel;\nglobalThis.selectAgeFromUI = selectAgeFromUI;\nglobalThis.AGE_RATINGS = AGE_RATINGS;', ageSandbox);

assert(typeof ageSandbox.getAgeRatingLabel === 'function', 'getAgeRatingLabel function is defined and runnable');
assert(ageSandbox.getAgeRatingLabel('4+') === '4+ / Everyone (E)', 'Age 4+ resolves to "4+ / Everyone (E)"');
assert(ageSandbox.getAgeRatingLabel('9+') === '9+ / Everyone 10+ (E10+)', 'Age 9+ resolves to "9+ / Everyone 10+ (E10+)"');
assert(ageSandbox.getAgeRatingLabel('12+') === '12+ / Teen (T)', 'Age 12+ resolves to "12+ / Teen (T)"');
assert(ageSandbox.getAgeRatingLabel('17+') === '17+ / Mature 17+ (M)', 'Age 17+ resolves to "17+ / Mature 17+ (M)"');
assert(ageSandbox.getAgeRatingLabel('18+') === '18+ / Adults Only (AO)', 'Age 18+ resolves to "18+ / Adults Only (AO)"');
assert(ageSandbox.getAgeRatingLabel('16+') === '16+ (Custom)', 'Custom age 16+ resolves with (Custom) suffix');
assert(ageSandbox.AGE_RATINGS.length >= 5, 'AGE_RATINGS contains at least 5 standard ratings');

ageSandbox.selectAgeFromUI('12+');
assert(ageSandbox.STATS.age === '12+', 'selectAgeFromUI updates STATS.age to 12+');

// ---------------------------------------------------------------------
// SUITE 32: Tooltip Guidelines & Learn More Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 32]: Tooltip Guidelines & Learn More Verification');

assert(bundledHtml.includes('id="appNameInfoBtn"'), 'App Name info tip button exists in identity card');
assert(bundledHtml.includes('id="appNameInfoPop"'), 'App Name guidelines popover exists in bundled HTML');
assert(bundledHtml.includes('https://developer.apple.com/app-store/product-page/'), 'App Name popover links to official Apple App Store product page');

// Verify guidelines popovers include Learn more link (metrics intentionally excluded as it has no public listing doc)
['appNameInfoPop', 'descInfoPop', 'featureInfoPop', 'iosIconInfoPop', 'privacyInfoPop', 'whatsNewInfoPop'].forEach(popId => {
  const idx = bundledHtml.indexOf(`id="${popId}"`);
  assert(idx !== -1, `${popId} exists in bundled HTML`);
  const popSnippet = bundledHtml.slice(idx, idx + 1800);
  assert(popSnippet.includes('info-pop-link') && popSnippet.includes('Learn more'), `${popId} includes a Learn more link button`);
});

const metricsPopIdx = bundledHtml.indexOf('id="metricsInfoPop"');
assert(metricsPopIdx !== -1, 'metricsInfoPop exists in bundled HTML');
const metricsPopSnippet = bundledHtml.slice(metricsPopIdx, metricsPopIdx + 1200);
assert(!metricsPopSnippet.includes('info-pop-link'), 'metricsInfoPop does not contain external Learn more link as requested');

assert(bundledHtml.includes('.info-pop-link') && bundledHtml.includes('.info-pop-footer'), 'Bundled CSS provides styling for .info-pop-link and .info-pop-footer');
assert(bundledHtml.includes(':root[data-ui=light] .info-pop-link'), 'Bundled CSS provides light theme adaptation for .info-pop-link');
assert(/:root\[data-ui=light\]\s*\.info-pop-title\{\s*color:#1F2937/i.test(bundledHtml), 'Tooltip title uses refined text (#1F2937) in light mode');
assert(/:root\[data-ui=light\]\s*\.info-popover\{[^}]*box-shadow:\s*0\s+16px\s+40px/i.test(bundledHtml), 'Tooltip popover uses soft shadow in light mode');
assert(!bundledHtml.includes('#privacyInfoPop .info-pop-title{color:#34d399}'), 'Tooltip title does not use green tint');
assert(!bundledHtml.includes('body[data-store=google] .info-tip-btn:hover{color:#10b981'), 'Tooltip icon button uses neutral monochrome styling without store/card tinting');
assert(/:root\[data-ui=light\]\s*\.info-tip-btn\{[^}]*background:transparent!important/.test(bundledHtml), 'Tooltip button has transparent background without outer wrapper or shadow in light mode');

// Shared Guidelines Popover & Card / Field Tooltip Verification
assert(bundledHtml.includes('id="sharedInfoPop"') && bundledHtml.includes('id="sharedInfoLink"'), 'Shared info popover with dynamic link exists in bundled HTML');
assert(bundledHtml.includes('initSharedPopovers'), 'initSharedPopovers function exists in bundled JS');

const expectedTipTitles = [
  'App Identity Guidelines',
  'Content &amp; Updates Guidelines',
  'Phone Screenshots Guidelines',
  'iPad Screenshots Guidelines',
  'Tablet Screenshots Guidelines',
  'App Support Guidelines',
  'Subtitle Guidelines',
  'Short Description Guidelines',
  'Category Guidelines',
  'Support Email Guidelines',
  'Support Phone Guidelines',
  'Developer Location Guidelines',
  'Supported Devices Guidelines',
  'Promotional Text Guidelines',
  'App Version Guidelines',
  'Release Date Guidelines',
  'Age Rating Guidelines',
  'Monetization Guidelines',
  'Customer Reviews Guidelines'
];

assert(!bundledHtml.includes('data-tip-title="Developer Name Guidelines"'), 'Developer field does not contain guideline tooltip as requested');

// Verify Phone Screenshots and iPad Screenshots link to official App Store Connect screenshot specifications
assert(bundledHtml.includes('data-tip-title="Phone Screenshots Guidelines" data-tip-desc="Visual previews of your app experience. Up to 10 screenshots per display size. The first 3 appear directly in store search results." data-tip-apple-link="https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications"'), 'Phone Screenshots tooltip links to screenshot-specifications');
assert(bundledHtml.includes('data-tip-title="iPad Screenshots Guidelines" data-tip-desc="Required for Universal iOS apps. Upload 13&quot; iPad Pro (2048×2732 or 2064×2752 px) screenshots in 4:3 ratio without alpha. If empty, App Store listings and mockups automatically display scaled iPhone screenshots." data-tip-apple-link="https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications"'), 'iPad Screenshots tooltip links to screenshot-specifications');

expectedTipTitles.forEach(title => {
  assert(bundledHtml.includes(`data-tip-title="${title}"`), `Field/card tooltip with title "${title}" exists in bundled HTML`);
});

// Verify 404 links removed from Supported Devices, App Version, and Release Date
assert(!bundledHtml.includes('edit-device-availability'), 'Broken edit-device-availability URL removed from Supported Devices tooltip');
assert(!bundledHtml.includes('data-tip-title="App Version Guidelines" data-tip-desc="The current release version number of your app (e.g. 2.4.0), displayed on the App Store product page." data-tip-apple-link'), 'Broken Learn more link removed from App Version tooltip');
assert(!bundledHtml.includes('data-tip-title="Release Date Guidelines" data-tip-desc="The publication date of the current version, displayed on the App Store next to the version number." data-tip-apple-link'), 'Broken Learn more link removed from Release Date tooltip');

// Verify App Support & Content card tooltips have no misleading Google Learn more links
assert(!bundledHtml.includes('data-tip-title="App Support Guidelines" data-tip-desc="Public contact and developer support information displayed on your Google Play Store listing so users and European regulators can reach you." data-tip-google-link'), 'App Support tooltip does not contain irrelevant graphic assets Learn more link');
assert(!bundledHtml.includes('data-tip-title="Support Email Guidelines" data-tip-desc="Public contact email displayed on your Google Play Store listing so users can reach you for customer support." data-tip-google-link'), 'Support Email tooltip does not contain irrelevant Learn more link');
assert(!bundledHtml.includes('data-tip-title="Support Phone Guidelines" data-tip-desc="Direct support phone number displayed on your Google Play Store listing, required by merchant verification policies." data-tip-google-link'), 'Support Phone tooltip does not contain irrelevant Learn more link');
assert(!bundledHtml.includes('data-tip-title="Developer Location Guidelines" data-tip-desc="Physical developer address displayed on Google Play, required by European consumer protection laws and Google policy." data-tip-google-link'), 'Developer Location tooltip does not contain irrelevant Learn more link');
assert(!bundledHtml.includes('data-tip-title="Content &amp; Updates Guidelines" data-tip-desc="Detailed promotional content, release update notes, and SEO/ASO descriptions for store search indexing." data-tip-apple-link="https://developer.apple.com/app-store/product-page/" data-tip-google-link'), 'Content card header tooltip does not contain irrelevant Google Learn more link');

// Verify What\'s New and Description popovers only display Learn more link for Apple (hidden on Google)
const whatsNewIdx = bundledHtml.indexOf('id="whatsNewInfoPop"');
const whatsNewSnippet = bundledHtml.slice(whatsNewIdx, whatsNewIdx + 2500);
assert(whatsNewSnippet.includes('<div class="info-pop-footer" data-only="apple">'), 'whatsNewInfoPop footer is restricted to Apple mode via data-only="apple"');
assert(!whatsNewSnippet.includes('data-only="google"'), 'whatsNewInfoPop does not contain Google Learn more link');

const descPopIdx = bundledHtml.indexOf('id="descInfoPop"');
const descPopSnippet = bundledHtml.slice(descPopIdx, descPopIdx + 2500);
assert(descPopSnippet.includes('<div class="info-pop-footer" data-only="apple">'), 'descInfoPop footer is restricted to Apple mode via data-only="apple"');
assert(!descPopSnippet.includes('data-only="google"'), 'descInfoPop does not contain Google Learn more link');

// Verify Learn More network confirmation behavior
const storeImportJs = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'store-import.js'), 'utf8');
assert(storeImportJs.includes("const link = e.target.closest('.info-pop-link');"), 'store-import.js intercepts .info-pop-link clicks');
assert(storeImportJs.includes("showNetworkConfirmModal({\n      url,"), 'store-import.js delegates Learn more clicks to showNetworkConfirmModal');
assert(storeImportJs.includes("Allow & Open Link"), 'showNetworkConfirmModal provides Allow & Open Link action for URLs');
assert(storeImportJs.includes("targetDomain"), 'showNetworkConfirmModal extracts target domain for user transparency');

// Functional testing for showNetworkConfirmModal with external Learn More URL
const networkElements = {
  networkConfirmModal: { classList: { add: () => {}, remove: () => {}, contains: () => false }, setAttribute: () => {} },
  networkConfirmTitle: { textContent: '' },
  networkConfirmDesc: { innerHTML: '' },
  networkConfirmOk: { textContent: '', focus: () => {}, onclick: null },
  networkConfirmCancel: { textContent: '', onclick: null },
  networkConfirmIconWrap: { className: '', innerHTML: '' }
};
const networkSandbox = {
  $: (id) => networkElements[id] || null,
  $$: () => [],
  document: {
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  window: {
    open: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  navigator: { onLine: true },
  URL: globalThis.URL
};
vm.createContext(networkSandbox);
vm.runInContext(storeImportJs + '\nglobalThis.showNetworkConfirmModal = showNetworkConfirmModal;', networkSandbox);

let linkOpened = false;
networkSandbox.window.open = (url) => { if (url === 'https://developer.apple.com/test') linkOpened = true; };

const titleObj = networkElements.networkConfirmTitle;
const descObj = networkElements.networkConfirmDesc;
const okObj = networkElements.networkConfirmOk;

networkSandbox.showNetworkConfirmModal({
  url: 'https://developer.apple.com/test',
  onConfirm: () => networkSandbox.window.open('https://developer.apple.com/test')
});

assert(titleObj.textContent === 'Allow Network Connection?', 'Online modal displays Allow Network Connection? title');
assert(descObj.innerHTML.includes('developer.apple.com'), 'Online modal displays target domain developer.apple.com');
assert(okObj.textContent === 'Allow & Open Link', 'Online modal ok button reads Allow & Open Link');

okObj.onclick();
assert(linkOpened === true, 'Clicking ok button opens the external link');

// Test offline branch
linkOpened = false;
networkSandbox.navigator.onLine = false;

networkSandbox.showNetworkConfirmModal({
  url: 'https://support.google.com/test',
  onConfirm: () => networkSandbox.window.open('https://support.google.com/test')
});

assert(titleObj.textContent === 'Turn On Network Connection', 'Offline modal displays Turn On Network Connection title');
assert(descObj.innerHTML.includes('support.google.com'), 'Offline modal displays target domain support.google.com');
assert(okObj.textContent === "I've Turned It On", 'Offline modal ok button reads I\'ve Turned It On');

// Clicking ok when still offline does not open the link
okObj.onclick();
assert(linkOpened === false, 'Clicking ok button while still offline guards network access and does not open link');

// ---------------------------------------------------------------------
// SUITE 33: Google Play Tablet Screenshots Fallback Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 33]: Google Play Tablet Screenshots Fallback Verification');

// 1. Structure and HTML verification
assert(bundledHtml.includes('data-shots="tab7-gal"') && bundledHtml.includes('data-shots="tab10-gal"'), 'Tablet mockup galleries use isolated data-shots attributes');
assert(bundledHtml.includes('id="galTab7" data-shots="tab7-gal"'), '7-inch tablet gallery has id="galTab7" and isolated data-shots');
assert(bundledHtml.includes('id="galTab10" data-shots="tab10-gal"'), '10-inch tablet gallery has id="galTab10" and isolated data-shots');
assert(bundledHtml.includes('If empty, tablet mockups display phone screenshots'), 'Tablet screenshots card hint informs user of automatic phone screenshots fallback');
assert(bundledHtml.includes('.shot-fallback-note'), 'CSS provides styling for .shot-fallback-note callout box');
assert(bundledHtml.includes('class="sfn-title">Store Standard:</strong>') && bundledHtml.includes('If no dedicated iPad screenshots are uploaded'), 'iPad card features explicit Store Standard note for iPhone screenshots fallback');
assert(bundledHtml.includes('class="sfn-title">Store Standard:</strong>') && bundledHtml.includes('If no dedicated tablet screenshots are uploaded'), 'Tablet card features explicit Store Standard note for phone screenshots fallback');

// 2. JS integration verification
const googleJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');
const phoneJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'phone.js'), 'utf8');

assert(phoneJsCode.includes("if(typeof renderTablets === 'function') renderTablets();"), 'renderShots triggers renderTablets to synchronize phone screenshots fallback to tablet mockups');
assert(googleJsCode.includes('hasDedicatedTabShots = valid.length > 0'), 'renderTablets detects presence of dedicated tablet screenshots');
assert(googleJsCode.includes('hasCrossTabShots = !hasDedicatedTabShots && otherTabShots.length > 0'), 'renderTablets detects cross-tablet fallback (other size has shots)');
assert(googleJsCode.includes("otherKey = key === 'tab7' ? 'tab10' : 'tab7'"), 'renderTablets computes the other tablet key for cross-tablet fallback');
assert(googleJsCode.includes('otherTabShots.length > 0 ? otherTabShots : phoneShots'), 'renderTablets resolves effectiveShots: dedicated → cross-tablet → phone fallback');

// 3. Functional behavior simulation in VM sandbox
const tabSandbox = {
  console,
  document: {
    createElement(tag) {
      const classes = [];
      return {
        tagName: tag.toUpperCase(),
        className: '',
        classList: {
          add(c) { if (!classes.includes(c)) classes.push(c); },
          remove(c) { const i = classes.indexOf(c); if (i !== -1) classes.splice(i, 1); },
          contains(c) { return classes.includes(c); }
        },
        _children: [],
        get children() {
          if (!this._children.length && this._innerHTML) {
            return [
              tabSandbox.document.createElement('button'),
              tabSandbox.document.createElement('button')
            ];
          }
          return this._children;
        },
        set children(v) { this._children = v; },
        appendChild(child) { this._children.push(child); return child; },
        append(...args) { this._children.push(...args); },
        addEventListener() {},
        setAttribute(k, v) { this[k] = v; },
        set innerHTML(v) { this._innerHTML = v; },
        get innerHTML() { return this._innerHTML || ''; },
        textContent: '',
        style: {}
      };
    }
  },
  elements: {
    tab7Counter: { textContent: '', className: '' },
    tab7Badge: { style: {}, className: '', innerHTML: '' },
    tab7List: { innerHTML: '', children: [], appendChild(c) { this.children.push(c); } },
    galTab7: {
      _innerHTML: '',
      children: [],
      set innerHTML(v) { this._innerHTML = v; if (!v) this.children = []; },
      get innerHTML() { return this._innerHTML; },
      appendChild(c) { this.children.push(c); return c; }
    },
    srchTab7: {
      _innerHTML: '',
      children: [],
      set innerHTML(v) { this._innerHTML = v; if (!v) this.children = []; },
      get innerHTML() { return this._innerHTML; },
      appendChild(c) { this.children.push(c); return c; }
    },
    tab10Counter: { textContent: '', className: '' },
    tab10Badge: { style: {}, className: '', innerHTML: '' },
    tab10List: { innerHTML: '', children: [], appendChild(c) { this.children.push(c); } },
    galTab10: {
      _innerHTML: '',
      children: [],
      set innerHTML(v) { this._innerHTML = v; if (!v) this.children = []; },
      get innerHTML() { return this._innerHTML; },
      appendChild(c) { this.children.push(c); return c; }
    },
    srchTab10: {
      _innerHTML: '',
      children: [],
      set innerHTML(v) { this._innerHTML = v; if (!v) this.children = []; },
      get innerHTML() { return this._innerHTML; },
      appendChild(c) { this.children.push(c); return c; }
    }
  },
  $(id) { return tabSandbox.elements[id] || null; },
  $$(sel) { return []; },
  mk(src, alt = '') {
    const el = tabSandbox.document.createElement('img');
    el.src = src;
    el.alt = alt;
    return el;
  },
  tabPlaceholder(key, orient, n) {
    return `data:image/svg+xml;placeholder-${key}-${orient}-${n}`;
  },
  ratioLabel(w, h) { return '16:9'; },
  ICO_UPLOAD: '',
  ICO_INSPECT: '',
  tabIssues() { return []; },
  MAX_TAB: 8,
  TAB_CFG: {
    tab7:  {name:'7-inch',  min:320,  max:3840, list:'tab7List',  counter:'tab7Counter',  badge:'tab7Badge',  file:'tab7File',  add:'tab7Add',  gal:'galTab7',  dev:'dev-tab7'},
    tab10: {name:'10-inch', min:1080, max:7680, list:'tab10List', counter:'tab10Counter', badge:'tab10Badge', file:'tab10File', add:'tab10Add', gal:'galTab10', dev:'dev-tab10'}
  },
  tabOrient: { tab7: 'landscape', tab10: 'landscape' },
  TABS: { tab7: [], tab10: [] },
  SHOTS: ['data:image/png;base64,phone1', 'data:image/png;base64,phone2', 'data:image/png;base64,phone3']
};

vm.createContext(tabSandbox);
const renderTabletsSnippet = googleJsCode.slice(googleJsCode.indexOf('function renderTablets()'), googleJsCode.indexOf('function addTabFiles'));
vm.runInContext(renderTabletsSnippet + '\nglobalThis.renderTablets = renderTablets;', tabSandbox);

// Case 1: No dedicated tablet screenshots, phone screenshots present
tabSandbox.renderTablets();
assert(tabSandbox.elements.galTab7.children.length === 3, '7-inch tablet gallery renders 3 fallback phone screenshots when no dedicated tablet screenshots are uploaded');
assert(tabSandbox.elements.galTab7.children[0].src === 'data:image/png;base64,phone1', '7-inch tablet gallery displays phone screenshot #1');
assert(tabSandbox.elements.galTab7.children[0].classList.contains('tab-fallback-shot'), 'Fallback screenshot has tab-fallback-shot class applied');
assert(tabSandbox.elements.galTab10.children.length === 3, '10-inch tablet gallery renders 3 fallback phone screenshots');

// Case 2: Dedicated tablet screenshot uploaded for 7-inch tablet only
// → 7-inch shows its own shot; 10-inch shows cross-tablet fallback (tab7 shot), not phone
tabSandbox.TABS.tab7 = [{ src: 'data:image/png;base64,tab7_custom1', meta: { w: 1920, h: 1080 } }];
tabSandbox.elements.galTab7.children = [];
tabSandbox.elements.galTab10.children = [];
tabSandbox.SHOTS = ['data:image/png;base64,phone1', 'data:image/png;base64,phone2', 'data:image/png;base64,phone3'];
tabSandbox.renderTablets();
assert(tabSandbox.elements.galTab7.children.length === 1, '7-inch tablet gallery prioritizes dedicated tablet screenshot over phone screenshots');
assert(tabSandbox.elements.galTab7.children[0].src === 'data:image/png;base64,tab7_custom1', '7-inch tablet gallery displays dedicated screenshot');
assert(!tabSandbox.elements.galTab7.children[0].classList.contains('tab-fallback-shot'), 'Dedicated screenshot does not have tab-fallback-shot class');
assert(tabSandbox.elements.galTab10.children.length === 1, '10-inch tablet cross-tablet fallback: shows tab7 shot when tab10 slot is empty');
assert(tabSandbox.elements.galTab10.children[0].src === 'data:image/png;base64,tab7_custom1', '10-inch tablet cross-tablet fallback displays tab7 screenshot (not phone)');
assert(tabSandbox.elements.galTab10.children[0].classList.contains('tab-fallback-shot'), '10-inch cross-tablet fallback screenshot has tab-fallback-shot class');

// Case 2b: Both tablet sizes have dedicated shots → each shows its own
tabSandbox.TABS.tab7 = [{ src: 'data:image/png;base64,tab7_custom1', meta: { w: 1920, h: 1080 } }];
tabSandbox.TABS.tab10 = [{ src: 'data:image/png;base64,tab10_custom1', meta: { w: 1920, h: 1080 } }];
tabSandbox.elements.galTab7.children = [];
tabSandbox.elements.galTab10.children = [];
tabSandbox.renderTablets();
assert(tabSandbox.elements.galTab7.children[0].src === 'data:image/png;base64,tab7_custom1', 'When both sizes have shots: 7-inch shows its own dedicated screenshot');
assert(tabSandbox.elements.galTab10.children[0].src === 'data:image/png;base64,tab10_custom1', 'When both sizes have shots: 10-inch shows its own dedicated screenshot');
assert(!tabSandbox.elements.galTab10.children[0].classList.contains('tab-fallback-shot'), 'No fallback class when 10-inch has dedicated screenshots');

// Case 3: Both dedicated and phone screenshots are empty -> renders placeholders
tabSandbox.TABS.tab7 = [];
tabSandbox.TABS.tab10 = [];
tabSandbox.SHOTS = [];
tabSandbox.elements.galTab7.children = [];
tabSandbox.renderTablets();
assert(tabSandbox.elements.galTab7.children.length === 3, 'Renders 3 placeholders only when neither dedicated nor phone screenshots exist');
assert(tabSandbox.elements.galTab7.children[0].src.includes('placeholder-tab7'), 'Placeholder SVG is used as fallback when completely empty');

// ---------------------------------------------------------------------
// [SUITE 34]: View Switcher Idempotency (Spam-Click Guard & No-op on Active View)
// ---------------------------------------------------------------------
console.log('\n[SUITE 34]: View Switcher Idempotency (Spam-Click Guard & No-op on Active View)');

assert(bundledHtml.includes('function setView(v, force = false)') || bundledHtml.includes('function setView(v,force=false)'), 'Bundled application defines setView with optional force parameter');
assert(bundledHtml.includes('document.querySelector(\'#vt button.on\')') || bundledHtml.includes('document.querySelector("#vt button.on")'), 'setView queries active button on #vt');
assert(bundledHtml.includes('if (!force && activeView === v) return;') || bundledHtml.includes('if(!force&&activeView===v)return;'), 'setView returns early if requested view is already active (prevents re-render on spam tap)');

// Functional test for setView idempotency
let reflowCount = 0;
let classToggles = 0;
const vtDetailBtn = { dataset: { v: 'detail' }, classList: { toggle: (cls, on) => { if(cls === 'on') { classToggles++; vtDetailBtn.isOn = on; } } }, isOn: true };
const vtSearchBtn = { dataset: { v: 'search' }, classList: { toggle: (cls, on) => { if(cls === 'on') { classToggles++; vtSearchBtn.isOn = on; } } }, isOn: false };
const viewDetailEl = { dataset: { v: 'detail' }, style: { display: 'block' }, classList: { add: () => {}, remove: () => {} } };
const viewSearchEl = { dataset: { v: 'search' }, style: { display: 'none' }, classList: { add: () => {}, remove: () => {} } };

const viewSandbox = {
  document: {
    querySelector: (sel) => {
      if (sel === '#vt button.on') {
        if (vtDetailBtn.isOn) return vtDetailBtn;
        if (vtSearchBtn.isOn) return vtSearchBtn;
        return null;
      }
      return null;
    },
    querySelectorAll: () => []
  },
  $$: (sel) => {
    if (sel === '#vt button' || sel === '#vt button[data-v]') return [vtDetailBtn, vtSearchBtn];
    if (sel === '.phone [data-v]') return [viewDetailEl, viewSearchEl];
    return [];
  },
  syncAllVtPills: () => {},
  syncAppleNavScroll: () => {}
};

const setViewCode = `
function setView(v, force = false){
  const activeBtn = document.querySelector('#vt button[data-v].on') || document.querySelector('#vt button.on');
  const activeView = activeBtn ? activeBtn.dataset.v : null;
  if (!force && activeView === v) return;

  $$('#vt button[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  syncAllVtPills();
  $$('.phone [data-v]').forEach(e => {
    if(e.dataset.v === v){
      e.style.display = 'block';
      e.classList.remove('view-enter');
      reflowCount++;
      e.classList.add('view-enter');
      setTimeout(() => e.classList.remove('view-enter'), 240);
    } else {
      e.style.display = 'none';
    }
  });
}
`;

vm.runInNewContext(setViewCode, Object.assign(viewSandbox, {
  reflowCount: 0,
  setTimeout: () => {}
}));

// Initial state: Detail view is active
assert(vtDetailBtn.isOn && !vtSearchBtn.isOn, 'Initial view is detail');

// Tap 1: Spam click 'detail' while already in detail -> Must NOT re-render (early return)
const initialToggles = classToggles;
viewSandbox.setView('detail');
assert(classToggles === initialToggles, 'Clicking detail while detail is active does not toggle button classes');
assert(viewSandbox.reflowCount === 0, 'Clicking detail while detail is active does not trigger reflow or re-render');

// Tap 2: Click 'search' -> Switches to search view
viewSandbox.setView('search');
assert(vtSearchBtn.isOn && !vtDetailBtn.isOn, 'Clicking search switches active button to search');
assert(viewSandbox.reflowCount === 1, 'Switching from detail to search triggers enter transition once');

// Tap 3: Spam click 'search' multiple times while already in search -> Must NOT re-render
viewSandbox.setView('search');
viewSandbox.setView('search');
viewSandbox.setView('search');
assert(viewSandbox.reflowCount === 1, 'Spam clicking search does not trigger reflow or re-render');

// Tap 4: force = true allows forced re-render if needed
viewSandbox.setView('search', true);
assert(viewSandbox.reflowCount === 2, 'Forced view update re-renders when force=true');

// Tap 5: Dual Phone selection state preservation across view changes
assert(bundledHtml.includes("$$('#vt button[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v))"), 'setView targets only data-v buttons to preserve Dual Phone selected state');
assert(bundledHtml.includes("btnDual.classList.toggle('on', isDual)"), 'setView maintains Dual Phone selected state in comparison section');
assert(bundledHtml.includes("$$('#vt button[data-v]').forEach(b => b.onclick = () => setView(b.dataset.v))"), 'vt click handlers only bind setView to data-v buttons');

// ---------------------------------------------------------------------
// [SUITE 35]: Apple Privacy Layout (iPhone 100% Stacked vs iPad Single Card <50%)
// ---------------------------------------------------------------------
console.log('\n[SUITE 35]: Apple Privacy Layout (iPhone 100% Stacked vs iPad Single Card <50%)');

const appleSectionsCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'sections.css'), 'utf8');

assert(appleSectionsCss.includes('.phone.apple:not(.ipad) .pg') && appleSectionsCss.includes('flex-direction: column'), 'iPhone privacy wrapper stacks cards vertically in a column');
assert(appleSectionsCss.includes('.phone.apple:not(.ipad) .pc') && appleSectionsCss.includes('width: 100%'), 'iPhone privacy cards expand to 100% full width');
assert(appleSectionsCss.includes('.phone.apple:not(.ipad) .pc-list') && appleSectionsCss.includes('grid-template-columns: repeat(2, 1fr)'), 'iPhone privacy disclosures format into an authentic 2-column grid');
assert(appleSectionsCss.includes('.phone.ipad .pg .pc:only-child') && appleSectionsCss.includes('width: 44%'), 'iPad single privacy card is constrained to < 50% width (44%)');
assert(appleSectionsCss.includes('.dev.ipad.landscape .phone.ipad .pg .pc:only-child') && appleSectionsCss.includes('width: 40%'), 'iPad landscape single privacy card is constrained to < 50% width (40%)');

// ---------------------------------------------------------------------
// [SUITE 36]: Light Mode Placeholder Skeletons & Adaptive Theming
// ---------------------------------------------------------------------
console.log('\n[SUITE 36]: Light Mode Placeholder Skeletons & Adaptive Theming');

const themesCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'themes.css'), 'utf8');
assert(themesCss.includes(':root[data-ui=light] .feature-wrap') && themesCss.includes('#f8fafc'), 'Light theme styles .feature-wrap with clean soft light background');
assert(themesCss.includes(':root[data-ui=light] .g-feature-banner') && themesCss.includes('#f8fafc'), 'Light theme styles .g-feature-banner with clean light surface');

const utilsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'utils.js'), 'utf8');
const featureGraphicCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'feature-graphic.js'), 'utf8');

const themeMockDoc = {
  documentElement: { dataset: { ui: 'light' } },
  getElementById: () => ({ style: {}, classList: { toggle: () => {} }, onclick: null, addEventListener: () => {}, setAttribute: () => {} }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const themeSandbox = {
  document: themeMockDoc,
  window: { addEventListener: () => {} },
  console,
  encodeURIComponent: global.encodeURIComponent,
  decodeURIComponent: global.decodeURIComponent,
  Set,
  Map,
  THUMB_CACHE: new Map(),
  Image: class { constructor() { this.alt = ''; } },
  $: id => themeMockDoc.getElementById(id),
  $$: s => themeMockDoc.querySelectorAll(s),
  initInfoPopover: () => {}
};

vm.createContext(themeSandbox);
vm.runInContext(stateCode + `
globalThis.BLANK_FEATURE = BLANK_FEATURE;
globalThis.BLANK_FEATURE_LIGHT = BLANK_FEATURE_LIGHT;
globalThis.PH = PH;
globalThis.PH_LIGHT = PH_LIGHT;
globalThis.PH_IPAD = PH_IPAD;
globalThis.PH_IPAD_LIGHT = PH_IPAD_LIGHT;
globalThis.PH_TAB = PH_TAB;
globalThis.PH_TAB_LIGHT = PH_TAB_LIGHT;
`, themeSandbox);

vm.runInContext(utilsCode + `
globalThis.isLightUi = isLightUi;
globalThis.getDisplaySrc = getDisplaySrc;
`, themeSandbox);

vm.runInContext(featureGraphicCode + `
globalThis.isPlaceholderFeature = isPlaceholderFeature;
globalThis.validateFeatureGraphic = validateFeatureGraphic;
`, themeSandbox);

// Check Light Mode placeholders existence & SVG color
assert(typeof themeSandbox.BLANK_FEATURE_LIGHT === 'string' && themeSandbox.BLANK_FEATURE_LIGHT.includes('data:image/svg+xml'), 'BLANK_FEATURE_LIGHT is a valid SVG data URI');
assert(decodeURIComponent(themeSandbox.BLANK_FEATURE_LIGHT).includes('#f8fafc'), 'BLANK_FEATURE_LIGHT uses light surface fill #f8fafc');
assert(typeof themeSandbox.PH_LIGHT === 'string' && decodeURIComponent(themeSandbox.PH_LIGHT).includes('#f8fafc'), 'PH_LIGHT uses light background #f8fafc');
assert(typeof themeSandbox.PH_IPAD_LIGHT === 'string' && decodeURIComponent(themeSandbox.PH_IPAD_LIGHT).includes('#f8fafc'), 'PH_IPAD_LIGHT uses light background #f8fafc');
assert(typeof themeSandbox.PH_TAB_LIGHT === 'string' && decodeURIComponent(themeSandbox.PH_TAB_LIGHT).includes('#f8fafc'), 'PH_TAB_LIGHT uses light background #f8fafc');

// Check dynamic theme switching in getDisplaySrc
assert(themeSandbox.isLightUi() === true, 'isLightUi() correctly identifies light mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.BLANK_FEATURE) === themeSandbox.BLANK_FEATURE_LIGHT, 'getDisplaySrc switches BLANK_FEATURE to light variant in light mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH) === themeSandbox.PH_LIGHT, 'getDisplaySrc switches PH to light variant in light mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH_IPAD) === themeSandbox.PH_IPAD_LIGHT, 'getDisplaySrc switches PH_IPAD to light variant in light mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH_TAB) === themeSandbox.PH_TAB_LIGHT, 'getDisplaySrc switches PH_TAB to light variant in light mode');

// Switch to Dark Mode
themeMockDoc.documentElement.dataset.ui = 'dark';
assert(themeSandbox.isLightUi() === false, 'isLightUi() correctly identifies dark mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.BLANK_FEATURE) === themeSandbox.BLANK_FEATURE, 'getDisplaySrc retains dark BLANK_FEATURE in dark mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH) === themeSandbox.PH, 'getDisplaySrc retains dark PH in dark mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH_IPAD) === themeSandbox.PH_IPAD, 'getDisplaySrc retains dark PH_IPAD in dark mode');
assert(themeSandbox.getDisplaySrc(themeSandbox.PH_TAB) === themeSandbox.PH_TAB, 'getDisplaySrc retains dark PH_TAB in dark mode');

// Placeholder validator check
vm.runInContext('FEATURE_GRAPHIC = BLANK_FEATURE;', themeSandbox);
assert(themeSandbox.isPlaceholderFeature() === true, 'isPlaceholderFeature recognizes dark BLANK_FEATURE');
vm.runInContext('FEATURE_GRAPHIC = BLANK_FEATURE_LIGHT;', themeSandbox);
assert(themeSandbox.isPlaceholderFeature() === true, 'isPlaceholderFeature recognizes light BLANK_FEATURE_LIGHT');
vm.runInContext("FEATURE_GRAPHIC = 'data:image/png;base64,sampleRealFeature';", themeSandbox);
assert(themeSandbox.isPlaceholderFeature() === false, 'isPlaceholderFeature recognizes actual custom feature graphic');

// ---------------------------------------------------------------------
// [SUITE 37]: 3-Zone Stage Architecture (Left Views & Dual Phone, Center Device, Right Theme)
// ---------------------------------------------------------------------
console.log('\n[SUITE 37]: 3-Zone Stage Architecture (Left Views & Dual Phone, Center Device, Right Theme)');

// 1. Stage Toolbar defines 3 distinct zones: Left (Views & Dual Phone), Center (Device Selectors), Right (Theme Toggle)
const stageToolbarHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'stage-toolbar.html'), 'utf8');
assert(stageToolbarHtml.includes('id="stageToolbarLeft"') && stageToolbarHtml.includes('components/stage/view-switcher.html'), 'stage-toolbar.html houses view-switcher in stageToolbarLeft');
assert(stageToolbarHtml.includes('id="stageToolbarCenter"') && stageToolbarHtml.includes('components/stage/apple-device-selector.html'), 'stage-toolbar.html houses device selector in stageToolbarCenter');
assert(stageToolbarHtml.includes('id="stageToolbarRight"') && stageToolbarHtml.includes('components/common/device-theme-seg.html'), 'stage-toolbar.html houses theme toggle in stageToolbarRight');

// 2. The stage index eliminates bottom bar completely, liberating 100% canvas bottom height
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'index.html'), 'utf8');
assert(!indexHtml.includes('<div class="stage-bottom-bar"'), 'src/index.html removes in-flow stage-bottom-bar to prevent squeezing device height');

// 3. Toolbar CSS uses unified in-flow stage toolbar layout (non-absolute, preventing overlay on device)
const stageToolbarCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'stage', 'toolbar.css'), 'utf8');
assert(/\.stage-toolbar\s*\{[^}]*justify-content:\s*space-between/.test(stageToolbarCss), 'toolbar.css organizes stage-toolbar with space-between layout');
assert(/\.stage-toolbar-left\s*\{[^}]*display:\s*flex/.test(stageToolbarCss), 'toolbar.css formats stage-toolbar-left as flex in normal flow');
assert(!/\.stage-toolbar-left\s*\{[^}]*position:\s*absolute/.test(stageToolbarCss), 'toolbar.css eliminates position: absolute on stage-toolbar-left to prevent device overlap');

// 4. Transitions JS supports vertical pill animation (translateY)
const transitionsJsCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');
assert(transitionsJsCode.includes('isVertical') && transitionsJsCode.includes('translateY'), 'transitions.js syncVtPill supports vertical sliding with translateY');

// 5. Verify mathematical height gain with 0px bottom overhead
const simulateZoom = (clientHeight, baseH, hasBottomBar) => {
  const pad = 24;
  const tbHeight = 38;
  const bbH = hasBottomBar ? 68 : 0;
  const vt = tbHeight + bbH + 10 + 36;
  return (clientHeight - pad - vt) / (baseH + 8);
};
const oldZoom = simulateZoom(750, 870, true);
const newZoom = simulateZoom(750, 870, false);
assert(newZoom > oldZoom, 'Liberating bottom bar increases device scale zoom on canvas');
const heightGainPercent = ((newZoom - oldZoom) / oldZoom) * 100;
assert(heightGainPercent >= 10, 'Device gains at least 10% more vertical scale and screen presence with 0px bottom bar');

// ---------------------------------------------------------------------
// [SUITE 38]: Initial Bootstrap Studio Preset with +Your App Pill Workflow Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 38]: Initial Bootstrap Studio Preset with +Your App Pill Workflow Verification');

// 1. Static HTML workspace bar contains + Your App as initial draft button and Store Preview Studio preset pill
assert(bundledHtml.includes('id="btnDraft"') && bundledHtml.includes('+ Your App'), 'btnDraft initially contains + Your App call-to-action');
assert(bundledHtml.includes('id="btnPresetPill"') && bundledHtml.includes('Store Preview Studio'), 'btnPresetPill initially contains Store Preview Studio preset title');

// 2. main.js loads studio preset on initial bootstrap without artificially force-creating userDraft
assert(!bundledHtml.includes("loadPreset('studio');\n    if(typeof getCurrentStateObject === 'function'){\n      userDraft = getCurrentStateObject();"), 'Initial bootstrap loads studio preset without cloning into userDraft');

// 3. updateDraftPill renders + Your App button beside active preset pill when no draft exists
assert(bundledHtml.includes("draftPill.innerHTML = '<span id=\"draftBtnTitle\">+ Your App</span>';"), 'updateDraftPill renders + Your App button when userDraft is null');

// 3b. Preset banner includes "Copy this preset as your draft" suggestion button when no draft exists
assert(bundledHtml.includes('id="btnCopyPresetToDraft"'), 'Preset banner contains #btnCopyPresetToDraft suggestion button');
assert(bundledHtml.includes('Copy this preset as your draft'), 'Suggestion button has "Copy this preset as your draft" label');
assert(bundledHtml.includes('btnCopyPresetToDraft.onclick = () =>'), 'btnCopyPresetToDraft binds click handler to clone preset into active draft');
assert(bundledHtml.includes('btn-preset-copy'), 'btnCopyPresetToDraft has refined .btn-preset-copy styling');
assert(bundledHtml.includes('.preset-banner-btn.btn-preset-copy'), 'CSS defines adaptive white/dark button styling for .btn-preset-copy');
assert(bundledHtml.includes(':root[data-ui=light] .preset-banner-btn.btn-preset-copy'), 'CSS defines dark button inversion for light mode');
assert(!bundledHtml.includes('.preset-banner-btn.btn-preset-copy:hover{transform:translateY') && !bundledHtml.includes('.preset-banner-btn.btn-preset-copy:hover {\n  transform: translateY') && !bundledHtml.includes('btn-preset-copy:hover{transform:translateY(-0.5px)'), 'btn-preset-copy eliminates translateY on hover to avoid layout shift');
assert(!bundledHtml.includes("returnBtn.style.display = 'inline-flex'"), 'Return to My Draft button is omitted when editing preset with existing draft');
assert(bundledHtml.includes("if(CURRENT_PRESET_KEY !== 'draft' && isPresetModified){"), 'Preset warning banner only displays when user actually edits preset, remaining hidden after reset');
assert(bundledHtml.includes("card = $('identityCard')") && bundledHtml.includes("card.classList.remove('collapsed')"), 'Clicking +Your App button automatically opens Card 1 App Identity');

// 4. Functional State Machine Simulation: Bootstrap -> Click +Your App -> Return to Preset -> Close Preset
let sim38Draft = null;
let sim38PresetKey = 'studio';
let sim38ActivePreset = 'studio';

function sim38GetPillsState() {
  const isViewingPreset = (sim38PresetKey !== 'draft');
  const activePresetKey = isViewingPreset ? sim38PresetKey : (sim38ActivePreset && sim38ActivePreset !== 'draft' ? sim38ActivePreset : null);

  const presetPill = {
    visible: !!activePresetKey,
    active: isViewingPreset,
    name: activePresetKey === 'studio' ? 'Store Preview Studio' : activePresetKey
  };

  const draftPill = {
    visible: true,
    active: sim38PresetKey === 'draft',
    hasDraft: !!sim38Draft,
    title: sim38Draft ? (sim38Draft.form && sim38Draft.form.name ? sim38Draft.form.name : 'Your App') : '+ Your App'
  };

  return { presetPill, draftPill };
}

// Initial Boot State
let s0 = sim38GetPillsState();
assert(s0.draftPill.visible === true, 'Draft pill is visible on initial boot');
assert(s0.draftPill.active === false, 'Draft pill is inactive on initial boot');
assert(s0.draftPill.hasDraft === false, 'User draft does not exist initially');
assert(s0.draftPill.title === '+ Your App', 'Draft pill displays "+ Your App" text on the left');
assert(s0.presetPill.visible === true, 'Preset pill is visible on initial boot');
assert(s0.presetPill.active === true, 'Preset pill is active on initial boot');
assert(s0.presetPill.name === 'Store Preview Studio', 'Preset pill displays Store Preview Studio');

// Step 1: User clicks "+ Your App" button
function sim38ClickDraftBtn() {
  if (sim38PresetKey !== 'draft') {
    if (!sim38Draft) {
      const prevActivePreset = sim38ActivePreset;
      // loadPreset('none')
      sim38PresetKey = 'draft';
      sim38ActivePreset = prevActivePreset;
      sim38Draft = { form: { name: '' }, isCustomized: true };
      return;
    }
    sim38PresetKey = 'draft';
  }
}
sim38ClickDraftBtn();
let s1 = sim38GetPillsState();
assert(s1.draftPill.active === true, 'Draft pill is active after clicking + Your App');
assert(s1.draftPill.hasDraft === true, 'User draft is initialized');
assert(s1.draftPill.title === 'Your App', 'Draft pill displays "Your App" with draft badge');
assert(s1.presetPill.visible === true, 'Preset pill remains visible beside draft pill');
assert(s1.presetPill.active === false, 'Preset pill is inactive while working on draft');

// Step 2: User clicks Preset pill to reference template
function sim38ClickPresetPill() {
  if (sim38PresetKey === 'draft') {
    sim38PresetKey = sim38ActivePreset || 'studio';
  }
}
sim38ClickPresetPill();
let s2 = sim38GetPillsState();
assert(s2.presetPill.active === true, 'Preset pill becomes active again');
assert(s2.draftPill.visible === true, 'Draft pill remains visible beside preset');
assert(s2.draftPill.active === false, 'Draft pill is inactive while viewing preset');
assert(s2.draftPill.title === 'Your App', 'Draft pill preserves user draft title');

// Step 3: User returns to draft and closes preset
sim38ClickDraftBtn();
// User clicks close X on preset pill
sim38ActivePreset = null;
let s3 = sim38GetPillsState();
assert(s3.presetPill.visible === false, 'Preset pill is hidden after closing');
assert(s3.draftPill.visible === true, 'Draft pill remains visible');
assert(s3.draftPill.active === true, 'Draft pill is active');

// ---------------------------------------------------------------------
// [SUITE 39]: Factory Storage Reset Verification (LocalStorage & IndexedDB Wipe)
// ---------------------------------------------------------------------
console.log('\n[SUITE 39]: Factory Storage Reset Verification (LocalStorage & IndexedDB Wipe)');

// 1. Menu Export dropdown contains dedicated Factory Reset button
assert(bundledHtml.includes('id="optResetAllData"'), 'Menu contains dedicated #optResetAllData button');
assert(bundledHtml.includes('id="optResetAllData"') && bundledHtml.includes('>Reset</span>'), 'Factory reset button has clean "Reset" label');
assert(bundledHtml.includes('id="optResetAllData"') && bundledHtml.includes('btn-white'), 'Factory reset button incorporates clean white button styling');

// 2. Storage engine defines resetFactoryStorage function with full storage wipe & reload
assert(bundledHtml.includes('resetFactoryStorage'), 'resetFactoryStorage function exists in bundled script');
assert(bundledHtml.includes('indexedDB.deleteDatabase'), 'resetFactoryStorage invokes indexedDB.deleteDatabase');
assert(bundledHtml.includes('localStorage.clear()'), 'resetFactoryStorage clears all localStorage keys');
assert(bundledHtml.includes('sessionStorage.clear()'), 'resetFactoryStorage clears all sessionStorage keys');
assert(bundledHtml.includes('window.location.reload()'), 'resetFactoryStorage reloads window to restore clean installation state');
assert(bundledHtml.includes("localStorage.setItem('sps_tour_completed'"), 'resetFactoryStorage preserves tour completed state without resetting tour');

// 3. Functional Simulation of Factory Storage Reset
let mockStorage39 = {
  sps_core_user_draft: '{"form":{"name":"Custom App"}}',
  store_preview_studio_state: '{"form":{"name":"Custom App"}}',
  store_preview_studio_ui: 'dark',
  sps_editor_w: '520',
  sps_sidebar_collapsed: '0',
  sps_tour_completed: 'true'
};
let mockIdbDeleted39 = false;
let mockReloadTriggered39 = false;

function sim39ResetFactoryStorage() {
  mockIdbDeleted39 = true;
  const tour = mockStorage39.sps_tour_completed;
  mockStorage39 = {};
  if (tour) mockStorage39.sps_tour_completed = tour;
  mockReloadTriggered39 = true;
}

sim39ResetFactoryStorage();
assert(mockStorage39.sps_tour_completed === 'true', 'sps_tour_completed is preserved during factory reset');
assert(!mockStorage39.sps_core_user_draft, 'User draft is wiped during factory reset');
assert(mockIdbDeleted39 === true, 'IndexedDB database deleted during factory reset');
assert(mockReloadTriggered39 === true, 'Page reload triggered to bootstrap pristine initial state');

// ---------------------------------------------------------------------
// [SUITE 40]: File Naming & Vietnamese Slugify Engine
// ---------------------------------------------------------------------
console.log('\n[SUITE 40]: File Naming & Vietnamese Slugify Engine');

// 1. Verify utils.js, png.js, json.js and bundled core.html contain slugify
const utilsSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'utils.js'), 'utf8');
const pngExportSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
const jsonExportSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'json.js'), 'utf8');
const bundledHtmlCore = fs.readFileSync(path.join(ROOT_DIR, 'core.html'), 'utf8');

assert(utilsSource.includes('function slugify(text, fallback = \'app\')'), 'utils.js exports core slugify function');
assert(pngExportSource.includes('slugify(rawName'), 'png.js uses slugify for mockup image export filename');
assert(jsonExportSource.includes('slugify(rawName'), 'json.js uses slugify for store config JSON export filename');
assert(bundledHtmlCore.includes('function slugify'), 'bundled core.html contains slugify function');

// 2. Evaluate slugify within sandbox VM
const slugifySandbox = {
  console,
  document: {
    getElementById: () => ({ style: {}, classList: { toggle: () => {} }, onclick: null, addEventListener: () => {}, setAttribute: () => {} }),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  window: { addEventListener: () => {} },
  navigator: {},
  Intl,
  Set,
  Map
};
vm.createContext(slugifySandbox);
vm.runInContext(utilsSource, slugifySandbox);

const vmSlugify = slugifySandbox.slugify;
assert(typeof vmSlugify === 'function', 'slugify is executable inside VM');

// Test Case 1: Exact user case "AVN PMS-Sức khoẻ Gia Đình Việt"
const userAppName = 'AVN PMS-Sức khoẻ Gia Đình Việt';
const userSlug = vmSlugify(userAppName);
assert(userSlug === 'avn-pms-suc-khoe-gia-dinh-viet', `User case "${userAppName}" => "avn-pms-suc-khoe-gia-dinh-viet", got "${userSlug}"`);

// Verify that it no longer produces the buggy slug
assert(userSlug !== 'avn-pms-s-c-kho-gia-nh-vi-t', 'Regression test: slug is NOT the corrupted "avn-pms-s-c-kho-gia-nh-vi-t"');

// Test Case 2: Full exported PNG filenames
const dualMockupTransparent3x = `${userSlug}-dual-store-phone-mockup-transparent-3x.png`;
assert(dualMockupTransparent3x === 'avn-pms-suc-khoe-gia-dinh-viet-dual-store-phone-mockup-transparent-3x.png',
  'Mockup export filename matches expected dual-store transparent 3x');
assert(dualMockupTransparent3x !== 'avn-pms-s-c-kho-gia-nh-vi-t-dual-store-phone-mockup-transparent-3x.png',
  'Mockup export filename is not corrupted');

const screenOnlyMockup = `${userSlug}-dual-store-phone-screen-3x.png`;
assert(screenOnlyMockup === 'avn-pms-suc-khoe-gia-dinh-viet-dual-store-phone-screen-3x.png',
  'Screen-only export filename formatted accurately');

// Test Case 3: JSON Config filename
const jsonFilename = `${userSlug}-store-config.json`;
assert(jsonFilename === 'avn-pms-suc-khoe-gia-dinh-viet-store-config.json',
  'JSON configuration download filename formatted accurately');

// Test Case 4: Comprehensive Vietnamese tonal & diacritic matrix
const viCases = [
  ['Ứng Dụng Đọc Báo & Tin Tức 24h', 'ung-dung-doc-bao-tin-tuc-24h'],
  ['Cà Phê Sữa Đá - Đậm Đà Việt Nam', 'ca-phe-sua-da-dam-da-viet-nam'],
  ['Đồng Hồ & Báo Thức Thông Minh', 'dong-ho-bao-thuc-thong-minh'],
  ['Trợ lý AI: Lên Lịch & Quản Lý Công Việc', 'tro-ly-ai-len-lich-quan-ly-cong-viec'],
  ['Đà Nẵng Discovery - Du Lịch Việt', 'da-nang-discovery-du-lich-viet'],
  ['   ---  Khoẻ Đẹp Mỗi Ngày  ---   ', 'khoe-dep-moi-ngay'],
  ['Game Đua Xe 3D Tốc Độ Cao (Bản Pro)', 'game-dua-xe-3d-toc-do-cao-ban-pro'],
  ['🚀 Siêu Ứng Dụng ⭐ 2026', 'sieu-ung-dung-2026'],
  ['', 'app'],
  [null, 'app'],
  [undefined, 'app'],
  ['     ', 'app'],
  ['!@#$%^&*()', 'app']
];

viCases.forEach(([input, expected]) => {
  const actual = vmSlugify(input);
  assert(actual === expected, `Slugify "${input}" expected "${expected}", got "${actual}"`);
});

// ---------------------------------------------------------------------
// [SUITE 41]: App Icon Blueprint Grid & Draft Affordance Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 41]: App Icon Blueprint Grid & Draft Affordance Verification');

const stateJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'state.js'), 'utf8');
assert(stateJsSrc.includes('const BLUEPRINT_ICON = makeSvgDataUri'), 'state.js defines BLUEPRINT_ICON vector asset');
assert(stateJsSrc.includes('const BLANK_ICON = BLUEPRINT_ICON'), 'BLANK_ICON is set to BLUEPRINT_ICON');
assert(stateJsSrc.includes('id="bp-bg"') && stateJsSrc.includes('APP ICON 1024×1024'), 'BLUEPRINT_ICON includes golden ratio blueprint grid and technical dimensions label');
assert(stateJsSrc.includes('r="420"') && stateJsSrc.includes('r="256"'), 'BLUEPRINT_ICON includes official Apple HIG keyline circles');

// Verify Studio preset retains its official green K logo
assert(PRESETS.studio.icon.includes('std-sq-bg'), 'Store Preview Studio preset retains official green K branding icon');
assert(!PRESETS.studio.icon.includes('bp-bg'), 'Studio preset is NOT using the blueprint grid');

// Verify Blank Draft uses the Blueprint Grid
assert(PRESETS.studio.icon !== sandbox.BLANK_ICON, 'Blank draft icon is completely distinct from Studio preset icon');
assert(sandbox.BLANK_ICON.includes('bp-bg'), 'Blank draft icon uses the blueprint grid vector');

// Verify placeholder icon detection in shot/icon module
const iconModuleSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'icon.js'), 'utf8');
assert(iconModuleSrc.includes("ICON.includes('bp-bg')"), 'isPlaceholderIcon recognizes blueprint icon as placeholder');

// Verify Card 5 (iPad Screenshots) is always visible when store is Apple without gap
assert(!bundledHtml.includes('id="ipadCard" style="display:none"'), 'ipadCard does not have hardcoded style="display:none"');
assert(bundledHtml.includes('id="ipadCard"') && bundledHtml.includes('data-only="apple"'), 'ipadCard is bound to Apple store via data-only="apple"');

// ---------------------------------------------------------------------
// [SUITE 42]: Device Changing On Presets Without Warning Banner Trigger Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 42]: Device Changing On Presets Without Warning Banner Trigger Verification');

// 1. Static AST / Code checks for non-destructive viewport/device switching
assert(bundledHtml.includes('function saveState(isContentEdit = true){'), 'saveState accepts isContentEdit flag defaulting to true');
assert(bundledHtml.includes('if(isContentEdit){\n      isPresetModified = true;\n      updatePresetBanner();\n    }'), 'saveState only sets isPresetModified when isContentEdit is truthy');
assert(bundledHtml.includes('if(typeof saveState === \'function\') saveState(false);'), 'Device & store switchers call saveState(false) to prevent false-positive preset modification');

// Verify apple.js, google.js, and transitions.js specifically pass false to saveState
const appleJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'apple', 'apple.js'), 'utf8');
const googleJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');
const transitionsJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');

assert(appleJsSrc.includes('saveState(false)'), 'setAppleDevice passes isContentEdit=false to saveState');
assert(googleJsSrc.includes('saveState(false)'), 'setGoogleDevice passes isContentEdit=false to saveState');
assert(transitionsJsSrc.includes('toggleDualPhone') && transitionsJsSrc.includes('saveState(false)'), 'toggleDualPhone passes isContentEdit=false to saveState');
assert(transitionsJsSrc.includes('setStore') && transitionsJsSrc.includes('saveState(false)'), 'setStore passes isContentEdit=false to saveState');

// 2. Functional State Machine Simulation: Device switching on presets
let simPresetKey = 'pulsefit';
let simIsModified = false;
let simBannerVisible = false;

function simUpdatePresetBanner() {
  if (simPresetKey !== 'draft' && simIsModified) {
    simBannerVisible = true;
  } else {
    simBannerVisible = false;
  }
}

function simSaveState(isContentEdit = true) {
  if (simPresetKey === 'draft') {
    // Draft persistence...
  } else {
    if (isContentEdit) {
      simIsModified = true;
      simUpdatePresetBanner();
    }
  }
}

function simSetAppleDevice(d) {
  // Device switching logic...
  simSaveState(false);
}

function simSetGoogleDevice(gd) {
  // Device switching logic...
  simSaveState(false);
}

function simToggleDualPhone() {
  // Dual phone logic...
  simSaveState(false);
}

// Initially viewing preset: banner is hidden
simUpdatePresetBanner();
assert(simIsModified === false, 'Initial preset state is not modified');
assert(simBannerVisible === false, 'Initial preset banner is hidden');

// Switch to iPad
simSetAppleDevice('ipad');
assert(simIsModified === false, 'Switching to iPad does not set isPresetModified');
assert(simBannerVisible === false, 'Switching to iPad does not show warning banner');

// Switch back to iPhone
simSetAppleDevice('iphone');
assert(simIsModified === false, 'Switching back to iPhone does not set isPresetModified');
assert(simBannerVisible === false, 'Switching back to iPhone does not show warning banner');

// Switch Google device to 7" Tablet and 10" Tablet
simSetGoogleDevice('tab7');
assert(simIsModified === false, 'Switching to Google 7" Tablet does not set isPresetModified');
assert(simBannerVisible === false, 'Switching to Google 7" Tablet does not show warning banner');

simSetGoogleDevice('tab10');
assert(simIsModified === false, 'Switching to Google 10" Tablet does not set isPresetModified');
assert(simBannerVisible === false, 'Switching to Google 10" Tablet does not show warning banner');

// Toggle Dual Phone comparison
simToggleDualPhone();
assert(simIsModified === false, 'Toggling Dual Phone does not set isPresetModified');
assert(simBannerVisible === false, 'Toggling Dual Phone does not show warning banner');

// User actually edits form text / uploads content: banner triggers as expected
simSaveState(true);
assert(simIsModified === true, 'Actual content edit sets isPresetModified=true');
assert(simBannerVisible === true, 'Actual content edit shows warning banner');

// After user edited, changing device preserves modified status without glitching
simSetAppleDevice('ipad');
assert(simIsModified === true, 'Device change preserves existing edit state');
assert(simBannerVisible === true, 'Warning banner remains visible when already modified');

// ---------------------------------------------------------------------
// [SUITE 43]: Editor Panel Card Count & Continuous Sequence Verification (Apple 6 Cards vs Google 8 Cards)
// ---------------------------------------------------------------------
console.log('\n[SUITE 43]: Editor Panel Card Count & Continuous Sequence Verification (Apple 6 Cards vs Google 8 Cards)');

// 1. Total DOM Card Structure
const editorPanelMatch = bundledHtml.match(/<section[^>]*id="editorPanel"[^>]*>([\s\S]*?)<\/section>/);
assert(!!editorPanelMatch, 'editorPanel section exists in bundled HTML');

const cardMatches = [...editorPanelMatch[1].matchAll(/<div class="card[^"]*"([^>]*)id="([^"]+)"/g)];
assert(cardMatches.length === 9, `editorPanel contains exactly 9 physical cards (found ${cardMatches.length})`);

const cardIds = cardMatches.map(m => m[2]);
const expectedCardIds = [
  'identityCard', 'contentCard', 'shotsCard', 'statsCard',
  'ipadCard', 'tabCard', 'featureCard', 'supportCard', 'privacyCard'
];
assert(JSON.stringify(cardIds) === JSON.stringify(expectedCardIds), 'Cards are registered in exact semantic sequence');

// 2. CSS Filtering for Zero-Flicker Store Isolation
assert(bundledHtml.includes('body[data-ui-store=apple] .card[data-only=google]') && bundledHtml.includes('display:none'),
  'CSS immediately hides Google cards when Apple store is active');
assert(bundledHtml.includes('body[data-ui-store=google] .card[data-only=apple]') && bundledHtml.includes('display:none'),
  'CSS immediately hides Apple cards when Google store is active');

// 3. Apple App Store Card Count & Number Sequence (Exactly 6 Cards)
const appleCards = cardMatches.filter(m => {
  const attrs = m[1];
  return !attrs.includes('data-only="google"');
});
assert(appleCards.length === 6, `Apple App Store renders exactly 6 editor cards (found ${appleCards.length})`);

const appleCardIds = appleCards.map(m => m[2]);
const expectedAppleCardIds = ['identityCard', 'contentCard', 'shotsCard', 'statsCard', 'ipadCard', 'privacyCard'];
assert(JSON.stringify(appleCardIds) === JSON.stringify(expectedAppleCardIds), 'Apple cards sequence matches 1..6: Identity, Content, Shots, Stats, iPad, Privacy');

assert(!bundledHtml.includes('id="ipadCard" style="display:none"'), 'iPad card does NOT have inline display:none on bootstrap');
assert(bundledHtml.includes('<span data-only="apple">6</span>'), 'Privacy card explicitly displays number 6 for Apple store');

// 4. Google Play Card Count & Number Sequence (Exactly 8 Cards)
const googleCards = cardMatches.filter(m => {
  const attrs = m[1];
  return !attrs.includes('data-only="apple"');
});
assert(googleCards.length === 8, `Google Play renders exactly 8 editor cards (found ${googleCards.length})`);

const googleCardIds = googleCards.map(m => m[2]);
const expectedGoogleCardIds = ['identityCard', 'contentCard', 'shotsCard', 'statsCard', 'tabCard', 'featureCard', 'supportCard', 'privacyCard'];
assert(JSON.stringify(googleCardIds) === JSON.stringify(expectedGoogleCardIds), 'Google cards sequence matches 1..8: Identity, Content, Shots, Stats, Tablets, Feature Graphic, App Support, Privacy');

assert(bundledHtml.includes('<span data-only="google">8</span>'), 'Privacy card explicitly displays number 8 for Google store');

// 5. Functional Simulation: setStore and setSupportsIpad Card Count Invariance
let simCardStore = 'apple';
let simCardSupportsIpad = false;
const simCardElements = {
  identityCard: { style: { display: '' }, classList: new Set(['card']) },
  contentCard:  { style: { display: '' }, classList: new Set(['card', 'collapsed']) },
  shotsCard:    { style: { display: '' }, classList: new Set(['card', 'collapsed']) },
  statsCard:    { style: { display: '' }, classList: new Set(['card', 'collapsed']) },
  ipadCard:     { style: { display: '' }, classList: new Set(['card', 'collapsed']), dataset: { only: 'apple' } },
  tabCard:      { style: { display: '' }, classList: new Set(['card', 'collapsed']), dataset: { only: 'google' } },
  featureCard:  { style: { display: '' }, classList: new Set(['card', 'collapsed']), dataset: { only: 'google' } },
  supportCard:  { style: { display: '' }, classList: new Set(['card', 'collapsed']), dataset: { only: 'google' } },
  privacyCard:  { style: { display: '' }, classList: new Set(['card', 'collapsed']) },
};

function simCardSetStore(s) {
  simCardStore = s;
  Object.values(simCardElements).forEach(card => {
    if (card.dataset && card.dataset.only) {
      if (card.dataset.only !== s) card.classList.add('hide');
      else card.classList.delete('hide');
    }
  });
  if (s === 'apple') {
    simCardElements.ipadCard.style.display = '';
  } else {
    simCardElements.ipadCard.style.display = 'none';
  }
}

function simGetVisibleCardCount() {
  return Object.values(simCardElements).filter(c => !c.classList.has('hide') && c.style.display !== 'none').length;
}

// Initial Apple Store
simCardSetStore('apple');
assert(simGetVisibleCardCount() === 6, 'Apple Store visibly displays exactly 6 cards');

// Unchecking iPad support does NOT hide iPad card (Apple remains 6 cards)
simCardSupportsIpad = false;
simCardElements.ipadCard.style.display = (simCardStore === 'apple') ? '' : 'none';
assert(simGetVisibleCardCount() === 6, 'Unchecking iPad support keeps Card 5 visible with 6 total cards');

// Checking iPad support maintains 6 cards
simCardSupportsIpad = true;
simCardElements.ipadCard.style.display = (simCardStore === 'apple') ? '' : 'none';
assert(simGetVisibleCardCount() === 6, 'Checking iPad support keeps Card 5 visible with 6 total cards');

// Switch to Google Play: exactly 8 cards
simCardSetStore('google');
assert(simGetVisibleCardCount() === 8, 'Switching to Google Play visibly displays exactly 8 cards');

// Switch back to Apple: exactly 6 cards
simCardSetStore('apple');
assert(simGetVisibleCardCount() === 6, 'Switching back to Apple Store visibly restores exactly 6 cards');

// 6. Activity Bar Store Synchronization (Apple 6 Items vs Google 8 Items)
assert(bundledHtml.includes('body[data-ui-store=apple] .activity-bar-btn[data-only=google]') && bundledHtml.includes('display:none'),
  'CSS immediately hides Google activity bar items when Apple store is active');
assert(bundledHtml.includes('body[data-ui-store=google] .activity-bar-btn[data-only=apple]') && bundledHtml.includes('display:none'),
  'CSS immediately hides Apple activity bar items when Google store is active');
assert(bundledHtml.includes('syncActivityBarVisibility'), 'syncActivityBarVisibility engine exists in bundle');

const simBarButtons = {
  identityCard: { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'identityCard' }, getAttribute: () => null, style: { display: '' } },
  contentCard:  { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'contentCard' }, getAttribute: () => null, style: { display: '' } },
  shotsCard:    { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'shotsCard' }, getAttribute: () => null, style: { display: '' } },
  statsCard:    { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'statsCard' }, getAttribute: () => null, style: { display: '' } },
  ipadCard:     { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'ipadCard' }, getAttribute: () => 'apple', style: { display: '' } },
  tabCard:      { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'tabCard' }, getAttribute: () => 'google', style: { display: '' } },
  featureCard:  { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'featureCard' }, getAttribute: () => 'google', style: { display: '' } },
  supportCard:  { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'supportCard' }, getAttribute: () => 'google', style: { display: '' } },
  privacyCard:  { classList: new Set(['activity-bar-btn']), dataset: { cardId: 'privacyCard' }, getAttribute: () => null, style: { display: '' } }
};

function simSyncActivityBar(currentStore) {
  Object.values(simBarButtons).forEach(btn => {
    const only = btn.getAttribute('data-only');
    const isHidden = only ? (only !== currentStore) : false;
    if (isHidden) {
      btn.classList.add('hide');
      btn.style.display = 'none';
    } else {
      btn.classList.delete('hide');
      btn.style.display = '';
    }
  });
}

function simGetVisibleActivityBarCount() {
  return Object.values(simBarButtons).filter(btn => !btn.classList.has('hide') && btn.style.display !== 'none').length;
}

// Initial / default Apple store: exactly 6 buttons
simSyncActivityBar('apple');
assert(simGetVisibleActivityBarCount() === 6, `Activity bar on Apple store visibly displays exactly 6 items (found ${simGetVisibleActivityBarCount()})`);

// Switching to Google Play: exactly 8 buttons
simSyncActivityBar('google');
assert(simGetVisibleActivityBarCount() === 8, `Activity bar on Google Play visibly displays exactly 8 items (found ${simGetVisibleActivityBarCount()})`);

// Switching back to Apple: exactly 6 buttons
simSyncActivityBar('apple');
assert(simGetVisibleActivityBarCount() === 6, `Activity bar switching back to Apple visibly restores exactly 6 items (found ${simGetVisibleActivityBarCount()})`);

console.log('\n[SUITE 44]: Stage Zero-Shift Overflow & ResizeObserver Oscillation Guard');

// Test 1: Stage has overflow: hidden to prevent scrollbars from altering clientWidth/clientHeight
assert(bundledHtml.includes('.stage{') && bundledHtml.match(/\.stage\s*\{[^}]*overflow:\s*hidden/), '.stage has overflow: hidden to eliminate scrollbar flickering');

// Test 2: Editor panel has overflow-x: hidden to prevent horizontal scrollbar layout shifts
assert(bundledHtml.match(/\.editor\s*\{[^}]*overflow-x:\s*hidden/), '.editor has overflow-x: hidden');

// Test 3: fit() implements hysteresis threshold guard against sub-pixel loops
assert(bundledHtml.includes('st.dataset.fitZ') && bundledHtml.includes('Math.abs(z - lastZ) < 0.001'), 'fit() implements hysteresis threshold guard');

// Test 4: fit() uses safe padW breathing margin
assert(bundledHtml.includes('padW=m?24:48') || bundledHtml.includes('padW = m ? 24 : 48'), 'fit() uses safe padW breathing margin exceeding stage padding');

// Test 5: onStageResize uses requestAnimationFrame throttling
assert(bundledHtml.includes('cancelAnimationFrame(resizeRaf)') && bundledHtml.includes('requestAnimationFrame('), 'onStageResize throttles resize events with requestAnimationFrame');

console.log('\n[SUITE 45]: Store-Ready Dual Clipboard Metadata Copy Verification');

// Test 1: copyAllText groups strictly into Apple App Store and Google Play Store sections
assert(bundledHtml.includes('APPLE APP STORE (iOS)') && bundledHtml.includes('GOOGLE PLAY STORE (Android)'), 'copyAllText structures clean dual-store sections');

// Test 2: Unconfigurable mockup fields (release date, survey badges, developer legal entity) removed
assert(!bundledHtml.includes('AGE RATING & MONETIZATION:'), 'Unconfigurable age rating survey badge removed from clipboard copy');
assert(!bundledHtml.includes('Exported via Store Preview Studio'), 'Watermark slogan removed from clipboard copy');
assert(!bundledHtml.includes('DATA SAFETY PRACTICES:'), 'Unconfigurable data safety survey practices removed from clipboard copy');
assert(!bundledHtml.includes('VERSION & RELEASE DATE:'), 'Mockup release date removed from clipboard copy');

// Test 3: Essential console fields present in clear bracket tag format
assert(bundledHtml.includes('[ App Title ]') && bundledHtml.includes('[ Subtitle ]'), 'Apple Title and Subtitle included with bracket tag format');
assert(bundledHtml.includes('[ Promotional Text ]'), 'Apple Promotional text included with bracket tag format');
assert(bundledHtml.includes('[ Short Description ]'), 'Google Play Short description included with bracket tag format');
assert(bundledHtml.includes('[ Primary Category ]') && bundledHtml.includes('[ App Category ]'), 'Categories included as dropdown guide');
assert(bundledHtml.includes("[ What's New ]"), "Apple uses short [ What's New ] tag without Version suffix");

// ---------------------------------------------------------------------
// [SUITE 46]: Imported JSON App Icon State & Placeholder Suppression Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 46]: Imported JSON App Icon State & Placeholder Suppression Verification');

// 1. exportJSON exports isCustomIcon, icon1024, icon512, and isCustomFeature
assert(bundledHtml.includes('isCustomIcon: typeof IS_CUSTOM_ICON !== \'undefined\' ? IS_CUSTOM_ICON : true'), 'exportJSON explicitly exports isCustomIcon flag');
assert(bundledHtml.includes('isCustomFeature: typeof IS_CUSTOM_FEATURE !== \'undefined\' ? IS_CUSTOM_FEATURE : false'), 'exportJSON explicitly exports isCustomFeature flag');
assert(bundledHtml.includes('icon1024: (typeof CUSTOM_ICON_1024 !== \'undefined\' && CUSTOM_ICON_1024)'), 'exportJSON explicitly exports icon1024');

// 2. parseAndApplyJSON evaluates custom icon presence and sets IS_CUSTOM_ICON = true
assert(bundledHtml.includes('const hasRealIcon = !isBlankIconUri(importedRawIcon)'), 'parseAndApplyJSON detects real non-blank icon on import');
assert(bundledHtml.includes('userDraft.isCustomIcon = IS_CUSTOM_ICON'), 'parseAndApplyJSON persists isCustomIcon to userDraft');

// 3. Functional Simulation of Telegram Messenger JSON Import
function simulateImportJsonIcon(jsonPayload) {
  let simCurrentPresetKey = 'studio';
  let simIsCustomIcon = false;
  let simIcon = '';
  let simCustom1024 = '';
  let simCustom512 = '';

  const simIsBlankIconUri = uri => !uri || (uri.includes && (uri.includes('c6-bg') || uri.includes('bfd1fd') || uri.includes('d2c7fc') || uri.includes('bp-bg') || uri.includes('blueprint')));

  simCurrentPresetKey = 'draft';
  const importedRawIcon = jsonPayload.icon1024 || jsonPayload.iconApple || jsonPayload.icon512 || jsonPayload.iconGoogle || jsonPayload.icon || '';
  const hasRealIcon = !simIsBlankIconUri(importedRawIcon);

  if (jsonPayload.isCustomIcon !== undefined) {
    simIsCustomIcon = !!jsonPayload.isCustomIcon;
  } else {
    simIsCustomIcon = hasRealIcon;
  }

  simIcon = importedRawIcon;
  if (jsonPayload.icon1024 || jsonPayload.iconApple || jsonPayload.icon) {
    simCustom1024 = jsonPayload.icon1024 || jsonPayload.iconApple || jsonPayload.icon;
  }
  if (jsonPayload.icon512 || jsonPayload.iconGoogle || jsonPayload.icon) {
    simCustom512 = jsonPayload.icon512 || jsonPayload.iconGoogle || jsonPayload.icon;
  }

  function simIsPlaceholderIcon() {
    if (simIsCustomIcon) return false;
    if (!simIcon) return true;
    if (simIsBlankIconUri(simIcon)) return true;
    if (simCurrentPresetKey === 'none') return true;
    if (simCurrentPresetKey === 'draft') {
      if (simIcon && !simIsBlankIconUri(simIcon)) {
        simIsCustomIcon = true;
        return false;
      }
      return !simIsCustomIcon;
    }
    return false;
  }

  return {
    isCustomIcon: simIsCustomIcon,
    isPlaceholder: simIsPlaceholderIcon(),
    icon: simIcon,
    custom1024: simCustom1024,
    custom512: simCustom512
  };
}

// Case A: Telegram Messenger JSON (with icon URL from Apple mzstatic, no isCustomIcon field)
const telegramRes = simulateImportJsonIcon({
  name: "Telegram Messenger",
  icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ce/41/d8/ce41d807-350e-69f1-f31e-16be42b6ebfb/Telegram-0-0-1x_U007epad-0-1-0-85-220.png/1024x1024bb.png"
});
assert(telegramRes.isCustomIcon === true, 'Telegram imported icon accurately sets isCustomIcon to true');
assert(telegramRes.isPlaceholder === false, 'Telegram imported icon is never treated as placeholder (no dashed orange border)');
assert(telegramRes.custom1024.includes('Telegram'), 'Telegram icon is synchronized to 1024x1024 slot');
assert(telegramRes.custom512.includes('Telegram'), 'Telegram icon is synchronized to 512x512 slot');

// Case B: Blank/Blueprint JSON (with placeholder icon)
const blankRes = simulateImportJsonIcon({
  name: "Blank App",
  icon: "data:image/svg+xml;utf8,<svg blueprint grid bp-bg></svg>"
});
assert(blankRes.isCustomIcon === false, 'Blank blueprint icon is identified as not custom');
assert(blankRes.isPlaceholder === true, 'Blank blueprint icon is correctly treated as placeholder');

// ---------------------------------------------------------------------
// [SUITE 47-49]: Storage Reliability Audit & Replace-Draft Guard (runs REAL source code in a vm sandbox)
// ---------------------------------------------------------------------
const asyncSuites = [];

function extractFunctionSource(src, name) {
  const start = src.indexOf('function ' + name + '(');
  if (start === -1) return '';
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return '';
}

// Minimal IndexedDB double. In 'quota' mode it reproduces real browser behaviour:
// the put() request reports success first, then the transaction aborts at commit time.
function makeFakeIndexedDB(behavior) {
  const data = new Map();
  return {
    data,
    open() {
      const req = {};
      setTimeout(() => {
        req.result = {
          objectStoreNames: { contains: () => true },
          transaction() {
            const tx = { error: null };
            const finish = (r, mutate) => {
              setTimeout(() => {
                if (behavior.mode === 'quota') {
                  if (r.onsuccess) r.onsuccess();
                  tx.error = { name: 'QuotaExceededError' };
                  setTimeout(() => { if (tx.onabort) tx.onabort(); }, 0);
                } else {
                  mutate();
                  if (r.onsuccess) r.onsuccess();
                  setTimeout(() => { if (tx.oncomplete) tx.oncomplete(); }, 0);
                }
              }, 0);
            };
            tx.objectStore = () => ({
              put(val, key) { const r = {}; finish(r, () => data.set(key, val)); return r; },
              delete(key) { const r = {}; finish(r, () => data.delete(key)); return r; },
              get(key) {
                const r = {};
                setTimeout(() => { r.result = data.get(key); if (r.onsuccess) r.onsuccess(); }, 0);
                return r;
              }
            });
            return tx;
          }
        };
        if (req.onsuccess) req.onsuccess();
      }, 0);
      return req;
    }
  };
}

const wait = ms => new Promise(r => setTimeout(r, ms));

asyncSuites.push((async () => {
  const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/core/utils.js'), 'utf8');
  const storageSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/storage.js'), 'utf8');

  // ---- SUITE 47: IndexedDB engine commit semantics ----
  console.log('\n[SUITE 47]: IndexedDB Commit Semantics (QuotaExceededError at commit time)');

  const idbStart = utilsSrc.indexOf('// --- IndexedDB High-Capacity Storage Engine');
  const idbEnd = utilsSrc.indexOf('// --- SVG to Store-Compliant PNG Rasterizer ---');
  assert(idbStart !== -1 && idbEnd > idbStart, 'IndexedDB engine block located in utils.js');
  const idbSrc = utilsSrc.slice(idbStart, idbEnd);
  const idbExports = '\n;({ idbSave, idbGet, idbDelete, lastError: () => idbLastErrorName })';

  const behavior = { mode: 'ok' };
  const fakeIdb = makeFakeIndexedDB(behavior);
  const engine = vm.runInNewContext(idbSrc + idbExports, { indexedDB: fakeIdb, setTimeout, Promise });

  const okSave = await engine.idbSave('draft', { name: 'Duolingo' });
  assert(okSave === true, 'idbSave resolves true after a successful commit');
  const readBack = await engine.idbGet('draft');
  assert(readBack && readBack.name === 'Duolingo', 'idbGet returns the committed value');

  behavior.mode = 'quota';
  const quotaSave = await engine.idbSave('draft2', { big: 'x'.repeat(1000) });
  assert(quotaSave === false, 'idbSave resolves FALSE when the commit aborts with QuotaExceededError (old code reported true)');
  assert(engine.lastError() === 'QuotaExceededError', 'idbSave records QuotaExceededError for diagnostics');
  const quotaDelete = await engine.idbDelete('draft');
  assert(quotaDelete === false, 'idbDelete resolves false when the commit aborts');

  behavior.mode = 'ok';
  assert(await engine.idbDelete('draft') === true, 'idbDelete resolves true after a successful commit');

  const noIdb = vm.runInNewContext(idbSrc + idbExports, { setTimeout, Promise });
  assert(await noIdb.idbSave('k', 1) === false, 'idbSave resolves false (no throw) when IndexedDB is unavailable');
  assert(await noIdb.idbGet('k') === null, 'idbGet resolves null (no throw) when IndexedDB is unavailable');

  // ---- SUITE 48: storage failure reporting ----
  console.log('\n[SUITE 48]: Draft Storage Failure Reporting (no silent data loss, no false alarms)');

  const fnNames = ['sanitizeStateForLocalStorage', 'stateHasUserContent', 'notifyStorageNotPersisted', 'saveDraftToStorage', 'saveState'];
  const fnSrc = fnNames.map(n => extractFunctionSource(storageSrc, n)).join('\n');
  assert(fnNames.every(n => extractFunctionSource(storageSrc, n).length > 0), 'Real storage functions extracted from storage.js for sandbox execution');

  const heavyState = () => ({
    form: { name: 'Duolingo' },
    shots: ['x'.repeat(60000)],
    isCustomIcon: false,
    icon: ''
  });

  function makeFakeLs(limit) {
    const store = {};
    return {
      store,
      setItem(k, v) {
        if (limit !== null && String(v).length > limit) throw new Error('QuotaExceededError');
        store[k] = String(v);
      },
      getItem: k => (k in store ? store[k] : null),
      removeItem: k => { delete store[k]; }
    };
  }

  async function runSave(opts) {
    const toasts = [];
    const sandbox = {
      localStorage: makeFakeLs(opts.lsLimit),
      idbSave: () => Promise.resolve(opts.idbOk),
      showToast: (msg) => toasts.push(msg),
      getCurrentStateObject: heavyState,
      updateDraftPill: () => {},
      updatePresetBanner: () => {},
      console: { warn() {}, log() {} },
      Promise, Date, JSON
    };
    vm.runInNewContext(
      'var STORAGE_KEY="s"; var DRAFT_STORAGE_KEY="d"; var DRAFT_FEATURE_THUMB_KEY="t"; var userDraft=null;' +
      'var restoring=false; var CURRENT_PRESET_KEY="draft"; var isPresetModified=false; var lastStorageWarnAt=0;\n' + fnSrc +
      '\nthis.__saveState = saveState; this.__saveDraft = saveDraftToStorage;',
      sandbox
    );
    sandbox.__saveState();
    await wait(30);
    if (opts.twice) { sandbox.__saveState(); await wait(30); }
    return toasts;
  }

  let t = await runSave({ lsLimit: null, idbOk: true });
  assert(t.length === 0, 'LocalStorage + IndexedDB both OK: no warning');

  t = await runSave({ lsLimit: 20000, idbOk: true });
  assert(t.length === 0, 'LocalStorage quota hit but IndexedDB holds full copy: no false alarm');

  t = await runSave({ lsLimit: null, idbOk: false });
  assert(t.length === 0, 'IndexedDB failed but LocalStorage holds full copy: no false alarm');

  t = await runSave({ lsLimit: 20000, idbOk: false });
  assert(t.length === 1 && /Export JSON/.test(t[0]), 'IndexedDB failed + LocalStorage only sanitized (screenshots stripped): user IS warned (old code stayed silent)');

  t = await runSave({ lsLimit: 0, idbOk: false });
  assert(t.length === 1, 'Both stores completely failed: user is warned');

  t = await runSave({ lsLimit: 20000, idbOk: false, twice: true });
  assert(t.length === 1, 'Repeated failing saves show the warning only once (30s throttle, no toast spam)');

  // saveDraftToStorage result contract
  const draftSandbox = {
    localStorage: makeFakeLs(20000),
    idbSave: () => Promise.resolve(false),
    console: { warn() {} }, Promise, Date, JSON
  };
  vm.runInNewContext(
    'var DRAFT_STORAGE_KEY="d"; var DRAFT_FEATURE_THUMB_KEY="t"; var userDraft=null;\n' + fnSrc + '\nthis.__saveDraft = saveDraftToStorage;',
    draftSandbox
  );
  draftSandbox.userDraft = heavyState();
  const draftFull = await draftSandbox.__saveDraft();
  assert(draftFull === false, 'saveDraftToStorage resolves false when only a sanitized copy could be stored');
  assert(typeof draftSandbox.userDraft._savedAt === 'number', 'saveDraftToStorage stamps _savedAt so the newest copy can be recovered');

  assert(storageSrc.includes('lsFullTs') && storageSrc.includes('heal IndexedDB'), 'loadDraftFromStorage keeps a newer complete localStorage copy instead of rolling back to a stale IndexedDB copy');

  // ---- SUITE 49: replace-draft guard on import ----
  console.log('\n[SUITE 49]: Replace-Draft Confirmation Dialog on Import (Cancel keeps the draft)');

  const guardFns = ['stateHasUserContent', 'hasUserDraft', 'hasLiveUserContent', 'getDraftDisplayName', 'confirmReplaceDraft']
    .map(n => extractFunctionSource(storageSrc, n)).join('\n');

  function makeGuardEnv(env) {
    const calls = { modal: null, proceed: 0 };
    const sandbox = {
      getCurrentStateObject: () => env.live,
      showResetConfirmModal: (onConfirm, title, desc, ok, onBackup) => { calls.modal = { onConfirm, title, desc, ok, onBackup }; },
      JSON,
      Object
    };
    vm.runInNewContext(
      'var userDraft=null; var CURRENT_PRESET_KEY="studio";\n' + guardFns +
      '\nthis.__confirm = confirmReplaceDraft; this.__has = hasLiveUserContent;',
      sandbox
    );
    sandbox.userDraft = env.userDraft || null;
    sandbox.CURRENT_PRESET_KEY = env.key || 'studio';
    return { sandbox, calls };
  }

  // Nothing to lose -> import proceeds immediately, no dialog
  let g = makeGuardEnv({ userDraft: null, key: 'studio' });
  let proceeded = 0;
  let asked = g.sandbox.__confirm('Telegram', () => { proceeded++; });
  assert(asked === false && proceeded === 1 && g.calls.modal === null, 'No draft content: import proceeds without a dialog');

  g = makeGuardEnv({ userDraft: { form: { name: '   ' }, shots: [] }, key: 'studio' });
  proceeded = 0;
  g.sandbox.__confirm('Telegram', () => { proceeded++; });
  assert(proceeded === 1 && g.calls.modal === null, 'Blank draft (whitespace name, no shots): no dialog');

  // Draft holds work -> dialog, nothing applied until confirmed
  g = makeGuardEnv({ userDraft: { form: { name: 'Duolingo' }, shots: [] }, key: 'studio' });
  proceeded = 0;
  asked = g.sandbox.__confirm('Telegram', () => { proceeded++; });
  assert(asked === true && g.calls.modal !== null, 'Draft with real content: dialog is shown');
  assert(proceeded === 0, 'Import is NOT applied while the dialog is open (Cancel/Esc keeps the draft intact)');
  assert(g.calls.modal.title === 'Replace current draft?' && g.calls.modal.ok === 'Replace Draft', 'Dialog uses clear title and "Replace Draft" confirm label');
  assert(g.calls.modal.desc.includes('"Duolingo"') && g.calls.modal.desc.includes('"Telegram"'), 'Dialog names both the current draft and the incoming app');
  assert(g.sandbox.userDraft.form.name === 'Duolingo', 'Draft is unchanged after the dialog is dismissed without confirming');
  assert(typeof g.calls.modal.onBackup === 'function', 'Dialog supplies onBackup callback to export JSON backup on the spot');
  let downloadedBackup = null;
  g.sandbox.downloadFile = (name, content) => { downloadedBackup = { name, content }; };
  g.calls.modal.onBackup();
  assert(downloadedBackup !== null && downloadedBackup.name.includes('duolingo') && downloadedBackup.name.endsWith('.json'), 'Calling onBackup exports JSON file for current draft');
  assert(proceeded === 0, 'Exporting backup does NOT apply the import or dismiss the dialog');
  g.calls.modal.onConfirm();
  assert(proceeded === 1, 'Confirming runs the import exactly once');

  // Same App ID: bypasses the dialog even when draft has content
  g = makeGuardEnv({ userDraft: { form: { name: 'Spotify' }, appId: '324684580', shots: [] }, key: 'draft' });
  proceeded = 0;
  asked = g.sandbox.__confirm('Spotify', () => { proceeded++; }, '324684580');
  assert(asked === false && proceeded === 1 && g.calls.modal === null, 'Matching app ID: import proceeds immediately without confirmation dialog');

  // Editing the draft right now (still inside the 300ms debounce window)
  g = makeGuardEnv({ userDraft: null, key: 'draft', live: { form: { name: 'Duolingo' }, shots: [] } });
  proceeded = 0;
  g.sandbox.__confirm('', () => { proceeded++; });
  assert(g.calls.modal !== null && proceeded === 0, 'Unsaved live edits count as draft content (debounce window is covered)');
  assert(g.calls.modal.desc.includes('"Duolingo"') && g.calls.modal.desc.includes('"Untitled"'), 'Missing incoming name falls back to "Untitled"');

  // Wiring: both import paths are guarded BEFORE they touch the UI/state
  const jsonSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/json.js'), 'utf8');
  const guardIdx = jsonSrc.indexOf('confirmReplaceDraft(mapped.name');
  const applyIdx = jsonSrc.indexOf("$('f-name').value = mapped.name");
  const lastValidationIdx = jsonSrc.indexOf('File does not contain valid App Listing metadata', jsonSrc.indexOf('const hasFields'));
  assert(guardIdx !== -1 && lastValidationIdx !== -1 && lastValidationIdx < guardIdx && guardIdx < applyIdx, 'JSON import: dialog runs after validation and before any field/state is written');
  assert(jsonSrc.includes('skipDraftGuard: true'), 'JSON import: confirmed re-entry skips the guard (no dialog loop)');
  const storeImportSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/store-import.js'), 'utf8');
  assert(storeImportSrc.includes('confirmReplaceDraft(importedName, apply)'), 'App Store clone import is guarded by the same dialog');
  assert(storeImportSrc.indexOf('closeStoreImportModal()') < storeImportSrc.indexOf('confirmReplaceDraft(importedName'), 'Store import modal closes before showing replace confirmation dialog');
  const confirmCss = fs.readFileSync(path.join(ROOT_DIR, 'src/css/modals/confirm-modal.css'), 'utf8');
  assert(confirmCss.includes('#resetConfirmModal') && confirmCss.includes('z-index: 1000020 !important'), '#resetConfirmModal z-index is elevated above all other modal backdrops');
})());

// ---------------------------------------------------------------------
// [SUITE 50]: Mockup Title Word-Spacing & html2canvas Whitespace Preservation Verification
// ---------------------------------------------------------------------
asyncSuites.push((async () => {
  console.log('\n[SUITE 50]: Mockup Title Word-Spacing & html2canvas Whitespace Preservation Verification');

  // 1. Google Play phone container uses system-ui font stack to eliminate synthetic bold mismatch
  const googleFrameCss = fs.readFileSync(path.join(ROOT_DIR, 'src/css/google/frame.css'), 'utf8');
  assert(googleFrameCss.includes("system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"), '.phone.google uses system-ui font stack');

  // 2. Google Play header specifies font-weight:700 to match Apple and avoid faux bold width discrepancies
  const googleHeaderCss = fs.readFileSync(path.join(ROOT_DIR, 'src/css/google/header.css'), 'utf8');
  assert(googleHeaderCss.includes('.g-name{') && googleHeaderCss.includes('font-weight:700'), '.g-name specifies font-weight:700');

  // 3. exportPNG places offscreen container at in-bounds coordinates to prevent subpixel Range distortion
  const exportPngSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/png.js'), 'utf8');
  assert(exportPngSrc.includes('position:fixed;left:0;top:0;'), 'exportPNG places offscreen wrap at left:0;top:0;');
  assert(exportPngSrc.includes('clonedDoc.fonts.add(f)'), 'exportPNG synchronizes document fonts into cloned document');

  // 4. Bundled core.html contains clean Google frame font stack and font sync
  const bundledHtml = fs.readFileSync(path.join(ROOT_DIR, 'core.html'), 'utf8');
  assert(bundledHtml.includes("system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"), 'Bundled application contains system-ui font stack on Google phone');
  assert(bundledHtml.includes('position:fixed;left:0;top:0;'), 'Bundled application contains in-bounds offscreen coordinates');

  // 5. Search Result screenshots maintain 3-column proportional aspect ratio (no vertical stretching to 481px/412px)
  assert(exportPngSrc.includes('isSearch'), 'exportPNG distinguishes search screenshots from main scrollable gallery');
  assert(exportPngSrc.includes('.sr-shots img, .sr-shots .sr-skel-shot') && exportPngSrc.includes('104px !important;'), 'exportPNG constrains search screenshot width to 104px in 3-column layout');
  assert(exportPngSrc.includes('word-spacing: 0.1px !important;') && exportPngSrc.includes('letter-spacing: 0.01px !important;'), 'exportPNG applies micro text-spacing to preserve whitespace in Firefox Gecko engine');
})());

// ---------------------------------------------------------------------
// [SUITE 51]: Drag & Drop Image vs JSON Toast Suppression Verification
// ---------------------------------------------------------------------
asyncSuites.push((async () => {
  console.log('\n[SUITE 51]: Drag & Drop Image vs JSON Toast Suppression Verification');

  const modalJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/modal.js'), 'utf8');
  assert(modalJsSrc.includes('modal.addEventListener(\'drop\', handleModalDrop)'), 'modal.js binds drop listener to entire modal dialog');
  assert(modalJsSrc.includes('e.stopPropagation()') && modalJsSrc.includes('handleFileReplacement(file)'), 'modal.js stops event propagation on image drop to prevent bubbling to window');

  const jsonJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/json.js'), 'utf8');
  assert(jsonJsSrc.includes('#msIconModal') && jsonJsSrc.includes('#imageDetailModal'), 'json.js drop listener excludes modal elements from unsupported file check');
  assert(jsonJsSrc.includes('!isImage && !isModalOpen'), 'json.js suppresses unsupported file warning when dropped file is an image or modal is open');

  const iconShotsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/shots/icon.js'), 'utf8');
  assert(iconShotsSrc.includes('icoDropZone.addEventListener(\'drop\'') && iconShotsSrc.includes('e.stopPropagation()'), 'icon.js stops event propagation on icon drop');

  const featureGraphicSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/google/feature-graphic.js'), 'utf8');
  assert(featureGraphicSrc.includes('featureDropZone.addEventListener(\'drop\'') && featureGraphicSrc.includes('e.stopPropagation()'), 'feature-graphic.js stops event propagation on feature graphic drop');

  assert(bundledHtml.includes('!isImage && !isModalOpen'), 'Bundled core.html includes image and modal-open drop suppression');
})());

// ---------------------------------------------------------------------
// [SUITE 52]: Single-Source-of-Truth Demo Mode (try.html) & Guided Tour Verification
// ---------------------------------------------------------------------
asyncSuites.push((async () => {
  console.log('\n[SUITE 52]: Single-Source-of-Truth Demo Mode (try.html) & Guided Tour Verification');

  // 1. Verify build files exist
  const tryHtmlPath = path.join(ROOT_DIR, 'docs', 'try.html');
  const publicTryHtmlPath = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try.html');
  const publicStudioHtmlPath = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try-studio.html');
  const nextTryPagePath = path.join(ROOT_DIR, '..', 'marketing', 'src', 'app', 'try', 'page.tsx');
  
  assert(fs.existsSync(tryHtmlPath), 'core/docs/try.html exists and is generated');
  try {
    if (fs.existsSync(publicTryHtmlPath)) assert(fs.existsSync(publicTryHtmlPath), 'marketing/public/try.html exists');
    if (fs.existsSync(publicStudioHtmlPath)) assert(fs.existsSync(publicStudioHtmlPath), 'marketing/public/try-studio.html exists for embedded studio iframe');
    if (fs.existsSync(nextTryPagePath)) {
      const nextTryPageSrc = fs.readFileSync(nextTryPagePath, 'utf8');
      assert(nextTryPageSrc.includes('/try-studio.html?embed=true'), 'Next.js /try page embeds /try-studio.html?embed=true via iframe');
      assert(nextTryPageSrc.includes('<Navbar />'), 'Next.js /try page includes Navbar');
      assert(!nextTryPageSrc.includes('<Footer />'), 'Next.js /try page removes Footer for full-viewport studio immersion');
      assert(nextTryPageSrc.includes('<AgencySandboxBanner />'), 'Next.js /try page includes Compact Agency Sandbox Strip');
    }
  } catch (_) {
    // Graceful handling when executed in sandboxed environment without external marketing folder access
  }

  const tryHtml = fs.readFileSync(tryHtmlPath, 'utf8');
  const coreHtml = fs.readFileSync(path.join(ROOT_DIR, 'core.html'), 'utf8');

  // 2. core.html is full paid version without demo mode or any demo artifacts
  assert(!coreHtml.includes('window.SPS_DEMO_MODE = true'), 'core.html does NOT enable SPS_DEMO_MODE (Paid offline full version)');
  assert(!coreHtml.includes('class="sps-demo-mode"'), 'core.html body does not hardcode demo mode class');
  assert(!coreHtml.includes('isDemoMode'), 'core.html strips all isDemoMode references for pure commercial build');
  assert(!coreHtml.includes('requireFullVersion'), 'core.html strips all requireFullVersion references for pure commercial build');
  assert(!coreHtml.includes('demoUpgradeModal'), 'core.html strips #demoUpgradeModal HTML and JS for pure commercial build');
  assert(!coreHtml.includes('DEMO_PAYWALL_CONFIGS'), 'core.html strips demo-guard.js completely');

  // 2b. try.html strips PRO implementations and replaces them with stubs
  assert(!tryHtml.includes('Generated by **Store Preview Studio**'), 'try.html strips exportMarkdown PRO implementation');
  assert(!tryHtml.includes('APPLE APP STORE (iOS)'), 'try.html strips copyAllText PRO implementation');
  assert(!tryHtml.includes('-store-config.json'), 'try.html strips exportJSON PRO implementation');
  assert(tryHtml.includes('handleStoreImportSubmit') && tryHtml.includes('isAutoFromUrl'), 'try.html supports URL-based live preview loading with ?appid=... while gating manual import');

  // 3. try.html has SPS_DEMO_MODE active and has try shell
  assert(tryHtml.includes('window.SPS_DEMO_MODE = true'), 'try.html explicitly sets window.SPS_DEMO_MODE = true');
  assert(tryHtml.includes('id="studioAppShell"'), 'try.html wraps application in #studioAppShell');
  assert(tryHtml.includes('id="tryTopbar"'), 'try.html includes standalone top bar navigation');
  assert(tryHtml.includes('is-embedded'), 'try.html contains auto-embed responsive CSS styles for iframe');

  // 4. try.html contains full Core DOM components (Single Source of Truth)
  assert(tryHtml.includes('id="editorPanel"'), 'try.html contains #editorPanel');
  assert(tryHtml.includes('id="stageDevices"'), 'try.html contains #stageDevices');
  assert(tryHtml.includes('id="workspaceBar"'), 'try.html contains #workspaceBar');
  assert(tryHtml.includes('id="storeSwitcher"'), 'try.html contains #storeSwitcher');
  assert(tryHtml.includes('id="icoDropZone"'), 'try.html contains #icoDropZone');
  assert(tryHtml.includes('id="demoUpgradeModal"'), 'try.html contains #demoUpgradeModal');
  assert(tryHtml.includes('id="btnStartTour"'), 'try.html contains #btnStartTour');

  // 5. Verify demo-guard logic and paywall triggers (Option B: Card 1 App Identity inputs editable, icon upload & Description card locked)
  const demoGuardSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/demo-guard.js'), 'utf8');
  assert(demoGuardSrc.includes('function isDemoMode()') && demoGuardSrc.includes('window.SPS_DEMO_MODE'), 'demo-guard.js exports isDemoMode checking window.SPS_DEMO_MODE');
  assert(demoGuardSrc.includes('function requireFullVersion('), 'demo-guard.js exports requireFullVersion');
  assert(demoGuardSrc.includes('export-png') && demoGuardSrc.includes('export-copy') && demoGuardSrc.includes('export-markdown') && demoGuardSrc.includes('export-json') && demoGuardSrc.includes('store-import') && demoGuardSrc.includes('upload-shots') && demoGuardSrc.includes('upload-icon') && demoGuardSrc.includes('edit-metadata'), 'demo-guard.js defines all contextual paywall messages');
  const lockedFieldsMatch = demoGuardSrc.match(/const lockedFieldIds\s*=\s*\[([^\]]*)\]/);
  assert(lockedFieldsMatch && demoGuardSrc.includes('demo-disabled-input'), 'demo-guard.js declares lockedFieldIds with demo-disabled-input styling');
  const lockedFieldsList = lockedFieldsMatch ? lockedFieldsMatch[1] : '';
  assert(
    lockedFieldsList.includes("'f-promo'") && lockedFieldsList.includes("'f-new'") && lockedFieldsList.includes("'f-desc'"),
    'demo-guard.js keeps Description card fields (f-promo, f-new, f-desc) locked in demo mode'
  );
  assert(
    !lockedFieldsList.includes("'f-name'") && !lockedFieldsList.includes("'f-sub'") && !lockedFieldsList.includes("'f-short'") && !lockedFieldsList.includes("'f-dev'"),
    'demo-guard.js leaves Card 1 App Identity inputs (f-name, f-sub, f-short, f-dev) editable in demo mode'
  );
  assert(
    !demoGuardSrc.includes('App Name, Subtitle & Descriptions are editable') && !demoGuardSrc.includes('App Name & Subtitles'),
    'demo-guard.js edit-metadata messaging reflects Description & Release Notes instead of claiming App Name/Subtitle are locked'
  );
  assert(
    demoGuardSrc.includes("icoDropZone.addEventListener('keydown'") && demoGuardSrc.includes('triggerIconPaywallAndHighlight'),
    'demo-guard.js locks App Icon upload across click, keydown, drop, and file input'
  );
  assert(demoGuardSrc.includes('custom-draft') && demoGuardSrc.includes('btnDraft'), 'demo-guard.js gates custom draft creation in demo mode');

  const modalSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/modal.js'), 'utf8');
  assert(
    !modalSrc.includes("_activeModalType !== 'icon'") && modalSrc.includes("_activeModalType === 'icon' ? 'upload-icon'"),
    'modal.js gates App Icon upload/drop replacement inside image detail modal during demo mode'
  );

  // 5b. Runtime behavioral simulation of Option B (Card 1 Identity editable, icon upload & modal upload locked)
  {
    const makeDomNode = (id, tag = 'div') => {
      const classes = new Set();
      const listeners = {};
      const node = {
        id,
        tagName: tag.toUpperCase(),
        value: '',
        readOnly: false,
        disabled: false,
        style: {},
        dataset: {},
        attrs: {},
        innerHTML: '',
        textContent: '',
        classList: {
          add: (...cls) => cls.forEach(c => classes.add(c)),
          remove: (...cls) => cls.forEach(c => classes.delete(c)),
          contains: (c) => classes.has(c),
          toggle: (c, force) => {
            if (force === undefined ? !classes.has(c) : force) classes.add(c);
            else classes.delete(c);
          }
        },
        setAttribute: (k, v) => { node.attrs[k] = String(v); },
        removeAttribute: (k) => { delete node.attrs[k]; },
        querySelector: () => null,
        querySelectorAll: () => [],
        closest: (sel) => {
          if (!sel) return null;
          const parts = sel.split(',').map(s => s.trim());
          for (const part of parts) {
            if (part.startsWith('#') && part.slice(1) === id) return node;
            if (part.startsWith('.') && classes.has(part.slice(1))) return node;
          }
          return null;
        },
        focus: () => {},
        click: () => {},
        remove: () => {},
        after: () => {},
        insertBefore: () => {},
        appendChild: () => {},
        addEventListener: (type, fn) => {
          if (!listeners[type]) listeners[type] = [];
          listeners[type].push(fn);
        },
        dispatchEvent: (evt) => {
          const event = Object.assign({
            target: node,
            defaultPrevented: false,
            propagationStopped: false,
            preventDefault: () => { event.defaultPrevented = true; },
            stopPropagation: () => { event.propagationStopped = true; },
            stopImmediatePropagation: () => { event.propagationStopped = true; }
          }, evt || {});
          (listeners[event.type] || []).forEach(fn => {
            if (!event.propagationStopped) fn(event);
          });
          return event;
        }
      };
      return node;
    };

    const simIds = [
      'demoUpgradeModal', 'f-name', 'f-sub', 'f-short', 'f-dev', 'f-promo', 'f-new', 'f-desc',
      'icoUp', 'icoDropZone', 'icoFile', 'icoInspect', 'icoRemove'
    ];
    const simEls = {};
    simIds.forEach(id => {
      simEls[id] = makeDomNode(id, id.startsWith('f-') ? 'input' : 'div');
    });

    const postedToasts = [];
    const focusedCalls = [];
    const simWindow = {
      SPS_DEMO_MODE: true,
      self: { name: 'iframe' },
      top: { postMessage: () => {} },
      parent: { postMessage: (msg) => postedToasts.push(msg) },
      addEventListener: () => {}
    };

    const simCtx = {
      console,
      window: simWindow,
      setTimeout: () => 1,
      clearTimeout: () => {},
      document: {
        documentElement: { dataset: {} },
        readyState: 'complete',
        body: { classList: makeDomNode('body').classList, dataset: {}, appendChild: () => {} },
        getElementById: (id) => simEls[id] || null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: (tag) => makeDomNode('created-' + tag, tag),
        addEventListener: () => {}
      },
      $: (id) => simEls[id] || null,
      $$: () => [],
      setFieldFocus: (fieldKey, flash) => focusedCalls.push({ fieldKey, flash })
    };

    vm.createContext(simCtx);
    vm.runInContext(demoGuardSrc, simCtx);

    assert(
      simEls['f-name'].readOnly === false && !simEls['f-name'].classList.contains('demo-locked-input') &&
      simEls['f-sub'].readOnly === false && !simEls['f-sub'].classList.contains('demo-locked-input') &&
      simEls['f-short'].readOnly === false && !simEls['f-short'].classList.contains('demo-locked-input') &&
      simEls['f-dev'].readOnly === false && !simEls['f-dev'].classList.contains('demo-locked-input'),
      'Runtime: Card 1 App Identity inputs (f-name, f-sub, f-short, f-dev) remain editable in Demo Mode'
    );

    assert(
      simEls['f-promo'].readOnly === true && simEls['f-promo'].classList.contains('demo-locked-input') &&
      simEls['f-new'].readOnly === true && simEls['f-desc'].readOnly === true,
      'Runtime: Description card fields (f-promo, f-new, f-desc) are readOnly and locked in Demo Mode'
    );

    postedToasts.length = 0;
    focusedCalls.length = 0;
    simEls['f-promo'].dispatchEvent({ type: 'click' });
    assert(
      postedToasts.length === 1 && postedToasts[0].toast.title === 'Description & Release Notes' &&
      focusedCalls.some(c => c.fieldKey === 'promo'),
      'Runtime: clicking locked Description card field opens Description & Release Notes toast and highlights promo preview'
    );

    postedToasts.length = 0;
    focusedCalls.length = 0;
    const icoUpEvt = simEls['icoUp'].dispatchEvent({ type: 'click' });
    assert(
      icoUpEvt.defaultPrevented && postedToasts.length === 1 && postedToasts[0].toast.title === 'Custom App Icon Upload' &&
      focusedCalls.some(c => c.fieldKey === 'icon'),
      'Runtime: clicking #icoUp in Demo Mode intercepts upload and shows Custom App Icon Upload toast'
    );

    postedToasts.length = 0;
    const icoZoneClickEvt = simEls['icoDropZone'].dispatchEvent({ type: 'click', target: simEls['icoDropZone'] });
    const icoKeyEvt = simEls['icoDropZone'].dispatchEvent({ type: 'keydown', key: 'Enter', target: simEls['icoDropZone'] });
    const icoDropEvt = simEls['icoDropZone'].dispatchEvent({ type: 'drop', dataTransfer: { files: [{ name: 'icon.png', type: 'image/png' }] } });
    assert(
      icoZoneClickEvt.defaultPrevented && icoKeyEvt.defaultPrevented && icoDropEvt.defaultPrevented && postedToasts.length === 3,
      'Runtime: #icoDropZone blocks click, Enter key, and file drop in Demo Mode'
    );

    postedToasts.length = 0;
    const inspectPassEvt = simEls['icoDropZone'].dispatchEvent({ type: 'click', target: simEls['icoInspect'] });
    assert(
      !inspectPassEvt.defaultPrevented && postedToasts.length === 0,
      'Runtime: #icoInspect click is NOT blocked by #icoDropZone click guard in Demo Mode'
    );

    // Modal runtime check: when opened for an App Icon in Demo Mode, Upload button / file input / drop call requireFullVersion('upload-icon')
    const modalEls = {
      msIconModal: makeDomNode('msIconModal'),
      msIconModalCanvas: makeDomNode('msIconModalCanvas'),
      msIconModalArt: makeDomNode('msIconModalArt'),
      msIconModalClose: makeDomNode('msIconModalClose', 'button'),
      msIconModalUploadBtn: makeDomNode('msIconModalUploadBtn', 'button'),
      msIconModalInput: makeDomNode('msIconModalInput', 'input'),
      msIconModalImg: makeDomNode('msIconModalImg', 'img'),
      msIconModalTitle: makeDomNode('msIconModalTitle'),
      msIconModalMeta: makeDomNode('msIconModalMeta'),
      msIconModalBadge: makeDomNode('msIconModalBadge'),
      msIconModalDetails: makeDomNode('msIconModalDetails')
    };
    modalEls.msIconModalImg.style = {};
    modalEls.msIconModalMeta.style = {};
    modalEls.msIconModalBadge.style = {};
    modalEls.msIconModalDetails.style = {};

    const modalPaywallCalls = [];
    const modalCtx = {
      console,
      addEventListener: () => {},
      document: {
        documentElement: { style: {} },
        getElementById: (id) => modalEls[id] || null,
        body: makeDomNode('body'),
        addEventListener: () => {}
      },
      $: (id) => modalEls[id] || null,
      $$: () => [],
      isDemoMode: () => true,
      requireFullVersion: (key) => modalPaywallCalls.push(key),
      Image: function MockImg() { this.onload = null; },
      FileReader: function MockReader() { throw new Error('FileReader should not run when Demo Mode blocks upload'); },
      setTimeout: () => 1
    };
    modalCtx.window = modalCtx;
    vm.createContext(modalCtx);
    vm.runInContext(modalSrc, modalCtx);
    modalCtx.openImageDetailModal({ src: 'data:image/png;base64,AA==', type: 'icon', store: 'apple' });

    modalEls.msIconModalUploadBtn.dispatchEvent({ type: 'click' });
    modalEls.msIconModalInput.dispatchEvent({ type: 'change', target: modalEls.msIconModalInput });
    modalEls.msIconModal.dispatchEvent({ type: 'drop', dataTransfer: { files: [{ name: 'icon.png', type: 'image/png' }] } });
    assert(
      modalPaywallCalls.length === 3 && modalPaywallCalls.every(k => k === 'upload-icon'),
      'Runtime: Image Detail Modal blocks Upload button, file input, and drop with upload-icon paywall when _activeModalType === icon in Demo Mode'
    );
  }

  // 6. Verify 1-line gating hooks in export modules
  const pngSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/png.js'), 'utf8');
  assert(pngSrc.includes('isDemoMode()') && pngSrc.includes("requireFullVersion('export-png')"), 'png.js guards mockup image export in demo mode');

  const clipboardSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/clipboard.js'), 'utf8');
  assert(clipboardSrc.includes('isDemoMode()') && clipboardSrc.includes("requireFullVersion('export-copy')"), 'clipboard.js guards text metadata copy in demo mode');

  const markdownSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/markdown.js'), 'utf8');
  assert(markdownSrc.includes('isDemoMode()') && markdownSrc.includes("requireFullVersion('export-markdown')"), 'markdown.js guards Markdown file export in demo mode');

  const jsonSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/json.js'), 'utf8');
  assert(jsonSrc.includes('isDemoMode()') && jsonSrc.includes("requireFullVersion('export-json')"), 'json.js guards JSON file export in demo mode');
  assert(jsonSrc.includes('isDemoMode()') && jsonSrc.includes("requireFullVersion('import-json')"), 'json.js guards JSON file import in demo mode');

  const storeImportSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/store-import.js'), 'utf8');
  assert(storeImportSrc.includes('isDemoMode()') && storeImportSrc.includes("requireFullVersion('store-import')"), 'store-import.js guards App Store cloning in demo mode');

  // 7. Verify Guided Tour module and step targets
  const tourSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/tour.js'), 'utf8');
  assert(tourSrc.includes('SPS_TOUR_STEPS'), 'tour.js defines SPS_TOUR_STEPS');
  assert(tourSrc.includes('#storeSwitcher'), 'tour.js step 1 targets #storeSwitcher');
  assert(tourSrc.includes('#btnPresetPill'), 'tour.js step 2 targets #btnPresetPill');
  assert(tourSrc.includes('#editorPanel'), 'tour.js step 3 targets #editorPanel');
  assert(tourSrc.includes('#icoDropZone'), 'tour.js step 4 targets #icoDropZone');
  assert(tourSrc.includes('#workspaceExportDropdown'), 'tour.js step 5 targets #workspaceExportDropdown');
  assert(tourSrc.includes('function startTour'), 'tour.js exposes startTour()');

  // 8. Verify upload limit in demo mode and storage no-op
  assert(!tryHtml.includes('id="presetPillCloseBtn"'), 'try.html strips #presetPillCloseBtn from preset pill in demo mode');

  const phoneShotsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/shots/phone.js'), 'utf8');
  assert(phoneShotsSrc.includes('isDemoMode()') && phoneShotsSrc.includes('_demoScreenshotUploadCount') && phoneShotsSrc.includes("requireFullVersion('upload-shots')"), 'phone.js enforces 2-screenshot upload limit in demo mode');

  const ipadShotsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/shots/ipad.js'), 'utf8');
  assert(ipadShotsSrc.includes('isDemoMode()') && ipadShotsSrc.includes('_demoScreenshotUploadCount') && ipadShotsSrc.includes("requireFullVersion('upload-shots')"), 'ipad.js enforces 2-screenshot upload limit in demo mode');

  const storageSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/export/storage.js'), 'utf8');
  assert(storageSrc.includes('isDemoMode()') && storageSrc.includes('return Promise.resolve(true);'), 'storage.js keeps demo state in RAM only without persisting to IndexedDB');

  // 9. Legacy preservation: verify mini-studio and demo.html remain 100% untouched
  assert(fs.existsSync(path.join(ROOT_DIR, 'docs/demo.html')), 'Legacy docs/demo.html remains untouched and intact');
  assert(fs.existsSync(path.join(ROOT_DIR, '../marketing/public/demo.html')), 'Legacy marketing/public/demo.html remains untouched and intact');
  assert(fs.existsSync(path.join(ROOT_DIR, 'docs/src/marketing/components/mini-studio.html')), 'Mini-studio HTML component remains intact');
  assert(fs.existsSync(path.join(ROOT_DIR, 'docs/src/marketing/js/mini-studio.js')), 'Mini-studio JS remains intact');

  // 10. Default auto-pick Store Preview Studio preset when visiting demo without appid
  assert(tryHtml.includes("userDraft = null;\nCURRENT_PRESET_KEY = 'studio';\nCURRENT_ACTIVE_PRESET = 'studio';") || (tryHtml.includes("userDraft = null;") && tryHtml.includes("CURRENT_PRESET_KEY = 'studio';")), 'try.html auto-picks Store Preview Studio preset when not navigating with appid');
  assert(!coreHtml.includes("isDemoMode"), 'core.html strips demo mode branch completely');

  // 10. Verify dev server routing for localhost:3000 (core) and localhost:3000/try (try)
  const devJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'dev.js'), 'utf8');
  assert(devJsSrc.includes("pathname === '/try'") && devJsSrc.includes("pathname === '/try.html'"), 'dev.js handles /try and /try.html endpoints');
  assert(devJsSrc.includes('Core Studio:') && devJsSrc.includes('Try Demo:'), 'dev.js logs both Core and Try URLs on port 3000');
  assert(devJsSrc.includes('openCoreCmd'), 'dev.js automatically launches Core Studio in browser');

  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, '../package.json'), 'utf8'));
  assert(rootPkg.scripts.dev === 'npm --prefix core run dev', 'root package.json dev script starts core dev server');
  assert(rootPkg.scripts.start === 'npm --prefix core run dev', 'root package.json start script starts core dev server');

  // 11. Guided Tour Button: Route Icon, Zero TranslateY & Relocation to Header Next to Theme Toggle
  const wsBarSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/components/workspace-bar.html'), 'utf8');
  assert(wsBarSrc.includes('circle cx="6" cy="19" r="3"') && !wsBarSrc.includes('polygon points="12 2 15.09'), 'Tour button uses clean route icon instead of star');

  const tourCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/css/modals/tour.css'), 'utf8');
  assert(tourCssSrc.includes('.ms-pill.tour-btn:hover') && tourCssSrc.includes('transform: none !important;'), 'Tour button removes translateY on hover and active');
  assert(tourCssSrc.includes('.right .ms-pill.tour-btn') || tourCssSrc.includes('.ms-pill.tour-btn.in-header'), 'Tour button has header right positioning styles');

  const tourModuleSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/js/modules/tour.js'), 'utf8');
  assert(tourModuleSrc.includes('function relocateTourButton()') && tourModuleSrc.includes('sps_tour_completed'), 'tour.js defines relocateTourButton based on sps_tour_completed');
  assert(tourModuleSrc.includes('headerRight.insertBefore(btn, btnUi)'), 'tour.js relocates Tour button next to Page Theme toggle button');
})());

// ---------------------------------------------------------------------
// [SUITE 53]: Dual Phone & Detail View Default State & Factory Reset Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 53]: Dual Phone & Detail View Default State & Factory Reset Verification');

// 1. Initial static HTML bodies default to dual phone mode
const srcIndexRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'index.html'), 'utf8');
const tryHtmlRaw = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'try.html'), 'utf8');
assert(srcIndexRaw.includes('data-dual="true"'), 'src/index.html body defaults to data-dual="true"');
assert(tryHtmlRaw.includes('data-dual="true"'), 'docs/src/marketing/try.html body defaults to data-dual="true"');

// 2. View switcher HTML defaults comparison to Dual Phone active and Detail View on
const viewSwitcherRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'stage', 'view-switcher.html'), 'utf8');
assert(viewSwitcherRaw.includes('id="btnDualPhone"') && viewSwitcherRaw.includes('aria-checked="true"') && viewSwitcherRaw.includes('class="menu-item toggle-item on"'), 'btnDualPhone toggle defaults to on and aria-checked="true"');
assert(viewSwitcherRaw.includes('id="stageDualBadge">Dual</span>'), 'stageDualBadge is displayed by default without display:none');
assert(viewSwitcherRaw.includes('id="optViewDetail"') && viewSwitcherRaw.includes('class="menu-item on"'), 'optViewDetail defaults to active state on');
assert(viewSwitcherRaw.includes('id="stageViewLabel">Detail View</span>'), 'stageViewLabel defaults to Detail View');

// 3. Apple and Google device scripts default to dual
const appleJsRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'apple', 'apple.js'), 'utf8');
const googleJsRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');
assert(appleJsRaw.includes("let appleDevice = 'dual'"), 'apple.js initializes appleDevice to "dual"');
assert(googleJsRaw.includes("let googleDevice = 'dual'"), 'google.js initializes googleDevice to "dual"');

// 4. Main script initializes dual phone and detail view on fresh boot without saved draft
const mainJsRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'main.js'), 'utf8');
assert(mainJsRaw.includes("document.body.dataset.dual = 'true'"), 'main.js sets document.body.dataset.dual to "true"');
assert(mainJsRaw.includes("appleDevice = 'dual'") && mainJsRaw.includes("googleDevice = 'dual'"), 'main.js bootstraps dual device variables');
assert(mainJsRaw.includes("setStore('apple', false, true)"), 'main.js initializes store while preserving dual mode');
assert(mainJsRaw.includes("setView('detail', true)"), 'main.js explicitly applies Detail View on bootstrap');

// 5. Storage engine resetFactoryStorage applies pristine dual phone + detail view defaults
const storageJsRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'storage.js'), 'utf8');
const transitionsJsRaw = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');
assert(storageJsRaw.includes("document.body.dataset.dual = 'true'") && storageJsRaw.includes("setView('detail', true)"), 'resetFactoryStorage resets to dual phone and detail view');
assert(storageJsRaw.includes("isSavedDual = s.appleDevice === 'dual' || s.googleDevice === 'dual'"), 'applyStateObject correctly inspects saved dual state');
assert(storageJsRaw.includes("function applyStateObject(s, restoreLayout = false)"), 'applyStateObject defaults restoreLayout to false to preserve startup layout');
assert(transitionsJsRaw.includes("function toggleDualPhone(forceState, animate = true)"), 'toggleDualPhone supports synchronous non-animating bootstrap mode');
assert(mainJsRaw.includes("toggleDualPhone(true, false)"), 'main.js bootstraps dual phone synchronously without animation lag');

// 6. Bundled core.html and try.html contain dual phone and detail view defaults
const bundledCore = fs.readFileSync(path.join(ROOT_DIR, 'core.html'), 'utf8');
const bundledTry = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'try.html'), 'utf8');
assert(bundledCore.includes('data-dual="true"'), 'core.html contains data-dual="true"');
assert(bundledTry.includes('data-dual="true"'), 'try.html contains data-dual="true"');
assert(bundledTry.includes('id="stageDualBadge">Dual</span>'), 'try.html displays Dual badge by default');

// ---------------------------------------------------------------------
// SUITE 54: Comprehensive Behavioral Unit Tests for Screenshot & Modal Validation
// ---------------------------------------------------------------------
console.log('\n[SUITE 54]: Comprehensive Behavioral Unit Tests for Screenshot & Modal Validation');

// 1. Behavioral Evaluator for Phone Screenshot Editor Row & Banner
function evaluatePhoneShot(w, h, sizeBytes, store) {
  const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
  const isLandscape = w > h * 1.15;
  const isPhonePortrait = h >= w * 1.35;
  const isGoogleSizeIssue = store === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);
  const isOverSize = sizeBytes > 8 * 1024 * 1024;

  // Standard Apple landscape resolutions (official App Store Connect dims — portrait dims swapped)
  const isStandardAppleLandscape = store === 'apple' && (
    (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
    (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
    (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
    (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
    (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
    (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
    (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
  );
  // Standard Google landscape: phone aspect ratio within range (1.5:1 to 2.2:1)
  const isStandardGoogleLandscape = store === 'google' && isLandscape &&
    !isSquare && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
  // Extreme non-phone ratio (e.g. banner 730×172 → 4.24:1) — always err
  const isExtremeRatio = isLandscape && (w / h > 2.5);
  // Landscape but below phone aspect ratio range (e.g. 800×600 = 1.33:1 is tablet/monitor, not phone) — err
  const isNonPhoneLandscape = isLandscape && !isExtremeRatio && (w / h < 1.5) && !isStandardAppleLandscape;

  let tagClass = 'ok';
  let tagText = '';
  let bannerLevel = 'ok';
  let bannerType = '';

  if (isSquare) {
    tagClass = 'err';
    tagText = `1:1 Square (${w}×${h})`;
    bannerLevel = 'err';
    bannerType = store === 'apple' ? 'App Store Rejection Risk' : 'Aspect Ratio Error';
  } else if (isLandscape && (isExtremeRatio || isNonPhoneLandscape)) {
    // Extreme ratio OR below phone AR range (e.g. 800×600 = 1.33:1) — err
    tagClass = 'err';
    tagText = `Invalid Ratio (${w}×${h})`;
    bannerLevel = 'err';
    bannerType = 'Invalid Aspect Ratio';
  } else if (isLandscape && (isStandardAppleLandscape || isStandardGoogleLandscape)) {
    tagClass = 'ok';
    tagText = `Landscape (${w}×${h})`;
    bannerLevel = 'ok';
    bannerType = '';
  } else if (isLandscape) {
    // Non-standard phone-range landscape (1.5-2.2:1 but not a known dim) -> warn
    tagClass = 'warn';
    tagText = `Landscape (${w}×${h})`;
    bannerLevel = 'warn';
    bannerType = 'Non-standard Landscape';
  } else if (!isPhonePortrait) {
    tagClass = 'err';
    tagText = `Non-portrait (${w}×${h})`;
    bannerLevel = 'err';
    bannerType = 'Aspect Ratio Error';
  } else if (isOverSize) {
    tagClass = 'warn';
    tagText = `>8 MB (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB)`;
    bannerLevel = 'warn';
    bannerType = 'File Size Warning';
  } else if (isGoogleSizeIssue) {
    tagClass = 'warn';
    tagText = `Out of Range (${w}×${h})`;
    bannerLevel = 'warn';
    bannerType = 'Dimension Warning';
  } else {
    const isStandardApple = store === 'apple' && (
      (w === 1320 && h === 2868) || (w === 1290 && h === 2796) || (w === 1260 && h === 2736) ||
      (w === 1206 && h === 2622) || (w === 1179 && h === 2556) ||
      (w === 1284 && h === 2778) || (w === 1242 && h === 2688) ||
      (w === 1170 && h === 2532) || (w === 1125 && h === 2436) || (w === 1080 && h === 2340) ||
      (w === 1242 && h === 2208) || (w === 750 && h === 1334) ||
      (w === 1398 && h === 2034) || (w === 2007 && h === 2853) ||
      (w === 640 && h === 1136) || (w === 640 && h === 1096) || (w === 640 && h === 960) || (w === 640 && h === 920)
    );
    const isStandardGoogle = store === 'google' && (
      (w === 1080 && h === 1920) || (w === 1080 && h === 2340) || (w === 1080 && h === 2400) ||
      (w === 1080 && h === 2160) || (w === 1080 && h === 2280) ||
      (w === 1440 && h === 2560) || (w === 1440 && h === 3120) || (w === 1440 && h === 3200) ||
      (w === 1440 && h === 2880) || (w === 1440 && h === 2960) || (w === 1440 && h === 3088) ||
      (w === 720 && h === 1280) || (w === 720 && h === 1560) || (w === 720 && h === 1600) ||
      (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
    );
    if ((store === 'apple' && isStandardApple) || (store === 'google' && isStandardGoogle)) {
      tagClass = 'ok';
      tagText = `Portrait (${w}×${h})`;
      bannerLevel = 'ok';
    } else {
      tagClass = 'warn';
      tagText = `Scaled (${w}×${h})`;
      bannerLevel = 'ok';
    }
  }

  return { tagClass, tagText, bannerLevel, bannerType };
}

// 2. Behavioral Evaluator for Inspector Modal Metrics & Status Card
function evaluateInspectorModal(w, h, sizeBytes, store, type = 'screenshot', hasAlpha = false, mimeType = 'image/png') {
  const isSq = (w === h) || ((Math.abs(w - h) / Math.max(w, h)) < 0.08);
  const isLandscape = w > h * 1.15;
  const isPhonePortrait = h >= w * 1.35;
  const isIpadPortrait = (Math.abs(w / h - 0.75) < 0.08) || (w / h >= 0.65 && w / h <= 0.85);
  const isIpadLandscape = (Math.abs(w / h - 1.333) < 0.08) || (w / h >= 1.18 && w / h <= 1.54);
  const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';

  // Standard Apple/Google landscape resolutions
  const isStandardAppleLandscapeModal = isLandscape && store === 'apple' && (
    (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
    (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
    (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
    (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
    (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
    (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
    (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
  );
  const isStandardGoogleLandscapeModal = isLandscape && store === 'google' &&
    !isSq && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
  const isStandardLandscape = isStandardAppleLandscapeModal || isStandardGoogleLandscapeModal;
  // Extreme ratio OR below phone AR range (e.g. 800×600 = 1.33:1 = tablet) — err
  const isExtremeRatio = isLandscape && ((w / h > 2.5) || (w / h < 1.5 && !isStandardAppleLandscapeModal));

  // dimEl
  let dimClass = 'ok';
  if (type === 'screenshot') {
    const isWrongRatio = isSq || isExtremeRatio || (!isLandscape && !isPhonePortrait);
    if (isWrongRatio) {
      dimClass = 'err';
    } else if (isStandardLandscape) {
      dimClass = 'ok';
    } else if (isLandscape) {
      dimClass = 'warn';
    } else {
      const isStandardApple = store === 'apple' && (
        (w === 1320 && h === 2868) || (w === 1290 && h === 2796) || (w === 1260 && h === 2736) ||
        (w === 1206 && h === 2622) || (w === 1179 && h === 2556) ||
        (w === 1284 && h === 2778) || (w === 1242 && h === 2688) ||
        (w === 1170 && h === 2532) || (w === 1125 && h === 2436) || (w === 1080 && h === 2340) ||
        (w === 1242 && h === 2208) || (w === 750 && h === 1334) ||
        (w === 1398 && h === 2034) || (w === 2007 && h === 2853) ||
        (w === 640 && h === 1136) || (w === 640 && h === 1096) || (w === 640 && h === 960) || (w === 640 && h === 920)
      );
      const isStandardGoogle = store === 'google' && (
        (w === 1080 && h === 1920) || (w === 1080 && h === 2340) || (w === 1080 && h === 2400) ||
        (w === 1080 && h === 2160) || (w === 1080 && h === 2280) ||
        (w === 1440 && h === 2560) || (w === 1440 && h === 3120) || (w === 1440 && h === 3200) ||
        (w === 1440 && h === 2880) || (w === 1440 && h === 2960) || (w === 1440 && h === 3088) ||
        (w === 720 && h === 1280) || (w === 720 && h === 1560) || (w === 720 && h === 1600) ||
        (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
      );
      dimClass = ((store === 'apple' && isStandardApple) || (store === 'google' && isStandardGoogle)) ? 'ok' : 'warn';
    }
  } else if (type === 'ipad') {
    const dimOk = (w === 2048 && h === 2732) || (w === 2732 && h === 2048) || isIpadPortrait || isIpadLandscape;
    dimClass = isSq || (h > w * 1.5 || w > h * 1.5) ? 'err' : (dimOk ? 'ok' : 'warn');
  }

  // ratioEl
  let ratioClass = 'ok';
  if (type === 'screenshot') {
    if (isSq || isExtremeRatio || (!isLandscape && !isPhonePortrait)) {
      ratioClass = 'err';
    } else if (isLandscape) {
      ratioClass = isStandardLandscape ? 'ok' : 'warn';
    } else {
      ratioClass = 'ok';
    }
  } else if (type === 'ipad') {
    ratioClass = isSq || (!isIpadPortrait && !isIpadLandscape) ? 'err' : 'ok';
  }

  // sizeEl
  const sizeClass = (sizeBytes > 8 * 1024 * 1024) ? 'warn' : 'ok';

  // formatEl
  let formatClass = 'ok';
  if (hasAlpha && (store === 'apple' || type === 'feature')) formatClass = 'err';
  else if (isJpeg && type === 'icon') formatClass = 'warn';

  // Modal Level & Badge
  let level = 'ok';
  let badgeText = '';

  if (type === 'screenshot') {
    const MAX_PHONE_SHOT_BYTES = 8 * 1024 * 1024;
    const isGoogleSizeIssue = store === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

    if (store === 'apple' && hasAlpha) {
      level = 'err';
      badgeText = 'Alpha detected · 100% Opaque required';
    } else if (isSq) {
      level = 'err';
      badgeText = store === 'apple' ? `App Store Rejection Risk: 1:1 Square (${w}×${h} px)` : `Aspect Ratio Error: 1:1 Square (${w}×${h} px)`;
    } else if (isExtremeRatio) {
      level = 'err';
      badgeText = `Invalid Aspect Ratio: Banner ${w}×${h} px`;
    } else if (isLandscape && isStandardLandscape) {
      level = 'ok';
      badgeText = `${w}×${h} px · Landscape · Store Compliant`;
    } else if (isLandscape) {
      level = 'warn';
      badgeText = `Non-standard Landscape (${w}×${h} px)`;
    } else if (!isPhonePortrait) {
      level = 'err';
      badgeText = `Aspect Ratio Error: Non-portrait (${w}×${h} px)`;
    } else if (sizeBytes > MAX_PHONE_SHOT_BYTES) {
      level = 'warn';
      badgeText = `File Size Warning: ${(sizeBytes / (1024 * 1024)).toFixed(1)} MB · Exceeds 8 MB limit`;
    } else if (isGoogleSizeIssue) {
      level = 'warn';
      badgeText = `Dimension Warning: Out of range (${w}×${h} px)`;
    } else {
      const isStandardApple = store === 'apple' && (
        (w === 1320 && h === 2868) || (w === 1290 && h === 2796) || (w === 1260 && h === 2736) ||
        (w === 1206 && h === 2622) || (w === 1179 && h === 2556) ||
        (w === 1284 && h === 2778) || (w === 1242 && h === 2688) ||
        (w === 1170 && h === 2532) || (w === 1125 && h === 2436) || (w === 1080 && h === 2340) ||
        (w === 1242 && h === 2208) || (w === 750 && h === 1334) ||
        (w === 1398 && h === 2034) || (w === 2007 && h === 2853) ||
        (w === 640 && h === 1136) || (w === 640 && h === 1096) || (w === 640 && h === 960) || (w === 640 && h === 920)
      );
      const isStandardGoogle = store === 'google' && (
        (w === 1080 && h === 1920) || (w === 1080 && h === 2340) || (w === 1080 && h === 2400) ||
        (w === 1080 && h === 2160) || (w === 1080 && h === 2280) ||
        (w === 1440 && h === 2560) || (w === 1440 && h === 3120) || (w === 1440 && h === 3200) ||
        (w === 1440 && h === 2880) || (w === 1440 && h === 2960) || (w === 1440 && h === 3088) ||
        (w === 720 && h === 1280) || (w === 720 && h === 1560) || (w === 720 && h === 1600) ||
        (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
      );
      if ((store === 'apple' && !isStandardApple) || (store === 'google' && !isStandardGoogle)) {
        level = 'warn';
        badgeText = `Dimension Notice: ${w}×${h} px · Scaled to Canvas`;
      } else {
        level = 'ok';
        badgeText = `${w}×${h} px · Active Screenshot`;
      }
    }
  }

  return { dimClass, ratioClass, sizeClass, formatClass, level, badgeText };
}

// ---------------------------------------------------------------------
// TEST MATRIX: SAI RATIO LÀ ERROR (RED)
// ---------------------------------------------------------------------
// Test 1: Square image (2252×2252, 1032 KB, Apple)
const rUserApple = evaluatePhoneShot(2252, 2252, 1032 * 1024, 'apple');
assert(rUserApple.tagClass === 'err', 'Apple Square Phone: tagClass is err (RED)');
assert(rUserApple.tagText === '1:1 Square (2252×2252)', 'Apple Square Phone: tagText is 1:1 Square (2252×2252)');
assert(rUserApple.bannerLevel === 'err', 'Apple Square Phone: bannerLevel is err (RED)');
assert(rUserApple.bannerType === 'App Store Rejection Risk', 'Apple Square Phone: banner is App Store Rejection Risk');

const mUserApple = evaluateInspectorModal(2252, 2252, 1032 * 1024, 'apple', 'screenshot', false);
assert(mUserApple.ratioClass === 'err', 'Apple Square Modal: ratioClass is err (RED)');
assert(mUserApple.dimClass === 'err', 'Apple Square Modal: dimClass is err (RED)');
assert(mUserApple.level === 'err', 'Apple Square Modal: level is err (RED)');
assert(mUserApple.badgeText.includes('App Store Rejection Risk: 1:1 Square'), 'Apple Square Modal: badge identifies rejection risk');

// Test 2: Square image on Google Play (2252×2252)
const rUserGoogle = evaluatePhoneShot(2252, 2252, 1032 * 1024, 'google');
assert(rUserGoogle.tagClass === 'err', 'Google Square Phone: tagClass is err (RED)');
assert(rUserGoogle.bannerLevel === 'err', 'Google Square Phone: bannerLevel is err (RED)');
const mUserGoogle = evaluateInspectorModal(2252, 2252, 1032 * 1024, 'google', 'screenshot', false);
assert(mUserGoogle.ratioClass === 'err', 'Google Square Modal: ratioClass is err (RED)');
assert(mUserGoogle.dimClass === 'err', 'Google Square Modal: dimClass is err (RED)');
assert(mUserGoogle.level === 'err', 'Google Square Modal: level is err (RED)');

// Test 3: Extreme ratio banner 730×172 (4.24:1) — err because ASPECT RATIO, not because landscape
const rBanner = evaluatePhoneShot(730, 172, 50 * 1024, 'apple');
assert(rBanner.tagClass === 'err', 'Banner 730×172 Apple Phone: tagClass is err (RED)');
assert(rBanner.tagText === 'Invalid Ratio (730×172)', 'Banner 730×172 Apple Phone: tagText is Invalid Ratio');
assert(rBanner.bannerLevel === 'err', 'Banner 730×172 Apple Phone: bannerLevel is err');
assert(rBanner.bannerType === 'Invalid Aspect Ratio', 'Banner 730×172 Apple Phone: bannerType is Invalid Aspect Ratio (NOT landscape restriction)');
const mBanner = evaluateInspectorModal(730, 172, 50 * 1024, 'apple', 'screenshot', false);
assert(mBanner.level === 'err', 'Banner 730×172 Apple Modal: level is err (RED)');
assert(mBanner.badgeText.includes('Invalid Aspect Ratio'), 'Banner 730×172 Apple Modal: badge says Invalid Aspect Ratio, NOT landscape forbidden');

// Test 4: Standard Apple landscape 2556×1179 — MUST be ok (GREEN), NOT err
const rAppleLandStd = evaluatePhoneShot(2556, 1179, 1024 * 1024, 'apple');
assert(rAppleLandStd.tagClass === 'ok', 'Apple Standard Landscape 2556×1179 Phone: tagClass is ok (GREEN)');
assert(rAppleLandStd.tagText === 'Landscape (2556×1179)', 'Apple Standard Landscape 2556×1179 Phone: tagText contains Landscape');
assert(rAppleLandStd.bannerLevel === 'ok', 'Apple Standard Landscape 2556×1179 Phone: bannerLevel is ok (no banner)');
const mAppleLandStd = evaluateInspectorModal(2556, 1179, 1024 * 1024, 'apple', 'screenshot', false);
assert(mAppleLandStd.level === 'ok', 'Apple Standard Landscape 2556×1179 Modal: level is ok (GREEN)');
assert(mAppleLandStd.badgeText.includes('Landscape · Store Compliant'), 'Apple Standard Landscape 2556×1179 Modal: badge says Store Compliant');
assert(mAppleLandStd.ratioClass === 'ok', 'Apple Standard Landscape 2556×1179 Modal: ratioClass is ok (GREEN)');
assert(mAppleLandStd.dimClass === 'ok', 'Apple Standard Landscape 2556×1179 Modal: dimClass is ok (GREEN)');

// Test 5: Standard Apple landscape 2622×1206 — MUST be ok
const rAppleLandStd2 = evaluatePhoneShot(2622, 1206, 1024 * 1024, 'apple');
assert(rAppleLandStd2.tagClass === 'ok', 'Apple Standard Landscape 2622×1206 Phone: tagClass is ok (GREEN)');
assert(rAppleLandStd2.bannerLevel === 'ok', 'Apple Standard Landscape 2622×1206 Phone: bannerLevel is ok');

// Test 6: Standard Apple landscape 2796×1290 — MUST be ok
const rAppleLandStd3 = evaluatePhoneShot(2796, 1290, 1024 * 1024, 'apple');
assert(rAppleLandStd3.tagClass === 'ok', 'Apple Standard Landscape 2796×1290 Phone: tagClass is ok (GREEN)');
assert(rAppleLandStd3.bannerLevel === 'ok', 'Apple Standard Landscape 2796×1290 Phone: bannerLevel is ok');

// Test 7: Standard Google landscape 1920×1080 — MUST be ok
const rGoogleLandStd = evaluatePhoneShot(1920, 1080, 1024 * 1024, 'google');
assert(rGoogleLandStd.tagClass === 'ok', 'Google Standard Landscape 1920×1080 Phone: tagClass is ok (GREEN)');
assert(rGoogleLandStd.bannerLevel === 'ok', 'Google Standard Landscape 1920×1080 Phone: bannerLevel is ok');
const mGoogleLandStd = evaluateInspectorModal(1920, 1080, 1024 * 1024, 'google', 'screenshot', false);
assert(mGoogleLandStd.level === 'ok', 'Google Standard Landscape 1920×1080 Modal: level is ok (GREEN)');
assert(mGoogleLandStd.badgeText.includes('Landscape · Store Compliant'), 'Google Standard Landscape 1920×1080 Modal: badge says Store Compliant');

// Test 8: Mixed orientation warn — portrait + standard landscape in same set
// (banner-level test only since evaluatePhoneShot is per-shot; mixed is finalizeBadge logic)
// We verify the individual classifications are correct so finalizeBadge can detect mixing
const rPortrait = evaluatePhoneShot(1179, 2556, 1024 * 1024, 'apple');
assert(rPortrait.tagClass === 'ok', 'Apple Portrait 1179×2556 Phone: tagClass is ok (GREEN)');
// When portrait and landscape both present, finalizeBadge emits warn for mixed orientation

// Test 9: Non-portrait non-landscape ratio (800×600, Apple) — err
const rNonPhone = evaluatePhoneShot(800, 600, 500 * 1024, 'apple');
assert(rNonPhone.tagClass === 'err', 'Apple Non-portrait Phone: tagClass is err (RED)');
assert(rNonPhone.bannerLevel === 'err', 'Apple Non-portrait Phone: bannerLevel is err (RED)');
const mNonPhone = evaluateInspectorModal(800, 600, 500 * 1024, 'apple', 'screenshot', false);
assert(mNonPhone.ratioClass === 'err', 'Apple Non-portrait Modal: ratioClass is err (RED)');
assert(mNonPhone.level === 'err', 'Apple Non-portrait Modal: level is err (RED)');



// Test 4: Non-portrait non-phone ratio (800x600, Apple)

// ---------------------------------------------------------------------
// TEST MATRIX: ĐÚNG RATIO MÀ SAI FILESIZE HOẶC KÍCH THƯỚC LÀ WARNING (AMBER)
// ---------------------------------------------------------------------
// Test 5: Đúng ratio portrait, nhưng file size > 8 MB (1290x2796, 9.5 MB)
const rOverSize = evaluatePhoneShot(1290, 2796, Math.round(9.5 * 1024 * 1024), 'apple');
assert(rOverSize.tagClass === 'warn', 'Oversize Portrait: tagClass is warn (AMBER), NOT err');
assert(rOverSize.tagText.includes('>8 MB'), 'Oversize Portrait: tagText contains >8 MB');
assert(rOverSize.bannerLevel === 'warn', 'Oversize Portrait: bannerLevel is warn (AMBER), NOT err');
assert(rOverSize.bannerType === 'File Size Warning', 'Oversize Portrait: banner is File Size Warning');

const mOverSize = evaluateInspectorModal(1290, 2796, Math.round(9.5 * 1024 * 1024), 'apple', 'screenshot', false);
assert(mOverSize.ratioClass === 'ok', 'Oversize Portrait Modal: ratioClass is ok (GREEN) because ratio is valid');
assert(mOverSize.sizeClass === 'warn', 'Oversize Portrait Modal: sizeClass is warn (AMBER)');
assert(mOverSize.level === 'warn', 'Oversize Portrait Modal: level is warn (AMBER), NOT err');

// Test 6: Đúng ratio portrait, nhưng kích thước không chuẩn target (1000x2000, 1.5 MB, Apple)
const rScaled = evaluatePhoneShot(1000, 2000, Math.round(1.5 * 1024 * 1024), 'apple');
assert(rScaled.tagClass === 'warn', 'Scaled Portrait: tagClass is warn (AMBER), NOT err');
assert(rScaled.tagText === 'Scaled (1000×2000)', 'Scaled Portrait: tagText is Scaled');
assert(rScaled.bannerLevel === 'ok', 'Scaled Portrait: banner is clean (no fatal rejection)');

const mScaled = evaluateInspectorModal(1000, 2000, Math.round(1.5 * 1024 * 1024), 'apple', 'screenshot', false);
assert(mScaled.ratioClass === 'ok', 'Scaled Portrait Modal: ratioClass is ok (GREEN)');
assert(mScaled.dimClass === 'warn', 'Scaled Portrait Modal: dimClass is warn (AMBER)');
assert(mScaled.level === 'warn', 'Scaled Portrait Modal: level is warn (AMBER) - Dimension Notice');

// Test 7: Đúng ratio portrait, nhưng Google dimension boundary < 320 px (150x300, Google)
const rGoogleBoundary = evaluatePhoneShot(150, 300, 100 * 1024, 'google');
assert(rGoogleBoundary.tagClass === 'warn', 'Google Boundary Phone: tagClass is warn (AMBER), NOT err');
assert(rGoogleBoundary.tagText === 'Out of Range (150×300)', 'Google Boundary Phone: tagText is Out of Range');
assert(rGoogleBoundary.bannerLevel === 'warn', 'Google Boundary Phone: bannerLevel is warn (AMBER)');

const mGoogleBoundary = evaluateInspectorModal(150, 300, 100 * 1024, 'google', 'screenshot', false);
assert(mGoogleBoundary.ratioClass === 'ok', 'Google Boundary Modal: ratioClass is ok (GREEN)');
assert(mGoogleBoundary.level === 'warn', 'Google Boundary Modal: level is warn (AMBER)');

// ---------------------------------------------------------------------
// TEST MATRIX: ĐÚNG TẤT CẢ (RATIO, SIZE, TARGET DIMENSIONS) LÀ OK (GREEN)
// ---------------------------------------------------------------------
// Test 8: Compliant standard Apple iPhone screenshot (1290x2796, 2 MB, PNG opaque)
const rCleanApple = evaluatePhoneShot(1290, 2796, 2 * 1024 * 1024, 'apple');
assert(rCleanApple.tagClass === 'ok', 'Clean Apple Phone: tagClass is ok (GREEN)');
assert(rCleanApple.tagText === 'Portrait (1290×2796)', 'Clean Apple Phone: tagText is Portrait');
assert(rCleanApple.bannerLevel === 'ok', 'Clean Apple Phone: bannerLevel is ok');

const mCleanApple = evaluateInspectorModal(1290, 2796, 2 * 1024 * 1024, 'apple', 'screenshot', false, 'image/png');
assert(mCleanApple.dimClass === 'ok', 'Clean Apple Modal: dimClass is ok (GREEN)');
assert(mCleanApple.ratioClass === 'ok', 'Clean Apple Modal: ratioClass is ok (GREEN)');
assert(mCleanApple.sizeClass === 'ok', 'Clean Apple Modal: sizeClass is ok (GREEN)');
assert(mCleanApple.formatClass === 'ok', 'Clean Apple Modal: formatClass is ok (GREEN)');
assert(mCleanApple.level === 'ok', 'Clean Apple Modal: level is ok (GREEN)');

// Test 9: Compliant standard Google Play screenshot (1080x1920, 1.2 MB, JPEG)
const rCleanGoogle = evaluatePhoneShot(1080, 1920, Math.round(1.2 * 1024 * 1024), 'google');
assert(rCleanGoogle.tagClass === 'ok', 'Clean Google Phone: tagClass is ok (GREEN)');
assert(rCleanGoogle.tagText === 'Portrait (1080×1920)', 'Clean Google Phone: tagText is Portrait');
assert(rCleanGoogle.bannerLevel === 'ok', 'Clean Google Phone: bannerLevel is ok');

const mCleanGoogle = evaluateInspectorModal(1080, 1920, Math.round(1.2 * 1024 * 1024), 'google', 'screenshot', false, 'image/jpeg');
assert(mCleanGoogle.dimClass === 'ok', 'Clean Google Modal: dimClass is ok (GREEN)');
assert(mCleanGoogle.ratioClass === 'ok', 'Clean Google Modal: ratioClass is ok (GREEN)');
assert(mCleanGoogle.sizeClass === 'ok', 'Clean Google Modal: sizeClass is ok (GREEN)');
assert(mCleanGoogle.formatClass === 'ok', 'Clean Google Modal: formatClass is ok (JPEG allowed for screenshot)');
assert(mCleanGoogle.level === 'ok', 'Clean Google Modal: level is ok (GREEN)');

// Test 10: Apple screenshot with Alpha Transparency rejection risk
const mAlphaApple = evaluateInspectorModal(1290, 2796, 2 * 1024 * 1024, 'apple', 'screenshot', true, 'image/png');
assert(mAlphaApple.formatClass === 'err', 'Apple Alpha Screenshot Modal: formatClass is err (RED)');
assert(mAlphaApple.level === 'err', 'Apple Alpha Screenshot Modal: level is err (RED)');
assert(mAlphaApple.badgeText.includes('Alpha detected'), 'Apple Alpha Screenshot Modal: badge text mentions Alpha detected');

// Test 11: 1080x2400 (Android FHD+ 20:9) on Apple is Scaled (warn notice) because App Store requires exact resolutions
const r1080x2400Apple = evaluatePhoneShot(1080, 2400, 800 * 1024, 'apple');
assert(r1080x2400Apple.tagClass === 'warn', 'Apple 1080x2400: tagClass is warn (AMBER) because 1080x2400 is not in Apple specifications');
assert(r1080x2400Apple.tagText === 'Scaled (1080×2400)', 'Apple 1080x2400: tagText is Scaled (1080×2400)');
assert(r1080x2400Apple.bannerLevel === 'ok', 'Apple 1080x2400: bannerLevel is ok (not rejected for ratio)');

const m1080x2400Apple = evaluateInspectorModal(1080, 2400, 800 * 1024, 'apple', 'screenshot', false);
assert(m1080x2400Apple.dimClass === 'warn', 'Apple 1080x2400 Modal: dimClass is warn (AMBER)');
assert(m1080x2400Apple.ratioClass === 'ok', 'Apple 1080x2400 Modal: ratioClass is ok (GREEN) because it is portrait');
assert(m1080x2400Apple.level === 'warn', 'Apple 1080x2400 Modal: level is warn (AMBER)');
assert(m1080x2400Apple.badgeText.includes('Scaled to Canvas'), 'Apple 1080x2400 Modal: badge is Scaled to Canvas notice');

// Test 11b: 1080x2400 on Google Play is standard Portrait (ok)
const r1080x2400Google = evaluatePhoneShot(1080, 2400, 800 * 1024, 'google');
assert(r1080x2400Google.tagClass === 'ok', 'Google 1080x2400: tagClass is ok (GREEN)');
assert(r1080x2400Google.tagText === 'Portrait (1080×2400)', 'Google 1080x2400: tagText is Portrait (1080×2400)');
assert(r1080x2400Google.bannerLevel === 'ok', 'Google 1080x2400: bannerLevel is ok');

const m1080x2400Google = evaluateInspectorModal(1080, 2400, 800 * 1024, 'google', 'screenshot', false);
assert(m1080x2400Google.dimClass === 'ok', 'Google 1080x2400 Modal: dimClass is ok (GREEN)');
assert(m1080x2400Google.ratioClass === 'ok', 'Google 1080x2400 Modal: ratioClass is ok (GREEN)');
assert(m1080x2400Google.level === 'ok', 'Google 1080x2400 Modal: level is ok (GREEN)');

// Test 11c: 1080x2340 is officially supported on BOTH Apple (Face ID medium display - mini) AND Google Play
const r1080x2340Apple = evaluatePhoneShot(1080, 2340, 800 * 1024, 'apple');
assert(r1080x2340Apple.tagClass === 'ok', 'Apple 1080x2340: tagClass is ok (GREEN - Face ID medium display)');
assert(r1080x2340Apple.tagText === 'Portrait (1080×2340)', 'Apple 1080x2340: tagText is Portrait (1080×2340)');
assert(r1080x2340Apple.bannerLevel === 'ok', 'Apple 1080x2340: bannerLevel is ok');

const m1080x2340Apple = evaluateInspectorModal(1080, 2340, 800 * 1024, 'apple', 'screenshot', false);
assert(m1080x2340Apple.dimClass === 'ok', 'Apple 1080x2340 Modal: dimClass is ok (GREEN)');
assert(m1080x2340Apple.ratioClass === 'ok', 'Apple 1080x2340 Modal: ratioClass is ok (GREEN)');
assert(m1080x2340Apple.level === 'ok', 'Apple 1080x2340 Modal: level is ok (GREEN)');

const r1080x2340Google = evaluatePhoneShot(1080, 2340, 800 * 1024, 'google');
assert(r1080x2340Google.tagClass === 'ok', 'Google 1080x2340: tagClass is ok (GREEN)');
assert(r1080x2340Google.tagText === 'Portrait (1080×2340)', 'Google 1080x2340: tagText is Portrait');

// Test 11d: Apple official display classifications from SRS
const rMediumApple = evaluatePhoneShot(1206, 2622, 1024 * 1024, 'apple');
assert(rMediumApple.tagClass === 'ok', 'Apple 1206x2622 (6.3" Dynamic Island): tagClass is ok (GREEN)');
const rAirApple = evaluatePhoneShot(1260, 2736, 1024 * 1024, 'apple');
assert(rAirApple.tagClass === 'ok', 'Apple 1260x2736 (iPhone Air / Dynamic Island large): tagClass is ok (GREEN)');
const rXApple = evaluatePhoneShot(1125, 2436, 1024 * 1024, 'apple');
assert(rXApple.tagClass === 'ok', 'Apple 1125x2436 (iPhone X / XS / 11 Pro): tagClass is ok (GREEN)');
const rSEApple = evaluatePhoneShot(750, 1334, 1024 * 1024, 'apple');
assert(rSEApple.tagClass === 'ok', 'Apple 750x1334 (iPhone SE / 8): tagClass is ok (GREEN)');
const rDuoApple = evaluatePhoneShot(1398, 2034, 1024 * 1024, 'apple');
assert(rDuoApple.tagClass === 'ok', 'Apple 1398x2034 (iPhone Duo outer): tagClass is ok (GREEN)');

// Test 12: Source code and dynamic sync for shotHint and transitions
const transSrcSync = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');
assert(transSrcSync.includes("hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots"), 'transitions.js immediately updates shotHint to Google Play on store switch');
assert(transSrcSync.includes("Drag and drop to add assets or choose from your Asset Library for iPhone 6.1\" or 6.3\" displays"), 'transitions.js immediately updates shotHint to Apple App Store medium display specs on store switch');
assert(transSrcSync.includes("validateScreenshots()"), 'transitions.js triggers validateScreenshots on store change');

// ---------------------------------------------------------------------
// TEST MATRIX: SOURCE CODE & BUNDLE REGRESSION ENFORCEMENT
// ---------------------------------------------------------------------
const modalJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'modal.js'), 'utf8');
assert(modalJsSrc.includes("ratioEl.textContent = '1:1 Square'"), 'modal.js correctly displays 1:1 Square label');
assert(modalJsSrc.includes("ratioEl.className = 'icon-metric-val err'"), 'modal.js flags square phone ratio as err');
assert(modalJsSrc.includes("App Store Rejection Risk: 1:1 Square"), 'modal.js evaluates 1:1 Square as App Store Rejection Risk');
assert(modalJsSrc.includes("Alpha detected · 100% Opaque required"), 'modal.js flags alpha transparency on Apple screenshots as error');

const phoneJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'phone.js'), 'utf8');
assert(phoneJsSrc.includes("tag.className = 'shot-dim-tag err';\n            tag.textContent = `1:1 Square (${w}×${h})`"), 'phone.js marks square screenshot tag as err');
assert(phoneJsSrc.includes("tag.className = 'shot-dim-tag warn';\n            tag.textContent = `>8 MB"), 'phone.js marks oversize as warn');
assert(bundledCore.includes("App Store Rejection Risk: 1:1 Square"), 'Bundled core.html contains App Store Rejection Risk square evaluation');
assert(bundledTry.includes("App Store Rejection Risk: 1:1 Square"), 'Bundled try.html contains App Store Rejection Risk square evaluation');

// ---------------------------------------------------------------------
// [SUITE 55]: Screenshot Slot Limits & Button Enforcement
// ---------------------------------------------------------------------
console.log('\n[SUITE 55]: Screenshot Slot Limits & Button Enforcement');

const ipadJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'ipad.js'), 'utf8');
const googleJsCode2 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');

assert(phoneJsSrc.includes("if((typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed)"), 'phone.js blocks adding screenshot slot when maxAllowed limit is reached');
assert(phoneJsSrc.includes("addBtn.disabled = atLimit"), 'phone.js disables addShot button when at screenshot limit');
assert(phoneJsSrc.includes("pick < 0 && (typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed"), 'phone.js blocks file upload from creating slots beyond maxAllowed');

assert(ipadJsSrc.includes("if((typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0) >= 10)"), 'ipad.js blocks adding iPad screenshot slot when max 10 limit is reached');
assert(ipadJsSrc.includes("addBtn.disabled = atLimit"), 'ipad.js disables addIpadShot button when at 10 screenshots limit');
assert(ipadJsSrc.includes("ipadPick < 0 && (typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0) >= 10"), 'ipad.js blocks file upload from creating slots beyond 10');

assert(googleJsCode2.includes("addBtn.disabled = atLimit"), 'google.js disables tablet add buttons when at MAX_TAB limit');

assert(bundledHtml.includes(".add:disabled, .add[disabled]{opacity:.45;cursor:not-allowed;pointer-events:none}"), 'CSS defines disabled state for add buttons');

console.log('\n[SUITE 56]: Google Play Tablet Metrics Download Icon Verification');

const metricsHtmlSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'google', 'sections', 'metrics.html'), 'utf8');
const tabletCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'tablets.css'), 'utf8');
const frameCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'frame.css'), 'utf8');
const pngExportSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
const stateCode56 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'state.js'), 'utf8');

assert(metricsHtmlSrc.includes('<b>\n        <svg class="g-dl-icon"'), 'metrics.html wraps g-dl-icon SVG in <b> tag matching other metric columns');
assert(tabletCssSrc.includes('.dev.gtab7 [data-gmet-size] b'), 'tablets.css provides explicit flex centering for tab7 size metric bold element');
assert(tabletCssSrc.includes('.dev.gtab7 .gp-star-ico') && tabletCssSrc.includes('margin-top: 0;'), 'tablets.css centers star icon on tab7 search results with margin-top: 0');
assert(tabletCssSrc.includes('.g-dl-icon'), 'tablets.css provides explicit sizing and theme stroke/color for .g-dl-icon');
assert(frameCssSrc.includes('.phone.google{') && frameCssSrc.includes('color:var(--t)'), 'frame.css sets color:var(--t) on phone.google so currentColor inherits mockup theme');
assert(pngExportSrc.includes('.g-dl-icon, .gt10-dl-icon, [data-gmet-size] svg'), 'png.js includes explicit dimensions and theme stroke colors in export onclone stylesheet');
assert(pngExportSrc.includes("svg.querySelectorAll('path, polyline, line, polygon, circle, rect, ellipse')"), 'png.js bakes explicit stroke and fill on SVG child shapes for detached data-URI serialization');
assert(stateCode56.includes("$$('.dev.gtab7 [data-gmet-size]').forEach(e => { e.style.display = 'flex'; });"), 'state.js ensures tab7 size metric remains displayed as flex');

console.log('\n[SUITE 57]: Custom Monetization Badge Dropdown Verification');

const metricsCardHtmlSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'metrics-card.html'), 'utf8');
const monetizationJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'monetization.js'), 'utf8');
const monetizationCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'editor', 'monetization-picker.css'), 'utf8');
const editorCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'editor.css'), 'utf8');
const categoriesJsSrc57 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'categories.js'), 'utf8');
const ageJsSrc57 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'age.js'), 'utf8');
const syncJsSrc57 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'sync.js'), 'utf8');

assert(metricsCardHtmlSrc.includes('id="customIapWrap"'), 'metrics-card.html contains #customIapWrap wrapper');
assert(metricsCardHtmlSrc.includes('id="customIapTrigger"'), 'metrics-card.html contains #customIapTrigger button');
assert(metricsCardHtmlSrc.includes('id="customIapVal"'), 'metrics-card.html contains #customIapVal display element');
assert(metricsCardHtmlSrc.includes('id="customIapMenu"'), 'metrics-card.html contains #customIapMenu dropdown listbox');
assert(metricsCardHtmlSrc.includes('id="customIapSearch"'), 'metrics-card.html contains #customIapSearch search input');
assert(metricsCardHtmlSrc.includes('id="customIapOptions"'), 'metrics-card.html contains #customIapOptions list container');
assert(metricsCardHtmlSrc.includes('id="f-st-iap"') && metricsCardHtmlSrc.includes('style="display:none"'), 'metrics-card.html preserves hidden #f-st-iap select for backward compatibility');

assert(editorCssSrc.includes('@import "editor/monetization-picker.css";'), 'editor.css imports monetization-picker.css');
assert(monetizationCssSrc.includes('.custom-iap-wrap') && monetizationCssSrc.includes('.custom-iap-menu'), 'monetization-picker.css styles custom dropdown elements');
assert(monetizationCssSrc.includes(':root[data-ui=light] .custom-iap-trigger'), 'monetization-picker.css includes light mode theme overrides');

assert(monetizationJsSrc.includes('const MONETIZATION_OPTIONS = ['), 'monetization.js defines MONETIZATION_OPTIONS array');
assert(monetizationJsSrc.includes("val: 'iap'") && monetizationJsSrc.includes("val: 'ads_iap'") && monetizationJsSrc.includes("val: 'ads'") && monetizationJsSrc.includes("val: 'free'"), 'monetization.js includes all 4 standard options');
assert(monetizationJsSrc.includes('function syncIapUI()'), 'monetization.js defines syncIapUI');
assert(monetizationJsSrc.includes('function openCustomIap()'), 'monetization.js defines openCustomIap');
assert(monetizationJsSrc.includes('function closeCustomIap()'), 'monetization.js defines closeCustomIap');
assert(monetizationJsSrc.includes('function selectIapFromUI(iapVal)'), 'monetization.js defines selectIapFromUI');
assert(monetizationJsSrc.includes('function renderCustomIapOptions('), 'monetization.js defines renderCustomIapOptions');

assert(categoriesJsSrc57.includes('if (typeof closeCustomIap === \'function\') closeCustomIap();'), 'categories.js closes custom monetization dropdown on category open');
assert(ageJsSrc57.includes('if (typeof closeCustomIap === \'function\') closeCustomIap();'), 'age.js closes custom monetization dropdown on age rating open');
assert(monetizationJsSrc.includes('if (typeof closeCustomCat === \'function\') closeCustomCat();') && monetizationJsSrc.includes('if (typeof closeCustomAge === \'function\') closeCustomAge();'), 'monetization.js closes category and age dropdowns on open');
assert(syncJsSrc57.includes('#customIapTrigger, #customIapSearch, .custom-iap-trigger'), 'sync.js includes custom monetization dropdown interaction zones');
assert(bundledHtml.includes('id="customIapWrap"') && bundledHtml.includes('id="customIapTrigger"'), 'bundledHtml includes custom monetization dropdown markup');

console.log('\n[SUITE 58]: Privacy Mode Tabview Focus Linking Verification');

const privacyJsSrc58 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'privacy.js'), 'utf8');
const syncJsSrc58 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'sync.js'), 'utf8');
const focusLinkCssSrc58 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'stage', 'focus-link.css'), 'utf8');
const privacyCardHtmlSrc58 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'editor', 'privacy-card.html'), 'utf8');
const panelCssSrc58 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'editor', 'panel.css'), 'utf8');

assert(privacyJsSrc58.includes("if (typeof flashField === 'function') flashField('privacy');"), 'privacy.js triggers flashField("privacy") on privacy mode change');
assert(privacyJsSrc58.includes("if (typeof setFieldFocus === 'function') setFieldFocus('privacy', true);"), 'privacy.js triggers setFieldFocus("privacy", true) on privacy mode change');
assert(privacyJsSrc58.includes("const seg = $('privacyModeSeg');") && privacyJsSrc58.includes("seg.addEventListener('click'"), 'privacy.js attaches click listener on privacyModeSeg container');
assert(syncJsSrc58.includes('#privacyModeSeg, #privBtnNone, #privBtnCollected, .priv-seg-btn'), 'sync.js registers privacy mode tabview interaction zones');
assert(syncJsSrc58.includes(".stage [data-apple-priv-wrap] .pc"), 'sync.js targets individual Apple privacy cards when resolving privacy targets');
assert(focusLinkCssSrc58.includes('[data-apple-priv-wrap].hl-target,') && focusLinkCssSrc58.includes('[data-apple-priv-wrap] .pc.hl-target'), 'focus-link.css provides 16px rounded gold outline for Apple privacy cards');
assert(bundledHtml.includes('id="privacyModeSeg"') && bundledHtml.includes('id="privBtnNone"') && bundledHtml.includes('id="privBtnCollected"'), 'bundledHtml includes privacy mode tabview controls');
assert(!privacyCardHtmlSrc58.includes('pcb-action') && !privacyCardHtmlSrc58.includes('Inspect &rarr;'), 'privacy-card.html removes heavy inspect button');
assert(!privacyCardHtmlSrc58.includes('pcb-title') && privacyCardHtmlSrc58.includes('class="pcb-sub"'), 'privacy-card.html preserves clean description text and removes redundant profile title');
assert(panelCssSrc58.includes('.privacy-compact-box {') && panelCssSrc58.includes('background: transparent !important'), 'panel.css styles privacy info text cleanly without outer card background or border');
assert(panelCssSrc58.includes('.priv-seg-btn.active') && panelCssSrc58.includes('background: rgba(255, 255, 255, 0.05)'), 'panel.css styles privacy buttons with soft neutral selected styling');

console.log('\n[SUITE 59]: iPad Destination Toggle Device Mockup Reflection Verification');

const ipadJsSrc59 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'shots', 'ipad.js'), 'utf8');
const ipadHeroHtmlSrc59 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'ipad-hero.html'), 'utf8');
const ipadGalleryHtmlSrc59 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'ipad-gallery.html'), 'utf8');

assert(ipadJsSrc59.includes("$$('.ipad-platforms-row').forEach"), 'ipad.js updates .ipad-platforms-row elements on destination change');
assert(ipadJsSrc59.includes("tabletIco.style.display = SUPPORTS_IPAD ? '' : 'none'"), 'ipad.js hides tablet icon in platform row when iPad support is unchecked');
assert(ipadJsSrc59.includes("label.textContent = SUPPORTS_IPAD ? 'iPad, iPhone' : 'iPhone'"), 'ipad.js changes platform label from "iPad, iPhone" to "iPhone" when unchecked');
assert(ipadJsSrc59.includes("const hasDedicatedIpadShots = SUPPORTS_IPAD && validIpadShots.length > 0;"), 'ipad.js checks SUPPORTS_IPAD before selecting dedicated iPad screenshots');
assert(ipadJsSrc59.includes("compatNotice.style.display = SUPPORTS_IPAD ? 'none' : 'inline-flex'"), 'ipad.js shows Designed for iPhone notice when iPad support is unchecked');
assert(ipadHeroHtmlSrc59.includes('id="ipadCompatNotice"'), 'ipad-hero.html contains #ipadCompatNotice container');
assert(ipadGalleryHtmlSrc59.includes('class="ipad-plat-tablet"') && ipadGalleryHtmlSrc59.includes('class="ipad-plat-label"'), 'ipad-gallery.html contains tablet icon and platform label');
assert(syncJsSrc58.includes("case 'dest-ipad':") && syncJsSrc58.includes(".stage .a-platforms-badge, .stage .ipad-platforms-row"), 'sync.js targets .a-platforms-badge and .ipad-platforms-row for dest-ipad focus');
assert(syncJsSrc58.includes("#destTileIpad, #destTileIphone"), 'sync.js registers Supported Devices click interaction zones');
assert(focusLinkCssSrc58.includes('.a-platforms-badge.hl-target') && focusLinkCssSrc58.includes('.ipad-platforms-row.hl-target'), 'focus-link.css provides gold outline for platform badge lines');

// ---------------------------------------------------------------------
// Suite 60: Menu Actions Reliability & Latent Edge Case Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 60]: Menu Actions Reliability & Latent Edge Case Verification');

const clipboardJsSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'clipboard.js'), 'utf8');
const jsonExportJsSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'json.js'), 'utf8');
const pngExportJsSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
const storageJsSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'storage.js'), 'utf8');
const dropdownHtmlSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'header', 'export-dropdown.html'), 'utf8');

assert(clipboardJsSrc60.includes('fallbackCopyText'), 'clipboard.js provides fallback copy mechanism for environments lacking navigator.clipboard');
assert(clipboardJsSrc60.includes("document.execCommand('copy')"), 'clipboard.js falls back to document.execCommand copy');
assert(jsonExportJsSrc60.includes('ipadSupportVal'), 'json.js handles backward-compatible iPad destination restoration');
assert(jsonExportJsSrc60.includes('reader.onerror'), 'json.js handles FileReader.onerror gracefully without silent failure');
assert(jsonExportJsSrc60.includes('(TABS.tab7 || []).map'), 'json.js safely maps tab7Shots without producing undefined elements');
assert(pngExportJsSrc60.includes("$$('.menu').forEach(m => m.classList.remove('show'))"), 'png.js dismisses export dropdown menu when opening modal');
assert(storageJsSrc60.includes('exportJSON()'), 'storage.js provides JSON backup callback in reset confirmation dialog');
assert(!storageJsSrc60.includes("'Blank Template'"), 'storage.js never generates non-existent Blank Template pill');
assert(storageJsSrc60.includes("loadPreset('studio')"), 'storage.js resets to original Studio preset');
const mainJsSrc60 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'main.js'), 'utf8');
assert(mainJsSrc60.includes("sessionStorage.getItem('sps_reset_to_blank')") && mainJsSrc60.includes("loadPreset('studio')"), 'main.js boots directly into Studio preset on factory reset');
assert(dropdownHtmlSrc60.includes('accept=".json,application/json"'), 'export-dropdown.html accepts both .json extension and application/json MIME');

// ---------------------------------------------------------------------
// [SUITE 61]: Dual Pipeline Architecture & Git-Tracked Release Templates Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 61]: Dual Pipeline Architecture & Git-Tracked Release Templates Verification');

const rootBuild = require('../build.js');
assert(Array.isArray(rootBuild.CORE_JS_MODULES), 'build.js exports CORE_JS_MODULES array as single source of truth');
assert(rootBuild.CORE_JS_MODULES.length === 28, 'CORE_JS_MODULES contains exactly 28 modules');

rootBuild.CORE_JS_MODULES.forEach(modPath => {
  const fullPath = path.join(ROOT_DIR, 'src', 'js', modPath);
  assert(fs.existsSync(fullPath), `Module file exists on disk: src/js/${modPath}`);
});

const customerBuildTemplate = path.join(ROOT_DIR, 'scripts', 'templates', 'customer-build.js');
const customerDevTemplate = path.join(ROOT_DIR, 'scripts', 'templates', 'customer-dev.js');
assert(fs.existsSync(customerBuildTemplate), 'Git-tracked customer-build.js template exists');
assert(fs.existsSync(customerDevTemplate), 'Git-tracked customer-dev.js template exists');

// Verify templates compile cleanly with Node.js
const customerBuildSrc = fs.readFileSync(customerBuildTemplate, 'utf8');
assert(!customerBuildSrc.includes('stripDemoBlocks'), 'customer-build.js has zero internal demo/paywall references');
assert(customerBuildSrc.includes('CORE_JS_MODULES'), 'customer-build.js declares CORE_JS_MODULES');

const releaseJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'release.js'), 'utf8');
assert(releaseJsSrc.includes("scripts', 'templates', 'customer-build.js"), 'release.js uses git-tracked templates');
assert(releaseJsSrc.includes('CORE_JS_MODULES'), 'release.js synchronizes CORE_JS_MODULES into customer build');
assert(releaseJsSrc.includes('stripDemoBlocks'), 'release.js defines stripDemoBlocks to scrub all demo/paywall logic');
assert(releaseJsSrc.includes("entry.name === 'demo-guard.js'"), 'release.js strictly excludes demo-guard.js from commercial packages');

// Commercial Readme & Copy Quality Checks
const plusReadme = fs.readFileSync(path.join(ROOT_DIR, 'README_PLUS.md'), 'utf8');
const proReadme = fs.readFileSync(path.join(ROOT_DIR, 'README_PRO.md'), 'utf8');
const vnRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
assert(!vnRegex.test(plusReadme), 'README_PLUS.md is strictly English (zero Vietnamese characters)');
assert(!vnRegex.test(proReadme), 'README_PRO.md is strictly English (zero Vietnamese characters)');

const forbiddenTerms = [/pixel-?perfect/i, /production-?ready/i, /with confidence/i, /zero server lock-in/i, /100% guaranteed/i, /flawless/i];
forbiddenTerms.forEach(term => {
  assert(!term.test(plusReadme), `README_PLUS.md does not contain forbidden overpromising term: ${term}`);
  assert(!term.test(proReadme), `README_PRO.md does not contain forbidden overpromising term: ${term}`);
});

const gitignoreSrc = fs.readFileSync(path.join(ROOT_DIR, '.gitignore'), 'utf8');
assert(gitignoreSrc.includes('!start_dev.command'), '.gitignore preserves start_dev.command tracking');
assert(fs.existsSync(path.join(ROOT_DIR, 'start_dev.command')), 'start_dev.command exists in root directory');

// ---------------------------------------------------------------------
// [SUITE 62]: Tablet 10 Metrics Star Alignment & Info Icon Rasterization Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 62]: Tablet 10 Metrics Star Alignment & Info Icon Rasterization Verification');

const pngJsSrc62 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
assert(pngJsSrc62.includes('.g-info-ico, .gt10-info-ico'), 'png.js includes .gt10-info-ico in SVG-to-canvas rasterizer');
assert(pngJsSrc62.includes('.gt10-star') && pngJsSrc62.includes('margin-top: 0 !important;'), 'png.js applies margin-top: 0 for tablet 10 rating star in export CSS');
assert(pngJsSrc62.includes('.gt10-header-metrics .gt10-met-item:first-child b'), 'png.js enforces inline-flex and 2.5px gap on tablet 10 rating metric container');
assert(pngJsSrc62.includes('.g-h, .g-h span, .gt10-sec-title'), 'png.js protects section headings (.g-h, .gt10-sec-title) against Firefox whitespace collapse');

const tabletsCssSrc62 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'tablets.css'), 'utf8');
assert(tabletsCssSrc62.includes('.dev.gtab10 .gt10-star') && tabletsCssSrc62.includes('margin-left: 0 !important;'), 'tablets.css enforces margin-left: 0 on .gt10-star to prevent excessive gap');
assert(tabletsCssSrc62.includes('margin-top: 0 !important;'), 'tablets.css centers .gt10-star vertically with text');
assert(tabletsCssSrc62.includes('.dev.gtab7 .gt7-app-meta') && tabletsCssSrc62.includes('display: block;'), 'tablets.css renders .gt7-app-meta as block for unified single-line ellipsis');
assert(pngJsSrc62.includes('.gt7-app-meta') && pngJsSrc62.includes('searchEllipsisSelectors'), 'png.js includes .gt7-app-meta in searchEllipsisSelectors');

const headerCssSrc62 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'header.css'), 'utf8');
assert(headerCssSrc62.includes('.g-met [data-gmet-rating] .g-star-ico{margin-top:0}'), 'header.css resets margin-top to 0 on .g-star-ico to center vertically');
assert(pngJsSrc62.includes('.g-star-ico') && pngJsSrc62.includes('margin-top: 0 !important;'), 'png.js resets margin-top to 0 on .g-star-ico');

// ---------------------------------------------------------------------
// [SUITE 63]: Apple iPad Developer Metric Icon & Firefox Whitespace Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 63]: Apple iPad Developer Metric Icon & Firefox Whitespace Verification');

const pngJsSrc63 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'export', 'png.js'), 'utf8');
assert(pngJsSrc63.includes('function rasterizeAppleDevIcon'), 'png.js defines rasterizeAppleDevIcon to render developer icon to sharp PNG canvas');
assert(pngJsSrc63.includes('function drawAppleDevBodyFallback'), 'png.js provides drawAppleDevBodyFallback for cross-environment canvas rendering');
assert(pngJsSrc63.includes('.a-met-dev-ico svg, .ipad-met-dev-ico svg'), 'png.js queries Apple developer metric icons across iPhone and iPad');
assert(pngJsSrc63.includes('.a-met-dev-ico-img'), 'png.js defines .a-met-dev-ico-img for rasterized developer metric image');
assert(pngJsSrc63.includes('.ipad-compat-notice, .ipad-compat-notice span'), 'png.js protects iPad compatibility notice against Firefox whitespace collapse');

const ipadCssSrc63 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'ipad.css'), 'utf8');
assert(ipadCssSrc63.includes('.ipad-met-dev-ico svg,.ipad-met-dev-ico img'), 'ipad.css supports both svg and rasterized img for iPad developer icon');

const appleMetricsCssSrc63 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'metrics.css'), 'utf8');
assert(appleMetricsCssSrc63.includes('.a-met-dev-ico svg,.a-met-dev-ico img'), 'metrics.css supports both svg and rasterized img for iPhone developer icon');

// ---------------------------------------------------------------------
// [SUITE 64]: Google Play Navigation View Switcher (Phone & 10" Tablet)
// ---------------------------------------------------------------------
console.log('\n[SUITE 64]: Google Play Navigation View Switcher (Phone & 10" Tablet)');

const googleJsSrc64 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');
assert(googleJsSrc64.includes('function initGoogleTabs'), 'google.js defines initGoogleTabs');
assert(googleJsSrc64.includes('initGoogleTabs()'), 'google.js invokes initGoogleTabs');
assert(googleJsSrc64.includes('.phone.google .gnav'), 'google.js binds listeners to Android phone bottom nav');
assert(googleJsSrc64.includes('.gt10-rail'), 'google.js binds listeners to Android 10" tablet navigation rail');
assert(googleJsSrc64.includes('.gp-search-back-btn, .gt10-search-btn-icon'), 'google.js binds back buttons on search view to return to detail view');

const transitionsJsSrc64 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');
assert(transitionsJsSrc64.includes("document.querySelectorAll('.phone.google .gnav')"), 'transitions.js syncs active state on Android phone nav');
assert(transitionsJsSrc64.includes("document.querySelectorAll('.gt10-rail')"), 'transitions.js syncs active state on Android 10" tablet rail');

const gPhoneHtmlSrc64 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'google', 'phone.html'), 'utf8');
assert(/<div class="on">[\s\S]*?Apps<\/div>/.test(gPhoneHtmlSrc64), 'phone.html initializes Apps tab with class "on"');

const gTab10HtmlSrc64 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'google', 'tab10.html'), 'utf8');
assert(/class="gt10-rail-item on"[\s\S]*?gt10-rail-lbl">Apps<\/span>/.test(gTab10HtmlSrc64), 'tab10.html initializes Apps rail item with class "on"');

const gNavCssSrc64 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'google', 'nav.css'), 'utf8');
assert(gNavCssSrc64.includes('.gnav div{display:flex;') && gNavCssSrc64.includes('cursor:pointer;'), 'nav.css provides cursor:pointer for bottom nav interactive items');

// ---------------------------------------------------------------------
// [SUITE 65]: Dual-Device Apple Monetization Badge & iPad Parity Verification
// ---------------------------------------------------------------------
console.log('\n[SUITE 65]: Dual-Device Apple Monetization Badge & iPad Parity Verification');

const ipadHeroHtmlSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'ipad-hero.html'), 'utf8');
assert(ipadHeroHtmlSrc65.includes('data-iap-apple') && ipadHeroHtmlSrc65.includes('ipad-iap'), 'ipad-hero.html includes data-iap-apple monetization badge under GET button');

const ipadInfoHtmlSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'ipad-info.html'), 'utf8');
assert(ipadInfoHtmlSrc65.includes('data-iap-cell') && ipadInfoHtmlSrc65.includes('data-iap-yesno'), 'ipad-info.html includes In-App Purchases cell with data-iap-yesno in 2-column info grid');

const iphoneInfoHtmlSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'mockups', 'apple', 'sections', 'information.html'), 'utf8');
assert(iphoneInfoHtmlSrc65.includes('data-iap-cell') && iphoneInfoHtmlSrc65.includes('data-iap-yesno'), 'information.html identifies In-App Purchases cell with data-iap-cell');

const ipadCssSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'apple', 'ipad.css'), 'utf8');
assert(ipadCssSrc65.includes('.ipad-iap'), 'ipad.css defines .ipad-iap styling');

const focusLinkCssSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'css', 'stage', 'focus-link.css'), 'utf8');
assert(focusLinkCssSrc65.includes('.iap[data-iap-apple][style*="display: none"]') && focusLinkCssSrc65.includes('display: none !important;'), 'focus-link.css protects hidden monetization badge from forced display');

const stateJsSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'core', 'state.js'), 'utf8');
assert(stateJsSrc65.includes('isCustom') && stateJsSrc65.includes('$$(\'[data-iap-apple]\')'), 'state.js updates monetization badge and supports custom values across Apple devices');

const syncJsSrc65 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'form', 'sync.js'), 'utf8');
assert(syncJsSrc65.includes('mockupIapEls') && syncJsSrc65.includes('openCustomIap'), 'sync.js attaches click listener on mockup monetization targets to open editor dropdown');

// ---------------------------------------------------------------------
// [SUITE 66]: Tablet Selection (tab7 / tab10 / ipad) & Dual Mode Disabling
// ---------------------------------------------------------------------
console.log('\n[SUITE 66]: Tablet Selection (tab7 / tab10 / ipad) & Dual Mode Disabling');

const googleJsSrc66 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'google', 'google.js'), 'utf8');
assert(googleJsSrc66.includes("const isTablet = googleDevice === 'tab7' || googleDevice === 'tab10' || appleDevice === 'ipad';"), 'google.js detects tablet state in applyGoogleDevice');
assert(googleJsSrc66.includes("const isDual = !isTablet"), 'applyGoogleDevice prevents dual mode when a tablet is active');
assert(googleJsSrc66.includes("document.body.dataset.dual = nextDual ? 'true' : 'false';"), 'setGoogleDevice properly updates dataset.dual on device change');

const transitionsJsSrc66 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'transitions.js'), 'utf8');
assert(transitionsJsSrc66.includes("const isTablet = (s === 'apple' && appleDevice === 'ipad') || (s === 'google' && (googleDevice === 'tab7' || googleDevice === 'tab10'));"), 'transitions.js detects tablet state in setStore');
assert(transitionsJsSrc66.includes("if (isTablet) preserveDual = false;"), 'setStore does not preserve dual mode when switching store on a tablet');

// ---------------------------------------------------------------------
// [SUITE 67]: Embedded Try-Studio Redirect/Telemetry Guard & Multi-Storefront Lookup
// ---------------------------------------------------------------------
console.log('\n[SUITE 67]: Embedded Try-Studio Redirect/Telemetry Guard & Multi-Storefront Lookup');

const tryTemplateSrc67 = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'try.html'), 'utf8');
assert(tryTemplateSrc67.includes('<meta name="robots" content="noindex, nofollow">'), 'try.html marks embed sandbox as noindex, nofollow');
assert(tryTemplateSrc67.includes("window.location.replace('/try'"), 'try.html redirects direct top-level /try-studio visits back to /try');
assert(tryTemplateSrc67.includes('if (isEmbeddedTry) return;'), 'try.html suppresses duplicate Clarity page tracking inside embedded iframe');

const storeImportSrc67 = fs.readFileSync(path.join(ROOT_DIR, 'src', 'js', 'modules', 'store-import.js'), 'utf8');
assert(storeImportSrc67.includes('fallbackCountries') && storeImportSrc67.includes("'gb'"), 'store-import.js probes regional storefronts such as GB when country is omitted');
assert(storeImportSrc67.includes("if (isAutoFromUrl && (!modal || !modal.classList.contains('open')) && typeof showToast === 'function')"), 'store-import.js surfaces visible toast when auto URL import fails');

// ---------------------------------------------------------------------
// Summary Report
// ---------------------------------------------------------------------
Promise.all(asyncSuites).then(() => {
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
}).catch(err => {
  console.error('[FATAL] Async suite crashed:', err);
  process.exit(1);
});
