/**
 * 接收學生遊戲結果，寫入「記錄」工作表
 * 用法：喺 Google Sheet 撳「擴充功能 > Apps Script」，貼上本程式
 * （根據工作坊大綱附錄 B；另加一行將「學號」欄設為純文字，保留 05 呢類前置零）
 */
const SHEET_NAME = '記錄';
const HEADERS = ['時間', '班別', '學號', '姓名', '分數', '總分', '用時（秒）', '錯題'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // 最多等 10 秒，避免多位學生同時提交時互相覆蓋
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    // 工作表係空白就先加標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // 學號（C 欄）設為純文字，避免 05 變成 5
    sheet.getRange('C:C').setNumberFormat('@');

    let time = new Date(data.timestamp);
    if (isNaN(time.getTime())) {
      time = new Date();
    }

    const wrong = Array.isArray(data.wrongItems)
      ? data.wrongItems.join('、')
      : (data.wrongItems || '');

    sheet.appendRow([
      time,
      data['class'] || '',
      String(data.studentNo || ''),
      data.name || '',
      Number(data.score) || 0,
      Number(data.total) || 0,
      Number(data.timeSpent) || 0,
      wrong
    ]);

    return jsonOutput({ status: 'ok' });
  } catch (err) {
    return jsonOutput({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 用瀏覽器開部署網址，見到 {"status":"ok"} 即表示部署成功
function doGet() {
  return jsonOutput({ status: 'ok' });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
