// Store Preview Studio · Phone Screenshots Manager & Icon Validator
let ICON_FILE_SIZE = 0;
let ICON_FILE_TYPE = '';
let ICON_FILE_NAME = '';

function getIconMeta(){
  let size = ICON_FILE_SIZE || 0;
  let type = ICON_FILE_TYPE || '';
  if((!size || !type) && typeof ICON === 'string' && ICON.startsWith('data:')){
    const comma = ICON.indexOf(',');
    if(comma !== -1){
      if(!type){
        const semi = ICON.indexOf(';');
        if(semi !== -1) type = ICON.substring(5, semi);
      }
      if(!size){
        const base64 = ICON.slice(comma + 1);
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

let _iconValRunId = 0;
function validateAppIcon(){
  const badge = $('iconStatusBadge');
  if(!badge || !ICON) return;
  const runId = ++_iconValRunId;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if(runId !== _iconValRunId) return;
    const w = img.naturalWidth || 1024;
    const h = img.naturalHeight || 1024;
    const isSq = (w === h);

    const meta = getIconMeta();
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
    // - File Size: KHÔNG kiểm tra dung lượng MB (Apple không công bố giới hạn)
    // Official guidelines:
    // - https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
    // - https://developer.apple.com/design/human-interface-guidelines/app-icons
    // ─────────────────────────────────────────────────────────────────────────
    if(store === 'apple'){
      // Rule 1: 1:1 Square aspect ratio
      // Official Apple Spec: https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
      if(!isSq){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Non-Square Aspect Ratio (${w}×${h} px):</strong> Apple App Store requires a 1:1 square icon (1024×1024 px).</span>`;
        return;
      }

      // Rule 2: PNG format required
      // Official Apple Spec: https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
      if(mimeType && !isPng){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Format Notice:</strong> App Store icon must be PNG format (sRGB or Display P3).</span>`;
        return;
      }

      // Rule 3: 100% Opaque (no alpha channel)
      // "The icon cannot be transparent nor contain an alpha channel."
      // Official Apple Spec: https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
      if(hasAlpha){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Xcode Rejection Risk (${w}×${h} px):</strong> Alpha transparency detected. iOS icons must be 100% opaque.</span>`;
        return;
      }

      // Rule 4: Exact 1024×1024 px dimensions
      // Official Apple Spec: https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
      if(w !== 1024 || h !== 1024){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Xcode &amp; App Store require exact <strong>1024×1024 px</strong>.</span><div class="sb-actions"><button type="button" class="mini dl-btn" id="btnDlIconBadge" title="Download icon">${ICO_DL}Download</button></div>`;
        const dlBtn = $('btnDlIconBadge');
        if(dlBtn) dlBtn.onclick = () => downloadAppIcon(1024);
        return;
      }

      // Compliant: All Apple criteria met. Note: Apple does NOT publish a file size MB limit, so no MB check is performed.
      // Official Apple Spec: https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications/
      badge.className = 'shot-status-badge ok';
      badge.innerHTML = `${SB_OK}<span><strong>Xcode &amp; App Store Ready:</strong> 1024×1024 px · PNG · 100% Opaque (sRGB/Display P3)</span><div class="sb-actions"><button type="button" class="mini dl-btn" id="btnDlIconBadge">${ICO_DL}Download 1024px</button></div>`;
      const dlBtn = $('btnDlIconBadge');
      if(dlBtn) dlBtn.onclick = () => downloadAppIcon(1024);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GOOGLE PLAY VALIDATION
    // Specification:
    // - Dimensions: 512 × 512 px, 1:1 square
    // - Format: 32-bit PNG, sRGB
    // - File Size: Max 1024 KB (1 MB) - red error if exceeded
    // - Shape: Không bo góc, không đổ bóng trong file (Google tự áp dynamic corner radius 20% & shadow)
    // Official guidelines:
    // - https://support.google.com/googleplay/android-developer/answer/9866130
    // ─────────────────────────────────────────────────────────────────────────
    else {
      // Rule 1: 1:1 Square aspect ratio
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      if(!isSq){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Google Play Error (${w}×${h} px):</strong> Icon must be a 1:1 square (512×512 px).</span>`;
        return;
      }

      // Rule 2: Max file size 1024 KB (1 MB). Red error if exceeded.
      // "Max file size: 1024 KB" - Google Play Console rejects uploads > 1024 KB.
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      const MAX_GOOGLE_ICON_BYTES = 1024 * 1024; // 1024 KB = 1,048,576 bytes
      if(sizeBytes > MAX_GOOGLE_ICON_BYTES){
        const sizeKb = (sizeBytes / 1024).toFixed(1);
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Google Play File Size Error (${sizeKb} KB):</strong> Exceeds maximum allowed <strong>1024 KB (1 MB)</strong>. Google Play Console will reject this icon.</span>`;
        return;
      }

      // Rule 3: 32-bit PNG format (sRGB color space)
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      if(mimeType && !isPng){
        badge.className = 'shot-status-badge err';
        badge.innerHTML = `${SB_ERR}<span><strong>Format Error:</strong> Google Play requires 32-bit PNG format (sRGB color space).</span>`;
        return;
      }

      // Rule 4: Do not include rounded corners or drop shadows in artwork
      // "Do not submit artwork with rounded corners or drop shadows."
      // "Google Play dynamically applies corner radius (20% of icon size) and drop shadow upon upload."
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      if(hasPreRoundedCorners){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Pre-rounded Corners / Shadow Notice:</strong> Do not include rounded corners or drop shadows in artwork; Google Play dynamically applies corner radius (20%) and drop shadow upon upload.</span><div class="sb-actions"><button type="button" class="mini dl-btn" id="btnDlIconBadge" title="Download icon">${ICO_DL}Download</button></div>`;
        const dlBtn = $('btnDlIconBadge');
        if(dlBtn) dlBtn.onclick = () => downloadAppIcon(512);
        return;
      }

      // Rule 5: Target dimensions 512×512 px
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      if(w !== 512 || h !== 512){
        badge.className = 'shot-status-badge warn';
        badge.innerHTML = `${SB_WARN}<span><strong>Dimension Notice (${w}×${h} px):</strong> Google Play requires <strong>512×512 px</strong> square.</span><div class="sb-actions"><button type="button" class="mini dl-btn" id="btnDlIconBadge" title="Download icon">${ICO_DL}Download</button></div>`;
        const dlBtn = $('btnDlIconBadge');
        if(dlBtn) dlBtn.onclick = () => downloadAppIcon(512);
        return;
      }

      // Compliant: All Google Play specifications passed
      // Official Google Spec: https://support.google.com/googleplay/android-developer/answer/9866130
      const sizeNote = sizeBytes ? ` · ${(sizeBytes / 1024).toFixed(0)} KB (≤ 1024 KB)` : '';
      badge.className = 'shot-status-badge ok';
      badge.innerHTML = `${SB_OK}<span><strong>Google Play Compliant:</strong> 512×512 px · 32-bit PNG (sRGB)${sizeNote}</span><div class="sb-actions"><button type="button" class="mini dl-btn" id="btnDlIconBadge">${ICO_DL}Download 512px</button></div>`;
      const dlBtn = $('btnDlIconBadge');
      if(dlBtn) dlBtn.onclick = () => downloadAppIcon(512);
    }
  };
  img.src = ICON;
}

function downloadAppIcon(targetSize){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';
  const size = targetSize || (store === 'google' ? 512 : 1024);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (store === 'apple') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, size, size);
    }
    ctx.drawImage(img, 0, 0, size, size);
    c.toBlob(blob => {
      if(!blob){
        showToast('Error creating icon file', 'warn');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-icon-${size}x${size}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Downloaded ${size}×${size} px App Icon!`, '⬇️');
    }, 'image/png');
  };
  img.onerror = () => {
    showToast('Failed to load icon for download', 'warn');
  };
  img.src = ICON;
}

function renderFeature(){
  $$('[data-feature]').forEach(i=>{safe(i);i.src=(typeof getDisplaySrc==='function'?getDisplaySrc(FEATURE_GRAPHIC, i):FEATURE_GRAPHIC)});
}

function renderShots(){
  // Sanitize SHOTS array to ensure strings only
  SHOTS = SHOTS.filter(s => typeof s === 'string');

  // Update Phone Mockup Carousels
  $$('[data-shots=gal]').forEach(c=>{
    c.innerHTML='';
    SHOTS.filter(s=>s.trim()).forEach((s,i)=>c.appendChild(mk(s,'Screenshot '+(i+1))));
  });
  $$('[data-shots=shots]').forEach(c=>{
    c.innerHTML='';
    SHOTS.slice(0,3).forEach((s,i)=>c.appendChild(mk(s||PH,'Result '+(i+1))));
  });

  // Validate screenshots count & aspect ratios
  validateScreenshots();
  if(typeof renderIpadShots === 'function') renderIpadShots();

  // Update Editor Screenshot List with Drag & Drop Sorting
  const L=$('slist');
  L.innerHTML='';
  SHOTS.forEach((s,i)=>{
    const r=document.createElement('div');
    r.className='srow';
    r.draggable=true;
    r.dataset.index=i;

    // Drag Handle
    const handle=document.createElement('div');
    handle.className='drag-handle';
    handle.textContent='⠿';
    handle.title='Drag to reorder';
    r.appendChild(handle);

    // Thumbnail Preview
    r.appendChild(mk(s||PH));

    // Input & Actions
    const col=document.createElement('div');col.className='col';
    const inp=document.createElement('input');inp.type='text';
    inp.value=s.startsWith('data:')?'(Embedded / Uploaded Image)':s;
    inp.placeholder='https://… image URL or upload';
    inp.disabled=s.startsWith('data:');
    inp.onchange=()=>{SHOTS[i]=inp.value.trim();renderShots();saveState()};

    const act=document.createElement('div');act.className='act';
    act.innerHTML='<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button><button class="mini" data-m="-1" title="Move Up">↑</button><button class="mini" data-m="1" title="Move Down">↓</button><button class="mini del" title="Delete">✕</button><span class="shot-dim-tag" id="shotDimTag_'+i+'" style="margin-left:auto;display:none"></span>';
    const b=act.children;
    b[0].onclick=()=>{if(typeof canUpload === 'function' && !canUpload(1000)) return; pick=i;$('shotFile').click()};
    b[1].onclick=()=>mv(i,-1);
    b[2].onclick=()=>mv(i,1);
    b[3].onclick=()=>{SHOTS.splice(i,1);renderShots();saveState()};

    col.append(inp,act);
    r.appendChild(col);

    // Drag & Drop event handlers for row reordering
    r.addEventListener('dragstart',e=>{
      r.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',i);
    });
    r.addEventListener('dragend',()=>{
      r.classList.remove('dragging');
      $$('.srow').forEach(row=>row.classList.remove('drag-over'));
    });
    r.addEventListener('dragover',e=>{
      e.preventDefault();
      e.dataTransfer.dropEffect='move';
      r.classList.add('drag-over');
    });
    r.addEventListener('dragleave',()=>{
      r.classList.remove('drag-over');
    });
    r.addEventListener('drop',e=>{
      e.preventDefault();
      r.classList.remove('drag-over');
      const fromIdx=parseInt(e.dataTransfer.getData('text/plain'),10);
      const toIdx=i;
      if(!isNaN(fromIdx)&&fromIdx!==toIdx){
        const item=SHOTS.splice(fromIdx,1)[0];
        SHOTS.splice(toIdx,0,item);
        renderShots();
        saveState();
      }
    });

    L.appendChild(r);
  });
}

function mv(i,d){
  const j=i+d;if(j<0||j>=SHOTS.length)return;
  [SHOTS[i],SHOTS[j]]=[SHOTS[j],SHOTS[i]];
  renderShots();
  saveState();
}

let _phoneValRunId = 0;
function validateScreenshots(){
  const runId = ++_phoneValRunId;
  const validShots = SHOTS.filter(s=>s && s.trim());
  const validCount = validShots.length;
  const counterEl = $('shotCounter');
  if(counterEl){
    counterEl.textContent = `${validCount} / 8 screenshots`;
    counterEl.className = 'cc' + (validCount < 2 ? ' warn' : validCount > 8 ? ' err' : '');
  }
  const badgeEl = $('shotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  const dlBtnHtml = validCount > 0 ? `<button class="mini dl-btn" id="btnDlAllPhone" style="margin-left:auto;white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:7px">${ICO_ZIP}Export (ZIP)</button>` : '';

  if(validCount < 2){
    badgeEl.className = 'shot-status-badge warn';
    badgeEl.innerHTML = `${SB_WARN}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Notice:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'}. Stores require at least <strong>2 screenshots</strong>.</span>${dlBtnHtml}`;
    if($('btnDlAllPhone')){
      $('btnDlAllPhone').onclick = () => downloadAllPhoneScreenshots();
    }
    return;
  }
  if(validCount > 8 && store === 'google'){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>Google Play Rejection Risk:</strong> ${validCount} screenshots. Google Play allows a maximum of <strong>8 screenshots</strong>.</span>${dlBtnHtml}`;
    if($('btnDlAllPhone')){
      $('btnDlAllPhone').onclick = () => downloadAllPhoneScreenshots();
    }
    return;
  }
  if(validCount > 10 && store === 'apple'){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${validCount} screenshots. Apple allows a maximum of <strong>10 screenshots</strong> per display.</span>${dlBtnHtml}`;
    if($('btnDlAllPhone')){
      $('btnDlAllPhone').onclick = () => downloadAllPhoneScreenshots();
    }
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
    const dlBtn = `<button class="mini dl-btn" id="btnDlAllPhone" style="margin-left:auto;white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:7px">${ICO_ZIP}Export (ZIP)</button>`;
    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      if(store === 'apple'){
        badgeEl.className = 'shot-status-badge err';
        badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Screenshot ${items} is square (1:1). Apple requires portrait phone resolutions (e.g. 1290×2796 px).</span>${dlBtn}`;
      } else {
        badgeEl.className = 'shot-status-badge warn';
        badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> Screenshot ${items} is square (1:1). Standard phone screenshots should be portrait (9:16 or 9:19.5). Square photos will be cropped or letterboxed in phone mockups.</span>${dlBtn}`;
      }
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Aspect Ratio Notice:</strong> Screenshot ${items} has non-standard ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>${dlBtn}`;
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Google Play Error:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>${dlBtn}`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Compliant:</strong> ${validCount} screenshots (Valid range: 2–${maxAllowed}) · All portrait phone aspect ratios.</span>${dlBtn}`;
    }
    if($('btnDlAllPhone')){
      $('btnDlAllPhone').onclick = () => downloadAllPhoneScreenshots();
    }
  }
}

let pick=-1;
// (readFile is provided by core/utils.js)

$('shotFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  readFile(f,d=>{
    pick<0?SHOTS.push(d):SHOTS[pick]=d;
    pick=-1;
    renderShots();
    saveState();
    showToast('Screenshot uploaded!','📸');
  });
  e.target.value='';
};
$('addShot').onclick=()=>{
  SHOTS.push('');
  renderShots();
  saveState();
  const ins=$$('.srow input');if(ins.length)ins[ins.length-1].focus();
};
$('icoUp').onclick=()=>{if(typeof canUpload === 'function' && !canUpload(1000)) return; $('icoFile').click()};
if($('icoDown')) $('icoDown').onclick = () => downloadAppIcon();
$('icoFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  ICON_FILE_SIZE = f.size || 0;
  ICON_FILE_TYPE = f.type || '';
  ICON_FILE_NAME = f.name || '';
  readFile(f,d=>{
    ICON=d;
    renderIcons();
    saveState();
    showToast('App icon updated!','🎨');
  });
  e.target.value='';
};

// Drag & drop local image directly onto Icon zone
const icoDropZone = $('icoDropZone');
if(icoDropZone){
  icoDropZone.addEventListener('dragover',e=>{e.preventDefault();icoDropZone.classList.add('drag-over')});
  icoDropZone.addEventListener('dragleave',()=>{icoDropZone.classList.remove('drag-over')});
  icoDropZone.addEventListener('drop',e=>{
    e.preventDefault();icoDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')){
      ICON_FILE_SIZE = file.size || 0;
      ICON_FILE_TYPE = file.type || '';
      ICON_FILE_NAME = file.name || '';
      readFile(file,d=>{ICON=d;renderIcons();saveState();showToast('App icon dropped & applied!','🎨')});
    }
  });
}

// --- Supported Devices (Apple Destination: iPhone vs Universal iPad) ---
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
    effectiveShots.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
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

    // Thumbnail Preview
    r.appendChild(mk(s || PH));

    // Input & Actions
    const col = document.createElement('div'); col.className = 'col';
    const inp = document.createElement('input'); inp.type = 'text';
    inp.value = s.startsWith('data:') ? '(Embedded / Uploaded Image)' : s;
    inp.placeholder = 'https://… image URL or upload';
    inp.disabled = s.startsWith('data:');
    inp.onchange = () => { IPAD_SHOTS[i] = inp.value.trim(); renderIpadShots(); saveState(); };

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button>' +
      '<button class="mini" data-m="-1" title="Move Up">↑</button>' +
      '<button class="mini" data-m="1" title="Move Down">↓</button>' +
      '<button class="mini fit-btn" id="btnFitIpad_' + i + '" title="Resize / Fit to Apple iPad Pro 13&quot; (2048×2732 px)">' + ICO_SPARKLE + 'Fit</button>' +
      '<button class="mini dl-btn" id="btnDlIpad_' + i + '" title="Download 2048×2732 px PNG">' + ICO_DL + '</button>' +
      '<button class="mini del" title="Delete">✕</button>' +
      '<span class="shot-dim-tag" id="ipadShotDimTag_' + i + '" style="margin-left:auto;display:none"></span>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };
    b[1].onclick = () => mvIpad(i, -1);
    b[2].onclick = () => mvIpad(i, 1);
    b[3].onclick = () => fixIpadScreenshot(i);
    b[4].onclick = () => downloadIpadScreenshot(i);
    b[5].onclick = () => { IPAD_SHOTS.splice(i, 1); renderIpadShots(); saveState(); };

    col.append(inp, act);
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
  const squareIndices = [];
  const phoneRatioIndices = [];
  const nonIpadIndices = [];

  IPAD_SHOTS.forEach((s, idx) => {
    const tag = $('ipadShotDimTag_' + idx);
    if(!s || !s.trim()){
      if(tag) tag.style.display = 'none';
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if(runId !== _ipadValRunId) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if(w > 0 && h > 0){
        const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
        const ratio = w / h;
        // iPad 4:3 Portrait: ratio ~ 0.70 to 0.80 (2048x2732 is 0.7496, 2064x2752 is 0.75)
        const isIpadPortrait = (ratio >= 0.68 && ratio <= 0.82);
        // iPad 4:3 Landscape: ratio ~ 1.25 to 1.45 (2732x2048 is 1.3333, 2752x2064 is 1.3333)
        const isIpadLandscape = (ratio >= 1.22 && ratio <= 1.45);
        // Phone aspect ratio: Portrait 9:16 (~0.56) or 9:19.5 (~0.46)
        const isPhonePortrait = (ratio < 0.62);

        if(tag){
          tag.style.display = 'inline-flex';
          if(isSquare){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `1:1 Square (${w}×${h})`;
          } else if(isPhonePortrait){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Phone Ratio (${w}×${h})`;
          } else if(isIpadPortrait){
            tag.className = 'shot-dim-tag ok';
            tag.textContent = (w === 2048 && h === 2732) || (w === 2064 && h === 2752)
              ? `iPad 13" 4:3 (${w}×${h})`
              : `iPad 4:3 (${w}×${h})`;
          } else if(isIpadLandscape){
            tag.className = 'shot-dim-tag info';
            tag.textContent = (w === 2732 && h === 2048) || (w === 2752 && h === 2064)
              ? `iPad 13" Landscape (${w}×${h})`
              : `iPad Landscape (${w}×${h})`;
          } else {
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Non-iPad (${w}×${h})`;
          }
        }

        if(isSquare){
          squareIndices.push(idx + 1);
        } else if(isPhonePortrait){
          phoneRatioIndices.push(idx + 1);
        } else if(!isIpadPortrait && !isIpadLandscape){
          nonIpadIndices.push(idx + 1);
        }
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

    img.src = ensureSvgDimensions(s);
  });

  function finalizeIpadBadge(){
    const hasIssues = squareIndices.length > 0 || phoneRatioIndices.length > 0 || nonIpadIndices.length > 0;
    const fixAllBtn = `<button class="mini fit-btn" id="btnFixAllIpad" style="margin-left:auto;white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:7px">${ICO_SPARKLE}Resize All (2048px)</button>`;
    const dlAllBtn = `<button class="mini dl-btn" id="btnDlAllIpad" style="margin-left:auto;white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:7px">${ICO_ZIP}Export All (ZIP)</button>`;

    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Screenshot ${items} is square (1:1). Apple Connect requires <strong>iPad Pro 13" resolutions (2048×2732 px, 4:3)</strong>.</span>${fixAllBtn}`;
    } else if(phoneRatioIndices.length > 0){
      const items = phoneRatioIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Screenshot ${items} has a phone aspect ratio (9:19.5 or 9:16). Apple Connect will reject phone screenshots for iPad Pro. Required: <strong>2048×2732 px (4:3)</strong>.</span>${fixAllBtn}`;
    } else if(nonIpadIndices.length > 0){
      const items = nonIpadIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Aspect Ratio Notice:</strong> Screenshot ${items} has non-standard iPad ratio. Apple recommends <strong>2048×2732 px (3:4 portrait)</strong> or <strong>2732×2048 px (4:3 landscape)</strong>.</span>${fixAllBtn}`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>iPad &amp; Universal Compliant:</strong> ${validCount} dedicated iPad screenshot${validCount === 1 ? '' : 's'} (Range: 1–10) · All 4:3 iPad Pro aspect ratios.</span>${dlAllBtn}`;
    }

    if($('btnFixAllIpad')){
      $('btnFixAllIpad').onclick = () => fixAllIpadScreenshots();
    }
    if($('btnDlAllIpad')){
      $('btnDlAllIpad').onclick = () => downloadAllIpadScreenshots();
    }
  }
}

/**
 * Smart fits any image into standard Apple iPad Pro 13" dimensions
 * (Portrait 2048×2732 px, or Landscape 2732×2048 px).
 * 
 * Supports two clean modes:
 * - 'cover' (Default / Full Bleed): Scales image to completely cover the iPad canvas (2048×2732),
 *   centered with zero black bars, zero blur, and no artificial borders. Best for photos, wallpapers, games.
 * - 'contain' (Fit / Soft Blur): Expands image edge-to-edge without cropping any part, with vibrant
 *   frosted blur extension in matching brightness (no dark black overlay or artificial frame).
 */
function fitToIpadProCanvas(img, mode){
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  if (!origW || !origH) return null;

  const isWide = origW > origH * 1.15;
  const targetW = isWide ? 2732 : 2048;
  const targetH = isWide ? 2048 : 2732;

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const origRatio = origW / origH;
  const targetRatio = targetW / targetH;

  // Case 1: If aspect ratio is already close to 4:3 / 3:4 (within 12% diff)
  if (Math.abs(origRatio - targetRatio) < 0.12) {
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return canvas;
  }

  // Determine fit mode (can be passed or read from UI selector #f-ipad-fit-mode)
  const fitMode = mode || ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover'));

  if (fitMode === 'cover') {
    // Mode Cover: Scale to cover entire 2048x2732 canvas, centered crop, clean full bleed
    const scale = Math.max(targetW / origW, targetH / origH);
    const w = origW * scale;
    const h = origH * scale;
    const x = (targetW - w) / 2;
    const y = (targetH - h) / 2;
    ctx.drawImage(img, x, y, w, h);
    return canvas;
  }

  // Mode Contain: Fit edge-to-edge with vibrant frosted blurred backdrop
  // Step 1: Draw vibrant blurred background with matching brightness
  const bgScale = Math.max(targetW / origW, targetH / origH);
  const bgW = origW * bgScale;
  const bgH = origH * bgScale;
  const bgX = (targetW - bgW) / 2;
  const bgY = (targetH - bgH) / 2;

  ctx.save();
  if ('filter' in ctx) {
    try {
      ctx.filter = 'blur(45px) brightness(0.95)';
      ctx.drawImage(img, bgX - 30, bgY - 30, bgW + 60, bgH + 60);
      ctx.filter = 'none';
    } catch (e) {
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
    }
  } else {
    ctx.drawImage(img, bgX, bgY, bgW, bgH);
  }
  ctx.restore();

  // Subtle soft contrast overlay (very light, preserves vibrant colors)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, targetW, targetH);

  // Step 2: Draw foreground edge-to-edge (no 88% shrink)
  const fgScale = Math.min(targetW / origW, targetH / origH);
  const fgW = Math.round(origW * fgScale);
  const fgH = Math.round(origH * fgScale);
  const fgX = Math.round((targetW - fgW) / 2);
  const fgY = Math.round((targetH - fgH) / 2);

  // For phone screenshots (tall & narrow, ratio < 0.65), add soft shadow so it stands out against backdrop
  if (origRatio < 0.65) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#000000';
    ctx.fillRect(fgX, fgY, fgW, fgH);
    ctx.restore();
  }

  ctx.drawImage(img, fgX, fgY, fgW, fgH);
  return canvas;
}

function fitIpadScreenshotAsync(src, mode){
  return new Promise((resolve, reject) => {
    if(!src || !src.trim()){
      reject(new Error('Empty screenshot source'));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = fitToIpadProCanvas(img, mode);
        if(canvas){
          const fullPng = canvas.toDataURL('image/png');
          try {
            const maxDim = 600;
            const tw = canvas.width >= canvas.height ? maxDim : Math.round((canvas.width * maxDim) / canvas.height);
            const th = canvas.width >= canvas.height ? Math.round((canvas.height * maxDim) / canvas.width) : maxDim;
            const tc = document.createElement('canvas');
            tc.width = tw;
            tc.height = th;
            const tctx = tc.getContext('2d');
            if(tctx){
              tctx.imageSmoothingEnabled = true;
              tctx.imageSmoothingQuality = 'high';
              tctx.drawImage(canvas, 0, 0, tw, th);
              let thumb = tc.toDataURL('image/webp', 0.85);
              if(!thumb.startsWith('data:image/webp')){
                thumb = tc.toDataURL('image/jpeg', 0.85);
              }
              if(typeof THUMB_CACHE !== 'undefined'){
                THUMB_CACHE.set(fullPng, thumb);
              }
            }
          } catch(e){}
          resolve(fullPng);
        } else {
          reject(new Error('Canvas creation failed'));
        }
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = ensureSvgDimensions(src);
  });
}

function fixIpadScreenshot(index){
  if(typeof canAction === 'function' && !canAction(1000)) return;
  const src = IPAD_SHOTS[index];
  if(!src || !src.trim()){
    showToast('No screenshot to resize', 'warn');
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const isAlreadyCompliant = (
      (w === 2048 && h === 2732) || 
      (w === 2064 && h === 2752) || 
      (w === 2732 && h === 2048) || 
      (w === 2752 && h === 2064)
    );
    if(isAlreadyCompliant){
      showToast(`Screenshot #${index + 1} is already standard iPad Pro 13" (${w}×${h} px)!`, '✓', 3000);
      return;
    }

    const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
    const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
    showToast(`Resizing iPad screenshot (${modeLabel})...`, '⏳');
    fitIpadScreenshotAsync(src, mode).then(dataUrl => {
      IPAD_SHOTS[index] = dataUrl;
      renderIpadShots();
      saveState();
      showToast(`Screenshot resized to 2048×2732 px (${modeLabel})! ✨`, '✨');
    }).catch(err => {
      console.error('Resize error:', err);
      showToast('Could not resize screenshot', 'warn');
    });
  };
  img.onerror = () => showToast('Failed to load image for resizing', 'warn');
  img.src = ensureSvgDimensions(src);
}

function fixAllIpadScreenshots(){
  if(typeof canAction === 'function' && !canAction(1000)) return;
  const validIndices = [];
  IPAD_SHOTS.forEach((s, idx) => {
    if(s && s.trim()) validIndices.push(idx);
  });
  if(validIndices.length === 0){
    showToast('No iPad screenshots to resize', 'ℹ️');
    return;
  }

  const checkPromises = validIndices.map(idx => {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const isCompliant = (
          (w === 2048 && h === 2732) || 
          (w === 2064 && h === 2752) || 
          (w === 2732 && h === 2048) || 
          (w === 2752 && h === 2064)
        );
        resolve({ idx, needsResize: !isCompliant });
      };
      img.onerror = () => resolve({ idx, needsResize: false });
      img.src = ensureSvgDimensions(IPAD_SHOTS[idx]);
    });
  });

  Promise.all(checkPromises).then(checks => {
    const needResizeIndices = checks.filter(c => c.needsResize).map(c => c.idx);
    if(needResizeIndices.length === 0){
      showToast('All screenshots are already compliant with iPad Pro 13" standard!', '✓', 3000);
      return;
    }

    const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
    const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
    showToast(`Resizing ${needResizeIndices.length} iPad screenshot${needResizeIndices.length === 1 ? '' : 's'} (${modeLabel})...`, '⏳');
    Promise.all(needResizeIndices.map(idx => fitIpadScreenshotAsync(IPAD_SHOTS[idx], mode))).then(results => {
      needResizeIndices.forEach((shotIdx, resIdx) => {
        IPAD_SHOTS[shotIdx] = results[resIdx];
      });
      renderIpadShots();
      saveState();
      showToast(`All ${needResizeIndices.length} iPad screenshot${needResizeIndices.length === 1 ? '' : 's'} resized (${modeLabel})! ✨`, '✨');
    }).catch(err => {
      console.error('Fix all error:', err);
      showToast('Some screenshots could not be resized', 'warn');
    });
  });
}

