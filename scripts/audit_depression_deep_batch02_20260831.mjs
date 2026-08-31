import fs from "node:fs";

const file = "public/banco/clinica_adultos.json";
const bank = JSON.parse(fs.readFileSync(file, "utf8"));
const DSM = "American Psychiatric Association (2022). DSM-5-TR. Trastornos depresivos; Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6.";
const MODELS = "Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, modelos explicativos y factores psicológicos de los trastornos depresivos.";
const set = (id, e, o, c, x, r = DSM) => {
  const q = bank.find(v => v.id === id);
  if (!q || q.v !== "REVISAR" || !q.t?.includes("Trastornos depresivos")) throw new Error(`No aplicable: ${id}`);
  Object.assign(q, {e,o,c,x,r,v:"VALIDADA_ORIGINAL"});
};

set("ABRIL-UNO-24_COMENTADO_138", "Respecto al trastorno depresivo mayor, señale la afirmación correcta:",
  {a:"La prevalencia en personas de 18 a 29 años es aproximadamente tres veces mayor que en las de 60 años o más.",b:"Aunque es más frecuente en mujeres, en España la prevalencia es igual en ambos sexos.",c:"Cada año se suicida aproximadamente el 5 % de las personas con depresión recurrente.",d:"Uno de los síntomas nucleares obligatorios debe ser ánimo deprimido o pérdida de energía."}, "a",
  "La opción a es correcta y reproduce la diferencia de prevalencia por edad descrita por el DSM-5-TR. La b es falsa porque también en España el riesgo es mayor en mujeres; la c sobrestima la mortalidad anual; y la d es falsa porque uno de los síntomas nucleares debe ser ánimo deprimido o pérdida de interés o placer, no pérdida de energía.");

set("MAYO-DOS-24_COMENTADO_151", "Respecto al trastorno depresivo persistente, señale la afirmación incorrecta:",
  {a:"Además del ánimo deprimido, se requieren al menos dos síntomas entre alteraciones del apetito o sueño, baja energía, baja autoestima, dificultades cognitivas y desesperanza.",b:"Los criterios de episodio depresivo mayor pueden estar presentes de forma continua durante los dos años.",c:"Un inicio a los 21 años se especifica como inicio temprano.",d:"El inicio temprano se asocia a mayor probabilidad de trastornos de personalidad y por consumo de sustancias."}, "c",
  "La opción c es la incorrecta: el inicio temprano es antes de los 21 años; a los 21 o después es inicio tardío. La a resume correctamente el criterio B; la b refleja que el episodio depresivo mayor puede persistir durante todo el período; y la d recoge asociaciones clínicas descritas para el inicio temprano.");

set("MAYO-UNO-24_COMENTADO_031", "Señale la afirmación incorrecta sobre el trastorno depresivo mayor:",
  {a:"La ausencia de síntomas residuales durante la remisión predice claramente la recurrencia.",b:"Las alteraciones psicomotoras y la culpa delirante son menos frecuentes, pero indican mayor gravedad.",c:"En personas mayores institucionalizadas, la depresión se asocia a mayor mortalidad durante el primer año.",d:"La hipersomnia y la hiperfagia son comparativamente más frecuentes en personas jóvenes."}, "a",
  "La opción a es incorrecta: lo que predice recurrencia es la persistencia de síntomas residuales, no su ausencia. La b es correcta porque esos síntomas menos frecuentes indican gravedad; la c recoge el aumento de mortalidad asociado a depresión en residencias; y la d describe el patrón etario señalado en el DSM-5-TR.");

set("PERSEV_JUL25_D2_077", "Señale la afirmación incorrecta sobre los síntomas anímicos de la depresión mayor:",
  {a:"La tristeza es el síntoma anímico prototípico.",b:"En depresiones graves puede aparecer incapacidad para llorar o incluso negación subjetiva de tristeza.",c:"La sobreproducción emocional combina tristeza con otras emociones negativas y se asocia a rumiación.",d:"La depresión se relaciona principalmente con sensibilización del sistema de castigo, más que con atenuación del sistema de recompensa."}, "d",
  "La opción d es incorrecta: la depresión se vincula especialmente con una atenuación del sistema de recompensa y de las emociones positivas. La a identifica el síntoma anímico prototípico; la b puede observarse en cuadros graves; y la c describe la sobreproducción emocional y su relación con la rumiación.", MODELS);

