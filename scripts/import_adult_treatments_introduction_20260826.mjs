import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bancoDir = path.join(repoRoot, "public", "banco");
const reportDir = path.join(repoRoot, "analysis", "audit_reports");

const SUBJECT = "Tratamientos Adultos";
const TOPIC = "Introducción";
const PSYCHOTHERAPIES = "Psicoterapias";
const EXPECTED_SOURCE_HASH = "3315d5add8e40633bf64a462114018e6dd24491cf2529e41e64140ac7f8308b2";
const EXPECTED_SOURCE_COUNT = 70;
const ID_PREFIX = "R0PIR_TA_INTRO_20260826";
const EXPECTED_FIELDS = [
  "tema",
  "asignatura",
  "pregunta",
  "opciones",
  "respuesta_correcta",
  "justificacion_tecnica",
  "referencias",
];

// Ítems que no se publican hasta revisar su justificación o clave. Se preservan
// literalmente en el informe de pendientes generado por este script.
const PENDING = new Map([
  [5, "La justificación asigna erróneamente eficacia y eficiencia a las opciones 1 y 2; la eficiencia corresponde a la opción 4."],
  [7, "La justificación localiza la inversión de atribuciones en la opción 2, pero está en la opción 3."],
  [9, "La justificación atribuye las categorías de 1995 a la opción 2; aparecen en la opción 4."],
  [12, "La justificación clasifica la opción correcta 1 como primera generación, aunque define la tercera generación."],
  [13, "La justificación identifica la opción 2 como el modelo latente opuesto; el modelo latente es la opción 1."],
  [15, "La justificación confunde las opciones de CIE-11, RDoC y HiTOP."],
  [16, "La justificación atribuye HiTOP a la opción 2, cuando corresponde a la opción 4."],
  [17, "La justificación explica por qué falla la opción 1, pero señala equivocadamente la opción 2."],
  [21, "La justificación atribuye a la opción 2 la fiabilidad global que figura en la opción 1."],
  [24, "La justificación llama revisión paraguas a la opción 1; la descripción correspondiente está en la opción 3."],
  [31, "Un único ECA 1+ no basta para un grado SIGN A; se exige 1++ aplicable o un cuerpo consistente de estudios 1+."],
  [37, "La justificación sitúa la opción 3 en una categoría superior, aunque es la clave de posiblemente eficaz."],
  [48, "La justificación contradice la clave al asignar la opción 3 a una fase distinta de decidir conjuntamente."],
  [70, "La justificación afirma que PCOMS no mide alianza; su Session Rating Scale sí es una medida de alianza."],
]);

