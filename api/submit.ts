import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// In‑memory rate limiting map: IP → { count, firstRequestTime }
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();
const RATE_LIMIT_MAX = 2; // max submissions
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 60 minutes

// Simple HTML tag stripper
function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

// Validation helpers
function isValidUrl(url: string): boolean {
  return /^https?:\/\/[^\s]{1,100}$/.test(url);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ----- METHOD CHECK -----
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // ----- RATE LIMITING -----
  const ip = req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress || '';
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (record) {
    if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      // window expired – reset
      rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    } else if (record.count >= RATE_LIMIT_MAX) {
      res.status(429).json({ error: 'Too many submissions. Try again later.' });
      return;
    } else {
      record.count += 1;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
  }

  // ----- INPUT PARSING & SANITISATION -----
  const {
    projectName,
    telegramUsername,
    telegramId,
    websiteUrl,
    description = '',
    consent,
  } = req.body || {};

  // ----- CONSENT CHECK -----
  if (consent !== true) {
    res.status(400).json({ error: 'Consent is required.' });
    return;
  }

  // Helper to trim & strip HTML
  const clean = (value: any): string =>
    typeof value === 'string' ? stripHtmlTags(value).trim() : '';

  const cleanProjectName = clean(projectName);
  const cleanTelegramUsername = clean(telegramUsername).replace(/^@/, '');
  const cleanTelegramId = clean(telegramId);
  const cleanWebsiteUrl = clean(websiteUrl);
  const cleanDescription = clean(description);

  // ----- VALIDATION -----
  if (!cleanProjectName || cleanProjectName.length > 100) {
    res.status(400).json({ error: 'Invalid projectName' });
    return;
  }
  if (!cleanTelegramUsername || cleanTelegramUsername.length > 100) {
    res.status(400).json({ error: 'Invalid telegramUsername' });
    return;
  }
  if (!cleanTelegramId || cleanTelegramId.length > 100) {
    res.status(400).json({ error: 'Invalid telegramId' });
    return;
  }
  if (!cleanWebsiteUrl || cleanWebsiteUrl.length > 100 || !isValidUrl(cleanWebsiteUrl)) {
    res.status(400).json({ error: 'Invalid websiteUrl' });
    return;
  }
  if (cleanDescription.length > 100) {
    res.status(400).json({ error: 'Invalid description' });
    return;
  }

  // ----- GOOGLE SHEETS CONFIG -----
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !privateKeyRaw || !sheetId) {
    res.status(500).json({ error: 'Missing Google Sheets configuration' });
    return;
  }
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // ----- DUPLICATE CHECK -----
    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:F',
    });
    const existingRows = existingRes.data.values || [];
    const normalizedNewUrl = cleanWebsiteUrl.toLowerCase().replace(/\/$/, '');
    const duplicate = existingRows.some((row: any[]) => {
      const url = (row[4] ?? '').toString().toLowerCase().replace(/\/$/, '');
      return url === normalizedNewUrl;
    });
    if (duplicate) {
      res.status(409).json({ error: 'This website has already been showcased.' });
      return;
    }

    // ----- APPEND NEW ROW -----
    const newRow = [
      new Date().toISOString(),
      cleanProjectName,
      cleanTelegramUsername,
      cleanTelegramId,
      cleanWebsiteUrl,
      cleanDescription,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [newRow],
      },
    });

    res.status(201).json({ success: true, message: 'Your project has joined the showcase.' });
  } catch (err: any) {
    console.error('Google Sheets error', err);
    res.status(500).json({ error: 'Failed to submit project' });
  }
}
