# Store Preview Studio · Plus Edition
### Zero-Server Dual-Store Preview & Metadata Optimization Suite

> **Congratulations on your purchase of Store Preview Studio Plus Edition!**  
> The standalone, 100% offline studio to design, preview, validate, and export pixel-perfect App Store and Google Play listings.

---

## 🚀 Quick Start (In 10 Seconds)

1. **Launch Studio**: Double-click **`store_preview_studio.html`** in Finder/File Explorer to open it in your favorite web browser (Chrome, Safari, Brave, Edge, or Arc).
   - Alternatively via terminal: `open store_preview_studio.html`
2. **Zero Setup Required**: No Node.js, no terminal commands, and no web servers needed. It is a 100% self-contained standalone application.
3. **100% Private & Offline**: Works completely offline. Zero tracking, zero telemetry, and zero third-party cloud uploads. Your unreleased screenshots and confidential metadata never leave your machine.

---

## 📦 What's Inside Your Package

```text
store-preview-studio-plus-v1.0/
├── store_preview_studio.html      # The complete standalone studio application
├── README.md                      # This user guide & reference manual
├── LICENSE.txt                    # Single-User Lifetime Commercial License
└── presets/                       # 6 high-converting starter templates
    ├── store-preview-studio-template.json
    ├── saas-app-template.json
    ├── cyberstrike-rpg-game-template.json
    ├── zenmind-meditation-template.json
    ├── education-language-template.json
    └── fitness-tracker-template.json
```

---

## ⚡ Key Features & How to Use

### 1. Dual-Store Multi-Device Switcher
* **1-Click Store Toggle**: Switch between **Apple App Store (iOS 18 HIG)** and **Google Play (Material Design 3)** in the top header.
* **5 Device Form Factors**:
  * **Apple**: iPhone 16 Pro, iPad Pro 13".
  * **Google**: Android Phone, 7-inch Tablet, 10-inch Tablet.
* **Dual Phone Viewport**: Compare iOS and Android mockups side-by-side with real-time synchronized editing.
* **Portrait & Landscape Game Mode**: Rotate phones and tablets to preview landscape games with automatic 16:9 widescreen screenshot scaling.
* **Theme Controls**: Toggle Dark Mode and Light Mode for both the studio canvas and the simulated device OS.

### 2. Built-in Compliance Audits
* **App Icon Alpha Channel Detection**: Catches transparent pixels (`alpha < 250`) that trigger Apple ITMS-90717 rejection. Features a 1-click **Auto-Flatten to Opaque** tool.
* **Hardware Dimension Check**: Verifies icons against official guidelines (`1024×1024 px` for iOS, `512×512 px` for Android).
* **Strict Character Limits (`Intl.Segmenter`)**:
  * **App Store**: Title (30), Subtitle (30), Promotional Text (170), Description (4,000), Keywords (100).
  * **Google Play**: App Title (30), Short Description (80), Full Description (4,000).
  * Shows visual warnings as you approach 90% and red shake animations if limits are exceeded.

### 3. Presets & Data Management
* **Load Starter Presets**: Use the **Presets** dropdown in the header or drag-and-drop any JSON file from the `presets/` folder.
* **Save / Backup Drafts**: Export your listing as a `.json` backup anytime to resume work later or share with colleagues.
* **Live App Cloner**: Paste any public App Store URL to instantly import title, subtitle, ratings, and screenshots for competitive analysis.

### 4. High-Res Export & Client Handoff
* **Ultra HD 4K Mockups**: Export crystal-clear Retina screenshots (`.png`) without watermarks.
* **Complete Package ZIP**: 1-click export of your screenshots gallery + icons + listing metadata.
* **`LISTING_METADATA.md`**: Clean Markdown handoff document for product managers, copywriters, or client approvals.

---

## 🛠 Fastlane Automation Mapping

You can quickly paste generated metadata into your automated Fastlane pipelines:

| Field in Studio | Fastlane iOS Path | Fastlane Android Path |
| :--- | :--- | :--- |
| **App Name** | `fastlane/metadata/ios/en-US/name.txt` | `fastlane/metadata/android/en-US/title.txt` |
| **Subtitle / Short** | `fastlane/metadata/ios/en-US/subtitle.txt` | `fastlane/metadata/android/en-US/short_description.txt` |
| **Promo Text** | `fastlane/metadata/ios/en-US/promotional_text.txt` | *(N/A)* |
| **Description** | `fastlane/metadata/ios/en-US/description.txt` | `fastlane/metadata/android/en-US/full_description.txt` |
| **Keywords** | `fastlane/metadata/ios/en-US/keywords.txt` | *(Injected via description ASO)* |

---

## 🔒 Commercial License & Support

* **License**: You hold a **Single-User Lifetime Commercial License** (`LICENSE.txt`). You can use Store Preview Studio for unlimited personal, employer, and client projects.
* **Need Support or Have Feedback?**
  * Email: `support@previewstudio.app`
  * Web: [https://store-preview-studio.pages.dev](https://store-preview-studio.pages.dev)

*(Looking for full modular source code, white-label branding, or agency QA checklists? You can upgrade to the **Pro Studio & Agency Edition** anytime by contacting support).*
