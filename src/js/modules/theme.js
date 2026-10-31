// Store Preview Studio · Theme & Motion Controller
// --- Page (UI) Theme: Light / Dark ---
function applyUiTheme(t){
  document.documentElement.dataset.ui = t;
  const ico = $('icoUi');
  if(ico){
    if(t === 'light'){
      ico.className = 'btn-ico ico-ui';
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" fill="currentColor"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
    } else {
      ico.className = 'btn-ico ico-ui dark';
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }
}
applyUiTheme(document.documentElement.dataset.ui || 'light');
$('btnUi').onclick = () => {
  const next = document.documentElement.dataset.ui === 'light' ? 'dark' : 'light';
  applyUiTheme(next);
  try{ localStorage.setItem('store_preview_studio_ui', next); }catch(e){}
};

// Status-bar clocks stay fixed at 9:41 (the HTML text) so previews and exported images always match.

// Illustrative stats inputs
Object.entries(STAT_INPUTS).forEach(([k,id]) => {
  const el = $(id);
  if(!el) return;
  const onStatChange = () => {
    STATS[k] = el.value.trim();
    if (k === 'age' && typeof syncAgeUI === 'function') syncAgeUI();
    renderStats();
    debouncedSave();
  };
  el.addEventListener('input', onStatChange);
  el.addEventListener('change', onStatChange);
});
const stWmEl = $('f-st-wm');
if(stWmEl) stWmEl.addEventListener('change', () => { EXPORT_WM = stWmEl.checked; debouncedSave(); });

// Smooth, Hardware-Accelerated Drag-to-Scroll & Intelligent Wheel for Carousels (.gal, .a-met)
function initSmoothCarousel(el) {
  if (!el || el._smoothCarouselInited) return;
  el._smoothCarouselInited = true;

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let rafId = null;

  const getZoom = () => {
    const dev = el.closest('.dev') || el;
    const computedZoom = parseFloat(getComputedStyle(dev).zoom);
    return (!isNaN(computedZoom) && computedZoom > 0) ? computedZoom : 1;
  };

  const stopMomentum = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only primary mouse button (left click)
    stopMomentum();
    isDown = true;
    el.classList.add('is-dragging');
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';

    const zoom = getZoom();
    startX = e.clientX / zoom;
    startScrollLeft = el.scrollLeft;
    lastX = startX;
    lastTime = performance.now();
    velocity = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const zoom = getZoom();
    const currentX = e.clientX / zoom;
    const deltaX = currentX - startX;
    el.scrollLeft = startScrollLeft - deltaX;

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 8) {
      velocity = (currentX - lastX) / dt;
      lastX = currentX;
      lastTime = now;
    }
  });

  const onDragEnd = () => {
    if (!isDown) return;
    isDown = false;
    el.classList.remove('is-dragging');
    el.style.scrollSnapType = '';
    el.style.scrollBehavior = '';

    // Apply gentle kinetic momentum if released with velocity
    if (Math.abs(velocity) > 0.12) {
      let currentVelocity = velocity * 15;
      const friction = 0.92;
      const step = () => {
        if (Math.abs(currentVelocity) < 0.5 || isDown) {
          stopMomentum();
          return;
        }
        el.scrollLeft -= currentVelocity;
        currentVelocity *= friction;
        rafId = requestAnimationFrame(step);
      };
      stopMomentum();
      rafId = requestAnimationFrame(step);
    }
  };

  window.addEventListener('mouseup', onDragEnd);

  // Wheel handling:
  // 1. Two-finger horizontal trackpad gestures (deltaX) pass through untouched for 120Hz native compositor scrolling.
  // 2. Vertical mouse wheels only translate to horizontal scroll within bounds without locking vertical page scroll.
  el.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
      return; // Native trackpad horizontal scroll passes through
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 2) return;

    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft >= maxScroll - 1;

    if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
      e.preventDefault();
      stopMomentum();
      el.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

function initAllCarousels() {
  $$('.gal, .a-met').forEach(initSmoothCarousel);
}
initAllCarousels();

