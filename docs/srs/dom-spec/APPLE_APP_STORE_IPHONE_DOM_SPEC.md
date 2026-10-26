# Apple App Store · Chuẩn Cấu Trúc DOM & Thứ Tự Content Cho iPhone (DOM Specification)

> **Phạm vi thiết bị:** Dành riêng cho iPhone (Apple Mobile Phone).
> **Cơ sở tham chiếu:** Trích xuất từ DOM chính thức của Apple App Store Web (`https://apps.apple.com`) và cấu trúc render trên Phone Mockup trong Mini Studio (`docs/src/marketing/components/mini-studio.html` - ID `#msPhoneApple`) và Pro Studio (`src/index.html` - ID `#phoneApple`).
> **Mục đích:** Quy chuẩn hóa 100% thứ tự render và cấu trúc hiển thị cho Mockup iPhone trên cả **Pro Studio (`src/`)** và **Marketing Mini Studio (`docs/src/marketing/`)**.

---

## 1. Cấu Trúc Thứ Tự 9 Khối Chuẩn Trên iPhone (Top-to-Bottom Hierarchy)

```text
Khung phần cứng iPhone:
├── Dynamic Island (.ms-island)
└── Status Bar (.ms-sb) với đồng hồ (.ms-clock-apple: "9:41")

Thân trang cuộn (Scroll Container .ms-body):
1. App Navigation Bar (.ms-a-nav)
   ├── Nút Back (.ms-a-nav-back)
   ├── Icon thu nhỏ dính giữa khi cuộn (.ms-a-nav-center > img.ms-a-nav-ico)
   └── Nút tác vụ phải (.ms-a-nav-right > .ms-a-nav-share + button.ms-a-nav-get "GET")

2. App Header (.ms-a-head)
   ├── Icon lớn 1024×1024 (Bo góc squircle chuẩn iOS: img.ms-a-ico)
   └── Cột thông tin (.ms-a-info):
       ├── App Name (Tối đa 30 graphemes: .ms-a-name)
       ├── Subtitle (Tối đa 30 graphemes: .ms-a-sub)
       └── Nút Nhận chính (.ms-a-act > button.ms-get "GET")

3. Metrics Shelf (.ms-a-met)
   ├── RATINGS: Điểm số trung bình (ví dụ: 4.9 sao) + Lượt đánh giá (1.8K Ratings)
   ├── AGE: Giới hạn độ tuổi (4+, 9+, 12+, 17+ Years Old)
   ├── CHART: Thứ hạng danh mục (ví dụ: #1 Productivity)
   ├── DEVELOPER: Tên nhà phát triển / Studio
   └── LANGUAGE: Ngôn ngữ chính (EN) + Số ngôn ngữ phụ (+4 More)

4. Preview Gallery (.ms-sec > .ms-gal)
   ├── Dải ảnh chụp màn hình iPhone (Horizontal Carousel trượt ngang data-gal)
   └── Device Support Badge (.ms-a-platforms):
       ├── Icon vector outline iPhone (.ms-a-plat-icon)
       ├── Icon vector outline iPad (.ms-a-plat-icon)
       └── Nhãn thiết bị (.ms-a-plat-text: "iPhone, iPad")
   * QUY TẮC BẮT BUỘC: NẰM NGAY SAU METRICS SHELF. Không được để bất kỳ khối nào chèn ngang.

5. Promotional Text & Description
   ├── Promotional Text (.ms-promo[data-bind="promo"] - tối đa 170 ký tự, ẩn nếu rỗng)
   └── Description (.ms-sec > .ms-desc[data-bind="desc"] - văn bản giới thiệu tính năng chi tiết)

6. Ratings & Reviews (.ms-sec)
   ├── Tiêu đề: "Ratings & Reviews" kèm mũi tên chuyển trang
   ├── Khối tóm tắt điểm (.ms-a-ratings-row: điểm số lớn, 5 sao vàng cam #ff9500, tổng lượt rating)
   └── Danh sách thẻ nhận xét người dùng (.ms-a-reviews-list > .ms-a-rev-card):
       ├── Hàng đầu (.ms-a-rev-top): Tiêu đề review in đậm + Ngày đăng (.ms-a-rev-date)
       ├── Hàng giữa (.ms-a-rev-meta): 5 sao vàng + Tên tác giả (.ms-a-rev-author)
       └── Hàng nội dung (.ms-a-rev-body): Nhận xét chi tiết của người dùng

7. What's New / Ghi Chú Bản Phát Hành (.ms-sec)
   ├── Tiêu đề: "What's New" kèm icon mũi tên xem Version History
   └── Khung nội dung (.ms-wn-row):
       ├── Release notes (.ms-wn-text[data-bind="whatsNew"])
       └── Thông tin phiên bản (.ms-vm: Version [data-bind="ver"], Ngày [data-bind="rdate"])
   * QUY TẮC BẮT BUỘC: NẰM SAU REVIEWS, TRƯỚC APP PRIVACY.

8. App Privacy / Quyền Riêng Tư Ứng Dụng (.ms-sec)
   ├── Tuyên bố của nhà phát triển (.ms-priv-txt) kèm link chính sách bảo mật
   └── Lưới thẻ bảo mật (.ms-pg):
       ├── Card 1 (.ms-pc): Data Linked to You (Dữ liệu liên kết danh tính người dùng)
       └── Card 2 (.ms-pc): Data Not Linked to You (Dữ liệu không liên kết danh tính)

9. Information Table / Bảng Thông Tin Kỹ Thuật (.ms-sec)
   └── Lưới 2 cột (.ms-inf):
       ├── Provider ([data-bind="dev"])
       ├── Size (ví dụ: 86 MB)
       ├── Category ([data-bind="catApple"])
       ├── Compatibility ("Works on this iPhone (iOS 16.0+)")
       ├── Languages ("English, French, German, Japanese")
       ├── Age Rating ([data-bind="age"])
       └── In-App Purchases ("Yes")

Thanh điều hướng dưới cùng (Bottom Tab Bar):
└── Apple Tab Bar chuẩn 5 tab (Today, Games, Apps, Arcade, Search)
```

