import fs from 'node:fs';

const catalog = JSON.parse(
  fs.readFileSync(new URL('../public/auditor_pir_manual_catalog.json', import.meta.url), 'utf8'),
);

function excerptFor(text, query) {
  const words = query.toLocaleLowerCase('es-ES').split(/\s+/).filter((word) => word.length >= 4).slice(0, 6);
  const normalized = text.toLocaleLowerCase('es-ES');
  const index = words.map((word) => normalized.indexOf(word)).find((value) => value >= 0);
  if (index === undefined) return null;
  const start = Math.max(0, index - 900);
  const end = Math.min(text.length, index + 1800);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST.' });
  if (!process.env.AUDITOR_DOCUMENTAL_SECRET || req.headers['x-auditor-documental-key'] !== process.env.AUDITOR_DOCUMENTAL_SECRET) {
    return res.status(401).json({ error: 'Acceso documental no autorizado.' });
  }

  const { sourceId, query } = req.body || {};
  const source = catalog.sources.find((item) => item.id === sourceId);
  if (!source || !source.drive_id || typeof query !== 'string' || query.trim().length < 4) {
    return res.status(400).json({ error: 'Fuente o consulta no válida.' });
  }
  if (!process.env.GOOGLE_DRIVE_ACCESS_TOKEN) {
    return res.status(503).json({ error: 'La conexión privada con Drive todavía no está autorizada.' });
  }

  const endpoint = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(source.drive_id)}/export?mimeType=text%2Fplain`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${process.env.GOOGLE_DRIVE_ACCESS_TOKEN}` } });
  if (!response.ok) return res.status(502).json({ error: 'No se pudo consultar el manual autorizado.' });

  const excerpt = excerptFor(await response.text(), query);
  return res.status(200).json({
    source: { id: source.id, title: source.title, authors: source.authors, year: source.year },
    query,
    excerpt,
    note: excerpt ? 'Fragmento privado para auditoría; no se expone el documento completo.' : 'No se localizó un fragmento con esos términos.'
  });
}
