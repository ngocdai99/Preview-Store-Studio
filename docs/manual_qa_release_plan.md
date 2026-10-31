# Store Preview Studio · Manual QA Test Plan & Release Checklist

> **Mục tiêu**: Nghiệm thu toàn diện tính năng, giao diện và hiệu năng của Store Preview Studio trước khi đóng gói release và đưa lên Store.
> **Triết lý**: Manual test theo luồng người dùng thực tế (End-to-End User Journeys), bao phủ các góc khuất (Edge cases) và các thay đổi giao diện gần đây.

---

## 📌 Phân nhóm Mức độ Nghiêm trọng (Severity)
- **[P0 - Blocker]**: Lỗi làm crash app, mất dữ liệu draft, xuất sai kích thước mockup, tính năng cốt lõi không chạy.
- **[P1 - High]**: Lỗi hiển thị sai theme, tràn layout, nút bấm không phản hồi, dropdown không mở được.
- **[P2 - Normal]**: Lỗi thẩm mỹ nhỏ, độ tương phản nhẹ, animation khựng nhẹ khi load nặng.

---

## Track 1: Workspace Bar, Theming & Navigation (P0/P1)

### 1.1 Store Switcher (Apple App Store ↔ Google Play)
- [ ] **[P0]** Bấm chuyển đổi giữa **Apple** và **Google Play**:
  - Tiêu đề card, danh mục (Categories), nhãn (Labels) đổi chính xác theo store tương ứng.
  - Form ẩn/hiển thị các trường đặc thù:
    - Apple: Hiển thị *Subtitle*, *iPad Screenshots*, *App Privacy*.
    - Google Play: Ẩn Subtitle, hiển thị *Short Description*, *Feature Graphic*, *Tablet Screenshots*, *App Support*.
  - Khung Mockup đổi giao diện đúng chuẩn: Dynamic Island iOS vs Android Punch Hole/Status bar.

### 1.2 Dark Mode & Light Mode (UI Theme)
- [ ] **[P1]** Bấm nút Toggle Theme UI trên Toolbar:
  - **Light Mode**:
    - Nền drawer form phải là màu trắng tinh khiết (`#ffffff`), không còn màu xám bẩn hay tím xám.
    - Các card nổi lên rõ ràng nhờ hiệu ứng đổ bóng đa lớp (elevation shadow).
    - Tiêu đề *"Store Compliance Profile"* trong Privacy card đọc rõ ràng (màu đen slate `#0f172a`), không bị mờ/tàng hình.
  - **Dark Mode**:
    - Bề mặt Obsidian đen sâu (`#0b0f19`), specular highlight viền card sắc nét.
    - Tương phản văn bản và các nhãn input đạt chuẩn WCAG AAA.

### 1.3 Semantic Icon Chips trên Form Cards
- [ ] **[P1]** Kiểm tra 7 Form Cards ở cả 2 trạng thái:
  - **Thu gọn (Collapsed)**: Icon mang màu sắc pastel dịu dàng, phân biệt rõ từng card:
    - Card 1: Apple Blue (`#identityCard`)
    - Card 2: Radiant Purple (`#contentCard`)
    - Card 3: Rose Coral (`#shotsCard`)
    - Card 4: Emerald Mint (`#statsCard`)
    - Card 5: Sky Cyan (`#ipadCard` / `#tabCard`)
    - Card 6 (Google): Sunset Orange (`#featureCard`)
    - Card 6/8: Security Indigo (`#privacyCard`)
    - Card 7 (Google): Warm Amber (`#supportCard`)
  - **Mở rộng (Expanded & Selected)**: Icon chuyển sang gradient rực rỡ, card có viền phát sáng ambient glow cùng tone màu.

