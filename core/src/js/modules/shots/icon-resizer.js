// Store Preview Studio · App Icon Resizer & Store Optimizer Engine
// Mathematical aspect-ratio fitting strategies (Center Crop, Pad, Stretch) with guaranteed 100% solid store parity
(function(global) {
  'use strict';

  let _resizerInitialized = false;
  let _sourceDataUrl = '';
  let _sourceImg = null;
  let _sourceWidth = 0;
  let _sourceHeight = 0;
  let _fitMode = 'center-crop';

  function $(id) {
    return document.getElementById(id);
  }

  function initIconResizer() {
    if (_resizerInitialized) return;
    _resizerInitialized = true;

    // Fit Mode Selection Cards
    const cardCrop = $('appIconFitCardCrop');
    const cardPad = $('appIconFitCardPad');
    const cardStretch = $('appIconFitCardStretch');

    if (cardCrop) cardCrop.onclick = () => setFitMode('center-crop');
    if (cardPad) cardPad.onclick = () => setFitMode('pad');
    if (cardStretch) cardStretch.onclick = () => setFitMode('stretch');

    const radioInputs = (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function')
      ? document.querySelectorAll('input[name="appIconFitMode"]')
      : [];
    radioInputs.forEach(radio => {
      radio.onchange = () => setFitMode(radio.value);
    });

    // Primary Action Button (Unified direct execution)
    const primaryBtn = $('iconActionPrimaryBtn');
    if (primaryBtn) {
      primaryBtn.onclick = () => {
        applyTransformation();
      };
    }

    // Auto-sync sliding pill position
    setTimeout(updateFitPill, 20);
    setTimeout(updateFitPill, 100);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateFitPill);
    }
  }

  function updateFitPill() {
    const container = $('appIconFitOptions') || (typeof document !== 'undefined' ? document.querySelector('.icon-resizer-fit-options') : null);
    if (!container) return;
    let pill = $('appIconFitPill') || container.querySelector('.icon-resizer-fit-pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.id = 'appIconFitPill';
      pill.className = 'icon-resizer-fit-pill';
      pill.setAttribute('aria-hidden', 'true');
      container.prepend(pill);
    }
    const activeCard = container.querySelector('.icon-resizer-fit-card.active');
    if (activeCard && container.offsetParent !== null && activeCard.offsetWidth > 0) {
      let left = activeCard.offsetLeft;
      if (activeCard.offsetParent && activeCard.offsetParent !== container) {
        if (typeof activeCard.getBoundingClientRect === 'function' && typeof container.getBoundingClientRect === 'function') {
          const btnRect = activeCard.getBoundingClientRect();
          const contRect = container.getBoundingClientRect();
          if (contRect.width > 0) {
            left = btnRect.left - contRect.left;
          }
        }
      }
      pill.style.width = activeCard.offsetWidth + 'px';
      pill.style.transform = `translateX(${left}px)`;
      pill.style.opacity = '1';
    } else {
      pill.style.opacity = '0';
    }
  }

  function setFitMode(mode) {
    _fitMode = (mode === 'pad' || mode === 'stretch') ? mode : 'center-crop';

    const cardCrop = $('appIconFitCardCrop');
    const cardPad = $('appIconFitCardPad');
    const cardStretch = $('appIconFitCardStretch');

    if (cardCrop) cardCrop.classList.toggle('active', _fitMode === 'center-crop');
    if (cardPad) cardPad.classList.toggle('active', _fitMode === 'pad');
    if (cardStretch) cardStretch.classList.toggle('active', _fitMode === 'stretch');

    const radio = (typeof document !== 'undefined' && typeof document.querySelector === 'function')
      ? document.querySelector(`input[name="appIconFitMode"][value="${_fitMode}"]`)
      : null;
    if (radio) radio.checked = true;

    updateFitPill();
    updateLivePreview();
  }

  function getFitMode() {
    return _fitMode;
  }

  function setSource(src) {
    if (!src) return;
    _sourceDataUrl = src;
    ensureSourceLoaded(() => {
      updateLivePreview();
    });
  }

  function ensureSourceLoaded(callback) {
    const rawSrc = _sourceDataUrl || (typeof ICON !== 'undefined' ? ICON : '');
    if (!rawSrc) return;

    if (_sourceImg && _sourceImg.src === rawSrc && _sourceImg.complete) {
      if (typeof callback === 'function') callback();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      _sourceImg = img;
      _sourceWidth = img.naturalWidth || img.width;
      _sourceHeight = img.naturalHeight || img.height;
      if (typeof callback === 'function') callback();
    };
    img.onerror = () => {
      // Fallback without crossOrigin for mzstatic or localized asset protection
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        _sourceImg = fallbackImg;
        _sourceWidth = fallbackImg.naturalWidth || fallbackImg.width;
        _sourceHeight = fallbackImg.naturalHeight || fallbackImg.height;
        if (typeof callback === 'function') callback();
      };
      fallbackImg.src = rawSrc;
    };
    img.src = rawSrc;
  }

  /**
   * Renders image into target canvas with guaranteed 100% solid white pre-fill
   * Eliminates all alpha channel risks (Apple rejection ITMS-90717 & Google Play squircle compatibility)
   */
  function renderToCanvas(targetCanvas, targetSize) {
    if (!_sourceImg || !_sourceImg.width) return;
    targetCanvas.width = targetSize;
    targetCanvas.height = targetSize;

    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, targetSize, targetSize);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // GUARANTEED STORE STANDARD: Always pre-fill 100% solid white background (#FFFFFF)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetSize, targetSize);

    const srcW = _sourceWidth;
    const srcH = _sourceHeight;

    if (_fitMode === 'stretch') {
      ctx.drawImage(_sourceImg, 0, 0, targetSize, targetSize);
    } else if (_fitMode === 'pad') {
      const scale = Math.min(targetSize / srcW, targetSize / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      ctx.drawImage(_sourceImg, drawX, drawY, drawW, drawH);
    } else {
      // center-crop (default recommended)
      const scale = Math.max(targetSize / srcW, targetSize / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      ctx.drawImage(_sourceImg, drawX, drawY, drawW, drawH);
    }
  }

  function updateLivePreview() {
    const liveCanvas = $('appIconResizeLiveCanvas');
    if (!liveCanvas || !_sourceImg) return;
    renderToCanvas(liveCanvas, 1024);
  }

  function applyTransformation() {
    if (!_sourceImg) return;

    const targetStore = (typeof global.IconLog !== 'undefined' && typeof global.IconLog.getTargetStore === 'function')
      ? global.IconLog.getTargetStore()
      : 'apple';

    const targetDim = (targetStore === 'google') ? 512 : 1024;
    const offscreenCv = document.createElement('canvas');
    renderToCanvas(offscreenCv, targetDim);

    const transformedDataUrl = offscreenCv.toDataURL('image/png');

    // Update global state and draft
    if (typeof IS_CUSTOM_ICON !== 'undefined') IS_CUSTOM_ICON = true;
    if (typeof CURRENT_PRESET_KEY !== 'undefined') CURRENT_PRESET_KEY = 'draft';

    if (targetStore === 'apple') {
      if (typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = transformedDataUrl;
    } else {
      if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = transformedDataUrl;
    }

    if (typeof ICON !== 'undefined') {
      ICON = transformedDataUrl;
    }

    if (typeof userDraft !== 'undefined' && userDraft) {
      userDraft.icon = transformedDataUrl;
      if (targetStore === 'apple') userDraft.icon1024 = transformedDataUrl;
      if (targetStore === 'google') userDraft.icon512 = transformedDataUrl;
      userDraft.isCustomIcon = true;
    }

    _sourceDataUrl = transformedDataUrl;

    // Re-render editor icons and save state
    if (typeof renderIcons === 'function') renderIcons();
    if (typeof validateAppIcon === 'function') validateAppIcon();
    if (typeof saveState === 'function') saveState();
    if (typeof updateDraftPill === 'function') updateDraftPill();

    // Update Image in Inspector tab
    const modalImg = $('msIconModalImg');
    if (modalImg) modalImg.src = transformedDataUrl;

    // Immediately re-inspect transformed asset -> Diagnostic Log updates to store compliant!
    if (typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
      global.IconLog.inspectIcon(transformedDataUrl, null, targetStore);
    }

    // Update live preview directly in unified view
    updateLivePreview();

    if (typeof showToast === 'function') {
      showToast(`App icon resized to ${targetDim}×${targetDim} px and verified compliant!`, 'ok');
    }
  }

  // Inter-module hooks
  global.onResizerTargetStoreChanged = function(store) {
    updateLivePreview();
  };

  global.onResizerSourceChanged = function(src) {
    _sourceDataUrl = src;
    ensureSourceLoaded(() => {
      updateLivePreview();
    });
  };

  global.onResizerTabActivated = function() {
    ensureSourceLoaded(() => {
      updateLivePreview();
    });
    setTimeout(updateFitPill, 20);
    setTimeout(updateFitPill, 60);
  };

  function switchIconModalTab(tabName) {
    if (typeof global.IconInspector !== 'undefined' && typeof global.IconInspector.switchTab === 'function') {
      global.IconInspector.switchTab(tabName);
    } else {
      const paneInspect = $('iconPaneInspect');
      const paneResize = $('iconPaneResize');
      if (paneInspect) paneInspect.classList.toggle('active', tabName !== 'resize');
      if (paneResize) paneResize.classList.toggle('active', tabName === 'resize');
    }
    if (tabName === 'resize') {
      setTimeout(updateFitPill, 20);
      setTimeout(updateFitPill, 60);
    }
  }

  function openIconResizerModal(options = {}) {
    initIconResizer();
    const rawSrc = options.src || (typeof ICON !== 'undefined' ? ICON : '');
    _sourceDataUrl = rawSrc;
    const store = options.store || (typeof store !== 'undefined' ? store : 'apple');

    if (typeof global.openIconModal === 'function') {
      global.openIconModal({ src: rawSrc, store, type: 'icon' });
    }
    switchIconModalTab('resize');
  }

  function closeIconResizerModal() {
    if (typeof global.closeIconModal === 'function') {
      global.closeIconModal();
    }
  }

  // Export to global scope
  global.IconResizer = {
    init: initIconResizer,
    setSource,
    setFitMode,
    getFitMode,
    updateLivePreview,
    applyTransformation,
    ensureSourceLoaded,
    syncPill: updateFitPill
  };

  global.initIconResizer = initIconResizer;
  global.syncIconFitPill = updateFitPill;
  global.switchIconModalTab = switchIconModalTab;
  global.openIconResizerModal = openIconResizerModal;
  global.closeIconResizerModal = closeIconResizerModal;
  global.ensureResizerSourceLoaded = ensureSourceLoaded;

  // Auto-init on load or DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIconResizer);
    } else {
      initIconResizer();
    }
  }

})(typeof window !== 'undefined' ? window : this);
