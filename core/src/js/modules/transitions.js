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
  if(document.body) document.body.classList.remove('is-animating-store');
  const stage = $('stageDevices') || document.querySelector('.stage');
  if(stage) {
    stage.style.minHeight = '';
    stage.style.position = '';
  }
  const stageEl = document.querySelector('.stage');
  if(stageEl) stageEl.style.minHeight = '';
  const dt = $('dt');
  const gdt = $('gdt');
  if(dt) dt.style.display = '';
  if(gdt) gdt.style.display = '';
  const da = document.querySelector('.dev.apple.single');
  const dg = document.querySelector('.dev.google');
  if(da){
    da.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    da.style.opacity = '';
    da.style.pointerEvents = '';
    da.style.transition = '';
    da.style.transform = '';
    da.style.transformOrigin = '';
    da.style.position = '';
    da.style.left = '';
    da.style.top = '';
    da.style.margin = '';
    da.style.zIndex = '';
  }
  if(dg){
    dg.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
    dg.style.opacity = '';
    dg.style.pointerEvents = '';
    dg.style.transition = '';
    dg.style.transform = '';
    dg.style.transformOrigin = '';
    dg.style.position = '';
    dg.style.left = '';
    dg.style.top = '';
    dg.style.margin = '';
    dg.style.zIndex = '';
  }
  $$('.dev').forEach(d => {
    d.classList.remove(...ALL_TRANS_CLASSES, 'is-hidden-trans');
  });
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
  const st = document.querySelector('.stage');
  if(!st) return 1;
  const m = isM();
  const padW = m ? 24 : 48;
  const padH = m ? 16 : 28;
  const tb = document.querySelector('.stage-toolbar');
  const bb = document.querySelector('.stage-bottom-bar');
  const isBbVis = bb && bb.offsetHeight > 0 && (!bb.style.display || bb.style.display !== 'none');
  const bbH = isBbVis ? bb.offsetHeight + 4 : 0;
  const vt = (tb ? tb.offsetHeight : 38) + bbH + (m ? 12 : 20) + 40;
  const isDual = d === 'dual' || document.body.dataset.dual === 'true';
  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    if(m){
      baseW = isLand ? 870 : 416;
      baseH = (isLand ? 416 : 870) * 2 + 56;
    }else{
      baseW = (isLand ? 870 : 416) * 2 + 28;
      baseH = isLand ? 416 : 870;
    }
  } else if(s === 'apple'){
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
  const zw = (st.clientWidth - padW) / baseW;
  const zh = m ? 9 : (st.clientHeight - padH - vt) / (baseH + 8);
  return Math.max(0.28, Math.min(1, zw, zh));
}

function syncVtPill(container){
  if(!container || container.classList.contains('menu') || container.classList.contains('stage-device-dropdown')) return;
  let pill = container.querySelector('.vt-pill');
  if(!pill){
    pill = document.createElement('span');
    pill.className = 'vt-pill';
    container.prepend(pill);
  }
  const activeBtn = container.querySelector('button.on');
  const isVertical = container.classList.contains('vt-vertical');
  if(activeBtn && container.offsetParent !== null && activeBtn.offsetWidth > 0){
    if(isVertical){
      pill.style.width = 'calc(100% - 8px)';
      pill.style.height = activeBtn.offsetHeight + 'px';
      pill.style.transform = 'translateY(' + activeBtn.offsetTop + 'px)';
    } else {
      pill.style.width = activeBtn.offsetWidth + 'px';
      pill.style.height = '';
      pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
    }
    pill.style.opacity = '1';
  } else {
    pill.style.opacity = '0';
  }
}

