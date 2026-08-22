import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CHILD = "Psicopatología Infantil";
const disruptiveTopic = "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles";
const feedingTopic = "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles";
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const reviews = {
  SmCm18PIR2025_084: {
    oldC: "d",
    c: "d",
    topic: disruptiveTopic,
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones sobre el trastorno de conducta es correcta?",
    o: {
      a: "El tipo de inicio infantil se especifica cuando aparece un síntoma antes de los 12 años.",
      b: "El trastorno de conducta no puede diagnosticarse junto con un TDAH.",
      c: "En la mayoría de los casos, el trastorno de conducta persiste en la edad adulta como trastorno de personalidad antisocial.",
      d: "Los pensamientos y los intentos de suicidio afectan con una frecuencia superior a la esperada a las personas con trastorno de conducta.",
    },
    x: "La opción d es correcta. El DSM-5-TR señala que los pensamientos suicidas, los intentos de suicidio y los suicidios consumados afectan con una frecuencia superior a la esperada a las personas con trastorno de conducta. El tipo de inicio infantil exige al menos un síntoma antes de los 10 años; además, el trastorno puede coexistir con TDAH y en la mayoría de los casos remite en la edad adulta.",
    r: DSM + " pp. 531-536, criterios, desarrollo y curso, y apartado «Asociación a pensamientos o conductas suicidas».",
  },
  "Simu 31 comentado Hardcore 1_183": {
    oldC: "a",
    c: "a",
    topic: feedingTopic,
    e: "Un niño de 3 años rechaza de forma persistente los alimentos sólidos por sus características de textura y acepta solo líquidos y purés. Esta restricción ha provocado un crecimiento insuficiente. No hay miedo a ganar peso ni alteración de la imagen corporal. Según el DSM-5-TR, ¿cuál es el diagnóstico más probable?",
    o: {
      a: "Trastorno de evitación/restricción de la ingesta de alimentos (ARFID).",
      b: "Trastorno por rumiación.",
      c: "Otro trastorno de la conducta alimentaria y de la ingesta de alimentos especificado.",
      d: "Anorexia nerviosa, tipo restrictivo.",
    },
    x: "La opción a es correcta. El ARFID incluye la evitación o restricción por características sensoriales de los alimentos y requiere consecuencias como fracaso para alcanzar el aumento de peso o el crecimiento esperado en niños. A diferencia de la anorexia nerviosa, no existe una alteración de la experiencia del peso o la constitución corporal.",
    r: DSM + " pp. 376-377, criterios diagnósticos y características del trastorno de evitación/restricción de la ingesta de alimentos.",
  },
};

const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const byId = new Map(child.map((question) => [question.id, question]));
const missing = Object.keys(reviews).filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));
for (const topic of [disruptiveTopic, feedingTopic]) {
  if (!manifest.subjects[CHILD].topics.includes(topic)) throw new Error("No existe el tema infantil: " + topic);
}

const finalChild = child.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.s !== CHILD || question.t?.[0] !== review.topic) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  const result = {
    ...question,
    e: review.e,
    o: review.o,
    c: review.c,
    x: review.x,
    r: review.r,
    v: "CORREGIDA",
  };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  return result;
});

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => file === "psicopatologia_infantil.json"
  ? finalChild
  : JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8")));
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}
for (const topic of [disruptiveTopic, feedingTopic]) {
  const questions = finalChild.filter((question) => question.t?.[0] === topic);
  if (!questions.length || !questions.every((question) => reviewed.has(question.v))) {
    throw new Error("El tema no queda completamente revisado: " + topic);
  }
}

fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 10 — disruptivos y alimentación",
  primarySourceValidated: Object.keys(reviews).length,
  completedTopics: [disruptiveTopic, feedingTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
