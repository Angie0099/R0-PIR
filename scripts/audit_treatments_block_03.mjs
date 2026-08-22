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

// Contraste directo con la tabla 14.6 del manual original.
const reviews = {
  "ABRIL-UNO-24_COMENTADO_086": {
    oldC: "c",
    c: "c",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en qué disfunción se incluye la técnica de parada y arranque?",
    o: {
      a: "Eyaculación retardada.",
      b: "Eyaculación precoz.",
      c: "Trastorno eréctil.",
      d: "Deseo sexual inhibido en el hombre.",
    },
    x: "La opción c es correcta. En la tabla de técnicas básicas en terapia sexual, la técnica de parada y arranque figura para el trastorno eréctil: se estimula el pene hasta conseguir la erección, se detiene hasta que vuelve al estado de flacidez y se repite el procedimiento.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
  },
  "MAYO-DOS-24_COMENTADO_072": {
    oldC: "a",
    c: "a",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en cuál de las siguientes disfunciones no se incluye el trabajo con los músculos pubococcígeos?",
    o: {
      a: "Eyaculación retardada.",
      b: "Eyaculación precoz.",
      c: "Disfunción orgásmica femenina.",
      d: "Trastorno del interés/excitación sexual en la mujer.",
    },
    x: "La opción a es correcta. La tabla incluye el control de los músculos pubococcígeos en la eyaculación precoz y su entrenamiento en la disfunción orgásmica femenina y en el trastorno del interés/excitación sexual en la mujer. No lo recoge para la eyaculación retardada.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
  },
  "PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_166": {
    oldC: "b",
    c: "b",
    e: "En el tratamiento del trastorno eréctil, ¿qué técnica se emplea para desviar la atención y reducir la preocupación excesiva por el rendimiento?",
    o: {
      a: "Autoestimulación.",
      b: "Establecimiento de fantasías sexuales que desvíen la atención.",
      c: "Alineación coital.",
      d: "Técnica del puente.",
    },
    x: "La opción b es correcta. Para el trastorno eréctil, la tabla recoge el establecimiento de fantasías sexuales que desvíen la atención como una de las técnicas indicadas, junto con intervención cognitiva sobre ansiedad de ejecución y preocupación excesiva por la satisfacción de la pareja.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
  },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_179": {
    oldC: "b",
    c: "b",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en qué disfunción se incluye el cambio de posturas coitales y de rutinas sexuales?",
    o: {
      a: "Trastorno eréctil.",
      b: "Eyaculación precoz.",
      c: "Eyaculación retardada.",
      d: "Disfunción orgásmica femenina.",
    },
    x: "La opción b es correcta. El cambio de posturas coitales y de rutinas sexuales aparece entre las intervenciones de la eyaculación precoz. Las otras disfunciones se acompañan de técnicas diferentes en esa tabla.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
  },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_165": {
    oldC: "a",
    c: "a",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿en cuál de las siguientes disfunciones no se incluye la exploración de expectativas y mitos sexuales?",
    o: {
      a: "Trastorno eréctil.",
      b: "Eyaculación precoz.",
      c: "Eyaculación retardada.",
      d: "Disfunción orgásmica femenina.",
    },
    x: "La opción a es correcta. La exploración de expectativas y mitos sexuales se recoge para la eyaculación precoz, la eyaculación retardada y la disfunción orgásmica femenina. Para el trastorno eréctil, la tabla propone intervención cognitiva, fantasías sexuales que desvíen la atención y parada y arranque.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
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
    r: review.r,
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
  if (!result || result.c !== review.c || result.v !== "CORREGIDA" || result.r !== review.r) {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}
if (manifest.total !== allAfter.length || manifest.subjects[ADULT].count !== finalAdult.length) {
  throw new Error("El manifiesto no coincide con el banco.");
}

fs.writeFileSync(adultPath, JSON.stringify(finalAdult) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos 04 — técnicas de terapia sexual",
  primarySourceValidated: Object.keys(reviews).length,
  adultTreatmentTotal: finalAdult.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
