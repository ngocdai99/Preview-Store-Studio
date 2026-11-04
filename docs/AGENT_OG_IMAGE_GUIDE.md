# 📖 Hướng Dẫn Tự Động Tạo & Đồng Bộ 4K Open Graph Image (OG-Image Guide for AI Agents)

> **Tài liệu chuẩn hóa dành riêng cho AI Agents và Kỹ sư phát triển**: Hướng dẫn quy trình khép kín tự động tạo, render bằng headless browser và đồng bộ hóa toàn bộ ảnh chia sẻ mạng xã hội (Open Graph 4K Ultra HD), cover banners và mockups trong dự án **Store Preview Studio**.

---

## 1. Tổng Quan Kiến Trúc & Triết Lý Thiết Kế

### 1.1. Tại sao lại dùng chuẩn 4K Ultra HD (3840 × 2160) thay vì 1200 × 630?
- **Tiêu chuẩn cũ (1200 × 630)**: Thường bị vỡ hạt, mờ chữ khi hiển thị trên màn hình Retina (MacBook, iPhone, 4K Monitor) hoặc khi các nền tảng mạng xã hội (Twitter/X, LinkedIn, Facebook, Slack, Telegram, Zalo) nén lại.
- **Tiêu chuẩn 4K Studio (3840 × 2160 - Tỷ lệ 16:9)**:
  - Khung hình cơ sở được thiết kế chuẩn tỉ lệ vàng **1280 × 720 px (16:9)**.
  - Sử dụng **Device Scale Factor = 3** trong quá trình rasterization để xuất ra file PNG có kích thước thực tế **3840 × 2160 px**.
  - Đảm bảo độ sắc nét tuyệt đối (Super-sampling Retina) từ font chữ SF Pro / Inter nhỏ nhất đến viền kim loại Titanium của iPhone 16 Pro và camera bar của Google Pixel 9 Pro.
  - Khi người dùng gửi link qua Zalo, Messenger, iMessage, Twitter Card, ảnh đại diện sẽ luôn ở độ phân giải cao nhất mà không bị vỡ chi tiết.

### 1.2. Tại sao sử dụng Native Headless Chrome thay vì `html2canvas` hay Node Canvas?
1. **Hỗ trợ CSS hiện đại hoàn hảo**: Headless Chrome (Blink Engine) hỗ trợ đầy đủ OKLCH gradients, CSS backdrop-filter blur, CSS subgrid, CSS masks và drop-shadows phức tạp.
2. **Khử răng cưa font chữ chuẩn hệ điều hành**: Subpixel font antialiasing trên Blink engine cho ra kết quả hiển thị typography sắc nét và chính xác 100% so với giao diện thực tế.
3. **Hiển thị SVG vector trung thực**: Không bị lỗi drop icon hoặc sai lệch màu sắc `currentColor` như các thư viện JS mô phỏng DOM canvas.

---

## 2. Danh Mục Tài Nguyên Cần Đồng Bộ (10 Target Mirrors)

Mỗi lần cập nhật thiết kế banner, AI Agent **bắt buộc** phải đồng bộ hóa chính xác 10 file đích sau đây:

| STT | Đường dẫn file (Relative Path) | Kích thước | Hệ màu | Mục đích sử dụng |
|:---:|:---|:---:|:---:|:---|
| 1 | `marketing/public/og-image.png` | 3840 × 2160 | **RGBA** | Next.js Metadata / Static Public Asset |
| 2 | `marketing/og-image.png` | 3840 × 2160 | **RGBA** | Root Marketing Mirror |
| 3 | `marketing/out/og-image.png` | 3840 × 2160 | **RGBA** | Cloudflare Pages Deploy Output |
| 4 | `core/docs/og-image.png` | 3840 × 2160 | **RGBA** | Core Docs & GitHub Pages Preview |
| 5 | `core/cloudflare/og-image.png` | 3840 × 2160 | **RGBA** | Core Cloudflare Worker Static Asset |
| 6 | `core/assets/cover-banner-1280x720.png` | 3840 × 2160 | **RGB** | Core Product Readme / Gumroad Banner |
| 7 | `core/docs/assets/cover-banner-1280x720.png` | 3840 × 2160 | **RGB** | Docs Assets Mirror |
| 8 | `marketing/public/banner-dual-mockup.png` | 3072 × 3048 | **RGB** | High-Res Dual Phone Raster Mockup |
| 9 | `core/assets/banner-dual-mockup.png` | 1024 × 1016 | **RGB** | Core Readme Embedded Mockup |
| 10 | `core/docs/assets/banner-dual-mockup.png` | 1024 × 1016 | **RGB** | Docs Embedded Mockup |

> [!IMPORTANT]
> - Các file thuộc nhóm RGBA (1-5) phải có MD5 hash trùng nhau 100%.
> - Các file thuộc nhóm RGB (6-7) phải có MD5 hash trùng nhau 100%.
> - Các file mockup 1024x1016 (9-10) phải có MD5 hash trùng nhau 100%.

