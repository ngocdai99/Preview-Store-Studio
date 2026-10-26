# Google Play Store · Chuẩn Cấu Trúc DOM & Thứ Tự Content Cho Android Phone (DOM Specification)

> **Phạm vi thiết bị:** Dành riêng cho Android Phone (Google Play Mobile).
> **Cơ sở tham chiếu:** Trích xuất từ DOM chính thức của Google Play Store Web (`https://play.google.com/store/apps`) và cấu trúc render trên Android Phone Mockup trong Mini Studio (`docs/src/marketing/components/mini-studio.html` - ID `#msPhoneGoogle`) và Pro Studio (`src/index.html` - ID `#phoneGoogle`).
> **Mục đích:** Quy chuẩn hóa 100% thứ tự render và cấu trúc hiển thị cho Mockup Android Phone trên cả **Pro Studio (`src/`)** và **Marketing Mini Studio (`docs/src/marketing/`)**.

---

## 1. Cấu Trúc Thứ Tự 9 Khối Chuẩn Trên Android Phone (Top-to-Bottom Hierarchy)

```text
Khung phần cứng Android Phone:
├── Camera nốt ruồi đỉnh màn hình (.ms-hole)
└── Status Bar (.ms-sb) với đồng hồ (.ms-clock-google: "09:41")

Thân trang cuộn (Scroll Container .ms-body):
1. Top Navigation Bar (.ms-g-top)
   ├── Icon mũi tên quay lại (Back arrow)
   └── Khối tác vụ góc phải (.ms-g-top-act):
       ├── Icon Bookmark / Danh sách yêu thích (Wishlist)
       └── Icon Menu 3 chấm (Overflow menu)

2. App Header (.ms-g-head)
   ├── Icon ứng dụng 512×512 (Chuẩn full-bleed squircle bo góc 20%: img.ms-g-ico)
   └── Cột thông tin nhà phát hành:
       ├── App Name (Tối đa 30 graphemes: .ms-g-name)
       └── Developer Name (.ms-g-dev)

3. Metrics Shelf (.ms-g-met)
   ├── Rating Chip: Điểm số trung bình (ví dụ: 4.9 sao) + Lượt nhận xét ([data-bind="count"] reviews)
   ├── Downloads Chip: Tổng số lượt tải xuống ([data-bind="dl"]: ví dụ 50K+)
   └── Content Rating Chip: Nhãn phân loại ESRB ([data-bind="esrb"]: E) + Nhãn đầy đủ ([data-bind="esrbLabel"]: Everyone)

4. Primary Call to Action Button (Nút Cài Đặt)
   └── Nút "Install" (.ms-inst) - Nút dạng fill màu chủ đạo của Google Play, trải rộng 100% chiều ngang.
   * QUY TẮC BẮT BUỘC: NẰM NGAY DƯỚI METRICS SHELF VÀ PHÍA TRÊN SCREENSHOT GALLERY.

5. Screenshot Gallery (.ms-gal)
   └── Dải ảnh chụp màn hình Android (Horizontal Carousel trượt ngang data-gal, tỷ lệ chuẩn điện thoại Android).

6. About this app / Về Ứng Dụng Này (.ms-g-blk)
   ├── Tiêu đề: "About this app" kèm icon mũi tên chuyển trang (.g-desc-arrow)
   ├── Short Description (.ms-g-sd[data-bind="short"]): Mô tả ngắn tối đa 80 graphemes
   ├── Full Description: Giữ trạng thái ẩn (<span data-b="desc" hidden></span>), KHÔNG RENDER inline trên trang chính
   └── Dải thẻ phân loại (.ms-chips):
       ├── Category ([data-bind="catGoogle"]: ví dụ Productivity)
       ├── Rank Badge (#1 Top Free)
       └── Các thẻ tính năng phụ (Habit Tracker, Focus...)
   * QUY TẮC BẮT BUỘC: Short description của Google Play luôn nằm trong khối này, không nằm trên header. Full description không hiện trên DOM trang chính mà mở sang màn hình phụ độc lập khi ấn mũi tên.

7. Data safety / An Toàn Dữ Liệu (.ms-g-blk)
   ├── Tiêu đề: "Data safety" kèm mũi tên chi tiết
   ├── Đoạn văn bản mở đầu (.ms-safe-intro: Tuyên bố chính sách thu thập dữ liệu)
   ├── Danh sách cam kết an ninh (.ms-safe):
   │   ├── Hàng 1: "No data shared with third parties" (Kèm link Learn more)
   │   ├── Hàng 2: "Data is encrypted in transit"
   │   └── Hàng 3: "You can request data deletion"
   └── Nút bấm mở rộng (.ms-safe-more: "See details")

8. Ratings and reviews / Đánh Giá & Nhận Xét (.ms-g-blk)
   ├── Tiêu đề: "Ratings and reviews" kèm mũi tên
   ├── Thông báo xác thực: Nhận xét từ người dùng cùng loại thiết bị
   ├── Bảng phân bổ điểm đánh giá (.ms-g-rating-breakdown):
   │   ├── Cột trái (.ms-g-rb-left): Điểm số lớn, 5 sao vàng, tổng số lượt review
   │   └── Cột phải (.ms-g-rb-bars): 5 thanh đo tiến trình số lượng sao từ 5 xuống 1 (.ms-g-bar-fill)
   └── Danh sách nhận xét chi tiết (.ms-g-reviews-list > .ms-g-rev-card):
       ├── Hàng đầu (.ms-g-rev-head): Avatar tròn chữ cái đầu tác giả, tên tác giả, menu 3 chấm
       ├── Hàng sao & ngày (.ms-g-rev-stars): 5 sao vàng + Ngày đăng nhận xét
       ├── Thân nhận xét (.ms-g-rev-body): Nội dung phản hồi chi tiết
       ├── Số lượt hữu ích (.ms-g-rev-helpful: ví dụ "108 people found this review helpful")
       └── Tương tác phản hồi (.ms-g-rev-actions: "Did you find this helpful? [Yes] [No]")

9. App support / Hỗ Trợ Ứng Dụng (.ms-g-blk)
   ├── Tiêu đề: "App support" kèm icon mũi tên mở rộng
   └── Khối liên hệ (.ms-g-sup):
       ├── Website
       ├── Phone number ([data-bind="phone"])
       ├── Email ([data-bind="email"])
       ├── Privacy policy
       └── About the developer: Tên nhà phát triển, email, quốc gia (Vietnam)

Thanh điều hướng dưới cùng (Bottom Navigation Bar):
└── Google Play Navigation chuẩn 4 tab (.ms-gnav: Games, Apps, Search [active], Books)
```

