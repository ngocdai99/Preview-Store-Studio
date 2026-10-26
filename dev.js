#!/usr/bin/env node
/**
 * Store Preview Studio · Live Dev Server with Real-time Auto-Reload
 * 
 * Features:
 *   - 100% Zero Dependencies (Uses native Node.js HTTP & File System modules)
 *   - Auto-rebuilds core.html on any edit in src/
 *   - Auto-reloads all connected browsers instantly via Server-Sent Events (SSE)
 *   - Auto-opens default browser on startup
 * 
 * Usage:
 *   node dev.js
 *   node dev.js 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'core.html');

let DEFAULT_PORT = parseInt(process.argv[2], 10) || 3000;

// Set of active SSE client connections
const sseClients = new Set();

// Import unified build function from build.js
const { build } = require('./build.js');
let buildMarketing = null;
try {
  buildMarketing = require('./scripts/build-marketing.js').buildMarketing;
} catch (_) {}

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

    // 2. Serve the Studio HTML at root
    if (pathname === '/' || pathname === '/index.html' || pathname === '/core.html' || pathname === '/store_preview_studio.html') {
      if (!fs.existsSync(OUTPUT_FILE)) {
        build();
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
      console.log('[Dev] Code change detected. Reloading...');
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

    // 3. Serve other static files (e.g. presets, images, test_data, docs, package)
    let filePath = path.join(ROOT_DIR, pathname);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      if (fs.existsSync(path.join(ROOT_DIR, 'docs', pathname)) && fs.statSync(path.join(ROOT_DIR, 'docs', pathname)).isFile()) {
        filePath = path.join(ROOT_DIR, 'docs', pathname);
      } else if (fs.existsSync(path.join(ROOT_DIR, 'package', pathname)) && fs.statSync(path.join(ROOT_DIR, 'package', pathname)).isFile()) {
        filePath = path.join(ROOT_DIR, 'package', pathname);
      }
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.html') {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace('</body>', liveReloadScript);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
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
    console.log('Store Preview Studio · Real-time Live Dev Server');
    console.log('======================================================');
    console.log(`Local URL:     ${url}`);
    console.log(`Watching:      src/ (index.html, style.css, app.js)`);
    console.log(`Live Reload:   ACTIVE (Trình duyệt tự F5 tức thì khi sửa code)`);
    console.log('------------------------------------------------------');
    console.log('Nhấn Ctrl + C để dừng server.\n');

    // Auto open in browser
    const openCmd = process.platform === 'darwin' ? `open "${url}"`
      : process.platform === 'win32' ? `start "${url}"`
      : `xdg-open "${url}"`;
    exec(openCmd, () => {});

    // Initial build
    const res = build();
    if (res.success) {
      console.log(`[✓] Initial build completed (${res.duration}ms)`);
    }
    const MARKETING_SRC_DIR = path.join(ROOT_DIR, 'docs', 'src', 'marketing');
    if (typeof buildMarketing === 'function' && fs.existsSync(MARKETING_SRC_DIR)) {
      buildMarketing();
    }

    // Start watching src/
    let debounceTimer = null;
    fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (filename && filename.endsWith('app.js')) return; // Ignore generated bundle file
        const fileInfo = filename ? `[${filename}]` : 'files';
        console.log(`\n[i] Change detected in ${fileInfo}, rebuilding...`);
        const b = build();
        if (b.success) {
          console.log(`[✓] Bundled store_preview_studio.html (${b.duration}ms)`);
          triggerReload();
        }
      }, 150);
    });

    // Start watching docs/src/marketing/
    if (typeof buildMarketing === 'function' && fs.existsSync(MARKETING_SRC_DIR)) {
      let mktDebounce = null;
      fs.watch(MARKETING_SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (mktDebounce) clearTimeout(mktDebounce);
        mktDebounce = setTimeout(() => {
          const fileInfo = filename ? `[${filename}]` : 'marketing files';
          console.log(`\n[i] Change detected in ${fileInfo}, rebuilding docs/marketing.html...`);
          const b = buildMarketing();
          if (b && b.success) {
            triggerReload();
          }
        }, 150);
      });
    }
  });
}

// Start
startServer(DEFAULT_PORT);
