import fs from 'node:fs';

const psyFile = 'public/banco/psicopatologia.json';
const childFile = 'public/banco/clinica_infantojuvenil.json';
const psy = JSON.parse(fs.readFileSync(psyFile, 'utf8'));
const child = JSON.parse(fs.readFileSync(childFile, 'utf8'));

const ids = [
  'SmCm17PIR2025_081', 'SmCm17PIR2025_085', 'SmCm17PIR2025_086',
  'SmCm18PIR2025_106', 'SmCm1PIR2024_135', 'SmCm20PIR2024_019',
  'SmCm20PIR2025 (1)_120', 'SmCm21PIR2025 (2)_058', 'SmCm22PIR2025 (1)_087',
  'SmCm23PIR2025 (2)_094', 'SmCm23PIR2025 (2)_097', 'SmCm23PIR2025 (2)_098',
  'SmCm24PIR2025 (1)_019', 'SmCm25PIR2025_204', 'SmCm27PIR2025 (1)_026',
  'SmCm30PIR2025 (1)_056', 'SmCm30PIR2025 (1)_065', 'SmCm4PIR2024_089',
  'SmCm08PIR2025_024', 'SmCm21PIR2025 (2)_059', 'SmCm25PIR2025_111'
];

const clean = value => String(value ?? '')
  .replace(/[�]/g, '')
  .replace(/PSICOLOGÍA\s+(?:AMIR|AMI|AM|A)\b/gi, '')
  .replace(/\bMIR\b/g, '')
  .replace(/\u00ad/g, '')
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
  .replace(/\s+/g, ' ')
  .replace(/\s+([,.;:?!])/g, '$1')
  .trim();

