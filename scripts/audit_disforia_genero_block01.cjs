const fs = require('fs');

const path = 'public/banco/clinica_adultos.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(data.map((q) => [q.id, q]));

function update(id, patch) {
  const q = byId.get(id);
  if (!q) throw new Error(`No existe ${id}`);
  Object.assign(q, patch, { v: 'VALIDADA_ORIGINAL' });
}

const dsm = 'American Psychiatric Association (2022). Manual diagnóstico y estadístico de los trastornos mentales, texto revisado (DSM-5-TR). Editorial Médica Panamericana.';
const dsm5 = 'American Psychiatric Association (2014). Manual diagnóstico y estadístico de los trastornos mentales (DSM-5). Editorial Médica Panamericana, pp. 451-459.';

update('1Simulacro02018Comentarios_208', {
  t: ['Trastornos por síntomas somáticos y relacionados'],
  e: '¿A qué hace referencia el término «pseudociesis»?',
  o: { a: 'A la percepción imaginaria de figuras religiosas o demoníacas.', b: 'A la dificultad para pronunciar determinadas palabras.', c: 'A una sensación persistente de hormigueo por todo el cuerpo.', d: 'A la falsa creencia de estar embarazada, asociada a signos y síntomas objetivos de embarazo.' },
  c: 'd',
  x: 'La pseudociesis es la creencia falsa de estar embarazada asociada a signos y síntomas objetivos de embarazo, como aumento abdominal, disminución del flujo menstrual o náuseas. En el DSM-5-TR se incluye como ejemplo de «otro trastorno de síntomas somáticos y trastornos relacionados especificado».',
  r: dsm
});

update('1Simulacro02018Comentarios_210', {
  t: ['TOC'],
  e: '¿Cuál de las siguientes intervenciones para el TOC se ha considerado experimental por no disponer de apoyo suficiente como tratamiento psicológico establecido?',
  o: { a: 'Exposición con prevención de respuesta.', b: 'Exposición con prevención de respuesta combinada con terapia cognitiva.', c: 'Tratamiento farmacológico con inhibidores de la recaptación de serotonina.', d: 'Terapia psicodinámica.' },
  c: 'd',
  x: 'La exposición con prevención de respuesta es el tratamiento psicológico de referencia para el TOC y puede combinarse con técnicas cognitivas o farmacoterapia. La terapia psicodinámica no cuenta con evidencia suficiente como tratamiento específico establecido del TOC. Se corrige la clave original, que señalaba erróneamente la combinación de exposición y terapia cognitiva.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill, cap. 5.'
});

update('1Simulacro02018Comentarios_211', {
  t: ['Trastornos disociativos'],
  e: '¿Para el abordaje de qué trastorno desarrolló Fine un programa cognitivo-conductual basado en la teoría de Beck?',
  o: { a: 'Trastorno dismórfico corporal.', b: 'Trastorno de identidad disociativo.', c: 'Anorexia nerviosa.', d: 'Trastorno de ansiedad social.' },
  c: 'b',
  x: 'Fine desarrolló un abordaje cognitivo-conductual del trastorno de identidad disociativo apoyado en conceptos de la terapia cognitiva de Beck. Por ello, la respuesta correcta es la b.',
  r: 'Fine, C. G. (1999). The tactical-integration model for the treatment of dissociative identity disorder and allied dissociative disorders. American Journal of Psychotherapy, 53(3), 361-376.'
});

update('1Simulacro02018Comentarios_212', {
  t: ['Trastornos de la conducta alimentaria'],
  e: '¿Qué trastorno de la personalidad se asocia con especial frecuencia a la anorexia nerviosa del subtipo con atracones/purgas?',
  o: { a: 'Trastorno de la personalidad dependiente.', b: 'Trastorno límite de la personalidad.', c: 'Trastorno de la personalidad obsesivo-compulsiva.', d: 'Trastorno de la personalidad evitativa.' },
  c: 'b',
  x: 'El trastorno límite de la personalidad aparece con especial frecuencia en el subtipo de anorexia nerviosa con atracones/purgas. Se precisa el subtipo en el enunciado porque, referido a toda la anorexia nerviosa sin matices, la pregunta original resultaba ambigua.',
  r: dsm
});

