import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const adultPath = path.join(bancoDir, "tratamientos_adultos.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const ADULT = "Tratamientos Adultos";
const TOPIC = "Tratamiento de las disfunciones sexuales";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const SOURCE = BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).";

// Contraste directo con la tabla 14.6. En el último ítem se corrige la
// clave porque la tabla sitúa la técnica del apretón en la base del pene.
const reviews = {
  SmCm1PIR2024_146: {
    oldC: "c",
    c: "c",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en qué disfunción se incluyen tanto el entrenamiento en masturbación como el entrenamiento de los músculos pubococcígeos?",
    o: {
      a: "Eyaculación retardada.",
      b: "Trastorno eréctil.",
      c: "Disfunción orgásmica femenina.",
      d: "Trastorno de dolor génito-pélvico/penetración.",
    },
    x: "La opción c es correcta. La tabla incluye en la disfunción orgásmica femenina el entrenamiento en masturbación y el entrenamiento de los músculos pubococcígeos. Las demás alternativas se acompañan de otros procedimientos específicos.",
  },
  "Simu 15 comentado_179": {
    oldC: "a",
    c: "a",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿qué técnica se recoge para la eyaculación precoz?",
    o: {
      a: "Técnica de Semans: detener la estimulación justo antes de eyacular.",
      b: "Técnica de parada y arranque para recuperar la erección.",
      c: "Desensibilización in vivo.",
      d: "Fantasías sexuales para desviar la atención.",
    },
    x: "La opción a es correcta. Para la eyaculación precoz, la tabla recoge la técnica de Semans, que consiste en detener la estimulación justo antes de eyacular, además de la técnica del apretón de Masters y Johnson. Las demás alternativas se asocian en la tabla a otras disfunciones sexuales.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_109": {
    oldC: "c",
    c: "b",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en qué consiste la técnica del apretón de Masters y Johnson para la eyaculación precoz?",
    o: {
      a: "Detener la estimulación justo antes de eyacular.",
      b: "Apretar la base del pene cuando se acerca la eyaculación.",
      c: "Presionar bajo el glande durante unos segundos.",
      d: "Estimular el clítoris durante el coito hasta el orgasmo.",
    },
    x: "La opción b es correcta. La tabla de Belloch describe la técnica del apretón de Masters y Johnson como apretar la base del pene cuando se acerca la eyaculación. Detener la estimulación justo antes de eyacular corresponde a la técnica de Semans. Por ello se corrige la clave previa, que señalaba la opción c.",
  },
};

const adult = JSON.parse(fs.readFileSync(adultPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const byId = new Map(adult.map((question) => [question.id, question]));
const missing = Object.keys(reviews).filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));
if (!manifest.subjects[ADULT].topics.includes(TOPIC)) throw new Error("No existe el tema de destino.");

const finalAdult = adult.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.s !== ADULT || question.t?.[0] !== TOPIC) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  const result = {
    ...question,
    e: review.e,
    o: review.o,
    c: review.c,
    x: review.x,
    r: SOURCE,
    v: "CORREGIDA",
  };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  if (!result.x.trim() || !result.r.trim()) throw new Error("Falta justificación o referencia en " + question.id);
  return result;
});

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "tratamientos_adultos.json") return finalAdult;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}
for (const [id, review] of Object.entries(reviews)) {
  const result = finalAdult.find((question) => question.id === id);
  if (!result || result.c !== review.c || result.v !== "CORREGIDA" || result.r !== SOURCE) {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}
if (manifest.total !== allAfter.length || manifest.subjects[ADULT].count !== finalAdult.length) {
  throw new Error("El manifiesto no coincide con el banco.");
}

fs.writeFileSync(adultPath, JSON.stringify(finalAdult) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos 05 — técnicas para disfunciones sexuales",
  primarySourceValidated: Object.keys(reviews).length,
  correctedAnswerKeys: Object.values(reviews).filter((review) => review.c !== review.oldC).length,
  adultTreatmentTotal: finalAdult.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
