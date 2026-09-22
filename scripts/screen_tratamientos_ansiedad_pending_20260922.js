import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => {
  if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8')));
  return files.get(name);
};
const adult = load('tratamientos_adultos.json');
const sourceTopic = 'Tratamiento de los trastornos de ansiedad';
const before = adult.filter((q) => q.t?.includes(sourceTopic) && q.v !== 'VALIDADA_ORIGINAL').length;

const destinations = {
  adultPersonality: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos de personalidad'],
  adultPsychosis: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de la psicosis y esquizofrenia'],
  adultTrauma: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento del trauma y TEPT'],
  adultDissociative: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos disociativos'],
  adultAddictions: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de las adicciones'],
  adultMood: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de la depresión y trastornos del ánimo'],
  adultEating: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos alimentarios'],
  adultOcd: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento del TOC y relacionados'],
  adultSleep: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos del sueño'],
  adultSomatic: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de los trastornos somáticos'],
  adultSexual: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento de las disfunciones sexuales'],
  adultTransdiagnostic: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamientos transdiagnósticos'],
  adultTea: ['tratamientos_adultos.json', 'Tratamientos Adultos', 'Tratamiento del TEA'],
  clinicAdultGender: ['clinica_adultos.json', 'Clínica Adultos', 'Disforia de género'],
  clinicAdultEating: ['clinica_adultos.json', 'Clínica Adultos', 'Trastornos de la conducta alimentaria'],
  clinicChildAnxiety: ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastornos de ansiedad infantojuveniles'],
  clinicChildAutism: ['clinica_infantojuvenil.json', 'Clínica Infantojuvenil', 'Trastorno del espectro autista'],
  childAnxiety: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de ansiedad infantojuvenil'],
  childDepression: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos depresivos y bipolares infantojuvenil'],
  childTrauma: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos relacionados con trauma infantojuvenil'],
  childPsychosis: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos psicóticos infantojuvenil'],
  childConduct: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de conducta infantojuvenil'],
  childElimination: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de excreción infantojuvenil'],
  childSuicide: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Conducta suicida y autolesión infantojuvenil'],
  childCommunication: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastornos de la comunicación'],
  childTea: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Trastorno del Espectro Autista'],
  childTdah: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'TDAH'],
  childOther: ['tratamientos_infantiles.json', 'Tratamientos Infantiles', 'Otros problemas infantojuveniles'],
  social: ['psicologia_social.json', 'Psicología Social', 'Relaciones intergrupales'],
  differential: ['psicologia_de_la_personalidad_y_diferencial.json', 'Psicología de la Personalidad y Diferencial', 'Diferencias interindividuales en inteligencia'],
  learning: ['psicologia_basica.json', 'Psicología Básica', 'Aprendizaje y condicionamiento']
};

