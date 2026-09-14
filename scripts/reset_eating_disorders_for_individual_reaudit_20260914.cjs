const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json');
const b=JSON.parse(fs.readFileSync(file,'utf8'));let n=0;
for(const q of b)if(q.t?.includes('Trastornos de la conducta alimentaria')){q.v='REVISAR';n++}
fs.writeFileSync(file,JSON.stringify(b));console.log({resetForIndividualReaudit:n});
