// Store Preview Studio - Storage & State Persistence (LocalStorage & IndexedDB)
const STORAGE_KEY = 'store_preview_studio_state_v2';
let saveTimer = null;
let restoring = false; // saveState() is a no-op while loadState() is applying saved values

// Download helper utility for export modules
function downloadFile(filename, content, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function debouncedSave(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 300);
}

function sanitizeStateForLocalStorage(state){
  if(!state || typeof state !== 'object') return state;
  const isHeavy = v => typeof v === 'string' && v.length > 50000;
  const clean = { ...state, _partial: true };
  if(isHeavy(clean.icon)) delete clean.icon;
  if(isHeavy(clean.featureGraphic)) delete clean.featureGraphic;
  if(Array.isArray(clean.shots)){
    clean.shots = clean.shots.filter(s => !isHeavy(s));
    if(!clean.shots.length) delete clean.shots;
  }
  if(Array.isArray(clean.ipadShots)){
    delete clean.ipadShots;
  }
  if(Array.isArray(clean.tab7Shots)){
    delete clean.tab7Shots;
  }
  if(Array.isArray(clean.tab10Shots)){
    delete clean.tab10Shots;
  }
  return clean;
}

function applyStateObject(s){
  if(!s || typeof s !== 'object') return false;
  if(s.store) setStore(s.store, false);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
  if(s.ipadOrient === 'portrait' || s.ipadOrient === 'landscape') ipadOrient = s.ipadOrient;
  if((s.iphoneOrient === 'portrait' || s.iphoneOrient === 'landscape') && typeof iphoneOrient !== 'undefined') iphoneOrient = s.iphoneOrient;
  if((s.phoneOrient === 'portrait' || s.phoneOrient === 'landscape') && typeof phoneOrient !== 'undefined') phoneOrient = s.phoneOrient;
  if(s.theme && $$('.phone').length) (typeof setDeviceTheme === 'function' ? setDeviceTheme(s.theme, false) : $$('.phone').forEach(p => p.dataset.theme = s.theme));
  if(typeof s.isFloating === 'boolean'){
    isFloating = s.isFloating;
    $$('.dev').forEach(d => d.classList.toggle('floating', isFloating));
    if($('btnFloat')) $('btnFloat').classList.toggle('active', isFloating);
  }
  if(s.form){
    if(s.form.name !== undefined && $('f-name')) $('f-name').value = s.form.name;
    if(s.form.sub !== undefined && $('f-sub')) $('f-sub').value = s.form.sub;
    if(s.form.promo !== undefined && $('f-promo')) $('f-promo').value = s.form.promo;
    if(s.form.short !== undefined && $('f-short')) $('f-short').value = s.form.short;
    if(s.form.dev !== undefined && $('f-dev')) $('f-dev').value = s.form.dev;
    if(s.form.cat !== undefined) setCategory(s.form.cat);
    if(s.form.catApple !== undefined) setCategory(s.form.catApple, 'apple');
    if(s.form.catGoogle !== undefined) setCategory(s.form.catGoogle, 'google');
    if(s.form.keywords !== undefined && $('f-keywords')) $('f-keywords').value = s.form.keywords;
    if(s.form.ver !== undefined && $('f-ver')) $('f-ver').value = s.form.ver;
    if(s.form.rdate !== undefined && $('f-rdate')) $('f-rdate').value = s.form.rdate;
    if(s.form.email !== undefined && $('f-email')) $('f-email').value = s.form.email;
    if(s.form.phone !== undefined && $('f-phone')) $('f-phone').value = s.form.phone;
    if(s.form.addr !== undefined && $('f-addr')) $('f-addr').value = s.form.addr;
    if(s.form.privLinked !== undefined) {
      if($('f-priv-linked')) $('f-priv-linked').value = s.form.privLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = s.form.privLinked;
    }
    if(s.form.privNotLinked !== undefined) {
      if($('f-priv-notlinked')) $('f-priv-notlinked').value = s.form.privNotLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = s.form.privNotLinked;
    }
    if(s.form.privGoogle !== undefined) {
      if($('f-priv-google')) $('f-priv-google').value = s.form.privGoogle;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = s.form.privGoogle;
    }
    if(s.form.new !== undefined && $('f-new')) $('f-new').value = s.form.new;
    if(s.form.desc !== undefined && $('f-desc')) $('f-desc').value = s.form.desc;
  }
  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('studioBg') || s.icon.includes('stdBg') || s.icon.includes('c6-bg')){
      ICON = BLANK_ICON;
    } else {
      ICON = s.icon;
    }
  }
  if(s.featureGraphic) FEATURE_GRAPHIC = s.featureGraphic;
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)) SHOTS = s.shots;
  if(typeof s.supportsIpad === 'boolean' && typeof setSupportsIpad === 'function') setSupportsIpad(s.supportsIpad);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
    if(typeof renderIpadShots === 'function') renderIpadShots();
  }
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone') googleDevice = s.googleDevice;
  if(s.tabOrient){
    ['tab7', 'tab10'].forEach(k => { if(s.tabOrient[k] === 'portrait' || s.tabOrient[k] === 'landscape') tabOrient[k] = s.tabOrient[k]; });
  }
  if(Array.isArray(s.tab7Shots) && typeof makeTabItem === 'function') TABS.tab7 = s.tab7Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.tab10Shots) && typeof makeTabItem === 'function') TABS.tab10 = s.tab10Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.reviews)) {
    REVIEWS = s.reviews;
    if(typeof renderReviews === 'function') renderReviews();
  }
  if(typeof applyStatsFromObject === 'function') applyStatsFromObject(s.stats);
  return true;
}

