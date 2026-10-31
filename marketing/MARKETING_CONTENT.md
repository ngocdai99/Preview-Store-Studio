# Store Preview Studio — Marketing Content Repository
> Toàn bộ nội dung chữ (copywriting), cấu trúc đề mục, bảng giá, so sánh, testimonials, câu hỏi thường gặp (FAQ) và modal được trích xuất từ trang marketing hiện tại (đã loại bỏ phần Mini-Studio) kết hợp các điểm mạnh từ đối thủ StorePreviewer.com. Dùng file này làm nguồn cấp dữ liệu cho `config/site.ts` trong dự án React / Next.js mới.

---

## 1. Metadata & SEO

* **App Name**: `Store Preview Studio`
* **Headline / Slogan**: `The zero-server, 100% offline studio to design, preview, and validate Apple App Store & Google Play listings with realistic device mockups.`
* **Base URL**: `https://store-preview-studio.pages.dev/`
* **OpenGraph Image**: `https://store-preview-studio.pages.dev/og-image.png?v=20261026-4k` (1280 × 720 px)
* **Twitter Card**: `summary_large_image`
* **Favicon / App Icon**: `app-icon.svg`, `favicon.svg`
* **Default Theme**: `light` (hỗ trợ chuyển đổi `light` / `dark`)

---

## 2. Navigation Bar (Header)

* **Brand Title**: `Store Preview Studio`
* **Menu Links**:
  1. **Preview**: `#showcase` (hoặc video demo loop)
  2. **Features**: `#features`
  3. **Why Us**: `#comparison`
  4. **Reviews**: `#testimonials`
  5. **Pricing**: `#pricing`
  6. **FAQ**: `#faq`
* **CTA Button**:
  * Label: `View Pricing`
  * Target: `#pricing`

---

## 3. Hero Section

* **Category Badge**: `Mockup Studio for App Store & Google Play`
* **Main Heading (H1)**:
  > Stop guessing how your app listing looks before submitting.
* **Sub-headline**:
  > Save 2 hours of back-and-forth with your client before every App Store submission.  
  > App Store Connect & Google Play provide zero live preview — preview and refine your listings with confidence.
* **Primary CTAs**:
  * `Explore Live Showcase` (cuộn tới video preview loop)
  * `Get Lifetime Access — $29` (scroll đến `#pricing`)
* **Trust / Micro Badge**: `100% Offline · Zero Server · Pay Once, Keep Forever`

---

## 4. Features Section (Tính năng nổi bật & Smart Detection)

* **Section Title**: `Built for mobile developers, agencies, and ASO pros.`
* **Section Subtitle**: `Everything you need to craft, review, and ship perfect app listings without messy spreadsheets or design templates.`

