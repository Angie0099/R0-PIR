import fs from 'node:fs';
const file=new URL('../public/banco/psicopatologia.json',import.meta.url);
const rows=JSON.parse(fs.readFileSync(file,'utf8'));
const q=rows.find(x=>x.id==='3Simulacro2018Comentarios_168');
if(!q||!q.t?.includes('Modelos en psicopatología')||q.v==='VALIDADA_ORIGINAL') throw new Error('Pregunta final no disponible');
Object.assign(q,{e:'Según el modelo de Janet sobre la histeria, ¿cómo se origina la disociación?',o:{a:'Como un proceso pasivo por debilitamiento de la síntesis psicológica',b:'Como resultado exclusivo de la represión activa',c:'Como una forma deliberada de disfrazar información',d:'Como una conversión voluntaria de conflictos'},c:'a',x:'La a es correcta: Janet concebía la disociación como un fallo pasivo de integración o síntesis psicológica, favorecido por una debilidad constitucional y experiencias traumáticas. Se diferencia de la explicación freudiana centrada en la represión defensiva.',r:'Janet, P. (1889). L’automatisme psychologique; van der Hart, O. y Horst, R. (1989). The dissociation theory of Pierre Janet. Journal of Traumatic Stress, 2, 397–412.',v:'VALIDADA_ORIGINAL'});
fs.writeFileSync(file,JSON.stringify(rows));
console.log(JSON.stringify({closed:'Modelos en psicopatología',remaining:rows.filter(x=>x.t?.includes('Modelos en psicopatología')&&x.v!=='VALIDADA_ORIGINAL').length}));
