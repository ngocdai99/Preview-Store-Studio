// --- LocalStorage & IndexedDB State Management ---
const STORAGE_KEY = 'store_preview_studio_state_v2';
let saveTimer = null;
let restoring = false; // saveState() is a no-op while loadState() is applying saved values
function debouncedSave(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 300);
}

function sanitizeStateForLocalStorage(state){
  if(!state || typeof state !== 'object') return state;
  const isHeavy = v => typeof v === 'string' && v.length > 50000;
  const clean = { ...state, _partial: true };
  if(isHeavy(clean.icon)) delete clean.icon;
  if(isHeavy(clean.featureGraphic)) delete clean.featureGraphic;
  if(Array.isArray(clean.shots)){
    clean.shots = clean.shots.filter(s => !isHeavy(s));
    if(!clean.shots.length) delete clean.shots;
  }
  if(Array.isArray(clean.ipadShots)){
    delete clean.ipadShots;
  }
  if(Array.isArray(clean.tab7Shots)){
    delete clean.tab7Shots;
  }
  if(Array.isArray(clean.tab10Shots)){
    delete clean.tab10Shots;
  }
  return clean;
}

function applyStateObject(s){
  if(!s || typeof s !== 'object') return false;
  if(s.store) setStore(s.store, false);
  if(s.appleDevice) setAppleDevice(s.appleDevice, false);
  else if(document.body) document.body.dataset.appleDevice = appleDevice;
  if(s.ipadOrient === 'portrait' || s.ipadOrient === 'landscape') ipadOrient = s.ipadOrient;
  if((s.iphoneOrient === 'portrait' || s.iphoneOrient === 'landscape') && typeof iphoneOrient !== 'undefined') iphoneOrient = s.iphoneOrient;
  if((s.phoneOrient === 'portrait' || s.phoneOrient === 'landscape') && typeof phoneOrient !== 'undefined') phoneOrient = s.phoneOrient;
  if(s.theme && $$('.phone').length) (typeof setDeviceTheme === 'function' ? setDeviceTheme(s.theme, false) : $$('.phone').forEach(p => p.dataset.theme = s.theme));
  if(typeof s.isFloating === 'boolean'){
    isFloating = s.isFloating;
    $$('.dev').forEach(d => d.classList.toggle('floating', isFloating));
    if($('btnFloat')) $('btnFloat').classList.toggle('active', isFloating);
  }
  if(s.form){
    if(s.form.name !== undefined && $('f-name')) $('f-name').value = s.form.name;
    if(s.form.sub !== undefined && $('f-sub')) $('f-sub').value = s.form.sub;
    if(s.form.promo !== undefined && $('f-promo')) $('f-promo').value = s.form.promo;
    if(s.form.short !== undefined && $('f-short')) $('f-short').value = s.form.short;
    if(s.form.dev !== undefined && $('f-dev')) $('f-dev').value = s.form.dev;
    if(s.form.cat !== undefined) setCategory(s.form.cat);
    if(s.form.catApple !== undefined) setCategory(s.form.catApple, 'apple');
    if(s.form.catGoogle !== undefined) setCategory(s.form.catGoogle, 'google');
    if(s.form.keywords !== undefined && $('f-keywords')) $('f-keywords').value = s.form.keywords;
    if(s.form.ver !== undefined && $('f-ver')) $('f-ver').value = s.form.ver;
    if(s.form.rdate !== undefined && $('f-rdate')) $('f-rdate').value = s.form.rdate;
    if(s.form.email !== undefined && $('f-email')) $('f-email').value = s.form.email;
    if(s.form.phone !== undefined && $('f-phone')) $('f-phone').value = s.form.phone;
    if(s.form.addr !== undefined && $('f-addr')) $('f-addr').value = s.form.addr;
    if(s.form.privLinked !== undefined) {
      if($('f-priv-linked')) $('f-priv-linked').value = s.form.privLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = s.form.privLinked;
    }
    if(s.form.privNotLinked !== undefined) {
      if($('f-priv-notlinked')) $('f-priv-notlinked').value = s.form.privNotLinked;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = s.form.privNotLinked;
    }
    if(s.form.privGoogle !== undefined) {
      if($('f-priv-google')) $('f-priv-google').value = s.form.privGoogle;
      if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = s.form.privGoogle;
    }
    if(s.form.new !== undefined && $('f-new')) $('f-new').value = s.form.new;
    if(s.form.desc !== undefined && $('f-desc')) $('f-desc').value = s.form.desc;
  }
  if(s.icon){
    if(s.icon === BLANK_ICON || s.icon.includes('studioBg') || s.icon.includes('stdBg') || s.icon.includes('c6-bg')){
      ICON = BLANK_ICON;
    } else {
      ICON = s.icon;
    }
  }
  if(s.featureGraphic) FEATURE_GRAPHIC = s.featureGraphic;
  if(Array.isArray(s.shots) && (s.shots.length || !s._partial)) SHOTS = s.shots;
  if(typeof s.supportsIpad === 'boolean' && typeof setSupportsIpad === 'function') setSupportsIpad(s.supportsIpad);
  if(Array.isArray(s.ipadShots)){
    IPAD_SHOTS = s.ipadShots.filter(x => typeof x === 'string');
    if(typeof renderIpadShots === 'function') renderIpadShots();
  }
  if(s.ipadFitMode === 'cover' || s.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = s.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(s.googleDevice === 'tab7' || s.googleDevice === 'tab10' || s.googleDevice === 'phone') googleDevice = s.googleDevice;
  if(s.tabOrient){
    ['tab7', 'tab10'].forEach(k => { if(s.tabOrient[k] === 'portrait' || s.tabOrient[k] === 'landscape') tabOrient[k] = s.tabOrient[k]; });
  }
  if(Array.isArray(s.tab7Shots) && typeof makeTabItem === 'function') TABS.tab7 = s.tab7Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.tab10Shots) && typeof makeTabItem === 'function') TABS.tab10 = s.tab10Shots.slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(s.reviews)) {
    REVIEWS = s.reviews;
    if(typeof renderReviews === 'function') renderReviews();
  }
  if(typeof applyStatsFromObject === 'function') applyStatsFromObject(s.stats);
  return true;
}

