import fs from 'node:fs';
const path='public/banco/psicologia_clinica.json';const b=JSON.parse(fs.readFileSync(path,'utf8'));const m=new Map(b.map(q=>[q.id,q]));
const moves={
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_084':'Psicopatología de la sensopercepción',
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_092':'Trastornos de la personalidad',
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_104':'Trastornos depresivos',
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_108':'Modelos en psicopatología',
 'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_122':'Trastornos depresivos',
 'SM_ABRIL_1_SOL_1_052':'Disforia de género',
 'SM_ABRIL_2_SOL_1_077':'Psicopatología de la memoria',
 'SM_DICIEMBRE_1_SOL_1_005':'Trastornos de la personalidad',
 'SM_DICIEMBRE_2_SOL_1_033':'Trastornos disruptivos, del control de los impulsos y de la conducta',
 'SM_DICIEMBRE_2_SOL_1_048':'Sistemas clasificatorios en psicopatología',
 'SM_DICIEMBRE_1_SOL_1_023':'Trastornos de la personalidad'
};
for(const [id,t] of Object.entries(moves)){const q=m.get(id);if(!q)throw new Error(id);q.t=[t];q.v='REVISAR';}
fs.writeFileSync(path,JSON.stringify(b));console.log(`Reubicadas ${Object.keys(moves).length} preguntas; pendientes de contraste documental.`);