function syncSegPill(targetStore){
  const seg = document.querySelector('.seg');
  if(!seg) return;
  const pill = seg.querySelector('.pill');
  const activeBtn = seg.querySelector('button.on');
  const s = (typeof targetStore === 'string' && targetStore) || (activeBtn && activeBtn.dataset ? activeBtn.dataset.s : null);
  if(pill && s){
    pill.classList.remove('is-apple', 'is-google', 'is-dual');
    pill.classList.add('is-' + s);
    seg.dataset.store = s;
    pill.dataset.store = s;
  }
  if(pill && activeBtn && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    pill.style.opacity = '1';
  }
}

function syncAllVtPills(){
  requestAnimationFrame(() => {
    ['dt', 'gdt', 'vt', 'theme'].forEach(id => {
      const el = $(id);
      if(el) syncVtPill(el);
    });
    syncSegPill();
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
  });
}

function syncDeviceDropdowns() {
  const curA = (typeof appleDevice !== 'undefined' && appleDevice && appleDevice !== 'dual') ? appleDevice : 'iphone';
  const curG = (typeof googleDevice !== 'undefined' && googleDevice && googleDevice !== 'dual') ? googleDevice : 'phone';

  const lblA = $('appleDeviceLabel');
  if (lblA) lblA.textContent = curA === 'ipad' ? 'iPad' : 'iPhone';
  const icoA = $('appleDeviceIco');
  if (icoA) {
    if (curA === 'ipad') {
      icoA.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2.5"></rect><circle cx="12" cy="5" r="0.8" fill="currentColor"></circle><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    } else {
      icoA.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"></rect><line x1="10.5" y1="5" x2="13.5" y2="5"></line><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    }
  }

  const lblG = $('googleDeviceLabel');
  if (lblG) lblG.textContent = curG === 'tab7' ? '7" Tablet' : (curG === 'tab10' ? '10" Tablet' : 'Phone');
  const icoG = $('googleDeviceIco');
  if (icoG) {
    if (curG === 'tab10') {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2.5"></rect><line x1="10" y1="17" x2="14" y2="17"></line></svg>';
    } else if (curG === 'tab7') {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2.5"></rect><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    } else {
      icoG.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"></rect><circle cx="12" cy="5" r="0.8" fill="currentColor"></circle><line x1="10" y1="19" x2="14" y2="19"></line></svg>';
    }
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', syncSegPill);
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
  if(toEl) {
    toEl.style.zoom = targetZoom;
    toEl.style.setProperty('--dev-zoom', targetZoom);
  }
  document.documentElement.style.setProperty('--dev-zoom', targetZoom);

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
function transitionStoreMode(fromMode, toMode, onApply, animate = true){
  const devApple = document.querySelector('.dev.apple.single');
  const devGoogle = document.querySelector('.dev.google');
  const stage = $('stageDevices') || document.querySelector('.stage');

  clearDevTransitions();

  if(!animate || !devApple || !devGoogle || !stage || fromMode === toMode){
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  // If currently using iPad, Android tablet, or mobile viewport, skip 3D dual slide and apply cleanly
  if((fromMode === 'apple' && appleDevice === 'ipad') || (toMode === 'apple' && appleDevice === 'ipad') ||
     (fromMode === 'google' && googleDevice !== 'phone') || (toMode === 'google' && googleDevice !== 'phone') ||
     (typeof isM === 'function' && isM())){
    onApply();
    fit();
    syncAllVtPills();
    return;
  }

  // Prevent CSS rules from abruptly hiding elements while transitioning
  document.body.classList.add('is-animating-store');

  const stageRect = stage.getBoundingClientRect();
  const stageCenterX = stageRect.left + stageRect.width / 2;

  if (fromMode === 'apple' && toMode === 'google') {
    // Single Apple -> Single Google: Apple glides left, Google enters from right
    devGoogle.classList.add('is-hidden-trans');
    devApple.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
    devExitTimer = setTimeout(function () {
      devApple.classList.add('is-hidden-trans');
      onApply();
      devGoogle.classList.remove('is-hidden-trans');
      devGoogle.style.transition = 'none';
      devGoogle.style.opacity = '0';
      devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
      void devGoogle.offsetWidth;
      devGoogle.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
      devGoogle.style.opacity = '1';
      devGoogle.style.transform = 'translate3d(0, 0, 0) scale(1)';
      devEnterTimer = setTimeout(function () {
        clearDevTransitions();
        fit();
        syncAllVtPills();
      }, 360);
    }, 190);
  } else if (fromMode === 'google' && toMode === 'apple') {
    // Single Google -> Single Apple: Google glides right, Apple enters from left
    devApple.classList.add('is-hidden-trans');
    devGoogle.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
    devExitTimer = setTimeout(function () {
      devGoogle.classList.add('is-hidden-trans');
      onApply();
      devApple.classList.remove('is-hidden-trans');
      devApple.style.transition = 'none';
      devApple.style.opacity = '0';
      devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
      void devApple.offsetWidth;
      devApple.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
      devApple.style.opacity = '1';
      devApple.style.transform = 'translate3d(0, 0, 0) scale(1)';
      devEnterTimer = setTimeout(function () {
        clearDevTransitions();
        fit();
        syncAllVtPills();
      }, 360);
    }, 190);
  } else if (fromMode === 'dual' && toMode === 'apple') {
    // Dual -> Apple: FLIP transition - Apple glides seamlessly to exact center, Google softly dissolves
    const stageEl = document.querySelector('.stage') || stage;
    const stRect = stageEl.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;

    // 1. Lock stage overflow to prevent any scrollbar appearance/disappearance
    stageEl.style.overflow = 'hidden';
    stageEl.style.minHeight = stRect.height + 'px';

    // 2. Float Google phone out-of-flow relative to .stage at its exact screen coordinates
    devGoogle.style.position = 'absolute';
    devGoogle.style.left = (firstG.left - stRect.left + stageEl.scrollLeft) + 'px';
    devGoogle.style.top = (firstG.top - stRect.top + stageEl.scrollTop) + 'px';
    devGoogle.style.margin = '0';
    devGoogle.style.pointerEvents = 'none';
    devGoogle.style.zIndex = '5';
    devGoogle.style.zoom = zoomG;

    // 3. Put Apple phone into its final single layout & zoom immediately
    onApply();
    fit();

    // 4. Measure Apple phone's final centered position & zoom
    const lastA = devApple.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const centerX_first = firstA.left + firstA.width / 2;
    const centerY_first = firstA.top + firstA.height / 2;
    const centerX_last = lastA.left + lastA.width / 2;
    const centerY_last = lastA.top + lastA.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomA;
    const deltaY = (centerY_first - centerY_last) / zoomA;

    // 5. Invert Apple phone to its starting visual position with pure translation (zero matrix scale distortion)
    devApple.style.transition = 'none';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Re-assert Google phone's initial visual state
    devGoogle.style.transition = 'none';
    devGoogle.style.opacity = '1';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';

    void devApple.offsetWidth; // flush layout

    // 6. Play silky smooth glide and fade together
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(0, 0, 0)';

    devGoogle.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.94) translate3d(0, 8px, 0)';

    devExitTimer = setTimeout(function () {
      devGoogle.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'dual' && toMode === 'google') {
    // Dual -> Google: FLIP transition - Google glides seamlessly to exact center, Apple softly dissolves
    const stageEl = document.querySelector('.stage') || stage;
    const stRect = stageEl.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;

    // 1. Lock stage overflow to prevent any scrollbar appearance/disappearance
    stageEl.style.overflow = 'hidden';
    stageEl.style.minHeight = stRect.height + 'px';

    // 2. Float Apple phone out-of-flow relative to .stage at its exact screen coordinates
    devApple.style.position = 'absolute';
    devApple.style.left = (firstA.left - stRect.left + stageEl.scrollLeft) + 'px';
    devApple.style.top = (firstA.top - stRect.top + stageEl.scrollTop) + 'px';
    devApple.style.margin = '0';
    devApple.style.pointerEvents = 'none';
    devApple.style.zIndex = '5';
    devApple.style.zoom = zoomA;

    // 3. Put Google phone into its final single layout & zoom immediately
    onApply();
    fit();

    // 4. Measure Google phone's final centered position & zoom
    const lastG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const centerX_first = firstG.left + firstG.width / 2;
    const centerY_first = firstG.top + firstG.height / 2;
    const centerX_last = lastG.left + lastG.width / 2;
    const centerY_last = lastG.top + lastG.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomG;
    const deltaY = (centerY_first - centerY_last) / zoomG;

    // 5. Invert Google phone to its starting visual position with pure translation (zero matrix scale distortion)
    devGoogle.style.transition = 'none';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Re-assert Apple phone's initial visual state
    devApple.style.transition = 'none';
    devApple.style.opacity = '1';
    devApple.style.transform = 'translate3d(0, 0, 0)';

    void devGoogle.offsetWidth; // flush layout

    // 6. Play silky smooth glide and fade together
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';

    devApple.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.94) translate3d(0, 8px, 0)';

    devExitTimer = setTimeout(function () {
      devApple.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'apple' && toMode === 'dual') {
    // Single Apple -> Dual: Apple glides from center to left, Google blooms in
    const firstA = devApple.getBoundingClientRect();

    devApple.classList.remove('is-hidden-trans');
    devGoogle.classList.remove('is-hidden-trans');
    onApply();
    fit();

    const lastA = devApple.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const deltaX = (firstA.left - lastA.left) / zoomA;
    const deltaY = (firstA.top - lastA.top) / zoomA;

    // Invert Apple to starting center position
    devApple.style.transition = 'none';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Initial state for Google blooming in
    devGoogle.style.transition = 'none';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

    void devApple.offsetWidth; // flush layout

    // Play smooth glide and bloom together
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(0, 0, 0)';
    devGoogle.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '1';
    devGoogle.style.transform = 'scale(1) translate3d(0, 0, 0)';

    devEnterTimer = setTimeout(function () {
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 440);
  } else if (fromMode === 'google' && toMode === 'dual') {
    // Single Google -> Dual: Google glides from center to right, Apple blooms in
    const firstG = devGoogle.getBoundingClientRect();

    devApple.classList.remove('is-hidden-trans');
    devGoogle.classList.remove('is-hidden-trans');
    onApply();
    fit();

    const lastG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const deltaX = (firstG.left - lastG.left) / zoomG;
    const deltaY = (firstG.top - lastG.top) / zoomG;

    // Invert Google to starting center position
    devGoogle.style.transition = 'none';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

    // Initial state for Apple blooming in
    devApple.style.transition = 'none';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

    void devGoogle.offsetWidth; // flush layout

    // Play smooth glide and bloom together
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(0, 0, 0)';
    devApple.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '1';
    devApple.style.transform = 'scale(1) translate3d(0, 0, 0)';

    devEnterTimer = setTimeout(function () {
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 440);
  } else {
    onApply();
    fit();
    syncAllVtPills();
  }
}

function setStore(s, animate = true, preserveDual = false){
  const fromMode = document.body.dataset.dual === 'true' ? 'dual' : store;
  const toMode = s;

  if (document.body.dataset.dual === 'true' && !preserveDual) {
    document.body.dataset.dual = 'false';
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.remove('on');
      btn.setAttribute('aria-checked', 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = 'none';
  }

  // Set UI store state immediately so pill and toolbar tabviews #dt and #gdt switch instantly (<1ms)
  document.body.dataset.uiStore = s;

  // 1. UPDATE TABVIEW SEGMENT CONTROL BUTTONS & PILL IMMEDIATELY (<1ms)
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === s));
  syncSegPill(s);

  // Immediately update Phone Screenshots description and counter for the new store (<1ms)
  const hintEl = $('shotHint');
  if(hintEl){
    if(s === 'apple'){
      hintEl.innerHTML = 'Drag and drop to add assets or choose from your Asset Library for iPhone 6.1" or 6.3" displays. Supported sizes for app previews include 1920 × 886px and 886 × 1920px. For app screenshots, supported sizes include 2556 × 1179px, 1179 × 2556px, 2622 × 1206px and 1206 × 2622px.<br>• PNG or JPEG, no alpha transparency.<br>• Drag ⠿ handle to reorder.';
    } else {
      hintEl.innerHTML = '<strong>Google Play:</strong> Upload 2–8 screenshots (16:9 or 9:16 aspect ratio, each side between 320 px and 3,840 px).<br>• PNG or JPEG, up to 8 MB each.<br>• Drag ⠿ handle to reorder.';
    }
  }
  const counterEl = $('shotCounter');
  const previewCounterEl = $('appPreviewCounter');
  if(counterEl && typeof SHOTS !== 'undefined'){
    const validCount = SHOTS.filter(sh => sh && sh.trim()).length;
    const maxAllowed = s === 'apple' ? 10 : 8;
    const minRequired = s === 'apple' ? 1 : 2;
    if(s === 'apple'){
      const appPreviewCount = Math.min(validCount, 3);
      if(previewCounterEl){
        previewCounterEl.style.display = 'inline-flex';
        previewCounterEl.textContent = `${appPreviewCount} of 3 App Previews`;
        previewCounterEl.title = 'Ảnh sẽ xuất hiện trên app store';
      }
      counterEl.textContent = `${validCount} of ${maxAllowed} App Screenshots`;
    } else {
      if(previewCounterEl){
        previewCounterEl.style.display = 'none';
      }
      counterEl.textContent = `${validCount} of ${maxAllowed} screenshots`;
    }
    counterEl.className = 'cc' + (validCount > 0 && validCount < minRequired ? ' warn' : validCount > maxAllowed ? ' err' : '');
    const addBtn = $('addShot');
    if(addBtn){
      const atLimit = SHOTS.length >= maxAllowed;
      addBtn.disabled = atLimit;
      if(atLimit) addBtn.title = `${s === 'apple' ? 'App Store' : 'Google Play'} allows a maximum of ${maxAllowed} screenshots`;
      else addBtn.removeAttribute('title');
    }
  }

  if(fromMode === toMode){
    syncAllVtPills();
    return;
  }

  // 2. IMMEDIATELY SELECT DEVICE ON TABVIEW WITHOUT WAITING FOR ANIMATION (<1ms)
  let targetAppleDev = (appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
  let targetGoogleDev = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;

  // Immediately toggle active class on device selector buttons
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === targetAppleDev));
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === targetGoogleDev));

  // Show/hide device selector tabview immediately
  if (s === 'apple') {
    if ($('dt')) $('dt').style.display = 'flex';
    if ($('gdt')) $('gdt').style.display = 'none';
  } else if (s === 'google') {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'flex';
  }

  // Immediately update editor fields visibility and title for instant feedback
  $$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== s));
  if (s === 'apple') {
    if ($('ipadCard')) $('ipadCard').style.display = '';
  } else {
    if ($('ipadCard')) $('ipadCard').style.display = 'none';
  }
  if($('edTitle')) $('edTitle').textContent = 'App Identity';
  syncCategoryUI();
  if (typeof syncAgeUI === 'function') syncAgeUI();

  // Immediately synchronize active device tabview pill (<16ms)
  requestAnimationFrame(() => {
    if(s === 'apple') syncVtPill($('dt'));
    else if(s === 'google') syncVtPill($('gdt'));
    syncAllVtPills();
  });

  const applyStoreMode = () => {
    if (!preserveDual) {
      document.body.dataset.dual = 'false';
      if(appleDevice === 'dual') appleDevice = 'iphone';
      if(googleDevice === 'dual') googleDevice = 'phone';
    }
    store = s;
    document.body.dataset.store = s;
    document.body.dataset.appleDevice = (appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
    document.body.dataset.googleDevice = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;

    const isDual = document.body.dataset.dual === 'true';
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.toggle('on', isDual);
      btn.setAttribute('aria-checked', isDual ? 'true' : 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = isDual ? 'inline-flex' : 'none';

    const iconLabel = $('iconSpecLabel');
    const iconHint = $('iconSpecHint');
    if(iconLabel && iconHint){
      if(s === 'google'){
        iconLabel.innerHTML = 'App Icon (512×512 px) <span class="tag g">GOOGLE</span>';
        iconHint.innerHTML = '32-bit PNG · 1:1 Square · Max 1024 KB';
      } else {
        iconLabel.innerHTML = 'App Icon (1024×1024 px) <span class="tag a">APPLE</span>';
        iconHint.innerHTML = 'PNG · 1:1 Square · 100% Opaque';
      }
    }

      // Sync icon variant according to active store
      let iconChanged = false;
      if(typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON){
        if(s === 'google'){
          if(typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512 && ICON !== CUSTOM_ICON_512){
            ICON = CUSTOM_ICON_512;
            iconChanged = true;
          } else if(typeof ICON === 'string' && ICON.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(ICON)){
            const gIcon = ICON.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png');
            if(ICON !== gIcon){
              if(typeof CUSTOM_ICON_1024 !== 'undefined' && !CUSTOM_ICON_1024) CUSTOM_ICON_1024 = ICON;
              ICON = gIcon;
              if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = gIcon;
              iconChanged = true;
            }
          } else if(typeof downscaleIconTo512 === 'function' && ICON && (!CUSTOM_ICON_512 || CUSTOM_ICON_512 === ICON)){
            if(typeof CUSTOM_ICON_1024 !== 'undefined' && !CUSTOM_ICON_1024) CUSTOM_ICON_1024 = ICON;
            downscaleIconTo512(ICON, d512 => {
              if(d512 && d512 !== ICON){
                if(typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
                if(store === 'google'){
                  ICON = d512;
                  if(typeof renderIcons === 'function') renderIcons();
                  if(typeof validateAppIcon === 'function') validateAppIcon();
                }
              }
            });
          }
        } else if(s === 'apple'){
          if(typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024 && ICON !== CUSTOM_ICON_1024){
            ICON = CUSTOM_ICON_1024;
            iconChanged = true;
          } else if(typeof ICON === 'string' && ICON.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(ICON)){
            const aIcon = ICON.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png');
            if(ICON !== aIcon){
              if(typeof CUSTOM_ICON_512 !== 'undefined' && !CUSTOM_ICON_512) CUSTOM_ICON_512 = ICON;
              ICON = aIcon;
              if(typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = aIcon;
              iconChanged = true;
            }
          }
        }
      } else {
        // Preset icon variant sync
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
      }

      if(iconChanged && typeof renderIcons === 'function'){
        renderIcons();
      } else if(typeof validateAppIcon === 'function'){
        validateAppIcon();
      }

      if(s === 'apple'){
        if($('ipadCard')) $('ipadCard').style.display = '';
      } else {
        if($('ipadCard')) $('ipadCard').style.display = 'none';
      }
      if(typeof validateScreenshots === 'function') validateScreenshots();
      if(typeof validateTabletShots === 'function') validateTabletShots();
      if(typeof renderShots === 'function') renderShots();
    if(typeof saveState === 'function') saveState(false);
  };

  transitionStoreMode(fromMode, toMode, applyStoreMode, animate);
}

function setView(v, force = false){
  const stageMenu = $('vt');
  if(stageMenu && stageMenu.classList.contains('show')) stageMenu.classList.remove('show');

  const activeBtn = document.querySelector('#vt button[data-v].on') || document.querySelector('#vt button.on');
  const activeView = activeBtn ? activeBtn.dataset.v : null;
  if (!force && activeView === v) return;

  $$('#vt button[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v));

  // Maintain Dual Phone selected state in comparison section
  const isDual = document.body.dataset.dual === 'true';
  const btnDual = $('btnDualPhone');
  if (btnDual) {
    btnDual.classList.toggle('on', isDual);
    btnDual.setAttribute('aria-checked', isDual ? 'true' : 'false');
  }
  const badge = $('stageDualBadge');
  if (badge) badge.style.display = isDual ? 'inline-flex' : 'none';

  syncAllVtPills();

  // Sync stage view dropdown label and icon
  const lbl = $('stageViewLabel');
  if(lbl) lbl.textContent = v === 'search' ? 'Search Result' : 'Detail View';
  const ico = $('stageViewIco');
  if(ico){
    if(v === 'search'){
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.5" y1="15.5" x2="21" y2="21"></line></svg>';
    } else {
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><rect x="7" y="7" width="4" height="4" rx="1"></rect><line x1="14" y1="7.5" x2="17" y2="7.5"></line><line x1="14" y1="10.5" x2="16" y2="10.5"></line><line x1="7" y1="15" x2="17" y2="15"></line><line x1="7" y1="18" x2="13" y2="18"></line></svg>';
    }
  }

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
  document.querySelectorAll('.phone.google .gnav').forEach(navBar => {
    const items = navBar.querySelectorAll(':scope > div');
    if(items.length >= 4){
      items.forEach(t => t.classList.remove('on'));
      if(v === 'search'){
        items[2].classList.add('on');
      } else {
        items[1].classList.add('on');
      }
    }
  });
  if(typeof syncAppleNavScroll === 'function') syncAppleNavScroll();
}

$$('.seg button').forEach(b => b.onclick = () => setStore(b.dataset.s));
$$('#vt button[data-v]').forEach(b => b.onclick = () => setView(b.dataset.v));

// Dual Phone Comparison Toggle on Stage Bottom Bar
function toggleDualPhone(forceState) {
  const isCurrentlyDual = document.body.dataset.dual === 'true';
  const nextDual = typeof forceState === 'boolean' ? forceState : !isCurrentlyDual;

  const btn = $('btnDualPhone');
  if (btn) {
    btn.classList.toggle('on', nextDual);
    btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
  }
  const badge = $('stageDualBadge');
  if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';

  const activeStore = (typeof store !== 'undefined' && (store === 'apple' || store === 'google')) ? store : 'apple';

  const applyDualState = () => {
    document.body.dataset.dual = nextDual ? 'true' : 'false';
    if (nextDual) {
      appleDevice = 'dual';
      googleDevice = 'dual';
    } else {
      appleDevice = 'iphone';
      googleDevice = 'phone';
    }
    document.body.dataset.appleDevice = 'iphone';
    document.body.dataset.googleDevice = 'phone';
    if (btn) {
      btn.classList.toggle('on', nextDual);
      btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
    }
    if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';

    // Auto select Phone on device selector
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === 'iphone'));
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === 'phone'));

    // Keep the active device selector visible
    if (activeStore === 'apple') {
      if ($('dt')) $('dt').style.display = 'flex';
      if ($('gdt')) $('gdt').style.display = 'none';
      if ($('dt')) syncVtPill($('dt'));
    } else {
      if ($('dt')) $('dt').style.display = 'none';
      if ($('gdt')) $('gdt').style.display = 'flex';
      if ($('gdt')) syncVtPill($('gdt'));
    }

    if (typeof renderIcons === 'function') renderIcons();
    if (typeof renderShots === 'function') renderShots();
    if (typeof update === 'function') update();
    if (typeof fit === 'function') fit();
    syncAllVtPills();
    if (typeof saveState === 'function') saveState(false);
  };

  // Immediate device selector update (<1ms)
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === 'iphone'));
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === 'phone'));
  if (activeStore === 'apple') {
    if ($('dt')) $('dt').style.display = 'flex';
    if ($('gdt')) $('gdt').style.display = 'none';
    if ($('dt')) syncVtPill($('dt'));
  } else {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'flex';
    if ($('gdt')) syncVtPill($('gdt'));
  }
  syncAllVtPills();

  if (typeof transitionStoreMode === 'function') {
    if (nextDual) {
      transitionStoreMode(activeStore, 'dual', applyDualState);
    } else {
      transitionStoreMode('dual', activeStore, applyDualState);
    }
  } else {
    applyDualState();
  }
}

