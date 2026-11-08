# Store Preview Studio · Commercial Release Standards (Quy Chuẩn Đóng Gói Thương Mại)

> **Mục tiêu**: Định nghĩa bộ tiêu chuẩn chất lượng bắt buộc (Quality Gates & Guardrails) cho mọi bản build thương mại được xuất xưởng qua lệnh `npm run release` (hoặc `node release.js`).
> **Áp dụng cho**: Hai gói sản phẩm thương mại phân phối trên Gumroad:
> - **Plus Edition ($29)**: File HTML độc lập, 6 presets, tài liệu hướng dẫn.
> - **Pro Studio ($49 / Gốc $69)**: Toàn bộ mã nguồn modular `src/`, dev server, bundler, 6 presets, Agency Playbook.

---

## 1. Tiêu chuẩn 1: Tính Độc Lập & 100% Offline (Zero-Cloud & Standalone)

Khách hàng mua Store Preview Studio vì tính riêng tư và khả năng làm việc không phụ thuộc vào máy chủ/SaaS thuê bao. Bản commercial bắt buộc phải thỏa mãn:

* [x] **Chạy trực tiếp qua giao thức `file://`**:
  * Người dùng chỉ cần click đúp vào file `store_preview_studio.html` trên bất kỳ trình duyệt nào (Chrome, Safari, Firefox, Edge) trên macOS, Windows, Linux là giao diện hiển thị ngay lập tức.
  * Không bắt buộc phải có web server local hay Node.js để chạy bản HTML hoàn chỉnh.
* [x] **Không tải tài nguyên từ bên ngoài (Zero Remote CDNs)**:
  * Không chứa thẻ `<script src="https://...">` hoặc `<link href="https://fonts.googleapis.com...">`.
  * Toàn bộ CSS, SVG icons, fonts dự phòng và engine `html2canvas` phải được nhúng trực tiếp (inlined) vào trong file `.html`.
* [x] **Tuyệt đối KHÔNG chứa mã theo dõi / phân tích hành vi (Zero Telemetry & Tracking)**:
  * Tuyệt đối không được chứa script của Microsoft Clarity, Google Analytics, Mixpanel, Hotjar, Facebook Pixel hay bất kỳ script thu thập thông tin người dùng nào.
  * Mọi dữ liệu bản nháp (drafts), cấu hình và hình ảnh chỉ được lưu trữ cục bộ trong trình duyệt của người dùng (`LocalStorage` và `IndexedDB`).

---

## 2. Tiêu chuẩn 2: Tính Toàn Vẹn Thương Mại (Zero Paywall & Full Unlocked)

Bản commercial là sản phẩm trả phí một lần — khách hàng đã trả tiền thì không bao giờ được nhìn thấy bất kỳ lời nhắc mua hàng hay giới hạn tính năng nào.

* [x] **Mở khóa 100% các tính năng chỉnh sửa**:
  * Cho phép chỉnh sửa tự do: App Name, Subtitle, Promotional Text, What's New release notes, Full Description, Developer Name, Category.
  * Không xuất hiện bất kỳ thông báo lỗi nào kiểu *"App Name is editable in Plus & Pro Edition"*.
* [x] **Không chứa mã kiểm tra bản demo (Zero `isDemoMode` Leaks)**:
  * File HTML build thương mại (`store_preview_studio.html`) phải chạy với `isRelease: true`, tự động vô hiệu hóa toàn bộ cơ chế Demo Guard.
  * Đối với gói Pro Studio (`src/`):
    * Bộ lọc `stripDemoBlocks()` phải loại bỏ triệt để mọi khối lệnh `if (typeof isDemoMode === 'function' && isDemoMode()...)`.
    * Tuyệt đối không copy các file paywall nội bộ vào gói Pro (`demo-guard.js`, `demo-upgrade-modal.css`, `demo-upgrade-modal.html`).
* [x] **Đầy đủ 6 Presets tiêu chuẩn**:
  * Đầy đủ 6 preset starter mẫu:
    1. `store-preview-studio-template.json` (Studio Default)
    2. `saas-app-template.json` (PulseFit)
    3. `cyberstrike-rpg-game-template.json` (CyberStrike RPG)
    4. `zenmind-meditation-template.json` (ZenMind Meditation)
    5. `education-language-template.json` (LinguaFlow)
    6. `fitness-tracker-template.json` (Fitness Tracker)
  * Mỗi preset phải có cấu trúc JSON hợp lệ, ảnh icon và screenshot mẫu hiển thị đúng chuẩn.

---

## 3. Tiêu chuẩn 3: Trải Nghiệm Developer & Tooling Cho Gói Pro

Khách hàng mua gói Pro là các Agency, Studio và Developer cần khả năng tùy biến cao và tích hợp vào quy trình làm việc của họ.

* [x] **Khởi chạy Local Dev Server 1-Click**:
  * Chạy `node dev.js` (hoặc `npm run dev`) phải kích hoạt ngay HTTP dev server local (port 3000) với tính năng Server-Sent Events (SSE) Live Reload mà **không cần cài thêm bất kỳ dependency npm nặng nề nào**.
  * Trên macOS: Cung cấp sẵn file `start_dev.command` (đã cấp quyền execute `chmod +x`) để designer hoặc khách không rành terminal click đúp là mở ngay dev server trong trình duyệt.