set("PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_075", "Respecto a las manifestaciones cognitivas y somáticas de la depresión, señale la afirmación correcta:",
  {a:"Tras la mejoría remiten todas las dificultades cognitivas excepto la concentración.",b:"Los problemas de sueño afectan al 70-80 % y consisten habitualmente en hipersomnia.",c:"La pérdida de energía aparece como un síntoma central en los estudios de redes de síntomas depresivos.",d:"La cognición fría se refiere a sesgos emocionales y la cognición caliente a memoria, atención y concentración."}, "c",
  "La opción c es correcta: los análisis de redes sitúan la pérdida de energía en una posición central. La a es falsa porque la velocidad de procesamiento puede persistir; la b invierte el patrón habitual, pues predomina el insomnio; y la d intercambia los conceptos: la cognición caliente implica procesamiento emocional y la fría, rendimiento cognitivo general.", MODELS);

set("PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_033", "¿Qué describe el fenómeno de sensibilización o kindling en la depresión?",
  {a:"Cada episodio depende cada vez más del episodio anterior y necesita estresores mayores.",b:"Cada episodio se vincula progresivamente a estresores ambientales de mayor intensidad.",c:"Con cada recurrencia se necesitan más estresores para provocar un episodio.",d:"Estresores progresivamente menores pueden desencadenar episodios de intensidad comparable."}, "d",
  "La opción d es correcta: con las recurrencias disminuye la magnitud del estrés necesaria para desencadenar un nuevo episodio. Las opciones a, b y c afirman directa o indirectamente lo contrario al exigir una dependencia o intensidad creciente del estresor.", MODELS);

set("PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_050", "Según la teoría de los estilos de respuesta de Nolen-Hoeksema, señale la afirmación correcta:",
  {a:"Es una teoría centrada principalmente en el origen del primer episodio depresivo.",b:"Considera la rumiación exclusivamente un factor metacognitivo.",c:"Sostiene que la rumiación es consecuencia directa de la anhedonia.",d:"Los estilos de respuesta pueden aprenderse por modelado y por prácticas de socialización de figuras relevantes."}, "d",
  "La opción d es correcta: el aprendizaje puede producirse observando los estilos de figuras relevantes y mediante prácticas de socialización. La a es falsa porque la teoría explica sobre todo el curso y mantenimiento; la b reduce indebidamente la rumiación a un único nivel metacognitivo; y la c es falsa porque se relaciona con sobreproducción emocional, no se deriva necesariamente de la anhedonia.", "Nolen-Hoeksema, S. (1991). Responses to depression and their effects on the duration of depressive episodes. Journal of Abnormal Psychology, 100(4), 569-582. https://doi.org/10.1037/0021-843X.100.4.569; " + MODELS);

set("PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_075", "¿Con qué trastorno se asocia el denominado modelo de enlentecimiento biológico de Paykel?",
  {a:"Trastorno catatónico.",b:"Trastorno disociativo.",c:"Trastorno de síntomas somáticos.",d:"Trastorno depresivo."}, "d",
  "La opción d es correcta: el modelo describe la reducción generalizada de actividades cognitivas, emocionales y motoras en la depresión. Catatonía (a), disociación (b) y síntomas somáticos (c) son categorías distintas y no constituyen el trastorno para el que se formuló el modelo.", MODELS);

set("SEPTIEMBRE-UNO-24_COMENTADO_157", "En la teoría cognitiva de Beck, ¿qué error consiste en alcanzar una conclusión sin evidencia suficiente o incluso con evidencia contraria?",
  {a:"Inferencia arbitraria.",b:"Abstracción selectiva.",c:"Generalización excesiva.",d:"Personalización."}, "a",
  "La opción a es correcta: la inferencia arbitraria extrae una conclusión sin apoyo o contra la evidencia. La abstracción selectiva (b) se centra en un detalle fuera de contexto; la generalización excesiva (c) formula una regla amplia desde uno o pocos hechos; y la personalización (d) atribuye acontecimientos externos a uno mismo sin base suficiente.", "Beck, A. T., Rush, A. J., Shaw, B. F. y Emery, G. (1979). Cognitive Therapy of Depression. Guilford Press; " + MODELS);

set("SIM_13_016", "¿Qué rasgo diferencia principalmente al trastorno depresivo persistente de un episodio depresivo mayor aislado?",
  {a:"Síntomas necesariamente graves y breves.",b:"Curso crónico del estado de ánimo deprimido, de al menos dos años en adultos.",c:"Presencia obligatoria de episodios maníacos.",d:"Presencia obligatoria de alucinaciones."}, "b",
  "La opción b es correcta: el rasgo diferencial es la persistencia del ánimo deprimido durante al menos dos años en adultos. La a contradice su carácter crónico; la c excluiría un diagnóstico depresivo y orientaría al espectro bipolar; y la d no es necesaria para el diagnóstico.");

