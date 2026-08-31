import fs from 'node:fs';
const path='public/banco/psicologia_clinica.json';
const bank=JSON.parse(fs.readFileSync(path,'utf8'));
const m=new Map(bank.map(q=>[q.id,q]));
const move=(id,s,t)=>{const q=m.get(id);if(!q)throw new Error(id);q.s=s;q.t=[t];q.v='REVISAR';};
move('Simu 14 comentado _027','Psicología Clínica','Modelos en psicopatología');
move('Simu 14 comentado _062','Tratamientos Adultos','Introducción');
fs.writeFileSync(path,JSON.stringify(bank));console.log('Reubicadas 2 preguntas pendientes.');
