import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const sourcePath = path.join(bancoDir, "tratamientos_adultos.json");
const targetPath = path.join(bancoDir, "psicopatologia_infantil.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const SOURCE = "Tratamientos Adultos";
const TARGET = "Psicopatología Infantil";
const ID = "SmCm3PIR2024_192";
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const corrected = {
  s: TARGET,
  t: ["Trastorno del espectro del autismo (TEA)"],
  e: "En el diagnóstico diferencial entre el trastorno del espectro autista (TEA) y el trastorno de la comunicación social (pragmático), ¿cuál es la afirmación correcta?",
  o: {
    a: "Los patrones de comportamiento, intereses o actividades restringidos y repetitivos se presentan en el TEA y están ausentes en el trastorno de la comunicación social (pragmático).",
    b: "El trastorno de la comunicación social se puede diagnosticar si hubo patrones restrictivos o repetitivos en etapas previas, aunque ya no estén presentes.",
    c: "En el mutismo selectivo la reciprocidad social está deteriorada y se presentan patrones de comportamiento restringidos o repetitivos.",
    d: "Las dificultades de comunicación social sin patrones restrictivos o repetitivos exigen siempre un diagnóstico de TEA.",
  },
  c: "a",
  x: "El TEA se diferencia del trastorno de la comunicación social (pragmático) por la presencia de patrones de comportamiento, intereses o actividades restringidos y repetitivos. Para diagnosticar trastorno de la comunicación social no deben cumplirse, ni actualmente ni en la historia del desarrollo, los criterios de esos patrones propios del TEA.",
  r: `${dsm} Trastorno de la comunicación social (pragmático): diagnóstico diferencial, p. 55; trastorno del espectro autista: diagnóstico diferencial, p. 66.`,
  v: "CORREGIDA",
};

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allBefore = [...source, ...target];
const occurrences = allBefore.filter((question) => question.id === ID);
if (occurrences.length !== 1) throw new Error(`Se esperaba una única pregunta ${ID}; se encontraron ${occurrences.length}.`);

const original = occurrences[0];
const finalSource = source.filter((question) => question.id !== ID);
const finalTarget = [
  ...target.filter((question) => question.id !== ID),
  { ...original, ...corrected, o: corrected.o },
];
const allAfter = [...finalSource, ...finalTarget];
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== allBefore.length || idsAfter.size !== allBefore.length || !idsAfter.has(ID)) {
  throw new Error("La corrección alteraría el total o los identificadores de preguntas.");
}
const audited = finalTarget.find((question) => question.id === ID);
if (audited.s !== TARGET || audited.t[0] !== corrected.t[0] || audited.c !== "a" || !audited.x || !audited.r || audited.v !== "CORREGIDA") {
  throw new Error("La pregunta no quedó completamente corregida.");
}

manifest.subjects[SOURCE].count = finalSource.length;
manifest.subjects[TARGET].count = finalTarget.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + Number(subject.count || 0), 0);
if (manifest.total !== 15961) throw new Error(`El manifiesto dejaría un total inesperado: ${manifest.total}.`);

fs.writeFileSync(sourcePath, `${JSON.stringify(finalSource)}\n`, "utf8");
fs.writeFileSync(targetPath, `${JSON.stringify(finalTarget)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  block: "Psicopatología Infantil 03 — diferencial TEA y comunicación social",
  moved: 1,
  corrected: ID,
  from: SOURCE,
  to: `${TARGET} / ${corrected.t[0]}`,
  preservedQuestionIds: true,
  totalBankQuestions: manifest.total,
}, null, 2));
