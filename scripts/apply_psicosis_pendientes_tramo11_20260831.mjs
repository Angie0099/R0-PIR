import fs from 'node:fs';

const path = 'public/banco/psicologia_clinica.json';
const bank = JSON.parse(fs.readFileSync(path, 'utf8'));
const byId = new Map(bank.map((q) => [q.id, q]));
const update = (id, data) => {
  const q = byId.get(id);
  if (!q) throw new Error(`No existe ${id}`);
  Object.assign(q, data, { v: 'VALIDADA_ORIGINAL' });
};

const belloch = 'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.). McGraw Hill, capítulo 11: Esquizofrenia y otros trastornos psicóticos.';

update('PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_049', {
  e: 'Respecto a la dimensión desorganizada o cognitiva del espectro de la esquizofrenia, señale la afirmación FALSA:',
  o: {
    a: 'Las alteraciones del habla y del pensamiento desorganizado aparecen en un 50-80 % de los casos de esquizofrenia y en más del 70 % de los episodios maníacos.',
    b: 'Las alteraciones del habla y del pensamiento desorganizado son características de los momentos iniciales de las psicosis.',
    c: 'El deterioro cognitivo y la metacognición son predictores relevantes del funcionamiento vocacional y residencial.',
    d: 'El comportamiento catatónico aparece aproximadamente en el 15 % de las personas con sintomatología psicótica y predominan los estados de inhibición motora.'
  },
  c: 'd',
  x: 'La opción d es la falsa: aunque la catatonía puede aparecer en una minoría de personas con síntomas psicóticos, los estados de agitación motora son más frecuentes que los de inhibición. La a recoge la elevada frecuencia del habla y pensamiento desorganizados en la esquizofrenia y la manía; la b sitúa correctamente estas alteraciones desde fases iniciales; y la c refleja la asociación del rendimiento cognitivo y metacognitivo con el funcionamiento vocacional y residencial.',
  r: belloch
});

update('PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_121', {
  e: 'Según la CIE-11, señale la afirmación CORRECTA sobre el trastorno psicótico agudo y transitorio:',
  o: {
    a: 'Exige que al menos uno de los síntomas sea delirio, alucinación o lenguaje desorganizado, exactamente igual que el trastorno psicótico breve del DSM-5-TR.',
    b: 'Se caracteriza por la ausencia de síntomas negativos durante el episodio.',
    c: 'Los síntomas duran habitualmente de días a un mes y pueden prolongarse hasta seis meses.',
    d: 'Incluye los especificadores «con desencadenante grave» y «sin desencadenante grave», igual que el DSM-5-TR.'
  },
  c: 'b',
  x: 'La opción b es correcta: la CIE-11 describe un inicio agudo, variación rápida de los síntomas y ausencia de síntomas negativos durante el episodio. La a traslada indebidamente al diagnóstico CIE-11 una exigencia formulada por el DSM-5-TR; la c es falsa porque la duración no debe exceder tres meses; y la d atribuye a la CIE-11 unos especificadores propios del trastorno psicótico breve del DSM-5-TR.',
  r: 'World Health Organization (2024). ICD-11 for Mortality and Morbidity Statistics, 6A23 Acute and transient psychotic disorder. https://icd.who.int/browse/2024-01/mms/en; ' + belloch
});

update('SM_MAYO_1_SOL_1_111', {
  e: 'En relación con el curso y la evolución de la esquizofrenia, señale la afirmación correcta:',
  o: {
    a: 'Alrededor del 80 % de las personas recaen durante los cinco primeros años posteriores al primer episodio psicótico.',
    b: 'Solo el 30-40 % presenta una fase prodrómica y la despersonalización constituye su manifestación principal y necesaria.',
    c: 'Las mujeres presentan más síntomas negativos graves e ideas de grandiosidad que los hombres.',
    d: 'Durante la fase activa predominan necesariamente los síntomas negativos y los síntomas positivos se acompañan de plena conciencia de enfermedad.'
  },
  c: 'a',
  x: 'La opción a es correcta: tras un primer episodio psicótico, las recaídas son muy frecuentes durante los cinco años siguientes. La b convierte manifestaciones prodrómicas posibles en rasgos principales y necesarios; la c invierte el patrón general, pues las mujeres suelen presentar menos sintomatología negativa y mejor evolución; y la d es falsa porque la fase activa se define por síntomas psicóticos prominentes y no presupone plena conciencia de enfermedad.',
  r: belloch
});

