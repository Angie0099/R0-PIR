import fs from "node:fs";

const bankFile = "public/banco/clinica_adultos.json";
const reportFile = "analysis/audit_reports/depresion_lote100_20260831.json";
const bank = JSON.parse(fs.readFileSync(bankFile, "utf8"));
const pending = bank.filter(q => q.t?.includes("Trastornos depresivos") && q.v === "REVISAR").slice(0, 100);
if (pending.length !== 100) throw new Error(`Se esperaban 100 pendientes y hay ${pending.length}`);
const selectedIds = new Set(pending.map(q => q.id));

const DSM = "American Psychiatric Association (2022). DSM-5-TR. Trastornos depresivos: criterios diagnósticos y especificadores; Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, pp. 238-253.";
const COURSE = "Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, curso de los trastornos depresivos, pp. 250-253.";
const apply = (id, e, o, c, x, r = DSM) => {
  if (!selectedIds.has(id)) throw new Error(`El ID no pertenece al lote: ${id}`);
  const q = bank.find(item => item.id === id);
  if (!q) throw new Error(`No existe ${id}`);
  Object.assign(q, { e, o, c, x, r, v:"VALIDADA_ORIGINAL" });
};

apply("DICIEMBRE-UNO-24_COMENTADO_094",
  "En el curso del trastorno depresivo mayor, ¿qué se entiende por respuesta al tratamiento?",
  {a:"Ausencia de síntomas significativos durante al menos dos meses.",b:"Reducción de al menos el 50 % de la gravedad de los síntomas respecto a la línea base.",c:"Incumplimiento de los criterios diagnósticos completos.",d:"Retorno al funcionamiento previo normal."}, "b",
  "La opción b es correcta: la respuesta al tratamiento se define como una reducción de al menos el 50 % de la gravedad sintomática respecto a la línea base. La a describe remisión total; la c puede formar parte de la remisión parcial, pero no define por sí sola la respuesta; y la d corresponde a la recuperación funcional.", COURSE);

apply("JUNIO-UNO-24_COMENTADO_053",
  "Respecto al desarrollo y curso del trastorno depresivo mayor, señale la afirmación correcta:",
  {a:"La cronicidad disminuye la probabilidad de trastornos comórbidos de personalidad, ansiedad o consumo de sustancias.",b:"El riesgo de recurrencia disminuye progresivamente cuanto más se prolonga la remisión.",c:"Dos de cada cinco pacientes se recuperan dentro de los seis meses y cuatro de cada cinco en dos años.",d:"Las diferencias por sexo en prevalencia se reproducen necesariamente en fenomenología, curso y respuesta al tratamiento."}, "b",
  "La opción b es correcta: el riesgo de recurrencia disminuye conforme aumenta la duración de la remisión. La a invierte la relación, pues la cronicidad aumenta la probabilidad de comorbilidad; la c prolonga incorrectamente los intervalos descritos, que son aproximadamente tres meses y un año; y la d es falsa porque las diferencias de prevalencia por sexo no implican diferencias equivalentes en fenomenología, curso o respuesta. Se corrige la clave previa, que marcaba a.", DSM);

apply("PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_058",
  "Según el DSM-5-TR, ¿qué especificación corresponde cuando durante los dos años previos se han cumplido de forma persistente todos los criterios de un episodio depresivo mayor?",
  {a:"Trastorno depresivo persistente, con síndrome depresivo mayor persistente.",b:"Trastorno depresivo mayor crónico.",c:"Trastorno depresivo persistente, con síndrome distímico puro.",d:"Trastorno depresivo mayor con características melancólicas."}, "a",
  "La opción a es correcta: el DSM-5-TR permite especificar síndrome depresivo mayor persistente cuando se han cumplido los criterios completos durante los dos años anteriores. La b no es la denominación diagnóstica vigente; la c exige que no se hayan cumplido criterios completos de episodio depresivo mayor durante esos dos años; y la d describe un especificador fenomenológico distinto.");

apply("PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-UNO-23_056",
  "Respecto a los criterios del trastorno depresivo persistente en el DSM-5-TR, señale la afirmación correcta:",
  {a:"En menores, el estado de ánimo puede ser irritable y la duración mínima es de seis meses.",b:"Los criterios de episodio depresivo mayor no pueden estar presentes continuamente durante dos años.",c:"Durante el período de dos años, la persona no ha estado sin los síntomas de los criterios A y B durante más de dos meses seguidos.",d:"La agitación o el retraso psicomotor forma parte obligatoria del criterio B."}, "c",
  "La opción c es correcta y reproduce el criterio de persistencia. La a es falsa porque en menores la duración mínima es de un año; la b es falsa porque los criterios de episodio depresivo mayor pueden estar presentes de forma continua; y la d es falsa porque la alteración psicomotora no integra la lista de seis síntomas del criterio B.");

