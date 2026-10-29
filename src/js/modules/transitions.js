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
  const st = document.querySelector('.stage'), m = isM(), pad = m ? 20 : 40;
  const tb = document.querySelector('.stage-toolbar');
  const bb = document.querySelector('.stage-bottom-bar');
  const bbH = (bb && bb.offsetHeight > 0) ? bb.offsetHeight + 14 : 54;
  const vt = (tb ? tb.offsetHeight : 40) + bbH + (m ? 14 : 18) + 44;
  const isDual = d === 'dual' || document.body.dataset.dual === 'true';
  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    baseW = (isLand ? 870 : 416) * 2 + 28;
    baseH = isLand ? 416 : 870;
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

function syncSegPill(targetStore){
  const seg = document.querySelector('.seg');
  if(!seg) return;
  const pill = seg.querySelector('.pill');
  const activeBtn = seg.querySelector('button.on');
  if(pill && activeBtn && activeBtn.offsetWidth > 0){
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    pill.style.opacity = '1';
    const s = targetStore || (activeBtn.dataset ? activeBtn.dataset.s : null);
    if(s){
      pill.classList.remove('is-apple', 'is-google', 'is-dual');
      pill.classList.add('is-' + s);
    }
  }
}

function syncAllVtPills(){
  requestAnimationFrame(() => {
    ['dt', 'gdt', 'vt', 'theme'].forEach(id => {
      const el = $(id);
      if(el) syncVtPill(el);
    });
    syncSegPill();
  });
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

  // If currently using iPad or Android tablet, skip 3D dual slide and apply cleanly
  if((fromMode === 'apple' && appleDevice === 'ipad') || (toMode === 'apple' && appleDevice === 'ipad') ||
     (fromMode === 'google' && googleDevice !== 'phone') || (toMode === 'google' && googleDevice !== 'phone')){
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
    const stageDevices = $('stageDevices') || document.querySelector('.stage-devices') || stage;
    const sdRect = stageDevices.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;

    // 1. Float Google phone out-of-flow at its exact screen coordinates so Apple phone can center
    stageDevices.style.position = 'relative';
    devGoogle.style.position = 'absolute';
    devGoogle.style.left = (firstG.left - sdRect.left) + 'px';
    devGoogle.style.top = (firstG.top - sdRect.top) + 'px';
    devGoogle.style.margin = '0';
    devGoogle.style.pointerEvents = 'none';
    devGoogle.style.zIndex = '5';
    devGoogle.style.zoom = zoomG;

    // 2. Put Apple phone into its final single layout & zoom
    onApply();
    fit();

    // 3. Measure Apple phone's final centered position & zoom
    const lastA = devApple.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
    const centerX_first = firstA.left + firstA.width / 2;
    const centerY_first = firstA.top + firstA.height / 2;
    const centerX_last = lastA.left + lastA.width / 2;
    const centerY_last = lastA.top + lastA.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomA;
    const deltaY = (centerY_first - centerY_last) / zoomA;
    const scaleInit = lastA.width > 0 ? (firstA.width / lastA.width) : 1;

    // 4. Invert Apple phone to its starting visual position
    devApple.style.transition = 'none';
    devApple.style.transformOrigin = 'center center';
    devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)' + (Math.abs(scaleInit - 1) > 0.01 ? ' scale(' + scaleInit + ')' : '');

    // Re-assert Google phone's initial visual state
    devGoogle.style.transition = 'none';
    devGoogle.style.opacity = '1';
    devGoogle.style.transform = 'translate3d(0, 0, 0) scale(1)';

    void devApple.offsetWidth; // flush layout

    // 5. Play silky smooth glide and fade together
    devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.transform = 'translate3d(0, 0, 0) scale(1)';

    devGoogle.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.opacity = '0';
    devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

    devExitTimer = setTimeout(function () {
      devGoogle.classList.add('is-hidden-trans');
      clearDevTransitions();
      fit();
      syncAllVtPills();
    }, 420);
  } else if (fromMode === 'dual' && toMode === 'google') {
    // Dual -> Google: FLIP transition - Google glides seamlessly to exact center, Apple softly dissolves
    const stageDevices = $('stageDevices') || document.querySelector('.stage-devices') || stage;
    const sdRect = stageDevices.getBoundingClientRect();
    const firstA = devApple.getBoundingClientRect();
    const firstG = devGoogle.getBoundingClientRect();
    const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;

    // 1. Float Apple phone out-of-flow at its exact screen coordinates so Google phone can center
    stageDevices.style.position = 'relative';
    devApple.style.position = 'absolute';
    devApple.style.left = (firstA.left - sdRect.left) + 'px';
    devApple.style.top = (firstA.top - sdRect.top) + 'px';
    devApple.style.margin = '0';
    devApple.style.pointerEvents = 'none';
    devApple.style.zIndex = '5';
    devApple.style.zoom = zoomA;

    // 2. Put Google phone into its final single layout & zoom
    onApply();
    fit();

    // 3. Measure Google phone's final centered position & zoom
    const lastG = devGoogle.getBoundingClientRect();
    const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
    const centerX_first = firstG.left + firstG.width / 2;
    const centerY_first = firstG.top + firstG.height / 2;
    const centerX_last = lastG.left + lastG.width / 2;
    const centerY_last = lastG.top + lastG.height / 2;
    const deltaX = (centerX_first - centerX_last) / zoomG;
    const deltaY = (centerY_first - centerY_last) / zoomG;
    const scaleInit = lastG.width > 0 ? (firstG.width / lastG.width) : 1;

    // 4. Invert Google phone to its starting visual position
    devGoogle.style.transition = 'none';
    devGoogle.style.transformOrigin = 'center center';
    devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)' + (Math.abs(scaleInit - 1) > 0.01 ? ' scale(' + scaleInit + ')' : '');

    // Re-assert Apple phone's initial visual state
    devApple.style.transition = 'none';
    devApple.style.opacity = '1';
    devApple.style.transform = 'translate3d(0, 0, 0) scale(1)';

    void devGoogle.offsetWidth; // flush layout

    // 5. Play silky smooth glide and fade together
    devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    devGoogle.style.transform = 'translate3d(0, 0, 0) scale(1)';

    devApple.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
    devApple.style.opacity = '0';
    devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

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

