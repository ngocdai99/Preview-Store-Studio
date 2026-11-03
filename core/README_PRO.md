# Store Preview Studio · Pro Studio & Agency Edition
### Full-Source Modular Preview Studio, Dev Automation & Agency QA Toolkit

> **Congratulations on purchasing Store Preview Studio Pro Edition!**  
> You hold the premier commercial tier with **full modular source code (`src/`)**, live-reloading dev environment, and the complete **Agency Client Handoff & QA Toolkit**.

---

## 🚀 Two Ways to Use Store Preview Studio Pro

### Option 1: Instant Standalone Use (No Node.js Required)
* Simply double-click **`store_preview_studio.html`** in Finder/File Explorer to open the pre-compiled, minified studio in any browser (Chrome, Safari, Brave, Edge, Arc).
* Ideal for quick design reviews, marketing audits, and exporting 4K mockups on any machine.

### Option 2: Developer & White-Label Customization Mode
If you want to customize device frames, add agency branding, modify CSS/HTML components, or build your own bespoke listing tools:

1. **macOS 1-Click Dev Server**: Double-click **`start_dev.command`** in Finder.
2. **Terminal Dev Server**:
   ```bash
   node dev.js
   ```
   * Auto-launches `http://localhost:3000`.
   * Features Server-Sent Events (SSE) live-reload: edit any file in `src/` and your browser updates instantly without manual refreshing!
3. **Re-bundle Standalone App**:
   ```bash
   node build.js          # Compiles src/ into a unified store_preview_studio.html
   node build.js --watch  # Continuous auto-compile on file save
   ```

---

## 📦 What's Inside Your Pro Package

```text
store-preview-studio-pro-v1.0/
├── store_preview_studio.html                # Compiled, standalone studio app (Full 6 Presets)
├── README.md                                # This comprehensive developer & agency guide
├── LICENSE.txt                              # Team & Agency Lifetime Commercial License
│
├── 🛠 DEVELOPER & BUILD TOOLKIT
│   ├── build.js                             # Zero-dependency asset compiler & bundler
│   ├── dev.js                               # Live-reloading SSE local dev server (port 3000)
│   ├── start_dev.command                    # 1-Click macOS dev server launcher
│   ├── package.json                         # Build scripts & configuration
│   ├── scripts/                             # Internal build utilities & showcase generators
│   └── src/                                 # FULL MODULAR SOURCE CODE
│       ├── index.html                       # Base application shell
│       ├── components/                      # UI Components
│       │   ├── stage/                       # View switchers & device selectors
│       │   ├── mockups/apple/               # iPhone 16 Pro & iPad Pro 13" mockups
│       │   ├── mockups/google/              # Android Phone, Tab 7" & Tab 10" mockups
│       │   └── editor/                      # Real-time metadata cards & validators
│       ├── css/                             # Modular stylesheets (Apple, Google, Themes)
│       └── lib/                             # Local vendored canvas engine (html2canvas)
│
├── 📋 AGENCY CLIENT HANDOFF TOOLKIT
│   ├── Store_Preview_Studio_Test_Checklist.xlsx # Excel pre-flight sign-off checklist for clients
│   ├── AGENCY_MARKETING_FAQ.html            # 16-topic interactive ASO & store review knowledge base
│   └── TEST_CASES.html                      # Comprehensive 19-module QA test specification
│
└── 🎨 READY-TO-USE PRESETS (`presets/`)
    ├── store-preview-studio-template.json
    ├── saas-app-template.json
    ├── cyberstrike-rpg-game-template.json
    ├── zenmind-meditation-template.json
    ├── education-language-template.json
    └── fitness-tracker-template.json
```

---

## 🏷 White-Label & Custom Branding Guide

As a Pro license holder, you are permitted to re-brand the studio for internal team use or client-facing presentations:

1. **Change App Title & Brand**:
   * Open `src/components/header/brand.html`.
   * Update the brand name, SVG logo, or company tag line.
2. **Custom Accent Colors & Theme**:
   * Open `src/css/editor.css` to tweak primary accent colors, fonts, or sidebar widths.
3. **Rebuild Your Custom Version**:
   * Run `node build.js` — your customized app will be output to `store_preview_studio.html`.
   * Hand this single HTML file to your clients with your own agency branding!

---

## 📋 Using the Agency QA Toolkit with Clients

1. **`Store_Preview_Studio_Test_Checklist.xlsx`**:
   * Open in Microsoft Excel, Apple Numbers, or Google Sheets.
   * Send to clients as a formal pre-flight sign-off document before submitting to App Store Connect / Google Play Console.
   * Covers character count verification, icon alpha checks, age ratings, and screenshot dimension compliance.
2. **`AGENCY_MARKETING_FAQ.html`**:
   * Double-click to open in any browser.
   * Comprehensive answers to recurring client questions: *"Why does Apple reject icon transparency?", "Which fields can be edited without submitting a new binary?", "How do keyword fields work between iOS and Android?"*.

---

## ⚡ Fastlane CI/CD Pipeline Mapping

Automate metadata delivery directly from your studio exports into Fastlane:

| Field in Studio | Fastlane iOS (`deliver`) | Fastlane Android (`supply`) |
| :--- | :--- | :--- |
| **App Name** | `fastlane/metadata/ios/en-US/name.txt` | `fastlane/metadata/android/en-US/title.txt` |
| **Subtitle / Short** | `fastlane/metadata/ios/en-US/subtitle.txt` | `fastlane/metadata/android/en-US/short_description.txt` |
| **Promo Text** | `fastlane/metadata/ios/en-US/promotional_text.txt` | *(N/A)* |
| **Description** | `fastlane/metadata/ios/en-US/description.txt` | `fastlane/metadata/android/en-US/full_description.txt` |
| **Keywords** | `fastlane/metadata/ios/en-US/keywords.txt` | *(Optimized within full description)* |

---

## 🔒 Commercial Team License & Support

* **License**: You hold a **Team & Agency Commercial License** (`LICENSE.txt`). You may use this tool and modify its source code for unlimited in-house products and client agency deliverables. (Redistributing or reselling the raw source code as a competitor product on marketplaces is prohibited).
* **Direct Creator Support**:
  * Email: `support@previewstudio.app`
  * Web: [https://store-preview-studio.pages.dev](https://store-preview-studio.pages.dev)
