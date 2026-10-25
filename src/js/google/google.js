// Store Preview Studio · Google Play Devices & Tablet Orientation
// --- Google Play Tablet Screenshots (7-inch & 10-inch) ---
let googleDevice = 'phone'; // 'phone' | 'tab7' | 'tab10'
let phoneOrient = 'portrait'; // 'portrait' | 'landscape'
const tabOrient = {tab7:'landscape', tab10:'landscape'};
const MAX_TAB = 8;
const TAB_CFG = {
  tab7:  {name:'7-inch',  min:320,  max:3840, list:'tab7List',  counter:'tab7Counter',  badge:'tab7Badge',  file:'tab7File',  add:'tab7Add',  url:'tab7Url',  gal:'galTab7',  dev:'dev-tab7'},
  tab10: {name:'10-inch', min:1080, max:7680, list:'tab10List', counter:'tab10Counter', badge:'tab10Badge', file:'tab10File', add:'tab10Add', url:'tab10Url', gal:'galTab10', dev:'dev-tab10'}
};
const TABS = {tab7:[], tab10:[]};  // items: {src, meta:{type,bytes,w,h}}
let tabPick = {key:null, idx:-1};

function srcInfo(s){
  const head = (s||'').indexOf(',');
  const m = /^data:([^;,]+)/.exec(s||'');
  if(!m || head < 0) return {};
  const b64 = /;base64/.test(s.slice(0, head));
  const body = s.length - head - 1;
  return {type:m[1], bytes: b64 ? Math.round(body*3/4) : body};
}
function probeTab(it){
  it.meta = null;
  if(!it.src) return;
  const meta = it.meta = srcInfo(it.src);
  const im = new Image();
  im.referrerPolicy = 'no-referrer';
  im.onload = () => { if(it.meta === meta){ meta.w = im.naturalWidth; meta.h = im.naturalHeight; renderTablets(); } };
  im.onerror = () => { if(it.meta === meta){ meta.bad = true; renderTablets(); } };
  im.src = ensureSvgDimensions(it.src);
}
function makeTabItem(s){ const it = {src:(s||'').trim(), meta:null}; probeTab(it); return it; }

function tabIssues(key, it){
  const c = TAB_CFG[key], m = it.meta, out = [];
  if(!m) return out;
  if(m.bad) out.push('Image could not be loaded');
  if(m.type && !/^image\/(png|jpeg)$/.test(m.type)) out.push('Must be PNG or JPEG');
  if(m.bytes && m.bytes > 8*1024*1024) out.push('Over 8 MB');
  if(m.w && m.h){
    const r = m.w / m.h;
    if(Math.abs(r - 16/9) > 0.02 && Math.abs(r - 9/16) > 0.02) out.push('Aspect ratio must be 16:9 or 9:16');
    if(m.w < c.min || m.h < c.min || m.w > c.max || m.h > c.max) out.push(`Each side must be ${c.min.toLocaleString('en-US')}–${c.max.toLocaleString('en-US')} px`);
  }
  return out;
}
const fmtSize = b => b >= 1048576 ? (b/1048576).toFixed(1)+' MB' : Math.max(1, Math.round(b/1024))+' KB';
const ratioLabel = (w,h) => { const r = w/h; return Math.abs(r-16/9) <= 0.02 ? '16:9' : Math.abs(r-9/16) <= 0.02 ? '9:16' : r.toFixed(2)+':1'; };

