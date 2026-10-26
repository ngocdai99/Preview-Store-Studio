// Store Preview Studio · 3D Spatial Transitions & Store Switcher
// --- Device & Tab Smooth 3D Spatial Animation System ---
let devExitTimer = null;
let devEnterTimer = null;

const APPLE_DEV_ORDER = { iphone: 0, ipad: 1 };
const GOOGLE_DEV_ORDER = { phone: 0, tab7: 1, tab10: 2 };

function getTransitionDirection(fromStore, fromDev, toStore, toDev){
  if(fromStore !== toStore) return 'morph';
  if(fromStore === 'apple'){
    const fromIdx = APPLE_DEV_ORDER[fromDev] ?? 0;
    const toIdx = APPLE_DEV_ORDER[toDev] ?? 0;
    return toIdx >= fromIdx ? 'next' : 'prev';
  } else {
    const fromIdx = GOOGLE_DEV_ORDER[fromDev] ?? 0;
    const toIdx = GOOGLE_DEV_ORDER[toDev] ?? 0;
    return toIdx >= fromIdx ? 'next' : 'prev';
  }
}

const ALL_TRANS_CLASSES = [
  'dev-exit', 'dev-enter',
  'dev-exit-next', 'dev-enter-next',
  'dev-exit-prev', 'dev-enter-prev',
  'dev-exit-morph', 'dev-enter-morph'
];

function clearDevTransitions(){
  if(devExitTimer){ clearTimeout(devExitTimer); devExitTimer = null; }
  if(devEnterTimer){ clearTimeout(devEnterTimer); devEnterTimer = null; }
  $$('.dev').forEach(d => d.classList.remove(...ALL_TRANS_CLASSES));
}

function getActiveDeviceEl(s = store, d = (s === 'apple' ? appleDevice : googleDevice)){
  if(s === 'apple'){
    if(d === 'ipad') return document.querySelector('.dev.ipad');
    return document.querySelector('.dev.apple.single');
  } else {
    if(d === 'tab7') return $('dev-tab7');
    if(d === 'tab10') return $('dev-tab10');
    return document.querySelector('.dev.google');
  }
}

function computeDeviceZoom(s, d){
  const st = document.querySelector('.stage'), m = isM(), pad = m ? 20 : 40;
  const tb = document.querySelector('.stage-toolbar');
  const vt = (tb ? tb.offsetHeight : 40) + (m ? 14 : 18);
  let baseW = 416, baseH = 870;
  if(s === 'apple'){
    if(d === 'ipad'){
      baseW = 750;
      baseH = 980;
    } else {
      baseW = 416;
      baseH = 870;
    }
  } else if(d !== 'phone'){
    const land = tabOrient[d] === 'landscape';
    const [lw, lh] = d === 'tab7' ? [800, 512] : [1060, 676];
    baseW = land ? lw : lh;
    baseH = land ? lh : lw;
  } else {
    baseW = 416;
    baseH = 870;
  }
  const zw = (st.clientWidth - pad) / baseW;
  const zh = m ? 9 : (st.clientHeight - pad - vt) / (baseH + 8);
  return Math.max(0.28, Math.min(1, zw, zh));
}

function syncVtPill(container){
  if(!container) return;
  let pill = container.querySelector('.vt-pill');
  if(!pill){
    pill = document.createElement('span');
    pill.className = 'vt-pill';
    container.prepend(pill);
  }
  const activeBtn = container.querySelector('button.on');
  if(activeBtn && container.offsetParent !== null && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
    pill.style.opacity = '1';
  } else {
    pill.style.opacity = '0';
  }
}

function syncAllVtPills(){
  requestAnimationFrame(() => {
    ['dt', 'gdt', 'vt', 'theme'].forEach(id => {
      const el = $(id);
      if(el) syncVtPill(el);
    });
  });
}

