import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bankDir = path.join(scriptDir, '..', 'public', 'banco');
const targets = [
  ['01', 'uso de una escala visual'], ['02', 'programa stepps'], ['03', 'programa esteem'],
  ['04', 'término neutralización sirve'], ['05', 'tratamiento psicofarmacológico en el trastorno del espectro autista'],
  ['06', 'doxepina'], ['07', 'entrenamiento en inoculacion del estrés'],
  ['08', 'escenificaciones emotivas'], ['09', 'terapia personal (hogarty'],
  ['10', '1++. e'], ['11', 'guías de prácticas clínicas (gpc, 2017)'], ['12', 'malos tratos en la infancia'],
  ['13', 'componente fundamental activo durante la fase'], ['14', 'característica de la teoría de kihlstrom'],
  ['15', 'tratamiento farmacológico de la enuresis'], ['16', 'programas para el tratamiento de trastornos neurocognitivos realiza'],
  ['17', 'fobia más generalizada'], ['18', 'programas multicomponentes para la depresión infantil'],
  ['19', 'ventajas de la realidad virtual en los casos'], ['20', 'merit. d t'],
  ['21', 'terapias propuestas para el tratamiento del trastorno límite'], ['22', 'terapia merit en el tratamiento de la psicosis'],
  ['23', 'teens options for change'], ['24', 'tratamiento de la esquizofrenia se establecen'],
  ['25', 'sueño y la mortalidad'], ['26', 'se presenta como un curso que'],
  ['27', 'programa de tratamiento del control del pánico'], ['28', 'si el paciente niega la existencia'],
  ['29', 'programa de fresnillo-poza'], ['30', '2 3 4 ¿cuál de las siguientes opciones es una página web'],
  ['31', 'buspirona. de esta pregunta'], ['32', 'emoción básica negativa'],
  ['33', 'dirigir los globos oculares'], ['34', 'riesgo de suicidio asociado a personas'],
  ['35', 'normalización racional'], ['36', 'compasión (cft) para la psicosis']
];

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const found = new Map(targets.map(([n]) => [n, []]));
for (const file of fs.readdirSync(bankDir).filter((name) => name.endsWith('.json'))) {
  const rows = JSON.parse(fs.readFileSync(path.join(bankDir, file), 'utf8'));
  if (!Array.isArray(rows)) continue;
  for (const row of rows) {
    const source = normalize(`${row.e || ''} ${Object.values(row.o || {}).join(' ')}`);
    for (const [n, phrase] of targets) {
      if (source.includes(normalize(phrase))) found.get(n).push({ file, id: row.id, topic: row.t, key: row.c, status: row.v, stem: row.e });
    }
  }
}
for (const [n, matches] of found) console.log(`${n}\t${JSON.stringify(matches)}`);