set("SIM_ABR2_021", "¿Cuál es la duración mínima del estado de ánimo deprimido para diagnosticar trastorno depresivo persistente en adultos?",
  {a:"Dos años.",b:"Dos semanas.",c:"Seis meses.",d:"Un mes."}, "a",
  "La opción a es correcta: en adultos se requieren al menos dos años. Dos semanas (b) corresponde al intervalo del episodio depresivo mayor; seis meses (c) y un mes (d) no son los umbrales establecidos para este trastorno.");

set("SIM_ABR2_051", "Según la formulación clásica de la hipótesis monoaminérgica, ¿qué neurotransmisores se han relacionado con la depresión?",
  {a:"Serotonina, noradrenalina y dopamina.",b:"Únicamente GABA.",c:"Únicamente acetilcolina.",d:"Glutamato y aspartato exclusivamente."}, "a",
  "La opción a es correcta como descripción histórica de la hipótesis monoaminérgica, que implicó serotonina, noradrenalina y dopamina. Las opciones b, c y d reducen la explicación a sistemas distintos o exclusivos que no definen esa hipótesis clásica. Esto no significa que un simple déficit monoaminérgico explique por sí solo la depresión.", MODELS);

set("SIM_ABR25_052", "¿Qué patrón de estado de ánimo caracteriza al trastorno depresivo persistente?",
  {a:"Síntomas muy graves durante pocos días.",b:"Estado de ánimo deprimido la mayor parte del día, la mayoría de los días, con curso crónico.",c:"Alternancia obligatoria con episodios maníacos.",d:"Alucinaciones persistentes como síntoma nuclear."}, "b",
  "La opción b es correcta y recoge el núcleo diagnóstico. La a describe un curso breve incompatible con el trastorno; la c orienta a bipolaridad; y la d no constituye un criterio nuclear ni obligatorio.");

set("SIM_ABR25_121", "Además de serotonina y noradrenalina, ¿qué monoamina se incluyó tradicionalmente en las hipótesis biológicas de la depresión?",
  {a:"Glutamato.",b:"Dopamina.",c:"Acetilcolina.",d:"Histamina."}, "b",
  "La opción b es correcta: la dopamina forma parte de las monoaminas tradicionalmente consideradas junto con serotonina y noradrenalina. El glutamato (a) no es una monoamina; la acetilcolina (c) pertenece a otro sistema transmisor; y la histamina (d), aunque monoamina, no integra la tríada clásica planteada en esta pregunta.", MODELS);

set("Simu 14 comentado _037", "¿Qué teoría explica principalmente los factores que influyen en el curso y mantenimiento de los síntomas depresivos?",
  {a:"Teoría de los estilos de respuesta de Nolen-Hoeksema.",b:"Modelo de Costello.",c:"Modelo funcional de Ferster.",d:"Modelo de Lewinsohn."}, "a",
  "La opción a es correcta: la teoría analiza cómo la rumiación o la distracción influyen en la duración y gravedad de los síntomas. Costello (b), Ferster (c) y Lewinsohn (d) ofrecen explicaciones conductuales o etiológicas distintas y no son la teoría específicamente centrada en estilos de respuesta ante síntomas iniciales.", "Nolen-Hoeksema, S. (1991). Journal of Abnormal Psychology, 100(4), 569-582. https://doi.org/10.1037/0021-843X.100.4.569.");

set("Simu 16 comentado_119", "Según el modelo cognitivo de Beck, ¿qué dos tipos de esquemas depresógenos se han diferenciado?",
  {a:"Sociotropía, activada por pérdidas interpersonales, y autonomía, activada por fracasos de independencia o logro.",b:"Sociotropía ante fracasos de autonomía y autonomía ante pérdidas interpersonales.",c:"Visión negativa de uno mismo y visión positiva del futuro.",d:"Rumiación y distracción."}, "a",
  "La opción a es correcta. La b intercambia los dominios de activación; la c deforma la tríada cognitiva y no nombra los dos esquemas; y la d pertenece a la teoría de estilos de respuesta de Nolen-Hoeksema.", "Beck, A. T. (1983). Cognitive therapy of depression: New perspectives. En P. J. Clayton y J. E. Barrett (eds.), Treatment of Depression; " + MODELS);

