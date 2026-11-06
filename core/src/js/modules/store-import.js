// Store Preview Studio · Official Apple App Store Import

/**
 * Parses user input (URL or App ID) to extract Apple App ID and optional country code
 * @param {string} input 
 * @returns {{platform: 'apple', id: string, country?: string} | null}
 */
function parseStoreInput(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim();
  if (!raw) return null;

  // 1. Apple App Store URL:
  // e.g. https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
  // e.g. https://itunes.apple.com/app/id324684580
  const appleUrlMatch = raw.match(/(?:apps|itunes)\.apple\.com\/(?:([a-z]{2}(?:-[a-z]{2})?)\/)?(?:app\/[^\/]+\/)?id(\d{7,12})/i);
  if (appleUrlMatch) {
    return { platform: 'apple', id: appleUrlMatch[2], country: appleUrlMatch[1] || '' };
  }

  // 1b. iTunes lookup query URL:
  // e.g. https://itunes.apple.com/lookup?id=324684580&country=us
  const lookupMatch = raw.match(/[?&]id=(\d{7,12})/i);
  if (lookupMatch) {
    const countryMatch = raw.match(/[?&]country=([a-z]{2}(?:-[a-z]{2})?)/i);
    return { platform: 'apple', id: lookupMatch[1], country: countryMatch ? countryMatch[1] : '' };
  }

  // 2. Apple App ID format: "id324684580" or pure numbers "324684580" (7-12 digits)
  if (/^id\d{7,12}$/i.test(raw)) {
    return { platform: 'apple', id: raw.replace(/^id/i, ''), country: '' };
  }
  if (/^\d{7,12}$/.test(raw)) {
    return { platform: 'apple', id: raw, country: '' };
  }

  return null;
}

/**
 * Normalizes official Apple App Store API result into Studio state format
 * @param {object} item 
 * @returns {object}
 */
