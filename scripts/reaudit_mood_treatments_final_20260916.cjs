const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const topic = 'Tratamiento de la depresión y trastornos del ánimo';
const all = bank.filter(q => q.t?.includes(topic));
const block = all.slice(140);
if (block.length !== 5) throw new Error(`Se esperaban 5 preguntas y hay ${block.length}`);
const get = id => {
  const q = block.find(x => x.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  return q;
};

get('SM_DICIEMBRE_2_SOL_1_073').r = 'Rehm, L. P. (1977). A self-control model of depression. Behavior Therapy, 8, 787-804.';

Object.assign(get('SmCm26PIR2025_061'), {
  e: '¿Qué intervención familiar para pacientes psiquiátricos hospitalizados, desarrollada por Clarkin y colaboradores, trabaja el afrontamiento del ingreso y la planificación posterior al alta?',
  o: {
    a: 'Inpatient Family Intervention (IFI).',
    b: 'Terapia interpersonal y de ritmos sociales.',
    c: 'Tratamiento integrado de Weiss y Najavits.',
    d: 'Terapia centrada en la familia de Miklowitz.'
  },
  c: 'a',
  x: 'La Inpatient Family Intervention de Clarkin y colaboradores es una intervención breve para pacientes hospitalizados y sus familias. Entre sus objetivos se encuentran afrontar la hospitalización, aceptar la necesidad de tratamiento continuado, identificar estresores y preparar el ajuste posterior al alta. No fue diseñada exclusivamente para el trastorno bipolar, aunque incluyó pacientes con este diagnóstico.',
  r: 'Clarkin, J. F. et al. (1990). A psychoeducational intervention for families of affectively ill patients. Hospital and Community Psychiatry; Scott, J. y Colom, F. (2005). Psychosocial treatments for bipolar disorders. Psychiatric Clinics of North America, 28, 371-384.'
});

for (const q of block) q.v = 'VALIDADA_ORIGINAL';

const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const seen = new Map();
for (const q of all) {
  if (q.v !== 'VALIDADA_ORIGINAL' || !q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || /�/.test(q.e + JSON.stringify(q.o) + q.x)) throw new Error(`Control global fallido: ${q.id}`);
  const stem = normalize(q.e);
  if (seen.has(stem)) throw new Error(`Enunciado duplicado: ${seen.get(stem)} y ${q.id}`);
  seen.set(stem, q.id);
}

fs.writeFileSync(file, JSON.stringify(bank));
console.log(`Tema cerrado: ${all.length} preguntas validadas, sin duplicados exactos ni campos incompletos.`);