apply("PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_081",
  "En la terminología clásica del curso de la depresión mayor, ¿qué duración de criterios diagnósticos plenos define la cronicidad?",
  {a:"Más de un año.",b:"Más de dos años.",c:"Más de tres años.",d:"Más de cinco años."}, "b",
  "La opción b es correcta: la cronicidad se ha definido como el mantenimiento de criterios diagnósticos plenos durante más de dos años consecutivos. Un año (a) es insuficiente y los umbrales de tres (c) y cinco años (d) no corresponden a esta definición.", COURSE);

apply("PERSEVER___SIMULACRO_COMENTADO_MAYO-UNO-23_096",
  "¿Cuál es el número mínimo total de características necesario para aplicar el especificador «con características melancólicas»?",
  {a:"Una.",b:"Dos.",c:"Tres.",d:"Cuatro."}, "d",
  "La opción d es correcta: se requiere al menos una de las dos características nucleares del criterio A y tres o más características del criterio B, es decir, un mínimo total de cuatro. Las opciones a, b y c no alcanzan simultáneamente ambos requisitos.");

apply("PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_162",
  "¿Qué síntomas aparecen en el criterio B del trastorno depresivo persistente, pero no en la lista de síntomas del episodio depresivo mayor?",
  {a:"Baja autoestima y desesperanza.",b:"Ansiedad y síntomas físicos.",c:"Sentimientos de inutilidad y desesperanza.",d:"Irritabilidad y llanto frecuente."}, "a",
  "La opción a es correcta: baja autoestima y desesperanza son síntomas específicos de la lista del trastorno depresivo persistente. La b no constituye una pareja de criterios diagnósticos; la c incluye inutilidad, que pertenece al episodio depresivo mayor; y la d no recoge dos síntomas del criterio B.");

apply("PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_163",
  "¿Qué conjunto contiene únicamente características del especificador melancólico?",
  {a:"Pérdida de placer, despertar precoz y cualidad distintiva del estado de ánimo.",b:"Reactividad del ánimo, parálisis plúmbea y sensibilidad al rechazo.",c:"Pérdida de placer, parálisis plúmbea y miedo a perder el control.",d:"Reactividad del ánimo, despertar precoz e inquietud."}, "a",
  "La opción a es correcta: sus tres elementos pertenecen al especificador melancólico. La b reúne características atípicas; la c mezcla pérdida de placer con parálisis plúmbea y un síntoma que no define el especificador; y la d mezcla reactividad atípica con despertar precoz melancólico.");

apply("PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_173",
  "¿Cómo se denomina la reaparición de síntomas depresivos durante la remisión del mismo episodio?",
  {a:"Recurrencia.",b:"Cronicidad.",c:"Recaída.",d:"Falta de respuesta."}, "c",
  "La opción c es correcta: la recaída ocurre durante la remisión, antes de consolidarse la recuperación. La recurrencia (a) implica un nuevo episodio tras la recuperación; la cronicidad (b) es persistencia prolongada; y la falta de respuesta (d) es ausencia de mejoría suficiente, no reaparición.", COURSE);

apply("PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_083",
  "¿Cuál de estos síntomas del episodio depresivo mayor no aparece en el criterio B del trastorno depresivo persistente?",
  {a:"Insomnio o hipersomnia.",b:"Disminución marcada del interés o del placer.",c:"Baja autoestima.",d:"Dificultad para concentrarse o tomar decisiones."}, "b",
  "La opción b es correcta: la anhedonia forma parte del episodio depresivo mayor, pero no de la lista de seis síntomas del criterio B del trastorno depresivo persistente. El sueño alterado (a), la baja autoestima (c) y las dificultades de concentración o decisión (d) sí aparecen en dicho criterio.");

apply("PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_023",
  "Respecto al especificador «con patrón estacional» del trastorno depresivo mayor, señale la afirmación correcta:",
  {a:"Durante dos años debe haber al menos cuatro episodios estacionales y también episodios no estacionales.",b:"Los episodios comienzan habitualmente en primavera o verano y remiten en otoño o invierno.",c:"Los episodios estacionales se caracterizan principalmente por insomnio y pérdida de peso.",d:"Su prevalencia aumenta con la latitud y las personas jóvenes presentan mayor riesgo de episodios depresivos invernales."}, "d",
  "La opción d es correcta. La a es falsa porque se requiere una relación temporal regular durante dos años y ausencia de episodios no estacionales en ese período, no cuatro episodios; la b invierte el patrón más frecuente; y la c describe rasgos melancólicos, mientras el patrón invernal se asocia más a hipersomnia, hiperfagia y aumento de peso.");

