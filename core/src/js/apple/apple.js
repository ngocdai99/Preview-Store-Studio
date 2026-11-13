// Store Preview Studio · Apple App Store & Devices
// --- Apple Device Mode & Store Switchers ---
let appleDevice = 'dual'; // 'iphone' | 'ipad' | 'dual'

function setAppleDevice(d, animate = true, preserveDual = false){
  if(d !== 'ipad' && d !== 'dual') d = 'iphone';
  const wasDual = document.body.dataset.dual === 'true';
  const nextDual = preserveDual ? true : (d === 'dual');
  if(appleDevice === d && document.body.dataset.appleDevice === d && wasDual === nextDual){
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    syncAllVtPills();
    return;
  }
  const curCard = document.querySelector('.editor .card.selected');
  const curCardId = curCard ? curCard.id : null;
  const applyState = () => {
    appleDevice = d;
    document.body.dataset.appleDevice = d === 'dual' ? 'iphone' : d;
    document.body.dataset.dual = nextDual ? 'true' : 'false';
    if(nextDual){
      googleDevice = 'dual';
    } else if(googleDevice === 'dual'){
      googleDevice = 'phone';
      document.body.dataset.googleDevice = 'phone';
    }
    const selApple = (d === 'dual' || nextDual) ? 'dual' : ((!d) ? 'iphone' : d);
    const selGoogle = (googleDevice === 'dual' || !googleDevice) ? 'phone' : googleDevice;
    if (typeof syncAppleTabButtons === 'function') {
      syncAppleTabButtons(selApple, nextDual);
    } else {
      $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === selApple));
    }
    $$('#gdt [data-gd]').forEach(b => b.classList.toggle('on', b.dataset.gd === selGoogle));
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s === 'apple'));
    const btn = $('btnDualPhone');
    if (btn) {
      btn.classList.toggle('on', nextDual);
      btn.setAttribute('aria-checked', nextDual ? 'true' : 'false');
    }
    const badge = $('stageDualBadge');
    if (badge) badge.style.display = nextDual ? 'inline-flex' : 'none';
    renderIcons();
    renderShots();
    if(typeof renderIpadShots === 'function') renderIpadShots();
    update();
    if(curCardId){
      const keepCard = $(curCardId);
      if(keepCard && !keepCard.classList.contains('hide')){
        $$('.editor .card').forEach(c => {
          if(c !== keepCard){
            c.classList.remove('selected');
            c.classList.add('collapsed');
          }
        });
        keepCard.classList.add('selected');
        keepCard.classList.remove('collapsed');
      }
    }
    if(typeof updateActivityBarState === 'function') updateActivityBarState();
    syncAppleNavScroll();
    if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
    if(typeof saveState === 'function') saveState(false);
  };
  transitionDevice('apple', d, applyState, animate);
  const activeAppleBtn = (d === 'dual' || nextDual) ? 'dual' : d;
  if (typeof syncAppleTabButtons === 'function') {
    syncAppleTabButtons(activeAppleBtn, nextDual);
  } else {
    $$('#dt [data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === activeAppleBtn));
  }
  if(typeof syncDeviceDropdowns === 'function') syncDeviceDropdowns();
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



