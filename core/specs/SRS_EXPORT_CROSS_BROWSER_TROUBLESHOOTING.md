# SRS: Export Engine & Cross-Browser Troubleshooting Playbook

> **Mã tài liệu:** `SRS_EXPORT_CROSS_BROWSER_TROUBLESHOOTING`  
> **Phiên bản:** `1.1.0`  
> **Cập nhật lần cuối:** `2026-11-07`  
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

### Case 6: Lỗi Ellipsis Cắt Chuỗi Search Card Bị Vỡ Thành Nhiều Dòng Trên Bản Xuất PNG (Single-Line Truncation & Multi-Line Wrap Divergence)

#### Triệu chứng thực tế
- Trên **Live Canvas (Preview DOM)**:
  - Tên ứng dụng, tên công ty / nhà phát triển hoặc dòng phụ đề dài được trình duyệt tự động cắt gọn gàng trên 1 dòng đơn kèm dấu ba chấm `...` theo CSS `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` (ví dụ: `TAM TRI LUC TRAINING JOINT STO...` hoặc `Official Social Networking A...`).
- Trên **Bản xuất PNG (`exportPNG` / html2canvas)**:
  - Dòng text bị rớt xuống thành 2 dòng, text bung full độ dài (ví dụ: `TAM TRI LUC TRAINING` ở dòng 1 và `JOINT STOCK COMPANY` ở dòng 2).
  - Dấu chấm phân cách và category (`• Education`) bị đẩy dạt sang mép phải hoặc nhảy hàng bậc thang.
  - Hoàn toàn biến mất ký tự ba chấm `...` so với màn hình canvas ban đầu.

#### Cơ chế tầng sâu (Root Cause)
1. **html2canvas không tự sinh ra ký tự glyph `...` (Ellipsis Fallback Bug):**
   - html2canvas là canvas rasterizer duyệt qua các text node của DOM tree và đo tọa độ qua `Range.getClientRects()`. Khi gặp `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`, thư viện **không có logic vẽ glyph `...` độc lập**.
   - Thay vào đó, html2canvas vẽ toàn bộ chuỗi text tràn ra ngoài biên hoặc cắt cụt (clip) nham nhở các nét chữ mà không có dấu ba chấm.
2. **Xung đột `white-space: pre-wrap !important` trên các phần tử `[data-b]`:**
   - Để xử lý lỗi dính chữ (Case 1), engine xuất ảnh inject style:
     ```css
     [data-b]:not(...) { white-space: pre-wrap !important; overflow: visible !important; }
     ```
   - Nếu các thẻ con `[data-b="dev"]` hoặc `[data-b="cat"]` bên trong card tìm kiếm (như `.gt10-item-sub [data-b]`, `.gt7-app-meta [data-b]`, `.ipad-sr-card-info [data-b]`) không được loại trừ tường minh trong selector `:not(...)` hoặc trong vòng lặp inline style (`el.closest(...)`), chúng sẽ bị ép `white-space: pre-wrap !important`.
   - Kết quả: Khi gặp khoảng trắng giữa các từ, chuỗi dài tự động bẻ dòng (wrap) thành 2-3 dòng thay vì giữ trên 1 dòng duy nhất.
3. **Xung đột cấu trúc Flexbox và CSS Text-Overflow:**
   - Khi container chứa text (ví dụ `.gt10-item-sub`) bị gán `display: flex !important`, các thẻ con `<span>` và text node ` &bull; ` trở thành các flex items tách biệt.
   - Thuộc tính `text-overflow: ellipsis` trên flex container **vô hiệu hóa** với các flex items con. Trình duyệt chỉ cắt ellipsis đúng khi container là `display: block` và các thẻ con bên trong là `display: inline`.

