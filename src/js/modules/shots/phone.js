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

    // Thumbnail Preview with Click-to-Inspect
    const thumb = mk(s || PH);
    thumb.style.cursor = 'pointer';
    thumb.title = 'Click to inspect & view details';
    thumb.onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    r.appendChild(thumb);

    // Row Title & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">Screenshot #${i + 1}</span><span class="shot-dim-tag" id="shotDimTag_${i}" style="margin-left:auto;display:none"></span>`;

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button>' +
      '<button class="mini" title="Inspect / View Details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;vertical-align:middle"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Inspect</button>' +
      '<button class="mini" data-m="-1" title="Move Up">&uarr;</button>' +
      '<button class="mini" data-m="1" title="Move Down">&darr;</button>' +
      '<button class="mini del" title="Delete">&times;</button>';
    const b = act.children;
    b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    b[1].onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || PH,
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
    b[2].onclick = () => mv(i, -1);
    b[3].onclick = () => mv(i, 1);
    b[4].onclick = () => { SHOTS.splice(i, 1); renderShots(); saveState(); };

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
  const maxAllowed = store === 'apple' ? 10 : 8;
  const minRequired = store === 'apple' ? 1 : 2;

  const counterEl = $('shotCounter');
  if(counterEl){
    counterEl.textContent = `${validCount} / ${maxAllowed} screenshots`;
    counterEl.className = 'cc' + (validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
  }

  const hintEl = $('shotHint');
  if(hintEl){
    if(store === 'apple'){
      hintEl.innerHTML = '<strong>Apple App Store:</strong> Upload 1–10 screenshots per display (iPhone 6.9" 1320×2868 / 1290×2796 px or 6.5" 1284×2778 px). PNG or JPEG, no alpha transparency. Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots. PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px. Drag ⠿ handle to reorder.';
    }
  }

  const badgeEl = $('shotStatusBadge');
  if(!badgeEl) return;

  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_WARN = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;

  if(validCount < minRequired){
    badgeEl.className = 'shot-status-badge warn';
    badgeEl.innerHTML = `${SB_WARN}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Notice:</strong> ${validCount} screenshot${validCount === 1 ? '' : 's'}. Stores require at least <strong>${minRequired} screenshot${minRequired === 1 ? '' : 's'}</strong>.</span>`;
    return;
  }
  if(validCount > maxAllowed){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Rejection Risk:</strong> ${validCount} screenshots. ${store === 'apple' ? 'Apple' : 'Google Play'} allows a maximum of <strong>${maxAllowed} screenshots</strong>.</span>`;
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
    if(squareIndices.length > 0){
      const items = squareIndices.map(n => `#${n}`).join(', ');
      if(store === 'apple'){
        badgeEl.className = 'shot-status-badge err';
        badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> Screenshot ${items} is square (1:1). Apple requires portrait phone resolutions (e.g. 1290×2796 px).</span>`;
      } else {
        badgeEl.className = 'shot-status-badge warn';
        badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> Screenshot ${items} is square (1:1). Standard phone screenshots should be portrait (9:16 or 9:19.5). Square photos will be cropped or letterboxed in phone mockups.</span>`;
      }
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Aspect Ratio Notice:</strong> Screenshot ${items} has non-standard ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>`;
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Google Play Error:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>`;
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = `${SB_OK}<span><strong>${store === 'apple' ? 'App Store' : 'Google Play'} Compliant:</strong> ${validCount} screenshots (Valid range: ${minRequired}–${maxAllowed}) · All portrait phone aspect ratios.</span>`;
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
