import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => { if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))); return files.get(name); };
const source = load('psicopatologia.json');
const topic = 'Modelos en psicopatología';
const before = source.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').length;
const move = (id, file, subject, destinationTopic) => {
  const i = source.findIndex((q) => q.id === id); if (i < 0) throw new Error(id);
  const [q] = source.splice(i, 1); q.s = subject; q.t = [destinationTopic];
  const target = load(file); if (target !== source && target.some((row) => row.id === id)) throw new Error(`Duplicado ${id}`); target.push(q);
};

move('3Simulacro2018Comentarios_206','psicopatologia.json','Psicopatología','Sistemas clasificatorios en psicopatología');
move('4Simulacro02018Comentarios_007','psicoterapias.json','Psicoterapias','Terapia de grupo y psicodrama');
move('SmCm10PIR2025_054','clinica_adultos.json','Clínica Adultos','Disfunciones sexuales');

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json'); const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ before, movedUnchanged: 3, removedDuplicates: 0, after: source.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').length }));
