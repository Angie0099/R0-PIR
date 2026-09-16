const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'psicopatologia.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Psicopatología del pensamiento';
const block = bank.filter(q => q.t?.includes(topic)).slice(20, 40);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque 21-40`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_163', {
  e: '¿Qué diferencia principal existe entre descarrilamiento e incoherencia?',
  o: {
    a: 'En el descarrilamiento las frases pueden comprenderse por separado aunque falte cohesión entre ideas; en la incoherencia el discurso llega a resultar ininteligible.',
    b: 'El descarrilamiento solo aparece al responder preguntas y la incoherencia solo en monólogos.',
    c: 'La incoherencia conserva siempre una conexión lógica clara entre las palabras.',
    d: 'Son fenómenos idénticos sin diferencias de gravedad o estructura.'
  },
  c: 'a',
  x: 'En el descarrilamiento las proposiciones suelen estar bien formadas, pero las ideas se enlazan de modo débil, oblicuo o inexistente. En la incoherencia o esquizoafasia también se altera la organización interna de frases o palabras, hasta volver el discurso difícil de comprender o ininteligible.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_064', {
  e: '¿Qué proceso favorece que un pensamiento intruso se transforme en una obsesión clínica persistente?',
  o: {
    a: 'Interpretarlo como muy significativo o peligroso e intentar controlarlo o neutralizarlo repetidamente.',
    b: 'Considerarlo un acontecimiento mental irrelevante y dejarlo pasar.',
    c: 'No experimentar nunca malestar ante su aparición.',
    d: 'Que su contenido sea necesariamente verdadero.'
  },
  c: 'a',
  x: 'Los pensamientos intrusos son comunes. La valoración disfuncional del pensamiento —por ejemplo, como señal de peligro, culpa o responsabilidad— y los intentos reiterados de supresión o neutralización aumentan su importancia, persistencia e interferencia.',
  r: 'Belloch, A., Morillo, C. y Giménez, A. (2004). Effects of suppressing neutral and obsession-like thoughts in normal subjects: beyond frequency. Behaviour Research and Therapy, 42, 841-857; Belloch et al. (2024).'
});

set('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_044', {
  e: '¿Qué diferencia el habla distraída del bloqueo del pensamiento?',
  o: {
    a: 'En el habla distraída el discurso cambia por un estímulo nuevo del entorno; en el bloqueo se interrumpe súbitamente y la persona puede perder lo que iba a decir.',
    b: 'En el bloqueo siempre se alcanza finalmente la meta mediante muchos detalles.',
    c: 'El habla distraída consiste en repetir literalmente al interlocutor.',
    d: 'No existe diferencia entre ambos fenómenos.'
  },
  c: 'a',
  x: 'El habla distraída cambia de rumbo porque la atención queda captada por estímulos inmediatos. En el bloqueo se produce una parada brusca antes de completar la idea y, tras ella, la persona puede no recordar qué estaba diciendo.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

set('PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_031', {
  e: 'Una persona responde de forma muy indirecta, introduce numerosos detalles y paréntesis, pero finalmente contesta a la pregunta. ¿Qué alteración presenta?',
  o: { a: 'Circunstancialidad.', b: 'Tangencialidad.', c: 'Pérdida de meta.', d: 'Bloqueo.' },
  c: 'a',
  x: 'En la circunstancialidad o pensamiento prolijo se aportan detalles excesivos y el discurso tarda en alcanzar su objetivo, pero finalmente llega a él. En la tangencialidad y la pérdida de meta no se alcanza la respuesta o conclusión.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_071', {
  e: 'Tras una discusión menor que no modifica la convivencia, una persona concluye: «Soy un fracaso; mi matrimonio está completamente roto». ¿Qué distorsión cognitiva destaca?',
  o: { a: 'Pensamiento dicotómico o absolutista.', b: 'Personalización.', c: 'Lectura de mente.', d: 'Abstracción selectiva.' },
  c: 'a',
  x: 'La situación se interpreta en categorías extremas y sin grados intermedios: una dificultad puntual equivale a un fracaso total y a una ruptura completa. Esto caracteriza el pensamiento dicotómico o de todo o nada.',
  r: 'Beck, A. T., Rush, A. J., Shaw, B. F. y Emery, G. (1979). Cognitive Therapy of Depression. Guilford Press; Belloch et al. (2024).'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_059', {
  e: 'Mientras relata su historia, una persona interrumpe la frase al fijarse en una fotografía, después en los rascacielos y finalmente en el jersey del entrevistador. ¿Qué alteración presenta?',
  o: { a: 'Habla distraída.', b: 'Circunstancialidad.', c: 'Ilogicidad.', d: 'Habla afectada.' },
  c: 'a',
  x: 'El discurso cambia repetidamente porque estímulos externos inmediatos captan la atención. Esta es la característica del habla distraída; también se ha denominado pensamiento divergente, saltígrado o asíndesis en algunas clasificaciones.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_074');
set('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_050');

set('PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_069', {
  e: 'En la clasificación de Andreasen, ¿cuál constituye un trastorno formal negativo del pensamiento?',
  o: { a: 'Pobreza del habla o alogia.', b: 'Presión del habla.', c: 'Incoherencia.', d: 'Ilogicidad.' },
  c: 'a',
  x: 'La pobreza del habla o alogia se considera un trastorno formal negativo porque implica disminución de la producción verbal. Presión del habla, incoherencia e ilogicidad se incluyen entre los fenómenos formales positivos.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_072', {
  e: '¿Qué característica define la perseveración?',
  o: {
    a: 'La repetición persistente de palabras, ideas o temas cuando ya no son pertinentes.',
    b: 'La repetición inmediata de lo pronunciado por otra persona.',
    c: 'La selección de palabras por su sonido.',
    d: 'La interrupción súbita del discurso con pérdida de la idea.'
  },
  c: 'a',
  x: 'La perseveración consiste en volver repetidamente a una respuesta, palabra, idea o tema más allá del momento en que resulta adecuado. La repetición del interlocutor es ecolalia; elegir por sonido es resonancia, y la parada súbita es bloqueo.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.).'
});

set('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_132', {
  e: 'Ante distintas preguntas, una persona vuelve reiteradamente a «Vallecas, Madrid», aunque esa respuesta haya dejado de ser pertinente. ¿Qué alteración presenta?',
  o: { a: 'Perseveración.', b: 'Ecolalia.', c: 'Pobreza del contenido del habla.', d: 'Tangencialidad.' },
  c: 'a',
  x: 'La reiteración persistente del mismo contenido, aun cuando cambia la demanda conversacional, ejemplifica perseveración. No es ecolalia porque no repite las palabras del entrevistador.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.).'
});

set('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_149', {
  e: '¿Qué afirmación describe correctamente el estudio clásico de la comunicación desviada de Singer y Wynne?',
  o: {
    a: 'Se desarrollaron criterios para codificar defectos y desviaciones comunicativas en respuestas al Rorschach y al TAT.',
    b: 'Describe exclusivamente un lenguaje excesivamente concreto y rígido.',
    c: 'Fue propuesta por Freeman y Freeman.',
    d: 'Solo puede evaluarse mediante pruebas de inteligencia.'
  },
  c: 'a',
  x: 'Singer y Wynne elaboraron manuales para puntuar defectos y desviaciones comunicativas en protocolos del Rorschach y del TAT. El constructo describe comunicación vaga, fragmentada, contradictoria o difícil de compartir, no un estilo simplemente concreto.',
  r: 'Singer, M. T. y Wynne, L. C. (1966). Principles for scoring communication defects and deviances in parents of schizophrenics: Rorschach and TAT scoring manuals. Psychiatry, 29, 260-288.'
});

set('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_077', {
  e: 'Una persona razona: «Todo lo que sirve para criarte es un padre; una roca puede enseñarte algo; por tanto, una roca es un padre». ¿Qué alteración presenta?',
  o: { a: 'Ilogicidad.', b: 'Descarrilamiento.', c: 'Pérdida de meta.', d: 'Habla distraída.' },
  c: 'a',
  x: 'La conclusión no se deriva lógicamente de las premisas, por lo que el ejemplo corresponde a ilogicidad. El discurso mantiene el tema y no cambia por estímulos externos, lo que descarta pérdida de meta y habla distraída.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

set('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_035');

set('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_060', {
  e: '¿Cómo se denomina el discurso que llega a ser prácticamente ininteligible porque palabras o frases se unen sin conexión lógica o significativa?',
  o: { a: 'Incoherencia o esquizoafasia.', b: 'Tangencialidad.', c: 'Circunstancialidad.', d: 'Bloqueo.' },
  c: 'a',
  x: 'La incoherencia, esquizoafasia o «ensalada de palabras» describe un discurso cuya organización interna está tan alterada que resulta difícil o imposible comprenderlo. Debe descartarse que se explique mejor por una afasia.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_069', {
  e: '¿Qué alteración se aplica específicamente a respuestas que se apartan de la pregunta y no llegan a contestarla, más que a transiciones del habla espontánea?',
  o: { a: 'Tangencialidad.', b: 'Descarrilamiento.', c: 'Resonancia.', d: 'Perseveración.' },
  c: 'a',
  x: 'La tangencialidad describe respuestas oblicuas, distantes o irrelevantes que no alcanzan el objetivo de la pregunta. El descarrilamiento se valora principalmente en el flujo del habla espontánea.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_078', {
  e: 'En la organización didáctica utilizada por el manual, ¿qué alteración se clasifica como pensamiento desorganizado?',
  o: { a: 'Circunstancialidad.', b: 'Alogia.', c: 'Neologismo.', d: 'Perseveración.' },
  c: 'a',
  x: 'En la clasificación didáctica del manual, la circunstancialidad se incluye entre los fenómenos desorganizados. La alogia es negativa; neologismo y perseveración se describen como alteraciones formales sin esa adscripción específica en dicha tabla.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), clasificación de los trastornos formales del pensamiento.'
});

set('SEPTIEMBRE-UNO-24_COMENTADO_141', {
  e: '¿Cómo se denomina la disminución de la cantidad de lenguaje espontáneo, con respuestas breves, concretas y poco elaboradas?',
  o: { a: 'Pobreza del habla o laconismo.', b: 'Circunstancialidad.', c: 'Parafasia.', d: 'Presión del habla.' },
  c: 'a',
  x: 'La pobreza del habla o laconismo implica una reducción de la producción verbal espontánea. Se diferencia de la pobreza del contenido, en la que puede hablarse mucho pero transmitirse poca información.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('SIM_ABR25_027', {
  e: '¿Qué rasgo permite distinguir la circunstancialidad de la tangencialidad?',
  o: {
    a: 'En la circunstancialidad se alcanza finalmente la meta; en la tangencialidad no se responde a la pregunta.',
    b: 'La circunstancialidad siempre vuelve el discurso ininteligible.',
    c: 'La tangencialidad se limita a repetir palabras del interlocutor.',
    d: 'No existe ninguna diferencia entre ambas.'
  },
  c: 'a',
  x: 'Ambas pueden producir respuestas indirectas. La diferencia esencial es que en la circunstancialidad los detalles retrasan la respuesta, pero se llega a ella; en la tangencialidad la respuesta se desvía y no alcanza el punto solicitado.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

set('SIM_ABR25_041', {
  e: 'En la circunstancialidad o pensamiento prolijo, ¿qué ocurre con la meta del discurso?',
  o: { a: 'Se alcanza, aunque después de numerosos detalles y rodeos.', b: 'Se pierde definitivamente.', c: 'Se interrumpe por una parada súbita.', d: 'Se sustituye por palabras elegidas por su sonido.' },
  c: 'a',
  x: 'La persona conserva la meta y termina respondiendo, aunque lo hace de forma indirecta, tediosa y con detalles accesorios. Si nunca llega a contestar, debe considerarse tangencialidad o pérdida de meta según el contexto.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

for (const q of block) set(q.id);
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 21-40 de psicopatología del pensamiento reauditorado: 20 validadas.');
