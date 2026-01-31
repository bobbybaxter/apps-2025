import type { GoogleSpreadsheet } from 'google-spreadsheet';
import type { Application } from '../../type';

export async function parseGoogleSheet(doc: GoogleSpreadsheet) {
  const sheetsJson = [];
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const headers = sheet.headerValues;

  for await (const row of rows) {
    const rowData: Record<string, string | number | null> = {};

    headers.forEach((header) => {
      if (row.get(header) === undefined || row.get(header) === null || row.get(header) === '') {
        return (rowData[header] = null);
      }

      rowData[header] = row.get(header);
    });

    sheetsJson.push(rowData);
  }

  return sheetsJson.filter((row) => row.applied !== null) as unknown as Application[];
}
