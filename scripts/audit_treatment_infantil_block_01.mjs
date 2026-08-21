import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const infantPath = path.join(bancoDir, "tratamientos_infantiles.json");
const adultPath = path.join(bancoDir, "tratamientos_adultos.json");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const INFANT = "Tratamientos Infantiles";
const ADULT = "Tratamientos Adultos";
const CLINICAL = "Psicología Clínica";

const sources = {
  action: "Stark, K. D., Streusand, W., Arora, P. y Patel, P. (2011). Childhood depression: The ACTION treatment program. En J. R. Weisz y A. E. Kazdin (eds.), Evidence-Based Psychotherapies for Children and Adolescents (2.ª ed., pp. 190-233). Guilford Press.",
  meichenbaum: "Meichenbaum, D. y Goodman, J. (1971). Training impulsive children to talk to themselves: A means of developing self-control. Journal of Abnormal Psychology, 77(2), 115-126.",
  barkley: "Barkley, R. A. (2013). Defiant Children: A Clinician’s Manual for Assessment and Parent Training (3.ª ed.). Guilford Press.",
  iccs: "Nevéus, T., Fonseca, E., Franco, I. et al. (2020). Management and treatment of nocturnal enuresis—an updated standardization document from the International Children’s Continence Society. Journal of Pediatric Urology, 16(1), 10-19.",
  kendall: "Kendall, P. C. (1994). Treating anxiety disorders in children: Results of a randomized clinical trial. Journal of Consulting and Clinical Psychology, 62, 100-110; Kendall, P. C. y Hedtke, K. A. (2006). Coping Cat Workbook (2.ª ed.). Workbook Publishing.",
  tabbers: "Tabbers, M. M., DiLorenzo, C., Berger, M. Y. et al. (2014). Evaluation and treatment of functional constipation in infants and children: Evidence-based recommendations from ESPGHAN and NASPGHAN. Journal of Pediatric Gastroenterology and Nutrition, 58, 258-274.",
  bandura: "Bandura, A., Grusec, J. E. y Menlove, F. L. (1967). Vicarious extinction of avoidance behavior. Journal of Personality and Social Psychology, 5, 16-23.",
  tokens: "Kazdin, A. E. y Bootzin, R. R. (1972). The token economy: An evaluative review. Journal of Applied Behavior Analysis, 5, 343-372.",
  mowrer: "Mowrer, O. H. y Mowrer, W. M. (1938). Enuresis: A method for its study and treatment. American Journal of Orthopsychiatry, 8, 436-459; Nevéus et al. (2020).",
  cost: "Kazdin, A. E. (1972). Response cost: The removal of conditioned reinforcers for therapeutic change. Behavior Therapy, 3(4), 533-546.",
  cie: "Organización Mundial de la Salud (2022). CIE-11 para las estadísticas de mortalidad y morbilidad, bloque 6B40-6B43; Maercker, A. et al. (2013). Diagnosis and classification of disorders specifically associated with stress: Proposals for ICD-11. World Psychiatry, 12, 198-206.",
  dsm: "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana, pp. 313-317.",
  stimulation: "Spector, A., Thorgrimsen, L., Woods, B. et al. (2003). Efficacy of an evidence-based cognitive stimulation therapy programme for people with dementia: Randomised controlled trial. British Journal of Psychiatry, 183, 248-254.",
};

