import fs from 'node:fs';
const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map(q => [q.id, q]));
const set = (id, values) => Object.assign(byId.get(id), values);

set('SEPTIEMBRE-DOS-24_COMENTADO_077', {
  e: 'Respecto al contenido temático de los delirios, señale la afirmación correcta:',
  o: {a:'Los delirios de culpa y castigo son más frecuentes en episodios maníacos que en episodios depresivos.',b:'La inserción y el robo del pensamiento se engloban dentro de los delirios de referencia.',c:'El delirio de infestación es un tipo específico de delirio somático.',d:'En el delirio megalomaníaco la persona cree que alguien de mayor estatus está enamorado de ella.'},
  c:'c', x:'La opción c es correcta. El delirio de infestación, también denominado zoopático o síndrome de Ekbom, es un delirio somático en el que la persona cree estar infestada por parásitos u otros organismos. La a es falsa porque culpa y castigo se asocian sobre todo a la depresión; la b confunde los delirios de control o pasividad con los de referencia; y la d describe el delirio erotomaníaco o síndrome de Clérambault, no el de grandeza.',
  r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), capítulo 11, apartado sobre contenidos delirantes. McGraw Hill.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_079', {
  t:['Psicopatología de la sensopercepción'], e:'¿Cómo se denomina la distorsión perceptiva influida por la predisposición personal y por la ambigüedad o escasa definición del estímulo y de la situación?',
  o:{a:'Ilusión.',b:'Dismegalopsia.',c:'Escisión perceptiva.',d:'Paraalucinación.'}, c:'a', x:'La opción a es correcta. Una ilusión es una percepción equivocada o interpretación errónea de un estímulo externo real, favorecida por variables del estímulo, del contexto y de la persona. La b es una distorsión del tamaño percibido; la c es una percepción desintegrada de los componentes del estímulo; y la d alude a experiencias alucinatorias asociadas clásicamente a alteraciones periféricas, no a una distorsión de un estímulo presente.',
  r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo «Psicopatología de la sensopercepción», apartado sobre ilusiones y distorsiones perceptivas. McGraw Hill.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_093', {
  t:['Trastornos depresivos'], e:'Según el DSM-5-TR, ¿qué presentación se añadió respecto al DSM-5 dentro de «otro trastorno depresivo especificado»?',
  o:{a:'Depresión breve recurrente.',b:'Episodio depresivo con síntomas insuficientes.',c:'Episodio depresivo mayor superpuesto a un trastorno del espectro de la esquizofrenia u otro trastorno psicótico.',d:'Episodio depresivo de corta duración (4–13 días).'}, c:'c', x:'La opción c es correcta. El DSM-5-TR incorporó como ejemplo de otro trastorno depresivo especificado el episodio depresivo mayor superpuesto a esquizofrenia, trastorno esquizofreniforme, trastorno delirante u otro trastorno psicótico especificado o no especificado. Las opciones a, b y d ya figuraban como ejemplos en el DSM-5.',
  r:'American Psychiatric Association (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales, «Otro trastorno depresivo especificado», p. 274. Editorial Médica Panamericana.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_098', {
  e:'En la perspectiva dimensional del espectro psicótico, ¿en qué dimensión transdiagnóstica se incluyen los trastornos formales del pensamiento, la cognición social y la metacognición?',
  o:{a:'Dimensión psicótica.',b:'Dimensión desorganizada o cognitiva.',c:'Dimensión afectiva.',d:'Dimensión negativa.'}, c:'b', x:'La opción b es correcta. La dimensión desorganizada o cognitiva incluye pensamiento y habla desorganizados, deterioro neurocognitivo, cognición social y metacognición, además de conducta desorganizada. La a reúne delirios, alucinaciones y alteraciones del self; la c comprende sintomatología depresiva o maníaca; y la d incluye anhedonia, avolición, aislamiento social, afecto aplanado y alogia.',
  r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), capítulo 11, p. 412. McGraw Hill.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_099', {
  e:'En la etiología de la psicosis, ¿qué modelo pragmático destaca la relación entre factores genéticos y ambientales, la continuidad, el desarrollo y la sensibilización psicológica y biológica?',
  o:{a:'Modelo basado en la fenomenología.',b:'Modelo del neurodesarrollo.',c:'Modelo de propensión-persistencia-deterioro a la psicosis.',d:'Modelo de red.'}, c:'c', x:'La opción c es correcta. El modelo de propensión-persistencia-deterioro plantea continuidad etiológica, predictiva, temporal y fenotípica, interacción entre vulnerabilidad y ambiente, perspectiva evolutiva y mecanismos de sensibilización. La a se centra en la alteración del yo o de la ipseidad; la b en alteraciones tempranas del desarrollo cerebral; y la d concibe los síntomas como una red de interacciones, sin constituir la formulación descrita.',
  r:'Fonseca-Pedrero, E. (ed.) (2018). Evaluación de los trastornos del espectro psicótico. Pirámide, p. 43.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_106', {
  e:'¿En qué sección del DSM-5-TR se encuentra el síndrome de psicosis atenuado?',
  o:{a:'En la sección III, «Afecciones que necesitan más estudio».',b:'En la sección II, dentro de los trastornos disociativos.',c:'En «Otros problemas que pueden ser objeto de atención clínica».',d:'En la sección II, como trastorno del espectro de la esquizofrenia no especificado.'}, c:'a', x:'La opción a es correcta. El síndrome de psicosis atenuado se incluye en la sección III del DSM-5-TR, dedicada a afecciones que necesitan más estudio. La b lo sitúa erróneamente entre los trastornos disociativos; la c corresponde a otra sección del manual; y la d confunde el síndrome propuesto con las categorías diagnósticas de la sección II.',
  r:'American Psychiatric Association (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales, sección III, «Síndrome de psicosis atenuado». Editorial Médica Panamericana.', v:'VALIDADA_ORIGINAL'
});
set('SEPTIEMBRE-DOS-24_COMENTADO_107', {
  e:'Señale la afirmación correcta sobre la evolución clínica de la esquizofrenia:',
  o:{a:'La sintomatología negativa es más evidente en la fase activa.',b:'En la fase prodrómica suelen dominar los síntomas positivos, aunque con crítica.',c:'Los primeros síntomas en aparecer suelen ser negativos y afectivos.',d:'En la fase residual suelen dominar los síntomas de desorganización.'}, c:'c', x:'La opción c es correcta. En la fase prodrómica suelen aparecer primero síntomas negativos y afectivos, con frecuencia ansiedad o depresión. La a es falsa porque en la fase activa predominan habitualmente los síntomas positivos y de desorganización; la b atribuye esos síntomas a la fase prodrómica; y la d es falsa porque en la fase residual suelen predominar síntomas negativos y afectivos, pudiendo persistir síntomas positivos con crítica.',
  r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), capítulo 11, apartado sobre curso y evolución de la esquizofrenia. McGraw Hill.', v:'VALIDADA_ORIGINAL'
});
fs.writeFileSync(path, JSON.stringify(bank));
console.log('Corregidas 7; de ellas 2 reubicadas.');
