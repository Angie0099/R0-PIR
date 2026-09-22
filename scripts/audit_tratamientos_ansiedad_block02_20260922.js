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
const expected = ['JUNIO1_204','MAYO-DOS-24_COMENTADO_043','NOVIEMBRE-DOS-24_COMENTADO_159','NOVIEMBRE-DOS-24_COMENTADO_163','OCTUBRE-UNO-24_COMENTADO_100','OCTUBRE-UNO-24_COMENTADO_129','PERSEV_JUL25_D2_117','PERSEV_JUL25_D2_147','PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_144','PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_171','PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_167','PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_140','PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_169','PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_176','PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_070','PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_178','PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_181','PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_088','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_154','PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_096'];
const current = adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').slice(0, 20).map((q) => q.id);
if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error('El orden del lote cambió.');

const patchQuestion = (id, values) => { const q = adult.find((row) => row.id === id); if (!q) throw new Error(id); Object.assign(q, values, { v: 'VALIDADA_ORIGINAL' }); };
const move = (id, file, subject, destinationTopic, values) => {
  const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id);
  const [q] = adult.splice(index, 1); Object.assign(q, values, { s: subject, t: [destinationTopic], v: 'VALIDADA_ORIGINAL' });
  const target = load(file); if (target.some((row) => row.id === id)) throw new Error(`Duplicado ${id}`); target.push(q);
};
const remove = (id) => { const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id); adult.splice(index, 1); };