#### Hướng dẫn khắc phục triệt để (Standard Solution)
1. **Engine đo và cắt chuỗi tiền xử lý bằng Canvas 2D (`searchEllipsisSelectors`):**
   - Trước khi html2canvas tiến hành rasterize `cloneTarget`, thực hiện đo đạc chuỗi và gán trực tiếp chuỗi đã cắt kèm `...` trên các selector:
     ```javascript
     const searchEllipsisSelectors = '.ipad-sr-app-title, .ipad-sr-app-sub, .sr-title, .sr-subtitle, .gp-search-card-name, .gt10-item-title, .gt10-item-sub, .gt7-app-name';
     ```
   - Đo chiều rộng thực tế `liveEl.clientWidth` trên Live DOM.
   - **Bắt buộc có guard check:** Kiểm tra `if (ctx.measureText(fullText).width <= targetWidth) return;` để đảm bảo chuỗi ngắn (như `"5 Phút Thuộc Bài"`) còn khoảng trống không bao giờ bị chèn thêm dấu `...` vô lý.
   - Nếu chuỗi thực sự dài vượt quá `targetWidth`, áp dụng binary search để tìm chuỗi con dài nhất vừa vặn với `targetWidth = availWidth - 2` rồi nối thêm `...`.
   - Gán chuỗi đã cắt trực tiếp vào `cloneEl.textContent`. Lúc này `html2canvas` chỉ việc vẽ 1 chuỗi đơn đã cắt sẵn kèm `...`, đảm bảo 100% khớp với canvas.
2. **Loại trừ tường minh khỏi quy tắc ép `pre-wrap`:**
   - Trong `btnStyle.textContent` của `png.js`:
     ```css
     [data-b]:not(.a-met [data-b]):not(.ipad-met [data-b]):not(.g-met [data-b]):not(.gp-search-card-meta [data-b]):not(.gt7-app-meta [data-b]):not(.gt10-item-sub [data-b]):not(.gt10-item-meta [data-b]):not(.ipad-sr-card-info [data-b]):not(.sr-info [data-b]):not(.gp-search-card-info [data-b]) { ... }
     ```
   - Trong vòng lặp inline style duyệt `[data-b]`:
     ```javascript
     if (el.closest('.a-met, .ipad-met, .g-met, .gp-search-card-meta, .gt7-app-meta, .gt10-item-sub, .gt10-item-meta, .ipad-sr-card-info, .sr-info, .gp-search-card-info')) return;
     ```
3. **Đảm bảo Display Block & Inline Flow cho Subtitle:**
   - Trong `tablets.css` và `png.js`:
     ```css
     .dev.gtab .gt10-item-sub {
       display: block !important;
       white-space: nowrap !important;
       overflow: hidden !important;
       text-overflow: ellipsis !important;
       line-height: 1.2 !important;
     }
     .dev.gtab .gt10-item-sub span {
       display: inline !important;
       white-space: nowrap !important;
     }
     ```

---

### Case 7: Lỗi Nút Bấm Firefox Gecko (`<button>` nsButtonBoxFrame) Lệch Vị Trí & Trôi Chữ Ngang Dọc

#### Triệu chứng thực tế
- Trên **Google Chrome / Apple Safari**: Nút "Install" trên tablet 7-inch hoặc card tìm kiếm hiển thị căn giữa chuẩn xác cả ngang lẫn dọc.
- Trên **Mozilla Firefox**:
  - Khung nút bị xô lệch vị trí so với hàng icon và skeleton card.
  - Chữ "Install" bên trong nút pill bị đẩy dạt sang phải (khoảng cách lề trái ~41px so với lề phải ~17px) và tụt xuống dưới ~2.5px.

#### Cơ chế tầng sâu (Root Cause)
- Trình duyệt Firefox (Gecko engine) bao bọc thẻ `<button>` bằng một frame render nội bộ gọi là `nsButtonBoxFrame`.
- Khi kết hợp thẻ `<button>` với `display: inline-flex` hoặc `display: flex`, thư viện `html2canvas` tính toán vị trí text node thông qua `Range.getClientRects()`.
- Trên Firefox, các chỉ số bounding box của Gecko internal button frame bị **cộng dồn hai lần** (double offset calculation), dẫn đến chữ bên trong bị trôi lệch sang phải và xuống đáy nút.

