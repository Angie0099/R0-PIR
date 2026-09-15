const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const questions = bank.filter(q => Array.isArray(q.t) && q.t.includes(topic));
const block = questions.slice(0, 20);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque 1-20`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('4Simulacro02018Comentarios_104', {
  x: 'Los estudios clásicos sobre depresión con características atípicas encontraron una respuesta especialmente favorable a los IMAO frente a los tricíclicos. Actualmente suelen reservarse por sus interacciones, restricciones dietéticas y perfil de seguridad.',
  r: 'Pae, C. U. et al. (2009). Atypical depression: a comprehensive review. CNS Drugs, 23, 1023-1037.'
});

set('4Simulacro02018Comentarios_105', {
  e: '¿A qué autor se atribuye el Programa de Actividades Agradables para la depresión?',
  o: { a: 'Ferster.', b: 'Costello.', c: 'Lewinsohn.', d: 'Beck.' },
  c: 'c',
  x: 'Lewinsohn y colaboradores desarrollaron el Programa de Actividades Agradables desde un modelo conductual de la depresión basado en la disminución del reforzamiento positivo contingente a la conducta.',
  r: 'Pérez Álvarez, M. et al. (coords.). Guía de tratamientos psicológicos eficaces I: Adultos. Pirámide, tratamiento conductual de la depresión.'
});

set('DICIEMBRE-DOS-24_COMENTADO_099', {
  e: '¿Cuál de las siguientes intervenciones para el trastorno bipolar combina psicoeducación breve con apoyo mediante una aplicación para teléfono inteligente?',
  c: 'a',
  x: 'PRISM complementa una intervención psicoeducativa breve con avisos y contenidos mediante teléfono inteligente. Beating Bipolar, ORBIT y MoodSwings se desarrollaron principalmente como intervenciones web.',
  r: 'Depp, C. A. et al. (2015). Augmenting psychoeducation with a mobile intervention for bipolar disorder: a randomized controlled trial. Journal of Affective Disorders, 174, 23-30.'
});

set('DICIEMBRE-UNO-24_COMENTADO_158', {
  e: 'Según la recomendación clásica recogida en el manual y entre las siguientes alternativas, ¿qué estabilizador se ha asociado especialmente al trastorno bipolar con ciclación rápida o características mixtas?',
  c: 'b',
  x: 'La respuesta clásica entre estas alternativas es valproato, especialmente por su uso en episodios con características mixtas y en algunos pacientes con ciclación rápida. No constituye una regla universal: las guías actuales exigen individualizar según fase, polaridad, antecedentes, comorbilidad y seguridad.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide; Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('JUNIO-UNO-24_COMENTADO_149', {
  e: 'Entre las siguientes alternativas, ¿cuál corresponde a una intervención terapéutica dirigida a la depresión posparto y a la relación madre-bebé, y no a un programa fundamentalmente preventivo?',
  c: 'b',
  x: 'La psicoterapia diádica madre-bebé interviene cuando existe depresión posparto y trabaja también la relación entre ambos. ROSE, Be a Mom y el Curso Mamás y Bebés se desarrollaron principalmente como intervenciones preventivas para mujeres con riesgo de depresión perinatal.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, depresión perinatal; US Preventive Services Task Force (2019). Interventions to prevent perinatal depression.'
});

set('JUNIO1_135', {
  e: 'Según la recomendación clásica recogida en el manual y entre las siguientes alternativas, ¿qué estabilizador se ha asociado especialmente a episodios maníacos con características mixtas?',
  c: 'b',
  x: 'Entre estas opciones, la respuesta clásica es valproato. Lamotrigina se vincula principalmente a la depresión bipolar y a la prevención de recaídas depresivas; la elección farmacológica actual debe individualizarse y considerar las importantes restricciones de seguridad del valproato.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide; Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('OCTUBRE-UNO-24_COMENTADO_149', {
  x: 'MomMoodBooster es una intervención cognitivo-conductual digital guiada para mujeres con depresión posparto o perinatal. ROSE, Be a Mom y el Curso Mamás y Bebés se han estudiado principalmente como programas preventivos.',
  r: 'Danaher, B. G. et al. (2013). MomMoodBooster Web-Based Intervention for Postpartum Depression. Journal of Medical Internet Research, 15, e242; Danaher, B. G. et al. (2023). MomMoodBooster2 practical effectiveness study. American Journal of Obstetrics and Gynecology, 228, 453.e1-453.e10.'
});

set('PERSEV_JUL25_D2_130', {
  x: 'ORBIT es una intervención digital administrada principalmente mediante una plataforma web. MONARCA, SIMPLe y PRISM se vinculan específicamente al uso de teléfonos inteligentes.',
  r: 'Lauder, S. et al. (2015). A randomized head to head trial of MoodSwings.net.au and an active control intervention for bipolar disorder. Journal of Affective Disorders; Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos.'
});

set('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_085', {
  x: 'ORBIT es una intervención para el trastorno bipolar administrada principalmente vía web. MONARCA y SIMPLe son sistemas móviles, y PRISM complementa psicoeducación breve mediante un teléfono inteligente.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, intervenciones digitales para el trastorno bipolar; Depp, C. A. et al. (2015). Journal of Affective Disorders, 174, 23-30.'
});

for (const q of block) set(q.id);

fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 1-20 reauditorado: 20 validadas; 9 con mejoras de redacción, justificación o referencia.');
