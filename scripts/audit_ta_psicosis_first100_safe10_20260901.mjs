import fs from 'node:fs';
const file = new URL('../public/banco/tratamientos_adultos.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la psicosis y esquizofrenia';
const F = 'Fonseca-Pedrero, E. (coord.) (2019). Tratamientos psicológicos para la psicosis. Pirámide.';
const updates = {
  'ABRIL-UNO-24_COMENTADO_111': {
    e:'Señale la afirmación correcta sobre las intervenciones familiares en la psicosis:',
    o:{a:'Constan necesariamente de 20 sesiones distribuidas entre tres y siete meses.',b:'El programa Tratamiento Integrado de la Esquizofrenia 2000 es exclusivamente una intervención familiar.',c:'Carecen de utilidad durante los primeros episodios psicóticos.',d:'Cuentan con un grado alto de recomendación como complemento del tratamiento habitual.'},c:'d',
    x:'La opción d es correcta: las intervenciones familiares psicoeducativas cuentan con un grado alto de recomendación porque reducen recaídas y mejoran el funcionamiento cuando complementan la atención habitual. La a es falsa porque no existe una duración universal de 20 sesiones; los formatos varían y algunos programas emplean alrededor de diez encuentros durante varios meses. La b es falsa porque el programa 2000 es una intervención integrada y multimodal, no una intervención familiar exclusiva. La c es falsa porque estas intervenciones también resultan útiles en primeros episodios, especialmente cuando implican tempranamente a la familia.',r:F},
  'ABRIL-UNO-24_COMENTADO_202': {
    e:'¿Qué aplicación móvil para personas con psicosis utiliza evaluaciones breves autoadministradas y ofrece intervenciones guiadas para adherencia farmacológica, funcionamiento social, estado de ánimo, alucinaciones y sueño?',
    o:{a:'HORYZONS.',b:'FOCUS.',c:'ClinTouch.',d:'WellWave.'},c:'b',
    x:'La opción b es correcta: FOCUS combina evaluaciones breves en el teléfono con módulos de autoayuda dirigidos, entre otros objetivos, a la adherencia, el funcionamiento social, el ánimo, las voces y el sueño. La a es falsa porque HORYZONS es una plataforma web orientada a mantener la recuperación y prevenir recaídas tras un primer episodio. La c es falsa porque ClinTouch se centra principalmente en el registro intensivo y la monitorización en tiempo real de síntomas. La d es falsa porque WellWave promueve hábitos saludables, participación en el tratamiento y comunicación con los profesionales.',r:F},
  'AGOSTO2_113': {
    e:'¿En qué intervención psicológica para la psicosis se trabajan explícitamente los «flujos de la compasión» y la práctica de bondad amorosa?',
    o:{a:'COMPASS.',b:'STEPS.',c:'AVATAR.',d:'NAVIGATE.'},c:'a',
    x:'La opción a es correcta: COMPASS es una intervención centrada en la compasión para la psicosis e incluye el trabajo con los flujos de compasión y prácticas de bondad amorosa. La b es falsa porque STEPS se ha desarrollado para otros problemas clínicos y no identifica este componente como núcleo del tratamiento de la psicosis. La c es falsa porque AVATAR trabaja principalmente la relación con las voces mediante una representación digital. La d es falsa porque NAVIGATE es un programa multimodal para primeros episodios psicóticos, no un protocolo específico de compasión.',r:F},
  'DICIEMBRE-DOS-24_COMENTADO_059': {
    e:'Según el modelo de estadificación clínica de la psicosis de Wood y colaboradores, ¿en qué fases se sitúa la prevención indicada?',
    o:{a:'En el primer episodio psicótico.',b:'Únicamente en el malestar inespecífico.',c:'En el malestar inespecífico y en los estados mentales de alto riesgo.',d:'En la recurrencia y la persistencia del trastorno.'},c:'c',
    x:'La opción c es correcta: la prevención indicada se dirige a personas con malestar inespecífico o estados mentales de alto riesgo que ya presentan señales o factores de riesgo suficientes para una intervención selectiva. La a es falsa porque ante un primer episodio se habla de intervención temprana y prevención secundaria. La b es falsa por ser incompleta: el modelo incluye también los estados mentales de alto riesgo. La d es falsa porque la recurrencia y persistencia corresponden a prevención terciaria y rehabilitación.',r:F+' Véase el modelo de estadificación clínica, p. 65.'},
  'JULIO1_146': {
    e:'En los programas psicoeducativos para la psicosis, ¿qué contenido suele abordarse con mayor frecuencia?',
    o:{a:'El funcionamiento premórbido.',b:'Los recursos comunitarios disponibles.',c:'La reducción y el manejo del estrés.',d:'Los aspectos jurídicos de la atención.'},c:'c',
    x:'La opción c es correcta: el manejo del estrés se aborda con gran frecuencia porque ayuda a reconocer factores precipitantes y a prevenir recaídas. La a es falsa porque el funcionamiento premórbido suele ocupar un lugar menos central en la psicoeducación. La b es falsa porque los recursos comunitarios pueden incluirse, pero no figuran entre los contenidos más frecuentes. La d es falsa porque los aspectos jurídicos son contenidos complementarios y menos habituales.',r:F},
  'JULIO2_141': {
    e:'En la Terapia Neurocognitiva Integrada (INT) de Roder y Mueller, ¿qué área de cognición social se trabaja específicamente en el módulo B?',
    o:{a:'Percepción emocional.',b:'Regulación emocional.',c:'Teoría de la mente.',d:'Esquemas sociales.'},c:'c',
    x:'La opción c es correcta: el módulo B de la INT combina contenidos neurocognitivos con tareas de cognición social centradas en la teoría de la mente. La a es falsa porque la percepción emocional se introduce en un módulo anterior. La b es falsa porque la regulación emocional se aborda en módulos posteriores y de mayor complejidad. La d es falsa porque los esquemas sociales pertenecen a una fase posterior del programa.',r:'Roder, V. y Mueller, D. R. (2015). Integrated Psychological Therapy (IPT) for the Treatment of Neurocognition, Social Cognition, and Social Competency in Schizophrenia Patients. Hogrefe; '+F+' Véase la descripción de INT, p. 283.'},
  'JUNIO-UNO-24_COMENTADO_161': {
    e:'¿Qué caracteriza a la terapia MERIT?',
    o:{a:'Es una intervención conductual específica para los trastornos alimentarios.',b:'Es una psicoterapia integradora de orientación metacognitiva para los trastornos psicóticos.',c:'Es una intervención metacognitiva diseñada exclusivamente para los trastornos depresivos.',d:'Es un protocolo transdiagnóstico general para todos los trastornos emocionales.'},c:'b',
    x:'La opción b es correcta: MERIT integra hallazgos sobre metacognición y modelos de recuperación con el objetivo de favorecer una comprensión más compleja de uno mismo y de los demás en personas con psicosis. La a es falsa porque no es un tratamiento conductual para trastornos alimentarios. La c es falsa porque su desarrollo y evidencia principal corresponden al espectro psicótico, no exclusivamente a la depresión. La d es falsa porque no es un protocolo transdiagnóstico general de trastornos emocionales.',r:F+' Véase MERIT, p. 396.'},
  'MAYO-UNO-24_COMENTADO_097': {
    e:'Señale la afirmación correcta sobre el tratamiento de la psicosis mediante Diálogo Abierto:',
    o:{a:'El equipo mantiene la responsabilidad durante un máximo fijo de cinco años.',b:'Entiende la psicosis como una ruptura temporal radical de las prácticas comunicativas compartidas que afecta al pensamiento y al lenguaje.',c:'Las reuniones deben seguir un guion rígido acordado previamente por el equipo.',d:'Los profesionales solo están disponibles durante el horario laboral ordinario.'},c:'b',
    x:'La opción b es correcta: Diálogo Abierto comprende la crisis psicótica en su contexto relacional y comunicativo, favoreciendo la construcción compartida de significado. La a es falsa porque la continuidad del equipo se mantiene durante el tiempo necesario, no durante un máximo fijo de cinco años. La c es falsa porque las reuniones se adaptan al diálogo emergente y procuran que todas las voces sean escuchadas, sin imponer un guion rígido. La d es falsa porque el modelo incluye respuesta rápida y disponibilidad para organizar la primera reunión en un plazo breve, habitualmente dentro de las primeras 24 horas.',r:'Seikkula, J. y Olson, M. E. (2003). The Open Dialogue Approach to Acute Psychosis: Its Poetics and Micropolitics. Family Process, 42(3), 403–418. https://doi.org/10.1111/j.1545-5300.2003.00403.x; '+F},
  'MAYO2_156': {
    e:'¿Qué áreas de cognición social se trabajan en el último módulo (D) de la Terapia Neurocognitiva Integrada (INT)?',
    o:{a:'Percepción emocional.',b:'Percepción social.',c:'Esquemas sociales.',d:'Atribución y regulación emocional.'},c:'d',
    x:'La opción d es correcta: el módulo D aborda procesos de cognición social de mayor complejidad, entre ellos la atribución y la regulación emocional. La a es falsa porque la percepción emocional se trabaja en el módulo inicial. La b es falsa porque la percepción social aparece en un módulo previo. La c es falsa porque los esquemas sociales se abordan antes del módulo final. La secuencia de la INT progresa desde procesos básicos hacia procesos más complejos.',r:'Roder, V. y Mueller, D. R. (2015). Integrated Psychological Therapy (IPT) for the Treatment of Neurocognition, Social Cognition, and Social Competency in Schizophrenia Patients. Hogrefe; '+F+' Véase la descripción de INT, p. 283.'},
  'OCTUBRE-UNO-24_COMENTADO_123': {
    e:'Señale la afirmación correcta sobre la terapia AVATAR para las voces:',
    o:{a:'Su objetivo principal es reducir alucinaciones visuales resistentes a la medicación.',b:'La representación digital debe alcanzar necesariamente un 90 % de semejanza con la voz percibida.',c:'El protocolo original consta de veinte sesiones.',d:'Cada sesión incluye una revisión inicial, el diálogo con el avatar y una discusión posterior o debriefing.'},c:'d',
    x:'La opción d es correcta: las sesiones de AVATAR se estructuran mediante revisión inicial, diálogo terapéutico con la representación de la voz y una discusión posterior para consolidar aprendizajes. La a es falsa porque se dirige principalmente a alucinaciones verbales auditivas persistentes, no a alucinaciones visuales. La b es falsa porque no se exige una semejanza fija del 90 %; el avatar se ajusta colaborativamente para representar la voz. La c es falsa porque el protocolo inicial fue breve y no constaba de veinte sesiones.',r:'Leff, J. et al. (2013). Avatar therapy for persecutory auditory hallucinations: What is it and how does it work? Psychosis, 6(2), 166–176. https://doi.org/10.1080/17522439.2013.773457; '+F},
};

for (const [id, fields] of Object.entries(updates)) {
  const q = data.find(item => item.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  if (q.t?.[0] !== topic) throw new Error(`Tema inesperado en ${id}`);
  Object.assign(q, fields, {v:'VALIDADA_ORIGINAL'});
}
fs.writeFileSync(file, JSON.stringify(data) + '\n');
console.log(JSON.stringify({audited:Object.keys(updates).length, ids:Object.keys(updates)}, null, 2));
