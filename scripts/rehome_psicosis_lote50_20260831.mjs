import fs from 'node:fs';
const path='public/banco/psicologia_clinica.json'; const bank=JSON.parse(fs.readFileSync(path,'utf8')); const m=new Map(bank.map(q=>[q.id,q]));
const moves={
  'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_045':'Trastornos depresivos',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_028':'Sistemas clasificatorios en psicopatología',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_041':'Psicopatología de la sensopercepción',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_051':'Psicopatología de la atención y orientación',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_066':'Disforia de género',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_203':'Trastornos depresivos',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_148':'Psicopatología de la sensopercepción',
  'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_156':'Disforia de género',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_051':'Trastornos depresivos',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_076':'Trastornos de la personalidad',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_077':'Psicopatología del pensamiento',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_061':'Trastornos de la personalidad',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_079':'Trastornos disociativos',
  'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_085':'Trastornos de ansiedad',
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_059':'Psicopatología de la sensopercepción',
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_061':'Trastornos del sueño-vigilia',
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_070':'Patología de la conciencia',
  'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_208':'Trastornos relacionados con traumas y factores de estrés'
};
for(const [id,topic] of Object.entries(moves)){const q=m.get(id);if(!q)throw new Error(`No existe ${id}`);q.t=[topic];q.v='REVISAR';}
fs.writeFileSync(path,JSON.stringify(bank));console.log(`Reubicadas ${Object.keys(moves).length} preguntas; permanecen pendientes de validación documental.`);
