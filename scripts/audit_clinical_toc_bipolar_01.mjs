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
const pendingNote = "Pendiente de auditoría con fuente original en su tema correcto. La pregunta se ha reubicado para evitar una clasificación incorrecta; su enunciado, clave y justificación todavía no se han validado.";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data) + "\n", "utf8");
const clean = (value) => String(value ?? "")
  .normalize("NFC")
  .replace(/\u00ad/g, "")
  .replace(/[‐‑]/g, "-")
  .replace(/\s+/g, " ")
  .trim();
const cleanOptions = (options) => Object.fromEntries(["a", "b", "c", "d"].map((key) => [key, clean(options?.[key])]));

const manifest = read(manifestPath);
const clinicalPath = path.join(bancoDir, manifest.subjects[CLINICAL].slug + ".json");
const clinical = read(clinicalPath);
const tocReport = read(path.join(reportsDir, "toc_adulto.json"));
const tocQc = read(path.join(reportsDir, "toc_adulto_qc.json"));
const bipolarReport = read(path.join(reportsDir, "bipolares_adultos.json"));
const bipolarQc = read(path.join(reportsDir, "bipolares_adultos_qc.json"));

const tocEntries = tocReport.batches.flatMap((batch) => batch.entries);
const bipolarEntries = Object.values(bipolarReport.records_by_batch).flat();
const tocById = new Map(tocEntries.map((entry) => [entry.id, entry]));
const bipolarById = new Map(bipolarEntries.map((entry) => [entry.id, entry]));
const tocSource = clinical.filter((question) => question.t?.[0] === TOC);
const bipolarSource = clinical.filter((question) => question.t?.[0] === BIPOLAR);
const sourceById = new Map([...tocSource, ...bipolarSource].map((question) => [question.id, question]));

if (tocSource.length !== 271 || bipolarSource.length !== 240 || tocEntries.length !== 271 || bipolarEntries.length !== 240) {
  throw new Error("El inventario de TOC/Bipolar no coincide con los informes cerrados.");
}
if (new Set(tocEntries.map((entry) => entry.id)).size !== 271 || new Set(bipolarEntries.map((entry) => entry.id)).size !== 240) {
  throw new Error("Hay IDs duplicados en los informes clínicos.");
}
for (const id of [...tocById.keys(), ...bipolarById.keys()]) if (!sourceById.has(id)) throw new Error(`ID de informe ausente en banco: ${id}`);

const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, details.slug + ".json")));
}

const topicExists = (subject, topic) => Boolean(manifest.subjects[subject]?.topics.includes(topic));
const targetFrom = (value) => {
  const parts = String(value || "").split(" > ");
  if (parts.length !== 2 || !topicExists(parts[0], parts[1])) return null;
  return { subject: parts[0], topic: parts[1] };
};

const tocAliasReference = (reference) => {
  let value = clean(reference);
  for (const [alias, full] of Object.entries(tocReport.source_legend).sort((a, b) => b[0].length - a[0].length)) {
    value = value.split(alias).join(full);
  }
  return clean(value.replace(/;\s*;/g, ";"));
};

const assertFull = (id, question) => {
  if (!clean(question.e) || !["a", "b", "c", "d"].includes(question.c) || !clean(question.x) || !clean(question.r)) {
    throw new Error(`Payload auditado incompleto: ${id}`);
  }
  for (const key of ["a", "b", "c", "d"]) if (!clean(question.o?.[key])) throw new Error(`Opción vacía en ${id}: ${key}`);
};

const fullReplacement = (original, target, fields, reference = fields.reference ?? fields.R) => {
  const question = {
    ...original,
    s: target.subject,
    t: [target.topic],
    e: clean(fields.question ?? fields.E),
    o: cleanOptions(fields.options ?? fields.O),
    c: clean(fields.correct_option ?? fields.C),
    x: clean(fields.justification ?? fields.X),
    r: clean(reference),
    v: "CORREGIDA",
  };
  assertFull(original.id, question);
  return question;
};
const pendingReplacement = (original, target) => ({
  ...original,
  ...(target ? { s: target.subject, t: [target.topic] } : {}),
  x: pendingNote,
  r: "",
  v: "REVISAR",
});

const replacements = new Map();
const tocSafe = new Map(tocQc.safe_records_to_apply.map((entry) => [entry.id, entry]));
for (const [id, qc] of tocSafe) {
  const target = targetFrom(qc.target);
  const entry = tocById.get(id);
  if (!target || !entry) throw new Error(`Registro TOC seguro sin destino exacto: ${id}`);
  replacements.set(id, fullReplacement(sourceById.get(id), target, entry, tocAliasReference(entry.reference)));
}

// La única incidencia TOC con una corrección editorial cerrada de la referencia.
const tocMinorReference = tocQc.safe_after_minor_reference_repair.find((entry) => entry.id === "MAYO2_055");
if (!tocMinorReference) throw new Error("Falta la incidencia editorial MAYO2_055 en el QC TOC.");
const mayo2055 = tocById.get("MAYO2_055");
replacements.set("MAYO2_055", fullReplacement(
  sourceById.get("MAYO2_055"),
  targetFrom(tocMinorReference.target),
  mayo2055,
  "OMS. CIE-11, navegador oficial: clasificación de trastornos mentales, trastornos del sueño-vigilia, condiciones relativas a la salud sexual y reacción aguda al estrés."
));

