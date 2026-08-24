import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const paths = {
  treatments: path.join(bancoDir, "tratamientos_infantiles.json"),
  child: path.join(bancoDir, "psicopatologia_infantil.json"),
  adult: path.join(bancoDir, "tratamientos_adultos.json"),
  psychotherapies: path.join(bancoDir, "psicoterapias.json"),
  developmental: path.join(bancoDir, "psicologia_evolutiva.json"),
  evaluation: path.join(bancoDir, "evaluacion_psicologica.json"),
  manifest: path.join(bancoDir, "manifest.json"),
};

const CHILD_TREATMENTS = "Tratamientos Infantiles";
const CHILD_PSYCHOPATHOLOGY = "Psicopatología Infantil";
const ADULT_TREATMENTS = "Tratamientos Adultos";
const PSYCHOTHERAPIES = "Psicoterapias";
const DEVELOPMENTAL = "Psicología Evolutiva";
const EVALUATION = "Evaluación Psicológica";

const depressionSourceTopic = "Trastornos depresivos y bipolares infantojuvenil";
const conductSourceTopic = "Trastornos de conducta infantojuvenil";
const childDepressionTopic = "Trastornos depresivos y bipolares infantojuveniles";
const childDisruptiveTopic = "Trastornos disruptivos, del control de los impulsos y de la conducta infantojuveniles";
const childAdhdTopic = "Trastorno por déficit de atención con hiperactividad (TDAH)";
const childAutismTopic = "Trastorno del espectro autista";
const childLearningTopic = "Trastornos específicos del aprendizaje y de la coordinación";
const childSelfHarmTopic = "Conducta suicida y autolesión infantojuvenil";
const childTraumaTreatmentTopic = "Trastornos relacionados con trauma infantojuvenil";
const adultNeurocognitiveTreatmentTopic = "Tratamiento de los trastornos neurocognitivos";
const systemicTopic = "Terapias de familia y modelos sistémicos";
const adolescenceTopic = "La adolescencia";
const neuropsychologicalEvaluationTopic = "Evaluación neuropsicológica";
const reviewedStatuses = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const CHILD_THERAPY = "Comeche Moreno, M.ª I. y Vallejo Pareja, M. A. (eds.). (2016). Manual de terapia de conducta en la infancia (3.ª ed.). Dykinson.";
const BELLOCH_II = "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";

