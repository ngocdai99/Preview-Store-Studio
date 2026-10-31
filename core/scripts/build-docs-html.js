#!/usr/bin/env node
/**
 * Store Preview Studio · Documentation HTML Generator
 * 
 * Compiles:
 *   - AGENCY_MARKETING_FAQ.md -> AGENCY_MARKETING_FAQ.html
 *   - TEST_CASES.md           -> TEST_CASES.html
 * 
 * Zero external npm dependencies. 100% offline standalone HTML.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to escape HTML characters
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Convert inline Markdown (bold, italic, code, links) to HTML
function parseInline(text) {
  let s = escapeHtml(text);

  // Code: `code`
  s = s.replace(/`([^`]+)`/g, '<code class="doc-code">$1</code>');

  // Bold + Italic: ***text*** or ___text___
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* (avoid matching list markers)
  s = s.replace(/(^|[^\*])\*([^\*]+)\*/g, '$1<em>$2</em>');

  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');

  return s;
}

// Parse markdown tables
function parseTable(lines) {
  if (lines.length < 2) return '';
  const parseRow = (line) => {
    return line.trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());
  };

  const headers = parseRow(lines[0]);
  // line 1 is separator | :--- | :---: | ...
  const bodyRows = lines.slice(2).map(parseRow);

  let html = '<div class="table-wrap"><table class="doc-table"><thead><tr>';
  headers.forEach(h => {
    html += `<th>${parseInline(h)}</th>`;
  });
  html += '</tr></thead><tbody>';

  bodyRows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, idx) => {
      let cellHtml = parseInline(cell);
      // Priority badge styling
      if (cell === 'P0') cellHtml = '<span class="badge badge-p0">P0</span>';
      else if (cell === 'P1') cellHtml = '<span class="badge badge-p1">P1</span>';
      else if (cell === 'P2') cellHtml = '<span class="badge badge-p2">P2</span>';
      else if (cell === 'PASS') cellHtml = '<span class="badge badge-pass">PASS</span>';
      else if (cell === 'Ready') cellHtml = '<span class="badge badge-ready">Ready</span>';
      else if (cell === 'Missing') cellHtml = '<span class="badge badge-missing">Missing</span>';
      else if (cell === 'EXCEEDED' || cell === 'REJECT RISK') cellHtml = '<span class="badge badge-danger">' + cell + '</span>';

      html += `<td>${cellHtml}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  return html;
}

// Convert a markdown file to a structured HTML body
function markdownToHtml(mdContent, docType) {
  const lines = mdContent.split(/\r?\n/);
  const output = [];
  const toc = [];

  let i = 0;
  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer = [];

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        output.push(`<div class="code-block-wrap"><div class="code-lang">${codeLang || 'text'}</div><pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre></div>`);
        codeBuffer = [];
        inCodeBlock = false;
        i++;
        continue;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
        i++;
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      output.push('<hr class="doc-hr" />');
      i++;
      continue;
    }

    // Skip Markdown Table of Contents in the document body (we render a sticky interactive sidebar TOC instead)
    if (line.trim().toLowerCase() === '## table of contents' || line.trim().toLowerCase() === '## test suite index' || line.trim().toLowerCase() === '## mục lục') {
      i++;
      while (i < lines.length && !lines[i].startsWith('---') && !lines[i].startsWith('## ')) {
        i++;
      }
      if (i < lines.length && lines[i].startsWith('---')) i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      const title = line.slice(2).trim();
      output.push(`<h1 class="doc-h1">${parseInline(title)}</h1>`);
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      const title = line.slice(3).trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      toc.push({ level: 2, title, id });
      output.push(`<h2 class="doc-h2" id="${id}"><a href="#${id}" class="anchor-link">#</a>${parseInline(title)}</h2>`);
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      const title = line.slice(4).trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      toc.push({ level: 3, title, id });
      output.push(`<h3 class="doc-h3" id="${id}"><a href="#${id}" class="anchor-link">#</a>${parseInline(title)}</h3>`);
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      const title = line.slice(5).trim();
      output.push(`<h4 class="doc-h4">${parseInline(title)}</h4>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      output.push(`<blockquote class="doc-quote">${quoteLines.map(parseInline).join('<br>')}</blockquote>`);
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && line.includes('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      output.push(parseTable(tableLines));
      continue;
    }

    // Unordered List
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const listItems = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* ') || (lines[i].startsWith('  ') && listItems.length))) {
        if (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* ')) {
          listItems.push(lines[i].trim().slice(2));
        } else {
          listItems[listItems.length - 1] += ' ' + lines[i].trim();
        }
        i++;
      }
      output.push('<ul class="doc-ul">' + listItems.map(item => `<li>${parseInline(item)}</li>`).join('') + '</ul>');
      continue;
    }

    // Ordered List
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && (/^\d+\.\s/.test(lines[i].trim()) || (lines[i].startsWith('  ') && listItems.length))) {
        if (/^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        } else {
          listItems[listItems.length - 1] += ' ' + lines[i].trim();
        }
        i++;
      }
      output.push('<ol class="doc-ol">' + listItems.map(item => `<li>${parseInline(item)}</li>`).join('') + '</ol>');
      continue;
    }

    // Paragraph
    if (line.trim().length > 0) {
      output.push(`<p class="doc-p">${parseInline(line)}</p>`);
    }

    i++;
  }

  return { htmlBody: output.join('\n'), toc };
}

// Generate complete standalone HTML file with styling and interactivity
function buildDocHtml({ title, subtitle, badge, mdFile, outFile, docType }) {
  const mdContent = fs.readFileSync(mdFile, 'utf8');
  const { htmlBody, toc } = markdownToHtml(mdContent, docType);

  let tocHtml = '<nav class="toc-nav"><div class="toc-title">Table of Contents</div><ul class="toc-list">';
  toc.forEach(item => {
    const cls = item.level === 3 ? 'toc-sub' : 'toc-main';
    tocHtml += `<li class="${cls}"><a href="#${item.id}" class="toc-link" data-target="${item.id}">${escapeHtml(item.title)}</a></li>`;
  });
  tocHtml += '</ul></nav>';

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} · Store Preview Studio</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6'/%3E%3Cstop offset='100%25' stop-color='%238b5cf6'/%3E%3C/linearGradient%3E%3ClinearGradient id='front' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6'/%3E%3Cstop offset='100%25' stop-color='%236366f1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='7' fill='url(%23bg)'/%3E%3Crect x='10.5' y='4.5' width='16.5' height='18' rx='2.5' fill='rgba(255,255,255,0.2)' stroke='%23ffffff' stroke-width='1.6'/%3E%3Ccircle cx='18.75' cy='6.2' r='0.65' fill='%23ffffff'/%3E%3Crect x='12.5' y='8.5' width='6' height='7' rx='1' fill='%23ffffff' opacity='0.35'/%3E%3Crect x='19.5' y='8.5' width='5.5' height='7' rx='1' fill='%23ffffff' opacity='0.35'/%3E%3Crect x='12.5' y='17' width='12.5' height='3' rx='0.8' fill='%23ffffff' opacity='0.5'/%3E%3Crect x='5' y='8' width='11.5' height='19.5' rx='3' fill='url(%23front)'/%3E%3Crect x='5' y='8' width='11.5' height='19.5' rx='3' fill='rgba(255,255,255,0.22)' stroke='%23ffffff' stroke-width='1.8'/%3E%3Crect x='8.5' y='9.8' width='4.5' height='1.2' rx='0.6' fill='%23ffffff'/%3E%3Crect x='6.8' y='12.5' width='8' height='7.5' rx='1' fill='%23ffffff' opacity='0.35'/%3E%3Crect x='6.8' y='21.5' width='8' height='3.5' rx='0.8' fill='%23ffffff' opacity='0.6'/%3E%3C/svg%3E">
  <script>
    (function() {
      try {
        const saved = localStorage.getItem('sps_doc_theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  </script>
  <style>
    /* CSS Reset & Design Tokens (Default: Light Mode) */
    :root {
      --bg: #f8fafc;
      --bg-sidebar: #ffffff;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --card-hover: #f1f5f9;
      --text: #0f172a;
      --text-muted: #334155;
      --text-dim: #64748b;
      --primary: #0284c7;
      --primary-dim: rgba(2, 132, 199, 0.08);
      --primary-border: rgba(2, 132, 199, 0.25);
      --accent: #4f46e5;
      --succ: #059669;
      --succ-dim: rgba(5, 150, 105, 0.1);
      --warn: #d97706;
      --warn-dim: rgba(217, 119, 6, 0.1);
      --err: #dc2626;
      --err-dim: rgba(220, 38, 38, 0.1);
      --code-bg: #0f172a;
      --code-text: #93c5fd;
      --inline-code-bg: #f1f5f9;
      --inline-code-border: #cbd5e1;
      --inline-code-text: #0369a1;
      --th-bg: #f1f5f9;
      --th-text: #0f172a;
      --td-border: #f1f5f9;
      --quote-bg: #f1f5f9;
      --header-bg: rgba(255, 255, 255, 0.92);
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    }

    /* Dark Mode Theme */
    [data-theme="dark"] {
      --bg: #090d16;
      --bg-sidebar: #0e1424;
      --card-bg: #131b2e;
      --card-border: #1e293b;
      --card-hover: #1c2640;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #38bdf8;
      --primary-dim: rgba(56, 189, 248, 0.12);
      --primary-border: rgba(56, 189, 248, 0.3);
      --accent: #6366f1;
      --succ: #10b981;
      --succ-dim: rgba(16, 185, 129, 0.12);
      --warn: #f59e0b;
      --warn-dim: rgba(245, 158, 11, 0.12);
      --err: #ef4444;
      --err-dim: rgba(239, 68, 68, 0.12);
      --code-bg: #060911;
      --code-text: #93c5fd;
      --inline-code-bg: rgba(255, 255, 255, 0.08);
      --inline-code-border: rgba(255, 255, 255, 0.08);
      --inline-code-text: #38bdf8;
      --th-bg: #0e1628;
      --th-text: #e2e8f0;
      --td-border: rgba(255, 255, 255, 0.05);
      --quote-bg: #131b2e;
      --header-bg: rgba(14, 20, 36, 0.88);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-sans);
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: background-color 0.2s, color 0.2s;
    }

    /* Top Navigation Bar */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--header-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      transition: background-color 0.2s, border-color 0.2s;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text);
    }
    .brand-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: #fff;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
    }
    .brand-title {
      font-weight: 700;
      font-size: 15px;
      letter-spacing: -0.01em;
      color: var(--text);
    }
    .brand-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--primary-dim);
      color: var(--primary);
      border: 1px solid var(--primary-border);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .search-input {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      color: var(--text);
      outline: none;
      width: 220px;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-dim);
      width: 260px;
    }
    .btn-action {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-action:hover {
      background: var(--card-hover);
      border-color: var(--text-dim);
    }

    /* Layout */
    .layout {
      display: flex;
      flex: 1;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
    }

    /* Sidebar TOC */
    .sidebar {
      width: 320px;
      flex-shrink: 0;
      position: sticky;
      top: 60px;
      height: calc(100vh - 60px);
      overflow-y: auto;
      border-right: 1px solid var(--card-border);
      background: var(--bg-sidebar);
      padding: 24px 16px;
      transition: background-color 0.2s, border-color 0.2s;
    }
    .toc-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      margin-bottom: 12px;
      padding-left: 8px;
    }
    .toc-list {
      list-style: none;
    }
    .toc-main {
      margin-top: 14px;
      font-weight: 600;
      font-size: 13px;
    }
    .toc-sub {
      margin-top: 6px;
      padding-left: 14px;
      font-size: 12.5px;
      font-weight: 400;
    }
    .toc-link {
      display: block;
      color: var(--text-muted);
      text-decoration: none;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.15s;
      line-height: 1.4;
    }
    .toc-link:hover {
      color: var(--text);
      background: var(--card-hover);
    }
    .toc-link.active {
      color: var(--primary);
      background: var(--primary-dim);
      font-weight: 600;
    }

    /* Main Content Area */
    .content-area {
      flex: 1;
      min-width: 0;
      padding: 40px 56px 80px;
    }

    /* Typography & Elements */
    .doc-header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--card-border);
    }
    .doc-h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 12px;
      color: var(--text);
    }
    .doc-subtitle {
      font-size: 16px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .doc-h2 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-top: 48px;
      margin-bottom: 18px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .doc-h3 {
      font-size: 17px;
      font-weight: 700;
      margin-top: 32px;
      margin-bottom: 12px;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .doc-h4 {
      font-size: 15px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 8px;
      color: var(--text);
    }

    .anchor-link {
      color: var(--text-dim);
      text-decoration: none;
      opacity: 0;
      transition: opacity 0.15s;
      font-weight: 400;
    }
    .doc-h2:hover .anchor-link,
    .doc-h3:hover .anchor-link {
      opacity: 1;
    }

    .doc-p {
      margin-bottom: 14px;
      color: var(--text-muted);
    }
    .doc-quote {
      background: var(--quote-bg);
      border-left: 3px solid var(--primary);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 18px 0;
      color: var(--text);
      font-size: 14px;
    }
    .doc-ul, .doc-ol {
      margin: 12px 0 16px 24px;
      color: var(--text-muted);
    }
    .doc-ul li, .doc-ol li {
      margin-bottom: 6px;
    }
    .doc-code {
      font-family: var(--font-mono);
      background: var(--inline-code-bg);
      border: 1px solid var(--inline-code-border);
      color: var(--inline-code-text);
      padding: 2px 6px;
      border-radius: 5px;
      font-size: 13px;
    }
    .doc-link {
      color: var(--primary);
      text-decoration: none;
      border-bottom: 1px dotted var(--primary-border);
    }
    .doc-link:hover {
      border-bottom-style: solid;
    }
    .doc-hr {
      border: 0;
      height: 1px;
      background: var(--card-border);
      margin: 40px 0;
    }

    /* Tables */
    .table-wrap {
      overflow-x: auto;
      margin: 20px 0 28px;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .doc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: left;
    }
    .doc-table th {
      background: var(--th-bg);
      color: var(--th-text);
      font-weight: 700;
      padding: 12px 16px;
      border-bottom: 1px solid var(--card-border);
      white-space: nowrap;
    }
    .doc-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--td-border);
      color: var(--text-muted);
      vertical-align: top;
      line-height: 1.5;
    }
    .doc-table tr:last-child td {
      border-bottom: none;
    }
    .doc-table tr:hover td {
      background: var(--card-hover);
    }

    /* Badges */
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge-p0 { background: var(--err-dim); color: var(--err); border: 1px solid rgba(220, 38, 38, 0.3); }
    .badge-p1 { background: var(--warn-dim); color: var(--warn); border: 1px solid rgba(217, 119, 6, 0.3); }
    .badge-p2 { background: var(--primary-dim); color: var(--primary); border: 1px solid var(--primary-border); }
    .badge-pass, .badge-ready { background: var(--succ-dim); color: var(--succ); border: 1px solid rgba(5, 150, 105, 0.3); }
    .badge-missing, .badge-danger { background: var(--err-dim); color: var(--err); border: 1px solid rgba(220, 38, 38, 0.3); }

    /* Code Block */
    .code-block-wrap {
      margin: 18px 0;
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      overflow: hidden;
    }
    .code-lang {
      background: rgba(255, 255, 255, 0.04);
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .code-block-wrap pre {
      padding: 16px;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.55;
      color: var(--code-text);
    }

    /* Quick Filter Toolbar (For Test Cases) */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-btn {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .filter-btn:hover {
      color: var(--text);
      background: var(--card-hover);
    }
    .filter-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    /* Print Styles */
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .top-bar, .sidebar, .filter-bar, .search-input { display: none !important; }
      .content-area { padding: 0 !important; max-width: 100% !important; }
      .table-wrap { border: 1px solid #ccc !important; box-shadow: none !important; }
      .doc-table th { background: #f1f5f9 !important; color: #000 !important; border-bottom: 2px solid #94a3b8 !important; }
      .doc-table td { color: #000 !important; border-bottom: 1px solid #e2e8f0 !important; }
      .code-block-wrap { background: #f8fafc !important; border: 1px solid #cbd5e1 !important; }
      .code-block-wrap pre { color: #000 !important; }
      .doc-h1, .doc-h2, .doc-h3 { color: #000 !important; }
      .doc-code { background: #f1f5f9 !important; color: #000 !important; border: 1px solid #cbd5e1 !important; }
    }

    @media (max-width: 960px) {
      .sidebar { display: none; }
      .content-area { padding: 24px 20px 60px; }
      .search-input { width: 140px; }
      .search-input:focus { width: 180px; }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Header -->
  <header class="top-bar">
    <a href="#" class="brand">
      <div class="brand-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="7.5" y="2.5" width="13" height="14" rx="2" stroke="#fff" fill="rgba(255,255,255,0.2)"/>
          <circle cx="14" cy="4.2" r="0.5" fill="#fff"/>
          <rect x="3.5" y="6.5" width="9.5" height="15" rx="2.2" stroke="#fff" fill="rgba(255,255,255,0.28)"/>
          <rect x="6.5" y="8" width="3.5" height="1" rx="0.5" fill="#fff"/>
          <rect x="5.2" y="10.5" width="6" height="5.5" rx="0.8" fill="#fff" opacity="0.4"/>
          <rect x="5.2" y="17.5" width="6" height="2.5" rx="0.6" fill="#fff" opacity="0.7"/>
        </svg>
      </div>
      <div>
        <span class="brand-title">Store Preview Studio</span>
      </div>
      <span class="brand-badge">${escapeHtml(badge)}</span>
    </a>

    <div class="top-actions">
      <input type="text" class="search-input" id="searchBox" placeholder="Search documentation... (Ctrl + K)" />
      <button class="btn-action" id="themeToggleBtn" title="Toggle Light / Dark Mode">Theme: Light</button>
      <button class="btn-action" onclick="window.print()" title="Print or Save as PDF">Print / PDF</button>
    </div>
  </header>

  <!-- Main Container -->
  <div class="layout">
    <!-- Sticky Sidebar TOC -->
    <aside class="sidebar">
      ${tocHtml}
    </aside>

    <!-- Document Content -->
    <main class="content-area" id="docContent">
      <div class="doc-header">
        <h1 class="doc-h1">${escapeHtml(title)}</h1>
        <div class="doc-subtitle">${escapeHtml(subtitle)}</div>
      </div>

      ${docType === 'test-cases' ? `
      <div class="filter-bar">
        <span style="font-size:12px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-right:6px">Priority:</span>
        <button class="filter-btn active" data-filter="all">All Tests</button>
        <button class="filter-btn" data-filter="P0">P0 Critical</button>
        <button class="filter-btn" data-filter="P1">P1 Standard</button>
        <button class="filter-btn" data-filter="P2">P2 Polish</button>
      </div>
      ` : ''}

      <div class="doc-body" id="docBody">
        ${htmlBody}
      </div>
    </main>
  </div>

  <script>
    // Theme toggle handling
    const themeBtn = document.getElementById('themeToggleBtn');
    function updateThemeBtn(theme) {
      if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? 'Theme: Dark' : 'Theme: Light';
      }
    }
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeBtn(initialTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('sps_doc_theme', next); } catch (e) {}
        updateThemeBtn(next);
      });
    }

    // Real-time Search and Filter
    const searchBox = document.getElementById('searchBox');
    const docBody = document.getElementById('docBody');

    if (searchBox) {
      searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = docBody.querySelectorAll('tr');
        const sections = docBody.querySelectorAll('.doc-h3, .doc-h2');

        if (!query) {
          rows.forEach(r => r.style.display = '');
          return;
        }

        rows.forEach(r => {
          const text = r.textContent.toLowerCase();
          r.style.display = text.includes(query) ? '' : 'none';
        });
      });

      // Shortcut: Ctrl+K or Cmd+K
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchBox.focus();
        }
      });
    }

    // Priority filter (for test-cases)
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const rows = docBody.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (filter === 'all') {
            row.style.display = '';
          } else {
            const hasBadge = row.querySelector('.badge-' + filter.toLowerCase());
            row.style.display = hasBadge ? '' : 'none';
          }
        });
      });
    });

    // Active TOC link highlighting on scroll
    const tocLinks = document.querySelectorAll('.toc-link');
    const headings = Array.from(document.querySelectorAll('.doc-h2, .doc-h3'));

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollPos) {
          currentId = headings[i].id;
          break;
        }
      }

      tocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === currentId);
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(outFile, html, 'utf8');
  const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
  console.log(`  [OK] Generated: ${outFile} (${sizeKb} KB)`);
}

function buildAllDocs() {
  console.log('\n======================================================');
  console.log('Building Documentation HTML Files...');
  console.log('======================================================');

  const faqMd = fs.existsSync(path.join(ROOT_DIR, 'docs', 'AGENCY_MARKETING_FAQ.md'))
    ? path.join(ROOT_DIR, 'docs', 'AGENCY_MARKETING_FAQ.md')
    : path.join(ROOT_DIR, 'AGENCY_MARKETING_FAQ.md');

  const testCasesMd = fs.existsSync(path.join(ROOT_DIR, 'docs', 'TEST_CASES.md'))
    ? path.join(ROOT_DIR, 'docs', 'TEST_CASES.md')
    : path.join(ROOT_DIR, 'TEST_CASES.md');

  // 1. Marketing & Agency FAQ (English)
  buildDocHtml({
    title: 'Store Preview Studio — Agency & Marketing App Store Guide',
    subtitle: 'App Store Connect & Google Play release rules, character limits, asset specs & handoff workflows.',
    badge: 'Marketing & ASO Guide',
    mdFile: faqMd,
    outFile: path.join(ROOT_DIR, 'package', 'AGENCY_MARKETING_FAQ.html'),
    docType: 'faq'
  });

  // 2. Comprehensive Test Cases (English)
  buildDocHtml({
    title: 'Store Preview Studio — Comprehensive Test Case Specification',
    subtitle: '19 Quality Assurance Modules, automated regression suites, validation checks & delivery verification.',
    badge: 'QA & Testing Spec',
    mdFile: testCasesMd,
    outFile: path.join(ROOT_DIR, 'package', 'TEST_CASES.html'),
    docType: 'test-cases'
  });

  console.log('Documentation HTML build complete.\n');
}

if (require.main === module) {
  buildAllDocs();
}

module.exports = { buildAllDocs };
