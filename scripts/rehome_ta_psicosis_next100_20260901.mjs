import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),bank=path.join(root,'public','banco');
const manifest=JSON.parse(fs.readFileSync(path.join(bank,'manifest.json'),'utf8'));
const datasets=new Map(Object.entries(manifest.subjects).map(([s,m])=>[s,JSON.parse(fs.readFileSync(path.join(bank,m.slug+'.json'),'utf8'))]));
const sourceSubject='Tratamientos Adultos',topic='Tratamiento de la psicosis y esquizofrenia',source=datasets.get(sourceSubject);
const seen=new Set(JSON.parse(fs.readFileSync(path.join(root,'auditorias','tratamientos_adultos_psicosis_primeras100_reubicaciones_20260901.json'),'utf8')).selected);
const selected=source.filter(q=>q.t?.[0]===topic&&!seen.has(q.id)&&!['VALIDADA_ORIGINAL','CORREGIDA'].includes(q.v)).slice(0,100);
if(selected.length!==100)throw Error('selección '+selected.length);
const moves={
'Simu 14 comentado _079':['Tratamientos Adultos','Tratamiento de los trastornos de personalidad'],
'Simu 14 comentado _080':['Tratamientos Adultos','Tratamiento de la depresión y trastornos del ánimo'],
'Simu 15 comentado_142':['Tratamientos Infantiles','Trastorno del Espectro Autista'],
'Simu 16 comentado_048':['Tratamientos Infantiles','Trastornos psicóticos infantojuvenil'],
'Simu 16 comentado_051':['Tratamientos Infantiles','Trastornos de ansiedad infantojuvenil'],
'Simu 16 comentado_131':['Psicología de la Personalidad y Diferencial','Diferencias interindividuales en inteligencia'],
'Simu 16 comentado_143':['Tratamientos Adultos','Tratamiento de la depresión y trastornos del ánimo'],
'Simu 16 comentado_146':['Tratamientos Infantiles','TDAH'],
'Simu 31 comentado Hardcore 1_011':['Tratamientos Infantiles','Trastornos de ansiedad infantojuvenil'],
'Simu 31 comentado Hardcore 1_012':['Tratamientos Infantiles','Otros problemas infantojuveniles'],
'Simu 32 comentado hardcore 2_163':['Tratamientos Adultos','Técnicas psicológicas generales'],
'Simu 7 comentado _163':['Tratamientos Infantiles','Otros problemas infantojuveniles'],
'Simu 7 comentado _180':['Tratamientos Adultos','Tratamiento de los trastornos de personalidad'],
'Simu 8 comentado _111':['Psicología Social','Procesos de grupo'],
'simu 9 comentado_154':['Tratamientos Infantiles','Trastorno del Espectro Autista'],
'simu 9 comentado_179':['Tratamientos Infantiles','Trastornos de la comunicación'],
'SM_ABRIL_2_SOL_1_188':['Tratamientos Adultos','Tratamiento de las adicciones'],
'SM_ABRIL_2_SOL_1_191':['Tratamientos Adultos','Tratamiento de los trastornos alimentarios'],
'SM_DICIEMBRE_2_SOL_1_155':['Tratamientos Adultos','Tratamiento de los trastornos de ansiedad'],
'SM_JULIO_1_SOL_1_105':['Tratamientos Adultos','Tratamiento de los trastornos alimentarios'],
'SmCm08PIR2025_063':['Evaluación Psicológica','Los autoinformes'],
'SmCm10PIR2025_061':['Psicopatología','Psicopatología de la conciencia'],
'SmCm13PIR2025_157':['Tratamientos Infantiles','Otros problemas infantojuveniles'],
'SmCm13PIR2025_158':['Tratamientos Infantiles','Trastornos de ansiedad infantojuvenil'],
'SmCm15PIR2025_011':['Tratamientos Infantiles','Trastornos de excreción infantojuvenil'],
'SmCm16PIR2025_153':['Tratamientos Adultos','Tratamiento de las adicciones'],
'SmCm17PIR2025_143':['Tratamientos Adultos','Tratamiento de los trastornos neurocognitivos'],
'SmCm17PIR2025_152':['Tratamientos Infantiles','Trastornos de conducta infantojuvenil'],
'SmCm17PIR2025_158':['Tratamientos Adultos','Tratamiento de las adicciones'],
'SmCm18PIR2025_042':['Tratamientos Adultos','Tratamiento del TOC y relacionados'],
'SmCm18PIR2025_043':['Tratamientos Adultos','Tratamiento de los trastornos disociativos'],
'SmCm18PIR2025_137':['Tratamientos Adultos','Tratamiento de los trastornos somáticos'],
'SmCm18PIR2025_167':['Tratamientos Adultos','Tratamiento de las adicciones'],
'SmCm19PIR2024_128':['Tratamientos Adultos','Tratamiento de la depresión y trastornos del ánimo']};
const selectedIds=new Set(selected.map(q=>q.id));for(const id of Object.keys(moves))if(!selectedIds.has(id))throw Error('fuera '+id);
datasets.set(sourceSubject,source.filter(q=>!moves[q.id]));
const moved=[];for(const q of selected){if(!moves[q.id])continue;const [s,t]=moves[q.id];if(!manifest.subjects[s]?.topics.includes(t))throw Error(s+' > '+t);datasets.get(s).push({...q,s,t:[t],v:'REVISAR'});moved.push({id:q.id,to:s+' > '+t});}
const all=[...datasets.values()].flat();if(all.length!==manifest.total||new Set(all.map(q=>q.id)).size!==all.length)throw Error('integridad');
for(const [s,d] of datasets){manifest.subjects[s].count=d.length;fs.writeFileSync(path.join(bank,manifest.subjects[s].slug+'.json'),JSON.stringify(d)+'\n');}
fs.writeFileSync(path.join(bank,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const report={selected:selected.map(q=>q.id),moved,retained:selected.filter(q=>!moves[q.id]).map(q=>q.id),mechanical:{missingExplanation:selected.filter(q=>!q.x).length,missingReference:selected.filter(q=>!q.r).length}};
fs.writeFileSync(path.join(root,'auditorias','tratamientos_adultos_psicosis_siguientes100_criba_20260901.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({screened:100,rehomed:moved.length,retained:report.retained.length,total:all.length,unique:new Set(all.map(q=>q.id)).size},null,2));
