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

  const splitMatch = rawName.split(/\s*[-–—:]\s*/);
  if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
    name = splitMatch[0].trim();
    sub = splitMatch.slice(1).join(' · ').trim();
  } else {
    sub = 'Official ' + (item.primaryGenreName || 'Mobile') + ' App';
  }

  const primaryGenre = item.primaryGenreName || (item.genres && item.genres[0]) || 'Productivity';
  const ratingNum = typeof item.averageUserRating === 'number' ? item.averageUserRating : 4.8;
  const ratingStr = ratingNum.toFixed(1);
  const ratingCount = item.userRatingCount || 1000;

  // High-resolution Retina icon (1024x1024)
  const rawIcon = item.artworkUrl512 || item.artworkUrl100 || '';
  const iconUrl = rawIcon ? rawIcon.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1024x1024bb.png') : '';

  // Screenshots
  const shots = (item.screenshotUrls || []).map(u => u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/1242x2688bb.png')).slice(0, 8);
  const ipadShots = (item.ipadScreenshotUrls || []).map(u => u.replace(/\/\d+x\d+bb\.(jpg|png)$/i, '/2048x2732bb.png')).slice(0, 8);

  // Short description
  const cleanDesc = (item.description || '').replace(/[\r\n]+/g, ' ').trim();
  const firstSentence = cleanDesc.split(/[.!?]\s+/)[0];
  const shortDesc = (firstSentence && firstSentence.length <= 80) ? firstSentence : cleanDesc.slice(0, 80);

  const bundleDomain = item.bundleId ? item.bundleId.split('.').slice(1, 3).reverse().join('.') : 'app.com';

  return {
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
      new: (item.releaseNotes || 'Performance improvements and bug fixes.').slice(0, 300),
      desc: (item.description || '').slice(0, 1000)
    },
    icon: iconUrl,
    isCustomIcon: !!iconUrl,
    shots: shots,
    ipadShots: ipadShots,
    supportsIpad: ipadShots.length > 0,
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
      res = await fetch(directUrl);
    }
  } else {
    res = await fetch(directUrl);
  }

  if (!res.ok) throw new Error('Apple App Store returned status ' + res.status);
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

  // Auto select Apple App Store and iPhone device
  if (typeof setStore === 'function') {
    setStore('apple', false);
  }
  if (typeof setAppleDevice === 'function') {
    setAppleDevice('iphone', false);
  }

  // Apply to studio state
  if (typeof applyStateObject === 'function') {
    applyStateObject(state);
  }

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
  if (typeof renderShots === 'function') renderShots();
  if (typeof renderIpadShots === 'function') renderIpadShots();
  if (typeof renderStats === 'function') renderStats();
  if (typeof syncStatInputs === 'function') syncStatInputs();
  if (typeof update === 'function') update();
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

async function handleStoreImportSubmit() {
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
      setStoreImportStatus('error', 'Google Play import is unsupported. Please enter an Apple App Store link or numeric App ID.');
    } else {
      setStoreImportStatus('error', 'Unrecognized App Store link or ID format. Try an Apple App Store URL or numeric App ID (e.g. 324684580).');
    }
    return;
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Fetching...';
  }

  setStoreImportStatus('info', 'Connecting to Apple App Store API...');

  try {
    const importedState = await fetchStoreAppData(target);
    applyImportedStoreApp(importedState);
    closeStoreImportModal();
  } catch (err) {
    setStoreImportStatus('error', err.message || 'Failed to import app data from App Store.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Import App';
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
}

/**
 * Checks URL parameters on page load and auto-imports if present
 */
function checkAndLoadStoreParams() {
  if (typeof window === 'undefined' || !window.location || !window.location.search) return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const appid = sp.get('appid') || sp.get('apple') || sp.get('app_id') || sp.get('apple_id');
    const url = sp.get('url') || sp.get('store_url') || sp.get('link');

    let target = null;
    if (appid) {
      target = parseStoreInput(appid) || { platform: 'apple', id: appid.replace(/^id/i, ''), country: sp.get('country') || '' };
    } else if (url) {
      target = parseStoreInput(url);
    }

    if (target) {
      fetchStoreAppData(target)
        .then(state => {
          applyImportedStoreApp(state);
        })
        .catch(err => {
          console.warn('[StoreImport] Auto-load failed:', err.message);
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
  window.fetchStoreAppData = fetchStoreAppData;
  window.applyImportedStoreApp = applyImportedStoreApp;
  window.openStoreImportModal = openStoreImportModal;
  window.closeStoreImportModal = closeStoreImportModal;
  window.checkAndLoadStoreParams = checkAndLoadStoreParams;
}

// Node.js CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseStoreInput,
    normalizeAppleApp,
    fetchAppleAppData,
    fetchStoreAppData,
    applyImportedStoreApp
  };
}

if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
  initStoreImportEvents();
}