---

## 2. Bảng Đối Chiếu DOM Thật vs Class Trong Dự Án

| STT | Khối Section | Class trong Pro Studio (`src/`) | Class trong Marketing Mini Studio (`docs/`) | Data Bind Attribute |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Top Navigation Bar | `.g-top`, `.g-top-act` | `.ms-g-top`, `.ms-g-top-act` | (Static SVG icons) |
| **2** | App Header | `.g-head`, `.g-ico`, `.g-name`, `.g-dev` | `.ms-g-head`, `.ms-g-ico`, `.ms-g-name`, `.ms-g-dev` | `name`, `dev`, `iconGoogle` |
| **3** | Metrics Shelf | `.g-met`, `.esrb` | `.ms-g-met`, `.esrb` | `rating`, `count`, `dl`, `esrb`, `esrbLabel` |
| **4** | Install CTA Button | `.g-inst` | `.ms-inst` | (Button action) |
| **5** | Screenshot Gallery | `.gal` | `.ms-gal` | `data-gal`, `data-f="shots"` |
| **6** | About this app | `.g-blk`, `.g-sd`, `.chips` | `.ms-g-blk`, `.ms-g-sd`, `.ms-chips` | `short`, `catGoogle`, `rank` |
| **7** | Data safety | `.g-blk`, `.safe`, `.safe-row` | `.ms-g-blk`, `.ms-safe`, `.ms-safe-row` | (Policy checklist) |
| **8** | Ratings and reviews | `.g-rating-breakdown`, `.g-rev-card` | `.ms-g-rating-breakdown`, `.ms-g-reviews-list`, `.ms-g-rev-card` | `rating`, `count` |
| **9** | App support | `.g-blk`, `.g-sup` | `.ms-g-blk`, `.ms-g-sup` | `phone`, `email`, `dev` |
| **10** | Bottom Navigation | `.gnav` | `.ms-gnav` | (Tabs: Games, Apps, Search, Books) |