const _tabPh = {};
function tabPlaceholder(key, orient, n){
  const id = key + orient + n;
  if(_tabPh[id]) return _tabPh[id];
  const c = TAB_CFG[key], land = orient === 'landscape', W = land ? 1280 : 720, H = land ? 720 : 1280;
  const f1 = Math.round(Math.min(W,H)*.06), f2 = Math.round(Math.min(W,H)*.032);
  return _tabPh[id] = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#p)"/>
  <rect x="${W*.08}" y="${H*.09}" width="${W*.84}" height="${H*.07}" rx="14" fill="#334155" opacity=".7"/>
  <rect x="${W*.08}" y="${H*.2}" width="${W*.5}" height="${H*.04}" rx="10" fill="#334155" opacity=".5"/>
  <text x="${W/2}" y="${H*.52}" font-family="Roboto,system-ui,sans-serif" font-size="${f1}" font-weight="700" fill="#e2e8f0" text-anchor="middle">${c.name} tablet · screenshot ${n}</text>
  <text x="${W/2}" y="${H*.52 + f1*1.4}" font-family="Roboto,system-ui,sans-serif" font-size="${f2}" fill="#94a3b8" text-anchor="middle">Upload 16:9 or 9:16 · ${c.min}–${c.max} px per side</text>
</svg>`);
}

function renderTablets(){
  const SB_OK = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>`;
  const SB_INFO = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>`;
  const SB_ERR = `<span class="sb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span>`;
  Object.keys(TAB_CFG).forEach(key => {
    const c = TAB_CFG[key], items = TABS[key];
    const valid = items.filter(i => i.src);
    const bad = valid.filter(i => tabIssues(key, i).length).length;

    const ce = $(c.counter);
    ce.textContent = `${valid.length} / ${MAX_TAB} screenshots`;
    ce.className = 'cc' + (valid.length > MAX_TAB ? ' err' : '');

    const be = $(c.badge);
    const dlBtn = valid.length > 0 ? `<button class="mini dl-btn" id="btnDlAll_${key}" style="margin-left:auto;white-space:nowrap;padding:4px 9px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:7px">${ICO_ZIP}Export (ZIP)</button>` : '';
    if(!valid.length){
      be.className = 'shot-status-badge warn';
      be.innerHTML = `${SB_INFO}<span><strong>No ${c.name} screenshots yet.</strong> The preview shows placeholders. Upload up to ${MAX_TAB}.</span>`;
    }else if(bad){
      be.className = 'shot-status-badge err';
      be.innerHTML = `${SB_ERR}<span><strong>${bad} of ${valid.length} screenshot${valid.length===1?'':'s'} would be rejected</strong> by Play Console. See details below.</span>${dlBtn}`;
    }else{
      be.className = 'shot-status-badge ok';
      be.innerHTML = `${SB_OK}<span><strong>${c.name} tablet assets look good:</strong> ${valid.length} screenshot${valid.length===1?'':'s'}.</span>${dlBtn}`;
    }
    if($('btnDlAll_' + key)){
      $('btnDlAll_' + key).onclick = () => downloadAllTabScreenshots(key);
    }

    // Editor list
    const L = $(c.list);
    L.innerHTML = '';
    items.forEach((it, i) => {
      const r = document.createElement('div');
      r.className = 'srow tab';
      r.draggable = true;
      const handle = document.createElement('div');
      handle.className = 'drag-handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder';
      r.appendChild(handle);
      r.appendChild(mk(it.src || PH));

      const col = document.createElement('div'); col.className = 'col';
      const inp = document.createElement('input'); inp.type = 'text';
      inp.value = it.src.startsWith('data:') ? '(Embedded / Uploaded Image)' : it.src;
      inp.placeholder = 'https://… image URL';
      inp.disabled = it.src.startsWith('data:');
      inp.onchange = () => { TABS[key][i] = makeTabItem(inp.value); renderTablets(); saveState(); };

      const meta = document.createElement('div'); meta.className = 'tab-meta';
      if(it.meta && it.meta.w){
        const probs = tabIssues(key, it);
        meta.textContent = `${it.meta.w}×${it.meta.h} · ${ratioLabel(it.meta.w, it.meta.h)}` + (it.meta.bytes ? ' · ' + fmtSize(it.meta.bytes) : '') + (probs.length ? ' — ' + probs.join('; ') : ' ✓');
        meta.classList.add(probs.length ? 'bad' : 'ok');
      }else if(it.meta && it.meta.bad){
        meta.textContent = 'Image could not be loaded'; meta.classList.add('bad');
      }else if(it.src){
        meta.textContent = 'Checking…';
      }

      const act = document.createElement('div'); act.className = 'act';
      act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button><button class="mini" title="Move Up">↑</button><button class="mini" title="Move Down">↓</button><button class="mini dl-btn" title="Download PNG">' + ICO_DL + '</button><button class="mini del" title="Delete">✕</button>';
      const b = act.children;
      b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key, idx:i}; $(c.file).click(); };
      b[1].onclick = () => mvTab(key, i, -1);
      b[2].onclick = () => mvTab(key, i, 1);
      b[3].onclick = () => downloadTabScreenshot(key, i);
      b[4].onclick = () => { TABS[key].splice(i, 1); renderTablets(); saveState(); };
      col.append(inp, meta, act);
      r.appendChild(col);

      r.addEventListener('dragstart', e => { r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'tabshot:' + key + ':' + i); });
      r.addEventListener('dragend', () => { r.classList.remove('dragging'); $$('.srow.tab').forEach(x => x.classList.remove('drag-over')); });
      r.addEventListener('dragover', e => { e.preventDefault(); r.classList.add('drag-over'); });
      r.addEventListener('dragleave', () => r.classList.remove('drag-over'));
      r.addEventListener('drop', e => {
        r.classList.remove('drag-over');
        const m = /^tabshot:(tab\d+):(\d+)$/.exec(e.dataTransfer.getData('text/plain') || '');
        if(!m) return; // external file drop bubbles up to the section handler
        e.preventDefault(); e.stopPropagation();
        if(m[1] !== key) return;
        const from = parseInt(m[2], 10);
        if(from !== i){ const x = TABS[key].splice(from, 1)[0]; TABS[key].splice(i, 0, x); renderTablets(); saveState(); }
      });
      L.appendChild(r);
    });

    // Live preview gallery inside the tablet mockup
    const g = $(c.gal);
    g.innerHTML = '';
    if(valid.length) valid.forEach((it, i) => g.appendChild(mk(it.src, 'Screenshot ' + (i+1))));
    else for(let i = 1; i <= 3; i++) g.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
    const sg = $('srch' + key.charAt(0).toUpperCase() + key.slice(1));
    if(sg){
      sg.innerHTML = '';
      if(valid.length) valid.slice(0, 3).forEach((it, i) => sg.appendChild(mk(it.src, 'Result ' + (i+1))));
      else for(let i = 1; i <= 3; i++) sg.appendChild(mk(tabPlaceholder(key, tabOrient[key], i), 'Placeholder ' + i));
    }
  });
}

