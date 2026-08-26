import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bancoDir = path.join(repoRoot, "public", "banco");

const SOURCE_SUBJECT = "Tratamientos Adultos";
const TARGET_SUBJECT = "Psicoterapias";
const INTRODUCTION = "Introducción";

const readJson = (fileName) =>
  JSON.parse(fs.readFileSync(path.join(bancoDir, fileName), "utf8"));
const writeBank = (fileName, value) =>
  fs.writeFileSync(path.join(bancoDir, fileName), `${JSON.stringify(value)}\n`, "utf8");
const writeManifest = (value) =>
  fs.writeFileSync(
    path.join(bancoDir, "manifest.json"),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );

const hasTopic = (question, topic) =>
  Array.isArray(question.t) && question.t.includes(topic);
const withoutPlacement = (question) => {
  const copy = { ...question };
  delete copy.s;
  delete copy.t;
  return copy;
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const manifest = readJson("manifest.json");
const sourceFile = `${manifest.subjects[SOURCE_SUBJECT]?.slug}.json`;
const targetFile = `${manifest.subjects[TARGET_SUBJECT]?.slug}.json`;

assert(manifest.subjects[SOURCE_SUBJECT], `No existe la asignatura ${SOURCE_SUBJECT}.`);
assert(manifest.subjects[TARGET_SUBJECT], `No existe la asignatura ${TARGET_SUBJECT}.`);

const sourceQuestions = readJson(sourceFile);
const targetQuestions = readJson(targetFile);
assert(Array.isArray(sourceQuestions), `${sourceFile} no contiene un banco de preguntas.`);
assert(Array.isArray(targetQuestions), `${targetFile} no contiene un banco de preguntas.`);

const files = fs
  .readdirSync(bancoDir)
  .filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allBefore = files.flatMap((file) => readJson(file));
const idsBefore = allBefore.map((question) => question.id);
assert(
  idsBefore.length === new Set(idsBefore).size,
  "El banco previo ya contiene IDs duplicados; se cancela el traslado para no ocultarlos.",
);
assert(
  allBefore.length === manifest.total,
  `El total previo (${allBefore.length}) no coincide con el manifiesto (${manifest.total}).`,
);

const movedQuestions = sourceQuestions.filter((question) => hasTopic(question, INTRODUCTION));
assert(movedQuestions.length > 0, `No hay preguntas en ${SOURCE_SUBJECT} > ${INTRODUCTION}.`);
assert(
  movedQuestions.every((question) => question.s === SOURCE_SUBJECT),
  "Hay preguntas de Introducción con una asignatura interna inesperada.",
);
assert(
  movedQuestions.every((question) => question.t.length === 1),
  "Hay preguntas de Introducción con más de un tema; se cancela para no perder ubicaciones adicionales.",
);
assert(
  targetQuestions.filter((question) => hasTopic(question, INTRODUCTION)).length === 0,
  `${TARGET_SUBJECT} > ${INTRODUCTION} ya contiene preguntas; se cancela para evitar una mezcla no revisada.`,
);

const movedIds = new Set(movedQuestions.map((question) => question.id));
const targetIds = new Set(targetQuestions.map((question) => question.id));
assert(
  [...movedIds].every((id) => !targetIds.has(id)),
  "Alguno de los IDs que se van a mover ya existe en Psicoterapias.",
);

const remainingSource = sourceQuestions.filter((question) => !movedIds.has(question.id));
const relocatedQuestions = movedQuestions.map((question) => ({
  ...question,
  s: TARGET_SUBJECT,
  t: [INTRODUCTION],
}));
const finalTarget = [...targetQuestions, ...relocatedQuestions];

for (let index = 0; index < movedQuestions.length; index += 1) {
  assert(
    JSON.stringify(withoutPlacement(movedQuestions[index])) ===
      JSON.stringify(withoutPlacement(relocatedQuestions[index])),
    `Se alteró contenido ajeno a la ubicación en ${movedQuestions[index].id}.`,
  );
}

const finalManifest = structuredClone(manifest);
assert(
  finalManifest.subjects[SOURCE_SUBJECT].topics.includes(INTRODUCTION),
  `El manifiesto no conserva ${SOURCE_SUBJECT} > ${INTRODUCTION}.`,
);
finalManifest.subjects[TARGET_SUBJECT].topics = [
  INTRODUCTION,
  ...finalManifest.subjects[TARGET_SUBJECT].topics.filter((topic) => topic !== INTRODUCTION),
];
finalManifest.subjects[SOURCE_SUBJECT].count = remainingSource.length;
finalManifest.subjects[TARGET_SUBJECT].count = finalTarget.length;

const finalByFile = new Map([
  [sourceFile, remainingSource],
  [targetFile, finalTarget],
]);
const allAfter = files.flatMap((file) => finalByFile.get(file) ?? readJson(file));
const idsAfter = allAfter.map((question) => question.id);

assert(
  remainingSource.filter((question) => hasTopic(question, INTRODUCTION)).length === 0,
  `${SOURCE_SUBJECT} > ${INTRODUCTION} no ha quedado vacía.`,
);
assert(
  finalTarget.filter((question) => hasTopic(question, INTRODUCTION)).length === movedQuestions.length,
  `${TARGET_SUBJECT} > ${INTRODUCTION} no contiene exactamente todas las preguntas trasladadas.`,
);
assert(allAfter.length === allBefore.length, "El total global ha cambiado durante el traslado.");
assert(new Set(idsAfter).size === idsAfter.length, "El traslado ha generado IDs duplicados.");
assert(
  [...movedIds].every((id) => idsAfter.includes(id)),
  "Falta al menos un ID trasladado en el banco final.",
);

for (const [subject, details] of Object.entries(finalManifest.subjects)) {
  const subjectQuestions = allAfter.filter((question) => question.s === subject);
  assert(
    details.count === subjectQuestions.length,
    `El recuento de ${subject} no coincide con su banco.`,
  );
  for (const question of subjectQuestions) {
    assert(
      Array.isArray(question.t) && question.t.length === 1 && details.topics.includes(question.t[0]),
      `La pregunta ${question.id} tiene una ubicación no incluida en el manifiesto.`,
    );
  }
}
assert(finalManifest.total === allAfter.length, "El total del manifiesto ha cambiado.");

writeBank(sourceFile, remainingSource);
writeBank(targetFile, finalTarget);
writeManifest(finalManifest);

console.log(
  JSON.stringify(
    {
      moved: movedQuestions.length,
      source: {
        subject: SOURCE_SUBJECT,
        topic: INTRODUCTION,
        questions: remainingSource.filter((question) => hasTopic(question, INTRODUCTION)).length,
        total: remainingSource.length,
      },
      target: {
        subject: TARGET_SUBJECT,
        topic: INTRODUCTION,
        questions: finalTarget.filter((question) => hasTopic(question, INTRODUCTION)).length,
        total: finalTarget.length,
      },
      global: {
        total: allAfter.length,
        uniqueIds: new Set(idsAfter).size,
      },
    },
    null,
    2,
  ),
);