function saveState(){
  if(restoring) return;
  const state = {
    store,
    appleDevice,
    ipadOrient,
    iphoneOrient: typeof iphoneOrient !== 'undefined' ? iphoneOrient : 'portrait',
    phoneOrient: typeof phoneOrient !== 'undefined' ? phoneOrient : 'portrait',
    theme: document.querySelector('.phone') ? (document.querySelector('.phone').dataset.theme || 'light') : 'light',
    isFloating,
    form: {
      name: $('f-name') ? $('f-name').value : '',
      sub: $('f-sub') ? $('f-sub').value : '',
      promo: $('f-promo') ? $('f-promo').value : '',
      short: $('f-short') ? $('f-short').value : '',
      dev: $('f-dev') ? $('f-dev').value : '',
      cat: $('f-cat') ? $('f-cat').value : '',
      catApple: CAT.apple,
      catGoogle: CAT.google,
      keywords: $('f-keywords') ? $('f-keywords').value : '',
      ver: $('f-ver') ? $('f-ver').value : '2.4.0',
      rdate: $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true),
      email: $('f-email') ? $('f-email').value : 'support@flowcraft.studio',
      phone: $('f-phone') ? $('f-phone').value : '+1 800-555-0199',
      addr: $('f-addr') ? $('f-addr').value : 'Vietnam',
      privLinked: $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : ''),
      privNotLinked: $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : ''),
      privGoogle: $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : ''),
      new: $('f-new') ? $('f-new').value : '',
      desc: $('f-desc') ? $('f-desc').value : ''
    },
    icon: ICON,
    featureGraphic: FEATURE_GRAPHIC,
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    googleDevice,
    tabOrient,
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    reviews: REVIEWS,
    stats: (typeof statsToObject === 'function') ? statsToObject() : {}
  };

  // 1. Asynchronously persist complete state to IndexedDB (virtually unlimited quota for high-res images)
  let idbPromise = null;
  if(typeof idbSave === 'function'){
    idbPromise = idbSave(STORAGE_KEY, state);
  }

  // 2. Try saving to localStorage
  let lsOk = false;
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lsOk = true;
  }catch(e){
    // Quota exceeded (typically caused by 2048x2732 base64 screenshots)
    try{
      const sanitized = sanitizeStateForLocalStorage(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      lsOk = true;
    }catch(err2){
      lsOk = false;
    }
  }

  // If localStorage succeeded with sanitized or full state, no toast is needed because IndexedDB holds full state.
  // Only show warning if BOTH stores failed.
  if(!lsOk){
    if(idbPromise){
      idbPromise.then(ok => {
        if(!ok){
          console.warn('Storage limit reached on both LocalStorage and IndexedDB');
          showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
        }
      }).catch(() => {
        showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
      });
    } else {
      showToast('Storage quota exceeded! Export JSON to save your work.', 'warn', 4000);
    }
  }
}

function loadState(){
  restoring = true;
  let loadedFromLs = false;
  try{
    if(typeof localStorage !== 'undefined'){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const s = JSON.parse(raw);
        loadedFromLs = applyStateObject(s);
      }
    }
  }catch(e){
    console.warn('Failed to parse saved state from localStorage', e);
  }finally{
    restoring = false;
  }

  // Asynchronously hydrate complete state from IndexedDB (restoring high-res screenshots)
  if(typeof idbGet === 'function'){
    idbGet(STORAGE_KEY).then(idbState => {
      if(idbState && typeof idbState === 'object'){
        restoring = true;
        try{
          applyStateObject(idbState);
          if(typeof renderIcons === 'function') renderIcons();
          if(typeof renderFeature === 'function') renderFeature();
          if(typeof renderShots === 'function') renderShots();
          if(typeof renderIpadShots === 'function') renderIpadShots();
          if(typeof renderTablets === 'function') renderTablets();
          if(typeof syncStatInputs === 'function') syncStatInputs();
          if(typeof renderStats === 'function') renderStats();
          if(typeof applyGoogleDevice === 'function') applyGoogleDevice();
          if(typeof applyIpadOrient === 'function') applyIpadOrient();
          if(typeof applyIphoneOrient === 'function') applyIphoneOrient();
          if(typeof applyGooglePhoneOrient === 'function') applyGooglePhoneOrient();
          if(typeof applyTabOrient === 'function') applyTabOrient();
          if(typeof update === 'function') update();
          if(typeof fit === 'function') fit();
          if(typeof syncAllVtPills === 'function') syncAllVtPills();
        }finally{
          restoring = false;
        }
      }
    }).catch(err => {
      console.warn('IndexedDB hydration notice', err);
    });
  }

  return loadedFromLs;
}

