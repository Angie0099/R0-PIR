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
const DSM_5 = "American Psychiatric Association (2014). DSM-5: Manual diagnóstico y estadístico de los trastornos mentales. Editorial Médica Panamericana.";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const BELLOCH_II = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";

// Lote de corrección de claves, texto y ubicación. Todas las afirmaciones se
// contrastan directamente con DSM-5/DSM-5-TR y Belloch originales.
const reviews = {
  PERSEV_JUL25_D2_040: {
    destination: CLINICAL,
    oldC: "c",
    c: "b",
    topic: "Trastornos relacionados con traumas y factores de estrés",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones sobre el trastorno de adaptación es INCORRECTA?",
    o: {
      a: "Los síntomas emocionales o conductuales aparecen dentro de los tres meses siguientes al inicio del factor estresante.",
      b: "Una vez que el factor estresante o sus consecuencias han terminado, los síntomas no se mantienen más de tres meses.",
      c: "El factor estresante puede afectar a un individuo, una familia, un grupo amplio o una comunidad.",
      d: "Los síntomas son clínicamente significativos por malestar intenso desproporcionado al estresor o por deterioro significativo del funcionamiento.",
    },
    x: "La opción b es incorrecta. Tras el cese del factor estresante o de sus consecuencias, los síntomas no pueden mantenerse más de seis meses, no tres. Las restantes opciones recogen los criterios A y B y las características diagnósticas del trastorno de adaptación.",
    r: DSM_TR + " pp. 319-320, criterios A, B y E y características diagnósticas del trastorno de adaptación.",
  },
  PERSEV_JUL25_D2_041: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Psicopatología de la memoria",
    v: "CORREGIDA",
    e: "¿Cuál de las siguientes definiciones corresponde a la ecmnesia?",
    o: {
      a: "Falsificación de recuerdos en un síndrome amnésico, sin intención de mentir, para llenar lagunas de memoria.",
      b: "Fabricación de relatos falsos, no asociada a incentivos externos, característica de la pseudología fantástica.",
      c: "Considerar recuerdos del propio pasado como si fueran actuales y comportarse, en ocasiones, como si se estuviera viviendo de nuevo esa experiencia.",
      d: "Deformación de la memoria por el contenido de un delirio o formación de recuerdos falsos durante este.",
    },
    x: "La opción c es correcta. La ecmnesia es una modalidad de confabulación en la que recuerdos del pasado se viven como actuales. La a define la confabulación, la b la pseudología fantástica y la d los recuerdos delirantes.",
    r: BELLOCH_I + " p. 253, apartado «Paramnesias del recuerdo: pseudo-memorias y falsificación de la memoria».",
  },
  PERSEV_JUL25_D2_042: {
    destination: CLINICAL,
    oldC: "a",
    c: "b",
    topic: "Patología de la conciencia",
    v: "CORREGIDA",
    e: "¿Qué caracteriza a los estados oniroides?",
    o: {
      a: "Se definen por mutismo, inmovilidad y ausencia de reactividad, como síntoma de catatonía.",
      b: "La persona experimenta con elevada claridad y viveza ilusiones o alucinaciones, generalmente escénicas y multimodales, que pueden provocar reacciones emocionales y motoras congruentes.",
      c: "Son el nombre que reciben los estados crepusculares asociados exclusivamente a crisis epilépticas del lóbulo temporal.",
      d: "Consisten únicamente en una ruptura de la continuidad de la conciencia y una restricción del contenido, sin vivencias ilusorias o alucinatorias destacadas.",
    },
    x: "La opción b es correcta. Los estados oniroides son alteraciones de la conciencia con ilusiones o alucinaciones vívidas, por lo común escénicas y multimodales, acompañadas de respuestas afectivas y motoras congruentes. Las demás opciones describen, de forma inexacta, catatonía o estados crepusculares.",
    r: BELLOCH_I + " p. 158, apartado «Estados oniroides».",
  },
  PERSEV_JUL25_D2_045: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos de síntomas somáticos y relacionados",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿a qué diagnóstico corresponden estos ejemplos: ansiedad que agrava el asma, negación de la necesidad de tratar un dolor torácico agudo y manipulación de insulina para perder peso?",
    o: {
      a: "Trastorno de ansiedad por enfermedad.",
      b: "Trastorno de adaptación.",
      c: "Trastorno de síntomas somáticos.",
      d: "Factores psicológicos que influyen en otras afecciones médicas.",
    },
    x: "La opción d es correcta. Son los tres ejemplos clínicos que utiliza el DSM-5-TR para los factores psicológicos que influyen en otras afecciones médicas: factores psicológicos o conductuales que afectan negativamente al curso, tratamiento, riesgo o fisiopatología de una afección médica.",
    r: DSM_TR + " pp. 364-365, criterios y ejemplos clínicos de «Factores psicológicos que influyen en otras afecciones médicas».",
  },
  PERSEV_JUL25_D2_049: {
    destination: CLINICAL,
    oldC: "a",
    c: "a",
    topic: "Trastornos neurocognitivos",
    v: "CORREGIDA",
    e: "¿Cuál de las siguientes categorías se incorporó de forma específica en la tabla de trastornos neurocognitivos inducidos por sustancias del DSM-5-TR respecto al DSM-5?",
    o: {
      a: "Trastorno neurocognitivo leve inducido por sustancias de tipo anfetamínico u otros estimulantes.",
      b: "Trastorno neurocognitivo mayor o leve debido a múltiples etiologías.",
      c: "Delirium.",
      d: "Trastorno neurocognitivo mayor debido a otra afección médica.",
    },
    x: "La opción a es correcta. El DSM-5-TR incluye de forma específica el trastorno neurocognitivo leve inducido por sustancias de tipo anfetamínico u otros estimulantes. La tabla del DSM-5 no contenía esa entrada específica y recogía estas presentaciones bajo «otras sustancias o sustancias desconocidas». Las demás categorías ya figuraban en el DSM-5.",
    r: DSM_TR + " p. 713, tabla de codificación del trastorno neurocognitivo inducido por sustancias/medicamentos; " + DSM_5 + " p. 628, tabla correspondiente.",
  },
  PERSEV_JUL25_D2_053: {
    destination: CLINICAL,
    oldC: "a",
    c: "a",
    topic: "Trastornos neurocognitivos",
    v: "CORREGIDA",
    e: "Sobre las tres variantes de afasia primaria progresiva asociadas a la demencia frontotemporal, señale la opción correcta:",
    o: {
      a: "Para el diagnóstico de la variante no fluente-agramática debe estar presente al menos una de estas características principales: agramatismo o habla laboriosa y dificultosa.",
      b: "El deterioro de la repetición es una característica principal de la variante semántica.",
      c: "En la variante logopénica se altera la comprensión de palabras sueltas.",
      d: "En la variante no fluente-agramática es característica principal el deterioro para recuperar palabras sueltas en el habla espontánea y la nominación.",
    },
    x: "La opción a es correcta. En la variante no fluente-agramática basta una de las dos características principales: agramatismo o habla laboriosa y dificultosa. El deterioro de la repetición y la recuperación de palabras sueltas son rasgos principales de la variante logopénica; la comprensión de palabras sueltas se altera en la variante semántica.",
    r: BELLOCH_II + " p. 610, tabla 17.5 sobre criterios de diagnóstico clínico de las tres variantes de afasia primaria progresiva.",
  },
  PERSEV_JUL25_D2_076: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos depresivos",
    v: "CORREGIDA",
    e: "Según los datos epidemiológicos recogidos por Belloch et al. (2024), señale la afirmación correcta sobre el trastorno de depresión mayor:",
    o: {
      a: "La carga de la depresión es mayor en los países de ingresos bajos o medios que en los países más ricos.",
      b: "En España las mujeres presentan menor riesgo de depresión que los hombres.",
      c: "Vivir solo y tener un nivel bajo de ingresos duplican el riesgo de depresión, mientras que el nivel educativo apenas afecta a las tasas globales.",
      d: "En España la edad de comienzo suele ser menor que en otros países, y el riesgo por edad es más alto entre los 18 y 34 años que entre los 50 y 64 años.",
    },
    x: "La opción c es correcta. El manual informa de que vivir solo y tener un nivel bajo de ingresos duplican el riesgo, mientras que el nivel educativo apenas afecta a las tasas en conjunto. También señala una carga mayor de depresión en países más ricos; en España, las mujeres tienen más riesgo que los hombres y la edad de comienzo suele ser mayor, con mayor riesgo entre los 50 y 64 años.",
    r: BELLOCH_II + " p. 240, apartado de prevalencia e inicio y evolución del trastorno de depresión mayor.",
  },
  PERSEV_JUL25_D2_077: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos depresivos",
    v: "CORREGIDA",
    e: "Señale la afirmación INCORRECTA sobre los síntomas anímicos de la depresión:",
    o: {
      a: "La tristeza es el síntoma anímico por excelencia de la depresión.",
      b: "En depresiones graves puede aparecer negación de la tristeza e incapacidad para llorar.",
      c: "La sobreproducción emocional alude a la coexistencia de tristeza con otras emociones negativas y predice mayor rumiación.",
      d: "La depresión se asocia a una sensibilización de los sistemas de castigo más que a una atenuación de los sistemas de recompensa.",
    },
    x: "La opción d es incorrecta. La depresión se asocia a una atenuación de los sistemas de recompensa, más que a una sensibilización de los sistemas de castigo. La tristeza, la posible incapacidad para llorar en los cuadros graves y la relación entre sobreproducción emocional y rumiación están descritas en el manual.",
    r: BELLOCH_II + " p. 235, apartado «Síntomas anímicos» de los trastornos depresivos.",
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
  block: "Psicología Clínica 11 — adaptación, memoria, conciencia, síntomas somáticos, neurocognición y depresión",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToChildPsychopathology: movedToChild.length,
  clinicalTotal: finalClinical.length,
  childTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
