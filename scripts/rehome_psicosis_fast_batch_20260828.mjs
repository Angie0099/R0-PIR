import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "..");
const banco = path.join(app, "public", "banco");
const manifestPath = path.join(banco, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const files = new Map(Object.entries(manifest.subjects).map(([s, d]) => [s, path.join(banco, `${d.slug}.json`)]));
const data = new Map([...files].map(([s, f]) => [s, JSON.parse(fs.readFileSync(f, "utf8"))]));
const moves = [
  ["JULIO1_087", "Psicología Clínica", "Trastorno obsesivo-compulsivo y relacionados"],
  ["AGOSTO2_046", "Psicología Clínica", "Sistemas clasificatorios en psicopatología"],
  ["DICIEMBRE-DOS-24_COMENTADO_066", "Psicología Clínica", "Trastornos de la conducta alimentaria y de la ingestión de alimentos"],
  ["JUNIO-UNO-24_COMENTADO_086", "Psicología Clínica", "Trastornos disruptivos, del control de los impulsos y de la conducta"],
  ["MAYO-DOS-24_COMENTADO_175", "Psicopatología Infantil", "Trastorno del espectro autista"],
  ["MAYO-UNO-24_COMENTADO_014", "Psicología Clínica", "Sistemas clasificatorios en psicopatología"],
  ["MAYO-UNO-24_COMENTADO_054", "Psicología Clínica", "Trastornos de ansiedad"],
  ["NOVIEMBRE-DOS-24_COMENTADO_032", "Psicología Clínica", "Sistemas clasificatorios en psicopatología"],
  ["OCTUBRE-UNO-24_COMENTADO_036", "Psicología Clínica", "Disfunciones sexuales"],
  ["OCTUBRE-UNO-24_COMENTADO_042", "Psicología Clínica", "Psicopatología de la conducta motora"],
  ["OCTUBRE-UNO-24_COMENTADO_046", "Psicología Clínica", "Trastornos de la personalidad"],
];
const source = "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos";
const allBefore = [...data.values()].flat();
const byId = new Map(allBefore.map((q) => [q.id, q]));
for (const [id, subject, topic] of moves) {
  const q = byId.get(id);
  if (!q || q.s !== "Psicología Clínica" || q.t?.[0] !== source) throw new Error(`Origen no válido: ${id}.`);
  if (!manifest.subjects[subject]?.topics.includes(topic)) throw new Error(`Destino no válido: ${subject} > ${topic}.`);
  q.s = subject;
  q.t = [topic];
  q.v = "REVISAR";
}
const allAfter = [...data.values()].flat();
if (allAfter.length !== allBefore.length || new Set(allAfter.map((q) => q.id)).size !== allAfter.length) throw new Error("El traslado alteraría total o IDs.");
for (const [subject, questions] of data) fs.writeFileSync(files.get(subject), `${JSON.stringify(questions)}\n`, "utf8");
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = data.get(subject).length;
manifest.total = allAfter.length;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ moved: moves.map(([id, s, t]) => ({ id, destination: `${s} > ${t}` })), total: manifest.total, uniqueIds: new Set(allAfter.map((q) => q.id)).size }, null, 2));
