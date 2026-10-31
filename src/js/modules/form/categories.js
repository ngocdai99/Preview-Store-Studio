// Store Preview Studio · Category Dropdowns & Normalization (App Store vs Google Play)
const APPLE_CATEGORIES = ['Books','Business','Developer Tools','Education','Entertainment','Finance','Food & Drink','Games','Graphics & Design','Health & Fitness','Lifestyle','Magazines & Newspapers','Medical','Music','Navigation','News','Photo & Video','Productivity','Reference','Shopping','Social Networking','Sports','Stickers','Travel','Utilities','Weather'];
const GOOGLE_APP_CATEGORIES = ['Art & Design','Auto & Vehicles','Beauty','Books & Reference','Business','Comics','Communication','Dating','Education','Entertainment','Events','Finance','Food & Drink','Health & Fitness','House & Home','Lifestyle','Maps & Navigation','Medical','Music & Audio','News & Magazines','Parenting','Personalization','Photography','Productivity','Shopping','Social','Sports','Tools','Travel & Local','Video Players & Editors','Weather'];
const GOOGLE_GAME_CATEGORIES = ['Action','Adventure','Arcade','Board','Card','Casino','Casual','Educational','Music','Puzzle','Racing','Role Playing','Simulation','Sports','Strategy','Trivia','Word'];
const CAT_ALIASES = {
  apple:  {'social':'Social Networking','photography':'Photo & Video','video players and editors':'Photo & Video','tools':'Utilities','maps and navigation':'Navigation','news and magazines':'News','music and audio':'Music','books and reference':'Books','art and design':'Graphics & Design','travel and local':'Travel','health and fitness':'Health & Fitness'},
  google: {'social networking':'Social','photo and video':'Photography','utilities':'Tools','navigation':'Maps & Navigation','news':'News & Magazines','magazines and newspapers':'News & Magazines','music':'Music & Audio','books':'Books & Reference','reference':'Books & Reference','graphics and design':'Art & Design','developer tools':'Tools','travel':'Travel & Local'}
};
const CAT = {apple:'', google:''};
const CAT_SEL = {apple: $('f-cat-apple'), google: $('f-cat-google')};
const catNorm = v => (v||'').toLowerCase().replace(/&/g,'and').replace(/\s+/g,' ').trim();

(function buildCategorySelects(){
  const opt = (v, t) => { const o = document.createElement('option'); o.value = v; o.textContent = t || v; return o; };
  const a = CAT_SEL.apple, g = CAT_SEL.google;
  if (!a || !g) return;
  a.appendChild(opt('', 'Select primary category…'));
  APPLE_CATEGORIES.forEach(c => a.appendChild(opt(c)));
  g.appendChild(opt('', 'Select category…'));
  [['Apps', GOOGLE_APP_CATEGORIES], ['Games', GOOGLE_GAME_CATEGORIES]].forEach(([label, list]) => {
    const og = document.createElement('optgroup'); og.label = label;
    list.forEach(c => og.appendChild(opt(label === 'Games' ? 'Games · ' + c : c, c)));
    g.appendChild(og);
  });
})();

function matchCat(st, val){
  const n = catNorm(val);
  if(!n) return '';
  const list = st === 'apple' ? APPLE_CATEGORIES : GOOGLE_APP_CATEGORIES.concat(GOOGLE_GAME_CATEGORIES.map(c => 'Games · ' + c));
  const hit = list.find(c => catNorm(c) === n);
  if(hit) return hit;
  const al = CAT_ALIASES[st][n];
  if(al) return al;
  if(st === 'apple'){
    if(n.startsWith('games · ') || GOOGLE_GAME_CATEGORIES.some(c => catNorm(c) === n)) return 'Games';
  } else {
    if(n === 'games') return 'Games · Action';
    const gHit = GOOGLE_GAME_CATEGORIES.find(c => catNorm(c) === n);
    if(gHit) return 'Games · ' + gHit;
  }
  return '';
}

function syncCategoryUI(){
  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  const displayVal = (CAT[activeSt] || '').replace(/^Games · /, '');
  if($('f-cat')) $('f-cat').value = displayVal;
  const valEl = $('customCatVal');
  if(valEl) valEl.textContent = displayVal || 'Select category…';
  const wrap = $('customCatWrap');
  if(wrap && wrap.classList.contains('open')) {
    renderCustomCatOptions($('customCatSearch') ? $('customCatSearch').value : '');
  }
}

function isCustomCatOpen() {
  const wrap = $('customCatWrap');
  return wrap ? wrap.classList.contains('open') : false;
}

function openCustomCat() {
  const wrap = $('customCatWrap');
  const trigger = $('customCatTrigger');
  const searchInput = $('customCatSearch');
  if (!wrap) return;

  // Close age dropdown if open
  if (typeof closeCustomAge === 'function') closeCustomAge();

  wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderCustomCatOptions('');
  const activeOpt = wrap.querySelector('.custom-cat-option.active');
  if (activeOpt) {
    activeOpt.scrollIntoView({ block: 'nearest' });
  }
  if (typeof setFieldFocus === 'function') {
    setFieldFocus('cat', true);
  }
}

