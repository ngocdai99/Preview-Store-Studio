// Store Preview Studio · Preset Template Switcher
// --- Preset Switcher ---
const PRESET_ICONS = {
  none: BLANK_ICON,
  studio: STUDIO_ICON,
  taskflow: DEFAULT_ICON,
  pulsefit: PULSEFIT_ICON,
  zenmind: ZENMIND_ICON,
  /* @pro-only-start */
  cyberstrike: CYBER_ICON,
  edulearn: SKILL_ICON
  /* @pro-only-end */
};

function prewarmPresetIcons() {
  if (typeof rasterizeSvgToStorePng !== 'function') return;
  if (typeof BLANK_ICON === 'string' && (BLANK_ICON.startsWith('data:image/svg+xml') || BLANK_ICON.includes('<svg'))) {
    rasterizeSvgToStorePng(BLANK_ICON, 1024, png => {
      BLANK_ICON_1024 = png;
      if (!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'apple') {
        ICON = png;
        renderIcons();
      }
    });
    rasterizeSvgToStorePng(BLANK_ICON, 512, png => {
      BLANK_ICON_512 = png;
      if (!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'google') {
        ICON = png;
        renderIcons();
      }
    });
  }
  if (typeof PRESETS === 'object') {
    Object.keys(PRESETS).forEach(key => {
      const p = PRESETS[key];
      if (!p) return;
      if (typeof p.icon === 'string' && (p.icon.startsWith('data:image/svg+xml') || p.icon.includes('<svg'))) {
        rasterizeSvgToStorePng(p.icon, 1024, png1024 => {
          p.icon1024 = png1024;
          if (!IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key && store === 'apple') {
            ICON = png1024;
            renderIcons();
          }
        });
        rasterizeSvgToStorePng(p.icon, 512, png512 => {
          p.icon512 = png512;
          if (!IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key && store === 'google') {
            ICON = png512;
            renderIcons();
          }
        });
      }
      if (typeof rasterizeSvgToDimensions === 'function' && typeof p.feature === 'string' && (p.feature.startsWith('data:image/svg+xml') || p.feature.includes('<svg'))) {
        rasterizeSvgToDimensions(p.feature, 1024, 500, png1024x500 => {
          p.featurePng = png1024x500;
          if (CURRENT_PRESET_KEY === key) {
            FEATURE_GRAPHIC = png1024x500;
            renderFeature();
          }
        });
      }
    });
  }
}

function initPresetThumbnails() {
  $$('[data-preset]').forEach(b => {
    const key = b.dataset.preset;
    const img = b.querySelector('.preset-thumb');
    if (img && PRESET_ICONS[key]) {
      img.src = PRESET_ICONS[key];
    }
  });
  prewarmPresetIcons();
}
initPresetThumbnails();

$$('[data-preset]').forEach(b=>{
  b.onclick=()=>{
    const pKey=b.dataset.preset;
    loadPreset(pKey);
    $$('.menu').forEach(m => m.classList.remove('show'));
    const tModal = $('templatesModal');
    if (tModal) {
      tModal.classList.remove('open');
      tModal.setAttribute('aria-hidden', 'true');
    }
  };
});

