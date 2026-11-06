# SRS: Export Engine & Cross-Browser Troubleshooting Playbook

> **Mã tài liệu:** `SRS_EXPORT_CROSS_BROWSER_TROUBLESHOOTING`  
> **Phiên bản:** `1.0.0`  
> **Cập nhật lần cuối:** `2026-11-06`  
> **Phạm vi áp dụng:** Bộ engine xuất ảnh PNG/ZIP (`core/src/js/modules/export/`), các thành phần mockup đa nền tảng (`core/src/components/mockups/`), và các quy chuẩn layout DOM/CSS.

---

## 1. Mục đích & Bối cảnh

Tài liệu này lưu trữ toàn bộ các ca lỗi thực tế, nguyên nhân gốc rễ tầng sâu (under-the-hood engine mechanisms) và hướng dẫn chuẩn mực để xử lý các lỗi liên quan đến:
1. **Xuất ảnh PNG / ZIP qua html2canvas trên các trình duyệt khác nhau (Chrome, Safari, Brave, Firefox).**
2. **Hiện tượng dính chữ (dít chữ / collapse whitespace) trên các engine WebKit, Blink, Gecko.**
3. **Méo ảnh, kéo dãn tỉ lệ screenshots (aspect-ratio distortion) trong các chế độ xem Search Result và Carousel.**
4. **Lệch layout lưới (grid misalignment) trên giao diện tablet / iPad.**

Tất cả các phiên làm việc sau bắt buộc phải tham chiếu tài liệu này trước khi chỉnh sửa mã nguồn xuất ảnh hoặc xử lý lỗi hiển thị mockup.

---

## 2. Nguyên tắc Bất biến (Core Invariants & Guardrails)

1. **Tuyệt đối không monkey-patch thư viện vendor (`core/src/lib/html2canvas.min.js`):**
   - Mọi nỗ lực can thiệp regex hoặc nối chuỗi thô bạo vào hàm `renderTextNode` hay `splitText` của thư viện đều dẫn đến hồi quy nghiêm trọng: tách rời từ có dấu gạch ngang (`In-App` thành `In - App`), chèn khoảng trắng vô lý vào số (`4+` thành `4 +`), hoặc treo tiến trình Promise vĩnh viễn.
   - Thư viện vendor phải giữ nguyên bản gốc từ HEAD. Mọi điều chỉnh phải diễn ra tại tầng DOM chuẩn bị trong `onclone` hoặc cấu hình CSS.

2. **Khai báo biến tường minh & an toàn cú pháp:**
   - Trong `onclone`, bất kỳ biến nào được sử dụng (`isSearch`, `isApple`, `isGoogle`, v.v.) phải được khai báo bằng `const` hoặc `let` trong đúng phạm vi (scope).
   - Tuyệt đối không để xảy ra `ReferenceError`, vì lỗi này sẽ ngắt đứng luồng Promise của `exportPNG` mà không có phản hồi rõ ràng tới người dùng.

3. **Luôn kiểm thử 100% test suite trước khi bàn giao:**
   - Chạy `node core/build.js && node core/scripts/test-runner.js` để đảm bảo không vi phạm bất kỳ assertion nào trong 1510+ unit tests.

---

## 3. Danh mục Lỗi & Cẩm nang Xử lý Chi tiết (Playbook)

### Case 1: Lỗi Dính Chữ (Whitespace Collapse / Dít Chữ)

#### Triệu chứng thực tế
- Khi xuất PNG hoặc xem trên Firefox/Android:
  - Tên ứng dụng hoặc nhà phát triển bị mất dấu cách: `StorePreviewStudio`, `StoreMockupPro`, `DeveloperTools`.
  - Tiêu đề section bị dính chữ: `Aboutthis app`.
  - Thông báo tương thích bị dính chữ: `Designedfor iPhone • Not verifiedfor iPadOS`.

#### Cơ chế tầng sâu (Root Cause)
1. **Cơ chế render text của html2canvas:**
   - html2canvas chia chuỗi text thành các token (từ và dấu cách).
   - Với các ký tự space `' '`, điều kiện `0 < token.trim().length` trả về `false`, nên html2canvas **không tạo bounding box riêng cho dấu cách**.
   - Vị trí từ tiếp theo hoàn toàn dựa vào tọa độ `left` do `Range.getClientRects()` của trình duyệt tính toán.