const patches = {
  'SmCm17PIR2025_081': {
    e: 'Señale la INCORRECTA en relación con la obnubilación:',
    o: {
      a: 'Describe el primer estadio de disminución del nivel de conciencia.',
      b: 'Se caracteriza por una dificultad para mantener el estado de alerta necesario para responder adecuadamente a los estímulos del contexto, de tal manera que se requieren estímulos externos de cierta intensidad para hacerse conscientes.',
      c: 'Se acompaña de un cierto nivel de deterioro de otros procesos psicológicos como la atención o la percepción y se pierde por completo la capacidad de reconocimiento.',
      d: 'Puede estar presente en enfermedades degenerativas y traumáticas.'
    },
    x: 'En la obnubilación puede existir deterioro de la atención o la percepción, pero no se pierde por completo la capacidad de reconocimiento; por eso la opción c es incorrecta.'
  },
  'SmCm17PIR2025_085': { o: { a: 'Estado crepuscular', d: 'Letargo' }, x: 'El letargo es un trastorno deficitario o cuantitativo de la conciencia; las otras opciones son alteraciones cualitativas o circunscritas.' },
  'SmCm17PIR2025_086': { x: 'La confusión de los límites del yo es el deterioro de la capacidad para percibirse como una entidad distinta del entorno.' },
  'SmCm18PIR2025_106': {
    e: '¿Cuál de las siguientes alteraciones de la conciencia del sí mismo propuestas por Reed no es necesariamente patológica?',
    o: { a: 'Deterioro de la unidad del yo.', b: 'Pérdida de atribución personal.', c: 'Confusión de los límites del yo.', d: 'Pérdida de la experiencia de la realidad.' },
    x: 'El deterioro de la unidad del yo puede incluir experiencias disociativas que no son necesariamente patológicas.'
  },
  'SmCm1PIR2024_135': { x: 'Las alucinaciones visuales son frecuentes en el síndrome confusional agudo; las hápticas no constituyen una característica común.' },
  'SmCm20PIR2024_019': { o: { b: 'Obnubilado' }, x: 'La apariencia distraída, somnolienta e irritable, conservando la capacidad de seguir órdenes sencillas, corresponde a la obnubilación.' },
  'SmCm20PIR2025 (1)_120': {
    o: { a: 'Con tono muscular disminuido, respondiendo solo a estímulos intensos', b: 'Inmóvil, mutista y sin responder a estímulos a pesar de poder tener los ojos abiertos y seguir con la vista objetos en movimiento', c: 'Inmóvil, con un discurso incoherente e ininteligible', d: 'Distraído, somnoliento e irritable, pero con posibilidad de seguir órdenes sencillas' },
    x: 'En la obnubilación el sujeto parece distraído, somnoliento e irritable, aunque todavía puede comprender y ejecutar órdenes sencillas.'
  },
  'SmCm21PIR2025 (2)_058': { x: 'El onirismo es una alteración global cualitativa de la conciencia, no una alteración de la conciencia corporal.' },
  'SmCm22PIR2025 (1)_087': { o: { c: 'Delirium.' }, x: 'El delirium es una alteración global cualitativa de la conciencia; las demás alternativas son alteraciones circunscritas.' },
  'SmCm23PIR2025 (2)_094': {
    e: '¿Cuál de las siguientes afirmaciones describe con mayor precisión los estados oniroides?',
    o: { a: 'Se trata de alteraciones de la conciencia en las que predominan experiencias sensoriales que se viven sin un mayor impacto emocional', b: 'Se caracterizan por una vivencia onírica intensa, con escenas de contenido vívido y cambiante' },
    x: 'Los estados oniroides se caracterizan por experiencias escénicas, vívidas y cambiantes, semejantes a una vivencia onírica intensa.'
  },
  'SmCm23PIR2025 (2)_097': { o: { d: 'Delirios y alucinaciones sobre partes del propio cuerpo.' }, x: 'El síndrome de Gerstmann se caracteriza por acalculia, agnosia digital, agrafía y desorientación derecha-izquierda.' },
  'SmCm23PIR2025 (2)_098': { x: 'El onirismo presenta fenómenos semejantes a los sueños, conducta automática y actividad alucinatoria visual de carácter escenográfico.' },
  'SmCm24PIR2025 (1)_019': { e: 'Se entiende por astereognosia:', x: 'La astereognosia es la incapacidad para reconocer objetos mediante el tacto cuando la sensibilidad elemental está conservada.' },
  'SmCm25PIR2025_204': { e: 'Forma prolongada de suspensión global de la conciencia en la que resulta imposible despertar al paciente a pesar de una estimulación intensa. Se caracteriza por la pérdida de conciencia, sensibilidad y motilidad voluntaria, desapareciendo incluso el funcionamiento reflejo y conservándose solo las funciones vegetativas:', x: 'La descripción corresponde al coma, una suspensión global de la conciencia en la que no se puede despertar al paciente mediante estimulación.' },
  'SmCm27PIR2025 (1)_026': { x: 'El autorreconocimiento aparece habitualmente durante el segundo año de vida, antes de los tres años; por ello la opción a es incorrecta.' },
  'SmCm30PIR2025 (1)_056': {
    e: 'Reed (1988) propone una clasificación de las alteraciones de la conciencia del sí mismo. Señale la alternativa correcta respecto a esta clasificación:',
    o: { b: 'En la pérdida de atribución personal se engloba la disociación del afecto y la escisión de la unidad del yo.', c: 'En el deterioro de la unidad del yo se observa un deterioro de la capacidad para percibirse a uno mismo como diferente de su entorno.', d: 'En la pérdida de la experiencia de la realidad se engloban la despersonalización y la desrealización.' },
    x: 'La pérdida de la experiencia de realidad incluye la despersonalización y la desrealización.'
  },
  'SmCm30PIR2025 (1)_065': {
    e: 'La vivencia de cambio en el ambiente externo que ocurre con frecuencia en estados disociativos es la definición de:',
    o: { a: 'Desrealización.', b: 'Estado crepuscular.', c: 'Onirismo.', d: 'Despersonalización.' },
    x: 'La desrealización es la vivencia de extrañeza o cambio en el ambiente externo; la despersonalización se refiere al propio yo.'
  },
  'SmCm4PIR2024_089': { x: 'El estupor se caracteriza por inmovilidad, falta de reacción al entorno y necesidad de estímulos muy potentes para lograr una alerta ligera y transitoria.' },
  'SmCm08PIR2025_024': { x: 'La vivencia de extrañeza o irrealidad respecto al propio yo, con pérdida de espontaneidad y sensación de automatismo, define la despersonalización.' },
  'SmCm21PIR2025 (2)_059': { x: 'El coma es una alteración cuantitativa del nivel de conciencia; los estados oniroides, el delirium y el estado confusional son cualitativos.' },
  'SmCm25PIR2025_111': {
    e: 'La alteración de la conciencia denominada «hipervigilancia», consistente en una elevación patológica del nivel de conciencia, NO se observa en:',
    o: { a: 'Estados maníacos.', b: 'Algunas formas de esquizofrenia', c: 'Intoxicación por drogas noradrenérgicas.', d: 'TDAH' },
    x: 'La hipervigilancia puede aparecer en estados maníacos, algunas formas de esquizofrenia y con sustancias noradrenérgicas, pero no es característica del TDAH.'
  }
};

for (const id of ids) {
  const q = psy.find(item => item.id === id);
  if (!q) throw new Error(`No encontrada: ${id}`);
  q.e = clean(q.e);
  for (const key of Object.keys(q.o || {})) q.o[key] = clean(q.o[key]);
  const patch = patches[id];
  if (patch.e) q.e = patch.e;
  if (patch.o) Object.assign(q.o, patch.o);
  q.x = patch.x;
  q.r = 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.';
  q.v = 'VALIDADA';
}

const depression = child.find(q => q.id === 'MAYO-UNO-24_COMENTADO_113');
if (!depression) throw new Error('No encontrada la pregunta de depresión infantojuvenil');
depression.e = 'Respecto a la depresión en niños y adolescentes, es correcto afirmar:';
depression.c = 'c';
depression.x = 'En adolescentes, la anhedonia puede manifestarse mediante conductas de pasotismo. Las pesadillas, los terrores nocturnos y la resistencia a acostarse son más propios de niños pequeños.';
depression.r = 'Vallejo y Rodríguez (2022). Depresión. Manual de terapia de conducta en la infancia, 4.ª ed., p. 301.';
depression.v = 'VALIDADA';

fs.writeFileSync(psyFile, `${JSON.stringify(psy)}\n`);
fs.writeFileSync(childFile, `${JSON.stringify(child)}\n`);
console.log(`Corregidas ${ids.length} de conciencia y la pregunta de depresión infantojuvenil.`);