function mvTab(key, i, d){
  const j = i + d, a = TABS[key];
  if(j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]];
  renderTablets(); saveState();
}

function addTabFiles(key, files){
  files = [...files].filter(f => f.type.startsWith('image/'));
  if(!files.length) return;
  const room = MAX_TAB - TABS[key].length;
  if(room <= 0){ showToast(`${TAB_CFG[key].name} tablets allow up to ${MAX_TAB} screenshots`, 'warn'); return; }
  if(files.length > room){ files = files.slice(0, room); showToast(`Only ${room} more fit (max ${MAX_TAB}) — extra files skipped`, 'warn'); }
  let done = 0;
  const out = new Array(files.length);
  files.forEach((f, n) => readFile(f, d => {
    out[n] = d;
    if(++done === files.length){
      out.forEach(s => TABS[key].push(makeTabItem(s)));
      renderTablets(); saveState();
      showToast(`Added ${files.length} ${TAB_CFG[key].name} tablet screenshot${files.length===1?'':'s'}`, '📸');
    }
  }));
}

Object.keys(TAB_CFG).forEach(key => {
  const c = TAB_CFG[key];
  $(c.file).onchange = e => {
    const files = [...e.target.files];
    e.target.value = '';
    if(!files.length) return;
    if(tabPick.key === key && tabPick.idx >= 0){
      const idx = tabPick.idx; tabPick = {key:null, idx:-1};
      readFile(files[0], d => { TABS[key][idx] = makeTabItem(d); renderTablets(); saveState(); showToast('Screenshot replaced', '📸'); });
    }else{
      tabPick = {key:null, idx:-1};
      addTabFiles(key, files);
    }
  };
  $(c.add).onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key:null, idx:-1}; $(c.file).click(); };
  $(c.url).onclick = () => {
    if(TABS[key].length >= MAX_TAB){ showToast(`${c.name} tablets allow up to ${MAX_TAB} screenshots`, 'warn'); return; }
    TABS[key].push(makeTabItem(''));
    renderTablets(); saveState();
    const ins = $(c.list).querySelectorAll('input'); if(ins.length) ins[ins.length-1].focus();
  };
  const sec = $(c.list).parentElement;
  sec.addEventListener('dragover', e => e.preventDefault());
  sec.addEventListener('drop', e => {
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if(files.length){ e.preventDefault(); addTabFiles(key, files); }
  });
});

