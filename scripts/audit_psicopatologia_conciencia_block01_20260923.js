import fs from 'node:fs';

const dir = 'public/banco';
const cache = new Map();
const load = file => {
  if (!cache.has(file)) cache.set(file, JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8')));
  return cache.get(file);
};

const sourceFile = 'psicopatologia.json';
const source = load(sourceFile);

const moves = {
  '1Simulacro02018Comentarios_012': ['psicologia_evolutiva.json', 'Psicología Evolutiva', 'Perspectivas teóricas en psicología del desarrollo'],
  '1Simulacro02018Comentarios_017': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  '1Simulacro02018Comentarios_218': ['evaluacion_psicologica.json', 'Evaluación Psicológica', 'Evaluación de la ansiedad'],
  '1Simulacro02018Comentarios_219': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos de la personalidad'],
  '1Simulacro02018Comentarios_222': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  '3Simulacro2018Comentarios_110': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastornos depresivos y bipolares infantojuveniles'],
  '3Simulacro2018Comentarios_111': ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos depresivos y bipolares infantojuvenil'],
  '3Simulacro2018Comentarios_115': ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastorno del Espectro Autista'],
  '3Simulacro2018Comentarios_124': ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  '3Simulacro2018Comentarios_175': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad'],
  '3Simulacro2018Comentarios_179': ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos de personalidad'],
  '3Simulacro2018Comentarios_180': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos del sueño-vigilia'],
  '3Simulacro2018Comentarios_181': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos bipolares y relacionados'],
  '3Simulacro2018Comentarios_182': ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos depresivos'],
  '4Simulacro02018Comentarios_206': ['psicologia_de_la_personalidad_y_diferencial.json', 'Psicología de la Personalidad y Diferencial', 'Teorías biológicas de la personalidad'],
  '4Simulacro02018Comentarios_210': ['psicopatologia.json', 'Psicopatología', 'Psicopatología de la sensopercepción']
};

const corrected = {
  '3Simulacro2018Comentarios_064': {
    e: 'El estado crepuscular consiste en:',
    o: {
      a: 'La existencia de dos o más identidades que toman el control de la conducta.',
      b: 'Una sensación de irrealidad respecto al propio cuerpo.',
      c: 'Un estrechamiento extremo de la conciencia con focalización atencional hacia vivencias interiores.',
      d: 'Un estado exclusivamente deficitario de la conciencia.'
    },
    c: 'c',
    x: 'El estado crepuscular es una alteración cualitativa caracterizada por el estrechamiento del campo de conciencia y la focalización de la atención.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.',
    v: 'VALIDADA'
  },
  '3Simulacro2018Comentarios_066': {
    e: 'La anosognosia se define como el «no reconocimiento de la enfermedad» pero, según su psicopatología, la podemos clasificar como:',
    o: {
      a: 'Una alteración de la conciencia',
      b: 'Una alteración de la sensopercepción',
      c: 'Un tipo de trastorno disociativo',
      d: 'Una alteración de la conciencia corporal'
    },
    c: 'd',
    x: 'La anosognosia es la falta de conciencia o reconocimiento de una alteración corporal o neurológica propia, por lo que se incluye entre las alteraciones de la conciencia corporal.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.',
    v: 'VALIDADA'
  },
  '3Simulacro2018Comentarios_183': {
    e: 'Los estados crepusculares se caracterizan por:',
    o: {
      a: 'Inicio y final bruscos, duración e intensidad variables y amnesia tras el episodio',
      b: 'Restricción de la conciencia cuyo elemento principal es la sugestión',
      c: 'Total desintegración de la conciencia, alteraciones perceptivas y mnésicas, delirios y agitación psicomotriz',
      d: 'Elevación patológica del nivel de conciencia'
    },
    c: 'a',
    x: 'Los estados crepusculares suelen comenzar y terminar bruscamente, presentan duración e intensidad variables y dejan amnesia del episodio.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.',
    v: 'VALIDADA'
  },
  '4Simulacro02018Comentarios_211': {
    e: 'Señale la opción correcta en relación con los estados crepusculares:',
    o: {
      a: 'Inicio y final progresivos',
      b: 'No hay amnesia tras el episodio',
      c: 'Duración variable: horas o días',
      d: 'Es un tipo de trastorno deficitario de la conciencia'
    },
    c: 'c',
    x: 'Los estados crepusculares tienen una duración variable, habitualmente de horas o días. Su inicio y final suelen ser bruscos, puede existir amnesia y constituyen una alteración cualitativa.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la conciencia.',
    v: 'VALIDADA'
  }
};

for (const [id, [destFile, section, topic]] of Object.entries(moves)) {
  const index = source.findIndex(q => q.id === id);
  if (index < 0) throw new Error(`No encontrada para trasladar: ${id}`);
  const [question] = source.splice(index, 1);
  question.s = section;
  question.t = [topic];
  const destination = load(destFile);
  if (!destination.some(q => q.id === id)) destination.push(question);
}

for (const [id, update] of Object.entries(corrected)) {
  const question = source.find(q => q.id === id);
  if (!question) throw new Error(`No encontrada para corregir: ${id}`);
  Object.assign(question, update);
}

for (const [file, data] of cache) fs.writeFileSync(`${dir}/${file}`, `${JSON.stringify(data)}\n`);
console.log(`Trasladadas ${Object.keys(moves).length}; corregidas ${Object.keys(corrected).length}.`);
