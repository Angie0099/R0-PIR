import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INTRO = "Introducción";
const ADULT = "Tratamientos Adultos";
const PSYCHOTHERAPIES = "Psicoterapias";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const bankDir = path.join(rootDir, "public", "banco");
const adultPath = path.join(bankDir, "tratamientos_adultos.json");
const psychotherapyPath = path.join(bankDir, "psicoterapias.json");
const manifestPath = path.join(bankDir, "manifest.json");
const reportPath = path.join(rootDir, "analysis", "introduction_review_summary.json");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const refs = {
  history: "Feixas, G. y Miró, T. (1993). Aproximaciones a la psicoterapia. Paidós. Apartados sobre desarrollo histórico de la psicoterapia.",
  psychodynamic: "Rodríguez Morejón, A. (2019). Manual de psicoterapias: teoría y técnicas. Herder. Sección «Psicoanálisis y autores psicodinámicos».",
  humanistic: "Rodríguez Morejón, A. (2019). Manual de psicoterapias: teoría y técnicas. Herder. Sección sobre modelos humanistas y existenciales.",
  systemic: "Rodríguez Morejón, A. (2019). Manual de psicoterapias: teoría y técnicas. Herder. Sección sobre terapias sistémicas y familiares.",
  greenberg: "Rodríguez Morejón, A. (2019). Manual de psicoterapias: teoría y técnicas. Herder. Capítulo 32, «Terapia centrada en las emociones».",
  psychodrama: "Rodríguez Morejón, A. (2019). Manual de psicoterapias: teoría y técnicas. Herder. Apartado sobre psicodrama de Moreno.",
};

// Solo se incluyen preguntas generales del bloque introductorio. Las preguntas
// clínicas específicas, las duplicadas y las que siguen siendo ambiguas se
// conservan en el banco, pero fuera de este tema.
const excluded = new Map([
  ["PERSEV_JUL25_D2_086", "aplicación clínica específica y guía NICE"],
  ["JULIO1_149", "tratamiento específico del trastorno bipolar"],
  ["MAYO2_180", "duplicada"],
  ["NOVIEMBRE-DOS-24_COMENTADO_164", "aplicación a un trastorno específico"],
  ["SEPTIEMBRE-UNO-24_COMENTADO_032", "incluye dosis y eficacia específicas"],
  ["PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_097", "más de una alternativa resulta defendible"],
  ["PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_156", "duplicada"],
  ["PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_097", "dosis y aplicación clínica específicas"],
  ["PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_100", "tratamiento específico de psicosis adolescente"],
  ["PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_167", "duplicada y clave original errónea"],
  ["PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_173", "incluye niveles de evidencia y duración"],
  ["PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_141", "duplicada"],
  ["PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_111", "tratamiento específico de depresión adolescente"],
  ["PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_171", "tratamiento transdiagnóstico, adaptación y duración"],
  ["SM_AGOSTO_1_SOL_1_131", "dosis y aplicaciones clínicas específicas"],
  ["SM_JUNIO_1_SOL_1_083", "enunciado truncado"],
  ["SM_JUNIO_1_SOL_1_169", "eficacia para un problema específico"],
  ["Simu 14 comentado _100", "clasificación clínica de estructuras de personalidad"],
  ["SmCm08PIR2025_074", "duplicada y con OCR incompleto"],
  ["4Simulacro02018Comentarios_152", "duplicada"],
  ["Simu 12 comentado_142", "formulación no suficientemente verificable"],
  ["Simu 31 comentado Hardcore 1_173", "opciones duplicadas y tema de desarrollo profesional"],
  ["Simu 32 comentado hardcore 2_137", "comparación ambigua"],
  ["Simu 7 comentado _138", "duplicada"],
  ["SmCm13PIR2025_208", "duplicada y con OCR incompleto"],
  ["SmCm16PIR2025_118", "duplicada"],
  ["SmCm18PIR2025_130", "la clave no queda inequívoca con la formulación disponible"],
  ["SmCm20PIR2025 (1)_130", "OCR incompleto"],
  ["SmCm20PIR2025 (1)_134", "formulación ambigua"],
  ["SmCm21PIR2025 (2)_002", "alternativa incorrecta no inequívoca"],
  ["SmCm22PIR2025_118", "duplicada"],
  ["SmCm22PIR2025_119", "dos alternativas idénticas"],
  ["SmCm27PIR2025 (1)_123", "duplicada"],
  ["SmCm28PIR2025_128", "OCR incompleto y clave dudosa"],
]);

