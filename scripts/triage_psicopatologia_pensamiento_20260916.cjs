const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'banco');
const files = {
  psychopathology: 'psicopatologia.json',
  adultClinical: 'clinica_adultos.json',
  childClinical: 'clinica_infantojuvenil.json',
  adultTreatments: 'tratamientos_adultos.json',
  childTreatments: 'tratamientos_infantiles.json',
  assessment: 'evaluacion_psicologica.json',
  social: 'psicologia_social.json'
};
const banks = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))]));

const routes = [
  ['PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_132', 'adultClinical', 'Clínica Adultos', 'Trastornos por síntomas somáticos y relacionados'],
  ['PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_060', 'adultClinical', 'Clínica Adultos', 'Trastornos neurocognitivos'],
  ['PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_052', 'childClinical', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  ['PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_074', 'psychopathology', 'Psicopatología', 'Psicopatología del lenguaje'],
  ['PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_103', 'childClinical', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  ['Simu 11 comentado_010', 'adultClinical', 'Clínica Adultos', 'Trastornos de la personalidad'],
  ['Simu 11 comentado_132', 'social', 'Psicología Social', 'Las actitudes'],
  ['Simu 13 comentado_161', 'childTreatments', 'Tratamientos Infantiles', 'Trastornos de ansiedad infantojuvenil'],
  ['Simu 15 comentado_116', 'psychopathology', 'Psicopatología', 'Sistemas clasificatorios en psicopatología'],
  ['Simu 32 comentado hardcore 2_115', 'psychopathology', 'Psicopatología', 'Psicopatología de la memoria'],
  ['Simu 32 comentado hardcore 2_116', 'psychopathology', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  ['simu 9 comentado_128', 'psychopathology', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  ['SM_AGOSTO_1_SOL_1_066', 'psychopathology', 'Psicopatología', 'Sistemas clasificatorios en psicopatología'],
  ['SM_DICIEMBRE_2_SOL_1_080', 'psychopathology', 'Psicopatología', 'Psicopatología del lenguaje'],
  ['SM_JULIO_2_SOL_1_045', 'psychopathology', 'Psicopatología', 'Psicopatología del lenguaje'],
  ['SmCm08PIR2025_024', 'psychopathology', 'Psicopatología', 'Psicopatología de la conciencia'],
  ['SmCm16PIR2025_094', 'psychopathology', 'Psicopatología', 'Psicopatología de la atención'],
  ['SmCm17PIR2025_208', 'assessment', 'Evaluación Psicológica', 'Tests de personalidad'],
  ['SmCm18PIR2025_100', 'psychopathology', 'Psicopatología', 'Psicopatología de la memoria'],
  ['SmCm1PIR2024_082', 'adultClinical', 'Clínica Adultos', 'Trastornos de ansiedad'],
  ['SmCm1PIR2024_083', 'adultClinical', 'Clínica Adultos', 'Trastornos depresivos'],
  ['SmCm1PIR2024_090', 'adultTreatments', 'Tratamientos Adultos', 'Tratamiento del trauma y TEPT'],
  ['SmCm20PIR2025 (1)_121', 'adultTreatments', 'Tratamientos Adultos', 'Introducción'],
  ['SmCm21PIR2025 (2)_054', 'adultClinical', 'Clínica Adultos', 'Trastornos de la conducta alimentaria'],
  ['SmCm21PIR2025 (2)_059', 'psychopathology', 'Psicopatología', 'Psicopatología de la conciencia'],
  ['SmCm25PIR2025_111', 'psychopathology', 'Psicopatología', 'Psicopatología de la conciencia'],
  ['SmCm25PIR2025_115', 'psychopathology', 'Psicopatología', 'Trastornos psicomotores'],
  ['SmCm30PIR2025 (1)_053', 'psychopathology', 'Psicopatología', 'Psicopatología de la memoria'],
  ['SmCm4PIR2024_073', 'adultClinical', 'Clínica Adultos', 'TOC'],
  ['SmCm4PIR2024_077', 'adultClinical', 'Clínica Adultos', 'Disfunciones sexuales'],
  ['SmCm4PIR2024_078', 'psychopathology', 'Psicopatología', 'Psicopatología de la sensopercepción'],
  ['SmCm4PIR2024_084', 'adultClinical', 'Clínica Adultos', 'Trastornos del espectro de la esquizofrenia'],
  ['SmCm4PIR2024_086', 'adultClinical', 'Clínica Adultos', 'Trastornos de ansiedad'],
  ['SmCm5PIR2024_138', 'childClinical', 'Clínica Infantojuvenil', 'Trastornos de ansiedad infantojuveniles']
];

const source = banks.psychopathology;
for (const [id, destinationKey, section, topic] of routes) {
  const index = source.findIndex(q => q.id === id);
  if (index < 0) throw new Error(`No se encontró ${id} en psicopatología`);
  const [q] = source.splice(index, 1);
  q.s = section;
  q.t = [topic];
  q.v = 'REVISAR';
  if (destinationKey === 'psychopathology') {
    source.push(q);
  } else {
    if (banks[destinationKey].some(item => item.id === id)) throw new Error(`El destino ya contiene ${id}`);
    banks[destinationKey].push(q);
  }
}

for (const [key, file] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, file), JSON.stringify(banks[key]));
}
console.log(`Criba completada: ${routes.length} preguntas reubicadas fuera de Psicopatología del pensamiento.`);
