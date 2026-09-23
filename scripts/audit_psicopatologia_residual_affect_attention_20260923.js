import fs from 'node:fs';

const file = 'public/banco/psicopatologia.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const questions = Array.isArray(data) ? data : (data.preguntas || data.questions);

const updates = {
  'SmCm28PIR2025_061': {
    e: 'En referencia a la psicopatología de la afectividad, ¿qué se entiende por sentimiento?',
    o: {
      a: 'Respuesta afectiva interna, intensa, breve y de aparición brusca, acompañada de experiencias somáticas.',
      b: 'Estado afectivo complejo, estable, duradero y subjetivo.',
      c: 'Respuesta emocional originada en el momento presente y objetivada con la expresión facial que acompaña a una idea o representación mental.',
      d: 'Estado emocional basal del individuo, persistente y mantenido, que es observable por los otros.'
    },
    c: 'b',
    x: 'El sentimiento es un estado afectivo complejo, estable, duradero y subjetivo. La emoción es más intensa, breve y acompañada de cambios somáticos; el estado de ánimo constituye el tono emocional basal y persistente.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la afectividad.',
    v: 'VALIDADA'
  },
  'SmCm16PIR2025_094': {
    e: 'Las alteraciones de la atención son comunes en los trastornos mentales. ¿Cuál de las siguientes alteraciones atencionales es probable que aparezca en un cuadro de ansiedad?',
    o: {
      a: 'Quejas frecuentes de falta de concentración y problemas cognitivos.',
      b: 'Menor selectividad atencional, de forma automática y preatencional, hacia palabras con carga emocional amenazante.',
      c: 'Sesgo preatencional hacia el procesamiento de estímulos neutros frente a los amenazantes.',
      d: 'Mayor selectividad atencional, de forma automática y preatencional, hacia palabras con carga emocional amenazante.'
    },
    c: 'd',
    x: 'En los cuadros de ansiedad aparece un sesgo atencional automático y preatencional hacia los estímulos amenazantes. No existe preferencia por los estímulos neutros ni menor selectividad hacia la amenaza.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la atención.',
    v: 'VALIDADA'
  },
  'simu 9 comentado_126': {
    e: '¿Cuál de los procesos atencionales se considera un fenómeno de umbral?',
    o: {
      a: 'Laguna mental',
      b: 'Ausencia mental',
      c: 'Curva de Yerkes-Dodson',
      d: 'Visión en túnel'
    },
    c: 'b',
    x: 'La ausencia mental puede considerarse un fenómeno de umbral: la atención hacia los estímulos ajenos a los pensamientos predominantes es muy baja, aunque un cambio suficientemente intenso o novedoso puede superar ese umbral.',
    r: 'Reed (1988), citado en Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología de la atención.',
    v: 'VALIDADA'
  },
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_074': {
    e: 'Indique cuál de las siguientes características NO forma parte del lenguaje autista:',
    o: {
      a: 'Empleo de neologismos.',
      b: 'Neologismos de difícil interpretación.',
      c: 'Dificultades articulatorias.',
      d: 'Interés por el sonido sin captar el sentido.'
    },
    c: 'b',
    x: 'El empleo de neologismos, las dificultades articulatorias y el interés por el sonido sin captar el sentido pueden aparecer en el lenguaje autista. Los neologismos de difícil interpretación son característicos del lenguaje esquizofrénico.',
    r: 'Belloch (2020). Manual de psicopatología, volumen I, pp. 303-305.',
    v: 'VALIDADA'
  },
  'SM_DICIEMBRE_2_SOL_1_080': {
    e: 'La taquifemia se caracteriza por:',
    o: {
      a: 'Dificultad en la articulación y expresión del habla.',
      b: 'Invención de palabras o asignación de un significado diferente del correcto a una palabra del lenguaje cotidiano.',
      c: 'Rapidez excesiva de las palabras, omisión de sílabas o sonidos y articulación imprecisa de fonemas.',
      d: 'Dificultades persistentes en el uso social de la comunicación verbal y no verbal.'
    },
    c: 'c',
    x: 'La taquifemia o farfulleo se caracteriza por una velocidad excesiva del habla, omisiones de sílabas o sonidos y una articulación imprecisa. Las demás opciones describen disartria, neologismos y trastorno de la comunicación social.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología del lenguaje.',
    v: 'VALIDADA'
  },
  'SM_JULIO_2_SOL_1_045': {
    e: '¿Qué afasia fluida se caracteriza por una comprensión auditiva de pobre a muy pobre, repetición alterada y anomia?',
    o: {
      a: 'De Wernicke.',
      b: 'Transcortical mixta.',
      c: 'De Broca.',
      d: 'De conducción.'
    },
    c: 'a',
    x: 'La afasia de Wernicke presenta habla fluida, comprensión auditiva muy alterada, repetición afectada y anomia. La afasia de conducción conserva mejor la comprensión; Broca y la transcortical mixta no son afasias fluidas.',
    r: 'Vallejo Ruiloba. Introducción a la psicopatología y la psiquiatría, 9.ª ed., p. 487.',
    v: 'VALIDADA'
  },
  'simu 9 comentado_132': {
    e: 'Lenguaje similar al natural en entonación y estructura, pero con palabras totalmente inventadas y con un sentido propio para el hablante:',
    o: {
      a: 'Glosomanía',
      b: 'Paralogismo',
      c: 'Criptolalia',
      d: 'Pararrespuestas'
    },
    c: 'c',
    x: 'La criptolalia es un lenguaje privado o secreto, construido con palabras inventadas que poseen un significado propio para quien habla.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología del lenguaje.',
    v: 'VALIDADA'
  },
  'SmCm20PIR2025 (1)_109': {
    e: 'Alteración del lenguaje caracterizada por ritmo acelerado y dificultad para interrumpir al paciente:',
    o: {
      a: 'Taquilalia',
      b: 'Bradilalia',
      c: 'Mutismo',
      d: 'Logorrea'
    },
    c: 'd',
    x: 'La logorrea consiste en una producción verbal abundante, acelerada y difícil de interrumpir. La taquilalia alude específicamente al aumento de la velocidad del habla.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología del lenguaje.',
    v: 'VALIDADA'
  },
  'SmCm20PIR2025 (1)_110': {
    e: 'Alteración de la prosodia del lenguaje, con entonación monótona o inapropiada:',
    o: {
      a: 'Disprosodia',
      b: 'Disartria',
      c: 'Disfonía',
      d: 'Bradilalia'
    },
    c: 'a',
    x: 'La disprosodia es la alteración del ritmo, la melodía o la entonación del habla. La disartria afecta a la articulación, la disfonía a la voz y la bradilalia a la velocidad.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología del lenguaje.',
    v: 'VALIDADA'
  },
  'SmCm30PIR2025 (1)_057': {
    e: 'A diferencia de los delirios, las ideas sobrevaloradas:',
    o: {
      a: 'Tienen menor grado de validación social.',
      b: 'Tienen menor comprensibilidad psicológica.',
      c: 'Están centradas en un solo tema que persiste invariable durante meses o años.',
      d: 'Conllevan implicación emocional.'
    },
    c: 'c',
    x: 'Las ideas sobrevaloradas suelen centrarse en un único tema que puede persistir durante meses o años. Poseen mayor validación social y comprensibilidad psicológica que los delirios; ambos pueden conllevar implicación emocional.',
    r: 'Belloch, Sandín y Ramos. Manual de psicopatología: psicopatología del pensamiento.',
    v: 'VALIDADA'
  }
};

for (const q of questions) {
  if (updates[q.id]) Object.assign(q, updates[q.id]);
}

const missing = Object.keys(updates).filter(id => !questions.some(q => q.id === id));
if (missing.length) throw new Error(`No encontradas: ${missing.join(', ')}`);

fs.writeFileSync(file, `${JSON.stringify(data)}\n`);
console.log(`Actualizadas ${Object.keys(updates).length} preguntas.`);