---

## 2. Bảng Đối Chiếu DOM Thật vs Class Trong Dự Án

| STT | Khối Section | Class trong Pro Studio (`src/`) | Class trong Marketing Mini Studio (`docs/`) | Data Bind Attribute |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Navigation Bar | `.a-nav`, `.a-nav-back`, `.a-nav-ico`, `.a-nav-get` | `.ms-a-nav`, `.ms-a-nav-back`, `.ms-a-nav-ico`, `.ms-a-nav-get` | `data-img="icon"` |
| **2** | App Header | `.a-head`, `.a-ico`, `.a-name`, `.a-sub`, `.get` | `.ms-a-head`, `.ms-a-ico`, `.ms-a-name`, `.ms-a-sub`, `.ms-get` | `name`, `sub`, `icon` |
| **3** | Metrics Shelf | `.a-met`, `data-stat` | `.ms-a-met`, `[data-bind]` | `rating`, `count`, `age`, `rank`, `catApple`, `dev` |
| **4** | Preview Screenshots | `.sec`, `.gal`, `.a-platforms-badge` | `.ms-sec`, `.ms-gal`, `.ms-a-platforms` | `data-gal`, `data-f="shots"` |
| **5** | Promo & Description | `.promo`, `.a-txt.pre` | `.ms-promo`, `.ms-desc` | `promo`, `desc` |
| **6** | Ratings & Reviews | `.a-rating-hero`, `.a-reviews-list`, `.a-rev-card` | `.ms-a-ratings-row`, `.ms-a-reviews-list`, `.ms-a-rev-card` | `rating`, `count` |
| **7** | What's New | `.sec`, `.wn-row`, `data-b="new"` | `.ms-sec`, `.ms-wn-row`, `.ms-vm` | `whatsNew`, `ver`, `rdate` |
| **8** | App Privacy | `.sec`, `.pg`, `.pc` | `.ms-sec`, `.ms-pg`, `.ms-pc` | `dev` |
| **9** | Information Table | `.sec`, `.inf` | `.ms-sec`, `.ms-inf` | `dev`, `catApple`, `age` |
| **10** | Tab Bar Bottom | `.a-tab-bar`, `.a-tab-item` | `.a-tab-bar`, `.a-tab-item` | (Static SVG template) |

---

## 3. Các Quy Tắc Hiển Thị Bắt Buộc Trên iPhone (Golden Rules)