update('ABRIL-UNO-24_COMENTADO_131', {
  e: '¿Cuál de estos grupos se incluye en el capítulo 6 de la CIE-11, «Trastornos mentales, del comportamiento y del neurodesarrollo»?',
  o: { a: 'Disfunciones sexuales.', b: 'Trastornos sexuales por dolor.', c: 'Incongruencia de género.', d: 'Trastornos parafílicos.' },
  c: 'd',
  x: 'En la CIE-11, las disfunciones sexuales, los trastornos sexuales por dolor y la incongruencia de género se sitúan en el capítulo 17, «Condiciones relacionadas con la salud sexual». Los trastornos parafílicos permanecen en el capítulo 6.',
  r: 'Organización Mundial de la Salud (2024). CIE-11 para estadísticas de mortalidad y morbilidad, capítulos 6 y 17.'
});

update('AGOSTO2_035', {
  e: '¿Cómo se denomina el malestar clínicamente significativo que puede acompañar a la incongruencia entre el género experimentado o expresado y el género asignado?',
  o: { a: 'Transgénero.', b: 'Expresión de género.', c: 'Intersexualidad.', d: 'Disforia de género.' },
  c: 'd',
  x: 'La disforia de género designa el malestar que puede acompañar a la incongruencia entre el género experimentado o expresado y el género asignado. Ser transgénero, por sí solo, no constituye un trastorno.',
  r: dsm
});

update('AGOSTO2_058', {
  e: '¿Qué especificador contempla el DSM-5 para la disforia de género en adolescentes y adultos, pero no para la disforia de género en niños?',
  o: { a: 'Con remisión total.', b: 'Adquirida.', c: 'Con un trastorno del desarrollo sexual.', d: 'Postransición.' },
  c: 'd',
  x: '«Con un trastorno del desarrollo sexual» puede especificarse tanto en niños como en adolescentes y adultos. «Postransición» figura únicamente en el diagnóstico de adolescentes y adultos.',
  r: dsm5
});

update('DICIEMBRE-DOS-24_COMENTADO_023', {
  o: { a: 'El trastorno del espectro autista presenta una prevalencia mayor entre los menores con disforia de género derivados a servicios especializados que en la población general.', b: 'El rechazo de los propios genitales y el deseo de poseer los caracteres sexuales del otro género son imprescindibles para diagnosticarla en niños.', c: 'Las manifestaciones de los adolescentes difieren por completo de las observadas en niños y adultos.', d: 'La ideación y las conductas suicidas son menos prevalentes que en la población general.' },
  c: 'a',
  x: 'La opción a es correcta: el TEA está sobrerrepresentado en menores con disforia de género derivados clínicamente. El rechazo anatómico no es un criterio imprescindible en niños; las manifestaciones adolescentes guardan continuidad con las de niños y adultos; y el riesgo de ideación y conducta suicida es mayor, no menor.',
  r: dsm
});

update('DICIEMBRE-UNO-24_COMENTADO_106', {
  e: 'Para que un niño cumpla los criterios diagnósticos de disforia de género del DSM-5, ¿cuál de los siguientes elementos debe estar presente?',
  o: { a: 'Un trastorno del desarrollo sexual concomitante.', b: 'Un poderoso deseo de ser del otro género o la insistencia de serlo.', c: 'Un marcado malestar por la anatomía sexual.', d: 'La verbalización expresa del deseo de cambiar de género.' },
  c: 'b',
  x: 'En niños se requieren al menos seis manifestaciones durante seis meses, y una de ellas ha de ser el poderoso deseo de ser del otro género o la insistencia de serlo. No son obligatorios un trastorno del desarrollo sexual, el malestar anatómico ni la verbalización expresa.',
  r: dsm5
});

update('JULIO1_123', {
  e: 'Señale la afirmación correcta sobre la disforia de género y los conceptos relacionados:',
  o: { a: 'La asignación de género se refiere exclusivamente a la realizada al nacer.', b: 'El término «transexual» engloba a toda persona cuya identidad de género difiere del género asignado.', c: 'El término «transexual» se ha utilizado para personas que buscan o han realizado una transición social y, con frecuencia, también somática.', d: 'El término «transgénero» implica necesariamente buscar un tratamiento de reasignación sexual.' },
  c: 'c',
  x: 'En la terminología del DSM-5-TR, «transgénero» es un término amplio y no implica tratamiento médico. «Transexual» es un término históricamente más restringido, ligado a la transición social y, a menudo, somática. La asignación puede producirse al nacer o, en algunas condiciones del desarrollo sexual, posteriormente.',
  r: dsm
});