// --- 1-Click Copy All Text ---
$('btnCopyText').onclick = copyAllText;
function copyAllText(){
  const name = $('f-name').value;
  const sub = $('f-sub').value;
  const promo = $('f-promo').value;
  const short = $('f-short').value;
  const dev = $('f-dev').value;
  const cat = 'App Store: ' + (CAT.apple || '-') + '  |  Google Play: ' + (CAT.google || '-');
  const kw = $('f-keywords').value;
  const ver = $('f-ver') ? $('f-ver').value : '2.4.0';
  const rdate = $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true);
  const email = $('f-email') ? $('f-email').value : '';
  const addr = $('f-addr') ? $('f-addr').value : '';
  const privLinked = $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : '');
  const privNotLinked = $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : '');
  const privGoogle = $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : '');
  const wn = $('f-new').value;
  const desc = $('f-desc').value;
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || GOOGLE_AGE_MAP['4+'];
  const iapLabels = {
    iap: 'In-App Purchases (No Ads)',
    ads_iap: 'Contains Ads · In-App Purchases',
    ads: 'Contains Ads Only',
    free: 'None (100% Free / Paid Upfront)'
  };
  const iapText = iapLabels[STATS.iap || 'iap'] || iapLabels.iap;

  const text = `=====================================================
STORE LISTING METADATA (${name})
Exported via Store Preview Studio · Client-Side Zero Server
=====================================================

APP TITLE (30 chars max):
${name} [${countChars(name)}/30]

DEVELOPER / ORGANIZATION:
${dev}${email ? ' (' + email + ')' : ''}${addr ? ' · ' + addr : ''}

CATEGORY:
${cat}

VERSION & RELEASE DATE:
v${ver} · ${rdate}

AGE RATING & MONETIZATION:
App Store: ${ageVal} | Google Play: ${gAge.badge} (${gAge.label})
Monetization Badge: ${iapText}

-----------------------------------------------------
APPLE APP STORE (iOS)
-----------------------------------------------------
SUBTITLE (30 chars max):
${sub} [${countChars(sub)}/30]

PROMOTIONAL TEXT (170 chars max):
${promo} [${countChars(promo)}/170]

KEYWORDS (100 chars max):
${kw} [${countChars(kw)}/100]

APP PRIVACY (Data Linked to You):
${privLinked || 'None'}

APP PRIVACY (Data Not Linked to You):
${privNotLinked || 'None'}

-----------------------------------------------------
GOOGLE PLAY STORE (Android)
-----------------------------------------------------
SHORT DESCRIPTION (80 chars max):
${short} [${countChars(short)}/80]

DATA SAFETY PRACTICES:
${privGoogle || 'None'}

-----------------------------------------------------
SHARED METADATA
-----------------------------------------------------
WHAT'S NEW / RELEASE NOTES:
${wn}

FULL DESCRIPTION:
${desc}
=====================================================`;

  navigator.clipboard.writeText(text).then(()=>{
    showToast('Metadata copied to clipboard!','📋');
  }).catch(()=>{
    showToast('Clipboard access denied, check permissions','warn');
  });
}