function normalizeAppleApp(item) {
  if (!item) return null;
  const rawName = (item.trackName || item.trackCensoredName || 'App Name').trim();
  let name = rawName;
  let sub = '';

  const devCompany = (item.artistName || item.sellerName || '').trim();
  const cleanStr = s => (typeof slugify === 'function' ? slugify(s, '').replace(/-/g, '') : (s || '').replace(/[\u0110\u00D0\u0189]/g, 'd').replace(/[\u0111\u00F0\u0256\u0257]/g, 'd').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''));
  const cleanDev = cleanStr(devCompany);

  const splitMatch = rawName.split(/\s*[-–—:]\s*/);
  if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
    const candidateName = splitMatch[0].trim();
    const candidateSub = splitMatch.slice(1).join(' · ').trim();
    const cleanSub = cleanStr(candidateSub);

    // If candidateSub matches or is part of developer/seller company name, it is a company attribution suffix, NOT a subtitle
    const isDevCompany = cleanSub.length >= 3 && cleanDev.includes(cleanSub);
    if (isDevCompany) {
      name = candidateName;
      sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
    } else {
      name = candidateName;
      sub = candidateSub;
    }
  } else {
    sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
  }

  const primaryGenre = item.primaryGenreName || (item.genres && item.genres[0]) || 'Productivity';
  const ratingNum = typeof item.averageUserRating === 'number' ? item.averageUserRating : 4.8;
  const ratingStr = ratingNum.toFixed(1);
  const ratingCount = item.userRatingCount || 1000;

  // High-resolution Retina icons: 1024x1024 for Apple App Store, 512x512 for Google Play
  const rawIcon = item.artworkUrl512 || item.artworkUrl100 || '';
  const icon1024 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png') : '';
  const icon512 = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/512x512bb.png') : '';
  const iconUrl = icon1024;

  // Screenshots
  const shots = (item.screenshotUrls || []).map(u => {
    const match = u.match(/\/(\d+)x(\d+)bb\.(jpg|png)$/i);
    if (match && parseInt(match[1], 10) > parseInt(match[2], 10)) {
      return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2688x1242bb.png');
    }
    return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1242x2688bb.png');
  }).slice(0, 8);

  const ipadShots = (item.ipadScreenshotUrls || []).map(u => {
    const match = u.match(/\/(\d+)x(\d+)bb\.(jpg|png)$/i);
    if (match && parseInt(match[1], 10) > parseInt(match[2], 10)) {
      return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2732x2048bb.png');
    }
    return u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2048x2732bb.png');
  }).slice(0, 8);
  const isUniversal = (Array.isArray(item.features) && item.features.includes('iosUniversal')) || (ipadShots.length > 0);

  // Short description
  const cleanDesc = (item.description || '').replace(/[\r\n]+/g, ' ').trim();
  const firstSentence = cleanDesc.split(/[.!?]\s+/)[0];
  const shortDesc = (firstSentence && firstSentence.length <= 80) ? firstSentence : cleanDesc.slice(0, 80);

  const bundleDomain = item.bundleId ? item.bundleId.split('.').slice(1, 3).reverse().join('.') : 'app.com';

  const trackId = item.trackId ? String(item.trackId) : '';
  const bundleId = item.bundleId || '';

  return {
    appId: trackId,
    appleId: trackId,
    bundleId: bundleId,
    platform: 'apple',
    store: 'apple',
    appleDevice: 'iphone',
    form: {
      name: name,
      sub: sub,
      short: shortDesc || 'Download the latest version on iOS and Android.',
      promo: 'Experience ' + name + ' with seamless design and powerful features.',
      dev: item.artistName || item.sellerName || 'App Developer',
      cat: primaryGenre,
      catApple: primaryGenre,
      catGoogle: primaryGenre,
      ver: item.version || '2.4.0',
      rdate: (typeof getCurrentMonthDateStr === 'function') ? getCurrentMonthDateStr(2, true) : 'Oct 26, 2026',
      email: 'support@' + bundleDomain,
      phone: '+1 800-555-0199',
      addr: 'Global',
      privLinked: '',
      privNotLinked: '',
      privGoogle: 'No data shared with third parties, No data collected, Data is encrypted in transit',
      new: (item.releaseNotes || 'Performance improvements and bug fixes.').slice(0, 300),
      desc: (item.description || '').slice(0, 1000)
    },
    icon: iconUrl,
    icon1024: icon1024,
    icon512: icon512,
    iconApple: icon1024,
    iconGoogle: icon512,
    rawIcon: rawIcon,
    isCustomIcon: !!iconUrl,
    shots: shots,
    ipadShots: ipadShots,
    supportsIpad: isUniversal,
    isUniversal: isUniversal,
    featureGraphic: (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''),
    feature: (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : ''),
    stats: {
      rating: ratingStr,
      ratingsCount: ratingCount,
      age: item.contentAdvisoryRating || '4+',
      chartRank: '1',
      developer: item.artistName || item.sellerName || ''
    }
  };
}

/**
 * JSONP fallback for Apple App Store API when direct fetch & proxy are unavailable or blocked by CORS
 * @param {string} appId
 * @param {string} [country]
 * @returns {Promise<object>}
 */
