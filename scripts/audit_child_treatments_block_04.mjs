import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const paths = {
  treatments: path.join(bancoDir, "tratamientos_infantiles.json"),
  child: path.join(bancoDir, "psicopatologia_infantil.json"),
  clinical: path.join(bancoDir, "psicologia_clinica.json"),
  adult: path.join(bancoDir, "tratamientos_adultos.json"),
  evaluation: path.join(bancoDir, "evaluacion_psicologica.json"),
  personality: path.join(bancoDir, "psicologia_de_la_personalidad_y_diferencial.json"),
  basic: path.join(bancoDir, "psicologia_basica.json"),
  social: path.join(bancoDir, "psicologia_social.json"),
  developmental: path.join(bancoDir, "psicologia_evolutiva.json"),
  experimental: path.join(bancoDir, "psicologia_experimental.json"),
  manifest: path.join(bancoDir, "manifest.json"),
};

const CHILD_TREATMENTS = "Tratamientos Infantiles";
const CHILD_PSYCHOPATHOLOGY = "Psicopatología Infantil";
const CLINICAL = "Psicología Clínica";
const ADULT_TREATMENTS = "Tratamientos Adultos";
const EVALUATION = "Evaluación Psicológica";
const PERSONALITY = "Psicología de la Personalidad y Diferencial";
const BASIC = "Psicología Básica";
const SOCIAL = "Psicología Social";
const DEVELOPMENTAL = "Psicología Evolutiva";
const EXPERIMENTAL = "Psicología Experimental";

const anxietySourceTopic = "Trastornos de ansiedad infantojuvenil";
const traumaSourceTopic = "Trastornos relacionados con trauma infantojuvenil";
const childAnxietyTopic = "Trastornos de ansiedad infantojuveniles";
const childTraumaTopic = "Trastornos relacionados con traumas y factores de estrés infantojuveniles";
const childAutismTopic = "Trastorno del espectro autista";
const childConductTopic = "Trastornos de conducta infantojuvenil";
const clinicalModelsTopic = "Modelos en psicopatología";
const clinicalNeurocognitiveTopic = "Trastornos neurocognitivos";
const clinicalPerceptionTopic = "Psicopatología de la sensopercepción";
const clinicalAffectivityTopic = "Psicopatología de la afectividad";
const clinicalAnxietyTopic = "Trastornos de ansiedad";
const adultPsychosisTopic = "Tratamiento de la psicosis y esquizofrenia";
const evaluationSubjectiveTopic = "Técnicas subjetivas";
const evaluationChildTopic = "Evaluación infantil";
const evaluationPersonalityTopic = "Tests de personalidad";
const evaluationIntelligenceTopic = "Tests de inteligencia y aptitudes";
const personalityCognitiveTopic = "Teorías cognitivas de la personalidad";
const personalityFactorTopic = "Otros modelos factoriales";
const personalityBiologicalTopic = "Teorías biológicas de la personalidad";
const personalityIdentityTopic = "La identidad personal";
const personalityResearchTopic = "Estrategias de investigación en Psicología Diferencial";
const basicEmotionTopic = "Emoción";
const basicLearningTopic = "Aprendizaje y condicionamiento";
const basicMotivationTopic = "Motivación y emoción";
const socialAttributionTopic = "Cognición social y procesos de atribución";
const infancyTopic = "Primera infancia (0-2 años)";
const adolescenceTopic = "La adolescencia";
const statisticsTopic = "Estadística";
const psychometricsTopic = "Psicometría";
const reviewedStatuses = new Set(["VALIDADA_ORIGINAL", "VALIDADA_DRIVE", "CORREGIDA"]);

const DSM = "American Psychiatric Association. (2022). DSM-5-TR: Manual diagnóstico y estadístico de los trastornos mentales (5.ª ed. rev.).";
const CHILD_THERAPY = "Comeche Moreno, M.ª I. y Vallejo Pareja, M. A. (eds.). (2016). Manual de terapia de conducta en la infancia (3.ª ed.). Dykinson.";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const BELLOCH_II = "Belloch, A., Sandín, B. y Ramos, F. (coords.). (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw-Hill.";

const o = (a, b, c, d) => ({ a, b, c, d });
const review = (sourceTopic, oldC, subject, topic, e, options, c, x, r) => ({ sourceTopic, oldC, subject, topic, e, o: options, c, x, r });

