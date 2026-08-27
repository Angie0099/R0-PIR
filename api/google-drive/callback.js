import crypto from 'node:crypto';

export default async function handler(req, res) {
  const expected = crypto.createHmac('sha256', process.env.AUDITOR_DOCUMENTAL_SECRET || '').update('google-drive-readonly').digest('hex');
  if (req.query.state !== expected || !req.query.code) return res.status(400).send('Autorización no válida.');
  const body = new URLSearchParams({
    code: req.query.code,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    redirect_uri: 'https://r0-pir.vercel.app/api/google-drive/callback',
    grant_type: 'authorization_code',
  });
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!tokenResponse.ok) return res.status(502).send('No se pudo completar la autorización.');
  const token = await tokenResponse.json();
  if (!token.refresh_token) return res.status(502).send('Google no devolvió un permiso renovable. Revoca el cliente y vuelve a autorizarlo.');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<p>Autorización completada. Copia este valor únicamente en la variable secreta <strong>GOOGLE_DRIVE_REFRESH_TOKEN</strong> de Vercel y después cierra esta página:</p><textarea readonly style="width:95%;height:7em">${token.refresh_token}</textarea>`);
}
