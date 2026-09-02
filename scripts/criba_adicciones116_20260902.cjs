const fs=require('fs');
const dir='public/banco';
const topic='Trastornos adictivos y relacionados con sustancias';
const bank=JSON.parse(fs.readFileSync(`${dir}/clinica_adultos.json`,'utf8'));
const manifest=JSON.parse(fs.readFileSync(`${dir}/manifest.json`,'utf8'));
const all=Object.values(manifest.subjects).flatMap(s=>JSON.parse(fs.readFileSync(`${dir}/${s.slug}.json`,'utf8')));
const valid=new Set(['VALIDADA_ORIGINAL','CORREGIDA','VALIDADA']);
const pending=bank.filter(q=>q.t?.includes(topic)&&!valid.has(q.v));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tokens=s=>new Set(norm(s).split(' ').filter(x=>x.length>3));
const jac=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)};
const byText=new Map();
for(const q of all){const k=norm(q.e);if(k)(byText.get(k)||byText.set(k,[]).get(k)).push(q.id)}
const explicitDest={
 'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_167':'Psicología Básica > Motivación y emoción / sexualidad',
 'SEPTIEMBRE-DOS-24_COMENTADO_134':'Psicología Básica > Motivación y emoción',
 'Simu 31 comentado Hardcore 1_099':'Psicobiología > Acción de los fármacos en el sistema nervioso',
 'simu 9 comentado_078':'Clínica Adultos > Trastornos de la conducta alimentaria',
 'SmCm29PIR2025_082':'Clínica Adultos > Trastornos neurocognitivos'
};
const rows=pending.map(q=>{
 const txt=[q.e,...Object.values(q.o||{}),q.x,q.r].join(' '), opts=Object.values(q.o||{}), flags=[];
 if(!q.e?.trim())flags.push('ENUNCIADO_VACIO');
 if(!['a','b','c','d'].includes(q.c))flags.push('CLAVE_INVALIDA');
 if(!['a','b','c','d'].every(k=>q.o?.[k]?.trim()))flags.push('OPCION_VACIA');
 if(!q.x?.trim())flags.push('SIN_JUSTIFICACION');
 if(!q.r?.trim())flags.push('SIN_REFERENCIA');
 if(/�|||\b(?:AMIR|PSICOLOGÍA AM)\b/i.test(txt))flags.push('OCR_BASURA');
 if(/\b\w{2,}-\s+\w{2,}\b|\ba\s+rmaci[oó]n\b|\bespeci\s+car\b|\bclasi\s+caciones\b/i.test(txt))flags.push('OCR_CORTE');
 if(/^\s*(?:\d+\s+){2,}/.test(q.e||'')||/\?\s*:\s*$/.test(q.e||''))flags.push('OCR_CABECERA');
 if(opts.some(v=>/(respuesta|alternativa|opci[oó]n)\s*(?:correcta|incorrecta|[1-4])|\bR[IC]\s*[1-4]|DSM-?5.*p[aá]g/i.test(v)))flags.push('EXPLICACION_EN_OPCION');
 const exact=(byText.get(norm(q.e))||[]).filter(id=>id!==q.id);if(exact.length)flags.push('DUPLICADO_EXACTO');
 if(q.x?.trim()&&q.x.length<140)flags.push('JUSTIFICACION_INSUFICIENTE');
 if(q.x&& !/(opci[oó]n|alternativa|\ba\b|\bb\b|\bc\b|\bd\b|R[IC][1-4])/i.test(q.x))flags.push('SIN_DESCARTE_DISTRACTORES');
 if(/\b(?:\d+(?:[.,]\d+)?\s*%|prevalencia|incidencia|riesgo|ratio|cantidad|mg|gramos?)\b/i.test(txt))flags.push('DATO_CUANTITATIVO_REVISAR');
 if(/\b(?:seg[uú]n|modelo|teor[ií]a|autor|informe|clasificaci[oó]n)\b/i.test(q.e||''))flags.push('AUTOR_MODELO_REVISAR');
 if(explicitDest[q.id])flags.push('UBICACION_INCOMPATIBLE');
 const tq=tokens(q.e), near=[];
 for(const z of pending){if(z.id===q.id)continue;const score=jac(tq,tokens(z.e));if(score>=.72)near.push({id:z.id,score:+score.toFixed(2)})}
 if(near.length)flags.push('CASI_DUPLICADO');
 const high=flags.some(f=>/CLAVE|VACIA|EXPLICACION_EN_OPCION|DUPLICADO|UBICACION|OCR_BASURA/.test(f));
 const med=flags.some(f=>/SIN_REFERENCIA|SIN_JUSTIFICACION|OCR_|CUANTITATIVO|AUTOR_MODELO/.test(f));
 return {id:q.id,enunciado:q.e,clave:q.c,flags,severity:high?'PRIORIDAD_ALTA':med?'PRIORIDAD_MEDIA':'PRIORIDAD_BAJA',destinoSugerido:explicitDest[q.id]||null,duplicadosExactos:exact,casiDuplicados:near};
});
const pick=k=>rows.filter(r=>r.severity===k).map(r=>r.id);
const summary={alta:pick('PRIORIDAD_ALTA').length,media:pick('PRIORIDAD_MEDIA').length,baja:pick('PRIORIDAD_BAJA').length,ocr:rows.filter(r=>r.flags.some(f=>f.startsWith('OCR'))).length,explicacionEnOpcion:rows.filter(r=>r.flags.includes('EXPLICACION_EN_OPCION')).length,sinJustificacion:rows.filter(r=>r.flags.includes('SIN_JUSTIFICACION')).length,sinReferencia:rows.filter(r=>r.flags.includes('SIN_REFERENCIA')).length,ubicacionIncompatible:rows.filter(r=>r.flags.includes('UBICACION_INCOMPATIBLE')).length,duplicadosExactos:rows.filter(r=>r.flags.includes('DUPLICADO_EXACTO')).length,casiDuplicados:rows.filter(r=>r.flags.includes('CASI_DUPLICADO')).length};
const report={createdAt:new Date().toISOString(),subject:'Clínica Adultos',topic,totalTema:bank.filter(q=>q.t?.includes(topic)).length,pendingBefore:pending.length,summary,batches:{profundidadPrimero:pick('PRIORIDAD_ALTA'),profundidadDespues:pick('PRIORIDAD_MEDIA'),revisionFinal:pick('PRIORIDAD_BAJA')},rows};
fs.mkdirSync('auditorias',{recursive:true});
const out='auditorias/clinica_adultos_adicciones_criba116_20260902.json';
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({out,total:rows.length,...summary},null,2));
