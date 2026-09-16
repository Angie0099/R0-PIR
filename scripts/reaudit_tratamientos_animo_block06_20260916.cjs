const fs = require('fs');
const path = require('path');

const treatmentsFile = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const clinicalFile = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const candidates = treatments.filter(q => q.t?.includes(topic)).slice(100, 121);
if (candidates.length !== 21) throw new Error(`Se esperaban 21 registros candidatos y se encontraron ${candidates.length}`);

const misplacedId = 'SmCm27PIR2025 (1)_040';
const misplaced = candidates.find(q => q.id === misplacedId);
if (!misplaced) throw new Error('No se encontró la pregunta de evaluación del riesgo suicida');
if (clinical.some(q => q.id === misplacedId)) throw new Error(`Ya existe ${misplacedId} en clínica de adultos`);
misplaced.s = 'Clínica Adultos';
misplaced.t = ['Conducta suicida y autolesión'];
misplaced.v = 'VALIDADA_ORIGINAL';
const misplacedIndex = treatments.findIndex(q => q.id === misplacedId);
treatments.splice(misplacedIndex, 1);
clinical.push(misplaced);

const block = candidates.filter(q => q.id !== misplacedId);
if (block.length !== 20) throw new Error(`Tras reubicar debían quedar 20 preguntas y quedan ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque terapéutico auditado`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('SmCm19PIR2024_148', {
  e: '¿Qué afirmación sobre lamotrigina en el trastorno bipolar es correcta?',
  o: {
    a: 'Se recomienda como tratamiento de la manía aguda.',
    b: 'Puede ser útil en el mantenimiento, especialmente para prevenir recaídas depresivas, pero no está indicada para tratar la manía aguda.',
    c: 'Carece de utilidad en la prevención de episodios depresivos.',
    d: 'Debe iniciarse siempre a dosis altas porque no existe riesgo de erupción cutánea grave.'
  },
  c: 'b',
  x: 'Lamotrigina tiene un papel especialmente relacionado con la polaridad depresiva y el mantenimiento, pero no se recomienda para la manía aguda. Debe titularse gradualmente para reducir el riesgo de reacciones cutáneas graves.',
  r: 'Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170; National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185).'
});

set('SmCm20PIR2024_193', {
  e: 'Según NICE, ¿qué dos anticonvulsivantes NO deben ofrecerse para tratar el trastorno bipolar?',
  o: {
    a: 'Gabapentina y topiramato.',
    b: 'Lamotrigina y carbamazepina.',
    c: 'Valproato y lamotrigina.',
    d: 'Carbamazepina y valproato.'
  },
  c: 'a',
  x: 'NICE indica expresamente no ofrecer gabapentina ni topiramato para tratar el trastorno bipolar. Que ambos sean anticonvulsivantes no implica que posean eficacia como tratamientos del trastorno bipolar.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendación 1.10.4.'
});

set('SmCm25PIR2025_069', {
  e: '¿Qué adaptación breve derivada de la terapia interpersonal se ha utilizado especialmente en atención primaria para síntomas depresivos?',
  o: {
    a: 'Consejo interpersonal (IPC).',
    b: 'Exposición con prevención de respuesta.',
    c: 'Entrenamiento en reversión del hábito.',
    d: 'Inoculación de estrés.'
  },
  c: 'a',
  x: 'El consejo interpersonal o Interpersonal Counseling (IPC) es una intervención breve derivada de la TIP, adaptada para contextos como atención primaria. Conserva el vínculo entre síntomas y problemas interpersonales actuales, con un formato más breve.',
  r: 'Weissman, M. M. et al. (2014). Interpersonal Counseling (IPC) for Depression in Primary Care. American Journal of Psychotherapy, 68, 359-383; Markowitz, J. C. y Weissman, M. M. (2012). Clinical Psychology & Psychotherapy, 19, 99-105.'
});

set('SmCm26PIR2025_035', {
  e: 'Ante una respuesta nula o limitada al tratamiento de la depresión, ¿cuál debe ser una de las primeras actuaciones antes de decidir el siguiente paso?',
  o: {
    a: 'Revisar factores que puedan explicar la falta de respuesta, como adherencia, dosis o duración, dificultades sociales y comorbilidad.',
    b: 'Concluir automáticamente que el diagnóstico es erróneo.',
    c: 'Combinar varios fármacos sin valorar riesgos ni preferencias.',
    d: 'Repetir indefinidamente el mismo tratamiento sin revisar su aplicación.'
  },
  c: 'a',
  x: 'Antes de cambiar o intensificar el tratamiento deben revisarse problemas de aplicación y adherencia, duración y dosis adecuadas, circunstancias personales o sociales, comorbilidades y el propio diagnóstico. Después se decide de forma compartida entre cambio, combinación o derivación especializada.',
  r: 'National Institute for Health and Care Excellence (2022). Depression in adults: treatment and management (NG222), sección 1.9, respuesta nula o limitada.'
});

set('SmCm26PIR2025_036', {
  r: 'Werner, E. A. et al. (2016). PREPP: postpartum depression prevention through the mother-infant dyad. Archives of Women’s Mental Health, 19, 229-242. https://doi.org/10.1007/s00737-015-0549-5'
});

set('SmCm26PIR2025_037', {
  e: 'En activación conductual, ¿qué caracteriza una programación adecuada de actividades?',
  o: {
    a: 'Se acuerdan tareas graduales, concretas y vinculadas al análisis funcional y a objetivos relevantes para la persona.',
    b: 'Se prescribe la misma lista de actividades agradables a todos los pacientes.',
    c: 'Se espera a que desaparezca la tristeza antes de actuar.',
    d: 'Se seleccionan únicamente tareas difíciles para producir un cambio rápido.'
  },
  c: 'a',
  x: 'La programación es individualizada y gradual. Las actividades se eligen según los patrones de evitación, los objetivos y valores de la persona y las posibilidades reales de éxito; después se revisan sus consecuencias para ajustar el plan.',
  r: 'Martell, C. R., Dimidjian, S. y Herman-Dunn, R. (2010). Behavioral Activation for Depression. Guilford Press.'
});

set('SmCm2PIR2024_155', {
  e: 'En la fase intermedia de la terapia interpersonal, ¿para qué se utiliza el análisis de la comunicación?',
  o: {
    a: 'Para reconstruir detalladamente una interacción, identificar mensajes y afectos y ensayar formas de comunicación más eficaces.',
    b: 'Para clasificar automáticamente rasgos de personalidad.',
    c: 'Para evitar hablar de relaciones actuales.',
    d: 'Para sustituir el foco interpersonal por exposición interoceptiva.'
  },
  c: 'a',
  x: 'El análisis de la comunicación examina paso a paso un intercambio interpersonal: qué se dijo, qué quedó implícito, qué emociones aparecieron y cómo reaccionó la otra persona. Permite explorar y ensayar alternativas mediante clarificación y juego de roles.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

set('SmCm30PIR2025 (1)_075', {
  e: 'En el Curso para el Afrontamiento de la Depresión de Lewinsohn, ¿qué función cumple el módulo de actividades agradables?',
  o: {
    a: 'Aumentar de forma planificada el contacto con actividades potencialmente reforzantes y observar su relación con el estado de ánimo.',
    b: 'Eliminar toda actividad hasta que desaparezcan los síntomas.',
    c: 'Interpretar el significado inconsciente de cada actividad.',
    d: 'Provocar deliberadamente experiencias de fracaso.'
  },
  c: 'a',
  x: 'El módulo ayuda a registrar y aumentar gradualmente actividades agradables o valiosas, observando la relación entre conducta y estado de ánimo. Forma parte de un programa más amplio que también trabaja habilidades sociales y cogniciones.',
  r: 'Lewinsohn, P. M., Antonuccio, D. O., Breckenridge, J. S. y Teri, L. (1984). The Coping with Depression Course. Castalia.'
});

for (const q of block) set(q.id);
fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Bloque terapéutico 101-120 reauditorado: 20 validadas, 8 corregidas y 1 pregunta adicional reubicada en conducta suicida.');
