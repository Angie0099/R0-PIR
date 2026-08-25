import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const bancoDir = path.join(appDir, "public", "banco");
const report = JSON.parse(fs.readFileSync(path.join(appDir, "analysis", "audit_reports", "clinica_adulta_ca05_personalidad_somaticos.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(bancoDir, "manifest.json"), "utf8"));
const options = ["a", "b", "c", "d"];
const clean = (value) => String(value ?? "").normalize("NFC").replace(/\u00ad/g, "").replace(/[‐‑]/g, "-").replace(/\s+/g, " ").trim();
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const fail = (message) => { throw new Error(message); };

const current = [];
const before = [];
for (const details of Object.values(manifest.subjects)) {
  current.push(...JSON.parse(fs.readFileSync(path.join(bancoDir, `${details.slug}.json`), "utf8")));
  before.push(...JSON.parse(execFileSync("git", ["-C", appDir, "show", `HEAD:public/banco/${details.slug}.json`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })));
}
const currentById = new Map(current.map((question) => [question.id, question]));
const beforeById = new Map(before.map((question) => [question.id, question]));
if (current.length !== manifest.total || currentById.size !== current.length || beforeById.size !== before.length || before.length !== current.length) {
  fail("El total o la unicidad de IDs no es consistente.");
}

const expectedIds = new Set();
const register = (id) => {
  if (expectedIds.has(id)) fail(`ID repetido en el informe: ${id}`);
  expectedIds.add(id);
};
for (const item of report.entries) register(item.id);
for (const group of report.relocation_map) for (const id of group.ids) register(id);
for (const group of report.holds) for (const id of group.ids) register(id);
if (expectedIds.size !== 253) fail(`Cobertura inesperada del informe: ${expectedIds.size}.`);

const unchangedUserFields = (beforeQuestion, afterQuestion, id) => {
  const changed = new Set(["s", "t", "e", "o", "c", "x", "r", "v"]);
  const keys = new Set([...Object.keys(beforeQuestion), ...Object.keys(afterQuestion)]);
  for (const key of keys) {
    if (!changed.has(key) && !equal(beforeQuestion[key], afterQuestion[key])) fail(`Dato de progreso alterado: ${id}.${key}`);
  }
};

for (const item of report.entries) {
  const question = currentById.get(item.id);
  const original = beforeById.get(item.id);
  if (!question || !original) fail(`Falta el ID seguro ${item.id}.`);
  const fields = item.fields_to_store;
  if (question.s !== item.destination.s || !equal(question.t, item.destination.t) || question.v !== fields.v) fail(`Destino o estado incorrecto: ${item.id}`);
  if (clean(question.e) !== clean(fields.e) || clean(question.c) !== clean(fields.c) || clean(question.x) !== clean(fields.x) || clean(question.r) !== clean(fields.r)) fail(`Campo seguro distinto del informe: ${item.id}`);
  for (const key of options) if (clean(question.o?.[key]) !== clean(fields.o?.[key])) fail(`Alternativa segura distinta: ${item.id}.${key}`);
  if (!options.includes(question.c) || !question.x || !question.r) fail(`Payload seguro incompleto: ${item.id}`);
  unchangedUserFields(original, question, item.id);
}
for (const group of report.relocation_map) {
  for (const id of group.ids) {
    const question = currentById.get(id);
    const original = beforeById.get(id);
    if (!question || !original) fail(`Falta el ID reubicado ${id}.`);
    if (question.s !== group.destination.s || !equal(question.t, group.destination.t) || question.v !== "REVISAR") fail(`Reubicación incorrecta: ${id}`);
    for (const key of ["e", "o", "c", "x", "r"]) if (!equal(question[key], original[key])) fail(`Campo no seguro alterado: ${id}.${key}`);
    unchangedUserFields(original, question, id);
  }
}
for (const group of report.holds) {
  for (const id of group.ids) {
    const question = currentById.get(id);
    const original = beforeById.get(id);
    if (!question || !original) fail(`Falta el ID pendiente ${id}.`);
    if (question.s !== "Psicología Clínica" || !equal(question.t, [group.source_topic]) || question.v !== "REVISAR") fail(`Pendiente mal marcado: ${id}`);
    for (const key of ["e", "o", "c", "x", "r"]) if (!equal(question[key], original[key])) fail(`Campo pendiente alterado: ${id}.${key}`);
    unchangedUserFields(original, question, id);
  }
}

const realCounts = new Map();
for (const question of current) realCounts.set(question.s, (realCounts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) if ((realCounts.get(subject) || 0) !== details.count) fail(`Count del manifest incorrecto: ${subject}`);

console.log(JSON.stringify({
  verified: true,
  total: current.length,
  uniqueIds: currentById.size,
  safe: report.entries.length,
  reclassifiedForReview: report.relocation_map.flatMap((group) => group.ids).length,
  heldForReview: report.holds.flatMap((group) => group.ids).length,
  preservedProgressFields: expectedIds.size,
}, null, 2));
