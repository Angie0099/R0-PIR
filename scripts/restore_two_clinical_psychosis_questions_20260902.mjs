import fs from 'node:fs';
const file=new URL('../public/banco/clinica_adultos.json',import.meta.url);
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const replacements={
  'SmCm22PIR2025 (1)_080':{
    id:'R0PIR_CA_PSI_20260902_001',
    e:'Según el DSM-5-TR, ¿qué patrón relacionado con el sexo se observa en la esquizofrenia?',
    o:{
      a:'En promedio, el inicio es más temprano en las mujeres que en los hombres.',
      b:'Las mujeres presentan, en conjunto, peor funcionamiento social y laboral premórbido.',
      c:'En promedio, el inicio es más temprano en los hombres; las mujeres muestran una edad de inicio más tardía y un segundo pico en la mediana edad.',
      d:'Las diferencias de edad de inicio entre hombres y mujeres desaparecen por completo en los estudios epidemiológicos.'
    },
    c:'c',
    x:'La opción c es correcta. El DSM-5-TR describe un inicio promedio más temprano en los hombres y una distribución de edad de inicio más tardía en las mujeres, en quienes se observa además un segundo pico durante la mediana edad. La a invierte el patrón por sexo. La b es falsa porque, en conjunto, las mujeres tienden a mostrar mejor funcionamiento social premórbido y un curso más favorable. La d es falsa porque las diferencias por sexo se mantienen como una característica epidemiológica, aunque no determinan por sí solas el diagnóstico individual.',
    r:'American Psychiatric Association (2022). DSM-5-TR: Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.), capítulo «Schizophrenia Spectrum and Other Psychotic Disorders», apartados «Development and Course» y «Sex- and Gender-Related Diagnostic Issues». American Psychiatric Association Publishing; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), cap. 11. McGraw Hill.'
  },
  'SM_DICIEMBRE_1_SOL_1_022':{
    id:'R0PIR_CA_PSI_20260902_002',
    e:'Según la caracterización recogida por Belloch, ¿qué patrón motor se observa con mayor frecuencia en la catatonía?',
    o:{
      a:'Predominan los estados de inhibición motora sobre los de excitación.',
      b:'La excitación y la inhibición motoras aparecen necesariamente con la misma frecuencia.',
      c:'La catatonía se define exclusivamente por estupor y mutismo.',
      d:'Los estados de excitación motora son más frecuentes que los de inhibición motora.'
    },
    c:'d',
    x:'La opción d es correcta. En la caracterización citada, los estados catatónicos de excitación motora aparecen con mayor frecuencia que los de inhibición. La a invierte esa relación. La b es falsa porque el manual no establece una frecuencia idéntica entre ambos patrones. La c es falsa porque la catatonía puede incluir signos de disminución de la actividad psicomotora —como estupor o mutismo—, pero también excitación, negativismo, posturas, manierismos, estereotipias, ecolalia o ecopraxia; no se limita al estupor y al mutismo.',
    r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II (4.ª ed.), cap. 11, apartado sobre la dimensión desorganizada/cognitiva y catatonía. McGraw Hill; American Psychiatric Association (2022). DSM-5-TR, capítulo «Schizophrenia Spectrum and Other Psychotic Disorders», criterios de catatonía. American Psychiatric Association Publishing.'
  }
};
for(const [oldId,u] of Object.entries(replacements)){
  const i=data.findIndex(q=>q.id===oldId);if(i<0)throw new Error(`No se encontró ${oldId}`);
  const old=data[i];data[i]={...old,...u,s:'Clínica Adultos',t:['Trastornos del espectro de la esquizofrenia'],origen:'creada',v:'VALIDADA_ORIGINAL'};
}
const ids=data.map(q=>q.id);if(new Set(ids).size!==ids.length)throw new Error('ID duplicado');
fs.writeFileSync(file,JSON.stringify(data)+'\n');
console.log(JSON.stringify({restored:Object.values(replacements).map(q=>q.id),removedHiddenIds:Object.keys(replacements),count:data.length},null,2));