// --- Export Markdown (LISTING_METADATA.md) ---
if($('optExportIcon')) $('optExportIcon').onclick = () => downloadAppIcon();
if($('optExportIpadShots')) $('optExportIpadShots').onclick = () => {
  if(typeof downloadAllIpadScreenshots === 'function') downloadAllIpadScreenshots();
};
if($('optExportPhoneShots')) $('optExportPhoneShots').onclick = () => {
  if(typeof downloadAllPhoneScreenshots === 'function') downloadAllPhoneScreenshots();
};
if($('optExportTab7Shots')) $('optExportTab7Shots').onclick = () => {
  if(typeof downloadAllTab7Screenshots === 'function') downloadAllTab7Screenshots();
};
if($('optExportTab10Shots')) $('optExportTab10Shots').onclick = () => {
  if(typeof downloadAllTab10Screenshots === 'function') downloadAllTab10Screenshots();
};
if($('optExportAllTablets')) $('optExportAllTablets').onclick = () => {
  if(typeof downloadAllTabletsScreenshots === 'function') downloadAllTabletsScreenshots();
};
if($('optExportGooglePlayBundle')) $('optExportGooglePlayBundle').onclick = () => {
  if(typeof downloadAllGooglePlayBundle === 'function') downloadAllGooglePlayBundle();
};
$('optExportMD').onclick = exportMarkdown;
function exportMarkdown(){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;

  function safeFence(text, lang='text'){
    let fence = '```';
    while((text||'').includes(fence)){
      fence += '`';
    }
    return fence + lang + '\n' + (text||'') + '\n' + fence;
  }

  const name = $('f-name').value;
  const sub = $('f-sub').value;
  const promo = $('f-promo').value;
  const short = $('f-short').value;
  const dev = $('f-dev').value;
  const cat = CAT.apple || '-';
  const catG = CAT.google || '-';
  const kw = $('f-keywords').value;
  const ver = $('f-ver') ? $('f-ver').value : '2.4.0';
  const rdate = $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true);
  const email = $('f-email') ? $('f-email').value : '-';
  const addr = $('f-addr') ? $('f-addr').value : '-';
  const privLinked = $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.linked || 'None') : 'None');
  const privNotLinked = $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.notLinked || 'None') : 'None');
  const privGoogle = $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? (CURRENT_PRIVACY.google || 'None') : 'None');
  const wn = $('f-new').value;
  const desc = $('f-desc').value;
  const ageVal = STATS.age || '4+';
  const gAge = GOOGLE_AGE_MAP[ageVal] || GOOGLE_AGE_MAP['4+'];
  const iapLabels = {
    iap: 'In-App Purchases (No Ads)',
    ads_iap: 'Contains Ads · In-App Purchases',
    ads: 'Contains Ads Only',
    free: 'None (100% Free / Paid Upfront)'
  };
  const iapText = iapLabels[STATS.iap || 'iap'] || iapLabels.iap;

  const validCount = SHOTS.filter(s=>s && s.trim()).length;
  const isShotCompliant = validCount >= 2 && validCount <= 8;

  const md = `# Store Listing Metadata: ${name}

> Generated by **Store Preview Studio** on ${new Date().toLocaleDateString()}
> Zero-server client-side validation report.

---

## Character Limits & Compliance Summary

| Field | Target Store | Official Limit | Current Length | Status |
| :--- | :--- | :--- | :--- | :--- |
| **App Title** | Both | 30 chars | ${countChars(name)} | ${countChars(name) <= 30 ? 'PASS' : 'EXCEEDED'} |
| **Subtitle** | App Store | 30 chars | ${countChars(sub)} | ${countChars(sub) <= 30 ? 'PASS' : 'EXCEEDED'} |
| **Promotional Text** | App Store | 170 chars | ${countChars(promo)} | ${countChars(promo) <= 170 ? 'PASS' : 'EXCEEDED'} |
| **Keywords** | App Store | 100 chars | ${countChars(kw)} | ${countChars(kw) <= 100 ? 'PASS' : 'EXCEEDED'} |
| **Short Description** | Google Play | 80 chars | ${countChars(short)} | ${countChars(short) <= 80 ? 'PASS' : 'EXCEEDED'} |
| **Full Description** | Both | 4,000 chars | ${countChars(desc)} | ${countChars(desc) <= 4000 ? 'PASS' : 'EXCEEDED'} |

---

## Graphic Assets Checklist (Google Play & Apple App Store)

| Asset | Target Platform | Specification | Store Requirement | Current Status |
| :--- | :--- | :--- | :--- | :--- |
| **App Icon (Google Play)** | Google Play | PNG/JPEG, up to 1 MB, 512 × 512 px | **Mandatory** | ${ICON ? 'Ready' : 'Missing'} |
| **App Icon (Apple)** | App Store | PNG/JPEG, 1024 × 1024 px (sRGB/P3, no alpha) | **Mandatory** | ${ICON ? 'Ready' : 'Missing'} |
| **Feature Graphic** | Google Play | PNG/JPEG, up to 15 MB, 1,024 × 500 px | **Mandatory for Featuring** | ${FEATURE_GRAPHIC ? 'Ready' : 'Missing'} |
| **Phone Screenshots** | Google Play | PNG/JPEG, up to 8 MB each, 16:9 or 9:16 (320px–3,840px) | **2 to 8 Screenshots** | ${isShotCompliant ? `PASS (${validCount} screenshots)` : `REJECT RISK (${validCount} screenshots - requires 2 to 8)`} |
| **7-inch Tablet Screenshots** | Google Play | PNG/JPEG, up to 8 MB each, 16:9 or 9:16 (320px–3,840px per side) | **Up to 8 screenshots** | ${tabStatus('tab7')} |
| **10-inch Tablet Screenshots** | Google Play | PNG/JPEG, up to 8 MB each, 16:9 or 9:16 (1,080px–7,680px per side) | **Up to 8 screenshots** | ${tabStatus('tab10')} |

---

## App Privacy, Data Safety & Store Badges

* **Version & Release Date:** \`v${ver}\` (${rdate})
* **Age Rating:** App Store \`${ageVal}\` | Google Play \`${gAge.badge} (${gAge.label})\`
* **Monetization / IAP Badge:** \`${iapText}\`
* **Apple Privacy — Data Linked to You:** ${privLinked}
* **Apple Privacy — Data Not Linked to You:** ${privNotLinked}
* **Google Play — Data Safety Practices:** ${privGoogle}
* **Developer Support Contact:** \`${email}\` (${addr})

---

## Apple App Store Metadata

### Title
${safeFence(name)}

### Subtitle
${safeFence(sub)}

### Promotional Text
${safeFence(promo)}

### Keywords (ASO)
${safeFence(kw)}

### Category
* **Primary:** \`${cat}\`
* **Developer:** \`${dev}\`

---

## Google Play Store Metadata

### Category
\`${catG}\`

### Title
${safeFence(name)}

### Short Description
${safeFence(short)}

### Full Description
${safeFence(desc)}

---

## Release Notes (What's New)
${safeFence(wn)}

---

## 🛠 Fastlane CLI Mapping Cheat-Sheet
- \`fastlane/metadata/android/en-US/title.txt\` ➔ App Title
- \`fastlane/metadata/android/en-US/short_description.txt\` ➔ Short Description
- \`fastlane/metadata/android/en-US/full_description.txt\` ➔ Full Description
- \`fastlane/metadata/ios/en-US/name.txt\` ➔ App Title
- \`fastlane/metadata/ios/en-US/subtitle.txt\` ➔ Subtitle
- \`fastlane/metadata/ios/en-US/promotional_text.txt\` ➔ Promotional Text
- \`fastlane/metadata/ios/en-US/keywords.txt\` ➔ Keywords
- \`fastlane/metadata/ios/en-US/description.txt\` ➔ Full Description
`;

  downloadFile('LISTING_METADATA.md', md, 'text/markdown');
  showToast('Downloaded LISTING_METADATA.md!','📄');
}

