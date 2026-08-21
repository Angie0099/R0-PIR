import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CLINICAL = "Psicología Clínica";
const DSM = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const BELLOCH = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";

const reviews = {
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_053": {
    topic: "Trastornos parafílicos", c: "d", v: "CORREGIDA",
    e: "¿Qué trastorno parafílico tiene entre sus factores de riesgo la asociación con comportamiento antisocial y posibles alteraciones del neurodesarrollo prenatal?",
    o: { d: "Trastorno de pedofilia." },
    x: "El comportamiento antisocial se considera un factor de riesgo para el trastorno de pedofilia en hombres con pedofilia. También existen indicios de que una alteración del neurodesarrollo prenatal aumenta la probabilidad de una orientación pedófila.", r: `${DSM} capítulo «Trastorno de pedofilia», factores de riesgo y pronóstico.`,
  },
  SM_JUNIO_1_SOL_1_190: {
    topic: "Trastornos parafílicos", c: "a", v: "CORREGIDA",
    e: "Señale la afirmación correcta sobre los trastornos parafílicos:",
    x: "El trastorno de pedofilia se asocia a alteraciones del neurodesarrollo prenatal y al comportamiento antisocial. La asfixiofilia es un especificador del masoquismo sexual, el frotteurismo es mucho más frecuente en hombres y el fetichismo solo rara vez se asocia a afecciones neurológicas.", r: `${DSM} capítulo «Trastornos parafílicos».`,
  },
  SmCm19PIR2024_055: {
    topic: "Trastorno obsesivo-compulsivo y relacionados", c: "c", v: "CORREGIDA",
    e: "Los modelos cognitivos dan importancia a las experiencias tempranas en la predisposición al TOC, ya que proporcionan creencias sobre el daño y la responsabilidad. ¿Cuál de las siguientes es una de esas creencias?",
    x: "La sobreestimación de la amenaza es una creencia central en los modelos cognitivos del TOC. Los distractores invierten las formulaciones habituales: responsabilidad exagerada, necesidad de controlar los pensamientos e intolerancia a la incertidumbre.", r: `${BELLOCH} vol. II, cap. 5, pp. 179-182.`,
  },
  "SmCm21PIR2025 (2)_049": {
    topic: "Trastornos de síntomas somáticos y relacionados", c: "d", v: "REVISAR_FUENTE",
    e: "Un concepto ligado a la hipocondría y cercano al trastorno obsesivo-compulsivo es el de cibercondría. ¿Cuál de las siguientes afirmaciones no es correcta?",
    o: { d: "La persona mantiene presentes sus intereses y actividades diarias, a diferencia de las personas con hipocondría." },
  },
};

const questions = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const missing = Object.keys(reviews).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);
const topics = new Set(manifest.subjects[CLINICAL].topics);
const finalQuestions = questions.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.c !== review.c) throw new Error(`La clave de ${question.id} no coincide con la revisión.`);
  if (!topics.has(review.topic)) throw new Error(`El tema no existe: ${review.topic}`);
  const finalQuestion = {
    ...question,
    s: CLINICAL,
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
});

if (finalQuestions.length !== questions.length) throw new Error("La auditoría alteraría el número de preguntas.");
const ids = new Set(finalQuestions.map((question) => question.id));
if (ids.size !== finalQuestions.length) throw new Error("La auditoría introduciría IDs duplicados.");
for (const [id, review] of Object.entries(reviews)) {
  const question = finalQuestions.find((candidate) => candidate.id === id);
  if (!question || question.t[0] !== review.topic || question.v !== review.v) throw new Error(`No se aplicó la revisión de ${id}.`);
}

fs.writeFileSync(clinicalPath, `${JSON.stringify(finalQuestions)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicología Clínica 06 — parafilias, TOC y cibercondría",
  corrected: 3,
  deferred: 1,
  preservedQuestionIds: true,
}, null, 2));
