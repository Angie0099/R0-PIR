const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'psicopatologia.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Psicopatología del pensamiento';
const block = bank.filter(q => q.t?.includes(topic)).slice(60, 80);
if (block.length !== 20) throw new Error(`Se esperaban 20 preguntas y se encontraron ${block.length}`);

function set(id, e, o, c, x, r) {
  const q = block.find(item => item.id === id);
  if (!q) throw new Error(`No se encontró ${id} en el bloque`);
  Object.assign(q, { e, o, c, x, r, v: 'VALIDADA_ORIGINAL' });
}

const belloch = 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento. McGraw Hill.';

set('SM_DICIEMBRE_2_SOL_1_076',
  '¿Cómo se denomina el discurso pomposo, distante o pedante, caracterizado por fórmulas de cortesía extrema o expresiones excesivamente cultas e inadecuadas al contexto?',
  { a: 'Metonimia.', b: 'Habla afectada.', c: 'Habla distraída.', d: 'Circunstancialidad.' }, 'b',
  'El habla afectada, también llamada discurso enfático o versaillesco, resulta pomposa y artificial por el uso de fórmulas excesivamente cultas o ceremoniosas. No equivale a la circunstancialidad, que se pierde en detalles pero acaba alcanzando la meta.', belloch);

set('SM_ENERO_1_SOL_1_073',
  'Según Jaspers, ¿qué vivencia delirante primaria consiste en atribuir de manera inmediata un significado delirante y personal a una percepción normal?',
  { a: 'Recuerdo delirante.', b: 'Atmósfera delirante.', c: 'Intuición delirante.', d: 'Percepción delirante.' }, 'd',
  'En la percepción delirante existe una percepción real y correctamente identificada a la que se atribuye, sin mediación comprensible, un significado delirante autorreferencial.', belloch);

set('SM_JULIO_1_SOL_1_029',
  '¿Qué forma de pensamiento repetitivo negativo suele adoptar una cadena orientada hacia el pasado y centrada en el malestar, sus causas y sus consecuencias?',
  { a: 'Preocupación.', b: 'Rumiación.', c: 'Pensamiento automático negativo.', d: 'Obsesión.' }, 'b',
  'La rumiación es repetitiva, pasiva y predominantemente retrospectiva; se centra en emociones negativas, síntomas y sus posibles causas y consecuencias. La preocupación se orienta más habitualmente hacia amenazas futuras.', belloch);

set('SM_JULIO_1_SOL_1_030',
  'Una persona reconstruye un dolor abdominal ocurrido dos días antes y ahora afirma que se debió a que unos extraterrestres introdujeron un huevo en su cuerpo. ¿Qué vivencia delirante primaria describe mejor el caso?',
  { a: 'Intuición delirante.', b: 'Percepción delirante.', c: 'Atmósfera delirante.', d: 'Recuerdo delirante.' }, 'd',
  'Es un recuerdo delirante porque se dota retrospectivamente de significado delirante a un acontecimiento recordado. La percepción delirante se produce sobre una percepción presente y la intuición surge súbitamente sin apoyarse en ella.', belloch);

set('SM_JULIO_2_SOL_1_026',
  '¿Cuál de las siguientes NO es una vivencia delirante primaria descrita en la tradición de Jaspers?',
  { a: 'Percepción delirante.', b: 'Atmósfera o humor delirante.', c: 'Intuición delirante.', d: 'Creación delirante.' }, 'd',
  'Se describen percepción, intuición, atmósfera o humor y recuerdo delirantes. «Creación delirante» no forma parte de esta clasificación.', belloch);

set('SM_JULIO_2_SOL_1_055',
  '¿Qué caracteriza al descarrilamiento como trastorno formal del pensamiento?',
  { a: 'Las ideas se deslizan hacia otras no relacionadas o relacionadas solo de forma oblicua.', b: 'Las conclusiones contradicen las premisas de partida.', c: 'El discurso cambia por la aparición de un estímulo externo inmediato.', d: 'Se repiten persistentemente palabras, ideas o temas.' }, 'a',
  'En el descarrilamiento se pierde la ilación: el discurso pasa de una idea a otra sin relación clara o con una relación tangencial. Las demás alternativas describen ilogicidad, habla distraída y perseveración.', belloch);

