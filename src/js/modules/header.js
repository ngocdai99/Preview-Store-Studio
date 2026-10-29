// Store Preview Studio · Header Component Module
// Encapsulates Sidebar Toggle, Store Switcher, and Header Dropdown Navigation

function initHeader() {
  // 1. Sidebar Collapse / Expand Toggle is handled in core/resizer.js

  // 2. Store Switcher (App Store vs Google Play Segmented Control)
  const storeBtns = $$('.seg button');
  storeBtns.forEach(btn => {
    btn.onclick = () => {
      const targetStore = btn.dataset.s;
      if (targetStore && typeof setStore === 'function') {
        setStore(targetStore);
      }
    };
  });

  // 3. Header Dropdowns (Presets Menu & Export Menu)
  if (typeof setupDropdown === 'function') {
    if ($('btnPresets')) setupDropdown('btnPresets', 'menuPresets');
    setupDropdown('btnExport', 'menuExport');
  }

  // 3b. Collapsible Templates Accordion in Menu
  const btnToggleTemplates = $('btnToggleTemplates');
  const templatesGroup = $('templatesGroup');
  if (btnToggleTemplates && templatesGroup) {
    btnToggleTemplates.onclick = (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = templatesGroup.style.display !== 'none';
      templatesGroup.style.display = isCurrentlyOpen ? 'none' : 'flex';
      btnToggleTemplates.classList.toggle('open', !isCurrentlyOpen);
      btnToggleTemplates.setAttribute('aria-expanded', String(!isCurrentlyOpen));
    };
  }

  // 4. Global Keyboard Dismissal for Header Dropdowns (ESC key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.menu.show').forEach(m => m.classList.remove('show'));
    }
  });
}

// Auto-initialize header when DOM is ready or module is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
