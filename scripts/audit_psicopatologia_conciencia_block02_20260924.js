import fs from 'node:fs';

const dir = 'public/banco';
const psyFile = `${dir}/psicopatologia.json`;
const clinicalFile = `${dir}/clinica_adultos.json`;
const psy = JSON.parse(fs.readFileSync(psyFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));

const movedId = 'MAYO-UNO-24_COMENTADO_047';
const movedIndex = psy.findIndex(q => q.id === movedId);
if (movedIndex < 0) throw new Error(`No encontrada: ${movedId}`);
const [moved] = psy.splice(movedIndex, 1);
moved.s = 'Clínica Adultos';
moved.t = ['Conducta suicida y autolesión'];
if (!clinical.some(q => q.id === movedId)) clinical.push(moved);

const ids = [
  'ABRIL-UNO-24_COMENTADO_207',
  'DICIEMBRE-UNO-24_COMENTADO_123',
  'JUNIO1_080',
  'JUNIO1_100',
  'MAYO-DOS-24_COMENTADO_122',
  'MAYO2_030',
  'MAYO2_038',
  'NOVIEMBRE-DOS-24_COMENTADO_043',
  'NOVIEMBRE-DOS-24_COMENTADO_044',
  'PERSEV_AGO25_U1_029',
  'PERSEV_AGO25_U1_049',
  'PERSEV_JUL25_D2_042',
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_042',
  'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_041',
  'PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_057',
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_001',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_128',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_041',
  'SEPTIEMBRE-DOS-24_COMENTADO_072'
];

const clean = value => String(value ?? '')
  .replace(/[�]/g, '')
  .replace(/\u00ad/g, '')
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
  .replace(/^\s*(?:\d+\s+){1,5}(?=[A-ZÁÉÍÓÚÜÑ¿«])/u, '')
  .replace(/\s+/g, ' ')
  .replace(/\s+([,.;:?!])/g, '$1')
  .trim();

const optionCuts = {
  'DICIEMBRE-UNO-24_COMENTADO_123': { d: 'Síndrome de Charcot-Wilbrand.' },
  'JUNIO1_080': { d: 'Estados oniroides.' },
  'JUNIO1_100': { d: 'Anomalías en la pérdida de atribución personal.' },
  'MAYO-DOS-24_COMENTADO_122': { d: 'Delirium.' },
  'MAYO2_030': { d: 'Delirium.' },
  'MAYO2_038': { d: 'Pérdida de la experiencia de la realidad.' },
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_042': { d: 'Pérdida de atribución personal.' },
  'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_041': { d: 'Anomalías en la forma de experimentar la realidad del sí mismo y/o del entorno.' },
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_001': { d: 'Delirium' }
};

const explanations = {
  'ABRIL-UNO-24_COMENTADO_207': 'El estado crepuscular es transitorio, comienza y termina de forma súbita y restringe el contenido de la conciencia hacia vivencias internas.',
  'DICIEMBRE-UNO-24_COMENTADO_123': 'El síndrome de Gerstmann reúne acalculia, agnosia digital, desorientación derecha-izquierda y agrafia.',
  'JUNIO1_080': 'Los estados oniroides cursan con ilusiones o alucinaciones escénicas y multimodales muy vívidas, acompañadas de respuestas emocionales y motoras congruentes.',
  'JUNIO1_100': 'La pérdida de atribución personal implica no reconocer como propio el origen de las ideas, impulsos o actividades.',
  'MAYO-DOS-24_COMENTADO_122': 'La fuga epiléptica, también denominada poriomanía, dromomanía o dromofilia, puede aparecer en los estados crepusculares.',
  'MAYO2_030': 'Los estados crepusculares pueden aparecer en relación con crisis epilépticas del lóbulo temporal.',
  'MAYO2_038': 'En la clasificación de Reed, la confusión de los límites del yo constituye el nivel de mayor gravedad o desintegración.',
  'NOVIEMBRE-DOS-24_COMENTADO_043': 'La descripción corresponde a un estado oniroide, caracterizado por experiencias ilusorias o alucinatorias escénicas de gran claridad y vividez.',
  'NOVIEMBRE-DOS-24_COMENTADO_044': 'La letargia o somnolencia permite despertar al paciente con estimulación, aunque vuelve a dormirse cuando esta disminuye; los reflejos se conservan.',
  'PERSEV_AGO25_U1_029': 'Los estados crepusculares presentan inicio y final bruscos, restricción del campo de conciencia, automatismos y amnesia posterior.',
  'PERSEV_AGO25_U1_049': 'La sensación de cambio o extrañeza respecto a uno mismo pertenece a las anomalías en la forma de experimentar la realidad del sí mismo.',
  'PERSEV_JUL25_D2_042': 'En los estados oniroides se experimentan ilusiones o alucinaciones escénicas y multimodales con elevada claridad y vividez.',
  'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_042': 'El ejemplo refleja confusión de los límites del yo: la persona no diferencia adecuadamente entre sí misma y lo que sucede en el entorno.',
  'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_041': 'El nivel de menor gravedad es la alteración en la forma de experimentar la realidad del sí mismo o del entorno.',
  'PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_057': 'El estado de conciencia mínima conserva evidencias fluctuantes pero significativas de conciencia de uno mismo o del entorno.',
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_001': 'La definición corresponde al estado crepuscular: inicio y final súbitos, ruptura de la continuidad y restricción del contenido de conciencia.',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_128': 'La letargia se caracteriza por dificultad para mantener la alerta, tendencia a dormirse al reducirse la estimulación y posible disartria.',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_041': 'La sensación de separación o escisión del propio yo corresponde al deterioro de la unidad del yo.',
  'SEPTIEMBRE-DOS-24_COMENTADO_072': 'El delirium es una alteración cualitativa; la obnubilación, la letargia y el sopor son alteraciones cuantitativas del nivel de conciencia.'
};

for (const id of ids) {
  const q = psy.find(item => item.id === id);
  if (!q) throw new Error(`No encontrada: ${id}`);
  q.e = clean(q.e);
  for (const key of Object.keys(q.o || {})) q.o[key] = clean(q.o[key]);
  for (const [key, text] of Object.entries(optionCuts[id] || {})) q.o[key] = text;
  q.x = explanations[id];
  q.r = 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.';
  q.v = 'VALIDADA';
}

const oniric = psy.find(q => q.id === 'PERSEV_JUL25_D2_042');
oniric.c = 'b';

fs.writeFileSync(psyFile, `${JSON.stringify(psy)}\n`);
fs.writeFileSync(clinicalFile, `${JSON.stringify(clinical)}\n`);
console.log(`Corregidas ${ids.length}; trasladada 1.`);
