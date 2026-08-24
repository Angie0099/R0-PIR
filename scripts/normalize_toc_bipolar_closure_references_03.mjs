import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const reportsDir = path.join(appDir, "analysis", "audit_reports");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data) + "\n", "utf8");
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const manifest = read(path.join(bancoDir, "manifest.json"));
const report = read(path.join(reportsDir, "toc_bipolares_pendientes_cierre.json"));
const clinicalPath = path.join(bancoDir, `${manifest.subjects["Psicología Clínica"].slug}.json`);
const clinical = read(clinicalPath);
const sourceMap = report.sources || {};
const correctedRecords = [...report.toc_records, ...report.bipolar_records].filter((record) => record.V === "CORREGIDA");

const expandReference = (reference) => {
  let value = clean(reference);
  for (const [alias, full] of Object.entries(sourceMap).sort((a, b) => b[0].length - a[0].length)) {
    value = value.split(alias).join(clean(full).replace(/[.]+$/, ""));
  }
  value = clean(value.replace(/\s*;\s*/g, "; "));
  return /[.!?]$/.test(value) ? value : `${value}.`;
};

const recordById = new Map(correctedRecords.map((record) => [record.id, record]));
let changed = 0;
const next = clinical.map((question) => {
  const record = recordById.get(question.id);
  if (!record) return question;
  const reference = expandReference(record.R);
  if (question.r === reference) return question;
  changed += 1;
  return { ...question, r: reference };
});
if (recordById.size !== 90) throw new Error("El cierre debe contener exactamente 90 referencias corregidas.");
if (new Set(next.map((question) => question.id)).size !== next.length) throw new Error("Se han detectado IDs duplicados.");
for (const record of correctedRecords) {
  const question = next.find((candidate) => candidate.id === record.id);
  if (!question?.r || /(?:\.\.|\.\s*;|pp\.\s*\d+(?:-\d+)?\.,)/.test(question.r)) {
    throw new Error(`Referencia no normalizada: ${record.id}`);
  }
}
write(clinicalPath, next);
console.log(JSON.stringify({ normalizedReferences: changed, total: next.length }, null, 2));
