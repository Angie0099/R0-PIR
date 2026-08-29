import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map(q => [q.id, q]));
const get = id => {
  const q = byId.get(id);
  if (!q) throw new Error(`No existe ${id}`);
  return q;
};
const set = (id, values) => Object.assign(get(id), values);

set('OCTUBRE-UNO-24_COMENTADO_048', {
  e: 'De los siguientes modelos sobre la génesis y el mantenimiento de las alucinaciones, ¿cuál establece una analogía entre los pensamientos intrusivos característicos del trastorno obsesivo-compulsivo y las alucinaciones auditivas?',
  o: {
    a: 'Las teorías de la subvocalización.',
    b: 'La teoría atribucional de Slade y Bentall.',
    c: 'La teoría atribucional de Morrison.',
    d: 'Las teorías del filtrado o destilación.'
  },
  c: 'c',
  x: 'La opción c es correcta. El modelo atribucional de Morrison plantea paralelismos entre los pensamientos intrusivos del trastorno obsesivo-compulsivo y las voces: ambos pueden resultar involuntarios, no deseados y emocionalmente significativos. La a se centra en la posible relación entre habla interna, subvocalización y voces; la b explica las alucinaciones mediante errores de atribución de productos mentales internos a fuentes externas; y la d alude a dificultades de filtrado de información. Ninguna de ellas formula específicamente la analogía con las obsesiones.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo «Psicopatología de la sensopercepción», apartado sobre modelos explicativos de las alucinaciones. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_058', {
  e: 'Austin et al. (2015) siguieron durante diez años a personas con un primer episodio psicótico e identificaron cinco trayectorias sintomáticas. Señale la afirmación correcta:',
  o: {
    a: 'El 47 % mostró una respuesta positiva: reducción significativa de los síntomas durante los cinco primeros años y mantenimiento posterior sin síntomas.',
    b: 'El 12 % mostró una respuesta positiva con mantenimiento posterior sin síntomas.',
    c: 'El 47 % presentó una respuesta tardía, con disminución inicial, aumento temprano y reducción posterior de los síntomas.',
    d: 'El 15 % presentó una respuesta tardía, con disminución inicial, aumento temprano y reducción posterior de los síntomas.'
  },
  c: 'a',
  x: 'La opción a es correcta. En el seguimiento de Austin et al., la trayectoria de respuesta positiva correspondió aproximadamente al 47 % de la muestra. La b asigna a la respuesta positiva el porcentaje de la respuesta tardía; la c confunde la trayectoria y el porcentaje de la respuesta positiva con los de la respuesta tardía; y la d atribuye a la respuesta tardía el porcentaje de la trayectoria recurrente. Por ello solo la a empareja correctamente trayectoria y porcentaje.',
  r: 'Austin, S. F. et al. (2015). Long-term trajectories of positive and negative symptoms in first episode psychosis: a 10-year follow-up study. Psychological Medicine. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), capítulo 11, apartado sobre evolución y trayectorias de síntomas psicóticos. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_077', {
  e: 'Respecto a los sesgos cognitivos implicados en los delirios, señale la afirmación correcta:',
  o: {
    a: 'El sesgo contra la evidencia desconfirmatoria (BADE) se evalúa mediante la tarea de las bolitas.',
    b: 'El salto a conclusiones (JTC) se asocia con un procesamiento rápido de tipo 1 y con tomar decisiones con escasa evidencia.',
    c: 'El sesgo contra la evidencia desconfirmatoria (BADE) consiste en tomar una decisión tras recoger pocos datos.',
    d: 'El salto a conclusiones (JTC) se debe a la inhibición o a la no activación de un procesamiento analítico de tipo 2.'
  },
  c: 'b',
  x: 'La opción b es correcta. El JTC describe la tendencia a alcanzar una conclusión con pocos datos y se ha relacionado con un procesamiento rápido e intuitivo de tipo 1. La a es falsa porque la tarea de las bolitas se emplea típicamente para evaluar JTC; la c define JTC, no BADE; y la d atribuye al JTC la explicación propuesta para la reducción de flexibilidad cognitiva propia del BADE, vinculada a un procesamiento analítico de tipo 2 insuficientemente activado.',
  r: 'Huq, S. F., Garety, P. A. y Hemsley, D. R. (1988). Probabilistic judgements in deluded and non-deluded subjects. Quarterly Journal of Experimental Psychology, 40A, 801–812. https://doi.org/10.1080/14640748808402300. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), pp. 265–267. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_079', {
  e: '¿A qué dimensión del delirio se refiere que la persona rumie continuamente sus ideas y emplee buena parte de su tiempo en reafirmarlas y expresarlas?',
  o: {
    a: 'Inmodificabilidad o adherencia a la creencia.',
    b: 'Preocupación.',
    c: 'Intensidad o convicción.',
    d: 'Implausibilidad o rareza del contenido.'
  },
  c: 'b',
  x: 'La opción b es correcta. La preocupación alude a la cantidad de tiempo y atención que la persona dedica a sus ideas delirantes, incluidas la rumiación y la necesidad de reafirmarlas o expresarlas. La a se refiere a mantener la creencia pese a evidencias contrarias; la c, al grado de certeza subjetiva; y la d, al carácter más o menos extraño o inverosímil del contenido respecto a la realidad consensuada.',
  r: 'Fonseca-Pedrero, E. (ed.) (2018). Evaluación de los trastornos del espectro psicótico. Pirámide, p. 99. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), capítulo 11. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_054', {
  t: ['Psicopatología de la afectividad'],
  e: 'Las alteraciones cualitativas de la afectividad incluyen varios fenómenos. Señale la afirmación correcta:',
  o: {
    a: 'La labilidad afectiva es la falta de control de la expresión afectiva.',
    b: 'La incontinencia afectiva consiste en cambios rápidos del estado emocional.',
    c: 'El aplanamiento afectivo es la coexistencia de sentimientos positivos y negativos hacia un mismo objeto.',
    d: 'El embotamiento afectivo implica una reducción intensa de la capacidad de expresión emocional.'
  },
  c: 'd',
  x: 'La opción d es correcta: el embotamiento afectivo supone una reducción marcada de la expresión emocional. La a intercambia la definición de incontinencia afectiva; la b intercambia la de labilidad afectiva, caracterizada por cambios rápidos del estado emocional; y la c define la ambivalencia afectiva. El aplanamiento se refiere a una ausencia total o casi total de signos de expresión emocional.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo sobre psicopatología de la afectividad. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_063', {
  t: ['Trastornos depresivos'],
  e: 'En el trastorno depresivo mayor, ¿qué especificador se aplica cuando existe reactividad del estado de ánimo ante sucesos positivos junto con otros síntomas característicos, como sensibilidad aumentada al rechazo interpersonal?',
  o: {
    a: 'Con características atípicas.',
    b: 'Con características mixtas.',
    c: 'Con patrón estacional.',
    d: 'Con ansiedad.'
  },
  c: 'a',
  x: 'La opción a es correcta. El especificador con características atípicas requiere reactividad del estado de ánimo y se asocia, entre otros rasgos, a sensibilidad al rechazo interpersonal. La b exige síntomas hipomaníacos o maníacos durante el episodio depresivo; la c se refiere a una relación temporal regular con una estación del año que no se explica mejor por estresores estacionales; y la d describe síntomas de ansiedad presentes la mayoría de los días.',
  r: 'American Psychiatric Association (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales, especificadores del episodio depresivo mayor. Editorial Médica Panamericana. Véase también Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

set('OCTUBRE-UNO-24_COMENTADO_089', {
  t: ['Trastornos bipolares y relacionados'],
  e: 'Según el modelo del espectro bipolar de Akiskal y Pinto (1999), ¿qué caracteriza al bipolar tipo III?',
  o: {
    a: 'Episodios hipomaníacos sin episodios depresivos.',
    b: 'Episodios depresivos con hipomanía inducida por antidepresivos.',
    c: 'Depresión recurrente acompañada de hipomanía mixta o disfórica.',
    d: 'Episodio depresivo mayor superpuesto a un temperamento hipertímico.'
  },
  c: 'b',
  x: 'La opción b es correcta. En la propuesta de Akiskal y Pinto, el bipolar III describe episodios depresivos con hipomanía inducida por antidepresivos u otros tratamientos somáticos. La a corresponde al bipolar I½; la d, al bipolar IV; y la c se ha usado para el bipolar V en ampliaciones posteriores, por lo que no debe atribuirse literalmente a la clasificación original de 1999.',
  r: 'Akiskal, H. S. y Pinto, O. (1999). The evolving bipolar spectrum: Prototypes I, II, III, and IV. Psychiatric Clinics of North America, 22(3), 517–534. https://doi.org/10.1016/S0193-953X(05)70093-9.',
  v: 'VALIDADA_ORIGINAL'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_066', {
  t: ['Psicopatología de la sensopercepción'],
  e: 'Una persona afirma: «Cuando pasan aviones por encima de mi casa, escucho cómo hablan los pilotos con las azafatas». ¿Qué variante de la experiencia alucinatoria describe?',
  o: {
    a: 'Alucinación negativa.',
    b: 'Alucinación funcional.',
    c: 'Alucinación extracampina.',
    d: 'Alucinación refleja.'
  },
  c: 'c',
  x: 'La opción c es correcta. En la alucinación extracampina la experiencia se localiza fuera del campo sensorial posible: en este caso, se atribuye una conversación concreta a personas situadas a una distancia desde la que no podría oírse. La a es la ausencia de percepción de un estímulo real accesible; la b exige un estímulo real y una alucinación simultánea en la misma modalidad; y la d requiere que un estímulo de una modalidad desencadene una alucinación en otra modalidad.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo «Psicopatología de la sensopercepción», tabla de variantes de la experiencia alucinatoria. McGraw Hill.',
  v: 'VALIDADA_ORIGINAL'
});

// Reubicaciones inequívocas: se conservan como pendientes hasta contraste documental específico.
set('DICIEMBRE-UNO-24_COMENTADO_102', { t: ['Sistemas clasificatorios en psicopatología'], v: 'REVISAR' });
set('OCTUBRE-UNO-24_COMENTADO_071', { t: ['Trastornos bipolares y relacionados'], v: 'REVISAR' });

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Actualizados 10 registros; 8 validados y 2 reubicados para revisión.');
