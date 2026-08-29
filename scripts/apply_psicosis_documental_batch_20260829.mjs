import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(here, "../public/banco/psicologia_clinica.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const byId = new Map(bank.map((q) => [q.id, q]));
const topic = "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos";
const updates = [
  {
    id: "JULIO1_114",
    patch: {
      e: "Respecto a los estados mentales de alto riesgo (EMAR), señale la afirmación correcta:",
      o: {
        a: "La fase prodrómica dura necesariamente entre tres y cinco años y el déficit atencional es siempre el síntoma principal.",
        b: "EMAR y pródromo son términos equivalentes que implican certeza e inminencia de transición a psicosis.",
        c: "Los EMAR tardíos incluyen síntomas psicóticos atenuados y síntomas psicóticos breves o intermitentes; los tempranos son más inespecíficos y se asocian a síntomas básicos.",
        d: "El 20 % de las personas con ansiedad o depresión y síntomas psicóticos subclínicos transita necesariamente a psicosis.",
      },
      c: "c",
      x: "La opción c es correcta. Belloch diferencia EMAR tempranos, más inespecíficos y ligados a síntomas básicos, de EMAR tardíos, caracterizados por síntomas psicóticos atenuados o breves e intermitentes. La a transforma una duración promedio variable en un requisito fijo; la b confunde un estado de riesgo con una predicción cierta; y la d formula una cifra determinista que no establece el manual.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 11, p. 411.",
      v: "CORREGIDA",
    },
  },
  {
    id: "JUNIO1_071",
    patch: {
      e: "Respecto a los sesgos cognitivos implicados en la formación y el mantenimiento de los delirios, señale la afirmación correcta:",
      o: {
        a: "El sesgo de salto a las conclusiones consiste en ignorar evidencia que contradice una creencia ya formada.",
        b: "El sesgo contra la evidencia confirmatoria se define por alcanzar una conclusión tras reunir mucha evidencia.",
        c: "El sesgo contra la evidencia confirmatoria se evalúa específicamente mediante la tarea probabilística de las bolitas.",
        d: "El sesgo de salto a las conclusiones se relaciona con un procesamiento rápido, de elevada capacidad y relativamente independiente de la memoria de trabajo.",
      },
      c: "d",
      x: "La opción d es correcta. El sesgo de salto a las conclusiones se vincula a un procesamiento rápido que alcanza una decisión con poca información. La a describe el sesgo contra la evidencia confirmatoria; la b contradice ese sesgo, que implica dificultad para revisar una hipótesis ante evidencia desconfirmatoria; y la c confunde su evaluación con la tarea de las bolitas, empleada para estudiar el salto a las conclusiones.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I, 4.ª ed., apartado sobre sesgos cognitivos en delirios, pp. 265-267.",
      v: "CORREGIDA",
    },
  },
  {
    id: "DICIEMBRE-UNO-24_COMENTADO_086",
    patch: {
      e: "Según Bourgeois et al. (2004), ¿qué relación puede observarse entre conciencia de enfermedad y riesgo suicida en personas con esquizofrenia o trastorno esquizoafectivo?",
      o: {
        a: "Una mayor conciencia basal de enfermedad se asocia de forma uniforme con menor riesgo suicida.",
        b: "En algunas circunstancias, una mayor conciencia basal de enfermedad se asocia con mayor riesgo suicida, relación mediada por depresión y desesperanza.",
        c: "La desesperanza no se relaciona con la asociación entre conciencia de enfermedad y riesgo suicida.",
        d: "Todo aumento de conciencia de enfermedad producido por el tratamiento eleva el riesgo suicida.",
      },
      c: "b",
      x: "La opción b es correcta. En el estudio InterSePT, una mayor conciencia basal de la enfermedad se asoció con más eventos suicidas durante el seguimiento, efecto mediado por depresión y desesperanza. La a y la c contradicen ese resultado. La d también es falsa: los cambios de conciencia asociados al tratamiento se relacionaron, en conjunto, con una disminución del riesgo suicida.",
      r: "Bourgeois, M. et al. (2004). «Awareness of disorder and suicide risk in the treatment of schizophrenia: results of the international suicide prevention trial». American Journal of Psychiatry, 161(8), 1494-1496. https://doi.org/10.1176/appi.ajp.161.8.1494.",
      v: "CORREGIDA",
    },
  },
];
for (const { id, patch } of updates) {
  const q = byId.get(id);
  if (!q || q.s !== "Psicología Clínica" || q.t?.[0] !== topic) throw new Error(`Origen no válido: ${id}.`);
  Object.assign(q, patch);
}
for (const { id } of updates) {
  const q = byId.get(id);
  if (!q.e || !q.x || !q.r || !["a", "b", "c", "d"].includes(q.c) || !["a", "b", "c", "d"].every((k) => q.o?.[k])) throw new Error(`Validación fallida: ${id}.`);
}
fs.writeFileSync(bankPath, `${JSON.stringify(bank)}\n`, "utf8");
console.log(JSON.stringify({ corrected: updates.map(({ id }) => id), total: bank.length, uniqueIds: new Set(bank.map((q) => q.id)).size }, null, 2));
