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

  // 3b. Level-2 Submenu (Flyout Submenu Panel outside the main dropdown)
  const btnSub = $('btnTemplatesSubmenu');
  const menuSub = $('menuTemplatesSub');
  const closeSubBtn = $('btnCloseTemplatesSub');
  if (btnSub && menuSub) {
    let subTimer = null;

    const openSub = () => {
      clearTimeout(subTimer);
      const parentMenu = $('menuExport');
      if (parentMenu && window.innerWidth > 680) {
        const btnRect = btnSub.getBoundingClientRect();
        const parentRect = parentMenu.getBoundingClientRect();
        const topOffset = Math.max(0, btnRect.top - parentRect.top);
        menuSub.style.top = `${topOffset}px`;
      } else {
        menuSub.style.top = '';
      }
      menuSub.classList.add('show');
      btnSub.classList.add('active');
      btnSub.setAttribute('aria-expanded', 'true');
    };

    const closeSub = () => {
      clearTimeout(subTimer);
      subTimer = setTimeout(() => {
        menuSub.classList.remove('show');
        btnSub.classList.remove('active');
        btnSub.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    btnSub.addEventListener('mouseenter', openSub);
    btnSub.addEventListener('mouseleave', closeSub);
    menuSub.addEventListener('mouseenter', () => clearTimeout(subTimer));
    menuSub.addEventListener('mouseleave', closeSub);

    btnSub.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuSub.classList.contains('show')) {
        menuSub.classList.remove('show');
        btnSub.classList.remove('active');
        btnSub.setAttribute('aria-expanded', 'false');
      } else {
        openSub();
      }
    });

    if (closeSubBtn) {
      closeSubBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuSub.classList.remove('show');
        btnSub.classList.remove('active');
        btnSub.setAttribute('aria-expanded', 'false');
      });
    }

    menuSub.addEventListener('click', (e) => {
      e.stopPropagation();
    });
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
