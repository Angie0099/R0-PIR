const fs = require('fs');
const path = require('path');

const treatmentsFile = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const clinicalFile = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const candidates = treatments.filter(q => q.t?.includes(topic)).slice(120);
if (candidates.length !== 28) throw new Error(`Se esperaban 28 preguntas finales y se encontraron ${candidates.length}`);

const functional = candidates.find(q => q.id === 'SmCm3PIR2024_167');
if (!functional) throw new Error('No se encontró la pregunta de análisis funcional');
functional.t = ['Técnicas psicológicas generales'];
functional.v = 'VALIDADA_ORIGINAL';

const suicideId = 'Simu 11 comentado_162';
const suicide = candidates.find(q => q.id === suicideId);
if (!suicide) throw new Error('No se encontró la pregunta de evaluación suicida');
if (clinical.some(q => q.id === suicideId)) throw new Error(`Ya existe ${suicideId} en clínica de adultos`);
suicide.s = 'Clínica Adultos';
suicide.t = ['Conducta suicida y autolesión'];
suicide.v = 'VALIDADA_ORIGINAL';
const suicideIndex = treatments.findIndex(q => q.id === suicideId);
treatments.splice(suicideIndex, 1);
clinical.push(suicide);

const block = candidates.filter(q => !['SmCm3PIR2024_167', suicideId].includes(q.id));
if (block.length !== 26) throw new Error(`Tras la criba debían quedar 26 preguntas y quedan ${block.length}`);

function set(id, changes = {}) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`La pregunta ${id} no pertenece al bloque final`);
  Object.assign(q, changes, { v: 'VALIDADA_ORIGINAL' });
}

set('SmCm3PIR2024_170', {
  e: 'Según NICE, ¿qué opciones se ofrecen inicialmente para la manía o hipomanía cuando la persona no toma un antipsicótico ni un estabilizador?',
  o: {
    a: 'Haloperidol, olanzapina, quetiapina o risperidona, individualizando según respuesta previa, riesgos y preferencias.',
    b: 'Lamotrigina como tratamiento antimaníaco de primera elección.',
    c: 'Fluoxetina en monoterapia.',
    d: 'Gabapentina o topiramato.'
  },
  c: 'a',
  x: 'NICE recomienda ofrecer haloperidol, olanzapina, quetiapina o risperidona, teniendo en cuenta el contexto clínico, la respuesta previa, los efectos adversos y las preferencias. Lamotrigina no se utiliza para la manía aguda y no deben ofrecerse gabapentina ni topiramato para el trastorno bipolar.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.5.3 y 1.10.4.'
});

set('AGOSTO2_043', {
  e: 'Respecto al uso de antidepresivos en la depresión bipolar, señale la afirmación correcta:',
  o: {
    a: 'En bipolar I no deben utilizarse en monoterapia y, si se consideran, se emplean como coadyuvantes de un tratamiento antimaníaco adecuado.',
    b: 'Son especialmente recomendables cuando existen características mixtas.',
    c: 'Eliminan el riesgo de viraje en personas con ciclación rápida.',
    d: 'Deben mantenerse siempre de forma indefinida tras la remisión.'
  },
  c: 'a',
  x: 'En bipolar I se evita la monoterapia antidepresiva. Su posible uso debe ser prudente y coadyuvante de un estabilizador o antipsicótico apropiado, valorando antecedentes de viraje; se evitan o extreman las precauciones ante características mixtas o ciclación rápida.',
  r: 'Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('AGOSTO2_056', {
  e: '¿Cuál es el papel de la clozapina en el tratamiento de la manía?',
  o: {
    a: 'Es la primera elección universal para cualquier episodio maníaco.',
    b: 'Puede considerarse en manía resistente a tratamientos habituales, con vigilancia específica, pero no se elige simplemente por insomnio o ansiedad.',
    c: 'Carece de cualquier posible utilidad en casos resistentes.',
    d: 'Se utiliza como antidepresivo en monoterapia.'
  },
  c: 'b',
  x: 'La clozapina no es una opción inicial rutinaria para la manía. Puede considerarse en cuadros resistentes tras fracaso de tratamientos mejor establecidos, teniendo en cuenta su perfil de efectos adversos y la necesidad de monitorización hematológica.',
  r: 'Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('MAYO2_065', {
  e: 'Antes de iniciar un antipsicótico en una persona con trastorno bipolar, ¿qué evaluación basal recomienda NICE?',
  o: {
    a: 'Peso o IMC, pulso, presión arterial, glucemia en ayunas o HbA1c y perfil lipídico.',
    b: 'Únicamente una escala de depresión.',
    c: 'Solo un electroencefalograma.',
    d: 'Ninguna medida física si la persona es joven.'
  },
  c: 'a',
  x: 'Antes de iniciar un antipsicótico deben registrarse peso o IMC, pulso, presión arterial, glucemia en ayunas o HbA1c y perfil lipídico. El ECG se indica además cuando lo exige la ficha técnica, existen riesgos cardiovasculares o se produce un ingreso hospitalario.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.10.5-1.10.6.'
});

