import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankDir = path.join(root, 'public', 'banco');
const outDir = path.join(root, 'analysis', 'audit_reports');
const manifest = JSON.parse(fs.readFileSync(path.join(bankDir, 'manifest.json'), 'utf8'));
const files = fs.readdirSync(bankDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
const all = files.flatMap(file => JSON.parse(fs.readFileSync(path.join(bankDir, file), 'utf8')).map(q => ({...q, _file:file})));
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const byText = new Map();
for (const q of all) { const k = norm(q.e); if (k) (byText.get(k) || byText.set(k, []).get(k)).push(q.id); }
const issues = all.map(q => {
  const options = q.o || {};
  const text = [q.e, ...Object.values(options), q.x].join(' ');
  const flags = [];
  if (!q.e?.trim()) flags.push('ENUNCIADO_VACIO');
  if (!['a','b','c','d'].includes(q.c)) flags.push('CLAVE_INVALIDA');
  if (!['a','b','c','d'].every(k => options[k]?.trim())) flags.push('OPCION_VACIA');
  if (!q.x?.trim()) flags.push('SIN_JUSTIFICACION');
  if (!q.r?.trim()) flags.push('SIN_REFERENCIA');
  if (/�|\brnal\w*|\bsqh\w*/i.test(text)) flags.push('OCR_BASURA');
  if (/\b\w{2,}-\s+\w{2,}\b/.test(text) || /\b\w\s+\w{3,}\b/.test(text)) flags.push('OCR_CORTE');
  if (Object.values(options).some(v => /(opci[oó]n\s*[1-4].*(correcta|incorrecta)|respuesta\s*[1-4])/i.test(v))) flags.push('JUSTIFICACION_EN_OPCION');
  if ((byText.get(norm(q.e)) || []).length > 1) flags.push('DUPLICADO_ENUNCIADO');
  return {id:q.id,s:q.s,t:q.t,file:q._file,flags,priority:flags.filter(x=>/CLAVE|VACIA|OCR_BASURA|JUSTIFICACION/.test(x)).length};
}).filter(x => x.flags.length);
const report={createdAt:new Date().toISOString(),total:all.length,uniqueIds:new Set(all.map(q=>q.id)).size,manifestTotal:manifest.total,issues,bySubject:Object.groupBy(issues,x=>x.s),nextBatches:Object.entries(Object.groupBy(issues,x=>x.s)).map(([subject,rows])=>({subject,ids:rows.sort((a,b)=>b.priority-a.priority).slice(0,50).map(x=>x.id)}))};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'auditoria_automatica_actual.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({total:report.total,uniqueIds:report.uniqueIds,issues:issues.length,batches:report.nextBatches.map(x=>[x.subject,x.ids.length])},null,2));
