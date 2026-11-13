// Store Preview Studio · Application Bootstrap & Lifecycle
// --- Dynamic Scaling / Responsive Zoom to Fit Window ---
let isExporting = false;
function fit(force = false){
  if(isExporting) return;
  const st=document.querySelector('.stage');
  if(!st) return;
  const m=isM();
  const padW=m?24:48;
  const padH=m?16:28;
  const tb=document.querySelector('.stage-toolbar');
  const bb=document.querySelector('.stage-bottom-bar');
  const isBbVis = bb && bb.offsetHeight > 0 && (!bb.style.display || bb.style.display !== 'none');
  const bbH=isBbVis ? bb.offsetHeight + 4 : 0;
  const vt=(tb?tb.offsetHeight:38) + bbH + (m?12:20) + 40;
  const isDual = document.body.dataset.dual === 'true' || appleDevice === 'dual' || googleDevice === 'dual';

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
  }else if(store === 'apple'){
    if(appleDevice === 'ipad'){
      baseW = 750;
      baseH = 980;
    } else {
      baseW = 416;
      baseH = 870;
    }
  }else if(googleDevice !== 'phone'){
    const land = tabOrient[googleDevice] === 'landscape';
    const [lw, lh] = googleDevice === 'tab7' ? [800, 512] : [1060, 676];
    baseW = land ? lw : lh;
    baseH = land ? lh : lw;
  } else {
    baseW = 416;
    baseH = 870;
  }

  const zw=(st.clientWidth-padW)/baseW;
  const zh=m?9:(st.clientHeight-padH-vt)/(baseH+8);
  const z=Math.max(.28,Math.min(1,zw,zh));

  const lastZ = parseFloat(st.dataset.fitZ || '0');
  if(!force && Math.abs(z - lastZ) < 0.001) return;
  st.dataset.fitZ = z.toFixed(4);

  const sd = $('stageDevices');
  if(sd){
    if(isDual && m){
      sd.style.gap = '56px';
    }else{
      sd.style.gap = Math.round(28 * z) + 'px';
    }
  }

  document.documentElement.style.setProperty('--dev-zoom', z);

  if(!isDual && store === 'apple' && appleDevice === 'ipad'){
    const ipad = document.querySelector('.dev.ipad');
    if(ipad) {
      ipad.style.zoom = z;
      ipad.style.setProperty('--dev-zoom', z);
    }
  }else if(!isDual && store === 'google' && googleDevice !== 'phone'){
    const t = $('dev-' + googleDevice);
    if(t) {
      t.style.zoom = z;
      t.style.setProperty('--dev-zoom', z);
    }
  }else{
    $$('.dev:not(.ipad):not(.gtab)').forEach(d => {
      d.style.zoom = z;
      d.style.setProperty('--dev-zoom', z);
    });
  }
}
function setPanel(p){
  document.body.dataset.panel=p;
  $$('.mtabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
  if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
  requestAnimationFrame(fit);
}
$$('.mtabs button').forEach(b=>b.onclick=()=>setPanel(b.dataset.p));
let resizeRaf = null;
const onStageResize = () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null;
    fit();
    if (typeof syncAllVtPills === 'function') syncAllVtPills();
    if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
  });
};
new ResizeObserver(onStageResize).observe(document.querySelector('.stage'));
addEventListener('resize', onStageResize);
addEventListener('orientationchange', () => setTimeout(onStageResize, 200));


// --- App Initialization ---
store = 'apple';
document.body.dataset.store = 'apple';
document.body.dataset.uiStore = 'apple';
document.body.dataset.dual = 'true';
appleDevice = 'dual';
googleDevice = 'dual';
document.body.dataset.appleDevice = 'iphone';
document.body.dataset.googleDevice = 'phone';
if (typeof setStore === 'function') setStore('apple', false, true);
$$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== store));
if (typeof syncActivityBarVisibility === 'function') syncActivityBarVisibility(store);
if (typeof updateActivityBarState === 'function') updateActivityBarState(store);

// Check if URL specifies an incoming app to auto-load
let initialUrlAppId = null;
try {
  let searchStr = (window.location && window.location.search) ? window.location.search : '';
  if (!searchStr || searchStr === '?embed=true' || searchStr === '?embed=1' || searchStr === '?embed=true&') {
    if (window.parent && window.parent !== window) {
      try {
        const parentSearch = window.parent.location.search;
        if (parentSearch) searchStr = parentSearch;
      } catch (_) {}
    }
  }
  if (searchStr) {
    const sp = new URLSearchParams(searchStr);
    const rawId = sp.get('appid') || sp.get('apple') || sp.get('app_id') || sp.get('apple_id') || sp.get('id') || sp.get('app');
    if (rawId) initialUrlAppId = rawId.replace(/^id/i, '').trim();
  }
} catch (_) {}

