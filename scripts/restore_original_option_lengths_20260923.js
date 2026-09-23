import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankRoot = path.join(appRoot, 'public', 'banco');
const git = 'C:\\Users\\angy-\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\git\\cmd\\git.exe';

const specs = [
  {
    file: 'tratamientos_adultos.json',
    topic: 'Tratamiento de los trastornos de ansiedad',
    baseline: '0dab9d7^',
  },
  {
    file: 'psicopatologia.json',
    topic: 'Modelos en psicopatología',
    baseline: 'f30f3b3^',
  },
  {
    file: 'psicopatologia.json',
    topic: 'Psicopatología de la sensopercepción',
    baseline: '45db2ae^',
  },
];

const cleanOcr = (value) => String(value)
  .normalize('NFC')
  .replace(/[�]/g, '')
  .replace(/\bPSICOLOGÍA\s+(?:AMIR|AMI|AM|A)\b/gi, '')
  .replace(/\bMIR\b/g, '')
  .replace(/\u00ad/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const currentByFile = new Map();
const getCurrent = (name) => {
  if (!currentByFile.has(name)) {
    currentByFile.set(name, JSON.parse(fs.readFileSync(path.join(bankRoot, name), 'utf8')));
  }
  return currentByFile.get(name);
};

const report = [];
for (const spec of specs) {
  const original = JSON.parse(execFileSync(
    git,
    ['show', `${spec.baseline}:public/banco/${spec.file}`],
    { cwd: appRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ));
  const originalById = new Map(original.map((q) => [q.id, q]));
  const current = getCurrent(spec.file);
  let restored = 0;
  for (const q of current) {
    if (!q.t?.includes(spec.topic) || q.v !== 'VALIDADA_ORIGINAL') continue;
    const old = originalById.get(q.id);
    if (!old || old.v === 'VALIDADA_ORIGINAL' || !old.e || !old.o) continue;
    q.e = cleanOcr(old.e);
    q.o = Object.fromEntries(Object.entries(old.o).map(([key, value]) => [key, cleanOcr(value)]));
    restored += 1;
  }
  report.push({ topic: spec.topic, restored });
}

for (const [name, rows] of currentByFile) {
  fs.writeFileSync(path.join(bankRoot, name), JSON.stringify(rows));
}

console.log(JSON.stringify(report));
