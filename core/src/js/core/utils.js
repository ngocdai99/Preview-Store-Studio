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

// --- File & URL-Safe Slug Generator (Full Vietnamese & Accent Support) ---
/**
 * Normalizes app name or arbitrary text into a clean URL- and filesystem-safe slug.
 * Fully supports Vietnamese diacritics (including đ/Đ), accents, and special symbols.
 * 
 * Example:
 *   "AVN PMS-Sức khoẻ Gia Đình Việt" => "avn-pms-suc-khoe-gia-dinh-viet"
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