* [x] **Quy trình Build Sạch Sẽ (`build.js`)**:
  * Chạy `node build.js` (hoặc `npm run build`) tự động đọc toàn bộ các modules trong `src/` và biên dịch ra file `store_preview_studio.html` duy nhất.
  * File `customer-build.js` phải luôn được đồng bộ danh sách modules `CORE_JS_MODULES` từ mã nguồn chính.
* [x] **File `package.json` Tinh Gọn Cho Khách Hàng**:
  * File `package.json` trong gói Pro chỉ được chứa 2 lệnh:
    ```json
    "scripts": {
      "dev": "node dev.js",
      "build": "node build.js"
    }
    ```
  * Không để lộ các script nội bộ của tác giả (như `deploy:cf`, `surge`, `release.js`, script tạo banner...).
* [x] **Sẵn Sàng Cho White-Label (Gắn Thương Hiệu Riêng)**:
  * File `src/components/header/brand.html` và style được tổ chức rõ ràng để agency có thể dễ dàng thay thế logo Kai DevLabs thành logo thương hiệu của chính agency mình chỉ trong 2 phút.

---

## 4. Tiêu chuẩn 4: Tuân Thủ Pháp Lý & Thương Hiệu (Brand Safety & Copy Guardrails)

Tuân thủ nghiêm ngặt các quy định đã thiết lập trong `AGENTS.md`:

* [x] **Không sử dụng từ ngữ cam kết lố (No Overpromising Claims)**:
  * Cấm tuyệt đối trong copy, tài liệu `README.md`, `LICENSE.txt`, `AGENCY_MARKETING_FAQ.html`:
    * `pixel perfect`, `pixel-perfect`
    * `production ready`, `production-ready`
    * `with confidence` (ví dụ: "launch with confidence")
    * `zero server lock-in`
    * `100% guaranteed`, `flawless`
  * Thay thế bằng: `realistic device frames`, `adaptive frames`, `curated listings`, `locally in your browser`, `practical`, `high-resolution`.
* [x] **Gọi tên thiết bị theo danh mục chung (Generic Device Categories)**:
  * Không hardcode tên model cụ thể của Apple hay Samsung (như `iPhone 15 Pro`, `iPhone 16 Pro Max`, `Galaxy S24`).
  * Sử dụng các danh mục chuẩn: `iPhone`, `iPad`, `Android phone`, `Android tablet`, `phone & tablet`.
* [x] **An toàn bản quyền thương hiệu (Trademark Protection)**:
  * Không nhúng trực tiếp vector logo quả táo chính thức của Apple hoặc tam giác màu chính thức của Google Play làm logo đại diện.
  * Dùng silhouette hình học trung tính hoặc biểu tượng kho ứng dụng kèm disclaimer minh bạch.

---

## 5. Tiêu chuẩn 5: Cổng Kiểm Tra Tự Động (Automated Quality Gate)

Mỗi lần thực thi lệnh `npm run release`, hệ thống bắt buộc phải tự động kiểm tra và thông qua 100% các tiêu chí sau trước khi tạo file ZIP:

1. **Automated Unit Tests**:
   * Chạy toàn bộ test suite `node scripts/test-runner.js`.
   * **Bắt buộc 1,623+ tests đều PASS (Success Rate: 100.0%)**, không có bất kỳ test nào FAIL.
2. **Cú Pháp JavaScript (Suite 0)**:
   * Tất cả các file JS trong `src/js/` phải biên dịch thành công qua `vm.Script` không phát sinh lỗi cú pháp.
3. **Độ Toàn Vẹn File Standalone**:
   * File `store_preview_studio.html` và `store_preview_studio.min.html` phải tồn tại và kích thước hợp lệ (>1.5MB unminified, >800KB minified).
4. **Kiểm Tra Rò Rỉ Bản Demo (Demo Leak Gate)**:
   * Quét toàn bộ thư mục `dist/store-preview-studio-pro-v1.0/src/` để khẳng định không còn bất kỳ dòng code nào chứa `isDemoMode()` hoặc file modal nâng cấp demo.
5. **Đóng Gói File Nén (ZIP Delivery)**:
   * `store-preview-studio-plus-v1.0.zip` (< 1MB) chứa đầy đủ file HTML, 6 presets, `README.md`, `LICENSE.txt`.
   * `store-preview-studio-pro-v1.0.zip` (< 2MB) chứa mã nguồn sạch `src/`, `build.js`, `dev.js`, `package.json`, 6 presets, `AGENCY_MARKETING_FAQ.html`, `README.md`, `LICENSE.txt`.

---

## 6. Lệnh Thực Thi & Kiểm Tra Nhanh

```bash
# 1. Chạy toàn bộ 1,623 tests kiểm thử
npm test

# 2. Đóng gói bản phát hành thương mại kèm kiểm tra tiêu chuẩn
npm run release
```
