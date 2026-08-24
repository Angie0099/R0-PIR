import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const paths = {
  treatments: path.join(bancoDir, "tratamientos_infantiles.json"),
  child: path.join(bancoDir, "psicopatologia_infantil.json"),
  clinical: path.join(bancoDir, "psicologia_clinica.json"),
  experimental: path.join(bancoDir, "psicologia_experimental.json"),
  manifest: path.join(bancoDir, "manifest.json"),
};

const CHILD_TREATMENTS = "Tratamientos Infantiles";
const CHILD_PSYCHOPATHOLOGY = "Psicopatología Infantil";
const CLINICAL = "Psicología Clínica";
const EXPERIMENTAL = "Psicología Experimental";
const sourceTocTopic = "TOC infantojuvenil";
const sourceEatingTopic = "Trastornos alimentarios infantojuvenil";
const childEatingTopic = "Trastornos de la conducta alimentaria y de la ingestión infantojuveniles";
const psychosisTopic = "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos";
const clinicalEatingTopic = "Trastornos de la conducta alimentaria y de la ingestión de alimentos";
const memoryTopic = "Psicopatología de la memoria";
const selfHarmTopic = "Conducta suicida y autolesión";
const bipolarTopic = "Trastornos bipolares y relacionados";
const statisticsTopic = "Estadística";
const reviewedStatuses = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const BELLOCH_II = "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";
const WILCOXON = "Wilcoxon, F. (1945). «Individual Comparisons by Ranking Methods». Biometrics Bulletin, 1(6), 80-83. https://doi.org/10.2307/3001968.";

