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
const DSM = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const BELLOCH = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const CIE11 = "Organización Mundial de la Salud (2022). CIE-11 para las estadísticas de mortalidad y morbilidad.";

// Las entradas en REVISAR se recolocan porque su tema es inequívoco, pero no
// se presentan como validadas hasta comprobar su formulación con más detalle.
const reviews = {
  "NOVIEMBRE-DOS-24_COMENTADO_044": {
    destination: CLINICAL, topic: "Patología de la conciencia", c: "d", v: "CORREGIDA",
    x: "La letargia o somnolencia es una disminución persistente del nivel de vigilia: la persona se duerme cuando disminuye la estimulación, aunque conserva reflejos y puede responder a estímulos. El delirium es una alteración cualitativa de la conciencia.", r: `${BELLOCH} pp. 155-156.`,
  },
  "SEPTIEMBRE-DOS-24_COMENTADO_072": {
    destination: CLINICAL, topic: "Patología de la conciencia", c: "c", v: "CORREGIDA",
    e: "Según la clasificación tradicional de las alteraciones de la conciencia, ¿cuál de las siguientes opciones se considera una alteración cualitativa?",
    o: { d: "Sopor." },
    x: "El delirium es una alteración cualitativa de la conciencia. La obnubilación, la letargia y el sopor son alteraciones cuantitativas por disminución del nivel de vigilia.", r: `${BELLOCH} pp. 155-158.`,
  },
  "SM_JULIO_1_SOL_1_057": {
    destination: CLINICAL, topic: "Patología de la conciencia", c: "b", v: "CORREGIDA",
    e: "¿Cuál de las siguientes se corresponde con una alteración cualitativa de la conciencia?",
    o: { d: "Estupor orgánico." },
    x: "El estupor funcional es una alteración cualitativa de la conciencia. Se diferencia del estupor orgánico o neurológico porque la reactividad sensorial y los reflejos se conservan y el EEG es normal.", r: `${BELLOCH} pp. 155-158.`,
  },
  "SmCm30PIR2025 (1)_037": {
    destination: CLINICAL, topic: "Trastornos parafílicos", c: "c", v: "CORREGIDA",
    e: "¿En qué trastorno parafílico se obtiene excitación sexual al tocar o rozar a una persona sin su consentimiento?",
    o: { a: "Trastorno de voyeurismo.", b: "Trastorno de exhibicionismo.", c: "Trastorno de frotteurismo.", d: "Trastorno de fetichismo." },
    x: "El trastorno de frotteurismo implica excitación sexual intensa y recurrente derivada de tocar o rozar a una persona sin su consentimiento, o fantasías o impulsos sobre ello.", r: `${DSM} p. 785.`,
  },
  "SmCm22PIR2025 (1)_064": {
    destination: CLINICAL, topic: "Trastornos disociativos", c: "d", v: "REVISAR",
  },
  SmCm11PIR2025_159: {
    destination: CLINICAL, topic: "Disfunciones sexuales", c: "d", v: "REVISAR",
  },
  SmCm18PIR2025_041: {
    destination: CLINICAL, topic: "Disfunciones sexuales", c: "b", v: "CORREGIDA",
    e: "En relación con el diagnóstico de eyaculación precoz según el DSM-5-TR, señale la opción falsa:",
    o: {
      a: "Patrón persistente y recurrente de eyaculación en el minuto siguiente a la penetración vaginal en las relaciones sexuales en pareja, y antes de que la persona lo desee.",
      b: "Duración de al menos 3 meses y aparición en todas las actividades sexuales.",
      c: "Es de gravedad leve cuando se eyacula entre los 30 y los 60 segundos después de la penetración vaginal.",
      d: "Es grave si se eyacula en los primeros 15 segundos después de la penetración vaginal.",
    },
    x: "La opción b es falsa: el patrón debe haber persistido aproximadamente 6 meses y estar presente en el 75-100 % de las ocasiones de actividad sexual en pareja, no necesariamente en todas.", r: `${DSM} pp. 501-502.`,
  },
  PERSEV_JUL25_D2_075: {
    destination: CHILD, topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles", c: "d", v: "CORREGIDA",
    e: "¿Dónde se clasifica el trastorno oposicionista desafiante en la CIE-11?",
    o: { d: "En los trastornos del comportamiento disruptivo y disocial." },
    x: "La CIE-11 clasifica el trastorno oposicionista desafiante dentro de los trastornos del comportamiento disruptivo y disocial.", r: `${CIE11} código 6C90.`,
  },
  JUNIO1_074: {
    destination: CHILD, topic: "Discapacidad intelectual", c: "b", v: "CORREGIDA",
    e: "De acuerdo con el DSM-5-TR, un niño con habilidades conceptuales notablemente retrasadas, lenguaje menos complejo que sus iguales y necesidad de un período más largo de aprendizaje para lograr autonomía en sus necesidades personales presenta una discapacidad intelectual de gravedad:",
    o: { d: "Profundo." },
    x: "La descripción corresponde a discapacidad intelectual de gravedad moderada. El DSM-5-TR determina la gravedad por el funcionamiento adaptativo, no por el cociente intelectual.", r: `${DSM} pp. 38-40.`,
  },
  "DICIEMBRE-UNO-24_COMENTADO_135": {
    destination: CHILD, topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles", c: "a", v: "CORREGIDA",
    e: "Señale la afirmación correcta respecto a los factores de riesgo cognitivo del trastorno de conducta:",
    x: "Los jóvenes con trastorno de conducta tienden a interpretar comportamientos y situaciones ambiguas como hostiles. Este sesgo de atribución hostil se asocia a la conducta agresiva.", r: `${DSM} p. 534.`,
  },
  "PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_061": {
    destination: CHILD, topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles", c: "c", v: "CORREGIDA",
    e: "Marque la opción incorrecta sobre el trastorno de conducta:",
    o: { d: "El inicio es raro después de los 16 años." },
    x: "La opción c es incorrecta: el DSM-5-TR señala que los chicos presentan con más frecuencia problemas de disciplina escolar y las chicas son más propensas al absentismo escolar.", r: `${DSM} pp. 530-535.`,
  },
  "PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_068": {
    destination: CLINICAL, topic: "Trastornos parafílicos", c: "b", v: "CORREGIDA",
    e: "Respecto a los trastornos parafílicos según el DSM-5-TR, señale la afirmación correcta:",
    o: {
      a: "Uno de los especificadores del trastorno de fetichismo es si se produce con asfixiofilia.",
      b: "La edad mínima para el diagnóstico del trastorno de voyeurismo se establece en 18 años.",
      c: "Parece existir una interacción entre la pedofilia y el comportamiento esquizoide, por lo que los hombres con ambos rasgos tienen más probabilidad de mantener relaciones sexuales con niños.",
      d: "La autoginofilia es un especificador del trastorno fetichista.",
    },
    x: "La edad mínima para diagnosticar el trastorno de voyeurismo es 18 años. La asfixiofilia se especifica en el trastorno de masoquismo sexual; la autoginofilia se asocia al trastorno de travestismo, y la interacción descrita para pedofilia es con comportamiento antisocial, no esquizoide.", r: `${DSM} pp. 780, 788 y 798.`,
  },
  "Simu 32 comentado hardcore 2_080": {
    destination: CLINICAL, topic: "Trastornos relacionados con traumas y factores de estrés", c: "d", v: "CORREGIDA",
    e: "En relación con los criterios diagnósticos del trastorno de estrés postraumático en el DSM-5-TR, señale la opción incorrecta:",
    x: "La opción d es incorrecta: la amnesia disociativa respecto al evento traumático puede estar presente, pero no es obligatoria para diagnosticar TEPT.", r: `${DSM} pp. 301-302.`,
  },
  SmCm13PIR2025_078: {
    destination: CLINICAL, topic: "Trastornos neurocognitivos", c: "a", v: "CORREGIDA",
    e: "En el trastorno neurocognitivo mayor o leve debido a degeneración frontotemporal, ¿cuál no es un factor de riesgo o pronóstico?",
    o: {
      a: "Más del 50 % tiene antecedentes familiares de trastorno neurocognitivo de inicio temprano.",
      b: "Un 10 % presenta un patrón de herencia autosómica dominante.",
      c: "La patología de la motoneurona se asocia a un deterioro más rápido.",
      d: "A pesar de haberse identificado factores genéticos y mutaciones, muchos sujetos con transmisión familiar no tienen mutaciones conocidas.",
    },
    x: "La opción a es incorrecta: el DSM-5-TR indica antecedentes familiares de inicio temprano en aproximadamente el 40 %, no en más del 50 %. Las restantes afirmaciones se corresponden con los factores de riesgo y pronóstico descritos.", r: `${DSM} p. 697.`,
  },
  SmCm2PIR2024_056: {
    destination: CLINICAL, topic: "Trastornos neurocognitivos", c: "a", v: "REVISAR",
  },
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...clinical, ...child];
const occurrences = new Map();
for (const question of allBefore) occurrences.set(question.id, (occurrences.get(question.id) || 0) + 1);
if ([...occurrences.values()].some((count) => count !== 1)) throw new Error("Hay identificadores duplicados entre Clínica e Infantil.");
const missing = Object.keys(reviews).filter((id) => !occurrences.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const topicsFor = (subject) => new Set(manifest.subjects[subject].topics);
const apply = (question, review) => {
  if (question.c !== review.c) throw new Error(`La clave de ${question.id} no coincide con la revisión.`);
  if (!topicsFor(review.destination).has(review.topic)) throw new Error(`El tema no existe: ${review.topic}`);
  const finalQuestion = {
    ...question,
    s: review.destination,
    t: [review.topic],
    e: review.e || question.e,
    o: review.o ? { ...question.o, ...review.o } : question.o,
    c: review.c,
    v: review.v,
  };
  if (review.x) finalQuestion.x = review.x;
  if (review.r) finalQuestion.r = review.r;
  for (const key of ["a", "b", "c", "d"]) if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
  if (/^(VALIDADA_(ORIGINAL|DRIVE)|CORREGIDA)$/.test(finalQuestion.v || "") && (!finalQuestion.x || !finalQuestion.r)) throw new Error(`Falta justificación o referencia en ${question.id}`);
  return finalQuestion;
};

const finalClinical = clinical
  .filter((question) => reviews[question.id]?.destination !== CHILD)
  .map((question) => reviews[question.id] ? apply(question, reviews[question.id]) : question);
const movedToChild = clinical
  .filter((question) => reviews[question.id]?.destination === CHILD)
  .map((question) => apply(question, reviews[question.id]));
const finalChild = [...child, ...movedToChild];

const allAfter = [...finalClinical, ...finalChild];
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length) throw new Error("La auditoría alteraría el total o los IDs.");
for (const [id, review] of Object.entries(reviews)) {
  const questions = review.destination === CHILD ? finalChild : finalClinical;
  const question = questions.find((candidate) => candidate.id === id);
  if (!question || question.s !== review.destination || question.t[0] !== review.topic || question.v !== review.v) throw new Error(`No se aplicó la revisión de ${id}.`);
}

manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(clinicalPath, `${JSON.stringify(finalClinical)}\n`, "utf8");
fs.writeFileSync(childPath, `${JSON.stringify(finalChild)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicología Clínica 05 — conciencia, desarrollo, conducta y parafilias",
  reviewed: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  reclassifiedToChildPsychopathology: movedToChild.length,
  deferred: Object.values(reviews).filter((review) => review.v === "REVISAR").length,
  preservedQuestionIds: true,
}, null, 2));