function applyGooglePhoneOrient(){
  const phone = document.querySelector('.dev.google');
  if(phone) phone.classList.toggle('landscape', phoneOrient === 'landscape');
}
function applyTabOrient(){
  Object.keys(TAB_CFG).forEach(k => { const d = $(TAB_CFG[k].dev); if(d) d.classList.toggle('portrait', tabOrient[k] === 'portrait'); });
}
function applyGoogleDevice(){
  document.body.dataset.googleDevice = googleDevice;
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === googleDevice));
  syncAllVtPills();
}
function setGoogleDevice(d, animate = true){
  const nextDev = (d === 'tab7' || d === 'tab10') ? d : 'phone';
  if(googleDevice === nextDev && document.body.dataset.googleDevice === nextDev){
    syncAllVtPills();
    return;
  }
  transitionDevice('google', nextDev, () => {
    googleDevice = nextDev;
    applyGoogleDevice();
    saveState();
  }, animate);
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === nextDev));
  syncAllVtPills();
}
$$('#gdt [data-gd]').forEach(b => b.onclick = () => setGoogleDevice(b.dataset.gd));
$('gdRotate').onclick = () => {
  if(googleDevice === 'phone'){
    phoneOrient = phoneOrient === 'landscape' ? 'portrait' : 'landscape';
    applyGooglePhoneOrient();
    requestAnimationFrame(() => { fit(); syncAllVtPills(); });
    saveState();
  } else {
    tabOrient[googleDevice] = tabOrient[googleDevice] === 'landscape' ? 'portrait' : 'landscape';
    applyTabOrient(); renderTablets();
    requestAnimationFrame(() => { fit(); syncAllVtPills(); }); saveState();
  }
};
function tabStatus(key){
  const v = TABS[key].filter(i => i.src), bad = v.filter(i => tabIssues(key, i).length).length;
  if(!v.length) return 'None uploaded (optional)';
  if(v.length > MAX_TAB) return `${v.length} screenshots - max ${MAX_TAB}`;
  return bad ? `${bad} of ${v.length} would be rejected` : `PASS (${v.length} screenshot${v.length===1?'':'s'})`;
}

// --- Google Play Screenshot Downloads & Bulk ZIP Exports ---
function downloadTabScreenshot(key, index){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const it = TABS[key] && TABS[key][index];
  if(!it || !it.src || !it.src.trim()){
    showToast('No screenshot to download', 'warn');
    return;
  }
  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || (key === 'tab7' ? 1280 : 1920);
    canvas.height = img.naturalHeight || (key === 'tab7' ? 800 : 1200);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => {
      if(!blob){
        showToast('Error generating image file', 'warn');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-google-play-${key}-shot-${index + 1}-${canvas.width}x${canvas.height}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Downloaded ${TAB_CFG[key].name} Screenshot #${index + 1} (${canvas.width}×${canvas.height})!`, '⬇️');
    }, 'image/png');
  };
  img.onerror = () => showToast('Failed to load image for download', 'warn');
  img.src = ensureSvgDimensions(it.src);
}

