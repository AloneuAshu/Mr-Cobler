var SHEET_NAME = "Sheet1";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // --- 1. SAVE TO GOOGLE SHEET (Your Original Logic) ---
    // Using your specific Sheet ID to ensure data goes to the right place
    var doc = SpreadsheetApp.openById("1vRKle6ckNAasX8MRmDT4TSwPm46sZnWmVLKgqrzOdBo");
    var sheet = doc.getSheetByName(SHEET_NAME);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      if (header === 'Timestamp') return new Date();
      return e.parameter[header.toLowerCase()] || '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // --- 2. SEND BRANDED EMAIL (New Logic) ---
    var email = e.parameter.email;
    var name = e.parameter.name;
    var service = e.parameter.service;
    var phone = e.parameter.phone;
    var address = e.parameter.address;
    var message = e.parameter.message || "No additional notes";
    var date = new Date();

    if (email) {
      // Calls the new helper function below with the HTML template
      sendBrandedEmail(email, name, service, phone, address, message, date);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}

// Helper function that contains the HTML Email Template
function sendBrandedEmail(recipientEmail, name, service, phone, address, message, date) {
  var htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background-color: #f4f1ea; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4a4a4a; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #2c1810; padding: 30px 20px; text-align: center; }
        .header img { max-width: 180px; height: auto; }
        .hero { background-color: #8b5a2b; color: #ffffff; padding: 40px 30px; text-align: center; }
        .hero h2 { margin: 0 0 10px 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .order-details { background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; border-bottom: 1px solid #e0e0e0; padding: 10px 0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #555; width: 120px; }
        .detail-value { color: #333; flex: 1; text-align: right; }
        .btn { display: block; width: 200px; margin: 30px auto; background-color: #2c1810; color: #ffffff !important; text-decoration: none; padding: 12px 0; border-radius: 4px; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 14px; }
        .footer { background-color: #1a1a1a; color: #888888; padding: 30px 20px; text-align: center; font-size: 13px; line-height: 1.6; }
        .footer a { color: #d4af37; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://aloneuashu.github.io/Mr-Cobler/assets/images/logo.png" alt="Mr Cobblers">
        </div>
        <div class="hero">
            <h2>Booking Confirmed!</h2>
            <p>Thank you for choosing premium leather care.</p>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>We have received your booking request for <strong>${service}</strong>. Our team will review the details and confirm your pick-up shortly.</p>
            <div class="order-details">
                <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${service}</span></div>
                <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${phone}</span></div>
                <div class="detail-row"><span class="detail-label">Address</span><span class="detail-value">${address}</span></div>
                <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${date.toLocaleDateString()}</span></div>
            </div>
            <a href="https://mrcobblers.com/" class="btn">Visit Website</a>
        </div>
        <div class="footer">
            <p><strong>Mr Cobblers Premium Leather Care</strong><br>Film Nagar, Hyderabad, Telangana</p>
            <p>Phone: +91 8801091101 | Email: info@mrcobblers.com</p>
            <p>&copy; 2026 Mr Cobblers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: recipientEmail,
    subject: "Booking Confirmed - Mr Cobblers",
    htmlBody: htmlBody
  });
}