if(typeof loadDraftFromStorage === 'function') loadDraftFromStorage();

// If URL has appid, try restoring from sessionStorage/localStorage cache for instant reload without network latency
if (initialUrlAppId) {
  try {
    const ssRaw = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('sps_store_app_' + initialUrlAppId) : null;
    const lsRaw = (typeof localStorage !== 'undefined') ? localStorage.getItem('sps_store_app_' + initialUrlAppId) : null;
    const candidates = [ssRaw, lsRaw].map(r => {
      if (!r) return null;
      try {
        const parsed = JSON.parse(r);
        return (parsed && typeof parsed === 'object') ? parsed : null;
      } catch (_) { return null; }
    }).filter(Boolean);
    if (userDraft && String(userDraft.appId || userDraft.appleId || '').trim() === initialUrlAppId) {
      candidates.push(userDraft);
    }
    if (candidates.length) {
      candidates.sort((a, b) => (b._savedAt || 0) - (a._savedAt || 0));
      userDraft = candidates[0];
      CURRENT_APP_ID = initialUrlAppId;
      if (typeof window !== 'undefined') window.CURRENT_APP_ID = CURRENT_APP_ID;
    }
  } catch (_) {}
}

let __bootHandled = false;
if (typeof isDemoMode === 'function' && isDemoMode()) {
  __bootHandled = true;
  if (initialUrlAppId) {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.removeItem('sps_demo_dismissed_draft'); } catch (_) {}
      try { localStorage.setItem('sps_demo_last_appid', initialUrlAppId); } catch (_) {}
    }
    if (userDraft && (String(userDraft.appId || userDraft.appleId || '').trim() === initialUrlAppId)) {
      CURRENT_APP_ID = initialUrlAppId;
      if (typeof window !== 'undefined') window.CURRENT_APP_ID = initialUrlAppId;
      CURRENT_PRESET_KEY = 'draft';
      CURRENT_ACTIVE_PRESET = 'studio';
      loadPreset('draft');
    } else {
      userDraft = null;
      CURRENT_APP_ID = initialUrlAppId;
      if (typeof window !== 'undefined') window.CURRENT_APP_ID = initialUrlAppId;
      CURRENT_PRESET_KEY = 'draft';
      loadPreset('none');
      if (typeof setStageImportLoading === 'function') setStageImportLoading(true);
      CURRENT_PRESET_KEY = 'draft';
      CURRENT_ACTIVE_PRESET = 'studio';
    }
    if (typeof toggleDualPhone === 'function') {
      toggleDualPhone(true, false);
    }
  } else {
    let restoredFromAppId = false;
    const dismissedDraft = (typeof localStorage !== 'undefined') && localStorage.getItem('sps_demo_dismissed_draft') === '1';
    if (!dismissedDraft && typeof localStorage !== 'undefined') {
      const savedDemoId = (localStorage.getItem('sps_demo_last_appid') || '').trim();
      const vipIdRaw = (localStorage.getItem('sps_agency_vip') || '').trim();
      const vipAppId = (vipIdRaw && vipIdRaw !== '39' && vipIdRaw !== 'agency39') ? vipIdRaw.replace(/^id/i, '').trim() : '';
      const targetDemoId = savedDemoId || vipAppId;

      if (targetDemoId) {
        CURRENT_APP_ID = targetDemoId;
        if (typeof window !== 'undefined') window.CURRENT_APP_ID = targetDemoId;
        const curDraftId = (userDraft && (userDraft.appId || userDraft.appleId))
          ? String(userDraft.appId || userDraft.appleId).trim()
          : '';
        if (!userDraft || curDraftId !== targetDemoId) {
          try {
            const ssRaw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sps_store_app_' + targetDemoId) : null;
            const lsRaw = localStorage.getItem('sps_store_app_' + targetDemoId);
            const rawCache = ssRaw || lsRaw;
            if (rawCache) {
              const parsedCache = JSON.parse(rawCache);
              if (parsedCache && typeof parsedCache === 'object') {
                userDraft = parsedCache;
              }
            }
          } catch (_) {}
        }
      }

      if (typeof hasUserDraft === 'function' && hasUserDraft()) {
        CURRENT_PRESET_KEY = 'draft';
        CURRENT_ACTIVE_PRESET = 'studio';
        loadPreset('draft');
        if (typeof toggleDualPhone === 'function') {
          toggleDualPhone(true, false);
        }
        restoredFromAppId = true;
      } else if (targetDemoId) {
        userDraft = null;
        CURRENT_PRESET_KEY = 'draft';
        loadPreset('none');
        if (typeof setStageImportLoading === 'function') setStageImportLoading(true);
        CURRENT_PRESET_KEY = 'draft';
        CURRENT_ACTIVE_PRESET = 'studio';
        if (typeof toggleDualPhone === 'function') {
          toggleDualPhone(true, false);
        }
        restoredFromAppId = true;
      }
    }

    if (!restoredFromAppId) {
      // In demo mode (/try), if not navigating with appid and no saved appid, default auto-pick Store Preview Studio
      isPresetModified = false;
      userDraft = null;
      CURRENT_PRESET_KEY = 'studio';
      CURRENT_ACTIVE_PRESET = 'studio';
      restoring = true;
      try {
        loadPreset('studio');
        if (typeof toggleDualPhone === 'function') {
          toggleDualPhone(true, false);
        }
      } finally {
        restoring = false;
      }
    }
  }
}
if (__bootHandled) {
} else if(typeof sessionStorage !== 'undefined' && sessionStorage.getItem('sps_reset_to_blank')){
  try{ sessionStorage.removeItem('sps_reset_to_blank'); }catch(_){}
  isPresetModified = false;
  userDraft = null;
  CURRENT_PRESET_KEY = 'studio';
  CURRENT_ACTIVE_PRESET = 'studio';
  restoring = true;
  try{
    loadPreset('studio');
    if(typeof toggleDualPhone === 'function'){
      toggleDualPhone(true, false);
    }
  }finally{
    restoring = false;
  }
} else if(initialUrlAppId){
  if(userDraft && (String(userDraft.appId || userDraft.appleId).trim() === initialUrlAppId)){
    CURRENT_PRESET_KEY = 'draft';
    CURRENT_ACTIVE_PRESET = 'studio';
    loadPreset('draft');
  } else {
    // URL has an app ID: stay in draft mode with clean slate so studio preset is never loaded or flashed
    CURRENT_PRESET_KEY = 'draft';
    loadPreset('none');
    CURRENT_PRESET_KEY = 'draft';
    CURRENT_ACTIVE_PRESET = 'studio';
  }
  if(typeof toggleDualPhone === 'function'){
    toggleDualPhone(true, false);
  }
} else if(typeof hasUserDraft === 'function' && hasUserDraft()){
  CURRENT_PRESET_KEY = 'draft';
  loadPreset('draft');
} else if(!loadState()){
  restoring = true;
  try{
    loadPreset('studio');
    if(typeof toggleDualPhone === 'function'){
      toggleDualPhone(true, false);
    }
  }finally{
    restoring = false;
  }
} else {
  if(typeof initDraftFromCurrentPreset === 'function') initDraftFromCurrentPreset();
  renderIcons();
  renderFeature();
  renderShots();
  renderIpadShots();
  update();
}
if(typeof updatePresetBanner === 'function') updatePresetBanner();
if(typeof updateDraftPill === 'function') updateDraftPill();
setSupportsIpad(SUPPORTS_IPAD);
syncStatInputs();
renderStats();
applyGoogleDevice();
applyTabOrient();
renderTablets();
if(typeof renderReviews === 'function') renderReviews();
if(typeof syncReviewInputs === 'function') syncReviewInputs();
if($('f-rdate') && !$('f-rdate').value){
  $('f-rdate').value = getCurrentMonthDateStr(2, true);
}
if(typeof updateMockupClocks === 'function'){
  updateMockupClocks();
  window.addEventListener('DOMContentLoaded', updateMockupClocks);
  window.addEventListener('load', updateMockupClocks);
}
setInterval(() => { if(typeof updateMockupClocks === 'function') updateMockupClocks(); }, 10000);
if(typeof setStore === 'function'){
  setStore('apple', false, true);
}
if(typeof toggleDualPhone === 'function'){
  toggleDualPhone(true, false);
}
if(typeof setView === 'function'){
  setView('detail', true);
}
if(typeof syncDeviceDropdowns === 'function'){
  syncDeviceDropdowns();
}
if (typeof syncActivityBarVisibility === 'function') syncActivityBarVisibility(store);
if (typeof updateActivityBarState === 'function') updateActivityBarState(store);
fit();
setTimeout(syncAllVtPills, 10);
setTimeout(syncAllVtPills, 120);
window.addEventListener('load', syncAllVtPills);
if (typeof checkAndLoadStoreParams === 'function') {
  checkAndLoadStoreParams();
}