---

## 3. Các Quy Tắc Hiển Thị Bắt Buộc Trên Android Phone (Golden Rules)

1. **Vị trí nút Install (CTA):**
   - Nút "Install" (`.ms-inst`) BẮT BUỘC nằm ngay bên dưới Metrics Shelf (`.ms-g-met`) và ngay bên trên Screenshot Gallery. Đây là điểm khác biệt cốt lõi so với cấu trúc của Apple App Store (vốn đặt nút GET trên Header).
2. **Short Description đặt trong "About this app":**
   - Mô tả ngắn của ứng dụng (`.ms-g-sd` - tối đa 80 graphemes) bắt buộc nằm bên dưới tiêu đề khối "About this app", đi kèm với dải thẻ phân loại ngành hàng (`.ms-chips`).
3. **Cấu trúc khối Data safety:**
   - Khối An toàn dữ liệu BẮT BUỘC nằm ngay sau khối "About this app" và trước khối "Ratings and reviews".
   - Phải hiển thị 3 chỉ báo an toàn: Không chia sẻ bên thứ ba, Mã hóa trên đường truyền, Có thể yêu cầu xóa dữ liệu.
4. **Biểu đồ phân bổ đánh giá (Rating Breakdown Bars):**
   - Khác với Apple (chỉ cần điểm lớn và số lượt rating ở bản mini), Google Play yêu cầu 5 thanh tiến trình đo lường số sao từ 5 xuống 1 kèm nhãn tỷ lệ tương đối.
5. **Thẻ nhận xét người dùng Android:**
   - Card đánh giá (`.ms-g-rev-card`) phải có avatar tròn mang ký tự đầu của tác giả (viết hoa), có dòng đếm số người thấy hữu ích và 2 nút phản hồi "Yes" / "No".
6. **Cắt chuỗi an toàn (Safe Truncation):**
   - App Name tối đa 30 graphemes, Short Description tối đa 80 graphemes. Khi vượt giới hạn, hệ thống tự động gắn class `.ms-trunc` và hiển thị tooltip cảnh báo, đảm bảo không phá vỡ bố cục hiển thị trên màn hình điện thoại.
7. **Full Description không xuất hiện trên DOM Listing chính:**
   - Khác với Apple App Store (vốn render Full Description ngay dưới Screenshots), Google Play chỉ render Short Description (tối đa 80 graphemes) trên DOM trang sản phẩm chính (`<span data-b="desc" hidden></span>`).
   - Trên ứng dụng Google Play thực tế, người dùng phải ấn vào nút mũi tên "About this app" (`.g-desc-arrow`) để chuyển hướng sang màn hình chi tiết độc lập.
   - **Cơ chế Focus Linking & Circular Highlight:** Khi người dùng focus vào ô `Full Description` (`#f-desc`) trên Form Editor, Preview Studio tự động cuộn màn hình điện thoại đến vị trí khối "About this app" và bôi viền vàng tròn phát sáng (`.g-desc-arrow.hl-target`, bo tròn `50% !important; outline: 2px solid #f59e0b; outline-offset: 2px`) quanh icon nút mũi tên tròn.
