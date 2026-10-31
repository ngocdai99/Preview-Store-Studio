// Store Preview Studio · Age Rating Dropdown & Normalization (App Store & Google Play)
const AGE_RATINGS = [
  { val: '4+',  apple: '4+',  googleBadge: 'E',    googleLabel: 'Everyone',        label: '4+ / Everyone (E)',        desc: 'General audience · Suitable for all ages' },
  { val: '9+',  apple: '9+',  googleBadge: 'E10+', googleLabel: 'Everyone 10+',    label: '9+ / Everyone 10+ (E10+)', desc: 'Mild cartoon or fantasy violence' },
  { val: '12+', apple: '12+', googleBadge: 'T',    googleLabel: 'Teen · 12+',      label: '12+ / Teen (T)',           desc: 'Mild violence, suggestive themes, crude humor' },
  { val: '17+', apple: '17+', googleBadge: 'M',    googleLabel: 'Mature 17+',      label: '17+ / Mature 17+ (M)',     desc: 'Frequent mature themes, realistic violence' },
  { val: '18+', apple: '18+', googleBadge: '18+',  googleLabel: 'Adults Only 18+', label: '18+ / Adults Only (AO)',   desc: 'Explicit adult content, strictly 18+' }
];

function getAgeRatingLabel(val) {
  if (!val) return '4+ / Everyone (E)';
  const match = AGE_RATINGS.find(r => r.val.toLowerCase() === val.toLowerCase());
  if (match) return match.label;
  return val + ' (Custom)';
}

function syncAgeUI() {
  const currentVal = (typeof STATS !== 'undefined' && STATS.age) ? STATS.age : ($('f-st-age') ? $('f-st-age').value : '4+');
  const valEl = $('customAgeVal');
  if (valEl) valEl.textContent = getAgeRatingLabel(currentVal);

  const wrap = $('customAgeWrap');
  if (wrap && wrap.classList.contains('open')) {
    renderCustomAgeOptions($('customAgeSearch') ? $('customAgeSearch').value : '');
  }
}

function isCustomAgeOpen() {
  const wrap = $('customAgeWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomAge() {
  const wrap = $('customAgeWrap');
  const trigger = $('customAgeTrigger');
  const searchInput = $('customAgeSearch');
  if (!wrap) return;

  // Close category dropdown if open
  if (typeof closeCustomCat === 'function') closeCustomCat();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderCustomAgeOptions('');
  const activeOpt = wrap.querySelector('.custom-age-option.active');
  if (activeOpt) {
    activeOpt.scrollIntoView({ block: 'nearest' });
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('st-age', true);
  }
}

function closeCustomAge() {
  const wrap = $('customAgeWrap');
  const trigger = $('customAgeTrigger');
  if (!wrap) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectAgeFromUI(ageVal) {
  ageVal = (ageVal || '4+').trim();
  if (typeof STATS !== 'undefined') {
    STATS.age = ageVal;
  }
  const sel = $('f-st-age');
  if (sel) {
    let opt = Array.from(sel.options).find(o => o.value === ageVal);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = ageVal;
      opt.textContent = ageVal + ' (custom)';
      sel.appendChild(opt);
    }
    sel.value = ageVal;
  }
  closeCustomAge();
  const trigger = $('customAgeTrigger');
  if (trigger) trigger.focus();
  if (typeof renderStats === 'function') renderStats();
  syncAgeUI();
  if (typeof debouncedSave === 'function') debouncedSave();
  else if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('st-age');
  if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
}

function renderCustomAgeOptions(query = '') {
  const listContainer = $('customAgeOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const currentVal = (typeof STATS !== 'undefined' && STATS.age) ? STATS.age : ($('f-st-age') ? $('f-st-age').value : '4+');
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-age-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (item) => {
    const el = document.createElement('div');
    const isActive = item.val.toLowerCase() === (currentVal || '').toLowerCase();
    el.className = 'custom-age-option' + (isActive ? ' active' : '');
    el.dataset.val = item.val;
    el.role = 'option';
    el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    el.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">${item.label}</div>
        <div class="custom-age-option-desc">${item.desc}</div>
      </div>
      ${checkSvg}
    `;
    el.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(item.val);
    };
    return el;
  };

  let renderedCount = 0;
  const filtered = AGE_RATINGS.filter(r => {
    if (!q) return true;
    return r.val.toLowerCase().includes(q) ||
           r.label.toLowerCase().includes(q) ||
           r.apple.toLowerCase().includes(q) ||
           r.googleBadge.toLowerCase().includes(q) ||
           r.googleLabel.toLowerCase().includes(q) ||
           r.desc.toLowerCase().includes(q);
  });

  filtered.forEach(r => {
    listContainer.appendChild(createOptionEl(r));
    renderedCount++;
  });

  // If current value is custom and not in standard list, show it at the top
  if (currentVal && !AGE_RATINGS.some(r => r.val.toLowerCase() === currentVal.toLowerCase())) {
    const customItem = document.createElement('div');
    customItem.className = 'custom-age-option active';
    customItem.dataset.val = currentVal;
    customItem.role = 'option';
    customItem.setAttribute('aria-selected', 'true');
    customItem.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">${currentVal} (Custom)</div>
        <div class="custom-age-option-desc">User-defined age rating</div>
      </div>
      ${checkSvg}
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(currentVal);
    };
    listContainer.insertBefore(customItem, listContainer.firstChild);
    renderedCount++;
  }

  // If no match found for query, allow creating/using custom rating
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-age-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `
      <div class="custom-age-option-text">
        <div class="custom-age-option-title">Use "<strong>${rawVal}</strong>"</div>
        <div class="custom-age-option-desc">Custom age rating</div>
      </div>
      <span class="custom-age-create-tag">Custom</span>
    `;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectAgeFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-age-empty';
    emptyEl.textContent = 'No age ratings found';
    listContainer.appendChild(emptyEl);
  }
}

(function initCustomAgeEvents() {
  const trigger = $('customAgeTrigger');
  const wrap = $('customAgeWrap');
  const searchInput = $('customAgeSearch');
  const sel = $('f-st-age');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (isCustomAgeOpen()) {
        closeCustomAge();
      } else {
        openCustomAge();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });

      trigger.addEventListener('click', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          setFieldFocus('st-age', true);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('st-age', true);
      });
    }

    searchInput.oninput = () => {
      renderCustomAgeOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomAge();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-age-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectAgeFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-age-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  if (sel) {
    sel.addEventListener('change', () => {
      syncAgeUI();
    });
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomAge();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomAgeOpen()) {
      closeCustomAge();
      if (trigger) trigger.focus();
    }
  });
})();

// Initial sync
syncAgeUI();