---

## 3. Lệnh Tự Động Kích Hoạt Nhanh (1-Click Automated Commands)

AI Agent hoặc lập trình viên có thể thực hiện toàn bộ quy trình chỉ bằng 1 dòng lệnh:

### 3.1. Tạo mới và đồng bộ toàn bộ ảnh 4K:
```bash
# Cách 1: Chạy qua npm script từ thư mục gốc
npm run generate:og

# Cách 2: Chạy trực tiếp python script
python3 core/scripts/generate-og-image.py
```

### 3.2. Kiểm tra tính toàn vẹn (Verification mode):
```bash
# Kiểm tra kích thước, hệ màu và MD5 của toàn bộ 10 file
npm run check:og

# Hoặc:
python3 core/scripts/generate-og-image.py --check-only
```

---

## 4. Quy Trình Kỹ Thuật Chi Tiết Cho AI Agent (Deterministic Pipeline)

Nếu Agent cần tự động hóa lại từ đầu hoặc chạy trên môi trường tùy chỉnh không có script sẵn, hãy tuân thủ tuần tự 6 bước sau:

### Bước 1: Chuẩn bị & Render Dual Mockup Vector (`banner-dual-mockup.svg`)
1. File nguồn: `marketing/public/banner-dual-mockup.svg` (chứa vector của iPhone 16 Pro hiển thị App Store và Google Pixel 9 Pro hiển thị Google Play Store).
2. Render ra ảnh PNG độ phân giải cực cao (3072 × 3048):
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new \
     --no-sandbox \
     --disable-gpu \
     --user-data-dir=/tmp/chrome-og-profile \
     --screenshot=/tmp/mockup-3072.png \
     --window-size=3072,3048 \
     --force-device-scale-factor=1 \
     "file://$(pwd)/marketing/public/banner-dual-mockup.svg"
   ```
3. Lưu file 3072x3048 vào `marketing/public/banner-dual-mockup.png`.
4. Dùng Python Pillow (PIL) để downscale chất lượng cao (Lanczos filter) xuống **1024 × 1016 px** và lưu vào:
   - `core/assets/banner-dual-mockup.png`
   - `core/docs/assets/banner-dual-mockup.png`

### Bước 2: Chuẩn bị Banner HTML Canvas
1. Mã nguồn giao diện banner nằm tại: `marketing/src/app/banner/page.tsx`.
2. Build trang tĩnh của Next.js:
   ```bash
   npm --prefix marketing run build
   ```
   Lệnh này sinh ra file `marketing/out/banner.html`.
3. Trích xuất phần tử container canvas: Tìm thẻ `<div id="banner-canvas">` (kích thước chính xác `1280 × 720 px`, background `#131413`).
4. Tạo một file HTML độc lập tạm thời (ví dụ: `/tmp/sps_banner_export.html`) với cấu trúc:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <script src="https://cdn.tailwindcss.com"></script>
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
     <style>
       * { margin: 0; padding: 0; box-sizing: border-box; }
       html, body {
         width: 1280px;
         height: 720px;
         overflow: hidden;
         background-color: #131413;
         font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
       }
       #banner-canvas {
         width: 1280px !important;
         height: 720px !important;
         position: absolute !important;
         top: 0 !important;
         left: 0 !important;
         margin: 0 !important;
       }
     </style>
   </head>
   <body>
     <!-- Dán toàn bộ nội dung của <div id="banner-canvas"> vào đây -->
   </body>
   </html>
   ```

### Bước 3: Render 4K Banner Canvas bằng Headless Chrome
Thực thi lệnh headless Chrome chụp viewport `1280 × 720` với `--force-device-scale-factor=3`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --user-data-dir=/tmp/chrome-og-profile \
  --screenshot=/tmp/og_4k_raw.png \
  --window-size=1280,720 \
  --force-device-scale-factor=3 \
  "file:///tmp/sps_banner_export.html"
```

**Giải thích các flags cốt lõi:**
- `--headless=new`: Kích hoạt engine headless Blink hiện đại nhất (khác với `--headless` cũ vốn không render được một số hiệu ứng CSS nâng cao).
- `--force-device-scale-factor=3`: Yêu cầu Chrome nhân tỉ lệ rendering lên gấp 3 ($1280 \times 3 = 3840$ và $720 \times 3 = 2160$).
- `--window-size=1280,720`: Khóa chặt kích thước khung hình tỷ lệ 16:9, tránh co giãn layout.
- `--user-data-dir=...`: Chỉ định thư mục profile tạm riêng biệt để tránh xung đột với phiên làm việc Chrome đang mở của người dùng.

### Bước 4: Hậu Kỳ & Chuẩn Hóa Định Dạng Bằng Python
Sử dụng script Python với thư viện Pillow (`PIL`) để xử lý ảnh đầu ra:

