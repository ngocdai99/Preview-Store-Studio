// Store Preview Studio · Form Synchronization & Validation Loop

// Official Character Limits per Store
const LIMITS = {
  name: ()=>30,
  sub: ()=>30,
  promo: ()=>170,
  short: ()=>80,
  new: ()=>store==='google'?500:4000,
  desc: ()=>4000
};

// Initialize progress meters under each field
$$('.fg').forEach(g=>{
  if(g.querySelector('.cc') && !g.querySelector('.meter')){
    const m=document.createElement('div');
    m.className='meter';
    m.innerHTML='<i></i>';
    g.appendChild(m);
  }
});

function update(){
  // Update Fields with character limits
  for(const k in LIMITS){
    const inp = $('f-'+k);
    if(!inp) continue;
    const v = inp.value;
    const max = LIMITS[k]();
    const c = $('c-'+k);
    const fg = inp.closest('.fg');
    const mt = fg ? fg.querySelector('.meter') : null;

    if(c){
      const vLen = countChars(v);
      c.textContent = vLen + ' / ' + max;
      const isExceeded = vLen > max;
      const isWarning = !isExceeded && vLen >= max * 0.9;

      c.className = 'cc' + (isExceeded ? ' err' : isWarning ? ' warn' : '');
      if(fg){
        fg.classList.toggle('overlimit', isExceeded);
        fg.classList.toggle('warning', isWarning);
      }
      if(mt){
        mt.className = 'meter' + (isExceeded ? ' err' : isWarning ? ' warn' : '');
        mt.firstChild.style.width = Math.min(100, (vLen / max) * 100) + '%';
      }
    }

    // Synchronize to Mockup Displays (clamped to official store limits)
    $$('[data-b="'+k+'"]').forEach(e => {
      const fallback = k==='name' ? 'App Name' : (k==='sub' ? 'App Subtitle' : (k==='short' ? 'Short description...' : (k==='desc' ? 'App description goes here...' : (k==='new' ? 'Release notes...' : (k==='promo' ? 'Special offer, seasonal update, or headline...' : '')))));
      let elemMax = max;
      if(k === 'new'){
        elemMax = e.closest('.dev.google, .dev.gtab') ? 500 : 4000;
      }
      const displayVal = (elemMax && v) ? (typeof clampGraphemes === 'function' ? clampGraphemes(v, elemMax) : v.slice(0, elemMax)) : (v || fallback);
      e.textContent = displayVal || fallback;
    });
  }

  // Developer, Category, Version, Release Date, Support Email & Location dynamic bindings
  const devVal = ($('f-dev') && $('f-dev').value.trim()) || 'Developer Name';
  const catVal = ($('f-cat') && $('f-cat').value.trim()) || 'Category';
  const appleCatVal = (typeof CAT === 'object' && CAT.apple) ? CAT.apple.replace(/^Games · /, '') : catVal;
  const googleCatVal = (typeof CAT === 'object' && CAT.google) ? CAT.google.replace(/^Games · /, '') : catVal;
  const verVal = ($('f-ver') && $('f-ver').value.trim()) || '1.0.0';
  const rdateVal = ($('f-rdate') && $('f-rdate').value.trim()) || (typeof getCurrentMonthDateStr === 'function' ? getCurrentMonthDateStr(2, true) : 'Current Date');
  const emailVal = ($('f-email') && $('f-email').value.trim()) || 'support@domain.com';
  const phoneVal = ($('f-phone') && $('f-phone').value.trim()) || '+1 800-555-0199';
  const addrVal = ($('f-addr') && $('f-addr').value.trim()) || 'Vietnam';
  $$('[data-b="dev"]').forEach(e=>e.textContent=devVal);
  $$('[data-b="cat"]').forEach(e=>{
    const isGoogle = !!e.closest('.dev.google, .dev.gtab');
    e.textContent = (isGoogle ? googleCatVal : appleCatVal) || catVal;
  });
  $$('[data-b="ver"]').forEach(e=>e.textContent=verVal);
  $$('[data-b="rdate"]').forEach(e=>e.textContent=rdateVal);
  $$('[data-b="email"]').forEach(e=>e.textContent=emailVal);
  $$('[data-b="phone"]').forEach(e=>e.textContent=phoneVal);
  $$('[data-b="addr"]').forEach(e=>e.textContent=addrVal);

  if (typeof updateMockupClocks === 'function') updateMockupClocks();

  // Toggle Promotional Text banner in Apple Detail (both iPhone and iPad)
  const hasPromo = !!($('f-promo') && $('f-promo').value.trim());
  if($('promoBox')) $('promoBox').style.display = hasPromo ? 'block' : 'none';
  $$('.promo[data-b="promo"]').forEach(el => { el.style.display = hasPromo ? 'block' : 'none'; });

  // Render App Privacy & Data Safety
  if (typeof renderPrivacy === 'function') renderPrivacy();
  if (typeof renderReviews === 'function') renderReviews();

  // Re-sync focus highlight if field is currently active
  if (typeof setFieldFocus === 'function' && activeFieldFocusKey) {
    setFieldFocus(activeFieldFocusKey, false);
  }
}