#### Hướng dẫn khắc phục triệt để (Standard Solution)
1. **Chuyển đổi `<button>` thành `<div>` trên bản sao `cloneTarget` trước khi render:**
   - Trước khi html2canvas phân tích DOM, chuyển đổi toàn bộ thẻ `<button>` thành `<div>` có `role="button"`:
     ```javascript
     cloneTarget.querySelectorAll('button.gt7-app-btn').forEach(btn => {
       const div = document.createElement('div');
       div.className = btn.className;
       div.textContent = btn.textContent;
       div.setAttribute('role', 'button');
       btn.replaceWith(div);
     });
     ```
2. **Căn giữa bằng Text-Align & Line-Height truyền thống:**
   - Áp dụng các thuộc tính CSS chuẩn mực, độc lập với engine nút bấm:
     ```css
     .dev.gtab .gt7-app-btn {
       display: inline-block !important;
       text-align: center !important;
       line-height: 26px !important;
       height: 28px !important;
       padding: 0 14px !important;
       box-sizing: border-box !important;
       vertical-align: middle !important;
       flex-shrink: 0 !important;
     }
     ```
   - Nhờ chuyển sang thẻ `<div>` và sử dụng `text-align: center; line-height: 26px;`, Gecko hoàn toàn không kích hoạt `nsButtonBoxFrame`, mang lại kết quả căn giữa đối xứng hoàn hảo trên cả Firefox, Chrome và Safari.

---

### Case 8: Lỗi Mất Thẻ Cha `.dev` Khi Xuất Ảnh Màn Hình Thuần Túy (Screen Only / Frameless CSS Selector Orphan Bug)

#### Triệu chứng thực tế
- Khi người dùng chọn **"Copy screen only"** hoặc **"Download screen only"** trên thiết bị Tablet 10-inch (hoặc Tablet 7-inch, iPad):
  - Ảnh xuất ra bị vỡ vụn toàn bộ giao diện: một icon SVG (như icon Game Controller trên thanh Navigation Rail) bị phóng to cực đại choán hết 100% màn hình phía dưới status bar.
  - Bố cục flexbox hai cột và master-detail của tablet biến mất, biến thành khối dọc lệch lạc.

#### Cơ chế tầng sâu (Root Cause)
1. **Cô lập thẻ con `.phone` khỏi thẻ cha `.dev`:**
   - Khi `opts.frameless === true`, engine xuất ảnh ban đầu chỉ lấy phần tử màn hình:
     ```javascript
     const target = devToCapture.querySelector('.phone') || devToCapture;
     const cloneTarget = target.cloneNode(true);
     ```
   - Thẻ `.phone` khi được clone sang `offscreenWrap` hoàn toàn bị tách rời khỏi thẻ cha `.dev.gtab10` (hoặc `.dev.gtab7`, `.dev.ipad`).
2. **Mất toàn bộ Scoped CSS & CSS Custom Properties:**
   - Trong hệ thống CSS, các biến kích thước màn hình `--sw: 1024px; --sh: 640px;` và hàng loạt selector định hình layout tablet (ví dụ `.dev.gtab10 .gt10-workspace`, `.dev.gtab10 .gt10-rail-icon svg { width: 20px; height: 20px; }`) đều bắt đầu bằng class `.dev.gtab10`.
   - Khi mất thẻ cha `.dev.gtab10`:
     - Thẻ `<svg>` của icon Navigation Rail không có width/height trong thuộc tính HTML, bị trình duyệt mở rộng ra 100% chiều rộng container.
     - Layout flexbox `.gt10-workspace` mất `display: flex; height: calc(100% - 30px);`, biến thành `display: block` thông thường khiến icon SVG đầu tiên chiếm trọn toàn bộ canvas.

