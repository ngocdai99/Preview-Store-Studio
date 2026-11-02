#!/usr/bin/env node
/**
 * Store Preview Studio · Standalone Demo Bundler
 * 
 * Bundles isolated Mini-Studio without redundant marketing sections:
 *   - Strips Hero headline/subheading, Comparison table, Pricing cards, FAQ accordion, Footer
 *   - Inlines variables.css, mini-studio.css, showcase-data.js, modal.js, mini-studio.js
 *   - Generates standalone marketing/public/demo.html and core/docs/demo.html
 */

const fs = require('fs');
const path = require('path');

const { minifyHtmlPage } = require('./minifier.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'docs', 'src', 'marketing');
const ENTRY_FILE = path.join(SRC_DIR, 'demo.html');
const DOCS_DEMO_FILE = path.join(ROOT_DIR, 'docs', 'demo.html');
const PUBLIC_DEMO_FILE = path.join(ROOT_DIR, '..', 'marketing', 'public', 'demo.html');

/**
 * Resolves <!-- @include "..." --> and /* @include "..." *\/ recursively
 */
function resolveIncludes(content, baseDir) {
  return content.replace(/(?:\/\*\s*@include\s*["']([^"']+)["']\s*\*\/|<!--\s*@include\s*["']([^"']+)["']\s*-->)/gi, (match, p1, p2) => {
    const relPath = p1 || p2;
    let fullPath = path.join(baseDir, relPath);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(SRC_DIR, relPath);
    }
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(ROOT_DIR, 'src', relPath);
    }
    if (!fs.existsSync(fullPath)) {
      console.warn(`[!] Include not found: ${fullPath}`);
      return `<!-- Missing include: ${relPath} -->`;
    }
    const included = fs.readFileSync(fullPath, 'utf8');
    return resolveIncludes(included, path.dirname(fullPath));
  });
}

function buildDemo() {
  const t0 = Date.now();
  if (!fs.existsSync(ENTRY_FILE)) {
    console.error(`[✗] Demo entry file not found: ${ENTRY_FILE}`);
    return { success: false, error: 'Demo entry file missing' };
  }

  const raw = fs.readFileSync(ENTRY_FILE, 'utf8');
  let bundled = resolveIncludes(raw, SRC_DIR);

  // Ensure toast CTA links smoothly to /#pricing
  bundled = bundled.replace(/href="#pricing"/g, 'href="/#pricing"');

  const minified = minifyHtmlPage(bundled);

  fs.writeFileSync(DOCS_DEMO_FILE, minified, 'utf8');
  fs.writeFileSync(PUBLIC_DEMO_FILE, minified, 'utf8');

  const duration = Date.now() - t0;
  const sizeKb = (Buffer.byteLength(bundled, 'utf8') / 1024).toFixed(1);
  const minSizeKb = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(1);

  console.log(`[✓] Bundled standalone Mini-Studio demo in ${duration}ms`);
  console.log(`    Raw: ${sizeKb} KB -> Minified: ${minSizeKb} KB`);
  console.log(`    Saved to: marketing/public/demo.html and core/docs/demo.html`);

  return { success: true, duration, sizeKb, minSizeKb };
}

if (require.main === module) {
  buildDemo();

  if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    console.log('\n[WATCH] 👀 Watching for changes in docs/src/marketing/ and src/ ...');
    console.log('        Edit components/mini-studio.html, js/mini-studio.js, or CSS to auto-rebuild.');
    console.log('        Press Ctrl + C to stop.\n');

    let debounceTimer = null;
    const triggerRebuild = (file) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`\n[⚡] Change detected in ${file || 'files'}, rebuilding demo in ~15ms...`);
        buildDemo();
      }, 50);
    };

    if (fs.existsSync(SRC_DIR)) {
      fs.watch(SRC_DIR, { recursive: true }, (evt, filename) => {
        triggerRebuild(`[marketing/${filename}]`);
      });
    }

    const CORE_SRC = path.join(ROOT_DIR, 'src');
    if (fs.existsSync(CORE_SRC)) {
      fs.watch(CORE_SRC, { recursive: true }, (evt, filename) => {
        triggerRebuild(`[src/${filename}]`);
      });
    }
  }
}

module.exports = { buildDemo };
