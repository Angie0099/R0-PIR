import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicologia_clinica.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const edits = {
  JUNIO1_092: {
    t: ["Trastornos de ansiedad"],
    e: "Indique la afirmación correcta sobre el trastorno de ansiedad por separación (TAS), según el DSM-5-TR.",
    o: {
      a: "La prevalencia del TAS aumenta desde la infancia hasta la adolescencia y la edad adulta, y es el trastorno de ansiedad más prevalente después de los 12 años.",
      b: "La heredabilidad estimada es del 73 % en una muestra comunitaria de gemelos de 6 años, con cifras más altas en las niñas.",
      c: "Los niños manifiestan más reticencia o evitación a asistir a la escuela, mientras que las niñas muestran una expresión más indirecta del miedo a la separación.",
      d: "En niños, el TAS es muy comórbido con el trastorno de ansiedad generalizada y el trastorno de ansiedad social.",
    },
    c: "b",
    x: "El DSM-5-TR recoge una heredabilidad estimada del 73 % en una muestra comunitaria de gemelos de 6 años, con cifras más altas en las niñas. La prevalencia disminuye desde la infancia y la comorbilidad infantil característica incluye, entre otros, la fobia específica.",
    r: `${dsm} Trastorno de ansiedad por separación: factores de riesgo y pronóstico, p. 219.`,
    v: "VALIDADA_ORIGINAL",
  },
  SM_ENERO_1_SOL_1_077: {
    t: ["Trastornos de ansiedad"],
    e: "Una persona teme viajar en avión, pero no teme ninguna otra situación de agorafobia. ¿Cuál es el diagnóstico más apropiado?",
    o: {
      a: "Fobia específica, tipo situacional.",
      b: "Agorafobia.",
      c: "Trastorno bipolar.",
      d: "Trastorno obsesivo-compulsivo.",
    },
    c: "a",
    x: "Cuando el miedo se limita a una sola situación agorafóbica —en este caso, el transporte público— se establece el diagnóstico de fobia específica, tipo situacional. La agorafobia suele requerir miedo o ansiedad ante dos o más situaciones agorafóbicas.",
    r: `${dsm} Agorafobia: diagnóstico diferencial con fobia específica, p. 249.`,
    v: "VALIDADA_ORIGINAL",
  },
  SM_ABRIL_1_SOL_1_046: {
    t: ["Trastornos del sueño-vigilia"],
    e: "Señale la afirmación correcta acerca de los trastornos del ritmo circadiano de sueño-vigilia.",
    o: {
      a: "El tipo de fases de sueño avanzadas es más frecuente en personas jóvenes.",
      b: "En el tipo de sueño-vigilia irregular el sueño está fragmentado en, al menos, cuatro períodos a lo largo de las 24 horas.",
      c: "La ceguera y el tipo de sueño-vigilia no ajustado a 24 horas suelen coexistir; los trastornos depresivos y bipolares también pueden asociarse a aislamiento social.",
      d: "La confirmación del diagnóstico de trastorno del ritmo circadiano tipo fase de sueño retrasada se basa únicamente en la historia clínica.",
    },
    c: "c",
    x: "El tipo no ajustado a 24 horas es especialmente frecuente en personas ciegas. El DSM-5-TR también describe la asociación de los trastornos afectivos con aislamiento social; las demás opciones alteran datos diagnósticos o de curso.",
    r: `${dsm} Trastornos del ritmo circadiano de sueño-vigilia, p. 450.`,
    v: "VALIDADA_ORIGINAL",
  },
  SM_AGOSTO_1_SOL_1_051: {
    t: ["Trastornos del sueño-vigilia"],
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones acerca del trastorno de insomnio es verdadera?",
    o: {
      a: "Pueden aparecer alteraciones diurnas, entre ellas la fatiga o, más frecuentemente, la somnolencia diurna.",
      b: "Existe una mejor preservación de la continuidad del sueño y del sueño de ondas lentas en los hombres mayores frente a las mujeres mayores.",
      c: "El insomnio persistente se asocia a un mayor riesgo de trastorno depresivo mayor, hipertensión e infarto de miocardio.",
      d: "Las personas con trastorno de insomnio suelen presentar trastorno bipolar, trastorno depresivo y trastorno por consumo de sustancias como comorbilidades principales.",
    },
    c: "c",
    x: "El DSM-5-TR asocia el insomnio persistente a mayor riesgo de trastorno depresivo mayor, hipertensión e infarto de miocardio. La somnolencia diurna es menos frecuente que la fatiga; se describe una mejor preservación del sueño en mujeres mayores y la ansiedad, no el consumo de sustancias, figura entre las comorbilidades frecuentes.",
    r: `${dsm} Trastorno de insomnio: consecuencias funcionales y comorbilidad, p. 415.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm11PIR2025_157: {
    t: ["Trastornos del sueño-vigilia"],
    e: "¿Qué trastorno del ritmo circadiano de sueño-vigilia se produce aproximadamente en el 50 % de las personas invidentes?",
    o: {
      a: "Tipo no ajustado a 24 horas.",
      b: "Tipo asociado a turnos de trabajo.",
      c: "Tipo de sueño-vigilia irregular.",
      d: "Tipo de fases de sueño avanzadas.",
    },
    c: "a",
    x: "El trastorno del ritmo circadiano de sueño-vigilia tipo no ajustado a 24 horas es más frecuente entre las personas invidentes; el DSM-5-TR estima que se produce en aproximadamente el 50 % de ellas.",
    r: `${dsm} Trastorno del ritmo circadiano de sueño-vigilia, tipo no ajustado a 24 horas: prevalencia, p. 449.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_052: {
    t: ["Trastornos del sueño-vigilia"],
    e: "Según el DSM-5-TR, ¿en qué categoría diagnóstica se incluye el síndrome de las piernas inquietas?",
    o: {
      a: "Trastornos del sueño-vigilia.",
      b: "Trastornos de ansiedad.",
      c: "Trastornos obsesivo-compulsivos y relacionados.",
      d: "Trastornos neurocognitivos.",
    },
    c: "a",
    x: "El DSM-5-TR incluye el síndrome de las piernas inquietas en el capítulo de trastornos del sueño-vigilia y le dedica criterios diagnósticos específicos. Las opciones restantes no son su categoría diagnóstica.",
    r: `${dsm} Síndrome de las piernas inquietas, pp. 464-465.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 11 comentado_039": {
    t: ["Trastornos de la personalidad"],
    e: "¿Qué trastornos de la personalidad integran el grupo B (dramáticos, emocionales o erráticos) del DSM-5-TR?",
    o: {
      a: "Antisocial, límite, histriónico y narcisista.",
      b: "Antisocial, límite, dependiente y narcisista.",
      c: "Evitativo, histriónico, dependiente y narcisista.",
      d: "Histriónico, límite, dependiente y evitativo.",
    },
    c: "a",
    x: "El grupo B está formado por los trastornos de la personalidad antisocial, límite, histriónico y narcisista. Los trastornos dependiente y evitativo pertenecen al grupo C.",
    r: `${dsm} Trastornos de la personalidad: grupos A, B y C, p. 734.`,
    v: "VALIDADA_ORIGINAL",
  },
  SM_JULIO_1_SOL_1_065: {
    t: ["Trastornos neurocognitivos"],
    e: "¿En cuál de los siguientes trastornos neurocognitivos suele haber un inicio insidioso, una progresión gradual y una variante conductual o del lenguaje?",
    o: {
      a: "Trastorno neurocognitivo debido a enfermedad de Alzheimer.",
      b: "Trastorno neurocognitivo vascular.",
      c: "Trastorno neurocognitivo con cuerpos de Lewy.",
      d: "Trastorno neurocognitivo frontotemporal.",
    },
    c: "d",
    x: "El trastorno neurocognitivo frontotemporal presenta un inicio insidioso y una progresión gradual. Puede predominar una variante conductual o una variante del lenguaje, a diferencia de los perfiles clínicos característicos de las otras alternativas.",
    r: `${dsm} Trastorno neurocognitivo frontotemporal: criterios y variantes, pp. 695-696.`,
    v: "VALIDADA_ORIGINAL",
  },
  "PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_027": {
    t: ["Trastornos adictivos con sustancia"],
    e: "¿La abstinencia de qué sustancia puede producir humor disfórico, lagrimeo o rinorrea, dilatación pupilar, piloerección, diarrea y bostezos?",
    o: {
      a: "Alucinógenos.",
      b: "Estimulantes.",
      c: "Inhalantes.",
      d: "Opiáceos.",
    },
    c: "d",
    x: "El síndrome de abstinencia de opiáceos incluye disforia, lagrimeo o rinorrea, midriasis, piloerección, diarrea y bostezos, entre otros síntomas. El perfil de abstinencia de los estimulantes es distinto.",
    r: `${dsm} Abstinencia de opiáceos: criterios diagnósticos, p. 617.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 32 comentado hardcore 2_074": {
    t: ["Trastornos de la personalidad"],
    e: "El modelo alternativo de los trastornos de la personalidad propuesto en la Sección III del DSM-5-TR plantea:",
    o: {
      a: "Diagnosticar únicamente sobre la base de categorías cerradas y mantener los diez trastornos tradicionales.",
      b: "Considerar el deterioro del funcionamiento de la personalidad y la presencia de rasgos patológicos.",
      c: "Sustituir los trastornos de la personalidad por un único diagnóstico dimensional de gravedad psicopatológica.",
      d: "Valorar exclusivamente la presencia de rasgos de los cinco grandes factores de personalidad.",
    },
    c: "b",
    x: "El modelo alternativo requiere valorar dos componentes: el nivel de funcionamiento de la personalidad (criterio A) y los rasgos patológicos de personalidad (criterio B). No se limita a categorías cerradas ni a los cinco grandes factores.",
    r: `${dsm} Modelo alternativo para los trastornos de la personalidad, p. 882.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm10PIR2025_039: {
    t: ["Trastornos de la personalidad"],
    e: "Según el DSM-5-TR, ¿cuál de los siguientes trastornos de la personalidad pertenece al grupo B?",
    o: {
      a: "Trastorno de la personalidad histriónica.",
      b: "Trastorno de la personalidad esquizoide.",
      c: "Trastorno de la personalidad por evitación.",
      d: "Trastorno de la personalidad obsesivo-compulsiva.",
    },
    c: "a",
    x: "El trastorno de la personalidad histriónica pertenece al grupo B. El esquizoide se incluye en el grupo A y los trastornos por evitación y obsesivo-compulsivo de la personalidad en el grupo C.",
    r: `${dsm} Trastornos de la personalidad: grupos A, B y C, p. 734.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm21PIR2025 (2)_001": {
    t: ["Trastornos neurocognitivos"],
    e: "¿Qué nivel de gravedad actual corresponde a un paciente con trastorno neurocognitivo mayor que necesita ayuda para comer, por ejemplo, porque requiere adaptar o triturar los alimentos?",
    o: {
      a: "Leve.",
      b: "Moderado.",
      c: "Grave.",
      d: "No puede determinarse la gravedad a partir de las dificultades en las actividades de la vida diaria.",
    },
    c: "b",
    x: "En el trastorno neurocognitivo mayor, la gravedad moderada implica dificultades para las actividades básicas de la vida diaria, como la alimentación. La necesidad de ayuda para comer corresponde, por tanto, al nivel moderado.",
    r: `${dsm} Trastorno neurocognitivo mayor: especificación de gravedad, p. 679.`,
    v: "VALIDADA_ORIGINAL",
  },
};

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
if (questions.length !== idsBefore.size) throw new Error("El banco ya contenía identificadores duplicados.");

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
  block: "Clínica 02 — reubicación y validación DSM-5-TR",
  validated: Object.keys(edits).length,
  preservedQuestionCount: next.length,
  preservedQuestionIds: true,
  correctedIds: Object.keys(edits),
}, null, 2));