// --- Export & Import JSON Config ---
$('optExportJSON').onclick = exportJSON;
function exportJSON(){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  const config = {
    generator: "Store Preview Studio",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
    store,
    theme: document.querySelector('.phone').dataset.theme || 'light',
    form: {
      name: $('f-name').value,
      sub: $('f-sub').value,
      promo: $('f-promo').value,
      short: $('f-short').value,
      dev: $('f-dev').value,
      cat: $('f-cat').value,
      catApple: CAT.apple,
      catGoogle: CAT.google,
      keywords: $('f-keywords').value,
      ver: $('f-ver') ? $('f-ver').value : '2.4.0',
      rdate: $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true),
      email: $('f-email') ? $('f-email').value : '',
      addr: $('f-addr') ? $('f-addr').value : '',
      privLinked: $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : ''),
      privNotLinked: $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : ''),
      privGoogle: $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : ''),
      new: $('f-new').value,
      desc: $('f-desc').value
    },
    icon: ICON,
    featureGraphic: FEATURE_GRAPHIC,
    shots: SHOTS,
    supportsIpad: SUPPORTS_IPAD,
    ipadShots: IPAD_SHOTS,
    ipadFitMode: IPAD_FIT_MODE || 'cover',
    tab7Shots: TABS.tab7.map(i => i.src),
    tab10Shots: TABS.tab10.map(i => i.src),
    stats: statsToObject()
  };
  const jsonStr = JSON.stringify(config, null, 2);
  const rawName = ($('f-name').value || '').trim();
  let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if(!slug) slug = 'app';
  downloadFile(`${slug}-store-config.json`, jsonStr, 'application/json');
  showToast('Exported store configuration JSON!','💾');
}

