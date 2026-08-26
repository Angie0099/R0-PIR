import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bancoDir = path.join(repoRoot, "public", "banco");
const manifestPath = path.join(bancoDir, "manifest.json");

const SUBJECT = "Psicología Clínica";
const TOPIC = "Trastornos disociativos";
const OLD_ID = "PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_071";
const NEW_ID = "R0PIR_PC_DISOCIACION_CARDENA_CARLSON_20260826_001";
const QUESTION_PREFIX = "Cardeña y Carlson (2011) resumen las características comunes de la disociación en tres áreas.";
const EXPLANATION = "La opción d es correcta. Cardeña y Carlson (2011) distinguen tres áreas de la disociación: (1) pérdida de continuidad en la experiencia subjetiva, con intrusiones involuntarias y no deseadas; (2) incapacidad para acceder a información o controlar funciones mentales normalmente accesibles; y (3) sensación de desconexión experiencial, que puede incluir distorsiones perceptivas del yo o del entorno. La incapacidad para diferenciar el mundo interno del externo no integra estas tres áreas y se relaciona más con una alteración del juicio de realidad. La sensación de irrealidad disociativa no implica necesariamente pérdida del juicio de realidad";
const REFERENCE = "Cardeña, E. y Carlson, E. B. (2011). «Acute Stress Disorder Revisited». Annual Review of Clinical Psychology, 7, 245–267. DOI: 10.1146/annurev-clinpsy-032210-104502. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., McGraw Hill, cap. 8, «Trastornos disociativos», pp. 295–322.";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const read = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const write = (filePath, value, pretty = false) =>
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, pretty ? 2 : undefined)}\n`, "utf8");
const normalize = (text) =>
  String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const manifest = read(manifestPath);
assert(manifest.subjects?.[SUBJECT], `No existe ${SUBJECT} en el manifiesto.`);
assert(manifest.subjects[SUBJECT].topics.includes(TOPIC), `No existe el tema ${TOPIC}.`);
const clinicalPath = path.join(bancoDir, `${manifest.subjects[SUBJECT].slug}.json`);
const clinicalBefore = read(clinicalPath);

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allBefore = files.flatMap((file) => read(path.join(bancoDir, file)));
assert(allBefore.length === manifest.total, "El total previo no coincide con el manifiesto.");
assert(new Set(allBefore.map((question) => question.id)).size === allBefore.length, "El banco previo contiene IDs duplicados.");
assert(!allBefore.some((question) => question.id === NEW_ID), `El ID nuevo ${NEW_ID} ya existe.`);

const candidates = clinicalBefore.filter((question) => question.id === OLD_ID || normalize(question.e).startsWith(normalize(QUESTION_PREFIX)));
assert(candidates.length === 1, `Se esperaba una única pregunta de Cardeña y Carlson y se localizaron ${candidates.length}.`);
const original = candidates[0];
assert(original.id === OLD_ID, "La pregunta localizada no tiene el ID histórico esperado.");
assert(original.s === SUBJECT, "La pregunta localizada no pertenece a Psicología Clínica.");

const replacement = {
  ...original,
  id: NEW_ID,
  s: SUBJECT,
  t: [TOPIC],
  o: {
    a: "Sensación de desconexión experiencial",
    b: "Pérdida de continuidad en la experiencia subjetiva",
    c: "Incapacidad para acceder a la información",
    d: "Incapacidad de diferenciar el mundo interno del mundo externo",
  },
  c: "d",
  x: EXPLANATION,
  r: REFERENCE,
  v: "CORREGIDA",
  origen: "banco_oficial",
  _ro: 1,
};

const clinicalAfter = clinicalBefore.map((question) => (question.id === OLD_ID ? replacement : question));
assert(clinicalAfter.filter((question) => question.id === NEW_ID).length === 1, "No se ha restaurado una sola pregunta con el ID nuevo.");
assert(!clinicalAfter.some((question) => question.id === OLD_ID), "El registro eliminado no se ha sustituido completamente.");
assert(
  clinicalAfter.find((question) => question.id === NEW_ID)?.e === original.e,
  "El enunciado original se ha alterado durante la restauración.",
);
assert(
  JSON.stringify(clinicalAfter.find((question) => question.id === NEW_ID)?.o) ===
    JSON.stringify(replacement.o),
  "Las cuatro opciones no coinciden con la versión corregida.",
);

const afterByFile = new Map([[path.basename(clinicalPath), clinicalAfter]]);
const allAfter = files.flatMap((file) => afterByFile.get(file) ?? read(path.join(bancoDir, file)));
const idsAfter = new Set(allAfter.map((question) => question.id));
assert(allAfter.length === allBefore.length, "La restauración no debe modificar el total global.");
assert(idsAfter.size === allAfter.length, "La restauración ha generado IDs duplicados.");
assert(manifest.total === allAfter.length, "El total del manifiesto no coincide con el banco final.");
assert(manifest.subjects[SUBJECT].count === clinicalAfter.length, "El recuento de Psicología Clínica no coincide con su banco.");
for (const question of clinicalAfter) {
  assert(question.s === SUBJECT, `La pregunta ${question.id} tiene una asignatura inesperada.`);
  assert(
    Array.isArray(question.t) && question.t.length === 1 && manifest.subjects[SUBJECT].topics.includes(question.t[0]),
    `La pregunta ${question.id} tiene un tema no incluido en el manifiesto.`,
  );
}

write(clinicalPath, clinicalAfter);
console.log(
  JSON.stringify(
    {
      restored_id: NEW_ID,
      replaced_id: OLD_ID,
      subject: SUBJECT,
      topic: TOPIC,
      key: replacement.c,
      total: allAfter.length,
      unique_ids: idsAfter.size,
    },
    null,
    2,
  ),
);
