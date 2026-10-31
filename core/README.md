# Store Preview Studio
### Commercial-Grade Dual-Store Preview & Metadata Optimization Suite

> **The standalone, zero-server studio for Mobile Developers, ASO Specialists, Game Studios, and Digital Agencies to preview, validate, and export pixel-perfect App Store and Google Play listings.**

---

## Quick Start

1. Open **`core.html`** (or `store_preview_studio.html`) in **Brave Browser** (or any modern web browser: Brave, Safari, Edge, Chrome, Firefox).
   - Or run via terminal: `open core.html`
2. **Zero installation required** — no Node.js, no Docker, and no server configuration when simply using the studio.
3. Everything runs **100% Client-Side** with zero tracking and zero telemetry. Your confidential metadata, pre-release screenshots, and strategy remain strictly private on your machine.

---

## Developer Mode, Live Reload & Release Packaging

If you are customizing the modular source code in `src/`:
- **macOS 1-Click Live Dev Server**:
  Double-click **`start_dev.command`** in Finder (auto-starts the watcher server and opens `http://localhost:3000`).
- **Start Live Dev Server via Terminal**:
  ```bash
  node dev.js
  ```
  *(Automatically opens `http://localhost:3000`. Any code change in `src/` triggers an instant browser reload via SSE without manual refresh).*
- **Bundle & Package Commercial Release**:
  ```bash
  node build.js           # Bundle standalone core.html (and store_preview_studio.html)
  node build.js --watch   # Auto-bundle on file change
  node build.js --release # Minify & package store-preview-studio-v1.0.zip for Gumroad
  ```

---

## Key Features

### 1. Dual-Store Multi-Device & Landscape Simulation
- Seamless 1-click toggle between **Apple App Store (iOS 18 HIG)** and **Google Play Store (Material Design 3)**.
- **5 Hardware Form Factors**: iPhone, iPad, Android Phone, 7-inch Tablet, and 10-inch Tablet.
- **Portrait & Landscape Game Mode**: Rotate phones and tablets to preview landscape mobile games, with automatic 16:9 widescreen screenshot detection.
- Toggle between **Light Mode** and **Dark Mode** for both the studio UI and the device mockups.

### 2. Real-time App Icon, Screenshot & Character Limit Validators
- **App Icon Alpha & Dimension Scanner**: Uses `<canvas>` to detect alpha transparency (`alpha < 250`, which causes Xcode / App Store Connect rejection) and checks exact dimensions (`1024×1024 px` for iOS, `512×512 px` 1:1 for Google Play), featuring a **1-Click Auto-Flatten & Resize** button.
- **Interactive Store Guidelines Tooltips**: Built-in reference popovers for **iOS App Icon & Xcode Asset Catalog (`Assets.xcassets`)** and **Google Play Feature Graphic (`1024×500 px`)**.
- **Strict Grapheme Character Counter (`Intl.Segmenter`)**:
  - **App Store**: App Name (30), Subtitle (30), Promotional Text (170), Description (4,000), Keywords (100).
  - **Google Play**: App Title (30), Short Description (80), Full Description (4,000).
  - Visual amber warning at ≥90% capacity and crimson shake animation (`shake-overlimit`) when limits are exceeded.
- **Google Play Screenshot Compliance Badge**: Validates the 2–8 screenshot requirement for phone, 7-inch, and 10-inch tablets.

### 3. Dynamic App Privacy, Data Safety & Store Badges
- **Live Privacy Cards**: Customize Apple's *"Data Linked to You"* and *"Data Not Linked to You"* nutritional labels and Google Play's *"Data Safety"* practices with smart keyword-to-icon matching.
- **Age Rating & Monetization Badges**: Switch between `4+ / Everyone (E)`, `9+ / E10+`, `12+ / Teen (T)`, `17+ / Mature (M)` and customize In-App Purchases / Contains Ads badges.
- **Illustrative Metrics Control**: Edit or hide sample ratings, review counts, chart ranks, download tiers, and app size before client handoff.

### 4. 1-Click Export & Handoff Pipeline (100% Offline)
- **Ultra-HD Mockup Export (PNG)**: Capture pixel-perfect **3x Ultra-HD**, **3x Screen-Only (Frameless)**, or **2x Retina** PNG mockups completely offline (`html2canvas` bundled inline).
- **Export Markdown (`LISTING_METADATA.md`)**: Generates a complete submission report including character compliance tables, graphic asset checklists, App Privacy & Data Safety declarations, and Fastlane CLI paths.
- **Export & Import JSON Config (v2.1.0)**: Save and restore full workspace states via button or drag-and-drop with strict schema validation and UTF-8 BOM handling.
- **1-Click Copy All Text**: Copy all listing text, privacy declarations, and store badges to your clipboard.
- **LocalStorage Auto-Save**: Automatically preserves your active session across browser reloads.

