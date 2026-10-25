/**
 * Store Preview Studio · HTML/CSS/JS Production Minifier
 * Safe, zero-dependency minification for standalone marketing pages.
 */

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => {
      // Strip lines that are pure comments
      if (/^\s*\/\//.test(line)) return '';
      return line.trim();
    })
    .filter(line => line.length > 0)
    .join('\n');
}

function minifyHtmlPage(html) {
  // 1. Minify inline <style> blocks
  html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (match, attrs, content) => {
    return `<style${attrs}>${minifyCss(content)}</style>`;
  });

  // 2. Minify inline <script> blocks (skip external scripts with src=)
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
    if (/src\s*=/i.test(attrs)) return match;
    if (/application\/ld\+json/i.test(attrs)) return match;
    return `<script${attrs}>${minifyJs(content)}</script>`;
  });

  // 3. Remove HTML comments
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

  // 4. Clean up multiple blank lines
  html = html.replace(/\n\s*\n+/g, '\n');

  return html.trim();
}

module.exports = { minifyCss, minifyJs, minifyHtmlPage };