1. **Vị trí bắt buộc của Preview Gallery:**
   - Dải ảnh chụp màn hình (`.ms-gal`) BẮT BUỘC nằm ngay bên dưới Metrics Shelf (`.ms-a-met`). Tuyệt đối không được đẩy dải ảnh xuống dưới phần mô tả hoặc What's New.
2. **Huy hiệu thiết bị hỗ trợ (Device Support Badge):**
   - Nằm ngay dưới gallery ảnh screenshot, trước đường phân cách với Promotional Text/Description.
   - Thể hiện icon outline vector của iPhone và iPad kèm văn bản `iPhone, iPad`.
3. **Thứ tự của What's New:**
   - Phải nằm SAU khối nhận xét người dùng (Ratings & Reviews) và nằm TRƯỚC khối App Privacy.
4. **Thẻ nhận xét người dùng (User Review Cards):**
   - Đánh giá không chỉ hiển thị điểm số chung mà phải render tối thiểu 2 thẻ review chi tiết của người dùng có đầy đủ: Tiêu đề review, ngày đăng, 5 sao, tên tác giả và nội dung nhận xét.
5. **Cắt chuỗi an toàn (Safe Truncation):**
   - App Name và Subtitle trên iPhone Mockup luôn bị giới hạn tối đa 30 graphemes. Khi vượt quá độ dài, phần tử tự động áp dụng class `.ms-trunc` và hiển thị tooltip cảnh báo thay vì làm vỡ bố cục giao diện header.
6. **Full Description hiển thị trực tiếp trên Storefront:**
   - Khác với Google Play (chỉ hiển thị Short Description trên trang chính), Apple App Store hiển thị Full Description trực tiếp dưới dải ảnh chụp màn hình (rút gọn 3 dòng đầu kèm nút "more").
   - **Cơ chế Focus Linking:** Khi người dùng focus vào trường `Full Description` (`#f-desc`) trên Form Editor, hệ thống tự động cuộn màn hình iPhone/iPad đến khối `.a-txt.pre[data-b="desc"]` và bôi viền vàng (`.hl-target`).
7. **Hiển thị song hành Version & Release Date:**
   - Apple yêu cầu số hiệu phiên bản (`data-b="ver"`) và ngày phát hành (`data-b="rdate"`) trên khối What's New.
   - Trên Form Editor, trường Version (`#f-ver`) và Release Date (`#f-rdate`) hiển thị song song trong lưới 2 cột `.form-row-2col` khi Store là Apple.
8. **Bản chất Khảo sát App Privacy (Nutrition Labels):**
   - App Privacy trên App Store Connect là bảng khảo sát kỹ thuật (Nutrition Labels) phân loại: Dữ liệu liên kết danh tính, Không liên kết danh tính, hoặc Theo dõi bên thứ 3.
   - Thẻ Editor hiển thị dưới dạng Compact Info Banner (`#privacyMockBanner`) kèm Tooltip hướng dẫn (`#privacyInfoPop`). Khi click, thiết bị tự động cuộn đến khối `[data-apple-priv-wrap]` và bôi viền vàng chuẩn bo góc 16px.
9. **Hiển thị trực tiếp của What's New trên trang Public Listing:**
   - Apple App Store hiển thị mục What's New trực tiếp trên storefront công khai ngay sau khối Ratings & Reviews, đi kèm số hiệu phiên bản (`data-b="ver"`), ngày phát hành (`data-b="rdate"`) và nội dung release notes (`data-b="new"`). Giới hạn ký tự tối đa là 4,000 ký tự (so với 500 ký tự của Google Play Console).
   - Form Editor trang bị Tooltip Info (`#whatsNewInfoBtn` & `#whatsNewInfoPop`) giải thích chi tiết cơ chế hiển thị giữa Apple App Store và Google Play Store.
10. **Bản chất Metrics mẫu và In-App Purchases:**
   - Số sao, số lượt đánh giá, thứ hạng Top Free, và dòng 'In-App Purchases: Yes' trong Information Table là số liệu mẫu minh họa.
   - Thẻ Editor được đóng gói thành 'Mockup Settings & Metrics' với badge `MOCKUP ONLY` và Tooltip hướng dẫn (`#metricsInfoBtn` & `#metricsInfoPop`). Hai công tắc kiểm soát linh hoạt (`#f-st-off` và `#f-st-wm`) đi kèm accordion `<details id="metricsDetails">` thu gọn các ô nhập số liệu mẫu.
