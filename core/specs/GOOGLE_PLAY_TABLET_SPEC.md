# Software Requirements Specification (SRS): Google Play Tablet Mockup

**Document Version:** 1.0.0  
**Target Platform:** Android Tablet (7-inch & 10-inch form factors)  
**Design System:** Google Material You (Material 3) for Large Screens  
**Status:** Approved Reference Spec (Single Source of Truth)

---

## 1. Executive Summary & Purpose

This specification defines the exact DOM architecture, CSS layout contracts, and visual styling for rendering Google Play Store detail listings on tablet viewports (7-inch compact tablets and 10-inch+ large screen tablets).

It serves as the immutable reference for:
1. Developers inspecting the layout structure without needing live Android hardware.
2. AI agents pair-programming across sessions without losing layout context.
3. Automated regression testing and visual QA.

---

## 2. Tablet Physical Specs & Viewport Resolutions

| Device Category | Target Physical Size | Aspect Ratio | Mockup Stage Viewport | Hardware Bezel Radius | Screen Radius |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10-inch Tablet (Large)** | 10.95" (Pixel Tablet / Galaxy Tab) | **16:10** | `1024 × 640 px` (Landscape) | `36px` | `22px` |
| **7-inch Tablet (Compact)** | 7.0" – 8.4" (Nexus 7 / Galaxy Tab A) | **16:10** | `768 × 480 px` (Landscape) | `32px` | `18px` |

---

## 3. Core Architectural Difference: Phone vs. Tablet

Unlike Google Play on mobile phones (which stacks all elements into a single vertical scroll stream), Google Play on Tablets utilizes a **Dual-Column Responsive Canvas**:

```
+----------------------------------------------------------------------------------------------------+
| Status Bar (Time, Wi-Fi, Battery)                                                                  |
+----------------------------------------------------------------------------------------------------+
| Top Bar (Back Arrow, Search Box / App Title, Bookmark, Overflow Menu)                              |
+-------------------------------------------------+--------------------------------------------------+
| LEFT HERO COLUMN (40% - 45% width)              | RIGHT HERO COLUMN (55% - 60% width)              |
|                                                 |                                                  |
| [ ICON 96px ]                                   | Device Switcher Chips: [Phone] [Tablet] [Chrome] |
| App Title (24px Google Sans)                    |                                                  |
| Developer Name (14px)                           | Tablet Screenshot Gallery (16:10 Landscape /     |
| Badges: In-app purchases · Contains ads         | 3:4 Portrait Carousel with 12px gap)             |
|                                                 |                                                  |
| Metrics Row: ★ Rating · Reviews · Downloads     |                                                  |
| [ Install CTA Button (Full-width / Pill 24px) ] |                                                  |
| Security: [✓] Verified by Play Protect          |                                                  |
+-------------------------------------------------+--------------------------------------------------+
| LOWER CONTENT GRID (Two-Column Split)                                                              |
|                                                                                                    |
| LEFT COLUMN (50%):                              | RIGHT COLUMN (50%):                              |
| - About this app (Header + Arrow)               | - Ratings & Reviews                              |
| - Short & Full Description                      | - Big Score (4.8) + 5-Star Distribution Bars     |
| - Category & Top Chart Chips                    | - Sample Review Cards with Helpful votes         |
| - Data Safety Accordion                         | - Developer Contact info                         |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Semantic DOM Hierarchy (Contract)

```html
<div class="dev gtab gtab10" id="dev-tab10">
  <div class="gtab-bezel">
    <div class="gtab-cam"></div>
    <div class="phone google gtab-screen" data-theme="light">
      
      <!-- 1. System Status Bar -->
      <header class="sb">
        <span class="clock google-clock">09:41</span>
        <span class="sb-icons">▾ ◢ ▰</span>
      </header>

      <!-- 2. Scrollable Store Container -->
      <main class="scr">
        
        <!-- Top App Bar Navigation -->
        <nav class="g-top">
          <button class="g-top-back" aria-label="Back">...</button>
          <div class="g-top-actions">...</div>
        </nav>

        <!-- Upper Hero Section: Two-Column Grid -->
        <section class="gt-hero">
          
          <!-- Left: Identity, Badges & CTA -->
          <div class="gt-hero-meta">
            <div class="gt-brand">
              <img class="g-ico" data-icon alt="App Icon">
              <div class="gt-brand-text">
                <h1 class="g-name" data-b="name">App Name</h1>
                <p class="g-dev" data-b="dev">Developer Name</p>
                <div class="g-iap" data-iap-google>In-app purchases</div>
              </div>
            </div>

            <!-- Stats Bar (Rating, Age, Downloads) -->
            <div class="g-met gt-met">
              <div class="st-cell">
                <b><span data-stat="rating">4.8</span> ★</b>
                <small><span data-stat="count">100K</span> reviews</small>
              </div>
              <div class="st-cell">
                <span class="age-badge" data-age-google-badge>E</span>
                <small data-age-google-lbl>Everyone</small>
              </div>
              <div class="st-cell">
                <b><span data-stat="dl">1M+</span></b>
                <small>Downloads</small>
              </div>
            </div>

            <!-- CTA Install Button -->
            <div class="gt-cta-wrap">
              <button class="inst gt-inst">Install</button>
            </div>

            <!-- Security Assurance -->
            <div class="gt-protect">
              <svg class="gt-protect-ico">...</svg>
              <span>Verified by Play Protect</span>
            </div>
          </div>

          <!-- Right: Tablet Screenshot Showcase -->
          <div class="gt-hero-gallery">
            <div class="gt-device-chips">
              <span class="gt-chip">Phone</span>
              <span class="gt-chip active">Tablet</span>
              <span class="gt-chip">Chromebook</span>
            </div>
            <div class="gal gt-gal" id="galTab10" data-gal-tab10>
              <!-- 16:10 / 16:9 Tablet Screenshots -->
            </div>
          </div>

        </section>

        <!-- Lower Section: Content & Reviews -->
        <section class="gt-body-cols">
          <div class="gt-main-col">
            <!-- About this app -->
            <div class="g-h"><span>About this app</span></div>
            <p class="g-sd" data-b="short"></p>
            <div class="chips">
              <span class="chip" data-b="cat">Productivity</span>
              <span class="chip">#1 Top Free</span>
            </div>
            <!-- Data safety -->
            <div class="g-safety-card">...</div>
          </div>

          <div class="gt-side-col">
            <!-- Ratings and Reviews -->
            <div class="g-h"><span>Ratings and reviews</span></div>
            <div class="gt-review-summary">...</div>
            <div class="g-reviews-list">...</div>
          </div>
        </section>

      </main>

      <!-- Bottom / Rail Navigation Bar -->
      <nav class="gnav">
        <div><span>Games</span></div>
        <div class="on"><span>Apps</span></div>
        <div><span>Search</span></div>
        <div><span>Books</span></div>
      </nav>

    </div>
  </div>
