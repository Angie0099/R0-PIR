import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => { if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))); return files.get(name); };
const adult = load('tratamientos_adultos.json');
const topic = 'Tratamiento de los trastornos de ansiedad';
const expected = ['Simu 31 comentado Hardcore 1_033','Simu 7 comentado _167','Simu 7 comentado _191','Simu 8 comentado _135','Simu 8 comentado _136','simu 9 comentado_160','SM_DICIEMBRE_1_SOL_1_162','SM_DICIEMBRE_2_SOL_1_183','SmCm06PIR2025_107','SmCm06PIR2025_108','SmCm10PIR2025_010','SmCm11PIR2025_121','SmCm12PIR2024 2_119','SmCm12PIR2024 2_121','SmCm12PIR2024 2_124','SmCm14PIR2025_134','SmCm15PIR2025_157','SmCm15PIR2025_158','SmCm17PIR2025_167','SmCm1PIR2024_123'];
const current = adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').slice(0, 20).map((q) => q.id);
if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error('El orden del lote cambió.');
const patchQuestion = (id, values) => { const q = adult.find((row) => row.id === id); if (!q) throw new Error(id); Object.assign(q, values, { v: 'VALIDADA_ORIGINAL' }); };
const moveUnchanged = (id, file, subject, destinationTopic) => {
  const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id);
  const [q] = adult.splice(index, 1); q.s = subject; q.t = [destinationTopic];
  const target = load(file); if (target !== adult && target.some((row) => row.id === id)) throw new Error(`Duplicado ${id}`);
  target.push(q);
};
const remove = (id) => { const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id); adult.splice(index, 1); };

