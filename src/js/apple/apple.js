// Store Preview Studio · Apple App Store & Devices
// --- Apple Device Mode & Store Switchers ---
let appleDevice = 'iphone'; // 'iphone' | 'ipad'
let ipadOrient = 'portrait'; // 'portrait' | 'landscape'
let iphoneOrient = 'portrait'; // 'portrait' | 'landscape'

function applyIpadOrient(){
  const ipad = document.querySelector('.dev.ipad');
  if(ipad) ipad.classList.toggle('landscape', ipadOrient === 'landscape');
}

function applyIphoneOrient(){
  const iphone = document.querySelector('.dev.apple.single');
  if(iphone) iphone.classList.toggle('landscape', iphoneOrient === 'landscape');
}

function setAppleDevice(d, animate = true){
  if(d !== 'ipad') d = 'iphone';
  if(appleDevice === d && document.body.dataset.appleDevice === d){
    syncAllVtPills();
    return;
  }
  transitionDevice('apple', d, () => {
    appleDevice = d;
    document.body.dataset.appleDevice = d;
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
    renderIcons();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    update();
    syncAppleNavScroll();
    saveState();
  }, animate);
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
  syncAllVtPills();
}
$$('#dt [data-d]').forEach(b => b.onclick = () => setAppleDevice(b.dataset.d));
$('adRotate').onclick = () => {
  if(appleDevice === 'ipad'){
    ipadOrient = ipadOrient === 'landscape' ? 'portrait' : 'landscape';
    applyIpadOrient();
    requestAnimationFrame(() => { fit(); syncAllVtPills(); });
    saveState();
  } else {
    iphoneOrient = iphoneOrient === 'landscape' ? 'portrait' : 'landscape';
    applyIphoneOrient();
    requestAnimationFrame(() => { fit(); syncAllVtPills(); });
    saveState();
  }
};

// iOS App Icon Info Popover
initInfoPopover("iosIconInfoBtn", "iosIconInfoPop", "iosIconInfoClose", "apple");

// --- iPhone Detail View Header Dynamic Scroll Animation ---
function syncAppleNavScroll(){
  const scr = document.querySelector('.dev.apple.single .scr');
  if(!scr) return;
  const nav = scr.querySelector('.a-nav');
  if(nav) nav.classList.toggle('scrolled', scr.scrollTop > 75);
}

function initAppleNavScroll(){
  const scr = document.querySelector('.dev.apple.single .scr');
  if(!scr) return;
  const nav = scr.querySelector('.a-nav');
  if(!nav) return;

  scr.addEventListener('scroll', syncAppleNavScroll, { passive: true });
  syncAppleNavScroll();

  const backBtn = nav.querySelector('.a-nav-back');
  if(backBtn){
    backBtn.addEventListener('click', () => {
      if(scr.scrollTop > 0){
        scr.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
initAppleNavScroll();

// --- iPhone Tab Navigation Interactive Switcher ---
function initAppleTabs(){
  document.querySelectorAll('.dev.apple .tab').forEach(tabBar => {
    const items = tabBar.querySelectorAll(':scope > div');
    if(items.length >= 5){
      items[2].addEventListener('click', () => {
        if(typeof setView === 'function') setView('detail');
      });
      items[4].addEventListener('click', () => {
        if(typeof setView === 'function') setView('search');
      });
    }
  });
}
initAppleTabs();



