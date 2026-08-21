import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicologia_clinica.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const belloch2 = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. II, 4.ª ed.";
const belloch1 = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I, 4.ª ed.";

const edits = {
  "PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_141": {
    t: ["Trastornos depresivos"],
    e: "Entre los factores psicológicos de vulnerabilidad identificados para la depresión, ¿qué teoría postula que los déficits en habilidades sociales y de solución de problemas pueden favorecer el desarrollo de la depresión?",
    o: {
      a: "Modelo de autocontrol de la depresión de Rehm (1977).",
      b: "Teoría reformulada de la indefensión aprendida de Abramson et al. (1978).",
      c: "Teoría conductual y cognitivo-conductual de la depresión de Lewinsohn (1974; Lewinsohn et al., 1985).",
      d: "Teoría de los estilos de respuesta de Nolen-Hoeksema (1991).",
    },
    c: "c",
    x: "Los déficits en habilidades sociales y en solución de problemas se sitúan en el modelo conductual y cognitivo-conductual de Lewinsohn. Rehm se centra en el autocontrol, Abramson et al. en el estilo atribucional depresivo y Nolen-Hoeksema en las respuestas rumiativas.",
    r: `${belloch2} Cap. 6, Trastornos depresivos, pp. 248 y 250.`,
    v: "CORREGIDA",
  },
  SM_JULIO_1_SOL_1_030: {
    t: ["Psicopatología del pensamiento"],
    e: "Raúl recuerda que el dolor de barriga que tuvo hace dos días se debía a que unos extraterrestres le habían introducido un huevo en su interior. ¿Qué tipo de delirio primario presenta?",
    o: {
      a: "Intuición delirante o delirio autóctono.",
      b: "Percepción delirante.",
      c: "Atmósfera o humor delirante.",
      d: "Recuerdo delirante o retrospectivo.",
    },
    c: "d",
    x: "El recuerdo delirante consiste en reconstruir delirantemente un recuerdo real o en recordar algo claramente imposible. En este caso, el dolor abdominal previo recibe retrospectivamente una explicación delirante.",
    r: `${belloch1} Cap. 8, Psicopatología del pensamiento, pp. 301-303.`,
    v: "VALIDADA_ORIGINAL",
  },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_044": {
    t: ["Trastornos de ansiedad"],
    e: "Según el DSM-5-TR, ¿en cuál de los siguientes trastornos de ansiedad se asocian la inhibición conductual, la afectividad negativa, la evitación del daño, la dependencia de recompensas y el sesgo atencional hacia las amenazas como factores temperamentales?",
    o: {
      a: "Trastorno de ansiedad generalizada.",
      b: "Trastorno de ansiedad social.",
      c: "Agorafobia.",
      d: "Trastorno de pánico.",
    },
    c: "a",
    x: "El DSM-5-TR enumera conjuntamente esos cinco factores temperamentales en el trastorno de ansiedad generalizada. Los demás trastornos pueden compartir algunos, pero no todo ese conjunto.",
    r: `${dsm} Trastorno de ansiedad generalizada: factores de riesgo y pronóstico, p. 252.`,
    v: "CORREGIDA",
  },
  "MAYO-DOS-24_COMENTADO_203": {
    t: ["Trastornos de ansiedad"],
    e: "¿En qué trastorno se estudian especialmente el procesamiento preevento social y el procesamiento postevento social?",
    o: {
      a: "Esquizofrenia.",
      b: "Trastorno de ansiedad social.",
      c: "Trastorno de estrés postraumático.",
      d: "Trastorno adaptativo.",
    },
    c: "b",
    x: "El procesamiento preevento social y el postevento social son formas de procesamiento anticipatorio y posterior, rumiativo y sesgado, que contribuyen al mantenimiento de la ansiedad social.",
    r: `${belloch2} Cap. 3, Trastorno de ansiedad social, pp. 97-98.`,
    v: "VALIDADA_ORIGINAL",
  },
  "MAYO-DOS-24_COMENTADO_126": {
    t: ["Psicopatología de la memoria"],
    e: "¿Qué tipo de distorsión de la memoria es la hipermnesia?",
    o: {
      a: "Parapraxia del recuerdo.",
      b: "Parapraxia del reconocimiento.",
      c: "Paramnesia del recuerdo.",
      d: "Paramnesia del reconocimiento.",
    },
    c: "a",
    x: "La hipermnesia es un aumento significativo de la capacidad de recordar. Belloch la incluye entre las parapraxias del recuerdo.",
    r: `${belloch1} Cap. 7, Psicopatología de la memoria, p. 252.`,
    v: "VALIDADA_ORIGINAL",
  },
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_151": {
    t: ["Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos"],
    e: "En adultos con trastornos psicóticos, ¿cuáles fueron los mejores predictores del funcionamiento social?",
    o: {
      a: "Cognición social, síntomas desorganizados y convicción de los delirios.",
      b: "Cognición social, síntomas negativos y estabilidad clínica.",
      c: "Deterioro cognitivo y metacognición.",
      d: "Ser mujer, inicio tardío y buen ajuste premórbido.",
    },
    c: "b",
    x: "Los mejores predictores del funcionamiento social fueron la cognición social, los síntomas negativos y la estabilidad clínica. El deterioro cognitivo y la metacognición predicen otros ámbitos funcionales, como el vocacional o residencial.",
    r: `${belloch2} Cap. 11, El espectro de la esquizofrenia y otros trastornos psicóticos, p. 403.`,
    v: "CORREGIDA",
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
  block: "Clínica 03 — respuestas contaminadas y justificaciones originales",
  reviewed: Object.keys(edits).length,
  preservedQuestionCount: next.length,
  preservedQuestionIds: true,
  correctedIds: Object.keys(edits),
}, null, 2));
