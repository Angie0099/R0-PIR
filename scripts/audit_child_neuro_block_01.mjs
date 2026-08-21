import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(scriptDir, "../public/banco/psicopatologia_infantil.json");
const dsm = "American Psychiatric Association (2023). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales. Texto revisado. Editorial Médica Panamericana.";

const edits = {
  "Simu 7 comentado _114": {
    e: "En relación con el trastorno del espectro autista (TEA) según el DSM-5-TR, señale la afirmación incorrecta.",
    o: {
      a: "Las deficiencias en comunicación e interacción social incluyen dificultades en reciprocidad socioemocional, comunicación no verbal y desarrollo, mantenimiento y comprensión de relaciones.",
      b: "Los patrones restrictivos y repetitivos incluyen movimientos o habla estereotipados, rutinas inflexibles, intereses restringidos y reactividad sensorial inusual.",
      c: "Para diagnosticar conjuntamente discapacidad intelectual y TEA es necesario que el cociente intelectual esté por debajo de lo previsto para el nivel general de desarrollo.",
      d: "Existen tres niveles de gravedad en función del deterioro en comunicación social y en comportamientos restringidos y repetitivos.",
    },
    c: "c",
    x: "La afirmación incorrecta es la c. Cuando coinciden discapacidad intelectual y TEA, la comunicación social debe estar por debajo de lo esperado para el nivel general de desarrollo; no se establece ese diagnóstico por un cociente intelectual bajo aislado.",
    r: `${dsm} Trastorno del espectro autista: criterios diagnósticos, p. 57.`,
    v: "CORREGIDA",
  },
  SmCm17PIR2025_061: {
    e: "En el diagnóstico diferencial del trastorno del espectro autista (TEA), ¿cuál de las siguientes afirmaciones es falsa?",
    o: {
      a: "Puede diagnosticarse TDAH de forma comórbida si las dificultades atencionales o la hiperactividad superan lo esperable en el TEA.",
      b: "En la esquizofrenia pueden aparecer creencias atípicas y deterioro social que se confundan con características del espectro autista.",
      c: "En el trastorno de la comunicación social (pragmático) hay dificultades de comunicación social, pero no patrones de comportamiento restringidos y repetitivos.",
      d: "Nunca debe diagnosticarse trastorno de movimientos estereotipados en un niño con TEA, porque las estereotipias están incluidas en el diagnóstico.",
    },
    c: "d",
    x: "La afirmación d es falsa por su carácter absoluto. El trastorno de movimientos estereotipados puede diagnosticarse de forma adicional cuando las estereotipias causan autolesión y requieren tratamiento específico. El trastorno de la comunicación social no incluye patrones restrictivos y repetitivos.",
    r: `${dsm} TEA: diagnóstico diferencial, pp. 55 y 90-91.`,
    v: "CORREGIDA",
  },
  SmCm1PIR2024_169: {
    e: "Según el DSM-5-TR, ¿qué descripción corresponde al trastorno de la comunicación social (pragmático)?",
    o: {
      a: "Dificultad persistente en la producción fonológica que interfiere con la inteligibilidad del habla.",
      b: "Dificultad persistente en el uso social de la comunicación verbal y no verbal.",
      c: "Alteraciones persistentes de la fluidez verbal, como repeticiones de sonidos y sílabas, que dificultan la conversación.",
      d: "Síntomas que se identifican habitualmente solo en la adolescencia tardía.",
    },
    c: "b",
    x: "El trastorno de la comunicación social (pragmático) se caracteriza por dificultades persistentes en el uso social de la comunicación verbal y no verbal. Puede hacerse evidente a partir de los 4 o 5 años, aunque las formas leves pueden no detectarse hasta la adolescencia temprana.",
    r: `${dsm} Trastorno de la comunicación social (pragmático): criterios diagnósticos, pp. 54-55.`,
    v: "CORREGIDA",
  },
  "Simu 6 comentado__098": {
    e: "¿Cuál de las siguientes descripciones corresponde al grado 3 («necesita ayuda muy considerable») en el dominio de comportamientos restringidos y repetitivos del TEA según el DSM-5-TR?",
    o: {
      a: "La inflexibilidad comportamental produce interferencia significativa en uno o más contextos.",
      b: "Los comportamientos restringidos y repetitivos interfieren en diversos contextos y se acompañan de ansiedad o dificultad para cambiar el foco de la acción.",
      c: "La inflexibilidad comportamental, la extrema dificultad para afrontar cambios y otros comportamientos restringidos y repetitivos interfieren notablemente en todos los ámbitos, con ansiedad intensa o gran dificultad para cambiar el foco de la acción.",
      d: "Las dificultades principales se limitan a la comunicación social, sin referencia a comportamientos restringidos o repetitivos.",
    },
    c: "c",
    x: "El grado 3 en comportamientos restringidos y repetitivos implica interferencia notable en todos los ámbitos, extrema dificultad para afrontar cambios y ansiedad intensa o gran dificultad para cambiar el foco de la acción. Las alternativas a y b describen respectivamente los grados 1 y 2.",
    r: `${dsm} Tabla 2, niveles de gravedad del trastorno del espectro autista, p. 58.`,
    v: "CORREGIDA",
  },
  "Simu 7 comentado _084": {
    e: "Según el DSM-5-TR, ¿qué presentación del TDAH puede considerarse en un niño menor de 17 años que durante al menos seis meses presenta seis o más síntomas de inatención y menos de seis síntomas de hiperactividad-impulsividad?",
    o: {
      a: "Presentación predominante con falta de atención.",
      b: "Presentación predominante hiperactiva/impulsiva.",
      c: "Presentación combinada.",
      d: "No puede plantearse un diagnóstico de TDAH.",
    },
    c: "a",
    x: "La presentación predominante con falta de atención se aplica cuando se cumplen los criterios de inatención durante los últimos seis meses, pero no los de hiperactividad-impulsividad. En menores de 17 años se requieren seis o más síntomas del dominio correspondiente.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: presentaciones y criterios diagnósticos, pp. 68-70.`,
    v: "CORREGIDA",
  },
  "SmCm7PIR2024_133": {
    e: "Según el DSM-5-TR, ¿qué presentación del TDAH puede considerarse en un niño menor de 17 años que durante al menos seis meses presenta seis o más síntomas de inatención y menos de seis síntomas de hiperactividad-impulsividad?",
    o: {
      a: "Presentación predominante con falta de atención.",
      b: "Presentación predominante hiperactiva/impulsiva.",
      c: "Presentación combinada.",
      d: "No puede plantearse un diagnóstico de TDAH.",
    },
    c: "a",
    x: "La presentación predominante con falta de atención se aplica cuando se cumplen los criterios de inatención durante los últimos seis meses, pero no los de hiperactividad-impulsividad. En menores de 17 años se requieren seis o más síntomas del dominio correspondiente.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: presentaciones y criterios diagnósticos, pp. 68-70.`,
    v: "CORREGIDA",
  },
  "Simu 7 comentado _115": {
    e: "Según el DSM-5-TR, ¿cuál de las siguientes afirmaciones sobre el TDAH no es correcta?",
    o: {
      a: "La prevalencia estimada es aproximadamente del 7,2 % en niños y del 2,5 % en adultos.",
      b: "La inatención es la manifestación que suele aparecer más temprano en la edad preescolar.",
      c: "Los trastornos disruptivos son frecuentemente comórbidos.",
      d: "En población infantil el TDAH es más frecuente en varones, con una proporción aproximada de 2:1.",
    },
    c: "b",
    x: "La afirmación b es incorrecta: en la etapa preescolar la hiperactividad suele ser la manifestación más prominente. El DSM-5-TR estima una prevalencia aproximada del 7,2 % en niños y del 2,5 % en adultos, y recoge la frecuente comorbilidad con trastornos disruptivos.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: prevalencia y desarrollo y curso, pp. 70-71.`,
    v: "CORREGIDA",
  },
  "SmCm12PIR2024 2_179": {
    e: "Señale la afirmación incorrecta sobre el TDAH según el DSM-5-TR.",
    o: {
      a: "Es frecuente que los niños con TDAH presenten retrasos leves del desarrollo lingüístico, motor o social.",
      b: "Durante la juventud, el TDAH se asocia a mayor riesgo de intentos de suicidio, especialmente con comorbilidad del estado de ánimo, de la conducta o por consumo de sustancias.",
      c: "En la edad preescolar destacan sobre todo los síntomas de inatención, mientras que en la escolarización primaria los síntomas de hiperactividad cobran mayor protagonismo.",
      d: "El TDAH aparece en la mayoría de las culturas, con una prevalencia aproximada del 7,2 % en niños y del 2,5 % en adultos.",
    },
    c: "c",
    x: "La afirmación c es incorrecta porque, en edad preescolar, la hiperactividad suele ser la manifestación más prominente. La inatención se hace más evidente cuando aumentan las demandas escolares. Las demás afirmaciones son compatibles con el DSM-5-TR.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: desarrollo, curso y prevalencia, pp. 70-71.`,
    v: "CORREGIDA",
  },
  "Simu 15 comentado_103": {
    e: "¿Cuál de las siguientes afirmaciones sobre los especificadores del TEA es incorrecta?",
    o: {
      a: "El TEA puede especificarse con déficit intelectual acompañante cuando concurren los criterios correspondientes.",
      b: "El TEA siempre se acompaña de deterioro del lenguaje.",
      c: "Puede especificarse asociado a una afección médica o genética conocida.",
      d: "Puede presentarse con catatonía, que requiere especificación adicional cuando concurre.",
    },
    c: "b",
    x: "La afirmación b es incorrecta: el DSM-5-TR permite especificar el TEA con o sin deterioro del lenguaje acompañante. No todas las personas con TEA presentan deterioro del lenguaje.",
    r: `${dsm} Trastorno del espectro autista: especificadores, pp. 57-60.`,
    v: "CORREGIDA",
  },
  "SmCm27PIR2025 (1)_187": {
    e: "Señale la opción incorrecta sobre el diagnóstico del trastorno del espectro autista (TEA) según el DSM-5-TR.",
    o: {
      a: "El diagnóstico de TEA puede ser comórbido con discapacidad intelectual.",
      b: "El diagnóstico de TEA puede ser comórbido con TDAH.",
      c: "El diagnóstico de TEA puede establecerse de forma comórbida con el trastorno de la comunicación social (pragmático).",
      d: "El trastorno de movimientos estereotipados puede diagnosticarse adicionalmente cuando las estereotipias causan autolesión y requieren tratamiento específico.",
    },
    c: "c",
    x: "La afirmación c es incorrecta. El trastorno de la comunicación social (pragmático) solo debe considerarse cuando no se cumplen, ni actualmente ni en la historia del desarrollo, los criterios de patrones restrictivos y repetitivos propios del TEA.",
    r: `${dsm} Trastorno de la comunicación social (pragmático): diagnóstico diferencial, pp. 55 y 61.`,
    v: "CORREGIDA",
  },
  "simu 9 comentado_112": {
    e: "¿Qué descripción diferencia mejor las estereotipias motoras de los tics?",
    o: {
      a: "Los tics son rítmicos y prolongados, mientras que las estereotipias son breves y fluctuantes.",
      b: "Las estereotipias suelen ser más fijas, rítmicas y prolongadas; los tics son breves, rápidos, no rítmicos y fluctuantes.",
      c: "Las estereotipias solo aparecen de forma esporádica y los tics son constantes.",
      d: "Los tics no son movimientos estereotipados y las estereotipias siempre son voluntarias.",
    },
    c: "b",
    x: "Los tics son movimientos o vocalizaciones súbitos, rápidos, recurrentes y no rítmicos, con curso fluctuante. Las estereotipias motoras suelen ser más fijas, rítmicas y prolongadas, por lo que esta diferencia es más precisa que oponer simplemente «voluntario» e «involuntario».",
    r: `${dsm} Trastorno de movimientos estereotipados y trastornos de tics: diagnóstico diferencial, pp. 91, 94 y 97.`,
    v: "CORREGIDA",
  },
  "Simu 15 comentado_105": {
    e: "En el curso del TDAH, ¿qué síntomas tienden a mantenerse relativamente estables en la edad adulta?",
    o: { a: "Los síntomas de impulsividad.", b: "Los síntomas de hiperactividad.", c: "Los síntomas de inatención.", d: "Todos se mantienen estables en la edad adulta." },
    c: "c",
    x: "Con la edad suelen disminuir la hiperactividad y la impulsividad, mientras que las dificultades de inatención persisten con mayor frecuencia en la edad adulta.",
    r: `${dsm} Trastorno por déficit de atención/hiperactividad: desarrollo y curso, pp. 70-72.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm17PIR2025_065: {
    e: "En el TDAH, ¿cuál de los siguientes corresponde a un síntoma de impulsividad?",
    o: { a: "Mover en exceso manos o pies o retorcerse en el asiento.", b: "Extraviar objetos necesarios para tareas o actividades.", c: "Abandonar el asiento en situaciones en las que se espera permanecer sentado.", d: "Interrumpir o inmiscuirse en las actividades de otras personas." },
    c: "d",
    x: "Interrumpir o inmiscuirse en las actividades de otras personas forma parte de los síntomas de impulsividad. Las alternativas a y c son síntomas de hiperactividad, y b pertenece a inatención.",
    r: `${dsm} TDAH: síntomas de hiperactividad e impulsividad, pp. 68-69.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm20PIR2025 (1)_104": {
    e: "Que un niño no consiga terminar tareas escolares ni seguir instrucciones hasta completarlas corresponde a un síntoma de TDAH del grupo de:",
    o: { a: "Inatención.", b: "Impulsividad.", c: "Hiperactividad.", d: "Inquietud." },
    c: "a",
    x: "La dificultad para seguir instrucciones y terminar tareas es un síntoma de inatención en el TDAH. No pertenece a los grupos de hiperactividad o impulsividad.",
    r: `${dsm} TDAH: síntomas de inatención, pp. 68-69.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm23PIR2025_099: {
    e: "Cuando los padres de un niño con TDAH indican que parece no escuchar cuando se le habla directamente, ¿a qué grupo de síntomas se refieren?",
    o: { a: "Hiperactividad.", b: "Impulsividad.", c: "Inatención.", d: "Déficit exclusivo de atención sostenida." },
    c: "c",
    x: "Parecer no escuchar cuando se le habla directamente es uno de los síntomas de inatención descritos en el DSM-5-TR para el TDAH.",
    r: `${dsm} TDAH: síntomas de inatención, pp. 68-69.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm27PIR2025 (1)_083": {
    e: "Según los criterios diagnósticos del DSM-5-TR para el TDAH, ¿cuál de las siguientes afirmaciones es correcta?",
    o: { a: "Todos los síntomas deben estar presentes antes de los 7 años.", b: "Varios síntomas de inatención o hiperactividad-impulsividad deben haber estado presentes antes de los 12 años.", c: "Los síntomas solo pueden aparecer durante un trastorno del desarrollo generalizado.", d: "No existe requisito de edad de inicio." },
    c: "b",
    x: "El criterio B del DSM-5-TR exige que varios síntomas de inatención o hiperactividad-impulsividad estuvieran presentes antes de los 12 años. No se exige que todos aparezcan antes de los 7 años.",
    r: `${dsm} TDAH: criterio B de edad de inicio, pp. 69-70.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm06PIR2025_188: {
    e: "Señale la afirmación falsa sobre el trastorno del espectro autista (TEA) según el DSM-5-TR.",
    o: {
      a: "Los primeros síntomas pueden relacionarse con retraso del lenguaje, falta de interés social, relaciones sociales atípicas, patrones de juego inusuales o comunicación peculiar.",
      b: "Si existe epilepsia comórbida, es más probable que el TEA se asocie a mayor discapacidad intelectual y menor capacidad verbal.",
      c: "En muestras clínicas es más probable encontrar discapacidad intelectual acompañante entre los niños que entre las niñas con TEA.",
      d: "Factores culturales y socioeconómicos pueden afectar la edad de reconocimiento o diagnóstico.",
    },
    c: "c",
    x: "La afirmación c es falsa. En muestras clínicas, la discapacidad intelectual acompañante se observa con mayor probabilidad entre las niñas con TEA. Las demás alternativas recogen características descritas por el DSM-5-TR.",
    r: `${dsm} Trastorno del espectro autista: desarrollo, curso y aspectos relacionados con sexo y género, pp. 56-65.`,
    v: "CORREGIDA",
  },
  SmCm09PIR2025_165: {
    e: "Los padres de un niño de 3 años consultan porque apenas habla ni mira a los ojos, no señala los juguetes que le gustan, no busca a otros niños para jugar, se balancea y grita ante sonidos agudos. ¿Qué diagnóstico orienta mejor esta descripción?",
    o: { a: "Trastorno de apego reactivo.", b: "Trastorno del espectro autista.", c: "Discapacidad intelectual sin TEA.", d: "Trastorno del lenguaje." },
    c: "b",
    x: "La descripción reúne déficits persistentes de comunicación e interacción social junto con comportamientos repetitivos y reactividad sensorial inusual, características nucleares del TEA.",
    r: `${dsm} Trastorno del espectro autista: criterios diagnósticos, pp. 56-65.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm13PIR2025_179: {
    e: "¿Qué grado de gravedad del TEA corresponde a un niño con dificultades graves en comunicación social verbal y no verbal, inicio muy limitado de interacciones y respuesta mínima a la apertura social de otras personas?",
    o: { a: "Grado 1.", b: "Grado 2.", c: "Grado 3.", d: "Grado 4." },
    c: "c",
    x: "El grado 3 («necesita ayuda muy considerable») se caracteriza por deficiencias graves de las aptitudes de comunicación social, inicio muy limitado de interacciones y respuesta mínima a la apertura social de otras personas.",
    r: `${dsm} Tabla 2, niveles de gravedad del TEA, p. 58.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm14PIR2025_172: {
    e: "¿Qué grado de gravedad del TEA corresponde a un niño que, pese a recibir ayuda, presenta deficiencias notables en comunicación social verbal y no verbal, poco inicio de interacciones y respuestas reducidas o anormales a la apertura social?",
    o: { a: "Grado 1.", b: "Grado 2.", c: "Grado 3.", d: "Grado 4." },
    c: "b",
    x: "El grado 2 («necesita ayuda notable») implica deficiencias notables de comunicación social y problemas sociales obvios incluso con ayuda in situ, con inicio limitado de interacciones y respuestas reducidas o anormales.",
    r: `${dsm} Tabla 2, niveles de gravedad del TEA, p. 58.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm17PIR2025_062: {
    e: "¿Cuál de los siguientes enunciados no corresponde a un criterio diagnóstico del trastorno del espectro autista?",
    o: { a: "Alteraciones anímicas que causan malestar.", b: "Dificultades en la reciprocidad socioemocional.", c: "Conducta, lenguaje o uso de objetos estereotipados o repetitivos.", d: "Hiper- o hiporrespuesta a estímulos sensoriales." },
    c: "a",
    x: "Las alteraciones anímicas no forman parte de los criterios nucleares del TEA. En cambio, las dificultades de reciprocidad socioemocional, las conductas repetitivas y la reactividad sensorial inusual sí se incluyen en sus criterios diagnósticos.",
    r: `${dsm} Trastorno del espectro autista: criterios diagnósticos, pp. 56-57.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm1PIR2024_030: {
    e: "¿A qué grado de gravedad del TEA corresponde un caso que, sin ayuda in situ, presenta problemas importantes de comunicación social y cuya inflexibilidad comportamental interfiere significativamente en uno o más contextos?",
    o: { a: "Grado 1.", b: "Grado 2.", c: "Grado 3.", d: "Grado 4." },
    c: "a",
    x: "El grado 1 («necesita ayuda») implica que, sin ayuda in situ, las deficiencias de comunicación social causan problemas importantes y que la inflexibilidad comportamental interfiere significativamente en uno o más contextos.",
    r: `${dsm} Tabla 2, niveles de gravedad del TEA, p. 58.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm1PIR2024_031: {
    e: "¿Qué requisito debe cumplirse para diagnosticar de forma comórbida discapacidad intelectual y trastorno del espectro autista según el DSM-5-TR?",
    o: { a: "La comunicación social debe estar por debajo de lo esperado para el nivel general de desarrollo.", b: "Deben existir movimientos, uso de objetos o habla estereotipados o repetitivos.", c: "Debe presentarse hiporreactividad ante estímulos sensoriales.", d: "Ambos diagnósticos deben confirmarse exclusivamente mediante pruebas psicométricas estandarizadas." },
    c: "a",
    x: "Para que coexistan discapacidad intelectual y TEA, la comunicación social debe estar por debajo de lo esperado para el nivel general de desarrollo. Los demás elementos pueden aparecer en TEA, pero no son el requisito específico de comorbilidad con discapacidad intelectual.",
    r: `${dsm} Trastorno del espectro autista: criterio E, p. 57.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm21PIR2025 (2)_075": {
    e: "Señale la opción incorrecta sobre la catatonía asociada al trastorno del espectro autista según el DSM-5-TR.",
    o: { a: "El periodo de mayor riesgo para la catatonía comórbida parece situarse durante la primera infancia.", b: "Algunas personas pueden presentar enlentecimiento motor o quedarse «congeladas» en mitad de una acción.", c: "El TEA cuenta con un especificador de catatonía cuando concurre.", d: "El periodo de riesgo para la catatonía comórbida parece ser mayor durante la adolescencia." },
    c: "a",
    x: "La opción a es incorrecta: el DSM-5-TR señala un mayor riesgo de catatonía comórbida durante la adolescencia. La catatonía puede incluir enlentecimiento motor o inmovilidad y se registra con un especificador adicional.",
    r: `${dsm} Trastorno del espectro autista: catatonía y desarrollo y curso, pp. 60-61.`,
    v: "VALIDADA_ORIGINAL",
  },
  "SmCm30PIR2025 (1)_156": {
    e: "¿Cuál de las siguientes es una característica compatible con el trastorno del espectro autista?",
    o: { a: "Siempre cursa con discapacidad intelectual.", b: "Tras dos años de desarrollo normal se inicia necesariamente una pérdida amplia de lenguaje, habilidades sociales, control vesical y habilidades motoras.", c: "Puede observarse contacto visual alterado.", d: "Se presenta mayoritariamente en mujeres." },
    c: "c",
    x: "El contacto visual alterado puede formar parte de las dificultades de comunicación no verbal del TEA. El TEA no siempre cursa con discapacidad intelectual, no exige una regresión generalizada y se diagnostica con mayor frecuencia en varones.",
    r: `${dsm} Trastorno del espectro autista: características diagnósticas, pp. 57-60.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 15 comentado_107": {
    e: "En el trastorno de la fluidez de inicio en la infancia, la prevalencia en función del sexo es:",
    o: { a: "Mayor en mujeres.", b: "Mayor en varones.", c: "Similar en mujeres y varones.", d: "Mayor en varones hasta la pubertad y equivalente después." },
    c: "b",
    x: "El trastorno de la fluidez de inicio en la infancia es más frecuente en varones que en mujeres. La proporción aumenta con la edad, ya que la recuperación es más frecuente en niñas.",
    r: `${dsm} Trastorno de la fluidez de inicio en la infancia: prevalencia y desarrollo, pp. 51-53.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 16 comentado_194": {
    e: "Según el DSM-5-TR, ¿qué diagnóstico debe considerarse en un niño con dificultades persistentes en el uso social de la comunicación verbal y no verbal, sin patrones restringidos o repetitivos y sin discapacidad intelectual?",
    o: { a: "Síndrome de Asperger.", b: "Trastorno de la comunicación social (pragmático).", c: "Trastorno del espectro autista.", d: "Trastorno del lenguaje." },
    c: "b",
    x: "El trastorno de la comunicación social (pragmático) se caracteriza por dificultades persistentes en el uso social de la comunicación sin los patrones de comportamiento, intereses o actividades restringidos y repetitivos requeridos para TEA.",
    r: `${dsm} Trastorno de la comunicación social (pragmático): criterios y diagnóstico diferencial, pp. 54-55.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 32 comentado hardcore 2_088": {
    e: "Respecto a los trastornos de la comunicación, señale la afirmación correcta.",
    o: { a: "El trastorno de la comunicación social comparte con el TEA los comportamientos e intereses restringidos y repetitivos.", b: "La repetición de sonidos y sílabas puede ser un criterio diagnóstico del trastorno de la fluidez de inicio en la infancia.", c: "No puede diagnosticarse trastorno de la comunicación social si existe discapacidad intelectual.", d: "La prevalencia del trastorno fonológico en adultos es del 15 % según el DSM-5-TR." },
    c: "b",
    x: "La repetición de sonidos y sílabas es una de las alteraciones de la fluidez recogidas en el trastorno de la fluidez de inicio en la infancia. El trastorno de la comunicación social se distingue del TEA por la ausencia de patrones restrictivos y repetitivos.",
    r: `${dsm} Trastorno de la fluidez de inicio en la infancia y trastorno de la comunicación social, pp. 51-55.`,
    v: "VALIDADA_ORIGINAL",
  },
  "Simu 8 comentado _004": {
    e: "Respecto al trastorno de la comunicación social (pragmático), señale la afirmación falsa.",
    o: { a: "El diagnóstico es frecuente entre los niños menores de 4 años.", b: "Las formas leves pueden no resultar evidentes hasta la adolescencia temprana, cuando el lenguaje y las interacciones sociales son más complejos.", c: "Algunos niños mejoran sustancialmente, mientras que otros presentan dificultades que persisten hasta la edad adulta.", d: "Incluso tras una mejoría significativa, las deficiencias tempranas en pragmática pueden causar alteraciones duraderas en las relaciones y el comportamiento social." },
    c: "a",
    x: "La afirmación a es falsa: el diagnóstico es raro antes de los 4 años, ya que la comunicación social pragmática depende de un desarrollo suficiente del habla y del lenguaje. Las formas leves pueden ser evidentes más tarde.",
    r: `${dsm} Trastorno de la comunicación social (pragmático): desarrollo y curso, pp. 54-55.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm06PIR2025_190: {
    e: "¿Qué trastorno puede presentar un niño de 13 años que desde los 10 años presenta tics vocales intermitentes pero persistentes, sin tics motores, causa médica ni consumo de sustancias?",
    o: { a: "Trastorno de Gilles de la Tourette.", b: "Trastorno de tics motores o vocales persistente.", c: "Trastorno de tics provisional.", d: "Trastorno de movimientos estereotipados." },
    c: "b",
    x: "El trastorno de tics motores o vocales persistente requiere tics motores o vocales, pero no ambos, durante más de un año y con inicio antes de los 18 años. El caso describe tics vocales persistentes sin tics motores.",
    r: `${dsm} Trastorno de tics motores o vocales persistente: criterios diagnósticos, pp. 93-98.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm18PIR2025_083: {
    e: "¿Cuál de los siguientes tics vocales puede considerarse complejo?",
    o: { a: "Aclarar la garganta.", b: "Olisquear.", c: "Coprolalia.", d: "Silbar." },
    c: "c",
    x: "La coprolalia, emisión de palabras o frases obscenas, es un tic vocal complejo. Aclarar la garganta, olisquear o silbar se consideran ejemplos de tics vocales simples.",
    r: `${dsm} Trastornos de tics: características clínicas, pp. 93-98.`,
    v: "VALIDADA_ORIGINAL",
  },
  SmCm23PIR2025_098: {
    e: "Señale la respuesta correcta sobre los trastornos motores en el DSM-5-TR.",
    o: { a: "Se mantienen invariables con respecto a la edición anterior del DSM.", b: "Se excluye de este subapartado el trastorno de movimientos estereotipados.", c: "Desaparece el criterio de malestar clínicamente significativo en los trastornos de tics.", d: "Desaparece el trastorno de tics no especificado." },
    c: "c",
    x: "En el DSM-5, y mantenido en el DSM-5-TR, los trastornos de tics no requieren el criterio de malestar clínicamente significativo o deterioro. El trastorno de movimientos estereotipados continúa en la categoría y persiste la categoría de otro trastorno de tics especificado o no especificado.",
    r: `${dsm} Trastornos motores: cambios en criterios de tics, pp. 93-98.`,
    v: "VALIDADA_ORIGINAL",
  },
};

const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const idsBefore = new Set(questions.map((question) => question.id));
const missing = Object.keys(edits).filter((id) => !idsBefore.has(id));
if (missing.length) throw new Error(`No se encontraron las preguntas: ${missing.join(", ")}`);

const next = questions.map((question) => {
  const edit = edits[question.id];
  return edit ? { ...question, ...edit, o: edit.o } : question;
});
const idsAfter = new Set(next.map((question) => question.id));
if (next.length !== questions.length || idsAfter.size !== idsBefore.size || [...idsBefore].some((id) => !idsAfter.has(id))) {
  throw new Error("La auditoría modificaría el total o los identificadores de preguntas.");
}
for (const [id, edit] of Object.entries(edits)) {
  const question = next.find((candidate) => candidate.id === id);
  if (question.c !== edit.c || !question.x || !question.r || question.v !== edit.v) {
    throw new Error(`La revisión de ${id} no está completa.`);
  }
}

fs.writeFileSync(bankPath, `${JSON.stringify(next)}\n`, "utf8");
console.log(JSON.stringify({
  block: "Psicopatología Infantil 05 — TDAH, TEA, comunicación y tics",
  reviewed: Object.keys(edits).length,
  corrected: Object.values(edits).filter((edit) => edit.v === "CORREGIDA").length,
  validated: Object.values(edits).filter((edit) => edit.v === "VALIDADA_ORIGINAL").length,
  preservedQuestionIds: true,
}, null, 2));
