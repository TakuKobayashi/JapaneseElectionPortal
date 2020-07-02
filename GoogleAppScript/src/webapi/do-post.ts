import { loadSpreadsheetToObjects } from '../common/converter';
import { getKeyNumberPairs } from '../common/sheet-data'

export function doPost(e: any): GoogleAppsScript.Content.TextOutput {
  const data = JSON.parse(e.postData.getDataAsString());
  const sheetNames = Object.keys(data);

  // e.parameterでURL QueryのObejctが取得できる
  const targetSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = targetSpreadSheet.getSheets();
  const newSheetNames = sheetNames.filter(sheetName => sheets.every(sheet => sheetName != sheet.getName()))
  for (const sheetName of newSheetNames) {
    const newSheet = targetSpreadSheet.insertSheet(sheetName);
  }
  for(const sheet of sheets){
    const headerPairs = getKeyNumberPairs(sheet);
    for(const sheetName of sheetNames){
      const sheetData = data[sheetName];
      for(const rowData of sheetData){
        const rowKeys = Object.keys(rowData);
        for(const rowKey of rowKeys){
          if(!headerPairs[rowKey]){
            
          }
        }
      }
    }
  }
  const resultObject = loadSpreadsheetToObjects(targetSpreadSheet);
  const jsonOut = ContentService.createTextOutput();
  //Mime TypeをJSONに設定
  jsonOut.setMimeType(ContentService.MimeType.JSON);
  //JSONテキストをセットする
  jsonOut.setContent(JSON.stringify(data));
  return jsonOut;
}
