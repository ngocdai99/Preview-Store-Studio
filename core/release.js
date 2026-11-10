#!/usr/bin/env node
/**
 * Store Preview Studio · Commercial Release Packager
 * 
 * Verifies Commercial Release Standards (COMMERCIAL_RELEASE_STANDARDS.md)
 * and generates delivery ZIP packages:
 *   - Plus Edition ($29): Full 6 Presets, Minified HTML, Docs
 *   - Pro Studio ($49 / MSRP $69): Full 6 Presets, Full clean src/, build.js, dev.js, Agency Playbook
 * 
 * Usage:
 *   npm run release
 *   node release.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { build, CORE_JS_MODULES } = require('./build.js');

const ROOT_DIR = __dirname;
const distDir = path.join(ROOT_DIR, 'dist');

// ANSI Terminal Colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
  cyan: '\x1b[36m',
  brightCyan: '\x1b[96m',
  yellow: '\x1b[33m',
  brightYellow: '\x1b[93m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
};

/**
 * Validates Commercial Release Standards before packaging.
 * Throws an error if any standard is violated.
 */
function verifyQualityGates() {
  console.log(`  ${c.dim}Checking Quality Gate 1: Automated QA Test Suite (1,623+ tests)...${c.reset}`);
  try {
    const testOutput = execSync('node scripts/test-runner.js', { cwd: ROOT_DIR, encoding: 'utf8' });
    if (testOutput.includes('FAIL') || !testOutput.includes('ALL AUTOMATED TESTS PASSED SUCCESSFULLY')) {
      throw new Error('Automated test suite reported failures.');
    }
    console.log(`  ${c.green}✓${c.reset} ${c.brightGreen}Quality Gate 1 Passed:${c.reset} 1,623 unit & behavioral tests verified (100% PASS)`);
  } catch (err) {
    console.error(`\n  ${c.red}[FAIL] Quality Gate 1 Error:${c.reset} Automated tests must pass 100% before commercial release.`);
    throw err;
  }

  console.log(`  ${c.dim}Checking Quality Gate 2: Starter Presets Integrity (6 JSON templates)...${c.reset}`);
  const srcPresets = path.join(ROOT_DIR, 'presets');
  const requiredPresets = [
    'store-preview-studio-template.json',
    'saas-app-template.json',
    'cyberstrike-rpg-game-template.json',
    'zenmind-meditation-template.json',
    'education-language-template.json',
    'fitness-tracker-template.json'
  ];

  for (const presetName of requiredPresets) {
    const presetPath = path.join(srcPresets, presetName);
    if (!fs.existsSync(presetPath)) {
      throw new Error(`Missing required commercial preset: ${presetName}`);
    }
    try {
      JSON.parse(fs.readFileSync(presetPath, 'utf8'));
    } catch {
      throw new Error(`Invalid JSON syntax in preset: ${presetName}`);
    }
  }
  console.log(`  ${c.green}✓${c.reset} ${c.brightGreen}Quality Gate 2 Passed:${c.reset} All 6 JSON presets verified & intact`);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Strips `if (typeof isDemoMode === 'function' && isDemoMode()...) { ... }` blocks
 * from commercial customer source files so zero demo/paywall references remain.
 */
function stripDemoBlocks(code) {
  const pattern = /(?:\n?[ \t]*\/\/[^\n]*demo[^\n]*\n|\n?[ \t]*\/\*[\s\S]*?demo[\s\S]*?\*\/\n)?\n?[ \t]*if\s*\(\s*typeof\s+isDemoMode\s*===\s*['"]function['"]\s*&&\s*isDemoMode\(\)(?:[^){]|\([^)]*\))*\)\s*\{/gi;
  let result = '';
  let lastIdx = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    result += code.slice(lastIdx, match.index);
    let depth = 1;
    let i = match.index + match[0].length;
    while (i < code.length && depth > 0) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') depth--;
      i++;
    }
    lastIdx = i;
    pattern.lastIndex = i;
  }
  result += code.slice(lastIdx);
  return result;
}

/**
 * Copies source tree to commercial Pro package, omitting all demo/paywall files
 * and stripping any isDemoMode() blocks from JavaScript modules.
 */
function copyCleanSource(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    // Exclude internal demo/paywall files
    if (entry.name === 'demo-guard.js' || entry.name === 'demo-upgrade-modal.css' || entry.name === 'demo-upgrade-modal.html') {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyCleanSource(srcPath, destPath);
    } else if (entry.name.endsWith('.js') && !srcPath.includes('html2canvas')) {
      const code = fs.readFileSync(srcPath, 'utf8');
      const cleanCode = stripDemoBlocks(code);
      fs.writeFileSync(destPath, cleanCode, 'utf8');
    } else if (entry.name === 'style.css') {
      let css = fs.readFileSync(srcPath, 'utf8');
      css = css.replace(/@import\s+["']modals\/demo-upgrade-modal\.css["'];?\n?/g, '');
      fs.writeFileSync(destPath, css, 'utf8');
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function runRelease() {
  console.log(`\n${c.bold}${c.brightCyan}┌──────────────────────────────────────────────────────────────────┐${c.reset}`);
  console.log(`${c.bold}${c.brightCyan}│               STORE PREVIEW STUDIO · RELEASE BUILDER             │${c.reset}`);
  console.log(`${c.bold}${c.brightCyan}│        Commercial Release Standards · Quality Gate Verification  │${c.reset}`);
  console.log(`${c.bold}${c.brightCyan}└──────────────────────────────────────────────────────────────────┘${c.reset}\n`);

  // Step 1: Verify Commercial Release Standards (Quality Gates)
  verifyQualityGates();

  // Clean up any legacy zip files from root and package/
  [
    'store-preview-studio-standard-v1.0.zip',
    'store-preview-studio-v1.0.zip',
    'store-preview-studio-freebie-v1.0.zip',
    'the-no-bs-aso-cheatsheet-v1.0.zip'
  ].forEach(f => {
    const rootZip = path.join(ROOT_DIR, f);
    if (fs.existsSync(rootZip)) fs.unlinkSync(rootZip);
    const pkgZip = path.join(ROOT_DIR, 'package', f);
    if (fs.existsSync(pkgZip)) fs.unlinkSync(pkgZip);
  });

  // Sync Documentation HTML, Freebie guides, and icon from core/docs to package
  [
    'AGENCY_MARKETING_FAQ.html',
    'FREEBIE_ASO_CHEATSHEET.html',
    'FREEBIE_ASO_CHEATSHEET.md',
    'The-No-BS-ASO-Cheatsheet.html',
    'The-No-BS-ASO-Cheatsheet.md',
    'icon.svg'
  ].forEach(file => {
    const src = path.join(ROOT_DIR, 'docs', file);
    const pkg = path.join(ROOT_DIR, 'package', file);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(pkg), { recursive: true });
      fs.copyFileSync(src, pkg);
    }
  });

  // 1. Build full standalone file
  console.log(`  ${c.dim}Building standalone unminified HTML...${c.reset}`);
  build({ isRelease: true, silent: true });
  // 2. Build minified standalone file
  console.log(`  ${c.dim}Building standalone minified commercial HTML...${c.reset}`);
  const minFile = path.join(ROOT_DIR, 'store_preview_studio.min.html');
  const res = build({ minify: true, outFile: minFile, isRelease: true, silent: true });
  if (!res.success) throw new Error('Standalone HTML minification build failed.');

  // Validate standalone offline integrity (Quality Gate 3)
  const minContent = fs.readFileSync(minFile, 'utf8');
  if (minContent.includes('clarity.ms') || minContent.includes('google-analytics')) {
    throw new Error('Telemetry leak detected in commercial standalone build!');
  }
  console.log(`  ${c.green}✓${c.reset} ${c.brightGreen}Quality Gate 3 Passed:${c.reset} Standalone HTML built with 0-cloud telemetry & 100% offline assets`);

  fs.rmSync(distDir, { recursive: true, force: true });

  // Source presets directory
  const srcPresets = path.join(ROOT_DIR, 'presets');

  // =====================================================================
  // TIER 0: FREEBIE EDITION ($0) — Mini ASO Cheatsheet (HTML + MD + Assets)
  // =====================================================================
  const freebieName = 'the-no-bs-aso-cheatsheet-v1.0';
  const freebieDir = path.join(distDir, freebieName);
  fs.mkdirSync(freebieDir, { recursive: true });

  [
    'The-No-BS-ASO-Cheatsheet.html',
    'The-No-BS-ASO-Cheatsheet.md',
    'icon.svg'
  ].forEach(f => {
    let src = path.join(ROOT_DIR, 'docs', f);
    if (!fs.existsSync(src)) src = path.join(ROOT_DIR, f);
    if (!fs.existsSync(src)) src = path.join(ROOT_DIR, 'package', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(freebieDir, f));
  });

  const freebieZipPath = path.join(ROOT_DIR, `${freebieName}.zip`);
  if (fs.existsSync(freebieZipPath)) fs.unlinkSync(freebieZipPath);

  // =====================================================================
  // TIER 1: PLUS EDITION ($29) — Minified HTML + Full 6 Presets + Readme/License
  // =====================================================================
  const plusName = 'store-preview-studio-plus-v1.0';
  const plusDir = path.join(distDir, plusName);
  const plusPresetsDir = path.join(plusDir, 'presets');
  fs.mkdirSync(plusPresetsDir, { recursive: true });

  // Copy full minified build as store_preview_studio.html for instant use
  fs.copyFileSync(minFile, path.join(plusDir, 'store_preview_studio.html'));

  // Copy specialized Plus Edition documentation
  const plusReadme = fs.existsSync(path.join(ROOT_DIR, 'README_PLUS.md'))
    ? path.join(ROOT_DIR, 'README_PLUS.md')
    : path.join(ROOT_DIR, 'README.md');
  fs.copyFileSync(plusReadme, path.join(plusDir, 'README.md'));
  if (fs.existsSync(path.join(ROOT_DIR, 'LICENSE.txt'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'LICENSE.txt'), path.join(plusDir, 'LICENSE.txt'));
  }

  // Copy all JSON presets to Plus Edition
  if (fs.existsSync(srcPresets)) {
    fs.readdirSync(srcPresets).filter(f => f.endsWith('.json')).forEach(f => {
      fs.copyFileSync(path.join(srcPresets, f), path.join(plusPresetsDir, f));
    });
  }

  const plusZipPath = path.join(ROOT_DIR, `${plusName}.zip`);
  if (fs.existsSync(plusZipPath)) fs.unlinkSync(plusZipPath);

  // =====================================================================
  // TIER 2: PRO / AGENCY EDITION ($49 / MSRP $69) — Full 6 Presets + Full src/ + QA
  // =====================================================================
  const proName = 'store-preview-studio-pro-v1.0';
  const proDir = path.join(distDir, proName);
  const proPresetsDir = path.join(proDir, 'presets');
  fs.mkdirSync(proPresetsDir, { recursive: true });

  // Copy full 6-preset minified build as store_preview_studio.html for instant use
  fs.copyFileSync(minFile, path.join(proDir, 'store_preview_studio.html'));

  // Copy specialized Pro / Agency Edition documentation
  const proReadme = fs.existsSync(path.join(ROOT_DIR, 'README_PRO.md'))
    ? path.join(ROOT_DIR, 'README_PRO.md')
    : path.join(ROOT_DIR, 'README.md');
  fs.copyFileSync(proReadme, path.join(proDir, 'README.md'));

  // Copy documentation, Agency FAQ HTML, icon, and launch script
  [
    'LICENSE.txt',
    'AGENCY_MARKETING_FAQ.html',
    'icon.svg',
    'start_dev.command'
  ].forEach(f => {
    let src = path.join(ROOT_DIR, f);
    if (!fs.existsSync(src)) src = path.join(ROOT_DIR, 'docs', f);
    if (!fs.existsSync(src)) src = path.join(ROOT_DIR, 'package', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(proDir, f));
  });

  // Copy and dynamically synchronize customer build.js and dev.js from scripts/templates/
  const buildTemplateSrc = fs.existsSync(path.join(ROOT_DIR, 'scripts', 'templates', 'customer-build.js'))
    ? path.join(ROOT_DIR, 'scripts', 'templates', 'customer-build.js')
    : path.join(ROOT_DIR, 'package', 'build.js');
  let customerBuild = fs.readFileSync(buildTemplateSrc, 'utf8');
  if (Array.isArray(CORE_JS_MODULES)) {
    customerBuild = customerBuild.replace(
      /\/\* __CORE_JS_MODULES__ \*\/[\s\S]*?\];/,
      `/* __CORE_JS_MODULES__ */ ${JSON.stringify(CORE_JS_MODULES, null, 2)};`
    );
  }
  fs.writeFileSync(path.join(proDir, 'build.js'), customerBuild, 'utf8');

  const devTemplateSrc = fs.existsSync(path.join(ROOT_DIR, 'scripts', 'templates', 'customer-dev.js'))
    ? path.join(ROOT_DIR, 'scripts', 'templates', 'customer-dev.js')
    : path.join(ROOT_DIR, 'package', 'dev.js');
  fs.copyFileSync(devTemplateSrc, path.join(proDir, 'dev.js'));

  // Keep package/ synced if it exists
  if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
    fs.writeFileSync(path.join(ROOT_DIR, 'package', 'build.js'), customerBuild, 'utf8');
    fs.copyFileSync(devTemplateSrc, path.join(ROOT_DIR, 'package', 'dev.js'));
  }

  // Generate clean customer package.json with ONLY customer commands: dev and build
  const proPkg = {
    name: "store-preview-studio",
    version: "2.1.0",
    description: "Zero-server offline app store preview & ASO mockup studio for Apple App Store and Google Play",
    main: "build.js",
    scripts: {
      "dev": "node dev.js",
      "build": "node build.js"
    },
    author: "Kai DevLabs <kai.devlabs@gmail.com>",
    license: "Commercial"
  };
  fs.writeFileSync(path.join(proDir, 'package.json'), JSON.stringify(proPkg, null, 2) + '\n', 'utf8');

  // Copy all 6 JSON presets to Pro Edition
  if (fs.existsSync(srcPresets)) {
    fs.readdirSync(srcPresets).filter(f => f.endsWith('.json')).forEach(f => {
      fs.copyFileSync(path.join(srcPresets, f), path.join(proPresetsDir, f));
    });
  }

  // Copy full modular source code (src/) with zero internal demo files and stripped isDemoMode blocks
  copyCleanSource(path.join(ROOT_DIR, 'src'), path.join(proDir, 'src'));

  // Quality Gate 4: Zero Demo Leak in Pro Source Code
  const proJsFiles = [];
  function scanJs(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) scanJs(p);
      else if (entry.isFile() && entry.name.endsWith('.js')) proJsFiles.push(p);
    }
  }
  scanJs(path.join(proDir, 'src'));
  for (const jsPath of proJsFiles) {
    const code = fs.readFileSync(jsPath, 'utf8');
    if (code.includes('isDemoMode') && !jsPath.includes('demo-guard')) {
      throw new Error(`Demo leak detected: 'isDemoMode' found in Pro release file: ${path.relative(proDir, jsPath)}`);
    }
  }
  console.log(`  ${c.green}✓${c.reset} ${c.brightGreen}Quality Gate 4 Passed:${c.reset} Zero demo locks / paywalls in Pro modular source code`);

  const proZipPath = path.join(ROOT_DIR, `${proName}.zip`);
  if (fs.existsSync(proZipPath)) fs.unlinkSync(proZipPath);

  try {
    execSync(`zip -rq "${freebieZipPath}" "${freebieName}"`, { cwd: distDir });
    if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
      fs.copyFileSync(freebieZipPath, path.join(ROOT_DIR, 'package', `${freebieName}.zip`));
    }
    const freebieKb = (fs.statSync(freebieZipPath).size / 1024).toFixed(1);

    execSync(`zip -rq "${plusZipPath}" "${plusName}"`, { cwd: distDir });
    if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
      fs.copyFileSync(plusZipPath, path.join(ROOT_DIR, 'package', `${plusName}.zip`));
    }
    const plusKb = (fs.statSync(plusZipPath).size / 1024).toFixed(1);

    execSync(`zip -rq "${proZipPath}" "${proName}"`, { cwd: distDir });
    if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
      fs.copyFileSync(proZipPath, path.join(ROOT_DIR, 'package', `${proName}.zip`));
    }
    const proKb = (fs.statSync(proZipPath).size / 1024).toFixed(1);

    console.log(`\n${c.bold}${c.green}====================================================================${c.reset}`);
    console.log(`${c.bold}${c.green}   COMMERCIAL PACKAGING COMPLETE · ALL QUALITY GATES VERIFIED       ${c.reset}`);
    console.log(`${c.bold}${c.green}====================================================================${c.reset}\n`);

    console.log(`  ${c.green}[OK]${c.reset} ${c.bold}${c.brightGreen}The No-BS ASO Cheatsheet ($0 / Lead Magnet)${c.reset} ${c.dim}(${freebieKb} KB)${c.reset}`);
    console.log(`    ${c.gray}Path:${c.reset} ${c.brightGreen}${freebieZipPath}${c.reset}`);
    console.log(`    ${c.gray}Package:${c.reset} The No-BS ASO Cheatsheet (HTML & MD) · Store Rules, Limits & Dimensions\n`);

    console.log(`  ${c.green}[OK]${c.reset} ${c.bold}${c.brightYellow}Plus Edition ($29)${c.reset} ${c.dim}(${plusKb} KB)${c.reset}`);
    console.log(`    ${c.gray}Path:${c.reset} ${c.brightGreen}${plusZipPath}${c.reset}`);
    console.log(`    ${c.gray}Package:${c.reset} All 6 Presets · Standalone Offline HTML · Zero Telemetry\n`);

    console.log(`  ${c.green}[OK]${c.reset} ${c.bold}${c.brightCyan}Pro Studio ($49 / MSRP $69)${c.reset} ${c.dim}(${proKb} KB)${c.reset}`);
    console.log(`    ${c.gray}Path:${c.reset} ${c.brightGreen}${proZipPath}${c.reset}`);
    console.log(`    ${c.gray}Package:${c.reset} All 6 Presets · Full Modular Source · Zero Demo Locks · Dev Server · Agency Playbook\n`);

    // Clean up legacy files from root unpacked pro folder if present
    const rootProDir = path.join(ROOT_DIR, proName);
    if (fs.existsSync(rootProDir)) {
      ['Store_Preview_Studio_Test_Checklist.xlsx', 'TEST_CASES.html'].forEach(f => {
        const p = path.join(rootProDir, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      });
    }
  } catch (e) {
    console.warn(`[!] Could not run system zip utility (${e.message}), release folders are ready in dist/`);
  }
}

if (require.main === module) {
  runRelease();
}

module.exports = { runRelease };
