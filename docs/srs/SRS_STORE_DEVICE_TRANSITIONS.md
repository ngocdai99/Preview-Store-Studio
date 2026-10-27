# Software Requirements Specification (SRS)
## Store Switcher & 3D Spatial Device Transitions Engine

- **Project:** Store Preview Studio
- **Subsystem:** Store Switcher & Device Spatial Transition Engine
- **Target Modules:**
  - Logic & Animation Orchestrator: `src/js/modules/transitions.js`
  - Display Rules & Visibility: `src/css/apple/rules.css`
  - Segment Control & Pill Styling: `src/css/header/store-switcher.css`
  - Hardware Compositing & Device Frames: `src/css/stage/frames.css`, `src/css/stage/animations.css`, `src/css/stage/canvas.css`
- **Specification Version:** 1.0.0
- **Status:** Implemented, Verified & Released
- **Verification Coverage:** 446/446 Automated Tests Passing (100% Success Rate)

---

### 1. Architectural Principles

#### Principle 0: Zero-Latency Tab Feedback (< 1ms)
The segmented control indicator (`.seg .pill`) and button active states (`button.on`) must update synchronously upon the user's click. 
1. Tab switching must never be throttled or deferred behind device exit timers (`setTimeout`), asynchronous layout computations, or transition completion events.
2. The pill indicator utilizes hardware-accelerated CSS transforms (`transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1)`) and direct theme class assignments (`.is-apple`, `.is-google`, `.is-dual`) to slide and morph its color palette instantaneously.

#### Principle 1: In-Flow Spatial Persistence (Zero-Flick Dual Transitions)
When transitioning from Dual View to Single Store View (App Store or Google Play):
1. Both devices must remain fully present in the flexbox document flow throughout the animation duration (420ms).
2. The dataset attribute `document.body.dataset.dual` must remain `'true'` during the entire slide duration. Setting `data-dual="false"` at 0ms causes the departing device to collapse immediately (`display: none`), which prematurely pulls the remaining device to center and inverts the slide direction into an unnatural backward jump.
3. The departing device gently dissolves in-flow (`opacity: 0; transform: scale(0.92) translate3d(0, 6px, 0)` over 360ms).
4. The destination device smoothly glides along the X-axis from its original side position into the exact optical center of the stage over 420ms.
5. DOM mode synchronization (`onApply()`) is executed strictly at the conclusion of the transition timer (420ms).

#### Principle 2: FLIP Animation for Single-to-Dual Expansion
When expanding from a Single Store View to Dual View:
1. **First:** Capture the unconstrained initial client bounding rectangle of the active device at the center (`firstA` or `firstG`).
2. **Last:** Apply target store DOM state (`data-dual="true"`), run `fit()`, and read the new flexbox bounding rectangle where the device naturally rests on its side (`lastA` or `lastG`).
3. **Invert:** Compute the displacement delta `deltaX = (first.left - last.left) / zoom` and apply an instantaneous zero-duration transform `translate3d(deltaX, deltaY, 0)`, placing the device visually right back at its starting center position.
4. **Play:** Animate `translate3d(0, 0, 0)` over 420ms with `cubic-bezier(0.16, 1, 0.3, 1)` while simultaneously blooming the companion device in from `opacity: 0, scale(0.92)`.

#### Principle 3: GPU Layer Isolation & 60fps Frame Budget
Every device mockup (`.dev`) must maintain an isolated compositing layer on the GPU:
- `-webkit-backface-visibility: hidden; backface-visibility: hidden;`
- `transform-style: preserve-3d;`
- `will-change: transform, opacity;`
- `transform: translateZ(0);`
Heavy DOM re-rendering routines (`renderShots()`, `renderIpadShots()`, `validateScreenshots()`, `validateAppIcon()`, and full markdown `update()`) must be completely excluded from the transition hot-path to ensure the main thread never misses its 16.6ms render budget.

---

### 2. State Machine & Transition Matrix

| From Mode | To Mode | Strategy | Duration | Easing Function | Lifecycle Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `apple` | `google` | Staggered Glide | 190ms exit + 360ms enter | Exit: `cubic-bezier(0.25, 1, 0.5, 1)`<br>Enter: `cubic-bezier(0.16, 1, 0.3, 1)` | Apple glides left (-35px) and fades out. At 190ms Apple is hidden (`.is-hidden-trans`), DOM updates, Google enters from right (+35px, scale 0.96) to center. |
| `google` | `apple` | Staggered Glide | 190ms exit + 360ms enter | Exit: `cubic-bezier(0.25, 1, 0.5, 1)`<br>Enter: `cubic-bezier(0.16, 1, 0.3, 1)` | Google glides right (+35px) and fades out. At 190ms Google is hidden, DOM updates, Apple enters from left (-35px, scale 0.96) to center. |
| `dual` | `apple` | In-Flow Glide & Dissolve | 420ms | Active: `cubic-bezier(0.16, 1, 0.3, 1)`<br>Exit: `cubic-bezier(0.16, 1, 0.3, 1)` | Dual layout maintained. Apple glides from left to center (`+deltaX`). Google dissolves in-place (`scale 0.92, opacity 0`). At 420ms, `onApply()` sets single store mode and hides Google. |
| `dual` | `google` | In-Flow Glide & Dissolve | 420ms | Active: `cubic-bezier(0.16, 1, 0.3, 1)`<br>Exit: `cubic-bezier(0.16, 1, 0.3, 1)` | Dual layout maintained. Google glides from right to center (`-deltaX`). Apple dissolves in-place (`scale 0.92, opacity 0`). At 420ms, `onApply()` sets single store mode and hides Apple. |
| `apple` | `dual` | FLIP Expansion | 440ms | Glide: `cubic-bezier(0.16, 1, 0.3, 1)`<br>Bloom: `cubic-bezier(0.16, 1, 0.3, 1)` | Layout switches to Dual. Apple inverts to center position, then glides to left side. Google blooms in from center-right (`scale 0.92 -> 1, opacity 0 -> 1`). |
| `google` | `dual` | FLIP Expansion | 440ms | Glide: `cubic-bezier(0.16, 1, 0.3, 1)`<br>Bloom: `cubic-bezier(0.16, 1, 0.3, 1)` | Layout switches to Dual. Google inverts to center position, then glides to right side. Apple blooms in from center-left (`scale 0.92 -> 1, opacity 0 -> 1`). |

