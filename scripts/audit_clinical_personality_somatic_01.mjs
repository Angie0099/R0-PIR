import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportsDir = path.join(appDir, "analysis", "audit_reports");
const manifestPath = path.join(bancoDir, "manifest.json");

const CLINICAL = "Psicología Clínica";
const PERSONALITY = "Trastornos de la personalidad";
const SOMATIC = "Trastornos de síntomas somáticos y relacionados";
const SOURCE_TOPICS = new Set([PERSONALITY, SOMATIC]);
const OPTION_KEYS = ["a", "b", "c", "d"];

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data)}\n`, "utf8");
const writeManifest = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
const clean = (value) => String(value ?? "")
  .normalize("NFC")
  .replace(/\u00ad/g, "")
  .replace(/[‐‑]/g, "-")
  .replace(/\s+/g, " ")
  .trim();
const cleanOptions = (options) => Object.fromEntries(OPTION_KEYS.map((key) => [key, clean(options?.[key])]));

const manifest = read(manifestPath);
const report = read(path.join(reportsDir, "clinica_adulta_ca05_personalidad_somaticos.json"));
const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, `${details.slug}.json`)));
}
const allCurrent = [...dataBySubject.values()].flat();
const currentById = new Map(allCurrent.map((question) => [question.id, question]));
if (currentById.size !== allCurrent.length) throw new Error("El banco contiene IDs duplicados antes de aplicar el bloque.");
if (allCurrent.length !== manifest.total) throw new Error("El total del manifest no coincide con el banco antes de aplicar el bloque.");

const topicExists = (target) => Boolean(target?.s && target?.t?.length === 1 && manifest.subjects[target.s]?.topics.includes(target.t[0]));
const reportIds = new Set();
const registerReportId = (id) => {
  if (!id || reportIds.has(id)) throw new Error(`ID duplicado o vacío en el informe: ${id}`);
  reportIds.add(id);
};
for (const item of report.entries) registerReportId(item.id);
for (const group of report.relocation_map) for (const id of group.ids) registerReportId(id);
for (const group of report.holds) for (const id of group.ids) registerReportId(id);

const sourceQuestions = dataBySubject.get(CLINICAL).filter((question) => SOURCE_TOPICS.has(question.t?.[0]));
const sourceIds = new Set(sourceQuestions.map((question) => question.id));
if (sourceIds.size !== sourceQuestions.length) throw new Error("Existen IDs duplicados en los temas fuente.");
if (sourceIds.size !== reportIds.size || [...reportIds].some((id) => !sourceIds.has(id)) || [...sourceIds].some((id) => !reportIds.has(id))) {
  throw new Error(`La cobertura del informe no coincide con las preguntas fuente (${reportIds.size}/${sourceIds.size}).`);
}

const assertCorrected = (question) => {
  if (!clean(question.e) || !OPTION_KEYS.includes(question.c) || !clean(question.x) || !clean(question.r)) {
    throw new Error(`Payload corregido incompleto: ${question.id}`);
  }
  for (const option of OPTION_KEYS) if (!clean(question.o?.[option])) throw new Error(`Opción vacía: ${question.id}.${option}`);
  if (/respuesta correcta\s*[:\-]|justificaci[oó]n\s*[:\-]|tkbfat|persever\s*\|/i.test(JSON.stringify(question.o))) {
    throw new Error(`Contaminación en alternativas: ${question.id}`);
  }
};

const replacements = new Map();
const sourceExpected = (id) => {
  const original = currentById.get(id);
  if (!original || original.s !== CLINICAL || !SOURCE_TOPICS.has(original.t?.[0])) {
    throw new Error(`El ID ${id} no está en los temas fuente esperados.`);
  }
  return original;
};
const addPending = (id, target) => {
  const original = sourceExpected(id);
  if (replacements.has(id)) throw new Error(`ID duplicado en el informe: ${id}`);
  replacements.set(id, {
    ...original,
    s: target.s,
    t: [...target.t],
    v: "REVISAR",
  });
};

for (const item of report.entries) {
  const original = sourceExpected(item.id);
  if (item.field_readiness !== "LISTO_PARA_APLICAR" || !topicExists(item.destination)) {
    throw new Error(`Entrada segura sin destino o contrato válido: ${item.id}`);
  }
  const fields = item.fields_to_store;
  const replacement = {
    ...original,
    s: item.destination.s,
    t: [...item.destination.t],
    e: clean(fields.e),
    o: cleanOptions(fields.o),
    c: clean(fields.c),
    x: clean(fields.x),
    r: clean(fields.r),
    v: fields.v === "VALIDADA_ORIGINAL" ? "VALIDADA_ORIGINAL" : "CORREGIDA",
  };
  assertCorrected(replacement);
  if (replacements.has(item.id)) throw new Error(`ID seguro duplicado: ${item.id}`);
  replacements.set(item.id, replacement);
}
for (const group of report.relocation_map) {
  if (group.action !== "REUBICAR_Y_MARCAR_REVISAR" || group.target_v !== "REVISAR" || !topicExists(group.destination)) {
    throw new Error(`Reubicación sin un destino exacto y revisable: ${group.reason}`);
  }
  for (const id of group.ids) addPending(id, group.destination);
}
for (const group of report.holds) {
  if (group.action !== "MANTENER_Y_MARCAR_REVISAR" || !SOURCE_TOPICS.has(group.source_topic)) {
    throw new Error(`Pendiente sin tema fuente válido: ${group.reason}`);
  }
  const target = { s: CLINICAL, t: [group.source_topic] };
  for (const id of group.ids) addPending(id, target);
}
if (replacements.size !== sourceQuestions.length) throw new Error(`Cobertura incompleta: ${replacements.size}/${sourceQuestions.length}.`);

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) finalBySubject.set(subject, questions.filter((question) => !replacements.has(question.id)));
for (const replacement of replacements.values()) {
  if (!finalBySubject.has(replacement.s)) throw new Error(`Asignatura destino inexistente: ${replacement.s}`);
  finalBySubject.get(replacement.s).push(replacement);
}
for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados tras el bloque en ${subject}.`);
}
const allAfter = [...finalBySubject.values()].flat();
if (allAfter.length !== allCurrent.length || new Set(allAfter.map((question) => question.id)).size !== allAfter.length) {
  throw new Error("El bloque alteraría el total de preguntas o sus IDs.");
}

