import crypto from 'node:crypto';

export default function handler(req, res) {
  const state = crypto.createHmac('sha256', process.env.AUDITOR_DOCUMENTAL_SECRET || '').update('google-drive-readonly').digest('hex');
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    redirect_uri: 'https://r0-pir.vercel.app/api/google-drive/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
