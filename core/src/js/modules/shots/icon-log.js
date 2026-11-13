// Store Preview Studio · App Icon Diagnostic Log & Store Requirements Engine
// Manages store target specifications, source vs target comparison, and itemized diagnostic checklist
(function(global) {
  'use strict';

  let _logInitialized = false;
  let _targetStore = 'apple';
  let _lastAuditedSrc = '';
  let _lastAuditedMeta = null;

  function $(id) {
    return document.getElementById(id);
  }

  function initIconLog() {
    if (_logInitialized) return;
    _logInitialized = true;

    // Store review disclaimer tooltip trigger
    const disclaimer = $('iconModalDisclaimer');
    if (disclaimer && !disclaimer._disclaimerSetup) {
      disclaimer._disclaimerSetup = true;
      const tipBtn = disclaimer.querySelector('.info-tip-btn');
      if (tipBtn) {
        disclaimer.addEventListener('click', (e) => {
          if (!e.target.closest('.info-tip-btn')) {
            tipBtn.click();
          }
        });
        disclaimer.addEventListener('keydown', (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.info-tip-btn')) {
            e.preventDefault();
            tipBtn.click();
          }
        });
      }
    }
  }

  function getTargetStore() {
    return _targetStore;
  }

  function setTargetStore(newStore) {
    _targetStore = (newStore === 'google') ? 'google' : 'apple';

    // Update Store Tag Badge (Single badge reflecting the active store, no in-modal switcher)
    const storeBadge = $('msIconModalStoreBadge');
    if (storeBadge) {
      storeBadge.textContent = _targetStore === 'apple' ? 'Apple' : 'Google';
      storeBadge.className = 'icon-modal-store-tag ' + (_targetStore === 'apple' ? 'a' : 'g');
    }

    // Update Target Requirement Card
    const targetBadge = $('iconTargetSpecBadge') || $('iconTargetSpecVal');
    const targetDesc = $('iconTargetSpecDesc');
    const targetCompareVal = $('iconCompareTargetVal');

    const targetDimText = _targetStore === 'apple' ? '1024 × 1024 px' : '512 × 512 px';

    if (targetBadge) {
      targetBadge.textContent = `${targetDimText} · 100% Opaque Solid`;
    }
    if (targetCompareVal) {
      targetCompareVal.textContent = targetDimText;
    }
    if (targetDesc) {
      targetDesc.textContent = _targetStore === 'apple'
        ? 'Apple App Store requires a 100% opaque 1:1 square without an alpha transparency channel (rejection error ITMS-90717).'
        : 'Google Play requires a full-bleed 512×512 px square (max 1024 KB); store system automatically applies squircle mask and drop shadow.';
    }

    // Inform resizer if loaded
    if (typeof global.onResizerTargetStoreChanged === 'function') {
      global.onResizerTargetStoreChanged(_targetStore);
    }

    // Re-audit currently loaded asset against newly selected store
    if (_lastAuditedSrc) {
      inspectIcon(_lastAuditedSrc, _lastAuditedMeta, _targetStore);
    }
  }

  function detectImageAlpha(img) {
    try {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function detectPreRoundedCorners(img) {
    try {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;
      const cornerIdx = [
        (0 * 64 + 0) * 4 + 3,       // Top-left
        (0 * 64 + 63) * 4 + 3,      // Top-right
        (63 * 64 + 0) * 4 + 3,      // Bottom-left
        (63 * 64 + 63) * 4 + 3      // Bottom-right
      ];
      return cornerIdx.some(idx => data[idx] < 200);
    } catch (_) {}
    return false;
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

  /**
   * Main audit entrypoint: Audits an icon against Apple App Store or Google Play requirements
   * Updates:
   *   1. Source vs Target Comparison Capsule (SOURCE ... px -> TARGET ... px)
   *   2. 2x2 Metrics Grid
   *   3. Itemized Diagnostic Checklist (clearly explaining all detected issues)
   *   4. Primary Action Button state & label
   */
  function inspectIcon(src, file, storeOverride) {
    initIconLog();

    if (storeOverride) {
      _targetStore = (storeOverride === 'google') ? 'google' : 'apple';
    }

    _lastAuditedSrc = src || '';
    _lastAuditedMeta = file || null;

    const dimEl = $('msIconModalDim');
    const ratioEl = $('msIconModalRatio');
    const sizeEl = $('msIconModalSize');
    const formatEl = $('msIconModalFormat');
    const badgeEl = $('msIconModalBadge');
    const msgEl = $('msIconModalMsg');
    const compareSourceVal = $('iconCompareSourceVal');
    const compareTargetVal = $('iconCompareTargetVal');
    const primaryBtnText = $('iconActionPrimaryText');

    const targetDim = (_targetStore === 'google') ? 512 : 1024;
    const targetDimText = `${targetDim} × ${targetDim} px`;

    if (compareTargetVal) {
      compareTargetVal.textContent = targetDimText;
    }

    const isPlaceholder = !src ||
      src === (typeof PH !== 'undefined' ? PH : '') ||
      src === (typeof BLANK_ICON !== 'undefined' ? BLANK_ICON : '');

    if (isPlaceholder) {
      if (dimEl) { dimEl.textContent = `Empty (${targetDimText} target)`; dimEl.className = 'icon-metric-val'; }
      if (ratioEl) { ratioEl.textContent = '1:1 Square'; ratioEl.className = 'icon-metric-val'; }
      if (sizeEl) { sizeEl.textContent = 'None'; sizeEl.className = 'icon-metric-val'; }
      if (formatEl) { formatEl.textContent = 'PNG'; formatEl.className = 'icon-metric-val'; }
      if (compareSourceVal) compareSourceVal.textContent = '-- × -- px';
      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge';
        badgeEl.textContent = 'Empty Slot · Ready to Upload';
      }
      if (msgEl) {
        msgEl.innerHTML = '<div class="icon-issue-list"><div class="icon-issue-item ok has-desc"><span class="icon-issue-icon">ℹ</span><div class="icon-issue-body"><div class="icon-issue-title">No Icon Uploaded</div><div class="icon-issue-desc">Drag and drop or upload an image to inspect.</div></div></div></div>';
      }
      return;
    }

    const meta = getAssetMeta(src, file);
    const mimeType = (meta.type || '').toLowerCase();
    const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';
    const isPng = mimeType === 'image/png';
    const sizeBytes = meta.size || 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || img.width || 1024;
      const h = img.naturalHeight || img.height || 1024;
      const isSq = (w === h) || ((Math.abs(w - h) / Math.max(w, h)) < 0.05);
      const hasAlpha = detectImageAlpha(img);
      const hasPreRoundedCorners = detectPreRoundedCorners(img);

      // 1. Update Comparison Capsule
      if (compareSourceVal) {
        compareSourceVal.textContent = `${w} × ${h} px`;
      }

      // 2. Update 2x2 Metrics Grid
      if (dimEl) {
        dimEl.textContent = `${w} × ${h} px`;
        const dimOk = (w === targetDim && h === targetDim);
        dimEl.className = 'icon-metric-val ' + (dimOk ? 'ok' : (isSq ? 'warn' : 'err'));
      }

      if (ratioEl) {
        if (isSq) {
          ratioEl.textContent = '1:1 Square';
          ratioEl.className = 'icon-metric-val ok';
        } else {
          const r = (w / (h || 1)).toFixed(2);
          ratioEl.textContent = `${r}:1 Non-square`;
          ratioEl.className = 'icon-metric-val err';
        }
      }

      if (sizeEl) {
        if (sizeBytes > 0) {
          const kb = (sizeBytes / 1024).toFixed(0);
          sizeEl.textContent = `${kb} KB`;
          const isOverSize = (_targetStore === 'google' && sizeBytes > 1024 * 1024);
          sizeEl.className = 'icon-metric-val ' + (isOverSize ? 'err' : 'ok');
        } else {
          sizeEl.textContent = 'Optimized';
          sizeEl.className = 'icon-metric-val ok';
        }
      }

      if (formatEl) {
        const fmt = (mimeType || 'image/png').replace('image/', '').toUpperCase();
        if (hasAlpha) {
          formatEl.textContent = `${fmt} · Alpha`;
          formatEl.className = 'icon-metric-val err';
        } else if (isJpeg) {
          formatEl.textContent = 'JPEG';
          formatEl.className = 'icon-metric-val warn';
        } else if (mimeType && !isPng) {
          formatEl.textContent = `${fmt} · Not PNG`;
          formatEl.className = 'icon-metric-val warn';
        } else {
          formatEl.textContent = `${fmt} · Opaque`;
          formatEl.className = 'icon-metric-val ok';
        }
      }

      // 3. Itemized Diagnostic Audit (Detailing all issues)
      const issues = [];

      // Check 1: 1:1 Square Aspect Ratio
      if (!isSq) {
        const r = (w / (h || 1)).toFixed(2);
        issues.push({
          severity: 'err',
          title: `Non-Square Aspect Ratio: ${w} × ${h} px (${r}:1)`,
          desc: `${_targetStore === 'apple' ? 'Apple App Store' : 'Google Play'} requires an exact 1:1 square icon.`
        });
      } else {
        issues.push({
          severity: 'ok',
          title: 'Standard 1:1 Square Ratio',
          desc: ''
        });
      }

      // Check 2: Exact Dimensions
      if (w !== targetDim || h !== targetDim) {
        const level = isSq ? 'warn' : 'err';
        issues.push({
          severity: level,
          title: `Non-Target Dimensions: ${w} × ${h} px`,
          desc: `Target specification is ${targetDimText}.`
        });
      } else {
        issues.push({
          severity: 'ok',
          title: `Standard Resolution: ${targetDimText}`,
          desc: ''
        });
      }

      // Check 3: Alpha Transparency
      if (hasAlpha) {
        issues.push({
          severity: 'err',
          title: 'Alpha Channel Detected (Transparency)',
          desc: 'Artwork must be 100% opaque solid without transparency (ITMS-90717).'
        });
      } else {
        issues.push({
          severity: 'ok',
          title: '100% Opaque Solid (No Alpha Channel)',
          desc: ''
        });
      }

      // Check 4: File Format
      if (isJpeg) {
        issues.push({
          severity: 'warn',
          title: 'File Format: JPEG',
          desc: 'PNG format is recommended to prevent compression artifacts.'
        });
      } else if (isPng) {
        issues.push({
          severity: 'ok',
          title: 'Standard PNG Format',
          desc: ''
        });
      }
      else if (mimeType) {
        const fmtName = mimeType.replace('image/', '').toUpperCase();
        issues.push({
          severity: 'warn',
          title: 'File Format: ' + fmtName,
          desc: 'Store icons must be PNG. Use Fix & Resize to convert automatically.'
        });
      }

      // Check 5: Google-specific checks
      if (_targetStore === 'google') {
        const MAX_GOOGLE_ICON_BYTES = 1024 * 1024;
        if (sizeBytes > MAX_GOOGLE_ICON_BYTES) {
          const kb = (sizeBytes / 1024).toFixed(0);
          issues.push({
            severity: 'err',
            title: `File Size Exceeds Limit: ${kb} KB / 1024 KB`,
            desc: 'Google Play requires icon file size under 1024 KB.'
          });
        }
        if (hasPreRoundedCorners) {
          issues.push({
            severity: 'warn',
            title: 'Pre-Rounded Corners or Shadows Detected',
            desc: 'Google Play dynamically applies squircle masks; submit full-bleed artwork.'
          });
        }
      }

      // Calculate overall compliance level
      const errCount = issues.filter(i => i.severity === 'err').length;
      const warnCount = issues.filter(i => i.severity === 'warn').length;

      let overallLevel = 'ok';
      if (errCount > 0) overallLevel = 'err';
      else if (warnCount > 0) overallLevel = 'warn';

      if (badgeEl) {
        badgeEl.className = 'icon-modal-badge ' + overallLevel;
        if (overallLevel === 'err') {
          badgeEl.textContent = `${errCount} issue${errCount > 1 ? 's' : ''} detected · Action needed`;
        } else if (overallLevel === 'warn') {
          badgeEl.textContent = `${warnCount} notice${warnCount > 1 ? 's' : ''} · Store guidelines`;
        } else {
          badgeEl.textContent = `${targetDimText} · Store Compliant`;
        }
      }

      // Render Itemized Diagnostic Checklist
      if (msgEl) {
        const listHtml = issues.map(item => {
          const iconSymbol = item.severity === 'ok' ? '✓' : (item.severity === 'warn' ? '!' : '✕');
          const hasDescClass = item.desc ? ' has-desc' : '';
          const descHtml = item.desc ? `<div class="icon-issue-desc">${item.desc}</div>` : '';
          return `
            <div class="icon-issue-item ${item.severity}${hasDescClass}">
              <span class="icon-issue-icon">${iconSymbol}</span>
              <div class="icon-issue-body">
                <div class="icon-issue-title">${item.title}</div>
                ${descHtml}
              </div>
            </div>
          `;
        }).join('');

        msgEl.innerHTML = `<div class="icon-issue-list">${listHtml}</div>`;
      }

      // Synchronize Primary Action Button Text
      if (primaryBtnText) {
        const activeTab = (typeof global.getCurrentIconModalTab === 'function')
          ? global.getCurrentIconModalTab()
          : 'inspect';

        if (activeTab === 'inspect') {
          primaryBtnText.textContent = (overallLevel === 'ok')
            ? 'Re-fit / Resize Icon'
            : 'Fix & Resize to Store Spec';
        }
      }
    };

    img.src = src;
  }

  // Export to global scope
  global.IconLog = {
    init: initIconLog,
    getTargetStore,
    setTargetStore,
    inspectIcon
  };

  // Global helper aliases
  global.setTargetStore = setTargetStore;
  global.inspectIconAsset = inspectIcon;

  // Auto-init on load or DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIconLog);
    } else {
      initIconLog();
    }
  }

})(typeof window !== 'undefined' ? window : this);