const mapping = {
  clinicChildAnxiety: ['SIM_PERS_AGO25_090'],
  adultPersonality: ['Simu 11 comentado_067','Simu 11 comentado_075','Simu 31 comentado Hardcore 1_030','Simu 7 comentado _165','SmCm23PIR2025_130'],
  adultPsychosis: ['Simu 11 comentado_166','Simu 13 comentado_143','Simu 16 comentado_181','Simu 31 comentado Hardcore 1_014','SmCm23PIR2025 (2)_176','SmCm3PIR2024_182'],
  adultTrauma: ['Simu 11 comentado_172','Simu 31 comentado Hardcore 1_035','SmCm21PIR2025 (2)_159','SmCm23PIR2025_163'],
  adultDissociative: ['Simu 11 comentado_173','Simu 15 comentado_170','SM_ABRIL_1_SOL_1_166','SM_DICIEMBRE_2_SOL_1_139'],
  adultAddictions: ['Simu 11 comentado_174','Simu 13 comentado_156','SmCm17PIR2025_141','SmCm26PIR2025_019'],
  adultMood: ['Simu 12 comentado_175','Simu 14 comentado _078','Simu 14 comentado _082','Simu 15 comentado_164','Simu 15 comentado_165','Simu 15 comentado_166','SmCm14PIR2025_008','SmCm14PIR2025_025','SmCm15PIR2025_154','SmCm17PIR2025_145','SmCm19PIR2024_151','SmCm22PIR2025_135','SmCm30PIR2025 (1)_085'],
  adultEating: ['Simu 13 comentado_142','SmCm25PIR2025_182','SmCm26PIR2025_024','SmCm4PIR2024_166'],
  adultOcd: ['Simu 14 comentado _088','Simu 16 comentado_182','Simu 7 comentado _193','SmCm13PIR2025_067','SmCm21PIR2025 (2)_086','SmCm30PIR2025 (1)_082','SmCm4PIR2024_139'],
  adultSomatic: ['SmCm28PIR2025_005'],
  adultSexual: ['SmCm23PIR2025 (2)_163','SmCm25PIR2025_005','SmCm26PIR2025_025','SmCm28PIR2025_180'],
  adultTransdiagnostic: ['SmCm20PIR2024_192'],
  adultTea: ['SmCm27PIR2025 (1)_061'],
  clinicAdultGender: ['Simu 16 comentado_166'],
  clinicAdultEating: ['SmCm4PIR2024_090'],
  childAnxiety: ['Simu 11 comentado_194','Simu 12 comentado_097','Simu 13 comentado_160','Simu 31 comentado Hardcore 1_017','SM_DICIEMBRE_1_SOL_1_138','SM_JULIO_2_SOL_1_080','SmCm11PIR2025_125','SmCm12PIR2024 2_143','SmCm12PIR2024 2_144','SmCm17PIR2025_178','SmCm20PIR2024_151','SmCm20PIR2025 (1)_142','SmCm21PIR2025 (2)_182','SmCm24PIR2025 (1)_109','SmCm24PIR2025 (1)_110','SmCm24PIR2025 (1)_112','SmCm25PIR2025_186','SmCm27PIR2025 (1)_063','SmCm29PIR2025_007','SmCm29PIR2025_008'],
  childDepression: ['Simu 12 comentado_191','Simu 16 comentado_183','SmCm10PIR2025_108','SmCm25PIR2025_162','SmCm29PIR2025_155'],
  childTrauma: ['SmCm25PIR2025_060','SmCm28PIR2025_151','SmCm3PIR2024_196'],
  childConduct: ['Simu 8 comentado _133','SmCm11PIR2025_120'],
  childElimination: ['SmCm22PIR2025 (1)_133','SmCm25PIR2025_159','SmCm7PIR2024_111'],
  childSuicide: ['Simu 31 comentado Hardcore 1_010'],
  childCommunication: ['Simu 12 comentado_196'],
  childTea: ['Simu 12 comentado_188'],
  childTdah: ['Simu 12 comentado_189'],
  childOther: ['Simu 8 comentado _034','SmCm17PIR2025_004','SmCm24PIR2025 (1)_011'],
  clinicChildAutism: ['SmCm3PIR2024_183'],
  social: ['SmCm11PIR2025_028'],
  differential: ['SmCm3PIR2024_042'],
  learning: ['SmCm4PIR2024_138']
};

const duplicateIds = [
  'SmCm11PIR2025_027',
  'Simu 13 comentado_145',
  'SmCm12PIR2024 2_122',
  'SmCm14PIR2025_130',
  'SmCm13PIR2025_024',
  'SmCm15PIR2025_161',
  'SmCm14PIR2025_137',
  'SmCm18PIR2025_174',
  'SmCm14PIR2025_133',
  'SmCm1PIR2024_126',
  '4Simulacro02018Comentarios_189',
  'Simu 12 comentado_156',
  'Simu 12 comentado_077'
];

const moved = [];
for (const [destination, ids] of Object.entries(mapping)) {
  const [file, subject, topic] = destinations[destination];
  const target = load(file);
  for (const id of ids) {
    const index = adult.findIndex((q) => q.id === id);
    if (index < 0) throw new Error(`No encontrada para mover: ${id}`);
    const [q] = adult.splice(index, 1);
    q.s = subject;
    q.t = [topic];
    if (target !== adult) {
      if (target.some((row) => row.id === id)) throw new Error(`ID duplicado al mover: ${id}`);
      target.push(q);
    } else {
      adult.push(q);
    }
    moved.push(id);
  }
}

for (const id of duplicateIds) {
  const index = adult.findIndex((q) => q.id === id);
  if (index < 0) throw new Error(`No encontrada para eliminar: ${id}`);
  adult.splice(index, 1);
}

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
const manifestPath = path.join(root, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const meta of Object.values(manifest.subjects)) meta.count = load(`${meta.slug}.json`).length;
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const after = adult.filter((q) => q.t?.includes(sourceTopic) && q.v !== 'VALIDADA_ORIGINAL').length;
console.log(JSON.stringify({ before, moved: moved.length, removedDuplicates: duplicateIds.length, after }));