function generateIpadFromPhone(){
  if(typeof canAction === 'function' && !canAction(1000)) return;
  const validPhoneShots = (SHOTS || []).filter(s => typeof s === 'string' && s.trim());
  if(validPhoneShots.length === 0){
    showToast('Please add phone screenshots first!', 'ℹ️');
    return;
  }
  const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
  const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
  showToast(`Generating ${validPhoneShots.length} iPad Pro screenshot${validPhoneShots.length === 1 ? '' : 's'} (${modeLabel})...`, '⏳');
  Promise.all(validPhoneShots.map(s => fitIpadScreenshotAsync(s, mode))).then(results => {
    IPAD_SHOTS = results;
    if(!SUPPORTS_IPAD){
      setSupportsIpad(true);
    }
    renderIpadShots();
    saveState();
    showToast(`Generated ${results.length} iPad Pro 13" screenshot${results.length === 1 ? '' : 's'} (${modeLabel})! ✨`, '📱');
  }).catch(err => {
    console.error('Generate from phone error:', err);
    showToast('Failed to generate iPad screenshots', 'warn');
  });
}

function downloadIpadScreenshot(index){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const src = IPAD_SHOTS[index];
  if(!src || !src.trim()){
    showToast('No screenshot to download', 'warn');
    return;
  }
  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';
  const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = fitToIpadProCanvas(img, mode);
    if(!canvas){
      showToast('Error preparing screenshot download', 'warn');
      return;
    }
    canvas.toBlob(blob => {
      if(!blob){
        showToast('Error generating image file', 'warn');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-ipad-shot-${index + 1}-${canvas.width}x${canvas.height}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Downloaded iPad Screenshot #${index + 1} (${canvas.width}×${canvas.height})!`, '⬇️');
    }, 'image/png');
  };
  img.onerror = () => showToast('Failed to load image for download', 'warn');
  img.src = ensureSvgDimensions(src);
}

