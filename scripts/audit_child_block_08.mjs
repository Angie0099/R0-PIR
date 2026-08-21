import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const CHILD = "Psicopatología Infantil";
const DSM = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const BELLOCH = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";

// Se excluyen expresamente los ítems con porcentajes variables, criterios
// incompletos o fuentes no originales aún no contrastadas. Este bloque solo
// revisa formulaciones defendibles directamente con DSM-5-TR o Belloch.
const reviews = {
  "Simu 12 comentado_090": {
    topic: "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles",
    c: "a",
    e: "¿Cuál de las siguientes afirmaciones sobre el trastorno de evitación/restricción de la ingesta de alimentos es correcta según el DSM-5-TR?",
    x: "En el ARFID, la alteración de la alimentación debe asociarse al menos a una consecuencia del criterio A: pérdida de peso significativa, deficiencia nutricional, dependencia de alimentación enteral o suplementos, o interferencia marcada en el funcionamiento psicosocial. Por ello, puede diagnosticarse sin pérdida de peso ni alimentación enteral si concurren las otras consecuencias indicadas.",
    r: `${DSM} p. 376.`,
  },
  "SmCm12PIR2024 2_184": {
    topic: "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles",
    c: "a",
    e: "¿Cuál de las siguientes afirmaciones sobre el trastorno de evitación/restricción de la ingesta de alimentos es correcta según el DSM-5-TR?",
    x: "En el ARFID, la alteración de la alimentación debe asociarse al menos a una consecuencia del criterio A: pérdida de peso significativa, deficiencia nutricional, dependencia de alimentación enteral o suplementos, o interferencia marcada en el funcionamiento psicosocial. Por ello, puede diagnosticarse sin pérdida de peso ni alimentación enteral si concurren las otras consecuencias indicadas.",
    r: `${DSM} p. 376.`,
  },
  "Simu 16 comentado_197": {
    topic: "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles",
    c: "d",
    e: "El trastorno de evitación/restricción de la ingesta de alimentos, según el DSM-5-TR, ¿debe tener una duración mínima?",
    o: { a: "Un mes.", b: "Seis meses.", c: "Un año.", d: "No tiene un criterio de duración mínima." },
    x: "El DSM-5-TR no establece un criterio de duración mínima para el ARFID; exige una alteración de la alimentación persistente con las consecuencias definidas en el criterio A.",
    r: `${DSM} p. 376.`,
  },
  SmCm16PIR2025_193: {
    topic: "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles",
    c: "d",
    e: "El trastorno de evitación/restricción de la ingesta de alimentos, según el DSM-5-TR, ¿debe tener una duración mínima?",
    o: { a: "Un mes.", b: "Seis meses.", c: "Un año.", d: "No tiene un criterio de duración mínima." },
    x: "El DSM-5-TR no establece un criterio de duración mínima para el ARFID; exige una alteración de la alimentación persistente con las consecuencias definidas en el criterio A.",
    r: `${DSM} p. 376.`,
  },
  SmCm14PIR2025_203: {
    topic: "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles",
    c: "a",
    e: "Sobre el trastorno por rumiación, señale la opción correcta:",
    o: {
      a: "Suele aparecer en el segundo semestre de vida, típicamente entre los 3 y los 12 meses.",
      b: "Se manifiesta habitualmente al comienzo de la adolescencia, entre los 12 y los 14 años.",
      c: "Aparece solo después de los 5 años.",
      d: "Aparece típicamente en torno a los 3 años.",
    },
    x: "El trastorno por rumiación puede iniciarse en la infancia y aparece con frecuencia entre los 3 y los 12 meses. También puede presentarse en otras etapas del desarrollo, pero esa es la presentación típica indicada.",
    r: `${DSM} capítulo «Trastorno por rumiación».`,
  },
  "Simu 14 comentado _032": {
    topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles",
    c: "d",
    e: "En el trastorno de desregulación disruptiva del estado de ánimo, ¿con cuál de los siguientes diagnósticos no puede establecerse comorbilidad?",
    x: "El DSM-5-TR permite la comorbilidad del trastorno de desregulación disruptiva del estado de ánimo con TDAH, trastorno de conducta y depresión mayor. No debe coexistir con trastorno negativista desafiante; si se cumplen ambos conjuntos de criterios, se diagnostica solo el trastorno de desregulación disruptiva del estado de ánimo.",
    r: `${DSM} capítulo «Trastorno de desregulación disruptiva del estado de ánimo», p. 519.`,
  },
  SmCm1PIR2024_144: {
    topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles",
    c: "c",
    e: "Una adolescente de 14 años presenta conducta desafiante persistente, agresiones a compañeras, destrucción de propiedad, mentiras, robos y expulsiones escolares. ¿Cuál es el diagnóstico más compatible según el DSM-5-TR?",
    x: "El caso reúne conductas de agresión, destrucción de la propiedad, engaño o robo y deterioro escolar. El patrón es compatible con trastorno de conducta, no con trastorno negativista desafiante ni trastorno explosivo intermitente.",
    r: `${DSM} capítulo «Trastorno de conducta», pp. 531-534.`,
  },
  "SmCm20PIR2025 (1)_100": {
    topic: "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles",
    c: "b",
    e: "En relación con el trastorno de conducta, señale la afirmación incorrecta:",
    x: "La opción b es incorrecta: en el trastorno de conducta pueden producirse agresiones planificadas, además de actos impulsivos. Son frecuentes los problemas de interpretación de las intenciones ajenas, el riesgo suicida y la comorbilidad.",
    r: `${DSM} capítulo «Trastorno de conducta», pp. 531-534.`,
  },
  SmCm16PIR2025_191: {
    topic: "Trastornos depresivos y bipolares infantojuveniles",
    c: "a",
    e: "¿Entre qué edades puede realizarse por primera vez el diagnóstico de trastorno de desregulación disruptiva del estado de ánimo?",
    x: "El diagnóstico no debe realizarse por primera vez antes de los 6 años ni después de los 18 años. Además, la edad de inicio de los criterios A-E debe ser anterior a los 10 años.",
    r: `${DSM} capítulo «Trastorno de desregulación disruptiva del estado de ánimo», p. 519.`,
  },
  "SmCm30PIR2025 (1)_159": {
    topic: "Trastornos depresivos y bipolares infantojuveniles",
    c: "d",
    e: "Respecto al diagnóstico de los trastornos del estado de ánimo en niños, podemos afirmar que:",
    x: "En niños y adolescentes, el estado de ánimo irritable puede sustituir al estado de ánimo deprimido en el criterio de episodio depresivo mayor. Por ello, la opción d es correcta.",
    r: `${DSM} capítulo «Trastornos depresivos», criterio de episodio depresivo mayor.`,
  },
  "SmCm24PIR2025 (1)_181": {
    topic: "Trastornos depresivos y bipolares infantojuveniles",
    c: "c",
    e: "Señale la respuesta incorrecta sobre la depresión en la infancia:",
    x: "La opción c es incorrecta: antes de la pubertad la prevalencia de depresión es similar en niñas y niños. La mayor prevalencia en mujeres aparece a partir de la adolescencia.",
    r: `${DSM} capítulo «Trastorno depresivo mayor», apartado de prevalencia.`,
  },
  "SmCm27PIR2025 (1)_186": {
    topic: "Trastornos de eliminación infantojuveniles",
    c: "a",
    e: "Según el DSM-5-TR, ¿en qué sexo es más frecuente la enuresis nocturna?",
    x: "La enuresis nocturna es más frecuente en varones que en mujeres en la infancia.",
    r: `${DSM} capítulo «Enuresis», apartado de prevalencia.`,
  },
  "SmCm30PIR2025 (1)_067": {
    topic: "Trastornos de eliminación infantojuveniles",
    c: "c",
    e: "En el diagnóstico de enuresis según el DSM-5-TR, ¿cuál de estas afirmaciones es correcta?",
    x: "El criterio de frecuencia de dos episodios por semana durante al menos tres meses puede sustituirse por malestar clínicamente significativo o deterioro social, académico u otras áreas importantes. Los escapes pueden ser voluntarios o involuntarios y la edad cronológica mínima es de 5 años.",
    r: `${DSM} capítulo «Enuresis», criterios diagnósticos.`,
  },
  SmCm15PIR2025_174: {
    topic: "Trastornos de eliminación infantojuveniles",
    c: "a",
    e: "En relación con la enuresis primaria, señale la afirmación correcta:",
    o: {
      a: "Es más frecuente en varones y presenta una alta tasa de remisiones espontáneas.",
      b: "El diagnóstico de enuresis se realiza tanto cuando esta es orgánica como cuando es funcional.",
      c: "Se ha descartado la existencia de un patrón familiar en el trastorno.",
      d: "El biofeedback es el tratamiento empleado con mayor frecuencia.",
    },
    x: "La enuresis es más frecuente en varones y presenta remisiones espontáneas frecuentes. El DSM-5-TR también describe evidencia de agregación familiar; no se diagnostica cuando se explica por los efectos fisiológicos de una sustancia u otra afección médica.",
    r: `${DSM} capítulo «Enuresis», curso y prevalencia.`,
  },
  "Simu 7 comentado _112": {
    topic: "Trastorno obsesivo-compulsivo y relacionados infantojuveniles",
    c: "a",
    e: "En la infancia es importante diferenciar los rituales evolutivos normales de los compulsivos. Respecto a sus diferencias, señale la alternativa incorrecta:",
    x: "La opción a es incorrecta: los rituales evolutivos suelen ser transitorios, lúdicos y no generan una interferencia significativa. Las compulsiones buscan reducir el malestar y pueden producir ansiedad e irritabilidad al interrumpirse.",
    r: `${BELLOCH} vol. II, capítulo sobre trastorno obsesivo-compulsivo.`,
  },
  SmCm10PIR2025_045: {
    topic: "Trastorno obsesivo-compulsivo y relacionados infantojuveniles",
    c: "d",
    e: "Los rituales evolutivos normales, a diferencia de las conductas compulsivas del TOC, presentan una serie de características. Seleccione la opción correcta:",
    x: "Los rituales evolutivos suelen tener una finalidad lúdica, ser transitorios y no interferir de forma significativa. Las compulsiones se asocian a malestar, ansiedad e interferencia funcional.",
    r: `${BELLOCH} vol. II, capítulo sobre trastorno obsesivo-compulsivo.`,
  },
};

