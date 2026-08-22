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
const DSM = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const BELLOCH = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const CIE = "Organización Mundial de la Salud (2025). CIE-11: Clasificación Internacional de Enfermedades para las Estadísticas de Mortalidad y Morbilidad (11.ª revisión).";

// Cada corrección de este bloque se ha contrastado directamente con DSM-5-TR,
// CIE-11 o Belloch 2024. Se conservan siempre el identificador y el origen.
const reviews = {
  PERSEV_JUL25_D2_081: {
    destination: CHILD,
    oldC: "c",
    c: "c",
    topic: "Trastorno del espectro del autismo (TEA)",
    v: "CORREGIDA",
    e: "Según la tabla de gravedad del DSM-5-TR para el trastorno del espectro autista, ¿qué grado corresponde a una persona con pocas palabras inteligibles, que raramente inicia una interacción y que necesita un apoyo muy elevado?",
    o: {
      a: "Grado 1: necesita ayuda.",
      b: "Grado 2: necesita ayuda notable.",
      c: "Grado 3: necesita ayuda muy notable.",
      d: "Grado 4: profundo.",
    },
    x: "La descripción corresponde al grado 3 de gravedad del TEA: deficiencias graves en la comunicación social, inicio muy limitado de las interacciones y necesidad de ayuda muy notable. El DSM-5-TR describe tres grados de gravedad, no un grado 4.",
    r: DSM + " p. 58, tabla 2 «Niveles de gravedad del trastorno del espectro autista».",
  },
  MAYO2_051: {
    destination: CLINICAL,
    oldC: "a",
    c: "a",
    topic: "Trastornos adictivos con sustancia",
    v: "CORREGIDA",
    e: "¿Qué tipo de tolerancia se produce cuando la respuesta del organismo a una sustancia reduce su potencia con el uso repetido?",
    o: {
      a: "Tolerancia farmacodinámica.",
      b: "Tolerancia farmacocinética.",
      c: "Tolerancia conductual.",
      d: "Tolerancia innata.",
    },
    x: "La tolerancia farmacodinámica aparece cuando los receptores responden con cambios químicos al uso repetido de la sustancia, reduciendo su efecto y llevando a necesitar una dosis mayor para conseguir el efecto inicial. Belloch distingue esta forma de las tolerancias farmacocinética y conductual, dentro de la tolerancia adquirida.",
    r: BELLOCH + " p. 574, apartado C «Tolerancia».",
  },
  "DICIEMBRE-DOS-24_COMENTADO_021": {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos parafílicos",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, en el trastorno de voyeurismo, ¿cuánto tiempo se requiere para utilizar el especificador «en remisión total»?",
    o: {
      a: "Al menos 2 años.",
      b: "Al menos 4 años.",
      c: "Al menos 5 años.",
      d: "No existe este especificador.",
    },
    x: "El especificador «en remisión total» requiere que durante al menos 5 años, en un entorno no controlado, la persona no haya actuado sobre deseos irrefrenables con personas sin consentimiento y no haya presentado malestar ni problemas de funcionamiento.",
    r: DSM + " p. 780, especificador «En remisión total» del trastorno de voyeurismo.",
  },
  "MAYO-DOS-24_COMENTADO_171": {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos de la personalidad",
    v: "CORREGIDA",
    e: "Señale la afirmación incorrecta sobre el trastorno de la personalidad límite según el DSM-5-TR:",
    o: {
      a: "En un estudio longitudinal de pacientes hospitalizados seguido durante 24 años, alrededor del 6 % murió por suicidio.",
      b: "Puede haber juego patológico, gasto irresponsable, atracones, consumo de sustancias, relaciones sexuales sin protección o conducción temeraria.",
      c: "La mayoría de las personas logra una mayor estabilidad en sus relaciones y funcionamiento profesional durante las décadas de los 50 y los 60 años.",
      d: "Frente al abandono, la persona con personalidad límite tiende al vacío, la rabia y las exigencias; la persona con personalidad dependiente tiende al apaciguamiento, la sumisión y la búsqueda urgente de apoyo.",
    },
    x: "La afirmación incorrecta es la c. El DSM-5-TR sitúa la reducción de la gravedad del trastorno, de forma característica, al entrar en la década de los 30 o la cuarentena, no en los 50 o 60 años. Las restantes afirmaciones se ajustan a la descripción clínica y al diagnóstico diferencial del manual.",
    r: DSM + " pp. 753-756, «Trastorno de la personalidad límite»: aspectos diagnósticos, desarrollo y curso, y diagnóstico diferencial.",
  },
  "SEPTIEMBRE-DOS-24_COMENTADO_174": {
    destination: CHILD,
    oldC: "d",
    c: "d",
    topic: "Trastorno del espectro del autismo (TEA)",
    v: "CORREGIDA",
    e: "Según la CIE-11, ¿cuál de las siguientes afirmaciones sobre el trastorno del espectro autista (TEA) es correcta?",
    o: {
      a: "La CIE-11 mantiene el trastorno de Asperger como diagnóstico independiente.",
      b: "La CIE-11 utiliza tres grados de gravedad según el apoyo requerido.",
      c: "La CIE-11 mantiene el trastorno de Rett como subtipo de TEA.",
      d: "La CIE-11 codifica el TEA como 6A02 y lo diferencia según la presencia de trastorno del desarrollo intelectual y el grado de deterioro del lenguaje funcional.",
    },
    x: "La opción d es correcta. La CIE-11 incluye el TEA bajo el código 6A02 y organiza sus subcategorías según la presencia o ausencia de trastorno del desarrollo intelectual y el nivel de lenguaje funcional. Los tres grados de apoyo pertenecen al sistema de gravedad del DSM-5-TR.",
    r: CIE + " código 6A02, «Trastorno del espectro autista».",
  },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_066": {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos destructivos, del control de los impulsos y de la conducta",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre la cleptomanía:",
    o: {
      a: "Las vías de neurotransmisión asociadas son los sistemas serotoninérgico, noradrenérgico y el eje hipotálamo-hipófiso-adrenal.",
      b: "Los robos suelen planearse y se valora plenamente la posibilidad de ser detenido.",
      c: "Puede asociarse a trastornos de la conducta alimentaria, en particular a la bulimia nerviosa.",
      d: "La proporción de mujeres respecto de hombres es aproximadamente de 4 a 1.",
    },
    x: "La opción c es correcta. El DSM-5-TR señala la asociación de la cleptomanía con trastornos de la conducta alimentaria, particularmente la bulimia nerviosa. Los sistemas mencionados incluyen de forma errónea el noradrenérgico y el eje hipotálamo-hipófiso-adrenal; el manual menciona los sistemas serotoninérgico, dopaminérgico y opioide. Los robos no suelen planearse y la proporción de mujeres a hombres es aproximadamente 3 a 1.",
    r: DSM + " pp. 540-541, «Cleptomanía»: características asociadas, prevalencia y comorbilidad.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_071": {
    destination: CLINICAL,
    oldC: "a",
    c: "a",
    topic: "Trastornos de síntomas somáticos y relacionados",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál es una afirmación correcta sobre el trastorno de síntomas somáticos?",
    o: {
      a: "En la gravedad moderada se cumplen dos o más de las manifestaciones especificadas en el criterio B.",
      b: "El criterio A exige dos o más síntomas somáticos que causen malestar o problemas significativos.",
      c: "En la gravedad leve se cumplen dos o más de las manifestaciones del criterio B.",
      d: "El estado sintomático persistente se define, por lo general, por una duración superior a doce meses.",
    },
    x: "La opción a es correcta. Para la gravedad moderada se cumplen dos o más manifestaciones del criterio B. El criterio A requiere uno o más síntomas somáticos, la gravedad leve implica solo una manifestación del criterio B y la persistencia se establece, por lo general, a partir de más de seis meses.",
    r: DSM + " p. 351, criterios diagnósticos y especificación de la gravedad del trastorno de síntomas somáticos.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_061": {
    destination: CHILD,
    oldC: "d",
    c: "d",
    topic: "Trastornos específicos del aprendizaje y de la coordinación",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál de las siguientes no es una especificación del trastorno específico del aprendizaje referida al área académica afectada?",
    o: {
      a: "Con dificultades en la lectura.",
      b: "Con dificultad en la expresión escrita.",
      c: "Con dificultad matemática.",
      d: "Con dificultad en la expresión oral.",
    },
    x: "La opción d es correcta porque la expresión oral no es una de las especificaciones académicas del trastorno específico del aprendizaje. El DSM-5-TR contempla las dificultades en la lectura, en la expresión escrita y en las matemáticas.",
    r: DSM + " p. 77, nota de codificación del trastorno específico del aprendizaje.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_085": {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos neurocognitivos",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre las características diagnósticas de los trastornos neurocognitivos (TNC) mayor y leve:",
    o: {
      a: "Los test neuropsicológicos se utilizan poco y son especialmente importantes para la evaluación del TNC mayor.",
      b: "La mejor forma de determinar el declive cognitivo se basa exclusivamente en una evaluación objetiva del rendimiento.",
      c: "En el TNC leve, el rendimiento se sitúa de manera característica entre 1 y 2 desviaciones estándar por debajo de la norma, aproximadamente entre los percentiles 3 y 16.",
      d: "El criterio B se refiere al declive cognitivo adquirido del individuo.",
    },
    x: "La opción c es correcta. En el TNC leve, el rendimiento se sitúa de manera característica entre 1 y 2 desviaciones estándar por debajo de la norma. La evaluación combina la preocupación por el declive y la evidencia objetiva; los test neuropsicológicos son especialmente importantes en el TNC leve, y el criterio B se refiere al grado de autonomía en la vida diaria.",
    r: DSM + " pp. 685-686, «Trastornos neurocognitivos mayores y leves»: características diagnósticas.",
  },
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...clinical, ...child];
const idCounts = new Map();
for (const question of allBefore) idCounts.set(question.id, (idCounts.get(question.id) || 0) + 1);
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
if (allAfter.length !== afterIds.size) {
  throw new Error("La auditoría produciría identificadores duplicados.");
}
if (allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total: " + allAfter.length);
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
  throw new Error("El manifiesto no coincide con el banco: " + manifest.total + " frente a " + allAfter.length);
}

fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Psicología Clínica 08 — TEA, adicciones, personalidad, síntomas somáticos, aprendizaje y TNC",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToChildPsychopathology: movedToChild.length,
  clinicalTotal: finalClinical.length,
  childTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
