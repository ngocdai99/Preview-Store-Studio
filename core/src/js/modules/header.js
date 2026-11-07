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

  // 3b. Sample Templates Modal Dialog Controller
  const optOpenTemplates = $('optOpenTemplatesModal');
  const templatesModal = $('templatesModal');
  const closeTemplatesBtn = $('templatesModalClose');
  const closeTemplatesX = $('templatesModalCloseX');

  function openTemplatesDialog() {
    if (!templatesModal) return;
    templatesModal.classList.add('open');
    templatesModal.setAttribute('aria-hidden', 'false');
    $$('.menu').forEach(m => m.classList.remove('show'));
  }

  function closeTemplatesDialog() {
    if (!templatesModal) return;
    templatesModal.classList.remove('open');
    templatesModal.setAttribute('aria-hidden', 'true');
  }

  if (optOpenTemplates) {
    optOpenTemplates.onclick = () => openTemplatesDialog();
  }

  if (closeTemplatesBtn) closeTemplatesBtn.onclick = () => closeTemplatesDialog();
  if (closeTemplatesX) closeTemplatesX.onclick = () => closeTemplatesDialog();

  if (templatesModal) {
    templatesModal.onclick = (e) => {
      if (e.target === templatesModal) closeTemplatesDialog();
    };
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && templatesModal && templatesModal.classList.contains('open')) {
      closeTemplatesDialog();
    }
  });

  // 4. Global Keyboard Dismissal for Header Dropdowns (ESC key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.menu.show').forEach(m => m.classList.remove('show'));
    }
  });

  // Add tooltip titles for Supabase-style collapsed sidebar icon rail
  $$('.card').forEach(card => {
    const h2 = card.querySelector('.card-header h2');
    const header = card.querySelector('.card-header');
    if (h2 && header) {
      const titleSpan = h2.querySelector('span:not(.card-num):not(.card-ico)') || h2;
      const text = titleSpan.textContent.trim();
      if (text) {
        header.title = text;
      }
    }
  });

  // 5. Editor Large Cards Accordion Controller (Expand / Collapse & Selected state)
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.card-header');
    if (header) {
      if (e.target.closest('.info-tip-btn, button:not(.card-toggle-btn), a, input, select, textarea')) {
        return;
      }
      const card = header.closest('.card');
      if (card) {
        // If sidebar is currently in Supabase-style collapsed rail mode, clicking an icon opens the sidebar and focuses that card
        if (document.body.classList.contains('sidebar-collapsed')) {
          if (typeof toggleSidebar === 'function') {
            toggleSidebar(true);
          } else {
            document.body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sps_sidebar_collapsed', '0');
            if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
          }
          $$('.card').forEach(c => {
            c.classList.add('collapsed');
            c.classList.remove('selected');
          });
          card.classList.remove('collapsed');
          card.classList.add('selected');
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 200);
          return;
        }

        const wasCollapsed = card.classList.contains('collapsed');
        card.classList.toggle('collapsed');
        
        // Card is selected only if it is expanded
        $$('.card').forEach(c => c.classList.remove('selected'));
        if (wasCollapsed) {
          card.classList.add('selected');
        }
      }
      return;
    }

    // Clicking anywhere inside an already expanded card body selects it
    const bodyCard = e.target.closest('.card');
    if (bodyCard && !bodyCard.classList.contains('collapsed')) {
      if (!bodyCard.classList.contains('selected')) {
        $$('.card').forEach(c => c.classList.remove('selected'));
        bodyCard.classList.add('selected');
      }
    }
  });

  // 6. Focusin inside an expanded card also updates selected state
  document.addEventListener('focusin', (e) => {
    const card = e.target.closest('.card');
    if (card && !card.classList.contains('collapsed') && !card.classList.contains('selected')) {
      $$('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
  });
}

// Auto-initialize header when DOM is ready or module is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
