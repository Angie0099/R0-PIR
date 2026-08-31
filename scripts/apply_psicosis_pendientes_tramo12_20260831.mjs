import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map((q) => [q.id, q]));
const set = (id, data) => {
  const q = byId.get(id);
  if (!q) throw new Error(`No existe ${id}`);
  Object.assign(q, data, { v: 'VALIDADA_ORIGINAL' });
};

const bentall = 'Bentall, R. P. et al. (2012). Specificity of childhood trauma-related experiences in a UK sample of patients with psychosis, controls, and siblings. Schizophrenia Bulletin, 38(4), 734-740. https://doi.org/10.1093/schbul/sbs042; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw Hill, capítulo de psicopatología de la percepción.';

set('PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_002', {
  e: 'Según el estudio de Bentall et al. (2012) sobre experiencias traumáticas y síntomas psicóticos, señale la afirmación INCORRECTA:',
  o: {
    a: 'Las experiencias de separación se relacionaron únicamente con los delirios.',
    b: 'La violación y el acoso entre iguales predijeron los delirios paranoides o persecutorios.',
    c: 'El abuso físico predijo tanto los delirios paranoides como las alucinaciones verbales.',
    d: 'El abuso sexual infantil se relacionó específicamente con la presencia de alucinaciones auditivas.'
  }, c: 'b',
  x: 'La opción b es la incorrecta: ni la violación ni el acoso entre iguales predijeron específicamente los delirios paranoides en este estudio. La a es correcta porque las experiencias de separación se asociaron únicamente con los delirios; la c, porque el abuso físico predijo delirios paranoides y alucinaciones verbales; y la d, porque el abuso sexual infantil mostró una asociación específica con las alucinaciones auditivas.', r: bentall
});

set('SM_AGOSTO_1_SOL_1_064', {
  e: 'Según Bentall et al. (2012), ¿qué asociación entre experiencias traumáticas y síntomas psicóticos se observó?',
  o: {
    a: 'El abuso sexual infantil se relacionó específicamente con las alucinaciones auditivas.',
    b: 'El abuso físico no predijo los delirios paranoides.',
    c: 'El acoso entre iguales predijo delirios paranoides y alucinaciones verbales.',
    d: 'Las experiencias de separación se relacionaron únicamente con las alucinaciones verbales.'
  }, c: 'a',
  x: 'La opción a es correcta: el abuso sexual infantil se asoció específicamente con la presencia de alucinaciones auditivas. La b es falsa porque el abuso físico predijo delirios paranoides y alucinaciones verbales; la c es falsa porque el acoso entre iguales no predijo específicamente delirios paranoides; y la d es falsa porque las experiencias de separación se relacionaron únicamente con los delirios, no con las alucinaciones verbales.', r: bentall
});

set('SM_DICIEMBRE_1_SOL_1_033', {
  e: 'Según los resultados de Bentall et al. (2012) sobre trauma y síntomas psicóticos, señale la afirmación correcta:',
  o: {
    a: 'El abuso físico se relacionó específicamente solo con las alucinaciones auditivas.',
    b: 'El abuso sexual infantil predijo tanto delirios paranoides como alucinaciones verbales.',
    c: 'Las experiencias de separación se relacionaron únicamente con los delirios.',
    d: 'Se observó una relación dosis-efecto estrictamente lineal entre el número de experiencias traumáticas y el riesgo de síntomas.'
  }, c: 'c',
  x: 'La opción c es correcta: las experiencias de separación se asociaron únicamente con los delirios. La a es falsa porque el abuso físico predijo tanto delirios paranoides como alucinaciones verbales; la b es falsa porque el abuso sexual infantil se relacionó específicamente con alucinaciones auditivas; y la d es falsa porque la relación dosis-efecto observada no fue lineal.', r: bentall
});

set('SM_JULIO_1_SOL_1_052', {
  e: '¿Qué resultado obtuvieron Bentall et al. (2012) al examinar la relación entre distintas experiencias traumáticas y síntomas psicóticos?',
  o: {
    a: 'El abuso sexual infantil se relacionó específicamente con la presencia de alucinaciones auditivas.',
    b: 'Tanto la violación como el acoso entre iguales predijeron delirios paranoides.',
    c: 'El abuso físico no predijo delirios ni alucinaciones.',
    d: 'Las experiencias de separación no se relacionaron con los delirios.'
  }, c: 'a',
  x: 'La opción a es correcta: el abuso sexual infantil mostró una asociación específica con las alucinaciones auditivas. La b es falsa porque ni la violación ni el acoso entre iguales predijeron específicamente delirios paranoides; la c es falsa porque el abuso físico predijo delirios paranoides y alucinaciones verbales; y la d es falsa porque las experiencias de separación sí se relacionaron con los delirios.', r: bentall
});

set('SM_ENERO_1_SOL_1_086', {
  e: 'Respecto al curso de los trastornos psicóticos, señale la afirmación correcta:',
  o: {
    a: 'En el estudio de Haro et al. (2015), algo más de la mitad de los adultos con esquizofrenia presentó síntomas psicóticos persistentes durante un promedio cercano a diez años.',
    b: 'En el estudio de Austin et al. (2015), cerca de la mitad mostró un incremento de los síntomas durante los primeros cinco años y después permaneció asintomática.',
    c: 'En el estudio de Austin et al. (2015), el 15 % mostró un aumento inicial durante dos años seguido de un descenso constante durante ocho años.',
    d: 'El trastorno psicótico breve exige un retorno solo parcial al funcionamiento premórbido antes de un mes.'
  }, c: 'a',
  x: 'La opción a es correcta: Haro et al. describieron síntomas persistentes en aproximadamente el 62 % de la muestra durante una media de 9,6 años. La b invierte la trayectoria de respuesta positiva, caracterizada por reducción inicial y posterior estabilidad; la c invierte la trayectoria de recaída, en la que hay reducción inicial y aumento posterior; y la d es falsa porque el DSM-5-TR exige retorno completo al nivel de funcionamiento premórbido.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill, capítulo 11: Esquizofrenia y otros trastornos psicóticos; American Psychiatric Association (2022). DSM-5-TR, trastorno psicótico breve.'
});

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Actualizadas 5 preguntas de psicosis.');
