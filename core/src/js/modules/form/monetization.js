// Store Preview Studio · Monetization Badge Dropdown (App Store & Google Play)
const MONETIZATION_OPTIONS = [
  { val: 'iap',     label: 'In-App Purchases (No Ads)',        desc: 'In-app purchases or subscriptions · No advertising' },
  { val: 'ads_iap', label: 'Contains Ads · In-App Purchases',  desc: 'Ad networks with in-app purchases or subscriptions' },
  { val: 'ads',     label: 'Contains Ads Only',                desc: 'Ad-supported · No in-app purchases' },
  { val: 'free',    label: 'None (100% Free / Paid Upfront)',   desc: 'Completely free or upfront paid · Zero ads & IAP' }
];

function getMonetizationLabel(val) {
  if (!val) return 'In-App Purchases (No Ads)';
  const match = MONETIZATION_OPTIONS.find(m => m.val.toLowerCase() === val.toLowerCase());
  if (match) return match.label;
  return val + ' (Custom)';
}

function syncIapUI() {
  const currentVal = (typeof STATS !== 'undefined' && STATS.iap) ? STATS.iap : ($('f-st-iap') ? $('f-st-iap').value : 'iap');
  const valEl = $('customIapVal');
  if (valEl) valEl.textContent = getMonetizationLabel(currentVal);

  const wrap = $('customIapWrap');
  if (wrap && wrap.classList.contains('open')) {
    renderCustomIapOptions($('customIapSearch') ? $('customIapSearch').value : '');
  }
}

function isCustomIapOpen() {
  const wrap = $('customIapWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomIap() {
  const wrap = $('customIapWrap');
  const trigger = $('customIapTrigger');
  const searchInput = $('customIapSearch');
  if (!wrap) return;
  if (wrap.classList.contains('open')) return;

  // Close category and age dropdowns if open
  if (typeof closeCustomCat === 'function') closeCustomCat();
  if (typeof closeCustomAge === 'function') closeCustomAge();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  renderCustomIapOptions('');
  if (searchInput) {
    searchInput.value = '';
    try {
      searchInput.focus({ preventScroll: true });
    } catch(e) {
      searchInput.focus();
    }
  }
  const listContainer = $('customIapOptions');
  const activeOpt = wrap.querySelector('.custom-iap-option.active');
  if (listContainer && activeOpt) {
    listContainer.scrollTop = Math.max(0, activeOpt.offsetTop - listContainer.offsetTop);
  }
  if (typeof flashField === 'function') {
    flashField('st-iap');
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('st-iap', false, false);
  }
}

function closeCustomIap() {
  const wrap = $('customIapWrap');
  const trigger = $('customIapTrigger');
  if (!wrap) return;
  if (!wrap.classList.contains('open')) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectIapFromUI(iapVal) {
  iapVal = (iapVal || 'iap').trim();
  if (typeof STATS !== 'undefined') {
    STATS.iap = iapVal;
  }
  const sel = $('f-st-iap');
  if (sel) {
    let opt = Array.from(sel.options).find(o => o.value === iapVal);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = iapVal;
      opt.textContent = iapVal + ' (custom)';
      sel.appendChild(opt);
    }
    sel.value = iapVal;
  }
  closeCustomIap();
  const trigger = $('customIapTrigger');
  if (trigger) {
    try {
      trigger.focus({ preventScroll: true });
    } catch(e) {
      trigger.focus();
    }
  }
  if (typeof renderStats === 'function') renderStats();
  syncIapUI();
  if (typeof debouncedSave === 'function') debouncedSave();
  else if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('st-iap');
  if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', true);
}

function renderCustomIapOptions(query = '') {
  const listContainer = $('customIapOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const currentVal = (typeof STATS !== 'undefined' && STATS.iap) ? STATS.iap : ($('f-st-iap') ? $('f-st-iap').value : 'iap');
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-iap-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (item) => {
    const el = document.createElement('div');
    const isActive = item.val.toLowerCase() === (currentVal || '').toLowerCase();
    el.className = 'custom-iap-option' + (isActive ? ' active' : '');
    el.dataset.val = item.val;
    el.role = 'option';
    el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    el.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">${item.label}</div>
        <div class="custom-iap-option-desc">${item.desc}</div>
      </div>
      ${checkSvg}
    `;
    el.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(item.val);
    };
    return el;
  };

  let renderedCount = 0;
  const filtered = MONETIZATION_OPTIONS.filter(r => {
    if (!q) return true;
    return r.val.toLowerCase().includes(q) ||
           r.label.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q);
  });

  filtered.forEach(r => {
    listContainer.appendChild(createOptionEl(r));
    renderedCount++;
  });

  // If current value is custom and not in standard list, show it at the top
  if (currentVal && !MONETIZATION_OPTIONS.some(r => r.val.toLowerCase() === currentVal.toLowerCase())) {
    const customItem = document.createElement('div');
    customItem.className = 'custom-iap-option active';
    customItem.dataset.val = currentVal;
    customItem.role = 'option';
    customItem.setAttribute('aria-selected', 'true');
    customItem.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">${currentVal} (Custom)</div>
        <div class="custom-iap-option-desc">User-defined monetization badge</div>
      </div>
      ${checkSvg}
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(currentVal);
    };
    listContainer.insertBefore(customItem, listContainer.firstChild);
    renderedCount++;
  }

  // If no match found for query, allow creating/using custom monetization badge
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-iap-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `
      <div class="custom-iap-option-text">
        <div class="custom-iap-option-title">Use "<strong>${rawVal}</strong>"</div>
        <div class="custom-iap-option-desc">Custom monetization badge</div>
      </div>
      <span class="custom-iap-create-tag">Custom</span>
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectIapFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-iap-empty';
    emptyEl.textContent = 'No monetization badges found';
    listContainer.appendChild(emptyEl);
  }
}

(function initCustomIapEvents() {
  const trigger = $('customIapTrigger');
  const wrap = $('customIapWrap');
  const searchInput = $('customIapSearch');
  const sel = $('f-st-iap');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (typeof flashField === 'function') flashField('st-iap');
      if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', false, false);
      if (isCustomIapOpen()) {
        closeCustomIap();
      } else {
        openCustomIap();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof flashField === 'function') flashField('st-iap');
        if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', false, false);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          if (typeof flashField === 'function') flashField('st-iap');
          setFieldFocus('st-iap', false, false);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof flashField === 'function') flashField('st-iap');
        if (typeof setFieldFocus === 'function') setFieldFocus('st-iap', false, false);
      });
    }

    searchInput.oninput = () => {
      renderCustomIapOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomIap();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-iap-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectIapFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-iap-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  if (sel) {
    sel.addEventListener('change', () => {
      syncIapUI();
    });
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomIap();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomIapOpen()) {
      closeCustomIap();
      if (trigger) trigger.focus();
    }
  });
})();

// Initial sync
syncIapUI();
