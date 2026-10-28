// Store Preview Studio - PNG Image Exporter via html2canvas
if($('optExportPNG')) $('optExportPNG').onclick = () => exportPNG(2);
const optExport3x = $('optExportPNG3x');
if(optExport3x) optExport3x.onclick = () => exportPNG(3);
const optExportScreen = $('optExportScreen');
if(optExportScreen) optExportScreen.onclick = () => exportPNG(3, {frameless:true});

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
    const padX = opts.frameless ? 0 : 10;

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
          if(opts.frameless){
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
              b.style.cssText = `position:absolute;${isLeft ? 'left:-7px;border-radius:4px 0 0 4px;background:linear-gradient(90deg,#9ca0ab 0%,#5b5e66 50%,#25262b 100%)' : 'right:-7px;border-radius:0 4px 4px 0;background:linear-gradient(90deg,#25262b 0%,#5b5e66 50%,#9ca0ab 100%)'};top:${top}px;width:7px;height:${height}px;box-shadow:0 0 0 1px #0b0b0d;pointer-events:none;`;
              d.appendChild(b);
            };
            if(d.classList.contains('ipad')){
              addBtn('left', 220, 76);
              addBtn('right', 220, 128);
            } else if(d.classList.contains('apple')){
              addBtn('left', 140, 38);
              addBtn('left', 198, 68);
              addBtn('left', 280, 68);
              addBtn('right', 210, 108);
            } else if(d.classList.contains('google')){
              addBtn('right', 180, 54);
              addBtn('right', 252, 106);
            }
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
    if(EXPORT_WM) canvas = addMockupNote(canvas, scaleFactor);

    const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
    let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if(!slug) slug = 'app';
    const link = document.createElement('a');
    link.download = `${slug}-${devSlug}-${opts.frameless ? 'screen' : 'preview'}-${scaleFactor}x.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`PNG (${scaleFactor}x${opts.frameless ? ', screen only' : ''}) downloaded!`, 'ok');
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
