import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map((q) => [q.id, q]));
const move = (id, subject, topic) => {
  const q = byId.get(id);
  if (!q) throw new Error(`No encontrada: ${id}`);
  q.s = subject;
  q.t = [topic];
  q.v = 'REVISAR';
};

move('SM_DICIEMBRE_2_SOL_1_057', 'Psicología Clínica', 'Trastornos relacionados con traumas y factores de estrés');
move('SM_ENERO_1_SOL_1_104', 'Psicología Clínica', 'Psicopatología de la conducta motora');
move('SM_ENERO_1_SOL_1_107', 'Psicología Clínica', 'Psicopatología de la afectividad');
move('SM_ENERO_1_SOL_1_190', 'Psicopatología Infantil', 'Trastornos de ansiedad infantojuveniles');
move('SM_JULIO_1_SOL_1_022', 'Psicología Clínica', 'Trastornos del sueño-vigilia');
move('SM_JULIO_1_SOL_1_034', 'Psicología Clínica', 'Sistemas clasificatorios en psicopatología');
move('SM_JULIO_1_SOL_1_030', 'Psicología Clínica', 'Psicopatología del pensamiento');

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Reubicadas 7 preguntas ajenas a Psicosis.');
