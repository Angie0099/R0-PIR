const fs = require('fs');
const path = 'public/banco/tratamientos_adultos.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const topic = 'Tratamiento de la psicosis y esquizofrenia';
const F = 'Fonseca-Pedrero, E. (coord.) (2019). Tratamientos psicológicos para la psicosis. Pirámide.';
const A = 'Bond, G. R. y Drake, R. E. (2015). The critical ingredients of assertive community treatment. World Psychiatry, 14(2), 240–242. https://doi.org/10.1002/wps.20234';
const edits = {
  'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_162': {
    e:'Según el modelo integrador de metacognición aplicado a la psicosis, ¿qué cuatro habilidades se distinguen?',
    o:{a:'Autorreflexividad, teoría de la mente, memoria operativa y estilo atribucional.',b:'Procesamiento emocional, percepción social, atención y estilo atribucional.',c:'Autorreflexividad, comprensión de la mente ajena, descentramiento y dominio.',d:'Percepción emocional, descentramiento, memoria episódica y cognición social.'},c:'c',
    x:'La opción c es correcta: el modelo distingue autorreflexividad, comprensión de la mente ajena, descentramiento y dominio, entendido este último como el uso integrado del conocimiento metacognitivo para afrontar problemas. La a es falsa porque mezcla componentes metacognitivos con memoria operativa y estilo atribucional; la b enumera dominios de cognición social y neurocognición; y la d incorpora memoria episódica, que no forma parte de estas cuatro habilidades.',
    r:'Lysaker, P. H. y Dimaggio, G. (2014). Metacognitive capacities for reflection in schizophrenia: implications for developing treatments. Schizophrenia Bulletin, 40(3), 487–491. https://doi.org/10.1093/schbul/sbu038'
  },
  'PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_093': {
    e:'¿Qué tres dominios constituyen los objetivos nucleares de la terapia de remediación cognitiva para la esquizofrenia descrita por Wykes y Reeder?',
    o:{a:'Percepción social, teoría de la mente y estilo atribucional.',b:'Memoria, atención y funciones ejecutivas.',c:'Velocidad motora, lenguaje expresivo y orientación.',d:'Insight clínico, adherencia farmacológica y habilidades sociales.'},c:'b',
    x:'La opción b es correcta: la CRT se diseñó para trabajar déficits de memoria, atención y funciones ejecutivas mediante práctica y estrategias cognitivas. La a corresponde a dominios de cognición social; la c reúne funciones que no definen el núcleo de este programa; y la d alude a objetivos clínicos o funcionales de otras intervenciones, no a los dominios cognitivos entrenados directamente por la CRT.',
    r:'Wykes, T. y Reeder, C. (2005). Cognitive Remediation Therapy for Schizophrenia: Theory and Practice. Routledge; '+F+', pp. 214–219.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_151': {
    e:'En REHACOP, ¿cómo se denomina el enfoque que entrena los procesos cognitivos desde los niveles más básicos hacia los de mayor complejidad?',
    o:{a:'Top-down.',b:'Bottom-up.',c:'Procesamiento en paralelo.',d:'Compensación exclusivamente ambiental.'},c:'b',
    x:'La opción b es correcta: REHACOP sigue una progresión bottom-up, comenzando por procesos básicos y avanzando hacia funciones más complejas. La a supone partir de metas o procesos superiores para modular los inferiores; la c no expresa una jerarquía progresiva; y la d describe una adaptación del entorno, no el entrenamiento cognitivo graduado del programa.',
    r:F+', p. 218.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_154': {
    e:'En el modelo de rehabilitación orientado a las fortalezas, ¿qué práctica es congruente con la recuperación personal?',
    o:{a:'Situar la integración comunitaria normalizada como objetivo central.',b:'Priorizar la protección profesional aunque limite la autodeterminación.',c:'Reducir el apoyo entre iguales para evitar dependencia del grupo.',d:'Basar la relación terapéutica en el control del riesgo y la obediencia.'},c:'a',
    x:'La opción a es correcta: la práctica orientada a la recuperación promueve participación comunitaria, elección y una vida significativa. La b es falsa porque la protección no debe sustituir la autonomía; la c contradice el valor del apoyo mutuo; y la d describe una relación paternalista y centrada en el control, incompatible con el enfoque de fortalezas.',
    r:F+', p. 369.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_084': {
    e:'¿Para qué población clínica se desarrollaron las aplicaciones móviles ClinTouch, FOCUS, Temstem y WellWave?',
    o:{a:'Personas con trastornos psicóticos.',b:'Personas con trastorno bipolar exclusivamente.',c:'Personas con depresión mayor exclusivamente.',d:'Niños con TDAH.'},c:'a',
    x:'La opción a es correcta: estas herramientas se desarrollaron para evaluación, autocuidado o apoyo en personas con psicosis. La b y la c son falsas porque no constituyen su población diana exclusiva; y la d es falsa porque no son aplicaciones específicas para TDAH infantil.',
    r:F+', pp. 532–533.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_087': {
    e:'Señale la afirmación INCORRECTA sobre la terapia de remediación cognitiva (CRT) para la esquizofrenia:',
    o:{a:'Trabaja déficits de atención, memoria y funciones ejecutivas.',b:'Su rasgo definitorio es la preservación neuroprotectora del volumen de sustancia gris demostrada para la terapia de potenciación cognitiva.',c:'Utiliza práctica cognitiva y aprendizaje de estrategias.',d:'Busca que las mejoras cognitivas se transfieran al funcionamiento cotidiano.'},c:'b',
    x:'La opción b es la incorrecta: la evidencia de preservación de sustancia gris citada corresponde a la terapia de potenciación cognitiva (CET), no define la CRT. La a es correcta porque recoge sus dominios nucleares; la c es correcta porque la CRT combina práctica y estrategias; y la d es correcta porque la generalización funcional es un objetivo esencial, especialmente cuando se integra con rehabilitación psicosocial.',
    r:'Wykes, T. y Reeder, C. (2005). Cognitive Remediation Therapy for Schizophrenia. Routledge; Eack, S. M. et al. (2010). Neuroprotective effects of cognitive enhancement therapy. Archives of General Psychiatry, 67(7), 674–682. https://doi.org/10.1001/archgenpsychiatry.2010.63'
  },
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_104': {
    e:'¿Cuál de los siguientes programas multimodales para psicosis temprana incorpora explícitamente una perspectiva transdiagnóstica?',
    o:{a:'McLean OnTrack, versión abreviada.',b:'Programa 2000.',c:'MOVE.',d:'NAVIGATE.'},c:'a',
    x:'La opción a es correcta: McLean OnTrack abreviado se describe con orientación transdiagnóstica. La b es falsa porque el Programa 2000 es un servicio integrado para primeros episodios; la c se centra en motivación y compromiso en personas con psicosis; y la d es una intervención coordinada especializada para primer episodio psicótico dentro del proyecto RAISE, no se define por esa perspectiva transdiagnóstica.',
    r:'Fonseca-Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, pp. 281–282.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_121': {
    e:'¿Qué enfoque para las crisis psicóticas se asocia principalmente con Jaakko Seikkula y sus colaboradores?',
    o:{a:'Diálogo Abierto.',b:'MERIT.',c:'Terapia AVATAR.',d:'HORYZONS.'},c:'a',
    x:'La opción a es correcta: Seikkula es uno de los principales desarrolladores del Diálogo Abierto, basado en respuesta inmediata, red social y diálogo en reuniones compartidas. La b es falsa porque MERIT se vincula a Lysaker y colaboradores; la c se desarrolló para el trabajo con voces mediante una representación digital; y la d es una intervención social digital para jóvenes tras un primer episodio psicótico.',
    r:'Seikkula, J. y Olson, M. E. (2003). The Open Dialogue approach to acute psychosis. Family Process, 42(3), 403–418. https://doi.org/10.1111/j.1545-5300.2003.00403.x'
  },
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_062': {
    e:'¿Qué programa de atención especializada coordinada para el primer episodio psicótico se desarrolló en el proyecto RAISE y ofrece sus componentes durante un periodo de hasta dos años?',
    o:{a:'MOVE.',b:'Programa 2000.',c:'NAVIGATE.',d:'PIENSA.'},c:'c',
    x:'La opción c es correcta: NAVIGATE fue desarrollado dentro de RAISE e integra tratamiento farmacológico individualizado, psicoeducación familiar, terapia individual orientada a la resiliencia y apoyo al empleo y la educación. La a es falsa porque MOVE aborda motivación y compromiso; la b no pertenece al proyecto RAISE; y la d es un programa español diferente para primeros episodios.',
    r:'Mueser, K. T. et al. (2015). The NAVIGATE program for first-episode psychosis. Psychiatric Services, 66(7), 680–690. https://doi.org/10.1176/appi.ps.201400413'
  },
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_091': {
    e:'¿Cuál de las siguientes es una aplicación móvil de evaluación y apoyo para personas con trastornos psicóticos?',
    o:{a:'HORYZONS.',b:'ClinTouch.',c:'MONARCA.',d:'ORBIT.'},c:'b',
    x:'La opción b es correcta: ClinTouch es una aplicación de evaluación momentánea y seguimiento de síntomas en psicosis. La a es una plataforma de terapia social online moderada; la c se desarrolló para el trastorno bipolar; y ORBIT se ha utilizado como intervención digital para síntomas bipolares, por lo que no son la aplicación específica solicitada.',
    r:'Palmier-Claus, J. E. et al. (2012). The feasibility and validity of ambulatory self-report of psychotic symptoms using a smartphone software application. BMC Psychiatry, 12, 172. https://doi.org/10.1186/1471-244X-12-172'
  },
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_178': {
    e:'¿A qué población se dirige principalmente HORYZONS?',
    o:{a:'Personas con trastorno bipolar estable.',b:'Jóvenes en recuperación tras un primer episodio psicótico.',c:'Personas con depresión resistente.',d:'Personas con TOC crónico.'},c:'b',
    x:'La opción b es correcta: HORYZONS es una intervención social online moderada diseñada para sostener la recuperación y el funcionamiento social tras un primer episodio psicótico. La a, c y d son falsas porque no corresponden a la población diana para la que se desarrolló el programa.',
    r:'Alvarez-Jimenez, M. et al. (2013). On the HORYZON: moderated online social therapy for long-term recovery in first episode psychosis. Schizophrenia Research, 143(1), 143–149. https://doi.org/10.1016/j.schres.2012.11.009'
  },
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_178': {
    e:'En la Terapia Neurocognitiva Integrada (INT), ¿qué dominios se trabajan en el primer módulo de neurocognición?',
    o:{a:'Memoria operativa y planificación.',b:'Aprendizaje verbal y memoria visual.',c:'Razonamiento y solución de problemas.',d:'Velocidad de procesamiento y atención/vigilancia.'},c:'d',
    x:'La opción d es correcta: la INT progresa desde dominios básicos y comienza por velocidad de procesamiento y atención/vigilancia. La a corresponde a un dominio posterior; la b aborda aprendizaje y memoria; y la c reúne procesos ejecutivos más complejos, por lo que ninguna describe el primer módulo.',
    r:F+', pp. 279 y 283; Roder, V. y Mueller, D. R. (2015). Integrated Psychological Therapy (IPT). Hogrefe.'
  },
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_155': {
    e:'¿Cuál de los siguientes se ha identificado como ingrediente asociado a una mayor fidelidad y eficacia del Tratamiento Asertivo Comunitario?',
    o:{a:'Un equipo multidisciplinar con participación psiquiátrica y baja ratio profesional-usuarios.',b:'Derivar la mayor parte de la atención a consultas externas convencionales.',c:'Limitar las visitas domiciliarias a situaciones de crisis.',d:'Mantener una casuística amplia por profesional para aumentar cobertura.'},c:'a',
    x:'La opción a es correcta: la composición multidisciplinar, la baja ratio y la prestación directa de servicios son rasgos de alta fidelidad del TAC. La b es falsa porque el equipo asume la atención de forma activa; la c es falsa porque el contacto comunitario y domiciliario es regular; y la d invierte el principio de baja casuística que permite intensidad asistencial.',r:A
  },
  'SEPTIEMBRE-DOS-24_COMENTADO_163': {
    e:'¿Cuál de los siguientes es un módulo de neurocognición de la Terapia Neurocognitiva Integrada (INT)?',
    o:{a:'Percepción social.',b:'Razonamiento y solución de problemas.',c:'Atribución social.',d:'Esquemas sociales.'},c:'b',
    x:'La opción b es correcta: razonamiento y solución de problemas pertenece al bloque neurocognitivo. La a, c y d son falsas porque percepción social, atribución y esquemas sociales se trabajan como dominios de cognición social.',r:F+', pp. 279–283.'
  },
  'SEPTIEMBRE-DOS-24_COMENTADO_169': {
    e:'Según la secuencia descrita para la Terapia Centrada en la Compasión aplicada a la psicosis, ¿cuál NO constituye una de sus fases específicas?',
    o:{a:'Psicoeducación y despersonalización del problema.',b:'Formulación compartida.',c:'Construcción de capacidades compasivas en torno al sentido de identidad.',d:'Prevención de recaídas mediante identificación de pródromos como fase independiente.'},c:'d',
    x:'La opción d es correcta porque la identificación de pródromos y prevención de recaídas no aparece como una fase independiente de esta secuencia de CFT. La a sí corresponde a la fase psicoeducativa; la b al proceso de formulación; y la c al cultivo de una identidad y una mente compasivas.',
    r:'Braehler, C. et al. (2013). Exploring change processes in compassion focused therapy in psychosis. British Journal of Clinical Psychology, 52(2), 199–214. https://doi.org/10.1111/bjc.12009'
  },
  'SIM_ABR2_040': {
    e:'En el Tratamiento Asertivo Comunitario, ¿dónde se presta preferentemente la atención?',
    o:{a:'En el entorno comunitario habitual de la persona.',b:'Exclusivamente durante ingresos hospitalarios.',c:'Solo en una consulta ambulatoria programada.',d:'Únicamente mediante atención telefónica.'},c:'a',
    x:'La opción a es correcta: el TAC lleva los servicios al medio natural de la persona mediante un equipo móvil. La b es falsa porque busca reducir hospitalizaciones; la c es falsa porque no se limita a consulta; y la d es falsa porque el contacto directo comunitario es un componente esencial.',r:A
  },
  'SIM_ABR2_130': {
    e:'¿Qué organización asistencial caracteriza al Tratamiento Asertivo Comunitario?',
    o:{a:'Un equipo multidisciplinar comparte la responsabilidad sobre una casuística reducida.',b:'Cada profesional trabaja de forma aislada con una casuística extensa.',c:'La atención se limita a intervenciones psicoterapéuticas grupales.',d:'El equipo interviene únicamente cuando se produce una hospitalización.'},c:'a',
    x:'La opción a es correcta: el trabajo en equipo, la responsabilidad compartida y la baja ratio permiten atención intensiva y continuada. La b contradice el modelo; la c es falsa porque integra múltiples servicios; y la d es falsa porque actúa proactivamente en la comunidad y no solo durante ingresos.',r:A
  },
  'SIM_ABR25_146': {
    e:'¿Cuál es una finalidad clínica central del Tratamiento Asertivo Comunitario en personas con trastorno mental grave?',
    o:{a:'Reducir hospitalizaciones evitables y favorecer la permanencia en la comunidad.',b:'Sustituir toda intervención psicosocial por farmacoterapia.',c:'Aumentar los ingresos programados para asegurar adherencia.',d:'Restringir la atención a pacientes con buen funcionamiento autónomo.'},c:'a',
    x:'La opción a es correcta: el TAC busca sostener a personas con necesidades complejas en la comunidad y disminuir hospitalizaciones. La b es falsa porque el abordaje es integral; la c invierte su finalidad; y la d es falsa porque se dirige especialmente a personas con alta discapacidad y uso repetido de servicios.',r:A
  },
  'SIM_PERS_AGO25_036': {
    e:'¿Qué rasgo diferencia al Tratamiento Asertivo Comunitario de la atención ambulatoria convencional?',
    o:{a:'Interpretación exclusiva de conflictos infantiles.',b:'Hospitalización preventiva prolongada.',c:'Prestación proactiva, intensiva y multidisciplinar de servicios en la comunidad.',d:'Entrenamiento grupal limitado al insight.'},c:'c',
    x:'La opción c es correcta: el TAC ofrece atención activa e integrada en el contexto comunitario. La a no forma parte del modelo; la b contradice su objetivo de evitar ingresos; y la d reduce indebidamente un programa integral a una única modalidad grupal.',r:A
  },
  'Simu 11 comentado_161': {
    e:'¿Cuál de los siguientes NO es un objetivo característico de la Terapia de Aceptación y Compromiso aplicada a la psicosis?',
    o:{a:'Cuestionar la utilidad de las estrategias rígidas de control experiencial.',b:'Refutar directamente el contenido de delirios y alucinaciones hasta demostrar que es falso.',c:'Favorecer el distanciamiento o defusión respecto del lenguaje.',d:'Promover una perspectiva del yo como contexto, distinta del contenido de las experiencias.'},c:'b',
    x:'La opción b es correcta porque ACT no tiene como objetivo central disputar o refutar literalmente el contenido psicótico, sino modificar la relación con la experiencia. La a sí se vincula a la desesperanza creativa; la c corresponde a la defusión cognitiva; y la d al yo como contexto.',
    r:'Bach, P. y Hayes, S. C. (2002). The use of acceptance and commitment therapy to prevent the rehospitalization of psychotic patients. Journal of Consulting and Clinical Psychology, 70(5), 1129–1139. https://doi.org/10.1037/0022-006X.70.5.1129'
  }
};
let changed=0;
for (const [id, patch] of Object.entries(edits)) {
  const q=bank.find(x=>x.id===id);
  if(!q) throw new Error('Missing '+id);
  if(!q.t?.includes(topic)) throw new Error('Wrong topic '+id);
  Object.assign(q, patch, {v:'VALIDADA_ORIGINAL'});
  changed++;
}
if(changed!==20) throw new Error('Expected 20, got '+changed);
fs.writeFileSync(path, JSON.stringify(bank)+'\n');
const pending=bank.filter(x=>x.t?.includes(topic)&&(!x.v||x.v==='REVISAR')).length;
console.log(JSON.stringify({changed,pending,total:bank.length},null,2));
