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

move('JULIO1_108', 'Psicopatología Infantil', 'Trastornos psicóticos infantojuveniles');
move('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_144', 'Psicopatología Infantil', 'Trastorno por déficit de atención con hiperactividad (TDAH)');
move('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_180', 'Psicopatología Infantil', 'Trastornos psicóticos infantojuveniles');
move('PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_040', 'Psicología Clínica', 'Sistemas clasificatorios en psicopatología');
move('PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_063', 'Psicología Clínica', 'Trastornos neurocognitivos');
move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_047', 'Psicología Clínica', 'Trastornos del sueño-vigilia');
move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_050', 'Psicología Clínica', 'Trastornos relacionados con traumas y factores de estrés');
move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_080', 'Psicología Clínica', 'Trastornos de la personalidad');
move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_135', 'Psicopatología Infantil', 'Trastornos psicóticos infantojuveniles');
move('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_084', 'Psicología Clínica', 'Trastornos disociativos');
move('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_089', 'Psicología Clínica', 'Trastornos de ansiedad');
move('PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_082', 'Psicología Clínica', 'Trastornos de síntomas somáticos y relacionados');
move('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_089', 'Psicopatología Infantil', 'Trastornos psicóticos infantojuveniles');
move('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_025', 'Psicología Clínica', 'Psicopatología de la afectividad');
move('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_026', 'Psicopatología Infantil', 'Trastornos de la comunicación');
move('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_093', 'Psicología Clínica', 'Trastornos adictivos y comportamentales');
move('SM_ABRIL_1_SOL_1_024', 'Psicología Clínica', 'Psicopatología de la sensopercepción');
move('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_201', 'Psicología Clínica', 'Sistemas clasificatorios en psicopatología');

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Reubicadas 18 preguntas ajenas a Psicosis.');
