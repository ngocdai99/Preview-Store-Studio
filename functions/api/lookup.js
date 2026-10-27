export async function onRequest(context) {
  const url = new URL(context.request.url);
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
    const res = await fetch(itunesUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
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