### 5. Built-in International Templates & Presets
- **Store Preview Studio**: Meta Developer Tool & ASO Mockup Showcase.
- **TaskFlow**: SaaS Productivity & Daily Habit Planner.
- **PulseFit**: Health, Fitness & Calorie Tracker.
- **ZenMind**: Meditation, Mindfulness & Sleep Soundscapes.
- **CyberStrike**: Sci-Fi Action RPG Mobile Game (120 FPS, Landscape/Portrait, Teen 12+ rating, game-specific privacy labels).
- **EduLearn**: Language Learning & Skill Academy (Education category, rich achievements & course curriculum).
- **None (Blank)**: Clean slate ready for new projects.

---

## Package Structure (Gumroad Release Packages)

### 1. Plus Edition ($29) — `store-preview-studio-plus-v1.0.zip`
```
store-preview-studio-plus-v1.0/
├── store_preview_studio.html              # Main standalone offline application (Full 6 Presets)
├── README.md                              # Documentation & user guide
├── LICENSE.txt                            # Commercial single-user license
└── presets/                               # Ready-to-use JSON listing presets (v2.1.0)
    ├── store-preview-studio-template.json
    ├── saas-app-template.json
    ├── fitness-tracker-template.json
    ├── zenmind-meditation-template.json
    ├── cyberstrike-rpg-game-template.json
    └── education-language-template.json
```

### 2. Pro Studio Edition ($39) — `store-preview-studio-pro-v1.0.zip`
```
store-preview-studio-pro-v1.0/
├── store_preview_studio.html              # Main standalone offline application (Full 6 Presets)
├── README.md                              # Documentation & user guide
├── AGENCY_MARKETING_FAQ.html              # Interactive 16-question ASO & store release guide
├── TEST_CASES.html                        # Comprehensive 19-module QA test specification
├── Store_Preview_Studio_Test_Checklist.xlsx # Interactive QA spreadsheet checklist
├── LICENSE.txt                            # Commercial team & agency license
├── build.js / dev.js                      # Asset compiler & live dev server
├── src/                                   # Full modular source code
└── presets/                               # Ready-to-use JSON listing presets (v2.1.0)
    ├── store-preview-studio-template.json
    ├── saas-app-template.json
    ├── fitness-tracker-template.json
    ├── zenmind-meditation-template.json
    ├── cyberstrike-rpg-game-template.json
    └── education-language-template.json
```

---

## Advanced Usage & Tips

### Fastlane Metadata Mapping
You can use the **Export Markdown** or **Copy All Text** feature to rapidly populate your Fastlane deliver/supply folders:
- `fastlane/metadata/android/en-US/title.txt` ➔ App Name
- `fastlane/metadata/android/en-US/short_description.txt` ➔ Short Description
- `fastlane/metadata/android/en-US/full_description.txt` ➔ Full Description
- `fastlane/metadata/ios/en-US/name.txt` ➔ App Name
- `fastlane/metadata/ios/en-US/subtitle.txt` ➔ Subtitle
- `fastlane/metadata/ios/en-US/promotional_text.txt` ➔ Promotional Text
- `fastlane/metadata/ios/en-US/description.txt` ➔ Full Description
- `fastlane/metadata/ios/en-US/keywords.txt` ➔ Keywords

### Agency & Marketing Knowledge Base (FAQ)
Detailed breakdown answering the top 16 recurring questions from marketing teams and agencies regarding Apple App Store vs. Google Play Store release rules, metadata indexing, and character limits:
**[Open the Interactive Agency & Marketing FAQ Guide](./AGENCY_MARKETING_FAQ.html)**

---

## Privacy & Security

Store Preview Studio executes entirely within your browser's local sandbox:
- **No external server calls** are made to save or transmit your app listing text or images.
- **No analytics, external web fonts, or tracking cookies**.
- Works **100% offline**.

---

## License

This product is distributed under the **Commercial End-User License Agreement** (see `LICENSE.txt`). You are licensed to use this tool for unlimited personal and client projects. Reselling or redistributing the source code is prohibited.

