// Store Preview Studio - Storage & State Persistence (LocalStorage & IndexedDB)
const STORAGE_KEY = 'store_preview_studio_state_v2';
const DRAFT_STORAGE_KEY = 'sps_core_user_draft';
const DRAFT_FEATURE_THUMB_KEY = 'sps_draft_feature_thumb';
let userDraft = null;
let isPresetModified = false;
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

  const targetStore = s.store || store;

  // 1. Restore App Icon state FIRST so no intermediate wrong-icon renders happen
  if(s.icon1024) CUSTOM_ICON_1024 = s.icon1024;
  else if(s.iconApple) CUSTOM_ICON_1024 = s.iconApple;
  else if(s.icon && targetStore === 'apple') CUSTOM_ICON_1024 = s.icon;

  if(s.icon512) CUSTOM_ICON_512 = s.icon512;
  else if(s.iconGoogle) CUSTOM_ICON_512 = s.iconGoogle;
  else if(s.icon && targetStore === 'google') CUSTOM_ICON_512 = s.icon;

  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('bfd1fd') || s.icon.includes('d2c7fc') || s.icon.includes('c6-bg') || s.icon.includes('bp-bg') || s.icon.includes('blueprint')){
      ICON = BLANK_ICON;
      IS_CUSTOM_ICON = false;
      CUSTOM_ICON_1024 = '';
      CUSTOM_ICON_512 = '';
    } else {
      IS_CUSTOM_ICON = (s.isCustomIcon !== undefined) ? !!s.isCustomIcon : true;
      if(targetStore === 'google' && (CUSTOM_ICON_512 || s.icon512 || s.iconGoogle)){
        ICON = CUSTOM_ICON_512 || s.icon512 || s.iconGoogle;
      } else if(targetStore === 'apple' && (CUSTOM_ICON_1024 || s.icon1024 || s.iconApple)){
        ICON = CUSTOM_ICON_1024 || s.icon1024 || s.iconApple;
      } else {
        ICON = s.icon;
      }
    }
  }

  // 2. Set Store and Devices without animation or icon interference
  const isSavedDual = s.appleDevice === 'dual' || s.googleDevice === 'dual';
  if(s.store) setStore(s.store, false, isSavedDual);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
  if(s.view && typeof setView === 'function') setView(s.view, true);
  if(s.theme && $$('.phone').length) (typeof setDeviceTheme === 'function' ? setDeviceTheme(s.theme, false) : $$('.phone').forEach(p => p.dataset.theme = s.theme));
  if(s.form){
    if(s.form.name !== undefined && $('f-name')) $('f-name').value = s.form.name;
    if(s.form.sub !== undefined && $('f-sub')) $('f-sub').value = s.form.sub;
    if(s.form.promo !== undefined && $('f-promo')) $('f-promo').value = s.form.promo;
    if(s.form.short !== undefined && $('f-short')) $('f-short').value = s.form.short;
    if(s.form.dev !== undefined && $('f-dev')) $('f-dev').value = s.form.dev;
    if(s.form.cat !== undefined) setCategory(s.form.cat);
    if(s.form.catApple !== undefined) setCategory(s.form.catApple, 'apple');
    if(s.form.catGoogle !== undefined) setCategory(s.form.catGoogle, 'google');
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
  if(s.isCustomFeature !== undefined){
    IS_CUSTOM_FEATURE = !!s.isCustomFeature;
    if(IS_CUSTOM_FEATURE && s.featureGraphic && s.featureGraphic !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')){
      FEATURE_GRAPHIC = s.featureGraphic;
    } else {
      FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    }
  } else if(s.featureGraphic !== undefined){
    FEATURE_GRAPHIC = s.featureGraphic;
    IS_CUSTOM_FEATURE = !!(FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') && FEATURE_GRAPHIC !== (typeof DEFAULT_FEATURE !== 'undefined' ? DEFAULT_FEATURE : ''));
  } else if(s.feature !== undefined){
    FEATURE_GRAPHIC = s.feature;
    IS_CUSTOM_FEATURE = !!(FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '') && FEATURE_GRAPHIC !== (typeof DEFAULT_FEATURE !== 'undefined' ? DEFAULT_FEATURE : ''));
  } else if(CURRENT_PRESET_KEY === 'draft'){
    FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
    IS_CUSTOM_FEATURE = false;
  }
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)){
    SHOTS = s.shots;
  } else if(!s._partial && !Array.isArray(s.shots)){
    SHOTS = [];
  }
  if(typeof setSupportsIpad === 'function') setSupportsIpad(typeof s.supportsIpad === 'boolean' ? s.supportsIpad : false);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
  } else if(!s._partial){
    IPAD_SHOTS = [];
  }
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone' || s.googleDevice === 'dual') googleDevice = s.googleDevice;
  if(typeof tabOrient !== 'undefined'){
    tabOrient.tab7 = 'landscape';
    tabOrient.tab10 = 'landscape';
  }
  if(Array.isArray(s.tab7Shots) && typeof makeTabItem === 'function'){
    TABS.tab7 = s.tab7Shots.slice(0, MAX_TAB).map(makeTabItem);
  } else if(!s._partial){
    TABS.tab7 = [];
  }
  if(Array.isArray(s.tab10Shots) && typeof makeTabItem === 'function'){
    TABS.tab10 = s.tab10Shots.slice(0, MAX_TAB).map(makeTabItem);
  } else if(!s._partial){
    TABS.tab10 = [];
  }
  if(Array.isArray(s.reviews)){
    REVIEWS = s.reviews;
  } else if(!s._partial){
    REVIEWS = [];
  }
  if(typeof renderReviews === 'function') renderReviews();
  if(typeof syncReviewInputs === 'function') syncReviewInputs();
  if(typeof applyStatsFromObject === 'function') applyStatsFromObject(s.stats);
  return true;
}

