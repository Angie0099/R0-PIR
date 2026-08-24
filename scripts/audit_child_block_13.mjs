import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const CHILD = "Psicopatología Infantil";
const eliminationTopic = "Trastornos de eliminación infantojuveniles";
const adhdTopic = "Trastorno por déficit de atención con hiperactividad (TDAH)";
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const reviews = {
  "Simu 14 comentado _160": {
    oldC: "a",
    topic: eliminationTopic,
    e: "Según el DSM-5-TR, ¿cuál de los siguientes requisitos forma parte del diagnóstico de enuresis?",
    o: {
      a: "La emisión de orina debe ocurrir exclusivamente durante el sueño nocturno y ser siempre involuntaria.",
      b: "La emisión repetida de orina en la cama o la ropa ocurre al menos dos veces por semana durante tres meses consecutivos, o causa malestar o deterioro clínicamente significativo.",
      c: "La edad cronológica debe ser, como mínimo, de cuatro años.",
      d: "El diagnóstico se mantiene aunque la incontinencia se explique por una sustancia o por una afección médica.",
    },
    c: "b",
    x: "La opción b es correcta. Para diagnosticar enuresis, el DSM-5-TR exige emisión repetida de orina en la cama o la ropa, con una frecuencia de al menos dos veces por semana durante tres meses consecutivos o con malestar o deterioro clínicamente significativo. La edad mínima es de cinco años o un nivel de desarrollo equivalente y deben descartarse sustancias o afecciones médicas como explicación.",
    r: DSM + " p. 399, criterios diagnósticos de enuresis.",
  },
  SmCm14PIR2025_039: {
    oldC: "a",
    topic: eliminationTopic,
    e: "¿Cuál es el subtipo más frecuente de enuresis según el DSM-5-TR?",
    o: {
      a: "La enuresis solo nocturna, también denominada enuresis monosintomática.",
      b: "La enuresis solo diurna.",
      c: "La enuresis nocturna y diurna.",
      d: "La enuresis con estreñimiento e incontinencia por desbordamiento.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR señala que la enuresis solo nocturna, también llamada monosintomática, es el subtipo más común. Los subtipos solo diurna y nocturna y diurna también pueden especificarse; el estreñimiento y la incontinencia por desbordamiento corresponden a los especificadores de la encopresis.",
    r: DSM + " p. 399, subtipos de enuresis.",
  },
  "Simu 7 comentado _116": {
    oldC: "d",
    topic: eliminationTopic,
    e: "¿Qué especificaciones de presentación contempla el DSM-5-TR para la enuresis?",
    o: {
      a: "Solo nocturna, solo diurna y nocturna y diurna.",
      b: "Primaria, secundaria y terciaria.",
      c: "Sueño REM, sueño no REM y vigilia.",
      d: "Leve, moderada y grave según la frecuencia de los episodios.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR permite especificar la enuresis como solo nocturna, solo diurna o nocturna y diurna. Los términos primaria y secundaria describen posibles cursos evolutivos, pero no son las especificaciones diagnósticas del manual.",
    r: DSM + " pp. 399-400, especificaciones y curso de la enuresis.",
  },
  "Simu 16 comentado_093": {
    oldC: "a",
    topic: eliminationTopic,
    e: "Según el DSM-5-TR, ¿qué requisito temporal es necesario para diagnosticar encopresis?",
    o: {
      a: "La emisión de heces debe ocurrir a diario durante, al menos, seis meses.",
      b: "Al menos uno de los episodios debe producirse cada mes durante un mínimo de tres meses.",
      c: "Deben producirse, como mínimo, dos episodios semanales durante tres meses.",
      d: "No se exige duración cuando hay estreñimiento.",
    },
    c: "b",
    x: "La opción b es correcta. En la encopresis debe producirse al menos un episodio mensual durante un mínimo de tres meses. Además, ha de haber excreción repetida de heces en lugares inapropiados y la edad cronológica debe ser de al menos cuatro años o equivalente en desarrollo.",
    r: DSM + " pp. 402-403, criterios diagnósticos de encopresis.",
  },
  SmCm16PIR2025_187: {
    oldC: "a",
    topic: eliminationTopic,
    e: "¿Cuál de las siguientes afirmaciones sobre la encopresis es correcta según el DSM-5-TR?",
    o: {
      a: "La excreción de heces debe ser siempre involuntaria para establecer el diagnóstico.",
      b: "La edad mínima para el diagnóstico es de cinco años.",
      c: "Puede especificarse con estreñimiento e incontinencia por desbordamiento cuando existen pruebas de estreñimiento en la exploración física o en la historia clínica.",
      d: "La presencia de una afección médica excluye el diagnóstico incluso cuando el mecanismo es el estreñimiento.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR permite especificar la encopresis con estreñimiento e incontinencia por desbordamiento cuando hay pruebas de estreñimiento. La excreción puede ser voluntaria o involuntaria; la edad mínima es de cuatro años, y una afección médica no excluye el diagnóstico si interviene un mecanismo relacionado con el estreñimiento.",
    r: DSM + " pp. 402-403, criterios y especificadores de encopresis.",
  },
  "Simu 11 comentado_073": {
    oldC: "d",
    topic: adhdTopic,
    e: "En un niño menor de 17 años, ¿qué exige el criterio A del DSM-5-TR para considerar un conjunto de síntomas de TDAH?",
    o: {
      a: "Cinco síntomas presentes durante al menos un mes.",
      b: "Seis síntomas presentes durante al menos un año, sin necesidad de ser inapropiados para el nivel de desarrollo.",
      c: "Seis o más síntomas de inatención y/o seis o más de hiperactividad-impulsividad, según la presentación, durante al menos seis meses y en un grado incompatible con el nivel de desarrollo.",
      d: "Un único síntoma grave de inatención o hiperactividad-impulsividad que produzca malestar.",
    },
    c: "c",
    x: "La opción c es correcta. En menores de 17 años, el criterio A requiere seis o más síntomas de inatención y/o seis o más de hiperactividad-impulsividad durante al menos seis meses, con una intensidad incompatible con el nivel de desarrollo y con impacto negativo directo en las actividades sociales y académicas o laborales.",
    r: DSM + " p. 68, criterio A del TDAH.",
  },
  "Simu 11 comentado_074": {
    oldC: "b",
    topic: adhdTopic,
    e: "¿Qué requisito de inicio forma parte de los criterios diagnósticos del TDAH en el DSM-5-TR?",
    o: {
      a: "Todos los síntomas deben estar presentes antes de los seis años.",
      b: "El deterioro funcional debe comenzar después de los 18 años.",
      c: "Varios síntomas de inatención o de hiperactividad-impulsividad deben estar presentes antes de los 12 años.",
      d: "Los síntomas deben iniciarse únicamente después de comenzar la escolarización.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR requiere que varios síntomas de inatención o de hiperactividad-impulsividad estén presentes antes de los 12 años. No exige que estén presentes todos los síntomas ni que el inicio coincida con la escolarización.",
    r: DSM + " p. 69, criterio B del TDAH.",
  },
  "Simu 13 comentado_081": {
    oldC: "d",
    topic: adhdTopic,
    e: "¿Qué requisito de contexto exige el DSM-5-TR para el diagnóstico de TDAH?",
    o: {
      a: "Varios síntomas de inatención o de hiperactividad-impulsividad deben estar presentes en dos o más contextos.",
      b: "Los síntomas deben observarse exclusivamente en el centro educativo.",
      c: "Los síntomas deben aparecer en al menos tres contextos distintos.",
      d: "Es suficiente que los síntomas se manifiesten en casa si son graves.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR exige que varios síntomas estén presentes en dos o más contextos, por ejemplo en casa, en la escuela o el trabajo, con amigos o familiares, o en otras actividades. Esta exigencia ayuda a diferenciar un patrón persistente de dificultades situacionales.",
    r: DSM + " p. 69, criterio C del TDAH.",
  },
  "Simu 16 comentado_198": {
    oldC: "b",
    topic: adhdTopic,
    e: "¿Cuándo puede especificarse la presentación predominantemente hiperactiva/impulsiva del TDAH según el DSM-5-TR?",
    o: {
      a: "Cuando se cumplen ambos conjuntos de síntomas, A1 y A2, durante los últimos seis meses.",
      b: "Cuando se cumple el criterio A1 de inatención, pero no el A2 de hiperactividad-impulsividad, durante los últimos seis meses.",
      c: "Cuando existe cualquier síntoma de hiperactividad o impulsividad, aunque no se cumpla el criterio A.",
      d: "Cuando se cumple el criterio A2 de hiperactividad-impulsividad, pero no el A1 de inatención, durante los últimos seis meses.",
    },
    c: "d",
    x: "La opción d es correcta. La presentación predominantemente hiperactiva/impulsiva se especifica cuando se cumple el criterio A2 de hiperactividad-impulsividad, pero no el A1 de inatención, durante los últimos seis meses. Si se cumplen ambos, la presentación es combinada.",
    r: DSM + " p. 69, especificación de las presentaciones del TDAH.",
  },
  SmCm09PIR2025_167: {
    oldC: "d",
    topic: adhdTopic,
    e: "¿Cuál de las siguientes afirmaciones sobre la evaluación del TDAH es correcta según el DSM-5-TR?",
    o: {
      a: "Un EEG anormal confirma el diagnóstico de TDAH.",
      b: "La neuroimagen estructural permite diagnosticar el TDAH de forma concluyente.",
      c: "No existe ningún marcador biológico que permita diagnosticar el TDAH; el EEG y las técnicas de neuroimagen no son diagnósticas.",
      d: "El diagnóstico requiere una prueba genética que identifique un gen específico.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR indica que no existe ningún marcador biológico diagnóstico del TDAH. Aunque en investigación se han encontrado diferencias grupales en EEG o neuroimagen, estas técnicas no permiten establecer el diagnóstico en una persona concreta.",
    r: DSM + " p. 72, marcadores diagnósticos del TDAH.",
  },
  SmCm11PIR2025_009: {
    oldC: "d",
    topic: adhdTopic,
    e: "En una persona de 17 años o más, ¿cuántos síntomas de un dominio deben estar presentes para cumplir el criterio A del TDAH según el DSM-5-TR?",
    o: {
      a: "Dos síntomas.",
      b: "Tres síntomas.",
      c: "Seis síntomas.",
      d: "Cinco síntomas.",
    },
    c: "d",
    x: "La opción d es correcta. Para las personas de 17 años o más, el DSM-5-TR reduce el umbral a cinco síntomas de inatención y/o cinco de hiperactividad-impulsividad, en lugar de los seis síntomas exigidos en menores de 17 años.",
    r: DSM + " p. 68, nota del criterio A del TDAH.",
  },
  SmCm19PIR2024_196: {
    oldC: "d",
    topic: adhdTopic,
    e: "¿Cuál de las siguientes afirmaciones sobre la contribución genética al TDAH es correcta según el DSM-5-TR?",
    o: {
      a: "La heredabilidad del TDAH es mínima y no supera el 10 %.",
      b: "La heredabilidad se estima en torno al 74 %, aunque ningún gen se ha identificado como causa necesaria o suficiente.",
      c: "Un único gen determina el diagnóstico de TDAH en la mayoría de los casos.",
      d: "Los factores genéticos se limitan a los casos con discapacidad intelectual.",
    },
    c: "b",
    x: "La opción b es correcta. El DSM-5-TR estima la heredabilidad del TDAH en torno al 74 %. La contribución genética es compleja: no se ha identificado ningún gen que sea necesario o suficiente para causar el trastorno.",
    r: DSM + " p. 71, factores de riesgo genéticos y fisiológicos del TDAH.",
  },
  SmCm20PIR2024_003: {
    oldC: "b",
    topic: adhdTopic,
    e: "¿Cuál de los siguientes factores se asocia con un mayor riesgo de TDAH según el DSM-5-TR?",
    o: {
      a: "El estilo parental por sí solo como causa directa del trastorno.",
      b: "La existencia de una única mutación genética específica que determine el trastorno.",
      c: "El muy bajo peso al nacer, la prematuridad y la exposición prenatal al tabaco.",
      d: "La práctica de actividades deportivas durante la infancia.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR incluye entre los factores asociados al riesgo de TDAH el muy bajo peso al nacer, la prematuridad y la exposición prenatal al tabaco. Las interacciones familiares no suelen causar el TDAH y no existe una única mutación determinante.",
    r: DSM + " pp. 71-72, factores de riesgo y pronóstico del TDAH.",
  },
  SmCm23PIR2025_106: {
    oldC: "c",
    topic: adhdTopic,
    e: "Además de los síntomas, ¿qué exige el criterio D del DSM-5-TR para diagnosticar TDAH?",
    o: {
      a: "Evidencia clara de que los síntomas interfieren con el funcionamiento social, académico o laboral, o reducen su calidad.",
      b: "La presencia de un cociente intelectual inferior a la media.",
      c: "La existencia de un trastorno de conducta concomitante.",
      d: "El fracaso escolar como única forma de deterioro posible.",
    },
    c: "a",
    x: "La opción a es correcta. El criterio D requiere evidencia clara de que los síntomas interfieren con el funcionamiento social, académico o laboral, o reducen su calidad. El diagnóstico no exige bajo cociente intelectual, trastorno de conducta ni fracaso escolar.",
    r: DSM + " p. 69, criterio D del TDAH.",
  },
  "SmCm24PIR2025 (1)_088": {
    oldC: "d",
    topic: adhdTopic,
    e: "¿Cuál de las siguientes afirmaciones sobre el curso evolutivo del TDAH es correcta según el DSM-5-TR?",
    o: {
      a: "Los síntomas de hiperactividad aumentan inevitablemente con la edad adulta.",
      b: "El TDAH remite antes de la adolescencia en todos los casos.",
      c: "Los síntomas de inatención desaparecen habitualmente al inicio de la adolescencia.",
      d: "En la adolescencia, la hiperactividad motora puede hacerse menos evidente, mientras que la inatención y la impulsividad pueden persistir.",
    },
    c: "d",
    x: "La opción d es correcta. El DSM-5-TR señala que la hiperactividad motora tiende a hacerse menos evidente en la adolescencia, aunque la inquietud, la inatención y la impulsividad pueden persistir. El curso es heterogéneo y no todos los casos remiten antes de la vida adulta.",
    r: DSM + " p. 71, desarrollo y curso del TDAH.",
  },
  SmCm29PIR2025_096: {
    oldC: "b",
    topic: adhdTopic,
    e: "¿Cuál de las siguientes afirmaciones sobre las interacciones familiares y el TDAH es correcta según el DSM-5-TR?",
    o: {
      a: "Las pautas de crianza son la causa suficiente del TDAH.",
      b: "La dinámica familiar no tiene ninguna influencia sobre el curso ni sobre los problemas asociados.",
      c: "Las interacciones familiares no suelen causar el TDAH, pero pueden influir en su curso y en la aparición de problemas secundarios de conducta.",
      d: "El diagnóstico se establece cuando se demuestra una pauta de crianza inadecuada.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR indica que las interacciones familiares en la primera infancia probablemente no causan el TDAH, aunque pueden influir en su curso y contribuir al desarrollo de problemas secundarios de conducta. Por ello no deben confundirse factores que modulan la evolución con causas suficientes del trastorno.",
    r: DSM + " p. 72, factores de riesgo y pronóstico del TDAH.",
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
for (const topic of [eliminationTopic, adhdTopic]) {
  const questions = finalChild.filter((question) => question.t?.[0] === topic);
  if (!questions.length || !questions.every((question) => reviewed.has(question.v))) {
    throw new Error("El tema no queda completamente revisado: " + topic);
  }
}

fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 13 — eliminación y TDAH",
  primarySourceCorrected: Object.keys(reviews).length,
  completedTopics: [eliminationTopic, adhdTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
