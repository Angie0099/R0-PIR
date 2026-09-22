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
const expected = ['PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_124','SEPTIEMBRE-UNO-24_COMENTADO_004','SEPTIEMBRE-UNO-24_COMENTADO_020','SIM_13_017','SIM_ABR2_023','SIM_ABR2_032','SIM_ABR2_061','SIM_ABR2_062','SIM_ABR2_075','SIM_ABR2_080','SIM_ABR2_110','SIM_ABR2_111','SIM_ABR2_122','SIM_ABR2_132','SIM_ABR25_053','SIM_ABR25_117','SIM_ABR25_148','SIM_PERS_AGO25_007','SIM_PERS_AGO25_043','SIM_PERS_AGO25_067'];
const current = adult.filter((q) => q.t?.includes(topic) && q.v !== 'VALIDADA_ORIGINAL').slice(0, 20).map((q) => q.id);
if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error('El orden del lote cambió.');

const patchQuestion = (id, values) => { const q = adult.find((row) => row.id === id); if (!q) throw new Error(id); Object.assign(q, values, { v: 'VALIDADA_ORIGINAL' }); };
const move = (id, file, subject, destinationTopic, values) => {
  const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id);
  const [q] = adult.splice(index, 1); Object.assign(q, values, { s: subject, t: [destinationTopic], v: 'VALIDADA_ORIGINAL' });
  const target = load(file); if (target !== adult && target.some((row) => row.id === id)) throw new Error(`Duplicado ${id}`); target.push(q);
};
const remove = (id) => { const index = adult.findIndex((q) => q.id === id); if (index < 0) throw new Error(id); adult.splice(index, 1); };

