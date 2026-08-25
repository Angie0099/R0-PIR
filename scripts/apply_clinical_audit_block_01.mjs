import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const manifestPath = path.join(bancoDir, "manifest.json");
const reportArgument = process.argv[2];
if (!reportArgument) throw new Error("Indica la ruta del informe de auditoría relativa a app.");

const CLINICAL = "Psicología Clínica";
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

const reportPath = path.resolve(appDir, reportArgument);
const manifest = read(manifestPath);
const report = read(reportPath);
if (report.complete !== true) throw new Error("El informe todavía no está cerrado.");
const sourceTopics = new Set(report.scope?.source_topics || []);
if (!sourceTopics.size) throw new Error("El informe no declara sus temas fuente.");
const configuredStatuses = Array.isArray(report.scope?.source_statuses) && report.scope.source_statuses.length
  ? report.scope.source_statuses
  : (report.scope?.source_selector?.v ? [report.scope.source_selector.v] : []);
const sourceStatuses = configuredStatuses.length ? new Set(configuredStatuses) : null;

const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) dataBySubject.set(subject, read(path.join(bancoDir, `${details.slug}.json`)));
const allCurrent = [...dataBySubject.values()].flat();
const currentById = new Map(allCurrent.map((question) => [question.id, question]));
if (currentById.size !== allCurrent.length || allCurrent.length !== manifest.total) throw new Error("El banco no es íntegro antes de aplicar el bloque.");

const topicExists = (target) => Boolean(target?.s && target?.t?.length === 1 && manifest.subjects[target.s]?.topics.includes(target.t[0]));
const reportIds = new Set();
const registerReportId = (id) => {
  if (!id || reportIds.has(id)) throw new Error(`ID duplicado o vacío en el informe: ${id}`);
  reportIds.add(id);
};
for (const item of report.entries || []) registerReportId(item.id);
for (const group of report.relocation_map || []) for (const id of group.ids || []) registerReportId(id);
for (const group of report.holds || []) for (const id of group.ids || []) registerReportId(id);
const sourceQuestions = dataBySubject.get(CLINICAL).filter((question) => (
  sourceTopics.has(question.t?.[0])
  && (!sourceStatuses || sourceStatuses.has(question.v ?? null))
));
const sourceIds = new Set(sourceQuestions.map((question) => question.id));
if (sourceIds.size !== sourceQuestions.length || sourceIds.size !== reportIds.size || [...sourceIds].some((id) => !reportIds.has(id)) || [...reportIds].some((id) => !sourceIds.has(id))) {
  throw new Error(`La cobertura del informe no coincide con los temas fuente (${reportIds.size}/${sourceIds.size}).`);
}

const assertCorrected = (question) => {
  if (!clean(question.e) || !OPTION_KEYS.includes(question.c) || !clean(question.x) || !clean(question.r)) throw new Error(`Payload incompleto: ${question.id}`);
  for (const key of OPTION_KEYS) if (!clean(question.o?.[key])) throw new Error(`Alternativa vacía: ${question.id}.${key}`);
  if (/respuesta correcta\s*[:\-]|justificaci[oó]n\s*[:\-]|tkbfat|persever\s*\|/i.test(JSON.stringify(question.o))) throw new Error(`Contaminación en alternativas: ${question.id}`);
};
const sourceExpected = (id) => {
  const original = currentById.get(id);
  if (!original || original.s !== CLINICAL || !sourceTopics.has(original.t?.[0]) || (sourceStatuses && !sourceStatuses.has(original.v ?? null))) throw new Error(`ID fuera de los temas fuente: ${id}`);
  return original;
};
const replacements = new Map();
const addPending = (id, destination) => {
  const original = sourceExpected(id);
  if (replacements.has(id)) throw new Error(`ID duplicado al aplicar: ${id}`);
  replacements.set(id, { ...original, s: destination.s, t: [...destination.t], v: "REVISAR" });
};

for (const item of report.entries || []) {
  const original = sourceExpected(item.id);
  if (item.field_readiness !== "LISTO_PARA_APLICAR" || !topicExists(item.destination)) throw new Error(`Entrada no aplicable: ${item.id}`);
  const fields = item.fields_to_store;
  const replacement = { ...original, s: item.destination.s, t: [...item.destination.t], e: clean(fields.e), o: cleanOptions(fields.o), c: clean(fields.c), x: clean(fields.x), r: clean(fields.r), v: fields.v };
  if (!["CORREGIDA", "VALIDADA_ORIGINAL"].includes(replacement.v)) throw new Error(`Estado seguro inválido: ${item.id}`);
  assertCorrected(replacement);
  if (replacements.has(item.id)) throw new Error(`Entrada segura duplicada: ${item.id}`);
  replacements.set(item.id, replacement);
}
for (const group of report.relocation_map || []) {
  if (group.action !== "REUBICAR_Y_MARCAR_REVISAR" || group.target_v !== "REVISAR" || !topicExists(group.destination)) throw new Error(`Reubicación no segura: ${group.reason}`);
  for (const id of group.ids) addPending(id, group.destination);
}
for (const group of report.holds || []) {
  if (group.action !== "MANTENER_Y_MARCAR_REVISAR" || !sourceTopics.has(group.source_topic)) throw new Error(`Pendiente no seguro: ${group.reason}`);
  for (const id of group.ids) addPending(id, { s: CLINICAL, t: [group.source_topic] });
}
if (replacements.size !== sourceQuestions.length) throw new Error(`Cobertura incompleta: ${replacements.size}/${sourceQuestions.length}.`);

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) finalBySubject.set(subject, questions.filter((question) => !replacements.has(question.id)));
for (const replacement of replacements.values()) finalBySubject.get(replacement.s).push(replacement);
const allAfter = [...finalBySubject.values()].flat();
if (allAfter.length !== allCurrent.length || new Set(allAfter.map((question) => question.id)).size !== allAfter.length) throw new Error("El bloque alteraría IDs o totales.");
for (const question of [...replacements.values()].filter((question) => question.v !== "REVISAR")) assertCorrected(question);

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;
const changedFiles = [];
for (const [subject, questions] of finalBySubject) {
  const file = path.join(bancoDir, `${manifest.subjects[subject].slug}.json`);
  if (`${JSON.stringify(dataBySubject.get(subject))}\n` !== `${JSON.stringify(questions)}\n`) {
    write(file, questions);
    changedFiles.push(path.relative(appDir, file));
  }
}
writeManifest(manifestPath, manifest);
changedFiles.push(path.relative(appDir, manifestPath));

const safe = [...replacements.values()].filter((question) => question.v !== "REVISAR");
console.log(JSON.stringify({
  report: path.relative(appDir, reportPath),
  sourceQuestions: sourceQuestions.length,
  corrected: safe.filter((question) => question.v === "CORREGIDA").length,
  validatedOriginal: safe.filter((question) => question.v === "VALIDADA_ORIGINAL").length,
  pending: replacements.size - safe.length,
  total: allAfter.length,
  uniqueIds: new Set(allAfter.map((question) => question.id)).size,
  changedFiles,
}, null, 2));
