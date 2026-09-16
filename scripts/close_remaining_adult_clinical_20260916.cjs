const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
function set(id, e, o, c, x, r) {
  const q = bank.find(z => z.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  Object.assign(q, { e, o, c, x, r, v: 'VALIDADA_ORIGINAL' });
}

set('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_132',
  '¿Qué características se han relacionado específicamente con la presentación clínica del trastorno de síntomas somáticos?',
  { a: 'Atribución de los síntomas, amplificación somatosensorial y alexitimia.', b: 'Bajo nivel educativo, neuroticismo y baja apertura a la experiencia.', c: 'Sensibilidad a la ansiedad, rumiación y creencias disfuncionales.', d: 'Intolerancia a la incertidumbre, fusión pensamiento-acción y perfeccionismo.' }, 'a',
  'La atribución de sensaciones a enfermedad, la amplificación somatosensorial y las dificultades para identificar o expresar emociones se han vinculado directamente con la presentación del trastorno. La alternativa b recoge factores de riesgo y la c mezcla procesos transdiagnósticos.',
  'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill, trastornos de síntomas somáticos y relacionados.');

set('PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_060',
  '¿Cuál es una característica nuclear de la variante semántica de la afasia primaria progresiva?',
  { a: 'Agramatismo en la producción del lenguaje.', b: 'Habla entrecortada por dificultad motora, con comprensión de palabras preservada.', c: 'Deterioro predominante de la repetición de frases.', d: 'Anomia y deterioro de la comprensión de palabras aisladas.' }, 'd',
  'La variante semántica exige como rasgos nucleares una anomia marcada y alteración de la comprensión de palabras aisladas. El agramatismo caracteriza la variante no fluente/agramática y el deterioro de la repetición de frases, la variante logopénica.',
  'Gorno-Tempini, M. L. et al. (2011). Classification of primary progressive aphasia and its variants. Neurology, 76, 1006-1014.');

set('Simu 11 comentado_010',
  '¿Para qué trastorno de la personalidad se desarrolló el modelo cognitivo-interaccional de Robert F. Bornstein?',
  { a: 'Trastorno límite de la personalidad.', b: 'Trastorno histriónico de la personalidad.', c: 'Trastorno dependiente de la personalidad.', d: 'Trastorno esquizotípico de la personalidad.' }, 'c',
  'Bornstein formuló un modelo cognitivo-interaccional de la dependencia que integra creencias sobre indefensión, motivación para obtener apoyo y conductas interpersonales de búsqueda de ayuda. Se aplica especialmente al trastorno dependiente de la personalidad.',
  'Bornstein, R. F. (1996). The dependent personality: developmental, social, and clinical perspectives. Psychological Bulletin, 112, 3-23; Bornstein, R. F. (2012). From dysfunction to adaptation: an interactionist model of dependency. Annual Review of Clinical Psychology, 8, 291-316.');

set('SmCm1PIR2024_082',
  '¿Quién propuso el modelo de la aprensión ansiosa?',
  { a: 'Borkovec.', b: 'Barlow.', c: 'Semerari.', d: 'Wells.' }, 'b',
  'Barlow conceptualizó la aprensión ansiosa como un estado orientado al futuro, caracterizado por afecto negativo, sensación de incontrolabilidad y un foco atencional dirigido hacia amenazas potenciales.',
  'Barlow, D. H. (2002). Anxiety and Its Disorders (2nd ed.). Guilford Press.');

set('SmCm1PIR2024_083',
  'Según la reformulación atribucional de la teoría de la indefensión aprendida, ¿qué estilo favorece la depresión?',
  { a: 'Atribuir los acontecimientos negativos a causas internas, estables y globales.', b: 'Atribuirlos a causas externas, inestables y específicas.', c: 'Aumentar la frecuencia de autorrefuerzo tras los éxitos.', d: 'Interpretar los fracasos como situaciones específicas y modificables.' }, 'a',
  'La reformulación atribucional plantea que explicar los acontecimientos negativos mediante causas internas, estables y globales incrementa la vulnerabilidad a la indefensión y a la depresión. La teoría original de Seligman se reformuló posteriormente para incorporar este estilo explicativo.',
  'Abramson, L. Y., Seligman, M. E. P. y Teasdale, J. D. (1978). Learned helplessness in humans: critique and reformulation. Journal of Abnormal Psychology, 87, 49-74.');

set('SmCm21PIR2025 (2)_054',
  'Según el DSM-5-TR, ¿cuándo se especifica como grave la bulimia nerviosa?',
  { a: 'Con 1-3 episodios de conductas compensatorias inapropiadas por semana.', b: 'Con 4-7 episodios por semana.', c: 'Con 14 o más episodios por semana.', d: 'Con 8-13 episodios de conductas compensatorias inapropiadas por semana.' }, 'd',
  'La gravedad se basa en la frecuencia semanal de conductas compensatorias inapropiadas: leve, 1-3; moderada, 4-7; grave, 8-13; extrema, 14 o más. Puede aumentarse el nivel según otros síntomas y el deterioro funcional.',
  'American Psychiatric Association (2022). Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR), bulimia nervosa.');

set('SmCm4PIR2024_073',
  '¿Qué diagnóstico describe la preocupación intensa por defectos percibidos en la apariencia de otra persona?',
  { a: 'Trastorno obsesivo-compulsivo.', b: 'Trastorno delirante somático.', c: 'Trastorno dismórfico corporal por poderes.', d: 'Trastorno obsesivo-compulsivo de la personalidad.' }, 'c',
  'El trastorno dismórfico corporal por poderes es una presentación incluida entre los trastornos obsesivo-compulsivos y relacionados especificados: la preocupación se centra en supuestos defectos físicos de otra persona, no en la apariencia propia.',
  'American Psychiatric Association (2022). DSM-5-TR. Otro trastorno obsesivo-compulsivo y relacionado especificado: trastorno dismórfico corporal por poderes.');

set('SmCm4PIR2024_077',
  'Señale la afirmación INCORRECTA sobre los cambios introducidos por el DSM-5 en las disfunciones sexuales:',
  { a: 'Al desaparecer el trastorno por aversión al sexo como categoría independiente, cualquier presentación de aversión sexual dejó de poder recibir un diagnóstico clínico.', b: 'El trastorno de deseo sexual hipoactivo quedó reservado a los hombres y en las mujeres se integraron deseo y excitación.', c: 'Dispareunia y vaginismo se combinaron en el trastorno de dolor genitopélvico/penetración.', d: 'Desapareció la categoría independiente de disfunción sexual debida a otra afección médica.' }, 'a',
  'La a es incorrecta: eliminar la categoría independiente no significa que una presentación clínicamente significativa quede necesariamente sin diagnóstico; puede considerarse otro diagnóstico apropiado según sus características. Las otras alternativas recogen cambios clasificatorios del DSM-5.',
  'American Psychiatric Association (2013). DSM-5. Sexual Dysfunctions; American Psychiatric Association (2022). DSM-5-TR.');

set('SmCm4PIR2024_084',
  'Respecto a las diferencias clínicas promedio de la esquizofrenia en función del sexo, señale la afirmación correcta:',
  { a: 'Los hombres suelen presentar un inicio más temprano y mayor carga de síntomas negativos.', b: 'Las mujeres inician sistemáticamente el trastorno antes que los hombres.', c: 'Las mujeres presentan necesariamente peor funcionamiento premórbido.', d: 'La mortalidad por esquizofrenia afecta exclusivamente a las mujeres.' }, 'a',
  'En promedio, los hombres muestran una edad de inicio más temprana, peor ajuste premórbido y mayor expresión de síntomas negativos. Son diferencias grupales, no reglas diagnósticas aplicables a cada persona.',
  'American Psychiatric Association (2022). DSM-5-TR. Schizophrenia, development and course; Ochoa, S. et al. (2012). Gender differences in schizophrenia and first-episode psychosis. Schizophrenia Research and Treatment, 2012, 916198.');

set('SmCm4PIR2024_086',
  '¿Qué afección orgánica puede producir episodios de ansiedad acompañados de palpitaciones, sudoración, cefalea e hipertensión por liberación de catecolaminas?',
  { a: 'Feocromocitoma.', b: 'Artrosis de rodilla.', c: 'Miopía simple.', d: 'Dermatitis de contacto localizada.' }, 'a',
  'El feocromocitoma puede causar crisis adrenérgicas con ansiedad intensa, palpitaciones, sudoración, cefalea e hipertensión, por lo que forma parte del diagnóstico diferencial médico de los síntomas ansiosos.',
  'Lenders, J. W. M. et al. (2014). Pheochromocytoma and paraganglioma: an Endocrine Society clinical practice guideline. Journal of Clinical Endocrinology & Metabolism, 99, 1915-1942.');

set('SM_DICIEMBRE_1_SOL_1_132',
  'Señale la afirmación correcta sobre los estados mentales de alto riesgo de psicosis (EMAR):',
  { a: 'Los BLIPS —síntomas psicóticos breves, limitados e intermitentes— se asocian con un riesgo elevado de transición a psicosis.', b: 'Su curso es necesariamente lineal y homogéneo.', c: 'Solo necesitan atención clínica quienes posteriormente desarrollan una psicosis.', d: 'Los distintos grupos EMAR nunca se solapan entre sí.' }, 'a',
  'Los BLIPS se asocian con un riesgo de transición especialmente elevado. El curso de los EMAR es dinámico y heterogéneo; puede existir solapamiento entre subgrupos y también quienes no transitan pueden presentar malestar, deterioro funcional y necesidad de intervención.',
  'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill, estados mentales de alto riesgo de psicosis.');

const remaining = bank.filter(q => q.v !== 'VALIDADA_ORIGINAL');
if (remaining.length) throw new Error(`Quedan preguntas sin validar: ${remaining.map(q => q.id).join(', ')}`);
for (const q of bank) {
  if (!q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || /�/.test(q.e + JSON.stringify(q.o) + q.x)) throw new Error(`Control global fallido: ${q.id}`);
}
fs.writeFileSync(file, JSON.stringify(bank));
console.log(`Clínica de adultos cerrada: ${bank.length} preguntas validadas y ninguna pendiente.`);
