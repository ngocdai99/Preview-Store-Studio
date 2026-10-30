#!/usr/bin/env node
/**
 * Store Preview Studio · Modular Bundler Script
 * 
 * Bundles modular source files:
 *   - HTML Components: Resolves <!-- @include "..." --> in src/index.html
 *   - CSS Modules: Resolves @import "..." in src/css/style.css
 *   - JavaScript Modules: Concatenates src/js/core, src/js/apple, src/js/google, src/js/modules
 *   - Vendors: Inlines src/lib/html2canvas.min.js
 * 
 * Generates single standalone offline file: core.html (~3-5ms)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'core.html');
const LEGACY_OUTPUT_FILE = path.join(ROOT_DIR, 'store_preview_studio.html');

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
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
};

/**
 * Resolves <!-- @include "path/to/file.html" --> recursively
 */
function resolveHtmlIncludes(content, baseDir) {
  return content.replace(/<!--\s*@include\s*["']([^"']+)["']\s*-->/gi, (match, includePath) => {
    const fullPath = path.isAbsolute(includePath) 
      ? includePath 
      : path.join(SRC_DIR, includePath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`[!] HTML include not found: ${fullPath}`);
      return `<!-- Missing include: ${includePath} -->`;
    }
    const included = fs.readFileSync(fullPath, 'utf8');
    return resolveHtmlIncludes(included, path.dirname(fullPath));
  });
}

/**
 * Resolves @import "path/to/file.css"; in CSS
 */
function resolveCssImports(content, baseDir) {
  return content.replace(/@import\s+["']([^"']+)["'];?/gi, (match, importPath) => {
    const fullPath = path.isAbsolute(importPath)
      ? importPath
      : path.join(baseDir, importPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`[!] CSS import not found: ${fullPath}`);
      return `/* Missing CSS import: ${importPath} */`;
    }
    const imported = fs.readFileSync(fullPath, 'utf8');
    return resolveCssImports(imported, path.dirname(fullPath));
  });
}

/**
 * Bundles all JavaScript modules in strict dependency order
 */
function getBundledJs() {
  const jsDir = path.join(SRC_DIR, 'js');
  const jsFiles = [
    'core/utils.js',
    'core/state.js',
    'core/resizer.js',
    'modules/shots/icon.js',
    'modules/shots/phone.js',
    'modules/shots/ipad.js',
    'modules/modal.js',
    'google/feature-graphic.js',
    'google/google.js',
    'modules/form/categories.js',
    'modules/form/privacy.js',
    'modules/form/reviews.js',
    'modules/form/sync.js',
    'modules/transitions.js',
    'apple/apple.js',
    'modules/theme.js',
    'modules/header.js',
    'modules/presets.js',
    'modules/export/storage.js',
    'modules/export/clipboard.js',
    'modules/export/markdown.js',
    'modules/export/json.js',
    'modules/export/png.js',
    'modules/store-import.js',
    'main.js'
  ];

  const allExist = jsFiles.every(f => fs.existsSync(path.join(jsDir, f)));
  if (allExist) {
    const contents = jsFiles.map(f => {
      const header = `/* =========================================================================\n   Module: src/js/${f}\n   ========================================================================= */`;
      return `${header}\n${fs.readFileSync(path.join(jsDir, f), 'utf8')}`;
    });
    const combined = contents.join('\n\n');
    // Keep app.js synced for convenience without redundant disk writes
    const appJsPath = path.join(jsDir, 'app.js');
    if (!fs.existsSync(appJsPath) || fs.readFileSync(appJsPath, 'utf8') !== combined) {
      fs.writeFileSync(appJsPath, combined, 'utf8');
    }
    return combined;
  }

  // Fallback to app.js
  return fs.readFileSync(path.join(jsDir, 'app.js'), 'utf8');
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => line.replace(/^\s*\/\/.*$/, '').trimEnd())
    .filter(line => line.trim().length > 0)
    .join('\n');
}

