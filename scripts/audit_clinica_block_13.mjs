import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CLINICAL = "Psicología Clínica";
const CHILD = "Psicopatología Infantil";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";

// Ítems contrastados directamente con el manual original de Belloch (2024).
const reviews = {
  "ABRIL-UNO-24_COMENTADO_132": {
    oldC: "c",
    c: "c",
    topic: "Psicopatología del lenguaje",
    e: "Según la tabla de Belloch et al. (2024), ¿qué síndrome afásico cortical se asocia, entre otros problemas característicos, a depresión y hemiplejia derecha?",
    o: {
      a: "Afasia sensorial transcortical.",
      b: "Afasia transcortical mixta.",
      c: "Afasia global.",
      d: "Afasia motora transcortical.",
    },
    x: "La opción c es correcta. La tabla de características de los síndromes afásicos corticales sitúa la depresión y la hemiplejia derecha entre los problemas característicos de la afasia global. Las demás alternativas presentan otros perfiles de lesión, habla y comprensión.",
    r: BELLOCH_I + " p. 335, tabla 9.1 («Características de los síndromes afásicos corticales»).",
  },
  "ABRIL-UNO-24_COMENTADO_156": {
    oldC: "a",
    c: "a",
    topic: "Psicopatología de la memoria",
    e: "Según Belloch et al. (2024), ¿qué conjunto de manifestaciones corresponde a la etapa de Wernicke?",
    o: {
      a: "Ataxia cerebelosa, alteraciones oculares y neuropatía periférica con miopatía.",
      b: "Confabulación, amnesia anterógrada y falsos reconocimientos.",
      c: "Afasia, apraxia y agnosia.",
      d: "Delirios, alucinaciones y pensamiento desorganizado.",
    },
    x: "La opción a es correcta. La etapa de Wernicke se caracteriza principalmente por ataxia cerebelosa, problemas oculares (como visión doble, ptosis, oftalmoplejia o nistagmo) y neuropatía periférica con miopatía. La amnesia grave, la confabulación y los falsos reconocimientos se describen en la etapa de Korsakoff.",
    r: BELLOCH_I + " p. 235, apartado sobre encefalopatía de Wernicke y síndrome de Korsakoff.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_064": {
    oldC: "a",
    c: "a",
    topic: "Psicopatología de la memoria",
    e: "Según Belloch et al. (2024), ¿cuál de las siguientes NO corresponde a las manifestaciones principales de la etapa de Wernicke?",
    o: {
      a: "Amnesia para hechos recientes, desorientación y confabulaciones.",
      b: "Ataxia cerebelosa.",
      c: "Problemas oculares, como visión doble, ptosis, oftalmoplejia o nistagmo.",
      d: "Neuropatía periférica y miopatía.",
    },
    x: "La opción a es correcta porque es la alternativa que no corresponde a la etapa de Wernicke. La amnesia para hechos recientes, la desorientación y las confabulaciones forman parte de la etapa de Korsakoff. En Wernicke predominan la ataxia cerebelosa, los problemas oculares y la neuropatía periférica con miopatía.",
    r: BELLOCH_I + " p. 235, apartado sobre encefalopatía de Wernicke y síndrome de Korsakoff.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_062": {
    oldC: "b",
    c: "b",
    topic: "Psicopatología de la memoria",
    e: "En relación con la encefalopatía de Wernicke y el síndrome de Korsakoff, ¿qué afirmación es correcta según Belloch et al. (2024)?",
    o: {
      a: "El síndrome de Korsakoff comienza antes de que aparezcan los síntomas de la encefalopatía de Wernicke.",
      b: "Las lesiones de los cuerpos mamilares y los núcleos talámicos anteriores se relacionan directamente con la amnesia severa.",
      c: "En el síndrome de Korsakoff se preserva la memoria reciente y solo se altera la memoria remota.",
      d: "El síndrome de Korsakoff se caracteriza por un deterioro de la memoria operativa.",
    },
    x: "La opción b es correcta. Belloch describe que las lesiones de los cuerpos mamilares y de los núcleos talámicos anteriores, que reciben aferencias del hipocampo a través del fórnix, se relacionan directamente con la amnesia severa del síndrome de Korsakoff. Este síndrome se desarrolla al remitir Wernicke y no se caracteriza por un déficit de memoria operativa.",
    r: BELLOCH_I + " p. 235, apartado sobre encefalopatía de Wernicke y síndrome de Korsakoff.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_082": {
    oldC: "d",
    c: "d",
    topic: "Psicopatología de la memoria",
    e: "Según la clasificación de Belloch et al. (2024), ¿en qué categoría se incluye la prosopagnosia?",
    o: {
      a: "Paramnesias del recuerdo.",
      b: "Parapraxias del reconocimiento.",
      c: "Parapraxias del recuerdo.",
      d: "Paramnesias del reconocimiento.",
    },
    x: "La opción d es correcta. Belloch clasifica las agnosias dentro de las paramnesias del reconocimiento. La prosopagnosia es una agnosia visual: incapacidad para reconocer rostros conocidos pese a conservar la capacidad de identificar rasgos faciales y objetos genéricos.",
    r: BELLOCH_I + " p. 255, apartado «Paramnesias del reconocimiento: agnosias».",
  },
  "NOVIEMBRE-DOS-24_COMENTADO_016": {
    oldC: "a",
    c: "a",
    topic: "Psicopatología de la memoria",
    e: "¿Cómo se denomina la dificultad para identificar el significado de una escena y las interacciones entre sus elementos?",
    o: {
      a: "Simultagnosia.",
      b: "Prosopagnosia.",
      c: "Estereoagnosia.",
      d: "Amusia.",
    },
    x: "La opción a es correcta. La simultagnosia es una modalidad de agnosia visual caracterizada por la dificultad para identificar el significado global de una escena y las relaciones entre los elementos que la componen. La prosopagnosia afecta al reconocimiento de rostros, la estereoagnosia al reconocimiento táctil y la amusia a la interpretación de sonidos musicales.",
    r: BELLOCH_I + " p. 255, apartado «Paramnesias del reconocimiento: agnosias».",
  },
};

// Reubicaciones inequívocas por contenido. No cambian el estado de validación:
// las preguntas se revisarán después contra DSM-5-TR y los manuales infantiles originales.
const childRelocations = {
  MAYO2_040: "Trastorno del espectro del autismo (TEA)",
  "MAYO-UNO-24_COMENTADO_115": "Trastorno del espectro del autismo (TEA)",
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_133": "Trastorno del espectro del autismo (TEA)",
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const clinicalById = new Map(clinical.map((question) => [question.id, question]));
const childIds = new Set(child.map((question) => question.id));
const clinicalTopics = new Set(manifest.subjects[CLINICAL].topics);
const childTopics = new Set(manifest.subjects[CHILD].topics);
const allIds = [...Object.keys(reviews), ...Object.keys(childRelocations)];
const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
if (duplicates.length) throw new Error("Un identificador se repite entre operaciones: " + duplicates.join(", "));
const missing = allIds.filter((id) => !clinicalById.has(id));
if (missing.length) throw new Error("No se encontraron en Psicología Clínica: " + missing.join(", "));
const alreadyInChild = Object.keys(childRelocations).filter((id) => childIds.has(id));
if (alreadyInChild.length) throw new Error("Ya existen en Psicopatología Infantil: " + alreadyInChild.join(", "));

const applyReview = (question, review) => {
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  if (!clinicalTopics.has(review.topic)) throw new Error("El tema clínico no existe: " + review.topic);
  const result = {
    ...question,
    s: CLINICAL,
    t: [review.topic],
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
};

for (const [id, topic] of Object.entries(childRelocations)) {
  if (!childTopics.has(topic)) throw new Error("El tema infantil no existe: " + topic);
}

const reviewedClinical = clinical
  .filter((question) => !Object.hasOwn(childRelocations, question.id))
  .map((question) => Object.hasOwn(reviews, question.id) ? applyReview(question, reviews[question.id]) : question);
const movedToChild = clinical
  .filter((question) => Object.hasOwn(childRelocations, question.id))
  .map((question) => ({ ...question, s: CHILD, t: [childRelocations[question.id]] }));
const finalChild = [...child, ...movedToChild];

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "psicologia_clinica.json") return reviewedClinical;
  if (file === "psicopatologia_infantil.json") return finalChild;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}

for (const [id, review] of Object.entries(reviews)) {
  const result = reviewedClinical.find((question) => question.id === id);
  if (!result || result.t[0] !== review.topic || result.c !== review.c || result.v !== "CORREGIDA") {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}
for (const [id, topic] of Object.entries(childRelocations)) {
  const result = finalChild.find((question) => question.id === id);
  if (!result || result.s !== CHILD || result.t[0] !== topic) throw new Error("No se reubicó correctamente " + id + ".");
}

manifest.subjects[CLINICAL].count = reviewedClinical.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== allAfter.length) throw new Error("El manifiesto no coincide con el banco.");

fs.writeFileSync(clinicalPath, JSON.stringify(reviewedClinical) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Clínica 13 — memoria, lenguaje y limpieza de explicaciones incrustadas",
  manuallyValidated: Object.keys(reviews).length,
  relocatedWithoutContentValidation: movedToChild.length,
  clinicalTotal: reviewedClinical.length,
  childPsychopathologyTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
