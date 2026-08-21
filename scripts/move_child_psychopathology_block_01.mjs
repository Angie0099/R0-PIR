import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const sourcePath = path.join(bancoDir, "tratamientos_infantiles.json");
const targetPath = path.join(bancoDir, "psicopatologia_infantil.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const SOURCE = "Tratamientos Infantiles";
const TARGET = "Psicopatología Infantil";

// Preguntas de diagnóstico, curso, etiología o clínica infantil. Se trasladan
// sin declarar validada su redacción o clave: esa revisión documental es el
// siguiente paso de la auditoría.
const groups = {
  "Trastorno por déficit de atención con hiperactividad (TDAH)": [
    "Simu 11 comentado_074", "Simu 7 comentado _115", "SmCm22PIR2025 (1)_165", "SmCm27PIR2025 (1)_083",
    "Simu 13 comentado_081", "Simu 16 comentado_198", "SmCm11PIR2025_009", "SmCm24PIR2025 (1)_088",
    "Simu 11 comentado_073", "Simu 15 comentado_106", "Simu 7 comentado _084", "SmCm06PIR2025_189",
    "SmCm09PIR2025_167", "SmCm17PIR2025_065", "SmCm19PIR2024_196", "SmCm1PIR2024_027",
    "SmCm20PIR2024_003", "SmCm20PIR2025 (1)_104", "SmCm22PIR2025_058", "SmCm23PIR2025_099",
    "SmCm7PIR2024_133", "Simu 15 comentado_105", "SmCm12PIR2024 2_179", "SmCm23PIR2025_106",
  ],
  "Trastorno del espectro del autismo (TEA)": [
    "SmCm22PIR2025 (1)_166", "SmCm30PIR2025 (1)_156", "Simu 15 comentado_103", "Simu 7 comentado _114",
    "SmCm09PIR2025_165", "SmCm21PIR2025 (2)_075", "Simu 12 comentado_088", "Simu 13 comentado_008",
    "Simu 13 comentado_087", "Simu 6 comentado__098", "Simu 7 comentado _207", "SmCm13PIR2025_179",
    "SmCm14PIR2025_172", "SmCm14PIR2025_173", "SmCm16PIR2025_189", "SmCm17PIR2025_060",
    "SmCm17PIR2025_062", "SmCm19PIR2024_098", "SmCm1PIR2024_030", "SmCm1PIR2024_031",
    "SmCm20PIR2025 (1)_101", "SmCm21PIR2025 (2)_072", "SmCm22PIR2025_057", "SmCm22PIR2025_207",
    "SmCm27PIR2025 (1)_187", "Simu 12 comentado_087", "Simu 14 comentado _152", "SmCm13PIR2025_178",
    "Simu 14 comentado _151", "Simu 8 comentado _072", "SmCm06PIR2025_188", "SmCm08PIR2025_198",
    "SmCm17PIR2025_061", "SmCm19PIR2024_197",
  ],
  "Trastornos de la comunicación": [
    "Simu 15 comentado_107", "Simu 8 comentado _004", "Simu 16 comentado_194", "SmCm1PIR2024_169",
    "Simu 32 comentado hardcore 2_088", "SmCm17PIR2025_064", "SmCm19PIR2024_088", "SmCm1PIR2024_064",
    "SmCm27PIR2025 (1)_191", "SmCm30PIR2025 (1)_165",
  ],
};

const classifications = new Map();
for (const [topic, ids] of Object.entries(groups)) {
  for (const id of ids) {
    if (classifications.has(id)) throw new Error(`La pregunta ${id} tiene más de un destino.`);
    classifications.set(id, topic);
  }
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const totalBefore = source.length + target.length;
const allBefore = [...source, ...target];
const occurrences = new Map();
for (const question of allBefore) occurrences.set(question.id, (occurrences.get(question.id) || 0) + 1);
if ([...occurrences.values()].some((count) => count !== 1)) throw new Error("Hay identificadores duplicados entre los dos bloques infantiles.");

const missing = [...classifications.keys()].filter((id) => !occurrences.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const reclassified = allBefore
  .filter((question) => classifications.has(question.id))
  .map((question) => ({
    ...question,
    s: TARGET,
    t: [classifications.get(question.id)],
  }));
const finalSource = source.filter((question) => !classifications.has(question.id));
const finalTarget = [
  ...target.filter((question) => !classifications.has(question.id)),
  ...reclassified,
];

const totalAfter = finalSource.length + finalTarget.length;
const idsAfter = new Set([...finalSource, ...finalTarget].map((question) => question.id));
if (totalAfter !== totalBefore || idsAfter.size !== allBefore.length) {
  throw new Error("El traslado alteraría el total o los identificadores de las preguntas.");
}
if (finalTarget.some((question) => classifications.has(question.id) && (!question.s || !question.t?.[0]))) {
  throw new Error("Alguna pregunta trasladada no tiene asignatura o tema.");
}

manifest.subjects[SOURCE].count = finalSource.length;
manifest.subjects[TARGET].count = finalTarget.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(sourcePath, `${JSON.stringify(finalSource)}\n`, "utf8");
fs.writeFileSync(targetPath, `${JSON.stringify(finalTarget)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  block: "Psicopatología Infantil 01 — neurodesarrollo y comunicación",
  moved: reclassified.length,
  byTopic: Object.fromEntries(Object.entries(groups).map(([topic, ids]) => [topic, ids.length])),
  treatmentInfantQuestions: finalSource.length,
  childPsychopathologyQuestions: finalTarget.length,
  totalBankQuestions: manifest.total,
  preservedQuestionIds: true,
  note: "La ubicación está auditada; la validación de contenido y redacción se realiza en bloques posteriores.",
}, null, 2));
