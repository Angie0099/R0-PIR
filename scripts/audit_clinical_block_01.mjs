import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const childPath = path.join(bancoDir, "psicopatologia_infantil.json");
const therapiesPath = path.join(bancoDir, "psicoterapias.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CLINICAL = "Psicología Clínica";
const CHILD = "Psicopatología Infantil";
const THERAPIES = "Psicoterapias";
const excretionTopic = "Trastornos de excreción";
const communicationTopic = "Trastornos de la comunicación";
const childExcretionTopic = "Trastornos de eliminación infantojuveniles";
const childCommunicationTopic = "Trastornos de la comunicación";
const generalTechniquesTopic = "Técnicas psicológicas generales";
const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const CONDUCT = "Comeche Moreno, M.ª I., y Vallejo Pareja, M. A. (2016). Manual de terapia de conducta en la infancia (3.ª ed.). Dykinson.";
const reviewed = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const excretionReviews = {
  "ABRIL-UNO-24_COMENTADO_173": {
    oldC: "a",
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones sobre la enuresis es correcta?",
    o: {
      a: "Solo puede diagnosticarse si la emisión de orina es involuntaria y nocturna.",
      b: "Consiste en la emisión repetida de orina en la cama o en la ropa, que puede ser voluntaria o involuntaria.",
      c: "La edad cronológica mínima para el diagnóstico es de cuatro años.",
      d: "Puede atribuirse a los efectos fisiológicos de un diurético sin que ello afecte al diagnóstico.",
    },
    c: "b",
    x: "La opción b es correcta. El DSM-5-TR define la enuresis como la emisión repetida de orina en la cama o en la ropa, ya sea voluntaria o involuntaria. La edad mínima es de cinco años o un nivel de desarrollo equivalente y deben excluirse los efectos de sustancias o afecciones médicas como explicación directa.",
    r: DSM + " p. 399, criterios diagnósticos de enuresis.",
  },
  "DICIEMBRE-DOS-24_COMENTADO_068": {
    oldC: "d",
    e: "¿Qué especificadores contempla el DSM-5-TR para la encopresis?",
    o: {
      a: "Primaria, secundaria y terciaria.",
      b: "Solo nocturna, solo diurna y nocturna y diurna.",
      c: "Leve, moderada y grave.",
      d: "Con estreñimiento e incontinencia por desbordamiento, o sin estreñimiento e incontinencia por desbordamiento.",
    },
    c: "d",
    x: "La opción d es correcta. El DSM-5-TR especifica la encopresis según exista o no estreñimiento e incontinencia por desbordamiento. Las especificaciones solo nocturna, solo diurna y nocturna y diurna corresponden a la enuresis.",
    r: DSM + " p. 402, especificadores de encopresis.",
  },
  "DICIEMBRE-UNO-24_COMENTADO_140": {
    oldC: "a",
    e: "¿Qué hallazgo es característico de la encopresis con estreñimiento e incontinencia por desbordamiento según el DSM-5-TR?",
    o: {
      a: "Retención fecal y estreñimiento, con posible pérdida de heces poco formadas por desbordamiento.",
      b: "Deposición intermitente de heces normales sin signos de estreñimiento, como patrón habitual del subtipo con desbordamiento.",
      c: "Excreción exclusivamente intencionada sin relación con la retención fecal.",
      d: "Ausencia de cualquier síntoma digestivo o de estreñimiento en la historia clínica.",
    },
    c: "a",
    x: "La opción a es correcta. En la encopresis con estreñimiento e incontinencia por desbordamiento suele existir retención fecal; las heces pueden estar poco formadas y la pérdida puede ser frecuente o continua. La incontinencia suele resolverse tras tratar el estreñimiento.",
    r: DSM + " pp. 402-403, subtipos y características diagnósticas de la encopresis.",
  },
  "DICIEMBRE-UNO-24_COMENTADO_141": {
    oldC: "c",
    e: "¿Cuál de las siguientes afirmaciones sobre las infecciones urinarias y la enuresis es correcta según el DSM-5-TR?",
    o: {
      a: "Las infecciones urinarias excluyen siempre el diagnóstico de enuresis, incluso si la incontinencia era previa.",
      b: "Son más frecuentes solo en la encopresis y no guardan relación con la incontinencia urinaria.",
      c: "Son más frecuentes en niños con incontinencia urinaria diurna y enuresis nocturna y diurna, especialmente en el subtipo diurno.",
      d: "Son más frecuentes en la enuresis solo nocturna que en cualquier otra presentación.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR señala que las infecciones de las vías urinarias son más frecuentes en niños con incontinencia urinaria diurna y con enuresis nocturna y diurna, en especial en el subtipo diurno. La presencia de una afección médica requiere valorar si explica directamente la incontinencia.",
    r: DSM + " p. 402, comorbilidad y diagnóstico diferencial de la enuresis.",
  },
  "SEPTIEMBRE-DOS-24_COMENTADO_177": {
    oldC: "c",
    e: "¿Cuándo se considera clínicamente significativo el comportamiento en la enuresis según el DSM-5-TR?",
    o: {
      a: "Cuando ocurre una vez al mes durante tres meses.",
      b: "Cuando ocurre tres veces por semana durante un mes, sin otra condición.",
      c: "Cuando ocurre al menos dos veces por semana durante tres meses consecutivos, o causa malestar o deterioro clínicamente significativo.",
      d: "Cuando ocurre dos veces al mes durante tres meses, con independencia del deterioro funcional.",
    },
    c: "c",
    x: "La opción c es correcta. El criterio B de enuresis exige una frecuencia de al menos dos veces por semana durante tres meses consecutivos, o bien malestar clínicamente significativo o deterioro social, académico, laboral u otro deterioro importante.",
    r: DSM + " pp. 399-400, criterios y características diagnósticas de enuresis.",
  },
  "SEPTIEMBRE-UNO-24_COMENTADO_068": {
    oldC: "b",
    e: "¿Cuál es la edad cronológica mínima para diagnosticar enuresis según el DSM-5-TR?",
    o: {
      a: "Cuatro años.",
      b: "Cinco años, o un grado de desarrollo equivalente.",
      c: "Seis años.",
      d: "No existe una edad mínima.",
    },
    c: "b",
    x: "La opción b es correcta. Para la enuresis, el DSM-5-TR establece una edad cronológica mínima de cinco años o un nivel de desarrollo equivalente. La edad mínima de cuatro años corresponde a la encopresis.",
    r: DSM + " p. 399, criterio C de enuresis.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_129": {
    oldC: "c",
    e: "Según el DSM-5-TR, ¿cuál es el criterio de frecuencia y duración de la encopresis?",
    o: {
      a: "Al menos un episodio cada semana durante tres meses.",
      b: "Al menos dos episodios cada semana durante tres meses consecutivos.",
      c: "Al menos un episodio cada mes durante un mínimo de tres meses.",
      d: "Al menos un episodio cada mes durante seis meses.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR requiere que al menos uno de los episodios de excreción de heces en lugares inapropiados se produzca cada mes durante un mínimo de tres meses. El criterio temporal de dos veces por semana corresponde a la enuresis.",
    r: DSM + " p. 402, criterio B de encopresis.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_137": {
    oldC: "c",
    e: "¿Qué afirmación describe correctamente la enuresis solo nocturna según el DSM-5-TR?",
    o: {
      a: "Es la presentación menos frecuente y ocurre únicamente durante las horas de vigilia.",
      b: "Es sinónimo de enuresis diurna.",
      c: "También se denomina enuresis monosintomática; es la presentación más común y la incontinencia se produce únicamente durante el sueño nocturno.",
      d: "Exige que haya estreñimiento e incontinencia por desbordamiento.",
    },
    c: "c",
    x: "La opción c es correcta. La enuresis solo nocturna, también llamada monosintomática, es el subtipo más común y se produce solo durante el sueño nocturno, especialmente durante el primer tercio de la noche. Los especificadores de estreñimiento corresponden a la encopresis.",
    r: DSM + " p. 399, subtipos de enuresis.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_084": {
    oldC: "b",
    e: "¿Cuál de las siguientes afirmaciones sobre las diferencias por sexo en la enuresis es correcta según el DSM-5-TR?",
    o: {
      a: "La enuresis nocturna es más común en varones que en mujeres, con una proporción aproximada de 2:1.",
      b: "La enuresis nocturna es claramente más frecuente en mujeres.",
      c: "La incontinencia urinaria diurna es más habitual en varones y la diferencia aumenta con la edad.",
      d: "No se han descrito diferencias por sexo en ninguna presentación de enuresis.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR indica que la enuresis nocturna es más frecuente en varones que en mujeres, aproximadamente en una proporción de 2:1. En cambio, la incontinencia diurna es más habitual en mujeres y la diferencia aumenta con la edad.",
    r: DSM + " p. 401, aspectos diagnósticos relacionados con el sexo y el género en enuresis.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_121": {
    oldC: "c",
    e: "¿Qué asociación familiar con la enuresis nocturna recoge el DSM-5-TR?",
    o: {
      a: "El riesgo es idéntico con antecedente materno o paterno.",
      b: "El antecedente paterno se asocia a un riesgo inferior al antecedente materno.",
      c: "El riesgo es aproximadamente 3,6 veces mayor con antecedente materno y 10,1 veces mayor con antecedente paterno de incontinencia urinaria.",
      d: "Los antecedentes familiares no se asocian con el riesgo de enuresis nocturna.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR señala que el riesgo de enuresis nocturna en la infancia es aproximadamente 3,6 veces mayor en hijos de madres enuréticas y 10,1 veces mayor en caso de antecedente paterno de incontinencia urinaria.",
    r: DSM + " p. 401, factores genéticos y fisiológicos de la enuresis.",
  },
  "PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_085": {
    oldC: "c",
    e: "¿Cuál de las siguientes afirmaciones sobre el curso de la enuresis es correcta según el DSM-5-TR?",
    o: {
      a: "La enuresis secundaria se define por la ausencia completa de control urinario desde el nacimiento.",
      b: "La enuresis primaria se inicia solo después de un período de continencia urinaria.",
      c: "La enuresis secundaria aparece después de que la persona haya alcanzado un período de continencia urinaria.",
      d: "El DSM-5-TR no diferencia posibles cursos evolutivos de la enuresis.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR describe un curso primario, cuando nunca se ha alcanzado continencia urinaria, y un curso secundario, cuando el trastorno aparece después de un período de continencia. La edad más probable de inicio del tipo secundario se sitúa entre los cinco y los ocho años, aunque puede aparecer a cualquier edad.",
    r: DSM + " p. 400, desarrollo y curso de la enuresis.",
  },
  "SM_AGOSTO_1_SOL_1_104": {
    oldC: "a",
    e: "¿Cuál de las siguientes afirmaciones recoge correctamente los criterios de encopresis del DSM-5-TR?",
    o: {
      a: "Implica excreción repetida de heces en lugares inapropiados, voluntaria o involuntaria, con una edad mínima de cuatro años o desarrollo equivalente.",
      b: "Exige que la excreción sea siempre involuntaria y que el niño tenga al menos cinco años.",
      c: "Se diagnostica con cualquier episodio aislado de pérdida fecal antes de los cuatro años.",
      d: "No puede coexistir con estreñimiento ni con incontinencia por desbordamiento.",
    },
    c: "a",
    x: "La opción a es correcta. La encopresis consiste en la excreción repetida de heces en lugares inapropiados, que puede ser voluntaria o involuntaria. La edad cronológica mínima es de cuatro años o un grado de desarrollo equivalente; el DSM-5-TR contempla además el especificador con estreñimiento e incontinencia por desbordamiento.",
    r: DSM + " p. 402, criterios y especificadores de encopresis.",
  },
  "SM_DICIEMBRE_2_SOL_1_184": {
    oldC: "b",
    e: "¿Cuál es la evolución de la prevalencia comunitaria de la enuresis nocturna que describe el DSM-5-TR?",
    o: {
      a: "5-10 % a los 10 años, 3-5 % a los 15 años y 1 % en la edad adulta.",
      b: "Alrededor del 1 % a los 5 años y 10 % a los 15 años o más.",
      c: "La prevalencia se mantiene estable entre el 5 y el 10 % durante toda la vida.",
      d: "Aproximadamente 5-10 % a los 5 años, 3-5 % a los 10 años y alrededor de 1 % a los 15 años o más.",
    },
    c: "d",
    x: "La opción d es correcta. El DSM-5-TR recoge que la prevalencia comunitaria de la enuresis nocturna disminuye con la edad: aproximadamente 5-10 % a los cinco años, 3-5 % a los diez años y alrededor de 1 % a los quince años o más.",
    r: DSM + " p. 400, prevalencia de la enuresis nocturna.",
  },
  "SM_JULIO_1_SOL_1_138": {
    oldC: "a",
    e: "¿Cuál de las siguientes afirmaciones sobre el curso de la enuresis es correcta según el DSM-5-TR?",
    o: {
      a: "Después de los cinco años, la remisión espontánea se produce aproximadamente en un 5-10 % de los casos por año; en torno al 1 % persiste hasta la edad adulta.",
      b: "La enuresis nocturna persiste en la edad adulta en la mayoría de los casos.",
      c: "La remisión espontánea no ocurre después de los cinco años.",
      d: "La enuresis diurna es habitual después de los nueve años.",
    },
    c: "a",
    x: "La opción a es correcta. Tras los cinco años, el DSM-5-TR estima una remisión espontánea anual del 5-10 %. La mayoría de los niños desarrolla continencia durante la adolescencia y el trastorno persiste en torno al 1 % de los casos hasta la edad adulta; la enuresis diurna es infrecuente después de los nueve años.",
    r: DSM + " p. 400, desarrollo y curso de la enuresis.",
  },
  "SM_JULIO_2_SOL_1_064": {
    oldC: "c",
    e: "¿Cuándo puede mantenerse el diagnóstico de enuresis en presencia de una afección médica que puede causar incontinencia urinaria según el DSM-5-TR?",
    o: {
      a: "Nunca; cualquier afección médica excluye de forma definitiva el diagnóstico.",
      b: "Siempre, aunque la incontinencia se haya iniciado únicamente tras la afección médica.",
      c: "Cuando la incontinencia ya era habitual antes de la afección médica o persiste después de instaurar un tratamiento adecuado de esta.",
      d: "Solo cuando la afección médica es una infección urinaria aguda.",
    },
    c: "c",
    x: "La opción c es correcta. El DSM-5-TR no diagnostica enuresis si una afección médica explica directamente la poliuria o la urgencia, pero permite el diagnóstico cuando la incontinencia era habitual antes de esa afección o persiste después de tratarla adecuadamente.",
    r: DSM + " p. 402, diagnóstico diferencial de la enuresis.",
  },
};

const communicationReviews = {
  SIM_ABR25_030: {
    oldC: "a",
    e: "Según el DSM-5-TR, ¿qué describe el trastorno fonológico?",
    o: {
      a: "Una alteración del habla causada necesariamente por una lesión neurológica conocida.",
      b: "Una dificultad persistente en la producción fonológica que interfiere con la inteligibilidad del habla o impide comunicar mensajes verbalmente.",
      c: "Un retraso obligatorio de dos años respecto a la edad cronológica, sin necesidad de deterioro funcional.",
      d: "Un trastorno definido por subtipos tónico, clónico y mixto.",
    },
    c: "b",
    x: "La opción b es correcta. El trastorno fonológico exige una dificultad persistente en la producción de los sonidos del habla que interfiera con la inteligibilidad o con la comunicación verbal. No se diagnostica cuando las dificultades se explican por una afección neurológica, sensorial o estructural.",
    r: DSM + " p. 50, criterios diagnósticos del trastorno fonológico.",
  },
  SIM_ABR25_044: {
    oldC: "a",
    e: "¿Qué consecuencia funcional forma parte de los criterios del trastorno fonológico según el DSM-5-TR?",
    o: {
      a: "Ninguna; basta con que exista una pronunciación distinta de la habitual.",
      b: "Únicamente dificultades para leer, sin repercusión en la comunicación oral.",
      c: "Limitaciones en la comunicación eficaz que interfieren con la participación social, los logros académicos o el desempeño laboral.",
      d: "La necesidad de recibir educación especial durante, al menos, dos cursos escolares.",
    },
    c: "c",
    x: "La opción c es correcta. Además de la dificultad persistente en la producción fonológica, el DSM-5-TR requiere que la alteración cause limitaciones en la comunicación eficaz e interfiera con la participación social, los logros académicos o el desempeño laboral.",
    r: DSM + " p. 50, criterio B del trastorno fonológico.",
  },
  SIM_ABR25_074: {
    oldC: "a",
    e: "¿Qué condición debe descartarse como explicación principal antes de diagnosticar un trastorno fonológico según el DSM-5-TR?",
    o: {
      a: "Una afección congénita o adquirida, como parálisis cerebral, paladar hendido, hipoacusia, traumatismo cerebral u otra afección médica o neurológica.",
      b: "El inicio de las dificultades en las primeras fases del desarrollo.",
      c: "La existencia de antecedentes familiares de trastornos del habla o del lenguaje.",
      d: "Que el habla sea poco inteligible para las personas ajenas a la familia.",
    },
    c: "a",
    x: "La opción a es correcta. El DSM-5-TR exige que las dificultades del trastorno fonológico no se atribuyan a una afección congénita o adquirida, sensorial, estructural, médica o neurológica. El inicio temprano, los antecedentes familiares y la baja inteligibilidad pueden ser compatibles con el trastorno.",
    r: DSM + " p. 50, criterios C y D del trastorno fonológico.",
  },
};

const responseCostReview = {
  id: "SIM_ABR25_134",
  oldC: "a",
  e: "En modificación de conducta, ¿cómo se denomina retirar de forma contingente un reforzador positivo o una cantidad de reforzadores ya obtenidos después de una conducta inadecuada?",
  o: {
    a: "Saciedad de respuesta.",
    b: "Coste de respuesta.",
    c: "Sobrecorrección restitutiva.",
    d: "Práctica negativa.",
  },
  c: "b",
  x: "La opción b es correcta. El coste de respuesta es un procedimiento de castigo negativo: tras una conducta inadecuada se retira de forma contingente un reforzador positivo o una cantidad de reforzadores previamente obtenidos, como fichas o privilegios. No equivale a la extinción ni a la sobrecorrección.",
  r: CONDUCT + " Apartado de técnicas operantes de modificación de conducta.",
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const therapies = JSON.parse(fs.readFileSync(therapiesPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const reviewIds = new Set([...Object.keys(excretionReviews), ...Object.keys(communicationReviews), responseCostReview.id]);
const clinicalById = new Map(clinical.map((question) => [question.id, question]));
const missing = [...reviewIds].filter((id) => !clinicalById.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas clínicas: " + missing.join(", "));

const ensureSource = (question, expectedTopic, review) => {
  if (question.s !== CLINICAL || question.t?.[0] !== expectedTopic) {
    throw new Error("Ubicación previa inesperada en " + question.id);
  }
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
};
const makeReviewed = (question, review, subject, topic) => {
  const result = { ...question, s: subject, t: [topic], e: review.e, o: review.o, c: review.c, x: review.x, r: review.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  return result;
};

const movedToChild = [];
for (const [id, review] of Object.entries(excretionReviews)) {
  const question = clinicalById.get(id);
  ensureSource(question, excretionTopic, review);
  movedToChild.push(makeReviewed(question, review, CHILD, childExcretionTopic));
}
for (const [id, review] of Object.entries(communicationReviews)) {
  const question = clinicalById.get(id);
  ensureSource(question, communicationTopic, review);
  movedToChild.push(makeReviewed(question, review, CHILD, childCommunicationTopic));
}
const responseCostSource = clinicalById.get(responseCostReview.id);
ensureSource(responseCostSource, communicationTopic, responseCostReview);
const movedToTherapies = makeReviewed(responseCostSource, responseCostReview, THERAPIES, generalTechniquesTopic);

const targetIds = new Set([...child, ...therapies].map((question) => question.id));
const collisions = [...reviewIds].filter((id) => targetIds.has(id));
if (collisions.length) throw new Error("Los identificadores ya existen en el destino: " + collisions.join(", "));
const finalClinical = clinical.filter((question) => !reviewIds.has(question.id));
const finalChild = [...child, ...movedToChild];
const finalTherapies = [...therapies, movedToTherapies];

if (finalClinical.some((question) => [excretionTopic, communicationTopic].includes(question.t?.[0]))) {
  throw new Error("Persisten preguntas en los temas clínicos reubicados.");
}
if (!movedToChild.every((question) => reviewed.has(question.v))) {
  throw new Error("Hay preguntas infantiles sin validación final.");
}

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "psicologia_clinica.json") return finalClinical;
  if (file === "psicopatologia_infantil.json") return finalChild;
  if (file === "psicoterapias.json") return finalTherapies;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== manifest.total) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}

const clinicalTopics = manifest.subjects[CLINICAL].topics;
if (![excretionTopic, communicationTopic].every((topic) => clinicalTopics.includes(topic))) {
  throw new Error("Los temas clínicos esperados no existen en el manifiesto.");
}
manifest.subjects[CLINICAL].topics = clinicalTopics.filter((topic) => ![excretionTopic, communicationTopic].includes(topic));
const countsBySubject = new Map();
for (const question of allAfter) countsBySubject.set(question.s, (countsBySubject.get(question.s) || 0) + 1);
for (const [name, details] of Object.entries(manifest.subjects)) {
  const count = countsBySubject.get(name);
  if (count === undefined) throw new Error("Faltan preguntas para la asignatura " + name + ".");
  details.count = count;
}
manifest.total = [...countsBySubject.values()].reduce((sum, count) => sum + count, 0);

fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");
fs.writeFileSync(childPath, JSON.stringify(finalChild) + "\n", "utf8");
fs.writeFileSync(therapiesPath, JSON.stringify(finalTherapies) + "\n", "utf8");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Clínica 01 — excreción y comunicación",
  relocatedToInfantPsychopathology: movedToChild.length,
  relocatedToPsychotherapies: 1,
  completedSourceTopics: [excretionTopic, communicationTopic],
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
