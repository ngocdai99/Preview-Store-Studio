// Store Preview Studio - 1-Click Clipboard Export
if($('btnCopyText')) $('btnCopyText').onclick = copyAllText;

function copyAllText(){
  if(typeof isDemoMode === 'function' && isDemoMode()){
    if(typeof requireFullVersion === 'function') requireFullVersion('export-copy');
    return;
  }
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

[ App Title ] (${safeCount(name)}/30 chars)
${name}

[ Subtitle ] (${safeCount(sub)}/30 chars)
${sub}

[ Promotional Text ] (${safeCount(promo)}/170 chars)
${promo}

[ Primary Category ]
${catApple}

[ Description ] (${safeCount(desc)}/4,000 chars)
${desc}

[ What's New ]
${wn}


=====================================================
GOOGLE PLAY STORE (Android)
=====================================================

[ App Name ] (${safeCount(name)}/30 chars)
${name}

[ Short Description ] (${safeCount(short)}/80 chars)
${short}

[ App Category ]
${catGoogle}

[ Full Description ] (${safeCount(desc)}/4,000 chars)
${desc}

[ What's New / Release Notes ]
${wn}

=====================================================`;

  function fallbackCopyText(str){
    try {
      const ta = document.createElement('textarea');
      ta.value = str;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      if(success){
        showToast('Store metadata copied to clipboard!', 'ok');
      } else {
        showToast('Clipboard access denied, check permissions', 'warn');
      }
    } catch(err){
      showToast('Clipboard access denied, check permissions', 'warn');
    }
  }

  if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
    navigator.clipboard.writeText(text).then(()=>{
      showToast('Store metadata copied to clipboard!', 'ok');
    }).catch(()=>{
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}
