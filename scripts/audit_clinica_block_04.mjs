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
const CIE11 = "Organización Mundial de la Salud (2022). CIE-11 para las estadísticas de mortalidad y morbilidad, capítulo 06.";

// Cada entrada ha sido contrastada antes de modificarla. Las reubicaciones
// no eliminan ni sustituyen identificadores: solo corrigen tema, limpieza OCR,
// justificación y referencia primaria.
const reviews = {
  "SM_JULIO_2_SOL_1_012": {
    topic: "Trastorno obsesivo-compulsivo y relacionados",
    c: "a",
    e: "Según la clasificación del DSM-5-TR, ¿en qué capítulo se incluye el trastorno de acumulación?",
    o: { d: "Trastornos de ansiedad." },
    x: "El trastorno de acumulación se incluye en el capítulo de trastorno obsesivo-compulsivo y trastornos relacionados del DSM-5-TR.",
    r: `${DSM} p. 263.`,
  },
  "SM_JULIO_2_SOL_1_054": {
    topic: "Trastorno obsesivo-compulsivo y relacionados",
    c: "c",
    e: "Según el DSM-5-TR, ¿qué diagnóstico corresponde a una persona que se muerde las uñas recurrentemente, intenta dejar de hacerlo y experimenta malestar clínicamente significativo?",
    o: { d: "Trastorno obsesivo-compulsivo." },
    x: "Morderse las uñas de forma recurrente, con intentos de reducir o abandonar la conducta y malestar o deterioro significativo, se clasifica como conducta repetitiva centrada en el cuerpo dentro de otro trastorno obsesivo-compulsivo y relacionado especificado.",
    r: `${DSM} pp. 263 y 284.`,
  },
  "SmCm30PIR2025 (1)_033": {
    topic: "Trastorno obsesivo-compulsivo y relacionados",
    c: "a",
    e: "Según el modelo explicativo de Salkovskis para el TOC, ¿qué paso media entre la aparición de una cognición intrusiva y el desarrollo de la compulsión?",
    x: "En el modelo cognitivo de Salkovskis, la valoración disfuncional de la intrusión —en especial la responsabilidad y la amenaza atribuidas— media entre el pensamiento intruso y las conductas compulsivas de neutralización.",
    r: `${BELLOCH} vol. II, cap. 5, pp. 179 y 182.`,
  },
  AGOSTO2_043: {
    topic: "Trastornos bipolares y relacionados",
    c: "a",
    e: "¿En cuál de los siguientes casos se puede recomendar el uso de antidepresivos en el trastorno bipolar?",
    x: "En el trastorno bipolar, los antidepresivos pueden utilizarse junto a un regulador del estado de ánimo o a un antipsicótico atípico. No se recomiendan en cicladores rápidos, episodios mixtos ni para prevenir recaídas depresivas en el trastorno bipolar I.",
    r: `${BELLOCH} vol. II, tabla 7.14, p. 288.`,
  },
  AGOSTO2_047: {
    topic: "Trastornos bipolares y relacionados",
    c: "a",
    e: "Entre las características diferenciales de la depresión unipolar y bipolar, ¿cuál es más frecuente en las depresiones unipolares?",
    x: "El insomnio es más frecuente en la depresión unipolar. El retraso psicomotor, la labilidad emocional y los síntomas atípicos son más característicos de la depresión bipolar.",
    r: `${BELLOCH} vol. II, tabla 7.2, p. 271.`,
  },
  AGOSTO2_056: {
    topic: "Trastornos bipolares y relacionados",
    c: "c",
    e: "¿Cuál de los siguientes antipsicóticos es recomendable en la manía aguda eufórica con predominio de insomnio, ansiedad, tensión interna y desinhibición?",
    x: "En una manía aguda eufórica con insomnio, ansiedad, tensión interna y desinhibición se recomiendan antipsicóticos atípicos sedativos; entre las alternativas, corresponde la clozapina.",
    r: `${BELLOCH} vol. II, tabla 7.16, p. 289.`,
  },
  "SM_ENERO_1_SOL_1_108": {
    topic: "Trastornos destructivos, del control de los impulsos y de la conducta",
    c: "b",
    e: "¿Cuál de los siguientes diagnósticos es frecuentemente comórbido con la piromanía?",
    o: { d: "Bulimia nerviosa y trastorno dismórfico corporal." },
    x: "La piromanía presenta alta concurrencia con trastornos por consumo de sustancias, trastorno por juego, trastornos depresivos o bipolares y otros trastornos disruptivos, del control de los impulsos y de la conducta.",
    r: `${DSM} p. 539.`,
  },
  JULIO2_014: {
    topic: "Trastornos destructivos, del control de los impulsos y de la conducta",
    c: "c",
    e: "Según el DSM-5-TR, señale la opción correcta respecto al trastorno explosivo intermitente:",
    o: {
      a: "Los trastornos del estado de ánimo, los trastornos de ansiedad y los trastornos por consumo de sustancias se asocian al trastorno explosivo intermitente, aunque su inicio suele ser más temprano.",
      b: "El inicio del comportamiento agresivo impulsivo, problemático y recurrente es menos frecuente en la infancia tardía o la adolescencia.",
      c: "El trastorno explosivo intermitente parece seguir un curso crónico y persistente durante muchos años.",
      d: "El trastorno explosivo intermitente es más prevalente en personas mayores de 50 años que en personas jóvenes.",
    },
    x: "El trastorno explosivo intermitente suele iniciarse en la infancia tardía o la adolescencia y puede seguir un curso crónico y persistente durante años.",
    r: `${DSM} p. 528.`,
  },
  JULIO2_059: {
    topic: "Trastornos destructivos, del control de los impulsos y de la conducta",
    c: "a",
    e: "Según la CIE-11, ¿cuál de los siguientes trastornos pertenece a los trastornos del comportamiento disruptivo y disocial?",
    o: {
      a: "Trastorno oposicionista desafiante.",
      b: "Trastorno explosivo intermitente.",
      c: "Piromanía.",
      d: "Cleptomanía.",
    },
    x: "En la CIE-11, el trastorno oposicionista desafiante pertenece a los trastornos del comportamiento disruptivo y disocial. El explosivo intermitente, la piromanía y la cleptomanía se agrupan entre los trastornos del control de los impulsos.",
    r: `${CIE11} códigos 6C90 y 6C70–6C73.`,
  },
  AGOSTO2_060: {
    topic: "Trastornos de la personalidad",
    c: "b",
    e: "¿En qué trastorno de personalidad aparece en el DSM-5-TR la descripción «no desea ni disfruta las relaciones íntimas, incluido formar parte de una familia»?",
    x: "La formulación corresponde al primer criterio del trastorno de la personalidad esquizoide.",
    r: `${DSM} p. 741.`,
  },
  JUNIO1_093: {
    topic: "Trastornos de la personalidad",
    c: "b",
    e: "¿Qué trastornos de personalidad no se mantienen como diagnósticos específicos en el modelo alternativo del DSM-5-TR?",
    o: { d: "Paranoide, histriónico, evitativo y dependiente." },
    x: "El modelo alternativo del DSM-5-TR define seis trastornos específicos: antisocial, evitativo, límite, narcisista, obsesivo-compulsivo y esquizotípico. Los trastornos paranoide, esquizoide, histriónico y dependiente se representan mediante trastorno de personalidad especificado por rasgos.",
    r: `${DSM} p. 891.`,
  },
  JULIO1_116: {
    topic: "Trastornos neurocognitivos",
    c: "c",
    e: "Respecto al diagnóstico de trastorno neurocognitivo (TNC) en el DSM-5-TR, indique la opción correcta:",
    o: { c: "En el TNC leve, además de especificar la etiología, se especifica si cursa con o sin alteración del comportamiento." },
    x: "En el TNC leve se especifica la etiología y si cursa con o sin alteración del comportamiento. La gravedad leve, moderada o grave solo se especifica en el TNC mayor. Ambos diagnósticos requieren evidencia objetiva de declive cognitivo.",
    r: `${DSM} pp. 679-681.`,
  },
  SmCm06PIR2025_002: {
    topic: "Trastornos neurocognitivos",
    c: "b",
    e: "¿Qué dominio neurocognitivo está afectado si una persona mayor con TNC leve refiere mayor fatiga por el esfuerzo adicional necesario para organizar, planificar y tomar decisiones?",
    x: "Organizar, planificar y tomar decisiones corresponden al dominio de función ejecutiva. En el TNC leve, estas tareas pueden requerir más tiempo, esfuerzo o estrategias compensatorias.",
    r: `${DSM} p. 669.`,
  },
  SmCm29PIR2025_082: {
    topic: "Trastornos neurocognitivos",
    c: "b",
    e: "¿En qué trastorno neurocognitivo es característica una demencia intensa y rápidamente progresiva, con signos motores y hallazgos particulares en el EEG, como ondas trifásicas?",
    o: { d: "Trastorno neurocognitivo mayor frontotemporal." },
    x: "La enfermedad por priones se caracteriza por progresión rápida, signos motores como ataxia o mioclonías y, en algunos casos, descargas agudas trifásicas y sincrónicas en el EEG.",
    r: `${DSM} pp. 721-723.`,
  },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_060": {
    topic: "Trastornos neurocognitivos",
    c: "d",
    e: "En el trastorno neurocognitivo mayor o leve con cuerpos de Lewy, ¿cuál de las siguientes es una característica diagnóstica sugestiva?",
    o: { d: "Sensibilidad neuroléptica grave." },
    x: "En el TNC con cuerpos de Lewy, las características esenciales son la cognición fluctuante, las alucinaciones visuales recurrentes y el parkinsonismo espontáneo. La sensibilidad neuroléptica grave es una característica sugestiva.",
    r: `${DSM} p. 699.`,
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
  if (!topics.has(review.topic)) throw new Error(`El tema no existe: ${review.topic}`);
  if (question.c !== review.c) throw new Error(`La clave original de ${question.id} no coincide con la revisión.`);
  const finalQuestion = {
    ...question,
    s: CLINICAL,
    t: [review.topic],
    e: review.e || question.e,
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

fs.writeFileSync(clinicalPath, `${JSON.stringify(finalQuestions)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicología Clínica 04 — TOC, bipolaridad, conducta, personalidad y neurocognición",
  reviewed: reviewed.length,
  corrected: reviewed.length,
  preservedQuestionIds: true,
}, null, 2));