function fetchAppleAppViaJsonp(appId, country) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      return reject(new Error('JSONP requires a browser environment'));
    }
    const callbackName = '__appleAppJsonp_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now();
    const query = 'id=' + encodeURIComponent(appId) + (country ? '&country=' + encodeURIComponent(country) : '') + '&callback=' + callbackName;
    const script = document.createElement('script');
    script.src = 'https://itunes.apple.com/lookup?' + query;
    script.async = true;

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Connection to Apple App Store timed out (JSONP)'));
    }, 15000);

    function cleanup() {
      if (timeoutId) clearTimeout(timeoutId);
      if (script.parentNode) script.parentNode.removeChild(script);
      try {
        delete window[callbackName];
      } catch (_) {
        window[callbackName] = undefined;
      }
    }

    window[callbackName] = (data) => {
      cleanup();
      if (!data || !data.resultCount || !data.results || !data.results.length) {
        reject(new Error('App not found on Apple App Store (ID: ' + appId + ')'));
        return;
      }
      resolve(normalizeAppleApp(data.results[0]));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Failed to load app data from Apple App Store via JSONP'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Fetches Apple App Store data via official iTunes API (Native CORS enabled)
 * @param {string} appId 
 * @param {string} country 
 * @returns {Promise<object>}
 */
async function fetchAppleAppData(appId, country) {
  const query = 'id=' + encodeURIComponent(appId) + (country ? '&country=' + encodeURIComponent(country) : '');
  const proxyUrl = '/api/lookup?' + query;
  const directUrl = 'https://itunes.apple.com/lookup?' + query;

  let res;
  const isWeb = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:');
  if (isWeb) {
    try {
      res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Proxy returned ' + res.status);
    } catch (_) {
      try {
        res = await fetch(directUrl);
      } catch (err) {
        return await fetchAppleAppViaJsonp(appId, country);
      }
    }
  } else {
    try {
      res = await fetch(directUrl);
    } catch (_) {
      return await fetchAppleAppViaJsonp(appId, country);
    }
  }

  if (!res.ok) {
    try {
      return await fetchAppleAppViaJsonp(appId, country);
    } catch (_) {
      throw new Error('Apple App Store returned status ' + res.status);
    }
  }
  const data = await res.json();
  if (!data || !data.resultCount || !data.results || !data.results.length) {
    throw new Error('App not found on Apple App Store (ID: ' + appId + ')');
  }
  return normalizeAppleApp(data.results[0]);
}

/**
 * Unified fetch entrypoint for parsed store target
 * @param {{platform: 'apple', id: string, country?: string}} target 
 * @returns {Promise<object>}
 */
async function fetchStoreAppData(target) {
  if (!target || !target.id) {
    throw new Error('Invalid Apple App Store target');
  }
  return await fetchAppleAppData(target.id, target.country);
}

/**
 * Applies imported store app state to Studio, re-renders, and saves draft
 * @param {object} state 
 * @returns {boolean}
 */
function applyImportedStoreApp(state) {
  if (!state) return false;

  if (state.appId || state.appleId) {
    CURRENT_APP_ID = String(state.appId || state.appleId);
    if (typeof window !== 'undefined') window.CURRENT_APP_ID = CURRENT_APP_ID;
  }

  CURRENT_PRESET_KEY = 'draft';
  isPresetModified = false;

  // Auto select Apple App Store and iPhone device
  if (state.icon1024) CUSTOM_ICON_1024 = state.icon1024;
  else if (state.iconApple) CUSTOM_ICON_1024 = state.iconApple;
  else if (state.icon) CUSTOM_ICON_1024 = state.icon;

  if (state.icon512) CUSTOM_ICON_512 = state.icon512;
  else if (state.iconGoogle) CUSTOM_ICON_512 = state.iconGoogle;

  if (typeof setStore === 'function') {
    setStore('apple', false);
  }
  if (typeof setAppleDevice === 'function') {
    setAppleDevice('iphone', false);
  }

  // Reset Feature Graphic: Apple App Store does not provide Google Play Feature Graphic.
  // Explicitly clear it so no old preset graphic is automatically embedded.
  FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');
  state.featureGraphic = FEATURE_GRAPHIC;
  state.feature = FEATURE_GRAPHIC;

  // Apply to studio state
  if (typeof applyStateObject === 'function') {
    applyStateObject(state);
  }

  // Ensure Feature Graphic remains completely cleared after applying state
  FEATURE_GRAPHIC = (typeof BLANK_FEATURE !== 'undefined' ? BLANK_FEATURE : '');

  // Double ensure store & device buttons reflect selection after state apply
  if (typeof setStore === 'function') {
    setStore('apple', false);
  }
  if (typeof setAppleDevice === 'function') {
    setAppleDevice('iphone', false);
  }

  // Rerender all components
  if (typeof renderIcons === 'function') renderIcons();
  if (typeof renderFeature === 'function') renderFeature();
  if (typeof validateFeatureGraphic === 'function') validateFeatureGraphic();
  if (typeof renderShots === 'function') renderShots();
  if (typeof renderIpadShots === 'function') renderIpadShots();
  if (typeof renderTablets === 'function') renderTablets();
  if (typeof renderStats === 'function') renderStats();
  if (typeof syncStatInputs === 'function') syncStatInputs();
  if (typeof update === 'function') update();

  if (typeof getCurrentStateObject === 'function') {
    userDraft = getCurrentStateObject();
    userDraft.isCustomized = true;
  }
  if (typeof saveDraftToStorage === 'function') saveDraftToStorage();

  if (typeof updatePresetBanner === 'function') updatePresetBanner();
  if (typeof updateDraftPill === 'function') updateDraftPill();
  if (typeof syncAllVtPills === 'function') syncAllVtPills();
  if (typeof fit === 'function') fit();

  const appName = state.form && state.form.name ? state.form.name : 'App';
  if (typeof showToast === 'function') {
    showToast('Imported ' + appName + ' from App Store successfully');
  }

  return true;
}

/**
 * Checks whether browser/environment has active network connectivity
 * @returns {boolean}
 */
function isNetworkOnline() {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Updates dynamic network indicator banner inside import modal
 */
function updateStoreImportNetworkStatus() {
  const banner = $('storeImportNetworkBanner');
  if (!banner) return;
  const online = isNetworkOnline();
  if (!online) {
    banner.className = 'store-import-network-banner offline';
    banner.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
      <span><strong>Offline Mode Detected</strong>: Store Preview Studio operates 100% offline. To import live app data from Apple, please turn on your Wi-Fi or internet connection.</span>
    `;
  } else {
    banner.className = 'store-import-network-banner online';
    banner.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <span><strong>100% Offline Core</strong>: Your data never leaves this device. Connects to <code>itunes.apple.com</code> only with your permission.</span>
    `;
  }
}

/**
 * Prompts user to confirm enabling network connection or turning on network
 * due to Studio's 100% offline commitment
 * @param {{
 *   onConfirm: Function,
 *   onCancel?: Function,
 *   url?: string,
 *   title?: string,
 *   desc?: string,
 *   offlineTitle?: string,
 *   offlineDesc?: string,
 *   okText?: string,
 *   offlineOkText?: string,
 *   cancelText?: string
 * }} options 
 */
function showNetworkConfirmModal(options) {
  if (typeof isDemoMode === 'function' && isDemoMode()) {
    if (options && typeof options.onConfirm === 'function') options.onConfirm();
    return;
  }
  const modal = $('networkConfirmModal');
  if (!modal) {
    if (options && typeof options.onConfirm === 'function') options.onConfirm();
    return;
  }

  const isOffline = !isNetworkOnline();
  const iconWrap = $('networkConfirmIconWrap') || modal.querySelector('.confirm-modal-icon-wrap');
  const titleEl = $('networkConfirmTitle');
  const descEl = $('networkConfirmDesc');
  const okBtn = $('networkConfirmOk');
  const cancelBtn = $('networkConfirmCancel');

  let targetDomain = '';
  if (options && options.url) {
    try {
      targetDomain = new URL(options.url).hostname;
    } catch (e) {
      targetDomain = options.url;
    }
  }

  if (isOffline) {
    if (iconWrap) {
      iconWrap.className = 'confirm-modal-icon-wrap network-confirm-icon-wrap offline';
      iconWrap.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.56 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>';
    }
    if (titleEl) titleEl.textContent = options?.offlineTitle || 'Turn On Network Connection';
    if (descEl) {
      if (options?.offlineDesc) {
        descEl.innerHTML = options.offlineDesc;
      } else if (targetDomain) {
        descEl.innerHTML = `Store Preview Studio operates <strong>100% offline</strong> with zero tracking. To view external guidelines at <code>${targetDomain}</code>, you must turn on your Wi-Fi or internet connection.<br><br>Please connect to the internet and try again.`;
      } else {
        descEl.innerHTML = 'Store Preview Studio operates <strong>100% offline</strong> with zero tracking. To import live app metadata from Apple, you must turn on your Wi-Fi or internet connection.<br><br>Please connect to the internet and try again.';
      }
    }
    if (okBtn) {
      okBtn.textContent = options?.offlineOkText || "I've Turned It On";
      okBtn.className = 'confirm-btn-reset store-import-btn-submit';
    }
  } else {
    if (iconWrap) {
      iconWrap.className = 'confirm-modal-icon-wrap network-confirm-icon-wrap';
      iconWrap.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
    }
    if (titleEl) titleEl.textContent = options?.title || 'Allow Network Connection?';
    if (descEl) {
      if (options?.desc) {
        descEl.innerHTML = options.desc;
      } else if (targetDomain) {
        descEl.innerHTML = `Store Preview Studio operates <strong>100% offline</strong> with zero tracking. Opening external guidelines requires connecting to <code>${targetDomain}</code>.<br><br>Do you want to enable network access to open this link in a new tab?`;
      } else {
        descEl.innerHTML = 'Store Preview Studio operates <strong>100% offline</strong> with zero tracking. Importing live app metadata requires connecting to Apple\'s official API (<code>itunes.apple.com</code>).<br><br>Do you want to enable network access to fetch this app?';
      }
    }
    if (okBtn) {
      okBtn.textContent = options?.okText || (options?.url ? 'Allow & Open Link' : 'Allow & Connect');
      okBtn.className = 'confirm-btn-reset network-btn-confirm';
    }
  }

  if (cancelBtn) {
    cancelBtn.textContent = options?.cancelText || 'Stay Offline';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    }
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
      if (options && typeof options.onCancel === 'function') options.onCancel();
    }
  };

  if (okBtn) {
    okBtn.onclick = () => {
      closeModal();
      if (!isNetworkOnline()) {
        if (typeof setStoreImportStatus === 'function' && !options?.url) {
          setStoreImportStatus('error', 'Still offline. Please connect to the internet (Wi-Fi/Cellular) and try again.');
        } else if (typeof showToast === 'function') {
          showToast('Still offline. Please connect to the internet and try again.');
        }
        return;
      }
      if (options && typeof options.onConfirm === 'function') {
        options.onConfirm();
      }
    };
  }

  document.addEventListener('keydown', handleKey);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  if (okBtn) okBtn.focus();
}