update('JULIO2_031', {
  e: 'Señale la afirmación correcta sobre la disforia de género según el DSM-5:',
  o: { a: 'En niños debe estar presente el criterio referido al poderoso deseo de ser del otro género o a la insistencia de serlo.', b: 'El especificador «con un trastorno del desarrollo sexual» solo aparece en niños.', c: 'El especificador «postransición» aparece tanto en niños como en adolescentes y adultos.', d: 'En los niños derivados a consulta, las conductas relacionadas con el género suelen comenzar entre los 4 y los 6 años.' },
  c: 'a',
  x: 'En niños es obligatorio el criterio A1. El especificador relativo al trastorno del desarrollo sexual existe en ambos grupos de edad, mientras que «postransición» se aplica solo a adolescentes y adultos. En los casos de inicio temprano, las conductas suelen hacerse visibles entre los 2 y 4 años.',
  r: dsm5
});

update('JUNIO1_113', {
  e: 'Indique la respuesta correcta sobre el curso de la disforia de género según el DSM-5:',
  c: 'a',
  x: 'En el patrón de comienzo temprano, la disforia aparece en la infancia y puede continuar o reaparecer tras un periodo intermedio sin disforia. La reasignación no garantiza la desaparición del riesgo suicida; los datos citados para Japón y Polonia favorecían a las personas nacidas mujeres; y los criterios específicos para niños son más concretos y conductuales que los de adolescentes y adultos.',
  r: dsm5
});

update('MAYO-UNO-24_COMENTADO_019', {
  e: 'Señale la afirmación correcta sobre la disforia de género:',
  o: { a: 'En adultos, la prevalencia es mayor en personas nacidas mujeres que en personas nacidas hombres, excepto en Japón y Polonia.', b: 'Los trastornos depresivos y de ansiedad pueden aparecer como comorbilidades en todas las franjas de edad.', c: 'En niños, la proporción por sexo asignado al nacer es aproximadamente paritaria.', d: 'No se han descrito estrategias disociativas para afrontar la disforia anatómica.' },
  c: 'b',
  x: 'Los trastornos depresivos y de ansiedad pueden coexistir con la disforia de género en niños, adolescentes y adultos. Las restantes opciones contradicen los datos descriptivos del DSM-5: la proporción infantil no era paritaria y se describen estrategias disociativas ante la disforia anatómica.',
  r: dsm5
});

update('MAYO2_034', {
  e: 'Señale la opción correcta sobre la disforia de género según el DSM-5:',
  o: { a: 'Las personas con un trastorno del desarrollo sexual suelen mostrar una convicción inequívoca de pertenecer al otro género.', b: 'Cuando no existe un trastorno del desarrollo sexual, las conductas relacionadas con la disforia de comienzo temprano suelen aparecer entre los 2 y los 4 años.', c: 'En niños debe especificarse si la persona está en postransición.', d: 'En adolescentes y adultos, el criterio A exige al menos seis manifestaciones durante seis meses.' },
  c: 'b',
  x: 'En el comienzo temprano, las conductas suelen aparecer entre los 2 y los 4 años. En adolescentes y adultos bastan dos manifestaciones del criterio A durante al menos seis meses; las seis manifestaciones corresponden al diagnóstico infantil. «Postransición» no se aplica a niños.',
  r: dsm5
});

update('PERSEV_AGO25_U1_033', {
  e: 'Según el DSM-5, señale la afirmación correcta sobre la disforia de género:',
  o: { a: 'El único especificador en adolescentes y adultos es «postransición».', b: 'La incongruencia debe durar al menos doce meses en adolescentes y adultos y seis meses en niños.', c: 'El género experimentado no puede incluir identidades alternativas a las categorías binarias.', d: 'Los adolescentes y adultos nacidos mujeres con disforia de comienzo temprano presentan casi siempre ginefilia.' },
  c: 'd',
  x: 'Según la descripción de curso del DSM-5, en este grupo la ginefilia es muy frecuente. Adolescentes y adultos cuentan también con el especificador «con un trastorno del desarrollo sexual»; la duración mínima es de seis meses en ambos grupos diagnósticos; y el género experimentado puede situarse fuera de una formulación binaria.',
  r: dsm5
});

