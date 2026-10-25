#!/usr/bin/env node
/**
 * Preview Studio · Landing Page Live Dev Server with Real-time Auto-Reload
 * 
 * Features:
 *   - 100% Zero Dependencies (Native Node.js HTTP & fs)
 *   - Serves docs/marketing.html directly at http://localhost:4000/
 *   - Watches docs/src/marketing/ recursively (html, css, js)
 *   - Auto-rebuilds docs/marketing.html via scripts/build-marketing.js
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
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing.html');

let DEFAULT_PORT = parseInt(process.argv[2], 10) || 4000;

// Set of active SSE client connections
const sseClients = new Set();

// Import buildMarketing
const { buildMarketing } = require('./scripts/build-marketing.js');

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
    console.log(`[⚡] Reload event sent to ${count} active tab(s).`);
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

    // 2. Serve docs/marketing.html at root (/, /index.html, /marketing.html)
    if (pathname === '/' || pathname === '/index.html' || pathname === '/marketing.html') {
      if (!fs.existsSync(OUTPUT_FILE)) {
        buildMarketing();
      }
      let content = fs.readFileSync(OUTPUT_FILE, 'utf8');

      // Inject tiny Live Reload client script before </body>
      const liveReloadScript = `
<!-- Live Reload Client Script (Dev Mode Only) -->
<script>
(() => {
  const es = new EventSource('/__livereload');
  es.onmessage = (e) => {
    if (e.data === 'reload') {
      console.log('[Dev] Marketing change detected. Reloading...');
      window.location.reload();
    }
  };
  es.onerror = () => {
    // Retry connection automatically
  };
})();
</script>
</body>`;
      content = content.replace('</body>', liveReloadScript);

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
      return;
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
      res.writeHead(200, { 'Content-Type': contentType });
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
      console.error('[✗] Server error:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n======================================================');
    console.log('Preview Studio · Landing Page Live Dev Server');
    console.log('======================================================');
    console.log(`Local URL:     ${url}`);
    console.log(`Watching:      docs/src/marketing/ (html, css, js)`);
    console.log(`Live Reload:   ACTIVE (Trình duyệt tự F5 tức thì khi sửa code)`);
    console.log('------------------------------------------------------');
    console.log('Nhấn Ctrl + C để dừng server.\n');

    // Auto open in browser
    const openCmd = process.platform === 'darwin' ? `open "${url}"`
      : process.platform === 'win32' ? `start "${url}"`
      : `xdg-open "${url}"`;
    exec(openCmd, () => {});

    // Initial build
    const res = buildMarketing();
    if (res && res.success) {
      console.log(`[✓] Initial build completed (${res.duration}ms)`);
    }

    // Start watching docs/src/marketing/
    let mktDebounce = null;
    fs.watch(MARKETING_SRC_DIR, { recursive: true }, (eventType, filename) => {
      if (mktDebounce) clearTimeout(mktDebounce);
      mktDebounce = setTimeout(() => {
        const fileInfo = filename ? `[${filename}]` : 'files';
        console.log(`\n[i] Change detected in ${fileInfo}, rebuilding docs/marketing.html...`);
        const b = buildMarketing();
        if (b && b.success) {
          triggerReload();
        }
      }, 100);
    });
  });
}

// Start
startServer(DEFAULT_PORT);
