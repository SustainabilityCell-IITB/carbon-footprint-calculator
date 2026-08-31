/**
 * Green Cup — Carbon Footprint Calculator
 * Google Apps Script Web App: appends each submission as a row in a Google Sheet.
 *
 * ── SETUP (one time, ~3 minutes) ──────────────────────────────────────────
 * 1. Create a Google Sheet (sheets.new). Note its tab name (default "Sheet1").
 * 2. Extensions ▸ Apps Script. Delete the sample code, paste THIS whole file.
 * 3. (Optional) change SHEET_NAME below if your tab isn't called "Sheet1".
 * 4. Deploy ▸ New deployment ▸ type "Web app".
 *       - Description: anything
 *       - Execute as:      Me
 *       - Who has access:  Anyone
 *    Click Deploy, authorize when prompted, and COPY the "/exec" URL.
 * 5. Put that URL in calculator/.env.production as VITE_SHEET_URL, then build.
 *
 * The first row is written automatically as a header. To read your data,
 * just open the Sheet — or File ▸ Download ▸ CSV.
 *
 * NOTE: after ANY edit to this script you must Deploy ▸ Manage deployments ▸
 * edit the deployment ▸ Version: "New version" for the change to go live.
 */

var SHEET_NAME = 'Sheet1';
var HEADERS = ['timestamp', 'hostelNo', 'userName'];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    // Write the header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      new Date(),
      body.hostelNo != null ? Number(body.hostelNo) : '',
      body.userName || '',
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// A GET just confirms the web app is live (open the /exec URL in a browser).
function doGet() {
  return json({ ok: true, message: 'Green Cup collector is running.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
