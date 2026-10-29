// Store Preview Studio · Google Play Devices & Tablet Orientation
// --- Google Play Tablet Screenshots (7-inch & 10-inch) ---
let googleDevice = 'phone'; // 'phone' | 'tab7' | 'tab10'
const tabOrient = {tab7:'landscape', tab10:'landscape'};
const MAX_TAB = 8;
const TAB_CFG = {
  tab7:  {name:'7-inch',  min:320,  max:3840, list:'tab7List',  counter:'tab7Counter',  badge:'tab7Badge',  file:'tab7File',  add:'tab7Add',  gal:'galTab7',  dev:'dev-tab7'},
  tab10: {name:'10-inch', min:1080, max:7680, list:'tab10List', counter:'tab10Counter', badge:'tab10Badge', file:'tab10File', add:'tab10Add', gal:'galTab10', dev:'dev-tab10'}
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
  im.onload = () => {
    if(it.meta === meta){
      meta.w = im.naturalWidth;
      meta.h = im.naturalHeight;
      // Alpha channel audit (Google Play Console requires 24-bit PNG or JPEG without alpha)
      if(meta.type !== 'image/jpeg'){
        try {
          const c = document.createElement('canvas');
          c.width = 64; c.height = 64;
          const ctx = c.getContext('2d');
          ctx.drawImage(im, 0, 0, 64, 64);
          const data = ctx.getImageData(0, 0, 64, 64).data;
          for(let i = 3; i < data.length; i += 4){
            if(data[i] < 250){ meta.hasAlpha = true; break; }
          }
        }catch(e){
          // Tainted canvas or environments without full 2d canvas
        }
      }
      renderTablets();
    }
  };
  im.onerror = () => { if(it.meta === meta){ meta.bad = true; renderTablets(); } };
  im.src = ensureSvgDimensions(it.src);
}
function makeTabItem(s){ const it = {src:(s||'').trim(), meta:null}; probeTab(it); return it; }

function tabIssues(key, it){
  const c = TAB_CFG[key], m = it.meta, out = [];
  if(!m) return out;
  if(m.bad) out.push('Image could not be loaded');
  if(m.type && !/^image\/(png|jpeg)$/.test(m.type)) out.push('Must be PNG or JPEG');
  if(m.hasAlpha) out.push('Contains transparency (alpha channel not allowed by Play Console)');
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
    if(!valid.length){
      be.className = 'shot-status-badge warn';
      be.innerHTML = `${SB_INFO}<span><strong>No ${c.name} screenshots yet.</strong> The preview shows placeholders. Upload up to ${MAX_TAB}.</span>`;
    }else if(bad){
      be.className = 'shot-status-badge err';
      be.innerHTML = `${SB_ERR}<span><strong>${bad} of ${valid.length} screenshot${valid.length===1?'':'s'} would be rejected</strong> by Play Console. See details below.</span>`;
    }else{
      be.className = 'shot-status-badge ok';
      be.innerHTML = `${SB_OK}<span><strong>${c.name} tablet assets look good:</strong> ${valid.length} screenshot${valid.length===1?'':'s'}.</span>`;
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
      // Thumbnail Preview with Click-to-Inspect
      const thumb = mk(it.src || PH);
      thumb.style.cursor = 'pointer';
      thumb.title = 'Click to inspect & view details';
      thumb.onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: it.src || PH,
            type: 'tablet',
            store: 'google',
            index: i,
            title: `${c.name} Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              TABS[key][i] = makeTabItem(dataUrl);
              renderTablets();
              saveState();
            }
          });
        }
      };
      r.appendChild(thumb);

      const col = document.createElement('div'); col.className = 'col';
      const head = document.createElement('div'); head.className = 'shot-row-head';

      let tagHtml = '';
      if(it.meta && it.meta.w){
        const probs = tabIssues(key, it);
        const tagClass = probs.length ? 'err' : 'ok';
        const tagText = `${ratioLabel(it.meta.w, it.meta.h)} (${it.meta.w}×${it.meta.h})`;
        tagHtml = `<span class="shot-dim-tag ${tagClass}" style="margin-left:auto" title="${probs.join('; ')}">${tagText}</span>`;
      }else if(it.meta && it.meta.bad){
        tagHtml = `<span class="shot-dim-tag err" style="margin-left:auto">Failed to load</span>`;
      }
      head.innerHTML = `<span class="shot-row-title">Screenshot #${i + 1}</span>${tagHtml}`;

      const act = document.createElement('div'); act.className = 'act';
      act.innerHTML = '<button class="mini" title="Replace with file">' + ICO_UPLOAD + 'Upload</button>' +
        '<button class="mini" title="Inspect / View Details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;vertical-align:middle"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Inspect</button>' +
        '<button class="mini" title="Move Up">↑</button>' +
        '<button class="mini" title="Move Down">↓</button>' +
        '<button class="mini del" title="Delete">&times;</button>';
      const b = act.children;
      b[0].onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key, idx:i}; $(c.file).click(); };
      b[1].onclick = () => {
        if(typeof openImageDetailModal === 'function'){
          openImageDetailModal({
            src: it.src || PH,
            type: 'tablet',
            store: 'google',
            index: i,
            title: `${c.name} Screenshot #${i + 1} Inspector`,
            onReplace: (file, dataUrl) => {
              TABS[key][i] = makeTabItem(dataUrl);
              renderTablets();
              saveState();
            }
          });
        }
      };
      b[2].onclick = () => mvTab(key, i, -1);
      b[3].onclick = () => mvTab(key, i, 1);
      b[4].onclick = () => { TABS[key].splice(i, 1); renderTablets(); saveState(); };
      col.append(head, act);
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
      showToast(`Added ${files.length} ${TAB_CFG[key].name} tablet screenshot${files.length===1?'':'s'}`, 'ok');
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
      readFile(files[0], d => { TABS[key][idx] = makeTabItem(d); renderTablets(); saveState(); showToast('Screenshot replaced', 'ok'); });
    }else{
      tabPick = {key:null, idx:-1};
      addTabFiles(key, files);
    }
  };
  $(c.add).onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; tabPick = {key:null, idx:-1}; $(c.file).click(); };
  const sec = $(c.list).parentElement;
  sec.addEventListener('dragover', e => e.preventDefault());
  sec.addEventListener('drop', e => {
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if(files.length){ e.preventDefault(); addTabFiles(key, files); }
  });
});