apply("PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_028",
  "¿Cuál de estos síntomas forma parte del episodio depresivo mayor según el DSM-5-TR?",
  {a:"Baja autoestima.",b:"Irritabilidad intensa en todos los adultos.",c:"Desesperanza como criterio independiente.",d:"Sentimientos de inutilidad o culpa excesiva o inapropiada."}, "d",
  "La opción d es correcta y corresponde al criterio A7. La baja autoestima (a) y la desesperanza (c) aparecen expresamente en el trastorno depresivo persistente, no como ítems independientes del episodio depresivo mayor; y la irritabilidad (b) puede sustituir al ánimo deprimido en menores, pero no es un criterio independiente obligatorio en adultos.");

apply("SM_ABRIL_2_SOL_1_080",
  "En el trastorno depresivo mayor, ¿qué intervalo sin síntomas significativos puede formar parte de la especificación «en remisión parcial» tras finalizar el episodio?",
  {a:"Al menos dos meses.",b:"Menos de dos meses.",c:"Más de seis meses.",d:"Tres meses o más."}, "b",
  "La opción b es correcta: existe remisión parcial cuando ya no se cumplen todos los criterios o cuando el período sin síntomas significativos dura menos de dos meses. Dos meses o más (a), más de seis meses (c) y tres meses o más (d) no satisfacen esa definición.");

apply("SM_AGOSTO_1_SOL_1_085",
  "¿Qué característica es imprescindible para aplicar el especificador «con características atípicas»?",
  {a:"Aumento notable de peso o apetito.",b:"Reactividad del estado de ánimo.",c:"Sensibilidad prolongada al rechazo interpersonal.",d:"Agitación o retraso psicomotor."}, "b",
  "La opción b es correcta: la reactividad del estado de ánimo constituye el criterio A obligatorio. El aumento de peso o apetito (a) y la sensibilidad al rechazo (c) son características adicionales del criterio B, de las que se requieren dos; la alteración psicomotora (d) pertenece al especificador melancólico.");

apply("SM_ENERO_1_SOL_1_106",
  "Sobre el trastorno depresivo persistente, señale la afirmación incorrecta:",
  {a:"Su covariación con rasgos del trastorno límite de la personalidad sugiere posibles mecanismos compartidos.",b:"El inicio temprano se asocia a mayor probabilidad de trastornos de personalidad y por consumo de sustancias.",c:"Neuroticismo, mayor gravedad sintomática y peor funcionamiento son factores ambientales de mal pronóstico.",d:"Presenta mayor riesgo de comorbilidad ansiosa y por consumo de sustancias que el trastorno depresivo mayor."}, "c",
  "La opción c es la incorrecta: neuroticismo, gravedad de síntomas y funcionamiento global son características individuales o clínicas, no factores ambientales. Las opciones a, b y d recogen asociaciones descritas para el trastorno depresivo persistente y su curso.");

apply("SM_JUNIO_2_SOL_1_022",
  "¿Cuál de los siguientes NO pertenece al criterio B del trastorno depresivo persistente?",
  {a:"Sentimientos de inutilidad o culpa excesiva o inapropiada.",b:"Dificultad para concentrarse o tomar decisiones.",c:"Baja autoestima.",d:"Poco apetito o sobrealimentación."}, "a",
  "La opción a es correcta: inutilidad o culpa excesiva pertenece al episodio depresivo mayor, no al criterio B del trastorno depresivo persistente. Las dificultades cognitivas (b), la baja autoestima (c) y la alteración del apetito (d) sí forman parte de ese criterio.");

apply("SM_MAYO_1_SOL_1_088",
  "En el trastorno depresivo persistente, ¿qué especificador de inicio corresponde cuando el comienzo se produce a los 21 años?",
  {a:"Inicio temprano.",b:"Inicio tardío.",c:"Características atípicas.",d:"Síndrome distímico puro."}, "b",
  "La opción b es correcta: inicio tardío significa comienzo a los 21 años o después; inicio temprano (a) exige que sea antes de los 21. Las opciones c y d describen otros tipos de especificación y no clasifican la edad de inicio.");

apply("Simu 13 comentado_039",
  "¿Cómo se denomina la reaparición de sintomatología depresiva durante el período de remisión?",
  {a:"Remisión parcial.",b:"Remisión total.",c:"Recuperación.",d:"Recaída."}, "d",
  "La opción d es correcta: una recaída es la reaparición de síntomas durante la remisión. La remisión parcial (a) y total (b) describen grados de mejoría; la recuperación (c) implica una remisión mantenida y retorno funcional.", COURSE);

apply("SmCm10PIR2025_025",
  "Una persona con depresión presenta falta de reactividad ante estímulos placenteros, desaliento profundo, anorexia y culpa excesiva. ¿Qué especificador corresponde?",
  {a:"Con ansiedad.",b:"Con características mixtas.",c:"Con características melancólicas.",d:"Con características atípicas."}, "c",
  "La opción c es correcta: la ausencia de reactividad, la cualidad distintiva del ánimo, la anorexia y la culpa excesiva son rasgos melancólicos. La ansiedad (a) requiere síntomas de tensión o temor; las características mixtas (b), síntomas maníacos o hipomaníacos; y las atípicas (d) exigen reactividad del ánimo, justamente lo contrario.");

