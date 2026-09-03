const fs=require('fs'),P='public/banco/';
const bp=P+'evaluacion_psicologica.json',mp=P+'manifest.json';
const bank=JSON.parse(fs.readFileSync(bp)),m=JSON.parse(fs.readFileSync(mp));
const old='Tests de inteligencia y aptitudes',intel='Tests de inteligencia',apt='Tests de aptitudes';
const aptitudeIds=new Set([
 'PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_136',
 'PERSEVER___SIMULACRO_COMENTADO_DICIEMBRE-DOS-23_111',
 'PERSEVER___SIMULACRO_COMENTADO_ENERO-UNO-23_130',
 'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_185',
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_027',
 'SEPTIEMBRE-UNO-24_COMENTADO_105',
 'Simu 16 comentado_074',
 'SM_AGOSTO_1_SOL_1_037',
 'SM_DICIEMBRE_2_SOL_1_115',
 'SM_JULIO_1_SOL_1_147'
]);
let intelligence=0,aptitudes=0;
for(const q of bank){if(!q.t?.includes(old))continue;q.t=q.t.map(t=>t===old?(aptitudeIds.has(q.id)?apt:intel):t);if(aptitudeIds.has(q.id))aptitudes++;else intelligence++;}
if(intelligence+aptitudes!==267||aptitudes!==aptitudeIds.size)throw Error('Recuento inesperado');
const topics=m.subjects['Evaluación Psicológica'].topics,i=topics.indexOf(old);if(i<0)throw Error('Tema original no encontrado');topics.splice(i,1,intel,apt);
fs.writeFileSync(bp,JSON.stringify(bank));fs.writeFileSync(mp,JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({intelligence,aptitudes,total:intelligence+aptitudes}));
