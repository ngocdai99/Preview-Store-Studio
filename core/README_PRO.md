# Store Preview Studio · Pro Studio & Agency Edition
> Full modular source code, dev automation, and agency client handoff toolkit.

---

## 🚀 Quick Start

### 1. Standalone Use
* Double-click **`store_preview_studio.html`** to run the pre-compiled studio in any browser.

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
│   ├── components/                          # Mockups (iPhone, iPad, Android, Tablets), editor cards
│   ├── css/                                 # Platform & editor stylesheets
│   └── lib/                                 # Local canvas engine (html2canvas)
├── presets/                                 # 6 JSON starter templates
├── Store_Preview_Studio_Test_Checklist.xlsx # Excel pre-flight client sign-off sheet
├── AGENCY_MARKETING_FAQ.html                # 16-topic ASO & store rules guide
├── TEST_CASES.html                          # QA test specifications
├── README.md                                # This reference manual
└── LICENSE.txt                              # Team & Agency Commercial License
```

---

## ⚡ Core Capabilities
* **Full Source Code**: Modular HTML/CSS/JS components ready for custom frames, branding, or feature extensions.
* **White-Label Ready**: Easily swap brand name and logo in `src/components/header/brand.html`.
* **Dual-Store Simulation**: Apple App Store & Google Play with phone & tablet viewports.
* **Compliance Checks**: Icon alpha transparency (ITMS-90717), dimension validators, character counters.
* **Export Options**: Ultra HD 4K mockups (PNG), ZIP package, `LISTING_METADATA.md`.
* **Agency Toolkit**: Excel pre-flight checklist and interactive FAQ guide for client handoff.

---

## 🛠 Fastlane Automation Mapping (Optional)
> Quick reference for developers using Fastlane CI/CD metadata pipelines:
* `fastlane/metadata/ios/en-US/{name, subtitle, promotional_text, description, keywords}.txt`
* `fastlane/metadata/android/en-US/{title, short_description, full_description}.txt`

---

## 🔒 License & Support
* **License**: Team & Agency Commercial License (`LICENSE.txt`) for unlimited client work.
* **Support**: Reply directly to your Gumroad receipt email.
