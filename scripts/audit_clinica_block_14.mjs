import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const bancoDir = path.resolve(scriptDir, "../public/banco");
const clinicalPath = path.join(bancoDir, "psicologia_clinica.json");
const manifestPath = path.join(bancoDir, "manifest.json");
const CLINICAL = "Psicología Clínica";
const TOPIC = "Psicopatología del lenguaje";
const BELLOCH_I = "Belloch, A., Sandín, B. y Ramos, F. (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw-Hill.";
const SOURCE = BELLOCH_I + " p. 335, tabla 9.1 («Características de los síndromes afásicos corticales»).";

// Contraste directo con la tabla 9.1 del manual original. Se conservan los
// registros paralelos: cada uno es una pregunta independiente del banco.
const reviews = {
  SIM_ABR25_028: {
    oldC: "d",
    c: "d",
    e: "Un cuadro afásico con habla fluida, repetición conservada y comprensión auditiva afectada se clasifica como:",
    o: {
      a: "Afasia de Wernicke.",
      b: "Afasia de conducción.",
      c: "Afasia transcortical motora.",
      d: "Afasia transcortical sensorial.",
    },
    x: "La opción d es correcta. La afasia transcortical sensorial presenta un habla que puede parecerse a la de Wernicke, comprensión auditiva pobre y fluidez y repetición normales. En la afasia de Wernicke, en cambio, la repetición es pobre.",
  },
  SIM_ABR25_042: {
    oldC: "d",
    c: "d",
    e: "¿Qué tipo de afasia cortical combina comprensión auditiva pobre con fluidez y repetición normales?",
    o: {
      a: "Afasia de Wernicke.",
      b: "Afasia de conducción.",
      c: "Afasia transcortical motora.",
      d: "Afasia transcortical sensorial.",
    },
    x: "La opción d es correcta. En la afasia transcortical sensorial la comprensión auditiva es pobre, mientras que la fluidez y la repetición se conservan. Este patrón la distingue de la afasia de Wernicke y de la de conducción.",
  },
  SIM_ABR25_072: {
    oldC: "d",
    c: "d",
    e: "Según la tabla de Belloch et al. (2024), ¿qué afasia cortical se caracteriza por comprensión auditiva pobre, fluidez normal y repetición normal?",
    o: {
      a: "Afasia de Wernicke.",
      b: "Afasia de conducción.",
      c: "Afasia transcortical motora.",
      d: "Afasia transcortical sensorial.",
    },
    x: "La opción d es correcta. Ese conjunto de características corresponde a la afasia transcortical sensorial. La tabla especifica además que puede presentar parafasias verbales y anomia.",
  },
  SIM_ABR25_099: {
    oldC: "a",
    c: "a",
    e: "¿Qué perfil caracteriza a la afasia de conducción según la tabla de Belloch et al. (2024)?",
    o: {
      a: "Comprensión normal o levemente afectada y repetición muy deteriorada.",
      b: "Comprensión pobre y repetición normal.",
      c: "Habla muy afectada, comprensión normal y repetición normal.",
      d: "Alteración grave tanto del habla como de la comprensión.",
    },
    x: "La opción a es correcta. La afasia de conducción presenta con frecuencia parafasias fonémicas, comprensión normal o algo afectada y una repetición muy deteriorada, sin una falta grave de fluidez. Puede acompañarse de anomia.",
  },
  PERSEV_AGO25_U1_040: {
    oldC: "d",
    c: "d",
    e: "¿En cuál de los siguientes síndromes afásicos corticales la repetición puede ser ecolálica?",
    o: {
      a: "Afasia anómica amnésica.",
      b: "Afasia transcortical sensorial.",
      c: "Afasia transcortical motora.",
      d: "Afasia transcortical mixta.",
    },
    x: "La opción d es correcta. En la afasia transcortical mixta, también llamada aislamiento de las áreas del lenguaje, la repetición es normal pero puede ser ecolálica; la comprensión está muy deteriorada y la emisión espontánea es muy pobre.",
  },
  MAYO2_037: {
    oldC: "c",
    c: "c",
    e: "¿Qué síndrome afásico se caracteriza por habla muy afectada, comprensión dentro de lo normal, repetición normal y anomia?",
    o: {
      a: "Afasia de Broca.",
      b: "Afasia transcortical mixta.",
      c: "Afasia transcortical motora.",
      d: "Afasia de conducción.",
    },
    x: "La opción c es correcta. La afasia transcortical motora muestra un habla muy afectada, con tendencia a la reducción e inercia; la comprensión se mantiene dentro de lo normal y la fluidez es normal al repetir y al nombrar objetos. Puede existir anomia.",
  },
  "MAYO-UNO-24_COMENTADO_043": {
    oldC: "c",
    c: "c",
    e: "¿A qué tipo de afasia corresponde una fluidez y comprensión auditiva relativamente conservadas, pero con repetición muy deteriorada?",
    o: {
      a: "Afasia de Broca.",
      b: "Afasia anómica amnésica.",
      c: "Afasia de conducción.",
      d: "Afasia de Wernicke.",
    },
    x: "La opción c es correcta. En la afasia de conducción, la comprensión suele ser normal o estar solo algo afectada y no hay falta grave de fluidez, pero la repetición está muy deteriorada. El patrón puede incluir parafasias fonémicas y anomia.",
  },
  "SEPTIEMBRE-UNO-24_COMENTADO_158": {
    oldC: "c",
    c: "c",
    e: "Respecto a la afasia anómica amnésica, señale la opción correcta:",
    o: {
      a: "Suele presentar afectaciones extensas de las áreas de Broca y Wernicke.",
      b: "El habla está muy afectada y tiende a la reducción e inercia.",
      c: "El habla suele ser normal, salvo para los nombres, que pueden omitirse o sustituirse.",
      d: "Sus problemas característicos incluyen depresión y hemiplejia derecha.",
    },
    x: "La opción c es correcta. En la afasia anómica amnésica el habla suele ser normal, excepto en la denominación: los nombres pueden omitirse o sustituirse. La comprensión y la repetición suelen ser normales, y pueden aparecer circunloquios ocasionales por anomia.",
  },
};

