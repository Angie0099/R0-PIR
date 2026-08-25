import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportsDir = path.join(appDir, "analysis", "audit_reports");
const manifestPath = path.join(bancoDir, "manifest.json");

const CLINICAL = "Psicología Clínica";
const MODELS = "Modelos en psicopatología";
const SYSTEMS = "Sistemas clasificatorios en psicopatología";
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
const report = read(path.join(reportsDir, "modelos_sistemas_clinica_adulta.json"));
const entries = report.entries || [];
if (entries.length !== 87 || new Set(entries.map((entry) => entry.id)).size !== 87) {
  throw new Error("El informe de Modelos/Sistemas no contiene los 87 IDs únicos esperados.");
}

const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, `${details.slug}.json`)));
}
const allCurrent = [...dataBySubject.values()].flat();
const currentById = new Map(allCurrent.map((question) => [question.id, question]));
if (currentById.size !== allCurrent.length) throw new Error("El banco ya contiene IDs duplicados.");

const topicExists = (subject, topic) => Boolean(manifest.subjects[subject]?.topics.includes(topic));
const targetFrom = (value) => {
  const parts = String(value || "").split(" > ");
  if (parts.length !== 2 || !topicExists(parts[0], parts[1])) return null;
  return { subject: parts[0], topic: parts[1] };
};
const assertCorrected = (question) => {
  if (!clean(question.e) || !["a", "b", "c", "d"].includes(question.c) || !clean(question.x) || !clean(question.r)) {
    throw new Error(`Payload corregido incompleto: ${question.id}`);
  }
  for (const option of ["a", "b", "c", "d"]) if (!clean(question.o?.[option])) throw new Error(`Opción vacía: ${question.id}.${option}`);
  if (/@[A-Z]/.test(question.r)) throw new Error(`Referencia no materializada: ${question.id}`);
  if (/respuesta correcta\s*[:\-]|justificaci[oó]n\s*[:\-]|tkbfat|persever\s*\|/i.test(JSON.stringify(question.o))) {
    throw new Error(`Contaminación en alternativas: ${question.id}`);
  }
};

const sourceIds = new Set(entries.map((entry) => entry.id));
const clinical = dataBySubject.get(CLINICAL);
const sourceQuestions = clinical.filter((question) => question.t?.[0] === MODELS || question.t?.[0] === SYSTEMS);
if (new Set(sourceQuestions.map((question) => question.id)).size !== sourceQuestions.length) {
  throw new Error("Se han detectado IDs duplicados en Modelos/Sistemas.");
}
for (const id of sourceIds) {
  if (!sourceQuestions.some((question) => question.id === id)) throw new Error(`ID de informe ausente de Modelos/Sistemas: ${id}`);
}

const replacements = new Map();
for (const entry of entries) {
  const original = currentById.get(entry.id);
  if (!original || original.s !== CLINICAL || original.t?.[0] !== entry.source_topic) {
    throw new Error(`El ID ${entry.id} no está en su tema fuente esperado.`);
  }
  const target = targetFrom(entry.destination);
  if (entry.field_readiness === "LISTO_PARA_APLICAR") {
    if (!target) throw new Error(`Destino inexistente para pregunta lista: ${entry.id}`);
    const isOriginalValidation = entry.status === "VALIDAR_SIN_CAMBIOS_DE_CONTENIDO";
    const replacement = {
      ...original,
      s: target.subject,
      t: [target.topic],
      e: clean(entry.E),
      o: cleanOptions(entry.O),
      c: clean(entry.C),
      x: clean(entry.X),
      r: clean(entry.R),
      v: isOriginalValidation ? "VALIDADA_ORIGINAL" : "CORREGIDA",
    };
    assertCorrected(replacement);
    replacements.set(entry.id, replacement);
    continue;
  }

  if (entry.field_readiness !== "NO_LISTO") throw new Error(`Estado de preparación no reconocido: ${entry.id}`);
  const reviewTarget = target || { subject: CLINICAL, topic: entry.source_topic };
  replacements.set(entry.id, {
    ...original,
    s: reviewTarget.subject,
    t: [reviewTarget.topic],
    x: `${pendingPrefix} Motivo: ${clean(entry.reason)}`,
    r: "",
    v: "REVISAR",
  });
}
if (replacements.size !== 87) throw new Error("No se han preparado las 87 sustituciones.");

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) {
  finalBySubject.set(subject, questions.filter((question) => !replacements.has(question.id)));
}
for (const question of replacements.values()) finalBySubject.get(question.s).push(question);

for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados tras la auditoría en ${subject}.`);
}
const allAfter = [...finalBySubject.values()].flat();
if (allAfter.length !== manifest.total || new Set(allAfter.map((question) => question.id)).size !== allAfter.length) {
  throw new Error("La auditoría alteraría el total de preguntas o los IDs.");
}

const corrected = [...replacements.values()].filter((question) => question.v === "CORREGIDA");
const validated = [...replacements.values()].filter((question) => question.v === "VALIDADA_ORIGINAL");
const pending = [...replacements.values()].filter((question) => question.v === "REVISAR");
for (const question of pending) {
  if (!question.x.startsWith(pendingPrefix) || question.r !== "") throw new Error(`Pendiente mal marcado: ${question.id}`);
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;

for (const [subject, questions] of finalBySubject) write(path.join(bancoDir, `${manifest.subjects[subject].slug}.json`), questions);
writeManifest(manifestPath, manifest);

console.log(JSON.stringify({
  block: "Psicología Clínica adulta — Modelos y Sistemas clasificatorios",
  corrected: corrected.length,
  validatedOriginal: validated.length,
  pending: pending.length,
  total: allAfter.length,
  uniqueIds: new Set(allAfter.map((question) => question.id)).size,
  modelsNow: finalBySubject.get(CLINICAL).filter((question) => question.t?.[0] === MODELS).length,
  systemsNow: finalBySubject.get(CLINICAL).filter((question) => question.t?.[0] === SYSTEMS).length,
}, null, 2));
