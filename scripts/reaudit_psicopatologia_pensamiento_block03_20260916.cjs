const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'psicopatologia.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Psicopatología del pensamiento';
const candidates = bank.filter(q => q.t?.includes(topic)).slice(40, 61);
if (candidates.length !== 21) throw new Error(`Se esperaban 21 candidatas y se encontraron ${candidates.length}`);

const misplacedId = 'Simu 15 comentado_111';
const misplaced = candidates.find(q => q.id === misplacedId);
if (!misplaced) throw new Error('No se encontró la pregunta cenestésica');
misplaced.t = ['Psicopatología de la sensopercepción'];
misplaced.v = 'REVISAR';

const block = candidates.filter(q => q.id !== misplacedId);
if (block.length !== 20) throw new Error(`Tras la reubicación debían quedar 20 preguntas y quedan ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque auditado`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('SIM_ABR25_071', {
  e: '¿Qué son las pararrespuestas?',
  o: {
    a: 'Respuestas cuyo contenido no guarda relación con la pregunta formulada.',
    b: 'Respuestas muy detalladas que finalmente alcanzan la meta.',
    c: 'Repeticiones literales de las palabras del entrevistador.',
    d: 'Interrupciones súbitas del discurso con pérdida de la idea.'
  },
  c: 'a',
  x: 'Las pararrespuestas son contestaciones que no corresponden al contenido de la pregunta. Deben distinguirse de la tangencialidad, donde puede existir una relación distante u oblicua, y de la circunstancialidad, donde finalmente se responde.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});

set('SIM_ABR25_203', {
  e: '¿Qué diferencia la pobreza del contenido del habla de la pobreza del habla?',
  o: {
    a: 'En la primera puede existir abundante discurso con poca información; en la segunda disminuye la cantidad de lenguaje espontáneo.',
    b: 'La pobreza del contenido implica siempre mutismo completo.',
    c: 'La pobreza del habla se caracteriza por una producción verbal excesiva.',
    d: 'Ambas expresiones son sinónimos exactos.'
  },
  c: 'a',
  x: 'La pobreza del contenido se refiere a un discurso vago, repetitivo o poco informativo pese a tener extensión suficiente. La pobreza del habla o laconismo consiste en una reducción de la producción verbal espontánea.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('Simu 11 comentado_008', {
  e: '¿Qué término utiliza Andreasen para valorar globalmente la reducción de la producción verbal espontánea?',
  o: { a: 'Alogia.', b: 'Presión del habla.', c: 'Descarrilamiento.', d: 'Incoherencia.' },
  c: 'a',
  x: 'La alogia agrupa manifestaciones negativas del lenguaje y pensamiento, especialmente la pobreza del habla y, según la evaluación clínica, la reducción de contenido informativo. Presión, descarrilamiento e incoherencia son fenómenos productivos o desorganizados.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('Simu 11 comentado_135', {
  e: '¿Qué rasgo ayuda a distinguir el descarrilamiento de la fuga de ideas?',
  o: {
    a: 'En la fuga suele existir aceleración y asociaciones todavía comprensibles; en el descarrilamiento los enlaces entre ideas son débiles, oblicuos o inexistentes.',
    b: 'El descarrilamiento siempre termina respondiendo después de muchos detalles.',
    c: 'La fuga de ideas se define por una reducción extrema del habla.',
    d: 'Ambos fenómenos son necesariamente idénticos.'
  },
  c: 'a',
  x: 'La fuga de ideas aparece típicamente en un discurso acelerado, con rápidos cambios temáticos unidos por asociaciones reconocibles. En el descarrilamiento se deteriora la cohesión y las ideas se yuxtaponen mediante vínculos remotos o incomprensibles.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.); Andreasen (1979).'
});

set('Simu 15 comentado_113');

set('Simu 15 comentado_114', {
  e: 'Una persona habla con rapidez y de forma difícil de interrumpir, como si sintiera urgencia por seguir hablando. ¿Qué alteración presenta?',
  o: { a: 'Presión del habla.', b: 'Bloqueo.', c: 'Pobreza del habla.', d: 'Mutismo.' },
  c: 'a',
  x: 'La presión del habla consiste en un aumento de la cantidad y velocidad del discurso, que puede resultar difícil de interrumpir. Es frecuente en la manía y puede acompañarse de fuga de ideas, aunque ambos conceptos no son equivalentes.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('Simu 16 comentado_004', {
  e: '¿Qué diferencia la glosolalia de una ensalada de palabras sin reglas estables?',
  o: {
    a: 'La glosolalia puede constituir un lenguaje personal con pautas propias y sentido para el hablante.',
    b: 'La glosolalia consiste únicamente en repetir obscenidades.',
    c: 'La glosolalia es siempre una repetición literal del interlocutor.',
    d: 'No existe ninguna diferencia posible.'
  },
  c: 'a',
  x: 'En la descripción clásica, la glosolalia es un lenguaje personal con vocabulario y sintaxis propios que puede conservar una regla interna y resultar traducible si se conoce. La ensalada de palabras carece de conexión comprensible y estable.',
  r: 'Vallejo Ruiloba, J. (dir.) (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier.'
});

set('Simu 16 comentado_010', {
  e: '¿Qué variante de contenido nihilista aparece cuando una persona sostiene que sus órganos han desaparecido o han dejado de funcionar?',
  o: { a: 'Delirio nihilista somático.', b: 'Delirio de referencia.', c: 'Delirio de grandeza.', d: 'Delirio erotomaníaco.' },
  c: 'a',
  x: 'El contenido nihilista puede afectar a la propia existencia, al cuerpo, a otras personas o al mundo. Cuando se niega la existencia o funcionamiento de órganos se habla de una expresión somática del delirio nihilista, frecuente en el síndrome de Cotard.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.); Vallejo Ruiloba (2025).'
});

set('Simu 32 comentado hardcore 2_110');

set('Simu 32 comentado hardcore 2_117', {
  e: '¿Qué afirmación describe correctamente el sesgo de «salto a las conclusiones» relacionado con los delirios?',
  o: {
    a: 'Se toman decisiones con muy poca evidencia, lo que puede contribuir a formar o mantener creencias delirantes.',
    b: 'Consiste en recopilar más información de la necesaria antes de decidir.',
    c: 'Es un razonamiento necesariamente lento, deliberado y analítico.',
    d: 'Solo aparece en personas sin síntomas psicóticos.'
  },
  c: 'a',
  x: 'El salto a las conclusiones consiste en aceptar una hipótesis basándose en escasa información. Se asocia a un estilo rápido o intuitivo de razonamiento y puede favorecer la formación o persistencia de delirios, aunque no es exclusivo de la psicosis.',
  r: 'Garety, P. A. y Freeman, D. (2013). The past and future of delusions research. Schizophrenia Bulletin, 39, 1179-1184.'
});

set('Simu 32 comentado hardcore 2_209', {
  e: '¿Qué característica define la incoherencia o esquizoafasia?',
  o: {
    a: 'Las frases o palabras se organizan sin conexión adecuada y el discurso puede resultar ininteligible.',
    b: 'La respuesta se llena de detalles, pero finalmente alcanza la meta.',
    c: 'La producción verbal disminuye hasta respuestas monosilábicas.',
    d: 'Se repiten literalmente las palabras del interlocutor.'
  },
  c: 'a',
  x: 'En la incoherencia o esquizoafasia se pierde la organización lógica o significativa dentro del discurso, que llega a ser difícil de comprender. Debe descartarse una afasia como explicación primaria.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('Simu 7 comentado _109', {
  e: '¿En qué consiste el delirio de paramentos?',
  o: {
    a: 'En creer que personas, sustancias, radiaciones, sonidos u otros agentes atraviesan barreras que normalmente impedirían su paso.',
    b: 'En atribuir un significado autorreferencial a una percepción normal.',
    c: 'En creer que se han perdido todas las posesiones materiales.',
    d: 'En negar la existencia del propio cuerpo.'
  },
  c: 'a',
  x: 'El delirio de paramentos se centra en la supuesta capacidad de agentes, materiales o influencias para atravesar paredes, puertas, el cuerpo u otras estructuras que normalmente actuarían como barrera.',
  r: 'Vallejo Ruiloba, J. (dir.) (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier, psicopatología del pensamiento.'
});

set('simu 9 comentado_133', {
  e: '¿Cuál es el orden clásico de las fases descritas por Klaus Conrad en el desarrollo del delirio esquizofrénico?',
  o: {
    a: 'Trema, apofanía, anástrofe, apocalipsis y residuo.',
    b: 'Anástrofe, trema, residuo, apofanía y apocalipsis.',
    c: 'Apofanía, trema, apocalipsis, anástrofe y residuo.',
    d: 'Trema, apocalipsis, residuo, anástrofe y apofanía.'
  },
  c: 'a',
  x: 'Conrad describió una secuencia fenomenológica que comienza con el trema o tensión prodrómica, continúa con la apofanía y la anástrofe, puede culminar en una fase apocalíptica y finalizar en un residuo o consolidación.',
  r: 'Conrad, K. (1958/1997). La esquizofrenia incipiente; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología.'
});

set('SM_ABRIL_1_SOL_1_055', {
  e: '¿Cuál de las siguientes NO es una característica habitual de los pensamientos automáticos negativos?',
  o: {
    a: 'Ser egodistónicos y vivirse como completamente ajenos a las propias creencias.',
    b: 'Ser concretos, específicos y breves.',
    c: 'Aparecer de forma espontánea en el flujo del pensamiento.',
    d: 'Parecer plausibles y coherentes con las creencias de la persona.'
  },
  c: 'a',
  x: 'Los pensamientos automáticos negativos suelen ser breves, espontáneos, concretos y aceptados como plausibles; por ello guardan sintonía con las creencias activadas. La egodistonía es más característica de las obsesiones.',
  r: 'Beck, A. T., Rush, A. J., Shaw, B. F. y Emery, G. (1979). Cognitive Therapy of Depression. Guilford Press; Belloch et al. (2024).'
});

set('SM_ABRIL_1_SOL_1_056', {
  e: 'Una persona experimenta que el mundo ha cambiado de forma indefinible, inquietante y siniestra, y siente que algo importante está a punto de ocurrir. ¿Qué vivencia delirante primaria presenta?',
  o: { a: 'Atmósfera o humor delirante.', b: 'Percepción delirante.', c: 'Recuerdo delirante.', d: 'Intuición delirante.' },
  c: 'a',
  x: 'La atmósfera o humor delirante es una vivencia global de extrañeza y transformación del mundo, todavía vaga y difícil de concretar. Puede preceder a la cristalización de una explicación delirante más definida.',
  r: 'Jaspers, K. (1913/1997). General Psychopathology; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología.'
});

set('SM_ABRIL_2_SOL_1_079');

set('SM_AGOSTO_1_SOL_1_059', {
  e: 'Respecto al contenido, ¿qué relación existe entre los pensamientos intrusos ocasionales y las obsesiones clínicas?',
  o: {
    a: 'Pueden compartir contenidos; la diferencia clínica depende sobre todo de valoración, persistencia, malestar, neutralización e interferencia.',
    b: 'Las intrusiones normales nunca contienen temas agresivos, sexuales o blasfemos.',
    c: 'Solo las obsesiones pueden aparecer de forma involuntaria.',
    d: 'El contenido permite siempre distinguirlas sin valorar su impacto.'
  },
  c: 'a',
  x: 'Intrusiones y obsesiones pueden presentar contenidos similares. La diferencia es principalmente cuantitativa y funcional: significado atribuido, frecuencia, control, resistencia, malestar, neutralización e interferencia.',
  r: 'Belloch, A., Morillo, C. y Giménez, A. (2004). Behaviour Research and Therapy, 42, 841-857; Belloch et al. (2024).'
});

set('SM_DICIEMBRE_1_SOL_1_028', {
  e: 'En la comparación de pensamientos repetitivos, ¿qué diferencia hay entre egosintonía con el contenido y egosintonía con la recurrencia?',
  o: {
    a: 'Una persona puede aceptar el contenido como coherente con sus creencias y, al mismo tiempo, rechazar que el pensamiento reaparezca de forma persistente.',
    b: 'Ambos términos significan exactamente lo mismo.',
    c: 'La recurrencia siempre se desea en preocupaciones, rumiaciones y obsesiones.',
    d: 'La egosintonía solo puede aplicarse a conductas motoras.'
  },
  c: 'a',
  x: 'La egosintonía con el contenido alude a cuánto se acepta o considera propio lo pensado; la egosintonía con la recurrencia se refiere a si se desea que el pensamiento siga apareciendo. Una persona puede creer el contenido y, sin embargo, vivir su repetición como indeseada.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), pensamientos repetitivos.'
});

set('SM_DICIEMBRE_2_SOL_1_056', {
  e: 'En el modelo de Conrad, ¿qué caracteriza la fase de apofanía?',
  o: {
    a: 'La atribución de nuevos significados anómalos a acontecimientos y percepciones, con sensación de revelación.',
    b: 'La recuperación completa y crítica del episodio.',
    c: 'La ausencia total de significado en la experiencia.',
    d: 'Un estado de coma sin actividad mental.'
  },
  c: 'a',
  x: 'En la apofanía, elementos previamente neutros adquieren un significado nuevo, especial y autorreferencial. Sigue al trema y contribuye a la organización progresiva del mundo delirante.',
  r: 'Conrad, K. (1958/1997). La esquizofrenia incipiente; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología.'
});

set('SM_DICIEMBRE_2_SOL_1_075', {
  e: 'Según Maher, ¿cómo se originan principalmente los delirios?',
  o: {
    a: 'Como explicaciones construidas mediante procesos de razonamiento ordinarios ante experiencias perceptivas anómalas o inusuales.',
    b: 'Por un razonamiento formal necesariamente distinto y aberrante desde su inicio.',
    c: 'Sin ninguna experiencia previa que requiera explicación.',
    d: 'Como decisiones plenamente voluntarias y estratégicas.'
  },
  c: 'a',
  x: 'Maher propuso que el delirio puede ser una explicación racional desde la perspectiva de quien intenta comprender una experiencia anómala. Los procesos inferenciales básicos no tendrían que ser cualitativamente diferentes de los usados para formar otras creencias.',
  r: 'Maher, B. A. (1974). Delusional thinking and perceptual disorder. Journal of Individual Psychology, 30, 98-113; Belloch et al. (2024).'
});

for (const q of block) set(q.id);
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 41-60 reauditorado: 20 preguntas del tema validadas y 1 reubicada en sensopercepción.');