const reviews = {
  SIM_ABR25_060: {
    sourceTopic: depressionSourceTopic,
    oldC: "a",
    subject: CHILD_TREATMENTS,
    topic: depressionSourceTopic,
    e: "El programa ACTION de Stark se desarrolló específicamente para el tratamiento de:",
    o: {
      a: "La depresión infantil.",
      b: "El trastorno por déficit de atención con hiperactividad.",
      c: "El trastorno negativista desafiante.",
      d: "La fobia escolar.",
    },
    c: "a",
    x: "La opción a es correcta. ACTION fue desarrollado específicamente para la depresión infantil; es un programa multicomponente y grupal dirigido a niños y niñas de 8 a 13 años.",
    r: CHILD_THERAPY + " Programa ACTION de Stark para depresión infantil, p. 248.",
  },
  SIM_PERS_AGO25_044: {
    sourceTopic: depressionSourceTopic,
    oldC: "a",
    subject: CHILD_TREATMENTS,
    topic: depressionSourceTopic,
    e: "Según el Manual de terapia de conducta en la infancia, ¿cuál es una característica del programa ACTION de Stark?",
    o: {
      a: "Es multicomponente y grupal, dirigido a niños y niñas de 8 a 13 años con depresión.",
      b: "Es un protocolo farmacológico para el trastorno por déficit de atención con hiperactividad.",
      c: "Es un entrenamiento exclusivo para padres de menores con trastorno negativista desafiante.",
      d: "Se basa únicamente en exposición para tratar la fobia escolar.",
    },
    c: "a",
    x: "La opción a es correcta. ACTION es un programa grupal y multicomponente para la depresión infantil dirigido a población de 8 a 13 años. Se ha eliminado la afirmación previa, no sustentada, de que estuviera limitado a niñas o a sus familias.",
    r: CHILD_THERAPY + " Programa ACTION de Stark para depresión infantil, p. 248.",
  },
  "Simu 11 comentado_077": {
    sourceTopic: depressionSourceTopic,
    oldC: "d",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childDepressionTopic,
    e: "Según el DSM-5-TR, ¿en qué intervalo de edad puede hacerse por primera vez el diagnóstico de trastorno de desregulación disruptiva del estado de ánimo?",
    o: {
      a: "Entre los 5 y los 10 años.",
      b: "Entre los 6 y los 12 años.",
      c: "Antes de los 7 años.",
      d: "Entre los 6 y los 18 años.",
    },
    c: "d",
    x: "La opción d es correcta. El DSM-5-TR establece que el primer diagnóstico no debe hacerse antes de los 6 años ni después de los 18 años.",
    r: DSM + " Trastorno de desregulación disruptiva del estado de ánimo, criterio G, p. 178.",
  },
  "Simu 16 comentado_185": {
    sourceTopic: depressionSourceTopic,
    oldC: "a",
    subject: ADULT_TREATMENTS,
    topic: adultNeurocognitiveTreatmentTopic,
    e: "¿Qué intervención en demencias leves o moderadas se basa en actividades grupales que estimulan globalmente el funcionamiento cognitivo y social?",
    o: {
      a: "La estimulación cognitiva.",
      b: "El entrenamiento cognitivo.",
      c: "La rehabilitación cognitiva.",
      d: "La intervención ambiental.",
    },
    c: "a",
    x: "La opción a es correcta. La estimulación cognitiva emplea actividades grupales para estimular globalmente el funcionamiento cognitivo y social. El entrenamiento cognitivo se centra en tareas específicas y la rehabilitación cognitiva es individualizada y funcional.",
    r: BELLOCH_II + " Tratamiento de los trastornos neurocognitivos: estimulación, entrenamiento y rehabilitación cognitiva, p. 614.",
  },
  "Simu 16 comentado_186": {
    sourceTopic: depressionSourceTopic,
    oldC: "b",
    subject: CHILD_TREATMENTS,
    topic: childTraumaTreatmentTopic,
    e: "En el modelo integrativo de desarrollo para sintomatología disociativa infantil, ¿qué objetivo se trabaja específicamente con la familia?",
    o: {
      a: "Enseñar al niño o niña a identificar precursores y autorregular las transiciones disociativas.",
      b: "Enseñar nuevos patrones de interacción que permitan expresar directamente las emociones.",
      c: "Confirmar literalmente las identidades disociadas.",
      d: "Sustituir la comunicación emocional por la evitación de recuerdos.",
    },
    c: "b",
    x: "La opción b es correcta. En este modelo, el menor aprende a identificar precursores y a autorregular las transiciones, mientras que la familia aprende patrones de interacción que hacen posible la expresión directa de emociones y hablar de lo sucedido.",
    r: CHILD_THERAPY + " Intervención en abuso sexual y maltrato infantil: modelo integrativo de desarrollo para sintomatología disociativa, pp. 291-292.",
  },
  SmCm10PIR2025_046: {
    sourceTopic: depressionSourceTopic,
    oldC: "a",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childDepressionTopic,
    e: "Para diagnosticar trastorno de desregulación disruptiva del estado de ánimo, los síntomas de los criterios A a E deben haber comenzado:",
    o: {
      a: "Antes de los 10 años.",
      b: "Después de los 12 años.",
      c: "Antes de los 6 años.",
      d: "Después de los 18 años.",
    },
    c: "a",
    x: "La opción a es correcta. Por la historia o la observación, los síntomas de los criterios A a E deben haber comenzado antes de los 10 años.",
    r: DSM + " Trastorno de desregulación disruptiva del estado de ánimo, criterio H, p. 178.",
  },
  SmCm13PIR2025_184: {
    sourceTopic: depressionSourceTopic,
    oldC: "a",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childDepressionTopic,
    e: "Según el DSM-5-TR, en niños y adolescentes el trastorno depresivo persistente requiere estado de ánimo deprimido o irritable durante un mínimo de:",
    o: {
      a: "6 meses.",
      b: "9 meses.",
      c: "1 año.",
      d: "2 años.",
    },
    c: "c",
    x: "La opción c es correcta. En niños y adolescentes, el trastorno depresivo persistente requiere que el estado de ánimo deprimido o irritable esté presente la mayor parte del día, más días que no, durante al menos un año.",
    r: DSM + " Trastorno depresivo persistente, criterios diagnósticos y especificación en población infantil y adolescente, pp. 193-194.",
  },
  SmCm19PIR2024_192: {
    sourceTopic: depressionSourceTopic,
    oldC: "c",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childDepressionTopic,
    e: "En el trastorno de desregulación disruptiva del estado de ánimo, los accesos de cólera graves y recurrentes deben producirse, en promedio, al menos:",
    o: {
      a: "Una vez por semana.",
      b: "Dos veces por semana.",
      c: "Tres o más veces por semana.",
      d: "Una vez al día.",
    },
    c: "c",
    x: "La opción c es correcta. El criterio C exige que los accesos de cólera graves y recurrentes ocurran, en promedio, tres o más veces por semana.",
    r: DSM + " Trastorno de desregulación disruptiva del estado de ánimo, criterio C, p. 178.",
  },
  SmCm1PIR2024_180: {
    sourceTopic: depressionSourceTopic,
    oldC: "b",
    subject: CHILD_TREATMENTS,
    topic: childSelfHarmTopic,
    e: "En el ensayo aleatorizado de Mehlum et al. con adolescentes con conducta autolesiva repetida, ¿qué intervención se comparó con tratamiento habitual mejorado?",
    o: {
      a: "La terapia interpersonal para adolescentes (IPT-A).",
      b: "La terapia dialéctico-conductual adaptada a adolescentes (DBT-A).",
      c: "La terapia cognitivo-conductual individual por internet (ICBT).",
      d: "La terapia basada en mentalización para adolescentes (MBT-A).",
    },
    c: "b",
    x: "La opción b es correcta. El ensayo comparó DBT-A con tratamiento habitual mejorado y halló al final del tratamiento una mayor reducción de autolesiones, ideación suicida y síntomas depresivos en el grupo DBT-A.",
    r: "Mehlum, L. et al. (2014). «Dialectical Behavior Therapy for Adolescents With Repeated Suicidal and Self-Harming Behavior: A Randomized Trial». Journal of the American Academy of Child & Adolescent Psychiatry, 53(10), 1082-1091. https://doi.org/10.1016/j.jaac.2014.07.003. Véase también Al-Halabí, S. y Fonseca-Pedrero, E. (coords.). (2023). Manual de psicología de la conducta suicida, cap. 11, pp. 428-431.",
  },
  SIM_ABR25_145: {
    sourceTopic: conductSourceTopic,
    oldC: "a",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "En el entrenamiento en autoinstrucciones de Meichenbaum, ¿qué sucede primero?",
    o: {
      a: "El terapeuta realiza la tarea y se da instrucciones en voz alta.",
      b: "El niño o niña realiza la tarea guiado por instrucciones verbales del terapeuta.",
      c: "El niño o niña se da instrucciones en voz alta.",
      d: "El niño o niña realiza la tarea con habla internalizada.",
    },
    c: "a",
    x: "La opción a es correcta. La secuencia comienza con el modelado cognitivo: el terapeuta realiza la tarea mientras verbaliza las autoinstrucciones que utiliza.",
    r: CHILD_THERAPY + " Entrenamiento en autoinstrucciones de Meichenbaum, p. 523.",
  },
  SIM_PERS_AGO25_024: {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "En el programa de entrenamiento para padres de Barkley y Benton, ¿qué se trabaja antes de la economía de fichas y del tiempo fuera?",
    o: {
      a: "El tiempo fuera.",
      b: "El coste de respuesta.",
      c: "La atención positiva a la conducta adecuada y las órdenes eficaces.",
      d: "La relajación progresiva.",
    },
    c: "c",
    x: "La opción c es correcta. Antes de introducir economía de fichas y tiempo fuera, el programa trabaja la atención positiva a la conducta adecuada y el uso de órdenes eficaces.",
    r: CHILD_THERAPY + " Entrenamiento para padres de Barkley y Benton, pp. 533-534.",
  },
  SIM_PERS_AGO25_074: {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "Después del modelado inicial del terapeuta en el entrenamiento en autoinstrucciones, ¿qué paso sigue?",
    o: {
      a: "El niño o niña usa habla internalizada.",
      b: "El niño o niña se autoinstruye en voz alta.",
      c: "El terapeuta vuelve a modelar la tarea sin participación del menor.",
      d: "El niño o niña realiza la tarea guiado por instrucciones verbales del terapeuta.",
    },
    c: "d",
    x: "La opción d es correcta. Tras el modelado cognitivo, el menor realiza la tarea mientras el terapeuta le proporciona las instrucciones en voz alta; después se avanza hacia la autoinstrucción verbal y el habla internalizada.",
    r: CHILD_THERAPY + " Entrenamiento en autoinstrucciones de Meichenbaum, p. 523.",
  },
  SIM_PERS_AGO25_094: {
    sourceTopic: conductSourceTopic,
    oldC: "b",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "En una economía de fichas, las fichas funcionan como:",
    o: {
      a: "Reforzadores primarios.",
      b: "Reforzadores condicionados generalizados.",
      c: "Estímulos aversivos condicionados.",
      d: "Castigo negativo.",
    },
    c: "b",
    x: "La opción b es correcta. Las fichas se entregan de manera contingente a la conducta objetivo y pueden canjearse por distintos reforzadores; por ello actúan como reforzadores condicionados generalizados.",
    r: CHILD_THERAPY + " Economía de fichas, p. 522.",
  },
  SIM_PERS_AGO25_114: {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "Retirar de forma contingente el acceso del niño o niña a reforzadores positivos durante un breve periodo para reducir una conducta es:",
    o: {
      a: "Refuerzo negativo.",
      b: "Castigo positivo.",
      c: "Castigo negativo: tiempo fuera de reforzamiento positivo.",
      d: "Extinción.",
    },
    c: "c",
    x: "La opción c es correcta. El tiempo fuera retira de forma contingente el acceso a reforzadores positivos y se utiliza como un procedimiento de castigo negativo para disminuir conducta negativa o desafiante.",
    r: CHILD_THERAPY + " Tiempo fuera en el entrenamiento para padres de Barkley y Benton, p. 534.",
  },
  SIM_PERS_AGO25_134: {
    sourceTopic: conductSourceTopic,
    oldC: "b",
    subject: CHILD_TREATMENTS,
    topic: conductSourceTopic,
    e: "La pérdida contingente de fichas o privilegios previamente obtenidos tras una conducta inadecuada se denomina:",
    o: {
      a: "Saciedad.",
      b: "Coste de respuesta.",
      c: "Sobrecorrección restitutiva.",
      d: "Práctica negativa.",
    },
    c: "b",
    x: "La opción b es correcta. El coste de respuesta consiste en retirar de forma contingente reforzadores previamente obtenidos, como fichas o privilegios, después de una conducta inadecuada.",
    r: CHILD_THERAPY + " Coste de respuesta, p. 522.",
  },
  "Simu 12 comentado_207": {
    sourceTopic: conductSourceTopic,
    oldC: "b",
    subject: PSYCHOTHERAPIES,
    topic: systemicTopic,
    e: "¿Qué enfoque sistémico describe la organización familiar mediante subsistemas, límites y relaciones triádicas como alianzas y coaliciones?",
    o: {
      a: "La terapia MRI de Palo Alto.",
      b: "La terapia familiar estructural de Minuchin.",
      c: "La Escuela de Milán.",
      d: "La terapia centrada en soluciones.",
    },
    c: "b",
    x: "La opción b es correcta. La terapia familiar estructural de Minuchin entiende la familia como una estructura formada por subsistemas, límites y configuraciones triádicas, entre ellas alianzas y coaliciones.",
    r: "Minuchin, S. (1974). Families and Family Therapy. Harvard University Press. Cap. 1, pp. 1-15.",
  },
  "Simu 7 comentado _118": {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childDisruptiveTopic,
    e: "En el ciclo coercitivo de Patterson, un progenitor da una orden, el niño o niña protesta y el progenitor retira la orden; el menor deja entonces de protestar. ¿Qué mantiene la retirada de la orden por el progenitor?",
    o: {
      a: "El refuerzo positivo de la protesta del menor.",
      b: "El castigo negativo de la protesta del menor.",
      c: "El refuerzo negativo de la retirada de la orden por el progenitor.",
      d: "La extinción de la conducta parental.",
    },
    c: "c",
    x: "La opción c es correcta. El cese de la conducta aversiva del menor (la protesta) refuerza negativamente que el progenitor retire la orden, lo que puede mantener un patrón coercitivo de interacción.",
    r: "Patterson, G. R. (1982). Coercive Family Process. Castalia.",
  },
  SmCm20PIR2024_011: {
    sourceTopic: conductSourceTopic,
    oldC: "d",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childAdhdTopic,
    e: "En niños y niñas con presentación combinada de trastorno por déficit de atención con hiperactividad, ¿qué trastorno concurre aproximadamente en la mitad de los casos?",
    o: {
      a: "El trastorno negativista desafiante.",
      b: "El trastorno obsesivo-compulsivo.",
      c: "La esquizofrenia.",
      d: "La anorexia nerviosa.",
    },
    c: "a",
    x: "La opción a es correcta. En la presentación combinada de TDAH, el trastorno negativista desafiante es una de las comorbilidades más frecuentes y concurre aproximadamente en la mitad de los casos.",
    r: CHILD_THERAPY + " Comorbilidad del TDAH, p. 562.",
  },
  "SmCm22PIR2025 (1)_166": {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childAutismTopic,
    e: "Según el DSM-5-TR, ¿cuándo se reconocen normalmente los síntomas del trastorno del espectro autista?",
    o: {
      a: "Siempre desde el nacimiento.",
      b: "Durante el segundo año de vida (12 a 24 meses), antes si el retraso es grave o después si los síntomas son sutiles.",
      c: "De forma súbita entre los 3 y los 5 años tras una situación estresante.",
      d: "Nunca antes de los 3 años.",
    },
    c: "b",
    x: "La opción b es correcta. Los síntomas del trastorno del espectro autista se reconocen normalmente durante el segundo año de vida; pueden identificarse antes si los retrasos son graves o más tarde si los síntomas son sutiles.",
    r: DSM + " Trastorno del espectro autista, desarrollo y curso, p. 63.",
  },
  "SmCm24PIR2025 (1)_175": {
    sourceTopic: conductSourceTopic,
    oldC: "b",
    subject: DEVELOPMENTAL,
    topic: adolescenceTopic,
    e: "Según Papalia, Olds y Feldman, ¿en qué periodo alcanza su máximo, en general, la influencia del grupo de pares?",
    o: {
      a: "En la primera infancia.",
      b: "En la adolescencia temprana, aproximadamente a los 12 o 13 años.",
      c: "En la adolescencia tardía.",
      d: "En la adultez emergente.",
    },
    c: "b",
    x: "La opción b es correcta. La influencia del grupo de pares suele alcanzar su máximo alrededor de los 12 o 13 años; puede orientarse hacia conductas prosociales o de riesgo, por lo que se ha eliminado la afirmación previa de que fuera habitualmente positiva.",
    r: "Papalia, D. E., Olds, S. W. y Feldman, R. D. (2010). Desarrollo humano (11.ª ed.). McGraw-Hill. Cap. 17, p. 537.",
  },
  "SmCm30PIR2025 (1)_152": {
    sourceTopic: conductSourceTopic,
    oldC: "b",
    subject: EVALUATION,
    topic: neuropsychologicalEvaluationTopic,
    e: "El Índice de Barthel de Mahoney y Barthel estima el grado de independencia funcional en:",
    o: {
      a: "El deterioro cognitivo.",
      b: "Las actividades básicas de la vida diaria.",
      c: "Las actividades instrumentales de la vida diaria.",
      d: "Los rasgos neuropsicológicos.",
    },
    c: "b",
    x: "La opción b es correcta. El Índice de Barthel estima el grado de independencia funcional en actividades básicas de la vida diaria y movilidad, no el deterioro cognitivo ni las actividades instrumentales.",
    r: "Mahoney, F. I. y Barthel, D. W. (1965). «Functional Evaluation: The Barthel Index». Maryland State Medical Journal, 14, 61-65.",
  },
  "SmCm30PIR2025 (1)_166": {
    sourceTopic: conductSourceTopic,
    oldC: "c",
    subject: CHILD_PSYCHOPATHOLOGY,
    topic: childLearningTopic,
    e: "Tras una evaluación clínica y psicopedagógica, un niño de 8 años presenta durante más de seis meses dificultades persistentes en precisión, velocidad y fluidez de la lectura, pese a intervenciones dirigidas. Interfieren significativamente en la escuela y no se explican mejor por otra condición. ¿Qué diagnóstico DSM-5-TR es más compatible?",
    o: {
      a: "Trastorno de la lectura.",
      b: "Trastorno del lenguaje.",
      c: "Trastorno específico del aprendizaje, con dificultades en la lectura.",
      d: "Trastorno de la comunicación social.",
    },
    c: "c",
    x: "La opción c es correcta. El caso cumple los criterios de dificultades persistentes durante al menos seis meses, interferencia funcional y exclusión de otras explicaciones para el trastorno específico del aprendizaje con dificultades en la lectura.",
    r: DSM + " Trastorno específico del aprendizaje, criterios A-D y especificador con dificultades en la lectura, pp. 77-78.",
  },
};

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const treatments = read(paths.treatments);
const child = read(paths.child);
const adult = read(paths.adult);
const psychotherapies = read(paths.psychotherapies);
const developmental = read(paths.developmental);
const evaluation = read(paths.evaluation);
const manifest = read(paths.manifest);
const sourceIds = Object.keys(reviews);
const byId = new Map(treatments.map((question) => [question.id, question]));
const missing = sourceIds.filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas de origen: " + missing.join(", "));