const reviews = {
  SIM_PERS_AGO25_054: review(anxietySourceTopic, "c", CHILD_TREATMENTS, anxietySourceTopic,
    "¿Para qué problemas está indicado el programa El gato valiente (Coping Cat) de Kendall?",
    o("El trastorno obsesivo-compulsivo infantil.", "La enuresis nocturna.", "Los trastornos de ansiedad infantil, incluidos ansiedad de separación, ansiedad generalizada y ansiedad social.", "La depresión infantil."), "c",
    "La opción c es correcta. Coping Cat es un protocolo cognitivo-conductual de 16 sesiones para trastornos de ansiedad infantil; combina psicoeducación, habilidades de afrontamiento y exposición gradual.",
    "Orgilés, M., Espada, J. P. y Méndez, F. X. (2016). «Trastornos de ansiedad infantil», en " + CHILD_THERAPY + " p. 167; Kendall, P. C. (1994). «Treating anxiety disorders in children». Journal of Consulting and Clinical Psychology, 62, 100-110."),
  SIM_PERS_AGO25_085: review(anxietySourceTopic, "b", CHILD_TREATMENTS, anxietySourceTopic,
    "En el modelado participante para fobias específicas infantiles, ¿qué combinación caracteriza la intervención?",
    o("Relajación e imaginación del estímulo temido.", "Observación de un modelo que afronta el estímulo y participación gradual guiada del niño o niña en exposición en vivo.", "Refuerzos tangibles y castigo negativo.", "Reestructuración cognitiva e hipnosis."), "b",
    "La opción b es correcta. El modelado participante integra la observación de un modelo que afronta el estímulo y la exposición gradual en vivo con participación activa del menor.",
    "Méndez, F. X., Orgilés, M. y Espada, J. P. (2016). «Miedos y fobias infantiles», en " + CHILD_THERAPY + " apartado de procedimientos terapéuticos, pp. 127-131; Bandura, A. (1977). Social Learning Theory. Prentice-Hall."),
  "Simu 12 comentado_091": review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según el Manual de terapia de conducta en la infancia, ¿en qué intervalo se sitúa la edad media de inicio de la fobia específica?",
    o("De 0 a 2 años.", "De 3 a 5 años.", "De 7 a 11 años.", "De 13 a 17 años."), "c",
    "La opción c es correcta. El manual sitúa la edad media de inicio de la fobia específica entre los 7 y los 11 años y señala que la mayoría de los casos comienza antes de los 10 años.",
    "Méndez, F. X., Orgilés, M. y Espada, J. P. (2016). «Miedos y fobias infantiles», en " + CHILD_THERAPY + " p. 110."),
  "Simu 13 comentado_082": review(anxietySourceTopic, "b", DEVELOPMENTAL, infancyTopic,
    "¿Cuál afirmación es correcta sobre la ansiedad de separación durante la lactancia?",
    o("Es universal e indica siempre apego seguro.", "Es una reacción frecuente entre los 6 y los 12 meses, aunque no es universal.", "No guarda relación con las condiciones de cuidado.", "Desaparece por completo antes del primer año."), "b",
    "La opción b es correcta. La ansiedad de separación es frecuente durante la lactancia, pero no es universal ni permite por sí sola inferir la seguridad del apego.",
    "Papalia, D. E., Wendkos Olds, S. y Feldman, R. D. (2010). Psicología del desarrollo (11.ª ed.). McGraw-Hill. pp. 250-251."),
  "Simu 14 comentado _156": review(anxietySourceTopic, "c", CLINICAL, clinicalModelsTopic,
    "Según la ley de la incubación de Eysenck, ¿qué puede ocurrir tras exposiciones breves y no reforzadas al estímulo condicionado?",
    o("La respuesta de miedo se extingue siempre.", "El efecto solo aparece sin activación emocional.", "La respuesta de ansiedad condicionada puede mantenerse o aumentar.", "El estímulo incondicionado pierde necesariamente valor."), "c",
    "La opción c es correcta. La ley de la incubación explica que la ausencia de reforzamiento no implica siempre una extinción inmediata de la ansiedad condicionada; en determinadas condiciones la respuesta puede mantenerse o incrementarse.",
    BELLOCH_I + " Modelos conductuales en psicopatología y ley de la incubación de Eysenck, p. 60."),
  "Simu 15 comentado_097": review(anxietySourceTopic, "a", PERSONALITY, personalityCognitiveTopic,
    "En la Teoría de Sistemas Multifactoriales de Royce y Powell, ¿qué subsistemas forman los sistemas traductores?",
    o("Sensorial y motor.", "Cognitivo y afectivo.", "Estilos y valores.", "Memoria y lenguaje."), "a",
    "La opción a es correcta. Royce y Powell agrupan los seis sistemas en traductores —sensorial y motor—, transformadores —cognitivo y afectivo— e integradores —estilos y valores—.",
    "Colom, R. (2018). Manual de psicología diferencial. Pirámide. pp. 62-64; Royce, J. R. y Powell, A. (1983). Theory of Personality and Individual Differences. Prentice-Hall."),
  "Simu 15 comentado_100": review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Respecto al mutismo selectivo, señale la afirmación incorrecta:",
    o("Puede coexistir con habilidades lingüísticas normales.", "El silencio puede funcionar como estrategia para disminuir la activación ansiosa en encuentros sociales.", "Se adquiere exclusivamente por condicionamiento vicario.", "Se asocia con frecuencia a otros trastornos de ansiedad, especialmente ansiedad social."), "c",
    "La opción c es incorrecta. El DSM-5-TR no sostiene una adquisición exclusivamente vicaria; describe una posible función ansiolítica del silencio, habilidades lingüísticas habitualmente normales y una comorbilidad ansiosa frecuente.",
    DSM + " Mutismo selectivo, criterios, características asociadas y comorbilidad."),
  "Simu 16 comentado_099": review(anxietySourceTopic, "a", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "En el estudio español citado por Méndez et al. sobre fobias infantiles, ¿qué tipo de fobia específica fue el más común?",
    o("Fobia a la oscuridad.", "Fobia animal.", "Fobia escolar.", "Fobia social."), "b",
    "La opción b es correcta. El manual recoge una prevalencia del 6,1 % para la fobia animal en población infantil dentro del estudio español citado.",
    "Méndez, F. X., Orgilés, M. y Espada, J. P. (2016). «Miedos y fobias infantiles», en " + CHILD_THERAPY + " pp. 114-115."),
  "Simu 32 comentado hardcore 2_083": review(anxietySourceTopic, "b", CLINICAL, clinicalNeurocognitiveTopic,
    "El deterioro cognitivo leve amnésico de dominio único se asocia con mayor riesgo de progresar a:",
    o("Demencia frontotemporal.", "Enfermedad de Alzheimer.", "Demencia con cuerpos de Lewy.", "Enfermedad de Parkinson."), "b",
    "La opción b es correcta. El fenotipo amnésico de dominio único se considera con frecuencia un estado prodrómico de la enfermedad de Alzheimer, aunque no permite diagnosticarla por sí solo.",
    "Petersen, R. C. (2004). «Mild cognitive impairment as a diagnostic entity». Journal of Internal Medicine, 256, 183-194."),
  "Simu 32 comentado hardcore 2_089": review(anxietySourceTopic, "b", CHILD_PSYCHOPATHOLOGY, childTraumaTopic,
    "Según la revisión de prevalencia recogida en el manual, ¿qué afirmación es correcta sobre abuso sexual infantil comunicado mediante autoinforme?",
    o("Es más frecuente en chicos que en chicas.", "La prevalencia fue mayor en chicas (18 %) que en chicos (7,6 %).", "La culpa es infrecuente en las víctimas.", "No genera repercusiones psicológicas a largo plazo."), "b",
    "La opción b es correcta. La revisión citada en el manual informa una prevalencia mayor en chicas que en chicos; culpa y vergüenza figuran entre las posibles consecuencias psicológicas del abuso sexual infantil.",
    "Mas Hesse, B. y Carrasco Ortiz, M. Á. (2016). «Abuso sexual y maltrato infantil», en " + CHILD_THERAPY + " pp. 274 y 278-279."),
  "Simu 6 comentado__102": review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Respecto al trastorno de ansiedad por separación, señale la afirmación que NO es correcta:",
    o("Se considera uno de los trastornos de ansiedad de inicio más temprano.", "La mayoría de los niños no desarrolla trastornos de ansiedad incapacitantes a lo largo de la vida.", "En muestras clínicas infantiles es más frecuente en niñas que en niños.", "En niños y adolescentes la duración mínima exigida es de cuatro semanas."), "c",
    "La opción c es incorrecta. En muestras clínicas infantiles la frecuencia es similar en niños y niñas; las demás afirmaciones son compatibles con la descripción diagnóstica y evolutiva del trastorno.",
    DSM + " Trastorno de ansiedad por separación, pp. 217-219."),
  "Simu 6 comentado__104": review(anxietySourceTopic, "a", CLINICAL, clinicalPerceptionTopic,
    "Un paciente percibe como disociados el color y la forma de los objetos, aunque sigue reconociéndolos. ¿Cómo se denomina esta alteración?",
    o("Metacromía.", "Morfólisis.", "Sinestesia.", "Dismegalopsia."), "a",
    "La opción a es correcta. La metacromía consiste en la escisión entre color y forma; la morfólisis afecta a la forma y la dismegalopsia al tamaño de los objetos.",
    BELLOCH_I + " Psicopatología de la sensopercepción, p. 176."),
  "Simu 8 comentado _005": review(anxietySourceTopic, "b", SOCIAL, socialAttributionTopic,
    "¿Qué autor se considera iniciador de la teoría de la atribución causal?",
    o("Leon Festinger.", "Fritz Heider.", "Gustave Le Bon.", "Kurt Lewin."), "b",
    "La opción b es correcta. Heider formuló el análisis de cómo las personas atribuyen las acciones a causas personales o situacionales.",
    "Heider, F. (1958). The Psychology of Interpersonal Relations. Wiley. Cap. 1."),
  "Simu 8 comentado _202": review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según el estudio recogido en el manual sobre fobia específica infantil, ¿qué patrón de prevalencia por sexo se observa en las fobias animal, natural y situacional?",
    o("Son aproximadamente dos veces más frecuentes en niños.", "Son aproximadamente dos veces más frecuentes en niñas.", "No muestran diferencias por sexo.", "Solo son más frecuentes en niñas las fobias de sangre-inyecciones-heridas."), "b",
    "La opción b es correcta. El manual informa de una frecuencia aproximadamente doble en niñas para las fobias animal, natural y situacional.",
    "Méndez, F. X., Orgilés, M. y Espada, J. P. (2016). «Miedos y fobias infantiles», en " + CHILD_THERAPY + " pp. 114-115."),
  SmCm08PIR2025_092: review(anxietySourceTopic, "d", PERSONALITY, personalityFactorTopic,
    "¿Cuáles son las cinco grandes dimensiones del modelo Big Five?",
    o("Extraversión, neuroticismo y psicoticismo.", "Amabilidad, extraversión, minuciosidad, estabilidad emocional y cultura.", "Dominancia, responsabilidad, apertura, extraversión y neuroticismo.", "Neuroticismo, extraversión, responsabilidad, apertura y cordialidad."), "d",
    "La opción d es correcta. Las cinco dimensiones de Costa y McCrae son neuroticismo, extraversión, apertura, amabilidad o cordialidad y responsabilidad.",
    "Colom, R. (2018). Manual de psicología diferencial. Pirámide. pp. 418-419."),
  SmCm08PIR2025_093: review(anxietySourceTopic, "c", PERSONALITY, personalityBiologicalTopic,
    "Según Cloninger, ¿qué dimensión temperamental refleja actividad exploratoria ante la novedad, recompensas potenciales o la evitación de la monotonía?",
    o("Evitación del daño.", "Búsqueda de sensaciones.", "Búsqueda de novedades.", "Dependencia de la recompensa."), "c",
    "La opción c es correcta. La búsqueda de novedades es una de las dimensiones temperamentales de Cloninger y describe una tendencia exploratoria ante estímulos nuevos o recompensas potenciales.",
    "Cloninger, C. R. (1987). «A systematic method for clinical description and classification of personality variants». Archives of General Psychiatry, 44, 573-588."),
  SmCm08PIR2025_194: review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Qué cambio introdujo DSM-5 y se mantiene en DSM-5-TR para el trastorno de ansiedad por separación?",
    o("Eliminó la duración mínima para adultos.", "Exige que comience antes de los seis años.", "Eliminó el especificador de inicio temprano, antes de los seis años.", "Estableció que en muestras clínicas es más frecuente en niñas."), "c",
    "La opción c es correcta. DSM-5 eliminó el requisito o especificador de inicio temprano; se mantiene una duración típica de seis meses o más en adultos y no hay predominio femenino en muestras clínicas infantiles.",
    DSM + " Trastorno de ansiedad por separación, pp. 217-219."),
  SmCm08PIR2025_196: review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Qué requisito temporal establece DSM-5-TR para diagnosticar fobia específica?",
    o("Al menos un mes.", "Al menos tres meses.", "Seis meses o más.", "Doce meses o más."), "c",
    "La opción c es correcta. Para la fobia específica, el miedo, la ansiedad o la evitación debe ser persistente y durar típicamente seis meses o más.",
    DSM + " Fobia específica, criterio F, p. 224."),
  SmCm09PIR2025_168: review(anxietySourceTopic, "a", CHILD_TREATMENTS, childConductTopic,
    "Un padre se entera varios días después de que su hijo utilizó sin permiso una herramienta peligrosa y entonces lo regaña. ¿Cuál es el principal problema de este procedimiento desde el análisis de contingencias?",
    o("La consecuencia es demorada y queda débilmente vinculada a la conducta.", "La conducta se mantiene necesariamente por refuerzo negativo.", "Es un procedimiento de extinción.", "La conducta queda reforzada positivamente por la regañina."), "a",
    "La opción a es correcta. Para que una consecuencia punitiva ejerza control debe aplicarse de manera contingente y próxima a la conducta; la demora dificulta que el menor relacione conducta y consecuencia.",
    CHILD_THERAPY + " Uso contingente de procedimientos derivados del castigo y sus efectos indeseables, pp. 363-364."),
  SmCm10PIR2025_008: review(anxietySourceTopic, "a", BASIC, basicEmotionTopic,
    "Según las leyes de la emoción de Frijda, ¿qué ley explica que experimentemos una emoción cuando un acontecimiento es relevante para nuestros objetivos, necesidades o intereses?",
    o("Ley del interés.", "Ley de la realidad aparente.", "Ley de conservación del momento emocional.", "Ley del cierre."), "a",
    "La opción a es correcta. La ley del interés vincula la emoción con la relevancia que un acontecimiento tiene para las preocupaciones, metas o necesidades de la persona.",
    "Frijda, N. H. (1986). The Emotions. Cambridge University Press. Cap. 1, leyes de la emoción."),
  SmCm10PIR2025_035: review(anxietySourceTopic, "d", BASIC, basicLearningTopic,
    "¿Qué procedimiento operante consiste en presentar de forma contingente una consecuencia aversiva después de una conducta?",
    o("Refuerzo positivo.", "Refuerzo negativo.", "Refuerzo diferencial por omisión.", "Castigo positivo."), "d",
    "La opción d es correcta. Positivo alude a presentar un estímulo y castigo a reducir la probabilidad futura de la conducta.",
    "Skinner, B. F. (1938). The Behavior of Organisms. Appleton-Century; aplicación infantil: " + CHILD_THERAPY + " pp. 363-364."),
  SmCm10PIR2025_044: review(anxietySourceTopic, "b", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según DSM-5-TR, ¿cuál de los siguientes trastornos presenta una prevalencia media estimada más alta en niños?",
    o("Trastorno de ansiedad generalizada.", "Trastorno de ansiedad por separación.", "Trastorno de apego reactivo.", "Fobia específica."), "d",
    "La opción d es correcta. El DSM-5-TR estima aproximadamente un 5 % para la fobia específica en niños y alrededor de un 4 % para el trastorno de ansiedad por separación; el trastorno de apego reactivo no pertenece al grupo de trastornos de ansiedad.",
    DSM + " Trastorno de ansiedad por separación y fobia específica, pp. 218 y 226."),
  SmCm10PIR2025_187: review(anxietySourceTopic, "c", PERSONALITY, personalityIdentityTopic,
    "¿Qué evalúa la Escala de Autoestima de Rosenberg?",
    o("La valoración global positiva o negativa que la persona hace de sí misma.", "La competencia académica específica.", "La deseabilidad social.", "La estabilidad emocional como rasgo."), "a",
    "La opción a es correcta. La escala de Rosenberg evalúa autoestima global, es decir, la valoración general positiva o negativa que una persona hace de sí misma.",
    "Rosenberg, M. (1965). Society and the Adolescent Self-Image. Princeton University Press. pp. 16-18."),
  SmCm11PIR2025_005: review(anxietySourceTopic, "b", CLINICAL, clinicalAffectivityTopic,
    "En la caracterización clínica de la afectividad, ¿qué propiedad alude a que los estados afectivos influyen en la personalidad y en la conducta?",
    o("Subjetividad.", "Trascendencia.", "Comunicatividad.", "Polaridad."), "b",
    "La opción b es correcta. La trascendencia se refiere a la influencia de los estados afectivos en la personalidad y la conducta; subjetividad es vivencia propia, comunicatividad su expresión y polaridad su distribución en polos.",
    "Vallejo Ruiloba, J. (2025). Introducción a la Psicopatología y la Psiquiatría (9.ª ed.). Elsevier. Cap. 19, p. 511."),
  SmCm11PIR2025_055: review(anxietySourceTopic, "a", EVALUATION, evaluationSubjectiveTopic,
    "¿Qué prueba subjetiva del estado de ánimo cuenta, en su versión clásica, con las formas 1, 2, A, B, C, D y de perfil?",
    o("DACL.", "Perfil de los Estados de Ánimo, POMS.", "ESFA.", "ACL."), "b",
    "La opción b es correcta. El POMS es una prueba de perfiles de estados de ánimo; la clave anterior DACL era errónea.",
    "McNair, D. M., Lorr, M. y Droppleman, L. F. (1992). Manual for the Profile of Mood States. Educational and Industrial Testing Service. pp. 1-5."),
  SmCm11PIR2025_062: review(anxietySourceTopic, "b", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según el DSM-5-TR, ¿cuál es la prevalencia aproximada a 12 meses de la fobia específica en niños?",
    o("1 %.", "3 %.", "5 %.", "15 %."), "c",
    "La opción c es correcta. El DSM-5-TR estima una prevalencia aproximada a 12 meses de alrededor del 5 % en niños.",
    DSM + " Fobia específica, prevalencia, pp. 226-230."),
  SmCm11PIR2025_175: review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Cuál NO describe habitualmente los miedos evolutivos infantiles?",
    o("Forman parte del desarrollo normal.", "La mayoría son transitorios.", "Son desproporcionados, irracionales y provocan evitación persistente.", "Pueden facilitar el afrontamiento de situaciones nuevas."), "c",
    "La opción c es correcta. Esa descripción corresponde a una fobia clínica; los miedos evolutivos son esperables y habitualmente transitorios.",
    "Morris, R. J. y Kratochwill, T. R. (1983). Treating Children’s Fears and Phobias. Pergamon. Cap. 1, pp. 3-8."),
  SmCm11PIR2025_176: review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Qué término describe un miedo intenso y desproporcionado ante un objeto o situación que conduce a evitación?",
    o("Mutismo selectivo.", "Tic.", "Fobia específica.", "Miedo evolutivo."), "c",
    "La opción c es correcta. La fobia específica se caracteriza por miedo o ansiedad marcados y desproporcionados, junto con evitación o aguante con ansiedad intensa.",
    DSM + " Fobia específica, criterios A-C, pp. 226-228."),
  SmCm14PIR2025_036: review(anxietySourceTopic, "b", CLINICAL, clinicalAnxietyTopic,
    "Según el DSM-5-TR, ¿cuál es la prevalencia aproximada a 12 meses de la fobia específica en la población adulta general de Estados Unidos?",
    o("1-3 %.", "4-6 %.", "7-9 %.", "13-15 %."), "c",
    "La opción c es correcta. El DSM-5-TR estima una prevalencia aproximada a 12 meses de 7-9 % en población adulta; en niños es menor y en adolescentes mayor.",
    DSM + " Fobia específica, prevalencia, pp. 228-229."),
  SmCm16PIR2025_005: review(anxietySourceTopic, "d", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "En el FSSC-R de Ollendick, King y Frary, ¿qué dimensión agrupa miedos relacionados con accidentes, lesiones y muerte?",
    o("Crítica y fracaso.", "Peligro y muerte.", "Lo desconocido.", "Animales y daños menores."), "b",
    "La opción b es correcta. Peligro y muerte es una de las dimensiones factoriales del FSSC-R e incluye miedos relacionados con accidentes, lesiones y muerte.",
    "Ollendick, T. H., King, N. J. y Frary, R. B. (1989). «Fears in children and adolescents: Reliability and generalizability across gender, age and nationality». Behaviour Research and Therapy, 27, 19-26. pp. 20-22."),
  SmCm16PIR2025_180: review(anxietySourceTopic, "b", EXPERIMENTAL, statisticsTopic,
    "¿Qué coeficiente estima la relación entre X e Y controlando estadísticamente el efecto de Z sobre ambas variables?",
    o("Correlación múltiple.", "Correlación parcial.", "Correlación semiparcial.", "Covarianza."), "b",
    "La opción b es correcta. La correlación parcial elimina de X e Y la variación asociada a Z; la semiparcial la elimina de una sola variable.",
    "Cohen, J., Cohen, P., West, S. G. y Aiken, L. S. (2003). Applied Multiple Regression/Correlation Analysis for the Behavioral Sciences (3.ª ed.). Routledge. pp. 75-78."),
  SmCm16PIR2025_183: review(anxietySourceTopic, "b", EXPERIMENTAL, statisticsTopic,
    "En dos grupos independientes, fármaco frente a placebo, si el resultado es ordinal o no cumple supuestos paramétricos, ¿qué prueba no paramétrica contrasta sus diferencias?",
    o("Prueba de Wilcoxon.", "U de Mann-Whitney.", "H de Kruskal-Wallis.", "Prueba de Friedman."), "b",
    "La opción b es correcta. La U de Mann-Whitney compara dos muestras independientes; Wilcoxon se usa con medidas relacionadas, Kruskal-Wallis con tres o más grupos independientes y Friedman con tres o más medidas relacionadas.",
    "Mann, H. B. y Whitney, D. R. (1947). «On a Test of Whether one of Two Random Variables is Stochastically Larger than the Other». Annals of Mathematical Statistics, 18, 50-60. p. 50."),
  SmCm16PIR2025_184: review(anxietySourceTopic, "c", EXPERIMENTAL, psychometricsTopic,
    "En la teoría de respuesta al ítem de tres parámetros, ¿cuál NO es un parámetro de la curva característica del ítem?",
    o("Dificultad.", "Discriminación.", "Validez.", "Adivinación o pseudoazar."), "c",
    "La opción c es correcta. El modelo de tres parámetros incluye dificultad, discriminación y adivinación; la validez es una propiedad de la interpretación del test, no un parámetro del ítem.",
    "Lord, F. M. (1980). Applications of Item Response Theory to Practical Testing Problems. Lawrence Erlbaum. pp. 13-16."),
  SmCm16PIR2025_196: review(anxietySourceTopic, "b", EVALUATION, evaluationChildTopic,
    "En la evaluación de menores de 10 años, ¿qué afirmación es correcta?",
    o("Se debe priorizar la conducta encubierta frente a la observable.", "Sus habilidades para autoobservarse, autoevaluarse e informar sobre su conducta son limitadas.", "Los registros psicofisiológicos son muy fáciles y fiables.", "La especificidad situacional aumenta con la edad."), "b",
    "La opción b es correcta. En menores de diez años son limitadas las habilidades de autoobservación, autoevaluación e informe; se prioriza la conducta manifiesta y la observación natural, y los registros psicofisiológicos presentan dificultades.",
    CHILD_THERAPY + " Particularidades de la evaluación infantil, p. 48."),
  SmCm16PIR2025_208: review(anxietySourceTopic, "a", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Qué miedo evolutivo surge hacia los 2 o 3 años, es muy frecuente a los 4 o 6 y tiende a declinar a los 7 o 9?",
    o("Miedo a la oscuridad.", "Miedo a los animales domésticos.", "Miedo al colegio.", "Fobia social."), "a",
    "La opción a es correcta. El manual describe esa trayectoria evolutiva para el miedo a la oscuridad.",
    CHILD_THERAPY + " Miedos evolutivos infantiles, p. 110."),
  SmCm18PIR2025_090: review(anxietySourceTopic, "d", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según el DSM-5-TR, ¿cuál es una característica definitoria del mutismo selectivo?",
    o("Incapacidad para hablar en toda situación.", "Fracaso constante para hablar en situaciones sociales específicas pese a hablar en otras.", "Déficit estructural del lenguaje obligatorio.", "Inicio necesariamente tras la adolescencia."), "b",
    "La opción b es correcta. El criterio central es el fracaso constante para hablar en situaciones sociales específicas en las que se espera que se hable, pese a hacerlo en otros contextos; no exige una alteración estructural del lenguaje.",
    DSM + " Mutismo selectivo, criterios A-D."),
  "SmCm21PIR2025 (2)_074": review(anxietySourceTopic, "a", CLINICAL, clinicalAnxietyTopic,
    "Según el DSM-5-TR, en la fobia específica la prevalencia es:",
    o("Mayor en mujeres, aproximadamente 2:1.", "Mayor en varones, 2:1.", "Mayor en mujeres, 4:1.", "Igual en ambos sexos."), "a",
    "La opción a es correcta. La fobia específica es más frecuente en mujeres que en varones, aproximadamente en una proporción de dos a uno.",
    DSM + " Fobia específica, diferencias por sexo o género, pp. 228-229."),
  "SmCm22PIR2025 (1)_153": review(anxietySourceTopic, "a", ADULT_TREATMENTS, adultPsychosisTopic,
    "En el entrenamiento en habilidades sociales para personas con esquizofrenia, ¿qué secuencia forma parte del procedimiento conductual estándar?",
    o("Instrucción, modelado, ensayo conductual y retroalimentación.", "Exposición interoceptiva y prevención de respuesta.", "Interpretación libre de sueños.", "Recuperación de recuerdos traumáticos."), "a",
    "La opción a es correcta. El entrenamiento en habilidades sociales utiliza instrucción, demostración o modelado, role-play o ensayo conductual y retroalimentación o refuerzo.",
    "Bellack, A. S., Mueser, K. T., Gingerich, S. y Agresta, J. (2004). Social Skills Training for Schizophrenia (2.ª ed.). Guilford. Cap. 3, pp. 37-52."),
  SmCm22PIR2025_064: review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "El mutismo selectivo se asocia con mayor frecuencia a:",
    o("Trastorno de ansiedad social.", "Trastorno negativista desafiante.", "Trastorno neurocognitivo mayor.", "Fobia específica de sangre-inyección-daño."), "a",
    "La opción a es correcta. El DSM-5-TR señala que los menores con mutismo selectivo presentan con frecuencia ansiedad social o rasgos de ansiedad social; la conducta oposicionista no define el trastorno.",
    DSM + " Mutismo selectivo, características asociadas y comorbilidad."),
  SmCm23PIR2025_209: review(anxietySourceTopic, "a", CLINICAL, clinicalPerceptionTopic,
    "Un paciente siente dolor en la rodilla al oír el canto de un pájaro y atribuye causalmente ese dolor al sonido. ¿Qué fenómeno describe mejor?",
    o("Alucinación refleja.", "Alucinación extracampina.", "Alucinación negativa.", "Autoscopia."), "a",
    "La opción a es correcta. La alucinación refleja es una experiencia alucinatoria en una modalidad sensorial provocada por un estímulo real de otra modalidad.",
    BELLOCH_I + " Alucinación refleja, p. 190."),
  "SmCm24PIR2025 (1)_189": review(anxietySourceTopic, "b", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "¿Qué pauta evolutiva de los miedos infantiles se describe habitualmente?",
    o("Con la edad se debilitan los miedos físicos y aumentan los sociales.", "Todos los miedos aumentan de forma lineal.", "Los adolescentes presentan más miedos físicos que los niños.", "El miedo a la muerte desaparece en la adultez."), "a",
    "La opción a es correcta. En el desarrollo disminuyen los miedos físicos y se incrementan los miedos sociales; las otras alternativas presentan generalizaciones incorrectas.",
    CHILD_THERAPY + " Evolución de los miedos infantiles, p. 114."),
  "SmCm24PIR2025 (1)_191": review(anxietySourceTopic, "c", PERSONALITY, personalityResearchTopic,
    "En Psicología de la Personalidad, ¿qué caracteriza a la estrategia experimental?",
    o("Estudio en profundidad de un caso individual.", "Medición de relaciones sin manipular variables.", "Manipulación sistemática de una variable independiente para comprobar su efecto causal sobre una variable dependiente.", "Formulación de hipótesis a partir de casos excepcionales."), "c",
    "La opción c es correcta. La manipulación de la variable independiente permite comprobar su efecto causal sobre la variable dependiente; la estrategia correlacional no permite esa inferencia causal.",
    "Bermúdez, J. et al. (2011). Psicología de la personalidad. UNED. Investigación en personalidad, pp. 77-78."),
  "SmCm27PIR2025 (1)_201": review(anxietySourceTopic, "d", EVALUATION, evaluationIntelligenceTopic,
    "¿Qué combinación describe correctamente las escalas de la K-ABC original?",
    o("Comprensión verbal, razonamiento perceptivo, memoria de trabajo y velocidad de procesamiento.", "Vocabulario y matrices como única medida compuesta.", "Aptitud general, personalidad y atención sostenida.", "Procesamiento secuencial, procesamiento simultáneo, rendimiento académico y escala no verbal."), "d",
    "La opción d es correcta. La K-ABC diferencia procesamiento secuencial y simultáneo, incluye rendimiento académico y una escala no verbal; las otras alternativas describen otras baterías o constructos.",
    "Kaufman, A. S. y Kaufman, N. L. (1983). Kaufman Assessment Battery for Children: Interpretive Manual. American Guidance Service. pp. 1-4."),
  "SmCm30PIR2025 (1)_156": review(anxietySourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childAutismTopic,
    "Según el DSM-5-TR, ¿qué forma parte de los déficits de comunicación social del trastorno del espectro autista?",
    o("Discapacidad intelectual en todos los casos.", "Regresión obligatoria tras dos años de desarrollo normal.", "Anomalías en el contacto visual y el lenguaje corporal.", "Mayor prevalencia en mujeres."), "c",
    "La opción c es correcta. El DSM-5-TR incluye déficits de comunicación no verbal, como contacto visual y lenguaje corporal anómalos; la discapacidad intelectual y la regresión no son necesarias y la prevalencia es mayor en varones.",
    DSM + " Trastorno del espectro autista, criterio A2, pp. 56-57."),
  SmCm08PIR2025_195: review(traumaSourceTopic, "a", CHILD_PSYCHOPATHOLOGY, childAnxietyTopic,
    "Según el DSM-5-TR, ¿qué duración mínima debe tener la incapacidad constante para hablar en situaciones sociales específicas para poder diagnosticar mutismo selectivo?",
    o("Al menos un mes, sin limitarse al primer mes de escolarización.", "Al menos una semana.", "Al menos tres meses.", "No se exige una duración mínima si el niño o la niña habla en casa."), "a",
    "La opción a es correcta. El DSM-5-TR exige que la incapacidad constante para hablar en determinadas situaciones sociales persista al menos un mes; este periodo no puede limitarse al primer mes de escolarización.",
    DSM + " Mutismo selectivo, criterio C; véase también " + BELLOCH_II + " Mutismo selectivo, pp. 73-75."),
  SmCm11PIR2025_056: review(traumaSourceTopic, "d", EVALUATION, evaluationPersonalityTopic,
    "En el IA-TP de Tous, Pont y Muiños, ¿qué correspondencia entre el rasgo de personalidad normal y el trastorno de personalidad asociado es correcta?",
    o("Personalidad introvertida – trastorno evitativo de la personalidad.", "Personalidad cooperativa – trastorno dependiente de la personalidad.", "Personalidad confiada – trastorno antisocial de la personalidad.", "Personalidad convincente – trastorno narcisista de la personalidad."), "b",
    "La opción b es correcta. El IA-TP vincula la personalidad cooperativa con la predisposición al trastorno dependiente. Las otras correspondencias están intercambiadas: introvertida se asocia con esquizoide, confiada con narcisista y convincente con antisocial.",
    "Tous, J. M., Pont, N. y Muiños, R. (2009). IA-TP: Inventario de Adjetivos para la Evaluación de los Trastornos de la Personalidad. Manual (2.ª ed.). TEA Ediciones. Ficha técnica y correspondencia de escalas, p. 1."),
  SmCm19PIR2024_087: review(traumaSourceTopic, "a", DEVELOPMENTAL, adolescenceTopic,
    "¿Cómo denominó Erikson a la identidad configurada a partir de identificaciones y roles que el entorno presenta como indeseables o peligrosos?",
    o("Identidad negativa.", "Moratoria psicosocial.", "Difusión de identidad.", "Identidad hipotecada."), "a",
    "La opción a es correcta. Erikson llamó identidad negativa a una identidad basada, de forma inversa, en identificaciones y roles que habían sido presentados como indeseables o peligrosos. La moratoria es aplazamiento de compromisos y la identidad hipotecada pertenece al modelo posterior de Marcia.",
    "Erikson, E. H. (1968). Identity: Youth and Crisis. W. W. Norton. Cap. 4, pp. 172-175; definición en p. 174."),
  SmCm1PIR2024_182: review(traumaSourceTopic, "b", CHILD_TREATMENTS, traumaSourceTopic,
    "En la terapia cognitivo-conductual focalizada en el trauma, TF-CBT, para menores, ¿cómo se aborda la exposición al recuerdo traumático?",
    o("De forma gradual, verbal o escrita, después de entrenar habilidades de regulación.", "Exclusivamente en vivo y desde la primera sesión.", "Evitándola para no aumentar el malestar.", "Solo mediante el relato de la persona cuidadora, sin participación del menor."), "a",
    "La opción a es correcta. La TF-CBT introduce el componente traumático cuando el menor y la persona cuidadora han desarrollado habilidades regulatorias; la exposición se realiza gradualmente, de forma verbal o escrita, y se acompaña de corrección de atribuciones inadecuadas.",
    "Mas Hesse, B. y Carrasco Ortiz, M. Á. (2016). «Abuso sexual y maltrato infantil», en " + CHILD_THERAPY + " TF-CBT, pp. 286-287."),
  SmCm23PIR2025_097: review(traumaSourceTopic, "c", CHILD_PSYCHOPATHOLOGY, childTraumaTopic,
    "Según el DSM-5-TR, ¿qué trastorno se caracteriza por una conducta excesivamente familiar con adultos desconocidos tras una historia de cuidados insuficientes extremos?",
    o("Trastorno de ansiedad por separación.", "Trastorno de apego reactivo.", "Trastorno de relación social desinhibida.", "Trastorno de conducta."), "c",
    "La opción c es correcta. El trastorno de relación social desinhibida implica aproximación e interacción activa con adultos desconocidos, con reticencia reducida, familiaridad excesiva o escasa comprobación con la figura cuidadora, tras una historia de cuidados insuficientes extremos.",
    DSM + " Trastorno de relación social desinhibida, criterios A-C."),
  "SmCm24PIR2025 (1)_198": review(traumaSourceTopic, "b", BASIC, basicMotivationTopic,
    "Elige la opción correcta acerca del orden clásico de necesidades de la pirámide de Maslow, desde las más básicas hasta las de orden superior:",
    o("Autorrealización, reconocimiento, afiliación, seguridad y fisiológicas.", "Fisiológicas, seguridad, afiliación, reconocimiento y autorrealización.", "Seguridad, fisiológicas, afiliación, reconocimiento y autorrealización.", "Fisiológicas, seguridad, afiliación, autorrealización y reconocimiento."), "b",
    "La opción b es correcta. En la formulación clásica de Maslow, las necesidades fisiológicas constituyen el nivel básico; les siguen seguridad, afiliación o amor-pertenencia, estima o reconocimiento y, finalmente, autorrealización.",
    "Maslow, A. H. (1943). «A Theory of Human Motivation». Psychological Review, 50, 370-396. Apartado «The basic needs». https://doi.org/10.1037/h0054346."),
  "Simu 16 comentado_186": review(traumaSourceTopic, "b", CHILD_TREATMENTS, traumaSourceTopic,
    "En el modelo integrativo de desarrollo para sintomatología disociativa infantil, ¿qué objetivo se trabaja específicamente con la familia?",
    o("Enseñar al niño o niña a identificar precursores y autorregular las transiciones disociativas.", "Enseñar nuevos patrones de interacción que permitan expresar directamente las emociones.", "Confirmar literalmente las identidades disociadas.", "Sustituir la comunicación emocional por la evitación de recuerdos."), "b",
    "La opción b es correcta. El modelo enseña al menor a identificar los precursores y autorregular la transición entre estados disociativos. A la familia se le enseñan nuevos patrones de interacción que den cabida a la expresión directa de sentimientos y emociones y permitan hablar de lo sucedido sin estrategias disociativas.",
    "Mas Hesse, B. y Carrasco Ortiz, M. Á. (2016). «Abuso sexual y maltrato infantil», en " + CHILD_THERAPY + " Modelo integrativo de desarrollo para sintomatología disociativa, p. 292."),
};

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const treatments = read(paths.treatments);
const child = read(paths.child);
const clinical = read(paths.clinical);
const adult = read(paths.adult);
const evaluation = read(paths.evaluation);
const personality = read(paths.personality);
const basic = read(paths.basic);
const social = read(paths.social);
const developmental = read(paths.developmental);
const experimental = read(paths.experimental);
const manifest = read(paths.manifest);
const sourceIds = Object.keys(reviews);
const byId = new Map(treatments.map((question) => [question.id, question]));
const missing = sourceIds.filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas de origen: " + missing.join(", "));

