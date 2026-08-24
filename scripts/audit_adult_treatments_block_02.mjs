import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportPath = path.join(appDir, "analysis", "audit_reports", "tratamientos_adultos_sueno_destructivos.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const ADULT = "Tratamientos Adultos";
const sleepTopic = "Tratamiento de los trastornos del sueño";
const destructiveTopic = "Tratamiento de los trastornos destructivos";
const burnoutTopic = "Psicología de la salud — estrés laboral y burnout";
const pendingNote = "Pendiente de auditoría en su bloque temático. Se ha reubicado desde Tratamientos Adultos para evitar una clasificación incorrecta; el enunciado, la clave y la justificación no se han validado todavía.";
const safeActions = new Set(["CORREGIR_Y_MANTENER", "CORREGIR_Y_REUBICAR", "VALIDAR_SIN_CAMBIOS_DE_CONTENIDO"]);

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const manifest = read(manifestPath);
const report = read(reportPath);
const sourceFile = path.join(bancoDir, "tratamientos_adultos.json");
const source = read(sourceFile);
const sourceTopics = new Set([sleepTopic, destructiveTopic]);
const sourceQuestions = source.filter((question) => sourceTopics.has(question.t?.[0]));
const sourceById = new Map(sourceQuestions.map((question) => [question.id, question]));
const reportIds = report.records.map((entry) => entry.id);
const reportIdSet = new Set(reportIds);
if (sourceQuestions.length !== 57 || report.records.length !== 57 || reportIdSet.size !== 57) {
  throw new Error("El inventario del bloque no coincide con las 57 preguntas auditadas.");
}
const missing = [...sourceById.keys()].filter((id) => !reportIdSet.has(id));
const unexpected = reportIds.filter((id) => !sourceById.has(id));
if (missing.length || unexpected.length) throw new Error("Incoherencia entre informe y banco. Faltan: " + missing.join(", ") + "; inesperadas: " + unexpected.join(", "));

const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, details.slug + ".json")));
}
const parseDestination = (value) => {
  const parts = String(value || "").split(" > ");
  if (parts.length !== 2) throw new Error("Destino no estructurado: " + value);
  const [subject, rawTopic] = parts;
  const topic = rawTopic === "[nuevo tema: Psicología de la salud — estrés laboral y burnout]" ? burnoutTopic : rawTopic;
  if (!manifest.subjects[subject]) throw new Error("Asignatura destino desconocida: " + subject);
  return { subject, topic };
};

if (!manifest.subjects[ADULT].topics.includes(burnoutTopic)) {
  const topics = manifest.subjects[ADULT].topics;
  const afterIntroduction = topics.indexOf("Introducción") + 1;
  topics.splice(afterIntroduction, 0, burnoutTopic);
}

const replacements = new Map();
for (const entry of report.records) {
  const original = sourceById.get(entry.id);
  const { subject, topic } = parseDestination(entry.destination);
  if (!manifest.subjects[subject].topics.includes(topic)) throw new Error("Tema destino ausente: " + entry.id + " → " + subject + " / " + topic);
  let replacement;
  if (safeActions.has(entry.action)) {
    if (!entry.final?.e || !entry.final?.o || !entry.final?.c || !entry.final?.x || !entry.final?.r) throw new Error("Faltan campos auditados en " + entry.id);
    if (entry.final.t?.[0] !== topic) throw new Error("Tema final discordante en " + entry.id);
    replacement = { ...original, s: subject, t: [topic], e: entry.final.e, o: entry.final.o, c: entry.final.c, x: entry.final.x, r: entry.final.r, v: "CORREGIDA" };
    for (const key of ["a", "b", "c", "d"]) if (!String(replacement.o?.[key] || "").trim()) throw new Error("Opción vacía en " + entry.id + ": " + key);
  } else {
    replacement = { ...original, s: subject, t: [topic], x: pendingNote, r: "", v: "REVISAR" };
  }
  replacements.set(entry.id, replacement);
}

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) finalBySubject.set(subject, [...questions]);
finalBySubject.set(ADULT, source.filter((question) => !replacements.has(question.id)));
for (const replacement of replacements.values()) finalBySubject.get(replacement.s).push(replacement);

for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error("IDs duplicados en " + subject);
}
const allAfter = [...finalBySubject.values()].flat();
const allIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== manifest.total || allIds.size !== allAfter.length) throw new Error("La auditoría alteraría el total de preguntas o sus identificadores.");
if ([...replacements.keys()].some((id) => !allIds.has(id))) throw new Error("Falta una pregunta reubicada.");

const finalAdult = finalBySubject.get(ADULT);
const sleepAfter = finalAdult.filter((question) => question.t?.[0] === sleepTopic);
const destructiveAfter = finalAdult.filter((question) => question.t?.[0] === destructiveTopic);
const burnoutAfter = finalAdult.filter((question) => question.t?.[0] === burnoutTopic);
if (sleepAfter.length !== 8 || sleepAfter.some((question) => question.v !== "CORREGIDA" || !question.x || !question.r)) throw new Error("El tema de sueño no quedó completamente auditado.");
if (destructiveAfter.length !== 0) throw new Error("Quedaron preguntas en el tema contaminado de trastornos destructivos.");
if (burnoutAfter.length !== 2 || burnoutAfter.some((question) => question.v !== "REVISAR")) throw new Error("Las preguntas de burnout no quedaron marcadas como pendientes.");
const pendingEntries = report.records.filter((entry) => !safeActions.has(entry.action));
for (const entry of pendingEntries) {
  const question = allAfter.find((item) => item.id === entry.id);
  if (question.v !== "REVISAR" || question.x !== pendingNote || question.r !== "") throw new Error("Pendiente mal marcado: " + entry.id);
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;
manifest.subjects[ADULT].topics = manifest.subjects[ADULT].topics.filter((topic) => topic !== destructiveTopic);

for (const [subject, questions] of finalBySubject) {
  const file = path.join(bancoDir, manifest.subjects[subject].slug + ".json");
  fs.writeFileSync(file, JSON.stringify(questions) + "\n", "utf8");
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos Adultos 02 — sueño y trastornos destructivos",
  audited: report.records.length,
  corrected: [...replacements.values()].filter((question) => question.v === "CORREGIDA").length,
  pending: [...replacements.values()].filter((question) => question.v === "REVISAR").length,
  sleep: sleepAfter.length,
  destructive: destructiveAfter.length,
  burnoutPending: burnoutAfter.length,
  total: allAfter.length,
  counts: Object.fromEntries(counts),
  preservedQuestionIds: true,
}, null, 2));