set('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_083', {
  e: 'Según las medidas actuales de seguridad, ¿qué afirmación es correcta al iniciar valproato en una persona menor de 55 años?',
  o: {
    a: 'Puede iniciarse libremente como primera opción sin documentar alternativas.',
    b: 'Debe iniciarse siempre que exista insomnio.',
    c: 'Solo debe iniciarse cuando dos especialistas acuerdan y documentan que no existe otro tratamiento eficaz o tolerado, o que concurren razones excepcionales.',
    d: 'Los riesgos reproductivos solo deben considerarse en mujeres embarazadas.'
  },
  c: 'c',
  x: 'Las medidas de seguridad vigentes restringen el inicio de valproato en menores de 55 años, hombres o mujeres. Dos especialistas deben documentar que no existe otra opción eficaz o tolerada, salvo razones excepcionales; además se aplican las medidas específicas según sexo y capacidad reproductiva.',
  r: 'Medicines and Healthcare products Regulatory Agency (2025). Valproate: reproductive risks; National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185).'
});

set('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_147', {
  e: '¿Qué precaución es esencial al iniciar lamotrigina?',
  o: {
    a: 'Realizar una titulación gradual y advertir que debe solicitarse valoración urgente si aparece una erupción cutánea significativa.',
    b: 'Comenzar directamente con la dosis máxima para obtener respuesta inmediata.',
    c: 'Utilizarla como tratamiento de elección de la manía aguda.',
    d: 'Suspender toda monitorización porque no produce reacciones graves.'
  },
  c: 'a',
  x: 'Lamotrigina debe titularse lentamente porque una escalada rápida aumenta el riesgo de erupciones cutáneas graves, incluido el síndrome de Stevens-Johnson. No es un tratamiento para la manía aguda.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones sobre el uso de lamotrigina; ficha técnica autorizada.'
});

set('PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_152', {
  e: '¿Qué papel pueden desempeñar las benzodiacepinas en un episodio maníaco agudo?',
  o: {
    a: 'Pueden utilizarse durante un periodo breve como coadyuvantes para agitación o insomnio, pero no constituyen un tratamiento estabilizador específico de mantenimiento.',
    b: 'Son el tratamiento principal para prevenir recaídas bipolares.',
    c: 'Sustituyen al tratamiento antimaníaco en todos los casos.',
    d: 'Deben mantenerse indefinidamente para evitar dependencia.'
  },
  c: 'a',
  x: 'Una benzodiacepina puede emplearse de forma breve como apoyo sintomático ante agitación o insomnio, valorando sedación, tolerancia y dependencia. No reemplaza a los fármacos antimaníacos ni es un estabilizador de mantenimiento.',
  r: 'Yatham, L. N. et al. (2018). CANMAT and ISBD 2018 guidelines. Bipolar Disorders, 20, 97-170.'
});

