import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const manifestPath = path.join(bancoDir, "manifest.json");
const subjects = {
  psychotherapy: "Psicoterapias",
  personality: "Psicología de la Personalidad y Diferencial",
  basic: "Psicología Básica",
  child: "Psicopatología Infantil",
  adult: "Tratamientos Adultos",
  development: "Psicología Evolutiva",
};

const sources = {
  maslow: "Maslow, A. H. (1943). A theory of human motivation. Psychological Review, 50, 370-396.",
  skinner: "Skinner, B. F. (1953). Science and Human Behavior. Macmillan.",
  dsm: "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana, p. 536.",
  ds: "Díaz, M. I., Ruiz, M. A. y Villalobos, A. (2017). Manual de técnicas de intervención cognitivo-conductuales. Desclée de Brouwer, p. 248.",
  piaget: "Piaget, J. (1932). The Moral Judgment of the Child. Routledge & Kegan Paul.",
  watzlawick: "Watzlawick, P., Beavin, J. H. y Jackson, D. D. (1967). Pragmatics of Human Communication. Norton; Watzlawick, P., Weakland, J. H. y Fisch, R. (1974). Change. Norton.",
  winnicott: "Winnicott, D. W. (1960). The theory of the parent-infant relationship. International Journal of Psycho-Analysis, 41, 585-595.",
  fonseca: "Fonseca, E. (coord.) (2019). Manual de tratamientos psicológicos: Adultos. Pirámide, p. 233.",
  health: "Amigo Vázquez, I., Fernández Rodríguez, C. y Pérez Álvarez, M. Manual de psicología de la salud, pp. 21-26.",
};

