// Store Preview Studio - JSON Configuration Exporter, Importer & Drag-and-Drop Handler
if($('optExportJSON')) $('optExportJSON').onclick = exportJSON;

function exportJSON(){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const config = {
    generator: "Store Preview Studio",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
    store,
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
      email: $('f-email') ? $('f-email').value : '',
      addr: $('f-addr') ? $('f-addr').value : '',
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
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    stats: (typeof statsToObject === 'function') ? statsToObject() : {}
  };
  const jsonStr = JSON.stringify(config, null, 2);
  const rawName = ($('f-name') && $('f-name').value ? $('f-name').value : '').trim();
  let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if(!slug) slug = 'app';
  downloadFile(`${slug}-store-config.json`, jsonStr, 'application/json');
  showToast('Exported store configuration JSON!', 'ok');
}

// Smart & Fault-Tolerant JSON Import Parser
function parseAndApplyJSON(jsonString){
  if(typeof jsonString === 'string'){
    // Strip UTF-8 BOM if present
    if(jsonString.charCodeAt(0) === 0xFEFF){
      jsonString = jsonString.slice(1);
    }
  }

  let data;
  try{
    data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  }catch(err){
    showToast('Invalid JSON file format (Syntax Error)', 'warn');
    return false;
  }

  if(!data || typeof data !== 'object' || Array.isArray(data)){
    showToast('Invalid file: JSON root must be an object', 'warn');
    return false;
  }

  // Reject unrelated JSON schemas like package.json or library manifests
  if(!data.form && !data.app && (data.main || data.scripts || (data.version && data.main) || data.dependencies || data.devDependencies)){
    showToast('File does not contain valid App Listing metadata', 'warn');
    return false;
  }

  const isKnownGenerator = data.generator === 'Store Preview Studio';
  const hasAppWrapper = (data.form && typeof data.form === 'object') || (data.app && typeof data.app === 'object');
  const hasStoreKeys = !!(data.store || data.shots || data.tab7Shots || data.tab10Shots || data.icon || data.featureGraphic || data.feature);

  // Extract source object whether it uses "form", "app", or flat root properties
  const src = (data.form && typeof data.form === 'object') ? data.form : ((data.app && typeof data.app === 'object') ? data.app : data);

  // Validate fields and safely discard wrong types (objects, arrays, numbers)
  let hadWrongTypes = false;
  const getStr = val => {
    if(val === undefined || val === null) return '';
    if(typeof val === 'string') return val;
    hadWrongTypes = true;
    return '';
  };

  const mapped = {
    name: getStr(src.name || src.title || src.appName),
    sub: getStr(src.sub || src.subtitle),
    promo: getStr(src.promo || src.promotionalText || src.promoText),
    short: getStr(src.short || src.shortDesc || src.shortDescription),
    dev: getStr(src.dev || src.developer || src.developerName || src.author),
    cat: getStr(src.cat || src.category),
    ver: getStr(src.ver || src.appVersion),
    rdate: getStr(src.rdate || src.releaseDate),
    email: getStr(src.email || src.supportEmail),
    addr: getStr(src.addr || src.address || src.location),
    privLinked: getStr(src.privLinked),
    privNotLinked: getStr(src.privNotLinked),
    privGoogle: getStr(src.privGoogle),
    new: getStr(src.new || src.whatsNew || src.releaseNotes || src.changelog),
    desc: getStr(src.desc || src.description || src.fullDescription)
  };

  const hasMobileSpecificFields = !!(mapped.sub || mapped.promo || mapped.short || src.catApple || src.catGoogle);

  // Strict Schema Check: Reject generic flat JSON files that lack Store Preview Studio schema or mobile fields
  if(!isKnownGenerator && !hasAppWrapper && !hasStoreKeys && !hasMobileSpecificFields){
    showToast('Unrecognized format: Missing Store Preview Studio schema or listing fields', 'warn');
    return false;
  }

  // Check if at least one meaningful app listing field exists
  const hasFields = Object.values(mapped).some(v => v.trim().length > 0);
  if(!hasFields && !data.icon && !Array.isArray(data.shots)){
    showToast('File does not contain valid App Listing metadata', 'warn');
    return false;
  }

  // Safely populate available fields without erasing existing ones if absent
  if(mapped.name && $('f-name')) $('f-name').value = mapped.name;
  if(mapped.sub && $('f-sub')) $('f-sub').value = mapped.sub;
  if(mapped.promo && $('f-promo')) $('f-promo').value = mapped.promo;
  if(mapped.short && $('f-short')) $('f-short').value = mapped.short;
  if(mapped.dev && $('f-dev')) $('f-dev').value = mapped.dev;
  if(mapped.cat) setCategory(mapped.cat);
  if(src.catApple && typeof src.catApple === 'string') setCategory(src.catApple, 'apple');
  if(src.catGoogle && typeof src.catGoogle === 'string') setCategory(src.catGoogle, 'google');
  if(mapped.ver && $('f-ver')) $('f-ver').value = mapped.ver;
  if(mapped.rdate && $('f-rdate')) $('f-rdate').value = mapped.rdate;
  if(mapped.email && $('f-email')) $('f-email').value = mapped.email;
  if(mapped.addr && $('f-addr')) $('f-addr').value = mapped.addr;
  if(mapped.privLinked) {
    if($('f-priv-linked')) $('f-priv-linked').value = mapped.privLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = mapped.privLinked;
  }
  if(mapped.privNotLinked) {
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = mapped.privNotLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = mapped.privNotLinked;
  }
  if(mapped.privGoogle) {
    if($('f-priv-google')) $('f-priv-google').value = mapped.privGoogle;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = mapped.privGoogle;
  }
  if(mapped.new && $('f-new')) $('f-new').value = mapped.new;
  if(mapped.desc && $('f-desc')) $('f-desc').value = mapped.desc;

  IS_CUSTOM_ICON = false;
  if(data.icon1024 || data.icon512) {
    if(store === 'apple' && data.icon1024) ICON = data.icon1024;
    else if(store === 'google' && data.icon512) ICON = data.icon512;
    else if(data.icon) ICON = data.icon;
  } else if(data.icon && typeof data.icon === 'string') {
    ICON = data.icon;
  }
  if(typeof rasterizeSvgToStorePng === 'function' && typeof ICON === 'string' && (ICON.startsWith('data:image/svg+xml') || ICON.includes('<svg'))){
    const rawSvg = ICON;
    rasterizeSvgToStorePng(rawSvg, 1024, png1024 => {
      data.icon1024 = png1024;
      if(store === 'apple' && !IS_CUSTOM_ICON){
        ICON = png1024;
        renderIcons();
      }
    });
    rasterizeSvgToStorePng(rawSvg, 512, png512 => {
      data.icon512 = png512;
      if(store === 'google' && !IS_CUSTOM_ICON){
        ICON = png512;
        renderIcons();
      }
    });
  }
  if(data.featureGraphic && typeof data.featureGraphic === 'string') FEATURE_GRAPHIC = data.featureGraphic;
  else if(data.feature && typeof data.feature === 'string') FEATURE_GRAPHIC = data.feature;

  if(Array.isArray(data.shots)){
    const cleanShots = data.shots.filter(x => typeof x === 'string' && x.trim().length > 0);
    if(cleanShots.length > 0) SHOTS = cleanShots;
  }
  if(Array.isArray(data.tab7Shots) && typeof makeTabItem === 'function') TABS.tab7 = data.tab7Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(data.tab10Shots) && typeof makeTabItem === 'function') TABS.tab10 = data.tab10Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(data.store && (data.store === 'apple' || data.store === 'google')) setStore(data.store);
  if(data.theme && (data.theme === 'light' || data.theme === 'dark')){
    if(typeof setDeviceTheme === 'function') setDeviceTheme(data.theme, false);
    else $$('.phone').forEach(p => p.dataset.theme = data.theme);
  }
  if(data.stats){ applyStatsFromObject(data.stats); syncStatInputs(); renderStats(); }

  if(typeof data.supportsIpad === 'boolean' && typeof setSupportsIpad === 'function') setSupportsIpad(data.supportsIpad);
  if(data.ipadFitMode === 'cover' || data.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = data.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(Array.isArray(data.ipadShots)){
    IPAD_SHOTS = data.ipadShots.filter(x => typeof x === 'string');
  }

  if(typeof renderIcons === 'function') renderIcons();
  if(typeof renderFeature === 'function') renderFeature();
  if(typeof renderShots === 'function') renderShots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  if(typeof renderTablets === 'function') renderTablets();
  if(typeof update === 'function') update();

  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;
  if(typeof getCurrentStateObject === 'function'){
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
  }
  if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  saveState();

  if(hadWrongTypes){
    showToast('Imported config (Note: invalid non-string fields were ignored)', 'warn', 3500);
  } else {
    showToast('Configuration imported successfully!', 'ok');
  }
  return true;
}

