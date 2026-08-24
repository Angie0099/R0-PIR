import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportsDir = path.join(appDir, "analysis", "audit_reports");
const manifestPath = path.join(bancoDir, "manifest.json");

const CLINICAL = "Psicología Clínica";
const TOC = "Trastorno obsesivo-compulsivo y relacionados";
const BIPOLAR = "Trastornos bipolares y relacionados";
const pendingPrefix = "Pendiente de auditoría con fuente original en su tema correcto. La pregunta se ha reubicado para evitar una clasificación incorrecta; su enunciado, clave y justificación todavía no se han validado.";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data) + "\n", "utf8");
const writeManifest = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
const clean = (value) => String(value ?? "")
  .normalize("NFC")
  .replace(/\u00ad/g, "")
  .replace(/[‐‑]/g, "-")
  .replace(/\s+/g, " ")
  .trim();
const cleanOptions = (options) => Object.fromEntries(["a", "b", "c", "d"].map((key) => [key, clean(options?.[key])]));

const manifest = read(manifestPath);
const report = read(path.join(reportsDir, "toc_bipolares_pendientes_cierre.json"));
if (report.complete !== true) throw new Error("El informe de cierre TOC/Bipolar no está marcado como completo.");

const records = [
  ...report.toc_records.map((record) => ({ ...record, sourceTopic: TOC })),
  ...report.bipolar_records.map((record) => ({ ...record, sourceTopic: BIPOLAR })),
];
if (records.length !== 122 || new Set(records.map((record) => record.id)).size !== 122) {
  throw new Error("El informe de cierre debe contener exactamente 122 IDs únicos.");
}

const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, `${details.slug}.json`)));
}
const allCurrent = [...dataBySubject.values()].flat();
const currentById = new Map(allCurrent.map((question) => [question.id, question]));
if (currentById.size !== allCurrent.length) throw new Error("El banco contiene IDs duplicados antes de aplicar el cierre.");

const topicExists = (subject, topic) => Boolean(manifest.subjects[subject]?.topics.includes(topic));
const targetFrom = (value) => {
  const parts = String(value || "").split(" > ");
  if (parts.length !== 2 || !topicExists(parts[0], parts[1])) return null;
  return { subject: parts[0], topic: parts[1] };
};
const sourceMap = report.sources || {};
const expandReference = (reference) => {
  let expanded = clean(reference);
  for (const [alias, full] of Object.entries(sourceMap).sort((a, b) => b[0].length - a[0].length)) {
    expanded = expanded.split(alias).join(full);
  }
  return clean(expanded.replace(/;\s*;/g, ";"));
};
const assertCorrected = (question) => {
  if (!clean(question.e) || !["a", "b", "c", "d"].includes(question.c) || !clean(question.x) || !clean(question.r)) {
    throw new Error(`Payload corregido incompleto: ${question.id}`);
  }
  for (const option of ["a", "b", "c", "d"]) if (!clean(question.o?.[option])) throw new Error(`Opción vacía: ${question.id}.${option}`);
  if (/@(?:B24|DSM5TR|CIE11)/.test(question.r)) throw new Error(`Referencia sin expandir: ${question.id}`);
};

const replacements = new Map();
for (const record of records) {
  const original = currentById.get(record.id);
  if (!original) throw new Error(`ID ausente del banco: ${record.id}`);
  if (original.s !== CLINICAL || original.t?.[0] !== record.sourceTopic || original.v !== "REVISAR") {
    throw new Error(`El ID ${record.id} ya no está en el estado o tema esperado para el cierre.`);
  }

  const sourceTarget = { subject: CLINICAL, topic: record.sourceTopic };
  if (record.V === "CORREGIDA") {
    const replacement = {
      ...original,
      s: sourceTarget.subject,
      t: [sourceTarget.topic],
      e: clean(record.E),
      o: cleanOptions(record.O),
      c: clean(record.C),
      x: clean(record.X),
      r: expandReference(record.R),
      v: "CORREGIDA",
    };
    assertCorrected(replacement);
    replacements.set(record.id, replacement);
    continue;
  }

  if (record.V !== "REVISAR") throw new Error(`Estado no reconocido en ${record.id}: ${record.V}`);
  const reviewTarget = targetFrom(record.destination) || sourceTarget;
  replacements.set(record.id, {
    ...original,
    s: reviewTarget.subject,
    t: [reviewTarget.topic],
    x: `${pendingPrefix} Motivo: ${clean(record.reason)}`,
    r: "",
    v: "REVISAR",
  });
}
if (replacements.size !== 122) throw new Error("No se han preparado las 122 sustituciones del cierre.");

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) {
  finalBySubject.set(subject, questions.filter((question) => !replacements.has(question.id)));
}
for (const replacement of replacements.values()) finalBySubject.get(replacement.s).push(replacement);

for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados tras el cierre en ${subject}.`);
}
const allAfter = [...finalBySubject.values()].flat();
if (allAfter.length !== manifest.total || new Set(allAfter.map((question) => question.id)).size !== allAfter.length) {
  throw new Error("El cierre alteraría el total de preguntas o sus IDs.");
}

const corrected = [...replacements.values()].filter((question) => question.v === "CORREGIDA");
const pending = [...replacements.values()].filter((question) => question.v === "REVISAR");
for (const question of corrected) {
  if (/respuesta correcta\s*[:\-]|justificaci[oó]n\s*[:\-]|tkbfat|persever\s*\|/i.test(JSON.stringify(question.o))) {
    throw new Error(`Contaminación en alternativas corregidas: ${question.id}`);
  }
}
for (const question of pending) {
  if (!question.x.startsWith(pendingPrefix) || question.r !== "") throw new Error(`Pendiente mal marcado: ${question.id}`);
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;

for (const [subject, questions] of finalBySubject) write(path.join(bancoDir, `${manifest.subjects[subject].slug}.json`), questions);
writeManifest(manifestPath, manifest);

const clinicalAfter = finalBySubject.get(CLINICAL);
console.log(JSON.stringify({
  block: "Cierre Psicología Clínica adulta — TOC y trastornos bipolares",
  corrected: corrected.length,
  pending: pending.length,
  tocCorrected: corrected.filter((question) => question.t?.[0] === TOC).length,
  bipolarCorrected: corrected.filter((question) => question.t?.[0] === BIPOLAR).length,
  tocPending: pending.filter((question) => question.t?.[0] === TOC).length,
  bipolarPending: pending.filter((question) => question.t?.[0] === BIPOLAR).length,
  tocNow: clinicalAfter.filter((question) => question.t?.[0] === TOC).length,
  bipolarNow: clinicalAfter.filter((question) => question.t?.[0] === BIPOLAR).length,
  total: allAfter.length,
  uniqueIds: new Set(allAfter.map((question) => question.id)).size,
}, null, 2));
