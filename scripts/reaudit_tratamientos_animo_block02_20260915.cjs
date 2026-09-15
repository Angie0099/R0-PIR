const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const block = bank.filter(q => q.t?.includes(topic)).slice(20, 40);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque 21-40`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_056', {
  e: 'Según NICE, ¿qué afirmación es correcta sobre el tratamiento del trastorno bipolar con ciclación rápida?',
  o: {
    a: 'Deben ofrecerse las mismas intervenciones que en otros tipos de trastorno bipolar, porque no hay evidencia sólida para recomendar un tratamiento diferencial.',
    b: 'El valproato es siempre el único tratamiento de primera elección.',
    c: 'El litio está contraindicado en todos los casos.',
    d: 'La lamotrigina es el tratamiento preferente de la manía aguda.'
  },
  c: 'a',
  x: 'NICE recomienda ofrecer a las personas con ciclación rápida las mismas intervenciones que a quienes presentan otros tipos de trastorno bipolar, ya que no existe evidencia firme para tratarlas de forma diferente. La elección debe individualizarse según fase, polaridad, antecedentes y seguridad.',
  r: 'National Institute for Health and Care Excellence (2023). Bipolar disorder: assessment and management (CG185), recomendación sobre ciclación rápida.'
});

set('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_148', {
  e: 'Según la gradación de evidencia recogida en el manual de referencia, ¿qué programa preventivo de depresión posparto alcanza el nivel más alto entre estas alternativas?',
  x: 'En la tabla comparativa concreta utilizada por el manual, el Curso Mamás y Bebés recibe el nivel de evidencia y el grado de recomendación más elevados entre estas alternativas. La respuesta queda expresamente vinculada a esa gradación y no pretende comparar toda la evidencia publicada con posterioridad.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, prevención de la depresión posparto; US Preventive Services Task Force (2019). Interventions to prevent perinatal depression.'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_091', {
  x: 'SIMPLe fue diseñada como aplicación para teléfonos inteligentes que monitoriza el estado de ánimo y proporciona mensajes psicoeducativos personalizados. ORBIT, iCBT y Beating Bipolar se describen principalmente como intervenciones web.',
  r: 'Hidalgo-Mazzei, D. et al. (2016). Psychoeducation in bipolar disorder with a SIMPLe smartphone application. Journal of Affective Disorders, 200, 58-66.'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_100', {
  e: '¿Cuál de las siguientes intervenciones trabaja con madres que presentan dificultades emocionales o depresión posnatal y con sus bebés?',
  o: { a: 'ROSE.', b: 'Be a Mom.', c: 'Mellow Babies.', d: 'PREPP.' },
  c: 'c',
  x: 'Mellow Babies es una intervención grupal temprana dirigida a madres o cuidadores con dificultades psicosociales y a sus bebés, e incorpora componentes de salud mental parental y de relación parento-infantil. ROSE, Be a Mom y PREPP se han estudiado principalmente como prevención perinatal.',
  r: 'Puckering, C. et al. Mellow Babies: a group intervention for infants and mothers experiencing postnatal depression; MacBeth, A. et al. (2021). Promoting sensitive parenting in at-risk mothers and fathers. Frontiers in Psychology, 12, 578892.'
});

set('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_065', {
  x: 'WHO-BIC combina una intervención breve con información y contactos regulares de seguimiento después de un intento de suicidio. El plan de seguridad, la hoja voluntaria de ayuda y ASSIP son intervenciones diferentes.',
  r: 'Fleischmann, A. et al. (2008). Effectiveness of brief intervention and contact for suicide attempters: a randomized controlled trial in five countries. Bulletin of the World Health Organization, 86, 703-709.'
});

set('SEPTIEMBRE-DOS-24_COMENTADO_139', {
  e: 'Ante un patrón de ciclación rápida en el trastorno bipolar, ¿qué actuación debe formar parte de la valoración y del plan terapéutico?',
  o: {
    a: 'Prescribir automáticamente valproato como única alternativa eficaz.',
    b: 'Revisar posibles factores asociados, como alteraciones tiroideas, consumo de sustancias y fármacos que puedan favorecer la ciclación.',
    c: 'Retirar todos los estabilizadores del ánimo.',
    d: 'Indicar un antidepresivo en monoterapia para prevenir nuevos ciclos.'
  },
  c: 'b',
  x: 'La ciclación rápida exige revisar y tratar factores potencialmente asociados o desestabilizadores, incluidos trastornos tiroideos, consumo de sustancias y determinados medicamentos. No existe un único fármaco universalmente preferente y los antidepresivos deben utilizarse con especial cautela.',
  r: 'National Institute for Health and Care Excellence (2023). Bipolar disorder: assessment and management (CG185); American Psychiatric Association. Practice Guideline for the Treatment of Patients With Bipolar Disorder, rapid cycling.'
});

for (const q of block) set(q.id);
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 21-40 reauditorado: 20 validadas; 6 corregidas o reforzadas.');
