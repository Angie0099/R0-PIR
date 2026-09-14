const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json'),b=JSON.parse(fs.readFileSync(file,'utf8'));
const ref='American Psychiatric Association (2022). DSM-5-TR, capítulo «Personality Disorders» y modelo alternativo de la sección III; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología (4.ª ed.), capítulo de trastornos de la personalidad.';
const rows={
'SM_MAYO_1_SOL_1_114':['b','La b es correcta: el modelo de cascadas emocionales de Selby y Joiner complementa el modelo biosocial y propone que la rumiación sobre afecto negativo exacerba la desregulación.'],
'SmCm10PIR2025_039':['a','La a es correcta: personalidad histriónica pertenece al clúster B; esquizoide al A, y evitativa y obsesivo-compulsiva al C.'],
'SmCm10PIR2025_040':['b','La b es correcta: personalidad antisocial exige una edad mínima de 18 años y evidencia de trastorno de conducta antes de los 15.'],
'SmCm12PIR2024 2_053':['c','La c es correcta: personalidad evitativa pertenece al clúster C, caracterizado como ansioso o temeroso.'],
'SmCm13PIR2025_081':['d','La d es la incorrecta: la prevalencia del TLP disminuye en los grupos de mayor edad. Las otras cifras corresponden a estimaciones DSM clásicas.'],
'SmCm13PIR2025_083':['b','La b es correcta. En personalidad antisocial se han descrito bajas concentraciones de 5-HIAA en LCR, relacionadas con disfunción serotoninérgica e impulsividad.'],
'SmCm14PIR2025_094':['a','La a es correcta: DSM-5-TR incluye el cambio de personalidad debido a otra afección médica; los restantes nombres no son diagnósticos principales vigentes.'],
'SmCm14PIR2025_149':['c','La c es correcta: Kernberg desarrolló el concepto de organización límite de la personalidad.'],
'SmCm15PIR2025_056':['d','La d es correcta: la conducta seductora inapropiada y el uso de la apariencia para atraer atención son criterios de personalidad histriónica.'],
'SmCm17PIR2025_108':['c','La c recoge el intervalo DSM clásico de prevalencia estimada del TLP en población general, aproximadamente 1,6-5,9 %.'],
'SmCm17PIR2025_123':['c','La c es correcta: el TLP pertenece al clúster B junto con antisocial, histriónico y narcisista.'],
'SmCm18PIR2025_063':['b','La b es la mejor respuesta entre las ofrecidas: la expresividad afectiva y variabilidad aparente del patrón histriónico pueden confundirse con oscilaciones ciclotímicas; el diagnóstico diferencial atiende al curso episódico del estado de ánimo.'],
'SmCm19PIR2024_056':['a','La a es correcta: enumera cuatro criterios DSM del trastorno paranoide. Pueden aparecer episodios psicóticos breves bajo estrés y se conserva el especificador premórbido.'],
'SmCm20PIR2025 (1)_065':['c','La c es correcta: la edad mínima para diagnosticar personalidad antisocial es 18 años.'],
'SmCm21PIR2025 (2)_035':['d','La d es correcta: la vulneración consciente de normas y derechos mediante fraude o ilegalidad caracteriza personalidad antisocial.'],
'SmCm21PIR2025 (2)_041':['b','La b es correcta según la actualización citada: DSM-5-TR señala un deterioro general comparativamente menor en personalidad histriónica que en otros trastornos de personalidad.'],
'SmCm24PIR2025 (1)_054':['c','La c es correcta: el perfil alternativo evitativo exige tres o más de ansiedad, retraimiento, anhedonia y evitación de la intimidad, y uno debe ser ansiedad.'],
'SmCm24PIR2025 (1)_056':['c','La c es correcta: el modelo biosocial de Linehan explica la desregulación mediante vulnerabilidad emocional en interacción con un ambiente invalidante.'],
'SmCm25PIR2025_009':['b','La b es correcta: ser interpersonalmente explotador es un criterio narcisista; uso de apariencia es histriónico, falta de remordimiento antisocial y perfeccionismo obsesivo-compulsivo.']};
const clean=s=>String(s??'').replace(/[�]/g,'').replace(/\b([A-Za-zÁÉÍÓÚáéíóúñÑ]{2,})-\s+([a-záéíóúñ]{2,})\b/g,'$1$2').replace(/\s+/g,' ').trim();
for(const[id,[c,x]]of Object.entries(rows)){const q=b.find(z=>z.id===id);if(!q)throw Error(id);q.c=c;q.e=clean(q.e).replace(/Shelby\s*&\s*Joiner/gi,'Selby y Joiner');for(const k of'abcd'){q.o[k]=clean(q.o[k]);const p=q.o[k].search(/\s+(?:R[1-4]\s*(?:CORRECTA|INCORRECTA)|El modelo de cascadas|Algunos datos sobre|¡Cuidado|El Belloch)/i);if(p>10)q.o[k]=q.o[k].slice(0,p).trim()}Object.assign(q,{x,r:ref,v:'VALIDADA_ORIGINAL'})}
const dep=b.find(q=>q.id==='SmCm21PIR2025 (2)_050');Object.assign(dep,{t:['Trastornos depresivos'],e:'¿Quién propuso la teoría de la autofocalización de la depresión?',o:{a:'Lewinsohn.',b:'Abramson.',c:'Coyne.',d:'Gotlib.'},c:'a',x:'La a es correcta: Lewinsohn propuso un modelo integrador en el que la autoconciencia o autofocalización elevada interviene en el mantenimiento de la depresión.',r:'Lewinsohn, P. M. et al. Modelo integrador y teoría de la autofocalización de la depresión; Belloch, Sandín y Ramos, Manual de psicopatología.',v:'VALIDADA_ORIGINAL'});
fs.writeFileSync(file,JSON.stringify(b));console.log({audited:20,personality:19,movedToDepression:1,keyCorrection:'SmCm13PIR2025_083 d→b'});
