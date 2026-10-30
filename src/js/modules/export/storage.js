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
  if(s.store) setStore(s.store, false);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
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
  if(s.icon1024) CUSTOM_ICON_1024 = s.icon1024;
  else if(s.iconApple) CUSTOM_ICON_1024 = s.iconApple;

  if(s.icon512) CUSTOM_ICON_512 = s.icon512;
  else if(s.iconGoogle) CUSTOM_ICON_512 = s.iconGoogle;

  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('bfd1fd') || s.icon.includes('d2c7fc') || s.icon.includes('c6-bg')){
      ICON = BLANK_ICON;
      IS_CUSTOM_ICON = false;
      CUSTOM_ICON_1024 = '';
      CUSTOM_ICON_512 = '';
    } else {
      IS_CUSTOM_ICON = (s.isCustomIcon !== undefined) ? !!s.isCustomIcon : false;
      if(store === 'google' && (CUSTOM_ICON_512 || s.icon512 || s.iconGoogle)){
        ICON = CUSTOM_ICON_512 || s.icon512 || s.iconGoogle;
      } else if(store === 'apple' && (CUSTOM_ICON_1024 || s.icon1024 || s.iconApple)){
        ICON = CUSTOM_ICON_1024 || s.icon1024 || s.iconApple;
      } else {
        ICON = s.icon;
      }
    }
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
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)) SHOTS = s.shots;
  if(typeof setSupportsIpad === 'function') setSupportsIpad(typeof s.supportsIpad === 'boolean' ? s.supportsIpad : false);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
    if(typeof renderIpadShots === 'function') renderIpadShots();
  }
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone' || s.googleDevice === 'dual') googleDevice = s.googleDevice;
  if(typeof tabOrient !== 'undefined'){
    tabOrient.tab7 = 'landscape';
    tabOrient.tab10 = 'landscape';
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

function getCurrentStateObject(){
  return {
    store,
    appleDevice,
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
    isCustomIcon: !!(IS_CUSTOM_ICON && ICON && !ICON.includes('c6-bg')),
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

function hasUserDraft(){
  if(userDraft && typeof userDraft === 'object'){
    const f = userDraft.form || {};
    const hasText = !!((f.name && f.name.trim()) || (f.sub && f.sub.trim()) || (f.short && f.short.trim()) || (f.desc && f.desc.trim()));
    const hasShots = Array.isArray(userDraft.shots) && userDraft.shots.length > 0;
    return hasText || hasShots || !!userDraft.isCustomized;
  }
  return false;
}

function ensureDraft(){
  if(!userDraft){
    userDraft = getCurrentStateObject();
  }
  return userDraft;
}

function saveDraftToStorage(){
  if(!userDraft) return;
  if(typeof idbSave === 'function'){
    idbSave(DRAFT_STORAGE_KEY, userDraft);
  }
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
  try{
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(userDraft));
  }catch(e){
    try{
      const sanitized = sanitizeStateForLocalStorage(userDraft);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sanitized));
    }catch(err2){}
  }
}

