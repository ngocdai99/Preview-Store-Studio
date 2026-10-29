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
  if(typeof validateFeatureGraphic === 'function') validateFeatureGraphic();
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