set('SM_MAYO_1_SOL_1_079',
  '¿Cómo se denomina la creencia persistente, comprensible biográficamente y con gran carga afectiva, sostenida con menor convicción que un delirio y con posible conservación parcial del insight?',
  { a: 'Obsesión.', b: 'Pensamiento automático negativo.', c: 'Creencia disfuncional.', d: 'Idea sobrevalorada.' }, 'd',
  'La idea sobrevalorada domina la vida mental y tiene intensa implicación emocional, pero suele ser comprensible desde la historia personal y menos incorregible que el delirio. La obsesión se vive típicamente como intrusa y egodistónica.', belloch);

set('SmCm06PIR2025_019',
  '¿Cómo se denomina el delirio centrado en agravios, derechos, pleitos y denuncias persistentes?',
  { a: 'Delirio persecutorio.', b: 'Delirio de referencia.', c: 'Delirio nihilista.', d: 'Delirio de reivindicación.' }, 'd',
  'El delirio de reivindicación se organiza en torno a la convicción de haber sufrido una injusticia y a la lucha persistente por obtener reparación, a menudo mediante reclamaciones o litigios.', belloch);

set('SmCm06PIR2025_065',
  '¿Qué trastorno formal del pensamiento consiste en la repetición persistente de palabras, ideas o temas a los que la persona vuelve una y otra vez?',
  { a: 'Perseveración.', b: 'Circunstancialidad.', c: 'Descarrilamiento.', d: 'Bloqueo.' }, 'a',
  'La perseveración es la persistencia o repetición inapropiada de una respuesta verbal previa una vez que el contexto ya exige cambiarla. No implica solo un discurso detallado ni una pérdida de asociaciones.', belloch);

set('SmCm06PIR2025_066',
  '¿Qué aportación caracteriza a la escuela de Heidelberg en la teoría clásica de los delirios?',
  { a: 'La distinción entre delirios primarios y secundarios según la comprensibilidad psicológica de su origen.', b: 'La explicación de todo delirio por un fracaso silogístico.', c: 'La reducción de todo delirio al mecanismo de proyección.', d: 'La atribución exclusiva del delirio al debilitamiento de asociaciones.' }, 'a',
  'La tradición fenomenológica de Heidelberg, vinculada a Jaspers, diferenció vivencias delirantes primarias psicológicamente incomprensibles de ideas delirantes secundarias comprensibles a partir de otros estados o experiencias.', belloch);

set('SmCm12PIR2024 2_067',
  '¿Cómo se denomina la idea delirante centrada en la inexistencia del propio yo, de partes del cuerpo, de otras personas o del mundo?',
  { a: 'Delirio de falsa identificación.', b: 'Delirio de pobreza.', c: 'Delirio nihilista.', d: 'Delirio de referencia.' }, 'c',
  'El delirio nihilista implica la convicción de que uno mismo, algún órgano, otras personas o el mundo no existen, han desaparecido o han dejado de funcionar.', belloch);

set('SmCm12PIR2024 2_069',
  '¿Cómo se denomina el habla de duración aparentemente adecuada o incluso excesiva que transmite muy poca información?',
  { a: 'Pobreza del habla.', b: 'Presión del habla.', c: 'Pobreza del contenido del habla.', d: 'Descarrilamiento.' }, 'c',
  'En la pobreza del contenido del habla la cantidad de discurso puede ser suficiente, pero resulta vago, repetitivo o poco informativo. En la pobreza del habla disminuye la cantidad de producción verbal.', belloch);

set('SmCm14PIR2025_110',
  '¿Qué término designa la tendencia del discurso a desviarse hacia ideas secundarias y perder la ilación con la idea directriz?',
  { a: 'Descarrilamiento.', b: 'Sustitución.', c: 'Omisión.', d: 'Fusión.' }, 'a',
  'El descarrilamiento o pérdida de asociaciones se manifiesta por el deslizamiento hacia ideas secundarias con conexiones débiles, de modo que se pierde la línea directriz del discurso.', belloch);

set('SmCm14PIR2025_111',
  '¿Qué dimensión del delirio describe su resistencia al cambio pese a argumentos o pruebas contrarias?',
  { a: 'Convicción.', b: 'Ausencia de apoyo cultural.', c: 'Implausibilidad.', d: 'Inmodificabilidad o incorregibilidad.' }, 'd',
  'La inmodificabilidad, incorregibilidad o fijeza expresa la resistencia de la creencia a cambiar ante evidencia contradictoria. La convicción alude al grado de certeza subjetiva.', belloch);

