const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json'),b=JSON.parse(fs.readFileSync(file,'utf8'));
const ref='American Psychiatric Association (2022). DSM-5-TR, capítulo «Personality Disorders» y modelo alternativo de la sección III; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología (4.ª ed.), capítulo de trastornos de la personalidad.';
const rows={
'SM_AGOSTO_1_SOL_1_097':['a','La a es correcta tras precisar la traducción: el modelo de Fonagy destaca la confianza epistémica y la comunicación social. Vulnerabilidad y ambiente invalidante pertenecen al modelo biosocial; rumiación, al de cascadas emocionales.'],
'SM_DICIEMBRE_1_SOL_1_002':['b','La b es correcta: antagonismo es el dominio requerido para el perfil alternativo narcisista.'],
'SM_DICIEMBRE_1_SOL_1_003':['b','La b es correcta según los estudios citados: personalidad límite, narcisista y obsesivo-compulsiva presentan los peores índices de calidad de vida.'],
'SM_DICIEMBRE_1_SOL_1_004':['a','La a es correcta según el manual: el suicidio consumado puede producirse más tarde, aunque los intentos y la conducta suicida sean muy relevantes desde edades tempranas.'],
'SM_DICIEMBRE_1_SOL_1_005':['c','La c es correcta según la fuente citada. Esquizotipia es un continuo y no equivale al diagnóstico esquizotípico; puede incluir aspectos benignos y el subtipo de TOC asociado es el autógeno, no el reactivo.'],
'SM_DICIEMBRE_1_SOL_1_023':['c','La c es correcta: el modelo de Meehl subraya el papel etiológico de síntomas negativos como la anhedonia física y social en la esquizotipia.'],
'SM_DICIEMBRE_2_SOL_1_029':['c','La c es correcta: explotar relaciones para beneficio propio es un criterio narcisista. Engaño reiterado corresponde al patrón antisocial y la autoestima narcisista es vulnerable.'],
'SM_DICIEMBRE_2_SOL_1_035':['c','La c es correcta: los problemas externalizantes e internalizantes tempranos pueden preceder y predecir síntomas límite posteriores. Las otras opciones invierten hallazgos o mezclan modelos.'],
'SM_ENERO_1_SOL_1_103':['d','La d es falsa: el trastorno esquizoide no se encuentra entre los de mayor prevalencia anual. Las restantes afirmaciones concuerdan con los datos clínicos citados.'],
'SM_ENERO_1_SOL_1_120':['b','La b es correcta: el perfil límite combina afectividad negativa, desinhibición y antagonismo.'],
'SM_JULIO_1_SOL_1_063':['a','La a es correcta según la comparación de la fuente: personalidad evitativa es especialmente frecuente entre pacientes con otros trastornos mentales.'],
'SM_JULIO_1_SOL_1_068':['b','La b es correcta según el marco del manual: ambos sistemas se relacionan con modelos de cinco grandes dominios, aunque sus dominios y facetas no coinciden exactamente.'],
'SM_JULIO_2_SOL_1_015':['d','La d es correcta: el perfil esquizotípico incluye las facetas del dominio psicoticismo, además de facetas de desapego.'],
'SM_JUNIO_1_SOL_1_043':['d','La d es la excepción: las cuatro dimensiones empleadas son desregulación emocional, desregulación comportamental, hipersensibilidad interpersonal y alteraciones de identidad.'],
'SM_JUNIO_1_SOL_1_189':['a','La a es correcta: la dificultad para expresar desacuerdo por temor a perder apoyo o aprobación es un criterio de personalidad dependiente.'],
'SM_JUNIO_2_SOL_1_024':['b','La b es correcta. Los estudios longitudinales muestran un curso más variable y mejoría más frecuente de lo supuesto. El suicidio consumado puede aparecer más tarde, algunas comorbilidades afectivas persisten y el porcentaje sin recuperación supera el 10 %.'],
'SM_JUNIO_2_SOL_1_027':['b','La b es correcta: el perfeccionismo rígido es el rasgo obligatorio del perfil alternativo obsesivo-compulsivo.'],
'SM_JUNIO_2_SOL_1_059':['d','La d es correcta: la falta de empatía figura explícitamente como criterio de personalidad narcisista.'],
'SM_MAYO_1_SOL_1_112':['c','La c es correcta según los estudios revisados: los peores índices de calidad de vida se describen en personalidad límite, narcisista y obsesivo-compulsiva.'],
'SM_MAYO_1_SOL_1_113':['d','La d es correcta: el perfil límite requiere cuatro o más de labilidad emocional, ansiedad, inseguridad de separación, depresión, impulsividad, asunción de riesgos y hostilidad.']};
const clean=s=>String(s??'').replace(/[�]/g,'').replace(/\b([A-Za-zÁÉÍÓÚáéíóúñÑ]{2,})-\s+([a-záéíóúñ]{2,})\b/g,'$1$2').replace(/\s+/g,' ').trim();
for(const[id,[c,x]]of Object.entries(rows)){const q=b.find(z=>z.id===id);if(!q)throw Error(id);q.c=c;q.e=clean(q.e).replace(/verdad epistémica/gi,'confianza epistémica');for(const k of'abcd'){q.o[k]=clean(q.o[k]).replace(/verdad epistémica/gi,'confianza epistémica');const p=q.o[k].search(/\s+(?:R[1-4]\s*(?:CORRECTA|INCORRECTA)|El Modelo de|Algunos datos sobre|Una de las primeras teorías|Características Transdiagnósticas|El Belloch)/i);if(p>10)q.o[k]=q.o[k].slice(0,p).trim()}Object.assign(q,{x,r:ref,v:'VALIDADA_ORIGINAL'})}
const course=b.find(q=>q.id==='SM_JUNIO_2_SOL_1_024');course.e='Respecto al curso del trastorno límite de la personalidad, señale la afirmación correcta:';
fs.writeFileSync(file,JSON.stringify(b));console.log({audited:Object.keys(rows).length,keyCorrection:'SM_JUNIO_2_SOL_1_024 a→b'});
