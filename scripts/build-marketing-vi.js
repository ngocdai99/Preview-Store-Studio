#!/usr/bin/env node
/**
 * ========================================================================
 * [DEPRECATED / NGƯNG BẢO TRÌ]
 * LƯU Ý DÀNH CHO AGENT / DEVELOPER:
 * - Đã ngưng bảo trì marketing_vi. Agent tuyệt đối KHÔNG thực hiện sửa file,
 *   KHÔNG chạy build và KHÔNG deploy bản marketing_vi nữa.
 * - Tương tự, lệnh deploy lên surge.sh cũng đã ngưng bảo trì.
 * ========================================================================
 * 
 * Store Preview Studio · Vietnamese Marketing Page Generator
 * 
 * Generates docs/marketing_vi.html from docs/marketing.html
 * Keeps technical industry terms in English while rendering all copy,
 * buttons, labels, and modals in polished Vietnamese.
 */

const fs = require('fs');
const path = require('path');
const { minifyHtmlPage } = require('./minifier.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_FILE = path.join(ROOT_DIR, 'docs', 'marketing.html');
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing_vi.html');
const MIN_OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'marketing_vi.min.html');
const ROOT_OUTPUT_FILE = path.join(ROOT_DIR, 'marketing_vi.html');
const INDEX_OUTPUT_FILE = path.join(ROOT_DIR, 'docs', 'index.html');
const CLOUDFLARE_DIR = path.join(ROOT_DIR, 'cloudflare');

let missed = 0;
function rep(src, from, to) {
  if (!src.includes(from)) {
    missed++;
    console.warn(`[!] Không khớp, bỏ qua: ${from.slice(0, 70).replace(/\n/g, '\\n')}…`);
    return src;
  }
  return src.replace(from, () => to);
}
function repAll(src, from, to) {
  if (!src.includes(from)) {
    missed++;
    console.warn(`[!] Không khớp, bỏ qua: ${from.slice(0, 70)}…`);
    return src;
  }
  return src.replaceAll(from, () => to);
}