function saveState(){
  if(restoring) return;
  const state = {
    store,
    appleDevice,
    ipadOrient,
    iphoneOrient: typeof iphoneOrient !== 'undefined' ? iphoneOrient : 'portrait',
    phoneOrient: typeof phoneOrient !== 'undefined' ? phoneOrient : 'portrait',
    theme: document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light',
    isFloating,
    form: {
      name: $('f-name') ? $('f-name').value : '',
      sub: $('f-sub') ? $('f-sub').value : '',
      promo: $('f-promo') ? $('f-promo').value : '',
      short: $('f-short') ? $('f-short').value : '',
      dev: $('f-dev') ? $('f-dev').value : '',
      cat: $('f-cat') ? $('f-cat').value : '',
      catApple: CAT.apple,
      catGoogle: CAT.google,
      keywords: $('f-keywords') ? $('f-keywords').value : '',
      ver: $('f-ver') ? $('f-ver').value : '2.4.0',
      rdate: $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true),
      email: $('f-email') ? $('f-email').value : 'support@flowcraft.studio',
      phone: $('f-phone') ? $('f-phone').value : '+1 800-555-0199',
      addr: $('f-addr') ? $('f-addr').value : 'Vietnam',
      privLinked: $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : ''),
      privNotLinked: $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : ''),
      privGoogle: $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : ''),
      new: $('f-new') ? $('f-new').value : '',
      desc: $('f-desc') ? $('f-desc').value : ''
    },
    icon: ICON,
    featureGraphic: FEATURE_GRAPHIC,
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    googleDevice,
    tabOrient,
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    reviews: REVIEWS,
    stats: (typeof statsToObject === 'function') ? statsToObject() : {}
  };

  // 1. Asynchronously persist complete state to IndexedDB (virtually unlimited quota for high-res images)
  let idbPromise = null;
  if(typeof idbSave === 'function'){
    idbPromise = idbSave(STORAGE_KEY, state);
  }

  // 2. Try saving to localStorage
  let lsOk = false;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lsOk = true;
  }catch(e){
    // Quota exceeded (typically caused by 2048x2732 base64 screenshots)
    try{
      const sanitized = sanitizeStateForLocalStorage(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      lsOk = true;
    }catch(err2){
      lsOk = false;
    }
  }

  // If localStorage succeeded with sanitized or full state, no toast is needed because IndexedDB holds full state.
  // Only show warning if BOTH stores failed.
  if(!lsOk){
    if(idbPromise){
      idbPromise.then(ok => {
        if(!ok){
          console.warn('Storage limit reached on both LocalStorage and IndexedDB');
          showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
        }
      }).catch(() => {
        showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
      });
    } else {
      showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
    }
  }
}

function loadState(){
  restoring = true;
  let loadedFromLs = false;
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const s = JSON.parse(raw);
        loadedFromLs = applyStateObject(s);
      }
    }
  }catch(e){
    console.warn('Failed to parse saved state from localStorage', e);
  }finally{
    restoring = false;
  }

  // Asynchronously hydrate complete state from IndexedDB (restoring high-res screenshots)
  if(typeof idbGet === 'function'){
    idbGet(STORAGE_KEY).then(idbState => {
      if(idbState && typeof idbState === 'object'){
        restoring = true;
        try{
          applyStateObject(idbState);
          if(typeof renderIcons === 'function') renderIcons();
          if(typeof renderFeature === 'function') renderFeature();
          if(typeof renderShots === 'function') renderShots();
          if(typeof renderIpadShots === 'function') renderIpadShots();
          if(typeof renderTablets === 'function') renderTablets();
          if(typeof syncStatInputs === 'function') syncStatInputs();
          if(typeof renderStats === 'function') renderStats();
          if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
          if(typeof applyIpadOrient === 'function') applyIpadOrient();
          if(typeof applyIphoneOrient === 'function') applyIphoneOrient();
          if(typeof applyGooglePhoneOrient === 'function') applyGooglePhoneOrient();
          if(typeof applyTabOrient === 'function') applyTabOrient();
          if(typeof update === 'function') update();
          if(typeof fit === 'function') fit();
          if(typeof syncAllVtPills === 'function') syncAllVtPills();
        }finally{
          restoring = false;
        }
      }
    }).catch(err => {
      console.warn('IndexedDB hydration notice', err);
    });
  }

  return loadedFromLs;
}
