# Store Preview Studio · Pro Studio & Agency Edition
> Full modular source code, dev automation, and agency client handoff toolkit.

---

## 🚀 Quick Start

### 1. Standalone Use
* Double-click **`store_preview_studio.html`** to run the pre-compiled studio immediately in any modern browser (Chrome, Safari, Firefox).
* Switch between 6 built-in templates from the top **Preset** menu, or import/export `.json` workspace files from the `presets/` folder for client reviews.

### 2. Developer & Customization Mode
```bash
node dev.js        # Start SSE live-reload server on http://localhost:3000
node build.js      # Recompile src/ into store_preview_studio.html
```
*(macOS users can also double-click **`start_dev.command`** in Finder).*

---

## 📦 Package Contents
```text
store-preview-studio-pro-v1.0/
├── store_preview_studio.html                # Compiled standalone studio app
├── build.js & dev.js                        # Bundler & SSE live-dev server
├── start_dev.command                        # 1-Click macOS dev server launcher
├── package.json                             # Build scripts
├── src/                                     # FULL MODULAR SOURCE CODE
│   ├── index.html                           # App shell
│   ├── components/                          # Mockups (iPhone, iPad, Android, Tablets) & editor UI
│   ├── css/                                 # Platform & editor stylesheets
│   ├── js/                                  # Core state, validators, exporters & store cloner
│   └── lib/                                 # Local canvas engine (html2canvas)
├── presets/                                 # 6 ready-to-use JSON starter templates
│   ├── store-preview-studio-template.json
│   ├── saas-app-template.json
│   ├── cyberstrike-rpg-game-template.json
│   ├── zenmind-meditation-template.json
│   ├── education-language-template.json
│   └── fitness-tracker-template.json
├── AGENCY_MARKETING_FAQ.html                # 16-topic ASO & store rules guide
├── README.md                                # This reference manual
└── LICENSE.txt                              # Team & Agency Commercial License
```

---

## ⚡ Core Capabilities
* **Full Source Code**: Modular HTML/CSS/JS architecture ready for custom frames, branding, or internal agency extensions.
* **White-Label Ready**: Easily swap brand name and logo in `src/components/header/brand.html`.
* **Dual-Store Simulation**: Apple App Store & Google Play Store across Phone & Tablet viewports.
* **View Modes**: Product Detail page, Search Results feed, and Dual-phone side-by-side comparison.
* **Media Formatting**: Adaptive portrait and 16:9 widescreen landscape screenshot carousels.
* **Compliance Checks**: Icon alpha transparency scanner (ITMS-90717) with 1-click auto-flatten, screenshot dimension validator, strict grapheme character counters (`Intl.Segmenter`).
* **Export Options**: Ultra HD 4K mockups (PNG), complete ZIP package, `LISTING_METADATA.md` developer handoff report.
* **Data Tools**: Import/export JSON workspace presets, 1-click Live App Store Cloner.
* **Agency Toolkit**: Interactive 16-topic ASO & store compliance FAQ guide (`AGENCY_MARKETING_FAQ.html`) for client handoff and team onboarding.

---

## 🛠 Fastlane Automation Mapping (Optional)
> Quick reference for developers using Fastlane CI/CD metadata pipelines:
* `fastlane/metadata/ios/en-US/{name, subtitle, promotional_text, description, keywords}.txt`
* `fastlane/metadata/android/en-US/{title, short_description, full_description}.txt`

---

## 🔒 License & Support
* **License**: Team & Agency Commercial License (`LICENSE.txt`) for unlimited client work.
* **Support**: Reply directly to your Gumroad receipt email or contact `kai.devlabs@gmail.com`.
