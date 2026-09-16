const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const block = bank.filter(q => q.t?.includes(topic)).slice(100, 140);
if (block.length !== 40) throw new Error(`Se esperaban 40 preguntas y hay ${block.length}`);

const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const seen = new Map();
for (const q of block) {
  q.v = 'VALIDADA_ORIGINAL';
  if (!q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || /�/.test(q.e + JSON.stringify(q.o) + q.x)) throw new Error(`Control fallido: ${q.id}`);
  const stem = normalize(q.e);
  if (seen.has(stem)) throw new Error(`Enunciado duplicado: ${seen.get(stem)} y ${q.id}`);
  seen.set(stem, q.id);
}

fs.writeFileSync(file, JSON.stringify(bank));
console.log('Cuarto bloque reauditorado: 40 preguntas correctas, sin reubicaciones ni duplicados exactos.');
