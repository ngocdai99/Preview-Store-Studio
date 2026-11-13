/**
 * STORE PREVIEW STUDIO · COLD OUTREACH SCRIPT (GOOGLE APPS SCRIPT)
 * 
 * Tính năng chính:
 * 1. Chốt chặn an toàn: Bắt buộc phải có App ID hợp lệ (7-12 số) mới gửi email.
 * 2. Tự động nhận diện & xưng hô: "Hi Small Planet team," hoặc "Hi Curtis,"
 * 3. Tự động lấy tên app từ ngoặc đơn: "Agency (App Name)"
 * 4. Tự động cập nhật real-time trạng thái SENT và Timestamp vào Google Sheet
 * 5. Giãn cách an toàn 30s giữa các lượt gửi để tránh spam filter của Gmail
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Cold Outreach')
    .addItem('1. Xem trước email', 'previewEmailSample')
    .addItem('2. Gửi thử cho tôi', 'sendTestToMyself')
    .addSeparator()
    .addItem('3. Gửi Email', 'sendOutreachEmails')
    .addToUi();
}

/**
 * Xử lý nội dung email và xưng hô
 */
function createEmailContent(companyName, appId) {
  const cleanAppId = appId ? String(appId).trim() : '';
  const demoUrl = `https://storepreviewstudio.com/try?appid=${encodeURIComponent(cleanAppId)}`;

  let greeting = `${companyName} team`;
  let appName = companyName;

  if (companyName.indexOf('(') !== -1 && companyName.indexOf(')') !== -1) {
    const parts = companyName.split('(');
    const devName = parts[0].trim();
    appName = parts[1].replace(')', '').trim();
    
    // Kiểm tra xem tên phía trước là Agency/Studio hay là Tên người thật
    const isAgency = ['Studios', 'Labs', 'Media', 'Planet', 'Technologies', 'Interactive', 'Development', 'Apps', 'Agency', 'Foundry', 'Software', 'He', 'Group', 'Ventures', 'Sun', 'Mobile', 'Developers', 'Shockoe', 'Grio', 'LeanCode', 'Koombea', 'Tapptitude', 'Uptech', 'MobiDev', 'RebelDot', 'Holdapp', 'Miquido', 'Xmartlabs', 'Apptension', 'Ralabs', 'Digitalya', 'Distance', 'Codigee', 'Flutter', 'Callstack', 'Fueled', 'Touchlab', 'DreamWalk', 'Digital', 'Pocket', 'STRV', 'Sidebench', 'itCraft', 'Tooploox', 'Rootquotient', 'Passion', 'MartianCraft', 'Gooii', 'Ackee', 'Railwaymen', 'Apadmi', 'Atomic', 'Cube', 'Kyan', 'Graphene'].some(w => devName.includes(w));
    
    if (isAgency) {
      greeting = `${devName} team`;      // Ví dụ: "Small Planet team", "Naked Development team", "Swenson He team"
    } else {
      greeting = devName.split(' ')[0];  // Ví dụ: "Curtis", "Christian"
    }
  }

  const subject = `${appName} store listing`;

  const body = 
`Hi ${greeting},

Loaded your live ${appName} listing into a side-by-side App Store & Google Play preview tool I just built:
${demoUrl}

No login needed — hope it saves you a bit of time testing upcoming metadata or screenshot updates.

Best,
Kai`;

  return { subject, body };
}

/**
 * Tìm dòng đầu tiên chưa gửi VÀ ĐÃ CÓ APP ID để xem trước chuẩn xác
 */
function getFirstUnsentRow(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return sheet.getRange(2, 1, 1, 7).getValues()[0];

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (let i = 0; i < data.length; i++) {
    const status = String(data[i][5] || '').trim();
    const email = String(data[i][1] || '').trim();
    const appId = String(data[i][4] || '').trim();

    // Phải thỏa mãn: chưa gửi + có email + có App ID hợp lệ
    if (status !== 'SENT' && email.indexOf('@') !== -1 && appId && /^\d{7,12}$/.test(appId)) {
      return data[i];
    }
  }
  return data[0];
}

