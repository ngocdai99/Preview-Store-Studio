/* =========================================================================
   Module: src/js/core/utils.js
   ========================================================================= */
// Store Preview Studio · Core Utilities

/* =========================================================================
   STORE PREVIEW STUDIO · CORE ARCHITECTURE & CLIENT-SIDE LOGIC
   ========================================================================= */

const $=id=>document.getElementById(id), $$=s=>[...document.querySelectorAll(s)];
let store = 'apple';

// --- Reusable Crisp Vector Action Icons ---
const ICO_SPARKLE = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.4 5.4 5.6 2.1-5.6 2.1-2.4 5.4-2.4-5.4-5.6-2.1 5.6-2.1 2.4-5.4zm7.5 12.5l1.2 2.7 2.8 1-2.8 1-1.2 2.8-1.2-2.8-2.8-1 2.8-1 1.2-2.7z"></path></svg></span>`;
const ICO_DL = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>`;
const ICO_UPLOAD = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span>`;

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



// --- File Reader Helper ---
const readFile = (f, cb) => {
  if (typeof FileReader === 'undefined') return;
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
        if(w === 460 && h === 996){ w = 1080; h = 2340; }
        else if(w === 1024 && h === 500){ w = 1024; h = 500; }
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

function getDisplaySrc(src, targetImg = null) {
  if (!src || typeof src !== 'string') return (typeof PH !== 'undefined' ? PH : '');
  if (src.startsWith('data:image/svg+xml') || src.length < 50000 || (typeof PH !== 'undefined' && src === PH)) {
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
  img.onerror=()=>{img.onerror=null;img.src=PH};
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
  btn.onclick=(e)=>{
    e.stopPropagation();
    $$('.menu').forEach(m=>{if(m!==menu)m.classList.remove('show')});
    menu.classList.toggle('show');
  };
}
setupDropdown('btnPresets','menuPresets');
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

function idbSave(key, val) {
  if (typeof indexedDB === 'undefined') return Promise.resolve(false);
  return openAppDB().then(db => {
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.put(val, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch (e) {
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
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }).catch(() => false);
}

// --- SVG to Store-Compliant PNG Rasterizer ---
const SVG_STORE_PNG_CACHE = new Map();

function rasterizeSvgToStorePng(svgSrc, targetSize, callback) {
  if (!svgSrc || typeof svgSrc !== 'string') {
    if (callback) callback(svgSrc);
    return;
  }
  // If already a raster PNG/JPEG data URL or regular URL, pass through
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

      // Draw SVG scaled to target resolution
      ctx.drawImage(img, 0, 0, targetSize, targetSize);

      // Check for transparency across pixels
      const data = ctx.getImageData(0, 0, targetSize, targetSize).data;
      let hasAlpha = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) { hasAlpha = true; break; }
      }

      let finalPng = '';
      if (hasAlpha) {
        // Flood background with opaque base color sampled from top edge or center
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

/**
 * Modern Reset and Confirmation Modal
 * Replaces native browser confirm dialog with custom modal popup.
 *
 * @param {Function} onConfirm - Callback executed when user confirms reset
 */
function showResetConfirmModal(onConfirm) {
  const modal = $('resetConfirmModal');
  if (!modal) {
    if (typeof onConfirm === 'function') onConfirm();
    return;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  const cancelBtn = modal.querySelector('#resetConfirmCancel');
  if (cancelBtn) cancelBtn.onclick = closeModal;

  modal.onclick = e => {
    if (e.target === modal) closeModal();
  };

  const okBtn = modal.querySelector('#resetConfirmOk');
  if (okBtn) {
    okBtn.onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
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
let EXPORT_WM = true;    // add a small "Illustrative mockup" line under exported images
const STAT_INPUTS = {rating:'f-st-rating', count:'f-st-count', rank:'f-st-rank', dl:'f-st-dl', size:'f-st-size', age:'f-st-age', iap:'f-st-iap'};

const GOOGLE_AGE_MAP = {
  '4+':  {badge:'E',    label:'Everyone'},
  '9+':  {badge:'E10+', label:'Everyone 10+'},
  '12+': {badge:'T',    label:'Teen · 12+'},
  '17+': {badge:'M',    label:'Mature 17+'}
};

function renderStats(){
  $$('[data-stat]').forEach(e => { e.textContent = STATS[e.dataset.stat] || ''; });
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || GOOGLE_AGE_MAP['4+'];
  $$('[data-age-apple]').forEach(e => { e.textContent = ageVal; });
  $$('[data-age-google-badge]').forEach(e => { e.textContent = gAge.badge; });
  $$('[data-age-google-lbl]').forEach(e => { e.textContent = gAge.label; });

  const hasRating = !!(STATS.rating && STATS.rating.trim() && STATS.rating.trim() !== '0');
  $$('[data-gmet-rating]').forEach(e => { e.style.display = hasRating ? '' : 'none'; });
  $$('[data-gmet-size]').forEach(e => { e.style.display = hasRating ? 'none' : ''; });

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

  document.body.classList.toggle('stats-off', STATS_OFF);
}
function syncStatInputs(){
  Object.entries(STAT_INPUTS).forEach(([k,id]) => { const el = $(id); if(el) el.value = STATS[k]; });
  const off = $('f-st-off'), wm = $('f-st-wm');
  if(off) off.checked = STATS_OFF;
  if(wm) wm.checked = EXPORT_WM;
}
function applyStatsFromObject(o){
  if(!o || typeof o !== 'object') return;
  Object.keys(STATS_DEFAULT).forEach(k => { if(typeof o[k] === 'string') STATS[k] = o[k].slice(0, 16); });
  if(typeof o.off === 'boolean') STATS_OFF = o.off;
  if(typeof o.wm === 'boolean') EXPORT_WM = o.wm;
}
function statsToObject(){ return {...STATS, off: STATS_OFF, wm: EXPORT_WM}; }
function resetStats(){ Object.assign(STATS, STATS_DEFAULT); STATS_OFF = false; EXPORT_WM = true; syncStatInputs(); renderStats(); }

// --- Built-in Neutral Vector Icon & Screenshot Mockups (100% Offline, 1024x1024 Opaque Square) ---
function makeSvgDataUri(svg){
  let s = svg.trim();
  if(!/<\s*svg[^>]*\bwidth\s*=/i.test(s) && !/<\s*svg[^>]*\bheight\s*=/i.test(s)){
    const vb = s.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
    if(vb){
      let w = Math.round(parseFloat(vb[1]));
      let h = Math.round(parseFloat(vb[2]));
      if(w === 460 && h === 996){ w = 1080; h = 2340; }
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
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="stdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="stdFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#stdBg)"/>
  <rect x="10.5" y="4.5" width="16.5" height="18" rx="2.5" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="1.6"/>
  <circle cx="18.75" cy="6.2" r="0.65" fill="#ffffff"/>
  <rect x="12.5" y="8.5" width="6" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="19.5" y="8.5" width="5.5" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="12.5" y="17" width="12.5" height="3" rx="0.8" fill="#ffffff" opacity="0.5"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="url(#stdFront)"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="rgba(255,255,255,0.22)" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="8.5" y="9.8" width="4.5" height="1.2" rx="0.6" fill="#ffffff"/>
  <rect x="6.8" y="12.5" width="8" height="7.5" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="6.8" y="21.5" width="8" height="3.5" rx="0.8" fill="#ffffff" opacity="0.6"/>
</svg>
`);

const BLANK_ICON = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="c6-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="c6-front" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="url(#c6-bg)"/>
  <rect x="10.5" y="4.5" width="16.5" height="18" rx="2.5" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="1.6"/>
  <circle cx="18.75" cy="6.2" r="0.65" fill="#ffffff"/>
  <rect x="12.5" y="8.5" width="6" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="19.5" y="8.5" width="5.5" height="7" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="12.5" y="17" width="12.5" height="3" rx="0.8" fill="#ffffff" opacity="0.5"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="url(#c6-front)"/>
  <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="rgba(255,255,255,0.22)" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="8.5" y="9.8" width="4.5" height="1.2" rx="0.6" fill="#ffffff"/>
  <rect x="6.8" y="12.5" width="8" height="7.5" rx="1" fill="#ffffff" opacity="0.35"/>
  <rect x="6.8" y="21.5" width="8" height="3.5" rx="0.8" fill="#ffffff" opacity="0.6"/>
</svg>
`);

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

// Fallback placeholder image for broken external links
const PH = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 996">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>
  <rect width="460" height="996" fill="url(#g)"/>
  <text x="230" y="480" font-family="sans-serif" font-size="64" text-anchor="middle" fill="#64748b">🖼</text>
  <text x="230" y="540" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#94a3b8">Image Not Found</text>
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
  <g transform="translate(484, 180)" stroke="#64748b" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="56" height="56" rx="10"/>
    <circle cx="18" cy="18" r="4.5"/>
    <path d="M56 38 L40 22 L12 50"/>
    <path d="M35 38 L42 30 L56 44"/>
  </g>
  <text x="512" y="285" font-family="-apple-system,system-ui,sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#94a3b8">Google Play Feature Graphic (1,024 × 500 px)</text>
  <text x="512" y="320" font-family="-apple-system,system-ui,sans-serif" font-size="14" text-anchor="middle" fill="#64748b">PNG or JPEG · Up to 15 MB · Click or drag image to upload</text>
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
      <rect x="0" y="0" width="105" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="52" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">⚡ Python 3.12</text>
      <rect x="115" y="0" width="115" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="172" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">🤖 PyTorch AI</text>
      <rect x="240" y="0" width="105" height="32" rx="16" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" stroke-width="1"/><text x="292" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fbbf24" text-anchor="middle">⚛ React 19</text>
    </g>
    <g transform="translate(25, 105)">
      <rect x="0" y="0" width="115" height="32" rx="16" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1"/><text x="57" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="middle">📦 REST APIs</text>
      <rect x="125" y="0" width="115" height="32" rx="16" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/><text x="182" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">🎨 UI/UX Figma</text>
      <rect x="250" y="0" width="95" height="32" rx="16" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1"/><text x="297" y="20" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">☁️ AWS Cloud</text>
    </g>
    <text x="25" y="175" font-family="-apple-system,system-ui,sans-serif" font-size="12" fill="#94a3b8">3 Capstone Projects verified by senior engineering mentors</text>
  </g>
</svg>
`);

// Backwards compatibility aliases
const LINGUA_ICON = SKILL_ICON;
const LINGUA_FEATURE = SKILL_FEATURE;
const LINGUA_SHOT_1 = SKILL_SHOT_1;
const LINGUA_SHOT_2 = SKILL_SHOT_2;
const LINGUA_SHOT_3 = SKILL_SHOT_3;
const LINGUA_SHOT_4 = SKILL_SHOT_4;
/* @pro-only-end */

// --- Active State Model ---
let ICON = BLANK_ICON;
let BLANK_ICON_1024 = '';
let BLANK_ICON_512 = '';
let CUSTOM_ICON_1024 = '';
let CUSTOM_ICON_512 = '';
let CURRENT_PRESET_KEY = 'none';
let IS_CUSTOM_ICON = false;
let FEATURE_GRAPHIC = DEFAULT_FEATURE;
let SHOTS = [SHOT_1, SHOT_2, SHOT_3, SHOT_4];
let IPAD_SHOTS = [];
let SUPPORTS_IPAD = false;
let IPAD_FIT_MODE = 'cover';
let REVIEWS = [];
let CURRENT_PRIVACY = {
  linked: "",
  notLinked: "",
  google: "No data shared with third parties, Data is encrypted in transit, You can request data deletion"
};

// --- Templates / Presets Catalog ---
const PRESETS = {
  taskflow: {
    name: "TaskFlow: Daily Habit Planner",
    sub: "Build habits & boost focus",
    promo: "🔥 Spring Productivity Sale! Unlock TaskFlow Pro with smart recurring habits, Pomodoro focus timer, and seamless cloud sync.",
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
    promo: "🔥 Season 4: Neon Uprising is LIVE! Claim your free Legendary Cyber-Blade, pilot mech suits, and team up in 10-player co-op raids!",
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
    promo: "🔥 Flash Sale! Master in-demand skills with 250,000+ top video courses from $9.99. Learn Python, AI, Design & Business with offline downloads.",
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
    const newWidth = Math.min(Math.max(e.clientX, 360), Math.min(window.innerWidth - 360, 850));
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

  // Double-click resizer to reset to default 440px
  editorResizer.addEventListener('dblclick', () => {
    const defaultW = 440;
    document.documentElement.style.setProperty('--editor-w', `${defaultW}px`);
    editorPanel.style.width = `${defaultW}px`;
    localStorage.setItem('sps_editor_w', defaultW);
  });

  // Restore saved width
  const savedW = localStorage.getItem('sps_editor_w');
  if (savedW && !isNaN(savedW)) {
    const w = Math.min(Math.max(parseInt(savedW, 10), 360), 850);
    document.documentElement.style.setProperty('--editor-w', `${w}px`);
    editorPanel.style.width = `${w}px`;
  }
}

// Toggle Sidebar (Hide / Show Form)
function updateSidebarButtonState() {
  const isCollapsed = document.body.classList.contains('sidebar-collapsed');
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
      setPanel(document.body.dataset.panel === 'edit' ? 'view' : 'edit');
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
const slistArea = $('slist').parentElement;
slistArea.addEventListener('dragover',e=>{e.preventDefault()});
slistArea.addEventListener('drop',e=>{
  const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));
  if(files.length){
    e.preventDefault();
    let loaded=0;
    files.forEach(f=>{
      readFile(f,d=>{
        SHOTS.push(d);
        loaded++;
        if(loaded===files.length){
          renderShots();
          saveState();
          showToast(`Added ${files.length} screenshot(s)!`, 'ok');
        }
      });
    });
  }
});



/* =========================================================================
   Module: src/js/modules/shots/icon.js
   ========================================================================= */
// Store Preview Studio - Icon Manager & Real-Time Store Validator
let ICON_FILE_SIZE = 0;
let ICON_FILE_TYPE = '';
let ICON_FILE_NAME = '';

function isPlaceholderIcon(){
  if(typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON) return false;
  if(typeof CURRENT_PRESET_KEY !== 'undefined'){
    if(CURRENT_PRESET_KEY === 'none') return true;
    if(CURRENT_PRESET_KEY === 'draft') return !IS_CUSTOM_ICON;
  }
  if(!ICON || ICON === BLANK_ICON) return true;
  if(typeof BLANK_ICON_1024 !== 'undefined' && BLANK_ICON_1024 && ICON === BLANK_ICON_1024) return true;
  if(typeof BLANK_ICON_512 !== 'undefined' && BLANK_ICON_512 && ICON === BLANK_ICON_512) return true;
  if(typeof ICON === 'string' && (ICON.includes('c6-bg') || ICON.includes('studioBg') || ICON.includes('stdBg'))) return true;
  return false;
}

function updateIconDropZoneUi(){
  const dropZone = $('icoDropZone');
  const inspectBtn = $('icoInspect');
  const badge = $('iconStatusBadge');
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

  if(inspectBtn){
    inspectBtn.disabled = placeholder;
    inspectBtn.classList.toggle('disabled', placeholder);
    inspectBtn.setAttribute('title', placeholder ? 'Upload an app icon to inspect store compliance' : 'Inspect Icon Details & Store Compliance');
  }

  if(badge && placeholder){
    badge.style.display = 'none';
    badge.innerHTML = '';
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
}

let _iconValRunId = 0;
function validateAppIcon(){
  updateIconDropZoneUi();
  const badge = $('iconStatusBadge');
  if(!badge || !ICON) return;
  if(isPlaceholderIcon()){
    badge.style.display = 'none';
    badge.innerHTML = '';
    return;
  }
  badge.style.display = '';
  const targetDim = (store === 'google' ? 512 : 1024);
  const activeIconSrc = (store === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512)
    ? CUSTOM_ICON_512
    : ((store === 'apple' && typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : ICON);

  if(typeof rasterizeSvgToStorePng === 'function' && typeof activeIconSrc === 'string' && activeIconSrc.startsWith('data:image/svg+xml')){
    rasterizeSvgToStorePng(activeIconSrc, targetDim, pngSrc => {
      if(isPlaceholderIcon()){
        badge.style.display = 'none';
        badge.innerHTML = '';
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
  if(!badge || !iconSrc) return;
  const runId = ++_iconValRunId;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if(runId !== _iconValRunId) return;
    const w = img.naturalWidth || (store === 'google' ? 512 : 1024);
    const h = img.naturalHeight || (store === 'google' ? 512 : 1024);
    const isSq = (w === h);

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
      // Official documentation: https://support.google.com/googleplay/android-developer/answer/9866130
      const cornerIdx = [
        (0 * 64 + 0) * 4 + 3,       // Top-left corner
        (0 * 64 + 63) * 4 + 3,      // Top-right corner
        (63 * 64 + 0) * 4 + 3,      // Bottom-left corner
        (63 * 64 + 63) * 4 + 3      // Bottom-right corner
      ];
      hasPreRoundedCorners = cornerIdx.some(idx => data[idx] < 200);
    } catch(e){}

    const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
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
        badge.className = 'ms-icon-status err';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Non-square (${w}×${h} px) · 1:1 square required</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 2: PNG format required
      if(mimeType && !isPng){
        badge.className = 'ms-icon-status warn';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Format notice: PNG format recommended</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 3: 100% Opaque (no alpha channel)
      if(hasAlpha){
        badge.className = 'ms-icon-status err';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Alpha detected · 100% opaque required</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 4: Exact 1024×1024 px dimensions
      if(w !== 1024 || h !== 1024){
        badge.className = 'ms-icon-status warn';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Dimension notice (${w}×${h} px): Apple requires <strong>1024×1024 px</strong></span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Compliant: All criteria met -> clean like marketing, no clunky badge
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
        badge.className = 'ms-icon-status err';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Non-square (${w}×${h} px) · 1:1 square required</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 2: Max file size 1024 KB (1 MB)
      const MAX_GOOGLE_ICON_BYTES = 1024 * 1024;
      if(sizeBytes > MAX_GOOGLE_ICON_BYTES){
        const sizeKb = (sizeBytes / 1024).toFixed(0);
        badge.className = 'ms-icon-status err';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>File size: ${sizeKb} KB · Exceeds 1024 KB limit</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 3: 32-bit PNG format (sRGB color space)
      if(mimeType && !isPng){
        badge.className = 'ms-icon-status err';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Format notice: 32-bit PNG required</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 4: Do not include rounded corners or drop shadows in artwork
      if(hasPreRoundedCorners){
        badge.className = 'ms-icon-status warn';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Pre-rounded corners or shadow detected</span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Rule 5: Target dimensions 512×512 px
      if(w !== 512 || h !== 512){
        badge.className = 'ms-icon-status warn';
        badge.innerHTML = `<span class="ms-status-dot"></span><span>Dimension notice (${w}×${h} px): Google Play requires <strong>512×512 px</strong></span>`;
        badge.style.display = 'inline-flex';
        return;
      }

      // Compliant: All criteria met -> clean like marketing, no clunky badge
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
    if(isPlaceholderIcon()){
      if($('icoFile')) $('icoFile').click();
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
    IS_CUSTOM_ICON = true;
    ICON_FILE_SIZE = f.size || 0;
    ICON_FILE_TYPE = f.type || '';
    ICON_FILE_NAME = f.name || '';
    readFile(f, d => {
      ICON = d;
      if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = d;
      if(typeof downscaleIconTo512 === 'function'){
        downscaleIconTo512(d, d512 => {
          if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
          if(store === 'google'){
            ICON = d512;
            renderIcons();
          }
        });
      }
      if(typeof userDraft !== 'undefined' && userDraft){
        userDraft.icon = d;
        userDraft.icon1024 = d;
        userDraft.isCustomIcon = true;
      }
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
    icoDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      IS_CUSTOM_ICON = true;
      ICON_FILE_SIZE = file.size || 0;
      ICON_FILE_TYPE = file.type || '';
      ICON_FILE_NAME = file.name || '';
      readFile(file, d => {
        ICON = d;
        if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = d;
        if(typeof downscaleIconTo512 === 'function'){
          downscaleIconTo512(d, d512 => {
            if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
            if(store === 'google'){
              ICON = d512;
              renderIcons();
            }
          });
        }
        if(typeof userDraft !== 'undefined' && userDraft){
          userDraft.icon = d;
          userDraft.icon1024 = d;
          userDraft.isCustomIcon = true;
        }
        renderIcons();
        saveState();
        if(typeof updateDraftPill === 'function') updateDraftPill();
        showToast('App icon dropped & applied!', 'ok');
      });
    }
  });
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

  // Validate screenshots count & aspect ratios
  validateScreenshots();
  if(typeof renderIpadShots === 'function') renderIpadShots();

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

    // Thumbnail Preview with Click-to-Inspect
    const thumb = mk(s || PH);
    thumb.style.cursor = 'pointer';
    thumb.title = 'Click to inspect & view details';
    thumb.onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    r.appendChild(thumb);

    // Row Title & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">Screenshot #${i + 1}</span><span class="shot-dim-tag" id="shotDimTag_${i}" style="margin-left:auto;display:none"></span>`;

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button>' +
      '<button class="mini" title="Inspect / View Details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;vertical-align:middle"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Inspect</button>' +
      '<button class="mini" data-m="-1" title="Move Up">&uarr;</button>' +
      '<button class="mini" data-m="1" title="Move Down">&darr;</button>' +
      '<button class="mini del" title="Delete">&times;</button>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    b[1].onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    b[2].onclick = () => mv(i, -1);
    b[3].onclick = () => mv(i, 1);
    b[4].onclick = () => { SHOTS.splice(i, 1); renderShots(); saveState(); };

    col.append(head, act);
    r.appendChild(col);

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

function mv(i, d){
  const j = i + d;
  if(j < 0 || j >= SHOTS.length) return;
  [SHOTS[i], SHOTS[j]] = [SHOTS[j], SHOTS[i]];
  renderShots();
  saveState();
}

let _phoneValRunId = 0;
function validateScreenshots(){
  const runId = ++_phoneValRunId;
  const validShots = SHOTS.filter(s => s && s.trim());
  const validCount = validShots.length;
  const maxAllowed = store === 'apple' ? 10 : 8;
  const minRequired = store === 'apple' ? 1 : 2;

  const counterEl = $('shotCounter');
  if(counterEl){
    counterEl.textContent = `${validCount} / ${maxAllowed} screenshots`;
    counterEl.className = 'cc' + (validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
  }

  const hintEl = $('shotHint');
  if(hintEl){
    if(store === 'apple'){
      hintEl.innerHTML = '<strong>Apple App Store:</strong> Upload 1–10 screenshots per display (iPhone 6.9" 1320×2868 / 1290×2796 px or 6.5" 1284×2778 px). PNG or JPEG, no alpha transparency. Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots. PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px. Drag ⠿ handle to reorder.';
    }
  }

  const badgeEl = $('shotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount < minRequired){
    badgeEl.className = 'shot-status-badge warn';
    badgeEl.innerHTML = `${SB_WARN}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Notice:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'}. Stores require at least <strong>${minRequired} screenshot${minRequired === 1 ? '' : 's'}</strong>.</span>`;
    return;
  }
  if(validCount > maxAllowed){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Rejection Risk:</strong> ${validCount} screenshots. ${store === 'apple' ? 'Apple' : 'Google Play'} allows a maximum of <strong>${maxAllowed} screenshots</strong>.</span>`;
    return;
  }

  let checked = 0;
  const squareIndices = [];
  const nonPhoneIndices = [];
  const sizeIssueIndices = [];

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

      if(w > 0 && h > 0){
        const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
        const isLandscape = w > h * 1.15;
        const isPhonePortrait = h >= w * 1.35;
        const isGoogleSizeIssue = store === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

        if(tag){
          tag.style.display = 'inline-flex';
          if(isSquare){
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `1:1 Square (${w}×${h})`;
          } else if(isGoogleSizeIssue){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Out of Range (${w}×${h})`;
          } else if(isLandscape){
            tag.className = 'shot-dim-tag info';
            tag.textContent = `16:9 Landscape (${w}×${h})`;
          } else if(isPhonePortrait){
            tag.className = 'shot-dim-tag ok';
            tag.textContent = `Portrait (${w}×${h})`;
          } else {
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Non-phone (${w}×${h})`;
          }
        }

        if(isSquare){
          squareIndices.push(idx + 1);
        } else if(!isPhonePortrait && !isLandscape){
          nonPhoneIndices.push(idx + 1);
        }

        if(isGoogleSizeIssue){
          sizeIssueIndices.push(idx + 1);
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
    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      if(store === 'apple'){
        badgeEl.className = 'shot-status-badge err';
        badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Screenshot ${items} is square (1:1). Apple requires portrait phone resolutions (e.g. 1290×2796 px).</span>`;
      } else {
        badgeEl.className = 'shot-status-badge warn';
        badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> Screenshot ${items} is square (1:1). Standard phone screenshots should be portrait (9:16 or 9:19.5). Square photos will be cropped or letterboxed in phone mockups.</span>`;
      }
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Aspect Ratio Notice:</strong> Screenshot ${items} has non-standard ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>`;
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Google Play Error:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Compliant:</strong> ${validCount} screenshots (Valid range: ${minRequired}–${maxAllowed}) · All portrait phone aspect ratios.</span>`;
    }
  }
}

if($('shotFile')){
  $('shotFile').onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
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
    SHOTS.push('');
    renderShots();
    saveState();
    const ins = $$('.srow input');
    if(ins.length) ins[ins.length - 1].focus();
  };
}


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
      hint.innerHTML = '<strong>Universal App Active:</strong> Unlocked iPad Pro 13" screenshot gallery below.';
    } else {
      hint.innerHTML = '<strong>iPhone-only Mode:</strong> Apple does not require iPad screenshots. Enable <strong>iPad</strong> if your Xcode target supports iPad.';
    }
  }

  const ipadCard = $('ipadCard');
  if(ipadCard) ipadCard.style.display = (SUPPORTS_IPAD && store === 'apple') ? '' : 'none';

  $$('.a-platforms-badge').forEach(b => {
    const ipadIco = b.querySelector('.a-plat-ico-ipad');
    const label = b.querySelector('.a-plat-label') || b.querySelector('span');
    if(ipadIco) ipadIco.style.display = SUPPORTS_IPAD ? '' : 'none';
    if(label) label.textContent = SUPPORTS_IPAD ? 'iPhone, iPad' : 'iPhone';
  });

  renderIpadShots();
  validateScreenshots();
}

function renderIpadShots(){
  if(!Array.isArray(IPAD_SHOTS)) IPAD_SHOTS = [];
  IPAD_SHOTS = IPAD_SHOTS.filter(s => typeof s === 'string');

  const validIpadShots = IPAD_SHOTS.filter(s => s && s.trim());
  const validPhoneShots = (SHOTS || []).filter(s => typeof s === 'string' && s.trim());

  // Prioritize dedicated iPad screenshots if present, otherwise fallback to Phone screenshots
  const hasDedicatedIpadShots = validIpadShots.length > 0;
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

  // Update iPad Search Result Carousel
  $$('[data-shots=ipad-shots]').forEach(c => {
    c.innerHTML = '';
    const valid = effectiveShots.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      for(let i = 0; i < 3; i++){
        const sk = document.createElement('div');
        sk.className = 'sr-skel-shot ipad-skel-shot';
        c.appendChild(sk);
      }
    } else {
      valid.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
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

    // Thumbnail Preview with Click-to-Inspect
    const thumb = mk(s || PH);
    thumb.style.cursor = 'pointer';
    thumb.title = 'Click to inspect & view details';
    thumb.onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    r.appendChild(thumb);

    // Row Title & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">iPad Screenshot #${i + 1}</span><span class="shot-dim-tag" id="ipadShotDimTag_${i}" style="margin-left:auto;display:none"></span>`;

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button>' +
      '<button class="mini" title="Inspect / View Details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;vertical-align:middle"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Inspect</button>' +
      '<button class="mini" data-m="-1" title="Move Up">&uarr;</button>' +
      '<button class="mini" data-m="1" title="Move Down">&darr;</button>' +
      '<button class="mini del" title="Delete">&times;</button>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };
    b[1].onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    b[2].onclick = () => mvIpad(i, -1);
    b[3].onclick = () => mvIpad(i, 1);
    b[4].onclick = () => { IPAD_SHOTS.splice(i, 1); renderIpadShots(); saveState(); };

    col.append(head, act);
    r.appendChild(col);

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

function mvIpad(i, d){
  const j = i + d;
  if(j < 0 || j >= IPAD_SHOTS.length) return;
  [IPAD_SHOTS[i], IPAD_SHOTS[j]] = [IPAD_SHOTS[j], IPAD_SHOTS[i]];
  renderIpadShots();
  saveState();
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
  const badgeEl = $('ipadShotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount === 0){
    if(SUPPORTS_IPAD){
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Universal App Notice:</strong> 0 dedicated iPad screenshots uploaded. App Store Connect requires at least <strong>1 iPad screenshot</strong> (2048×2732 px, 4:3) for Universal submission. Mockup is using scaled iPhone fallback.</span>`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>Using Phone Fallback:</strong> No dedicated iPad screenshots uploaded. iPad mockup displays scaled iPhone screenshots.</span>`;
    }
    return;
  }

  if(validCount > 10){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${validCount} screenshots. Apple allows a maximum of <strong>10 screenshots</strong> for iPad.</span>`;
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
        (w === 2048 && h === 2732) || 
        (w === 2064 && h === 2752) || 
        (w === 2732 && h === 2048) || 
        (w === 2752 && h === 2064)
      );

      const ratio = w / h;
      const is3to4 = (Math.abs(ratio - (3/4)) < 0.05) || (Math.abs(ratio - (4/3)) < 0.05);

      if(tag){
        tag.style.display = 'inline-flex';
        if(isExactIpad){
          tag.className = 'shot-dim-tag ok';
          tag.textContent = `iPad Pro 13" (${w}×${h})`;
        } else if(is3to4){
          tag.className = 'shot-dim-tag info';
          tag.textContent = `4:3 Ratio (${w}×${h})`;
        } else if(h > w * 1.5){
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `Phone Ratio (${w}×${h})`;
        } else {
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `Non-standard (${w}×${h})`;
        }
      }

      if(isExactIpad){
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
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> ${noun} ${items} not exact iPad Pro 13" (2048×2732 px or 2064×2752 px).</span>`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>Xcode &amp; App Store Ready:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'} matching iPad Pro 13" standard.</span>`;
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
    readFile(f, d => {
      ipadPick < 0 ? IPAD_SHOTS.push(d) : IPAD_SHOTS[ipadPick] = d;
      ipadPick = -1;
      renderIpadShots();
      saveState();
      showToast('iPad screenshot uploaded!', 'ok');
    });
    e.target.value = '';
  };
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

    if (_activeModalType === 'icon') {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Apple App Icon Inspector' : 'Google Play Icon Inspector';
      if (targetSpec) targetSpec.textContent = _activeModalStore === 'apple' ? 'Standard: 1024×1024 px (1:1 · Opaque)' : 'Standard: 512×512 px (1:1 · ≤1024 KB)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Icon';
    } else if (_activeModalType === 'ipad') {
      if (titleEl) titleEl.textContent = 'Apple iPad Pro 13" Screenshot Inspector';
      if (targetSpec) targetSpec.textContent = 'Standard: 2048×2732 px (3:4 Portrait)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New iPad Screenshot';
    } else if (_activeModalType === 'feature') {
      if (titleEl) titleEl.textContent = 'Google Play Feature Graphic Inspector';
      if (targetSpec) targetSpec.textContent = 'Standard: 1024×500 px (Landscape · ≤15 MB)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Feature Graphic';
    } else {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'iPhone Screenshot Inspector' : 'Android Screenshot Inspector';
      if (targetSpec) targetSpec.textContent = _activeModalStore === 'apple' ? 'Standard: 1290×2796 px (Portrait 9:19.5)' : 'Standard: 1080×1920 px (Portrait 9:16)';
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

    if (!src) {
      if (dimEl) dimEl.textContent = '--';
      if (ratioEl) ratioEl.textContent = '--';
      if (sizeEl) sizeEl.textContent = '--';
      if (formatEl) formatEl.textContent = '--';
      if (badgeEl) { badgeEl.className = 'icon-modal-badge warn'; badgeEl.textContent = 'No Asset'; }
      if (msgEl) { msgEl.className = 'icon-modal-warn-msg'; msgEl.textContent = ''; }
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
      const isSq = (w === h);

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
        if (_activeModalType === 'icon') {
          dimOk = (_activeModalStore === 'apple' && w === 1024 && h === 1024) ||
                  (_activeModalStore === 'google' && w === 512 && h === 512);
        } else if (_activeModalType === 'feature') {
          dimOk = (w === 1024 && h === 500);
        } else if (_activeModalType === 'ipad') {
          dimOk = (w === 2048 && h === 2732);
        } else {
          dimOk = isSq ? false : true;
        }
        dimEl.className = 'icon-metric-val ' + (dimOk ? 'ok' : 'warn');
      }

      if (ratioEl) {
        if (isSq) {
          ratioEl.textContent = '1:1 Square';
          ratioEl.className = 'icon-metric-val ok';
        } else {
          const r = (w / (h || 1)).toFixed(2);
          ratioEl.textContent = `${r}:1`;
          ratioEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' ? 'err' : 'ok');
        }
      }

      if (sizeEl) {
        if (sizeBytes > 0) {
          const kb = (sizeBytes / 1024).toFixed(0);
          sizeEl.textContent = `${kb} KB`;
          sizeEl.title = `${sizeBytes.toLocaleString('en-US')} bytes`;
          const sizeErr = (_activeModalType === 'icon' && _activeModalStore === 'google' && sizeBytes > 1024 * 1024);
          sizeEl.className = 'icon-metric-val ' + (sizeErr ? 'err' : 'ok');
        } else {
          sizeEl.textContent = 'Optimized';
          sizeEl.className = 'icon-metric-val ok';
        }
      }

      if (formatEl) {
        const fmt = (mimeType || 'image/png').replace('image/', '').toUpperCase();
        if (hasAlpha) {
          formatEl.textContent = `${fmt} · Alpha`;
          formatEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' && _activeModalStore === 'apple' ? 'err' : 'ok');
        } else if (isJpeg) {
          formatEl.textContent = 'JPEG';
          formatEl.className = 'icon-metric-val warn';
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
        if (w === 1024 && h === 500) {
          level = 'ok';
          badgeText = '1024×500 px · Google Play Compliant';
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Google Play requires 1024×500 px`;
          detailsHtml = '<p>Google Play requires a landscape Feature Graphic of exactly 1024×500 px.</p><p class="icon-modal-warn-hint">Export standard 1024×500 px to display properly on the Play Store banner.</p>';
        }
      } else if (_activeModalType === 'ipad') {
        if (w === 2048 && h === 2732) {
          level = 'ok';
          badgeText = '2048×2732 px · iPad Pro 13" Compliant';
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Target: 2048×2732 px`;
          detailsHtml = '<p>Apple recommends 2048×2732 px for 13" iPad Pro screenshots (Portrait).</p><p class="icon-modal-warn-hint">Store Preview Studio automatically scales screenshots to standard canvas proportions.</p>';
        }
      } else {
        // Phone Screenshot
        level = 'ok';
        badgeText = `${w}×${h} px · Active Screenshot`;
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

    // Drag and Drop on Art Container
    const artContainer = $('msIconModalArt') || $('imageDetailModalArt');
    if (artContainer) {
      artContainer.addEventListener('dragover', e => {
        e.preventDefault();
        artContainer.classList.add('drag-over');
      });
      artContainer.addEventListener('dragleave', () => {
        artContainer.classList.remove('drag-over');
      });
      artContainer.addEventListener('drop', e => {
        e.preventDefault();
        artContainer.classList.remove('drag-over');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileReplacement(e.dataTransfer.files[0]);
        }
      });
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
    renderFeature();
    saveState();
    showToast('Feature graphic updated! (1,024 × 500 px)', 'ok');
  });
  e.target.value='';
};
if($('featureInspect')){
  $('featureInspect').onclick = () => {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: FEATURE_GRAPHIC, type: 'feature', store: 'google' });
    }
  };
}
const featurePrevImg = $('featurePrev');
if(featurePrevImg){
  featurePrevImg.onclick = () => {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: FEATURE_GRAPHIC, type: 'feature', store: 'google' });
    }
  };
}
const featureDropZone = $('featureDropZone');
featureDropZone.addEventListener('dragover',e=>{e.preventDefault();featureDropZone.classList.add('drag-over')});
featureDropZone.addEventListener('dragleave',()=>{featureDropZone.classList.remove('drag-over')});
featureDropZone.addEventListener('drop',e=>{
  e.preventDefault();featureDropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if(file && file.type.startsWith('image/')){
    readFile(file,d=>{
      FEATURE_GRAPHIC=d;
      renderFeature();
      saveState();
      showToast('Feature graphic dropped & applied! (1,024 × 500 px)', 'ok');
    });
  }
});


// Feature Graphic Info Popover Controller
initInfoPopover("featureInfoBtn", "featureInfoPop", "featureInfoClose", "google");


/* =========================================================================
   Module: src/js/google/google.js
   ========================================================================= */
// Store Preview Studio · Google Play Devices & Tablet Orientation
// --- Google Play Tablet Screenshots (7-inch & 10-inch) ---
let googleDevice = 'phone'; // 'phone' | 'tab7' | 'tab10'
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

    const be = $(c.badge);
    if(!valid.length){
      be.className = 'shot-status-badge warn';
      be.innerHTML = `${SB_INFO}<span><strong>No ${c.name} screenshots yet.</strong> The preview shows placeholders. Upload up to ${MAX_TAB}.</span>`;
    }else if(bad){
      be.className = 'shot-status-badge err';
      be.innerHTML = `${SB_ERR}<span><strong>${bad} of ${valid.length} screenshot${valid.length===1?'':'s'} would be rejected</strong> by Play Console. See details below.</span>`;
    }else{
      be.className = 'shot-status-badge ok';
      be.innerHTML = `${SB_OK}<span><strong>${c.name} tablet assets look good:</strong> ${valid.length} screenshot${valid.length===1?'':'s'}.</span>`;
    }

    // Editor list
    const L = $(c.list);
    L.innerHTML = '';
    items.forEach((it, i) => {
      const r = document.createElement('div');
      r.className = 'srow tab';
      r.draggable = true;
      const handle = document.createElement('div');
      handle.className = 'drag-handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder';
      r.appendChild(handle);
      r.appendChild(mk(it.src || PH));

      const col = document.createElement('div'); col.className = 'col';
      const inp = document.createElement('input'); inp.type = 'text';
      inp.value = it.src.startsWith('data:') ? '(Embedded / Uploaded Image)' : it.src;
      inp.placeholder = 'https://… image URL';
      inp.disabled = it.src.startsWith('data:');
      inp.onchange = () => { TABS[key][i] = makeTabItem(inp.value); renderTablets(); saveState(); };

      const meta = document.createElement('div'); meta.className = 'tab-meta';
      if(it.meta && it.meta.w){
        const probs = tabIssues(key, it);
        meta.textContent = `${it.meta.w}×${it.meta.h} · ${ratioLabel(it.meta.w, it.meta.h)}` + (it.meta.bytes ? ' · ' + fmtSize(it.meta.bytes) : '') + (probs.length ? ' — ' + probs.join('; ') : ' OK');
        meta.classList.add(probs.length ? 'bad' : 'ok');
      }else if(it.meta && it.meta.bad){
        meta.textContent = 'Image could not be loaded'; meta.classList.add('bad');
      }else if(it.src){
        meta.textContent = 'Checking…';
      }

      const act = document.createElement('div'); act.className = 'act';
      act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button><button class="mini" title="Move Up">↑</button><button class="mini" title="Move Down">↓</button><button class="mini del" title="Delete">&times;</button>';
      const b = act.children;
      b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key, idx:i}; $(c.file).click(); };
      b[1].onclick = () => mvTab(key, i, -1);
      b[2].onclick = () => mvTab(key, i, 1);
      b[3].onclick = () => { TABS[key].splice(i, 1); renderTablets(); saveState(); };
      col.append(inp, meta, act);
      r.appendChild(col);

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
    const g = $(c.gal);
    g.innerHTML = '';
    if(valid.length) valid.forEach((it, i) => g.appendChild(mk(it.src, 'Screenshot ' + (i+1))));
    else for(let i = 1; i <= 3; i++) g.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
    const sg = $('srch' + key.charAt(0).toUpperCase() + key.slice(1));
    if(sg){
      sg.innerHTML = '';
      if(valid.length) valid.slice(0, 3).forEach((it, i) => sg.appendChild(mk(it.src, 'Result ' + (i+1))));
      else for(let i = 1; i <= 3; i++) sg.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
    }
  });
}

function mvTab(key, i, d){
  const j = i + d, a = TABS[key];
  if(j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]];
  renderTablets(); saveState();
}

function addTabFiles(key, files){
  files = [...files].filter(f => f.type.startsWith('image/'));
  if(!files.length) return;
  const room = MAX_TAB - TABS[key].length;
  if(room <= 0){ showToast(`${TAB_CFG[key].name} tablets allow up to ${MAX_TAB} screenshots`, 'warn'); return; }
  if(files.length > room){ files = files.slice(0, room); showToast(`Only ${room} more fit (max ${MAX_TAB}) — extra files skipped`, 'warn'); }
  let done = 0;
  const out = new Array(files.length);
  files.forEach((f, n) => readFile(f, d => {
    out[n] = d;
    if(++done === files.length){
      out.forEach(s => TABS[key].push(makeTabItem(s)));
      renderTablets(); saveState();
      showToast(`Added ${files.length} ${TAB_CFG[key].name} tablet screenshot${files.length===1?'':'s'}`, 'ok');
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
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === (isDual ? 'dual' : googleDevice)));
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === (isDual ? 'dual' : appleDevice)));
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === (isDual ? 'dual' : 'google')));
  syncAllVtPills();
}
function setGoogleDevice(d, animate = true){
  const nextDev = (d === 'tab7' || d === 'tab10' || d === 'dual') ? d : 'phone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = nextDev === 'dual';
  if(googleDevice === nextDev && document.body.dataset.googleDevice === (nextDual ? 'phone' : nextDev) && wasDual === nextDual){
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
    saveState();
  };
  if(nextDual || wasDual){
    clearDevTransitions();
    applyState();
    fit();
    syncAllVtPills();
    return;
  }
  transitionDevice('google', nextDev, applyState, animate);
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === nextDev));
  syncAllVtPills();
}
$$('#gdt [data-gd]').forEach(b => b.onclick = () => setGoogleDevice(b.dataset.gd));
function tabStatus(key){
  const v = TABS[key].filter(i => i.src), bad = v.filter(i => tabIssues(key, i).length).length;
  if(!v.length) return 'None uploaded (optional)';
  if(v.length > MAX_TAB) return `${v.length} screenshots - max ${MAX_TAB}`;
  return bad ? `${bad} of ${v.length} would be rejected` : `PASS (${v.length} screenshot${v.length===1?'':'s'})`;
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
  if($('f-cat')) $('f-cat').value = (CAT[store] || '').replace(/^Games · /, '');
  const t = $('catTag');
  if(t){ t.textContent = store === 'apple' ? 'APPLE' : 'GOOGLE'; t.className = 'tag ' + (store === 'apple' ? 'a' : 'g'); }
}

function setCategory(val, only){
  val = (val || '').trim();
  ['apple','google'].forEach(st => {
    if(only && only !== st) return;
    const sel = CAT_SEL[st];
    if(!sel) return;
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
  const rawGoogleItems = parsePrivItems(googleStr);
  const googleItems = rawGoogleItems.length > 0
    ? rawGoogleItems
    : ['No data shared with third parties', 'Data is encrypted in transit', 'You can request data deletion'];

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


/* =========================================================================
   Module: src/js/modules/form/reviews.js
   ========================================================================= */
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
    case 'privacy':
      return $$('.stage [data-google-safety], .stage [data-apple-priv-wrap]');
    case 'priv-google':
      return $$('.stage [data-google-safety]');
    case 'priv-linked':
      return $$('.stage [data-apple-priv-wrap] .pc:first-child, .stage [data-apple-priv-wrap]');
    case 'priv-notlinked':
      return $$('.stage [data-apple-priv-wrap] .pc:last-child, .stage [data-apple-priv-wrap]');
    case 'reviews':
      return $$('.stage .reviews, .stage .ratings-reviews, .stage .a-rev, .stage .g-rev');
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

  const targets = getFieldMockupTargets(key);
  if (!targets.length) return;

  // Add highlight border to all matching targets
  targets.forEach(el => el.classList.add('hl-target'));

  if (!shouldScroll) return;

  // Smoothly scroll active device screens (.scr) to the target position
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

    // Scroll the device's inner screen (.scr)
    const scr = target.closest('.scr');
    if (scr) {
      const scrRect = scr.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Relative position within scroll container
      const relativeTop = (targetRect.top - scrRect.top) + scr.scrollTop;
      
      // Center the target element in the visible height of the phone/tablet screen
      const targetCenter = relativeTop - (scr.clientHeight / 2) + (targetRect.height / 2);
      const scrollToY = Math.max(0, targetCenter);

      scr.scrollTo({
        top: scrollToY,
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

    input.addEventListener('blur', () => {
      setFieldFocus(null);
    });

    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        flashField(key);
        setFieldFocus(key, true);
      });
    }
  });

  // App icon interaction zones
  const iconZones = $$('#icoDropZone, #icoUp, #icoFile, #iconStatusBadge, #dropApple, #dropGoogle');
  iconZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('icon', true));
    el.addEventListener('blur', () => setFieldFocus(null));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('icon', true);
    });
    el.addEventListener('mouseleave', () => {
      if (activeFieldFocusKey === 'icon') setFieldFocus(null);
    });
  });

  // Screenshots dropzones
  const shotZones = $$('#dropZ, #dropZ-ipad, #dropZ-tab7, #dropZ-tab10, .drop-shots');
  shotZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('shots', true));
    el.addEventListener('blur', () => setFieldFocus(null));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('shots', true);
    });
    el.addEventListener('mouseleave', () => {
      if (activeFieldFocusKey === 'shots') setFieldFocus(null);
    });
  });
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
    initInfoPopover("descInfoBtn", "descInfoPop", "descInfoClose");
    initInfoPopover("privacyInfoBtn", "privacyInfoPop", "privacyInfoClose");
    initInfoPopover("whatsNewInfoBtn", "whatsNewInfoPop", "whatsNewInfoClose");
    initInfoPopover("metricsInfoBtn", "metricsInfoPop", "metricsInfoClose");
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
  if(stage) stage.style.minHeight = '';
  const da = document.querySelector('.dev.apple.single');
  const dg = document.querySelector('.dev.google');
  if(da){
    da.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    da.style.opacity = '';
    da.style.pointerEvents = '';
    da.style.transition = '';
    da.style.transform = '';
  }
  if(dg){
    dg.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    dg.style.opacity = '';
    dg.style.pointerEvents = '';
    dg.style.transition = '';
    dg.style.transform = '';
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
  const st = document.querySelector('.stage'), m = isM(), pad = m ? 20 : 40;
  const tb = document.querySelector('.stage-toolbar');
  const vt = (tb ? tb.offsetHeight : 40) + (m ? 14 : 18) + 44;
  const isDual = d === 'dual' || document.body.dataset.dual === 'true';
  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    baseW = (isLand ? 870 : 416) * 2 + 28;
    baseH = isLand ? 416 : 870;
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
  const zw = (st.clientWidth - pad) / baseW;
  const zh = m ? 9 : (st.clientHeight - pad - vt) / (baseH + 8);
  return Math.max(0.28, Math.min(1, zw, zh));
}

function syncVtPill(container){
  if(!container) return;
  let pill = container.querySelector('.vt-pill');
  if(!pill){
    pill = document.createElement('span');
    pill.className = 'vt-pill';
    container.prepend(pill);
  }
  const activeBtn = container.querySelector('button.on');
  if(activeBtn && container.offsetParent !== null && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
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
  if(pill && activeBtn && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    pill.style.opacity = '1';
    const s = targetStore || (activeBtn.dataset ? activeBtn.dataset.s : null);
    if(s){
      pill.classList.remove('is-apple', 'is-google', 'is-dual');
      pill.classList.add('is-' + s);
    }
  }
}

function syncAllVtPills(){
  requestAnimationFrame(() => {
    ['dt', 'gdt', 'vt', 'theme'].forEach(id => {
      const el = $(id);
      if(el) syncVtPill(el);
    });
    syncSegPill();
  });
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
  if(toEl) toEl.style.zoom = targetZoom;

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

  // If currently using iPad or Android tablet, skip 3D dual slide and apply cleanly
  if((fromMode === 'apple' && appleDevice === 'ipad') || (toMode === 'apple' && appleDevice === 'ipad') ||
     (fromMode === 'google' && googleDevice !== 'phone') || (toMode === 'google' && googleDevice !== 'phone')){
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
    // Dual -> Apple: Apple glides to center, Google softly dissolves & recedes in-flow (zero flick)
    const stageEl = document.querySelector('.stage') || stage;
    const stageRect = stageEl.getBoundingClientRect();
    const stageCenterX = stageRect.left + stageRect.width / 2;
    const firstA = devApple.getBoundingClientRect();
    const isCol = (stageRect.width < 721) || (Math.abs(firstA.left - devGoogle.getBoundingClientRect().left) < 10);
    const appleCenterX = firstA.left + firstA.width / 2;
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const deltaX = isCol ? 0 : (stageCenterX - appleCenterX) / zoomA;

    stage.style.minHeight = stageRect.height + 'px';

    // Apple glides smoothly from left to center
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, 0, 0)';

    // Google softly fades out and gently scales down in place (stays in-flow during glide)
    devGoogle.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';
    devGoogle.style.pointerEvents = 'none';

    devExitTimer = setTimeout(function () {
      onApply();
      devGoogle.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'dual' && toMode === 'google') {
    // Dual -> Google: Google glides to center, Apple softly dissolves & recedes in-flow (zero flick)
    const stageEl = document.querySelector('.stage') || stage;
    const stageRect = stageEl.getBoundingClientRect();
    const stageCenterX = stageRect.left + stageRect.width / 2;
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const isCol = (stageRect.width < 721) || (Math.abs(firstA.left - firstG.left) < 10);
    const googleCenterX = firstG.left + firstG.width / 2;
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const deltaX = isCol ? 0 : (stageCenterX - googleCenterX) / zoomG;
    const deltaY = isCol ? (firstA.top - firstG.top) / zoomG : 0;

    stage.style.minHeight = stageRect.height + 'px';

    // Google glides smoothly from right to center
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Apple softly fades out and gently scales down in place (stays in-flow during glide)
    devApple.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';
    devApple.style.pointerEvents = 'none';

    devExitTimer = setTimeout(function () {
      onApply();
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

function setStore(s, animate = true){
  const fromMode = document.body.dataset.dual === 'true' ? 'dual' : store;
  const toMode = s;

  // 1. UPDATE TABVIEW SEGMENT CONTROL BUTTONS & PILL IMMEDIATELY (<1ms)
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === s));
  syncSegPill(s);

  if(fromMode === toMode){
    syncAllVtPills();
    return;
  }

  // Immediately update editor fields visibility and title for instant feedback
  if(s === 'dual'){
    $$('[data-only]').forEach(e => e.classList.remove('hide'));
    if($('edTitle')) $('edTitle').textContent = 'Dual Store Listing Details';
  } else {
    $$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== s));
    if($('edTitle')) $('edTitle').textContent = s === 'apple' ? 'App Store Listing Details' : 'Google Play Listing Details';
  }
  syncCategoryUI();

  const applyStoreMode = () => {
    if(s === 'dual'){
      document.body.dataset.dual = 'true';
      document.body.dataset.store = 'dual';
      appleDevice = 'dual';
      googleDevice = 'dual';
      document.body.dataset.appleDevice = 'iphone';
      document.body.dataset.googleDevice = 'phone';
      if(typeof renderIcons === 'function') renderIcons();
      if(typeof validateAppIcon === 'function') validateAppIcon();
    } else {
      document.body.dataset.dual = 'false';
      store = s;
      document.body.dataset.store = s;
      if(appleDevice === 'dual') appleDevice = 'iphone';
      if(googleDevice === 'dual') googleDevice = 'phone';
      document.body.dataset.appleDevice = appleDevice;
      document.body.dataset.googleDevice = googleDevice;

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
        if($('ipadCard')) $('ipadCard').style.display = SUPPORTS_IPAD ? '' : 'none';
      } else {
        if($('ipadCard')) $('ipadCard').style.display = 'none';
      }
    }
    if(typeof saveState === 'function') saveState();
  };

  transitionStoreMode(fromMode, toMode, applyStoreMode, animate);
}

function setView(v){
  $$('#vt button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  syncAllVtPills();
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
$$('#vt button').forEach(b => b.onclick = () => setView(b.dataset.v));

// Mockup Light / Dark theme controller
function setDeviceTheme(theme, save = true){
  const t = theme === 'dark' ? 'dark' : 'light';
  $$('.phone').forEach(p => p.dataset.theme = t);
  const btnL = $('themeLight');
  const btnD = $('themeDark');
  if(btnL) btnL.classList.toggle('on', t === 'light');
  if(btnD) btnD.classList.toggle('on', t === 'dark');
  syncVtPill($('theme'));
  if(save && typeof saveState === 'function') saveState();
}

if($('themeLight')) $('themeLight').onclick = () => setDeviceTheme('light');
if($('themeDark')) $('themeDark').onclick = () => setDeviceTheme('dark');
if($('theme') && !$('themeLight')){
  $('theme').onclick = () => {
    const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
    setDeviceTheme(cur === 'dark' ? 'light' : 'dark');
  };
}
// Sync theme segment indicator to initial mockup theme
setTimeout(() => {
  const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
  setDeviceTheme(cur, false);
}, 0);



/* =========================================================================
   Module: src/js/apple/apple.js
   ========================================================================= */
// Store Preview Studio · Apple App Store & Devices
// --- Apple Device Mode & Store Switchers ---
let appleDevice = 'iphone'; // 'iphone' | 'ipad' | 'dual'

function setAppleDevice(d, animate = true){
  if(d !== 'ipad' && d !== 'dual') d = 'iphone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = d === 'dual';
  if(appleDevice === d && document.body.dataset.appleDevice === d && wasDual === nextDual){
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
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === googleDevice));
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === (nextDual ? 'dual' : 'apple')));
    renderIcons();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    update();
    syncAppleNavScroll();
    saveState();
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
  const onStatChange = () => { STATS[k] = el.value.trim(); renderStats(); debouncedSave(); };
  el.addEventListener('input', onStatChange);
  el.addEventListener('change', onStatChange);
});
const stOffEl = $('f-st-off'), stWmEl = $('f-st-wm');
if(stOffEl) stOffEl.addEventListener('change', () => { STATS_OFF = stOffEl.checked; renderStats(); debouncedSave(); });
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
    setupDropdown('btnPresets', 'menuPresets');
    setupDropdown('btnExport', 'menuExport');
  }

  // 4. Global Keyboard Dismissal for Header Dropdowns (ESC key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.menu.show').forEach(m => m.classList.remove('show'));
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
      if (!p || typeof p.icon !== 'string') return;
      if (p.icon.startsWith('data:image/svg+xml') || p.icon.includes('<svg')) {
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
    });
  }
}

function initPresetThumbnails() {
  $$('#menuPresets [data-preset]').forEach(b => {
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
  };
});

function loadPreset(key){
  if(key === 'draft'){
    if(!userDraft){
      loadPreset('none');
      CURRENT_PRESET_KEY = 'draft';
      isPresetModified = false;
      userDraft = getCurrentStateObject();
      userDraft.isCustomized = true;
      if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
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

  // Before switching to a preset, if we were in draft mode, ensure draft is persisted
  if(CURRENT_PRESET_KEY === 'draft' && typeof hasUserDraft === 'function' && hasUserDraft()){
    if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
  }

  CURRENT_PRESET_KEY = key;
  isPresetModified = false;
  if(key === 'none'){
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
    const defaultPrivLinked = 'Identifiers, Usage Data';
    const defaultPrivNotLinked = 'Diagnostics, Performance Data';
    const defaultPrivGoogle = 'No data shared with third parties, Data is encrypted in transit, You can request data deletion';
    if($('f-priv-linked')) $('f-priv-linked').value = defaultPrivLinked;
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = defaultPrivNotLinked;
    if($('f-priv-google')) $('f-priv-google').value = defaultPrivGoogle;
    CURRENT_PRIVACY = { linked: defaultPrivLinked, notLinked: defaultPrivNotLinked, google: defaultPrivGoogle };
    $('f-new').value = '';
    $('f-desc').value = '';
    IS_CUSTOM_ICON = false;
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
    renderReviews();
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
  if($('f-ver')) $('f-ver').value = key === 'cyberstrike' ? '4.2.0' : (key === 'pulsefit' ? '3.1.2' : (key === 'zenmind' ? '1.8.0' : (key === 'edulearn' ? '4.1.0' : '2.4.0')));
  if($('f-rdate')) $('f-rdate').value = (p && p.rdate) ? p.rdate : getCurrentMonthDateStr(2, true);
  if($('f-email')) $('f-email').value = (p && p.email) ? p.email : (key === 'cyberstrike' ? 'support@omniarcade.games' : (key === 'pulsefit' ? 'support@pulsefit.io' : (key === 'zenmind' ? 'hello@zenmind.app' : (key === 'edulearn' ? 'support@skillsphere.edu' : 'support@flowcraft.studio'))));
  if($('f-phone')) $('f-phone').value = (p && p.phone) ? p.phone : (key === 'cyberstrike' ? '+81 3 5555 0188' : (key === 'pulsefit' ? '+1 888-555-0142' : (key === 'zenmind' ? '+1 800-555-0177' : (key === 'edulearn' ? '+44 20 7946 0912' : '+1 800-555-0199'))));
  if($('f-addr')) $('f-addr').value = (p && p.addr) ? p.addr : (key === 'cyberstrike' ? 'Tokyo, Japan' : (key === 'edulearn' ? 'San Francisco, CA' : 'Vietnam'));
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
  ICON_FILE_SIZE = 0; ICON_FILE_TYPE = ''; ICON_FILE_NAME = '';
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
  FEATURE_GRAPHIC = p.feature || DEFAULT_FEATURE;
  SHOTS = [...p.shots];
  IPAD_SHOTS = [];
  REVIEWS = p.reviews ? JSON.parse(JSON.stringify(p.reviews)) : [];
  TABS.tab7 = []; TABS.tab10 = [];
  renderTablets();
  renderIcons();
  renderFeature();
  renderShots();
  renderReviews();
  update();
  if(CURRENT_PRESET_KEY === 'draft'){
    saveState();
  }
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
}

const btnReturn = $('btnReturnToDraft');
if(btnReturn){
  btnReturn.onclick = () => {
    loadPreset('draft');
  };
}

const btnDraft = $('btnDraft');
if(btnDraft){
  btnDraft.onclick = () => {
    loadPreset('draft');
  };
}



/* =========================================================================
   Module: src/js/modules/export/storage.js
   ========================================================================= */
// Store Preview Studio - Storage & State Persistence (LocalStorage & IndexedDB)
const STORAGE_KEY = 'store_preview_studio_state_v2';
const DRAFT_STORAGE_KEY = 'sps_core_user_draft';
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
  if(s.store) setStore(s.store, false);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
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

  if(s.icon512) CUSTOM_ICON_512 = s.icon512;
  else if(s.iconGoogle) CUSTOM_ICON_512 = s.iconGoogle;

  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('studioBg') || s.icon.includes('bfd1fd') || s.icon.includes('d2c7fc') || s.icon.includes('stdBg') || s.icon.includes('c6-bg') || !s.isCustomIcon){
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
  if(s.featureGraphic) FEATURE_GRAPHIC = s.featureGraphic;
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)) SHOTS = s.shots;
  if(typeof s.supportsIpad === 'boolean' && typeof setSupportsIpad === 'function') setSupportsIpad(s.supportsIpad);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
    if(typeof renderIpadShots === 'function') renderIpadShots();
  }
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone' || s.googleDevice === 'dual') googleDevice = s.googleDevice;
  if(typeof tabOrient !== 'undefined'){
    tabOrient.tab7 = 'landscape';
    tabOrient.tab10 = 'landscape';
  }
  if(Array.isArray(s.tab7Shots) && typeof makeTabItem === 'function') TABS.tab7 = s.tab7Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.tab10Shots) && typeof makeTabItem === 'function') TABS.tab10 = s.tab10Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.reviews)) {
    REVIEWS = s.reviews;
    if(typeof renderReviews === 'function') renderReviews();
  }
  if(typeof applyStatsFromObject === 'function') applyStatsFromObject(s.stats);
  return true;
}

function getCurrentStateObject(){
  return {
    store,
    appleDevice,
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
    icon: (IS_CUSTOM_ICON && ICON && !ICON.includes('c6-bg') && !ICON.includes('studioBg') && !ICON.includes('stdBg')) ? ICON : BLANK_ICON,
    icon1024: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    icon512: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    iconApple: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    iconGoogle: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    isCustomIcon: !!(IS_CUSTOM_ICON && ICON && !ICON.includes('c6-bg') && !ICON.includes('studioBg') && !ICON.includes('stdBg')),
    featureGraphic: FEATURE_GRAPHIC,
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

function hasUserDraft(){
  if(userDraft && typeof userDraft === 'object'){
    const f = userDraft.form || {};
    const hasText = !!((f.name && f.name.trim()) || (f.sub && f.sub.trim()) || (f.short && f.short.trim()) || (f.desc && f.desc.trim()));
    const hasShots = Array.isArray(userDraft.shots) && userDraft.shots.length > 0;
    return hasText || hasShots || !!userDraft.isCustomized;
  }
  return false;
}

function ensureDraft(){
  if(!userDraft){
    userDraft = getCurrentStateObject();
  }
  return userDraft;
}

function saveDraftToStorage(){
  if(!userDraft) return;
  if(typeof idbSave === 'function'){
    idbSave(DRAFT_STORAGE_KEY, userDraft);
  }
  try{
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(userDraft));
  }catch(e){
    try{
      const sanitized = sanitizeStateForLocalStorage(userDraft);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }
}

function loadDraftFromStorage(){
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          userDraft = parsed;
          if(!userDraft.isCustomIcon || !userDraft.icon || userDraft.icon.includes('studioBg') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || userDraft.icon.includes('stdBg')){
            userDraft.icon = BLANK_ICON;
            userDraft.isCustomIcon = false;
          }
        }
      }
    }
  }catch(e){}

  if(typeof idbGet === 'function'){
    idbGet(DRAFT_STORAGE_KEY).then(idbDraft => {
      if(idbDraft && typeof idbDraft === 'object'){
        userDraft = idbDraft;
        if(!userDraft.isCustomIcon || !userDraft.icon || userDraft.icon.includes('studioBg') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || userDraft.icon.includes('stdBg')){
          userDraft.icon = BLANK_ICON;
          userDraft.isCustomIcon = false;
        }
        updateDraftPill();
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

function updateDraftPill(){
  const pill = $('btnDraft');
  if(!pill) return;
  const hasDraft = hasUserDraft();

  if(hasDraft && userDraft){
    pill.classList.add('has-draft');
    pill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');
    
    // Always resolve icon to BLANK_ICON unless user has explicitly uploaded a custom icon
    let iconSrc = BLANK_ICON;
    if(userDraft.isCustomIcon && userDraft.icon && !userDraft.icon.includes('studioBg') && !userDraft.icon.includes('bfd1fd') && !userDraft.icon.includes('d2c7fc') && !userDraft.icon.includes('stdBg') && !userDraft.icon.includes('c6-bg')){
      iconSrc = userDraft.icon;
    } else if(IS_CUSTOM_ICON && ICON && !ICON.includes('studioBg') && !ICON.includes('bfd1fd') && !ICON.includes('d2c7fc') && !ICON.includes('stdBg') && !ICON.includes('c6-bg')){
      iconSrc = ICON;
      userDraft.isCustomIcon = true;
      userDraft.icon = ICON;
    } else {
      userDraft.isCustomIcon = false;
      userDraft.icon = BLANK_ICON;
    }

    const f = userDraft.form || {};
    const appTitle = (f.name && f.name.trim()) ? (typeof clampGraphemes === 'function' ? clampGraphemes(f.name.trim(), 30) : f.name.trim()) : 'Your App';
    
    pill.setAttribute('title', appTitle + (CURRENT_PRESET_KEY === 'draft' ? ' (Active Workspace)' : ' (Saved Draft - Click to Return)'));
    pill.innerHTML = '<img alt="" id="draftBtnThumb" src="' + iconSrc + '">' +
      '<span id="draftBtnTitle">' + escapeHtml(appTitle) + '</span>' +
      '<small id="draftBtnBadge">Draft</small>' +
      '<button type="button" class="ms-pill-reset-btn" id="msPillResetBtn" title="Reset draft and clear fields" aria-label="Reset draft">&times;</button>';

    const resetBtn = pill.querySelector('#msPillResetBtn');
    if(resetBtn){
      resetBtn.addEventListener('click', function(e){
        e.stopPropagation();
        showResetConfirmModal(function(){
          userDraft = null;
          try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
          try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
          if(typeof idbDelete === 'function'){
            idbDelete(DRAFT_STORAGE_KEY);
            idbDelete(STORAGE_KEY);
          }
          if(typeof resetStats === 'function') resetStats();
          loadPreset('taskflow');
          updateDraftPill();
          updatePresetBanner();
          showToast('Draft cleared and reset.', 'ok');
        });
      });
    }
  } else {
    pill.classList.remove('has-draft');
    pill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');
    pill.textContent = '+ Your App';
    pill.setAttribute('title', 'Start your custom app draft');
  }

  updatePresetMenuSelection();
}

function updatePresetMenuSelection(){
  $$('#menuPresets [data-preset]').forEach(b => {
    const k = b.dataset.preset;
    b.classList.toggle('active', k === CURRENT_PRESET_KEY);
  });
}

function updatePresetBanner(){
  const banner = $('presetBanner');
  if(!banner) return;
  
  const hasDraft = hasUserDraft();
  if(CURRENT_PRESET_KEY !== 'draft' && hasDraft && userDraft){
    banner.style.display = 'inline-flex';
    banner.classList.toggle('is-modified', !!isPresetModified);
    const textEl = $('presetBannerText') || banner.querySelector('.preset-banner-text');
    const pName = CURRENT_PRESET_KEY === 'none' ? 'None (Blank)' : (CURRENT_PRESET_KEY ? (CURRENT_PRESET_KEY.charAt(0).toUpperCase() + CURRENT_PRESET_KEY.slice(1)) : 'Preset');
    
    if(textEl){
      if(isPresetModified){
        textEl.innerHTML = '<strong>Preview only: edits won\'t be saved</strong> · Your draft is saved safely.';
      } else {
        textEl.innerHTML = 'Viewing preset: <strong id="presetBannerName">' + escapeHtml(pName) + '</strong> · Your draft is saved safely.';
      }
    }
  } else {
    banner.style.display = 'none';
    banner.classList.remove('is-modified');
  }
}

function handleUserFormEdit(){
  if(!hasUserDraft()){
    if(CURRENT_PRESET_KEY !== 'draft'){
      initDraftFromCurrentPreset();
      return;
    }
  } else if(CURRENT_PRESET_KEY !== 'draft'){
    isPresetModified = true;
    updatePresetBanner();
    return;
  }
  debouncedSave();
}

function saveState(){
  if(restoring) return;
  const state = getCurrentStateObject();

  if(CURRENT_PRESET_KEY === 'draft'){
    userDraft = JSON.parse(JSON.stringify(state));
    saveDraftToStorage();
    updateDraftPill();
  } else if(!hasUserDraft()){
    initDraftFromCurrentPreset();
    return;
  } else {
    // Ephemeral mode on preset: do not overwrite draft
    isPresetModified = true;
    updatePresetBanner();
    return;
  }

  // 1. Asynchronously persist complete state to IndexedDB (virtually unlimited quota for high-res images)
  let idbPromise = null;
  if(typeof idbSave === 'function'){
    idbPromise = idbSave(STORAGE_KEY, state);
  }

  // 2. Try saving to localStorage
  let lsOk = false;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lsOk = true;
  }catch(e){
    // Quota exceeded (typically caused by 2048x2732 base64 screenshots)
    try{
      const sanitized = sanitizeStateForLocalStorage(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      lsOk = true;
    }catch(err2){
      lsOk = false;
    }
  }

  // If localStorage succeeded with sanitized or full state, no toast is needed because IndexedDB holds full state.
  // Only show warning if BOTH stores failed.
  if(!lsOk){
    if(idbPromise){
      idbPromise.then(ok => {
        if(!ok){
          console.warn('Storage limit reached on both LocalStorage and IndexedDB');
          showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
        }
      }).catch(() => {
        showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
      });
    } else {
      showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
    }
  }
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
  const dev = $('f-dev') ? $('f-dev').value : '';
  const cat = 'App Store: ' + (CAT.apple || '-') + '  |  Google Play: ' + (CAT.google || '-');
  const ver = $('f-ver') ? $('f-ver').value : '2.4.0';
  const rdate = $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true);
  const email = $('f-email') ? $('f-email').value : '';
  const addr = $('f-addr') ? $('f-addr').value : '';
  const privLinked = $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : '');
  const privNotLinked = $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : '');
  const privGoogle = $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : '');
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || GOOGLE_AGE_MAP['4+'];
  const iapLabels = {
    iap: 'In-App Purchases (No Ads)',
    ads_iap: 'Contains Ads · In-App Purchases',
    ads: 'Contains Ads Only',
    free: 'None (100% Free / Paid Upfront)'
  };
  const iapText = iapLabels[STATS.iap || 'iap'] || iapLabels.iap;

  const text = `=====================================================
STORE LISTING METADATA (${name})
Exported via Store Preview Studio · Client-Side Zero Server
=====================================================

APP TITLE (30 chars max):
${name} [${countChars(name)}/30]

DEVELOPER / ORGANIZATION:
${dev}${email ? ' (' + email + ')' : ''}${addr ? ' · ' + addr : ''}

CATEGORY:
${cat}

VERSION & RELEASE DATE:
v${ver} · ${rdate}

AGE RATING & MONETIZATION:
App Store: ${ageVal} | Google Play: ${gAge.badge} (${gAge.label})
Monetization Badge: ${iapText}

-----------------------------------------------------
APPLE APP STORE (iOS)
-----------------------------------------------------
SUBTITLE (30 chars max):
${sub} [${countChars(sub)}/30]

PROMOTIONAL TEXT (170 chars max):
${promo} [${countChars(promo)}/170]

APP PRIVACY (Data Linked to You):
${privLinked || 'None'}

APP PRIVACY (Data Not Linked to You):
${privNotLinked || 'None'}

-----------------------------------------------------
GOOGLE PLAY STORE (Android)
-----------------------------------------------------
SHORT DESCRIPTION (80 chars max):
${short} [${countChars(short)}/80]

DATA SAFETY PRACTICES:
${privGoogle || 'None'}

-----------------------------------------------------
SHARED METADATA
-----------------------------------------------------
WHAT'S NEW / RELEASE NOTES:
${wn}

FULL DESCRIPTION:
${desc}
=====================================================`;

  navigator.clipboard.writeText(text).then(()=>{
    showToast('Metadata copied to clipboard!', 'ok');
  }).catch(()=>{
    showToast('Clipboard access denied, check permissions', 'warn');
  });
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
  const dev = $('f-dev') ? $('f-dev').value : '';
  const cat = CAT.apple || '-';
  const catG = CAT.google || '-';
  const ver = $('f-ver') ? $('f-ver').value : '2.4.0';
  const rdate = $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true);
  const email = $('f-email') ? $('f-email').value : '-';
  const addr = $('f-addr') ? $('f-addr').value : '-';
  const privLinked = $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.linked || 'None') : 'None');
  const privNotLinked = $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.notLinked || 'None') : 'None');
  const privGoogle = $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.google || 'None') : 'None');
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || GOOGLE_AGE_MAP['4+'];
  const iapLabels = {
    iap: 'In-App Purchases (No Ads)',
    ads_iap: 'Contains Ads · In-App Purchases',
    ads: 'Contains Ads Only',
    free: 'None (100% Free / Paid Upfront)'
  };
  const iapText = iapLabels[STATS.iap || 'iap'] || iapLabels.iap;

  const validCount = SHOTS.filter(s=>s && s.trim()).length;
  const isShotCompliant = validCount >= 2 && validCount <= 8;

  const md = `# Store Listing Metadata: ${name}

> Generated by **Store Preview Studio** on ${new Date().toLocaleDateString()}
> Zero-server client-side validation report.

---

## Character Limits & Compliance Summary

| Field | Target Store | Official Limit | Current Length | Status |
| :--- | :--- | :--- | :--- | :--- |
| **App Title** | Both | 30 chars | ${countChars(name)} | ${countChars(name) <= 30 ? 'PASS' : 'EXCEEDED'} |
| **Subtitle** | App Store | 30 chars | ${countChars(sub)} | ${countChars(sub) <= 30 ? 'PASS' : 'EXCEEDED'} |
| **Promotional Text** | App Store | 170 chars | ${countChars(promo)} | ${countChars(promo) <= 170 ? 'PASS' : 'EXCEEDED'} |
| **Short Description** | Google Play | 80 chars | ${countChars(short)} | ${countChars(short) <= 80 ? 'PASS' : 'EXCEEDED'} |
| **Full Description** | Both | 4,000 chars | ${countChars(desc)} | ${countChars(desc) <= 4000 ? 'PASS' : 'EXCEEDED'} |

---

## Graphic Assets Checklist (Google Play & Apple App Store)

| Asset | Target Platform | Specification | Store Requirement | Current Status |
| :--- | :--- | :--- | :--- | :--- |
| **App Icon (Google Play)** | Google Play | PNG/JPEG, up to 1 MB, 512 × 512 px | **Mandatory** | ${ICON ? 'Ready' : 'Missing'} |
| **App Icon (Apple)** | App Store | PNG/JPEG, 1024 × 1024 px (sRGB/P3, no alpha) | **Mandatory** | ${ICON ? 'Ready' : 'Missing'} |
| **Feature Graphic** | Google Play | PNG/JPEG, up to 15 MB, 1,024 × 500 px | **Mandatory for Featuring** | ${FEATURE_GRAPHIC ? 'Ready' : 'Missing'} |
| **Phone Screenshots** | Google Play | PNG/JPEG, up to 8 MB each, 16:9 or 9:16 (320px–3,840px) | **2 to 8 Screenshots** | ${isShotCompliant ? `PASS (${validCount} screenshots)` : `REJECT RISK (${validCount} screenshots - requires 2 to 8)`} |
| **7-inch Tablet Screenshots** | Google Play | 24-bit PNG/JPEG (no alpha), up to 8 MB each, 16:9 or 9:16 (320px–3,840px per side) | **Up to 8 screenshots** | ${tabStatus('tab7')} |
| **10-inch Tablet Screenshots** | Google Play | 24-bit PNG/JPEG (no alpha), up to 8 MB each, 16:9 or 9:16 (1,080px–7,680px per side) | **Up to 8 screenshots** | ${tabStatus('tab10')} |

---

## App Privacy, Data Safety & Store Badges

* **Version & Release Date:** \`v${ver}\` (${rdate})
* **Age Rating:** App Store \`${ageVal}\` | Google Play \`${gAge.badge} (${gAge.label})\`
* **Monetization / IAP Badge:** \`${iapText}\`
* **Apple Privacy — Data Linked to You:** ${privLinked}
* **Apple Privacy — Data Not Linked to You:** ${privNotLinked}
* **Google Play — Data Safety Practices:** ${privGoogle}
* **Developer Support Contact:** \`${email}\` (${addr})

---

## Apple App Store Metadata

### Title
${safeFence(name)}

### Subtitle
${safeFence(sub)}

### Promotional Text
${safeFence(promo)}

### Category
* **Primary:** \`${cat}\`
* **Developer:** \`${dev}\`

---

## Google Play Store Metadata

### Category
\`${catG}\`

### Title
${safeFence(name)}

### Short Description
${safeFence(short)}

### Full Description
${safeFence(desc)}

---

## Release Notes (What's New)
${safeFence(wn)}

---

## Fastlane CLI Mapping Cheat-Sheet
- \`fastlane/metadata/android/en-US/title.txt\` -> App Title
- \`fastlane/metadata/android/en-US/short_description.txt\` -> Short Description
- \`fastlane/metadata/android/en-US/full_description.txt\` -> Full Description
- \`fastlane/metadata/ios/en-US/name.txt\` -> App Title
- \`fastlane/metadata/ios/en-US/subtitle.txt\` -> Subtitle
- \`fastlane/metadata/ios/en-US/promotional_text.txt\` -> Promotional Text
- \`fastlane/metadata/ios/en-US/description.txt\` -> Full Description
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
    featureGraphic: FEATURE_GRAPHIC,
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    stats: (typeof statsToObject === 'function') ? statsToObject() : {}
  };
  const jsonStr = JSON.stringify(config, null, 2);
  const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
  let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if(!slug) slug = 'app';
  downloadFile(`${slug}-store-config.json`, jsonStr, 'application/json');
  showToast('Exported store configuration JSON!', 'ok');
}

// Smart & Fault-Tolerant JSON Import Parser
function parseAndApplyJSON(jsonString){
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

  IS_CUSTOM_ICON = false;
  if(data.icon1024 || data.icon512) {
    if(store === 'apple' && data.icon1024) ICON = data.icon1024;
    else if(store === 'google' && data.icon512) ICON = data.icon512;
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

  if(typeof data.supportsIpad === 'boolean' && typeof setSupportsIpad === 'function') setSupportsIpad(data.supportsIpad);
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
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
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
  } else if (!e.target.closest('#icoDropZone') && !e.target.closest('#featureDropZone') && !e.target.closest('#shotDropZone') && !e.target.closest('#ipadDropZone') && !e.target.closest('#bundleDropZone') && !e.target.closest('.drop-zone') && !e.target.closest('.sl') && !e.target.closest('.tabsec')) {
    showToast('Unsupported file type. Please drop a .json configuration file.', 'warn');
  }
});

// Reset to Default State
if($('optResetDefault')){
  $('optResetDefault').onclick = () => {
    showResetConfirmModal(() => {
      userDraft = null;
      try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
      try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
      if(typeof idbDelete === 'function'){
        idbDelete(DRAFT_STORAGE_KEY);
        idbDelete(STORAGE_KEY);
      }
      resetStats();
      loadPreset('taskflow');
      if(typeof updatePresetBanner === 'function') updatePresetBanner();
      if(typeof updateDraftPill === 'function') updateDraftPill();
      showToast('Draft cleared and reset to default.', 'ok');
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
const btnCancelModal = $('exportModalCancel');
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
  exportModal.querySelectorAll('[data-opt="frame"]').forEach(b => {
    b.classList.toggle('active', b.dataset.val === exportPrefs.frame);
  });
  exportModal.querySelectorAll('[data-opt="bg"]').forEach(b => {
    b.classList.toggle('active', b.dataset.val === exportPrefs.bg);
  });
  exportModal.querySelectorAll('[data-opt="scale"]').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.val) === Number(exportPrefs.scale));
  });
  const summaryEl = $('exportSummaryBadge');
  if (summaryEl) {
    const frameLabel = exportPrefs.frame === 'screen' ? 'Screen Only' : 'Device Frame';
    const bgLabel = exportPrefs.bg === 'transparent' ? 'Transparent Cutout' : 'With Shadow';
    summaryEl.textContent = `${exportPrefs.scale}x PNG · ${frameLabel} · ${bgLabel}`;
  }
}

function saveExportPrefs() {
  try {
    localStorage.setItem(EXPORT_PREFS_KEY, JSON.stringify(exportPrefs));
  } catch(_) {}
}

function openExportModal() {
  if (!exportModal) return;
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
if (btnCancelModal) btnCancelModal.onclick = closeExportModal;
if (exportModal) {
  exportModal.addEventListener('click', e => {
    if (e.target === exportModal) closeExportModal();
  });
  exportModal.querySelectorAll('.export-seg-btn, .export-scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = btn.dataset.opt;
      const val = btn.dataset.val;
      if (opt === 'frame') exportPrefs.frame = val;
      else if (opt === 'bg') exportPrefs.bg = val;
      else if (opt === 'scale') exportPrefs.scale = Number(val);
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
      transparent: exportPrefs.bg === 'transparent'
    });
  };
}

if (btnCopyModal) {
  btnCopyModal.onclick = () => {
    closeExportModal();
    exportPNG(exportPrefs.scale, {
      frameless: exportPrefs.frame === 'screen',
      transparent: exportPrefs.bg === 'transparent',
      action: 'copy'
    });
  };
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && exportModal && exportModal.classList.contains('open')) {
    closeExportModal();
  }
});

// html2canvas can drop parts of SVG images (filters, glow). Rasterize SVG data-URI images to PNG first,
// swap them in for the capture, and return a function that puts the originals back.
async function rasterizeSvgImages(root, scale){
  const swaps = [];
  const imgs = [...root.querySelectorAll('img')].filter(i => /^data:image\/svg\+xml/i.test(i.currentSrc || i.src || ''));
  await Promise.all(imgs.map(async img => {
    try{
      const box = img.getBoundingClientRect();
      if(!box.width || !box.height) return;
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
      const vw = vb ? parseFloat(vb[1]) : box.width, vh = vb ? parseFloat(vb[2]) : box.height;
      const tmp = new Image();
      const safeSrc = typeof ensureSvgDimensions === 'function' ? ensureSvgDimensions(original) : original;
      await new Promise((res, rej) => { tmp.onload = res; tmp.onerror = rej; tmp.src = safeSrc; });
      // 1) draw the vector at its own aspect ratio
      const k = Math.max(box.width * scale / vw, box.height * scale / vh);
      const sw = Math.max(1, Math.round(vw * k)), sh = Math.max(1, Math.round(vh * k));
      const c1 = document.createElement('canvas'); c1.width = sw; c1.height = sh;
      c1.getContext('2d').drawImage(tmp, 0, 0, sw, sh);
      // 2) crop to the element box like object-fit: cover
      const w = Math.max(1, Math.round(box.width * scale)), h = Math.max(1, Math.round(box.height * scale));
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

  showToast(`Rendering ${scaleFactor}x PNG${opts.frameless ? ' (screen only)' : ''}...`, 'info', 4000);

  // Lock fit() and temporarily reset zoom & animations so html2canvas measures unzoomed 1:1 layout
  isExporting = true;
  if(typeof clearDevTransitions === 'function') clearDevTransitions();
  const prevZoom = devToCapture.style.zoom;
  const prevGap = devToCapture.style.gap;
  const dualPhones = isDual ? [...devToCapture.querySelectorAll('.dev:not(.ipad):not(.gtab)')] : [];
  const prevDualZooms = dualPhones.map(d => d.style.zoom);
  devToCapture.style.zoom = '1';
  if(isDual){
    devToCapture.style.gap = '28px';
    dualPhones.forEach(d => {
      d.style.zoom = '1';
      d.classList.remove('dev-enter', 'dev-exit');
    });
  }
  devToCapture.classList.remove('dev-enter', 'dev-exit');
  void devToCapture.offsetHeight; // Force synchronous reflow before measuring bounding rects

  let restoreImages = () => {};
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready.catch(() => {});
    }
    restoreImages = await rasterizeSvgImages(target, scaleFactor);
    devToCapture.style.zoom = '1';
    if(isDual) dualPhones.forEach(d => { d.style.zoom = '1'; });
    void devToCapture.offsetHeight;

    const w = target.offsetWidth;
    const h = target.offsetHeight;
    const padX = opts.frameless ? 0 : 8;

    let canvas = await html2canvas(target, {
      backgroundColor: null,
      scale: scaleFactor,
      x: -padX,
      width: w + padX * 2,
      height: h,
      windowWidth: Math.max(document.documentElement.clientWidth, w + 140),
      windowHeight: Math.max(document.documentElement.clientHeight, h + 120),
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc, clonedEl) => {
        // Hide CSS pseudo-element buttons so html2canvas renders explicit hardware button nodes cleanly
        const btnStyle = clonedDoc.createElement('style');
        btnStyle.textContent = '.dev::before, .dev::after { display: none !important; }';
        clonedDoc.head.appendChild(btnStyle);

        clonedEl.style.zoom = '1';
        clonedEl.style.transform = 'none';
        clonedEl.style.animation = 'none';
        clonedEl.style.transition = 'none';
        if(isDual){
          clonedEl.style.gap = '28px';
          if(opts.frameless || opts.transparent){
            clonedDoc.querySelectorAll('.dev-label').forEach(l => l.style.display = 'none');
          }
        } else {
          clonedDoc.querySelectorAll('.dev-label').forEach(l => l.style.display = 'none');
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
        });
        // Prevent html2canvas from splitting words into per-character fillText calls when letter-spacing != 0
        clonedEl.querySelectorAll('*').forEach(el => {
          el.style.letterSpacing = '0px';
        });
        // Strip focus highlight from export capture
        clonedDoc.querySelectorAll('.hl-target, .hl-flash').forEach(el => {
          el.classList.remove('hl-target', 'hl-flash');
          el.style.outline = 'none';
          el.style.boxShadow = 'none';
        });
      }
    });
    if(EXPORT_WM && !opts.transparent) canvas = addMockupNote(canvas, scaleFactor);

    const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
    let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if(!slug) slug = 'app';
    const link = document.createElement('a');
    const typeLabel = opts.frameless ? 'screen' : (opts.transparent ? 'mockup-transparent' : 'preview');
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
            .then(() => showToast('Image copied to clipboard! Ready to paste into Figma/Slack.', 'ok'))
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
      showToast(`PNG (${scaleFactor}x${opts.frameless ? ', screen only' : (opts.transparent ? ', transparent cutout' : '')}) downloaded!`, 'ok');
    }
  }catch(err){
    console.error('Export PNG failed:', err);
    showToast('Failed to generate image: ' + err.message, 'warn', 4000);
  }finally{
    restoreImages();
    isExporting = false;
    devToCapture.style.zoom = prevZoom;
    if(isDual){
      devToCapture.style.gap = prevGap;
      dualPhones.forEach((d, idx) => { d.style.zoom = prevDualZooms[idx]; });
    }
    fit();
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

  const splitMatch = rawName.split(/\s*[-–—:]\s*/);
  if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
    name = splitMatch[0].trim();
    sub = splitMatch.slice(1).join(' · ').trim();
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
  const shots = (item.screenshotUrls || []).map(u => u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1242x2688bb.png')).slice(0, 8);
  const ipadShots = (item.ipadScreenshotUrls || []).map(u => u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2048x2732bb.png')).slice(0, 8);
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

  // Apply to studio state
  if (typeof applyStateObject === 'function') {
    applyStateObject(state);
  }

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
  if (typeof renderShots === 'function') renderShots();
  if (typeof renderIpadShots === 'function') renderIpadShots();
  if (typeof renderStats === 'function') renderStats();
  if (typeof syncStatInputs === 'function') syncStatInputs();
  if (typeof update === 'function') update();
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

async function handleStoreImportSubmit() {
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

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Fetching...';
  }

  setStoreImportStatus('info', 'Connecting to Apple App Store API...');

  try {
    const importedState = await fetchStoreAppData(target);
    applyImportedStoreApp(importedState);
    closeStoreImportModal();
  } catch (err) {
    setStoreImportStatus('error', err.message || 'Failed to import app data from App Store.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Import App';
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
}

/**
 * Checks URL parameters on page load and auto-imports if present
 */
function checkAndLoadStoreParams() {
  if (typeof window === 'undefined' || !window.location || !window.location.search) return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const appid = sp.get('appid') || sp.get('apple') || sp.get('app_id') || sp.get('apple_id');
    const url = sp.get('url') || sp.get('store_url') || sp.get('link');

    let target = null;
    if (appid) {
      target = parseStoreInput(appid) || { platform: 'apple', id: appid.replace(/^id/i, ''), country: sp.get('country') || '' };
    } else if (url) {
      target = parseStoreInput(url);
    }

    if (target) {
      fetchStoreAppData(target)
        .then(state => {
          applyImportedStoreApp(state);
        })
        .catch(err => {
          console.warn('[StoreImport] Auto-load failed:', err.message);
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
}

// Node.js CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseStoreInput,
    normalizeAppleApp,
    fetchAppleAppData,
    fetchStoreAppData,
    applyImportedStoreApp
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
const isM=()=>innerWidth<=820;
function fit(){
  if(isExporting) return;
  const st=document.querySelector('.stage'),m=isM(),pad=m?20:40;
  const tb=document.querySelector('.stage-toolbar');
  const vt=(tb?tb.offsetHeight:40)+(m?14:18)+44;
  const isDual = document.body.dataset.dual === 'true' || appleDevice === 'dual' || googleDevice === 'dual';

  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    baseW = (isLand ? 870 : 416) * 2 + 28;
    baseH = isLand ? 416 : 870;
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

  const zw=(st.clientWidth-pad)/baseW;
  const zh=m?9:(st.clientHeight-pad-vt)/(baseH+8);
  const z=Math.max(.28,Math.min(1,zw,zh));

  const sd = $('stageDevices');
  if(sd) sd.style.gap = Math.round(28 * z) + 'px';

  if(!isDual && store === 'apple' && appleDevice === 'ipad'){
    const ipad = document.querySelector('.dev.ipad');
    if(ipad) ipad.style.zoom = z;
  }else if(!isDual && store === 'google' && googleDevice !== 'phone'){
    const t = $('dev-' + googleDevice);
    if(t) t.style.zoom = z;
  }else{
    $$('.dev:not(.ipad):not(.gtab)').forEach(d=>d.style.zoom=z);
  }
}
function setPanel(p){
  document.body.dataset.panel=p;
  $$('.mtabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
  requestAnimationFrame(fit);
}
$$('.mtabs button').forEach(b=>b.onclick=()=>setPanel(b.dataset.p));
const onStageResize = () => {
  fit();
  if (typeof syncAllVtPills === 'function') syncAllVtPills();
};
new ResizeObserver(onStageResize).observe(document.querySelector('.stage'));
addEventListener('resize', onStageResize);
addEventListener('orientationchange', () => setTimeout(onStageResize, 200));


// --- App Initialization ---
store = 'apple';
document.body.dataset.store = 'apple';
document.body.dataset.dual = 'false';
if (typeof setStore === 'function') setStore('apple', false);
document.body.dataset.appleDevice = appleDevice;
document.body.dataset.googleDevice = googleDevice;
$$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== store));

if(typeof loadDraftFromStorage === 'function') loadDraftFromStorage();

if(typeof hasUserDraft === 'function' && hasUserDraft()){
  CURRENT_PRESET_KEY = 'draft';
  loadPreset('draft');
} else if(!loadState()){
  restoring = true;
  try{
    loadPreset('taskflow');
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
if($('f-rdate') && !$('f-rdate').value){
  $('f-rdate').value = getCurrentMonthDateStr(2, true);
}
if(typeof updateMockupClocks === 'function'){
  updateMockupClocks();
  window.addEventListener('DOMContentLoaded', updateMockupClocks);
  window.addEventListener('load', updateMockupClocks);
}
setInterval(() => { if(typeof updateMockupClocks === 'function') updateMockupClocks(); }, 10000);
fit();
setTimeout(syncAllVtPills, 10);
setTimeout(syncAllVtPills, 120);
window.addEventListener('load', syncAllVtPills);
if (typeof checkAndLoadStoreParams === 'function') {
  checkAndLoadStoreParams();
}