function loadPreset(key){
  if(key === 'draft'){
    if(!userDraft){
      loadPreset('none');
      CURRENT_PRESET_KEY = 'draft';
      isPresetModified = false;
      userDraft = getCurrentStateObject();
      userDraft.isCustomized = true;
      if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
      if(typeof updatePresetBanner === 'function') updatePresetBanner();
      if(typeof updateDraftPill === 'function') updateDraftPill();
      if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
      return;
    }
    CURRENT_PRESET_KEY = 'draft';
    isPresetModified = false;
    if(userDraft){
      restoring = true;
      try{
        applyStateObject(userDraft);
      }finally{
        restoring = false;
      }
      renderIcons();
      renderFeature();
      renderShots();
      renderIpadShots();
      renderTablets();
      syncStatInputs();
      renderStats();
      if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
      if(typeof applyTabOrient === 'function') applyTabOrient();
      update();
      fit();
    }
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
    return;
  }

  // Before switching to a preset, if we were in draft mode, ensure draft is persisted
  if(CURRENT_PRESET_KEY === 'draft'){
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
    if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
  }

  CURRENT_ACTIVE_PRESET = key;
  CURRENT_PRESET_KEY = key;
  isPresetModified = false;
  if(key === 'none'){
    if(typeof setSupportsIpad === 'function'){
      setSupportsIpad(false);
    }
    $('f-name').value = '';
    $('f-sub').value = '';
    $('f-promo').value = '';
    $('f-short').value = '';
    $('f-dev').value = '';
    setCategory('');
    if($('f-ver')) $('f-ver').value = '1.0.0';
    if($('f-rdate')) $('f-rdate').value = getCurrentMonthDateStr(2, true);
    if($('f-email')) $('f-email').value = '';
    if($('f-phone')) $('f-phone').value = '';
    if($('f-addr')) $('f-addr').value = '';
    const defaultPrivLinked = 'Identifiers, Usage Data';
    const defaultPrivNotLinked = 'Diagnostics, Performance Data';
    const defaultPrivGoogle = 'No data shared with third parties, Data is encrypted in transit, You can request data deletion';
    if($('f-priv-linked')) $('f-priv-linked').value = defaultPrivLinked;
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = defaultPrivNotLinked;
    if($('f-priv-google')) $('f-priv-google').value = defaultPrivGoogle;
    CURRENT_PRIVACY = { linked: defaultPrivLinked, notLinked: defaultPrivNotLinked, google: defaultPrivGoogle };
    $('f-new').value = '';
    $('f-desc').value = '';
    IS_CUSTOM_ICON = false;
    CUSTOM_ICON_1024 = '';
    CUSTOM_ICON_512 = '';
    ICON_FILE_SIZE = 0; ICON_FILE_TYPE = ''; ICON_FILE_NAME = '';
    if (store === 'apple' && BLANK_ICON_1024) {
      ICON = BLANK_ICON_1024;
    } else if (store === 'google' && BLANK_ICON_512) {
      ICON = BLANK_ICON_512;
    } else {
      ICON = BLANK_ICON;
    }
    if(typeof rasterizeSvgToStorePng === 'function' && typeof BLANK_ICON === 'string' && (BLANK_ICON.startsWith('data:image/svg+xml') || BLANK_ICON.includes('<svg'))){
      if(!BLANK_ICON_1024){
        rasterizeSvgToStorePng(BLANK_ICON, 1024, png => {
          BLANK_ICON_1024 = png;
          if(!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'apple'){
            ICON = png;
            renderIcons();
          }
        });
      }
      if(!BLANK_ICON_512){
        rasterizeSvgToStorePng(BLANK_ICON, 512, png => {
          BLANK_ICON_512 = png;
          if(!IS_CUSTOM_ICON && (CURRENT_PRESET_KEY === 'none' || CURRENT_PRESET_KEY === 'draft') && store === 'google'){
            ICON = png;
            renderIcons();
          }
        });
      }
    }
    FEATURE_GRAPHIC = BLANK_FEATURE;
    IS_CUSTOM_FEATURE = false;
    FEATURE_FILE_SIZE = 0; FEATURE_FILE_TYPE = ''; FEATURE_FILE_NAME = '';
    SHOTS = [];
    IPAD_SHOTS = [];
    REVIEWS = [
      {
        author: 'Alex Morgan',
        avatar: 'A',
        avatarBg: '#0284c7',
        stars: 5,
        title: 'Intuitive & beautifully designed',
        text: 'Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction.',
        helpful: 84
      },
      {
        author: 'Jordan Lee',
        avatar: 'J',
        avatarBg: '#8b5cf6',
        stars: 5,
        title: 'Reliable and well built',
        text: 'Fast performance, thoughtful details, and easy to navigate. Quickly became an essential tool in my workflow.',
        helpful: 52
      }
    ];
    TABS.tab7 = []; TABS.tab10 = [];
    Object.assign(STATS, STATS_DEFAULT);
    syncStatInputs();
    renderStats();
    renderTablets();
    renderIcons();
    renderFeature();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    renderReviews();
    update();
    if(CURRENT_PRESET_KEY === 'draft'){
      saveState();
    }
    if(typeof updatePresetBanner === 'function') updatePresetBanner();
    if(typeof updateDraftPill === 'function') updateDraftPill();
    if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
    setTimeout(() => {
      const el = $('f-name');
      if(el) el.focus({ preventScroll: true });
    }, 50);
    return;
  }
  const p = PRESETS[key];
  if(!p) return;
  $('f-name').value = p.name;
  $('f-sub').value = p.sub;
  $('f-promo').value = p.promo;
  $('f-short').value = p.short;
  $('f-dev').value = p.dev;
  setCategory(p.category);
  if($('f-ver')) $('f-ver').value = (p && p.ver) ? p.ver : (key === 'studio' ? '2.1.0' : (key === 'cyberstrike' ? '4.2.0' : (key === 'pulsefit' ? '3.1.2' : (key === 'zenmind' ? '1.8.0' : (key === 'edulearn' ? '4.1.0' : '2.4.0')))));
  if($('f-rdate')) $('f-rdate').value = (p && p.rdate) ? p.rdate : getCurrentMonthDateStr(2, true);
  if($('f-email')) $('f-email').value = (p && p.email) ? p.email : (key === 'studio' ? 'support@previewstudio.app' : (key === 'cyberstrike' ? 'support@omniarcade.games' : (key === 'pulsefit' ? 'support@pulsefit.io' : (key === 'zenmind' ? 'hello@zenmind.app' : (key === 'edulearn' ? 'support@skillsphere.edu' : 'support@flowcraft.studio')))));
  if($('f-phone')) $('f-phone').value = (p && p.phone) ? p.phone : (key === 'studio' ? '+1 800-555-0199' : (key === 'cyberstrike' ? '+81 3 5555 0188' : (key === 'pulsefit' ? '+1 888-555-0142' : (key === 'zenmind' ? '+1 800-555-0177' : (key === 'edulearn' ? '+44 20 7946 0912' : '+1 800-555-0199')))));
  if($('f-addr')) $('f-addr').value = (p && p.addr) ? p.addr : (key === 'studio' ? 'San Francisco, CA' : (key === 'cyberstrike' ? 'Tokyo, Japan' : (key === 'edulearn' ? 'San Francisco, CA' : 'Vietnam')));
  if($('f-priv-linked')) $('f-priv-linked').value = p.privLinked || '';
  if($('f-priv-notlinked')) $('f-priv-notlinked').value = p.privNotLinked || '';
  if($('f-priv-google')) $('f-priv-google').value = p.privGoogle || '';
  CURRENT_PRIVACY = {
    linked: p.privLinked || '',
    notLinked: p.privNotLinked || '',
    google: p.privGoogle || ''
  };
  if(p.stats){
    Object.assign(STATS, p.stats);
    syncStatInputs(); renderStats();
  } else if(key === 'cyberstrike'){
    STATS.rating = '4.9'; STATS.count = '48.5K'; STATS.dl = '100K+'; STATS.rank = '2'; STATS.size = '1.8 GB';
    STATS.age = '12+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  } else if(key === 'edulearn'){
    STATS.rating = '4.8'; STATS.count = '145K'; STATS.dl = '5M+'; STATS.rank = '1'; STATS.size = '98 MB';
    STATS.age = '4+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  } else {
    STATS.rating = '4.9'; STATS.count = '1.8K'; STATS.dl = '50K+'; STATS.rank = '1'; STATS.size = '86 MB';
    STATS.age = '4+'; STATS.iap = 'iap';
    syncStatInputs(); renderStats();
  }
  $('f-new').value = p.whatsNew;
  $('f-desc').value = p.desc;
  IS_CUSTOM_ICON = false;
  CUSTOM_ICON_1024 = '';
  CUSTOM_ICON_512 = '';
  ICON_FILE_SIZE = 0; ICON_FILE_TYPE = ''; ICON_FILE_NAME = '';
  ['icoFile', 'featureFile', 'shotFile', 'ipadShotFile', 'tab7File', 'tab10File'].forEach(id => {
    const el = $(id);
    if(el) el.value = '';
  });
  if (store === 'apple' && p.icon1024) {
    ICON = p.icon1024;
  } else if (store === 'google' && p.icon512) {
    ICON = p.icon512;
  } else {
    ICON = p.icon;
  }
  if(typeof rasterizeSvgToStorePng === 'function' && typeof p.icon === 'string' && (p.icon.startsWith('data:image/svg+xml') || p.icon.includes('<svg'))){
    if(!p.icon1024){
      rasterizeSvgToStorePng(p.icon, 1024, png1024 => {
        p.icon1024 = png1024;
        if(store === 'apple' && !IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key){
          ICON = png1024;
          renderIcons();
        }
      });
    }
    if(!p.icon512){
      rasterizeSvgToStorePng(p.icon, 512, png512 => {
        p.icon512 = png512;
        if(store === 'google' && !IS_CUSTOM_ICON && CURRENT_PRESET_KEY === key){
          ICON = png512;
          renderIcons();
        }
      });
    }
  }
  IS_CUSTOM_FEATURE = false;
  FEATURE_GRAPHIC = p.featurePng || p.feature || DEFAULT_FEATURE;
  if(typeof rasterizeSvgToDimensions === 'function' && typeof p.feature === 'string' && (p.feature.startsWith('data:image/svg+xml') || p.feature.includes('<svg'))){
    if(!p.featurePng){
      rasterizeSvgToDimensions(p.feature, 1024, 500, png1024x500 => {
        p.featurePng = png1024x500;
        if(CURRENT_PRESET_KEY === key){
          FEATURE_GRAPHIC = png1024x500;
          renderFeature();
        }
      });
    }
  }
  SHOTS = [...p.shots];
  IPAD_SHOTS = [];
  if(typeof setSupportsIpad === 'function'){
    setSupportsIpad(!!p.supportsIpad);
  }
  REVIEWS = p.reviews ? JSON.parse(JSON.stringify(p.reviews)) : [];
  TABS.tab7 = []; TABS.tab10 = [];
  renderTablets();
  renderIcons();
  renderFeature();
  renderShots();
  if(typeof renderIpadShots === 'function') renderIpadShots();
  renderReviews();
  update();
  if(CURRENT_PRESET_KEY === 'draft'){
    saveState();
  }
  if(typeof updatePresetBanner === 'function') updatePresetBanner();
  if(typeof updateDraftPill === 'function') updateDraftPill();
  if(typeof updatePresetMenuSelection === 'function') updatePresetMenuSelection();
}

const btnReturn = $('btnReturnToDraft');
if(btnReturn){
  btnReturn.onclick = () => {
    loadPreset('draft');
  };
}

const btnDraft = $('btnDraft');
if(btnDraft){
  btnDraft.onclick = () => {
    if(CURRENT_PRESET_KEY !== 'draft'){
      loadPreset('draft');
    }
  };
}

const btnPresetPill = $('btnPresetPill');
if(btnPresetPill){
  btnPresetPill.onclick = () => {
    if(CURRENT_PRESET_KEY === 'draft'){
      loadPreset(CURRENT_ACTIVE_PRESET || 'studio');
    } else {
      const tModal = $('templatesModal');
      if(tModal){
        tModal.classList.add('open');
        tModal.setAttribute('aria-hidden', 'false');
      }
    }
  };
}

