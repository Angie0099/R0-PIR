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

move('SM_JULIO_1_SOL_1_045', 'Psicología Clínica', 'Trastornos depresivos');
move('SM_JUNIO_1_SOL_1_184', 'Psicología Clínica', 'Psicopatología de la conducta motora');
move('SM_MAYO_1_SOL_1_103', 'Psicología Clínica', 'Trastornos adictivos y comportamentales');
move('4Simulacro02018Comentarios_074', 'Psicopatología Infantil', 'Trastornos de ansiedad infantojuveniles');
move('Simu 14 comentado _003', 'Psicología Básica', 'Aprendizaje y condicionamiento');
move('Simu 16 comentado_089', 'Psicología Evolutiva', 'Primera infancia (0-2 años)');
move('Simu 8 comentado _044', 'Psicología Clínica', 'Trastornos depresivos');
move('Simu 8 comentado _054', 'Psicología Clínica', 'Modelos en psicopatología');
move('simu 9 comentado_078', 'Psicología Clínica', 'Trastornos adictivos y comportamentales');
move('SmCm10PIR2025_020', 'Psicología Clínica', 'Trastornos relacionados con traumas y factores de estrés');
move('SmCm20PIR2025 (1)_086', 'Psicología Clínica', 'Trastornos depresivos');
move('SmCm21PIR2025 (2)_016', 'Psicología Clínica', 'Trastornos de ansiedad');
move('SmCm21PIR2025 (2)_042', 'Psicología Clínica', 'Trastornos relacionados con traumas y factores de estrés');
move('SmCm22PIR2025_014', 'Psicología Social', 'Procesos de interacción social');
move('SmCm23PIR2025 (2)_082', 'Psicología Clínica', 'Trastornos parafílicos');
move('SmCm23PIR2025_003', 'Evaluación Psicológica', 'Técnicas objetivas');
move('SmCm24PIR2025 (1)_009', 'Psicología Clínica', 'Trastornos relacionados con traumas y factores de estrés');
move('SmCm24PIR2025 (1)_050', 'Psicología Clínica', 'Trastornos de ansiedad');
move('SmCm24PIR2025 (1)_051', 'Psicología Clínica', 'Trastornos disociativos');
move('SmCm29PIR2025_046', 'Psicología Básica', 'Percepción');
move('SmCm30PIR2025 (1)_012', 'Psicología Experimental', 'Estadística');
move('SmCm30PIR2025 (1)_014', 'Psicología Experimental', 'Método científico y experimental');
move('Simu 11 comentado_024', 'Psicología Clínica', 'Psicopatología de la sensopercepción');
move('Simu 11 comentado_122', 'Psicología Clínica', 'Psicopatología de la afectividad');
move('1Simulacro02018Comentarios_207', 'Psicología Clínica', 'Trastornos de síntomas somáticos y relacionados');
move('SmCm26PIR2025_082', 'Psicología Clínica', 'Psicopatología del pensamiento');
move('SmCm29PIR2025_047', 'Psicología Clínica', 'Psicopatología de la memoria');
move('SmCm28PIR2025_209', 'Psicología Clínica', 'Psicopatología del pensamiento');

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Reubicadas 28 preguntas ajenas a Psicosis.');
