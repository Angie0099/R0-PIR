import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map(q => [q.id, q]));
const set = (id, values) => {
  const q = byId.get(id);
  if (!q) throw new Error(`No existe ${id}`);
  Object.assign(q, values);
};

set('SEPTIEMBRE-DOS-24_COMENTADO_067', {
  t: ['Psicopatología de la sensopercepción'],
  e: 'Respecto a los siguientes fenómenos de la psicopatología de la percepción, señale la afirmación incorrecta:',
  o: {
    a: 'La alostesia visual es la transposición de imágenes visuales de un hemicampo visual al otro.',
    b: 'Las alucinaciones pedunculares son alucinaciones visuales muy intensas y vívidas relacionadas con lesiones diencefálicas u occipitotemporales.',
    c: 'En la palinopsia, la persona sigue percibiendo un estímulo visual durante un tiempo después de que haya desaparecido.',
    d: 'En la amusia se pierde la percepción del color.'
  },
  c: 'd',
  x: 'La opción d es la incorrecta. La amusia consiste en una alteración para apreciar o reconocer la música, sus patrones rítmicos o la melodía; la pérdida de la percepción del color corresponde a la acromatopsia. La a define la alostesia visual; la b describe las alucinaciones pedunculares; y la c corresponde a la palinopsia o perseveración visual.',
  r: 'Vallejo Ruiloba, J. (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.), capítulo sobre trastornos de la percepción. Elsevier. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo «Psicopatología de la sensopercepción». McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_073', {
  t: ['Psicopatología de la sensopercepción'],
  e: 'La autopagnosia hace referencia a:',
  o: {
    a: 'La indiferencia o negación de una parte del cuerpo dañada.',
    b: 'El deterioro del reconocimiento y la localización de partes del propio cuerpo.',
    c: 'El fracaso para reconocer objetos mediante el tacto.',
    d: 'Delirios o alucinaciones relativos a partes del cuerpo.'
  },
  c: 'b',
  x: 'La opción b es correcta. La autopagnosia es la dificultad para reconocer o localizar partes del propio cuerpo. La a describe anosognosia; la c, astereognosia; y la d se refiere a fenómenos delirantes o alucinatorios, no a un déficit del esquema corporal.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo «Psicopatología de la sensopercepción», apartado sobre alteraciones del esquema corporal. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_074', {
  t: ['Psicopatología de la memoria'],
  e: 'Respecto al síndrome de Frégoli, señale la afirmación correcta:',
  o: {
    a: 'La persona cree que alguien importante ha sido sustituido por un impostor.',
    b: 'Se corresponde con un falso reconocimiento positivo.',
    c: 'Es una parapraxia del recuerdo.',
    d: 'Se caracteriza por fabricar historias falsas sin incentivos externos.'
  },
  c: 'b',
  x: 'La opción b es correcta. En el síndrome de Frégoli la persona identifica erróneamente a extraños como alguien conocido que se ha disfrazado, por lo que es un falso reconocimiento positivo. La a describe el síndrome de Capgras; la c es falsa porque Frégoli es una paramnesia del reconocimiento; y la d describe la pseudología fantástica.',
  r: 'Diges Junco, M. y Perpiñá Tordera, C. (2024). «Psicopatología de la memoria», en Belloch, A., Sandín, B. y Ramos, F. (coords.), Manual de psicopatología, vol. I (4.ª ed.). McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Reubicadas y validadas 3 preguntas fenomenológicas.');
