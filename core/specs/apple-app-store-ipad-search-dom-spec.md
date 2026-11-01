# Apple App Store · Chuẩn Cấu Trúc DOM Cho iPad · Search Results View (DOM Specification)

> **Phạm vi thiết bị:** Apple iPad (iPad Pro 13", iPad Air, iPad Mini · Portrait & Landscape).
> **Cơ sở tham chiếu:** Giao diện thực tế của Apple App Store trên iPad khi thực hiện tìm kiếm ứng dụng (ảnh chụp màn hình thực tế: Thanh tìm kiếm trên đỉnh kèm nút Bộ lọc (Filters), Lưới kết quả 2 cột đối xứng `grid-template-columns: repeat(2, 1fr)`).
> **Mục đích:** Quy chuẩn hóa cấu trúc cây DOM, semantic HTML, thứ tự render, data-bind attributes, và hệ thống class CSS cho màn hình **Search Results** trên iPad trong Preview Studio.

---

## 1. Phân Tích Layout & Cấu Trúc Thứ Tự (Top-to-Bottom Hierarchy)

```text
Khung phần hardware & màn hình iPad (.dev.ipad > .phone.ipad):
├── Camera viền trên (.ipad-cam)
├── System Status Bar (.ipad-sb)
│   ├── Đồng hồ & Ngày (.ipad-clock: "9:41 AM", .ipad-sb-date: "Wed Oct 18")
│   └── Biểu tượng hệ thống (.ipad-sb-icons: Sóng mạng, Wi-Fi, Pin 100%)
│
└── Thân cuộn màn hình (.scr.ipad-scr > div[data-v="search"].ipad-search-view):
    │
    ├── 1. Top Filter & Search Bar Row (.ipad-search-bar-row)
    │   ├── Nút Bộ Lọc bên trái (.ipad-filter-btn):
    │   │   ├── Chữ hiển thị ("Bộ lọc" / "Filters")
    │   │   └── Icon mũi tên xuống (.ipad-filter-arrow: SVG chevron down)
    │   └── Thanh tìm kiếm dạng Pill tròn bên phải (.ipad-search-pill-wrap):
    │       ├── Icon kính lúp tìm kiếm (.ipad-search-ico: SVG search 16×16)
    │       └── Text truy vấn tìm kiếm (.ipad-search-query[data-b="name"]: Tên app đang tìm kiếm)
    │
    ├── 2. Lưới 2 Cột Kết Quả Tìm Kiếm (.ipad-search-grid)
    │   │  (Layout: CSS Grid 2 cột đối xứng `grid-template-columns: repeat(2, 1fr); gap: 24px 20px;`)
    │   │
    │   ├── CARD 1: ỨNG DỤNG ĐANG PREVIEW (.ipad-sr-card.ipad-sr-primary)
    │   │   ├── Hàng Header Ứng Dụng (.ipad-sr-card-head):
    │   │   │   ├── Icon ứng dụng bo góc squircle chuẩn iOS (.ipad-sr-icon > img[data-icon])
    │   │   │   ├── Cột thông tin (.ipad-sr-card-info):
    │   │   │   │   ├── Tên ứng dụng (.ipad-sr-app-title[data-b="name"])
    │   │   │   │   ├── Phụ đề / Subtitle (.ipad-sr-app-sub[data-b="sub"])
    │   │   │   │   └── Hàng đánh giá sao (.ipad-sr-stars-row):
    │   │   │   │       ├── 5 sao xám/vàng (.ipad-sr-stars: "★★★★★")
    │   │   │   │       └── Chỉ số rating (.ipad-sr-rating-val[data-stat="rating"])
    │   │   │   └── Nút hành động dạng Pill (.ipad-sr-get-wrap > button.get.ipad-sr-get-btn: "Nhận" / "GET")
    │   │   │
    │   │   └── Khối hiển thị Screenshots (.ipad-sr-media[data-shots="ipad-shots"]):
    │   │       ├── TRƯỜNG HỢP A: Ảnh Landscape (Ngang - e.g. 5 Phút Thuộc Bài, Game, Video app):
    │   │       │   └── 1 ảnh landscape duy nhất chiếm trọn bề ngang card (.ipad-sr-shot.landscape-shot)
    │   │       └── TRƯỜNG HỢP B: Ảnh Portrait (Đứng - ứng dụng thông thường):
    │   │           └── 2 ảnh portrait đặt cạnh nhau đối xứng 1:1 (.ipad-sr-shot.portrait-shot)
    │   │
    │   ├── CARD 2: SKELETON ỨNG DỤNG ĐỐI THỦ (.ipad-sr-card.ipad-sr-skel)
    │   │   ├── Hàng Header Skeleton:
    │   │   │   ├── Khối icon xám bo góc squircle (.ipad-skel-icon)
    │   │   │   ├── Cột vạch xám thông tin:
    │   │   │   │   ├── Vạch tên app (.ipad-skel-line.w-45)
    │   │   │   │   ├── Vạch phụ đề (.ipad-skel-line.w-75)
    │   │   │   │   └── Hàng 5 sao mờ (.ipad-skel-stars: "★★★★★")
    │   │   │   └── Nút Nhận xám (.ipad-skel-btn)
    │   │   └── Khối Screenshots Skeleton:
    │   │       └── 2 ô chữ nhật đứng portrait đối xứng (.ipad-skel-shot x 2)
    │   │
    │   ├── CARD 3: SKELETON ỨNG DỤNG ĐỐI THỦ (.ipad-sr-card.ipad-sr-skel)
    │   │   ├── Hàng Header Skeleton: Icon xám + Vạch thông tin + Nút Nhận xám
    │   │   └── Khối Screenshots Skeleton: 2 ô chữ nhật đứng portrait đối xứng
    │   │
    │   └── CARD 4: SKELETON ỨNG DỤNG ĐỐI THỦ (.ipad-sr-card.ipad-sr-skel)
    │       ├── Hàng Header Skeleton: Icon xám + Vạch thông tin + Nút Nhận xám
    │       └── Khối Screenshots Skeleton: 2 ô chữ nhật đứng portrait đối xứng
    │
    └── Thanh điều hướng dưới cùng / Floating Pill Bar (.ipad-floating-pill):
        └── Capsule tabs nổi (Today, Games, Apps, Arcade, Search)
```

---

## 2. Bảng Đối Chiếu DOM Thật vs Class Trong Dự Án

| STT | Khối Phần Tử | Class trong iPad Search View | Data Bind Attribute | Chức Năng Hiển Thị |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Top Filter Button | `.ipad-filter-btn` | - | Nút "Bộ lọc ⌵" hoặc "Filters ⌵" với icon chevron |
| **2** | Search Pill Input | `.ipad-search-pill-wrap`, `.ipad-search-query` | `data-b="name"` | Thanh tìm kiếm pill bo tròn hiển thị từ khóa truy vấn |
| **3** | Search Results Grid | `.ipad-search-grid` | - | Lưới CSS Grid 2 cột đối xứng chia đều không gian iPad |
| **4** | Primary App Card | `.ipad-sr-card.ipad-sr-primary` | - | Card chứa ứng dụng người dùng đang thiết kế / preview |
| **5** | App Icon Squircle | `.ipad-sr-icon > img` | `data-icon` | Icon ứng dụng bo góc chuẩn iOS (56×56px) |
| **6** | App Title & Subtitle | `.ipad-sr-app-title`, `.ipad-sr-app-sub` | `data-b="name"`, `data-b="sub"` | Tiêu đề app và subtitle 1 dòng rút gọn (ellipsis) |
| **7** | Star Rating Row | `.ipad-sr-stars-row`, `.ipad-sr-rating-val` | `data-stat="rating"` | 5 sao đánh giá kèm chỉ số rating thực tế |
| **8** | Action GET Button | `button.get.ipad-sr-get-btn` | - | Nút "Nhận" / "GET" dạng pill chuẩn App Store |
| **9** | Media Gallery Container | `.ipad-sr-media` | `data-shots="ipad-shots"` | Container chứa 1 ảnh landscape hoặc 2 ảnh portrait |
| **10** | Skeleton Neighbor Cards | `.ipad-sr-card.ipad-sr-skel` | `aria-hidden="true"` | 3 card mô phỏng đối thủ lân cận tạo chiều sâu thực tế |

---

## 3. Các Quy Tắc Hiển Thị Bắt Buộc (Golden Rules)

1. **Lưới 2 cột đối xứng (2-Column Grid Axiom):**
   - Khác với iPhone (chỉ có 1 cột danh sách dọc theo bề ngang hẹp), giao diện tìm kiếm của iPad App Store LUÔN LUÔN được chia thành **2 cột đối xứng** (`grid-template-columns: repeat(2, 1fr)`).
   - Tỷ lệ khoảng cách giữa 2 cột là `20px - 24px`, căn đều lề với thanh tìm kiếm và header trên.

2. **Cơ chế Thích Ứng Định Dạng Ảnh Chụp Màn Hình (Landscape vs Portrait Adaptive Rule):**
   - **Ảnh Portrait (Đứng):** Khi ứng dụng sử dụng ảnh chụp màn hình dạng đứng, mỗi card hiển thị đúng **2 ảnh portrait cạnh nhau** đối xứng (`1fr 1fr`), khớp chính xác với 3 card skeleton bên cạnh. Tuyệt đối không nhồi nhét 3 ảnh vào 1 card vì sẽ làm ảnh bị thu nhỏ quá mức và sai chuẩn iPad.
   - **Ảnh Landscape (Ngang - ví dụ: 5 Phút Thuộc Bài, Game, Video editor):** Khi phát hiện ảnh ngang (tỷ lệ rộng hơn cao `naturalWidth > naturalHeight`), card tự động chuyển sang chế độ `has-landscape` và hiển thị **1 ảnh landscape duy nhất** trải rộng toàn bộ bề ngang của card.

3. **Cấu Trúc Header Thanh Tìm Kiếm:**
   - Nút "Bộ lọc" (`.ipad-filter-btn`) nằm gọn bên trái, gồm nhãn văn bản và icon mũi tên chỉ xuống.
   - Thanh tìm kiếm (`.ipad-search-pill-wrap`) trải dài từ sau nút bộ lọc đến hết lề phải màn hình, mang kiểu dáng pill oval tròn hoàn toàn (`border-radius: 9999px`) với icon kính lúp mờ ở đầu.

4. **Đồng bộ hóa Themes (Dark & Light Mode Parity):**
   - **Dark Mode:** Nền card và nền ảnh chụp skeleton sử dụng `rgba(255, 255, 255, 0.08)`, chữ trắng và xám bạc `#8e8e93`.
   - **Light Mode:** Nền thanh tìm kiếm và skeleton sử dụng `rgba(0, 0, 0, 0.06)` hoặc `#e5e5ea`, chữ đen `#000000` và xám `#8e8e93`.

5. **Tính Nhất Quán Về Tương Tác Focus Linking:**
   - Khi focus vào trường App Name (`#f-name`), Subtitle (`#f-sub`), hoặc App Icon (`#f-ico`), các phần tử tương ứng trên Primary Card (`.ipad-sr-primary`) tự động được đồng bộ nội dung và phản hồi viền highlight chuẩn xác.
