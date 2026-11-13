# Store Preview Studio · Agent Guidelines & Guardrails

Tài liệu này định nghĩa các nguyên tắc và giới hạn bắt buộc (guardrails) khi AI agent tạo nội dung, copy, UI text, hoặc sinh mã nguồn cho Store Preview Studio.

---

## 1. Tuyệt đối không sinh câu cam kết lố (No Overpromising / Absolute Commitments)

Không được sử dụng bất kỳ từ ngữ nào mang tính cam kết chất lượng tuyệt đối, bảo đảm pháp lý hay tiếp thị thổi phồng (over-promising claims).

### ❌ Bị cấm (Forbidden Terms)
* `pixel perfect`, `pixel-perfect`
* `production ready`, `production-ready`
* `with confidence` (ví dụ: "submit with confidence", "launch with confidence")
* `zero server lock-in`
* `100% guaranteed`, `guarantee`, `warranty`, `flawless`
* Bất kỳ câu khẳng định bảo đảm ứng dụng chắc chắn sẽ được Apple/Google duyệt hoặc hoàn hảo không lỗi.

### ✅ Khuyến nghị thay thế (Recommended Alternatives)
* Thay `pixel-perfect bezels` → `realistic device frames`, `styled frames`, `adaptive frames`
* Thay `production-ready listings` → `curated listings`, `sample listings`, `ready-to-edit templates`
* Thay `with zero server lock-in` → `directly in your browser`, `stored locally in your browser`
* Thay `submit with confidence` → `review and export deliverables`, `prepare for submission`
* Dùng từ ngữ thực tế, khách quan: `streamlined`, `curated`, `responsive`, `practical`, `high-resolution`.

---

## 2. Không chỉ đích danh model thiết bị cụ thể (Device Generics & Future-Proofing)

Để tránh nội dung và mã nguồn bị lỗi thời theo từng chu kỳ ra mắt sản phẩm phần cứng, không bao giờ hardcode hoặc ghi cụ thể tên các model thiết bị đời mới/cũ trong copy, tài liệu tiếp thị, hoặc tour giới thiệu.

### ❌ Bị cấm (Forbidden Specific Hardware Names)
* Các model máy cụ thể: `iPhone 15 Pro`, `iPhone 16 Pro Max`, `iPhone 14`, `iPad Pro 13" M4`, `Pixel 8 / 9 Pro`, `Samsung Galaxy S24 Ultra`, v.v.

### ✅ Khuyến nghị thay thế (Generic Device Categories)
* Gọi theo danh mục thiết bị chung: `iPhone`, `iPad`, `Android phone`, `Android tablet`, `phone & tablet`, `mobile devices`.
* Trong kỹ thuật preview/frame: dùng tỉ lệ màn hình hoặc kích thước tiêu chuẩn dạng mô tả kỹ thuật trung tính (`Phone preview`, `Tablet preview`, `Compact / Expanded layout`).

---

## 3. Không sử dụng logo/icon nguyên bản của Apple & Google (IP & Trademark Protection)

Để tuân thủ bản quyền thương hiệu và tránh vi phạm chính sách nhãn hiệu của Apple Inc. và Google LLC:

### ❌ Bị cấm (Forbidden Trademark Usages)
* Không nhúng trực tiếp hoặc sao chép 1:1 vector logo quả táo cắn dở chính thức của Apple (`Apple logo icon`).
* Không nhúng trực tiếp hoặc sao chép 1:1 vector logo tam giác màu chính thức của Google Play (`Google Play multi-colored triangle`).
* Không sử dụng các asset thương hiệu có thể dẫn đến hiểu lầm đây là sản phẩm chính thức do Apple hoặc Google phát hành/ủy quyền.

### ✅ Khuyến nghị thay thế (Brand-Safe Alternatives)
* Sử dụng generic silhouette, neutral geometric icons (ví dụ icon điện thoại, icon kho ứng dụng, biểu tượng túi đồ store, biểu tượng tag/box).
* Dùng nhãn text rõ ràng (ví dụ pill text `App Store`, `Google Play`) kèm disclaimer rằng Store Preview Studio là công cụ độc lập, không liên kết với Apple Inc. hay Google LLC.
* Khi cần biểu tượng đại diện: sử dụng các custom simplified icon hoặc Lucide icons trung tính.

---

## 4. Tuyệt đối không vẽ Badge / Pill màu mè kiểu AI-Slop (No Tacky Colored Pill Badges)

Nghiêm cấm tự tiện tạo các badge/pill dạng viền màu + nền màu mờ + chữ màu brand nổi bần bật (ví dụ điển hình: viền xanh lá, nền xanh lá 10-20% opacity, chữ xanh lá như `text-[#00D085] bg-[#00D085]/10 border border-[#00D085]/20`).