// --- Field ↔ Device Mockup Focus & Scroll Linking ---
function getFieldMockupTargets(key) {
  if (!key) return [];
  switch (key) {
    case 'name':
      return $$('.stage [data-b="name"]');
    case 'sub':
      return $$('.stage [data-b="sub"]');
    case 'promo':
      return $$('.stage [data-b="promo"], .stage #promoBox');
    case 'short':
      return $$('.stage [data-b="short"]');
    case 'desc':
      return $$('.stage [data-b="desc"]:not([hidden]), .stage .g-desc-arrow');
    case 'new':
      return $$('.stage [data-b="new"]:not([hidden])');
    case 'dev':
      return $$('.stage [data-b="dev"]');
    case 'cat':
    case 'cat-apple':
    case 'cat-google':
      return $$('.stage [data-b="cat"]');
    case 'ver': {
      const verWraps = $$('.stage .wn-ver');
      return verWraps.length ? verWraps : $$('.stage [data-b="ver"]');
    }
    case 'rdate':
      return $$('.stage [data-b="rdate"]');
    case 'email':
      return $$('.stage [data-b="email"]');
    case 'phone':
      return $$('.stage [data-b="phone"]');
    case 'addr':
      return $$('.stage [data-b="addr"]');
    case 'icon':
      return $$('.stage [data-icon]');
    case 'shots':
      return $$('.stage .gal, .stage [data-shots]');
    case 'privacy':
      return $$('.stage [data-google-safety], .stage [data-apple-priv-wrap]');
    case 'priv-google':
      return $$('.stage [data-google-safety]');
    case 'priv-linked':
      return $$('.stage [data-apple-priv-wrap] .pc:first-child, .stage [data-apple-priv-wrap]');
    case 'priv-notlinked':
      return $$('.stage [data-apple-priv-wrap] .pc:last-child, .stage [data-apple-priv-wrap]');
    case 'reviews':
      return $$('.stage .reviews, .stage .ratings-reviews, .stage .a-rev, .stage .g-rev');
    default:
      return $$('.stage [data-b="' + key + '"]');
  }
}

let activeFieldFocusKey = null;

function setFieldFocus(key, shouldScroll = true) {
  activeFieldFocusKey = key;
  
  // Clear previous focus highlight on all targets
  $$('.stage .hl-target').forEach(el => el.classList.remove('hl-target'));

  if (!key) return;

  const targets = getFieldMockupTargets(key);
  if (!targets.length) return;

  // Add highlight border to all matching targets
  targets.forEach(el => el.classList.add('hl-target'));

  if (!shouldScroll) return;

  // Smoothly scroll active device screens (.scr) to the target position
  targets.forEach(target => {
    const dev = target.closest('.dev');
    if (!dev) return;
    
    // Check if device mockup is currently visible
    const devStyle = window.getComputedStyle(dev);
    if (devStyle.display === 'none' || devStyle.visibility === 'hidden' || parseFloat(devStyle.opacity) === 0) {
      return;
    }
    // Check if target element itself is rendered
    if (target.offsetParent === null && target.offsetWidth === 0 && target.offsetHeight === 0) {
      return;
    }

    // Scroll the device's inner screen (.scr)
    const scr = target.closest('.scr');
    if (scr) {
      const scrRect = scr.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Relative position within scroll container
      const relativeTop = (targetRect.top - scrRect.top) + scr.scrollTop;
      
      // Center the target element in the visible height of the phone/tablet screen
      const targetCenter = relativeTop - (scr.clientHeight / 2) + (targetRect.height / 2);
      const scrollToY = Math.max(0, targetCenter);

      scr.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      });
    }
  });
}

