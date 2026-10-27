// Store Preview Studio · Universal Store Import (App Store & Google Play)

/**
 * Parses user input (URL, App ID, Package name) to determine store platform and target ID
 * @param {string} input 
 * @returns {{platform: 'apple' | 'google', id: string, country?: string} | null}
 */
function parseStoreInput(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim();
  if (!raw) return null;

  // 1. Google Play Store URL: https://play.google.com/store/apps/details?id=com.spotify.music
  const googleUrlMatch = raw.match(/play\.google\.com\/store\/apps\/details\?([^#]+)/i);
  if (googleUrlMatch) {
    try {
      const sp = new URLSearchParams(googleUrlMatch[1]);
      const pkg = sp.get('id');
      if (pkg) {
        return { platform: 'google', id: pkg, country: sp.get('gl') || '' };
      }
    } catch (_) {}
  }

  // 2. Apple App Store URL:
  // e.g. https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
  // e.g. https://itunes.apple.com/app/id324684580
  const appleUrlMatch = raw.match(/(?:apps|itunes)\.apple\.com\/(?:([a-z]{2}(?:-[a-z]{2})?)\/)?(?:app\/[^\/]+\/)?id(\d{7,12})/i);
  if (appleUrlMatch) {
    return { platform: 'apple', id: appleUrlMatch[2], country: appleUrlMatch[1] || '' };
  }

  // 3. Apple App ID format: "id324684580" or pure numbers "324684580" (7-12 digits)
  if (/^id\d{7,12}$/i.test(raw)) {
    return { platform: 'apple', id: raw.replace(/^id/i, ''), country: '' };
  }
  if (/^\d{7,12}$/.test(raw)) {
    return { platform: 'apple', id: raw, country: '' };
  }

  // 4. Android Package Name format: "com.spotify.music", "org.telegram.messenger", "notion.id"
  if (/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]+)+$/.test(raw)) {
    return { platform: 'google', id: raw, country: '' };
  }

  return null;
}

/**
 * Parses raw Google Play HTML to extract Schema.org JSON-LD and screenshots
 * @param {string} html 
 * @param {string} id 
 * @returns {object}
 */
function parseGooglePlayHtml(html, id) {
  if (!html || typeof html !== 'string') return null;

  const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  let ld = {};
  if (ldMatch) {
    try { ld = JSON.parse(ldMatch[1]); } catch (_) {}
  }

  const shotMatches = [...html.matchAll(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"= ]+)[^>]*alt="([^"]*screenshot[^"]*)"/gi)];
  let rawShots = Array.from(new Set(shotMatches.map(x => x[1])));
  if (rawShots.length === 0) {
    const anyImgs = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/g)];
    const uniqueKeys = Array.from(new Set(anyImgs.map(m => m[1])));
    const iconKey = ld.image ? (ld.image.match(/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[1] : null;
    rawShots = uniqueKeys.filter(k => k !== iconKey).slice(0, 8).map(k => 'https://play-lh.googleusercontent.com/' + k);
  }
  const screenshots = rawShots.slice(0, 8).map(u => u.split('=')[0] + '=w1080');

  const rawIcon = ld.image || (html.match(/https:\/\/play-lh\.googleusercontent\.com\/([a-zA-Z0-9_-]+)/) || [])[0] || '';
  const iconBase = rawIcon ? rawIcon.split('=')[0] : '';

  return {
    platform: 'google',
    id: id,
    name: ld.name || '',
    developer: ld.author ? ld.author.name : '',
    description: ld.description || '',
    category: ld.applicationCategory || '',
    rating: ld.aggregateRating && ld.aggregateRating.ratingValue ? parseFloat(ld.aggregateRating.ratingValue).toFixed(1) : '4.5',
    ratingCount: ld.aggregateRating && ld.aggregateRating.ratingCount ? String(ld.aggregateRating.ratingCount) : '1000',
    icon: iconBase ? iconBase + '=s512' : '',
    icon1024: iconBase ? iconBase + '=s1024' : '',
    screenshots: screenshots
  };
}

/**
 * Normalizes Apple App Store API result into Studio state format
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
 * Normalizes Google Play metadata into Studio state format
 * @param {object} data 
 * @returns {object}
 */
function normalizeGoogleApp(data) {
  if (!data) return null;
  const rawName = (data.name || 'App Name').trim();
  let name = rawName;
  let sub = '';

  const splitMatch = rawName.split(/\s*[-–—:]\s*/);
  if (splitMatch.length >= 2 && splitMatch[0].length >= 2) {
    name = splitMatch[0].trim();
    sub = splitMatch.slice(1).join(' · ').trim();
  } else {
    sub = 'Official ' + (data.category || 'Android') + ' App';
  }

  const cleanDesc = (data.description || '').replace(/[\r\n]+/g, ' ').trim();
  const firstSentence = cleanDesc.split(/[.!?]\s+/)[0];
  const shortDesc = (firstSentence && firstSentence.length <= 80) ? firstSentence : cleanDesc.slice(0, 80);

  const ratingStr = data.rating ? parseFloat(data.rating).toFixed(1) : '4.5';
  const ratingCount = data.ratingCount ? parseInt(data.ratingCount, 10) || 1000 : 1000;
  const iconUrl = data.icon1024 || data.icon || '';
  const shots = (data.screenshots || []).slice(0, 8);

  const packageDomain = data.id ? data.id.split('.').slice(1, 3).reverse().join('.') : 'app.com';

  return {
    platform: 'google',
    store: 'google',
    form: {
      name: name,
      sub: sub,
      short: shortDesc || 'Download the latest version on Android.',
      promo: 'Experience ' + name + ' with seamless performance.',
      dev: data.developer || 'App Developer',
      cat: data.category || 'Productivity',
      catApple: data.category || 'Productivity',
      catGoogle: data.category || 'Productivity',
      ver: '2.4.0',
      rdate: (typeof getCurrentMonthDateStr === 'function') ? getCurrentMonthDateStr(2, true) : 'Oct 26, 2026',
      email: 'support@' + packageDomain,
      phone: '+1 800-555-0199',
      addr: 'Global',
      new: 'Performance optimizations, bug fixes, and latest features.',
      desc: (data.description || '').slice(0, 1000)
    },
    icon: iconUrl,
    isCustomIcon: !!iconUrl,
    shots: shots,
    featureGraphic: data.featureGraphic || '',
    stats: {
      rating: ratingStr,
      ratingsCount: ratingCount,
      age: 'Everyone',
      chartRank: '1',
      developer: data.developer || ''
    }
  };
}

/**
 * Fetches Apple App Store data via proxy or direct iTunes API (CORS enabled)
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
 * Fetches Google Play data via Cloudflare Pages Function or CORS fallback
 * @param {string} packageId 
 * @returns {Promise<object>}
 */
async function fetchGoogleAppData(packageId) {
  const query = 'id=' + encodeURIComponent(packageId);
  const proxyUrl = '/api/lookup-google?' + query;

  let data = null;
  const isWeb = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:');

  if (isWeb) {
    try {
      const res = await fetch(proxyUrl);
      if (res.ok) {
        data = await res.json();
      }
    } catch (_) {}
  }

  // Fallback if local proxy or CF function is not available (e.g. running standalone file:// or without CF functions)
  if (!data || data.error) {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=' + encodeURIComponent(packageId) + '&hl=en&gl=us';
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(playStoreUrl);
    try {
      const corsRes = await fetch(corsProxyUrl);
      if (corsRes.ok) {
        const html = await corsRes.text();
        data = parseGooglePlayHtml(html, packageId);
      }
    } catch (_) {}
  }

  if (!data || data.error) {
    throw new Error(data && data.error ? data.error : 'Could not fetch app from Google Play (' + packageId + ')');
  }

  return normalizeGoogleApp(data);
}

/**
 * Unified fetch entrypoint for parsed store target
 * @param {{platform: 'apple' | 'google', id: string, country?: string}} target 
 * @returns {Promise<object>}
 */
async function fetchStoreAppData(target) {
  if (!target || !target.platform || !target.id) {
    throw new Error('Invalid store target');
  }

  if (target.platform === 'apple') {
    return await fetchAppleAppData(target.id, target.country);
  } else if (target.platform === 'google') {
    return await fetchGoogleAppData(target.id);
  }
  throw new Error('Unsupported platform: ' + target.platform);
}

/**
 * Applies imported store app state to Studio, re-renders, and saves draft
 * @param {object} state 
 * @returns {boolean}
 */
function applyImportedStoreApp(state) {
  if (!state) return false;

  // Apply to studio state
  if (typeof applyStateObject === 'function') {
    applyStateObject(state);
  }

  // Switch store if requested and not in dual mode
  const isDual = document.body && document.body.dataset.dual === 'true';
  if (!isDual && state.store && typeof setStore === 'function') {
    setStore(state.store, false);
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
  if (typeof fit === 'function') fit();

  const appName = state.form && state.form.name ? state.form.name : 'App';
  const platformName = state.platform === 'google' ? 'Google Play' : 'App Store';
  if (typeof showToast === 'function') {
    showToast('Imported ' + appName + ' from ' + platformName + ' successfully');
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
    setStoreImportStatus('error', 'Please enter an App Store link, Google Play link, App ID, or package name.');
    input.focus();
    return;
  }

  const target = parseStoreInput(val);
  if (!target) {
    setStoreImportStatus('error', 'Unrecognized link or ID format. Try an App Store URL, Google Play URL, numeric App ID, or Android package name.');
    return;
  }

  const submitBtn = $('storeImportSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Fetching...';
  }

  setStoreImportStatus('info', 'Connecting to ' + (target.platform === 'apple' ? 'Apple App Store' : 'Google Play') + '...');

  try {
    const importedState = await fetchStoreAppData(target);
    applyImportedStoreApp(importedState);
    closeStoreImportModal();
  } catch (err) {
    setStoreImportStatus('error', err.message || 'Failed to import app data.');
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
    const pkg = sp.get('package') || sp.get('google') || sp.get('pkg') || sp.get('android');
    const url = sp.get('url') || sp.get('store_url') || sp.get('link');

    let target = null;
    if (appid) {
      target = parseStoreInput(appid) || { platform: 'apple', id: appid.replace(/^id/i, ''), country: sp.get('country') || '' };
    } else if (pkg) {
      target = parseStoreInput(pkg) || { platform: 'google', id: pkg, country: '' };
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
  window.parseGooglePlayHtml = parseGooglePlayHtml;
  window.normalizeAppleApp = normalizeAppleApp;
  window.normalizeGoogleApp = normalizeGoogleApp;
  window.fetchAppleAppData = fetchAppleAppData;
  window.fetchGoogleAppData = fetchGoogleAppData;
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
    parseGooglePlayHtml,
    normalizeAppleApp,
    normalizeGoogleApp,
    fetchAppleAppData,
    fetchGoogleAppData,
    fetchStoreAppData,
    applyImportedStoreApp
  };
}

if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
  initStoreImportEvents();
}