update('simu 9 comentado_084', {
  e: 'Respecto a los déficits neuropsicológicos asociados con la esquizofrenia, señale la afirmación correcta:',
  o: {
    a: 'Las personas con esquizofrenia rinden mejor que los controles sanos en las pruebas verbales.',
    b: 'Durante la fase aguda rinden peor que durante la remisión en todas las tareas de ejecución continua, sin excepción.',
    c: 'En tareas atencionales de mayor dificultad, los familiares de primer grado pueden mostrar un rendimiento semejante al de las personas con esquizofrenia.',
    d: 'Las personas con rasgos esquizotípicos presentan déficits mucho más graves que las personas con esquizofrenia.'
  },
  c: 'c',
  x: 'La opción c es correcta: las alteraciones de la atención sostenida también pueden observarse, sobre todo al aumentar la dificultad, en familiares de primer grado y se han estudiado como posibles marcadores de vulnerabilidad. La a es falsa porque el rendimiento verbal suele estar deteriorado; la b es demasiado absoluta, ya que no todas las medidas del CPT dependen del estado clínico; y la d invierte la gravedad esperable, pues los déficits de la esquizotipia son generalmente más leves que los de la esquizofrenia.',
  r: belloch
});

update('SmCm08PIR2025_148', {
  e: 'La CIE-11 utiliza seis dominios para calificar las manifestaciones sintomáticas de la esquizofrenia y otros trastornos psicóticos primarios. ¿Cuál de los siguientes NO es uno de esos dominios?',
  o: {
    a: 'Síntomas psicóticos.',
    b: 'Síntomas cognitivos.',
    c: 'Síntomas psicomotores.',
    d: 'Síntomas depresivos.'
  },
  c: 'a',
  x: 'La opción a es correcta porque «síntomas psicóticos» no es la denominación de uno de los seis dominios calificadores de la CIE-11. Estos son síntomas positivos, negativos, depresivos, maníacos, psicomotores y cognitivos. Por ello, b, c y d sí corresponden literalmente a dominios reconocidos; la categoría amplia «psicóticos» de a debe sustituirse por el dominio específico de síntomas positivos.',
  r: 'World Health Organization (2024). ICD-11 for Mortality and Morbidity Statistics, Schizophrenia or other primary psychotic disorders: symptom manifestation qualifiers. https://icd.who.int/browse/2024-01/mms/en'
});

update('SmCm23PIR2025_201', {
  e: 'Según la teoría del «set segmental» de Shakow sobre la atención en la esquizofrenia, señale la afirmación correcta:',
  o: {
    a: 'Las personas con esquizofrenia aprovechan mejor los intervalos preparatorios regulares largos que los irregulares.',
    b: 'Las personas sin esquizofrenia mantienen una disposición general, mientras que las personas con esquizofrenia muestran una disposición fragmentada o segmentaria.',
    c: 'El efecto de entrecruzamiento se observa exclusivamente en las personas sin esquizofrenia.',
    d: 'Las personas con esquizofrenia utilizan eficazmente las señales preparatorias para mejorar su rendimiento.'
  },
  c: 'b',
  x: 'La opción b es correcta: Shakow propuso que las personas con esquizofrenia tienen dificultades para mantener un conjunto preparatorio amplio y estable y responden mediante disposiciones fragmentadas o segmentarias. La a y la d son falsas porque describen un aprovechamiento eficaz de las señales preparatorias que precisamente está comprometido; la c es falsa porque el patrón de entrecruzamiento se vinculó al rendimiento diferencial del grupo con esquizofrenia, no exclusivamente al grupo control.',
  r: 'Shakow, D. (1962). Segmental set: A theory of the formal psychological deficit in schizophrenia. Archives of General Psychiatry, 6, 1-17; ' + belloch
});

fs.writeFileSync(path, JSON.stringify(bank));
console.log('Actualizadas 6 preguntas de psicosis.');
