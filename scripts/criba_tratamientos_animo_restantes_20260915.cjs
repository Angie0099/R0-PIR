const fs=require('fs');
const ap='public/banco/tratamientos_adultos.json',cp='public/banco/tratamientos_infantiles.json';
const a=JSON.parse(fs.readFileSync(ap,'utf8')),c=JSON.parse(fs.readFileSync(cp,'utf8'));
const groups={
 'Tratamiento de los trastornos alimentarios':['PERSEV_AGO25_U1_155','PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_142','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_173','SM_DICIEMBRE_1_SOL_1_164','SM_JULIO_2_SOL_1_142'],
 'Tratamiento de la psicosis y esquizofrenia':['Simu 12 comentado_171','Simu 13 comentado_120','Simu 14 comentado _071','Simu 15 comentado_162','Simu 6 comentado__041','SmCm06PIR2025_075','SmCm08PIR2025_072','SmCm18PIR2025_171','SmCm20PIR2024_091','SmCm23PIR2025 (2)_155','SmCm24PIR2025 (1)_073','SmCm24PIR2025 (1)_076','SmCm24PIR2025 (1)_077','SmCm26PIR2025_029','SmCm2PIR2024_150','SmCm3PIR2024_134','SmCm3PIR2024_136','SmCm3PIR2024_139','SmCm3PIR2024_173'],
 'Tratamientos transdiagnósticos':['PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_126','Simu 13 comentado_121','Simu 15 comentado_180','Simu 15 comentado_181','SM_ABRIL_1_SOL_1_184','SmCm06PIR2025_079','SmCm1PIR2024_206'],
 'Tratamiento del TOC y relacionados':['Simu 14 comentado _074','SmCm26PIR2025_028'],
 'Tratamiento del trauma y TEPT':['Simu 14 comentado _098','SmCm19PIR2024_149','SmCm27PIR2025 (1)_035'],
 'Tratamiento de los trastornos disociativos':['SmCm13PIR2025_141','SmCm3PIR2024_168'],
 'Tratamiento de las adicciones':['SmCm20PIR2025 (1)_089','SmCm29PIR2025_006'],
 'Tratamiento del TEA':['SmCm22PIR2025 (1)_115'],
 'Tratamiento de los trastornos de personalidad':['SM_JULIO_1_SOL_1_121'],
 'Técnicas psicológicas generales':['SmCm22PIR2025 (1)_121']
};
const childGroups={
 'Tratamientos transdiagnósticos infantojuveniles':['PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_099','PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_134','SM_ABRIL_1_SOL_1_087','SM_AGOSTO_1_SOL_1_108']
};
let moved=0;
function move(id,target,topic){const i=a.findIndex(q=>q.id===id);if(i<0)throw Error('No encontrada '+id);const [q]=a.splice(i,1);q.t=[topic];q.v='REVISAR';if(!target.some(x=>x.id===id))target.push(q);moved++;}
for(const [topic,ids] of Object.entries(groups))for(const id of ids)move(id,a,topic);
for(const [topic,ids] of Object.entries(childGroups))for(const id of ids)move(id,c,topic);
fs.writeFileSync(ap,JSON.stringify(a));fs.writeFileSync(cp,JSON.stringify(c));
console.log(`Criba rápida completada: ${moved} preguntas inequívocamente ajenas reubicadas y dejadas pendientes en su tema correcto.`);
