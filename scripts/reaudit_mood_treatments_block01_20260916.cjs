const fs = require('fs');
const path = require('path');
const treatmentsFile = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const clinicalFile = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const candidates = treatments.filter(q => q.t?.includes(topic)).slice(0, 21);
if (candidates.length !== 21) throw new Error(`Se esperaban 21 candidatas y hay ${candidates.length}`);

const misplacedId = 'OCTUBRE-UNO-24_COMENTADO_113';
const index = treatments.findIndex(q => q.id === misplacedId);
const misplaced = treatments[index];
if (!misplaced || !candidates.some(q => q.id === misplacedId)) throw new Error('No se encontró la pregunta de prevención indicada');
misplaced.s = 'Clínica Adultos';
misplaced.t = ['Conducta suicida y autolesión'];
misplaced.v = 'VALIDADA_ORIGINAL';
misplaced.r = 'World Health Organization (2014). Preventing suicide: A global imperative; Mrazek, P. J. y Haggerty, R. J. (eds.) (1994). Reducing Risks for Mental Disorders. National Academies Press.';
treatments.splice(index, 1);
if (clinical.some(q => q.id === misplacedId)) throw new Error('El ID ya existe en Clínica Adultos');
clinical.push(misplaced);

const block = candidates.filter(q => q.id !== misplacedId);
if (block.length !== 20) throw new Error(`El bloque debe contener 20 preguntas, contiene ${block.length}`);
function q(id) {
  const item = block.find(x => x.id === id);
  if (!item) throw new Error(`No se encontró ${id}`);
  return item;
}

Object.assign(q('PERSEV_JUL25_D2_130'), {
  e: '¿Cuál de las siguientes intervenciones para el trastorno bipolar se ofrece principalmente mediante una plataforma web y se orienta a la recuperación y calidad de vida?',
  o: { a: 'MONARCA.', b: 'ORBIT.', c: 'SIMPLe.', d: 'PRISM.' },
  c: 'b',
  x: 'ORBIT (Online, Recovery-focused, Bipolar Individual Therapy/Tool) es una intervención web de autogestión y recuperación para personas con trastorno bipolar. MONARCA, SIMPLe y PRISM se vinculan principalmente a dispositivos móviles o aplicaciones para teléfonos inteligentes.',
  r: 'Fletcher, K. et al. (2018). Web-based intervention to improve quality of life in late stage bipolar disorder (ORBIT): randomised controlled trial protocol. BMC Psychiatry, 18, 221.',
  v: 'VALIDADA_ORIGINAL'
});

Object.assign(q('PERSEVER___SIMULACRO_COMENTADO_ABRIL-DOS-23_085'), {
  e: '¿Qué intervención digital para el trastorno bipolar integra módulos web centrados en mindfulness y recuperación?',
  o: { a: 'MONARCA.', b: 'ORBIT.', c: 'PRISM.', d: 'SIMPLe.' },
  c: 'b',
  x: 'ORBIT es una intervención web individualizada y orientada a la recuperación que incorporó contenidos de mindfulness. PRISM combina psicoeducación breve con apoyo mediante teléfono inteligente; MONARCA y SIMPLe son intervenciones móviles.',
  r: 'Murray, G. et al. (2015). Online mindfulness-based intervention for late-stage bipolar disorder: pilot evidence for feasibility and effectiveness. Journal of Affective Disorders, 178, 46-51.',
  v: 'VALIDADA_ORIGINAL'
});

for (const item of block) {
  item.v = 'VALIDADA_ORIGINAL';
  if (!item.e || !item.o || Object.keys(item.o).length !== 4 || !item.o[item.c] || !item.x || !item.r || /�/.test(item.e + JSON.stringify(item.o) + item.x)) throw new Error(`Control fallido: ${item.id}`);
}

fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Primer bloque reauditorado: 20 preguntas válidas y 1 reubicada en Conducta suicida y autolesión.');