apply("SmCm1PIR2024_152",
  "¿Qué condición define la remisión total de un episodio depresivo mayor?",
  {a:"Reducción superior al 50 % de la gravedad respecto a la línea base.",b:"Remisión durante más de seis meses y retorno al funcionamiento normal.",c:"Ausencia de signos o síntomas significativos durante los últimos dos meses.",d:"Síntomas residuales sin cumplir todos los criterios durante menos de dos meses."}, "c",
  "La opción c es correcta: la remisión total implica ausencia de signos o síntomas significativos durante al menos los dos últimos meses. La a define respuesta al tratamiento; la b se aproxima a recuperación; y la d describe remisión parcial.", COURSE);

apply("SmCm21PIR2025 (2)_017",
  "Respecto a la depresión breve recurrente incluida en «otro trastorno depresivo especificado», señale la afirmación correcta:",
  {a:"Los episodios pueden coincidir sistemáticamente con la menstruación.",b:"Cada episodio dura como mínimo 24 meses.",c:"Los episodios duran entre 2 y 13 días.",d:"Puede diagnosticarse aunque haya existido un episodio maníaco o hipomaníaco."}, "c",
  "La opción c es correcta: los episodios duran de 2 a 13 días y se repiten con la frecuencia indicada por el DSM-5-TR. La a es falsa porque no deben coincidir exclusivamente con el ciclo menstrual; la b confunde días con una duración crónica; y la d es falsa porque un antecedente maníaco o hipomaníaco excluye este diagnóstico depresivo.");

apply("SmCm23PIR2025_045",
  "¿Cuál de estos síntomas pertenece al especificador «con ansiedad» de un episodio depresivo?",
  {a:"Miedo a que pueda ocurrir algo terrible.",b:"Pérdida de placer en casi todas las actividades.",c:"Despertar al menos dos horas antes de lo habitual.",d:"Parálisis plúmbea."}, "a",
  "La opción a es correcta y forma parte de la angustia ansiosa. La pérdida generalizada de placer (b) y el despertar precoz (c) son características melancólicas; la parálisis plúmbea (d) es una característica atípica.");

apply("SmCm27PIR2025 (1)_104",
  "¿Cuál de estos síntomas NO pertenece al especificador «con características mixtas» de los trastornos depresivos?",
  {a:"Elevación de la autoestima o grandiosidad.",b:"Fuga de ideas o pensamientos acelerados.",c:"Aumento de energía dirigida a objetivos.",d:"Sensibilidad prolongada al rechazo interpersonal."}, "d",
  "La opción d es correcta: la sensibilidad al rechazo pertenece a las características atípicas. La grandiosidad (a), la fuga de ideas (b) y el aumento de actividad o energía dirigida a objetivos (c) son síntomas maníacos o hipomaníacos incluidos en las características mixtas.");

apply("SmCm29PIR2025_051",
  "En la terminología clínica clásica, ¿qué combinación se denomina «depresión doble»?",
  {a:"Trastorno depresivo mayor y trastorno bipolar I.",b:"Trastorno depresivo mayor y ciclotimia.",c:"Episodio depresivo mayor superpuesto a distimia.",d:"Trastorno depresivo menor y distimia."}, "c",
  "La opción c es correcta: depresión doble designa clásicamente la aparición de un episodio depresivo mayor sobre un curso distímico previo. Las opciones a y b incluyen trastornos bipolares, y la d no corresponde a la definición del constructo.", "Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, clasificación y curso de los trastornos depresivos, pp. 231-253.");

const safeIds = pending.filter(q => bank.find(x => x.id === q.id)?.v === "VALIDADA_ORIGINAL").map(q => q.id);
const deferred = pending.filter(q => !safeIds.includes(q.id)).map(q => ({id:q.id,reason:"Requiere contraste documental individual de modelos, epidemiología, etiología o una reescritura completa; no se publica como validada en este lote."}));
fs.mkdirSync("analysis/audit_reports", { recursive:true });
fs.writeFileSync(reportFile, JSON.stringify({createdAt:new Date().toISOString(),subject:"Clínica Adultos",topic:"Trastornos depresivos",processed:100,validated:safeIds.length,validatedIds:safeIds,deferredCount:deferred.length,deferred}, null, 2) + "\n");
fs.writeFileSync(bankFile, JSON.stringify(bank) + "\n");
console.log(JSON.stringify({processed:pending.length,validated:safeIds.length,deferred:deferred.length,remaining:bank.filter(q=>q.t?.includes("Trastornos depresivos")&&q.v==="REVISAR").length},null,2));
