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

// Lote focalizado en desubicaciones de psicopatología infantil y explicaciones
// incrustadas. Todas las claves se contrastan con manuales de referencia originales.
const reviews = {
  PERSEV_JUL25_D2_036: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos relacionados con traumas y factores de estrés",
    v: "CORREGIDA",
    e: "Según la CIE-11, ¿cuál de las siguientes es una característica adicional necesaria para el diagnóstico de trastorno de estrés postraumático complejo?",
    o: {
      a: "Creencias negativas persistentes sobre los demás.",
      b: "Insomnio aislado.",
      c: "Consumo de sustancias.",
      d: "Dificultades persistentes para mantener relaciones y sentirse cerca de los demás.",
    },
    x: "Además de cumplir los criterios de TEPT, el TEPT complejo requiere alteraciones graves y persistentes de la organización del yo: problemas de regulación afectiva, creencias negativas sobre uno mismo y dificultades para mantener relaciones o sentirse cercano a los demás. La opción d recoge este último componente.",
    r: CIE + " código 6B41, «Trastorno de estrés postraumático complejo».",
  },
  PERSEV_JUL25_D2_079: {
    destination: CHILD,
    oldC: "b",
    c: "b",
    topic: "Trastornos relacionados con traumas y factores de estrés infantojuveniles",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál es la edad de desarrollo mínima para diagnosticar tanto el trastorno de apego reactivo como el trastorno de relación social desinhibida?",
    o: {
      a: "6 meses.",
      b: "9 meses.",
      c: "1 año.",
      d: "3 años.",
    },
    x: "La opción b es correcta. Ambos trastornos requieren que el niño tenga una edad de desarrollo de al menos 9 meses, porque antes de esa etapa todavía no cabe esperar la formación de apegos selectivos.",
    r: DSM + " pp. 296 y 299, criterios G y E del trastorno de apego reactivo y del trastorno de relación social desinhibida.",
  },
  PERSEV_AGO25_U1_032: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos depresivos",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre las características asociadas al trastorno de depresión mayor:",
    o: {
      a: "Los pacientes deprimidos que ingresan en residencias de ancianos tienen una probabilidad notablemente incrementada de fallecer a los dos años.",
      b: "En los niños puede presentarse ansiedad social como característica asociada típica.",
      c: "La hiperactividad del eje hipofisario-hipotalámico-adrenal parece relacionarse con la depresión atípica.",
      d: "Los adultos con depresión mayor muestran signos de alteraciones funcionales en sistemas neurales implicados en el procesamiento emocional, la búsqueda de recompensa y la regulación emocional.",
    },
    x: "La opción d es correcta. El DSM-5-TR describe alteraciones funcionales en sistemas neurales de procesamiento emocional, recompensa y regulación emocional. La mayor mortalidad en residentes deprimidos se señala durante el primer año, en niños se menciona la ansiedad por separación y la hiperactividad del eje hipofisario-hipotalámico-adrenal se asocia a melancolía, rasgos psicóticos y riesgo de suicidio.",
    r: DSM + " p. 187, características asociadas del trastorno de depresión mayor.",
  },
  AGOSTO2_041: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos relacionados con traumas y factores de estrés",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuántos síntomas se requieren para diagnosticar un trastorno de estrés agudo?",
    o: {
      a: "5 o más.",
      b: "6 o más.",
      c: "9 o más.",
      d: "4 o más.",
    },
    x: "La opción c es correcta. El criterio B del trastorno de estrés agudo exige la presencia de nueve o más síntomas de las categorías de intrusión, estado de ánimo negativo, disociación, evitación y alerta.",
    r: DSM + " p. 314, criterio B del trastorno de estrés agudo.",
  },
  AGOSTO2_070: {
    destination: CHILD,
    oldC: "a",
    c: "a",
    topic: "Trastorno del espectro del autismo (TEA)",
    v: "CORREGIDA",
    e: "Según la tabla de gravedad del DSM-5-TR para el trastorno del espectro autista, ¿a qué grado corresponde que los problemas de organización y planificación dificulten la autonomía?",
    o: {
      a: "Grado 1: necesita ayuda.",
      b: "Grado 2: necesita ayuda notable.",
      c: "Grado 3: necesita ayuda muy notable.",
      d: "Grado 4: necesita ayuda extrema.",
    },
    x: "La opción a es correcta. En la tabla de gravedad, los problemas de organización y planificación que dificultan la autonomía se describen en el grado 1, dentro del dominio de comportamientos restringidos y repetitivos. El DSM-5-TR establece tres grados de gravedad.",
    r: DSM + " p. 58, tabla 2 «Niveles de gravedad del trastorno del espectro autista».",
  },
  JULIO2_017: {
    destination: CHILD,
    oldC: "b",
    c: "b",
    topic: "Discapacidad intelectual",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre el trastorno del desarrollo intelectual (discapacidad intelectual):",
    o: {
      a: "La prevalencia global es aproximadamente del 1 %, y la prevalencia de discapacidad intelectual grave es de 6 por cada 10 000 habitantes.",
      b: "Los varones tienen más probabilidad que las mujeres de recibir el diagnóstico tanto en formas leves, con una proporción aproximada de 1,6:1, como graves, con una proporción aproximada de 1,2:1.",
      c: "La vulnerabilidad del sexo femenino a los problemas cerebrales explica las diferencias observadas entre sexos.",
      d: "Es una afección homogénea con múltiples causas.",
    },
    x: "La opción b es correcta. El DSM-5-TR informa de una proporción varón:mujer aproximada de 1,6:1 en las formas leves y de 1,2:1 en las graves. El manual describe el trastorno como una afección heterogénea con múltiples causas y señala la vulnerabilidad del sexo masculino, no del femenino, entre los factores que pueden contribuir a las diferencias.",
    r: DSM + " pp. 42-44, características asociadas, prevalencia y aspectos relacionados con el sexo y el género.",
  },
  JULIO2_019: {
    destination: CHILD,
    oldC: "d",
    c: "d",
    topic: "Trastorno por déficit de atención con hiperactividad (TDAH)",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre el trastorno por déficit de atención con hiperactividad (TDAH):",
    o: {
      a: "Para adolescentes mayores y adultos, a partir de los 17 años, se requieren al menos cuatro síntomas.",
      b: "Algunos síntomas de inatención o hiperactivo-impulsivos deben haber estado presentes antes de los 6 años.",
      c: "Las encuestas de población estiman una prevalencia aproximada del 2,5 % en niños y del 5 % en adultos.",
      d: "En la etapa preescolar, la principal manifestación suele ser la hiperactividad.",
    },
    x: "La opción d es correcta. En el TDAH, la hiperactividad es la manifestación principal durante la etapa preescolar. A partir de los 17 años se requieren al menos cinco síntomas, algunos síntomas deben estar presentes antes de los 12 años y el DSM-5-TR informa de una prevalencia global estimada mayor en niños que en adultos.",
    r: DSM + " pp. 68-71, criterios, prevalencia y desarrollo y curso del TDAH.",
  },
  JUNIO1_118: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos de síntomas somáticos y relacionados",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿a cuál de los trastornos de síntomas somáticos y relacionados corresponde el especificador «episodio único» o «episodios recurrentes»?",
    o: {
      a: "Trastorno de síntomas somáticos.",
      b: "Trastorno de ansiedad por enfermedad.",
      c: "Trastorno de conversión (trastorno de síntomas neurológicos funcionales).",
      d: "Trastorno facticio.",
    },
    x: "La opción d es correcta. El DSM-5-TR contempla los especificadores «episodio único» y «episodios recurrentes» para el trastorno facticio, tanto impuesto a uno mismo como impuesto a otro.",
    r: DSM + " p. 367, especificadores del trastorno facticio.",
  },
  MAYO2_030: {
    destination: CLINICAL,
    oldC: "b",
    c: "b",
    topic: "Patología de la conciencia",
    v: "CORREGIDA",
    e: "¿Qué alteración cualitativa de la conciencia puede aparecer como consecuencia de crisis epilépticas del lóbulo temporal?",
    o: {
      a: "Estupor.",
      b: "Estados crepusculares.",
      c: "Estados oniroides.",
      d: "Delirium.",
    },
    x: "La opción b es correcta. Los estados crepusculares se reservan para alteraciones de la conciencia que pueden aparecer en la epilepsia, especialmente en crisis del lóbulo temporal. Son estados transitorios, de inicio y final súbitos, con restricción del campo de conciencia.",
    r: BELLOCH + " p. 157, apartado «Estados crepusculares».",
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
  block: "Psicología Clínica 09 — trauma, depresión, TEA, discapacidad intelectual, TDAH y conciencia",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToChildPsychopathology: movedToChild.length,
  clinicalTotal: finalClinical.length,
  childTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
