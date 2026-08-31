import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map((q) => [q.id, q]));
for (const id of [
  'SM_DICIEMBRE_2_SOL_1_056',
  'SM_DICIEMBRE_2_SOL_1_075',
  'SM_ENERO_1_SOL_1_073',
]) {
  const q = byId.get(id);
  if (!q) throw new Error(`No encontrada: ${id}`);
  q.t = ['Psicopatología del pensamiento'];
}
fs.writeFileSync(path, JSON.stringify(bank));
console.log('Reubicadas 3 preguntas de teoría del delirio.');
