const fs = require('fs');
const path = require('path');

const bankDir = path.join(__dirname, '..', 'public', 'banco');
const files = [
  'tratamientos_adultos.json',
  'clinica_adultos.json',
  'clinica_infantojuvenil.json',
  'evaluacion_psicologica.json',
  'psicobiologia.json',
  'psicologia_basica.json',
  'psicopatologia.json',
  'psicoterapias.json'
];
const banks = Object.fromEntries(files.map(file => [file, JSON.parse(fs.readFileSync(path.join(bankDir, file), 'utf8'))]));

function find(file, id) {
  const q = banks[file].find(item => item.id === id);
  if (!q) throw new Error(`${file}: no se encontró ${id}`);
  return q;
}

function remove(file, id) {
  const index = banks[file].findIndex(item => item.id === id);
  if (index < 0) throw new Error(`${file}: no se encontró ${id} para eliminar`);
  return banks[file].splice(index, 1)[0];
}

function move(from, to, id, topic) {
  const q = remove(from, id);
  if (banks[to].some(item => item.id === id)) throw new Error(`${to}: ID duplicado ${id}`);
  q.t = [topic];
  banks[to].push(q);
  return q;
}

function set(q, changes) {
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

// TAC: ya estaba correctamente reubicada en psicosis; se restaura una opción falsa inequívoca.
set(find('tratamientos_adultos.json', 'PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_061'), {
  o: {
    a: 'Suele mostrar mayor utilidad en áreas con elevada densidad poblacional y morbilidad psiquiátrica.',
    b: 'El equipo mantiene, como norma fija, exactamente un contacto semanal con cada persona, independientemente de sus necesidades.',
    c: 'Se recomienda especialmente para personas con trastorno mental grave que presentan escasa vinculación a los servicios.',
    d: 'El TAC flexible amplía el modelo mediante una intensidad de atención adaptable a un perfil más amplio.'
  },
  c: 'b',
  x: 'La afirmación b es incorrecta: el TAC se caracteriza por contactos frecuentes cuya intensidad y frecuencia se ajustan a las necesidades cambiantes, no por una pauta semanal rígida. Las restantes opciones describen su contexto de utilidad, la indicación ante desvinculación y la ampliación que introduce el TAC flexible.',
  r: 'Fonseca-Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, tratamiento asertivo comunitario; NICE (2014). Psychosis and schizophrenia in adults (CG178), recomendación 1.5.1.2.'
});

// Rasgos de personalidad CIE-11.
const anancastia = move('psicopatologia.json', 'clinica_adultos.json', 'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_060', 'Trastornos de la personalidad');
set(anancastia, {
  e: 'En el modelo dimensional de personalidad de la CIE-11, ¿qué dominio describe la focalización rígida en estándares de perfección y en controlar la conducta propia y ajena para ajustarla a esos estándares?',
  o: { a: 'Desinhibición.', b: 'Afectividad negativa.', c: 'Disocialidad.', d: 'Anancastia.' },
  c: 'd',
  x: 'La anancastia comprende perfeccionismo rígido, preocupación por reglas y estándares, control, orden y evitación de errores. Se contrapone conceptualmente a la desinhibición.',
  r: 'Organización Mundial de la Salud. CIE-11, dominio de rasgo de anancastia en los trastornos de la personalidad.'
});

// Hexaflex: se conserva una sola versión en terapias de tercera generación.
const hexaflex = move('psicopatologia.json', 'psicoterapias.json', 'Simu 11 comentado_138', 'Terapias de tercera generación');
set(hexaflex, {
  e: 'En el modelo Hexaflex de la terapia de aceptación y compromiso (ACT), ¿cuál NO es uno de los seis procesos de flexibilidad psicológica?',
  o: { a: 'Clarificación de valores.', b: 'Exposición.', c: 'Aceptación.', d: 'Yo como contexto.' },
  c: 'b',
  x: 'Los seis procesos son aceptación, defusión cognitiva, contacto con el momento presente, yo como contexto, valores y acción comprometida. La exposición puede emplearse como procedimiento, pero no es uno de los seis procesos del Hexaflex.',
  r: 'Hayes, S. C., Strosahl, K. D. y Wilson, K. G. (2012). Acceptance and Commitment Therapy (2.ª ed.). Guilford Press.'
});
remove('evaluacion_psicologica.json', 'SmCm11PIR2025_043');

// HiTOP: la pregunta se formula con la combinación completa para evitar una respuesta parcial.
set(find('psicopatologia.json', 'JUNIO1_075'), {
  e: 'Según la taxonomía dimensional HiTOP, ¿con qué espectros se relaciona principalmente el trastorno límite de la personalidad?',
  o: {
    a: 'Interiorización y externalización antagonista.',
    b: 'Externalización desinhibida y desapego exclusivamente.',
    c: 'Trastorno del pensamiento exclusivamente.',
    d: 'Somatomorfo y desapego.'
  },
  c: 'a',
  x: 'El trastorno límite presenta una ubicación compleja y se relaciona especialmente con interiorización y externalización antagonista. Preguntar por un único espectro hacía que la respuesta quedara incompleta.',
  r: 'Kotov, R. et al. (2017). The Hierarchical Taxonomy of Psychopathology (HiTOP). Journal of Abnormal Psychology, 126, 454-477.'
});

// Memoria: se elimina el absoluto etiológico y se crea una alternativa falsa inequívoca.
const amnesic = move('psicobiologia.json', 'psicopatologia.json', 'Simu 12 comentado_108', 'Psicopatología de la memoria');
set(amnesic, {
  e: '¿Cuál de las siguientes afirmaciones es FALSA respecto al síndrome amnésico relativamente puro?',
  o: {
    a: 'La memoria operativa suele encontrarse conservada.',
    b: 'Exige necesariamente una única lesión cerebral focal perfectamente localizada.',
    c: 'Presenta una alteración importante del aprendizaje de información nueva o amnesia anterógrada.',
    d: 'Otras capacidades intelectuales, lingüísticas y perceptivas pueden mantenerse relativamente conservadas.'
  },
  c: 'b',
  x: 'El síndrome amnésico puede aparecer por etiologías y alteraciones cerebrales diversas; no exige una única lesión focal perfectamente localizada. Su rasgo central es la amnesia anterógrada desproporcionada respecto a otras funciones, con memoria operativa relativamente preservada.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología de la memoria.'
});

// Delirios e ideas sobrevaloradas.
set(find('psicopatologia.json', 'SM_MAYO_1_SOL_1_079'), {
  e: '¿Cómo se denomina la creencia persistente y poco razonable, dotada de gran carga afectiva, que se sostiene con menor convicción que un delirio y respecto a la cual puede conservarse cierto grado de insight?',
  o: { a: 'Obsesión.', b: 'Pensamiento automático negativo.', c: 'Creencia disfuncional.', d: 'Idea sobrevalorada.' },
  c: 'd',
  x: 'La idea sobrevalorada domina la vida mental y posee una intensa carga emocional, pero resulta más comprensible biográficamente y se mantiene con menor certeza que una idea delirante. En la obsesión predomina el carácter intruso y egodistónico.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});
set(find('psicopatologia.json', 'SmCm12PIR2024 2_067'), {
  e: '¿Cómo se denomina la idea delirante centrada en la inexistencia del propio yo, de partes del cuerpo, de otras personas o del mundo?',
  o: { a: 'Delirio de falsa identificación.', b: 'Idea delirante de pobreza.', c: 'Idea delirante nihilista.', d: 'Idea delirante de referencia.' },
  c: 'c',
  x: 'El delirio nihilista consiste en la convicción de que uno mismo, partes del cuerpo, otras personas o el mundo no existen o han dejado de existir.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});
set(find('psicopatologia.json', 'SmCm25PIR2025_118'), {
  e: '¿Qué alteración presenta una persona convencida de que sus pensamientos son accesibles a los demás, como si otras personas pudieran leerlos?',
  o: { a: 'Difusión o irradiación del pensamiento.', b: 'Inserción del pensamiento.', c: 'Percepción delirante.', d: 'Delirio de referencia.' },
  c: 'a',
  x: 'La difusión, transmisión o irradiación del pensamiento es la experiencia delirante de que los pensamientos propios salen de la mente y pueden ser conocidos por otras personas.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});
set(find('psicopatologia.json', 'SmCm26PIR2025_082'), {
  e: 'Indique la afirmación INCORRECTA sobre el delirio paranoico clásico:',
  o: {
    a: 'Puede elaborarse a partir de un conflicto psicoafectivo.',
    b: 'Se organiza característicamente en un sistema delirante fragmentario, incoherente y mal construido.',
    c: 'Tradicionalmente se ha descrito como un delirio de relación social.',
    d: 'El delirio de reivindicación constituye una de sus presentaciones características.'
  },
  c: 'b',
  x: 'La afirmación b es incorrecta: el delirio paranoico se caracteriza clásicamente por una construcción organizada, coherente y sistematizada, aunque sus premisas sean falsas. Los delirios fragmentarios y mal estructurados se asocian a otros cuadros.',
  r: 'Vallejo Ruiloba, J. Introducción a la psicopatología y la psiquiatría, paranoia y desarrollos delirantes.'
});
set(find('psicopatologia.json', 'JULIO1_079'), {
  e: '¿Cuál de las siguientes afirmaciones diferencia correctamente una idea delirante de una idea sobrevalorada?',
  o: {
    a: 'Las ideas sobrevaloradas aparecen siempre varias a la vez y carecen de significado personal.',
    b: 'Los delirios cambian necesariamente de forma, pero nunca de contenido.',
    c: 'Las ideas sobrevaloradas desaparecen siempre espontáneamente y sin intervención.',
    d: 'Los delirios suelen mantenerse con elevada convicción pese a su escasa plausibilidad y a las evidencias en contra.'
  },
  c: 'd',
  x: 'La convicción firme y la resistencia a la evidencia contraria caracterizan al delirio. La idea sobrevalorada posee gran carga afectiva y domina el pensamiento, pero suele ser más comprensible y admite mayor posibilidad de duda.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});
set(find('psicopatologia.json', 'JUNIO-UNO-24_COMENTADO_052'), {
  e: 'La interpretación delirante, dotada de un significado personal anómalo, de una percepción real y correctamente identificada se denomina:',
  o: { a: 'Intuición delirante.', b: 'Humor delirante.', c: 'Recuerdo delirante.', d: 'Percepción delirante.' },
  c: 'd',
  x: 'En la percepción delirante existe una percepción real a la que se atribuye, sin mediación comprensible, un significado delirante y autorreferencial.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento.'
});
remove('psicopatologia.json', 'OCTUBRE-UNO-24_COMENTADO_053');

// Obsesiones, intrusiones y preocupación.
set(find('psicopatologia.json', 'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_064'), {
  e: 'Frente a los pensamientos intrusos ocasionales de la población general, ¿qué característica distingue especialmente a las obsesiones clínicas?',
  o: {
    a: 'Generan menos malestar y se descartan con facilidad.',
    b: 'Consumen mucho tiempo, resultan persistentes e interfieren en el flujo consciente y en el funcionamiento.',
    c: 'Aparecen de manera esporádica y no provocan intentos de neutralización.',
    d: 'Se asocian menos a culpa, responsabilidad o amenaza.'
  },
  c: 'b',
  x: 'Los contenidos intrusos pueden aparecer también en población general. Se convierten en obsesiones clínicas por su persistencia, frecuencia, malestar, resistencia, neutralización e interferencia significativa.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), obsesiones y pensamientos intrusos.'
});
set(find('psicopatologia.json', 'SM_AGOSTO_1_SOL_1_059'), {
  e: 'En comparación con las obsesiones clínicas, los pensamientos intrusos ocasionales de la población general suelen:',
  o: {
    a: 'Ser menos persistentes, generar menos malestar e interferir menos en el funcionamiento.',
    b: 'Consumir más tiempo e interferir más en la actividad consciente.',
    c: 'Provocar más conductas de neutralización y una resistencia más intensa.',
    d: 'Presentar necesariamente contenidos distintos de los de las obsesiones.'
  },
  c: 'a',
  x: 'Intrusiones y obsesiones pueden compartir contenidos; la diferencia es principalmente cuantitativa y funcional. Las obsesiones son más persistentes, perturbadoras, resistentes e interferentes y suscitan más neutralización.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), obsesiones y pensamientos intrusos.'
});
set(find('psicopatologia.json', 'PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_074'), {
  e: '¿Cuál de las siguientes afirmaciones es FALSA respecto a la preocupación?',
  o: {
    a: 'Consiste en una cadena de pensamientos o imágenes cargada de afecto negativo y relativamente incontrolable.',
    b: 'Las preocupaciones normales y las patológicas pueden compartir contenidos.',
    c: 'Representa un intento de resolver mentalmente un problema cuyo resultado es incierto.',
    d: 'Solo puede ser desencadenada por amenazas externas y nunca por un estado emocional interno negativo.'
  },
  c: 'd',
  x: 'La opción d es falsa: la preocupación puede activarse tanto por claves externas como por estados internos negativos. Su forma típica es una cadena relativamente incontrolable y orientada al futuro que intenta resolver mentalmente una amenaza incierta.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), preocupación patológica.'
});

// Lenguaje y forma del pensamiento.
const paragram = find('psicopatologia.json', 'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_006');
paragram.t = ['Psicopatología del lenguaje'];
set(paragram, {
  e: '¿Qué alteración del lenguaje consiste en construir un discurso ininteligible, alterando gravemente las reglas sintácticas y combinando palabras de forma desorganizada?',
  o: { a: 'Ilogicidad.', b: 'Paragramatismo.', c: 'Parafasia.', d: 'Habla afectada.' },
  c: 'b',
  x: 'El paragramatismo es una alteración de la organización gramatical y sintáctica del discurso. La atribución original a la clasificación de Andreasen era confusa, pues Andreasen emplea categorías como incoherencia o ensalada de palabras.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del lenguaje.'
});
const verbigeration = find('psicopatologia.json', 'PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_067');
verbigeration.t = ['Psicopatología del lenguaje'];
set(verbigeration, {
  e: 'Una persona repite de manera monótona, estereotipada y carente de finalidad comunicativa las mismas palabras o frases. Esta alteración se denomina:',
  o: { a: 'Verbigeración.', b: 'Laconismo.', c: 'Resonancia.', d: 'Habla afectada.' },
  c: 'a',
  x: 'La verbigeración es la repetición estereotipada y aparentemente carente de sentido o finalidad comunicativa de palabras o frases. El ejemplo original podía confundirse con perseveración y se ha sustituido por una definición inequívoca.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del lenguaje.'
});
const persev = find('psicopatologia.json', 'SmCm22PIR2025 (1)_096');
persev.t = ['Psicopatología del lenguaje'];
set(persev, {
  e: '¿Qué término describe la repetición involuntaria y persistente de una palabra, idea o respuesta previamente emitida, aun cuando ya no resulta pertinente?',
  o: { a: 'Fuga de ideas.', b: 'Perseveración.', c: 'Tangencialidad.', d: 'Ecolalia.' },
  c: 'b',
  x: 'La perseveración consiste en mantener o repetir una respuesta previa pese al cambio de pregunta o contexto. La ecolalia es la repetición de palabras pronunciadas por otra persona.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del lenguaje.'
});
const derailment = find('psicopatologia.json', 'PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_163');
set(derailment, {
  e: 'Ante una pregunta, la persona encadena enunciados que se apartan progresivamente del tema sin una relación comprensible entre ellos. ¿Qué alteración formal del pensamiento presenta?',
  o: { a: 'Descarrilamiento o pérdida de asociaciones.', b: 'Fuga de ideas.', c: 'Paragramatismo.', d: 'Ilogicidad.' },
  c: 'a',
  x: 'El descarrilamiento implica que las ideas se deslizan hacia contenidos débilmente relacionados o no relacionados. La fuga de ideas suele acompañarse de aceleración y asociaciones todavía comprensibles; el paragramatismo afecta a la sintaxis y la ilogicidad a las conclusiones.',
  r: 'Andreasen, N. C. (1979). Thought, language, and communication disorders. Archives of General Psychiatry, 36, 1315-1321.'
});
const neologism = find('psicopatologia.json', 'SM_ENERO_1_SOL_1_078');
neologism.t = ['Psicopatología del lenguaje'];
set(neologism, {
  e: 'La creación de palabras nuevas o pseudopalabras que respetan las reglas de formación del idioma, o el uso de una palabra conocida con un significado idiosincrásico, se denomina:',
  o: { a: 'Neologismo.', b: 'Laconismo.', c: 'Parafasia.', d: 'Habla afectada.' },
  c: 'a',
  x: 'Un neologismo es una palabra nueva o una palabra conocida utilizada con un significado privado e idiosincrásico. La parafasia consiste en sustituir sonidos o palabras por otros.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del lenguaje.'
});

// Atención.
const timeGap = find('psicopatologia.json', 'SmCm3PIR2024_094');
timeGap.t = ['Psicopatología de la atención'];
set(timeGap, {
  e: 'En psicopatología de la atención, ¿qué describe la denominada «laguna temporal»?',
  o: {
    a: 'Una amnesia selectiva de acontecimientos traumáticos.',
    b: 'Una desorientación temporal con orientación espacial y personal conservadas.',
    c: 'La ausencia de registro consciente del paso del tiempo mientras se ejecuta una actividad automática o muy habitual.',
    d: 'Una disminución global del nivel de conciencia y alerta.'
  },
  c: 'c',
  x: 'La laguna temporal es una experiencia atencional cotidiana: durante una tarea automática la atención queda absorbida por otros contenidos y apenas se registra conscientemente el intervalo transcurrido. No constituye por sí misma amnesia ni desorientación.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología de la atención.'
});

// Evaluación psicológica.
const tro = move('psicopatologia.json', 'evaluacion_psicologica.json', 'SmCm10PIR2025_151', 'Clasificación de las técnicas de evaluación psicológica');
set(tro, {
  e: 'El Test de Relaciones Objetales de Phillipson (TRO) es una técnica proyectiva de tipo:',
  o: { a: 'Expresiva.', b: 'Constructiva.', c: 'Temática.', d: 'Asociativa.' },
  c: 'c',
  x: 'El TRO presenta láminas ambiguas para que la persona elabore relatos; por ello se clasifica entre las técnicas proyectivas temáticas, como el TAT.',
  r: 'Fernández-Ballesteros, R. Evaluación psicológica, clasificación de las técnicas proyectivas; Phillipson, H. Test de Relaciones Objetales.'
});

// Adicciones.
const opioids = move('psicopatologia.json', 'clinica_adultos.json', 'SmCm4PIR2024_076', 'Trastornos adictivos y relacionados con sustancias');
set(opioids, {
  e: 'Respecto a la oxicodona y el fentanilo, señale la afirmación correcta:',
  o: {
    a: 'La oxicodona produce necesariamente menos dependencia que el fentanilo.',
    b: 'El fentanilo es un derivado natural de la tebaína.',
    c: 'El fentanilo es un opioide sintético aproximadamente 50-100 veces más potente que la morfina.',
    d: 'Los efectos digestivos característicos de la oxicodona son disfagia, gastritis y ulceración bucal.'
  },
  c: 'c',
  x: 'El fentanilo es un opioide sintético de gran potencia, aproximadamente 50-100 veces más potente que la morfina. La oxicodona es semisintética y deriva de la tebaína; sus efectos adversos gastrointestinales típicos incluyen náuseas y estreñimiento.',
  r: 'National Institute on Drug Abuse. Fentanyl DrugFacts; ficha técnica de oxicodona de la Agencia Española de Medicamentos y Productos Sanitarios.'
});

// Fobias infantiles.
const phobias = move('psicopatologia.json', 'clinica_infantojuvenil.json', 'Simu 32 comentado hardcore 2_010', 'Trastornos de ansiedad infantojuveniles');
set(phobias, {
  e: 'Señale la afirmación FALSA sobre los miedos evolutivos y las fobias específicas en la infancia:',
  o: {
    a: 'Los miedos evolutivos suelen ser transitorios y se relacionan con etapas concretas del desarrollo.',
    b: 'Los miedos o fobias relacionados con animales son frecuentes en la infancia.',
    c: 'Las fobias situacionales presentan, en general, una edad de inicio más temprana que las fobias a animales.',
    d: 'La fobia implica un temor persistente, desproporcionado y no acorde con la edad o el nivel de desarrollo.'
  },
  c: 'c',
  x: 'La opción c es falsa: las fobias a animales suelen comenzar antes, mientras que las situacionales tienden a presentar un inicio posterior. Los miedos evolutivos son esperables y transitorios; la fobia es persistente, desproporcionada e interfiere.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, fobia específica; Fonseca-Pedrero, E. (coord.). Manual de tratamientos psicológicos: Infancia y adolescencia.'
});

for (const file of files) fs.writeFileSync(path.join(bankDir, file), JSON.stringify(banks[file]));
console.log('Preguntas mixtas corregidas, reubicadas y deduplicadas.');
