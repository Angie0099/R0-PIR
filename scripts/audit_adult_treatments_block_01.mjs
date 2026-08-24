import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const paths = {
  adult: path.join(bancoDir, "tratamientos_adultos.json"),
  childTreatments: path.join(bancoDir, "tratamientos_infantiles.json"),
  childPsychopathology: path.join(bancoDir, "psicopatologia_infantil.json"),
  clinical: path.join(bancoDir, "psicologia_clinica.json"),
  manifest: path.join(bancoDir, "manifest.json"),
};

const ADULT = "Tratamientos Adultos";
const CHILD_TREATMENTS = "Tratamientos Infantiles";
const CHILD_PSYCHOPATHOLOGY = "Psicopatología Infantil";
const CLINICAL = "Psicología Clínica";
const neurocognitiveSourceTopic = "Tratamiento de los trastornos neurocognitivos";
const communicationSourceTopic = "Tratamiento de los trastornos de la comunicación";
const pendingNote = "Pendiente de auditoría en su bloque temático. Se ha reubicado desde Tratamientos Adultos para evitar una clasificación incorrecta; el enunciado, la clave y la justificación no se han validado todavía.";

const o = (a, b, c, d) => ({ a, b, c, d });
const review = (sourceTopic, oldC, subject, topic, e, options, c, x, r) => ({ sourceTopic, oldC, subject, topic, e, o: options, c, x, r });

