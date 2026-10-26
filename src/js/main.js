// Store Preview Studio · Application Bootstrap & Lifecycle
// --- Dynamic Scaling / Responsive Zoom to Fit Window ---
let isExporting = false;
const isM=()=>innerWidth<=820;
function fit(){
  if(isExporting) return;
  const st=document.querySelector('.stage'),m=isM(),pad=m?20:40;
  const tb=document.querySelector('.stage-toolbar');
  const vt=(tb?tb.offsetHeight:40)+(m?14:18);

  let baseW = 416, baseH = 870;
  if(store === 'apple'){
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

  if(store === 'apple' && appleDevice === 'ipad'){
    const ipad = document.querySelector('.dev.ipad');
    if(ipad) ipad.style.zoom = z;
  }else if(store === 'google' && googleDevice !== 'phone'){
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
    loadPreset('none');
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