function flashField(key) {
  if (!key) return;
  const targets = getFieldMockupTargets(key);
  targets.forEach(el => {
    el.classList.remove('hl-flash');
    void el.offsetWidth;
    el.classList.add('hl-flash');
    clearTimeout(el._flashTimer);
    el._flashTimer = setTimeout(() => {
      el.classList.remove('hl-flash');
    }, 1150);
  });
}

function initFieldFocusLinking() {
  const formElements = $$('.editor input, .editor textarea, .editor select');
  formElements.forEach(input => {
    const rawId = input.id || '';
    if (rawId === 'f-st-off' || rawId === 'f-st-wm') return;
    let key = '';
    if (rawId.startsWith('f-')) {
      key = rawId.replace('f-', '');
    } else if (rawId.startsWith('sw-')) {
      key = 'privacy';
    }

    if (key.startsWith('cat')) key = 'cat';

    if (!key) return;

    input.addEventListener('focus', () => {
      setFieldFocus(key, true);
    });

    input.addEventListener('blur', () => {
      setFieldFocus(null);
    });

    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        flashField(key);
        setFieldFocus(key, true);
      });
    }
  });

  // App icon interaction zones
  const iconZones = $$('#icoDropZone, #icoUp, #icoFile, #iconStatusBadge, #dropApple, #dropGoogle');
  iconZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('icon', true));
    el.addEventListener('blur', () => setFieldFocus(null));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('icon', true);
    });
    el.addEventListener('mouseleave', () => {
      if (activeFieldFocusKey === 'icon') setFieldFocus(null);
    });
  });

  // Screenshots dropzones
  const shotZones = $$('#dropZ, #dropZ-ipad, #dropZ-tab7, #dropZ-tab10, .drop-shots');
  shotZones.forEach(el => {
    el.addEventListener('focus', () => setFieldFocus('shots', true));
    el.addEventListener('blur', () => setFieldFocus(null));
    el.addEventListener('mouseenter', () => {
      if (!activeFieldFocusKey) setFieldFocus('shots', true);
    });
    el.addEventListener('mouseleave', () => {
      if (activeFieldFocusKey === 'shots') setFieldFocus(null);
    });
  });
}

// Bind input listeners
$$('input[type=text],textarea').forEach(e => {
  e.addEventListener('input', () => {
    update();
    const rawId = e.id || '';
    if (rawId.startsWith('f-')) {
      flashField(rawId.replace('f-', ''));
    }
    if(typeof handleUserFormEdit === 'function'){
      handleUserFormEdit();
    } else {
      debouncedSave();
    }
  });
});

function initPrivacyBanner() {
  const banner = $('privacyMockBanner');
  if (banner) {
    banner.addEventListener('click', () => {
      setFieldFocus('privacy', true);
    });
    banner.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFieldFocus('privacy', true);
      }
    });
  }
}

function initDescFeatures() {
  initFieldFocusLinking();
  initPrivacyBanner();
  if (typeof initInfoPopover === 'function') {
    initInfoPopover("descInfoBtn", "descInfoPop", "descInfoClose");
    initInfoPopover("privacyInfoBtn", "privacyInfoPop", "privacyInfoClose");
    initInfoPopover("whatsNewInfoBtn", "whatsNewInfoPop", "whatsNewInfoClose");
    initInfoPopover("metricsInfoBtn", "metricsInfoPop", "metricsInfoClose");
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDescFeatures);
} else {
  initDescFeatures();
}
