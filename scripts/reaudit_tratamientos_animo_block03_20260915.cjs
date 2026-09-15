const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const block = bank.filter(q => q.t?.includes(topic)).slice(40, 60);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque 41-60`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('SEPTIEMBRE-DOS-24_COMENTADO_140', {
  x: 'El Curso Mamás y Bebés es una intervención cognitivo-conductual manualizada diseñada para prevenir la depresión perinatal. Mellow Babies, MomMoodBooster y MUMentum incluyen componentes dirigidos al tratamiento de dificultades o síntomas ya presentes.',
  r: 'Tandon, S. D. et al. (2014). Six-month outcomes from a randomized controlled trial to prevent perinatal depression in low-income home visiting clients. Maternal and Child Health Journal, 18, 873-881; Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos.'
});

set('SIM_ABR2_134', {
  e: 'En terapia interpersonal para la depresión, ¿qué área se selecciona cuando el episodio se relaciona con la muerte de una persona significativa?',
  o: {
    a: 'Duelo.',
    b: 'Disputa de rol.',
    c: 'Transición de rol.',
    d: 'Déficits interpersonales.'
  },
  c: 'a',
  x: 'El duelo se selecciona cuando la aparición o el mantenimiento del episodio depresivo se relaciona con la muerte de una persona significativa. Las demás áreas responden a expectativas interpersonales incompatibles, cambios de rol o pobreza relacional.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

set('SIM_ABR25_142', {
  e: '¿Cuál es la técnica principal del CBASP de McCullough para ayudar a la persona con depresión crónica a relacionar su conducta con sus consecuencias?',
  o: {
    a: 'Análisis situacional.',
    b: 'Exposición interoceptiva.',
    c: 'Prevención de respuesta.',
    d: 'Asociación libre.'
  },
  c: 'a',
  x: 'El análisis situacional es la técnica nuclear del CBASP. Examina una situación interpersonal concreta, las interpretaciones y conductas de la persona, el resultado obtenido y el resultado deseado, para aprender respuestas más eficaces.',
  r: 'McCullough, J. P. (2000). Treatment for Chronic Depression: Cognitive Behavioral Analysis System of Psychotherapy. Guilford Press.'
});

set('SIM_ABR25_150', {
  e: 'En terapia interpersonal, ¿qué área problemática se selecciona cuando el episodio depresivo se vincula con expectativas incompatibles y un conflicto persistente con otra persona significativa?',
  o: {
    a: 'Duelo.',
    b: 'Disputa interpersonal de rol.',
    c: 'Transición de rol.',
    d: 'Déficits interpersonales.'
  },
  c: 'b',
  x: 'Las disputas de rol aparecen cuando dos personas mantienen expectativas no recíprocas o incompatibles sobre su relación. La intervención clarifica el conflicto, mejora la comunicación y busca renegociar las expectativas o aceptar el impasse.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

set('SIM_PERS_AGO25_077', {
  e: '¿Qué característica de la relación terapéutica distingue especialmente al CBASP para la depresión crónica?',
  o: {
    a: 'La implicación personal disciplinada y contingente del terapeuta.',
    b: 'La neutralidad absoluta y la ausencia de respuesta interpersonal.',
    c: 'La interpretación sistemática de los sueños.',
    d: 'La prohibición de analizar situaciones interpersonales concretas.'
  },
  c: 'a',
  x: 'El CBASP emplea la implicación personal disciplinada: el terapeuta utiliza de manera controlada y contingente el efecto interpersonal que produce la conducta del paciente. Se combina con análisis situacional y ejercicios de discriminación interpersonal.',
  r: 'McCullough, J. P. (2006). Treating Chronic Depression with Disciplined Personal Involvement. Springer.'
});

set('SIM_PERS_AGO25_122', {
  e: '¿Qué ejemplo representa de forma más clara la abstracción selectiva o filtro mental en la depresión?',
  o: {
    a: '«Si no obtengo la máxima nota, soy un fracaso total».',
    b: '«Mi jefe no me saludó; sé que piensa que soy incompetente».',
    c: '«Recibí nueve comentarios positivos y una crítica; solo puedo pensar en la crítica».',
    d: '«Me siento inútil, por tanto soy inútil».'
  },
  c: 'c',
  x: 'La abstracción selectiva consiste en atender exclusivamente a un detalle negativo y filtrar la información positiva del conjunto. La a refleja pensamiento dicotómico, la b lectura de mente y la d razonamiento emocional.',
  r: 'Beck, A. T. et al. (1979). Cognitive Therapy of Depression. Guilford Press.'
});

set('Simu 11 comentado_098', {
  e: '¿Qué terapia trabaja específicamente los focos de duelo, disputas de rol, transiciones de rol y déficits interpersonales?',
  o: {
    a: 'Terapia interpersonal.',
    b: 'Terapia cognitiva de Beck.',
    c: 'Entrenamiento en habilidades sociales.',
    d: 'Sistema de Análisis Cognitivo-Conductual de Psicoterapia.'
  },
  c: 'a',
  x: 'Duelo, disputas de rol, transiciones de rol y déficits interpersonales son las cuatro áreas problemáticas clásicas de la terapia interpersonal de Klerman y Weissman.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

for (const q of block) set(q.id);
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 41-60 reauditorado: 20 validadas; 7 corregidas o diversificadas.');
