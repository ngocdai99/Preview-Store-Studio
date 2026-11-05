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

## 4. Quy tắc ngưỡng Quota & Trạng thái Giữ (2% Quota Limit & Hold State)

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

## 5. Quy tắc giới hạn thời gian gỡ lỗi & Chống lặp vô nghĩa (10-Minute Debug Cap & Solution Re-evaluation)

Để tránh lãng phí thời gian, sa đà vào các vòng lặp đo đạc/debug ngầm hoặc xử lý triệu chứng ở ngọn thay vì gốc rễ:

* **Ngưỡng kích hoạt:** Khi một vấn đề kỹ thuật/bug được phân tích, điều tra hoặc thử nghiệm quá **10 phút** (hoặc sau tối đa 2-3 lần thử mà không ra kết quả thực tế):
* **Hành động bắt buộc:**
  1. **Dừng ngay lập tức (Immediate Stop):** Lập tức dừng toàn bộ các tiến trình command chạy nền, script thử nghiệm, và các chuỗi giả định phức tạp.
  2. **Nhìn lại giải pháp (Step Back & Re-evaluate):** Đặt lại câu hỏi về giả định gốc rễ: *Có đang chữa triệu chứng thay vì căn nguyên không? Vấn đề này có thể giải quyết dứt điểm bằng cách đơn giản, trực diện hơn ở tầng nào?*
  3. **Báo cáo và tham vấn người dùng:** Trình bày ngắn gọn, thẳng thắn lý do chưa thành công, điểm bế tắc kỹ thuật và hướng tiếp cận căn cơ mới. Không để phiên làm việc trôi đi trong im lặng với các lệnh debug kéo dài.

---

## 6. Tóm tắt nhanh quy tắc kiểm tra (Pre-Commit Checklist)

Mỗi khi agent cập nhật copy, metadata, tour steps, hoặc landing page:
1. [ ] Đã quét và loại bỏ toàn bộ `pixel-perfect`, `production-ready`, `zero server lock-in`, `with confidence` chưa?
2. [ ] Các tên thiết bị có đang ở dạng generic (`iPhone`, `iPad`, `Android phone`, `Android tablet`) chứ không gắn model đời máy không?
3. [ ] Các icon/hình ảnh đại diện store có phải là custom/neutral không vi phạm bản quyền logo chính thức của Apple/Google không?
4. [ ] Quota hệ thống còn trên mức an toàn (> 2%), nếu chạm ngưỡng ≤ 2% đã thực hiện quy trình dừng an toàn và chuyển trạng thái `HOLD` chưa?
5. [ ] Nếu điều tra lỗi kỹ thuật: đã tuân thủ ngưỡng tối đa 10 phút, dừng lại nhìn lại giải pháp nếu không có kết quả chưa?
