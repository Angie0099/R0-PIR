import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public/banco");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const write = (name, data) => fs.writeFileSync(path.join(root, name), JSON.stringify(data, null, 2) + "\n");

const clinical = read("psicologia_clinica.json");
const child = read("psicopatologia_infantil.json");
const manifest = read("manifest.json");

const psychopathologyTopic = new Map([
  ["Patología de la conciencia", "Psicopatología de la conciencia"],
  ["Psicopatología de la atención y orientación", "Psicopatología de la atención"],
  ["Psicopatología de la sensopercepción", "Psicopatología de la sensopercepción"],
  ["Psicopatología de la memoria", "Psicopatología de la memoria"],
  ["Psicopatología del pensamiento", "Psicopatología del pensamiento"],
  ["Pensamiento y lenguaje", "Psicopatología del pensamiento"],
  ["Psicopatología del lenguaje", "Psicopatología del lenguaje"],
  ["Psicopatología de la afectividad", "Psicopatología de la afectividad"],
  ["Psicopatología de la conducta motora", "Trastornos psicomotores"],
  ["Modelos en psicopatología", "Modelos en psicopatología"],
  ["Sistemas clasificatorios en psicopatología", "Sistemas clasificatorios en psicopatología"]
]);

const adultTopic = new Map([
  ["Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos", "Trastornos del espectro de la esquizofrenia"],
  ["Trastorno obsesivo-compulsivo y relacionados", "TOC"],
  ["Trastornos relacionados con traumas y factores de estrés", "Trastornos relacionados con estrés y trauma"],
  ["Trastornos de síntomas somáticos y relacionados", "Trastornos por síntomas somáticos y relacionados"],
  ["Trastornos de la conducta alimentaria y de la ingestión de alimentos", "Trastornos de la conducta alimentaria"],
  ["Trastornos disruptivos, del control de los impulsos y de la conducta", "Trastornos disruptivos del control de los impulsos y de la conducta"],
  ["Trastornos destructivos, del control de los impulsos y de la conducta", "Trastornos disruptivos del control de los impulsos y de la conducta"],
  ["Trastornos adictivos y comportamentales", "Trastornos adictivos y relacionados con sustancias"],
  ["Trastornos adictivos con sustancia", "Trastornos adictivos y relacionados con sustancias"]
]);

const childTopics = new Set([
  "Trastornos psicóticos infantojuveniles",
  "Trastorno del espectro autista",
  "Trastorno del Espectro Autista",
  "Trastorno por déficit de atención con hiperactividad (TDAH)",
  "Trastornos de la comunicación",
  "Trastornos de ansiedad infantojuveniles"
]);

const externalMoves = new Map([
  ["PERSEVER___SIMULACRO_COMENTADO_JUNIO-UNO-23_059", ["Psicología Experimental", "Introducción"]],
  ["Simu 14 comentado _003", ["Psicología Básica", "Aprendizaje y condicionamiento"]],
  ["Simu 14 comentado _062", ["Tratamientos Adultos", "Introducción"]],
  ["Simu 16 comentado_089", ["Psicología Evolutiva", "Primera infancia (0-2 años)"]],
  ["SmCm22PIR2025_014", ["Psicología Social", "Procesos de interacción social"]],
  ["SmCm23PIR2025_003", ["Evaluación Psicológica", "Técnicas objetivas"]],
  ["SmCm29PIR2025_046", ["Psicología Básica", "Percepción"]],
  ["SmCm30PIR2025 (1)_012", ["Psicología Experimental", "Estadística"]],
  ["SmCm30PIR2025 (1)_014", ["Psicología Experimental", "Método científico y experimental"]]
]);

const psych = [];
const adults = [];
const children = child.map(q => ({
  ...q,
  s: "Clínica Infantojuvenil",
  t: (q.t || []).map(t => t === "Trastorno del Espectro Autista" ? "Trastorno del espectro autista" : t)
}));
const movedExternal = [];

for (const q of clinical) {
  const first = q.t?.[0] || "";
  if (externalMoves.has(q.id)) {
    const [subject, topic] = externalMoves.get(q.id);
    const file = Object.entries(manifest.subjects)
      .find(([name]) => name === subject)?.[1]?.slug;
    if (!file) throw new Error(`No manifest destination for ${q.id}: ${subject}`);
    const targetName = `${file}.json`;
    const target = read(targetName);
    if (target.some(x => x.id === q.id)) throw new Error(`Duplicate destination ID ${q.id}`);
    target.push({ ...q, s: subject, t: [topic] });
    write(targetName, target);
    movedExternal.push(q.id);
  } else if (childTopics.has(first)) {
    children.push({
      ...q,
      s: "Clínica Infantojuvenil",
      t: (q.t || []).map(t => t === "Trastorno del Espectro Autista" ? "Trastorno del espectro autista" : t)
    });
  } else if (psychopathologyTopic.has(first)) {
    psych.push({ ...q, s: "Psicopatología", t: [psychopathologyTopic.get(first)] });
  } else {
    adults.push({ ...q, s: "Clínica Adultos", t: (q.t || []).map(t => adultTopic.get(t) || t) });
  }
}

const unique = arr => {
  const seen = new Set();
  for (const q of arr) {
    if (!q.id || seen.has(q.id)) throw new Error(`Missing/duplicate ID: ${q.id}`);
    seen.add(q.id);
  }
};
unique(psych); unique(adults); unique(children);

write("psicopatologia.json", psych);
write("clinica_adultos.json", adults);
write("clinica_infantojuvenil.json", children);

delete manifest.subjects["Psicología Clínica"];
delete manifest.subjects["Psicopatología Infantil"];
const topics = arr => [...new Set(arr.flatMap(q => q.t || []))];
const rebuilt = {
  "Psicopatología": { slug: "psicopatologia", count: psych.length, topics: topics(psych) },
  "Clínica Adultos": { slug: "clinica_adultos", count: adults.length, topics: topics(adults) },
  "Clínica Infantojuvenil": { slug: "clinica_infantojuvenil", count: children.length, topics: topics(children) }
};
manifest.subjects = { ...rebuilt, ...manifest.subjects };

for (const [name, meta] of Object.entries(manifest.subjects)) {
  const arr = read(`${meta.slug}.json`);
  meta.count = arr.length;
  meta.topics = topics(arr);
}
manifest.total = Object.values(manifest.subjects).reduce((sum, meta) => sum + meta.count, 0);
write("manifest.json", manifest);

fs.unlinkSync(path.join(root, "psicologia_clinica.json"));
fs.unlinkSync(path.join(root, "psicopatologia_infantil.json"));

const all = Object.values(manifest.subjects).flatMap(meta => read(`${meta.slug}.json`));
unique(all);
if (all.length !== 16089 || manifest.total !== 16089) throw new Error(`Global total changed: ${all.length}/${manifest.total}`);

console.log(JSON.stringify({
  total: all.length,
  psicopatologia: psych.length,
  clinicaAdultos: adults.length,
  clinicaInfantojuvenil: children.length,
  movedExternal: movedExternal.length,
  depressive: adults.filter(q => q.t?.includes("Trastornos depresivos")).length
}, null, 2));
