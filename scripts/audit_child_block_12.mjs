import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const CHILD = "Psicopatología Infantil";
const sleepTopic = "Trastornos del sueño-vigilia infantojuveniles";
const communicationTopic = "Trastornos de la comunicación";
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const reviews = {
  "Simu 16 comentado_090": {
    oldC: "b",
    topic: sleepTopic,
    e: "Según el DSM-5-TR, ¿qué afirmación sobre los trastornos del despertar del sueño no REM es correcta?",
    o: {
      a: "Ocurren exclusivamente durante el sueño REM y predominan al final de la noche.",
      b: "Van acompañados de un despertar completo y del recuerdo detallado de un sueño vívido.",
      c: "Son despertares incompletos que suelen aparecer durante el primer tercio del período principal de sueño.",
      d: "Se diagnostican cuando los episodios se explican por los efectos fisiológicos de una sustancia.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR describe los trastornos del despertar del sueño no REM como episodios recurrentes de despertar incompleto, generalmente durante el primer tercio del período principal de sueño. El recuerdo de los sueños es nulo o mínimo y existe amnesia del episodio.",
    r: DSM + " p. 452, criterios diagnósticos de los trastornos del despertar del sueño no REM.",
  },
  SmCm14PIR2025_041: {
    oldC: "c",
    topic: sleepTopic,
    e: "¿Cuál de los siguientes hallazgos es característico de un episodio de sonambulismo según el DSM-5-TR?",
    o: {
      a: "La persona se levanta de la cama y camina, presenta mirada fija y en blanco y es difícil despertarla.",
      b: "El episodio ocurre durante el sueño REM, con despertar fácil y recuerdo vívido del sueño.",
      c: "La persona permanece completamente alerta y orientada durante todo el episodio.",
      d: "El diagnóstico exige cefaleas y somnolencia durante la vigilia.",
    },
    c: "a",
    x: "La opción a es correcta. En el sonambulismo hay episodios repetidos de levantarse de la cama y caminar durante el sueño; la persona presenta mirada fija y en blanco, responde poco a los intentos de comunicación y solo se despierta con dificultad.",
    r: DSM + " pp. 452-453, criterios y características diagnósticas del tipo con sonambulismo.",
  },
  SmCm20PIR2024_012: {
    oldC: "b",
    topic: sleepTopic,
    e: "¿Qué característica diferencia mejor los terrores nocturnos de las pesadillas según el DSM-5-TR?",
    o: {
      a: "Los terrores nocturnos aparecen habitualmente durante el sueño REM, al final de la noche, y se recuerdan con detalle.",
      b: "Los terrores nocturnos son despertares incompletos, típicamente en el primer tercio de la noche, con miedo intenso y poco o ningún recuerdo posterior.",
      c: "Los terrores nocturnos cursan sin signos de activación autónoma.",
      d: "Los terrores nocturnos deben atribuirse a los efectos fisiológicos de una sustancia.",
    },
    c: "b",
    x: "La opción b es correcta. Los terrores nocturnos son un tipo de trastorno del despertar del sueño no REM: suelen producirse en el primer tercio de la noche, con terror intenso y signos autónomos, y el recuerdo posterior es mínimo o inexistente. Las pesadillas suelen ocurrir en sueño REM y se recuerdan bien.",
    r: DSM + " pp. 452-455 y 457, trastornos del despertar del sueño no REM y trastorno de pesadillas.",
  },
  SmCm17PIR2025_064: {
    oldC: "c",
    topic: communicationTopic,
    e: "Según el DSM-5-TR, ¿qué afirmación describe el trastorno fonológico?",
    o: {
      a: "Es una dificultad persistente en la producción fonológica que interfiere con la inteligibilidad del habla o impide comunicar mensajes verbalmente.",
      b: "Se explica por una parálisis cerebral, un paladar hendido o una hipoacusia.",
      c: "Comienza necesariamente en la adolescencia.",
      d: "No requiere limitaciones en la comunicación eficaz ni en la participación social o académica.",
    },
    c: "a",
    x: "La opción a es correcta. El criterio A del trastorno fonológico exige una dificultad persistente en la producción de los sonidos del habla que interfiera con la inteligibilidad o con la comunicación verbal. Las dificultades no deben atribuirse a una afección congénita o adquirida, sensorial, neurológica o estructural.",
    r: DSM + " p. 50, criterios diagnósticos del trastorno fonológico.",
  },
  SmCm19PIR2024_088: {
    oldC: "b",
    topic: communicationTopic,
    e: "¿Cuál de las siguientes manifestaciones puede formar parte del trastorno de la fluidez de inicio en la infancia según el DSM-5-TR?",
    o: {
      a: "Repeticiones de sonidos o sílabas, prolongaciones, bloqueos audibles o silenciosos y palabras fragmentadas.",
      b: "Dificultad persistente para adaptar el lenguaje al contexto social, sin alteración de la fluidez.",
      c: "Una alteración de la pronunciación explicada por una lesión neurológica adquirida.",
      d: "Patrones restrictivos y repetitivos de comportamiento como requisito diagnóstico.",
    },
    c: "a",
    x: "La opción a es correcta. El trastorno de la fluidez de inicio en la infancia se caracteriza por alteraciones de la fluidez y del patrón temporal del habla inapropiadas para la edad y las habilidades lingüísticas, entre ellas repeticiones, prolongaciones, bloqueos y palabras fragmentadas.",
    r: DSM + " pp. 51-53, criterios diagnósticos y características del trastorno de la fluidez de inicio en la infancia.",
  },
  SmCm1PIR2024_064: {
    oldC: "b",
    topic: communicationTopic,
    e: "Según el DSM-5-TR, ¿qué condición debe descartarse como explicación principal antes de diagnosticar un trastorno del lenguaje?",
    o: {
      a: "Un deterioro auditivo o sensorial, una disfunción motora del habla u otra afección médica o neurológica.",
      b: "La existencia de antecedentes familiares de dificultades del lenguaje.",
      c: "La presencia de vocabulario reducido.",
      d: "El inicio de las dificultades en las primeras fases del desarrollo.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR requiere que las dificultades de lenguaje no se atribuyan a un deterioro auditivo o sensorial, una disfunción motora ni otra afección médica o neurológica. Los antecedentes familiares, el vocabulario reducido y el inicio temprano pueden ser compatibles con el trastorno del lenguaje.",
    r: DSM + " p. 47, criterio D del trastorno del lenguaje.",
  },
  "SmCm27PIR2025 (1)_191": {
    oldC: "c",
    topic: communicationTopic,
    e: "¿Qué hallazgo apoya un trastorno de la comunicación social (pragmático) frente a un trastorno del espectro autista?",
    o: {
      a: "Dificultad persistente para producir los sonidos del habla que interfiere con la inteligibilidad.",
      b: "Dificultades persistentes para usar la comunicación verbal y no verbal en situaciones sociales, sin antecedentes de patrones restrictivos o repetitivos que expliquen el deterioro actual.",
      c: "Alteraciones de la fluidez del habla, como bloqueos y prolongaciones, iniciadas en la infancia.",
      d: "Presencia actual o pasada de patrones restrictivos y repetitivos de comportamiento, intereses o actividades que explican el deterioro.",
    },
    c: "b",
    x: "La opción b es correcta. El trastorno de la comunicación social (pragmático) implica dificultades persistentes en el uso social de la comunicación. Se diferencia del TEA porque no hay patrones restrictivos o repetitivos actuales ni antecedentes de estos que expliquen el deterioro presente.",
    r: DSM + " pp. 54-55, criterios y diagnóstico diferencial del trastorno de la comunicación social (pragmático).",
  },
};

const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const byId = new Map(child.map((question) => [question.id, question]));
const missing = Object.keys(reviews).filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));

const finalChild = child.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.s !== CHILD || question.t?.[0] !== review.topic) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  const result = { ...question, e: review.e, o: review.o, c: review.c, x: review.x, r: review.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  return result;
});

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => file === "psicopatologia_infantil.json"
  ? finalChild
  : JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8")));
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}
for (const topic of [sleepTopic, communicationTopic]) {
  const questions = finalChild.filter((question) => question.t?.[0] === topic);
  if (!questions.length || !questions.every((question) => reviewed.has(question.v))) {
    throw new Error("El tema no queda completamente revisado: " + topic);
  }
}

fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 12 — sueño y comunicación",
  primarySourceCorrected: Object.keys(reviews).length,
  completedTopics: [sleepTopic, communicationTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
