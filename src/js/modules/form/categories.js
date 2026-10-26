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
  if($('f-cat')) $('f-cat').value = (CAT[store] || '').replace(/^Games · /, '');
  const t = $('catTag');
  if(t){ t.textContent = store === 'apple' ? 'APPLE' : 'GOOGLE'; t.className = 'tag ' + (store === 'apple' ? 'a' : 'g'); }
}

function setCategory(val, only){
  val = (val || '').trim();
  ['apple','google'].forEach(st => {
    if(only && only !== st) return;
    const sel = CAT_SEL[st];
    if(!sel) return;
    sel.querySelectorAll('option[data-custom]').forEach(o => o.remove());
    let m = val ? matchCat(st, val) : '';
    if(val && !m){
      m = val;
      const o = document.createElement('option'); o.value = val; o.textContent = val + ' (custom)'; o.dataset.custom = '1';
      sel.appendChild(o);
    }
    CAT[st] = m;
    sel.value = m;
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
setCategory('Productivity');
