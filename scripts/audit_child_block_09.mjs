import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const CHILD = "Psicopatología Infantil";
const DSM = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const CIE11 = "Organización Mundial de la Salud (2022). CIE-11 para las estadísticas de mortalidad y morbilidad, 6A02 Trastorno del espectro autista.";

// Solo se incluyen ítems que pueden contrastarse de forma directa con DSM-5-TR
// o CIE-11. Las preguntas de teorías históricas y los enunciados ambiguos
// permanecen pendientes para no forzar una validación.
const reviews = {
  "Simu 15 comentado_106": {
    topic: "Trastorno por déficit de atención con hiperactividad (TDAH)", c: "a", v: "CORREGIDA",
    e: "Paula tiene 7 años y presenta TDAH. ¿Qué conducta es un ejemplo de impulsividad según el DSM-5-TR?",
    o: {
      a: "Le cuesta esperar su turno en la cola del supermercado y se adelanta para colocar sus productos.",
      b: "Presenta rabietas frecuentes por dificultad para regular las emociones.",
      c: "Agrede físicamente a otros niños durante el juego.",
      d: "No termina los deberes por distraerse con la televisión o los ruidos de la calle.",
    },
    x: "La dificultad para esperar el turno es uno de los síntomas de hiperactividad-impulsividad del TDAH. Los demás ejemplos aluden a disregulación emocional, agresión o inatención.", r: `${DSM} p. 69, criterio A2.h.`,
  },
  SmCm1PIR2024_027: {
    topic: "Trastorno por déficit de atención con hiperactividad (TDAH)", c: "d", v: "CORREGIDA",
    e: "¿Cuál de las siguientes afirmaciones es correcta respecto al diagnóstico del TDAH?",
    o: {
      a: "Es indispensable aplicar las pruebas CARAS-R, d2, ENFEN y SENA.",
      b: "La información aportada por los progenitores no se considera fiable.",
      c: "Solo es necesario recoger información de la escuela en los casos dudosos.",
      d: "El diagnóstico es clínico; las pruebas pueden complementar la evaluación, pero no son diagnósticas por sí solas.",
    },
    x: "No existe ningún marcador biológico o prueba de neuroimagen que diagnostique el TDAH. La valoración clínica requiere confirmar síntomas y deterioro en más de un contexto mediante información de informantes pertinentes.", r: `${DSM} pp. 69-72.`,
  },
  SmCm22PIR2025_058: {
    topic: "Trastorno por déficit de atención con hiperactividad (TDAH)", c: "b", v: "CORREGIDA",
    e: "Entre los cambios introducidos en el DSM-5 respecto al diagnóstico del TDAH se encuentra:",
    o: {
      a: "El criterio de duración de los síntomas se modificó a seis meses.",
      b: "La edad de inicio se modificó a antes de los 12 años.",
      c: "Se eliminó la necesidad de observar síntomas en más de un contexto.",
      d: "El diagnóstico se mantuvo sin cambios respecto al DSM-IV-TR.",
    },
    x: "El DSM-5 elevó la edad de inicio requerida desde antes de los 7 años a antes de los 12 años. El DSM-5-TR mantiene el requisito de síntomas en dos o más contextos.", r: `${DSM} p. 69, criterio B.`,
  },
  "Simu 12 comentado_088": {
    topic: "Trastorno del espectro del autismo (TEA)", c: "a", v: "CORREGIDA",
    e: "En niños pequeños con trastorno del espectro autista, ¿cuál puede ser una característica temprana de la interacción social?",
    o: {
      a: "Falta de interés por los iguales y ausencia de juego compartido o imaginativo.",
      b: "Construcción repetitiva de torres o alineación de objetos sin finalidad funcional.",
      c: "Aprendizaje prematuro de todas las habilidades sociales.",
      d: "Alta coordinación motora desde el primer año de vida.",
    },
    x: "Una característica temprana puede ser el interés social ausente o reducido y la falta de juego social o imaginativo compartido. Los comportamientos repetitivos pueden estar presentes, pero la pregunta se refiere al dominio de interacción social.", r: `${DSM} pp. 61 y 63.`,
  },
  "SmCm20PIR2025 (1)_101": {
    topic: "Trastorno del espectro del autismo (TEA)", c: "b", v: "CORREGIDA",
    e: "¿Cuál de las siguientes afirmaciones es correcta respecto a las dificultades en la comunicación no verbal de las personas con TEA?",
    o: {
      a: "Suelen utilizar de forma adecuada el contacto visual y coordinar sin dificultad la comunicación verbal y no verbal.",
      b: "Pueden presentar integración reducida entre la comunicación verbal y no verbal, con dificultades en el contacto visual, los gestos o su coordinación con el contenido expresado.",
      c: "No presentan dificultades con los gestos ni con el contacto visual.",
      d: "En la adultez, la comunicación no verbal es siempre espontánea y no requiere esfuerzo consciente.",
    },
    x: "El criterio A2 del TEA incluye deficiencias en las conductas comunicativas no verbales utilizadas en la interacción social, como anomalías del contacto visual, el lenguaje corporal y el uso o comprensión de gestos.", r: `${DSM} p. 56, criterio A2.`,
  },
  SmCm14PIR2025_173: {
    topic: "Trastorno del espectro del autismo (TEA)", c: "a", v: "VALIDADA_ORIGINAL",
    e: "En cuanto a la prevalencia del TEA en la población general, según el DSM-5-TR, podemos afirmar que:",
    x: "El DSM-5-TR informa de una prevalencia de hasta el 1 % en países distintos de Estados Unidos, con una mediana mundial aproximada del 0,62 %.", r: `${DSM} p. 63.`,
  },
  "SmCm30PIR2025 (1)_165": {
    topic: "Trastornos de la comunicación", c: "b", v: "CORREGIDA",
    e: "Respecto a los trastornos de la comunicación, señale la afirmación correcta:",
    o: {
      a: "El trastorno de la comunicación social comparte con el TEA los intereses restringidos y los comportamientos repetitivos.",
      b: "La repetición de palabras completas monosilábicas puede ser un criterio del trastorno de la fluidez de inicio en la infancia.",
      c: "No puede diagnosticarse trastorno de la comunicación social si existe discapacidad intelectual.",
      d: "Según el DSM-5-TR, la prevalencia del trastorno fonológico en adultos es del 15 %.",
    },
    x: "La repetición de palabras completas monosilábicas figura entre las alteraciones de la fluidez que pueden caracterizar el trastorno de la fluidez de inicio en la infancia. El trastorno de la comunicación social se diagnostica cuando las dificultades superan las esperables por el nivel de desarrollo, incluida la discapacidad intelectual.", r: `${DSM} p. 52.`,
  },
  SmCm08PIR2025_198: {
    topic: "Trastorno del espectro del autismo (TEA)", c: "a", v: "CORREGIDA",
    e: "Señale cuál de las siguientes afirmaciones sobre el trastorno del espectro autista no se corresponde con la CIE-11:",
    o: {
      a: "La CIE-11 conserva el término «autismo atípico» como diagnóstico dentro del trastorno del espectro autista.",
      b: "En el trastorno del espectro autista se especifica la presencia o ausencia de trastorno del desarrollo intelectual.",
      c: "En el trastorno del espectro autista se especifica la presencia o ausencia de deterioro del lenguaje funcional.",
      d: "El diagnóstico puede consignarse junto a un trastorno del desarrollo intelectual cuando se cumplen ambos conjuntos de criterios.",
    },
    x: "La CIE-11 no mantiene «autismo atípico» como diagnóstico separado. El código 6A02 especifica la presencia o ausencia de trastorno del desarrollo intelectual y de deterioro del lenguaje funcional.", r: CIE11,
  },
  SmCm22PIR2025_057: {
    topic: "Trastorno del espectro del autismo (TEA)", c: "b", v: "CORREGIDA",
    e: "Señale la opción correcta sobre el diagnóstico del trastorno del espectro autista según la CIE-11:",
    o: {
      a: "La CIE-11 no introduce cambios respecto a la CIE-10 en los criterios de TEA.",
      b: "La CIE-11 incluye subtipos según la presencia o ausencia de trastorno del desarrollo intelectual y deterioro del lenguaje funcional.",
      c: "La CIE-11 especifica la gravedad exclusivamente según el nivel de apoyos.",
      d: "La CIE-11 ubica el TEA fuera de los trastornos del neurodesarrollo.",
    },
    x: "La CIE-11 clasifica el TEA entre los trastornos del neurodesarrollo y diferencia las categorías según la presencia o ausencia de trastorno del desarrollo intelectual y deterioro del lenguaje funcional.", r: CIE11,
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
    v: review.v,
  };
  for (const key of ["a", "b", "c", "d"]) if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
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
  block: "Psicopatología Infantil 09 — TDAH, TEA y comunicación",
  reviewed: reviewed.length,
  corrected: reviewed.filter((question) => question.v === "CORREGIDA").length,
  validated: reviewed.filter((question) => question.v === "VALIDADA_ORIGINAL").length,
  preservedQuestionIds: true,
}, null, 2));
