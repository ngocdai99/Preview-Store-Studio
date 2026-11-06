/* =========================================================================
   Module: src/js/core/utils.js
   ========================================================================= */
// Store Preview Studio · Core Utilities

/* =========================================================================
   STORE PREVIEW STUDIO · CORE ARCHITECTURE & CLIENT-SIDE LOGIC
   ========================================================================= */

const $=id=>document.getElementById(id), $$=s=>[...document.querySelectorAll(s)];
let store = 'apple';
function isM() {
  return typeof window !== 'undefined' ? window.innerWidth <= 980 : false;
}

// --- Reusable Crisp Vector Action Icons ---
const ICO_SPARKLE = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.4 5.4 5.6 2.1-5.6 2.1-2.4 5.4-2.4-5.4-5.6-2.1 5.6-2.1 2.4-5.4zm7.5 12.5l1.2 2.7 2.8 1-2.8 1-1.2 2.8-1.2-2.8-2.8-1 2.8-1 1.2-2.7z"></path></svg></span>`;
const ICO_DL = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>`;
const ICO_UPLOAD = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span>`;
const ICO_INSPECT = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>`;

// --- Dynamic Date & Clock Helpers (Zero Hardcoded Dates or 9:41 Clocks) ---
if (typeof SPS_MONTH_NAMES === 'undefined') {
  var SPS_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
if (typeof getCurrentMonthDateStr === 'undefined') {
  var getCurrentMonthDateStr = function(dayOffset = 0, withYear = true) {
    const now = new Date();
    const year = now.getFullYear();
    const month = SPS_MONTH_NAMES[now.getMonth()];
    const today = now.getDate();
    const day = Math.max(1, today - dayOffset);
    return withYear ? `${month} ${day}, ${year}` : `${month} ${day}`;
  };
}

function getCurrentClockStr(format = 'phone') {
  const now = new Date();
  const h24 = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');

  let is24h = false;
  try {
    const testFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(2026, 0, 1, 23, 0));
    is24h = testFmt.includes('23');
  } catch(e) {
    is24h = false;
  }

  const h12 = h24 % 12 || 12;
  const ampm = h24 >= 12 ? 'PM' : 'AM';

  if (format === 'ipad') {
    return is24h ? `${String(h24).padStart(2, '0')}:${m}` : `${h12}:${m} ${ampm}`;
  }
  if (is24h) {
    return `${String(h24).padStart(2, '0')}:${m}`;
  }
  return `${h12}:${m}`;
}

function updateMockupClocks() {
  const now = new Date();
  const syncedTime = getCurrentClockStr('phone');
  const ipadTime = getCurrentClockStr('ipad');

  // Both iPhone and Android status bars receive the EXACT SAME synchronized time
  $$('.apple-clock, .dev.apple:not(.ipad) .clock, .dev.apple.single .sb .clock, .phone:not(.ipad):not(.google) .clock').forEach(e => {
    e.textContent = syncedTime;
  });

  $$('.google-clock, .dev.google .clock, #dev-phone .clock, #dev-tab7 .clock, #dev-tab10 .clock, .gtab .clock').forEach(e => {
    e.textContent = syncedTime;
  });

  // Apple iPad status bar
  $$('.ipad-clock, .dev.ipad .clock, .phone.ipad .clock, .ipad-sb .clock').forEach(e => {
    e.textContent = ipadTime;
  });

  // iPad status bar date (device current weekday, month, day)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mName = SPS_MONTH_NAMES[now.getMonth()];
  const dateStr = `${dayNames[now.getDay()]} ${mName} ${now.getDate()}`;
  $$('.ipad-sb-date').forEach(e => { e.textContent = dateStr; });

  // Fallback for any other .clock elements
  $$('.clock').forEach(e => {
    e.textContent = syncedTime;
  });
}



// --- File Reader Helper & Storage Protection (8 MB limit matching Google Play to protect IndexedDB) ---
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

function validateUploadFile(file, maxBytes = MAX_UPLOAD_BYTES, label = 'Screenshot') {
  if (!file) return false;
  if (typeof file.size === 'number' && file.size > maxBytes) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    if (typeof showToast === 'function') {
      showToast(`${label} file too large (${mb} MB). Maximum allowed is ${maxMb} MB.`, 'err');
    }
    return false;
  }
  return true;
}

const readFile = (f, cb, maxBytes = MAX_UPLOAD_BYTES) => {
  if (typeof FileReader === 'undefined' || !f) return;
  if (!validateUploadFile(f, maxBytes)) return;
  const r = new FileReader();
  r.onload = () => cb(r.result);
  r.readAsDataURL(f);
};

// --- SVG Data URI Normalizer & Dimension Preserver ---
function decodeSvgDataUri(body, isBase64){
  if(isBase64){
    if(typeof atob === 'function') return atob(body);
    if(typeof Buffer !== 'undefined') return Buffer.from(body, 'base64').toString('utf8');
    return '';
  }
  try {
    return decodeURIComponent(body);
  } catch(e) {
    return unescape(body);
  }
}

function ensureSvgDimensions(uri){
  if(typeof uri !== 'string' || !uri.startsWith('data:image/svg+xml')) return uri;
  try {
    const comma = uri.indexOf(',');
    if(comma < 0) return uri;
    const header = uri.slice(0, comma);
    const body = uri.slice(comma + 1);
    const raw = decodeSvgDataUri(body, /;base64/.test(header));
    if(!raw) return uri;
    if(!/<\s*svg[^>]*\bwidth\s*=/i.test(raw) && !/<\s*svg[^>]*\bheight\s*=/i.test(raw)){
      const vb = raw.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
      if(vb){
        let w = Math.round(parseFloat(vb[1]));
        let h = Math.round(parseFloat(vb[2]));
        if(w === 460 && h === 996){ w = 1290; h = 2796; }
        else if(w === 1024 && h === 500){ w = 1024; h = 500; }
        else if(w === 2048 && h === 2732){ w = 2048; h = 2732; }
        else if(w === 2560 && h === 1600){ w = 2560; h = 1600; }
        const fixed = raw.replace(/<svg\b([^>]*)>/i, `<svg$1 width="${w}" height="${h}">`);
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(fixed.replace(/\s+/g,' '));
      }
    }
  } catch(e){}
  return uri;
}

// --- Anti-Spam Download, Upload & Action Throttling ---
let _lastDownloadTime = 0;
let _lastUploadTime = 0;
let _lastActionTime = 0;

function canDownload(cooldownMs = 1000) {
  const now = Date.now();
  if (now - _lastDownloadTime < cooldownMs) {
    return false;
  }
  _lastDownloadTime = now;
  return true;
}

function canUpload(cooldownMs = 1000) {
  const now = Date.now();
  if (now - _lastUploadTime < cooldownMs) {
    return false;
  }
  _lastUploadTime = now;
  return true;
}

function canAction(cooldownMs = 1000) {
  const now = Date.now();
  if (now - _lastActionTime < cooldownMs) {
    return false;
  }
  _lastActionTime = now;
  return true;
}

// --- Low-RAM Smart Display Thumbnail Cache ---
// Keeps 100% full-resolution 2048x2732 master screenshots intact in storage & exports,
// while creating lightweight downscaled thumbnails (~600px) for in-DOM screen previews to prevent mobile RAM pressure (saving 90%+ RAM).
const THUMB_CACHE = new Map();

function generateDisplayThumbnail(src, maxDim = 600) {
  if (!src || typeof src !== 'string') return Promise.resolve(src);
  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(src);
  }
  if (src.startsWith('data:image/svg+xml') || src.length < 50000 || (typeof PH !== 'undefined' && src === PH)) {
    return Promise.resolve(src);
  }
  if (THUMB_CACHE.has(src)) {
    return Promise.resolve(THUMB_CACHE.get(src));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h || (w <= maxDim && h <= maxDim)) {
          THUMB_CACHE.set(src, src);
          resolve(src);
          return;
        }

        const tw = w >= h ? maxDim : Math.round((w * maxDim) / h);
        const th = w >= h ? Math.round((h * maxDim) / w) : maxDim;

        const canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, tw, th);
          let thumb = canvas.toDataURL('image/webp', 0.85);
          if (!thumb.startsWith('data:image/webp')) {
            thumb = canvas.toDataURL('image/jpeg', 0.85);
          }
          if (THUMB_CACHE.size > 50) {
            const firstKey = THUMB_CACHE.keys().next().value;
            THUMB_CACHE.delete(firstKey);
          }
          THUMB_CACHE.set(src, thumb);
          resolve(thumb);
        } else {
          resolve(src);
        }
      } catch (e) {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

function isLightUi() {
  return typeof document !== 'undefined' && !!document.documentElement && document.documentElement.dataset.ui === 'light';
}

function getDisplaySrc(src, targetImg = null) {
  // If no src or src is empty
  if (!src || typeof src !== 'string') {
    if (targetImg && targetImg.hasAttribute && targetImg.hasAttribute('data-feature')) {
      return isLightUi() ? (typeof BLANK_FEATURE_LIGHT !== 'undefined' ? BLANK_FEATURE_LIGHT : BLANK_FEATURE) : (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    }
    return isLightUi() ? (typeof PH_LIGHT !== 'undefined' ? PH_LIGHT : (typeof PH !== 'undefined' ? PH : '')) : (typeof PH !== 'undefined' ? PH : '');
  }

  // Handle Feature Graphic placeholders (adaptive to Light/Dark mode)
  if (typeof BLANK_FEATURE !== 'undefined' && (src === BLANK_FEATURE || (typeof BLANK_FEATURE_LIGHT !== 'undefined' && src === BLANK_FEATURE_LIGHT))) {
    return isLightUi() ? (typeof BLANK_FEATURE_LIGHT !== 'undefined' ? BLANK_FEATURE_LIGHT : BLANK_FEATURE) : BLANK_FEATURE;
  }

  // Handle Phone Screenshot placeholders
  if (typeof PH !== 'undefined' && (src === PH || (typeof PH_LIGHT !== 'undefined' && src === PH_LIGHT))) {
    return isLightUi() ? (typeof PH_LIGHT !== 'undefined' ? PH_LIGHT : PH) : PH;
  }

  // Handle iPad Screenshot placeholders
  if (typeof PH_IPAD !== 'undefined' && (src === PH_IPAD || (typeof PH_IPAD_LIGHT !== 'undefined' && src === PH_IPAD_LIGHT))) {
    return isLightUi() ? (typeof PH_IPAD_LIGHT !== 'undefined' ? PH_IPAD_LIGHT : PH_IPAD) : PH_IPAD;
  }

  // Handle Android Tablet Screenshot placeholders
  if (typeof PH_TAB !== 'undefined' && (src === PH_TAB || (typeof PH_TAB_LIGHT !== 'undefined' && src === PH_TAB_LIGHT))) {
    return isLightUi() ? (typeof PH_TAB_LIGHT !== 'undefined' ? PH_TAB_LIGHT : PH_TAB) : PH_TAB;
  }

  if (src.startsWith('data:image/svg+xml') || src.length < 50000) {
    return src;
  }
  if (THUMB_CACHE.has(src)) {
    return THUMB_CACHE.get(src);
  }
  if (targetImg) {
    generateDisplayThumbnail(src).then(thumb => {
      if (thumb && thumb !== src && targetImg.src !== thumb) {
        targetImg.src = thumb;
      }
    });
  }
  return src;
}

// --- Safe Image Creation ---
const safe=(img)=>{
  img.referrerPolicy='no-referrer';
  img.onerror=()=>{
    img.onerror=null;
    img.src = isLightUi() ? (typeof PH_LIGHT !== 'undefined' ? PH_LIGHT : (typeof PH !== 'undefined' ? PH : '')) : (typeof PH !== 'undefined' ? PH : '');
  };
};
const mk=(src,alt='')=>{
  const i=new Image();i.alt=alt;safe(i);
  i.onload=()=>{
    if(i.naturalWidth > i.naturalHeight * 1.15){
      i.classList.add('landscape-shot');
    }
  };
  i.src=getDisplaySrc(src, i);
  return i;
};


// --- Accurate Unicode & Emoji Grapheme Counter & Clamper ---
const graphemeSegmenter = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;
function countChars(str){
  if(!str) return 0;
  if(graphemeSegmenter) return [...graphemeSegmenter.segment(str)].length;
  return Array.from(str).length;
}

function clampGraphemes(str, max){
  if(!str || typeof max !== 'number' || max <= 0) return '';
  if(graphemeSegmenter){
    const segs = Array.from(graphemeSegmenter.segment(str));
    if(segs.length <= max) return str;
    return segs.slice(0, max).map(s => s.segment).join('');
  }
  const chars = Array.from(str);
  if(chars.length <= max) return str;
  return chars.slice(0, max).join('');
}


// --- HTML Sanitizer Helper ---
function escapeHtml(str){
  if(str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- File & URL-Safe Slug Generator (Full International Diacritics & Accent Support) ---
/**
 * Normalizes app name or arbitrary text into a clean URL- and filesystem-safe slug.
 * Fully supports international diacritics, accents, and special symbols.
 * 
 * Example:
 *   "TaskFlow - Smart Productivity App" => "taskflow-smart-productivity-app"
 * 
 * @param {string} text - Input text / App name
 * @param {string} [fallback='app'] - Fallback slug if result is empty
 * @returns {string} Sanitized slug
 */
function slugify(text, fallback = 'app') {
  if (!text) return fallback;
  const s = String(text)
    .replace(/[\u0110\u00D0\u0189]/g, 'd')
    .replace(/[\u0111\u00F0\u0256\u0257]/g, 'd');
  const normalized = s.normalize ? s.normalize('NFD') : s;
  const str = normalized
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return str || fallback;
}

// --- Toast System ---
function showToast(msg, icon='', duration=3200){
  const c = $('toastContainer');
  if(!c) return;
  const t = document.createElement('div');
  const isErr = icon === 'err' || icon === 'warn' || icon === 'error';
  t.className = isErr ? 'toast error' : 'toast success';
  const iconHtml = (icon && icon !== 'ok' && icon !== 'err' && icon !== 'warn' && icon !== 'error')
    ? `<i>${escapeHtml(icon)}</i>`
    : '';
  t.innerHTML = `${iconHtml}<span>${escapeHtml(msg)}</span>`;
  c.appendChild(t);
  setTimeout(()=>{
    t.style.opacity='0';
    t.style.transform='translateY(10px) scale(0.95)';
    t.style.transition='.25s cubic-bezier(.4,0,.2,1)';
    setTimeout(()=>t.remove(),250);
  }, duration);
}

// --- Menu Dropdown Helpers ---
function setupDropdown(btnId, menuId){
  const btn=$(btnId), menu=$(menuId);
  if (!btn || !menu) return;
  btn.onclick=(e)=>{
    e.stopPropagation();
    $$('.menu').forEach(m=>{if(m!==menu)m.classList.remove('show')});
    menu.classList.toggle('show');
  };
}
if ($('btnPresets')) setupDropdown('btnPresets','menuPresets');
setupDropdown('btnExport','menuExport');
document.addEventListener('click',()=>$$('.menu').forEach(m=>m.classList.remove('show')));

// --- Reusable Info Popover Controller (Fixed positioning, floats over canvas, auto-closes on collapse) ---
function initInfoPopover(btnId, popId, closeId, allowedStore = null) {
  const btn = $(btnId);
  const pop = $(popId);
  const close = $(closeId);
  if (!btn || !pop) return;

  let popoverCloseTimeout = null;
  let isPinned = false;

  function updatePosition() {
    if (!btn || !pop) return;
    if (!pop.classList.contains("open")) return;
    if (document.body.classList.contains("sidebar-collapsed")) {
      hide(true);
      return;
    }
    if (allowedStore && document.body.dataset.store !== allowedStore) {
      hide(true);
      return;
    }

    const rect = btn.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || rect.bottom < 40 || rect.top > window.innerHeight - 40) {
      hide(true);
      return;
    }

    const popW = 360;
    const btnCenterY = rect.top + rect.height / 2;

    let left = rect.right + 12;
    let isFlipLeft = false;

    if (left + popW > window.innerWidth - 14) {
      left = rect.left - popW - 12;
      isFlipLeft = true;
      if (left < 14) {
        left = Math.max(14, window.innerWidth - popW - 14);
        isFlipLeft = false;
      }
    }

    let top = rect.top - 18;
    const popH = pop.offsetHeight || 320;
    if (top + popH > window.innerHeight - 16) {
      top = Math.max(16, window.innerHeight - popH - 16);
    }
    if (top < 16) top = 16;

    const arrowTop = Math.max(18, Math.min(popH - 18, btnCenterY - top));

    pop.style.top = Math.round(top) + "px";
    pop.style.left = Math.round(left) + "px";
    pop.style.setProperty("--pop-arrow-top", Math.round(arrowTop) + "px");
    pop.classList.toggle("flip-left", isFlipLeft);
  }

  function show(pinned = false) {
    if (!btn || !pop) return;
    if (document.body.classList.contains("sidebar-collapsed")) return;
    if (allowedStore && document.body.dataset.store !== allowedStore) return;

    if (popoverCloseTimeout) {
      clearTimeout(popoverCloseTimeout);
      popoverCloseTimeout = null;
    }

    if (pinned) isPinned = true;
    pop.classList.add("open");
    pop.setAttribute("aria-hidden", "false");
    btn.classList.add("active");
    updatePosition();
  }

  function hide(immediate = false) {
    if (!pop) return;
    if (immediate) {
      if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
      isPinned = false;
      pop.classList.remove("open");
      pop.setAttribute("aria-hidden", "true");
      btn.classList.remove("active");
      return;
    }

    if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
    popoverCloseTimeout = setTimeout(() => {
      isPinned = false;
      pop.classList.remove("open");
      pop.setAttribute("aria-hidden", "true");
      btn.classList.remove("active");
    }, 120);
  }

  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (pop.classList.contains("open") && isPinned) {
      hide(true);
    } else {
      show(true);
    }
  });

  btn.addEventListener("mouseenter", () => show(false));
  btn.addEventListener("mouseleave", () => {
    if (!isPinned) hide(false);
  });

  pop.addEventListener("mouseenter", () => {
    if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
  });
  pop.addEventListener("mouseleave", () => {
    if (!isPinned) hide(false);
  });

  if (close) {
    close.addEventListener("click", e => {
      e.stopPropagation();
      hide(true);
    });
  }

  document.addEventListener("click", e => {
    if (!pop.contains(e.target) && !btn.contains(e.target)) {
      hide(true);
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && pop.classList.contains("open")) {
      hide(true);
    }
  });

  const editorPanel = $("editorPanel");
  if (editorPanel) {
    editorPanel.addEventListener("scroll", () => {
      if (pop.classList.contains("open")) {
        updatePosition();
      }
    });
  }
  window.addEventListener("resize", () => {
    if (pop.classList.contains("open")) {
      updatePosition();
    }
  });
}

function initSharedPopovers() {
  const pop = $("sharedInfoPop");
  const close = $("sharedInfoClose");
  const titleText = $("sharedInfoTitleText");
  const descEl = $("sharedInfoDesc");
  const footer = $("sharedInfoFooter");
  const linkEl = $("sharedInfoLink");
  if (!pop) return;

  let popoverCloseTimeout = null;
  let activeBtn = null;
  let isPinned = false;

  function updatePosition(btn) {
    if (!btn || !pop || !pop.classList.contains("open")) return;
    if (document.body.classList.contains("sidebar-collapsed")) {
      hide(true);
      return;
    }

    const rect = btn.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || rect.bottom < 40 || rect.top > window.innerHeight - 40) {
      hide(true);
      return;
    }

    const popW = 360;
    const btnCenterY = rect.top + rect.height / 2;

    let left = rect.right + 12;
    let isFlipLeft = false;

    if (left + popW > window.innerWidth - 14) {
      left = rect.left - popW - 12;
      isFlipLeft = true;
      if (left < 14) {
        left = Math.max(14, window.innerWidth - popW - 14);
        isFlipLeft = false;
      }
    }

    let top = rect.top - 18;
    const popH = pop.offsetHeight || 260;
    if (top + popH > window.innerHeight - 16) {
      top = Math.max(16, window.innerHeight - popH - 16);
    }
    if (top < 16) top = 16;

    const arrowTop = Math.max(18, Math.min(popH - 18, btnCenterY - top));

    pop.style.top = Math.round(top) + "px";
    pop.style.left = Math.round(left) + "px";
    pop.style.setProperty("--pop-arrow-top", Math.round(arrowTop) + "px");
    pop.classList.toggle("flip-left", isFlipLeft);
  }

  function show(btn, pinned = false) {
    if (!btn || !pop) return;
    if (document.body.classList.contains("sidebar-collapsed")) return;

    if (popoverCloseTimeout) {
      clearTimeout(popoverCloseTimeout);
      popoverCloseTimeout = null;
    }

    if (activeBtn && activeBtn !== btn) {
      activeBtn.classList.remove("active");
    }
    activeBtn = btn;
    if (pinned) isPinned = true;

    const title = btn.dataset.tipTitle || 'Guidelines';
    if (titleText) titleText.textContent = title;

    const desc = btn.dataset.tipDesc || '';
    if (descEl) descEl.textContent = desc;

    const activeSt = typeof store !== 'undefined' ? store : (document.body.dataset.store || 'apple');
    let url = '';
    if (activeSt === 'apple' && btn.dataset.tipAppleLink) {
      url = btn.dataset.tipAppleLink;
    } else if (activeSt === 'google' && btn.dataset.tipGoogleLink) {
      url = btn.dataset.tipGoogleLink;
    } else if (btn.dataset.tipLink) {
      url = btn.dataset.tipLink;
    } else if (btn.dataset.tipAppleLink) {
      url = btn.dataset.tipAppleLink;
    } else if (btn.dataset.tipGoogleLink) {
      url = btn.dataset.tipGoogleLink;
    }

    if (footer && linkEl) {
      if (url) {
        linkEl.href = url;
        footer.style.display = 'flex';
      } else {
        footer.style.display = 'none';
      }
    }

    pop.classList.add("open");
    pop.setAttribute("aria-hidden", "false");
    btn.classList.add("active");
    updatePosition(btn);
  }

  function hide(immediate = false) {
    if (!pop) return;
    if (immediate) {
      if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
      isPinned = false;
      pop.classList.remove("open");
      pop.setAttribute("aria-hidden", "true");
      if (activeBtn) activeBtn.classList.remove("active");
      activeBtn = null;
      return;
    }

    if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
    popoverCloseTimeout = setTimeout(() => {
      isPinned = false;
      pop.classList.remove("open");
      pop.setAttribute("aria-hidden", "true");
      if (activeBtn) activeBtn.classList.remove("active");
      activeBtn = null;
    }, 120);
  }

  document.addEventListener("click", e => {
    const tipBtn = e.target.closest(".info-tip-btn[data-tip-title]");
    if (tipBtn) {
      e.stopPropagation();
      if (pop.classList.contains("open") && activeBtn === tipBtn && isPinned) {
        hide(true);
      } else {
        show(tipBtn, true);
      }
      return;
    }
    if (pop.classList.contains("open") && !pop.contains(e.target)) {
      hide(true);
    }
  });

  document.addEventListener("mouseover", e => {
    const tipBtn = e.target.closest(".info-tip-btn[data-tip-title]");
    if (tipBtn) {
      show(tipBtn, false);
    }
  });

  document.addEventListener("mouseout", e => {
    const tipBtn = e.target.closest(".info-tip-btn[data-tip-title]");
    if (tipBtn && !isPinned) {
      hide(false);
    }
  });

  pop.addEventListener("mouseenter", () => {
    if (popoverCloseTimeout) clearTimeout(popoverCloseTimeout);
  });
  pop.addEventListener("mouseleave", () => {
    if (!isPinned) hide(false);
  });

  if (close) {
    close.addEventListener("click", e => {
      e.stopPropagation();
      hide(true);
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && pop.classList.contains("open")) {
      hide(true);
    }
  });

  const editor = document.querySelector(".editor");
  if (editor) {
    editor.addEventListener("scroll", () => {
      if (activeBtn && pop.classList.contains("open")) updatePosition(activeBtn);
    }, { passive: true });
  }

  window.addEventListener("resize", () => {
    if (activeBtn && pop.classList.contains("open")) updatePosition(activeBtn);
  });
}

// --- IndexedDB High-Capacity Storage Engine (Virtually unlimited quota for high-res screenshots) ---
const IDB_DB_NAME = 'StorePreviewStudioDB';
const IDB_STORE_NAME = 'keyval';
const IDB_VERSION = 1;
let _appDbPromise = null;

function openAppDB() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (_appDbPromise) return _appDbPromise;
  _appDbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_DB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        db.onversionchange = () => { db.close(); _appDbPromise = null; };
        db.onclose = () => { _appDbPromise = null; };
        resolve(db);
      };
      req.onerror = () => { _appDbPromise = null; resolve(null); };
      req.onblocked = () => { _appDbPromise = null; resolve(null); };
    } catch (e) {
      _appDbPromise = null;
      resolve(null);
    }
  });
  return _appDbPromise;
}

// Name of the last IndexedDB write failure (e.g. 'QuotaExceededError'), for diagnostics.
let idbLastErrorName = '';

// Resolves true ONLY after the transaction has fully committed. IndexedDB reports
// QuotaExceededError at commit time (tx.onabort), AFTER req.onsuccess has already fired,
// so resolving on req.onsuccess would report a failed write as a success.
function idbSave(key, val) {
  if (typeof indexedDB === 'undefined') return Promise.resolve(false);
  return openAppDB().then(db => {
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.put(val, key);
        req.onerror = () => resolve(false);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => {
          idbLastErrorName = (tx.error && tx.error.name) || 'AbortError';
          resolve(false);
        };
      } catch (e) {
        idbLastErrorName = (e && e.name) || 'Error';
        resolve(false);
      }
    });
  }).catch(() => false);
}

function idbGet(key) {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return openAppDB().then(db => {
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE_NAME, 'readonly');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }).catch(() => null);
}

function idbDelete(key) {
  if (typeof indexedDB === 'undefined') return Promise.resolve(false);
  return openAppDB().then(db => {
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.delete(key);
        req.onerror = () => resolve(false);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }).catch(() => false);
}

// --- SVG to Store-Compliant PNG Rasterizer ---
const SVG_STORE_PNG_CACHE = new Map();

function rasterizeSvgToDimensions(svgSrc, width, height, callback) {
  if (!svgSrc || typeof svgSrc !== 'string') {
    if (callback) callback(svgSrc);
    return;
  }
  // If already a raster PNG/JPEG data URL or regular URL, pass through
  if (!svgSrc.startsWith('data:image/svg+xml') && !svgSrc.includes('<svg')) {
    if (callback) callback(svgSrc);
    return;
  }

  const cacheKey = `${width}x${height}_${svgSrc.length}_${svgSrc.slice(0, 80)}`;
  if (SVG_STORE_PNG_CACHE.has(cacheKey)) {
    if (callback) callback(SVG_STORE_PNG_CACHE.get(cacheKey));
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw SVG scaled to target resolution
      ctx.drawImage(img, 0, 0, width, height);

      // Check for transparency across pixels
      const data = ctx.getImageData(0, 0, width, height).data;
      let hasAlpha = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) { hasAlpha = true; break; }
      }

      let finalPng = '';
      if (hasAlpha) {
        // Flood background with opaque base color sampled from top edge or center
        const solidCanvas = document.createElement('canvas');
        solidCanvas.width = width;
        solidCanvas.height = height;
        const sCtx = solidCanvas.getContext('2d');
        const topEdgeIdx = (Math.floor(height * 0.05) * width + Math.floor(width / 2)) * 4;
        const midIdx = (Math.floor(height / 2) * width + Math.floor(width / 2)) * 4;
        const r = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx] : (data[midIdx + 3] > 240 ? data[midIdx] : 255);
        const g = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 1] : (data[midIdx + 3] > 240 ? data[midIdx + 1] : 255);
        const b = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 2] : (data[midIdx + 3] > 240 ? data[midIdx + 2] : 255);
        sCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        sCtx.fillRect(0, 0, width, height);
        sCtx.drawImage(canvas, 0, 0);
        finalPng = solidCanvas.toDataURL('image/png');
      } else {
        finalPng = canvas.toDataURL('image/png');
      }

      SVG_STORE_PNG_CACHE.set(cacheKey, finalPng);
      if (callback) callback(finalPng);
    } catch (e) {
      if (callback) callback(svgSrc);
    }
  };
  img.onerror = () => {
    if (callback) callback(svgSrc);
  };
  img.src = svgSrc;
}

function rasterizeSvgToStorePng(svgSrc, targetSize, callback) {
  return rasterizeSvgToDimensions(svgSrc, targetSize, targetSize, callback);
}

/**
 * Modern Reset and Confirmation Modal
 * Replaces native browser confirm dialog with custom modal popup.
 *
 * @param {Function} onConfirm - Callback executed when user confirms reset
 * @param {string} [customTitle] - Custom title
 * @param {string} [customDesc] - Custom description
 * @param {string} [customOkLabel] - Custom confirm button label
 * @param {Function} [onBackup] - Optional callback to export backup without closing dialog
 */
function showResetConfirmModal(onConfirm, customTitle, customDesc, customOkLabel, onBackup) {
  const modal = $('resetConfirmModal');
  if (!modal) {
    if (typeof onConfirm === 'function') onConfirm();
    return;
  }

  const titleEl = modal.querySelector('#resetConfirmTitle');
  const descEl = modal.querySelector('.confirm-modal-desc');
  const okBtn = modal.querySelector('#resetConfirmOk');
  const cancelBtn = modal.querySelector('#resetConfirmCancel');
  const closeBtn = modal.querySelector('#resetConfirmClose');
  const backupBtn = modal.querySelector('#resetConfirmBackup');

  const defaultTitle = 'Reset App Draft?';
  const defaultDesc = 'This will clear your customized app icon, name, and descriptions. Your current draft cannot be recovered.';
  const defaultOkLabel = 'Reset';

  if (titleEl) titleEl.textContent = customTitle || defaultTitle;
  if (descEl) descEl.textContent = customDesc || defaultDesc;
  if (okBtn) okBtn.textContent = customOkLabel || defaultOkLabel;

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKey);
    if (titleEl) titleEl.textContent = defaultTitle;
    if (descEl) descEl.textContent = defaultDesc;
    if (okBtn) okBtn.textContent = defaultOkLabel;
    if (backupBtn) {
      backupBtn.style.display = 'none';
      backupBtn.classList.remove('backed-up');
      const labelEl = backupBtn.querySelector('.confirm-btn-backup-label');
      if (labelEl) labelEl.textContent = 'Backup JSON';
      backupBtn.onclick = null;
    }
  }

  function handleKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  if (cancelBtn) cancelBtn.onclick = closeModal;
  if (closeBtn) closeBtn.onclick = closeModal;

  modal.onclick = e => {
    if (e.target === modal) closeModal();
  };

  if (okBtn) {
    okBtn.onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  if (backupBtn) {
    if (typeof onBackup === 'function') {
      backupBtn.style.display = 'inline-flex';
      const labelEl = backupBtn.querySelector('.confirm-btn-backup-label');
      const origText = labelEl ? labelEl.textContent : 'Backup JSON';
      backupBtn.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        try {
          onBackup();
        } catch (err) {
          console.error('[Backup Modal] Export error:', err);
        }
        backupBtn.classList.add('backed-up');
        if (labelEl) labelEl.textContent = 'Backed Up!';
        setTimeout(() => {
          backupBtn.classList.remove('backed-up');
          if (labelEl) labelEl.textContent = origText;
        }, 2200);
      };
    } else {
      backupBtn.style.display = 'none';
      backupBtn.onclick = null;
    }
  }

  document.addEventListener('keydown', handleKey);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  if (cancelBtn) cancelBtn.focus();
}



/* =========================================================================
   Module: src/js/core/state.js
   ========================================================================= */
// Store Preview Studio · Constants & Active State
// --- Dynamic Date Helpers for Current Month & Year (Zero Hardcoded Dates) ---
if (typeof SPS_MONTH_NAMES === 'undefined') {
  var SPS_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
function getCurrentMonthDateStr(dayOffset = 0, withYear = true) {
  const now = new Date();
  const year = now.getFullYear();
  const month = SPS_MONTH_NAMES[now.getMonth()];
  const today = now.getDate();
  const day = Math.max(1, today - dayOffset);
  return withYear ? `${month} ${day}, ${year}` : `${month} ${day}`;
}

// --- Illustrative stats (rating / chart / downloads / age / IAP shown in mockups) ---
const STATS_DEFAULT = {rating:'4.9', count:'1.8K', rank:'1', dl:'50K+', size:'86 MB', age:'4+', iap:'iap'};
const STATS = {...STATS_DEFAULT};
let STATS_OFF = false;   // hide all illustrative numbers in the mockups
let EXPORT_WM = false;   // illustrative mockup watermark note (disabled by default)
const STAT_INPUTS = {rating:'f-st-rating', count:'f-st-count', rank:'f-st-rank', dl:'f-st-dl', size:'f-st-size', age:'f-st-age', iap:'f-st-iap'};

const GOOGLE_AGE_MAP = {
  '4+':  {badge:'E',    label:'Everyone'},
  '9+':  {badge:'E10+', label:'Everyone 10+'},
  '12+': {badge:'T',    label:'Teen · 12+'},
  '17+': {badge:'M',    label:'Mature 17+'},
  '18+': {badge:'18+',  label:'Adults Only 18+'}
};

function renderStats(){
  $$('[data-stat]').forEach(e => { e.textContent = STATS[e.dataset.stat] || ''; });
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || { badge: ageVal, label: 'Rated for ' + ageVal };
  $$('[data-age-apple]').forEach(e => { e.textContent = ageVal; });
  $$('[data-age-google-badge]').forEach(e => { e.textContent = gAge.badge; });
  $$('[data-age-google-lbl]').forEach(e => { e.textContent = gAge.label; });

  const hasRating = !!(STATS.rating && STATS.rating.trim() && STATS.rating.trim() !== '0');
  $$('[data-gmet-rating]').forEach(e => { e.style.display = hasRating ? '' : 'none'; });
  $$('.dev:not(.gtab7) [data-gmet-size]').forEach(e => { e.style.display = hasRating ? 'none' : ''; });
  $$('.dev.gtab7 [data-gmet-size]').forEach(e => { e.style.display = 'flex'; });

  const iapVal = STATS.iap || 'iap';
  const hasIap = (iapVal === 'iap' || iapVal === 'ads_iap');
  $$('[data-iap-apple]').forEach(e => { e.style.display = hasIap ? '' : 'none'; });
  $$('[data-iap-yesno]').forEach(e => { e.textContent = hasIap ? 'Yes' : 'No'; });
  const gMetaMap = {
    iap: 'In-app purchases',
    ads_iap: 'Contains ads · In-app purchases',
    ads: 'Contains ads',
    free: ''
  };
  const gMetaText = gMetaMap[iapVal] !== undefined ? gMetaMap[iapVal] : 'In-app purchases';
  $$('[data-iap-google]').forEach(e => {
    e.textContent = gMetaText;
    e.style.display = gMetaText ? '' : 'none';
  });

  document.body.classList.remove('stats-off');
}
function syncStatInputs(){
  Object.entries(STAT_INPUTS).forEach(([k,id]) => { const el = $(id); if(el) el.value = STATS[k]; });
  const wm = $('f-st-wm');
  if(wm) wm.checked = EXPORT_WM;
  if(typeof syncAgeUI === 'function') syncAgeUI();
  if(typeof syncIapUI === 'function') syncIapUI();
}
function applyStatsFromObject(o){
  if(!o || typeof o !== 'object') return;
  Object.keys(STATS_DEFAULT).forEach(k => { if(typeof o[k] === 'string') STATS[k] = o[k].slice(0, 16); });
  STATS_OFF = false;
  if(typeof o.wm === 'boolean') EXPORT_WM = o.wm;
}
function statsToObject(){ return {...STATS, off: false, wm: EXPORT_WM}; }
function resetStats(){ Object.assign(STATS, STATS_DEFAULT); STATS_OFF = false; EXPORT_WM = true; syncStatInputs(); renderStats(); }

// --- Built-in Neutral Vector Icon & Screenshot Mockups (100% Offline, 1024x1024 Opaque Square) ---
function makeSvgDataUri(svg){
  let s = svg.trim();
  if(!/<\s*svg[^>]*\bwidth\s*=/i.test(s) && !/<\s*svg[^>]*\bheight\s*=/i.test(s)){
    const vb = s.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
    if(vb){
      let w = Math.round(parseFloat(vb[1]));
      let h = Math.round(parseFloat(vb[2]));
      if(w === 460 && h === 996){ w = 1290; h = 2796; }
      else if(w === 1024 && h === 500){ w = 1024; h = 500; }
      s = s.replace(/<svg\b([^>]*)>/i, `<svg$1 width="${w}" height="${h}">`);
    }
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s.replace(/\s+/g,' '));
}

const DEFAULT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="tfBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="50%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="tfG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#tfBg)"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="24" stroke-dasharray="680 180" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="url(#tfG)" stroke-width="24" stroke-dasharray="480 500" stroke-linecap="round"/>
  <path d="M185 262 L235 312 L332 205" fill="none" stroke="#ffffff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="370" cy="145" r="18" fill="#93c5fd"/>
</svg>
`);

const STUDIO_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="std-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F211F" />
      <stop offset="100%" stop-color="#121312" />
    </linearGradient>
    <filter id="std-k-sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>
  <!-- Full-bleed Opaque Supabase Dark Background (100% ITMS-90717 Zero Alpha Compliant) -->
  <rect width="100" height="100" fill="url(#std-sq-bg)" />
  <!-- Pure Interlocking K: Dual-Store Ribbon (Primary #006636 + Secondary #00D085) -->
  <g transform="scale(0.72) translate(19, 19)">
    <path
      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
      fill="#006636"
    />
    <g filter="url(#std-k-sh)">
      <path
        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
        fill="#00D085"
      />
    </g>
  </g>
</svg>
`);

// --- Professional ASO App Icon Blueprint Grid (Draft / Placeholder Icon) ---
const BLUEPRINT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#172033"/>
    </linearGradient>
    <linearGradient id="bp-grid-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <pattern id="bp-dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="1.2" fill="#38bdf8" opacity="0.12"/>
    </pattern>
  </defs>
  <!-- Full-bleed Opaque Studio Blueprint Dark Surface (100% ITMS-90717 Zero Alpha Compliant) -->
  <rect width="1024" height="1024" fill="url(#bp-bg)"/>
  <rect width="1024" height="1024" fill="url(#bp-dots)"/>

  <!-- Outer Safe Area Squircle Boundary (Apple HIG 1024px Squircle Keyline) -->
  <rect x="102" y="102" width="820" height="820" rx="185" fill="rgba(56,189,248,0.03)" stroke="#38bdf8" stroke-width="2.5" opacity="0.4"/>

  <!-- Keyline Rectangles: Landscape (740x480) & Portrait (480x740) -->
  <rect x="142" y="272" width="740" height="480" rx="24" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.25"/>
  <rect x="272" y="142" width="480" height="740" rx="24" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.25"/>

  <!-- Central Keyline Square (512x512) -->
  <rect x="256" y="256" width="512" height="512" rx="32" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.3"/>

  <!-- Golden Ratio & HIG Keyline Circles -->
  <circle cx="512" cy="512" r="420" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.35"/>
  <circle cx="512" cy="512" r="370" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.25"/>
  <circle cx="512" cy="512" r="256" fill="none" stroke="url(#bp-grid-glow)" stroke-width="2" opacity="0.45"/>
  <circle cx="512" cy="512" r="145" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.35"/>

  <!-- Center Crosshairs & 45-degree Diagonal Guide Axes -->
  <line x1="512" y1="80" x2="512" y2="944" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
  <line x1="80" y1="512" x2="944" y2="512" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
  <line x1="140" y1="140" x2="884" y2="884" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.2"/>
  <line x1="140" y1="884" x2="884" y2="140" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.2"/>

  <!-- Center Upload Target Pill & Icon Glyph -->
  <circle cx="512" cy="512" r="64" fill="#0f172a" stroke="url(#bp-grid-glow)" stroke-width="2.5" opacity="0.9"/>
  <g transform="translate(512, 512)" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 -22 L0 22"/>
    <path d="M-22 0 L22 0"/>
  </g>

  <!-- Technical Spec Blueprint Labels -->
  <text x="512" y="805" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="700" letter-spacing="3" fill="#7dd3fc" text-anchor="middle" opacity="0.85">APP ICON 1024×1024</text>
  <text x="512" y="842" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="18" font-weight="600" letter-spacing="2" fill="#94a3b8" text-anchor="middle" opacity="0.75">BLUEPRINT GRID · UPLOAD ICON</text>
</svg>
`);

const BLANK_ICON = BLUEPRINT_ICON;
const LEGACY_BLANK_ICON = STUDIO_ICON;

const SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="50%" stop-color="#111827"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#818cf8"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">PRODUCTIVITY &amp; HABITS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Master Your Daily</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#acc)" text-anchor="middle">Habits &amp; Routines</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Stay consistent and celebrate daily streaks</text>
  <g transform="translate(30, 240)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#0284c7" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">🧘</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Morning Meditation</text>
    <text x="96" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">15 mins mindfulness · 8:00 AM</text>
    <circle cx="355" cy="52" r="18" fill="#10b981"/>
    <path d="M347 52 L353 58 L363 46" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(30, 365)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#818cf8" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">📚</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Read 20 Pages</text>
    <text x="96" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Deep Work · Atomic Habits</text>
    <circle cx="355" cy="52" r="18" fill="#10b981"/>
    <path d="M347 52 L353 58 L363 46" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(30, 490)">
    <rect width="400" height="105" rx="20" fill="url(#c)" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="22" width="60" height="60" rx="16" fill="#f59e0b" opacity="0.25"/>
    <text x="50" y="60" font-size="26" text-anchor="middle">💧</text>
    <text x="96" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="700" fill="#ffffff">Drink 2.5L Water</text>
    <text x="96" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">2.0 / 2.5 Liters logged</text>
    <rect x="96" y="82" width="220" height="6" rx="3" fill="#334155"/>
    <rect x="96" y="82" width="176" height="6" rx="3" fill="url(#acc)"/>
    <circle cx="355" cy="52" r="18" fill="none" stroke="#64748b" stroke-width="2"/>
  </g>
  <g transform="translate(30, 620)">
    <rect width="400" height="90" rx="20" fill="#1e1b4b" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="45" y="55" font-size="34">🔥</text>
    <text x="90" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="800" fill="#fde68a">24 DAYS STREAK</text>
    <text x="90" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#fbbf24">Top 5% among TaskFlow habit builders</text>
  </g>
  <g transform="translate(30, 735)">
    <rect width="400" height="175" rx="24" fill="#0b1329" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Today's Goal Completion</text>
    <text x="350" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="end">85%</text>
    <rect x="50" y="65" width="300" height="10" rx="5" fill="#1e293b"/>
    <rect x="50" y="65" width="255" height="10" rx="5" fill="url(#acc)"/>
    <text x="200" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#64748b" text-anchor="middle">5 of 6 daily habits completed</text>
    <rect x="130" y="130" width="140" height="32" rx="16" fill="rgba(56,189,248,0.15)"/>
    <text x="200" y="151" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">⚡ Keep It Up!</text>
  </g>
</svg>
`);

const SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090d16"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#818cf8" text-anchor="middle">DEEP WORK SESSIONS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Deep Focus Pomodoro</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#ring)" text-anchor="middle">Zero Distractions</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Built-in ambient soundscapes &amp; interval timers</text>
  <g transform="translate(230, 420)">
    <circle cx="0" cy="0" r="140" fill="none" stroke="#1e293b" stroke-width="16"/>
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#ring)" stroke-width="16" stroke-dasharray="600 300" stroke-linecap="round"/>
    <text x="0" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="56" font-weight="800" fill="#ffffff" text-anchor="middle">25:00</text>
    <text x="0" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">POMODORO FOCUS</text>
  </g>
  <g transform="translate(50, 620)">
    <rect width="360" height="70" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="30" y="42" font-size="24">🎯</text>
    <text x="70" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Current Milestone Task</text>
    <text x="70" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Finalize System Architecture &amp; Mockup</text>
  </g>
  <g transform="translate(50, 710)">
    <rect width="360" height="70" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="30" y="42" font-size="24">🌧</text>
    <text x="70" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Ambient Background Audio</text>
    <text x="70" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#38bdf8">Binaural Lo-Fi Beats &amp; Gentle Rain</text>
  </g>
  <g transform="translate(50, 810)">
    <rect width="360" height="60" rx="30" fill="url(#ring)"/>
    <text x="180" y="37" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#0f172a" text-anchor="middle">▶ Start 25m Session</text>
  </g>
</svg>
`);

const SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">ACTIONABLE INSIGHTS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Track Progress &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#38bdf8" text-anchor="middle">Peak Productivity</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Visualize completion patterns and optimal hours</text>
  <g transform="translate(30, 240)">
    <rect width="400" height="240" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Weekly Activity</text>
    <text x="375" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">+18% vs Last Wk</text>
    <!-- Bar charts -->
    <g transform="translate(30, 70)">
      <rect x="0" y="60" width="30" height="80" rx="6" fill="#334155"/>
      <rect x="50" y="30" width="30" height="110" rx="6" fill="#334155"/>
      <rect x="100" y="20" width="30" height="120" rx="6" fill="url(#bar)"/>
      <rect x="150" y="10" width="30" height="130" rx="6" fill="url(#bar)"/>
      <rect x="200" y="40" width="30" height="100" rx="6" fill="url(#bar)"/>
      <rect x="250" y="15" width="30" height="125" rx="6" fill="url(#bar)"/>
      <rect x="300" y="0" width="30" height="140" rx="6" fill="#10b981"/>
      <text x="15" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">M</text>
      <text x="65" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">T</text>
      <text x="115" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W</text>
      <text x="165" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">T</text>
      <text x="215" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">F</text>
      <text x="265" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">S</text>
      <text x="315" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#10b981" text-anchor="middle">S</text>
    </g>
  </g>
  <g transform="translate(30, 505)">
    <rect width="190" height="110" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Completion Rate</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="800" fill="#38bdf8">94%</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#10b981">● All-time high</text>
  </g>
  <g transform="translate(240, 505)">
    <rect width="190" height="110" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Total Focus Time</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="800" fill="#c084fc">42h</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#c084fc">● This month</text>
  </g>
  <g transform="translate(30, 640)">
    <rect width="400" height="240" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Consistency Calendar</text>
    <text x="25" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">30 consecutive days of goal attainment</text>
    <g transform="translate(25, 90)">
      <!-- Calendar mini dots matrix -->
      <circle cx="15" cy="15" r="8" fill="#10b981"/><circle cx="45" cy="15" r="8" fill="#10b981"/><circle cx="75" cy="15" r="8" fill="#10b981"/><circle cx="105" cy="15" r="8" fill="#10b981"/><circle cx="135" cy="15" r="8" fill="#10b981"/><circle cx="165" cy="15" r="8" fill="#10b981"/><circle cx="195" cy="15" r="8" fill="#10b981"/><circle cx="225" cy="15" r="8" fill="#10b981"/><circle cx="255" cy="15" r="8" fill="#10b981"/><circle cx="285" cy="15" r="8" fill="#10b981"/><circle cx="315" cy="15" r="8" fill="#10b981"/>
      <circle cx="15" cy="45" r="8" fill="#10b981"/><circle cx="45" cy="45" r="8" fill="#10b981"/><circle cx="75" cy="45" r="8" fill="#10b981"/><circle cx="105" cy="45" r="8" fill="#10b981"/><circle cx="135" cy="45" r="8" fill="#10b981"/><circle cx="165" cy="45" r="8" fill="#10b981"/><circle cx="195" cy="45" r="8" fill="#10b981"/><circle cx="225" cy="45" r="8" fill="#10b981"/><circle cx="255" cy="45" r="8" fill="#10b981"/><circle cx="285" cy="45" r="8" fill="#10b981"/><circle cx="315" cy="45" r="8" fill="#10b981"/>
      <circle cx="15" cy="75" r="8" fill="#10b981"/><circle cx="45" cy="75" r="8" fill="#10b981"/><circle cx="75" cy="75" r="8" fill="#10b981"/><circle cx="105" cy="75" r="8" fill="#10b981"/><circle cx="135" cy="75" r="8" fill="#10b981"/><circle cx="165" cy="75" r="8" fill="#10b981"/><circle cx="195" cy="75" r="8" fill="#10b981"/><circle cx="225" cy="75" r="8" fill="#38bdf8"/><circle cx="255" cy="75" r="8" fill="#38bdf8"/><circle cx="285" cy="75" r="8" fill="#38bdf8"/><circle cx="315" cy="75" r="8" fill="#38bdf8"/>
    </g>
  </g>
</svg>
`);

const SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="s4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#s4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#c084fc" text-anchor="middle">HOME &amp; LOCK SCREEN</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Interactive Widgets</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#c084fc" text-anchor="middle">One-Tap Check Off</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">iOS 18 &amp; Android 15 dynamic interactive widgets</text>
  <g transform="translate(30, 250)">
    <rect width="400" height="200" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">TaskFlow Today Widget</text>
    <g transform="translate(25, 60)">
      <rect width="350" height="40" rx="10" fill="#0f172a"/>
      <circle cx="20" cy="20" r="10" fill="#10b981"/>
      <text x="45" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#fff">Finish Daily Journaling</text>
      <text x="330" y="25" font-size="12" fill="#10b981" text-anchor="end">Done</text>
    </g>
    <g transform="translate(25, 110)">
      <rect width="350" height="40" rx="10" fill="#0f172a"/>
      <circle cx="20" cy="20" r="10" fill="#38bdf8"/>
      <text x="45" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#fff">Take 10,000 Steps</text>
      <text x="330" y="25" font-size="12" fill="#38bdf8" text-anchor="end">7.8K</text>
    </g>
  </g>
  <g transform="translate(30, 480)">
    <rect width="190" height="190" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-size="28">🔥</text>
    <text x="25" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#fde68a">24</text>
    <text x="25" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Days Streak</text>
    <text x="25" y="145" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">Active Consistency</text>
  </g>
  <g transform="translate(240, 480)">
    <rect width="190" height="190" rx="28" fill="#182238" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="40" font-size="28">⏱</text>
    <text x="25" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#38bdf8">25m</text>
    <text x="25" y="115" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Quick Focus</text>
    <text x="25" y="145" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#38bdf8">Tap to start</text>
  </g>
</svg>
`);

// Fallback placeholder images for empty screenshot slots & offline previews
const PH = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1290 2796" width="1290" height="2796">
  <defs>
    <linearGradient id="ph_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1290" height="2796" fill="url(#ph_bg)"/>
  <rect x="50" y="50" width="1190" height="2696" rx="84" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <rect x="495" y="95" width="300" height="80" rx="40" fill="#030712" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <g transform="translate(645, 1280)">
    <circle cx="0" cy="0" r="140" fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.2)" stroke-width="3"/>
    <rect x="-60" y="-45" width="120" height="90" rx="16" fill="none" stroke="url(#ph_glow)" stroke-width="7"/>
    <circle cx="-25" cy="-18" r="12" fill="url(#ph_glow)"/>
    <path d="M-55 35 L-15 -5 L20 30 L40 10 L55 35" fill="none" stroke="url(#ph_glow)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="35" r="28" fill="#6366f1"/>
    <path d="M50 22 L50 48 M37 35 L63 35" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="210" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="52" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="-0.5">No Screenshot Uploaded</text>
    <text x="0" y="275" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#94a3b8" text-anchor="middle">iPhone 6.9&quot; Target: 1290 × 2796 px</text>
    <text x="0" y="335" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#64748b" text-anchor="middle">PNG or JPEG · Max 8 MB · Drag &amp; drop to upload</text>
  </g>
</svg>
`);

const PH_IPAD = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2732" width="2048" height="2732">
  <defs>
    <linearGradient id="ph_ipad_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_ipad_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="2048" height="2732" fill="url(#ph_ipad_bg)"/>
  <rect x="65" y="65" width="1918" height="2602" rx="72" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <circle cx="1024" cy="115" r="10" fill="rgba(255,255,255,0.15)"/>
  <g transform="translate(1024, 1260)">
    <circle cx="0" cy="0" r="180" fill="rgba(139,92,246,0.07)" stroke="rgba(139,92,246,0.2)" stroke-width="3"/>
    <rect x="-80" y="-105" width="160" height="210" rx="20" fill="none" stroke="url(#ph_ipad_glow)" stroke-width="7"/>
    <circle cx="0" cy="-88" r="5" fill="url(#ph_ipad_glow)"/>
    <line x1="-30" y1="88" x2="30" y2="88" stroke="url(#ph_ipad_glow)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="65" cy="80" r="34" fill="#8b5cf6"/>
    <path d="M65 64 L65 96 M49 80 L81 80" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <text x="0" y="240" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="64" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="-0.5">No iPad Screenshot Uploaded</text>
    <text x="0" y="320" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="38" font-weight="500" fill="#94a3b8" text-anchor="middle">iPad Target: 2048 × 2732 px (3:4 Ratio)</text>
    <text x="0" y="385" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="32" font-weight="400" fill="#64748b" text-anchor="middle">PNG or JPEG · Up to 8 MB · Supports Landscape &amp; Portrait</text>
  </g>
</svg>
`);

const PH_TAB = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1600" width="2560" height="1600">
  <defs>
    <linearGradient id="ph_tab_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070d1a"/>
    </linearGradient>
    <linearGradient id="ph_tab_glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="2560" height="1600" fill="url(#ph_tab_bg)"/>
  <rect x="60" y="60" width="2440" height="1480" rx="60" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
  <g transform="translate(1280, 750)">
    <circle cx="0" cy="0" r="160" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.2)" stroke-width="3"/>
    <rect x="-100" y="-65" width="200" height="130" rx="16" fill="none" stroke="url(#ph_tab_glow)" stroke-width="7"/>
    <circle cx="85" cy="0" r="5" fill="url(#ph_tab_glow)"/>
    <circle cx="75" cy="50" r="30" fill="#10b981"/>
    <path d="M75 36 L75 64 M61 50 L89 50" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="220" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="56" font-weight="700" fill="#f8fafc" text-anchor="middle">No Tablet Screenshot Uploaded</text>
    <text x="0" y="295" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#94a3b8" text-anchor="middle">Google Play Target: 16:10 or 16:9 Landscape · Up to 8 MB</text>
    <text x="0" y="355" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#64748b" text-anchor="middle">If empty, tablet mockups automatically display phone screenshots</text>
  </g>
</svg>
`);

// Light theme placeholder equivalents for bright, clean UI mode
const PH_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1290 2796" width="1290" height="2796">
  <defs>
    <linearGradient id="ph_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_light_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1290" height="2796" fill="url(#ph_light_bg)"/>
  <rect x="50" y="50" width="1190" height="2696" rx="84" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <rect x="495" y="95" width="300" height="80" rx="40" fill="#ffffff" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
  <g transform="translate(645, 1280)">
    <circle cx="0" cy="0" r="140" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" stroke-width="3"/>
    <rect x="-60" y="-45" width="120" height="90" rx="16" fill="none" stroke="url(#ph_light_glow)" stroke-width="7"/>
    <circle cx="-25" cy="-18" r="12" fill="url(#ph_light_glow)"/>
    <path d="M-55 35 L-15 -5 L20 30 L40 10 L55 35" fill="none" stroke="url(#ph_light_glow)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="35" r="28" fill="#6366f1"/>
    <path d="M50 22 L50 48 M37 35 L63 35" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="210" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="52" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.5">No Screenshot Uploaded</text>
    <text x="0" y="275" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#64748b" text-anchor="middle">iPhone 6.9&quot; Target: 1290 × 2796 px</text>
    <text x="0" y="335" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#94a3b8" text-anchor="middle">PNG or JPEG · Max 8 MB · Drag &amp; drop to upload</text>
  </g>
</svg>
`);

const PH_IPAD_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2732" width="2048" height="2732">
  <defs>
    <linearGradient id="ph_ipad_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_ipad_light_glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="2048" height="2732" fill="url(#ph_ipad_light_bg)"/>
  <rect x="65" y="65" width="1918" height="2602" rx="72" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <circle cx="1024" cy="115" r="10" fill="rgba(0,0,0,0.12)"/>
  <g transform="translate(1024, 1260)">
    <circle cx="0" cy="0" r="180" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" stroke-width="3"/>
    <rect x="-80" y="-105" width="160" height="210" rx="20" fill="none" stroke="url(#ph_ipad_light_glow)" stroke-width="7"/>
    <circle cx="0" cy="-88" r="5" fill="url(#ph_ipad_light_glow)"/>
    <line x1="-30" y1="88" x2="30" y2="88" stroke="url(#ph_ipad_light_glow)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="65" cy="80" r="34" fill="#8b5cf6"/>
    <path d="M65 64 L65 96 M49 80 L81 80" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <text x="0" y="240" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="64" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.5">No iPad Screenshot Uploaded</text>
    <text x="0" y="320" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="38" font-weight="500" fill="#64748b" text-anchor="middle">iPad Target: 2048 × 2732 px (3:4 Ratio)</text>
    <text x="0" y="385" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="32" font-weight="400" fill="#94a3b8" text-anchor="middle">PNG or JPEG · Up to 8 MB · Supports Landscape &amp; Portrait</text>
  </g>
</svg>
`);

const PH_TAB_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1600" width="2560" height="1600">
  <defs>
    <linearGradient id="ph_tab_light_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="ph_tab_light_glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="2560" height="1600" fill="url(#ph_tab_light_bg)"/>
  <rect x="60" y="60" width="2440" height="1480" rx="60" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
  <g transform="translate(1280, 750)">
    <circle cx="0" cy="0" r="160" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" stroke-width="3"/>
    <rect x="-100" y="-65" width="200" height="130" rx="16" fill="none" stroke="url(#ph_tab_light_glow)" stroke-width="7"/>
    <circle cx="85" cy="0" r="5" fill="url(#ph_tab_light_glow)"/>
    <circle cx="75" cy="50" r="30" fill="#10b981"/>
    <path d="M75 36 L75 64 M61 50 L89 50" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="0" y="220" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" font-size="56" font-weight="700" fill="#0f172a" text-anchor="middle">No Tablet Screenshot Uploaded</text>
    <text x="0" y="295" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="34" font-weight="500" fill="#64748b" text-anchor="middle">Google Play Target: 16:10 or 16:9 Landscape · Up to 8 MB</text>
    <text x="0" y="355" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif" font-size="28" font-weight="400" fill="#94a3b8" text-anchor="middle">If empty, tablet mockups automatically display phone screenshots</text>
  </g>
</svg>
`);

// --- Feature Graphics (1024×500 px for Google Play) ---
const DEFAULT_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0f1d"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
    <linearGradient id="fglow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#818cf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#fbg)"/>
  <circle cx="850" cy="180" r="260" fill="#38bdf8" opacity="0.12"/>
  <g transform="translate(80, 105)">
    <rect width="100" height="100" rx="24" fill="#1e1b4b" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <circle cx="50" cy="50" r="32" fill="none" stroke="url(#fglow)" stroke-width="6" stroke-linecap="round"/>
    <path d="M36 51 L46 61 L66 41" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="205" y="152" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-0.5">TaskFlow</text>
  <text x="205" y="190" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="url(#fglow)">HABIT TRACKER &amp; PRODUCTIVITY PLANNER</text>
  <text x="80" y="265" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Organize Daily Habits, Build Momentum</text>
  <text x="80" y="305" font-family="-apple-system,system-ui,sans-serif" font-size="16" fill="#94a3b8">Smart streaks, focus timer sessions, and seamless cross-device cloud sync.</text>
  <g transform="translate(80, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">🔥 24-Day Streak</text>
  </g>
  <g transform="translate(280, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(129,140,248,0.15)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#c084fc" text-anchor="middle">⏱ Focus Timer</text>
  </g>
  <g transform="translate(480, 350)">
    <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#34d399" text-anchor="middle">★ 4.9 Rated</text>
  </g>
  <g transform="translate(710, 85)">
    <rect width="240" height="330" rx="24" fill="#182238" stroke="#334155" stroke-width="2"/>
    <text x="25" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#fff">Daily Progress</text>
    <text x="215" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#38bdf8" text-anchor="end">85%</text>
    <rect x="25" y="65" width="190" height="8" rx="4" fill="#334155"/>
    <rect x="25" y="65" width="160" height="8" rx="4" fill="url(#fglow)"/>
    <g transform="translate(25, 95)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#10b981"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Morning Routine</text></g>
    <g transform="translate(25, 165)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#38bdf8"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Deep Focus 25m</text></g>
    <g transform="translate(25, 235)"><rect width="190" height="55" rx="12" fill="#0f172a"/><circle cx="25" cy="27" r="12" fill="#f59e0b"/><text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">Evening Reading</text></g>
  </g>
</svg>
`);

// --- PulseFit Workout & Fitness Assets ---
const PULSEFIT_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="pfitBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e18"/>
      <stop offset="50%" stop-color="#0f1b2d"/>
      <stop offset="100%" stop-color="#16273f"/>
    </linearGradient>
    <linearGradient id="pfG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b35"/>
      <stop offset="50%" stop-color="#ff8c42"/>
      <stop offset="100%" stop-color="#ffc107"/>
    </linearGradient>
    <filter id="pfGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#ff7a00" flood-opacity="0.55"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#pfitBg)"/>
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#pfG)" stroke-width="20" stroke-dasharray="640 200" stroke-linecap="round" opacity="0.35"/>
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#pfG)" stroke-width="20" stroke-dasharray="460 500" stroke-linecap="round" filter="url(#pfGlow)"/>
  <!-- Barbell Plates & Shaft -->
  <rect x="156" y="246" width="200" height="20" rx="10" fill="#ffffff" filter="url(#pfGlow)"/>
  <rect x="128" y="206" width="28" height="100" rx="10" fill="url(#pfG)"/>
  <rect x="96" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9"/>
  <rect x="356" y="206" width="28" height="100" rx="10" fill="url(#pfG)"/>
  <rect x="392" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9"/>
  <!-- Heart Pulse Beat -->
  <path d="M120 256 L180 256 L205 185 L240 335 L272 205 L300 285 L325 256 L392 256" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" filter="url(#pfGlow)"/>
  <circle cx="205" cy="185" r="9" fill="#ffc107"/>
</svg>
`);

const PULSEFIT_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="50%" stop-color="#0f1929"/><stop offset="100%" stop-color="#182538"/></linearGradient>
    <linearGradient id="pfr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff5722"/><stop offset="100%" stop-color="#ff9800"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">WORKOUT &amp; SET LOGGER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Track Heavy Sets &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#pfr)" text-anchor="middle">Auto Rest Timers</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Progressive overload tracking for muscle hypertrophy</text>

  <g transform="translate(30, 240)">
    <rect width="400" height="260" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#fff">🏋️ Barbell Bench Press</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">Set 3 of 4</text>
    
    <!-- Table Rows -->
    <g transform="translate(25, 65)">
      <rect width="350" height="38" rx="8" fill="#1b283d"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 1</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">90 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">10 reps</text>
      <text x="320" y="24" font-size="14" fill="#10b981">✓</text>
    </g>
    <g transform="translate(25, 110)">
      <rect width="350" height="38" rx="8" fill="#1b283d"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 2</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">95 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#fff">8 reps</text>
      <text x="320" y="24" font-size="14" fill="#10b981">✓</text>
    </g>
    <g transform="translate(25, 155)">
      <rect width="350" height="42" rx="10" fill="rgba(255,107,53,0.18)" stroke="#ff6b35" stroke-width="1.5"/>
      <text x="20" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ff8c42">SET 3 (ACTIVE)</text>
      <text x="120" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">100 kg</text>
      <text x="220" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">8 reps</text>
      <rect x="290" y="8" width="50" height="26" rx="13" fill="#ff6b35"/>
      <text x="315" y="25" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">Log</text>
    </g>
    <g transform="translate(25, 205)">
      <rect width="350" height="38" rx="8" fill="#1b283d" opacity="0.6"/>
      <text x="20" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94a3b8">SET 4</text>
      <text x="120" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#64748b">100 kg</text>
      <text x="220" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#64748b">6–8 reps</text>
      <text x="320" y="24" font-size="13" fill="#64748b">⋯</text>
    </g>
  </g>

  <!-- Rest Timer Banner -->
  <g transform="translate(30, 520)">
    <rect width="400" height="120" rx="20" fill="#152135" stroke="#ff6b35" stroke-width="1.5"/>
    <circle cx="65" cy="60" r="38" fill="none" stroke="#223654" stroke-width="7"/>
    <circle cx="65" cy="60" r="38" fill="none" stroke="#ff6b35" stroke-width="7" stroke-dasharray="160 80" stroke-linecap="round"/>
    <text x="65" y="66" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">01:45</text>
    <text x="125" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Rest Interval</text>
    <text x="125" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Next up: Set 4 Heavy Push</text>
    <rect x="315" y="42" width="70" height="36" rx="18" fill="rgba(255,255,255,0.1)"/>
    <text x="350" y="65" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">+30s</text>
  </g>

  <!-- Next Exercise -->
  <g transform="translate(30, 660)">
    <rect width="400" height="85" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="25" y="38" font-size="22">🦵</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Barbell Back Squat</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">4 Sets · 120 kg Target</text>
    <text x="375" y="48" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">Up Next →</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="50%" stop-color="#0e1828"/><stop offset="100%" stop-color="#172439"/></linearGradient>
    <linearGradient id="hrGlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff9800"/><stop offset="50%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">LIVE CARDIAC METRICS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Heart Rate Zones &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#hrGlow)" text-anchor="middle">Active Burn</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Synchronized with Apple Watch &amp; Wear OS sensors</text>

  <!-- Big Heart Rate Gauge -->
  <g transform="translate(230, 390)">
    <circle cx="0" cy="0" r="130" fill="none" stroke="#1a273b" stroke-width="18"/>
    <circle cx="0" cy="0" r="130" fill="none" stroke="url(#hrGlow)" stroke-width="18" stroke-dasharray="580 250" stroke-linecap="round"/>
    <text x="0" y="-15" font-size="34" text-anchor="middle">❤️</text>
    <text x="0" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">154</text>
    <text x="0" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#ff8c42" text-anchor="middle">BPM · ZONE 4 (HARD)</text>
  </g>

  <!-- Live Stats Grid -->
  <g transform="translate(30, 560)">
    <rect width="190" height="110" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Active Burn</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="900" fill="#ff6b35">520</text>
    <text x="85" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#ff8c42">kcal</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#10b981">● Target on track</text>
  </g>
  <g transform="translate(240, 560)">
    <rect width="190" height="110" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Session Duration</text>
    <text x="20" y="75" font-family="-apple-system,system-ui,sans-serif" font-size="32" font-weight="900" fill="#ffc107">38:20</text>
    <text x="20" y="95" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#ffc107">● 82% in Zone 3/4</text>
  </g>

  <g transform="translate(30, 690)">
    <rect width="400" height="85" rx="18" fill="#152135" stroke="#ff6b35" stroke-width="1"/>
    <text x="25" y="48" font-size="26">⌚</text>
    <text x="65" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Apple Watch Ultra Linked</text>
    <text x="65" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#10b981">● Real-time optical HR &amp; GPS tracking active</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="100%" stop-color="#162235"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ffc107" text-anchor="middle">MACRO &amp; MEAL SCANNER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Precision Nutrition &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ff6b35" text-anchor="middle">Daily Protein Target</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Instant barcode scanning with verified nutritional database</text>

  <g transform="translate(30, 240)">
    <rect width="400" height="230" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Daily Calorie Balance</text>
    <text x="375" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffc107" text-anchor="end">250 kcal Left</text>
    <text x="25" y="85" font-family="-apple-system,system-ui,sans-serif" font-size="38" font-weight="900" fill="#fff">2,150 <tspan font-size="18" fill="#94a3b8">/ 2,400 kcal</tspan></text>
    
    <!-- Macro Bars -->
    <g transform="translate(25, 120)">
      <text x="0" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff6b35">Protein</text>
      <text x="350" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ff8c42" text-anchor="end">175g / 180g (97%)</text>
      <rect x="0" y="24" width="350" height="10" rx="5" fill="#1b283d"/>
      <rect x="0" y="24" width="340" height="10" rx="5" fill="#ff6b35"/>
    </g>
    <g transform="translate(25, 165)">
      <text x="0" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffc107">Carbs</text>
      <text x="350" y="14" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffc107" text-anchor="end">210g / 250g (84%)</text>
      <rect x="0" y="24" width="350" height="10" rx="5" fill="#1b283d"/>
      <rect x="0" y="24" width="294" height="10" rx="5" fill="#ffc107"/>
    </g>
  </g>

  <!-- Meal Logs -->
  <g transform="translate(30, 495)">
    <rect width="400" height="75" rx="16" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="44" font-size="22">🍳</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Breakfast: 3 Eggs &amp; Oatmeal</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">650 kcal · 42g Protein</text>
    <text x="375" y="44" font-size="14" fill="#10b981" text-anchor="end">✓ Logged</text>
  </g>
  <g transform="translate(30, 585)">
    <rect width="400" height="75" rx="16" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="20" y="44" font-size="22">🥗</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Lunch: Grilled Salmon &amp; Rice</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">780 kcal · 58g Protein</text>
    <text x="375" y="44" font-size="14" fill="#10b981" text-anchor="end">✓ Logged</text>
  </g>
  <g transform="translate(30, 675)">
    <rect width="400" height="75" rx="16" fill="rgba(255,107,53,0.14)" stroke="#ff6b35" stroke-width="1.5"/>
    <text x="20" y="44" font-size="22">📷</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">Scan Barcode / Log Dinner</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#ff8c42">Remaining: 250 kcal · 5g Protein</text>
    <text x="375" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ff6b35" text-anchor="end">+ Scan</text>
  </g>
</svg>
`);

const PULSEFIT_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="pfs4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090e17"/><stop offset="100%" stop-color="#162235"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#pfs4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ff8c42" text-anchor="middle">STRENGTH ANALYTICS</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Personal Records &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#gold)" text-anchor="middle">Volume Progression</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Automated 1-Rep Max curves &amp; recovery indicators</text>

  <!-- Big PR Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="150" rx="22" fill="#18253a" stroke="#fbbf24" stroke-width="2"/>
    <text x="30" y="45" font-size="28">🏆</text>
    <text x="75" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="url(#gold)">NEW ALL-TIME RECORD</text>
    <text x="75" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#fff">Deadlift: 185 kg</text>
    <text x="75" y="98" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">+10 kg over previous personal best</text>
    <rect x="75" y="112" width="120" height="24" rx="12" fill="rgba(245,158,11,0.2)"/>
    <text x="135" y="128" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fbbf24" text-anchor="middle">Top 5% Lifter</text>
  </g>

  <!-- Monthly Volume Chart -->
  <g transform="translate(30, 415)">
    <rect width="400" height="230" rx="22" fill="#121b2a" stroke="#223552" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Monthly Lifted Volume</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#10b981" text-anchor="end">+14.2% Gain</text>
    <!-- Bar graph -->
    <g transform="translate(30, 75)">
      <rect x="0" y="50" width="35" height="90" rx="6" fill="#1e2c44"/>
      <rect x="60" y="40" width="35" height="100" rx="6" fill="#1e2c44"/>
      <rect x="120" y="25" width="35" height="115" rx="6" fill="#ff6b35"/>
      <rect x="180" y="30" width="35" height="110" rx="6" fill="#ff6b35"/>
      <rect x="240" y="15" width="35" height="125" rx="6" fill="#ff6b35"/>
      <rect x="300" y="0" width="35" height="140" rx="6" fill="url(#gold)"/>
      <text x="17" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W1</text>
      <text x="77" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W2</text>
      <text x="137" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W3</text>
      <text x="197" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W4</text>
      <text x="257" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">W5</text>
      <text x="317" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fbbf24" text-anchor="middle">Current</text>
    </g>
  </g>

  <!-- Recovery State -->
  <g transform="translate(30, 670)">
    <rect width="400" height="85" rx="18" fill="#121b2a" stroke="#223552" stroke-width="1"/>
    <text x="25" y="48" font-size="24">🔋</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Muscle Recovery: 92% Ready</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#10b981">Chest &amp; Triceps fully primed for today's push workout</text>
  </g>
</svg>
`);

const PULSEFIT_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#080d16"/><stop offset="100%" stop-color="#152134"/></linearGradient>
    <linearGradient id="porange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#ff9800"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#pbg)"/>
  <circle cx="850" cy="200" r="260" fill="#ff6b35" opacity="0.12"/>
  <text x="80" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff">PulseFit: Workout &amp; Fitness</text>
  <text x="80" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="600" fill="url(#porange)">STRENGTH LOGGER · HIIT PLANS · MACRO NUTRITION</text>
  <text x="80" y="280" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Crush Your Personal Fitness Records</text>
  <text x="80" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Over 300+ guided workouts, Apple Health &amp; Health Connect synchronization.</text>
  <g transform="translate(80, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(255,107,53,0.15)" stroke="#ff6b35" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#ff8c42" text-anchor="middle">🏋️ 300+ Routines</text>
  </g>
  <g transform="translate(280, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fde68a" text-anchor="middle">❤️ Heart Rate Live</text>
  </g>
</svg>
`);

// --- ZenMind Meditation & Sleep Assets ---
const ZENMIND_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="zmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05140e"/>
      <stop offset="50%" stop-color="#0c2319"/>
      <stop offset="100%" stop-color="#143527"/>
    </linearGradient>
    <linearGradient id="zmGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="zmGlow" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0"/>
      <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="zmRadial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="#059669" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#05140e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#zmBg)"/>
  <circle cx="256" cy="256" r="210" fill="url(#zmRadial)"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(52,211,153,0.25)" stroke-width="2"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="rgba(110,231,183,0.2)" stroke-width="1.5" stroke-dasharray="6 6"/>

  <!-- Crescent Moon Glow -->
  <g transform="translate(256, 150)">
    <path d="M 0 -45 A 36 36 0 0 0 32 -10 A 42 42 0 1 1 -5 -45 Z" fill="#fde68a" opacity="0.95"/>
    <circle cx="15" cy="-28" r="3" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Sacred Lotus Petals in Emerald & Mint Bamboo -->
  <g transform="translate(256, 300)">
    <!-- Aura behind lotus -->
    <ellipse cx="0" cy="15" rx="110" ry="25" fill="url(#zmGlow)"/>
    <!-- Outer Left Petal -->
    <path d="M 0 20 C -70 10 -115 -25 -100 -70 C -75 -65 -35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.7"/>
    <!-- Outer Right Petal -->
    <path d="M 0 20 C 70 10 115 -25 100 -70 C 75 -65 35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.7"/>
    <!-- Mid Left Petal -->
    <path d="M 0 20 C -55 -15 -80 -70 -50 -105 C -35 -80 -10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.88"/>
    <!-- Mid Right Petal -->
    <path d="M 0 20 C 55 -15 80 -70 50 -105 C 35 -80 10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.88"/>
    <!-- Center Lotus Petal -->
    <path d="M 0 20 C -35 -35 -35 -105 0 -130 C 35 -105 35 -35 0 20 Z" fill="#ffffff" opacity="0.95"/>
    <!-- Lotus Core Light -->
    <circle cx="0" cy="-20" r="12" fill="#fde68a"/>
    <!-- Gentle Water Ripple Base -->
    <ellipse cx="0" cy="22" rx="70" ry="8" fill="none" stroke="#34d399" stroke-width="3" opacity="0.6"/>
    <ellipse cx="0" cy="28" rx="45" ry="5" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.4"/>
  </g>
</svg>
`);

const ZENMIND_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="50%" stop-color="#0c2319"/><stop offset="100%" stop-color="#143527"/></linearGradient>
    <linearGradient id="zmHeadGlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#34d399" text-anchor="middle">DAILY GUIDED MEDITATION</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Start Your Morning with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#zmHeadGlow)" text-anchor="middle">Clarity &amp; Inner Peace</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">5 to 20-minute guided practices for a calm, centered mind</text>

  <!-- Player Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="340" rx="24" fill="#0d2319" stroke="#1c4733" stroke-width="1.5"/>
    
    <!-- Audio Waveform Graphic -->
    <g transform="translate(35, 30)">
      <circle cx="165" cy="80" r="75" fill="rgba(52,211,153,0.12)"/>
      <circle cx="165" cy="80" r="50" fill="rgba(110,231,183,0.18)"/>
      <text x="165" y="88" font-size="36" text-anchor="middle">🧘‍♀️</text>
    </g>

    <text x="200" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="19" font-weight="800" fill="#fff" text-anchor="middle">Morning Gratitude &amp; Focus</text>
    <text x="200" y="224" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Voice: Sarah Jenkins · 15 Min Practice</text>

    <!-- Progress Bar -->
    <g transform="translate(35, 250)">
      <rect width="330" height="6" rx="3" fill="#183b2b"/>
      <rect width="190" height="6" rx="3" fill="url(#zmHeadGlow)"/>
      <circle cx="190" cy="3" r="7" fill="#ffffff"/>
      <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">08:42</text>
      <text x="330" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8" text-anchor="end">15:00</text>
    </g>

    <!-- Playback Controls -->
    <g transform="translate(200, 305)">
      <circle cx="-50" cy="0" r="18" fill="rgba(255,255,255,0.08)"/>
      <text x="-50" y="5" font-size="14" fill="#fff" text-anchor="middle">↺ 15</text>
      <circle cx="0" cy="0" r="26" fill="url(#zmHeadGlow)"/>
      <polygon points="-5,-10 -5,10 8,0" fill="#05140e"/>
      <circle cx="50" cy="0" r="18" fill="rgba(255,255,255,0.08)"/>
      <text x="50" y="5" font-size="14" fill="#fff" text-anchor="middle">15 ↻</text>
    </g>
  </g>

  <!-- Daily Intention Quote Card -->
  <g transform="translate(30, 605)">
    <rect width="400" height="95" rx="18" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="25" y="34" font-size="20">✨</text>
    <text x="58" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fde68a">DAILY INTENTION</text>
    <text x="58" y="56" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="600" fill="#ffffff">"Breathe in calm presence, exhale yesterday's tension."</text>
    <text x="58" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#34d399">Day 14 of 30 · Mindful Awareness Series</text>
  </g>

  <!-- Sound Atmosphere Pill -->
  <g transform="translate(30, 720)">
    <rect width="400" height="80" rx="18" fill="#0f2b1f" stroke="#22583e" stroke-width="1"/>
    <text x="25" y="46" font-size="24">🔔</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Ambient Background: Tibetan Singing Bowls</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#86efac">432 Hz Solfeggio Harmonics · Volume 35%</text>
    <text x="375" y="46" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">Active ♫</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="50%" stop-color="#0c2217"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="moonG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#86efac" text-anchor="middle">NEURO-ACOUSTIC SOUNDSCAPES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Fall Asleep Fast to</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#moonG)" text-anchor="middle">3D Binaural Soundscapes</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Layer rain, ocean waves, night crickets, and delta waves</text>

  <!-- 3D Sound Mixer Box -->
  <g transform="translate(30, 240)">
    <rect width="400" height="375" rx="24" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Live Soundscape Mixer</text>
    <rect x="290" y="24" width="85" height="26" rx="13" fill="rgba(52,211,153,0.15)"/>
    <text x="332" y="41" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">4 Layers</text>

    <!-- Track 1: Rain on Window -->
    <g transform="translate(25, 75)">
      <text x="0" y="22" font-size="20">🌧️</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Soft Rain on Skylight</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#6ee7b7" text-anchor="end">75%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="236" height="8" rx="4" fill="#34d399"/>
    </g>

    <!-- Track 2: Distant Thunder -->
    <g transform="translate(25, 145)">
      <text x="0" y="22" font-size="20">⚡</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Distant Rolling Thunder</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#a7f3d0" text-anchor="end">40%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="126" height="8" rx="4" fill="#6ee7b7"/>
    </g>

    <!-- Track 3: Pine Forest Wind -->
    <g transform="translate(25, 215)">
      <text x="0" y="22" font-size="20">🌲</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Highland Pine Wind</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">55%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="173" height="8" rx="4" fill="#10b981"/>
    </g>

    <!-- Track 4: Delta Brainwaves (Sleep Induction) -->
    <g transform="translate(25, 285)">
      <text x="0" y="22" font-size="20">🧠</text>
      <text x="35" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Delta Sleep Induction (2.5 Hz)</text>
      <text x="350" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#86efac" text-anchor="end">30%</text>
      <rect x="35" y="30" width="315" height="8" rx="4" fill="#173b2a"/>
      <rect x="35" y="30" width="94" height="8" rx="4" fill="#86efac"/>
    </g>
  </g>

  <!-- Sleep Timer Card -->
  <g transform="translate(30, 640)">
    <rect width="400" height="85" rx="18" fill="#0f291d" stroke="#1d523b" stroke-width="1.5"/>
    <text x="25" y="48" font-size="26">🌙</text>
    <text x="65" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="700" fill="#fff">Smart Sleep Timer Enabled</text>
    <text x="65" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Auto-fades volume smoothly in 45 mins</text>
    <rect x="305" y="30" width="75" height="28" rx="14" fill="#173b2a"/>
    <text x="342" y="49" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#6ee7b7" text-anchor="middle">45m ⏱</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="orbG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="50%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#34d399" text-anchor="middle">PACED BREATHWORK</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Soothe Anxiety with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">4-7-8 Breathing Orb</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Stimulate the vagus nerve and regulate heart rate variability</text>

  <!-- Big Breathing Orb Visual -->
  <g transform="translate(230, 390)">
    <circle cx="0" cy="0" r="140" fill="rgba(52,211,153,0.08)"/>
    <circle cx="0" cy="0" r="115" fill="rgba(110,231,183,0.15)"/>
    <circle cx="0" cy="0" r="90" fill="url(#orbG)" opacity="0.9"/>
    <circle cx="0" cy="0" r="65" fill="#ffffff" opacity="0.3"/>
    <text x="0" y="-10" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">HOLD</text>
    <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">7s</text>
    <text x="0" y="55" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#062215" text-anchor="middle">CYCLE 3 OF 6</text>
  </g>

  <!-- Technique Selector -->
  <g transform="translate(30, 580)">
    <rect width="400" height="75" rx="18" fill="#0c2217" stroke="#34d399" stroke-width="1.5"/>
    <text x="20" y="44" font-size="22">🫁</text>
    <text x="60" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">4-7-8 Relaxing Breath (Active)</text>
    <text x="60" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#6ee7b7">Inhale 4s · Hold 7s · Exhale 8s · Anxiety Relief</text>
  </g>

  <g transform="translate(30, 670)">
    <rect width="190" height="85" rx="16" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="18" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Box Breathing</text>
    <text x="18" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">4-4-4-4 Navy SEAL focus</text>
    <text x="18" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399">Switch Mode →</text>
  </g>

  <g transform="translate(240, 670)">
    <rect width="190" height="85" rx="16" fill="#0d2319" stroke="#1c4733" stroke-width="1"/>
    <text x="18" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Awake Energizer</text>
    <text x="18" y="52" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">6-0-2-0 Morning alertness</text>
    <text x="18" y="70" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#34d399">Switch Mode →</text>
  </g>
</svg>
`);

const ZENMIND_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="zms4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#133324"/></linearGradient>
    <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#zms4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#6ee7b7" text-anchor="middle">MINDFUL HABITS &amp; SLEEP</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Track Mindful Minutes &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="url(#greenGrad)" text-anchor="middle">Restorative Sleep Score</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Apple Health Mindful Minutes &amp; Sleep Stages sync</text>

  <!-- Sleep Quality Score Card -->
  <g transform="translate(30, 240)">
    <rect width="400" height="200" rx="22" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Last Night's Sleep Quality</text>
    <text x="375" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">✓ Restorative</text>

    <g transform="translate(25, 75)">
      <circle cx="45" cy="45" r="42" fill="none" stroke="#173b2a" stroke-width="8"/>
      <circle cx="45" cy="45" r="42" fill="none" stroke="#34d399" stroke-width="8" stroke-dasharray="240 70" stroke-linecap="round"/>
      <text x="45" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#fff" text-anchor="middle">91</text>
      <text x="45" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">SCORE</text>

      <g transform="translate(110, 10)">
        <text x="0" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Total Time Asleep: 7h 48m</text>
        <text x="0" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Deep Sleep: 2h 15m (Optimal)</text>
        <text x="0" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">REM Sleep: 1h 52m · Latency: 12m</text>
      </g>
    </g>
  </g>

  <!-- 7-Day Mindful Consistency -->
  <g transform="translate(30, 460)">
    <rect width="400" height="210" rx="22" fill="#0c2217" stroke="#1b4330" stroke-width="1.5"/>
    <text x="25" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Weekly Mindful Streak</text>
    <text x="375" y="40" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fde68a" text-anchor="end">🔥 21 Days</text>

    <!-- 7 Day Circles -->
    <g transform="translate(25, 75)">
      <g transform="translate(15,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" font-size="12" fill="#fff" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">M</text></g>
      <g transform="translate(65,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">T</text></g>
      <g transform="translate(115,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">W</text></g>
      <g transform="translate(165,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">T</text></g>
      <g transform="translate(215,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">F</text></g>
      <g transform="translate(265,0)"><circle cx="15" cy="15" r="18" fill="#10b981"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">✓</text><text x="15" y="50" font-size="11" fill="#94a3b8" text-anchor="middle">S</text></g>
      <g transform="translate(315,0)"><circle cx="15" cy="15" r="18" fill="url(#greenGrad)"/><text x="15" y="20" fill="#fff" font-size="12" text-anchor="middle">★</text><text x="15" y="50" font-size="11" font-weight="700" fill="#6ee7b7" text-anchor="middle">Today</text></g>
    </g>

    <text x="25" y="175" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">Total this week: <tspan font-weight="800" fill="#fff">145 Mindful Minutes</tspan> logged.</text>
  </g>

  <!-- Health Badge -->
  <g transform="translate(30, 690)">
    <rect width="400" height="75" rx="18" fill="#0f291d" stroke="#22583e" stroke-width="1"/>
    <text x="25" y="44" font-size="22">❤️</text>
    <text x="65" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">Apple Health &amp; Health Connect Sync</text>
    <text x="65" y="54" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#86efac">All mindful sessions saved to your personal health record</text>
  </g>
</svg>
`);

const ZENMIND_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="zbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#05140e"/><stop offset="100%" stop-color="#143527"/></linearGradient>
    <linearGradient id="zgreen" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#zbg)"/>
  <circle cx="850" cy="200" r="260" fill="#34d399" opacity="0.1"/>
  <text x="80" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="800" fill="#ffffff">ZenMind: Meditation &amp; Sleep</text>
  <text x="80" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="600" fill="url(#zgreen)">MINDFULNESS · SLEEP STORIES · 4-7-8 BREATHWORK</text>
  <text x="80" y="280" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Sleep Peacefully &amp; Reduce Daily Stress</text>
  <text x="80" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Binaural 3D nature soundscapes, evidence-based guided meditation sessions.</text>
  <g transform="translate(80, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#6ee7b7" text-anchor="middle">🌙 Sleep Better</text>
  </g>
  <g transform="translate(280, 360)">
    <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="90" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#a7f3d0" text-anchor="middle">🧘 100+ Journeys</text>
  </g>
</svg>
`);

const BLANK_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="#121a2c"/>
  <rect x="20" y="20" width="984" height="460" rx="16" fill="none" stroke="#2f3e66" stroke-width="2" stroke-dasharray="10 10"/>
  <g transform="translate(480, 218)" stroke="#64748b" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="64" height="64" rx="12"/>
    <circle cx="20" cy="20" r="5"/>
    <path d="M64 44 L46 26 L14 58"/>
    <path d="M40 44 L48 34 L64 50"/>
  </g>
</svg>
`);

const BLANK_FEATURE_LIGHT = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="#f8fafc"/>
  <rect x="20" y="20" width="984" height="460" rx="16" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="10 10"/>
  <g transform="translate(480, 218)" stroke="#94a3b8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="64" height="64" rx="12" fill="#ffffff" fill-opacity="0.9"/>
    <circle cx="20" cy="20" r="5" fill="#94a3b8"/>
    <path d="M64 44 L46 26 L14 58"/>
    <path d="M40 44 L48 34 L64 50"/>
  </g>
</svg>
`);

/* @pro-only-start */
// --- Game Preset Assets (CyberStrike RPG) ---
const CYBER_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#05050b"/><stop offset="40%" stop-color="#0f0e1c"/><stop offset="100%" stop-color="#1e0b2e"/></linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00f5ff"/><stop offset="100%" stop-color="#0077fe"/></linearGradient>
    <linearGradient id="neonPink" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ff007f"/><stop offset="100%" stop-color="#7928ca"/></linearGradient>
    <filter id="c-glow"><feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#00f5ff" flood-opacity="0.8"/></filter>
    <filter id="p-glow"><feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#ff007f" flood-opacity="0.75"/></filter>
  </defs>
  <rect width="512" height="512" fill="url(#cbg)"/>
  <rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="url(#neonPink)" stroke-width="4" opacity="0.4"/>
  <path d="M40 120 L120 120 L160 160 M472 120 L392 120 L352 160 M40 392 L120 392 L160 352 M472 392 L392 392 L352 352" stroke="#00f5ff" stroke-width="3" fill="none" opacity="0.3"/>
  <path d="M160 170 L352 170 L382 250 L322 360 L190 360 L130 250 Z" fill="#131422" stroke="url(#neonCyan)" stroke-width="8" filter="url(#c-glow)"/>
  <polygon points="175,230 337,230 315,268 197,268" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <line x1="160" y1="249" x2="352" y2="249" stroke="#ffffff" stroke-width="4" filter="url(#c-glow)"/>
  <polygon points="170,165 140,90 200,140" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <polygon points="342,165 372,90 312,140" fill="url(#neonPink)" filter="url(#p-glow)"/>
  <rect x="226" y="300" width="12" height="35" rx="4" fill="#00f5ff" opacity="0.8"/>
  <rect x="250" y="295" width="12" height="42" rx="4" fill="#00f5ff" opacity="0.9"/>
  <rect x="274" y="300" width="12" height="35" rx="4" fill="#00f5ff" opacity="0.8"/>
</svg>
`);

const CYBER_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="cfbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#060713"/><stop offset="50%" stop-color="#0e1026"/><stop offset="100%" stop-color="#240e34"/></linearGradient>
    <linearGradient id="neonT" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00f5ff"/><stop offset="50%" stop-color="#ff007f"/><stop offset="100%" stop-color="#ffe600"/></linearGradient>
    <linearGradient id="cgrid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#ff007f" stop-opacity="0.3"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#cfbg)"/>
  <path d="M0 380 L1024 380 L1024 500 L0 500 Z" fill="url(#cgrid)"/>
  <line x1="100" y1="380" x2="0" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="300" y1="380" x2="200" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="512" y1="380" x2="512" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="724" y1="380" x2="824" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="924" y1="380" x2="1024" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
  <line x1="0" y1="420" x2="1024" y2="420" stroke="#ff007f" stroke-width="1.5" opacity="0.3"/>
  <line x1="0" y1="460" x2="1024" y2="460" stroke="#ff007f" stroke-width="1.5" opacity="0.4"/>
  <circle cx="780" cy="220" r="160" fill="none" stroke="#ff007f" stroke-width="6" opacity="0.3"/>
  <circle cx="780" cy="220" r="120" fill="none" stroke="#00f5ff" stroke-width="4" opacity="0.4"/>
  <g transform="translate(620, 40)"><rect width="150" height="34" rx="17" fill="rgba(0,245,255,0.15)" stroke="#00f5ff" stroke-width="1.5"/><text x="75" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#00f5ff" text-anchor="middle">⚡ UNREAL ENGINE 5</text></g>
  <g transform="translate(785, 40)"><rect width="150" height="34" rx="17" fill="rgba(255,0,127,0.15)" stroke="#ff007f" stroke-width="1.5"/><text x="75" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ff007f" text-anchor="middle">🎮 120 FPS ULTRA</text></g>
  <text x="70" y="150" font-family="-apple-system,system-ui,sans-serif" font-size="52" font-weight="900" fill="url(#neonT)" letter-spacing="1">CYBERSTRIKE</text>
  <text x="70" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="3">2088 · OPEN WORLD CYBER RPG</text>
  <text x="70" y="260" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="700" fill="#00f5ff">Season 4: Neon Uprising is Live!</text>
  <text x="70" y="295" font-family="-apple-system,system-ui,sans-serif" font-size="16" fill="#cbd5e1">Pilot combat mechs, master cyber-blade combos, and conquer 10-player co-op raids.</text>
  <g transform="translate(70, 335)"><rect width="170" height="44" rx="12" fill="rgba(0,245,255,0.18)" stroke="#00f5ff" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#00f5ff" text-anchor="middle">⚔️ Real-Time Combat</text></g>
  <g transform="translate(255, 335)"><rect width="170" height="44" rx="12" fill="rgba(255,0,127,0.18)" stroke="#ff007f" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ff007f" text-anchor="middle">🤖 Mech Exosuits</text></g>
  <g transform="translate(440, 335)"><rect width="170" height="44" rx="12" fill="rgba(255,230,0,0.18)" stroke="#ffe600" stroke-width="1.5"/><text x="85" y="27" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#ffe600" text-anchor="middle">★ 4.9 · 100K+ Players</text></g>
</svg>
`);

const CYBER_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#0c0e22"/><stop offset="100%" stop-color="#1b0728"/></linearGradient>
    <linearGradient id="nCyan" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00f5ff"/><stop offset="100%" stop-color="#0066fe"/></linearGradient>
    <linearGradient id="nPink" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff007f"/><stop offset="100%" stop-color="#9900ff"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#00f5ff" text-anchor="middle">NEXT-GEN OPEN WORLD</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">EXPLORE NEO-SHINJUKU</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Massive Cyberpunk City with Complete Freedom</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090a18" stroke="#00f5ff" stroke-width="2"/>
    <rect x="20" y="120" width="70" height="480" fill="#121633" opacity="0.6"/>
    <rect x="100" y="80" width="85" height="520" fill="#181c44" opacity="0.8"/>
    <rect x="195" y="40" width="105" height="560" fill="#1f2358"/>
    <rect x="310" y="100" width="80" height="500" fill="#141838" opacity="0.7"/>
    <circle cx="230" cy="90" r="14" fill="#ff007f" opacity="0.7"/>
    <rect x="210" y="140" width="75" height="8" rx="4" fill="#00f5ff" opacity="0.6"/>
    <rect x="210" y="180" width="75" height="8" rx="4" fill="#ff007f" opacity="0.5"/>
    <rect x="210" y="220" width="75" height="8" rx="4" fill="#ffe600" opacity="0.7"/>
    <path d="M140 280 L220 270 L280 282 L180 290 Z" fill="#00f5ff" opacity="0.85"/>
    <line x1="120" y1="285" x2="160" y2="285" stroke="#ff007f" stroke-width="4"/>
    <ellipse cx="206" cy="530" rx="40" ry="12" fill="#00f5ff" opacity="0.4"/>
    <circle cx="206" cy="440" r="22" fill="#00f5ff"/>
    <path d="M186 465 L226 465 L236 530 L176 530 Z" fill="#ffffff"/>
    <line x1="236" y1="470" x2="270" y2="420" stroke="#ff007f" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(20, 20)"><circle cx="36" cy="36" r="34" fill="rgba(15,23,42,0.85)" stroke="#00f5ff" stroke-width="2"/><circle cx="36" cy="36" r="4" fill="#00f5ff"/><circle cx="24" cy="22" r="3" fill="#ff007f"/><circle cx="48" cy="45" r="3" fill="#ffe600"/></g>
    <g transform="translate(100, 28)"><rect width="180" height="12" rx="6" fill="#1e293b"/><rect width="155" height="12" rx="6" fill="url(#nPink)"/><text x="5" y="10" font-family="-apple-system,system-ui,sans-serif" font-size="9" font-weight="800" fill="#fff">HP 4,850 / 5,200</text><rect y="16" width="140" height="8" rx="4" fill="#1e293b"/><rect y="16" width="120" height="8" rx="4" fill="url(#nCyan)"/></g>
    <g transform="translate(260, 620)"><circle cx="40" cy="40" r="34" fill="rgba(255,0,127,0.3)" stroke="#ff007f" stroke-width="2.5"/><text x="40" y="47" font-size="20" text-anchor="middle">⚔️</text><circle cx="100" cy="15" r="22" fill="rgba(0,245,255,0.3)" stroke="#00f5ff" stroke-width="2"/><text x="100" y="21" font-size="14" fill="#fff" text-anchor="middle">⚡</text><circle cx="115" cy="65" r="22" fill="rgba(255,230,0,0.3)" stroke="#ffe600" stroke-width="2"/><text x="115" y="71" font-size="14" fill="#fff" text-anchor="middle">🛡</text></g>
  </g>
</svg>
`);

const CYBER_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#180a1c"/><stop offset="100%" stop-color="#240728"/></linearGradient>
    <linearGradient id="slash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00f5ff"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#ff007f"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#ff007f" text-anchor="middle">HACK &amp; SLASH ACTION</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">HIGH-SPEED COMBAT</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Fluid 60/120 FPS Aerial Combos &amp; Parries</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090a18" stroke="#ff007f" stroke-width="2"/>
    <path d="M60 460 Q210 200 370 420" fill="none" stroke="url(#slash)" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
    <path d="M80 470 Q210 240 350 440" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(40, 90)"><text x="0" y="36" font-family="-apple-system,system-ui,sans-serif" font-size="48" font-weight="900" fill="#ffe600">142</text><text x="95" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="900" fill="#ff007f">COMBO HITS</text><text x="95" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#00f5ff">CRITICAL STRIKE! +380%</text></g>
    <text x="240" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffe600">CRIT 98,420</text>
    <text x="270" y="360" font-family="-apple-system,system-ui,sans-serif" font-size="22" font-weight="800" fill="#ff007f">45,120</text>
    <text x="210" y="390" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="700" fill="#00f5ff">PARRY!</text>
    <circle cx="280" cy="420" r="45" fill="#180e29" stroke="#ff007f" stroke-width="4"/>
    <circle cx="140" cy="490" r="24" fill="#00f5ff"/>
    <path d="M115 515 L165 515 L175 580 L115 580 Z" fill="#ffffff"/>
    <line x1="165" y1="510" x2="230" y2="430" stroke="#00f5ff" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>
`);

const CYBER_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="cs3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#0a1928"/><stop offset="100%" stop-color="#072233"/></linearGradient>
    <linearGradient id="leg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffe600"/><stop offset="100%" stop-color="#ff9900"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#cs3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#ffe600" text-anchor="middle">MECH ARSENAL &amp; GEAR</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">UPGRADE COMBAT MECHS</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">50+ Modular Weapons &amp; Cybernetic Exosuits</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#090e1c" stroke="#ffe600" stroke-width="2"/>
    <rect x="25" y="30" width="362" height="230" rx="20" fill="#11182c" stroke="#334155" stroke-width="1.5"/>
    <text x="45" y="60" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="url(#leg)">★ LEGENDARY EXOSUIT</text>
    <text x="45" y="90" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="900" fill="#ffffff">Titan Striker MK-IV</text>
    <circle cx="290" cy="140" r="50" fill="none" stroke="#00f5ff" stroke-width="2" stroke-dasharray="6 4"/>
    <polygon points="290,105 320,140 290,175 260,140" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" stroke-width="2"/>
    <g transform="translate(45, 115)">
      <text x="0" y="15" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">ATK</text><rect x="35" y="6" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="6" width="120" height="9" rx="4" fill="#ff007f"/>
      <text x="0" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">DEF</text><rect x="35" y="29" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="29" width="105" height="9" rx="4" fill="#00f5ff"/>
      <text x="0" y="61" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#94a3b8">SPD</text><rect x="35" y="52" width="130" height="9" rx="4" fill="#1e293b"/><rect x="35" y="52" width="115" height="9" rx="4" fill="#ffe600"/>
    </g>
    <g transform="translate(25, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#ff007f" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🗡</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Plasma Blade</text></g>
    <g transform="translate(150, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#00f5ff" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🔫</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Rail Cannon</text></g>
    <g transform="translate(275, 280)"><rect width="112" height="100" rx="16" fill="#141e34" stroke="#ffe600" stroke-width="2"/><text x="56" y="46" font-size="26" text-anchor="middle">🛡</text><text x="56" y="78" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Force Field</text></g>
    <rect x="25" y="405" width="362" height="50" rx="15" fill="url(#leg)"/>
    <text x="206" y="436" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="900" fill="#000" text-anchor="middle">⚡ UPGRADE TO TIER V (+24% PWR)</text>
  </g>
</svg>
`);

const CYBER_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs><linearGradient id="cs4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050714"/><stop offset="60%" stop-color="#140722"/><stop offset="100%" stop-color="#280520"/></linearGradient></defs>
  <rect width="460" height="996" fill="url(#cs4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#00f5ff" text-anchor="middle">ONLINE MULTIPLAYER</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">10-PLAYER CO-OP RAIDS</text>
  <text x="230" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Conquer Colossal Titan Bosses Together</text>
  <g transform="translate(24, 185)">
    <rect width="412" height="760" rx="36" fill="#0b0718" stroke="#ff007f" stroke-width="2"/>
    <rect x="20" y="25" width="372" height="70" rx="16" fill="#190d2e" stroke="#ff007f" stroke-width="1.5"/>
    <text x="35" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="900" fill="#ff007f">☠️ RAID BOSS: TITAN DREADNOUGHT</text>
    <text x="375" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#ffe600" text-anchor="end">PHASE 3/3</text>
    <rect x="35" y="60" width="340" height="12" rx="6" fill="#33103e"/><rect x="35" y="60" width="180" height="12" rx="6" fill="#ff007f"/>
    <g transform="translate(20, 115)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#00f5ff" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#00f5ff"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Viper (Tank)</text></g>
    <g transform="translate(20, 165)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#ff007f" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#ff007f"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Nova (DPS)</text></g>
    <g transform="translate(20, 215)"><rect width="130" height="40" rx="10" fill="#140e2b" stroke="#10b981" stroke-width="1"/><circle cx="20" cy="20" r="10" fill="#10b981"/><text x="38" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff">Echo (Heal)</text></g>
    <circle cx="280" cy="220" r="80" fill="#200d36" stroke="#ff007f" stroke-width="3"/>
    <text x="280" y="235" font-size="64" text-anchor="middle">👾</text>
    <line x1="160" y1="360" x2="250" y2="250" stroke="#00f5ff" stroke-width="4" stroke-dasharray="10 5"/>
    <line x1="220" y1="380" x2="270" y2="280" stroke="#ffe600" stroke-width="4"/>
    <line x1="300" y1="380" x2="290" y2="290" stroke="#ff007f" stroke-width="5"/>
  </g>
</svg>
`);

// // --- Online Video Courses & Skills Neutral Vector Assets (SkillSphere - Royal Blue Style) ---
const SKILL_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="skBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050d1a"/>
      <stop offset="50%" stop-color="#0a1931"/>
      <stop offset="100%" stop-color="#0f2b5c"/>
    </linearGradient>
    <linearGradient id="skBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="skCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="skGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="skGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#2563eb" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#skBg)"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#skBlue)" stroke-width="12" stroke-dasharray="720 180" stroke-linecap="round" opacity="0.4"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#skBlue)" stroke-width="12" stroke-dasharray="540 360" stroke-linecap="round" filter="url(#skGlow)"/>
  <rect x="136" y="146" width="240" height="220" rx="44" fill="#0d1f3c" stroke="#1e3a68" stroke-width="3"/>
  <polygon points="216,195 324,256 216,317" fill="url(#skBlue)" filter="url(#skGlow)"/>
  <polygon points="216,195 285,256 216,280" fill="url(#skCyan)" opacity="0.85"/>
  <path d="M190 146 L 256 112 L 322 146" fill="none" stroke="url(#skGold)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="112" r="6" fill="#fbbf24"/>
  <path d="M256 112 Q 330 118 340 155" fill="none" stroke="#fbbf24" stroke-width="3"/>
  <circle cx="176" cy="330" r="4" fill="#38bdf8"/>
  <circle cx="196" cy="330" r="4" fill="#38bdf8"/>
  <circle cx="216" cy="330" r="4" fill="#38bdf8"/>
  <rect x="236" y="328" width="100" height="4" rx="2" fill="#60a5fa"/>
  <path d="M370 140 L 375 152 L 387 157 L 375 162 L 370 174 L 365 162 L 353 157 L 365 152 Z" fill="#fbbf24"/>
</svg>
`);

const SKILL_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="sfeatBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#040b17"/>
      <stop offset="50%" stop-color="#081833"/>
      <stop offset="100%" stop-color="#0d2652"/>
    </linearGradient>
    <linearGradient id="sfeatBlue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="sfeatCyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#sfeatBg)"/>
  <circle cx="860" cy="180" r="260" fill="#2563eb" opacity="0.14"/>
  <circle cx="160" cy="420" r="180" fill="#0284c7" opacity="0.1"/>
  <g transform="translate(80, 85)">
    <rect width="90" height="90" rx="24" fill="#0b1a36" stroke="#1d4e89" stroke-width="2"/>
    <polygon points="38,28 64,45 38,62" fill="url(#sfeatBlue)"/>
    <rect x="110" y="16" width="180" height="28" rx="14" fill="rgba(37,99,235,0.2)"/>
    <text x="200" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="1.5" fill="#60a5fa" text-anchor="middle">ONLINE VIDEO COURSES</text>
    <text x="110" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="34" font-weight="900" fill="#ffffff">SkillSphere</text>
    <text x="0" y="135" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="900" fill="#ffffff">Learn In-Demand Skills</text>
    <text x="0" y="185" font-family="-apple-system,system-ui,sans-serif" font-size="44" font-weight="900" fill="url(#sfeatBlue)">From Top Tech Mentors</text>
    <text x="0" y="235" font-family="-apple-system,system-ui,sans-serif" font-size="17" fill="#94a3b8">Over 5,000+ video courses in Coding, AI, Design &amp; Business with certificates.</text>
    <g transform="translate(0, 275)">
      <rect width="170" height="42" rx="21" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="1.5"/>
      <text x="85" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#60a5fa" text-anchor="middle">🎬 5,000+ Courses</text>
      <rect x="185" y="0" width="160" height="42" rx="21" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="265" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#38bdf8" text-anchor="middle">⚡ 2x Speed &amp; PiP</text>
      <rect x="360" y="0" width="180" height="42" rx="21" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="450" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fbbf24" text-anchor="middle">🏅 Verified Degrees</text>
    </g>
  </g>
  <g transform="translate(680, 80)">
    <rect width="270" height="340" rx="28" fill="#0b172e" stroke="#1d3d6e" stroke-width="2"/>
    <rect x="20" y="20" width="230" height="135" rx="16" fill="#060f21"/>
    <circle cx="135" cy="80" r="26" fill="url(#sfeatBlue)"/>
    <polygon points="128,70 148,80 128,90" fill="#fff"/>
    <rect x="30" y="30" width="75" height="22" rx="11" fill="rgba(0,0,0,0.6)"/>
    <text x="67" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fbbf24" text-anchor="middle">★ BESTSELLER</text>
    <rect x="175" y="30" width="65" height="22" rx="11" fill="rgba(0,0,0,0.6)"/>
    <text x="207" y="45" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">1080p HD</text>
    <text x="20" y="180" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">Full-Stack AI &amp; Web 2026</text>
    <text x="20" y="202" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Dr. Angela Yu · 48 Hours Video</text>
    <text x="20" y="228" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#fbbf24">★ 4.9 (48.5K ratings)</text>
    <rect x="20" y="244" width="230" height="8" rx="4" fill="#13233f"/>
    <rect x="20" y="244" width="160" height="8" rx="4" fill="url(#sfeatBlue)"/>
    <text x="20" y="270" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">Progress: 68% (32/48h)</text>
    <g transform="translate(20, 285)">
      <text x="0" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="900" fill="#fff">$12.99</text>
      <text x="68" y="22" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#64748b" text-decoration="line-through">$84.99</text>
      <rect x="150" y="0" width="80" height="28" rx="14" fill="url(#sfeatBlue)"/>
      <text x="190" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">ENROLL</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_1 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks1)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">5,000+ ONLINE COURSES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Master In-Demand Skills</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp1)" text-anchor="middle">In Tech, AI &amp; Business</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Top-rated video lessons with real projects and certificates</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="52" rx="16" fill="#0a1832" stroke="#1b3660" stroke-width="1.5"/>
    <text x="20" y="32" font-size="16">🔍</text>
    <text x="50" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8">Search Python, Figma, AI, Finance...</text>
  </g>
  <g transform="translate(30, 305)">
    <rect x="0" y="0" width="55" height="34" rx="17" fill="#2563eb"/><text x="27" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">All</text>
    <rect x="65" y="0" width="85" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="107" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Coding</text>
    <rect x="160" y="0" width="85" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="202" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">AI &amp; ML</text>
    <rect x="255" y="0" width="75" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="292" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Design</text>
    <rect x="340" y="0" width="60" height="34" rx="17" fill="#0a1832" stroke="#1b3660" stroke-width="1"/><text x="370" y="21" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" text-anchor="middle">Data</text>
  </g>
  <g transform="translate(30, 355)">
    <rect width="400" height="240" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <rect x="20" y="20" width="130" height="85" rx="12" fill="#060e1f"/>
    <circle cx="85" cy="62" r="18" fill="#2563eb"/>
    <polygon points="81,55 93,62 81,69" fill="#fff"/>
    <rect x="25" y="25" width="60" height="18" rx="9" fill="rgba(0,0,0,0.7)"/>
    <text x="55" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle">★ BESTSELLER</text>
    <text x="165" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">100 Days of Code: Python &amp;</text>
    <text x="165" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#60a5fa">Generative AI Masterclass</text>
    <text x="165" y="86" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Dr. Angela Yu · 62h HD Video</text>
    <text x="165" y="104" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fbbf24">4.9 ★★★★★ <tspan fill="#64748b">(68K reviews)</tspan></text>
    <rect x="20" y="125" width="360" height="8" rx="4" fill="#13233f"/>
    <rect x="20" y="125" width="260" height="8" rx="4" fill="url(#skp1)"/>
    <text x="20" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Progress: 72% Completed (44/62 hrs)</text>
    <text x="380" y="155" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="end">Resume Lesson ▶</text>
    <g transform="translate(20, 180)">
      <rect width="360" height="42" rx="21" fill="#2563eb"/>
      <text x="180" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">CONTINUE WATCHING: LESSON 34</text>
    </g>
  </g>
  <g transform="translate(30, 615)">
    <rect width="400" height="150" rx="20" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1"/>
    <rect x="20" y="20" width="110" height="75" rx="12" fill="#060e1f"/>
    <circle cx="75" cy="57" r="16" fill="#0284c7"/>
    <polygon points="72,50 82,57 72,64" fill="#fff"/>
    <text x="145" y="42" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">UI/UX Design Systems</text>
    <text x="145" y="64" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#38bdf8">Figma to Production Code</text>
    <text x="145" y="86" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">Daniel Walter Scott · 24h Video</text>
    <g transform="translate(20, 110)">
      <text x="0" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="18" font-weight="900" fill="#fff">$11.99</text>
      <text x="65" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#64748b" text-decoration="line-through">$74.99</text>
      <rect x="250" y="0" width="110" height="30" rx="15" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/>
      <text x="305" y="19" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="700" fill="#60a5fa" text-anchor="middle">Add to Cart</text>
    </g>
  </g>
  <g transform="translate(30, 785)">
    <rect width="400" height="90" rx="20" fill="#0c2044" stroke="#2563eb" stroke-width="1.5"/>
    <text x="45" y="55" font-size="34">🎯</text>
    <text x="90" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="17" font-weight="800" fill="#dbeafe">30 MINS DAILY STUDY GOAL</text>
    <text x="90" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#93c5fd">24 consecutive days · Top 2% among tech learners</text>
  </g>
</svg>
`);

const SKILL_SHOT_2 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks2)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">HD VIDEO CLASSROOM</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Stream in 1080p with</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp2)" text-anchor="middle">2x Speed &amp; Transcripts</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Picture-in-picture, bookmarks, and background offline playback</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="235" rx="20" fill="#050e1c" stroke="#163259" stroke-width="2"/>
    <rect x="20" y="20" width="360" height="150" rx="12" fill="#0a172e"/>
    <text x="35" y="50" font-family="Courier,monospace" font-size="13" fill="#60a5fa">import <tspan fill="#38bdf8">torch.nn</tspan> as nn</text>
    <text x="35" y="75" font-family="Courier,monospace" font-size="13" fill="#94a3b8">class <tspan fill="#fbbf24">TransformerBlock</tspan>(nn.Module):</text>
    <text x="55" y="100" font-family="Courier,monospace" font-size="13" fill="#34d399">def __init__(self, d_model, heads):</text>
    <text x="75" y="125" font-family="Courier,monospace" font-size="13" fill="#e2e8f0">self.attention = MultiHead(d_model)</text>
    <circle cx="200" cy="95" r="28" fill="rgba(37,99,235,0.85)"/>
    <rect x="191" y="84" width="6" height="22" rx="2" fill="#fff"/>
    <rect x="203" y="84" width="6" height="22" rx="2" fill="#fff"/>
    <g transform="translate(20, 185)">
      <rect width="360" height="6" rx="3" fill="#132644"/>
      <rect width="210" height="6" rx="3" fill="url(#skp2)"/>
      <circle cx="210" cy="3" r="7" fill="#fff"/>
      <text x="0" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">14:32 / 28:00</text>
      <rect x="250" y="12" width="45" height="20" rx="10" fill="#132644"/>
      <text x="272" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">1.5x</text>
      <rect x="305" y="12" width="55" height="20" rx="10" fill="#132644"/>
      <text x="332" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#60a5fa" text-anchor="middle">1080p</text>
    </g>
  </g>
  <g transform="translate(30, 495)">
    <rect width="400" height="360" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Section 4: Attention Mechanisms</text>
    <text x="375" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="end">3/8 Completed</text>
    <g transform="translate(20, 60)">
      <rect width="360" height="58" rx="14" fill="#0e2246"/>
      <circle cx="30" cy="29" r="14" fill="#065f46"/>
      <text x="30" y="34" font-size="12" fill="#34d399" text-anchor="middle">✓</text>
      <text x="56" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#e2e8f0">1. Intuition Behind Self-Attention</text>
      <text x="56" y="46" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">08:14 mins · Lecture video</text>
    </g>
    <g transform="translate(20, 130)">
      <rect width="360" height="66" rx="14" fill="#10254c" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="30" cy="33" r="14" fill="#2563eb"/>
      <polygon points="26,26 36,33 26,40" fill="#fff"/>
      <text x="56" y="30" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="800" fill="#fff">2. PyTorch Matrix Dot-Product Attention</text>
      <text x="56" y="50" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#93c5fd">▶ Currently Playing · 14:32 / 28:00</text>
    </g>
    <g transform="translate(20, 208)">
      <rect width="360" height="58" rx="14" fill="#0e2246"/>
      <circle cx="30" cy="29" r="14" fill="#173362"/>
      <text x="30" y="34" font-size="12" fill="#94a3b8" text-anchor="middle">3</text>
      <text x="56" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">3. Multi-Head Scaled Projection</text>
      <text x="56" y="46" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8">21:40 mins · Video &amp; Code Lab</text>
    </g>
    <g transform="translate(20, 285)">
      <rect width="360" height="50" rx="16" fill="#09203a" stroke="#38bdf8" stroke-width="1"/>
      <text x="25" y="31" font-size="18">💾</text>
      <text x="55" y="31" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8">Downloaded for Offline Watching · 1.4 GB</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_3 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks3)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">HANDS-ON PRACTICE</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Interactive Code Labs &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp3)" text-anchor="middle">Direct Mentor Q&amp;A</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Test your code in real-time and get fast answers from expert instructors</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="340" rx="22" fill="#071326" stroke="#193660" stroke-width="1.5"/>
    <rect x="25" y="20" width="115" height="26" rx="13" fill="rgba(56,189,248,0.18)"/>
    <text x="82" y="37" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle">CODING LAB #14</text>
    <text x="25" y="72" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fff">Calculate Scaled Attention Scores</text>
    <rect x="20" y="90" width="360" height="150" rx="14" fill="#050e1c" stroke="#162e52" stroke-width="1"/>
    <text x="35" y="120" font-family="Courier,monospace" font-size="12" fill="#60a5fa">def <tspan fill="#38bdf8">scaled_dot_product</tspan>(q, k, v):</text>
    <text x="50" y="145" font-family="Courier,monospace" font-size="12" fill="#94a3b8">d_k = q.size(-1)</text>
    <text x="50" y="170" font-family="Courier,monospace" font-size="12" fill="#cbd5e1">scores = torch.matmul(q, k.T) / math.sqrt(d_k)</text>
    <text x="50" y="195" font-family="Courier,monospace" font-size="12" fill="#34d399">return torch.softmax(scores, dim=-1) @ v</text>
    <g transform="translate(20, 260)">
      <rect width="180" height="46" rx="23" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="1.5"/>
      <text x="90" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#34d399" text-anchor="middle">✓ 8/8 Tests Passed</text>
      <rect x="200" y="0" width="160" height="46" rx="23" fill="url(#skp3)"/>
      <text x="280" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">SUBMIT LAB ▶</text>
    </g>
  </g>
  <g transform="translate(30, 595)">
    <rect width="400" height="260" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">Course Q&amp;A Community (4,210 Discussions)</text>
    <g transform="translate(20, 55)">
      <circle cx="20" cy="20" r="16" fill="#163259"/>
      <text x="20" y="25" font-size="12" fill="#fff" text-anchor="middle">👨‍💻</text>
      <text x="45" y="18" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">Student Alex · 2 hours ago</text>
      <text x="45" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#cbd5e1">&quot;Why do we divide by sqrt(d_k) before softmax?&quot;</text>
    </g>
    <g transform="translate(20, 125)">
      <rect width="360" height="110" rx="16" fill="#0d2248" stroke="#2563eb" stroke-width="1"/>
      <circle cx="25" cy="28" r="16" fill="#2563eb"/>
      <text x="25" y="33" font-size="12" fill="#fff" text-anchor="middle">🎓</text>
      <text x="50" y="24" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" fill="#60a5fa">INSTRUCTOR DR. ANGELA · VERIFIED ANSWER</text>
      <text x="50" y="44" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#34d399">✓ Top Instructor Response</text>
      <text x="20" y="74" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#e2e8f0">&quot;For large d_k, dot products grow large, pushing softmax into regions with tiny gradients. Scaling prevents this!&quot;</text>
    </g>
  </g>
</svg>
`);

const SKILL_SHOT_4 = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs>
    <linearGradient id="sks4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#040b17"/><stop offset="50%" stop-color="#081833"/><stop offset="100%" stop-color="#0e2752"/></linearGradient>
    <linearGradient id="skp4" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient>
  </defs>
  <rect width="460" height="996" fill="url(#sks4)"/>
  <text x="230" y="80" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#38bdf8" text-anchor="middle">VERIFIED CERTIFICATES</text>
  <text x="230" y="125" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">Earn Credentials &amp;</text>
  <text x="230" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="url(#skp4)" text-anchor="middle">Accelerate Your Career</text>
  <text x="230" y="195" font-family="-apple-system,system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Shareable LinkedIn credentials backed by hands-on projects</text>
  <g transform="translate(30, 235)">
    <rect width="400" height="260" rx="22" fill="#091b38" stroke="#1d4ed8" stroke-width="2"/>
    <circle cx="350" cy="50" r="26" fill="#fbbf24"/>
    <text x="350" y="58" font-size="24" text-anchor="middle">🏅</text>
    <rect x="30" y="25" width="130" height="24" rx="12" fill="rgba(37,99,235,0.2)"/>
    <text x="95" y="41" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="800" fill="#60a5fa" text-anchor="middle">OFFICIAL CERTIFICATE</text>
    <text x="30" y="82" font-family="-apple-system,system-ui,sans-serif" font-size="19" font-weight="900" fill="#fff">Certificate of Completion</text>
    <text x="30" y="105" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#94a3b8">This certifies that</text>
    <text x="30" y="132" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="900" fill="#38bdf8">Alex Morgan</text>
    <text x="30" y="156" font-family="-apple-system,system-ui,sans-serif" font-size="13" fill="#cbd5e1">has successfully mastered all requirements for:</text>
    <text x="30" y="180" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="800" fill="#fbbf24">Full-Stack Web &amp; AI Engineering (48 Hours)</text>
    <text x="30" y="215" font-family="Courier,monospace" font-size="11" fill="#64748b">ID: SKILL-2026-X94B · Issued Oct 2026</text>
    <text x="370" y="215" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="end">✓ VERIFIED</text>
    <line x1="30" y1="230" x2="370" y2="230" stroke="#163259" stroke-width="1"/>
    <text x="200" y="248" font-family="-apple-system,system-ui,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Accredited by SkillSphere Industry Partner Network</text>
  </g>
  <g transform="translate(30, 515)">
    <rect width="400" height="54" rx="27" fill="#0077b5"/>
    <text x="200" y="34" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">in  ADD CERTIFICATE TO LINKEDIN</text>
  </g>
  <g transform="translate(30, 580)">
    <rect width="400" height="50" rx="25" fill="#0b1d3d" stroke="#1d4275" stroke-width="1.5"/>
    <text x="200" y="31" font-family="-apple-system,system-ui,sans-serif" font-size="14" font-weight="700" fill="#cbd5e1" text-anchor="middle">📄 Download High-Res PDF &amp; Badge</text>
  </g>
  <g transform="translate(30, 650)">
    <rect width="400" height="210" rx="22" fill="#0b1a36" stroke="#1c3a6b" stroke-width="1.5"/>
    <text x="25" y="38" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="800" fill="#fff">Mastered Technical Competencies</text>
    <g transform="translate(25, 60)">
      <rect x="0" y="0" width="105" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="52" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">Python 3.12</text>
      <rect x="115" y="0" width="115" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="172" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">PyTorch AI</text>
      <rect x="240" y="0" width="105" height="32" rx="16" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" stroke-width="1"/><text x="292" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fbbf24" text-anchor="middle">React 19</text>
    </g>
    <g transform="translate(25, 105)">
      <rect x="0" y="0" width="115" height="32" rx="16" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1"/><text x="57" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="middle">REST APIs</text>
      <rect x="125" y="0" width="115" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="182" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">UI/UX Figma</text>
      <rect x="250" y="0" width="95" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="297" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">AWS Cloud</text>
    </g>
    <text x="25" y="175" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">3 Capstone Projects verified by senior engineering mentors</text>
  </g>
</svg>
`);

// Backwards compatibility aliases

// Store Preview Studio Preset Assets
const STUDIO_FEATURE = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="sfeat-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0D1322"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="sfeat-kicker" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#00D085"/>
      <stop offset="100%" stop-color="#34D399"/>
    </linearGradient>
    <linearGradient id="sfeat-btn" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#00D085"/>
    </linearGradient>
    <linearGradient id="sfeat-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="sfeat-border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#00D085" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#818CF8" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="sfeat-k-sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-1.5" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <pattern id="sfeat-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1024" height="500" fill="url(#sfeat-bg)"/>
  <rect width="1024" height="500" fill="url(#sfeat-grid)"/>

  <!-- Ambient Multi-Color Lights -->
  <circle cx="860" cy="140" r="280" fill="#38BDF8" opacity="0.12"/>
  <circle cx="160" cy="420" r="240" fill="#818CF8" opacity="0.10"/>
  <circle cx="560" cy="480" r="220" fill="#00D085" opacity="0.08"/>

  <!-- Left Header with App Icon -->
  <g transform="translate(72, 65)">
    <rect width="76" height="76" rx="20" fill="url(#sfeat-sq-bg)" stroke="url(#sfeat-border)" stroke-width="1.5"/>
    <g transform="scale(0.55) translate(20, 20)">
      <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
      <g filter="url(#sfeat-k-sh)">
        <path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/>
      </g>
    </g>
  </g>

  <text x="172" y="105" font-family="-apple-system,system-ui,sans-serif" font-size="36" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Store Preview Studio</text>
  <text x="172" y="132" font-family="-apple-system,system-ui,sans-serif" font-size="12.5" font-weight="700" fill="url(#sfeat-kicker)" letter-spacing="1.5">DUAL-STORE PREVIEW &amp; METADATA STUDIO</text>

  <text x="72" y="200" font-family="-apple-system,system-ui,sans-serif" font-size="27" font-weight="700" fill="#ffffff">Design &amp; Validate Realistic Store Mockups</text>
  <text x="72" y="235" font-family="-apple-system,system-ui,sans-serif" font-size="15" fill="#94A3B8">App Store &amp; Google Play live viewports, pre-flight audits, 100% offline in your browser.</text>

  <!-- 3 Colorful Feature Badges (Zero Emoji, Clean Vector Icons) -->
  <!-- Badge 1: Cyan (Viewports) -->
  <g transform="translate(72, 275)">
    <rect width="190" height="42" rx="21" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.35)" stroke-width="1.2"/>
    <rect x="20" y="12" width="10" height="18" rx="2" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
    <rect x="25" y="15" width="10" height="18" rx="2" fill="#0D1322" stroke="#38BDF8" stroke-width="1.8"/>
    <text x="44" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#38BDF8">Dual Live Viewports</text>
  </g>

  <!-- Badge 2: Violet (Pre-Flight Audit) -->
  <g transform="translate(276, 275)">
    <rect width="180" height="42" rx="21" fill="rgba(192,132,252,0.12)" stroke="rgba(192,132,252,0.35)" stroke-width="1.2"/>
    <path d="M 24 13 L 30 16 L 30 23 C 30 27 24 30 24 30 C 24 30 18 27 18 23 L 18 16 Z" fill="none" stroke="#C084FC" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 21 21 L 23 23 L 27 19" fill="none" stroke="#C084FC" stroke-width="1.8" stroke-linecap="round"/>
    <text x="39" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#C084FC">Pre-Flight Audit</text>
  </g>

  <!-- Badge 3: Emerald (Client-Side) -->
  <g transform="translate(470, 275)">
    <rect width="180" height="42" rx="21" fill="rgba(0,208,133,0.12)" stroke="rgba(0,208,133,0.35)" stroke-width="1.2"/>
    <rect x="18" y="18" width="14" height="11" rx="2" fill="none" stroke="#34D399" stroke-width="1.8"/>
    <path d="M 21 18 L 21 15 C 21 12.8 29 12.8 29 15 L 29 18" fill="none" stroke="#34D399" stroke-width="1.8"/>
    <text x="40" y="26" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="700" fill="#34D399">100% Client-Side</text>
  </g>

  <!-- Spec Highlights Pill Row -->
  <g transform="translate(72, 345)">
    <rect width="578" height="85" rx="16" fill="#0F172A" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="24" y="32" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#94A3B8">STANDALONE POWER</text>
    <text x="24" y="58" font-family="-apple-system,system-ui,sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">Zero Subscriptions · Zero Telemetry · Offline Ready</text>
    <rect x="440" y="24" width="115" height="36" rx="10" fill="rgba(56,189,248,0.15)"/>
    <text x="497" y="47" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#38BDF8" text-anchor="middle">v2.1 PRO</text>
  </g>

  <!-- Right Hero Card (Mockup Pro Window) -->
  <g transform="translate(720, 50)">
    <rect width="245" height="395" rx="26" fill="#0D1322" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.6))"/>
    
    <!-- Window Bar -->
    <circle cx="28" cy="24" r="5" fill="#EF4444"/>
    <circle cx="44" cy="24" r="5" fill="#F59E0B"/>
    <circle cx="60" cy="24" r="5" fill="#10B981"/>
    <text x="140" y="28" font-family="-apple-system,system-ui,sans-serif" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">previewstudio.app</text>

    <!-- Mini App Header inside window -->
    <rect x="18" y="44" width="209" height="52" rx="14" fill="#161F33" stroke="rgba(255,255,255,0.06)"/>
    <rect x="28" y="54" width="32" height="32" rx="8" fill="url(#sfeat-sq-bg)" stroke="rgba(0,208,133,0.3)"/>
    <g transform="scale(0.23) translate(128, 240)">
      <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
      <path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/>
    </g>
    <text x="68" y="68" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff">Preview Studio</text>
    <text x="68" y="81" font-family="-apple-system,system-ui,sans-serif" font-size="9.5" fill="#94A3B8">Store Mockup Pro</text>

    <!-- Rating Banner (Amber) -->
    <rect x="18" y="106" width="209" height="70" rx="14" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)" stroke-width="1"/>
    <text x="122" y="138" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="800" fill="#FBBF24" text-anchor="middle">4.9 ★</text>
    <text x="122" y="160" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle">#1 Developer Tools</text>

    <!-- Checklist Widget (Cyan & Emerald) -->
    <rect x="18" y="186" width="209" height="120" rx="14" fill="#141B2D" stroke="rgba(255,255,255,0.06)"/>
    <text x="32" y="214" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#38BDF8">✓ ITMS-90717 Zero Alpha</text>
    <text x="32" y="244" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#34D399">✓ Dual-Store Live Sync</text>
    <text x="32" y="274" font-family="-apple-system,system-ui,sans-serif" font-size="11.5" font-weight="700" fill="#C084FC">✓ 3x Retina PNG Mockup</text>

    <!-- Action Button -->
    <rect x="24" y="322" width="197" height="44" rx="22" fill="url(#sfeat-btn)"/>
    <text x="122" y="349" font-family="-apple-system,system-ui,sans-serif" font-size="13" font-weight="800" fill="#080C14" text-anchor="middle" letter-spacing="0.5">EXPORT MOCKUP</text>
  </g>
</svg>
`);

// Store Preview Studio :: default preset screenshots (redesigned)
// 4 inline SVGs, viewBox 0 0 460 996, rendered at 1290 x 2796. Self-contained, no external assets.

const STUDIO_SHOT_1 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s1bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s1gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s1gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s1ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s1ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s1tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s1sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s1scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s1okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s1btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s1t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s1t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s1t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s1ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s1dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s1ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s1ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s1K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s1ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s1bg)"/><circle cx="60" cy="120" r="270" fill="url(#s1gc)"/><circle cx="440" cy="330" r="250" fill="url(#s1gi)"/><circle cx="90" cy="930" r="300" fill="url(#s1ge)"/><circle cx="450" cy="880" r="190" fill="url(#s1ga)"/><rect width="460" height="996" fill="url(#s1dots)"/><rect x="124" y="50" width="211" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="140" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">DUAL-STORE VIEWPORT</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">Live Side-by-Side</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s1tg)" text-anchor="middle">App Store &amp; Google Play</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Preview both store listings in real time</text><clipPath id="s1ci"><rect x="41" y="237" width="174" height="460" rx="29"/></clipPath><clipPath id="s1ca"><rect x="245" y="267" width="174" height="460" rx="24"/></clipPath><rect x="36" y="232" width="184" height="470" rx="34" fill="#0B1220" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><rect x="39" y="235" width="178" height="464" rx="31" fill="none" stroke="rgba(255,255,255,0.06)"/><rect x="41" y="237" width="174" height="460" rx="29" fill="url(#s1scr)"/><g clip-path="url(#s1ci)"><text x="60" y="258" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">9:41</text><rect x="98" y="245" width="60" height="17" rx="8.5" fill="#000"/><rect x="164" y="255" width="2.5" height="3" rx="1" fill="#fff"/><rect x="168" y="253" width="2.5" height="5" rx="1" fill="#fff"/><rect x="172" y="251" width="2.5" height="7" rx="1" fill="#fff"/><rect x="176" y="249" width="2.5" height="9" rx="1" fill="#fff"/><rect x="187" y="250" width="17" height="8" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.6"/><rect x="188.7" y="251.7" width="12" height="4.6" rx="1.2" fill="#fff"/><path d="M57 297 l-4 4 l4 4" fill="none" stroke="#0A84FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><text x="62" y="304" font-size="9.5" font-weight="500" fill="#0A84FF" text-anchor="start">Search</text><rect x="55" y="316" width="50" height="50" rx="12.5" fill="url(#s1ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s1K" transform="translate(80.0 341.0) scale(0.500)"/><text x="113" y="332" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">Store Preview Studio</text><text x="113" y="344" font-size="8" font-weight="400" fill="#94A3B8" text-anchor="start">Listing designer</text><rect x="113" y="351" width="46" height="19" rx="9.5" fill="#0A84FF"/><text x="136" y="364" font-size="9.5" font-weight="800" fill="#fff" text-anchor="middle">GET</text><text x="79.3" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4.9</text><text x="79.3" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">2.1K RATINGS</text><text x="128.0" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4+</text><text x="128.0" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">AGE</text><text x="176.7" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">#1</text><text x="176.7" y="410" font-size="6.5" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="0.6">IN TOOLS</text><line x1="103.7" y1="387" x2="103.7" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="152.3" y1="387" x2="152.3" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="55" y1="426" x2="201" y2="426" stroke="rgba(255,255,255,0.08)"/><text x="55" y="446" font-size="11" font-weight="700" fill="#fff" text-anchor="start">Preview</text><rect x="55" y="456" width="56" height="112" rx="9" fill="url(#s1t1)" stroke="rgba(255,255,255,0.12)"/><rect x="63" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="63" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="63" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="117" y="456" width="56" height="112" rx="9" fill="url(#s1t2)" stroke="rgba(255,255,255,0.12)"/><rect x="125" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="125" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="125" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="179" y="456" width="56" height="112" rx="9" fill="url(#s1t3)" stroke="rgba(255,255,255,0.12)"/><rect x="187" y="466" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="187" y="476" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="187" y="500" width="40" height="52" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="55" y="588" width="146" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="598" width="120" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="608" width="134" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="55" y="618" width="90" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="41" y="646" width="174" height="51" fill="#0B1220"/><line x1="41" y1="646" x2="215" y2="646" stroke="rgba(255,255,255,0.08)"/><rect x="52.4" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="58.4" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Today</text><rect x="87.2" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="93.2" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Games</text><rect x="122.0" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="128.0" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Apps</text><rect x="156.8" y="655" width="12" height="12" rx="3.5" fill="#64748B" fill-opacity="0.6"/><text x="162.8" y="679" font-size="5.8" font-weight="600" fill="#64748B" text-anchor="middle">Arcade</text><rect x="191.6" y="655" width="12" height="12" rx="3.5" fill="#0A84FF" fill-opacity="1"/><text x="197.6" y="679" font-size="5.8" font-weight="600" fill="#0A84FF" text-anchor="middle">Search</text><rect x="94" y="689" width="68" height="4" rx="2" fill="#fff" fill-opacity="0.5"/></g><rect x="240" y="262" width="184" height="470" rx="28" fill="#0B1220" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><rect x="243" y="265" width="178" height="464" rx="25" fill="none" stroke="rgba(255,255,255,0.06)"/><rect x="245" y="267" width="174" height="460" rx="24" fill="url(#s1scr)"/><g clip-path="url(#s1ca)"><text x="260" y="285" font-size="9.5" font-weight="700" fill="#fff" text-anchor="start">9:41</text><circle cx="332" cy="281" r="5.5" fill="#000" stroke="#1E293B"/><rect x="366" y="283" width="2.5" height="3" rx="1" fill="#fff"/><rect x="370" y="281" width="2.5" height="5" rx="1" fill="#fff"/><rect x="374" y="279" width="2.5" height="7" rx="1" fill="#fff"/><rect x="378" y="277" width="2.5" height="9" rx="1" fill="#fff"/><rect x="390" y="278" width="17" height="8" rx="2.5" fill="none" stroke="#fff" stroke-opacity="0.6"/><rect x="391.7" y="279.7" width="12" height="4.6" rx="1.2" fill="#fff"/><path d="M270 308 h-11 m4.5 -4.5 l-4.5 4.5 l4.5 4.5" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="392" cy="307" r="4.2" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M395 310 l3.5 3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="408" cy="308" r="1.1" fill="#fff"/><circle cx="408" cy="304" r="1.1" fill="#fff"/><circle cx="408" cy="312" r="1.1" fill="#fff"/><rect x="259" y="328" width="52" height="52" rx="14" fill="url(#s1ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s1K" transform="translate(285.0 354.0) scale(0.520)"/><text x="319" y="345" font-size="9" font-weight="700" fill="#fff" text-anchor="start">Store Preview Studio</text><text x="319" y="358" font-size="8" font-weight="600" fill="#34D399" text-anchor="start">Listing designer</text><text x="283.3" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4.9</text><text x="283.3" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">2.1K reviews</text><text x="332.0" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">10K+</text><text x="332.0" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Downloads</text><text x="380.7" y="399" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3+</text><text x="380.7" y="410" font-size="6.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Everyone</text><line x1="307.7" y1="387" x2="307.7" y2="413" stroke="rgba(255,255,255,0.1)"/><line x1="356.3" y1="387" x2="356.3" y2="413" stroke="rgba(255,255,255,0.1)"/><rect x="259" y="424" width="146" height="28" rx="14" fill="#01875F"/><text x="332" y="442" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Install</text><text x="332" y="468" font-size="8" font-weight="600" fill="#34D399" text-anchor="middle">Add to wishlist</text><text x="259" y="492" font-size="10.5" font-weight="700" fill="#fff" text-anchor="start">About this app</text><path d="M397 486 l5 5 l-5 5" fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="259" y="502" width="146" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="512" width="122" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="522" width="136" height="4" rx="2" fill="#fff" fill-opacity="0.12"/><rect x="259" y="540" width="56" height="104" rx="8" fill="url(#s1t2)" stroke="rgba(255,255,255,0.12)"/><rect x="267" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="267" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="267" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="321" y="540" width="56" height="104" rx="8" fill="url(#s1t1)" stroke="rgba(255,255,255,0.12)"/><rect x="329" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="329" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="329" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="383" y="540" width="56" height="104" rx="8" fill="url(#s1t3)" stroke="rgba(255,255,255,0.12)"/><rect x="391" y="550" width="30" height="5" rx="2.5" fill="#fff" fill-opacity="0.75"/><rect x="391" y="560" width="22" height="3.5" rx="1.8" fill="#fff" fill-opacity="0.35"/><rect x="391" y="584" width="40" height="46" rx="6" fill="#0F172A" fill-opacity="0.65"/><rect x="245" y="668" width="174" height="59" fill="#0B1220"/><circle cx="266.8" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="266.8" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Games</text><circle cx="310.2" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="310.2" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Apps</text><rect x="335.8" y="674" width="36" height="20" rx="10" fill="#01875F" fill-opacity="0.4"/><circle cx="353.8" cy="684" r="5.5" fill="#34D399" fill-opacity="1"/><text x="353.8" y="705" font-size="6.2" font-weight="600" fill="#E2E8F0" text-anchor="middle">Search</text><circle cx="397.2" cy="684" r="5.5" fill="#64748B" fill-opacity="0.7"/><text x="397.2" y="705" font-size="6.2" font-weight="600" fill="#64748B" text-anchor="middle">Books</text><rect x="302" y="716" width="60" height="4" rx="2" fill="#fff" fill-opacity="0.5"/></g><rect x="70" y="752" width="116" height="26" rx="13.0" fill="#0A84FF" fill-opacity="0.14" stroke="#0A84FF" stroke-opacity="0.38"/><text x="128.0" y="768.42" font-size="9.5" font-weight="700" fill="#7DB8FF" text-anchor="middle" letter-spacing="1.2">APP STORE</text><rect x="266" y="752" width="132" height="26" rx="13.0" fill="#34D399" fill-opacity="0.14" stroke="#34D399" stroke-opacity="0.38"/><text x="332.0" y="768.42" font-size="9.5" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="1.2">GOOGLE PLAY</text><line x1="192" y1="765" x2="260" y2="765" stroke="#38BDF8" stroke-opacity="0.5" stroke-dasharray="3 4"/><circle cx="226" cy="765" r="11" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><g transform="translate(226 765) scale(0.58)" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M-9 -3 a9 9 0 0 1 15 -5"/><path d="M6 -13 v5 h-5"/><path d="M9 3 a9 9 0 0 1 -15 5"/><path d="M-6 13 v-5 h5"/></g><rect x="30" y="806" width="400" height="92" rx="22" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="806" width="400" height="92" rx="22" fill="url(#s1sh)"/><rect x="48" y="824" width="56" height="56" rx="16" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.4)"/><g transform="translate(76 852) scale(1.25)" fill="none" stroke="#38BDF8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-9 -3 a9 9 0 0 1 15 -5"/><path d="M6 -13 v5 h-5"/><path d="M9 3 a9 9 0 0 1 -15 5"/><path d="M-6 13 v-5 h5"/></g><text x="122" y="846" font-size="15" font-weight="700" fill="#fff" text-anchor="start">1-Click Simultaneous Sync</text><text x="122" y="868" font-size="12" font-weight="400" fill="#94A3B8" text-anchor="start">Edit once, audits both stores</text><rect x="372" y="840" width="40" height="22" rx="11" fill="#10B981"/><circle cx="401" cy="851" r="8" fill="#fff"/><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_2 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s2bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s2gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s2gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s2ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s2ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s2tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s2sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s2scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s2okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s2btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s2t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s2t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s2t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s2ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s2dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s2ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s2ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s2K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s2ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s2bg)"/><circle cx="380" cy="110" r="260" fill="url(#s2gc)"/><circle cx="40" cy="420" r="250" fill="url(#s2gi)"/><circle cx="400" cy="800" r="280" fill="url(#s2ge)"/><circle cx="40" cy="960" r="200" fill="url(#s2ga)"/><rect width="460" height="996" fill="url(#s2dots)"/><rect x="134" y="50" width="193" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="150" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">COMPLIANCE ENGINE</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">Pre-Flight ASO Audit</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s2tg)" text-anchor="middle">Zero App Store Rejections</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Catch every store issue before you submit</text><rect x="30" y="232" width="400" height="446" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="232" width="400" height="446" rx="24" fill="url(#s2sh)"/><text x="50" y="264" font-size="10" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="2">LISTING AUDIT</text><circle cx="378" cy="260.5" r="3" fill="#10B981"/><text x="412" y="264" font-size="9" font-weight="700" fill="#34D399" text-anchor="end" letter-spacing="1.5">LIVE</text><line x1="46" y1="282" x2="414" y2="282" stroke="rgba(255,255,255,0.07)"/><rect x="46" y="296" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="310" width="36" height="36" rx="10" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.4"/><g fill="none" stroke="#7DD3FC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M72 323 h12 M78 323 v11"/></g><text x="108" y="325" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Title Length</text><text x="108" y="343" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">20 / 30 characters</text><rect x="334" y="310" width="66" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="367.0" y="324.42" font-size="9.5" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="356" width="292" height="6" rx="3" fill="#fff" fill-opacity="0.08"/><rect x="108" y="356" width="195" height="6" rx="3" fill="#38BDF8"/><rect x="46" y="390" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="404" width="36" height="36" rx="10" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.4"/><g fill="none" stroke="#C4B5FD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M72 417 h12 M72 422 h12 M72 427 h7"/></g><text x="108" y="419" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Subtitle &amp; Short Description</text><text x="108" y="437" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">16 / 30 characters</text><rect x="334" y="404" width="66" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="367.0" y="418.42" font-size="9.5" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="450" width="292" height="6" rx="3" fill="#fff" fill-opacity="0.08"/><rect x="108" y="450" width="156" height="6" rx="3" fill="#A78BFA"/><rect x="46" y="484" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="498" width="36" height="36" rx="10" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.4"/><g fill="none" stroke="#6EE7B7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="72" y="510" width="12" height="12" rx="2.5"/><path d="M72 516 h12 M78 510 v12" stroke-opacity="0.5"/></g><text x="108" y="513" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">App Icon Transparency</text><text x="108" y="531" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Opaque master icon verified</text><rect x="334" y="498" width="66" height="22" rx="11.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="367.0" y="512.42" font-size="9.5" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="540" width="71" height="20" rx="10.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="143.5" y="553.24" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="0.8">0% ALPHA</text><rect x="187" y="540" width="84" height="20" rx="10.0" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.38"/><text x="229.0" y="553.24" font-size="9" font-weight="700" fill="#6EE7B7" text-anchor="middle" letter-spacing="0.8">ITMS-90717</text><rect x="46" y="578" width="368" height="84" rx="16" fill="#0B1322" stroke="rgba(255,255,255,0.06)"/><rect x="60" y="592" width="36" height="36" rx="10" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.4"/><g fill="none" stroke="#FCD34D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M78 603 l6 2 v5 c0 4 -3 6 -6 7 c-3 -1 -6 -3 -6 -7 v-5 z"/><path d="M75.4 610.5 l2 2 l3.4 -4"/></g><text x="108" y="607" font-size="13.5" font-weight="700" fill="#fff" text-anchor="start">Age Rating Matrix</text><text x="108" y="625" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Content rating verified</text><rect x="334" y="592" width="66" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="367.0" y="606.42" font-size="9.5" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="1.2">PASSED</text><rect x="108" y="634" width="97" height="20" rx="10.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="156.5" y="647.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">4+ APP STORE</text><rect x="213" y="634" width="104" height="20" rx="10.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="265.0" y="647.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">EVERYONE PLAY</text><rect x="30" y="704" width="400" height="60" rx="30" fill="url(#s2okg)" stroke="rgba(16,185,129,0.45)"/><circle cx="64" cy="734" r="18" fill="#10B981"/><path d="M58.0 734.3 L62.5 739.1 L70.9 728.9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="94" y="739" font-size="14" font-weight="700" fill="#fff" text-anchor="start">All 12 Automated Store Checks Passed</text><rect x="30" y="788" width="400" height="110" rx="22" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="788" width="400" height="110" rx="22" fill="url(#s2sh)"/><text x="97" y="837" font-size="28" font-weight="800" fill="#34D399" text-anchor="middle">12/12</text><text x="97" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">CHECKS PASSED</text><text x="230" y="837" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">0</text><text x="230" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">ERRORS</text><text x="363" y="837" font-size="28" font-weight="800" fill="#FBBF24" text-anchor="middle">0</text><text x="363" y="858" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1.6">WARNINGS</text><line x1="163" y1="812" x2="163" y2="866" stroke="rgba(255,255,255,0.08)"/><line x1="297" y1="812" x2="297" y2="866" stroke="rgba(255,255,255,0.08)"/><rect x="50" y="878" width="360" height="5" rx="2.5" fill="#fff" fill-opacity="0.08"/><rect x="50" y="878" width="360" height="5" rx="2.5" fill="url(#s2btn)"/><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_3 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s3gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s3gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s3ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s3ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s3tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s3sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s3scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s3okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s3btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s3t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s3t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s3t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s3ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s3dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s3ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s3ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s3K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s3ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s3bg)"/><circle cx="230" cy="430" r="300" fill="url(#s3ge)"/><circle cx="60" cy="110" r="250" fill="url(#s3gc)"/><circle cx="440" cy="700" r="260" fill="url(#s3gi)"/><circle cx="60" cy="920" r="190" fill="url(#s3ga)"/><rect width="460" height="996" fill="url(#s3dots)"/><rect x="138" y="50" width="184" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="154" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">ASSET COMPLIANCE</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">App Icon Inspector</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s3tg)" text-anchor="middle">ITMS-90717 Compliance</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Inspect the master icon before Apple does</text><clipPath id="s3cc"><rect x="30" y="232" width="400" height="410" rx="24"/></clipPath><rect x="30" y="232" width="400" height="410" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="232" width="400" height="410" rx="24" fill="url(#s3sh)"/><g clip-path="url(#s3cc)"><circle cx="230" cy="437" r="190" fill="url(#s3ig)"/><line x1="30" y1="232" x2="30" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="50" y1="232" x2="50" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="70" y1="232" x2="70" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="90" y1="232" x2="90" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="110" y1="232" x2="110" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="130" y1="232" x2="130" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="150" y1="232" x2="150" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="170" y1="232" x2="170" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="190" y1="232" x2="190" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="210" y1="232" x2="210" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="230" y1="232" x2="230" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="250" y1="232" x2="250" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="270" y1="232" x2="270" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="290" y1="232" x2="290" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="310" y1="232" x2="310" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="330" y1="232" x2="330" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="350" y1="232" x2="350" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="370" y1="232" x2="370" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="390" y1="232" x2="390" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="410" y1="232" x2="410" y2="642" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="430" y1="232" x2="430" y2="642" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="232" x2="430" y2="232" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="252" x2="430" y2="252" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="272" x2="430" y2="272" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="292" x2="430" y2="292" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="312" x2="430" y2="312" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="332" x2="430" y2="332" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="352" x2="430" y2="352" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="372" x2="430" y2="372" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="392" x2="430" y2="392" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="412" x2="430" y2="412" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="432" x2="430" y2="432" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="452" x2="430" y2="452" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="472" x2="430" y2="472" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="492" x2="430" y2="492" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="512" x2="430" y2="512" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="532" x2="430" y2="532" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="30" y1="552" x2="430" y2="552" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="572" x2="430" y2="572" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="592" x2="430" y2="592" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="612" x2="430" y2="612" stroke="#38BDF8" stroke-opacity="0.06"/><line x1="30" y1="632" x2="430" y2="632" stroke="#38BDF8" stroke-opacity="0.13"/><line x1="20" y1="227" x2="440" y2="647" stroke="#A78BFA" stroke-opacity="0.35" stroke-dasharray="5 5"/><line x1="440" y1="227" x2="20" y2="647" stroke="#A78BFA" stroke-opacity="0.35" stroke-dasharray="5 5"/><line x1="230" y1="232" x2="230" y2="642" stroke="#38BDF8" stroke-opacity="0.35" stroke-dasharray="2 4"/><line x1="30" y1="437" x2="430" y2="437" stroke="#38BDF8" stroke-opacity="0.35" stroke-dasharray="2 4"/><circle cx="230" cy="437" r="150" fill="none" stroke="#38BDF8" stroke-opacity="0.18" stroke-dasharray="1 0"/><circle cx="230" cy="437" r="128" fill="none" stroke="#38BDF8" stroke-opacity="0.28" stroke-dasharray="6 6"/><circle cx="230" cy="437" r="100" fill="none" stroke="#10B981" stroke-opacity="0.55" stroke-dasharray="4 4"/></g><rect x="130" y="337" width="200" height="200" rx="48" fill="url(#s3ib)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/><rect x="130" y="337" width="200" height="200" rx="48" fill="url(#s3ig)"/><use xlink:href="#s3K" transform="translate(230 437) scale(2)"/><path d="M130 351 V337 H144" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(-6 -6)"/><path d="M330 351 V337 H316" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(6 -6)"/><path d="M130 523 V537 H144" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(-6 6)"/><path d="M330 523 V537 H316" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" transform="translate(6 6)"/><line x1="130" y1="306" x2="330" y2="306" stroke="#38BDF8" stroke-opacity="0.8"/><line x1="130" y1="301" x2="130" y2="311" stroke="#38BDF8"/><line x1="330" y1="301" x2="330" y2="311" stroke="#38BDF8"/><rect x="203" y="298" width="54" height="16" rx="8" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><text x="230" y="309.5" font-size="9.5" font-weight="700" fill="#7DD3FC" text-anchor="middle">1024 px</text><text x="50" y="258" font-size="9" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="1.5">BLUEPRINT &#183; 1024 &#215; 1024</text><text x="410" y="258" font-size="9" font-weight="600" fill="#64748B" text-anchor="end" letter-spacing="1.5">RGB &#183; 8-BIT</text><text x="50" y="626" font-size="9" font-weight="600" fill="#64748B" text-anchor="start" letter-spacing="1.5">SQUIRCLE CLIP &#183; r = 24%</text><text x="410" y="626" font-size="9" font-weight="700" fill="#34D399" text-anchor="end" letter-spacing="1.5">ALPHA: 0</text><text x="348" y="307" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="start">45&#176;</text><rect x="30" y="660" width="122" height="34" rx="17" fill="#38BDF8" fill-opacity="0.15" stroke="#38BDF8" stroke-opacity="0.55"/><rect x="44" y="671" width="12" height="12" rx="4" fill="none" stroke="#7DD3FC" stroke-width="1.5"/><text x="64" y="681" font-size="11.5" font-weight="600" fill="#7DD3FC" text-anchor="start">Apple Squircle</text><rect x="160" y="660" width="130" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.1"/><circle cx="180" cy="677" r="6" fill="none" stroke="#94A3B8" stroke-width="1.5"/><text x="194" y="681" font-size="11.5" font-weight="600" fill="#94A3B8" text-anchor="start">Android Circle</text><rect x="298" y="660" width="132" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.1"/><rect x="312" y="671" width="12" height="12" rx="0.5" fill="none" stroke="#94A3B8" stroke-width="1.5"/><text x="332" y="681" font-size="11.5" font-weight="600" fill="#94A3B8" text-anchor="start">Square 1024</text><rect x="30" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(56,189,248,0.5)"/><rect x="30" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><rect x="62" y="726" width="60" height="60" rx="14" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(92.0 756.0) scale(0.600)"/><circle cx="138" cy="726" r="7" fill="#10B981"/><path d="M135.0 726.15 L137.25 728.55 L141.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="92" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">iOS &#183; App Store</text><rect x="168" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="168" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><circle cx="230.0" cy="756.0" r="30.0" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(230.0 756.0) scale(0.600)"/><circle cx="276" cy="726" r="7" fill="#10B981"/><path d="M273.0 726.15 L275.25 728.55 L279.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="230" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">Android &#183; Adaptive</text><rect x="306" y="710" width="124" height="116" rx="20" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="306" y="710" width="124" height="116" rx="20" fill="url(#s3sh)"/><rect x="338" y="726" width="60" height="60" rx="0" fill="url(#s3ib)" stroke="rgba(255,255,255,0.12)"/><use xlink:href="#s3K" transform="translate(368.0 756.0) scale(0.600)"/><circle cx="414" cy="726" r="7" fill="#10B981"/><path d="M411.0 726.15 L413.25 728.55 L417.45 723.45" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="368" y="810" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.3">Master &#183; 1024 px</text><rect x="30" y="844" width="400" height="84" rx="22" fill="url(#s3okg)" stroke="rgba(16,185,129,0.45)"/><rect x="48" y="860" width="52" height="52" rx="15" fill="#10B981" fill-opacity="0.18" stroke="#10B981" stroke-opacity="0.5"/><g fill="none" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M74 872 l12 4 v9 c0 7 -5 11 -12 13 c-7 -2 -12 -6 -12 -13 v-9 z"/><path d="M68.5 886 l4 4 l7 -8"/></g><text x="116" y="883" font-size="14" font-weight="700" fill="#fff" text-anchor="start">100% Opaque &#183; Zero Alpha Pixels</text><text x="116" y="903" font-size="12" font-weight="400" fill="#94A3B8" text-anchor="start">Guards against Apple upload rejection</text><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);

const STUDIO_SHOT_4 = makeSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 996" width="1290" height="2796" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif">
<defs>
<linearGradient id="s4bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080C14"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
<radialGradient id="s4gc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.3"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
<radialGradient id="s4gi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
<radialGradient id="s4ge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10B981" stop-opacity="0.28"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<radialGradient id="s4ga" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F59E0B" stop-opacity="0.2"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>
<linearGradient id="s4tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#818CF8"/><stop offset="1" stop-color="#34D399"/></linearGradient>
<linearGradient id="s4sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="s4scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1528"/><stop offset="1" stop-color="#05080F"/></linearGradient>
<linearGradient id="s4okg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.12"/></linearGradient>
<linearGradient id="s4btn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="s4t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0.25"/></linearGradient>
<linearGradient id="s4t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity="0.5"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0.2"/></linearGradient>
<linearGradient id="s4t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.55"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0.22"/></linearGradient>
<radialGradient id="s4ig" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#10B981" stop-opacity="0.22"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient>
<pattern id="s4dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#FFFFFF" fill-opacity="0.05"/></pattern>
<linearGradient id="s4ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F211F"/><stop offset="1" stop-color="#121312"/></linearGradient>
<filter id="s4ksh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-2" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/></filter>
<g id="s4K"><g transform="translate(-50 -50) scale(0.72) translate(19 19)">
<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>
<g filter="url(#s4ksh)"><path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/></g>
</g></g>
</defs><rect width="460" height="996" fill="url(#s4bg)"/><circle cx="60" cy="260" r="250" fill="url(#s4gc)"/><circle cx="440" cy="460" r="240" fill="url(#s4ga)"/><circle cx="60" cy="700" r="240" fill="url(#s4gi)"/><circle cx="340" cy="900" r="300" fill="url(#s4ge)"/><rect width="460" height="996" fill="url(#s4dots)"/><rect x="138" y="50" width="184" height="28" rx="14" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.35)"/><circle cx="154" cy="64" r="3" fill="#38BDF8"/><text x="236" y="68" font-size="11" font-weight="600" fill="#7DD3FC" text-anchor="middle" letter-spacing="2.5">PRODUCTION READY</text><text x="230" y="128" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">1-Click Ultra HD</text><text x="230" y="160" font-size="19" font-weight="700" fill="url(#s4tg)" text-anchor="middle">Multi-Format Export</text><text x="230" y="188" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Every release asset, one click away</text><rect x="30" y="236" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="236" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="236" width="4" height="156" rx="2" fill="#38BDF8" fill-opacity="0.0"/><rect x="50" y="262" width="72" height="72" rx="20" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.45"/><g fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="74" y="278" width="24" height="40" rx="5"/><path d="M82 283 h8"/><path d="M74 306 l7 -7 l5 5 l4 -4 l8 8" stroke-width="1.6"/></g><text x="140" y="276" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Ultra HD 3x PNG Mockups</text><text x="140" y="298" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Retina-grade PNG at 3x scale.</text><text x="140" y="315" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Frameless or with device frame.</text><rect x="140" y="340" width="37" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="158.5" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">@3x</text><rect x="185" y="340" width="76" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="223.0" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">FRAMELESS</text><rect x="269" y="340" width="95" height="22" rx="11.0" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.38"/><text x="316.5" y="354.24" font-size="9" font-weight="700" fill="#7DD3FC" text-anchor="middle" letter-spacing="0.8">DEVICE FRAME</text><circle cx="396" cy="270" r="16" fill="#38BDF8" fill-opacity="0.14" stroke="#38BDF8" stroke-opacity="0.4"/><g fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 263 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 278 h14"/></g><rect x="30" y="412" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="412" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="412" width="4" height="156" rx="2" fill="#F59E0B" fill-opacity="0.0"/><rect x="50" y="438" width="72" height="72" rx="20" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.45"/><g fill="none" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M69 464 l5 -9 h24 l5 9 z"/><rect x="69" y="464" width="34" height="27" rx="4"/><path d="M86 464 v8 m0 4 v3 m0 4 v3" stroke-dasharray="1 0"/><rect x="82.5" y="479" width="7" height="8" rx="2" stroke-width="1.6"/></g><text x="140" y="452" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Client-Side Bulk ZIP</text><text x="140" y="474" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Structured archive of all shots</text><text x="140" y="491" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">and icons, zipped in your browser.</text><rect x="140" y="516" width="37" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="158.5" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">ZIP</text><rect x="185" y="516" width="50" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="210.0" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">SHOTS</text><rect x="243" y="516" width="50" height="22" rx="11.0" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.38"/><text x="268.0" y="530.24" font-size="9" font-weight="700" fill="#FCD34D" text-anchor="middle" letter-spacing="0.8">ICONS</text><circle cx="396" cy="446" r="16" fill="#F59E0B" fill-opacity="0.14" stroke="#F59E0B" stroke-opacity="0.4"/><g fill="none" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 439 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 454 h14"/></g><rect x="30" y="588" width="400" height="156" rx="24" fill="#0F172A" stroke="rgba(255,255,255,0.08)"/><rect x="30" y="588" width="400" height="156" rx="24" fill="url(#s4sh)"/><rect x="30" y="588" width="4" height="156" rx="2" fill="#A78BFA" fill-opacity="0.0"/><rect x="50" y="614" width="72" height="72" rx="20" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.45"/><g fill="none" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M74 631 h17 l8 8 v27 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 v-32 a3 3 0 0 1 3 -3 z"/><path d="M91 631 v8 h8" stroke-width="1.6"/><path d="M79 656 v-6 l3.5 4 l3.5 -4 v6 M91.5 650 v6 m-3 -3 l3 3 l3 -3" stroke-width="1.5"/></g><text x="140" y="628" font-size="15" font-weight="700" fill="#fff" text-anchor="start">Developer Markdown Spec</text><text x="140" y="650" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">Ready-to-paste store copy,</text><text x="140" y="667" font-size="11.5" font-weight="400" fill="#94A3B8" text-anchor="start">titles, subtitles &amp; descriptions.</text><rect x="140" y="692" width="37" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="158.5" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">.MD</text><rect x="185" y="692" width="50" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="210.0" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">TITLE</text><rect x="243" y="692" width="88" height="22" rx="11.0" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.38"/><text x="287.0" y="706.24" font-size="9" font-weight="700" fill="#C4B5FD" text-anchor="middle" letter-spacing="0.8">DESCRIPTION</text><circle cx="396" cy="622" r="16" fill="#A78BFA" fill-opacity="0.14" stroke="#A78BFA" stroke-opacity="0.4"/><g fill="none" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M396 615 v10 m-5 -5 l5 5 l5 -5"/><path d="M389 630 h14"/></g><rect x="30" y="768" width="400" height="84" rx="42" fill="url(#s4okg)" stroke="rgba(16,185,129,0.5)" stroke-width="1.2"/><circle cx="72" cy="810" r="20" fill="#10B981"/><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="64.5" y="808" width="15" height="11" rx="2.5" fill="#fff" fill-opacity="0.15"/><path d="M67.5 808 v-3.5 a4.5 4.5 0 0 1 9 0 v3.5"/></g><text x="106" y="806" font-size="13.5" font-weight="800" fill="#fff" text-anchor="start" letter-spacing="1.2">100% CLIENT-SIDE EXPORT</text><text x="106" y="826" font-size="11" font-weight="700" fill="#6EE7B7" text-anchor="start" letter-spacing="1.4">0 BYTES SENT TO SERVER</text><line x1="170" y1="934" x2="290" y2="934" stroke="rgba(255,255,255,0.10)"/><text x="230" y="958" font-size="9" font-weight="600" fill="#475569" text-anchor="middle" letter-spacing="3">STORE PREVIEW STUDIO</text>
</svg>`);
const LINGUA_ICON = SKILL_ICON;
const LINGUA_FEATURE = SKILL_FEATURE;
const LINGUA_SHOT_1 = SKILL_SHOT_1;
const LINGUA_SHOT_2 = SKILL_SHOT_2;
const LINGUA_SHOT_3 = SKILL_SHOT_3;
const LINGUA_SHOT_4 = SKILL_SHOT_4;
/* @pro-only-end */

// --- Active State Model ---
let ICON = STUDIO_ICON;
let BLANK_ICON_1024 = '';
let BLANK_ICON_512 = '';
let CUSTOM_ICON_1024 = '';
let CUSTOM_ICON_512 = '';
let CURRENT_PRESET_KEY = 'studio';
let CURRENT_ACTIVE_PRESET = 'studio';
let IS_CUSTOM_ICON = false;
let IS_CUSTOM_FEATURE = false;
let FEATURE_GRAPHIC = STUDIO_FEATURE;
let SHOTS = [STUDIO_SHOT_1, STUDIO_SHOT_2, STUDIO_SHOT_3, STUDIO_SHOT_4];
let IPAD_SHOTS = [];
let SUPPORTS_IPAD = false;
let IPAD_FIT_MODE = 'cover';
let REVIEWS = [];
let CURRENT_PRIVACY = {
  linked: "",
  notLinked: "",
  google: "No data shared with third parties, No data collected, Data is encrypted in transit"
};

// --- Templates / Presets Catalog ---
const PRESETS = {
  studio: {
    name: "Store Preview Studio",
    sub: "Store Mockup Pro",
    promo: "Design, audit & export high-resolution App Store & Google Play metadata completely offline with zero recurring subscription fees.",
    short: "Design, audit & export App Store & Google Play metadata offline.",
    dev: "Store Mockup Pro",
    email: "support@previewstudio.app",
    phone: "+1 800-555-0199",
    addr: "San Francisco, CA",
    category: "Developer Tools",
    whatsNew: "Version 2.1.0 Update:\n- Live dual-store viewports (iPhone, iPad & Android layouts)\n- App Icon Inspector with ITMS-90717 alpha compliance audit\n- Ultra HD 3x PNG mockups & 1-click bulk ZIP export\n- Developer Markdown generator\n- 100% standalone offline operation with zero telemetry",
    desc: "Store Preview Studio is the professional listing designer and pre-flight audit studio for iOS and Android developers, indie creators, and digital agencies.\n\nCraft high-converting App Store Connect and Google Play Console product listings side-by-side with instantaneous real-time sync, automated store limit validation, and Retina-grade mockup generation — 100% offline in your browser.\n\nCORE CAPABILITIES:\n• Dual-Store Live Viewports: Simultaneously visualize how your app listing looks on both iOS and Android before publishing.\n• Pre-Flight Compliance Audit: Automated real-time checking of title lengths, character limits, and store dimension requirements.\n• App Icon Inspector: Audit master 1024x1024 icons, test transparency compliance against Apple ITMS-90717 guidelines, and preview adaptive squircle shapes.\n• Ultra HD 3x Multi-Format Export: Download pristine 3x Retina PNG device mockups, comprehensive client-side ZIP bundles, and developer Markdown specifications in 1 click.\n• 100% Client-Side Privacy: Operates completely offline with zero tracking, zero server dependencies, and zero monthly subscriptions.\n\nPRICING & LICENSING:\nPay once on Gumroad, own forever. No subscriptions, no cloud dependencies.",
    privLinked: "",
    privNotLinked: "",
    privGoogle: "No data shared with third parties, No data collected, Data is encrypted in transit",
    stats: {
      "rating": "4.9",
      "count": "1.8K",
      "rank": "1",
      "dl": "50K+",
      "size": "42 MB",
      "age": "4+",
      "iap": "iap",
      "off": false,
      "wm": false
},
    rdate: getCurrentMonthDateStr(2, true),
    icon: STUDIO_ICON,
    feature: STUDIO_FEATURE,
    shots: [STUDIO_SHOT_1, STUDIO_SHOT_2, STUDIO_SHOT_3, STUDIO_SHOT_4],
    reviews: [
      {
        author: "Alex Morgan",
        avatarBg: "#0b57d0",
        stars: 5,
        date: getCurrentMonthDateStr(4, true),
        title: "Intuitive & beautifully designed",
        text: "Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction. The side-by-side preview saved me hours before launching!",
        helpful: 142
      },
      {
        author: "David Chen",
        avatarBg: "#7c3aed",
        stars: 5,
        date: getCurrentMonthDateStr(7, true),
        title: "Essential tool for indie app developers",
        text: "The ITMS-90717 icon inspector and instant 3x PNG export are indispensable. Best investment I made for my App Store launch workflow.",
        helpful: 89
      },
      {
        author: "Elena Rostova",
        avatarBg: "#059669",
        stars: 5,
        date: getCurrentMonthDateStr(11, true),
        title: "Reliable, fast, and completely offline",
        text: "100% private and client-side. No backend servers, no subscriptions. A permanent essential tool in my agency workflow.",
        helpful: 67
      }
    ]
  },

  taskflow: {
    name: "TaskFlow: Daily Habit Planner",
    sub: "Build habits & boost focus",
    promo: "Spring Productivity Sale: Unlock TaskFlow Pro with smart recurring habits, Pomodoro focus timer, and seamless cloud sync.",
    short: "Organize daily tasks, build lasting habits, and track your focus effortlessly.",
    dev: "FlowCraft Studio Inc.",
    email: "support@flowcraft.studio",
    phone: "+1 800-555-0199",
    addr: "San Francisco, CA",
    category: "Productivity",
    whatsNew: "Version 2.4.0 Update:\n- Interactive Home Screen and Lock Screen widgets\n- Smart habit streak reminders with custom vibration\n- Refined dark theme with pure OLED black mode\n- Faster cloud sync and performance improvements\n- Minor bug fixes and localization updates",
    desc: `Transform your daily routine with TaskFlow — the all-in-one productivity planner and habit tracker designed to help you stay focused, organized, and motivated.

Whether you're building a new morning routine, tracking daily fitness goals, or managing complex project milestones, TaskFlow adapts to your workflow with elegance and simplicity.

KEY FEATURES:
• Smart Habit Builder: Create recurring habits with flexible scheduling (daily, weekdays, or custom intervals).
• Interactive Streak Tracking: Visual streak counters and milestone celebrations keep you inspired every day.
• Focus Timer & Pomodoro: Integrated timer with ambient focus sounds to eliminate distractions and boost deep work.
• Rich Widgets: Beautiful iOS & Android home screen widgets to check off habits without opening the app.
• Cross-Device Cloud Sync: Real-time end-to-end encrypted sync across your iPhone, iPad, Mac, and Android devices.
• Comprehensive Analytics: Detailed charts and weekly productivity scorecards to understand your peak hours.

PRIVACY FIRST:
We believe your personal data belongs only to you. TaskFlow requires no account to get started and never sells your information to advertisers.

SUBSCRIPTION & TERMS:
TaskFlow Pro is available as an optional monthly ($3.99/mo) or yearly ($29.99/yr) auto-renewable subscription. Payment will be charged to your App Store / Google Play account at confirmation of purchase.`,
    privLinked: "User Content (Tasks & Habits), Contact Info, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "No data shared with third parties, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "1.8K",
      rank: "1",
      dl: "50K+",
      size: "86 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(2, true),
    icon: DEFAULT_ICON,
    feature: DEFAULT_FEATURE,
    shots: [SHOT_1, SHOT_2, SHOT_3, SHOT_4],
    reviews: [
      {
        author: "Marcus Vance",
        avatarBg: "#0b57d0",
        stars: 5,
        date: getCurrentMonthDateStr(4, true),
        title: "Clean UI & effective daily tracking",
        text: "Clean UI, smooth animations, and very effective for daily tracking. The widget integration on iOS and Android is top-notch!",
        helpful: 108
      },
      {
        author: "Sarah Jenkins",
        avatarBg: "#7c3aed",
        stars: 5,
        date: getCurrentMonthDateStr(11, true),
        title: "Transformed my deep work",
        text: "The Pomodoro timer coupled with habit streaks completely transformed my workday focus. Cloud sync across phone and tablet is seamless.",
        helpful: 64
      }
    ]
  },
  pulsefit: {
    name: "PulseFit: Workout & Fitness",
    sub: "HIIT, gym plans & meal log",
    promo: "Get 50% off PulseFit Premium! Access 300+ guided HD workout routines, smart macro calculator, and Apple Health / Health Connect sync.",
    short: "Log workouts, calculate macros, track heart rate, and reach your fitness goals.",
    dev: "PulseFit Health Lab",
    email: "support@pulsefit.io",
    phone: "+1 888-555-0142",
    addr: "Boulder, CO",
    category: "Health & Fitness",
    whatsNew: "Version 3.1.2:\n- Added 45 new bodyweight HIIT workouts\n- Real-time heart rate zone monitoring with Apple Watch & Wear OS\n- Custom meal macro presets and barcode scanner enhancements\n- Improved rest timer audio cues\n- Bug fixes and battery life optimizations",
    desc: `Crush your health goals with PulseFit — the ultimate workout logger, strength tracker, and nutrition companion built for athletes and fitness beginners alike.

From progressive overload tracking in the weight room to high-intensity interval training (HIIT) at home, PulseFit gives you the exact tools and analytics you need to build muscle and burn fat.

WHY ATHLETES LOVE PULSEFIT:
• 300+ Expert Routines: Verified strength, cardio, and mobility programs tailored to your equipment.
• Smart Weight & Rep Logger: Automatic rest timers and 1-rep max calculations.
• Nutrition & Macro Scanner: Fast barcode scanning with extensive food database.
• Health Sync: Seamless two-way integration with Apple Health and Google Health Connect.
• Offline Mode: Log your full workout without an internet connection.

DISCLAIMER:
PulseFit provides fitness and dietary tracking for educational and wellness purposes only. Always consult with a physician before starting any new exercise or diet program.`,
    privLinked: "Health & Fitness (Workouts & Pulse), Contact Info, User Content, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "Data collected: Health & Fitness info, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.8",
      count: "24.6K",
      rank: "3",
      dl: "500K+",
      size: "112 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(1, true),
    icon: PULSEFIT_ICON,
    feature: PULSEFIT_FEATURE,
    shots: [PULSEFIT_SHOT_1, PULSEFIT_SHOT_2, PULSEFIT_SHOT_3, PULSEFIT_SHOT_4],
    reviews: [
      {
        author: "Jason Miller",
        avatarBg: "#16a34a",
        stars: 5,
        date: getCurrentMonthDateStr(5, true),
        title: "Best progressive overload tracker",
        text: "Best progressive overload tracker on mobile. The automatic rest timer and Health Connect integration make gym workouts effortless.",
        helpful: 142
      },
      {
        author: "Emma Watson",
        avatarBg: "#0891b2",
        stars: 5,
        date: getCurrentMonthDateStr(14, true),
        title: "Clean interface & macro calculator",
        text: "Love the macro calculator and quick barcode scanner. Clean interface without clutter or intrusive popups!",
        helpful: 89
      }
    ]
  },
  zenmind: {
    name: "ZenMind: Meditation & Sleep",
    sub: "Guided breathwork & calm sound",
    promo: "Sleep deeper tonight. Experience our new neuro-acoustic 3D soundscapes and calming bedtime journeys voiced by renowned artists.",
    short: "Reduce stress, sleep peacefully, and find calm with guided daily meditations.",
    dev: "ZenMind Studio",
    email: "hello@zenmind.app",
    phone: "+1 800-555-0177",
    addr: "Portland, OR",
    category: "Health & Fitness",
    whatsNew: "Version 1.8.0:\n- 12 new immersive bedtime soundscapes (Binaural beats & rain)\n- Customizable breathwork exercises for anxiety relief\n- Offline listening support for premium journeys\n- Polished interface and sleep timer countdown",
    desc: `Quiet your mind and sleep soundly with ZenMind. Discover hundreds of evidence-based guided meditations, relaxing soundscapes, and breathing exercises crafted by leading mindfulness experts.

Whether you're overcoming midday anxiety, establishing a mindful morning routine, or drifting off to sleep with rain falling on forest leaves, ZenMind is your sanctuary of calm.

WHAT YOU'LL EXPERIENCE:
• Guided Meditations: 3 to 30-minute sessions for stress relief, focus, self-compassion, and deep rest.
• Sleep Stories & Soundscapes: Atmospheric audio journeys designed to naturally guide your brain into restorative REM sleep.
• 4-7-8 Breathwork: Interactive paced breathing exercises to quickly soothe an overactive nervous system.
• Mood & Gratitude Journal: Track emotional shifts and note daily moments of peace.`,
    privLinked: "Health & Fitness (Mindful Minutes), Audio Data, Identifiers",
    privNotLinked: "Usage Data, Diagnostics",
    privGoogle: "No data shared with third parties, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "18.2K",
      rank: "5",
      dl: "250K+",
      size: "74 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(3, true),
    icon: ZENMIND_ICON,
    feature: ZENMIND_FEATURE,
    shots: [ZENMIND_SHOT_1, ZENMIND_SHOT_2, ZENMIND_SHOT_3, ZENMIND_SHOT_4],
    reviews: [
      {
        author: "Clara Hughes",
        avatarBg: "#6366f1",
        stars: 5,
        date: getCurrentMonthDateStr(6, true),
        title: "Calming audio & breathwork",
        text: "The neuro-acoustic rain soundscapes have genuinely helped my sleep. The 4-7-8 breathing exercises are so calming after a stressful workday.",
        helpful: 215
      },
      {
        author: "Oliver Bennett",
        avatarBg: "#059669",
        stars: 5,
        date: getCurrentMonthDateStr(16, true),
        title: "Peaceful & minimalist design",
        text: "Minimalist design, gentle audio transitions, and beautiful bedtime stories. Easily the most peaceful app on my phone.",
        helpful: 97
      }
    ]
  },
  /* @pro-only-start */
  cyberstrike: {
    name: "CyberStrike: 2088 Cyber RPG",
    sub: "Open-world sci-fi action RPG",
    promo: "Season 4: Neon Uprising is LIVE! Claim your free Legendary Cyber-Blade, pilot mech suits, and team up in 10-player co-op raids!",
    short: "Pilot combat mechs, fight in neon cyberpunk worlds, and conquer co-op raids.",
    dev: "OmniArcade Games Ltd.",
    email: "support@omniarcade.games",
    phone: "+81 3 5555 0188",
    addr: "Tokyo, Japan",
    category: "Role Playing",
    whatsNew: "Version 4.2.0 - Neon Uprising:\n- New Open World Sector: Neo-Shinjuku District\n- 5 new Legendary Cybernetic Weapons & Exosuits\n- 10-player Co-op Raid Boss: Titan Dreadnought\n- 120 FPS Ultra Mode on supported devices\n- Gamepad & Razer Kishi / Backbone controller support\n- Engine optimizations and faster asset loading",
    desc: `Step into the year 2088. Welcome to CyberStrike — the groundbreaking open-world sci-fi Action RPG that delivers console-grade combat and breathtaking cybernetic visuals right to your mobile device.

In the neon-drenched megacity of Neo-Shinjuku, corrupt mega-corporations and rogue AI factions battle for supremacy. As an elite augmented mercenary, your choices and combat prowess will decide the fate of humanity's final frontier.

CORE GAMEPLAY FEATURES:
• Breathtaking Open World: Explore sprawling high-tech districts, vertical skyscrapers, and underground neon night markets with complete freedom.
• High-Octane Action Combat: Chain lightning-fast cyber-katana combos, switch to plasma heavy rifles mid-air, and unleash devastating elemental abilities.
• Customizable Combat Mechs: Unlock and pilot heavy exosuits with unique skill trees, custom laser plating, and jump-jet mobility.
• 10-Player Online Co-op Raids: Coordinate tactics with teammates around the world to defeat massive multi-phase Titan bosses and earn Legendary gear.
• Competitive PvP Arena: Test your builds in fast-paced 1v1 and 3v3 ranked cyber-gladiator showdowns.
• Console-Grade 120 FPS Graphics: Built on high-end mobile rendering with dynamic volumetric lighting, screen-space reflections, and full controller support (PlayStation, Xbox, Backbone, Razer Kishi).

JOIN OVER 100,000 CYBER MERCENARIES WORLDWIDE:
Download CyberStrike today and forge your legend in the neon underworld!`,
    privLinked: "Purchases (In-App Gear), User Content (Game Saves), Identifiers (Player ID), Usage Data (Gameplay Stats)",
    privNotLinked: "Diagnostics (Crash Logs & 120 FPS), Approximate Location",
    privGoogle: "Data shared with third parties (Analytics & Leaderboards), Data collected: Purchases & Player ID, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.9",
      count: "48.5K",
      rank: "2",
      dl: "100K+",
      size: "1.8 GB",
      age: "12+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(2, true),
    icon: CYBER_ICON,
    feature: CYBER_FEATURE,
    shots: [CYBER_SHOT_1, CYBER_SHOT_2, CYBER_SHOT_3, CYBER_SHOT_4],
    reviews: [
      {
        author: "Alexander Drake",
        avatarBg: "#ea580c",
        stars: 5,
        date: getCurrentMonthDateStr(7, true),
        title: "Incredible mobile performance",
        text: "Unbelievable graphics for mobile! 120 FPS runs rock solid on high settings, and the mech raid bosses require real team coordination.",
        helpful: 340
      },
      {
        author: "Maya Lindqvist",
        avatarBg: "#8b5cf6",
        stars: 5,
        date: getCurrentMonthDateStr(12, true),
        title: "Fast-paced cyber combat",
        text: "Fast-paced cyber combat and deep character skill trees. Controller support works seamlessly right out of the box.",
        helpful: 182
      }
    ]
  },
  edulearn: {
    name: "SkillSphere: Online Courses",
    sub: "Learn coding, business & AI",
    promo: "Flash Sale: Master in-demand skills with 250,000+ top video courses from $9.99. Learn Python, AI, Design & Business with offline downloads.",
    short: "Stream 25,000+ video courses in coding, AI, and business with expert mentors.",
    dev: "SkillSphere Global Inc.",
    email: "support@skillsphere.edu",
    phone: "+44 20 7946 0912",
    addr: "San Francisco, CA",
    category: "Education",
    whatsNew: "Version 4.1.0:\n- Enhanced HD video player with custom playback speeds (0.5x - 2.5x)\n- Background audio mode & offline video download manager\n- Interactive coding exercises & real-time syntax checking\n- Shareable digital certificates direct to LinkedIn\n- Performance enhancements and smoother video streaming",
    desc: `Advance your career and master in-demand technical, creative, and business skills with SkillSphere — the premier video learning marketplace trusted by over 5 million students worldwide.

Explore an expansive catalog of 250,000+ expert-led video courses across Software Engineering, Artificial Intelligence, UI/UX Design, Data Science, Digital Marketing, Cloud Computing, and Leadership.

WHY LEARN WITH SKILLSPHERE:
• 250,000+ High-Definition Courses: Fresh video content updated weekly by industry practitioners and global thought leaders.
• Lifetime Course Access: Learn at your own pace on mobile, tablet, desktop, or Chromecast.
• Offline Video Downloads: Save lessons for flights, commutes, or study sessions without cellular data.
• Hands-On Coding Labs: Practice programming directly in the app with interactive sandboxes for Python, JavaScript, and React.
• Expert Mentor Q&A: Post questions directly to course instructors and collaborate with an active global learning community.
• Accredited Completion Certificates: Earn verified, shareable digital credentials to elevate your LinkedIn profile and resume.
• Audio-Only Background Play: Listen to lectures while commuting or multitasking.

POPULAR TOPICS INCLUDE:
- Software Development: Python, Full-Stack Web, React, iOS Swift, Android Kotlin, Flutter
- Artificial Intelligence: LLMs, PyTorch, Generative AI, Prompt Engineering, Machine Learning
- Design & Creativity: UI/UX Figma, Graphic Design, 3D Animation, Motion Graphics
- Business & Management: Product Management, Agile Scrum, Entrepreneurship, Financial Modeling

PRIVACY & SAFETY:
Your privacy is our priority. Your learning progress and credentials are kept strictly private and never shared with unauthorized third parties.

SUBSCRIPTION & LIFETIME PURCHASES:
Choose between individual lifetime course purchases or our SkillSphere All-Access Annual Pass. Payment will be charged to your App Store / Google Play account upon purchase confirmation.`,
    privLinked: "Purchases (Course Enrollments), User Content (Notes & Code), Identifiers, Usage Data",
    privNotLinked: "Diagnostics, Performance Data",
    privGoogle: "Data collected: Purchases & In-app progress, Data is encrypted in transit, You can request data deletion",
    stats: {
      rating: "4.8",
      count: "145K",
      rank: "1",
      dl: "5M+",
      size: "98 MB",
      age: "4+",
      iap: "iap"
    },
    rdate: getCurrentMonthDateStr(1, true),
    icon: SKILL_ICON,
    feature: SKILL_FEATURE,
    shots: [SKILL_SHOT_1, SKILL_SHOT_2, SKILL_SHOT_3, SKILL_SHOT_4],
    reviews: [
      {
        author: "Ethan Walker",
        avatarBg: "#2563eb",
        stars: 5,
        date: getCurrentMonthDateStr(3, true),
        title: "Practical learning on the go",
        text: "The interactive in-app Python sandbox and offline video downloads make studying during commutes a breeze. Earned my LinkedIn certificate in 2 weeks!",
        helpful: 194
      },
      {
        author: "Rachel Adams",
        avatarBg: "#d97706",
        stars: 5,
        date: getCurrentMonthDateStr(15, true),
        title: "High production quality courses",
        text: "High production quality courses and very active instructor Q&A forums. Great value compared to desktop course platforms.",
        helpful: 112
      }
    ]
  }
  /* @pro-only-end */
};

REVIEWS = (PRESETS.taskflow && PRESETS.taskflow.reviews) ? JSON.parse(JSON.stringify(PRESETS.taskflow.reviews)) : [];




/* =========================================================================
   Module: src/js/core/resizer.js
   ========================================================================= */
// Store Preview Studio · Sidebar Resizer & Collapse Toggle
const editorPanel = $("editorPanel");
const editorResizer = $("editorResizer");
const btnToggleSidebar = $("btnToggleSidebar");


let isResizingSidebar = false;

if (editorResizer && editorPanel) {
  editorResizer.addEventListener('mousedown', e => {
    isResizingSidebar = true;
    editorResizer.classList.add('dragging');
    document.body.classList.add('resizing-sidebar');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isResizingSidebar) return;
    const newWidth = Math.min(Math.max(e.clientX, 400), Math.min(window.innerWidth - 360, 850));
    document.documentElement.style.setProperty('--editor-w', `${newWidth}px`);
    editorPanel.style.width = `${newWidth}px`;
    localStorage.setItem('sps_editor_w', newWidth);
  });

  document.addEventListener('mouseup', () => {
    if (isResizingSidebar) {
      isResizingSidebar = false;
      editorResizer.classList.remove('dragging');
      document.body.classList.remove('resizing-sidebar');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // Double-click resizer to reset to default 500px
  editorResizer.addEventListener('dblclick', () => {
    const defaultW = 500;
    document.documentElement.style.setProperty('--editor-w', `${defaultW}px`);
    editorPanel.style.width = `${defaultW}px`;
    localStorage.setItem('sps_editor_w', defaultW);
  });

  // Restore saved width
  const savedW = localStorage.getItem('sps_editor_w');
  if (savedW && !isNaN(savedW)) {
    const w = Math.min(Math.max(parseInt(savedW, 10), 400), 850);
    document.documentElement.style.setProperty('--editor-w', `${w}px`);
    editorPanel.style.width = `${w}px`;
  }
}

// Toggle Sidebar (Hide / Show Form)
function updateSidebarButtonState() {
  const isMobile = typeof isM === 'function' && isM();
  const isCollapsed = isMobile
    ? (document.body.dataset.panel || 'view') !== 'edit'
    : document.body.classList.contains('sidebar-collapsed');
  const btn = $('btnToggleSidebar');
  if (btn) {
    btn.classList.toggle('active', !isCollapsed);
    btn.setAttribute('aria-expanded', !isCollapsed ? 'true' : 'false');
    btn.title = isCollapsed 
      ? 'Show form panel (Sidebar) [Ctrl+B / ⌘B]' 
      : 'Hide form panel (Sidebar) [Ctrl+B / ⌘B]';
  }
}

function toggleSidebar(forceOpen) {
  if (typeof isM === 'function' && isM()) {
    if (typeof setPanel === 'function') {
      const cur = document.body.dataset.panel || 'view';
      const willOpen = typeof forceOpen === 'boolean' 
        ? forceOpen 
        : cur !== 'edit';
      setPanel(willOpen ? 'edit' : 'view');
      return;
    }
  }
  const willCollapse = typeof forceOpen === 'boolean' 
    ? !forceOpen 
    : !document.body.classList.contains('sidebar-collapsed');
  
  document.body.classList.toggle('sidebar-collapsed', willCollapse);
  localStorage.setItem('sps_sidebar_collapsed', willCollapse ? '1' : '0');
  updateSidebarButtonState();
  
  // Continuously fit and center mockups at 60fps during the 320ms slide animation
  const startTime = performance.now();
  const animateFit = () => {
    if (typeof fit === 'function') fit();
    if (typeof syncAllVtPills === 'function') syncAllVtPills();
    if (performance.now() - startTime < 360) {
      requestAnimationFrame(animateFit);
    }
  };
  requestAnimationFrame(animateFit);
}

if (btnToggleSidebar) {
  btnToggleSidebar.onclick = (e) => {
    if (e) e.stopPropagation();
    toggleSidebar();
  };
}

// Global Keyboard Shortcut: Cmd+B (Mac) / Ctrl+B (Windows/Linux)
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      toggleSidebar();
    }
  }
});

// Restore saved sidebar state if any
if (localStorage.getItem('sps_sidebar_collapsed') === '1') {
  document.body.classList.add('sidebar-collapsed');
}
updateSidebarButtonState();

// Drag & drop image files onto screenshot editor card
const slistArea = $('slist') ? $('slist').parentElement : null;
if(slistArea){
  slistArea.addEventListener('dragover',e=>{e.preventDefault()});
  slistArea.addEventListener('drop',e=>{
    const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));
    if(files.length){
      e.preventDefault();
      e.stopPropagation();
      let validFiles = files.filter(f => (typeof validateUploadFile !== 'function') || validateUploadFile(f, MAX_UPLOAD_BYTES, 'Screenshot'));
      if(!validFiles.length) return;
      const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
      const currentCount = typeof SHOTS !== 'undefined' ? SHOTS.length : 0;
      const room = maxAllowed - currentCount;
      if(room <= 0){
        showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
        return;
      }
      if(validFiles.length > room){
        validFiles = validFiles.slice(0, room);
        showToast(`Only ${room} more fit (max ${maxAllowed}) — extra files skipped`, 'warn');
      }
      let loaded=0;
      validFiles.forEach(f=>{
        readFile(f,d=>{
          SHOTS.push(d);
          loaded++;
          if(loaded===validFiles.length){
            renderShots();
            saveState();
            showToast(`Added ${validFiles.length} screenshot(s)!`, 'ok');
          }
        });
      });
    }
  });
}



/* =========================================================================
   Module: src/js/modules/tour.js
   ========================================================================= */
// Store Preview Studio · Interactive Guided Tour Engine

const SPS_TOUR_STEPS = [
  {
    target: '#storeSwitcher',
    fallbackTarget: '.header-center',
    title: 'Multi-Store & Device Engine',
    desc: 'Switch between Apple App Store and Google Play instantly. Preview iPhone, iPad, and Android tablets with realistic device frames and adaptive light/dark themes.'
  },
  {
    target: '#btnPresetPill',
    fallbackTarget: '#workspaceBar',
    title: 'Curated Presets & Instant Sandbox',
    desc: 'Explore curated store listings for SaaS, Fitness, Meditation, Gaming, and EdTech, or click "+ Your App" to start drafting your own product directly in your browser.'
  },
  {
    target: '#editorPanel',
    fallbackTarget: '.editor',
    title: 'Real-Time ASO Listing Editor',
    desc: 'Fine-tune App Title, Subtitle, Promotional Text, Categories, and Descriptions. Click Focus-Link buttons to highlight exact fields on the live preview.'
  },
  {
    target: '#icoDropZone',
    fallbackTarget: '#f-name',
    title: 'Store Compliance & Icon Inspector',
    desc: 'Audit your app icon for Apple ITMS-90717 alpha channel rejections, 1024×1024 / 512×512 sizing, and official squircle corner radii.'
  },
  {
    target: '#workspaceExportDropdown',
    fallbackTarget: '#btnExport',
    title: 'Export Deliverables',
    desc: 'Generate 3x Ultra HD PNG device mockups, store-ready clipboard text, complete LISTING_METADATA.md reports, and portable JSON backups.'
  }
];

let currentTourStep = -1;
let tourOverlayElements = null;

function createTourDOM() {
  if (tourOverlayElements) return tourOverlayElements;

  const backdrop = document.createElement('div');
  backdrop.className = 'sps-tour-backdrop';
  backdrop.id = 'spsTourBackdrop';

  const spotlight = document.createElement('div');
  spotlight.className = 'sps-tour-spotlight';
  spotlight.id = 'spsTourSpotlight';

  const popover = document.createElement('div');
  popover.className = 'sps-tour-popover';
  popover.id = 'spsTourPopover';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'true');

  popover.innerHTML = `
    <div class="sps-tour-header">
      <span class="sps-tour-step-badge btn-white" id="spsTourStepBadge">Step 1 of 5</span>
      <button type="button" class="sps-tour-close-btn" id="spsTourCloseBtn" aria-label="Close tour" title="Close tour [ESC]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <h3 class="sps-tour-title" id="spsTourTitle"></h3>
    <p class="sps-tour-desc" id="spsTourDesc"></p>
    <div class="sps-tour-footer">
      <div class="sps-tour-dots" id="spsTourDots"></div>
      <div class="sps-tour-actions">
        <button type="button" class="sps-tour-btn sps-tour-btn-skip" id="spsTourSkipBtn">Skip</button>
        <button type="button" class="sps-tour-btn sps-tour-btn-back" id="spsTourBackBtn">Back</button>
        <button type="button" class="sps-tour-btn sps-tour-btn-next btn-primary" id="spsTourNextBtn">Next</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(spotlight);
  document.body.appendChild(popover);

  backdrop.onclick = endTour;
  $('spsTourCloseBtn').onclick = endTour;
  $('spsTourSkipBtn').onclick = endTour;
  $('spsTourBackBtn').onclick = prevTourStep;
  $('spsTourNextBtn').onclick = nextTourStep;

  tourOverlayElements = { backdrop, spotlight, popover };
  return tourOverlayElements;
}

function updateTourDots(activeIdx, total) {
  const container = $('spsTourDots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'sps-tour-dot' + (i === activeIdx ? ' active' : '');
    container.appendChild(dot);
  }
}

function positionTourElements(targetEl) {
  if (!tourOverlayElements) return;
  const { spotlight, popover } = tourOverlayElements;
  const rect = targetEl ? targetEl.getBoundingClientRect() : null;

  if (!rect || rect.width === 0 || rect.height === 0) {
    // Center spotlight fallback
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    spotlight.style.top = `${cy - 20}px`;
    spotlight.style.left = `${cx - 20}px`;
    spotlight.style.width = '40px';
    spotlight.style.height = '40px';
    spotlight.style.opacity = '0';

    popover.style.top = `${cy - 120}px`;
    popover.style.left = `${cx - 165}px`;
    return;
  }

  const pad = 6;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const width = Math.min(window.innerWidth, rect.width + pad * 2);
  const height = Math.min(window.innerHeight, rect.height + pad * 2);

  spotlight.style.top = `${top}px`;
  spotlight.style.left = `${left}px`;
  spotlight.style.width = `${width}px`;
  spotlight.style.height = `${height}px`;
  spotlight.style.opacity = '1';

  // Calculate Popover Position
  const popoverWidth = 330;
  const popoverHeight = 210;
  const margin = 14;

  let pTop = rect.bottom + margin;
  let pLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);

  // If overflowing bottom, position above target
  if (pTop + popoverHeight > window.innerHeight - 10) {
    pTop = Math.max(10, rect.top - popoverHeight - margin);
  }

  // Clamp horizontal bounds
  pLeft = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, pLeft));

  popover.style.top = `${pTop}px`;
  popover.style.left = `${pLeft}px`;
}

function ensureEditPanelActive() {
  const mtabs = document.querySelector('.mtabs');
  const isTabsMode = (mtabs && window.getComputedStyle(mtabs).display !== 'none') || (typeof window !== 'undefined' && window.innerWidth <= 980);
  if (!isTabsMode) return;

  if (typeof setPanel === 'function') {
    setPanel('edit');
  } else {
    document.body.dataset.panel = 'edit';
    const editBtn = document.querySelector('.mtabs button[data-p="edit"]');
    if (editBtn) editBtn.click();
  }
}

function showTourStep(index) {
  if (index < 0 || index >= SPS_TOUR_STEPS.length) {
    endTour();
    return;
  }

  currentTourStep = index;
  ensureEditPanelActive();
  createTourDOM();

  const step = SPS_TOUR_STEPS[index];
  let targetEl = document.querySelector(step.target);
  if (!targetEl && step.fallbackTarget) {
    targetEl = document.querySelector(step.fallbackTarget);
  }

  if (targetEl && typeof targetEl.scrollIntoView === 'function') {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  $('spsTourStepBadge').textContent = `Step ${index + 1} of ${SPS_TOUR_STEPS.length}`;
  $('spsTourTitle').textContent = step.title;
  $('spsTourDesc').textContent = step.desc;

  const backBtn = $('spsTourBackBtn');
  const nextBtn = $('spsTourNextBtn');

  if (backBtn) {
    backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  }

  if (nextBtn) {
    nextBtn.textContent = index === SPS_TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next';
  }

  updateTourDots(index, SPS_TOUR_STEPS.length);

  setTimeout(() => {
    positionTourElements(targetEl);
  }, 50);
}

function nextTourStep() {
  if (currentTourStep < SPS_TOUR_STEPS.length - 1) {
    showTourStep(currentTourStep + 1);
  } else {
    endTour();
    if (typeof showToast === 'function') {
      showToast('Tour completed! Enjoy exploring Store Preview Studio.', 'ok');
    }
  }
}

function prevTourStep() {
  if (currentTourStep > 0) {
    showTourStep(currentTourStep - 1);
  }
}

function startTour(stepIndex = 0) {
  currentTourStep = -1;
  ensureEditPanelActive();
  showTourStep(stepIndex);
  document.addEventListener('keydown', handleTourKeydown);
  window.addEventListener('resize', handleTourResize);
}

function endTour() {
  currentTourStep = -1;
  document.removeEventListener('keydown', handleTourKeydown);
  window.removeEventListener('resize', handleTourResize);

  if (tourOverlayElements) {
    const { backdrop, spotlight, popover } = tourOverlayElements;
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    if (spotlight && spotlight.parentNode) spotlight.parentNode.removeChild(spotlight);
    if (popover && popover.parentNode) popover.parentNode.removeChild(popover);
    tourOverlayElements = null;
  }

  try {
    localStorage.setItem('sps_tour_completed', 'true');
  } catch (_) {}
}

function handleTourKeydown(e) {
  if (currentTourStep < 0) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    endTour();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    nextTourStep();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevTourStep();
  }
}

function handleTourResize() {
  if (currentTourStep < 0) return;
  ensureEditPanelActive();
  const step = SPS_TOUR_STEPS[currentTourStep];
  if (!step) return;
  let targetEl = document.querySelector(step.target);
  if (!targetEl && step.fallbackTarget) {
    targetEl = document.querySelector(step.fallbackTarget);
  }
  positionTourElements(targetEl);
}

function initTour() {
  const btn = $('btnStartTour');
  if (btn) {
    btn.onclick = () => startTour(0);
  }

  // If in demo mode and first time visiting, auto-offer tour after brief delay
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTour);
  } else {
    initTour();
  }
}


/* =========================================================================
   Module: src/js/modules/shots/icon.js
   ========================================================================= */
// Store Preview Studio - Icon Manager & Real-Time Store Validator
let ICON_FILE_SIZE = 0;
let ICON_FILE_TYPE = '';
let ICON_FILE_NAME = '';

function isPlaceholderIcon(){
  // 1. If user uploaded a custom icon, it is NEVER a placeholder
  if(typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON) return false;

  // 2. If a curated template preset is active (studio, pulsefit, zenmind, etc.), it's not a placeholder
  if(typeof CURRENT_PRESET_KEY !== 'undefined'){
    if(CURRENT_PRESET_KEY && CURRENT_PRESET_KEY !== 'none' && CURRENT_PRESET_KEY !== 'draft') return false;
  }

  // 3. Otherwise (in draft or none/blank without custom icon), check if icon is missing or placeholder
  if(!ICON) return true;
  if(typeof BLANK_ICON !== 'undefined' && ICON === BLANK_ICON) return true;
  if(typeof BLUEPRINT_ICON !== 'undefined' && ICON === BLUEPRINT_ICON) return true;
  if(typeof BLANK_ICON_1024 !== 'undefined' && BLANK_ICON_1024 && ICON === BLANK_ICON_1024) return true;
  if(typeof BLANK_ICON_512 !== 'undefined' && BLANK_ICON_512 && ICON === BLANK_ICON_512) return true;
  if(typeof ICON === 'string' && (ICON.includes('c6-bg') || ICON.includes('bfd1fd') || ICON.includes('d2c7fc') || ICON.includes('bp-bg') || ICON.includes('blueprint') || ICON.includes('BLUEPRINT GRID'))) return true;
  if(typeof IS_CUSTOM_ICON !== 'undefined') return !IS_CUSTOM_ICON;
  return true;
}

function updateIconDropZoneUi(){
  const dropZone = $('icoDropZone');
  const inspectBtn = $('icoInspect');
  const badge = $('iconStatusBadge');
  const dimTag = $('iconDimTag');
  const removeBtn = $('icoRemove');
  const placeholder = isPlaceholderIcon();

  if(dropZone){
    if(placeholder){
      dropZone.classList.add('is-placeholder');
      dropZone.classList.remove('has');
      dropZone.setAttribute('title', 'Click to upload custom app icon');
    } else {
      dropZone.classList.remove('is-placeholder');
      dropZone.classList.add('has');
      dropZone.setAttribute('title', 'Click to inspect icon in high resolution');
    }
  }

  if(removeBtn){
    removeBtn.style.display = placeholder ? 'none' : 'inline-flex';
  }

  if(inspectBtn){
    const disabled = placeholder || !ICON || ICON === BLANK_ICON;
    inspectBtn.disabled = disabled;
    inspectBtn.classList.toggle('disabled', disabled);
    inspectBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    inspectBtn.setAttribute('title', disabled ? 'Upload an app icon to inspect store compliance' : 'Inspect Icon Details & Store Compliance');
  }

  if(placeholder){
    if(badge){
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
    if(dimTag){
      dimTag.style.display = 'none';
      dimTag.textContent = '';
    }
  }
}

function getIconMeta(src = null){
  const targetSrc = src || ICON;
  let size = ICON_FILE_SIZE || 0;
  let type = ICON_FILE_TYPE || '';
  if((!size || !type) && typeof targetSrc === 'string' && targetSrc.startsWith('data:')){
    const comma = targetSrc.indexOf(',');
    if(comma !== -1){
      if(!type){
        const semi = targetSrc.indexOf(';');
        if(semi !== -1) type = targetSrc.substring(5, semi);
      }
      if(!size){
        const base64 = targetSrc.slice(comma + 1);
        const padding = (base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0));
        size = Math.round((base64.length * 3) / 4 - padding);
      }
    }
  }
  return { size, type };
}

// --- Image Renderers & Real-time Icon Validator ---
function downscaleIconTo512(src, callback){
  if(!src || typeof src !== 'string') return callback(src);
  if(src.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(src)){
    return callback(src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png'));
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 512;
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, 512, 512);
      callback(cv.toDataURL('image/png'));
    } catch(_) {
      callback(src);
    }
  };
  img.onerror = () => callback(src);
  img.src = src;
}

function renderIcons(){
  $$('[data-icon]').forEach(i=>{
    safe(i);
    let targetIcon = ICON;
    if(i.closest('.phone.google') || (store === 'google' && !i.closest('.phone.apple'))){
      targetIcon = (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : ICON;
    } else if(i.closest('.phone.apple') || (store === 'apple' && !i.closest('.phone.google'))){
      targetIcon = (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : ICON;
    }
    i.src=(typeof getDisplaySrc==='function'?getDisplaySrc(targetIcon, i):targetIcon);
  });
  validateAppIcon();
}

function renderFeature(){
  $$('[data-feature]').forEach(i=>{safe(i);i.src=(typeof getDisplaySrc==='function'?getDisplaySrc(FEATURE_GRAPHIC, i):FEATURE_GRAPHIC)});
  if(typeof validateFeatureGraphic === 'function') validateFeatureGraphic();
}

let _iconValRunId = 0;
function validateAppIcon(){
  updateIconDropZoneUi();
  const badge = $('iconStatusBadge');
  const dimTag = $('iconDimTag');
  if(!badge) return;
  if(isPlaceholderIcon() || !ICON || ICON === BLANK_ICON){
    badge.style.display = 'none';
    badge.innerHTML = '';
    if(dimTag){
      dimTag.style.display = 'none';
      dimTag.textContent = '';
    }
    return;
  }
  const targetDim = (store === 'google' ? 512 : 1024);
  const activeIconSrc = (typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON)
    ? ICON
    : ((store === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512)
        ? CUSTOM_ICON_512
        : ((store === 'apple' && typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : ICON));

  if(typeof rasterizeSvgToStorePng === 'function' && typeof activeIconSrc === 'string' && activeIconSrc.startsWith('data:image/svg+xml')){
    rasterizeSvgToStorePng(activeIconSrc, targetDim, pngSrc => {
      if(isPlaceholderIcon() || !ICON || ICON === BLANK_ICON){
        badge.style.display = 'none';
        badge.innerHTML = '';
        if(dimTag){
          dimTag.style.display = 'none';
          dimTag.textContent = '';
        }
        return;
      }
      runIconPixelAudit(pngSrc);
    });
    return;
  }
  runIconPixelAudit(activeIconSrc);
}

function runIconPixelAudit(iconSrc){
  const badge = $('iconStatusBadge');
  const dimTag = $('iconDimTag');
  if(!badge || !iconSrc) return;
  const runId = ++_iconValRunId;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if(runId !== _iconValRunId) return;
    if(isPlaceholderIcon() || !ICON || ICON === BLANK_ICON){
      badge.style.display = 'none';
      badge.innerHTML = '';
      if(dimTag){
        dimTag.style.display = 'none';
        dimTag.textContent = '';
      }
      return;
    }
    const w = img.naturalWidth || 0;
    const h = img.naturalHeight || 0;
    const isSq = (w === h && w > 0);

    const meta = getIconMeta(iconSrc);
    const sizeBytes = meta.size || 0;
    const mimeType = (meta.type || '').toLowerCase();
    const isPng = !mimeType || mimeType === 'image/png';

    let hasAlpha = false;
    let hasPreRoundedCorners = false;
    try {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;

      // Check for alpha channel transparency across pixels
      for(let i = 3; i < data.length; i += 4){
        if(data[i] < 250){ hasAlpha = true; break; }
      }

      // Check corner pixels for pre-cut rounded corners or drop shadow:
      // Google Play specifies: "Do not submit artwork with rounded corners or drop shadows."
      // Google Play automatically applies dynamic corner radius (20%) and drop shadow upon upload.
      // Official documentation: https://support.google.com/googleplay/android-developer/answer/9866151
      const cornerIdx = [
        (0 * 64 + 0) * 4 + 3,       // Top-left corner
        (0 * 64 + 63) * 4 + 3,      // Top-right corner
        (63 * 64 + 0) * 4 + 3,      // Bottom-left corner
        (63 * 64 + 63) * 4 + 3      // Bottom-right corner
      ];
      hasPreRoundedCorners = cornerIdx.some(idx => data[idx] < 200);
    } catch(e){}

    const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
    const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

    // ─────────────────────────────────────────────────────────────────────────
    // APPLE APP STORE VALIDATION
    // Specification:
    // - Dimensions: 1024 × 1024 px, 1:1 square
    // - Format: PNG, 100% opaque (no alpha channel), sRGB or Display P3
    // - File Size: KHONG kiem tra dung luong MB (Apple khong cong bo gioi han)
    // Official guidelines:
    // - https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
    // - https://developer.apple.com/design/human-interface-guidelines/app-icons
    // ─────────────────────────────────────────────────────────────────────────
    if(store === 'apple'){
      // Rule 1: 1:1 Square aspect ratio
      if(!isSq){
        if(dimTag){
          dimTag.className = 'shot-dim-tag err';
          dimTag.textContent = `${(w / (h || 1)).toFixed(2)}:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>App Store Error:</strong> Non-square icon (${w}×${h} px). Apple requires 1:1 square artwork (1024×1024 px).</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 2: PNG format required
      if(mimeType && !isPng){
        if(dimTag){
          dimTag.className = 'shot-dim-tag warn';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Format Notice:</strong> PNG format required by App Store Connect.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 3: 100% Opaque (no alpha channel)
      if(hasAlpha){
        if(dimTag){
          dimTag.className = 'shot-dim-tag err';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Alpha transparency detected. Apple requires 100% opaque icon artwork.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 4: Exact 1024×1024 px dimensions
      if(w !== 1024 || h !== 1024){
        if(dimTag){
          dimTag.className = 'shot-dim-tag warn';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Apple requires exact <strong>1024×1024 px</strong>.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Compliant: All criteria met -> completely hide both dimTag and badge message
      if(dimTag){
        dimTag.style.display = 'none';
        dimTag.textContent = '';
      }
      badge.className = 'shot-status-badge ok';
      badge.style.display = 'none';
      badge.innerHTML = '';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GOOGLE PLAY VALIDATION
    // Specification:
    // - Dimensions: 512 × 512 px, 1:1 square
    // - Format: 32-bit PNG, sRGB
    // - File Size: Max 1024 KB (1 MB)
    // - Shape: No pre-cut corners or drop shadows
    // ─────────────────────────────────────────────────────────────────────────
    else {
      // Rule 1: 1:1 Square aspect ratio
      if(!isSq){
        if(dimTag){
          dimTag.className = 'shot-dim-tag err';
          dimTag.textContent = `${(w / (h || 1)).toFixed(2)}:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Google Play Error:</strong> Non-square icon (${w}×${h} px). Google Play requires 1:1 square artwork (512×512 px).</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 2: Max file size 1024 KB (1 MB)
      const MAX_GOOGLE_ICON_BYTES = 1024 * 1024;
      if(sizeBytes > MAX_GOOGLE_ICON_BYTES){
        const sizeKb = (sizeBytes / 1024).toFixed(0);
        if(dimTag){
          dimTag.className = 'shot-dim-tag err';
          dimTag.textContent = `1:1 (${w}×${h}) · ${sizeKb} KB`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>File Size Error:</strong> ${sizeKb} KB exceeds Google Play 1024 KB limit.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 3: 32-bit PNG format (sRGB color space)
      if(mimeType && !isPng){
        if(dimTag){
          dimTag.className = 'shot-dim-tag err';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Format Notice:</strong> Google Play requires 32-bit PNG format.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 4: Do not include rounded corners or drop shadows in artwork
      if(hasPreRoundedCorners){
        if(dimTag){
          dimTag.className = 'shot-dim-tag warn';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Notice:</strong> Pre-rounded corners or shadow detected. Google Play dynamically applies corner radius and shadow.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Rule 5: Target dimensions 512×512 px
      if(w !== 512 || h !== 512){
        if(dimTag){
          dimTag.className = 'shot-dim-tag warn';
          dimTag.textContent = `1:1 (${w}×${h})`;
          dimTag.style.display = 'inline-flex';
        }
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Google Play requires <strong>512×512 px</strong> square.</span>`;
        badge.style.display = 'flex';
        return;
      }

      // Compliant: All criteria met -> completely hide both dimTag and badge message
      if(dimTag){
        dimTag.style.display = 'none';
        dimTag.textContent = '';
      }
      badge.className = 'shot-status-badge ok';
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
  };
  img.src = iconSrc;
}

// Icon Upload & Drag-and-drop Listeners
function handleIconSlotClick(e){
  if(e) e.stopPropagation();
  if(isPlaceholderIcon()){
    if($('icoFile')) $('icoFile').click();
  } else {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  }
}

if($('icoUp')){
  $('icoUp').onclick = () => {
    if(typeof canUpload === 'function' && !canUpload(1000)) return;
    if($('icoFile')) $('icoFile').click();
  };
}
if($('icoInspect')){
  $('icoInspect').onclick = (e) => {
    if(e) e.stopPropagation();
    if(isPlaceholderIcon() || !ICON || ICON === BLANK_ICON){
      return;
    }
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  };
}
if($('iconStatusBadge')){
  $('iconStatusBadge').onclick = () => {
    if(isPlaceholderIcon()) return;
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  };
}
const icoPrevImg = $('icoPrev');
if(icoPrevImg){
  icoPrevImg.style.cursor = 'pointer';
  icoPrevImg.onclick = handleIconSlotClick;
}
if($('icoFile')){
  $('icoFile').onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
    if(typeof validateUploadFile === 'function' && !validateUploadFile(f, MAX_UPLOAD_BYTES, 'App icon')){
      e.target.value = '';
      return;
    }
    IS_CUSTOM_ICON = true;
    CURRENT_PRESET_KEY = 'draft';
    ICON_FILE_SIZE = f.size || 0;
    ICON_FILE_TYPE = f.type || '';
    ICON_FILE_NAME = f.name || '';
    readFile(f, d => {
      ICON = d;
      if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = d;
      if(typeof userDraft !== 'undefined' && userDraft){
        userDraft.icon = d;
        userDraft.icon1024 = d;
        userDraft.isCustomIcon = true;
      }
      CURRENT_PRESET_KEY = 'draft';
      renderIcons();
      saveState();
      if(typeof updateDraftPill === 'function') updateDraftPill();
      showToast('App icon updated!', 'ok');
    });
    e.target.value = '';
  };
}

// Drag & drop local image directly onto Icon zone
const icoDropZone = $('icoDropZone');
if(icoDropZone){
  icoDropZone.onclick = handleIconSlotClick;
  icoDropZone.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      handleIconSlotClick(e);
    }
  });
  icoDropZone.addEventListener('dragover', e => {
    e.preventDefault();
    icoDropZone.classList.add('drag-over');
  });
  icoDropZone.addEventListener('dragleave', () => {
    icoDropZone.classList.remove('drag-over');
  });
  icoDropZone.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    icoDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      if(typeof validateUploadFile === 'function' && !validateUploadFile(file, MAX_UPLOAD_BYTES, 'App icon')) return;
      IS_CUSTOM_ICON = true;
      CURRENT_PRESET_KEY = 'draft';
      ICON_FILE_SIZE = file.size || 0;
      ICON_FILE_TYPE = file.type || '';
      ICON_FILE_NAME = file.name || '';
      readFile(file, d => {
        ICON = d;
        if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = d;
        if(typeof userDraft !== 'undefined' && userDraft){
          userDraft.icon = d;
          userDraft.icon1024 = d;
          userDraft.isCustomIcon = true;
        }
        CURRENT_PRESET_KEY = 'draft';
        renderIcons();
        saveState();
        if(typeof updateDraftPill === 'function') updateDraftPill();
        showToast('App icon dropped & applied!', 'ok');
      });
    }
  });
}

// Remove / Reset Custom App Icon
const icoRemoveBtn = $('icoRemove');
if(icoRemoveBtn){
  icoRemoveBtn.onclick = (e) => {
    if(e) e.stopPropagation();
    ++_iconValRunId; // cancel any in-flight icon validation
    IS_CUSTOM_ICON = false;
    ICON = (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');
    if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = '';
    if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = '';
    ICON_FILE_SIZE = 0;
    ICON_FILE_TYPE = '';
    ICON_FILE_NAME = '';
    const fileInput = $('icoFile');
    if(fileInput) fileInput.value = '';
    if(typeof userDraft !== 'undefined' && userDraft){
      userDraft.icon = ICON;
      userDraft.icon1024 = ICON;
      userDraft.isCustomIcon = false;
    }
    const badge = $('iconStatusBadge');
    if(badge){
      badge.style.display = 'none';
      badge.innerHTML = '';
    }
    const dimTag = $('iconDimTag');
    if(dimTag){
      dimTag.style.display = 'none';
      dimTag.textContent = '';
    }
    renderIcons();
    saveState();
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof showToast === 'function'){
      showToast('App icon removed', 'ok');
    }
  };
}


/* =========================================================================
   Module: src/js/modules/shots/phone.js
   ========================================================================= */
// Store Preview Studio - Phone Screenshots Manager & Validator
let pick = -1;

function renderShots(){
  // Sanitize SHOTS array to ensure strings only
  SHOTS = SHOTS.filter(s => typeof s === 'string');

  // Update Phone Mockup Carousels
  $$('[data-shots=gal]').forEach(c => {
    c.innerHTML = '';
    SHOTS.filter(s => s.trim()).forEach((s, i) => c.appendChild(mk(s, 'Screenshot ' + (i + 1))));
  });
  $$('[data-shots=shots]').forEach(c => {
    c.innerHTML = '';
    const valid = SHOTS.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      for(let i = 0; i < 3; i++){
        const sk = document.createElement('div');
        sk.className = 'sr-skel-shot';
        c.appendChild(sk);
      }
    } else {
      valid.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
    }
  });
  $$('[data-shots=gp-search]').forEach(c => {
    c.innerHTML = '';
    const valid = SHOTS.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      for(let i = 0; i < 3; i++){
        const sk = document.createElement('div');
        sk.className = 'gp-skel-shot';
        c.appendChild(sk);
      }
    } else {
      valid.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
    }
  });

  // Validate screenshots count & aspect ratios
  validateScreenshots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(typeof renderTablets === 'function') renderTablets();

  // Update Editor Screenshot List with Drag & Drop Sorting
  const L = $('slist');
  if(!L) return;
  L.innerHTML = '';
  SHOTS.forEach((s, i) => {
    const r = document.createElement('div');
    r.className = 'srow';
    r.draggable = true;
    r.dataset.index = i;

    // Drag Handle
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    handle.title = 'Drag to reorder';
    r.appendChild(handle);

    const hasImg = !!(s && typeof s === 'string' && s.trim() && (typeof PH === 'undefined' || s !== PH) && (typeof PH_LIGHT === 'undefined' || s !== PH_LIGHT));

    // Thumbnail Preview with Click-to-Inspect & Floating Delete Button
    const thumbWrap = document.createElement('div');

    if (hasImg) {
      thumbWrap.className = 'shot-thumb-wrap has';
      const thumb = mk(s, 'Screenshot ' + (i + 1));
      thumb.style.cursor = 'pointer';
      thumb.title = 'Click to inspect & view details';
      thumb.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
            type: 'screenshot',
            store,
            index: i,
            title: `Phone Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              SHOTS[i] = dataUrl;
              renderShots();
              saveState();
            }
          });
        }
      };
      thumbWrap.appendChild(thumb);
    } else {
      thumbWrap.className = 'shot-thumb-wrap is-placeholder';
      thumbWrap.title = 'Click to upload screenshot';
      thumbWrap.setAttribute('role', 'button');
      thumbWrap.setAttribute('tabindex', '0');
      const ov = document.createElement('div');
      ov.className = 'shot-thumb-ov';
      ov.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
      thumbWrap.appendChild(ov);
      thumbWrap.onclick = () => {
        if(typeof canUpload === 'function' && !canUpload(1000)) return;
        pick = i;
        const fi = $('shotFile');
        if(fi) fi.click();
      };
      thumbWrap.onkeydown = e => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          thumbWrap.click();
        }
      };
    }

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'shot-remove-btn';
    delBtn.title = 'Delete Screenshot';
    delBtn.setAttribute('aria-label', 'Delete Screenshot');
    delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    delBtn.onmousedown = e => e.stopPropagation();
    delBtn.onclick = e => {
      e.stopPropagation();
      SHOTS.splice(i, 1);
      renderShots();
      saveState();
    };
    thumbWrap.appendChild(delBtn);
    r.appendChild(thumbWrap);

    // Row Title, Role Tag & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    const isAppPreview = store === 'apple' && i < 3;
    const previewBadgeHtml = isAppPreview ? '<span class="shot-preview-pill" title="Image appears on App Store search/product page">App Preview</span>' : '';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>${previewBadgeHtml}`;

    const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
    metaLine.innerHTML = `<span class="shot-dim-tag" id="shotDimTag_${i}" style="display:none"></span>`;

    col.append(head, metaLine);
    r.appendChild(col);

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML =
      '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
      '<button type="button" class="mini shot-inspect-btn' + (hasImg ? '' : ' disabled') + '" title="' + (hasImg ? 'Inspect screenshot details' : 'Upload a screenshot to inspect details') + '" aria-label="Inspect screenshot details"' + (hasImg ? '' : ' disabled aria-disabled="true"') + '>' + ICO_INSPECT + '</button>';
    const upBtn = act.children[0];
    const inspectBtn = act.children[1];
    if(!hasImg){
      inspectBtn.classList.add('disabled');
    }
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    if(hasImg){
      inspectBtn.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
            type: 'screenshot',
            store,
            index: i,
            title: `Phone Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              SHOTS[i] = dataUrl;
              renderShots();
              saveState();
            }
          });
        }
      };
    } else {
      inspectBtn.onclick = null;
    }
    r.appendChild(act);

    // Drag & Drop event handlers for row reordering
    r.addEventListener('dragstart', e => {
      r.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', i);
    });
    r.addEventListener('dragend', () => {
      r.classList.remove('dragging');
      $$('.srow').forEach(row => row.classList.remove('drag-over'));
    });
    r.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      r.classList.add('drag-over');
    });
    r.addEventListener('dragleave', () => {
      r.classList.remove('drag-over');
    });
    r.addEventListener('drop', e => {
      e.preventDefault();
      r.classList.remove('drag-over');
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const toIdx = i;
      if(!isNaN(fromIdx) && fromIdx !== toIdx){
        const item = SHOTS.splice(fromIdx, 1)[0];
        SHOTS.splice(toIdx, 0, item);
        renderShots();
        saveState();
      }
    });

    L.appendChild(r);
  });
}

let _phoneValRunId = 0;
function validateScreenshots(){
  const runId = ++_phoneValRunId;
  const validShots = SHOTS.filter(s => s && s.trim());
  const validCount = validShots.length;
  const maxAllowed = store === 'apple' ? 10 : 8;
  const minRequired = store === 'apple' ? 1 : 2;

  const counterEl = $('shotCounter');
  const previewCounterEl = $('appPreviewCounter');
  const addBtn = $('addShot');
  if(addBtn){
    const atLimit = (typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed;
    addBtn.disabled = atLimit;
    if(atLimit){
      addBtn.title = `${store === 'apple' ? 'App Store' : 'Google Play'} allows a maximum of ${maxAllowed} screenshots`;
    } else {
      addBtn.removeAttribute('title');
    }
  }
  if(store === 'apple'){
    const appPreviewCount = Math.min(validCount, 3);
    if(previewCounterEl){
      previewCounterEl.style.display = 'inline-flex';
      previewCounterEl.textContent = `${appPreviewCount} of 3 App Previews`;
      previewCounterEl.title = 'Images appear on App Store product page';
    }
    if(counterEl){
      counterEl.textContent = `${validCount} of ${maxAllowed} App Screenshots`;
      counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    }
  } else {
    if(previewCounterEl){
      previewCounterEl.style.display = 'none';
    }
    if(counterEl){
      counterEl.textContent = `${validCount} of ${maxAllowed} screenshots`;
      counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    }
  }

  const hintEl = $('shotHint');
  if(hintEl){
    if(store === 'apple'){
      hintEl.innerHTML = 'Drag and drop to add assets or choose from your Asset Library for iPhone 6.1" or 6.3" displays. Supported sizes for app previews include 1920 × 886px and 886 × 1920px. For app screenshots, supported sizes include 2556 × 1179px, 1179 × 2556px, 2622 × 1206px and 1206 × 2622px.<br>• PNG or JPEG, no alpha transparency.<br>• Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots (16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px).<br>• PNG or JPEG, up to 8 MB each.<br>• Drag ⠿ handle to reorder.';
    }
  }

  const badgeEl = $('shotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount === 0){
    badgeEl.style.display = 'none';
    badgeEl.innerHTML = '';
    return;
  }

  if(validCount < minRequired){
    badgeEl.className = 'shot-status-badge warn';
    badgeEl.innerHTML = `${SB_WARN}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Notice:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'}. Stores require at least <strong>${minRequired} screenshot${minRequired === 1 ? '' : 's'}</strong>.</span>`;
    badgeEl.style.display = 'flex';
    return;
  }
  if(validCount > maxAllowed){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Rejection Risk:</strong> ${validCount} screenshots. ${store === 'apple' ? 'Apple' : 'Google Play'} allows a maximum of <strong>${maxAllowed} screenshots</strong>.</span>`;
    badgeEl.style.display = 'flex';
    return;
  }

  let checked = 0;
  const squareIndices = [];
  const extremeRatioIndices = [];   // e.g. banner 730×172 — ratio > 2.5:1
  const landscapeOkIndices = [];    // standard Apple/Google landscape → ok (green)
  const landscapeWarnIndices = [];  // non-standard landscape (unusual ratio) → warn
  const portraitIndices = [];       // normal portrait shots
  const nonPhoneIndices = [];
  const sizeIssueIndices = [];
  const overSizeIndices = [];

  SHOTS.forEach((s, idx) => {
    if(!s || !s.trim()){
      const tag = $('shotDimTag_' + idx);
      if(tag) tag.style.display = 'none';
      return;
    }
    const resolvedSrc = ensureSvgDimensions(s);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if(runId !== _phoneValRunId) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const tag = $('shotDimTag_' + idx);

      let shotSize = 0;
      if (typeof s === 'string' && s.startsWith('data:')) {
        const comma = s.indexOf(',');
        if (comma !== -1) {
          const b64 = s.slice(comma + 1);
          const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
          shotSize = Math.round((b64.length * 3) / 4 - pad);
        }
      }
      const isOverSize = shotSize > 8 * 1024 * 1024;

      if(w > 0 && h > 0){
        const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
        const isLandscape = w > h * 1.15;
        const isPhonePortrait = h >= w * 1.35;
        const isGoogleSizeIssue = store === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

        // Standard Apple landscape resolutions (portrait dimensions swapped)
        const isStandardAppleLandscape = store === 'apple' && (
          (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
          (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
          (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
          (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
          (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
          (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
          (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
        );
        // Standard Google landscape: phone aspect ratio within range (1.5:1 to 2.2:1)
        const isStandardGoogleLandscape = store === 'google' && isLandscape &&
          !isSquare && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
        // Extreme non-phone ratio (e.g. banner 730×172 → 4.24:1) — always err
        const isExtremeRatio = isLandscape && (w / h > 2.5);
        // Landscape below phone AR range (e.g. 800×600 = 1.33:1 = tablet) — err
        const isNonPhoneLandscape = isLandscape && !isExtremeRatio && (w / h < 1.5) && !isStandardAppleLandscape;

        if(tag){
          tag.style.display = 'inline-flex';
          // 1. Invalid ratio is an ERROR (red)
          if(isSquare){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `1:1 Square (${w}×${h})`;
          } else if(isLandscape && (isExtremeRatio || isNonPhoneLandscape)){
            // e.g. 730×172 banner — aspect ratio is not a phone screen at all
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Invalid Ratio (${w}×${h})`;
          } else if(isLandscape && (isStandardAppleLandscape || isStandardGoogleLandscape)){
            // Official landscape dimensions from App Store Connect / Google Play → ok
            tag.className = 'shot-dim-tag ok';
            tag.textContent = `Landscape (${w}×${h})`;
          } else if(isLandscape){
            // Landscape but not an extreme ratio and not a known standard → warn (unusual)
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Landscape (${w}×${h})`;
          } else if(!isPhonePortrait){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Non-portrait (${w}×${h})`;
          }
          // 2. Valid ratio with invalid filesize/dimensions is a WARNING (amber)
          else if(isOverSize){
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `>8 MB (${(shotSize/(1024*1024)).toFixed(1)} MB)`;
          } else if(isGoogleSizeIssue){
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Out of Range (${w}×${h})`;
          } else {
            const isStandardApple = store === 'apple' && (
              // Dynamic Island (large display)
              (w === 1320 && h === 2868) || // iPhone 6.9"
              (w === 1290 && h === 2796) || // iPhone 6.7"
              (w === 1260 && h === 2736) || // iPhone Air / 6.7"
              // Dynamic Island (medium display)
              (w === 1206 && h === 2622) || // iPhone 6.3"
              (w === 1179 && h === 2556) || // iPhone 6.1"
              // Face ID (large display)
              (w === 1284 && h === 2778) || // iPhone 6.5"
              (w === 1242 && h === 2688) || // iPhone 6.5"
              // Face ID (medium display)
              (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
              (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
              (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
              // Home Button (large display)
              (w === 1242 && h === 2208) || // iPhone 5.5"
              // Home Button (medium display)
              (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
              // iPhone Duo
              (w === 1398 && h === 2034) ||
              (w === 2007 && h === 2853) ||
              // Legacy 4" / 3.5"
              (w === 640 && h === 1136) ||
              (w === 640 && h === 1096) ||
              (w === 640 && h === 960) ||
              (w === 640 && h === 920)
            );
            const isStandardGoogle = store === 'google' && (
              (w === 1080 && h === 1920) ||
              (w === 1080 && h === 2340) ||
              (w === 1080 && h === 2400) ||
              (w === 1080 && h === 2160) ||
              (w === 1080 && h === 2280) ||
              (w === 1440 && h === 2560) ||
              (w === 1440 && h === 3120) ||
              (w === 1440 && h === 3200) ||
              (w === 1440 && h === 2880) ||
              (w === 1440 && h === 2960) ||
              (w === 1440 && h === 3088) ||
              (w === 720 && h === 1280) ||
              (w === 720 && h === 1560) ||
              (w === 720 && h === 1600) ||
              (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
            );
            if((store === 'apple' && isStandardApple) || (store === 'google' && isStandardGoogle)){
              tag.className = 'shot-dim-tag ok';
              tag.textContent = `Portrait (${w}×${h})`;
            } else {
              tag.className = 'shot-dim-tag warn';
              tag.textContent = `Scaled (${w}×${h})`;
            }
          }
        }

        // Collect indices for badge banner
        if(isSquare){
          squareIndices.push(idx + 1);
        } else if(isLandscape && isExtremeRatio){
          extremeRatioIndices.push(idx + 1);
        } else if(isLandscape && (isStandardAppleLandscape || isStandardGoogleLandscape)){
          landscapeOkIndices.push(idx + 1);
        } else if(isLandscape && !(isExtremeRatio || isNonPhoneLandscape)){
          landscapeWarnIndices.push(idx + 1);
        } else if(!isPhonePortrait){
          nonPhoneIndices.push(idx + 1);
        } else {
          portraitIndices.push(idx + 1);
          // Valid portrait ratio: verify fileSize & dimensions
          if(isOverSize){
            overSizeIndices.push(idx + 1);
          }
          if(isGoogleSizeIssue){
            sizeIssueIndices.push(idx + 1);
          }
        }
      }

      checked++;
      if(checked === validCount){
        finalizeBadge();
      }
    };
    img.onerror = () => {
      if(runId !== _phoneValRunId) return;
      checked++;
      if(checked === validCount){
        finalizeBadge();
      }
    };
    img.src = resolvedSrc;
  });

  function finalizeBadge(){
    const maxAllowed = store === 'apple' ? 10 : 8;
    // 1. Invalid ratio is an ERROR (red)
    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      const noun = squareIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = squareIndices.length > 1 ? 'are' : 'is';
      badgeEl.className = 'shot-status-badge err';
      if(store === 'apple'){
        badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${noun} ${items} ${verb} square (1:1). Apple requires standard phone dimensions (such as 1179×2556 px or 1206×2622 px).</span>`;
      } else {
        badgeEl.innerHTML = `${SB_ERR}<span><strong>Aspect Ratio Error:</strong> ${noun} ${items} ${verb} square (1:1). Google Play requires standard dimensions (such as 1080×1920 px).</span>`;
      }
      badgeEl.style.display = 'flex';
    } else if(extremeRatioIndices.length > 0){
      // e.g. 730×172 banner — aspect ratio is not a phone screen at all
      const items = extremeRatioIndices.map(n => `#${n}`).join(', ');
      const noun = extremeRatioIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = extremeRatioIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Invalid Aspect Ratio:</strong> ${noun} ${items} ${verb} an unsupported banner-like ratio. Phone screenshots must have a phone screen aspect ratio (e.g. 9:16 or 9:19.5). Re-export at a supported dimension such as 1179×2556 px.</span>`;
      badgeEl.style.display = 'flex';
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Aspect Ratio Error:</strong> Screenshot ${items} has non-portrait ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 2. MIXED ORIENTATION WARNING (AMBER) — portrait + landscape mixed in same set
    else if(landscapeOkIndices.length > 0 && portraitIndices.length > 0){
      const lItems = landscapeOkIndices.map(n => `#${n}`).join(', ');
      const pItems = portraitIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Mixed Orientation:</strong> Landscape ${lItems} and portrait ${pItems} in the same set. ${store === 'apple' ? 'Apple may reject for inconsistent presentation (Guideline 2.3).' : 'Google Play recommends consistent orientation.'} Use all-portrait or all-landscape per device size.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 3. ALL LANDSCAPE OK — standard Apple/Google landscape only
    else if(landscapeOkIndices.length > 0 && portraitIndices.length === 0){
      // All-landscape set, all standard — green (no banner needed)
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
    // 4. UNUSUAL LANDSCAPE WARNING (non-standard ratio but not extreme)
    else if(landscapeWarnIndices.length > 0){
      const items = landscapeWarnIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Non-standard Landscape:</strong> Screenshot ${items} is landscape with an unusual aspect ratio. Verify this matches a supported store dimension before submission.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 5. Valid ratio with invalid filesize/dimensions is a WARNING (amber)
    else if(overSizeIndices.length > 0){
      const items = overSizeIndices.map(n => `#${n}`).join(', ');
      const noun = overSizeIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = overSizeIndices.length > 1 ? 'exceed' : 'exceeds';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>File Size Warning:</strong> ${noun} ${items} ${verb} 8 MB maximum limit. Consider optimizing to reduce load times.</span>`;
      badgeEl.style.display = 'flex';
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Warning:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>`;
      badgeEl.style.display = 'flex';
    } else {
      // Compliant: All criteria met -> hide badge, do not show green message box
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
  }
}

if($('shotFile')){
  $('shotFile').onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
    const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
    if(pick < 0 && (typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed){
      showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
      e.target.value = '';
      return;
    }
    if(typeof validateUploadFile === 'function' && !validateUploadFile(f, MAX_UPLOAD_BYTES, 'Phone screenshot')){
      e.target.value = '';
      return;
    }
    readFile(f, d => {
      pick < 0 ? SHOTS.push(d) : SHOTS[pick] = d;
      pick = -1;
      renderShots();
      saveState();
      showToast('Screenshot uploaded!', 'ok');
    });
    e.target.value = '';
  };
}

if($('addShot')){
  $('addShot').onclick = () => {
    const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
    if((typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed){
      showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
      return;
    }
    SHOTS.push('');
    renderShots();
    saveState();
    const ins = $$('.srow input');
    if(ins.length) ins[ins.length - 1].focus();
  };
}

// Interactive Toggle for Google Play Search Result Screenshots Expand/Collapse
document.addEventListener('click', e => {
  const btn = e.target.closest('.gp-search-action-btn');
  if (btn) {
    const card = btn.closest('.gp-search-card');
    if (card) {
      card.classList.toggle('is-expanded');
    }
  }
});


/* =========================================================================
   Module: src/js/modules/shots/ipad.js
   ========================================================================= */
// Store Preview Studio - Apple iPad Pro 13" Screenshots Manager & Tools
function setSupportsIpad(val){
  SUPPORTS_IPAD = !!val;
  const chk = $('f-dest-ipad');
  if(chk && chk.checked !== SUPPORTS_IPAD) chk.checked = SUPPORTS_IPAD;

  const tileIpad = $('destTileIpad');
  if(tileIpad) tileIpad.classList.toggle('active', SUPPORTS_IPAD);

  const badge = $('destStatusBadge');
  if(badge){
    badge.textContent = SUPPORTS_IPAD ? 'Universal App' : 'iPhone Only';
    badge.className = 'dest-badge' + (SUPPORTS_IPAD ? ' universal' : '');
  }

  const descBar = $('destDescBar');
  const hint = $('destIpadHint');
  if(descBar && hint){
    descBar.classList.toggle('active-universal', SUPPORTS_IPAD);
    if(SUPPORTS_IPAD){
      hint.innerHTML = '<strong>Universal App Active:</strong> Dedicated iPad screenshots in Card 5 below.';
    } else {
      hint.innerHTML = '<strong>iPhone-only Mode:</strong> Apple displays scaled iPhone fallback unless dedicated iPad screenshots are added in Card 5.';
    }
  }

  const ipadCard = $('ipadCard');
  if(ipadCard) ipadCard.style.display = (store === 'apple') ? '' : 'none';

  $$('.a-platforms-badge').forEach(b => {
    const ipadIco = b.querySelector('.a-plat-ico-ipad');
    const label = b.querySelector('.a-plat-label') || b.querySelector('span');
    if(ipadIco) ipadIco.style.display = SUPPORTS_IPAD ? '' : 'none';
    if(label) label.textContent = SUPPORTS_IPAD ? 'iPhone, iPad' : 'iPhone';
  });

  $$('.ipad-platforms-row').forEach(row => {
    const tabletIco = row.querySelector('.ipad-plat-tablet');
    const label = row.querySelector('.ipad-plat-label');
    if(tabletIco) tabletIco.style.display = SUPPORTS_IPAD ? '' : 'none';
    if(label) label.textContent = SUPPORTS_IPAD ? 'iPad, iPhone' : 'iPhone';
  });

  const compatNotice = $('ipadCompatNotice');
  if(compatNotice) compatNotice.style.display = SUPPORTS_IPAD ? 'none' : 'inline-flex';

  const ipadCompatVal = $('ipadCompatVal');
  if(ipadCompatVal) ipadCompatVal.textContent = SUPPORTS_IPAD ? 'Works on this iPad' : 'Designed for iPhone';

  const iphoneCompatVal = $('iphoneCompatVal');
  if(iphoneCompatVal) iphoneCompatVal.textContent = SUPPORTS_IPAD ? 'Works on iPhone, iPad (iOS 16.0+)' : 'Works on this iPhone (iOS 16.0+)';

  renderIpadShots();
  validateScreenshots();
}

function renderIpadShots(){
  if(!Array.isArray(IPAD_SHOTS)) IPAD_SHOTS = [];
  IPAD_SHOTS = IPAD_SHOTS.filter(s => typeof s === 'string');

  const validIpadShots = IPAD_SHOTS.filter(s => s && s.trim());
  const validPhoneShots = (SHOTS || []).filter(s => typeof s === 'string' && s.trim());

  // Prioritize dedicated iPad screenshots if present AND SUPPORTS_IPAD is enabled, otherwise fallback to Phone screenshots
  const hasDedicatedIpadShots = SUPPORTS_IPAD && validIpadShots.length > 0;
  const effectiveShots = hasDedicatedIpadShots ? validIpadShots : validPhoneShots;

  // Update iPad Mockup Carousel
  $$('[data-shots=ipad-gal]').forEach(c => {
    c.innerHTML = '';
    effectiveShots.forEach((s, i) => {
      const img = mk(s, 'iPad Screenshot ' + (i + 1));
      if(hasDedicatedIpadShots) img.classList.add('ipad-shot');
      c.appendChild(img);
    });
  });

  // Update iPad Search Result 2-Column Grid Card
  $$('[data-shots=ipad-shots]').forEach(c => {
    c.innerHTML = '';
    const searchView = c.closest('.ipad-search-view') || $('.ipad-search-view');
    const valid = effectiveShots.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      c.classList.remove('has-landscape');
      if (searchView) searchView.classList.remove('has-landscape');
      for(let i = 0; i < 2; i++){
        const sk = document.createElement('div');
        sk.className = 'ipad-skel-shot';
        c.appendChild(sk);
      }
    } else {
      const firstShot = valid[0];
      const isLandscapeUrl = (typeof firstShot === 'string') && (/\/2732x2048bb|\/2688x1242bb/i.test(firstShot) || firstShot.includes('landscape'));
      c.classList.toggle('has-landscape', isLandscapeUrl);
      if (searchView) searchView.classList.toggle('has-landscape', isLandscapeUrl);

      const count = isLandscapeUrl ? 1 : Math.min(2, valid.length);
      for (let i = 0; i < count; i++) {
        const s = valid[i];
        const img = mk(s || (typeof PH_IPAD !== 'undefined' ? PH_IPAD : PH), 'Result ' + (i + 1));
        img.className = 'ipad-sr-shot';
        if (isLandscapeUrl) {
          img.classList.add('landscape-shot');
        } else {
          img.classList.add('portrait-shot');
        }
        img.onload = function() {
          if (this.naturalWidth > this.naturalHeight * 1.15) {
            c.classList.add('has-landscape');
            if (searchView) searchView.classList.add('has-landscape');
            this.classList.add('landscape-shot');
            this.classList.remove('portrait-shot');
            while (c.children.length > 1) {
              c.removeChild(c.lastChild);
            }
          } else if (this.naturalHeight > this.naturalWidth * 1.15 && c.classList.contains('has-landscape')) {
            c.classList.remove('has-landscape');
            if (searchView) searchView.classList.remove('has-landscape');
            this.classList.remove('landscape-shot');
            this.classList.add('portrait-shot');
          }
        };
        c.appendChild(img);
      }

      if (!isLandscapeUrl && valid.length === 1) {
        const sk = document.createElement('div');
        sk.className = 'ipad-skel-shot';
        c.appendChild(sk);
      }
    }
  });

  // Render iPad Editor list and status
  renderIpadSlist();
  validateIpadScreenshots();
}

function renderIpadSlist(){
  const L = $('ipadSlist');
  if(!L) return;
  L.innerHTML = '';

  IPAD_SHOTS.forEach((s, i) => {
    const r = document.createElement('div');
    r.className = 'srow';
    r.draggable = true;
    r.dataset.index = i;

    // Drag Handle
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    handle.title = 'Drag to reorder';
    r.appendChild(handle);

    const hasImg = !!(s && typeof s === 'string' && s.trim() && (typeof PH === 'undefined' || s !== PH) && (typeof PH_IPAD === 'undefined' || s !== PH_IPAD) && (typeof PH_LIGHT === 'undefined' || s !== PH_LIGHT));

    // Thumbnail Preview with Click-to-Inspect & Floating Delete Button
    const thumbWrap = document.createElement('div');

    if (hasImg) {
      thumbWrap.className = 'shot-thumb-wrap has';
      const thumb = mk(s, 'iPad Screenshot ' + (i + 1));
      thumb.style.cursor = 'pointer';
      thumb.title = 'Click to inspect & view details';
      thumb.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
            type: 'ipad',
            store: 'apple',
            index: i,
            title: `iPad Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              IPAD_SHOTS[i] = dataUrl;
              renderIpadShots();
              saveState();
            }
          });
        }
      };
      thumbWrap.appendChild(thumb);
    } else {
      thumbWrap.className = 'shot-thumb-wrap is-placeholder';
      thumbWrap.title = 'Click to upload iPad screenshot';
      thumbWrap.setAttribute('role', 'button');
      thumbWrap.setAttribute('tabindex', '0');
      const ov = document.createElement('div');
      ov.className = 'shot-thumb-ov';
      ov.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
      thumbWrap.appendChild(ov);
      thumbWrap.onclick = () => {
        if(typeof canUpload === 'function' && !canUpload(1000)) return;
        ipadPick = i;
        const fi = $('ipadShotFile');
        if(fi) fi.click();
      };
      thumbWrap.onkeydown = e => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          thumbWrap.click();
        }
      };
    }

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'shot-remove-btn';
    delBtn.title = 'Delete Screenshot';
    delBtn.setAttribute('aria-label', 'Delete Screenshot');
    delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    delBtn.onmousedown = e => e.stopPropagation();
    delBtn.onclick = e => {
      e.stopPropagation();
      IPAD_SHOTS.splice(i, 1);
      renderIpadShots();
      saveState();
    };
    thumbWrap.appendChild(delBtn);
    r.appendChild(thumbWrap);

    // Row Title, Role Tag & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>`;

    const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
    metaLine.innerHTML = `<span class="shot-dim-tag" id="ipadShotDimTag_${i}" style="display:none"></span>`;

    col.append(head, metaLine);
    r.appendChild(col);

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML =
      '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
      '<button type="button" class="mini shot-inspect-btn' + (hasImg ? '' : ' disabled') + '" title="' + (hasImg ? 'Inspect screenshot details' : 'Upload an iPad screenshot to inspect details') + '" aria-label="Inspect screenshot details"' + (hasImg ? '' : ' disabled aria-disabled="true"') + '>' + ICO_INSPECT + '</button>';
    const upBtn = act.children[0];
    const inspectBtn = act.children[1];
    if(!hasImg){
      inspectBtn.classList.add('disabled');
    }
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };
    if(hasImg){
      inspectBtn.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
            type: 'ipad',
            store: 'apple',
            index: i,
            title: `iPad Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              IPAD_SHOTS[i] = dataUrl;
              renderIpadShots();
              saveState();
            }
          });
        }
      };
    } else {
      inspectBtn.onclick = null;
    }
    r.appendChild(act);

    // Drag & Drop event handlers for row reordering
    r.addEventListener('dragstart', e => {
      r.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', i);
    });
    r.addEventListener('dragend', () => {
      r.classList.remove('dragging');
      $$('#ipadSlist .srow').forEach(row => row.classList.remove('drag-over'));
    });
    r.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      r.classList.add('drag-over');
    });
    r.addEventListener('dragleave', () => {
      r.classList.remove('drag-over');
    });
    r.addEventListener('drop', e => {
      e.preventDefault();
      r.classList.remove('drag-over');
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const toIdx = i;
      if(!isNaN(fromIdx) && fromIdx !== toIdx){
        const item = IPAD_SHOTS.splice(fromIdx, 1)[0];
        IPAD_SHOTS.splice(toIdx, 0, item);
        renderIpadShots();
        saveState();
      }
    });

    L.appendChild(r);
  });
}

let _ipadValRunId = 0;
function validateIpadScreenshots(){
  const runId = ++_ipadValRunId;
  const validShots = (IPAD_SHOTS || []).filter(s => s && s.trim());
  const validCount = validShots.length;
  const counterEl = $('ipadShotCounter');
  if(counterEl){
    counterEl.textContent = `${validCount} / 10 screenshots`;
    counterEl.className = 'cc' + (validCount > 10 ? ' err' : '');
  }
  const addBtn = $('addIpadShot');
  if(addBtn){
    const atLimit = (typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0) >= 10;
    addBtn.disabled = atLimit;
    if(atLimit){
      addBtn.title = 'iPad allows a maximum of 10 screenshots';
    } else {
      addBtn.removeAttribute('title');
    }
  }
  const badgeEl = $('ipadShotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount === 0){
    badgeEl.className = 'shot-status-badge ok';
    badgeEl.innerHTML = '';
    badgeEl.style.display = 'none';
    return;
  }

  if(validCount > 10){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${validCount} screenshots. Apple allows a maximum of <strong>10 screenshots</strong> for iPad.</span>`;
    badgeEl.style.display = 'flex';
    return;
  }

  let checked = 0;
  const nonCompliantIndices = [];
  const compliantIndices = [];

  IPAD_SHOTS.forEach((s, idx) => {
    if(!s || !s.trim()){
      const tag = $('ipadShotDimTag_' + idx);
      if(tag) tag.style.display = 'none';
      return;
    }
    const resolvedSrc = ensureSvgDimensions(s);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if(runId !== _ipadValRunId) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const tag = $('ipadShotDimTag_' + idx);

      const isExactIpad = (
        // iPad 13" / 12.9" display
        (w === 2064 && h === 2752) || (w === 2752 && h === 2064) ||
        (w === 2048 && h === 2732) || (w === 2732 && h === 2048) ||
        // iPad 11" display
        (w === 1488 && h === 2266) || (w === 2266 && h === 1488) ||
        (w === 1668 && h === 2420) || (w === 2420 && h === 1668) ||
        (w === 1668 && h === 2388) || (w === 2388 && h === 1668) ||
        (w === 1640 && h === 2360) || (w === 2360 && h === 1640) ||
        // iPad 10.5" display
        (w === 1668 && h === 2224) || (w === 2224 && h === 1668) ||
        // iPad 9.7" display (legacy)
        (w === 1536 && h === 2048) || (w === 2048 && h === 1536) ||
        (w === 1536 && h === 2008) || (w === 2048 && h === 1496) ||
        (w === 768 && h === 1024)  || (w === 1024 && h === 768) ||
        (w === 768 && h === 1004)  || (w === 1024 && h === 748)
      );

      const ratio = w / h;
      const is3to4 = (Math.abs(ratio - (3/4)) < 0.08) || (Math.abs(ratio - (4/3)) < 0.08) || (ratio >= 0.65 && ratio <= 0.85) || (ratio >= 1.18 && ratio <= 1.54);

      let shotSize = 0;
      if (typeof s === 'string' && s.startsWith('data:')) {
        const comma = s.indexOf(',');
        if (comma !== -1) {
          const b64 = s.slice(comma + 1);
          const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
          shotSize = Math.round((b64.length * 3) / 4 - pad);
        }
      }
      const isOverSize = shotSize > 8 * 1024 * 1024;

      const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;

      if(tag){
        tag.style.display = 'inline-flex';
        // 1. Invalid ratio is an ERROR (red)
        if(isSquare){
          tag.className = 'shot-dim-tag err';
          tag.textContent = `1:1 Square (${w}×${h})`;
        } else if(h > w * 1.5 || w > h * 1.5){
          tag.className = 'shot-dim-tag err';
          tag.textContent = `Phone Ratio (${w}×${h})`;
        } else if(!isExactIpad && !is3to4){
          tag.className = 'shot-dim-tag err';
          tag.textContent = `Wrong Ratio (${w}×${h})`;
        }
        // 2. Valid ratio with invalid filesize/dimensions is a WARNING (amber)
        else if(isOverSize){
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `>8 MB (${(shotSize/(1024*1024)).toFixed(1)} MB)`;
        } else if(!isExactIpad){
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `iPad 4:3 (${w}×${h})`;
        } else {
          tag.className = 'shot-dim-tag ok';
          tag.textContent = `iPad (${w}×${h})`;
        }
      }

      if(!isOverSize && (isExactIpad || is3to4)){
        compliantIndices.push(idx + 1);
      } else {
        nonCompliantIndices.push(idx + 1);
      }

      checked++;
      if(checked === validCount){
        finalizeIpadBadge();
      }
    };
    img.onerror = () => {
      if(runId !== _ipadValRunId) return;
      checked++;
      if(checked === validCount){
        finalizeIpadBadge();
      }
    };
    img.src = resolvedSrc;
  });

  function finalizeIpadBadge(){
    if(nonCompliantIndices.length > 0){
      const items = nonCompliantIndices.map(n => `#${n}`).join(', ');
      const noun = nonCompliantIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> ${noun} ${items} exceed 8 MB limit or not standard iPad 4:3 ratio. Phone screenshots will be cropped or letterboxed.</span>`;
      badgeEl.style.display = 'flex';
    } else {
      // Compliant: All criteria met -> hide badge, do not show green message box
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
  }
}

// Event Listeners for iPad Destination & Screenshots
let ipadPick = -1;

const fDestIpad = $('f-dest-ipad');
if(fDestIpad){
  fDestIpad.onchange = (e) => {
    setSupportsIpad(e.target.checked);
    saveState();
  };
}

const addIpadShot = $('addIpadShot');
if(addIpadShot){
  addIpadShot.onclick = () => {
    if((typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0) >= 10){
      showToast('iPad allows up to 10 screenshots', 'warn');
      return;
    }
    if(!SUPPORTS_IPAD) setSupportsIpad(true);
    IPAD_SHOTS.push('');
    renderIpadShots();
    saveState();
    const ins = $$('#ipadSlist input');
    if(ins.length) ins[ins.length - 1].focus();
  };
}

const ipadShotFile = $('ipadShotFile');
if(ipadShotFile){
  ipadShotFile.onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
    if(ipadPick < 0 && (typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0) >= 10){
      showToast('iPad allows up to 10 screenshots', 'warn');
      e.target.value = '';
      return;
    }
    if(typeof validateUploadFile === 'function' && !validateUploadFile(f, MAX_UPLOAD_BYTES, 'iPad screenshot')){
      e.target.value = '';
      return;
    }
    readFile(f, d => {
      if(!SUPPORTS_IPAD) setSupportsIpad(true);
      ipadPick < 0 ? IPAD_SHOTS.push(d) : IPAD_SHOTS[ipadPick] = d;
      ipadPick = -1;
      renderIpadShots();
      saveState();
      showToast('iPad screenshot uploaded!', 'ok');
    });
    e.target.value = '';
  };
}

// Drag & drop image files onto iPad screenshot editor card
const ipadSlistArea = $('ipadSlist') ? $('ipadSlist').parentElement : null;
if(ipadSlistArea){
  ipadSlistArea.addEventListener('dragover', e => e.preventDefault());
  ipadSlistArea.addEventListener('drop', e => {
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if(files.length){
      e.preventDefault();
      e.stopPropagation();
      let validFiles = files.filter(f => (typeof validateUploadFile !== 'function') || validateUploadFile(f, MAX_UPLOAD_BYTES, 'iPad screenshot'));
      if(!validFiles.length) return;
      const currentCount = typeof IPAD_SHOTS !== 'undefined' ? IPAD_SHOTS.length : 0;
      const room = 10 - currentCount;
      if(room <= 0){
        showToast('iPad allows up to 10 screenshots', 'warn');
        return;
      }
      if(validFiles.length > room){
        validFiles = validFiles.slice(0, room);
        showToast(`Only ${room} more fit (max 10) — extra files skipped`, 'warn');
      }
      if(!SUPPORTS_IPAD) setSupportsIpad(true);
      let loaded = 0;
      validFiles.forEach(f => {
        readFile(f, d => {
          IPAD_SHOTS.push(d);
          loaded++;
          if(loaded === validFiles.length){
            renderIpadShots();
            saveState();
            showToast(`Added ${validFiles.length} iPad screenshot(s)!`, 'ok');
          }
        });
      });
    }
  });
}


/* =========================================================================
   Module: src/js/modules/modal.js
   ========================================================================= */
// Store Preview Studio - Unified Asset Inspector Modal Controller (Single Source of Truth)
// Used seamlessly by both Core Studio and Marketing Showcase
(function (global) {
  'use strict';

  let _activeModalAsset = null;
  let _activeModalType = 'icon';
  let _activeModalStore = 'apple';
  let _activeModalIndex = -1;
  let _activeModalOnReplace = null;
  let _activeModalTitle = '';
  let _modalValRunId = 0;
  let _isInitialized = false;

  function $(id) {
    return document.getElementById(id);
  }

  function getAssetMeta(src, file) {
    if (file && typeof file.size === 'number') {
      return { size: file.size, type: file.type || 'image/png', name: file.name || '' };
    }
    let size = 0;
    let type = 'image/png';
    if (typeof src === 'string' && src.startsWith('data:')) {
      const comma = src.indexOf(',');
      if (comma !== -1) {
        const semi = src.indexOf(';');
        if (semi !== -1) type = src.substring(5, semi);
        const base64 = src.slice(comma + 1);
        const padding = base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0);
        size = Math.round((base64.length * 3) / 4 - padding);
      }
    }
    return { size, type };
  }

  const SVG_STORE_PNG_CACHE = new Map();
  function rasterizeSvgToStorePng(svgSrc, targetSize, callback) {
    if (!svgSrc || typeof svgSrc !== 'string') {
      if (callback) callback(svgSrc);
      return;
    }
    if (!svgSrc.startsWith('data:image/svg+xml') && !svgSrc.includes('<svg')) {
      if (callback) callback(svgSrc);
      return;
    }

    const cacheKey = `${targetSize}_${svgSrc.length}_${svgSrc.slice(0, 80)}`;
    if (SVG_STORE_PNG_CACHE.has(cacheKey)) {
      if (callback) callback(SVG_STORE_PNG_CACHE.get(cacheKey));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetSize, targetSize);

        const data = ctx.getImageData(0, 0, targetSize, targetSize).data;
        let hasAlpha = false;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) { hasAlpha = true; break; }
        }

        let finalPng = '';
        if (hasAlpha) {
          const solidCanvas = document.createElement('canvas');
          solidCanvas.width = targetSize;
          solidCanvas.height = targetSize;
          const sCtx = solidCanvas.getContext('2d');
          const topEdgeIdx = (Math.floor(targetSize * 0.05) * targetSize + Math.floor(targetSize / 2)) * 4;
          const midIdx = (Math.floor(targetSize / 2) * targetSize + Math.floor(targetSize / 2)) * 4;
          const r = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx] : (data[midIdx + 3] > 240 ? data[midIdx] : 255);
          const g = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 1] : (data[midIdx + 3] > 240 ? data[midIdx + 1] : 255);
          const b = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 2] : (data[midIdx + 3] > 240 ? data[midIdx + 2] : 255);
          sCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          sCtx.fillRect(0, 0, targetSize, targetSize);
          sCtx.drawImage(canvas, 0, 0);
          finalPng = solidCanvas.toDataURL('image/png');
        } else {
          finalPng = canvas.toDataURL('image/png');
        }

        SVG_STORE_PNG_CACHE.set(cacheKey, finalPng);
        if (callback) callback(finalPng);
      } catch (e) {
        if (callback) callback(svgSrc);
      }
    };
    img.onerror = () => {
      if (callback) callback(svgSrc);
    };
    img.src = svgSrc;
  }
  global.rasterizeSvgToStorePng = rasterizeSvgToStorePng;

  function closeIconModal() {
    const modal = $('msIconModal') || $('imageDetailModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function openIconModal(arg1, arg2) {
    let opts = {};
    if (typeof arg1 === 'string') {
      opts.src = arg1;
      opts.store = arg2 || (typeof store !== 'undefined' ? store : (typeof currentMode !== 'undefined' ? currentMode : 'apple'));
      opts.type = 'icon';
    } else if (arg1 && typeof arg1 === 'object') {
      opts = Object.assign({}, arg1);
    }

    const modal = $('msIconModal') || $('imageDetailModal');
    if (!modal) return;

    _activeModalType = opts.type || 'icon';
    _activeModalStore = opts.store || (typeof store !== 'undefined' ? store : (typeof currentMode !== 'undefined' ? currentMode : 'apple'));
    _activeModalIndex = typeof opts.index === 'number' ? opts.index : -1;
    _activeModalOnReplace = typeof opts.onReplace === 'function' ? opts.onReplace : null;
    _activeModalTitle = opts.title || '';

    let src = opts.src;
    if (!src) {
      if (_activeModalType === 'icon') {
        if (_activeModalStore === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) {
          src = CUSTOM_ICON_512;
        } else if (_activeModalStore === 'apple' && typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) {
          src = CUSTOM_ICON_1024;
        } else {
          src = (typeof ICON !== 'undefined' ? ICON : (typeof S !== 'undefined' && S ? (S[_activeModalStore === 'apple' ? 'iconApple' : 'iconGoogle'] || S.icon) : ''));
        }
        if (_activeModalStore === 'google' && typeof src === 'string' && src.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(src)) {
          src = src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png');
        } else if (_activeModalStore === 'apple' && typeof src === 'string' && src.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(src)) {
          src = src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png');
        }
      } else if (_activeModalType === 'feature') {
        src = (typeof FEATURE_GRAPHIC !== 'undefined' ? FEATURE_GRAPHIC : '');
      } else if (_activeModalType === 'ipad' && _activeModalIndex >= 0) {
        src = (typeof IPAD_SHOTS !== 'undefined' && IPAD_SHOTS[_activeModalIndex] ? IPAD_SHOTS[_activeModalIndex] : '');
      } else if (_activeModalType === 'screenshot' && _activeModalIndex >= 0) {
        src = (typeof SHOTS !== 'undefined' && SHOTS[_activeModalIndex] ? SHOTS[_activeModalIndex] : '');
      }
    }
    _activeModalAsset = src || '';

    modal.dataset.storeType = _activeModalStore;
    const canvas = $('msIconModalCanvas') || $('imageDetailModalCanvas');
    if (canvas) canvas.dataset.storeType = _activeModalStore;

    // Header & Titles Setup
    const titleEl = $('msIconModalTitle') || $('imageDetailModalTitle');
    const storeBadge = $('msIconModalStoreBadge') || $('imageDetailModalStoreBadge');
    const targetSpec = $('msIconModalTarget') || $('imageDetailModalTarget');
    const uploadBtnText = $('msIconModalUploadText') || $('imageDetailModalUploadText');

    if (storeBadge) {
      storeBadge.className = 'icon-modal-store-tag ' + (_activeModalStore === 'google' ? 'g' : 'a');
      storeBadge.textContent = _activeModalStore === 'google' ? 'Google' : 'Apple';
    }

    if (targetSpec) {
      targetSpec.textContent = '';
    }

    if (_activeModalType === 'icon') {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Apple App Icon Inspector' : 'Google Play Icon Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Icon';
    } else if (_activeModalType === 'ipad') {
      if (titleEl) titleEl.textContent = 'Apple iPad Screenshot Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New iPad Screenshot';
    } else if (_activeModalType === 'feature') {
      if (titleEl) titleEl.textContent = 'Google Play Feature Graphic Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Feature Graphic';
    } else {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'iPhone Screenshot Inspector' : 'Android Screenshot Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Screenshot';
    }

    if (_activeModalTitle && titleEl) {
      titleEl.textContent = _activeModalTitle;
    }

    const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
    if (_activeModalType === 'icon' && typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      const targetDim = (_activeModalStore === 'google' ? 512 : 1024);
      rasterizeSvgToStorePng(_activeModalAsset, targetDim, pngDataUrl => {
        _activeModalAsset = pngDataUrl;
        if (imgEl) imgEl.src = pngDataUrl;
        inspectModalAsset(pngDataUrl, null);
      });
    } else if (_activeModalType === 'feature' && typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      if (typeof rasterizeSvgToDimensions === 'function') {
        rasterizeSvgToDimensions(_activeModalAsset, 1024, 500, pngDataUrl => {
          _activeModalAsset = pngDataUrl;
          if (imgEl) imgEl.src = pngDataUrl;
          inspectModalAsset(pngDataUrl, null);
        });
      } else {
        if (imgEl && _activeModalAsset) imgEl.src = _activeModalAsset;
        inspectModalAsset(_activeModalAsset, opts.file);
      }
    } else {
      if (imgEl && _activeModalAsset) {
        imgEl.src = _activeModalAsset;
      }
      inspectModalAsset(_activeModalAsset, opts.file);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    initModalEventListeners();
  }

  function inspectModalAsset(src, file) {
    const dimEl = $('msIconModalDim') || $('imageDetailModalDim');
    const ratioEl = $('msIconModalRatio') || $('imageDetailModalRatio');
    const sizeEl = $('msIconModalSize') || $('imageDetailModalSize');
    const formatEl = $('msIconModalFormat') || $('imageDetailModalFormat');
    const badgeEl = $('msIconModalBadge') || $('imageDetailModalBadge');
    const msgEl = $('msIconModalMsg') || $('imageDetailModalMsg');

    const isPlaceholder = !src || 
                          src === (typeof PH !== 'undefined' ? PH : '') || 
                          src === (typeof PH_IPAD !== 'undefined' ? PH_IPAD : '') || 
                          src === (typeof PH_TAB !== 'undefined' ? PH_TAB : '') ||
                          src === (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');

    if (isPlaceholder) {
      if (dimEl) {
        if (_activeModalType === 'ipad') {
          dimEl.textContent = 'Empty (2048 × 2732 px target)';
        } else if (_activeModalType === 'tablet') {
          dimEl.textContent = 'Empty (16:10 target)';
        } else if (_activeModalType === 'feature') {
          dimEl.textContent = 'Empty (1024 × 500 px target)';
        } else if (_activeModalType === 'icon') {
          dimEl.textContent = _activeModalStore === 'apple' ? 'Empty (1024 × 1024 px target)' : 'Empty (512 × 512 px target)';
        } else if (_activeModalStore === 'google') {
          dimEl.textContent = 'Empty (1080 × 1920 px target)';
        } else {
          dimEl.textContent = 'Empty (1290 × 2796 px target)';
        }
        dimEl.className = 'icon-metric-val';
      }
      if (ratioEl) {
        if (_activeModalType === 'ipad') ratioEl.textContent = '3:4 (Target)';
        else if (_activeModalType === 'tablet') ratioEl.textContent = '16:10 (Target)';
        else if (_activeModalType === 'icon') ratioEl.textContent = '1:1 Square';
        else if (_activeModalType === 'feature') ratioEl.textContent = '2.05:1 Landscape';
        else if (_activeModalStore === 'google') ratioEl.textContent = '9:16 (Target)';
        else ratioEl.textContent = '9:19.5 (Target)';
        ratioEl.className = 'icon-metric-val';
      }
      if (sizeEl) {
        sizeEl.textContent = 'None (Max 8 MB)';
        sizeEl.className = 'icon-metric-val';
      }
      if (formatEl) {
        formatEl.textContent = 'PNG / JPEG';
        formatEl.className = 'icon-metric-val';
      }
      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge';
        badgeEl.textContent = 'Empty Slot · Ready to Upload';
      }
      if (msgEl) {
        msgEl.className = 'icon-modal-warn-msg';
        msgEl.textContent = '';
      }
      return;
    }

    const runId = ++_modalValRunId;
    const meta = getAssetMeta(src, file);
    const mimeType = (meta.type || '').toLowerCase();
    const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';
    const sizeBytes = meta.size || 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (runId !== _modalValRunId) return;

      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      const isSq = (w === h) || ((Math.abs(w - h) / Math.max(w, h)) < 0.08);
      const isLandscape = w > h * 1.15;
      const isPhonePortrait = h >= w * 1.35;
      const isIpadPortrait = (Math.abs(w / h - 0.75) < 0.08) || (w / h >= 0.65 && w / h <= 0.85);
      const isIpadLandscape = (Math.abs(w / h - 1.333) < 0.08) || (w / h >= 1.18 && w / h <= 1.54);
      const isTabletPortrait = (w / h >= 0.55 && w / h <= 0.7);
      const isTabletLandscape = (w / h >= 1.4 && w / h <= 1.8);

      // Standard Apple landscape resolutions (official App Store Connect dims)
      const isStandardAppleLandscapeModal = isLandscape && _activeModalStore === 'apple' && (
        (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
        (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
        (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
        (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
        (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
        (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
        (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
      );
      // Standard Google landscape: phone aspect ratio within range (1.5:1 to 2.2:1)
      const isStandardGoogleLandscapeModal = isLandscape && _activeModalStore === 'google' &&
        !isSq && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
      // Any standard landscape for the current store
      const isStandardLandscape = isStandardAppleLandscapeModal || isStandardGoogleLandscapeModal;
      // Extreme non-phone ratio (e.g. banner 730×172 → 4.24:1) OR below phone AR range — always err
      const isExtremeRatio = isLandscape && ((w / h > 2.5) || (w / h < 1.5 && !isStandardAppleLandscapeModal));

      // Pixel audit (alpha channel & apex corners)
      let hasAlpha = false;
      let hasPreRoundedCorners = false;
      try {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) { hasAlpha = true; break; }
        }
        const cornerIdx = [
          (0 * 64 + 0) * 4 + 3,
          (0 * 64 + 63) * 4 + 3,
          (63 * 64 + 0) * 4 + 3,
          (63 * 64 + 63) * 4 + 3
        ];
        hasPreRoundedCorners = cornerIdx.some(idx => data[idx] < 200);
      } catch (e) {}

      // Update 2x2 Metrics Grid
      if (dimEl) {
        dimEl.textContent = `${w} × ${h} px`;
        let dimOk = false;
        let dimErr = false;
        if (_activeModalType === 'icon') {
          dimOk = (_activeModalStore === 'apple' && w === 1024 && h === 1024) ||
                  (_activeModalStore === 'google' && w === 512 && h === 512);
          dimErr = !isSq;
        } else if (_activeModalType === 'feature') {
          dimOk = (w === 1024 && h === 500);
          dimErr = (w !== 1024 || h !== 500);
        } else if (_activeModalType === 'ipad') {
          dimOk = (w === 2048 && h === 2732) || (w === 2732 && h === 2048) || isIpadPortrait || isIpadLandscape;
          dimErr = isSq || (h > w * 1.5 || w > h * 1.5);
        } else if (_activeModalType === 'tablet') {
          dimOk = !isSq && (w >= 1080 && h >= 1080);
          dimErr = isSq;
        } else {
          // Phone Screenshot
          const isWrongRatio = isSq || isExtremeRatio || (!isLandscape && !isPhonePortrait);
          if (isWrongRatio) {
            dimErr = true;
            dimOk = false;
          } else if (isStandardLandscape) {
            // Official landscape dimensions → ok
            dimErr = false;
            dimOk = true;
          } else if (isLandscape) {
            // Non-standard landscape but valid ratio → warn
            dimErr = false;
            dimOk = false;
          } else {
            dimErr = false;
            const isStandardApple = _activeModalStore === 'apple' && (
              // Dynamic Island (large display)
              (w === 1320 && h === 2868) || // iPhone 6.9"
              (w === 1290 && h === 2796) || // iPhone 6.7"
              (w === 1260 && h === 2736) || // iPhone Air / 6.7"
              // Dynamic Island (medium display)
              (w === 1206 && h === 2622) || // iPhone 6.3"
              (w === 1179 && h === 2556) || // iPhone 6.1"
              // Face ID (large display)
              (w === 1284 && h === 2778) || // iPhone 6.5"
              (w === 1242 && h === 2688) || // iPhone 6.5"
              // Face ID (medium display)
              (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
              (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
              (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
              // Home Button (large display)
              (w === 1242 && h === 2208) || // iPhone 5.5"
              // Home Button (medium display)
              (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
              // iPhone Duo
              (w === 1398 && h === 2034) ||
              (w === 2007 && h === 2853) ||
              // Legacy 4" / 3.5"
              (w === 640 && h === 1136) ||
              (w === 640 && h === 1096) ||
              (w === 640 && h === 960) ||
              (w === 640 && h === 920)
            );
            const isStandardGoogle = _activeModalStore === 'google' && (
              (w === 1080 && h === 1920) ||
              (w === 1080 && h === 2340) ||
              (w === 1080 && h === 2400) ||
              (w === 1080 && h === 2160) ||
              (w === 1080 && h === 2280) ||
              (w === 1440 && h === 2560) ||
              (w === 1440 && h === 3120) ||
              (w === 1440 && h === 3200) ||
              (w === 1440 && h === 2880) ||
              (w === 1440 && h === 2960) ||
              (w === 1440 && h === 3088) ||
              (w === 720 && h === 1280) ||
              (w === 720 && h === 1560) ||
              (w === 720 && h === 1600) ||
              (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
            );
            dimOk = isStandardApple || isStandardGoogle;
          }
        }
        dimEl.className = 'icon-metric-val ' + (dimErr ? 'err' : (dimOk ? 'ok' : 'warn'));
      }

      if (ratioEl) {
        if (_activeModalType === 'icon') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-square`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else if (_activeModalType === 'feature') {
          const isFtrRatio = Math.abs(w / h - 1024 / 500) < 0.05;
          const r = (w / (h || 1)).toFixed(2);
          ratioEl.textContent = `${r}:1 Landscape`;
          ratioEl.className = 'icon-metric-val ' + (isFtrRatio ? 'ok' : 'err');
        } else if (_activeModalType === 'ipad') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isIpadPortrait) {
            ratioEl.textContent = '3:4 Portrait';
            ratioEl.className = 'icon-metric-val ok';
          } else if (isIpadLandscape) {
            ratioEl.textContent = '4:3 Landscape';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-standard`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else if (_activeModalType === 'tablet') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isTabletPortrait || isTabletLandscape) {
            ratioEl.textContent = isTabletPortrait ? '16:10 Portrait' : '16:10 Landscape';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-standard`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else {
          // Phone Screenshot - Invalid ratio is an ERROR (red)
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isExtremeRatio) {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Invalid`;
            ratioEl.className = 'icon-metric-val err';
          } else if (isPhonePortrait) {
            let rLabel = 'Portrait';
            if (Math.abs(h / w - 19.5 / 9) < 0.15) rLabel = '9:19.5 Portrait';
            else if (Math.abs(h / w - 16 / 9) < 0.15) rLabel = '9:16 Portrait';
            else rLabel = `${(h / w).toFixed(2)}:1 Portrait`;
            ratioEl.textContent = rLabel;
            ratioEl.className = 'icon-metric-val ok';
          } else if (isLandscape) {
            let rLabel = 'Landscape';
            if (Math.abs(w / h - 16 / 9) < 0.15) rLabel = '16:9 Landscape';
            else rLabel = `${(w / h).toFixed(2)}:1 Landscape`;
            ratioEl.textContent = rLabel;
            // Standard landscape dims are accepted by App Store Connect → ok; non-standard → warn
            ratioEl.className = 'icon-metric-val ' + (isStandardLandscape ? 'ok' : 'warn');
          } else {
            const r = (h / (w || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-portrait`;
            ratioEl.className = 'icon-metric-val err';
          }
        }
      }

      if (sizeEl) {
        if (sizeBytes > 0) {
          const kb = (sizeBytes / 1024).toFixed(0);
          sizeEl.textContent = `${kb} KB`;
          sizeEl.title = `${sizeBytes.toLocaleString('en-US')} bytes`;
          const isOverSize = sizeBytes > 8 * 1024 * 1024;
          // Over fileSize limit is a warning
          sizeEl.className = 'icon-metric-val ' + (isOverSize ? 'warn' : 'ok');
        } else {
          sizeEl.textContent = 'Optimized';
          sizeEl.className = 'icon-metric-val ok';
        }
      }

      if (formatEl) {
        const fmt = (mimeType || 'image/png').replace('image/', '').toUpperCase();
        if (hasAlpha) {
          const alphaErr = (_activeModalStore === 'apple') || (_activeModalType === 'feature');
          formatEl.textContent = `${fmt} · Alpha`;
          formatEl.className = 'icon-metric-val ' + (alphaErr ? 'err' : 'ok');
        } else if (isJpeg) {
          formatEl.textContent = 'JPEG';
          formatEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' ? 'warn' : 'ok');
        } else {
          formatEl.textContent = `${fmt} · Opaque`;
          formatEl.className = 'icon-metric-val ok';
        }
      }

      // Compliance Evaluator State
      let level = 'ok';
      let badgeText = '';
      let detailsHtml = '';

      if (_activeModalType === 'icon') {
        if (_activeModalStore === 'apple') {
          if (!isSq) {
            level = 'err';
            badgeText = `Non-square (${w}×${h} px) · 1:1 square required`;
            detailsHtml = '<p>Apple App Store requires a 1:1 square icon (1024×1024 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from Figma, Sketch, or Photoshop.</p>';
          } else if (hasAlpha) {
            level = 'err';
            badgeText = 'ITMS-90717: Alpha detected · 100% Opaque required';
            detailsHtml = '<p>ITMS-90717 Error: Xcode and App Store Connect reject icons with alpha channels. The icon must be 100% opaque without transparency.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG without an alpha channel.</p>';
          } else if (isJpeg) {
            level = 'warn';
            badgeText = 'Not recommended: PNG preferred per store guidelines';
            detailsHtml = '<p>JPEG format is not part of official store specifications. Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Apple documentation specifies standard PNG format with sRGB or Display P3.</p>';
          } else if (w !== 1024) {
            level = 'warn';
            badgeText = `${w}×${h} px · Apple recommends 1024×1024 px`;
            detailsHtml = '<p>Apple App Store recommends standard 1024×1024 px resolution to ensure clarity across all Retina displays.</p><p class="icon-modal-warn-hint">Re-export at 1024×1024 px from your design tool.</p>';
          } else {
            level = 'ok';
            badgeText = '1024×1024 px · App Store Standard';
            detailsHtml = '';
          }
        } else {
          // Google Store Icon
          const MAX_GOOGLE_ICON_BYTES = 1024 * 1024;
          if (!isSq) {
            level = 'err';
            badgeText = `Non-square (${w}×${h} px) · 1:1 square required`;
            detailsHtml = '<p>Google Play requires a 1:1 square icon (512×512 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from your design tool.</p>';
          } else if (sizeBytes > MAX_GOOGLE_ICON_BYTES) {
            const kb = (sizeBytes / 1024).toFixed(0);
            level = 'err';
            badgeText = `File size error: ${kb} KB · Exceeds maximum 1024 KB`;
            detailsHtml = `<p>Google Play Console strictly enforces a maximum file size of 1024 KB (1,048,576 bytes). Your file is currently ${kb} KB and will be rejected upon upload.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
          } else if (isJpeg) {
            level = 'warn';
            badgeText = 'Not recommended: PNG preferred per store guidelines';
            detailsHtml = '<p>JPEG format is not part of official Google Play specifications (requires 32-bit PNG). Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Export standard 32-bit PNG (sRGB).</p>';
          } else if (hasPreRoundedCorners) {
            level = 'warn';
            badgeText = 'Not recommended: Pre-rounded corners or shadow';
            detailsHtml = '<p>Pre-rounded corners or drop shadows are not recommended: Google Play dynamically applies a 20% corner radius mask and drop shadow on store listings.</p><p class="icon-modal-warn-hint">Export a full-bleed square image without rounded corners.</p>';
          } else if (w !== 512) {
            level = 'warn';
            badgeText = `${w}×${h} px · Google Play recommends 512×512 px`;
            detailsHtml = '<p>Google Play Console requires standard 512×512 px dimensions.</p><p class="icon-modal-warn-hint">Export standard 512×512 px from Figma or Photoshop.</p>';
          } else {
            const sizeNote = sizeBytes ? ` (${(sizeBytes / 1024).toFixed(0)} KB)` : '';
            level = 'ok';
            badgeText = `512×512 px · Google Play Standard${sizeNote}`;
            detailsHtml = '';
          }
        }
      } else if (_activeModalType === 'feature') {
        const MAX_FEATURE_BYTES = 15 * 1024 * 1024;
        if (w !== 1024 || h !== 500) {
          level = 'err';
          badgeText = `Invalid Dimensions (${w}×${h} px) · Google Play requires 1024×500 px`;
          detailsHtml = '<p>Google Play Console requires a landscape Feature Graphic of <strong>exactly 1024×500 px</strong> (2.05:1 ratio).</p><p class="icon-modal-warn-hint">Uploading non-standard dimensions will be rejected by Play Console.</p>';
        } else if (hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required (no alpha)';
          detailsHtml = '<p>Google Play Console strictly prohibits alpha transparency in Feature Graphics. The image must be 100% opaque without an alpha channel.</p><p class="icon-modal-warn-hint">Flatten background layers and export as 24-bit PNG or JPEG without transparency.</p>';
        } else if (sizeBytes > MAX_FEATURE_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 15 MB`;
          detailsHtml = `<p>Google Play Console strictly enforces a maximum file size of 15 MB. Your file is currently ${mb} MB and will be rejected upon upload.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else {
          const sizeNote = sizeBytes ? ` (${(sizeBytes / 1024).toFixed(0)} KB)` : '';
          level = 'ok';
          badgeText = `1024×500 px · Google Play Compliant${sizeNote}`;
          detailsHtml = '';
        }
      } else if (_activeModalType === 'ipad') {
        const MAX_IPAD_SHOT_BYTES = 8 * 1024 * 1024;
        if (sizeBytes > MAX_IPAD_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 8 MB`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB safety limit. Large files slow down IndexedDB and will increase rejection risks.</p><p class="icon-modal-warn-hint">Please optimize or compress the PNG/JPEG image.</p>`;
        } else if (hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required';
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store Connect rejects screenshots with transparent alpha channels. The image must be 100% opaque.</p><p class="icon-modal-warn-hint">Flatten layers and export without transparency.</p>';
        } else if (isSq) {
          level = 'err';
          badgeText = `App Store Rejection Risk: 1:1 Square (${w}×${h} px)`;
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store requires 3:4 portrait (2048×2732 px) or 4:3 landscape (2732×2048 px) for iPad screenshots. Square (1:1) screenshots will be rejected by App Store Connect.</p><p class="icon-modal-warn-hint">Export a standard iPad screenshot (2048×2732 px) from Figma or Sketch.</p>';
        } else if (w === 2048 && h === 2732) {
          level = 'ok';
          badgeText = '2048×2732 px · iPad Compliant';
        } else if (w === 2732 && h === 2048) {
          level = 'ok';
          badgeText = '2732×2048 px · iPad Landscape Compliant';
        } else if (isIpadPortrait || isIpadLandscape) {
          level = 'ok';
          badgeText = `${w}×${h} px · Standard iPad Compliant`;
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Target: 2048×2732 px`;
          detailsHtml = '<p>Apple recommends 2048×2732 px for iPad screenshots (Portrait) or 2732×2048 px (Landscape).</p><p class="icon-modal-warn-hint">Store Preview Studio automatically scales screenshots to standard canvas proportions.</p>';
        }
      } else if (_activeModalType === 'tablet') {
        const MAX_TAB_SHOT_BYTES = 8 * 1024 * 1024;
        if (sizeBytes > MAX_TAB_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 8 MB`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB safety limit.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else if (isSq) {
          level = 'warn';
          badgeText = `Dimension Notice: 1:1 Square (${w}×${h} px)`;
          detailsHtml = '<p><strong>Dimension Notice:</strong> Google Play tablet screenshots should be 16:10 or 4:3 (portrait or landscape). Square screenshots will be letterboxed in tablet mockups.</p><p class="icon-modal-warn-hint">Upload a 16:10 tablet screenshot (e.g. 1600×2560 px or 2560×1600 px).</p>';
        } else {
          level = 'ok';
          badgeText = `${w}×${h} px · Active Screenshot`;
          detailsHtml = '';
        }
      } else {
        // Phone Screenshot (Apple iPhone or Google Play Phone)
        const MAX_PHONE_SHOT_BYTES = 8 * 1024 * 1024;
        const isGoogleSizeIssue = _activeModalStore === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

        // 1. Invalid ratio is an ERROR (red)
        if (_activeModalStore === 'apple' && hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required';
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store Connect rejects screenshots with transparent alpha channels. The image must be 100% opaque.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG or JPEG without transparency.</p>';
        } else if (isSq) {
          level = 'err';
          badgeText = _activeModalStore === 'apple' ? `App Store Rejection Risk: 1:1 Square (${w}×${h} px)` : `Aspect Ratio Error: 1:1 Square (${w}×${h} px)`;
          detailsHtml = `<p><strong>${_activeModalStore === 'apple' ? 'App Store Rejection Risk' : 'Aspect Ratio Error'}:</strong> Screenshot is square (1:1). ${_activeModalStore === 'apple' ? 'Apple requires standard supported dimensions (such as 1179×2556 px or 1206×2622 px, portrait or landscape)' : 'Google Play requires standard phone dimensions (such as 1080×1920 px)'}. Square screenshots are not supported by the store.</p><p class="icon-modal-warn-hint">Please re-export standard supported dimensions from your design tool.</p>`;
        } else if (isExtremeRatio) {
          // e.g. 730×172 banner — aspect ratio is not a phone screen at all
          const ratio = (w / h).toFixed(2);
          level = 'err';
          badgeText = `Invalid Aspect Ratio: Banner ${w}×${h} px (${ratio}:1)`;
          detailsHtml = `<p><strong>Invalid Aspect Ratio:</strong> This image (${w}×${h} px, ${ratio}:1) has a banner-like ratio, not a phone screen aspect ratio. Phone screenshots must have a portrait or landscape phone ratio (e.g. 9:16 or 9:19.5).</p><p class="icon-modal-warn-hint">Re-export at a supported dimension such as ${_activeModalStore === 'apple' ? '1179×2556 px or 2556×1179 px' : '1080×1920 px or 1920×1080 px'}.</p>`;
        } else if (isLandscape && isStandardLandscape) {
          // Official landscape dimensions — accepted by App Store Connect
          level = 'ok';
          badgeText = `${w}×${h} px · Landscape · Store Compliant`;
          detailsHtml = '';
        } else if (isLandscape) {
          // Landscape but non-standard ratio — warn, not err
          level = 'warn';
          badgeText = `Non-standard Landscape (${w}×${h} px)`;
          detailsHtml = `<p><strong>Non-standard Landscape:</strong> This screenshot is landscape orientation but does not match a known ${_activeModalStore === 'apple' ? 'App Store Connect' : 'Google Play'} dimension. It may display letterboxed in the store.</p><p class="icon-modal-warn-hint">Verify this dimension is accepted before submission. Standard landscape: ${_activeModalStore === 'apple' ? '2556×1179 px or 2622×1206 px' : '1920×1080 px'}.</p>`;
        } else if (!isPhonePortrait) {
          level = 'err';
          badgeText = `Aspect Ratio Error: Non-portrait (${w}×${h} px)`;
          detailsHtml = '<p><strong>Aspect Ratio Error:</strong> This screenshot has a non-portrait aspect ratio. Phone screenshots must be portrait (9:16 or 9:19.5).</p><p class="icon-modal-warn-hint">Recommended resolution: ' + (_activeModalStore === 'apple' ? '1290×2796 px' : '1080×1920 px') + '.</p>';
        }
        // 2. Valid ratio with invalid filesize/dimensions is a WARNING (amber)
        else if (sizeBytes > MAX_PHONE_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'warn';
          badgeText = `File Size Warning: ${mb} MB · Exceeds 8 MB limit`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB recommended limit. While Preview Studio displays it, compressing is recommended before store submission.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else if (isGoogleSizeIssue) {
          level = 'warn';
          badgeText = `Dimension Warning: Out of range (${w}×${h} px)`;
          detailsHtml = '<p><strong>Google Play Dimension Notice:</strong> Recommended dimension range is 320–3,840 px. Please check Play Console requirements.</p><p class="icon-modal-warn-hint">Recommended standard: 1080×1920 px.</p>';
        } else {
          // Check standard dimensions
          const isStandardApple = _activeModalStore === 'apple' && (
            // Dynamic Island (large display)
            (w === 1320 && h === 2868) || // iPhone 6.9"
            (w === 1290 && h === 2796) || // iPhone 6.7"
            (w === 1260 && h === 2736) || // iPhone Air / 6.7"
            // Dynamic Island (medium display)
            (w === 1206 && h === 2622) || // iPhone 6.3"
            (w === 1179 && h === 2556) || // iPhone 6.1"
            // Face ID (large display)
            (w === 1284 && h === 2778) || // iPhone 6.5"
            (w === 1242 && h === 2688) || // iPhone 6.5"
            // Face ID (medium display)
            (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
            (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
            (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
            // Home Button (large display)
            (w === 1242 && h === 2208) || // iPhone 5.5"
            // Home Button (medium display)
            (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
            // iPhone Duo
            (w === 1398 && h === 2034) ||
            (w === 2007 && h === 2853) ||
            // Legacy 4" / 3.5"
            (w === 640 && h === 1136) ||
            (w === 640 && h === 1096) ||
            (w === 640 && h === 960) ||
            (w === 640 && h === 920)
          );
          const isStandardGoogle = _activeModalStore === 'google' && (
            (w === 1080 && h === 1920) ||
            (w === 1080 && h === 2340) ||
            (w === 1080 && h === 2400) ||
            (w === 1080 && h === 2160) ||
            (w === 1080 && h === 2280) ||
            (w === 1440 && h === 2560) ||
            (w === 1440 && h === 3120) ||
            (w === 1440 && h === 3200) ||
            (w === 1440 && h === 2880) ||
            (w === 1440 && h === 2960) ||
            (w === 1440 && h === 3088) ||
            (w === 720 && h === 1280) ||
            (w === 720 && h === 1560) ||
            (w === 720 && h === 1600) ||
            (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
          );
          if ((_activeModalStore === 'apple' && !isStandardApple) || (_activeModalStore === 'google' && !isStandardGoogle)) {
            level = 'warn';
            badgeText = `Dimension Notice: ${w}×${h} px · Scaled to Canvas`;
            const reqDesc = _activeModalStore === 'apple' ? 'App Store requires standard dimensions (such as 1290×2796, 1179×2556, 1206×2622, or 1320×2868 px)' : 'Recommended standard: 1080×1920 px';
            detailsHtml = `<p>Screenshot is portrait ratio but differs from target (${_activeModalStore === 'apple' ? '1290×2796 px' : '1080×1920 px'}). It will be scaled to fit device frames.</p><p class="icon-modal-warn-hint">${reqDesc}. Export at standard target resolution for optimal crispness.</p>`;
          } else {
            level = 'ok';
            badgeText = `${w}×${h} px · Active Screenshot`;
            detailsHtml = '';
          }
        }
      }

      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge ' + level;
        badgeEl.textContent = badgeText;
      }

      if (msgEl) {
        if (detailsHtml) {
          msgEl.className = 'icon-modal-warn-msg visible' + (level === 'warn' ? ' warn-mode' : '');
          msgEl.innerHTML = detailsHtml;
        } else {
          msgEl.className = 'icon-modal-warn-msg';
          msgEl.textContent = '';
        }
      }

      // Synchronize with Marketing Showcase state if present
      if (typeof iconValidationState !== 'undefined' && _activeModalType === 'icon') {
        iconValidationState[_activeModalStore] = {
          src, width: w, height: h, isSquare: isSq, sizeBytes,
          mimeType, isJpeg, hasAlpha, hasPreRoundedCorners,
          level, badgeText, modalBadgeText: badgeText, detailsHtml, isCustom: true
        };
        if (typeof applyIconCardBadge === 'function') {
          applyIconCardBadge(_activeModalStore === 'apple' ? 'msIconBadgeApple' : 'msIconBadgeGoogle', iconValidationState[_activeModalStore]);
        }
      }
    };
    img.src = src;
  }

  function handleFileReplacement(file) {
    if (!file) return;
    if (typeof validateUploadFile === 'function' && !validateUploadFile(file, typeof MAX_UPLOAD_BYTES !== 'undefined' ? MAX_UPLOAD_BYTES : 8 * 1024 * 1024, 'Asset')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      _activeModalAsset = dataUrl;

      const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
      if (imgEl) imgEl.src = dataUrl;

      // Notify callback or host module
      if (typeof _activeModalOnReplace === 'function') {
        _activeModalOnReplace(file, dataUrl);
      } else if (typeof handleIconUpload === 'function') {
        // Marketing showcase integration
        const storeKey = _activeModalStore === 'apple' ? 'iconApple' : 'iconGoogle';
        if (typeof customUploadedMeta !== 'undefined') {
          customUploadedMeta[_activeModalStore] = { size: file.size, type: file.type, name: file.name };
        }
        handleIconUpload(storeKey, _activeModalStore, dataUrl);
      } else if (_activeModalType === 'icon') {
        // Core studio fallback
        if (typeof ICON !== 'undefined') {
          ICON = dataUrl;
          if (_activeModalStore === 'google') {
            if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = dataUrl;
          } else {
            if (typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = dataUrl;
            if (typeof downscaleIconTo512 === 'function') {
              downscaleIconTo512(dataUrl, d512 => {
                if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
              });
            }
          }
          if (typeof renderIcons === 'function') renderIcons();
          if (typeof saveState === 'function') saveState();
        }
      } else if (_activeModalType === 'feature') {
        if (typeof FEATURE_GRAPHIC !== 'undefined') {
          FEATURE_GRAPHIC = dataUrl;
          if (typeof IS_CUSTOM_FEATURE !== 'undefined') IS_CUSTOM_FEATURE = true;
          if (typeof userDraft !== 'undefined' && userDraft) {
            userDraft.featureGraphic = dataUrl;
            userDraft.isCustomFeature = true;
          }
          if (typeof renderFeature === 'function') renderFeature();
          if (typeof saveState === 'function') saveState();
        }
      }

      inspectModalAsset(dataUrl, file);
      if (typeof showToast === 'function') {
        showToast('Asset updated & verified successfully!', 'ok');
      }
    };
    reader.readAsDataURL(file);
  }

  function initModalEventListeners() {
    if (_isInitialized) return;
    _isInitialized = true;

    const modal = $('msIconModal') || $('imageDetailModal');
    if (!modal) return;

    // Dismiss on backdrop click
    modal.addEventListener('click', e => {
      if (!e.target.closest('#msIconModalCanvas') && !e.target.closest('#imageDetailModalCanvas')) {
        closeIconModal();
      }
    });

    // Close button
    const closeBtn = $('msIconModalClose') || $('imageDetailModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        closeIconModal();
      });
    }

    // Escape key
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeIconModal();
      }
    });

    // Upload button & hidden input
    const uploadBtn = $('msIconModalUploadBtn') || $('imageDetailModalUploadBtn');
    const fileInput = $('msIconModalInput') || $('imageDetailModalInput');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', e => {
        e.stopPropagation();
        fileInput.click();
      });
      fileInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleFileReplacement(e.target.files[0]);
        }
        e.target.value = '';
      });
    }

    // Drag and Drop on Modal and Art Container
    const artContainer = $('msIconModalArt') || $('imageDetailModalArt');
    const modalCanvas = $('msIconModalCanvas') || $('imageDetailModalCanvas');

    const handleModalDrop = e => {
      e.preventDefault();
      e.stopPropagation();
      if (artContainer) artContainer.classList.remove('drag-over');
      if (modalCanvas) modalCanvas.classList.remove('drag-over');
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        handleFileReplacement(file);
      }
    };

    const handleModalDragOver = e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      if (artContainer) artContainer.classList.add('drag-over');
    };

    const handleModalDragLeave = e => {
      if (e.target === modal || !modal.contains(e.relatedTarget)) {
        if (artContainer) artContainer.classList.remove('drag-over');
        if (modalCanvas) modalCanvas.classList.remove('drag-over');
      }
    };

    modal.addEventListener('dragover', handleModalDragOver);
    modal.addEventListener('dragleave', handleModalDragLeave);
    modal.addEventListener('drop', handleModalDrop);

    if (artContainer) {
      artContainer.addEventListener('dragover', handleModalDragOver);
      artContainer.addEventListener('dragleave', () => {
        artContainer.classList.remove('drag-over');
      });
      artContainer.addEventListener('drop', handleModalDrop);
    }
  }

  // Export to global scope
  global.openIconModal = openIconModal;
  global.openImageDetailModal = openIconModal;
  global.closeIconModal = closeIconModal;
  global.closeImageDetailModal = closeIconModal;

})(typeof window !== 'undefined' ? window : this);


/* =========================================================================
   Module: src/js/google/feature-graphic.js
   ========================================================================= */
// Store Preview Studio · Google Play Feature Graphic
// Feature Graphic File Upload & Drag-and-Drop
$('featureUp').onclick=()=>{if(typeof canUpload === 'function' && !canUpload(1000)) return; $('featureFile').click();};
$('featureFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  readFile(f,d=>{
    FEATURE_GRAPHIC=d;
    if(typeof IS_CUSTOM_FEATURE !== 'undefined') IS_CUSTOM_FEATURE = true;
    if(typeof userDraft !== 'undefined' && userDraft){
      userDraft.featureGraphic = d;
      userDraft.isCustomFeature = true;
    }
    renderFeature();
    saveState();
    showToast('Feature graphic updated! (1,024 × 500 px)', 'ok');
  });
  e.target.value='';
};
// Helper to check if current feature graphic is a placeholder / empty
function isPlaceholderFeature(){
  const currentAsset = (typeof FEATURE_GRAPHIC !== 'undefined' ? FEATURE_GRAPHIC : '');
  if(!currentAsset) return true;
  if(typeof BLANK_FEATURE !== 'undefined' && currentAsset === BLANK_FEATURE) return true;
  if(typeof BLANK_FEATURE_LIGHT !== 'undefined' && currentAsset === BLANK_FEATURE_LIGHT) return true;
  return false;
}

function handleFeatureSlotClick(e){
  if(e) e.stopPropagation();
  if(isPlaceholderFeature()){
    if(typeof canUpload === 'function' && !canUpload(1000)) return;
    if($('featureFile')) $('featureFile').click();
  } else {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: FEATURE_GRAPHIC, type: 'feature', store: 'google' });
    }
  }
}

if($('featureInspect')){
  $('featureInspect').onclick = (e) => {
    if(e) e.stopPropagation();
    if(isPlaceholderFeature()){
      return;
    }
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: FEATURE_GRAPHIC, type: 'feature', store: 'google' });
    }
  };
}
const featurePrevImg = $('featurePrev');
if(featurePrevImg){
  featurePrevImg.onclick = handleFeatureSlotClick;
}
const featureDropZone = $('featureDropZone');
if(featureDropZone){
  featureDropZone.onclick = handleFeatureSlotClick;
  let featureDragCounter = 0;
  featureDropZone.addEventListener('dragenter', e => {
    e.preventDefault();
    featureDragCounter++;
    featureDropZone.classList.add('drag-over');
  });
  featureDropZone.addEventListener('dragover', e => {
    e.preventDefault();
  });
  featureDropZone.addEventListener('dragleave', () => {
    featureDragCounter--;
    if(featureDragCounter <= 0){
      featureDragCounter = 0;
      featureDropZone.classList.remove('drag-over');
    }
  });
  featureDropZone.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    featureDragCounter = 0;
    featureDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      readFile(file,d=>{
        FEATURE_GRAPHIC=d;
        if(typeof IS_CUSTOM_FEATURE !== 'undefined') IS_CUSTOM_FEATURE = true;
        if(typeof userDraft !== 'undefined' && userDraft){
          userDraft.featureGraphic = d;
          userDraft.isCustomFeature = true;
        }
        renderFeature();
        saveState();
        showToast('Feature graphic dropped & applied! (1,024 × 500 px)', 'ok');
      });
    }
  });
}


// Feature Graphic Info Popover Controller
initInfoPopover("featureInfoBtn", "featureInfoPop", "featureInfoClose", "google");

// Feature Graphic Validation Controller
let _featureValRunId = 0;

function validateFeatureGraphic(){
  const badge = $('featureStatusBadge');
  const dimTag = $('featureDimTag');
  const removeBtn = $('featureRemove');
  const inspectBtn = $('featureInspect');
  const dropZone = $('featureDropZone');
  if(!badge) return;

  const runId = ++_featureValRunId;

  const placeholder = isPlaceholderFeature();
  if(dropZone){
    if(placeholder){
      dropZone.setAttribute('title', 'Click to upload Feature Graphic (1024×500 px)');
    } else {
      dropZone.setAttribute('title', 'Click to inspect Feature Graphic in high resolution');
    }
  }
  if(inspectBtn){
    inspectBtn.disabled = placeholder;
    inspectBtn.classList.toggle('disabled', placeholder);
    inspectBtn.setAttribute('title', placeholder ? 'Upload a feature graphic to inspect' : 'Inspect Feature Graphic Details & Compliance');
  }

  const currentAsset = (typeof FEATURE_GRAPHIC !== 'undefined' ? FEATURE_GRAPHIC : '');
  if(placeholder || !currentAsset || currentAsset === (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') || currentAsset === (typeof BLANK_FEATURE_LIGHT !== 'undefined' ? BLANK_FEATURE_LIGHT : '')){
    badge.style.display = 'none';
    badge.innerHTML = '';
    if(dimTag) {
      dimTag.style.display = 'none';
      dimTag.textContent = '';
    }
    if(removeBtn) removeBtn.style.display = 'none';
    return;
  }

  // If current asset is an SVG (e.g. from preset or SVG upload), rasterize to 1024x500 PNG
  if(typeof rasterizeSvgToDimensions === 'function' && typeof currentAsset === 'string' && (currentAsset.startsWith('data:image/svg+xml') || currentAsset.includes('<svg'))){
    rasterizeSvgToDimensions(currentAsset, 1024, 500, pngData => {
      if(runId !== _featureValRunId) return;
      FEATURE_GRAPHIC = pngData;
      // Also update any preset cache if active
      if(typeof CURRENT_PRESET_KEY !== 'undefined' && typeof PRESETS === 'object' && PRESETS[CURRENT_PRESET_KEY]){
        PRESETS[CURRENT_PRESET_KEY].featurePng = pngData;
      }
      renderFeature();
    });
    return;
  }

  if(removeBtn) removeBtn.style.display = 'inline-flex';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if(runId !== _featureValRunId) return;
    const w = img.naturalWidth || 0;
    const h = img.naturalHeight || 0;

    let sizeBytes = 0;
    let mimeType = '';
    if(typeof currentAsset === 'string' && currentAsset.startsWith('data:')){
      const head = currentAsset.indexOf(',');
      const m = /^data:([^;,]+)/.exec(currentAsset);
      if(m) mimeType = m[1].toLowerCase();
      const b64 = /;base64/.test(currentAsset.slice(0, head));
      const body = currentAsset.length - head - 1;
      sizeBytes = b64 ? Math.round(body * 3 / 4) : body;
    }

    const isPng = !mimeType || mimeType === 'image/png';
    const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';

    let hasAlpha = false;
    if(mimeType !== 'image/jpeg'){
      try {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        for(let i = 3; i < data.length; i += 4){
          if(data[i] < 250){ hasAlpha = true; break; }
        }
      } catch(e){}
    }

    const issues = [];
    if(w !== 1024 || h !== 500){
      const r = (w / (h || 1)).toFixed(2);
      issues.push(`Invalid dimensions (${w}×${h} px, ${r}:1 ratio) — Must be exactly 1024×500 px`);
    }
    if(mimeType && !isPng && !isJpeg){
      issues.push('Must be PNG or JPEG format');
    }
    if(hasAlpha){
      issues.push('Contains transparency (alpha channel not allowed by Play Console)');
    }
    if(sizeBytes > 15 * 1024 * 1024){
      const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
      issues.push(`Exceeds 15 MB limit (${mb} MB)`);
    }

    const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
    const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

    if(issues.length){
      badge.className = 'shot-status-badge err';
      const issuesContent = issues.length === 1
        ? ` ${issues[0]}.`
        : `<div class="sb-issues-list">${issues.map(iss => `<span class="sb-issue-item">• ${iss}</span>`).join('')}</div>`;
      badge.innerHTML = `${SB_ERR}<span><strong>${issues.length} issue${issues.length === 1 ? '' : 's'} would cause rejection by Google Play:</strong>${issuesContent}</span>`;
      badge.style.display = 'flex';
      if(dimTag){
        dimTag.className = 'shot-dim-tag err';
        dimTag.textContent = `${(w / (h || 1)).toFixed(2)}:1 (${w}×${h})`;
        dimTag.title = issues.join('; ');
        dimTag.style.display = 'inline-flex';
      }
    } else {
      // Compliant: All criteria met -> hide badge, do not show green message box
      badge.className = 'shot-status-badge ok';
      badge.innerHTML = '';
      badge.style.display = 'none';
      if(dimTag){
        dimTag.className = 'shot-dim-tag ok';
        dimTag.textContent = '2.05:1 (1024×500)';
        dimTag.title = 'Google Play compliant';
        dimTag.style.display = 'inline-flex';
      }
    }
  };
  img.onerror = () => {
    badge.className = 'shot-status-badge err';
    badge.innerHTML = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span><span>Image could not be loaded. Please re-upload.</span>`;
    badge.style.display = 'flex';
    if(dimTag) dimTag.style.display = 'none';
  };
  img.src = currentAsset;
}

// Remove / Reset Feature Graphic
const featureRemoveBtn = $('featureRemove');
if(featureRemoveBtn){
  featureRemoveBtn.onclick = (e) => {
    if(e) e.stopPropagation();
    FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    if(typeof IS_CUSTOM_FEATURE !== 'undefined') IS_CUSTOM_FEATURE = false;
    if(typeof userDraft !== 'undefined' && userDraft){
      userDraft.featureGraphic = FEATURE_GRAPHIC;
      userDraft.isCustomFeature = false;
    }
    const fileInput = $('featureFile');
    if(fileInput) fileInput.value = '';
    renderFeature();
    saveState();
    if(typeof showToast === 'function'){
      showToast('Feature graphic removed', 'ok');
    }
  };
}

// Initial audit on script load
validateFeatureGraphic();


/* =========================================================================
   Module: src/js/google/google.js
   ========================================================================= */
// Store Preview Studio · Google Play Devices & Tablet Orientation
// --- Google Play Tablet Screenshots (7-inch & 10-inch) ---
let googleDevice = 'dual'; // 'phone' | 'tab7' | 'tab10' | 'dual'
const tabOrient = {tab7:'landscape', tab10:'landscape'};
const MAX_TAB = 8;
const TAB_CFG = {
  tab7:  {name:'7-inch',  min:320,  max:3840, list:'tab7List',  counter:'tab7Counter',  badge:'tab7Badge',  file:'tab7File',  add:'tab7Add',  gal:'galTab7',  dev:'dev-tab7'},
  tab10: {name:'10-inch', min:1080, max:7680, list:'tab10List', counter:'tab10Counter', badge:'tab10Badge', file:'tab10File', add:'tab10Add', gal:'galTab10', dev:'dev-tab10'}
};
const TABS = {tab7:[], tab10:[]};  // items: {src, meta:{type,bytes,w,h}}
let tabPick = {key:null, idx:-1};

function srcInfo(s){
  const head = (s||'').indexOf(',');
  const m = /^data:([^;,]+)/.exec(s||'');
  if(!m || head < 0) return {};
  const b64 = /;base64/.test(s.slice(0, head));
  const body = s.length - head - 1;
  return {type:m[1], bytes: b64 ? Math.round(body*3/4) : body};
}
function probeTab(it){
  it.meta = null;
  if(!it.src) return;
  const meta = it.meta = srcInfo(it.src);
  const im = new Image();
  im.referrerPolicy = 'no-referrer';
  im.onload = () => {
    if(it.meta === meta){
      meta.w = im.naturalWidth;
      meta.h = im.naturalHeight;
      // Alpha channel audit (Google Play Console requires 24-bit PNG or JPEG without alpha)
      if(meta.type !== 'image/jpeg'){
        try {
          const c = document.createElement('canvas');
          c.width = 64; c.height = 64;
          const ctx = c.getContext('2d');
          ctx.drawImage(im, 0, 0, 64, 64);
          const data = ctx.getImageData(0, 0, 64, 64).data;
          for(let i = 3; i < data.length; i += 4){
            if(data[i] < 250){ meta.hasAlpha = true; break; }
          }
        }catch(e){
          // Tainted canvas or environments without full 2d canvas
        }
      }
      renderTablets();
    }
  };
  im.onerror = () => { if(it.meta === meta){ meta.bad = true; renderTablets(); } };
  im.src = ensureSvgDimensions(it.src);
}
function makeTabItem(s){ const it = {src:(s||'').trim(), meta:null}; probeTab(it); return it; }

function tabIssues(key, it){
  const c = TAB_CFG[key], m = it.meta, out = [];
  if(!m) return out;
  if(m.bad) out.push('Image could not be loaded');
  if(m.type && !/^image\/(png|jpeg)$/.test(m.type)) out.push('Must be PNG or JPEG');
  if(m.hasAlpha) out.push('Contains transparency (alpha channel not allowed by Play Console)');
  if(m.bytes && m.bytes > 8*1024*1024) out.push('Over 8 MB');
  if(m.w && m.h){
    const r = m.w / m.h;
    if(Math.abs(r - 16/9) > 0.02 && Math.abs(r - 9/16) > 0.02) out.push('Aspect ratio must be 16:9 or 9:16');
    if(m.w < c.min || m.h < c.min || m.w > c.max || m.h > c.max) out.push(`Each side must be ${c.min.toLocaleString('en-US')}–${c.max.toLocaleString('en-US')} px`);
  }
  return out;
}
const fmtSize = b => b >= 1048576 ? (b/1048576).toFixed(1)+' MB' : Math.max(1, Math.round(b/1024))+' KB';
const ratioLabel = (w,h) => { const r = w/h; return Math.abs(r-16/9) <= 0.02 ? '16:9' : Math.abs(r-9/16) <= 0.02 ? '9:16' : r.toFixed(2)+':1'; };

const _tabPh = {};
function tabPlaceholder(key, orient, n){
  const id = key + orient + n;
  if(_tabPh[id]) return _tabPh[id];
  const c = TAB_CFG[key], land = orient === 'landscape', W = land ? 1280 : 720, H = land ? 720 : 1280;
  const f1 = Math.round(Math.min(W,H)*.06), f2 = Math.round(Math.min(W,H)*.032);
  return _tabPh[id] = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#p)"/>
  <rect x="${W*.08}" y="${H*.09}" width="${W*.84}" height="${H*.07}" rx="14" fill="#334155" opacity=".7"/>
  <rect x="${W*.08}" y="${H*.2}" width="${W*.5}" height="${H*.04}" rx="10" fill="#334155" opacity=".5"/>
  <text x="${W/2}" y="${H*.52}" font-family="Roboto,system-ui,sans-serif" font-size="${f1}" font-weight="700" fill="#e2e8f0" text-anchor="middle">${c.name} tablet · screenshot ${n}</text>
  <text x="${W/2}" y="${H*.52 + f1*1.4}" font-family="Roboto,system-ui,sans-serif" font-size="${f2}" fill="#94a3b8" text-anchor="middle">Upload 16:9 or 9:16 · ${c.min}–${c.max} px per side</text>
</svg>`);
}

function renderTablets(){
  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_INFO = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;
  Object.keys(TAB_CFG).forEach(key => {
    const c = TAB_CFG[key], items = TABS[key];
    const valid = items.filter(i => i.src);
    const bad = valid.filter(i => tabIssues(key, i).length).length;

    const ce = $(c.counter);
    ce.textContent = `${valid.length} / ${MAX_TAB} screenshots`;
    ce.className = 'cc' + (valid.length > MAX_TAB ? ' err' : '');

    const addBtn = $(c.add);
    if(addBtn){
      const atLimit = items.length >= MAX_TAB;
      addBtn.disabled = atLimit;
      if(atLimit) addBtn.title = `${c.name} tablets allow a maximum of ${MAX_TAB} screenshots`;
      else addBtn.removeAttribute('title');
    }

    const be = $(c.badge);
    if(!valid.length){
      be.style.display = 'none';
      be.innerHTML = '';
    }else if(bad){
      be.className = 'shot-status-badge err';
      be.innerHTML = `${SB_ERR}<span><strong>${bad} of ${valid.length} screenshot${valid.length===1?'':'s'} would be rejected</strong> by Play Console. See details below.</span>`;
      be.style.display = 'flex';
    }else{
      // Compliant: All criteria met -> hide badge, do not show green message box
      be.className = 'shot-status-badge ok';
      be.innerHTML = '';
      be.style.display = 'none';
    }

    // Editor list
    const L = $(c.list);
    L.innerHTML = '';
    items.forEach((it, i) => {
      const r = document.createElement('div');
      r.className = 'srow tab srow-tab';
      r.draggable = true;
      const handle = document.createElement('div');
      handle.className = 'drag-handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder';
      r.appendChild(handle);
      const hasImg = !!(it && it.src && typeof it.src === 'string' && it.src.trim() && (typeof PH === 'undefined' || it.src !== PH) && (typeof PH_TAB === 'undefined' || it.src !== PH_TAB) && (typeof PH_LIGHT === 'undefined' || it.src !== PH_LIGHT));

      // Thumbnail Preview with Click-to-Inspect & Floating Delete Button
      const thumbWrap = document.createElement('div');

      if (hasImg) {
        thumbWrap.className = 'shot-thumb-wrap has';
        const thumb = mk(it.src, `${c.name} Screenshot ` + (i + 1));
        thumb.style.cursor = 'pointer';
        thumb.title = 'Click to inspect & view details';
        thumb.onclick = () => {
          if(typeof openImageDetailModal === 'function'){
            openImageDetailModal({
              src: it.src,
              type: 'tablet',
              store: 'google',
              index: i,
              title: `${c.name} Screenshot #${i + 1} Inspector`,
              onReplace: (file, dataUrl) => {
                TABS[key][i] = makeTabItem(dataUrl);
                renderTablets();
                saveState();
              }
            });
          }
        };
        thumbWrap.appendChild(thumb);
      } else {
        thumbWrap.className = 'shot-thumb-wrap is-placeholder';
        thumbWrap.title = `Click to upload ${c.name} screenshot`;
        thumbWrap.setAttribute('role', 'button');
        thumbWrap.setAttribute('tabindex', '0');
        const ov = document.createElement('div');
        ov.className = 'shot-thumb-ov';
        ov.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
        thumbWrap.appendChild(ov);
        thumbWrap.onclick = () => {
          if(typeof canUpload === 'function' && !canUpload(1000)) return;
          tabPick = {key, idx:i};
          const fi = $(c.file);
          if(fi) fi.click();
        };
        thumbWrap.onkeydown = e => {
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            thumbWrap.click();
          }
        };
      }

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'shot-remove-btn';
      delBtn.title = 'Delete Screenshot';
      delBtn.setAttribute('aria-label', 'Delete Screenshot');
      delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      delBtn.onmousedown = e => e.stopPropagation();
      delBtn.onclick = e => {
        e.stopPropagation();
        TABS[key].splice(i, 1);
        renderTablets();
        saveState();
      };
      thumbWrap.appendChild(delBtn);
      r.appendChild(thumbWrap);

      const col = document.createElement('div'); col.className = 'col';
      const head = document.createElement('div'); head.className = 'shot-row-head';

      let tagHtml = '';
      if(it.meta && it.meta.w){
        const probs = tabIssues(key, it);
        const tagClass = probs.length ? 'err' : 'ok';
        const tagText = `${ratioLabel(it.meta.w, it.meta.h)} (${it.meta.w}×${it.meta.h})`;
        tagHtml = `<span class="shot-dim-tag ${tagClass}" title="${probs.join('; ')}">${tagText}</span>`;
      }else if(it.meta && it.meta.bad){
        tagHtml = `<span class="shot-dim-tag err">Failed to load</span>`;
      }

      head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>`;

      const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
      metaLine.innerHTML = tagHtml;

      col.append(head, metaLine);
      r.appendChild(col);

      const act = document.createElement('div'); act.className = 'act';
      act.innerHTML =
        '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
        '<button type="button" class="mini shot-inspect-btn' + (hasImg ? '' : ' disabled') + '" title="' + (hasImg ? 'Inspect screenshot details' : `Upload a ${c.name} screenshot to inspect details`) + '" aria-label="Inspect screenshot details"' + (hasImg ? '' : ' disabled aria-disabled="true"') + '>' + ICO_INSPECT + '</button>';
      const upBtn = act.children[0];
      const inspectBtn = act.children[1];
      if(!hasImg){
        inspectBtn.classList.add('disabled');
      }
      upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key, idx:i}; $(c.file).click(); };
      if(hasImg){
        inspectBtn.onclick = () => {
          if(typeof openImageDetailModal === 'function'){
            openImageDetailModal({
              src: it.src,
              type: 'tablet',
              store: 'google',
              index: i,
              title: `${c.name} Screenshot #${i + 1} Inspector`,
              onReplace: (file, dataUrl) => {
                TABS[key][i] = makeTabItem(dataUrl);
                renderTablets();
                saveState();
              }
            });
          }
        };
      } else {
        inspectBtn.onclick = null;
      }
      r.appendChild(act);

      r.addEventListener('dragstart', e => { r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'tabshot:' + key + ':' + i); });
      r.addEventListener('dragend', () => { r.classList.remove('dragging'); $$('.srow.tab').forEach(x => x.classList.remove('drag-over')); });
      r.addEventListener('dragover', e => { e.preventDefault(); r.classList.add('drag-over'); });
      r.addEventListener('dragleave', () => r.classList.remove('drag-over'));
      r.addEventListener('drop', e => {
        r.classList.remove('drag-over');
        const m = /^tabshot:(tab\d+):(\d+)$/.exec(e.dataTransfer.getData('text/plain') || '');
        if(!m) return; // external file drop bubbles up to the section handler
        e.preventDefault(); e.stopPropagation();
        if(m[1] !== key) return;
        const from = parseInt(m[2], 10);
        if(from !== i){ const x = TABS[key].splice(from, 1)[0]; TABS[key].splice(i, 0, x); renderTablets(); saveState(); }
      });
      L.appendChild(r);
    });

    // Live preview gallery inside the tablet mockup
    // Priority: 1) dedicated shots for this size  2) shots from the other tablet size  3) phone shots
    const phoneShots = (typeof SHOTS !== 'undefined' && Array.isArray(SHOTS) ? SHOTS : [])
      .filter(s => typeof s === 'string' && s.trim());
    const otherKey = key === 'tab7' ? 'tab10' : 'tab7';
    const otherTabShots = (TABS[otherKey] || []).filter(i => i && i.src).map(i => i.src);
    const hasDedicatedTabShots = valid.length > 0;
    const hasCrossTabShots = !hasDedicatedTabShots && otherTabShots.length > 0;
    const effectiveShots = hasDedicatedTabShots
      ? valid.map(it => it.src)
      : (otherTabShots.length > 0 ? otherTabShots : phoneShots);

    const g = $(c.gal);
    if(g){
      g.innerHTML = '';
      if(effectiveShots.length){
        effectiveShots.forEach((src, i) => {
          const label = hasDedicatedTabShots
            ? `${c.name} Screenshot ${i + 1}`
            : hasCrossTabShots
              ? `${TAB_CFG[otherKey].name} Screenshot ${i + 1}`
              : `Phone Screenshot ${i + 1}`;
          const img = mk(src, label);
          if(!hasDedicatedTabShots) img.classList.add('tab-fallback-shot');
          g.appendChild(img);
        });
      } else {
        for(let i = 1; i <= 3; i++) g.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
      }
    }
    const sg = $('srch' + key.charAt(0).toUpperCase() + key.slice(1));
    if(sg){
      sg.innerHTML = '';
      if(effectiveShots.length){
        effectiveShots.slice(0, 3).forEach((src, i) => {
          const label = hasDedicatedTabShots
            ? `${c.name} Result ${i + 1}`
            : hasCrossTabShots
              ? `${TAB_CFG[otherKey].name} Result ${i + 1}`
              : `Phone Result ${i + 1}`;
          const img = mk(src, label);
          if(!hasDedicatedTabShots) img.classList.add('tab-fallback-shot');
          sg.appendChild(img);
        });
      } else {
        for(let i = 1; i <= 3; i++) sg.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
      }
    }
  });
}

function addTabFiles(key, files){
  files = [...files].filter(f => f.type.startsWith('image/'));
  if(!files.length) return;
  const validFiles = files.filter(f => (typeof validateUploadFile !== 'function') || validateUploadFile(f, MAX_UPLOAD_BYTES, `${TAB_CFG[key].name} tablet screenshot`));
  if(!validFiles.length) return;
  const room = MAX_TAB - TABS[key].length;
  if(room <= 0){ showToast(`${TAB_CFG[key].name} tablets allow up to ${MAX_TAB} screenshots`, 'warn'); return; }
  let targetFiles = validFiles;
  if(targetFiles.length > room){ targetFiles = targetFiles.slice(0, room); showToast(`Only ${room} more fit (max ${MAX_TAB}) — extra files skipped`, 'warn'); }
  let done = 0;
  const out = new Array(targetFiles.length);
  targetFiles.forEach((f, n) => readFile(f, d => {
    out[n] = d;
    if(++done === targetFiles.length){
      out.forEach(s => TABS[key].push(makeTabItem(s)));
      renderTablets(); saveState();
      showToast(`Added ${targetFiles.length} ${TAB_CFG[key].name} tablet screenshot${targetFiles.length===1?'':'s'}`, 'ok');
    }
  }));
}

Object.keys(TAB_CFG).forEach(key => {
  const c = TAB_CFG[key];
  $(c.file).onchange = e => {
    const files = [...e.target.files];
    e.target.value = '';
    if(!files.length) return;
    if(tabPick.key === key && tabPick.idx >= 0){
      const idx = tabPick.idx; tabPick = {key:null, idx:-1};
      if(typeof validateUploadFile === 'function' && !validateUploadFile(files[0], MAX_UPLOAD_BYTES, `${TAB_CFG[key].name} tablet screenshot`)) return;
      readFile(files[0], d => { TABS[key][idx] = makeTabItem(d); renderTablets(); saveState(); showToast('Screenshot replaced', 'ok'); });
    }else{
      tabPick = {key:null, idx:-1};
      addTabFiles(key, files);
    }
  };
  $(c.add).onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key:null, idx:-1}; $(c.file).click(); };
  const sec = $(c.list).parentElement;
  sec.addEventListener('dragover', e => e.preventDefault());
  sec.addEventListener('drop', e => {
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if(files.length){ e.preventDefault(); addTabFiles(key, files); }
  });
});

function applyTabOrient(){
  Object.keys(TAB_CFG).forEach(k => { const d = $(TAB_CFG[k].dev); if(d) d.classList.toggle('portrait', tabOrient[k] === 'portrait'); });
}
function applyGoogleDevice(){
  const isDual = googleDevice === 'dual' || appleDevice === 'dual';
  document.body.dataset.googleDevice = isDual ? 'phone' : googleDevice;
  document.body.dataset.dual = isDual ? 'true' : 'false';
  const selGoogle = (isDual || googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;
  const selApple = (isDual || appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === selGoogle));
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === selApple));
  if (!isDual && typeof store !== 'undefined' && store) {
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === store));
  } else if (!isDual) {
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === 'google'));
  }
  const btn = $('btnDualPhone');
  if (btn) {
    btn.classList.toggle('on', isDual);
    btn.setAttribute('aria-checked', isDual ? 'true' : 'false');
  }
  const badge = $('stageDualBadge');
  if (badge) badge.style.display = isDual ? 'inline-flex' : 'none';
  syncAllVtPills();
}
function setGoogleDevice(d, animate = true){
  const stageMenu = $('menuGoogleDevice');
  if(stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');
  const nextDev = (d === 'tab7' || d === 'tab10' || d === 'dual') ? d : 'phone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = nextDev === 'dual';
  if(googleDevice === nextDev && document.body.dataset.googleDevice === (nextDual ? 'phone' : nextDev) && wasDual === nextDual){
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    syncAllVtPills();
    return;
  }
  const applyState = () => {
    googleDevice = nextDev;
    if(nextDual){
      appleDevice = 'dual';
      document.body.dataset.appleDevice = 'iphone';
    } else if(wasDual && appleDevice === 'dual'){
      appleDevice = 'iphone';
      document.body.dataset.appleDevice = 'iphone';
    }
    applyGoogleDevice();
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    if(typeof saveState === 'function') saveState(false);
  };
  if(nextDual || wasDual){
    clearDevTransitions();
    applyState();
    fit();
    syncAllVtPills();
    return;
  }
  transitionDevice('google', nextDev, applyState, animate);
  const selBtn = (nextDev === 'dual' || !nextDev) ? 'phone' : nextDev;
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === selBtn));
  if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
  syncAllVtPills();
}
$$('#gdt [data-gd]').forEach(b => b.onclick = () => setGoogleDevice(b.dataset.gd));
function tabStatus(key){
  const v = TABS[key].filter(i => i.src), bad = v.filter(i => tabIssues(key, i).length).length;
  if(!v.length) return 'None uploaded (optional)';
  if(v.length > MAX_TAB) return `${v.length} screenshots (exceeds max ${MAX_TAB})`;
  return bad ? `${bad} of ${v.length} with format issues` : `Uploaded (${v.length} screenshot${v.length===1?'':'s'})`;
}




/* =========================================================================
   Module: src/js/modules/form/categories.js
   ========================================================================= */
// Store Preview Studio · Category Dropdowns & Normalization (App Store vs Google Play)
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
  if (!a || !g) return;
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
  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  const displayVal = (CAT[activeSt] || '').replace(/^Games · /, '');
  if($('f-cat')) $('f-cat').value = displayVal;
  const valEl = $('customCatVal');
  if(valEl) valEl.textContent = displayVal || 'Select category…';
  const wrap = $('customCatWrap');
  if(wrap && wrap.classList.contains('open')) {
    renderCustomCatOptions($('customCatSearch') ? $('customCatSearch').value : '');
  }
}

function isCustomCatOpen() {
  const wrap = $('customCatWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomCat() {
  const wrap = $('customCatWrap');
  const trigger = $('customCatTrigger');
  const searchInput = $('customCatSearch');
  if (!wrap) return;

  // Close age and monetization dropdowns if open
  if (typeof closeCustomAge === 'function') closeCustomAge();
  if (typeof closeCustomIap === 'function') closeCustomIap();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderCustomCatOptions('');
  const activeOpt = wrap.querySelector('.custom-cat-option.active');
  if (activeOpt) {
    activeOpt.scrollIntoView({ block: 'nearest' });
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('cat', true);
  }
}

function closeCustomCat() {
  const wrap = $('customCatWrap');
  const trigger = $('customCatTrigger');
  if (!wrap) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectCategoryFromUI(catVal) {
  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  setCategory(catVal, activeSt);
  closeCustomCat();
  const trigger = $('customCatTrigger');
  if (trigger) trigger.focus();
  if (typeof update === 'function') update();
  if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('cat');
  if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
}

function renderCustomCatOptions(query = '') {
  const listContainer = $('customCatOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  const currentVal = CAT[activeSt] || '';
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-cat-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (val, label = val) => {
    const item = document.createElement('div');
    item.className = 'custom-cat-option' + (val === currentVal ? ' active' : '');
    item.dataset.val = val;
    item.role = 'option';
    item.setAttribute('aria-selected', val === currentVal ? 'true' : 'false');
    item.innerHTML = `<span>${label}</span>${checkSvg}`;
    item.onclick = (e) => {
      e.stopPropagation();
      selectCategoryFromUI(val);
    };
    return item;
  };

  let renderedCount = 0;

  if (activeSt === 'apple') {
    const filtered = APPLE_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q));
    filtered.forEach(c => {
      listContainer.appendChild(createOptionEl(c));
      renderedCount++;
    });
  } else {
    const filteredApps = GOOGLE_APP_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q));
    const filteredGames = GOOGLE_GAME_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q) || ('games · ' + c.toLowerCase()).includes(q));

    if (filteredApps.length > 0) {
      const gLabel = document.createElement('div');
      gLabel.className = 'custom-cat-group-label';
      gLabel.textContent = 'Apps';
      listContainer.appendChild(gLabel);
      filteredApps.forEach(c => {
        listContainer.appendChild(createOptionEl(c));
        renderedCount++;
      });
    }

    if (filteredGames.length > 0) {
      const gLabel = document.createElement('div');
      gLabel.className = 'custom-cat-group-label';
      gLabel.textContent = 'Games';
      listContainer.appendChild(gLabel);
      filteredGames.forEach(c => {
        listContainer.appendChild(createOptionEl('Games · ' + c, c));
        renderedCount++;
      });
    }
  }

  // Handle custom value if present and not in list
  if (currentVal && !matchCat(activeSt, currentVal)) {
    const customOption = createOptionEl(currentVal, currentVal + ' (custom)');
    listContainer.insertBefore(customOption, listContainer.firstChild);
    renderedCount++;
  }

  // If no results match query, allow creating/using custom category
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-cat-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `<span>Use "<strong>${rawVal}</strong>"</span><span class="custom-cat-create-tag">Custom</span>`;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectCategoryFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-cat-empty';
    emptyEl.textContent = 'No categories found';
    listContainer.appendChild(emptyEl);
  }
}

function setCategory(val, only){
  val = (val || '').trim();
  ['apple','google'].forEach(st => {
    if(only && only !== st) return;
    const sel = CAT_SEL[st];
    let m = val ? matchCat(st, val) : '';
    if(sel){
      sel.querySelectorAll('option[data-custom]').forEach(o => o.remove());
      if(val && !m){
        m = val;
        const o = document.createElement('option'); o.value = val; o.textContent = val + ' (custom)'; o.dataset.custom = '1';
        sel.appendChild(o);
      }
      sel.value = m;
    } else if(val && !m) {
      m = val;
    }
    CAT[st] = m;
  });
  syncCategoryUI();
}

['apple','google'].forEach(st => {
  if (CAT_SEL[st]) {
    CAT_SEL[st].onchange = () => {
      CAT[st] = CAT_SEL[st].value;
      syncCategoryUI();
      if (typeof update === 'function') update();
      if (typeof saveState === 'function') saveState();
      if (typeof flashField === 'function') flashField('cat');
      if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
    };
  }
});

(function initCustomCatEvents() {
  const trigger = $('customCatTrigger');
  const wrap = $('customCatWrap');
  const searchInput = $('customCatSearch');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (isCustomCatOpen()) {
        closeCustomCat();
      } else {
        openCustomCat();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });

      trigger.addEventListener('click', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          setFieldFocus('cat', true);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });
    }
    searchInput.oninput = () => {
      renderCustomCatOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomCat();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-cat-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectCategoryFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-cat-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomCat();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomCatOpen()) {
      closeCustomCat();
      if (trigger) trigger.focus();
    }
  });
})();

setCategory('Productivity');


/* =========================================================================
   Module: src/js/modules/form/privacy.js
   ========================================================================= */
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
  if(/share|third part/.test(t)) return GOOGLE_SAFETY_ICONS.share;
  if(/collect/.test(t)) return GOOGLE_SAFETY_ICONS.collect;
  if(/encrypt|transit|security|ssl/.test(t)) return GOOGLE_SAFETY_ICONS.encrypt;
  if(/delet|remove/.test(t)) return GOOGLE_SAFETY_ICONS.delete;
  if(/famil|child|kid/.test(t)) return GOOGLE_SAFETY_ICONS.family;
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
  const rawGoogleItems = parsePrivItems(googleStr);
  const googleItems = rawGoogleItems.length > 0
    ? rawGoogleItems
    : (linkedItems.length === 0 && notLinkedItems.length === 0
        ? ['No data shared with third parties', 'No data collected', 'Data is encrypted in transit']
        : ['No data shared with third parties', 'Data is encrypted in transit', 'You can request data deletion']);

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

  if (typeof updatePrivacyModeUI === 'function') {
    updatePrivacyModeUI();
  }
}

function updatePrivacyModeUI() {
  const linked = ($('f-priv-linked') && $('f-priv-linked').value !== undefined) ? $('f-priv-linked').value.trim() : '';
  const notLinked = ($('f-priv-notlinked') && $('f-priv-notlinked').value !== undefined) ? $('f-priv-notlinked').value.trim() : '';
  const isNone = (linked === '' && notLinked === '');

  const seg = $('privacyModeSeg');
  if (seg) {
    seg.dataset.active = isNone ? 'none' : 'collected';
  }

  const btnNone = $('privBtnNone');
  const btnCol = $('privBtnCollected');
  const bannerTitle = $('privacyStatusLabel');
  const banner = $('privacyMockBanner');
  const bannerSub = banner ? banner.querySelector('.pcb-sub') : null;

  if (btnNone) {
    btnNone.classList.toggle('active', isNone);
    btnNone.setAttribute('aria-selected', isNone ? 'true' : 'false');
  }
  if (btnCol) {
    btnCol.classList.toggle('active', !isNone);
    btnCol.setAttribute('aria-selected', !isNone ? 'true' : 'false');
  }
  if (bannerTitle) {
    bannerTitle.textContent = isNone ? 'Profile: Data Not Collected' : 'Profile: Data Collected';
  }
  if (bannerSub) {
    bannerSub.textContent = isNone
      ? 'The developer does not collect any data from this app.'
      : 'Standard disclosures: Data Linked & Diagnostics.';
  }
}

function setPrivacyMode(mode) {
  const fLinked = $('f-priv-linked');
  const fNotLinked = $('f-priv-notlinked');
  const fGoogle = $('f-priv-google');

  if (mode === 'none') {
    if (fLinked) fLinked.value = '';
    if (fNotLinked) fNotLinked.value = '';
    if (fGoogle) fGoogle.value = 'No data shared with third parties, No data collected, Data is encrypted in transit';
    if (typeof CURRENT_PRIVACY !== 'undefined') {
      CURRENT_PRIVACY.linked = '';
      CURRENT_PRIVACY.notLinked = '';
      CURRENT_PRIVACY.google = 'No data shared with third parties, No data collected, Data is encrypted in transit';
    }
  } else {
    const curLinked = fLinked ? fLinked.value.trim() : '';
    const curNotLinked = fNotLinked ? fNotLinked.value.trim() : '';
    if (!curLinked && !curNotLinked) {
      if (fLinked) fLinked.value = 'User Content, Identifiers, Usage Data';
      if (fNotLinked) fNotLinked.value = 'Diagnostics, Performance Data';
      if (fGoogle) fGoogle.value = 'No data shared with third parties, Data is encrypted in transit, You can request data deletion';
      if (typeof CURRENT_PRIVACY !== 'undefined') {
        CURRENT_PRIVACY.linked = 'User Content, Identifiers, Usage Data';
        CURRENT_PRIVACY.notLinked = 'Diagnostics, Performance Data';
        CURRENT_PRIVACY.google = 'No data shared with third parties, Data is encrypted in transit, You can request data deletion';
      }
    }
  }

  renderPrivacy();
  if (typeof updatePrivacyModeUI === 'function') updatePrivacyModeUI();
  if (typeof debouncedSave === 'function') debouncedSave();
  if (typeof flashField === 'function') flashField('privacy');
  if (typeof setFieldFocus === 'function') setFieldFocus('privacy', true);
}

function initPrivacyModeControls() {
  const seg = $('privacyModeSeg');
  const btnNone = $('privBtnNone');
  const btnCol = $('privBtnCollected');
  if (btnNone) {
    btnNone.onclick = (e) => {
      if (e) e.stopPropagation();
      setPrivacyMode('none');
      if (typeof flashField === 'function') flashField('privacy');
      if (typeof setFieldFocus === 'function') setFieldFocus('privacy', true);
    };
  }
  if (btnCol) {
    btnCol.onclick = (e) => {
      if (e) e.stopPropagation();
      setPrivacyMode('collected');
      if (typeof flashField === 'function') flashField('privacy');
      if (typeof setFieldFocus === 'function') setFieldFocus('privacy', true);
    };
  }
  if (seg) {
    seg.addEventListener('click', () => {
      if (typeof flashField === 'function') flashField('privacy');
      if (typeof setFieldFocus === 'function') setFieldFocus('privacy', true);
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrivacyModeControls);
  } else {
    initPrivacyModeControls();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderPrivacy,
    updatePrivacyModeUI,
    setPrivacyMode,
    parsePrivItems,
    getApplePrivIcon,
    getGoogleSafetyIcon
  };
}


/* =========================================================================
   Module: src/js/modules/form/reviews.js
   ========================================================================= */
// Store Preview Studio · Review Cards Dynamic Rendering & Customization (Mockups)

const DEFAULT_REVIEW = {
  title: 'Love this app so much',
  author: 'michellerebecca',
  text: 'This app is one of my favorite used apps on my phone. The interface is so intuitive and beautiful. Would recommend to everyone!',
  stars: 5,
  avatarBg: '#0b57d0',
  helpful: 84
};

function syncReviewInputs(){
  if(!Array.isArray(REVIEWS) || REVIEWS.length === 0){
    REVIEWS = [{ ...DEFAULT_REVIEW }];
  }
  const rev = REVIEWS[0] || DEFAULT_REVIEW;
  const tEl = $('f-rev-title');
  const uEl = $('f-rev-user');
  const dEl = $('f-rev-desc');
  if(tEl && document.activeElement !== tEl) tEl.value = rev.title || '';
  if(uEl && document.activeElement !== uEl) uEl.value = rev.author || '';
  if(dEl && document.activeElement !== dEl) dEl.value = rev.text || '';
}

function initReviewInputs(){
  const tEl = $('f-rev-title');
  const uEl = $('f-rev-user');
  const dEl = $('f-rev-desc');

  const onRevInput = () => {
    if(!Array.isArray(REVIEWS) || REVIEWS.length === 0){
      REVIEWS = [{ ...DEFAULT_REVIEW }];
    }
    if(tEl) REVIEWS[0].title = tEl.value;
    if(uEl){
      REVIEWS[0].author = uEl.value;
      REVIEWS[0].avatar = uEl.value.trim().charAt(0).toUpperCase() || 'U';
    }
    if(dEl) REVIEWS[0].text = dEl.value;
    renderReviews();
    if(typeof isPresetModified !== 'undefined') isPresetModified = true;
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof saveState === 'function') saveState();
  };

  if(tEl && !tEl._revBound){
    tEl.addEventListener('input', onRevInput);
    tEl._revBound = true;
  }
  if(uEl && !uEl._revBound){
    uEl.addEventListener('input', onRevInput);
    uEl._revBound = true;
  }
  if(dEl && !dEl._revBound){
    dEl.addEventListener('input', onRevInput);
    dEl._revBound = true;
  }
}

function renderReviews(){
  const esc = (typeof escapeHtml === 'function') ? escapeHtml : (s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
  if(!Array.isArray(REVIEWS) || REVIEWS.length === 0){
    REVIEWS = [{ ...DEFAULT_REVIEW }];
  }
  const list = REVIEWS;

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

// Auto-bind review inputs
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReviewInputs();
      syncReviewInputs();
    });
  } else {
    initReviewInputs();
    syncReviewInputs();
  }
}


/* =========================================================================
   Module: src/js/modules/form/age.js
   ========================================================================= */
// Store Preview Studio · Age Rating Dropdown & Normalization (App Store & Google Play)
const AGE_RATINGS = [
  { val: '4+',  apple: '4+',  googleBadge: 'E',    googleLabel: 'Everyone',        label: '4+ / Everyone (E)',        desc: 'General audience · Suitable for all ages' },
  { val: '9+',  apple: '9+',  googleBadge: 'E10+', googleLabel: 'Everyone 10+',    label: '9+ / Everyone 10+ (E10+)', desc: 'Mild cartoon or fantasy violence' },
  { val: '12+', apple: '12+', googleBadge: 'T',    googleLabel: 'Teen · 12+',      label: '12+ / Teen (T)',           desc: 'Mild violence, suggestive themes, crude humor' },
  { val: '17+', apple: '17+', googleBadge: 'M',    googleLabel: 'Mature 17+',      label: '17+ / Mature 17+ (M)',     desc: 'Frequent mature themes, realistic violence' },
  { val: '18+', apple: '18+', googleBadge: '18+',  googleLabel: 'Adults Only 18+', label: '18+ / Adults Only (AO)',   desc: 'Explicit adult content, strictly 18+' }
];

function getAgeRatingLabel(val) {
  if (!val) return '4+ / Everyone (E)';
  const match = AGE_RATINGS.find(r => r.val.toLowerCase() === val.toLowerCase());
  if (match) return match.label;
  return val + ' (Custom)';
}

function syncAgeUI() {
  const currentVal = (typeof STATS !== 'undefined' && STATS.age) ? STATS.age : ($('f-st-age') ? $('f-st-age').value : '4+');
  const valEl = $('customAgeVal');
  if (valEl) valEl.textContent = getAgeRatingLabel(currentVal);

  const wrap = $('customAgeWrap');
  if (wrap && wrap.classList.contains('open')) {
    renderCustomAgeOptions($('customAgeSearch') ? $('customAgeSearch').value : '');
  }
}

function isCustomAgeOpen() {
  const wrap = $('customAgeWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomAge() {
  const wrap = $('customAgeWrap');
  const trigger = $('customAgeTrigger');
  const searchInput = $('customAgeSearch');
  if (!wrap) return;

  // Close category and monetization dropdowns if open
  if (typeof closeCustomCat === 'function') closeCustomCat();
  if (typeof closeCustomIap === 'function') closeCustomIap();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderCustomAgeOptions('');
  const activeOpt = wrap.querySelector('.custom-age-option.active');
  if (activeOpt) {
    activeOpt.scrollIntoView({ block: 'nearest' });
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('st-age', true);
  }
}

function closeCustomAge() {
  const wrap = $('customAgeWrap');
  const trigger = $('customAgeTrigger');
  if (!wrap) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectAgeFromUI(ageVal) {
  ageVal = (ageVal || '4+').trim();
  if (typeof STATS !== 'undefined') {
    STATS.age = ageVal;
  }
  const sel = $('f-st-age');
  if (sel) {
    let opt = Array.from(sel.options).find(o => o.value === ageVal);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = ageVal;
      opt.textContent = ageVal + ' (custom)';
      sel.appendChild(opt);
    }
    sel.value = ageVal;
  }
  closeCustomAge();
  const trigger = $('customAgeTrigger');
  if (trigger) trigger.focus();
  if (typeof renderStats === 'function') renderStats();
  syncAgeUI();
  if (typeof debouncedSave === 'function') debouncedSave();
  else if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('st-age');
  if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
}

function renderCustomAgeOptions(query = '') {
  const listContainer = $('customAgeOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const currentVal = (typeof STATS !== 'undefined' && STATS.age) ? STATS.age : ($('f-st-age') ? $('f-st-age').value : '4+');
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-age-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (item) => {
    const el = document.createElement('div');
    const isActive = item.val.toLowerCase() === (currentVal || '').toLowerCase();
    el.className = 'custom-age-option' + (isActive ? ' active' : '');
    el.dataset.val = item.val;
    el.role = 'option';
    el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    el.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">${item.label}</div>
        <div class="custom-age-option-desc">${item.desc}</div>
      </div>
      ${checkSvg}
    `;
    el.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(item.val);
    };
    return el;
  };

  let renderedCount = 0;
  const filtered = AGE_RATINGS.filter(r => {
    if (!q) return true;
    return r.val.toLowerCase().includes(q) ||
           r.label.toLowerCase().includes(q) ||
           r.apple.toLowerCase().includes(q) ||
           r.googleBadge.toLowerCase().includes(q) ||
           r.googleLabel.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q);
  });

  filtered.forEach(r => {
    listContainer.appendChild(createOptionEl(r));
    renderedCount++;
  });

  // If current value is custom and not in standard list, show it at the top
  if (currentVal && !AGE_RATINGS.some(r => r.val.toLowerCase() === currentVal.toLowerCase())) {
    const customItem = document.createElement('div');
    customItem.className = 'custom-age-option active';
    customItem.dataset.val = currentVal;
    customItem.role = 'option';
    customItem.setAttribute('aria-selected', 'true');
    customItem.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">${currentVal} (Custom)</div>
        <div class="custom-age-option-desc">User-defined age rating</div>
      </div>
      ${checkSvg}
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(currentVal);
    };
    listContainer.insertBefore(customItem, listContainer.firstChild);
    renderedCount++;
  }

  // If no match found for query, allow creating/using custom rating
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-age-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">Use "<strong>${rawVal}</strong>"</div>
        <div class="custom-age-option-desc">Custom age rating</div>
      </div>
      <span class="custom-age-create-tag">Custom</span>
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-age-empty';
    emptyEl.textContent = 'No age ratings found';
    listContainer.appendChild(emptyEl);
  }
}

(function initCustomAgeEvents() {
  const trigger = $('customAgeTrigger');
  const wrap = $('customAgeWrap');
  const searchInput = $('customAgeSearch');
  const sel = $('f-st-age');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (isCustomAgeOpen()) {
        closeCustomAge();
      } else {
        openCustomAge();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });

      trigger.addEventListener('click', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          setFieldFocus('st-age', true);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });
    }

    searchInput.oninput = () => {
      renderCustomAgeOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomAge();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-age-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectAgeFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-age-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  if (sel) {
    sel.addEventListener('change', () => {
      syncAgeUI();
    });
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomAge();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomAgeOpen()) {
      closeCustomAge();
      if (trigger) trigger.focus();
    }
  });
})();

// Initial sync
syncAgeUI();


/* =========================================================================
   Module: src/js/modules/form/monetization.js
   ========================================================================= */
// Store Preview Studio · Monetization Badge Dropdown (App Store & Google Play)
const MONETIZATION_OPTIONS = [
  { val: 'iap',     label: 'In-App Purchases (No Ads)',        desc: 'In-app purchases or subscriptions · No advertising' },
  { val: 'ads_iap', label: 'Contains Ads · In-App Purchases',  desc: 'Ad networks with in-app purchases or subscriptions' },
  { val: 'ads',     label: 'Contains Ads Only',                desc: 'Ad-supported · No in-app purchases' },
  { val: 'free',    label: 'None (100% Free / Paid Upfront)',   desc: 'Completely free or upfront paid · Zero ads & IAP' }
];

function getMonetizationLabel(val) {
  if (!val) return 'In-App Purchases (No Ads)';
  const match = MONETIZATION_OPTIONS.find(m => m.val.toLowerCase() === val.toLowerCase());
  if (match) return match.label;
  return val + ' (Custom)';
}

function syncIapUI() {
  const currentVal = (typeof STATS !== 'undefined' && STATS.iap) ? STATS.iap : ($('f-st-iap') ? $('f-st-iap').value : 'iap');
  const valEl = $('customIapVal');
  if (valEl) valEl.textContent = getMonetizationLabel(currentVal);

  const wrap = $('customIapWrap');
  if (wrap && wrap.classList.contains('open')) {
    renderCustomIapOptions($('customIapSearch') ? $('customIapSearch').value : '');
  }
}

function isCustomIapOpen() {
  const wrap = $('customIapWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomIap() {
  const wrap = $('customIapWrap');
  const trigger = $('customIapTrigger');
  const searchInput = $('customIapSearch');
  if (!wrap) return;

  // Close category and age dropdowns if open
  if (typeof closeCustomCat === 'function') closeCustomCat();
  if (typeof closeCustomAge === 'function') closeCustomAge();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderCustomIapOptions('');
  const activeOpt = wrap.querySelector('.custom-iap-option.active');
  if (activeOpt) {
    activeOpt.scrollIntoView({ block: 'nearest' });
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('st-iap', true);
  }
}

function closeCustomIap() {
  const wrap = $('customIapWrap');
  const trigger = $('customIapTrigger');
  if (!wrap) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectIapFromUI(iapVal) {
  iapVal = (iapVal || 'iap').trim();
  if (typeof STATS !== 'undefined') {
    STATS.iap = iapVal;
  }
  const sel = $('f-st-iap');
  if (sel) {
    let opt = Array.from(sel.options).find(o => o.value === iapVal);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = iapVal;
      opt.textContent = iapVal + ' (custom)';
      sel.appendChild(opt);
    }
    sel.value = iapVal;
  }
  closeCustomIap();
  const trigger = $('customIapTrigger');
  if (trigger) trigger.focus();
  if (typeof renderStats === 'function') renderStats();
  syncIapUI();
  if (typeof debouncedSave === 'function') debouncedSave();
  else if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('st-iap');
  if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', true);
}

function renderCustomIapOptions(query = '') {
  const listContainer = $('customIapOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const currentVal = (typeof STATS !== 'undefined' && STATS.iap) ? STATS.iap : ($('f-st-iap') ? $('f-st-iap').value : 'iap');
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-iap-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (item) => {
    const el = document.createElement('div');
    const isActive = item.val.toLowerCase() === (currentVal || '').toLowerCase();
    el.className = 'custom-iap-option' + (isActive ? ' active' : '');
    el.dataset.val = item.val;
    el.role = 'option';
    el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    el.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">${item.label}</div>
        <div class="custom-iap-option-desc">${item.desc}</div>
      </div>
      ${checkSvg}
    `;
    el.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(item.val);
    };
    return el;
  };

  let renderedCount = 0;
  const filtered = MONETIZATION_OPTIONS.filter(r => {
    if (!q) return true;
    return r.val.toLowerCase().includes(q) ||
           r.label.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q);
  });

  filtered.forEach(r => {
    listContainer.appendChild(createOptionEl(r));
    renderedCount++;
  });

  // If current value is custom and not in standard list, show it at the top
  if (currentVal && !MONETIZATION_OPTIONS.some(r => r.val.toLowerCase() === currentVal.toLowerCase())) {
    const customItem = document.createElement('div');
    customItem.className = 'custom-iap-option active';
    customItem.dataset.val = currentVal;
    customItem.role = 'option';
    customItem.setAttribute('aria-selected', 'true');
    customItem.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">${currentVal} (Custom)</div>
        <div class="custom-iap-option-desc">User-defined monetization badge</div>
      </div>
      ${checkSvg}
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(currentVal);
    };
    listContainer.insertBefore(customItem, listContainer.firstChild);
    renderedCount++;
  }

  // If no match found for query, allow creating/using custom monetization badge
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-iap-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">Use "<strong>${rawVal}</strong>"</div>
        <div class="custom-iap-option-desc">Custom monetization badge</div>
      </div>
      <span class="custom-iap-create-tag">Custom</span>
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-iap-empty';
    emptyEl.textContent = 'No monetization badges found';
    listContainer.appendChild(emptyEl);
  }
}

(function initCustomIapEvents() {
  const trigger = $('customIapTrigger');
  const wrap = $('customIapWrap');
  const searchInput = $('customIapSearch');
  const sel = $('f-st-iap');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (isCustomIapOpen()) {
        closeCustomIap();
      } else {
        openCustomIap();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', true);
      });

      trigger.addEventListener('click', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', true);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          setFieldFocus('st-iap', true);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', true);
      });
    }

    searchInput.oninput = () => {
      renderCustomIapOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomIap();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-iap-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectIapFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-iap-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  if (sel) {
    sel.addEventListener('change', () => {
      syncIapUI();
    });
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomIap();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomIapOpen()) {
      closeCustomIap();
      if (trigger) trigger.focus();
    }
  });
})();

// Initial sync
syncIapUI();


/* =========================================================================
   Module: src/js/modules/form/sync.js
   ========================================================================= */
// Store Preview Studio · Form Synchronization & Validation Loop

// Official Character Limits per Store
const LIMITS = {
  name: ()=>30,
  sub: ()=>30,
  promo: ()=>170,
  short: ()=>80,
  new: ()=>store==='google'?500:4000,
  desc: ()=>4000
};

// Initialize progress meters under each field
$$('.fg').forEach(g=>{
  if(g.querySelector('.cc') && !g.querySelector('.meter')){
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

    // Synchronize to Mockup Displays (clamped to official store limits)
    $$('[data-b="'+k+'"]').forEach(e => {
      const fallback = k==='name' ? 'App Name' : (k==='sub' ? 'App Subtitle' : (k==='short' ? 'Short description...' : (k==='desc' ? 'App description goes here...' : (k==='new' ? 'Release notes...' : (k==='promo' ? 'Special offer, seasonal update, or headline...' : '')))));
      let elemMax = max;
      if(k === 'new'){
        elemMax = e.closest('.dev.google, .dev.gtab') ? 500 : 4000;
      }
      const displayVal = (elemMax && v) ? (typeof clampGraphemes === 'function' ? clampGraphemes(v, elemMax) : v.slice(0, elemMax)) : (v || fallback);
      e.textContent = displayVal || fallback;
    });
  }

  // Developer, Category, Version, Release Date, Support Email & Location dynamic bindings
  const devVal = ($('f-dev') && $('f-dev').value.trim()) || 'Developer Name';
  const catVal = ($('f-cat') && $('f-cat').value.trim()) || 'Category';
  const appleCatVal = (typeof CAT === 'object' && CAT.apple) ? CAT.apple.replace(/^Games · /, '') : catVal;
  const googleCatVal = (typeof CAT === 'object' && CAT.google) ? CAT.google.replace(/^Games · /, '') : catVal;
  const verVal = ($('f-ver') && $('f-ver').value.trim()) || '1.0.0';
  const rdateVal = ($('f-rdate') && $('f-rdate').value.trim()) || (typeof getCurrentMonthDateStr === 'function' ? getCurrentMonthDateStr(2, true) : 'Current Date');
  const emailVal = ($('f-email') && $('f-email').value.trim()) || 'support@domain.com';
  const phoneVal = ($('f-phone') && $('f-phone').value.trim()) || '+1 800-555-0199';
  const addrVal = ($('f-addr') && $('f-addr').value.trim()) || 'Vietnam';
  $$('[data-b="dev"]').forEach(e=>e.textContent=devVal);
  $$('[data-b="cat"]').forEach(e=>{
    const isGoogle = !!e.closest('.dev.google, .dev.gtab');
    e.textContent = (isGoogle ? googleCatVal : appleCatVal) || catVal;
  });
  $$('[data-b="ver"]').forEach(e=>e.textContent=verVal);
  $$('[data-b="rdate"]').forEach(e=>e.textContent=rdateVal);
  $$('[data-b="email"]').forEach(e=>e.textContent=emailVal);
  $$('[data-b="phone"]').forEach(e=>e.textContent=phoneVal);
  $$('[data-b="addr"]').forEach(e=>e.textContent=addrVal);

  if (typeof updateMockupClocks === 'function') updateMockupClocks();

  // Toggle Promotional Text banner in Apple Detail (both iPhone and iPad)
  const hasPromo = !!($('f-promo') && $('f-promo').value.trim());
  if($('promoBox')) $('promoBox').style.display = hasPromo ? 'block' : 'none';
  $$('.promo[data-b="promo"]').forEach(el => { el.style.display = hasPromo ? 'block' : 'none'; });

  // Render App Privacy & Data Safety
  if (typeof renderPrivacy === 'function') renderPrivacy();
  if (typeof renderReviews === 'function') renderReviews();

  // Re-sync focus highlight if field is currently active
  if (typeof setFieldFocus === 'function' && activeFieldFocusKey) {
    setFieldFocus(activeFieldFocusKey, false);
  }
}

// --- Field ↔ Device Mockup Focus & Scroll Linking ---
function getFieldMockupTargets(key) {
  if (!key) return [];
  switch (key) {
    case 'name':
      return $$('.stage [data-b="name"]');
    case 'sub':
      return $$('.stage [data-b="sub"]');
    case 'promo':
      return $$('.stage [data-b="promo"], .stage #promoBox');
    case 'short':
      return $$('.stage [data-b="short"]');
    case 'desc':
      return $$('.stage [data-b="desc"]:not([hidden]), .stage .g-desc-arrow');
    case 'new':
      return $$('.stage [data-b="new"]:not([hidden])');
    case 'dev':
      return $$('.stage [data-b="dev"]');
    case 'cat':
    case 'cat-apple':
    case 'cat-google':
      return $$('.stage [data-b="cat"]');
    case 'ver': {
      const verWraps = $$('.stage .wn-ver');
      return verWraps.length ? verWraps : $$('.stage [data-b="ver"]');
    }
    case 'rdate':
      return $$('.stage [data-b="rdate"]');
    case 'email':
      return $$('.stage [data-b="email"]');
    case 'phone':
      return $$('.stage [data-b="phone"]');
    case 'addr':
      return $$('.stage [data-b="addr"]');
    case 'icon':
      return $$('.stage [data-icon]');
    case 'shots':
      return $$('.stage .gal, .stage [data-shots]');
    case 'privacy': {
      const applePcs = $$('.stage [data-apple-priv-wrap] .pc');
      const appleTargets = applePcs.length ? applePcs : $$('.stage [data-apple-priv-wrap]');
      return [...$$('.stage [data-google-safety]'), ...appleTargets];
    }
    case 'priv-google':
      return $$('.stage [data-google-safety]');
    case 'priv-linked':
      return $$('.stage [data-apple-priv-wrap] .pc:first-child, .stage [data-apple-priv-wrap]');
    case 'priv-notlinked':
      return $$('.stage [data-apple-priv-wrap] .pc:last-child, .stage [data-apple-priv-wrap]');
    case 'rev-title':
    case 'rev-user':
    case 'rev-desc':
    case 'reviews':
      return $$('.stage [data-apple-reviews], .stage [data-google-reviews], .stage .a-reviews-list, .stage .g-reviews-list');
    case 'rating':
    case 'st-rating': {
      const raw = $$('.stage [data-stat="rating"]');
      return Array.from(new Set(raw.map(el => el.closest('.a-met b, .ipad-metrics b, [data-gmet-rating] b, .gt10-met-item b, .g-rb-num, .a-rating-num, .ipad-rating-num, .sr-rating-val') || el)));
    }
    case 'count':
    case 'st-count': {
      const raw = $$('.stage [data-stat="count"]');
      return Array.from(new Set(raw.map(el => el.closest('.a-met i, .a-rating-sub, .ipad-rating-caption, [data-gmet-rating] small, .gt10-met-item small, .g-rb-cnt, .sr-rating-cnt') || el)));
    }
    case 'rank':
    case 'st-rank': {
      const raw = $$('.stage [data-stat="rank"]');
      return Array.from(new Set(raw.map(el => el.closest('.a-met b, .ipad-metrics b, .chips .st, .g-about .st, .gt10-rank-chip, .st') || el)));
    }
    case 'dl':
    case 'st-dl': {
      const raw = $$('.stage [data-stat="dl"]');
      return Array.from(new Set(raw.map(el => el.closest('.g-met b, .gt10-met-item b, .gt10-met b, .gp-stat-dl, .g-met .st') || el)));
    }
    case 'size':
    case 'st-size': {
      const raw = $$('.stage [data-stat="size"]');
      return Array.from(new Set(raw.map(el => el.closest('.a-met b, .ipad-metrics b, [data-gmet-size] b, [data-gmet-size], .gt10-met-item small, .gt10-met-dl-size, .ipad-info-val, .a-info b') || el)));
    }
    case 'age':
    case 'st-age': {
      const raw = $$('.stage [data-age-apple], .stage [data-age-google-badge]');
      return Array.from(new Set(raw.map(el => el.closest('.a-met b, .ipad-metrics b, .g-met b, .gt10-met-item b, .gt10-age-badge, .gt10-met b, .a-info b, .ipad-info-val') || el)));
    }
    case 'iap':
    case 'st-iap': {
      const raw = $$('.stage [data-iap-apple], .stage [data-iap-yesno], .stage [data-iap-google]');
      return Array.from(new Set(raw.map(el => el.closest('.a-info b') || el)));
    }
    default:
      return $$('.stage [data-b="' + key + '"]');
  }
}

let activeFieldFocusKey = null;

function setFieldFocus(key, shouldScroll = true) {
  activeFieldFocusKey = key;
  
  // Clear previous focus highlight on all targets
  $$('.stage .hl-target').forEach(el => el.classList.remove('hl-target'));

  if (!key) return;

  // Auto-expand containing card if it is currently collapsed & mark it selected
  let editorInput = $('f-' + key) || $(key);
  if (!editorInput && key === 'privacy') {
    editorInput = $('privacyCard') || $('privacyModeSeg');
  }
  if (editorInput) {
    const parentCard = editorInput.closest('.card') || (editorInput.classList.contains('card') ? editorInput : null);
    if (parentCard) {
      if (parentCard.classList.contains('collapsed')) {
        parentCard.classList.remove('collapsed');
      }
      $$('.card').forEach(c => c.classList.remove('selected'));
      parentCard.classList.add('selected');
    }
  }

  const targets = getFieldMockupTargets(key);
  if (!targets.length) return;

  // Add highlight border to all matching targets
  targets.forEach(el => el.classList.add('hl-target'));

  if (!shouldScroll) return;

  // Smoothly scroll active device screens (.scr) to the target position
  const scrolledContainers = new Set();
  targets.forEach(target => {
    const dev = target.closest('.dev');
    if (!dev) return;
    
    // Check if device mockup is currently visible
    const devStyle = window.getComputedStyle(dev);
    if (devStyle.display === 'none' || devStyle.visibility === 'hidden' || parseFloat(devStyle.opacity) === 0) {
      return;
    }
    // Check if target element itself is rendered
    if (target.offsetParent === null && target.offsetWidth === 0 && target.offsetHeight === 0) {
      return;
    }

    // Scroll the device's inner screen (.scr or 10" tablet panes)
    const scr = target.closest('.scr, .gt10-detail-col, .gt10-results-list');
    if (scr && !scrolledContainers.has(scr)) {
      scrolledContainers.add(scr);
      const scrRect = scr.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Relative position within scroll container
      const relativeTop = (targetRect.top - scrRect.top) + scr.scrollTop;
      
      // Center the target element in the visible height of the phone/tablet screen
      const targetCenter = relativeTop - (scr.clientHeight / 2) + (targetRect.height / 2);
      const scrollToY = Math.max(0, targetCenter);

      if (typeof scr.scrollTo === 'function') {
        scr.scrollTo({
          top: scrollToY,
          behavior: 'smooth'
        });
      } else {
        scr.scrollTop = scrollToY;
      }
    }

    // Scroll horizontally if target is inside horizontal ribbon (.a-met, .ipad-metrics)
    const met = target.closest('.a-met, .ipad-metrics');
    if (met) {
      const metRect = met.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const relativeLeft = (targetRect.left - metRect.left) + met.scrollLeft;
      const targetCenterH = relativeLeft - (met.clientWidth / 2) + (targetRect.width / 2);
      met.scrollTo({
        left: Math.max(0, targetCenterH),
        behavior: 'smooth'
      });
    }
  });
}

function flashField(key) {
  if (!key) return;
  const targets = getFieldMockupTargets(key);
  targets.forEach(el => {
    el.classList.remove('hl-flash');
    void el.offsetWidth;
    el.classList.add('hl-flash');
    clearTimeout(el._flashTimer);
    el._flashTimer = setTimeout(() => {
      el.classList.remove('hl-flash');
    }, 1150);
  });
}

function initFieldFocusLinking() {
  const formElements = $$('.editor input, .editor textarea, .editor select');
  formElements.forEach(input => {
    const rawId = input.id || '';
    if (rawId === 'f-st-off' || rawId === 'f-st-wm') return;
    let key = '';
    if (rawId.startsWith('f-')) {
      key = rawId.replace('f-', '');
    } else if (rawId.startsWith('sw-')) {
      key = 'privacy';
    }

    if (key.startsWith('cat')) key = 'cat';

    if (!key) return;

    input.addEventListener('focus', () => {
      setFieldFocus(key, true);
    });

    input.addEventListener('click', () => {
      setFieldFocus(key, true);
    });

    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        flashField(key);
        setFieldFocus(key, true);
      });
    }
  });

  // Entire field group click delegation: clicking label or field box highlights on device
  $$('.editor .fg').forEach(fg => {
    fg.addEventListener('click', (e) => {
      if (e.target.closest('#customCatMenu, #customAgeMenu, #customIapMenu')) return;
      const targetInput = fg.querySelector('input:not([type=hidden]), textarea, select, #customCatTrigger, #customAgeTrigger, #customIapTrigger');
      if (!targetInput) return;
      let key = '';
      const rawId = targetInput.id || '';
      if (rawId.startsWith('f-')) key = rawId.replace('f-', '');
      else if (rawId.startsWith('sw-')) key = 'privacy';
      else if (targetInput.id === 'customCatTrigger' || rawId.includes('cat')) key = 'cat';
      else if (targetInput.id === 'customAgeTrigger' || rawId.includes('age')) key = 'st-age';
      else if (targetInput.id === 'customIapTrigger' || rawId.includes('iap')) key = 'st-iap';
      if (key.startsWith('cat')) key = 'cat';
      if (key) {
        setFieldFocus(key, true);
      }
    });
  });

  // App icon interaction zones
  const iconZones = $$('#icoDropZone, #icoUp, #icoFile, #iconStatusBadge, #dropApple, #dropGoogle');
  iconZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('icon', true));
    el.addEventListener('click', () => setFieldFocus('icon', true));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('icon', true);
    });
  });

  // Screenshots dropzones
  const shotZones = $$('#dropZ, #dropZ-ipad, #dropZ-tab7, #dropZ-tab10, .drop-shots');
  shotZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('shots', true));
    el.addEventListener('click', () => setFieldFocus('shots', true));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('shots', true);
    });
  });

  // Custom Category dropdown trigger and search interaction zones
  const catZones = $$('#customCatTrigger, #customCatSearch, .custom-cat-trigger');
  catZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('cat', true));
    el.addEventListener('click', () => setFieldFocus('cat', true));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('cat', true);
    });
  });

  // Custom Age dropdown trigger and search interaction zones
  const ageZones = $$('#customAgeTrigger, #customAgeSearch, .custom-age-trigger');
  ageZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('st-age', true));
    el.addEventListener('click', () => setFieldFocus('st-age', true));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('st-age', true);
    });
  });

  // Custom Monetization dropdown trigger and search interaction zones
  const iapZones = $$('#customIapTrigger, #customIapSearch, .custom-iap-trigger');
  iapZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('st-iap', true));
    el.addEventListener('click', () => setFieldFocus('st-iap', true));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('st-iap', true);
    });
  });

  // Privacy disclosure mode tabview interaction zones
  const privZones = $$('#privacyModeSeg, #privBtnNone, #privBtnCollected, .priv-seg-btn');
  privZones.forEach(el => {
    el.addEventListener('focus', () => {
      if (typeof flashField === 'function') flashField('privacy');
      setFieldFocus('privacy', true);
    });
    el.addEventListener('click', () => {
      if (typeof flashField === 'function') flashField('privacy');
      setFieldFocus('privacy', true);
    });
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('privacy', true);
    });
  });

  // Dismiss focus highlight when clicking directly on empty stage canvas background
  const stage = document.querySelector('.stage');
  if (stage) {
    stage.addEventListener('click', (e) => {
      if (e.target === stage || e.target.id === 'stageDevices' || e.target.id === 'stage') {
        setFieldFocus(null);
      }
    });
  }
}

// Bind input listeners
$$('input[type=text],textarea').forEach(e => {
  e.addEventListener('input', () => {
    update();
    const rawId = e.id || '';
    if (rawId.startsWith('f-')) {
      flashField(rawId.replace('f-', ''));
    }
    if(typeof handleUserFormEdit === 'function'){
      handleUserFormEdit();
    } else {
      debouncedSave();
    }
  });
});

function initPrivacyBanner() {
  const banner = $('privacyMockBanner');
  if (banner) {
    banner.addEventListener('click', () => {
      setFieldFocus('privacy', true);
    });
    banner.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFieldFocus('privacy', true);
      }
    });
  }
}

function initDescFeatures() {
  initFieldFocusLinking();
  initPrivacyBanner();
  if (typeof initInfoPopover === 'function') {
    initInfoPopover("appNameInfoBtn", "appNameInfoPop", "appNameInfoClose");
    initInfoPopover("descInfoBtn", "descInfoPop", "descInfoClose");
    initInfoPopover("privacyInfoBtn", "privacyInfoPop", "privacyInfoClose");
    initInfoPopover("whatsNewInfoBtn", "whatsNewInfoPop", "whatsNewInfoClose");
    initInfoPopover("metricsInfoBtn", "metricsInfoPop", "metricsInfoClose");
  }
  if (typeof initSharedPopovers === 'function') {
    initSharedPopovers();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDescFeatures);
} else {
  initDescFeatures();
}


/* =========================================================================
   Module: src/js/modules/transitions.js
   ========================================================================= */
// Store Preview Studio · 3D Spatial Transitions & Store Switcher
// --- Device & Tab Smooth 3D Spatial Animation System ---
let devExitTimer = null;
let devEnterTimer = null;

const APPLE_DEV_ORDER = { iphone: 0, ipad: 1 };
const GOOGLE_DEV_ORDER = { phone: 0, tab7: 1, tab10: 2 };

function getTransitionDirection(fromStore, fromDev, toStore, toDev){
  if(fromStore !== toStore) return 'morph';
  if(fromStore === 'apple'){
    const fromIdx = APPLE_DEV_ORDER[fromDev] ?? 0;
    const toIdx = APPLE_DEV_ORDER[toDev] ?? 0;
    return toIdx >= fromIdx ? 'next' : 'prev';
  } else {
    const fromIdx = GOOGLE_DEV_ORDER[fromDev] ?? 0;
    const toIdx = GOOGLE_DEV_ORDER[toDev] ?? 0;
    return toIdx >= fromIdx ? 'next' : 'prev';
  }
}

const ALL_TRANS_CLASSES = [
  'dev-exit', 'dev-enter',
  'dev-exit-next', 'dev-enter-next',
  'dev-exit-prev', 'dev-enter-prev',
  'dev-exit-morph', 'dev-enter-morph'
];

function clearDevTransitions(){
  if(devExitTimer){ clearTimeout(devExitTimer); devExitTimer = null; }
  if(devEnterTimer){ clearTimeout(devEnterTimer); devEnterTimer = null; }
  if(document.body) document.body.classList.remove('is-animating-store');
  const stage = $('stageDevices') || document.querySelector('.stage');
  if(stage) {
    stage.style.minHeight = '';
    stage.style.position = '';
  }
  const stageEl = document.querySelector('.stage');
  if(stageEl) stageEl.style.minHeight = '';
  const dt = $('dt');
  const gdt = $('gdt');
  if(dt) dt.style.display = '';
  if(gdt) gdt.style.display = '';
  const da = document.querySelector('.dev.apple.single');
  const dg = document.querySelector('.dev.google');
  if(da){
    da.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    da.style.opacity = '';
    da.style.pointerEvents = '';
    da.style.transition = '';
    da.style.transform = '';
    da.style.transformOrigin = '';
    da.style.position = '';
    da.style.left = '';
    da.style.top = '';
    da.style.margin = '';
    da.style.zIndex = '';
  }
  if(dg){
    dg.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    dg.style.opacity = '';
    dg.style.pointerEvents = '';
    dg.style.transition = '';
    dg.style.transform = '';
    dg.style.transformOrigin = '';
    dg.style.position = '';
    dg.style.left = '';
    dg.style.top = '';
    dg.style.margin = '';
    dg.style.zIndex = '';
  }
  $$('.dev').forEach(d => {
    d.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
  });
}

function getActiveDeviceEl(s = store, d = (s === 'apple' ? appleDevice : googleDevice)){
  if(s === 'apple'){
    if(d === 'ipad') return document.querySelector('.dev.ipad');
    return document.querySelector('.dev.apple.single');
  } else {
    if(d === 'tab7') return $('dev-tab7');
    if(d === 'tab10') return $('dev-tab10');
    return document.querySelector('.dev.google');
  }
}

function computeDeviceZoom(s, d){
  const st = document.querySelector('.stage');
  if(!st) return 1;
  const m = isM();
  const padW = m ? 24 : 48;
  const padH = m ? 16 : 28;
  const tb = document.querySelector('.stage-toolbar');
  const bb = document.querySelector('.stage-bottom-bar');
  const isBbVis = bb && bb.offsetHeight > 0 && (!bb.style.display || bb.style.display !== 'none');
  const bbH = isBbVis ? bb.offsetHeight + 4 : 0;
  const vt = (tb ? tb.offsetHeight : 38) + bbH + (m ? 12 : 20) + 40;
  const isDual = d === 'dual' || document.body.dataset.dual === 'true';
  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    if(m){
      baseW = isLand ? 870 : 416;
      baseH = (isLand ? 416 : 870) * 2 + 56;
    }else{
      baseW = (isLand ? 870 : 416) * 2 + 28;
      baseH = isLand ? 416 : 870;
    }
  } else if(s === 'apple'){
    if(d === 'ipad'){
      baseW = 750;
      baseH = 980;
    } else {
      baseW = 416;
      baseH = 870;
    }
  } else if(d !== 'phone'){
    const land = tabOrient[d] === 'landscape';
    const [lw, lh] = d === 'tab7' ? [800, 512] : [1060, 676];
    baseW = land ? lw : lh;
    baseH = land ? lh : lw;
  } else {
    baseW = 416;
    baseH = 870;
  }
  const zw = (st.clientWidth - padW) / baseW;
  const zh = m ? 9 : (st.clientHeight - padH - vt) / (baseH + 8);
  return Math.max(0.28, Math.min(1, zw, zh));
}

function syncVtPill(container){
  if(!container || container.classList.contains('menu') || container.classList.contains('stage-device-dropdown')) return;
  let pill = container.querySelector('.vt-pill');
  if(!pill){
    pill = document.createElement('span');
    pill.className = 'vt-pill';
    container.prepend(pill);
  }
  const activeBtn = container.querySelector('button.on');
  const isVertical = container.classList.contains('vt-vertical');
  if(activeBtn && container.offsetParent !== null && activeBtn.offsetWidth > 0){
    if(isVertical){
      pill.style.width = 'calc(100% - 8px)';
      pill.style.height = activeBtn.offsetHeight + 'px';
      pill.style.transform = 'translateY(' + activeBtn.offsetTop + 'px)';
    } else {
      pill.style.width = activeBtn.offsetWidth + 'px';
      pill.style.height = '';
      pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
    }
    pill.style.opacity = '1';
  } else {
    pill.style.opacity = '0';
  }
}

function syncSegPill(targetStore){
  const seg = document.querySelector('.seg');
  if(!seg) return;
  const pill = seg.querySelector('.pill');
  const activeBtn = seg.querySelector('button.on');
  const s = (typeof targetStore === 'string' && targetStore) || (activeBtn && activeBtn.dataset ? activeBtn.dataset.s : null);
  if(pill && s){
    pill.classList.remove('is-apple', 'is-google', 'is-dual');
    pill.classList.add('is-' + s);
    seg.dataset.store = s;
    pill.dataset.store = s;
  }
  if(pill && activeBtn && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    pill.style.opacity = '1';
  }
}

function syncAllVtPills(){
  requestAnimationFrame(() => {
    ['dt', 'gdt', 'vt', 'theme'].forEach(id => {
      const el = $(id);
      if(el) syncVtPill(el);
    });
    syncSegPill();
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
  });
}

function syncDeviceDropdowns() {
  const curA = (typeof appleDevice !== 'undefined' && appleDevice && appleDevice !== 'dual') ? appleDevice : 'iphone';
  const curG = (typeof googleDevice !== 'undefined' && googleDevice && googleDevice !== 'dual') ? googleDevice : 'phone';

  const lblA = $('appleDeviceLabel');
  if (lblA) lblA.textContent = curA === 'ipad' ? 'iPad' : 'iPhone';
  const icoA = $('appleDeviceIco');
  if (icoA) {
    if (curA === 'ipad') {
      icoA.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2.5"></rect><circle cx="12" cy="5" r="0.8" fill="currentColor"></circle><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    } else {
      icoA.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"></rect><line x1="10.5" y1="5" x2="13.5" y2="5"></line><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    }
  }

  const lblG = $('googleDeviceLabel');
  if (lblG) lblG.textContent = curG === 'tab7' ? '7" Tablet' : (curG === 'tab10' ? '10" Tablet' : 'Phone');
  const icoG = $('googleDeviceIco');
  if (icoG) {
    if (curG === 'tab10') {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2.5"></rect><line x1="10" y1="17" x2="14" y2="17"></line></svg>';
    } else if (curG === 'tab7') {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2.5"></rect><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    } else {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"></rect><circle cx="12" cy="5" r="0.8" fill="currentColor"></circle><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    }
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', syncSegPill);
}

function transitionDevice(targetStore, targetDev, onApply, animate = true){
  const fromEl = getActiveDeviceEl(store, store === 'apple' ? appleDevice : googleDevice);
  const toEl = getActiveDeviceEl(targetStore, targetDev);

  if(!animate || !fromEl || fromEl === toEl || fromEl.offsetParent === null){
    clearDevTransitions();
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  const curDev = store === 'apple' ? appleDevice : googleDevice;
  const dir = getTransitionDirection(store, curDev, targetStore, targetDev);
  const exitClass = 'dev-exit-' + dir;
  const enterClass = 'dev-enter-' + dir;

  clearDevTransitions();

  // Pre-calculate target zoom synchronously so target device NEVER renders unscaled
  const targetZoom = computeDeviceZoom(targetStore, targetDev);
  if(toEl) {
    toEl.style.zoom = targetZoom;
    toEl.style.setProperty('--dev-zoom', targetZoom);
  }
  document.documentElement.style.setProperty('--dev-zoom', targetZoom);

  fromEl.classList.add(exitClass);

  devExitTimer = setTimeout(() => {
    fromEl.classList.remove(exitClass);
    onApply();
    if(toEl){
      toEl.classList.add(enterClass);
      toEl.style.zoom = targetZoom;
      devEnterTimer = setTimeout(() => {
        toEl.classList.remove(enterClass);
      }, 370);
    }
    requestAnimationFrame(() => {
      fit();
      syncAllVtPills();
    });
  }, 160);
}


// --- Store & View Switchers ---
function transitionStoreMode(fromMode, toMode, onApply, animate = true){
  const devApple = document.querySelector('.dev.apple.single');
  const devGoogle = document.querySelector('.dev.google');
  const stage = $('stageDevices') || document.querySelector('.stage');

  clearDevTransitions();

  if(!animate || !devApple || !devGoogle || !stage || fromMode === toMode){
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  // If currently using iPad, Android tablet, or mobile viewport, skip 3D dual slide and apply cleanly
  if((fromMode === 'apple' && appleDevice === 'ipad') || (toMode === 'apple' && appleDevice === 'ipad') ||
     (fromMode === 'google' && googleDevice !== 'phone') || (toMode === 'google' && googleDevice !== 'phone') ||
     (typeof isM === 'function' && isM())){
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  // Prevent CSS rules from abruptly hiding elements while transitioning
  document.body.classList.add('is-animating-store');

  const stageRect = stage.getBoundingClientRect();
  const stageCenterX = stageRect.left + stageRect.width / 2;

  if (fromMode === 'apple' && toMode === 'google') {
    // Single Apple -> Single Google: Apple glides left, Google enters from right
    devGoogle.classList.add('is-hidden-trans');
    devApple.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
    devExitTimer = setTimeout(function () {
      devApple.classList.add('is-hidden-trans');
      onApply();
      devGoogle.classList.remove('is-hidden-trans');
      devGoogle.style.transition = 'none';
      devGoogle.style.opacity = '0';
      devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
      void devGoogle.offsetWidth;
      devGoogle.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
      devGoogle.style.opacity = '1';
      devGoogle.style.transform = 'translate3d(0, 0, 0) scale(1)';
      devEnterTimer = setTimeout(function () {
        clearDevTransitions();
        fit();
        syncAllVtPills();
      }, 360);
    }, 190);
  } else if (fromMode === 'google' && toMode === 'apple') {
    // Single Google -> Single Apple: Google glides right, Apple enters from left
    devApple.classList.add('is-hidden-trans');
    devGoogle.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
    devExitTimer = setTimeout(function () {
      devGoogle.classList.add('is-hidden-trans');
      onApply();
      devApple.classList.remove('is-hidden-trans');
      devApple.style.transition = 'none';
      devApple.style.opacity = '0';
      devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
      void devApple.offsetWidth;
      devApple.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
      devApple.style.opacity = '1';
      devApple.style.transform = 'translate3d(0, 0, 0) scale(1)';
      devEnterTimer = setTimeout(function () {
        clearDevTransitions();
        fit();
        syncAllVtPills();
      }, 360);
    }, 190);
  } else if (fromMode === 'dual' && toMode === 'apple') {
    // Dual -> Apple: FLIP transition - Apple glides seamlessly to exact center, Google softly dissolves
    const stageEl = document.querySelector('.stage') || stage;
    const stRect = stageEl.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;

    // 1. Lock stage overflow to prevent any scrollbar appearance/disappearance
    stageEl.style.overflow = 'hidden';
    stageEl.style.minHeight = stRect.height + 'px';

    // 2. Float Google phone out-of-flow relative to .stage at its exact screen coordinates
    devGoogle.style.position = 'absolute';
    devGoogle.style.left = (firstG.left - stRect.left + stageEl.scrollLeft) + 'px';
    devGoogle.style.top = (firstG.top - stRect.top + stageEl.scrollTop) + 'px';
    devGoogle.style.margin = '0';
    devGoogle.style.pointerEvents = 'none';
    devGoogle.style.zIndex = '5';
    devGoogle.style.zoom = zoomG;

    // 3. Put Apple phone into its final single layout & zoom immediately
    onApply();
    fit();

    // 4. Measure Apple phone's final centered position & zoom
    const lastA = devApple.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const centerX_first = firstA.left + firstA.width / 2;
    const centerY_first = firstA.top + firstA.height / 2;
    const centerX_last = lastA.left + lastA.width / 2;
    const centerY_last = lastA.top + lastA.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomA;
    const deltaY = (centerY_first - centerY_last) / zoomA;

    // 5. Invert Apple phone to its starting visual position with pure translation (zero matrix scale distortion)
    devApple.style.transition = 'none';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Re-assert Google phone's initial visual state
    devGoogle.style.transition = 'none';
    devGoogle.style.opacity = '1';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';

    void devApple.offsetWidth; // flush layout

    // 6. Play silky smooth glide and fade together
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(0, 0, 0)';

    devGoogle.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.94) translate3d(0, 8px, 0)';

    devExitTimer = setTimeout(function () {
      devGoogle.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'dual' && toMode === 'google') {
    // Dual -> Google: FLIP transition - Google glides seamlessly to exact center, Apple softly dissolves
    const stageEl = document.querySelector('.stage') || stage;
    const stRect = stageEl.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;

    // 1. Lock stage overflow to prevent any scrollbar appearance/disappearance
    stageEl.style.overflow = 'hidden';
    stageEl.style.minHeight = stRect.height + 'px';

    // 2. Float Apple phone out-of-flow relative to .stage at its exact screen coordinates
    devApple.style.position = 'absolute';
    devApple.style.left = (firstA.left - stRect.left + stageEl.scrollLeft) + 'px';
    devApple.style.top = (firstA.top - stRect.top + stageEl.scrollTop) + 'px';
    devApple.style.margin = '0';
    devApple.style.pointerEvents = 'none';
    devApple.style.zIndex = '5';
    devApple.style.zoom = zoomA;

    // 3. Put Google phone into its final single layout & zoom immediately
    onApply();
    fit();

    // 4. Measure Google phone's final centered position & zoom
    const lastG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const centerX_first = firstG.left + firstG.width / 2;
    const centerY_first = firstG.top + firstG.height / 2;
    const centerX_last = lastG.left + lastG.width / 2;
    const centerY_last = lastG.top + lastG.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomG;
    const deltaY = (centerY_first - centerY_last) / zoomG;

    // 5. Invert Google phone to its starting visual position with pure translation (zero matrix scale distortion)
    devGoogle.style.transition = 'none';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Re-assert Apple phone's initial visual state
    devApple.style.transition = 'none';
    devApple.style.opacity = '1';
    devApple.style.transform = 'translate3d(0, 0, 0)';

    void devGoogle.offsetWidth; // flush layout

    // 6. Play silky smooth glide and fade together
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';

    devApple.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.94) translate3d(0, 8px, 0)';

    devExitTimer = setTimeout(function () {
      devApple.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'apple' && toMode === 'dual') {
    // Single Apple -> Dual: Apple glides from center to left, Google blooms in
    const firstA = devApple.getBoundingClientRect();

    devApple.classList.remove('is-hidden-trans');
    devGoogle.classList.remove('is-hidden-trans');
    onApply();
    fit();

    const lastA = devApple.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const deltaX = (firstA.left - lastA.left) / zoomA;
    const deltaY = (firstA.top - lastA.top) / zoomA;

    // Invert Apple to starting center position
    devApple.style.transition = 'none';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Initial state for Google blooming in
    devGoogle.style.transition = 'none';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

    void devApple.offsetWidth; // flush layout

    // Play smooth glide and bloom together
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(0, 0, 0)';
    devGoogle.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '1';
    devGoogle.style.transform = 'scale(1) translate3d(0, 0, 0)';

    devEnterTimer = setTimeout(function () {
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 440);
  } else if (fromMode === 'google' && toMode === 'dual') {
    // Single Google -> Dual: Google glides from center to right, Apple blooms in
    const firstG = devGoogle.getBoundingClientRect();

    devApple.classList.remove('is-hidden-trans');
    devGoogle.classList.remove('is-hidden-trans');
    onApply();
    fit();

    const lastG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const deltaX = (firstG.left - lastG.left) / zoomG;
    const deltaY = (firstG.top - lastG.top) / zoomG;

    // Invert Google to starting center position
    devGoogle.style.transition = 'none';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Initial state for Apple blooming in
    devApple.style.transition = 'none';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

    void devGoogle.offsetWidth; // flush layout

    // Play smooth glide and bloom together
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';
    devApple.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '1';
    devApple.style.transform = 'scale(1) translate3d(0, 0, 0)';

    devEnterTimer = setTimeout(function () {
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 440);
  } else {
    onApply();
    fit();
    syncAllVtPills();
  }
}

function setStore(s, animate = true, preserveDual = false){
  const fromMode = document.body.dataset.dual === 'true' ? 'dual' : store;
  const toMode = s;

  if (document.body.dataset.dual === 'true' && !preserveDual) {
    document.body.dataset.dual = 'false';
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.remove('on');
      btn.setAttribute('aria-checked', 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = 'none';
  }

  // Set UI store state immediately so pill and toolbar tabviews #dt and #gdt switch instantly (<1ms)
  document.body.dataset.uiStore = s;

  // 1. UPDATE TABVIEW SEGMENT CONTROL BUTTONS & PILL IMMEDIATELY (<1ms)
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === s));
  syncSegPill(s);

  // Immediately update Phone Screenshots description and counter for the new store (<1ms)
  const hintEl = $('shotHint');
  if(hintEl){
    if(s === 'apple'){
      hintEl.innerHTML = 'Drag and drop to add assets or choose from your Asset Library for iPhone 6.1" or 6.3" displays. Supported sizes for app previews include 1920 × 886px and 886 × 1920px. For app screenshots, supported sizes include 2556 × 1179px, 1179 × 2556px, 2622 × 1206px and 1206 × 2622px.<br>• PNG or JPEG, no alpha transparency.<br>• Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots (16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px).<br>• PNG or JPEG, up to 8 MB each.<br>• Drag ⠿ handle to reorder.';
    }
  }
  const counterEl = $('shotCounter');
  const previewCounterEl = $('appPreviewCounter');
  if(counterEl && typeof SHOTS !== 'undefined'){
    const validCount = SHOTS.filter(sh => sh && sh.trim()).length;
    const maxAllowed = s === 'apple' ? 10 : 8;
    const minRequired = s === 'apple' ? 1 : 2;
    if(s === 'apple'){
      const appPreviewCount = Math.min(validCount, 3);
      if(previewCounterEl){
        previewCounterEl.style.display = 'inline-flex';
        previewCounterEl.textContent = `${appPreviewCount} of 3 App Previews`;
        previewCounterEl.title = 'Images appear on App Store product page';
      }
      counterEl.textContent = `${validCount} of ${maxAllowed} App Screenshots`;
    } else {
      if(previewCounterEl){
        previewCounterEl.style.display = 'none';
      }
      counterEl.textContent = `${validCount} of ${maxAllowed} screenshots`;
    }
    counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    const addBtn = $('addShot');
    if(addBtn){
      const atLimit = SHOTS.length >= maxAllowed;
      addBtn.disabled = atLimit;
      if(atLimit) addBtn.title = `${s === 'apple' ? 'App Store' : 'Google Play'} allows a maximum of ${maxAllowed} screenshots`;
      else addBtn.removeAttribute('title');
    }
  }

  if(fromMode === toMode){
    syncAllVtPills();
    return;
  }

  // 2. IMMEDIATELY SELECT DEVICE ON TABVIEW WITHOUT WAITING FOR ANIMATION (<1ms)
  let targetAppleDev = (appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
  let targetGoogleDev = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;

  // Immediately toggle active class on device selector buttons
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === targetAppleDev));
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === targetGoogleDev));

  // Show/hide device selector tabview immediately
  if (s === 'apple') {
    if ($('dt')) $('dt').style.display = 'flex';
    if ($('gdt')) $('gdt').style.display = 'none';
  } else if (s === 'google') {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'flex';
  }

  // Immediately update editor fields visibility and title for instant feedback
  $$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== s));
  if (s === 'apple') {
    if ($('ipadCard')) $('ipadCard').style.display = '';
  } else {
    if ($('ipadCard')) $('ipadCard').style.display = 'none';
  }
  if($('edTitle')) $('edTitle').textContent = 'App Identity';
  syncCategoryUI();
  if (typeof syncAgeUI === 'function') syncAgeUI();

  // Immediately synchronize active device tabview pill (<16ms)
  requestAnimationFrame(() => {
    if(s === 'apple') syncVtPill($('dt'));
    else if(s === 'google') syncVtPill($('gdt'));
    syncAllVtPills();
  });

  const applyStoreMode = () => {
    if (!preserveDual) {
      document.body.dataset.dual = 'false';
      if(appleDevice === 'dual') appleDevice = 'iphone';
      if(googleDevice === 'dual') googleDevice = 'phone';
    }
    store = s;
    document.body.dataset.store = s;
    document.body.dataset.appleDevice = (appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
    document.body.dataset.googleDevice = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;

    const isDual = document.body.dataset.dual === 'true';
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.toggle('on', isDual);
      btn.setAttribute('aria-checked', isDual ? 'true' : 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = isDual ? 'inline-flex' : 'none';

    const iconLabel = $('iconSpecLabel');
    const iconHint = $('iconSpecHint');
    if(iconLabel && iconHint){
      if(s === 'google'){
        iconLabel.innerHTML = 'App Icon (512×512 px) <span class="tag g">GOOGLE</span>';
        iconHint.innerHTML = '32-bit PNG · 1:1 Square · Max 1024 KB';
      } else {
        iconLabel.innerHTML = 'App Icon (1024×1024 px) <span class="tag a">APPLE</span>';
        iconHint.innerHTML = 'PNG · 1:1 Square · 100% Opaque';
      }
    }

      // Sync icon variant according to active store
      let iconChanged = false;
      if(typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON){
        if(s === 'google'){
          if(typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512 && ICON !== CUSTOM_ICON_512){
            ICON = CUSTOM_ICON_512;
            iconChanged = true;
          } else if(typeof ICON === 'string' && ICON.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(ICON)){
            const gIcon = ICON.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png');
            if(ICON !== gIcon){
              if(typeof CUSTOM_ICON_1024 !== 'undefined' && !CUSTOM_ICON_1024) CUSTOM_ICON_1024 = ICON;
              ICON = gIcon;
              if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = gIcon;
              iconChanged = true;
            }
          } else if(typeof downscaleIconTo512 === 'function' && ICON && (!CUSTOM_ICON_512 || CUSTOM_ICON_512 === ICON)){
            if(typeof CUSTOM_ICON_1024 !== 'undefined' && !CUSTOM_ICON_1024) CUSTOM_ICON_1024 = ICON;
            downscaleIconTo512(ICON, d512 => {
              if(d512 && d512 !== ICON){
                if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
                if(store === 'google'){
                  ICON = d512;
                  if(typeof renderIcons === 'function') renderIcons();
                  if(typeof validateAppIcon === 'function') validateAppIcon();
                }
              }
            });
          }
        } else if(s === 'apple'){
          if(typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024 && ICON !== CUSTOM_ICON_1024){
            ICON = CUSTOM_ICON_1024;
            iconChanged = true;
          } else if(typeof ICON === 'string' && ICON.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(ICON)){
            const aIcon = ICON.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png');
            if(ICON !== aIcon){
              if(typeof CUSTOM_ICON_512 !== 'undefined' && !CUSTOM_ICON_512) CUSTOM_ICON_512 = ICON;
              ICON = aIcon;
              if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = aIcon;
              iconChanged = true;
            }
          }
        }
      } else {
        // Preset icon variant sync
        if(typeof BLANK_ICON !== 'undefined' && (ICON === BLANK_ICON || (typeof BLANK_ICON_1024 !== 'undefined' && ICON === BLANK_ICON_1024) || (typeof BLANK_ICON_512 !== 'undefined' && ICON === BLANK_ICON_512))){
          if(s === 'apple' && typeof BLANK_ICON_1024 !== 'undefined' && BLANK_ICON_1024){ ICON = BLANK_ICON_1024; iconChanged = true; }
          else if(s === 'google' && typeof BLANK_ICON_512 !== 'undefined' && BLANK_ICON_512){ ICON = BLANK_ICON_512; iconChanged = true; }
        } else if(typeof PRESETS !== 'undefined'){
          for(const k in PRESETS){
            const p = PRESETS[k];
            if(p && (p.icon === ICON || p.icon1024 === ICON || p.icon512 === ICON)){
              if(s === 'apple' && p.icon1024){ ICON = p.icon1024; iconChanged = true; }
              else if(s === 'google' && p.icon512){ ICON = p.icon512; iconChanged = true; }
              break;
            }
          }
        }
      }

      if(iconChanged && typeof renderIcons === 'function'){
        renderIcons();
      } else if(typeof validateAppIcon === 'function'){
        validateAppIcon();
      }

      if(s === 'apple'){
        if($('ipadCard')) $('ipadCard').style.display = '';
      } else {
        if($('ipadCard')) $('ipadCard').style.display = 'none';
      }
      if(typeof validateScreenshots === 'function') validateScreenshots();
      if(typeof validateTabletShots === 'function') validateTabletShots();
      if(typeof renderShots === 'function') renderShots();
    if(typeof saveState === 'function') saveState(false);
  };

  transitionStoreMode(fromMode, toMode, applyStoreMode, animate);
}

function setView(v, force = false){
  const stageMenu = $('vt');
  if(stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');

  const activeBtn = document.querySelector('#vt button[data-v].on') || document.querySelector('#vt button.on');
  const activeView = activeBtn ? activeBtn.dataset.v : null;
  if (!force && activeView === v) return;

  $$('#vt button[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v));

  // Maintain Dual Phone selected state in comparison section
  const isDual = document.body.dataset.dual === 'true';
  const btnDual = $('btnDualPhone');
  if (btnDual) {
    btnDual.classList.toggle('on', isDual);
    btnDual.setAttribute('aria-checked', isDual ? 'true' : 'false');
  }
  const badge = $('stageDualBadge');
  if (badge) badge.style.display = isDual ? 'inline-flex' : 'none';

  syncAllVtPills();

  // Sync stage view dropdown label and icon
  const lbl = $('stageViewLabel');
  if(lbl) lbl.textContent = v === 'search' ? 'Search Result' : 'Detail View';
  const ico = $('stageViewIco');
  if(ico){
    if(v === 'search'){
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.5" y1="15.5" x2="21" y2="21"></line></svg>';
    } else {
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><rect x="7" y="7" width="4" height="4" rx="1"></rect><line x1="14" y1="7.5" x2="17" y2="7.5"></line><line x1="14" y1="10.5" x2="16" y2="10.5"></line><line x1="7" y1="15" x2="17" y2="15"></line><line x1="7" y1="18" x2="13" y2="18"></line></svg>';
    }
  }

  $$('.phone [data-v]').forEach(e => {
    if(e.dataset.v === v){
      e.style.display = 'block';
      e.classList.remove('view-enter');
      void e.offsetWidth; // force reflow for smooth re-animation
      e.classList.add('view-enter');
      setTimeout(() => e.classList.remove('view-enter'), 240);
    } else {
      e.style.display = 'none';
    }
  });
  document.querySelectorAll('.phone.apple .tab').forEach(tabBar => {
    const items = tabBar.querySelectorAll(':scope > div');
    if(items.length >= 5){
      items.forEach(t => t.classList.remove('on'));
      if(v === 'search'){
        items[4].classList.add('on');
      } else {
        items[2].classList.add('on');
      }
    }
  });
  document.querySelectorAll('.phone.google .gnav').forEach(navBar => {
    const items = navBar.querySelectorAll(':scope > div');
    if(items.length >= 4){
      items.forEach(t => t.classList.remove('on'));
      if(v === 'search'){
        items[2].classList.add('on');
      } else {
        items[1].classList.add('on');
      }
    }
  });
  if(typeof syncAppleNavScroll === 'function') syncAppleNavScroll();
}

$$('.seg button').forEach(b => b.onclick = () => setStore(b.dataset.s));
$$('#vt button[data-v]').forEach(b => b.onclick = () => setView(b.dataset.v));

// Dual Phone Comparison Toggle on Stage Bottom Bar
function toggleDualPhone(forceState) {
  const isCurrentlyDual = document.body.dataset.dual === 'true';
  const nextDual = typeof forceState === 'boolean' ? forceState : !isCurrentlyDual;

  const btn = $('btnDualPhone');
  if (btn) {
    btn.classList.toggle('on', nextDual);
    btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
  }
  const badge = $('stageDualBadge');
  if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';

  const activeStore = (typeof store !== 'undefined' && (store === 'apple' || store === 'google')) ? store : 'apple';

  const applyDualState = () => {
    document.body.dataset.dual = nextDual ? 'true' : 'false';
    if (nextDual) {
      appleDevice = 'dual';
      googleDevice = 'dual';
    } else {
      appleDevice = 'iphone';
      googleDevice = 'phone';
    }
    document.body.dataset.appleDevice = 'iphone';
    document.body.dataset.googleDevice = 'phone';
    if (btn) {
      btn.classList.toggle('on', nextDual);
      btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
    }
    if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';

    // Auto select Phone on device selector
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === 'iphone'));
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === 'phone'));

    // Keep the active device selector visible
    if (activeStore === 'apple') {
      if ($('dt')) $('dt').style.display = 'flex';
      if ($('gdt')) $('gdt').style.display = 'none';
      if ($('dt')) syncVtPill($('dt'));
    } else {
      if ($('dt')) $('dt').style.display = 'none';
      if ($('gdt')) $('gdt').style.display = 'flex';
      if ($('gdt')) syncVtPill($('gdt'));
    }

    if (typeof renderIcons === 'function') renderIcons();
    if (typeof renderShots === 'function') renderShots();
    if (typeof update === 'function') update();
    if (typeof fit === 'function') fit();
    syncAllVtPills();
    if (typeof saveState === 'function') saveState(false);
  };

  // Immediate device selector update (<1ms)
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === 'iphone'));
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === 'phone'));
  if (activeStore === 'apple') {
    if ($('dt')) $('dt').style.display = 'flex';
    if ($('gdt')) $('gdt').style.display = 'none';
    if ($('dt')) syncVtPill($('dt'));
  } else {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'flex';
    if ($('gdt')) syncVtPill($('gdt'));
  }
  syncAllVtPills();

  if (typeof transitionStoreMode === 'function') {
    if (nextDual) {
      transitionStoreMode(activeStore, 'dual', applyDualState);
    } else {
      transitionStoreMode('dual', activeStore, applyDualState);
    }
  } else {
    applyDualState();
  }
}

function setupHoverDropdown(containerId, btnId, menuId) {
  const container = $(containerId);
  const btn = $(btnId);
  const menu = $(menuId);
  if (!container || !menu) return;

  let closeTimer = null;

  container.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    $$('.menu').forEach(m => { if (m !== menu) m.classList.remove('show'); });
    menu.classList.add('show');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  });

  container.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => {
      menu.classList.remove('show');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }, 150);
  });

  menu.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      menu.classList.remove('show');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
}

if ($('btnStageView')) {
  setupDropdown('btnStageView', 'vt');
  setupHoverDropdown('stageViewDropdown', 'btnStageView', 'vt');
}

if ($('btnAppleDevice')) {
  setupDropdown('btnAppleDevice', 'menuAppleDevice');
  setupHoverDropdown('dt', 'btnAppleDevice', 'menuAppleDevice');
}

if ($('btnGoogleDevice')) {
  setupDropdown('btnGoogleDevice', 'menuGoogleDevice');
  setupHoverDropdown('gdt', 'btnGoogleDevice', 'menuGoogleDevice');
}

if ($('btnExport')) {
  setupHoverDropdown('workspaceExportDropdown', 'btnExport', 'menuExport');
}

if ($('btnDualPhone')) {
  $('btnDualPhone').onclick = () => {
    toggleDualPhone();
    const stageMenu = $('vt');
    if (stageMenu) stageMenu.classList.remove('show');
  };
}

// Auto-close stage view dropdown whenever any item is clicked
$$('#vt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('vt');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

// Auto-close Apple & Google device dropdowns when item is clicked
$$('#dt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('menuAppleDevice');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

$$('#gdt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('menuGoogleDevice');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

// Mockup Light / Dark theme controller
function setDeviceTheme(theme, save = true){
  const t = theme === 'dark' ? 'dark' : 'light';
  $$('.phone').forEach(p => p.dataset.theme = t);
  const btnL = $('themeLight');
  const btnD = $('themeDark');
  if(btnL) btnL.classList.toggle('on', t === 'light');
  if(btnD) btnD.classList.toggle('on', t === 'dark');
  syncVtPill($('theme'));
  try{
    localStorage.setItem('store_preview_studio_device_theme', t);
  }catch(e){}
  if(save && typeof saveState === 'function') saveState(false);
}

if($('themeLight')) $('themeLight').onclick = () => setDeviceTheme('light');
if($('themeDark')) $('themeDark').onclick = () => setDeviceTheme('dark');
if($('theme') && !$('themeLight')){
  $('theme').onclick = () => {
    const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
    setDeviceTheme(cur === 'dark' ? 'light' : 'dark');
  };
}

// Sync theme segment indicator to saved or initial mockup theme
function initDeviceTheme(){
  let saved = null;
  try{
    saved = localStorage.getItem('store_preview_studio_device_theme');
  }catch(e){}
  const defaultTheme = document.documentElement.dataset.ui === 'dark' ? 'dark' : 'light';
  const cur = saved || (document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || defaultTheme) : defaultTheme);
  setDeviceTheme(cur, false);
}
initDeviceTheme();
setTimeout(initDeviceTheme, 0);



/* =========================================================================
   Module: src/js/apple/apple.js
   ========================================================================= */
// Store Preview Studio · Apple App Store & Devices
// --- Apple Device Mode & Store Switchers ---
let appleDevice = 'dual'; // 'iphone' | 'ipad' | 'dual'

function setAppleDevice(d, animate = true){
  const stageMenu = $('menuAppleDevice');
  if(stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');
  if(d !== 'ipad' && d !== 'dual') d = 'iphone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = d === 'dual';
  if(appleDevice === d && document.body.dataset.appleDevice === d && wasDual === nextDual){
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    syncAllVtPills();
    return;
  }
  const applyState = () => {
    appleDevice = d;
    document.body.dataset.appleDevice = d === 'dual' ? 'iphone' : d;
    document.body.dataset.dual = nextDual ? 'true' : 'false';
    if(nextDual){
      googleDevice = 'dual';
    } else if(wasDual && googleDevice === 'dual'){
      googleDevice = 'phone';
      document.body.dataset.googleDevice = 'phone';
    }
    const selApple = (d === 'dual' || !d) ? 'iphone' : d;
    const selGoogle = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === selApple));
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === selGoogle));
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === 'apple'));
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.toggle('on', nextDual);
      btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';
    renderIcons();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    update();
    syncAppleNavScroll();
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    if(typeof saveState === 'function') saveState(false);
  };
  if(nextDual || wasDual){
    clearDevTransitions();
    applyState();
    fit();
    syncAllVtPills();
    return;
  }
  transitionDevice('apple', d, applyState, animate);
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
  if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
  syncAllVtPills();
}
$$('#dt [data-d]').forEach(b => b.onclick = () => setAppleDevice(b.dataset.d));

// iOS App Icon Info Popover
initInfoPopover("iosIconInfoBtn", "iosIconInfoPop", "iosIconInfoClose", "apple");

// --- iPhone Detail View Header Dynamic Scroll Animation ---
function syncAppleNavScroll(){
  document.querySelectorAll('.phone.apple:not(.ipad) .scr').forEach(scr => {
    const nav = scr.querySelector('.a-nav');
    if(nav) nav.classList.toggle('scrolled', scr.scrollTop > 45);
  });
}

function initAppleNavScroll(){
  document.querySelectorAll('.phone.apple:not(.ipad) .scr').forEach(scr => {
    const nav = scr.querySelector('.a-nav');
    if(!nav) return;

    scr.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', scr.scrollTop > 45);
    }, { passive: true });
    nav.classList.toggle('scrolled', scr.scrollTop > 45);

    const backBtn = nav.querySelector('.a-nav-back');
    if(backBtn){
      backBtn.addEventListener('click', () => {
        if(scr.scrollTop > 0){
          scr.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  });
}
initAppleNavScroll();

// --- iPad Floating Bottom Pill on Scroll ---
function initIpadFloatingPill(){
  const ipadScr = document.querySelector('.phone.ipad .scr');
  const pill = document.getElementById('ipadFloatingPill');
  if(!ipadScr || !pill) return;

  ipadScr.addEventListener('scroll', () => {
    pill.classList.toggle('visible', ipadScr.scrollTop > 180);
  }, { passive: true });
  pill.classList.toggle('visible', ipadScr.scrollTop > 180);
}
initIpadFloatingPill();

// --- iPhone Tab Navigation Interactive Switcher ---
function initAppleTabs(){
  document.querySelectorAll('.dev.apple .tab').forEach(tabBar => {
    const items = tabBar.querySelectorAll(':scope > div');
    if(items.length >= 5){
      items[2].addEventListener('click', () => {
        if(typeof setView === 'function') setView('detail');
      });
      items[4].addEventListener('click', () => {
        if(typeof setView === 'function') setView('search');
      });
    }
  });

  // Clicking Search Clear button (X) returns to Detail View
  document.querySelectorAll('.sr-search-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof setView === 'function') setView('detail');
    });
  });
}
initAppleTabs();





/* =========================================================================
   Module: src/js/modules/theme.js
   ========================================================================= */
// Store Preview Studio · Theme & Motion Controller
// --- Page (UI) Theme: Light / Dark ---
function applyUiTheme(t){
  document.documentElement.dataset.ui = t;
  const ico = $('icoUi');
  if(ico){
    if(t === 'light'){
      ico.className = 'btn-ico ico-ui';
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" fill="currentColor"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
    } else {
      ico.className = 'btn-ico ico-ui dark';
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }
  // Synchronize placeholder skeleton images to match current UI theme
  if(typeof renderFeature === 'function') renderFeature();
  if(typeof renderShots === 'function') renderShots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(typeof renderTabShots === 'function') renderTabShots();
}
applyUiTheme(document.documentElement.dataset.ui || 'light');
$('btnUi').onclick = () => {
  const next = document.documentElement.dataset.ui === 'light' ? 'dark' : 'light';
  applyUiTheme(next);
  try{ localStorage.setItem('store_preview_studio_ui', next); }catch(e){}
};

// Status-bar clocks stay fixed at 9:41 (the HTML text) so previews and exported images always match.

// Illustrative stats inputs
Object.entries(STAT_INPUTS).forEach(([k,id]) => {
  const el = $(id);
  if(!el) return;
  const onStatChange = () => {
    STATS[k] = el.value.trim();
    if (k === 'age' && typeof syncAgeUI === 'function') syncAgeUI();
    if (k === 'iap' && typeof syncIapUI === 'function') syncIapUI();
    renderStats();
    debouncedSave();
  };
  el.addEventListener('input', onStatChange);
  el.addEventListener('change', onStatChange);
});
const stWmEl = $('f-st-wm');
if(stWmEl) stWmEl.addEventListener('change', () => { EXPORT_WM = stWmEl.checked; debouncedSave(); });

// Smooth, Hardware-Accelerated Drag-to-Scroll & Intelligent Wheel for Carousels (.gal, .a-met)
function initSmoothCarousel(el) {
  if (!el || el._smoothCarouselInited) return;
  el._smoothCarouselInited = true;

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let rafId = null;

  const getZoom = () => {
    const dev = el.closest('.dev') || el;
    const computedZoom = parseFloat(getComputedStyle(dev).zoom);
    return (!isNaN(computedZoom) && computedZoom > 0) ? computedZoom : 1;
  };

  const stopMomentum = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only primary mouse button (left click)
    stopMomentum();
    isDown = true;
    el.classList.add('is-dragging');
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';

    const zoom = getZoom();
    startX = e.clientX / zoom;
    startScrollLeft = el.scrollLeft;
    lastX = startX;
    lastTime = performance.now();
    velocity = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const zoom = getZoom();
    const currentX = e.clientX / zoom;
    const deltaX = currentX - startX;
    el.scrollLeft = startScrollLeft - deltaX;

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 8) {
      velocity = (currentX - lastX) / dt;
      lastX = currentX;
      lastTime = now;
    }
  });

  const onDragEnd = () => {
    if (!isDown) return;
    isDown = false;
    el.classList.remove('is-dragging');
    el.style.scrollSnapType = '';
    el.style.scrollBehavior = '';

    // Apply gentle kinetic momentum if released with velocity
    if (Math.abs(velocity) > 0.12) {
      let currentVelocity = velocity * 15;
      const friction = 0.92;
      const step = () => {
        if (Math.abs(currentVelocity) < 0.5 || isDown) {
          stopMomentum();
          return;
        }
        el.scrollLeft -= currentVelocity;
        currentVelocity *= friction;
        rafId = requestAnimationFrame(step);
      };
      stopMomentum();
      rafId = requestAnimationFrame(step);
    }
  };

  window.addEventListener('mouseup', onDragEnd);

  // Wheel handling:
  // 1. Two-finger horizontal trackpad gestures (deltaX) pass through untouched for 120Hz native compositor scrolling.
  // 2. Vertical mouse wheels only translate to horizontal scroll within bounds without locking vertical page scroll.
  el.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
      return; // Native trackpad horizontal scroll passes through
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 2) return;

    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft >= maxScroll - 1;

    if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
      e.preventDefault();
      stopMomentum();
      el.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

function initAllCarousels() {
  $$('.gal, .a-met').forEach(initSmoothCarousel);
}
initAllCarousels();



/* =========================================================================
   Module: src/js/modules/header.js
   ========================================================================= */
// Store Preview Studio · Header Component Module
// Encapsulates Sidebar Toggle, Store Switcher, and Header Dropdown Navigation

function initHeader() {
  // 1. Sidebar Collapse / Expand Toggle is handled in core/resizer.js

  // 2. Store Switcher (App Store vs Google Play Segmented Control)
  const storeBtns = $$('.seg button');
  storeBtns.forEach(btn => {
    btn.onclick = () => {
      const targetStore = btn.dataset.s;
      if (targetStore && typeof setStore === 'function') {
        setStore(targetStore);
      }
    };
  });

  // 3. Header Dropdowns (Presets Menu & Export Menu)
  if (typeof setupDropdown === 'function') {
    if ($('btnPresets')) setupDropdown('btnPresets', 'menuPresets');
    setupDropdown('btnExport', 'menuExport');
  }

  // 3b. Sample Templates Modal Dialog Controller
  const optOpenTemplates = $('optOpenTemplatesModal');
  const templatesModal = $('templatesModal');
  const closeTemplatesBtn = $('templatesModalClose');
  const closeTemplatesX = $('templatesModalCloseX');

  function openTemplatesDialog() {
    if (!templatesModal) return;
    templatesModal.classList.add('open');
    templatesModal.setAttribute('aria-hidden', 'false');
    $$('.menu').forEach(m => m.classList.remove('show'));
  }

  function closeTemplatesDialog() {
    if (!templatesModal) return;
    templatesModal.classList.remove('open');
    templatesModal.setAttribute('aria-hidden', 'true');
  }

  if (optOpenTemplates) {
    optOpenTemplates.onclick = () => openTemplatesDialog();
  }

  if (closeTemplatesBtn) closeTemplatesBtn.onclick = () => closeTemplatesDialog();
  if (closeTemplatesX) closeTemplatesX.onclick = () => closeTemplatesDialog();

  if (templatesModal) {
    templatesModal.onclick = (e) => {
      if (e.target === templatesModal) closeTemplatesDialog();
    };
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && templatesModal && templatesModal.classList.contains('open')) {
      closeTemplatesDialog();
    }
  });

  // 4. Global Keyboard Dismissal for Header Dropdowns (ESC key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.menu.show').forEach(m => m.classList.remove('show'));
    }
  });

  // 5. Editor Large Cards Accordion Controller (Expand / Collapse & Selected state)
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.card-header');
    if (header) {
      if (e.target.closest('.info-tip-btn, button:not(.card-toggle-btn), a, input, select, textarea')) {
        return;
      }
      const card = header.closest('.card');
      if (card) {
        const wasCollapsed = card.classList.contains('collapsed');
        card.classList.toggle('collapsed');
        
        // Card is selected only if it is expanded
        $$('.card').forEach(c => c.classList.remove('selected'));
        if (wasCollapsed) {
          card.classList.add('selected');
        }
      }
      return;
    }

    // Clicking anywhere inside an already expanded card body selects it
    const bodyCard = e.target.closest('.card');
    if (bodyCard && !bodyCard.classList.contains('collapsed')) {
      if (!bodyCard.classList.contains('selected')) {
        $$('.card').forEach(c => c.classList.remove('selected'));
        bodyCard.classList.add('selected');
      }
    }
  });

  // 6. Focusin inside an expanded card also updates selected state
  document.addEventListener('focusin', (e) => {
    const card = e.target.closest('.card');
    if (card && !card.classList.contains('collapsed') && !card.classList.contains('selected')) {
      $$('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
  });
}

// Auto-initialize header when DOM is ready or module is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}


/* =========================================================================
   Module: src/js/modules/presets.js
   ========================================================================= */
// Store Preview Studio · Preset Template Switcher
// --- Preset Switcher ---
const PRESET_ICONS = {
  none: BLANK_ICON,
  studio: STUDIO_ICON,
  taskflow: DEFAULT_ICON,
  pulsefit: PULSEFIT_ICON,
  zenmind: ZENMIND_ICON,
  /* @pro-only-start */
  cyberstrike: CYBER_ICON,
  edulearn: SKILL_ICON
  /* @pro-only-end */
};

function prewarmPresetIcons() {
  if (typeof rasterizeSvgToStorePng !== 'function') return;
  if (typeof BLANK_ICON === 'string' && (BLANK_ICON.startsWith('data:image/svg+xml') || BLANK_ICON.includes('<svg'))) {
    rasterizeSvgToStorePng(BLANK_ICON, 1024, png => {
      BLANK_ICON_1024 = png;
      if (!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'apple') {
        ICON = png;
        renderIcons();
      }
    });
    rasterizeSvgToStorePng(BLANK_ICON, 512, png => {
      BLANK_ICON_512 = png;
      if (!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'google') {
        ICON = png;
        renderIcons();
      }
    });
  }
  if (typeof PRESETS === 'object') {
    Object.keys(PRESETS).forEach(key => {
      const p = PRESETS[key];
      if (!p) return;
      if (typeof p.icon === 'string' && (p.icon.startsWith('data:image/svg+xml') || p.icon.includes('<svg'))) {
        rasterizeSvgToStorePng(p.icon, 1024, png1024 => {
          p.icon1024 = png1024;
          if (!IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key && store === 'apple') {
            ICON = png1024;
            renderIcons();
          }
        });
        rasterizeSvgToStorePng(p.icon, 512, png512 => {
          p.icon512 = png512;
          if (!IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key && store === 'google') {
            ICON = png512;
            renderIcons();
          }
        });
      }
      if (typeof rasterizeSvgToDimensions === 'function' && typeof p.feature === 'string' && (p.feature.startsWith('data:image/svg+xml') || p.feature.includes('<svg'))) {
        rasterizeSvgToDimensions(p.feature, 1024, 500, png1024x500 => {
          p.featurePng = png1024x500;
          if (CURRENT_PRESET_KEY === key) {
            FEATURE_GRAPHIC = png1024x500;
            renderFeature();
          }
        });
      }
    });
  }
}

function initPresetThumbnails() {
  $$('[data-preset]').forEach(b => {
    const key = b.dataset.preset;
    const img = b.querySelector('.preset-thumb');
    if (img && PRESET_ICONS[key]) {
      img.src = PRESET_ICONS[key];
    }
  });
  prewarmPresetIcons();
}
initPresetThumbnails();

$$('[data-preset]').forEach(b=>{
  b.onclick=()=>{
    const pKey=b.dataset.preset;
    loadPreset(pKey);
    $$('.menu').forEach(m => m.classList.remove('show'));
    const tModal = $('templatesModal');
    if (tModal) {
      tModal.classList.remove('open');
      tModal.setAttribute('aria-hidden', 'true');
    }
  };
});

function loadPreset(key){
  if(key === 'draft'){
    if(!userDraft || (typeof hasUserDraft === 'function' && !hasUserDraft())){
      const prevActivePreset = CURRENT_ACTIVE_PRESET;
      loadPreset('none');
      CURRENT_PRESET_KEY = 'draft';
      CURRENT_ACTIVE_PRESET = prevActivePreset;
      isPresetModified = false;
      userDraft = null;
      if(typeof updatePresetBanner === 'function') updatePresetBanner();
      if(typeof updateDraftPill === 'function') updateDraftPill();
      if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
      return;
    }
    CURRENT_PRESET_KEY = 'draft';
    isPresetModified = false;
    if(userDraft){
      restoring = true;
      try{
        applyStateObject(userDraft);
      }finally{
        restoring = false;
      }
      renderIcons();
      renderFeature();
      renderShots();
      renderIpadShots();
      renderTablets();
      syncStatInputs();
      renderStats();
      if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
      if(typeof applyTabOrient === 'function') applyTabOrient();
      update();
      fit();
    }
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
    return;
  }

  // Before switching to a preset, if we were in draft mode with real edits, ensure draft is persisted
  if(CURRENT_PRESET_KEY === 'draft' && key !== 'none'){
    if(typeof hasUserDraft === 'function' && hasUserDraft()){
      userDraft = getCurrentStateObject();
      userDraft.isCustomized = true;
      if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
    }
  }

  CURRENT_ACTIVE_PRESET = key;
  CURRENT_PRESET_KEY = key;
  isPresetModified = false;
  if(key === 'none'){
    ['icoFile', 'featureFile', 'shotFile', 'ipadShotFile', 'tab7File', 'tab10File'].forEach(id => {
      const el = $(id);
      if(el) el.value = '';
    });
    if(typeof THUMB_CACHE !== 'undefined' && THUMB_CACHE && typeof THUMB_CACHE.clear === 'function'){
      THUMB_CACHE.clear();
    }
    if(typeof setSupportsIpad === 'function'){
      setSupportsIpad(false);
    }
    $('f-name').value = '';
    $('f-sub').value = '';
    $('f-promo').value = '';
    $('f-short').value = '';
    $('f-dev').value = '';
    setCategory('');
    if($('f-ver')) $('f-ver').value = '1.0.0';
    if($('f-rdate')) $('f-rdate').value = getCurrentMonthDateStr(2, true);
    if($('f-email')) $('f-email').value = '';
    if($('f-phone')) $('f-phone').value = '';
    if($('f-addr')) $('f-addr').value = '';
    const defaultPrivLinked = '';
    const defaultPrivNotLinked = '';
    const defaultPrivGoogle = 'No data shared with third parties, No data collected, Data is encrypted in transit';
    if($('f-priv-linked')) $('f-priv-linked').value = defaultPrivLinked;
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = defaultPrivNotLinked;
    if($('f-priv-google')) $('f-priv-google').value = defaultPrivGoogle;
    CURRENT_PRIVACY = { linked: defaultPrivLinked, notLinked: defaultPrivNotLinked, google: defaultPrivGoogle };
    $('f-new').value = '';
    $('f-desc').value = '';
    IS_CUSTOM_ICON = false;
    CUSTOM_ICON_1024 = '';
    CUSTOM_ICON_512 = '';
    ICON_FILE_SIZE = 0; ICON_FILE_TYPE = ''; ICON_FILE_NAME = '';
    if (store === 'apple' && BLANK_ICON_1024) {
      ICON = BLANK_ICON_1024;
    } else if (store === 'google' && BLANK_ICON_512) {
      ICON = BLANK_ICON_512;
    } else {
      ICON = BLANK_ICON;
    }
    if(typeof rasterizeSvgToStorePng === 'function' && typeof BLANK_ICON === 'string' && (BLANK_ICON.startsWith('data:image/svg+xml') || BLANK_ICON.includes('<svg'))){
      if(!BLANK_ICON_1024){
        rasterizeSvgToStorePng(BLANK_ICON, 1024, png => {
          BLANK_ICON_1024 = png;
          if(!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'apple'){
            ICON = png;
            renderIcons();
          }
        });
      }
      if(!BLANK_ICON_512){
        rasterizeSvgToStorePng(BLANK_ICON, 512, png => {
          BLANK_ICON_512 = png;
          if(!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'google'){
            ICON = png;
            renderIcons();
          }
        });
      }
    }
    FEATURE_GRAPHIC = BLANK_FEATURE;
    IS_CUSTOM_FEATURE = false;
    FEATURE_FILE_SIZE = 0; FEATURE_FILE_TYPE = ''; FEATURE_FILE_NAME = '';
    SHOTS = [];
    IPAD_SHOTS = [];
    REVIEWS = [
      {
        author: 'Alex Morgan',
        avatar: 'A',
        avatarBg: '#0284c7',
        stars: 5,
        title: 'Intuitive & beautifully designed',
        text: 'Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction.',
        helpful: 84
      },
      {
        author: 'Jordan Lee',
        avatar: 'J',
        avatarBg: '#8b5cf6',
        stars: 5,
        title: 'Reliable and well built',
        text: 'Fast performance, thoughtful details, and easy to navigate. Quickly became an essential tool in my workflow.',
        helpful: 52
      }
    ];
    TABS.tab7 = []; TABS.tab10 = [];
    Object.assign(STATS, STATS_DEFAULT);
    syncStatInputs();
    renderStats();
    renderTablets();
    renderIcons();
    renderFeature();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    renderReviews();
  if(typeof syncReviewInputs === 'function') syncReviewInputs();
    if(typeof syncReviewInputs === 'function') syncReviewInputs();
    update();
    if(CURRENT_PRESET_KEY === 'draft'){
      saveState();
    }
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
    setTimeout(() => {
      const el = $('f-name');
      if(el) el.focus({ preventScroll: true });
    }, 50);
    return;
  }
  const p = PRESETS[key];
  if(!p) return;
  $('f-name').value = p.name;
  $('f-sub').value = p.sub;
  $('f-promo').value = p.promo;
  $('f-short').value = p.short;
  $('f-dev').value = p.dev;
  setCategory(p.category);
  if($('f-ver')) $('f-ver').value = (p && p.ver) ? p.ver : (key === 'studio' ? '2.1.0' : (key === 'cyberstrike' ? '4.2.0' : (key === 'pulsefit' ? '3.1.2' : (key === 'zenmind' ? '1.8.0' : (key === 'edulearn' ? '4.1.0' : '2.4.0')))));
  if($('f-rdate')) $('f-rdate').value = (p && p.rdate) ? p.rdate : getCurrentMonthDateStr(2, true);
  if($('f-email')) $('f-email').value = (p && p.email) ? p.email : (key === 'studio' ? 'support@previewstudio.app' : (key === 'cyberstrike' ? 'support@omniarcade.games' : (key === 'pulsefit' ? 'support@pulsefit.io' : (key === 'zenmind' ? 'hello@zenmind.app' : (key === 'edulearn' ? 'support@skillsphere.edu' : 'support@flowcraft.studio')))));
  if($('f-phone')) $('f-phone').value = (p && p.phone) ? p.phone : (key === 'studio' ? '+1 800-555-0199' : (key === 'cyberstrike' ? '+81 3 5555 0188' : (key === 'pulsefit' ? '+1 888-555-0142' : (key === 'zenmind' ? '+1 800-555-0177' : (key === 'edulearn' ? '+44 20 7946 0912' : '+1 800-555-0199')))));
  if($('f-addr')) $('f-addr').value = (p && p.addr) ? p.addr : (key === 'studio' ? 'San Francisco, CA' : (key === 'cyberstrike' ? 'Tokyo, Japan' : (key === 'edulearn' ? 'San Francisco, CA' : 'Vietnam')));
  if($('f-priv-linked')) $('f-priv-linked').value = p.privLinked || '';
  if($('f-priv-notlinked')) $('f-priv-notlinked').value = p.privNotLinked || '';
  if($('f-priv-google')) $('f-priv-google').value = p.privGoogle || '';
  CURRENT_PRIVACY = {
    linked: p.privLinked || '',
    notLinked: p.privNotLinked || '',
    google: p.privGoogle || ''
  };
  if(p.stats){
    Object.assign(STATS, p.stats);
    syncStatInputs(); renderStats();
  } else if(key === 'cyberstrike'){
    STATS.rating = '4.9'; STATS.count = '48.5K'; STATS.dl = '100K+'; STATS.rank = '2'; STATS.size = '1.8 GB';
    STATS.age = '12+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  } else if(key === 'edulearn'){
    STATS.rating = '4.8'; STATS.count = '145K'; STATS.dl = '5M+'; STATS.rank = '1'; STATS.size = '98 MB';
    STATS.age = '4+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  } else {
    STATS.rating = '4.9'; STATS.count = '1.8K'; STATS.dl = '50K+'; STATS.rank = '1'; STATS.size = '86 MB';
    STATS.age = '4+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  }
  $('f-new').value = p.whatsNew;
  $('f-desc').value = p.desc;
  IS_CUSTOM_ICON = false;
  CUSTOM_ICON_1024 = '';
  CUSTOM_ICON_512 = '';
  ICON_FILE_SIZE = 0; ICON_FILE_TYPE = ''; ICON_FILE_NAME = '';
  ['icoFile', 'featureFile', 'shotFile', 'ipadShotFile', 'tab7File', 'tab10File'].forEach(id => {
    const el = $(id);
    if(el) el.value = '';
  });
  if (store === 'apple' && p.icon1024) {
    ICON = p.icon1024;
  } else if (store === 'google' && p.icon512) {
    ICON = p.icon512;
  } else {
    ICON = p.icon;
  }
  if(typeof rasterizeSvgToStorePng === 'function' && typeof p.icon === 'string' && (p.icon.startsWith('data:image/svg+xml') || p.icon.includes('<svg'))){
    if(!p.icon1024){
      rasterizeSvgToStorePng(p.icon, 1024, png1024 => {
        p.icon1024 = png1024;
        if(store === 'apple' && !IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key){
          ICON = png1024;
          renderIcons();
        }
      });
    }
    if(!p.icon512){
      rasterizeSvgToStorePng(p.icon, 512, png512 => {
        p.icon512 = png512;
        if(store === 'google' && !IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key){
          ICON = png512;
          renderIcons();
        }
      });
    }
  }
  IS_CUSTOM_FEATURE = false;
  FEATURE_GRAPHIC = p.featurePng || p.feature || DEFAULT_FEATURE;
  if(typeof rasterizeSvgToDimensions === 'function' && typeof p.feature === 'string' && (p.feature.startsWith('data:image/svg+xml') || p.feature.includes('<svg'))){
    if(!p.featurePng){
      rasterizeSvgToDimensions(p.feature, 1024, 500, png1024x500 => {
        p.featurePng = png1024x500;
        if(CURRENT_PRESET_KEY === key){
          FEATURE_GRAPHIC = png1024x500;
          renderFeature();
        }
      });
    }
  }
  SHOTS = [...p.shots];
  IPAD_SHOTS = [];
  if(typeof setSupportsIpad === 'function'){
    setSupportsIpad(!!p.supportsIpad);
  }
  REVIEWS = p.reviews ? JSON.parse(JSON.stringify(p.reviews)) : [];
  TABS.tab7 = []; TABS.tab10 = [];
  renderTablets();
  renderIcons();
  renderFeature();
  renderShots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  renderReviews();
  if(typeof syncReviewInputs === 'function') syncReviewInputs();
  update();
  if(CURRENT_PRESET_KEY === 'draft'){
    saveState();
  }
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
}

const btnCopyPresetToDraft = $('btnCopyPresetToDraft');
if(btnCopyPresetToDraft){
  btnCopyPresetToDraft.onclick = () => {
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
    const activeKey = (CURRENT_PRESET_KEY !== 'draft' && CURRENT_PRESET_KEY) ? CURRENT_PRESET_KEY : CURRENT_ACTIVE_PRESET;
    if(activeKey && typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[activeKey]){
      if(!IS_CUSTOM_ICON) userDraft.icon = PRESET_ICONS[activeKey];
    }
    if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
    CURRENT_PRESET_KEY = 'draft';
    isPresetModified = false;
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
    if(typeof showToast === 'function') showToast('Preset copied as your draft!', 'ok');
  };
}

const btnReturn = $('btnReturnToDraft');
if(btnReturn){
  btnReturn.onclick = () => {
    loadPreset('draft');
  };
}

function closePresetPill(){
  CURRENT_ACTIVE_PRESET = null;
  if(CURRENT_PRESET_KEY !== 'draft'){
    if(typeof hasUserDraft === 'function' && hasUserDraft()){
      loadPreset('draft');
    } else {
      loadPreset('none');
    }
  } else {
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
  }
}

const btnDraft = $('btnDraft');
if(btnDraft){
  btnDraft.onclick = () => {
    const ev = window.event;
    if(ev && ev.target && ev.target.closest && ev.target.closest('#msPillResetBtn')) return;
    if(CURRENT_PRESET_KEY !== 'draft'){
      loadPreset('draft');
    }
    // Automatically open Card 1 App Identity
    const card = $('identityCard');
    if(card){
      card.classList.remove('collapsed');
      $$('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const editorEl = document.querySelector('.editor');
      if(editorEl && typeof editorEl.scrollTo === 'function'){
        editorEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    if(document.body && document.body.classList.contains('sidebar-collapsed')){
      document.body.classList.remove('sidebar-collapsed');
      try{ localStorage.setItem('sps_sidebar_collapsed', '0'); }catch(e){}
    }
    const nameInput = $('f-name');
    if(nameInput) nameInput.focus({ preventScroll: true });
  };
}

const btnPresetPill = $('btnPresetPill');
if(btnPresetPill){
  btnPresetPill.onclick = () => {
    const ev = window.event;
    if(ev && ev.target && ev.target.closest && ev.target.closest('#presetPillCloseBtn')) return;
    if(CURRENT_PRESET_KEY === 'draft'){
      loadPreset(CURRENT_ACTIVE_PRESET || 'taskflow');
    } else {
      const tModal = $('templatesModal');
      if(tModal){
        tModal.classList.add('open');
        tModal.setAttribute('aria-hidden', 'false');
      }
    }
  };
}



/* =========================================================================
   Module: src/js/modules/export/storage.js
   ========================================================================= */
// Store Preview Studio - Storage & State Persistence (LocalStorage & IndexedDB)
const STORAGE_KEY = 'store_preview_studio_state_v2';
const DRAFT_STORAGE_KEY = 'sps_core_user_draft';
const DRAFT_FEATURE_THUMB_KEY = 'sps_draft_feature_thumb';
let userDraft = null;
let isPresetModified = false;
let saveTimer = null;
let restoring = false; // saveState() is a no-op while loadState() is applying saved values

// Download helper utility for export modules
function downloadFile(filename, content, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function debouncedSave(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 300);
}

function sanitizeStateForLocalStorage(state){
  if(!state || typeof state !== 'object') return state;
  const isHeavy = v => typeof v === 'string' && v.length > 50000;
  const clean = { ...state, _partial: true };
  if(isHeavy(clean.icon)) delete clean.icon;
  if(isHeavy(clean.featureGraphic)) delete clean.featureGraphic;
  if(Array.isArray(clean.shots)){
    clean.shots = clean.shots.filter(s => !isHeavy(s));
    if(!clean.shots.length) delete clean.shots;
  }
  if(Array.isArray(clean.ipadShots)){
    delete clean.ipadShots;
  }
  if(Array.isArray(clean.tab7Shots)){
    delete clean.tab7Shots;
  }
  if(Array.isArray(clean.tab10Shots)){
    delete clean.tab10Shots;
  }
  return clean;
}

function applyStateObject(s){
  if(!s || typeof s !== 'object') return false;
  const isSavedDual = s.appleDevice === 'dual' || s.googleDevice === 'dual';
  if(s.store) setStore(s.store, false, isSavedDual);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
  if(s.view && typeof setView === 'function') setView(s.view, true);
  if(s.theme && $$('.phone').length) (typeof setDeviceTheme === 'function' ? setDeviceTheme(s.theme, false) : $$('.phone').forEach(p => p.dataset.theme = s.theme));
  if(s.form){
    if(s.form.name !== undefined && $('f-name')) $('f-name').value = s.form.name;
    if(s.form.sub !== undefined && $('f-sub')) $('f-sub').value = s.form.sub;
    if(s.form.promo !== undefined && $('f-promo')) $('f-promo').value = s.form.promo;
    if(s.form.short !== undefined && $('f-short')) $('f-short').value = s.form.short;
    if(s.form.dev !== undefined && $('f-dev')) $('f-dev').value = s.form.dev;
    if(s.form.cat !== undefined) setCategory(s.form.cat);
    if(s.form.catApple !== undefined) setCategory(s.form.catApple, 'apple');
    if(s.form.catGoogle !== undefined) setCategory(s.form.catGoogle, 'google');
    if(s.form.ver !== undefined && $('f-ver')) $('f-ver').value = s.form.ver;
    if(s.form.rdate !== undefined && $('f-rdate')) $('f-rdate').value = s.form.rdate;
    if(s.form.email !== undefined && $('f-email')) $('f-email').value = s.form.email;
    if(s.form.phone !== undefined && $('f-phone')) $('f-phone').value = s.form.phone;
    if(s.form.addr !== undefined && $('f-addr')) $('f-addr').value = s.form.addr;
    if(s.form.privLinked !== undefined) {
      if($('f-priv-linked')) $('f-priv-linked').value = s.form.privLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = s.form.privLinked;
    }
    if(s.form.privNotLinked !== undefined) {
      if($('f-priv-notlinked')) $('f-priv-notlinked').value = s.form.privNotLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = s.form.privNotLinked;
    }
    if(s.form.privGoogle !== undefined) {
      if($('f-priv-google')) $('f-priv-google').value = s.form.privGoogle;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = s.form.privGoogle;
    }
    if(s.form.new !== undefined && $('f-new')) $('f-new').value = s.form.new;
    if(s.form.desc !== undefined && $('f-desc')) $('f-desc').value = s.form.desc;
  }
  if(s.icon1024) CUSTOM_ICON_1024 = s.icon1024;
  else if(s.iconApple) CUSTOM_ICON_1024 = s.iconApple;
  else if(s.icon && store === 'apple') CUSTOM_ICON_1024 = s.icon;

  if(s.icon512) CUSTOM_ICON_512 = s.icon512;
  else if(s.iconGoogle) CUSTOM_ICON_512 = s.iconGoogle;
  else if(s.icon && store === 'google') CUSTOM_ICON_512 = s.icon;

  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('bfd1fd') || s.icon.includes('d2c7fc') || s.icon.includes('c6-bg') || s.icon.includes('bp-bg') || s.icon.includes('blueprint')){
      ICON = BLANK_ICON;
      IS_CUSTOM_ICON = false;
      CUSTOM_ICON_1024 = '';
      CUSTOM_ICON_512 = '';
    } else {
      IS_CUSTOM_ICON = (s.isCustomIcon !== undefined) ? !!s.isCustomIcon : true;
      if(store === 'google' && (CUSTOM_ICON_512 || s.icon512 || s.iconGoogle)){
        ICON = CUSTOM_ICON_512 || s.icon512 || s.iconGoogle;
      } else if(store === 'apple' && (CUSTOM_ICON_1024 || s.icon1024 || s.iconApple)){
        ICON = CUSTOM_ICON_1024 || s.icon1024 || s.iconApple;
      } else {
        ICON = s.icon;
      }
    }
  }
  if(s.isCustomFeature !== undefined){
    IS_CUSTOM_FEATURE = !!s.isCustomFeature;
    if(IS_CUSTOM_FEATURE && s.featureGraphic && s.featureGraphic !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')){
      FEATURE_GRAPHIC = s.featureGraphic;
    } else {
      FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    }
  } else if(s.featureGraphic !== undefined){
    FEATURE_GRAPHIC = s.featureGraphic;
    IS_CUSTOM_FEATURE = !!(FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') && FEATURE_GRAPHIC !== (typeof DEFAULT_FEATURE !== 'undefined' ? DEFAULT_FEATURE : ''));
  } else if(s.feature !== undefined){
    FEATURE_GRAPHIC = s.feature;
    IS_CUSTOM_FEATURE = !!(FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') && FEATURE_GRAPHIC !== (typeof DEFAULT_FEATURE !== 'undefined' ? DEFAULT_FEATURE : ''));
  } else if(CURRENT_PRESET_KEY === 'draft'){
    FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    IS_CUSTOM_FEATURE = false;
  }
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)){
    SHOTS = s.shots;
  } else if(!s._partial && !Array.isArray(s.shots)){
    SHOTS = [];
  }
  if(typeof setSupportsIpad === 'function') setSupportsIpad(typeof s.supportsIpad === 'boolean' ? s.supportsIpad : false);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
  } else if(!s._partial){
    IPAD_SHOTS = [];
  }
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone' || s.googleDevice === 'dual') googleDevice = s.googleDevice;
  if(typeof tabOrient !== 'undefined'){
    tabOrient.tab7 = 'landscape';
    tabOrient.tab10 = 'landscape';
  }
  if(Array.isArray(s.tab7Shots) && typeof makeTabItem === 'function'){
    TABS.tab7 = s.tab7Shots.slice(0, MAX_TAB).map(makeTabItem);
  } else if(!s._partial){
    TABS.tab7 = [];
  }
  if(Array.isArray(s.tab10Shots) && typeof makeTabItem === 'function'){
    TABS.tab10 = s.tab10Shots.slice(0, MAX_TAB).map(makeTabItem);
  } else if(!s._partial){
    TABS.tab10 = [];
  }
  if(Array.isArray(s.reviews)){
    REVIEWS = s.reviews;
  } else if(!s._partial){
    REVIEWS = [];
  }
  if(typeof renderReviews === 'function') renderReviews();
  if(typeof syncReviewInputs === 'function') syncReviewInputs();
  if(typeof applyStatsFromObject === 'function') applyStatsFromObject(s.stats);
  return true;
}

function getCurrentStateObject(){
  const activeViewBtn = document.querySelector('#vt button[data-v].on');
  const currentView = activeViewBtn ? activeViewBtn.dataset.v : 'detail';
  return {
    store,
    appleDevice,
    view: currentView,
    theme: document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light',
    form: {
      name: $('f-name') ? $('f-name').value : '',
      sub: $('f-sub') ? $('f-sub').value : '',
      promo: $('f-promo') ? $('f-promo').value : '',
      short: $('f-short') ? $('f-short').value : '',
      dev: $('f-dev') ? $('f-dev').value : '',
      cat: $('f-cat') ? $('f-cat').value : '',
      catApple: CAT.apple,
      catGoogle: CAT.google,
      ver: $('f-ver') ? $('f-ver').value : '2.4.0',
      rdate: $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true),
      email: $('f-email') ? $('f-email').value : 'support@flowcraft.studio',
      phone: $('f-phone') ? $('f-phone').value : '+1 800-555-0199',
      addr: $('f-addr') ? $('f-addr').value : 'Vietnam',
      privLinked: $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : ''),
      privNotLinked: $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : ''),
      privGoogle: $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : ''),
      new: $('f-new') ? $('f-new').value : '',
      desc: $('f-desc') ? $('f-desc').value : ''
    },
    icon: (IS_CUSTOM_ICON && ICON) ? ICON : (ICON || (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY]) || BLANK_ICON),
    icon1024: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    icon512: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    iconApple: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    iconGoogle: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    isCustomIcon: !!(IS_CUSTOM_ICON && ICON && !ICON.includes('c6-bg') && !ICON.includes('bp-bg') && !ICON.includes('BLUEPRINT GRID')),
    featureGraphic: FEATURE_GRAPHIC,
    isCustomFeature: !!(typeof IS_CUSTOM_FEATURE !== 'undefined' && IS_CUSTOM_FEATURE && FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')),
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    googleDevice,
    tabOrient,
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    reviews: REVIEWS,
    stats: (typeof statsToObject === 'function') ? statsToObject() : {},
    isCustomized: true
  };
}

// True when a state object holds real user content (text, screenshots or a custom icon).
function stateHasUserContent(d){
  if(d && typeof d === 'object'){
    const f = d.form || {};
    const hasText = !!((f.name && f.name.trim()) || (f.sub && f.sub.trim()) || (f.short && f.short.trim()) || (f.desc && f.desc.trim()));
    const hasShots = Array.isArray(d.shots) && d.shots.length > 0;
    const hasCustomIcon = !!(d.isCustomIcon && d.icon && !d.icon.includes('c6-bg') && !d.icon.includes('bp-bg') && !d.icon.includes('BLUEPRINT GRID'));
    return hasText || hasShots || hasCustomIcon;
  }
  return false;
}

function hasUserDraft(){
  return stateHasUserContent(userDraft);
}

// Like hasUserDraft(), but also inspects the live form while editing the draft,
// so edits still inside the debounce window are never considered "empty".
function hasLiveUserContent(){
  if(CURRENT_PRESET_KEY === 'draft'){
    try{
      if(stateHasUserContent(getCurrentStateObject())) return true;
    }catch(_){}
  }
  return hasUserDraft();
}

// Display name of the draft that an import would replace (live form while editing the draft).
function getDraftDisplayName(){
  let src = userDraft;
  if(CURRENT_PRESET_KEY === 'draft'){
    try{ src = getCurrentStateObject(); }catch(_){}
  }
  const name = (src && src.form && src.form.name) ? String(src.form.name).trim() : '';
  return name || 'Untitled';
}

// Asks before an import replaces a draft that holds real work.
// Calls onProceed immediately when there is nothing to lose; Cancel simply never calls it,
// so the draft stays untouched.
function confirmReplaceDraft(incomingName, onProceed){
  if(typeof hasLiveUserContent === 'function' && hasLiveUserContent() && typeof showResetConfirmModal === 'function'){
    const currentName = getDraftDisplayName();
    const incName = ((incomingName || '').trim() || 'Untitled');
    const isSameName = incName.toLowerCase() === currentName.toLowerCase();
    const desc = isSameName
      ? 'Importing "' + incName + '" will overwrite your current draft with fresh data. This cannot be undone. Export a JSON backup first if you want to keep your edits.'
      : 'Importing "' + incName + '" will replace your current draft "' + currentName + '". This cannot be undone. Export a JSON backup first if you want to keep it.';

    showResetConfirmModal(
      onProceed,
      'Replace current draft?',
      desc,
      'Replace Draft',
      function(){
        if(CURRENT_PRESET_KEY !== 'draft' && typeof userDraft === 'object' && userDraft){
          try{
            const rawName = (userDraft.form && userDraft.form.name ? userDraft.form.name : '').trim();
            const slug = (typeof slugify === 'function') ? slugify(rawName, 'app') : (rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'draft');
            const backupObj = Object.assign({
              generator: "Store Preview Studio",
              version: "2.1.0",
              timestamp: new Date().toISOString()
            }, userDraft);
            if(typeof downloadFile === 'function'){
              downloadFile(slug + '-store-config.json', JSON.stringify(backupObj, null, 2), 'application/json');
              if(typeof showToast === 'function') showToast('Exported draft backup JSON!', 'ok');
              return;
            }
          }catch(_){}
        }
        if(typeof exportJSON === 'function'){
          exportJSON();
        }
      }
    );
    return true;
  }
  onProceed();
  return false;
}

function ensureDraft(){
  if(!userDraft){
    userDraft = getCurrentStateObject();
  }
  return userDraft;
}

// Throttled so a failing storage layer does not spam a toast on every debounced save.
let lastStorageWarnAt = 0;
function notifyStorageNotPersisted(){
  const now = Date.now();
  if(now - lastStorageWarnAt < 30000) return;
  lastStorageWarnAt = now;
  showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 6000);
}

// Resolves true when a FULL (non-sanitized) copy of the draft was persisted somewhere.
function saveDraftToStorage(){
  if(!userDraft) return Promise.resolve(true);
  // Timestamp lets loadDraftFromStorage() pick the newest copy if one store missed a write.
  userDraft._savedAt = Date.now();
  const idbPromise = (typeof idbSave === 'function') ? idbSave(DRAFT_STORAGE_KEY, userDraft) : Promise.resolve(false);
  if(userDraft.isCustomFeature && userDraft.featureGraphic && userDraft.featureGraphic !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')){
    if(typeof THUMB_CACHE !== 'undefined' && THUMB_CACHE.has(userDraft.featureGraphic)){
      try{ localStorage.setItem(DRAFT_FEATURE_THUMB_KEY, THUMB_CACHE.get(userDraft.featureGraphic)); }catch(_){}
    } else if(typeof generateDisplayThumbnail === 'function'){
      generateDisplayThumbnail(userDraft.featureGraphic).then(thumb => {
        try{ localStorage.setItem(DRAFT_FEATURE_THUMB_KEY, thumb); }catch(_){}
      });
    }
  } else {
    try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(_){}
  }
  let lsFull = false;
  try{
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(userDraft));
    lsFull = true;
  }catch(e){
    try{
      const sanitized = sanitizeStateForLocalStorage(userDraft);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }
  return idbPromise.then(ok => ok || lsFull).catch(() => lsFull);
}

function loadDraftFromStorage(){
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          userDraft = parsed;
          if(!userDraft.icon || (!userDraft.isCustomIcon && (userDraft.icon.includes('bp-bg') || userDraft.icon.includes('BLUEPRINT GRID') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || (typeof STUDIO_ICON !== 'undefined' && (userDraft.icon === STUDIO_ICON || userDraft.icon.includes('std-sq-bg'))) || (typeof LEGACY_BLANK_ICON !== 'undefined' && userDraft.icon === LEGACY_BLANK_ICON)))){
            userDraft.icon = BLANK_ICON;
            userDraft.isCustomIcon = false;
          }
          if(userDraft.isCustomFeature && (!userDraft.featureGraphic || userDraft.featureGraphic === (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''))){
            const thumb = localStorage.getItem(DRAFT_FEATURE_THUMB_KEY);
            if(thumb) userDraft.featureGraphic = thumb;
          }
        }
      }
    }
  }catch(e){}

  if(typeof idbGet === 'function'){
    idbGet(DRAFT_STORAGE_KEY).then(idbDraft => {
      if(idbDraft && typeof idbDraft === 'object'){
        // A complete localStorage copy newer than IndexedDB means the last IDB write failed:
        // keep the newer copy and heal IndexedDB instead of rolling back to stale data.
        const lsFullTs = (userDraft && !userDraft._partial) ? (userDraft._savedAt || 0) : 0;
        if(lsFullTs && (idbDraft._savedAt || 0) < lsFullTs){
          if(typeof idbSave === 'function') idbSave(DRAFT_STORAGE_KEY, userDraft);
          return;
        }
        userDraft = idbDraft;
        if(!userDraft.icon || (!userDraft.isCustomIcon && (userDraft.icon.includes('bp-bg') || userDraft.icon.includes('BLUEPRINT GRID') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || (typeof STUDIO_ICON !== 'undefined' && (userDraft.icon === STUDIO_ICON || userDraft.icon.includes('std-sq-bg'))) || (typeof LEGACY_BLANK_ICON !== 'undefined' && userDraft.icon === LEGACY_BLANK_ICON)))){
          userDraft.icon = BLANK_ICON;
          userDraft.isCustomIcon = false;
        }
        updateDraftPill();
        if(CURRENT_PRESET_KEY === 'draft'){
          restoring = true;
          try{
            applyStateObject(userDraft);
            if(typeof renderIcons === 'function') renderIcons();
            if(typeof renderFeature === 'function') renderFeature();
            if(typeof renderShots === 'function') renderShots();
            if(typeof renderIpadShots === 'function') renderIpadShots();
            if(typeof renderTablets === 'function') renderTablets();
            if(typeof syncStatInputs === 'function') syncStatInputs();
            if(typeof renderStats === 'function') renderStats();
            if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
            if(typeof applyTabOrient === 'function') applyTabOrient();
            if(typeof update === 'function') update();
            if(typeof fit === 'function') fit();
          }finally{
            restoring = false;
          }
        }
      }
    }).catch(()=>{});
  }
}

function initDraftFromCurrentPreset(){
  userDraft = getCurrentStateObject();
  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;
  saveDraftToStorage();
  updateDraftPill();
  updatePresetBanner();
  updatePresetMenuSelection();
}

function resetDraftWorkspace(){
  isPresetModified = false;
  const prevActivePreset = CURRENT_ACTIVE_PRESET;

  // 1. Clear file inputs and iPad support
  ['icoFile', 'featureFile', 'shotFile', 'ipadShotFile', 'tab7File', 'tab10File'].forEach(id => {
    const el = $(id);
    if(el) el.value = '';
  });
  if(typeof setSupportsIpad === 'function'){
    setSupportsIpad(false);
  }
  if(typeof resetStats === 'function') resetStats();
  if(typeof THUMB_CACHE !== 'undefined' && THUMB_CACHE && typeof THUMB_CACHE.clear === 'function'){
    THUMB_CACHE.clear();
  }

  // 2. Set CURRENT_PRESET_KEY to 'none' before loadPreset so it never saves old draft
  CURRENT_PRESET_KEY = 'none';
  loadPreset('none');

  // 3. Wipe all storage
  try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(e){}
  if(typeof idbDelete === 'function'){
    idbDelete(DRAFT_STORAGE_KEY);
    idbDelete(STORAGE_KEY);
  }

  // 4. Initialize clean blank userDraft
  CURRENT_PRESET_KEY = 'draft';
  CURRENT_ACTIVE_PRESET = prevActivePreset;
  userDraft = getCurrentStateObject();
  userDraft.isCustomized = true;
  userDraft.icon = (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');
  userDraft.isCustomIcon = false;
  saveDraftToStorage();

  // 5. Update UI
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
  showToast('Draft cleared and reset.', 'ok');
}

function updateDraftPill(){
  const draftPill = $('btnDraft');
  const presetPill = $('btnPresetPill');
  const hasDraft = hasUserDraft();

  const isViewingPreset = (CURRENT_PRESET_KEY !== 'draft');
  const activePresetKey = (CURRENT_PRESET_KEY !== 'draft' && CURRENT_PRESET_KEY) ? CURRENT_PRESET_KEY : (typeof CURRENT_ACTIVE_PRESET !== 'undefined' && CURRENT_ACTIVE_PRESET && CURRENT_ACTIVE_PRESET !== 'draft' ? CURRENT_ACTIVE_PRESET : null);

  if(presetPill){
    if(!activePresetKey){
      presetPill.style.display = 'none';
      presetPill.classList.remove('on');
    } else {
      const p = (typeof PRESETS !== 'undefined') ? PRESETS[activePresetKey] : null;
      const pIcon = (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[activePresetKey]) ? PRESET_ICONS[activePresetKey] : (p ? p.icon : BLANK_ICON);
      const pName = p ? p.name : (activePresetKey === 'imported' ? (($('f-name') && $('f-name').value.trim()) || 'Imported App') : (activePresetKey === 'none' ? 'Blank Template' : (activePresetKey.charAt(0).toUpperCase() + activePresetKey.slice(1))));
      const dispName = typeof clampGraphemes === 'function' ? clampGraphemes(pName, 26) : pName;

      presetPill.style.display = 'inline-flex';
      presetPill.classList.toggle('on', isViewingPreset);
      presetPill.setAttribute('title', isViewingPreset ? ('Viewing preset: ' + pName + ' (Click to browse templates)') : ('View preset: ' + pName + ' (Click to view)'));
      presetPill.innerHTML = '<img alt="" id="presetBtnThumb" src="' + pIcon + '">' +
        '<span id="presetBtnTitle">' + escapeHtml(dispName) + '</span>' +
        '<small id="presetBtnBadge">Preset</small>' +
        '<span role="button" class="ms-pill-reset-btn" id="presetPillCloseBtn" title="Close preset" aria-label="Close preset">&times;</span>';

      const closeBtn = presetPill.querySelector('#presetPillCloseBtn');
      if(closeBtn){
        closeBtn.addEventListener('click', function(e){
          e.stopPropagation();
          if(typeof closePresetPill === 'function') closePresetPill();
        });
      }

    }
  }

  if(!draftPill) return;

  if(hasDraft && userDraft){
    // When draft exists:
    // If viewing preset, draftPill is displayed beside presetPill as an inactive pill (.on removed)
    // If in draft mode, draftPill is displayed as active (.on)
    draftPill.style.display = 'inline-flex';
    draftPill.classList.add('has-draft');
    draftPill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');

    // Resolve icon for draft: custom uploaded icon takes top precedence, then draft icon, fallback to BLANK_ICON
    let iconSrc = BLANK_ICON;
    const isLegacyIcon = (uri) => !uri || uri.includes('bp-bg') || uri.includes('BLUEPRINT GRID') || uri.includes('bfd1fd') || uri.includes('d2c7fc') || uri.includes('c6-bg') || (!userDraft.isCustomIcon && typeof STUDIO_ICON !== 'undefined' && (uri === STUDIO_ICON || uri.includes('std-sq-bg')));

    if(userDraft.isCustomIcon && userDraft.icon){
      iconSrc = userDraft.icon;
    } else if(CURRENT_PRESET_KEY === 'draft' && IS_CUSTOM_ICON && ICON){
      iconSrc = ICON;
      userDraft.isCustomIcon = true;
      userDraft.icon = ICON;
    } else if(CURRENT_PRESET_KEY === 'draft' && typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY] && CURRENT_PRESET_KEY !== 'none'){
      iconSrc = PRESET_ICONS[CURRENT_PRESET_KEY];
      if(!userDraft.isCustomIcon) userDraft.icon = iconSrc;
    } else if(userDraft.icon && !isLegacyIcon(userDraft.icon)){
      iconSrc = userDraft.icon;
    } else if(ICON && !isLegacyIcon(ICON) && CURRENT_PRESET_KEY === 'draft'){
      iconSrc = ICON;
    } else {
      iconSrc = BLANK_ICON;
      userDraft.icon = BLANK_ICON;
      userDraft.isCustomIcon = false;
    }

    const f = userDraft.form || {};
    const appTitle = (f.name && f.name.trim()) ? (typeof clampGraphemes === 'function' ? clampGraphemes(f.name.trim(), 30) : f.name.trim()) : 'Your App';

    draftPill.setAttribute('title', appTitle + (CURRENT_PRESET_KEY === 'draft' ? ' (Active Workspace)' : ' (Saved Draft · Click to Return)'));
    draftPill.innerHTML = '<img alt="" id="draftBtnThumb" src="' + iconSrc + '">' +
      '<span id="draftBtnTitle">' + escapeHtml(appTitle) + '</span>' +
      '<small id="draftBtnBadge">Draft</small>' +
      '<span role="button" class="ms-pill-reset-btn" id="msPillResetBtn" title="Reset draft and clear fields" aria-label="Reset draft">&times;</span>';

    const resetBtn = draftPill.querySelector('#msPillResetBtn');
    if(resetBtn){
      resetBtn.addEventListener('click', function(e){
        e.stopPropagation();
        showResetConfirmModal(function(){
          resetDraftWorkspace();
        });
      });
    }
  } else {
    // No draft exists: show "+ Your App" pill on the left of preset pill
    draftPill.style.display = 'inline-flex';
    draftPill.classList.remove('has-draft');
    draftPill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');
    draftPill.innerHTML = '<span id="draftBtnTitle">+ Your App</span>';
    draftPill.setAttribute('title', 'Start your custom app draft');
  }

  updatePresetMenuSelection();
}

function updatePresetMenuSelection(){
  $$('[data-preset]').forEach(b => {
    const k = b.dataset.preset;
    b.classList.toggle('active', k === CURRENT_PRESET_KEY);
  });
}

function updatePresetBanner(){
  const banner = $('presetBanner');
  if(!banner) return;
  
  const hasDraft = hasUserDraft();
  const copyBtn = $('btnCopyPresetToDraft');
  const returnBtn = $('btnReturnToDraft');

  // Only show warning banner when user actually modifies/edits a preset template
  if(CURRENT_PRESET_KEY !== 'draft' && isPresetModified){
    banner.style.display = 'inline-flex';
    banner.classList.add('is-modified');
    const textEl = $('presetBannerText') || banner.querySelector('.preset-banner-text');
    if(textEl){
      textEl.innerHTML = '<strong>Presets only for preview</strong>: edits won\'t be saved';
    }
    if(!hasDraft){
      // No draft exists yet: suggest copying this preset as custom editable draft
      if(copyBtn) copyBtn.style.display = 'inline-flex';
      if(returnBtn) returnBtn.style.display = 'none';
    } else {
      // Draft exists: only show warning text without return button
      if(copyBtn) copyBtn.style.display = 'none';
      if(returnBtn) returnBtn.style.display = 'none';
    }
  } else {
    banner.style.display = 'none';
    banner.classList.remove('is-modified');
    if(copyBtn) copyBtn.style.display = 'none';
    if(returnBtn) returnBtn.style.display = 'none';
  }
}

function handleUserFormEdit(){
  if(CURRENT_PRESET_KEY !== 'draft'){
    isPresetModified = true;
    updatePresetBanner();
    return;
  }
  debouncedSave();
}

function saveState(isContentEdit = true){
  if(restoring) return;
  const state = getCurrentStateObject();

  let draftPersist = Promise.resolve(false);
  if(CURRENT_PRESET_KEY === 'draft'){
    userDraft = JSON.parse(JSON.stringify(state));
    draftPersist = saveDraftToStorage();
    updateDraftPill();
  } else {
    // Ephemeral mode on preset: do not overwrite draft
    if(isContentEdit){
      isPresetModified = true;
      updatePresetBanner();
    }
    return;
  }

  // 1. Asynchronously persist complete state to IndexedDB (virtually unlimited quota for high-res images)
  const idbPromise = (typeof idbSave === 'function') ? idbSave(STORAGE_KEY, state) : Promise.resolve(false);

  // 2. Try saving to localStorage. Only a FULL copy counts as persisted: the sanitized
  // fallback strips screenshots, so it must not silence the warning on its own.
  let lsFull = false;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lsFull = true;
  }catch(e){
    // Quota exceeded (typically caused by 2048x2732 base64 screenshots)
    try{
      const sanitized = sanitizeStateForLocalStorage(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }

  // 3. Warn only when NO store holds a complete copy of the work (draft copy and state copy both failed).
  const statePersist = idbPromise.then(ok => ok || lsFull).catch(() => lsFull);
  Promise.all([draftPersist, statePersist]).then(results => {
    if(!results[0] && !results[1]){
      console.warn('Storage limit reached on both LocalStorage and IndexedDB', typeof idbLastErrorName !== 'undefined' ? idbLastErrorName : '');
      notifyStorageNotPersisted();
    }
  }).catch(() => notifyStorageNotPersisted());
}

function loadState(){
  restoring = true;
  let loadedFromLs = false;
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const s = JSON.parse(raw);
        loadedFromLs = applyStateObject(s);
      }
    }
  }catch(e){
    console.warn('Failed to parse saved state from localStorage', e);
  }finally{
    restoring = false;
  }

  // Asynchronously hydrate complete state from IndexedDB (restoring high-res screenshots)
  if(typeof idbGet === 'function'){
    idbGet(STORAGE_KEY).then(idbState => {
      if(idbState && typeof idbState === 'object'){
        restoring = true;
        try{
          applyStateObject(idbState);
          if(typeof renderIcons === 'function') renderIcons();
          if(typeof renderFeature === 'function') renderFeature();
          if(typeof renderShots === 'function') renderShots();
          if(typeof renderIpadShots === 'function') renderIpadShots();
          if(typeof renderTablets === 'function') renderTablets();
          if(typeof syncStatInputs === 'function') syncStatInputs();
          if(typeof renderStats === 'function') renderStats();
          if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
          if(typeof applyTabOrient === 'function') applyTabOrient();
          if(typeof update === 'function') update();
          if(typeof fit === 'function') fit();
          if(typeof syncAllVtPills === 'function') syncAllVtPills();
        }finally{
          restoring = false;
        }
      }
    }).catch(err => {
      console.warn('IndexedDB hydration notice', err);
    });
  }

  return loadedFromLs;
}

async function resetFactoryStorage(){
  // 1. Close open IndexedDB connection if active
  try{
    if(typeof _appDbPromise !== 'undefined' && _appDbPromise){
      const db = await _appDbPromise;
      if(db && typeof db.close === 'function'){
        db.close();
      }
      _appDbPromise = null;
    }
  }catch(_){}

  // 2. Completely delete the IndexedDB database
  if(typeof indexedDB !== 'undefined' && typeof indexedDB.deleteDatabase === 'function'){
    await new Promise((resolve) => {
      try{
        const req = indexedDB.deleteDatabase(typeof IDB_DB_NAME !== 'undefined' ? IDB_DB_NAME : 'StorePreviewStudioDB');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        req.onblocked = () => resolve(false);
        setTimeout(resolve, 300);
      }catch(_){
        resolve(false);
      }
    });
  }

  // 3. Wipe all LocalStorage & SessionStorage
  try{ if(typeof localStorage !== 'undefined') localStorage.clear(); }catch(_){}
  try{ if(typeof sessionStorage !== 'undefined') sessionStorage.clear(); }catch(_){}

  // Mark sessionStorage so after reload it boots into clean draft with dashed placeholder app icon
  try{ if(typeof sessionStorage !== 'undefined') sessionStorage.setItem('sps_reset_to_blank', '1'); }catch(_){}

  // In-memory reset to default dual phone + detail view
  try{
    document.body.dataset.dual = 'true';
    appleDevice = 'dual';
    googleDevice = 'dual';
    document.body.dataset.appleDevice = 'iphone';
    document.body.dataset.googleDevice = 'phone';
    if(typeof setStore === 'function') setStore('apple', false, true);
    if(typeof setView === 'function') setView('detail', true);
  }catch(_){}

  // 4. Reload page cleanly to bootstrap pristine factory state
  if(typeof window !== 'undefined' && window.location){
    try{
      const sp = new URLSearchParams(window.location.search || '');
      const storeKeys = ['appid', 'apple', 'app_id', 'apple_id', 'id', 'app', 'url', 'store_url', 'link', 'itunes', 'country', 'bundle'];
      let hasStoreParam = false;
      storeKeys.forEach(k => {
        if(sp.has(k)){
          sp.delete(k);
          hasStoreParam = true;
        }
      });
      if(hasStoreParam && typeof window.location.replace === 'function'){
        if(window.parent && window.parent !== window){
          try{
            const psp = new URLSearchParams(window.parent.location.search || '');
            storeKeys.forEach(k => psp.delete(k));
            const pSearch = psp.toString();
            window.parent.history.replaceState(null, '', window.parent.location.pathname + (pSearch ? '?' + pSearch : ''));
          }catch(_){}
        }
        const cleanSearch = sp.toString();
        window.location.replace(window.location.pathname + (cleanSearch ? '?' + cleanSearch : ''));
        return;
      }
    }catch(_){}
    if(typeof window.location.reload === 'function'){
      window.location.reload();
    }
  }
}

const optResetAll = $('optResetAllData');
if(optResetAll){
  optResetAll.onclick = () => {
    $$('.menu').forEach(m => m.classList.remove('show'));
    showResetConfirmModal(
      resetFactoryStorage,
      'Reset All Data?',
      'Clear all stored data and reload to clean state.',
      'Reset',
      () => {
        if(typeof exportJSON === 'function') exportJSON();
      }
    );
  };
}


/* =========================================================================
   Module: src/js/modules/export/clipboard.js
   ========================================================================= */
// Store Preview Studio - 1-Click Clipboard Export
if($('btnCopyText')) $('btnCopyText').onclick = copyAllText;

function copyAllText(){
  const name = $('f-name') ? $('f-name').value : '';
  const sub = $('f-sub') ? $('f-sub').value : '';
  const promo = $('f-promo') ? $('f-promo').value : '';
  const short = $('f-short') ? $('f-short').value : '';
  const catApple = (typeof CAT === 'object' && CAT.apple) ? CAT.apple : '-';
  const catGoogle = (typeof CAT === 'object' && CAT.google) ? CAT.google : '-';
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
  const safeCount = typeof countChars === 'function' ? countChars : (s => (s || '').length);

  const text = `=====================================================
APPLE APP STORE (iOS)
=====================================================

[ App Title ] (${safeCount(name)}/30 chars)
${name}

[ Subtitle ] (${safeCount(sub)}/30 chars)
${sub}

[ Promotional Text ] (${safeCount(promo)}/170 chars)
${promo}

[ Primary Category ]
${catApple}

[ Description ] (${safeCount(desc)}/4,000 chars)
${desc}

[ What's New ]
${wn}


=====================================================
GOOGLE PLAY STORE (Android)
=====================================================

[ App Name ] (${safeCount(name)}/30 chars)
${name}

[ Short Description ] (${safeCount(short)}/80 chars)
${short}

[ App Category ]
${catGoogle}

[ Full Description ] (${safeCount(desc)}/4,000 chars)
${desc}

[ What's New / Release Notes ]
${wn}

=====================================================`;

  function fallbackCopyText(str){
    try {
      const ta = document.createElement('textarea');
      ta.value = str;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      if(success){
        showToast('Store metadata copied to clipboard!', 'ok');
      } else {
        showToast('Clipboard access denied, check permissions', 'warn');
      }
    } catch(err){
      showToast('Clipboard access denied, check permissions', 'warn');
    }
  }

  if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
    navigator.clipboard.writeText(text).then(()=>{
      showToast('Store metadata copied to clipboard!', 'ok');
    }).catch(()=>{
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}


/* =========================================================================
   Module: src/js/modules/export/markdown.js
   ========================================================================= */
// Store Preview Studio - Markdown Metadata Exporter (LISTING_METADATA.md)
if($('optExportMD')) $('optExportMD').onclick = exportMarkdown;

function exportMarkdown(){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;

  function safeFence(text, lang='text'){
    let fence = '```';
    while((text||'').includes(fence)){
      fence += '`';
    }
    return fence + lang + '\n' + (text||'') + '\n' + fence;
  }

  const name = $('f-name') ? $('f-name').value : '';
  const sub = $('f-sub') ? $('f-sub').value : '';
  const promo = $('f-promo') ? $('f-promo').value : '';
  const short = $('f-short') ? $('f-short').value : '';
  const catApple = (typeof CAT === 'object' && CAT.apple) ? CAT.apple : (typeof CAT !== 'undefined' && CAT.apple ? CAT.apple : '-');
  const catGoogle = (typeof CAT === 'object' && CAT.google) ? CAT.google : (typeof CAT !== 'undefined' && CAT.google ? CAT.google : '-');
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
  const safeCount = typeof countChars === 'function' ? countChars : (s => (s || '').length);

  const md = `# Store Listing Metadata: ${name}

> Generated by **Store Preview Studio** on ${new Date().toLocaleDateString()}

---

## Apple App Store (iOS)

### App Title (${safeCount(name)}/30 chars)
${safeFence(name)}

### Subtitle (${safeCount(sub)}/30 chars)
${safeFence(sub)}

### Promotional Text (${safeCount(promo)}/170 chars)
${safeFence(promo)}

### Primary Category
${catApple}

### Description (${safeCount(desc)}/4,000 chars)
${safeFence(desc)}

### What's New
${safeFence(wn)}

---

## Google Play Store (Android)

### App Name (${safeCount(name)}/30 chars)
${safeFence(name)}

### Short Description (${safeCount(short)}/80 chars)
${safeFence(short)}

### App Category
${catGoogle}

### Full Description (${safeCount(desc)}/4,000 chars)
${safeFence(desc)}

### What's New / Release Notes
${safeFence(wn)}
`;

  downloadFile('LISTING_METADATA.md', md, 'text/markdown');
  showToast('Downloaded LISTING_METADATA.md!', 'ok');
}


/* =========================================================================
   Module: src/js/modules/export/json.js
   ========================================================================= */
// Store Preview Studio - JSON Configuration Exporter, Importer & Drag-and-Drop Handler
if($('optExportJSON')) $('optExportJSON').onclick = exportJSON;

function exportJSON(){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const config = {
    generator: "Store Preview Studio",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
    store,
    theme: document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light',
    form: {
      name: $('f-name') ? $('f-name').value : '',
      sub: $('f-sub') ? $('f-sub').value : '',
      promo: $('f-promo') ? $('f-promo').value : '',
      short: $('f-short') ? $('f-short').value : '',
      dev: $('f-dev') ? $('f-dev').value : '',
      cat: $('f-cat') ? $('f-cat').value : '',
      catApple: CAT.apple,
      catGoogle: CAT.google,
      ver: $('f-ver') ? $('f-ver').value : '2.4.0',
      rdate: $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true),
      email: $('f-email') ? $('f-email').value : '',
      addr: $('f-addr') ? $('f-addr').value : '',
      privLinked: $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : ''),
      privNotLinked: $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : ''),
      privGoogle: $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : ''),
      new: $('f-new') ? $('f-new').value : '',
      desc: $('f-desc') ? $('f-desc').value : ''
    },
    icon: ICON,
    icon1024: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    icon512: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    iconApple: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    iconGoogle: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    isCustomIcon: typeof IS_CUSTOM_ICON !== 'undefined' ? IS_CUSTOM_ICON : true,
    featureGraphic: FEATURE_GRAPHIC,
    isCustomFeature: typeof IS_CUSTOM_FEATURE !== 'undefined' ? IS_CUSTOM_FEATURE : false,
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    tab7Shots: (TABS.tab7 || []).map(i => (i && i.src) || (typeof i === 'string' ? i : '')),
    tab10Shots: (TABS.tab10 || []).map(i => (i && i.src) || (typeof i === 'string' ? i : '')),
    stats: (typeof statsToObject === 'function') ? statsToObject() : {}
  };
  const jsonStr = JSON.stringify(config, null, 2);
  const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
  const slug = (typeof slugify === 'function') ? slugify(rawName, 'app') : (rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app');
  downloadFile(`${slug}-store-config.json`, jsonStr, 'application/json');
  showToast('Exported store configuration JSON!', 'ok');
}

// Smart & Fault-Tolerant JSON Import Parser
function parseAndApplyJSON(jsonString, opts = {}){
  if(typeof jsonString === 'string'){
    // Strip UTF-8 BOM if present
    if(jsonString.charCodeAt(0) === 0xFEFF){
      jsonString = jsonString.slice(1);
    }
  }

  let data;
  try{
    data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  }catch(err){
    showToast('Invalid JSON file format (Syntax Error)', 'warn');
    return false;
  }

  if(!data || typeof data !== 'object' || Array.isArray(data)){
    showToast('Invalid file: JSON root must be an object', 'warn');
    return false;
  }

  // Reject unrelated JSON schemas like package.json or library manifests
  if(!data.form && !data.app && (data.main || data.scripts || (data.version && data.main) || data.dependencies || data.devDependencies)){
    showToast('File does not contain valid App Listing metadata', 'warn');
    return false;
  }

  const isKnownGenerator = data.generator === 'Store Preview Studio';
  const hasAppWrapper = (data.form && typeof data.form === 'object') || (data.app && typeof data.app === 'object');
  const hasStoreKeys = !!(data.store || data.shots || data.tab7Shots || data.tab10Shots || data.icon || data.featureGraphic || data.feature);

  // Extract source object whether it uses "form", "app", or flat root properties
  const src = (data.form && typeof data.form === 'object') ? data.form : ((data.app && typeof data.app === 'object') ? data.app : data);

  // Validate fields and safely discard wrong types (objects, arrays, numbers)
  let hadWrongTypes = false;
  const getStr = val => {
    if(val === undefined || val === null) return '';
    if(typeof val === 'string') return val;
    hadWrongTypes = true;
    return '';
  };

  const mapped = {
    name: getStr(src.name || src.title || src.appName),
    sub: getStr(src.sub || src.subtitle),
    promo: getStr(src.promo || src.promotionalText || src.promoText),
    short: getStr(src.short || src.shortDesc || src.shortDescription),
    dev: getStr(src.dev || src.developer || src.developerName || src.author),
    cat: getStr(src.cat || src.category),
    ver: getStr(src.ver || src.appVersion),
    rdate: getStr(src.rdate || src.releaseDate),
    email: getStr(src.email || src.supportEmail),
    addr: getStr(src.addr || src.address || src.location),
    privLinked: getStr(src.privLinked),
    privNotLinked: getStr(src.privNotLinked),
    privGoogle: getStr(src.privGoogle),
    new: getStr(src.new || src.whatsNew || src.releaseNotes || src.changelog),
    desc: getStr(src.desc || src.description || src.fullDescription)
  };

  const hasMobileSpecificFields = !!(mapped.sub || mapped.promo || mapped.short || src.catApple || src.catGoogle);

  // Strict Schema Check: Reject generic flat JSON files that lack Store Preview Studio schema or mobile fields
  if(!isKnownGenerator && !hasAppWrapper && !hasStoreKeys && !hasMobileSpecificFields){
    showToast('Unrecognized format: Missing Store Preview Studio schema or listing fields', 'warn');
    return false;
  }

  // Check if at least one meaningful app listing field exists
  const hasFields = Object.values(mapped).some(v => v.trim().length > 0);
  if(!hasFields && !data.icon && !Array.isArray(data.shots)){
    showToast('File does not contain valid App Listing metadata', 'warn');
    return false;
  }

  // Draft guard: importing replaces the single draft slot. If it holds real work, ask first.
  // Nothing has been written to the UI or storage yet, so Cancel leaves the draft untouched.
  if(!opts.skipDraftGuard && typeof confirmReplaceDraft === 'function'){
    let applied = false;
    const asked = confirmReplaceDraft(mapped.name, () => {
      applied = parseAndApplyJSON(data, { skipDraftGuard: true });
    });
    return asked ? false : applied;
  }

  // Safely populate available fields without erasing existing ones if absent
  if(mapped.name && $('f-name')) $('f-name').value = mapped.name;
  if(mapped.sub && $('f-sub')) $('f-sub').value = mapped.sub;
  if(mapped.promo && $('f-promo')) $('f-promo').value = mapped.promo;
  if(mapped.short && $('f-short')) $('f-short').value = mapped.short;
  if(mapped.dev && $('f-dev')) $('f-dev').value = mapped.dev;
  if(mapped.cat) setCategory(mapped.cat);
  if(src.catApple && typeof src.catApple === 'string') setCategory(src.catApple, 'apple');
  if(src.catGoogle && typeof src.catGoogle === 'string') setCategory(src.catGoogle, 'google');
  if(mapped.ver && $('f-ver')) $('f-ver').value = mapped.ver;
  if(mapped.rdate && $('f-rdate')) $('f-rdate').value = mapped.rdate;
  if(mapped.email && $('f-email')) $('f-email').value = mapped.email;
  if(mapped.addr && $('f-addr')) $('f-addr').value = mapped.addr;
  if(mapped.privLinked) {
    if($('f-priv-linked')) $('f-priv-linked').value = mapped.privLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = mapped.privLinked;
  }
  if(mapped.privNotLinked) {
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = mapped.privNotLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = mapped.privNotLinked;
  }
  if(mapped.privGoogle) {
    if($('f-priv-google')) $('f-priv-google').value = mapped.privGoogle;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = mapped.privGoogle;
  }
  if(mapped.new && $('f-new')) $('f-new').value = mapped.new;
  if(mapped.desc && $('f-desc')) $('f-desc').value = mapped.desc;

  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;

  const isBlankIconUri = uri => !uri || (typeof BLANK_ICON !== 'undefined' && uri === BLANK_ICON) || (typeof uri === 'string' && (uri.includes('c6-bg') || uri.includes('bfd1fd') || uri.includes('d2c7fc') || uri.includes('bp-bg') || uri.includes('blueprint')));
  const importedRawIcon = data.icon1024 || data.iconApple || data.icon512 || data.iconGoogle || data.icon || '';
  const hasRealIcon = !isBlankIconUri(importedRawIcon);

  if(data.isCustomIcon !== undefined){
    IS_CUSTOM_ICON = !!data.isCustomIcon;
  } else {
    IS_CUSTOM_ICON = hasRealIcon;
  }

  if(data.icon1024) CUSTOM_ICON_1024 = data.icon1024;
  else if(data.iconApple) CUSTOM_ICON_1024 = data.iconApple;
  else if(data.icon) CUSTOM_ICON_1024 = data.icon;

  if(data.icon512) CUSTOM_ICON_512 = data.icon512;
  else if(data.iconGoogle) CUSTOM_ICON_512 = data.iconGoogle;
  else if(data.icon) CUSTOM_ICON_512 = data.icon;

  if(data.icon1024 || data.icon512 || data.iconApple || data.iconGoogle) {
    if(store === 'apple' && (data.icon1024 || data.iconApple)) ICON = data.icon1024 || data.iconApple;
    else if(store === 'google' && (data.icon512 || data.iconGoogle)) ICON = data.icon512 || data.iconGoogle;
    else if(data.icon) ICON = data.icon;
  } else if(data.icon && typeof data.icon === 'string') {
    ICON = data.icon;
  }
  if(typeof rasterizeSvgToStorePng === 'function' && typeof ICON === 'string' && (ICON.startsWith('data:image/svg+xml') || ICON.includes('<svg'))){
    const rawSvg = ICON;
    rasterizeSvgToStorePng(rawSvg, 1024, png1024 => {
      data.icon1024 = png1024;
      if(store === 'apple' && !IS_CUSTOM_ICON){
        ICON = png1024;
        renderIcons();
      }
    });
    rasterizeSvgToStorePng(rawSvg, 512, png512 => {
      data.icon512 = png512;
      if(store === 'google' && !IS_CUSTOM_ICON){
        ICON = png512;
        renderIcons();
      }
    });
  }
  if(data.featureGraphic && typeof data.featureGraphic === 'string') FEATURE_GRAPHIC = data.featureGraphic;
  else if(data.feature && typeof data.feature === 'string') FEATURE_GRAPHIC = data.feature;

  if(data.isCustomFeature !== undefined){
    IS_CUSTOM_FEATURE = !!data.isCustomFeature;
  } else {
    IS_CUSTOM_FEATURE = !!(FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') && FEATURE_GRAPHIC !== (typeof DEFAULT_FEATURE !== 'undefined' ? DEFAULT_FEATURE : ''));
  }

  if(Array.isArray(data.shots)){
    const cleanShots = data.shots.filter(x => typeof x === 'string' && x.trim().length > 0);
    if(cleanShots.length > 0) SHOTS = cleanShots;
  }
  if(Array.isArray(data.tab7Shots) && typeof makeTabItem === 'function') TABS.tab7 = data.tab7Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(data.tab10Shots) && typeof makeTabItem === 'function') TABS.tab10 = data.tab10Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(data.store && (data.store === 'apple' || data.store === 'google')) setStore(data.store);
  if(data.theme && (data.theme === 'light' || data.theme === 'dark')){
    if(typeof setDeviceTheme === 'function') setDeviceTheme(data.theme, false);
    else $$('.phone').forEach(p => p.dataset.theme = data.theme);
  }
  if(data.stats){ applyStatsFromObject(data.stats); syncStatInputs(); renderStats(); }

  const ipadSupportVal = (typeof data.supportsIpad === 'boolean')
    ? data.supportsIpad
    : ((typeof data.isUniversal === 'boolean')
      ? data.isUniversal
      : (Array.isArray(data.ipadShots) && data.ipadShots.length > 0));
  if(typeof setSupportsIpad === 'function') setSupportsIpad(ipadSupportVal);
  if(data.ipadFitMode === 'cover' || data.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = data.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(Array.isArray(data.ipadShots)){
    IPAD_SHOTS = data.ipadShots.filter(x => typeof x === 'string');
  }

  if(typeof renderIcons === 'function') renderIcons();
  if(typeof renderFeature === 'function') renderFeature();
  if(typeof renderShots === 'function') renderShots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(typeof renderTablets === 'function') renderTablets();
  if(typeof update === 'function') update();
  if(typeof validateAppIcon === 'function') validateAppIcon();
  if(typeof updateIconDropZoneUi === 'function') updateIconDropZoneUi();

  if(typeof getCurrentStateObject === 'function'){
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
    userDraft.isCustomIcon = IS_CUSTOM_ICON;
  }
  if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  saveState();

  if(hadWrongTypes){
    showToast('Imported config (Note: invalid non-string fields were ignored)', 'warn', 3500);
  } else {
    showToast('Configuration imported successfully!', 'ok');
  }
  return true;
}

if($('optImportJSON')){
  $('optImportJSON').onclick = () => {
    if(typeof canUpload === 'function' && !canUpload(1000)) return;
    if($('jsonFileInput')) $('jsonFileInput').click();
  };
}
if($('jsonFileInput')){
  $('jsonFileInput').onchange = (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
    };
    reader.onerror = () => {
      showToast('Failed to read file from disk', 'warn');
    };
    reader.readAsText(file);
    e.target.value = '';
  };
}

// Drag & Drop JSON anywhere onto the page
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if(!file) return;
  if(file.name.toLowerCase().endsWith('.json')){
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
    };
    reader.readAsText(file);
  } else if (!e.target.closest('#icoDropZone') && !e.target.closest('#featureDropZone') && !e.target.closest('#shotDropZone') && !e.target.closest('#ipadDropZone') && !e.target.closest('#bundleDropZone') && !e.target.closest('.drop-zone') && !e.target.closest('.sl') && !e.target.closest('.tabsec') && !e.target.closest('#msIconModal') && !e.target.closest('#imageDetailModal') && !e.target.closest('.icon-modal-backdrop') && !e.target.closest('.modal')) {
    const isImage = (file.type && file.type.startsWith('image/')) || /\.(png|jpe?g|webp|svg|gif|bmp|ico)$/i.test(file.name);
    const isModalOpen = !!document.querySelector('#msIconModal.open, #imageDetailModal.open, .icon-modal-backdrop.open, .modal.open');
    if (!isImage && !isModalOpen) {
      showToast('Unsupported file type. Please drop a .json configuration file.', 'warn');
    }
  }
});

// Reset to Default State
if($('optResetDefault')){
  $('optResetDefault').onclick = () => {
    showResetConfirmModal(() => {
      if(typeof resetDraftWorkspace === 'function'){
        resetDraftWorkspace();
      } else {
        userDraft = null;
        isPresetModified = false;
        try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
        try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
        try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(e){}
        if(typeof idbDelete === 'function'){
          idbDelete(DRAFT_STORAGE_KEY);
          idbDelete(STORAGE_KEY);
        }
        if(typeof resetStats === 'function') resetStats();
        loadPreset('none');
        CURRENT_PRESET_KEY = 'draft';
        if(typeof updatePresetBanner === 'function') updatePresetBanner();
        if(typeof updateDraftPill === 'function') updateDraftPill();
        if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
        showToast('Draft cleared and reset.', 'ok');
      }
    }, 'Reset App Draft?', 'This will clear your customized app icon, name, and descriptions. Your current draft cannot be recovered.', 'Reset', () => {
      if(typeof exportJSON === 'function') exportJSON();
    });
  };
}


/* =========================================================================
   Module: src/js/modules/export/png.js
   ========================================================================= */
// Store Preview Studio - PNG Image Exporter via html2canvas
if($('optExportPNG')) $('optExportPNG').onclick = () => exportPNG(2);
const optExport3x = $('optExportPNG3x');
if(optExport3x) optExport3x.onclick = () => exportPNG(3);
const optExportTransparent = $('optExportTransparent');
if(optExportTransparent) optExportTransparent.onclick = () => exportPNG(3, {transparent:true});
const optExportScreen = $('optExportScreen');
if(optExportScreen) optExportScreen.onclick = () => exportPNG(3, {frameless:true});

// ─── Export Mockup Image Modal Controller ───
const exportModal = $('exportImageModal');
const optOpenModal = $('optOpenExportModal');
const btnCloseModal = $('exportModalClose');
const btnCopyModal = $('exportModalCopy');
const btnDownloadModal = $('exportModalDownload');

const EXPORT_PREFS_KEY = 'sps_export_img_prefs';
let exportPrefs = {
  frame: 'device',
  bg: 'transparent',
  scale: 3
};

try {
  const saved = localStorage.getItem(EXPORT_PREFS_KEY);
  if (saved) Object.assign(exportPrefs, JSON.parse(saved));
} catch(_) {}

function syncExportModalUI() {
  if (!exportModal) return;
  exportModal.querySelectorAll('[data-opt="frame"]').forEach(el => {
    const isAct = el.dataset.val === exportPrefs.frame;
    el.classList.toggle('active', isAct);
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = isAct;
  });
  exportModal.querySelectorAll('[data-opt="scale"]').forEach(el => {
    const isAct = Number(el.dataset.val) === Number(exportPrefs.scale);
    el.classList.toggle('active', isAct);
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = isAct;
  });
  const summaryEl = $('exportSummaryBadge');
  if (summaryEl) {
    const frameLabel = exportPrefs.frame === 'screen' ? 'Screen Only' : 'Device Frame';
    const scaleLabel = exportPrefs.scale === 3 ? '3x Ultra HD' : '2x HD';
    summaryEl.textContent = `${scaleLabel} · ${frameLabel} · Transparent`;
  }
}

function saveExportPrefs() {
  try {
    localStorage.setItem(EXPORT_PREFS_KEY, JSON.stringify(exportPrefs));
  } catch(_) {}
}

function openExportModal() {
  if (!exportModal) return;
  if (typeof $$ === 'function') $$('.menu').forEach(m => m.classList.remove('show'));
  syncExportModalUI();
  exportModal.classList.add('open');
  exportModal.setAttribute('aria-hidden', 'false');
}

function closeExportModal() {
  if (!exportModal) return;
  exportModal.classList.remove('open');
  exportModal.setAttribute('aria-hidden', 'true');
}

if (optOpenModal) optOpenModal.onclick = openExportModal;
if (btnCloseModal) btnCloseModal.onclick = closeExportModal;
if (exportModal) {
  exportModal.addEventListener('click', e => {
    if (e.target === exportModal) closeExportModal();
  });
  exportModal.querySelectorAll('.export-radio-item, .export-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = btn.dataset.opt;
      const val = btn.dataset.val;
      if (opt === 'frame') exportPrefs.frame = val;
      else if (opt === 'scale') exportPrefs.scale = Number(val);
      syncExportModalUI();
      saveExportPrefs();
    });
  });
  exportModal.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.name === 'exportFrame') exportPrefs.frame = radio.value;
      else if (radio.name === 'exportScale') exportPrefs.scale = Number(radio.value);
      syncExportModalUI();
      saveExportPrefs();
    });
  });
}

if (btnDownloadModal) {
  btnDownloadModal.onclick = () => {
    closeExportModal();
    exportPNG(exportPrefs.scale, {
      frameless: exportPrefs.frame === 'screen',
      transparent: true
    });
  };
}

let copyResetTimer = null;
if (btnCopyModal) {
  btnCopyModal.onclick = () => {
    const originalHtml = btnCopyModal.innerHTML;
    exportPNG(exportPrefs.scale, {
      frameless: exportPrefs.frame === 'screen',
      transparent: true,
      action: 'copy',
      onSuccess: () => {
        clearTimeout(copyResetTimer);
        btnCopyModal.classList.add('copied');
        btnCopyModal.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="color:#10b981;font-weight:600;">Copied!</span>
        `;
        copyResetTimer = setTimeout(() => {
          btnCopyModal.classList.remove('copied');
          btnCopyModal.innerHTML = originalHtml;
        }, 1800);
      }
    });
  };
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && exportModal && exportModal.classList.contains('open')) {
    closeExportModal();
  }
});

// Helper to guarantee all images inside a DOM tree are completely loaded & decoded before canvas rasterization
async function waitForAllImages(container){
  if(!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  if(!imgs.length) return;
  await Promise.all(imgs.map(img => {
    if(img.complete && img.naturalWidth > 0) return Promise.resolve();
    if(typeof img.decode === 'function'){
      return img.decode()
        .then(() => {
          if(img.naturalWidth > 0) return;
          return new Promise(res => setTimeout(res, 40));
        })
        .catch(() => new Promise(res => {
          if(img.complete && img.naturalWidth > 0) return res();
          img.onload = () => res();
          img.onerror = () => res();
          setTimeout(res, 250);
        }));
    }
    return new Promise(res => {
      if(img.complete && img.naturalWidth > 0) return res();
      img.onload = () => res();
      img.onerror = () => res();
      setTimeout(res, 400);
    });
  }));
}

// html2canvas can drop parts of SVG images (filters, glow). Rasterize SVG data-URI images to PNG first,
// swap them in for the capture, and return a function that puts the originals back.
async function rasterizeSvgImages(root, scale, zoom = 1){
  const swaps = [];
  const safeZoom = (typeof zoom === 'number' && zoom > 0) ? zoom : 1;
  const imgs = [...root.querySelectorAll('img')].filter(i => /^data:image\/svg\+xml/i.test(i.currentSrc || i.src || ''));
  await Promise.all(imgs.map(async img => {
    try{
      const box = img.getBoundingClientRect();
      let boxWidth = (box.width ? (box.width / safeZoom) : img.offsetWidth) || 0;
      let boxHeight = (box.height ? (box.height / safeZoom) : img.offsetHeight) || 0;
      const isLandscape = img.classList.contains('landscape-shot');
      const isIpadShot = img.classList.contains('ipad-shot');
      const isIpad = img.closest('.ipad');
      const isGtab10 = img.closest('.gtab10, #dev-tab10');
      const isGtab7 = img.closest('.gtab7, #dev-tab7');
      const isApple = img.closest('.apple') && !isIpad;
      const isGoogle = img.closest('.google') && !isGtab10 && !isGtab7;
      const isDevLandscape = img.closest('.dev')?.classList.contains('landscape');
      const isTabPortrait = img.closest('.dev')?.classList.contains('portrait');

      const original = img.src;
      let svgText = '';
      const commaIdx = original.indexOf(',');
      if(commaIdx !== -1){
        const header = original.slice(0, commaIdx);
        const body = original.slice(commaIdx + 1);
        if(typeof decodeSvgDataUri === 'function'){
          svgText = decodeSvgDataUri(body, /;base64/i.test(header)) || '';
        }else{
          try{ svgText = decodeURIComponent(body); }catch(_){}
        }
      }
      const vb = svgText.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/);
      const vw = vb ? parseFloat(vb[1]) : 0;
      const vh = vb ? parseFloat(vb[2]) : 0;
      const svgAspect = (vw > 0 && vh > 0) ? (vw / vh) : 0;

      // Ensure box dimensions strictly preserve the SVG aspect ratio or intended device ratio
      if (isGtab10) {
        boxHeight = isTabPortrait ? 320 : 240;
        boxWidth = Math.round(boxHeight * (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
      } else if (isGtab7) {
        boxHeight = isTabPortrait ? 270 : 175;
        boxWidth = Math.round(boxHeight * (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
      } else if (isIpad) {
        if (isIpadShot) {
          boxHeight = isLandscape ? 285 : (isDevLandscape ? 307 : 347);
          boxWidth = Math.round(boxHeight * (svgAspect || (isLandscape ? (4 / 3) : (3 / 4))));
        } else {
          boxWidth = isLandscape ? 380 : (isDevLandscape ? 230 : 260);
          boxHeight = Math.round(boxWidth / (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
        }
      } else if (isApple) {
        boxWidth = isLandscape ? 340 : 222;
        boxHeight = isLandscape ? 191 : 481;
      } else if (isGoogle) {
        boxWidth = isLandscape ? 330 : 190;
        boxHeight = isLandscape ? 186 : 412;
      } else {
        if (boxHeight > 0 && !boxWidth) {
          boxWidth = Math.round(boxHeight * (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
        } else if (boxWidth > 0 && !boxHeight) {
          boxHeight = Math.round(boxWidth / (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
        } else if (!boxWidth || !boxHeight) {
          boxWidth = 200;
          boxHeight = Math.round(boxWidth / (svgAspect || (isLandscape ? (16 / 9) : (460 / 996))));
        }
      }
      if(!boxWidth || !boxHeight) return;

      const tmp = new Image();
      const safeSrc = typeof ensureSvgDimensions === 'function' ? ensureSvgDimensions(original) : original;
      await new Promise((res, rej) => { tmp.onload = res; tmp.onerror = rej; tmp.src = safeSrc; });
      // 1) draw the vector at its own aspect ratio
      const refW = vw || boxWidth, refH = vh || boxHeight;
      const k = Math.max(boxWidth * scale / refW, boxHeight * scale / refH);
      const sw = Math.max(1, Math.round(refW * k)), sh = Math.max(1, Math.round(refH * k));
      const c1 = document.createElement('canvas'); c1.width = sw; c1.height = sh;
      c1.getContext('2d').drawImage(tmp, 0, 0, sw, sh);
      // 2) crop to the element box like object-fit: cover
      const w = Math.max(1, Math.round(boxWidth * scale)), h = Math.max(1, Math.round(boxHeight * scale));
      const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
      const f = Math.max(w / sw, h / sh);
      const dw = sw * f, dh = sh * f;
      c2.getContext('2d').drawImage(c1, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const png = c2.toDataURL('image/png');
      swaps.push([img, original]);
      img.src = png;
      if(img.decode) await img.decode().catch(() => {});
    }catch(err){ /* keep the original image if anything fails */ }
  }));
  return () => swaps.forEach(([img, original]) => { img.src = original; });
}

function addMockupNote(canvas, scaleFactor){
  const pad = Math.round(34 * scaleFactor);
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height + pad;
  const ctx = out.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  const text = 'Illustrative mockup — not live store data';
  let size = 11 * scaleFactor;
  const family = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.font = `600 ${size}px ${family}`;
  while(ctx.measureText(text).width > out.width * 0.92 && size > 6 * scaleFactor){
    size -= 0.5; ctx.font = `600 ${size}px ${family}`;
  }
  ctx.fillStyle = 'rgba(128,132,142,.95)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, out.width / 2, canvas.height + pad / 2);
  return out;
}

function drawStudioWatermark(cv) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const w = cv.width;
  const h = cv.height;
  const isLight = (document.documentElement.dataset && document.documentElement.dataset.ui === 'light') || document.documentElement.getAttribute('data-theme') === 'light';
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-22 * Math.PI / 180);
  const patFontSize = Math.max(16, Math.round(w * 0.016));
  ctx.font = '600 ' + patFontSize + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const maxDim = Math.sqrt(w * w + h * h);
  const stepX = Math.round(w * 0.28);
  const stepY = Math.round(h * 0.15);
  const text = 'STORE PREVIEW STUDIO';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 3;
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.10)';
  let row = 0;
  for (let y = -maxDim; y <= maxDim; y += stepY) {
    row++;
    const shift = (row % 2 === 0) ? (stepX / 2) : 0;
    for (let x = -maxDim; x <= maxDim; x += stepX) {
      ctx.fillText(text, x + shift, y);
    }
  }
  ctx.restore();
}

async function exportPNG(scaleFactor = 2, opts = {}){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  if(typeof scaleFactor !== 'number') scaleFactor = 3;
  if(typeof html2canvas === 'undefined'){
    showToast('Mockup generator library is still loading. Please try again in a few seconds.', 'warn', 3500);
    return;
  }

  const isDual = document.body.dataset.dual === 'true' || appleDevice === 'dual' || googleDevice === 'dual';
  let devToCapture;
  let devSlug = store;
  if(isDual){
    devToCapture = $('stageDevices') || document.querySelector('.stage-devices');
    devSlug = 'dual-store-phone';
  }else if(store === 'apple'){
    if(appleDevice === 'ipad'){
      devToCapture = document.querySelector('.dev.ipad');
      devSlug = 'apple-ipad-pro';
    }else{
      devToCapture = document.querySelector('.dev.apple.single');
      devSlug = 'apple-iphone';
    }
  }else if(googleDevice !== 'phone'){
    devToCapture = $('dev-' + googleDevice);
    devSlug = googleDevice === 'tab7' ? 'google-play-7-inch-tablet' : 'google-play-10-inch-tablet';
  }else{
    devToCapture = document.querySelector('.dev.google');
    devSlug = 'google-play-phone';
  }

  if(!devToCapture) return;

  // Screen only: capture the inner screen (.phone) instead of the whole device frame
  const target = (!isDual && opts.frameless) ? (devToCapture.querySelector('.phone') || devToCapture) : devToCapture;

  if(opts.action !== 'copy'){
    showToast(`Rendering ${scaleFactor}x PNG${opts.frameless ? ' (screen only)' : ''}...`, 'info', 4000);
  }

  // Measure unzoomed layout size without touching live DOM zoom to prevent canvas jitter
  isExporting = true;
  const curZoom = isDual
    ? (parseFloat(document.querySelector('.dev.apple.single')?.style.zoom)
       || parseFloat(document.querySelector('.dev')?.style.zoom)
       || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dev-zoom'))
       || 1)
    : (parseFloat(devToCapture.style.zoom) || 1);

  let w, h;
  if(isDual){
    const appleDev = devToCapture.querySelector('.dev.apple.single');
    const googleDev = devToCapture.querySelector('.dev.google');
    const appleTarget = (opts.frameless && appleDev?.querySelector('.phone')) || appleDev;
    const googleTarget = (opts.frameless && googleDev?.querySelector('.phone')) || googleDev;

    const appleRect = appleTarget ? appleTarget.getBoundingClientRect() : null;
    const googleRect = googleTarget ? googleTarget.getBoundingClientRect() : null;

    const appleW = appleRect ? Math.round(appleRect.width / curZoom) : (opts.frameless ? 390 : 416);
    const appleH = appleRect ? Math.round(appleRect.height / curZoom) : (opts.frameless ? 844 : 870);
    const googleW = googleRect ? Math.round(googleRect.width / curZoom) : (opts.frameless ? 390 : 416);
    const googleH = googleRect ? Math.round(googleRect.height / curZoom) : (opts.frameless ? 844 : 870);

    const gap = 28;
    w = appleW + gap + googleW;
    h = Math.max(appleH, googleH);
  } else {
    const rect = target.getBoundingClientRect();
    w = Math.round(rect.width / curZoom);
    h = Math.round(rect.height / curZoom);
  }
  const padX = opts.frameless ? 0 : 8;

  let offscreenWrap = null;
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready.catch(() => {});
    }

    // Create an unzoomed offscreen clone so html2canvas initializes layout bounds at true 1x scale
    // and keeps the live screen DOM completely untouched (zero visual jitter, flicker or collapse).
    offscreenWrap = document.createElement('div');
    offscreenWrap.style.cssText = `position:fixed;left:0;top:0;width:${w + padX * 2}px;height:${h}px;opacity:0.001;pointer-events:none;z-index:-99999;overflow:hidden;`;
    const cloneTarget = target.cloneNode(true);
    cloneTarget.style.zoom = '1';
    cloneTarget.style.transform = 'none';
    cloneTarget.querySelectorAll('.dev').forEach(d => {
      d.style.zoom = '1';
      d.style.transform = 'none';
    });
    offscreenWrap.appendChild(cloneTarget);
    document.body.appendChild(offscreenWrap);

    // Rasterize SVGs exclusively on the offscreen clone without mutating live DOM images
    await rasterizeSvgImages(cloneTarget, scaleFactor, 1);
    await waitForAllImages(cloneTarget);
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 60)));

    let canvas = await html2canvas(cloneTarget, {
      backgroundColor: null,
      scale: scaleFactor,
      x: -padX,
      width: w + padX * 2,
      height: h,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(document.documentElement.clientWidth, w + 140),
      windowHeight: Math.max(document.documentElement.clientHeight, h + 120),
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: async (clonedDoc, clonedEl) => {
        // Sync document fonts to cloned iframe document to guarantee accurate text metrics
        if(document.fonts && clonedDoc.fonts){
          try{
            document.fonts.forEach(f => clonedDoc.fonts.add(f));
            if(clonedDoc.fonts.ready){
              await clonedDoc.fonts.ready;
            }
          }catch(_){}
        }

        // Reset stage scroll if present
        const clonedStage = clonedDoc.querySelector('.stage');
        if(clonedStage){
          clonedStage.scrollTop = 0;
          clonedStage.scrollLeft = 0;
        }

        // Hide CSS pseudo-element buttons and override -webkit-box multi-line clamps so html2canvas
        // doesn't squish adjacent text or collapse whitespace across words during text metric measurement
        const btnStyle = clonedDoc.createElement('style');
        btnStyle.textContent = `
          .dev::before, .dev::after { display: none !important; }
          .g-name, .a-name, .g-dev, .a-sub, .ipad-name, .ipad-sub, .gt7-app-name, .gt10-header-title, .gt10-item-title,
          .sr-title, .sr-subtitle, .sr-category, .sr-dev, .sr-meta-line, .sr-search-query,
          .ipad-sr-app-title, .ipad-sr-app-sub, .ipad-search-query, .ipad-floating-title,
          .gp-search-query-text, .gp-search-card-name, .gp-search-card-meta, .g-meta, .iap,
          [data-b]:not(.a-met [data-b]):not(.ipad-met [data-b]):not(.g-met [data-b]) {
            -webkit-line-clamp: unset !important;
            -webkit-box-orient: unset !important;
            white-space: pre-wrap !important;
            word-break: normal !important;
            word-spacing: 0.1px !important;
            letter-spacing: 0.01px !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }
          .a-met, .ipad-met, .g-met {
            align-items: center !important;
          }
          .phone.apple:not(.ipad) .a-met > div {
            height: 48px !important;
            max-height: 48px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            overflow: hidden !important;
            align-self: center !important;
          }
          .phone.ipad .a-met > div, .dev.landscape .phone.apple:not(.ipad) .a-met > div {
            height: 54px !important;
            max-height: 54px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            overflow: hidden !important;
            align-self: center !important;
          }
          .a-met b[data-b="dev"] {
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            max-height: 26px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: normal !important;
            line-height: 1.15 !important;
            font-size: 11.5px !important;
          }
          .a-met i, .a-met small, .ipad-met i, .ipad-met small {
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .g-name, .a-name, .g-dev, .ipad-name, .ipad-sub {
            display: block !important;
          }
          .sr-meta-line, .gp-search-card-meta {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
          }
          .ipad-compat-notice {
            display: inline-flex !important;
            gap: 5px !important;
            white-space: normal !important;
            word-spacing: normal !important;
          }
          .ipad-compat-notice span {
            white-space: nowrap !important;
          }
          /* Horizontal Screenshot Galleries */
          .gal, [data-shots="gal"], [data-shots="ipad-gal"] {
            display: flex !important;
            scroll-snap-type: none !important;
            overflow: visible !important;
            overflow-x: visible !important;
          }
          .apple .gal img {
            width: 222px !important;
            height: 481px !important;
            border-radius: 11px !important;
            scroll-snap-align: none !important;
            flex-shrink: 0 !important;
            max-width: none !important;
            object-fit: cover !important;
          }
          .apple .gal img.landscape-shot {
            width: 340px !important;
            height: 191px !important;
            border-radius: 9px !important;
          }
          #dev-phone .gal img, .dev.google:not(.gtab) .gal img {
            width: 190px !important;
            height: 412px !important;
            border-radius: 7px !important;
            scroll-snap-align: none !important;
            flex-shrink: 0 !important;
            max-width: none !important;
            object-fit: cover !important;
          }
          #dev-phone .gal img.landscape-shot, .dev.google:not(.gtab) .gal img.landscape-shot {
            width: 330px !important;
            height: 186px !important;
            border-radius: 7px !important;
          }
          .ipad-gal img {
            flex: 0 0 260px !important;
            width: 260px !important;
            height: 563px !important;
            border-radius: 12px !important;
            scroll-snap-align: none !important;
            flex-shrink: 0 !important;
            max-width: none !important;
            object-fit: cover !important;
          }
          .ipad-gal img.ipad-shot {
            height: 347px !important;
          }
          .ipad-gal img.landscape-shot {
            flex: 0 0 380px !important;
            width: 380px !important;
            height: 285px !important;
          }
          .dev.ipad.landscape .ipad-gal img {
            flex: 0 0 230px !important;
            width: 230px !important;
            height: 498px !important;
          }
          .dev.ipad.landscape .ipad-gal img.ipad-shot {
            height: 307px !important;
          }
          .dev.ipad.landscape .ipad-gal img.landscape-shot {
            flex: 0 0 380px !important;
            width: 380px !important;
            height: 285px !important;
          }

          /* Search Results Screenshots: 3-column proportional aspect ratio */
          .sr-shots, [data-shots="shots"] {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .sr-shots img, .sr-shots .sr-skel-shot, [data-shots="shots"] img {
            width: 104px !important;
            height: 225px !important;
            max-width: 104px !important;
            flex: 0 0 104px !important;
            border-radius: 12px !important;
            object-fit: cover !important;
          }
          .sr-shots img.landscape-shot, [data-shots="shots"] img.landscape-shot {
            width: 328px !important;
            height: 185px !important;
            max-width: 328px !important;
            flex: 0 0 328px !important;
          }

          .gp-search-shots, [data-shots="gp-search"] {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
            margin-top: 12px !important;
            box-sizing: border-box !important;
          }
          .gp-search-shots img, .gp-search-shots .gp-skel-shot, [data-shots="gp-search"] img {
            width: 104px !important;
            height: 220px !important;
            max-width: 104px !important;
            flex: 0 0 104px !important;
            border-radius: 10px !important;
            object-fit: cover !important;
          }
          .gp-search-shots img.landscape-shot, [data-shots="gp-search"] img.landscape-shot {
            width: 328px !important;
            height: 185px !important;
            max-width: 328px !important;
            flex: 0 0 328px !important;
          }

          .ipad-sr-media, [data-shots="ipad-shots"], .ipad-sr-skel-shots {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .ipad-sr-media.has-landscape, [data-shots="ipad-shots"].has-landscape,
          .ipad-search-view.has-landscape .ipad-sr-skel-shots,
          .ipad-search-view:has(.has-landscape) .ipad-sr-skel-shots {
            grid-template-columns: 1fr !important;
          }
          .dev.ipad:not(.landscape) .ipad-sr-media img,
          .dev.ipad:not(.landscape) [data-shots="ipad-shots"] img,
          .dev.ipad:not(.landscape) .ipad-skel-shot {
            width: 152px !important;
            height: 203px !important;
            max-width: 152px !important;
            border-radius: 10px !important;
            object-fit: cover !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          .dev.ipad:not(.landscape) .ipad-sr-media img.landscape-shot,
          .dev.ipad:not(.landscape) [data-shots="ipad-shots"] img.landscape-shot,
          .dev.ipad:not(.landscape) .ipad-search-view.has-landscape .ipad-skel-shot {
            width: 312px !important;
            height: 234px !important;
            max-width: 312px !important;
          }
          .dev.ipad.landscape .ipad-sr-media img,
          .dev.ipad.landscape [data-shots="ipad-shots"] img,
          .dev.ipad.landscape .ipad-skel-shot {
            width: 209px !important;
            height: 279px !important;
            max-width: 209px !important;
            border-radius: 10px !important;
            object-fit: cover !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          .dev.ipad.landscape .ipad-sr-media img.landscape-shot,
          .dev.ipad.landscape [data-shots="ipad-shots"] img.landscape-shot,
          .dev.ipad.landscape .ipad-search-view.has-landscape .ipad-skel-shot {
            width: 427px !important;
            height: 320px !important;
            max-width: 427px !important;
          }
          .dev.gtab10 #galTab10 img {
            height: 240px !important;
            width: auto !important;
            border-radius: 12px !important;
          }
          .dev.gtab10.portrait #galTab10 img {
            height: 320px !important;
            width: auto !important;
          }
          .dev.gtab7 .gt-gal img {
            height: 175px !important;
            width: auto !important;
            border-radius: 7px !important;
          }
          .dev.gtab7.portrait .gt-gal img {
            height: 270px !important;
            width: auto !important;
          }
          .g-dl-icon, .gt10-dl-icon, [data-gmet-size] svg {
            width: 16px !important;
            height: 16px !important;
            display: block !important;
          }
          .phone.google[data-theme=dark] .g-dl-icon,
          .phone.google[data-theme=dark] .gt10-dl-icon,
          .phone.google[data-theme=dark] [data-gmet-size] svg,
          .dev.gtab7 .phone.google[data-theme=dark] [data-gmet-size] svg {
            stroke: #e8eaed !important;
            color: #e8eaed !important;
          }
          .phone.google[data-theme=light] .g-dl-icon,
          .phone.google[data-theme=light] .gt10-dl-icon,
          .phone.google[data-theme=light] [data-gmet-size] svg,
          .dev.gtab7 .phone.google[data-theme=light] [data-gmet-size] svg {
            stroke: #202124 !important;
            color: #202124 !important;
          }
        `;
        clonedDoc.head.appendChild(btnStyle);

        clonedEl.style.zoom = '1';
        clonedEl.style.transform = 'none';
        clonedEl.style.animation = 'none';
        clonedEl.style.transition = 'none';

        // Always hide developer labels in exported mockups
        clonedDoc.querySelectorAll('.dev-label').forEach(l => l.style.display = 'none');

        if(isDual){
          clonedEl.style.paddingTop = '0px';
          clonedEl.style.paddingBottom = '0px';
          clonedEl.style.paddingLeft = '0px';
          clonedEl.style.paddingRight = '0px';
          clonedEl.style.gap = '28px';
          clonedEl.style.width = `${w}px`;
          clonedEl.style.height = `${h}px`;
          clonedEl.style.justifyContent = 'flex-start';
        }
        clonedDoc.querySelectorAll('.dev').forEach(d => {
          d.classList.remove('dev-enter', 'dev-exit', ...(typeof ALL_TRANS_CLASSES !== 'undefined' ? ALL_TRANS_CLASSES : []));
          d.style.zoom = '1';
          d.style.animation = 'none';
          d.style.transition = 'none';
          if(isDual && opts.frameless){
            d.style.padding = '0';
            d.style.background = 'none';
            d.style.boxShadow = 'none';
            d.style.width = 'auto';
            d.style.height = 'auto';
          } else if(!opts.frameless && !d.classList.contains('landscape') && !d.classList.contains('gtab')){
            const addBtn = (side, top, height) => {
              const b = clonedDoc.createElement('div');
              const isLeft = side === 'left';
              b.style.cssText = `position:absolute;${isLeft ? 'left:-5px;border-radius:3px 0 0 3px;background:linear-gradient(90deg,#565860 0%,#36383e 55%,#1d1e22 100%)' : 'right:-5px;border-radius:0 3px 3px 0;background:linear-gradient(90deg,#1d1e22 0%,#36383e 45%,#565860 100%)'};top:${top}px;width:5px;height:${height}px;box-shadow:0 0 0 1px #0b0b0d;pointer-events:none;`;
              d.appendChild(b);
            };
            if(d.classList.contains('ipad')){
              addBtn('left', 220, 70);
              addBtn('right', 220, 120);
            } else if(d.classList.contains('apple')){
              addBtn('left', 144, 34);
              addBtn('left', 198, 62);
              addBtn('left', 274, 62);
              addBtn('right', 214, 98);
            } else if(d.classList.contains('google')){
              addBtn('right', 184, 48);
              addBtn('right', 250, 96);
            }
          }
          if(opts.transparent){
            d.style.boxShadow = '0 0 0 1.5px #0b0b0d';
            d.style.filter = 'none';
          }
          d.style.transform = 'none';
          d.style.perspective = 'none';
          d.style.transformStyle = 'flat';
          d.style.willChange = 'auto';

          const phone = d.querySelector('.phone');
          if(phone){
            phone.style.transform = 'none';
            phone.style.perspective = 'none';
            phone.style.transformStyle = 'flat';
            phone.style.willChange = 'auto';

            const isDark = phone.dataset.theme === 'dark';
            const isGoogle = d.classList.contains('google');
            const solidBg = isDark ? (isGoogle ? '#131313' : '#000000') : '#ffffff';
            phone.style.backgroundColor = solidBg;
            phone.style.background = solidBg;
            phone.style.overflow = 'hidden';

            const sb = phone.querySelector('.sb');
            if(sb){
              sb.style.backgroundColor = solidBg;
              sb.style.background = solidBg;
            }
            const scr = phone.querySelector('.scr');
            if(scr){
              scr.style.backgroundColor = solidBg;
              scr.style.background = solidBg;
              scr.style.overflow = 'hidden';
              scr.style.overflowY = 'hidden';
              scr.style.overflowX = 'hidden';
              scr.scrollTop = 0;
              scr.scrollLeft = 0;
            }
            const gnav = phone.querySelector('.gnav');
            if(gnav){
              gnav.style.backgroundColor = isDark ? '#1C2023' : '#f1f3f4';
              gnav.style.position = 'absolute';
              gnav.style.bottom = '0px';
              gnav.style.left = '0px';
              gnav.style.right = '0px';
              gnav.style.zIndex = '10';
              if(isDark) gnav.style.borderTopColor = 'rgba(255,255,255,.08)';
            }
            const tab = phone.querySelector('.tab');
            if(tab){
              tab.style.background = isDark ? '#1c1c1e' : '#ffffff';
              tab.style.backgroundColor = isDark ? '#1c1c1e' : '#ffffff';
              tab.style.boxShadow = isDark ? '0 8px 32px rgba(0,0,0,.6)' : '0 8px 30px rgba(0,0,0,.15)';
            }
            const hi = phone.querySelector('.hi');
            if(hi){
              hi.style.zIndex = '12';
            }
          }
        });
        // Crucial: Wait for all images in the cloned document to complete decoding first
        await waitForAllImages(clonedEl);

        // Ensure screenshot carousels and images are fully visible and explicitly sized in Firefox & WebKit
        clonedEl.querySelectorAll('.gal, [data-shots]').forEach(gal => {
          gal.scrollLeft = 0;
          gal.style.scrollSnapType = 'none';
          gal.style.overflow = 'visible';
          gal.style.overflowX = 'visible';
        });
        clonedEl.querySelectorAll('.gal img, [data-shots] img').forEach(img => {
          img.style.scrollSnapAlign = 'none';
          img.style.flexShrink = '0';
          img.style.maxWidth = 'none';
          img.style.objectFit = 'cover';
          const isLandscape = img.classList.contains('landscape-shot');
          const isIpadShot = img.classList.contains('ipad-shot');
          const isIpad = img.closest('.ipad');
          const isGtab10 = img.closest('.gtab10, #dev-tab10');
          const isGtab7 = img.closest('.gtab7, #dev-tab7');
          const isApple = img.closest('.apple') && !isIpad;
          const isGoogle = img.closest('.google') && !isGtab10 && !isGtab7;
          const isDevLandscape = img.closest('.dev')?.classList.contains('landscape');
          const isTabPortrait = img.closest('.dev')?.classList.contains('portrait');

          const ratio = (img.naturalWidth && img.naturalHeight)
            ? (img.naturalWidth / img.naturalHeight)
            : (isLandscape ? (16 / 9) : (460 / 996));

          const isSearch = img.closest('.sr-shots, .gp-search-shots, .ipad-sr-media, [data-shots="shots"], [data-shots="gp-search"], [data-shots="ipad-shots"]');
          if (isSearch) {
            const isAppleSearch = img.closest('.sr-shots, [data-shots="shots"]');
            const isGoogleSearch = img.closest('.gp-search-shots, [data-shots="gp-search"]');
            const isIpadSearch = img.closest('.ipad-sr-media, [data-shots="ipad-shots"]');
            const isShotLandscape = isLandscape || ratio > 1.15;

            if (isAppleSearch) {
              const w = isShotLandscape ? 328 : 104;
              const h = isShotLandscape ? 185 : 225;
              img.style.setProperty('width', w + 'px', 'important');
              img.style.setProperty('height', h + 'px', 'important');
              img.style.setProperty('max-width', w + 'px', 'important');
              img.style.flex = `0 0 ${w}px`;
              img.style.borderRadius = '12px';
            } else if (isGoogleSearch) {
              const w = isShotLandscape ? 328 : 104;
              const h = isShotLandscape ? 185 : 220;
              img.style.setProperty('width', w + 'px', 'important');
              img.style.setProperty('height', h + 'px', 'important');
              img.style.setProperty('max-width', w + 'px', 'important');
              img.style.flex = `0 0 ${w}px`;
              img.style.borderRadius = '10px';
            } else if (isIpadSearch) {
              const w = isDevLandscape
                ? (isShotLandscape ? 427 : 209)
                : (isShotLandscape ? 312 : 152);
              const h = isDevLandscape
                ? (isShotLandscape ? 320 : 279)
                : (isShotLandscape ? 234 : 203);
              img.style.setProperty('width', w + 'px', 'important');
              img.style.setProperty('height', h + 'px', 'important');
              img.style.setProperty('max-width', w + 'px', 'important');
              img.style.borderRadius = '10px';
            }
            return;
          }

          if (isIpad) {
            if (isIpadShot) {
              const h = isLandscape ? 285 : (isDevLandscape ? 307 : 347);
              const w = Math.round(h * (img.naturalWidth && img.naturalHeight ? ratio : (isLandscape ? (4 / 3) : (3 / 4))));
              img.style.setProperty('width', w + 'px', 'important');
              img.style.setProperty('height', h + 'px', 'important');
            } else {
              const w = isLandscape ? 380 : (isDevLandscape ? 230 : 260);
              const h = Math.round(w / ratio);
              img.style.setProperty('width', w + 'px', 'important');
              img.style.setProperty('height', h + 'px', 'important');
            }
            img.style.borderRadius = '12px';
          } else if (isGtab10) {
            const h = isTabPortrait ? 320 : 240;
            const w = Math.round(h * ratio);
            img.style.setProperty('width', w + 'px', 'important');
            img.style.setProperty('height', h + 'px', 'important');
            img.style.borderRadius = '12px';
          } else if (isGtab7) {
            const h = isTabPortrait ? 270 : 175;
            const w = Math.round(h * ratio);
            img.style.setProperty('width', w + 'px', 'important');
            img.style.setProperty('height', h + 'px', 'important');
            img.style.borderRadius = '7px';
          } else if (isApple) {
            const isShotLandscape = isLandscape || ratio > 1.15;
            img.style.setProperty('width', (isShotLandscape ? 340 : 222) + 'px', 'important');
            img.style.setProperty('height', (isShotLandscape ? 191 : 481) + 'px', 'important');
            img.style.borderRadius = isShotLandscape ? '9px' : '11px';
          } else if (isGoogle) {
            const isShotLandscape = isLandscape || ratio > 1.15;
            img.style.setProperty('width', (isShotLandscape ? 330 : 190) + 'px', 'important');
            img.style.setProperty('height', (isShotLandscape ? 186 : 412) + 'px', 'important');
            img.style.borderRadius = '7px';
          }
        });
        // Ensure SVG elements retain accurate computed stroke, fill, stroke-width and color
        // when serialized to detached data-URI SVG images by html2canvas (Safari / WebKit)
        const win = clonedDoc.defaultView || window;
        clonedEl.querySelectorAll('svg').forEach(svg => {
          const comp = win.getComputedStyle(svg);
          const compColor = comp.color || '#000000';
          const strokeVal = (svg.getAttribute('stroke') === 'currentColor') ? compColor : (svg.getAttribute('stroke') || comp.stroke || compColor);
          const fillVal = (svg.getAttribute('fill') === 'currentColor') ? compColor : (svg.getAttribute('fill') || comp.fill);

          svg.style.color = compColor;
          if (svg.getAttribute('stroke') === 'currentColor' || !svg.getAttribute('stroke')) {
            svg.setAttribute('stroke', strokeVal);
          }
          if (svg.getAttribute('fill') === 'currentColor') {
            svg.setAttribute('fill', fillVal);
          }

          if (!svg.getAttribute('stroke-width') && comp.strokeWidth && comp.strokeWidth !== 'none' && comp.strokeWidth !== '0px') {
            svg.setAttribute('stroke-width', comp.strokeWidth.replace('px', ''));
          }

          // Bake explicit stroke and fill on children to ensure WebKit/Blink SVG image serializer doesn't drop inherited stroke
          svg.querySelectorAll('path, polyline, line, polygon, circle, rect, ellipse').forEach(child => {
            if (child.getAttribute('stroke') === 'currentColor' || (!child.getAttribute('stroke') && strokeVal && strokeVal !== 'none')) {
              child.setAttribute('stroke', strokeVal);
            }
            if (child.getAttribute('fill') === 'currentColor') {
              child.setAttribute('fill', fillVal);
            }
            if (!child.getAttribute('stroke-width') && svg.getAttribute('stroke-width')) {
              child.setAttribute('stroke-width', svg.getAttribute('stroke-width'));
            }
          });
        });

        // Ensure Google Play age rating badge retains centered text & tight box
        clonedEl.querySelectorAll('.g-age-badge, [data-age-google-badge]').forEach(el => {
          el.style.display = 'inline-block';
          el.style.width = '16px';
          el.style.height = '16px';
          el.style.lineHeight = '14px';
          el.style.textAlign = 'center';
          el.style.verticalAlign = 'middle';
          el.style.boxSizing = 'border-box';
          el.style.padding = '0';
        });

        // Ensure tooltip info icon retains clean margin and baseline alignment in html2canvas
        clonedEl.querySelectorAll('.g-info-ico').forEach(el => {
          el.style.display = 'inline-block';
          el.style.width = '10px';
          el.style.height = '10px';
          el.style.marginLeft = '3px';
          el.style.verticalAlign = '-2px';
        });

        // Ensure text elements preserve word spacing across all browsers (especially Firefox)
        // Skip metrics elements (.a-met, .ipad-met, .g-met) so their strict height and clamping are never compromised
        clonedEl.querySelectorAll('.sr-title, .sr-subtitle, .sr-category, .sr-dev, .gp-search-card-name, .gp-search-card-meta, .g-name, .a-name, .g-dev, .a-sub, .ipad-name, .ipad-sub, [data-b]').forEach(el => {
          if (el.closest('.a-met, .ipad-met, .g-met')) return;
          el.style.whiteSpace = 'pre-wrap';
          el.style.wordSpacing = '0.1px';
          el.style.letterSpacing = '0.01px';
          el.style.overflow = 'visible';
          el.style.textOverflow = 'clip';
        });

        // Enforce clamped metrics developer name and clean single-line labels in export
        clonedEl.querySelectorAll('.a-met b[data-b="dev"]').forEach(el => {
          el.style.webkitLineClamp = '2';
          el.style.webkitBoxOrient = 'vertical';
          el.style.display = '-webkit-box';
          el.style.overflow = 'hidden';
          el.style.maxHeight = '26px';
          el.style.whiteSpace = 'normal';
          el.style.lineHeight = '1.15';
        });

        // Strip focus highlight from export capture
        clonedDoc.querySelectorAll('.hl-target, .hl-flash').forEach(el => {
          el.classList.remove('hl-target', 'hl-flash');
          el.style.outline = 'none';
          el.style.boxShadow = 'none';
        });

        // Settle layout in cloned iframe before parsing
        await new Promise(r => setTimeout(r, 60));
      }
    });
    if(EXPORT_WM && !opts.transparent) canvas = addMockupNote(canvas, scaleFactor);
    if(opts.watermark) drawStudioWatermark(canvas);

    const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
    const slug = (typeof slugify === 'function') ? slugify(rawName, 'app') : (rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app');
    const link = document.createElement('a');
    const typeLabel = opts.watermark ? 'mockup-sample-watermark' : (opts.frameless ? 'screen' : (opts.transparent ? 'mockup-transparent' : 'preview'));
    link.download = `${slug}-${devSlug}-${typeLabel}-${scaleFactor}x.png`;
    link.href = canvas.toDataURL('image/png');

    if(opts.action === 'copy'){
      if(navigator.clipboard && window.ClipboardItem && canvas.toBlob){
        canvas.toBlob(blob => {
          if(!blob){
            link.click();
            showToast('Downloaded PNG (clipboard blob failed)', 'info');
            return;
          }
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => {
              if (typeof opts.onSuccess === 'function') {
                opts.onSuccess();
              }
            })
            .catch(() => {
              link.click();
              showToast('Downloaded PNG (clipboard write restricted)', 'info');
            });
        }, 'image/png');
      } else {
        link.click();
        showToast('Downloaded PNG (clipboard not supported)', 'info');
      }
    } else {
      link.click();
      if(opts.watermark){
        showToast('Sample mockup (2x with watermark) downloaded!', 'ok');
      } else {
        showToast(`PNG (${scaleFactor}x${opts.frameless ? ', screen only' : (opts.transparent ? ', transparent cutout' : '')}) downloaded!`, 'ok');
      }
    }
  }catch(err){
    console.error('Export PNG failed:', err);
    showToast('Failed to generate image: ' + err.message, 'warn', 4000);
  }finally{
    if(offscreenWrap){
      offscreenWrap.remove();
    }
    isExporting = false;
  }
}


/* =========================================================================
   Module: src/js/modules/store-import.js
   ========================================================================= */
// Store Preview Studio · Official Apple App Store Import

/**
 * Parses user input (URL or App ID) to extract Apple App ID and optional country code
 * @param {string} input 
 * @returns {{platform: 'apple', id: string, country?: string} | null}
 */
function parseStoreInput(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim();
  if (!raw) return null;

  // 1. Apple App Store URL:
  // e.g. https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
  // e.g. https://itunes.apple.com/app/id324684580
  const appleUrlMatch = raw.match(/(?:apps|itunes)\.apple\.com\/(?:([a-z]{2}(?:-[a-z]{2})?)\/)?(?:app\/[^\/]+\/)?id(\d{7,12})/i);
  if (appleUrlMatch) {
    return { platform: 'apple', id: appleUrlMatch[2], country: appleUrlMatch[1] || '' };
  }

  // 1b. iTunes lookup query URL:
  // e.g. https://itunes.apple.com/lookup?id=324684580&country=us
  const lookupMatch = raw.match(/[?&]id=(\d{7,12})/i);
  if (lookupMatch) {
    const countryMatch = raw.match(/[?&]country=([a-z]{2}(?:-[a-z]{2})?)/i);
    return { platform: 'apple', id: lookupMatch[1], country: countryMatch ? countryMatch[1] : '' };
  }

  // 2. Apple App ID format: "id324684580" or pure numbers "324684580" (7-12 digits)
  if (/^id\d{7,12}$/i.test(raw)) {
    return { platform: 'apple', id: raw.replace(/^id/i, ''), country: '' };
  }
  if (/^\d{7,12}$/.test(raw)) {
    return { platform: 'apple', id: raw, country: '' };
  }

  return null;
}

/**
 * Normalizes official Apple App Store API result into Studio state format
 * @param {object} item 
 * @returns {object}
 */
function normalizeAppleApp(item) {
  if (!item) return null;
  const rawName = (item.trackName || item.trackCensoredName || 'App Name').trim();
  let name = rawName;
  let sub = '';

  const devCompany = (item.artistName || item.sellerName || '').trim();
  const cleanStr = s => (typeof slugify === 'function' ? slugify(s, '').replace(/-/g, '') : (s || '').replace(/[\u0110\u00D0\u0189]/g, 'd').replace(/[\u0111\u00F0\u0256\u0257]/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''));
  const cleanDev = cleanStr(devCompany);

  const splitMatch = rawName.split(/\s*[-–—:]\s*/);
  if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
    const candidateName = splitMatch[0].trim();
    const candidateSub = splitMatch.slice(1).join(' · ').trim();
    const cleanSub = cleanStr(candidateSub);

    // If candidateSub matches or is part of developer/seller company name, it is a company attribution suffix, NOT a subtitle
    const isDevCompany = cleanSub.length >= 3 && cleanDev.includes(cleanSub);
    if (isDevCompany) {
      name = candidateName;
      sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
    } else {
      name = candidateName;
      sub = candidateSub;
    }
  } else {
    sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
  }

  const primaryGenre = item.primaryGenreName || (item.genres && item.genres[0]) || 'Productivity';
  const ratingNum = typeof item.averageUserRating === 'number' ? item.averageUserRating : 4.8;
  const ratingStr = ratingNum.toFixed(1);
  const ratingCount = item.userRatingCount || 1000;

  // High-resolution Retina icons: 1024x1024 for Apple App Store, 512x512 for Google Play
  const rawIcon = item.artworkUrl512 || item.artworkUrl100 || '';
  const icon1024 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png') : '';
  const icon512 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png') : '';
  const iconUrl = icon1024;

  // Screenshots
  const shots = (item.screenshotUrls || []).map(u => {
    const match = u.match(/\/(\d+)x(\d+)bb\.(jpg|png)$/i);
    if (match && parseInt(match[1], 10) > parseInt(match[2], 10)) {
      return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2688x1242bb.png');
    }
    return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1242x2688bb.png');
  }).slice(0, 8);

  const ipadShots = (item.ipadScreenshotUrls || []).map(u => {
    const match = u.match(/\/(\d+)x(\d+)bb\.(jpg|png)$/i);
    if (match && parseInt(match[1], 10) > parseInt(match[2], 10)) {
      return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2732x2048bb.png');
    }
    return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2048x2732bb.png');
  }).slice(0, 8);
  const isUniversal = (Array.isArray(item.features) && item.features.includes('iosUniversal')) || (ipadShots.length > 0);

  // Short description
  const cleanDesc = (item.description || '').replace(/[\r\n]+/g, ' ').trim();
  const firstSentence = cleanDesc.split(/[.!?]\s+/)[0];
  const shortDesc = (firstSentence && firstSentence.length <= 80) ? firstSentence : cleanDesc.slice(0, 80);

  const bundleDomain = item.bundleId ? item.bundleId.split('.').slice(1, 3).reverse().join('.') : 'app.com';

  return {
    platform: 'apple',
    store: 'apple',
    appleDevice: 'iphone',
    form: {
      name: name,
      sub: sub,
      short: shortDesc || 'Download the latest version on iOS and Android.',
      promo: 'Experience ' + name + ' with seamless design and powerful features.',
      dev: item.artistName || item.sellerName || 'App Developer',
      cat: primaryGenre,
      catApple: primaryGenre,
      catGoogle: primaryGenre,
      ver: item.version || '2.4.0',
      rdate: (typeof getCurrentMonthDateStr === 'function') ? getCurrentMonthDateStr(2, true) : 'Oct 26, 2026',
      email: 'support@' + bundleDomain,
      phone: '+1 800-555-0199',
      addr: 'Global',
      privLinked: '',
      privNotLinked: '',
      privGoogle: 'No data shared with third parties, No data collected, Data is encrypted in transit',
      new: (item.releaseNotes || 'Performance improvements and bug fixes.').slice(0, 300),
      desc: (item.description || '').slice(0, 1000)
    },
    icon: iconUrl,
    icon1024: icon1024,
    icon512: icon512,
    iconApple: icon1024,
    iconGoogle: icon512,
    rawIcon: rawIcon,
    isCustomIcon: !!iconUrl,
    shots: shots,
    ipadShots: ipadShots,
    supportsIpad: isUniversal,
    isUniversal: isUniversal,
    featureGraphic: (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''),
    feature: (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''),
    stats: {
      rating: ratingStr,
      ratingsCount: ratingCount,
      age: item.contentAdvisoryRating || '4+',
      chartRank: '1',
      developer: item.artistName || item.sellerName || ''
    }
  };
}

/**
 * Fetches Apple App Store data via official iTunes API (Native CORS enabled)
 * @param {string} appId 
 * @param {string} country 
 * @returns {Promise<object>}
 */
async function fetchAppleAppData(appId, country) {
  const query = 'id=' + encodeURIComponent(appId) + (country ? '&country=' + encodeURIComponent(country) : '');
  const proxyUrl = '/api/lookup?' + query;
  const directUrl = 'https://itunes.apple.com/lookup?' + query;

  let res;
  const isWeb = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:');
  if (isWeb) {
    try {
      res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Proxy returned ' + res.status);
    } catch (_) {
      res = await fetch(directUrl);
    }
  } else {
    res = await fetch(directUrl);
  }

  if (!res.ok) throw new Error('Apple App Store returned status ' + res.status);
  const data = await res.json();
  if (!data || !data.resultCount || !data.results || !data.results.length) {
    throw new Error('App not found on Apple App Store (ID: ' + appId + ')');
  }
  return normalizeAppleApp(data.results[0]);
}

/**
 * Unified fetch entrypoint for parsed store target
 * @param {{platform: 'apple', id: string, country?: string}} target 
 * @returns {Promise<object>}
 */
async function fetchStoreAppData(target) {
  if (!target || !target.id) {
    throw new Error('Invalid Apple App Store target');
  }
  return await fetchAppleAppData(target.id, target.country);
}

/**
 * Applies imported store app state to Studio, re-renders, and saves draft
 * @param {object} state 
 * @returns {boolean}
 */
function applyImportedStoreApp(state) {
  if (!state) return false;

  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;

  // Auto select Apple App Store and iPhone device
  if (state.icon1024) CUSTOM_ICON_1024 = state.icon1024;
  else if (state.iconApple) CUSTOM_ICON_1024 = state.iconApple;
  else if (state.icon) CUSTOM_ICON_1024 = state.icon;

  if (state.icon512) CUSTOM_ICON_512 = state.icon512;
  else if (state.iconGoogle) CUSTOM_ICON_512 = state.iconGoogle;

  if (typeof setStore === 'function') {
    setStore('apple', false);
  }
  if (typeof setAppleDevice === 'function') {
    setAppleDevice('iphone', false);
  }

  // Reset Feature Graphic: Apple App Store does not provide Google Play Feature Graphic.
  // Explicitly clear it so no old preset graphic is automatically embedded.
  FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
  state.featureGraphic = FEATURE_GRAPHIC;
  state.feature = FEATURE_GRAPHIC;

  // Apply to studio state
  if (typeof applyStateObject === 'function') {
    applyStateObject(state);
  }

  // Ensure Feature Graphic remains completely cleared after applying state
  FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');

  // Double ensure store & device buttons reflect selection after state apply
  if (typeof setStore === 'function') {
    setStore('apple', false);
  }
  if (typeof setAppleDevice === 'function') {
    setAppleDevice('iphone', false);
  }

  // Rerender all components
  if (typeof renderIcons === 'function') renderIcons();
  if (typeof renderFeature === 'function') renderFeature();
  if (typeof validateFeatureGraphic === 'function') validateFeatureGraphic();
  if (typeof renderShots === 'function') renderShots();
  if (typeof renderIpadShots === 'function') renderIpadShots();
  if (typeof renderTablets === 'function') renderTablets();
  if (typeof renderStats === 'function') renderStats();
  if (typeof syncStatInputs === 'function') syncStatInputs();
  if (typeof update === 'function') update();

  if (typeof getCurrentStateObject === 'function') {
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
  }
  if (typeof saveDraftToStorage === 'function') saveDraftToStorage();

  if (typeof updatePresetBanner === 'function') updatePresetBanner();
  if (typeof updateDraftPill === 'function') updateDraftPill();
  if (typeof syncAllVtPills === 'function') syncAllVtPills();
  if (typeof fit === 'function') fit();

  const appName = state.form && state.form.name ? state.form.name : 'App';
  if (typeof showToast === 'function') {
    showToast('Imported ' + appName + ' from App Store successfully');
  }

  return true;
}

/**
 * Checks whether browser/environment has active network connectivity
 * @returns {boolean}
 */
function isNetworkOnline() {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Updates dynamic network indicator banner inside import modal
 */
function updateStoreImportNetworkStatus() {
  const banner = $('storeImportNetworkBanner');
  if (!banner) return;
  const online = isNetworkOnline();
  if (!online) {
    banner.className = 'store-import-network-banner offline';
    banner.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
      <span><strong>Offline Mode Detected</strong>: Store Preview Studio operates 100% offline. To import live app data from Apple, please turn on your Wi-Fi or internet connection.</span>
    `;
  } else {
    banner.className = 'store-import-network-banner online';
    banner.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <span><strong>100% Offline Core</strong>: Your data never leaves this device. Connects to <code>itunes.apple.com</code> only with your permission.</span>
    `;
  }
}

/**
 * Prompts user to confirm enabling network connection or turning on network
 * due to Studio's 100% offline commitment
 * @param {{
 *   onConfirm: Function,
 *   onCancel?: Function,
 *   url?: string,
 *   title?: string,
 *   desc?: string,
 *   offlineTitle?: string,
 *   offlineDesc?: string,
 *   okText?: string,
 *   offlineOkText?: string,
 *   cancelText?: string
 * }} options 
 */
function showNetworkConfirmModal(options) {
  const modal = $('networkConfirmModal');
  if (!modal) {
    if (options && typeof options.onConfirm === 'function') options.onConfirm();
    return;
  }

  const isOffline = !isNetworkOnline();
  const iconWrap = $('networkConfirmIconWrap') || modal.querySelector('.confirm-modal-icon-wrap');
  const titleEl = $('networkConfirmTitle');
  const descEl = $('networkConfirmDesc');
  const okBtn = $('networkConfirmOk');
  const cancelBtn = $('networkConfirmCancel');

  let targetDomain = '';
  if (options && options.url) {
    try {
      targetDomain = new URL(options.url).hostname;
    } catch (e) {
      targetDomain = options.url;
    }
  }

  if (isOffline) {
    if (iconWrap) {
      iconWrap.className = 'confirm-modal-icon-wrap network-confirm-icon-wrap offline';
      iconWrap.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.56 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>';
    }
    if (titleEl) titleEl.textContent = options?.offlineTitle || 'Turn On Network Connection';
    if (descEl) {
      if (options?.offlineDesc) {
        descEl.innerHTML = options.offlineDesc;
      } else if (targetDomain) {
        descEl.innerHTML = `Store Preview Studio operates <strong>100% offline</strong> with zero tracking. To view external guidelines at <code>${targetDomain}</code>, you must turn on your Wi-Fi or internet connection.<br><br>Please connect to the internet and try again.`;
      } else {
        descEl.innerHTML = 'Store Preview Studio operates <strong>100% offline</strong> with zero tracking. To import live app metadata from Apple, you must turn on your Wi-Fi or internet connection.<br><br>Please connect to the internet and try again.';
      }
    }
    if (okBtn) {
      okBtn.textContent = options?.offlineOkText || "I've Turned It On";
      okBtn.className = 'confirm-btn-reset store-import-btn-submit';
    }
  } else {
    if (iconWrap) {
      iconWrap.className = 'confirm-modal-icon-wrap network-confirm-icon-wrap';
      iconWrap.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
    }
    if (titleEl) titleEl.textContent = options?.title || 'Allow Network Connection?';
    if (descEl) {
      if (options?.desc) {
        descEl.innerHTML = options.desc;
      } else if (targetDomain) {
        descEl.innerHTML = `Store Preview Studio operates <strong>100% offline</strong> with zero tracking. Opening external guidelines requires connecting to <code>${targetDomain}</code>.<br><br>Do you want to enable network access to open this link in a new tab?`;
      } else {
        descEl.innerHTML = 'Store Preview Studio operates <strong>100% offline</strong> with zero tracking. Importing live app metadata requires connecting to Apple\'s official API (<code>itunes.apple.com</code>).<br><br>Do you want to enable network access to fetch this app?';
      }
    }
    if (okBtn) {
      okBtn.textContent = options?.okText || (options?.url ? 'Allow & Open Link' : 'Allow & Connect');
      okBtn.className = 'confirm-btn-reset network-btn-confirm';
    }
  }

  if (cancelBtn) {
    cancelBtn.textContent = options?.cancelText || 'Stay Offline';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    }
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    }
  };

  if (okBtn) {
    okBtn.onclick = () => {
      closeModal();
      if (!isNetworkOnline()) {
        if (typeof setStoreImportStatus === 'function' && !options?.url) {
          setStoreImportStatus('error', 'Still offline. Please connect to the internet (Wi-Fi/Cellular) and try again.');
        } else if (typeof showToast === 'function') {
          showToast('Still offline. Please connect to the internet and try again.');
        }
        return;
      }
      if (options && typeof options.onConfirm === 'function') {
        options.onConfirm();
      }
    };
  }

  document.addEventListener('keydown', handleKey);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  if (okBtn) okBtn.focus();
}

/**
 * Modal UI Controllers
 */
function openStoreImportModal() {
  const modal = $('storeImportModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  const input = $('storeImportInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 80);
  }

  const status = $('storeImportStatus');
  if (status) {
    status.style.display = 'none';
    status.className = 'store-import-status';
    status.textContent = '';
  }

  updateStoreImportNetworkStatus();
}

function closeStoreImportModal() {
  const modal = $('storeImportModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function setStoreImportStatus(type, message) {
  const status = $('storeImportStatus');
  if (!status) return;
  if (!message) {
    status.style.display = 'none';
    status.textContent = '';
    return;
  }
  status.className = 'store-import-status ' + (type || 'info');
  status.textContent = message;
  status.style.display = 'block';
}

async function handleStoreImportSubmit(confirmed = false, isAutoFromUrl = false) {
  const input = $('storeImportInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    setStoreImportStatus('error', 'Please enter an App Store link or Apple App ID.');
    input.focus();
    return;
  }

  const target = parseStoreInput(val);
  if (!target) {
    if (val.includes('play.google.com') || /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]+)+$/.test(val)) {
      setStoreImportStatus('error', 'Google Play does not provide a public API. Please enter an Apple App Store link or numeric App ID (e.g. 324684580).');
    } else {
      setStoreImportStatus('error', 'Unrecognized App Store link or ID format. Try an Apple App Store URL or numeric App ID (e.g. 324684580).');
    }
    return;
  }

  // 1. Check network connection first
  if (!isNetworkOnline()) {
    updateStoreImportNetworkStatus();
    showNetworkConfirmModal({
      onConfirm: () => handleStoreImportSubmit(true),
      onCancel: () => setStoreImportStatus('info', 'Kept in 100% offline mode.')
    });
    setStoreImportStatus('error', 'No internet connection detected. Please turn on your Wi-Fi or internet connection to import from Apple App Store.');
    return;
  }

  // 2. Ask user to permit network connection due to 100% offline core promise
  if (!confirmed) {
    showNetworkConfirmModal({
      onConfirm: () => handleStoreImportSubmit(true),
      onCancel: () => setStoreImportStatus('info', 'Import cancelled. Kept in 100% offline mode.')
    });
    return;
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Cloning...';
  }

  setStoreImportStatus('info', 'Connecting to Apple App Store API...');

  try {
    const importedState = await fetchStoreAppData(target);
    closeStoreImportModal();

    const apply = () => {
      applyImportedStoreApp(importedState);
    };

    // Cloning replaces the draft: ask first when it holds real work (Cancel keeps it untouched).
    if (typeof confirmReplaceDraft === 'function') {
      const importedName = (importedState && importedState.form && importedState.form.name) || '';
      confirmReplaceDraft(importedName, apply);
    } else {
      apply();
    }
  } catch (err) {
    if (!isNetworkOnline() || err.name === 'TypeError' || (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError')))) {
      setStoreImportStatus('error', 'Network error: Unable to reach Apple App Store. Please check your internet connection and try again.');
    } else {
      setStoreImportStatus('error', err.message || 'Failed to import app data from App Store.');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Clone App';
    }
  }
}

/**
 * Initializes modal event listeners
 */
function initStoreImportEvents() {
  const openBtn = $('btnOpenStoreImport');
  if (openBtn) {
    openBtn.onclick = (e) => {
      e.preventDefault();
      openStoreImportModal();
    };
  }

  const optBtn = $('optImportStore');
  if (optBtn) {
    optBtn.onclick = (e) => {
      e.preventDefault();
      if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
      openStoreImportModal();
    };
  }

  const cancelBtn = $('storeImportCancel');
  if (cancelBtn) {
    cancelBtn.onclick = () => closeStoreImportModal();
  }

  const closeBtn = $('storeImportClose');
  if (closeBtn) {
    closeBtn.onclick = () => closeStoreImportModal();
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.onclick = () => handleStoreImportSubmit();
  }

  const input = $('storeImportInput');
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStoreImportSubmit();
      } else if (e.key === 'Escape') {
        closeStoreImportModal();
      }
    };
  }

  // Quick test chips
  $$('.store-import-chip').forEach(chip => {
    chip.onclick = () => {
      const val = chip.dataset.importVal;
      if (val && input) {
        input.value = val;
        handleStoreImportSubmit();
      }
    };
  });

  const modal = $('storeImportModal');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeStoreImportModal();
    };
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeStoreImportModal();
    }
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      updateStoreImportNetworkStatus();
      if (modal && modal.classList.contains('open')) {
        setStoreImportStatus('info', 'Network connection restored.');
      }
    });
    window.addEventListener('offline', () => {
      updateStoreImportNetworkStatus();
      if (modal && modal.classList.contains('open')) {
        setStoreImportStatus('error', 'Network disconnected. Studio is running in offline mode.');
      }
    });
  }

  // Handle all "Learn more" guideline links with network permission confirmation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.info-pop-link');
    if (!link) return;

    const url = link.getAttribute('href');
    if (!url || url === '#' || url.startsWith('javascript:')) return;

    e.preventDefault();
    e.stopPropagation();

    // Close any open popovers so they don't linger behind the modal
    if (typeof $$ === 'function') {
      $$('.info-popover.open').forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-hidden', 'true');
      });
    }

    showNetworkConfirmModal({
      url,
      onConfirm: () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/**
 * Checks URL parameters on page load and auto-imports if present with user confirmation
 */
function checkAndLoadStoreParams() {
  if (typeof window === 'undefined' || !window.location || !window.location.search) return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const appid = sp.get('appid') || sp.get('apple') || sp.get('app_id') || sp.get('apple_id') || sp.get('id') || sp.get('app');
    const url = sp.get('url') || sp.get('store_url') || sp.get('link') || sp.get('itunes');

    let target = null;
    if (appid) {
      target = parseStoreInput(appid) || { platform: 'apple', id: appid.replace(/^id/i, ''), country: sp.get('country') || '' };
    } else if (url) {
      target = parseStoreInput(url);
    }

    if (target) {
      openStoreImportModal();
      const input = $('storeImportInput');
      if (input) input.value = appid || url;
      showNetworkConfirmModal({
        onConfirm: () => {
          handleStoreImportSubmit(true, true);
        },
        onCancel: () => {
          setStoreImportStatus('info', 'Auto-import paused. Kept in 100% offline mode.');
        }
      });
    }
  } catch (e) {
    console.warn('[StoreImport] URL param check error:', e);
  }
}

// Global exposure for scripts and tests
if (typeof window !== 'undefined') {
  window.parseStoreInput = parseStoreInput;
  window.normalizeAppleApp = normalizeAppleApp;
  window.fetchAppleAppData = fetchAppleAppData;
  window.fetchStoreAppData = fetchStoreAppData;
  window.applyImportedStoreApp = applyImportedStoreApp;
  window.openStoreImportModal = openStoreImportModal;
  window.closeStoreImportModal = closeStoreImportModal;
  window.checkAndLoadStoreParams = checkAndLoadStoreParams;
  window.isNetworkOnline = isNetworkOnline;
  window.showNetworkConfirmModal = showNetworkConfirmModal;
}

// Node.js CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseStoreInput,
    normalizeAppleApp,
    fetchAppleAppData,
    fetchStoreAppData,
    applyImportedStoreApp,
    isNetworkOnline,
    showNetworkConfirmModal
  };
}

if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
  initStoreImportEvents();
}


/* =========================================================================
   Module: src/js/main.js
   ========================================================================= */
// Store Preview Studio · Application Bootstrap & Lifecycle
// --- Dynamic Scaling / Responsive Zoom to Fit Window ---
let isExporting = false;
function fit(force = false){
  if(isExporting) return;
  const st=document.querySelector('.stage');
  if(!st) return;
  const m=isM();
  const padW=m?24:48;
  const padH=m?16:28;
  const tb=document.querySelector('.stage-toolbar');
  const bb=document.querySelector('.stage-bottom-bar');
  const isBbVis = bb && bb.offsetHeight > 0 && (!bb.style.display || bb.style.display !== 'none');
  const bbH=isBbVis ? bb.offsetHeight + 4 : 0;
  const vt=(tb?tb.offsetHeight:38) + bbH + (m?12:20) + 40;
  const isDual = document.body.dataset.dual === 'true' || appleDevice === 'dual' || googleDevice === 'dual';

  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    if(m){
      baseW = isLand ? 870 : 416;
      baseH = (isLand ? 416 : 870) * 2 + 56;
    }else{
      baseW = (isLand ? 870 : 416) * 2 + 28;
      baseH = isLand ? 416 : 870;
    }
  }else if(store === 'apple'){
    if(appleDevice === 'ipad'){
      baseW = 750;
      baseH = 980;
    } else {
      baseW = 416;
      baseH = 870;
    }
  }else if(googleDevice !== 'phone'){
    const land = tabOrient[googleDevice] === 'landscape';
    const [lw, lh] = googleDevice === 'tab7' ? [800, 512] : [1060, 676];
    baseW = land ? lw : lh;
    baseH = land ? lh : lw;
  } else {
    baseW = 416;
    baseH = 870;
  }

  const zw=(st.clientWidth-padW)/baseW;
  const zh=m?9:(st.clientHeight-padH-vt)/(baseH+8);
  const z=Math.max(.28,Math.min(1,zw,zh));

  const lastZ = parseFloat(st.dataset.fitZ || '0');
  if(!force && Math.abs(z - lastZ) < 0.001) return;
  st.dataset.fitZ = z.toFixed(4);

  const sd = $('stageDevices');
  if(sd){
    if(isDual && m){
      sd.style.gap = '56px';
    }else{
      sd.style.gap = Math.round(28 * z) + 'px';
    }
  }

  document.documentElement.style.setProperty('--dev-zoom', z);

  if(!isDual && store === 'apple' && appleDevice === 'ipad'){
    const ipad = document.querySelector('.dev.ipad');
    if(ipad) {
      ipad.style.zoom = z;
      ipad.style.setProperty('--dev-zoom', z);
    }
  }else if(!isDual && store === 'google' && googleDevice !== 'phone'){
    const t = $('dev-' + googleDevice);
    if(t) {
      t.style.zoom = z;
      t.style.setProperty('--dev-zoom', z);
    }
  }else{
    $$('.dev:not(.ipad):not(.gtab)').forEach(d => {
      d.style.zoom = z;
      d.style.setProperty('--dev-zoom', z);
    });
  }
}
function setPanel(p){
  document.body.dataset.panel=p;
  $$('.mtabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
  if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
  requestAnimationFrame(fit);
}
$$('.mtabs button').forEach(b=>b.onclick=()=>setPanel(b.dataset.p));
let resizeRaf = null;
const onStageResize = () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null;
    fit();
    if (typeof syncAllVtPills === 'function') syncAllVtPills();
    if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
  });
};
new ResizeObserver(onStageResize).observe(document.querySelector('.stage'));
addEventListener('resize', onStageResize);
addEventListener('orientationchange', () => setTimeout(onStageResize, 200));


// --- App Initialization ---
store = 'apple';
document.body.dataset.store = 'apple';
document.body.dataset.uiStore = 'apple';
document.body.dataset.dual = 'true';
appleDevice = 'dual';
googleDevice = 'dual';
document.body.dataset.appleDevice = 'iphone';
document.body.dataset.googleDevice = 'phone';
if (typeof setStore === 'function') setStore('apple', false, true);
$$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== store));

if(typeof loadDraftFromStorage === 'function') loadDraftFromStorage();

if(typeof sessionStorage !== 'undefined' && sessionStorage.getItem('sps_reset_to_blank')){
  try{ sessionStorage.removeItem('sps_reset_to_blank'); }catch(_){}
  CURRENT_PRESET_KEY = 'draft';
  loadPreset('none');
  IS_CUSTOM_ICON = false;
  if(typeof userDraft !== 'undefined' && userDraft){
    userDraft.isCustomIcon = false;
    userDraft.icon = (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');
  }
} else if(typeof hasUserDraft === 'function' && hasUserDraft()){
  CURRENT_PRESET_KEY = 'draft';
  loadPreset('draft');
} else if(!loadState()){
  restoring = true;
  try{
    loadPreset('studio');
    if(typeof toggleDualPhone === 'function'){
      toggleDualPhone(true);
    }
  }finally{
    restoring = false;
  }
} else {
  if(typeof initDraftFromCurrentPreset === 'function') initDraftFromCurrentPreset();
  renderIcons();
  renderFeature();
  renderShots();
  renderIpadShots();
  update();
}
if(typeof updatePresetBanner === 'function') updatePresetBanner();
if(typeof updateDraftPill === 'function') updateDraftPill();
setSupportsIpad(SUPPORTS_IPAD);
syncStatInputs();
renderStats();
applyGoogleDevice();
applyTabOrient();
renderTablets();
if(typeof renderReviews === 'function') renderReviews();
if(typeof syncReviewInputs === 'function') syncReviewInputs();
if($('f-rdate') && !$('f-rdate').value){
  $('f-rdate').value = getCurrentMonthDateStr(2, true);
}
if(typeof updateMockupClocks === 'function'){
  updateMockupClocks();
  window.addEventListener('DOMContentLoaded', updateMockupClocks);
  window.addEventListener('load', updateMockupClocks);
}
setInterval(() => { if(typeof updateMockupClocks === 'function') updateMockupClocks(); }, 10000);
if(typeof setView === 'function'){
  setView('detail', true);
}
fit();
setTimeout(syncAllVtPills, 10);
setTimeout(syncAllVtPills, 120);
window.addEventListener('load', syncAllVtPills);
if (typeof checkAndLoadStoreParams === 'function') {
  checkAndLoadStoreParams();
}

