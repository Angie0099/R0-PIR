import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => { if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))); return files.get(name); };
const adult = load('tratamientos_adultos.json');
const topic = 'Tratamiento de los trastornos de ansiedad';
const expected = ['SIM_PERS_AGO25_091','SIM_PERS_AGO25_103','SIM_PERS_AGO25_120','Simu 11 comentado_157','Simu 11 comentado_169','Simu 12 comentado_081','Simu 12 comentado_178','Simu 13 comentado_047','Simu 13 comentado_048','Simu 13 comentado_146','Simu 14 comentado _004','Simu 14 comentado _076','Simu 14 comentado _083','Simu 14 comentado _087','Simu 14 comentado _089','Simu 15 comentado_168','Simu 15 comentado_169','Simu 15 comentado_171','Simu 16 comentado_137','Simu 16 comentado_164'];
const current = adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').slice(0, 20).map((q) => q.id);
if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error('El orden del lote cambió.');
const patchQuestion = (id, values) => { const q = adult.find((row) => row.id === id); if (!q) throw new Error(id); Object.assign(q, values, { v: 'VALIDADA_ORIGINAL' }); };
const moveUnchanged = (id, file, subject, destinationTopic) => {
  const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id);
  const [q] = adult.splice(index, 1); q.s = subject; q.t = [destinationTopic];
  const target = load(file); if (target.some((row) => row.id === id)) throw new Error(`Duplicado ${id}`); target.push(q);
};

