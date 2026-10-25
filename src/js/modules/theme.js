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
  const onStatChange = () => { STATS[k] = el.value.trim(); renderStats(); debouncedSave(); };
  el.addEventListener('input', onStatChange);
  el.addEventListener('change', onStatChange);
});
const stOffEl = $('f-st-off'), stWmEl = $('f-st-wm');
if(stOffEl) stOffEl.addEventListener('change', () => { STATS_OFF = stOffEl.checked; renderStats(); debouncedSave(); });
if(stWmEl) stWmEl.addEventListener('change', () => { EXPORT_WM = stWmEl.checked; debouncedSave(); });

// Drag-to-scroll horizontal screenshots carousel & stats ribbon
$$('.gal, .a-met').forEach(g=>{
  let down=false,x0=0,s0=0;
  g.addEventListener('mousedown',e=>{down=true;x0=e.pageX;s0=g.scrollLeft;g.style.cursor='grabbing'});
  ['mouseup','mouseleave'].forEach(t=>g.addEventListener(t,()=>{down=false;g.style.cursor='grab'}));
  g.addEventListener('mousemove',e=>{if(down){e.preventDefault();g.scrollLeft=s0-(e.pageX-x0)*1.6}});
  g.addEventListener('wheel',e=>{if(e.deltaY){e.preventDefault();g.scrollLeft+=e.deltaY*1.5}},{passive:false});
});

