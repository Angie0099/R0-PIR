import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const sourceBranch = "agent/revisar-introduccion-tratamientos";
const baseBranch = "origin/main";
const CHILD = "Psicopatología Infantil";
const ADULT = "Tratamientos Adultos";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);
const completedChildTopics = [
  "Discapacidad intelectual",
  "Trastorno obsesivo-compulsivo y relacionados infantojuveniles",
  "Trastornos de ansiedad infantojuveniles",
  "Trastornos específicos del aprendizaje y de la coordinación",
  "Trastornos relacionados con traumas y factores de estrés infantojuveniles",
];

const showFile = (branch, file) => execFileSync(
  "git",
  ["-C", appDir, "show", `${branch}:public/banco/${file}`],
  { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 },
);
const showBlob = (branch, file) => execFileSync(
  "git",
  ["-C", appDir, "cat-file", "blob", `${branch}:public/banco/${file}`],
  { maxBuffer: 50 * 1024 * 1024 },
);
const showJson = (file) => JSON.parse(showFile(sourceBranch, file));
const resetToBase = () => {
  const tracked = execFileSync(
    "git",
    ["-C", appDir, "ls-tree", "-r", "--name-only", baseBranch, "public/banco"],
    { encoding: "utf8" },
  ).trim().split(/\r?\n/).filter((file) => file.endsWith(".json"));
  for (const file of tracked) {
    const name = path.basename(file);
    fs.writeFileSync(path.join(bancoDir, name), showBlob(baseBranch, name));
  }
  console.log("Banco de publicación restaurado a la base remota actual.");
};
if (process.argv.includes("--reset")) {
  resetToBase();
  process.exit(0);
}
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
const writeJson = (file, value, pretty = false) => {
  const body = pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
  const next = body + "\n";
  const target = path.join(bancoDir, file);
  if (fs.readFileSync(target, "utf8") !== next) fs.writeFileSync(target, next, "utf8");
};

const sourceChild = showJson("psicopatologia_infantil.json");
const sourceAdult = showJson("tratamientos_adultos.json");
const selectedChild = sourceChild.filter((question) => completedChildTopics.includes(question.t?.[0]));
if (!selectedChild.length) throw new Error("No se encontraron temas infantiles completos en la rama de auditoría.");
if (selectedChild.some((question) => question.s !== CHILD || !reviewed.has(question.v))) {
  throw new Error("La selección infantil contiene una pregunta fuera de asignatura o sin revisión final.");
}
const selectedIds = new Set(selectedChild.map((question) => question.id));
if (selectedIds.size !== selectedChild.length) throw new Error("Hay identificadores duplicados entre los temas a publicar.");

// Introducción de Tratamientos Adultos ya está publicada en origin/main. Se
// verifica su identidad para no sobrescribir una edición posterior del usuario.
const baseAdult = readJson("tratamientos_adultos.json");
const sourceIntroduction = sourceAdult.filter((question) => question.t?.[0] === "Introducción");
const baseAdultById = new Map(baseAdult.map((question) => [question.id, question]));
const changedIntroduction = sourceIntroduction
  .filter((question) => JSON.stringify(question) !== JSON.stringify(baseAdultById.get(question.id)))
  .map((question) => question.id);
if (changedIntroduction.length) {
  throw new Error("La introducción ya publicada difiere de la auditoría: " + changedIntroduction.join(", "));
}

const manifest = readJson("manifest.json");
if (manifest.subjects[CHILD]) throw new Error("La asignatura infantil ya existe en esta base de publicación.");
const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json" && file !== "psicopatologia_infantil.json");
const collections = new Map(files.map((file) => [file, readJson(file)]));

// Cada pregunta que se publica cambia de ubicación, no se duplica ni se borra.
const baseOccurrences = new Map();
for (const [file, questions] of collections) {
  for (const question of questions) {
    if (!selectedIds.has(question.id)) continue;
    const entries = baseOccurrences.get(question.id) || [];
    entries.push(file);
    baseOccurrences.set(question.id, entries);
  }
}
const missingOrRepeated = [...selectedIds].filter((id) => (baseOccurrences.get(id) || []).length !== 1);
if (missingOrRepeated.length) {
  throw new Error("Las preguntas a mover no aparecen exactamente una vez en producción: " + missingOrRepeated.join(", "));
}

const changedCollections = new Set();
for (const [file, questions] of collections) {
  const filtered = questions.filter((question) => !selectedIds.has(question.id));
  if (filtered.length !== questions.length) {
    collections.set(file, filtered);
    changedCollections.add(file);
  }
}
collections.set("psicopatologia_infantil.json", selectedChild);

const allAfter = [...collections.values()].flat();
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== manifest.total) {
  throw new Error("La publicación alteraría el total de preguntas o los identificadores.");
}

const childMetadata = {
  slug: "psicopatologia_infantil",
  count: selectedChild.length,
  topics: completedChildTopics,
};
const orderedSubjects = {};
for (const [name, details] of Object.entries(manifest.subjects)) {
  orderedSubjects[name] = details;
  if (name === "Psicología Clínica") orderedSubjects[CHILD] = childMetadata;
}
manifest.subjects = orderedSubjects;

const countsBySubject = new Map();
for (const question of allAfter) countsBySubject.set(question.s, (countsBySubject.get(question.s) || 0) + 1);
for (const [name, details] of Object.entries(manifest.subjects)) {
  const count = countsBySubject.get(name);
  if (count === undefined) throw new Error("Faltan preguntas para la asignatura " + name + ".");
  details.count = count;
}
manifest.total = [...countsBySubject.values()].reduce((sum, count) => sum + count, 0);
if (manifest.total !== allAfter.length) throw new Error("El manifiesto no coincide con el banco publicado.");

for (const file of changedCollections) writeJson(file, collections.get(file));
writeJson("psicopatologia_infantil.json", selectedChild);
writeJson("manifest.json", manifest, true);

console.log(JSON.stringify({
  release: "Temas completos 01",
  alreadyPublishedAdultIntroduction: sourceIntroduction.length,
  publishedChildTopics: completedChildTopics,
  publishedChildQuestions: selectedChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
