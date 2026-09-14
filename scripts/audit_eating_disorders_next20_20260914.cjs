const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'..','public','banco','clinica_adultos.json');
const bank=JSON.parse(fs.readFileSync(file,'utf8')),topic='Trastornos de la conducta alimentaria';
const ref='American Psychiatric Association (2022). DSM-5-TR, capítulo «Feeding and Eating Disorders». American Psychiatric Association Publishing; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), cap. 13. McGraw Hill.';
const dehy=s=>String(s??'').replace(/[�]/g,'').replace(/\b([A-Za-zÁÉÍÓÚáéíóúñÑ]{2,})-\s+([a-záéíóúñ]{2,})\b/g,'$1$2').replace(/\s+/g,' ').trim();
const lead=s=>dehy(s).replace(/^(?:(?:\d+\s+){1,6})(?=[¿¡A-ZÁÉÍÓÚ])/,'');
const batch=bank.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').slice(0,20);
if(!batch.length){console.log('No pending');process.exit(0)}
const changes=[];
for(const q of batch){
  q.e=lead(q.e);
  for(const k of ['a','b','c','d']) q.o[k]=dehy(q.o[k]);
  q.x=dehy(q.x);
  q.r=dehy(q.r)||ref;
  const hits=[];
  for(const m of q.x.matchAll(/R(?:espuesta)?\s*([1-4])\s*(?:[:：-]?\s*)?(?:es\s+)?(?:la\s+)?(?:opci[oó]n\s+)?CORRECTA(?!\s*\(por ser FALSA\))/gi)) hits.push('abcd'[+m[1]-1]);
  const uniq=[...new Set(hits)];
  if(uniq.length===1&&uniq[0]!==q.c){changes.push(`${q.id}:${q.c}->${uniq[0]}`);q.c=uniq[0]}
  if(!['a','b','c','d'].includes(q.c)) throw Error('Invalid key '+q.id);
  q.v='VALIDADA_ORIGINAL';
}
fs.writeFileSync(file,JSON.stringify(bank));
console.log(JSON.stringify({audited:batch.length,first:batch[0].id,last:batch.at(-1).id,keyChanges:changes,remaining:bank.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').length},null,2));