function setupHoverDropdown(containerId, btnId, menuId) {
  const container = $(containerId);
  const btn = $(btnId);
  const menu = $(menuId);
  if (!container || !menu) return;

  let closeTimer = null;

  container.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    $$('.menu').forEach(m => { if (m !== menu) m.classList.remove('show'); });
    menu.classList.add('show');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  });

  container.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => {
      menu.classList.remove('show');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }, 150);
  });

  menu.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      menu.classList.remove('show');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
}

if ($('btnStageView')) {
  setupDropdown('btnStageView', 'vt');
  setupHoverDropdown('stageViewDropdown', 'btnStageView', 'vt');
}

if ($('btnAppleDevice')) {
  setupDropdown('btnAppleDevice', 'menuAppleDevice');
  setupHoverDropdown('dt', 'btnAppleDevice', 'menuAppleDevice');
}

if ($('btnGoogleDevice')) {
  setupDropdown('btnGoogleDevice', 'menuGoogleDevice');
  setupHoverDropdown('gdt', 'btnGoogleDevice', 'menuGoogleDevice');
}

if ($('btnExport')) {
  setupHoverDropdown('workspaceExportDropdown', 'btnExport', 'menuExport');
}

if ($('btnDualPhone')) {
  $('btnDualPhone').onclick = () => {
    toggleDualPhone();
    const stageMenu = $('vt');
    if (stageMenu) stageMenu.classList.remove('show');
  };
}

