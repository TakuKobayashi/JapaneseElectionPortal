import { loadSpreadsheetToObjects } from '../common/converter';
import { getKeyNumberPairs, updateHeaderValues } from '../common/sheet-data';

export function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  const data = JSON.parse(e.postData.getDataAsString());
  const sheetNames = Object.keys(data);

  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = targetSpreadSheet.getSheets();
  const newSheetNames = sheetNames.filter((sheetName) => sheets.every((sheet) => sheetName != sheet.getName()));
  for (const sheetName of newSheetNames) {
    const newSheet = targetSpreadSheet.insertSheet(sheetName);
    sheets.push(newSheet);
  }
  // Sheet名のdataを取り出す
  for (const sheetName of sheetNames) {
    const sheet = sheets.find((sheet) => sheet.getSheetName() === sheetName);
    if (!sheet) {
      continue;
    }
    const headerPairs = getKeyNumberPairs(sheet);
    const headerValues = Object.values(headerPairs);
    let nextKeyNumber = headerValues.length > 0 ? Math.max(...headerValues) : 0;
    // Sheet内のJSONData
    const sheetData = data[sheetName];
    // 1行分のObject
    for (let i = 0; i < sheetData.length; ++i) {
      const rowData = sheetData[i];
      const rowKeys = Object.keys(rowData);
      const updateColumnNumbers: number[] = [];
      const updateTargetRowsValues: { [n: number]: any } = {};
      for (const rowKey of rowKeys) {
        // headerにないものKeyがきたらHeaderに追加する
        if (!headerPairs[rowKey]) {
          nextKeyNumber = nextKeyNumber + 1;
          headerPairs[rowKey] = nextKeyNumber;
        }
        // データの更新
        const headerColumnNumber = headerPairs[rowKey];
        updateTargetRowsValues[headerColumnNumber] = rowData[rowKey];
        updateColumnNumbers.push(headerColumnNumber);
      }
      // 変更すべきデータの行数の情報を取得
      const targetRowsRange = sheet.getRange(2 + i, 1, 1, Math.max(...updateColumnNumbers));
      const targetRowsValues = targetRowsRange.getValues();
      for (const columnNumber of updateColumnNumbers) {
        targetRowsValues[0][columnNumber - 1] = updateTargetRowsValues[columnNumber];
      }
      targetRowsRange.setValues(targetRowsValues);
    }
    updateHeaderValues(sheet, headerPairs);
  }
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(data));
  return jsonOut;
}