for (const sourceTopic of [depressionSourceTopic, conductSourceTopic]) {
  const found = treatments.filter((question) => question.t?.[0] === sourceTopic).map((question) => question.id).sort();
  const expected = sourceIds.filter((id) => reviews[id].sourceTopic === sourceTopic).sort();
  if (found.join("|") !== expected.join("|")) {
    throw new Error("El tema de origen contiene preguntas fuera del bloque auditado: " + sourceTopic);
  }
}

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
const finalTreatments = treatments.filter((question) => !sourceIds.includes(question.id));
const destinations = new Map([
  [CHILD_TREATMENTS, finalTreatments],
  [CHILD_PSYCHOPATHOLOGY, child],
  [ADULT_TREATMENTS, adult],
  [PSYCHOTHERAPIES, psychotherapies],
  [DEVELOPMENTAL, developmental],
  [EVALUATION, evaluation],
]);
const existingDestinationIds = new Set([...child, ...adult, ...psychotherapies, ...developmental, ...evaluation].map((question) => question.id));
const collisions = sourceIds.filter((id) => existingDestinationIds.has(id));
if (collisions.length) throw new Error("ID ya existente en destino: " + collisions.join(", "));
for (const question of reviewed) destinations.get(question.s).push(question);

if (!child.every((question) => reviewedStatuses.has(question.v))) {
  throw new Error("Psicopatología Infantil contendría preguntas sin revisión final.");
}

