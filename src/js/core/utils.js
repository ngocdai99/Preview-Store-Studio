// Store Preview Studio · Core Utilities

/* =========================================================================
   STORE PREVIEW STUDIO · CORE ARCHITECTURE & CLIENT-SIDE LOGIC
   ========================================================================= */

const $=id=>document.getElementById(id), $$=s=>[...document.querySelectorAll(s)];
let store = 'apple';
let isFloating = true;

// --- Reusable Crisp Vector Action Icons ---
const ICO_SPARKLE = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.4 5.4 5.6 2.1-5.6 2.1-2.4 5.4-2.4-5.4-5.6-2.1 5.6-2.1 2.4-5.4zm7.5 12.5l1.2 2.7 2.8 1-2.8 1-1.2 2.8-1.2-2.8-2.8-1 2.8-1 1.2-2.7z"></path></svg></span>`;
const ICO_DL = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>`;
const ICO_ZIP = `<span class="btn-mini-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><polyline points="9 14 12 17 15 14"></polyline></svg></span>`;
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
let _isZipExporting = false;

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


// --- Accurate Unicode & Emoji Grapheme Counter ---
const graphemeSegmenter = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;
function countChars(str){
  if(!str) return 0;
  if(graphemeSegmenter) return [...graphemeSegmenter.segment(str)].length;
  return Array.from(str).length;
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
  const isErr = icon === '⚠️' || icon === 'err' || icon === 'warn' || icon === 'error';
  t.className = isErr ? 'toast error' : 'toast success';
  const iconHtml = (icon && icon !== '✓' && icon !== '⚠️' && icon !== 'err' && icon !== 'warn' && icon !== 'error')
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

// --- Client-side ZIP Package Generator (Store/Uncompressed format, 100% Offline & Zero-dependency) ---
const _crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  _crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = _crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function dataUrlToUint8Array(dataUrl) {
  const parts = dataUrl.split(',');
  const binStr = (typeof atob !== 'undefined') ? atob(parts[1] || '') : Buffer.from(parts[1] || '', 'base64').toString('binary');
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes;
}

function createZipBlob(files) {
  const encoder = (typeof TextEncoder !== 'undefined') ? new TextEncoder() : { encode: s => Buffer.from(s, 'utf8') };
  const fileEntries = [];
  let offset = 0;
  const parts = [];

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const data = f.data instanceof Uint8Array ? f.data : new Uint8Array(f.data);
    const crc = crc32(data);
    const size = data.length;

    const lh = new Uint8Array(30);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true); // Local file header signature
    dv.setUint16(4, 20, true);         // Version needed (2.0)
    dv.setUint16(6, 0, true);          // Flags
    dv.setUint16(8, 0, true);          // Compression (0 = STORE)
    dv.setUint16(10, 0x4000, true);    // Time
    dv.setUint16(12, 0x5421, true);    // Date
    dv.setUint32(14, crc, true);       // CRC32
    dv.setUint32(18, size, true);      // Compressed size
    dv.setUint32(22, size, true);      // Uncompressed size
    dv.setUint16(26, nameBytes.length, true); // Name length
    dv.setUint16(28, 0, true);         // Extra length

    fileEntries.push({ nameBytes, crc, size, offset });
    parts.push(lh, nameBytes, data);
    offset += 30 + nameBytes.length + size;
  }

  const cdOffset = offset;
  for (const f of fileEntries) {
    const cd = new Uint8Array(46);
    const dv = new DataView(cd.buffer);
    dv.setUint32(0, 0x02014b50, true); // Central header signature
    dv.setUint16(4, 20, true);         // Version made by
    dv.setUint16(6, 20, true);         // Version needed
    dv.setUint16(8, 0, true);          // Flags
    dv.setUint16(10, 0, true);         // Compression (0 = STORE)
    dv.setUint16(12, 0x4000, true);    // Time
    dv.setUint16(14, 0x5421, true);    // Date
    dv.setUint32(16, f.crc, true);     // CRC32
    dv.setUint32(20, f.size, true);    // Compressed size
    dv.setUint32(24, f.size, true);    // Uncompressed size
    dv.setUint16(28, f.nameBytes.length, true); // Name length
    dv.setUint16(30, 0, true);         // Extra length
    dv.setUint16(32, 0, true);         // Comment length
    dv.setUint16(34, 0, true);         // Disk start
    dv.setUint16(36, 0, true);         // Internal attr
    dv.setUint32(38, 0, true);         // External attr
    dv.setUint32(42, f.offset, true);  // Local header offset

    parts.push(cd, f.nameBytes);
    offset += 46 + f.nameBytes.length;
  }

  const cdSize = offset - cdOffset;
  const eocd = new Uint8Array(22);
  const dv = new DataView(eocd.buffer);
  dv.setUint32(0, 0x06054b50, true);  // EOCD signature
  dv.setUint16(4, 0, true);           // Disk number
  dv.setUint16(6, 0, true);           // Start disk
  dv.setUint16(8, fileEntries.length, true);  // Disk entries
  dv.setUint16(10, fileEntries.length, true); // Total entries
  dv.setUint32(12, cdSize, true);     // CD size
  dv.setUint32(16, cdOffset, true);   // CD offset
  dv.setUint16(20, 0, true);          // Comment length

  parts.push(eocd);
  if (typeof Blob !== 'undefined') {
    return new Blob(parts, { type: 'application/zip' });
  }
  return parts;
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

