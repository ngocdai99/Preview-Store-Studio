// Store Preview Studio · App Privacy & Data Safety Dynamic Rendering
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
