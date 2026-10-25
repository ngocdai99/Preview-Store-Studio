#!/usr/bin/env node
/**
 * Store Preview Studio · Marketing Page Bundler
 * 
 * Bundles modular marketing source files:
 *   - HTML Components: Resolves <!-- @include "..." --> in docs/src/marketing/index.html
 *   - CSS Modules: Resolves /* @include "..." *\/ in <style>
 *   - JavaScript Modules: Resolves /* @include "..." *\/ in <script>
 * 
 * Generates standalone offline file: docs/marketing.html (~2-4ms)
 */

const fs = require('fs');
const path = require('path');

const { minifyHtmlPage } = require('./minifier.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'docs', 'src', 'marketing');
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing.html');
const MIN_OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing.min.html');
const INDEX_OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'index.html');

const CLOUDFLARE_DIR = path.join(ROOT_DIR, 'cloudflare');
const CF_INDEX_FILE = path.join(CLOUDFLARE_DIR, 'index.html');
const CF_MARKETING_FILE = path.join(CLOUDFLARE_DIR, 'marketing.html');
const CF_MIN_MARKETING_FILE = path.join(CLOUDFLARE_DIR, 'marketing.min.html');

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

function buildMarketing() {
  const t0 = Date.now();
  const entryFile = path.join(SRC_DIR, 'index.html');
  if (!fs.existsSync(entryFile)) {
    console.error(`[✗] Entry file not found: ${entryFile}`);
    return { success: false, error: 'Entry file missing' };
  }

  const raw = fs.readFileSync(entryFile, 'utf8');
  const bundled = resolveIncludes(raw, SRC_DIR);

  fs.writeFileSync(OUTPUT_FILE, bundled, 'utf8');

  // Minify production bundle
  const minified = minifyHtmlPage(bundled);
  fs.writeFileSync(MIN_OUTPUT_FILE, minified, 'utf8');
  fs.writeFileSync(INDEX_OUTPUT_FILE, minified, 'utf8');

  // Automatically sync production marketing bundle to cloudflare/
  if (!fs.existsSync(CLOUDFLARE_DIR)) {
    fs.mkdirSync(CLOUDFLARE_DIR, { recursive: true });
  }
  fs.writeFileSync(CF_MARKETING_FILE, bundled, 'utf8');
  fs.writeFileSync(CF_MIN_MARKETING_FILE, minified, 'utf8');
  fs.writeFileSync(CF_INDEX_FILE, minified, 'utf8');

  // Sync static branding and preview assets to cloudflare/
  const staticAssets = ['showcase-data.js', 'og-image.png', 'app-icon.svg', 'favicon.svg'];
  staticAssets.forEach(file => {
    const src = path.join(ROOT_DIR, 'docs', file);
    const dest = path.join(CLOUDFLARE_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  });

  const duration = Date.now() - t0;
  const sizeKb = (Buffer.byteLength(bundled, 'utf8') / 1024).toFixed(1);
  const minSizeKb = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(1);
  console.log(`[✓] Bundled docs/marketing.html in ${duration}ms (${sizeKb} KB)`);
  console.log(`[✓] Generated docs/marketing.min.html (${minSizeKb} KB, -${(sizeKb - minSizeKb).toFixed(1)} KB)`);
  return { success: true, duration, sizeKb, minSizeKb };
}

if (require.main === module) {
  buildMarketing();
}

module.exports = { buildMarketing };
