#!/usr/bin/env node
/**
 * Store Preview Studio · Commercial Release Packager
 * 
 * Generates delivery ZIP packages:
 *   - Plus Edition ($29): Full 6 Presets, Minified HTML, Docs
 *   - Pro Edition ($39): Full 6 Presets, Full src/, build.js, dev.js, Agency Playbook
 * 
 * Usage:
 *   npm run release
 *   node release.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { build, CORE_JS_MODULES } = require('./build.js');
const { buildAllDocs } = require('./scripts/build-docs-html.js');

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
  const pattern = /\n?[ \t]*if\s*\(\s*typeof\s+isDemoMode\s*===\s*['"]function['"]\s*&&\s*isDemoMode\(\)(?:[^){]|\([^)]*\))*\)\s*\{/g;
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
  console.log(`${c.bold}${c.brightCyan}└──────────────────────────────────────────────────────────────────┘${c.reset}\n`);

  console.log(`${c.bold}1. Compiling HTML & Bundling Standalone Assets:${c.reset}`);

  // Build Documentation HTML (Agency FAQ & Test Cases)
  buildAllDocs();

  // 1. Build full 5-preset standalone file
  build({ isRelease: true });
  // 2. Build full 5-preset minified standalone file
  const minFile = path.join(ROOT_DIR, 'store_preview_studio.min.html');
  const res = build({ minify: true, outFile: minFile, isRelease: true });
  if (!res.success) return;

  fs.rmSync(distDir, { recursive: true, force: true });

  // Source presets directory
  const srcPresets = path.join(ROOT_DIR, 'presets');

  // =====================================================================
  // TIER 1: PLUS EDITION ($29) — Minified HTML + Full 5 Presets + Readme/License
  // =====================================================================
  const plusName = 'store-preview-studio-plus-v1.0';
  const plusDir = path.join(distDir, plusName);
  const plusPresetsDir = path.join(plusDir, 'presets');
  fs.mkdirSync(plusPresetsDir, { recursive: true });

  // Copy full 5-preset minified build as store_preview_studio.html for instant use
  fs.copyFileSync(minFile, path.join(plusDir, 'store_preview_studio.html'));

  // Copy specialized Plus Edition documentation
  const plusReadme = fs.existsSync(path.join(ROOT_DIR, 'README_PLUS.md'))
    ? path.join(ROOT_DIR, 'README_PLUS.md')
    : path.join(ROOT_DIR, 'README.md');
  fs.copyFileSync(plusReadme, path.join(plusDir, 'README.md'));
  if (fs.existsSync(path.join(ROOT_DIR, 'LICENSE.txt'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'LICENSE.txt'), path.join(plusDir, 'LICENSE.txt'));
  }

  // Copy all 5 JSON presets to Plus Edition
  if (fs.existsSync(srcPresets)) {
    fs.readdirSync(srcPresets).filter(f => f.endsWith('.json')).forEach(f => {
      fs.copyFileSync(path.join(srcPresets, f), path.join(plusPresetsDir, f));
    });
  }

  const plusZipPath = path.join(ROOT_DIR, `${plusName}.zip`);
  const legacyStdZipPath = path.join(ROOT_DIR, 'store-preview-studio-standard-v1.0.zip');
  if (fs.existsSync(plusZipPath)) fs.unlinkSync(plusZipPath);
  if (fs.existsSync(legacyStdZipPath)) fs.unlinkSync(legacyStdZipPath);

  // =====================================================================
  // TIER 2: PRO / AGENCY EDITION ($39) — Full 5 Presets + Full src/ + QA
  // =====================================================================
  const proName = 'store-preview-studio-pro-v1.0';
  const proDir = path.join(distDir, proName);
  const proPresetsDir = path.join(proDir, 'presets');
  fs.mkdirSync(proPresetsDir, { recursive: true });

  // Copy full 5-preset minified build as store_preview_studio.html for instant use
  fs.copyFileSync(minFile, path.join(proDir, 'store_preview_studio.html'));

  // Copy specialized Pro / Agency Edition documentation
  const proReadme = fs.existsSync(path.join(ROOT_DIR, 'README_PRO.md'))
    ? path.join(ROOT_DIR, 'README_PRO.md')
    : path.join(ROOT_DIR, 'README.md');
  fs.copyFileSync(proReadme, path.join(proDir, 'README.md'));

  // Copy documentation, Agency FAQ HTML, and launch script
  [
    'LICENSE.txt',
    'AGENCY_MARKETING_FAQ.html',
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

  // Copy all 5 JSON presets to Pro Edition
  if (fs.existsSync(srcPresets)) {
    fs.readdirSync(srcPresets).filter(f => f.endsWith('.json')).forEach(f => {
      fs.copyFileSync(path.join(srcPresets, f), path.join(proPresetsDir, f));
    });
  }

  // Copy full modular source code (src/) with zero internal demo files and stripped isDemoMode blocks
  copyCleanSource(path.join(ROOT_DIR, 'src'), path.join(proDir, 'src'));

  const proZipPath = path.join(ROOT_DIR, `${proName}.zip`);
  const legacyZipPath = path.join(ROOT_DIR, 'store-preview-studio-v1.0.zip');
  if (fs.existsSync(proZipPath)) fs.unlinkSync(proZipPath);
  if (fs.existsSync(legacyZipPath)) fs.unlinkSync(legacyZipPath);

  console.log(`\n${c.bold}2. Packaging Release Delivery Packages:${c.reset}`);

  try {
    execSync(`zip -rq "${plusZipPath}" "${plusName}"`, { cwd: distDir });
    fs.copyFileSync(plusZipPath, legacyStdZipPath);
    if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
      fs.copyFileSync(plusZipPath, path.join(ROOT_DIR, 'package', `${plusName}.zip`));
      fs.copyFileSync(plusZipPath, path.join(ROOT_DIR, 'package', 'store-preview-studio-standard-v1.0.zip'));
    }
    const plusKb = (fs.statSync(plusZipPath).size / 1024).toFixed(1);
    console.log(`  ${c.green}[OK]${c.reset} ${c.bold}${c.brightYellow}Plus Edition ($29)${c.reset} ${c.dim}(${plusKb} KB)${c.reset}`);
    console.log(`    ${c.gray}Path:${c.reset} ${c.brightGreen}${plusZipPath}${c.reset}`);
    console.log(`    ${c.gray}Package:${c.reset} All 6 Presets · Offline Standalone HTML\n`);

    execSync(`zip -rq "${proZipPath}" "${proName}"`, { cwd: distDir });
    fs.copyFileSync(proZipPath, legacyZipPath);
    if (fs.existsSync(path.join(ROOT_DIR, 'package'))) {
      fs.copyFileSync(proZipPath, path.join(ROOT_DIR, 'package', `${proName}.zip`));
    }
    const proKb = (fs.statSync(proZipPath).size / 1024).toFixed(1);
    console.log(`  ${c.green}[OK]${c.reset} ${c.bold}${c.brightCyan}Pro Edition ($39)${c.reset} ${c.dim}(${proKb} KB)${c.reset}`);
    console.log(`    ${c.gray}Path:${c.reset} ${c.brightGreen}${proZipPath}${c.reset}`);
    console.log(`    ${c.gray}Package:${c.reset} All 6 Presets · Full Modular Source · Dev Server · Agency Playbook\n`);

    // Clean up legacy files from root unpacked pro folder if present
    const rootProDir = path.join(ROOT_DIR, proName);
    if (fs.existsSync(rootProDir)) {
      ['Store_Preview_Studio_Test_Checklist.xlsx', 'TEST_CASES.html'].forEach(f => {
        const p = path.join(rootProDir, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      });
    }

    console.log(`${c.bold}${c.brightGreen}All release packages created successfully and ready to publish!${c.reset}\n`);
  } catch (e) {
    console.warn(`[!] Could not run system zip utility (${e.message}), release folders are ready in dist/`);
  }
}

if (require.main === module) {
  runRelease();
}

module.exports = { runRelease };