// El ítem de terapia centrada en las emociones con OCR que altera todas sus
// opciones queda fuera deliberadamente: no se cambia clave ni se valida.
const reviews = {
  "1Simulacro02018Comentarios_110": {
    destination: subjects.personality, topic: "Teorías humanistas y existenciales de la personalidad", oldC: "d", c: "d", v: "VALIDADA_ORIGINAL",
    x: "Maslow ordena las necesidades, de menor a mayor, como fisiológicas, seguridad, afiliación, estima y autorrealización.", r: sources.maslow,
  },
  "1Simulacro02018Comentarios_111": {
    destination: subjects.basic, topic: "Aprendizaje y condicionamiento", oldC: "a", c: "a", v: "VALIDADA_ORIGINAL",
    e: "Si a una persona presa se le reduce la condena por buen comportamiento, ¿qué procedimiento se aplica en términos psicológicos?",
    x: "Reducir una condición aversiva después de una conducta deseada aumenta la probabilidad de esa conducta; es reforzamiento negativo.", r: sources.skinner,
  },
  "1Simulacro02018Comentarios_224": {
    destination: subjects.child, topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles", oldC: "d", c: "d", v: "CORREGIDA",
    e: "Cuando una persona cumple los criterios diagnósticos tanto de trastorno negativista desafiante como de trastorno de conducta según el DSM-5-TR, ¿qué diagnóstico se realiza?",
    x: "Si se cumplen los criterios de trastorno negativista desafiante y trastorno de conducta, pueden diagnosticarse ambos trastornos.", r: sources.dsm,
  },
  "Simu 12 comentado_140": {
    destination: subjects.adult, topic: "Técnicas psicológicas generales", oldC: "c", c: "c", v: "CORREGIDA",
    e: "En la construcción de una jerarquía de ansiedad para la desensibilización sistemática, señale la afirmación correcta:",
    x: "Los ítems de la jerarquía los propone la propia persona, con la ayuda del terapeuta si la necesita. Han de ser concretos y ordenarse según el nivel de ansiedad evocado.", r: sources.ds,
  },
  "SmCm12PIR2024 2_189": {
    destination: subjects.development, topic: "El desarrollo social y moral", oldC: "b", c: "d", v: "CORREGIDA",
    e: "La moralidad heterónoma se describe como:",
    o: { d: "La noción de justicia se basa primero en la obediencia a la autoridad y en la evitación del castigo." },
    x: "En la moralidad heterónoma de Piaget, la norma se vive como impuesta por la autoridad y la justicia se vincula inicialmente a la obediencia y a evitar el castigo.", r: sources.piaget,
  },
  "Simu 7 comentado _138": {
    destination: subjects.psychotherapy, topic: "Terapias de familia y modelos sistémicos", oldC: "c", c: "c", v: "CORREGIDA",
    e: "El doble vínculo implica una contradicción entre la información comunicada a nivel analógico y digital dentro de una relación significativa. Señale la opción incorrecta sobre sus requisitos:",
    x: "La imposibilidad de escapar de la situación corresponde al mandato terciario del doble vínculo, no al mandato secundario. Por ello, la opción c es incorrecta.", r: sources.watzlawick,
  },
  SmCm13PIR2025_208: {
    destination: subjects.psychotherapy, topic: "Terapias de familia y modelos sistémicos", oldC: "c", c: "c", v: "CORREGIDA",
    e: "¿Qué tipo de paradoja está implicada en el patrón de comunicación denominado «doble vínculo»?",
    o: { a: "Paradoja lógica.", b: "Paradoja de autorreferencia.", c: "Paradoja pragmática.", d: "Paradoja relacional." },
    x: "El doble vínculo es una paradoja pragmática: la contradicción se produce en la comunicación y en la relación entre las personas.", r: sources.watzlawick,
  },
  SmCm16PIR2025_118: {
    destination: subjects.psychotherapy, topic: "Terapias de familia y modelos sistémicos", oldC: "a", c: "a", v: "CORREGIDA",
    e: "Dentro del marco de la terapia familiar, ¿cómo se denominan las soluciones que no modifican las reglas o la estructura del sistema?",
    o: { a: "Cambios de primer orden.", b: "Cambios de segundo orden.", c: "Cambios alfa.", d: "Cambios beta." },
    x: "Las soluciones que intentan resolver el problema sin modificar las reglas del sistema son cambios de primer orden. Los cambios de segundo orden transforman las reglas que mantienen el problema.", r: sources.watzlawick,
  },
  SmCm18PIR2025_130: {
    destination: subjects.psychotherapy, topic: "Psicoanálisis y terapias psicodinámicas", oldC: "b", c: "b", v: "CORREGIDA",
    e: "Winnicott propuso funciones maternas primordiales para el desarrollo del niño. ¿Cuál se refiere a la función de sostenimiento o holding?",
    x: "El holding facilita la vivencia de integración entre cuerpo y psique y proporciona el sostén necesario en las primeras etapas del desarrollo.", r: sources.winnicott,
  },
  SmCm28PIR2025_128: {
    destination: subjects.psychotherapy, topic: "Terapias de familia y modelos sistémicos", oldC: "d", c: "c", v: "CORREGIDA",
    e: "Dentro de la escuela estructural de Minuchin, en la segunda fase de la terapia familiar, ¿cuál de las siguientes técnicas no forma parte de las técnicas de reestructuración?",
    o: { a: "Desequilibrio.", b: "Fijación y reestructuración de límites.", c: "Redefinición positiva del síntoma.", d: "Intensificación del mensaje del terapeuta." },
    x: "La redefinición positiva es una técnica de cambio de visión, no una técnica estructural de reestructuración. El desequilibrio, el trabajo con límites y la intensificación sí forman parte de las técnicas estructurales.", r: sources.fonseca,
  },
  SmCm26PIR2025_033: {
    destination: subjects.adult, topic: "Técnicas psicológicas generales", oldC: "a", c: "a", v: "CORREGIDA",
    e: "¿Qué tipo de prevención constituye una campaña para que todas las mujeres a partir de los 25 años se realicen citologías cada dos años para detectar precozmente el cáncer de cérvix?",
    x: "La citología de cribado busca detectar precozmente una enfermedad antes de que produzca síntomas; corresponde a prevención secundaria.", r: sources.health,
  },
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const files = Object.fromEntries(Object.entries(subjects).map(([key, subject]) => [key, path.join(bancoDir, `${manifest.subjects[subject].slug}.json`)]));
const datasets = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, JSON.parse(fs.readFileSync(file, "utf8"))]));
const allBefore = Object.values(datasets).flat();
const idsBefore = new Map();
for (const question of allBefore) idsBefore.set(question.id, (idsBefore.get(question.id) || 0) + 1);
if ([...idsBefore.values()].some((count) => count !== 1)) throw new Error("Hay IDs duplicados entre los bancos afectados.");
const missing = Object.keys(reviews).filter((id) => !idsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const topicsFor = (subject) => new Set(manifest.subjects[subject].topics);
const apply = (question, review) => {
  if (question.c !== review.oldC) throw new Error(`La clave original de ${question.id} no coincide con la revisión.`);
  if (!topicsFor(review.destination).has(review.topic)) throw new Error(`El tema no existe en ${review.destination}: ${review.topic}`);
  const finalQuestion = {
    ...question,
    s: review.destination,
    t: [review.topic],
    e: review.e || question.e,
    o: review.o ? { ...question.o, ...review.o } : question.o,
    c: review.c,
    x: review.x,
    r: review.r,
    v: review.v,
  };
  for (const key of ["a", "b", "c", "d"]) if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
  if (!finalQuestion.x || !finalQuestion.r) throw new Error(`Falta justificación o referencia en ${question.id}`);
  return finalQuestion;
};

const source = datasets.psychotherapy;
const moved = source.filter((question) => Object.hasOwn(reviews, question.id)).map((question) => apply(question, reviews[question.id]));
const finalPsychotherapy = source
  .filter((question) => !Object.hasOwn(reviews, question.id) || reviews[question.id].destination === subjects.psychotherapy)
  .map((question) => Object.hasOwn(reviews, question.id) ? apply(question, reviews[question.id]) : question);
const byDestination = (subject) => moved.filter((question) => question.s === subject);
const finalPersonality = [...datasets.personality, ...byDestination(subjects.personality)];
const finalBasic = [...datasets.basic, ...byDestination(subjects.basic)];
const finalChild = [...datasets.child, ...byDestination(subjects.child)];
const finalAdult = [...datasets.adult, ...byDestination(subjects.adult)];
const finalDevelopment = [...datasets.development, ...byDestination(subjects.development)];
const finals = {
  psychotherapy: finalPsychotherapy,
  personality: finalPersonality,
  basic: finalBasic,
  child: finalChild,
  adult: finalAdult,
  development: finalDevelopment,
};

const allAfter = Object.values(finals).flat();
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length) throw new Error("La auditoría alteraría el total o los IDs.");
for (const [id, review] of Object.entries(reviews)) {
  const question = allAfter.find((candidate) => candidate.id === id);
  if (!question || question.s !== review.destination || question.t[0] !== review.topic || question.c !== review.c) throw new Error(`No se aplicó la revisión de ${id}.`);
}

for (const [key, data] of Object.entries(finals)) {
  const subject = subjects[key];
  manifest.subjects[subject].count = data.length;
  fs.writeFileSync(files[key], `${JSON.stringify(data)}\n`, "utf8");
}
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicoterapias 01 — fundamentos, sistémica y reubicaciones",
  reviewed: Object.keys(reviews).length,
  movedOutsidePsychotherapy: moved.filter((question) => question.s !== subjects.psychotherapy).length,
  preservedQuestionIds: true,
  deferred: "SmCm20PIR2025 (1)_130 permanece pendiente por OCR que impide reconstruirla con seguridad.",
}, null, 2));
