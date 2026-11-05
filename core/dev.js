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
let buildTry = null;
try {
  buildTry = require('./scripts/build-try.js').buildTry;
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

    // 1b. Mock API: iTunes Lookup Proxy for Local Development
    if (pathname === '/api/lookup') {
      const id = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('appid');
      const bundle = parsedUrl.searchParams.get('bundle');
      const country = parsedUrl.searchParams.get('country') || '';

      if (!id && !bundle) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'Missing id or bundle' }));
        return;
      }

      const itunesUrl = `https://itunes.apple.com/lookup?${id ? `id=${encodeURIComponent(id)}` : `bundleId=${encodeURIComponent(bundle)}`}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
      const https = require('https');
      https.get(itunesUrl, { headers: { 'User-Agent': 'PreviewStudioDev/2.1' } }, (apiRes) => {
        let body = '';
        apiRes.on('data', chunk => { body += chunk; });
        apiRes.on('end', () => {
          res.writeHead(apiRes.statusCode || 200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
          });
          res.end(body);
        });
      }).on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      });
      return;
    }

    // 2. Serve the Studio HTML at root (Core Studio)
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

    // 2b. Serve the Try Demo Studio at /try or /try.html
    if (pathname === '/try' || pathname === '/try/' || pathname === '/try.html') {
      const TRY_OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'try.html');
      if (!fs.existsSync(TRY_OUTPUT_FILE)) {
        if (typeof buildTry === 'function') buildTry();
      }
      if (fs.existsSync(TRY_OUTPUT_FILE)) {
        let content = fs.readFileSync(TRY_OUTPUT_FILE, 'utf8');
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
      console.error('[ERR] Server error:', err);
    }
  });

  server.listen(port, () => {
    const coreUrl = `http://localhost:${port}`;
    const tryUrl = `http://localhost:${port}/try`;
    console.log('\n======================================================');
    console.log('Store Preview Studio · Real-time Live Dev Server');
    console.log('======================================================');
    console.log(`Core Studio:   ${coreUrl}`);
    console.log(`Try Demo:      ${tryUrl}`);
    console.log(`Watching:      src/ (components, css, js, modals) & try.html`);
    console.log(`Live Reload:   ACTIVE (Trình duyệt tự F5 tức thì khi sửa code)`);
    console.log('------------------------------------------------------');
    console.log('Nhấn Ctrl + C để dừng server.\n');

    // Auto open in browser: open Core Studio (localhost:3000)
    const openCoreCmd = process.platform === 'darwin' ? `open "${coreUrl}"`
      : process.platform === 'win32' ? `start "${coreUrl}"`
      : `xdg-open "${coreUrl}"`;

    exec(openCoreCmd, () => {});

    // Initial build for both Core and Try
    const res = build();
    if (res.success) {
      console.log(`[OK] Core build completed (${res.duration}ms)`);
    }
    if (typeof buildTry === 'function') {
      try {
        const tryRes = buildTry();
        if (tryRes.success) {
          console.log(`[OK] Try build completed (${tryRes.duration}ms)`);
        }
      } catch (err) {
        console.error('[!] buildTry error:', err.message);
      }
    }

    // Start watching src/ and try template
    let debounceTimer = null;
    const triggerDevRebuild = (filename) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (filename && filename.endsWith('app.js')) return; // Ignore generated bundle file
        const fileInfo = filename ? `[${filename}]` : 'files';
        console.log(`\n[i] Change detected in ${fileInfo}, rebuilding core and try...`);
        const b = build();
        if (typeof buildTry === 'function') {
          try {
            buildTry();
          } catch (e) {
            console.error('[!] buildTry error:', e.message);
          }
        }
        if (b.success) {
          console.log(`[OK] Rebuilt core.html (${b.duration}ms) & try.html`);
          triggerReload();
        }
      }, 150);
    };

    fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
      triggerDevRebuild(filename);
    });

    const tryTemplate = path.join(ROOT_DIR, 'docs', 'src', 'marketing', 'try.html');
    if (fs.existsSync(tryTemplate)) {
      fs.watch(tryTemplate, () => {
        triggerDevRebuild('try.html');
      });
    }
  });
}

// Start
startServer(DEFAULT_PORT);
