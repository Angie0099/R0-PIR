const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json');
const bank=JSON.parse(fs.readFileSync(file,'utf8')),topic='Trastornos de la conducta alimentaria';
const ref='American Psychiatric Association (2022). DSM-5-TR, capítulo «Feeding and Eating Disorders». American Psychiatric Association Publishing; Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.), cap. 13. McGraw Hill.';
let explanations=0,options=0;
for(const q of bank.filter(q=>q.t?.includes(topic))){
  if(!q.x?.trim()){q.x=`La ${q.c} es correcta: ${q.o[q.c]} Las demás alternativas no se ajustan al concepto o criterio evaluado.`;explanations++}
  if(!q.r?.trim())q.r=ref;
  for(const k of ['a','b','c','d']){
    const old=q.o[k];
    const cut=old.search(/\s+(?:R[1-4]\s*(?:CORRECTA|INCORRECTA)|La respuesta correcta|¡ATENCIÓN!|Marcadores diagnósticos|Manual de Psicopatología|DSM-5.{0,20}(?:página|p\.))/i);
    if(cut>15){q.o[k]=old.slice(0,cut).trim();options++}
  }
}
fs.writeFileSync(file,JSON.stringify(bank));console.log({explanations,options});
