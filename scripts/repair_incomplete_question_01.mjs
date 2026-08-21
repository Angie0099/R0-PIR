import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicobiologia.json");
const ID = "SIM_PERS_AGO25_032";

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
const original = questions.find((question) => question.id === ID);
if (!original) throw new Error(`No se encontró la pregunta ${ID}.`);

const corrected = {
  ...original,
  e: "Según la teoría de las emociones de James-Lange, la experiencia emocional consciente se produce:",
  o: {
    a: "De manera simultánea e independiente a la respuesta fisiológica periférica.",
    b: "Antes de que ocurra cualquier cambio en el sistema nervioso autónomo.",
    c: "Como consecuencia de la percepción de los cambios fisiológicos periféricos evocados por un estímulo.",
    d: "Únicamente tras una evaluación cognitiva o «appraisal» de la situación.",
  },
  c: "c",
  x: "La teoría de James-Lange propone que la emoción consciente surge de la percepción de los cambios fisiológicos y conductuales provocados por un estímulo. Esta reparación separa el texto ajeno que había quedado incrustado en la alternativa c.",
  r: "",
  v: "REVISAR_FUENTE",
};

const next = questions.map((question) => (question.id === ID ? corrected : question));
const idsAfter = new Set(next.map((question) => question.id));
if (next.length !== questions.length || idsAfter.size !== idsBefore.size || !idsAfter.has(ID)) {
  throw new Error("La reparación modificaría el total o los identificadores de preguntas.");
}
if (!['a', 'b', 'c', 'd'].every((key) => corrected.o[key]?.trim()) || corrected.c !== 'c') {
  throw new Error("La pregunta no quedó completa.");
}
fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Reparación estructural 01",
  repaired: ID,
  validationStatus: corrected.v,
  note: "La referencia original se completará al contrastarla con el manual de Psicobiología; no se marca como validada.",
  preservedQuestionIds: true,
}, null, 2));
