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
  $$('[data-shots=gp-search]').forEach(c => {
    c.innerHTML = '';
    const valid = SHOTS.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      for(let i = 0; i < 3; i++){
        const sk = document.createElement('div');
        sk.className = 'gp-skel-shot';
        c.appendChild(sk);
      }
    } else {
      valid.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
    }
  });

  // Validate screenshots count & aspect ratios
  validateScreenshots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(typeof renderTablets === 'function') renderTablets();

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

    const hasImg = !!(s && typeof s === 'string' && s.trim() && (typeof PH === 'undefined' || s !== PH) && (typeof PH_LIGHT === 'undefined' || s !== PH_LIGHT));

    // Thumbnail Preview with Click-to-Inspect & Floating Delete Button
    const thumbWrap = document.createElement('div');

    if (hasImg) {
      thumbWrap.className = 'shot-thumb-wrap has';
      const thumb = mk(s, 'Screenshot ' + (i + 1));
      thumb.style.cursor = 'pointer';
      thumb.title = 'Click to inspect & view details';
      thumb.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
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
      thumbWrap.appendChild(thumb);
    } else {
      thumbWrap.className = 'shot-thumb-wrap is-placeholder';
      thumbWrap.title = 'Click to upload screenshot';
      thumbWrap.setAttribute('role', 'button');
      thumbWrap.setAttribute('tabindex', '0');
      const ov = document.createElement('div');
      ov.className = 'shot-thumb-ov';
      ov.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
      thumbWrap.appendChild(ov);
      thumbWrap.onclick = () => {
        if(typeof canUpload === 'function' && !canUpload(1000)) return;
        pick = i;
        const fi = $('shotFile');
        if(fi) fi.click();
      };
      thumbWrap.onkeydown = e => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          thumbWrap.click();
        }
      };
    }

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'shot-remove-btn';
    delBtn.title = 'Delete Screenshot';
    delBtn.setAttribute('aria-label', 'Delete Screenshot');
    delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    delBtn.onmousedown = e => e.stopPropagation();
    delBtn.onclick = e => {
      e.stopPropagation();
      SHOTS.splice(i, 1);
      if(typeof isDemoMode === 'function' && isDemoMode()){
        const remainingCount = SHOTS.filter(s => s && typeof s === 'string' && s.trim()).length;
        window._demoScreenshotUploadCount = Math.min(window._demoScreenshotUploadCount || 0, remainingCount);
      }
      renderShots();
      saveState();
    };
    thumbWrap.appendChild(delBtn);
    r.appendChild(thumbWrap);

    // Row Title, Role Tag & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    const isAppPreview = store === 'apple' && i < 3;
    const previewBadgeHtml = isAppPreview ? '<span class="shot-preview-pill" title="Ảnh sẽ xuất hiện trên App Store search/product page">App Preview</span>' : '';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>${previewBadgeHtml}`;

    const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
    metaLine.innerHTML = `<span class="shot-dim-tag" id="shotDimTag_${i}" style="display:none"></span>`;

    col.append(head, metaLine);
    r.appendChild(col);

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML =
      '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
      '<button type="button" class="mini shot-inspect-btn' + (hasImg ? '' : ' disabled') + '" title="' + (hasImg ? 'Inspect screenshot details' : 'Upload a screenshot to inspect details') + '" aria-label="Inspect screenshot details"' + (hasImg ? '' : ' disabled aria-disabled="true"') + '>' + ICO_INSPECT + '</button>';
    const upBtn = act.children[0];
    const inspectBtn = act.children[1];
    if(!hasImg){
      inspectBtn.classList.add('disabled');
    }
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    if(hasImg){
      inspectBtn.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: s,
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
    } else {
      inspectBtn.onclick = null;
    }
    r.appendChild(act);

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

let _phoneValRunId = 0;
function validateScreenshots(){
  const runId = ++_phoneValRunId;
  const validShots = SHOTS.filter(s => s && s.trim());
  const validCount = validShots.length;
  const maxAllowed = store === 'apple' ? 10 : 8;
  const minRequired = store === 'apple' ? 1 : 2;

  const counterEl = $('shotCounter');
  const previewCounterEl = $('appPreviewCounter');
  const addBtn = $('addShot');
  if(addBtn){
    const atLimit = (typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed;
    addBtn.disabled = atLimit;
    if(atLimit){
      addBtn.title = `${store === 'apple' ? 'App Store' : 'Google Play'} allows a maximum of ${maxAllowed} screenshots`;
    } else {
      addBtn.removeAttribute('title');
    }
  }
  if(store === 'apple'){
    const appPreviewCount = Math.min(validCount, 3);
    if(previewCounterEl){
      previewCounterEl.style.display = 'inline-flex';
      previewCounterEl.textContent = `${appPreviewCount} of 3 App Previews`;
      previewCounterEl.title = 'Ảnh sẽ xuất hiện trên app store';
    }
    if(counterEl){
      counterEl.textContent = `${validCount} of ${maxAllowed} App Screenshots`;
      counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    }
  } else {
    if(previewCounterEl){
      previewCounterEl.style.display = 'none';
    }
    if(counterEl){
      counterEl.textContent = `${validCount} of ${maxAllowed} screenshots`;
      counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    }
  }

  const hintEl = $('shotHint');
  if(hintEl){
    if(store === 'apple'){
      hintEl.innerHTML = 'Drag and drop to add assets or choose from your Asset Library for iPhone 6.1" or 6.3" displays. Supported sizes for app previews include 1920 × 886px and 886 × 1920px. For app screenshots, supported sizes include 2556 × 1179px, 1179 × 2556px, 2622 × 1206px and 1206 × 2622px.<br>• PNG or JPEG, no alpha transparency.<br>• Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots (16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px).<br>• PNG or JPEG, up to 8 MB each.<br>• Drag ⠿ handle to reorder.';
    }
  }

  const badgeEl = $('shotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount === 0){
    badgeEl.style.display = 'none';
    badgeEl.innerHTML = '';
    return;
  }

  if(validCount < minRequired){
    badgeEl.className = 'shot-status-badge warn';
    badgeEl.innerHTML = `${SB_WARN}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Notice:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'}. Stores require at least <strong>${minRequired} screenshot${minRequired === 1 ? '' : 's'}</strong>.</span>`;
    badgeEl.style.display = 'flex';
    return;
  }
  if(validCount > maxAllowed){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Rejection Risk:</strong> ${validCount} screenshots. ${store === 'apple' ? 'Apple' : 'Google Play'} allows a maximum of <strong>${maxAllowed} screenshots</strong>.</span>`;
    badgeEl.style.display = 'flex';
    return;
  }

  let checked = 0;
  const squareIndices = [];
  const extremeRatioIndices = [];   // e.g. banner 730×172 — ratio > 2.5:1
  const landscapeOkIndices = [];    // standard Apple/Google landscape → ok (green)
  const landscapeWarnIndices = [];  // non-standard landscape (unusual ratio) → warn
  const portraitIndices = [];       // normal portrait shots
  const nonPhoneIndices = [];
  const sizeIssueIndices = [];
  const overSizeIndices = [];

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

      let shotSize = 0;
      if (typeof s === 'string' && s.startsWith('data:')) {
        const comma = s.indexOf(',');
        if (comma !== -1) {
          const b64 = s.slice(comma + 1);
          const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
          shotSize = Math.round((b64.length * 3) / 4 - pad);
        }
      }
      const isOverSize = shotSize > 8 * 1024 * 1024;

      if(w > 0 && h > 0){
        const isSquare = (Math.abs(w - h) / Math.max(w, h)) < 0.12;
        const isLandscape = w > h * 1.15;
        const isPhonePortrait = h >= w * 1.35;
        const isGoogleSizeIssue = store === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

        // Standard Apple landscape resolutions (portrait dimensions swapped)
        const isStandardAppleLandscape = store === 'apple' && (
          (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
          (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
          (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
          (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
          (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
          (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
          (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
        );
        // Standard Google landscape: phone aspect ratio within range (1.5:1 to 2.2:1)
        const isStandardGoogleLandscape = store === 'google' && isLandscape &&
          !isSquare && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
        // Extreme non-phone ratio (e.g. banner 730×172 → 4.24:1) — always err
        const isExtremeRatio = isLandscape && (w / h > 2.5);
        // Landscape below phone AR range (e.g. 800×600 = 1.33:1 = tablet) — err
        const isNonPhoneLandscape = isLandscape && !isExtremeRatio && (w / h < 1.5) && !isStandardAppleLandscape;

        if(tag){
          tag.style.display = 'inline-flex';
          // 1. SAI RATIO LÀ ERROR (RED)
          if(isSquare){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `1:1 Square (${w}×${h})`;
          } else if(isLandscape && (isExtremeRatio || isNonPhoneLandscape)){
            // e.g. 730×172 banner — aspect ratio is not a phone screen at all
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Invalid Ratio (${w}×${h})`;
          } else if(isLandscape && (isStandardAppleLandscape || isStandardGoogleLandscape)){
            // Official landscape dimensions from App Store Connect / Google Play → ok
            tag.className = 'shot-dim-tag ok';
            tag.textContent = `Landscape (${w}×${h})`;
          } else if(isLandscape){
            // Landscape but not an extreme ratio and not a known standard → warn (unusual)
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Landscape (${w}×${h})`;
          } else if(!isPhonePortrait){
            tag.className = 'shot-dim-tag err';
            tag.textContent = `Non-portrait (${w}×${h})`;
          }
          // 2. ĐÚNG RATIO MÀ SAI FILESIZE HOẶC SAI KÍCH THƯỚC MỚI WARNING (AMBER)
          else if(isOverSize){
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `>8 MB (${(shotSize/(1024*1024)).toFixed(1)} MB)`;
          } else if(isGoogleSizeIssue){
            tag.className = 'shot-dim-tag warn';
            tag.textContent = `Out of Range (${w}×${h})`;
          } else {
            const isStandardApple = store === 'apple' && (
              // Dynamic Island (large display)
              (w === 1320 && h === 2868) || // iPhone 6.9"
              (w === 1290 && h === 2796) || // iPhone 6.7"
              (w === 1260 && h === 2736) || // iPhone Air / 6.7"
              // Dynamic Island (medium display)
              (w === 1206 && h === 2622) || // iPhone 6.3"
              (w === 1179 && h === 2556) || // iPhone 6.1"
              // Face ID (large display)
              (w === 1284 && h === 2778) || // iPhone 6.5"
              (w === 1242 && h === 2688) || // iPhone 6.5"
              // Face ID (medium display)
              (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
              (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
              (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
              // Home Button (large display)
              (w === 1242 && h === 2208) || // iPhone 5.5"
              // Home Button (medium display)
              (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
              // iPhone Duo
              (w === 1398 && h === 2034) ||
              (w === 2007 && h === 2853) ||
              // Legacy 4" / 3.5"
              (w === 640 && h === 1136) ||
              (w === 640 && h === 1096) ||
              (w === 640 && h === 960) ||
              (w === 640 && h === 920)
            );
            const isStandardGoogle = store === 'google' && (
              (w === 1080 && h === 1920) ||
              (w === 1080 && h === 2340) ||
              (w === 1080 && h === 2400) ||
              (w === 1080 && h === 2160) ||
              (w === 1080 && h === 2280) ||
              (w === 1440 && h === 2560) ||
              (w === 1440 && h === 3120) ||
              (w === 1440 && h === 3200) ||
              (w === 1440 && h === 2880) ||
              (w === 1440 && h === 2960) ||
              (w === 1440 && h === 3088) ||
              (w === 720 && h === 1280) ||
              (w === 720 && h === 1560) ||
              (w === 720 && h === 1600) ||
              (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
            );
            if((store === 'apple' && isStandardApple) || (store === 'google' && isStandardGoogle)){
              tag.className = 'shot-dim-tag ok';
              tag.textContent = `Portrait (${w}×${h})`;
            } else {
              tag.className = 'shot-dim-tag warn';
              tag.textContent = `Scaled (${w}×${h})`;
            }
          }
        }

        // Collect indices for badge banner
        if(isSquare){
          squareIndices.push(idx + 1);
        } else if(isLandscape && isExtremeRatio){
          extremeRatioIndices.push(idx + 1);
        } else if(isLandscape && (isStandardAppleLandscape || isStandardGoogleLandscape)){
          landscapeOkIndices.push(idx + 1);
        } else if(isLandscape && !(isExtremeRatio || isNonPhoneLandscape)){
          landscapeWarnIndices.push(idx + 1);
        } else if(!isPhonePortrait){
          nonPhoneIndices.push(idx + 1);
        } else {
          portraitIndices.push(idx + 1);
          // Đúng ratio portrait: kiểm tra fileSize & kích thước
          if(isOverSize){
            overSizeIndices.push(idx + 1);
          }
          if(isGoogleSizeIssue){
            sizeIssueIndices.push(idx + 1);
          }
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
    // 1. SAI RATIO LÀ ERROR (RED)
    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      const noun = squareIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = squareIndices.length > 1 ? 'are' : 'is';
      badgeEl.className = 'shot-status-badge err';
      if(store === 'apple'){
        badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${noun} ${items} ${verb} square (1:1). Apple requires standard phone dimensions (such as 1179×2556 px or 1206×2622 px).</span>`;
      } else {
        badgeEl.innerHTML = `${SB_ERR}<span><strong>Aspect Ratio Error:</strong> ${noun} ${items} ${verb} square (1:1). Google Play requires standard dimensions (such as 1080×1920 px).</span>`;
      }
      badgeEl.style.display = 'flex';
    } else if(extremeRatioIndices.length > 0){
      // e.g. 730×172 banner — aspect ratio is not a phone screen at all
      const items = extremeRatioIndices.map(n => `#${n}`).join(', ');
      const noun = extremeRatioIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = extremeRatioIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Invalid Aspect Ratio:</strong> ${noun} ${items} ${verb} an unsupported banner-like ratio. Phone screenshots must have a phone screen aspect ratio (e.g. 9:16 or 9:19.5). Re-export at a supported dimension such as 1179×2556 px.</span>`;
      badgeEl.style.display = 'flex';
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Aspect Ratio Error:</strong> Screenshot ${items} has non-portrait ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 2. MIXED ORIENTATION WARNING (AMBER) — portrait + landscape mixed in same set
    else if(landscapeOkIndices.length > 0 && portraitIndices.length > 0){
      const lItems = landscapeOkIndices.map(n => `#${n}`).join(', ');
      const pItems = portraitIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Mixed Orientation:</strong> Landscape ${lItems} and portrait ${pItems} in the same set. ${store === 'apple' ? 'Apple may reject for inconsistent presentation (Guideline 2.3).' : 'Google Play recommends consistent orientation.'} Use all-portrait or all-landscape per device size.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 3. ALL LANDSCAPE OK — standard Apple/Google landscape only
    else if(landscapeOkIndices.length > 0 && portraitIndices.length === 0){
      // All-landscape set, all standard — green (no banner needed)
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
    // 4. UNUSUAL LANDSCAPE WARNING (non-standard ratio but not extreme)
    else if(landscapeWarnIndices.length > 0){
      const items = landscapeWarnIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Non-standard Landscape:</strong> Screenshot ${items} is landscape with an unusual aspect ratio. Verify this matches a supported store dimension before submission.</span>`;
      badgeEl.style.display = 'flex';
    }
    // 5. ĐÚNG RATIO MÀ SAI FILESIZE HOẶC SAI KÍCH THƯỚC MỚI WARNING (AMBER)
    else if(overSizeIndices.length > 0){
      const items = overSizeIndices.map(n => `#${n}`).join(', ');
      const noun = overSizeIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = overSizeIndices.length > 1 ? 'exceed' : 'exceeds';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>File Size Warning:</strong> ${noun} ${items} ${verb} 8 MB maximum limit. Consider optimizing to reduce load times.</span>`;
      badgeEl.style.display = 'flex';
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Warning:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>`;
      badgeEl.style.display = 'flex';
    } else {
      // Compliant: All criteria met -> hide badge, do not show green message box
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
  }
}

if($('shotFile')){
  $('shotFile').onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
    const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
    if(pick < 0 && (typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed){
      showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
      e.target.value = '';
      return;
    }
    if(typeof isDemoMode === 'function' && isDemoMode()){
      const currentValid = SHOTS.filter(s => s && typeof s === 'string' && s.trim()).length;
      if(pick < 0 && (SHOTS.length >= 2 || currentValid >= 2)){
        if(typeof requireFullVersion === 'function') requireFullVersion('upload-shots');
        e.target.value = '';
        return;
      }
      window._demoScreenshotUploadCount = Math.max(0, currentValid) + 1;
    }
    if(typeof validateUploadFile === 'function' && !validateUploadFile(f, MAX_UPLOAD_BYTES, 'Phone screenshot')){
      e.target.value = '';
      return;
    }
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
    const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
    if((typeof SHOTS !== 'undefined' ? SHOTS.length : 0) >= maxAllowed){
      showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
      return;
    }
    if(typeof isDemoMode === 'function' && isDemoMode()){
      const currentValid = SHOTS.filter(s => s && typeof s === 'string' && s.trim()).length;
      if(SHOTS.length >= 2 || currentValid >= 2){
        if(typeof requireFullVersion === 'function') {
          const isImportedLargeGallery = SHOTS.length > 2 || currentValid > 2;
          requireFullVersion('upload-shots', {
            toast: isImportedLargeGallery ? {
              title: 'Screenshot Limit Reached',
              desc: 'Demo mode previews imported apps. Upgrade to Full Studio to add or upload up to 10 screenshots.'
            } : undefined
          });
        }
        return;
      }
    }
    SHOTS.push('');
    renderShots();
    saveState();
    const ins = $$('.srow input');
    if(ins.length) ins[ins.length - 1].focus();
  };
}

// Interactive Toggle for Google Play Search Result Screenshots Expand/Collapse
document.addEventListener('click', e => {
  const btn = e.target.closest('.gp-search-action-btn');
  if (btn) {
    const card = btn.closest('.gp-search-card');
    if (card) {
      card.classList.toggle('is-expanded');
    }
  }
});
