import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportsDir = path.join(appDir, "analysis", "audit_reports");
const manifestPath = path.join(bancoDir, "manifest.json");

const CLINICAL = "Psicología Clínica";
const DESTRUCTIVE = "Trastornos destructivos, del control de los impulsos y de la conducta";
const SUICIDE = "Conducta suicida y autolesión";
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
const report = read(path.join(reportsDir, "clinica_adulta_ca02_destructivos_suicida.json"));
const dataBySubject = new Map();
for (const [subject, details] of Object.entries(manifest.subjects)) {
  dataBySubject.set(subject, read(path.join(bancoDir, `${details.slug}.json`)));
}
const allCurrent = [...dataBySubject.values()].flat();
const currentById = new Map(allCurrent.map((question) => [question.id, question]));
if (currentById.size !== allCurrent.length) throw new Error("El banco contiene IDs duplicados antes de aplicar el bloque.");

const topicExists = (target) => Boolean(target?.s && target?.t?.[0] && manifest.subjects[target.s]?.topics.includes(target.t[0]));
const sourceQuestions = dataBySubject.get(CLINICAL).filter((question) => [DESTRUCTIVE, SUICIDE].includes(question.t?.[0]));
if (sourceQuestions.length !== 122 || new Set(sourceQuestions.map((question) => question.id)).size !== 122) {
  throw new Error("El bloque CA-02 no coincide con las 122 preguntas fuente actuales.");
}

const assertCorrected = (question) => {
  if (!clean(question.e) || !["a", "b", "c", "d"].includes(question.c) || !clean(question.x) || !clean(question.r)) {
    throw new Error(`Payload corregido incompleto: ${question.id}`);
  }
  for (const option of ["a", "b", "c", "d"]) if (!clean(question.o?.[option])) throw new Error(`Opción vacía: ${question.id}.${option}`);
  if (/respuesta correcta\s*[:\-]|justificaci[oó]n\s*[:\-]|tkbfat|persever\s*\|/i.test(JSON.stringify(question.o))) {
    throw new Error(`Contaminación en alternativas: ${question.id}`);
  }
};

const replacements = new Map();
const sourceExpected = (id) => {
  const original = currentById.get(id);
  if (!original || original.s !== CLINICAL || ![DESTRUCTIVE, SUICIDE].includes(original.t?.[0])) {
    throw new Error(`El ID ${id} no está en los temas fuente esperados.`);
  }
  return original;
};
const addReview = (id, target, reason) => {
  const original = sourceExpected(id);
  const destination = topicExists(target) ? target : { s: CLINICAL, t: original.t };
  if (replacements.has(id)) throw new Error(`ID duplicado en informe: ${id}`);
  replacements.set(id, {
    ...original,
    s: destination.s,
    t: [...destination.t],
    x: `${pendingPrefix} Motivo: ${clean(reason)}`,
    r: "",
    v: "REVISAR",
  });
};

for (const item of report.safe_for_application) {
  const original = sourceExpected(item.id);
  if (!topicExists(item.destination)) throw new Error(`Destino inexistente para pregunta segura: ${item.id}`);
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
for (const item of report.holds) addReview(item.id, item.destination, item.reason);
for (const group of report.relocation_map) {
  for (const id of group.ids) addReview(id, group.destination, group.reason);
}
if (replacements.size !== 122) throw new Error(`Cobertura incompleta: ${replacements.size}/122.`);

const finalBySubject = new Map();
for (const [subject, questions] of dataBySubject) finalBySubject.set(subject, questions.filter((question) => !replacements.has(question.id)));
for (const replacement of replacements.values()) finalBySubject.get(replacement.s).push(replacement);

for (const [subject, questions] of finalBySubject) {
  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados tras el bloque en ${subject}.`);
}
const allAfter = [...finalBySubject.values()].flat();
if (allAfter.length !== manifest.total || new Set(allAfter.map((question) => question.id)).size !== allAfter.length) {
  throw new Error("El bloque alteraría el total de preguntas o sus IDs.");
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

const clinicalAfter = finalBySubject.get(CLINICAL);
console.log(JSON.stringify({
  block: "Psicología Clínica adulta — Conducta/impulsos y conducta suicida/autolesión",
  corrected: corrected.length,
  validatedOriginal: validated.length,
  pending: pending.length,
  destructiveNow: clinicalAfter.filter((question) => question.t?.[0] === DESTRUCTIVE).length,
  suicideNow: clinicalAfter.filter((question) => question.t?.[0] === SUICIDE).length,
  total: allAfter.length,
  uniqueIds: new Set(allAfter.map((question) => question.id)).size,
}, null, 2));