// Ítems que permanecen en Tratamientos Infantiles. Los duplicados se
// mantienen: se añade su revisión independiente, nunca se borra el registro.
const infantReviews = {
  SIM_ABR25_060: {
    topic: "Trastornos depresivos y bipolares infantojuvenil", c: "a", v: "VALIDADA_ORIGINAL",
    x: "ACTION es un programa cognitivo-conductual diseñado para el tratamiento de la depresión infantil y adolescente.", r: sources.action,
  },
  SIM_ABR25_145: {
    topic: "Trastornos de conducta infantojuvenil", c: "a", v: "VALIDADA_ORIGINAL",
    x: "En el entrenamiento en autoinstrucciones, el primer paso es el modelado cognitivo: el adulto realiza la tarea verbalizando las instrucciones que guían su conducta.", r: sources.meichenbaum,
  },
  SIM_PERS_AGO25_024: {
    topic: "Trastornos de conducta infantojuvenil", c: "c", v: "VALIDADA_ORIGINAL",
    x: "En el programa de Barkley se introduce primero la atención positiva o tiempo especial para mejorar la relación paternofilial, antes de las fichas, el coste de respuesta o el tiempo fuera.", r: sources.barkley,
  },
  SIM_PERS_AGO25_033: {
    topic: "Trastornos de excreción infantojuvenil", c: "c", v: "CORREGIDA",
    e: "En la enuresis nocturna monosintomática, ¿qué tratamiento suele asociarse a menor recaída a largo plazo cuando el niño y la familia pueden implicarse de forma continuada?",
    x: "La alarma y la desmopresina son tratamientos de primera línea. Cuando la familia puede mantener la implicación necesaria, la alarma se asocia a mejor mantenimiento y a menos recaídas a largo plazo.", r: sources.iccs,
  },
  SIM_PERS_AGO25_054: {
    topic: "Trastornos de ansiedad infantojuvenil", c: "c", v: "VALIDADA_ORIGINAL",
    x: "Coping Cat es una TCC manualizada de 16 sesiones para ansiedad generalizada, ansiedad de separación y ansiedad social en niños.", r: sources.kendall,
  },
  SIM_PERS_AGO25_065: {
    topic: "Trastornos de excreción infantojuvenil", c: "b", v: "CORREGIDA",
    e: "En la encopresis asociada a retención fecal, ¿qué condición debe identificarse y tratarse antes de instaurar el plan conductual?",
    o: { c: "Las alergias alimentarias." },
    x: "En la encopresis retentiva, la impactación y el estreñimiento deben tratarse antes de instaurar el plan conductual. No toda incontinencia fecal infantil es retentiva; por eso el enunciado se ha acotado.", r: sources.tabbers,
  },
  SIM_PERS_AGO25_085: {
    topic: "Trastornos de ansiedad infantojuvenil", c: "b", v: "VALIDADA_ORIGINAL",
    x: "El modelado participante combina observar a un modelo que se aproxima sin miedo y practicar una exposición gradual guiada hacia el estímulo temido.", r: sources.bandura,
  },
  SIM_PERS_AGO25_094: {
    topic: "Trastornos de conducta infantojuvenil", c: "b", v: "VALIDADA_ORIGINAL",
    x: "Las fichas adquieren valor por su asociación con distintos reforzadores de respaldo; por ello funcionan como reforzadores condicionados generalizados.", r: sources.tokens,
  },
  SIM_PERS_AGO25_114: {
    topic: "Trastornos de conducta infantojuvenil", c: "c", v: "VALIDADA_ORIGINAL",
    x: "El tiempo fuera retira de forma contingente el acceso a estimulación reforzante; es un procedimiento de castigo negativo.", r: sources.barkley,
  },
  SIM_PERS_AGO25_124: {
    topic: "Trastornos de excreción infantojuvenil", c: "b", v: "CORREGIDA",
    e: "En la explicación basada en condicionamiento clásico del método de alarma para la enuresis, ¿qué asociación permite que la sensación de vejiga llena llegue a provocar el despertar?",
    o: { b: "La asociación repetida entre la distensión vesical, la alarma y el despertar." },
    x: "Con la repetición, se establece una asociación entre la distensión vesical, la señal de alarma y el despertar. La meta clínica es aprender a despertar ante la vejiga llena, no afirmar que necesariamente se retenga la orina toda la noche.", r: sources.mowrer,
  },
  SIM_PERS_AGO25_134: {
    topic: "Trastornos de conducta infantojuvenil", c: "b", v: "VALIDADA_ORIGINAL",
    x: "El coste de respuesta retira reforzadores condicionados ya obtenidos de forma contingente a una conducta inadecuada.", r: sources.cost,
  },
  SmCm16PIR2025_196: {
    topic: "Introducción a la psicología clínica infantil", c: "b", v: "REVISAR_FUENTE",
    o: { a: "Es necesario evaluar la conducta de los menores en relación con criterios evolutivos, pero centrándose sobre todo en la conducta encubierta." },
  },
};

const moves = {
  "Simu 12 comentado_084": {
    destination: CLINICAL, topic: "Sistemas clasificatorios en psicopatología", oldC: "c", c: "d", v: "CORREGIDA",
    e: "¿Cuál de las siguientes opciones refleja una actualización introducida en la CIE-11 respecto a los trastornos relacionados con traumas y factores de estrés?",
    o: { d: "Se reconoce por primera vez el trastorno de estrés postraumático complejo como diagnóstico diferenciado del TEPT." },
    x: "La CIE-11 introduce el trastorno de estrés postraumático complejo y la reacción aguda al estrés deja de clasificarse como trastorno mental. Además, no mantiene los subtipos previos del trastorno de adaptación.", r: sources.cie,
  },
  "Simu 12 comentado_085": {
    destination: CLINICAL, topic: "Trastornos relacionados con traumas y factores de estrés", oldC: "d", c: "d", v: "CORREGIDA",
    e: "Respecto al trastorno de estrés agudo, señale la afirmación correcta:",
    o: { a: "Se puede diagnosticar desde el primer día tras el suceso traumático, siempre que los síntomas sean intensos." },
    x: "El trastorno de estrés agudo requiere una duración de entre 3 días y 1 mes. Aproximadamente la mitad de las personas que desarrollan TEPT cumplieron inicialmente criterios de trastorno de estrés agudo.", r: sources.dsm,
  },
  "Simu 16 comentado_185": {
    destination: ADULT, topic: "Tratamiento de los trastornos neurocognitivos", oldC: "a", c: "a", v: "CORREGIDA",
    e: "¿Qué intervención implica participar habitualmente en grupo en actividades y conversaciones orientadas a mejorar globalmente el funcionamiento cognitivo y social en demencia leve o moderada?",
    o: { a: "Estimulación cognitiva.", b: "Entrenamiento cognitivo.", c: "Rehabilitación cognitiva.", d: "Intervención ambiental." },
    x: "La estimulación cognitiva trabaja globalmente la cognición y la función social mediante actividades y conversaciones, con frecuencia grupales. El entrenamiento cognitivo se centra en dominios concretos.", r: sources.stimulation,
  },
};

