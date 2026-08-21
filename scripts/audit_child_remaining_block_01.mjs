import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const oddCore = {
  e: "Según el DSM-5-TR, un patrón de enfado o irritabilidad, discusiones o actitud desafiante, o conducta vengativa durante al menos seis meses caracteriza, si se cumplen los demás criterios, a:",
  o: { a: "Trastorno por déficit de atención/hiperactividad.", b: "Trastorno negativista desafiante.", c: "Trastorno de conducta.", d: "Discapacidad intelectual." },
  c: "b",
  x: "Este es el patrón nuclear del trastorno negativista desafiante. Requiere al menos cuatro síntomas de las categorías de enfado o irritabilidad, discusiones o actitud desafiante y conducta vengativa, y que se manifiesten con al menos una persona que no sea un hermano.",
  r: `${dsm} Trastorno negativista desafiante: criterios diagnósticos, p. 522.`,
  v: "CORREGIDA",
};

const edits = {
  "Simu 11 comentado_007": {
    e: "¿Cuál de las siguientes afirmaciones es correcta sobre el inicio del trastorno de conducta según el DSM-5-TR?",
    o: {
      a: "Solo puede comenzar después de los 18 años.",
      b: "Debe comenzar en la primera infancia si el menor es varón.",
      c: "Solo puede comenzar en la adolescencia si la menor es mujer.",
      d: "Puede iniciarse ya en los años preescolares, aunque los primeros síntomas significativos suelen aparecer entre la infancia media y la adolescencia media.",
    },
    c: "d",
    x: "El DSM-5-TR indica que el trastorno de conducta puede iniciarse en los años preescolares, aunque los primeros síntomas significativos suelen aparecer entre la infancia media y la adolescencia media.",
    r: `${dsm} Trastorno de conducta: desarrollo y curso, p. 534.`,
    v: "CORREGIDA",
  },
  "Simu 7 comentado _120": oddCore,
  SmCm7PIR2024_136: oddCore,
  "simu 9 comentado_109": {
    e: "¿Cuál de los siguientes no es un especificador del tipo de inicio del trastorno de conducta según el DSM-5-TR?",
    o: { a: "Tipo de inicio infantil.", b: "Tipo de inicio adolescente.", c: "Tipo de inicio adulto.", d: "Tipo de inicio no especificado." },
    c: "c",
    x: "El DSM-5-TR contempla los tipos de inicio infantil, adolescente y no especificado. No existe un tipo de inicio adulto.",
    r: `${dsm} Trastorno de conducta: especificadores del tipo de inicio, p. 531.`,
    v: "CORREGIDA",
  },
  SmCm09PIR2025_069: {
    e: "En el trastorno de conducta según el DSM-5-TR, ¿cuál de las siguientes afirmaciones es correcta?",
    o: {
      a: "A partir de los 18 años debe diferenciarse exclusivamente del trastorno de la personalidad narcisista.",
      b: "Se aplica el especificador de inicio infantil cuando ha aparecido al menos un síntoma característico antes de los 10 años.",
      c: "Se distinguen tres niveles de gravedad según el número de emociones prosociales presentes.",
      d: "El DSM-5-TR exige que algunos síntomas aparezcan antes de los 12 años, en lugar de antes de los 7 años.",
    },
    c: "b",
    x: "El especificador de inicio infantil se aplica cuando aparece al menos un síntoma característico de trastorno de conducta antes de los 10 años. La gravedad se determina por el daño causado a otras personas, animales o propiedad, no por el número de emociones prosociales.",
    r: `${dsm} Trastorno de conducta: especificadores, p. 531.`,
    v: "CORREGIDA",
  },
  "SmCm12PIR2024 2_182": {
    e: "Respecto a las características clínicas del trastorno negativista desafiante según el DSM-5-TR, señale la afirmación incorrecta.",
    o: {
      a: "Los síntomas pueden aparecer solo en casa y con miembros de la familia, pero no pueden limitarse exclusivamente a la interacción con hermanos.",
      b: "Los comportamientos deben ser egodistónicos.",
      c: "Es posible que aparezcan características conductuales sin problemas prominentes de estado de ánimo negativo.",
      d: "En menores de 5 años, el comportamiento debe aparecer casi todos los días durante al menos seis meses.",
    },
    c: "b",
    x: "La opción b es incorrecta: el DSM-5-TR no exige que los comportamientos sean egodistónicos; es frecuente que la persona los justifique. Las demás afirmaciones se ajustan a los criterios y características del trastorno negativista desafiante.",
    r: `${dsm} Trastorno negativista desafiante: criterios y características diagnósticas, pp. 522-523.`,
    v: "CORREGIDA",
  },
  SmCm15PIR2025_172: {
    e: "Señale la afirmación incorrecta sobre el trastorno de conducta según el DSM-5-TR.",
    o: {
      a: "Las personas con el especificador de emociones prosociales limitadas tienen mayor probabilidad de presentar inicio infantil y gravedad alta.",
      b: "La prevalencia se sitúa entre el 2 % y el 10 %, con una media estimada del 4 %, y es más frecuente en varones.",
      c: "El tipo de inicio infantil se aplica cuando aparece al menos un síntoma característico antes de los 6 años.",
      d: "El inicio infantil suele asociarse a peor pronóstico, más conductas delictivas y mayor comorbilidad con trastornos por consumo de sustancias.",
    },
    c: "c",
    x: "La opción c es incorrecta: el tipo de inicio infantil exige que aparezca al menos un síntoma característico antes de los 10 años, no antes de los 6. Las demás alternativas se corresponden con el DSM-5-TR.",
    r: `${dsm} Trastorno de conducta: especificadores, prevalencia y desarrollo y curso, pp. 531 y 533-534.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm18PIR2025_085: {
    e: "Respecto al trastorno negativista desafiante según el DSM-5-TR, señale la afirmación correcta.",
    o: {
      a: "Se caracteriza por un patrón de enfado o irritabilidad, discusiones o actitud desafiante, o venganza que dura más de tres meses.",
      b: "Los síntomas deben exhibirse durante la interacción con al menos una persona que no sea un hermano.",
      c: "Cuando los síntomas exceden el ámbito familiar y aparecen también en la escuela, se codifica como grave.",
      d: "Es más prevalente en varones en muestras de adolescentes y adultos.",
    },
    c: "b",
    x: "La opción b es correcta. El patrón debe durar al menos seis meses y los síntomas deben exhibirse durante la interacción con al menos una persona que no sea un hermano. Dos entornos indicarían gravedad moderada, no grave.",
    r: `${dsm} Trastorno negativista desafiante: criterios y especificación de gravedad, pp. 522-523.`,
    v: "CORREGIDA",
  },
  "SmCm21PIR2025 (2)_076": {
    e: "¿Cuál de las siguientes características no forma parte del especificador «con emociones prosociales limitadas» del trastorno de conducta?",
    o: { a: "Carente de empatía.", b: "Afecto aplanado.", c: "Falta de remordimiento o culpabilidad.", d: "Despreocupación por el rendimiento." },
    c: "b",
    x: "El DSM-5-TR enumera falta de remordimiento o culpabilidad, insensibilidad o falta de empatía, despreocupación por el rendimiento y afecto superficial o deficiente. El afecto aplanado no es uno de los cuatro indicadores.",
    r: `${dsm} Trastorno de conducta: especificador con emociones prosociales limitadas, pp. 531-532.`,
    v: "CORREGIDA",
  },
  "SmCm22PIR2025 (1)_164": {
    e: "Una adolescente pierde la calma, se enfada con frecuencia, discute con figuras de autoridad y culpa a otras personas de sus errores. Estas conductas se manifiestan en el colegio y en la familia durante más de seis meses y generan deterioro significativo en la convivencia y el funcionamiento escolar. ¿Qué diagnóstico es más compatible según el DSM-5-TR?",
    o: { a: "Trastorno negativista desafiante.", b: "Trastorno de conducta.", c: "Trastorno de desregulación disruptiva del estado de ánimo.", d: "Trastorno explosivo intermitente." },
    c: "a",
    x: "La adolescente presenta cuatro síntomas de trastorno negativista desafiante durante más de seis meses, en más de un entorno y con deterioro funcional: perder la calma, enfadarse, discutir con la autoridad y culpar a otros.",
    r: `${dsm} Trastorno negativista desafiante: criterios diagnósticos, pp. 522-523.`,
    v: "CORREGIDA",
  },
  "SmCm30PIR2025 (1)_160": {
    e: "Un niño presenta desde hace más de seis meses cuatro síntomas persistentes: pierde la calma, está enfadado o resentido, discute con figuras de autoridad y culpa a otros de sus errores. Las conductas generan deterioro familiar y escolar. ¿Qué diagnóstico es más compatible?",
    o: { a: "Trastorno de conducta.", b: "Trastorno negativista desafiante.", c: "Trastorno explosivo intermitente.", d: "Trastorno de desregulación disruptiva del estado de ánimo." },
    c: "b",
    x: "La información reformulada cumple el patrón, número de síntomas, duración y deterioro requeridos para el trastorno negativista desafiante.",
    r: `${dsm} Trastorno negativista desafiante: criterios diagnósticos, pp. 522-523.`,
    v: "CORREGIDA",
  },
  "Simu 13 comentado_077": {
    e: "En una polisomnografía nocturna, una latencia de sueño REM de 15 minutos o menos constituye uno de los hallazgos diagnósticos posibles de:",
    o: { a: "Síndrome de Pickwick.", b: "Síndrome de Kleine-Levin.", c: "Narcolepsia.", d: "Mioclonos nocturnos." },
    c: "c",
    x: "Una latencia de sueño REM nocturna de 15 minutos o menos forma parte de uno de los hallazgos diagnósticos posibles para la narcolepsia.",
    r: `${dsm} Narcolepsia: criterios diagnósticos, p. 422.`,
    v: "CORREGIDA",
  },
  "Simu 13 comentado_086": {
    e: "Sobre el trastorno de pesadillas según el DSM-5-TR, señale la afirmación incorrecta.",
    o: {
      a: "Consiste en sueños sumamente disfóricos que se recuerdan bien al despertar.",
      b: "Al despertarse, la persona se orienta rápidamente y está alerta.",
      c: "Debe atribuirse a los efectos fisiológicos de una sustancia.",
      d: "Suele aparecer durante la segunda mitad del período principal de sueño.",
    },
    c: "c",
    x: "La opción c es incorrecta: para diagnosticar trastorno de pesadillas, las pesadillas no deben atribuirse a los efectos fisiológicos de una sustancia. Suelen aparecer durante la segunda mitad del período principal de sueño y producir orientación y alerta rápidas al despertar.",
    r: `${dsm} Trastorno de pesadillas: criterios diagnósticos, p. 457.`,
    v: "CORREGIDA",
  },
  SmCm1PIR2024_145: {
    e: "¿Cuál de las siguientes afirmaciones es correcta respecto a los terrores nocturnos?",
    o: { a: "Se producen durante el sueño REM.", b: "Se producen hacia la mitad y el final de la noche.", c: "Suelen cursar con estados crepusculares prolongados.", d: "Se acompañan de signos de alerta autónoma, como midriasis, taquicardia o taquipnea." },
    c: "d",
    x: "Los terrores nocturnos son trastornos del despertar del sueño no REM y se acompañan de miedo intenso y signos de alerta autónoma, como midriasis, taquicardia, taquipnea y sudoración.",
    r: `${dsm} Trastornos del despertar del sueño no REM: terrores nocturnos, p. 452.`,
    v: "CORREGIDA",
  },
  "SmCm24PIR2025 (1)_184": {
    e: "Señale cuál de las siguientes alternativas no corresponde a los criterios diagnósticos del trastorno de evitación/restricción de la ingesta de alimentos (ARFID) según el DSM-5-TR.",
    o: { a: "Pérdida de peso o fracaso para alcanzar el peso esperado para la edad.", b: "Déficit nutricional significativo.", c: "Se produce exclusivamente en el curso de anorexia nerviosa o bulimia nerviosa.", d: "Interferencia importante en el funcionamiento psicosocial." },
    c: "c",
    x: "La opción c no corresponde al ARFID. El trastorno no debe producirse exclusivamente durante anorexia nerviosa o bulimia nerviosa ni acompañarse de una alteración de la experiencia del peso o la constitución corporal.",
    r: `${dsm} Trastorno de evitación/restricción de la ingesta de alimentos: criterios diagnósticos, p. 376.`,
    v: "VALIDADA_ORIGINAL",
  },
};

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
const missing = Object.keys(edits).filter((id) => !idsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);
const next = questions.map((question) => {
  const edit = edits[question.id];
  return edit ? { ...question, ...edit, o: edit.o } : question;
});
const idsAfter = new Set(next.map((question) => question.id));
if (next.length !== questions.length || idsAfter.size !== idsBefore.size || [...idsBefore].some((id) => !idsAfter.has(id))) {
  throw new Error("La auditoría modificaría el total o los identificadores de preguntas.");
}
for (const [id, edit] of Object.entries(edits)) {
  const question = next.find((candidate) => candidate.id === id);
  if (question.c !== edit.c || !question.x || !question.r || question.v !== edit.v) {
    throw new Error(`La revisión de ${id} no está completa.`);
  }
}
fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 07 — disruptivos, sueño y ARFID",
  reviewed: Object.keys(edits).length,
  corrected: Object.values(edits).filter((edit) => edit.v === "CORREGIDA").length,
  validated: Object.values(edits).filter((edit) => edit.v === "VALIDADA_ORIGINAL").length,
  preservedQuestionIds: true,
}, null, 2));