function minifyHtml(html) {
  return html
    .replace(/<!--(?!\s*@include)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim();
}

function build(options = {}) {
  const startTime = Date.now();
  const isMin = !!options.minify;

  try {
    const indexPath = path.join(SRC_DIR, 'index.html');
    const cssPath = path.join(SRC_DIR, 'css', 'style.css');
    const libPath = path.join(SRC_DIR, 'lib', 'html2canvas.min.js');

    if (!fs.existsSync(indexPath)) throw new Error('Missing src/index.html');
    if (!fs.existsSync(cssPath)) throw new Error('Missing src/css/style.css');
    if (!fs.existsSync(libPath)) throw new Error('Missing src/lib/html2canvas.min.js');

    // 1. Resolve HTML components
    let rawHtml = fs.readFileSync(indexPath, 'utf8');
    let html = resolveHtmlIncludes(rawHtml, SRC_DIR);
    if (isMin) html = minifyHtml(html);

    // 2. Resolve CSS modules
    const rawCss = fs.readFileSync(cssPath, 'utf8');
    let css = resolveCssImports(rawCss, path.dirname(cssPath));
    if (isMin) css = minifyCss(css);

    // 3. Bundle JS modules
    let js = getBundledJs();
    if (isMin) js = minifyJs(js);

    // 4. Vendor library
    const lib = fs.readFileSync(libPath, 'utf8');

    // 5. Assemble single standalone HTML file (using functions to avoid $ escape sequences)
    html = html.replace(
      /<script\s+src=["']lib\/html2canvas\.min\.js["']><\/script>/i,
      () => `<script>${isMin ? lib : '\n' + lib + '\n'}</script>`
    );
    html = html.replace(
      /<link\s+rel=["']stylesheet["']\s+href=["']css\/style\.css["']\s*\/?>/i,
      () => `<style>${isMin ? css : '\n' + css + '\n'}</style>`
    );
    html = html.replace(
      /<script\s+src=["']js\/app\.js["']><\/script>/i,
      () => `<script>${isMin ? js : '\n' + js + '\n'}</script>`
    );

    const outTarget = options.outFile || OUTPUT_FILE;
    fs.writeFileSync(outTarget, html, 'utf8');

    // Also sync store_preview_studio.html for backward compatibility if default bundle was built
    if (outTarget === OUTPUT_FILE) {
      fs.copyFileSync(OUTPUT_FILE, LEGACY_OUTPUT_FILE);
    }

    // Also sync to package/ if it exists and outTarget is the default bundle or minified bundle
    const pkgDir = path.join(ROOT_DIR, 'package');
    if (fs.existsSync(pkgDir)) {
      if (outTarget === OUTPUT_FILE) {
        fs.copyFileSync(OUTPUT_FILE, path.join(pkgDir, 'store_preview_studio.html'));
      } else if (outTarget === path.join(ROOT_DIR, 'store_preview_studio.min.html')) {
        fs.copyFileSync(outTarget, path.join(pkgDir, 'store_preview_studio.min.html'));
      }
    }

    const duration = Date.now() - startTime;
    const sizeKb = (fs.statSync(outTarget).size / 1024).toFixed(1);
    const tierLabel = options.tier === 'standard' 
      ? ` ${c.yellow}[Standard 6-Preset]${c.reset}`
      : (options.minify ? ` ${c.cyan}[Minified 6-Preset]${c.reset}` : ` ${c.gray}[Full 6-Preset]${c.reset}`);

    console.log(`  ${c.green}[OK]${c.reset} Bundled: ${c.brightGreen}${outTarget}${c.reset}`);
    console.log(`    ${c.gray}Variant:${c.reset}${tierLabel} ${c.gray}· Size:${c.reset} ${c.yellow}${sizeKb} KB${c.reset} ${c.gray}· Time:${c.reset} ${duration}ms`);
    return { success: true, duration, sizeKb, html };
  } catch (err) {
    console.error(`  ${c.red}✗ Build failed:${c.reset}`, err.message);
    return { success: false, error: err };
  }
}

function buildAll() {
  console.log(`\n${c.bold}${c.brightCyan}┌──────────────────────────────────────────────────────────────────┐${c.reset}`);
  console.log(`${c.bold}${c.brightCyan}│                STORE PREVIEW STUDIO · ASSET BUILDER              │${c.reset}`);
  console.log(`${c.bold}${c.brightCyan}└──────────────────────────────────────────────────────────────────┘${c.reset}\n`);
  console.log(`${c.bold}Compiling Standalone HTML Assets:${c.reset}`);
  build({ isRelease: true });
  build({ minify: true, outFile: path.join(ROOT_DIR, 'store_preview_studio.min.html'), isRelease: true });
  console.log(`\n${c.bold}${c.brightGreen}Build complete! Open core.html in any browser.${c.reset}\n`);
}

// Export for dev.js and release.js
module.exports = { build, buildAll, resolveHtmlIncludes, resolveCssImports, getBundledJs };

// Command Line Execution
if (require.main === module) {
  if (process.argv.includes('--serve') || process.argv.includes('-s')) {
    require('./dev.js');
  } else if (process.argv.includes('--min') || process.argv.includes('-m')) {
    buildAll();
  } else {
    build();

    if (process.argv.includes('--watch') || process.argv.includes('-w')) {
      console.log(`[i] Watching ${c.brightGreen}src/${c.reset} for changes... (Press Ctrl+C to stop)`);
      let debounceTimeout = null;
      fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          if (filename && filename.endsWith('app.js')) return; // Avoid re-triggering from app.js sync
          console.log(`[i] Change detected in ${c.brightGreen}${filename}${c.reset}, rebuilding...`);
          build();
        }, 100);
      });
    }
  }
}