const safe = [...replacements.values()].filter((question) => ["CORREGIDA", "VALIDADA_ORIGINAL"].includes(question.v));
const pending = [...replacements.values()].filter((question) => question.v === "REVISAR");
for (const question of safe) assertCorrected(question);
if (safe.length !== report.entries.length || pending.length !== report.relocation_map.flatMap((group) => group.ids).length + report.holds.flatMap((group) => group.ids).length) {
  throw new Error("El reparto entre preguntas listas y pendientes no coincide con el informe.");
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;

const changedFiles = [];
for (const [subject, questions] of finalBySubject) {
  const file = path.join(bancoDir, `${manifest.subjects[subject].slug}.json`);
  const before = `${JSON.stringify(dataBySubject.get(subject))}\n`;
  const after = `${JSON.stringify(questions)}\n`;
  if (before !== after) {
    write(file, questions);
    changedFiles.push(path.relative(appDir, file));
  }
}
writeManifest(manifestPath, manifest);
changedFiles.push(path.relative(appDir, manifestPath));

const clinicalAfter = finalBySubject.get(CLINICAL);
console.log(JSON.stringify({
  block: "Psicología Clínica adulta — Personalidad y síntomas somáticos",
  sourceQuestions: sourceQuestions.length,
  corrected: safe.filter((question) => question.v === "CORREGIDA").length,
  validatedOriginal: safe.filter((question) => question.v === "VALIDADA_ORIGINAL").length,
  pending: pending.length,
  personalityNow: clinicalAfter.filter((question) => question.t?.[0] === PERSONALITY).length,
  somaticNow: clinicalAfter.filter((question) => question.t?.[0] === SOMATIC).length,
  total: allAfter.length,
  uniqueIds: new Set(allAfter.map((question) => question.id)).size,
  changedFiles,
}, null, 2));
