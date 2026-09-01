import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bank = path.join(root, 'public', 'banco');
const manifestPath = path.join(bank, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sourceSubject = 'Tratamientos Adultos';
const sourceTopic = 'Tratamiento de la psicosis y esquizofrenia';

const destinations = {
  '3Simulacro2018Comentarios_168': ['Psicopatología', 'Modelos en psicopatología'],
  '3Simulacro2018Comentarios_169': ['Psicopatología', 'Psicopatología de la memoria'],
  '4Simulacro02018Comentarios_187': ['Clínica Adultos', 'TOC'],
  '4Simulacro02018Comentarios_189': ['Tratamientos Adultos', 'Tratamiento de los trastornos de ansiedad'],
  'JULIO1_174': ['Psicoterapias', 'Introducción'],
  'JULIO2_126': ['Psicoterapias', 'Terapias de familia y modelos sistémicos'],
  'JUNIO-UNO-24_COMENTADO_169': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'MAYO-UNO-24_COMENTADO_068': ['Psicoterapias', 'Terapias de familia y modelos sistémicos'],
  'OCTUBRE-UNO-24_COMENTADO_117': ['Psicoterapias', 'Terapias de familia y modelos sistémicos'],
  'OCTUBRE-UNO-24_COMENTADO_154': ['Tratamientos Adultos', 'Tratamiento de los trastornos neurocognitivos'],
  'PERSEV_JUL25_D2_149': ['Tratamientos Adultos', 'Tratamiento de los trastornos neurocognitivos'],
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_089': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_102': ['Psicoterapias', 'Terapias de familia y modelos sistémicos'],
  'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_069': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_147': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_190': ['Tratamientos Adultos', 'Tratamiento de los trastornos de personalidad'],
  'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_140': ['Tratamientos Adultos', 'Tratamiento de los trastornos de personalidad'],
  'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_152': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_129': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_087': ['Tratamientos Adultos', 'Componentes y eficacia de la psicoterapia'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_136': ['Tratamientos Infantiles', 'Trastornos psicóticos infantojuvenil'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_066': ['Tratamientos Adultos', 'Componentes y eficacia de la psicoterapia'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_070': ['Tratamientos Adultos', 'Componentes y eficacia de la psicoterapia'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_082': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_170': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_150': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_170': ['Psicoterapias', 'Terapias de familia y modelos sistémicos'],
  'Simu 11 comentado_063': ['Tratamientos Adultos', 'Tratamiento de las adicciones'],
  'Simu 11 comentado_158': ['Tratamientos Adultos', 'Tratamiento de los trastornos de ansiedad'],
  'Simu 11 comentado_162': ['Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  'Simu 12 comentado_009': ['Tratamientos Adultos', 'Tratamiento de las adicciones'],
  'Simu 12 comentado_055': ['Tratamientos Adultos', 'Introducción'],
  'Simu 12 comentado_156': ['Tratamientos Adultos', 'Tratamiento de los trastornos de ansiedad'],
  'Simu 12 comentado_168': ['Tratamientos Adultos', 'Tratamiento de las adicciones'],
  'Simu 13 comentado_113': ['Tratamientos Adultos', 'Tratamiento de las adicciones'],
};

const datasets = new Map();
for (const [subject, meta] of Object.entries(manifest.subjects)) {
  datasets.set(subject, JSON.parse(fs.readFileSync(path.join(bank, meta.slug + '.json'), 'utf8')));
}
const source = datasets.get(sourceSubject);
const first100 = source.filter(q => q.t?.[0] === sourceTopic && !['VALIDADA_ORIGINAL', 'CORREGIDA'].includes(q.v)).slice(0, 100);
if (first100.length !== 100) throw new Error(`Se esperaban 100 preguntas y hay ${first100.length}.`);
const selected = new Set(first100.map(q => q.id));
for (const id of Object.keys(destinations)) if (!selected.has(id)) throw new Error(`ID fuera del lote: ${id}`);

const moved = [];
datasets.set(sourceSubject, source.filter(q => !destinations[q.id]));
for (const q of first100) {
  const destination = destinations[q.id];
  if (!destination) continue;
  const [subject, topic] = destination;
  if (!manifest.subjects[subject]?.topics.includes(topic)) throw new Error(`Destino inexistente: ${subject} > ${topic}`);
  const updated = { ...q, s: subject, t: [topic], v: 'REVISAR' };
  datasets.get(subject).push(updated);
  moved.push({ id: q.id, from: `${sourceSubject} > ${sourceTopic}`, to: `${subject} > ${topic}` });
}

const all = [...datasets.values()].flat();
if (all.length !== manifest.total) throw new Error(`Total alterado: ${all.length} != ${manifest.total}`);
if (new Set(all.map(q => q.id)).size !== all.length) throw new Error('IDs duplicados tras la reubicación.');
for (const [subject, data] of datasets) manifest.subjects[subject].count = data.length;
for (const [subject, data] of datasets) fs.writeFileSync(path.join(bank, manifest.subjects[subject].slug + '.json'), JSON.stringify(data) + '\n');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(path.join(root, 'auditorias'), { recursive: true });
fs.writeFileSync(path.join(root, 'auditorias', 'tratamientos_adultos_psicosis_primeras100_reubicaciones_20260901.json'), JSON.stringify({ selected: first100.map(q => q.id), moved, retainedForDocumentaryAudit: first100.filter(q => !destinations[q.id]).map(q => q.id) }, null, 2) + '\n');
console.log(JSON.stringify({ selected: 100, rehomed: moved.length, retainedForDocumentaryAudit: 100 - moved.length, total: all.length, uniqueIds: new Set(all.map(q => q.id)).size }, null, 2));