function applyTabOrient(){
  Object.keys(TAB_CFG).forEach(k => { const d = $(TAB_CFG[k].dev); if(d) d.classList.toggle('portrait', tabOrient[k] === 'portrait'); });
}
function applyGoogleDevice(){
  const isDual = googleDevice === 'dual' || appleDevice === 'dual';
  document.body.dataset.googleDevice = isDual ? 'phone' : googleDevice;
  document.body.dataset.dual = isDual ? 'true' : 'false';
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === (isDual ? 'dual' : googleDevice)));
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === (isDual ? 'dual' : appleDevice)));
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === (isDual ? 'dual' : 'google')));
  syncAllVtPills();
}
function setGoogleDevice(d, animate = true){
  const nextDev = (d === 'tab7' || d === 'tab10' || d === 'dual') ? d : 'phone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = nextDev === 'dual';
  if(googleDevice === nextDev && document.body.dataset.googleDevice === (nextDual ? 'phone' : nextDev) && wasDual === nextDual){
    syncAllVtPills();
    return;
  }
  const applyState = () => {
    googleDevice = nextDev;
    if(nextDual){
      appleDevice = 'dual';
      document.body.dataset.appleDevice = 'iphone';
    } else if(wasDual && appleDevice === 'dual'){
      appleDevice = 'iphone';
      document.body.dataset.appleDevice = 'iphone';
    }
    applyGoogleDevice();
    saveState();
  };
  if(nextDual || wasDual){
    clearDevTransitions();
    applyState();
    fit();
    syncAllVtPills();
    return;
  }
  transitionDevice('google', nextDev, applyState, animate);
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === nextDev));
  syncAllVtPills();
}
$$('#gdt [data-gd]').forEach(b => b.onclick = () => setGoogleDevice(b.dataset.gd));
function tabStatus(key){
  const v = TABS[key].filter(i => i.src), bad = v.filter(i => tabIssues(key, i).length).length;
  if(!v.length) return 'None uploaded (optional)';
  if(v.length > MAX_TAB) return `${v.length} screenshots - max ${MAX_TAB}`;
  return bad ? `${bad} of ${v.length} would be rejected` : `PASS (${v.length} screenshot${v.length===1?'':'s'})`;
}