### ❌ Bị cấm (Forbidden Badge / Pill Styles)
* Không bọc giá tiền, tag miễn phí ("Free, pay what you want", "$39"), nhãn danh mục, học vấn hoặc micro-copy vào các badge pill màu mè (kiểu AI template rẻ tiền, sến và làm rối mắt giao diện).
* Không lạm dụng spam màu xanh brand (`#00D085`) vào các chi tiết phụ trợ không phải CTA chính.
* Không tự ý nhét icon chấm tròn màu xanh (green circle dot) hay status dot nhấp nháy vào các pill text thông thường trừ khi người dùng yêu cầu rõ ràng.

### ✅ Khuyến nghị thay thế (Clean & Minimalist Alternatives)
* **Dùng Plain Text với Typography chuẩn mực:** Thể hiện giá tiền, phân loại, trạng thái bằng text thuần thanh lịch (`text-sm font-medium text-[#EDEDED]` hoặc `text-[#989A99]`), không bọc khung/nền.
* **Nếu bắt buộc dùng pill theo thiết kế (như nút / status pill đã được duyệt):** Dùng phong cách trung tính tối giản (Monochrome / Neutral):
  - Pill nền trắng chữ đen sang trọng (`bg-white text-[#0f172a] font-medium rounded-full shadow-sm`).
  - Hoặc pill nền tối viền mờ tinh tế (`border border-[#282928] bg-[#1D1E1D] text-[#989A99] font-normal`).
  - Tuyệt đối không dùng combo sến súa: "chữ màu xanh + nền màu xanh + viền màu xanh".

---

## 5. Quy tắc ngưỡng Quota & Trạng thái Giữ (2% Quota Limit & Hold State)

Để đảm bảo an toàn toàn vẹn dữ liệu, tránh việc bị ngắt kết nối đột ngột giữa chừng làm hỏng file, gãy luồng xử lý hoặc mất bối cảnh:

* **Ngưỡng kích hoạt:** Khi phát hiện giới hạn quota (token, context window, rate-limit, hoặc API limit) chỉ còn **≤ 2%**:
* **Hành động bắt buộc:**
  1. **Dừng ngay lập tức (Immediate Stop):** Lập tức dừng thực thi mọi tác vụ mới, không tiếp tục gọi thêm các chuỗi lệnh command hoặc tool call phức tạp.
  2. **Ghi nhận nhật ký (Log State):** Ghi chép chi tiết vào nhật ký phiên làm việc về:
     - Thời điểm chạm ngưỡng quota (≤ 2%).
     - Tác vụ vừa hoàn tất và kết quả đạt được.
     - Các hạng mục còn dở dang kèm điểm dừng an toàn (safe checkpoint).
  3. **Chuyển trạng thái HOLD:** Thiết lập trạng thái làm việc sang **`HOLD`** (Tạm dừng an toàn).
  4. **Báo cáo người dùng:** Thông báo ngắn gọn và trực tiếp cho người dùng biết hệ thống đã chủ động chuyển sang trạng thái `HOLD` để bảo vệ phiên làm việc, kèm các bước tiếp theo khi quota được phục hồi.

---

## 6. Quy tắc giới hạn thời gian gỡ lỗi & Chống lặp vô nghĩa (Time & Step Cap)

Để tránh lãng phí thời gian, sa đà vào các vòng lặp đo đạc/debug ngầm hoặc xử lý triệu chứng ở ngọn thay vì gốc rễ:

* **Ưu tiên tuyệt đối (Highest Priority):** Quy tắc này có hiệu lực tối cao, đè bẹp (override) mọi cơ chế tự trị/tự động retry khác. Tuyệt đối không để một lượt phản hồi chạy kéo dài quá 3-5 phút.
* **Giới hạn số bước (Hard Step Cap):** Tối đa **2 lần thử (retries)** đối với một lỗi kỹ thuật trực tiếp. Sau 2 lần không khắc phục được, **bắt buộc phải dừng ngay lập tức** và xuất text báo cáo người dùng.
* **Ngưỡng kích hoạt:** Khi phát hiện một lỗi/bug kéo dài quá **5-10 phút** hoặc đã qua 2 lần retry:
* **Hành động bắt buộc:**
  1. **Dừng ngay lập tức (Immediate Stop):** Lập tức dừng toàn bộ các tiến trình command chạy nền, script thử nghiệm, và các chuỗi giả định phức tạp.
  2. **Nhìn lại giải pháp (Step Back & Re-evaluate):** Đặt lại câu hỏi về giả định gốc rễ: *Có đang chữa triệu chứng thay vì căn nguyên không? Vấn đề này có thể giải quyết dứt điểm bằng cách đơn giản, trực diện hơn ở tầng nào?*
  3. **Báo cáo và tham vấn người dùng:** Trình bày ngắn gọn, thẳng thắn lý do chưa thành công, điểm bế tắc kỹ thuật và hướng tiếp cận căn cơ mới. Không để phiên làm việc trôi đi trong im lặng với các lệnh debug kéo dài.