const reviews = {
  "Simu 7 comentado _110": {
    sourceTopic: sourceTocTopic,
    oldC: "d",
    subject: CLINICAL,
    topic: psychosisTopic,
    e: "En familias de personas con esquizofrenia, ¿qué combinación caracteriza una alta emoción expresada?",
    o: {
      a: "Criticismo, calidez y sobreimplicación emocional.",
      b: "Hostilidad, comentarios positivos y calidez.",
      c: "Sobreimplicación emocional, criticismo y comentarios positivos.",
      d: "Criticismo, hostilidad y sobreimplicación emocional.",
    },
    c: "d",
    x: "La opción d es correcta. La alta emoción expresada en la familia se caracteriza por criticismo, hostilidad y sobreimplicación emocional. La calidez y los comentarios positivos no la definen; se asocian a un clima familiar más favorable. Se ha eliminado la atribución exclusiva a Wing, que hacía el enunciado impreciso.",
    r: BELLOCH_II + " Cap. 11, emoción expresada y recaídas en la esquizofrenia, p. 412.",
  },
  SmCm7PIR2024_143: {
    sourceTopic: sourceTocTopic,
    oldC: "d",
    subject: EXPERIMENTAL,
    topic: statisticsTopic,
    e: "¿Qué prueba no paramétrica se utiliza para comparar dos mediciones relacionadas, por ejemplo, antes y después en las mismas personas participantes?",
    o: {
      a: "La U de Mann-Whitney.",
      b: "La H de Kruskal-Wallis.",
      c: "La prueba de Friedman.",
      d: "La prueba de rangos con signo de Wilcoxon.",
    },
    c: "d",
    x: "La opción d es correcta. La prueba de rangos con signo de Wilcoxon se emplea con pares o mediciones relacionadas. Mann-Whitney compara dos grupos independientes; Kruskal-Wallis, más de dos grupos independientes; y Friedman, más de dos mediciones relacionadas.",
    r: WILCOXON + " pp. 80-83.",
  },
  "Simu 15 comentado_208": {
    sourceTopic: sourceEatingTopic,
    oldC: "b",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childEatingTopic,
    e: "En los bebés, ¿entre qué edades suele iniciarse habitualmente el trastorno de rumiación?",
    o: {
      a: "Entre el nacimiento y los 2 meses.",
      b: "Entre los 3 y los 12 meses.",
      c: "Entre los 13 y los 24 meses.",
      d: "Únicamente en la adolescencia.",
    },
    c: "b",
    x: "La opción b es correcta. El DSM-5-TR indica que el trastorno de rumiación puede iniciarse en distintas etapas, pero en los bebés el inicio suele producirse entre los 3 y los 12 meses.",
    r: DSM + " Trastorno de rumiación, desarrollo y curso, p. 375.",
  },
  "Simu 31 comentado Hardcore 1_004": {
    sourceTopic: sourceEatingTopic,
    oldC: "b",
    subject: CLINICAL,
    topic: clinicalEatingTopic,
    e: "Señala la afirmación INCORRECTA sobre los trastornos de la conducta alimentaria y de la ingestión:",
    o: {
      a: "La anorexia nerviosa suele iniciarse antes que la bulimia nerviosa.",
      b: "La anorexia nerviosa y la bulimia nerviosa son más frecuentes en mujeres, mientras que el trastorno por atracón es más frecuente en hombres.",
      c: "En una persona con un trastorno alimentario activo, una ideación suicida estructurada, con acceso a los medios y alto riesgo de intento puede justificar el ingreso.",
      d: "El nivel asistencial debe ser el menos restrictivo que permita mantener la seguridad de la persona.",
    },
    c: "b",
    x: "La opción b es incorrecta. Aunque el trastorno por atracón presenta una proporción de hombres mayor que la anorexia nerviosa y la bulimia nerviosa, sigue siendo más frecuente en mujeres. La anorexia nerviosa se inicia, de media, antes que la bulimia nerviosa; además, el riesgo suicida o autolesivo es una situación que puede requerir hospitalización.",
    r: "Roncero, M. y Perpiñá, C. (2024). «Trastornos alimentarios y de la ingestión de alimentos», en Belloch, Sandín y Ramos (coords.), Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill. pp. 494, 499, 502 y 506.",
  },
  "Simu 31 comentado Hardcore 1_007": {
    sourceTopic: sourceEatingTopic,
    oldC: "b",
    subject: CLINICAL,
    topic: memoryTopic,
    e: "¿Cuál de las siguientes descripciones corresponde a la ecmnesia?",
    o: {
      a: "Dificultad para recuperar el nombre de una persona conocida pese a reconocer su cara.",
      b: "Considerar un recuerdo personal pasado como actual y comportarse como si se estuviera reviviendo.",
      c: "Fabricar deliberadamente síntomas para obtener una ganancia externa.",
      d: "Comprobar repetidamente una tarea para reducir la ansiedad.",
    },
    c: "b",
    x: "La opción b es correcta. La ecmnesia es una modalidad de confabulación en la que recuerdos del propio pasado se viven como actuales; por ello no debe clasificarse como hipermnesia.",
    r: "Diges Junco, M. y Perpiñá Tordera, C. (2024). «Psicopatología de la memoria», en Belloch, Sandín y Ramos (coords.), Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill. p. 253.",
  },
  SmCm1PIR2024_099: {
    sourceTopic: sourceEatingTopic,
    oldC: "c",
    subject: CLINICAL,
    topic: selfHarmTopic,
    e: "Según los criterios propuestos del DSM-5-TR para el trastorno de autolesiones no suicidas, señale la afirmación correcta:",
    o: {
      a: "Las lesiones suelen ser indoloras y no producen sangrado.",
      b: "El trastorno comienza habitualmente en los primeros años de la edad adulta.",
      c: "El alivio o la respuesta deseada puede experimentarse durante o poco después de la autolesión.",
      d: "Cortarse con instrumentos compartidos no incrementa el riesgo de contagio de enfermedades de transmisión sanguínea.",
    },
    c: "c",
    x: "La opción c es correcta. El criterio B indica que el alivio o la respuesta deseada puede experimentarse durante o poco después de la autolesión. Las lesiones suelen ser leves o moderadas y a menudo dolorosas; el inicio es más habitual en la adolescencia temprana o media; y los instrumentos compartidos pueden aumentar el riesgo de contagio de enfermedades de transmisión sanguínea.",
    r: DSM + " Trastorno de autolesiones no suicidas, criterios propuestos y desarrollo, pp. 920-922.",
  },
  "SmCm30PIR2025 (1)_201": {
    sourceTopic: sourceEatingTopic,
    oldC: "d",
    subject: CLINICAL,
    topic: bipolarTopic,
    e: "Sobre el trastorno bipolar I según el DSM-5-TR, señale la afirmación correcta:",
    o: {
      a: "Para diagnosticarlo son imprescindibles un episodio hipomaníaco y un episodio de depresión mayor.",
      b: "Se requiere que se hayan cumplido los criterios de al menos un episodio maníaco a lo largo de la vida y que este no se explique mejor por un trastorno esquizoafectivo, esquizofrenia u otro trastorno psicótico.",
      c: "Un episodio maníaco exige una duración mínima de cuatro días consecutivos.",
      d: "Si durante un episodio aparecen características psicóticas, el episodio se clasifica como hipomaníaco.",
    },
    c: "b",
    x: "La opción b es correcta. Para el trastorno bipolar I basta con al menos un episodio maníaco y deben excluirse los trastornos del espectro esquizofrénico u otros trastornos psicóticos como explicación principal. Los episodios hipomaníacos y de depresión mayor son frecuentes, pero no necesarios; la manía dura al menos una semana o cualquier duración si precisa hospitalización, y las características psicóticas implican que el episodio es maníaco, no hipomaníaco.",
    r: DSM + " Trastorno bipolar I y criterios del episodio maníaco/hipomaníaco, pp. 140-142.",
  },
};

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const treatments = read(paths.treatments);
const child = read(paths.child);
const clinical = read(paths.clinical);
const experimental = read(paths.experimental);
const manifest = read(paths.manifest);
const byId = new Map(treatments.map((question) => [question.id, question]));
const sourceIds = Object.keys(reviews);
const missing = sourceIds.filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas de origen: " + missing.join(", "));

