import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKeyRaw || !sheetId) {
    res.status(500).json({ error: 'Missing Google Sheets configuration' });
    return;
  }

  // Convert escaped newlines to real newlines
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:D', // skip header row
    });

    const rows = response.data.values || [];
    const data = rows
      .map((row: any[], index: number) => ({
        id: String(index),
        timestamp: row[0] ?? '',
        telegramUsername: row[1] ?? '',
        telegramId: row[2] ?? '',
        websiteUrl: row[3] ?? '',
      }))
      .filter((p) => p.websiteUrl);

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Google Sheets error', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}
