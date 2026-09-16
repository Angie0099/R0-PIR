const fs = require('fs');
const path = require('path');

const treatmentsFile = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const clinicalFile = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';

// Se toman 21 registros originales: uno se reubica y quedan 20 preguntas terapéuticas auditadas.
const candidates = treatments.filter(q => q.t?.includes(topic)).slice(80, 101);
if (candidates.length !== 21) throw new Error(`Se esperaban 21 registros candidatos y se encontraron ${candidates.length}`);

const misplacedId = 'SM_JULIO_2_SOL_1_171';
const misplaced = candidates.find(q => q.id === misplacedId);
if (!misplaced) throw new Error('No se encontró la pregunta de vulnerabilidad fluida que debe reubicarse');
if (clinical.some(q => q.id === misplacedId)) throw new Error(`Ya existe ${misplacedId} en clínica de adultos`);

misplaced.s = 'Clínica Adultos';
misplaced.t = ['Conducta suicida y autolesión'];
misplaced.v = 'VALIDADA_ORIGINAL';
misplaced.x = 'La teoría de la vulnerabilidad fluida distingue una vulnerabilidad basal relativamente estable y estados agudos fluctuantes. Durante una crisis puede activarse un modo suicida con rigidez cognitiva, intensa activación afectiva, dificultades de regulación y reducción de las alternativas percibidas.';
misplaced.r = 'Rudd, M. D. (2006). Fluid vulnerability theory: A cognitive approach to understanding the process of acute and chronic suicide risk. En T. E. Ellis (ed.), Cognition and Suicide. American Psychological Association.';

const misplacedIndex = treatments.findIndex(q => q.id === misplacedId);
treatments.splice(misplacedIndex, 1);
clinical.push(misplaced);

