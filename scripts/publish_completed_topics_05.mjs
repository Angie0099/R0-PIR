import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const sourceBranch = "agent/revisar-introduccion-tratamientos";
const CHILD = "Psicopatología Infantil";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);
const completedTopics = [
  "Trastornos de eliminación infantojuveniles",
  "Trastorno por déficit de atención con hiperactividad (TDAH)",
];

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
const writeJson = (file, value, pretty = false) => {
  const next = (pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value)) + "\n";
  const target = path.join(bancoDir, file);
  if (fs.readFileSync(target, "utf8") !== next) fs.writeFileSync(target, next, "utf8");
};

const sourceChild = JSON.parse(execFileSync(
  "git",
  ["-C", appDir, "show", `${sourceBranch}:public/banco/psicopatologia_infantil.json`],
  { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 },
));
const manifest = readJson("manifest.json");
const baseChild = readJson("psicopatologia_infantil.json");
if (!manifest.subjects[CHILD]) throw new Error("La publicación infantil previa no está presente.");
if (!baseChild.every((question) => reviewed.has(question.v))) {
  throw new Error("La publicación infantil previa contiene preguntas no revisadas.");
}

const selected = sourceChild.filter((question) => completedTopics.includes(question.t?.[0]));
if (!selected.length || selected.some((question) => question.s !== CHILD || !reviewed.has(question.v))) {
  throw new Error("La selección contiene preguntas fuera de la asignatura o sin revisión final.");
}
const selectedIds = new Set(selected.map((question) => question.id));
const existingIds = new Set(baseChild.map((question) => question.id));
if (selectedIds.size !== selected.length || [...selectedIds].some((id) => existingIds.has(id))) {
  throw new Error("Hay identificadores repetidos en la publicación incremental.");
}

const files = fs.readdirSync(bancoDir)
  .filter((file) => file.endsWith(".json") && file !== "manifest.json" && file !== "psicopatologia_infantil.json");
const collections = new Map(files.map((file) => [file, readJson(file)]));
const locations = new Map();
for (const [file, questions] of collections) {
  for (const question of questions) {
    if (!selectedIds.has(question.id)) continue;
    const hits = locations.get(question.id) || [];
    hits.push(file);
    locations.set(question.id, hits);
  }
}
const invalidLocations = [...selectedIds].filter((id) => (locations.get(id) || []).length !== 1);
if (invalidLocations.length) {
  throw new Error("Las preguntas a mover no aparecen exactamente una vez: " + invalidLocations.join(", "));
}

const changedCollections = new Set();
for (const [file, questions] of collections) {
  const filtered = questions.filter((question) => !selectedIds.has(question.id));
  if (filtered.length !== questions.length) {
    collections.set(file, filtered);
    changedCollections.add(file);
  }
}
const finalChild = [...baseChild, ...selected];
const allAfter = [...collections.values()].flat().concat(finalChild);
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== manifest.total) {
  throw new Error("La publicación alteraría el total de preguntas o los identificadores.");
}

const topics = manifest.subjects[CHILD].topics;
if (completedTopics.some((topic) => topics.includes(topic))) throw new Error("Un tema ya está publicado.");
manifest.subjects[CHILD].topics = [...topics, ...completedTopics];
const countsBySubject = new Map();
for (const question of allAfter) countsBySubject.set(question.s, (countsBySubject.get(question.s) || 0) + 1);
for (const [name, details] of Object.entries(manifest.subjects)) {
  const count = countsBySubject.get(name);
  if (count === undefined) throw new Error("Faltan preguntas para la asignatura " + name + ".");
  details.count = count;
}
manifest.total = [...countsBySubject.values()].reduce((sum, count) => sum + count, 0);

for (const file of changedCollections) writeJson(file, collections.get(file));
writeJson("psicopatologia_infantil.json", finalChild);
writeJson("manifest.json", manifest, true);

console.log(JSON.stringify({
  release: "Temas completos 05",
  publishedTopics: completedTopics,
  publishedQuestions: selected.length,
  infantPsychopathologyTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
