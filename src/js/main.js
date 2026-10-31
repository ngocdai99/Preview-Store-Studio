// Store Preview Studio · Application Bootstrap & Lifecycle
// --- Dynamic Scaling / Responsive Zoom to Fit Window ---
let isExporting = false;
const isM=()=>innerWidth<=820;
function fit(){
  if(isExporting) return;
  const st=document.querySelector('.stage'),m=isM(),pad=m?20:40;
  const tb=document.querySelector('.stage-toolbar');
  const bb=document.querySelector('.stage-bottom-bar');
  const bbH=(bb && bb.offsetHeight > 0) ? bb.offsetHeight + 14 : 54;
  const vt=(tb?tb.offsetHeight:40) + bbH + (m?14:18) + 44;
  const isDual = document.body.dataset.dual === 'true' || appleDevice === 'dual' || googleDevice === 'dual';

  let baseW = 416, baseH = 870;
  if(isDual){
    const isLand = !!document.querySelector('.dev.apple.single.landscape');
    baseW = (isLand ? 870 : 416) * 2 + 28;
    baseH = isLand ? 416 : 870;
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

  const zw=(st.clientWidth-pad)/baseW;
  const zh=m?9:(st.clientHeight-pad-vt)/(baseH+8);
  const z=Math.max(.28,Math.min(1,zw,zh));

  const sd = $('stageDevices');
  if(sd) sd.style.gap = Math.round(28 * z) + 'px';

  if(!isDual && store === 'apple' && appleDevice === 'ipad'){
    const ipad = document.querySelector('.dev.ipad');
    if(ipad) ipad.style.zoom = z;
  }else if(!isDual && store === 'google' && googleDevice !== 'phone'){
    const t = $('dev-' + googleDevice);
    if(t) t.style.zoom = z;
  }else{
    $$('.dev:not(.ipad):not(.gtab)').forEach(d=>d.style.zoom=z);
  }
}
function setPanel(p){
  document.body.dataset.panel=p;
  $$('.mtabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
  requestAnimationFrame(fit);
}
$$('.mtabs button').forEach(b=>b.onclick=()=>setPanel(b.dataset.p));
const onStageResize = () => {
  fit();
  if (typeof syncAllVtPills === 'function') syncAllVtPills();
};
new ResizeObserver(onStageResize).observe(document.querySelector('.stage'));
addEventListener('resize', onStageResize);
addEventListener('orientationchange', () => setTimeout(onStageResize, 200));


// --- App Initialization ---
store = 'apple';
document.body.dataset.store = 'apple';
document.body.dataset.uiStore = 'apple';
document.body.dataset.dual = 'false';
if (typeof setStore === 'function') setStore('apple', false);
document.body.dataset.appleDevice = appleDevice;
document.body.dataset.googleDevice = googleDevice;
$$('[data-only]').forEach(e => e.classList.toggle('hide', e.dataset.only !== store));

if(typeof loadDraftFromStorage === 'function') loadDraftFromStorage();

if(typeof hasUserDraft === 'function' && hasUserDraft()){
  CURRENT_PRESET_KEY = 'draft';
  loadPreset('draft');
} else if(!loadState()){
  restoring = true;
  try{
    loadPreset('taskflow');
    if(typeof getCurrentStateObject === 'function'){
      userDraft = getCurrentStateObject();
      userDraft.isCustomized = true;
      if(typeof saveDraftToStorage === 'function') saveDraftToStorage();
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
fit();
setTimeout(syncAllVtPills, 10);
setTimeout(syncAllVtPills, 120);
window.addEventListener('load', syncAllVtPills);
if (typeof checkAndLoadStoreParams === 'function') {
  checkAndLoadStoreParams();
}