function downloadAllTabScreenshots(key){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const cfg = TAB_CFG[key];
  if(!cfg) return;
  const validEntries = [];
  (TABS[key] || []).forEach((it, idx) => {
    if(it && it.src && it.src.trim()) validEntries.push({ src: it.src, index: idx });
  });

  if(validEntries.length === 0){
    showToast(`No ${cfg.name} tablet screenshots to export`, 'ℹ️');
    return;
  }

  _isZipExporting = true;
  if(typeof _lastDownloadTime !== 'undefined') _lastDownloadTime = Date.now();

  const dlBtn = $('btnDlAll_' + key);
  const optBtn = $(key === 'tab7' ? 'optExportTab7Shots' : 'optExportTab10Shots');
  let origDlHtml = '';
  if(dlBtn){
    origDlHtml = dlBtn.innerHTML;
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    dlBtn.innerHTML = '<span class="btn-spinner"></span> Packaging...';
  }
  if(optBtn) optBtn.classList.add('loading');

  showToast(`Packaging ${validEntries.length} ${cfg.name} tablet screenshot${validEntries.length === 1 ? '' : 's'} into ZIP (please wait)...`, '⏳', 2200);

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
          canvas.width = img.naturalWidth || (key === 'tab7' ? 1280 : 1920);
          canvas.height = img.naturalHeight || (key === 'tab7' ? 800 : 1200);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          const fileName = `${name}-google-play-${key}-shot-${order + 1}-${canvas.width}x${canvas.height}.png`;
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
    a.download = `${name}-google-play-${key}-tablet-screenshots.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Downloaded ${files.length} ${cfg.name} tablet screenshots in 1 ZIP package! ✨`, '⬇️');
  }).catch(err => {
    console.error(`${key} ZIP export error:`, err);
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

function downloadAllTab7Screenshots(){
  return downloadAllTabScreenshots('tab7');
}

function downloadAllTab10Screenshots(){
  return downloadAllTabScreenshots('tab10');
}

function downloadAllTabletsScreenshots(){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;

  const tab7Valid = (TABS.tab7 || []).filter(it => it && it.src && it.src.trim());
  const tab10Valid = (TABS.tab10 || []).filter(it => it && it.src && it.src.trim());
  const totalCount = tab7Valid.length + tab10Valid.length;

  if(totalCount === 0){
    showToast('No tablet screenshots to export', 'ℹ️');
    return;
  }

  _isZipExporting = true;
  if(typeof _lastDownloadTime !== 'undefined') _lastDownloadTime = Date.now();

  const dlBtn = $('btnDlAllTablets');
  const optBtn = $('optExportAllTablets');
  let origDlHtml = '';
  if(dlBtn){
    origDlHtml = dlBtn.innerHTML;
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    dlBtn.innerHTML = '<span class="btn-spinner"></span> Packaging...';
  }
  if(optBtn) optBtn.classList.add('loading');

  showToast(`Packaging ${totalCount} tablet screenshot${totalCount === 1 ? '' : 's'} into ZIP (please wait)...`, '⏳', 2200);

  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';

  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

  const packEntries = [];
  tab7Valid.forEach((entry, order) => {
    packEntries.push({
      folder: '7-inch-tablet',
      key: 'tab7',
      order,
      src: entry.src
    });
  });
  tab10Valid.forEach((entry, order) => {
    packEntries.push({
      folder: '10-inch-tablet',
      key: 'tab10',
      order,
      src: entry.src
    });
  });

  const packPromise = Promise.all(packEntries.map((item) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || (item.key === 'tab7' ? 1280 : 1920);
          canvas.height = img.naturalHeight || (item.key === 'tab7' ? 800 : 1200);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          const fileName = `${item.folder}/${name}-${item.key}-shot-${item.order + 1}-${canvas.width}x${canvas.height}.png`;
          resolve({ name: fileName, data: bytes });
        } catch(e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(item.src);
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
    a.download = `${name}-google-play-tablets-screenshots.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Downloaded ${files.length} tablet screenshots in 1 ZIP package! ✨`, '⬇️');
  }).catch(err => {
    console.error('Tablets ZIP export error:', err);
    showToast('Failed to generate ZIP archive', 'warn');
  }).finally(() => {
    if(dlBtn){
      dlBtn.classList.remove('loading');
      dlBtn.disabled = false;
      dlBtn.innerHTML = origDlHtml || `${ICO_ZIP}Export All Tablets (ZIP)`;
    }
    if(optBtn) optBtn.classList.remove('loading');
    _isZipExporting = false;
  });
}

function downloadAllGooglePlayBundle(){
  if(typeof _isZipExporting !== 'undefined' && _isZipExporting) return;
  if(typeof canDownload === 'function' && !canDownload(1000)) return;

  const phoneValid = (typeof SHOTS !== 'undefined' ? SHOTS : []).filter(s => typeof s === 'string' && s.trim());
  const tab7Valid = (TABS.tab7 || []).filter(it => it && it.src && it.src.trim());
  const tab10Valid = (TABS.tab10 || []).filter(it => it && it.src && it.src.trim());
  const hasFeature = typeof FEATURE_GRAPHIC === 'string' && FEATURE_GRAPHIC.trim().length > 0;
  const hasIcon = typeof ICON === 'string' && ICON.trim().length > 0;

  const totalItems = phoneValid.length + tab7Valid.length + tab10Valid.length + (hasFeature ? 1 : 0) + (hasIcon ? 1 : 0);
  if(totalItems === 0){
    showToast('No Google Play assets to export', 'ℹ️');
    return;
  }

  _isZipExporting = true;
  if(typeof _lastDownloadTime !== 'undefined') _lastDownloadTime = Date.now();

  const optBtn = $('optExportGooglePlayBundle');
  if(optBtn) optBtn.classList.add('loading');

  showToast(`Packaging ${totalItems} Google Play assets into ZIP (please wait)...`, '⏳', 2200);

  const name = ($('f-name') && $('f-name').value ? $('f-name').value : 'app')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app';

  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

  const tasks = [];

  // 1. Phone Screenshots
  phoneValid.forEach((src, order) => {
    tasks.push(new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 1080;
          canvas.height = img.naturalHeight || 1920;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          resolve({ name: `01-phone-screenshots/${name}-phone-shot-${order + 1}-${canvas.width}x${canvas.height}.png`, data: bytes });
        } catch(e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(src);
    }));
  });

  // 2. 7-inch Tablet Screenshots
  tab7Valid.forEach((entry, order) => {
    tasks.push(new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 1280;
          canvas.height = img.naturalHeight || 800;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          resolve({ name: `02-tablet-7inch/${name}-7inch-shot-${order + 1}-${canvas.width}x${canvas.height}.png`, data: bytes });
        } catch(e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(entry.src);
    }));
  });

  // 3. 10-inch Tablet Screenshots
  tab10Valid.forEach((entry, order) => {
    tasks.push(new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 1920;
          canvas.height = img.naturalHeight || 1200;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          resolve({ name: `03-tablet-10inch/${name}-10inch-shot-${order + 1}-${canvas.width}x${canvas.height}.png`, data: bytes });
        } catch(e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(entry.src);
    }));
  });

  // 4. Feature Graphic (1024×500)
  if(hasFeature){
    tasks.push(new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 500;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 1024, 500);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          resolve({ name: `04-feature-graphic/${name}-feature-graphic-1024x500.png`, data: bytes });
        } catch(e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(FEATURE_GRAPHIC);
    }));
  }

  // 5. App Icon (512×512)
  if(hasIcon){
    tasks.push(new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 512, 512);
          const dataUrl = canvas.toDataURL('image/png');
          const bytes = dataUrlToUint8Array(dataUrl);
          resolve({ name: `05-app-icon/${name}-app-icon-512x512.png`, data: bytes });
        } catch(e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = ensureSvgDimensions(ICON);
    }));
  }

  Promise.all([Promise.all(tasks), minDelay]).then(([results]) => {
    const files = results.filter(f => f && f.data);
    if(files.length === 0){
      showToast('Error preparing Google Play bundle for ZIP', 'warn');
      return;
    }

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-google-play-all-assets.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Downloaded complete Google Play bundle (${files.length} assets) in 1 ZIP package! ✨`, '⬇️');
  }).catch(err => {
    console.error('Google Play bundle ZIP export error:', err);
    showToast('Failed to generate ZIP archive', 'warn');
  }).finally(() => {
    if(optBtn) optBtn.classList.remove('loading');
    _isZipExporting = false;
  });
}

if($('btnDlAllTablets')){
  $('btnDlAllTablets').onclick = () => downloadAllTabletsScreenshots();
}

