const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const block = bank.filter(q => q.t?.includes(topic)).slice(60, 80);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque 61-80`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('Simu 13 comentado_123', {
  e: '¿Qué afirmación describe correctamente el papel del litio en el trastorno bipolar?',
  o: {
    a: 'Carece de utilidad en el tratamiento de mantenimiento.',
    b: 'Es una opción fundamental de mantenimiento y debe considerarse especialmente cuando existe riesgo de suicidio.',
    c: 'Es el tratamiento de elección durante cualquier embarazo porque no presenta riesgos fetales.',
    d: 'No necesita controles plasmáticos ni vigilancia renal o tiroidea.'
  },
  c: 'b',
  x: 'El litio es un tratamiento de referencia para la prevención de recaídas en el trastorno bipolar y las guías destacan su posible efecto beneficioso sobre el riesgo suicida. Requiere monitorización plasmática y vigilancia renal, tiroidea y metabólica; durante el embarazo exige una valoración individual de riesgos y beneficios.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.7.7-1.7.12.'
});

set('Simu 14 comentado _096', {
  e: 'Respecto al uso de antidepresivos en el trastorno bipolar I, señale la afirmación correcta:',
  o: {
    a: 'La monoterapia antidepresiva es una estrategia de mantenimiento de primera elección.',
    b: 'Debe evitarse la monoterapia antidepresiva por el riesgo de viraje o desestabilización del ánimo.',
    c: 'Los antecedentes de viraje o ciclación no influyen en la decisión terapéutica.',
    d: 'Si aparece manía durante su uso, el antidepresivo debe aumentarse necesariamente.'
  },
  c: 'b',
  x: 'En el trastorno bipolar I no se recomienda la monoterapia antidepresiva. Si aparece manía o hipomanía durante el tratamiento, debe valorarse suspender el antidepresivo y tratar el episodio con una intervención antimaníaca; también deben considerarse los antecedentes de viraje y ciclación.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.5.2 y 1.5.7; Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('Simu 15 comentado_178', {
  e: '¿Cuál es el objetivo inmediato característico de la activación conductual en la depresión?',
  o: {
    a: 'Aumentar gradualmente la participación en actividades vinculadas a refuerzo y reducir los patrones de evitación.',
    b: 'Analizar exclusivamente los conflictos infantiles inconscientes.',
    c: 'Suprimir cualquier emoción negativa antes de retomar actividades.',
    d: 'Esperar a que mejore la motivación para comenzar a actuar.'
  },
  c: 'a',
  x: 'La activación conductual ayuda a identificar patrones de evitación y a programar de manera gradual actividades relevantes o potencialmente reforzantes. No exige que la motivación o el estado de ánimo mejoren antes de actuar.',
  r: 'Martell, C. R., Dimidjian, S. y Herman-Dunn, R. (2010). Behavioral Activation for Depression. Guilford Press; National Institute for Health and Care Excellence (2022). Depression in adults: treatment and management (NG222).'
});

set('Simu 7 comentado _185', {
  e: '¿Qué intervención está diseñada específicamente para reducir el riesgo de recaída depresiva enseñando a reconocer y responder de otro modo a patrones de pensamiento negativos?',
  o: {
    a: 'Terapia cognitiva basada en mindfulness (MBCT).',
    b: 'Exposición con prevención de respuesta.',
    c: 'Desensibilización sistemática.',
    d: 'Terapia de reversión del hábito.'
  },
  c: 'a',
  x: 'La MBCT combina prácticas de mindfulness con elementos cognitivos para que la persona detecte pensamientos y sentimientos negativos sin quedar atrapada en ellos. NICE la incluye entre las opciones para personas con mayor riesgo de recaída depresiva.',
  r: 'Segal, Z. V., Williams, J. M. G. y Teasdale, J. D. (2013). Mindfulness-Based Cognitive Therapy for Depression (2.ª ed.). Guilford Press; National Institute for Health and Care Excellence (2022). Depression in adults: treatment and management (NG222), prevención de recaídas.'
});

set('simu 9 comentado_156', {
  e: '¿Cuál es un objetivo central de la psicoeducación en el trastorno bipolar?',
  o: {
    a: 'Mejorar el conocimiento del trastorno, la adherencia y la detección precoz de signos de recaída.',
    b: 'Sustituir sistemáticamente la medicación estabilizadora.',
    c: 'Evitar que el paciente participe en las decisiones terapéuticas.',
    d: 'Centrarse únicamente en experiencias infantiles remotas.'
  },
  c: 'a',
  x: 'La psicoeducación favorece el conocimiento del trastorno y del tratamiento, la adherencia, la regularidad de hábitos y el reconocimiento temprano de pródromos. Habitualmente complementa el tratamiento farmacológico, no lo sustituye de forma sistemática.',
  r: 'Colom, F. y Vieta, E. (2006). Psychoeducation Manual for Bipolar Disorder. Cambridge University Press.'
});

set('SM_ABRIL_1_SOL_1_176', {
  e: 'En una persona con depresión que presenta alto riesgo de recaída, ¿qué debe incluir una intervención psicológica de prevención de recaídas?',
  o: {
    a: 'Finalizar el tratamiento sin revisar señales de alarma ni estrategias previas.',
    b: 'Identificar situaciones de riesgo, señales de alarma y estrategias concretas para afrontar pensamientos, emociones o conductas asociadas a recaídas.',
    c: 'Evitar hablar de episodios anteriores para no activar recuerdos negativos.',
    d: 'Garantizar que nunca volverá a experimentar tristeza.'
  },
  c: 'b',
  x: 'La prevención de recaídas debe ayudar a reconocer señales de alarma y factores de riesgo personales, revisar lo aprendido y elaborar planes concretos de respuesta. No puede garantizar la ausencia total de emociones negativas ni de nuevos episodios.',
  r: 'National Institute for Health and Care Excellence (2022). Depression in adults: treatment and management (NG222), sección 1.8, prevención de recaídas.'
});

set('SM_DICIEMBRE_1_SOL_1_149', {
  x: 'ORBIT (Online, Recovery-focused, Bipolar Individual Therapy) es una intervención en línea. MONARCA y SIMPLe se desarrollaron como aplicaciones para teléfonos inteligentes; PRISM utilizó una intervención móvil administrada mediante un teléfono con acceso a internet.',
  r: 'Murray, G. et al. (2015). Online mindfulness-based intervention for late-stage bipolar disorder: pilot evidence for feasibility and effectiveness. Journal of Affective Disorders, 178, 46-51; Faurholt-Jepsen, M. et al. (2015). Daily electronic self-monitoring in bipolar disorder using smartphones: the MONARCA I trial. Psychological Medicine, 45, 2691-2704.'
});

set('SM_ENERO_1_SOL_1_140', {
  e: 'Según las recomendaciones actuales, ¿qué afirmación es correcta sobre la ciclación rápida en el trastorno bipolar?',
  o: {
    a: 'Debe tratarse siempre con valproato como opción específica y universal.',
    b: 'Debe recibir las mismas intervenciones que otras presentaciones, porque no hay evidencia sólida para un tratamiento diferencial específico.',
    c: 'El litio está absolutamente contraindicado.',
    d: 'La psicoterapia está contraindicada.'
  },
  c: 'b',
  x: 'NICE recomienda ofrecer a las personas con ciclación rápida las mismas intervenciones que a quienes presentan otros cursos del trastorno bipolar, ya que no existe evidencia sólida que justifique un tratamiento diferencial. Por tanto, no debe asociarse automáticamente la ciclación rápida con valproato. Además, el valproato está sujeto a importantes restricciones por sus riesgos reproductivos.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendación 1.5. rapid cycling; Medicines and Healthcare products Regulatory Agency (2025). Valproate: reproductive risks.'
});

for (const q of block) set(q.id);
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 61-80 reauditorado: 20 validadas; 8 corregidas o diversificadas.');