function downloadAllIpadScreenshots(){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const validEntries = [];
  IPAD_SHOTS.forEach((s, idx) => {
    if(s && s.trim()) validEntries.push({ src: s, index: idx });
  });

  if(validEntries.length === 0){
    showToast('No iPad screenshots to export', 'ℹ️');
    return;
  }

  _isZipExporting = true;
  if(typeof _lastDownloadTime !== 'undefined') _lastDownloadTime = Date.now();

  const dlBtn = $('btnDlAllIpad');
  const optBtn = $('optExportIpadShots');
  let origDlHtml = '';
  if(dlBtn){
    origDlHtml = dlBtn.innerHTML;
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    dlBtn.innerHTML = '<span class="btn-spinner"></span> Packaging...';
  }
  if(optBtn) optBtn.classList.add('loading');

  showToast(`Packaging ${validEntries.length} iPad screenshot${validEntries.length === 1 ? '' : 's'} into ZIP (please wait)...`, '⏳', 2200);

  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';
  const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';

  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

  const packPromise = Promise.all(validEntries.map((entry, order) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = fitToIpadProCanvas(img, mode);
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const bytes = dataUrlToUint8Array(dataUrl);
            const fileName = `${name}-ipad-shot-${order + 1}-${canvas.width}x${canvas.height}.png`;
            resolve({ name: fileName, data: bytes });
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(entry.src);
    });
  }));

  Promise.all([packPromise, minDelay]).then(([results]) => {
    const files = results.filter(f => f && f.data);
    if(files.length === 0){
      showToast('Error preparing screenshots for ZIP', 'warn');
      return;
    }

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-ipad-screenshots-2048x2732.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Downloaded ${files.length} iPad screenshots in 1 ZIP package! ✨`, '⬇️');
  }).catch(err => {
    console.error('ZIP export error:', err);
    showToast('Failed to generate ZIP archive', 'warn');
  }).finally(() => {
    if(dlBtn){
      dlBtn.classList.remove('loading');
      dlBtn.disabled = false;
      dlBtn.innerHTML = origDlHtml || `${ICO_ZIP}Export All (ZIP)`;
    }
    if(optBtn) optBtn.classList.remove('loading');
    _isZipExporting = false;
  });
}

function downloadAllPhoneScreenshots(){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const validEntries = [];
  SHOTS.forEach((s, idx) => {
    if(s && s.trim()) validEntries.push({ src: s, index: idx });
  });

  if(validEntries.length === 0){
    showToast('No phone screenshots to export', 'ℹ️');
    return;
  }

  _isZipExporting = true;
  if(typeof _lastDownloadTime !== 'undefined') _lastDownloadTime = Date.now();

  const dlBtn = $('btnDlAllPhone');
  const optBtn = $('optExportPhoneShots');
  let origDlHtml = '';
  if(dlBtn){
    origDlHtml = dlBtn.innerHTML;
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    dlBtn.innerHTML = '<span class="btn-spinner"></span> Packaging...';
  }
  if(optBtn) optBtn.classList.add('loading');

  showToast(`Packaging ${validEntries.length} phone screenshot${validEntries.length === 1 ? '' : 's'} into ZIP (please wait)...`, '⏳', 2200);

  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';

  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

  const packPromise = Promise.all(validEntries.map((entry, order) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 1290;
          canvas.height = img.naturalHeight || 2796;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          const fileName = `${name}-phone-shot-${order + 1}-${canvas.width}x${canvas.height}.png`;
          resolve({ name: fileName, data: bytes });
        } catch(e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(entry.src);
    });
  }));

  Promise.all([packPromise, minDelay]).then(([results]) => {
    const files = results.filter(f => f && f.data);
    if(files.length === 0){
      showToast('Error preparing screenshots for ZIP', 'warn');
      return;
    }

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-phone-screenshots.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Downloaded ${files.length} phone screenshots in 1 ZIP package! ✨`, '⬇️');
  }).catch(err => {
    console.error('Phone ZIP export error:', err);
    showToast('Failed to generate ZIP archive', 'warn');
  }).finally(() => {
    if(dlBtn){
      dlBtn.classList.remove('loading');
      dlBtn.disabled = false;
      dlBtn.innerHTML = origDlHtml || `${ICO_ZIP}Export (ZIP)`;
    }
    if(optBtn) optBtn.classList.remove('loading');
    _isZipExporting = false;
  });
}

// Event Listeners for iPad Destination & Screenshots
let ipadPick = -1;

const fDestIpad = $('f-dest-ipad');
if(fDestIpad){
  fDestIpad.onchange = (e) => {
    setSupportsIpad(e.target.checked);
    saveState();
    showToast(SUPPORTS_IPAD ? 'Universal App enabled! iPad screenshots unlocked.' : 'Switched to iPhone-only mode.', '📱');
  };
}

const fIpadFitMode = $('f-ipad-fit-mode');
if(fIpadFitMode){
  if(typeof IPAD_FIT_MODE !== 'undefined') fIpadFitMode.value = IPAD_FIT_MODE;
  fIpadFitMode.onchange = (e) => {
    IPAD_FIT_MODE = e.target.value;
    saveState();
    showToast('Fit mode: ' + (IPAD_FIT_MODE === 'cover' ? 'Fill / Cover (Full Bleed)' : 'Fit / Contain (Soft Blur)'), '🎨');
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

const btnGenIpad = $('btnGenIpadFromPhone');
if(btnGenIpad){
  btnGenIpad.onclick = () => generateIpadFromPhone();
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
      showToast('iPad screenshot uploaded!', '📸');
    });
    e.target.value = '';
  };
}


