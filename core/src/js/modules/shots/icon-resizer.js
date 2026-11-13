// Store Preview Studio · App Icon Resizer & Store Optimizer Engine
// Mathematical aspect-ratio fitting strategies (Center Crop, Pad, Stretch) with guaranteed 100% solid store parity
(function(global) {
  'use strict';

  let _resizerInitialized = false;
  let _sourceDataUrl = '';
  let _originalSourceDataUrl = ''; // Always the user-uploaded original, never overwritten by resize output
  let _sourceImg = null;
  let _sourceWidth = 0;
  let _sourceHeight = 0;
  let _fitMode = 'center-crop';
  let _bothStoresDone = false; // Track if resize has been applied for both stores

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
    _bothStoresDone = false; // Fit mode changed — pending re-apply
    updateFitContainerVisibility();
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
    updateActionBtn();
  }

  function getFitMode() {
    return _fitMode;
  }

  function setSource(src) {
    if (!src) return;
    _sourceDataUrl = src;
    _originalSourceDataUrl = src; // Lock original — never overwritten by resize output
    _bothStoresDone = false;
    ensureSourceLoaded(() => {
      checkAlreadyCompliant();
      updateLivePreview();
      updateFitContainerVisibility();
    });
  }

  function ensureSourceLoaded(callback) {
    const rawSrc = _originalSourceDataUrl || _sourceDataUrl || (typeof ICON !== 'undefined' ? ICON : '');
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

    // Render 1024×1024 for Apple App Store
    const cv1024 = document.createElement('canvas');
    renderToCanvas(cv1024, 1024);
    const dataUrl1024 = cv1024.toDataURL('image/png');

    // Render 512×512 for Google Play (downscaled from same source for consistency)
    const cv512 = document.createElement('canvas');
    renderToCanvas(cv512, 512);
    const dataUrl512 = cv512.toDataURL('image/png');

    // Active store determines which size is used as ICON (for live preview)
    const targetStore = (typeof global.IconLog !== 'undefined' && typeof global.IconLog.getTargetStore === 'function')
      ? global.IconLog.getTargetStore()
      : 'apple';
    const transformedDataUrl = (targetStore === 'google') ? dataUrl512 : dataUrl1024;

    // Update global state — both sizes always saved
    if (typeof IS_CUSTOM_ICON !== 'undefined') IS_CUSTOM_ICON = true;
    if (typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = dataUrl1024;
    if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = dataUrl512;
    if (typeof ICON !== 'undefined') ICON = transformedDataUrl;

    // Output is always PNG from canvas.toDataURL — reset file type metadata accordingly
    if (typeof ICON_FILE_TYPE !== 'undefined') ICON_FILE_TYPE = 'image/png';
    if (typeof ICON_FILE_SIZE !== 'undefined') ICON_FILE_SIZE = 0;

    if (typeof userDraft !== 'undefined' && userDraft && CURRENT_PRESET_KEY === 'draft') {
      userDraft.icon = transformedDataUrl;
      userDraft.icon1024 = dataUrl1024;
      userDraft.icon512 = dataUrl512;
      userDraft.isCustomIcon = true;
    }

    // DO NOT overwrite _sourceDataUrl — keep original source so fit mode changes still work
    _bothStoresDone = true;

    // Re-render editor icons and save state
    if (typeof renderIcons === 'function') renderIcons();
    if (typeof validateAppIcon === 'function') validateAppIcon();
    if (typeof saveState === 'function') saveState();
    if (typeof updateDraftPill === 'function') updateDraftPill();

    // Update Image in Inspector tab
    const modalImg = $('msIconModalImg');
    if (modalImg) modalImg.src = transformedDataUrl;

    // Re-inspect using active store
    if (typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
      global.IconLog.inspectIcon(transformedDataUrl, null, targetStore);
    }

    updateLivePreview();

    // Output always 1024×1024 square — mark compliant, hide fit container
    _bothStoresDone = true;
    updateFitContainerVisibility();
  }

  // Check if the loaded source image is already store-compliant (correct size, square)
  // This runs on every source load — persists across modal close/reopen
  function checkAlreadyCompliant() {
    const w = _sourceWidth;
    const h = _sourceHeight;
    const isSquare = (w === h && w > 0);
    let tStore = 'apple';
    try { if (global.IconLog && typeof global.IconLog.getTargetStore === 'function') tStore = global.IconLog.getTargetStore(); } catch (e) {}
    const isStoreSize = (w === (tStore === 'google' ? 512 : 1024));
    const srcStr = _originalSourceDataUrl || _sourceDataUrl || '';
    const isPngSrc = !srcStr.startsWith('data:') || srcStr.startsWith('data:image/png');
    _bothStoresDone = isSquare && isStoreSize && isPngSrc;
  }

  function updateFitContainerVisibility() {
    const fitSection = document.querySelector('.icon-resizer-fit-container');
    const primaryBtn = $('iconActionPrimaryBtn');
    const statusMsg = $('iconResizeStatusMsg');

    if (_bothStoresDone) {
      if (fitSection) fitSection.style.display = 'none';
      if (primaryBtn) primaryBtn.disabled = true;
      if (statusMsg) {
        statusMsg.textContent = 'Icon already meets store size requirements.';
        statusMsg.style.display = 'block';
      }
    } else {
      if (fitSection) fitSection.style.display = '';
      if (primaryBtn) primaryBtn.disabled = false;
      if (statusMsg) statusMsg.style.display = 'none';
    }
  }

  function updateActionBtn() {
    // No-op — button text stays static, fit container visibility is handled separately
  }

  // Inter-module hooks
  global.onResizerTargetStoreChanged = function(store) {
    updateLivePreview();
  };

  global.onResizerSourceChanged = function(src) {
    _sourceDataUrl = src;
    _originalSourceDataUrl = src;
    _bothStoresDone = false;
    ensureSourceLoaded(() => {
      checkAlreadyCompliant();
      updateLivePreview();
      updateFitContainerVisibility();
    });
  };

  global.onResizerTabActivated = function() {
    ensureSourceLoaded(() => {
      checkAlreadyCompliant();
      updateLivePreview();
      updateFitContainerVisibility();
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
