import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const CHILD = "Psicopatología Infantil";
const ticTopic = "Trastornos por tics infantojuveniles";
const moodTopic = "Trastornos depresivos y bipolares infantojuveniles";
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const reviews = {
  SmCm15PIR2025_005: {
    oldC: "b",
    topic: ticTopic,
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones sobre los tics es correcta?",
    o: {
      a: "Son movimientos o vocalizaciones voluntarios, rítmicos y sostenidos.",
      b: "Suelen experimentarse como involuntarios, aunque algunos pueden suprimirse voluntariamente durante períodos variables.",
      c: "Para diagnosticar un trastorno de tics siempre es imprescindible que exista malestar clínicamente significativo.",
      d: "Los tics vocales complejos carecen de significado lingüístico.",
    },
    c: "b",
    x: "La opción b es correcta. El DSM-5-TR define los tics como movimientos o vocalizaciones súbitos, rápidos, recurrentes y no rítmicos. Aunque normalmente se experimentan como involuntarios, algunos pueden suprimirse voluntariamente durante períodos variables. Los tics vocales complejos sí pueden tener significado lingüístico, como la ecolalia o la coprolalia.",
    r: DSM + " pp. 93-94, criterios diagnósticos y características de los trastornos de tics.",
  },
  "SmCm27PIR2025 (1)_184": {
    oldC: "d",
    topic: ticTopic,
    e: "Según el DSM-5-TR, ¿qué patrón de afecciones concurrentes se describe en los trastornos de tics?",
    o: {
      a: "Los niños prepúberes tienen más probabilidad de presentar TDAH, TOC o trastorno de ansiedad por separación; en adolescentes y adultos aumentan los trastornos del ánimo y de ansiedad y los trastornos por consumo de sustancias.",
      b: "Los trastornos de tics no se asocian con afecciones concurrentes durante ninguna etapa del desarrollo.",
      c: "Los trastornos del ánimo y por consumo de sustancias son exclusivos de los niños prepúberes con tics.",
      d: "La edad no guarda ninguna relación con el patrón de afecciones concurrentes de los trastornos de tics.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR señala que los niños prepúberes con trastornos de tics tienen mayor probabilidad de presentar TDAH, TOC y trastorno de ansiedad por separación. En adolescentes y adultos aumenta la vulnerabilidad a trastornos del ánimo y de ansiedad y a trastornos por consumo de sustancias.",
    r: DSM + " p. 95, apartado «Desarrollo y curso» de los trastornos de tics.",
  },
  SmCm15PIR2025_075: {
    oldC: "b",
    topic: moodTopic,
    e: "Según el DSM-5-TR, ¿cuál es la duración mínima del trastorno depresivo persistente en niños y adolescentes?",
    o: {
      a: "Dos semanas.",
      b: "Seis meses.",
      c: "Un año.",
      d: "Dos años.",
    },
    c: "c",
    x: "La opción c es correcta. En niños y adolescentes, el trastorno depresivo persistente exige que el estado de ánimo deprimido o irritable se mantenga durante al menos un año. En adultos, la duración mínima es de dos años.",
    r: DSM + " p. 193, criterios diagnósticos del trastorno depresivo persistente.",
  },
  SmCm19PIR2024_191: {
    oldC: "c",
    topic: moodTopic,
    e: "En la evaluación de un niño con irritabilidad, ¿qué hallazgo apoya un trastorno bipolar frente a un trastorno de desregulación disruptiva del estado de ánimo?",
    o: {
      a: "Irritabilidad grave y persistente sin episodios delimitados de cambio del estado de ánimo.",
      b: "Episodios delimitados de alteración del estado de ánimo, claramente distintos del funcionamiento habitual, con síntomas maníacos asociados.",
      c: "Accesos de cólera frecuentes junto con ánimo irritable persistente entre los accesos durante al menos doce meses.",
      d: "Una irritabilidad crónica que reaparece durante varios meses sin períodos diferenciados de cambio afectivo.",
    },
    c: "b",
    x: "La opción b es correcta. El DSM-5-TR reserva el trastorno bipolar para presentaciones episódicas: el niño debe mostrar un período delimitado de cambio del estado de ánimo y de la conducta claramente diferente de su estado basal, con síntomas maníacos asociados. La irritabilidad crónica y no episódica caracteriza el trastorno de desregulación disruptiva del estado de ánimo.",
    r: DSM + " pp. 179-180, diagnóstico diferencial entre el trastorno bipolar pediátrico y el trastorno de desregulación disruptiva del estado de ánimo.",
  },
};

const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const byId = new Map(child.map((question) => [question.id, question]));
const missing = Object.keys(reviews).filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));

const finalChild = child.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.s !== CHILD || question.t?.[0] !== review.topic) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  const result = { ...question, e: review.e, o: review.o, c: review.c, x: review.x, r: review.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  return result;
});

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => file === "psicopatologia_infantil.json"
  ? finalChild
  : JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8")));
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}
for (const topic of [ticTopic, moodTopic]) {
  const questions = finalChild.filter((question) => question.t?.[0] === topic);
  if (!questions.length || !questions.every((question) => reviewed.has(question.v))) {
    throw new Error("El tema no queda completamente revisado: " + topic);
  }
}

fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 11 — tics y afectivos",
  primarySourceCorrected: Object.keys(reviews).length,
  completedTopics: [ticTopic, moodTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