patchQuestion('SIM_PERS_AGO25_091', {
  e: '¿Qué mecanismo propuso originalmente Wolpe para explicar la desensibilización sistemática?',
  o: { a: 'Habituación no asociativa', b: 'Aprendizaje vicario', c: 'Contracondicionamiento mediante inhibición recíproca', d: 'Reestructuración cognitiva' }, c: 'c',
  x: 'La c es correcta: Wolpe planteó que una respuesta incompatible con la ansiedad, clásicamente la relajación, inhibe esta respuesta al presentarse gradualmente los estímulos temidos. Esta fue la explicación original, aunque hoy la exposición también se interpreta desde el aprendizaje inhibitorio.',
  r: 'Wolpe, J. (1958). Psychotherapy by Reciprocal Inhibition. Stanford University Press; Craske, M. G. et al. (2014). Behaviour Research and Therapy, 58, 10–23.'
});
patchQuestion('SIM_PERS_AGO25_103', {
  e: '¿Qué técnica desarrolló Öst para prevenir el síncope vasovagal durante la exposición en la fobia a sangre-inyección-daño?',
  o: { a: 'Relajación muscular progresiva', b: 'Terapia de aceptación y compromiso', c: 'Tensión aplicada', d: 'Respiración diafragmática' }, c: 'c',
  x: 'La c es correcta: la tensión aplicada contrae grandes grupos musculares para elevar transitoriamente la presión arterial y contrarrestar la caída vasovagal que puede producir mareo o desmayo.',
  r: 'Öst, L. G. y Sterner, U. (1987). Applied tension: A specific behavioral method for treatment of blood phobia. Behaviour Research and Therapy, 25, 25–29.'
});
patchQuestion('SIM_PERS_AGO25_120', {
  e: 'Según el modelo cognitivo de Clark, ¿qué proceso inicia y mantiene la espiral del pánico?',
  o: { a: 'La hiperventilación crónica como causa necesaria', b: 'La interpretación catastrófica de sensaciones corporales benignas', c: 'Una alteración irreversible de receptores GABA', d: 'La reexperimentación disociativa de un trauma infantil' }, c: 'b',
  x: 'La b es correcta: una sensación se interpreta como señal de catástrofe —por ejemplo, palpitaciones como infarto—, aumenta la ansiedad y genera nuevas sensaciones que refuerzan la interpretación, formando un círculo vicioso.',
  r: 'Clark, D. M. (1986). A cognitive approach to panic. Behaviour Research and Therapy, 24, 461–470.'
});
patchQuestion('Simu 11 comentado_157', {
  e: 'Según las guías actuales, ¿qué afirmación es correcta sobre las benzodiacepinas en el trastorno de pánico con o sin agorafobia?',
  o: { a: 'No se recomiendan como tratamiento a largo plazo porque se asocian a peores resultados y riesgos de dependencia', b: 'El alprazolam es el tratamiento psicológico de primera elección', c: 'Deben combinarse siempre con exposición', d: 'El diazepam previene de forma estable las recaídas tras retirarlo' }, c: 'a',
  x: 'La a es correcta: aunque reducen ansiedad de forma aguda, las benzodiacepinas no se recomiendan para el tratamiento prolongado del pánico por dependencia, retirada y peores resultados a largo plazo. La TCC y determinados antidepresivos cuentan con mejor respaldo.',
  r: 'NICE. Panic disorder and generalised anxiety disorder in adults: management (CG113), recomendaciones 1.3.20–1.3.21.'
});
moveUnchanged('Simu 11 comentado_169', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de ansiedad infantojuvenil');
patchQuestion('Simu 12 comentado_081', {
  e: '¿En qué situación puede preferirse la exposición en imaginación frente a la exposición en vivo para una fobia específica?',
  o: { a: 'Cuando el estímulo es interno o resulta impracticable, inseguro o difícil de reproducir en vivo', b: 'Cuando la situación es fácilmente manipulable por el terapeuta', c: 'Siempre que la situación sea pública', d: 'Cuando se dispone de poco tiempo, aunque el estímulo sea accesible' }, c: 'a',
  x: 'La a es correcta: la exposición en vivo suele preferirse, pero la imaginación es útil ante acontecimientos internos, situaciones no reproducibles o exposiciones que serían peligrosas o inviables. La mera incomodidad pública o la falta de tiempo no bastan para sustituirla.',
  r: 'Wolitzky-Taylor, K. B. et al. (2008). Psychological approaches in the treatment of specific phobias: A meta-analysis. Clinical Psychology Review, 28, 1021–1037.'
});
patchQuestion('Simu 12 comentado_178', {
  e: '¿Cuál de estos protocolos cognitivo-conductuales para la ansiedad social se diseñó para aplicación individual?',
  o: { a: 'TCC grupal de Heimberg', b: 'TCC comprensiva grupal de Davidson', c: 'TCC grupal de McEvoy', d: 'Terapia cognitiva de Clark y Wells' }, c: 'd',
  x: 'La d es correcta: el protocolo de Clark y Wells es una terapia cognitiva individual. Los otros programas citados fueron desarrollados en formato grupal.',
  r: 'Clark, D. M. et al. (2003). Cognitive therapy versus fluoxetine in generalized social phobia. Journal of Consulting and Clinical Psychology, 71, 1058–1067; NICE CG159.'
});
patchQuestion('Simu 13 comentado_047', {
  e: '¿Cuál de estas intervenciones NO es un ejercicio para provocar sensaciones durante la exposición interoceptiva?',
  o: { a: 'Ejercicio cardiovascular', b: 'Hiperventilación voluntaria', c: 'Reentrenamiento respiratorio', d: 'Inhalación controlada de dióxido de carbono' }, c: 'c',
  x: 'La c es correcta: el reentrenamiento respiratorio busca regular la respiración, no inducir sensaciones temidas. El ejercicio, la hiperventilación y procedimientos controlados con CO₂ pueden provocar sensaciones corporales con fines de exposición o evaluación experimental.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic (4th ed.). Oxford University Press.'
});
patchQuestion('Simu 13 comentado_048', {
  e: '¿En qué grupo de problemas se ha estudiado principalmente la terapia Morita?',
  o: { a: 'Trastornos del estado de ánimo exclusivamente', b: 'Trastornos de ansiedad y cuadros neuróticos relacionados', c: 'Trastorno de estrés postraumático exclusivamente', d: 'Conducta suicida aguda' }, c: 'b',
  x: 'La b es correcta: la terapia Morita surgió para problemas neuróticos y de ansiedad y posteriormente se ha adaptado a otros cuadros. La evidencia disponible es heterogénea y no la convierte en tratamiento de primera elección frente a la TCC.',
  r: 'Hu, X. et al. (2015). Morita therapy for anxiety disorders in adults. Cochrane Database of Systematic Reviews, CD008619.'
});
patchQuestion('Simu 13 comentado_146', {
  e: '¿Cómo debe considerarse la hipnosis añadida a la TCC para el trastorno de ansiedad generalizada?',
  o: { a: 'Tratamiento bien establecido', b: 'Tratamiento de primera elección', c: 'Intervención experimental con evidencia insuficiente', d: 'Intervención demostrada como ineficaz' }, c: 'c',
  x: 'La c es la opción más adecuada: existen estudios preliminares sobre hipnosis como complemento, pero no evidencia suficiente para considerarla tratamiento bien establecido o de primera elección. Insuficiencia de evidencia no equivale a demostrar ineficacia.',
  r: 'NICE CG113; Coelho, H. F. et al. (2007). The effectiveness of hypnosis for the treatment of anxiety: a systematic review. Primary Care and Community Psychiatry, 12, 49–63.'
});
patchQuestion('Simu 14 comentado _004', {
  e: 'Según NICE, ¿qué intervención psicológica debe ofrecerse inicialmente a un adulto con ansiedad social?',
  o: { a: 'TCC individual específica para ansiedad social', b: 'Autoayuda sin apoyo como primera opción universal', c: 'Terapia psicodinámica de larga duración', d: 'Terapia interpersonal' }, c: 'a',
  x: 'La a es correcta: NICE recomienda ofrecer TCC individual desarrollada específicamente para la ansiedad social, como los modelos de Clark y Wells o Heimberg. La autoayuda TCC apoyada es una alternativa si la persona rechaza esa opción.',
  r: 'NICE. Social anxiety disorder: recognition, assessment and treatment (CG159), recomendaciones 1.3.2–1.3.4.'
});
patchQuestion('Simu 14 comentado _076', {
  e: '¿Cuál de estas variables NO es un predictor favorable del éxito de la exposición en vivo en la agorafobia?',
  o: { a: 'Alta evitación agorafóbica inicial', b: 'Buena alianza terapéutica', c: 'Expectativas positivas de mejora', d: 'Cumplimiento de las tareas entre sesiones' }, c: 'a',
  x: 'La a es correcta: una evitación inicial elevada refleja mayor gravedad y no constituye un predictor favorable. La alianza, las expectativas y el cumplimiento de prácticas facilitan la implicación y suelen asociarse con mejores resultados.',
  r: 'Gloster, A. T. et al. (2013). Mechanisms of action in CBT for panic disorder with agoraphobia. Journal of Consulting and Clinical Psychology, 81, 69–81.'
});
patchQuestion('Simu 14 comentado _083', {
  e: 'Señale la afirmación INCORRECTA sobre el mindfulness desapegado en la terapia metacognitiva:',
  o: { a: 'Puede introducirse en fases tempranas', b: 'Puede facilitar cambios en la relación metacognitiva con los pensamientos', c: 'Debe mantenerse como pilar indispensable durante toda la terapia', d: 'Su uso excesivo como estrategia de control puede impedir comprobar que no se pierde el control mental' }, c: 'c',
  x: 'La c es incorrecta: el mindfulness desapegado es una técnica para experimentar pensamientos sin engancharse a ellos, pero no debe convertirse en ritual de control ni es por sí solo el elemento determinante del tratamiento. Se usa de forma estratégica dentro del modelo metacognitivo.',
  r: 'Wells, A. (2009). Metacognitive Therapy for Anxiety and Depression. Guilford Press.'
});
patchQuestion('Simu 14 comentado _087', {
  e: '¿Qué componentes caracterizan la TCC grupal de Heimberg para la ansiedad social?',
  o: { a: 'Reestructuración cognitiva, habilidades sociales obligatorias y exposición', b: 'Reestructuración, habilidades sociales obligatorias y tareas', c: 'Reestructuración, tareas y videofeedback como componente original central', d: 'Reestructuración cognitiva, exposición en sesión y tareas para casa' }, c: 'd',
  x: 'La d es correcta: el protocolo combina reestructuración cognitiva, exposiciones mediante representaciones en el grupo y prácticas entre sesiones. El entrenamiento formal en habilidades sociales no es un componente obligatorio del programa.',
  r: 'Heimberg, R. G. y Becker, R. E. (2002). Cognitive-Behavioral Group Therapy for Social Phobia. Guilford Press.'
});
patchQuestion('Simu 14 comentado _089', {
  e: 'En la TCC del trastorno de ansiedad generalizada, ¿qué caracteriza a la preocupación patológica o improductiva?',
  o: { a: 'Intrusiones breves e involuntarias sin encadenamiento verbal', b: 'Resolución concreta de problemas inmediatos y realistas', c: 'Pensamientos autorreferenciales centrados principalmente en pérdidas pasadas', d: 'Una cadena verbal sobre problemas distantes o abstractos, centrada en la emoción negativa y sin resolución eficaz' }, c: 'd',
  x: 'La d es correcta: la preocupación patológica suele ser verbal, repetitiva y abstracta, orientada a amenazas futuras y poco eficaz para resolver problemas. La opción c describe mejor la rumiación depresiva.',
  r: 'Borkovec, T. D., Ray, W. J. y Stöber, J. (1998). Worry: A cognitive phenomenon intimately linked to affective, physiological, and interpersonal behavioral processes. Cognitive Therapy and Research, 22, 561–576.'
});
patchQuestion('Simu 15 comentado_168', {
  e: '¿Qué proceso explica que la exposición reduzca el miedo al comprobarse que no ocurren las consecuencias temidas?',
  o: { a: 'Sensibilización', b: 'Extinción mediante aprendizaje inhibitorio', c: 'Generalización del miedo', d: 'Insight psicodinámico' }, c: 'b',
  x: 'La b es correcta: al exponerse sin que ocurra la catástrofe esperada se produce violación de expectativas y se aprende una asociación inhibitoria de seguridad. La asociación de miedo previa no necesita borrarse por completo.',
  r: 'Craske, M. G. et al. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10–23.'
});
patchQuestion('Simu 15 comentado_169', {
  e: '¿Qué recurso incorpora la TCC grupal de McEvoy para la ansiedad social?',
  o: { a: 'Entrenamiento obligatorio en habilidades sociales', b: 'Relajación como componente principal', c: 'Retroalimentación mediante vídeo', d: 'Biofeedback fisiológico' }, c: 'c',
  x: 'La c es correcta: el programa utiliza videofeedback para contrastar la imagen negativa que la persona anticipa de su actuación con su ejecución observable. No se basa principalmente en relajación o biofeedback.',
  r: 'McEvoy, P. M. (2007). Effectiveness of cognitive behavioural group therapy for social phobia in a community clinic. Behaviour Research and Therapy, 45, 3030–3040.'
});
patchQuestion('Simu 15 comentado_171', {
  e: '¿Qué conjunto recoge componentes habituales de la TCC para el trastorno de ansiedad generalizada?',
  o: { a: 'Relajación, intervención conductual sin trabajo cognitivo, exposición y prevención de recaídas', b: 'Respiración, terapia cognitiva, exposición y prevención de respuesta compulsiva', c: 'Relajación o regulación fisiológica, terapia cognitiva, exposición a preocupaciones y prevención de recaídas', d: 'Relajación, ACT obligatoria, exposición y tareas sin formulación individual' }, c: 'c',
  x: 'La c es correcta: los protocolos TCC para TAG suelen combinar psicoeducación, regulación fisiológica, intervención cognitiva, exposición a preocupaciones o incertidumbre y prevención de recaídas. La prevención de respuesta es característica del TOC.',
  r: 'NICE CG113; Dugas, M. J. y Robichaud, M. (2007). Cognitive-Behavioral Treatment for Generalized Anxiety Disorder. Routledge.'
});
moveUnchanged('Simu 16 comentado_137', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de ansiedad infantojuvenil');
patchQuestion('Simu 16 comentado_164', {
  e: '¿Cuál de estas afirmaciones sobre la exposición en vivo para la agorafobia es FALSA?',
  o: { a: 'Un contacto terapéutico excesivamente reducido puede empeorar los resultados', b: 'Los programas de autoayuda sin apoyo son muy efectivos de forma general', c: 'Distintos formatos de exposición guiada y práctica programada pueden producir resultados comparables', d: 'Una agorafobia más grave puede asociarse con mayor riesgo de fracaso o abandono' }, c: 'b',
  x: 'La b es falsa: la autoayuda pura presenta resultados más modestos y problemas de adherencia; el apoyo profesional mejora su utilidad. La intensidad de evitación y la implicación en la práctica influyen en el resultado.',
  r: 'NICE CG113; Lewis, C. et al. (2012). Efficacy, cost-effectiveness and acceptability of self-help interventions for anxiety disorders. British Journal of Psychiatry, 200, 15–21.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json'); const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ processed: 20, corrected: 18, movedUnchanged: 2, remainingPending: adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').length }));
