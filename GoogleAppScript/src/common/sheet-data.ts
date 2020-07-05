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

export function updateHeaderValues(targetSheet: GoogleAppsScript.Spreadsheet.Sheet, keyNumberPairs: { [s: string]: number }): void {
  const keyArray = Object.keys(keyNumberPairs);
  keyArray.sort((a, b) => {
    if (keyNumberPairs[a] > keyNumberPairs[b]) {
      return 1;
    } else if (keyNumberPairs[a] < keyNumberPairs[b]) {
      return -1;
    } else {
      return 0;
    }
  });
  const maxColumnNumber = keyNumberPairs.length > 0 ? Math.max(...Object.values(keyNumberPairs)) : 1;
  const headerRange = targetSheet.getRange(KEYS_COLUMN_ROW, 1, 1, maxColumnNumber);
  headerRange.setValues([keyArray]);
}
