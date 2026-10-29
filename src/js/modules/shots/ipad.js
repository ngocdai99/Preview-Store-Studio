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

  $$('.a-platforms-badge').forEach(b => {
    const ipadIco = b.querySelector('.a-plat-ico-ipad');
    const label = b.querySelector('.a-plat-label') || b.querySelector('span');
    if(ipadIco) ipadIco.style.display = SUPPORTS_IPAD ? '' : 'none';
    if(label) label.textContent = SUPPORTS_IPAD ? 'iPhone, iPad' : 'iPhone';
  });

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
    const valid = effectiveShots.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      for(let i = 0; i < 3; i++){
        const sk = document.createElement('div');
        sk.className = 'sr-skel-shot ipad-skel-shot';
        c.appendChild(sk);
      }
    } else {
      valid.slice(0, 3).forEach((s, i) => c.appendChild(mk(s || PH, 'Result ' + (i + 1))));
    }
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
      IPAD_SHOTS.splice(i, 1);
      renderIpadShots();
      saveState();
    };
    thumbWrap.appendChild(delBtn);
    r.appendChild(thumbWrap);

    // Row Title & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span><span class="shot-dim-tag" id="ipadShotDimTag_${i}" style="margin-left:auto;display:none"></span>`;

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML = '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>';
    const upBtn = act.firstElementChild;
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };

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
      badgeEl.style.display = 'flex';
    } else {
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
    return;
  }

  if(validCount > 10){
    badgeEl.className = 'shot-status-badge err';
    badgeEl.innerHTML = `${SB_ERR}<span><strong>App Store Rejection Risk:</strong> ${validCount} screenshots. Apple allows a maximum of <strong>10 screenshots</strong> for iPad.</span>`;
    badgeEl.style.display = 'flex';
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
    if(nonCompliantIndices.length > 0){
      const items = nonCompliantIndices.map(n => `#${n}`).join(', ');
      const noun = nonCompliantIndices.length > 1 ? 'Screenshots' : 'Screenshot';
      badgeEl.className = 'shot-status-badge warn';
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> ${noun} ${items} not exact iPad Pro 13" (2048×2732 px or 2064×2752 px).</span>`;
      badgeEl.style.display = 'flex';
    } else {
      // Compliant: All criteria met -> hide badge, do not show green message box
      badgeEl.className = 'shot-status-badge ok';
      badgeEl.innerHTML = '';
      badgeEl.style.display = 'none';
    }
  }
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
