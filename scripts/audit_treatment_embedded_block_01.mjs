import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const adultPath = path.join(bancoDir, "tratamientos_adultos.json");
const childPath = path.join(bancoDir, "tratamientos_infantiles.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const ADULT = "Tratamientos Adultos";
const CHILD = "Tratamientos Infantiles";

const adultEdits = {
  SmCm06PIR2025_074: {
    t: ["Tratamiento de la psicosis y esquizofrenia"],
    e: "¿Qué programa de intervención familiar para los trastornos psicóticos se orienta a reducir la vulnerabilidad del paciente ante estímulos que incrementan el riesgo de recaída?",
    o: {
      a: "Paquete de intervenciones sociofamiliares de Leff.",
      b: "Modelo psicoeducativo de Anderson.",
      c: "Intervenciones cognitivo-conductuales de Tarrier.",
      d: "Terapia familiar conductual de Falloon.",
    },
    c: "b",
    x: "El modelo psicoeducativo de Anderson se fundamenta en el modelo de vulnerabilidad-estrés y pretende reducir la vulnerabilidad ante estímulos internos y externos, así como prevenir recaídas. Leff se centra especialmente en la emoción expresada; Tarrier, en sus componentes cognitivo-conductuales; y Falloon, en habilidades conductuales estructuradas.",
    r: "Vallina Fernández, Ó. y Lemos Giráldez, S. (2001). Tratamientos psicológicos eficaces para la esquizofrenia. Psicothema, 13(3), 345-364, tabla 2, p. 347.",
    v: "CORREGIDA",
  },
  "MAYO-UNO-24_COMENTADO_110": {
    t: ["Tratamiento del trauma y TEPT"],
    e: "Respecto a la evidencia y las limitaciones de la terapia de exposición prolongada para el trastorno de estrés postraumático (TEPT), señale la afirmación incorrecta.",
    o: {
      a: "La exposición prolongada aplicada de forma masiva puede reducir la tasa de abandono a alrededor del 14 %, aumentando la probabilidad de completar el tratamiento.",
      b: "Los resultados en muestras de personal militar en activo son inferiores a los observados en muestras civiles.",
      c: "En el estudio de Foa et al. (2018), aproximadamente la mitad de los participantes mantenía el diagnóstico de TEPT al terminar el tratamiento.",
      d: "La evidencia demuestra una remisión total de los síntomas con la intervención.",
    },
    c: "d",
    x: "La opción d es incorrecta: la exposición prolongada puede reducir los síntomas, pero no garantiza una remisión total. En Foa et al. (2018), aproximadamente entre el 51 % y el 60 % de los participantes mantenía el diagnóstico tras el tratamiento según la condición; Schnurr y Lunney encontraron además síntomas residuales frecuentes, especialmente de hiperactivación.",
    r: "Foa, E. B., McLean, C. P., Zang, Y., et al. (2018). Effect of Prolonged Exposure Therapy Delivered Over 2 Weeks vs 8 Weeks vs Present-Centered Therapy on PTSD Symptom Severity in Military Personnel. JAMA, 319(4), 354-364. https://doi.org/10.1001/jama.2017.21242; Schnurr, P. P. y Lunney, C. A. (2019). Residual symptoms following prolonged exposure and present-centered therapy for PTSD in female veterans and soldiers. Depression and Anxiety, 36(2), 162-169. https://doi.org/10.1002/da.22871",
    v: "CORREGIDA",
  },
};

const childEdits = {
  SmCm3PIR2024_195: {
    s: CHILD,
    t: ["Trastornos del sueño infantojuvenil"],
    e: "¿Cuál de las siguientes no forma parte de las tres fases de la terapia de ensayo en imaginación (Imagery Rehearsal Therapy, IRT) para las pesadillas?",
    o: {
      a: "El niño o la niña completa el diario de intervención.",
      b: "En un estado de relajación, ensaya mentalmente y visualiza una versión modificada de la pesadilla.",
      c: "El niño o la niña recuerda la pesadilla de la noche anterior y modifica su contenido como desee.",
      d: "Se trabajan en imaginación sesgos cognitivos y significados biográficos del contenido de las pesadillas.",
    },
    c: "d",
    x: "La IRT infantil comprende recordar y modificar la pesadilla, ensayar mentalmente la nueva versión en relajación y completar un diario de intervención. El trabajo sobre sesgos cognitivos y significados biográficos no es una fase de este protocolo.",
    r: "Fonseca-Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Infancia y adolescencia. Pirámide. Capítulo «Tratamientos psicológicos para los trastornos del sueño en la infancia y adolescencia».",
    v: "CORREGIDA",
  },
  JULIO2_180: {
    s: CHILD,
    t: ["Trastornos depresivos y bipolares infantojuvenil"],
    e: "La guía NICE formula recomendaciones para la depresión moderada-grave en niños y jóvenes. ¿Qué intervención se considera una opción psicoterapéutica para menores de 5 a 11 años?",
    o: {
      a: "Terapia familiar focalizada en el apego o de orientación sistémica.",
      b: "Psicoterapia de orientación psicodinámica.",
      c: "Intervención psicosocial breve.",
      d: "Psicoterapia interpersonal para adolescentes (IPT-A).",
    },
    c: "b",
    x: "Para menores de 5 a 11 años, NICE incluye como opciones la psicoterapia interpersonal familiar, la terapia familiar adaptada a la depresión infantil, la psicoterapia psicodinámica y la TCC individual. La terapia familiar focalizada en el apego, la intervención psicosocial breve y la IPT-A figuran como alternativas para adolescentes de 12 a 18 años cuando la TCC individual no es adecuada o suficiente.",
    r: "Inchausti, F. (2021). Tratamientos psicológicos para la depresión en la infancia y adolescencia. En E. Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Infancia y adolescencia (pp. 501-526). Pirámide, p. 514.",
    v: "CORREGIDA",
  },
};

const adult = JSON.parse(fs.readFileSync(adultPath, "utf8"));
const child = JSON.parse(fs.readFileSync(childPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...adult, ...child];
const occurrences = new Map();
for (const question of allBefore) occurrences.set(question.id, (occurrences.get(question.id) || 0) + 1);
if ([...occurrences.values()].some((count) => count !== 1)) throw new Error("Hay identificadores duplicados entre tratamientos de adultos e infantiles.");
const allEdits = { ...adultEdits, ...childEdits };
const missing = Object.keys(allEdits).filter((id) => !occurrences.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const finalAdult = adult
  .filter((question) => !Object.hasOwn(childEdits, question.id))
  .map((question) => {
    const edit = adultEdits[question.id];
    return edit ? { ...question, ...edit, o: edit.o } : question;
  });
const movedToChild = allBefore
  .filter((question) => Object.hasOwn(childEdits, question.id))
  .map((question) => ({ ...question, ...childEdits[question.id], o: childEdits[question.id].o }));
const finalChild = [
  ...child.filter((question) => !Object.hasOwn(childEdits, question.id)),
  ...movedToChild,
];

const allAfter = [...finalAdult, ...finalChild];
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length) {
  throw new Error("La auditoría alteraría el total o los identificadores de preguntas.");
}
for (const [id, edit] of Object.entries(allEdits)) {
  const question = allAfter.find((candidate) => candidate.id === id);
  if (question.c !== edit.c || !question.x || !question.r || question.v !== "CORREGIDA") {
    throw new Error(`La corrección de ${id} no está completa.`);
  }
}

manifest.subjects[ADULT].count = finalAdult.length;
manifest.subjects[CHILD].count = finalChild.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(adultPath, `${JSON.stringify(finalAdult)}\n`, "utf8");
fs.writeFileSync(childPath, `${JSON.stringify(finalChild)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Tratamientos 01 — recuperación de respuestas contaminadas",
  corrected: Object.keys(allEdits).length,
  movedToChildTreatments: Object.keys(childEdits).length,
  adultQuestions: finalAdult.length,
  childTreatmentQuestions: finalChild.length,
  preservedQuestionIds: true,
}, null, 2));
