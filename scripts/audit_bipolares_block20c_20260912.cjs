const fs=require('fs'),path=require('path'),file=path.join(__dirname,'..','public','banco','clinica_adultos.json'),bank=JSON.parse(fs.readFileSync(file,'utf8'));
const ids=['PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_040','PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_041','PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_029','PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_030','PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_176','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_060','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_063','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_046','PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_206','PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_031','PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_032','PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_078','PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_073','SEPTIEMBRE-DOS-24_COMENTADO_094','SEPTIEMBRE-DOS-24_COMENTADO_102','SEPTIEMBRE-DOS-24_COMENTADO_103','SEPTIEMBRE-UNO-24_COMENTADO_144','SEPTIEMBRE-UNO-24_COMENTADO_184','Simu 13 comentado_041','Simu 15 comentado_055'];
const extra={
'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_040':' La depresión bipolar, por el contrario, se asocia más con recurrencia, hipersomnia, atipicidad y retraso psicomotor.',
'PERSEVER___SIMULACRO_COMENTADO_MAYO-DOS-23_041':' Las demás cifras corresponden a estabilidad, recaídas frecuentes o síntomas residuales continuos.',
'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_029':' Las opciones b, c y d se describen más en depresión unipolar.',
'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_030':' El 45 % corresponde a recaídas frecuentes, el 30 % a síntomas residuales y el 10 % a curso muy deteriorante.',
'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_176':' Las demás alternativas invierten las diferencias clínicas descritas.',
'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_060':' Esta nomenclatura ampliada no constituye una categoría oficial del DSM-5-TR.',
'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_063':' El insomnio se observa más en la unipolar, y la catatonía y el inicio posparto no son menos frecuentes en bipolar.',
'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_046':' Cuatro días es el mínimo habitual de hipomanía, no de manía.',
'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-UNO-23_206':' Las otras tres opciones describen rasgos más frecuentes en depresión bipolar.',
'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_031':' Las demás opciones se asocian más con polaridad depresiva.',
'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_032':' Las otras afirmaciones ejemplifican cogniciones depresivas de impotencia, minusvalía y desesperanza.',
'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-DOS-23_078':' Las opciones a, b y d formulan generalizaciones incorrectas.',
'PERSEVER___SIMULACRO_COMENTADO_SEPTIEMBRE-UNO-23_073':' Los demás especificadores no se aplican a ciclotimia.',
'SEPTIEMBRE-DOS-24_COMENTADO_094':' Las demás opciones invierten recurrencia, riesgo suicida o quejas somáticas.',
'SEPTIEMBRE-DOS-24_COMENTADO_102':' Las restantes edades no son la media aproximada recogida por el manual.',
'SEPTIEMBRE-DOS-24_COMENTADO_103':' Las demás opciones invierten o absolutizan las diferencias por sexo.',
'SEPTIEMBRE-UNO-24_COMENTADO_144':' Por ello a, b y c son falsas.',
'SEPTIEMBRE-UNO-24_COMENTADO_184':' Las opciones a, c y d son generalizaciones falsas.',
'Simu 13 comentado_041':' La opción c es la respuesta; los otros tres patrones pueden generar mayor confusión por su labilidad o impulsividad.',
'Simu 15 comentado_055':' La c es correcta según la revisión citada: el abuso psicológico infantil mostró la asociación más destacada. Es una asociación de riesgo, no una causa suficiente ni necesaria.'};
let n=0;for(const q of bank)if(ids.includes(q.id)){q.x=(q.x||'')+extra[q.id];q.v='VALIDADA_ORIGINAL';if(q.id==='Simu 15 comentado_055')q.e='¿Qué tipo de maltrato infantil mostró la asociación más intensa con el trastorno bipolar en la revisión citada?';n++;}if(n!==20)throw Error(`Expected 20, got ${n}`);fs.writeFileSync(file,JSON.stringify(bank));console.log(`Audited ${n}.`);
