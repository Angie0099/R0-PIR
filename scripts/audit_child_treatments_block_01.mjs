import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const treatmentsPath = path.join(bancoDir, "tratamientos_infantiles.json");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const personalityPath = path.join(bancoDir, "psicologia_de_la_personalidad_y_diferencial.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CHILD_TREATMENTS = "Tratamientos Infantiles";
const CHILD_PSYCHOPATHOLOGY = "Psicopatología Infantil";
const CLINICAL = "Psicología Clínica";
const PERSONALITY = "Psicología de la Personalidad y Diferencial";
const excretionTreatmentTopic = "Trastornos de excreción infantojuvenil";
const sleepTreatmentTopic = "Trastornos del sueño infantojuvenil";
const childExcretionTopic = "Trastornos de eliminación infantojuveniles";
const childAdhdTopic = "Trastorno por déficit de atención con hiperactividad (TDAH)";
const childOcdTopic = "Trastorno obsesivo-compulsivo y relacionados infantojuveniles";
const childIntellectualTopic = "Discapacidad intelectual";
const clinicalPerceptionTopic = "Psicopatología de la sensopercepción";
const cattellTopic = "Modelos factoriales II: Cattell";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const INFANT_CONDUCT = "Comeche Moreno, M.ª I., y Domingo Comeche, L. (2016). «Trastornos de la excreción: enuresis y encopresis», en Comeche Moreno y Vallejo Pareja (eds.), Manual de terapia de conducta en la infancia (3.ª ed.). Dykinson.";
const BELLOCH = "Belloch, A., Sandín, B., y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";

const treatmentReviews = {
  SIM_PERS_AGO25_033: {
    oldC: "c",
    e: "En el tratamiento conductual de la enuresis nocturna, ¿qué procedimiento constituye el elemento central de la mayor parte de las intervenciones según el Manual de terapia de conducta en la infancia?",
    o: {
      a: "La alarma urinaria o pipí-stop, que detecta la humedad y facilita el despertar al comienzo de la micción.",
      b: "La restricción sistemática de líquidos acompañada de castigo positivo.",
      c: "La desmopresina como única intervención, sin evaluación ni medidas conductuales.",
      d: "La alarma utilizada exclusivamente para la incontinencia diurna.",
    },
    c: "a",
    x: "La opción a es correcta. El manual señala que las intervenciones conductuales de la enuresis combinan en distinta medida la alarma urinaria, el entrenamiento en retención voluntaria y el entrenamiento en cama seca; la alarma urinaria constituye el elemento central de la mayor parte de ellas. Esto evita presentar como única primera elección técnicas que dependen de la valoración clínica individual.",
    r: INFANT_CONDUCT + " Capítulo 8, tratamiento conductual de la enuresis, apartado «Método de la alarma urinaria»."
  },
  SIM_PERS_AGO25_065: {
    oldC: "b",
    e: "En una encopresis retentiva, ¿cuál es el foco inicial del tratamiento médico según el Manual de terapia de conducta en la infancia?",
    o: {
      a: "Eliminar la retención fecal o desimpactar, para favorecer la recuperación del tamaño y tono rectales antes de mantener hábitos de evacuación.",
      b: "Evitar cualquier actuación sobre el estreñimiento y centrarse solo en reforzar una muda limpia.",
      c: "Aplicar únicamente exposición interoceptiva a las sensaciones de defecar.",
      d: "Retirar de inmediato todos los líquidos de la dieta del niño.",
    },
    c: "a",
    x: "La opción a es correcta. En la encopresis retentiva, el foco inicial médico es eliminar la retención fecal o desimpactar. Después se previene la reacumulación con las medidas médicas necesarias y se instauran pautas dietéticas, hábitos intestinales y estrategias conductuales. El manual subraya que la combinación médico-conductual es más eficaz que cualquiera de los dos componentes por separado.",
    r: INFANT_CONDUCT + " Capítulo 8, tratamiento médico y conductual de la encopresis, pp. 362-363."
  },
  SIM_PERS_AGO25_124: {
    oldC: "b",
    e: "Tras el aprendizaje con alarma urinaria, ¿qué respuestas puede llegar a provocar la distensión vesical antes de que el niño comience a orinar?",
    o: {
      a: "La continuación automática de la micción y una mayor relajación del esfínter.",
      b: "El despertar y la contracción del esfínter o inhibición de la micción.",
      c: "La habituación completa al sonido, sin cambios en la continencia.",
      d: "Únicamente la eliminación de la necesidad de dormir.",
    },
    c: "b",
    x: "La opción b es correcta. El manual describe que, tras varios ensayos con la alarma, la distensión vesical puede actuar como estímulo condicionado y provocar despertar e inhibición de la micción antes de que esta se inicie. La explicación incorpora procesos de condicionamiento clásico y, según el caso, también operante.",
    r: INFANT_CONDUCT + " Capítulo 8, «Método de la alarma urinaria», pp. 346-347."
  },
};

const childReviews = {
  "Simu 16 comentado_189": {
    oldC: "d",
    topic: childAdhdTopic,
    e: "¿Cuál de los siguientes síntomas pertenece al dominio de hiperactividad e impulsividad y no al de inatención del TDAH según el DSM-5-TR?",
    o: {
      a: "Cometer errores por descuido o no prestar suficiente atención a los detalles.",
      b: "Tener dificultades para organizar tareas y actividades.",
      c: "Perder con frecuencia objetos necesarios para tareas o actividades.",
      d: "Hablar excesivamente.",
    },
    c: "d",
    x: "La opción d es correcta. «Habla excesivamente» pertenece al conjunto de síntomas de hiperactividad e impulsividad. Las opciones a, b y c corresponden a síntomas de inatención del criterio A1 del TDAH.",
    r: DSM + " p. 68, criterio A del TDAH."
  },
  "Simu 16 comentado_192": {
    oldC: "b",
    topic: childOcdTopic,
    e: "Según Belloch y colaboradores, ¿qué afirmación sobre el pensamiento mágico es correcta?",
    o: {
      a: "Su presencia permite diagnosticar por sí sola un trastorno obsesivo-compulsivo en cualquier niño.",
      b: "Puede aparecer en niños que todavía no han desarrollado plenamente la capacidad de razonamiento lógico, por lo que debe interpretarse dentro del contexto clínico completo.",
      c: "Solo aparece en la esquizofrenia y nunca en el trastorno obsesivo-compulsivo.",
      d: "Es incompatible con cualquier problema de desarrollo cognitivo o intelectual.",
    },
    c: "b",
    x: "La opción b es correcta. Belloch y colaboradores describen el pensamiento mágico como una modalidad de obsesión que también puede presentarse cuando la capacidad de razonamiento lógico aún no se ha desarrollado plenamente, como sucede en la infancia. Por tanto, su presencia aislada no basta para establecer un diagnóstico de TOC: debe valorarse el conjunto de síntomas, el malestar y la interferencia.",
    r: BELLOCH + " Capítulo sobre obsesiones, nota sobre pensamiento mágico y desarrollo infantil."
  },
  "Simu 7 comentado _119": {
    oldC: "b",
    topic: childIntellectualTopic,
    e: "En el trastorno del desarrollo intelectual, ¿a qué dominio y nivel de gravedad corresponde que la persona pueda responsabilizarse de comer, vestirse, funciones excretoras e higiene como un adulto tras un aprendizaje prolongado y con recordatorios?",
    o: {
      a: "Dominio práctico, gravedad leve.",
      b: "Dominio práctico, gravedad moderada.",
      c: "Dominio conceptual, gravedad leve.",
      d: "Dominio conceptual, gravedad moderada.",
    },
    c: "b",
    x: "La opción b es correcta. En el nivel moderado del dominio práctico, el DSM-5-TR indica que la persona puede responsabilizarse de sus necesidades personales, incluidas las funciones excretoras y la higiene, tras un período largo de aprendizaje y con posibles recordatorios. La gravedad se determina por el funcionamiento adaptativo, no solo por el cociente intelectual.",
    r: DSM + " p. 40, tabla de gravedad del trastorno del desarrollo intelectual, dominio práctico moderado."
  },
};

const perceptionReview = {
  id: "SmCm13PIR2025_009",
  oldC: "a",
  e: "¿Cómo se denomina una imagen anómala que puede aparecer al despertar del sueño, sin estímulo externo desencadenante?",
  o: {
    a: "Imagen hipnopómpica.",
    b: "Imagen mnésica.",
    c: "Imagen consecutiva.",
    d: "Imagen parásita.",
  },
  c: "a",
  x: "La opción a es correcta. Las imágenes hipnagógicas e hipnopómpicas se clasifican entre las pseudopercepciones o imágenes anómalas. Las hipnopómpicas se producen en la transición del sueño a la vigilia, es decir, al despertar.",
  r: BELLOCH + " Cap. 6, Psicopatología de la percepción y la imaginación, p. 174."
};

const cattellMove = {
  id: "Simu 14 comentado _163",
  oldC: "c",
  note: "Pendiente de validación final con una fuente original específica de Psicología Diferencial; se ha reubicado porque pertenece al modelo de Cattell, no a tratamientos de excreción.",
};

const treatments = JSON.parse(fs.readFileSync(treatmentsPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const personality = JSON.parse(fs.readFileSync(personalityPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const treatmentById = new Map(treatments.map((question) => [question.id, question]));
const sourceIds = new Set([
  ...Object.keys(treatmentReviews),
  ...Object.keys(childReviews),
  perceptionReview.id,
  cattellMove.id,
]);
const missing = [...sourceIds].filter((id) => !treatmentById.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas de Tratamientos Infantiles: " + missing.join(", "));

const ensureSource = (question, topic, review) => {
  if (question.s !== CHILD_TREATMENTS || question.t?.[0] !== topic) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
};
const makeReviewed = (question, review, subject, topic) => {
  const result = { ...question, s: subject, t: [topic], e: review.e, o: review.o, c: review.c, x: review.x, r: review.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  return result;
};

const reviewedTreatments = Object.entries(treatmentReviews).map(([id, review]) => {
  const question = treatmentById.get(id);
  ensureSource(question, excretionTreatmentTopic, review);
  return makeReviewed(question, review, CHILD_TREATMENTS, excretionTreatmentTopic);
});
const movedToChild = Object.entries(childReviews).map(([id, review]) => {
  const question = treatmentById.get(id);
  ensureSource(question, excretionTreatmentTopic, review);
  return makeReviewed(question, review, CHILD_PSYCHOPATHOLOGY, review.topic);
});
const perceptionSource = treatmentById.get(perceptionReview.id);
ensureSource(perceptionSource, sleepTreatmentTopic, perceptionReview);
const movedToClinical = makeReviewed(perceptionSource, perceptionReview, CLINICAL, clinicalPerceptionTopic);
const cattellSource = treatmentById.get(cattellMove.id);
ensureSource(cattellSource, excretionTreatmentTopic, cattellMove);
const movedToPersonality = {
  ...cattellSource,
  s: PERSONALITY,
  t: [cattellTopic],
  x: cattellMove.note,
  r: "",
  v: "REVISAR",
};

const destinationIds = new Set([...child, ...clinical, ...personality].map((question) => question.id));
const collisions = [...sourceIds].filter((id) => destinationIds.has(id));
if (collisions.length) throw new Error("Los identificadores ya existen en los destinos: " + collisions.join(", "));
const untouchedTreatments = treatments.filter((question) => !sourceIds.has(question.id));
const finalTreatments = [...untouchedTreatments, ...reviewedTreatments];
const finalChild = [...child, ...movedToChild];
const finalClinical = [...clinical, movedToClinical];
const finalPersonality = [...personality, movedToPersonality];

const excretionQuestions = finalTreatments.filter((question) => question.t?.[0] === excretionTreatmentTopic);
if (excretionQuestions.length !== reviewedTreatments.length || !excretionQuestions.every((question) => reviewed.has(question.v))) {
  throw new Error("El tema de excreción infantil no queda completamente revisado.");
}
if (finalTreatments.some((question) => question.t?.[0] === sleepTreatmentTopic)) {
  throw new Error("El tema de sueño mantiene preguntas que no son de tratamientos infantiles.");
}
if (!finalChild.every((question) => reviewed.has(question.v))) {
  throw new Error("La asignatura de Psicopatología Infantil contendría preguntas sin revisión final.");
}

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "tratamientos_infantiles.json") return finalTreatments;
  if (file === "psicopatologia_infantil.json") return finalChild;
  if (file === "psicologia_clinica.json") return finalClinical;
  if (file === "psicologia_de_la_personalidad_y_diferencial.json") return finalPersonality;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== manifest.total) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}

const treatmentTopics = manifest.subjects[CHILD_TREATMENTS].topics;
if (!treatmentTopics.includes(sleepTreatmentTopic)) throw new Error("No se encuentra el tema de sueño en el manifiesto.");
manifest.subjects[CHILD_TREATMENTS].topics = treatmentTopics.filter((topic) => topic !== sleepTreatmentTopic);
const countsBySubject = new Map();
for (const question of allAfter) countsBySubject.set(question.s, (countsBySubject.get(question.s) || 0) + 1);
for (const [name, details] of Object.entries(manifest.subjects)) {
  const count = countsBySubject.get(name);
  if (count === undefined) throw new Error("Faltan preguntas para la asignatura " + name + ".");
  details.count = count;
}
manifest.total = [...countsBySubject.values()].reduce((sum, count) => sum + count, 0);

fs.writeFileSync(treatmentsPath, JSON.stringify(finalTreatments) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");
fs.writeFileSync(personalityPath, JSON.stringify(finalPersonality) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos Infantiles 01 — excreción y sueño",
  validatedExcretionTreatments: reviewedTreatments.length,
  relocatedToChildPsychopathology: movedToChild.length,
  relocatedToClinical: 1,
  relocatedToPersonalityPendingSource: 1,
  removedEmptyTopic: sleepTreatmentTopic,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