move('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_124','clinica_adultos.json','Clínica Adultos','Conducta suicida y autolesión',{
  e: '¿A qué hace referencia el efecto Papageno en relación con la conducta suicida?',
  o: { a: 'Al aumento de conductas suicidas tras una cobertura mediática sensacionalista', b: 'A una mayor vulnerabilidad exclusiva de mujeres jóvenes ante el suicidio de celebridades', c: 'Al posible efecto protector de una información responsable que presenta alternativas y formas de afrontamiento', d: 'A que presenciar directamente un suicidio protege frente a futuras conductas suicidas' }, c: 'c',
  x: 'La c es correcta: el efecto Papageno describe el potencial preventivo de relatos mediáticos responsables que muestran superación de crisis, ayuda disponible y alternativas al suicidio. El aumento por imitación asociado a coberturas inadecuadas se denomina efecto Werther.',
  r: 'Niederkrotenthaler, T. et al. (2010). Role of media reports in completed and prevented suicide: Werther v. Papageno effects. British Journal of Psychiatry, 197, 234–243; WHO (2023), Preventing suicide: a resource for media professionals.'
});
patchQuestion('SEPTIEMBRE-UNO-24_COMENTADO_004',{
  e: 'En la técnica de tensión aplicada para la fobia a sangre-inyección-daño, ¿qué pauta es correcta?',
  o: { a: 'Mantener cada contracción durante 10–15 minutos', b: 'Tras tensar los grandes grupos musculares, soltar y descansar unos 20–30 segundos', c: 'Realizar un único ciclo de tensión y distensión', d: 'Practicar diez veces al día durante tres meses como pauta fija' }, c: 'b',
  x: 'La b es correcta: se alternan contracciones breves de grandes grupos musculares con periodos de distensión. La finalidad es elevar transitoriamente la presión arterial y prevenir el descenso vasovagal; no se prescriben contracciones de minutos ni una pauta universal rígida.',
  r: 'Öst, L. G. y Sterner, U. (1987). Applied tension: A specific behavioral method for treatment of blood phobia. Behaviour Research and Therapy, 25, 25–29.'
});
move('SEPTIEMBRE-UNO-24_COMENTADO_020','tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos',{
  e: 'En el tratamiento orientado por fases de los trastornos disociativos, ¿qué fobia se aborda especialmente en la segunda fase?',
  o: { a: 'Fobia a la experiencia interna', b: 'Fobia a la pérdida del apego', c: 'Fobia a las partes disociativas', d: 'Fobia a los recuerdos traumáticos' }, c: 'd',
  x: 'La d es correcta: una vez conseguida suficiente estabilización, la fase 2 se orienta al procesamiento e integración gradual de los recuerdos traumáticos. La experiencia interna, el apego y las partes disociativas se trabajan prioritariamente en la fase 1.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
patchQuestion('SIM_13_017',{
  e: 'En la Terapia de Control del Pánico de Barlow, ¿qué técnica rompe la asociación entre las sensaciones corporales y la interpretación de peligro?',
  o: { a: 'Relajación muscular como respuesta incompatible', b: 'Exposición interoceptiva repetida', c: 'Reestructuración de esquemas tempranos', d: 'Entrenamiento en habilidades sociales' }, c: 'b',
  x: 'La b es correcta: la exposición interoceptiva provoca deliberadamente sensaciones temidas —como mareo, taquicardia o falta de aire— para aprender que son tolerables y no anuncian la catástrofe anticipada.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic (4th ed.). Oxford University Press; NICE CG113.'
});
remove('SIM_ABR2_023');
remove('SIM_ABR2_032');
move('SIM_ABR2_061','psicoterapias.json','Psicoterapias','Técnicas psicológicas generales',{
  e: '¿Cuál es el procedimiento característico de la técnica clásica de parada del pensamiento?',
  o: { a: 'Interrumpir una cadena de pensamientos mediante una señal y redirigir después la atención', b: 'Exponerse sin prevención de respuesta a toda intrusión', c: 'Evocar recuerdos autobiográficos para mejorar la memoria', d: 'Mantener la atención pasiva sobre el pensamiento hasta que desaparezca' }, c: 'a',
  x: 'La a describe el procedimiento clásico. Sin embargo, suprimir pensamientos puede producir rebote y no constituye por sí sola un tratamiento de elección para TOC o rumiación; en esos cuadros se prefieren intervenciones con respaldo específico.',
  r: 'Wegner, D. M. et al. (1987). Paradoxical effects of thought suppression. Journal of Personality and Social Psychology, 53, 5–13; APA, Dictionary of Psychology, thought stopping.'
});
move('SIM_ABR2_062','psicoterapias.json','Psicoterapias','Técnicas psicológicas generales',{
  e: '¿En qué se basa el entrenamiento en relajación muscular progresiva de Jacobson?',
  o: { a: 'En alternar sistemáticamente tensión y relajación para discriminar ambos estados', b: 'En practicar exclusivamente respiración lenta', c: 'En observar pasivamente los pensamientos', d: 'En inducir hipnosis profunda' }, c: 'a',
  x: 'La a es correcta: el procedimiento entrena la discriminación de las sensaciones de tensión y distensión mediante grupos musculares, facilitando después la relajación voluntaria.',
  r: 'Jacobson, E. (1938). Progressive Relaxation. University of Chicago Press.'
});
patchQuestion('SIM_ABR2_075',{
  e: '¿Qué caracteriza a la exposición por inundación?',
  o: { a: 'La exposición prolongada y de alta intensidad al estímulo temido, sin escape ni evitación', b: 'La relajación rápida antes de una exposición mínima', c: 'La distracción sistemática durante el contacto con el miedo', d: 'Las exposiciones muy breves interrumpidas al aumentar la ansiedad' }, c: 'a',
  x: 'La a es correcta: la inundación comienza con estímulos intensos y mantiene el contacto sin conductas de escape. En la práctica contemporánea la exposición se diseña de forma colaborativa y busca aprendizaje inhibitorio, no solo habituación.',
  r: 'Craske, M. G. et al. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10–23.'
});
patchQuestion('SIM_ABR2_080',{
  e: '¿Qué dos elementos combina la desensibilización sistemática clásica de Wolpe?',
  o: { a: 'Relajación y exposición gradual siguiendo una jerarquía de miedo', b: 'Inundación y castigo', c: 'Prevención de respuesta y economía de fichas', d: 'Refuerzo diferencial y modelado encubierto' }, c: 'a',
  x: 'La a es correcta: la desensibilización sistemática empareja una respuesta incompatible, tradicionalmente relajación, con la presentación gradual de estímulos ordenados en una jerarquía.',
  r: 'Wolpe, J. (1958). Psychotherapy by Reciprocal Inhibition. Stanford University Press.'
});
remove('SIM_ABR2_110');
move('SIM_ABR2_111','psicoterapias.json','Psicoterapias','Técnicas psicológicas generales',{
  e: '¿En qué principio se basa el manejo de contingencias?',
  o: { a: 'En modificar sistemáticamente las consecuencias que siguen a una conducta', b: 'En reducir la activación mediante relajación', c: 'En exponerse a estímulos temidos', d: 'En sustituir pensamientos mediante autoinstrucciones' }, c: 'a',
  x: 'La a es correcta: se organizan refuerzos y otras consecuencias para aumentar conductas objetivo y reducir conductas problemáticas. Es una técnica operante general, no un componente exclusivo de los tratamientos de ansiedad.',
  r: 'Cooper, J. O., Heron, T. E. y Heward, W. L. (2020). Applied Behavior Analysis (3rd ed.). Pearson.'
});
patchQuestion('SIM_ABR2_122',{
  e: '¿Cuál es el mecanismo terapéutico mejor respaldado actualmente para explicar la exposición graduada?',
  o: { a: 'Aprendizaje inhibitorio: adquirir asociaciones de seguridad que compiten con las de amenaza', b: 'Castigo de la respuesta de miedo', c: 'Olvido completo de la asociación previa', d: 'Refuerzo de las conductas de evitación' }, c: 'a',
  x: 'La a es correcta: aunque la habituación puede ocurrir, la explicación contemporánea enfatiza el aprendizaje inhibitorio y la violación de expectativas. La asociación de amenaza original no tiene que borrarse para que disminuya el miedo.',
  r: 'Craske, M. G. et al. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10–23.'
});
remove('SIM_ABR2_132');
remove('SIM_ABR25_053');
remove('SIM_ABR25_117');
remove('SIM_ABR25_148');
remove('SIM_PERS_AGO25_007');
patchQuestion('SIM_PERS_AGO25_043',{
  e: 'En el tratamiento del trastorno de ansiedad generalizada, ¿qué pretende la técnica de preocupación programada?',
  o: { a: 'Eliminar de inmediato cualquier pensamiento de futuro', b: 'Provocar sensaciones corporales temidas', c: 'Posponer la preocupación y concentrarla en un periodo y lugar establecidos', d: 'Incrementar deliberadamente la incertidumbre durante todo el día' }, c: 'c',
  x: 'La c es correcta: se registra y pospone la preocupación hasta un periodo delimitado, reduciendo su asociación con múltiples contextos cotidianos. No busca suprimir pensamientos ni es exposición interoceptiva.',
  r: 'Borkovec, T. D., Wilkinson, L., Folensbee, R. y Lerman, C. (1983). Stimulus control applications to the treatment of worry. Behaviour Research and Therapy, 21, 247–251.'
});
patchQuestion('SIM_PERS_AGO25_067',{
  e: '¿Para qué trastorno se desarrolló la Terapia Cognitivo-Conductual Grupal de Heimberg?',
  o: { a: 'Trastorno de ansiedad generalizada', b: 'Trastorno de pánico', c: 'Trastorno de ansiedad social', d: 'Fobia específica a animales' }, c: 'c',
  x: 'La c es correcta: el protocolo grupal de Heimberg para ansiedad social combina reestructuración cognitiva y exposición mediante ejercicios y representaciones de situaciones sociales.',
  r: 'Heimberg, R. G. y Becker, R. E. (2002). Cognitive-Behavioral Group Therapy for Social Phobia. Guilford Press; NICE CG159.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json'); const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: 20, removedSemanticDuplicates: 8, remainingInTopic: adult.filter((q) => q.t?.includes(topic)).length }));