set("Simu 32 comentado hardcore 2_070", "¿Qué teoría de la depresión no es, en su formulación principal, un modelo de vulnerabilidad-estrés sobre el inicio del episodio?",
  {a:"Teoría cognitiva de Beck.",b:"Teoría de la indefensión aprendida.",c:"Teoría de la desesperanza.",d:"Teoría de los estilos de respuesta de Nolen-Hoeksema."}, "d",
  "La opción d es correcta: se centra en cómo la respuesta a los síntomas influye en su duración y gravedad, no principalmente en la interacción vulnerabilidad-estrés que inicia el episodio. Beck (a), la indefensión (b) y la desesperanza (c) incluyen vulnerabilidades que interactúan con acontecimientos negativos.", MODELS);

set("Simu 32 comentado hardcore 2_073", "Respecto a los modelos explicativos de la depresión, señale la afirmación incorrecta:",
  {a:"La depresión se explica por completo mediante un déficit de serotonina y noradrenalina, sin otros sistemas o niveles explicativos.",b:"Beck propone una tríada negativa sobre uno mismo, el mundo y el futuro.",c:"Lewinsohn destaca la pérdida de refuerzo positivo y de actividades gratificantes.",d:"La reformulación atribucional de la indefensión destaca atribuciones internas, estables y globales ante acontecimientos negativos."}, "a",
  "La opción a es incorrecta: la evidencia actual no permite explicar la depresión por un simple déficit monoaminérgico. La b resume la teoría cognitiva de Beck; la c, el modelo conductual de Lewinsohn; y la d, la reformulación atribucional clásica de la indefensión.", MODELS);

set("Simu 32 comentado hardcore 2_077", "Respecto a la epidemiología y el curso de la depresión mayor, señale la afirmación incorrecta:",
  {a:"Es más frecuente en mujeres que en hombres.",b:"Puede comenzar en cualquier edad, aunque aumenta claramente desde la adolescencia.",c:"Su curso es necesariamente crónico y continuo, sin recurrencias ni períodos de remisión.",d:"Puede incluir alteraciones del sueño y apetito, pérdida de energía, problemas de concentración e ideación de muerte."}, "c",
  "La opción c es incorrecta: el curso es variable y con frecuencia episódico y recurrente, con posibles períodos de remisión. La mayor frecuencia en mujeres (a), el aumento desde la adolescencia sin edad exclusiva de inicio (b) y las manifestaciones descritas en d son compatibles con el DSM-5-TR.");

set("SM_ABRIL_1_SOL_1_051", "Según la teoría de los estilos de respuesta de Nolen-Hoeksema, señale la afirmación falsa:",
  {a:"Es una teoría centrada tanto en el origen como en el curso de la depresión.",b:"El estilo rumiativo puede aprenderse durante el desarrollo a partir de figuras relevantes.",c:"Ante los síntomas se diferencian respuestas rumiativas y de distracción.",d:"La rumiación se relaciona con la elaboración repetitiva de emociones y contenidos negativos."}, "a",
  "La opción a es falsa: la teoría se centra principalmente en el curso, duración y gravedad de los síntomas una vez aparecen. Las opciones b, c y d describen vías de aprendizaje y características del estilo rumiativo compatibles con el modelo.", "Nolen-Hoeksema, S. (1991). Journal of Abnormal Psychology, 100(4), 569-582. https://doi.org/10.1037/0021-843X.100.4.569; " + MODELS);

fs.writeFileSync(file, JSON.stringify(bank) + "\n");
const changed = bank.filter(q => q.v === "VALIDADA_ORIGINAL" && ["ABRIL-UNO-24_COMENTADO_138","MAYO-DOS-24_COMENTADO_151","MAYO-UNO-24_COMENTADO_031","PERSEV_JUL25_D2_077","PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_075","PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_033","PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_050","PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_075","SEPTIEMBRE-UNO-24_COMENTADO_157","SIM_13_016","SIM_ABR2_021","SIM_ABR2_051","SIM_ABR25_052","SIM_ABR25_121","Simu 14 comentado _037","Simu 16 comentado_119","Simu 32 comentado hardcore 2_070","Simu 32 comentado hardcore 2_073","Simu 32 comentado hardcore 2_077","SM_ABRIL_1_SOL_1_051"].includes(q.id));
console.log(JSON.stringify({validated:changed.length,remaining:bank.filter(q=>q.t?.includes("Trastornos depresivos")&&q.v==="REVISAR").length},null,2));