const evidence = {
  "PERSEV_JUL25_D2_132": ["Frankl sitúa entre los dilemas existenciales la búsqueda de sentido, el aislamiento, la libertad y la muerte; la desesperanza no forma parte de esa enumeración.", "humanistic"],
  "PERSEV_JUL25_D2_133": ["El MRI de Palo Alto puede trabajar con quienes están motivados para resolver el problema y centra la intervención en las soluciones intentadas que lo mantienen.", "systemic"],
  "JULIO1_158": ["La terapia breve centrada en soluciones adopta una visión construccionista y amplía lo que ya funciona, en lugar de buscar la causa o la función del síntoma.", "systemic"],
  "JULIO2_205": ["Interpretación, confrontación y clarificación son procedimientos de cambio; la asociación libre obtiene material, y la abstinencia y la atención flotante describen posiciones técnicas.", "psychodynamic"],
  "JUNIO1_140": ["En el modelo estructural, una familia aglutinada presenta límites internos difusos y fronteras externas rígidas.", "systemic"],
  "DICIEMBRE-DOS-24_COMENTADO_118": ["Durante la reexperimentación se reconstruye vívidamente la escena y se identifica el momento exacto en que comenzó la reacción para precisar sus antecedentes.", "greenberg"],
  "JUNIO-UNO-24_COMENTADO_147": ["La terapia familiar estratégica trabaja en el presente, asigna al terapeuta la responsabilidad de diseñar un plan individualizado y emplea con frecuencia humor y recursos lúdicos.", "systemic"],
  "MAYO-UNO-24_COMENTADO_072": ["Greenberg describe cuatro fuentes de disfunción emocional: falta de conciencia, reacciones inadecuadas, dificultad de regulación y problemas para construir narrativas.", "greenberg"],
  "OCTUBRE-UNO-24_COMENTADO_140": ["En la formación reactiva, el deseo o pensamiento inaceptable se transforma en su contrario.", "psychodynamic"],
  "OCTUBRE-UNO-24_COMENTADO_146": ["Rogers relaciona el funcionamiento pleno con apertura a la experiencia, libertad responsable y creatividad; no incluye como condición la formulación genérica «visión positiva de uno mismo y del mundo».", "humanistic"],
  "SEPTIEMBRE-UNO-24_COMENTADO_041": ["La escalada simétrica aparece cuando ambos participantes compiten por situarse en una posición superior, impidiendo la alternancia o la negociación.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_096": ["La Escuela de Milán emplea prescripciones ritualizadas, como asignar conductas diferentes en días pares e impares.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_160": ["La técnica de las cuerdas pertenece a la terapia familiar experiencial de Satir; no es una técnica estructural de Minuchin.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_163": ["El análisis transaccional de Berne se clasifica entre los modelos humanistas; Kelly y Ellis son cognitivos, y Adler es psicodinámico.", "humanistic"],
  "PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_187": ["El trazado de límites y el trabajo con la jerarquía son procedimientos característicos del modelo estructural de Minuchin.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_147": ["El desplazamiento separa el afecto de la persona u objeto que lo origina y lo dirige hacia otro objeto.", "psychodynamic"],
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_159": ["En el modelo estructural, las metáforas se emplean para cambiar la visión; intensificación, focalización y escenificación actúan sobre las pautas estructurales.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_121": ["Las familias desligadas tienen límites rígidos, excesiva individualidad y pueden dejar necesidades afectivas sin satisfacer.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_172": ["El MRI explica el mantenimiento del problema por soluciones intentadas ineficaces que forman círculos viciosos.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_117": ["La simetría inestable describe la pugna por mantener una posición distinta de la propuesta por el otro, sin consolidar una relación estable.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_085": ["Las conversaciones de reautoría y los testigos externos son recursos narrativos de White y Epston, no técnicas de la terapia experiencial de Satir.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_093": ["Greenberg describe respuestas emocionales primarias desadaptativas, reacciones secundarias e instrumentales; la «respuesta encadenada a reacciones intensas» no figura como patrón propio.", "greenberg"],
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_094": ["De Shazer se centra en excepciones y soluciones, por lo que no necesita diagnosticar ni atribuir una función al síntoma para construir el cambio.", "systemic"],
  "PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_089": ["La terapia centrada en soluciones usa la metáfora del efecto mariposa para expresar que un cambio mínimo puede generalizarse y producir cambios mayores.", "systemic"],
  "SM_DICIEMBRE_2_SOL_1_154": ["En el joining y la acomodación, el terapeuta se une al sistema, se adapta a su estilo interaccional y construye una alianza de confianza.", "systemic"],
  "SM_JULIO_2_SOL_1_147": ["Las facetas fuertes cambian la visión que la familia tiene de sí misma; fijación de límites, desequilibrio y complementariedad son técnicas reestructurantes.", "systemic"],
  "SM_MAYO_1_SOL_1_138": ["El diálogo de las dos sillas pone en contacto partes opuestas del yo para integrarlas; la silla vacía se reserva para asuntos inconclusos con otra persona significativa.", "greenberg"],
  "Simu 8 comentado _020": ["La terapia centrada en las emociones integra recursos gestálticos, entre ellos el diálogo de las dos sillas y la silla vacía.", "greenberg"],
  "SmCm16PIR2025_009": ["Greenberg habla de dificultades en la construcción de narrativas, no de una supuesta «construcción de emociones».", "greenberg"],
  "SmCm5PIR2024_041": ["En el desafío estructural se intensifica y repite el mensaje cuando la inercia familiar neutraliza el intento de cambio.", "systemic"],
  "1Simulacro02018Comentarios_106": ["En la secuencia psicosexual freudiana, el segundo año de vida se sitúa en la fase anal.", "psychodynamic"],
  "1Simulacro02018Comentarios_112": ["El paciente identificado porta el síntoma visible, pero el modelo sistémico lo entiende como expresión del funcionamiento del sistema familiar.", "systemic"],
  "1Simulacro02018Comentarios_114": ["La paradoja pragmática aparece cuando el contenido digital contradice la definición relacional comunicada en el nivel analógico.", "systemic"],
  "1Simulacro02018Comentarios_117": ["Los cambios de tipo 1 modifican conductas dentro de las reglas existentes, pero no transforman la estructura que mantiene el problema.", "systemic"],
  "3Simulacro2018Comentarios_036": ["Freud publicó Tres ensayos de teoría sexual en 1905, dentro de la etapa denominada Psicología del Ello (1900-1914).", "psychodynamic"],
  "3Simulacro2018Comentarios_092": ["La distinción consciente-preconsciente-inconsciente corresponde al modelo topográfico de Freud.", "psychodynamic"],
  "4Simulacro02018Comentarios_143": ["El trabajo con el método catártico permitió a Freud advertir fenómenos de resistencia y transferencia que la hipnosis no resolvía.", "history"],
  "4Simulacro02018Comentarios_144": ["Una sesión de psicodrama se organiza en caldeamiento, dramatización y fase de compartir o eco grupal.", "psychodrama"],
  "4Simulacro02018Comentarios_145": ["Perls utiliza el trabajo con los sueños en terapia gestáltica; amplificación e imaginación activa se asocian a Jung, e intención paradójica a Frankl.", "humanistic"],
  "4Simulacro02018Comentarios_148": ["En la teoría de la seducción, Freud atribuyó las psiconeurosis a experiencias sexuales traumáticas reales sufridas en la infancia.", "psychodynamic"],
  "Simu 13 comentado_090": ["La intervención de la Escuela de Milán incluye contacto telefónico, presesión, sesión, pausas, intervención, postsesión y seguimiento.", "systemic"],
  "Simu 14 comentado _116": ["La Gestalt concibe la personalidad mediante polaridades complementarias, como cuerpo-mente o amor-odio, que deben reconocerse e integrarse.", "humanistic"],
  "Simu 14 comentado _118": ["Minuchin, Haley y De Shazer pertenecen a corrientes sistémicas; Hayes es el principal autor de la terapia de aceptación y compromiso.", "systemic"],
  "Simu 14 comentado _119": ["El modelo estructural vincula la aparición de síntomas con bloqueos o dificultades de adaptación en las transiciones del ciclo vital familiar.", "systemic"],
  "Simu 14 comentado _120": ["La idea de que las personas quieren y saben cambiar caracteriza a la terapia centrada en soluciones, no a la Escuela de Milán.", "systemic"],
  "Simu 31 comentado Hardcore 1_167": ["Puységur describió el sonambulismo artificial y la amnesia posterior, pero se distanció de la explicación fluidista del magnetismo.", "history"],
  "Simu 32 comentado hardcore 2_131": ["Virginia Satir es la autora central de la terapia familiar experiencial.", "systemic"],
  "Simu 32 comentado hardcore 2_133": ["El doble vínculo constituye una paradoja pragmática porque impone mensajes relacionales incompatibles en una situación de la que no es posible salir ni metacomunicar.", "systemic"],
  "Simu 32 comentado hardcore 2_139": ["En el modelo sistémico se busca una posición equidistante respecto de los distintos miembros para evitar alianzas rígidas del terapeuta con un subsistema.", "systemic"],
  "Simu 7 comentado _147": ["«Forzar algo que solo puede ocurrir espontáneamente» es uno de los patrones específicos de solución intentada descritos por el MRI.", "systemic"],
  "Simu 8 comentado _001": ["Las prescripciones ritualizadas son una intervención característica de la Escuela de Milán.", "systemic"],
  "SmCm08PIR2025_006": ["La causalidad circular indica que las conductas de los miembros se codeterminan recíprocamente, sin una causa lineal única.", "systemic"],
  "SmCm10PIR2025_173": ["Jung concede especial importancia al arquetipo sexual —ánima o ánimus— como mediador entre la conciencia y el inconsciente.", "psychodynamic"],
  "SmCm12PIR2024 2_192": ["El doble vínculo es un patrón recurrente y no se limita a momentos de crisis; incluye una relación intensa y mandatos incompatibles.", "systemic"],
  "SmCm16PIR2025_114": ["El focusing de Gendlin se indica ante una sensación sentida confusa que la persona todavía no puede interpretar o simbolizar.", "greenberg"],
  "SmCm17PIR2025_018": ["La prescripción invariable de la Escuela de Milán separa al subsistema parental del filial para interrumpir coaliciones y clarificar límites.", "systemic"],
  "SmCm17PIR2025_024": ["El lema «la solución es el problema» resume la idea del MRI de que las soluciones intentadas mantienen la dificultad.", "systemic"],
  "SmCm17PIR2025_029": ["Las emociones instrumentales se expresan con la finalidad de influir sobre otras personas o alcanzar una meta interpersonal.", "greenberg"],
  "SmCm17PIR2025_037": ["Llegar a un acuerdo mediante coacción pertenece a las intervenciones específicas del MRI; cambio de dirección, no apresurarse y petición de cambio lento son generales.", "systemic"],
  "SmCm17PIR2025_204": ["Los niveles consciente, preconsciente e inconsciente forman la primera tópica o modelo topográfico freudiano.", "psychodynamic"],
  "SmCm18PIR2025_123": ["Freud adoptó inicialmente la explicación de Breuer sobre la histeria durante la etapa prefundacional de su obra.", "history"],
  "SmCm19PIR2024_107": ["La terapia de Greenberg integra influencias experienciales, emocionales y sistémicas; la psicoterapia interpersonal de Klerman no figura entre esas influencias nucleares.", "greenberg"],
  "SmCm20PIR2024_087": ["En Jung, el inconsciente colectivo se organiza mediante arquetipos, mientras que el inconsciente personal se articula en complejos.", "psychodynamic"],
  "SmCm21PIR2025 (2)_133": ["La Escuela de Milán estructura la intervención en fases que incluyen contacto telefónico, presesión, sesión, pausas y postsesión.", "systemic"],
  "SmCm21PIR2025 (2)_139": ["Freud denomina censura al mecanismo del modelo topográfico que regula e impide el paso libre de contenidos entre sistemas.", "psychodynamic"],
  "SmCm21PIR2025 (2)_142": ["Malan es uno de los autores de las psicoterapias psicoanalíticas breves, no de las tradiciones neofreudiana, analítica del yo o lacaniana.", "psychodynamic"],
  "SmCm22PIR2025 (1)_168": ["Durante la latencia disminuye la expresión sexual directa y la energía pulsional se canaliza mediante sublimación.", "psychodynamic"],
  "SmCm23PIR2025_020": ["El objeto transicional es un concepto central de Winnicott; los arquetipos pertenecen a Jung.", "psychodynamic"],
  "SmCm24PIR2025 (1)_159": ["Las polaridades son un concepto fundamental de la Gestalt; la neurosis noógena y el Dasein pertenecen a enfoques existenciales, y las transacciones a Berne.", "humanistic"],
  "SmCm24PIR2025 (1)_166": ["Winnicott describe sostenimiento, manejo y presentación objetal; «cuidado emocional» no es una cuarta función técnica de esa clasificación.", "psychodynamic"],
  "SmCm24PIR2025 (1)_167": ["Los cinco axiomas incluyen imposibilidad de no comunicar, contenido-relación, puntuación, modalidades digital-analógica y simetría-complementariedad; la incongruencia que genera paradojas es una consecuencia, no otro axioma.", "systemic"],
  "SmCm25PIR2025_137": ["El desafío estructural se desarrolla mediante escenificación, focalización e intensificación; el rastreo corresponde al joining.", "systemic"],
  "SmCm25PIR2025_145": ["En la posición esquizoparanoide predominan escisión, proyección, introyección y ansiedad persecutoria; la integración de amor y odio caracteriza la posición depresiva.", "psychodynamic"],
  "SmCm26PIR2025_137": ["Las directrices clásicas de la entrevista de Milán son hipotetización, circularidad y neutralidad; la comparación normativa no pertenece a esa tríada.", "systemic"],
  "SmCm26PIR2025_140": ["De Shazer concreta señales observables de cambio, amplía el funcionamiento satisfactorio y utiliza elogios y preguntas presuposicionales; no explica el bloqueo por homeostasis.", "systemic"],
  "SmCm27PIR2025 (1)_125": ["La técnica del desafío pertenece al modelo estructural de Minuchin; hipnosis ericksoniana, ordalías y pacto con el diablo se asocian al enfoque estratégico/MRI.", "systemic"],
  "SmCm28PIR2025_129": ["La técnica del desafío es estructural; metáforas, ordalías, pacto con el diablo y técnicas paradójicas se emplean en el enfoque MRI/estratégico.", "systemic"],
  "SmCm29PIR2025_135": ["Rogers considera necesarias la empatía, la aceptación positiva incondicional y la congruencia; la autorrealización es una tendencia o meta, no una actitud del terapeuta.", "humanistic"],
  "SmCm29PIR2025_138": ["La connotación positiva atribuye al síntoma una intención positiva o altruista, como protección, sacrificio o amor, dentro del equilibrio familiar.", "systemic"],
  "SmCm29PIR2025_141": ["Winnicott denomina preocupación maternal primaria al estado de especial sensibilidad y concentración de la madre en el bebé al final del embarazo y tras el parto.", "psychodynamic"],
  "SmCm30PIR2025 (1)_080": ["Greenberg incluye entre las fuentes de disfunción emocional las dificultades para construir narrativas que organicen la experiencia.", "greenberg"],
  "SmCm30PIR2025 (1)_172": ["Mantenimiento, rastreo y mimetismo pertenecen al joining o acomodación inicial; la focalización forma parte del desafío posterior.", "systemic"],
  "SmCm30PIR2025 (1)_173": ["En Adler, la constelación familiar alude a la posición y al orden de nacimiento respecto a los hermanos; los valores parentales definen la atmósfera familiar.", "psychodynamic"],
};

const answerCorrections = new Map([
  ["JUNIO-UNO-24_COMENTADO_147", "c"],
  ["PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_160", "d"],
  ["PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_167", "c"],
  ["SmCm24PIR2025 (1)_167", "b"],
  ["SmCm30PIR2025 (1)_173", "c"],
]);

const questionEdits = new Map([
  ["PERSEV_JUL25_D2_132", "¿Cuál de los siguientes NO forma parte de los dilemas existenciales descritos por Frankl?"],
  ["PERSEV_JUL25_D2_133", "Señale la opción correcta sobre la Escuela Interaccional del MRI de Palo Alto:"],
  ["JULIO1_158", "¿Cuál de las siguientes características pertenece a la Terapia Breve Centrada en Soluciones de De Shazer y Berg?"],
  ["JULIO2_205", "¿Cuál de las siguientes opciones recoge técnicas de cambio del modelo psicodinámico?"],
  ["JUNIO1_140", "Según la terapia estructural de Minuchin, una familia es disfuncional cuando su estructura le impide adaptarse a cambios internos y externos. ¿Qué características definen a una familia aglutinada?"],
  ["DICIEMBRE-DOS-24_COMENTADO_118", "¿En qué fase del reprocesamiento de la Terapia Centrada en las Emociones de Greenberg se identifica el momento exacto en que comenzó la reacción para conocer sus antecedentes?"],
  ["JUNIO-UNO-24_COMENTADO_147", "En la terapia familiar estratégica, señale la opción correcta:"],
  ["MAYO-UNO-24_COMENTADO_072", "Señale la opción correcta sobre la Terapia Centrada en las Emociones (TCE) de Leslie Greenberg:"],
  ["OCTUBRE-UNO-24_COMENTADO_140", "¿A qué mecanismo de defensa descrito por Anna Freud corresponde transformar un deseo o pensamiento inaceptable en su contrario?"],
  ["OCTUBRE-UNO-24_COMENTADO_146", "La terapia centrada en la persona de Carl Rogers describe varias condiciones del funcionamiento pleno. ¿Cuál de las siguientes NO es una de ellas?"],
  ["SEPTIEMBRE-UNO-24_COMENTADO_041", "Según los axiomas de la comunicación de Watzlawick, ¿cómo se denomina el patrón que implica una lucha por ocupar una posición superior, sin alternancia complementaria ni negociación?"],
  ["PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_163", "¿Cuál de los siguientes se considera un modelo humanista-existencial?"],
  ["PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_160", "Señale la opción INCORRECTA sobre las técnicas de la terapia estructural de Minuchin:"],
  ["PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_187", "¿A qué escuela pertenecen el trazado de límites y el trabajo con la jerarquía familiar?"],
  ["PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_159", "En la terapia estructural se distinguen técnicas estructurales y técnicas de cambio de visión. ¿Cuál de las siguientes es una técnica de cambio de visión?"],
  ["PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_172", "Señale la opción correcta sobre las diferencias entre el MRI de Palo Alto y la escuela estructural/estratégica:"],
  ["PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_117", "Respecto a los axiomas de la comunicación de Watzlawick, ¿cómo se denomina el patrón que implica una lucha constante por mantener una posición distinta a la propuesta por la otra persona?"],
  ["PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_094", "Señale la opción INCORRECTA sobre la Terapia Centrada en Soluciones de De Shazer:"],
  ["PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_089", "¿Qué terapia sistémica utiliza la metáfora del efecto de las alas de mariposa?"],
  ["SM_DICIEMBRE_2_SOL_1_154", "Respecto a las fases de la terapia estructural de Minuchin, ¿en qué consiste el joining y la acomodación?"],
  ["SM_MAYO_1_SOL_1_138", "La Terapia Centrada en las Emociones de Greenberg utiliza ejercicios de confrontación imaginaria. ¿En qué consiste el diálogo de las dos sillas?"],
  ["Simu 8 comentado _020", "Señale la opción correcta sobre la Terapia Centrada en las Emociones de Johnson y Greenberg:"],
  ["SmCm16PIR2025_009", "La Terapia Centrada en las Emociones de Greenberg describe cuatro posibles causas de alteración del manejo emocional. ¿Cuál de las siguientes NO es una de ellas?"],
  ["Simu 14 comentado _116", "Respecto a la terapia gestáltica, señale la opción correcta:"],
  ["Simu 13 comentado_090", "¿Cuál de las siguientes opciones recoge las fases de intervención de la Escuela de Milán?"],
  ["Simu 14 comentado _118", "En relación con la terapia sistémica, ¿cuál de los siguientes autores NO pertenece a esta corriente?"],
  ["Simu 14 comentado _119", "¿Qué terapia sistémica sostiene que el síntoma puede aparecer cuando existe un retraso o una detención en el ciclo vital familiar?"],
  ["Simu 31 comentado Hardcore 1_167", "En los orígenes de la psicoterapia, señale la opción INCORRECTA sobre el marqués de Puységur:"],
  ["Simu 32 comentado hardcore 2_133", "¿Qué tipo de paradoja es responsable del patrón disfuncional de comunicación denominado «doble vínculo»?"],
  ["Simu 32 comentado hardcore 2_139", "¿Cuál es una característica principal de la relación terapéutica en el modelo sistémico?"],
  ["SmCm10PIR2025_173", "¿Cuál es el arquetipo más importante en la psicología analítica de Jung?"],
  ["SmCm12PIR2024 2_192", "Señale la afirmación FALSA sobre la teoría del doble vínculo:"],
  ["SmCm16PIR2025_114", "Según la Terapia Centrada en las Emociones de Greenberg, ¿ante qué marcador se utiliza el focusing de Gendlin?"],
  ["SmCm17PIR2025_018", "La Escuela de Milán propuso una técnica que separa los subsistemas parental y filial para evitar coaliciones y clarificar límites. ¿Cómo se denomina?"],
  ["SmCm17PIR2025_029", "Según Greenberg, ¿cuál de las siguientes alternativas corresponde a las emociones instrumentales?"],
  ["SmCm17PIR2025_204", "Según Freud, ¿de qué modelo forman parte los niveles consciente, preconsciente e inconsciente?"],
  ["SmCm18PIR2025_123", "¿En qué etapa del desarrollo de su obra adoptó Freud la teoría de Breuer para explicar la histeria?"],
  ["SmCm19PIR2024_107", "La Terapia Centrada en las Emociones de Greenberg recibe influencias de diversos enfoques. ¿Cuál de las siguientes NO corresponde a una de sus influencias?"],
  ["SmCm20PIR2024_087", "¿Cuál de las siguientes afirmaciones es correcta sobre la psicología analítica de Jung?"],
  ["SmCm21PIR2025 (2)_133", "Señale la opción correcta sobre la Escuela de Milán (Selvini Palazzoli, Cecchin, Prata y Boscolo):"],
  ["SmCm21PIR2025 (2)_142", "¿A qué tradición de psicoterapia psicodinámica pertenece Malan?"],
  ["SmCm22PIR2025 (1)_168", "Dentro de las fases psicosexuales del modelo de Freud, señale la opción correcta:"],
  ["SmCm23PIR2025_020", "¿Cuál de los siguientes conceptos pertenece a la teoría de Winnicott?"],
  ["SmCm24PIR2025 (1)_166", "¿Cuál de las siguientes NO es una de las funciones maternas primordiales para el desarrollo infantil según Winnicott?"],
  ["SmCm24PIR2025 (1)_167", "La Teoría de la Comunicación Humana de Watzlawick, Beavin y Jackson establece cinco axiomas básicos. ¿Cuál de las siguientes afirmaciones NO es uno de ellos?"],
  ["SmCm27PIR2025 (1)_125", "En relación con las técnicas de la escuela MRI de Palo Alto, ¿cuál de las siguientes NO forma parte de esta escuela?"],
  ["SmCm29PIR2025_135", "Dentro de la psicoterapia centrada en la persona de Rogers, ¿cuál NO es una actitud y condición necesaria y suficiente para el cambio terapéutico?"],
  ["SmCm29PIR2025_138", "¿En qué consiste la connotación positiva del síntoma?"],
  ["SmCm30PIR2025 (1)_080", "Respecto a la intervención de Greenberg en la Terapia Centrada en las Emociones (TCE), señale la opción correcta:"],
  ["SmCm30PIR2025 (1)_172", "¿Cuál de las siguientes alternativas NO corresponde a un procedimiento de la primera fase de la terapia familiar estructural de Minuchin?"],
  ["SmCm30PIR2025 (1)_173", "La psicología individual de Adler incluye el concepto de «constelación familiar». ¿Cómo se define?"],
]);

const optionEdits = {
  "PERSEV_JUL25_D2_086": { d: "Depresión moderada-grave en adolescentes (12-18 años)." },
  "PERSEV_JUL25_D2_132": { d: "Desesperanza." },
  "PERSEV_JUL25_D2_133": {
    a: "Trabaja únicamente con los miembros motivados para resolver el problema.",
    b: "Analiza la estructura y la organización familiar: subsistemas, límites, fronteras, tríadas y jerarquía.",
    c: "Da importancia a los patrones disfuncionales que se perpetúan desde la familia de origen o generaciones anteriores.",
    d: "Muestra interés por las excepciones del problema.",
  },
  "JULIO1_158": { a: "El sistema se regula según los principios de lealtad y justicia.", b: "La cultura determina la estructura familiar y sus patrones de interacción." },
  "JULIO2_205": { b: "Interpretación, confrontación y clarificación.", c: "Reglas de abstinencia y atención flotante.", d: "Sustitución, negación y represión." },
  "JUNIO1_140": { d: "Límites difusos y fronteras difusas." },
  "MAYO2_180": { d: "Identificación." },
  "DICIEMBRE-DOS-24_COMENTADO_118": { d: "Reconocimiento y examen de los autoesquemas." },
  "JUNIO-UNO-24_COMENTADO_147": { d: "Desarrolla un plan genérico aplicable a la mayoría de las familias." },
  "MAYO-UNO-24_COMENTADO_072": {
    c: "Describe cuatro posibles causas de disfunción emocional: falta de conciencia, reacciones inadecuadas, incapacidad para regular emociones y dificultades en la construcción de narrativas.",
    d: "Se clasifica como un modelo cognitivo-conductual.",
  },
  "NOVIEMBRE-DOS-24_COMENTADO_164": { d: "Obesidad." },
  "SEPTIEMBRE-UNO-24_COMENTADO_041": { d: "Relación diferente." },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_163": { c: "Psicología individual de Adler.", d: "Terapia racional-emotiva de Ellis." },
  "PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_156": { d: "Dar un sentido." },
  "PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_187": { d: "Experiencial de Satir." },
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_147": { d: "Sublimación." },
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_159": { d: "Escenificación." },
  "PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_160": { c: "Trabajo con las secuencias problema.", d: "Técnica de las cuerdas." },
  "PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_121": { d: "A menudo quedan por satisfacer algunas necesidades afectivas." },
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_100": { d: "No tener en cuenta las relaciones familiares." },
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_172": { d: "La escuela estructural/estratégica distingue entre cambios de tipo 1 y de tipo 2." },
  "PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_167": { d: "Identificación." },
  "PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_117": { d: "Asimetría estable." },
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_093": { d: "Respuesta directa a la situación influida por experiencias traumáticas pasadas." },
  "PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_094": { c: "Da importancia a las excepciones del problema." },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_111": { d: "No incluye a padres o cuidadores." },
  "PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_171": { d: "El programa Hold Me Tight es una adaptación de la terapia." },
  "PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_089": { d: "Terapia del grupo de Milán." },
  "SM_JULIO_2_SOL_1_147": { d: "El aprendizaje de la complementariedad." },
  "SM_JUNIO_1_SOL_1_083": { d: "Posicionarse con el subsistema más fuerte para fortalecer la cohesión del subsistema más débil." },
  "SM_JUNIO_1_SOL_1_169": { d: "Entre sus ámbitos de aplicación destaca el abordaje de los problemas de pareja." },
  "SM_MAYO_1_SOL_1_138": {
    b: "Integrar aspectos opuestos del yo y crear un sentido más unificado de la persona.",
    c: "El terapeuta pide describir con detalle la escena y recordarla vívidamente para facilitar la reexperimentación.",
  },
  "Simu 8 comentado _020": {
    a: "Utiliza, entre sus técnicas, el diálogo de las dos sillas y la silla vacía.",
    b: "Solo se utiliza para trastornos depresivos y de ansiedad, nunca de forma transdiagnóstica.",
    c: "Es un enfoque completamente no directivo y rogeriano.",
    d: "Tiene un formato grupal infantil denominado Hold Me Tight.",
  },
  "3Simulacro2018Comentarios_036": { c: "Etapa de Psicología del Ello (1900-1914)", d: "Etapa de Psicología del Yo (1914-1939)" },
  "Simu 14 comentado _116": {
    a: "El individuo presenta distintas polaridades: cuerpo-mente, masculino-femenino o amor-odio.",
    b: "Se pretende que el sujeto explore el pasado y se proyecte en el futuro.",
    c: "Existe un impulso aprendido para completar la existencia.",
    d: "Es posible aislar un fenómeno para trabajarlo por separado.",
  },
  "Simu 14 comentado _118": { c: "De Shazer.", d: "Hayes." },
  "Simu 31 comentado Hardcore 1_167": { d: "Fue un seguidor de Mesmer anterior a Braid, quien más tarde acuñó el término hipnosis." },
  "SmCm12PIR2024 2_192": { a: "El individuo se encuentra involucrado en una relación intensa y perdurable." },
  "Simu 7 comentado _147": { a: "Forzar algo que solo puede ocurrir espontáneamente es una intervención específica." },
  "SmCm17PIR2025_029": {
    a: "Se activan espontáneamente ante estímulos externos.",
    b: "Aparecen como reacción a las emociones primarias.",
    c: "Se expresan con el objetivo de influir sobre los demás.",
    d: "Un ejemplo sería el miedo ante un peligro real.",
  },
  "SmCm18PIR2025_123": { a: "Psicología del Ello.", c: "Psicología del Yo." },
  "SmCm20PIR2024_087": { d: "El inconsciente personal se organiza en complejos y arquetipos." },
  "SmCm21PIR2025 (2)_133": { d: "Recoge dos tipos principales de juego psicótico: embrollo y eclosión." },
  "SmCm30PIR2025 (1)_173": { d: "Meta ficticia que influye y organiza la vida y la conducta del sujeto." },
  "SmCm21PIR2025 (2)_142": {
    a: "Tradición neofreudiana.",
    b: "Tradición analítica del yo.",
    c: "Psicoterapias psicoanalíticas.",
    d: "Tradición lacaniana.",
  },
  "SmCm22PIR2025 (1)_168": {
    a: "En la fase de latencia (desde los 6 años hasta la pubertad), el mecanismo de defensa característico es la sublimación.",
    b: "En la fase anal (3-5 años), la fijación total provoca patología de tipo obsesivo.",
    c: "En la fase oral (1-2 años), comienza la polaridad activo-pasivo.",
    d: "En la fase genital (adolescencia), predomina el desarrollo cognitivo y las relaciones con iguales.",
  },
  "SmCm23PIR2025_020": { a: "Objeto transicional.", b: "Técnica del juego.", c: "Arquetipo.", d: "Foco." },
  "SmCm24PIR2025 (1)_166": {
    a: "Sostenimiento o holding.",
    b: "Manejo o handling.",
    c: "Presentación objetal u object-presenting.",
    d: "Cuidado emocional o emotional-care.",
  },
  "SmCm24PIR2025 (1)_167": {
    a: "Es imposible no comunicar.",
    b: "La incongruencia entre niveles de comunicación da lugar a paradojas.",
    c: "La comunicación utiliza modalidades digitales y analógicas.",
    d: "La definición de una interacción está condicionada por la puntuación de la secuencia de hechos que hacen los participantes.",
  },
  "SmCm25PIR2025_145": { d: "La relación con el objeto materno está sujeta a la proyección de los instintos amorosos sobre el «pecho bueno» y de los instintos agresivos sobre el «pecho malo»." },
  "SmCm27PIR2025 (1)_125": { a: "Técnicas hipnóticas ericksonianas.", b: "Técnica del desafío.", c: "Ordalías.", d: "Técnica del pacto con el diablo." },
  "SmCm28PIR2025_129": { d: "Técnica del desafío." },
  "SmCm29PIR2025_135": { c: "Empatía.", d: "Autenticidad o congruencia." },
  "SmCm29PIR2025_138": { d: "Aliarse temporalmente con algunos miembros para desequilibrar el sistema y provocar una crisis." },
};

const removeIntro = (topics) => (Array.isArray(topics) ? topics : []).filter((topic) => topic !== INTRO);

const cleanText = (value) => String(value ?? "")
  .normalize("NFC")
  .replace(/[�]/g, "")
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[-‐‑]\s+([a-záéíóúüñ])/g, "$1$2")
  .replace(/\bclari\s+caci[oó]n\b/gi, "clarificación")
  .replace(/\batenci[oó]n\s+otante\b/gi, "atención flotante")
  .replace(/\bidenti\s+car\b/gi, "identificar")
  .replace(/\bine\s+caces\b/gi, "ineficaces")
  .replace(/\bdi\s+cultad(es)?\b/gi, "dificultad$1")
  .replace(/\bPSICOLOG[IÍ]A\s+AMIR\b/gi, "")
  .replace(/\b(?:sqhdo1e7qud|u3t9y967ptx|yh99aunfpwf|xnmavyu1k4l)\b/gi, "")
  .replace(/^\s*(?:\d+\s+){1,6}(?=[A-ZÁÉÍÓÚÜÑ¿])/u, "")
  .replace(/\s+/g, " ")
  .replace(/\s+([,.;:?!])/g, "$1")
  .trim()
  .replace(/\?:$/, "?");

const cleanQuestion = (question) => {
  const cleaned = {
    ...question,
    e: cleanText(question.e),
    o: Object.fromEntries(Object.entries(question.o || {}).map(([key, value]) => [key, cleanText(value)])),
    x: cleanText(question.x),
    r: cleanText(question.r),
  };
  if (questionEdits.has(question.id)) cleaned.e = questionEdits.get(question.id);
  if (optionEdits[question.id]) cleaned.o = { ...cleaned.o, ...optionEdits[question.id] };
  if (answerCorrections.has(question.id)) cleaned.c = answerCorrections.get(question.id);
  return cleaned;
};

const adults = readJson(adultPath);
const psychotherapies = readJson(psychotherapyPath);
const manifest = readJson(manifestPath);
const totalBefore = adults.length + psychotherapies.length;
const candidateIds = new Set([...Object.keys(evidence), ...excluded.keys()]);
const candidateQuestions = [...adults, ...psychotherapies].filter((question) => candidateIds.has(question.id));
if (candidateQuestions.length !== 117) {
  throw new Error(`Se esperaban 117 candidatas y se encontraron ${candidateQuestions.length}.`);
}

const includedIds = new Set([...candidateIds].filter((id) => !excluded.has(id)));
const missingEvidence = [...includedIds].filter((id) => !evidence[id]);
if (missingEvidence.length) throw new Error(`Falta evidencia curada para: ${missingEvidence.join(", ")}`);

const originallyInPsychotherapies = new Set([
  "1Simulacro02018Comentarios_106", "1Simulacro02018Comentarios_112", "1Simulacro02018Comentarios_114", "1Simulacro02018Comentarios_117",
  "3Simulacro2018Comentarios_036", "3Simulacro2018Comentarios_092", "4Simulacro02018Comentarios_143", "4Simulacro02018Comentarios_144",
  "4Simulacro02018Comentarios_145", "4Simulacro02018Comentarios_148", "4Simulacro02018Comentarios_152", "Simu 12 comentado_142",
  "Simu 13 comentado_090", "Simu 14 comentado _116", "Simu 14 comentado _118", "Simu 14 comentado _119", "Simu 14 comentado _120",
  "Simu 31 comentado Hardcore 1_167", "Simu 31 comentado Hardcore 1_173", "Simu 32 comentado hardcore 2_131",
  "Simu 32 comentado hardcore 2_133", "Simu 32 comentado hardcore 2_137", "Simu 32 comentado hardcore 2_139",
  "Simu 7 comentado _138", "Simu 7 comentado _147", "Simu 8 comentado _001", "SmCm08PIR2025_006", "SmCm10PIR2025_173",
  "SmCm12PIR2024 2_192", "SmCm13PIR2025_208", "SmCm16PIR2025_114", "SmCm16PIR2025_118", "SmCm17PIR2025_018",
  "SmCm17PIR2025_024", "SmCm17PIR2025_029", "SmCm17PIR2025_037", "SmCm17PIR2025_204", "SmCm18PIR2025_123",
  "SmCm18PIR2025_130", "SmCm19PIR2024_107", "SmCm20PIR2024_087", "SmCm20PIR2025 (1)_130", "SmCm20PIR2025 (1)_134",
  "SmCm21PIR2025 (2)_002", "SmCm21PIR2025 (2)_133", "SmCm21PIR2025 (2)_139", "SmCm21PIR2025 (2)_142",
  "SmCm22PIR2025 (1)_168", "SmCm22PIR2025_118", "SmCm22PIR2025_119", "SmCm23PIR2025_020", "SmCm24PIR2025 (1)_159",
  "SmCm24PIR2025 (1)_166", "SmCm24PIR2025 (1)_167", "SmCm25PIR2025_137", "SmCm25PIR2025_145", "SmCm26PIR2025_137",
  "SmCm26PIR2025_140", "SmCm27PIR2025 (1)_123", "SmCm27PIR2025 (1)_125", "SmCm28PIR2025_128", "SmCm28PIR2025_129",
  "SmCm29PIR2025_135", "SmCm29PIR2025_138", "SmCm29PIR2025_141", "SmCm30PIR2025 (1)_080", "SmCm30PIR2025 (1)_172",
  "SmCm30PIR2025 (1)_173",
]);

const finalAdults = adults.filter((question) => !candidateIds.has(question.id));
const finalPsychotherapies = psychotherapies.filter((question) => !candidateIds.has(question.id));
const restoredPsychotherapies = [];

for (const original of candidateQuestions) {
  const question = cleanQuestion(original);
  if (includedIds.has(question.id)) {
    const [justification, refKey] = evidence[question.id];
    finalAdults.push({
      ...question,
      s: ADULT,
      t: [INTRO],
      x: justification,
      r: refs[refKey],
      v: "VALIDADA_ORIGINAL",
    });
    continue;
  }

  const withoutIntro = { ...question, t: removeIntro(question.t) };
  if (originallyInPsychotherapies.has(question.id)) {
    const restored = { ...withoutIntro, s: PSYCHOTHERAPIES };
    restoredPsychotherapies.push(restored);
    finalPsychotherapies.push(restored);
  } else {
    finalAdults.push(withoutIntro);
  }
}

const allQuestions = [...finalAdults, ...finalPsychotherapies];
const allIds = allQuestions.map((question) => question.id);
if (new Set(allIds).size !== allIds.length) throw new Error("La revisión generaría identificadores duplicados.");
if (allQuestions.length !== totalBefore) throw new Error("La revisión cambiaría el total del banco.");

const finalIntro = finalAdults.filter((question) => question.t?.includes(INTRO));
if (finalIntro.length !== includedIds.size) throw new Error("El recuento final de Introducción no coincide con las decisiones.");
if (finalIntro.some((question) => !question.x || !question.r || question.v !== "VALIDADA_ORIGINAL")) {
  throw new Error("Hay preguntas de Introducción sin justificación, referencia original o validación.");
}
if (finalIntro.some((question) => Object.values(question.o || {}).some((option) => option.length > 360))) {
  throw new Error("Queda alguna alternativa anormalmente larga en Introducción.");
}

manifest.subjects[ADULT].count = finalAdults.length;
manifest.subjects[ADULT].topics = [INTRO, ...manifest.subjects[ADULT].topics.filter((topic) => topic !== INTRO)];
manifest.subjects[PSYCHOTHERAPIES].count = finalPsychotherapies.length;
manifest.total = Object.values(manifest.subjects).reduce((sum, subject) => sum + subject.count, 0);

const report = {
  reviewedCandidates: candidateQuestions.length,
  includedAndValidated: finalIntro.length,
  excludedFromIntroduction: excluded.size,
  restoredToPsychotherapies: restoredPsychotherapies.length,
  retainedInTreatmentsOutsideIntroduction: excluded.size - restoredPsychotherapies.length,
  correctedAnswerKeys: [...answerCorrections].map(([id, answer]) => ({ id, answer })),
  totalBankQuestions: manifest.total,
  preservedQuestionIds: true,
  exclusions: Object.fromEntries(excluded),
};

fs.writeFileSync(adultPath, `${JSON.stringify(finalAdults)}\n`, "utf8");
fs.writeFileSync(psychotherapyPath, `${JSON.stringify(finalPsychotherapies)}\n`, "utf8");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