### 1.4 Preset Pills & Draft Persistence
- [ ] **[P0]** Chuyển đổi giữa 6 Presets có sẵn: Canvas cập nhật tức thì icon, tên app, screenshot, theme.
- [ ] **[P0]** Sửa bất kỳ trường nào trên form $\rightarrow$ Xuất hiện pill **Draft** có icon và tên ứng dụng đồng bộ.
- [ ] **[P0]** Reload trang $\rightarrow$ Bản Draft phải giữ nguyên 100% dữ liệu đã sửa (LocalStorage).
- [ ] **[P1]** Bấm dấu `x` trên Preset pill $\rightarrow$ Ẩn pill, mở lại được qua Menu.
- [ ] **[P0]** Thử reset draft (Menu $\rightarrow$ Reset Draft) $\rightarrow$ Modal xác nhận hiện ra, bấm đồng ý $\rightarrow$ Xóa sạch draft và đưa về preset mặc định.

---

## Track 2: Form Input & Validation từng Card (P0/P1)

### 2.1 Card 1: App Identity
- [ ] **[P0]** **App Icon Upload**:
  - Kéo thả file ảnh PNG/JPEG 1024x1024 vào ô Icon $\rightarrow$ Mockup cập nhật icon ngay lập tức.
  - Bấm nút **Inspect Icon** $\rightarrow$ Modal soi icon hiện ra với các góc bo tròn (Squircle iOS vs Circle Android).
- [ ] **[P1]** **Đếm ký tự (Grapheme Cluster Counter)**:
  - Nhập App Name quá 30 ký tự (Apple) $\rightarrow$ Bộ đếm báo đỏ cảnh báo vượt giới hạn.
  - Thử nhập Emoji (ví dụ: 👨‍👩‍👧‍👦, 🇻🇳) $\rightarrow$ Bộ đếm đếm chính xác 1 ký tự trực quan thay vì đếm sai byte.
- [ ] **[P1]** **Category Dropdown**:
  - Bấm mở dropdown thể loại $\rightarrow$ Có ô search filter gõ tìm nhanh.
  - Chọn 1 danh mục $\rightarrow$ Phản ánh đúng vào metadata của App.
- [ ] **[P1]** **Supported Devices**:
  - Bỏ chọn checkbox *iPad* $\rightarrow$ Card 5 (iPad) tự động ẩn. Tích chọn lại $\rightarrow$ Hiện lại nguyên vẹn.

### 2.2 Card 2: Description & Release Notes
- [ ] **[P1]** Nhập text có định dạng xuống dòng, bullet points $\rightarrow$ Mockup hiển thị ngắt dòng đúng chuẩn Store.
- [ ] **[P2]** Xem phần *What's New / Version History* trên Mockup $\rightarrow$ Hiển thị tooltip popover đầy đủ.

### 2.3 Card 3: Phone Screenshots
- [ ] **[P0]** Upload hàng loạt ảnh screenshot (3 - 10 ảnh):
  - Thumbnail hiển thị đầy đủ trong card.
  - Kéo thả sắp xếp lại thứ tự (Drag & Drop Reorder) $\rightarrow$ Mockup đổi thứ tự theo.
  - Bấm nút xóa ảnh $\rightarrow$ Xóa đúng ảnh, counter cập nhật.
  - Bấm nút Fit / Fill $\rightarrow$ Chuyển đổi giữa vừa khung và tràn viền mượt mà.

### 2.4 Card 4: Settings & Metrics
- [ ] **[P1]** Sửa điểm đánh giá (Rating: e.g. 4.9) và số lượng Reviews (e.g. 128K) $\rightarrow$ Ribbon thông số trên mockup đổi theo.
- [ ] **[P1]** Dropdown độ tuổi (Age Rating) $\rightarrow$ Chọn 4+, 9+, 12+, 17+ (Apple) hoặc 3+, 7+, 12+, 16+, 18+ (Google) hiển thị đúng badge.

