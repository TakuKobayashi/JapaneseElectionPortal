const KEYS_COLUMN_ROW = 1;

export function getKeyNumberPairs(targetSheet: GoogleAppsScript.Spreadsheet.Sheet): { [s: string]: number } {
  const keyNumberPairs: { [s: string]: number } = {};
  const headerRange = targetSheet.getRange(KEYS_COLUMN_ROW, 1, 1, targetSheet.getLastColumn());
  const headerValues = headerRange.getValues();
  if (headerValues[0]) {
    for (let i = 0; i < headerValues[0].length; ++i) {
      keyNumberPairs[headerValues[0][i]] = i + 1;
    }
  }
  return keyNumberPairs;
}