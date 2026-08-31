import fs from "node:fs";

const file = "public/banco/clinica_adultos.json";
const manifestFile = "public/banco/manifest.json";
const bank = JSON.parse(fs.readFileSync(file, "utf8"));

const refCriteria = "American Psychiatric Association (2022). DSM-5-TR. Trastornos depresivos: episodio depresivo mayor y trastorno depresivo persistente; Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, pp. 238-245.";
const refSpecifiers = "American Psychiatric Association (2022). DSM-5-TR. Trastornos depresivos: especificadores de los trastornos depresivos; Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, pp. 243-253.";

const updates = {
  "SIM_PERS_AGO25_013": {
    e: "Según el DSM-5-TR, ¿durante cuánto tiempo deben estar presentes los síntomas de un episodio depresivo mayor?",
    o: { a:"Al menos una semana.", b:"Al menos dos semanas.", c:"Al menos un mes.", d:"Al menos seis meses." }, c:"b",
    x:"La opción b es correcta: el criterio A exige cinco o más síntomas durante el mismo período de dos semanas, con cambio respecto al funcionamiento previo, y al menos uno debe ser estado de ánimo deprimido o pérdida de interés o placer. La a fija una duración insuficiente; la c añade una duración que no exige el criterio; y la d se aproxima a requisitos temporales de otros trastornos, no al episodio depresivo mayor.", r:refCriteria
  },
  "JULIO1_126": {
    e:"En el episodio depresivo mayor, ¿qué síntoma debe ser observable por otras personas y no meramente subjetivo?",
    o:{ a:"Estado de ánimo deprimido.", b:"Agitación o retraso psicomotor.", c:"Disminución del interés o del placer.", d:"Disminución de la capacidad para pensar, concentrarse o tomar decisiones." }, c:"b",
    x:"La opción b es correcta: el DSM-5-TR especifica que la agitación o el retraso psicomotor ha de ser observable por otros y no limitarse a una sensación subjetiva. El estado de ánimo deprimido (a), la disminución del interés o placer (c) y las dificultades cognitivas (d) pueden ser comunicados subjetivamente, aunque también puedan ser observados por terceros.", r:refCriteria
  },
  "AGOSTO2_069": {
    e:"¿Cuál de los siguientes NO es un síntoma del criterio B del trastorno depresivo persistente en el DSM-5-TR?",
    o:{ a:"Sentimientos de culpa.", b:"Insomnio o hipersomnia.", c:"Baja autoestima.", d:"Poco apetito o sobrealimentación." }, c:"a",
    x:"La opción a es correcta: los sentimientos de culpa no figuran entre los seis síntomas del criterio B del trastorno depresivo persistente. La b sí aparece como insomnio o hipersomnia; la c, como baja autoestima; y la d, como poco apetito o sobrealimentación. Se corrige la clave previa, que marcaba erróneamente la hipersomnia.", r:refCriteria
  },
  "JULIO2_037": {
    e:"Una persona presenta ánimo deprimido, alteración del sueño, fatiga y pensamientos recurrentes de muerte durante dos semanas. Si no reúne cinco síntomas de episodio depresivo mayor, ¿qué categoría DSM-5-TR describe mejor el cuadro?",
    o:{ a:"Otro trastorno depresivo especificado, episodio depresivo con síntomas insuficientes.", b:"Trastorno depresivo persistente.", c:"Trastorno depresivo mayor.", d:"Otro trastorno depresivo especificado, episodio depresivo de corta duración." }, c:"a",
    x:"La opción a es correcta: hay cuatro síntomas durante al menos dos semanas, por lo que falta el mínimo de cinco para un episodio depresivo mayor. La b exige ánimo deprimido crónico durante al menos dos años en adultos; la c exige cinco o más síntomas; y la d se reserva para episodios de 4-13 días con el número suficiente de síntomas, no para un cuadro de dos semanas con síntomas insuficientes.", r:refCriteria
  },
  "JULIO2_046": {
    e:"¿Qué característica pertenece al especificador «con características melancólicas» de un episodio depresivo mayor?",
    o:{ a:"Reactividad del estado de ánimo ante acontecimientos positivos.", b:"Hipersomnia.", c:"Pérdida de placer en todas o casi todas las actividades.", d:"Parálisis plúmbea." }, c:"c",
    x:"La opción c es correcta: la pérdida de placer en todas o casi todas las actividades es uno de los dos síntomas nucleares del especificador melancólico. La reactividad del ánimo (a), la hipersomnia (b) y la parálisis plúmbea (d) corresponden al especificador con características atípicas, por lo que no son respuestas válidas.", r:refSpecifiers
  },
  "JUNIO1_096": {
    e:"¿Cuál de estos síntomas forma parte de los criterios del trastorno depresivo persistente, pero no de la lista de nueve síntomas del episodio depresivo mayor?",
    o:{ a:"Sentimientos de desesperanza.", b:"Disminución del interés o del placer.", c:"Sentimientos de inutilidad o culpa excesiva.", d:"Pensamientos recurrentes de muerte." }, c:"a",
    x:"La opción a es correcta: la desesperanza figura expresamente en el criterio B del trastorno depresivo persistente. La disminución del interés o placer (b), la inutilidad o culpa excesiva (c) y los pensamientos de muerte (d) forman parte de la lista sintomática del episodio depresivo mayor, pero no de los seis síntomas específicos del criterio B del trastorno depresivo persistente.", r:refCriteria
  },
  "MAYO2_054": {
    e:"Respecto al especificador «con patrón estacional» del trastorno depresivo mayor recurrente, señale la afirmación correcta:",
    o:{ a:"El patrón debe haberse mantenido al menos tres años sin episodios no estacionales.", b:"Los episodios comienzan habitualmente en primavera y remiten en verano.", c:"Puede aplicarse aunque el patrón se explique mejor por estresores psicosociales estacionales.", d:"A lo largo de la vida, los episodios depresivos estacionales deben superar claramente a los no estacionales." }, c:"d",
    x:"La opción d es correcta: para aplicar el especificador, los episodios estacionales deben predominar claramente sobre los no estacionales a lo largo de la vida. La a es falsa porque el patrón se exige durante al menos dos años; la b invierte el patrón habitual, que suele comenzar en otoño o invierno y remitir en primavera; y la c es falsa porque no se aplica cuando el cambio se explica mejor por estresores estacionales.", r:refSpecifiers
  },
  "OCTUBRE-UNO-24_COMENTADO_062": {
    e:"Señale la afirmación correcta sobre el trastorno disfórico premenstrual según el DSM-5-TR:",
    o:{ a:"El diagnóstico debe confirmarse mediante evaluaciones retrospectivas de al menos tres ciclos.", b:"El antecedente más frecuente es el trastorno de ansiedad generalizada.", c:"La gravedad de sus síntomas puede ser comparable a la de un episodio depresivo mayor o un trastorno de ansiedad generalizada.", d:"Los anticonceptivos orales se asocian necesariamente con más síntomas premenstruales." }, c:"c",
    x:"La opción c es correcta: la gravedad, aunque no la duración, puede ser comparable a la observada en otros trastornos como el episodio depresivo mayor o el trastorno de ansiedad generalizada. La a es falsa porque la confirmación requiere evaluaciones diarias prospectivas durante al menos dos ciclos; la b es falsa porque el antecedente referido con mayor frecuencia es un episodio depresivo mayor; y la d formula un efecto necesario que el DSM-5-TR no establece.", r:refCriteria
  },
  "SEPTIEMBRE-DOS-24_COMENTADO_092": {
    e:"Respecto a los especificadores diagnósticos de los trastornos depresivos en el DSM-5-TR, señale la afirmación correcta:",
    o:{ a:"En el trastorno depresivo mayor se especifica inicio temprano o tardío.", b:"Al trastorno disfórico premenstrual no se le aplican especificadores diagnósticos.", c:"La remisión parcial exige ausencia total de síntomas durante al menos tres meses.", d:"«Con características mixtas» significa que predominan síntomas de ansiedad." }, c:"b",
    x:"La opción b es correcta: el DSM-5-TR no establece especificadores para el trastorno disfórico premenstrual. La a atribuye al trastorno depresivo mayor un especificador de inicio propio del trastorno depresivo persistente; la c confunde remisión parcial con ausencia mantenida de síntomas; y la d es falsa porque las características mixtas requieren síntomas maníacos o hipomaníacos, no síntomas de ansiedad.", r:refSpecifiers
  },
  "PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_148": {
    e:"En la depresión mayor, ¿cómo se denomina la reaparición de síntomas depresivos durante el período de remisión del mismo episodio?",
    o:{ a:"Remisión parcial.", b:"Recaída.", c:"Recurrencia.", d:"Cronicidad." }, c:"b",
    x:"La opción b es correcta: una recaída es la reaparición de sintomatología durante la remisión, antes de que se haya consolidado la recuperación. La remisión parcial (a) describe mejoría sin desaparición completa o un período aún breve sin síntomas; la recurrencia (c) es la aparición de un nuevo episodio tras la recuperación; y la cronicidad (d) implica persistencia prolongada del episodio. Se corrige la clave previa, que señalaba erróneamente cronicidad.", r:"Belloch, Sandín y Ramos (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 6, curso clínico de la depresión mayor, p. 253."
  }
};

for (const [id, fields] of Object.entries(updates)) {
  const q = bank.find(item => item.id === id);
  if (!q) throw new Error(`ID no encontrado: ${id}`);
  if (!q.t?.includes("Trastornos depresivos")) throw new Error(`Tema incorrecto: ${id}`);
  Object.assign(q, fields, { v:"VALIDADA_ORIGINAL" });
}

fs.writeFileSync(file, JSON.stringify(bank, null, 2) + "\n");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
if (manifest.total !== 16089 || manifest.subjects["Clínica Adultos"].count !== bank.length) throw new Error("El manifiesto no coincide con el banco.");
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ corrected:Object.keys(updates).length, remaining:bank.filter(q => q.t?.includes("Trastornos depresivos") && q.v === "REVISAR").length }, null, 2));