// --- Smart & Fault-Tolerant JSON Import Parser ---
function parseAndApplyJSON(jsonString){
  if(typeof jsonString === 'string'){
    // Strip UTF-8 BOM if present
    if(jsonString.charCodeAt(0) === 0xFEFF){
      jsonString = jsonString.slice(1);
    }
  }

  let data;
  try{
    data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  }catch(err){
    showToast('Invalid JSON file format (Syntax Error)','warn');
    return false;
  }

  if(!data || typeof data !== 'object' || Array.isArray(data)){
    showToast('Invalid file: JSON root must be an object','warn');
    return false;
  }

  // Reject unrelated JSON schemas like package.json or library manifests
  if(!data.form && !data.app && (data.main || data.scripts || (data.version && data.main) || data.dependencies || data.devDependencies)){
    showToast('File does not contain valid App Listing metadata','warn');
    return false;
  }

  const isKnownGenerator = data.generator === 'Store Preview Studio';
  const hasAppWrapper = (data.form && typeof data.form === 'object') || (data.app && typeof data.app === 'object');
  const hasStoreKeys = !!(data.store || data.shots || data.tab7Shots || data.tab10Shots || data.icon || data.featureGraphic || data.feature);

  // Extract source object whether it uses "form", "app", or flat root properties
  const src = (data.form && typeof data.form === 'object') ? data.form : ((data.app && typeof data.app === 'object') ? data.app : data);

  // Validate fields and safely discard wrong types (objects, arrays, numbers)
  let hadWrongTypes = false;
  const getStr = val => {
    if(val === undefined || val === null) return '';
    if(typeof val === 'string') return val;
    hadWrongTypes = true;
    return '';
  };

  const mapped = {
    name: getStr(src.name || src.title || src.appName),
    sub: getStr(src.sub || src.subtitle),
    promo: getStr(src.promo || src.promotionalText || src.promoText),
    short: getStr(src.short || src.shortDesc || src.shortDescription),
    dev: getStr(src.dev || src.developer || src.developerName || src.author),
    cat: getStr(src.cat || src.category),
    keywords: getStr(src.keywords || src.keywordsList),
    ver: getStr(src.ver || src.appVersion),
    rdate: getStr(src.rdate || src.releaseDate),
    email: getStr(src.email || src.supportEmail),
    addr: getStr(src.addr || src.address || src.location),
    privLinked: getStr(src.privLinked),
    privNotLinked: getStr(src.privNotLinked),
    privGoogle: getStr(src.privGoogle),
    new: getStr(src.new || src.whatsNew || src.releaseNotes || src.changelog),
    desc: getStr(src.desc || src.description || src.fullDescription)
  };

  const hasMobileSpecificFields = !!(mapped.sub || mapped.promo || mapped.short || mapped.keywords || src.catApple || src.catGoogle);

  // Strict Schema Check: Reject generic flat JSON files that lack Store Preview Studio schema or mobile fields
  if(!isKnownGenerator && !hasAppWrapper && !hasStoreKeys && !hasMobileSpecificFields){
    showToast('Unrecognized format: Missing Store Preview Studio schema or listing fields','warn');
    return false;
  }

  // Check if at least one meaningful app listing field exists
  const hasFields = Object.values(mapped).some(v => v.trim().length > 0);
  if(!hasFields && !data.icon && !Array.isArray(data.shots)){
    showToast('File does not contain valid App Listing metadata','warn');
    return false;
  }

  // Safely populate available fields without erasing existing ones if absent
  if(mapped.name) $('f-name').value = mapped.name;
  if(mapped.sub) $('f-sub').value = mapped.sub;
  if(mapped.promo) $('f-promo').value = mapped.promo;
  if(mapped.short) $('f-short').value = mapped.short;
  if(mapped.dev) $('f-dev').value = mapped.dev;
  if(mapped.cat) setCategory(mapped.cat);
  if(src.catApple && typeof src.catApple === 'string') setCategory(src.catApple, 'apple');
  if(src.catGoogle && typeof src.catGoogle === 'string') setCategory(src.catGoogle, 'google');
  if(mapped.keywords) $('f-keywords').value = mapped.keywords;
  if(mapped.ver && $('f-ver')) $('f-ver').value = mapped.ver;
  if(mapped.rdate && $('f-rdate')) $('f-rdate').value = mapped.rdate;
  if(mapped.email && $('f-email')) $('f-email').value = mapped.email;
  if(mapped.addr && $('f-addr')) $('f-addr').value = mapped.addr;
  if(mapped.privLinked) {
    if($('f-priv-linked')) $('f-priv-linked').value = mapped.privLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.linked = mapped.privLinked;
  }
  if(mapped.privNotLinked) {
    if($('f-priv-notlinked')) $('f-priv-notlinked').value = mapped.privNotLinked;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.notLinked = mapped.privNotLinked;
  }
  if(mapped.privGoogle) {
    if($('f-priv-google')) $('f-priv-google').value = mapped.privGoogle;
    if(typeof CURRENT_PRIVACY !== 'undefined') CURRENT_PRIVACY.google = mapped.privGoogle;
  }
  if(mapped.new) $('f-new').value = mapped.new;
  if(mapped.desc) $('f-desc').value = mapped.desc;

  if(data.icon && typeof data.icon === 'string') ICON = data.icon;
  if(data.featureGraphic && typeof data.featureGraphic === 'string') FEATURE_GRAPHIC = data.featureGraphic;
  else if(data.feature && typeof data.feature === 'string') FEATURE_GRAPHIC = data.feature;

  if(Array.isArray(data.shots)){
    const cleanShots = data.shots.filter(x => typeof x === 'string' && x.trim().length > 0);
    if(cleanShots.length > 0) SHOTS = cleanShots;
  }
  if(Array.isArray(data.tab7Shots)) TABS.tab7 = data.tab7Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(Array.isArray(data.tab10Shots)) TABS.tab10 = data.tab10Shots.filter(x => typeof x === 'string').slice(0, MAX_TAB).map(makeTabItem);
  if(data.store && (data.store === 'apple' || data.store === 'google')) setStore(data.store);
  if(data.theme && (data.theme === 'light' || data.theme === 'dark')){
    if(typeof setDeviceTheme === 'function') setDeviceTheme(data.theme, false);
    else $$('.phone').forEach(p => p.dataset.theme = data.theme);
  }
  if(data.stats){ applyStatsFromObject(data.stats); syncStatInputs(); renderStats(); }

  if(typeof data.supportsIpad === 'boolean') setSupportsIpad(data.supportsIpad);
  if(data.ipadFitMode === 'cover' || data.ipadFitMode === 'contain'){
    IPAD_FIT_MODE = data.ipadFitMode;
    if($('f-ipad-fit-mode')) $('f-ipad-fit-mode').value = IPAD_FIT_MODE;
  }
  if(Array.isArray(data.ipadShots)){
    IPAD_SHOTS = data.ipadShots.filter(x => typeof x === 'string');
  }

  renderIcons();
  renderFeature();
  renderShots();
  renderIpadShots();
  renderTablets();
  update();
  saveState();

  if(hadWrongTypes){
    showToast('Imported config (Note: invalid non-string fields were ignored)','warn', 3500);
  } else {
    showToast('Configuration imported successfully!','📂');
  }
  return true;
}