### 2.5 Card 5: Tablet / iPad Screenshots
- [ ] **[P1]** Upload ảnh iPad Pro 13" (Apple) hoặc Tablet 10" (Google):
  - Chuyển tab view sang Tablet $\rightarrow$ Ảnh hiển thị sắc nét, không bị méo tỉ lệ.

### 2.6 Card 6 (Google): Feature Graphic
- [ ] **[P1]** Upload banner Google Play 1024x500 px:
  - Ảnh hiển thị đầu trang chi tiết Google Play.
  - Thử tải file quá 15MB hoặc có kênh Alpha trong suốt $\rightarrow$ Hệ thống cảnh báo đúng quy định Google.

### 2.7 Card Privacy & Data Safety
- [ ] **[P1]** Bấm nút **Inspect** trong Compact Box $\rightarrow$ Mở modal chi tiết Privacy nutrition labels.
- [ ] **[P1]** Chuyển tab Apple / Google trong modal $\rightarrow$ Các mục thu thập dữ liệu hiển thị rõ ràng.

---

## Track 3: Clone Store App (iTunes Public API) (P0/P1)

- [ ] **[P0]** **Mở Modal**:
  - Bấm nút **`Clone Store App`** trên Toolbar $\rightarrow$ Modal mở lên với tiêu đề chuẩn: **`Clone from Apple App Store`** (badge `iOS only`).
- [ ] **[P0]** **Test Quick Chips**:
  - Bấm nút **Spotify** $\rightarrow$ Tự điền ID `324684580`.
  - Bấm nút **Clone App** $\rightarrow$ Trạng thái loading quay $\rightarrow$ Thông báo thành công $\rightarrow$ Toàn bộ thông tin Spotify (Icon, Title, Subtitle, Screenshots) được clone vào canvas.
- [ ] **[P0]** **Test nhập Link thực tế**:
  - Dán một link App Store bất kỳ từ trình duyệt (ví dụ: link app Duolingo hoặc TikTok).
  - Bấm Clone $\rightarrow$ Phân tích regex URL đúng Country code và App ID, cào dữ liệu thành công.
- [ ] **[P1]** **Xử lý Ngoại lệ (Error Handling)**:
  - Ngắt kết nối mạng (hoặc gõ ID rác `99999999999`) $\rightarrow$ Modal hiển thị thông báo lỗi thân thiện, không làm treo ứng dụng.
  - Banner mạng hiển thị chính xác trạng thái Online/Offline.

---

## Track 4: Canvas, Mockup Viewport & Controls (P0/P1)

- [ ] **[P0]** **Chuyển đổi Thiết bị (Device Selector)**:
  - Bấm chọn iPhone $\rightarrow$ Render iPhone Mockup.
  - Bấm chọn iPad $\rightarrow$ Render iPad Pro 13" Mockup.
- [ ] **[P1]** **Chuyển Viewport (Product Detail ↔ Search Results)**:
  - Apple: Xem trang chi tiết App vs Xem kết quả tìm kiếm (Search Card hiển thị icon, tên, rating, 3 screenshots nằm ngang).
  - Google Play: Xem trang chi tiết vs Xem Search Card.
- [ ] **[P1]** **Mockup Theme (Light / Dark Mockup)**:
  - Bấm nút đổi theme của mockup $\rightarrow$ Màn hình bên trong điện thoại đổi sang Dark Mode (nền đen) hoặc Light Mode (nền trắng).
- [ ] **[P2]** **Thao tác phóng to / cuộn (Zoom & Pan)**:
  - Bấm Zoom in / Zoom out / Fit to Screen $\rightarrow$ Canvas zoom mượt mà.
  - Cuộn ngang gallery screenshot trên mockup $\rightarrow$ Vuốt kéo mượt, không bị giật lag.

---

## Track 5: Export & Import Engine (P0)

