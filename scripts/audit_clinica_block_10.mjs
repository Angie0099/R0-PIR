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

// Lote focalizado en texto corrupto, justificaciones incrustadas y cuatro
// desubicaciones inequívocas hacia Psicopatología Infantil. Las fuentes son
// el DSM-5-TR original, no materiales de academia.
const reviews = {
  PERSEV_JUL25_D2_047: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos de la personalidad",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación INCORRECTA sobre los criterios diagnósticos de los trastornos de la personalidad:",
    o: {
      a: "El rencor persistente es un criterio diagnóstico del trastorno de la personalidad paranoide.",
      b: "El enfado inapropiado e intenso, o la dificultad para controlar la ira, es un criterio diagnóstico del trastorno límite de la personalidad.",
      c: "Carecer de empatía es un criterio diagnóstico del trastorno de la personalidad antisocial.",
      d: "La impulsividad o el fracaso para planear con antelación son criterios diagnósticos del trastorno de la personalidad antisocial.",
    },
    x: "La opción c es incorrecta. La falta de empatía se describe como una característica asociada del trastorno de la personalidad antisocial, pero no figura entre sus criterios diagnósticos; sí es un criterio del trastorno de la personalidad narcisista. Las demás afirmaciones recogen criterios diagnósticos de los trastornos indicados.",
    r: DSM + " pp. 737-738, 749, 753 y 761, criterios del trastorno de personalidad paranoide, antisocial, límite y narcisista.",
  },
  PERSEV_JUL25_D2_062: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre el curso y la evolución de la esquizofrenia:",
    o: {
      a: "Los hombres presentan síntomas positivos más prominentes, menor deterioro cognitivo y mejor funcionamiento que las mujeres.",
      b: "Solo una minoría de las personas con esquizofrenia experimenta períodos de remisión, y todavía menos recuperación.",
      c: "El pico de edad de inicio se sitúa al comienzo y a mitad de la veintena en las mujeres y a finales de la veintena en los varones.",
      d: "Existe una tendencia a la reducción de las experiencias psicóticas en las últimas etapas de la vida.",
    },
    x: "La opción d es correcta. El DSM-5-TR describe una reducción de las experiencias psicóticas en las últimas etapas de la vida. El pico de inicio es más temprano en los varones; en ellos, especialmente cuando hay larga duración de psicosis no tratada y peor ajuste premórbido, predominan más los síntomas negativos, el deterioro cognitivo y el peor funcionamiento. Además, muchas personas presentan períodos de remisión e incluso recuperación.",
    r: DSM + " p. 117, apartado «Desarrollo y curso» de la esquizofrenia.",
  },
  PERSEV_JUL25_D2_064: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastorno obsesivo-compulsivo y relacionados",
    v: "CORREGIDA",
    e: "Sobre el especificador «con historia reciente o antigua de un trastorno de tics» del DSM-5-TR para el trastorno obsesivo-compulsivo (TOC), ¿cuál de las siguientes afirmaciones es correcta?",
    o: {
      a: "Es más frecuente en mujeres.",
      b: "Se presenta en alrededor del 10 % de las personas con TOC.",
      c: "Las personas con este especificador pueden diferir en los temas de los síntomas, la comorbilidad, el curso y el patrón de transmisión familiar.",
      d: "En los niños se observa una tríada de TOC, trastorno de tics y discapacidad intelectual.",
    },
    x: "La opción c es correcta. Hasta un 30 % de las personas con TOC presenta un trastorno de tics a lo largo de la vida; esta comorbilidad es más frecuente en varones con inicio infantil del TOC. Estas personas pueden diferir en los temas sintomáticos, la comorbilidad, el curso y la transmisión familiar. En la infancia, la tríada descrita es TOC, tics y TDAH, no discapacidad intelectual.",
    r: DSM + " pp. 266-267, especificador «con historia reciente o antigua de un trastorno de tics» del TOC.",
  },
  PERSEV_JUL25_D2_069: {
    destination: CLINICAL,
    oldC: "d",
    c: "d",
    topic: "Disfunciones sexuales",
    v: "CORREGIDA",
    e: "En el DSM-5-TR, ¿cómo se clasifica el antiguo trastorno por aversión al sexo del DSM-IV-TR?",
    o: {
      a: "Como un trastorno parafílico.",
      b: "Como una disfunción sexual independiente.",
      c: "Como una afección de la Sección III que requiere más estudio.",
      d: "Como otra disfunción sexual especificada.",
    },
    x: "La opción d es correcta. El DSM-5-TR incluye la aversión sexual como ejemplo de motivo que puede especificarse dentro de «otra disfunción sexual especificada», cuando existe malestar clínicamente significativo pero no se cumplen todos los criterios de una disfunción sexual concreta.",
    r: DSM + " p. 509, apartado «Otra disfunción sexual especificada» (ejemplo: «aversión sexual»).",
  },
  PERSEV_JUL25_D2_073: {
    destination: CHILD,
    oldC: "a",
    c: "a",
    topic: "Trastornos de eliminación infantojuveniles",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre la prevalencia y las diferencias por sexo en la enuresis:",
    o: {
      a: "Hay predominio masculino, especialmente en los grupos de menor edad, los casos más leves y la enuresis exclusivamente nocturna.",
      b: "Las infecciones urinarias se asocian con frecuencia a la enuresis nocturna, especialmente en los niños.",
      c: "El riesgo relativo de que un hijo desarrolle enuresis es mayor si la madre tuvo enuresis que si la tuvo el padre.",
      d: "La enuresis presenta una prevalencia mayor entre jóvenes con trastorno de conducta.",
    },
    x: "La opción a es correcta. La enuresis nocturna es más frecuente en varones, particularmente en niños más pequeños, casos leves y enuresis monosintomática. Las infecciones urinarias se asocian más con enuresis diurna, sobre todo en mujeres; el riesgo relativo es mayor cuando el padre tuvo enuresis; y la mayor prevalencia se describe en jóvenes con discapacidad del aprendizaje o TDAH, no con trastorno de conducta.",
    r: DSM + " pp. 400-401, prevalencia, factores de riesgo y aspectos diagnósticos relacionados con el sexo y el género de la enuresis.",
  },
  PERSEV_JUL25_D2_080: {
    destination: CHILD,
    oldC: "b",
    c: "b",
    topic: "Trastornos depresivos y bipolares infantojuveniles",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación INCORRECTA sobre el trastorno de desregulación disruptiva del estado de ánimo:",
    o: {
      a: "El rasgo central del trastorno es una irritabilidad crónica, grave y persistente.",
      b: "Durante el período de 12 meses no puede haber un intervalo de más de dos meses consecutivos sin todos los síntomas de los criterios A-D.",
      c: "Los accesos de cólera se producen, en término medio, tres o más veces por semana, y los criterios A-D han estado presentes durante 12 o más meses.",
      d: "El primer diagnóstico no debe realizarse antes de los 6 años ni después de los 18, y los síntomas comienzan antes de los 10 años.",
    },
    x: "La opción b es incorrecta. Durante los 12 meses exigidos, el DSM-5-TR permite que no haya todos los síntomas de los criterios A-D durante un máximo de menos de tres meses consecutivos; por tanto, el límite es de tres meses, no de dos. Las demás afirmaciones reproducen los criterios y las características diagnósticas del trastorno.",
    r: DSM + " pp. 178-179, criterios C, E, G y H y características diagnósticas del trastorno de desregulación disruptiva del estado de ánimo.",
  },
  PERSEV_JUL25_D2_082: {
    destination: CHILD,
    oldC: "a",
    c: "a",
    topic: "Trastornos de la comunicación",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál de las siguientes formulaciones corresponde al criterio A del trastorno del lenguaje?",
    o: {
      a: "Dificultades persistentes en la adquisición y uso del lenguaje en todas sus modalidades —hablada, escrita, lengua de signos u otra— debidas a deficiencias de comprensión o producción.",
      b: "Dificultad persistente con la producción de los sonidos del habla que interfiere con la inteligibilidad o impide la comunicación verbal de mensajes.",
      c: "Alteraciones de la fluidez normal y del patrón temporal del habla que son inapropiadas para la edad y las habilidades lingüísticas de la persona.",
      d: "Dificultades persistentes en el uso social de la comunicación verbal y no verbal.",
    },
    x: "La opción a es correcta y reproduce el criterio A del trastorno del lenguaje. La b corresponde al trastorno de los sonidos del habla; la c, al trastorno de la fluidez de inicio en la infancia; y la d, al trastorno de la comunicación social (pragmático).",
    r: DSM + " p. 47, criterios diagnósticos de los trastornos del lenguaje, de los sonidos del habla, de la fluidez de inicio en la infancia y de la comunicación social (pragmático).",
  },
  PERSEV_JUL25_D2_085: {
    destination: CHILD,
    oldC: "b",
    c: "b",
    topic: "Trastornos relacionados con traumas y factores de estrés infantojuveniles",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, señale la afirmación correcta sobre las diferencias entre los criterios de trastorno de estrés postraumático (TEPT) para mayores y para menores de 6 años:",
    o: {
      a: "En mayores de 6 años se elimina la conducta imprudente o autodestructiva de los síntomas de alerta y reactividad.",
      b: "En menores de 6 años no se incluye la conducta imprudente o autodestructiva entre los síntomas de alerta y reactividad.",
      c: "En menores de 6 años se requieren al menos seis síntomas para el diagnóstico.",
      d: "En mayores de 6 años bastan cuatro síntomas para el diagnóstico.",
    },
    x: "La opción b es correcta. Para mayores de 6 años, el grupo de alerta y reactividad incluye la conducta imprudente o autodestructiva; en el conjunto de criterios para menores de 6 años no aparece ese síntoma. El mínimo de síntomas es cuatro en menores de 6 años (uno de intrusión, uno de evitación o alteración cognitiva/estado de ánimo y dos de alerta/reactividad) y seis en mayores de 6 años.",
    r: DSM + " pp. 301-304, criterios de TEPT para mayores y para menores de 6 años.",
  },
  AGOSTO2_073: {
    destination: CLINICAL,
    oldC: "c",
    c: "c",
    topic: "Trastornos de síntomas somáticos y relacionados",
    v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál es el especificador de gravedad «grave» del trastorno de síntomas somáticos?",
    o: {
      a: "Se cumple uno de los síntomas especificados en el criterio B.",
      b: "Se cumplen dos o más síntomas especificados en el criterio B.",
      c: "Se cumplen dos o más síntomas especificados en el criterio B y, además, existen múltiples quejas somáticas o un síntoma somático muy intenso.",
      d: "Se cumplen tres o más síntomas especificados en el criterio B y existen múltiples quejas somáticas.",
    },
    x: "La opción c es correcta. El DSM-5-TR especifica gravedad leve si se cumple un síntoma del criterio B, moderada si se cumplen dos o más y grave si, además de dos o más síntomas del criterio B, hay múltiples quejas somáticas o un síntoma somático muy intenso.",
    r: DSM + " p. 351, especificador de gravedad actual del trastorno de síntomas somáticos.",
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
  block: "Psicología Clínica 10 — personalidad, esquizofrenia, TOC, sexualidad, enuresis, TDDEA, lenguaje, TEPT y síntomas somáticos",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  movedToChildPsychopathology: movedToChild.length,
  clinicalTotal: finalClinical.length,
  childTotal: finalChild.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
