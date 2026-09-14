const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json'),b=JSON.parse(fs.readFileSync(file,'utf8'));
const fixes={
'MAYO-UNO-24_COMENTADO_049':{d:'Paranoide, esquizoide, histriónico y dependiente.'},
'PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_077':{d:'Carecer de sentido del humor.'},
'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_092':{d:'Alteraciones de la identidad.'},
'SEPTIEMBRE-UNO-24_COMENTADO_181':{d:'Trastorno esquizotípico de la personalidad.'},
'Simu 11 comentado_039':{d:'Histriónico, límite, dependiente y evitativo.'},
'Simu 16 comentado_104':{b:'La timidez en la infancia es un precursor común del trastorno.'},
'Simu 32 comentado hardcore 2_067':{d:'Patrón de grandiosidad, necesidad de admiración y falta de empatía.'},
'SM_JUNIO_1_SOL_1_043':{d:'Desapego.'},
'SmCm13PIR2025_081':{d:'La prevalencia suele aumentar entre los grupos de mayor edad.'},
'SmCm15PIR2025_056':{d:'Histriónico.'}};
for(const[id,o]of Object.entries(fixes)){const q=b.find(z=>z.id===id);if(!q)throw Error(id);Object.assign(q.o,o)}
fs.writeFileSync(file,JSON.stringify(b));console.log({cleaned:Object.keys(fixes).length});