for (const sourceTopic of [anxietySourceTopic, traumaSourceTopic]) {
  const found = treatments.filter((question) => question.t?.[0] === sourceTopic).map((question) => question.id).sort();
  const expected = sourceIds.filter((id) => reviews[id].sourceTopic === sourceTopic).sort();
  if (found.join("|") !== expected.join("|")) {
    throw new Error("El tema de origen contiene preguntas fuera del bloque auditado: " + sourceTopic);
  }
}

const makeReviewed = (question, item) => {
  if (question.s !== CHILD_TREATMENTS || question.t?.[0] !== item.sourceTopic) {
    throw new Error("Ubicación previa inesperada en " + question.id);
  }
  if (question.c !== item.oldC) throw new Error("La clave previa no coincide en " + question.id);
  const result = { ...question, s: item.subject, t: [item.topic], e: item.e, o: item.o, c: item.c, x: item.x, r: item.r, v: "CORREGIDA" };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  if (!String(result.x).trim() || !String(result.r).trim()) throw new Error("Falta justificación o referencia en " + question.id);
  return result;
};

const reviewed = sourceIds.map((id) => makeReviewed(byId.get(id), reviews[id]));
const finalTreatments = treatments.filter((question) => !sourceIds.includes(question.id));
const destinations = new Map([
  [CHILD_TREATMENTS, finalTreatments],
  [CHILD_PSYCHOPATHOLOGY, child],
  [CLINICAL, clinical],
  [ADULT_TREATMENTS, adult],
  [EVALUATION, evaluation],
  [PERSONALITY, personality],
  [BASIC, basic],
  [SOCIAL, social],
  [DEVELOPMENTAL, developmental],
  [EXPERIMENTAL, experimental],
]);
const existingDestinationIds = new Set([...child, ...clinical, ...adult, ...evaluation, ...personality, ...basic, ...social, ...developmental, ...experimental].map((question) => question.id));
const collisions = sourceIds.filter((id) => existingDestinationIds.has(id));
if (collisions.length) throw new Error("ID ya existente en destino: " + collisions.join(", "));
for (const question of reviewed) destinations.get(question.s).push(question);

