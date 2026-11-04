#!/usr/bin/env node
/**
 * Store Preview Studio · Standalone Demo Sandbox Bundler (`try.html`)
 * 
 * Bundles full Core Studio in Demo Mode (`window.SPS_DEMO_MODE = true`):
 *   - Embeds 100% of Core Studio components, styles, and scripts
 *   - Wraps in #studioAppShell with standalone top bar + auto ?embed=true support
 *   - Generates:
 *       1. core/docs/try.html
 *       2. marketing/public/try.html
 *       3. marketing/public/try/index.html
 */

const fs = require('fs');
const path = require('path');

const { resolveHtmlIncludes, resolveCssImports, getBundledJs } = require('../build.js');
const { minifyHtmlPage } = require('./minifier.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const ENTRY_FILE = path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'try.html');

const DOCS_TRY_FILE = path.join(ROOT_DIR, 'docs', 'try.html');
const PUBLIC_TRY_FILE = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try.html');
const PUBLIC_STUDIO_FILE = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try-studio.html');
const PUBLIC_TRY_DIR = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try');

function buildTry() {
  const t0 = Date.now();
  if (!fs.existsSync(ENTRY_FILE)) {
    console.error(`[✗] Try entry file not found: ${ENTRY_FILE}`);
    return { success: false, error: 'Try entry file missing' };
  }

  const raw = fs.readFileSync(ENTRY_FILE, 'utf8');

  // 1. Resolve HTML includes (all component paths like components/*.html)
  let html = resolveHtmlIncludes(raw, SRC_DIR);

  // 2. Resolve CSS (Demo Mode includes demo-upgrade-modal.css)
  const cssPath = path.join(SRC_DIR, 'css', 'style.css');
  if (!fs.existsSync(cssPath)) throw new Error('Missing src/css/style.css');
  const rawCss = fs.readFileSync(cssPath, 'utf8');
  const css = resolveCssImports(rawCss, path.dirname(cssPath), { isDemo: true });

  // 3. Resolve JS (Demo Mode strips PRO implementations & replaces with stubs)
  const js = getBundledJs({ isDemo: true });

  // 4. Resolve html2canvas
  const libPath = path.join(SRC_DIR, 'lib', 'html2canvas.min.js');
  const lib = fs.existsSync(libPath) ? fs.readFileSync(libPath, 'utf8') : '';

  // 5. Inlines assets into HTML
  html = html.replace(
    /<script\s+src=["']lib\/html2canvas\.min\.js["']><\/script>/i,
    () => `<script>\n${lib}\n</script>`
  );
  html = html.replace(
    /<link\s+rel=["']stylesheet["']\s+href=["']css\/style\.css["']\s*\/?>/i,
    () => `<style>\n${css}\n</style>`
  );
  html = html.replace(
    /<script\s+src=["']js\/app\.js["']><\/script>/i,
    () => `<script>\n${js}\n</script>`
  );

  // Demo Mode: Remove close button on preset pill from static markup
  html = html.replace(/<span role="button" class="ms-pill-reset-btn" id="presetPillCloseBtn"[^>]*>&times;<\/span>/gi, '');

  // 6. Production Minification
  const minified = minifyHtmlPage(html);

  // 7. Write destination files
  fs.writeFileSync(DOCS_TRY_FILE, minified, 'utf8');

  // Check marketing/public directory
  const publicDir = path.join(ROOT_DIR, '..', 'marketing', 'public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(PUBLIC_TRY_FILE, minified, 'utf8');
    fs.writeFileSync(PUBLIC_STUDIO_FILE, minified, 'utf8');
    // Remove static public/try directory if it exists so Next.js src/app/try/page.tsx route resolves cleanly
    if (fs.existsSync(PUBLIC_TRY_DIR)) {
      fs.rmSync(PUBLIC_TRY_DIR, { recursive: true, force: true });
    }
  }

  const duration = Date.now() - t0;
  const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  const minSizeKb = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(1);

  console.log(`[✓] Bundled full Studio Demo in ${duration}ms`);
  console.log(`    Raw: ${sizeKb} KB -> Minified: ${minSizeKb} KB`);
  console.log(`    Saved to: core/docs/try.html and marketing/public/try.html`);

  return { success: true, duration, sizeKb, minSizeKb, html: minified };
}

if (require.main === module) {
  buildTry();

  if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    console.log('\n[WATCH] 👀 Watching for changes in src/ and docs/src/marketing/try.html ...');
    console.log('        Press Ctrl + C to stop.\n');

    let debounceTimer = null;
    const triggerRebuild = (file) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`\n[⚡] Change detected in ${file || 'files'}, rebuilding try.html in ~20ms...`);
        buildTry();
      }, 50);
    };

    if (fs.existsSync(ENTRY_FILE)) {
      fs.watch(ENTRY_FILE, () => triggerRebuild('try.html'));
    }

    if (fs.existsSync(SRC_DIR)) {
      fs.watch(SRC_DIR, { recursive: true }, (evt, filename) => {
        if (filename && filename.endsWith('app.js')) return;
        triggerRebuild(`[src/${filename}]`);
      });
    }
  }
}

module.exports = { buildTry };