| # | Feature | Icon Suggestion | Chi tiết nội dung |
|---|---|---|---|
| **01** | **Realistic Modern Device Frames** | `Smartphone` / `Tablet` | Hardware bezels for iPhone 16/15 Pro with Dynamic Island, iPad Pro, Android flagship phones, and tablets. Supports landscape game mode viewports and dark/light OS themes. |
| **02** | **Smart Size & Compliance Detection** | `ShieldAlert` / `CheckCheck` | Automatically verifies screenshot dimensions against official App Store (6.7", 6.5", iPad 12.9") & Google Play guidelines. Warns you instantly about invalid aspect ratios and illegal iOS icon transparency (alpha channels). |
| **03** | **Dual-Store Sync & Unicode Counters** | `ArrowLeftRight` / `Sparkles` | Author Apple & Google listings side-by-side. Uses native grapheme cluster segmentation (`Intl.Segmenter`) so complex emojis and symbols never trigger surprise store metadata rejections. |
| **04** | **1-Click Preset & Zip Export** | `FileDown` / `FolderArchive` | Export portable JSON presets to backup configurations or transfer between teammates. Bulk export clean 4K Retina screenshot bundles with instant client-side ZIP generation. |
| **05** | **100% Private & Standalone Offline** | `ShieldCheck` / `WifiOff` | Zero servers, zero analytics, zero external API dependencies. A single self-contained HTML file that runs straight in any browser. Your unreleased client assets and secret copy never leave your local RAM. |

---

## 5. Comparison Section (Why Us — Vấn đề & Giải pháp)

* **Badge**: `The Problem vs The Solution`
* **Section Title**: `The blind submission headache is over.`
* **Cột tiêu đề đối chiếu**:
  * **Without Preview Studio**: `Blind form fields, spreadsheets & $29/mo recurring subscriptions`
  * **With Preview Studio**: `Interactive visual workspace · 100% Offline · Pay once, keep forever`

### Chi tiết 4 luận điểm đối chiếu (4 Editorial Beats):

#### Beat 01: Team Access & Handoff
* **Vấn đề (Without)**:
  * Title: *Marketers without developer accounts, drafting blindly in Google Docs*
  * Desc: Writing copy in shared docs leads to endless back-and-forth with developers over character limits, missing specs, and broken layouts.
* **Giải pháp (With)**:
  * Badge: `INDEPENDENT MARKETING WORKFLOW`
  * Title: *Preview and validate listings without needing developer accounts*
  * Desc: Finalize store pages with confidence. Hand over paste-ready copy and assets to developers with zero back-and-forth.

#### Beat 02: Release Planning
* **Vấn đề (Without)**:
  * Title: *No visibility into which changes require a new app release*
  * Desc: No way to know whether an edit can go live instantly or requires developers to compile and submit a new binary — leading to surprise rebuild requests and delayed campaigns.
* **Giải pháp (With)**:
  * Badge: `PROACTIVE RELEASE PLANNING`
  * Title: *Know what updates live vs. what needs a new release*
  * Desc: Plan marketing campaigns with confidence, and only loop in developers when a new app release is actually required.

#### Beat 03: Visual Context & Mockups
* **Vấn đề (Without)**:
  * Title: *Drafting blindly with zero device preview or outdated frames*
  * Desc: Typing copy into raw form inputs leaves you guessing. Awkward line wraps and cut-off text stay hidden until the app is live.
* **Giải pháp (With)**:
  * Badge: `VISUAL DEVICE MOCKUPS`
  * Title: *Authentic, pixel-perfect iOS & Android mockups*
  * Desc: Preview in real time across iPhone (Dynamic Island), iPad, and Android screens. Catch awkward truncations and layout bugs long before release day.

#### Beat 04: Pricing & Privacy
* **Vấn đề (Without)**:
  * Title: *$29/mo recurring subscriptions & mandatory cloud uploads*
  * Desc: Third-party SaaS tools charge recurring monthly fees and force you to upload unreleased client assets to third-party cloud servers.
* **Giải pháp (With)**:
  * Badge: `100% PRIVATE & OFFLINE`
  * Title: *One-time purchase · Pay once, keep forever*
  * Desc: A self-contained HTML file running locally on your machine. Zero subscriptions, zero logins, zero servers, and complete peace of mind.

---

## 6. Social Proof & Testimonials (Phân loại theo 3 tệp khách hàng)

* **Section Title**: `Loved by creators, trusted by agencies.`
* **Section Subtitle**: `See how founders, designers, and ASO specialists streamline their app launch workflow.`

### Card 1: Startup Founder Persona
* **Trích dẫn**:  
  > *"Before Preview Studio, every App Store submission felt like flying blind. We'd submit metadata, wait 2 days for review, only to realize the title wrapped awkwardly on smaller iPhones. Preview Studio saved us hours of back-and-forth before our launch day."*
* **Khách hàng**: **Alex Rivera**
* **Chức danh / Vai trò**: `Startup Founder · Shipped 4 iOS Apps`
* **Điểm nổi bật**: Tiết kiệm thời gian, tránh bị delay ngày ra mắt sản phẩm.

### Card 2: Agency Partner & Freelancer Persona
* **Trích dẫn**:  
  > *"Our clients always asked: 'Can we see what the store page will actually look like before we approve the screenshots?' We used to build messy PowerPoint decks. Now we just export clean 4K mockups or share the standalone file. It makes our agency deliverables look 10x more professional."*
* **Khách hàng**: **Marcus Vance**
* **Chức danh / Vai trò**: `Partner at AppCraft Studio · ASO & Growth Agency`
* **Điểm nổi bật**: Tăng tính chuyên nghiệp khi gửi deliverables nghiệm thu cho khách hàng.

### Card 3: Mobile Product Designer Persona
* **Trích dẫn**:  
  > *"Figma templates for App Store screenshots get outdated every time Apple changes bezel radiuses or introduces a new Dynamic Island. Preview Studio gives me instant, hardware-accurate frames and catches illegal icon transparency before engineering touches it."*
* **Khách hàng**: **Elena Rostova**
* **Chức danh / Vai trò**: `Lead Product Designer · FinTech Mobile Suite`
* **Điểm nổi bật**: Khung mockup chuẩn xác, tự động phát hiện lỗi kỹ thuật (kích thước, alpha channel).

---

## 7. Pricing Section (Bảng giá gói mua 1 lần)

* **Banner thông báo**: 
  * Tag: `EARLY BIRD IS LIVE`
  * Text: `Special launch pricing for early supporters · Instant offline delivery`
* **Section Title**: `One-time purchase. No subscription.`
* **Section Desc**: `Zero recurring fees. Standalone offline HTML studio. Pay once, keep your copy forever.`

### Gói 1: Plus Edition
* **Tier Name**: `Plus Edition` (Badge: `PLUS` + `EARLY BIRD`)
* **Mô tả ngắn**: `For indie developers and creators who need a fast, standalone offline preview studio.`
* **Giá**:
  * Giá gốc: `~~$39~~`
  * Giá khuyến mãi: **`$29`** (one-time payment)
* **Quyền lợi & Tính năng**:
  * [x] Clean 4K Ultra HD Export `[No Watermark]`
  * [x] iPhone, iPad & Android Phone/Tablet frames
  * [x] Smart Size & Icon Alpha Channel Detection
  * [x] Store Listing Metadata Export `[Markdown & Copy]`
  * [x] Store Character & Emoji Counters
  * [x] 100% Offline Single-File Studio `[.html]`
  * [x] Single-User Commercial License
* **CTA Button**: `Get Plus Edition ($29)`

### Gói 2: Pro Studio (Featured / Khuyên dùng)
* **Tier Name**: `Pro Studio` (Badge: `PRO` + `EARLY BIRD`)
* **Mô tả ngắn**: `For agencies, studios, and developers requiring commercial client licensing and full source code.`
* **Giá**:
  * Giá gốc: `~~$59~~`
  * Giá khuyến mãi: **`$39`** (one-time payment)
* **Quyền lợi & Tính năng**:
  * [x] **Everything in Plus Edition**, plus:
  * [x] Team & Agency License `[Unlimited Client Work]`
  * [x] Full Modular Source Code `[src/]`
  * [x] White-label Ready `[Custom Agency Branding]`
  * [x] Live-Reload Dev Server & Bundler `[build.js]`
  * [x] Agency Marketing & ASO Playbook `[HTML offline]`
* **CTA Button**: `Get Pro Studio ($39)`

### Phạm vi hỗ trợ (Scope Note):
* **What’s covered**: Preview Studio previews what customers see (title, subtitle, description, icon, screenshots).
* **What’s not covered**: It does not preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires.

---

## 8. About the Maker — Run by a Human (Triết lý Indie Maker)

* **Badge**: `Bootstrapped & Independent`
* **Title**: `Crafted by an indie developer, not a faceless SaaS conglomerate.`
* **Story Copy**:
  > "Hi, I'm the creator behind Store Preview Studio. 
  > 
  > Like many of you, I got sick of paying $29/month to bloated SaaS platforms just to see how an app screenshot looks inside a phone frame. I also hated having to upload confidential, unreleased client screenshots to third-party servers.
  > 
  > That's why I built Store Preview Studio as a **100% offline, single-file HTML tool**. Pay once, keep it forever, with zero server bills and zero tracking.
  > 
  > When you buy a license, you're directly supporting an independent craftsperson. If you ever have a question or need a new device frame, you won't get a robot ticket — you'll talk directly to the person who wrote the code."
* **Signature**: `Built with craftsmanship for mobile developers worldwide.`

---

## 9. Frequently Asked Questions (FAQ)

### Q1: Offline Architecture
* **Hỏi**: *Does Store Preview Studio require an active internet connection?*
* **Đáp**: No. Store Preview Studio runs 100% locally in your browser. All scripts, icons, CSS styles, and fonts are completely self-contained. You can use it on airplanes, remote locations, or behind corporate firewalls with zero telemetry and zero external server calls.

### Q2: Store Review Policy
* **Hỏi**: *Can Store Preview Studio guarantee that my app will pass App Store or Google Play review?*
* **Đáp**: **No, and no software tool on the market can.** Store Preview Studio gives you realistic visual mockups and catches mechanical formatting mistakes (such as wrong icon dimensions, transparent alpha channels on iOS, or invalid screenshot aspect ratios). However, final app approval is determined entirely by the official Apple and Google review teams based on your compiled code, privacy policies, and store guidelines.

### Q3: Scope & Coverage
* **Hỏi**: *What parts of a store listing does Preview Studio actually cover?*
* **Đáp**: Preview Studio previews what customers see on your store page: title, subtitle, description, app icon, and screenshots across iOS, iPadOS, and Android. It does **not** preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires — those remain managed directly inside Apple and Google consoles.

### Q4: Commercial License
* **Hỏi**: *Can I use Store Preview Studio for client projects?*
* **Đáp**: Yes! Both the Plus and Pro tiers include full commercial licenses. You can author, optimize, and present store listings for as many apps as you wish — on a single-user basis. If you need multiple seats or unlimited client work, upgrade to Pro Studio which includes a full Team & Agency license.

### Q5: Client Review Handoff
* **Hỏi**: *Do my clients need a $99/year Apple Developer or Google Play account to view previews?*
* **Đáp**: No! In native store consoles, clients cannot view or review listings unless they hold a paid developer account and console invite. With Store Preview Studio, you simply hand over the standalone HTML file or export JSON presets — clients can review realistic listings directly in any browser with zero logins and zero fees.

### Q6: Product Updates
* **Hỏi**: *How do updates work after purchase?*
* **Đáp**: You receive all maintenance patches and store spec adjustments for the current version for free via your download link. Major future editions with new platforms or hardware generations will be offered to existing customers at a steep upgrade discount.

---

## 10. Launch / Early-Bird Waitlist Modal

* **Badge Tag**: `Official Launch This Week` · `Special Launch Offer`
* **Modal Title**: `Official Launch Next Week`
* **Modal Description**:
  > Store Preview Studio is in the final stages of QA and polish, officially launching next week. Enter your email to reserve your early-bird price and get access the moment checkout opens.
* **Perks (Quyền lợi Early Bird)**:
  1. **Early Bird Launch Discount**: Lock in $29 for Plus or $39 for Pro before the price increases to $39 / $59.
  2. **Instant Offline Delivery**: Standalone single-file HTML studio with lifetime access and zero Node.js setup.
* **Form Copy**:
  * Input Placeholder: `developer@company.com`
  * Submit Button: `Get Early Invite`
  * Privacy Note: `No spam. We only send 1 email when we officially launch.`
* **Success State Message**:
  * Title: `You're on the VIP Early Bird List`
  * Description: `We've reserved your slot. You will be among the first creators to receive the direct checkout link and special launch pricing.`
  * Action: `Return to Interactive Preview`

---

## 11. Footer

* **Navigation Links**:
  * `Why Us` (`#comparison`)
  * `Reviews` (`#testimonials`)
  * `Pricing` (`#pricing`)
  * `FAQ` (`#faq`)
  * `Gumroad Store` (`https://gumroad.com/l/store-preview-studio`)
* **Copyright**: `© 2026 Store Preview Studio. Built for mobile craftspeople worldwide.`
