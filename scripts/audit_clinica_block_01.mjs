import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicologia_clinica.json");

const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const edits = {
  PERSEV_JUL25_D2_054: {
    t: ["Trastornos neurocognitivos"],
    e: "¿Cuál de las siguientes es una característica diagnóstica sugestiva del trastorno neurocognitivo mayor o leve con cuerpos de Lewy?",
    o: {
      a: "Cognición fluctuante con variaciones pronunciadas de la atención y el estado de alerta.",
      b: "Características espontáneas de parkinsonismo, con inicio posterior a la evolución del declive cognitivo.",
      c: "Cumple los criterios de trastorno del comportamiento del sueño REM.",
      d: "Alucinaciones visuales recurrentes, bien formadas y detalladas.",
    },
    c: "c",
    x: "El trastorno del comportamiento del sueño REM es una característica diagnóstica sugestiva. La cognición fluctuante, las alucinaciones visuales recurrentes y el parkinsonismo espontáneo son características diagnósticas esenciales.",
    r: `${dsm} Trastorno neurocognitivo mayor o leve con cuerpos de Lewy, p. 699.`,
    v: "VALIDADA_ORIGINAL",
  },
  PERSEV_JUL25_D2_060: {
    t: ["Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos"],
    e: "En el trastorno delirante se describe la posibilidad de que los pacientes presenten introspección fáctica. ¿A qué hace referencia este término?",
    o: {
      a: "Los individuos con trastorno delirante pueden ser capaces de describir objetivamente que los demás ven sus creencias como irracionales, pero no pueden aceptarlo por sí mismos.",
      b: "Los individuos con trastorno delirante no son capaces de describir objetivamente que los demás ven sus creencias como irracionales y no pueden aceptarlo por sí mismos.",
      c: "Los individuos con trastorno delirante pueden ser capaces de describir objetivamente que los demás ven sus creencias como irracionales y pueden aceptarlo por sí mismos.",
      d: "Los individuos con trastorno delirante no son capaces de describir objetivamente que los demás ven sus creencias como irracionales, pero pueden aceptarlo por sí mismos.",
    },
    c: "a",
    x: "Puede existir una introspección fáctica: la persona reconoce que otros consideran irracional su creencia, pero no puede aceptarlo como verdadero para sí misma. Esto no equivale a una introspección genuina.",
    r: `${dsm} Trastorno delirante, p. 107.`,
    v: "VALIDADA_ORIGINAL",
  },
  PERSEV_JUL25_D2_063: {
    t: ["Trastorno obsesivo-compulsivo y relacionados"],
    e: "La decisión de separar el trastorno obsesivo-compulsivo (TOC) de los trastornos de ansiedad en las clasificaciones diagnósticas ha dado lugar a un amplio debate. Señala una razón que avala específicamente esa separación.",
    o: {
      a: "La persistencia de los rituales no solo se explica por la necesidad de disminuir la ansiedad, sino también por la necesidad de que el comportamiento esté «completo o acabado».",
      b: "La exposición con prevención de respuesta está indicada para la excoriación y la tricotilomanía.",
      c: "Existe evidencia suficiente de que la impulsividad y la compulsividad son los extremos de un único continuo.",
      d: "La tasa de comorbilidad entre los trastornos del espectro obsesivo-compulsivo es mayor que la existente entre el TOC y los trastornos de ansiedad.",
    },
    c: "a",
    x: "En muchas personas con TOC, los rituales persisten por la necesidad de completar o terminar la conducta, y no solo para reducir ansiedad. Esta motivación, junto con el papel del asco y las dificultades de inhibición, apoya distinguir el TOC de los trastornos de ansiedad.",
    r: "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. II, 4.ª ed., capítulo 5: Trastorno obsesivo-compulsivo y trastornos relacionados, pp. 156-157.",
    v: "VALIDADA_ORIGINAL",
  },
  AGOSTO2_063: {
    t: ["Trastornos de la conducta alimentaria y de la ingestión de alimentos"],
    e: "¿Cuál de los siguientes factores se asocia con un mayor riesgo de desarrollar bulimia nerviosa?",
    o: {
      a: "El trastorno se presenta en algunas familias, lo que podría reflejar influencias genéticas aditivas.",
      b: "Las personas con rasgos perfeccionistas en la infancia tienen mayor riesgo de desarrollar anorexia nerviosa.",
      c: "Las profesiones y aficiones que alientan la delgadez, como ser modelo o deportista de élite, se relacionan con un mayor riesgo de anorexia nerviosa.",
      d: "La obesidad en la infancia aumenta el riesgo de desarrollar bulimia nerviosa.",
    },
    c: "d",
    x: "Entre los factores genéticos y fisiológicos de riesgo para la bulimia nerviosa, el DSM-5-TR incluye la obesidad en la infancia y el desarrollo puberal temprano. Las demás alternativas corresponden a factores descritos para otros trastornos de la conducta alimentaria.",
    r: `${dsm} Bulimia nerviosa: factores de riesgo y pronóstico, p. 390.`,
    v: "VALIDADA_ORIGINAL",
  },
  MAYO2_045: {
    t: ["Disfunciones sexuales"],
    e: "Al diagnosticar una disfunción sexual según el DSM-5-TR, existen especificadores relacionados con la evolución del síntoma, su patrón generalizado o situacional y la gravedad. ¿En qué disfunción sexual no se especifica el carácter generalizado o situacional?",
    o: {
      a: "Eyaculación retardada.",
      b: "Trastorno eréctil.",
      c: "Trastorno orgásmico femenino.",
      d: "Trastorno de dolor génito-pélvico/penetración.",
    },
    c: "d",
    x: "El trastorno de dolor génito-pélvico/penetración solo incorpora los especificadores de por vida/adquirido y de gravedad actual. No incluye el especificador generalizado/situacional, presente en las otras disfunciones propuestas.",
    r: `${dsm} Trastorno de dolor génito-pélvico/penetración, p. 494.`,
    v: "VALIDADA_ORIGINAL",
  },
  "ABRIL-UNO-24_COMENTADO_062": {
    t: ["Trastornos de la personalidad"],
    e: "Señala la afirmación correcta sobre el trastorno de la personalidad narcisista.",
    o: {
      a: "La prevalencia es del 75 % en mujeres.",
      b: "Su autoestima es casi siempre muy frágil.",
      c: "Tiene empatía, pero explota las relaciones interpersonales.",
      d: "No envidia a los demás porque tiene una actitud arrogante.",
    },
    c: "b",
    x: "El DSM-5-TR describe una autoestima casi siempre muy frágil en el trastorno de la personalidad narcisista. El trastorno se caracteriza por falta de empatía; además, puede existir envidia y la mayoría de los diagnósticos se realizan en varones.",
    r: `${dsm} Trastorno de la personalidad narcisista, p. 761.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm7PIR2024_039: {
    t: ["Trastornos de la personalidad"],
    e: "Según el modelo alternativo del DSM-5-TR para los trastornos de la personalidad, ¿en qué dominios de rasgos patológicos destacan las personas con trastorno límite de la personalidad?",
    o: {
      a: "Afectividad negativa y desapego.",
      b: "Afectividad negativa, desinhibición y antagonismo.",
      c: "Desinhibición, antagonismo y desapego.",
      d: "Afectividad negativa y psicoticismo.",
    },
    c: "b",
    x: "En el modelo alternativo, el trastorno límite de la personalidad se asocia a rasgos desadaptativos específicos de afectividad negativa, antagonismo y/o desinhibición. El psicoticismo puede especificarse, pero no forma parte de sus criterios de rasgos necesarios.",
    r: `${dsm} Modelo alternativo para los trastornos de la personalidad: trastorno límite de la personalidad, pp. 886-887.`,
    v: "VALIDADA_ORIGINAL",
  },
};

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
if (questions.length !== idsBefore.size) throw new Error("El banco ya contenía identificadores duplicados.");

const missing = Object.keys(edits).filter((id) => !idsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const next = questions.map((question) => {
  const edit = edits[question.id];
  return edit ? { ...question, ...edit, o: edit.o } : question;
});

if (next.length !== questions.length) throw new Error("La auditoría modificaría el total de preguntas.");
const idsAfter = new Set(next.map((question) => question.id));
if (idsAfter.size !== idsBefore.size || [...idsBefore].some((id) => !idsAfter.has(id))) {
  throw new Error("La auditoría modificaría identificadores de preguntas.");
}
for (const [id, edit] of Object.entries(edits)) {
  const question = next.find((candidate) => candidate.id === id);
  if (!question.x || !question.r || question.v !== "VALIDADA_ORIGINAL") {
    throw new Error(`La validación de ${id} no está completa.`);
  }
  if (question.t[0] !== edit.t[0]) throw new Error(`No se aplicó el tema de ${id}.`);
}

fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Clínica 01 — DSM-5-TR",
  validated: Object.keys(edits).length,
  preservedQuestionCount: next.length,
  preservedIds: true,
  correctedIds: Object.keys(edits),
}, null, 2));