const addTopicAfter = (subject, topic, afterTopic) => {
  const topics = manifest.subjects[subject].topics;
  if (!topics.includes(topic)) {
    const after = topics.indexOf(afterTopic);
    topics.splice(after >= 0 ? after + 1 : topics.length, 0, topic);
  }
};
addTopicAfter(CHILD_TREATMENTS, childSelfHarmTopic, childTraumaTreatmentTopic);
addTopicAfter(CHILD_PSYCHOPATHOLOGY, childAutismTopic, "Trastornos de ansiedad infantojuveniles");

const finals = {
  "tratamientos_infantiles.json": finalTreatments,
  "psicopatologia_infantil.json": child,
  "tratamientos_adultos.json": adult,
  "psicoterapias.json": psychotherapies,
  "psicologia_evolutiva.json": developmental,
  "evaluacion_psicologica.json": evaluation,
};
const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
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
  block: "Tratamientos Infantiles 03 — depresión/bipolaridad y conducta",
  corrected: reviewed.length,
  retainedInChildTreatments: reviewed.filter((question) => question.s === CHILD_TREATMENTS).length,
  reclassified: reviewed.filter((question) => question.s !== CHILD_TREATMENTS).length,
  destinations: Object.fromEntries([...counts].filter(([subject]) => [CHILD_TREATMENTS, CHILD_PSYCHOPATHOLOGY, ADULT_TREATMENTS, PSYCHOTHERAPIES, DEVELOPMENTAL, EVALUATION].includes(subject))),
  addedTopics: [childSelfHarmTopic, childAutismTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
