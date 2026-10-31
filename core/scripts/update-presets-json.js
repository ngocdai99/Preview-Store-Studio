const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Read state.js
const statePath = path.join(__dirname, '..', 'src', 'js', 'core', 'state.js');
const stateCode = fs.readFileSync(statePath, 'utf8');

// Create mock sandbox for state.js
const sandbox = {
  console,
  document: {
    body: {
      classList: { toggle: () => {} }
    }
  },
  $$: () => [],
  $: () => null,
  encodeURIComponent: global.encodeURIComponent
};

vm.createContext(sandbox);
vm.runInContext(stateCode + '\nglobalThis.PRESETS = PRESETS;', sandbox);

const PRESETS = sandbox.PRESETS;
const GAME_CATEGORIES = [
  'Action','Adventure','Arcade','Board','Card','Casino','Casual','Educational',
  'Music','Puzzle','Racing','Role Playing','Simulation','Sports','Strategy','Trivia','Word'
];

function updatePresetJson(filename, presetKey) {
  const filePath = path.join(__dirname, '..', 'presets', filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const preset = PRESETS[presetKey];

  if (!preset) {
    throw new Error(`Preset ${presetKey} not found!`);
  }

  data.icon = preset.icon;
  data.featureGraphic = preset.feature;
  data.shots = preset.shots;
  data.form.name = preset.name;
  data.form.sub = preset.sub;
  data.form.promo = preset.promo;
  data.form.short = preset.short;
  data.form.dev = preset.dev;
  data.form.cat = preset.category;
  const isGameSubcat = GAME_CATEGORIES.includes(preset.category);
  data.form.catApple = isGameSubcat ? 'Games' : preset.category;
  data.form.catGoogle = isGameSubcat ? ('Games · ' + preset.category) : preset.category;
  if (preset.ver) data.form.ver = preset.ver;
  if (preset.rdate) data.form.rdate = preset.rdate;
  if (preset.email) data.form.email = preset.email;
  if (preset.phone) data.form.phone = preset.phone;
  if (preset.addr) data.form.addr = preset.addr;
  if (preset.whatsNew) data.form.new = preset.whatsNew;
  data.form.desc = preset.desc;
  data.form.privLinked = preset.privLinked;
  data.form.privNotLinked = preset.privNotLinked;
  data.form.privGoogle = preset.privGoogle;
  data.reviews = preset.reviews ? JSON.parse(JSON.stringify(preset.reviews)) : [];
  if (preset.stats) {
    data.stats = Object.assign({}, data.stats || {}, preset.stats);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${filename} successfully with ${preset.shots.length} shots and custom icon.`);
}

updatePresetJson('fitness-tracker-template.json', 'pulsefit');
updatePresetJson('zenmind-meditation-template.json', 'zenmind');
updatePresetJson('saas-app-template.json', 'taskflow');
updatePresetJson('cyberstrike-rpg-game-template.json', 'cyberstrike');
updatePresetJson('education-language-template.json', 'edulearn');
