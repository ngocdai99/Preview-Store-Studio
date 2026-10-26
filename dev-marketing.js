#!/usr/bin/env node
/**
 * Preview Studio · Landing Page Live Dev Server with Real-time Auto-Reload
 * 
 * Features:
 *   - 100% Zero Dependencies (Native Node.js HTTP & fs)
 *   - Serves docs/marketing.html and marketing_vi.html directly at http://localhost:4000/
 *   - Watches docs/src/marketing/, src/, and docs/showcase-data.js
 *   - Auto-rebuilds docs/marketing.html and docs/marketing_vi.html
 *   - Instant Live Auto-Reload via Server-Sent Events (SSE)
 *   - Auto-opens default browser on launch
 * 
 * Usage:
 *   node dev-marketing.js
 *   node dev-marketing.js 4000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT_DIR = __dirname;
const MARKETING_SRC_DIR = path.join(ROOT_DIR, 'docs', 'src', 'marketing');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const SHOWCASE_DATA = path.join(ROOT_DIR, 'docs', 'showcase-data.js');
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing.html');
const OUTPUT_VI_FILE = path.join(ROOT_DIR, 'docs', 'marketing_vi.html');

let DEFAULT_PORT = parseInt(process.argv[2], 10) || 4000;

// Set of active SSE client connections
const sseClients = new Set();

// Import buildMarketing and buildMarketingVi
const { buildMarketing } = require('./scripts/build-marketing.js');
let buildMarketingVi = null;
try {
  buildMarketingVi = require('./scripts/build-marketing-vi.js').buildMarketingVi;
} catch (_) {}

/**
 * Rebuilds both marketing and marketing_vi bundles
 */
function rebuildAllMarketing() {
  const b = buildMarketing();
  if (typeof buildMarketingVi === 'function') {
    try {
      buildMarketingVi();
    } catch (e) {
      console.error('[!] buildMarketingVi error:', e.message);
    }
  }
  return b;
}

/**
 * Broadcasts reload event to all open browser tabs
 */
function triggerReload() {
  const count = sseClients.size;
  for (const client of sseClients) {
    try {
      client.write('data: reload\n\n');
    } catch (_) {
      sseClients.delete(client);
    }
  }
  if (count > 0) {
    console.log(`[LIVE] Reload event sent to ${count} active tab(s).`);
  }
}

/**
 * Start HTTP server with SSE Live Reload
 */
function startServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. SSE Endpoint for Real-time Live Reload
    if (pathname === '/__livereload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write('data: connected\n\n');
      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    const liveReloadScript = `
<!-- Live Reload Client Script (Dev Mode Only) -->
<script>
(() => {
  const es = new EventSource('/__livereload');
  es.onmessage = (e) => {
    if (e.data === 'reload') {
      console.log('[Dev] Change detected. Reloading...');
      window.location.reload();
    }
  };
  es.onerror = () => {
    // Retry connection automatically
  };
})();
</script>
</body>`;

    // 2. Serve docs/marketing.html at root (/, /index.html, /marketing.html)
    if (pathname === '/' || pathname === '/index.html' || pathname === '/marketing.html') {
      if (!fs.existsSync(OUTPUT_FILE)) {
        rebuildAllMarketing();
      }
      let content = fs.readFileSync(OUTPUT_FILE, 'utf8');
      content = content.replace('</body>', liveReloadScript);

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
      return;
    }

    // 2b. Serve marketing_vi.html (/marketing_vi, /marketing_vi.html)
    if (pathname === '/marketing_vi' || pathname === '/marketing_vi.html') {
      if (!fs.existsSync(OUTPUT_VI_FILE) && typeof buildMarketingVi === 'function') {
        rebuildAllMarketing();
      }
      const targetVi = fs.existsSync(OUTPUT_VI_FILE) ? OUTPUT_VI_FILE : path.join(ROOT_DIR, 'marketing_vi.html');
      if (fs.existsSync(targetVi)) {
        let content = fs.readFileSync(targetVi, 'utf8');
        content = content.replace('</body>', liveReloadScript);

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
        return;
      }
    }

    // 3. Serve other static assets (images, presets, etc.)
    let filePath = path.join(ROOT_DIR, pathname);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      if (fs.existsSync(path.join(ROOT_DIR, 'docs', pathname)) && fs.statSync(path.join(ROOT_DIR, 'docs', pathname)).isFile()) {
        filePath = path.join(ROOT_DIR, 'docs', pathname);
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.html') {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace('</body>', liveReloadScript);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
        return;
      }
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.js': 'text/javascript',
        '.css': 'text/css'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[i] Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[ERR] Server error:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n======================================================');
    console.log('Preview Studio · Landing Page Live Dev Server');
    console.log('======================================================');
    console.log(`Local URL:     ${url}`);
    console.log(`Watching:      docs/src/marketing/, src/, docs/showcase-data.js`);
    console.log(`Live Reload:   ACTIVE (Auto-reload on code change)`);
    console.log('------------------------------------------------------');
    console.log('Press Ctrl + C to stop server.\n');

    // Auto open in browser
    const openCmd = process.platform === 'darwin' ? `open "${url}"`
      : process.platform === 'win32' ? `start "${url}"`
      : `xdg-open "${url}"`;
    exec(openCmd, () => {});

    // Initial build
    const res = rebuildAllMarketing();
    if (res && res.success) {
      console.log(`[OK] Initial build completed (${res.duration}ms)`);
    }

    // Debounced watcher runner
    let changeDebounce = null;
    const triggerRebuild = (sourceLabel) => {
      if (changeDebounce) clearTimeout(changeDebounce);
      changeDebounce = setTimeout(() => {
        console.log(`\n[i] Change detected in ${sourceLabel}, rebuilding marketing bundles...`);
        const b = rebuildAllMarketing();
        if (b && b.success) {
          triggerReload();
        }
      }, 100);
    };

    // Watch docs/src/marketing/
    if (fs.existsSync(MARKETING_SRC_DIR)) {
      fs.watch(MARKETING_SRC_DIR, { recursive: true }, (eventType, filename) => {
        triggerRebuild(filename ? `[marketing/${filename}]` : 'marketing files');
      });
    }

    // Watch src/ (includes shared modal, css, js)
    if (fs.existsSync(SRC_DIR)) {
      fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('app.js')) return; // ignore generated bundle
        triggerRebuild(filename ? `[src/${filename}]` : 'src files');
      });
    }

    // Watch docs/showcase-data.js
    if (fs.existsSync(SHOWCASE_DATA)) {
      fs.watch(SHOWCASE_DATA, () => {
        triggerRebuild('[docs/showcase-data.js]');
      });
    }
  });
}

// Start
startServer(DEFAULT_PORT);