const makeReviewed = (question, review) => {
  if (question.s !== CHILD_TREATMENTS || question.t?.[0] !== review.sourceTopic) {
    throw new Error("Ubicación previa inesperada en " + question.id);
  }
  if (question.c !== review.oldC) throw new Error("La clave previa no coincide en " + question.id);
  const result = { ...question, s: review.subject, t: [review.topic], e: review.e, o: review.o, c: review.c, x: review.x, r: review.r, v: "CORREGIDA" };
  for (const option of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[option] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + option);
  }
  if (!String(result.x).trim() || !String(result.r).trim()) throw new Error("Falta justificación o referencia en " + question.id);
  return result;
};

const reviewed = sourceIds.map((id) => makeReviewed(byId.get(id), reviews[id]));
const destinations = new Map([
  [CHILD_PSYCHOPATHOLOGY, child],
  [CLINICAL, clinical],
  [EXPERIMENTAL, experimental],
]);
const existingDestinationIds = new Set([...child, ...clinical, ...experimental].map((question) => question.id));
const collisions = sourceIds.filter((id) => existingDestinationIds.has(id));
if (collisions.length) throw new Error("ID ya existente en destino: " + collisions.join(", "));
for (const question of reviewed) destinations.get(question.s).push(question);
const finalTreatments = treatments.filter((question) => !sourceIds.includes(question.id));

for (const topic of [sourceTocTopic, sourceEatingTopic]) {
  if (finalTreatments.some((question) => question.t?.[0] === topic)) {
    throw new Error("Quedan preguntas no auditadas en el tema de origen: " + topic);
  }
}
if (!child.every((question) => reviewedStatuses.has(question.v))) {
  throw new Error("Psicopatología Infantil contendría preguntas sin revisión final.");
}

const clinicalTopics = manifest.subjects[CLINICAL].topics;
if (!clinicalTopics.includes(selfHarmTopic)) {
  const after = clinicalTopics.indexOf("Trastornos destructivos, del control de los impulsos y de la conducta");
  clinicalTopics.splice(after >= 0 ? after + 1 : clinicalTopics.length, 0, selfHarmTopic);
}
const treatmentTopics = manifest.subjects[CHILD_TREATMENTS].topics;
for (const topic of [sourceTocTopic, sourceEatingTopic]) {
  if (!treatmentTopics.includes(topic)) throw new Error("No se encuentra el tema en el manifiesto: " + topic);
}
manifest.subjects[CHILD_TREATMENTS].topics = treatmentTopics.filter((topic) => ![sourceTocTopic, sourceEatingTopic].includes(topic));

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const finals = {
  "tratamientos_infantiles.json": finalTreatments,
  "psicopatologia_infantil.json": child,
  "psicologia_clinica.json": clinical,
  "psicologia_experimental.json": experimental,
};
const allAfter = files.flatMap((file) => finals[file] ?? read(path.join(bancoDir, file)));
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== manifest.total) {
  throw new Error("La auditoría alteraría el total de preguntas o sus identificadores.");
}
const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) {
  if (!counts.has(subject)) throw new Error("Faltan preguntas para la asignatura " + subject);
  details.count = counts.get(subject);
}
manifest.total = [...counts.values()].reduce((sum, count) => sum + count, 0);
for (const question of reviewed) {
  if (!manifest.subjects[question.s].topics.includes(question.t[0])) {
    throw new Error("Tema de destino ausente del manifiesto: " + question.id);
  }
}

for (const [file, data] of Object.entries(finals)) fs.writeFileSync(path.join(bancoDir, file), JSON.stringify(data) + "\n", "utf8");
fs.writeFileSync(paths.manifest, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos Infantiles 02 — TOC y trastornos alimentarios",
  reclassifiedAndCorrected: reviewed.length,
  destinations: Object.fromEntries([...counts].filter(([subject]) => [CHILD_PSYCHOPATHOLOGY, CLINICAL, EXPERIMENTAL, CHILD_TREATMENTS].includes(subject))),
  removedEmptyTopics: [sourceTocTopic, sourceEatingTopic],
  addedClinicalTopic: selfHarmTopic,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
