// Store Preview Studio · Form Synchronization & Validation
// --- Category dropdowns (App Store vs Google Play) ---
const APPLE_CATEGORIES = ['Books','Business','Developer Tools','Education','Entertainment','Finance','Food & Drink','Games','Graphics & Design','Health & Fitness','Lifestyle','Magazines & Newspapers','Medical','Music','Navigation','News','Photo & Video','Productivity','Reference','Shopping','Social Networking','Sports','Stickers','Travel','Utilities','Weather'];
const GOOGLE_APP_CATEGORIES = ['Art & Design','Auto & Vehicles','Beauty','Books & Reference','Business','Comics','Communication','Dating','Education','Entertainment','Events','Finance','Food & Drink','Health & Fitness','House & Home','Lifestyle','Maps & Navigation','Medical','Music & Audio','News & Magazines','Parenting','Personalization','Photography','Productivity','Shopping','Social','Sports','Tools','Travel & Local','Video Players & Editors','Weather'];
const GOOGLE_GAME_CATEGORIES = ['Action','Adventure','Arcade','Board','Card','Casino','Casual','Educational','Music','Puzzle','Racing','Role Playing','Simulation','Sports','Strategy','Trivia','Word'];
const CAT_ALIASES = {
  apple:  {'social':'Social Networking','photography':'Photo & Video','video players and editors':'Photo & Video','tools':'Utilities','maps and navigation':'Navigation','news and magazines':'News','music and audio':'Music','books and reference':'Books','art and design':'Graphics & Design','travel and local':'Travel','health and fitness':'Health & Fitness'},
  google: {'social networking':'Social','photo and video':'Photography','utilities':'Tools','navigation':'Maps & Navigation','news':'News & Magazines','magazines and newspapers':'News & Magazines','music':'Music & Audio','books':'Books & Reference','reference':'Books & Reference','graphics and design':'Art & Design','developer tools':'Tools','travel':'Travel & Local'}
};
const CAT = {apple:'', google:''};
const CAT_SEL = {apple: $('f-cat-apple'), google: $('f-cat-google')};
const catNorm = v => (v||'').toLowerCase().replace(/&/g,'and').replace(/\s+/g,' ').trim();

(function buildCategorySelects(){
  const opt = (v, t) => { const o = document.createElement('option'); o.value = v; o.textContent = t || v; return o; };
  const a = CAT_SEL.apple, g = CAT_SEL.google;
  a.appendChild(opt('', 'Select primary category…'));
  APPLE_CATEGORIES.forEach(c => a.appendChild(opt(c)));
  g.appendChild(opt('', 'Select category…'));
  [['Apps', GOOGLE_APP_CATEGORIES], ['Games', GOOGLE_GAME_CATEGORIES]].forEach(([label, list]) => {
    const og = document.createElement('optgroup'); og.label = label;
    list.forEach(c => og.appendChild(opt(label === 'Games' ? 'Games · ' + c : c, c)));
    g.appendChild(og);
  });
})();

function matchCat(st, val){
  const n = catNorm(val);
  if(!n) return '';
  const list = st === 'apple' ? APPLE_CATEGORIES : GOOGLE_APP_CATEGORIES.concat(GOOGLE_GAME_CATEGORIES.map(c => 'Games · ' + c));
  const hit = list.find(c => catNorm(c) === n);
  if(hit) return hit;
  const al = CAT_ALIASES[st][n];
  if(al) return al;
  if(st === 'apple'){
    if(n.startsWith('games · ') || GOOGLE_GAME_CATEGORIES.some(c => catNorm(c) === n)) return 'Games';
  } else {
    if(n === 'games') return 'Games · Action';
    const gHit = GOOGLE_GAME_CATEGORIES.find(c => catNorm(c) === n);
    if(gHit) return 'Games · ' + gHit;
  }
  return '';
}
function syncCategoryUI(){
  $('f-cat').value = (CAT[store] || '').replace(/^Games · /, '');
  const t = $('catTag');
  if(t){ t.textContent = store === 'apple' ? 'APPLE' : 'GOOGLE'; t.className = 'tag ' + (store === 'apple' ? 'a' : 'g'); }
}
function setCategory(val, only){
  val = (val || '').trim();
  ['apple','google'].forEach(st => {
    if(only && only !== st) return;
    const sel = CAT_SEL[st];
    sel.querySelectorAll('option[data-custom]').forEach(o => o.remove());
    let m = val ? matchCat(st, val) : '';
    if(val && !m){
      m = val;
      const o = document.createElement('option'); o.value = val; o.textContent = val + ' (custom)'; o.dataset.custom = '1';
      sel.appendChild(o);
    }
    CAT[st] = m;
    sel.value = m;
  });
  syncCategoryUI();
}
['apple','google'].forEach(st => {
  CAT_SEL[st].onchange = () => { CAT[st] = CAT_SEL[st].value; syncCategoryUI(); update(); saveState(); };
});
setCategory('Productivity');

