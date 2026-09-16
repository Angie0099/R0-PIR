const fs = require('fs');
const path = require('path');
const treatmentsFile = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const clinicalFile = path.join(__dirname, '..', 'public', 'banco', 'clinica_adultos.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsFile, 'utf8'));
const clinical = JSON.parse(fs.readFileSync(clinicalFile, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const candidates = treatments.filter(q => q.t?.includes(topic)).slice(20, 61);
if (candidates.length !== 41) throw new Error(`Se esperaban 41 candidatas y hay ${candidates.length}`);

const movedId = 'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-UNO-23_065';
const movedIndex = treatments.findIndex(q => q.id === movedId);
const moved = treatments[movedIndex];
if (!moved || !candidates.some(q => q.id === movedId)) throw new Error('No se encontró WHO-BIC');
moved.s = 'Clínica Adultos';
moved.t = ['Conducta suicida y autolesión'];
moved.v = 'VALIDADA_ORIGINAL';
moved.r = 'Fleischmann, A. et al. (2008). Effectiveness of brief intervention and contact for suicide attempters: a randomized controlled trial in five countries. Bulletin of the World Health Organization, 86, 703-709.';
treatments.splice(movedIndex, 1);
if (clinical.some(q => q.id === movedId)) throw new Error('El ID WHO-BIC ya existe en Clínica Adultos');
clinical.push(moved);

const block = candidates.filter(q => q.id !== movedId);
if (block.length !== 40) throw new Error(`El bloque debe contener 40 preguntas y contiene ${block.length}`);

for (const q of block) {
  q.v = 'VALIDADA_ORIGINAL';
  if (!q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || /�/.test(q.e + JSON.stringify(q.o) + q.x)) throw new Error(`Control fallido: ${q.id}`);
}

fs.writeFileSync(treatmentsFile, JSON.stringify(treatments));
fs.writeFileSync(clinicalFile, JSON.stringify(clinical));
console.log('Segundo bloque reauditorado: 40 preguntas válidas y WHO-BIC reubicada.');