/**
 * Modal UI Controllers
 */
function openStoreImportModal() {
  const modal = $('storeImportModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  const input = $('storeImportInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 80);
  }

  const status = $('storeImportStatus');
  if (status) {
    status.style.display = 'none';
    status.className = 'store-import-status';
    status.textContent = '';
  }

  updateStoreImportNetworkStatus();
}

function closeStoreImportModal() {
  const modal = $('storeImportModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function setStoreImportStatus(type, message) {
  const status = $('storeImportStatus');
  if (!status) return;
  if (!message) {
    status.style.display = 'none';
    status.textContent = '';
    return;
  }
  status.className = 'store-import-status ' + (type || 'info');
  status.textContent = message;
  status.style.display = 'block';
}

async function handleStoreImportSubmit(confirmed = false, isAutoFromUrl = false) {
  if (typeof isDemoMode === 'function' && isDemoMode() && !isAutoFromUrl) {
    if (typeof requireFullVersion === 'function') requireFullVersion('store-import');
    return;
  }
  const input = $('storeImportInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    setStoreImportStatus('error', 'Please enter an App Store link or Apple App ID.');
    input.focus();
    return;
  }

  const target = parseStoreInput(val);
  if (!target) {
    if (val.includes('play.google.com') || /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]+)+$/.test(val)) {
      setStoreImportStatus('error', 'Google Play does not provide a public API. Please enter an Apple App Store link or numeric App ID (e.g. 324684580).');
    } else {
      setStoreImportStatus('error', 'Unrecognized App Store link or ID format. Try an Apple App Store URL or numeric App ID (e.g. 324684580).');
    }
    return;
  }

  // 1. Check network connection first
  if (!isNetworkOnline()) {
    updateStoreImportNetworkStatus();
    showNetworkConfirmModal({
      onConfirm: () => handleStoreImportSubmit(true),
      onCancel: () => setStoreImportStatus('info', 'Kept in 100% offline mode.')
    });
    setStoreImportStatus('error', 'No internet connection detected. Please turn on your Wi-Fi or internet connection to import from Apple App Store.');
    return;
  }

  // 2. Ask user to permit network connection due to 100% offline core promise
  if (!confirmed) {
    showNetworkConfirmModal({
      onConfirm: () => handleStoreImportSubmit(true),
      onCancel: () => setStoreImportStatus('info', 'Import cancelled. Kept in 100% offline mode.')
    });
    return;
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Cloning...';
  }

  setStoreImportStatus('info', 'Connecting to Apple App Store API...');

  try {
    const importedState = await fetchStoreAppData(target);
    closeStoreImportModal();

    const apply = () => {
      applyImportedStoreApp(importedState);
    };

    const targetAppId = String(target.id || (importedState && (importedState.appId || importedState.appleId)) || '').trim();
    const currentAppId = (typeof CURRENT_APP_ID !== 'undefined' && CURRENT_APP_ID)
      ? String(CURRENT_APP_ID).trim()
      : ((typeof userDraft !== 'undefined' && userDraft && (userDraft.appId || userDraft.appleId)) ? String(userDraft.appId || userDraft.appleId).trim() : '');

    const isSameAppId = !!(targetAppId && currentAppId && targetAppId === currentAppId);

    // If same app ID, apply immediately without prompting confirmation modal
    if (isSameAppId) {
      apply();
      return;
    }

    // Auto-imported from URL on default initial workspace: apply directly without modal
    if (isAutoFromUrl) {
      const currentName = (typeof getDraftDisplayName === 'function') ? getDraftDisplayName() : '';
      const isDefaultPresetDraft = !currentName || currentName === 'Store Preview Studio' || currentName === 'Untitled' || (typeof hasLiveUserContent === 'function' && !hasLiveUserContent());
      if (isDefaultPresetDraft) {
        apply();
        return;
      }
    }

    if (typeof window !== 'undefined') window.CURRENT_INCOMING_APP_ID = targetAppId;

    // Cloning replaces the draft: ask first when it holds real work (Cancel keeps it untouched).
    if (typeof confirmReplaceDraft === 'function') {
      const importedName = (importedState && importedState.form && importedState.form.name) || '';
      confirmReplaceDraft(importedName, apply);
    } else {
      apply();
    }
  } catch (err) {
    if (!isNetworkOnline() || err.name === 'TypeError' || (err.message && (err.message.includes('fetch') || err.message.includes('NetworkError')))) {
      setStoreImportStatus('error', 'Network error: Unable to reach Apple App Store. Please check your internet connection and try again.');
    } else {
      setStoreImportStatus('error', err.message || 'Failed to import app data from App Store.');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Clone App';
    }
  }
}

