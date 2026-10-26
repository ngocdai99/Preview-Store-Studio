// Store Preview Studio - Unified Asset Inspector Modal Controller (Single Source of Truth)
// Used seamlessly by both Core Studio and Marketing Showcase
(function (global) {
  'use strict';

  let _activeModalAsset = null;
  let _activeModalType = 'icon';
  let _activeModalStore = 'apple';
  let _activeModalIndex = -1;
  let _activeModalOnReplace = null;
  let _activeModalTitle = '';
  let _modalValRunId = 0;
  let _isInitialized = false;

  function $(id) {
    return document.getElementById(id);
  }

  function getAssetMeta(src, file) {
    if (file && typeof file.size === 'number') {
      return { size: file.size, type: file.type || 'image/png', name: file.name || '' };
    }
    let size = 0;
    let type = 'image/png';
    if (typeof src === 'string' && src.startsWith('data:')) {
      const comma = src.indexOf(',');
      if (comma !== -1) {
        const semi = src.indexOf(';');
        if (semi !== -1) type = src.substring(5, semi);
        const base64 = src.slice(comma + 1);
        const padding = base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0);
        size = Math.round((base64.length * 3) / 4 - padding);
      }
    }
    return { size, type };
  }

  const SVG_STORE_PNG_CACHE = new Map();
  function rasterizeSvgToStorePng(svgSrc, targetSize, callback) {
    if (!svgSrc || typeof svgSrc !== 'string') {
      if (callback) callback(svgSrc);
      return;
    }
    if (!svgSrc.startsWith('data:image/svg+xml') && !svgSrc.includes('<svg')) {
      if (callback) callback(svgSrc);
      return;
    }

    const cacheKey = `${targetSize}_${svgSrc.length}_${svgSrc.slice(0, 80)}`;
    if (SVG_STORE_PNG_CACHE.has(cacheKey)) {
      if (callback) callback(SVG_STORE_PNG_CACHE.get(cacheKey));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetSize, targetSize);

        const data = ctx.getImageData(0, 0, targetSize, targetSize).data;
        let hasAlpha = false;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) { hasAlpha = true; break; }
        }

        let finalPng = '';
        if (hasAlpha) {
          const solidCanvas = document.createElement('canvas');
          solidCanvas.width = targetSize;
          solidCanvas.height = targetSize;
          const sCtx = solidCanvas.getContext('2d');
          const topEdgeIdx = (Math.floor(targetSize * 0.05) * targetSize + Math.floor(targetSize / 2)) * 4;
          const midIdx = (Math.floor(targetSize / 2) * targetSize + Math.floor(targetSize / 2)) * 4;
          const r = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx] : (data[midIdx + 3] > 240 ? data[midIdx] : 255);
          const g = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 1] : (data[midIdx + 3] > 240 ? data[midIdx + 1] : 255);
          const b = data[topEdgeIdx + 3] > 240 ? data[topEdgeIdx + 2] : (data[midIdx + 3] > 240 ? data[midIdx + 2] : 255);
          sCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          sCtx.fillRect(0, 0, targetSize, targetSize);
          sCtx.drawImage(canvas, 0, 0);
          finalPng = solidCanvas.toDataURL('image/png');
        } else {
          finalPng = canvas.toDataURL('image/png');
        }

        SVG_STORE_PNG_CACHE.set(cacheKey, finalPng);
        if (callback) callback(finalPng);
      } catch (e) {
        if (callback) callback(svgSrc);
      }
    };
    img.onerror = () => {
      if (callback) callback(svgSrc);
    };
    img.src = svgSrc;
  }
  global.rasterizeSvgToStorePng = rasterizeSvgToStorePng;

  function closeIconModal() {
    const modal = $('msIconModal') || $('imageDetailModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function openIconModal(arg1, arg2) {
    let opts = {};
    if (typeof arg1 === 'string') {
      opts.src = arg1;
      opts.store = arg2 || (typeof store !== 'undefined' ? store : (typeof currentMode !== 'undefined' ? currentMode : 'apple'));
      opts.type = 'icon';
    } else if (arg1 && typeof arg1 === 'object') {
      opts = Object.assign({}, arg1);
    }

    const modal = $('msIconModal') || $('imageDetailModal');
    if (!modal) return;

    _activeModalType = opts.type || 'icon';
    _activeModalStore = opts.store || (typeof store !== 'undefined' ? store : (typeof currentMode !== 'undefined' ? currentMode : 'apple'));
    _activeModalIndex = typeof opts.index === 'number' ? opts.index : -1;
    _activeModalOnReplace = typeof opts.onReplace === 'function' ? opts.onReplace : null;
    _activeModalTitle = opts.title || '';

    let src = opts.src;
    if (!src) {
      if (_activeModalType === 'icon') {
        src = (typeof ICON !== 'undefined' ? ICON : (typeof S !== 'undefined' && S ? (S[_activeModalStore === 'apple' ? 'iconApple' : 'iconGoogle'] || S.icon) : ''));
      } else if (_activeModalType === 'feature') {
        src = (typeof FEATURE_GRAPHIC !== 'undefined' ? FEATURE_GRAPHIC : '');
      } else if (_activeModalType === 'ipad' && _activeModalIndex >= 0) {
        src = (typeof IPAD_SHOTS !== 'undefined' && IPAD_SHOTS[_activeModalIndex] ? IPAD_SHOTS[_activeModalIndex] : '');
      } else if (_activeModalType === 'screenshot' && _activeModalIndex >= 0) {
        src = (typeof SHOTS !== 'undefined' && SHOTS[_activeModalIndex] ? SHOTS[_activeModalIndex] : '');
      }
    }
    _activeModalAsset = src || '';

    modal.dataset.storeType = _activeModalStore;
    const canvas = $('msIconModalCanvas') || $('imageDetailModalCanvas');
    if (canvas) canvas.dataset.storeType = _activeModalStore;

    // Header & Titles Setup
    const titleEl = $('msIconModalTitle') || $('imageDetailModalTitle');
    const storeBadge = $('msIconModalStoreBadge') || $('imageDetailModalStoreBadge');
    const targetSpec = $('msIconModalTarget') || $('imageDetailModalTarget');
    const uploadBtnText = $('msIconModalUploadText') || $('imageDetailModalUploadText');

    if (storeBadge) {
      storeBadge.className = 'icon-modal-store-tag ' + (_activeModalStore === 'google' ? 'g' : 'a');
      storeBadge.textContent = _activeModalStore === 'google' ? 'Google' : 'Apple';
    }

    if (_activeModalType === 'icon') {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Apple App Icon Inspector' : 'Google Play Icon Inspector';
      if (targetSpec) targetSpec.textContent = _activeModalStore === 'apple' ? 'Standard: 1024×1024 px (1:1 · Opaque)' : 'Standard: 512×512 px (1:1 · ≤1024 KB)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Icon';
    } else if (_activeModalType === 'ipad') {
      if (titleEl) titleEl.textContent = 'Apple iPad Pro 13" Screenshot Inspector';
      if (targetSpec) targetSpec.textContent = 'Standard: 2048×2732 px (3:4 Portrait)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New iPad Screenshot';
    } else if (_activeModalType === 'feature') {
      if (titleEl) titleEl.textContent = 'Google Play Feature Graphic Inspector';
      if (targetSpec) targetSpec.textContent = 'Standard: 1024×500 px (Landscape · ≤15 MB)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Feature Graphic';
    } else {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'iPhone Screenshot Inspector' : 'Android Screenshot Inspector';
      if (targetSpec) targetSpec.textContent = _activeModalStore === 'apple' ? 'Standard: 1290×2796 px (Portrait 9:19.5)' : 'Standard: 1080×1920 px (Portrait 9:16)';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Screenshot';
    }

    if (_activeModalTitle && titleEl) {
      titleEl.textContent = _activeModalTitle;
    }

    const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
    if (_activeModalType === 'icon' && typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      const targetDim = (_activeModalStore === 'google' ? 512 : 1024);
      rasterizeSvgToStorePng(_activeModalAsset, targetDim, pngDataUrl => {
        _activeModalAsset = pngDataUrl;
        if (imgEl) imgEl.src = pngDataUrl;
        inspectModalAsset(pngDataUrl, null);
      });
    } else {
      if (imgEl && _activeModalAsset) {
        imgEl.src = _activeModalAsset;
      }
      inspectModalAsset(_activeModalAsset, opts.file);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    initModalEventListeners();
  }

  function inspectModalAsset(src, file) {
    const dimEl = $('msIconModalDim') || $('imageDetailModalDim');
    const ratioEl = $('msIconModalRatio') || $('imageDetailModalRatio');
    const sizeEl = $('msIconModalSize') || $('imageDetailModalSize');
    const formatEl = $('msIconModalFormat') || $('imageDetailModalFormat');
    const badgeEl = $('msIconModalBadge') || $('imageDetailModalBadge');
    const msgEl = $('msIconModalMsg') || $('imageDetailModalMsg');

    if (!src) {
      if (dimEl) dimEl.textContent = '--';
      if (ratioEl) ratioEl.textContent = '--';
      if (sizeEl) sizeEl.textContent = '--';
      if (formatEl) formatEl.textContent = '--';
      if (badgeEl) { badgeEl.className = 'icon-modal-badge warn'; badgeEl.textContent = 'No Asset'; }
      if (msgEl) { msgEl.className = 'icon-modal-warn-msg'; msgEl.textContent = ''; }
      return;
    }

    const runId = ++_modalValRunId;
    const meta = getAssetMeta(src, file);
    const mimeType = (meta.type || '').toLowerCase();
    const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';
    const sizeBytes = meta.size || 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (runId !== _modalValRunId) return;

      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      const isSq = (w === h);

      // Pixel audit (alpha channel & apex corners)
      let hasAlpha = false;
      let hasPreRoundedCorners = false;
      try {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) { hasAlpha = true; break; }
        }
        const cornerIdx = [
          (0 * 64 + 0) * 4 + 3,
          (0 * 64 + 63) * 4 + 3,
          (63 * 64 + 0) * 4 + 3,
          (63 * 64 + 63) * 4 + 3
        ];
        hasPreRoundedCorners = cornerIdx.some(idx => data[idx] < 200);
      } catch (e) {}

      // Update 2x2 Metrics Grid
      if (dimEl) {
        dimEl.textContent = `${w} × ${h} px`;
        let dimOk = false;
        if (_activeModalType === 'icon') {
          dimOk = (_activeModalStore === 'apple' && w === 1024 && h === 1024) ||
                  (_activeModalStore === 'google' && w === 512 && h === 512);
        } else if (_activeModalType === 'feature') {
          dimOk = (w === 1024 && h === 500);
        } else if (_activeModalType === 'ipad') {
          dimOk = (w === 2048 && h === 2732);
        } else {
          dimOk = isSq ? false : true;
        }
        dimEl.className = 'icon-metric-val ' + (dimOk ? 'ok' : 'warn');
      }

      if (ratioEl) {
        if (isSq) {
          ratioEl.textContent = '1:1 Square';
          ratioEl.className = 'icon-metric-val ok';
        } else {
          const r = (w / (h || 1)).toFixed(2);
          ratioEl.textContent = `${r}:1`;
          ratioEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' ? 'err' : 'ok');
        }
      }

      if (sizeEl) {
        if (sizeBytes > 0) {
          const kb = (sizeBytes / 1024).toFixed(0);
          sizeEl.textContent = `${kb} KB`;
          sizeEl.title = `${sizeBytes.toLocaleString('en-US')} bytes`;
          const sizeErr = (_activeModalType === 'icon' && _activeModalStore === 'google' && sizeBytes > 1024 * 1024);
          sizeEl.className = 'icon-metric-val ' + (sizeErr ? 'err' : 'ok');
        } else {
          sizeEl.textContent = 'Optimized';
          sizeEl.className = 'icon-metric-val ok';
        }
      }

      if (formatEl) {
        const fmt = (mimeType || 'image/png').replace('image/', '').toUpperCase();
        if (hasAlpha) {
          formatEl.textContent = `${fmt} · Alpha`;
          formatEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' && _activeModalStore === 'apple' ? 'err' : 'ok');
        } else if (isJpeg) {
          formatEl.textContent = 'JPEG';
          formatEl.className = 'icon-metric-val warn';
        } else {
          formatEl.textContent = `${fmt} · Opaque`;
          formatEl.className = 'icon-metric-val ok';
        }
      }

      // Compliance Evaluator State
      let level = 'ok';
      let badgeText = '';
      let detailsHtml = '';

      if (_activeModalType === 'icon') {
        if (_activeModalStore === 'apple') {
          if (!isSq) {
            level = 'err';
            badgeText = `Non-square (${w}×${h} px) · 1:1 square required`;
            detailsHtml = '<p>Apple App Store requires a 1:1 square icon (1024×1024 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from Figma, Sketch, or Photoshop.</p>';
          } else if (hasAlpha) {
            level = 'err';
            badgeText = 'ITMS-90717: Alpha detected · 100% Opaque required';
            detailsHtml = '<p>ITMS-90717 Error: Xcode and App Store Connect reject icons with alpha channels. The icon must be 100% opaque without transparency.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG without an alpha channel.</p>';
          } else if (isJpeg) {
            level = 'warn';
            badgeText = 'Not recommended: PNG preferred per store guidelines';
            detailsHtml = '<p>JPEG format is not part of official store specifications. Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Apple documentation specifies standard PNG format with sRGB or Display P3.</p>';
          } else if (w !== 1024) {
            level = 'warn';
            badgeText = `${w}×${h} px · Apple recommends 1024×1024 px`;
            detailsHtml = '<p>Apple App Store recommends standard 1024×1024 px resolution to ensure clarity across all Retina displays.</p><p class="icon-modal-warn-hint">Re-export at 1024×1024 px from your design tool.</p>';
          } else {
            level = 'ok';
            badgeText = '1024×1024 px · App Store Compliant';
            detailsHtml = '';
          }
        } else {
          // Google Store Icon
          const MAX_GOOGLE_ICON_BYTES = 1024 * 1024;
          if (!isSq) {
            level = 'err';
            badgeText = `Non-square (${w}×${h} px) · 1:1 square required`;
            detailsHtml = '<p>Google Play requires a 1:1 square icon (512×512 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from your design tool.</p>';
          } else if (sizeBytes > MAX_GOOGLE_ICON_BYTES) {
            const kb = (sizeBytes / 1024).toFixed(0);
            level = 'err';
            badgeText = `File size error: ${kb} KB · Exceeds maximum 1024 KB`;
            detailsHtml = `<p>Google Play Console strictly enforces a maximum file size of 1024 KB (1,048,576 bytes). Your file is currently ${kb} KB and will be rejected upon upload.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
          } else if (isJpeg) {
            level = 'warn';
            badgeText = 'Not recommended: PNG preferred per store guidelines';
            detailsHtml = '<p>JPEG format is not part of official Google Play specifications (requires 32-bit PNG). Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Export standard 32-bit PNG (sRGB).</p>';
          } else if (hasPreRoundedCorners) {
            level = 'warn';
            badgeText = 'Not recommended: Pre-rounded corners or shadow';
            detailsHtml = '<p>Pre-rounded corners or drop shadows are not recommended: Google Play dynamically applies a 20% corner radius mask and drop shadow on store listings.</p><p class="icon-modal-warn-hint">Export a full-bleed square image without rounded corners.</p>';
          } else if (w !== 512) {
            level = 'warn';
            badgeText = `${w}×${h} px · Google Play recommends 512×512 px`;
            detailsHtml = '<p>Google Play Console requires standard 512×512 px dimensions.</p><p class="icon-modal-warn-hint">Export standard 512×512 px from Figma or Photoshop.</p>';
          } else {
            const sizeNote = sizeBytes ? ` (${(sizeBytes / 1024).toFixed(0)} KB)` : '';
            level = 'ok';
            badgeText = `512×512 px · Google Play Compliant${sizeNote}`;
            detailsHtml = '';
          }
        }
      } else if (_activeModalType === 'feature') {
        if (w === 1024 && h === 500) {
          level = 'ok';
          badgeText = '1024×500 px · Google Play Compliant';
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Google Play requires 1024×500 px`;
          detailsHtml = '<p>Google Play requires a landscape Feature Graphic of exactly 1024×500 px.</p><p class="icon-modal-warn-hint">Export standard 1024×500 px to display properly on the Play Store banner.</p>';
        }
      } else if (_activeModalType === 'ipad') {
        if (w === 2048 && h === 2732) {
          level = 'ok';
          badgeText = '2048×2732 px · iPad Pro 13" Compliant';
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Target: 2048×2732 px`;
          detailsHtml = '<p>Apple recommends 2048×2732 px for 13" iPad Pro screenshots (Portrait).</p><p class="icon-modal-warn-hint">Store Preview Studio automatically scales screenshots to standard canvas proportions.</p>';
        }
      } else {
        // Phone Screenshot
        level = 'ok';
        badgeText = `${w}×${h} px · Active Screenshot`;
      }

      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge ' + level;
        badgeEl.textContent = badgeText;
      }

      if (msgEl) {
        if (detailsHtml) {
          msgEl.className = 'icon-modal-warn-msg visible' + (level === 'warn' ? ' warn-mode' : '');
          msgEl.innerHTML = detailsHtml;
        } else {
          msgEl.className = 'icon-modal-warn-msg';
          msgEl.textContent = '';
        }
      }

      // Synchronize with Marketing Showcase state if present
      if (typeof iconValidationState !== 'undefined' && _activeModalType === 'icon') {
        iconValidationState[_activeModalStore] = {
          src, width: w, height: h, isSquare: isSq, sizeBytes,
          mimeType, isJpeg, hasAlpha, hasPreRoundedCorners,
          level, badgeText, modalBadgeText: badgeText, detailsHtml, isCustom: true
        };
        if (typeof applyIconCardBadge === 'function') {
          applyIconCardBadge(_activeModalStore === 'apple' ? 'msIconBadgeApple' : 'msIconBadgeGoogle', iconValidationState[_activeModalStore]);
        }
      }
    };
    img.src = src;
  }

  function handleFileReplacement(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      _activeModalAsset = dataUrl;

      const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
      if (imgEl) imgEl.src = dataUrl;

      // Notify callback or host module
      if (typeof _activeModalOnReplace === 'function') {
        _activeModalOnReplace(file, dataUrl);
      } else if (typeof handleIconUpload === 'function') {
        // Marketing showcase integration
        const storeKey = _activeModalStore === 'apple' ? 'iconApple' : 'iconGoogle';
        if (typeof customUploadedMeta !== 'undefined') {
          customUploadedMeta[_activeModalStore] = { size: file.size, type: file.type, name: file.name };
        }
        handleIconUpload(storeKey, _activeModalStore, dataUrl);
      } else if (_activeModalType === 'icon') {
        // Core studio fallback
        if (typeof ICON !== 'undefined') {
          ICON = dataUrl;
          if (typeof renderIcons === 'function') renderIcons();
          if (typeof saveState === 'function') saveState();
        }
      }

      inspectModalAsset(dataUrl, file);
      if (typeof showToast === 'function') {
        showToast('Asset updated & verified successfully!', 'ok');
      }
    };
    reader.readAsDataURL(file);
  }

  function initModalEventListeners() {
    if (_isInitialized) return;
    _isInitialized = true;

    const modal = $('msIconModal') || $('imageDetailModal');
    if (!modal) return;

    // Dismiss on backdrop click
    modal.addEventListener('click', e => {
      if (!e.target.closest('#msIconModalCanvas') && !e.target.closest('#imageDetailModalCanvas')) {
        closeIconModal();
      }
    });

    // Close button
    const closeBtn = $('msIconModalClose') || $('imageDetailModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        closeIconModal();
      });
    }

    // Escape key
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeIconModal();
      }
    });

    // Upload button & hidden input
    const uploadBtn = $('msIconModalUploadBtn') || $('imageDetailModalUploadBtn');
    const fileInput = $('msIconModalInput') || $('imageDetailModalInput');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', e => {
        e.stopPropagation();
        fileInput.click();
      });
      fileInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleFileReplacement(e.target.files[0]);
        }
        e.target.value = '';
      });
    }

    // Drag and Drop on Art Container
    const artContainer = $('msIconModalArt') || $('imageDetailModalArt');
    if (artContainer) {
      artContainer.addEventListener('dragover', e => {
        e.preventDefault();
        artContainer.classList.add('drag-over');
      });
      artContainer.addEventListener('dragleave', () => {
        artContainer.classList.remove('drag-over');
      });
      artContainer.addEventListener('drop', e => {
        e.preventDefault();
        artContainer.classList.remove('drag-over');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileReplacement(e.dataTransfer.files[0]);
        }
      });
    }
  }

  // Export to global scope
  global.openIconModal = openIconModal;
  global.openImageDetailModal = openIconModal;
  global.closeIconModal = closeIconModal;
  global.closeImageDetailModal = closeIconModal;

})(typeof window !== 'undefined' ? window : this);
