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
      '<button class="mini" data-m="-1" title="Move Up">&uarr;</button>' +
      '<button class="mini" data-m="1" title="Move Down">&darr;</button>' +
      '<button class="mini fit-btn" id="btnFitIpad_' + i + '" title="Resize / Fit to Apple iPad Pro 13&quot; (2048×2732 px)">' + ICO_SPARKLE + 'Fit</button>' +
      '<button class="mini del" title="Delete">&times;</button>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };
    b[1].onclick = () => mvIpad(i, -1);
    b[2].onclick = () => mvIpad(i, 1);
    b[3].onclick = () => fixIpadScreenshot(i);
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
    const actionBtns = nonCompliantIndices.length > 0 ?
      `<div class="sb-actions" style="margin-left:auto;display:inline-flex;gap:6px;align-items:center;"><button type="button" class="mini fit-btn" id="btnFixAllIpad" style="white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:6px" title="Auto-resize all non-standard screenshots to iPad Pro 13&quot; 2048×2732 px">${ICO_SPARKLE}Resize All (2048px)</button></div>` : '';

    if(nonCompliantIndices.length > 0){
      const items = nonCompliantIndices.map(n => `#${n}`).join(', ');
      const noun = nonCompliantIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> ${noun} ${items} not exact iPad Pro 13" (2048×2732 px). Click <strong>Resize All</strong> to convert.</span>${actionBtns}`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>Xcode &amp; App Store Ready:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'} matching iPad Pro 13" standard (2048×2732 px).</span>${actionBtns}`;
    }

    if($('btnFixAllIpad')){
      $('btnFixAllIpad').onclick = () => fixAllIpadScreenshots();
    }
  }
}

/**
 * Smart fits any image into standard Apple iPad Pro 13" dimensions
 * (Portrait 2048×2732 px, or Landscape 2732×2048 px).
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

  // Subtle soft contrast overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, targetW, targetH);

  // Draw foreground edge-to-edge
  const fgScale = Math.min(targetW / origW, targetH / origH);
  const fgW = Math.round(origW * fgScale);
  const fgH = Math.round(origH * fgScale);
  const fgX = Math.round((targetW - fgW) / 2);
  const fgY = Math.round((targetH - fgH) / 2);

  // For phone screenshots, add soft shadow so it stands out against backdrop
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
      showToast(`Screenshot #${index + 1} is already standard iPad Pro 13" (${w}×${h} px)!`, 'ok', 3000);
      return;
    }

    const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
    const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
    showToast(`Resizing iPad screenshot (${modeLabel})...`, 'info');
    fitIpadScreenshotAsync(src, mode).then(dataUrl => {
      IPAD_SHOTS[index] = dataUrl;
      renderIpadShots();
      saveState();
      showToast(`Screenshot resized to 2048×2732 px (${modeLabel})!`, 'ok');
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
    showToast('No iPad screenshots to resize', 'warn');
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
      showToast('All screenshots are already compliant with iPad Pro 13" standard!', 'ok', 3000);
      return;
    }

    const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
    const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
    showToast(`Resizing ${needResizeIndices.length} iPad screenshot${needResizeIndices.length === 1 ? '' : 's'} (${modeLabel})...`, 'info');
    Promise.all(needResizeIndices.map(idx => fitIpadScreenshotAsync(IPAD_SHOTS[idx], mode))).then(results => {
      needResizeIndices.forEach((shotIdx, resIdx) => {
        IPAD_SHOTS[shotIdx] = results[resIdx];
      });
      renderIpadShots();
      saveState();
      showToast(`All ${needResizeIndices.length} iPad screenshot${needResizeIndices.length === 1 ? '' : 's'} resized (${modeLabel})!`, 'ok');
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
    showToast('Please add phone screenshots first!', 'warn');
    return;
  }
  const mode = ($('f-ipad-fit-mode') ? $('f-ipad-fit-mode').value : (typeof IPAD_FIT_MODE !== 'undefined' ? IPAD_FIT_MODE : 'cover')) || 'cover';
  const modeLabel = mode === 'cover' ? 'Fill / Cover' : 'Fit / Contain';
  showToast(`Generating ${validPhoneShots.length} iPad Pro screenshot${validPhoneShots.length === 1 ? '' : 's'} (${modeLabel})...`, 'info');
  Promise.all(validPhoneShots.map(s => fitIpadScreenshotAsync(s, mode))).then(results => {
    IPAD_SHOTS = results;
    if(!SUPPORTS_IPAD){
      setSupportsIpad(true);
    }
    renderIpadShots();
    saveState();
    showToast(`Generated ${results.length} iPad Pro 13" screenshot${results.length === 1 ? '' : 's'} (${modeLabel})!`, 'ok');
  }).catch(err => {
    console.error('Generate from phone error:', err);
    showToast('Failed to generate iPad screenshots', 'warn');
  });
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

const fIpadFitMode = $('f-ipad-fit-mode');
if(fIpadFitMode){
  if(typeof IPAD_FIT_MODE !== 'undefined') fIpadFitMode.value = IPAD_FIT_MODE;
  fIpadFitMode.onchange = (e) => {
    IPAD_FIT_MODE = e.target.value;
    saveState();
    showToast('Fit mode: ' + (IPAD_FIT_MODE === 'cover' ? 'Fill / Cover (Full Bleed)' : 'Fit / Contain (Soft Blur)'), 'ok');
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
      showToast('iPad screenshot uploaded!', 'ok');
    });
    e.target.value = '';
  };
}