const clinical = JSON.parse(fs.readFileSync(clinicalPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const byId = new Map(clinical.map((question) => [question.id, question]));
const missing = Object.keys(reviews).filter((id) => !byId.has(id));
if (missing.length) throw new Error("No se encontraron las preguntas: " + missing.join(", "));
if (!manifest.subjects[CLINICAL].topics.includes(TOPIC)) throw new Error("No existe el tema de destino.");

const finalClinical = clinical.map((question) => {
  const review = reviews[question.id];
  if (!review) return question;
  if (question.s !== CLINICAL || question.t?.[0] !== TOPIC) throw new Error("Ubicación previa inesperada en " + question.id);
  if (question.c !== review.oldC) throw new Error("La clave previa de " + question.id + " no coincide.");
  const result = {
    ...question,
    e: review.e,
    o: review.o,
    c: review.c,
    x: review.x,
    r: SOURCE,
    v: "CORREGIDA",
  };
  for (const key of ["a", "b", "c", "d"]) {
    if (!String(result.o?.[key] || "").trim()) throw new Error("Opción vacía en " + question.id + ": " + key);
  }
  if (!result.x.trim() || !result.r.trim()) throw new Error("Falta justificación o referencia en " + question.id);
  return result;
});

const files = fs.readdirSync(bancoDir).filter((file) => file.endsWith(".json") && file !== "manifest.json");
const allAfter = files.flatMap((file) => {
  if (file === "psicologia_clinica.json") return finalClinical;
  return JSON.parse(fs.readFileSync(path.join(bancoDir, file), "utf8"));
});
const afterIds = new Set(allAfter.map((question) => question.id));
if (allAfter.length !== afterIds.size || allAfter.length !== 15961) {
  throw new Error("La auditoría alteraría el total o los identificadores.");
}
for (const [id, review] of Object.entries(reviews)) {
  const result = finalClinical.find((question) => question.id === id);
  if (!result || result.c !== review.c || result.v !== "CORREGIDA" || result.r !== SOURCE) {
    throw new Error("No se aplicó correctamente la revisión de " + id + ".");
  }
}
if (manifest.total !== allAfter.length || manifest.subjects[CLINICAL].count !== finalClinical.length) {
  throw new Error("El manifiesto no coincide con el banco.");
}

fs.writeFileSync(clinicalPath, JSON.stringify(finalClinical) + "\n", "utf8");

console.log(JSON.stringify({
  block: "Clínica 14 — síndromes afásicos corticales",
  primarySourceValidated: Object.keys(reviews).length,
  clinicalTotal: finalClinical.length,
  total: allAfter.length,
  preservedQuestionIds: true,
}, null, 2));