const block = candidates.filter(q => q.id !== misplacedId);
if (block.length !== 20) throw new Error(`Tras la reubicación debían quedar 20 preguntas y quedan ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque terapéutico auditado`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('SmCm09PIR2025_021', {
  e: '¿Qué intervención psicológica para el trastorno bipolar proporciona información estructurada sobre la enfermedad y entrena la detección temprana de recaídas?',
  o: {
    a: 'Psicoeducación específica para el trastorno bipolar.',
    b: 'Exposición interoceptiva.',
    c: 'Prevención de respuesta.',
    d: 'Terapia de reversión del hábito.'
  },
  c: 'a',
  x: 'La psicoeducación específica informa sobre el curso del trastorno y su tratamiento, favorece la adherencia, ayuda a identificar pródromos y permite elaborar planes de prevención de recaídas. Habitualmente se utiliza como complemento del tratamiento farmacológico.',
  r: 'Colom, F. y Vieta, E. (2006). Psychoeducation Manual for Bipolar Disorder. Cambridge University Press; National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.7.3-1.7.4.'
});

set('SmCm09PIR2025_023', {
  e: '¿Cómo se concibió originalmente el Curso para el Afrontamiento de la Depresión de Lewinsohn?',
  o: {
    a: 'Como un programa psicoeducativo estructurado y multicomponente que enseña habilidades para manejar la depresión.',
    b: 'Como una psicoterapia exclusivamente farmacológica.',
    c: 'Como un procedimiento centrado únicamente en interpretar sueños.',
    d: 'Como una exposición intensiva a sensaciones corporales.'
  },
  c: 'a',
  x: 'El Curso para el Afrontamiento de la Depresión se formuló como un programa estructurado, con formato educativo y entrenamiento en habilidades. Integra actividades agradables, habilidades sociales, modificación de cogniciones y estrategias para mantener las ganancias.',
  r: 'Lewinsohn, P. M., Antonuccio, D. O., Breckenridge, J. S. y Teri, L. (1984). The Coping with Depression Course. Castalia.'
});

set('SmCm09PIR2025_024', {
  e: 'Al informar a una persona que inicia un antidepresivo para la depresión, ¿qué indicación sobre la duración es correcta?',
  o: {
    a: 'Debe retirarlo en cuanto note la primera mejoría, sin revisión clínica.',
    b: 'El tratamiento puede necesitar mantenerse al menos 6 meses después de la remisión, con revisiones periódicas.',
    c: 'Todos los pacientes deben mantenerlo de por vida.',
    d: 'Si tarda más de 48 horas en actuar, debe considerarse ineficaz.'
  },
  c: 'b',
  x: 'NICE indica explicar que el tratamiento antidepresivo puede necesitar mantenerse al menos 6 meses después de la remisión, revisándolo regularmente. La duración debe individualizarse según el riesgo de recaída, los efectos adversos y las preferencias; no debe retirarse bruscamente al mejorar.',
  r: 'National Institute for Health and Care Excellence (2022). Depression in adults: treatment and management (NG222), recomendación 1.4.11.'
});

set('SmCm12PIR2024 2_117', {
  e: 'En activación conductual, ¿para qué se utiliza inicialmente el registro de actividades y estado de ánimo?',
  o: {
    a: 'Para demostrar que toda depresión tiene una única causa biológica.',
    b: 'Para identificar relaciones entre situaciones, actividades, evitación y cambios del estado de ánimo.',
    c: 'Para sustituir desde el primer día cualquier análisis funcional.',
    d: 'Para clasificar delirios según su contenido.'
  },
  c: 'b',
  x: 'El registro permite observar cómo se relacionan las actividades, el contexto, los patrones de evitación y el estado de ánimo. Esa información orienta el análisis funcional y la planificación gradual de acciones relevantes o potencialmente reforzantes.',
  r: 'Martell, C. R., Dimidjian, S. y Herman-Dunn, R. (2010). Behavioral Activation for Depression. Guilford Press.'
});

set('SmCm12PIR2024 2_120', {
  e: 'En el Curso para el Afrontamiento de la Depresión, ¿qué finalidad tiene la planificación para el futuro al terminar el programa?',
  o: {
    a: 'Consolidar las habilidades aprendidas y preparar estrategias ante posibles dificultades o recaídas.',
    b: 'Garantizar que nunca reaparecerá tristeza.',
    c: 'Eliminar inmediatamente todas las actividades programadas.',
    d: 'Sustituir las habilidades aprendidas por interpretación de sueños.'
  },
  c: 'a',
  x: 'La fase final revisa y consolida las habilidades entrenadas, ayuda a anticipar situaciones de riesgo y organiza estrategias para mantener las ganancias. Ningún programa puede garantizar la ausencia absoluta de malestar o recaídas.',
  r: 'Lewinsohn, P. M., Antonuccio, D. O., Breckenridge, J. S. y Teri, L. (1984). The Coping with Depression Course. Castalia.'
});

set('SmCm15PIR2025_150', {
  e: '¿Cuál es una tarea característica de la fase inicial de la terapia interpersonal para la depresión?',
  o: {
    a: 'Realizar el inventario interpersonal y acordar un área problema focal relacionada con el episodio.',
    b: 'Aplicar exposición interoceptiva a todas las personas.',
    c: 'Evitar explicar el diagnóstico o el encuadre temporal.',
    d: 'Modificar directamente rasgos básicos de personalidad antes de abordar los síntomas.'
  },
  c: 'a',
  x: 'En la fase inicial de la TIP se evalúan los síntomas, se explica el marco de la depresión, se realiza el inventario interpersonal y se formula un foco —duelo, disputa, transición o déficits interpersonales—, además de acordar el contrato y la duración del tratamiento.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

set('SmCm17PIR2025_165', {
  e: '¿Qué procedimientos se utilizan habitualmente para enseñar habilidades sociales en los programas conductuales para la depresión?',
  o: {
    a: 'Instrucciones, modelado, ensayo conductual, retroalimentación y reforzamiento.',
    b: 'Asociación libre e interpretación de sueños exclusivamente.',
    c: 'Exposición interoceptiva sin práctica interpersonal.',
    d: 'Privación de sueño y detención del pensamiento.'
  },
  c: 'a',
  x: 'El entrenamiento en habilidades sociales utiliza procedimientos de aprendizaje como instrucciones, modelado, práctica o ensayo de conducta, retroalimentación y reforzamiento. Estos procedimientos permiten adquirir y generalizar respuestas sociales más eficaces.',
  r: 'Lewinsohn, P. M., Antonuccio, D. O., Breckenridge, J. S. y Teri, L. (1984). The Coping with Depression Course. Castalia.'
});

set('SmCm17PIR2025_166', {
  e: 'En el entrenamiento en habilidades sociales para la depresión, ¿qué describe la aserción negativa?',
  o: {
    a: 'Expresar desacuerdo, defender derechos o solicitar cambios de manera adecuada.',
    b: 'Elogiar y mostrar afecto o reconocimiento.',
    c: 'Iniciar y mantener conversaciones informales.',
    d: 'Evitar cualquier conflicto mediante silencio permanente.'
  },
  c: 'a',
  x: 'La aserción negativa incluye expresar desacuerdo o malestar, defender derechos y pedir cambios de conducta de forma clara y respetuosa. La expresión de reconocimiento corresponde a la aserción positiva y conversar constituye otra área del entrenamiento.',
  r: 'Lewinsohn, P. M., Antonuccio, D. O., Breckenridge, J. S. y Teri, L. (1984). The Coping with Depression Course. Castalia; Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide.'
});

for (const q of block) set(q.id);
fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Bloque terapéutico 81-100 reauditorado: 20 validadas, 8 corregidas y 1 pregunta adicional reubicada en conducta suicida.');