function getCurrentStateObject(){
  const activeViewBtn = document.querySelector('#vt button[data-v].on');
  const currentView = activeViewBtn ? activeViewBtn.dataset.v : 'detail';
  return {
    store,
    appleDevice,
    view: currentView,
    theme: document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light',
    form: {
      name: $('f-name') ? $('f-name').value : '',
      sub: $('f-sub') ? $('f-sub').value : '',
      promo: $('f-promo') ? $('f-promo').value : '',
      short: $('f-short') ? $('f-short').value : '',
      dev: $('f-dev') ? $('f-dev').value : '',
      cat: $('f-cat') ? $('f-cat').value : '',
      catApple: CAT.apple,
      catGoogle: CAT.google,
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
    icon: (IS_CUSTOM_ICON && ICON) ? ICON : (ICON || (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY]) || BLANK_ICON),
    icon1024: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    icon512: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    iconApple: (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) ? CUSTOM_ICON_1024 : (store === 'apple' ? ICON : ''),
    iconGoogle: (typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) ? CUSTOM_ICON_512 : (store === 'google' ? ICON : ''),
    isCustomIcon: !!(IS_CUSTOM_ICON && ICON && !ICON.includes('c6-bg') && !ICON.includes('bp-bg') && !ICON.includes('BLUEPRINT GRID')),
    featureGraphic: FEATURE_GRAPHIC,
    isCustomFeature: !!(typeof IS_CUSTOM_FEATURE !== 'undefined' && IS_CUSTOM_FEATURE && FEATURE_GRAPHIC && FEATURE_GRAPHIC !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')),
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    googleDevice,
    tabOrient,
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    reviews: REVIEWS,
    stats: (typeof statsToObject === 'function') ? statsToObject() : {},
    isCustomized: true
  };
}

// True when a state object holds real user content (text, screenshots or a custom icon).
function stateHasUserContent(d){
  if(d && typeof d === 'object'){
    const f = d.form || {};
    const hasText = !!((f.name && f.name.trim()) || (f.sub && f.sub.trim()) || (f.short && f.short.trim()) || (f.desc && f.desc.trim()));
    const hasShots = Array.isArray(d.shots) && d.shots.length > 0;
    const hasCustomIcon = !!(d.isCustomIcon && d.icon && !d.icon.includes('c6-bg') && !d.icon.includes('bp-bg') && !d.icon.includes('BLUEPRINT GRID'));
    return hasText || hasShots || hasCustomIcon;
  }
  return false;
}

function hasUserDraft(){
  return stateHasUserContent(userDraft);
}

// Like hasUserDraft(), but also inspects the live form while editing the draft,
// so edits still inside the debounce window are never considered "empty".
function hasLiveUserContent(){
  if(CURRENT_PRESET_KEY === 'draft'){
    try{
      if(stateHasUserContent(getCurrentStateObject())) return true;
    }catch(_){}
  }
  return hasUserDraft();
}

// Display name of the draft that an import would replace (live form while editing the draft).
function getDraftDisplayName(){
  let src = userDraft;
  if(CURRENT_PRESET_KEY === 'draft'){
    try{ src = getCurrentStateObject(); }catch(_){}
  }
  const name = (src && src.form && src.form.name) ? String(src.form.name).trim() : '';
  return name || 'Untitled';
}

// Asks before an import replaces a draft that holds real work.
// Calls onProceed immediately when there is nothing to lose; Cancel simply never calls it,
// so the draft stays untouched.
function confirmReplaceDraft(incomingName, onProceed){
  if(typeof hasLiveUserContent === 'function' && hasLiveUserContent() && typeof showResetConfirmModal === 'function'){
    const currentName = getDraftDisplayName();
    const incName = ((incomingName || '').trim() || 'Untitled');
    const isSameName = incName.toLowerCase() === currentName.toLowerCase();
    const desc = isSameName
      ? 'Importing "' + incName + '" will overwrite your current draft with fresh data. This cannot be undone. Export a JSON backup first if you want to keep your edits.'
      : 'Importing "' + incName + '" will replace your current draft "' + currentName + '". This cannot be undone. Export a JSON backup first if you want to keep it.';

    showResetConfirmModal(
      onProceed,
      'Replace current draft?',
      desc,
      'Replace Draft',
      function(){
        if(CURRENT_PRESET_KEY !== 'draft' && typeof userDraft === 'object' && userDraft){
          try{
            const rawName = (userDraft.form && userDraft.form.name ? userDraft.form.name : '').trim();
            const slug = (typeof slugify === 'function') ? slugify(rawName, 'app') : (rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'draft');
            const backupObj = Object.assign({
              generator: "Store Preview Studio",
              version: "2.1.0",
              timestamp: new Date().toISOString()
            }, userDraft);
            if(typeof downloadFile === 'function'){
              downloadFile(slug + '-store-config.json', JSON.stringify(backupObj, null, 2), 'application/json');
              if(typeof showToast === 'function') showToast('Exported draft backup JSON!', 'ok');
              return;
            }
          }catch(_){}
        }
        if(typeof exportJSON === 'function'){
          exportJSON();
        }
      }
    );
    return true;
  }
  onProceed();
  return false;
}

function ensureDraft(){
  if(!userDraft){
    userDraft = getCurrentStateObject();
  }
  return userDraft;
}

// Throttled so a failing storage layer does not spam a toast on every debounced save.
let lastStorageWarnAt = 0;
function notifyStorageNotPersisted(){
  const now = Date.now();
  if(now - lastStorageWarnAt < 30000) return;
  lastStorageWarnAt = now;
  showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 6000);
}

