    // ═══════════ Interactive Mini-Studio (data: showcase-data.js from presets) ═══════════
    (function () {
      var PRESETS = window.SPS_SHOWCASE_PRESETS || [];
      var $ = function (id) { return document.getElementById(id); };
      var root = $('showcase');
      if (!root) return;

      var CUSTOM_ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">' +
        '<defs>' +
        '<linearGradient id="sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#1F211F"/>' +
        '<stop offset="100%" stop-color="#121312"/>' +
        '</linearGradient>' +
        '<filter id="icon-shadow" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.8"/>' +
        '</filter>' +
        '</defs>' +
        '<rect width="100" height="100" fill="url(#sq-bg)"/>' +
        '<g transform="scale(0.72) translate(19, 19)">' +
        '<path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z" fill="#006636"/>' +
        '<g filter="url(#icon-shadow)">' +
        '<path d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z" fill="#00D085"/>' +
        '</g>' +
        '</g>' +
        '</svg>'
      );

      function isPlaceholderIcon(iconStr) {
        if (!iconStr) return true;
        if (iconStr === CUSTOM_ICON) return true;
        if (typeof iconStr === 'string' && (iconStr.indexOf('c6-bg') !== -1 || iconStr.indexOf('c6-front') !== -1)) return true;
        return false;
      }

      var BLANK_FEATURE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">' +
        '<rect width="1024" height="500" fill="#0f172a"/>' +
        '<rect x="16" y="16" width="992" height="468" rx="14" fill="none" stroke="#253556" stroke-width="2" stroke-dasharray="10 10"/>' +
        '<text x="512" y="275" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#94a3b8">Google Play Feature Graphic (1,024 × 500 px)</text>' +
        '<text x="512" y="315" font-family="-apple-system,system-ui,sans-serif" font-size="16" text-anchor="middle" fill="#64748b">PNG or JPEG · Up to 15 MB · Click or drag image to upload</text>' +
        '</svg>'
      );

      var SPS_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      function getMsCurrentDate(dayOffset, withYear) {
        var d = new Date();
        var y = d.getFullYear();
        var m = SPS_MONTHS[d.getMonth()];
        var day = Math.max(1, d.getDate() - (dayOffset || 0));
        return withYear ? m + ' ' + day + ', ' + y : m + ' ' + day;
      }

      function getMsSyncedTime() {
        var now = new Date();
        var h24 = now.getHours();
        var m = String(now.getMinutes()).padStart(2, '0');
        var is24h = false;
        try {
          var testFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(2026, 0, 1, 23, 0));
          is24h = testFmt.indexOf('23') !== -1;
        } catch(e) {
          is24h = false;
        }
        if (is24h) {
          return String(h24).padStart(2, '0') + ':' + m;
        }
        var h12 = h24 % 12 || 12;
        return h12 + ':' + m;
      }

      function updateMsClocksAndReviews() {
        var syncedTime = getMsSyncedTime();
        // Synchronize both Apple and Google status bar clocks identically
        root.querySelectorAll('.ms-clock-apple, .ms-clock-google, .ms-sb span').forEach(function (el) {
          el.textContent = syncedTime;
        });
        root.querySelectorAll('.ms-g-rev-date').forEach(function (el, i) {
          el.textContent = getMsCurrentDate(i === 0 ? 4 : 11, true);
        });
        root.querySelectorAll('.ms-a-rev-date').forEach(function (el, i) {
          el.textContent = getMsCurrentDate(i === 0 ? 4 : 11, false);
        });
      }

      var CUSTOM = {
        key: 'custom', label: 'Your App', name: '', sub: '', short: '', promo: '',
        dev: 'Developer Name', email: 'support@domain.com', phone: '+1 800-555-0199', catApple: 'Category', catGoogle: 'Category', desc: 'App description goes here...',
        whatsNew: 'Release notes...', ver: '1.0.0', rdate: getMsCurrentDate(2, true),
        rating: '4.9', count: '1.8K', rank: '1', dl: '50K+', age: '4+', iap: true, icon: '', feature: '', shots: [],
        reviews: [
          {
            author: 'Alex Morgan',
            avatarBg: '#0284c7',
            stars: 5,
            title: 'Intuitive & beautifully designed',
            text: 'Super smooth user experience and clean interface. Does exactly what it promises without any unnecessary friction.',
            helpful: 84
          },
          {
            author: 'Jordan Lee',
            avatarBg: '#8b5cf6',
            stars: 5,
            title: 'Reliable and well built',
            text: 'Fast performance, thoughtful details, and easy to navigate. Quickly became an essential tool in my workflow.',
            helpful: 52
          }
        ]
      };

      var userDraft = null;
      var DRAFT_STORAGE_KEY = 'sps_mini_user_draft';
      var MINI_IDB_NAME = 'sps_marketing_db';
      var MINI_IDB_STORE = 'marketing_drafts';
      var _miniDbPromise = null;

      var urlParams = (typeof window !== 'undefined' && window.location && window.location.search) ? new URLSearchParams(window.location.search) : null;
      var isAppIdMode = !!(urlParams && (
        urlParams.get('url') || urlParams.get('itunes') || urlParams.get('link') || urlParams.get('store_url') ||
        urlParams.get('appid') || urlParams.get('app_id') || urlParams.get('id') || urlParams.get('app') ||
        urlParams.get('bundle') || urlParams.get('bundleid')
      ));

      function getMiniIdb() {
        if (typeof indexedDB === 'undefined') return Promise.resolve(null);
        if (_miniDbPromise) return _miniDbPromise;
        _miniDbPromise = new Promise(function (resolve) {
          try {
            var req = indexedDB.open(MINI_IDB_NAME, 1);
            req.onupgradeneeded = function (e) {
              var db = e.target.result;
              if (!db.objectStoreNames.contains(MINI_IDB_STORE)) {
                db.createObjectStore(MINI_IDB_STORE);
              }
            };
            req.onsuccess = function (e) {
              var db = e.target.result;
              db.onversionchange = function () { db.close(); _miniDbPromise = null; };
              db.onclose = function () { _miniDbPromise = null; };
              resolve(db);
            };
            req.onerror = function () { _miniDbPromise = null; resolve(null); };
            req.onblocked = function () { _miniDbPromise = null; resolve(null); };
          } catch (err) {
            _miniDbPromise = null;
            resolve(null);
          }
        });
        return _miniDbPromise;
      }

      function idbSaveMini(key, val) {
        return getMiniIdb().then(function (db) {
          if (!db) return false;
          return new Promise(function (resolve) {
            try {
              var tx = db.transaction(MINI_IDB_STORE, 'readwrite');
              var store = tx.objectStore(MINI_IDB_STORE);
              var req = store.put(val, key);
              req.onsuccess = function () { resolve(true); };
              req.onerror = function () { resolve(false); };
              tx.onabort = function () { resolve(false); };
            } catch (e) { resolve(false); }
          });
        }).catch(function () { return false; });
      }

      function idbGetMini(key) {
        return getMiniIdb().then(function (db) {
          if (!db) return null;
          return new Promise(function (resolve) {
            try {
              var tx = db.transaction(MINI_IDB_STORE, 'readonly');
              var store = tx.objectStore(MINI_IDB_STORE);
              var req = store.get(key);
              req.onsuccess = function () { resolve(req.result || null); };
              req.onerror = function () { resolve(null); };
            } catch (e) { resolve(null); }
          });
        }).catch(function () { return null; });
      }

      function idbDeleteMini(key) {
        return getMiniIdb().then(function (db) {
          if (!db) return false;
          return new Promise(function (resolve) {
            try {
              var tx = db.transaction(MINI_IDB_STORE, 'readwrite');
              var store = tx.objectStore(MINI_IDB_STORE);
              var req = store.delete(key);
              req.onsuccess = function () { resolve(true); };
              req.onerror = function () { resolve(false); };
              tx.onabort = function () { resolve(false); };
            } catch (e) { resolve(false); }
          });
        }).catch(function () { return false; });
      }

      function ensureDraft() {
        if (!userDraft) {
          userDraft = JSON.parse(JSON.stringify(CUSTOM));
          userDraft.customUploadedIcons = { apple: false, google: false };
        }
        return userDraft;
      }

      function hasUserDraft() {
        if (!userDraft) return false;
        return !!(
          userDraft.isLiveApp ||
          userDraft.isCustomized ||
          (userDraft.name && userDraft.name.trim()) ||
          (userDraft.sub && userDraft.sub.trim()) ||
          (userDraft.short && userDraft.short.trim()) ||
          (userDraft.iconApple && !isPlaceholderIcon(userDraft.iconApple)) ||
          (userDraft.iconGoogle && !isPlaceholderIcon(userDraft.iconGoogle)) ||
          (userDraft.icon && !isPlaceholderIcon(userDraft.icon))
        );
      }

      function saveDraftToStorage() {
        if (!userDraft) return;
        // 1. Asynchronously persist full draft to IndexedDB (virtually unlimited quota for high-res icons)
        idbSaveMini(DRAFT_STORAGE_KEY, userDraft);

        // 2. Persist to localStorage for instantaneous synchronous startup
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(userDraft));
        } catch (e) {
          try {
            var safeCopy = Object.assign({}, userDraft);
            delete safeCopy.iconApple;
            delete safeCopy.iconGoogle;
            delete safeCopy.icon;
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(safeCopy));
          } catch (e2) {}
        }
      }

      function loadDraftFromStorage() {
        // Fast sync read from localStorage
        try {
          var raw = localStorage.getItem(DRAFT_STORAGE_KEY);
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              userDraft = parsed;
              if (userDraft.name) userDraft.name = clampGraphemes(userDraft.name, 30);
              if (userDraft.sub) userDraft.sub = clampGraphemes(userDraft.sub, 30);
              if (userDraft.short) userDraft.short = clampGraphemes(userDraft.short, 80);
              if (userDraft) {
                if (isPlaceholderIcon(userDraft.iconApple)) userDraft.iconApple = CUSTOM_ICON;
                if (isPlaceholderIcon(userDraft.iconGoogle)) userDraft.iconGoogle = CUSTOM_ICON;
                if (isPlaceholderIcon(userDraft.icon)) userDraft.icon = CUSTOM_ICON;
              }
              if (!hasUserDraft()) {
                userDraft = null;
              }
            }
          }
        } catch (e) {}

        // Async read from IndexedDB to restore high-resolution icons if localStorage was stripped
        idbGetMini(DRAFT_STORAGE_KEY).then(function (idbDraft) {
          if (idbDraft && typeof idbDraft === 'object') {
            if (idbDraft.name) idbDraft.name = clampGraphemes(idbDraft.name, 30);
            if (idbDraft.sub) idbDraft.sub = clampGraphemes(idbDraft.sub, 30);
            if (idbDraft.short) idbDraft.short = clampGraphemes(idbDraft.short, 80);
            var hadMissingIcon = false;
            if (!userDraft) {
              userDraft = idbDraft;
              if (userDraft) {
                if (isPlaceholderIcon(userDraft.iconApple)) userDraft.iconApple = CUSTOM_ICON;
                if (isPlaceholderIcon(userDraft.iconGoogle)) userDraft.iconGoogle = CUSTOM_ICON;
                if (isPlaceholderIcon(userDraft.icon)) userDraft.icon = CUSTOM_ICON;
              }
              if (!hasUserDraft()) {
                userDraft = null;
              } else {
                hadMissingIcon = true;
                var explicitPreset = urlParams ? urlParams.get('preset') : null;
                if (activeKey !== 'custom' && !isPresetModified && !explicitPreset) {
                  loadPreset('custom', true);
                }
              }
            } else {
              if (idbDraft.iconApple && !userDraft.iconApple) {
                userDraft.iconApple = idbDraft.iconApple;
                hadMissingIcon = true;
              }
              if (idbDraft.iconGoogle && !userDraft.iconGoogle) {
                userDraft.iconGoogle = idbDraft.iconGoogle;
                hadMissingIcon = true;
              }
              if (idbDraft.icon && !userDraft.icon) {
                userDraft.icon = idbDraft.icon;
                hadMissingIcon = true;
              }
              if (idbDraft.customUploadedIcons) {
                userDraft.customUploadedIcons = Object.assign({}, userDraft.customUploadedIcons, idbDraft.customUploadedIcons);
              }
            }
            if (hadMissingIcon) {
              updateCustomPill();
              updatePresetBanner();
              if (activeKey === 'custom') {
                S.iconApple = userDraft.iconApple;
                S.iconGoogle = userDraft.iconGoogle;
                S.icon = userDraft.icon;
                if (userDraft.customUploadedIcons) {
                  customUploadedIcons.apple = !!userDraft.customUploadedIcons.apple;
                  customUploadedIcons.google = !!userDraft.customUploadedIcons.google;
                }
                renderIcon();
              }
            }
          }
        });
      }

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      var S = {};          // current listing state
      var activeKey = '';
      var userTouched = false;
      var isUserUploadedIcon = false;

      // ── Grapheme-accurate counting (same rule as the studio) ──
      var seg = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;
      function graphemes(t) { return seg ? Array.from(seg.segment(t)).length : Array.from(t).length; }
      function clampGraphemes(t, max) {
        if (!t) return '';
        if (seg) {
          var segs = Array.from(seg.segment(t));
          if (segs.length <= max) return t;
          return segs.slice(0, max).map(function (s) { return s.segment; }).join('');
        }
        var chars = Array.from(t);
        if (chars.length <= max) return t;
        return chars.slice(0, max).join('');
      }

      var LIMITS = { name: 30, sub: 30, short: 80 };
      var ICO_OK = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      var ICO_ERR = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

      function esrb(age) {
        var n = parseInt(age, 10) || 4;
        if (n >= 17) return ['M', 'Mature 17+'];
        if (n >= 12) return ['T', 'Teen'];
        if (n >= 9) return ['E10+', 'Everyone 10+'];
        return ['E', 'Everyone'];
      }

      // ── Rendering ──
      function bindText(key, val, fallback) {
        var limit = LIMITS[key];
        var text = val || fallback || '';
        // The store form accepts user input, but device app mockups only display up to valid limits
        var displayVal = (limit && val) ? clampGraphemes(val, limit) : text;
        root.querySelectorAll('[data-bind="' + key + '"]').forEach(function (el) {
          el.textContent = displayVal || fallback || '';
        });
      }

      function renderIconSlot(dropId, imgId, badgeId, iconSrc, targetStore) {
        var ed = $(imgId), drop = $(dropId);
        if (!drop || !ed) return;
        var hasReal = !!(iconSrc && !isPlaceholderIcon(iconSrc));
        var inspectBtn = $(targetStore === 'google' ? 'msIconInspectBtnGoogle' : 'msIconInspectBtnApple');
        if (inspectBtn) {
          inspectBtn.disabled = !hasReal;
        }
        ed.onerror = function () {
          if (iconSrc && !isPlaceholderIcon(iconSrc)) {
            ed.src = CUSTOM_ICON;
          }
        };
        if (hasReal) {
          ed.src = iconSrc;
          ed.hidden = false;
          ed.style.display = 'block';
          drop.classList.add('has');
          drop.classList.remove('is-placeholder');
          checkMiniStudioIcon(iconSrc, badgeId, targetStore);
        } else {
          ed.src = CUSTOM_ICON;
          ed.hidden = false;
          ed.style.display = 'block';
          drop.classList.remove('has');
          drop.classList.add('is-placeholder');
          var b = $(badgeId);
          if (b) {
            b.style.display = 'none';
            b.innerHTML = '';
          }
        }
      }

      function syncIconBadgesVisibility() {
        var badgeApple = $('msIconBadgeApple');
        var badgeGoogle = $('msIconBadgeGoogle');
        if (currentMode === 'apple') {
          if (badgeGoogle) badgeGoogle.style.display = 'none';
        } else if (currentMode === 'google') {
          if (badgeApple) badgeApple.style.display = 'none';
        }
      }

      function renderIcon() {
        var appleSrc = S.iconApple || S.icon || CUSTOM_ICON;
        var googleSrc = S.iconGoogle || S.icon || CUSTOM_ICON;

        // Render slots
        renderIconSlot('msIconDropApple', 'msIconImgApple', 'msIconBadgeApple', S.iconApple || S.icon, 'apple');
        renderIconSlot('msIconDropGoogle', 'msIconImgGoogle', 'msIconBadgeGoogle', S.iconGoogle || S.icon, 'google');

        syncIconBadgesVisibility();

        // Mockups: Apple mockups take Apple icon, Google mockups take Google icon
        root.querySelectorAll('[data-img="icon"]').forEach(function (img) {
          img.onerror = function () { this.src = CUSTOM_ICON; };
          img.src = appleSrc;
        });
        root.querySelectorAll('[data-img="iconGoogle"]').forEach(function (img) {
          img.onerror = function () { this.src = CUSTOM_ICON; };
          img.src = googleSrc;
        });
      }

      var customUploadedIcons = { apple: false, google: false };
      var customUploadedMeta = { apple: null, google: null };

      function getUploadedIconMeta(storeType) {
        if (customUploadedMeta[storeType]) return customUploadedMeta[storeType];
        var src = (storeType === 'google' ? S.iconGoogle : (S.iconApple || S.icon)) || '';
        var meta = { size: 0, type: '' };
        if (typeof src === 'string' && src.indexOf('data:') === 0) {
          var comma = src.indexOf(',');
          if (comma !== -1) {
            var semi = src.indexOf(';');
            if (semi !== -1) meta.type = src.substring(5, semi);
            var b64 = src.slice(comma + 1);
            var pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
            meta.size = Math.round((b64.length * 3) / 4 - pad);
          }
        }
        return meta;
      }

      var iconValidationState = {
        apple: null,
        google: null
      };

      function applyIconCardBadge(badgeId, state) {
        var badge = $(badgeId);
        if (!badge) return;
        if (!state || state.level === 'ok' || !state.badgeText) {
          badge.style.display = 'none';
          badge.innerHTML = '';
        } else {
          badge.className = 'ms-icon-status ' + state.level;
          badge.innerHTML = '<span class="ms-status-dot"></span><span>' + escapeHtml(state.badgeText) + '</span>';
          badge.style.display = 'inline-flex';
        }
        syncIconBadgesVisibility();
      }

      function applyIconModalState(state, storeType) {
        var modal = $('msIconModal');
        if (!modal) return;
        var modalDim = $('msIconModalDim');
        var modalBadge = $('msIconModalBadge');
        var modalMsg = $('msIconModalMsg');
        var modalRatio = $('msIconModalRatio');
        var modalSize = $('msIconModalSize');
        var modalFormat = $('msIconModalFormat');
        var modalFloatingDim = $('msIconModalFloatingDim');
        var modalTarget = $('msIconModalTarget');
        var canvas = $('msIconModalCanvas');

        if (!state) return;

        if (canvas) canvas.dataset.storeType = storeType;

        if (modalTarget) {
          modalTarget.textContent = storeType === 'apple' ? 'Standard: 1024×1024 px (1:1)' : 'Standard: 512×512 px (≤1024 KB)';
        }

        var dimText = state.width + ' × ' + state.height + ' px';
        if (modalDim) {
          modalDim.textContent = dimText;
          var targetDim = (storeType === 'apple' ? 1024 : 512);
          modalDim.className = 'icon-metric-val ' + (state.width === targetDim && state.height === targetDim ? 'ok' : 'warn');
        }

        if (modalFloatingDim) {
          modalFloatingDim.textContent = dimText + (state.isSquare ? ' · 1:1 Square' : ' · ' + (state.width / (state.height || 1)).toFixed(2) + ':1');
        }

        if (modalRatio) {
          modalRatio.textContent = state.isSquare ? '1:1 Square' : (state.width / (state.height || 1)).toFixed(2) + ':1';
          modalRatio.className = 'icon-metric-val ' + (state.isSquare ? 'ok' : 'err');
        }

        if (modalSize) {
          if (state.sizeBytes) {
            var kb = (state.sizeBytes / 1024).toFixed(0);
            modalSize.textContent = kb + ' KB';
            modalSize.title = state.sizeBytes.toLocaleString('en-US') + ' bytes';
            modalSize.className = 'icon-metric-val ' + (storeType === 'google' && state.sizeBytes > 1024 * 1024 ? 'err' : 'ok');
          } else {
            modalSize.textContent = state.isCustom ? '--' : 'Optimized';
            modalSize.className = 'icon-metric-val ok';
          }
        }

        if (modalFormat) {
          var fmt = (state.mimeType || 'png').replace('image/', '').toUpperCase();
          if (state.hasAlpha) {
            modalFormat.textContent = fmt + ' · Alpha';
            modalFormat.className = 'icon-metric-val err';
          } else if (state.isJpeg) {
            modalFormat.textContent = 'JPEG';
            modalFormat.className = 'icon-metric-val warn';
          } else {
            modalFormat.textContent = fmt + ' · Opaque';
            modalFormat.className = 'icon-metric-val ok';
          }
        }

        if (modalBadge) {
          modalBadge.className = 'icon-modal-badge ' + state.level;
          modalBadge.textContent = state.modalBadgeText || state.badgeText;
        }

        if (modalMsg) {
          if (state.detailsHtml) {
            modalMsg.className = 'icon-modal-warn-msg visible' + (state.level === 'warn' ? ' warn-mode' : '');
            modalMsg.innerHTML = state.detailsHtml;
          } else {
            modalMsg.className = 'icon-modal-warn-msg';
            modalMsg.textContent = '';
          }
        }
      }

      var _iconValidationRunIds = {};
      function updateIconValidation(src, targetStore, onDone) {
        var badgeId = targetStore === 'apple' ? 'msIconBadgeApple' : 'msIconBadgeGoogle';
        if (!src || src === CUSTOM_ICON) {
          iconValidationState[targetStore] = null;
          applyIconCardBadge(badgeId, null);
          if (onDone) onDone(null);
          return;
        }

        // Built-in presets are valid showcase templates
        if (!customUploadedIcons[targetStore]) {
          var defaultDim = (targetStore === 'google' ? 512 : 1024);
          var compliantText = (targetStore === 'google' ? '512×512 px · Google Play Compliant' : '1024×1024 px · App Store Compliant');
          var presetState = {
            src: src,
            width: defaultDim,
            height: defaultDim,
            isSquare: true,
            sizeBytes: 0,
            mimeType: 'image/png',
            isJpeg: false,
            hasAlpha: false,
            hasPreRoundedCorners: false,
            level: 'ok',
            badgeText: '',
            modalBadgeText: compliantText,
            detailsHtml: '',
            isCustom: false
          };
          iconValidationState[targetStore] = presetState;
          applyIconCardBadge(badgeId, presetState);
          var modal = $('msIconModal');
          if (modal && modal.classList.contains('open') && modal.dataset.storeType === targetStore) {
            applyIconModalState(presetState, targetStore);
          }
          if (onDone) onDone(presetState);
          return;
        }

        var runId = (_iconValidationRunIds[targetStore] || 0) + 1;
        _iconValidationRunIds[targetStore] = runId;

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          if (_iconValidationRunIds[targetStore] !== runId) return;

          var w = img.naturalWidth || (targetStore === 'google' ? 512 : 1024);
          var h = img.naturalHeight || (targetStore === 'google' ? 512 : 1024);
          var isSquare = (w === h);

          var meta = getUploadedIconMeta(targetStore);
          var mimeType = (meta.type || '').toLowerCase();
          var isJpeg = (mimeType === 'image/jpeg' || mimeType === 'image/jpg');
          var sizeBytes = meta.size || 0;

          var hasAlpha = false;
          var hasPreRoundedCorners = false;
          try {
            var c = document.createElement('canvas');
            c.width = 64; c.height = 64;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, 64, 64);
            var data = ctx.getImageData(0, 0, 64, 64).data;
            for (var i = 3; i < data.length; i += 4) {
              if (data[i] < 250) { hasAlpha = true; break; }
            }
            var cornerIdx = [
              (0 * 64 + 0) * 4 + 3,
              (0 * 64 + 63) * 4 + 3,
              (63 * 64 + 0) * 4 + 3,
              (63 * 64 + 63) * 4 + 3
            ];
            hasPreRoundedCorners = cornerIdx.some(function (idx) { return data[idx] < 200; });
          } catch (e) {}

          var computed = {
            src: src,
            width: w,
            height: h,
            isSquare: isSquare,
            sizeBytes: sizeBytes,
            mimeType: mimeType,
            isJpeg: isJpeg,
            hasAlpha: hasAlpha,
            hasPreRoundedCorners: hasPreRoundedCorners,
            level: 'ok',
            badgeText: '',
            modalBadgeText: '',
            detailsHtml: '',
            isCustom: true
          };

          if (targetStore === 'apple') {
            if (!isSquare) {
              computed.level = 'err';
              computed.badgeText = 'Non-square (' + w + '×' + h + ' px) · 1:1 square required';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Apple App Store requires a 1:1 square icon (1024×1024 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from Figma, Sketch, or Photoshop.</p>';
            } else if (hasAlpha) {
              // ITMS-90717: Official App Store rejection
              computed.level = 'err';
              computed.badgeText = 'ITMS-90717: Alpha detected · 100% Opaque required';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>ITMS-90717 Error: Xcode and App Store Connect reject icons with alpha channels. The icon must be 100% opaque without transparency.</p><p class="icon-modal-warn-hint">Flatten background layers and export as PNG without an alpha channel.</p>';
            } else if (isJpeg) {
              // Warning: JPEG format not part of official specifications
              computed.level = 'warn';
              computed.badgeText = 'Not recommended: PNG preferred per store guidelines';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>JPEG format is not part of official store specifications. Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Apple documentation specifies standard PNG format with sRGB or Display P3.</p>';
            } else if (w !== 1024) {
              computed.level = 'warn';
              computed.badgeText = w + '×' + h + ' px · Apple recommends 1024×1024 px';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Apple App Store recommends standard 1024×1024 px resolution to ensure clarity across all Retina displays.</p><p class="icon-modal-warn-hint">Re-export at 1024×1024 px from your design tool.</p>';
            } else {
              computed.level = 'ok';
              computed.badgeText = '';
              computed.modalBadgeText = '1024×1024 px · App Store Compliant';
              computed.detailsHtml = '';
            }
          } else {
            // Google Store
            var MAX_GOOGLE_ICON_BYTES = 1024 * 1024; // 1024 KB
            if (!isSquare) {
              computed.level = 'err';
              computed.badgeText = 'Non-square (' + w + '×' + h + ' px) · 1:1 square required';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Google Play requires a 1:1 square icon (512×512 px).</p><p class="icon-modal-warn-hint">Please re-export a 1:1 square image from your design tool.</p>';
            } else if (sizeBytes > MAX_GOOGLE_ICON_BYTES) {
              var kb = (sizeBytes / 1024).toFixed(0);
              var bytesFormatted = sizeBytes.toLocaleString('en-US');
              computed.level = 'err';
              computed.badgeText = 'File size error: ' + kb + ' KB · Exceeds maximum 1024 KB';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Google Play Console strictly enforces a maximum file size of 1024 KB (1,048,576 bytes). Your file is currently ' + kb + ' KB (' + bytesFormatted + ' bytes) and will be rejected upon upload.</p><p class="icon-modal-warn-hint">Please compress or optimize the image before submitting.</p>';
            } else if (isJpeg) {
              computed.level = 'warn';
              computed.badgeText = 'Not recommended: PNG preferred per store guidelines';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>JPEG format is not part of official Google Play specifications (requires 32-bit PNG). Export as PNG to avoid submission risk.</p><p class="icon-modal-warn-hint">Export standard 32-bit PNG (sRGB).</p>';
            } else if (hasPreRoundedCorners) {
              computed.level = 'warn';
              computed.badgeText = 'Not recommended: Pre-rounded corners or shadow';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Pre-rounded corners or drop shadows are not recommended: Google Play dynamically applies a 20% corner radius mask and drop shadow on store listings.</p><p class="icon-modal-warn-hint">Export a full-bleed square image without rounded corners.</p>';
            } else if (w !== 512) {
              computed.level = 'warn';
              computed.badgeText = w + '×' + h + ' px · Google Play recommends 512×512 px';
              computed.modalBadgeText = computed.badgeText;
              computed.detailsHtml = '<p>Google Play Console requires standard 512×512 px dimensions.</p><p class="icon-modal-warn-hint">Export standard 512×512 px from Figma or Photoshop.</p>';
            } else {
              var sizeNote = sizeBytes ? ' (' + (sizeBytes / 1024).toFixed(0) + ' KB)' : '';
              computed.level = 'ok';
              computed.badgeText = '';
              computed.modalBadgeText = '512×512 px · Google Play Compliant' + sizeNote;
              computed.detailsHtml = '';
            }
          }

          iconValidationState[targetStore] = computed;
          applyIconCardBadge(badgeId, computed);

          var modal = $('msIconModal');
          if (modal && modal.classList.contains('open') && modal.dataset.storeType === targetStore) {
            applyIconModalState(computed, targetStore);
          }

          if (onDone) onDone(computed);
        };
        img.src = src;
      }

      function checkMiniStudioIcon(src, badgeId, targetStore) {
        updateIconValidation(src, targetStore);
      }

      function renderShots() {
        // Device galleries — only render real screenshots; if empty, display nothing below "Preview"
        var realShots = (S.shots || []).filter(function (s) { return typeof s === 'string' && s.trim(); });
        root.querySelectorAll('[data-gal]').forEach(function (gal) {
          gal.innerHTML = '';
          realShots.forEach(function (shotUrl, i) {
            var img = document.createElement('img');
            img.src = shotUrl; img.alt = 'Screenshot ' + (i + 1); img.loading = 'lazy';
            img.style.animationDelay = (i * 35) + 'ms';
            gal.appendChild(img);
          });
          gal.scrollLeft = 0;
          var sec = gal.closest('.ms-sec');
          if (sec) {
            sec.style.display = realShots.length ? '' : 'none';
          }
        });

        // Apple Search View — First 3 screenshots
        root.querySelectorAll('[data-shots="apple-search"]').forEach(function (c) {
          c.innerHTML = '';
          if (realShots.length === 0) {
            for (var i = 0; i < 3; i++) {
              var sk = document.createElement('div');
              sk.className = 'sr-skel-shot';
              c.appendChild(sk);
            }
          } else {
            realShots.slice(0, 3).forEach(function (s, i) {
              var img = document.createElement('img');
              img.src = s;
              img.alt = 'Search Preview ' + (i + 1);
              c.appendChild(img);
            });
            for (var j = realShots.length; j < 3; j++) {
              var sk2 = document.createElement('div');
              sk2.className = 'sr-skel-shot';
              c.appendChild(sk2);
            }
          }
        });

        // Google Play Search View — First 3 screenshots
        root.querySelectorAll('[data-shots="gp-search"]').forEach(function (c) {
          c.innerHTML = '';
          if (realShots.length === 0) {
            for (var i = 0; i < 3; i++) {
              var sk = document.createElement('div');
              sk.className = 'gp-skel-shot';
              c.appendChild(sk);
            }
          } else {
            realShots.slice(0, 3).forEach(function (s, i) {
              var img = document.createElement('img');
              img.src = s;
              img.alt = 'Search Preview ' + (i + 1);
              c.appendChild(img);
            });
            for (var j = realShots.length; j < 3; j++) {
              var sk2 = document.createElement('div');
              sk2.className = 'gp-skel-shot';
              c.appendChild(sk2);
            }
          }
        });

        // Form Screenshots Grid (Read-only, preview generated from preset, locked for custom editing)
        var formGrid = $('msShotsGrid');
        if (formGrid) {
          formGrid.innerHTML = '';
          for (var idx = 0; idx < 4; idx++) {
            var slot = document.createElement('div');
            slot.style.animationDelay = (idx * 30) + 'ms';
            var url = realShots[idx];
            if (url) {
              slot.className = 'ms-shot has';
              slot.innerHTML = '<img src="' + url + '" alt="Preset Screenshot ' + (idx + 1) + '" draggable="false" oncontextmenu="return false;">';
            } else {
              slot.className = 'ms-shot empty';
              slot.innerHTML = '<div class="ms-shot-empty"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V6zm3 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg><span>Locked</span></div>';
            }
            formGrid.appendChild(slot);
          }
        }
      }

      function renderFeature() {
        var f = $('msFeat');
        if (!f) return;
        f.hidden = false;
        var img = f.querySelector('img');
        if (img) img.src = S.feature || BLANK_FEATURE;
      }

      function renderField(id, key) {
        var el = $(id), max = +el.dataset.max, val = S[key] || '';
        var n = graphemes(val), over = n > max;
        var countEl = $(id + 'Count');
        if (countEl) {
          countEl.textContent = n + ' / ' + max;
          if (over) {
            countEl.className = 'ms-count over';
          } else if (n >= max - 4 && n > 0) {
            countEl.className = 'ms-count near';
          } else if (n > 0) {
            countEl.className = 'ms-count has';
          } else {
            countEl.className = 'ms-count empty';
          }
        }
        el.classList.toggle('over', over);
        var bar = $(id + 'Bar');
        if (bar) {
          bar.style.width = Math.min(100, n / max * 100) + '%';
          bar.classList.toggle('over', over);
          bar.classList.toggle('near', !over && n >= max - 4 && n > 0);
        }
        return over;
      }

      var currentMode = 'apple';
      var isDualPhone = true;

      function renderValidation() {
        var nameOver = renderField('msName', 'name');
        var subOver = renderField('msSub', 'sub');
        var shortOver = renderField('msShort', 'short');

        root.querySelectorAll('[data-bind="name"]').forEach(function (el) {
          el.classList.toggle('ms-trunc', nameOver);
          if (nameOver) el.setAttribute('title', 'Clamped to 30 characters');
          else el.removeAttribute('title');
        });
        root.querySelectorAll('[data-bind="sub"]').forEach(function (el) {
          el.classList.toggle('ms-trunc', subOver);
          if (subOver) el.setAttribute('title', 'Clamped to 30 characters');
          else el.removeAttribute('title');
        });
        root.querySelectorAll('[data-bind="short"]').forEach(function (el) {
          el.classList.toggle('ms-trunc', shortOver);
          if (shortOver) el.setAttribute('title', 'Clamped to 80 characters');
          else el.removeAttribute('title');
        });
      }

      function renderMsReviews() {
        var list = (S && Array.isArray(S.reviews) && S.reviews.length) ? S.reviews : (CUSTOM.reviews || []);
        if (!list || !list.length) return;

        // Render Apple App Store Reviews
        var aContainer = root.querySelector('.ms-a-reviews-list');
        if (aContainer) {
          aContainer.innerHTML = list.slice(0, 2).map(function (rev, idx) {
            var starsCount = Math.max(1, Math.min(5, rev.stars || 5));
            var starsStr = '★★★★★'.slice(0, starsCount) + '☆☆☆☆☆'.slice(0, 5 - starsCount);
            var author = rev.author || 'Anonymous';
            var title = rev.title || (rev.text ? (rev.text.length > 34 ? rev.text.slice(0, 32) + '...' : rev.text) : 'Great app!');
            var date = getMsCurrentDate(idx === 0 ? 4 : 11, false);
            return '<div class="ms-a-rev-card">' +
              '<div class="ms-a-rev-top">' +
                '<span class="ms-a-rev-title">' + escapeHtml(title) + '</span>' +
                '<span class="ms-a-rev-date">' + escapeHtml(date) + '</span>' +
              '</div>' +
              '<div class="ms-a-rev-meta">' +
                '<span class="ms-a-rev-stars">' + starsStr + '</span>' +
                '<span class="ms-a-rev-author">' + escapeHtml(author) + '</span>' +
              '</div>' +
              '<div class="ms-a-rev-body">' + escapeHtml(rev.text || '') + '</div>' +
            '</div>';
          }).join('');
        }

        // Render Google Play Reviews
        var gContainer = root.querySelector('.ms-g-reviews-list');
        if (gContainer) {
          gContainer.innerHTML = list.slice(0, 2).map(function (rev, idx) {
            var starsCount = Math.max(1, Math.min(5, rev.stars || 5));
            var starsStr = '★★★★★'.slice(0, starsCount) + '☆☆☆☆☆'.slice(0, 5 - starsCount);
            var author = rev.author || 'Anonymous';
            var initial = (author.trim().charAt(0) || 'U').toUpperCase();
            var bg = rev.avatarBg || '#0b57d0';
            var date = getMsCurrentDate(idx === 0 ? 4 : 11, true);
            var helpful = rev.helpful || (idx === 0 ? 108 : 64);
            return '<div class="ms-g-rev-card">' +
              '<div class="ms-g-rev-head">' +
                '<span class="ms-g-rev-avatar" style="background:' + escapeHtml(bg) + '">' + escapeHtml(initial) + '</span>' +
                '<span class="ms-g-rev-author">' + escapeHtml(author) + '</span>' +
                '<span class="ms-g-rev-more"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">' +
                  '<circle cx="12" cy="5" r="2"></circle>' +
                  '<circle cx="12" cy="12" r="2"></circle>' +
                  '<circle cx="12" cy="19" r="2"></circle>' +
                '</svg></span>' +
              '</div>' +
              '<div class="ms-g-rev-stars">' + starsStr + ' <span class="ms-g-rev-date">' + escapeHtml(date) + '</span></div>' +
              '<div class="ms-g-rev-body">' + escapeHtml(rev.text || '') + '</div>' +
              '<div class="ms-g-rev-helpful">' + helpful + ' people found this review helpful</div>' +
              '<div class="ms-g-rev-actions">Did you find this helpful? <button type="button" class="ms-g-chip-btn">Yes</button> <button type="button" class="ms-g-chip-btn">No</button></div>' +
            '</div>';
          }).join('');
        }
      }

      function renderPlatformsBadge() {
        var isUniversal = (typeof S.isUniversal === 'boolean') ? S.isUniversal : (typeof S.supportsIpad === 'boolean' ? S.supportsIpad : true);
        root.querySelectorAll('.ms-a-platforms').forEach(function (el) {
          var ipadIco = el.querySelector('.ms-a-plat-icon-ipad');
          var textEl = el.querySelector('.ms-a-plat-text');
          if (ipadIco) ipadIco.style.display = isUniversal ? '' : 'none';
          if (textEl) textEl.textContent = isUniversal ? 'iPhone, iPad' : 'iPhone';
        });
      }

      function renderAll() {
        bindText('name', S.name, 'App Name');
        bindText('sub', S.sub, 'App Subtitle');
        bindText('short', S.short, 'Short description...');
        bindText('desc', S.desc, 'App description goes here...');
        bindText('whatsNew', S.whatsNew, 'Release notes...');
        bindText('ver', S.ver, '1.0.0');
        bindText('rdate', S.rdate, getMsCurrentDate(2, true));
        bindText('email', S.email || 'support@domain.com', 'support@domain.com');
        bindText('phone', S.phone || '+1 800-555-0199', '+1 800-555-0199');
        root.querySelectorAll('[data-bind="promo"]').forEach(function (el) {
          el.textContent = S.promo || '';
          el.style.display = S.promo ? '' : 'none';
        });
        ['dev', 'catApple', 'catGoogle', 'rating', 'count', 'rank', 'dl', 'age'].forEach(function (k) { bindText(k, S[k]); });
        var e = esrb(S.age);
        bindText('esrb', e[0] || 'E'); bindText('esrbLabel', e[1] || 'Everyone');
        root.querySelectorAll('[data-iap]').forEach(function (el) { el.style.visibility = S.iap ? '' : 'hidden'; });
        renderIcon(); renderShots(); renderFeature(); renderValidation(); renderMsReviews();
        renderPlatformsBadge();
        updateMsClocksAndReviews();
      }

      function flash(field) {
        root.querySelectorAll('.ms-stage [data-f="' + field + '"]').forEach(function (el) {
          el.classList.remove('ms-hl');
          void el.offsetWidth;
          el.classList.add('ms-hl');
          clearTimeout(el._hlTimer);
          el._hlTimer = setTimeout(function () {
            el.classList.remove('ms-hl');
          }, 1150);
        });
      }

      // ── Presets & Draft Management ──
      function showResetConfirmModal() {
        var modal = $('msConfirmModal');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'msConfirmModal';
          modal.className = 'ms-confirm-backdrop';
          modal.innerHTML = '<div class="ms-confirm-card" role="dialog" aria-modal="true" aria-labelledby="msConfirmTitle">' +
            '<div class="ms-confirm-header">' +
              '<div class="ms-confirm-icon-wrap">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>' +
                  '<path d="M3 3v5h5"/>' +
                '</svg>' +
              '</div>' +
              '<div class="ms-confirm-meta">' +
                '<h4 class="ms-confirm-title" id="msConfirmTitle">Reset App Draft?</h4>' +
                '<p class="ms-confirm-desc">This will clear your customized app icon, name, and descriptions. Your current draft cannot be recovered.</p>' +
              '</div>' +
            '</div>' +
            '<div class="ms-confirm-actions">' +
              '<button type="button" class="ms-confirm-btn-cancel" id="msConfirmCancel">Cancel</button>' +
              '<button type="button" class="ms-confirm-btn-reset" id="msConfirmOk">Reset Draft</button>' +
            '</div>' +
          '</div>';
          document.body.appendChild(modal);

          function closeModal() {
            modal.classList.remove('open');
          }

          modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
          });

          var cancelBtn = modal.querySelector('#msConfirmCancel');
          if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
          }

          var okBtn = modal.querySelector('#msConfirmOk');
          if (okBtn) {
            okBtn.addEventListener('click', function () {
              closeModal();
              resetUserDraft();
            });
          }

          window.addEventListener('keydown', function (e) {
            if (!modal.classList.contains('open')) return;
            if (e.key === 'Escape') closeModal();
          });
        }

        modal.classList.add('open');
        var cancelBtnFocus = modal.querySelector('#msConfirmCancel');
        if (cancelBtnFocus) cancelBtnFocus.focus();
      }

      function updateCustomPill() {
        var pill = $('msPill-custom');
        if (!pill) return;
        var hasDraft = hasUserDraft();

        if (hasDraft && userDraft) {
          pill.classList.add('has-draft');
          pill.classList.toggle('live-app-pill', !!userDraft.isLiveApp);
          var iconSrc = CUSTOM_ICON;
          if (currentMode === 'google') {
            // Google Store: prioritize Google, then Apple, fallback to CUSTOM_ICON placeholder
            iconSrc = userDraft.iconGoogle || userDraft.iconApple || userDraft.icon || CUSTOM_ICON;
          } else {
            // Dual View & Apple Store: prioritize Apple, then Google, fallback to CUSTOM_ICON placeholder
            iconSrc = userDraft.iconApple || userDraft.iconGoogle || userDraft.icon || CUSTOM_ICON;
          }
          if (isPlaceholderIcon(iconSrc)) iconSrc = CUSTOM_ICON;
          var appTitle = (userDraft.name && userDraft.name.trim()) ? clampGraphemes(userDraft.name.trim(), 30) : 'Your App';
          var tagLabel = userDraft.isLiveApp ? 'Live App' : 'Draft';
          
          pill.setAttribute('title', appTitle);
          pill.innerHTML = '<img alt="" src="' + iconSrc + '">' +
            '<span>' + escapeHtml(appTitle) + '</span>' +
            '<small>' + tagLabel + '</small>' +
            '<button type="button" class="ms-pill-reset-btn" id="msPillResetBtn" title="Reset draft and clear fields" aria-label="Reset draft">✕</button>';

          var resetBtn = pill.querySelector('#msPillResetBtn');
          if (resetBtn) {
            resetBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              showResetConfirmModal();
            });
          }
        } else {
          pill.classList.remove('has-draft');
          pill.textContent = '+ Your App';
        }
        if (activeKey === 'custom') {
          updatePresetIndicator('custom');
        }
      }

      function resetUserDraft() {
        userDraft = null;
        isPresetModified = false;
        try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch (e) {}
        idbDeleteMini(DRAFT_STORAGE_KEY);
        customUploadedIcons.apple = false;
        customUploadedIcons.google = false;
        customUploadedMeta.apple = null;
        customUploadedMeta.google = null;
        if (activeKey === 'custom') {
          S = JSON.parse(JSON.stringify(CUSTOM));
          S.icon = '';
          S.iconApple = '';
          S.iconGoogle = '';
          S.shots = [];
          S.feature = '';
          S.promo = '';
          $('msName').value = '';
          $('msSub').value = '';
          $('msShort').value = '';
          renderAll();
        }
        updateCustomPill();
        updatePresetBanner();
        updateExportMockupState();
      }

      var isPresetModified = false;

      function updateExportMockupState() {
        var btn = $('btnExportMockup4K');
        var badgeGroup = $('msMockupBadgeGroup');
        if (!btn || !badgeGroup) return;

        var isDraft = (activeKey === 'custom');
        var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;
        btn.classList.remove('is-locked');
        btn.classList.add('active-export');

        var nameEl = btn.querySelector('.mi-name');
        var subEl = btn.querySelector('.mi-t small');

        btn.setAttribute('title', isVi ? 'Xuất ảnh Mockup thiết bị sắc nét 2x Retina' : 'Export current live device stage in 2x Retina HD');
        if (nameEl) nameEl.textContent = isVi ? 'Tải ảnh Mockup (2x)' : 'Download Mockup';
        if (subEl) subEl.textContent = isVi ? 'Có watermark' : 'With watermark';
        if (badgeGroup) badgeGroup.textContent = 'Retina';
      }

      function updatePresetBanner() {
        var banner = $('msPresetBanner');
        if (!banner) return;
        var hasDraft = hasUserDraft();
        if (activeKey !== 'custom' && hasDraft && userDraft) {
          banner.style.display = 'inline-flex';
          banner.classList.toggle('is-modified', !!isPresetModified);
          var textSpan = $('msPresetBannerText') || banner.querySelector('.ms-preset-banner-text');
          var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;
          var currentPreset = PRESETS.filter(function (x) { return x.key === activeKey; })[0];
          var presetName = currentPreset ? (currentPreset.label || activeKey) : activeKey;

          if (textSpan) {
            if (isPresetModified) {
              if (isVi) {
                textSpan.innerHTML = '<strong>Đang xem thử: thay đổi sẽ không được lưu</strong> · Bản nháp của bạn đã được lưu an toàn.';
              } else {
                textSpan.innerHTML = '<strong>Preview only: edits won\'t be saved</strong> · Your draft is saved safely.';
              }
            } else {
              if (isVi) {
                textSpan.innerHTML = 'Đang xem template: <strong id="msPresetBannerName">' + escapeHtml(presetName) + '</strong> · Bản nháp của bạn đã được lưu an toàn.';
              } else {
                textSpan.innerHTML = 'Viewing preset: <strong id="msPresetBannerName">' + escapeHtml(presetName) + '</strong> · Your draft is saved safely.';
              }
            }
          }
        } else {
          banner.style.display = 'none';
          banner.classList.remove('is-modified');
        }
      }

      var presetExitTimer = null;
      var presetEnterTimer = null;
      var currentPresetKey = null;

      function updatePresetIndicator(key) {
        var bar = $('msPresets');
        if (!bar) return;
        var indicator = $('msPresetsIndicator');
        if (!indicator) {
          indicator = document.createElement('span');
          indicator.className = 'ms-seg-indicator ms-presets-indicator';
          indicator.id = 'msPresetsIndicator';
          bar.insertBefore(indicator, bar.firstChild);
        }
        var targetKey = key || activeKey;
        var btn = (targetKey === 'custom') ? $('msPill-custom') : $('msPresetDropdownBtn');
        if (!btn) btn = bar.querySelector('.ms-pill[data-key="' + targetKey + '"]');
        if (!btn) return;
        if (btn.offsetWidth === 0) {
          requestAnimationFrame(function () {
            updatePresetIndicator(targetKey);
          });
          return;
        }
        var left = btn.offsetLeft;
        var p = btn.offsetParent;
        while (p && p !== bar) {
          left += p.offsetLeft;
          p = p.offsetParent;
        }
        indicator.style.transform = 'translateX(' + left + 'px)';
        indicator.style.width = btn.offsetWidth + 'px';
        indicator.className = 'ms-seg-indicator ms-presets-indicator ready';
      }

      function getPresetOrderIndex(k) {
        if (!k) return -1;
        if (k === 'custom') return 0;
        for (var i = 0; i < PRESETS.length; i++) {
          if (PRESETS[i].key === k) return i + 1;
        }
        return -1;
      }

      function loadPreset(key, skipAnimation) {
        var isCustom = (key === 'custom');
        var prevKey = currentPresetKey;
        activeKey = key;
        isPresetModified = false;

        // Immediately update tabview pills and smoothly position active pill
        var bar = $('msPresets');
        root.querySelectorAll('.ms-pill').forEach(function (b) {
          var isOn = (b.dataset.key === key) || (key !== 'custom' && b.id === 'msPresetDropdownBtn');
          b.classList.toggle('on', isOn);
          if (isOn && !skipAnimation && bar) {
            try {
              var targetScroll = b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2;
              bar.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
            } catch (e) {}
          }
        });

        var dropLabel = $('msPresetDropdownLabel');
        var dropIcon = $('msDropIconWrap');
        var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;
        if (key === 'custom') {
          if (dropLabel) dropLabel.textContent = isVi ? 'Mẫu tham khảo' : 'Presets';
          if (dropIcon) {
            dropIcon.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
          }
        } else {
          var currP = PRESETS.filter(function (x) { return x.key === key; })[0];
          if (dropLabel) dropLabel.textContent = currP ? currP.label : (isVi ? 'Mẫu tham khảo' : 'Presets');
          if (dropIcon && currP && currP.icon) {
            dropIcon.innerHTML = '<img src="' + currP.icon + '" alt="" style="width:18px;height:18px;border-radius:5px;display:block;object-fit:cover;flex-shrink:0" onerror="this.src=\'' + CUSTOM_ICON + '\'">';
          }
        }
        var dropMenu = $('msPresetDropdownMenu');
        if (dropMenu) {
          dropMenu.querySelectorAll('.ms-preset-menu-item').forEach(function (item) {
            item.classList.toggle('active', item.dataset.key === key);
          });
        }
        if (bar && (skipAnimation || !prevKey)) {
          bar.scrollLeft = 0;
        }
        updatePresetIndicator(key);
        requestAnimationFrame(function () {
          updatePresetIndicator(key);
        });
        if (typeof updatePresetsArrows === 'function') updatePresetsArrows();

        function applyPresetData() {
          var bA = $('msIconBadgeApple'); if (bA) { bA.style.display = 'none'; bA.innerHTML = ''; }
          var bG = $('msIconBadgeGoogle'); if (bG) { bG.style.display = 'none'; bG.innerHTML = ''; }

          if (isCustom) {
            var d = userDraft || JSON.parse(JSON.stringify(CUSTOM));
            S = JSON.parse(JSON.stringify(d));
            if (isPlaceholderIcon(S.icon)) S.icon = CUSTOM_ICON;
            if (isPlaceholderIcon(S.iconApple)) S.iconApple = CUSTOM_ICON;
            if (isPlaceholderIcon(S.iconGoogle)) S.iconGoogle = CUSTOM_ICON;
            customUploadedIcons.apple = !!(d.customUploadedIcons && d.customUploadedIcons.apple);
            customUploadedIcons.google = !!(d.customUploadedIcons && d.customUploadedIcons.google);
            if (d.customUploadedMeta) {
              customUploadedMeta.apple = d.customUploadedMeta.apple || null;
              customUploadedMeta.google = d.customUploadedMeta.google || null;
            }
          } else {
            var p = PRESETS.filter(function (x) { return x.key === key; })[0];
            if (!p) return;
            S = JSON.parse(JSON.stringify(p));
            customUploadedIcons.apple = false;
            customUploadedIcons.google = false;
            customUploadedMeta.apple = null;
            customUploadedMeta.google = null;
          }

          S.shots = (S.shots || []).slice(0, 4);
          $('msName').value = S.name || '';
          $('msSub').value = S.sub || '';
          $('msShort').value = S.short || '';

          renderAll();
          updateCustomPill();
          updatePresetBanner();
          updateExportMockupState();
          if (isCustom) setTimeout(function () { $('msName').focus({ preventScroll: true }); }, 50);
        }

        if (presetExitTimer) { clearTimeout(presetExitTimer); presetExitTimer = null; }
        if (presetEnterTimer) { clearTimeout(presetEnterTimer); presetEnterTimer = null; }

        var bodies = root.querySelectorAll('.ms-body');
        var formGrid = $('msShotsGrid');

        // Immediate apply if initial load or same preset
        if (skipAnimation || !prevKey || prevKey === key) {
          currentPresetKey = key;
          applyPresetData();
          bodies.forEach(function (b) {
            b.scrollTop = 0;
            b.classList.remove('ms-preset-exit-next', 'ms-preset-exit-prev', 'ms-preset-enter-next', 'ms-preset-enter-prev', 'ms-view-enter');
            void b.offsetWidth;
            b.classList.add('ms-view-enter');
          });
          return;
        }

        var oldIdx = getPresetOrderIndex(prevKey);
        var newIdx = getPresetOrderIndex(key);
        var dir = (oldIdx !== -1 && newIdx !== -1 && newIdx < oldIdx) ? 'prev' : 'next';

        // Phase 1: Smooth Glide & Fade Exit
        bodies.forEach(function (b) {
          b.classList.remove('ms-preset-enter-next', 'ms-preset-enter-prev', 'ms-view-enter');
          b.classList.remove('ms-preset-exit-next', 'ms-preset-exit-prev');
          void b.offsetWidth;
          b.classList.add('ms-preset-exit-' + dir);
        });

        if (formGrid) {
          formGrid.classList.remove('ms-grid-enter');
          formGrid.classList.add('ms-grid-exit');
        }

        // Phase 2: Apply Content & Enter with Staggered Cascading Items
        presetExitTimer = setTimeout(function () {
          currentPresetKey = key;
          applyPresetData();

          bodies.forEach(function (b) {
            b.scrollTop = 0;
            b.classList.remove('ms-preset-exit-next', 'ms-preset-exit-prev');
            void b.offsetWidth;
            b.classList.add('ms-preset-enter-' + dir);
          });

          if (formGrid) {
            formGrid.classList.remove('ms-grid-exit');
            void formGrid.offsetWidth;
            formGrid.classList.add('ms-grid-enter');
          }

          presetEnterTimer = setTimeout(function () {
            bodies.forEach(function (b) {
              b.classList.remove('ms-preset-enter-next', 'ms-preset-enter-prev');
            });
            if (formGrid) formGrid.classList.remove('ms-grid-enter');
            presetEnterTimer = null;
            presetExitTimer = null;
          }, 380);
        }, 130);
      }

      function getPresetList() {
        if (isAppIdMode) return ['custom'];
        var list = ['custom'];
        PRESETS.forEach(function (p) { list.push(p.key); });
        return list;
      }

      function updatePresetsArrows() {
        if (isAppIdMode) return;
        var prev = $('msPresetsPrev');
        var next = $('msPresetsNext');
        if (!prev || !next) return;
        var list = getPresetList();
        var idx = list.indexOf(activeKey);
        if (idx === -1) idx = 0;

        // Keep navigation arrows visible and usable across all screen sizes
        prev.classList.remove('is-hidden');
        next.classList.remove('is-hidden');

        var prevIdx = (idx - 1 + list.length) % list.length;
        var nextIdx = (idx + 1) % list.length;
        var prevKey = list[prevIdx];
        var nextKey = list[nextIdx];

        var customLabel = (hasUserDraft() && userDraft && userDraft.name) ? userDraft.name : 'Your App';
        prev.setAttribute('title', 'Previous: ' + (prevKey === 'custom' ? customLabel : prevKey));
        next.setAttribute('title', 'Next: ' + (nextKey === 'custom' ? customLabel : nextKey));
      }

      function buildPills() {
        var bar = $('msPresets');
        if (!bar) return;
        bar.innerHTML = '<span class="ms-seg-indicator ms-presets-indicator" id="msPresetsIndicator"></span>';

        // Draft / Personal App is placed first (index 0) so it's always immediately accessible on mobile/narrow screens
        var c = document.createElement('button');
        c.type = 'button'; c.className = 'ms-pill custom'; c.dataset.key = 'custom'; c.id = 'msPill-custom';
        c.textContent = '+ Your App';
        bar.appendChild(c);

        var div = document.createElement('span');
        div.className = 'ms-presets-divider';
        div.setAttribute('aria-hidden', 'true');
        bar.appendChild(div);

        bar.classList.add('has-dropdown');
        var pBar = bar.closest('.ms-presets-bar');
        if (pBar) {
          pBar.classList.add('has-dropdown');
          var pLabel = pBar.querySelector('.ms-presets-label');
          if (pLabel) pLabel.style.display = 'none';
        }

        var prevBtn = $('msPresetsPrev');
        var nextBtn = $('msPresetsNext');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        var dropWrap = document.createElement('div');
        dropWrap.className = 'ms-preset-dropdown';
        dropWrap.id = 'msPresetDropdown';

        var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;

        var dropBtn = document.createElement('button');
        dropBtn.type = 'button';
        dropBtn.className = 'ms-pill ms-preset-dropdown-trigger';
        dropBtn.id = 'msPresetDropdownBtn';
        dropBtn.dataset.key = 'presets-dropdown';
        dropBtn.innerHTML = '<span class="ms-drop-icon-wrap" id="msDropIconWrap" style="display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">' +
          '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' +
          '</span>' +
          '<span id="msPresetDropdownLabel">' + (isVi ? 'Mẫu tham khảo' : 'Presets') + '</span>' +
          '<svg class="arr" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

        var dropMenu = document.createElement('div');
        dropMenu.className = 'ms-preset-dropdown-menu';
        dropMenu.id = 'msPresetDropdownMenu';

        var dropTitle = document.createElement('div');
        dropTitle.className = 'ms-preset-menu-header';
        dropTitle.textContent = isVi ? 'Mẫu tham khảo' : 'Sample Templates';
        dropMenu.appendChild(dropTitle);

        PRESETS.forEach(function (p) {
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'ms-preset-menu-item';
          item.dataset.key = p.key;
          item.innerHTML = '<img src="' + p.icon + '" alt="" onerror="this.src=\'' + CUSTOM_ICON + '\'">' +
            '<div class="ms-preset-menu-item-text">' +
              '<span class="name">' + escapeHtml(p.label) + '</span>' +
              '<small class="tag">' + escapeHtml(p.tag) + '</small>' +
            '</div>';

          item.addEventListener('click', function (e) {
            e.stopPropagation();
            closePresetMenu(0);
            stopAuto();
            loadPreset(p.key);
          });
          dropMenu.appendChild(item);
        });

        dropWrap.appendChild(dropBtn);
        dropWrap.appendChild(dropMenu);
        bar.appendChild(dropWrap);

        // Hover & click handlers: hover pops open with smooth grace delay, click/press toggles, item selection closes immediately
        var dropHoverTimer = null;
        function openPresetMenu() {
          if (dropHoverTimer) {
            clearTimeout(dropHoverTimer);
            dropHoverTimer = null;
          }
          dropWrap.classList.add('is-open');
        }
        function closePresetMenu(delay) {
          if (dropHoverTimer) {
            clearTimeout(dropHoverTimer);
            dropHoverTimer = null;
          }
          if (typeof delay === 'number' && delay > 0) {
            dropHoverTimer = setTimeout(function () {
              dropWrap.classList.remove('is-open');
              dropHoverTimer = null;
            }, delay);
          } else {
            dropWrap.classList.remove('is-open');
          }
        }

        dropWrap.addEventListener('mouseenter', openPresetMenu);
        dropWrap.addEventListener('mouseleave', function () {
          closePresetMenu(220);
        });

        dropBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (dropWrap.classList.contains('is-open')) {
            closePresetMenu(0);
          } else {
            openPresetMenu();
          }
        });

        if (!document._msPresetDropInit) {
          document._msPresetDropInit = true;
          document.addEventListener('click', function (e) {
            var openDrop = $('msPresetDropdown');
            if (openDrop && !openDrop.contains(e.target)) {
              if (dropHoverTimer) { clearTimeout(dropHoverTimer); dropHoverTimer = null; }
              openDrop.classList.remove('is-open');
            }
          });
        }

        if (!bar._clickInit) {
          bar._clickInit = true;
          bar.addEventListener('click', function (e) {
            var resetBtn = e.target.closest('.ms-pill-reset-btn');
            if (resetBtn) return;
            var b = e.target.closest('.ms-pill:not(.ms-preset-dropdown-trigger)');
            if (b) { stopAuto(); loadPreset(b.dataset.key); }
          });
        }

        var bannerBackBtn = $('msPresetBannerBtn');
        if (bannerBackBtn && !bannerBackBtn._init) {
          bannerBackBtn._init = true;
          bannerBackBtn.addEventListener('click', function () {
            stopAuto();
            loadPreset('custom');
          });
        }

        updatePresetIndicator(activeKey || (PRESETS[0] ? PRESETS[0].key : 'custom'));
        updatePresetsArrows();
      }

      // ── Single Draft Management (Rules 0, 1, 2, 3) ──
      function initDraftFromCurrentPreset() {
        var d = JSON.parse(JSON.stringify(S));
        d.key = 'custom';
        d.isCustomized = true;
        d.customUploadedIcons = {
          apple: !!customUploadedIcons.apple,
          google: !!customUploadedIcons.google
        };
        if (customUploadedMeta) {
          d.customUploadedMeta = {
            apple: customUploadedMeta.apple || null,
            google: customUploadedMeta.google || null
          };
        }
        d.shots = (S.shots && Array.isArray(S.shots)) ? S.shots.slice(0, 4) : [];
        d.reviews = (S.reviews && Array.isArray(S.reviews)) ? JSON.parse(JSON.stringify(S.reviews)) : [];
        userDraft = d;
        activeKey = 'custom';
        root.querySelectorAll('.ms-pill').forEach(function (b) {
          b.classList.toggle('on', b.dataset.key === 'custom');
        });
        updateCustomPill();
        updatePresetBanner();
        updateExportMockupState();
      }

      function downscaleIconTo512(src, callback) {
        if (!src || typeof src !== 'string') return callback(src);
        if (src.indexOf('mzstatic.com') !== -1 && /\/\d+x\d+bb\.(jpg|png)/i.test(src)) {
          return callback(src.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png'));
        }
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          try {
            var cv = document.createElement('canvas');
            cv.width = 512;
            cv.height = 512;
            var ctx = cv.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, 512, 512);
            callback(cv.toDataURL('image/png'));
          } catch (_) {
            callback(src);
          }
        };
        img.onerror = function () { callback(src); };
        img.src = src;
      }
      window.downscaleIconTo512 = downscaleIconTo512;

      function applyUploadedIcon(storeKey, storeName, url) {
        // Rule 1: Before draft is created, initialize draft from current preset or blank
        if (!hasUserDraft()) {
          if (activeKey !== 'custom') {
            initDraftFromCurrentPreset();
          } else {
            var d0 = ensureDraft();
            d0.isCustomized = true;
          }
        }

        // Rule 2: If draft already exists and user is viewing another preset,
        // ephemeral preview only - do NOT save to draft or storage
        if (activeKey !== 'custom') {
          isPresetModified = true;
          updatePresetBanner();
          customUploadedIcons[storeName] = true;
          S[storeKey] = url;
          renderIcon();
          flash(storeKey === 'iconApple' ? 'icon' : 'iconGoogle');
          return;
        }

        // Rule 3: Updating draft directly
        customUploadedIcons[storeName] = true;
        S[storeKey] = url;
        var d = ensureDraft();
        d[storeKey] = url;
        d.customUploadedIcons = d.customUploadedIcons || {};
        d.customUploadedIcons[storeName] = true;
        if (customUploadedMeta && customUploadedMeta[storeName]) {
          d.customUploadedMeta = d.customUploadedMeta || {};
          d.customUploadedMeta[storeName] = customUploadedMeta[storeName];
        }
        d.isCustomized = true;
        saveDraftToStorage();
        updateCustomPill();
        updatePresetBanner();
        renderIcon();
        flash(storeKey === 'iconApple' ? 'icon' : 'iconGoogle');
      }

      function handleIconUpload(storeKey, storeName, url) {
        if (storeName === 'google') {
          downscaleIconTo512(url, function (d512) {
            if (d512 && typeof d512 === 'string' && d512.indexOf('data:') === 0) {
              var comma = d512.indexOf(',');
              var b64 = d512.slice(comma + 1);
              var pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
              customUploadedMeta.google = {
                size: Math.round((b64.length * 3) / 4 - pad),
                type: 'image/png',
                name: 'icon-512.png'
              };
            }
            applyUploadedIcon(storeKey, storeName, d512);
          });
        } else {
          applyUploadedIcon(storeKey, storeName, url);
          // If Google icon has not been explicitly customized, auto downscale Apple icon to 512 for Google
          if (!customUploadedIcons.google) {
            downscaleIconTo512(url, function (d512) {
              if (!customUploadedIcons.google) {
                S.iconGoogle = d512;
                if (activeKey === 'custom') {
                  var d = ensureDraft();
                  d.iconGoogle = d512;
                  saveDraftToStorage();
                }
                renderIcon();
              }
            });
          }
        }
      }
      window.handleIconUpload = handleIconUpload;

      // ── Text inputs ──
      [['msName', 'name'], ['msSub', 'sub'], ['msShort', 'short']].forEach(function (pair) {
        var el = $(pair[0]), key = pair[1];
        var fallbackText = key === 'name' ? 'App Name' : key === 'sub' ? 'App Subtitle' : 'Short description shown on Google Play';
        el.addEventListener('input', function () {
          // Rule 1: Before draft is created, editing on a preset initializes draft
          if (!hasUserDraft()) {
            if (activeKey !== 'custom') {
              initDraftFromCurrentPreset();
            } else {
              var d0 = ensureDraft();
              d0.isCustomized = true;
            }
          }

          // Rule 2: If draft already exists and user is viewing another preset,
          // ephemeral preview only - do NOT save to draft or storage
          if (activeKey !== 'custom') {
            isPresetModified = true;
            updatePresetBanner();
            S[key] = el.value;
            bindText(key, S[key], fallbackText);
            renderValidation();
            flash(key);
            return;
          }

          // Rule 3: Updating draft directly
          S[key] = el.value;
          var d = ensureDraft();
          var maxLimit = LIMITS[key] || 30;
          d[key] = clampGraphemes(el.value, maxLimit);
          d.isCustomized = true;
          saveDraftToStorage();
          updateCustomPill();
          updatePresetBanner();
          bindText(key, S[key], fallbackText);
          renderValidation();
          flash(key);
        });
        el.addEventListener('focus', function () { setFocus(key); });
        el.addEventListener('blur', function () { setFocus(null); });
      });

      function setFocus(key) {
        root.querySelectorAll('.ms-stage .ms-hl-target').forEach(function (el) { el.classList.remove('ms-hl-target'); });
        $('msStage').classList.toggle('ms-focus', !!key);
        if (key) root.querySelectorAll('.ms-stage [data-f="' + key + '"]').forEach(function (el) { el.classList.add('ms-hl-target'); });
      }

      // ── Image uploads (app icon only), all client-side ──
      function readImages(files, cb) {
        var list = Array.prototype.filter.call(files || [], function (f) { return f.type && f.type.indexOf('image/') === 0; });
        if (!list.length) return;
        var out = new Array(list.length), done = 0;
        list.forEach(function (f, i) {
          var r = new FileReader();
          r.onload = function (e) { out[i] = e.target.result; if (++done === list.length) cb(out); };
          r.readAsDataURL(f);
        });
      }
      function setIcon(files) {
        readImages(files, function (urls) {
          handleIconUpload('icon', 'apple', urls[0]);
        });
      }

      function wireIconSlot(prefix, storeKey, storeName) {
        var drop = $('msIconDrop' + prefix);
        var input = $('msIconInput' + prefix);
        var uploadBtn = $('msIconUploadBtn' + prefix);
        var inspectBtn = $('msIconInspectBtn' + prefix);
        var badge = $('msIconBadge' + prefix);

        if (uploadBtn && input) {
          uploadBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            input.click();
          });
        }

        function triggerInspect(e) {
          if (e) e.stopPropagation();
          var currentSrc = S[storeKey] || S.icon || CUSTOM_ICON;
          if (!S[storeKey] && (!S.icon || isPlaceholderIcon(S.icon))) {
            if (input) input.click();
          } else {
            openIconModal(currentSrc, storeName);
          }
        }

        if (inspectBtn) {
          inspectBtn.addEventListener('click', triggerInspect);
        }

        if (badge) {
          badge.addEventListener('click', triggerInspect);
        }

        if (drop && input) {
          drop.addEventListener('click', function () {
            triggerInspect();
          });
          dropZone(drop, function (files) {
            if (files && files[0]) {
              customUploadedMeta[storeName] = { size: files[0].size, type: files[0].type, name: files[0].name };
            }
            readImages(files, function (urls) {
              handleIconUpload(storeKey, storeName, urls[0]);
            });
          });
        }

        if (input) {
          input.addEventListener('change', function (e) {
            stopAuto();
            if (e.target.files && e.target.files[0]) {
              customUploadedMeta[storeName] = { size: e.target.files[0].size, type: e.target.files[0].type, name: e.target.files[0].name };
            }
            readImages(e.target.files, function (urls) {
              handleIconUpload(storeKey, storeName, urls[0]);
            });
            e.target.value = '';
          });
        }
      }

      wireIconSlot('Apple', 'iconApple', 'apple');
      wireIconSlot('Google', 'iconGoogle', 'google');

      // Delegates to shared Single Source of Truth modal module (src/js/modules/modal.js)
      function closeIconModal() {
        if (typeof window.closeIconModal === 'function') window.closeIconModal();
      }

      function openIconModal(src, targetStore) {
        if (typeof window.openIconModal === 'function') {
          window.openIconModal(src, targetStore);
        }
      }
      function dropZone(el, onFiles) {
        if (!el) return;
        el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('drag-over'); });
        el.addEventListener('dragleave', function () { el.classList.remove('drag-over'); });
        el.addEventListener('drop', function (e) {
          e.preventDefault(); el.classList.remove('drag-over'); stopAuto();
          onFiles(e.dataTransfer.files, e);
        });
      }

      // ── View mode & theme ──
      function updateStoreIndicator(mode) {
        var indicator = $('msStoreIndicator');
        if (!indicator) return;
        var btn = $('msMode' + mode.charAt(0).toUpperCase() + mode.slice(1));
        if (!btn || !btn.closest('#msStoreSeg')) {
          indicator.style.opacity = '0';
          return;
        }
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
        indicator.style.width = btn.offsetWidth + 'px';
        indicator.className = 'ms-seg-indicator ready is-' + mode;
      }

      function updateThemeIndicator(t) {
        var indicator = $('theme') ? $('theme').querySelector('.vt-pill') : ($('msThemeIndicator') || $('themeIndicator'));
        var btn = (t === 'light') ? ($('themeLight') || $('msThemeLight')) : ($('themeDark') || $('msThemeDark'));
        if (!indicator || !btn) return;
        indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
        indicator.style.width = btn.offsetWidth + 'px';
        indicator.className = 'vt-pill ready';
      }

      // ── Studio Pro 3D Spatial Device Transitions ──
      var devExitTimer = null;
      var devEnterTimer = null;
      var ALL_TRANS_CLASSES = [
        'ms-dev-exit-next', 'ms-dev-enter-next',
        'ms-dev-exit-prev', 'ms-dev-enter-prev',
        'ms-dev-exit-morph', 'ms-dev-enter-morph',
        'ms-tab-enter'
      ];

      function clearDevTransitions() {
        if (devExitTimer) { clearTimeout(devExitTimer); devExitTimer = null; }
        if (devEnterTimer) { clearTimeout(devEnterTimer); devEnterTimer = null; }
        var stage = $('msStage');
        if (stage) stage.style.minHeight = '';
        var da = $('msDevApple'), dg = $('msDevGoogle');
        if (da) {
          ALL_TRANS_CLASSES.forEach(function (c) { da.classList.remove(c); });
          da.style.position = '';
          da.style.left = '';
          da.style.top = '';
          da.style.width = '';
          da.style.margin = '';
          da.style.opacity = '';
          da.style.pointerEvents = '';
          da.style.transition = '';
          da.style.transform = '';
        }
        if (dg) {
          ALL_TRANS_CLASSES.forEach(function (c) { dg.classList.remove(c); });
          dg.style.position = '';
          dg.style.left = '';
          dg.style.top = '';
          dg.style.width = '';
          dg.style.margin = '';
          dg.style.opacity = '';
          dg.style.pointerEvents = '';
          dg.style.transition = '';
          dg.style.transform = '';
        }
      }

      function updateEditorModeInfo(m) {
        // Update Editor Head Title
        var edTitle = $('msEdTitle');
        if (edTitle) {
          edTitle.textContent = 'App Identity';
        }

        // Update App Name tags based on store mode
        var nameTagApple = $('msNameTagApple');
        var nameTagGoogle = $('msNameTagGoogle');
        if (nameTagApple && nameTagGoogle) {
          if (m === 'apple') {
            nameTagApple.style.display = '';
            nameTagGoogle.style.display = 'none';
          } else if (m === 'google') {
            nameTagApple.style.display = 'none';
            nameTagGoogle.style.display = '';
          } else {
            // Dual View: show BOTH tags
            nameTagApple.style.display = '';
            nameTagGoogle.style.display = '';
          }
        }

        // Update Screenshots label
        var shotsLabel = $('msShotsLabel');
        if (shotsLabel) {
          if (m === 'apple') {
            shotsLabel.innerHTML = 'iPhone Screenshots <span class="ms-tag plus buy">BUY</span>';
          } else if (m === 'google') {
            shotsLabel.innerHTML = 'Android Screenshots <span class="ms-tag plus buy">BUY</span>';
          } else {
            shotsLabel.innerHTML = 'Phone Screenshots <span class="ms-tag plus buy">BUY</span>';
          }
        }

        // Toggle store-specific fields (Apple Subtitle vs Google Short Description)
        root.querySelectorAll('.ms-field[data-only]').forEach(function (field) {
          var only = field.getAttribute('data-only');
          if (only === m) {
            field.style.display = '';
          } else {
            field.style.display = 'none';
          }
        });

        // Toggle 2 Icon rows based on currentMode (strictly 1 store at a time, never merged)
        var rowApple = $('msIconRowApple');
        var rowGoogle = $('msIconRowGoogle');
        var badgeApple = $('msIconBadgeApple');
        var badgeGoogle = $('msIconBadgeGoogle');
        var tagApple = $('msIconTagApple');

        if (rowApple && rowGoogle) {
          if (m === 'apple') {
            rowApple.style.display = 'flex';
            rowGoogle.style.display = 'none';
            if (badgeGoogle) badgeGoogle.style.display = 'none';
            if (tagApple) tagApple.style.display = 'none';
          } else {
            rowApple.style.display = 'none';
            rowGoogle.style.display = 'flex';
            if (badgeApple) badgeApple.style.display = 'none';
            if (tagApple) tagApple.style.display = '';
          }
        }
      }

      // ── AnimatedSize Engine for Mini Studio Form ──
      var formAnimTimer = null;

      function animatedSizeForm(applyDOM) {
        var editor = $('msEditor');
        if (!editor) {
          applyDOM();
          return;
        }

        // 1. Capture current rendered height of form (even if mid-animation)
        var prevHeight = editor.getBoundingClientRect().height;

        // 2. Clear any active transition or timer
        if (formAnimTimer) {
          clearTimeout(formAnimTimer);
          formAnimTimer = null;
        }
        editor.style.transition = 'none';

        // 3. Apply DOM update (switches data-store-mode, toggles fields, updates labels)
        applyDOM();

        // 4. Measure new natural wrap-content height
        editor.style.height = '';
        var targetHeight = editor.getBoundingClientRect().height;

        // If height didn't change, nothing to animate
        if (Math.abs(prevHeight - targetHeight) < 1) {
          return;
        }

        // 5. Invert: Lock at previous height
        editor.style.height = prevHeight + 'px';
        editor.style.overflow = 'hidden';
        void editor.offsetHeight; // flush layout

        // 6. Play: Smoothly expand or contract directly to target height!
        editor.style.transition = 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        editor.style.height = targetHeight + 'px';

        formAnimTimer = setTimeout(function () {
          editor.style.height = '';
          editor.style.overflow = '';
          editor.style.transition = '';
          formAnimTimer = null;
        }, 370);
      }

      function transitionStoreMode(fromMode, toMode, onApply) {
        var devApple = $('msDevApple');
        var devGoogle = $('msDevGoogle');
        var stage = $('msStage');

        clearDevTransitions();

        if (fromMode === toMode || !devApple || !devGoogle || !stage) {
          if (devApple) devApple.hidden = toMode === 'google';
          if (devGoogle) devGoogle.hidden = toMode === 'apple';
          onApply();
          return;
        }

        // Enforce deterministic initial device visibility matching fromMode
        // so rapid clicks or aborted transitions never leave stray devices visible
        if (fromMode === 'apple') {
          devApple.hidden = false;
          devGoogle.hidden = true;
        } else if (fromMode === 'google') {
          devApple.hidden = true;
          devGoogle.hidden = false;
        } else {
          devApple.hidden = false;
          devGoogle.hidden = false;
        }

        var stageRect = stage.getBoundingClientRect();
        var stageCenterX = stageRect.left + stageRect.width / 2;

        if (fromMode === 'apple' && toMode === 'google') {
          // Single Apple -> Single Google: Apple glides left, Google enters from right
          devApple.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
          devApple.style.opacity = '0';
          devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
          devExitTimer = setTimeout(function () {
            devApple.hidden = true;
            onApply();
            devGoogle.hidden = false;
            devGoogle.style.transition = 'none';
            devGoogle.style.opacity = '0';
            devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
            void devGoogle.offsetWidth;
            devGoogle.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
            devGoogle.style.opacity = '1';
            devGoogle.style.transform = 'translate3d(0, 0, 0) scale(1)';
            devEnterTimer = setTimeout(function () {
              clearDevTransitions();
            }, 360);
          }, 190);
        } else if (fromMode === 'google' && toMode === 'apple') {
          // Single Google -> Single Apple: Google glides right, Apple enters from left
          devGoogle.style.transition = 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
          devGoogle.style.opacity = '0';
          devGoogle.style.transform = 'translate3d(35px, 0, 0) scale(0.96)';
          devExitTimer = setTimeout(function () {
            devGoogle.hidden = true;
            onApply();
            devApple.hidden = false;
            devApple.style.transition = 'none';
            devApple.style.opacity = '0';
            devApple.style.transform = 'translate3d(-35px, 0, 0) scale(0.96)';
            void devApple.offsetWidth;
            devApple.style.transition = 'opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1), transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)';
            devApple.style.opacity = '1';
            devApple.style.transform = 'translate3d(0, 0, 0) scale(1)';
            devEnterTimer = setTimeout(function () {
              clearDevTransitions();
            }, 360);
          }, 190);
        } else if (fromMode === 'dual' && toMode === 'apple') {
          // Dual -> Apple: Apple glides to center, Google softly dissolves & recedes in-flow (zero flick)
          var firstA = devApple.getBoundingClientRect();
          var firstG = devGoogle.getBoundingClientRect();
          var isCol = (stageRect.width < 721) || (Math.abs(firstA.left - firstG.left) < 10);
          var appleCenterX = firstA.left + firstA.width / 2;
          var deltaX = isCol ? 0 : (stageCenterX - appleCenterX);

          stage.style.minHeight = stageRect.height + 'px';
          onApply();

          // Apple glides smoothly to center
          devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
          devApple.style.transform = 'translate3d(' + deltaX + 'px, 0, 0)';

          // Google softly fades out and gently scales down in place
          devGoogle.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
          devGoogle.style.opacity = '0';
          devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';
          devGoogle.style.pointerEvents = 'none';

          devExitTimer = setTimeout(function () {
            devGoogle.hidden = true;
            clearDevTransitions();
          }, 420);
        } else if (fromMode === 'dual' && toMode === 'google') {
          // Dual -> Google: Google glides to center, Apple softly dissolves & recedes in-flow (zero flick)
          var firstA = devApple.getBoundingClientRect();
          var firstG = devGoogle.getBoundingClientRect();
          var isCol = (stageRect.width < 721) || (Math.abs(firstA.left - firstG.left) < 10);
          var googleCenterX = firstG.left + firstG.width / 2;
          var deltaX = isCol ? 0 : (stageCenterX - googleCenterX);
          var deltaY = isCol ? (firstA.top - firstG.top) : 0;

          stage.style.minHeight = stageRect.height + 'px';
          onApply();

          // Google glides smoothly to center
          devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
          devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

          // Apple softly fades out and gently scales down in place
          devApple.style.transition = 'opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1), transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
          devApple.style.opacity = '0';
          devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';
          devApple.style.pointerEvents = 'none';

          devExitTimer = setTimeout(function () {
            devApple.hidden = true;
            clearDevTransitions();
          }, 420);
        } else if (fromMode === 'apple' && toMode === 'dual') {
          // Single Apple -> Dual: Apple glides from center to left, Google blooms in
          var firstA = devApple.getBoundingClientRect();

          onApply();
          devApple.hidden = false;
          devGoogle.hidden = false;

          var lastA = devApple.getBoundingClientRect();
          var deltaX = firstA.left - lastA.left;
          var deltaY = firstA.top - lastA.top;

          // Invert Apple to starting center position
          devApple.style.transition = 'none';
          devApple.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

          // Initial state for Google blooming in
          devGoogle.style.transition = 'none';
          devGoogle.style.opacity = '0';
          devGoogle.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

          void devApple.offsetWidth; // flush layout

          // Play smooth glide and bloom together
          devApple.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
          devApple.style.transform = 'translate3d(0, 0, 0)';
          devGoogle.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
          devGoogle.style.opacity = '1';
          devGoogle.style.transform = 'scale(1) translate3d(0, 0, 0)';

          devEnterTimer = setTimeout(function () {
            clearDevTransitions();
          }, 440);
        } else if (fromMode === 'google' && toMode === 'dual') {
          // Single Google -> Dual: Google glides from center to right, Apple blooms in
          var firstG = devGoogle.getBoundingClientRect();

          onApply();
          devGoogle.hidden = false;
          devApple.hidden = false;

          var lastG = devGoogle.getBoundingClientRect();
          var deltaX = firstG.left - lastG.left;
          var deltaY = firstG.top - lastG.top;

          // Invert Google to starting center position
          devGoogle.style.transition = 'none';
          devGoogle.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)';

          // Initial state for Apple blooming in
          devApple.style.transition = 'none';
          devApple.style.opacity = '0';
          devApple.style.transform = 'scale(0.92) translate3d(0, 6px, 0)';

          void devGoogle.offsetWidth; // flush layout

          // Play smooth glide and bloom together
          devGoogle.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
          devGoogle.style.transform = 'translate3d(0, 0, 0)';
          devApple.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
          devApple.style.opacity = '1';
          devApple.style.transform = 'scale(1) translate3d(0, 0, 0)';

          devEnterTimer = setTimeout(function () {
            clearDevTransitions();
          }, 440);
        } else {
          onApply();
        }
      }

      function updateDualPhoneUI() {
        var opt = $('optDualPhone');
        if (opt) {
          opt.classList.toggle('on', isDualPhone);
          opt.setAttribute('aria-checked', isDualPhone ? 'true' : 'false');
        }
        var badge = $('stageDualBadge');
        if (badge) {
          badge.style.display = isDualPhone ? 'inline-flex' : 'none';
        }
        var devApple = $('msDevApple');
        var devGoogle = $('msDevGoogle');
        if (isDualPhone) {
          if (devApple) devApple.hidden = false;
          if (devGoogle) devGoogle.hidden = false;
        } else {
          if (devApple) devApple.hidden = (currentMode === 'google');
          if (devGoogle) devGoogle.hidden = (currentMode === 'apple');
        }
      }

      function toggleDualPhone() {
        isDualPhone = !isDualPhone;
        updateDualPhoneUI();
      }

      function setMode(mode, animate) {
        if (mode === 'dual') {
          isDualPhone = true;
          updateDualPhoneUI();
          mode = currentMode || 'apple';
        }
        var prevMode = currentMode;
        currentMode = (mode === 'google') ? 'google' : 'apple';
        if (animate === undefined) animate = true;

        ['Apple', 'Google'].forEach(function (m) {
          var btn = $('msMode' + m);
          if (btn) btn.classList.toggle('on', m.toLowerCase() === currentMode);
        });

        updateDualPhoneUI();
        updateStoreIndicator(currentMode);

        function applyModeDOM() {
          root.setAttribute('data-store-mode', currentMode);
          updateEditorModeInfo(currentMode);
          if (currentMode === 'google' && S.iconGoogle && typeof S.iconGoogle === 'string' && S.iconGoogle.indexOf('mzstatic.com') !== -1) {
            S.iconGoogle = S.iconGoogle.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png');
          }
          renderValidation();
          renderIcon();
          updateCustomPill();
        }

        if (!animate) {
          clearDevTransitions();
          updateDualPhoneUI();
          applyModeDOM();
          return;
        }

        function applyModeWithAnimatedSize() {
          animatedSizeForm(applyModeDOM);
        }

        if (isDualPhone) {
          applyModeWithAnimatedSize();
        } else {
          transitionStoreMode(prevMode, currentMode, applyModeWithAnimatedSize);
        }
      }

      function setTheme(t) {
        var bL = $('themeLight') || $('msThemeLight');
        var bD = $('themeDark') || $('msThemeDark');
        if (bL) bL.classList.toggle('on', t === 'light');
        if (bD) bD.classList.toggle('on', t === 'dark');
        updateThemeIndicator(t);
        root.querySelectorAll('.ms-phone').forEach(function (p) { p.classList.toggle('dark', t === 'dark'); });
      }

      window.addEventListener('resize', function () {
        clearDevTransitions();
        updateDualPhoneUI();
        if (formAnimTimer) {
          clearTimeout(formAnimTimer);
          formAnimTimer = null;
        }
        var ed = $('msEditor');
        if (ed) {
          ed.style.height = '';
          ed.style.overflow = '';
          ed.style.transition = '';
        }
        updateStoreIndicator(currentMode);
        var curT = document.documentElement.getAttribute('data-theme') || 'dark';
        updateThemeIndicator(curT);
        updatePresetIndicator(activeKey);
        if (typeof updatePresetsArrows === 'function') updatePresetsArrows();
      });
      window.setMiniStudioTheme = setTheme;
      window.addEventListener('marketingThemeChange', function (e) {
        if (e && e.detail) setTheme(e.detail);
      });
      if ('MutationObserver' in window) {
        var themeObserver = new MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'data-theme') {
              var t = document.documentElement.getAttribute('data-theme') || 'dark';
              setTheme(t);
              break;
            }
          }
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      }
      root.querySelectorAll('[data-mode]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          stopAuto();
          if (b.id === 'msModeDual') {
            e.preventDefault();
            toggleDualPhone();
          } else {
            setMode(b.dataset.mode);
          }
        });
      });
      root.querySelectorAll('[data-theme]').forEach(function (b) { b.addEventListener('click', function () { stopAuto(); setTheme(b.dataset.theme); }); });

      // ── Stage View & Comparison Dropdown (Matches Core Studio) ──
      var currentScreenView = 'detail';
      var stageDropdown = $('stageViewDropdown');
      var btnStageView = $('btnStageView');
      var stageViewLabel = $('stageViewLabel');
      var stageViewIco = $('stageViewIco');

      var ICO_DETAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><rect x="7" y="7" width="4" height="4" rx="1"></rect><line x1="14" y1="7.5" x2="17" y2="7.5"></line><line x1="14" y1="10.5" x2="16" y2="10.5"></line><line x1="7" y1="15" x2="17" y2="15"></line><line x1="7" y1="18" x2="13" y2="18"></line></svg>';
      var ICO_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.5" y1="15.5" x2="21" y2="21"></line></svg>';

      function setScreenView(v) {
        currentScreenView = (v === 'search') ? 'search' : 'detail';

        if (stageViewLabel) {
          stageViewLabel.textContent = (currentScreenView === 'search') ? 'Search Result' : 'Detail View';
        }
        if (stageViewIco) {
          stageViewIco.innerHTML = (currentScreenView === 'search') ? ICO_SEARCH : ICO_DETAIL;
        }

        var optDetail = $('optViewDetail');
        var optSearch = $('optViewSearch');
        if (optDetail) {
          optDetail.classList.toggle('on', currentScreenView === 'detail');
          optDetail.style.display = '';
        }
        if (optSearch) {
          optSearch.classList.toggle('on', currentScreenView === 'search');
          optSearch.style.display = '';
        }

        root.querySelectorAll('.ms-stage [data-v="detail"]').forEach(function (el) {
          el.style.display = (currentScreenView === 'detail') ? '' : 'none';
        });
        root.querySelectorAll('.ms-stage [data-v="search"]').forEach(function (el) {
          el.style.display = (currentScreenView === 'search') ? '' : 'none';
        });

        // Sync Apple tab bar active state: 3 is Apps, 5 is Search
        root.querySelectorAll('.ms-phone.a .tab').forEach(function (tabBar) {
          var items = tabBar.querySelectorAll(':scope > div');
          if (items.length >= 5) {
            items.forEach(function (t) { t.classList.remove('on'); });
            if (currentScreenView === 'search') {
              items[4].classList.add('on');
            } else {
              items[2].classList.add('on');
            }
          }
        });

        // Sync Google Play bottom nav active state: 2 is Apps, 3 is Search
        root.querySelectorAll('.ms-phone.g .ms-gnav').forEach(function (navBar) {
          var items = navBar.querySelectorAll(':scope > div');
          if (items.length >= 4) {
            items.forEach(function (t) { t.classList.remove('on'); });
            if (currentScreenView === 'search') {
              items[2].classList.add('on');
            } else {
              items[1].classList.add('on');
            }
          }
        });

        // Reset scroll position to top
        root.querySelectorAll('.ms-body').forEach(function (b) { b.scrollTop = 0; });

        renderShots();
      }

      var stageViewGraceTimer = null;
      var suppressStageHoverUntilLeave = false;

      function showStageViewMenu() {
        if (suppressStageHoverUntilLeave) return;
        if (stageViewGraceTimer) {
          clearTimeout(stageViewGraceTimer);
          stageViewGraceTimer = null;
        }
        if (stageDropdown) stageDropdown.classList.add('is-open');
      }

      function hideStageViewMenuWithGrace(delayMs) {
        if (stageViewGraceTimer) {
          clearTimeout(stageViewGraceTimer);
          stageViewGraceTimer = null;
        }
        if (!stageDropdown) return;
        if (typeof delayMs === 'number' && delayMs > 0) {
          stageViewGraceTimer = setTimeout(function () {
            stageDropdown.classList.remove('is-open');
            stageViewGraceTimer = null;
          }, delayMs);
        } else {
          stageDropdown.classList.remove('is-open');
        }
      }

      if (btnStageView && stageDropdown) {
        btnStageView.addEventListener('click', function (e) {
          e.stopPropagation();
          suppressStageHoverUntilLeave = false;
          if (stageDropdown.classList.contains('is-open')) {
            hideStageViewMenuWithGrace(0);
          } else {
            showStageViewMenu();
          }
        });

        stageDropdown.addEventListener('mouseenter', showStageViewMenu);
        stageDropdown.addEventListener('mouseleave', function () {
          suppressStageHoverUntilLeave = false;
          hideStageViewMenuWithGrace(240);
        });
      }

      var optDetail = $('optViewDetail');
      if (optDetail) {
        optDetail.addEventListener('click', function (e) {
          e.stopPropagation();
          setScreenView('detail');
          suppressStageHoverUntilLeave = true;
          hideStageViewMenuWithGrace(0);
        });
      }

      var optSearch = $('optViewSearch');
      if (optSearch) {
        optSearch.addEventListener('click', function (e) {
          e.stopPropagation();
          setScreenView('search');
          suppressStageHoverUntilLeave = true;
          hideStageViewMenuWithGrace(0);
        });
      }

      var optDual = $('optDualPhone');
      if (optDual) {
        optDual.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleDualPhone();
          suppressStageHoverUntilLeave = true;
          hideStageViewMenuWithGrace(0);
        });
      }

      document.addEventListener('click', function (e) {
        if (stageDropdown && !stageDropdown.contains(e.target)) {
          hideStageViewMenuWithGrace(0);
        }
      });

      // Interactive Tab Bar / Bottom Nav clicks
      root.querySelectorAll('.ms-phone.a .tab > div:nth-child(5)').forEach(function (tab) {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () { setScreenView('search'); });
      });
      root.querySelectorAll('.ms-phone.a .tab > div:nth-child(3)').forEach(function (tab) {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () { setScreenView('detail'); });
      });
      root.querySelectorAll('.ms-phone.g .ms-gnav > div:nth-child(3)').forEach(function (tab) {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () { setScreenView('search'); });
      });
      root.querySelectorAll('.ms-phone.g .ms-gnav > div:nth-child(2)').forEach(function (tab) {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () { setScreenView('detail'); });
      });

      // Back buttons in search view return to detail view
      root.querySelectorAll('.gp-search-back-btn, .sr-search-clear').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          setScreenView('detail');
        });
      });

      // Expand / collapse Google screenshots
      root.querySelectorAll('.gp-search-action-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var card = btn.closest('.gp-search-card');
          if (card) card.classList.toggle('is-expanded');
        });
      });

      // ── Locked Plus Features & Toast notifications ──
      var toastTimer = null;
      var toastCustomAction = null;

      function showToast(title, desc, ctaText, onAction, tagText) {
        var t = $('msToast');
        if (!t) return;
        if (t.parentNode !== document.body) {
          document.body.appendChild(t);
        }
        $('msToastTitle').textContent = title;
        $('msToastDesc').textContent = desc;

        var tag = $('msToastTag');
        if (tag) {
          if (tagText === false) {
            tag.style.display = 'none';
          } else if (typeof tagText === 'string') {
            tag.style.display = 'inline-flex';
            tag.innerHTML = tagText;
          } else {
            tag.style.display = 'inline-flex';
            tag.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> BUY';
          }
        }

        var cta = $('msToastCta');
        toastCustomAction = (typeof onAction === 'function') ? onAction : null;
        if (cta) {
          if (toastCustomAction) {
            cta.href = '#showcase';
          } else {
            var hasPricing = !!document.getElementById('pricing');
            cta.href = hasPricing ? '#pricing' : '/#pricing';
          }
          var ctaSpan = cta.querySelector('span');
          if (ctaSpan) ctaSpan.textContent = ctaText || 'Buy Now';
        }
        t.hidden = false;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          t.classList.remove('show');
          setTimeout(function () { t.hidden = true; }, 300);
        }, 4500);
      }

      function handleLockedPrompt(title, desc, ctaText) {
        showToast(title, desc, ctaText, null, true);
      }

      var shotsLock = $('msShotsLock');
      if (shotsLock) {
        shotsLock.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          handleLockedPrompt(
            'Phone Screenshots Upload',
            'Upload, organize, and preview real screenshots on Apple & Google devices.',
            'Buy Now'
          );
        });
      }

      var toastCta = $('msToastCta');
      if (toastCta) {
        toastCta.addEventListener('click', function (e) {
          var t = $('msToast');
          if (t) { t.classList.remove('show'); t.hidden = true; }
          if (typeof toastCustomAction === 'function') {
            e.preventDefault();
            toastCustomAction();
            return;
          }
          var plusCard = document.querySelector('.price-card.plus-card') || document.querySelector('.price-card:not(.featured)');
          if (plusCard) {
            plusCard.classList.remove('pulse-highlight');
            void plusCard.offsetWidth;
            plusCard.classList.add('pulse-highlight');
            setTimeout(function () { plusCard.classList.remove('pulse-highlight'); }, 3000);
          } else {
            e.preventDefault();
            window.location.href = '/#pricing';
          }
        });
      }

      var toastClose = $('msToastClose');
      if (toastClose) {
        toastClose.addEventListener('click', function () {
          var t = $('msToast');
          if (t) { t.classList.remove('show'); t.hidden = true; }
        });
      }

      var appleBody = root.querySelector('#msPhoneApple .ms-body');
      if (appleBody) {
        var appleNav = appleBody.querySelector('.ms-a-nav');
        if (appleNav) {
          appleBody.addEventListener('scroll', function () {
            appleNav.classList.toggle('scrolled', appleBody.scrollTop > 45);
          }, { passive: true });
        }
      }

      // Smooth Drag-to-scroll & wheel for horizontal carousels (Screenshots & Stats ribbon)
      root.querySelectorAll('.ms-gal, .ms-a-met').forEach(function (g) {
        var isDown = false, startX = 0, scrollLeft = 0;
        g.addEventListener('mousedown', function (e) {
          isDown = true;
          startX = e.pageX - g.offsetLeft;
          scrollLeft = g.scrollLeft;
        });
        window.addEventListener('mouseup', function () {
          isDown = false;
        });
        g.addEventListener('mousemove', function (e) {
          if (!isDown) return;
          e.preventDefault();
          var x = e.pageX - g.offsetLeft;
          var walk = (x - startX) * 1.2;
          g.scrollLeft = scrollLeft - walk;
        });
        g.addEventListener('wheel', function (e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            var maxScroll = g.scrollWidth - g.clientWidth;
            if (maxScroll > 2) {
              var atStart = g.scrollLeft <= 0;
              var atEnd = g.scrollLeft >= maxScroll - 1;
              if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
                e.preventDefault();
                g.scrollLeft += e.deltaY;
              }
            }
          }
        }, { passive: false });
      });

      function formatRatingCount(num) {
        var n = parseInt(num, 10);
        if (!n || isNaN(n)) return '1K';
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000) return Math.round(n / 1000) + 'K';
        return String(n);
      }

      function mapAppleAppToStudioPreset(item) {
        if (!item) return null;
        var rawName = (item.trackName || item.trackCensoredName || 'App Name').trim();
        var name = rawName;
        var sub = '';

        // Separate name and subtitle if title contains " - ", " – ", " — ", or ": "
        var splitMatch = rawName.split(/\s*[-–—:]\s*/);
        if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
          name = splitMatch[0].trim();
          sub = splitMatch.slice(1).join(' · ').trim();
        } else {
          sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
        }

        var primaryGenre = item.primaryGenreName || (item.genres && item.genres[0]) || 'Productivity';
        var ratingNum = typeof item.averageUserRating === 'number' ? item.averageUserRating : 4.8;
        var ratingStr = ratingNum.toFixed(1);
        var countStr = formatRatingCount(item.userRatingCount || 1000);

        var countVal = item.userRatingCount || 1000;
        var dlStr = countVal > 100000 ? '1M+' : countVal > 20000 ? '500K+' : countVal > 2000 ? '50K+' : '10K+';

        // High-resolution Retina icons: 1024x1024 for Apple App Store, 512x512 for Google Play
        var rawIcon = item.artworkUrl512 || item.artworkUrl100 || '';
        var icon1024 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png') : CUSTOM_ICON;
        var icon512 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png') : CUSTOM_ICON;
        var iconUrl = icon1024;

        // High-resolution Retina screenshots (1242x2688)
        var shots = (item.screenshotUrls || []).map(function (u) {
          return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1242x2688bb.png');
        }).slice(0, 6);

        var isUniversal = (Array.isArray(item.features) && item.features.includes('iosUniversal')) || (Array.isArray(item.ipadScreenshotUrls) && item.ipadScreenshotUrls.length > 0);

        // Clean short description
        var cleanDesc = (item.description || '').replace(/[\r\n]+/g, ' ').trim();
        var firstSentence = cleanDesc.split(/[.!?]\s+/)[0];
        var shortDesc = (firstSentence && firstSentence.length <= 80) ? firstSentence : cleanDesc.slice(0, 80);

        return {
          key: 'live-app',
          tag: 'Live App',
          label: name.slice(0, 16),
          name: name,
          sub: sub,
          short: shortDesc || 'Download the latest version on iOS and Android.',
          promo: 'Experience ' + name + ' with seamless design and powerful features.',
          dev: item.artistName || item.sellerName || 'App Developer',
          catApple: primaryGenre,
          catGoogle: primaryGenre,
          email: 'support@' + (item.bundleId ? item.bundleId.split('.').slice(1, 3).reverse().join('.') : 'app.com'),
          phone: '+1 800-555-0199',
          addr: 'Global',
          desc: (item.description || 'App description goes here...').slice(0, 600),
          rating: ratingStr,
          count: countStr,
          rank: '1',
          dl: dlStr,
          age: item.contentAdvisoryRating || '4+',
          iap: item.price === 0,
          icon: iconUrl,
          icon1024: icon1024,
          icon512: icon512,
          iconApple: icon1024,
          iconGoogle: icon512,
          rawIcon: rawIcon,
          isUniversal: isUniversal,
          supportsIpad: isUniversal,
          feature: '',
          shots: shots,
          reviews: [
            {
              author: 'Alex Morgan',
              avatarBg: '#0284c7',
              stars: 5,
              title: 'Incredible polish & design',
              text: 'The interface is lightning fast and intuitive. ' + name + ' sets the benchmark for mobile experience.',
              helpful: 94
            },
            {
              author: 'Taylor Brooks',
              avatarBg: '#8b5cf6',
              stars: 5,
              title: 'Outstanding attention to detail',
              text: 'Clean typography, smooth workflows, and reliable performance across both iOS and Android.',
              helpful: 58
            }
          ]
        };
      }

      var verifiedAppInfo = null;
      try {
        var savedVerified = sessionStorage.getItem('sps_verified_app');
        if (savedVerified) {
          verifiedAppInfo = JSON.parse(savedVerified);
          window.spsVerifiedApp = verifiedAppInfo;
        }
      } catch (e) {}

      function trackInviteEvent(event, extra) {
        try {
          var info = verifiedAppInfo || window.spsVerifiedApp;
          if (!info || !info.appid) return;

          var q = 'event=' + encodeURIComponent(event) +
            '&appid=' + encodeURIComponent(info.appid) +
            '&app=' + encodeURIComponent(info.app || '') +
            '&dev=' + encodeURIComponent(info.dev || '');
          if (extra && typeof extra === 'object') {
            Object.keys(extra).forEach(function (k) {
              if (extra[k]) q += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(extra[k]);
            });
          }

          // 1. Edge Worker Real-Time Event Ping
          if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            fetch('/api/track?' + q, { method: 'GET', keepalive: true }).catch(function () {});
          }

          // 2. Microsoft Clarity User Identification & Custom Tags
          if (typeof window.clarity === 'function') {
            window.clarity('set', 'appid', info.appid);
            if (info.app) window.clarity('set', 'app', info.app);
            if (info.dev) window.clarity('set', 'dev', info.dev);
            window.clarity('identify', info.appid + (info.app ? '_' + info.app.replace(/\s+/g, '_') : ''));
            window.clarity('event', event);
          }
        } catch (e) {}
      }

      window.trackInviteEvent = trackInviteEvent;

      function checkAndLoadDynamicApp() {
        try {
          var params = new URLSearchParams(window.location.search);
          var rawApp = params.get('url') || params.get('itunes') || params.get('link') || params.get('store_url') ||
            params.get('appid') || params.get('app_id') || params.get('id') || params.get('app');
          var bundleId = params.get('bundle') || params.get('bundleid') || params.get('bundle_id');
          var country = params.get('country') || params.get('gl') || '';

          // Optional url parameters for theme and mode
          var urlTheme = params.get('theme');
          if (urlTheme && (urlTheme === 'dark' || urlTheme === 'light')) {
            setTheme(urlTheme);
          }
          var urlMode = params.get('mode');
          if (urlMode && (urlMode === 'dual' || urlMode === 'apple' || urlMode === 'google')) {
            setMode(urlMode, false);
          }

          var appId = '';
          if (rawApp) {
            var rawStr = String(rawApp).trim();

            // 1. Full Apple App Store or iTunes URL:
            // e.g. https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
            // e.g. https://itunes.apple.com/app/id324684580
            // e.g. https://apps.apple.com/vn/app/zalo/id579523206
            var fullUrlMatch = rawStr.match(/(?:apps|itunes)\.apple\.com\/(?:([a-z]{2}(?:-[a-z]{2})?)\/)?(?:app\/[^\/]+\/)?id(\d{7,12})/i);
            if (fullUrlMatch) {
              appId = fullUrlMatch[2];
              if (!country && fullUrlMatch[1]) {
                country = fullUrlMatch[1].toLowerCase();
              }
            } else {
              // 2. iTunes lookup query URL: https://itunes.apple.com/lookup?id=324684580
              var queryIdMatch = rawStr.match(/[?&]id=(\d{7,12})/i);
              if (queryIdMatch) {
                appId = queryIdMatch[1];
                var queryCountryMatch = rawStr.match(/[?&]country=([a-z]{2})/i);
                if (!country && queryCountryMatch) {
                  country = queryCountryMatch[1].toLowerCase();
                }
              } else {
                // 3. App ID format: "id324684580" or pure digits "324684580"
                var idPrefixMatch = rawStr.match(/^id(\d{7,12})$/i) || rawStr.match(/id(\d{7,12})/i);
                if (idPrefixMatch) {
                  appId = idPrefixMatch[1];
                } else if (/^\d{7,12}$/.test(rawStr)) {
                  appId = rawStr;
                }
              }
            }
          }

          if (!appId && !bundleId) return;

          var query = (appId ? 'id=' + encodeURIComponent(appId) : 'bundleId=' + encodeURIComponent(bundleId)) +
            (country ? '&country=' + encodeURIComponent(country) : '');
          var directUrl = 'https://itunes.apple.com/lookup?' + query;
          var proxyUrl = '/api/lookup?' + query;

          function scrollToMockup() {
            var sc = $('showcase');
            if (sc) {
              sc.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }

          // Fetch Apple API directly (native CORS enabled), fallback to proxy if needed
          function requestAppData() {
            return fetch(directUrl)
              .then(function (res) {
                if (res.ok) return res;
                return fetch(proxyUrl);
              })
              .catch(function () {
                return fetch(proxyUrl);
              });
          }

          requestAppData()
            .then(function (res) {
              if (!res.ok) throw new Error('HTTP ' + res.status);
              return res.json();
            })
            .then(function (data) {
              if (!data || !data.resultCount || !data.results || !data.results.length) {
                console.warn('[Showcase] App not found in store:', appId || bundleId);
                return;
              }

              var item = data.results[0];
              var dynamicPreset = mapAppleAppToStudioPreset(item);
              if (!dynamicPreset) return;

              // Clean any existing live-app preset from PRESETS array
              PRESETS = PRESETS.filter(function (p) { return p.key !== 'live-app'; });

              // Directly promote loaded iTunes app to be the active user draft
              dynamicPreset.key = 'custom';
              dynamicPreset.isCustomized = true;
              dynamicPreset.isLiveApp = true;
              userDraft = dynamicPreset;
              saveDraftToStorage();

              // Store verified Apple App identity and log verified invite_open
              verifiedAppInfo = {
                appid: String(item.trackId || appId || ''),
                app: (dynamicPreset.form && dynamicPreset.form.name) || item.trackName || '',
                dev: (dynamicPreset.form && dynamicPreset.form.dev) || item.artistName || ''
              };
              window.spsVerifiedApp = verifiedAppInfo;
              try {
                sessionStorage.setItem('sps_verified_app', JSON.stringify(verifiedAppInfo));
              } catch (e) {}
              trackInviteEvent('invite_open');

              // Update custom pill and load as active draft preset
              updateCustomPill();
              loadPreset('custom', false);

              // Smoothly scroll down to showcase section so user sees their app immediately
              setTimeout(scrollToMockup, 300);
            })
            .catch(function (err) {
              console.warn('[Showcase] Dynamic app lookup failed:', err);
            });
        } catch (e) {
          console.warn('[Showcase] checkAndLoadDynamicApp error:', e);
        }
      }

      function stopAuto() {}

      // ── Boot ──
      if (!PRESETS.length) {
        console.warn('[Showcase] showcase-data.js missing — run: npm run showcase');
      }
      loadDraftFromStorage();
      buildPills();
      updateCustomPill();
      var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
      setMode('dual', false);
      var explicitPreset = urlParams ? urlParams.get('preset') : null;
      var defaultBootKey = (explicitPreset && PRESETS.some(function (p) { return p.key === explicitPreset; }))
        ? explicitPreset
        : ((isAppIdMode || !PRESETS.length || hasUserDraft()) ? 'custom' : PRESETS[0].key);
      loadPreset(defaultBootKey, true);
      updateMsClocksAndReviews();
      window.addEventListener('DOMContentLoaded', updateMsClocksAndReviews);
      window.addEventListener('load', updateMsClocksAndReviews);
      setInterval(updateMsClocksAndReviews, 10000);
      requestAnimationFrame(function () {
        updateStoreIndicator(currentMode);
        updateThemeIndicator(currentTheme);
        updatePresetIndicator(activeKey);
        updateExportMockupState();
      });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          updatePresetIndicator(activeKey);
          updateStoreIndicator(currentMode);
        });
      }

      // Check for dynamic URL params (?appid=... or ?bundle=...)
      checkAndLoadDynamicApp();

      // ── Export Dropdown Setup & 2x Retina Export Engine ──
      var dropdown = document.getElementById('msExportDropdown');
      var btnExportToggle = document.getElementById('btnExport');
      var btnMockup = document.getElementById('btnExportMockup4K');
      var menuExportEl = document.getElementById('menuExport');

      if (btnExportToggle && dropdown) {
        var hoverGraceTimer = null;

        function showExportMenu() {
          if (hoverGraceTimer) {
            clearTimeout(hoverGraceTimer);
            hoverGraceTimer = null;
          }
          dropdown.classList.add('is-open');
        }

        function hideExportMenuWithGrace(delayMs) {
          if (hoverGraceTimer) {
            clearTimeout(hoverGraceTimer);
            hoverGraceTimer = null;
          }
          if (typeof delayMs === 'number' && delayMs > 0) {
            hoverGraceTimer = setTimeout(function () {
              dropdown.classList.remove('is-open');
              hoverGraceTimer = null;
            }, delayMs);
          } else {
            dropdown.classList.remove('is-open');
          }
        }

        btnExportToggle.addEventListener('click', function (e) {
          e.stopPropagation();
          if (dropdown.classList.contains('is-open')) {
            hideExportMenuWithGrace(0);
          } else {
            showExportMenu();
          }
        });

        dropdown.addEventListener('mouseenter', showExportMenu);
        dropdown.addEventListener('mouseleave', function () {
          hideExportMenuWithGrace(220);
        });

        document.addEventListener('click', function (e) {
          if (!dropdown.contains(e.target)) {
            hideExportMenuWithGrace(0);
          }
        });

        // Any action/link inside export menu closes it immediately upon selection
        if (menuExportEl) {
          menuExportEl.addEventListener('click', function (e) {
            var actionEl = e.target.closest('button, a, .menu-item');
            if (actionEl) {
              hideExportMenuWithGrace(0);
            }
          });
        }

        dropdown.querySelectorAll('.menu-item.is-locked').forEach(function (item) {
          item.addEventListener('click', function (e) {
            e.stopPropagation();
            hideExportMenuWithGrace(0);
            var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;
            if (item.id === 'btnExportClean4K') {
              showToast(
                isVi ? 'Xuất ảnh 4K Sạch (Không Watermark)' : 'Clean 4K Ultra HD Export',
                isVi ? 'Mở khóa bản Plus Edition để xuất ảnh Mockup 4K Ultra HD siêu nét, sạch 100% không watermark.' : 'Unlock Plus Edition to export pristine 4K Ultra HD mockups without watermarks.',
                isVi ? 'Mua bản Plus' : 'Buy Now'
              );
            } else {
              showToast(
                isVi ? 'Tính năng phiên bản Plus' : 'Plus Edition Feature',
                isVi ? 'Mở khóa phiên bản Plus để xuất trọn bộ package ZIP nộp Store và metadata.' : 'Unlock Plus Edition to export complete App Store packages, ZIP screenshots, and store metadata.',
                isVi ? 'Mua bản Plus' : 'Buy Now'
              );
            }
          });
        });
      }

      // Preload html2canvas asynchronously in background so first click has zero network latency
      if (typeof html2canvas === 'undefined') {
        var preScript = document.createElement('script');
        preScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        preScript.async = true;
        document.head.appendChild(preScript);
      }

      if (btnMockup) {
        btnMockup.addEventListener('click', function () {
          trackInviteEvent('export_watermark');
          if (dropdown) dropdown.classList.remove('is-open');
          var stage = document.getElementById('msStage');
          if (!stage || btnMockup.classList.contains('is-loading')) return;

          btnMockup.classList.add('is-loading');
          btnMockup.disabled = true;

          function resetBtn() {
            btnMockup.classList.remove('is-loading');
            btnMockup.disabled = false;
            if (stage) stage.classList.remove('is-exporting');
          }

          function drawWatermark(cv) {
            var ctx = cv.getContext('2d');
            if (!ctx) return;
            var w = cv.width;
            var h = cv.height;

            var isLight = (document.documentElement.getAttribute('data-theme') === 'light');

            // Perfectly centered repeating diagonal watermark pattern across entire canvas
            ctx.save();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(-22 * Math.PI / 180);

            var patFontSize = Math.max(16, Math.round(w * 0.016));
            ctx.font = '600 ' + patFontSize + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            var maxDim = Math.sqrt(w * w + h * h);
            var stepX = Math.round(w * 0.28);
            var stepY = Math.round(h * 0.15);
            var text = 'STORE PREVIEW STUDIO';

            // Soft translucent watermark visible on transparent background
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            ctx.shadowBlur = 3;
            ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.10)';

            var row = 0;
            for (var y = -maxDim; y <= maxDim; y += stepY) {
              row++;
              var shift = (row % 2 === 0) ? (stepX / 2) : 0;
              for (var x = -maxDim; x <= maxDim; x += stepX) {
                ctx.fillText(text, x + shift, y);
              }
            }
            ctx.restore();
          }

          function downloadCanvas(cv) {
            var isDraft = (activeKey === 'custom');
            var isVi = (document.documentElement.lang || '').toLowerCase().indexOf('vi') === 0;

            // Always apply watermark to 2x free preview mockup exports
            drawWatermark(cv);

            var appName = (userDraft && userDraft.name) ? userDraft.name : (S.name || 'preview-studio');
            var slug = (function(text) {
              if (!text) return 'app';
              var s = String(text).replace(/[\u0110\u00D0\u0189]/g, 'd').replace(/[\u0111\u00F0\u0256\u0257]/g, 'd');
              var norm = s.normalize ? s.normalize('NFD') : s;
              var res = norm.replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
              return res || 'app';
            })(appName);
            var fileName = isDraft ? (slug + '-preview-sample-2x.png') : ((activeKey || 'taskflow') + '-mockup-2x.png');

            function finish(url, blob) {
              var a = document.createElement('a');
              a.download = fileName;
              a.href = url;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(function () {
                if (blob) URL.revokeObjectURL(url);
              }, 2500);
              resetBtn();
            }

            if (cv.toBlob) {
              cv.toBlob(function (blob) {
                if (!blob) {
                  fallbackDataUrl(cv);
                  return;
                }
                var url = URL.createObjectURL(blob);
                finish(url, blob);
              }, 'image/png');
            } else {
              fallbackDataUrl(cv);
            }

            function fallbackDataUrl(cv) {
              var url = cv.toDataURL('image/png', 1.0);
              finish(url, null);
            }
          }

          function decodeSvgDataUri(body, isBase64) {
            if (isBase64) {
              if (typeof atob === 'function') {
                try {
                  return atob(body);
                } catch (e) {
                  return '';
                }
              }
              return '';
            }
            try {
              return decodeURIComponent(body);
            } catch (e) {
              return unescape(body);
            }
          }

          function ensureSvgDimensions(uri) {
            if (typeof uri !== 'string' || uri.indexOf('data:image/svg+xml') !== 0) return uri;
            try {
              var comma = uri.indexOf(',');
              if (comma < 0) return uri;
              var header = uri.slice(0, comma);
              var body = uri.slice(comma + 1);
              var raw = decodeSvgDataUri(body, /;base64/i.test(header));
              if (!raw) return uri;
              if (!/<\s*svg[^>]*\bwidth\s*=/i.test(raw) && !/<\s*svg[^>]*\bheight\s*=/i.test(raw)) {
                var vb = raw.match(/viewBox\s*=\s*['"]\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*['"]/i);
                if (vb) {
                  var w = Math.round(parseFloat(vb[1]));
                  var h = Math.round(parseFloat(vb[2]));
                  if (w === 460 && h === 996) { w = 1080; h = 2340; }
                  else if (w === 1024 && h === 500) { w = 1024; h = 500; }
                  else if (w === 32 && h === 32) { w = 1024; h = 1024; }
                  var fixed = raw.replace(/<svg\b([^>]*)>/i, '<svg$1 width="' + w + '" height="' + h + '">');
                  return 'data:image/svg+xml;utf8,' + encodeURIComponent(fixed.replace(/\s+/g, ' '));
                }
              }
            } catch (e) {}
            return uri;
          }

          async function rasterizeSvgImages(root, scale) {
            var swaps = [];
            var imgs = Array.from(root.querySelectorAll('img')).filter(function (i) {
              return /^data:image\/svg\+xml/i.test(i.currentSrc || i.src || '');
            });
            await Promise.all(imgs.map(async function (img) {
              try {
                var box = img.getBoundingClientRect();
                if (!box.width || !box.height) return;
                var original = img.src;
                var svgText = '';
                var commaIdx = original.indexOf(',');
                if (commaIdx !== -1) {
                  var header = original.slice(0, commaIdx);
                  var body = original.slice(commaIdx + 1);
                  svgText = decodeSvgDataUri(body, /;base64/i.test(header)) || '';
                }
                var vb = svgText.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/);
                var vw = vb ? parseFloat(vb[1]) : box.width, vh = vb ? parseFloat(vb[2]) : box.height;
                var tmp = new Image();
                var safeSrc = ensureSvgDimensions(original);
                await new Promise(function (res) {
                  var done = false;
                  var timer = setTimeout(function () {
                    if (!done) { done = true; res(); }
                  }, 1200);
                  tmp.onload = function () {
                    if (!done) { done = true; clearTimeout(timer); res(); }
                  };
                  tmp.onerror = function () {
                    if (!done) { done = true; clearTimeout(timer); res(); }
                  };
                  tmp.src = safeSrc;
                });
                var k = Math.max(box.width * scale / vw, box.height * scale / vh);
                var sw = Math.max(1, Math.round(vw * k)), sh = Math.max(1, Math.round(vh * k));
                var c1 = document.createElement('canvas'); c1.width = sw; c1.height = sh;
                c1.getContext('2d').drawImage(tmp, 0, 0, sw, sh);
                var w = Math.max(1, Math.round(box.width * scale)), h = Math.max(1, Math.round(box.height * scale));
                var c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
                var f = Math.max(w / sw, h / sh);
                var dw = sw * f, dh = sh * f;
                c2.getContext('2d').drawImage(c1, (w - dw) / 2, (h - dh) / 2, dw, dh);
                var png = c2.toDataURL('image/png');
                swaps.push([img, original]);
                img.src = png;
                if (img.decode) await img.decode().catch(function () {});
              } catch (err) {}
            }));
            return function () {
              swaps.forEach(function (pair) { pair[0].src = pair[1]; });
            };
          }

          async function doExport() {
            setFocus(null);
            // Keep the live stage's layout completely untouched to avoid position jitter;
            // all export preparation (.is-exporting, styling) is applied exclusively to clonedStage in onclone().
            var isLight = (document.documentElement.getAttribute('data-theme') === 'light');
            var restoreSvg = null;
            try {
              if (document.fonts && document.fonts.ready) {
                await document.fonts.ready.catch(function () {});
              }
              restoreSvg = await rasterizeSvgImages(stage, 2);
            } catch (err) {
              console.warn('[MiniStudio] SVG pre-rasterize warning:', err);
            }

            try {
              var canvas = await html2canvas(stage, {
              scale: 2, // 2x Crisp Retina HD (~2560px)
              useCORS: true,
              allowTaint: true,
              backgroundColor: null, // Transparent cutout
              logging: false,
              imageTimeout: 0,
              removeContainer: true,
              ignoreElements: function (el) {
                return el.classList && el.classList.contains('ms-stage-theme-bar');
              },
              onclone: function (clonedDoc) {
                var clonedStage = clonedDoc.getElementById('msStage');
                if (clonedStage) {
                  clonedStage.classList.add('is-exporting');
                  clonedStage.classList.remove('ms-focus');
                  clonedStage.style.background = 'transparent';
                  clonedStage.style.borderColor = 'transparent';
                  clonedStage.style.boxShadow = 'none';
                  clonedStage.style.perspective = 'none';
                  clonedStage.style.transform = 'none';
                  clonedStage.style.transformStyle = 'flat';

                  // Hide UI editor labels and tighten stage padding for crisp transparent cutout
                  clonedStage.querySelectorAll('.ms-dev-label').forEach(function (l) {
                    l.style.display = 'none';
                  });
                  clonedStage.style.padding = '18px 20px 20px';
                  clonedStage.style.gap = '24px';

                  // Reset 3D transforms, perspectives, animations, and scroll offsets across all mockup elements
                  clonedDoc.querySelectorAll('.ms-device, .ms-phone, .ms-screen, .ms-body').forEach(function (el) {
                    el.style.transform = 'none';
                    el.style.perspective = 'none';
                    el.style.transformStyle = 'flat';
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                    el.style.willChange = 'auto';
                    el.scrollTop = 0;
                    el.scrollLeft = 0;
                  });

                  clonedStage.querySelectorAll('.ms-hl, .ms-hl-target').forEach(function (el) {
                    el.classList.remove('ms-hl');
                    el.classList.remove('ms-hl-target');
                    el.style.outline = 'none';
                    el.style.animation = 'none';
                  });

                  // Ensure solid screen backgrounds without transparency cutouts
                  clonedStage.querySelectorAll('.ms-phone').forEach(function (p) {
                    p.style.boxShadow = '0 0 0 1.5px #0b0b0d';
                    var isDark = p.classList.contains('dark');
                    var isApple = p.classList.contains('a');
                    var solidBg = isDark ? (isApple ? '#000000' : '#131313') : '#ffffff';

                    var screen = p.querySelector('.ms-screen');
                    if (screen) {
                      screen.style.backgroundColor = solidBg;
                      screen.style.background = solidBg;
                      screen.style.overflow = 'hidden';
                    }
                    var sb = p.querySelector('.ms-sb');
                    if (sb) {
                      sb.style.backgroundColor = solidBg;
                      sb.style.background = solidBg;
                    }
                    var body = p.querySelector('.ms-body');
                    if (body) {
                      body.style.backgroundColor = solidBg;
                      body.style.background = solidBg;
                      body.style.overflow = 'visible';
                      body.style.overflowY = 'visible';
                      body.style.overflowX = 'visible';
                      body.scrollTop = 0;
                      body.scrollLeft = 0;
                    }
                    var gnav = p.querySelector('.ms-gnav');
                    if (gnav) {
                      gnav.style.backgroundColor = isDark ? '#1C2023' : '#f1f3f4';
                    }
                    var tab = p.querySelector('.tab');
                    if (tab) {
                      tab.style.backgroundColor = isDark ? 'rgba(22, 22, 24, 0.95)' : 'rgba(249, 249, 249, 0.95)';
                    }

                    // Render hardware side buttons
                    if (!p.querySelector('.ms-phone-btn')) {
                      var addBtn = function (side, top, height) {
                        var b = clonedDoc.createElement('div');
                        var isLeft = side === 'left';
                        b.className = 'ms-phone-btn';
                        b.style.cssText = 'position:absolute;' + (isLeft ? 'left:-4px;border-radius:2px 0 0 2px;background:linear-gradient(90deg,#565860 0%,#36383e 55%,#1d1e22 100%);' : 'right:-4px;border-radius:0 2px 2px 0;background:linear-gradient(90deg,#1d1e22 0%,#36383e 45%,#565860 100%);') + 'top:' + top + 'px;width:4px;height:' + height + 'px;box-shadow:0 0 0 1px #0b0b0d;pointer-events:none;';
                        p.appendChild(b);
                      };
                      if (isApple) {
                        addBtn('left', 98, 24);
                        addBtn('left', 136, 42);
                        addBtn('left', 188, 42);
                        addBtn('right', 148, 68);
                      } else {
                        addBtn('right', 126, 33);
                        addBtn('right', 172, 66);
                      }
                    }
                  });

                  // Ensure text elements do not collapse whitespace between words due to -webkit-box in html2canvas
                  clonedStage.querySelectorAll('.ms-g-name, .ms-a-name, .ms-g-dev, .ms-a-sub, [data-bind="name"]').forEach(function (el) {
                    el.style.display = 'block';
                    el.style.webkitLineClamp = 'unset';
                    el.style.webkitBoxOrient = 'unset';
                    el.style.whiteSpace = 'pre-wrap';
                    el.style.wordBreak = 'normal';
                    el.style.wordSpacing = 'normal';
                    el.style.letterSpacing = '0px';
                  });
                }
              }
            });
            downloadCanvas(canvas);
          } catch (err) {
            console.error('Export error:', err);
            resetBtn();
            alert('Error exporting image. Please use Cmd + Shift + 4 on macOS.');
          } finally {
            if (restoreSvg) restoreSvg();
          }
        }

          // Delay execution to let browser render the loading state smoothly
          setTimeout(function () {
            if (typeof html2canvas === 'undefined') {
              var s = document.createElement('script');
              s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
              s.onload = doExport;
              s.onerror = function () {
                resetBtn();
                alert('Failed to load html2canvas library. Please check your connection.');
              };
              document.head.appendChild(s);
            } else {
              doExport();
            }
          }, 60);
        });
      }
    })();

