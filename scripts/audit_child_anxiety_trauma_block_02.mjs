import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";
const cie11 = "Organización Mundial de la Salud (2024). CIE-11 para estadísticas de mortalidad y morbilidad.";

const edits = {
  "Simu 15 comentado_099": {
    e: "En el trastorno de ansiedad por separación (TAS), ¿cuál de los siguientes síntomas puede formar parte de los criterios diagnósticos?",
    o: {
      a: "Preocupación exclusiva por el rendimiento académico, sin relación con la separación de las figuras de apego.",
      b: "Dificultades de comunicación social debidas a patrones de comportamiento repetitivos.",
      c: "Pesadillas repetidas relacionadas con la separación de las figuras de apego.",
      d: "Preocupación persistente por acontecimientos adversos sin relación con la pérdida o la separación de las figuras de apego.",
    },
    c: "c",
    x: "Las pesadillas repetidas relacionadas con la separación son uno de los ocho síntomas posibles del TAS. Para el diagnóstico se requieren al menos tres síntomas, por lo que ningún síntoma aislado es obligatorio.",
    r: `${dsm} Trastorno de ansiedad por separación: criterios diagnósticos, p. 217.`,
    v: "CORREGIDA",
  },
  SmCm19PIR2024_194: {
    e: "Señale la afirmación incorrecta sobre el trastorno de ansiedad por separación (TAS).",
    o: {
      a: "En el DSM-5-TR puede diagnosticarse en población adulta.",
      b: "En la CIE-11 se incluye dentro de los trastornos de ansiedad.",
      c: "En niños pequeños, la distribución por sexo es aproximadamente igual; en edad escolar suele haber mayor prevalencia en niñas.",
      d: "Según el DSM-5-TR, el diagnóstico solo puede realizarse antes de los 18 años.",
    },
    c: "d",
    x: "La afirmación incorrecta es la d: el DSM-5-TR permite diagnosticar TAS en adultos. En niños pequeños la distribución por sexo es aproximadamente igual y, en edad escolar, el trastorno es más frecuente en niñas; la CIE-11 lo clasifica entre los trastornos de ansiedad.",
    r: `${dsm} Trastorno de ansiedad por separación: prevalencia y desarrollo, pp. 218-219; ${cie11} Trastornos de ansiedad, cap. 6B.`,
    v: "CORREGIDA",
  },
  SmCm19PIR2024_195: {
    e: "Señale la afirmación correcta sobre los trastornos de ansiedad en la infancia.",
    o: {
      a: "El mutismo selectivo se explica por falta de conocimiento del idioma requerido en la situación social.",
      b: "La duración del mutismo selectivo es de al menos un mes y no se limita al primer mes de escuela.",
      c: "La inhibición conductual es un factor exclusivo del trastorno de ansiedad social.",
      d: "El mutismo selectivo comienza habitualmente por primera vez en la adolescencia tardía.",
    },
    c: "b",
    x: "El mutismo selectivo debe durar al menos un mes, sin limitarse al primer mes de escuela. No se explica por desconocimiento del idioma, suele comenzar antes de los 5 años y la inhibición conductual no es un factor exclusivo de ansiedad social.",
    r: `${dsm} Mutismo selectivo: criterios, desarrollo y curso, pp. 221-224; trastorno de ansiedad social: factores de riesgo, pp. 232-233.`,
    v: "CORREGIDA",
  },
  SmCm23PIR2025_109: {
    e: "Señale la afirmación incorrecta sobre el trastorno de ansiedad por separación (TAS).",
    o: {
      a: "El DSM-5-TR permite realizar el diagnóstico en población adulta.",
      b: "El miedo, la ansiedad o la evitación deben persistir al menos seis meses en niños y adolescentes y cuatro semanas en adultos.",
      c: "Los niños con TAS pueden mostrar conductas de aferramiento y convertirse en la «sombra» de sus padres por la casa.",
      d: "Cuando están solos por la noche, algunos niños pequeños pueden comunicar percepciones inusuales, como monstruos que intentan cogerlos o sentir que unos ojos les miran.",
    },
    c: "b",
    x: "La afirmación b invierte las duraciones: el DSM-5-TR exige al menos cuatro semanas en niños y adolescentes y, típicamente, seis meses o más en adultos. Las conductas de aferramiento y ciertos temores nocturnos pueden aparecer en el TAS infantil.",
    r: `${dsm} Trastorno de ansiedad por separación: criterios diagnósticos y características asociadas, pp. 217-218.`,
    v: "CORREGIDA",
  },
  "Simu 11 comentado_086": {
    e: "¿A qué trastorno se refiere un patrón persistente de comportamiento inhibido y emocionalmente retraído hacia los cuidadores principales, según el DSM-5-TR?",
    o: { a: "Trastorno de relación social desinhibida.", b: "Trastorno de la comunicación social (pragmático).", c: "Trastorno de apego global.", d: "Trastorno de apego reactivo." },
    c: "d",
    x: "El trastorno de apego reactivo se caracteriza por un patrón de comportamiento inhibido y emocionalmente retraído hacia los cuidadores adultos, junto con alteraciones emocionales y sociales persistentes y antecedentes de cuidado extremadamente insuficiente.",
    r: `${dsm} Trastorno de apego reactivo: criterios diagnósticos, pp. 295-296.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 13 comentado_084": {
    e: "¿A qué trastorno se refiere un patrón de comportamiento en el que el niño interactúa activamente con adultos desconocidos, según el DSM-5-TR?",
    o: { a: "Trastorno de relación social desinhibida.", b: "Trastorno de la comunicación social (pragmático).", c: "Trastorno de apego global.", d: "Trastorno de apego reactivo." },
    c: "a",
    x: "El trastorno de relación social desinhibida se caracteriza por aproximación e interacción activa con adultos desconocidos, con reticencia reducida o ausente y conductas excesivamente familiares no acordes con las normas sociales.",
    r: `${dsm} Trastorno de relación social desinhibida: criterios diagnósticos, pp. 298-299.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 32 comentado hardcore 2_090": {
    e: "En el trastorno de apego reactivo, ¿qué elemento diagnóstico es indispensable según el DSM-5-TR?",
    o: { a: "Conductas de búsqueda activa de contacto afectivo indiscriminado.", b: "Relación social desinhibida con adultos desconocidos.", c: "Historia de cuidados extremadamente insuficientes.", d: "Hipervigilancia persistente frente a adultos." },
    c: "c",
    x: "El trastorno de apego reactivo requiere antecedentes de cuidado extremadamente insuficiente, como negligencia social, cambios repetidos de cuidadores o crianza en contextos que limitan el apego selectivo.",
    r: `${dsm} Trastorno de apego reactivo: criterio C, pp. 295-296.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 7 comentado _117": {
    e: "¿Cuál de las siguientes afirmaciones es correcta sobre el trastorno de apego reactivo según el DSM-5-TR?",
    o: {
      a: "Se ha observado en menores expuestos a negligencia grave o a privación institucional que limita la formación de apego selectivo.",
      b: "Se clasifica dentro de los trastornos del neurodesarrollo.",
      c: "Es un trastorno generalizado del desarrollo.",
      d: "Se explica por una etiología orgánica.",
    },
    c: "a",
    x: "El trastorno de apego reactivo se asocia a contextos de cuidado extremadamente insuficiente, incluida la negligencia grave o la privación institucional. No se clasifica como trastorno del neurodesarrollo ni se explica por una causa orgánica.",
    r: `${dsm} Trastorno de apego reactivo: factores de riesgo y contexto de cuidado, pp. 296-297.`,
    v: "CORREGIDA",
  },
  SmCm08PIR2025_197: {
    e: "¿Cuál de las siguientes afirmaciones sobre el trastorno de estrés postraumático (TEPT) en menores de 6 años según el DSM-5-TR es incorrecta?",
    o: {
      a: "Los recuerdos traumáticos pueden manifestarse a través del juego y no parecer angustiosos.",
      b: "En menores de 6 años, el criterio de evitación se agrupa con las alteraciones cognitivas o afectivas.",
      c: "Cuando aparecen pesadillas, puede ser imposible determinar su relación con el acontecimiento traumático.",
      d: "Los problemas de concentración son un síntoma de intrusión.",
    },
    c: "d",
    x: "La afirmación d es incorrecta: los problemas de concentración pertenecen al grupo de alteraciones de la alerta y reactividad. En menores de 6 años los recuerdos pueden expresarse mediante juego y el criterio de evitación se agrupa con las alteraciones cognitivas y afectivas.",
    r: `${dsm} TEPT en niños de 6 años o menos: criterios diagnósticos, pp. 303-304.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm19PIR2024_189: {
    e: "¿Cuál de los siguientes síntomas forma parte del trastorno de relación social desinhibida?",
    o: {
      a: "Tras alejarse del cuidador en un entorno desconocido, recurre poco o nada a él, incluso después de exponerse a una situación de riesgo.",
      b: "Rara vez busca consuelo ante el malestar.",
      c: "Respuesta socioemocional escasa hacia los demás.",
      d: "Episodios de irritabilidad, tristeza o miedo excesivos durante interacciones no amenazadoras con los cuidadores.",
    },
    c: "a",
    x: "En el trastorno de relación social desinhibida puede observarse una comprobación reducida o ausente con el cuidador tras alejarse de él, incluso en entornos desconocidos. Las otras alternativas se asocian al trastorno de apego reactivo.",
    r: `${dsm} Trastorno de relación social desinhibida: criterios diagnósticos, p. 299.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm19PIR2024_190: {
    e: "¿En qué capítulo incluye la CIE-11 el trastorno de vinculación reactiva y el trastorno de compromiso social desinhibido?",
    o: { a: "Trastornos de ansiedad.", b: "Otros trastornos del neurodesarrollo.", c: "Trastornos específicamente asociados con el estrés.", d: "Trastornos del neurodesarrollo." },
    c: "c",
    x: "La CIE-11 clasifica el trastorno de vinculación reactiva y el trastorno de compromiso social desinhibido entre los trastornos específicamente asociados con el estrés, no en el grupo de trastornos del neurodesarrollo.",
    r: `${cie11} 6B44-6B45, Trastornos específicamente asociados con el estrés, pp. 469-470.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm23PIR2025 (2)_089": {
    e: "Señale la opción correcta sobre los criterios del trastorno de estrés postraumático (TEPT) en las clasificaciones diagnósticas.",
    o: { a: "La CIE-11 tiene criterios diferenciados para mayores y menores de 6 años.", b: "El DSM-5-TR tiene criterios diferenciados para menores y mayores de 10 años.", c: "La CIE-11 tiene criterios diferenciados para mayores y menores de 10 años.", d: "El DSM-5-TR tiene criterios diferenciados para menores de 6 años y para mayores de 6 años." },
    c: "d",
    x: "El DSM-5-TR establece criterios diferenciados para TEPT en niños de 6 años o menos y para mayores de 6 años. Las divisiones de edad atribuidas a la CIE-11 o a los 10 años no son correctas.",
    r: `${dsm} TEPT: criterios para adultos, adolescentes y niños mayores de 6 años; criterios para niños de 6 años o menos, pp. 301 y 303-304.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm27PIR2025 (1)_188": {
    e: "Según el DSM-5-TR, ¿cuándo se aplica el especificador «persistente» al trastorno de apego reactivo o al trastorno de relación social desinhibida?",
    o: { a: "Cuando dura más de un mes.", b: "Cuando dura más de 12 meses.", c: "Cuando dura más de seis meses.", d: "Cuando dura más de dos años." },
    c: "b",
    x: "En ambos trastornos, el especificador «persistente» se utiliza cuando la alteración ha estado presente durante más de 12 meses.",
    r: `${dsm} Trastorno de apego reactivo y trastorno de relación social desinhibida: especificador persistente, pp. 296 y 299.`,
    v: "CORREGIDA",
  },
  "SmCm30PIR2025 (1)_063": {
    e: "¿En qué capítulo del DSM-5-TR se encuadra el trastorno de relación social desinhibida?",
    o: { a: "Trastornos del neurodesarrollo.", b: "Trastornos de ansiedad.", c: "Trastornos depresivos.", d: "Trastornos relacionados con traumas y factores de estrés." },
    c: "d",
    x: "El trastorno de relación social desinhibida se incluye en el capítulo de trastornos relacionados con traumas y factores de estrés, junto con el trastorno de apego reactivo.",
    r: `${dsm} Trastornos relacionados con traumas y factores de estrés, p. 294.`,
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
  if (question.c !== edit.c || !question.x || !question.r || question.v !== edit.v) {
    throw new Error(`La revisión de ${id} no está completa.`);
  }
}
fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 06 — ansiedad y trauma/estrés",
  reviewed: Object.keys(edits).length,
  corrected: Object.values(edits).filter((edit) => edit.v === "CORREGIDA").length,
  validated: Object.values(edits).filter((edit) => edit.v === "VALIDADA_ORIGINAL").length,
  preservedQuestionIds: true,
}, null, 2));