patchQuestion('Simu 31 comentado Hardcore 1_033', {
  e: 'En el TAG, pedir a una paciente que deje de telefonear repetidamente a su hija y de recogerla para comprobar que está bien es un ejemplo de:',
  o: { a: 'Inducción de la preocupación', b: 'Prevención de conductas de seguridad asociadas a la preocupación', c: 'Evitación encubierta', d: 'Desfocalización del apego' }, c: 'b',
  x: 'La b es correcta: llamadas, comprobaciones y rescates reducen la ansiedad a corto plazo, pero mantienen la preocupación al impedir aprender que la incertidumbre puede tolerarse. Su prevención permite comprobar las predicciones temidas sin recurrir a esas conductas.',
  r: 'Dugas, M. J. y Robichaud, M. (2007). Cognitive-Behavioral Treatment for Generalized Anxiety Disorder. Routledge.'
});
patchQuestion('Simu 7 comentado _167', {
  e: '¿Cuál de estas opciones NO corresponde a una fase clásica de la terapia Morita?',
  o: { a: 'Reposo en cama y aislamiento inicial', b: 'Aceptación leve como fase independiente', c: 'Trabajo progresivamente más exigente', d: 'Preparación para la vida cotidiana normal' }, c: 'b',
  x: 'La b es correcta: el método clásico se organiza en reposo inicial, actividad ligera, actividad más intensa y reintegración a la vida cotidiana. La aceptación constituye un principio terapéutico, no una fase denominada “aceptación leve”.',
  r: 'Morita, S. (1998). Morita Therapy and the True Nature of Anxiety-Based Disorders. State University of New York Press; Hu, X. et al. (2015), Cochrane Database CD008619.'
});
patchQuestion('Simu 7 comentado _191', {
  e: '¿Para qué trastorno se desarrolló la terapia intensiva focalizada en las sensaciones de Baker-Morissette y colaboradores?',
  o: { a: 'Trastorno de pánico', b: 'Fobia específica', c: 'Ansiedad social', d: 'Agorafobia sin historia de pánico' }, c: 'a',
  x: 'La a es correcta: es una intervención intensiva centrada en las sensaciones corporales temidas y en la exposición interoceptiva para personas con trastorno de pánico.',
  r: 'Baker-Morissette, S. L., Spiegel, D. A. y Heinrichs, N. (2005). Sensation-focused intensive treatment for panic disorder with moderate to severe agoraphobia. Cognitive and Behavioral Practice, 12, 17–29.'
});
moveUnchanged('Simu 8 comentado _135', 'tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamientos transdiagnósticos');
patchQuestion('Simu 8 comentado _136', {
  e: '¿Qué componente distingue al programa de control del pánico de Barlow frente al protocolo cognitivo clásico de Clark?',
  o: { a: 'Psicoeducación sobre el pánico', b: 'Reinterpretación de sensaciones corporales', c: 'Experimentos conductuales', d: 'Entrenamiento respiratorio o de relajación como habilidad de afrontamiento' }, c: 'd',
  x: 'La d es correcta en la comparación clásica: el programa de Barlow incorporó entrenamiento respiratorio/relajación, mientras que Clark enfatizó la modificación de interpretaciones catastróficas mediante discusión y experimentos. Ambos pueden trabajar las sensaciones corporales.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic; Clark, D. M. (1986). Behaviour Research and Therapy, 24, 461–470.'
});
patchQuestion('simu 9 comentado_160', {
  e: '¿Qué componente forma parte de la terapia cognitiva de Clark y Beck para el TAG?',
  o: { a: 'Inoculación frente al riesgo y la incertidumbre', b: 'Inducción de preocupación sin reevaluación', c: 'Distinguir preocupación futura de preocupación post mortem', d: 'Entrenamiento respiratorio como único componente' }, c: 'a',
  x: 'La a es correcta: la intervención incluye modificar la valoración exagerada de amenaza y vulnerabilidad, aumentar tolerancia a incertidumbre y riesgo y fortalecer una perspectiva más adaptativa. Las demás opciones no describen componentes propios del protocolo.',
  r: 'Clark, D. A. y Beck, A. T. (2010). Cognitive Therapy of Anxiety Disorders. Guilford Press.'
});
patchQuestion('SM_DICIEMBRE_1_SOL_1_162', {
  e: '¿Qué requisito favorece la aplicación del tratamiento de una sola sesión de Öst para una fobia específica?',
  o: { a: 'Que la fobia esté estrechamente ligada a múltiples problemas', b: 'Motivación suficiente para tolerar una ansiedad elevada durante la sesión', c: 'Obtener beneficios importantes por mantener la fobia', d: 'Prever consecuencias negativas si la fobia se supera' }, c: 'b',
  x: 'La b es correcta: la persona debe aceptar una exposición prolongada e intensa. El formato resulta más adecuado para fobias circunscritas cuando no existen ganancias por mantenerlas ni consecuencias negativas previsibles de superarlas.',
  r: 'Öst, L. G. (1989). One-session treatment for specific phobias. Behaviour Research and Therapy, 27, 1–7.'
});
moveUnchanged('SM_DICIEMBRE_2_SOL_1_183', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de ansiedad infantojuvenil');
moveUnchanged('SmCm06PIR2025_107', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Otros problemas infantojuveniles');
moveUnchanged('SmCm06PIR2025_108', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Otros problemas infantojuveniles');
moveUnchanged('SmCm10PIR2025_010', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Otros problemas infantojuveniles');
moveUnchanged('SmCm11PIR2025_121', 'tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Otros problemas infantojuveniles');
patchQuestion('SmCm12PIR2024 2_119', {
  e: '¿Qué componentes integran el síndrome cognitivo-atencional de la terapia metacognitiva de Wells?',
  o: { a: 'Preocupación y rumiación, atención centrada en amenazas y estrategias de afrontamiento desadaptativas', b: 'Rumiación, pensamientos automáticos y emoción como consecuencia', c: 'Preocupación, afrontamiento eficaz y creencias positivas exclusivamente', d: 'Pensamientos automáticos, relajación y solución de problemas' }, c: 'a',
  x: 'La a es correcta: el síndrome cognitivo-atencional combina pensamiento perseverativo, monitorización de amenaza y estrategias como evitación, supresión o comprobación que impiden modificar las creencias metacognitivas.',
  r: 'Wells, A. (2009). Metacognitive Therapy for Anxiety and Depression. Guilford Press.'
});
patchQuestion('SmCm12PIR2024 2_121', {
  e: '¿Cuál es un inconveniente principal del uso prolongado de benzodiacepinas en los trastornos de ansiedad?',
  o: { a: 'Ausencia general de adherencia', b: 'Efecto adrenérgico inevitable', c: 'Riesgo de tolerancia, dependencia y síntomas de retirada', d: 'Eliminación total y permanente del miedo' }, c: 'c',
  x: 'La c es correcta: el uso continuado puede producir tolerancia, dependencia física y dificultades al retirarlas, por lo que las guías limitan su empleo y no las recomiendan como tratamiento prolongado del pánico o el TAG.',
  r: 'NICE CG113, recomendaciones 1.2.26 y 1.3.20; Ashton, H. (2005). Current Opinion in Psychiatry, 18, 249–255.'
});
remove('SmCm12PIR2024 2_124');
patchQuestion('SmCm14PIR2025_134', {
  e: '¿Qué componente NO es habitual en la TCC específica para el trastorno de pánico?',
  o: { a: 'Activación conductual para incrementar actividades gratificantes', b: 'Exposición interoceptiva', c: 'Experimentos conductuales', d: 'Entrenamiento respiratorio en algunos protocolos' }, c: 'a',
  x: 'La a es correcta: la activación conductual es característica del tratamiento de la depresión. La TCC del pánico utiliza psicoeducación, reinterpretación cognitiva, experimentos y exposición interoceptiva; algunos programas incluyen habilidades respiratorias.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic; NICE CG113.'
});
patchQuestion('SmCm15PIR2025_157', {
  e: '¿Cuál es una ventaja potencial de la exposición mediante realidad virtual frente a la exposición en vivo?',
  o: { a: 'El hardware siempre tiene un coste bajo', b: 'Siempre es más barata que la exposición en imaginación', c: 'Permite una exposición controlada y privada a situaciones difíciles de recrear', d: 'Puede aplicarla cualquier persona sin supervisión clínica' }, c: 'c',
  x: 'La c es correcta: el entorno virtual permite graduar, repetir y controlar estímulos preservando mayor privacidad y evitando desplazamientos a situaciones reales. Su coste varía y requiere indicación y supervisión profesionales.',
  r: 'Carl, E. et al. (2019). Virtual reality exposure therapy for anxiety and related disorders: A meta-analysis. Journal of Anxiety Disorders, 61, 27–36.'
});
patchQuestion('SmCm15PIR2025_158', {
  e: 'En la comparación clásica con la terapia cognitiva de Clark, ¿qué enfatiza especialmente el programa de control del pánico de Barlow?',
  o: { a: 'Su aplicación exclusiva a cualquier trastorno de angustia', b: 'El debate verbal como único procedimiento', c: 'Una eficacia inferior a la terapia de Clark', d: 'La exposición repetida a sensaciones interoceptivas temidas' }, c: 'd',
  x: 'La d es correcta: el programa de Barlow sistematiza la inducción y exposición a sensaciones corporales para reducir el miedo a ellas. El protocolo de Clark enfatiza la reinterpretación de las sensaciones mediante experimentos conductuales; la distinción no implica inferioridad de uno.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic; Clark, D. M. (1986). Behaviour Research and Therapy, 24, 461–470.'
});
remove('SmCm17PIR2025_167');
patchQuestion('SmCm1PIR2024_123', {
  e: 'Según el modelo metacognitivo de Wells, ¿qué caracteriza especialmente al TAG?',
  o: { a: 'Creencias metacognitivas negativas y preocupación tipo 2 o preocupación por preocuparse', b: 'Creencias positivas y preocupación tipo 2 exclusivamente', c: 'Creencias negativas y preocupación tipo 1 únicamente sobre sucesos externos', d: 'Creencias positivas sin valoración negativa de la preocupación' }, c: 'a',
  x: 'La a es correcta: además de preocuparse por acontecimientos —tipo 1—, la persona interpreta la propia preocupación como incontrolable o peligrosa y desarrolla metapreocupación —tipo 2—, mantenida por creencias metacognitivas negativas.',
  r: 'Wells, A. (1995). Meta-cognition and worry: A cognitive model of generalized anxiety disorder. Behavioural and Cognitive Psychotherapy, 23, 301–320.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json'); const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ processed: 20, corrected: 12, movedUnchanged: 6, removedDuplicates: 2, remainingPending: adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').length }));
