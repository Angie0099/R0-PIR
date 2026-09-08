const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));

const DSM = 'American Psychiatric Association (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.; DSM-5-TR), capítulo «Obsessive-Compulsive and Related Disorders». American Psychiatric Association Publishing.';
const BEL = 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), cap. 5, «Trastorno obsesivo-compulsivo y trastornos relacionados», pp. 155-228. McGraw Hill.';
const ICD = 'World Health Organization (2024). ICD-11 for Mortality and Morbidity Statistics, bloque «Obsessive-compulsive or related disorders» (6B20-6B25). https://icd.who.int/browse/2024-01/mms/en';
const OCCWG = 'Obsessive Compulsive Cognitions Working Group (1997). Cognitive assessment of obsessive-compulsive disorder. Behaviour Research and Therapy, 35(7), 667-681; Obsessive Compulsive Cognitions Working Group (2005). Psychometric validation of the Obsessive Beliefs Questionnaire and Interpretation of Intrusions Inventory—Part 2. Behaviour Research and Therapy, 43(11), 1527-1542.';

const U = {
  'ABRIL-UNO-24_COMENTADO_135': {
    e: 'Al comparar la clasificación del TOC en el DSM-5-TR y la CIE-11, señale la afirmación correcta:',
    o: {a:'Ambos sistemas gradúan el insight mediante tres especificadores idénticos.', b:'La CIE-11 no permite especificar el insight porque lo considera variable durante el curso.', c:'El DSM-5-TR distingue únicamente insight conservado frente a ausente.', d:'La CIE-11 diferencia insight bueno o aceptable de insight pobre o ausente, mientras el DSM-5-TR emplea tres grados.'}, c:'d',
    x:'La d es correcta: la CIE-11 utiliza dos categorías de insight, mientras el DSM-5-TR distingue insight bueno/aceptable, pobre y ausente/con creencias delirantes. La a es falsa porque los sistemas no usan tres grados idénticos. La b es falsa porque la CIE-11 sí permite calificar el insight. La c reduce erróneamente los tres especificadores del DSM-5-TR a una dicotomía.', r:`${DSM} ${ICD}`
  },
  'ABRIL-UNO-24_COMENTADO_136': {
    e:'En el modelo cognitivo de Rachman, ¿qué fenómeno designa una sensación interna de suciedad que puede surgir sin contacto físico con un contaminante?',
    o:{a:'Fusión pensamiento-acción moral.',b:'Responsabilidad inflada.',c:'Efecto de contraste emocional.',d:'Polución mental.'},c:'d',
    x:'La d es correcta: Rachman denominó «polución mental» a la vivencia de suciedad interna que puede ser provocada por pensamientos, recuerdos o experiencias, sin contacto material. La a consiste en equiparar moralmente pensar y actuar. La b alude a creer que se posee un poder decisivo para causar o impedir daños. La c no es el concepto con el que Rachman describió este fenómeno.',r:`${BEL} Rachman, S. (1994). Pollution of the mind. Behaviour Research and Therapy, 32(3), 311-314.`
  },
  'DICIEMBRE-DOS-24_COMENTADO_024': {
    e:'En el trastorno dismórfico corporal, ¿qué trastorno comórbido se presenta con mayor frecuencia a lo largo de la vida?',
    o:{a:'Trastorno de ansiedad por enfermedad.',b:'Trastorno de ansiedad social.',c:'Trastorno obsesivo-compulsivo.',d:'Trastorno depresivo mayor.'},c:'d',
    x:'La d es correcta: el trastorno depresivo mayor es la comorbilidad más frecuente del trastorno dismórfico corporal y suele comenzar después de este. La ansiedad social y el TOC son asociaciones relevantes, pero no superan al trastorno depresivo mayor. El trastorno de ansiedad por enfermedad puede compartir preocupación corporal, aunque no es la comorbilidad predominante.',r:DSM
  },
  'DICIEMBRE-DOS-24_COMENTADO_026': {
    e:'¿Qué condición sitúa la CIE-11 dentro de los trastornos obsesivo-compulsivos y relacionados, mientras que el DSM-5-TR la clasifica entre los trastornos de síntomas somáticos y relacionados?',
    o:{a:'Trastorno de acumulación.',b:'Trastorno de excoriación.',c:'Trastorno dismórfico corporal.',d:'Hipocondría o trastorno de ansiedad por enfermedad.'},c:'d',
    x:'La d es correcta: la CIE-11 incluye la hipocondría en el grupo obsesivo-compulsivo y relacionado; su equivalente principal en el DSM-5-TR, el trastorno de ansiedad por enfermedad, está en síntomas somáticos y relacionados. La acumulación, la excoriación y el trastorno dismórfico corporal aparecen dentro del capítulo obsesivo-compulsivo en ambos sistemas, por lo que a, b y c no expresan la diferencia solicitada.',r:`${DSM} ${ICD}`
  },
  'DICIEMBRE-DOS-24_COMENTADO_027': {
    e:'Según el Obsessive Compulsive Cognitions Working Group (OCCWG), ¿cuál NO constituye uno de los dominios de creencias disfuncionales vinculados al TOC?',
    o:{a:'Sensibilidad a las sensaciones de ansiedad.',b:'Responsabilidad inflada y sobreestimación de la amenaza.',c:'Perfeccionismo e intolerancia a la incertidumbre.',d:'Sobrevaloración y necesidad de controlar los pensamientos.'},c:'a',
    x:'La a es correcta porque la sensibilidad a la ansiedad es un constructo transdiagnóstico, pero no uno de los seis dominios consensuados por el OCCWG. La b reúne responsabilidad inflada y sobreestimación de amenaza; la c reúne perfeccionismo e intolerancia a la incertidumbre; y la d recoge importancia atribuida a los pensamientos y necesidad de controlarlos: todos ellos sí forman parte del modelo.',r:`${BEL} ${OCCWG}`
  },
  'DICIEMBRE-UNO-24_COMENTADO_082': {
    e:'Respecto al especificador «relacionado con tics» del TOC, señale la afirmación correcta:',
    o:{a:'Se reserva a quien presenta tics simultáneamente durante toda la evolución del TOC.',b:'Es más característico del TOC femenino de inicio adulto y predice ausencia de compulsiones.',c:'Exige que se cumplan en la actualidad todos los criterios de trastorno de Tourette.',d:'Puede aplicarse cuando existe historia actual o pasada de un trastorno de tics, y el perfil sintomático puede diferir del TOC sin esa historia.'},c:'d',
    x:'La d es correcta: el DSM-5-TR exige una historia actual o pasada de trastorno de tics, no necesariamente tics activos, y reconoce diferencias clínicas respecto al TOC no relacionado con tics. La a exige erróneamente simultaneidad permanente. La b invierte el patrón, más asociado a varones y comienzo temprano, y además no excluye compulsiones. La c restringe indebidamente el especificador al Tourette actual.',r:`${DSM} ${BEL}`
  },
  'DICIEMBRE-UNO-24_COMENTADO_083': {
    e:'En el modelo del OCCWG, ¿cuál de los siguientes contenidos pertenece a un dominio distinto de la sobrevaloración de la importancia de los pensamientos?',
    o:{a:'Interpretar la mera aparición de un pensamiento como personalmente significativa.',b:'Equiparar moralmente tener un pensamiento inaceptable con realizar la acción.',c:'Creer que es posible y necesario ejercer un control completo sobre los pensamientos.',d:'Creer que pensar en un suceso aumenta la probabilidad de que ocurra.'},c:'c',
    x:'La c es correcta: describe el dominio diferenciado de importancia/necesidad de controlar los pensamientos. La a expresa la sobrevaloración de la mera presencia del pensamiento. La b es fusión pensamiento-acción moral y la d fusión pensamiento-acción de probabilidad; ambas son manifestaciones de la importancia excesiva atribuida a los pensamientos.',r:`${BEL} ${OCCWG}`
  },
  'DICIEMBRE-UNO-24_COMENTADO_084': {
    e:'Una persona con trastorno dismórfico corporal admite que podría equivocarse, pero considera que su creencia sobre el defecto es probablemente verdadera. ¿Qué especificador de insight corresponde según el DSM-5-TR?',
    o:{a:'Con introspección buena o aceptable.',b:'Con poca introspección.',c:'Con ausencia de introspección o creencias delirantes.',d:'No procede aplicar un especificador de insight.'},c:'b',
    x:'La b es correcta: considerar que la creencia es probablemente verdadera corresponde a poca introspección. La a requiere reconocer que la creencia es claramente o probablemente falsa, o que puede ser cierta o no. La c exige convicción completa de que es verdadera. La d es falsa porque el DSM-5-TR sí establece especificadores de insight para el trastorno dismórfico corporal.',r:DSM
  },
  'DICIEMBRE-UNO-24_COMENTADO_085': {
    e:'En el TOC, un uso predominante de rituales mentales y otras neutralizaciones encubiertas se ha asociado principalmente con:',
    o:{a:'Mayor malestar y peor respuesta terapéutica, con mayor riesgo de recaída.',b:'Menor culpa y vergüenza por no existir compulsiones observables.',c:'Mejor respuesta a la exposición porque el ritual no interfiere con ella.',d:'Desaparición de la egodistonía al reconocerse el carácter mental del ritual.'},c:'a',
    x:'La a es correcta: las neutralizaciones encubiertas pueden pasar inadvertidas, mantener la amenaza atribuida a la obsesión e interferir con la exposición, asociándose a mayor malestar y peor evolución. La b invierte la asociación con culpa y vergüenza. La c es falsa porque un ritual mental también puede neutralizar la exposición. La d es falsa: que el ritual sea encubierto no elimina la egodistonía.',r:`${BEL} Belloch, A. et al. (2015). Dysfunctional belief domains related to obsessive-compulsive disorder: a further examination of their dimensionality and specificity. Spanish Journal of Psychology, 18, E69.`
  },
  'DICIEMBRE-UNO-24_COMENTADO_126': {
    e:'Tras conducir, una persona con obsesiones de daño telefonea a la policía para que confirme que no se ha producido ningún atropello. Funcionalmente, esta conducta constituye:',
    o:{a:'Una comprobación perceptiva directa del trayecto.',b:'Una evitación pasiva de la conducción.',c:'Una búsqueda de reaseguración utilizada como neutralización.',d:'Una compulsión mental de repaso mnésico.'},c:'c',
    x:'La c es correcta: solicita a un tercero certeza para reducir la duda y la ansiedad, por lo que es búsqueda de reaseguración y funciona como neutralización. La a implicaría revisar directamente el lugar o pruebas perceptivas. La b consistiría en no conducir. La d sería repasar mentalmente el trayecto sin pedir confirmación externa.',r:BEL
  },
  'JULIO1_086': {
    e:'¿Qué hallazgo apoya específicamente el diagnóstico de trastorno de acumulación frente a una colección organizada no patológica?',
    o:{a:'La posesión de numerosos objetos de escaso valor económico.',b:'La dificultad persistente para desechar, debida a una necesidad percibida de conservar, que congestiona las zonas habitables y compromete su uso.',c:'La adquisición ocasional de objetos repetidos sin deterioro funcional.',d:'El desorden doméstico explicado exclusivamente por una limitación motora.'},c:'b',
    x:'La b es correcta: integra la dificultad persistente para desechar, la necesidad de guardar y la congestión con deterioro, rasgos nucleares del trastorno. La a no basta, pues el valor económico no define patología. La c carece de deterioro y persistencia. La d atribuye el desorden a una afección médica, lo que impide explicarlo como acumulación primaria.',r:`${DSM} ${BEL}`
  },
  'JULIO1_088': {
    e:'Sobre el patrón de comorbilidad del TOC, señale la afirmación más precisa:',
    o:{a:'La presencia de TOC implica necesariamente otro diagnóstico activo.',b:'Es frecuente que el TOC coexista con trastornos de ansiedad o depresivos, pero la relación no es recíproca en igual proporción.',c:'Los episodios depresivos preceden invariablemente al inicio del TOC.',d:'El trastorno de personalidad obsesivo-compulsiva es obligatorio para diagnosticar TOC.'},c:'b',
    x:'La b es correcta: la comorbilidad ansiosa y depresiva es elevada entre personas con TOC, pero solo una minoría de quienes padecen esos otros trastornos presenta TOC. La a convierte una asociación frecuente en necesidad diagnóstica. La c impone un orden temporal inexistente; la depresión aparece a menudo después del TOC. La d confunde dos diagnósticos distintos y ninguno exige al otro.',r:`${DSM} ${BEL}`
  },
  'JUNIO-UNO-24_COMENTADO_065': {
    e:'¿Qué rasgo orienta más hacia una obsesión del TOC que hacia una preocupación propia del trastorno de ansiedad generalizada?',
    o:{a:'Contenido intrusivo que no se limita a problemas realistas y provoca intentos de neutralización.',b:'Cadena verbal sobre dificultades cotidianas considerada útil para anticipar soluciones.',c:'Preocupación por varias áreas reales acompañada de tensión muscular.',d:'Ansiedad persistente ante circunstancias económicas, laborales o familiares plausibles.'},c:'a',
    x:'La a es correcta: las obsesiones suelen vivirse como intrusiones no restringidas a problemas reales y pueden desencadenar compulsiones o neutralización. Las opciones b, c y d describen rasgos característicos de la preocupación generalizada: predominio verbal, múltiples ámbitos cotidianos plausibles y síntomas de tensión, sin que ello constituya por sí mismo una obsesión.',r:`${DSM} ${BEL}`
  },
  'JUNIO-UNO-24_COMENTADO_072': {
    e:'Antes de su reubicación entre los trastornos obsesivo-compulsivos y relacionados, ¿en qué grupo clasificaba la CIE-10 la tricotilomanía?',
    o:{a:'Trastornos disociales.',b:'Trastornos de los hábitos y del control de los impulsos.',c:'Trastornos somatomorfos.',d:'Trastornos neuróticos relacionados con el estrés.'},c:'b',
    x:'La b es correcta: la CIE-10 codificaba la tricotilomanía como F63.3 dentro de los trastornos de los hábitos y del control de los impulsos. La a agrupaba problemas disociales, no arrancamiento de pelo. La c incluía síndromes somatomorfos y la d otros cuadros neuróticos y relacionados con estrés; ninguna contenía F63.3.',r:`World Health Organization (1992). The ICD-10 Classification of Mental and Behavioural Disorders, categoría F63.3 «Trichotillomania». ${ICD}`
  },
  'JUNIO-UNO-24_COMENTADO_084': {
    e:'En estudios descriptivos del TOC, ¿qué pareja reúne las compulsiones manifiestas observadas con mayor frecuencia?',
    o:{a:'Comprobación y lavado/limpieza.',b:'Orden/simetría y acumulación.',c:'Repetición y búsqueda de reaseguración.',d:'Conteo y rituales religiosos.'},c:'a',
    x:'La a es correcta: comprobación y lavado/limpieza figuran de forma consistente entre las compulsiones manifiestas más frecuentes. Orden/simetría, repetición, reaseguración, conteo y rituales religiosos también pueden aparecer, pero las combinaciones b, c y d no reúnen las dos categorías que encabezan habitualmente la frecuencia. Además, la acumulación primaria dispone hoy de diagnóstico propio.',r:`${BEL} ${DSM}`
  },
  'JUNIO1_112': {
    e:'¿Qué patrón se ha descrito en personas con TOC que recurren en mayor medida a estrategias de neutralización encubiertas?',
    o:{a:'Menor intensidad emocional porque las neutralizaciones mentales no mantienen el problema.',b:'Mayor egosintonía y menor interpretación disfuncional de las intrusiones.',c:'Mayor culpa, tristeza y vergüenza, junto con interpretaciones más disfuncionales.',d:'Mejor respuesta terapéutica que quienes presentan compulsiones manifiestas.'},c:'c',
    x:'La c es correcta: el uso intenso de estrategias encubiertas se relaciona con mayor culpa, tristeza y vergüenza y con valoraciones más disfuncionales de las intrusiones. La a niega erróneamente su función mantenedora. La b invierte tanto la egodistonía como la interpretación disfuncional. La d es falsa porque las neutralizaciones ocultas pueden dificultar la exposición y se han asociado a peor respuesta y recaída.',r:`${BEL} Belloch et al. (2015), estudio sobre estrategias de control y neutralización en el TOC.`
  },
  'JUNIO1_117': {
    e:'¿Cuál de las siguientes NO es una dimensión de creencias disfuncionales consensuada por el OCCWG?',
    o:{a:'Importancia excesiva atribuida a los pensamientos.',b:'Necesidad de controlar los pensamientos.',c:'Estilo general de pensamiento catastrófico.',d:'Intolerancia a la incertidumbre.'},c:'c',
    x:'La c es correcta: «estilo general de pensamiento catastrófico» no figura como dominio independiente del OCCWG. La a sí corresponde a la importancia de los pensamientos; la b a la necesidad de controlarlos; y la d a la intolerancia a la incertidumbre, integrada con perfeccionismo en la estructura factorial abreviada.',r:`${BEL} ${OCCWG}`
  },
  'MAYO-DOS-24_COMENTADO_160': {
    e:'¿Cuál de estas condiciones NO se integra en el bloque de trastornos obsesivo-compulsivos y relacionados de la CIE-11?',
    o:{a:'Trastorno de referencia olfativa.',b:'Hipocondría.',c:'Trastorno dismórfico corporal.',d:'Disforia por la integridad corporal.'},c:'d',
    x:'La d es correcta: la disforia por la integridad corporal se ubica en la CIE-11 dentro de los trastornos de malestar corporal o experiencia corporal, no en el bloque obsesivo-compulsivo. La a sí está incluida como trastorno de referencia olfativa; la b como hipocondría; y la c como trastorno dismórfico corporal dentro del grupo obsesivo-compulsivo y relacionado.',r:`${ICD} ${BEL}`
  },
  'MAYO-UNO-24_COMENTADO_036': {
    e:'Dentro de las estrategias de control de pensamientos, contar repetidamente una obsesión a otras personas o solicitarles confirmación tranquilizadora se clasifica como:',
    o:{a:'Control social.',b:'Autocastigo.',c:'Distracción focalizada.',d:'Sustitución del pensamiento.'},c:'a',
    x:'La a es correcta: el control social consiste en revelar el pensamiento o buscar en otros reaseguración para reducir malestar o incertidumbre. El autocastigo añade consecuencias aversivas dirigidas a uno mismo. La distracción focaliza la atención en otra actividad o estímulo. La sustitución intenta reemplazar el pensamiento por otro; ninguna de estas tres requiere confirmación interpersonal.',r:BEL
  },
  'MAYO-UNO-24_COMENTADO_040': {
    e:'¿Qué patrón de inicio es más característico de la tricotilomanía según el DSM-5-TR?',
    o:{a:'Inicio típico antes de los 5 años, con remisión obligatoria antes de la pubertad.',b:'Inicio habitual en torno a la pubertad; el comienzo temprano se asocia a menudo a un curso más benigno.',c:'Inicio típico tras los 40 años, generalmente secundario a deterioro neurocognitivo.',d:'Inicio exclusivo después de un episodio depresivo mayor.'},c:'b',
    x:'La b es correcta: el arrancamiento patológico suele comenzar en torno a la pubertad y los casos muy tempranos pueden seguir un curso más benigno. La a convierte esa posible benignidad en remisión obligatoria y fija una edad demasiado restrictiva. La c describe un inicio atípico, no el patrón habitual. La d es falsa porque la tricotilomanía no exige ni depende temporalmente de depresión mayor.',r:`${DSM} ${BEL}`
  }
};

let changed = 0;
for (const q of bank) {
  if (!U[q.id]) continue;
  Object.assign(q, U[q.id], {v:'VALIDADA_ORIGINAL'});
  changed++;
}
if (changed !== 20) throw new Error(`Expected 20 updates, got ${changed}`);
fs.writeFileSync(file, JSON.stringify(bank));
console.log(`Updated ${changed} TOC questions.`);