// Resolves true when a FULL (non-sanitized) copy of the draft was persisted somewhere.
function saveDraftToStorage(){
  if(typeof isDemoMode === 'function' && isDemoMode()){
    return Promise.resolve(true);
  }
  if(!userDraft) return Promise.resolve(true);
  // Timestamp lets loadDraftFromStorage() pick the newest copy if one store missed a write.
  userDraft._savedAt = Date.now();
  const idbPromise = (typeof idbSave === 'function') ? idbSave(DRAFT_STORAGE_KEY, userDraft) : Promise.resolve(false);
  if(userDraft.isCustomFeature && userDraft.featureGraphic && userDraft.featureGraphic !== (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '')){
    if(typeof THUMB_CACHE !== 'undefined' && THUMB_CACHE.has(userDraft.featureGraphic)){
      try{ localStorage.setItem(DRAFT_FEATURE_THUMB_KEY, THUMB_CACHE.get(userDraft.featureGraphic)); }catch(_){}
    } else if(typeof generateDisplayThumbnail === 'function'){
      generateDisplayThumbnail(userDraft.featureGraphic).then(thumb => {
        try{ localStorage.setItem(DRAFT_FEATURE_THUMB_KEY, thumb); }catch(_){}
      });
    }
  } else {
    try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(_){}
  }
  let lsFull = false;
  try{
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(userDraft));
    lsFull = true;
  }catch(e){
    try{
      const sanitized = sanitizeStateForLocalStorage(userDraft);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }
  return idbPromise.then(ok => ok || lsFull).catch(() => lsFull);
}