function transitionDevice(targetStore, targetDev, onApply, animate = true){
  const fromEl = getActiveDeviceEl(store, store === 'apple' ? appleDevice : googleDevice);
  const toEl = getActiveDeviceEl(targetStore, targetDev);

  if(!animate || !fromEl || fromEl === toEl || fromEl.offsetParent === null){
    clearDevTransitions();
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  const curDev = store === 'apple' ? appleDevice : googleDevice;
  const dir = getTransitionDirection(store, curDev, targetStore, targetDev);
  const exitClass = 'dev-exit-' + dir;
  const enterClass = 'dev-enter-' + dir;

  clearDevTransitions();

  // Pre-calculate target zoom synchronously so target device NEVER renders unscaled
  const targetZoom = computeDeviceZoom(targetStore, targetDev);
  if(toEl) toEl.style.zoom = targetZoom;

  fromEl.classList.add(exitClass);

  devExitTimer = setTimeout(() => {
    fromEl.classList.remove(exitClass);
    onApply();
    if(toEl){
      toEl.classList.add(enterClass);
      toEl.style.zoom = targetZoom;
      devEnterTimer = setTimeout(() => {
        toEl.classList.remove(enterClass);
      }, 370);
    }
    requestAnimationFrame(() => {
      fit();
      syncAllVtPills();
    });
  }, 160);
}


// --- Store & View Switchers ---
function setStore(s, animate = true){
  if(store === s && document.body.dataset.store === s){
    syncAllVtPills();
    return;
  }

  store = s;
  document.body.dataset.store = s;
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === s));
  $$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== s));
  if($('edTitle')) $('edTitle').textContent = s === 'apple' ? 'App Store Listing Details' : 'Google Play Listing Details';
  syncCategoryUI();

  const iconLabel = $('iconSpecLabel');
  const iconHint = $('iconSpecHint');
  if(iconLabel && iconHint){
    if(s === 'google'){
      iconLabel.innerHTML = 'App Icon (512×512 px) <span class="tag g">GOOGLE</span>';
      iconHint.innerHTML = '32-bit PNG · 512×512 px · Max 1024 KB · sRGB · No rounded corners or drop shadows.';
    } else {
      iconLabel.innerHTML = 'App Icon (1024×1024 px) <span class="tag a">APPLE</span>';
      iconHint.innerHTML = 'PNG · 1024×1024 px · sRGB or Display P3 · 100% Opaque (no alpha) · No rounded corners.';
    }
  }

  // Sync preset icon variant if using preset template
  if(typeof IS_CUSTOM_ICON !== 'undefined' && !IS_CUSTOM_ICON){
    let iconChanged = false;
    if(typeof BLANK_ICON !== 'undefined' && (ICON === BLANK_ICON || (typeof BLANK_ICON_1024 !== 'undefined' && ICON === BLANK_ICON_1024) || (typeof BLANK_ICON_512 !== 'undefined' && ICON === BLANK_ICON_512))){
      if(s === 'apple' && typeof BLANK_ICON_1024 !== 'undefined' && BLANK_ICON_1024){ ICON = BLANK_ICON_1024; iconChanged = true; }
      else if(s === 'google' && typeof BLANK_ICON_512 !== 'undefined' && BLANK_ICON_512){ ICON = BLANK_ICON_512; iconChanged = true; }
    } else if(typeof PRESETS !== 'undefined'){
      for(const k in PRESETS){
        const p = PRESETS[k];
        if(p && (p.icon === ICON || p.icon1024 === ICON || p.icon512 === ICON)){
          if(s === 'apple' && p.icon1024){ ICON = p.icon1024; iconChanged = true; }
          else if(s === 'google' && p.icon512){ ICON = p.icon512; iconChanged = true; }
          break;
        }
      }
    }
    if(iconChanged && typeof renderIcons === 'function') renderIcons();
  }

  // Trigger validation immediately upon store switch
  if(typeof validateAppIcon === 'function') validateAppIcon();
  if(typeof validateScreenshots === 'function') validateScreenshots();

  const targetDev = (s === 'apple' ? appleDevice : googleDevice);

  transitionDevice(s, targetDev, () => {
    document.body.dataset.appleDevice = appleDevice;
    document.body.dataset.googleDevice = googleDevice;

    if(s === 'apple'){
      if($('ipadCard')) $('ipadCard').style.display = SUPPORTS_IPAD ? '' : 'none';
      if(typeof renderIpadShots === 'function') renderIpadShots();
    } else {
      if($('ipadCard')) $('ipadCard').style.display = 'none';
    }

    if(typeof validateAppIcon === 'function') validateAppIcon();
    if(typeof validateScreenshots === 'function') validateScreenshots();
    update();
    saveState();
  }, animate);

  syncAllVtPills();
}

function setView(v){
  $$('#vt button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  syncAllVtPills();
  $$('.phone [data-v]').forEach(e => {
    if(e.dataset.v === v){
      e.style.display = 'block';
      e.classList.remove('view-enter');
      void e.offsetWidth; // force reflow for smooth re-animation
      e.classList.add('view-enter');
      setTimeout(() => e.classList.remove('view-enter'), 240);
    } else {
      e.style.display = 'none';
    }
  });
  document.querySelectorAll('.phone.apple .tab').forEach(tabBar => {
    const items = tabBar.querySelectorAll(':scope > div');
    if(items.length >= 5){
      items.forEach(t => t.classList.remove('on'));
      if(v === 'search'){
        items[4].classList.add('on');
      } else {
        items[2].classList.add('on');
      }
    }
  });
  if(typeof syncAppleNavScroll === 'function') syncAppleNavScroll();
}

$$('.seg button').forEach(b => b.onclick = () => setStore(b.dataset.s));
$$('#vt button').forEach(b => b.onclick = () => setView(b.dataset.v));

// Mockup Light / Dark theme controller
function setDeviceTheme(theme, save = true){
  const t = theme === 'dark' ? 'dark' : 'light';
  $$('.phone').forEach(p => p.dataset.theme = t);
  const btnL = $('themeLight');
  const btnD = $('themeDark');
  if(btnL) btnL.classList.toggle('on', t === 'light');
  if(btnD) btnD.classList.toggle('on', t === 'dark');
  syncVtPill($('theme'));
  if(save && typeof saveState === 'function') saveState();
}

if($('themeLight')) $('themeLight').onclick = () => setDeviceTheme('light');
if($('themeDark')) $('themeDark').onclick = () => setDeviceTheme('dark');
if($('theme') && !$('themeLight')){
  $('theme').onclick = () => {
    const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
    setDeviceTheme(cur === 'dark' ? 'light' : 'dark');
  };
}
// Sync theme segment indicator to initial mockup theme
setTimeout(() => {
  const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
  setDeviceTheme(cur, false);
}, 0);

