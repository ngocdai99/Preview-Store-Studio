// Store Preview Studio - Icon Manager & Real-Time Store Validator
let ICON_FILE_SIZE = 0;
let ICON_FILE_TYPE = '';
let ICON_FILE_NAME = '';

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
function renderIcons(){
  $$('[data-icon]').forEach(i=>{safe(i);i.src=(typeof getDisplaySrc==='function'?getDisplaySrc(ICON, i):ICON)});
  validateAppIcon();
}

function renderFeature(){
  $$('[data-feature]').forEach(i=>{safe(i);i.src=(typeof getDisplaySrc==='function'?getDisplaySrc(FEATURE_GRAPHIC, i):FEATURE_GRAPHIC)});
}

let _iconValRunId = 0;
function validateAppIcon(){
  const badge = $('iconStatusBadge');
  if(!badge || !ICON) return;
  const targetDim = (store === 'google' ? 512 : 1024);
  if(typeof rasterizeSvgToStorePng === 'function' && typeof ICON === 'string' && ICON.startsWith('data:image/svg+xml')){
    rasterizeSvgToStorePng(ICON, targetDim, pngSrc => {
      runIconPixelAudit(pngSrc);
    });
    return;
  }
  runIconPixelAudit(ICON);
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
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Non-Square Aspect Ratio (${w}×${h} px):</strong> Apple App Store requires a 1:1 square icon (1024×1024 px).</span>`;
        return;
      }

      // Rule 2: PNG format required
      if(mimeType && !isPng){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Format Notice:</strong> App Store icon must be PNG format (sRGB or Display P3).</span>`;
        return;
      }

      // Rule 3: 100% Opaque (no alpha channel)
      if(hasAlpha){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Xcode Rejection Risk (${w}×${h} px):</strong> Alpha transparency detected. iOS icons must be 100% opaque.</span>`;
        return;
      }

      // Rule 4: Exact 1024×1024 px dimensions
      if(w !== 1024 || h !== 1024){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Xcode &amp; App Store require exact <strong>1024×1024 px</strong>.</span>`;
        return;
      }

      // Compliant: All Apple criteria met.
      badge.className = 'shot-status-badge ok';
      badge.innerHTML = `${SB_OK}<span><strong>Xcode &amp; App Store Ready:</strong> 1024×1024 px · PNG · 100% Opaque (sRGB/Display P3)</span>`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GOOGLE PLAY VALIDATION
    // Specification:
    // - Dimensions: 512 × 512 px, 1:1 square
    // - Format: 32-bit PNG, sRGB
    // - File Size: Max 1024 KB (1 MB) - red error if exceeded
    // - Shape: Khong bo goc, khong do bong trong file (Google tu ap dynamic corner radius 20% & shadow)
    // Official guidelines:
    // - https://support.google.com/googleplay/android-developer/answer/9866130
    // ─────────────────────────────────────────────────────────────────────────
    else {
      // Rule 1: 1:1 Square aspect ratio
      if(!isSq){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Google Play Error (${w}×${h} px):</strong> Icon must be a 1:1 square (512×512 px).</span>`;
        return;
      }

      // Rule 2: Max file size 1024 KB (1 MB)
      const MAX_GOOGLE_ICON_BYTES = 1024 * 1024; // 1024 KB = 1,048,576 bytes
      if(sizeBytes > MAX_GOOGLE_ICON_BYTES){
        const sizeKb = (sizeBytes / 1024).toFixed(1);
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Google Play File Size Error (${sizeKb} KB):</strong> Exceeds maximum allowed <strong>1024 KB (1 MB)</strong>. Google Play Console will reject this icon.</span>`;
        return;
      }

      // Rule 3: 32-bit PNG format (sRGB color space)
      if(mimeType && !isPng){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Format Error:</strong> Google Play requires 32-bit PNG format (sRGB color space).</span>`;
        return;
      }

      // Rule 4: Do not include rounded corners or drop shadows in artwork
      if(hasPreRoundedCorners){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Pre-rounded Corners / Shadow Notice:</strong> Do not include rounded corners or drop shadows in artwork; Google Play dynamically applies corner radius (20%) and drop shadow upon upload.</span>`;
        return;
      }

      // Rule 5: Target dimensions 512×512 px
      if(w !== 512 || h !== 512){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Google Play requires <strong>512×512 px</strong> square.</span>`;
        return;
      }

      // Compliant: All Google Play specifications passed
      const sizeNote = sizeBytes ? ` · ${(sizeBytes / 1024).toFixed(0)} KB (≤ 1024 KB)` : '';
      badge.className = 'shot-status-badge ok';
      badge.innerHTML = `${SB_OK}<span><strong>Google Play Compliant:</strong> 512×512 px · 32-bit PNG (sRGB)${sizeNote}</span>`;
    }
  };
  img.src = iconSrc;
}

// Icon Upload & Drag-and-drop Listeners
if($('icoUp')){
  $('icoUp').onclick = () => {
    if(typeof canUpload === 'function' && !canUpload(1000)) return;
    if($('icoFile')) $('icoFile').click();
  };
}
if($('icoInspect')){
  $('icoInspect').onclick = () => {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  };
}
if($('iconStatusBadge')){
  $('iconStatusBadge').onclick = () => {
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  };
}
const icoPrevImg = $('icoPrev');
if(icoPrevImg){
  icoPrevImg.style.cursor = 'pointer';
  icoPrevImg.onclick = e => {
    e.stopPropagation();
    if(typeof openImageDetailModal === 'function'){
      openImageDetailModal({ src: ICON, type: 'icon', store });
    }
  };
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
      renderIcons();
      saveState();
      showToast('App icon updated!', 'ok');
    });
    e.target.value = '';
  };
}

// Drag & drop local image directly onto Icon zone
const icoDropZone = $('icoDropZone');
if(icoDropZone){
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
        renderIcons();
        saveState();
        showToast('App icon dropped & applied!', 'ok');
      });
    }
  });
}
