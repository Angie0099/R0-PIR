import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => {
  if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8')));
  return files.get(name);
};
const adult = load('tratamientos_adultos.json');
const topic = 'Tratamiento de los trastornos de ansiedad';
const initialIds = adult.filter((q) => q.t?.includes(topic)).slice(0, 20).map((q) => q.id);
const expected = [
  '14Simulacro2018Comentarios_141', '4Simulacro02018Comentarios_102', '4Simulacro02018Comentarios_103',
  '4Simulacro02018Comentarios_106', '4Simulacro02018Comentarios_110', '4Simulacro02018Comentarios_112',
  '4Simulacro02018Comentarios_115', '4Simulacro02018Comentarios_182', '4Simulacro02018Comentarios_183',
  '4Simulacro02018Comentarios_184', '4Simulacro02018Comentarios_186', 'ABRIL-UNO-24_COMENTADO_076',
  'ABRIL-UNO-24_COMENTADO_100', 'AGOSTO2_029', 'AGOSTO2_059', 'DICIEMBRE-DOS-24_COMENTADO_109',
  'DICIEMBRE-DOS-24_COMENTADO_128', 'JULIO1_132', 'JULIO1_173', 'JUNIO-UNO-24_COMENTADO_207'
];
if (JSON.stringify(initialIds) !== JSON.stringify(expected)) throw new Error('El orden del bloque cambió; se cancela para evitar editar otras preguntas.');

const patchQuestion = (id, values) => {
  const row = adult.find((q) => q.id === id);
  if (!row) throw new Error(`No se encontró ${id}`);
  Object.assign(row, values, { v: 'VALIDADA_ORIGINAL' });
};
const move = (id, destination, subject, destinationTopic, values) => {
  const index = adult.findIndex((q) => q.id === id);
  if (index < 0) throw new Error(`No se encontró ${id}`);
  const [row] = adult.splice(index, 1);
  Object.assign(row, values, { s: subject, t: [destinationTopic], v: 'VALIDADA_ORIGINAL' });
  const target = load(destination);
  if (target.some((q) => q.id === id)) throw new Error(`ID duplicado al mover ${id}`);
  target.push(row);
};
const remove = (id) => {
  const index = adult.findIndex((q) => q.id === id);
  if (index < 0) throw new Error(`No se encontró ${id}`);
  adult.splice(index, 1);
};

