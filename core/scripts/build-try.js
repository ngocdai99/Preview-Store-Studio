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

const { resolveHtmlIncludes, resolveCssImports, CORE_JS_MODULES } = require('../build.js');
const { minifyHtmlPage } = require('./minifier.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const ENTRY_FILE = path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'try.html');

const DOCS_TRY_FILE = path.join(ROOT_DIR, 'docs', 'try.html');
const PUBLIC_TRY_FILE = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try.html');
const PUBLIC_STUDIO_FILE = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try-studio.html');
const PUBLIC_TRY_DIR = path.join(ROOT_DIR, '..', 'marketing', 'public', 'try');

/**
 * Replaces PRO feature implementations with stubs for Demo Mode builds (`try.html`)
 * so that PRO source code is never shipped to the client in Demo bundles.
 */
function transformModuleForDemo(relPath, content) {
  if (relPath === 'modules/demo-guard.js') {
    return content.replace(
      /function\s+isDemoMode\s*\(\s*\)\s*\{[\s\S]*?\}/,
      'function isDemoMode() { return true; }'
    );
  }

  if (relPath === 'modules/export/clipboard.js') {
    return `if($('btnCopyText')) $('btnCopyText').onclick = copyAllText;\nfunction copyAllText(){\n  if(typeof requireFullVersion === 'function') requireFullVersion('export-copy');\n}`;
  }

  if (relPath === 'modules/export/markdown.js') {
    return `if($('optExportMD')) $('optExportMD').onclick = exportMarkdown;\nfunction exportMarkdown(){\n  if(typeof requireFullVersion === 'function') requireFullVersion('export-markdown');\n}`;
  }

  if (relPath === 'modules/export/json.js') {
    const tailIdx = content.indexOf("if($('optImportJSON')){");
    const tail = tailIdx >= 0 ? content.slice(tailIdx) : '';
    return `if($('optExportJSON')) $('optExportJSON').onclick = exportJSON;\nfunction exportJSON(){\n  if(typeof requireFullVersion === 'function') requireFullVersion('export-json');\n}\nfunction parseAndApplyJSON(){\n  if(typeof requireFullVersion === 'function') requireFullVersion('import-json');\n  return false;\n}\n` + tail;
  }

  if (relPath === 'modules/export/storage.js') {
    return content
      .replace(
        /function saveDraftToStorage\(\)\{[\s\S]*?(?=function loadDraftFromStorage\(\)\{)/,
        'function saveDraftToStorage(){\n  return Promise.resolve(true);\n}\n\n'
      )
      .replace(
        /if\(CURRENT_PRESET_KEY !== 'draft'[\s\S]*?if\(typeof exportJSON === 'function'\)\{\s*exportJSON\(\);\s*\}/,
        "if(typeof exportJSON === 'function') exportJSON();"
      );
  }

  if (relPath === 'modules/export/png.js') {
    return content
      .replace(
        /if\(typeof isDemoMode === 'function' && isDemoMode\(\) && !opts\.allowDemo\)\{[\s\S]*?return;\s*\}/,
        `if(!opts || !opts.allowDemo || opts.frameless || opts.transparent || scaleFactor > 2){\n    if(typeof requireFullVersion === 'function') requireFullVersion('export-png');\n    return;\n  }\n  scaleFactor = 2;\n  opts = { watermark: true, allowDemo: true };`
      )
      .replace(
        'if(opts.watermark) drawStudioWatermark(canvas);',
        'drawStudioWatermark(canvas);'
      );
  }

  if (relPath === 'modules/theme.js') {
    return content.replace(
      "applyUiTheme(document.documentElement.dataset.ui || 'light');",
      "applyUiTheme(document.documentElement.dataset.ui || 'dark');"
    );
  }

  if (relPath === 'apple/apple.js') {
    return content.replace(
      "if (typeof isDemoMode === 'function' && isDemoMode() && d === 'ipad')",
      "if (d === 'ipad')"
    );
  }

  if (relPath === 'google/google.js') {
    return content.replace(
      "if (typeof isDemoMode === 'function' && isDemoMode() && (d === 'tab7' || d === 'tab10'))",
      "if (d === 'tab7' || d === 'tab10')"
    );
  }

  return content;
}

/**
 * Bundles JavaScript modules specifically for Demo Mode with PRO stubs & demo-guard
 */
function getDemoBundledJs() {
  const jsDir = path.join(SRC_DIR, 'js');
  // Inherit CORE_JS_MODULES single source of truth and insert demo-guard.js after core/resizer.js
  const jsFiles = CORE_JS_MODULES.slice();
  const resizerIdx = jsFiles.indexOf('core/resizer.js');
  const insertIdx = resizerIdx >= 0 ? resizerIdx + 1 : 3;
  jsFiles.splice(insertIdx, 0, 'modules/demo-guard.js');

  const contents = jsFiles.map(f => {
    const header = `/* =========================================================================\n   Module: src/js/${f}\n   ========================================================================= */`;
    const raw = fs.readFileSync(path.join(jsDir, f), 'utf8');
    const processed = transformModuleForDemo(f, raw);
    return `${header}\n${processed}`;
  });
  return contents.join('\n\n');
}

function buildTry() {
  const t0 = Date.now();
  if (!fs.existsSync(ENTRY_FILE)) {
    console.error(`[✗] Try entry file not found: ${ENTRY_FILE}`);
    return { success: false, error: 'Try entry file missing' };
  }

  const raw = fs.readFileSync(ENTRY_FILE, 'utf8');

  // 1. Resolve HTML includes (all component paths like components/*.html)
  let html = resolveHtmlIncludes(raw, SRC_DIR);

  // 2. Resolve CSS (Demo Mode includes demo-upgrade-modal.css, but strips iPad and Tablet CSS entirely)
  const cssPath = path.join(SRC_DIR, 'css', 'style.css');
  if (!fs.existsSync(cssPath)) throw new Error('Missing src/css/style.css');
  const rawCss = fs.readFileSync(cssPath, 'utf8')
    .replace(/@import\s+["']apple\/ipad\.css["'];?/gi, '/* [Demo] apple/ipad.css omitted */')
    .replace(/@import\s+["']google\/tablets\.css["'];?/gi, '/* [Demo] google/tablets.css omitted */');
  let css = resolveCssImports(rawCss, path.dirname(cssPath));
  const demoModalCssPath = path.join(SRC_DIR, 'css', 'modals', 'demo-upgrade-modal.css');
  if (fs.existsSync(demoModalCssPath)) {
    css += '\n' + fs.readFileSync(demoModalCssPath, 'utf8');
  }

  // 3. Resolve JS (Demo Mode strips PRO implementations & replaces with stubs)
  const js = getDemoBundledJs();

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

  // Demo Mode: Remove close/reset buttons on preset pill and draft pill from static markup
  html = html.replace(/<span role="button" class="ms-pill-reset-btn" id="presetPillCloseBtn"[^>]*>&times;<\/span>/gi, '');
  html = html.replace(/<span role="button" class="ms-pill-reset-btn" id="msPillResetBtn"[^>]*>&times;<\/span>/gi, '');

  // Demo Mode: Remove preset warning banner since drafts cannot be edited or created in Demo Mode
  html = html.replace(/<div class="preset-banner" id="presetBanner"[\s\S]*?<\/div>(?=\s*<\/nav>)/gi, '');

  // 6. Production Minification
  const minified = minifyHtmlPage(html);

  // 7. Write destination files
  fs.writeFileSync(DOCS_TRY_FILE, minified, 'utf8');

  // Check marketing/public directory
  const publicDir = path.join(ROOT_DIR, '..', 'marketing', 'public');
  if (fs.existsSync(publicDir)) {
    try {
      fs.writeFileSync(PUBLIC_TRY_FILE, minified, 'utf8');
      fs.writeFileSync(PUBLIC_STUDIO_FILE, minified, 'utf8');
      // Remove static public/try directory if it exists so Next.js src/app/try/page.tsx route resolves cleanly
      if (fs.existsSync(PUBLIC_TRY_DIR)) {
        fs.rmSync(PUBLIC_TRY_DIR, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn(`[!] Note: marketing/public sync skipped (${e.message})`);
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