</div>
```

---

## 5. CSS Sizing & Spacing Tokens

```css
:root {
  /* 10-inch Tablet Dimensions */
  --tab10-width: 1024px;
  --tab10-height: 640px;
  --tab10-bezel-pad: 18px;
  --tab10-radius: 36px;
  --tab10-screen-radius: 22px;
  --tab10-icon-size: 96px;
  --tab10-gallery-height: 250px;

  /* 7-inch Tablet Dimensions */
  --tab7-width: 768px;
  --tab7-height: 480px;
  --tab7-bezel-pad: 16px;
  --tab7-radius: 32px;
  --tab7-screen-radius: 18px;
  --tab7-icon-size: 80px;
  --tab7-gallery-height: 175px;

  /* Google Colors & Tokens */
  --g-green: #00875f;
  --g-green-hover: #00704f;
  --g-green-active: #005a3f;
  --g-surface: #ffffff;
  --g-surface-dark: #121212;
  --g-text-primary: #1f1f1f;
  --g-text-secondary: #444746;
}
```

---

## 6. Verification Criteria

1. **Aspect Ratio Preservation:** Screenshots in the tablet gallery maintain their 16:10 or 16:9 ratio without stretching or horizontal cropping.
2. **Horizontal Scrolling:** The `.gt-gal` gallery scrolls smoothly without causing the parent container to break or overflow.
3. **Responsive Two-Column Hero:** On 10-inch tablet landscape mode, the left meta block and right gallery sit side-by-side. If rotated to portrait mode, they gracefully stack vertically.
4. **Offline Zero-Dependency:** The standalone spec preview runs with 100% offline assets (SVG inline icons and data-uris).
