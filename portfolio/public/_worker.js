export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/googlea4a7855838cd2c01.html") {
      return new Response(
        "google-site-verification: googlea4a7855838cd2c01.html",
        {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    return env.ASSETS.fetch(request);
  },
};
