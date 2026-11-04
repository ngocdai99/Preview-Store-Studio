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
      hint.innerHTML = '<strong>Universal App Active:</strong> Dedicated iPad Pro 13" screenshots in Card 5 below.';
    } else {
      hint.innerHTML = '<strong>iPhone-only Mode:</strong> Apple displays scaled iPhone fallback unless dedicated iPad screenshots are added in Card 5.';
    }
  }

  const ipadCard = $('ipadCard');
  if(ipadCard) ipadCard.style.display = (store === 'apple') ? '' : 'none';

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

  // Update iPad Search Result 2-Column Grid Card
  $$('[data-shots=ipad-shots]').forEach(c => {
    c.innerHTML = '';
    const searchView = c.closest('.ipad-search-view') || $('.ipad-search-view');
    const valid = effectiveShots.filter(s => s && typeof s === 'string' && s.trim());
    if(valid.length === 0){
      c.classList.remove('has-landscape');
      if (searchView) searchView.classList.remove('has-landscape');
      for(let i = 0; i < 2; i++){
        const sk = document.createElement('div');
        sk.className = 'ipad-skel-shot';
        c.appendChild(sk);
      }
    } else {
      const firstShot = valid[0];
      const isLandscapeUrl = (typeof firstShot === 'string') && (/\/2732x2048bb|\/2688x1242bb/i.test(firstShot) || firstShot.includes('landscape'));
      c.classList.toggle('has-landscape', isLandscapeUrl);
      if (searchView) searchView.classList.toggle('has-landscape', isLandscapeUrl);

      const count = isLandscapeUrl ? 1 : Math.min(2, valid.length);
      for (let i = 0; i < count; i++) {
        const s = valid[i];
        const img = mk(s || (typeof PH_IPAD !== 'undefined' ? PH_IPAD : PH), 'Result ' + (i + 1));
        img.className = 'ipad-sr-shot';
        if (isLandscapeUrl) {
          img.classList.add('landscape-shot');
        } else {
          img.classList.add('portrait-shot');
        }
        img.onload = function() {
          if (this.naturalWidth > this.naturalHeight * 1.15) {
            c.classList.add('has-landscape');
            if (searchView) searchView.classList.add('has-landscape');
            this.classList.add('landscape-shot');
            this.classList.remove('portrait-shot');
            while (c.children.length > 1) {
              c.removeChild(c.lastChild);
            }
          } else if (this.naturalHeight > this.naturalWidth * 1.15 && c.classList.contains('has-landscape')) {
            c.classList.remove('has-landscape');
            if (searchView) searchView.classList.remove('has-landscape');
            this.classList.remove('landscape-shot');
            this.classList.add('portrait-shot');
          }
        };
        c.appendChild(img);
      }

      if (!isLandscapeUrl && valid.length === 1) {
        const sk = document.createElement('div');
        sk.className = 'ipad-skel-shot';
        c.appendChild(sk);
      }
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

    const thumb = mk(s || (typeof PH_IPAD !== 'undefined' ? PH_IPAD : PH));
    thumb.style.cursor = 'pointer';
    thumb.title = 'Click to inspect & view details';
    thumb.onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || (typeof PH_IPAD !== 'undefined' ? PH_IPAD : PH),
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

    // Row Title, Role Tag & Actions
    const col = document.createElement('div'); col.className = 'col';
    const head = document.createElement('div'); head.className = 'shot-row-head';
    head.innerHTML = `<span class="shot-row-title">#${i + 1}</span>`;

    const metaLine = document.createElement('div'); metaLine.className = 'shot-meta-line';
    metaLine.innerHTML = `<span class="shot-dim-tag" id="ipadShotDimTag_${i}" style="display:none"></span>`;

    col.append(head, metaLine);
    r.appendChild(col);

    const act = document.createElement('div'); act.className = 'act';
    act.innerHTML =
      '<button type="button" class="mini shot-upload-btn" title="Upload / Replace screenshot" aria-label="Upload / Replace screenshot">' + ICO_UPLOAD + '</button>' +
      '<button type="button" class="mini shot-inspect-btn" title="Inspect screenshot details" aria-label="Inspect screenshot details">' + ICO_INSPECT + '</button>';
    const upBtn = act.children[0];
    const inspectBtn = act.children[1];
    upBtn.onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; ipadPick = i; $('ipadShotFile').click(); };
    inspectBtn.onclick = () => {
      if(typeof openImageDetailModal === 'function'){
        openImageDetailModal({
          src: s || (typeof PH_IPAD !== 'undefined' ? PH_IPAD : PH),
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
    r.appendChild(act);

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
    badgeEl.className = 'shot-status-badge ok';
    badgeEl.innerHTML = '';
    badgeEl.style.display = 'none';
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
      const is3to4 = (Math.abs(ratio - (3/4)) < 0.08) || (Math.abs(ratio - (4/3)) < 0.08) || (ratio >= 0.65 && ratio <= 0.85) || (ratio >= 1.18 && ratio <= 1.54);

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

      if(tag){
        tag.style.display = 'inline-flex';
        if(isOverSize){
          tag.className = 'shot-dim-tag err';
          tag.textContent = `>8 MB (${(shotSize/(1024*1024)).toFixed(1)} MB)`;
        } else if(isExactIpad){
          tag.className = 'shot-dim-tag ok';
          tag.textContent = `iPad Pro 13" (${w}×${h})`;
        } else if(is3to4){
          tag.className = 'shot-dim-tag ok';
          tag.textContent = `iPad 4:3 (${w}×${h})`;
        } else if(h > w * 1.5 || w > h * 1.5){
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `Phone Ratio (${w}×${h})`;
        } else {
          tag.className = 'shot-dim-tag warn';
          tag.textContent = `Non-standard (${w}×${h})`;
        }
      }

      if(!isOverSize && (isExactIpad || is3to4)){
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
      badgeEl.innerHTML = `${SB_WARN}<span><strong>Dimension Notice:</strong> ${noun} ${items} exceed 8 MB limit or not standard iPad 4:3 ratio. Phone screenshots will be cropped or letterboxed.</span>`;
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
    if(!SUPPORTS_IPAD) setSupportsIpad(true);
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
    if(typeof isDemoMode === 'function' && isDemoMode()){
      const currentUploaded = (window._demoScreenshotUploadCount || 0);
      if(currentUploaded >= 2){
        if(typeof requireFullVersion === 'function') requireFullVersion('upload-shots');
        e.target.value = '';
        return;
      }
      window._demoScreenshotUploadCount = currentUploaded + 1;
    }
    if(typeof validateUploadFile === 'function' && !validateUploadFile(f, MAX_UPLOAD_BYTES, 'iPad screenshot')){
      e.target.value = '';
      return;
    }
    readFile(f, d => {
      if(!SUPPORTS_IPAD) setSupportsIpad(true);
      ipadPick < 0 ? IPAD_SHOTS.push(d) : IPAD_SHOTS[ipadPick] = d;
      ipadPick = -1;
      renderIpadShots();
      saveState();
      showToast('iPad screenshot uploaded!', 'ok');
    });
    e.target.value = '';
  };
}