function setStore(s, animate = true){
  const fromMode = document.body.dataset.dual === 'true' ? 'dual' : store;
  const toMode = s;

  // 1. UPDATE TABVIEW SEGMENT CONTROL BUTTONS & PILL IMMEDIATELY (<1ms)
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === s));
  syncSegPill(s);

  if(fromMode === toMode){
    syncAllVtPills();
    return;
  }

  // 2. IMMEDIATELY SELECT DEVICE ON TABVIEW WITHOUT WAITING FOR ANIMATION (<1ms)
  const isTargetDual = (s === 'dual');
  let targetAppleDev = (appleDevice === 'dual' || !appleDevice) ? 'iphone' : appleDevice;
  let targetGoogleDev = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;

  // Immediately toggle active class on device selector buttons
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === (isTargetDual ? 'dual' : targetAppleDev)));
  $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === (isTargetDual ? 'dual' : targetGoogleDev)));

  // If entering or exiting dual mode, show/hide device selector tabview immediately
  if (isTargetDual) {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'none';
  } else if (s === 'apple') {
    if ($('dt')) $('dt').style.display = 'flex';
    if ($('gdt')) $('gdt').style.display = 'none';
  } else if (s === 'google') {
    if ($('dt')) $('dt').style.display = 'none';
    if ($('gdt')) $('gdt').style.display = 'flex';
  }

  // If not transitioning out of dual mode, update dataset attributes immediately
  if (fromMode !== 'dual') {
    if (isTargetDual) {
      appleDevice = 'dual';
      googleDevice = 'dual';
      document.body.dataset.dual = 'true';
      document.body.dataset.store = 'dual';
      document.body.dataset.appleDevice = 'iphone';
      document.body.dataset.googleDevice = 'phone';
    } else {
      document.body.dataset.dual = 'false';
      store = s;
      document.body.dataset.store = s;
      if (appleDevice === 'dual') appleDevice = 'iphone';
      if (googleDevice === 'dual') googleDevice = 'phone';
      document.body.dataset.appleDevice = appleDevice;
      document.body.dataset.googleDevice = googleDevice;
    }
  }

  // Immediately update editor fields visibility and title for instant feedback
  if(s === 'dual'){
    $$('[data-only]').forEach(e => e.classList.remove('hide'));
    if($('edTitle')) $('edTitle').textContent = 'Dual Store Listing Details';
  } else {
    $$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== s));
    if($('edTitle')) $('edTitle').textContent = s === 'apple' ? 'App Store Listing Details' : 'Google Play Listing Details';
  }
  syncCategoryUI();

  // Immediately synchronize active device tabview pill (<16ms)
  requestAnimationFrame(() => {
    if(s === 'apple') syncVtPill($('dt'));
    else if(s === 'google') syncVtPill($('gdt'));
    syncAllVtPills();
  });

  const applyStoreMode = () => {
    if(s === 'dual'){
      document.body.dataset.dual = 'true';
      document.body.dataset.store = 'dual';
      appleDevice = 'dual';
      googleDevice = 'dual';
      document.body.dataset.appleDevice = 'iphone';
      document.body.dataset.googleDevice = 'phone';
      if(typeof renderIcons === 'function') renderIcons();
      if(typeof validateAppIcon === 'function') validateAppIcon();
    } else {
      document.body.dataset.dual = 'false';
      store = s;
      document.body.dataset.store = s;
      if(appleDevice === 'dual') appleDevice = 'iphone';
      if(googleDevice === 'dual') googleDevice = 'phone';
      document.body.dataset.appleDevice = appleDevice;
      document.body.dataset.googleDevice = googleDevice;

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
        if($('ipadCard')) $('ipadCard').style.display = SUPPORTS_IPAD ? '' : 'none';
      } else {
        if($('ipadCard')) $('ipadCard').style.display = 'none';
      }
    }
    if(typeof saveState === 'function') saveState();
  };

  transitionStoreMode(fromMode, toMode, applyStoreMode, animate);
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

