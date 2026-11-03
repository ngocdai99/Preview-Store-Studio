// Store Preview Studio - 1-Click Clipboard Export
if($('btnCopyText')) $('btnCopyText').onclick = copyAllText;

function copyAllText(){
  const name = $('f-name') ? $('f-name').value : '';
  const sub = $('f-sub') ? $('f-sub').value : '';
  const promo = $('f-promo') ? $('f-promo').value : '';
  const short = $('f-short') ? $('f-short').value : '';
  const catApple = (typeof CAT === 'object' && CAT.apple) ? CAT.apple : '-';
  const catGoogle = (typeof CAT === 'object' && CAT.google) ? CAT.google : '-';
  const wn = $('f-new') ? $('f-new').value : '';
  const desc = $('f-desc') ? $('f-desc').value : '';
  const safeCount = typeof countChars === 'function' ? countChars : (s => (s || '').length);

  const text = `=====================================================
APPLE APP STORE (iOS)
=====================================================
App Title (30 chars max):
${name} [${safeCount(name)}/30]

Subtitle (30 chars max):
${sub} [${safeCount(sub)}/30]

Promotional Text (170 chars max):
${promo} [${safeCount(promo)}/170]

Primary Category:
${catApple}

Description (4,000 chars max):
${desc}

What's New in This Version:
${wn}

=====================================================
GOOGLE PLAY STORE (Android)
=====================================================
App name (30 chars max):
${name} [${safeCount(name)}/30]

Short description (80 chars max):
${short} [${safeCount(short)}/80]

App Category:
${catGoogle}

Full description (4,000 chars max):
${desc}

Release notes:
${wn}
=====================================================`;

  navigator.clipboard.writeText(text).then(()=>{
    showToast('Store metadata copied to clipboard!', 'ok');
  }).catch(()=>{
    showToast('Clipboard access denied, check permissions', 'warn');
  });
}