function loadDraftFromStorage(){
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          userDraft = parsed;
          if(!userDraft.icon || (!userDraft.isCustomIcon && (userDraft.icon.includes('bp-bg') || userDraft.icon.includes('BLUEPRINT GRID') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || (typeof STUDIO_ICON !== 'undefined' && (userDraft.icon === STUDIO_ICON || userDraft.icon.includes('std-sq-bg'))) || (typeof LEGACY_BLANK_ICON !== 'undefined' && userDraft.icon === LEGACY_BLANK_ICON)))){
            userDraft.icon = BLANK_ICON;
            userDraft.isCustomIcon = false;
          }
          if(userDraft.isCustomFeature && (!userDraft.featureGraphic || userDraft.featureGraphic === (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''))){
            const thumb = localStorage.getItem(DRAFT_FEATURE_THUMB_KEY);
            if(thumb) userDraft.featureGraphic = thumb;
          }
        }
      }
    }
  }catch(e){}

  if(typeof idbGet === 'function'){
    idbGet(DRAFT_STORAGE_KEY).then(idbDraft => {
      if(idbDraft && typeof idbDraft === 'object'){
        // A complete localStorage copy newer than IndexedDB means the last IDB write failed:
        // keep the newer copy and heal IndexedDB instead of rolling back to stale data.
        const lsFullTs = (userDraft && !userDraft._partial) ? (userDraft._savedAt || 0) : 0;
        if(lsFullTs && (idbDraft._savedAt || 0) < lsFullTs){
          if(typeof idbSave === 'function') idbSave(DRAFT_STORAGE_KEY, userDraft);
          return;
        }
        userDraft = idbDraft;
        if(!userDraft.icon || (!userDraft.isCustomIcon && (userDraft.icon.includes('bp-bg') || userDraft.icon.includes('BLUEPRINT GRID') || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc') || (typeof STUDIO_ICON !== 'undefined' && (userDraft.icon === STUDIO_ICON || userDraft.icon.includes('std-sq-bg'))) || (typeof LEGACY_BLANK_ICON !== 'undefined' && userDraft.icon === LEGACY_BLANK_ICON)))){
          userDraft.icon = BLANK_ICON;
          userDraft.isCustomIcon = false;
        }
        updateDraftPill();
        if(CURRENT_PRESET_KEY === 'draft'){
          restoring = true;
          try{
            applyStateObject(userDraft);
            if(typeof renderIcons === 'function') renderIcons();
            if(typeof renderFeature === 'function') renderFeature();
            if(typeof renderShots === 'function') renderShots();
            if(typeof renderIpadShots === 'function') renderIpadShots();
            if(typeof renderTablets === 'function') renderTablets();
            if(typeof syncStatInputs === 'function') syncStatInputs();
            if(typeof renderStats === 'function') renderStats();
            if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
            if(typeof applyTabOrient === 'function') applyTabOrient();
            if(typeof update === 'function') update();
            if(typeof fit === 'function') fit();
          }finally{
            restoring = false;
          }
        }
      }
    }).catch(()=>{});
  }
}

function initDraftFromCurrentPreset(){
  userDraft = getCurrentStateObject();
  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;
  saveDraftToStorage();
  updateDraftPill();
  updatePresetBanner();
  updatePresetMenuSelection();
}

function resetDraftWorkspace(){
  isPresetModified = false;
  const prevActivePreset = CURRENT_ACTIVE_PRESET;

  // 1. Clear file inputs and iPad support
  ['icoFile', 'featureFile', 'shotFile', 'ipadShotFile', 'tab7File', 'tab10File'].forEach(id => {
    const el = $(id);
    if(el) el.value = '';
  });
  if(typeof setSupportsIpad === 'function'){
    setSupportsIpad(false);
  }
  if(typeof resetStats === 'function') resetStats();
  if(typeof THUMB_CACHE !== 'undefined' && THUMB_CACHE && typeof THUMB_CACHE.clear === 'function'){
    THUMB_CACHE.clear();
  }

  // 2. Set CURRENT_PRESET_KEY to 'none' before loadPreset so it never saves old draft
  CURRENT_PRESET_KEY = 'none';
  loadPreset('none');

  // 3. Wipe all storage
  try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(e){}
  if(typeof idbDelete === 'function'){
    idbDelete(DRAFT_STORAGE_KEY);
    idbDelete(STORAGE_KEY);
  }

  // 4. Initialize clean blank userDraft
  CURRENT_PRESET_KEY = 'draft';
  CURRENT_ACTIVE_PRESET = prevActivePreset;
  userDraft = getCurrentStateObject();
  userDraft.isCustomized = true;
  userDraft.icon = (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');
  userDraft.isCustomIcon = false;
  saveDraftToStorage();

  // 5. Update UI
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
  showToast('Draft cleared and reset.', 'ok');
}

function updateDraftPill(){
  const draftPill = $('btnDraft');
  const presetPill = $('btnPresetPill');
  const hasDraft = hasUserDraft();

  const isViewingPreset = (CURRENT_PRESET_KEY !== 'draft');
  const activePresetKey = (CURRENT_PRESET_KEY !== 'draft' && CURRENT_PRESET_KEY && CURRENT_PRESET_KEY !== 'none') ? CURRENT_PRESET_KEY : (typeof CURRENT_ACTIVE_PRESET !== 'undefined' && CURRENT_ACTIVE_PRESET && CURRENT_ACTIVE_PRESET !== 'draft' && CURRENT_ACTIVE_PRESET !== 'none' ? CURRENT_ACTIVE_PRESET : null);

  if(presetPill){
    if(!activePresetKey || activePresetKey === 'none'){
      presetPill.style.display = 'none';
      presetPill.classList.remove('on');
    } else {
      const p = (typeof PRESETS !== 'undefined') ? PRESETS[activePresetKey] : null;
      const pIcon = (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[activePresetKey]) ? PRESET_ICONS[activePresetKey] : (p ? p.icon : BLANK_ICON);
      const pName = p ? p.name : (activePresetKey === 'imported' ? (($('f-name') && $('f-name').value.trim()) || 'Imported App') : (activePresetKey.charAt(0).toUpperCase() + activePresetKey.slice(1)));
      const dispName = typeof clampGraphemes === 'function' ? clampGraphemes(pName, 26) : pName;

      presetPill.style.display = 'inline-flex';
      presetPill.classList.toggle('on', isViewingPreset);
      presetPill.setAttribute('title', isViewingPreset ? ('Viewing preset: ' + pName + ' (Click to browse templates)') : ('View preset: ' + pName + ' (Click to view)'));

      const existingPresetThumb = presetPill.querySelector('#presetBtnThumb');
      const existingPresetTitle = presetPill.querySelector('#presetBtnTitle');
      if(existingPresetThumb && existingPresetTitle){
        if(existingPresetThumb.getAttribute('src') !== pIcon){
          existingPresetThumb.src = pIcon;
        }
        if(existingPresetTitle.textContent !== dispName){
          existingPresetTitle.textContent = dispName;
        }
      } else {
        presetPill.innerHTML = '<img alt="" id="presetBtnThumb" src="' + pIcon + '">' +
          '<span id="presetBtnTitle">' + escapeHtml(dispName) + '</span>' +
          '<small id="presetBtnBadge">Preset</small>' +
          '<span role="button" class="ms-pill-reset-btn" id="presetPillCloseBtn" title="Close preset" aria-label="Close preset">&times;</span>';

        const closeBtn = presetPill.querySelector('#presetPillCloseBtn');
        if(closeBtn){
          closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(typeof closePresetPill === 'function') closePresetPill();
          });
        }

        if(typeof isDemoMode === 'function' && isDemoMode()){
          if(closeBtn) closeBtn.remove();
        }
      }
    }
  }

  if(!draftPill) return;

  if(hasDraft && userDraft){
    // When draft exists:
    // If viewing preset, draftPill is displayed beside presetPill as an inactive pill (.on removed)
    // If in draft mode, draftPill is displayed as active (.on)
    draftPill.style.display = 'inline-flex';
    draftPill.classList.add('has-draft');
    draftPill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');

    // Resolve icon for draft: custom uploaded icon takes top precedence, then draft icon, fallback to BLANK_ICON
    let iconSrc = BLANK_ICON;
    const isLegacyIcon = (uri) => !uri || uri.includes('bp-bg') || uri.includes('BLUEPRINT GRID') || uri.includes('bfd1fd') || uri.includes('d2c7fc') || uri.includes('c6-bg') || (!userDraft.isCustomIcon && typeof STUDIO_ICON !== 'undefined' && (uri === STUDIO_ICON || uri.includes('std-sq-bg')));

    if(userDraft.isCustomIcon && userDraft.icon){
      iconSrc = userDraft.icon;
    } else if(CURRENT_PRESET_KEY === 'draft' && IS_CUSTOM_ICON && ICON){
      iconSrc = ICON;
      userDraft.isCustomIcon = true;
      userDraft.icon = ICON;
    } else if(userDraft.icon && !isLegacyIcon(userDraft.icon)){
      iconSrc = userDraft.icon;
    } else if(CURRENT_PRESET_KEY === 'draft' && typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY] && CURRENT_PRESET_KEY !== 'none'){
      iconSrc = PRESET_ICONS[CURRENT_PRESET_KEY];
      if(!userDraft.isCustomIcon) userDraft.icon = iconSrc;
    } else if(ICON && !isLegacyIcon(ICON) && CURRENT_PRESET_KEY === 'draft'){
      iconSrc = ICON;
    } else {
      iconSrc = (userDraft.icon && !isLegacyIcon(userDraft.icon)) ? userDraft.icon : BLANK_ICON;
    }

    const f = userDraft.form || {};
    const appTitle = (f.name && f.name.trim()) ? (typeof clampGraphemes === 'function' ? clampGraphemes(f.name.trim(), 30) : f.name.trim()) : 'Your App';

    draftPill.setAttribute('title', appTitle + (CURRENT_PRESET_KEY === 'draft' ? ' (Active Workspace)' : ' (Saved Draft · Click to Return)'));

    const existingDraftThumb = draftPill.querySelector('#draftBtnThumb');
    const existingDraftTitle = draftPill.querySelector('#draftBtnTitle');
    if(existingDraftThumb && existingDraftTitle){
      if(existingDraftThumb.getAttribute('src') !== iconSrc){
        existingDraftThumb.src = iconSrc;
      }
      if(existingDraftTitle.textContent !== appTitle){
        existingDraftTitle.textContent = appTitle;
      }
    } else {
      draftPill.innerHTML = '<img alt="" id="draftBtnThumb" src="' + iconSrc + '">' +
        '<span id="draftBtnTitle">' + escapeHtml(appTitle) + '</span>' +
        '<small id="draftBtnBadge">Draft</small>' +
        '<span role="button" class="ms-pill-reset-btn" id="msPillResetBtn" title="Reset draft and clear fields" aria-label="Reset draft">&times;</span>';

      const resetBtn = draftPill.querySelector('#msPillResetBtn');
      if(resetBtn){
        resetBtn.addEventListener('click', function(e){
          e.stopPropagation();
          showResetConfirmModal(function(){
            resetDraftWorkspace();
          });
        });
      }
    }
  } else {
    // No draft exists: show "+ Your App" pill on the left of preset pill
    draftPill.style.display = 'inline-flex';
    draftPill.classList.remove('has-draft');
    draftPill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');
    const existingDraftTitle = draftPill.querySelector('#draftBtnTitle');
    if(existingDraftTitle && !draftPill.querySelector('#draftBtnThumb')){
      if(existingDraftTitle.textContent !== '+ Your App') existingDraftTitle.textContent = '+ Your App';
    } else {
      draftPill.innerHTML = '<span id="draftBtnTitle">+ Your App</span>';
    }
    draftPill.setAttribute('title', 'Start your custom app draft');
  }

  updatePresetMenuSelection();
}