if($('optImportJSON')){
  $('optImportJSON').onclick = () => {
    if(typeof canUpload === 'function' && !canUpload(1000)) return;
    if($('jsonFileInput')) $('jsonFileInput').click();
  };
}
if($('jsonFileInput')){
  $('jsonFileInput').onchange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };
}

// Drag & Drop JSON anywhere onto the page
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if(!file) return;
  if(file.name.toLowerCase().endsWith('.json')){
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
    };
    reader.readAsText(file);
  } else if (!e.target.closest('#icoDropZone') && !e.target.closest('#featureDropZone') && !e.target.closest('#shotDropZone') && !e.target.closest('#ipadDropZone') && !e.target.closest('#bundleDropZone') && !e.target.closest('.drop-zone') && !e.target.closest('.sl') && !e.target.closest('.tabsec')) {
    showToast('Unsupported file type. Please drop a .json configuration file.', 'warn');
  }
});

// Reset to Default State
if($('optResetDefault')){
  $('optResetDefault').onclick = () => {
    showResetConfirmModal(() => {
      if(typeof resetDraftWorkspace === 'function'){
        resetDraftWorkspace();
      } else {
        userDraft = null;
        isPresetModified = false;
        try{ localStorage.removeItem(DRAFT_STORAGE_KEY); }catch(e){}
        try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
        try{ localStorage.removeItem(DRAFT_FEATURE_THUMB_KEY); }catch(e){}
        if(typeof idbDelete === 'function'){
          idbDelete(DRAFT_STORAGE_KEY);
          idbDelete(STORAGE_KEY);
        }
        if(typeof resetStats === 'function') resetStats();
        loadPreset('none');
        CURRENT_PRESET_KEY = 'draft';
        if(typeof updatePresetBanner === 'function') updatePresetBanner();
        if(typeof updateDraftPill === 'function') updateDraftPill();
        if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
        showToast('Draft cleared and reset.', 'ok');
      }
    });
  };
}
