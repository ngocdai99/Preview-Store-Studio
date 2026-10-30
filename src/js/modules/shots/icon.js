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
  if(typeof ICON === 'string' && (ICON.includes('c6-bg') || ICON.includes('bfd1fd') || ICON.includes('d2c7fc'))) return true;
  return false;
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
    inspectBtn.disabled = placeholder;
    inspectBtn.classList.toggle('disabled', placeholder);
    inspectBtn.setAttribute('title', placeholder ? 'Upload an app icon to inspect store compliance' : 'Inspect Icon Details & Store Compliance');
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
      // Official documentation: https://support.google.com/googleplay/android-developer/answer/9866130
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

      // Compliant: All criteria met -> show clean ok dimTag, no intrusive message box
      if(dimTag){
        dimTag.className = 'shot-dim-tag ok';
        dimTag.textContent = '1:1 (1024×1024)';
        dimTag.title = 'App Store compliant';
        dimTag.style.display = 'inline-flex';
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

      // Compliant: All criteria met -> show clean ok dimTag, no intrusive message box
      if(dimTag){
        dimTag.className = 'shot-dim-tag ok';
        dimTag.textContent = '1:1 (512×512)';
        dimTag.title = 'Google Play compliant';
        dimTag.style.display = 'inline-flex';
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
