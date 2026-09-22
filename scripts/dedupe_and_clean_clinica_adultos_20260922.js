import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = path.join(appRoot, 'public', 'banco', 'clinica_adultos.json');
const manifestPath = path.join(appRoot, 'public', 'banco', 'manifest.json');
const reportPath = path.join(appRoot, 'auditorias', 'clinica_adultos_deduplicacion_20260922.json');
let rows = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

const replacements = {
  'Simu 12 comentado_067': {
    e: '¿En qué porcentaje de casos el temor de la fobia específica afecta a más de una situación u objeto?',
    o: { a: '25 %', b: '50 %', c: '75 %', d: '100 %' }
  },
  'Simu 12 comentado_071': {
    e: 'Respecto a la epidemiología y el curso del trastorno de ansiedad social, señale la afirmación correcta:',
    o: {
      a: 'En adolescentes suele existir un patrón más restringido de miedo y evitación que en adultos',
      b: 'En adultos jóvenes la ansiedad social se limita necesariamente a una única situación',
      c: 'En adultos mayores puede relacionarse con déficits sensoriales, vergüenza por el aspecto, enfermedades, incontinencia o deterioro cognitivo',
      d: 'En personas mayores siempre aparece un patrón generalizado de miedo y evitación'
    }
  },
  'Simu 6 comentado__088': {
    e: '¿Qué autor se asocia al modelo de desregulación emocional del trastorno de ansiedad generalizada?',
    o: { a: 'Newman', b: 'Borkovec', c: 'Dugas', d: 'Mennin' }
  },
  'SmCm11PIR2025_158': {
    e: '¿Qué trastorno del sueño puede aparecer secundariamente a la enfermedad de Whipple?',
    o: { a: 'Apnea obstructiva del sueño', b: 'Trastorno del despertar del sueño no REM', c: 'Narcolepsia', d: 'Hipoventilación central congénita' },
    x: 'La c es correcta: la enfermedad de Whipple puede producir una narcolepsia secundaria por afectación neurológica. Las otras alternativas no constituyen la asociación característica preguntada.',
    r: 'American Psychiatric Association (2022). DSM-5-TR, capítulo «Sleep-Wake Disorders», apartado de narcolepsia.'
  },
  'SmCm18PIR2025_037': {
    e: 'En el trastorno del ritmo circadiano de sueño-vigilia, ¿qué prevalencia puede alcanzar el tipo de fase de sueño retrasada en adolescentes?',
    o: { a: '1,7 % en población general', b: '2,3 % en población clínica', c: '5,2 % en adolescentes', d: 'Más del 7 % en adolescentes' },
    x: 'La d es correcta: el tipo de fase de sueño retrasada presenta una prevalencia superior al 7 % en adolescentes, grupo en el que el retraso circadiano es especialmente frecuente.'
  },
  'SmCm24PIR2025 (1)_036': {
    e: '¿Cuál es el criterio de frecuencia y duración del trastorno de insomnio según el DSM-5-TR?',
    o: {
      a: 'Al menos tres noches por semana durante más de seis meses',
      b: 'Al menos dos noches por semana durante más de seis meses',
      c: 'Al menos tres noches por semana durante al menos tres meses',
      d: 'Al menos dos noches por semana durante al menos tres meses'
    },
    x: 'La c es correcta: la dificultad de sueño debe presentarse al menos tres noches por semana y persistir durante al menos tres meses.'
  },
  'Simu 15 comentado_045': {
    e: '¿Cuál de los siguientes rasgos NO caracteriza a los trastornos de la personalidad del clúster A, descritos como raros o excéntricos?',
    o: { a: 'Desconfianza', b: 'Distanciamiento social', c: 'Desprecio y vulneración de los derechos ajenos', d: 'Déficits sociales y distorsiones cognitivas' }
  },
  'Simu 16 comentado_101': {
    e: 'En el modelo alternativo del DSM-5-TR, ¿qué conjunto recoge los cuatro rasgos patológicos propuestos para el trastorno de la personalidad obsesivo-compulsiva?',
    o: {
      a: 'Perfeccionismo rígido, perseveración, evitación de la intimidad y afectividad restringida',
      b: 'Desregulación cognitiva y perceptiva, creencias inusuales, afectividad restringida y retraimiento',
      c: 'Ansiedad, inseguridad de separación, impulsividad y hostilidad',
      d: 'Ansiedad, retraimiento, anhedonia y evitación de la intimidad'
    }
  },
  'Simu 31 comentado Hardcore 1_095': {
    e: '¿Para qué trastorno de la personalidad se exige evidencia de un trastorno de conducta antes de los 15 años?',
    o: { a: 'Trastorno histriónico de la personalidad', b: 'Trastorno antisocial de la personalidad', c: 'Trastorno límite de la personalidad', d: 'Trastorno esquizotípico de la personalidad' }
  },
  'SmCm17PIR2025_123': {
    e: '¿En qué clúster incluye el DSM-5-TR al trastorno límite de la personalidad?',
    o: { a: 'Clúster A', b: 'Trastornos mixtos', c: 'Clúster B', d: 'El DSM-5-TR eliminó este diagnóstico' }
  },
  'SmCm24PIR2025 (1)_054': {
    e: 'Según el modelo alternativo del DSM-5-TR, ¿qué rasgos exige el criterio B del trastorno de la personalidad evitativa?',
    o: {
      a: 'Tres o más de ansiedad, retraimiento, anhedonia y evitación de la intimidad, siendo obligatorio el retraimiento',
      b: 'Dos o más de ansiedad, retraimiento, anhedonia y evitación de la intimidad, siendo obligatoria la evitación de la intimidad',
      c: 'Tres o más de ansiedad, retraimiento, anhedonia y evitación de la intimidad, siendo obligatoria la ansiedad',
      d: 'Dos o más de ansiedad, retraimiento, anhedonia y evitación de la intimidad, siendo obligatoria la anhedonia'
    }
  },
  'Simu 16 comentado_124': {
    e: 'Respecto al curso del trastorno bipolar I, señale la afirmación correcta:',
    o: {
      a: 'El primer episodio afectivo comienza siempre antes de los 18 años y nunca después de los 60',
      b: 'Más del 90 % de quienes presentan un episodio maníaco único tendrán episodios recurrentes',
      c: 'Con la evolución, las recaídas se vuelven progresivamente más dependientes de factores externos',
      d: 'Los episodios maníacos recurrentes son infrecuentes en el trastorno bipolar I'
    },
    x: 'La b es correcta: más del 90 % de las personas que han presentado un episodio maníaco experimentan episodios recurrentes. El inicio puede darse a distintas edades; con la evolución, los episodios pueden independizarse de desencadenantes externos, y la recurrencia maníaca no es infrecuente.'
  },
  'SmCm22PIR2025_020': {
    e: '¿Qué combinación monoaminérgica propone la hipótesis permisiva para los episodios maníacos?',
    o: { a: 'Serotonina elevada y noradrenalina elevada', b: 'Serotonina disminuida y noradrenalina elevada', c: 'Serotonina disminuida y noradrenalina disminuida', d: 'La hipótesis permisiva no se aplica al trastorno bipolar' },
    x: 'La b es correcta: la hipótesis permisiva relaciona la manía con una actividad serotoninérgica baja que permite una actividad noradrenérgica elevada; para la depresión plantea actividad serotoninérgica baja junto con actividad noradrenérgica baja.'
  }
};