/**
 * Xem trước nội dung email của dòng đầu tiên khả dụng
 */
function previewEmailSample() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sampleRow = getFirstUnsentRow(sheet);
  
  const company = String(sampleRow[0] || '').trim();
  const email = String(sampleRow[1] || '').trim();
  const appId = String(sampleRow[4] || '').trim();

  if (!appId || !/^\d{7,12}$/.test(appId)) {
    SpreadsheetApp.getUi().alert('Cảnh báo: Dòng này chưa có App ID hợp lệ.');
    return;
  }

  const { subject, body } = createEmailContent(company, appId);
  const preview = `[GỬI ĐẾN]: ${email}\n[TIÊU ĐỀ]: ${subject}\n\n[NỘI DUNG]:\n----------------------------------------\n${body}`;
  SpreadsheetApp.getUi().alert('Xem trước Email mẫu', preview, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Gửi email thử nghiệm về chính hộp thư Gmail của người chạy script
 */
function sendTestToMyself() {
  const myEmail = Session.getActiveUser().getEmail();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sampleRow = getFirstUnsentRow(sheet);

  const company = String(sampleRow[0] || '').trim();
  const appId = String(sampleRow[4] || '').trim();

  if (!appId || !/^\d{7,12}$/.test(appId)) {
    SpreadsheetApp.getUi().alert('Cảnh báo: Không tìm thấy dòng nào có App ID hợp lệ để gửi test.');
    return;
  }

  const { subject, body } = createEmailContent(company, appId);
  GmailApp.sendEmail(myEmail, `[TEST] ${subject}`, body, {
    from: 'kai@storepreviewstudio.com',
    name: 'Kai'
  });
  SpreadsheetApp.getUi().alert(`Đã gửi email thử nghiệm về: ${myEmail}`);
}

/**
 * Gửi Email hàng loạt với chốt an toàn
 */
function sendOutreachEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Không có dữ liệu công ty từ dòng 2.');
    return;
  }

  const range = sheet.getRange(2, 1, lastRow - 1, 7);
  const data = range.getValues();
  const timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || 'Asia/Ho_Chi_Minh';
  let sentCount = 0;
  let skippedNoAppId = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const companyName = String(row[0] || '').trim();
    const email = String(row[1] || '').trim();
    const appId = String(row[4] || '').trim();
    const status = String(row[5] || '').trim();

    // 1. Bỏ qua nếu đã gửi hoặc email không hợp lệ
    if (status === 'SENT' || !email || email.indexOf('@') === -1) {
      continue;
    }

    // 2. 🛡️ CHỐT CHẶN APP ID: Nếu chưa có App ID hoặc không phải dãy số Apple ID (7-12 số) -> BỎ QUA NGAY
    if (!appId || !/^\d{7,12}$/.test(appId)) {
      skippedNoAppId++;
      continue;
    }

    try {
      const { subject, body } = createEmailContent(companyName, appId);
      GmailApp.sendEmail(email, subject, body, {
        from: 'kai@storepreviewstudio.com',
        name: 'Kai'
      });

      // Format ngày + giờ: "09/11/2026 22:46:15"
      const timestamp = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy HH:mm:ss');

      // Cập nhật Cột 6 (Status) = SENT, Cột 7 (Timestamp)
      sheet.getRange(i + 2, 6).setValue('SENT');
      sheet.getRange(i + 2, 7).setValue(timestamp);
      
      // Ép Google Sheet vẽ ra màn hình ngay lập tức từng dòng một
      SpreadsheetApp.flush();
      
      sentCount++;

      // Giãn cách cố định 30 giây trước khi sang dòng kế tiếp
      Utilities.sleep(30000);

    } catch (err) {
      sheet.getRange(i + 2, 6).setValue('ERROR: ' + err.message);
      SpreadsheetApp.flush();
    }
  }

  SpreadsheetApp.getUi().alert(`Hoàn tất!\n- Đã gửi thành công: ${sentCount} email.\n- Bỏ qua do chưa có App ID: ${skippedNoAppId} dòng.`);
}