#### Hướng dẫn khắc phục triệt để (Standard Solution)
- **Bọc `cloneTarget` bằng `devWrap` ảo:**
  - Khi xuất `opts.frameless && devToCapture !== target`, tạo một thẻ cha `devWrap` có đầy đủ class và `data-*` attributes của `devToCapture`:
    ```javascript
    if (opts.frameless && devToCapture && devToCapture !== target) {
      const devWrap = document.createElement('div');
      devWrap.className = devToCapture.className;
      if (devToCapture.id) devWrap.id = 'clone-' + devToCapture.id;
      Array.from(devToCapture.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          devWrap.setAttribute(attr.name, attr.value);
        }
      });
      devWrap.style.cssText = 'padding:0!important;margin:0!important;border:none!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;width:100%!important;height:100%!important;position:relative!important;';
      devWrap.appendChild(cloneTarget);
      offscreenWrap.appendChild(devWrap);
    } else {
      offscreenWrap.appendChild(cloneTarget);
    }
    ```
  - Trong `clonedDoc`, xóa sạch padding, border, background và box-shadow trên `.dev` khi `opts.frameless`:
    ```javascript
    if(opts.frameless){
      d.style.padding = '0';
      d.style.background = 'none';
      d.style.boxShadow = 'none';
      d.style.border = 'none';
    }
    ```
  - Nhờ đó, tất cả các selector `.dev.gtab10`, `.dev.gtab7`, `.dev.ipad` và các biến CSS `--sw, --sh` đều khớp chính xác 100%, bảo toàn nguyên vẹn mọi icon và layout hai cột khi xuất screen only.

---

### Case 9: Lỗi Rò Rỉ Khung Screenshots Vào Màn Hình Tìm Kiếm Tablet 7" (Hidden Search Gallery Leak Bug)

#### Triệu chứng thực tế
- Trên **Live Canvas (Preview DOM)**: Chế độ xem Search Results của Google Play Tablet 7" hiển thị bình thường (lưới 2 cột gồm card app chính và các skeleton cards).
- Trên **Bản xuất PNG (`exportPNG`)**: Ở đáy màn hình tìm kiếm xuất hiện một hàng ảnh screenshots (3 ảnh ngang/dọc) nằm lơ lửng đè lên đáy giao diện tìm kiếm.

#### Cơ chế tầng sâu (Root Cause)
1. **Phần tử ẩn tàn dư trong cấu trúc DOM:**
   - Trong markup của Tablet 7-inch (`core/src/components/mockups/google/tab7.html`), bên trong `<div data-v="search" class="gt7-search-view">` có chứa phần tử:
     ```html
     <div class="gal gt-gal" id="srchTab7" style="display:none"></div>
     ```
   - Hàm `renderTablets()` trong mã nguồn nạp các ảnh screenshot vào `#srchTab7`. Trên giao diện thường, phần tử này ẩn nhờ `style="display:none"`.
2. **Quy tắc `.gal { display: flex !important }` ghi đè thuộc tính ẩn:**
   - Trong `btnStyle.textContent` của `png.js`, quy tắc mở rộng carousel screenshot:
     ```css
     .gal, [data-shots="gal"], [data-shots="ipad-gal"] { display: flex !important; }
     ```
   - Do có `!important`, quy tắc này đè bẹp hoàn toàn `style="display:none"` của `#srchTab7`.
   - Kết quả: Thẻ `#srchTab7` bị kích hoạt thành `display: flex !important` ngay trong view search đang kích hoạt, phơi bày toàn bộ ảnh screenshots ra đáy màn hình.

#### Hướng dẫn khắc phục triệt để (Standard Solution)
1. **Xóa bỏ các gallery ẩn trong search view trên `cloneTarget`:**
   - Trước khi đo đạc và render, xóa hoàn toàn phần tử `#srchTab7`:
     ```javascript
     cloneTarget.querySelectorAll('#srchTab7, .gt7-search-view #srchTab7, [data-v="search"] .gal, [data-v="search"] [data-shots]').forEach(el => el.remove());
     ```
2. **Cập nhật quy tắc CSS inject không áp dụng cho gallery trong Search View:**
   - Trong `btnStyle.textContent`:
     ```css
     .gal:not(#srchTab7):not([data-v="search"] .gal), [data-shots="gal"], [data-shots="ipad-gal"] {
       display: flex !important;
       scroll-snap-type: none !important;
       overflow: visible !important;
       overflow-x: visible !important;
     }
     #srchTab7, [data-v="search"] .gal, [data-v="search"] [data-shots] {
       display: none !important;
     }
     ```
3. **Dọn dẹp trong `onclone(clonedDoc)`:**
   - Xóa bỏ triệt để và gán `style.display = 'none'` cho bất kỳ gallery nào nằm trong `[data-v="search"]`.

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
