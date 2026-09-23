import fs from 'node:fs';

const dir = 'public/banco';
const cache = new Map();
const load = file => {
  if (!cache.has(file)) cache.set(file, JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8')));
  return cache.get(file);
};

const source = load('psicopatologia.json');
const moves = {
  'AGOSTO2_088': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del lenguaje'],
  'DICIEMBRE-DOS-24_COMENTADO_049': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'DICIEMBRE-UNO-24_COMENTADO_105': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos relacionados con estrés y trauma'],
  'DICIEMBRE-UNO-24_COMENTADO_122': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'JULIO1_073': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'JUNIO-UNO-24_COMENTADO_063': ['clinica_adultos.json', 'Clínica Adultos', 'TOC'],
  'MAYO-DOS-24_COMENTADO_136': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'MAYO-DOS-24_COMENTADO_144': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos adictivos y relacionados con sustancias'],
  'MAYO2_020': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la atención'],
  'OCTUBRE-UNO-24_COMENTADO_050': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  'PERSEV_AGO25_U1_022': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'PERSEV_AGO25_U1_065': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  'PERSEV_JUL25_D2_072': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la afectividad'],
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_207': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_074': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos relacionados con estrés y trauma'],
  'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_049': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_076': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_031': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_024': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_065': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos disociativos'],
  'PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_071': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_011': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_033': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del lenguaje'],
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_042': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_071': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_070': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_070': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'SIM_ABR25_096': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'Simu 12 comentado_002': ['evaluacion_psicologica.json', 'Evaluación Psicológica', 'Tests de inteligencia'],
  'Simu 12 comentado_099': ['psicologia_de_la_personalidad_y_diferencial.json', 'Psicología de la Personalidad y Diferencial', 'Otros constructos de la personalidad'],
  'Simu 15 comentado_042': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos del espectro de la esquizofrenia'],
  'Simu 31 comentado Hardcore 1_135': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del lenguaje'],
  'Simu 6 comentado__001': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Discapacidad intelectual'],
  'Simu 6 comentado__105': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'SM_ABRIL_1_SOL_1_058': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad'],
  'SM_AGOSTO_1_SOL_1_057': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'SM_AGOSTO_1_SOL_1_062': ['psicologia_basica.json', 'Psicología Básica', 'Motivación y emoción'],
  'SM_DICIEMBRE_1_SOL_1_015': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  'SM_DICIEMBRE_1_SOL_1_027': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'SM_JUNIO_2_SOL_1_018': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'SM_JUNIO_2_SOL_1_048': ['clinica_adultos.json', 'Clínica Adultos', 'Disfunciones sexuales'],
  'SM_MAYO_1_SOL_1_069': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la atención'],
  'SM_MAYO_1_SOL_1_072': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm06PIR2025_008': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos del espectro de la esquizofrenia'],
  'SmCm06PIR2025_056': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos de la personalidad'],
  'SmCm06PIR2025_057': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos parafílicos'],
  'SmCm08PIR2025_022': ['psicologia_social.json', 'Psicología Social', 'Cognición social y procesos de atribución'],
  'SmCm17PIR2025_089': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la atención'],
  'SmCm18PIR2025_008': ['evaluacion_psicologica.json', 'Evaluación Psicológica', 'Fundamentos de la evaluación psicológica'],
  'SmCm18PIR2025_103': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'SmCm18PIR2025_105': ['psicopatologia.json', 'Psicopatología', 'Trastornos psicomotores'],
  'SmCm1PIR2024_134': ['psicoterapias.json', 'Psicoterapias', 'Componentes y eficacia de la psicoterapia'],
  'SmCm22PIR2025 (1)_084': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm22PIR2025 (1)_090': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm23PIR2025_011': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm23PIR2025_015': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la memoria'],
  'SmCm23PIR2025_023': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del lenguaje'],
  'SmCm24PIR2025 (1)_017': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm24PIR2025 (1)_018': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la atención'],
  'SmCm25PIR2025_201': ['evaluacion_psicologica.json', 'Evaluación Psicológica', 'Tests de inteligencia'],
  'SmCm29PIR2025_103': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento'],
  'SmCm4PIR2024_067': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  'SmCm10PIR2025_061': ['psicopatologia.json', 'Psicopatología', 'Psicopatología del pensamiento']
};

const duplicateIds = ['SIM_ABR25_062', 'SIM_ABR25_033', 'SIM_ABR25_068'];
for (const id of duplicateIds) {
  const index = source.findIndex(q => q.id === id);
  if (index < 0) throw new Error(`Duplicado no encontrado: ${id}`);
  source.splice(index, 1);
}

for (const [id, [destFile, section, topic]] of Object.entries(moves)) {
  const index = source.findIndex(q => q.id === id);
  if (index < 0) throw new Error(`Pregunta no encontrada: ${id}`);
  const [question] = source.splice(index, 1);
  question.s = section;
  question.t = [topic];
  const destination = load(destFile);
  if (destination === source || !destination.some(q => q.id === id)) destination.push(question);
}

for (const [file, data] of cache) fs.writeFileSync(`${dir}/${file}`, `${JSON.stringify(data)}\n`);
console.log(`Reubicadas ${Object.keys(moves).length}; duplicadas eliminadas ${duplicateIds.length}.`);