// --- Official Character Limits per Store ---
const LIMITS = {
  name: ()=>30,
  sub: ()=>30,
  promo: ()=>170,
  short: ()=>80,
  keywords: ()=>100,
  new: ()=>store==='google'?500:4000,
  desc: ()=>4000
};

// Initialize progress meters under each field
$$('.fg').forEach(g=>{
  if(g.querySelector('.cc')){
    const m=document.createElement('div');
    m.className='meter';
    m.innerHTML='<i></i>';
    g.appendChild(m);
  }
});



function update(){
  // Update Fields with character limits
  for(const k in LIMITS){
    const inp = $('f-'+k);
    if(!inp) continue;
    const v = inp.value;
    const max = LIMITS[k]();
    const c = $('c-'+k);
    const fg = inp.closest('.fg');
    const mt = fg ? fg.querySelector('.meter') : null;

    if(c){
      const vLen = countChars(v);
      c.textContent = vLen + ' / ' + max;
      const isExceeded = vLen > max;
      const isWarning = !isExceeded && vLen >= max * 0.9;

      c.className = 'cc' + (isExceeded ? ' err' : isWarning ? ' warn' : '');
      if(fg){
        fg.classList.toggle('overlimit', isExceeded);
        fg.classList.toggle('warning', isWarning);
      }
      if(mt){
        mt.className = 'meter' + (isExceeded ? ' err' : isWarning ? ' warn' : '');
        mt.firstChild.style.width = Math.min(100, (vLen / max) * 100) + '%';
      }
    }

    // Synchronize to Mockup Displays
    $$('[data-b="'+k+'"]').forEach(e => {
      const fallback = k==='name' ? 'App Name' : (k==='sub' ? 'App Subtitle' : (k==='short' ? 'Short description...' : (k==='desc' ? 'App description goes here...' : (k==='new' ? 'Release notes...' : ''))));
      e.textContent = v || fallback;
    });
  }

  // Developer, Category, Version, Release Date, Support Email & Location dynamic bindings
  const devVal = $('f-dev').value.trim() || 'Developer Name';
  const catVal = $('f-cat').value.trim() || 'Category';
  const verVal = ($('f-ver') && $('f-ver').value.trim()) || '1.0.0';
  const rdateVal = ($('f-rdate') && $('f-rdate').value.trim()) || getCurrentMonthDateStr(2, true);
  const emailVal = ($('f-email') && $('f-email').value.trim()) || 'support@domain.com';
  const phoneVal = ($('f-phone') && $('f-phone').value.trim()) || '+1 800-555-0199';
  const addrVal = ($('f-addr') && $('f-addr').value.trim()) || 'Vietnam';
  $$('[data-b="dev"]').forEach(e=>e.textContent=devVal);
  $$('[data-b="cat"]').forEach(e=>e.textContent=catVal);
  $$('[data-b="ver"]').forEach(e=>e.textContent=verVal);
  $$('[data-b="rdate"]').forEach(e=>e.textContent=rdateVal);
  $$('[data-b="email"]').forEach(e=>e.textContent=emailVal);
  $$('[data-b="phone"]').forEach(e=>e.textContent=phoneVal);
  $$('[data-b="addr"]').forEach(e=>e.textContent=addrVal);

  if (typeof updateMockupClocks === 'function') updateMockupClocks();

  // Toggle Promotional Text banner in Apple Detail (both iPhone and iPad)
  const hasPromo = !!$('f-promo').value.trim();
  if($('promoBox')) $('promoBox').style.display = hasPromo ? 'block' : 'none';
  $$('.promo[data-b="promo"]').forEach(el => { el.style.display = hasPromo ? 'block' : 'none'; });

  // Dynamic Google Play Keyword Chips (derived from first 2 comma-separated keywords)
  const kwRaw = ($('f-keywords') && $('f-keywords').value) || '';
  const kwList = kwRaw.split(',').map(s => s.trim()).filter(Boolean).map(w => {
    return w.split(/\s+/).map(part => {
      if(/^(ai|rpg|hiit|pvp|ar|vr|3d|hd|ui|ux|ios|api|sql)$/i.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(' ');
  });
  $$('[data-kw-chip]').forEach(el => {
    const idx = parseInt(el.dataset.kwChip, 10) || 0;
    const val = kwList[idx] || '';
    el.textContent = val;
    el.style.display = val ? '' : 'none';
  });

  // Render App Privacy & Data Safety
  renderPrivacy();
  renderReviews();
}

// --- App Privacy & Data Safety Dynamic Rendering ---
const APPLE_PRIV_ICONS = {
  purchase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  health: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.2 8.8c0 2.3-4.2 5-4.2 5s-4.2-2.7-4.2-5c0-1.3 1-2.3 2.2-2.3.8 0 1.6.4 2 1.1.4-.7 1.2-1.1 2-1.1 1.2 0 2.2 1 2.2 2.3z"/></svg>`,
  contact: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14.5h-2v-6h2v6zm0-8h-2V6.5h2V8.5z"/></svg>`,
  content: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="15" height="13" rx="2"></rect><path d="M4 16V6a2 2 0 0 1 2-2h11"></path><circle cx="10.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle><path d="M7 18l3.5-3.5 2.5 2.5 3.5-4 3.5 5"></path></svg>`,
  ident: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM8.5 8.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm3.5 7.5H5v-.6c0-1.3 2.3-2.1 3.5-2.1s3.5.8 3.5 2.1v.6zm7-1.5h-5v-1.5h5v1.5zm0-3h-5V10h5v1.5z"/></svg>`,
  usage: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="12" width="3.8" height="8" rx="1.2"></rect><rect x="10.1" y="8" width="3.8" height="12" rx="1.2"></rect><rect x="16.2" y="4" width="3.8" height="16" rx="1.2"></rect></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 10.5l7.5 3L13.5 21 21 3z"/></svg>`,
  diag: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13c.04-.3.06-.6.06-1s-.02-.7-.06-1l2.1-1.6c.2-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.5 1a7.3 7.3 0 0 0-1.7-1l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.63.25-1.2.59-1.7 1l-2.5-1a.5.5 0 0 0-.6.22l-2 3.46c-.12.22-.08.49.12.64L4.56 11c-.04.3-.06.6-.06 1s.02.7.06 1l-2.1 1.6c-.2.15-.24.42-.12.64l2 3.46c.12.22.39.3.6.22l2.5-1c.5.41 1.07.75 1.7 1l.38 2.65c.05.24.25.42.49.42h4c.24 0 .44-.18.49-.42l.38-2.65c.63-.25 1.2-.59 1.7-1l2.5 1c.21.08.48 0 .6-.22l2-3.46c.12-.22.08-.49-.12-.64L19.4 13zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
};

function getApplePrivIcon(text){
  const t = text.toLowerCase();
  if(/purchase|buy|payment|gear|shop/.test(t)) return APPLE_PRIV_ICONS.purchase;
  if(/health|fitness|pulse|workout|cardio|sleep/.test(t)) return APPLE_PRIV_ICONS.health;
  if(/contact|email|phone|name|address/.test(t)) return APPLE_PRIV_ICONS.contact;
  if(/content|photo|audio|video|save|user content|file/.test(t)) return APPLE_PRIV_ICONS.content;
  if(/ident|account|player|id\b|profile/.test(t)) return APPLE_PRIV_ICONS.ident;
  if(/usage|stat|gameplay|analytics|metric/.test(t)) return APPLE_PRIV_ICONS.usage;
  if(/locat|gps|region|city|coord/.test(t)) return APPLE_PRIV_ICONS.location;
  if(/diag|crash|perf|log|bug|speed|fps/.test(t)) return APPLE_PRIV_ICONS.diag;
  return APPLE_PRIV_ICONS.default;
}

const GOOGLE_SAFETY_ICONS = {
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.8"></circle><circle cx="6" cy="12" r="2.8"></circle><circle cx="18" cy="19" r="2.8"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  collect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><polyline points="8.5 12.5 12 9 15.5 12.5"></polyline><line x1="12" y1="9" x2="12" y2="17"></line></svg>`,
  encrypt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="11" width="17" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="12" cy="16" r="1.2" fill="currentColor"></circle><line x1="12" y1="17.2" x2="12" y2="19"></line></svg>`,
  delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"></path><line x1="4" y1="6" x2="20" y2="6"></line><path d="M5.5 6l.9 13a2 2 0 0 0 2 2h7.2a2 2 0 0 0 2-2l.9-13"></path><line x1="10" y1="10" x2="10" y2="17"></line><line x1="14" y1="10" x2="14" y2="17"></line></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"></path></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>`
};

function getGoogleSafetyIcon(text){
  const t = text.toLowerCase();
  if(/share|third part|chia sẻ/.test(t)) return GOOGLE_SAFETY_ICONS.share;
  if(/collect|thu thập/.test(t)) return GOOGLE_SAFETY_ICONS.collect;
  if(/encrypt|transit|security|ssl|mã hóa/.test(t)) return GOOGLE_SAFETY_ICONS.encrypt;
  if(/delet|remove|xoá|xóa/.test(t)) return GOOGLE_SAFETY_ICONS.delete;
  if(/famil|child|kid|trẻ em|gia đình/.test(t)) return GOOGLE_SAFETY_ICONS.family;
  return GOOGLE_SAFETY_ICONS.default;
}

function parsePrivItems(str){
  if(!str) return [];
  return str.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
}

function renderPrivacy(){
  const esc = (typeof escapeHtml === 'function') ? escapeHtml : (s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
  const privState = (typeof CURRENT_PRIVACY !== 'undefined') ? CURRENT_PRIVACY : { linked: '', notLinked: '', google: '' };
  const linkedStr = ($('f-priv-linked') && $('f-priv-linked').value !== undefined) ? $('f-priv-linked').value : (privState.linked || '');
  const notLinkedStr = ($('f-priv-notlinked') && $('f-priv-notlinked').value !== undefined) ? $('f-priv-notlinked').value : (privState.notLinked || '');
  const googleStr = ($('f-priv-google') && $('f-priv-google').value !== undefined) ? $('f-priv-google').value : (privState.google || '');

  const linkedItems = parsePrivItems(linkedStr);
  const notLinkedItems = parsePrivItems(notLinkedStr);
  const googleItems = parsePrivItems(googleStr);

  // Render Apple Privacy Section (Single "Data Not Collected" card or multi-category cards)
  $$('[data-apple-priv-wrap]').forEach(wrap => {
    if(linkedItems.length === 0 && notLinkedItems.length === 0){
      wrap.innerHTML = `
        <div class="pc pc-single">
          <div class="pc-top-ico pc-check-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9.5"></circle>
              <polyline points="8.5 12.2 11 14.7 15.5 9.5"></polyline>
            </svg>
          </div>
          <h4>Data Not Collected</h4>
          <p class="pc-desc">The developer does not collect any data from this app.</p>
        </div>`;
    } else {
      let cardsHtml = '';
      if(linkedItems.length > 0){
        cardsHtml += `
          <div class="pc">
            <div class="pc-top-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><circle cx="12" cy="9.5" r="3" fill="currentColor" stroke="none"></circle><path d="M6.8 18.2c1.2-2.1 3.1-3.2 5.2-3.2s4 1.1 5.2 3.2" fill="currentColor" stroke="none"></path></svg>
            </div>
            <h4>Data Linked to You</h4>
            <small class="pc-desc">The following data may be collected and linked to your identity:</small>
            <div class="pc-list">${linkedItems.map(item => `<p><span class="pc-ico">${getApplePrivIcon(item)}</span>${esc(item)}</p>`).join('')}</div>
          </div>`;
      }
      if(notLinkedItems.length > 0){
        cardsHtml += `
          <div class="pc">
            <div class="pc-top-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><circle cx="12" cy="9.5" r="3" fill="currentColor" stroke="none"></circle><path d="M6.8 18.2c1.2-2.1 3.1-3.2 5.2-3.2s4 1.1 5.2 3.2" fill="currentColor" stroke="none"></path><line x1="5.2" y1="5.2" x2="18.8" y2="18.8" stroke-width="2"></line></svg>
            </div>
            <h4>Data Not Linked to You</h4>
            <small class="pc-desc">The following data may be collected but is not linked to your identity:</small>
            <div class="pc-list">${notLinkedItems.map(item => `<p><span class="pc-ico">${getApplePrivIcon(item)}</span>${esc(item)}</p>`).join('')}</div>
          </div>`;
      }
      wrap.innerHTML = cardsHtml;
    }
  });

  // Render Google Play "Data Safety"
  $$('[data-google-safety]').forEach(container => {
    const rowsHtml = googleItems.map(item => {
      const icon = getGoogleSafetyIcon(item);
      let titleHtml = esc(item);
      let subtitleHtml = '';
      const m = item.match(/^(.*?)\s*\((.*?)\)$/);
      if(m){
        titleHtml = esc(m[1].trim());
        subtitleHtml = esc(m[2].trim());
      } else if(item.toLowerCase().includes('no data shared')) {
        subtitleHtml = '<u>Learn more</u> about how developers declare sharing';
      } else if(item.toLowerCase().includes('no data collected')) {
        subtitleHtml = '<u>Learn more</u> about how developers declare collection';
      }
      return `<div class="safe-row"><div class="safe-head"><span class="safe-ico">${icon}</span><b>${titleHtml}</b></div>${subtitleHtml ? `<p class="safe-sub">${subtitleHtml}</p>` : ''}</div>`;
    }).join('');

    container.innerHTML = rowsHtml + '<span class="safe-more">See details</span>';
  });
}

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

$$('input[type=text],textarea').forEach(e => {
  e.addEventListener('input', () => {
    update();
    debouncedSave();
  });
});

