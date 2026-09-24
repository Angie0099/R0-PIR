import fs from 'node:fs';

const file = 'public/banco/psicopatologia.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const ids = [
  'SEPTIEMBRE-UNO-24_COMENTADO_136', 'SIM_ABR2_005', 'SIM_ABR2_011',
  'SIM_ABR25_018', 'SIM_ABR25_019', 'SIM_ABR25_024', 'SIM_ABR25_202',
  'Simu 31 comentado Hardcore 1_040', 'Simu 31 comentado Hardcore 1_134',
  'Simu 31 comentado Hardcore 1_138', 'Simu 32 comentado hardcore 2_114',
  'Simu 6 comentado__108', 'Simu 7 comentado _133', 'Simu 8 comentado _080',
  'SM_ABRIL_1_SOL_1_018', 'SM_ENERO_1_SOL_1_114', 'SM_JULIO_1_SOL_1_057',
  'SM_MAYO_1_SOL_1_074', 'SmCm08PIR2025_207', 'SmCm16PIR2025_093'
];

const clean = value => String(value ?? '')
  .replace(/[�]/g, '')
  .replace(/PSICOLOGÍA\s+AMI?/gi, '')
  .replace(/\u00ad/g, '')
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
  .replace(/^\s*(?:\d+\s+){1,5}(?=[A-ZÁÉÍÓÚÜÑ¿«])/u, '')
  .replace(/\s+/g, ' ')
  .replace(/\s+([,.;:?!])/g, '$1')
  .trim();

const exact = {
  'SEPTIEMBRE-UNO-24_COMENTADO_136': {
    d: 'Estado crepuscular.',
    x: 'El estado crepuscular es una alteración cualitativa con ruptura de la continuidad y restricción del contenido de conciencia, de inicio y final súbitos.'
  },
  'SIM_ABR2_005': { x: 'La obnubilación implica embotamiento, lentitud y dificultad para mantener la atención y responder adecuadamente al entorno.' },
  'SIM_ABR2_011': { x: 'El estado crepuscular se caracteriza por estrechamiento del campo de conciencia y focalización en vivencias internas.' },
  'SIM_ABR25_018': { x: 'El estupor exige estímulos muy potentes para obtener un estado de alerta ligero y transitorio y cursa con inmovilidad y ausencia de conducta intencional.' },
  'SIM_ABR25_019': { x: 'Las ilusiones o alucinaciones escénicas de gran claridad y vividez son propias de los estados oniroides, no de los estados crepusculares.' },
  'SIM_ABR25_024': { x: 'En el estupor psicógeno se conservan los reflejos, con la excepción indicada para el síndrome de Ganser; el electroencefalograma suele ser normal.' },
  'SIM_ABR25_202': { x: 'En el estupor solo se alcanza un estado de alerta ligero y transitorio mediante estimulación muy intensa.' },
  'Simu 31 comentado Hardcore 1_040': { x: 'El comienzo brusco, la restricción de conciencia, la desorientación, la perplejidad y las conductas automáticas orientan a un estado crepuscular.' },
  'Simu 31 comentado Hardcore 1_134': { x: 'En la confusión de los límites del yo puede aparecer un uso inadecuado del lenguaje al alterarse la diferenciación entre el yo y el entorno.' },
  'Simu 31 comentado Hardcore 1_138': { x: 'La somatoparafrenia es una variante de la asomatognosia acompañada de ideas delirantes o alucinaciones referidas a partes del propio cuerpo.' },
  'Simu 32 comentado hardcore 2_114': { x: 'La autotopagnosia es la dificultad para reconocer y localizar partes del propio cuerpo.' },
  'Simu 6 comentado__108': { x: 'Los estados crepusculares son alteraciones cualitativas caracterizadas por un estrechamiento del campo de conciencia.' },
  'Simu 7 comentado _133': { x: 'La reaparición de patrones de sueño-vigilia constituye un signo de evolución desde el coma hacia estados de mayor activación.' },
  'Simu 8 comentado _080': { x: 'El estadio asténico-apático puede presentar hipersensibilidad a la luz y al sonido, no insensibilidad.' },
  'SM_ABRIL_1_SOL_1_018': { x: 'En el coma vigil o estado vegetativo pueden conservarse reflejos complejos, incluidos movimientos involuntarios ante estímulos nocivos.' },
  'SM_ENERO_1_SOL_1_114': { x: 'El delirium suele alterar el ciclo vigilia-sueño, con somnolencia diurna, vigilia o agitación nocturna y dificultad para iniciar el sueño.' },
  'SM_JULIO_1_SOL_1_057': { d: 'Estupor orgánico.', x: 'El estupor funcional se incluye entre las alteraciones cualitativas; la obnubilación, la letargia y el estupor orgánico son cuantitativas.' },
  'SM_MAYO_1_SOL_1_074': { d: 'Coma.', x: 'La descripción corresponde a letargia, somnolencia o sopor: disminuyen la actividad psicomotora, los reflejos y la respuesta a estímulos.' },
  'SmCm08PIR2025_207': { x: 'El delirio de lectura del pensamiento supone atribuir a otros el acceso a pensamientos propios y corresponde a una pérdida de atribución personal.' },
  'SmCm16PIR2025_093': { x: 'Los estados crepusculares pueden presentar automatismos, impulsiones y perseveraciones; la apraxia ideacional no es un síntoma característico.' }
};

for (const id of ids) {
  const q = data.find(item => item.id === id);
  if (!q) throw new Error(`No encontrada: ${id}`);
  q.e = clean(q.e);
  for (const key of Object.keys(q.o || {})) q.o[key] = clean(q.o[key]);
  const patch = exact[id];
  for (const key of ['a', 'b', 'c', 'd']) if (patch[key]) q.o[key] = patch[key];
  q.x = patch.x;
  q.r = 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.';
  q.v = 'VALIDADA';
}

data.find(q => q.id === 'SM_ABRIL_1_SOL_1_018').c = 'a';
fs.writeFileSync(file, `${JSON.stringify(data)}\n`);
console.log(`Corregidas ${ids.length} preguntas.`);