remove('JUNIO1_204');
patchQuestion('MAYO-DOS-24_COMENTADO_043', {
  e: 'En el tratamiento modular de Dugas y Robichaud para el TAG, ¿qué afirmación es correcta?',
  o: { a: 'La psicoeducación/toma de conciencia y la prevención de recaídas son módulos fijos al inicio y al final', b: 'Los módulos básicos se centran en sueño, relaciones interpersonales y organización del tiempo', c: 'La intolerancia a la incertidumbre y las creencias sobre la preocupación son módulos adicionales', d: 'Los módulos adicionales sustituyen siempre a los módulos básicos' }, c: 'a',
  x: 'La a es correcta: el programa comienza con psicoeducación y conciencia de la preocupación y finaliza con prevención de recaídas. Los módulos básicos abordan intolerancia a la incertidumbre, utilidad de preocuparse, orientación negativa hacia los problemas y evitación cognitiva; los adicionales se seleccionan según la formulación, sin excluir los básicos.',
  r: 'Dugas, M. J. y Robichaud, M. (2007). Cognitive-Behavioral Treatment for Generalized Anxiety Disorder. Routledge; Dugas y Ladouceur (2000), Behaviour Modification, 24, 635–657.'
});
move('NOVIEMBRE-DOS-24_COMENTADO_159','tratamientos_adultos.json','Tratamientos Adultos','Introducción',{
  e: '¿Qué define la prevención indicada en salud mental?',
  o: { a: 'Intervenciones para grupos con riesgo superior a la media pero sin síntomas detectables', b: 'Intervenciones para toda la población con independencia del riesgo', c: 'Intervenciones para personas de alto riesgo con signos o síntomas mínimos detectables, sin cumplir todavía criterios diagnósticos', d: 'Prevención de recaídas exclusivamente en personas ya diagnosticadas' }, c: 'c',
  x: 'La c es correcta: la prevención indicada se dirige a personas con manifestaciones iniciales o marcadores de predisposición que aún no cumplen criterios de trastorno. La a describe prevención selectiva; la b, universal; y la d corresponde a prevención de recaídas o intervención posterior.',
  r: 'Mrazek, P. J. y Haggerty, R. J. (eds.) (1994). Reducing Risks for Mental Disorders. National Academies Press.'
});
move('NOVIEMBRE-DOS-24_COMENTADO_163','tratamientos_adultos.json','Tratamientos Adultos','Componentes y eficacia de la psicoterapia',{
  e: 'En la síntesis de Norcross y Lambert utilizada por el manual, ¿qué porcentaje de la varianza del resultado se atribuye a la alianza terapéutica?',
  o: { a: '30 %', b: '15 %', c: '7 %', d: '10 %' }, c: 'b',
  x: 'La b es correcta en el esquema didáctico del manual: paciente 30 %, alianza 15 %, método específico 10 %, efectos del terapeuta 7 %, otros factores 3 % y varianza no explicada 35 %. Son estimaciones orientativas, no una descomposición causal invariable.',
  r: 'Norcross, J. C. y Lambert, M. J. (2019). Psychotherapy Relationships That Work (3rd ed.). Oxford University Press; Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Adultos, pp. 74–75.'
});
move('OCTUBRE-UNO-24_COMENTADO_100','tratamientos_infantiles.json','Tratamientos Infantiles','Trastornos de ansiedad infantojuvenil',{
  e: 'Según la tabla SIGN del manual, ¿qué nivel de evidencia y grado de recomendación se asigna a Coping Cat para ansiedad infantil y adolescente?',
  o: { a: '2−, D', b: '1+, A', c: '1+, B', d: '2+, C' }, c: 'b',
  x: 'La b es correcta en la clasificación utilizada por el manual: Coping Cat cuenta con nivel 1+ y recomendación A. Es un programa TCC multicomponente con psicoeducación, reconocimiento de señales, reestructuración, afrontamiento y exposición gradual.',
  r: 'Kendall, P. C. y Hedtke, K. A. (2006). Cognitive-Behavioral Therapy for Anxious Children: Therapist Manual; Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos infantojuveniles.'
});
remove('OCTUBRE-UNO-24_COMENTADO_129');
patchQuestion('PERSEV_JUL25_D2_117',{
  e: '¿Para qué cuadro se desarrolló la Terapia Intensiva Focalizada en las Sensaciones (TIFS)?',
  o: { a: 'Trastorno de pánico sin posibilidad de agorafobia', b: 'Agorafobia sin ataques de pánico', c: 'Trastorno de pánico con o sin agorafobia', d: 'Trastorno de ansiedad generalizada' }, c: 'c',
  x: 'La c es correcta: la TIFS es una intervención intensiva centrada en exposición a sensaciones temidas para el trastorno de pánico, tanto con como sin agorafobia. No es un protocolo específico para TAG.',
  r: 'Salkovskis, P. M., Clark, D. M. y Hackmann, A. Intervenciones cognitivo-conductuales intensivas para pánico; Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Adultos, capítulo de ansiedad.'
});
move('PERSEV_JUL25_D2_147','tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos',{
  e: '¿Qué fobia se trabaja especialmente en la tercera fase —integración de la personalidad y rehabilitación— del tratamiento orientado por fases?',
  o: { a: 'Fobia a la experiencia interna', b: 'Fobia al apego o a su pérdida', c: 'Fobia a la vida cotidiana', d: 'Fobia a las partes disociativas' }, c: 'c',
  x: 'La c es correcta: en la fase 3 se afronta la vida cotidiana y se consolidan integración y rehabilitación. Las fobias a experiencia interna, apego y partes disociativas se trabajan prioritariamente durante estabilización.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
move('PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_144','tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos',{
  e: 'En el tratamiento orientado por fases, ¿cuándo se aborda la fobia a los recuerdos traumáticos, considerada especialmente difícil?',
  o: { a: 'Fase 1, estabilización', b: 'Fase 1, mediante exposición masiva', c: 'Fase 3, rehabilitación', d: 'Fase 2, integración gradual de recuerdos traumáticos' }, c: 'd',
  x: 'La d es correcta: la fase 2 aborda de forma dosificada los recuerdos traumáticos una vez lograda suficiente estabilización. La fase 1 trabaja seguridad y habilidades; la fase 3, integración y vida cotidiana.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
move('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_171','tratamientos_adultos.json','Tratamientos Adultos','Componentes y eficacia de la psicoterapia',{
  e: 'Según el metaanálisis de Elliott y colaboradores, ¿qué proporción aproximada de la varianza del resultado se relaciona con la empatía del terapeuta?',
  o: { a: '30 %', b: '15 %', c: '9 %', d: '7 %' }, c: 'c',
  x: 'La c es correcta: la asociación entre empatía y resultado equivale aproximadamente a un 9 % de varianza explicada. No debe confundirse con los porcentajes del esquema global de Norcross y Lambert sobre paciente, alianza, método y terapeuta.',
  r: 'Elliott, R., Bohart, A. C., Watson, J. C. y Murphy, D. (2018). Therapist empathy and client outcome: An updated meta-analysis. Psychotherapy, 55, 399–410.'
});
move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_167','tratamientos_adultos.json','Tratamientos Adultos','Componentes y eficacia de la psicoterapia',{
  e: 'En el esquema de Norcross y Lambert utilizado por el manual, ¿qué afirmación es correcta?',
  o: { a: 'La alianza explica el 7 %', b: 'El método específico explica el 15 %', c: 'Las variables del paciente explican el 30 %', d: 'Los efectos del terapeuta explican el 3 %' }, c: 'c',
  x: 'La c es correcta: el esquema atribuye 30 % a variables del paciente, 15 % a alianza, 10 % al método, 7 % al terapeuta y 3 % a otros factores, con 35 % no explicado. Son cifras didácticas y orientativas.',
  r: 'Norcross, J. C. y Lambert, M. J. (2019). Psychotherapy Relationships That Work (3rd ed.); Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Adultos, pp. 74–75.'
});
move('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_140','tratamientos_adultos.json','Tratamientos Adultos','Componentes y eficacia de la psicoterapia',{
  e: 'En el esquema de Norcross y Lambert utilizado por el manual, ¿qué porcentaje se atribuye al método específico de tratamiento?',
  o: { a: '7 %', b: '10 %', c: '15 %', d: '30 %' }, c: 'b',
  x: 'La b es correcta: el método específico se sitúa en el 10 %, frente al 30 % del paciente, 15 % de la alianza y 7 % de los efectos del terapeuta. Estas estimaciones no deben interpretarse como componentes independientes y universales.',
  r: 'Norcross, J. C. y Lambert, M. J. (2019). Psychotherapy Relationships That Work (3rd ed.); Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Adultos, pp. 74–75.'
});
move('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_169','clinica_adultos.json','Clínica Adultos','Disforia de género',{
  e: '¿Qué principio debe guiar la intervención psicológica con personas con disforia o incongruencia de género?',
  o: { a: 'Considerar que el sufrimiento procede exclusivamente de la identidad', b: 'Evitar explorar los efectos de discriminación y acoso', c: 'Desaconsejar siempre los grupos de apoyo', d: 'Adoptar un enfoque afirmativo, individualizado y respetuoso con la identidad y los objetivos de la persona' }, c: 'd',
  x: 'La d es correcta: la atención debe ser afirmativa, no estigmatizante e individualizada, atendiendo también a discriminación, apoyo social, salud mental y decisiones informadas. No presupone un itinerario único.',
  r: 'Coleman, E. et al. (2022). Standards of Care for the Health of Transgender and Gender Diverse People, Version 8. International Journal of Transgender Health, 23(sup1), S1–S259.'
});
patchQuestion('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_176',{
  e: '¿En qué tratamiento se utiliza la prueba de hiperventilación para inducir y reinterpretar sensaciones corporales temidas?',
  o: { a: 'Trastorno de síntomas somáticos', b: 'Trastorno de pánico', c: 'Trastorno de ansiedad por enfermedad', d: 'Fobia a sangre-inyección-daño' }, c: 'b',
  x: 'La b es correcta: la hiperventilación puede emplearse como ejercicio de exposición interoceptiva y experimento conductual en pánico, mostrando que las sensaciones pueden provocarse y tolerarse sin la catástrofe temida.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic. Oxford University Press; NICE CG113.'
});
move('PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_070','tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos',{
  e: 'Señale la afirmación INCORRECTA sobre el tratamiento orientado por fases de los trastornos disociativos:',
  o: { a: 'En la fase 3 puede abordarse la fobia a la vida cotidiana', b: 'En la fase 1 se procesan mediante transferencia las experiencias relacionales pasadas no resueltas', c: 'En la fase 2 puede abordarse la fobia a recuerdos traumáticos', d: 'En la fase 1 se contienen recuerdos traumáticos hasta disponer de suficiente estabilización' }, c: 'b',
  x: 'La b es incorrecta: el trabajo intensivo con experiencias traumáticas y relacionales no resueltas corresponde a la fase 2. La fase 1 prioriza seguridad, contención y habilidades; la fase 3, integración y rehabilitación.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
move('PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_178','psicoterapias.json','Psicoterapias','Técnicas psicológicas generales',{
  e: 'En psicodrama, ¿en qué consiste la técnica de la escultura?',
  o: { a: 'Crear un final alternativo para una escena pasada', b: 'Observar a un auxiliar que imita al protagonista', c: 'Representar una escena como una foto fija mediante posiciones, distancias y gestos de miembros del grupo', d: 'Conversar con una silla que representa a una persona o emoción' }, c: 'c',
  x: 'La c es correcta: la escultura representa espacial y corporalmente las relaciones de un sistema. La a describe realidad suplementaria o juego de roles; la b, espejo; y la d, silla vacía.',
  r: 'Moreno, J. L. (1946/1969). Psychodrama; Blatner, A. (1996). Acting-In; Morejón, A. R. (2019). Manual de psicoterapias, pp. 231–232.'
});
remove('PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_181');
move('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_088','clinica_adultos.json','Clínica Adultos','Conducta suicida y autolesión',{
  e: '¿Cómo se denomina el posible aumento de suicidios por imitación tras una cobertura mediática inadecuada?',
  o: { a: 'Efecto Werther', b: 'Efecto Papageno', c: 'Efecto Simon', d: 'Efecto eclipsador' }, c: 'a',
  x: 'La a es correcta: el efecto Werther describe el contagio o imitación asociado a determinadas representaciones mediáticas. El efecto Papageno alude al potencial protector de informar responsablemente sobre alternativas y afrontamiento.',
  r: 'World Health Organization (2023). Preventing suicide: a resource for media professionals, update 2023.'
});
move('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_154','tratamientos_adultos.json','Tratamientos Adultos','Componentes y eficacia de la psicoterapia',{
  e: 'En el esquema de Norcross y Lambert utilizado por el manual, ¿qué variables se incluyen en el porcentaje atribuido al paciente?',
  o: { a: 'Motivación y remisión espontánea', b: 'Remisión espontánea y placebo', c: 'Gravedad del trastorno y motivación para el cambio', d: 'Motivación y placebo' }, c: 'c',
  x: 'La c es correcta: dentro de las variables del paciente se destacan gravedad y motivación para cambiar. Placebo, cambios extraterapéuticos y error se incluyen en la fracción no explicada del esquema.',
  r: 'Norcross, J. C. y Lambert, M. J. (2019). Psychotherapy Relationships That Work (3rd ed.); Fonseca-Pedrero (coord.), Manual de tratamientos psicológicos: Adultos.'
});
move('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_096','tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos',{
  e: '¿Qué tres fobias se trabajan prioritariamente durante la primera fase del tratamiento orientado por fases?',
  o: { a: 'Vida cotidiana, recuerdos traumáticos y partes disociativas', b: 'Apego, vida cotidiana y recuerdos traumáticos', c: 'Vida cotidiana, experiencia interna y partes disociativas', d: 'Experiencia interna, apego o pérdida del apego y partes disociativas' }, c: 'd',
  x: 'La d es correcta: la estabilización inicial aborda fobia a experiencias internas, apego/pérdida y partes disociativas. La fobia a recuerdos se trabaja en fase 2 y la vida cotidiana en fase 3.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json'); const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: 20, removedSemanticDuplicates: 3, remainingInTopic: adult.filter((q) => q.t?.includes(topic)).length }));
