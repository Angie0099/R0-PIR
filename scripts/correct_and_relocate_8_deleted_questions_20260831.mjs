import fs from 'node:fs';
const dir='public/banco';
const files={
  'Psicología Clínica':'psicologia_clinica.json',
  'Tratamientos Adultos':'tratamientos_adultos.json',
  'Evaluación Psicológica':'evaluacion_psicologica.json',
  'Psicología de la Personalidad y Diferencial':'psicologia_de_la_personalidad_y_diferencial.json'
};
const banks=Object.fromEntries(Object.entries(files).map(([s,f])=>[s,JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8'))]));
const locate=id=>{for(const [s,b] of Object.entries(banks)){const i=b.findIndex(q=>q.id===id);if(i>=0)return{s,b,i,q:b[i]}}throw new Error(`No existe ${id}`)};
const set=(id,data,targetSubject,targetTopic)=>{const h=locate(id);Object.assign(h.q,data,{v:'VALIDADA_ORIGINAL'});if(targetSubject){h.b.splice(h.i,1);h.q.s=targetSubject;h.q.t=[targetTopic];banks[targetSubject].push(h.q)}else if(targetTopic)h.q.t=[targetTopic]};
const bellochI='Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw Hill.';

set('SmCm09PIR2025_157',{
 e:'Según la clasificación de Reed sobre experiencias anómalas del yo, las experiencias de revelación -como creer recibir información divina, telepática o procedente de médiums-, cuando no implican necesariamente patología, se clasifican como:',
 o:{a:'Confusión de los límites del yo.',b:'Pérdida de atribución personal.',c:'Deterioro de la unidad del yo.',d:'Pérdida de la experiencia de realidad.'},c:'b',
 x:'La b es correcta: en estas experiencias la persona atribuye a una fuente externa contenidos que experimenta, por lo que Reed las sitúa en la pérdida de atribución personal. La a se refiere a una delimitación yo-no yo alterada; la c, a la vivencia de fragmentación o falta de unidad; y la d, a cambios en la cualidad de realidad de la experiencia. Una experiencia culturalmente aceptada no debe considerarse patológica sin valorar contexto, convicción, malestar y deterioro.',
 r:bellochI+', capítulo de patología de la conciencia; Reed, G. (1988). The Psychology of Anomalous Experience. Prometheus Books.'
},null,'Patología de la conciencia');

set('SmCm20PIR2025 (1)_081',{
 e:'Según la teoría transdiagnóstica de Fairburn et al. (2003) para los trastornos de la conducta alimentaria, ¿cuál NO pertenece a los cuatro procesos mantenedores adicionales?',
 o:{a:'Perfeccionismo clínico.',b:'Baja autoestima nuclear.',c:'Intolerancia a la incertidumbre.',d:'Dificultades interpersonales.'},c:'c',
 x:'La c es correcta porque la intolerancia a la incertidumbre no integra los cuatro procesos adicionales del modelo. Estos son perfeccionismo clínico, baja autoestima nuclear, intolerancia a los estados de ánimo o emocional y dificultades interpersonales; por ello a, b y d sí pertenecen al modelo. La formulación anterior confundía intolerancia emocional con intolerancia a la incertidumbre y tenía la clave equivocada.',
 r:'Fairburn, C. G., Cooper, Z. y Shafran, R. (2003). Cognitive behaviour therapy for eating disorders: a transdiagnostic theory and treatment. Behaviour Research and Therapy, 41, 509-528. https://doi.org/10.1016/S0005-7967(02)00088-8; Fonseca-Pedrero, E. (coord.). Manual de tratamientos psicológicos: adultos. Pirámide, cap. 4.'
},'Tratamientos Adultos','Tratamientos transdiagnósticos');

set('Simu 32 comentado hardcore 2_110',{
 e:'¿Cuál de las siguientes NO es una manifestación característica del síndrome de Cotard?',
 o:{a:'Creer que un órgano ha dejado de funcionar o que no existe.',b:'Presentarse en cuadros depresivos graves con síntomas psicóticos.',c:'Negar la propia existencia, la vida o partes del cuerpo.',d:'Experimentar un miedo intenso y persistente a ser abandonado por los seres queridos.'},c:'d',
 x:'La d es correcta porque el temor al abandono no define el síndrome de Cotard y se asocia a otros problemas clínicos. La a refleja delirios nihilistas relativos a órganos; la b sitúa correctamente su asociación clásica con depresión psicótica grave, aunque también puede aparecer en otros cuadros; y la c recoge la negación nihilista de la propia existencia.',
 r:bellochI+', capítulo de psicopatología del pensamiento; Vallejo Ruiloba, J. (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier.'
},null,'Psicopatología del pensamiento');

set('Simu 12 comentado_113',{
 e:'¿Qué modelo etiológico en psicopatología destaca la desintegración social y los conflictos sociales estructurales como posibles causas de los problemas psicológicos?',
 o:{a:'Modelo evolucionista.',b:'Modelo cognitivo.',c:'Modelo macrosocial.',d:'Modelo microsocial.'},c:'c',
 x:'La c es correcta: los modelos macrosociales atienden a procesos estructurales como desorganización, desigualdad, alienación y conflicto social. El evolucionista explica funciones y desajustes desde la adaptación; el cognitivo se centra en procesos de información y creencias; y el microsocial analiza interacciones próximas, redes y relaciones inmediatas, no la estructura social amplia.',
 r:bellochI+', capítulo de modelos en psicopatología.'
},null,'Modelos en psicopatología');

set('SmCm14PIR2025_107',{
 e:'Según la literatura clásica sobre diferencias asociadas al bilingüismo, ¿cuál NO se considera una característica distintiva general de las personas bilingües?',
 o:{a:'Mayor independencia de campo.',b:'Mejores aptitudes aritméticas por el mero hecho de ser bilingüe.',c:'Mostrar matices distintos de la personalidad según el idioma utilizado.',d:'Mayor fluidez, flexibilidad y originalidad en determinadas tareas.'},c:'b',
 x:'La b es correcta: el bilingüismo por sí solo no implica una aptitud aritmética superior. La a se ha relacionado con mayor independencia de campo; la c recoge efectos del contexto lingüístico sobre la expresión de la personalidad; y la d resume ventajas descritas en algunas medidas de creatividad y flexibilidad. Son tendencias grupales condicionadas por competencia lingüística, contexto educativo y nivel sociocultural, no rasgos universales.',
 r:'Colom, R. (2018). Manual de psicología diferencial. Pirámide, apartado sobre bilingüismo y diferencias intergrupales.'
},'Psicología de la Personalidad y Diferencial','Diferencias intergrupales II: raza, clase social y bilingüismo');

set('SmCm15PIR2025_086',{
 e:'¿Qué instrumento clásico proporciona una edad social y permite calcular un cociente de desarrollo o madurez social?',
 o:{a:'Escala de Madurez Social de Vineland.',b:'Escala de Desarrollo Psicosocial de Hurtig y Zazzo.',c:'Cuadros PAC para la Evaluación del Desarrollo Social de Gunzburg.',d:'Sistema de Evaluación y Seguimiento de Virginia Occidental (WVAATS).'},c:'a',
 x:'La a es correcta: la Escala de Madurez Social de Vineland permite obtener una edad social y derivar un cociente social comparándola con la edad cronológica. La escala de Hurtig y Zazzo evalúa desarrollo psicosocial; los cuadros PAC describen repertorios y progresos adaptativos; y WVAATS es un sistema de evaluación y seguimiento, pero ninguno de estos tres define el cociente social clásico de Vineland.',
 r:'Doll, E. A. (1935). Vineland Social Maturity Scale. American Guidance Service; Fernández-Ballesteros, R. (2011). Evaluación psicológica: conceptos, métodos y estudio de casos. Pirámide.'
},'Evaluación Psicológica','Evaluación infantil');

set('SM_MAYO_1_SOL_1_075',{
 e:'Una persona afirma: «Me dolía mucho el dedo gordo del pie que me habían amputado después del accidente». ¿Cómo se clasifica esta experiencia alucinatoria?',
 o:{a:'Corporal, somática o cenestésica.',b:'Táctil o háptica.',c:'Cinestésica o de movimiento.',d:'Visual.'},c:'a',
 x:'La a es correcta: la vivencia procede de una parte del propio cuerpo y corresponde al fenómeno de miembro fantasma, incluido entre las experiencias corporales o cenestésicas. La b se refiere a sensaciones de contacto sobre la piel; la c implica percepción de movimiento sin movimiento real; y la d requiere una percepción visual inexistente.',
 r:bellochI+', capítulo de psicopatología de la sensopercepción, apartado de alucinaciones corporales o cenestésicas.'
},null,'Psicopatología de la sensopercepción');

set('Simu 15 comentado_113',{
 e:'Tras una vivencia humillante o estresante, una persona de carácter sensible comienza a interpretar que su círculo habitual la desplaza, la observa y la menosprecia. ¿Qué fenómeno describe mejor?',
 o:{a:'Delirio sensitivo de relación.',b:'Delirio de significación.',c:'Delirio nihilista.',d:'Idea delirante primaria de autorreferencia sin relación con una vivencia precipitante.'},c:'a',
 x:'La a es correcta: el delirio sensitivo de relación se desarrolla reactivamente sobre una vivencia de humillación o fracaso en una personalidad sensible y gira en torno al menosprecio del entorno próximo. La b atribuye significados especiales a hechos neutros sin ese patrón sensitivo; la c niega existencia, órganos o mundo; y la d omite precisamente el vínculo comprensible con la experiencia precipitante.',
 r:'Vallejo Ruiloba, J. (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier, psicopatología del pensamiento; '+bellochI
},null,'Psicopatología del pensamiento');

// Corrige dos copias cercanas para evitar claves y explicaciones contradictorias en el banco.
set('PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_043',{
 e:'¿Cuál de los siguientes ejemplos corresponde a una alucinación táctil o háptica?',
 o:{a:'«Siento que mis órganos se han convertido en agua».',b:'«Veo una figura detrás de mí».',c:'«Noto insectos que se arrastran por mi piel».',d:'«Siento que mi pierna gira aunque permanece inmóvil».'},c:'c',
 x:'La c es correcta porque describe una sensación de contacto cutáneo sin estímulo. La a es corporal o cenestésica; la b es visual y extracampina; y la d es cinestésica, al implicar movimiento corporal inexistente.',
 r:bellochI+', capítulo de psicopatología de la sensopercepción.'
},null,'Psicopatología de la sensopercepción');

set('SmCm15PIR2025_092',{
 e:'¿Qué rasgo diferencia mejor el delirio sensitivo de relación de una idea delirante primaria de autorreferencia?',
 o:{a:'Su desarrollo comprensible tras una vivencia de humillación o fracaso en una personalidad sensible.',b:'La negación de la propia existencia.',c:'La creencia de poseer poderes extraordinarios.',d:'La ausencia total de relación con acontecimientos biográficos.'},c:'a',
 x:'La a es correcta: el delirio sensitivo de relación presenta una conexión reactiva y comprensible con vivencias de vergüenza, humillación o fracaso. La b describe contenido nihilista; la c, grandioso; y la d caracteriza mejor la incomprensibilidad de una idea delirante primaria, no el desarrollo sensitivo.',
 r:'Vallejo Ruiloba, J. (2025). Introducción a la psicopatología y la psiquiatría (9.ª ed.). Elsevier.'
},null,'Psicopatología del pensamiento');

for(const [s,f] of Object.entries(files))fs.writeFileSync(`${dir}/${f}`,JSON.stringify(banks[s]));
const mp=`${dir}/manifest.json`;const m=JSON.parse(fs.readFileSync(mp,'utf8'));
for(const [s,b] of Object.entries(banks)){m.subjects[s].count=b.length;if(!m.subjects[s].topics.includes(topicFor(s))){} }
function topicFor(){return''}
m.total=Object.values(m.subjects).reduce((n,s)=>n+s.count,0);
fs.writeFileSync(mp,JSON.stringify(m,null,2)+'\n');
console.log('Corregidas 8 preguntas y 2 duplicados relacionados.');
