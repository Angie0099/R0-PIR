const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','public','banco');
const names=['clinica_adultos','clinica_infantojuvenil','psicopatologia','psicologia_de_la_personalidad_y_diferencial'];
const data=Object.fromEntries(names.map(n=>[n,JSON.parse(fs.readFileSync(path.join(root,n+'.json'),'utf8'))]));
const BEL='Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología (4.ª ed.). McGraw Hill.';
const DSM='American Psychiatric Association (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.; DSM-5-TR). American Psychiatric Association Publishing.';
const ICD='World Health Organization (2024). Clinical Descriptions and Diagnostic Requirements for ICD-11 Mental, Behavioural and Neurodevelopmental Disorders, categoría 6C21 «Body integrity dysphoria».';
function move(id,from,to,topic,update){const i=data[from].findIndex(q=>q.id===id);if(i<0)throw Error(`Missing ${id} in ${from}`);const [q]=data[from].splice(i,1);Object.assign(q,{s:to==='clinica_adultos'?'Clínica Adultos':to==='clinica_infantojuvenil'?'Clínica Infantojuvenil':'Psicopatología',t:[topic],...update});data[to].push(q);}

move('JULIO1_105','clinica_adultos','clinica_infantojuvenil','Otros problemas infantojuveniles',{
 e:'Respecto a la presentación del trastorno de síntomas somáticos en niños y adolescentes, señale la afirmación correcta:',
 o:{a:'Es relativamente frecuente que predomine una única queja, como dolor abdominal o cefalea.',b:'Exige siempre síntomas múltiples pertenecientes al menos a cuatro sistemas corporales.',c:'Las experiencias adversas infantiles solo aumentan la expresión somática en niñas.',d:'Su frecuencia aumenta de forma lineal y demostrada hasta los 65 años.'},c:'a',
 x:'La a es correcta: en menores puede predominar una única manifestación somática, especialmente dolor recurrente, cefalea, fatiga o náuseas. La b recupera recuentos del antiguo trastorno de somatización que el DSM-5-TR eliminó. La c introduce una exclusividad por sexo no respaldada. La d formula una progresión lineal hasta una edad adulta que ni define la presentación infantil ni constituye un criterio epidemiológico.',r:`${DSM} Capítulo «Somatic Symptom and Related Disorders»; ${BEL} capítulo de problemas somáticos infantojuveniles.`,v:'VALIDADA_ORIGINAL'});

move('SmCm18PIR2025_091','psicopatologia','clinica_infantojuvenil','Trastorno por déficit de atención con hiperactividad (TDAH)',{
 e:'Respecto a la etiología y los modelos explicativos del TDAH, señale la afirmación correcta:',
 o:{a:'Su elevada heredabilidad demuestra que los factores ambientales carecen de influencia.',b:'El modelo de Douglas limita el problema a inhibir respuestas y excluye la regulación de la activación.',c:'Los modelos de autorregulación destacan dificultades para anticipar consecuencias y mantener la conducta dirigida a metas.',d:'El modelo de Barkley explica el TDAH exclusivamente mediante umbrales de refuerzo demasiado bajos.'},c:'c',
 x:'La c es correcta: los enfoques de autorregulación señalan problemas para anticipar consecuencias, demorar gratificación y gobernar la conducta hacia objetivos. La a confunde heredabilidad con determinismo y excluye indebidamente el ambiente. La b reduce el modelo de Douglas, que también considera activación, esfuerzo y recompensa. La d atribuye a Barkley una explicación motivacional exclusiva, cuando su formulación central parte de la inhibición conductual y sus efectos sobre funciones ejecutivas.',r:`${BEL} capítulo de TDAH; Barkley, R. A. (1997). Behavioral inhibition, sustained attention, and executive functions. Psychological Bulletin, 121(1), 65-94.`,v:'VALIDADA_ORIGINAL'});

move('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_133','psicopatologia','clinica_infantojuvenil','Trastorno del espectro autista',{
 e:'¿Qué combinación reúne tres funciones ejecutivas especialmente estudiadas en niños y adolescentes con trastorno del espectro autista?',
 o:{a:'Flexibilidad cognitiva, memoria de trabajo y control inhibitorio.',b:'Atención sostenida, memoria semántica y praxias constructivas.',c:'Velocidad de procesamiento, orientación temporal y reconocimiento facial.',d:'Memoria episódica, fluidez fonológica y percepción táctil.'},c:'a',
 x:'La a es correcta: flexibilidad cognitiva, memoria de trabajo y control inhibitorio constituyen la tríada ejecutiva examinada con mayor frecuencia en el TEA. La b mezcla atención, memoria semántica y praxias, que no forman esa tríada. La c combina velocidad, orientación y reconocimiento facial. La d reúne procesos mnésicos, lingüísticos y perceptivos, no las tres funciones ejecutivas solicitadas.',r:`${BEL} capítulo de trastorno del espectro autista.`,v:'VALIDADA_ORIGINAL'});

move('SmCm12PIR2024 2_066','psicopatologia','psicopatologia','Psicopatología de la memoria',{
 e:'Respecto al síndrome amnésico puro, señale la afirmación INCORRECTA:',
 o:{a:'La memoria de trabajo suele permitir mantener una conversación breve.',b:'La amnesia anterógrada constituye su alteración nuclear.',c:'Puede conservarse el aprendizaje de habilidades procedimentales.',d:'Exige en todos los casos una amnesia retrógrada extensa y uniforme.'},c:'d',
 x:'La d es incorrecta: la amnesia retrógrada puede variar en extensión y gradiente, por lo que no es obligatoriamente extensa ni uniforme. La a es correcta porque la memoria de trabajo puede estar preservada pese a olvidar después la conversación. La b recoge el déficit definitorio para adquirir nueva información declarativa. La c refleja la posible disociación entre memoria declarativa y aprendizaje procedimental.',r:`${BEL} vol. I, capítulo de psicopatología de la memoria.`,v:'VALIDADA_ORIGINAL'});

move('SmCm3PIR2024_102','psicologia_de_la_personalidad_y_diferencial','clinica_adultos','Trastornos por síntomas somáticos y relacionados',{
 e:'Según la CIE-11, ¿qué característica define la disforia por la integridad corporal?',
 o:{a:'Preocupación por un defecto estético leve o no observable.',b:'Deseo intenso y persistente de presentar una discapacidad física importante, acompañado de malestar por la configuración corporal actual.',c:'Experiencia transitoria de extrañeza respecto al cuerpo durante una crisis de pánico.',d:'Creencia obligatoriamente delirante de que una extremidad ya ha desaparecido.'},c:'b',
 x:'La b es correcta: el núcleo es el deseo persistente de adquirir una discapacidad física significativa y la incongruencia o malestar respecto al cuerpo no discapacitado. La a describe mejor el trastorno dismórfico corporal. La c se aproxima a una alteración transitoria de la experiencia corporal, no a este deseo estable. La d añade una convicción delirante y una ausencia ya consumada que no forman el criterio.',r:ICD,v:'VALIDADA_ORIGINAL'});

for(const n of names)fs.writeFileSync(path.join(root,n+'.json'),JSON.stringify(data[n]));
const all=names.flatMap(n=>data[n]);
if(new Set(all.map(q=>q.id)).size!==all.length)throw Error('Duplicate id across touched banks');
console.log('Rehomed and audited 5 misplaced questions.');