```python
from PIL import Image

# Mở ảnh raw vừa chụp
raw = Image.open("/tmp/og_4k_raw.png")
assert raw.size == (3840, 2160), f"Sai kích thước: {raw.size}"

# Tạo bản RGBA (chuẩn cho Web/Next.js)
rgba = raw.convert("RGBA")

# Tạo bản RGB (chuẩn cho Assets/Cover)
rgb = raw.convert("RGB")
```

### Bước 5: Phân Phối & Đồng Bộ Hóa 10 File Targets
Ghi đè file ảnh đến toàn bộ 10 vị trí đã liệt kê tại **Mục 2**.

```python
rgba_targets = [
    "marketing/public/og-image.png",
    "marketing/og-image.png",
    "marketing/out/og-image.png",
    "core/docs/og-image.png",
    "core/cloudflare/og-image.png",
]
for path in rgba_targets:
    rgba.save(path, optimize=True)

rgb_targets = [
    "core/assets/cover-banner-1280x720.png",
    "core/docs/assets/cover-banner-1280x720.png",
]
for path in rgb_targets:
    rgb.save(path, optimize=True)
```

### Bước 6: Kiểm Tra Nghiệm Thu Tự Động (Verification Checklist)
Agent phải tự chạy kiểm tra để đảm bảo:
1. **Kiểm tra kích thước pixel**: Toàn bộ file banner phải đúng `(3840, 2160)`. File mockup phải đúng `(3072, 3048)` hoặc `(1024, 1016)`.
2. **Kiểm tra 4 góc ảnh (Corner Pixel Sampling)**:
   - Pixel tại `(0, 0)`, `(3839, 0)`, `(0, 2159)`, `(3839, 2159)` phải có giá trị màu xấp xỉ `RGB(19, 20, 19)` (tương đương hex `#131413`).
   - Tuyệt đối không được có viền trắng `(255, 255, 255)` hoặc khoảng trống trong suốt `(0, 0, 0, 0)`.
3. **Kiểm tra MD5 Hash**:
   - Tất cả 5 file trong nhóm RGBA phải có cùng mã MD5.
   - Tất cả 2 file trong nhóm RGB phải có cùng mã MD5.

---

## 5. Tự Phục Hồi & Xử Lý Sự Cố (Self-Healing & Troubleshooting)

Khi Agent thực thi trong các môi trường khác nhau, có thể phát sinh các lỗi sau:

### Lỗi 1: Không tìm thấy file thực thi Google Chrome
- **Triệu chứng**: `google-chrome: command not found` hoặc không có `/Applications/Google Chrome.app`.
- **Giải pháp tự động dò tìm**:
  ```python
  import shutil, os

  candidates = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
      shutil.which("google-chrome"),                                  # Linux / Ubuntu
      shutil.which("chromium"),                                       # Linux Chromium
      shutil.which("chromium-browser"),                               # Debian / Alpine
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",   # Windows 64-bit
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", # Windows 32-bit
  ]
  chrome_bin = next((c for c in candidates if c and os.path.exists(c)), None)
  ```

### Lỗi 2: Chrome Crash do thiếu sandbox / GPU trên Linux CI
- **Triệu chứng**: `Failed to move to new namespace` hoặc `GPU process launch failed`.
- **Khắc phục**: Luôn truyền kèm cả hai cờ: `--no-sandbox` và `--disable-gpu`.

### Lỗi 3: Xung đột Profile người dùng đang chạy
- **Triệu chứng**: `SingletonLock: Operation not permitted` hoặc Chrome mở cửa sổ mới thay vì chụp ảnh headless.
- **Khắc phục**: Luôn tạo một thư mục tạm riêng biệt bằng `tempfile.mkdtemp(prefix="chrome-og-profile-")` và truyền vào `--user-data-dir`. Xóa thư mục tạm này trong khối `finally`.

### Lỗi 4: Lỗi quyền ghi git lock trong sandbox
- **Triệu chứng**: `.git/index.lock: Operation not permitted`.
- **Khắc phục**: Khi commit các file ảnh sau khi sinh ra, yêu cầu chạy lệnh git ngoài sandbox (`BypassSandbox: true`).

---

## 6. Triển Khai Sau Khi Cập Nhật (Deployment Guide)

Sau khi tạo và nghiệm thu 10 file ảnh thành công, AI Agent thực hiện commit và deploy:

```bash
# 1. Commit các thay đổi
git add marketing/ core/ package.json
git commit -m "chore(assets): regenerate 4k open graph images and banner assets"

# 2. Deploy landing page lên Cloudflare Pages
npm run deploy:landing
```

Trang landing page và các thẻ `<meta property="og:image">` sẽ lập tức nhận diện URL 4K mới nhất tại:
`https://store-preview-studio.pages.dev/og-image.png`