const reviews = {
  "DICIEMBRE-UNO-24_COMENTADO_078": review(neurocognitiveSourceTopic, "a", ADULT, neurocognitiveSourceTopic,
    "¿Qué estrategia cognitiva para personas con demencia ha mostrado resultados controvertidos por su limitada generalización a la vida cotidiana?",
    o("Entrenamiento cognitivo.", "Rehabilitación cognitiva.", "Estimulación cognitiva.", "Intervenciones multicomponente dirigidas a cuidadores."), "a",
    "La opción a es correcta. El entrenamiento cognitivo practica dominios concretos y la mejora suele circunscribirse a las tareas entrenadas; la rehabilitación es individual y funcional, y la estimulación es más global y grupal.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "JUNIO-UNO-24_COMENTADO_197": review(neurocognitiveSourceTopic, "b", ADULT, neurocognitiveSourceTopic,
    "¿Cuál de las siguientes afirmaciones es correcta sobre el tratamiento de los trastornos neurocognitivos?",
    o("Sigue exclusivamente una filosofía centrada en la persona cuidadora.", "Se centra exclusivamente en tratamiento farmacológico.", "Debe elaborarse un plan individualizado y adaptado a las características de cada paciente.", "Las intervenciones con cuidadores tienen escasa relevancia."), "c",
    "La opción c es correcta. El tratamiento debe ser combinado, centrado en la persona y personalizado; la atención a la persona cuidadora forma parte esencial de la intervención.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "OCTUBRE-UNO-24_COMENTADO_161": review(neurocognitiveSourceTopic, "c", ADULT, neurocognitiveSourceTopic,
    "En el tratamiento psicológico de las demencias, ¿qué característica corresponde al entrenamiento cognitivo?",
    o("Programas individualizados dirigidos a dificultades funcionales significativas para la persona.", "Actividades grupales y globales para personas con demencia leve o moderada.", "Práctica estructurada de dominios como atención, memoria o lenguaje, especialmente en fases iniciales.", "Mejorías que se generalizan ampliamente a la vida cotidiana."), "c",
    "La opción c es correcta. Los programas individualizados dirigidos a dificultades funcionales corresponden a la rehabilitación cognitiva, y las actividades grupales globales a la estimulación cognitiva. La generalización del entrenamiento cognitivo a la vida cotidiana es limitada.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_128": review(neurocognitiveSourceTopic, "b", ADULT, neurocognitiveSourceTopic,
    "Entre las estrategias psicológicas centradas en la cognición para las demencias, ¿qué define la rehabilitación cognitiva?",
    o("Actividades grupales y globales para demencia leve o moderada.", "Programas individualizados, en fases leves, dirigidos a problemas cotidianos relevantes para la persona.", "Entrenamiento de dominios cognitivos específicos.", "Una mejoría que se generaliza ampliamente a toda actividad cotidiana."), "b",
    "La opción b es correcta. La rehabilitación cognitiva se diseña según metas funcionales significativas para la persona; no equivale al entrenamiento por dominios ni a la estimulación global.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "SM_JULIO_2_SOL_1_049": review(neurocognitiveSourceTopic, "c", ADULT, neurocognitiveSourceTopic,
    "En las demencias, ¿en qué consiste el entrenamiento cognitivo?",
    o("En planes individuales centrados en problemas funcionales relevantes.", "En actividades globales y grupales de estimulación.", "En practicar de forma estructurada dominios específicos —por ejemplo, atención, memoria o lenguaje—, sobre todo en fases iniciales.", "En entrenar exclusivamente tareas complejas en fases avanzadas."), "c",
    "La opción c es correcta. El entrenamiento cognitivo practica dominios concretos; se diferencia de la rehabilitación cognitiva, que es individual y funcional, y de la estimulación cognitiva, que es global y grupal.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "SmCm17PIR2025_173": review(neurocognitiveSourceTopic, "d", ADULT, "Tratamiento de los trastornos somáticos",
    "Respecto al tratamiento de los trastornos facticios, señale la opción INCORRECTA.",
    o("Puede emplearse una confrontación directa, firme y no punitiva de la producción intencional de síntomas.", "En el enfoque no confrontativo pueden utilizarse explicaciones no agresivas o interpretaciones inexactas.", "El doble cebo es una estrategia no confrontativa que vincula la mejoría al seguimiento del tratamiento.", "La evidencia demuestra una superioridad clara y consistente de las estrategias confrontativas frente a las no confrontativas."), "d",
    "La opción d es incorrecta. Se describen estrategias confrontativas y no confrontativas, pero no se ha demostrado una superioridad consistente de unas sobre otras.",
    "Caballo, V. E., Salazar, I. C. y Carrobles, J. A. I. (2011). Manual de psicopatología y trastornos psicológicos. Pirámide. p. 489; Eastwood, S. y Bisson, J. I. (2008)."),
  "SmCm1PIR2024_147": review(neurocognitiveSourceTopic, "c", ADULT, "Componentes y eficacia de la psicoterapia",
    "¿Cómo denomina Clara Hill (2017) la manifestación de los niveles más altos de habilidad, destreza, competencia profesional y efectividad del terapeuta?",
    o("Práctica deliberada.", "Práctica reflexiva.", "Pericia clínica.", "Rendimiento terapéutico."), "c",
    "La opción c es correcta. La pericia clínica alude al grado más alto de competencia y efectividad profesional, no a una técnica aislada de aprendizaje.",
    "Hill, C. E. (2017). Helping Skills: Facilitating Exploration, Insight, and Action (5.ª ed.). American Psychological Association; Penadés, R., López-Santiago, J. y Belloch, A. (2024). Manual de tratamientos en psicología clínica. McGraw-Hill. cap. 2, pp. 18-19."),
  "SmCm21PIR2025 (2)_057": review(neurocognitiveSourceTopic, "d", ADULT, "Tratamiento de los trastornos somáticos",
    "Sobre el tratamiento de los trastornos facticios, señale la opción INCORRECTA.",
    o("No existe un tratamiento bien establecido.", "Se describen estrategias confrontativas y no confrontativas.", "La psicoterapia individual o grupal puede integrarse dentro de una estrategia confrontativa.", "La técnica del doble cebo es confrontativa."), "d",
    "La opción d es incorrecta. El doble cebo se clasifica entre las aproximaciones no confrontativas.",
    "Caballo, V. E., Salazar, I. C. y Carrobles, J. A. I. (2011). Manual de psicopatología y trastornos psicológicos. Pirámide. p. 489."),
  "SmCm29PIR2025_180": review(neurocognitiveSourceTopic, "a", ADULT, "Tratamiento de los trastornos somáticos",
    "¿Qué dos tipos generales de estrategias se describen para el tratamiento de los trastornos facticios?",
    o("Confrontativas y no confrontativas.", "Internas y externas.", "Individuales y familiares.", "Psicoeducativas y experienciales."), "a",
    "La opción a es correcta. La clasificación clínica habitual contrapone estrategias confrontativas y no confrontativas.",
    "Caballo, V. E., Salazar, I. C. y Carrobles, J. A. I. (2011). Manual de psicopatología y trastornos psicológicos. Pirámide. p. 489."),
  "Simu 16 comentado_185": review(neurocognitiveSourceTopic, "a", ADULT, neurocognitiveSourceTopic,
    "¿Cuál de las siguientes opciones describe correctamente la estimulación cognitiva en personas con demencia?",
    o("Se realiza habitualmente en grupo, con actividades generales, y está indicada sobre todo en demencia leve o moderada.", "Es un programa individualizado dirigido exclusivamente a problemas funcionales cotidianos.", "Consiste en entrenar de forma aislada dominios cognitivos específicos.", "Ha demostrado una generalización amplia y consistente a cualquier situación cotidiana."), "a",
    "La opción a es correcta. La estimulación cognitiva es global y grupal; la rehabilitación cognitiva es individual y funcional, y el entrenamiento cognitivo se centra en dominios específicos con una generalización limitada.",
    "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill. p. 614."),
  "Simu 12 comentado_194": review(communicationSourceTopic, "d", ADULT, "Tratamiento de la psicosis y esquizofrenia",
    "La aplicación de la Terapia Psicológica Integrada, IPT, de Brenner para la esquizofrenia produce mejorías en:",
    o("Funciones neurocognitivas.", "Funciones sociales.", "Funciones instrumentales.", "Tanto funciones neurocognitivas como sociales."), "d",
    "La opción d es correcta. La IPT integra remediación neurocognitiva, cognición social, habilidades sociales y solución de problemas; sus resultados abarcan ambos dominios y el funcionamiento psicosocial.",
    "Roder, V., Mueller, D. R. y Schmidt, S. J. (2011). «Effectiveness of Integrated Psychological Therapy, IPT, for schizophrenia». Schizophrenia Bulletin, 37(Suppl. 2), S71-S79, pp. S73-S75; Brenner, H. D. et al. (1994). Integrated Psychological Therapy for Schizophrenic Patients."),
  "Simu 14 comentado _005": review(communicationSourceTopic, "c", ADULT, "Tratamiento de la psicosis y esquizofrenia",
    "¿Qué componente caracteriza la terapia cognitivo-conductual de Kingdon y Turkington para la psicosis?",
    o("Vincular necesariamente el abandono de medicación con la recaída.", "Predecir de forma sistemática los incumplimientos terapéuticos.", "Ofrecer una explicación normalizadora de los síntomas psicóticos.", "Limitarse a la prevención de recaídas a largo plazo."), "c",
    "La opción c es correcta. Esta terapia cognitivo-conductual incorpora una explicación normalizadora y desestigmatizadora de la experiencia psicótica.",
    "Kingdon, D. G. y Turkington, D. (1991). «The use of cognitive therapy with a normalizing rationale in schizophrenia». Journal of Nervous and Mental Disease, 179(4), 207-211. p. 207. https://doi.org/10.1097/00005053-199104000-00005."),
  "SmCm10PIR2025_001": review(communicationSourceTopic, "b", ADULT, "Tratamiento de los trastornos disociativos",
    "Señale la opción INCORRECTA sobre las recomendaciones generales para el tratamiento de los trastornos disociativos complejos.",
    o("Se recomiendan enfoques terapéuticos integradores.", "Es preferible que las sesiones grupales breves o moderadas constituyan el tratamiento principal.", "Son tratamientos que con frecuencia duran años.", "Las sesiones no deben espaciarse excesivamente."), "b",
    "La opción b es incorrecta. La psicoterapia ambulatoria individual es la modalidad principal; los grupos breves y estructurados pueden ser complementarios, no el tratamiento primario. Habitualmente se requiere un tratamiento a largo plazo y al menos una sesión semanal.",
    "International Society for the Study of Trauma and Dissociation. (2011). «Guidelines for Treating Dissociative Identity Disorder in Adults, Third Revision». Journal of Trauma & Dissociation, 12(2), 115-187. Treatment Modalities, pp. 143-145."),
  "SmCm14PIR2025_149": review(communicationSourceTopic, "c", CLINICAL, "Trastornos de la personalidad",
    "¿A qué autor se atribuye el término organización límite, borderline, de la personalidad?",
    o("Linehan.", "Fonagy.", "Kernberg.", "Turner."), "c",
    "La opción c es correcta. Kernberg formuló y sistematizó el concepto de organización borderline como nivel estructural de la personalidad.",
    "Kernberg, O. F. (1975). Borderline Conditions and Pathological Narcissism. Jason Aronson. cap. 1, p. 4."),
  "SmCm22PIR2025_171": review(communicationSourceTopic, "a", ADULT, "Tratamiento de los trastornos del sueño",
    "Respecto al tratamiento psicológico del insomnio, señale la opción INCORRECTA.",
    o("El control de estímulos recomienda permanecer despierto en la cama hasta que transcurran 40 minutos y establecer rutinas presueño.", "La higiene del sueño incluye limitar cafeína, nicotina y alcohol, regular ejercicio, comidas, siestas y condiciones ambientales.", "El control de estímulos y la restricción del sueño son intervenciones eficaces, también en personas mayores.", "La higiene del sueño aislada tiene eficacia limitada y obtiene mejores resultados integrada en terapia cognitivo-conductual para el insomnio."), "a",
    "La opción a es incorrecta. El control de estímulos prescribe ir a la cama solo con sueño, levantarse cuando no se puede dormir, usar la cama solo para dormir o actividad sexual, mantener horario estable y evitar siestas; no consiste en esperar 40 minutos ni en rutinas de higiene.",
    "Edinger, J. D. et al. (2021). «Behavioral and Psychological Treatments for Chronic Insomnia Disorder in Adults». Journal of Clinical Sleep Medicine, 17(2), 255-262. p. 258."),
  "SmCm22PIR2025_172": review(communicationSourceTopic, "d", ADULT, "Técnicas psicológicas generales",
    "¿Cuál de los siguientes NO forma parte de los componentes clásicos de la inversión o reversión del hábito?",
    o("Entrenamiento en conciencia.", "Entrenamiento motivacional.", "Entrenamiento en generalización.", "Reforzamiento positivo."), "d",
    "La opción d es correcta. Los componentes clásicos son conciencia, respuesta competitiva, motivación y generalización; el refuerzo social puede apoyar la aplicación, pero no es uno de los cuatro componentes nombrados.",
    "Azrin, N. H. y Nunn, R. G. (1973). «Habit-reversal: A method of eliminating nervous habits and tics». Behaviour Research and Therapy, 11(4), 619-628. pp. 620-622."),
  "SmCm29PIR2025_183": review(communicationSourceTopic, "b", ADULT, "Técnicas psicológicas generales",
    "En la inversión o reversión del hábito, ¿en qué fase se entrena una conducta incompatible que sustituye la conducta problema?",
    o("Conciencia.", "Respuesta competitiva.", "Motivación.", "La conducta problema no debe sustituirse, sino extinguirse."), "b",
    "La opción b es correcta. La respuesta competitiva es una conducta físicamente incompatible, practicada ante el impulso o señal temprana.",
    "Azrin, N. H. y Nunn, R. G. (1973). «Habit-reversal: A method of eliminating nervous habits and tics». Behaviour Research and Therapy, 11(4), 619-628. pp. 620-622."),
  "SmCm4PIR2024_040": review(communicationSourceTopic, "b", ADULT, "Técnicas psicológicas generales",
    "¿Qué intervención conductual cuenta con apoyo empírico y forma parte de la Intervención Conductual Integral para Tics, CBIT?",
    o("Práctica masiva.", "Entrenamiento en inversión o reversión del hábito.", "Control de estímulos.", "Práctica reforzada."), "b",
    "La opción b es correcta. El entrenamiento en inversión o reversión del hábito es un componente central de CBIT. Esta formulación evita afirmar que dicho entrenamiento aislado sea universalmente el tratamiento de elección.",
    "Azrin, N. H. y Nunn, R. G. (1973). «Habit-reversal: A method of eliminating nervous habits and tics». Behaviour Research and Therapy, 11(4), 619-628; Pringsheim, T. et al. (2019). «Practice guideline recommendations summary: Treatment of tics». Neurology, 92, 896-906."),
};

const pendingMoves = {
  "SmCm21PIR2025 (2)_155": [CHILD_TREATMENTS, "Introducción a la psicología clínica infantil"],
  "SmCm29PIR2025_184": [CHILD_TREATMENTS, "Trastornos de conducta infantojuvenil"],
  "SmCm10PIR2025_099": [CHILD_TREATMENTS, "Trastorno del Espectro Autista"],
  "SmCm14PIR2025_152": [CHILD_TREATMENTS, "Introducción a la psicología clínica infantil"],
  "SmCm19PIR2024_168": [CHILD_TREATMENTS, "TDAH"],
  "SmCm1PIR2024_185": [CHILD_TREATMENTS, "Trastornos relacionados con trauma infantojuvenil"],
  "SmCm1PIR2024_187": [CHILD_TREATMENTS, "Trastornos de la comunicación"],
  "SmCm5PIR2024_069": [CHILD_PSYCHOPATHOLOGY, "Trastornos de ansiedad infantojuveniles"],
  "SmCm5PIR2024_070": [CHILD_TREATMENTS, "Trastornos relacionados con trauma infantojuvenil"],
};

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const adult = read(paths.adult);
const childTreatments = read(paths.childTreatments);
const childPsychopathology = read(paths.childPsychopathology);
const clinical = read(paths.clinical);
const manifest = read(paths.manifest);
const sourceIds = [...Object.keys(reviews), ...Object.keys(pendingMoves)];
const sourceById = new Map(adult.map((question) => [question.id, question]));
const missing = sourceIds.filter((id) => !sourceById.has(id));
if (missing.length) throw new Error("No se encontraron preguntas de origen: " + missing.join(", "));

for (const [topic, expected] of [[neurocognitiveSourceTopic, 12], [communicationSourceTopic, 15]]) {
  const found = adult.filter((question) => question.t?.[0] === topic).map((question) => question.id).sort();
  const expectedIds = sourceIds.filter((id) => sourceById.get(id).t?.[0] === topic).sort();
  if (found.length !== expected || found.join("|") !== expectedIds.join("|")) {
    throw new Error("El tema de origen no coincide con el bloque auditado: " + topic);
  }
}

const makeReviewed = (question, item) => {
  if (question.s !== ADULT || question.t?.[0] !== item.sourceTopic) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== item.oldC) throw new Error("La clave previa no coincide en " + question.id);
  const result = { ...question, s: item.subject, t: [item.topic], e: item.e, o: item.o, c: item.c, x: item.x, r: item.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  if (!String(result.x).trim() || !String(result.r).trim()) throw new Error("Falta justificación o referencia en " + question.id);
  return result;
};

const makePending = (question, subject, topic) => {
  if (question.s !== ADULT) throw new Error("Asignatura de origen inesperada en " + question.id);
  return { ...question, s: subject, t: [topic], x: pendingNote, r: "", v: "REVISAR" };
};

const moved = new Map();
for (const [id, item] of Object.entries(reviews)) moved.set(id, makeReviewed(sourceById.get(id), item));
for (const [id, [subject, topic]] of Object.entries(pendingMoves)) moved.set(id, makePending(sourceById.get(id), subject, topic));
if (moved.size !== 27) throw new Error("El tamaño del lote no coincide.");

const finalAdult = [];
for (const question of adult) {
  const replacement = moved.get(question.id);
  if (!replacement) finalAdult.push(question);
  else if (replacement.s === ADULT) finalAdult.push(replacement);
}
const finalChildTreatments = [...childTreatments];
const finalChildPsychopathology = [...childPsychopathology];
const finalClinical = [...clinical];
const destinations = new Map([
  [CHILD_TREATMENTS, finalChildTreatments],
  [CHILD_PSYCHOPATHOLOGY, finalChildPsychopathology],
  [CLINICAL, finalClinical],
  [ADULT, finalAdult],
]);
const existingDestinationIds = new Set([...childTreatments, ...childPsychopathology, ...clinical].map((question) => question.id));
const collisions = sourceIds.filter((id) => existingDestinationIds.has(id));
if (collisions.length) throw new Error("ID ya existente en destino: " + collisions.join(", "));
for (const question of moved.values()) if (question.s !== ADULT) destinations.get(question.s).push(question);

const finals = {
  "tratamientos_adultos.json": finalAdult,
  "tratamientos_infantiles.json": finalChildTreatments,
  "psicopatologia_infantil.json": finalChildPsychopathology,
  "psicologia_clinica.json": finalClinical,
};
const allFiles = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = allFiles.flatMap((file) => finals[file] ?? read(path.join(bancoDir, file)));
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== manifest.total || idsAfter.size !== allAfter.length) throw new Error("La auditoría alteraría el total de preguntas o sus identificadores.");
if (sourceIds.some((id) => !idsAfter.has(id))) throw new Error("Falta una pregunta del lote después de la reubicación.");
if (finalAdult.some((question) => question.t?.[0] === communicationSourceTopic)) throw new Error("El tema de comunicación adulta no quedó vacío.");
const reviewedAdultSource = finalAdult.filter((question) => question.t?.[0] === neurocognitiveSourceTopic);
if (reviewedAdultSource.length !== 6 || reviewedAdultSource.some((question) => question.v !== "CORREGIDA" || !question.x || !question.r)) {
  throw new Error("El tema neurocognitivo no quedó completamente auditado.");
}
for (const id of Object.keys(pendingMoves)) {
  const question = allAfter.find((item) => item.id === id);
  if (question.v !== "REVISAR" || question.x !== pendingNote || question.r !== "") throw new Error("La pregunta pendiente no quedó marcada correctamente: " + id);
}

