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

    // Thumbnail Preview with Click-to-Inspect & Floating Delete Button
    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'shot-thumb-wrap';

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
    thumbWrap.appendChild(thumb);

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
      renderShots();
      saveState();
    };
    thumbWrap.appendChild(delBtn);
    r.appendChild(thumbWrap);

    // Row Title, Role Tag & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>`;

    const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
    metaLine.innerHTML = `<span class="shot-dim-tag" id="shotDimTag_${i}" style="display:none"></span>`;

    col.append(head, metaLine);
    r.appendChild(col);

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML =
      '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
      '<button type="button" class="mini shot-inspect-btn" title="Inspect screenshot details" aria-label="Inspect screenshot details">' + ICO_INSPECT + '</button>';
    const upBtn = act.children[0];
    const inspectBtn = act.children[1];
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; pick = i; $('shotFile').click(); };
    inspectBtn.onclick = () => {
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
  if(counterEl){
    counterEl.textContent = `${validCount} / ${maxAllowed} screenshots`;
    counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
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
      badgeEl.style.display = 'flex';
    } else if(nonPhoneIndices.length > 0){
      const items = nonPhoneIndices.map(n => `#${n}`).join(', ');
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Aspect Ratio Notice:</strong> Screenshot ${items} has non-standard ratio. Recommended: 9:16 or 9:19.5 phone portrait.</span>`;
      badgeEl.style.display = 'flex';
    } else if(sizeIssueIndices.length > 0){
      const items = sizeIssueIndices.map(n => `#${n}`).join(', ');
      const noun = sizeIssueIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      const verb = sizeIssueIndices.length > 1 ? 'have' : 'has';
      badgeEl.className = 'shot-status-badge err';
      badgeEl.innerHTML = `${SB_ERR}<span><strong>Google Play Error:</strong> ${noun} ${items} ${verb} side length outside 320–3,840 px.</span>`;
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