// Auto-close stage view dropdown whenever any item is clicked
$$('#vt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('vt');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

// Auto-close Apple & Google device dropdowns when item is clicked
$$('#dt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('menuAppleDevice');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

$$('#gdt .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const stageMenu = $('menuGoogleDevice');
    if (stageMenu) stageMenu.classList.remove('show');
  });
});

// Mockup Light / Dark theme controller
function setDeviceTheme(theme, save = true){
  const t = theme === 'dark' ? 'dark' : 'light';
  $$('.phone').forEach(p => p.dataset.theme = t);
  const btnL = $('themeLight');
  const btnD = $('themeDark');
  if(btnL) btnL.classList.toggle('on', t === 'light');
  if(btnD) btnD.classList.toggle('on', t === 'dark');
  syncVtPill($('theme'));
  try{
    localStorage.setItem('store_preview_studio_device_theme', t);
  }catch(e){}
  if(save && typeof saveState === 'function') saveState(false);
}

if($('themeLight')) $('themeLight').onclick = () => setDeviceTheme('light');
if($('themeDark')) $('themeDark').onclick = () => setDeviceTheme('dark');
if($('theme') && !$('themeLight')){
  $('theme').onclick = () => {
    const cur = document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light';
    setDeviceTheme(cur === 'dark' ? 'light' : 'dark');
  };
}

// Sync theme segment indicator to saved or initial mockup theme
function initDeviceTheme(){
  let saved = null;
  try{
    saved = localStorage.getItem('store_preview_studio_device_theme');
  }catch(e){}
  const defaultTheme = (typeof window !== 'undefined' && !!window.SPS_DEMO_MODE) || document.documentElement.dataset.ui === 'dark' ? 'dark' : 'light';
  const cur = saved || (document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || defaultTheme) : defaultTheme);
  setDeviceTheme(cur, false);
}
initDeviceTheme();
setTimeout(initDeviceTheme, 0);