if (!child.every((question) => reviewedStatuses.has(question.v))) {
  throw new Error("Psicopatología Infantil contendría preguntas sin revisión final.");
}

const finals = {
  "tratamientos_infantiles.json": finalTreatments,
  "psicopatologia_infantil.json": child,
  "psicologia_clinica.json": clinical,
  "tratamientos_adultos.json": adult,
  "evaluacion_psicologica.json": evaluation,
  "psicologia_de_la_personalidad_y_diferencial.json": personality,
  "psicologia_basica.json": basic,
  "psicologia_social.json": social,
  "psicologia_evolutiva.json": developmental,
  "psicologia_experimental.json": experimental,
};
const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => finals[file] ?? read(path.join(bancoDir, file)));
const idsAfter = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== idsAfter.size || allAfter.length !== manifest.total) {
  throw new Error("La auditoría alteraría el total de preguntas o sus identificadores.");
}
const counts = new Map();
for (const question of allAfter) counts.set(question.s, (counts.get(question.s) || 0) + 1);
for (const [subject, details] of Object.entries(manifest.subjects)) {
  if (!counts.has(subject)) throw new Error("Faltan preguntas para la asignatura " + subject);
  details.count = counts.get(subject);
}
manifest.total = [...counts.values()].reduce((sum, count) => sum + count, 0);
for (const question of reviewed) {
  if (!manifest.subjects[question.s].topics.includes(question.t[0])) {
    throw new Error("Tema de destino ausente del manifiesto: " + question.id + " → " + question.s + " / " + question.t[0]);
  }
}
const expectedTreatmentCounts = new Map([[anxietySourceTopic, 2], [traumaSourceTopic, 2], [childConductTopic, 7]]);
for (const [topic, expected] of expectedTreatmentCounts) {
  const actual = finalTreatments.filter((question) => question.t?.[0] === topic).length;
  if (actual !== expected) throw new Error("Recuento inesperado en " + topic + ": " + actual + " (esperado " + expected + ")");
}

for (const [file, data] of Object.entries(finals)) fs.writeFileSync(path.join(bancoDir, file), JSON.stringify(data) + "\n", "utf8");
fs.writeFileSync(paths.manifest, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Tratamientos Infantiles 04 — ansiedad y trauma",
  corrected: reviewed.length,
  retainedInChildTreatments: reviewed.filter((question) => question.s === CHILD_TREATMENTS).length,
  reclassified: reviewed.filter((question) => question.s !== CHILD_TREATMENTS).length,
  destinations: Object.fromEntries([...counts].filter(([subject]) => [CHILD_TREATMENTS, CHILD_PSYCHOPATHOLOGY, CLINICAL, ADULT_TREATMENTS, EVALUATION, PERSONALITY, BASIC, SOCIAL, DEVELOPMENTAL, EXPERIMENTAL].includes(subject))),
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
