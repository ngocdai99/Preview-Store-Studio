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
    // Custom icon: always inspect the store-specific variant, regardless of passed src
    if (_activeModalType === 'icon' && typeof IS_CUSTOM_ICON !== 'undefined' && IS_CUSTOM_ICON) {
      if (_activeModalStore === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) src = CUSTOM_ICON_512;
      else if (_activeModalStore === 'apple' && typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) src = CUSTOM_ICON_1024;
    }
    if (!src) {
      if (_activeModalType === 'icon') {
        if (_activeModalStore === 'google' && typeof CUSTOM_ICON_512 !== 'undefined' && CUSTOM_ICON_512) {
          src = CUSTOM_ICON_512;
        } else if (_activeModalStore === 'apple' && typeof CUSTOM_ICON_1024 !== 'undefined' && CUSTOM_ICON_1024) {
          src = CUSTOM_ICON_1024;
        } else {
          src = (typeof ICON !== 'undefined' ? ICON : (typeof S !== 'undefined' && S ? (S[_activeModalStore === 'apple' ? 'iconApple' : 'iconGoogle'] || S.icon) : ''));
        }
        if (_activeModalStore === 'google' && typeof src === 'string' && src.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(src)) {
          src = src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png');
        } else if (_activeModalStore === 'apple' && typeof src === 'string' && src.includes('mzstatic.com') && /\/\d+x\d+bb\.(jpg|png)/i.test(src)) {
          src = src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png');
        }
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

    if (targetSpec) {
      targetSpec.textContent = '';
    }

    if (_activeModalType === 'icon') {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Apple App Icon Inspector' : 'Google Play Icon Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Icon';
    } else if (_activeModalType === 'ipad') {
      if (titleEl) titleEl.textContent = 'Apple iPad Screenshot Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New iPad Screenshot';
    } else if (_activeModalType === 'feature') {
      if (titleEl) titleEl.textContent = 'Google Play Feature Graphic Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Feature Graphic';
    } else {
      if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'iPhone Screenshot Inspector' : 'Android Screenshot Inspector';
      if (uploadBtnText) uploadBtnText.textContent = 'Upload New Screenshot';
    }

    if (_activeModalTitle && titleEl) {
      titleEl.textContent = _activeModalTitle;
    }

    const isIconType = (_activeModalType === 'icon');
    const tabNav = $('iconModalTabNav');
    const storeSwitch = $('iconModalStoreSwitch');

    if (tabNav) tabNav.style.display = isIconType ? 'inline-flex' : 'none';
    if (storeSwitch) storeSwitch.style.display = 'none';

    if (isIconType) {
      if (typeof global.IconInspector !== 'undefined' && typeof global.IconInspector.init === 'function') {
        global.IconInspector.init();
      }
      if (typeof global.IconResizer !== 'undefined') {
        if (typeof global.IconResizer.init === 'function') global.IconResizer.init();
        if (typeof global.IconResizer.setSource === 'function') global.IconResizer.setSource(_activeModalAsset || (typeof ICON !== 'undefined' ? ICON : ''));
      }
      if (typeof global.IconLog !== 'undefined') {
        if (typeof global.IconLog.init === 'function') global.IconLog.init();
        if (typeof global.IconLog.setTargetStore === 'function') global.IconLog.setTargetStore(_activeModalStore);
      } else if (typeof setTargetStore === 'function') {
        setTargetStore(_activeModalStore);
      }
    } else {
      if (typeof initIconResizer === 'function') initIconResizer();
      // Non-icon assets never use the resizer: force Inspect pane and clear stale icon resize UI
      if (typeof global.IconInspector !== 'undefined' && typeof global.IconInspector.switchTab === 'function') {
        global.IconInspector.switchTab('inspect');
      } else {
        const pi = $('iconPaneInspect'), pr = $('iconPaneResize');
        if (pi) pi.classList.add('active');
        if (pr) pr.classList.remove('active');
      }
      const staleMsg = $('iconResizeStatusMsg');
      if (staleMsg) staleMsg.style.display = 'none';
    }

    const primaryActionBtn = $('iconActionPrimaryBtn');
    if (primaryActionBtn) {
      primaryActionBtn.style.display = isIconType ? 'inline-flex' : 'none';
    }

    const imgEl = $('msIconModalImg') || $('imageDetailModalImg');
    // Icon uses the live 1:1 canvas + fit strategy; every other asset shows its own image as-is
    {
      const liveCv = $('appIconResizeLiveCanvas');
      const secTitle = document.querySelector('.icon-resizer-section-title');
      const fitBox = document.querySelector('.icon-resizer-fit-container');
      if (liveCv) liveCv.style.display = isIconType ? '' : 'none';
      if (secTitle) secTitle.style.display = isIconType ? '' : 'none';
      if (fitBox && !isIconType) fitBox.style.display = 'none';
      if (imgEl) imgEl.style.display = isIconType ? 'none' : 'block';
      const wrap = $('msIconModalImgWrap');
      if (wrap) {
        // Non-icon assets: plain image area, no 1:1 checkerboard card
        wrap.style.background = isIconType ? '' : 'none';
        wrap.style.boxShadow = isIconType ? '' : 'none';
        wrap.style.aspectRatio = isIconType ? '' : 'auto';
        wrap.style.maxWidth = isIconType ? '' : '100%';
        wrap.style.maxHeight = isIconType ? '' : '100%';
        wrap.style.height = isIconType ? '' : '100%';
      }
    }
    if (_activeModalType === 'icon' && typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      const targetDim = (_activeModalStore === 'google' ? 512 : 1024);
      rasterizeSvgToStorePng(_activeModalAsset, targetDim, pngDataUrl => {
        _activeModalAsset = pngDataUrl;
        if (imgEl) imgEl.src = pngDataUrl;
        if (typeof global.IconResizer !== 'undefined' && typeof global.IconResizer.setSource === 'function') {
          global.IconResizer.setSource(pngDataUrl);
        }
        inspectModalAsset(pngDataUrl, null);
      });
    } else if (_activeModalType === 'feature' && typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      if (typeof rasterizeSvgToDimensions === 'function') {
        rasterizeSvgToDimensions(_activeModalAsset, 1024, 500, pngDataUrl => {
          _activeModalAsset = pngDataUrl;
          if (imgEl) imgEl.src = pngDataUrl;
          inspectModalAsset(pngDataUrl, null);
        });
      } else {
        if (imgEl && _activeModalAsset) imgEl.src = _activeModalAsset;
        inspectModalAsset(_activeModalAsset, opts.file);
      }
    } else if (typeof _activeModalAsset === 'string' && (_activeModalAsset.startsWith('data:image/svg+xml') || _activeModalAsset.includes('<svg'))) {
      let targetW = 1290, targetH = 2796;
      if (_activeModalType === 'ipad') {
        targetW = 2048; targetH = 2732;
      } else if (_activeModalType === 'tablet') {
        targetW = 1600; targetH = 2560;
      } else if (_activeModalStore === 'google') {
        targetW = 1080; targetH = 1920;
      }
      const vbMatch = _activeModalAsset.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
      if (vbMatch) {
        const vbW = parseFloat(vbMatch[1]);
        const vbH = parseFloat(vbMatch[2]);
        if (vbW > vbH && targetH > targetW) {
          const tmp = targetW; targetW = targetH; targetH = tmp;
        }
      }
      if (typeof rasterizeSvgToDimensions === 'function') {
        rasterizeSvgToDimensions(_activeModalAsset, targetW, targetH, pngDataUrl => {
          _activeModalAsset = pngDataUrl;
          if (imgEl) imgEl.src = pngDataUrl;
          inspectModalAsset(pngDataUrl, null);
        });
      } else {
        if (imgEl && _activeModalAsset) imgEl.src = _activeModalAsset;
        inspectModalAsset(_activeModalAsset, opts.file);
      }
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
    if (_activeModalType === 'icon' && typeof global.IconLog !== 'undefined' && typeof global.IconLog.inspectIcon === 'function') {
      global.IconLog.inspectIcon(src, file, _activeModalStore);
      return;
    }

    const dimEl = $('msIconModalDim') || $('imageDetailModalDim');
    const ratioEl = $('msIconModalRatio') || $('imageDetailModalRatio');
    const sizeEl = $('msIconModalSize') || $('imageDetailModalSize');
    const formatEl = $('msIconModalFormat') || $('imageDetailModalFormat');
    const badgeEl = $('msIconModalBadge') || $('imageDetailModalBadge');
    const msgEl = $('msIconModalMsg') || $('imageDetailModalMsg');

    const isPlaceholder = !src || 
                          src === (typeof PH !== 'undefined' ? PH : '') || 
                          src === (typeof PH_IPAD !== 'undefined' ? PH_IPAD : '') || 
                          src === (typeof PH_TAB !== 'undefined' ? PH_TAB : '') ||
                          src === (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');

    if (isPlaceholder) {
      if (dimEl) {
        if (_activeModalType === 'ipad') {
          dimEl.textContent = 'Empty (2048 × 2732 px target)';
        } else if (_activeModalType === 'tablet') {
          dimEl.textContent = 'Empty (16:10 target)';
        } else if (_activeModalType === 'feature') {
          dimEl.textContent = 'Empty (1024 × 500 px target)';
        } else if (_activeModalType === 'icon') {
          dimEl.textContent = _activeModalStore === 'apple' ? 'Empty (1024 × 1024 px target)' : 'Empty (512 × 512 px target)';
        } else if (_activeModalStore === 'google') {
          dimEl.textContent = 'Empty (1080 × 1920 px target)';
        } else {
          dimEl.textContent = 'Empty (1290 × 2796 px target)';
        }
        dimEl.className = 'icon-metric-val';
      }
      if (ratioEl) {
        if (_activeModalType === 'ipad') ratioEl.textContent = '3:4 (Target)';
        else if (_activeModalType === 'tablet') ratioEl.textContent = '16:10 (Target)';
        else if (_activeModalType === 'icon') ratioEl.textContent = '1:1 Square';
        else if (_activeModalType === 'feature') ratioEl.textContent = '2.05:1 Landscape';
        else if (_activeModalStore === 'google') ratioEl.textContent = '9:16 (Target)';
        else ratioEl.textContent = '9:19.5 (Target)';
        ratioEl.className = 'icon-metric-val';
      }
      if (sizeEl) {
        sizeEl.textContent = 'None (Max 8 MB)';
        sizeEl.className = 'icon-metric-val';
      }
      if (formatEl) {
        formatEl.textContent = 'PNG / JPEG';
        formatEl.className = 'icon-metric-val';
      }
      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge';
        badgeEl.textContent = 'Empty Slot · Ready to Upload';
      }
      if (msgEl) {
        msgEl.className = 'icon-modal-warn-msg';
        msgEl.textContent = '';
      }
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
      const isSq = (w === h) || ((Math.abs(w - h) / Math.max(w, h)) < 0.08);
      const isLandscape = w > h * 1.15;
      const isPhonePortrait = h >= w * 1.35;
      const isIpadPortrait = (Math.abs(w / h - 0.75) < 0.08) || (w / h >= 0.65 && w / h <= 0.85);
      const isIpadLandscape = (Math.abs(w / h - 1.333) < 0.08) || (w / h >= 1.18 && w / h <= 1.54);
      const isTabletPortrait = (w / h >= 0.55 && w / h <= 0.7);
      const isTabletLandscape = (w / h >= 1.4 && w / h <= 1.8);

      // Standard Apple landscape resolutions (official App Store Connect dims)
      const isStandardAppleLandscapeModal = isLandscape && _activeModalStore === 'apple' && (
        (w === 2868 && h === 1320) || (w === 2796 && h === 1290) || (w === 2736 && h === 1260) ||
        (w === 2622 && h === 1206) || (w === 2556 && h === 1179) ||
        (w === 2778 && h === 1284) || (w === 2688 && h === 1242) ||
        (w === 2532 && h === 1170) || (w === 2436 && h === 1125) || (w === 2340 && h === 1080) ||
        (w === 2208 && h === 1242) || (w === 1334 && h === 750) ||
        (w === 2034 && h === 1398) || (w === 2853 && h === 2007) ||
        (w === 1136 && h === 640) || (w === 1096 && h === 640) || (w === 960 && h === 640) || (w === 920 && h === 640)
      );
      // Standard Google landscape: phone aspect ratio within range (1.5:1 to 2.2:1)
      const isStandardGoogleLandscapeModal = isLandscape && _activeModalStore === 'google' &&
        !isSq && (w / h >= 1.5) && (w / h <= 2.2) && w >= 320 && h >= 320 && w <= 3840 && h <= 3840;
      // Any standard landscape for the current store
      const isStandardLandscape = isStandardAppleLandscapeModal || isStandardGoogleLandscapeModal;
      // Extreme non-phone ratio (e.g. banner 730×172 → 4.24:1) OR below phone AR range — always err
      const isExtremeRatio = isLandscape && ((w / h > 2.5) || (w / h < 1.5 && !isStandardAppleLandscapeModal));

      // Pixel audit (alpha channel & apex corners)
      let hasAlpha = false;
      let hasPreRoundedCorners = false;
      try {
        const isIcon = _activeModalType === 'icon';
        const maxCanvasDim = 64;
        let cW = maxCanvasDim, cH = maxCanvasDim;
        if (!isIcon) {
          if (w >= h) {
            cW = maxCanvasDim;
            cH = Math.max(1, Math.round(maxCanvasDim * (h / w)));
          } else {
            cW = Math.max(1, Math.round(maxCanvasDim * (w / h)));
            cH = maxCanvasDim;
          }
        }
        const c = document.createElement('canvas');
        c.width = cW; c.height = cH;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, cW, cH);
        const data = ctx.getImageData(0, 0, cW, cH).data;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) { hasAlpha = true; break; }
        }
        if (isIcon) {
          const cornerIdx = [
            (0 * 64 + 0) * 4 + 3,
            (0 * 64 + 63) * 4 + 3,
            (63 * 64 + 0) * 4 + 3,
            (63 * 64 + 63) * 4 + 3
          ];
          hasPreRoundedCorners = cornerIdx.some(idx => data[idx] < 200);
        }
      } catch (e) {}

      // Update 2x2 Metrics Grid
      if (dimEl) {
        dimEl.textContent = `${w} × ${h} px`;
        let dimOk = false;
        let dimErr = false;
        if (_activeModalType === 'icon') {
          dimOk = (_activeModalStore === 'apple' && w === 1024 && h === 1024) ||
                  (_activeModalStore === 'google' && w === 512 && h === 512);
          dimErr = !isSq;
        } else if (_activeModalType === 'feature') {
          dimOk = (w === 1024 && h === 500);
          dimErr = (w !== 1024 || h !== 500);
        } else if (_activeModalType === 'ipad') {
          dimOk = (w === 2048 && h === 2732) || (w === 2732 && h === 2048) || isIpadPortrait || isIpadLandscape;
          dimErr = isSq || (h > w * 1.5 || w > h * 1.5);
        } else if (_activeModalType === 'tablet') {
          dimOk = !isSq && (w >= 1080 && h >= 1080);
          dimErr = isSq;
        } else {
          // Phone Screenshot
          const isWrongRatio = isSq || isExtremeRatio || (!isLandscape && !isPhonePortrait);
          if (isWrongRatio) {
            dimErr = true;
            dimOk = false;
          } else if (isStandardLandscape) {
            // Official landscape dimensions → ok
            dimErr = false;
            dimOk = true;
          } else if (isLandscape) {
            // Non-standard landscape but valid ratio → warn
            dimErr = false;
            dimOk = false;
          } else {
            dimErr = false;
            const isStandardApple = _activeModalStore === 'apple' && (
              // Dynamic Island (large display)
              (w === 1320 && h === 2868) || // iPhone 6.9"
              (w === 1290 && h === 2796) || // iPhone 6.7"
              (w === 1260 && h === 2736) || // iPhone Air / 6.7"
              // Dynamic Island (medium display)
              (w === 1206 && h === 2622) || // iPhone 6.3"
              (w === 1179 && h === 2556) || // iPhone 6.1"
              // Face ID (large display)
              (w === 1284 && h === 2778) || // iPhone 6.5"
              (w === 1242 && h === 2688) || // iPhone 6.5"
              // Face ID (medium display)
              (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
              (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
              (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
              // Home Button (large display)
              (w === 1242 && h === 2208) || // iPhone 5.5"
              // Home Button (medium display)
              (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
              // iPhone Duo
              (w === 1398 && h === 2034) ||
              (w === 2007 && h === 2853) ||
              // Legacy 4" / 3.5"
              (w === 640 && h === 1136) ||
              (w === 640 && h === 1096) ||
              (w === 640 && h === 960) ||
              (w === 640 && h === 920)
            );
            const isStandardGoogle = _activeModalStore === 'google' && (
              (w === 1080 && h === 1920) ||
              (w === 1080 && h === 2340) ||
              (w === 1080 && h === 2400) ||
              (w === 1080 && h === 2160) ||
              (w === 1080 && h === 2280) ||
              (w === 1440 && h === 2560) ||
              (w === 1440 && h === 3120) ||
              (w === 1440 && h === 3200) ||
              (w === 1440 && h === 2880) ||
              (w === 1440 && h === 2960) ||
              (w === 1440 && h === 3088) ||
              (w === 720 && h === 1280) ||
              (w === 720 && h === 1560) ||
              (w === 720 && h === 1600) ||
              (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
            );
            dimOk = isStandardApple || isStandardGoogle;
          }
        }
        dimEl.className = 'icon-metric-val ' + (dimErr ? 'err' : (dimOk ? 'ok' : 'warn'));
      }

      if (ratioEl) {
        if (_activeModalType === 'icon') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-square`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else if (_activeModalType === 'feature') {
          const isFtrRatio = Math.abs(w / h - 1024 / 500) < 0.05;
          const r = (w / (h || 1)).toFixed(2);
          ratioEl.textContent = `${r}:1 Landscape`;
          ratioEl.className = 'icon-metric-val ' + (isFtrRatio ? 'ok' : 'err');
        } else if (_activeModalType === 'ipad') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isIpadPortrait) {
            ratioEl.textContent = '3:4 Portrait';
            ratioEl.className = 'icon-metric-val ok';
          } else if (isIpadLandscape) {
            ratioEl.textContent = '4:3 Landscape';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-standard`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else if (_activeModalType === 'tablet') {
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isTabletPortrait || isTabletLandscape) {
            ratioEl.textContent = isTabletPortrait ? '16:10 Portrait' : '16:10 Landscape';
            ratioEl.className = 'icon-metric-val ok';
          } else {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-standard`;
            ratioEl.className = 'icon-metric-val err';
          }
        } else {
          // Phone Screenshot - Invalid ratio is an ERROR (red)
          if (isSq) {
            ratioEl.textContent = '1:1 Square';
            ratioEl.className = 'icon-metric-val err';
          } else if (isExtremeRatio) {
            const r = (w / (h || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Invalid`;
            ratioEl.className = 'icon-metric-val err';
          } else if (isPhonePortrait) {
            let rLabel = 'Portrait';
            if (Math.abs(h / w - 19.5 / 9) < 0.15) rLabel = '9:19.5 Portrait';
            else if (Math.abs(h / w - 16 / 9) < 0.15) rLabel = '9:16 Portrait';
            else rLabel = `${(h / w).toFixed(2)}:1 Portrait`;
            ratioEl.textContent = rLabel;
            ratioEl.className = 'icon-metric-val ok';
          } else if (isLandscape) {
            let rLabel = 'Landscape';
            if (Math.abs(w / h - 16 / 9) < 0.15) rLabel = '16:9 Landscape';
            else rLabel = `${(w / h).toFixed(2)}:1 Landscape`;
            ratioEl.textContent = rLabel;
            // Standard landscape dims are accepted by App Store Connect → ok; non-standard → warn
            ratioEl.className = 'icon-metric-val ' + (isStandardLandscape ? 'ok' : 'warn');
          } else {
            const r = (h / (w || 1)).toFixed(2);
            ratioEl.textContent = `${r}:1 Non-portrait`;
            ratioEl.className = 'icon-metric-val err';
          }
        }
      }

      if (sizeEl) {
        if (sizeBytes > 0) {
          const kb = (sizeBytes / 1024).toFixed(0);
          sizeEl.textContent = `${kb} KB`;
          sizeEl.title = `${sizeBytes.toLocaleString('en-US')} bytes`;
          const isOverSize = sizeBytes > 8 * 1024 * 1024;
          // Over fileSize limit is a warning
          sizeEl.className = 'icon-metric-val ' + (isOverSize ? 'warn' : 'ok');
        } else {
          sizeEl.textContent = 'Optimized';
          sizeEl.className = 'icon-metric-val ok';
        }
      }

      if (formatEl) {
        const fmt = (mimeType || 'image/png').replace('image/', '').toUpperCase();
        if (hasAlpha) {
          const alphaErr = (_activeModalStore === 'apple') || (_activeModalType === 'feature');
          formatEl.textContent = `${fmt} · Alpha`;
          formatEl.className = 'icon-metric-val ' + (alphaErr ? 'err' : 'ok');
        } else if (isJpeg) {
          formatEl.textContent = 'JPEG';
          formatEl.className = 'icon-metric-val ' + (_activeModalType === 'icon' ? 'warn' : 'ok');
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
            badgeText = 'Alpha detected · Opaque icon required';
            detailsHtml = '<p>Xcode and App Store Connect reject icons with alpha channels. The icon must be opaque without transparency.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG without an alpha channel.</p>';
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
            badgeText = '1024×1024 px · App Store Standard';
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
            badgeText = `512×512 px · Google Play Standard${sizeNote}`;
            detailsHtml = '';
          }
        }
      } else if (_activeModalType === 'feature') {
        const MAX_FEATURE_BYTES = 15 * 1024 * 1024;
        if (w !== 1024 || h !== 500) {
          level = 'err';
          badgeText = `Invalid Dimensions (${w}×${h} px) · Google Play requires 1024×500 px`;
          detailsHtml = '<p>Google Play Console requires a landscape Feature Graphic of <strong>exactly 1024×500 px</strong> (2.05:1 ratio).</p><p class="icon-modal-warn-hint">Uploading non-standard dimensions will be rejected by Play Console.</p>';
        } else if (hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required (no alpha)';
          detailsHtml = '<p>Google Play Console strictly prohibits alpha transparency in Feature Graphics. The image must be 100% opaque without an alpha channel.</p><p class="icon-modal-warn-hint">Flatten background layers and export as 24-bit PNG or JPEG without transparency.</p>';
        } else if (sizeBytes > MAX_FEATURE_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 15 MB`;
          detailsHtml = `<p>Google Play Console strictly enforces a maximum file size of 15 MB. Your file is currently ${mb} MB and will be rejected upon upload.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else {
          const sizeNote = sizeBytes ? ` (${(sizeBytes / 1024).toFixed(0)} KB)` : '';
          level = 'ok';
          badgeText = `1024×500 px · Google Play Compliant${sizeNote}`;
          detailsHtml = '';
        }
      } else if (_activeModalType === 'ipad') {
        const MAX_IPAD_SHOT_BYTES = 8 * 1024 * 1024;
        if (sizeBytes > MAX_IPAD_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 8 MB`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB safety limit. Large files slow down IndexedDB and will increase rejection risks.</p><p class="icon-modal-warn-hint">Please optimize or compress the PNG/JPEG image.</p>`;
        } else if (hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required';
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store Connect rejects screenshots with transparent alpha channels. The image must be 100% opaque.</p><p class="icon-modal-warn-hint">Flatten layers and export without transparency.</p>';
        } else if (isSq) {
          level = 'err';
          badgeText = `App Store Rejection Risk: 1:1 Square (${w}×${h} px)`;
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store requires 3:4 portrait (2048×2732 px) or 4:3 landscape (2732×2048 px) for iPad screenshots. Square (1:1) screenshots will be rejected by App Store Connect.</p><p class="icon-modal-warn-hint">Export a standard iPad screenshot (2048×2732 px) from Figma or Sketch.</p>';
        } else if (w === 2048 && h === 2732) {
          level = 'ok';
          badgeText = '2048×2732 px · iPad Compliant';
        } else if (w === 2732 && h === 2048) {
          level = 'ok';
          badgeText = '2732×2048 px · iPad Landscape Compliant';
        } else if (isIpadPortrait || isIpadLandscape) {
          level = 'ok';
          badgeText = `${w}×${h} px · Standard iPad Compliant`;
        } else {
          level = 'warn';
          badgeText = `Dimension Notice (${w}×${h} px) · Target: 2048×2732 px`;
          detailsHtml = '<p>Apple recommends 2048×2732 px for iPad screenshots (Portrait) or 2732×2048 px (Landscape).</p><p class="icon-modal-warn-hint">Store Preview Studio automatically scales screenshots to standard canvas proportions.</p>';
        }
      } else if (_activeModalType === 'tablet') {
        const MAX_TAB_SHOT_BYTES = 8 * 1024 * 1024;
        if (sizeBytes > MAX_TAB_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'err';
          badgeText = `File size error: ${mb} MB · Exceeds maximum 8 MB`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB safety limit.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else if (isSq) {
          level = 'warn';
          badgeText = `Dimension Notice: 1:1 Square (${w}×${h} px)`;
          detailsHtml = '<p><strong>Dimension Notice:</strong> Google Play tablet screenshots should be 16:10 or 4:3 (portrait or landscape). Square screenshots will be letterboxed in tablet mockups.</p><p class="icon-modal-warn-hint">Upload a 16:10 tablet screenshot (e.g. 1600×2560 px or 2560×1600 px).</p>';
        } else {
          level = 'ok';
          badgeText = `${w}×${h} px · Active Screenshot`;
          detailsHtml = '';
        }
      } else {
        // Phone Screenshot (Apple iPhone or Google Play Phone)
        const MAX_PHONE_SHOT_BYTES = 8 * 1024 * 1024;
        const isGoogleSizeIssue = _activeModalStore === 'google' && (w < 320 || h < 320 || w > 3840 || h > 3840);

        // 1. Invalid ratio is an ERROR (red)
        if (_activeModalStore === 'apple' && hasAlpha) {
          level = 'err';
          badgeText = 'Alpha detected · 100% Opaque required';
          detailsHtml = '<p><strong>App Store Rejection Risk:</strong> Apple App Store Connect rejects screenshots with transparent alpha channels. The image must be 100% opaque.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG or JPEG without transparency.</p>';
        } else if (isSq) {
          level = 'err';
          badgeText = _activeModalStore === 'apple' ? `App Store Rejection Risk: 1:1 Square (${w}×${h} px)` : `Aspect Ratio Error: 1:1 Square (${w}×${h} px)`;
          detailsHtml = `<p><strong>${_activeModalStore === 'apple' ? 'App Store Rejection Risk' : 'Aspect Ratio Error'}:</strong> Screenshot is square (1:1). ${_activeModalStore === 'apple' ? 'Apple requires standard supported dimensions (such as 1179×2556 px or 1206×2622 px, portrait or landscape)' : 'Google Play requires standard phone dimensions (such as 1080×1920 px)'}. Square screenshots are not supported by the store.</p><p class="icon-modal-warn-hint">Please re-export standard supported dimensions from your design tool.</p>`;
        } else if (isExtremeRatio) {
          // e.g. 730×172 banner — aspect ratio is not a phone screen at all
          const ratio = (w / h).toFixed(2);
          level = 'err';
          badgeText = `Invalid Aspect Ratio: Banner ${w}×${h} px (${ratio}:1)`;
          detailsHtml = `<p><strong>Invalid Aspect Ratio:</strong> This image (${w}×${h} px, ${ratio}:1) has a banner-like ratio, not a phone screen aspect ratio. Phone screenshots must have a portrait or landscape phone ratio (e.g. 9:16 or 9:19.5).</p><p class="icon-modal-warn-hint">Re-export at a supported dimension such as ${_activeModalStore === 'apple' ? '1179×2556 px or 2556×1179 px' : '1080×1920 px or 1920×1080 px'}.</p>`;
        } else if (isLandscape && isStandardLandscape) {
          // Official landscape dimensions — accepted by App Store Connect
          level = 'ok';
          badgeText = `${w}×${h} px · Landscape · Store Compliant`;
          detailsHtml = '';
        } else if (isLandscape) {
          // Landscape but non-standard ratio — warn, not err
          level = 'warn';
          badgeText = `Non-standard Landscape (${w}×${h} px)`;
          detailsHtml = `<p><strong>Non-standard Landscape:</strong> This screenshot is landscape orientation but does not match a known ${_activeModalStore === 'apple' ? 'App Store Connect' : 'Google Play'} dimension. It may display letterboxed in the store.</p><p class="icon-modal-warn-hint">Verify this dimension is accepted before submission. Standard landscape: ${_activeModalStore === 'apple' ? '2556×1179 px or 2622×1206 px' : '1920×1080 px'}.</p>`;
        } else if (!isPhonePortrait) {
          level = 'err';
          badgeText = `Aspect Ratio Error: Non-portrait (${w}×${h} px)`;
          detailsHtml = '<p><strong>Aspect Ratio Error:</strong> This screenshot has a non-portrait aspect ratio. Phone screenshots must be portrait (9:16 or 9:19.5).</p><p class="icon-modal-warn-hint">Recommended resolution: ' + (_activeModalStore === 'apple' ? '1290×2796 px' : '1080×1920 px') + '.</p>';
        }
        // 2. Valid ratio with invalid filesize/dimensions is a WARNING (amber)
        else if (sizeBytes > MAX_PHONE_SHOT_BYTES) {
          const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
          level = 'warn';
          badgeText = `File Size Warning: ${mb} MB · Exceeds 8 MB limit`;
          detailsHtml = `<p>Screenshot file size (${mb} MB) exceeds the 8 MB recommended limit. While Preview Studio displays it, compressing is recommended before store submission.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>`;
        } else if (isGoogleSizeIssue) {
          level = 'warn';
          badgeText = `Dimension Warning: Out of range (${w}×${h} px)`;
          detailsHtml = '<p><strong>Google Play Dimension Notice:</strong> Recommended dimension range is 320–3,840 px. Please check Play Console requirements.</p><p class="icon-modal-warn-hint">Recommended standard: 1080×1920 px.</p>';
        } else {
          // Check standard dimensions
          const isStandardApple = _activeModalStore === 'apple' && (
            // Dynamic Island (large display)
            (w === 1320 && h === 2868) || // iPhone 6.9"
            (w === 1290 && h === 2796) || // iPhone 6.7"
            (w === 1260 && h === 2736) || // iPhone Air / 6.7"
            // Dynamic Island (medium display)
            (w === 1206 && h === 2622) || // iPhone 6.3"
            (w === 1179 && h === 2556) || // iPhone 6.1"
            // Face ID (large display)
            (w === 1284 && h === 2778) || // iPhone 6.5"
            (w === 1242 && h === 2688) || // iPhone 6.5"
            // Face ID (medium display)
            (w === 1170 && h === 2532) || // iPhone 6.1" (notch)
            (w === 1125 && h === 2436) || // iPhone 5.8" (notch)
            (w === 1080 && h === 2340) || // iPhone 5.4" (mini)
            // Home Button (large display)
            (w === 1242 && h === 2208) || // iPhone 5.5"
            // Home Button (medium display)
            (w === 750 && h === 1334) ||  // iPhone 4.7" (SE)
            // iPhone Duo
            (w === 1398 && h === 2034) ||
            (w === 2007 && h === 2853) ||
            // Legacy 4" / 3.5"
            (w === 640 && h === 1136) ||
            (w === 640 && h === 1096) ||
            (w === 640 && h === 960) ||
            (w === 640 && h === 920)
          );
          const isStandardGoogle = _activeModalStore === 'google' && (
            (w === 1080 && h === 1920) ||
            (w === 1080 && h === 2340) ||
            (w === 1080 && h === 2400) ||
            (w === 1080 && h === 2160) ||
            (w === 1080 && h === 2280) ||
            (w === 1440 && h === 2560) ||
            (w === 1440 && h === 3120) ||
            (w === 1440 && h === 3200) ||
            (w === 1440 && h === 2880) ||
            (w === 1440 && h === 2960) ||
            (w === 1440 && h === 3088) ||
            (w === 720 && h === 1280) ||
            (w === 720 && h === 1560) ||
            (w === 720 && h === 1600) ||
            (isPhonePortrait && w >= 320 && w <= 3840 && h >= 320 && h <= 3840)
          );
          if ((_activeModalStore === 'apple' && !isStandardApple) || (_activeModalStore === 'google' && !isStandardGoogle)) {
            level = 'warn';
            badgeText = `Dimension Notice: ${w}×${h} px · Scaled to Canvas`;
            const reqDesc = _activeModalStore === 'apple' ? 'App Store requires standard dimensions (such as 1290×2796, 1179×2556, 1206×2622, or 1320×2868 px)' : 'Recommended standard: 1080×1920 px';
            detailsHtml = `<p>Screenshot is portrait ratio but differs from target (${_activeModalStore === 'apple' ? '1290×2796 px' : '1080×1920 px'}). It will be scaled to fit device frames.</p><p class="icon-modal-warn-hint">${reqDesc}. Export at standard target resolution for optimal crispness.</p>`;
          } else {
            level = 'ok';
            badgeText = `${w}×${h} px · Active Screenshot`;
            detailsHtml = '';
          }
        }
      }

      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge ' + level;
        badgeEl.textContent = badgeText;
      }

      if (msgEl) {
        if (detailsHtml) {
          msgEl.className = 'icon-modal-warn-msg visible' + (level === 'warn' ? ' warn-mode' : (level === 'err' ? ' err-mode' : ''));
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
    if (typeof validateUploadFile === 'function' && !validateUploadFile(file, typeof MAX_UPLOAD_BYTES !== 'undefined' ? MAX_UPLOAD_BYTES : 8 * 1024 * 1024, 'Asset')) return;
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
          if (_activeModalStore === 'google') {
            if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = dataUrl;
          } else {
            if (typeof CUSTOM_ICON_1024 !== 'undefined') CUSTOM_ICON_1024 = dataUrl;
            if (typeof downscaleIconTo512 === 'function') {
              downscaleIconTo512(dataUrl, d512 => {
                if (typeof CUSTOM_ICON_512 !== 'undefined') CUSTOM_ICON_512 = d512;
              });
            }
          }
          if (typeof renderIcons === 'function') renderIcons();
          if (typeof saveState === 'function') saveState();
        }
      } else if (_activeModalType === 'feature') {
        if (typeof FEATURE_GRAPHIC !== 'undefined') {
          FEATURE_GRAPHIC = dataUrl;
          if (typeof IS_CUSTOM_FEATURE !== 'undefined') IS_CUSTOM_FEATURE = true;
          if (typeof userDraft !== 'undefined' && userDraft) {
            userDraft.featureGraphic = dataUrl;
            userDraft.isCustomFeature = true;
          }
          if (typeof renderFeature === 'function') renderFeature();
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
        if (typeof isDemoMode === 'function' && isDemoMode()) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof requireFullVersion === 'function') {
            requireFullVersion(_activeModalType === 'icon' ? 'upload-icon' : (_activeModalType === 'feature' ? 'feature-graphic' : 'upload-shots'));
          }
          return;
        }
        e.stopPropagation();
        fileInput.click();
      });
      fileInput.addEventListener('change', e => {
        if (typeof isDemoMode === 'function' && isDemoMode()) {
          e.preventDefault();
          e.stopPropagation();
          e.target.value = '';
          if (typeof requireFullVersion === 'function') {
            requireFullVersion(_activeModalType === 'icon' ? 'upload-icon' : (_activeModalType === 'feature' ? 'feature-graphic' : 'upload-shots'));
          }
          return;
        }
        if (e.target.files && e.target.files[0]) {
          handleFileReplacement(e.target.files[0]);
        }
        e.target.value = '';
      });
    }

    // Fix & Resize Icon button
    const resizeBtn = $('msIconModalResizeBtn');
    if (resizeBtn) {
      resizeBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (typeof openIconResizerModal === 'function') {
          openIconResizerModal({ src: _activeModalAsset, store: _activeModalStore });
        }
      });
    }

    // Drag and Drop on Modal and Art Container
    const artContainer = $('msIconModalArt') || $('imageDetailModalArt');
    const modalCanvas = $('msIconModalCanvas') || $('imageDetailModalCanvas');

    const handleModalDrop = e => {
      e.preventDefault();
      e.stopPropagation();
      if (artContainer) artContainer.classList.remove('drag-over');
      if (modalCanvas) modalCanvas.classList.remove('drag-over');
      if (typeof isDemoMode === 'function' && isDemoMode()) {
        if (typeof requireFullVersion === 'function') {
          requireFullVersion(_activeModalType === 'icon' ? 'upload-icon' : (_activeModalType === 'feature' ? 'feature-graphic' : 'upload-shots'));
        }
        return;
      }
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        handleFileReplacement(file);
      }
    };

    const handleModalDragOver = e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      if (artContainer) artContainer.classList.add('drag-over');
    };

    const handleModalDragLeave = e => {
      if (e.target === modal || !modal.contains(e.relatedTarget)) {
        if (artContainer) artContainer.classList.remove('drag-over');
        if (modalCanvas) modalCanvas.classList.remove('drag-over');
      }
    };

    modal.addEventListener('dragover', handleModalDragOver);
    modal.addEventListener('dragleave', handleModalDragLeave);
    modal.addEventListener('drop', handleModalDrop);

    if (artContainer) {
      artContainer.addEventListener('dragover', handleModalDragOver);
      artContainer.addEventListener('dragleave', () => {
        artContainer.classList.remove('drag-over');
      });
      artContainer.addEventListener('drop', handleModalDrop);
    }
  }

  // Export to global scope
  global.openIconModal = openIconModal;
  global.openImageDetailModal = openIconModal;
  global.closeIconModal = closeIconModal;
  global.closeImageDetailModal = closeIconModal;

})(typeof window !== 'undefined' ? window : this);