set('SmCm15PIR2025_092',
  '¿Qué rasgo caracteriza al delirio sensitivo de relación frente a una vivencia delirante primaria de autorreferencia?',
  { a: 'Su desarrollo comprensible tras humillaciones o fracasos en una personalidad sensitiva.', b: 'La negación de la existencia propia.', c: 'La creencia de poseer poderes extraordinarios.', d: 'La ausencia de conexión con acontecimientos biográficos.' }, 'a',
  'El delirio sensitivo de relación de Kretschmer se desarrolla de forma reactiva y psicológicamente comprensible a partir de vivencias de vergüenza, culpa, humillación o fracaso en una personalidad sensitiva.', belloch);

set('SmCm16PIR2025_097',
  '¿Qué es la glosolalia?',
  { a: 'La pérdida de la idea directriz por ruptura de las asociaciones.', b: 'La emisión involuntaria de expresiones obscenas.', c: 'La repetición automática de palabras del interlocutor.', d: 'Un lenguaje parecido al natural en ritmo y entonación, pero formado por sonidos o palabras inventadas con significado para quien habla.' }, 'd',
  'La glosolalia es una producción verbal fluida y semejante a un idioma por su prosodia, aunque carece de vocabulario convencional y puede ser significativa para quien la emite. No debe confundirse con coprolalia, ecolalia o descarrilamiento.', belloch);

set('SmCm16PIR2025_098',
  '¿Cómo se denomina la vivencia en la que la persona cree que sus pensamientos son conocidos por los demás sin haberlos comunicado?',
  { a: 'Difusión o irradiación del pensamiento.', b: 'Inserción del pensamiento.', c: 'Robo del pensamiento.', d: 'Delirio de control.' }, 'a',
  'En la difusión o irradiación del pensamiento, la persona cree que sus pensamientos salen de su mente y son accesibles a otros. En la inserción se viven pensamientos ajenos introducidos y en el robo se experimenta que una fuerza externa los retira.', belloch);

set('SmCm17PIR2025_079',
  'En relación con la fuga de ideas, señale la afirmación INCORRECTA:',
  { a: 'Existe una sucesión acelerada de ideas.', b: 'Las asociaciones pueden guiarse por estímulos externos, rimas o juegos de palabras.', c: 'Es frecuente que se pierda la meta del discurso.', d: 'Se caracteriza por un habla lenta, escasa y con largas latencias de respuesta.' }, 'd',
  'La fuga de ideas se caracteriza por aceleración, cambios rápidos de tema y asociaciones superficiales, aunque a menudo cada fragmento conserva estructura comprensible. El habla lenta y escasa corresponde a inhibición o pobreza del pensamiento, no a fuga de ideas.', belloch);

set('SmCm17PIR2025_080',
  '¿Qué alteración consiste en seleccionar y verbalizar palabras por su sonido, y no por su adecuación sintáctica o semántica?',
  { a: 'Resonancia.', b: 'Perseveración.', c: 'Ecolalia.', d: 'Pérdida de meta.' }, 'a',
  'En la resonancia o asociación por sonidos, la elección de palabras se rige por semejanzas fonéticas, rimas o aliteraciones, en detrimento del significado. La ecolalia es la repetición de palabras ajenas.', belloch);

set('SmCm17PIR2025_210',
  'En el delirio de control o pasividad, la persona experimenta que:',
  { a: 'Acontecimientos neutros contienen mensajes dirigidos especialmente a ella.', b: 'Sus pensamientos, impulsos, sentimientos o actos son impuestos o manejados por una fuerza externa.', c: 'Sus órganos han desaparecido o han dejado de funcionar.', d: 'Otras personas han sido sustituidas por dobles.' }, 'b',
  'El delirio de control o pasividad implica pérdida de la autoría subjetiva: pensamientos, emociones, impulsos o acciones se viven como producidos o dirigidos por un agente externo. Las otras opciones describen referencia, nihilismo y falsa identificación.', belloch);

for (const q of block) {
  if (q.v !== 'VALIDADA_ORIGINAL' || !q.e || !q.o || !q.c || !q.x || !q.r || !Object.hasOwn(q.o, q.c)) throw new Error(`Validación incompleta: ${q.id}`);
}

fs.writeFileSync(file, JSON.stringify(bank));
console.log('Bloque 61-80 reauditorado: 20 preguntas validadas.');
