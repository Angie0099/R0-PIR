import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INTRO_TOPIC = "Introducción";
const ADULT_SUBJECT = "Tratamientos Adultos";
const PSYCHOTHERAPY_SUBJECT = "Psicoterapias";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankDir = path.resolve(scriptDir, "..", "public", "banco");
const adultPath = path.join(bankDir, "tratamientos_adultos.json");
const psychotherapyPath = path.join(bankDir, "psicoterapias.json");
const manifestPath = path.join(bankDir, "manifest.json");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase();

// Los criterios reproducen únicamente el bloque A de los esquemas aportados:
// fundamentos, psicodinámica, humanismo-existencial, sistémica y psicodrama.
// Se usa el enunciado, no las opciones, para evitar falsos positivos por distractores.
const introductionRules = [
  /que es la psicoterapia|definicion.{0,25}psicoterapia|psicoterapia.{0,35}(interpersonal|profesional|individualiz|colaborativ|lenguaje|relacion terapeutica)|lightner witmer|historia de la psicoterapia|origen.{0,30}psicoterapia/,
  /modelo psicodinam|terapia psicodinam|psicoanalisis clasico|\bfreud\b|asociacion libre|atencion flotante|regla fundamental|transferencia y contratransferencia|mecanismos? de defensa|\b(adler|jung|klein|winnicott|kohut|lacan|sifneos|davanloo|malan)\b/,
  /modelo humanist|terapia humanist|humanistico.existencial|terapia centrada en (la )?persona|\b(perls|frankl|yalom|binswanger)\b|\blogoterapia\b|neurosis noogen|tendencia actualizadora|consideracion positiva incondicional|\bawareness\b|terapia gestalt|terapia focalizada en (la )?emocion|\bgreenberg\b/,
  /modelo sistemic|terapia sistemic|terapia familiar|watzlawick|palo alto|escuela interaccional mri|\bhaley\b|\bminuchin\b|\bbowen\b|\bsatir\b|de shazer|white y epston|escuela de milan|selvini|cecchin|boscolo|pregunta milagro|paciente identificado|doble vinculo|equifinalidad|equicausalidad|morfogenesis|connotacion positiva|conversacion de reautoria|\bexternalizacion\b/,
  /\bpsicodrama\b|\bmoreno\b.{0,35}(dramatiz|roles|espejo|soliloquio)/
];

// Los esquemas indican expresamente que estos contenidos pertenecen a temas posteriores.
const deferredRule = /mentalizacion|cognitivo.?conductual|\btcc\b|tercera generacion|contextual|constructiv|acceptance and commitment|aceptacion y compromiso|terapia dialectic|\bdbt\b|analitico funcional|\bfap\b|metodologia de resultados|eficacia y efectividad|investigacion en terapia sistemica/;

const matchesIntroduction = (question) => {
  const statement = normalize(question.e);
  return !deferredRule.test(statement) && introductionRules.some((rule) => rule.test(statement));
};

const matchesAdultIntroduction = (question) => {
  if (!matchesIntroduction(question)) return false;
  const topics = Array.isArray(question.t) ? question.t : [];
  const statement = normalize(question.e);
  const alreadyGeneral = topics.includes("Técnicas psicológicas generales")
    || topics.includes("Componentes y eficacia de la psicoterapia");
  const unmistakableModelQuestion = /greenberg|frankl|palo alto|de shazer|minuchin|watzlawick|modelo psicodinam|mecanismos? de defensa|terapia centrada en (la )?persona/.test(statement);
  return alreadyGeneral || unmistakableModelQuestion;
};

const addIntroductionTopic = (question) => ({
  ...question,
  s: ADULT_SUBJECT,
  t: [INTRO_TOPIC, ...new Set((Array.isArray(question.t) ? question.t : []).filter((topic) => topic !== INTRO_TOPIC))]
});

const adults = readJson(adultPath);
const psychotherapies = readJson(psychotherapyPath);
const manifest = readJson(manifestPath);
const totalBefore = adults.length + psychotherapies.length;

const adultCandidateIds = new Set(adults.filter(matchesAdultIntroduction).map((question) => question.id));
const psychotherapyCandidateIds = new Set(psychotherapies.filter(matchesIntroduction).map((question) => question.id));

const updatedAdults = adults.map((question) => (
  adultCandidateIds.has(question.id) ? addIntroductionTopic(question) : question
));
const movedFromPsychotherapies = psychotherapies
  .filter((question) => psychotherapyCandidateIds.has(question.id))
  .map(addIntroductionTopic);
const remainingPsychotherapies = psychotherapies
  .filter((question) => !psychotherapyCandidateIds.has(question.id));
const finalAdults = [...updatedAdults, ...movedFromPsychotherapies];

const allIds = [...finalAdults, ...remainingPsychotherapies].map((question) => question.id);
if (new Set(allIds).size !== allIds.length) throw new Error("La reclasificación generaría identificadores duplicados.");
if (finalAdults.length + remainingPsychotherapies.length !== totalBefore) throw new Error("La reclasificación cambiaría el total de preguntas.");

const introductionQuestions = finalAdults.filter((question) => question.t?.includes(INTRO_TOPIC));
if (introductionQuestions.some((question) => deferredRule.test(normalize(question.e)))) {
  throw new Error("El apartado Introducción contiene preguntas reservadas para temas posteriores.");
}

manifest.subjects[ADULT_SUBJECT].count = finalAdults.length;
manifest.subjects[ADULT_SUBJECT].topics = [
  INTRO_TOPIC,
  ...manifest.subjects[ADULT_SUBJECT].topics.filter((topic) => topic !== INTRO_TOPIC)
];
manifest.subjects[PSYCHOTHERAPY_SUBJECT].count = remainingPsychotherapies.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + subject.count, 0);

fs.writeFileSync(adultPath, `${JSON.stringify(finalAdults)}\n`, "utf8");
fs.writeFileSync(psychotherapyPath, `${JSON.stringify(remainingPsychotherapies)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  topic: INTRO_TOPIC,
  taggedInTreatments: adultCandidateIds.size,
  movedFromPsychotherapies: movedFromPsychotherapies.length,
  introductionQuestions: introductionQuestions.length,
  treatmentsTotal: finalAdults.length,
  psychotherapiesTotal: remainingPsychotherapies.length,
  bankTotal: manifest.total
}, null, 2));
