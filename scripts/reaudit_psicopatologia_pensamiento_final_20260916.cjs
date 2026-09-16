const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'banco', 'psicopatologia.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Psicopatología del pensamiento';
const candidates = bank.filter(q => q.t?.includes(topic)).slice(80);
if (candidates.length !== 28) throw new Error(`Se esperaban 28 preguntas y hay ${candidates.length}`);

const misplaced = candidates.find(q => q.id === 'SmCm1PIR2024_089');
misplaced.t = ['Modelos en psicopatología'];
misplaced.v = 'REVISAR';
misplaced.x = 'Pendiente de auditoría en su tema correcto. La pregunta compara modelos explicativos de la psicosis y no evalúa psicopatología del pensamiento.';
misplaced.r = '';

const block = candidates.filter(q => q !== misplaced);
const ref = 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), psicopatología del pensamiento. McGraw Hill.';
const vallejo = 'Vallejo Ruiloba, J. (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier.';
function set(id, e, o, c, x, r = ref) {
  const q = block.find(z => z.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  Object.assign(q, { e, o, c, x, r, v: 'VALIDADA_ORIGINAL' });
}

set('SmCm1PIR2024_158', '¿Cómo se denomina el delirio de infestación en el que la persona cree que su piel está invadida por parásitos, a menudo acompañado de sensaciones táctiles?',
  { a: 'Síndrome de Cotard.', b: 'Síndrome de Otelo.', c: 'Síndrome de Ekbom.', d: 'Síndrome de Frégoli.' }, 'c',
  'El síndrome de Ekbom o delirio de parasitosis consiste en la convicción de estar infestado por parásitos. Cotard es nihilista, Otelo es celotípico y Frégoli es una falsa identificación.', vallejo);
set('SmCm1PIR2024_161', '¿Cuál de los siguientes se considera un trastorno formal negativo del pensamiento?',
  { a: 'Incoherencia.', b: 'Descarrilamiento.', c: 'Alogia.', d: 'Resonancia.' }, 'c',
  'La alogia expresa empobrecimiento de la producción o del contenido verbal y se incluye entre los trastornos formales negativos. Los otros fenómenos corresponden a alteraciones positivas o desorganizadas.');
set('SmCm20PIR2024_026', '¿Qué dimensión del delirio alude al carácter extraño, improbable o extravagante de su contenido?',
  { a: 'Convicción.', b: 'Ausencia de apoyo cultural.', c: 'Implausibilidad.', d: 'Inmodificabilidad.' }, 'c',
  'La implausibilidad valora en qué medida el contenido resulta inverosímil o extravagante. La convicción mide certeza y la inmodificabilidad, resistencia al cambio.');
set('SmCm21PIR2025 (2)_055', 'Respecto a las explicaciones de la comunicación desviada asociada a los trastornos formales del pensamiento, señale la afirmación INCORRECTA:',
  { a: 'El enfoque individual destaca que el hablante puede no ajustar el mensaje a las necesidades informativas del oyente.', b: 'El enfoque interaccional considera patrones de comunicación familiar y coordinación del significado.', c: 'El enfoque evolutivo ha estudiado si la comunicación parental desviada se relaciona con alteraciones posteriores en los hijos.', d: 'Todos los enfoques sostienen que la desviación comunicativa se explica exclusivamente por una lesión localizada y única.' }, 'd',
  'La comunicación desviada se ha estudiado desde niveles individuales, interaccionales y evolutivos; no existe una explicación consensuada basada exclusivamente en una lesión única y localizada.');
set('SmCm21PIR2025 (2)_062', '¿Cómo se denomina la selección de palabras guiada por su semejanza sonora en lugar de por su significado?',
  { a: 'Aproximación de palabras.', b: 'Resonancia.', c: 'Habla distraída.', d: 'Circunstancialidad.' }, 'b',
  'En la resonancia, las palabras se eligen por rimas, aliteraciones u otras semejanzas fonéticas, no por su adecuación semántica.');
set('SmCm22PIR2025_098', 'Una persona afirma: «La presentadora se ha puesto un vestido verde para avisarme de que corro peligro». ¿Qué vivencia delirante primaria ejemplifica?',
  { a: 'Atmósfera delirante.', b: 'Intuición delirante.', c: 'Percepción delirante.', d: 'Recuerdo delirante.' }, 'c',
  'Parte de una percepción normal —el vestido verde— a la que se atribuye de inmediato un significado delirante personal; por ello es una percepción delirante.');
set('SmCm22PIR2025_101', '¿Cuál de los siguientes NO se considera habitualmente un mecanismo psicológico de mantenimiento de los delirios?',
  { a: 'Sesgos de razonamiento.', b: 'Sesgos atribucionales.', c: 'Sobrecarga cognitiva como mecanismo mantenedor específico.', d: 'Profecías autocumplidas y respuestas del entorno.' }, 'c',
  'Entre los mecanismos mantenedores se describen sesgos inferenciales y atribucionales, conductas de seguridad y procesos interpersonales como la profecía autocumplida. La sobrecarga cognitiva no se enumera como mecanismo específico equivalente.');
set('SmCm24PIR2025 (1)_023', 'Señale la afirmación correcta sobre los trastornos formales del pensamiento:',
  { a: 'La pobreza del contenido implica necesariamente respuestas monosilábicas.', b: 'En la incoherencia puede conservarse la gramática de frases aisladas aunque el discurso global resulte ininteligible.', c: 'La ilogicidad es un trastorno formal negativo.', d: 'Las pararrespuestas son siempre respuestas aproximadas deliberadamente erróneas.' }, 'b',
  'En la incoherencia puede haber frases gramaticalmente bien construidas, pero sin conexión semántica global. La pobreza del contenido puede ser extensa; la ilogicidad es positiva y las pararrespuestas no equivalen necesariamente a respuestas aproximadas.');
set('SmCm24PIR2025 (1)_027', '¿Qué alteración se caracteriza porque el discurso se interrumpe o cambia de dirección ante estímulos inmediatos del entorno?',
  { a: 'Fuga de ideas.', b: 'Habla distraída.', c: 'Pérdida de meta.', d: 'Bloqueo.' }, 'b',
  'En el habla distraída, un estímulo próximo desvía el curso del discurso. En el bloqueo la producción se detiene bruscamente sin que el cambio sea provocado necesariamente por un estímulo externo.');
set('SmCm25PIR2025_117', '¿Cuál NO es una característica habitual de las obsesiones autógenas?',
  { a: 'Aparecen de forma aparentemente espontánea.', b: 'Suelen ser egodistónicas y muy desagradables.', c: 'Se viven como plenamente egosintónicas y carentes de malestar.', d: 'Pueden tener contenido sexual, agresivo, religioso o moral.' }, 'c',
  'Las obsesiones autógenas suelen irrumpir sin desencadenante identificable, poseen contenidos repugnantes o moralmente amenazantes y son marcadamente egodistónicas.');
set('SmCm25PIR2025_118', '¿Qué alteración presenta quien está convencido de que sus pensamientos pueden ser conocidos por otras personas sin comunicarlos?',
  { a: 'Difusión o irradiación del pensamiento.', b: 'Inserción del pensamiento.', c: 'Percepción delirante.', d: 'Delirio de referencia.' }, 'a',
  'La difusión o irradiación es la experiencia delirante de que los pensamientos propios salen de la mente o quedan accesibles a los demás.');
set('SmCm26PIR2025_082', 'Indique la afirmación INCORRECTA sobre el delirio paranoico clásico:',
  { a: 'Puede elaborarse a partir de un conflicto psicoafectivo.', b: 'Se organiza típicamente como un sistema fragmentario, incoherente y mal construido.', c: 'Se ha descrito como un delirio de relación social.', d: 'La reivindicación es una de sus presentaciones características.' }, 'b',
  'El delirio paranoico clásico se describe como organizado, coherente y sistematizado. La construcción fragmentaria y mal estructurada no es su rasgo característico.', vallejo);
set('SmCm28PIR2025_209', '¿Cuál de los siguientes es un ejemplo prototípico de delirio de reivindicación?',
  { a: 'Delirio querulante.', b: 'Delirio nihilista.', c: 'Delirio místico.', d: 'Delirio celotípico.' }, 'a',
  'El delirio querulante se centra en agravios, derechos y reclamaciones persistentes, por lo que constituye la forma paradigmática de reivindicación.');
set('SmCm29PIR2025_063', '¿Cuál de los siguientes puede considerarse un trastorno formal negativo del pensamiento?',
  { a: 'Tangencialidad.', b: 'Pobreza del habla o habla lacónica.', c: 'Ilogicidad.', d: 'Descarrilamiento.' }, 'b',
  'La pobreza del habla refleja una disminución de la cantidad de producción verbal y se clasifica como alteración negativa. Tangencialidad, ilogicidad y descarrilamiento son alteraciones positivas o desorganizadas.');
set('SmCm2PIR2024_031', 'Una persona responde de manera muy indirecta, incluye numerosos detalles irrelevantes, pero finalmente contesta a la pregunta. ¿Qué alteración presenta?',
  { a: 'Pérdida de meta.', b: 'Circunstancialidad.', c: 'Habla distraída.', d: 'Descarrilamiento.' }, 'b',
  'En la circunstancialidad el discurso se demora en detalles innecesarios, aunque finalmente alcanza la meta. En la tangencialidad o pérdida de meta no llega a responder adecuadamente.');
set('SmCm3PIR2024_095', '¿Qué caracteriza a la atmósfera o humor delirante?',
  { a: 'Una idea secundaria comprensible a partir de tristeza.', b: 'La vivencia primaria de que el mundo ha cambiado de forma extraña, inquietante y difícil de precisar.', c: 'La interpretación delirante de una percepción aislada.', d: 'La reconstrucción delirante de un recuerdo.' }, 'b',
  'En la atmósfera delirante el entorno parece transformado y cargado de una significación ominosa aún indeterminada. Se considera una vivencia delirante primaria.');
set('SmCm4PIR2024_075', '¿Qué alteración ocurre cuando la persona interrumpe bruscamente el discurso antes de completar la idea y puede olvidar lo que estaba diciendo?',
  { a: 'Descarrilamiento.', b: 'Bloqueo del pensamiento.', c: 'Latencia de respuesta aumentada.', d: 'Circunstancialidad.' }, 'b',
  'El bloqueo es una interrupción súbita del curso del pensamiento y del habla; tras ella, la persona puede no recuperar la idea previa.');
set('SmCm4PIR2024_080', '¿Cuál es una característica de los pensamientos automáticos negativos?',
  { a: 'Aparecen de forma breve y espontánea y no constituyen por sí mismos un intento elaborado de resolver problemas.', b: 'Son siempre vagos y abstractos.', c: 'La persona necesariamente los reconoce como absurdos.', d: 'Siempre provocan rituales neutralizadores.' }, 'a',
  'Los pensamientos automáticos negativos son evaluaciones breves, concretas y de aparición rápida, aceptadas a menudo como plausibles. No implican necesariamente absurdo reconocido ni compulsiones.');
set('SmCm5PIR2024_124', '¿Cómo se denomina el uso de una palabra existente con un significado idiosincrásico distinto del convencional?',
  { a: 'Neologismo.', b: 'Palilalia.', c: 'Paralogismo.', d: 'Glosolalia.' }, 'c',
  'El paralogismo asigna a una palabra conocida un significado nuevo y particular. El neologismo crea una palabra nueva; la palilalia repite las propias palabras y la glosolalia simula un idioma.');
set('SmCm5PIR2024_143', '¿Cómo se denomina la creación de palabras nuevas o idiosincrásicas cuyo significado solo conoce quien las utiliza?',
  { a: 'Asintaxia.', b: 'Aproximación de palabras.', c: 'Neologismo.', d: 'Alexia.' }, 'c',
  'El neologismo es una palabra nueva o una formación verbal idiosincrásica. Debe distinguirse del paralogismo, donde la palabra existe pero recibe otro significado.');
set('SmCm5PIR2024_148', 'Una persona deja una frase a medias y cambia de tema porque se fija en la corbata del entrevistador. ¿Qué alteración presenta?',
  { a: 'Presión del habla.', b: 'Tangencialidad.', c: 'Circunstancialidad.', d: 'Habla distraída.' }, 'd',
  'El cambio provocado por un estímulo externo inmediato define el habla distraída. La presión describe cantidad y velocidad excesivas, no la causa del cambio temático.');
set('SmCm27PIR2025 (1)_023', 'Según la clasificación de Jaspers por la forma del delirio, señale la afirmación correcta:',
  { a: 'La atmósfera delirante es siempre secundaria.', b: 'Los delirios secundarios o ideas deliroides son comprensibles desde otros estados o experiencias.', c: 'Los delirios primarios son comprensibles a partir del estado afectivo.', d: 'Los delirios primarios explican necesariamente una alucinación previa.' }, 'b',
  'Las ideas deliroides se comprenden en relación con afectos, experiencias o trastornos previos. Las vivencias primarias, entre ellas la atmósfera delirante, son psicológicamente incomprensibles.');
set('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_063', '¿En qué cuadro son especialmente característicos los delirios de pobreza y ruina congruentes con el estado de ánimo?',
  { a: 'Esquizofrenia desorganizada.', b: 'Episodio depresivo mayor con síntomas psicóticos.', c: 'Episodio maníaco.', d: 'Trastorno delirante erotomaníaco.' }, 'b',
  'Los delirios de pobreza, ruina, culpa o catástrofe son contenidos congruentes con una depresión grave y pueden aparecer en episodios depresivos con características psicóticas.');
set('SmCm1PIR2024_160', '¿Cuál de las siguientes es una alteración formal del pensamiento?',
  { a: 'Esquizoafasia o incoherencia.', b: 'Pensamiento automático negativo.', c: 'Obsesión.', d: 'Preocupación.' }, 'a',
  'La esquizoafasia designa un discurso gravemente incoherente o ininteligible y es una alteración formal. Obsesiones, preocupaciones y pensamientos automáticos se clasifican por su contenido o función.');
set('1Simulacro02018Comentarios_092', 'Creer que una fuerza externa ha introducido pensamientos ajenos en la propia mente constituye:',
  { a: 'Idea obsesiva.', b: 'Delirio nihilista.', c: 'Fuga de ideas.', d: 'Inserción o imposición del pensamiento.' }, 'd',
  'En la inserción del pensamiento se pierde la autoría subjetiva y se atribuyen a un agente externo ideas presentes en la propia mente.');
set('Simu 12 comentado_109', 'En su descripción clásica, ¿qué rasgo caracteriza al delirio paranoide?',
  { a: 'Una organización relativamente sistematizada alrededor de persecución, perjuicio o referencia.', b: 'Ideas necesariamente fragmentarias y sin organización.', c: 'Contenidos exclusivos de culpa y ruina.', d: 'Incoherencia formal como requisito diagnóstico.' }, 'a',
  'El delirio paranoide suele articularse de forma relativamente organizada en torno a temas persecutorios, de perjuicio o referencia; no exige desorganización formal del pensamiento.');
set('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_060', 'Según Andreasen, ¿cómo se denomina el discurso prácticamente incomprensible porque palabras o frases se unen sin conexión lógica?',
  { a: 'Descarrilamiento.', b: 'Incoherencia o esquizoafasia.', c: 'Circunstancialidad.', d: 'Verbigeración.' }, 'b',
  'La incoherencia o esquizoafasia alcanza un grado de desorganización que hace ininteligible el discurso. El descarrilamiento conserva conexiones débiles; la verbigeración es repetición estereotipada.');

for (const q of block) {
  if (q.v !== 'VALIDADA_ORIGINAL' || !q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || /�/.test(q.e + JSON.stringify(q.o) + q.x)) throw new Error(`Control fallido: ${q.id}`);
}
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Cierre del tema: 27 preguntas validadas y 1 reubicada en Modelos en psicopatología.');
