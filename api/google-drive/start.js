import crypto from 'node:crypto';

// El ID de cliente OAuth es público por diseño; el secreto permanece solo en Vercel.
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || '128268525142-n48i330ugdm3prg5esdi48r2v1tfjo5e.apps.googleusercontent.com';

export default function handler(req, res) {
  const state = crypto.createHmac('sha256', process.env.AUDITOR_DOCUMENTAL_SECRET || '').update('google-drive-readonly').digest('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: 'https://r0-pir.vercel.app/api/google-drive/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
