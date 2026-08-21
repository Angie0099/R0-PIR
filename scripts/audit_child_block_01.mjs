import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const edits = {
  SmCm06PIR2025_189: {
    e: "Que un niño con TDAH pierda con frecuencia cosas necesarias para las tareas o actividades es un síntoma de:",
    o: {
      a: "Inatención.",
      b: "Hiperactividad.",
      c: "Impulsividad.",
      d: "Trastorno negativista desafiante.",
    },
    c: "a",
    x: "Perder con frecuencia objetos necesarios para tareas o actividades figura entre los síntomas de inatención del TDAH. No pertenece al grupo de hiperactividad-impulsividad ni constituye un criterio de trastorno negativista desafiante.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: criterios diagnósticos, p. 68.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm22PIR2025 (1)_165": {
    e: "Según el DSM-5-TR, ¿cuál de los siguientes requisitos de inicio forma parte del diagnóstico del TDAH?",
    o: {
      a: "Que los síntomas estén presentes antes de los 6 años.",
      b: "Que varios síntomas de inatención o hiperactividad-impulsividad estuvieran presentes antes de los 12 años.",
      c: "Que los síntomas se inicien antes de los 18 años.",
      d: "No se exige un requisito de edad de inicio.",
    },
    c: "b",
    x: "El criterio B del DSM-5-TR exige que varios síntomas de inatención o de hiperactividad-impulsividad estuvieran presentes antes de los 12 años. El diagnóstico no puede establecerse si no hubo ningún síntoma antes de esa edad.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: criterios diagnósticos y características diagnósticas, pp. 69-70.`,
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
if (next.length !== questions.length || idsAfter.size !== idsBefore.size) {
  throw new Error("La auditoría modificaría el número o los identificadores de preguntas.");
}
for (const id of Object.keys(edits)) {
  const question = next.find((candidate) => candidate.id === id);
  if (question.v !== "VALIDADA_ORIGINAL" || !question.x || !question.r) {
    throw new Error(`La validación de ${id} no está completa.`);
  }
}

fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 01 — limpieza y validación DSM-5-TR",
  validated: Object.keys(edits).length,
  restoredToVisibleBank: Object.keys(edits).length,
  preservedQuestionIds: true,
}, null, 2));