const infant = JSON.parse(fs.readFileSync(infantPath, "utf8"));
const adult = JSON.parse(fs.readFileSync(adultPath, "utf8"));
const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...infant, ...adult, ...clinical];
const countsBefore = new Map();
for (const question of allBefore) countsBefore.set(question.id, (countsBefore.get(question.id) || 0) + 1);
if ([...countsBefore.values()].some((count) => count !== 1)) throw new Error("Hay IDs duplicados entre los bancos afectados.");

const needed = [...Object.keys(infantReviews), ...Object.keys(moves)];
const missing = needed.filter((id) => !countsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const topicsFor = (subject) => new Set(manifest.subjects[subject].topics);
const apply = (question, review, subject) => {
  if (!topicsFor(subject).has(review.topic)) throw new Error(`El tema no existe en ${subject}: ${review.topic}`);
  const expected = review.oldC || review.c;
  if (question.c !== expected) throw new Error(`La clave original de ${question.id} no coincide con la revisión.`);
  const finalQuestion = {
    ...question,
    s: subject,
    t: [review.topic],
    e: review.e || question.e,
    o: review.o ? { ...question.o, ...review.o } : question.o,
    c: review.c,
    v: review.v,
  };
  if (review.x) finalQuestion.x = review.x;
  if (review.r) finalQuestion.r = review.r;
  for (const key of ["a", "b", "c", "d"]) if (!String(finalQuestion.o?.[key] || "").trim()) throw new Error(`Opción vacía en ${question.id}: ${key}`);
  if (/^(VALIDADA_(ORIGINAL|DRIVE)|CORREGIDA)$/.test(finalQuestion.v || "") && (!finalQuestion.x || !finalQuestion.r)) {
    throw new Error(`Falta justificación o referencia en ${question.id}`);
  }
  return finalQuestion;
};

const finalInfant = infant
  .filter((question) => !Object.hasOwn(moves, question.id))
  .map((question) => Object.hasOwn(infantReviews, question.id) ? apply(question, infantReviews[question.id], INFANT) : question);
const moved = infant.filter((question) => Object.hasOwn(moves, question.id));
const movedToClinical = moved.filter((question) => moves[question.id].destination === CLINICAL).map((question) => apply(question, moves[question.id], CLINICAL));
const movedToAdult = moved.filter((question) => moves[question.id].destination === ADULT).map((question) => apply(question, moves[question.id], ADULT));
const finalClinical = [...clinical, ...movedToClinical];
const finalAdult = [...adult, ...movedToAdult];

const allAfter = [...finalInfant, ...finalAdult, ...finalClinical];
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length) throw new Error("La auditoría alteraría el total o los IDs.");
for (const [id, review] of Object.entries(infantReviews)) {
  const question = finalInfant.find((candidate) => candidate.id === id);
  if (!question || question.s !== INFANT || question.t[0] !== review.topic) throw new Error(`No se aplicó la revisión de ${id}.`);
}
for (const [id, review] of Object.entries(moves)) {
  const questions = review.destination === CLINICAL ? finalClinical : finalAdult;
  const question = questions.find((candidate) => candidate.id === id);
  if (!question || question.s !== review.destination || question.t[0] !== review.topic || question.c !== review.c) throw new Error(`No se aplicó el traslado de ${id}.`);
}

manifest.subjects[INFANT].count = finalInfant.length;
manifest.subjects[ADULT].count = finalAdult.length;
manifest.subjects[CLINICAL].count = finalClinical.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(infantPath, `${JSON.stringify(finalInfant)}\n`, "utf8");
fs.writeFileSync(adultPath, `${JSON.stringify(finalAdult)}\n`, "utf8");
fs.writeFileSync(clinicalPath, `${JSON.stringify(finalClinical)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Tratamientos Infantiles 01 — protocolos, eliminación y reubicaciones",
  reviewedInInfant: Object.keys(infantReviews).length - 1,
  movedToClinical: movedToClinical.length,
  movedToAdult: movedToAdult.length,
  deferredInIntroduction: 1,
  preservedQuestionIds: true,
}, null, 2));
