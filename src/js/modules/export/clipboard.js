// Store Preview Studio - 1-Click Clipboard Export
if($('btnCopyText')) $('btnCopyText').onclick = copyAllText;

function copyAllText(){
  const name = $('f-name') ? $('f-name').value : '';
  const sub = $('f-sub') ? $('f-sub').value : '';
  const promo = $('f-promo') ? $('f-promo').value : '';
  const short = $('f-short') ? $('f-short').value : '';
  const dev = $('f-dev') ? $('f-dev').value : '';
  const cat = 'App Store: ' + (CAT.apple || '-') + '  |  Google Play: ' + (CAT.google || '-');
  const ver = $('f-ver') ? $('f-ver').value : '2.4.0';
  const rdate = $('f-rdate') ? $('f-rdate').value : getCurrentMonthDateStr(2, true);
  const email = $('f-email') ? $('f-email').value : '';
  const addr = $('f-addr') ? $('f-addr').value : '';
  const privLinked = $('f-priv-linked') ? $('f-priv-linked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.linked : '');
  const privNotLinked = $('f-priv-notlinked') ? $('f-priv-notlinked').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.notLinked : '');
  const privGoogle = $('f-priv-google') ? $('f-priv-google').value : (typeof CURRENT_PRIVACY !== 'undefined' ? CURRENT_PRIVACY.google : '');
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
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
    showToast('Metadata copied to clipboard!', 'ok');
  }).catch(()=>{
    showToast('Clipboard access denied, check permissions', 'warn');
  });
}