for (const row of rows) {
  if (replacements[row.id]) Object.assign(row, replacements[row.id]);
}

const normalizeStem = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const hasResidue = (row) => /[�]/.test([row.e, ...Object.values(row.o || {}), row.x].join(' ')) || /PSICOLOGÍA(?: AMI?|)\b/.test([row.e, ...Object.values(row.o || {}), row.x].join(' '));
const score = (row) => {
  let value = 0;
  if (row.v === 'VALIDADA_ORIGINAL') value += 1000;
  if (!hasResidue(row)) value += 500;
  if (row.x?.trim()) value += Math.min(row.x.length, 500);
  if (row.r?.trim()) value += Math.min(row.r.length, 500);
  if (Object.keys(row.o || {}).length === 4 && Object.hasOwn(row.o, row.c)) value += 250;
  return value;
};

const groups = new Map();
for (const row of rows) {
  const stem = normalizeStem(row.e);
  if (!groups.has(stem)) groups.set(stem, []);
  groups.get(stem).push(row);
}
const removed = [];
const removeIds = new Set();
for (const group of groups.values()) {
  if (group.length < 2) continue;
  const ranked = [...group].sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
  for (const duplicate of ranked.slice(1)) {
    removeIds.add(duplicate.id);
    removed.push({ removedId: duplicate.id, keptId: ranked[0].id, stem: ranked[0].e });
  }
}
rows = rows.filter((row) => !removeIds.has(row.id));

const residual = rows.filter(hasResidue).map((row) => row.id);
if (residual.length) throw new Error(`Persisten residuos OCR: ${residual.join(', ')}`);

const postGroups = new Map();
for (const row of rows) {
  const stem = normalizeStem(row.e);
  if (!postGroups.has(stem)) postGroups.set(stem, []);
  postGroups.get(stem).push(row.id);
}
const duplicatesAfter = [...postGroups.values()].filter((ids) => ids.length > 1);
if (duplicatesAfter.length) throw new Error(`Persisten duplicados: ${JSON.stringify(duplicatesAfter)}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.subjects['Clínica Adultos'].count = rows.length;
fs.writeFileSync(bankPath, JSON.stringify(rows));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(reportPath, JSON.stringify({ date: '2026-09-22', before: rows.length + removed.length, after: rows.length, removedCount: removed.length, correctedOcrCount: Object.keys(replacements).length, removed }, null, 2) + '\n');
console.log(JSON.stringify({ before: rows.length + removed.length, after: rows.length, removed: removed.length, correctedOcr: Object.keys(replacements).length }));
