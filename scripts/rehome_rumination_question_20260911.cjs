const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const id = 'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_005';
const q = bank.find((item) => item.id === id);

if (!q) throw new Error(`Question not found: ${id}`);

Object.assign(q, {
  t: ['Trastornos depresivos'],
  e: 'Respecto a la rumiación depresiva, señale la afirmación correcta:',
  o: {
    a: 'Es una cadena de pensamientos e imágenes orientada principalmente hacia amenazas futuras y a intentar resolver problemas de resultado incierto.',
    b: 'Consiste en pensar de forma perseverante y repetitiva sobre el malestar, sus posibles causas y consecuencias, con una orientación predominante hacia el presente o el pasado.',
    c: 'Consiste exclusivamente en autoafirmaciones negativas breves que irrumpen de forma repentina y no se relacionan con el procesamiento del malestar.',
    d: 'Consiste en pensamientos, impulsos o imágenes intrusivos y no deseados que la persona intenta ignorar, suprimir o neutralizar.'
  },
  c: 'b',
  x: 'La b es correcta: la rumiación es un pensamiento repetitivo y perseverante centrado en el malestar y en sus causas y consecuencias, generalmente referido al presente o al pasado. La a describe la preocupación o worry, orientada sobre todo al futuro. La c describe de forma restrictiva los pensamientos automáticos negativos. La d corresponde a las obsesiones.',
  r: 'Nolen-Hoeksema, S., Wisco, B. E. y Lyubomirsky, S. (2008). Rethinking rumination. Perspectives on Psychological Science, 3(5), 400-424. https://doi.org/10.1111/j.1745-6924.2008.00088.x; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

fs.writeFileSync(file, JSON.stringify(bank));
console.log(`Rehomed and corrected ${id}.`);