const tocOutOfScope = new Map((tocQc.status_reclassification_required.out_of_scope_to_REVISAR || [])
  .filter((entry) => entry.target)
  .map((entry) => [entry.id, entry.target]));
const tocPendingTarget = (entry) => {
  if (tocOutOfScope.has(entry.id)) return targetFrom(tocOutOfScope.get(entry.id));
  const normalized = tocQc.destination_normalization?.[entry.destination]?.normalized;
  return targetFrom(normalized);
};
for (const entry of tocEntries) {
  if (replacements.has(entry.id)) continue;
  replacements.set(entry.id, pendingReplacement(sourceById.get(entry.id), tocPendingTarget(entry)));
}

const bipolarSafe = new Set(bipolarQc.safe_for_publication_after_mechanical_normalization.ids);
for (const id of bipolarSafe) {
  const entry = bipolarById.get(id);
  const target = targetFrom(entry?.destination);
  if (!entry || !target) throw new Error(`Registro bipolar seguro sin destino exacto: ${id}`);
  replacements.set(id, fullReplacement(sourceById.get(id), target, entry));
}

// El QC resolvió estas contradicciones con una propuesta completa, referenciada y inequívoca.
const bipolarBlockerCorrections = new Set([
  "DICIEMBRE-DOS-24_COMENTADO_044",
  "JUNIO-UNO-24_COMENTADO_072",
  "SM_JUNIO_2_SOL_1_051",
  "SmCm12PIR2024 2_024",
]);
for (const blocker of bipolarQc.blockers_by_id) {
  if (!bipolarBlockerCorrections.has(blocker.id)) continue;
  const proposed = blocker.proposed_exact_correction;
  const entry = bipolarById.get(blocker.id);
  const target = targetFrom(proposed.destination) || targetFrom(entry.destination) || { subject: CLINICAL, topic: BIPOLAR };
  replacements.set(blocker.id, fullReplacement(sourceById.get(blocker.id), target, proposed));
}

const bipolarResolvedTargets = new Map();
const genericDestinations = bipolarQc.reclassifications.nonexistent_or_generic_destinations_requiring_exact_resolution;
for (const group of Object.values(genericDestinations)) {
  for (const [target, ids] of Object.entries(group.exact_destinations || {})) {
    for (const id of ids) bipolarResolvedTargets.set(id, target);
  }
  for (const [id, target] of Object.entries(group.resolution || {})) bipolarResolvedTargets.set(id, target);
}
// El banco existente ya contiene el trastorno de juego en el bloque de adicciones; se revisará y renombrará ese tema en su propia auditoría.
bipolarResolvedTargets.set("JULIO1_099", "Psicología Clínica > Trastornos adictivos con sustancia");

const bipolarPendingTarget = (entry) => targetFrom(entry.destination) || targetFrom(bipolarResolvedTargets.get(entry.id));
for (const entry of bipolarEntries) {
  if (replacements.has(entry.id)) continue;
  replacements.set(entry.id, pendingReplacement(sourceById.get(entry.id), bipolarPendingTarget(entry)));
}

if (replacements.size !== 511) throw new Error(`El bloque no cubre las 511 preguntas: ${replacements.size}.`);

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) finalBySubject.set(subject, [...questions]);
finalBySubject.set(CLINICAL, clinical.filter((question) => !replacements.has(question.id)));
for (const question of replacements.values()) finalBySubject.get(question.s).push(question);

for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados en ${subject}.`);
}
const allAfter = [...finalBySubject.values()].flat();
const allIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== manifest.total || allIds.size !== allAfter.length) {
  throw new Error("La auditoría alteraría el total de preguntas o sus identificadores.");
}
for (const id of replacements.keys()) if (!allIds.has(id)) throw new Error(`Falta una pregunta reubicada: ${id}`);

const corrected = [...replacements.values()].filter((question) => question.v === "CORREGIDA");
const pending = [...replacements.values()].filter((question) => question.v === "REVISAR");
for (const question of corrected) {
  if (!question.x || !question.r || !["a", "b", "c", "d"].includes(question.c)) throw new Error(`Pregunta corregida no publicable: ${question.id}`);
  if (/tkbfat|respuesta correcta:\s*\d|persever\s*\|/i.test(JSON.stringify(question.o))) throw new Error(`Contaminación OCR en opciones corregidas: ${question.id}`);
}
for (const question of pending) {
  if (question.x !== pendingNote || question.r !== "") throw new Error(`Pendiente mal marcada: ${question.id}`);
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;

for (const [subject, questions] of finalBySubject) {
  write(path.join(bancoDir, manifest.subjects[subject].slug + ".json"), questions);
}
write(manifestPath, manifest);

const countTopic = (topic) => finalBySubject.get(CLINICAL).filter((question) => question.t?.[0] === topic).length;
console.log(JSON.stringify({
  block: "Psicología Clínica adulta 01 — TOC y trastornos bipolares",
  audited: replacements.size,
  corrected: corrected.length,
  pending: pending.length,
  tocCorrected: [...tocById.keys()].filter((id) => replacements.get(id).v === "CORREGIDA").length,
  bipolarCorrected: [...bipolarById.keys()].filter((id) => replacements.get(id).v === "CORREGIDA").length,
  tocRemaining: countTopic(TOC),
  bipolarRemaining: countTopic(BIPOLAR),
  total: allAfter.length,
  counts: Object.fromEntries(counts),
  preservedQuestionIds: true,
}, null, 2));