$('optImportJSON').onclick = () => { if(typeof canUpload === 'function' && !canUpload(1000)) return; $('jsonFileInput').click(); };
$('jsonFileInput').onchange = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    parseAndApplyJSON(reader.result);
  };
  reader.readAsText(file);
  e.target.value = '';
};

// Drag & Drop JSON anywhere onto the page
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if(!file) return;
  if(file.name.toLowerCase().endsWith('.json')){
    const reader = new FileReader();
    reader.onload = () => {
      parseAndApplyJSON(reader.result);
    };
    reader.readAsText(file);
  } else if (!e.target.closest('#icoDropZone') && !e.target.closest('#featureDropZone') && !e.target.closest('#shotDropZone') && !e.target.closest('#ipadDropZone') && !e.target.closest('#bundleDropZone') && !e.target.closest('.drop-zone') && !e.target.closest('.sl') && !e.target.closest('.tabsec')) {
    showToast('Unsupported file type. Please drop a .json configuration file.','warn');
  }
});

// Reset to Default State
$('optResetDefault').onclick = () => {
  if(confirm('Are you sure you want to reset all inputs to the default template?')){
    localStorage.removeItem(STORAGE_KEY);
    if(typeof idbDelete === 'function') idbDelete(STORAGE_KEY);
    resetStats();
    loadPreset('taskflow');
  }
};

// --- Export PNG via html2canvas (with frame, or screen only) ---
if($('optExportPNG')) $('optExportPNG').onclick = () => exportPNG(2);
const optExport3x = $('optExportPNG3x');
if(optExport3x) optExport3x.onclick = () => exportPNG(3);
const optExportScreen = $('optExportScreen');
if(optExportScreen) optExportScreen.onclick = () => exportPNG(3, {frameless:true});

// html2canvas can drop parts of SVG images (filters, glow). Rasterize SVG data-URI images to PNG first,
// swap them in for the capture, and return a function that puts the originals back.
async function rasterizeSvgImages(root, scale){
  const swaps = [];
  const imgs = [...root.querySelectorAll('img')].filter(i => /^data:image\/svg\+xml/i.test(i.currentSrc || i.src || ''));
  await Promise.all(imgs.map(async img => {
    try{
      const box = img.getBoundingClientRect();
      if(!box.width || !box.height) return;
      const original = img.src;
      let svgText = '';
      const commaIdx = original.indexOf(',');
      if(commaIdx !== -1){
        const header = original.slice(0, commaIdx);
        const body = original.slice(commaIdx + 1);
        if(typeof decodeSvgDataUri === 'function'){
          svgText = decodeSvgDataUri(body, /;base64/i.test(header)) || '';
        }else{
          try{ svgText = decodeURIComponent(body); }catch(_){}
        }
      }
      const vb = svgText.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/);
      const vw = vb ? parseFloat(vb[1]) : box.width, vh = vb ? parseFloat(vb[2]) : box.height;
      const tmp = new Image();
      const safeSrc = typeof ensureSvgDimensions === 'function' ? ensureSvgDimensions(original) : original;
      await new Promise((res, rej) => { tmp.onload = res; tmp.onerror = rej; tmp.src = safeSrc; });
      // 1) draw the vector at its own aspect ratio
      const k = Math.max(box.width * scale / vw, box.height * scale / vh);
      const sw = Math.max(1, Math.round(vw * k)), sh = Math.max(1, Math.round(vh * k));
      const c1 = document.createElement('canvas'); c1.width = sw; c1.height = sh;
      c1.getContext('2d').drawImage(tmp, 0, 0, sw, sh);
      // 2) crop to the element box like object-fit: cover
      const w = Math.max(1, Math.round(box.width * scale)), h = Math.max(1, Math.round(box.height * scale));
      const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
      const f = Math.max(w / sw, h / sh);
      const dw = sw * f, dh = sh * f;
      c2.getContext('2d').drawImage(c1, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const png = c2.toDataURL('image/png');
      swaps.push([img, original]);
      img.src = png;
      if(img.decode) await img.decode().catch(() => {});
    }catch(err){ /* keep the original image if anything fails */ }
  }));
  return () => swaps.forEach(([img, original]) => { img.src = original; });
}

