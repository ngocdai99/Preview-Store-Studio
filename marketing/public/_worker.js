export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Google Search Console Site Verification (Strict Exact Match)
    if (url.pathname === '/googlea4a7855838cd2c01.html') {
      return new Response('google-site-verification: googlea4a7855838cd2c01.html', {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Fast Edge API Proxy for App Store Metadata
    if (url.pathname === '/api/lookup') {
      const id = url.searchParams.get('id') || url.searchParams.get('appid');
      const bundle = url.searchParams.get('bundle');
      const country = url.searchParams.get('country') || '';

      if (!id && !bundle) {
        return new Response(JSON.stringify({ error: 'Missing id or bundle' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const itunesUrl = 'https://itunes.apple.com/lookup?' +
        (id ? 'id=' + encodeURIComponent(id) : 'bundleId=' + encodeURIComponent(bundle)) +
        (country ? '&country=' + encodeURIComponent(country) : '');

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(itunesUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          }
        });
        clearTimeout(timeoutId);
        const data = await res.text();
        return new Response(data, {
          status: res.status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': res.ok ? 'public, max-age=3600' : 'no-cache'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Edge Invite Analytics & Follow-up Tracking (Verified Apple App ID only)
    if (url.pathname === '/api/track') {
      const appid = (url.searchParams.get('appid') || '').trim();
      const app = (url.searchParams.get('app') || '').trim();
      const dev = (url.searchParams.get('dev') || '').trim();
      const event = url.searchParams.get('event') || 'view';
      const tier = url.searchParams.get('tier') || '';
      const country = request.cf ? (request.cf.country || '') : '';
      const city = request.cf ? (request.cf.city || '') : '';
      const ip = request.headers.get('cf-connecting-ip') || '';

      if (/^\d{7,12}$/.test(appid)) {
        console.log(`[INVITE_TRACK] ${new Date().toISOString()} event=${event} appid=${appid} app="${app}" dev="${dev}" tier=${tier} geo=${city},${country} ip=${ip}`);
      }

      return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Canonical 301 Redirect: store-preview-studio.pages.dev & www.storepreviewstudio.com -> storepreviewstudio.com
    // Preserves path + query params (e.g. ?appid=...) for existing outreach links and transfers SEO signals.
    // Preview deployments (*.store-preview-studio.pages.dev) are excluded so deploy previews remain directly accessible.
    if (
      url.hostname === 'store-preview-studio.pages.dev' ||
      url.hostname === 'www.storepreviewstudio.com'
    ) {
      const target = new URL(url.pathname + url.search, 'https://storepreviewstudio.com');
      return Response.redirect(target.toString(), 301);
    }

    // Redirect direct top-level browser visits to /try-studio(.html) back to /try
    if (
      (url.pathname === '/try-studio' || url.pathname === '/try-studio.html') &&
      request.headers.get('Sec-Fetch-Dest') === 'document'
    ) {
      const target = new URL('/try', url.origin);
      url.searchParams.forEach((v, k) => {
        if (k !== 'embed') target.searchParams.set(k, v);
      });
      return Response.redirect(target.toString(), 302);
    }

    return env.ASSETS.fetch(request);
  }
};
