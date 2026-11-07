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

  // 5. VS Code / Supabase Activity Bar & Single-Card View Controller
  function initActivityBar() {
    const editor = $('editorPanel');
    if (!editor) return;

    let bar = $('activityBar');
    if (!bar) {
      bar = document.createElement('nav');
      bar.className = 'activity-bar';
      bar.id = 'activityBar';
      bar.setAttribute('aria-label', 'Editor Activity Bar');
      editor.insertBefore(bar, editor.firstChild);
    }
    bar.innerHTML = '';

    const cards = $$('.editor .card');
    cards.forEach((card, idx) => {
      const h2 = card.querySelector('.card-header h2');
      const icoSvg = card.querySelector('.card-ico svg');
      const titleSpan = h2 ? (h2.querySelector('span:not(.card-num):not(.card-ico)') || h2) : null;
      const titleText = titleSpan ? titleSpan.textContent.trim() : `Section ${idx + 1}`;
      
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'activity-bar-btn';
      btn.dataset.cardId = card.id;
      btn.title = titleText;
      btn.setAttribute('aria-label', titleText);
      
      const dataOnly = card.getAttribute('data-only');
      if (dataOnly) {
        btn.setAttribute('data-only', dataOnly);
      }

      if (card.classList.contains('selected')) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.setAttribute('aria-selected', 'false');
      }

      if (icoSvg) {
        btn.innerHTML = icoSvg.outerHTML;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.dataset.cardId;
        const targetCard = $(cardId);
        if (!targetCard) return;

        // If sidebar is currently collapsed, expand it and show this card
        if (document.body.classList.contains('sidebar-collapsed')) {
          if (typeof toggleSidebar === 'function') {
            toggleSidebar(true);
          } else {
            document.body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sps_sidebar_collapsed', '0');
            if (typeof updateSidebarButtonState === 'function') updateSidebarButtonState();
          }
        }

        // Switch to clicked section
        selectEditorCard(cardId);
      });

      bar.appendChild(btn);
    });

    // Ensure at least one card is selected and activity bar is immediately styled
    if (!document.querySelector('.editor .card.selected') && cards.length > 0) {
      cards[0].classList.add('selected');
      cards[0].classList.remove('collapsed');
    }
    updateActivityBarState();
  }

  function selectEditorCard(cardId) {
    const targetCard = $(cardId);
    if (!targetCard) return;

    $$('.editor .card').forEach(c => {
      c.classList.remove('selected');
      c.classList.add('collapsed');
    });
    targetCard.classList.add('selected');
    targetCard.classList.remove('collapsed');
    targetCard.scrollTop = 0;
    const bodyEl = targetCard.querySelector('.card-body');
    if (bodyEl) bodyEl.scrollTop = 0;

    updateActivityBarState();
  }

  function updateActivityBarState() {
    let selected = document.querySelector('.editor .card.selected');
    if (!selected) {
      const firstCard = document.querySelector('.editor .card:not(.hide)') || document.querySelector('.editor .card');
      if (firstCard) {
        firstCard.classList.add('selected');
        selected = firstCard;
      }
    }
    const selectedId = selected ? selected.id : null;
    const isLight = document.documentElement.dataset.ui === 'light';
    const activeColor = isLight ? '#0f172a' : '#ffffff';
    const activeBg = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
    const activeBorder = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';

    $$('.activity-bar-btn').forEach(btn => {
      const isAct = btn.dataset.cardId === selectedId;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');

      if (isAct) {
        btn.style.setProperty('background', activeBg, 'important');
        btn.style.setProperty('border', `1px solid ${activeBorder}`, 'important');
        btn.style.setProperty('border-radius', '6px', 'important');
        btn.style.setProperty('color', activeColor, 'important');
        const s = btn.querySelector('svg');
        if (s) {
          s.style.setProperty('opacity', '1', 'important');
          s.style.setProperty('stroke', activeColor, 'important');
          s.style.setProperty('color', activeColor, 'important');
        }
      } else {
        btn.style.removeProperty('background');
        btn.style.removeProperty('border');
        btn.style.removeProperty('border-radius');
        btn.style.removeProperty('color');
        const s = btn.querySelector('svg');
        if (s) {
          s.style.removeProperty('opacity');
          s.style.removeProperty('stroke');
          s.style.removeProperty('color');
        }
      }
    });
  }

  window.selectEditorCard = selectEditorCard;
  window.updateActivityBarState = updateActivityBarState;

  // Initialize Activity Bar on load
  initActivityBar();

  // 6. Focusin inside an editor card updates selected state and activity bar
  document.addEventListener('focusin', (e) => {
    const card = e.target.closest('.card');
    if (card && !card.classList.contains('selected')) {
      selectEditorCard(card.id);
    }
  });

  // Card Header Click Delegation (maintains compatibility and manages selected state)
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.card-header');
    if (header) {
      if (e.target.closest('.info-tip-btn, button:not(.card-toggle-btn), a, input, select, textarea')) return;
      const card = header.closest('.card');
      if (card) {
        card.classList.toggle('collapsed');
        card.classList.add('selected');
        if (typeof updateActivityBarState === 'function') updateActivityBarState();
      }
    }
  });
}

// Auto-initialize header when DOM is ready or module is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
