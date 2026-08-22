import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const adultPath = path.join(bancoDir, "tratamientos_adultos.json");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const ADULT = "Tratamientos Adultos";
const CLINICAL = "Psicología Clínica";
const CABALLO = "Caballo, V. E. (dir.) (2011). Manual para la evaluación clínica de los trastornos psicológicos. Pirámide.";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";

// Preguntas de tratamiento contrastadas directamente con manuales originales.
// Las dos preguntas paralelas de pánico se conservan: no se eliminan duplicados.
const reviews = {
  SIM_ABR25_053: {
    destination: ADULT,
    oldC: "b",
    c: "b",
    topic: "Tratamiento de los trastornos de ansiedad",
    v: "CORREGIDA",
    e: "En un tratamiento cognitivo-conductual del trastorno de pánico, ¿qué técnica permite exponerse deliberadamente a las sensaciones físicas temidas?",
    o: {
      a: "Relajación.",
      b: "Exposición interoceptiva.",
      c: "Reestructuración cognitiva.",
      d: "Entrenamiento en habilidades sociales.",
    },
    x: "La opción b es correcta. La exposición interoceptiva provoca de forma controlada las sensaciones de ansiedad temidas para que la persona pueda afrontarlas sin evitación. En el caso clínico del manual se emplea para controlar las sensaciones de ansiedad del ataque de pánico.",
    r: CABALLO + " p. 716, apartado «Tratamiento aplicado»: exposición interoceptiva a las sensaciones de ansiedad temidas.",
  },
  SIM_13_017: {
    destination: ADULT,
    oldC: "b",
    c: "b",
    topic: "Tratamiento de los trastornos de ansiedad",
    v: "CORREGIDA",
    e: "En el abordaje cognitivo-conductual del pánico, ¿qué técnica se emplea para trabajar directamente con las sensaciones corporales que la persona teme?",
    o: {
      a: "Relajación muscular.",
      b: "Exposición interoceptiva.",
      c: "Reestructuración de esquemas.",
      d: "Entrenamiento en habilidades sociales.",
    },
    x: "La opción b es correcta. La exposición interoceptiva consiste en afrontar de forma planificada las sensaciones físicas temidas. Se usa para reducir el miedo y la evitación asociados a esas sensaciones en el pánico.",
    r: CABALLO + " p. 716, apartado «Tratamiento aplicado»: exposición interoceptiva a las sensaciones de ansiedad temidas.",
  },
  PERSEV_JUL25_D2_112: {
    destination: ADULT,
    oldC: "d",
    c: "d",
    topic: "Tratamiento de las disfunciones sexuales",
    v: "CORREGIDA",
    e: "Según la tabla de técnicas básicas de terapia sexual de Belloch et al. (2024), ¿para qué disfunción se recoge específicamente la desensibilización in vivo?",
    o: {
      a: "Disfunción orgásmica femenina.",
      b: "Trastorno eréctil.",
      c: "Eyaculación precoz.",
      d: "Trastorno de dolor génito-pélvico/penetración.",
    },
    x: "La opción d es correcta. En la tabla de técnicas básicas de terapia sexual, la desensibilización in vivo figura específicamente entre las intervenciones para el trastorno de dolor génito-pélvico/penetración. Las demás alternativas se acompañan de otras técnicas en esa tabla.",
    r: BELLOCH_I + " p. 538, tabla 14.6 («Técnicas básicas en la terapia sexual»).",
  },
  SIM_ABR25_128: {
    destination: CLINICAL,
    oldC: "a",
    c: "a",
    topic: "Trastornos depresivos",
    v: "CORREGIDA",
    e: "Según el modelo cognitivo de Beck para la depresión, ¿qué cogniciones forman la tríada cognitiva?",
    o: {
      a: "Visión negativa de uno mismo, del mundo y del futuro.",
      b: "Déficit de dopamina, serotonina y noradrenalina.",
      c: "Traumas tempranos, apego inseguro y pérdida parental.",
      d: "Indefensión aprendida, atribuciones externas y reforzamiento negativo.",
    },
    x: "La opción a es correcta. Para Beck, el patrón de pensamientos automáticos negativos de la depresión se organiza en una visión negativa de uno mismo, del mundo y del futuro: la tríada cognitiva. Las demás opciones pertenecen a explicaciones distintas o no describen la tríada.",
    r: BELLOCH_I + " p. 287, apartado «Pensamientos automáticos negativos» y modelo cognitivo de Beck sobre la depresión.",
  },
};

const adult = JSON.parse(fs.readFileSync(adultPath, "utf8"));
const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const relevantBefore = [...adult, ...clinical];
const idCounts = new Map();
for (const question of relevantBefore) idCounts.set(question.id, (idCounts.get(question.id) || 0) + 1);
if ([...idCounts.values()].some((count) => count !== 1)) {
  throw new Error("Hay identificadores duplicados entre Tratamientos Adultos y Psicología Clínica.");
}
const missing = Object.keys(reviews).filter((id) => !idCounts.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));

const availableTopics = (subject) => new Set(manifest.subjects[subject].topics);
const apply = (question, review) => {
  if (question.c !== review.oldC) {
    throw new Error("La clave previa de " + question.id + " no coincide con la auditoría.");
  }
  if (!availableTopics(review.destination).has(review.topic)) {
    throw new Error("El tema no existe: " + review.topic);
  }
  const result = {
    ...question,
    s: review.destination,
    t: [review.topic],
    e: review.e,
    o: review.o,
    c: review.c,
    x: review.x,
    r: review.r,
    v: review.v,
  };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) {
      throw new Error("Opción vacía en " + question.id + ": " + key);
    }
  }
  if (!result.x.trim() || !result.r.trim()) {
    throw new Error("Falta justificación o referencia en " + question.id);
  }
  return result;
};

const finalAdult = adult
  .filter((question) => reviews[question.id]?.destination !== CLINICAL)
  .map((question) => reviews[question.id] ? apply(question, reviews[question.id]) : question);
const movedToClinical = adult
  .filter((question) => reviews[question.id]?.destination === CLINICAL)
  .map((question) => apply(question, reviews[question.id]));
const finalClinical = [...clinical, ...movedToClinical];

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "tratamientos_adultos.json") return finalAdult;
  if (file === "psicologia_clinica.json") return finalClinical;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}

for (const [id, review] of Object.entries(reviews)) {
  const collection = review.destination === CLINICAL ? finalClinical : finalAdult;
  const result = collection.find((question) => question.id === id);
  if (!result || result.s !== review.destination || result.t[0] !== review.topic || result.c !== review.c || result.v !== review.v) {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}

manifest.subjects[ADULT].count = finalAdult.length;
manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== allAfter.length) {
  throw new Error("El manifiesto no coincide con el banco.");
}

fs.writeFileSync(adultPath, JSON.stringify(finalAdult) + "\n", "utf8");
fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos 02 — pánico, disfunciones sexuales y reubicación clínica",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToClinical: movedToClinical.length,
  adultTreatmentTotal: finalAdult.length,
  clinicalTotal: finalClinical.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