const questions = JSON.parse(fs.readFileSync(bancoPath, "utf8"));
const missing = Object.keys(reviews).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const finalQuestions = questions.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.c !== review.c) throw new Error(`La clave de ${question.id} no coincide con la revisión.`);
  const finalQuestion = {
    ...question,
    s: CHILD,
    t: [review.topic],
    e: review.e,
    o: review.o ? { ...question.o, ...review.o } : question.o,
    c: review.c,
    x: review.x,
    r: review.r,
    v: "CORREGIDA",
  };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
  }
  if (!finalQuestion.x || !finalQuestion.r) throw new Error(`Falta justificación o referencia en ${question.id}`);
  return finalQuestion;
});

if (finalQuestions.length !== questions.length) throw new Error("La auditoría alteraría el número de preguntas.");
const ids = new Set(finalQuestions.map((question) => question.id));
if (ids.size !== finalQuestions.length) throw new Error("La auditoría introduciría IDs duplicados.");
const reviewed = finalQuestions.filter((question) => Object.hasOwn(reviews, question.id));
if (reviewed.length !== Object.keys(reviews).length) throw new Error("No se aplicaron todas las revisiones.");

fs.writeFileSync(bancoPath, `${JSON.stringify(finalQuestions)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 08 — alimentación, conducta, afectividad, eliminación y rituales",
  reviewed: reviewed.length,
  corrected: reviewed.length,
  preservedQuestionIds: true,
}, null, 2));