---

### 3. Mathematical Models & Displacement Calculations

#### 3.1 Stage Optical Center
The target alignment center is always derived from the primary viewport container `.stage`:
```javascript
const stageEl = document.querySelector('.stage');
const stageRect = stageEl.getBoundingClientRect();
const stageCenterX = stageRect.left + stageRect.width / 2;
```

#### 3.2 Dual to Single Displacement (`deltaX`)
When transitioning from Dual View to Single View, the displacement distance must account for the computed CSS zoom factor to maintain pixel-perfect translation:
```javascript
// Dual -> Apple (Apple moving from Left to Center)
const firstA = devApple.getBoundingClientRect();
const appleCenterX = firstA.left + firstA.width / 2;
const zoomA = parseFloat(window.getComputedStyle(devApple).zoom) || 1;
const deltaX = isCol ? 0 : (stageCenterX - appleCenterX) / zoomA;

// Dual -> Google (Google moving from Right to Center)
const firstG = devGoogle.getBoundingClientRect();
const googleCenterX = firstG.left + firstG.width / 2;
const zoomG = parseFloat(window.getComputedStyle(devGoogle).zoom) || 1;
const deltaX = isCol ? 0 : (stageCenterX - googleCenterX) / zoomG;
```

#### 3.3 Single to Dual FLIP Inversion Delta
When expanding from Single to Dual:
```javascript
const deltaX = (firstRect.left - lastRect.left) / currentZoom;
const deltaY = (firstRect.top - lastRect.top) / currentZoom;
```

---

### 4. CSS Architecture & Specificity Resolution

#### 4.1 Transition Protection Class (`body.is-animating-store`)
During animations, default store rules (`body[data-store=apple] .dev.google { display: none !important; }`) would prematurely destroy elements mid-flight. The transition system uses a high-specificity override:
```css
/* Ensure devices remain visible in DOM flow during transitions */
body.is-animating-store .dev.apple.single,
body.is-animating-store .dev.google,
body.is-animating-store #dev-phone.dev.google {
  display: block !important;
}

/* Explicit exclusion for non-participating devices */
body.is-animating-store .dev.apple.single.is-hidden-trans,
body.is-animating-store .dev.google.is-hidden-trans,
body.is-animating-store #dev-phone.dev.google.is-hidden-trans {
  display: none !important;
}
```

#### 4.2 Segmented Control Pill Theming
The tab pill utilizes CSS transitions on `transform` and `width`, combined with direct class selectors:
```css
.pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  border-radius: 10px;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), 
              width 0.28s cubic-bezier(0.16, 1, 0.3, 1), 
              background 0.25s ease, 
              box-shadow 0.25s ease, 
              border-color 0.25s ease;
  pointer-events: none;
  z-index: 0;
  will-change: transform, width;
}

.pill.is-apple {
  background: #0071e3 !important;
  box-shadow: 0 3px 14px rgba(0, 113, 227, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.pill.is-google {
  background: #03875f !important;
  box-shadow: 0 3px 14px rgba(3, 135, 95, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.pill.is-dual {
  background: linear-gradient(135deg, #0071e3 0%, #03875f 100%) !important;
  box-shadow: 0 3px 14px rgba(59, 130, 246, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}
```

---

### 5. Edge Cases & Resilience Safeguards

1. **Rapid Multi-Click Interception:** Any new call to `transitionStoreMode` or `setStore` immediately invokes `clearDevTransitions()`, purging pending `setTimeout` IDs (`devExitTimer`, `devEnterTimer`), resetting inline styles, and restoring clean layout state before initiating the new animation.
2. **Tablet Device Bypass:** If the current device is iPad (`appleDevice === 'ipad'`) or an Android tablet (`googleDevice !== 'phone'`), spatial 3D dual slide transitions are bypassed in favor of clean instant state application, preventing invalid dimension interpolations.
3. **Small Screen Fallback (`isCol`):** When screen width drops below 721px, devices stack vertically rather than horizontally. `deltaX` calculations evaluate `isCol` and suppress horizontal translation.
4. **Storage Persistence Deferral:** `saveState()` is called strictly after the transition reaches completion, preventing synchronous `localStorage` serialization from hitching active frames.

---

### 6. Verification & Regression Checklist

- [x] Clicking any store tab updates pill indicator and button state in < 1ms.
- [x] Dual -> App Store: Google fades out smoothly in-flow; Apple glides from left to center; zero backward snap.
- [x] Dual -> Google Play: Apple fades out smoothly in-flow; Google glides from right to center; zero backward snap.
- [x] App Store -> Dual View: Apple glides from center to left; Google blooms in with subtle scale; zero jitter.
- [x] Google Play -> Dual View: Google glides from center to right; Apple blooms in with subtle scale; zero jitter.
- [x] App Store <-> Google Play: Staggered cross-glide with zero element collisions.
- [x] 100% test pass rate across all 446 automated regression test cases.
