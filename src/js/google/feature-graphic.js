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
// Helper to check if current feature graphic is a placeholder / empty
function isPlaceholderFeature(){
  const currentAsset = (typeof FEATURE_GRAPHIC !== 'undefined' ? FEATURE_GRAPHIC : '');
  if(!currentAsset) return true;
  if(typeof BLANK_FEATURE !== 'undefined' && currentAsset === BLANK_FEATURE) return true;
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
      if(typeof canUpload === 'function' && !canUpload(1000)) return;
      if($('featureFile')) $('featureFile').click();
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
  if(!currentAsset || currentAsset === (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')){
    badge.className = 'shot-status-badge warn';
    badge.innerHTML = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span><span><strong>No Feature Graphic uploaded yet.</strong> Google Play requires a 1024×500 px asset for store featuring.</span>`;
    badge.style.display = 'flex';
    if(dimTag) dimTag.style.display = 'none';
    if(removeBtn) removeBtn.style.display = 'none';
    return;
  }

  // If current asset is an SVG (e.g. from preset or SVG upload), rasterize to 1024x500 PNG
  if(typeof rasterizeSvgToDimensions === 'function' && typeof currentAsset === 'string' && (currentAsset.startsWith('data:image/svg+xml') || currentAsset.includes('<svg'))){
    rasterizeSvgToDimensions(currentAsset, 1024, 500, pngData => {
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

  const runId = ++_featureValRunId;
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
