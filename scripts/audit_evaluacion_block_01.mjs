import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoPath = path.resolve(scriptDir, "../public/banco/evaluacion_psicologica.json");
const SUBJECT = "Evaluación Psicológica";
const BALLESTEROS = "Fernández-Ballesteros, R. (coord.) (2011). Evaluación psicológica: conceptos, métodos y estudio de casos (2.ª ed.). Pirámide.";

// Las validaciones de este bloque se apoyan directamente en el manual original
// disponible en Fondo común. Los ítems cuya terminología procede de otro texto
// se limpian y reclasifican, pero permanecen pendientes de fuente primaria.
const reviews = {
  PERSEV_AGO25_U1_096: {
    oldC: "d", topic: "Los autoinformes", c: "d", v: "CORREGIDA",
    e: "El procedimiento de pensamiento en voz alta que requiere que la persona evaluada señale cuándo ocurre una actividad interna de interés para el examinador se denomina:",
    o: {
      a: "Muestras de pensamiento.",
      b: "Monólogo continuo.",
      c: "Muestras momentáneas.",
      d: "Registro de eventos.",
    },
    x: "En el registro de eventos, la propia persona señala cuándo aparece la actividad interna que interesa al examinador. El monólogo continuo y las muestras de pensamiento son otros procedimientos de pensamiento en voz alta; las muestras momentáneas son una estrategia de muestreo temporal.",
    r: `${BALLESTEROS} p. 262, apartado 5.3 («Pensamiento-en-voz-alta»).`,
  },
  "MAYO-UNO-24_COMENTADO_151": {
    oldC: "b", topic: "Técnicas de observación", c: "b", v: "CORREGIDA",
    e: "Cuando interesa registrar cuántas veces aparece una conducta en una unidad de tiempo, ¿qué parámetro de medida se utiliza?",
    o: {
      a: "Orden.",
      b: "Frecuencia.",
      c: "Intensidad.",
      d: "Duración.",
    },
    x: "La frecuencia expresa la extensión con la que un evento ocurre en una unidad de tiempo. El orden describe la secuencia de aparición, la duración el intervalo temporal de la conducta y la intensidad su magnitud cualitativa.",
    r: `${BALLESTEROS} p. 199, apartado «Frecuencia».`,
  },
  JUNIO1_056: {
    oldC: "a", topic: "Técnicas de observación", c: "a", v: "CORREGIDA",
    e: "En observación sistemática, ¿qué afirmación es correcta sobre los mapas de conducta o formatos de campo?",
    o: {
      a: "Sitúan conductas específicas en coordenadas espacio-temporales para analizar su relación con variables ambientales.",
      b: "Son listas cerradas de códigos únicos que exigen un marco teórico previo.",
      c: "El MICA es un ejemplo de sistema de categorías.",
      d: "No requieren seleccionar lugares, tiempos ni entrenar a los observadores.",
    },
    x: "Un mapa de conducta, también denominado formato de campo, es un procedimiento flexible que ubica conductas en coordenadas espacio-temporales. El MICA es un mapa de interacción conducta-ambiente, no un sistema de categorías.",
    r: `${BALLESTEROS} p. 206, apartado 3.3.3 («Mapas de conducta»).`,
  },
  JULIO1_055: {
    oldC: "a", topic: "Técnicas objetivas", c: "a", v: "CORREGIDA",
    e: "Señale la afirmación correcta sobre las técnicas objetivas de evaluación psicológica:",
    o: {
      a: "Constituyen una variedad de la observación, con registro y puntuación independientes del evaluador.",
      b: "La ley de valores iniciales afirma que la respuesta fisiológica es siempre inversamente proporcional al nivel previo de activación.",
      c: "La homeostasis consiste en el predominio estable del sistema nervioso parasimpático.",
      d: "La reactividad del sujeto elimina por sí sola la validez ecológica de una prueba.",
    },
    x: "Las técnicas objetivas registran, codifican y procesan respuestas de forma objetiva y sin intermediación del evaluador; por ello se consideran una variedad de la observación. La reactividad es un problema posible, pero no equivale por sí misma a la falta de validez ecológica.",
    r: `${BALLESTEROS} p. 278, apartado 2 («Las técnicas objetivas»).`,
  },
  AGOSTO2_164: {
    oldC: "b", topic: "Fundamentos de la evaluación psicológica", c: "b", v: "CORREGIDA",
    e: "¿Qué disciplina se ocupa de la construcción y elaboración de instrumentos de medida psicológica?",
    o: {
      a: "Psicotecnia.",
      b: "Psicometría.",
      c: "Psicología experimental.",
      d: "Psicología aplicada.",
    },
    x: "La psicometría se ocupa de la construcción y elaboración de instrumentos de medida. La evaluación psicológica utiliza esos instrumentos dentro de un proceso más amplio de exploración, análisis y toma de decisiones.",
    r: `${BALLESTEROS} p. 22, Introducción.`,
  },
  "DICIEMBRE-DOS-24_COMENTADO_183": {
    oldC: "a", topic: "Fundamentos de la evaluación psicológica", c: "c", v: "CORREGIDA",
    e: "En relación con la Teoría de Respuesta al Ítem (TRI), señale la afirmación correcta:",
    o: {
      a: "La puntuación obtenida depende necesariamente de la dificultad media de los ítems del test administrado.",
      b: "Los ítems pueden depender entre sí para un mismo nivel del rasgo latente.",
      c: "Permite construir tests adaptativos que seleccionan ítems según las respuestas previas de la persona evaluada.",
      d: "Prescinde de supuestos sobre la dimensionalidad del rasgo evaluado.",
    },
    x: "La TRI permite el uso de bancos de ítems y tests adaptativos, que seleccionan los ítems más adecuados según las respuestas anteriores. Sus supuestos básicos incluyen la independencia local y la unidimensionalidad en los modelos unidimensionales.",
    r: `${BALLESTEROS} pp. 309-311, apartados 4 y 4.2 («Tests adaptativos»).`,
  },
  "DICIEMBRE-UNO-24_COMENTADO_029": {
    oldC: "c", topic: "La entrevista", c: "d", v: "REVISAR_FUENTE",
    e: "Entre los errores frecuentes de la conducta verbal del entrevistado, ¿cuál se clasifica como una distorsión lingüística?",
    o: {
      a: "Omisión comparativa.",
      b: "Verbo inespecífico.",
      c: "Cuantificadores universales.",
      d: "Normalización.",
    },
    x: "Se ha corregido la clave para que sea coherente con la explicación que acompañaba al ítem: la normalización se describe allí como una distorsión, mientras que los cuantificadores universales se incluyen entre las generalizaciones. La clasificación queda pendiente de contraste en una fuente original de entrevista antes de validarse.",
    r: "",
  },
  "MAYO-UNO-24_COMENTADO_153": {
    oldC: "b", topic: "Técnicas de observación", c: "b", v: "REVISAR_FUENTE",
    e: "En evaluación psicológica, los registros catálogo son:",
    o: {
      a: "Listas de rasgos utilizadas para construir sistemas de categorías.",
      b: "Listas de rasgos abiertas y en permanente estado de construcción.",
      c: "Registros semisistematizados.",
      d: "Registros de texto que incluyen la segmentación en unidades.",
    },
    x: "Se ha eliminado la explicación que estaba incrustada en una respuesta y se ha reubicado el ítem en observación. Su definición concreta queda pendiente de contraste en una fuente primaria disponible antes de validarse.",
    r: "",
  },
  "MAYO-UNO-24_COMENTADO_159": {
    oldC: "b", topic: "Técnicas subjetivas", c: "b", v: "REVISAR_FUENTE",
    e: "¿Cuál de las siguientes técnicas de evaluación narrativa cuenta con restricciones al texto?",
    o: {
      a: "Proyecto vital.",
      b: "Historias de vida.",
      c: "Análisis textual.",
      d: "Clasificación Q.",
    },
    x: "Se ha retirado la justificación que aparecía dentro de la alternativa d. La clave y la delimitación de las técnicas narrativas quedan pendientes de contraste en una fuente original antes de validarse.",
    r: "",
  },
  "MAYO-UNO-24_COMENTADO_163": {
    oldC: "b", topic: "Técnicas subjetivas", c: "b", v: "REVISAR_FUENTE",
    e: "Señale la afirmación correcta sobre la técnica de la rejilla:",
    o: {
      a: "La persona puntúa los elementos según cada constructo mediante una escala Likert de cinco puntos.",
      b: "No parte de un conjunto fijo de ítems; se construye con la persona evaluada y suele aplicarse mediante una entrevista estructurada.",
      c: "Es un procedimiento totalmente estandarizado, igual que otras pruebas psicológicas.",
      d: "Los elementos surgen de comparar los constructos entre sí.",
    },
    x: "Se ha eliminado la duplicación y se ha reubicado el ítem entre las técnicas subjetivas. La formulación, la clave y la referencia quedan pendientes de contraste con la fuente primaria de la técnica de la rejilla antes de validarse.",
    r: "",
  },
};

const questions = JSON.parse(fs.readFileSync(bancoPath, "utf8"));
const missing = Object.keys(reviews).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const finalQuestions = questions.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.c !== review.oldC) throw new Error(`La clave previa de ${question.id} no coincide con la auditoría.`);
  const finalQuestion = {
    ...question,
    s: SUBJECT,
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
});

if (finalQuestions.length !== questions.length) throw new Error("La auditoría alteraría el número de preguntas.");
const ids = new Set(finalQuestions.map((question) => question.id));
if (ids.size !== finalQuestions.length) throw new Error("La auditoría introduciría IDs duplicados.");
const updated = finalQuestions.filter((question) => Object.hasOwn(reviews, question.id));
if (updated.length !== Object.keys(reviews).length) throw new Error("No se aplicaron todas las revisiones.");

fs.writeFileSync(bancoPath, `${JSON.stringify(finalQuestions)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Evaluación 01 — autoinformes, observación, técnicas objetivas y psicometría",
  updated: updated.length,
  primarySourceValidated: updated.filter((question) => question.v === "CORREGIDA").length,
  pendingPrimarySource: updated.filter((question) => question.v === "REVISAR_FUENTE").length,
  preservedQuestionIds: true,
}, null, 2));
