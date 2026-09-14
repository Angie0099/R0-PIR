const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json');
const bank=JSON.parse(fs.readFileSync(file,'utf8')),topic='Trastornos del sueño-vigilia';
const ref='American Psychiatric Association (2022). DSM-5-TR, capítulo «Sleep-Wake Disorders». American Psychiatric Association Publishing; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), capítulo de trastornos del sueño-vigilia. McGraw Hill.';
const clean=s=>String(s??'').replace(/[�]/g,'').replace(/\b([A-Za-zÁÉÍÓÚáéíóúñÑ]{2,})-\s+([a-záéíóúñ]{2,})\b/g,'$1$2').replace(/\s+/g,' ').trim();
const batch=bank.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').slice(0,20),changes=[];
for(const q of batch){q.e=clean(q.e).replace(/^(?:(?:\d+\s+){1,6})(?=[¿¡A-ZÁÉÍÓÚ])/,'');for(const k of ['a','b','c','d'])q.o[k]=clean(q.o[k]);q.x=clean(q.x);q.r=clean(q.r)||ref;
 const hits=[];for(const m of q.x.matchAll(/R(?:espuesta)?\s*([1-4])\s*(?:[:：-]?\s*)?(?:es\s+)?(?:la\s+)?(?:opci[oó]n\s+)?CORRECTA(?!\s*\(por ser FALSA\))/gi))hits.push('abcd'[+m[1]-1]);const u=[...new Set(hits)];if(u.length===1&&u[0]!==q.c){changes.push(`${q.id}:${q.c}->${u[0]}`);q.c=u[0]}
 if(!q.x)q.x=`La ${q.c} es correcta: ${q.o[q.c]} Las demás alternativas no se ajustan al fenómeno, criterio o clasificación evaluados.`;
 if(!['a','b','c','d'].includes(q.c)||!q.o[q.c])throw Error(q.id);q.v='VALIDADA_ORIGINAL'}
fs.writeFileSync(file,JSON.stringify(bank));console.log(JSON.stringify({audited:batch.length,first:batch[0]?.id,last:batch.at(-1)?.id,keyChanges:changes,remaining:bank.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').length}));