function addMockupNote(canvas, scaleFactor){
  const pad = Math.round(34 * scaleFactor);
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height + pad;
  const ctx = out.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  const text = 'Illustrative mockup — not live store data';
  let size = 11 * scaleFactor;
  const family = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.font = `600 ${size}px ${family}`;
  while(ctx.measureText(text).width > out.width * 0.92 && size > 6 * scaleFactor){
    size -= 0.5; ctx.font = `600 ${size}px ${family}`;
  }
  ctx.fillStyle = 'rgba(128,132,142,.95)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, out.width / 2, canvas.height + pad / 2);
  return out;
}

async function exportPNG(scaleFactor = 2, opts = {}){
  if(typeof canDownload === 'function' && !canDownload(1000)) return;
  if(typeof scaleFactor !== 'number') scaleFactor = 3;
  if(typeof html2canvas === 'undefined'){
    showToast('Mockup generator library is still loading. Please try again in a few seconds.', '⏳', 3500);
    return;
  }

  let devToCapture;
  let devSlug = store;
  if(store === 'apple'){
    if(appleDevice === 'ipad'){
      devToCapture = document.querySelector('.dev.ipad');
      devSlug = 'apple-ipad-pro';
    }else{
      devToCapture = document.querySelector('.dev.apple.single');
      devSlug = 'apple-iphone';
    }
  }else if(googleDevice !== 'phone'){
    devToCapture = $('dev-' + googleDevice);
    devSlug = googleDevice === 'tab7' ? 'google-play-7-inch-tablet' : 'google-play-10-inch-tablet';
  }else{
    devToCapture = document.querySelector('.dev.google');
    devSlug = 'google-play-phone';
  }

  if(!devToCapture) return;

  // Screen only: capture the inner screen (.phone) instead of the whole device frame
  const target = opts.frameless ? (devToCapture.querySelector('.phone') || devToCapture) : devToCapture;

  showToast(`Rendering ${scaleFactor}x PNG${opts.frameless ? ' (screen only)' : ''}...`,'⏳', 4000);

  // Lock fit() and temporarily reset zoom & animations so html2canvas measures unzoomed 1:1 layout
  isExporting = true;
  if(typeof clearDevTransitions === 'function') clearDevTransitions();
  const prevZoom = devToCapture.style.zoom;
  const hadFloat = devToCapture.classList.contains('floating');
  devToCapture.style.zoom = '1';
  devToCapture.classList.remove('floating', 'dev-enter', 'dev-exit');
  void devToCapture.offsetHeight; // Force synchronous reflow before measuring bounding rects

  let restoreImages = () => {};
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready.catch(() => {});
    }
    restoreImages = await rasterizeSvgImages(target, scaleFactor);
    devToCapture.style.zoom = '1';
    void devToCapture.offsetHeight;

    const w = target.offsetWidth;
    const h = target.offsetHeight;

    let canvas = await html2canvas(target, {
      backgroundColor: null,
      scale: scaleFactor,
      width: w,
      height: h,
      windowWidth: Math.max(document.documentElement.clientWidth, w + 120),
      windowHeight: Math.max(document.documentElement.clientHeight, h + 120),
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc, clonedEl) => {
        clonedEl.style.zoom = '1';
        clonedEl.style.transform = 'none';
        clonedEl.style.animation = 'none';
        clonedEl.style.transition = 'none';
        clonedDoc.querySelectorAll('.dev').forEach(d => {
          d.classList.remove('floating', 'dev-enter', 'dev-exit', ...(typeof ALL_TRANS_CLASSES !== 'undefined' ? ALL_TRANS_CLASSES : []));
          d.style.zoom = '1';
          d.style.animation = 'none';
          d.style.transition = 'none';
        });
        // Prevent html2canvas from splitting words into per-character fillText calls when letter-spacing != 0
        clonedEl.querySelectorAll('*').forEach(el => {
          el.style.letterSpacing = '0px';
        });
      }
    });
    if(EXPORT_WM) canvas = addMockupNote(canvas, scaleFactor);

    const rawName = ($('f-name').value || '').trim();
    let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if(!slug) slug = 'app';
    const link = document.createElement('a');
    link.download = `${slug}-${devSlug}-${opts.frameless ? 'screen' : 'preview'}-${scaleFactor}x.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`PNG (${scaleFactor}x${opts.frameless ? ', screen only' : ''}) downloaded!`,'📸');
  }catch(err){
    console.error('Export PNG failed:', err);
    showToast('Failed to generate image: ' + err.message, 'warn', 4000);
  }finally{
    restoreImages();
    isExporting = false;
    devToCapture.style.zoom = prevZoom;
    fit();
    if(hadFloat && isFloating) devToCapture.classList.add('floating');
  }
}

// Download helper
function downloadFile(filename, content, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

