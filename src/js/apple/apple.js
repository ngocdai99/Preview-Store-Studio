// Store Preview Studio · Apple App Store & Devices
// --- Apple Device Mode & Store Switchers ---
let appleDevice = 'iphone'; // 'iphone' | 'ipad' | 'dual'

function setAppleDevice(d, animate = true){
  if(d !== 'ipad' && d !== 'dual') d = 'iphone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = d === 'dual';
  if(appleDevice === d && document.body.dataset.appleDevice === d && wasDual === nextDual){
    syncAllVtPills();
    return;
  }
  const applyState = () => {
    appleDevice = d;
    document.body.dataset.appleDevice = d === 'dual' ? 'iphone' : d;
    document.body.dataset.dual = nextDual ? 'true' : 'false';
    if(nextDual){
      googleDevice = 'dual';
    } else if(wasDual && googleDevice === 'dual'){
      googleDevice = 'phone';
      document.body.dataset.googleDevice = 'phone';
    }
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === googleDevice));
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === (nextDual ? 'dual' : 'apple')));
    renderIcons();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    update();
    syncAppleNavScroll();
    saveState();
  };
  if(nextDual || wasDual){
    clearDevTransitions();
    applyState();
    fit();
    syncAllVtPills();
    return;
  }
  transitionDevice('apple', d, applyState, animate);
  $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === d));
  syncAllVtPills();
}
$$('#dt [data-d]').forEach(b => b.onclick = () => setAppleDevice(b.dataset.d));

// iOS App Icon Info Popover
initInfoPopover("iosIconInfoBtn", "iosIconInfoPop", "iosIconInfoClose", "apple");

// --- iPhone Detail View Header Dynamic Scroll Animation ---
function syncAppleNavScroll(){
  document.querySelectorAll('.phone.apple:not(.ipad) .scr').forEach(scr => {
    const nav = scr.querySelector('.a-nav');
    if(nav) nav.classList.toggle('scrolled', scr.scrollTop > 45);
  });
}

function initAppleNavScroll(){
  document.querySelectorAll('.phone.apple:not(.ipad) .scr').forEach(scr => {
    const nav = scr.querySelector('.a-nav');
    if(!nav) return;

    scr.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', scr.scrollTop > 45);
    }, { passive: true });
    nav.classList.toggle('scrolled', scr.scrollTop > 45);

    const backBtn = nav.querySelector('.a-nav-back');
    if(backBtn){
      backBtn.addEventListener('click', () => {
        if(scr.scrollTop > 0){
          scr.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  });
}
initAppleNavScroll();

// --- iPad Floating Bottom Pill on Scroll ---
function initIpadFloatingPill(){
  const ipadScr = document.querySelector('.phone.ipad .scr');
  const pill = document.getElementById('ipadFloatingPill');
  if(!ipadScr || !pill) return;

  ipadScr.addEventListener('scroll', () => {
    pill.classList.toggle('visible', ipadScr.scrollTop > 180);
  }, { passive: true });
  pill.classList.toggle('visible', ipadScr.scrollTop > 180);
}
initIpadFloatingPill();

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

  // Clicking Search Clear button (X) returns to Detail View
  document.querySelectorAll('.sr-search-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof setView === 'function') setView('detail');
    });
  });
}
initAppleTabs();



