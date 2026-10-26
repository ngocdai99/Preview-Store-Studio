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
    SHOTS.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
  });

  // Validate screenshots count & aspect ratios
  validateScreenshots();
  if(typeof renderIpadShots === 'function') renderIpadShots();

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

    // Thumbnail Preview
    r.appendChild(mk(s || PH));

    // Input & Actions
    const col = document.createElement('div'); col.className = 'col';
    const inp = document.createElement('input'); inp.type = 'text';
    inp.value = s.startsWith('data:') ? '(Embedded / Uploaded Image)' : s;
    inp.placeholder = 'https://… image URL or upload';
    inp.disabled = s.startsWith('data:');
    inp.onchange = () => { SHOTS[i] = inp.value.trim(); renderShots(); saveState(); };

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button><button class="mini" data-m="-1" title="Move Up">↑</button><button class="mini" data-m="1" title="Move Down">↓</button><button class="mini del" title="Delete">&times;</button><span class="shot-dim-tag" id="shotDimTag_' + i + '" style="margin-left:auto;display:none"></span>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    b[1].onclick = () => mv(i, -1);
    b[2].onclick = () => mv(i, 1);
    b[3].onclick = () => { SHOTS.splice(i, 1); renderShots(); saveState(); };

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

function mv(i, d){
  const j = i + d;
  if(j < 0 || j >= SHOTS.length) return;
  [SHOTS[i], SHOTS[j]] = [SHOTS[j], SHOTS[i]];
  renderShots();
  saveState();
}

let _phoneValRunId = 0;
function validateScreenshots(){
  const runId = ++_phoneValRunId;
  const validShots = SHOTS.filter(s => s && s.trim());
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

if($('shotFile')){
  $('shotFile').onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
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
    SHOTS.push('');
    renderShots();
    saveState();
    const ins = $$('.srow input');
    if(ins.length) ins[ins.length - 1].focus();
  };
}

function downloadAllPhoneScreenshots(){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const validEntries = [];
  SHOTS.forEach((s, idx) => {
    if(s && s.trim()) validEntries.push({ src: s, index: idx });
  });

  if(validEntries.length === 0){
    showToast('No phone screenshots to export', 'warn');
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

  showToast(`Packaging ${validEntries.length} phone screenshot${validEntries.length === 1 ? '' : 's'} into ZIP (please wait)...`, 'info', 2200);

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
    showToast(`Downloaded ${files.length} phone screenshots in 1 ZIP package!`, 'ok');
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
