import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(here, '../public/banco/psicologia_clinica.json');
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

if (!Array.isArray(bank)) {
  throw new Error('El banco de Psicología Clínica debe ser un array de preguntas.');
}

const byId = new Map(bank.map((question) => [question.id, question]));
const updates = [
  {
    id: 'AGOSTO2_051',
    patch: {
      t: ['Trastornos bipolares y relacionados'],
      e: 'Según el modelo del espectro bipolar de Akiskal y Pinto (1999), ¿qué caracteriza al trastorno bipolar tipo IV?',
      o: {
        a: 'Episodios depresivos recurrentes con hipomanía inducida por antidepresivos.',
        b: 'Episodio depresivo mayor superpuesto a un temperamento hipertímico.',
        c: 'Depresión recurrente acompañada de síntomas hipomaníacos mixtos o disfóricos.',
        d: 'Alternancia de episodios depresivos mayores y episodios hipomaníacos espontáneos.',
      },
      c: 'b',
      x: 'La opción b es correcta. El bipolar IV describe una depresión clínica que aparece sobre un temperamento hipertímico previo: elevada energía, optimismo, actividad, sociabilidad y confianza como rasgos estables, no como episodios hipomaníacos delimitados. La a corresponde al bipolar III (hipomanía inducida por antidepresivos u otros tratamientos somáticos); la c alude al denominado bipolar V de ampliaciones posteriores; y la d describe esencialmente el trastorno bipolar II. Precisión histórica: Akiskal y Pinto (1999) desarrollaron formalmente los prototipos I-IV; el bipolar V no debe atribuirse literalmente a ese artículo.',
      r: 'Akiskal, H. S. y Pinto, O. (1999). «The evolving bipolar spectrum: Prototypes I, II, III, and IV». Psychiatric Clinics of North America, 22(3), 517-534. https://doi.org/10.1016/S0193-953X(05)70093-9. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., tabla 7.9, p. 278.',
      v: 'CORREGIDA',
    },
  },
  {
    id: 'SIM_ABR25_021',
    patch: {
      t: ['Psicopatología de la sensopercepción'],
      e: 'Van der Zwaard y Polak (2001) cuestionan el término «pseudoalucinación» y proponen describir estas experiencias según sus características fenomenológicas. ¿Cómo denominan las voces muy vívidas de origen interno o las voces que, aun percibiéndose en el espacio externo, son reconocidas como irreales?',
      o: {
        a: 'Alucinaciones no psicóticas.',
        b: 'Alucinaciones parciales.',
        c: 'Alucinaciones transitorias.',
        d: 'Para-alucinaciones.',
      },
      c: 'b',
      x: 'La opción b es correcta. Las alucinaciones parciales son voces muy vívidas de origen interno o voces que, aun percibiéndose como externas, se experimentan como irreales; conservan total o parcialmente el juicio de realidad. Las alucinaciones no psicóticas son experiencias aisladas, por ejemplo en el duelo o en las transiciones sueño-vigilia; las transitorias son experiencias psicóticas breves ante estrés intenso; y las para-alucinaciones se asocian a lesiones del sistema nervioso periférico, como en el miembro fantasma.',
      r: 'Van der Zwaard, R. y Polak, M. A. (2001). «Pseudohallucinations: a pseudoconcept? A review of the validity of the concept, related to associated symptomatology». Comprehensive Psychiatry, 42, 42-50. Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I, 4.ª ed., cap. 6, tabla 6.7, p. 194.',
      v: 'CORREGIDA',
    },
  },
  {
    id: 'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_067',
    patch: {
      t: ['Psicopatología de la sensopercepción'],
      e: 'Una persona afirma: «Cuando en verano pongo el ventilador, veo moscas girando junto a sus aspas». ¿Qué variante de la experiencia alucinatoria está experimentando?',
      o: {
        a: 'Alucinación negativa.',
        b: 'Alucinación refleja.',
        c: 'Alucinación extracámpica.',
        d: 'Alucinación funcional.',
      },
      c: 'd',
      x: 'La opción d es correcta. En la alucinación funcional, un estímulo real desencadena una alucinación en la misma modalidad sensorial y ambos se perciben simultáneamente. Aquí la visión del ventilador se acompaña de la visión alucinatoria de moscas. La refleja implica modalidades distintas; la negativa es no percibir un estímulo real presente; y la extracámpica se localiza fuera del campo sensorial posible.',
      r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I, 4.ª ed., cap. 6, «Alucinación funcional», p. 217.',
      v: 'CORREGIDA',
    },
  },
];

for (const { id, patch } of updates) {
  const question = byId.get(id);
  if (!question) {
    throw new Error(`No se encontró la pregunta ${id}.`);
  }
  Object.assign(question, patch);
}

const expected = new Map([
  ['AGOSTO2_051', { topic: 'Trastornos bipolares y relacionados', key: 'b' }],
  ['SIM_ABR25_021', { topic: 'Psicopatología de la sensopercepción', key: 'b' }],
  ['PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_067', { topic: 'Psicopatología de la sensopercepción', key: 'd' }],
]);

for (const [id, { topic, key }] of expected) {
  const question = byId.get(id);
  if (question.t?.[0] !== topic || question.c !== key || !question.x || !question.r || question.v !== 'CORREGIDA') {
    throw new Error(`La validación posterior falló para ${id}.`);
  }
}

fs.writeFileSync(bankPath, `${JSON.stringify(bank)}\n`, 'utf8');
console.log(JSON.stringify({ updated: updates.map(({ id }) => id), total: bank.length }));
