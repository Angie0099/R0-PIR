const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json');
const bank=JSON.parse(fs.readFileSync(file,'utf8'));
const get=id=>{const q=bank.find(x=>x.id===id);if(!q)throw Error(id);return q};
Object.assign(get('SM_JULIO_1_SOL_1_060'),{o:{a:'La evitación del daño es elevada en anorexia nerviosa, pero menor que en bulimia nerviosa.',b:'En bulimia existen dificultades para afrontar emociones negativas, pero no emociones positivas.',c:'La anorexia nerviosa destaca especialmente por la búsqueda de novedades.',d:'El perfeccionismo y la necesidad de control se han señalado como elementos transdiagnósticos.'}});
Object.assign(get('SM_JUNIO_2_SOL_1_070'),{e:'Respecto al trastorno de rumiación, señale la afirmación correcta:',o:{a:'Consiste en regurgitación repetida durante un período mínimo de un año.',b:'La regurgitación suele producirse diariamente.',c:'El comportamiento tiene una función autolesiva.',d:'Aunque puede causar malestar clínicamente significativo, nunca llega a ser potencialmente mortal.'}});
fs.writeFileSync(file,JSON.stringify(bank));
const q=bank.filter(x=>x.t?.includes('Trastornos de la conducta alimentaria'));
const bad=q.filter(x=>/Pendiente de auditor|Las demás alternativas no se ajustan|PSICOLOGÍA|\uFFFD|armación|dicultad|signic|clasicación|reere|trascurso/i.test([x.e,JSON.stringify(x.o),x.x,x.r].join(' ')));
console.log({total:q.length,validated:q.filter(x=>x.v==='VALIDADA_ORIGINAL').length,pending:q.filter(x=>x.v!=='VALIDADA_ORIGINAL').length,badKeys:q.filter(x=>!x.o?.[x.c]).length,residualFlags:bad.map(x=>x.id)});
