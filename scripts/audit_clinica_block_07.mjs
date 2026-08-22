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

// El bloque combina correcciones con fuente primaria directa y limpiezas que
// requieren conservar la prudencia documental. Ningún ítem pendiente se marca
// como validado mientras no exista una fuente original comprobable.
const reviews = {
  JULIO1_076: {
    destination: CLINICAL, oldC: "c", c: "c", topic: "Patología de la conciencia", v: "CORREGIDA",
    e: "En la psicopatología de la conciencia del sí mismo, ¿a qué dimensión corresponde la escisión de la unidad del yo?",
    o: {
      a: "Confusión de los límites del yo.",
      b: "Pérdida de atribución personal.",
      c: "Deterioro en la unidad del yo.",
      d: "Pérdida de la experiencia de la realidad.",
    },
    x: "La escisión de la unidad del yo es una experiencia disociativa incluida entre las anomalías de la experiencia de la unidad del sí mismo, también denominada deterioro en la unidad del yo.",
    r: `${BELLOCH} pp. 158-161, apartado «Alteraciones de la conciencia del sí mismo».`,
  },
  "MAYO-UNO-24_COMENTADO_033": {
    destination: CLINICAL, oldC: "c", c: "c", topic: "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos", v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál de las siguientes es una manifestación negativa de la esquizofrenia?",
    o: {
      a: "Alucinaciones auditivas recurrentes.",
      b: "Delirios de grandeza.",
      c: "Abulia, anhedonia o disminución de la expresión emocional.",
      d: "Discurso desorganizado con asociaciones laxas.",
    },
    x: "Los síntomas negativos incluyen, entre otros, expresión emotiva disminuida, abulia, alogia, anhedonia y asocialidad. Las otras alternativas pertenecen a los dominios psicóticos de alucinaciones, delirios o pensamiento desorganizado.",
    r: `${DSM} pp. 101-103, apartado «Síntomas negativos».`,
  },
  "PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_005": {
    destination: CLINICAL, oldC: "c", c: "c", topic: "Psicopatología del pensamiento", v: "REVISAR_FUENTE",
    e: "¿A qué tipo de pensamiento repetitivo negativo se refiere la siguiente definición: «forma de responder al malestar centrando de manera repetitiva y pasiva la atención en los síntomas y en sus posibles causas y consecuencias»?",
    o: {
      a: "Preocupación (worry).",
      b: "Pensamiento automático negativo.",
      c: "Rumiación.",
      d: "Obsesión.",
    },
    x: "Se ha retirado la explicación incorporada en una alternativa y se ha reubicado el ítem en psicopatología del pensamiento. La delimitación terminológica de esta formulación se mantiene pendiente de contraste en una fuente primaria antes de validarse.",
    r: "",
  },
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_056": {
    destination: CLINICAL, oldC: "b", c: "b", topic: "Trastornos neurocognitivos", v: "CORREGIDA",
    e: "En el trastorno neurocognitivo mayor o leve con cuerpos de Lewy, ¿cuál es una característica diagnóstica esencial?",
    o: {
      a: "Déficit precoz y predominante de aprendizaje y memoria.",
      b: "Alucinaciones visuales recurrentes, bien formadas y detalladas.",
      c: "Parkinsonismo espontáneo que comienza antes del declive cognitivo.",
      d: "Ausencia de fluctuaciones de la atención y del estado de alerta.",
    },
    x: "Las características esenciales del TNC con cuerpos de Lewy incluyen la cognición fluctuante, las alucinaciones visuales recurrentes bien formadas y detalladas, y el parkinsonismo espontáneo cuyo inicio es posterior al declive cognitivo.",
    r: `${DSM} p. 699, criterios diagnósticos del TNC mayor o leve con cuerpos de Lewy.`,
  },
  SM_AGOSTO_1_SOL_1_089: {
    destination: CLINICAL, oldC: "d", c: "d", topic: "Trastornos destructivos, del control de los impulsos y de la conducta", v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál es una característica definitoria de la cleptomanía?",
    o: {
      a: "Robar únicamente objetos necesarios para el uso personal o por su valor monetario.",
      b: "Cometer el robo para expresar rabia o venganza.",
      c: "Explicarse mejor por un episodio maníaco o por un trastorno de conducta.",
      d: "Fracaso recurrente para resistir el impulso de robar objetos no necesarios para uso personal ni por su valor monetario.",
    },
    x: "La cleptomanía implica un fracaso recurrente para resistir el impulso de robar objetos que no se necesitan ni por uso personal ni por su valor. El robo no se comete por rabia o venganza y no se explica mejor por un episodio maníaco, un trastorno de conducta o un trastorno de la personalidad antisocial.",
    r: `${DSM} p. 539, criterios diagnósticos de cleptomanía.`,
  },
  SM_ENERO_1_SOL_1_189: {
    destination: CHILD, oldC: "b", c: "b", topic: "Trastornos relacionados con traumas y factores de estrés infantojuveniles", v: "CORREGIDA",
    e: "Sobre el trastorno de estrés postraumático en la infancia, señale la afirmación incorrecta:",
    o: {
      a: "Puede aparecer regresión del desarrollo, como pérdida del lenguaje en niños pequeños.",
      b: "Todos los niños manifiestan siempre reacciones de miedo durante la exposición o la reexperimentación.",
      c: "En niños mayores de seis años, el trauma puede representarse de modo repetitivo en el juego.",
      d: "Los niños pueden tener sueños aterradores sin contenido reconocible del acontecimiento traumático.",
    },
    x: "La afirmación b es incorrecta porque las reacciones de miedo no se presentan necesariamente en todos los niños. El DSM-5-TR contempla juego repetitivo relacionado con el trauma, sueños aterradores sin contenido reconocible y posibles regresiones del desarrollo.",
    r: `${DSM} pp. 301-302 y 308.`,
  },
  SM_JUNIO_2_SOL_1_042: {
    destination: CLINICAL, oldC: "a", c: "a", topic: "Trastornos disociativos", v: "REVISAR_FUENTE",
    e: "¿Qué modelo explicativo de los trastornos disociativos enfatiza los aspectos somáticos de la respuesta traumática y plantea que el intento de controlar la sensopercepción puede bloquearla?",
    o: {
      a: "Modelo SIBAM (Levine).",
      b: "Modelo 4D (Frewen y Lanius).",
      c: "Modelo de las estructuras paralelas diferentes (Sar, 2017).",
      d: "Modelo autohipnótico (Dell, 2018).",
    },
    x: "Se ha retirado la explicación incrustada en la alternativa d y se ha reubicado el ítem en trastornos disociativos. La descripción de los modelos se mantiene pendiente de contraste en una fuente primaria antes de validarse.",
    r: "",
  },
  SM_JUNIO_2_SOL_1_204: {
    destination: CLINICAL, oldC: "a", c: "a", topic: "Psicopatología de la conducta motora", v: "CORREGIDA",
    e: "¿Cuál es una característica de las mioclonías?",
    o: {
      a: "Son movimientos súbitos, con frecuencia no rítmicos, que no se pueden suprimir voluntariamente y carecen de impulso premonitorio.",
      b: "Son contracciones musculares sostenidas que producen posturas distorsionadas.",
      c: "Son movimientos rápidos, aleatorios e irregulares que pueden parecer expresivos.",
      d: "Son movimientos lentos, continuos y sinuosos, sin finalidad.",
    },
    x: "Las mioclonías se caracterizan por movimientos súbitos, a menudo no rítmicos, que se diferencian de los tics por su rapidez, por la imposibilidad de suprimirlos y por la ausencia de sensación o impulso premonitorio. Las otras alternativas describen distonía, corea y atetosis.",
    r: `${DSM} p. 97, diagnóstico diferencial de los trastornos de tics.`,
  },
  "Simu 15 comentado_062": {
    destination: CLINICAL, oldC: "c", c: "c", topic: "Trastorno obsesivo-compulsivo y relacionados", v: "CORREGIDA",
    e: "Según el DSM-5-TR, ¿cuál es una característica clínica de la tricotilomanía?",
    o: {
      a: "Se limita necesariamente al cuero cabelludo.",
      b: "No produce vergüenza ni deterioro social o laboral.",
      c: "La persona puede intentar ocultar o camuflar la pérdida de pelo.",
      d: "No puede coexistir con un trastorno depresivo mayor.",
    },
    x: "La tricotilomanía puede afectar a diversas regiones con pelo y las personas pueden ocultar o camuflar la pérdida. Puede causar vergüenza y deterioro funcional, y puede coexistir con otros trastornos, incluido el depresivo mayor.",
    r: `${DSM} pp. 281-283.`,
  },
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...clinical, ...child];
const idCounts = new Map();
for (const question of allBefore) idCounts.set(question.id, (idCounts.get(question.id) || 0) + 1);
if ([...idCounts.values()].some((count) => count !== 1)) throw new Error("Hay identificadores duplicados entre Clínica e Infantil.");
const missing = Object.keys(reviews).filter((id) => !idCounts.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const availableTopics = (subject) => new Set(manifest.subjects[subject].topics);
const apply = (question, review) => {
  if (question.c !== review.oldC) throw new Error(`La clave previa de ${question.id} no coincide con la auditoría.`);
  if (!availableTopics(review.destination).has(review.topic)) throw new Error(`El tema no existe: ${review.topic}`);
  const finalQuestion = {
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
    if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
  }
  if (!finalQuestion.x.trim()) throw new Error(`Falta justificación en ${question.id}`);
  if (review.v !== "REVISAR_FUENTE" && !finalQuestion.r.trim()) throw new Error(`Falta referencia primaria en ${question.id}`);
  return finalQuestion;
};

const finalClinical = clinical
  .filter((question) => reviews[question.id]?.destination !== CHILD)
  .map((question) => reviews[question.id] ? apply(question, reviews[question.id]) : question);
const movedToChild = clinical
  .filter((question) => reviews[question.id]?.destination === CHILD)
  .map((question) => apply(question, reviews[question.id]));
const finalChild = [...child, ...movedToChild];
const allAfter = [...finalClinical, ...finalChild];
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || afterIds.size !== allBefore.length) throw new Error("La auditoría alteraría el total o los identificadores.");

for (const [id, review] of Object.entries(reviews)) {
  const destination = review.destination === CHILD ? finalChild : finalClinical;
  const result = destination.find((question) => question.id === id);
  if (!result || result.s !== review.destination || result.t[0] !== review.topic || result.c !== review.c || result.v !== review.v) {
    throw new Error(`No se aplicó correctamente la revisión de ${id}.`);
  }
}

manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(clinicalPath, `${JSON.stringify(finalClinical)}\n`, "utf8");
fs.writeFileSync(childPath, `${JSON.stringify(finalChild)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicología Clínica 07 — conciencia, psicosis, neurocognitivos, impulsos y TEPT infantil",
  updated: Object.keys(reviews).length,
  primarySourceValidated: Object.values(reviews).filter((review) => review.v === "CORREGIDA").length,
  pendingPrimarySource: Object.values(reviews).filter((review) => review.v === "REVISAR_FUENTE").length,
  movedToChildPsychopathology: movedToChild.length,
  preservedQuestionIds: true,
}, null, 2));
