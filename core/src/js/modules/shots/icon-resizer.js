// Store Preview Studio · App Icon Resizer & Store Optimizer Engine
// Mathematical aspect-ratio fitting strategies (Center Crop, Pad, Stretch) with guaranteed 100% solid store parity
(function(global) {
  'use strict';

  let _resizerInitialized = false;
  let _sourceDataUrl = '';
  let _originalSourceDataUrl = ''; // Always the user-uploaded original, never overwritten by resize output
  let _sourceImg = null;
  let _transformedImg = null;
  let _sourceWidth = 0;
  let _sourceHeight = 0;
  let _fitMode = 'center-crop';
  let _bothStoresDone = false; // Track if resize has been applied for both stores
  let _isTestPreviewMode = false; // Test preview only: does not mutate studio draft until explicit user confirmation
  let _testTransformed1024 = '';
  let _testTransformed512 = '';
  let _testTransformedCurrent = '';
  let _currentAssetKey = 'preset';
  let _assetStates = {}; // key -> { fitMode, isResized, transformed1024, transformed512, transformedCurrent, statusMsg, sourceUrl }

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
      if (typeof isDemoMode === 'function' && isDemoMode() && !_isTestPreviewMode) {
        ensurePrimaryBtnLock();
      }
      primaryBtn.onclick = () => {
        if (primaryBtn.disabled) return;
        if (typeof isDemoMode === 'function' && isDemoMode() && !_isTestPreviewMode) {
          if (typeof requireFullVersion === 'function') {
            requireFullVersion('icon-resize');
          }
          return;
        }
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

  function ensurePrimaryBtnLock() {
    const primaryBtn = $('iconActionPrimaryBtn');
    if (!primaryBtn || primaryBtn.querySelector('.demo-lock-ico')) return;
    const lockSpan = document.createElement('span');
    lockSpan.className = 'demo-lock-ico';
    lockSpan.setAttribute('aria-hidden', 'true');
    lockSpan.title = 'Available in Plus & Pro Edition';
    lockSpan.innerHTML = '<svg width="11.5" height="11.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    primaryBtn.appendChild(lockSpan);
  }

  function removePrimaryBtnLock() {
    const primaryBtn = $('iconActionPrimaryBtn');
    if (!primaryBtn) return;
    const lock = primaryBtn.querySelector('.demo-lock-ico');
    if (lock) lock.remove();
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

  function syncFitModeUI(mode) {
    const targetMode = (mode === 'pad' || mode === 'stretch') ? mode : 'center-crop';
    const cardCrop = $('appIconFitCardCrop');
    const cardPad = $('appIconFitCardPad');
    const cardStretch = $('appIconFitCardStretch');
    if (cardCrop) cardCrop.classList.toggle('active', targetMode === 'center-crop');
    if (cardPad) cardPad.classList.toggle('active', targetMode === 'pad');
    if (cardStretch) cardStretch.classList.toggle('active', targetMode === 'stretch');

    const radio = (typeof document !== 'undefined' && typeof document.querySelector === 'function')
      ? document.querySelector(`input[name="appIconFitMode"][value="${targetMode}"]`)
      : null;
    if (radio) radio.checked = true;

    updateFitPill();
  }

  function setFitMode(mode) {
    const newMode = (mode === 'pad' || mode === 'stretch') ? mode : 'center-crop';
    _fitMode = newMode;
    updateFitContainerVisibility();
    syncFitModeUI(_fitMode);
    updateLivePreview();
    updateActionBtn();

    // Persist fitMode into active asset state without wiping isResized or transformed images
    if (_currentAssetKey) {
      if (!_assetStates[_currentAssetKey]) _assetStates[_currentAssetKey] = {};
      _assetStates[_currentAssetKey].fitMode = _fitMode;
      syncCardStateDots();
    }
  }

  function getFitMode() {
    return _fitMode;
  }

  function setSource(src) {
    if (!src) return;
    _sourceDataUrl = src;
    _originalSourceDataUrl = src; // Lock original — never overwritten by resize output
    _transformedImg = null;
    _testTransformed1024 = '';
    _testTransformed512 = '';
    _testTransformedCurrent = '';
    _bothStoresDone = false;
    if (_currentAssetKey && _assetStates[_currentAssetKey]) {
      _assetStates[_currentAssetKey].isResized = false;
      _assetStates[_currentAssetKey].transformedCurrent = '';
      _assetStates[_currentAssetKey].transformed1024 = '';
      _assetStates[_currentAssetKey].transformed512 = '';
      _assetStates[_currentAssetKey].statusMsg = '';
    }
    syncCardStateDots();
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

    const isDataUri = typeof rawSrc === 'string' && rawSrc.startsWith('data:');
    const img = new Image();
    if (!isDataUri) {
      img.crossOrigin = 'anonymous';
    }
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

    const srcW = _sourceWidth || (_sourceImg ? (_sourceImg.naturalWidth || _sourceImg.width) : 1024) || 1024;
    const srcH = _sourceHeight || (_sourceImg ? (_sourceImg.naturalHeight || _sourceImg.height) : 1024) || 1024;

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
    if (!liveCanvas) return;

    // If current asset is already resized/compliant, live preview MUST reflect the resized 1:1 image
    // This ensures ratio selections show no visual changes while pass message is active
    const isCurrentResized = _bothStoresDone || (_currentAssetKey && _assetStates[_currentAssetKey] && _assetStates[_currentAssetKey].isResized);
    const transformedSrc = (_isTestPreviewMode && _testTransformedCurrent)
      ? _testTransformedCurrent
      : ((_currentAssetKey && _assetStates[_currentAssetKey] && _assetStates[_currentAssetKey].transformedCurrent)
          ? _assetStates[_currentAssetKey].transformedCurrent
          : '');

    if (isCurrentResized && transformedSrc) {
      if (_transformedImg && _transformedImg.src === transformedSrc && _transformedImg.complete) {
        liveCanvas.width = 1024;
        liveCanvas.height = 1024;
        const ctx = liveCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 1024, 1024);
          ctx.drawImage(_transformedImg, 0, 0, 1024, 1024);
        }
        return;
      }
      const tImg = new Image();
      tImg.onload = () => {
        _transformedImg = tImg;
        liveCanvas.width = 1024;
        liveCanvas.height = 1024;
        const ctx = liveCanvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.drawImage(tImg, 0, 0, 1024, 1024);
      };
      tImg.src = transformedSrc;
      return;
    }

    if (!_sourceImg) return;
    renderToCanvas(liveCanvas, 1024);
  }

  function applyTransformation() {
    if (!_sourceImg) return;
    _transformedImg = null;

    if (typeof isDemoMode === 'function' && isDemoMode() && !_isTestPreviewMode) {
      if (typeof requireFullVersion === 'function') {
        requireFullVersion('icon-resize');
      }
      return;
    }

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

    // Test Preview Mode: update modal preview, status message & inspector, but DO NOT mutate global ICON or userDraft!
    if (_isTestPreviewMode) {
      _testTransformed1024 = dataUrl1024;
      _testTransformed512 = dataUrl512;
      _testTransformedCurrent = transformedDataUrl;

      // DO NOT overwrite _sourceDataUrl — keep original source so fit mode changes still work
      _bothStoresDone = true;

      // Update Image in Inspector tab
      const modalImg = $('msIconModalImg');
      if (modalImg) modalImg.src = transformedDataUrl;

      // Re-inspect using active store
      if (typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
        global.IconLog.inspectIcon(transformedDataUrl, null, targetStore);
      }

      // Synchronously update liveCanvas so preview reflects the new fitMode immediately
      const liveCanvas = $('appIconResizeLiveCanvas');
      if (liveCanvas) {
        liveCanvas.width = 1024;
        liveCanvas.height = 1024;
        const liveCtx = liveCanvas.getContext('2d');
        if (liveCtx) liveCtx.drawImage(cv1024, 0, 0);
      }
      _transformedImg = new Image();
      _transformedImg.src = transformedDataUrl;

      updateLivePreview();
      _bothStoresDone = true;
      updateFitContainerVisibility();

      const statusMsg = $('iconResizeStatusMsg');
      const msgText = `Test Preview: Resized to ${targetStore === 'google' ? '512×512' : '1024×1024'} px (Draft untouched)`;
      if (statusMsg) {
        statusMsg.textContent = msgText;
        statusMsg.style.display = 'block';
      }

      // Persist to asset state map so switching assets remembers this resize
      saveCurrentAssetState({
        isResized: true,
        fitMode: _fitMode,
        transformed1024: dataUrl1024,
        transformed512: dataUrl512,
        transformedCurrent: transformedDataUrl,
        statusMsg: msgText
      });
      return;
    }

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
    const fitSection = $('appIconFitContainer') || (typeof document !== 'undefined' && typeof document.querySelector === 'function' ? document.querySelector('.icon-resizer-fit-container') : null);
    const placeholder = $('appIconFitPlaceholder');
    const primaryBtn = $('iconActionPrimaryBtn');
    const statusMsg = $('iconResizeStatusMsg');
    const passNote = $('appIconFitPassNote');

    // Always keep aspect ratio options visible for app icon selection
    if (fitSection) fitSection.style.display = 'flex';
    if (placeholder) placeholder.style.display = 'none';

    const isCurrentResized = _bothStoresDone || (_currentAssetKey && _assetStates[_currentAssetKey] && _assetStates[_currentAssetKey].isResized);
    const isSquare = (_sourceWidth === _sourceHeight && _sourceWidth > 0);
    const isPassed = !!(isCurrentResized || isSquare);

    // Show note when image has already passed or is 1:1 square (ratio changes won't make an effect)
    if (passNote) {
      passNote.textContent = '1:1 square · Ratio changes have no effect';
      passNote.style.display = isPassed ? 'inline-block' : 'none';
    }

    // In Demo Mode: if user is viewing actual app icon (not testing sample asset), keep button with lock icon
    if (typeof isDemoMode === 'function' && isDemoMode() && !_isTestPreviewMode) {
      if (primaryBtn) {
        primaryBtn.style.display = 'inline-flex';
        primaryBtn.disabled = false;
        ensurePrimaryBtnLock();
      }
      if (statusMsg) statusMsg.style.display = 'none';
      return;
    }

    if (_isTestPreviewMode) {
      removePrimaryBtnLock();
      if (primaryBtn) {
        primaryBtn.disabled = !!isCurrentResized;
        primaryBtn.style.display = 'inline-flex';
        const btnText = $('iconActionPrimaryText');
        if (btnText) {
          btnText.textContent = 'Fix & Resize to Store Spec';
        }
      }
      return;
    }

    if (isCurrentResized) {
      if (primaryBtn) {
        primaryBtn.disabled = true;
        primaryBtn.style.display = 'inline-flex';
      }
      if (statusMsg) {
        statusMsg.textContent = 'Icon already meets store size requirements.';
        statusMsg.style.display = 'block';
      }
    } else {
      if (primaryBtn) {
        primaryBtn.disabled = false;
        primaryBtn.style.display = 'inline-flex';
      }
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

  function setTestPreviewMode(isTest) {
    _isTestPreviewMode = !!isTest;
    const secTitle = $('appIconResizeSectionTitle');
    if (secTitle) {
      secTitle.textContent = _isTestPreviewMode ? 'Test Asset Preview' : 'Your App Icon';
    }
  }

  function isTestPreviewMode() {
    return _isTestPreviewMode;
  }

  function commitTestAssetToDraft() {
    const final1024 = _testTransformed1024 || _sourceDataUrl;
    const final512 = _testTransformed512 || _sourceDataUrl;
    const finalCurrent = _testTransformedCurrent || _sourceDataUrl;

    if (typeof IS_CUSTOM_ICON !== 'undefined') IS_CUSTOM_ICON = true;
    if (typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = final1024;
    if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = final512;
    if (typeof ICON !== 'undefined') ICON = finalCurrent;
    if (typeof ICON_FILE_TYPE !== 'undefined') ICON_FILE_TYPE = 'image/png';
    if (typeof ICON_FILE_SIZE !== 'undefined') ICON_FILE_SIZE = 0;

    if (typeof userDraft !== 'undefined' && userDraft && CURRENT_PRESET_KEY === 'draft') {
      userDraft.icon = finalCurrent;
      userDraft.icon1024 = final1024;
      userDraft.icon512 = final512;
      userDraft.isCustomIcon = true;
    }

    if (typeof renderIcons === 'function') renderIcons();
    if (typeof validateAppIcon === 'function') validateAppIcon();
    if (typeof saveState === 'function') saveState();
    if (typeof updateDraftPill === 'function') updateDraftPill();

    _isTestPreviewMode = false;
    const secTitle = $('appIconResizeSectionTitle');
    if (secTitle) secTitle.textContent = 'Your App Icon';

    // Update preset card thumbnail to newly committed icon
    const presetThumb = $('demoSamplePresetThumb');
    if (presetThumb) presetThumb.src = finalCurrent;

    const statusMsg = $('iconResizeStatusMsg');
    if (statusMsg) {
      statusMsg.textContent = 'Saved and applied to your app icon!';
      statusMsg.style.display = 'block';
    }
    if (typeof showToast === 'function') {
      showToast('Applied test image to your app icon!', 'ok');
    }
  }

  function syncCardStateDots() {
    const cardIdMap = {
      preset: 'demoSampleCardPreset',
      doraemon1: 'demoSampleCard1',
      doraemon2: 'demoSampleCard2',
      doraemon3: 'demoSampleCard3'
    };
    Object.keys(cardIdMap).forEach(key => {
      const card = $(cardIdMap[key]);
      if (!card) return;
      const state = _assetStates[key];
      const hasState = !!(state && state.isResized);
      card.classList.toggle('has-state', !!hasState);
    });
  }

  function getCurrentAssetKey() {
    return _currentAssetKey;
  }

  function setCurrentAssetKey(key) {
    saveCurrentAssetState();
    _currentAssetKey = key || 'preset';
  }

  function saveCurrentAssetState(overrides) {
    if (!_currentAssetKey) return;
    const existing = _assetStates[_currentAssetKey] || {};
    const statusMsgEl = $('iconResizeStatusMsg');
    const isNowResized = (overrides && overrides.isResized !== undefined) ? overrides.isResized : (existing.isResized || _bothStoresDone);
    _assetStates[_currentAssetKey] = Object.assign(existing, {
      fitMode: _fitMode,
      isResized: isNowResized,
      transformed1024: _testTransformed1024 || existing.transformed1024 || '',
      transformed512: _testTransformed512 || existing.transformed512 || '',
      transformedCurrent: _testTransformedCurrent || existing.transformedCurrent || '',
      statusMsg: (statusMsgEl && statusMsgEl.style.display !== 'none' && statusMsgEl.textContent) ? statusMsgEl.textContent : (existing.statusMsg || ''),
      sourceUrl: _originalSourceDataUrl || _sourceDataUrl,
      width: _sourceWidth || existing.width || 0,
      height: _sourceHeight || existing.height || 0
    }, overrides || {});
    syncCardStateDots();
  }

  function getAssetState(key) {
    return _assetStates[key] || null;
  }

  function restoreAssetState(sampleKey, rawDataUrl) {
    _currentAssetKey = sampleKey;
    _isTestPreviewMode = (sampleKey !== 'preset');
    const state = _assetStates[sampleKey];

    if (state && state.isResized && state.transformedCurrent) {
      _fitMode = state.fitMode || 'center-crop';
      _sourceDataUrl = rawDataUrl;
      _originalSourceDataUrl = rawDataUrl;
      _testTransformed1024 = state.transformed1024 || '';
      _testTransformed512 = state.transformed512 || '';
      _testTransformedCurrent = state.transformedCurrent || '';
      _bothStoresDone = true;

      syncFitModeUI(_fitMode);

      ensureSourceLoaded(() => {
        updateLivePreview();
        updateFitContainerVisibility();

        const statusMsg = $('iconResizeStatusMsg');
        if (statusMsg && state.statusMsg) {
          statusMsg.textContent = state.statusMsg;
          statusMsg.style.display = 'block';
        }
      });
    } else if (state && state.fitMode) {
      _fitMode = state.fitMode;
      _testTransformed1024 = '';
      _testTransformed512 = '';
      _testTransformedCurrent = '';
    _transformedImg = null;
      _bothStoresDone = false;

      syncFitModeUI(_fitMode);
      setSource(rawDataUrl);
    } else {
      _fitMode = 'center-crop';
      _testTransformed1024 = '';
      _testTransformed512 = '';
      _testTransformedCurrent = '';
    _transformedImg = null;
      _bothStoresDone = false;

      syncFitModeUI(_fitMode);
      setSource(rawDataUrl);
    }
    syncCardStateDots();
  }

  function resetTestState() {
    _assetStates = {}; // Wipes all per-asset state on modal close
    _currentAssetKey = 'preset';
    _isTestPreviewMode = false;
    _testTransformed1024 = '';
    _testTransformed512 = '';
    _testTransformedCurrent = '';
    _transformedImg = null;

    // Reset fit mode to default center-crop
    _fitMode = 'center-crop';
    syncFitModeUI('center-crop');


    const statusMsg = $('iconResizeStatusMsg');
    if (statusMsg) {
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    const secTitle = $('appIconResizeSectionTitle');
    if (secTitle) secTitle.textContent = 'Your App Icon';

    // Reset active sample card back to Card 01 (preset)
    const cards = (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function')
      ? document.querySelectorAll('.icon-demo-sample-card')
      : [];
    cards.forEach(c => {
      c.classList.toggle('active', c.id === 'demoSampleCardPreset');
      c.classList.remove('has-state');
    });

    // Reset real app icon as active source
    let actualIcon = '';
    let tStore = 'apple';
    try {
      if (global.IconLog && typeof global.IconLog.getTargetStore === 'function') {
        tStore = global.IconLog.getTargetStore();
      }
    } catch (e) {}

    if (typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON) {
      if (tStore === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) {
        actualIcon = CUSTOM_ICON_512;
      } else if (typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) {
        actualIcon = CUSTOM_ICON_1024;
      }
    }
    if (!actualIcon && typeof ICON !== 'undefined' && ICON) {
      actualIcon = ICON;
    }

    if (actualIcon) {
      setSource(actualIcon);

      const modalImg = $('msIconModalImg') || $('imageDetailModalImg');
      if (modalImg) modalImg.src = actualIcon;

      const presetThumb = $('demoSamplePresetThumb');
      if (presetThumb) presetThumb.src = actualIcon;

      if (typeof global._activeModalAsset !== 'undefined') {
        global._activeModalAsset = actualIcon;
      }

      if (typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
        global.IconLog.inspectIcon(actualIcon, null, tStore);
      } else if (typeof global.inspectModalAsset === 'function') {
        global.inspectModalAsset(actualIcon, null);
      }
    }

    updateFitContainerVisibility();
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
    syncPill: updateFitPill,
    setTestPreviewMode,
    isTestPreviewMode,
    commitTestAssetToDraft,
    resetTestState,
    getCurrentAssetKey,
    setCurrentAssetKey,
    saveCurrentAssetState,
    getAssetState,
    restoreAssetState
  };

  global.initIconResizer = initIconResizer;
  global.syncIconFitPill = updateFitPill;
  global.switchIconModalTab = switchIconModalTab;
  global.openIconResizerModal = openIconResizerModal;
  global.closeIconResizerModal = closeIconResizerModal;
  global.ensureResizerSourceLoaded = ensureSourceLoaded;
  global.commitTestAssetToDraft = commitTestAssetToDraft;
  global.resetIconTestState = resetTestState;

  // Auto-init on load or DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIconResizer);
    } else {
      initIconResizer();
    }
  }

})(typeof window !== 'undefined' ? window : this);