// Resultado de la revisión semántica contra todo el banco antes de importar.
const SEMANTIC_DUPLICATES = new Map([
  [8, { ids: ["Simu 15 comentado_133"], reason: "Veredicto Dodo: equivalencia de resultados." }],
  [13, { ids: ["SmCm22PIR2025_031"], reason: "Modelo de red: síntomas conectados causalmente, no entidad latente." }],
  [15, { ids: ["SmCm21PIR2025 (2)_064"], reason: "RDoC como marco dimensional, biológico y de investigación." }],
  [21, { ids: ["Simu 15 comentado_011"], reason: "TRI: precisión y error dependientes del nivel de rasgo." }],
  [32, { ids: ["PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_184"], reason: "SIGN: evidencia 1++ extrapolada implica grado B." }],
  [33, { ids: ["PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_184"], reason: "SIGN: dos vías para el grado B." }],
  [43, { ids: ["NOVIEMBRE-DOS-24_COMENTADO_135"], reason: "Los tres pilares de la práctica basada en pruebas." }],
  [53, { ids: ["AGOSTO2_123"], reason: "Manejo de la contratransferencia." }],
  [54, { ids: ["JUNIO-UNO-24_COMENTADO_168"], reason: "Estilo internalizador e intervenciones centradas en insight." }],
  [55, { ids: ["PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_186"], reason: "Reactancia alta y menor directividad." }],
  [69, { ids: ["Simu 11 comentado_147"], reason: "Lambert (1992): mayor peso de los factores/cambio extraterapéutico." }],
]);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value, pretty = false) =>
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, pretty ? 2 : undefined)}\n`, "utf8");
const sourceHash = (raw) => crypto.createHash("sha256").update(raw).digest("hex");
const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const stripOptionPrefix = (value) => String(value).replace(/^\s*\d+\.\s+/, "").trim();
const optionKey = (number) => ({ 1: "a", 2: "b", 3: "c", 4: "d" })[number];
const stableId = (inputIndex) => `${ID_PREFIX}_${String(inputIndex).padStart(3, "0")}`;
const withoutPlacement = (question) => {
  const copy = { ...question };
  delete copy.s;
  delete copy.t;
  return copy;
};

const inputPath = process.argv[2];
assert(inputPath, "Indica la ruta del JSON adjunto como primer argumento.");
const rawInput = fs.readFileSync(inputPath);
assert(
  sourceHash(rawInput) === EXPECTED_SOURCE_HASH,
  "El archivo adjunto no coincide con el lote revisado; se cancela para no importar un contenido distinto.",
);

const input = JSON.parse(rawInput.toString("utf8"));
assert(Array.isArray(input), "El adjunto debe contener un array JSON.");
assert(input.length === EXPECTED_SOURCE_COUNT, `Se esperaban ${EXPECTED_SOURCE_COUNT} preguntas y se recibieron ${input.length}.`);

const incomingSignatures = new Set();
for (const [zeroBasedIndex, item] of input.entries()) {
  const inputIndex = zeroBasedIndex + 1;
  assert(item && typeof item === "object" && !Array.isArray(item), `El ítem ${inputIndex} no es un objeto.`);
  assert(
    Object.keys(item).length === EXPECTED_FIELDS.length && EXPECTED_FIELDS.every((field) => Object.hasOwn(item, field)),
    `El ítem ${inputIndex} no tiene exactamente el esquema esperado.`,
  );
  assert(item.tema === TOPIC, `El ítem ${inputIndex} no pertenece a ${TOPIC}.`);
  assert(item.asignatura === "Tratamientos adultos", `El ítem ${inputIndex} no tiene la asignatura de origen esperada.`);
  for (const field of ["pregunta", "justificacion_tecnica", "referencias"]) {
    assert(typeof item[field] === "string" && item[field].trim(), `El ítem ${inputIndex} tiene ${field} vacío.`);
  }
  assert(Array.isArray(item.opciones) && item.opciones.length === 4, `El ítem ${inputIndex} no contiene cuatro opciones.`);
  const optionPrefixes = item.opciones.map((option) => /^\s*(\d+)\.\s+/.exec(String(option))?.[1]);
  assert(optionPrefixes.join(",") === "1,2,3,4", `El ítem ${inputIndex} no conserva los prefijos 1–4 de sus opciones.`);
  const options = item.opciones.map(stripOptionPrefix);
  assert(options.every(Boolean), `El ítem ${inputIndex} contiene una opción vacía.`);
  assert(new Set(options.map(normalize)).size === 4, `El ítem ${inputIndex} contiene opciones repetidas.`);
  assert(optionKey(item.respuesta_correcta), `El ítem ${inputIndex} tiene una clave fuera de 1–4.`);
  const signature = [normalize(item.pregunta), ...options.map(normalize), String(item.respuesta_correcta)].join("|");
  assert(!incomingSignatures.has(signature), `El ítem ${inputIndex} está duplicado dentro del adjunto.`);
  incomingSignatures.add(signature);
}

const manifestPath = path.join(bancoDir, "manifest.json");
const manifest = readJson(manifestPath);
assert(manifest.subjects?.[SUBJECT], `No existe la asignatura ${SUBJECT} en el manifiesto.`);
assert(manifest.subjects?.[PSYCHOTHERAPIES], `No existe la asignatura ${PSYCHOTHERAPIES} en el manifiesto.`);
assert(manifest.subjects[SUBJECT].topics.includes(TOPIC), `${SUBJECT} no conserva el tema ${TOPIC}.`);

const adultPath = path.join(bancoDir, `${manifest.subjects[SUBJECT].slug}.json`);
const psychotherapyPath = path.join(bancoDir, `${manifest.subjects[PSYCHOTHERAPIES].slug}.json`);
const adultBefore = readJson(adultPath);
const psychotherapyBefore = readJson(psychotherapyPath);
const psychotherapyIntroBefore = psychotherapyBefore.filter((question) => question.t?.includes(TOPIC));
assert(adultBefore.filter((question) => question.t?.includes(TOPIC)).length === 0, `${SUBJECT} > ${TOPIC} debe estar vacía antes de la importación.`);
assert(psychotherapyIntroBefore.length === 85, `${PSYCHOTHERAPIES} > ${TOPIC} no contiene las 85 preguntas protegidas.`);

const files = fs
  .readdirSync(bancoDir)
  .filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allBefore = files.flatMap((file) => readJson(path.join(bancoDir, file)));
const idsBefore = new Set(allBefore.map((question) => question.id));
assert(idsBefore.size === allBefore.length, "El banco previo contiene IDs duplicados.");
assert(allBefore.length === manifest.total, "El total previo no coincide con el manifiesto.");

for (const duplicate of SEMANTIC_DUPLICATES.values()) {
  for (const id of duplicate.ids) assert(idsBefore.has(id), `No se localizó el duplicado semántico de referencia ${id}.`);
}

const existingByQuestion = new Map();
for (const question of allBefore) {
  const signature = normalize(question.e);
  if (!existingByQuestion.has(signature)) existingByQuestion.set(signature, []);
  existingByQuestion.get(signature).push(question.id);
}

const exactDuplicates = [];
const additions = [];
const skippedSemanticDuplicates = [];
const pending = [];
for (const [zeroBasedIndex, item] of input.entries()) {
  const inputIndex = zeroBasedIndex + 1;
  const id = stableId(inputIndex);
  const exactIds = existingByQuestion.get(normalize(item.pregunta)) ?? [];
  if (PENDING.has(inputIndex)) {
    pending.push({ input_index: inputIndex, proposed_id: id, reason: PENDING.get(inputIndex), raw: item });
    continue;
  }
  if (exactIds.length) {
    exactDuplicates.push({ input_index: inputIndex, proposed_id: id, existing_ids: exactIds, raw: item });
    continue;
  }
  if (SEMANTIC_DUPLICATES.has(inputIndex)) {
    const duplicate = SEMANTIC_DUPLICATES.get(inputIndex);
    skippedSemanticDuplicates.push({ input_index: inputIndex, proposed_id: id, existing_ids: duplicate.ids, reason: duplicate.reason, raw: item });
    continue;
  }
  assert(!idsBefore.has(id), `El ID estable ${id} ya existe en el banco.`);
  additions.push({
    id,
    s: SUBJECT,
    t: [TOPIC],
    origen: "creada",
    convocatoria: null,
    pa: null,
    e: item.pregunta,
    o: {
      a: stripOptionPrefix(item.opciones[0]),
      b: stripOptionPrefix(item.opciones[1]),
      c: stripOptionPrefix(item.opciones[2]),
      d: stripOptionPrefix(item.opciones[3]),
    },
    c: optionKey(item.respuesta_correcta),
    x: item.justificacion_tecnica,
    r: item.referencias,
    v: "VALIDADA_ORIGINAL",
  });
}

assert(additions.length === 48, `La criba del lote debía producir 48 altas y ha producido ${additions.length}.`);
assert(pending.length === 14, `La cola de pendientes debía contener 14 ítems y contiene ${pending.length}.`);
assert(skippedSemanticDuplicates.length === 8, `La criba debía omitir 8 duplicados semánticos publicables y ha omitido ${skippedSemanticDuplicates.length}.`);
assert(exactDuplicates.length === 0, "Ha aparecido un duplicado exacto en el banco; revisa el informe antes de importar.");

for (const addition of additions) {
  const source = input[Number(addition.id.slice(-3)) - 1];
  assert(
    JSON.stringify(withoutPlacement(addition)) ===
      JSON.stringify({
        id: addition.id,
        origen: "creada",
        convocatoria: null,
        pa: null,
        e: source.pregunta,
        o: {
          a: stripOptionPrefix(source.opciones[0]),
          b: stripOptionPrefix(source.opciones[1]),
          c: stripOptionPrefix(source.opciones[2]),
          d: stripOptionPrefix(source.opciones[3]),
        },
        c: optionKey(source.respuesta_correcta),
        x: source.justificacion_tecnica,
        r: source.referencias,
        v: "VALIDADA_ORIGINAL",
      }),
    `Se ha alterado contenido del adjunto al preparar ${addition.id}.`,
  );
}

const adultAfter = [...adultBefore, ...additions];
const manifestAfter = structuredClone(manifest);
manifestAfter.subjects[SUBJECT].count = adultAfter.length;
manifestAfter.total = manifest.total + additions.length;

const byFileAfter = new Map([[path.basename(adultPath), adultAfter]]);
const allAfter = files.flatMap((file) => byFileAfter.get(file) ?? readJson(path.join(bancoDir, file)));
const idsAfter = new Set(allAfter.map((question) => question.id));
assert(allAfter.length === allBefore.length + additions.length, "El total global no aumenta exactamente con las altas.");
assert(idsAfter.size === allAfter.length, "La importación genera IDs duplicados.");
assert(manifestAfter.total === allAfter.length, "El total del manifiesto no coincide con el banco final.");
assert(
  adultAfter.filter((question) => question.t?.includes(TOPIC)).length === additions.length,
  `${SUBJECT} > ${TOPIC} no contiene exactamente las altas nuevas.`,
);
assert(
  adultAfter.every((question) => question.s === SUBJECT),
  `Hay una pregunta con asignatura incorrecta en ${SUBJECT}.`,
);
assert(
  psychotherapyBefore.filter((question) => question.t?.includes(TOPIC)).length === psychotherapyIntroBefore.length &&
    psychotherapyIntroBefore.every((question, index) => JSON.stringify(question) === JSON.stringify(psychotherapyBefore.filter((item) => item.t?.includes(TOPIC))[index])),
  `Se alteraron preguntas protegidas de ${PSYCHOTHERAPIES} > ${TOPIC}.`,
);

for (const [subject, details] of Object.entries(manifestAfter.subjects)) {
  const questions = allAfter.filter((question) => question.s === subject);
  assert(details.count === questions.length, `El recuento de ${subject} no coincide con el manifiesto.`);
  for (const question of questions) {
    assert(
      Array.isArray(question.t) && question.t.length === 1 && details.topics.includes(question.t[0]),
      `La pregunta ${question.id} no tiene una ubicación válida en el manifiesto.`,
    );
  }
}

const report = {
  type: "r0pir-import-audit",
  source: {
    sha256: EXPECTED_SOURCE_HASH,
    entries: input.length,
    attachment_name: path.basename(inputPath),
  },
  destination: { subject: SUBJECT, topic: TOPIC },
  summary: {
    added: additions.length,
    skipped_exact_duplicates: exactDuplicates.length,
    skipped_semantic_duplicates: skippedSemanticDuplicates.length,
    semantic_duplicate_matches_detected: SEMANTIC_DUPLICATES.size,
    pending: pending.length,
    total_before: allBefore.length,
    total_after: allAfter.length,
  },
  added: additions.map(({ id, e }) => ({ id, question: e })),
  skipped_exact_duplicates: exactDuplicates,
  skipped_semantic_duplicates: skippedSemanticDuplicates,
  pending,
};

fs.mkdirSync(reportDir, { recursive: true });
writeJson(adultPath, adultAfter);
writeJson(manifestPath, manifestAfter, true);
writeJson(path.join(reportDir, "importacion_tratamientos_adultos_introduccion_20260826.json"), report, true);

console.log(
  JSON.stringify(
    {
      added: additions.length,
      skipped_exact_duplicates: exactDuplicates.length,
      skipped_semantic_duplicates: skippedSemanticDuplicates.length,
      pending: pending.length,
      adult_introduction: adultAfter.filter((question) => question.t?.includes(TOPIC)).length,
      psychotherapies_introduction: psychotherapyIntroBefore.length,
      adult_count: manifestAfter.subjects[SUBJECT].count,
      global_total: manifestAfter.total,
      unique_ids: idsAfter.size,
    },
    null,
    2,
  ),
);
