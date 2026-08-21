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

// Ubicación auditada con el DSM-5-TR. Esta operación solo cambia la materia
// y el tema: la clave, la redacción y la justificación se revisan después de
// contrastar cada pregunta con su manual original.
const groups = {
  "Introducción a la psicopatología infantil": [
    "Simu 13 comentado_082",
  ],
  "Trastornos de ansiedad infantojuveniles": [
    "SIM_PERS_AGO25_105", "Simu 14 comentado _157", "Simu 15 comentado_099", "Simu 16 comentado_196",
    "Simu 6 comentado__099", "Simu 8 comentado _075", "Simu 8 comentado _076", "SmCm06PIR2025_192",
    "SmCm09PIR2025_070", "SmCm10PIR2025_090", "SmCm10PIR2025_143", "SmCm10PIR2025_188",
    "SmCm10PIR2025_192", "SmCm11PIR2025_061", "SmCm16PIR2025_197", "SmCm19PIR2024_194",
    "SmCm19PIR2024_195", "SmCm1PIR2024_081", "SmCm20PIR2024_013", "SmCm23PIR2025_109",
    "SmCm27PIR2025 (1)_202",
  ],
  "Trastornos depresivos y bipolares infantojuveniles": [
    "SmCm15PIR2025_075", "SmCm16PIR2025_191", "SmCm19PIR2024_191", "SmCm24PIR2025 (1)_181",
    "SmCm30PIR2025 (1)_159",
  ],
  "Trastornos relacionados con traumas y factores de estrés infantojuveniles": [
    "Simu 11 comentado_086", "Simu 13 comentado_084", "Simu 32 comentado hardcore 2_090", "Simu 7 comentado _117",
    "SmCm08PIR2025_197", "SmCm19PIR2024_189", "SmCm19PIR2024_190", "SmCm23PIR2025 (2)_089",
    "SmCm27PIR2025 (1)_188", "SmCm30PIR2025 (1)_063",
  ],
  "Trastorno obsesivo-compulsivo y relacionados infantojuveniles": [
    "Simu 7 comentado _112", "SmCm10PIR2025_045",
  ],
  "Trastornos por tics infantojuveniles": [
    "simu 9 comentado_112", "SmCm06PIR2025_190", "SmCm15PIR2025_005", "SmCm18PIR2025_083",
    "SmCm23PIR2025_098", "SmCm27PIR2025 (1)_184",
  ],
  "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles": [
    "Simu 11 comentado_007", "Simu 7 comentado _120", "simu 9 comentado_109", "SmCm09PIR2025_069",
    "SmCm12PIR2024 2_182", "SmCm15PIR2025_172", "SmCm18PIR2025_084", "SmCm18PIR2025_085",
    "SmCm1PIR2024_144", "SmCm20PIR2025 (1)_100", "SmCm21PIR2025 (2)_076", "SmCm22PIR2025 (1)_164",
    "SmCm30PIR2025 (1)_160", "SmCm7PIR2024_136",
  ],
  "Trastornos del sueño-vigilia infantojuveniles": [
    "Simu 13 comentado_077", "Simu 13 comentado_086", "Simu 16 comentado_090", "SmCm14PIR2025_041",
    "SmCm1PIR2024_145", "SmCm20PIR2024_012",
  ],
  "Trastornos de eliminación infantojuveniles": [
    "Simu 14 comentado _160", "Simu 16 comentado_093", "Simu 7 comentado _116", "SmCm14PIR2025_039",
    "SmCm15PIR2025_174", "SmCm16PIR2025_187", "SmCm27PIR2025 (1)_186", "SmCm30PIR2025 (1)_067",
  ],
  "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles": [
    "Simu 12 comentado_090", "Simu 31 comentado Hardcore 1_183", "SmCm12PIR2024 2_184", "SmCm14PIR2025_203",
    "Simu 16 comentado_197", "SmCm16PIR2025_193", "SmCm24PIR2025 (1)_184",
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
const allBefore = [...source, ...target];
const totalBefore = allBefore.length;
const occurrences = new Map();
for (const question of allBefore) occurrences.set(question.id, (occurrences.get(question.id) || 0) + 1);
if ([...occurrences.values()].some((count) => count !== 1)) {
  throw new Error("Hay identificadores duplicados entre los dos bloques infantiles.");
}

const missing = [...classifications.keys()].filter((id) => !occurrences.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const moved = allBefore
  .filter((question) => classifications.has(question.id))
  .map((question) => ({
    ...question,
    s: TARGET,
    t: [classifications.get(question.id)],
  }));
const finalSource = source.filter((question) => !classifications.has(question.id));
const finalTarget = [
  ...target.filter((question) => !classifications.has(question.id)),
  ...moved,
];

const idsAfter = new Set([...finalSource, ...finalTarget].map((question) => question.id));
if (finalSource.length + finalTarget.length !== totalBefore || idsAfter.size !== totalBefore) {
  throw new Error("El traslado alteraría el total o los identificadores de las preguntas.");
}
for (const question of moved) {
  if (question.s !== TARGET || !question.t?.[0]) {
    throw new Error(`No se aplicó la ubicación de ${question.id}.`);
  }
}

const topics = manifest.subjects[TARGET].topics;
if (!topics.includes("Trastornos por tics infantojuveniles")) {
  const after = topics.indexOf("Trastorno del espectro del autismo (TEA)");
  topics.splice(after + 1, 0, "Trastornos por tics infantojuveniles");
}
manifest.subjects[SOURCE].count = finalSource.length;
manifest.subjects[TARGET].count = finalTarget.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(sourcePath, `${JSON.stringify(finalSource)}\n`, "utf8");
fs.writeFileSync(targetPath, `${JSON.stringify(finalTarget)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  block: "Psicopatología Infantil 02 — psicopatología infantil por temas DSM-5-TR",
  moved: moved.length,
  byTopic: Object.fromEntries(Object.entries(groups).map(([topic, ids]) => [topic, ids.length])),
  treatmentInfantQuestions: finalSource.length,
  childPsychopathologyQuestions: finalTarget.length,
  totalBankQuestions: manifest.total,
  preservedQuestionIds: true,
  note: "La ubicación está auditada; la validación de contenido y redacción se realiza en bloques posteriores.",
}, null, 2));
