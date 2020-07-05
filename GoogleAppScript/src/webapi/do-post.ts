import { loadSpreadsheetToObjects } from '../common/converter';
import { getKeyNumberPairs, updateHeaderValues } from '../common/sheet-data'

export function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  const data = JSON.parse(e.postData.getDataAsString());
  const sheetNames = Object.keys(data);

  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = targetSpreadSheet.getSheets();
  const newSheetNames = sheetNames.filter(sheetName => sheets.every(sheet => sheetName != sheet.getName()))
  for (const sheetName of newSheetNames) {
    const newSheet = targetSpreadSheet.insertSheet(sheetName);
    sheets.push(newSheet)
  }
  // 該当のSheet全部に処理を行う
  for(const sheet of sheets){
    const headerPairs = getKeyNumberPairs(sheet);
    const headerValues = Object.values(headerPairs);
    let nextKeyNumber = headerValues.length > 0 ? Math.max(...headerValues) : 0
    // Sheet名のdataを取り出す
    for(const sheetName of sheetNames){
      // Sheet内のJSONData
      const sheetData = data[sheetName];
      // 1行分のObject
      for(let i = 0;i < sheetData.length;++i){
        const rowData = sheetData[i];
        const rowKeys = Object.keys(rowData);
        // 変更すべきデータの行数の情報を取得
        const targetRowsRange = sheet.getRange(2 + i, 1, 1, nextKeyNumber + 1);
        const targetRowsValues = targetRowsRange.getValues();
        const updateTargetRowsValues = [...targetRowsValues];
        for(const rowKey of rowKeys){
          // headerにないものKeyがきたらHeaderに追加する
          if(!headerPairs[rowKey]){
            nextKeyNumber = nextKeyNumber + 1;
            headerPairs[rowKey] = nextKeyNumber;
          }
          // データの更新
          updateTargetRowsValues[0][headerPairs[rowKey]] = rowData[rowKey]
        }
        if (targetRowsValues != updateTargetRowsValues) {
          targetRowsRange.setValues(updateTargetRowsValues);
        }
      }
    }
    updateHeaderValues(sheet, headerPairs);
  }
  const resultObject = loadSpreadsheetToObjects(targetSpreadSheet);
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(data));
  return jsonOut;
}
