import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CLINICAL = "Psicología Clínica";
const CHILD = "Psicopatología Infantil";

// Reubicaciones inequívocas por contenido. No cambian clave, opciones ni
// estado de validación: la revisión documental de cada enunciado continúa
// en bloques posteriores.
const clinicalTopics = {
  AGOSTO2_050: "Trastornos destructivos, del control de los impulsos y de la conducta",
  JUNIO1_083: "Trastornos destructivos, del control de los impulsos y de la conducta",
  "DICIEMBRE-UNO-24_COMENTADO_139": "Trastornos destructivos, del control de los impulsos y de la conducta",
  "MAYO-DOS-24_COMENTADO_148": "Trastornos destructivos, del control de los impulsos y de la conducta",
  "OCTUBRE-UNO-24_COMENTADO_045": "Trastornos destructivos, del control de los impulsos y de la conducta",
  MAYO2_063: "Trastorno obsesivo-compulsivo y relacionados",
  "DICIEMBRE-DOS-24_COMENTADO_026": "Trastorno obsesivo-compulsivo y relacionados",
  "JUNIO-UNO-24_COMENTADO_072": "Trastorno obsesivo-compulsivo y relacionados",
  "OCTUBRE-UNO-24_COMENTADO_040": "Trastorno obsesivo-compulsivo y relacionados",
  "Simu 6 comentado__062": "Trastorno obsesivo-compulsivo y relacionados",
  JULIO1_099: "Trastornos adictivos con sustancia",
  JUNIO1_107: "Sistemas clasificatorios en psicopatología",
  MAYO2_049: "Sistemas clasificatorios en psicopatología",
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_049": "Trastornos de la personalidad",
  "Simu 11 comentado_060": "Psicopatología de la afectividad",
  "Simu 6 comentado__006": "Trastornos de la personalidad",
  "SmCm12PIR2024 2_047": "Trastornos destructivos, del control de los impulsos y de la conducta",
  SmCm18PIR2025_054: "Trastornos parafílicos",
  "SmCm21PIR2025 (2)_031": "Trastornos de ansiedad",
  "Simu 15 comentado_042": "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos",
  "Simu 15 comentado_047": "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos",
  SmCm15PIR2025_053: "Trastornos neurocognitivos",
  SmCm20PIR2024_048: "Trastornos neurocognitivos",
  SmCm26PIR2025_113: "Trastornos bipolares y relacionados",
  "SmCm27PIR2025 (1)_120": "Trastornos de la personalidad",
};

const childTopics = {
  PERSEV_AGO25_U1_072: "Introducción a la psicopatología infantil",
  "Simu 14 comentado _032": "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles",
  SmCm29PIR2025_096: "Trastorno por déficit de atención con hiperactividad (TDAH)",
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...clinical, ...child];
const occurrences = new Map();
for (const question of allBefore) occurrences.set(question.id, (occurrences.get(question.id) || 0) + 1);
if ([...occurrences.values()].some((count) => count !== 1)) throw new Error("Hay identificadores duplicados entre Clínica e Infantil.");

const wanted = [...Object.keys(clinicalTopics), ...Object.keys(childTopics)];
const missing = wanted.filter((id) => !occurrences.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const finalClinical = clinical
  .filter((question) => !Object.hasOwn(childTopics, question.id))
  .map((question) => clinicalTopics[question.id] ? {
    ...question,
    s: CLINICAL,
    t: [clinicalTopics[question.id]],
  } : question);

const movedToChild = allBefore
  .filter((question) => Object.hasOwn(childTopics, question.id))
  .map((question) => ({
    ...question,
    s: CHILD,
    t: [childTopics[question.id]],
  }));
const finalChild = [
  ...child.filter((question) => !Object.hasOwn(childTopics, question.id)),
  ...movedToChild,
];

const allAfter = [...finalClinical, ...finalChild];
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length) {
  throw new Error("La reubicación alteraría el total o los identificadores de preguntas.");
}
for (const [id, topic] of Object.entries(clinicalTopics)) {
  const question = finalClinical.find((candidate) => candidate.id === id);
  if (!question || question.s !== CLINICAL || question.t[0] !== topic) throw new Error(`No se aplicó la ubicación de ${id}.`);
}
for (const [id, topic] of Object.entries(childTopics)) {
  const question = finalChild.find((candidate) => candidate.id === id);
  if (!question || question.s !== CHILD || question.t[0] !== topic) throw new Error(`No se aplicó la ubicación de ${id}.`);
}

manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(clinicalPath, `${JSON.stringify(finalClinical)}\n`, "utf8");
fs.writeFileSync(childPath, `${JSON.stringify(finalChild)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Clínica 04 — reubicaciones temáticas inequívocas",
  reclassifiedWithinClinical: Object.keys(clinicalTopics).length,
  movedToChildPsychopathology: Object.keys(childTopics).length,
  clinicalQuestions: finalClinical.length,
  childPsychopathologyQuestions: finalChild.length,
  preservedQuestionIds: true,
  note: "Las claves y la redacción se mantienen pendientes de validación documental individual cuando aún no constaban como revisadas.",
}, null, 2));