function updatePresetMenuSelection(){
  $$('[data-preset]').forEach(b => {
    const k = b.dataset.preset;
    b.classList.toggle('active', k === CURRENT_PRESET_KEY);
  });
}

function updatePresetBanner(){
  const banner = $('presetBanner');
  if(!banner) return;
  
  const hasDraft = hasUserDraft();
  const copyBtn = $('btnCopyPresetToDraft');
  const returnBtn = $('btnReturnToDraft');

  // Only show warning banner when user actually modifies/edits a preset template
  if(CURRENT_PRESET_KEY !== 'draft' && isPresetModified){
    banner.style.display = 'inline-flex';
    banner.classList.add('is-modified');
    const textEl = $('presetBannerText') || banner.querySelector('.preset-banner-text');
    if(textEl){
      textEl.innerHTML = '<strong>Presets only for preview</strong>: edits won\'t be saved';
    }
    if(!hasDraft){
      // No draft exists yet: suggest copying this preset as custom editable draft
      if(copyBtn) copyBtn.style.display = 'inline-flex';
      if(returnBtn) returnBtn.style.display = 'none';
    } else {
      // Draft exists: only show warning text without return button
      if(copyBtn) copyBtn.style.display = 'none';
      if(returnBtn) returnBtn.style.display = 'none';
    }
  } else {
    banner.style.display = 'none';
    banner.classList.remove('is-modified');
    if(copyBtn) copyBtn.style.display = 'none';
    if(returnBtn) returnBtn.style.display = 'none';
  }
}