const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) details.count = counts.get(subject) || 0;
manifest.total = allAfter.length;
const adultTopics = manifest.subjects[ADULT].topics;
manifest.subjects[ADULT].topics = adultTopics.filter((topic) => topic !== communicationSourceTopic);
for (const question of moved.values()) {
  if (!manifest.subjects[question.s].topics.includes(question.t[0])) throw new Error("Tema de destino ausente: " + question.id + " → " + question.s + " / " + question.t[0]);
}
const expectedCounts = new Map([[ADULT, 4174], [CHILD_TREATMENTS, 145], [CHILD_PSYCHOPATHOLOGY, 181], [CLINICAL, 4172]]);
for (const [subject, expected] of expectedCounts) if (manifest.subjects[subject].count !== expected) throw new Error("Recuento inesperado para " + subject + ": " + manifest.subjects[subject].count);

for (const [file, data] of Object.entries(finals)) fs.writeFileSync(path.join(bancoDir, file), JSON.stringify(data) + "\n", "utf8");
fs.writeFileSync(paths.manifest, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos Adultos 01 — neurocognitivos y comunicación",
  corrected: Object.keys(reviews).length,
  pendingOutsideScope: Object.keys(pendingMoves).length,
  adultRetained: finalAdult.length,
  total: allAfter.length,
  counts: Object.fromEntries(expectedCounts),
  preservedQuestionIds: true,
}, null, 2));