function closeCustomCat() {
  const wrap = $('customCatWrap');
  const trigger = $('customCatTrigger');
  if (!wrap) return;
  wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function selectCategoryFromUI(catVal) {
  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  setCategory(catVal, activeSt);
  closeCustomCat();
  const trigger = $('customCatTrigger');
  if (trigger) trigger.focus();
  if (typeof update === 'function') update();
  if (typeof saveState === 'function') saveState();
  if (typeof flashField === 'function') flashField('cat');
  if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
}

function renderCustomCatOptions(query = '') {
  const listContainer = $('customCatOptions');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const activeSt = typeof store !== 'undefined' ? store : 'apple';
  const currentVal = CAT[activeSt] || '';
  const q = query.trim().toLowerCase();

  const checkSvg = '<svg class="custom-cat-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  const createOptionEl = (val, label = val) => {
    const item = document.createElement('div');
    item.className = 'custom-cat-option' + (val === currentVal ? ' active' : '');
    item.dataset.val = val;
    item.role = 'option';
    item.setAttribute('aria-selected', val === currentVal ? 'true' : 'false');
    item.innerHTML = `<span>${label}</span>${checkSvg}`;
    item.onclick = (e) => {
      e.stopPropagation();
      selectCategoryFromUI(val);
    };
    return item;
  };

  let renderedCount = 0;

  if (activeSt === 'apple') {
    const filtered = APPLE_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q));
    filtered.forEach(c => {
      listContainer.appendChild(createOptionEl(c));
      renderedCount++;
    });
  } else {
    const filteredApps = GOOGLE_APP_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q));
    const filteredGames = GOOGLE_GAME_CATEGORIES.filter(c => !q || c.toLowerCase().includes(q) || ('games · ' + c.toLowerCase()).includes(q));

    if (filteredApps.length > 0) {
      const gLabel = document.createElement('div');
      gLabel.className = 'custom-cat-group-label';
      gLabel.textContent = 'Apps';
      listContainer.appendChild(gLabel);
      filteredApps.forEach(c => {
        listContainer.appendChild(createOptionEl(c));
        renderedCount++;
      });
    }

    if (filteredGames.length > 0) {
      const gLabel = document.createElement('div');
      gLabel.className = 'custom-cat-group-label';
      gLabel.textContent = 'Games';
      listContainer.appendChild(gLabel);
      filteredGames.forEach(c => {
        listContainer.appendChild(createOptionEl('Games · ' + c, c));
        renderedCount++;
      });
    }
  }

  // Handle custom value if present and not in list
  if (currentVal && !matchCat(activeSt, currentVal)) {
    const customOption = createOptionEl(currentVal, currentVal + ' (custom)');
    listContainer.insertBefore(customOption, listContainer.firstChild);
    renderedCount++;
  }

  // If no results match query, allow creating/using custom category
  if (renderedCount === 0 && q) {
    const rawVal = query.trim();
    const customItem = document.createElement('div');
    customItem.className = 'custom-cat-option';
    customItem.dataset.val = rawVal;
    customItem.innerHTML = `<span>Use "<strong>${rawVal}</strong>"</span><span class="custom-cat-create-tag">Custom</span>`;
    customItem.onclick = (e) => {
      e.stopPropagation();
      selectCategoryFromUI(rawVal);
    };
    listContainer.appendChild(customItem);
  } else if (renderedCount === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'custom-cat-empty';
    emptyEl.textContent = 'No categories found';
    listContainer.appendChild(emptyEl);
  }
}

function setCategory(val, only){
  val = (val || '').trim();
  ['apple','google'].forEach(st => {
    if(only && only !== st) return;
    const sel = CAT_SEL[st];
    let m = val ? matchCat(st, val) : '';
    if(sel){
      sel.querySelectorAll('option[data-custom]').forEach(o => o.remove());
      if(val && !m){
        m = val;
        const o = document.createElement('option'); o.value = val; o.textContent = val + ' (custom)'; o.dataset.custom = '1';
        sel.appendChild(o);
      }
      sel.value = m;
    } else if(val && !m) {
      m = val;
    }
    CAT[st] = m;
  });
  syncCategoryUI();
}

['apple','google'].forEach(st => {
  if (CAT_SEL[st]) {
    CAT_SEL[st].onchange = () => {
      CAT[st] = CAT_SEL[st].value;
      syncCategoryUI();
      if (typeof update === 'function') update();
      if (typeof saveState === 'function') saveState();
      if (typeof flashField === 'function') flashField('cat');
      if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
    };
  }
});

(function initCustomCatEvents() {
  const trigger = $('customCatTrigger');
  const wrap = $('customCatWrap');
  const searchInput = $('customCatSearch');

  if (trigger) {
    trigger.onclick = (e) => {
      e.stopPropagation();
      if (isCustomCatOpen()) {
        closeCustomCat();
      } else {
        openCustomCat();
      }
    };

    if (typeof trigger.addEventListener === 'function') {
      trigger.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });

      trigger.addEventListener('click', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });

      trigger.addEventListener('mouseenter', () => {
        if (typeof setFieldFocus === 'function' && typeof activeFieldFocusKey !== 'undefined' && !activeFieldFocusKey) {
          setFieldFocus('cat', true);
        }
      });
    }
  }

  if (searchInput) {
    if (typeof searchInput.addEventListener === 'function') {
      searchInput.addEventListener('focus', () => {
        if (typeof setFieldFocus === 'function') setFieldFocus('cat', true);
      });
    }
    searchInput.oninput = () => {
      renderCustomCatOptions(searchInput.value);
    };

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCustomCat();
        if (trigger) trigger.focus();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-cat-option') : null;
        if (firstOpt && firstOpt.dataset.val) {
          selectCategoryFromUI(firstOpt.dataset.val);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstOpt = wrap ? wrap.querySelector('.custom-cat-option') : null;
        if (firstOpt) {
          firstOpt.focus();
        }
      }
    };
  }

  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) {
      closeCustomCat();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCustomCatOpen()) {
      closeCustomCat();
      if (trigger) trigger.focus();
    }
  });
})();

setCategory('Productivity');