function handleUserFormEdit(){
  if(CURRENT_PRESET_KEY !== 'draft'){
    isPresetModified = true;
    updatePresetBanner();
    return;
  }
  debouncedSave();
}

function saveState(isContentEdit = true){
  if(restoring) return;
  const state = getCurrentStateObject();

  let draftPersist = Promise.resolve(false);
  if(CURRENT_PRESET_KEY === 'draft'){
    userDraft = JSON.parse(JSON.stringify(state));
    draftPersist = saveDraftToStorage();
    updateDraftPill();
  } else {
    // Ephemeral mode on preset: do not overwrite draft
    if(isContentEdit){
      isPresetModified = true;
      updatePresetBanner();
    }
    return;
  }

  // 1. Asynchronously persist complete state to IndexedDB (virtually unlimited quota for high-res images)
  const idbPromise = (typeof idbSave === 'function') ? idbSave(STORAGE_KEY, state) : Promise.resolve(false);

  // 2. Try saving to localStorage. Only a FULL copy counts as persisted: the sanitized
  // fallback strips screenshots, so it must not silence the warning on its own.
  let lsFull = false;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lsFull = true;
  }catch(e){
    // Quota exceeded (typically caused by 2048x2732 base64 screenshots)
    try{
      const sanitized = sanitizeStateForLocalStorage(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }

  // 3. Warn only when NO store holds a complete copy of the work (draft copy and state copy both failed).
  const statePersist = idbPromise.then(ok => ok || lsFull).catch(() => lsFull);
  Promise.all([draftPersist, statePersist]).then(results => {
    if(!results[0] && !results[1]){
      console.warn('Storage limit reached on both LocalStorage and IndexedDB', typeof idbLastErrorName !== 'undefined' ? idbLastErrorName : '');
      notifyStorageNotPersisted();
    }
  }).catch(() => notifyStorageNotPersisted());
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

async function resetFactoryStorage(){
  // 1. Close open IndexedDB connection if active
  try{
    if(typeof _appDbPromise !== 'undefined' && _appDbPromise){
      const db = await _appDbPromise;
      if(db && typeof db.close === 'function'){
        db.close();
      }
      _appDbPromise = null;
    }
  }catch(_){}

  // 2. Completely delete the IndexedDB database
  if(typeof indexedDB !== 'undefined' && typeof indexedDB.deleteDatabase === 'function'){
    await new Promise((resolve) => {
      try{
        const req = indexedDB.deleteDatabase(typeof IDB_DB_NAME !== 'undefined' ? IDB_DB_NAME : 'StorePreviewStudioDB');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        req.onblocked = () => resolve(false);
        setTimeout(resolve, 300);
      }catch(_){
        resolve(false);
      }
    });
  }

  // Gracefully dismiss tour if currently open
  try{ if(typeof endTour === 'function') endTour(); }catch(_){}

  // 3. Wipe all LocalStorage & SessionStorage (preserving tour completed state so tour never resets)
  try{
    if(typeof localStorage !== 'undefined'){
      const tourCompleted = localStorage.getItem('sps_tour_completed');
      localStorage.clear();
      if(tourCompleted !== null){
        localStorage.setItem('sps_tour_completed', tourCompleted);
      } else {
        localStorage.setItem('sps_tour_completed', 'true');
      }
    }
  }catch(_){}
  try{ if(typeof sessionStorage !== 'undefined') sessionStorage.clear(); }catch(_){}

  // Mark sessionStorage so after reload it boots into original Studio preset
  try{ if(typeof sessionStorage !== 'undefined') sessionStorage.setItem('sps_reset_to_blank', '1'); }catch(_){}

  // In-memory reset to default Studio preset + dual phone + detail view
  try{
    isPresetModified = false;
    userDraft = null;
    CURRENT_PRESET_KEY = 'studio';
    CURRENT_ACTIVE_PRESET = 'studio';
    if(typeof loadPreset === 'function') loadPreset('studio');
    document.body.dataset.dual = 'true';
    appleDevice = 'dual';
    googleDevice = 'dual';
    document.body.dataset.appleDevice = 'iphone';
    document.body.dataset.googleDevice = 'phone';
    if(typeof setStore === 'function') setStore('apple', false, true);
    if(typeof setView === 'function') setView('detail', true);
  }catch(_){}

  // 4. Reload page cleanly to bootstrap pristine factory state
  if(typeof window !== 'undefined' && window.location){
    try{
      const sp = new URLSearchParams(window.location.search || '');
      const storeKeys = ['appid', 'apple', 'app_id', 'apple_id', 'id', 'app', 'url', 'store_url', 'link', 'itunes', 'country', 'bundle'];
      let hasStoreParam = false;
      storeKeys.forEach(k => {
        if(sp.has(k)){
          sp.delete(k);
          hasStoreParam = true;
        }
      });
      if(hasStoreParam && typeof window.location.replace === 'function'){
        if(window.parent && window.parent !== window){
          try{
            const psp = new URLSearchParams(window.parent.location.search || '');
            storeKeys.forEach(k => psp.delete(k));
            const pSearch = psp.toString();
            window.parent.history.replaceState(null, '', window.parent.location.pathname + (pSearch ? '?' + pSearch : ''));
          }catch(_){}
        }
        const cleanSearch = sp.toString();
        window.location.replace(window.location.pathname + (cleanSearch ? '?' + cleanSearch : ''));
        return;
      }
    }catch(_){}
    if(typeof window.location.reload === 'function'){
      window.location.reload();
    }
  }
}

const optResetAll = $('optResetAllData');
if(optResetAll){
  optResetAll.onclick = () => {
    $$('.menu').forEach(m => m.classList.remove('show'));
    showResetConfirmModal(
      resetFactoryStorage,
      'Reset All Data?',
      'Clear all stored data and reload to clean state.',
      'Reset',
      () => {
        if(typeof exportJSON === 'function') exportJSON();
      }
    );
  };
}
