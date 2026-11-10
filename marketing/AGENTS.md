<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Marketing Landing Page · Agent Guidelines & UI Guardrails

Xem toàn bộ quy tắc chung tại [Root AGENTS.md](../AGENTS.md).

## Quy tắc cấm tạo Badge / Pill màu mè kiểu AI-Slop
* **Tuyệt đối không vẽ pill/badge dạng viền màu + nền màu mờ + chữ màu brand nổi bật** (ví dụ: viền xanh lá, nền xanh lá 10-20% opacity, chữ xanh lá như `text-[#00D085] bg-[#00D085]/10 border border-[#00D085]/20`).
* Không bọc giá tiền, tag miễn phí ("Free, pay what you want", "$39"), nhãn danh mục hay micro-copy vào các badge pill màu mè.
* Dùng plain text với typography chuẩn mực (`text-sm font-medium text-[#EDEDED]` hoặc `text-[#989A99]`).
* Nếu bắt buộc dùng pill theo thiết kế: dùng pill trung tính (nền trắng chữ đen `bg-white text-[#0f172a]` hoặc nền tối viền mờ `bg-[#1D1E1D] border-[#282928] text-[#989A99]`). Tuyệt đối không dùng combo sến súa chữ xanh + nền xanh + viền xanh.