---

## 7. Quy tắc kiểm thử đúng phạm vi (Scoped Verification & Anti-Overkill)

Nghiêm cấm việc "dùng búa tạ đập hạt dẻ" gây lãng phí thời gian và context window:

1. **Phân loại tác vụ (Task Scoping):**
   - **Tác vụ CSS, UI hiển thị, Copy, Typography, Color:** CHỈ cập nhật đúng file, chạy lệnh build nhanh tương ứng (`node build.js` ~30ms), kiểm tra trực tiếp target cần sửa và trả kết quả ngay trong vài chục giây.
   - **CẤM:** Tuyệt đối không tự ý chạy full test suite (1,749 test cases) hay build Next.js marketing production (`next build`) cho các thay đổi thuần CSS/UI nhỏ.
2. **Khi nào mới chạy Full Test Suite?**
   - Chỉ chạy full test runner khi: thay đổi cấu trúc state management cốt lõi (`app.js`, `storage.js`), sửa export engine (`png.js`), import/export JSON, refactor lớn, hoặc khi người dùng yêu cầu rõ ràng.
3. **Cô lập lỗi ngoài phạm vi (Isolate Out-of-Scope Failures):**
   - Nếu trong quá trình chạy test phát hiện một lỗi ở tính năng khác (không liên quan đến file/yêu cầu hiện tại của người dùng): **KHÔNG ĐƯỢC tự ý nhảy vào debug ngầm lỗi đó**. Phải báo cáo rõ: *"Yêu cầu của bạn đã hoàn tất, nhưng phát hiện lỗi tồn dư ở module X (Suite Y). Cần xử lý riêng module đó không?"*

---

## 8. Quy tắc thao tác Git & Release tinh gọn (Fast Streamlined Git Operations)

Nghiêm cấm biến lệnh `git push` đơn giản thành một chuỗi kiểm thử nặng gây lãng phí thời gian:

1. **Cấm tự ý chạy lại Full Test / Build khi Push:**
   - Khi người dùng yêu cầu `git push` hoặc `commit`, nếu các lượt trước vừa build/test hoặc chỉ vừa sửa các thay đổi CSS/UI/copy nhỏ: **CẤM TUYỆT ĐỐI** việc tự kích hoạt lại toàn bộ full test suite (1,749 tests) hay build Next.js production.
2. **Gom lệnh dứt điểm (Single-Shot Execution & Minimal Approval Friction):**
   - Không chẻ nhỏ thành chuỗi lệnh rải rác (`git status` -> `test` -> `build` -> `diff` -> `add` -> sandbox error -> `add` lại -> `commit` -> `push`) làm xuất hiện nhiều lần popup xin quyền sandbox gây gián đoạn và cộng dồn thời gian chờ của người dùng.
   - Gom thành một chuỗi thực thi trực diện duy nhất:
     `git add -A && git commit -m "..." && git push origin <branch>`
     với `BypassSandbox: true` ngay từ đầu để người dùng chỉ cần bấm Approve một lần duy nhất.
3. **Giới hạn thời gian thực thi:**
   - Tác vụ git push phải hoàn tất trong vòng **15–30 giây**, không để biến thành phiên chờ đợi kéo dài nhiều phút.

---

## 9. Tóm tắt nhanh quy tắc kiểm tra (Pre-Commit Checklist)

Mỗi khi agent cập nhật copy, metadata, tour steps, hoặc landing page:
1. [ ] Đã quét và loại bỏ toàn bộ `pixel-perfect`, `production-ready`, `zero server lock-in`, `with confidence` chưa?
2. [ ] Các tên thiết bị có đang ở dạng generic (`iPhone`, `iPad`, `Android phone`, `Android tablet`) chứ không gắn model đời máy không?
3. [ ] Các icon/hình ảnh đại diện store có phải là custom/neutral không vi phạm bản quyền logo chính thức của Apple/Google không?
4. [ ] Tuyệt đối không vẽ badge/pill màu mè kiểu AI-slop (viền xanh + nền mờ xanh + chữ xanh)? Dùng plain text hoặc neutral pill chưa?
5. [ ] Quota hệ thống còn trên mức an toàn (> 2%), nếu chạm ngưỡng ≤ 2% đã thực hiện quy trình dừng an toàn và chuyển trạng thái `HOLD` chưa?
6. [ ] Kiểm thử có đúng phạm vi không (không chạy full test / Next.js build cho task CSS nhỏ)?
7. [ ] Tuân thủ giới hạn tối đa 2 lần retry và không chạy ngầm quá thời gian quy định?
8. [ ] Task git push: đã gom lệnh dứt điểm, không tự ý chạy lại full test/build thừa thãi chưa?