8. **Trường Version & Release Date không hiển thị trên DOM Google Play:**
   - Cả hai trường Version (`#f-ver`) và Release Date (`#f-rdate`) đều không xuất hiện trên storefront listing chính của Google Play (`<span data-b="ver" hidden></span>` và `<span data-b="rdate" hidden></span>`). Trong Google Play Console, số hiệu phiên bản và ngày phát hành được tự động trích xuất từ file gói (AAB) và thời điểm phát hành thực tế, developer không tự nhập tay khi tạo listing.
   - Ngược lại, trên Apple App Store, cả hai trường này hiển thị song hành công khai trong khối What's New (`Version 2.4.0 · Oct 18`).
   - Do đó, toàn bộ hàng lưới `.form-row-2col` chứa Version và Release Date mang thuộc tính `data-only="apple"` và tự động ẩn hoàn toàn (`display: none !important`) khi chế độ Google Play được kích hoạt.
9. **Bản chất Khảo sát Compliance của Data Safety:**
   - Dữ liệu Data Safety trên Google Play Console là một bảng câu hỏi kỹ thuật khảo sát nhiều bước bắt buộc (Questionnaire) về mã hóa đường truyền, chia sẻ bên thứ 3 và quyền yêu cầu xóa dữ liệu, không phải trường text tự do.
   - Trên Form Editor, tính năng này được thể hiện bằng "Compact Info Banner" thanh lịch (`#privacyMockBanner`) kèm Tooltip hướng dẫn (`#privacyInfoPop`). Khi click vào banner, hệ thống tự động cuộn màn hình và bôi viền vàng chuẩn bo góc 14px (`.safe[data-google-safety].hl-target`).
10. **Quy tắc hiển thị trường What's New (Release Notes):**
   - Trên Google Play Store thực tế, trang xem trước cài đặt lần đầu (pre-install product listing) KHÔNG hiển thị khối What's New. Mục này chỉ xuất hiện trên thiết bị khi người dùng **đã cài đặt app và có bản cập nhật mới (trạng thái Update)**.
   - Trong Google Play Console, khi tạo bản phát hành mới (Production / Testing), developer **bắt buộc phải điền Release Notes** (What's new in this release) với giới hạn tối đa 500 ký tự cho mỗi ngôn ngữ (khác với Apple App Store cho phép tối đa 4,000 ký tự).
   - Store Preview Studio duy trì trường What's New (`#f-new`) cho cả 2 Store để phục vụ soạn thảo, kiểm tra hạn mức 500 ký tự và xuất metadata qua JSON/Markdown, đồng thời trang bị Tooltip Info (`#whatsNewInfoBtn` & `#whatsNewInfoPop`) giải thích rõ hành vi hiển thị này.
11. **Bản chất Illustrative Metrics & Store Badges:**
   - Các thông số như điểm đánh giá (Rating), số lượt nhận xét, mốc lượt tải (Downloads), huy hiệu In-app purchases / Contains ads, và độ tuổi (ESRB) là dữ liệu thuật toán tự sinh của kho hoặc form kỹ thuật nội bộ, không phải metadata nộp storefront.
   - Form Editor tinh gọn khối này thành 'Mockup Settings & Metrics' với badge `MOCKUP ONLY` và Tooltip hướng dẫn (`#metricsInfoBtn` & `#metricsInfoPop`). Hai công tắc kiểm soát linh hoạt: Ẩn thanh metrics (`#f-st-off`) để xem trước app mới 100%, hoặc Đóng dấu watermark caption (`#f-st-wm`) khi xuất ảnh giao khách hàng. Toàn bộ các ô nhập số liệu mẫu được thu gọn trong accordion `<details id="metricsDetails">` để giữ sidebar sạch sẽ.
