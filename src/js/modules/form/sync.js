// Store Preview Studio · Form Synchronization & Validation Loop

// Official Character Limits per Store
const LIMITS = {
  name: ()=>30,
  sub: ()=>30,
  promo: ()=>170,
  short: ()=>80,
  keywords: ()=>100,
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

    // Synchronize to Mockup Displays
    $$('[data-b="'+k+'"]').forEach(e => {
      const fallback = k==='name' ? 'App Name' : (k==='sub' ? 'App Subtitle' : (k==='short' ? 'Short description...' : (k==='desc' ? 'App description goes here...' : (k==='new' ? 'Release notes...' : ''))));
      e.textContent = v || fallback;
    });
  }

  // Developer, Category, Version, Release Date, Support Email & Location dynamic bindings
  const devVal = ($('f-dev') && $('f-dev').value.trim()) || 'Developer Name';
  const catVal = ($('f-cat') && $('f-cat').value.trim()) || 'Category';
  const verVal = ($('f-ver') && $('f-ver').value.trim()) || '1.0.0';
  const rdateVal = ($('f-rdate') && $('f-rdate').value.trim()) || (typeof getCurrentMonthDateStr === 'function' ? getCurrentMonthDateStr(2, true) : 'Current Date');
  const emailVal = ($('f-email') && $('f-email').value.trim()) || 'support@domain.com';
  const phoneVal = ($('f-phone') && $('f-phone').value.trim()) || '+1 800-555-0199';
  const addrVal = ($('f-addr') && $('f-addr').value.trim()) || 'Vietnam';
  $$('[data-b="dev"]').forEach(e=>e.textContent=devVal);
  $$('[data-b="cat"]').forEach(e=>e.textContent=catVal);
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

  // Dynamic Google Play Keyword Chips (derived from first 2 comma-separated keywords)
  const kwRaw = ($('f-keywords') && $('f-keywords').value) || '';
  const kwList = kwRaw.split(',').map(s => s.trim()).filter(Boolean).map(w => {
    return w.split(/\s+/).map(part => {
      if(/^(ai|rpg|hiit|pvp|ar|vr|3d|hd|ui|ux|ios|api|sql)$/i.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(' ');
  });
  $$('[data-kw-chip]').forEach(el => {
    const idx = parseInt(el.dataset.kwChip, 10) || 0;
    const val = kwList[idx] || '';
    el.textContent = val;
    el.style.display = val ? '' : 'none';
  });

  // Render App Privacy & Data Safety
  if (typeof renderPrivacy === 'function') renderPrivacy();
  if (typeof renderReviews === 'function') renderReviews();
}

$$('input[type=text],textarea').forEach(e => {
  e.addEventListener('input', () => {
    update();
    debouncedSave();
  });
});
