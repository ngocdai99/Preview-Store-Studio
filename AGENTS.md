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

## 4. Tóm tắt nhanh quy tắc kiểm tra (Pre-Commit Checklist)

Mỗi khi agent cập nhật copy, metadata, tour steps, hoặc landing page:
1. [ ] Đã quét và loại bỏ toàn bộ `pixel-perfect`, `production-ready`, `zero server lock-in`, `with confidence` chưa?
2. [ ] Các tên thiết bị có đang ở dạng generic (`iPhone`, `iPad`, `Android phone`, `Android tablet`) chứ không gắn model đời máy không?
3. [ ] Các icon/hình ảnh đại diện store có phải là custom/neutral không vi phạm bản quyền logo chính thức của Apple/Google không?