update('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_166', {
  e: 'En relación con las características asociadas y los criterios diagnósticos de disforia de género en adolescentes, señale la opción incorrecta:',
  o: { a: 'Los adolescentes mayores sexualmente activos pueden evitar mostrar sus genitales o que sus parejas los toquen.', b: 'Algunos adolescentes solicitan u obtienen sin supervisión médica tratamientos para suprimir los esteroides gonadales.', c: 'El aumento del riesgo de ideación y conducta suicidas desaparece necesariamente tras la reasignación sexual.', d: 'El criterio A exige una incongruencia marcada, de al menos seis meses, manifestada por un mínimo de dos características.' },
  c: 'c',
  x: 'La opción c es incorrecta: tras la transición, la adaptación es variable y el riesgo suicida puede persistir. Las demás describen características asociadas o el umbral diagnóstico de adolescentes y adultos. Se elimina el uso erróneo de «betabloqueantes» que figuraba en el texto original.',
  r: dsm5
});

update('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_172', {
  e: '¿Qué afirmación es correcta sobre el curso de la disforia de género según el DSM-5?',
  o: { a: 'La persistencia desde la infancia es mayor en nacidos hombres que en nacidas mujeres.', b: 'En la trayectoria de inicio temprano existe mayor ambivalencia hacia la cirugía y menor satisfacción que en la de inicio tardío.', c: 'La trayectoria de inicio tardío es más frecuente en personas nacidas mujeres.', d: 'En la trayectoria de inicio temprano puede existir un periodo sin disforia, seguido de su reaparición.' },
  c: 'd',
  x: 'El DSM-5 describe que la disforia de comienzo temprano puede continuar o presentar un periodo intermedio de remisión seguido de recurrencia. Los porcentajes de persistencia citados eran mayores en nacidas mujeres; el comienzo tardío se describía con mayor frecuencia en nacidos hombres y con mayor ambivalencia hacia la cirugía.',
  r: dsm5
});

update('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_069', {
  e: 'Según el DSM-5, señale la opción correcta sobre la disforia de género:',
  o: { a: 'La preocupación por el cambio de género solo puede aparecer después de los 5 años.', b: 'En adultos nacidos hombres, la prevalencia se sitúa entre el 0,5 % y el 1 %.', c: 'En Suecia y Francia la proporción por sexo asignado favorece a las personas nacidas mujeres.', d: 'El trastorno del espectro autista es más prevalente entre los adolescentes con disforia de género derivados clínicamente que en la población general.' },
  c: 'd',
  x: 'La opción d es correcta. El DSM-5 describía una mayor prevalencia de TEA entre adolescentes con disforia de género derivados a servicios clínicos. Las cifras de prevalencia de la opción b están sobredimensionadas y los países citados eran Japón y Polonia, no Suecia y Francia.',
  r: dsm5
});

update('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_072', {
  e: 'Respecto al curso evolutivo de la disforia de género en adolescentes y adultos descrito en el DSM-5, señale la opción correcta:',
  o: { a: 'En el inicio temprano, las primeras conductas aparecen generalmente entre los 4 y los 6 años.', b: 'Los nacidos hombres con disforia de inicio tardío pueden mostrar mayor ambivalencia hacia la cirugía y menor satisfacción con ella.', c: 'En personas nacidas mujeres, el curso más habitual es el inicio tardío.', d: 'Cuando coexiste un trastorno del desarrollo sexual suele existir certeza de pertenecer al otro género y la mayoría realiza la transición.' },
  c: 'b',
  x: 'La opción b reproduce la descripción de curso del DSM-5. El inicio temprano suele observarse entre los 2 y 4 años; en personas nacidas mujeres se describía más a menudo el comienzo temprano; y, con trastornos del desarrollo sexual, puede existir incertidumbre y no necesariamente se progresa hacia la transición.',
  r: dsm5
});

update('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_051', {
  e: '¿Cuál de las siguientes afirmaciones sobre la disforia de género recoge el DSM-5?',
  o: { a: 'La persistencia desde la infancia en nacidos hombres oscila entre el 12 % y el 50 %.', b: 'No se describieron alteraciones sistémicas endógenas de hormonas sexuales en individuos 46,XY, mientras que se observaron indicios de andrógenos elevados en algunos individuos 46,XX.', c: 'En adolescentes y adultos nacidos mujeres predomina el comienzo tardío.', d: 'En niños, las conductas relacionadas con la disforia comienzan generalmente entre los 6 y los 8 años.' },
  c: 'b',
  x: 'La opción b recoge el apartado de factores genéticos y fisiológicos del DSM-5. En ese manual, la persistencia del 12-50 % correspondía a nacidas mujeres; en ellas era más común el comienzo temprano; y las conductas infantiles solían iniciarse entre los 2 y 4 años.',
  r: dsm5
});

fs.writeFileSync(path, JSON.stringify(data));
console.log('Auditadas 20 preguntas del bloque 1 de disforia de género.');