function loadDraftFromStorage(){
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          userDraft = parsed;
          if(!userDraft.icon || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc')){
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
        userDraft = idbDraft;
        if(!userDraft.icon || userDraft.icon.includes('bfd1fd') || userDraft.icon.includes('d2c7fc')){
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
  const activePresetKey = (CURRENT_PRESET_KEY !== 'draft' && CURRENT_PRESET_KEY) ? CURRENT_PRESET_KEY : (typeof CURRENT_ACTIVE_PRESET !== 'undefined' && CURRENT_ACTIVE_PRESET && CURRENT_ACTIVE_PRESET !== 'draft' ? CURRENT_ACTIVE_PRESET : null);

  if(presetPill){
    if(!activePresetKey){
      presetPill.style.display = 'none';
      presetPill.classList.remove('on');
    } else {
      const p = (typeof PRESETS !== 'undefined') ? PRESETS[activePresetKey] : null;
      const pIcon = (typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[activePresetKey]) ? PRESET_ICONS[activePresetKey] : (p ? p.icon : BLANK_ICON);
      const pName = p ? p.name : (activePresetKey === 'imported' ? (($('f-name') && $('f-name').value.trim()) || 'Imported App') : (activePresetKey === 'none' ? 'Blank Template' : (activePresetKey.charAt(0).toUpperCase() + activePresetKey.slice(1))));
      const dispName = typeof clampGraphemes === 'function' ? clampGraphemes(pName, 26) : pName;

      presetPill.style.display = 'inline-flex';
      presetPill.classList.toggle('on', isViewingPreset);
      presetPill.setAttribute('title', isViewingPreset ? ('Viewing preset: ' + pName + ' (Click to browse templates)') : ('View preset: ' + pName + ' (Click to view)'));
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
    if(userDraft.isCustomIcon && userDraft.icon && !userDraft.icon.includes('bfd1fd') && !userDraft.icon.includes('d2c7fc')){
      iconSrc = userDraft.icon;
    } else if(CURRENT_PRESET_KEY === 'draft' && IS_CUSTOM_ICON && ICON && !ICON.includes('bfd1fd') && !ICON.includes('d2c7fc')){
      iconSrc = ICON;
      userDraft.isCustomIcon = true;
      userDraft.icon = ICON;
    } else if(CURRENT_PRESET_KEY === 'draft' && typeof PRESET_ICONS !== 'undefined' && PRESET_ICONS[CURRENT_PRESET_KEY] && CURRENT_PRESET_KEY !== 'none'){
      iconSrc = PRESET_ICONS[CURRENT_PRESET_KEY];
      if(!userDraft.isCustomIcon) userDraft.icon = iconSrc;
    } else if(userDraft.icon && userDraft.icon !== BLANK_ICON && !userDraft.icon.includes('bfd1fd') && !userDraft.icon.includes('d2c7fc')){
      iconSrc = userDraft.icon;
    } else if(ICON && ICON !== BLANK_ICON && !ICON.includes('bfd1fd') && !ICON.includes('d2c7fc') && CURRENT_PRESET_KEY === 'draft'){
      iconSrc = ICON;
    } else {
      iconSrc = BLANK_ICON;
      userDraft.icon = BLANK_ICON;
    }

    const f = userDraft.form || {};
    const appTitle = (f.name && f.name.trim()) ? (typeof clampGraphemes === 'function' ? clampGraphemes(f.name.trim(), 30) : f.name.trim()) : 'Your App';

    draftPill.setAttribute('title', appTitle + (CURRENT_PRESET_KEY === 'draft' ? ' (Active Workspace)' : ' (Saved Draft · Click to Return)'));
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
  } else {
    // No draft exists
    if(isViewingPreset){
      // When viewing preset and there is no draft, hide draft pill
      draftPill.style.display = 'none';
      draftPill.classList.remove('has-draft', 'on');
    } else {
      draftPill.style.display = 'inline-flex';
      draftPill.classList.remove('has-draft');
      draftPill.classList.toggle('on', CURRENT_PRESET_KEY === 'draft');
      draftPill.textContent = '+ Your App';
      draftPill.setAttribute('title', 'Start your custom app draft');
    }
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
  if(CURRENT_PRESET_KEY !== 'draft' && hasDraft && userDraft){
    banner.style.display = 'inline-flex';
    banner.classList.toggle('is-modified', !!isPresetModified);
    const textEl = $('presetBannerText') || banner.querySelector('.preset-banner-text');
    let pName = 'Preset';
    if(CURRENT_PRESET_KEY === 'none') {
      pName = 'None (Blank)';
    } else if(CURRENT_PRESET_KEY === 'imported') {
      pName = ($('f-name') && $('f-name').value.trim()) ? $('f-name').value.trim() : 'Imported App';
    } else if(CURRENT_PRESET_KEY) {
      pName = CURRENT_PRESET_KEY.charAt(0).toUpperCase() + CURRENT_PRESET_KEY.slice(1);
    }
    
    if(textEl){
      if(isPresetModified){
        textEl.innerHTML = '<strong>Preview only: edits won\'t be saved</strong> · Your draft is saved safely.';
      } else if(CURRENT_PRESET_KEY === 'imported'){
        textEl.innerHTML = 'Viewing imported app: <strong id="presetBannerName">' + escapeHtml(pName) + '</strong> · Your draft is saved safely.';
      } else {
        textEl.innerHTML = 'Viewing preset: <strong id="presetBannerName">' + escapeHtml(pName) + '</strong> · Your draft is saved safely.';
      }
    }
  } else {
    banner.style.display = 'none';
    banner.classList.remove('is-modified');
  }
}

function handleUserFormEdit(){
  if(!hasUserDraft()){
    if(CURRENT_PRESET_KEY !== 'draft'){
      initDraftFromCurrentPreset();
      return;
    }
  } else if(CURRENT_PRESET_KEY !== 'draft'){
    isPresetModified = true;
    updatePresetBanner();
    return;
  }
  debouncedSave();
}

function saveState(){
  if(restoring) return;
  const state = getCurrentStateObject();

  if(CURRENT_PRESET_KEY === 'draft'){
    userDraft = JSON.parse(JSON.stringify(state));
    saveDraftToStorage();
    updateDraftPill();
  } else if(!hasUserDraft()){
    initDraftFromCurrentPreset();
    return;
  } else {
    // Ephemeral mode on preset: do not overwrite draft
    isPresetModified = true;
    updatePresetBanner();
    return;
  }

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
