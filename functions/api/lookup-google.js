export async function onRequest(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id') || url.searchParams.get('package') || url.searchParams.get('pkg');
  const hl = url.searchParams.get('hl') || 'en';
  const gl = url.searchParams.get('gl') || 'us';

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing package id' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const playUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}`;

  try {
    const res = await fetch(playUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      cf: { cacheTtl: 3600, cacheEverything: true }
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'App not found on Google Play', status: res.status }), {
        status: res.status === 404 ? 404 : 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const html = await res.text();

    // Extract Schema.org JSON-LD
    const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    let ld = {};
    if (ldMatch) {
      try {
        ld = JSON.parse(ldMatch[1]);
      } catch (e) {}
    }

    // Extract Screenshots (images with alt="Screenshot image")
    const shotMatches = [...html.matchAll(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"= ]+)[^>]*alt="([^"]*screenshot[^"]*)"/gi)];
    let rawShots = Array.from(new Set(shotMatches.map(x => x[1])));
    if (rawShots.length === 0) {
      const anyImgs = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/g)];
      const uniqueKeys = Array.from(new Set(anyImgs.map(m => m[1])));
      const iconKey = ld.image ? (ld.image.match(/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[1] : null;
      rawShots = uniqueKeys.filter(k => k !== iconKey).slice(0, 8).map(k => 'https://play-lh.googleusercontent.com/' + k);
    }

    const screenshots = rawShots.slice(0, 8).map(u => u.split('=')[0] + '=w1080');

    const rawIcon = ld.image || (html.match(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[0] || '';
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
      price: ld.offers && ld.offers[0] ? ld.offers[0].price : '0',
      icon: iconBase ? iconBase + '=s512' : '',
      icon1024: iconBase ? iconBase + '=s1024' : '',
      screenshots: screenshots
    };

    return new Response(JSON.stringify(appData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
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
