import fs from "node:fs";
import path from "node:path";
import { PIR_TOPIC_ORDER } from "../src/pirRoadmap.js";

const bankDir = path.resolve("public/banco");
const manifestFile = path.join(bankDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const beforeTotal = manifest.total;
const allBefore = [];
for (const meta of Object.values(manifest.subjects)) allBefore.push(...JSON.parse(fs.readFileSync(path.join(bankDir, `${meta.slug}.json`), "utf8")));
const beforeIds = new Set(allBefore.map(q => q.id));

const orderTopics = (subject, available) => {
  const route = PIR_TOPIC_ORDER[subject] || [];
  const present = new Set(available);
  return [...route.filter(topic => present.has(topic)), ...available.filter(topic => !route.includes(topic))];
};

for (const [subject, meta] of Object.entries(manifest.subjects)) {
  const file = path.join(bankDir, `${meta.slug}.json`);
  const questions = JSON.parse(fs.readFileSync(file, "utf8"));
  const available = [...new Set(questions.flatMap(q => q.t || []))];
  meta.topics = orderTopics(subject, available);
  const rank = new Map(meta.topics.map((topic, index) => [topic, index]));
  questions.sort((a, b) => {
    const topicRank = (rank.get(a.t?.[0]) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.t?.[0]) ?? Number.MAX_SAFE_INTEGER);
    return topicRank || String(a.id).localeCompare(String(b.id), "es");
  });
  fs.writeFileSync(file, JSON.stringify(questions) + "\n");
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
const allAfter = [];
for (const meta of Object.values(manifest.subjects)) allAfter.push(...JSON.parse(fs.readFileSync(path.join(bankDir, `${meta.slug}.json`), "utf8")));
const afterIds = new Set(allAfter.map(q => q.id));
if (allAfter.length !== beforeTotal || afterIds.size !== beforeIds.size || [...beforeIds].some(id => !afterIds.has(id))) {
  throw new Error("La ordenación alteraría el total o los IDs del banco.");
}
console.log(JSON.stringify({ total:allAfter.length, uniqueIds:afterIds.size, orderedSubjects:Object.keys(manifest.subjects).length,
  topics:Object.fromEntries(Object.entries(manifest.subjects).map(([subject, meta]) => [subject, meta.topics.length])) }, null, 2));