patchQuestion('14Simulacro2018Comentarios_141', {
  e: '¿Qué protocolo para el trastorno de pánico incluye de forma explícita el abandono de las conductas de seguridad?',
  o: { a: 'Programa de control del pánico de Barlow y Craske', b: 'Terapia cognitiva de Clark', c: 'TCC de Borkovec', d: 'TCC de Dugas y Ladouceur' }, c: 'b',
  x: 'La b es correcta: la terapia cognitiva de Clark identifica y elimina conductas de seguridad para que el paciente pueda comprobar que la catástrofe temida no ocurre. Barlow y Craske destacan especialmente la exposición interoceptiva; Borkovec y Dugas-Ladouceur desarrollaron protocolos para el TAG.',
  r: 'Clark, D. M. (1986). A cognitive approach to panic. Behaviour Research and Therapy, 24(4), 461–470. https://doi.org/10.1016/0005-7967(86)90011-2'
});
move('4Simulacro02018Comentarios_102', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo', {
  e: 'La privación del sueño se ha estudiado como intervención de efecto antidepresivo rápido principalmente en:',
  o: { a: 'Enuresis', b: 'Depresión', c: 'Pesadillas', d: 'Trastornos parafílicos' }, c: 'b',
  x: 'La b es correcta: la privación total o parcial de sueño puede producir una mejoría antidepresiva rápida, aunque frecuentemente transitoria y con riesgo de recaída tras dormir. No constituye un tratamiento de primera línea aislado.',
  r: 'Boland, E. M. et al. (2017). Meta-analysis of the antidepressant effects of acute sleep deprivation. Journal of Clinical Psychiatry, 78(8), e1020–e1034.'
});
patchQuestion('4Simulacro02018Comentarios_103', {
  e: 'En la terapia metacognitiva de Wells para el TAG, ¿cómo se denominan las preocupaciones sobre la propia preocupación?',
  o: { a: 'Preocupaciones de tipo 1', b: 'Preocupaciones de tipo 2 o metapreocupaciones', c: 'Preocupaciones de tipo 3', d: 'Preocupaciones de tipo 4' }, c: 'b',
  x: 'La b es correcta: las preocupaciones de tipo 1 se refieren a acontecimientos externos o síntomas; las de tipo 2 son valoraciones negativas acerca de preocuparse —por ejemplo, creer que la preocupación es incontrolable o peligrosa— y constituyen la metapreocupación.',
  r: 'Wells, A. (1999). A metacognitive model and therapy for generalized anxiety disorder. Clinical Psychology & Psychotherapy, 6, 86–95.'
});
move('4Simulacro02018Comentarios_106', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo', {
  e: 'En la terapia de autocontrol de Rehm para la depresión, ¿qué componente enseña a fijar objetivos alcanzables y valorar el grado en que se consiguen?',
  o: { a: 'Autoobservación', b: 'Autoseguimiento', c: 'Autoevaluación', d: 'Autorrefuerzo' }, c: 'c',
  x: 'La c es correcta: la autoevaluación trabaja criterios realistas y la comparación entre conducta y objetivos alcanzables. La autoobservación registra selectivamente la conducta y el autorrefuerzo incrementa recompensas contingentes al logro.',
  r: 'Rehm, L. P. (1977). A self-control model of depression. Behavior Therapy, 8(5), 787–804.'
});
patchQuestion('4Simulacro02018Comentarios_110', {
  e: '¿Cuál es una ventaja de la exposición mediante realidad virtual frente a determinadas exposiciones en vivo?',
  o: { a: 'El hardware siempre tiene un coste bajo', b: 'Siempre es más económica que la exposición en imaginación', c: 'Permite controlar el entorno y preservar la privacidad y seguridad del paciente', d: 'Puede aplicarla cualquier persona sin formación clínica' }, c: 'c',
  x: 'La c es correcta: la realidad virtual permite graduar, repetir y controlar estímulos en un entorno privado y seguro. Su coste no es necesariamente bajo, no siempre supera económicamente a la imaginación y requiere un profesional competente.',
  r: 'Carl, E. et al. (2019). Virtual reality exposure therapy for anxiety and related disorders: A meta-analysis. Journal of Anxiety Disorders, 61, 27–36. https://doi.org/10.1016/j.janxdis.2018.08.003'
});
patchQuestion('4Simulacro02018Comentarios_112', {
  e: 'En comparación con la terapia cognitiva de Clark, el programa de control del pánico de Barlow y Craske pone un énfasis relativamente mayor en:',
  o: { a: 'Procedimientos conductuales, especialmente exposición interoceptiva', b: 'Interpretación psicodinámica', c: 'Entrenamiento en habilidades sociales', d: 'Psicoeducación como único componente' }, c: 'a',
  x: 'La a es correcta: ambos protocolos incluyen elementos cognitivos y conductuales, pero el programa de Barlow y Craske se caracteriza especialmente por la exposición repetida a sensaciones corporales temidas. Clark enfatiza la reevaluación de interpretaciones catastróficas y los experimentos conductuales.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic. Oxford University Press; Clark, D. M. (1986). Behaviour Research and Therapy, 24, 461–470.'
});
patchQuestion('4Simulacro02018Comentarios_115', {
  e: 'Según el modelo escalonado de NICE para el TAG, ¿qué opciones se ofrecen ante deterioro funcional marcado o respuesta insuficiente a intervenciones de baja intensidad?',
  o: { a: 'Únicamente farmacoterapia', b: 'Solo relajación no aplicada', c: 'TCC o relajación aplicada de alta intensidad, o tratamiento farmacológico', d: 'Hospitalización obligatoria' }, c: 'c',
  x: 'La c es correcta: en el escalón 3 se ofrece una intervención psicológica de alta intensidad —TCC o relajación aplicada— o tratamiento farmacológico, atendiendo a preferencias, respuesta previa y riesgos. No se limita el tratamiento a una única modalidad.',
  r: 'National Institute for Health and Care Excellence. Generalised anxiety disorder and panic disorder in adults: management (CG113), recomendaciones 1.2–1.3, actualización 2024.'
});
move('4Simulacro02018Comentarios_182', 'clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad', {
  e: '¿Qué característica deben presentar los ataques de pánico para establecer el diagnóstico de trastorno de pánico?',
  o: { a: 'Ser exclusivamente nocturnos', b: 'Aparecer solo ante un estímulo fóbico', c: 'Ser recurrentes e inesperados', d: 'Incluir siempre desmayo' }, c: 'c',
  x: 'La c es correcta: el trastorno de pánico exige ataques recurrentes e inesperados y, tras al menos uno, un mes o más de preocupación persistente o cambio conductual desadaptativo. Los ataques situacionales pueden aparecer, pero no definen por sí solos el trastorno.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, capítulo «Anxiety Disorders», apartado de trastorno de pánico.'
});
move('4Simulacro02018Comentarios_183', 'clinica_adultos.json', 'Clínica Adultos', 'Trastornos de la personalidad', {
  e: '¿Qué trastorno de la personalidad se define por un patrón general de emotividad excesiva y búsqueda de atención?',
  o: { a: 'Trastorno histriónico de la personalidad', b: 'Trastorno narcisista de la personalidad', c: 'Trastorno límite de la personalidad', d: 'Trastorno antisocial de la personalidad' }, c: 'a',
  x: 'La a es correcta: el rasgo nuclear del trastorno histriónico es un patrón general de emotividad excesiva y búsqueda de atención que comienza al inicio de la edad adulta y aparece en distintos contextos.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, capítulo «Personality Disorders».'
});
patchQuestion('4Simulacro02018Comentarios_184', {
  e: '¿Qué protocolo cognitivo-conductual individual para la ansiedad social utiliza videofeedback para corregir la autoimagen negativa distorsionada?',
  o: { a: 'TCCC de Davidson', b: 'TCC grupal de McEvoy', c: 'Protocolo de Clark y Wells', d: 'TCC grupal de Heimberg' }, c: 'c',
  x: 'La c es correcta: Clark y Wells emplean videofeedback para contrastar la imagen negativa que el paciente cree proyectar con su conducta observable. El protocolo también trabaja atención autofocalizada, conductas de seguridad, experimentos conductuales y procesamiento pre y posevento.',
  r: 'National Institute for Health and Care Excellence. Social anxiety disorder (CG159), recomendación 1.3.13; Clark, D. M. y Wells, A. (1995). A cognitive model of social phobia.'
});
move('4Simulacro02018Comentarios_186', 'clinica_adultos.json', 'Clínica Adultos', 'TOC', {
  e: '¿En qué capítulo clasifica el DSM-5-TR el trastorno de acumulación?',
  o: { a: 'Otros trastornos mentales', b: 'Trastornos disruptivos, del control de los impulsos y de la conducta', c: 'Trastorno obsesivo-compulsivo y trastornos relacionados', d: 'Afecciones que pueden ser objeto de atención clínica' }, c: 'c',
  x: 'La c es correcta: el trastorno de acumulación es un diagnóstico independiente dentro del capítulo de trastorno obsesivo-compulsivo y trastornos relacionados.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, capítulo «Obsessive-Compulsive and Related Disorders».'
});
remove('ABRIL-UNO-24_COMENTADO_076');
move('ABRIL-UNO-24_COMENTADO_100', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos disociativos', {
  e: 'En la primera fase del tratamiento orientado por fases para los trastornos disociativos complejos, ¿qué actuación está indicada?',
  o: { a: 'Descartar por completo las intervenciones sensoriomotrices', b: 'Procesar intensivamente todos los recuerdos traumáticos', c: 'Favorecer una comunicación interna segura y cooperación entre las partes disociativas', d: 'Evitar cualquier metáfora terapéutica' }, c: 'c',
  x: 'La c es correcta: la primera fase se centra en seguridad, estabilización, regulación y cooperación interna. El procesamiento intensivo de memorias corresponde a una fase posterior; las intervenciones corporales y las metáforas pueden utilizarse cuando resultan apropiadas.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
move('AGOSTO2_029', 'clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad', {
  e: '¿Cuál de los siguientes NO es uno de los 13 síntomas del ataque de pánico recogidos en el DSM-5-TR?',
  o: { a: 'Náuseas o malestar abdominal', b: 'Escalofríos o sensación de calor', c: 'Temblor o sacudidas', d: 'Distorsiones perceptivas inespecíficas' }, c: 'd',
  x: 'La d es correcta: el DSM-5-TR incluye desrealización o despersonalización, pero no una categoría genérica de «distorsiones perceptivas». Náuseas, escalofríos o calor y temblor sí forman parte de la lista.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, especificador de ataque de pánico.'
});
move('AGOSTO2_059', 'clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad', {
  e: '¿Cuál de los siguientes síntomas de un ataque de pánico pertenece claramente al componente cognitivo catastrófico?',
  o: { a: 'Palpitaciones', b: 'Mareo o inestabilidad', c: 'Náuseas', d: 'Miedo a morir' }, c: 'd',
  x: 'La d es correcta: miedo a morir es una cognición catastrófica. Palpitaciones, mareo y náuseas son manifestaciones somáticas. Se corrige la clave original, que atribuía erróneamente la dimensión cognitiva a las náuseas.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, especificador de ataque de pánico; Belloch, Sandín y Ramos (2024). Manual de psicopatología, vol. II.'
});
move('DICIEMBRE-DOS-24_COMENTADO_109', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos disociativos', {
  e: '¿Para qué cuadros se desarrolló el tratamiento orientado por fases asociado a Van der Hart y colaboradores?',
  o: { a: 'Trastornos disociativos complejos relacionados con trauma', b: 'Trastorno de síntomas somáticos exclusivamente', c: 'Trastorno de ansiedad por enfermedad', d: 'Trastorno de ansiedad generalizada' }, c: 'a',
  x: 'La a es correcta: el modelo organiza el tratamiento de la disociación estructural compleja en estabilización, trabajo gradual con recuerdos traumáticos e integración/rehabilitación. No es un protocolo específico para TAG o ansiedad por enfermedad.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
patchQuestion('DICIEMBRE-DOS-24_COMENTADO_128', {
  e: 'En la clasificación SIGN recogida por el manual de referencia, ¿qué nivel de evidencia y grado de recomendación se asigna a la autoayuda para la ansiedad social?',
  o: { a: '1++, A', b: '1+, A', c: '1−, B', d: '3, D' }, c: 'b',
  x: 'La b es correcta dentro de la tabla SIGN utilizada por el manual: autoayuda para ansiedad social se clasifica como 1+ y grado A. Esta notación histórica no debe confundirse con la formulación actual de NICE, que recomienda autoayuda apoyada basada en TCC cuando el adulto declina la TCC individual.',
  r: 'Fonseca-Pedrero, E. (coord.) (2019). Manual de tratamientos psicológicos: Adultos, p. 379; NICE CG159, recomendación 1.3.4.'
});
patchQuestion('JULIO1_132', {
  e: 'Según la tabla SIGN del manual de referencia, ¿para qué trastorno se asigna a la autoayuda un nivel de evidencia 3 y grado de recomendación D?',
  o: { a: 'Fobia específica', b: 'Trastorno de ansiedad social', c: 'Trastorno de pánico', d: 'Trastorno de ansiedad generalizada' }, c: 'd',
  x: 'La d es correcta en la clasificación concreta del manual: la autoayuda para TAG figura con nivel 3 y grado D, frente a la mejor valoración consignada para pánico, fobia específica y ansiedad social. Es una pregunta sobre esa tabla histórica, no sobre la recomendación actual de NICE.',
  r: 'Fonseca-Pedrero, E. (coord.) (2019). Manual de tratamientos psicológicos: Adultos, tabla de evidencia para trastornos de ansiedad; NICE CG113 para recomendaciones actuales.'
});
move('JULIO1_173', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos disociativos', {
  e: '¿En qué fase del tratamiento orientado por fases de los trastornos disociativos se recomienda especialmente el uso de metáforas para apoyar integración y rehabilitación?',
  o: { a: 'Fase 1: estabilización y desarrollo de habilidades', b: 'Fase 2: tratamiento de recuerdos traumáticos', c: 'Fase 3: integración de la personalidad y rehabilitación', d: 'Una fase 4 independiente de cierre' }, c: 'c',
  x: 'La c es correcta: en la fase 3 se consolidan integración, identidad y adaptación a la vida cotidiana; las metáforas pueden facilitar este trabajo y la terminación gradual. El modelo clásico consta de tres fases, aunque el proceso es recursivo.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
move('JUNIO-UNO-24_COMENTADO_207', 'clinica_adultos.json', 'Clínica Adultos', 'Trastornos de ansiedad', {
  e: 'En comparación con el trastorno de ansiedad social, ¿qué afirmación describe mejor la timidez no clínica?',
  o: { a: 'Siempre comienza más tarde', b: 'Produce necesariamente mayor deterioro social y laboral', c: 'Puede aparecer tempranamente y disminuir o desaparecer sin causar deterioro clínicamente significativo', d: 'Siempre implica evitación más grave' }, c: 'c',
  x: 'La c es correcta: la timidez puede ser transitoria y no producir deterioro significativo. El trastorno de ansiedad social se diferencia por miedo, evitación, persistencia y afectación funcional clínicamente relevantes.',
  r: 'American Psychiatric Association (2022). DSM-5-TR, capítulo «Anxiety Disorders»; Turner, S. M. y Beidel, D. C. (1989). Social phobia and overanxious disorder in school-age children.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const [subject, meta] of Object.entries(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: expected.length, removedSemanticDuplicate: 1, remainingInTopic: adult.filter((q) => q.t?.includes(topic)).length }));
