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
let buildMarketingVi = null;
try {
  buildMarketingVi = require('./scripts/build-marketing-vi.js').buildMarketingVi;
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

    // 1c. Mock API: Google Play Lookup Proxy for Local Development
    if (pathname === '/api/lookup-google') {
      const id = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('package') || parsedUrl.searchParams.get('pkg');
      const hl = parsedUrl.searchParams.get('hl') || 'en';
      const gl = parsedUrl.searchParams.get('gl') || 'us';

      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'Missing package id' }));
        return;
      }

      const playUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}`;
      const https = require('https');
      https.get(playUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }, (apiRes) => {
        let body = '';
        apiRes.on('data', chunk => { body += chunk; });
        apiRes.on('end', () => {
          if (apiRes.statusCode !== 200) {
            res.writeHead(apiRes.statusCode === 404 ? 404 : 502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'App not found on Google Play', status: apiRes.statusCode }));
            return;
          }
          try {
            const ldMatch = body.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
            let ld = {};
            if (ldMatch) {
              try { ld = JSON.parse(ldMatch[1]); } catch (_) {}
            }
            const shotMatches = [...body.matchAll(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"= ]+)[^>]*alt="([^"]*screenshot[^"]*)"/gi)];
            let rawShots = Array.from(new Set(shotMatches.map(x => x[1])));
            if (rawShots.length === 0) {
              const anyImgs = [...body.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/g)];
              const uniqueKeys = Array.from(new Set(anyImgs.map(m => m[1])));
              const iconKey = ld.image ? (ld.image.match(/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[1] : null;
              rawShots = uniqueKeys.filter(k => k !== iconKey).slice(0, 8).map(k => 'https://play-lh.googleusercontent.com/' + k);
            }
            const screenshots = rawShots.slice(0, 8).map(u => u.split('=')[0] + '=w1080');
            const rawIcon = ld.image || (body.match(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[0] || '';
            const iconBase = rawIcon ? rawIcon.split('=')[0] : '';

            const appData = {
              platform: 'google',
              id: id,
              name: ld.name || '',
              developer: ld.author ? ld.author.name : '',
              description: ld.description || '',
              category: ld.applicationCategory || '',
              rating: ld.aggregateRating && ld.aggregateRating.ratingValue ? parseFloat(ld.aggregateRating.ratingValue).toFixed(1) : '4.5',
              ratingCount: ld.aggregateRating && ld.aggregateRating.ratingCount ? String(ld.aggregateRating.ratingCount) : '1000',
              icon: iconBase ? iconBase + '=s512' : '',
              icon1024: iconBase ? iconBase + '=s1024' : '',
              screenshots: screenshots
            };
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=3600'
            });
            res.end(JSON.stringify(appData));
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      }).on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
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
      console.error('[ERR] Server error:', err);
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
      console.log(`[OK] Initial build completed (${res.duration}ms)`);
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
        if (typeof buildMarketing === 'function') {
          try { buildMarketing(); } catch (_) {}
        }
        if (typeof buildMarketingVi === 'function') {
          try { buildMarketingVi(); } catch (_) {}
        }
        if (b.success) {
          console.log(`[OK] Bundled store_preview_studio.html (${b.duration}ms)`);
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
