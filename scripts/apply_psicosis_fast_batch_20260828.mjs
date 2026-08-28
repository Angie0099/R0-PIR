import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const bankPath = path.resolve(here, "../public/banco/psicologia_clinica.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const byId = new Map(bank.map((q) => [q.id, q]));
const updates = [
  {
    id: "JULIO2_061",
    patch: {
      e: "Austin et al. (2015), en una cohorte de personas con primer episodio psicótico seguida durante diez años, identificaron cinco trayectorias sintomáticas. Señale la afirmación correcta:",
      o: {
        a: "El 47 % mostró una trayectoria de no respuesta.",
        b: "El 15 % mostró una trayectoria de respuesta positiva.",
        c: "El 13 % mostró una trayectoria de recaída.",
        d: "El 12 % mostró una trayectoria de respuesta tardía.",
      },
      c: "d",
      x: "La opción d es correcta: Austin et al. describieron una trayectoria de respuesta tardía en el 12 % de la muestra. La a confunde la respuesta positiva (47 %) con la no respuesta (13 %); la b atribuye a la respuesta positiva el porcentaje de recaída (15 %); y la c atribuye a la recaída el porcentaje de no respuesta o respuesta episódica (13 % cada una).",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 11, p. 399. Austin, S. F. et al. (2015). «Five trajectories of positive and negative symptoms in first episode psychosis». Schizophrenia Research, 168, 1-7.",
      v: "CORREGIDA",
    },
  },
  {
    id: "JUNIO1_082",
    patch: {
      e: "Respecto a la dimensión negativa de la esquizofrenia, indique la afirmación correcta:",
      o: {
        a: "El componente experiencial incluye afecto aplanado y alogia, mientras que el expresivo incluye anhedonia, aislamiento social y avolición.",
        b: "Los síntomas negativos son los que responden con mayor rapidez y relevancia clínica al tratamiento farmacológico y psicológico.",
        c: "La alogia, en población general, se considera la expresión conductual de vulnerabilidad latente a la psicosis.",
        d: "Los síntomas experienciales se evalúan mejor mediante autoinformes, mientras que la alogia y el afecto aplanado se valoran mejor mediante observación o técnicas objetivas.",
      },
      c: "d",
      x: "La opción d es correcta. Anhedonia, aislamiento social y avolición son más accesibles mediante autoinforme; alogia y afecto aplanado requieren preferentemente observación sistemática o medidas objetivas. La a invierte los componentes experiencial y expresivo; la b es falsa porque los síntomas negativos presentan una respuesta terapéutica limitada; y la c atribuye a la alogia lo que el manual señala para la anhedonia rasgo.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 11, pp. 405-407.",
      v: "CORREGIDA",
    },
  },
  {
    id: "ABRIL-UNO-24_COMENTADO_122",
    patch: {
      e: "Según la perspectiva dimensional de la psicosis, señale la afirmación correcta:",
      o: {
        a: "El modelo de Meehl explica específicamente los síntomas positivos.",
        b: "Las alteraciones positivas del habla y del pensamiento de la dimensión desorganizada son más frecuentes en mujeres.",
        c: "En la neurocognición suelen verse afectadas la memoria verbal y la velocidad de procesamiento.",
        d: "La alogia y el afecto aplanado se evalúan mejor mediante autoinformes.",
      },
      c: "c",
      x: "La opción c es correcta: entre los dominios neurocognitivos alterados se incluyen velocidad de procesamiento y aprendizaje o memoria verbal. La a es falsa porque Meehl desarrolló un modelo de esquizotaxia-esquizotipia vinculado a la vulnerabilidad y a la anhedonia; la b no está respaldada por el manual; y la d invierte el método de evaluación recomendado para alogia y afecto aplanado.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 11, pp. 402 y 407.",
      v: "CORREGIDA",
    },
  },
  {
    id: "MAYO2_017",
    patch: {
      e: "¿Cómo se denominan las experiencias aisladas de voces, como las pseudopercepciones hipnagógicas o hipnopómpicas, las vinculadas al duelo o a la privación sensorial extrema?",
      o: {
        a: "Alucinaciones no psicóticas.",
        b: "Alucinaciones transitorias.",
        c: "Alucinaciones parciales.",
        d: "Alucinaciones intrusivas relacionadas con traumas.",
      },
      c: "a",
      x: "La opción a es correcta: las alucinaciones no psicóticas pueden aparecer de forma aislada en situaciones como el duelo, la privación sensorial o las transiciones entre sueño y vigilia. Las transitorias se refieren a experiencias psicóticas breves ligadas habitualmente al estrés; las parciales son voces muy vívidas internas o reconocidas como irreales; y la d no es una categoría fenomenológica equivalente.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I, 4.ª ed., cap. 6, p. 202.",
      v: "CORREGIDA",
    },
  },
  {
    id: "DICIEMBRE-DOS-24_COMENTADO_046",
    patch: {
      e: "Según el modelo cognitivo de Freeman para el mantenimiento de los delirios persecutorios, ¿cuál de los siguientes procesos no está incluido?",
      o: {
        a: "Preocupaciones persistentes.",
        b: "Sesgos de razonamiento.",
        c: "Patrón de sueño alterado.",
        d: "Disonancia cognitiva.",
      },
      c: "d",
      x: "La opción d es correcta porque la disonancia cognitiva no forma parte de los procesos mantenedores formulados por Freeman. Las preocupaciones, los sesgos de razonamiento y la alteración del sueño sí figuran entre los procesos que interactúan en el mantenimiento de los delirios persecutorios.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I, 4.ª ed., cap. 11, p. 317. Freeman, D. (2014). «Persecutory delusions: a cognitive perspective on understanding and treatment». The Lancet Psychiatry, 1, 169-178.",
      v: "CORREGIDA",
    },
  },
  {
    id: "DICIEMBRE-UNO-24_COMENTADO_087",
    patch: {
      e: "¿Qué afirmación sobre la dimensión desorganizada o cognitiva de la psicosis es correcta?",
      o: {
        a: "La parakinesis en la catatonía con inhibición motora consiste en movimientos interrumpidos o rígidos y forzados.",
        b: "La catatonía se observa con mayor frecuencia en trastornos afectivos, especialmente bipolares, que en la esquizofrenia.",
        c: "En psicosis, los mejores predictores del funcionamiento social son exclusivamente el deterioro cognitivo y la metacognición.",
        d: "Las alteraciones positivas del habla y del pensamiento predicen de forma específica deterioro funcional y cognitivo.",
      },
      c: "b",
      x: "La opción b es correcta: el manual sitúa la catatonía más próxima al componente afectivo por su mayor presencia en los trastornos bipolares. La a no define con precisión la parakinesis; la c convierte en exclusivos unos predictores que no lo son; y la d sobreafirma una relación específica que el manual no establece de ese modo.",
      r: "Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. II, 4.ª ed., cap. 11, p. 408.",
      v: "CORREGIDA",
    },
  },
];

for (const { id, patch } of updates) {
  const question = byId.get(id);
  if (!question) throw new Error(`No se encontró ${id}.`);
  if (question.s !== "Psicología Clínica" || question.t?.[0] !== "Trastornos del espectro de la esquizofrenia y otros trastornos psicóticos") throw new Error(`Tema origen inesperado: ${id}.`);
  Object.assign(question, patch);
}
for (const { id } of updates) {
  const q = byId.get(id);
  if (!q.e || !q.x || !q.r || !["a", "b", "c", "d"].includes(q.c) || !["a", "b", "c", "d"].every((k) => q.o?.[k])) throw new Error(`Validación fallida: ${id}.`);
}
fs.writeFileSync(bankPath, `${JSON.stringify(bank)}\n`, "utf8");
console.log(JSON.stringify({ corrected: updates.map(({ id }) => id), total: bank.length, uniqueIds: new Set(bank.map((q) => q.id)).size }, null, 2));