function buildMarketingVi() {
  console.warn('[DEPRECATED / NGƯNG BẢO TRÌ] marketing_vi đã chính thức ngưng bảo trì. Agent không được tự ý sửa file, build hoặc deploy.');
  const t0 = Date.now();
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`[✗] Source file not found: ${SOURCE_FILE}`);
    process.exit(1);
  }

  let html = fs.readFileSync(SOURCE_FILE, 'utf8');

  // 1. HTML tag & metadata
  html = rep(html, '<html lang="en" data-theme="light">', '<html lang="vi" data-theme="light">');
  html = repAll(html, 
    'content="The zero-server, 100% offline studio to design, preview, and validate Apple App Store & Google Play listings with realistic device mockups."',
    'content="Studio 100% offline giúp bạn thiết kế, kiểm tra và xem trước trang ứng dụng App Store &amp; Google Play trên mockup thiết bị chân thực."'
  );

  // 2. Navbar
  html = rep(html, '>Why Us</a>', '>Tại sao chọn chúng tôi</a>');
  html = rep(html, '>Pricing</a>', '>Bảng giá</a>');
  html = rep(html, '>FAQ</a>', '>Hỏi đáp</a>');
  html = rep(html, '<span>View Pricing</span>', '<span>Xem Bảng Giá</span>');

  // 3. Hero Section
  html = rep(html, 
    '<span>Mockup Studio for App Store &amp; Google Play</span>',
    '<span>Mockup Studio cho App Store &amp; Google Play</span>'
  );
  html = rep(html, 
    '<h1>Stop guessing how your app listing<br class="hero-h1-br"> looks before submitting.</h1>',
    '<h1>Dừng việc đoán mò trang giới thiệu ứng dụng của bạn<br class="hero-h1-br"> trông ra sao trước khi phát hành.</h1>'
  );
  html = rep(html, 
    '<span>App Store Connect and Google Play Console provide <strong>zero live visual preview</strong>.</span><br class="hero-sub-br">\n        <span>Design, review, and refine your listings before submitting.</span>',
    '<span>Cả App Store Connect và Google Play Console đều <strong>không có tính năng xem trước trực quan</strong>.</span><br class="hero-sub-br">\n        <span>Thiết kế, đối chiếu và tinh chỉnh toàn bộ trang giới thiệu ứng dụng của bạn trước khi phát hành.</span>'
  );

  // 4. Mini Studio Toolbar & Presets (Live Demo: giữ nguyên)
  html = rep(html, '<span class="ms-presets-label">Presets</span>', '<span class="ms-presets-label">Các template có sẵn:</span>');
  html = rep(html, 'Viewing preset:', 'Đang xem template:');
  html = rep(html, 'Your draft is saved safely.', 'Bản nháp của bạn đã được lưu an toàn.');
  html = rep(html, '<span>Return to My App</span>', '<span>Trở lại App của tôi</span>');

  // 4b. Mini Studio Export Dropdown
  html = rep(html, 'title="Export Deliverables"', 'title="Xuất dữ liệu nộp Store"');
  html = rep(html, '<span class="dot dot-blue"></span>Images &amp; Screenshots', '<span class="dot dot-blue"></span>Hình ảnh &amp; Screenshots');
  html = rep(html, 'title="Export current live device stage in 2x Retina HD"', 'title="Xuất ảnh Mockup Stage chuẩn Retina 2x sắc nét"');
  html = rep(html, '<span class="mi-name">Save Mockup</span>', '<span class="mi-name">Lưu ảnh Mockup</span>');
  html = rep(html, '<small>Live device stage · Retina 2x</small>', '<small>Màn hình stage thực tế · Retina 2x</small>');
  html = rep(html, '<span class="mi-name">Clean Mockup (4K Ultra HD)</span>', '<span class="mi-name">Ảnh Mockup sạch 4K Ultra HD</span>');
  html = rep(html, '<small>No watermark · Studio print-ready · 4K</small>', '<small>Không watermark · Chuẩn in ấn 4K</small>');
  html = rep(html, '<span class="mi-name">Save as image (No phone frame)</span>', '<span class="mi-name">Lưu ảnh (Không khung điện thoại)</span>');
  html = rep(html, '<small>Store page UI without device bezel · 3x</small>', '<small>Giao diện store không viền máy · 3x</small>');
  html = rep(html, '<span class="dot dot-purple"></span>Store Metadata', '<span class="dot dot-purple"></span>Metadata Store');
  html = rep(html, '<span class="mi-name">Copy Metadata to Clipboard</span>', '<span class="mi-name">Sao chép Metadata vào Clipboard</span>');
  html = rep(html, '<small>App name, subtitle, descriptions,...</small>', '<small>Tên app, phụ đề, mô tả,...</small>');
  html = rep(html, '<span class="mi-name">Export Metadata (LISTING_METADATA.md)</span>', '<span class="mi-name">Xuất Metadata (LISTING_METADATA.md)</span>');
  html = rep(html, '<small>Complete store listing document</small>', '<small>Tài liệu hồ sơ nộp store hoàn chỉnh</small>');
  html = rep(html, '<span class="mi-name">Export Project</span>', '<span class="mi-name">Xuất Dự án</span>');
  html = rep(html, '<small>Save full backup of text, images &amp; settings</small>', '<small>Lưu bản sao lưu toàn bộ văn bản &amp; cài đặt</small>');
  html = rep(html, '<span class="dot dot-emerald"></span>Import &amp; Reset', '<span class="dot dot-emerald"></span>Nhập &amp; Đặt lại');
  html = rep(html, '<span class="mi-name">Import Project</span>', '<span class="mi-name">Nhập Dự án</span>');
  html = rep(html, '<small>Open project from .json file</small>', '<small>Mở dự án từ file .json</small>');
  html = repAll(html, 'title="Plus Feature"', 'title="Tính năng Plus"');

  // 5. Mini Studio Form
  html = rep(html, '<h3 id="msEdTitle">Listing Content</h3>', '<h3 id="msEdTitle">Nội dung trang giới thiệu ứng dụng</h3>');
  html = repAll(html, '<span>Upload Icon</span>', '<span>Tải Icon lên</span>');
  html = repAll(html, '<span>Inspect</span>', '<span>Kiểm tra</span>');
  html = repAll(html, 'title="Inspect Icon Details &amp; Store Compliance"', 'title="Kiểm tra chi tiết Icon &amp; tiêu chuẩn Store"');
  html = repAll(html, '<span>App Name</span>', '<span>Tên ứng dụng</span>');
  html = repAll(html, '<span>Subtitle</span>', '<span>Phụ đề</span>');
  html = repAll(html, '<span>Short Description</span>', '<span>Mô tả ngắn</span>');
  html = repAll(html, '<span>Phone Screenshots</span>', '<span>Ảnh chụp màn hình</span>');
  html = repAll(html, '<span>Unlock in Plus</span>', '<span>Mở khóa trong bản Plus</span>');
  html = rep(html, 
    'placeholder="e.g. TaskFlow: Daily Habit Planner"',
    'placeholder="VD: TaskFlow: Daily Habit Planner"'
  );
  html = rep(html, 
    'placeholder="Short hook under your name"',
    'placeholder="Câu hook ngắn gọn dưới tên app"'
  );
  html = rep(html, 
    'placeholder="What your app does, in 80 characters"',
    'placeholder="Ứng dụng của bạn làm gì, tóm tắt trong 80 ký tự"'
  );
  html = rep(html, 
    'Unlock <a href="#pricing" class="ms-plus-purple">Plus Edition</a> to preview iPad &amp; Android tablet formats, customize store listings, import presets, and export asset packages.',
    'Mở khóa <a href="#pricing" class="ms-plus-purple">Plus Edition</a> để xem trước định dạng iPad &amp; Android tablet, tùy chỉnh trang giới thiệu ứng dụng, import các template có sẵn và xuất các gói tài nguyên hình ảnh hoàn chỉnh.'
  );

  // 6. Comparison Section
  html = rep(html, 
    '<span class="section-badge">The Problem vs The Solution</span>',
    '<span class="section-badge">Vấn Đề vs Giải Pháp</span>'
  );
  html = rep(html, 
    '<h2 class="section-title">The blind submission headache is over.</h2>',
    '<h2 class="section-title">Chấm dứt cảnh phát hành trong mù mờ.</h2>'
  );
  html = rep(html, '<h3 class="comp-head-title">Without Preview Studio</h3>', '<h3 class="comp-head-title">Khi Chưa Dùng Preview Studio</h3>');
  html = rep(html, 
    '<p class="comp-head-sub">Blind form fields, spreadsheets &amp; fragmented drafts</p>',
    '<p class="comp-head-sub">Lên kế hoạch nội dung marketing trên Excel &amp; docs rời rạc</p>'
  );
  html = rep(html, '<h3 class="comp-head-title">With Preview Studio</h3>', '<h3 class="comp-head-title">Khi Dùng Preview Studio</h3>');
  html = rep(html, 
    '<p class="comp-head-sub">Interactive visual workspace · 100% Offline</p>',
    '<p class="comp-head-sub">Không gian làm việc trực quan tương tác · 100% Offline</p>'
  );

  // Beat 1
  html = rep(html, '01 / TEAM ACCESS &amp; HANDOFF', '01 / PHÂN QUYỀN &amp; BÀN GIAO ĐỘI NGŨ');
  html = rep(html, 
    'Marketers without developer accounts, drafting blindly in Google Docs',
    'Đội marketing không có quyền truy cập tài khoản phát hành ứng dụng, phải soạn thảo trên Google Docs'
  );
  html = rep(html, 
    'Writing copy in shared docs leads to endless back-and-forth with developers over character limits, missing specs, and broken layouts.',
    'Hai bên phải liên tục trao đổi qua lại mất thời gian chỉ để sửa những câu chữ bị vượt quá số ký tự quy định, sai quy chuẩn hoặc vỡ bố cục hiển thị trên máy.'
  );
  html = rep(html, 'INDEPENDENT MARKETING WORKFLOW', 'QUY TRÌNH MARKETING ĐỘC LẬP');
  html = rep(html, 
    'Preview and validate listings without needing developer accounts',
    'Thiết kế và kiểm tra trang giới thiệu ứng dụng mà không cần tài khoản phát hành'
  );
  html = rep(html, 
    'Finalize store pages with confidence. Hand over paste-ready copy and assets to developers with zero back-and-forth.',
    'Tự tin hoàn thiện trang giới thiệu ứng dụng độc lập. Bàn giao nội dung và tài nguyên hình ảnh chuẩn chỉnh để lập trình viên dán vào ngay mà không cần trao đổi qua lại.'
  );

  // Beat 2
  html = rep(html, '02 / RELEASE PLANNING', '02 / KẾ HOẠCH &amp; NHỊP ĐỘ PHÁT HÀNH');
  html = rep(html, 
    'No visibility into which changes require a new app release',
    'Không rõ thông tin nào sửa được ngay, thông tin nào cần bản build mới'
  );
  html = rep(html, 
    'No way to know whether an edit can go live instantly or requires developers to compile and submit a new binary — leading to surprise rebuild requests and delayed campaigns.',
    'Không biết trước một chỉnh sửa có thể cập nhật trực tiếp hay bắt buộc lập trình viên phải biên dịch và đẩy phiên bản mới — dẫn đến việc đột xuất yêu cầu build lại và chậm trễ chiến dịch.'
  );
  html = rep(html, 'PROACTIVE RELEASE PLANNING', 'CHỦ ĐỘNG LÊN KẾ HOẠCH');
  html = rep(html, 
    'Know what updates live vs. what needs a new release',
    'Phân biệt rõ nội dung sửa được ngay và nội dung cần phiên bản mới'
  );
  html = rep(html, 
    'Plan marketing campaigns with confidence, and only loop in developers when a new app release is actually required.',
    'Tự tin lên kế hoạch marketing mà không làm phiền lập trình viên, chỉ cần nhờ đội Dev khi thực sự cần phát hành phiên bản mới.'
  );

  // Beat 3 (Thay đổi duy nhất: khung máy chân thực thay vì iPhone / Android Phone)
  html = rep(html, '03 / VISUAL CONTEXT', '03 / NGỮ CẢNH');
  html = rep(html, 
    'Drafting blindly with zero device preview',
    'Điền form mà không thấy trước giao diện thực tế'
  );
  html = rep(html, 
    'Typing copy into raw form inputs leaves you guessing. Awkward line wraps and cut-off text stay hidden until the app is live.',
    'Nhập chữ vào các ô form khô khan khiến bạn phải đoán mò. Lỗi tràn dòng hay câu chữ bị cắt lửng chỉ lộ ra sau khi app đã phát hành thực tế.'
  );
  html = rep(html, 'VISUAL DEVICE MOCKUPS', 'MÔ PHỎNG ĐIỆN THOẠI');
  html = rep(html, 
    'Authentic iOS &amp; Android mockups',
    'Giao diện mô phỏng iOS &amp; Android chân thực'
  );
  html = rep(html, 
    'Preview in real time across iPhone, iPad, and Android screens. Catch awkward truncations and layout bugs long before release day.',
    'Xem trước trực quan theo thời gian thực trên iPhone, iPad và Android. Dễ dàng phát hiện câu chữ bị cắt lửng hoặc vỡ bố cục trước ngày phát hành.'
  );

  // Beat 4
  html = rep(html, '04 / PRICING &amp; PRIVACY', '04 / CHI PHÍ &amp; BẢO MẬT');
  html = rep(html, 
    '$29/mo subscriptions &amp; cloud accounts',
    'Đăng ký thuê bao $29/tháng &amp; tài khoản đám mây'
  );
  html = rep(html, 
    'Third-party SaaS tools charge recurring monthly fees and require cloud accounts just to preview marketing assets before launch.',
    'Các công cụ SaaS bên thứ ba thu phí định kỳ hàng tháng và bắt buộc tạo tài khoản cloud chỉ để xem trước hình ảnh marketing trước ngày ra mắt sản phẩm.'
  );
  html = rep(html, '100% PRIVATE &amp; OFFLINE', '100% BẢO MẬT &amp; OFFLINE');
  html = rep(html, 
    'One-time purchase · Pay once, keep forever',
    'Mua một lần duy nhất · Trả 1 lần, sở hữu mãi mãi'
  );
  html = rep(html, 
    'A self-contained HTML file running locally on your machine. Zero subscriptions, zero logins, and complete peace of mind.',
    'Một file HTML tự chạy hoàn toàn cục bộ trên máy tính của bạn. Không thuê bao, không đăng nhập tài khoản và an tâm bảo mật tuyệt đối.'
  );

  // 7. Pricing Section
  html = rep(html, '<span class="announcement-tag">EARLY BIRD IS LIVE</span>', '<span class="announcement-tag">ƯU ĐÃI EARLY BIRD</span>');
  html = rep(html, 'Special launch pricing for early supporters · Instant offline delivery', 'Mức giá ưu đãi mở bán dành cho người ủng hộ sớm · Nhận file tải về ngay');
  html = rep(html, '<h2 class="section-title">One-time purchase. No subscription.</h2>', '<h2 class="section-title">Mua một lần. Không phí định kỳ.</h2>');
  html = rep(html, 
    '<p class="section-desc">Zero recurring fees. Standalone offline HTML studio. Pay once, keep your copy forever.</p>',
    '<p class="section-desc">Không phí định kỳ. File HTML studio offline độc lập. Mua một lần, sở hữu bản quyền mãi mãi.</p>'
  );
  html = rep(html, 
    'For indie developers and creators who need a fast, standalone offline preview studio.',
    'Dành cho indie developers và creators cần một preview studio offline độc lập và nhanh chóng.'
  );
  html = repAll(html, '<span class="price-period">one-time payment</span>', '<span class="price-period">thanh toán một lần</span>');
  html = rep(html, 
    '<span>Clean 4K Ultra HD Export <span class="feature-tag blue">No Watermark</span></span>',
    '<span>Xuất ảnh Mockup 4K Ultra HD sạch <span class="feature-tag blue">Không Watermark</span></span>'
  );
  // Thay đổi ở Pricing: Giao diện mô phỏng iPhone, iPad & Android Phone/Tablet
  html = rep(html, 
    '<span>iPhone, iPad &amp; Android Phone/Tablet frames</span>',
    '<span>Giao diện mô phỏng iPhone, iPad &amp; Android Phone/Tablet</span>'
  );
  html = rep(html, 
    '<span>Store Listing Metadata Export <span class="feature-tag">Markdown &amp; Copy</span></span>',
    '<span>Xuất hồ sơ Metadata nộp Store <span class="feature-tag">Markdown &amp; Copy</span></span>'
  );
  html = rep(html, 
    '<span>Store Character &amp; Emoji Counters</span>',
    '<span>Bộ đếm ký tự &amp; Emoji chuẩn Store</span>'
  );
  html = rep(html, 
    '<span>100% Offline Single-File Studio <span class="feature-tag code">.html</span></span>',
    '<span>Ứng dụng chạy Offline 100% dạng 1 file <span class="feature-tag code">.html</span></span>'
  );
  html = rep(html, 
    '<span>Single-User Commercial License</span>',
    '<span>Bản quyền thương mại cho 1 người</span>'
  );
  html = rep(html, 
    '<span>Get Plus Edition ($29)</span>',
    '<span>Mua Plus Edition ($29)</span>'
  );

  // Pro Card
  html = rep(html, 
    'For agencies, studios, and developers requiring commercial client licensing and full source code.',
    'Dành cho agency, studio và lập trình viên cần giấy phép thương mại làm việc với khách hàng & toàn bộ mã nguồn.'
  );
  html = rep(html, 
    '<span><strong>Everything in Plus Edition</strong>, plus:</span>',
    '<span><strong>Bao gồm tất cả quyền lợi của Plus Edition</strong>, cùng với:</span>'
  );
  html = rep(html, 
    '<span>Team &amp; Agency License <span class="feature-tag purple">Unlimited Client Work</span></span>',
    '<span>Bản quyền Team &amp; Agency <span class="feature-tag purple">Không giới hạn Client</span></span>'
  );
  html = rep(html, 
    '<span>Full Modular Source Code <span class="feature-tag purple code">src/</span></span>',
    '<span>Toàn bộ mã nguồn Module <span class="feature-tag purple code">src/</span></span>'
  );
  html = rep(html, 
    '<span>White-label Ready <span class="feature-tag purple">Custom Agency Branding</span></span>',
    '<span>Sẵn sàng White-label <span class="feature-tag purple">Gắn thương hiệu Agency</span></span>'
  );
  html = rep(html, 
    '<span>Live-Reload Dev Server & Bundler <span class="feature-tag purple code">build.js</span></span>',
    '<span>Live-Reload Dev Server &amp; Bundler <span class="feature-tag purple code">build.js</span></span>'
  );
  html = rep(html, 
    '<span>Agency Marketing & ASO Playbook <span class="feature-tag purple">HTML offline</span></span>',
    '<span>Cẩm nang Marketing &amp; ASO nộp Store <span class="feature-tag purple">HTML offline</span></span>'
  );
  html = rep(html, 
    '<span>Get Pro Studio ($39)</span>',
    '<span>Mua Pro Studio ($39)</span>'
  );

  // Scope Note
  html = rep(html, 
    '<div class="pricing-scope-content">\n          <p><strong>What’s covered:</strong> Preview Studio previews what customers see (title, subtitle, description, icon, screenshots).</p>\n          <p>It does not preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires.</p>\n        </div>',
    '<div class="pricing-scope-content">\n          <p><strong>Phạm vi mô phỏng:</strong> Preview Studio giúp bạn xem trước những gì người dùng cuối nhìn thấy trên trang giới thiệu ứng dụng (Tên ứng dụng, mô tả ngắn về ứng dụng, icon, ảnh chụp mô phỏng các tính năng).</p>\n          <p>Không bao gồm các biểu mẫu thiết lập kỹ thuật như nhãn App Privacy, Google Play Data Safety, In-App Purchases hay bảng khảo sát độ tuổi.</p>\n        </div>'
  );

  // 8. FAQ Section
  html = rep(html, 
    '<h2 class="section-title">Frequently Asked Questions</h2>',
    '<h2 class="section-title">Câu Hỏi Thường Gặp</h2>'
  );
  html = rep(html, 
    '<p class="section-desc">Everything you need to know about offline architecture, store review compliance, client handoff, and licensing.</p>',
    '<p class="section-desc">Tất cả những gì bạn cần biết về kiến trúc offline, chính sách duyệt store, bàn giao khách hàng và bản quyền thương mại.</p>'
  );

  // FAQ 01
  html = rep(html, 'Offline Architecture', 'Kiến trúc Offline');
  html = rep(html, 
    'Does Store Preview Studio require an active internet connection?',
    'Store Preview Studio có yêu cầu kết nối internet không?'
  );
  html = rep(html, 
    'No. Store Preview Studio runs 100% locally in your browser. All scripts, icons, CSS styles, and fonts are completely self-contained. You can use it on airplanes, remote locations, or behind corporate firewalls with zero telemetry and zero external server calls.',
    'Không. Store Preview Studio chạy 100% cục bộ trên trình duyệt của bạn. Mọi script, icon, CSS và font chữ đều nằm trọn trong file. Bạn có thể sử dụng ngay cả khi đang trên máy bay, nơi không có mạng, hoặc trong mạng nội bộ bảo mật của doanh nghiệp — hoàn toàn không thu thập dữ liệu ngầm và không kết nối với bất kỳ máy chủ bên ngoài nào.'
  );

  // FAQ 02
  html = rep(html, 'Store Review Policy', 'Chính sách duyệt Store');
  html = rep(html, 
    'Can Store Preview Studio guarantee that my app will pass App Store or Google Play review?',
    'Store Preview Studio có cam kết ứng dụng của tôi sẽ đỗ duyệt App Store hay Google Play không?'
  );
  html = rep(html, 
    '<strong>No, and no software tool on the market can.</strong> Store Preview Studio gives you realistic visual mockups and catches mechanical formatting mistakes (such as wrong icon dimensions, transparent alpha channels on iOS, or invalid screenshot aspect ratios). However, final app approval is determined entirely by the official Apple and Google review teams based on your compiled code, privacy policies, and store guidelines.',
    '<strong>Không, và không có bất kỳ công cụ phần mềm nào trên thị trường có thể cam kết điều này.</strong> Store Preview Studio mang đến cho bạn mockup trực quan chân thực và phát hiện triệt để các lỗi định dạng kỹ thuật (như sai kích thước icon, kênh alpha trong suốt trên iOS, hay tỷ lệ ảnh không hợp lệ). Tuy nhiên, quyền duyệt ứng dụng cuối cùng được quyết định hoàn toàn bởi đội ngũ kiểm duyệt chính thức của Apple và Google dựa trên mã nguồn nhị phân, chính sách quyền riêng tư và quy định riêng của từng Store.'
  );

  // FAQ 03
  html = rep(html, 'Scope &amp; Coverage', 'Phạm vi &amp; Tính năng');
  html = rep(html, 
    'What parts of a store listing does Preview Studio actually cover?',
    'Những phần nào của trang giới thiệu ứng dụng được Preview Studio hỗ trợ?'
  );
  html = rep(html, 
    'Preview Studio previews what customers see on your store page: title, subtitle, description, app icon, and screenshots across iOS, iPadOS, and Android. It does <strong>not</strong> preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires — those remain managed directly inside Apple and Google consoles.',
    'Preview Studio xem trước những gì người dùng cuối nhìn thấy trên trang giới thiệu ứng dụng của bạn: Tên ứng dụng, mô tả ngắn về ứng dụng, icon, ảnh chụp mô phỏng các tính năng trên iOS, iPadOS và Android. Công cụ <strong>không</strong> xem trước các form thiết lập của lập trình viên như nhãn App Privacy, Google Play Data Safety, giao dịch trong ứng dụng (In-App Purchases) hay bảng khảo sát độ tuổi — các mục đó vẫn được quản lý trực tiếp trong tài khoản phát hành của Apple và Google.'
  );

  // FAQ 04
  html = rep(html, 'Commercial License', 'Bản quyền thương mại');
  html = rep(html, 
    'Can I use Store Preview Studio for client projects?',
    'Tôi có thể dùng Store Preview Studio cho các dự án của khách hàng (Client Work) không?'
  );
  html = rep(html, 
    'Yes! Both the Plus and Pro tiers include full commercial licenses. You can author, optimize, and present store listings for as many apps as you wish — on a single-user basis. If you need multiple seats or unlimited client work, upgrade to Pro Studio which includes a full Team &amp; Agency license.',
    'Có! Cả hai gói Plus và Pro đều bao gồm bản quyền thương mại đầy đủ. Bạn có thể soạn thảo, tối ưu và trình bày trang giới thiệu ứng dụng cho bao nhiêu ứng dụng tùy thích trên tư cách một người dùng cá nhân. Nếu bạn cần cho nhiều thành viên trong nhóm cùng sử dụng hoặc phục vụ không giới hạn khách hàng cho agency, hãy nâng cấp lên Pro Studio với bản quyền Team &amp; Agency toàn diện.'
  );

  // FAQ 05
  html = rep(html, 'Client Review Handoff', 'Bàn giao Review cho Khách');
  html = rep(html, 
    'Do my clients need a $99/year Apple Developer or Google Play account to view previews?',
    'Khách hàng của tôi có cần tài khoản Apple Developer $99/năm hay Google Play Console để xem trước không?'
  );
  html = rep(html, 
    'No! In native store consoles, clients cannot view or review listings unless they hold a paid developer account and console invite. With Store Preview Studio, you simply hand over the standalone HTML file or export JSON presets — clients can review realistic listings directly in any browser with zero logins and zero fees.',
    'Không cần! Với hệ thống tài khoản phát hành ứng dụng mặc định, khách hàng không thể xem hay duyệt trang giới thiệu ứng dụng trừ khi họ có tài khoản lập trình viên trả phí và được mời vào tài khoản phát hành. Với Store Preview Studio, bạn chỉ cần gửi file HTML độc lập hoặc export preset JSON — khách hàng có thể duyệt trang giới thiệu ứng dụng chân thực trực tiếp trên bất kỳ trình duyệt nào mà không cần đăng nhập hay trả phí.'
  );

  // FAQ 06
  html = rep(html, 'Product Updates', 'Cập nhật Sản phẩm');
  html = rep(html, 
    'How do updates work after purchase?',
    'Chính sách cập nhật sau khi mua hàng hoạt động như thế nào?'
  );
  html = rep(html, 
    'You receive all maintenance patches and store spec adjustments for the current version for free via your download link. Major future editions with new platforms or hardware generations will be offered to existing customers at a steep upgrade discount.',
    'Bạn sẽ nhận được tất cả các bản vá bảo trì và điều chỉnh spec cửa hàng cho phiên bản hiện tại hoàn toàn miễn phí qua liên kết tải về Gumroad của bạn. Các phiên bản lớn trong tương lai với nền tảng mới hoặc thế hệ phần cứng mới sẽ được cung cấp cho khách hàng cũ với mức giảm giá sâu.'
  );

  // 9. Footer
  html = rep(html, 
    '© 2026 Store Preview Studio. Built for mobile craftspeople worldwide.',
    '© 2026 Store Preview Studio. Được chế tác dành cho các nhà sáng tạo ứng dụng di động.'
  );

  // 10. Mini Studio JS Strings & Modals
  html = rep(html, "c.textContent = '+ Your App';", "c.textContent = '+ App của bạn';");
  html = rep(html, "pill.textContent = '+ Your App';", "pill.textContent = '+ App của bạn';");
  html = rep(html,
    "if (m === 'apple') edTitle.textContent = 'App Store Content';\n          else if (m === 'google') edTitle.textContent = 'Google Play Content';\n          else edTitle.textContent = 'Listing Content';",
    "if (m === 'apple') edTitle.textContent = 'Nội dung App Store';\n          else if (m === 'google') edTitle.textContent = 'Nội dung Google Play';\n          else edTitle.textContent = 'Nội dung trang giới thiệu ứng dụng';"
  );
  html = rep(html,
    "if (uploadBtnText) uploadBtnText.textContent = 'Upload New Icon';",
    "if (uploadBtnText) uploadBtnText.textContent = 'Tải icon app';"
  );
  html = rep(html,
    "if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Apple App Icon Inspector' : 'Google Play Icon Inspector';",
    "if (titleEl) titleEl.textContent = _activeModalStore === 'apple' ? 'Kiểm tra thông số icon Apple' : 'Kiểm tra thông số icon Google Play';"
  );
  html = rep(html, 
    "label: 'Your App', name: '', sub: '', short: '', promo: '',\n        dev: 'Developer Name', email: 'support@domain.com', phone: '+1 800-555-0199', catApple: 'Category', catGoogle: 'Category', desc: 'App description goes here...',",
    "label: 'App của bạn', name: '', sub: '', short: '', promo: '',\n        dev: 'Tên Nhà Phát Triển', email: 'support@domain.com', phone: '+1 800-555-0199', catApple: 'Thể loại', catGoogle: 'Thể loại', desc: 'Mô tả ứng dụng hiển thị tại đây...',"
  );
  html = rep(html, "whatsNew: 'Release notes...',", "whatsNew: 'Ghi chú phát hành phiên bản...',");

  // Reset modal
  html = rep(html, 
    '<h4 class="ms-confirm-title" id="msConfirmTitle">Reset App Draft?</h4>',
    '<h4 class="ms-confirm-title" id="msConfirmTitle">Đặt lại bản nháp ứng dụng?</h4>'
  );
  html = rep(html, 
    '<p class="ms-confirm-desc">This will clear your customized app icon, name, and descriptions. Your current draft cannot be recovered.</p>',
    '<p class="ms-confirm-desc">Thao tác này sẽ xóa sạch icon, tên và các mô tả tùy chỉnh của bạn. Bản nháp hiện tại sẽ không thể khôi phục.</p>'
  );
  html = rep(html, 
    '<button type="button" class="ms-confirm-btn-cancel" id="msConfirmCancel">Cancel</button>',
    '<button type="button" class="ms-confirm-btn-cancel" id="msConfirmCancel">Hủy</button>'
  );
  html = rep(html, 
    '<button type="button" class="ms-confirm-btn-reset" id="msConfirmOk">Reset Draft</button>',
    '<button type="button" class="ms-confirm-btn-reset" id="msConfirmOk">Xóa bản nháp</button>'
  );

  // Toast
  html = rep(html, 
    "'Phone Screenshots Upload',\n            'Upload, organize, and preview real screenshots on Apple & Google devices.',\n            'Unlock in Plus'",
    "'Tải lên ảnh chụp màn hình',\n            'Tải lên, sắp xếp và xem trước screenshots thực tế trên thiết bị Apple & Google.',\n            'Mở khóa trong Plus'"
  );

  // Icon inspector modal
  html = rep(html, '<span class="icon-modal-title" id="msIconModalTitle">App Icon Inspector</span>', '<span class="icon-modal-title" id="msIconModalTitle">Kiểm tra thông số icon</span>');
  html = repAll(html, 'title="View icon in high resolution"', 'title="Kiểm tra thông số icon"');
  html = rep(html, '<span>Drag & drop image</span>', '<span>Kéo thả ảnh vào đây</span>');
  html = rep(html, '<kbd>ESC</kbd> to close', '<kbd>ESC</kbd> để đóng');
  html = rep(html, '<span class="icon-metric-lbl">Resolution</span>', '<span class="icon-metric-lbl">Độ phân giải</span>');
  html = rep(html, '<span class="icon-metric-lbl">Aspect Ratio</span>', '<span class="icon-metric-lbl">Tỷ lệ khung hình</span>');
  html = rep(html, '<span class="icon-metric-lbl">File Size</span>', '<span class="icon-metric-lbl">Dung lượng file</span>');
  html = rep(html, '<span class="icon-metric-lbl">Format / Alpha</span>', '<span class="icon-metric-lbl">Định dạng / Alpha</span>');
  html = rep(html, '<span class="icon-modal-field-label">Status</span>', '<span class="icon-modal-field-label">Trạng thái</span>');
  html = rep(html, '<span id="msIconModalUploadText">Upload New Icon</span>', '<span id="msIconModalUploadText">Tải icon app</span>');
  html = rep(html, '<span class="icon-modal-disclaimer-title">Store Review Disclaimer</span>', '<span class="icon-modal-disclaimer-title">Lưu Ý Kiểm Duyệt của Store</span>');
  html = rep(html, 
    '<p class="icon-modal-disclaimer-desc">Validation checks help catch mechanical formatting mistakes (such as incorrect dimensions, transparent alpha channels on iOS, or file size limits).</p>',
    '<p class="icon-modal-disclaimer-desc">Các bước kiểm tra tự động giúp phát hiện lỗi định dạng kỹ thuật (như sai kích thước, kênh alpha trong suốt trên iOS, hay vượt quá dung lượng file).</p>'
  );
  html = rep(html, 
    '<p class="icon-modal-disclaimer-desc">However, passing these checks does not guarantee store approval — final acceptance is decided solely by Apple and Google review teams based on your complete submission and store guidelines.</p>',
    '<p class="icon-modal-disclaimer-desc">Tuy nhiên, vượt qua kiểm tra này không đảm bảo ứng dụng sẽ được duyệt 100% — quyền quyết định cuối cùng hoàn toàn thuộc về đội ngũ kiểm duyệt của Apple và Google.</p>'
  );

  if (missed) console.warn(`[!] ${missed} chuỗi nguồn không khớp trong docs/marketing.html — hãy kiểm tra các dòng cảnh báo ở trên.`);

  // Minify production bundle
  const minified = minifyHtmlPage(html);

  // Write outputs
  fs.writeFileSync(OUTPUT_FILE, html, 'utf8');
  fs.writeFileSync(ROOT_OUTPUT_FILE, html, 'utf8');
  fs.writeFileSync(MIN_OUTPUT_FILE, minified, 'utf8');
  fs.writeFileSync(INDEX_OUTPUT_FILE, minified, 'utf8');

  // Automatically sync Vietnamese marketing bundles to cloudflare/
  if (fs.existsSync(CLOUDFLARE_DIR)) {
    fs.writeFileSync(path.join(CLOUDFLARE_DIR, 'marketing_vi.html'), html, 'utf8');
    fs.writeFileSync(path.join(CLOUDFLARE_DIR, 'marketing_vi.min.html'), minified, 'utf8');
  }

  const duration = Date.now() - t0;
  const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  const minSizeKb = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(1);
  console.log(`[✓] Generated ${OUTPUT_FILE} in ${duration}ms (${sizeKb} KB)`);
  console.log(`[✓] Generated ${ROOT_OUTPUT_FILE} for direct review`);
  console.log(`[✓] Generated ${MIN_OUTPUT_FILE} minified bundle (${minSizeKb} KB, -${(sizeKb - minSizeKb).toFixed(1)} KB)`);
  console.log(`[✓] Generated ${INDEX_OUTPUT_FILE} (minified) as default homepage for deployment`);
  return { success: true, duration, sizeKb, minSizeKb };
}

if (require.main === module) {
  buildMarketingVi();
}

module.exports = { buildMarketingVi };
