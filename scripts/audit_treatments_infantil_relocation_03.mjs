import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const adultPath = path.join(bancoDir, "tratamientos_adultos.json");
const childPath = path.join(bancoDir, "tratamientos_infantiles.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const ADULT = "Tratamientos Adultos";
const CHILD = "Tratamientos Infantiles";

// Reubicación temática, no validación de contenido. Cada ítem mantiene íntegros
// enunciado, opciones, clave, justificación, fuente y estado de revisión que ya tenía.
// Son preguntas cuyo propio enunciado las identifica inequívocamente como infantojuveniles.
const relocations = {
  PERSEV_JUL25_D2_087: "Trastornos depresivos y bipolares infantojuvenil",
  PERSEV_JUL25_D2_088: "Trastorno del Espectro Autista",
  PERSEV_JUL25_D2_090: "Otros problemas infantojuveniles",
  PERSEV_JUL25_D2_091: "Introducción a la psicología clínica infantil",
  PERSEV_JUL25_D2_092: "Trastornos de excreción infantojuvenil",
  PERSEV_JUL25_D2_095: "TDAH",
  PERSEV_JUL25_D2_096: "Trastornos de la comunicación",
  PERSEV_JUL25_D2_098: "Trastornos alimentarios infantojuvenil",
  PERSEV_AGO25_U1_131: "Trastornos de la comunicación",
  PERSEV_AGO25_U1_132: "Trastornos de ansiedad infantojuvenil",
  PERSEV_AGO25_U1_135: "Trastorno del Espectro Autista",
  PERSEV_AGO25_U1_136: "Trastornos de ansiedad infantojuvenil",
  PERSEV_AGO25_U1_137: "Trastorno del Espectro Autista",
  PERSEV_AGO25_U1_138: "Trastornos del sueño infantojuvenil",
  PERSEV_AGO25_U1_139: "Trastornos de conducta infantojuvenil",
  PERSEV_AGO25_U1_140: "Trastornos de ansiedad infantojuvenil",
  PERSEV_AGO25_U1_141: "Introducción a la psicología clínica infantil",
  JULIO1_131: "Trastornos de conducta infantojuvenil",
  JULIO1_138: "Trastornos de ansiedad infantojuvenil",
  JULIO1_141: "Discapacidad intelectual",
  JULIO1_207: "Trastornos de la comunicación",
};

const adult = JSON.parse(fs.readFileSync(adultPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const topics = new Set(manifest.subjects[CHILD].topics);
const adultById = new Map(adult.map((question) => [question.id, question]));
const childIds = new Set(child.map((question) => question.id));

const missing = Object.keys(relocations).filter((id) => !adultById.has(id));
if (missing.length) throw new Error("No se encontraron en Tratamientos Adultos: " + missing.join(", "));
const alreadyInChild = Object.keys(relocations).filter((id) => childIds.has(id));
if (alreadyInChild.length) throw new Error("Ya existen en Tratamientos Infantiles: " + alreadyInChild.join(", "));

for (const [id, topic] of Object.entries(relocations)) {
  const question = adultById.get(id);
  if (question.s !== ADULT) throw new Error("La asignatura previa no coincide en " + id + ".");
  if (!topics.has(topic)) throw new Error("El tema destino no existe: " + topic);
}

const moved = adult
  .filter((question) => Object.hasOwn(relocations, question.id))
  .map((question) => ({ ...question, s: CHILD, t: [relocations[question.id]] }));
const finalAdult = adult.filter((question) => !Object.hasOwn(relocations, question.id));
const finalChild = [...child, ...moved];

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "tratamientos_adultos.json") return finalAdult;
  if (file === "tratamientos_infantiles.json") return finalChild;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La reubicación alteraría el total o los identificadores.");
}
for (const [id, topic] of Object.entries(relocations)) {
  const result = finalChild.find((question) => question.id === id);
  if (!result || result.s !== CHILD || result.t[0] !== topic) {
    throw new Error("No se reubicó correctamente " + id + ".");
  }
}

manifest.subjects[ADULT].count = finalAdult.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== allAfter.length) throw new Error("El manifiesto no coincide con el banco.");

fs.writeFileSync(adultPath, JSON.stringify(finalAdult) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos 03 — reubicación infantojuvenil",
  relocated: moved.length,
  contentValidatedInThisBlock: 0,
  adultTreatmentTotal: finalAdult.length,
  childTreatmentTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
