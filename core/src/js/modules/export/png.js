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
  if(typeof isDemoMode === 'function' && isDemoMode() && !opts.allowDemo){
    if(typeof requireFullVersion === 'function') requireFullVersion('export-png');
    return;
  }
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
  const padY = opts.frameless ? 0 : 8;

  let offscreenWrap = null;
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready.catch(() => {});
    }

    // Create an unzoomed offscreen clone so html2canvas initializes layout bounds at true 1x scale
    // and keeps the live screen DOM completely untouched (zero visual jitter, flicker or collapse).
    offscreenWrap = document.createElement('div');
    offscreenWrap.style.cssText = `position:fixed;left:0;top:0;width:${w + padX * 2}px;height:${h + padY * 2}px;opacity:0.001;pointer-events:none;z-index:-99999;overflow:visible;`;
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
      y: -padY,
      width: w + padX * 2,
      height: h + padY * 2,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(document.documentElement.clientWidth, w + 140),
      windowHeight: Math.max(document.documentElement.clientHeight, h + 140),
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
          .g-met [data-gmet-rating] b {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2.5px !important;
            height: 20px !important;
            line-height: 1 !important;
          }
          .g-star-ico {
            display: inline-block !important;
            vertical-align: middle !important;
            width: 11px !important;
            height: 11px !important;
            flex-shrink: 0 !important;
            margin-top: -0.5px !important;
          }
          .phone.apple:not(.ipad) .a-met > div {
            height: 48px !important;
            max-height: 48px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            overflow: hidden !important;
            align-self: center !important;
          }
          .phone.ipad .a-met > div, .dev.landscape .phone.apple:not(.ipad) .a-met > div {
            height: 54px !important;
            max-height: 54px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            overflow: hidden !important;
            align-self: center !important;
          }
          .a-met-dev-ico, .ipad-met-dev-ico {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
          }
          .a-met-dev-ico svg, .ipad-met-dev-ico svg {
            margin: 0 auto !important;
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
            font-weight: 400 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .get, .ipad-get, .sr-get-btn, .ipad-sr-get-btn, .ipad-floating-get, .a-nav-get {
            font-weight: 400 !important;
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
          } else if(!opts.frameless && !d.classList.contains('landscape')){
            const addBtn = (side, offset, size, isHorizontal = false) => {
              const b = clonedDoc.createElement('div');
              let posCss = '';
              if (isHorizontal) {
                const isTop = side === 'top';
                const offLeft = typeof offset === 'object' && offset.left !== undefined ? `left:${offset.left}px;` : '';
                const offRight = typeof offset === 'object' && offset.right !== undefined ? `right:${offset.right}px;` : '';
                posCss = `top:${isTop ? '-5px' : 'auto'};bottom:${isTop ? 'auto' : '-5px'};${offLeft}${offRight}width:${size}px;height:5px;border-radius:${isTop ? '3px 3px 0 0' : '0 0 3px 3px'};background:linear-gradient(${isTop ? '180deg,#565860 0%,#36383e 55%,#1d1e22 100%' : '0deg,#565860 0%,#36383e 55%,#1d1e22 100%'});`;
              } else {
                const isLeft = side === 'left';
                posCss = `${isLeft ? 'left:-5px;border-radius:3px 0 0 3px;background:linear-gradient(90deg,#565860 0%,#36383e 55%,#1d1e22 100%)' : 'right:-5px;border-radius:0 3px 3px 0;background:linear-gradient(90deg,#1d1e22 0%,#36383e 45%,#565860 100%)'};top:${offset}px;width:5px;height:${size}px;`;
              }
              b.style.cssText = `position:absolute;${posCss}box-shadow:0 0 0 1px #0b0b0d;pointer-events:none;`;
              d.appendChild(b);
            };
            if(d.classList.contains('ipad')){
              // iPad: Top Button (Power) on top edge near right corner + 2 Volume Buttons on right edge near camera
              addBtn('top', { right: 65 }, 52, true);
              addBtn('right', 55, 34);
              addBtn('right', 99, 34);
            } else if(d.classList.contains('gtab')){
              if(d.classList.contains('portrait')){
                // Android Tablet (Portrait): Power on Top edge + 2 Volume Buttons on Right edge
                addBtn('top', { right: 55 }, 48, true);
                addBtn('right', 48, 32);
                addBtn('right', 90, 32);
              } else {
                // Android Tablet (Landscape): Power on Left edge + 2 Volume Buttons on Top edge near corner
                addBtn('left', 48, 48);
                addBtn('top', { left: 48 }, 34, true);
                addBtn('top', { left: 92 }, 34, true);
              }
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

        // Enforce font-weight 400 for GET buttons and metrics labels (small & i) in export
        clonedEl.querySelectorAll('.get, .ipad-get, .sr-get-btn, .ipad-sr-get-btn, .ipad-floating-get, .a-nav-get, .a-met small, .a-met i, .ipad-met small, .ipad-met i').forEach(el => {
          el.style.fontWeight = '400';
        });

        // Enforce horizontal centering for developer icon in metrics
        clonedEl.querySelectorAll('.a-met-dev-ico, .ipad-met-dev-ico').forEach(el => {
          el.style.display = 'flex';
          el.style.justifyContent = 'center';
          el.style.alignItems = 'center';
          el.style.width = '100%';
        });

        // Enforce vertical centering for Google Play rating star in export
        clonedEl.querySelectorAll('.g-met [data-gmet-rating] b').forEach(el => {
          el.style.display = 'inline-flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.gap = '2.5px';
          el.style.height = '20px';
          el.style.lineHeight = '1';
        });
        clonedEl.querySelectorAll('.g-star-ico').forEach(el => {
          el.style.display = 'inline-block';
          el.style.verticalAlign = 'middle';
          el.style.width = '11px';
          el.style.height = '11px';
          el.style.flexShrink = '0';
          el.style.marginTop = '-0.5px';
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
