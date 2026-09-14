const fs = require('fs');
const path = 'public/banco/clinica_adultos.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(data.map((q) => [q.id, q]));
const dsm = 'American Psychiatric Association (2022). Manual diagnóstico y estadístico de los trastornos mentales, texto revisado (DSM-5-TR). Editorial Médica Panamericana.';
const dsm5 = 'American Psychiatric Association (2014). Manual diagnóstico y estadístico de los trastornos mentales (DSM-5). Editorial Médica Panamericana, pp. 451-459.';
function u(id, patch) { const q = byId.get(id); if (!q) throw new Error(id); Object.assign(q, patch, { v: 'VALIDADA_ORIGINAL' }); }

u('PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_072', {
  e: 'Según el DSM-5, señale la afirmación correcta sobre la duración de la disforia de género:',
  o: { a: 'Tanto en niños como en adolescentes y adultos se requiere una duración mínima de seis meses.', b: 'En adolescentes y adultos se requieren seis meses, pero en niños doce meses.', c: 'En niños se requieren seis meses, pero en adolescentes y adultos doce meses.', d: 'No se establece una duración mínima.' }, c: 'a',
  x: 'Los dos conjuntos de criterios del DSM-5 exigen que la incongruencia marcada se mantenga durante al menos seis meses. Lo que varía es el número y la formulación de las manifestaciones requeridas.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_056', {
  e: 'Señale la opción correcta sobre las características asociadas a la disforia de género:',
  o: { a: 'Las manifestaciones clínicas de los adolescentes jóvenes pueden parecerse a las de los niños o a las de los adultos.', b: 'En niños es más frecuente que en adultos el deseo patente de eliminar los caracteres sexuales.', c: 'El trastorno del espectro autista es menos prevalente entre adolescentes con disforia de género derivados clínicamente.', d: 'El riesgo suicida siempre remite tras la transición.' }, c: 'a',
  x: 'Las manifestaciones de los adolescentes más jóvenes pueden asemejarse a las infantiles o a las adultas. La disforia anatómica se hace más patente con el desarrollo puberal; el TEA está sobrerrepresentado en muestras clínicas y el riesgo suicida no desaparece necesariamente tras la transición.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_060', {
  e: 'Según la descripción de curso del DSM-5, señale la afirmación correcta:',
  o: { a: 'La mayoría de las personas con trastornos del desarrollo sexual presentan disforia de género.', b: 'Entre quienes no presentan persistencia, la ginefilia en nacidas mujeres es más frecuente que la androfilia en nacidos hombres.', c: 'El comienzo tardío es más frecuente en nacidas mujeres.', d: 'Muchas personas con disforia de comienzo temprano se identifican como heterosexuales después de la transición.' }, c: 'd',
  x: 'El DSM-5 relacionaba el comienzo temprano con atracción hacia personas del mismo sexo asignado al nacer; tras la transición, esta orientación se describía como heterosexual. La conducta de género atípica en trastornos del desarrollo sexual no implica necesariamente disforia y el comienzo tardío se describía con menor frecuencia en nacidas mujeres.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_053', {
  e: '¿Cuál de las siguientes definiciones es correcta?',
  o: { a: 'El género es la identificación interna de una persona como hombre, mujer u otra categoría.', b: 'La identidad de género es exclusivamente el papel público vivido como hombre o mujer.', c: 'La disforia de género es el malestar asociado a la congruencia entre el género experimentado y el asignado.', d: 'Transgénero designa a una persona cuya identidad de género difiere del género asignado al nacer.' }, c: 'd',
  x: 'Transgénero es un término amplio para las personas cuya identidad de género difiere del género asignado. La identidad de género es la identificación interna; el rol o expresión de género es su manifestación social; y la disforia se vincula a la incongruencia, no a la congruencia.', r: dsm
});
u('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_080', {
  e: '¿Cuál de los siguientes es un criterio formulado específicamente para la disforia de género en niños, y no para adolescentes y adultos?',
  o: { a: 'Un marcado disgusto con la propia anatomía sexual.', b: 'Una marcada incongruencia entre el género experimentado y los caracteres sexuales primarios o secundarios.', c: 'Un fuerte deseo de eliminar los propios caracteres sexuales primarios o secundarios.', d: 'Un fuerte deseo de ser tratado como el otro género o como un género alternativo.' }, c: 'a',
  x: 'El «marcado disgusto con la propia anatomía sexual» figura en los criterios infantiles. Las otras formulaciones pertenecen al conjunto de criterios para adolescentes y adultos.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_094', {
  e: 'Respecto al curso de la disforia de género descrito en el DSM-5, señale la opción incorrecta:',
  o: { a: 'La presencia de fetichismo disminuye la probabilidad de disforia de género en hombres con travestismo.', b: 'Las conductas de comienzo temprano suelen aparecer entre los 2 y los 4 años.', c: 'La persistencia infantil descrita era del 2,2-30 % en nacidos varones y del 12-50 % en nacidas mujeres.', d: 'Los nacidos varones con comienzo tardío suelen sentirse atraídos por personas de su mismo sexo asignado al nacer.' }, c: 'd',
  x: 'La d es incorrecta: el patrón de comienzo tardío en nacidos varones se asociaba habitualmente a ginefilia, es decir, atracción por personas del sexo opuesto al asignado al nacer. Las demás opciones recogen la descripción del DSM-5.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_013', {
  e: 'Señale la afirmación correcta sobre la disforia de género según el DSM-5:',
  o: { a: 'Las conductas travestistas con excitación sexual son características del comienzo temprano.', b: 'En determinadas personas 46,XY con trastornos del desarrollo sexual se ha descrito una tasa mayor de disforia y transición de mujer a hombre que de hombre a mujer.', c: 'La persistencia era del 12-50 % en nacidos varones y del 2,2-30 % en nacidas mujeres.', d: 'El grupo de comienzo temprano presenta mayor ambivalencia y menor satisfacción con la cirugía que el de comienzo tardío.' }, c: 'b',
  x: 'La opción b reproduce un dato específico del DSM-5 sobre algunos trastornos del desarrollo sexual. Las conductas travestistas con excitación y la mayor ambivalencia quirúrgica se asociaban al comienzo tardío; los porcentajes de persistencia de la opción c están invertidos.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_079', {
  e: 'Respecto a la disforia de género descrita en el DSM-5, señale la opción correcta:',
  o: { a: 'La persistencia era del 12-50 % en nacidos hombres y del 2,2-30 % en nacidas mujeres.', b: 'La persistencia se correlacionaba de forma intensa con la gravedad basal durante la infancia.', c: 'En determinadas personas 46,XY con trastornos del desarrollo sexual se describió una tasa mayor de disforia y transición de mujer a hombre que de hombre a mujer.', d: 'La preocupación por el cambio de género solo puede aparecer después de los 3-4 años.' }, c: 'c',
  x: 'La c recoge el dato del DSM-5. La asociación entre persistencia y gravedad basal se describía como modesta; los porcentajes de a están invertidos y la preocupación puede aparecer tras los primeros 2-3 años.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_052', {
  e: 'En relación con los factores asociados a la disforia de género descritos en el DSM-5, señale la opción correcta:',
  o: { a: 'En el comienzo tardío, la conducta de género atípica aparece en la etapa preescolar temprana.', b: 'En determinadas personas 46,XY con trastornos del desarrollo sexual se describió una tasa mayor de disforia y transición de mujer a hombre que de hombre a mujer.', c: 'El travestismo fetichista que evoluciona a autoginefilia es característico del comienzo temprano.', d: 'Los nacidos varones con disforia presentan con mayor frecuencia hermanos menores varones.' }, c: 'b',
  x: 'La opción b es correcta. La conducta atípica preescolar corresponde al comienzo temprano; el patrón travestista/autoginefílico se vinculaba al comienzo tardío; y el dato familiar se refería a hermanos mayores, no menores.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_066', {
  t: ['Trastornos por síntomas somáticos y relacionados'],
  e: '¿Cuál de las siguientes afirmaciones sobre la disforia por la integridad corporal de la CIE-11 es correcta?',
  o: { a: 'Se explica por delirios o alucinaciones somáticas acerca de una parte del cuerpo.', b: 'Es más frecuente en hombres homosexuales y suele afectar al lado derecho.', c: 'En estudios clínicos, algunas personas que lograron la discapacidad deseada comunicaron mejor calidad de vida que quienes no la habían logrado.', d: 'El deseo persistente de estar discapacitado comienza típicamente en la adultez temprana.' }, c: 'c',
  x: 'La disforia por la integridad corporal no se explica por psicosis; el deseo suele comenzar en la infancia o adolescencia. En muestras clínicas predominaban hombres, habitualmente heterosexuales, y deseos sobre el lado izquierdo o no dominante. Se ha descrito mejor calidad de vida autoinformada tras conseguir la discapacidad deseada, aunque esto no constituye una recomendación terapéutica.',
  r: 'Organización Mundial de la Salud (2024). CIE-11, 6C21 Disforia por la integridad corporal; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill.'
});
u('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_155', {
  e: 'En la terminología empleada por el DSM-5-TR, ¿a qué se refiere «mujer de género sentido»?',
  o: { a: 'A una persona a la que se asignó el sexo femenino al nacer.', b: 'A una persona a la que se asignó el sexo masculino al nacer.', c: 'A una persona cuyo género experimentado es mujer, con independencia del sexo asignado al nacer.', d: 'A una persona cuyo género experimentado es hombre.' }, c: 'c',
  x: '«Mujer de género sentido» describe a quien se identifica o se siente mujer, independientemente del sexo o género asignado al nacer.', r: dsm
});
u('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_156', {
  e: '¿Con qué trastorno se ha observado una asociación especialmente relevante en menores con disforia de género derivados a servicios clínicos?',
  o: { a: 'Trastorno esquizoafectivo.', b: 'Trastorno del espectro autista.', c: 'Trastorno negativista desafiante.', d: 'Trastorno obsesivo-compulsivo.' }, c: 'b',
  x: 'El trastorno del espectro autista aparece con mayor frecuencia entre niños y adolescentes con disforia de género derivados clínicamente que en la población general.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_072', {
  e: 'Según el DSM-5, ¿cuál de los siguientes criterios pertenece a la disforia de género en niños?',
  o: { a: 'Una marcada incongruencia entre el género experimentado y los caracteres sexuales primarios o secundarios.', b: 'Un fuerte deseo de ser tratado como el otro género.', c: 'Un marcado disgusto con la propia anatomía sexual.', d: 'Una fuerte convicción de poseer los sentimientos y reacciones típicos del otro género.' }, c: 'c',
  x: 'El «marcado disgusto con la propia anatomía sexual» es una de las ocho manifestaciones posibles del criterio A infantil. Las otras opciones reproducen formulaciones del conjunto para adolescentes y adultos.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_077', {
  e: 'Respecto a la disforia de género descrita en el DSM-5, se puede afirmar que:',
  o: { a: 'La prevalencia era menor en adultos nacidos hombres que en adultas nacidas mujeres.', b: 'Los adultos nacidos hombres de comienzo temprano mostraban mayor ambivalencia hacia la cirugía.', c: 'Cuando coexistía un trastorno del desarrollo sexual, la mayoría no progresaba hacia la transición.', d: 'La mayoría de los niños mostraba disforia anatómica.' }, c: 'c',
  x: 'El DSM-5 indicaba que la mayoría de las personas con trastornos del desarrollo sexual no progresaba hacia la transición. La disforia anatómica era minoritaria en niños y aumentaba cerca de la pubertad; la mayor ambivalencia correspondía al comienzo tardío.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_057', {
  e: 'Señale la opción correcta sobre el curso evolutivo de la disforia de género descrito en el DSM-5:',
  o: { a: 'En niños es muy común expresar directamente rechazo de los genitales.', b: 'Sin un trastorno del desarrollo sexual, el comienzo temprano suele producirse entre los 5 y 7 años.', c: 'La persistencia desde la infancia se describía como mayor en nacidas mujeres que en nacidos varones.', d: 'En adolescentes y adultas nacidas mujeres predomina el comienzo tardío.' }, c: 'c',
  x: 'El DSM-5 comunicaba porcentajes de persistencia mayores en nacidas mujeres. El comienzo temprano se sitúa habitualmente entre los 2 y 4 años; el rechazo genital explícito es minoritario en niños y el comienzo tardío era menos frecuente en nacidas mujeres.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_100', {
  t: ['Trastornos parafílicos'],
  e: 'Respecto a la organización de los trastornos parafílicos en el DSM-5, señale la opción correcta:',
  o: { a: 'Pueden agruparse en preferencias de actividad anómalas y preferencias de objetivo anómalas.', b: 'Los trastornos del cortejo y los algolágnicos se basan en preferencias de objetivo anómalas.', c: 'El término «parafilia» debe reservarse a quienes cumplen los criterios A y B.', d: 'Se incluyen con las disfunciones sexuales y la disforia de género en un único capítulo.' }, c: 'a',
  x: 'El DSM-5 distingue trastornos basados en preferencias de actividad anómalas y de objetivo anómalas. Los trastornos del cortejo y algolágnicos pertenecen al primer grupo. Cumplir A y B define un trastorno parafílico, no meramente una parafilia, y el DSM-5 los separa de las disfunciones sexuales y la disforia de género.', r: dsm5
});
u('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_106', {
  e: '¿Cuál de las siguientes afirmaciones corresponde a la disforia de género en niños según el DSM-5?',
  o: { a: 'El criterio A se manifiesta mediante un mínimo de dos características.', b: 'La duración mínima es de tres meses.', c: 'Debe estar presente el poderoso deseo de ser del otro género o la insistencia de serlo.', d: 'Puede especificarse tanto un trastorno del desarrollo sexual como la postransición.' }, c: 'c',
  x: 'En niños se requieren al menos seis características durante seis meses, incluida necesariamente la indicada en c. Puede especificarse un trastorno del desarrollo sexual, pero «postransición» se reserva para adolescentes y adultos.', r: dsm5
});
u('SEPTIEMBRE-DOS-24_COMENTADO_114', {
  e: '¿Cuántas manifestaciones del criterio A exige el DSM-5 para diagnosticar disforia de género en niños y en adolescentes o adultos, respectivamente?',
  o: { a: 'Tres y seis.', b: 'Dos y dos.', c: 'Seis y dos.', d: 'Cuatro y dos.' }, c: 'c',
  x: 'En niños se requieren al menos seis de ocho manifestaciones, incluida obligatoriamente la primera. En adolescentes y adultos se requieren al menos dos de seis.', r: dsm5
});
u('SEPTIEMBRE-UNO-24_COMENTADO_153', {
  e: 'Señale la respuesta correcta sobre la disforia de género según los datos del DSM-5:',
  o: { a: 'En adultas nacidas mujeres, la prevalencia oscilaba entre el 0,005 % y el 0,014 %.', b: 'En adultos nacidos varones, la prevalencia oscilaba entre el 0,002 % y el 0,003 %.', c: 'La persistencia desde la infancia se situaba entre el 12 % y el 50 % en nacidas mujeres.', d: 'El TDAH, y no el TEA, era el trastorno específicamente sobrerrepresentado en menores derivados.' }, c: 'c',
  x: 'El DSM-5 estimaba la persistencia en nacidas mujeres entre el 12 % y el 50 %, frente al 2,2-30 % en nacidos varones. Las cifras de prevalencia de a y b están intercambiadas; la comorbilidad destacada en muestras clínicas era el TEA.', r: dsm5
});
u('Simu 12 comentado_079', {
  t: ['Trastornos del espectro de la esquizofrenia'],
  e: '¿Cuál de las siguientes se considera una señal de mal pronóstico en los trastornos del espectro de la esquizofrenia?',
  o: { a: 'Confusión durante el episodio agudo.', b: 'Predominio de sintomatología paranoide.', c: 'Predominio de sintomatología positiva.', d: 'Pertenencia a una clase socioeconómica baja.' }, c: 'd',
  x: 'Un nivel socioeconómico bajo se asocia estadísticamente con peor curso y pronóstico. La confusión aguda, el predominio de síntomas positivos y la presentación paranoide se han relacionado clásicamente con un pronóstico relativamente más favorable que los síntomas negativos y el deterioro insidioso.',
  r: 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill.'
});

fs.writeFileSync(path, JSON.stringify(data));
console.log('Auditadas 20 preguntas del bloque 2 de disforia de género.');