- [ ] **[P0]** **Export PNG**:
  - Bấm Export $\rightarrow$ Phone Screenshots (ZIP hoặc Single PNG).
  - Mở file PNG đã tải về:
    - Kích thước ảnh xuất ra chuẩn pixel gốc (không bị vỡ hạt do tỉ lệ màn hình client).
    - Font chữ, icon, gradient, bóng đổ render nguyên vẹn.
    - Không bị dính thanh cuộn hay viền focus thừa.
- [ ] **[P0]** **Export Project (JSON)**:
  - Bấm Export $\rightarrow$ Project Backup (JSON) $\rightarrow$ Tải về file `.json`.
  - Mở file kiểm tra: Có đủ thông tin App, screenshots (base64/blobs), metrics.
- [ ] **[P0]** **Import Project (JSON)**:
  - Reset toàn bộ draft về trắng.
  - Vào Menu $\rightarrow$ **Import JSON** $\rightarrow$ Chọn file vừa tải về.
  - Toàn bộ dữ liệu khôi phục 100% khớp với lúc export.
- [ ] **[P1]** **Export Text / Markdown**:
  - Xuất bản tóm tắt ASO / Store Copy $\rightarrow$ Nội dung copy vào clipboard chuẩn markdown.

---

## Track 6: Edge Cases, Giới hạn Quota & Chaos Testing (P0/P1)

- [ ] **[P0]** **Kiểm tra Giới hạn Bộ nhớ (LocalStorage Quota)**:
  - Upload 10 screenshots dung lượng lớn (mỗi ảnh vài MB).
  - Quan sát xem cơ chế `High-Capacity Storage Engine` có xử lý nén/lưu an toàn không.
  - Kiểm tra Console không có lỗi `QuotaExceededError`.
- [ ] **[P1]** **Chế độ Offline hoàn toàn (No Internet)**:
  - Tắt Wi-Fi hoàn toàn.
  - Thử tải lại trang `core.html` từ ổ đĩa local.
  - Thử sửa draft, đổi theme, upload ảnh, export PNG.
  - Mọi tính năng phải chạy trơn tru 100% (ngoại trừ nút Clone từ Apple Store sẽ báo cần kết nối mạng).
- [ ] **[P1]** **Spam Click & Race Conditions**:
  - Bấm đổi liên tục giữa Apple và Google Play trong 3 giây.
  - Click mở/đóng liên tục các card accordion.
  - Ứng dụng không bị đứng hình, không văng lỗi JS trong DevTools Console.

---

## Track 7: Cross-Browser & Pre-Store Packaging (P1/P2)

- [ ] **[P1]** **Google Chrome / Chromium**: Chạy hoàn hảo, font San Francisco / Roboto hiển thị chuẩn.
- [ ] **[P1]** **Apple Safari (macOS / iPadOS)**:
  - Kiểm tra render đổ bóng `box-shadow`, bo tròn góc `backdrop-filter`.
  - Kiểm tra export ảnh bằng `html2canvas` trên Safari không bị trắng màn hình.
- [ ] **[P2]** **Mozilla Firefox**: Kiểm tra thanh cuộn tùy chỉnh `scrollbar-gutter: stable`.
- [ ] **[P0]** **Checklist Đóng gói Deploy**:
  - Chạy `npm test` đạt **883/883 tests pass**.
  - File build độc lập `core/core.html` là file duy nhất (Zero external CDN dependency, font local, thư viện nhúng sẵn).
  - Không có warning bảo mật nghiêm trọng trong bundle.

---

## 📋 Mẫu ghi nhận lỗi nhanh khi test (Bug Log Template)
Nếu gặp bug trong quá trình manual test, ghi nhanh theo format sau:
```markdown
- **Vị trí**: [Card số mấy / Menu / Canvas / Modal nào]
- **Store & Mode**: [Apple/Google] · [Light/Dark]
- **Thao tác**: Bước 1 -> Bước 2 -> Bước 3
- **Hiện tượng**: [Mô tả lỗi hoặc dán ảnh chụp màn hình]
- **Mong muốn**: [Hành vi đúng cần có]
```