/**
 * Initializes modal event listeners
 */
function initStoreImportEvents() {
  const openBtn = $('btnOpenStoreImport');
  if (openBtn) {
    openBtn.onclick = (e) => {
      e.preventDefault();
      openStoreImportModal();
    };
  }

  const optBtn = $('optImportStore');
  if (optBtn) {
    optBtn.onclick = (e) => {
      e.preventDefault();
      if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
      openStoreImportModal();
    };
  }

  const cancelBtn = $('storeImportCancel');
  if (cancelBtn) {
    cancelBtn.onclick = () => closeStoreImportModal();
  }

  const closeBtn = $('storeImportClose');
  if (closeBtn) {
    closeBtn.onclick = () => closeStoreImportModal();
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.onclick = () => handleStoreImportSubmit();
  }

  const input = $('storeImportInput');
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStoreImportSubmit();
      } else if (e.key === 'Escape') {
        closeStoreImportModal();
      }
    };
  }

  // Quick test chips
  $$('.store-import-chip').forEach(chip => {
    chip.onclick = () => {
      const val = chip.dataset.importVal;
      if (val && input) {
        input.value = val;
        handleStoreImportSubmit();
      }
    };
  });

  const modal = $('storeImportModal');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeStoreImportModal();
    };
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeStoreImportModal();
    }
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      updateStoreImportNetworkStatus();
      if (modal && modal.classList.contains('open')) {
        setStoreImportStatus('info', 'Network connection restored.');
      }
    });
    window.addEventListener('offline', () => {
      updateStoreImportNetworkStatus();
      if (modal && modal.classList.contains('open')) {
        setStoreImportStatus('error', 'Network disconnected. Studio is running in offline mode.');
      }
    });
  }

  // Handle all "Learn more" guideline links with network permission confirmation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.info-pop-link');
    if (!link) return;

    const url = link.getAttribute('href');
    if (!url || url === '#' || url.startsWith('javascript:')) return;

    e.preventDefault();
    e.stopPropagation();

    // Close any open popovers so they don't linger behind the modal
    if (typeof $$ === 'function') {
      $$('.info-popover.open').forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-hidden', 'true');
      });
    }

    showNetworkConfirmModal({
      url,
      onConfirm: () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/**
 * Checks URL parameters on page load and auto-imports if present with user confirmation
 */
function checkAndLoadStoreParams() {
  if (typeof window === 'undefined') return;
  let searchStr = (window.location && window.location.search) ? window.location.search : '';
  if (!searchStr || searchStr === '?embed=true' || searchStr === '?embed=1' || searchStr === '?embed=true&') {
    if (window.parent && window.parent !== window) {
      try {
        const parentSearch = window.parent.location.search;
        if (parentSearch) searchStr = parentSearch;
      } catch (_) {}
    }
  }
  if (!searchStr) return;
  try {
    const sp = new URLSearchParams(searchStr);
    const appid = sp.get('appid') || sp.get('apple') || sp.get('app_id') || sp.get('apple_id') || sp.get('id') || sp.get('app');
    const url = sp.get('url') || sp.get('store_url') || sp.get('link') || sp.get('itunes');

    let target = null;
    if (appid) {
      target = parseStoreInput(appid) || { platform: 'apple', id: appid.replace(/^id/i, ''), country: sp.get('country') || '' };
    } else if (url) {
      target = parseStoreInput(url);
    }

    if (target) {
      if (typeof isDemoMode === 'function' && isDemoMode()) {
        const demoInput = $('storeImportInput');
        if (demoInput) demoInput.value = appid || url;
        handleStoreImportSubmit(true, true);
        return;
      }
      openStoreImportModal();
      const input = $('storeImportInput');
      if (input) input.value = appid || url;
      showNetworkConfirmModal({
        onConfirm: () => {
          handleStoreImportSubmit(true, true);
        },
        onCancel: () => {
          setStoreImportStatus('info', 'Auto-import paused. Kept in 100% offline mode.');
        }
      });
    }
  } catch (e) {
    console.warn('[StoreImport] URL param check error:', e);
  }
}

// Global exposure for scripts and tests
if (typeof window !== 'undefined') {
  window.parseStoreInput = parseStoreInput;
  window.normalizeAppleApp = normalizeAppleApp;
  window.fetchAppleAppData = fetchAppleAppData;
  window.fetchAppleAppViaJsonp = fetchAppleAppViaJsonp;
  window.fetchStoreAppData = fetchStoreAppData;
  window.applyImportedStoreApp = applyImportedStoreApp;
  window.openStoreImportModal = openStoreImportModal;
  window.closeStoreImportModal = closeStoreImportModal;
  window.checkAndLoadStoreParams = checkAndLoadStoreParams;
  window.isNetworkOnline = isNetworkOnline;
  window.showNetworkConfirmModal = showNetworkConfirmModal;
}

// Node.js CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseStoreInput,
    normalizeAppleApp,
    fetchAppleAppData,
    fetchAppleAppViaJsonp,
    fetchStoreAppData,
    applyImportedStoreApp,
    isNetworkOnline,
    showNetworkConfirmModal
  };
}

if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
  initStoreImportEvents();
}
