// Store Preview Studio · Preset Template Switcher
// --- Preset Switcher ---
const PRESET_ICONS = {
  none: BLANK_ICON,
  taskflow: DEFAULT_ICON,
  pulsefit: PULSEFIT_ICON,
  zenmind: ZENMIND_ICON,
  /* @pro-only-start */
  cyberstrike: CYBER_ICON,
  edulearn: SKILL_ICON
  /* @pro-only-end */
};

function initPresetThumbnails() {
  $$('#menuPresets [data-preset]').forEach(b => {
    const key = b.dataset.preset;
    const img = b.querySelector('.preset-thumb');
    if (img && PRESET_ICONS[key]) {
      img.src = PRESET_ICONS[key];
    }
  });
}
initPresetThumbnails();

$$('[data-preset]').forEach(b=>{
  b.onclick=()=>{
    const pKey=b.dataset.preset;
    loadPreset(pKey);
  };
});

function loadPreset(key){
  if(key === 'none'){
    $('f-name').value = '';
    $('f-sub').value = '';
    $('f-promo').value = '';
    $('f-short').value = '';
    $('f-dev').value = '';
    setCategory('');
    $('f-keywords').value = '';
    if($('f-ver')) $('f-ver').value = '1.0.0';
    if($('f-rdate')) $('f-rdate').value = getCurrentMonthDateStr(2, true);
    if($('f-email')) $('f-email').value = '';
    if($('f-phone')) $('f-phone').value = '';
    if($('f-addr')) $('f-addr').value = '';
    if($('f-priv-linked')) $('f-priv-linked').value = '';
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = '';
    if($('f-priv-google')) $('f-priv-google').value = '';
    CURRENT_PRIVACY = { linked: '', notLinked: '', google: '' };
    $('f-new').value = '';
    $('f-desc').value = '';
    ICON = BLANK_ICON;
    FEATURE_GRAPHIC = BLANK_FEATURE;
    SHOTS = [];
    IPAD_SHOTS = [];
    REVIEWS = [];
    TABS.tab7 = []; TABS.tab10 = [];
    Object.assign(STATS, STATS_DEFAULT);
    syncStatInputs();
    renderStats();
    renderTablets();
    renderIcons();
    renderFeature();
    renderShots();
    renderReviews();
    update();
    saveState();
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
  $('f-keywords').value = p.keywords;
  if($('f-ver')) $('f-ver').value = key === 'cyberstrike' ? '4.2.0' : (key === 'pulsefit' ? '3.1.2' : (key === 'zenmind' ? '1.8.0' : (key === 'edulearn' ? '4.1.0' : '2.4.0')));
  if($('f-rdate')) $('f-rdate').value = (p && p.rdate) ? p.rdate : getCurrentMonthDateStr(2, true);
  if($('f-email')) $('f-email').value = (p && p.email) ? p.email : (key === 'cyberstrike' ? 'support@omniarcade.games' : (key === 'pulsefit' ? 'support@pulsefit.io' : (key === 'zenmind' ? 'hello@zenmind.app' : (key === 'edulearn' ? 'support@skillsphere.edu' : 'support@flowcraft.studio'))));
  if($('f-phone')) $('f-phone').value = (p && p.phone) ? p.phone : (key === 'cyberstrike' ? '+81 3 5555 0188' : (key === 'pulsefit' ? '+1 888-555-0142' : (key === 'zenmind' ? '+1 800-555-0177' : (key === 'edulearn' ? '+44 20 7946 0912' : '+1 800-555-0199'))));
  if($('f-addr')) $('f-addr').value = (p && p.addr) ? p.addr : (key === 'cyberstrike' ? 'Tokyo, Japan' : (key === 'edulearn' ? 'San Francisco, CA' : 'Vietnam'));
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
  ICON = p.icon;
  FEATURE_GRAPHIC = p.feature || DEFAULT_FEATURE;
  SHOTS = [...p.shots];
  IPAD_SHOTS = [];
  REVIEWS = p.reviews ? JSON.parse(JSON.stringify(p.reviews)) : [];
  TABS.tab7 = []; TABS.tab10 = [];
  renderTablets();
  renderIcons();
  renderFeature();
  renderShots();
  renderReviews();
  update();
  saveState();
}

