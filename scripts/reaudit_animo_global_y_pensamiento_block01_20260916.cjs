const fs = require('fs');
const path = require('path');

const bankDir = path.join(__dirname, '..', 'public', 'banco');
const treatmentsFile = path.join(bankDir, 'tratamientos_adultos.json');
const psychopathologyFile = path.join(bankDir, 'psicopatologia.json');
const clinicalFile = path.join(bankDir, 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const psychopathology = JSON.parse(fs.readFileSync(psychopathologyFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));

function updateIn(bank, id, changes) {
  const q = bank.find(item => item.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

// Segunda pasada global: diversificación de solapamientos conceptuales en tratamientos del ánimo.
updateIn(treatments, 'MAYO-UNO-24_COMENTADO_092', {
  e: 'En la fase inicial de la terapia interpersonal, ¿para qué se realiza el inventario interpersonal?',
  o: {
    a: 'Para revisar las relaciones significativas, sus cambios recientes y su posible vínculo con el episodio depresivo.',
    b: 'Para medir exclusivamente la inteligencia general.',
    c: 'Para reconstruir toda la infancia sin atender al presente.',
    d: 'Para diagnosticar rasgos de personalidad de forma aislada.'
  },
  c: 'a',
  x: 'El inventario interpersonal revisa las relaciones actuales y pasadas relevantes, las expectativas, los apoyos, los conflictos y los cambios recientes. Esta información permite formular el vínculo entre síntomas y contexto interpersonal y seleccionar el foco del tratamiento.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

updateIn(treatments, 'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_179', {
  e: 'En la terapia interpersonal y de ritmos sociales, ¿para qué se utiliza la Métrica de Ritmo Social?',
  o: {
    a: 'Para registrar la regularidad de actividades cotidianas y su relación con el estado de ánimo.',
    b: 'Para medir únicamente síntomas psicóticos.',
    c: 'Para sustituir toda entrevista clínica.',
    d: 'Para calcular concentraciones plasmáticas de litio.'
  },
  c: 'a',
  x: 'La Métrica de Ritmo Social registra actividades que estructuran el día —como levantarse, acostarse, comer o mantener contactos— y su regularidad. Facilita detectar alteraciones de las rutinas asociadas a cambios del estado de ánimo y planificar su estabilización.',
  r: 'Frank, E. (2005). Treating Bipolar Disorder: A Clinician’s Guide to Interpersonal and Social Rhythm Therapy. Guilford Press.'
});

updateIn(treatments, 'SIM_PERS_AGO25_017', {
  e: 'En terapia interpersonal, ¿qué posibles fases se consideran al trabajar una disputa de rol?',
  o: {
    a: 'Renegociación, impasse y disolución.',
    b: 'Exposición, habituación y prevención de respuesta.',
    c: 'Manía, hipomanía y eutimia.',
    d: 'Asociación libre, interpretación y transferencia.'
  },
  c: 'a',
  x: 'Las disputas interpersonales pueden encontrarse en renegociación, cuando aún es posible modificar expectativas; en impasse, cuando el conflicto permanece estancado; o en disolución, cuando se contempla finalizar o transformar sustancialmente la relación.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

updateIn(treatments, 'SmCm29PIR2025_169', {
  e: 'En terapia interpersonal, ¿qué objetivo es característico al trabajar déficits interpersonales?',
  o: {
    a: 'Ampliar oportunidades de relación y mejorar habilidades para iniciar y mantener vínculos satisfactorios.',
    b: 'Evitar todo contacto social hasta que remita la depresión.',
    c: 'Interpretar exclusivamente sueños recurrentes.',
    d: 'Modificar de manera directa y completa la personalidad.'
  },
  c: 'a',
  x: 'Cuando predominan aislamiento, soledad o relaciones escasas e insatisfactorias, la TIP explora patrones relacionales, utiliza la propia relación terapéutica como fuente de información y favorece habilidades y oportunidades para construir nuevos vínculos.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

updateIn(treatments, 'Simu 14 comentado _096', {
  e: 'Si una persona con trastorno bipolar desarrolla manía o hipomanía mientras toma un antidepresivo en monoterapia, ¿qué actuación recomienda NICE?',
  o: {
    a: 'Aumentar automáticamente el antidepresivo.',
    b: 'Considerar suspender el antidepresivo y ofrecer un antipsicótico indicado para la manía.',
    c: 'Mantenerlo sin cambios y evitar cualquier tratamiento antimaníaco.',
    d: 'Añadir otro antidepresivo de una clase diferente.'
  },
  c: 'b',
  x: 'Si aparece manía o hipomanía durante una monoterapia antidepresiva, NICE aconseja considerar su suspensión y ofrecer un antipsicótico apropiado, independientemente de que finalmente se retire el antidepresivo.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendación 1.5.2.'
});

updateIn(treatments, 'SmCm09PIR2025_022', {
  e: '¿Cómo aborda la terapia interpersonal y de ritmos sociales la medicación en el trastorno bipolar?',
  o: {
    a: 'Incluye psicoeducación y apoyo a la adherencia como complemento del tratamiento farmacológico.',
    b: 'Exige retirar sistemáticamente la medicación al iniciar la psicoterapia.',
    c: 'Considera irrelevantes los efectos adversos y las dificultades de adherencia.',
    d: 'Sustituye el tratamiento antimaníaco durante los episodios agudos.'
  },
  c: 'a',
  x: 'La IPSRT se utiliza normalmente junto con farmacoterapia. Incluye educación sobre el trastorno y ayuda para identificar y resolver barreras de adherencia; no plantea retirar de forma sistemática el tratamiento farmacológico.',
  r: 'Frank, E. (2005). Treating Bipolar Disorder: A Clinician’s Guide to Interpersonal and Social Rhythm Therapy. Guilford Press.'
});

updateIn(treatments, 'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_082', {
  e: 'En el seguimiento del trastorno bipolar, ¿qué debe incluir un plan individual para mantenerse estable y afrontar recaídas?',
  o: {
    a: 'Desencadenantes personales, signos de alarma tempranos y respuestas acordadas ante una posible recaída.',
    b: 'Solo el nombre del diagnóstico.',
    c: 'La promesa de que nunca aparecerá otro episodio.',
    d: 'La retirada automática de toda medicación ante el primer cambio de ánimo.'
  },
  c: 'a',
  x: 'El plan de prevención debe identificar desencadenantes y pródromos de manía y depresión, estrategias de autocuidado y los pasos que seguir si aparecen signos de recaída, incluyendo vías de contacto y apoyo profesional.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.4.1 y 1.7.1-1.7.4.'
});

// Criba temática de las primeras preguntas de psicopatología del pensamiento.
const thoughtTopic = 'Psicopatología del pensamiento';
const candidates = psychopathology.filter(q => q.t?.includes(thoughtTopic)).slice(0, 23);
if (candidates.length !== 23) throw new Error(`Se esperaban 23 candidatas y se encontraron ${candidates.length}`);

const ticId = '4Simulacro02018Comentarios_002';
const tic = candidates.find(q => q.id === ticId);
if (!tic) throw new Error('No se encontró la pregunta de tics');
if (treatments.some(q => q.id === ticId)) throw new Error(`Ya existe ${ticId} en tratamientos`);
tic.s = 'Tratamientos Adultos';
tic.t = ['Técnicas psicológicas generales'];
tic.e = 'En la inversión del hábito para los tics, ¿cuál es el componente terapéutico central?';
tic.o = { a: 'Entrenamiento en una respuesta incompatible o de competencia.', b: 'Interpretación de sueños.', c: 'Exposición interoceptiva.', d: 'Detención del pensamiento como único procedimiento.' };
tic.c = 'a';
tic.x = 'El entrenamiento en inversión del hábito incluye conciencia del tic y práctica de una respuesta de competencia físicamente incompatible o que dificulta su ejecución. También incorpora motivación, apoyo social y generalización.';
tic.r = 'Azrin, N. H. y Nunn, R. G. (1973). Habit-reversal: a method of eliminating nervous habits and tics. Behaviour Research and Therapy, 11, 619-628.';
tic.v = 'VALIDADA_ORIGINAL';
psychopathology.splice(psychopathology.findIndex(q => q.id === ticId), 1);
treatments.push(tic);

const somaticId = 'AGOSTO2_073';
const somatic = candidates.find(q => q.id === somaticId);
if (!somatic) throw new Error('No se encontró la pregunta de síntomas somáticos');
if (clinical.some(q => q.id === somaticId)) throw new Error(`Ya existe ${somaticId} en clínica de adultos`);
somatic.s = 'Clínica Adultos';
somatic.t = ['Trastornos por síntomas somáticos y relacionados'];
somatic.e = 'Según el DSM-5-TR, ¿qué caracteriza el especificador grave del trastorno de síntomas somáticos?';
somatic.o = { a: 'Solo un pensamiento del criterio B.', b: 'Dos o más elementos del criterio B, sin síntomas somáticos.', c: 'Dos o más elementos del criterio B junto con múltiples quejas somáticas o un síntoma somático muy grave.', d: 'Tres elementos del criterio B, pero ningún deterioro funcional.' };
somatic.c = 'c';
somatic.x = 'El especificador grave exige dos o más elementos del criterio B y, además, múltiples quejas somáticas o un síntoma somático muy grave. La gravedad no se determina únicamente por el número de síntomas físicos.';
somatic.r = 'American Psychiatric Association (2022). DSM-5-TR. Trastorno de síntomas somáticos, especificadores de gravedad.';
somatic.v = 'VALIDADA_ORIGINAL';
psychopathology.splice(psychopathology.findIndex(q => q.id === somaticId), 1);
clinical.push(somatic);

const languageId = 'JULIO2_062';
const language = candidates.find(q => q.id === languageId);
if (!language) throw new Error('No se encontró la pregunta de lenguaje autista');
language.t = ['Psicopatología del lenguaje'];
language.e = '¿Cuál de las siguientes NO es una característica descrita del lenguaje en el autismo?';
language.o = { a: 'Ecolalia inmediata o diferida.', b: 'Uso idiosincrásico o metafórico del lenguaje.', c: 'Neologismos o expresiones peculiares.', d: 'Alexia superficial como rasgo lingüístico característico.' };
language.c = 'd';
language.x = 'En el autismo pueden observarse ecolalia, lenguaje idiosincrásico o metafórico y expresiones peculiares. La alexia superficial es un trastorno adquirido de la lectura y no constituye una característica definitoria del lenguaje autista.';
language.r = 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del lenguaje.';
language.v = 'VALIDADA_ORIGINAL';

const block = candidates.filter(q => ![ticId, somaticId, languageId].includes(q.id));
if (block.length !== 20) throw new Error(`Tras la criba debían quedar 20 preguntas y quedan ${block.length}`);

function thought(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al primer bloque de pensamiento`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

thought('SM_MAYO_1_SOL_1_078', {
  e: 'Una persona pasa espontáneamente de una idea a otra con relaciones oblicuas o inexistentes y el discurso pierde progresivamente su hilo. ¿Qué alteración formal presenta?',
  o: { a: 'Descarrilamiento.', b: 'Presión del habla.', c: 'Circunstancialidad.', d: 'Bloqueo.' },
  c: 'a',
  x: 'En el descarrilamiento o pérdida de asociaciones, las ideas se deslizan hacia otras con vínculos débiles, oblicuos o inexistentes. En la circunstancialidad se termina alcanzando la meta; el bloqueo es una interrupción súbita y la presión del habla alude al aumento de producción verbal.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});

thought('1Simulacro02018Comentarios_085', {
  e: 'Una persona percibe realmente unas motas en la comida y, sin una inferencia comprensible, les atribuye el significado de que su pareja intenta envenenarla. Según Jaspers, se trata de:',
  o: { a: 'Una percepción delirante.', b: 'Una intuición delirante.', c: 'Un recuerdo delirante.', d: 'Un humor delirante.' },
  c: 'a',
  x: 'La percepción delirante combina una percepción real y correctamente identificada con una interpretación delirante inmediata, autorreferencial e incomprensible. En la intuición no existe una percepción desencadenante y el recuerdo delirante parte de un recuerdo.',
  r: 'Jaspers, K. (1913/1997). General Psychopathology; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I.'
});

thought('1Simulacro02018Comentarios_090', {
  x: 'El delirio nihilista consiste en la convicción de que uno mismo, alguna parte del cuerpo, otras personas o el mundo no existen, están vacíos o han desaparecido. No equivale a persecución, referencia ni desrealización no delirante.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});

thought('3Simulacro2018Comentarios_068', {
  e: '¿Cómo se denomina el habla de extensión aparentemente adecuada o excesiva que, sin embargo, transmite muy poca información?',
  o: { a: 'Pobreza del habla.', b: 'Presión del habla.', c: 'Pobreza del contenido del habla.', d: 'Bloqueo.' },
  c: 'c',
  x: 'En la pobreza del contenido del habla, la cantidad de discurso puede ser normal o elevada, pero resulta vago, repetitivo o poco informativo. En la pobreza del habla disminuye la cantidad de lenguaje espontáneo.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

thought('4Simulacro02018Comentarios_217', {
  e: 'Según Jaspers, ¿cuál es la clasificación general de los delirios atendiendo a su comprensibilidad psicológica?',
  o: { a: 'Primarios y secundarios.', b: 'Somáticos y no somáticos.', c: 'Bizarros y no bizarros exclusivamente.', d: 'Persecutorios y grandiosos exclusivamente.' },
  c: 'a',
  x: 'Jaspers distinguió delirios primarios, que surgen como experiencias originarias psicológicamente incomprensibles, y delirios secundarios o ideas deliroides, comprensibles a partir de otros estados afectivos, experiencias o alteraciones.',
  r: 'Jaspers, K. (1913/1997). General Psychopathology.'
});

thought('ABRIL-UNO-24_COMENTADO_133', {
  e: 'Al comparar preocupaciones, rumiaciones, pensamientos automáticos negativos y obsesiones, ¿cuáles suelen presentar un grado de control relativamente mayor, aunque limitado?',
  o: { a: 'Pensamientos automáticos negativos.', b: 'Obsesiones.', c: 'Rumiaciones.', d: 'Preocupaciones patológicas.' },
  c: 'a',
  x: 'En la comparación propuesta por el manual, los pensamientos automáticos negativos muestran un control moderado-bajo, relativamente mayor que el control bajo atribuido a preocupaciones, rumiaciones y obsesiones. Esto no significa que sean voluntarios.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), pensamientos repetitivos.'
});

thought('ABRIL-UNO-24_COMENTADO_169', {
  e: 'Durante el discurso, la persona interrumpe el hilo y cambia de tema porque su atención es captada por estímulos nuevos del entorno. ¿Cómo se denomina esta alteración?',
  o: { a: 'Habla distraída.', b: 'Bloqueo.', c: 'Tangencialidad.', d: 'Pérdida de meta.' },
  c: 'a',
  x: 'En el habla distraída el curso cambia en respuesta a estímulos inmediatos del entorno. En el bloqueo el discurso se detiene súbitamente; en la pérdida de meta se abandona progresivamente el objetivo, y la tangencialidad impide responder de forma directa a una pregunta.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

thought('AGOSTO2_054', {
  e: 'Una persona recibe una indemnización suficiente tras el cierre de su empresa, pero solo atiende a la pérdida y concluye: «Estoy arruinado, terminaré pidiendo limosna». ¿Qué distorsión destaca?',
  o: { a: 'Magnificación de la pérdida y minimización de los recursos disponibles.', b: 'Personalización.', c: 'Lectura de mente.', d: 'Etiquetado de otra persona.' },
  c: 'a',
  x: 'La persona exagera las consecuencias negativas de la pérdida y resta importancia a datos protectores, como la indemnización y la jubilación. Este patrón corresponde a magnificación y minimización.',
  r: 'Beck, A. T., Rush, A. J., Shaw, B. F. y Emery, G. (1979). Cognitive Therapy of Depression. Guilford Press.'
});

thought('AGOSTO2_066', {
  e: 'Una persona responde a una pregunta de forma oblicua o irrelevante y nunca alcanza la respuesta solicitada. ¿Qué alteración formal presenta?',
  o: { a: 'Tangencialidad.', b: 'Circunstancialidad.', c: 'Bloqueo.', d: 'Pobreza del habla.' },
  c: 'a',
  x: 'En la tangencialidad la respuesta guarda, como máximo, una relación distante con la pregunta y no llega al objetivo. En la circunstancialidad aparecen detalles innecesarios, pero finalmente se responde.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});

thought('DICIEMBRE-UNO-24_COMENTADO_124', {
  e: 'Según las categorías derivadas de Singer y Wynne para la comunicación desviada, ¿cuál NO pertenece a ellas?',
  o: { a: 'Información desorganizada.', b: 'Desconexión con el oyente o problemas de referencia.', c: 'Interrupciones y secuencias contradictorias.', d: 'Pensamiento concreto como categoría independiente.' },
  c: 'd',
  x: 'Las categorías incluyen información desorganizada, desconexión con el oyente, anomalías del lenguaje, interrupciones y secuencias contradictorias o arbitrarias. El pensamiento concreto es una alteración formal distinta, no una categoría independiente de esta clasificación.',
  r: 'Singer, M. T. y Wynne, L. C. (1963). Thought disorder and family relations of schizophrenics; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I.'
});

thought('DICIEMBRE-UNO-24_COMENTADO_127', {
  e: '¿Qué pensamiento repetitivo suele experimentarse con bajo control y contenido considerado poco realista o no verdadero por la propia persona?',
  o: { a: 'Obsesión.', b: 'Preocupación cotidiana.', c: 'Pensamiento automático negativo.', d: 'Planificación deliberada.' },
  c: 'a',
  x: 'Las obsesiones se experimentan como intrusas, difíciles de controlar y habitualmente egodistónicas; la persona puede reconocer que su contenido no es realista o no desea aceptarlo como verdadero. El grado de insight puede variar.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), pensamientos repetitivos.'
});

thought('JULIO1_079');
thought('JUNIO-UNO-24_COMENTADO_052');

thought('JUNIO-UNO-24_COMENTADO_058', {
  e: '¿Qué característica distingue habitualmente a las obsesiones clínicas de los pensamientos intrusos ocasionales de la población general?',
  o: { a: 'Consumen mucho tiempo, provocan mayor malestar e interfieren en el flujo consciente y el funcionamiento.', b: 'Siempre se consideran relevantes y aceptables para el yo.', c: 'Generan menor resistencia y menor preocupación por el control.', d: 'Nunca se relacionan con culpa ni responsabilidad.' },
  c: 'a',
  x: 'Las obsesiones clínicas son más persistentes, difíciles de controlar, perturbadoras e interferentes que los pensamientos intrusos ocasionales. Suelen generar resistencia, preocupación por el control y, según el contenido, culpa o responsabilidad.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), pensamientos intrusos y obsesiones.'
});

thought('JUNIO-UNO-24_COMENTADO_064', {
  e: '¿Cuál de las siguientes NO es una manifestación de desconexión con el oyente por problemas de referencia?',
  o: { a: 'Dar instrucciones sin aclarar de qué se habla.', b: 'Realizar una descripción tan vaga que podría referirse a cualquier cosa.', c: 'Introducir una afirmación que contradice arbitrariamente lo dicho antes.', d: 'Usar referentes ambiguos o cambiar de persona, número o tiempo verbal.' },
  c: 'c',
  x: 'Las referencias vagas, ambiguas o cambiantes dificultan que el oyente identifique de qué se habla. Contradecir arbitrariamente información previa corresponde a la categoría de secuencias contradictorias o arbitrarias.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), comunicación desviada.'
});

thought('JUNIO-UNO-24_COMENTADO_070', {
  e: '¿Qué alteración consiste en fracasar al seguir una cadena de pensamientos hasta su conclusión, alejándose del tema inicial sin regresar a él?',
  o: { a: 'Pérdida de meta.', b: 'Bloqueo.', c: 'Ilogicidad.', d: 'Pobreza del habla.' },
  c: 'a',
  x: 'En la pérdida de meta el discurso comienza orientado a un objetivo, pero se desvía progresivamente y no alcanza la conclusión. El bloqueo es una parada brusca y la ilogicidad afecta la relación entre premisas y conclusiones.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});

thought('JUNIO1_085', {
  e: 'La creación y uso de una palabra o expresión nueva sin significado generalmente aceptado se denomina:',
  o: { a: 'Neologismo.', b: 'Ecolalia.', c: 'Resonancia.', d: 'Pobreza del habla.' },
  c: 'a',
  x: 'El neologismo es una palabra o expresión creada por la persona y carente de significado compartido. Se diferencia de las aproximaciones a palabras o parafasias, que suelen conservar las reglas formativas del idioma y permiten reconocer el término pretendido.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321; Belloch et al. (2024).'
});

thought('MAYO-UNO-24_COMENTADO_203', {
  e: 'En la frase «En las meserías se asientan las orugas como si fueran aspírides», las palabras inventadas y sin significado compartido ejemplifican:',
  o: { a: 'Neologismos.', b: 'Pobreza del habla.', c: 'Ecolalia.', d: 'Habla afectada.' },
  c: 'a',
  x: 'Las palabras creadas sin significado generalmente aceptado son neologismos. Una aproximación a palabras conserva reglas del idioma y suele permitir reconocer el término pretendido, como «jarabemento» por jarabe.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento y del lenguaje.'
});

thought('MAYO2_042', {
  e: 'En la respuesta «Fina, lipina, si te soy sincera, Vera», la elección de palabras guiada por la rima y no por el significado se denomina:',
  o: { a: 'Resonancia o asociación por sonidos.', b: 'Ecolalia.', c: 'Habla afectada.', d: 'Bloqueo.' },
  c: 'a',
  x: 'En la resonancia, también llamada asociación por sonidos o clang association, la selección de palabras está determinada por rimas o semejanzas fonéticas en lugar de por relaciones semánticas. La ecolalia consiste en repetir lo dicho por otra persona.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.).'
});

thought('PERSEV_AGO25_U1_046', {
  e: '¿Qué término designa un lenguaje personal con vocabulario y sintaxis de invención propia, pero dotado de reglas estables y potencialmente traducible si se conoce su clave?',
  o: { a: 'Glosolalia.', b: 'Verbigeración.', c: 'Palilalia.', d: 'Ensalada de palabras.' },
  c: 'a',
  x: 'La glosolalia es un lenguaje privado con vocabulario y sintaxis propios que conserva una regla de transformación y, por ello, podría traducirse si se conociera. No equivale a la repetición estereotipada ni a un discurso completamente incoherente.',
  r: 'Vallejo Ruiloba, J. (dir.) (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier, psicopatología del pensamiento y del lenguaje.'
});

for (const q of block) thought(q.id);

fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(psychopathologyFile, JSON.stringify(psychopathology));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Segunda pasada de ánimo completada; pensamiento: 20 auditadas y 3 reubicadas.');
