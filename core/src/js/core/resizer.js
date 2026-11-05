// Store Preview Studio · Sidebar Resizer & Collapse Toggle
const editorPanel = $("editorPanel");
const editorResizer = $("editorResizer");
const btnToggleSidebar = $("btnToggleSidebar");


let isResizingSidebar = false;

if (editorResizer && editorPanel) {
  editorResizer.addEventListener('mousedown', e => {
    isResizingSidebar = true;
    editorResizer.classList.add('dragging');
    document.body.classList.add('resizing-sidebar');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isResizingSidebar) return;
    const newWidth = Math.min(Math.max(e.clientX, 400), Math.min(window.innerWidth - 360, 850));
    document.documentElement.style.setProperty('--editor-w', `${newWidth}px`);
    editorPanel.style.width = `${newWidth}px`;
    localStorage.setItem('sps_editor_w', newWidth);
  });

  document.addEventListener('mouseup', () => {
    if (isResizingSidebar) {
      isResizingSidebar = false;
      editorResizer.classList.remove('dragging');
      document.body.classList.remove('resizing-sidebar');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // Double-click resizer to reset to default 500px
  editorResizer.addEventListener('dblclick', () => {
    const defaultW = 500;
    document.documentElement.style.setProperty('--editor-w', `${defaultW}px`);
    editorPanel.style.width = `${defaultW}px`;
    localStorage.setItem('sps_editor_w', defaultW);
  });

  // Restore saved width
  const savedW = localStorage.getItem('sps_editor_w');
  if (savedW && !isNaN(savedW)) {
    const w = Math.min(Math.max(parseInt(savedW, 10), 400), 850);
    document.documentElement.style.setProperty('--editor-w', `${w}px`);
    editorPanel.style.width = `${w}px`;
  }
}

// Toggle Sidebar (Hide / Show Form)
function updateSidebarButtonState() {
  const isMobile = typeof isM === 'function' && isM();
  const isCollapsed = isMobile
    ? (document.body.dataset.panel || 'view') !== 'edit'
    : document.body.classList.contains('sidebar-collapsed');
  const btn = $('btnToggleSidebar');
  if (btn) {
    btn.classList.toggle('active', !isCollapsed);
    btn.setAttribute('aria-expanded', !isCollapsed ? 'true' : 'false');
    btn.title = isCollapsed 
      ? 'Show form panel (Sidebar) [Ctrl+B / ⌘B]' 
      : 'Hide form panel (Sidebar) [Ctrl+B / ⌘B]';
  }
}

function toggleSidebar(forceOpen) {
  if (typeof isM === 'function' && isM()) {
    if (typeof setPanel === 'function') {
      const cur = document.body.dataset.panel || 'view';
      const willOpen = typeof forceOpen === 'boolean' 
        ? forceOpen 
        : cur !== 'edit';
      setPanel(willOpen ? 'edit' : 'view');
      return;
    }
  }
  const willCollapse = typeof forceOpen === 'boolean' 
    ? !forceOpen 
    : !document.body.classList.contains('sidebar-collapsed');
  
  document.body.classList.toggle('sidebar-collapsed', willCollapse);
  localStorage.setItem('sps_sidebar_collapsed', willCollapse ? '1' : '0');
  updateSidebarButtonState();
  
  // Continuously fit and center mockups at 60fps during the 320ms slide animation
  const startTime = performance.now();
  const animateFit = () => {
    if (typeof fit === 'function') fit();
    if (typeof syncAllVtPills === 'function') syncAllVtPills();
    if (performance.now() - startTime < 360) {
      requestAnimationFrame(animateFit);
    }
  };
  requestAnimationFrame(animateFit);
}

if (btnToggleSidebar) {
  btnToggleSidebar.onclick = (e) => {
    if (e) e.stopPropagation();
    toggleSidebar();
  };
}

// Global Keyboard Shortcut: Cmd+B (Mac) / Ctrl+B (Windows/Linux)
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      toggleSidebar();
    }
  }
});

// Restore saved sidebar state if any
if (localStorage.getItem('sps_sidebar_collapsed') === '1') {
  document.body.classList.add('sidebar-collapsed');
}
updateSidebarButtonState();

// Drag & drop image files onto screenshot editor card
const slistArea = $('slist') ? $('slist').parentElement : null;
if(slistArea){
  slistArea.addEventListener('dragover',e=>{e.preventDefault()});
  slistArea.addEventListener('drop',e=>{
    const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));
    if(files.length){
      e.preventDefault();
      e.stopPropagation();
      let validFiles = files.filter(f => (typeof validateUploadFile !== 'function') || validateUploadFile(f, MAX_UPLOAD_BYTES, 'Screenshot'));
      if(!validFiles.length) return;
      const maxAllowed = (typeof store !== 'undefined' && store === 'apple') ? 10 : 8;
      const currentCount = typeof SHOTS !== 'undefined' ? SHOTS.length : 0;
      const room = maxAllowed - currentCount;
      if(room <= 0){
        showToast(`${store === 'apple' ? 'App Store' : 'Google Play'} allows up to ${maxAllowed} screenshots`, 'warn');
        return;
      }
      if(validFiles.length > room){
        validFiles = validFiles.slice(0, room);
        showToast(`Only ${room} more fit (max ${maxAllowed}) — extra files skipped`, 'warn');
      }
      if(typeof isDemoMode === 'function' && isDemoMode()){
        const currentUploaded = (window._demoScreenshotUploadCount || 0);
        if(currentUploaded >= 2){
          if(typeof requireFullVersion === 'function') requireFullVersion('upload-shots');
          return;
        }
        const allowedCount = Math.min(validFiles.length, 2 - currentUploaded);
        if(allowedCount < validFiles.length && typeof requireFullVersion === 'function'){
          requireFullVersion('upload-shots');
        }
        validFiles = validFiles.slice(0, allowedCount);
        window._demoScreenshotUploadCount = currentUploaded + allowedCount;
      }
      let loaded=0;
      validFiles.forEach(f=>{
        readFile(f,d=>{
          SHOTS.push(d);
          loaded++;
          if(loaded===validFiles.length){
            renderShots();
            saveState();
            showToast(`Added ${validFiles.length} screenshot(s)!`, 'ok');
          }
        });
      });
    }
  });
}

