import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const cie11 = "Organización Mundial de la Salud (2024). CIE-11 para estadísticas de mortalidad y morbilidad.";

const edits = {
  SIM_PERS_AGO25_105: {
    e: "¿Cuál es el temor central que caracteriza el trastorno de ansiedad por separación en la infancia?",
    o: {
      a: "El miedo a ser evaluado negativamente por los compañeros de clase.",
      b: "La fobia a los espacios cerrados cuando no están los padres.",
      c: "El temor excesivo a que las figuras de apego sufran algún daño grave o a perderse e impedir el reencuentro con ellas.",
      d: "La preocupación excesiva por el rendimiento académico futuro.",
    },
    c: "c",
    x: "El trastorno de ansiedad por separación se caracteriza por miedo o ansiedad excesivos e inapropiados ante la separación de las figuras de apego, incluida la preocupación por acontecimientos adversos que puedan causar la separación o impedir el reencuentro.",
    r: `${dsm} Trastorno de ansiedad por separación: criterios diagnósticos, pp. 217-218.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 14 comentado _157": {
    e: "¿Cuál de las siguientes afirmaciones se ajusta a los criterios diagnósticos del mutismo selectivo según el DSM-5-TR?",
    o: {
      a: "El niño no habla en ningún contexto, incluido el hogar, durante al menos un mes.",
      b: "El fracaso constante para hablar en situaciones sociales específicas debe durar al menos un mes y no limitarse al primer mes de escuela.",
      c: "El mutismo se explica mejor por ansiedad social y no debe considerarse un trastorno independiente.",
      d: "Puede diagnosticarse aunque el niño no domine el idioma requerido en el contexto social.",
    },
    c: "b",
    x: "El criterio de duración del mutismo selectivo es de al menos un mes, sin contar el primer mes de escuela. El fracaso para hablar debe presentarse en situaciones sociales concretas con expectativa de hablar y no explicarse por desconocimiento del idioma.",
    r: `${dsm} Mutismo selectivo: criterios diagnósticos, pp. 221-223.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 16 comentado_196": {
    e: "¿Cuál de las siguientes afirmaciones es correcta respecto a la ansiedad social en niños y adolescentes?",
    o: {
      a: "La forma generalizada del trastorno tiene un impacto similar en el funcionamiento psicosocial que los miedos restringidos a la actuación escolar.",
      b: "El miedo a mostrar signos de ansiedad, como sudoración o tartamudez, es típico solo de los adultos con ansiedad social.",
      c: "En culturas colectivistas, como la japonesa, puede predominar el miedo a ofender a otros mediante la mirada.",
      d: "Los niños con ansiedad social generalizada solo temen situaciones de actuación en público, como hablar en clase.",
    },
    c: "c",
    x: "El DSM-5-TR señala que, en algunas culturas colectivistas, puede predominar el temor a ofender a otras personas, por ejemplo mediante la mirada. La ansiedad social no se limita a la actuación pública ni a la edad adulta.",
    r: `${dsm} Trastorno de ansiedad social: aspectos culturales, pp. 230 y 232-233.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 6 comentado__099": {
    e: "En niños con mutismo selectivo, ¿cuál de las siguientes afirmaciones es correcta?",
    o: {
      a: "El fracaso para hablar se produce en cualquier situación.",
      b: "La alteración debe durar al menos un año.",
      c: "La alteración puede atribuirse al desconocimiento del idioma.",
      d: "Aunque no hablen en contextos como la escuela, pueden usar comunicación no verbal e interactuar en situaciones que no exigen hablar.",
    },
    c: "d",
    x: "En el mutismo selectivo el fracaso para hablar se limita a situaciones sociales específicas. Muchos niños se comunican de forma no verbal y pueden interactuar cuando no se espera que hablen; no se debe al desconocimiento del idioma.",
    r: `${dsm} Mutismo selectivo: criterios y características diagnósticas, pp. 221-224.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 8 comentado _075": {
    e: "¿En qué capítulo se ubica el mutismo selectivo según el DSM-5-TR?",
    o: {
      a: "Trastornos del neurodesarrollo.",
      b: "Trastornos de la comunicación.",
      c: "Trastornos de ansiedad.",
      d: "Trastornos relacionados con traumas y factores de estrés.",
    },
    c: "c",
    x: "El DSM-5-TR clasifica el mutismo selectivo dentro del capítulo de trastornos de ansiedad, aunque afecte a la comunicación verbal en determinados contextos.",
    r: `${dsm} Capítulo Trastornos de ansiedad; mutismo selectivo, pp. 215 y 221.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 8 comentado _076": {
    e: "Señale la afirmación falsa sobre el trastorno de ansiedad social.",
    o: {
      a: "La ansiedad debe estar presente al menos cuatro semanas en niños y adolescentes y seis meses en adultos.",
      b: "Se aplica el especificador «solo actuación» si el miedo se limita a hablar o actuar en público.",
      c: "Es más prevalente en mujeres en la población general.",
      d: "En población clínica la prevalencia es similar o ligeramente mayor en hombres.",
    },
    c: "a",
    x: "El DSM-5-TR exige que el miedo, la ansiedad o la evitación sean persistentes, típicamente durante seis meses o más, tanto en niños como en adultos. Por eso la alternativa a es falsa.",
    r: `${dsm} Trastorno de ansiedad social: criterios diagnósticos, pp. 229-231.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm06PIR2025_192: {
    e: "En niños con mutismo selectivo, ¿cuál de las siguientes afirmaciones es correcta?",
    o: {
      a: "El fracaso para hablar se produce en cualquier situación.",
      b: "La alteración debe durar al menos un año.",
      c: "La alteración puede atribuirse al desconocimiento del idioma.",
      d: "Aunque no hablen en contextos como la escuela, pueden usar comunicación no verbal e interactuar en situaciones que no exigen hablar.",
    },
    c: "d",
    x: "En el mutismo selectivo el fracaso para hablar se limita a situaciones sociales específicas. Muchos niños se comunican de forma no verbal y pueden interactuar cuando no se espera que hablen; no se debe al desconocimiento del idioma.",
    r: `${dsm} Mutismo selectivo: criterios y características diagnósticas, pp. 221-224.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm09PIR2025_070: {
    e: "Según el DSM-5-TR, para diagnosticar trastorno de ansiedad por separación, ¿cuánto tiempo deben estar presentes el miedo, la ansiedad o la evitación?",
    o: {
      a: "Al menos tres meses en niños y adolescentes y al menos seis meses en adultos.",
      b: "Al menos cuatro semanas en niños y adolescentes y al menos seis meses en adultos.",
      c: "Al menos cuatro semanas en niños y adolescentes y al menos tres meses en adultos.",
      d: "Al menos tres meses en niños y adolescentes y al menos cuatro semanas en adultos.",
    },
    c: "b",
    x: "El DSM-5-TR exige una duración de al menos cuatro semanas en niños y adolescentes y, típicamente, de seis meses o más en adultos.",
    r: `${dsm} Trastorno de ansiedad por separación: criterio de duración, p. 217.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_090: {
    e: "¿Qué trastorno se caracteriza por miedo o ansiedad desproporcionados respecto al peligro real, difíciles de controlar y que conducen a evitación?",
    o: {
      a: "Mutismo selectivo.",
      b: "Trastorno de tics.",
      c: "Fobia específica.",
      d: "Miedo evolutivo normativo.",
    },
    c: "c",
    x: "La fobia específica implica miedo o ansiedad intensos ante un objeto o situación concretos, desproporcionados al peligro real, persistentes y asociados a evitación o malestar significativo.",
    r: `${dsm} Fobia específica: criterios diagnósticos, pp. 224-226.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_143: {
    e: "¿Cuál de los siguientes es un criterio de duración para el trastorno de ansiedad por separación?",
    o: {
      a: "El miedo, la ansiedad o la evitación persisten al menos cuatro semanas tanto en niños y adolescentes como en adultos.",
      b: "El miedo, la ansiedad o la evitación persisten al menos seis meses tanto en niños y adolescentes como en adultos.",
      c: "El miedo, la ansiedad o la evitación persisten al menos seis meses en niños y adolescentes y cuatro semanas o más en adultos.",
      d: "El miedo, la ansiedad o la evitación persisten al menos cuatro semanas en niños y adolescentes y seis meses o más en adultos.",
    },
    c: "d",
    x: "El criterio de duración para el trastorno de ansiedad por separación es de al menos cuatro semanas en niños y adolescentes y, típicamente, de seis meses o más en adultos.",
    r: `${dsm} Trastorno de ansiedad por separación: criterio de duración, p. 217.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_188: {
    e: "Según la CIE-11, ¿a qué diagnóstico corresponde la siguiente definición: «El niño demuestra competencia lingüística adecuada en situaciones sociales específicas, normalmente en casa, pero fracasa constantemente a la hora de hablar en otras, habitualmente en la escuela»?",
    o: {
      a: "Trastorno de ansiedad generalizada.",
      b: "Trastorno de ansiedad de separación.",
      c: "Mutismo selectivo.",
      d: "Fobia específica.",
    },
    c: "c",
    x: "La CIE-11 describe el mutismo selectivo como un fracaso constante para hablar en situaciones sociales específicas pese a disponer de competencia lingüística adecuada en otras, con frecuencia en el hogar.",
    r: `${cie11} 6B06, Mutismo selectivo, p. 461.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_192: {
    e: "Cuando un niño evita de forma reiterada situaciones que pueden separarle de su familia o de su hogar, ¿qué trastorno debe considerarse?",
    o: {
      a: "Trastorno de ansiedad por separación.",
      b: "Trastorno de ansiedad social.",
      c: "Agorafobia.",
      d: "Trastorno de pánico.",
    },
    c: "a",
    x: "La evitación persistente de salir de casa, ir a la escuela o alejarse de las figuras de apego por miedo a la separación es característica del trastorno de ansiedad por separación.",
    r: `${dsm} Trastorno de ansiedad por separación: criterios diagnósticos, pp. 217-218.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm11PIR2025_061: {
    e: "¿Cuál de los siguientes es un criterio de duración para el trastorno de ansiedad por separación?",
    o: {
      a: "El miedo, la ansiedad o la evitación persisten al menos cuatro semanas tanto en niños y adolescentes como en adultos.",
      b: "El miedo, la ansiedad o la evitación persisten al menos seis meses tanto en niños y adolescentes como en adultos.",
      c: "El miedo, la ansiedad o la evitación persisten al menos seis meses en niños y adolescentes y cuatro semanas o más en adultos.",
      d: "El miedo, la ansiedad o la evitación persisten al menos cuatro semanas en niños y adolescentes y seis meses o más en adultos.",
    },
    c: "d",
    x: "El criterio de duración para el trastorno de ansiedad por separación es de al menos cuatro semanas en niños y adolescentes y, típicamente, de seis meses o más en adultos.",
    r: `${dsm} Trastorno de ansiedad por separación: criterio de duración, p. 217.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm16PIR2025_197: {
    e: "Señale cuál de las siguientes características es propia del mutismo selectivo.",
    o: {
      a: "Fracaso constante para hablar en cualquier situación.",
      b: "Se produce exclusivamente durante el curso de un trastorno del espectro autista, la esquizofrenia u otro trastorno psicótico.",
      c: "El fracaso para hablar puede atribuirse a la falta de conocimiento del lenguaje.",
      d: "Fracaso constante para hablar en situaciones sociales específicas en las que existe expectativa por hablar, como la escuela, pese a hablar en otros contextos.",
    },
    c: "d",
    x: "El mutismo selectivo se define por el fracaso constante para hablar en situaciones sociales específicas donde se espera que el niño hable, pese a hablar en otras situaciones. No se explica por desconocimiento del idioma ni se limita a otro trastorno psicótico o del neurodesarrollo.",
    r: `${dsm} Mutismo selectivo: criterios diagnósticos, pp. 221-222.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm1PIR2024_081: {
    e: "Señale la opción incorrecta sobre el mutismo selectivo.",
    o: {
      a: "En el DSM-5-TR se incluye dentro de los trastornos de ansiedad.",
      b: "En la CIE-10 se denomina mutismo electivo.",
      c: "En el DSM-5-TR se incluye dentro de los trastornos del neurodesarrollo.",
      d: "La duración de la alteración es como mínimo de un mes y no se limita al primer mes de escuela.",
    },
    c: "c",
    x: "La afirmación incorrecta es la c: el DSM-5-TR clasifica el mutismo selectivo entre los trastornos de ansiedad. La CIE-10 emplea la denominación «mutismo electivo» y el criterio de duración es de al menos un mes, sin contar el primer mes escolar.",
    r: `${dsm} Mutismo selectivo: clasificación y criterios, pp. 215 y 221; Organización Mundial de la Salud (1992). CIE-10, F94.0.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm20PIR2024_013: {
    e: "¿Qué requisito no es necesario, según el DSM-5-TR, para diagnosticar fobia específica en la infancia?",
    o: {
      a: "Que el miedo se limite a un objeto o situación específicos.",
      b: "Que comience antes de los 18 años.",
      c: "Que provoque malestar clínicamente significativo o deterioro del funcionamiento.",
      d: "Que el miedo o la ansiedad sean desproporcionados al peligro real.",
    },
    c: "b",
    x: "El DSM-5-TR no establece una edad de inicio antes de los 18 años para el diagnóstico de fobia específica. Sí exige miedo o ansiedad ante un objeto o situación específicos, desproporción respecto al peligro y malestar o deterioro clínicamente significativo.",
    r: `${dsm} Fobia específica: criterios diagnósticos, pp. 224-226.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm27PIR2025 (1)_202": {
    e: "¿Cuál de las siguientes alternativas es correcta sobre el mutismo selectivo según el DSM-5-TR?",
    o: {
      a: "Habitualmente hablan con personas ajenas a la familia, pero se niegan a hablar en casa ante familiares inmediatos.",
      b: "Entre las características asociadas figura la desinhibición conductual.",
      c: "La comorbilidad más frecuente es el trastorno de ansiedad generalizada.",
      d: "Habitualmente comienza antes de los 5 años, aunque suele motivar consulta al iniciar la escolarización y tener que interactuar o leer en voz alta.",
    },
    c: "d",
    x: "El mutismo selectivo suele comenzar antes de los 5 años, pero puede pasar inadvertido hasta la escolarización, cuando aumentan las demandas de interacción verbal. Se asocia más habitualmente a ansiedad social que a trastorno de ansiedad generalizada.",
    r: `${dsm} Mutismo selectivo: desarrollo, curso y comorbilidad, pp. 223-224.`,
    v: "VALIDADA_ORIGINAL",
  },
};

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
const missing = Object.keys(edits).filter((id) => !idsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const next = questions.map((question) => {
  const edit = edits[question.id];
  return edit ? { ...question, ...edit, o: edit.o } : question;
});
const idsAfter = new Set(next.map((question) => question.id));
if (next.length !== questions.length || idsAfter.size !== idsBefore.size || [...idsBefore].some((id) => !idsAfter.has(id))) {
  throw new Error("La auditoría modificaría el total o los identificadores de preguntas.");
}
for (const [id, edit] of Object.entries(edits)) {
  const question = next.find((candidate) => candidate.id === id);
  if (question.c !== edit.c || !question.x || !question.r || question.v !== "VALIDADA_ORIGINAL") {
    throw new Error(`La validación de ${id} no está completa.`);
  }
}

fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 04 — ansiedad y mutismo selectivo",
  validated: Object.keys(edits).length,
  pendingReformulation: ["Simu 15 comentado_099", "SmCm19PIR2024_194", "SmCm19PIR2024_195", "SmCm23PIR2025_109"],
  preservedQuestionIds: true,
}, null, 2));
