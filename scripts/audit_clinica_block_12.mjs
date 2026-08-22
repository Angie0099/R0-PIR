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
const DSM_TR = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";

// Lote de preguntas con desubicación clara o texto contaminado por el OCR.
// Cada corrección se contrasta directamente con el DSM-5-TR o Belloch 2024.
const reviews = {
  PERSEV_JUL25_D2_031: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Sistemas clasificatorios en psicopatología",
    v: "CORREGIDA",
    e: "Según la clasificación dimensional HiTOP, ¿qué conjunto de síndromes se incluye en el subfactor miedo del espectro de afectividad negativa?",
    o: {
      a: "Trastorno depresivo mayor, distimia y trastorno de ansiedad generalizada.",
      b: "Bajo deseo sexual, problemas de activación, función orgásmica y dolor sexual.",
      c: "Anorexia nerviosa, bulimia nerviosa y trastorno de atracón.",
      d: "Fobia social, agorafobia, fobia específica, trastorno de ansiedad de separación, trastorno de pánico, trastorno por estrés postraumático y trastorno obsesivo-compulsivo.",
    },
    x: "La opción d es correcta. En la figura del modelo HiTOP, esos síndromes se sitúan en el subfactor miedo del espectro de afectividad negativa. La a corresponde al subfactor distrés, la b a problemas sexuales y la c a patología de la conducta alimentaria.",
    r: BELLOCH_I + " pp. 101-102, apartado «La clasificación HiTOP» y figura 3.1.",
  },
  PERSEV_JUL25_D2_033: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Psicopatología de la sensopercepción",
    v: "CORREGIDA",
    e: "Según el modelo cognitivo de Morrison et al. (1995), ¿qué fenómeno resulta especialmente útil para explicar las alucinaciones auditivas?",
    o: {
      a: "Predisposición personal.",
      b: "Estimulación ambiental.",
      c: "Consecuencias reforzantes y expectativas asociadas.",
      d: "Pensamientos intrusos.",
    },
    x: "La opción d es correcta. Morrison et al. establecen una analogía entre pensamientos intrusos y alucinaciones auditivas: ambos pueden ser emocionalmente relevantes, desagradables, no deseados, extraños, involuntarios e incontrolables. Los pensamientos intrusos atribuidos externamente ayudan a explicar la experiencia de «voces».",
    r: BELLOCH_I + " pp. 215-217, modelo cognitivo de Morrison et al. (1995) para las alucinaciones auditivas.",
  },
  PERSEV_JUL25_D2_035: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Psicopatología de la sensopercepción",
    v: "CORREGIDA",
    e: "¿En cuál de los siguientes cuadros es más frecuente la aparición de alucinaciones visuales?",
    o: {
      a: "Epilepsia del lóbulo temporal.",
      b: "Alucinosis alcohólica.",
      c: "Episodio maníaco.",
      d: "Consumo de sustancias.",
    },
    x: "La opción d es correcta. La tabla de Belloch recoge las alucinaciones visuales como frecuentes en el consumo de sustancias y como infrecuentes en la epilepsia del lóbulo temporal, la alucinosis alcohólica y el episodio maníaco.",
    r: BELLOCH_I + " p. 186, tabla 6.4 («Modalidades sensoriales de alucinación que aparecen más frecuentemente en diferentes trastornos»).",
  },
  PERSEV_JUL25_D2_044: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Sistemas clasificatorios en psicopatología",
    v: "CORREGIDA",
    e: "Según el modelo tripartito de Clark y Watson (1991), ¿qué combinación caracteriza al síndrome depresivo?",
    o: {
      a: "Alto afecto negativo y elevada activación fisiológica.",
      b: "Bajo afecto negativo y elevada activación fisiológica.",
      c: "Alto afecto negativo y bajo afecto positivo.",
      d: "Bajo afecto negativo y bajo afecto positivo.",
    },
    x: "La opción c es correcta. El modelo tripartito propone que la depresión se caracteriza por alto afecto negativo y bajo afecto positivo. La ansiedad se asocia con alto afecto negativo y elevada activación fisiológica.",
    r: BELLOCH_I + " p. 100, modelo tripartito de Clark y Watson (1991).",
  },
  PERSEV_JUL25_D2_048: {
    destination: CHILD,
    oldC: "c",
    c: "c",
    topic: "Trastornos por tics infantojuveniles",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿qué diagnóstico requiere que hayan estado presentes en algún momento tics motores múltiples y uno o más tics vocales?",
    o: {
      a: "Trastorno negativista desafiante.",
      b: "Trastorno de la fluidez de inicio en la infancia (tartamudeo).",
      c: "Trastorno de la Tourette.",
      d: "Mutismo selectivo.",
    },
    x: "La opción c es correcta. El criterio A del trastorno de la Tourette exige tics motores múltiples y uno o más tics vocales en algún momento durante la enfermedad, aunque no tengan que aparecer de forma concurrente. Los demás diagnósticos no se definen por la presencia de tics.",
    r: DSM_TR + " p. 93, criterios diagnósticos del trastorno de la Tourette.",
  },
  PERSEV_JUL25_D2_058: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Psicopatología de la conducta motora",
    v: "CORREGIDA",
    e: "¿Cómo se denomina el movimiento involuntario accesorio que aparece como consecuencia de otro movimiento, por ejemplo, sacar la lengua mientras se pinta?",
    o: {
      a: "Estereotipia.",
      b: "Automatismo.",
      c: "Discinesia tardía.",
      d: "Sincinesia.",
    },
    x: "La opción d es correcta. Una sincinesia es un movimiento involuntario parásito o accesorio que ocurre como consecuencia de otro movimiento. Son frecuentes en el desarrollo evolutivo y disminuyen con la maduración; también pueden aparecer tras lesiones cerebrales.",
    r: BELLOCH_I + " p. 383, apartado «Sincinesia».",
  },
  PERSEV_JUL25_D2_059: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Psicopatología del pensamiento",
    v: "CORREGIDA",
    e: "Entre los pensamientos repetitivos negativos, ¿en cuál fluctúa el grado de accesibilidad a la consciencia en relación con la gravedad de la depresión?",
    o: {
      a: "Rumiaciones.",
      b: "Obsesiones.",
      c: "Pensamientos automáticos negativos.",
      d: "Preocupaciones.",
    },
    x: "La opción c es correcta. La tabla comparativa de Belloch indica que el grado de accesibilidad a la consciencia es alto en preocupaciones, rumiaciones y obsesiones, mientras que en los pensamientos automáticos negativos fluctúa con la gravedad de la depresión y aumenta cuanto más grave es esta.",
    r: BELLOCH_I + " p. 293, tabla 8.4 («Características distintivas entre tipos de pensamientos repetitivos negativos»).",
  },
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const relevantBefore = [...clinical, ...child];
const idCounts = new Map();
for (const question of relevantBefore) idCounts.set(question.id, (idCounts.get(question.id) || 0) + 1);
if ([...idCounts.values()].some((count) => count !== 1)) {
  throw new Error("Hay identificadores duplicados entre Psicología Clínica y Psicopatología Infantil.");
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

const finalClinical = clinical
  .filter((question) => reviews[question.id]?.destination !== CHILD)
  .map((question) => reviews[question.id] ? apply(question, reviews[question.id]) : question);
const movedToChild = clinical
  .filter((question) => reviews[question.id]?.destination === CHILD)
  .map((question) => apply(question, reviews[question.id]));
const finalChild = [...child, ...movedToChild];

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "psicologia_clinica.json") return finalClinical;
  if (file === "psicopatologia_infantil.json") return finalChild;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}

for (const [id, review] of Object.entries(reviews)) {
  const collection = review.destination === CHILD ? finalChild : finalClinical;
  const result = collection.find((question) => question.id === id);
  if (!result || result.s !== review.destination || result.t[0] !== review.topic || result.c !== review.c || result.v !== review.v) {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}

manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== allAfter.length) {
  throw new Error("El manifiesto no coincide con el banco.");
}

fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Psicología Clínica 12 — clasificación, sensopercepción, pensamiento, conducta motora y tics",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToChildPsychopathology: movedToChild.length,
  clinicalTotal: finalClinical.length,
  childTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
