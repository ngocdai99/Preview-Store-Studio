// Store Preview Studio · App Icon Inspector Controller
// Manages the Inspector Tab view, viewport rendering, and drag-and-drop file ingestion
(function(global) {
  'use strict';

  let _inspectorInitialized = false;
  let _currentTab = 'inspect';

  function $(id) {
    return document.getElementById(id);
  }

  function initIconInspector() {
    if (_inspectorInitialized) return;
    _inspectorInitialized = true;

    // Tab buttons
    const btnInspect = $('iconTabBtnInspect');
    const btnResize = $('iconTabBtnResize');

    if (btnInspect) {
      btnInspect.onclick = (e) => {
        if (e) e.stopPropagation();
        switchIconModalTab('inspect');
      };
    }
    if (btnResize) {
      btnResize.onclick = (e) => {
        if (e) e.stopPropagation();
        switchIconModalTab('resize');
      };
    }

    // Drag and drop onto modal art viewport
    const artZone = $('msIconModalArt');
    if (artZone) {
      artZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        artZone.classList.add('drag-over');
      });

      artZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        artZone.classList.remove('drag-over');
      });

      artZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        artZone.classList.remove('drag-over');

        const file = e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files[0] : null;
        if (file && file.type && file.type.startsWith('image/')) {
          if (typeof isDemoMode === 'function' && isDemoMode()) {
            if (typeof requireFullVersion === 'function') {
              requireFullVersion('upload-icon');
              return;
            }
          }
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            loadInspectorImage(dataUrl, file);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Modal close button
    const closeBtn = $('msIconModalClose');
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (typeof global.closeIconModal === 'function') {
          global.closeIconModal();
        }
      };
    }

    // Global document event delegation for failsafe click interception on tab buttons
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;
        const btn = (typeof target.closest === 'function') ? target.closest('.icon-modal-tab-btn') : null;
        if (!btn) return;
        const tab = btn.dataset.tab || (btn.id === 'iconTabBtnResize' ? 'resize' : 'inspect');
        switchIconModalTab(tab);
      });
    }
  }

  function getCurrentIconModalTab() {
    return _currentTab;
  }

  function switchIconModalTab(tabName) {
    _currentTab = (tabName === 'resize') ? 'resize' : 'inspect';

    const btnInspect = $('iconTabBtnInspect');
    const btnResize = $('iconTabBtnResize');
    const paneInspect = $('iconPaneInspect');
    const paneResize = $('iconPaneResize');

    if (btnInspect) {
      btnInspect.classList.toggle('active', _currentTab === 'inspect');
      btnInspect.setAttribute('aria-selected', _currentTab === 'inspect' ? 'true' : 'false');
    }
    if (btnResize) {
      btnResize.classList.toggle('active', _currentTab === 'resize');
      btnResize.setAttribute('aria-selected', _currentTab === 'resize' ? 'true' : 'false');
    }
    if (paneInspect) paneInspect.classList.toggle('active', _currentTab === 'inspect');
    if (paneResize) paneResize.classList.toggle('active', _currentTab === 'resize');

    // Update Action Button Text
    const primaryText = $('iconActionPrimaryText');
    if (primaryText) {
      if (_currentTab === 'resize') {
        primaryText.textContent = 'Apply & Validate Icon';
      } else {
        // Look at current badge state or default to fix
        const badge = $('msIconModalBadge');
        const isOk = badge && badge.classList.contains('ok');
        primaryText.textContent = isOk ? 'Re-fit / Resize Icon' : 'Fix & Resize to Store Spec';
      }
    }

    // If switching to Resizer tab, ensure live preview is loaded
    if (_currentTab === 'resize') {
      if (typeof global.onResizerTabActivated === 'function') {
        global.onResizerTabActivated();
      }
    }
  }

  function loadInspectorImage(dataUrl, file) {
    const imgEl = $('msIconModalImg');
    if (imgEl) {
      imgEl.src = dataUrl;
    }

    // Update global icon state if user dropped image
    if (typeof IS_CUSTOM_ICON !== 'undefined') IS_CUSTOM_ICON = true;
    if (typeof ICON !== 'undefined') ICON = dataUrl;

    if (typeof userDraft !== 'undefined' && userDraft && CURRENT_PRESET_KEY === 'draft') {
      userDraft.icon = dataUrl;
      userDraft.icon1024 = dataUrl;
      userDraft.isCustomIcon = true;
    }

    if (typeof renderIcons === 'function') renderIcons();
    if (typeof saveState === 'function') saveState();
    if (typeof updateDraftPill === 'function') updateDraftPill();

    // Re-audit with IconLog
    if (typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
      const store = (typeof global.IconLog.getTargetStore === 'function') ? global.IconLog.getTargetStore() : 'apple';
      global.IconLog.inspectIcon(dataUrl, file, store);
    }

    // Inform resizer
    if (typeof global.onResizerSourceChanged === 'function') {
      global.onResizerSourceChanged(dataUrl);
    }
  }

  // Export to global scope
  global.IconInspector = {
    init: initIconInspector,
    getCurrentTab: getCurrentIconModalTab,
    switchTab: switchIconModalTab,
    loadImage: loadInspectorImage
  };

  global.switchIconModalTab = switchIconModalTab;
  global.getCurrentIconModalTab = getCurrentIconModalTab;

  // Auto-init on load or DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIconInspector);
    } else {
      initIconInspector();
    }
  }

})(typeof window !== 'undefined' ? window : this);
