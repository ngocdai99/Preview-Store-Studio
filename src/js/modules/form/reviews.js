// Store Preview Studio · Review Cards Dynamic Rendering (Mockups)
function renderReviews(){
  const esc = (typeof escapeHtml === 'function') ? escapeHtml : (s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
  const list = Array.isArray(REVIEWS) ? REVIEWS : [];

  const html = list.map((rev, idx) => {
    const starsCount = Math.max(1, Math.min(5, rev.stars || 5));
    const starsStr = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
    const author = rev.author || 'Anonymous';
    const initial = rev.avatar || (author.trim().charAt(0).toUpperCase() || 'U');
    const bg = rev.avatarBg || '#0b57d0';
    const date = rev.date || (typeof getCurrentMonthDateStr === 'function' ? getCurrentMonthDateStr(idx === 0 ? 4 : 11, true) : 'Current Date');
    const helpfulText = (typeof rev.helpful === 'number')
      ? `${rev.helpful} people found this review helpful`
      : (rev.helpful ? `${esc(rev.helpful)} found this helpful` : '');

    return `<div class="g-rev-card">
  <div class="g-rev-head">
    <span class="g-rev-avatar" style="background:${esc(bg)}">${esc(initial)}</span>
    <span class="g-rev-author">${esc(author)}</span>
    <span class="g-rev-more"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg></span>
  </div>
  <div class="g-rev-stars">${starsStr} <span class="g-rev-date">${esc(date)}</span></div>
  <div class="g-rev-body">${esc(rev.text || '')}</div>
  ${helpfulText ? `<div class="g-rev-helpful">${helpfulText}</div>` : ''}
  <div class="g-rev-actions">Did you find this helpful? <button type="button" class="g-chip-btn">Yes</button> <button type="button" class="g-chip-btn">No</button></div>
</div>`;
  }).join('');

  $$('[data-google-reviews]').forEach(container => {
    container.innerHTML = html;
  });

  const appleHtml = list.map((rev, idx) => {
    const starsCount = Math.max(1, Math.min(5, rev.stars || 5));
    const starsStr = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
    const author = rev.author || 'Anonymous';
    let date = rev.date;
    if (date && date.includes(',')) {
      date = date.split(',')[0].trim();
    } else if (!date && typeof getCurrentMonthDateStr === 'function') {
      date = getCurrentMonthDateStr(idx === 0 ? 4 : 11, false);
    }
    date = date || 'Recent';
    const title = rev.title || (rev.text ? rev.text.slice(0, 32) + (rev.text.length > 32 ? '...' : '') : 'Great app!');
    return `<div class="a-rev-card">
  <div class="a-rev-top">
    <span class="a-rev-title">${esc(title)}</span>
    <span class="a-rev-date">${esc(date)}</span>
  </div>
  <div class="a-rev-meta">
    <span class="a-rev-stars">${starsStr}</span>
    <span class="a-rev-author">${esc(author)}</span>
  </div>
  <div class="a-rev-body">${esc(rev.text || '')}</div>
</div>`;
  }).join('');

  $$('[data-apple-reviews]').forEach(container => {
    container.innerHTML = appleHtml;
  });
}
