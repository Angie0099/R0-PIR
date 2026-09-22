import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..','public','banco');
const files=new Map(); const load=n=>{if(!files.has(n))files.set(n,JSON.parse(fs.readFileSync(path.join(root,n),'utf8')));return files.get(n);};
const source=load('psicopatologia.json'); const topic='Psicopatología de la sensopercepción';
const before=source.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').length;
const destinations={
  classification:['psicopatologia.json','Psicopatología','Sistemas clasificatorios en psicopatología'],memory:['psicopatologia.json','Psicopatología','Psicopatología de la memoria'],language:['psicopatologia.json','Psicopatología','Psicopatología del lenguaje'],attention:['psicopatologia.json','Psicopatología','Psicopatología de la atención'],affectivity:['psicopatologia.json','Psicopatología','Psicopatología de la afectividad'],thought:['psicopatologia.json','Psicopatología','Psicopatología del pensamiento'],
  differential:['psicologia_de_la_personalidad_y_diferencial.json','Psicología de la Personalidad y Diferencial','Diferencias interindividuales en inteligencia'],personality:['psicologia_de_la_personalidad_y_diferencial.json','Psicología de la Personalidad y Diferencial','Teorías cognitivas de la personalidad'],social:['psicologia_social.json','Psicología Social','Cognición social y procesos de atribución'],basicMotivation:['psicologia_basica.json','Psicología Básica','Motivación y emoción'],evolution:['psicologia_evolutiva.json','Psicología Evolutiva','Primera infancia (0-2 años)'],experimental:['psicologia_experimental.json','Psicología Experimental','Psicometría'],
  bioEmotion:['psicobiologia.json','Psicobiología','Emoción'],bioCognition:['psicobiologia.json','Psicobiología','Funciones cognitivas superiores'],bioDrugs:['psicobiologia.json','Psicobiología','Acción de los fármacos en el sistema nervioso'],
  adultMood:['tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de la depresión y trastornos del ánimo'],adultDissociation:['tratamientos_adultos.json','Tratamientos Adultos','Tratamiento de los trastornos disociativos'],adultHealth:['tratamientos_adultos.json','Tratamientos Adultos','Psicología de la salud — estrés laboral y burnout'],
  clinicPersonality:['clinica_adultos.json','Clínica Adultos','Trastornos de la personalidad'],clinicNeuro:['clinica_adultos.json','Clínica Adultos','Trastornos neurocognitivos'],clinicSomatic:['clinica_adultos.json','Clínica Adultos','Trastornos por síntomas somáticos y relacionados'],clinicPsychosis:['clinica_adultos.json','Clínica Adultos','Trastornos del espectro de la esquizofrenia'],clinicDepression:['clinica_adultos.json','Clínica Adultos','Trastornos depresivos'],clinicTrauma:['clinica_adultos.json','Clínica Adultos','Trastornos relacionados con estrés y trauma'],
  childAutism:['clinica_infantojuvenil.json','Clínica Infantojuvenil','Trastorno del espectro autista'],childTdah:['clinica_infantojuvenil.json','Clínica Infantojuvenil','Trastorno por déficit de atención con hiperactividad (TDAH)'],childCommunication:['clinica_infantojuvenil.json','Clínica Infantojuvenil','Trastornos de la comunicación'],childPsychosis:['clinica_infantojuvenil.json','Clínica Infantojuvenil','Trastornos psicóticos infantojuveniles'],childDepression:['clinica_infantojuvenil.json','Clínica Infantojuvenil','Trastornos depresivos y bipolares infantojuveniles']
};
const mapping={
  classification:['3Simulacro2018Comentarios_067','SmCm19PIR2024_007'],
  memory:['Simu 14 comentado _175','Simu 31 comentado Hardcore 1_130','Simu 32 comentado hardcore 2_118','SmCm25PIR2025_119','SmCm5PIR2024_140'],
  language:['simu 9 comentado_132','SmCm20PIR2025 (1)_109','SmCm20PIR2025 (1)_110'],attention:['simu 9 comentado_126'],affectivity:['SmCm28PIR2025_061'],thought:['SmCm30PIR2025 (1)_057'],
  differential:['Simu 12 comentado_100','simu 9 comentado_124','SmCm12PIR2024 2_206'],personality:['SmCm22PIR2025_091'],
  social:['Simu 14 comentado _171','Simu 7 comentado _130','SmCm21PIR2025 (2)_008'],evolution:['SmCm4PIR2024_045'],experimental:['SmCm15PIR2025_207','SmCm21PIR2025 (2)_206'],
  bioEmotion:['SmCm09PIR2025_156'],bioCognition:['SmCm15PIR2025_205'],bioDrugs:['SmCm4PIR2024_064'],
  adultMood:['Simu 7 comentado _197','SmCm1PIR2024_156'],adultDissociation:['SmCm17PIR2025_199'],adultHealth:['simu 9 comentado_131'],
  clinicPersonality:['Simu 13 comentado_079','SmCm7PIR2024_039'],clinicNeuro:['SmCm22PIR2025 (1)_088'],clinicSomatic:['SmCm3PIR2024_101','SmCm3PIR2024_103'],clinicPsychosis:['SmCm4PIR2024_069'],clinicDepression:['SmCm5PIR2024_129','SmCm5PIR2024_131'],clinicTrauma:['SmCm5PIR2024_132'],
  childAutism:['SmCm4PIR2024_044'],childTdah:['SmCm11PIR2025_181'],childCommunication:['SmCm23PIR2025 (2)_002','SmCm23PIR2025 (2)_103'],childPsychosis:['SmCm4PIR2024_047'],childDepression:['SmCm4PIR2024_046']
};
const moved=[];
for(const [key,ids] of Object.entries(mapping)){const [file,subject,destTopic]=destinations[key];const target=load(file);for(const id of ids){const i=source.findIndex(q=>q.id===id);if(i<0)throw new Error(`No encontrada ${id}`);const [q]=source.splice(i,1);q.s=subject;q.t=[destTopic];if(target!==source&&target.some(x=>x.id===id))throw new Error(`Duplicado ${id}`);target.push(q);moved.push(id);}}
const duplicateIds=['PERSEVER___SIMULACRO_COMENTADO_AGOSTO-UNO-23_067','SIM_ABR25_021','SIM_ABR25_035','SM_DICIEMBRE_1_SOL_1_031','PERSEVER___SIMULACRO_COMENTADO_ABRIL-UNO-23_044','PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_058','SM_ENERO_1_SOL_1_111','SM_ENERO_1_SOL_1_081','Simu 14 comentado _178','SmCm15PIR2025_208','SmCm22PIR2025_095'];
for(const id of duplicateIds){const i=source.findIndex(q=>q.id===id);if(i<0)throw new Error(`No encontrada ${id}`);source.splice(i,1);}
for(const [name,rows] of files)fs.writeFileSync(path.join(root,name),JSON.stringify(rows));
const mp=path.join(root,'manifest.json');const manifest=JSON.parse(fs.readFileSync(mp,'utf8'));for(const meta of Object.values(manifest.subjects))meta.count=load(`${meta.slug}.json`).length;manifest.total=Object.values(manifest.subjects).reduce((s,m)=>s+m.count,0);fs.writeFileSync(mp,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({before,movedUnchanged:moved.length,removedDuplicates:duplicateIds.length,after:source.filter(q=>q.t?.includes(topic)&&q.v!=='VALIDADA_ORIGINAL').length}));