set('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_082', {
  e: 'Según NICE, ¿cómo debe abordarse farmacológicamente el trastorno bipolar con ciclación rápida?',
  o: {
    a: 'Con las mismas intervenciones basadas en la fase clínica que en otros cursos, porque no existe evidencia sólida para un tratamiento diferencial específico.',
    b: 'Siempre con valproato como regla universal.',
    c: 'Siempre con un antidepresivo en monoterapia.',
    d: 'Sin estabilizadores ni antipsicóticos.'
  },
  c: 'a',
  x: 'NICE indica que la ciclación rápida debe recibir las mismas intervenciones que otros cursos del trastorno bipolar, seleccionadas según la fase y la situación individual. La evidencia no respalda asociarla automáticamente a un único fármaco.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendación 1.1.3.'
});

set('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_170', {
  e: 'Si una persona presenta depresión bipolar moderada o grave y no está tomando medicación para el trastorno bipolar, ¿qué opciones iniciales contempla NICE?',
  o: {
    a: 'Fluoxetina combinada con olanzapina o quetiapina en monoterapia, considerando preferencias y respuesta previa.',
    b: 'Fluoxetina en monoterapia como única opción.',
    c: 'Haloperidol combinado con un IMAO de forma rutinaria.',
    d: 'Gabapentina como primera elección.'
  },
  c: 'a',
  x: 'NICE contempla fluoxetina combinada con olanzapina o quetiapina sola; según preferencias y respuesta previa también pueden considerarse olanzapina o lamotrigina. No recomienda un antidepresivo aislado como estrategia rutinaria en bipolar I.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendación 1.6.3.'
});

set('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_150', {
  e: 'Según NICE, ¿cuál es el tratamiento farmacológico de primera línea para la prevención a largo plazo de recaídas en el trastorno bipolar?',
  o: {
    a: 'Litio.',
    b: 'Fluoxetina en monoterapia.',
    c: 'Clordiazepóxido.',
    d: 'Topiramato.'
  },
  c: 'a',
  x: 'NICE considera el litio el tratamiento farmacológico de primera línea y el más eficaz para el manejo a largo plazo del trastorno bipolar. Su uso exige información de seguridad y monitorización plasmática, renal, tiroidea y metabólica.',
  r: 'National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones 1.7.5-1.7.7 y 1.10.14-1.10.23.'
});

set('Simu 14 comentado _080', {
  e: 'En la fase inicial de la terapia interpersonal para la depresión, ¿qué finalidad tiene asignar temporalmente el «rol de enfermo»?',
  o: {
    a: 'Validar que la depresión es un problema tratable y aliviar temporalmente exigencias excesivas, manteniendo la responsabilidad de participar en el tratamiento.',
    b: 'Fomentar una dependencia permanente del terapeuta.',
    c: 'Negar cualquier influencia del contexto interpersonal.',
    d: 'Modificar directamente la estructura básica de personalidad.'
  },
  c: 'a',
  x: 'La TIP presenta la depresión como una enfermedad tratable y utiliza de forma limitada el rol de enfermo para reducir culpa y exigencias desadaptativas. No elimina la responsabilidad de colaborar activamente ni pretende cronificar la dependencia.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press.'
});

set('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_031', {
  r: 'Squire, L. R., Slater, P. C. y Chace, P. M. (1975). Retrograde amnesia: temporal gradient in very long term memory following electroconvulsive therapy. Science, 187, 77-79; National Institute for Health and Care Excellence (2003, actualizada). Guidance on the use of electroconvulsive therapy (TA59).'
});

for (const q of block) set(q.id);
fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Bloque final auditado: 26 preguntas del tema validadas, 11 corregidas; 2 preguntas reubicadas.');