2. **Trên WebKit/Blink (Safari, Chrome, Brave):**
   - Khi phần tử sử dụng `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;` (ví dụ `.g-name`, `.g-dev`, `.a-name`, `.a-sub`), việc tính toán range bounding box trong DOM clone bị lỗi subpixel rounding, làm từ sau bắt đầu ngay tại điểm kết thúc của từ trước.
3. **Trên Gecko (Firefox):**
   - Khi phần tử có `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` trong DOM clone ngầm, engine Gecko coi advance width của khoảng cách là 0px, dẫn đến các từ dính chặt vào nhau.
4. **Trên các ký tự HTML Entity (`&bull;`):**
   - Khi viết trực tiếp `Designed for iPhone &bull; Not verified for iPadOS` trong cùng một text node, trình duyệt dễ thu gọn khoảng trắng xung quanh entity.

#### Cách xử lý triệt để
1. **Trong HTML template:** Tách các cụm chữ và dấu bullet thành các thẻ `span` độc lập:
   ```html
   <div class="ipad-compat-notice" id="ipadCompatNotice" style="display:none">
     <span>Designed for iPhone</span>
     <span class="ipad-compat-dot" aria-hidden="true">&bull;</span>
     <span>Not verified for iPadOS</span>
   </div>
   ```
2. **Trong CSS `btnStyle` của `onclone` ([png.js](file:///Users/daingoc/PreviewStudio/core/src/js/modules/export/png.js)):**
   - Giải phóng hoàn toàn các giới hạn clamp và overflow:
     ```css
     .g-name, .a-name, .g-dev, .a-sub, .ipad-name, .ipad-sub, .gt7-app-name, .gt10-header-title, .gt10-item-title,
     .sr-title, .sr-subtitle, .sr-category, .sr-dev, .sr-meta-line, .sr-search-query,
     .ipad-sr-app-title, .ipad-sr-app-sub, .ipad-search-query, .ipad-floating-title,
     .gp-search-query-text, .gp-search-card-name, .gp-search-card-meta, .g-meta, .iap,
     [data-b] {
       -webkit-line-clamp: unset !important;
       -webkit-box-orient: unset !important;
       white-space: pre-wrap !important;
       word-break: normal !important;
       word-spacing: 0.1px !important;
       letter-spacing: 0.01px !important;
       overflow: visible !important;
       text-overflow: clip !important;
     }
     ```
   - Áp dụng micro-spacing (`word-spacing: 0.1px`, `letter-spacing: 0.01px`) để kích hoạt thuật toán tính toán advance width độc lập của canvas trong mọi engine.
3. **Đồng bộ hóa Font:** Phải đợi `clonedDoc.fonts.ready` hoàn tất trước khi html2canvas bắt đầu vẽ:
   ```javascript
   if(document.fonts && clonedDoc.fonts){
     try{
       document.fonts.forEach(f => clonedDoc.fonts.add(f));
       if(clonedDoc.fonts.ready){
         await clonedDoc.fonts.ready;
       }
     }catch(_){}
   }
   ```

---

### Case 2: Lỗi Search Result Bị Kéo Dãn Dọc Ảnh (Screenshots Vertical Stretching)

#### Triệu chứng thực tế
- Khi chuyển sang view Search Result (Apple iPhone Search hoặc Google Play Search) và xuất ảnh PNG:
  - 3 screenshots ở kết quả tìm kiếm bị kéo dài thườn thượt theo chiều dọc (tỉ lệ méo 1:4.6 thay vì tỉ lệ chuẩn 1:2.16).
  - Xuất hiện trên tất cả các trình duyệt: Chrome, Safari, Brave, Firefox.

#### Cơ chế tầng sâu (Root Cause)
- Trong `png.js`, selector chung `clonedEl.querySelectorAll('.gal img, [data-shots] img')` gom toàn bộ ảnh có thuộc tính `data-shots`.
- Khối Search Result có thuộc tính `data-shots="shots"` (Apple) hoặc `data-shots="gp-search"` (Google).
- Vì thế, code tưởng nhầm đây là carousel màn hình chính (`.gal img`) và áp đặt chiều cao cố định của carousel màn hình chính:
  - Apple: ép `width: 222px; height: 481px !important;`
  - Google: ép `width: 190px; height: 412px !important;`
- Trong khi đó, ở chế độ Search Result, 3 ảnh được xếp ngang trong khung máy có bề rộng ~328px (mỗi ảnh chỉ rộng ~104px). Việc chiều rộng bị co về 104px nhưng chiều cao bị ép cố định 481px / 412px đã gây ra hiện tượng méo kéo dãn dọc.

#### Cách xử lý triệt để
1. **Tách riêng logic `isSearch` trong vòng lặp sizing ảnh ([png.js](file:///Users/daingoc/PreviewStudio/core/src/js/modules/export/png.js)):**
   ```javascript
   const isSearch = img.closest('.sr-shots, .gp-search-shots, .ipad-sr-media, [data-shots="shots"], [data-shots="gp-search"], [data-shots="ipad-shots"]');
   if (isSearch) {
     const isAppleSearch = img.closest('.sr-shots, [data-shots="shots"]');
     const isGoogleSearch = img.closest('.gp-search-shots, [data-shots="gp-search"]');
     const isShotLandscape = isLandscape || ratio > 1.15;

     if (isAppleSearch) {
       const w = isShotLandscape ? 328 : 104;
       const h = isShotLandscape ? 185 : 225;
       img.style.setProperty('width', w + 'px', 'important');
       img.style.setProperty('height', h + 'px', 'important');
       img.style.setProperty('max-width', w + 'px', 'important');
       img.style.flex = `0 0 ${w}px`;
       img.style.borderRadius = '12px';
     } else if (isGoogleSearch) {
       const w = isShotLandscape ? 328 : 104;
       const h = isShotLandscape ? 185 : 220;
       img.style.setProperty('width', w + 'px', 'important');
       img.style.setProperty('height', h + 'px', 'important');
       img.style.setProperty('max-width', w + 'px', 'important');
       img.style.flex = `0 0 ${w}px`;
       img.style.borderRadius = '10px';
     }
     return; // Bắt buộc return để không rơi xuống logic carousel chính
   }
   ```
2. **Trong CSS `btnStyle`:** Đặt quy tắc phân định rõ ràng giữa `.gal` và `.sr-shots` / `.gp-search-shots`, áp dụng cho cả ảnh thật lẫn thẻ placeholder `.sr-skel-shot`, `.gp-skel-shot`.

---

### Case 3: Lỗi Lệch Khung Lưới Trên iPad Search Result (Grid Misalignment)

#### Triệu chứng thực tế
- Trên giao diện tìm kiếm của iPad (lưới 2 cột x 2 hàng):
  - Khung ảnh của thẻ bài app chính (Card 1) to hơn, trồi ra khỏi lề phải của thẻ bài và có chiều cao dài hơn các thẻ bài skeleton đối thủ bên cạnh (Card 2, 3, 4).

#### Cơ chế tầng sâu (Root Cause)
- Bề rộng màn hình iPad portrait là `718px`, trừ padding 2 bên `36px * 2 = 72px` còn lại `646px`.
- Lưới 2 cột có khoảng cách giữa 2 cột `gap = 22px`.
  - Độ rộng mỗi thẻ bài = `(646 - 22) / 2 = 312px`.
  - Trong mỗi thẻ bài, 2 ảnh screenshot hiển thị theo lưới 2 cột với `gap = 8px`.
  - Độ rộng chuẩn của mỗi ảnh = `(312 - 8) / 2 = 152px`.
  - Chiều cao chuẩn theo tỉ lệ 3:4 của iPad (`aspect-ratio: 2048 / 2732`) = `152 * (2732 / 2048) = 203px`.
- Trước đây, `png.js` hardcode tùy tiện `width: 166px; height: 221px;`.
  - Khi đặt `166px`, tổng bề rộng 2 ảnh là `166 * 2 + 8 = 340px > 312px`, làm ảnh bị trồi ra ngoài thẻ bài `28px`.
  - Chiều cao `221px` lớn hơn chiều cao `203px` của các thẻ skeleton kế bên, gây lệch toàn bộ hàng ngang.

#### Cách xử lý triệt để
- Chuẩn hóa chính xác kích thước ảnh thẻ chính và skeleton theo tỉ lệ grid thực tế của thiết bị:
  - **iPad Portrait:**
    - Ảnh dọc: `width: 152px !important; height: 203px !important;` (tỉ lệ 3:4 chuẩn).
    - Ảnh ngang (landscape): `width: 312px !important; height: 234px !important;`.
  - **iPad Landscape:**
    - Độ rộng thẻ bài là `427px`.
    - Ảnh dọc: `width: 209px !important; height: 279px !important;`.
    - Ảnh ngang: `width: 427px !important; height: 320px !important;`.
- Áp dụng đồng bộ cho cả `.ipad-sr-media img` và `.ipad-skel-shot`.

---

### Case 4: Lỗi Vị Trí Icon Tooltip (`Everyone ⓘ`)

#### Triệu chứng thực tế
- Icon tròn thông tin `ⓘ` cạnh chữ `Everyone` ở Google Play metrics strip bị đẩy lên góc trên hoặc đè lên chữ.

#### Cơ chế tầng sâu (Root Cause)
- Thẻ cha `<small>` sử dụng `display: inline-flex; gap: 3px;`.
- Khi html2canvas parse flex layout trên các phần tử inline nhỏ bên trong canvas clone, thuộc tính `gap` và `align-items` không được tính toán chính xác, khiến phần tử SVG bên trong bị đẩy lên vị trí cao nhất của flex line.

#### Cách xử lý triệt để
- Đổi từ flexbox sang inline flow truyền thống với `vertical-align`:
  ```css
  .g-info-ico {
    width: 10px;
    height: 10px;
    margin-left: 3px;
    vertical-align: -2px;
    display: inline-block;
    flex-shrink: 0;
  }
  ```
- Cấu hình này giúp icon bám chính xác vào trục x-height của văn bản trên mọi trình duyệt mà không phụ thuộc vào bộ engine flex của html2canvas.

---

### Case 5: Lỗi Vỡ Chiều Cao Khung Metrics Ribbon (Vertical Padding Collapse / Flex Stretch Bug)

#### Triệu chứng thực tế
- Khi xuất PNG mockup iPhone (ví dụ import ứng dụng có tên công ty phát triển dài như `5 Phút Thuộc Bài`):
  - Khung ribbon thông số Apple (`.a-met`) bị giãn nở chiều cao bất thường (lên tới ~120px-140px thay vì chuẩn ~72px).
  - Các đường kẻ dọc phân cách (`border-right`) giữa `RATINGS`, `AGE`, `CHART` bị kéo dài xuống dưới, tạo ra một khoảng trống màu trắng khổng lồ (~60px-70px) ở bên dưới chữ.
  - Viền dưới (`border-bottom`) của ribbon bị đẩy tụt xuống sát phần Preview screenshots.

#### Cơ chế tầng sâu (Root Cause)
1. **Sự can thiệp của selector toàn cục `[data-b]` trong `png.js`:**
   - Để xử lý lỗi "dít chữ" trong html2canvas, `[data-b]` đã được thêm vào danh sách bỏ giới hạn dòng (`-webkit-line-clamp: unset !important; white-space: pre-wrap !important; overflow: visible !important;`).
   - Tuy nhiên, trong thẻ Apple Metrics Ribbon (`.a-met`), item số 4 (DEVELOPER) chứa `<b data-b="dev">`.
   - Khi import ứng dụng có tên nhà phát triển dài (ví dụ `CÔNG TY CỔ PHẦN ĐÀO TẠO TÂM TRÍ LỰC`), thẻ `b[data-b="dev"]` bị giải phóng line-clamp và tự động ngắt dòng thành 5–6 dòng văn bản trong cột hẹp ~105px.
2. **Cơ chế `align-items: stretch` mặc định của CSS Flexbox:**
   - `.a-met` là một flex container. Thuộc tính `align-items` mặc định là `stretch`.
   - Do đó, khi item 4 (DEVELOPER nằm ở vị trí scroll bên phải) phình to lên ~115px, toàn bộ các item 1, 2, 3 (RATINGS, AGE, CHART) cũng bị ép co giãn chiều cao theo item cao nhất.
   - Các đường kẻ `border-right` của từng `div` con kéo dài suốt chiều cao bị kéo giãn, tạo khoảng trống khổng lồ bên dưới nội dung.

#### Cách xử lý triệt để
1. **Cô lập selector `[data-b]` trong `png.js`:**
   - Tuyệt đối không áp dụng unclamping bừa bãi vào ribbon thông số:
     ```css
     [data-b]:not(.a-met [data-b]):not(.ipad-met [data-b]):not(.g-met [data-b]) {
       -webkit-line-clamp: unset !important;
       -webkit-box-orient: unset !important;
       white-space: pre-wrap !important;
       overflow: visible !important;
       text-overflow: clip !important;
     }
     ```
2. **Khóa cứng chiều cao và căn chỉnh trong CSS (`metrics.css` & `png.js`):**
   - Đặt `align-items: center` trên `.a-met`.
   - Khóa chiều cao cố định và căn giữa theo trục dọc trên các item con:
     ```css
     .phone.apple:not(.ipad) .a-met > div {
       height: 48px !important;
       max-height: 48px !important;
       display: flex !important;
       flex-direction: column !important;
       justify-content: center !important;
       overflow: hidden !important;
     }
     .phone.ipad .a-met > div, .dev.landscape .phone.apple:not(.ipad) .a-met > div {
       height: 54px !important;
       max-height: 54px !important;
       display: flex !important;
       flex-direction: column !important;
       justify-content: center !important;
       overflow: hidden !important;
     }
     ```
   - Ràng buộc nghiêm ngặt developer item tối đa 2 dòng:
     ```css
     .a-met b[data-b="dev"] {
       font-size: 11.5px !important;
       max-height: 26px !important;
       display: -webkit-box !important;
       -webkit-line-clamp: 2 !important;
       -webkit-box-orient: vertical !important;
       overflow: hidden !important;
       text-overflow: ellipsis !important;
       white-space: normal !important;
       line-height: 1.15 !important;
     }
     ```
3. **Trong hàm `onclone` JavaScript:**
   - Bỏ qua các phần tử nằm trong `.a-met, .ipad-met, .g-met` khi duyệt vòng lặp chỉnh style inline:
     ```javascript
     if (el.closest('.a-met, .ipad-met, .g-met')) return;
     ```

---

## 4. Bảng Tra cứu Nhanh Thông số Viewport & Screenshots

| Màn hình / Thiết bị | Vị trí View | Thuộc tính DOM | Kích thước ảnh Dọc (Portrait) | Kích thước ảnh Ngang (Landscape) |
|---|---|---|---|---|
| **Apple iPhone** | Main Detail Gallery | `.gal img`, `[data-shots="gal"]` | `222px × 481px` (r: 11px) | `340px × 191px` (r: 9px) |
| **Apple iPhone** | Search Result (3 ảnh) | `.sr-shots img`, `[data-shots="shots"]` | `104px × 225px` (r: 12px) | `328px × 185px` (r: 12px) |
| **Google Play Phone** | Main Detail Gallery | `.gal img`, `[data-shots="gal"]` | `190px × 412px` (r: 7px) | `330px × 186px` (r: 7px) |
| **Google Play Phone** | Search Result (3 ảnh) | `.gp-search-shots img`, `[data-shots="gp-search"]` | `104px × 220px` (r: 10px) | `328px × 185px` (r: 10px) |
| **iPad (Portrait)** | Main Detail Gallery | `.ipad-gal img`, `[data-shots="ipad-gal"]` | `260px × 563px` (r: 12px) | `380px × 285px` (r: 12px) |
| **iPad (Portrait)** | Search Result (2 ảnh) | `.ipad-sr-media img`, `[data-shots="ipad-shots"]` | `152px × 203px` (r: 10px) | `312px × 234px` (r: 10px) |
| **iPad (Landscape)** | Search Result (2 ảnh) | `.ipad-sr-media img`, `[data-shots="ipad-shots"]` | `209px × 279px` (r: 10px) | `427px × 320px` (r: 10px) |

---

## 5. Quy trình Kiểm tra Trước khi Đóng Task (Checklist)

Trước khi commit bất kỳ thay đổi nào liên quan đến export hoặc typography:
- [ ] 1. Thư viện `core/src/lib/html2canvas.min.js` có hoàn toàn sạch và không bị monkey-patch không?
- [ ] 2. Mọi biến phân nhánh (`isSearch`, `isApple`, v.v.) trong `png.js` đã có từ khóa khai báo `const`/`let` chưa?
- [ ] 3. Đã chạy thử lệnh test: `node core/scripts/test-runner.js` và vượt qua 100% tests?
- [ ] 4. Đã chạy build đầy đủ: `node core/build.js && npm run build && npm run build:marketing`?
- [ ] 5. Kiểm tra visual export trên cả 4 trình duyệt: Chrome, Safari, Firefox, Brave để đảm bảo không dính chữ và ảnh không bị méo.
