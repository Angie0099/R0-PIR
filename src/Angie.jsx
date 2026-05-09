import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// BANCO INICIAL (semilla mínima — todo lo demás vive en storage)
// Esta constante solo se usa para la primera carga si no hay nada en storage.
// Para añadir preguntas: usa la pestaña "Importar".
// ═══════════════════════════════════════════════════════════
const BANK_SEED = [];

const SUBJECTS = {
  "Evaluación Psicológica": ["Fundamentos de la evaluación psicológica","Clasificación de las técnicas de evaluación","Técnicas de observación","Autoinformes","Entrevista","Técnicas objetivas","Técnicas subjetivas","Técnicas proyectivas","Evaluación de la inteligencia","Evaluación de las aptitudes","Evaluación de la personalidad","Evaluación de características psicopatológicas","Evaluación del desarrollo intelectual, social y del lenguaje","Evaluación del envejecimiento","Evaluación neuropsicológica","Otras áreas a evaluar"],
  "Psicopatología": ["Modelos en psicopatología","Sistemas clasificatorios en psicopatología","Psicopatología de la conciencia","Psicopatología de la atención","Psicopatología de la sensopercepción","Psicopatología de la memoria","Psicopatología del pensamiento","Psicopatología del lenguaje","Psicopatología de la afectividad","Trastornos psicomotores"],
  "Clínica Adultos": ["Trastornos del espectro de la esquizofrenia","Trastornos depresivos","Trastornos bipolares y relacionados","Trastornos de ansiedad","TOC","Trastornos relacionados con estrés y trauma","Trastornos disociativos","Trastornos por síntomas somáticos y relacionados","Trastornos de la conducta alimentaria","Trastornos del sueño-vigilia","Disfunciones sexuales","Disforia de género","Trastornos parafílicos","Trastornos disruptivos del control de los impulsos y de la conducta","Trastornos adictivos y relacionados con sustancias","Trastornos neurocognitivos","Trastornos de la personalidad","Afecciones que requieren más estudio"],
  "Tratamientos Psicológicos": [],
  "Psicoterapias": [],
  "Psicobiología": [],
  "Psicología Diferencial y de la Personalidad": [],
  "Estadística y Experimental": [],
  "Psicología Clínica Infantil": [],
  "Psicología Social": [],
  "Psicología Básica": [],
  "Psicología del Desarrollo": [],
  "Psicología de la Salud": []
};

// ═══════════════════════════════════════════════════════════
// MIGRACIÓN DE TEMAS v1 → v2 (one-shot)
// Mapeo de nombres antiguos a nuevos para preservar preguntas
// ya importadas con la nomenclatura previa.
// ═══════════════════════════════════════════════════════════
const TOPIC_MIGRATIONS = {
  "Evaluación Psicológica": {
    "Fundamentos (Proceso de Evaluación)": "Fundamentos de la evaluación psicológica",
    "Clasificación de técnicas": "Clasificación de las técnicas de evaluación",
    "Observación": "Técnicas de observación",
    "Técnicas Objetivas": "Técnicas objetivas",
    "Técnicas Subjetivas": "Técnicas subjetivas",
    "Técnicas Proyectivas": "Técnicas proyectivas",
    "Inteligencia": "Evaluación de la inteligencia",
    "Aptitudes": "Evaluación de las aptitudes",
    "Personalidad": "Evaluación de la personalidad",
    "Características psicopatológicas": "Evaluación de características psicopatológicas",
    "Desarrollo intelectual, social y lenguaje": "Evaluación del desarrollo intelectual, social y del lenguaje",
    "Envejecimiento": "Evaluación del envejecimiento",
    "Neuropsicológica": "Evaluación neuropsicológica",
    "Otras áreas": "Otras áreas a evaluar"
  },
  "Clínica Adultos": {
    "Espectro de la Esquizofrenia y trastornos psicóticos": "Trastornos del espectro de la esquizofrenia",
    "Trastornos de Ansiedad": "Trastornos de ansiedad",
    "TOC y relacionados": "TOC",
    "Trastornos asociados a traumas y estresores": "Trastornos relacionados con estrés y trauma",
    "Trastornos de síntomas somáticos": "Trastornos por síntomas somáticos y relacionados",
    "Trastornos alimentarios y de la ingestión": "Trastornos de la conducta alimentaria",
    "Trastornos del sueño": "Trastornos del sueño-vigilia",
    "Trastornos disruptivos, control de impulsos y conducta": "Trastornos disruptivos del control de los impulsos y de la conducta",
    "Adicción a sustancias y otros trastornos adictivos": "Trastornos adictivos y relacionados con sustancias"
  }
};

// Heurística para temas viejos que ahora se dividen en varios.
// Devuelve el nombre del tema nuevo, o null si no aplica.
const smartSplit = (oldTopic, question) => {
  const text = ((question.e || "") + " " + (question.x || "")).toLowerCase();

  // "Trastornos del estado de ánimo" → "Trastornos depresivos" o "Trastornos bipolares y relacionados"
  if (oldTopic === "Trastornos del estado de ánimo (TDM, TBP, etc.)") {
    const isBipolar = /\b(bipolar|tb-?i\b|tb-?ii\b|man[ií]a\b|man[ií]aco|hipoman[ií]a|ciclotim|litio|valproat|lamotrig|kindling|ymrs|miklowitz|ipsrt|cbasp|akiskal|temperamento)\b/i.test(text);
    return isBipolar ? "Trastornos bipolares y relacionados" : "Trastornos depresivos";
  }

  // "Disfunciones sexuales, Disforia de género y Tx parafílicos" → 3 temas
  if (oldTopic === "Disfunciones sexuales, Disforia de género y Tx parafílicos") {
    if (/\b(disfor[ií]a de g[eé]nero|transgener|transexual|incongruencia de g[eé]nero|identidad de g[eé]nero)\b/i.test(text)) return "Disforia de género";
    if (/\b(parafil|fetich|voyeur|frotteu|sadism|masoquism|pedofil|exhibicion|travest|necrofil|zoofil)\b/i.test(text)) return "Trastornos parafílicos";
    return "Disfunciones sexuales";
  }

  return null;
};

// Aplica migración a un array de preguntas. Devuelve {migrated, changes}.
const migrateBank = (bankArr, subj) => {
  const mappings = TOPIC_MIGRATIONS[subj] || {};
  let changes = 0;
  const migrated = bankArr.map(q => {
    let qChanged = false;
    const newT = (q.t || []).map(t => {
      if (mappings[t]) { qChanged = true; changes++; return mappings[t]; }
      const split = smartSplit(t, q);
      if (split) { qChanged = true; changes++; return split; }
      return t;
    });
    return qChanged ? { ...q, t: newT } : q;
  });
  return { migrated, changes };
};

// Mapeo asignatura → clave de storage (sin acentos, sin espacios)
const subjectKey = (subj) => "bank:" + subj
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_+|_+$/g, "");

const SR_INT = [1,2,5,7,15];
const LEARN_N = 3;
const K = { deck:"pir:deck_v5", stats:"pir:stats_v1", qstats:"pir:qstats_v1" };

const C = {
  bg:"#F7F2EE",surface:"#FFFFFF",ink:"#15122B",muted:"#7A7591",line:"#EFEAFB",
  v50:"#F4F0FF",v100:"#E9E1FF",v200:"#D2C2FF",v300:"#A78BFA",v500:"#7C3AED",
  v600:"#6D28D9",v700:"#4C1D95",v800:"#2E1065",navy:"#1B1640",navy2:"#27214F",
  ok:"#10B981",warn:"#F59E0B",err:"#EF4444",
  peach:"#FED7AA",peachInk:"#9A3412",lilac:"#E9D5FF",lilacInk:"#6D28D9"
};

const todayS = () => new Date().toISOString().slice(0,10);
const addDays = (d,n) => { const dt=new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10); };
const daysBetween = (d1,d2) => Math.floor((new Date(d2)-new Date(d1))/(1000*60*60*24));
const load = async (k,fb) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : fb; } catch { return fb; } };
const save = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); return true; } catch { return false; } };

const pirYearProgress = () => {
  const now = new Date(); const y = now.getFullYear();
  let lastPIR = new Date(y, 0, 24, 0, 0, 0);
  if (now < lastPIR) lastPIR = new Date(y - 1, 0, 24, 0, 0, 0);
  const nextPIR = new Date(lastPIR.getFullYear() + 1, 0, 24, 0, 0, 0);
  const pct = ((now - lastPIR) / (nextPIR - lastPIR)) * 100;
  return Math.max(0, Math.min(100, pct));
};
const monthsSinceLastPIR = () => {
  const now = new Date(); const y = now.getFullYear();
  let lastPIR = new Date(y, 0, 24);
  if (now < lastPIR) lastPIR = new Date(y - 1, 0, 24);
  let m = (now.getFullYear() - lastPIR.getFullYear()) * 12 + (now.getMonth() - lastPIR.getMonth());
  if (now.getDate() < lastPIR.getDate()) m -= 1;
  return Math.max(0, Math.min(12, m));
};

const difficultyOf = (qs) => {
  if (!qs || qs.a === 0) return "sin_clasificar";
  const r = qs.c / qs.a;
  if (r >= 0.75) return "facil";
  if (r >= 0.4) return "media";
  return "dificil";
};
const recencyOf = (qs) => {
  if (!qs || qs.a === 0) return "nunca";
  const days = daysBetween(qs.ls, todayS());
  if (days >= 30) return "mas30";
  if (days >= 7) return "mas7";
  return "reciente";
};

// ═══════════════════════════════════════════════════════════
// NORMALIZADOR DE PREGUNTAS IMPORTADAS
// Acepta dos formatos:
//  A) Formato compacto (el del BANK original): {id, s, t, origen, convocatoria, pa, e, o:{a,b,c,d}, c, x, r}
//  B) Formato del prompt PIR (JSON generado): {tema, asignatura, pregunta, opciones:["1. ...","2. ...",...], respuesta_correcta:1-4, justificacion_tecnica}
// Devuelve siempre el formato compacto.
// ═══════════════════════════════════════════════════════════
const normalizeQuestion = (raw, idx, defaultSubject) => {
  // Formato A: ya es compacto
  if (raw.e && raw.o && raw.c) {
    return {
      id: raw.id || `imp_${Date.now()}_${idx}`,
      s: raw.s || defaultSubject,
      t: Array.isArray(raw.t) ? raw.t : [raw.t || ""],
      origen: raw.origen || "creada",
      convocatoria: raw.convocatoria ?? null,
      pa: raw.pa || null,
      e: raw.e,
      o: raw.o,
      c: raw.c,
      x: raw.x || "",
      r: raw.r || ""
    };
  }
  // Formato B: el del prompt PIR
  if (raw.pregunta && raw.opciones && raw.respuesta_correcta) {
    const opts = raw.opciones;
    const stripPrefix = (s) => String(s).replace(/^\s*\d+\.\s*/, "").trim();
    const o = {
      a: stripPrefix(opts[0] || ""),
      b: stripPrefix(opts[1] || ""),
      c: stripPrefix(opts[2] || ""),
      d: stripPrefix(opts[3] || "")
    };
    const cMap = { 1:"a", 2:"b", 3:"c", 4:"d" };
    return {
      id: raw.id || `imp_${Date.now()}_${idx}`,
      s: raw.asignatura || defaultSubject,
      t: Array.isArray(raw.tema) ? raw.tema : [raw.tema],
      origen: raw.origen || "creada",
      convocatoria: raw.convocatoria ?? null,
      pa: raw.pregunta_abierta || raw.pa || null,
      e: raw.pregunta,
      o,
      c: cMap[raw.respuesta_correcta] || "a",
      x: raw.justificacion_tecnica || raw.x || "",
      r: raw.referencias || raw.r || ""
    };
  }
  return null;
};

// ═══════════════════════════════════════════════════════════
// VALIDADOR DE CALIDAD — analiza un bloque de preguntas (formato compacto)
// y devuelve un informe estructurado por los 8 ejes.
// ═══════════════════════════════════════════════════════════
const FV_REGEX = /\b(se[ñn]ale|indique|marque)\s+la\s+(afirmaci[oó]n\s+)?(verdadera|falsa|correcta|incorrecta)/i;
const YEAR_REGEX = /\b(18|19|20)\d{2}\b/;
const AUTHOR_REGEX = /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*(?:,\s+\d{4}|\s+\(\d{4}\)|\s+et\s+al\.,?\s+\d{4})/u;
const MANUAL_REGEX = /\b(seg[uú]n\s+(belloch|vallejo|caballo|mar[ií]no\s+p[eé]rez|apir|cede|isep)|en\s+el\s+manual|cap[ií]tulo\s+\d+|p[aá]g\.\s*\d+|p\.\s*\d+|tema\s+\d+)\b/i;
const INTERNAL_REF_REGEX = /\b(como\s+vimos|antes\s+mencionado|ya\s+mencionado|en\s+el\s+tema\s+anterior|recuerda\s+que)\b/i;

const validateBlock = (questions) => {
  const n = questions.length;
  if (n === 0) return null;

  const report = {
    n_total: n,
    ejes: {},
    score_global: 0,
    apto: false,
    detalles: { por_pregunta: [] }
  };

  // ─── E3: equilibrio de longitud ───
  let imbalanced = [];
  let correct_longest_count = 0;
  questions.forEach((q, i) => {
    const opts = q.o ? Object.values(q.o) : [];
    if (opts.length !== 4) return;
    const lens = opts.map(o => String(o).length);
    const correctIdx = ["a","b","c","d"].indexOf(q.c);
    if (correctIdx < 0) return;
    const correctLen = lens[correctIdx];
    const others = lens.filter((_, idx) => idx !== correctIdx);
    const avgOthers = others.reduce((a,b)=>a+b, 0) / 3;
    const ratio = avgOthers > 0 ? correctLen / avgOthers : 1;
    if (correctLen === Math.max(...lens)) correct_longest_count++;
    if (ratio > 1.25) {
      imbalanced.push({ idx: i+1, ratio: ratio.toFixed(2), correct_len: correctLen, avg_others: Math.round(avgOthers) });
    }
  });
  const e3_pct_longest = correct_longest_count / n * 100;
  report.ejes.E3_longitud = {
    nombre: "Equilibrio de longitud",
    estado: imbalanced.length === 0 && e3_pct_longest <= 35 ? "ok" : imbalanced.length <= n * 0.15 ? "warn" : "fail",
    detalle: `Correcta es la más larga: ${correct_longest_count}/${n} (${e3_pct_longest.toFixed(0)}%, esperado ~25%). Desequilibradas (>25% más larga): ${imbalanced.length}.`,
    items: imbalanced.slice(0, 5)
  };

  // ─── E4: posición correcta ───
  const positions = [0, 0, 0, 0];
  questions.forEach(q => {
    const idx = ["a","b","c","d"].indexOf(q.c);
    if (idx >= 0) positions[idx]++;
  });
  const expected = n / 4;
  const max_dev = Math.max(...positions.map(p => Math.abs(p - expected)));
  const e4_ok = max_dev <= expected * 0.6;
  report.ejes.E4_posicion = {
    nombre: "Distribución de posición correcta",
    estado: e4_ok ? "ok" : "fail",
    detalle: `Posiciones 1:${positions[0]}  2:${positions[1]}  3:${positions[2]}  4:${positions[3]} (esperado ~${expected.toFixed(1)} cada una).`,
    items: []
  };

  // ─── E5: justificaciones autor + año ───
  let no_year = 0;
  let no_author = 0;
  let too_short = 0;
  let too_long = 0;
  questions.forEach((q, i) => {
    const just = q.x || "";
    if (!YEAR_REGEX.test(just)) no_year++;
    if (!AUTHOR_REGEX.test(just)) no_author++;
    if (just.length < 200) too_short++;
    if (just.length > 900) too_long++;
  });
  const e5_ok = no_year <= n * 0.1 && too_short <= n * 0.15;
  report.ejes.E5_justificacion = {
    nombre: "Justificaciones (autor+año, longitud)",
    estado: e5_ok ? "ok" : (no_year + too_short > n * 0.3 ? "fail" : "warn"),
    detalle: `Sin año: ${no_year}/${n}. Sin autor reconocible: ${no_author}/${n}. Demasiado cortas (<200): ${too_short}. Demasiado largas (>900): ${too_long}.`,
    items: []
  };

  // ─── E6: proporción FALSA/VERDADERA ───
  const fv_count = questions.filter(q => FV_REGEX.test(q.e || "")).length;
  const fv_pct = fv_count / n * 100;
  const e6_ok = fv_pct >= 10 && fv_pct <= 35;
  report.ejes.E6_falsa_verdadera = {
    nombre: "Proporción FALSA/VERDADERA",
    estado: e6_ok ? "ok" : "warn",
    detalle: `${fv_count}/${n} preguntas (${fv_pct.toFixed(0)}%). Objetivo ~20%.`,
    items: []
  };

  // ─── E7: pregunta_abierta ───
  let no_pa = 0;
  let bad_pa_fv = 0;
  questions.forEach((q, i) => {
    if (!q.pa) { no_pa++; return; }
    // Si la pregunta original es FV, comprobar que la pa NO replica el formato
    if (FV_REGEX.test(q.e || "") && FV_REGEX.test(q.pa)) {
      bad_pa_fv++;
    }
  });
  const e7_ok = no_pa === 0 && bad_pa_fv === 0;
  report.ejes.E7_pregunta_abierta = {
    nombre: "Pregunta abierta (recall)",
    estado: e7_ok ? "ok" : (no_pa > n * 0.5 ? "fail" : "warn"),
    detalle: `Con pregunta_abierta: ${n - no_pa}/${n}. Sin pregunta_abierta: ${no_pa}. ${bad_pa_fv > 0 ? `⚠️ ${bad_pa_fv} replican formato FALSA/VERDADERA (irresolubles sin opciones).` : ""}`,
    items: []
  };

  // ─── E8: anonimización ───
  let manual_mentions = 0;
  let internal_refs = 0;
  questions.forEach((q, i) => {
    const text = (q.e || "") + " " + (q.x || "");
    if (MANUAL_REGEX.test(text)) manual_mentions++;
    if (INTERNAL_REF_REGEX.test(text)) internal_refs++;
  });
  const e8_ok = manual_mentions === 0 && internal_refs === 0;
  report.ejes.E8_anonimizacion = {
    nombre: "Anonimización",
    estado: e8_ok ? "ok" : "warn",
    detalle: `Menciones a manuales: ${manual_mentions}. Referencias internas: ${internal_refs}.`,
    items: []
  };

  // ─── E1, E2: requieren lectura humana ───
  report.ejes.E1_fidelidad = {
    nombre: "Fidelidad académica",
    estado: "manual",
    detalle: "Requiere lectura humana: ¿la opción correcta es realmente correcta? El validador no puede juzgarlo.",
    items: []
  };
  report.ejes.E2_distractores = {
    nombre: "Calidad de distractores",
    estado: "manual",
    detalle: "Requiere lectura humana: ¿son plausibles? ¿usan autores reales del campo?",
    items: []
  };

  // ─── Score global (sobre los ejes automatizables: E3, E4, E5, E6, E7, E8) ───
  const auto_ejes = ["E3_longitud", "E4_posicion", "E5_justificacion", "E6_falsa_verdadera", "E7_pregunta_abierta", "E8_anonimizacion"];
  let score = 0;
  auto_ejes.forEach(k => {
    const e = report.ejes[k].estado;
    if (e === "ok") score += 100/6;
    else if (e === "warn") score += 50/6;
    // fail: 0
  });
  report.score_global = Math.round(score);
  report.apto = report.score_global >= 70 && !auto_ejes.some(k => report.ejes[k].estado === "fail");

  return report;
};

export default function Angie(){
  const[tab,setTab]=useState("home");
  const[step,setStep]=useState(1);
  const[subject,setSubject]=useState("");
  const[selTopics,setSelTopics]=useState([]);
  const[fEstado,setFEstado]=useState("todas");
  const[fDificultad,setFDificultad]=useState("todas");
  const[fRecencia,setFRecencia]=useState("todas");
  const[fOrigen,setFOrigen]=useState("todas");
  const[fConvocatoria,setFConvocatoria]=useState("todas");
  const[numQ,setNumQ]=useState(25);
  const[questions,setQuestions]=useState([]);
  const[answers,setAnswers]=useState({});
  const[curQ,setCurQ]=useState(0);
  const[showExpl,setShowExpl]=useState({});
  const examMeta=useRef({subject:"",topics:[]});
  const[deck,setDeck]=useState([]);
  const[stats,setStats]=useState({});
  const[qstats,setQstats]=useState({});
  const[fcIdx,setFcIdx]=useState(0);
  const[homeIdx,setHomeIdx]=useState(0);
  const[flipped,setFlipped]=useState(false);
  const[err,setErr]=useState("");
  const[toast,setToast]=useState("");

  // BANCO en estado (cargado desde window.storage)
  const[bank,setBank]=useState([]);
  const[bankLoading,setBankLoading]=useState(true);

  // Estado de la pestaña Importar
  const[impSubject,setImpSubject]=useState("Clínica Adultos");
  const[impText,setImpText]=useState("");
  const[impPreview,setImpPreview]=useState(null);
  const[impMsg,setImpMsg]=useState("");
  const[impReport,setImpReport]=useState(null);
  const[bankSizes,setBankSizes]=useState({});

  // Estado del generador de flashcards desde banco
  const[fcGenSubject,setFcGenSubject]=useState("Clínica Adultos");
  const[fcGenTopic,setFcGenTopic]=useState("__all__"); // "__all__" o nombre de tema
  const[fcGenSkipExisting,setFcGenSkipExisting]=useState(true);

  // ───────────────────────────────────────────────
  // CARGA INICIAL DE BANCOS (versión SAFE sin migración + timeout + diag)
  // ───────────────────────────────────────────────
  const[loadDiag,setLoadDiag]=useState({stage:"init", details:[], error:null});

  useEffect(()=>{
    let timeoutId = null;
    let cancelled = false;

    (async()=>{
      const details = [];
      const log = (msg) => {
        details.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
        if (!cancelled) setLoadDiag(d => ({...d, details:[...details]}));
      };

      // Timeout global de 15s: si tarda más, libera la pantalla
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        log("⏱️ TIMEOUT 15s — liberando pantalla forzosamente");
        setBankLoading(false);
        setLoadDiag(d => ({...d, stage:"timeout"}));
      }, 15000);

      try {
        log("Inicio carga");
        setLoadDiag(d => ({...d, stage:"deck"}));

        log("Cargando deck…");
        const d = await load(K.deck,[]).catch(e => { log("⚠️ deck error: "+e); return []; });
        if (!cancelled) setDeck(d);

        log("Cargando stats…");
        const s = await load(K.stats,{}).catch(e => { log("⚠️ stats error: "+e); return {}; });
        if (!cancelled) setStats(s);

        log("Cargando qstats…");
        const qs = await load(K.qstats,{}).catch(e => { log("⚠️ qstats error: "+e); return {}; });
        if (!cancelled) setQstats(qs);

        // Cargar bancos UNO A UNO (no paralelo) con try/catch individual
        const all = [];
        const sizes = {};
        const subjs = Object.keys(SUBJECTS);
        for (let i = 0; i < subjs.length; i++) {
          if (cancelled) return;
          const subj = subjs[i];
          const k = subjectKey(subj);
          log(`(${i+1}/${subjs.length}) ${subj} → ${k}`);
          setLoadDiag(d => ({...d, stage:`subject ${i+1}/${subjs.length}: ${subj}`}));
          try {
            const arr = await load(k, []);
            if (Array.isArray(arr)) {
              all.push(...arr);
              sizes[subj] = arr.length;
              log(`  ✓ ${arr.length} preguntas`);
            } else {
              sizes[subj] = 0;
              log("  ⚠️ no es array");
            }
          } catch (err) {
            sizes[subj] = 0;
            log(`  ❌ ERROR: ${err}`);
          }
        }

        if (cancelled) return;
        log(`Total: ${all.length} preguntas en ${Object.keys(sizes).length} asignaturas`);
        setBank(all);
        setBankSizes(sizes);
        setBankLoading(false);
        setLoadDiag(d => ({...d, stage:"done"}));
        if (timeoutId) clearTimeout(timeoutId);
      } catch (err) {
        log(`❌ ERROR FATAL: ${err}`);
        if (!cancelled) {
          setLoadDiag(d => ({...d, stage:"error", error:String(err)}));
          setBankLoading(false);
        }
        if (timeoutId) clearTimeout(timeoutId);
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  },[]);

  const saveDeck = async d => { setDeck(d); await save(K.deck,d); };
  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),3000); };

  // ───────────────────────────────────────────────
  // GUARDA UNA ASIGNATURA EN STORAGE Y REFRESCA EL BANK COMPLETO
  // ───────────────────────────────────────────────
  const persistSubject = async (subj, questions) => {
    const k = subjectKey(subj);
    const ok = await save(k, questions);
    if (!ok) return false;
    // Recompone el bank: quita las preguntas de esa asignatura y mete las nuevas
    setBank(prev => [...prev.filter(q => q.s !== subj), ...questions]);
    setBankSizes(prev => ({...prev, [subj]: questions.length}));
    return true;
  };

  const updateStats = async (subj,tops,correct,total) => {
    const s={...stats};
    if(!s[subj]) s[subj]={};
    const share = tops.length;
    tops.forEach(t=>{
      if(!s[subj][t]) s[subj][t]={correct:0,total:0,sessions:[]};
      const c = Math.round(correct/share), tt = Math.round(total/share);
      s[subj][t].correct += c;
      s[subj][t].total += tt;
      s[subj][t].sessions = [...(s[subj][t].sessions||[]), {date:todayS(),correct:c,total:tt}].slice(-50);
    });
    setStats(s); await save(K.stats,s);
  };

  const updateQStats = async (qList, ansMap) => {
    const next = {...qstats};
    qList.forEach((q,i) => {
      if (!q.id) return;
      const prev = next[q.id] || { a:0, c:0, ls:null };
      const wasCorrect = ansMap[i] === q.c;
      next[q.id] = { a: prev.a + 1, c: prev.c + (wasCorrect ? 1 : 0), ls: todayS() };
    });
    setQstats(next); await save(K.qstats, next);
  };

  const buildPool = (subj, tops, filters) => {
    return bank.filter(q => {
      if (subj && q.s !== subj) return false;
      if (tops.length > 0 && !tops.some(t => q.t.includes(t))) return false;
      const qs = qstats[q.id];
      if (filters.estado === "falladas") {
        if (!qs || qs.a === 0) return false;
        if (qs.c / qs.a >= 0.5) return false;
      }
      if (filters.estado === "no_vistas") { if (qs && qs.a > 0) return false; }
      if (filters.dificultad !== "todas") { if (difficultyOf(qs) !== filters.dificultad) return false; }
      if (filters.recencia !== "todas") { if (recencyOf(qs) !== filters.recencia) return false; }
      if (filters.origen !== "todas") { if (q.origen !== filters.origen) return false; }
      if (filters.convocatoria !== "todas") { if (String(q.convocatoria) !== filters.convocatoria) return false; }
      return true;
    });
  };

  const availableYears = useMemo(() => {
    const ys = new Set();
    bank.forEach(q => {
      if (q.origen !== "oficial" || q.convocatoria == null) return;
      if (subject && q.s !== subject) return;
      if (selTopics.length > 0 && !selTopics.some(t => q.t.includes(t))) return;
      ys.add(q.convocatoria);
    });
    return [...ys].sort((a,b) => b-a);
  }, [subject, selTopics, bank]);

  const poolCount = useMemo(() => {
    if (!subject || selTopics.length === 0) return 0;
    return buildPool(subject, selTopics, { estado: fEstado, dificultad: fDificultad, recencia: fRecencia, origen: fOrigen, convocatoria: fConvocatoria }).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, selTopics, fEstado, fDificultad, fRecencia, fOrigen, fConvocatoria, qstats, bank]);

  const bankCount = (subj, tops=[]) =>
    bank.filter(q => q.s===subj && (tops.length===0 || tops.some(t=>q.t.includes(t)))).length;

  const generate = () => {
    if (!subject) { setErr("Selecciona una asignatura."); return; }
    if (selTopics.length === 0) { setErr("Selecciona al menos un tema."); return; }
    const pool = buildPool(subject, selTopics, { estado: fEstado, dificultad: fDificultad, recencia: fRecencia, origen: fOrigen, convocatoria: fConvocatoria });
    if (pool.length === 0) { setErr("No hay preguntas con esos filtros. Prueba a ampliar criterios."); return; }
    setErr("");
    examMeta.current = { subject, topics:[...selTopics] };
    const examSize = numQ === "todas" ? pool.length : numQ;
    const shuffled = [...pool].sort(()=>Math.random()-0.5).slice(0, examSize);
    const tagged = shuffled.map((q,i) => ({ ...q, numero: i+1, _subject: q.s, _topics: q.t }));
    setQuestions(tagged); setAnswers({}); setCurQ(0); setShowExpl({}); setTab("exam");
  };

  const score = questions.filter((q,i)=>answers[i]===q.c).length;
  const failed = questions.filter((q,i)=>answers[i]!==q.c);
  const pct = questions.length ? Math.round(score/questions.length*100) : 0;

  const submitExam = async () => {
    if (Object.keys(answers).length < questions.length) {
      setErr(`Faltan ${questions.length-Object.keys(answers).length} preguntas.`); return;
    }
    setErr("");
    const { subject:s, topics:t } = examMeta.current;
    if (s && t.length) await updateStats(s,t,score,questions.length);
    await updateQStats(questions, answers);
    setTab("results"); setCurQ(0);
  };

  const addToDeck = async () => {
    const ex = new Set(deck.map(c=>c.id));
    const news = failed.filter(q => !ex.has(q.id)).map(q => ({ ...q, box:0, correctStreak:0, next_review:todayS(), learned:false, added:todayS() }));
    if (!news.length) { showToast("Ya están todas en el mazo ✓"); return; }
    await saveDeck([...deck, ...news]);
    showToast(`✅ ${news.length} tarjetas añadidas`);
  };

  // Añade preguntas del banco al mazo según filtros (asignatura + tema opcional)
  const addBankSubsetToDeck = async () => {
    const subj = fcGenSubject;
    const topic = fcGenTopic;
    const pool = bank.filter(q => {
      if (q.s !== subj) return false;
      if (topic !== "__all__" && !(q.t || []).includes(topic)) return false;
      return true;
    });
    if (pool.length === 0) {
      showToast("No hay preguntas con esos filtros");
      return;
    }
    const existingIds = new Set(deck.map(c => c.id));
    const candidates = fcGenSkipExisting
      ? pool.filter(q => !existingIds.has(q.id))
      : pool.filter(q => !existingIds.has(q.id)); // siempre evitamos duplicados por id
    if (candidates.length === 0) {
      showToast("Todas estas preguntas ya están en el mazo ✓");
      return;
    }
    const newCards = candidates.map(q => ({
      ...q,
      box: 0,
      correctStreak: 0,
      next_review: todayS(),
      learned: false,
      added: todayS()
    }));
    await saveDeck([...deck, ...newCards]);
    showToast(`✅ ${newCards.length} tarjetas añadidas al mazo${fcGenSkipExisting && pool.length > newCards.length ? ` (${pool.length - newCards.length} ya estaban)` : ""}`);
  };

  const due = deck.filter(c=>!c.learned && c.next_review<=todayS());
  const pending = deck.filter(c=>!c.learned && c.next_review>todayS());
  const learnedCards = deck.filter(c=>c.learned);
  const fcCard = due[fcIdx % Math.max(due.length,1)];

  const handleFC = async correct => {
    if (!fcCard) return;
    const upd = deck.map(c => {
      if (c.id !== fcCard.id) return c;
      if (correct) {
        const st = c.correctStreak + 1;
        if (st >= LEARN_N) return {...c, learned:true, correctStreak:st};
        const box = Math.min(c.box+1, SR_INT.length-1);
        return {...c, box, correctStreak:st, next_review:addDays(todayS(),SR_INT[box])};
      }
      return {...c, box:0, correctStreak:0, next_review:addDays(todayS(),SR_INT[0])};
    });
    await saveDeck(upd); setFlipped(false);
    const nd = upd.filter(c=>!c.learned && c.next_review<=todayS());
    setFcIdx(i => nd.length ? i % nd.length : 0);
  };

  const getTS = (subj,t) => stats[subj]?.[t] || {correct:0,total:0};
  const subjTotal = subj => Object.values(stats[subj]||{}).reduce(
    (a,t)=>({correct:a.correct+t.correct, total:a.total+t.total}), {correct:0,total:0}
  );
  const colorOf = p => p>=80 ? C.ok : p>=60 ? C.warn : C.err;

  // ───────────────────────────────────────────────
  // IMPORTAR: parsear y previsualizar
  // ───────────────────────────────────────────────
  const parseImport = () => {
    setImpMsg("");
    setImpPreview(null);
    setImpReport(null);
    if (!impText.trim()) { setImpMsg("Pega el JSON antes de previsualizar."); return; }
    let data;
    try {
      data = JSON.parse(impText);
    } catch (e) {
      setImpMsg("❌ JSON inválido: " + e.message);
      return;
    }
    if (!Array.isArray(data)) {
      setImpMsg("❌ El JSON debe ser un array de preguntas.");
      return;
    }
    const normalized = [];
    const errors = [];
    data.forEach((raw, i) => {
      const n = normalizeQuestion(raw, i, impSubject);
      if (!n) { errors.push(i+1); return; }
      // Forzar la asignatura seleccionada en el importador
      n.s = impSubject;
      normalized.push(n);
    });
    if (normalized.length === 0) {
      setImpMsg(`❌ Ninguna pregunta válida. Errores en filas: ${errors.join(", ")}`);
      return;
    }
    setImpPreview({ normalized, errors, subject: impSubject });
    // Ejecutar validación de calidad
    const rep = validateBlock(normalized);
    setImpReport(rep);
    setImpMsg(`✓ ${normalized.length} preguntas listas. ${errors.length ? "⚠ "+errors.length+" descartadas." : ""}`);
  };

  const confirmImport = async (mode) => {
    if (!impPreview) return;
    const k = subjectKey(impPreview.subject);
    const existing = await load(k, []);
    let merged;
    if (mode === "replace") {
      merged = impPreview.normalized;
    } else {
      // append: deduplicar por id
      const ids = new Set(existing.map(q => q.id));
      const fresh = impPreview.normalized.filter(q => !ids.has(q.id));
      merged = [...existing, ...fresh];
    }
    const ok = await persistSubject(impPreview.subject, merged);
    if (!ok) {
      setImpMsg("❌ Error al guardar (¿supera 5 MB? prueba a dividir el bloque)");
      return;
    }
    showToast(`✅ Banco "${impPreview.subject}" actualizado: ${merged.length} preguntas totales`);
    setImpText("");
    setImpPreview(null);
    setImpReport(null);
    setImpMsg("");
  };

  const clearSubject = async (subj) => {
    if (!confirm(`¿Borrar TODAS las preguntas de "${subj}"? Esta acción no se puede deshacer.`)) return;
    await persistSubject(subj, []);
    showToast(`🗑️ "${subj}" vaciado`);
  };

  const exportSubject = async (subj) => {
    const k = subjectKey(subj);
    const arr = await load(k, []);
    if (arr.length === 0) { showToast("No hay preguntas para exportar"); return; }
    const json = JSON.stringify(arr, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showToast(`📋 ${arr.length} preguntas copiadas al portapapeles`);
    } catch {
      // Fallback: mostrar en el textarea
      setImpText(json);
      setImpSubject(subj);
      showToast("📋 Copiado al campo de importación");
    }
  };

  // ───────────────────────────────────────────────
  // ESTILOS
  // ───────────────────────────────────────────────
  const card = (x={}) => ({ background:C.surface, borderRadius:22, padding:"22px 24px", boxShadow:"0 1px 2px rgba(20,15,60,.04), 0 8px 24px rgba(76,29,149,.07)", border:`1px solid ${C.line}`, ...x });
  const pillBtn = (active, opts={}) => ({ padding: opts.pad || "10px 18px", borderRadius:999, border:"none", background: active ? C.v700 : (opts.ghost ? "transparent" : C.v50), color: active ? "#fff" : C.v700, fontWeight: active ? 700 : 600, cursor:"pointer", fontSize: opts.size || 13, fontFamily:"inherit", transition:"all .18s ease", letterSpacing:.1 });
  const softBtn = (selected, color=C.v500) => ({ padding:"11px 16px", borderRadius:14, border:`1.5px solid ${selected?color:C.line}`, background: selected ? `${color}11` : C.surface, color: selected ? color : C.ink, fontWeight: selected ? 700 : 500, cursor:"pointer", fontSize:13, fontFamily:"inherit", transition:"all .15s" });
  const tagChip = (kind="lilac") => {
    const map = { peach:{bg:C.peach,ink:C.peachInk}, lilac:{bg:C.lilac,ink:C.lilacInk}, navy:{bg:C.v100,ink:C.v700} }[kind];
    return { display:"inline-flex", alignItems:"center", padding:"4px 11px", borderRadius:999, background:map.bg, color:map.ink, fontSize:10.5, fontWeight:800, letterSpacing:.8, textTransform:"uppercase" };
  };
  const filterRow = (label, value, options, setter) => (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>{label}</div>
      <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
        {options.map(o => (
          <button key={o.id} onClick={()=>setter(o.id)} style={pillBtn(value===o.id, {pad:"7px 14px", size:12})}>{o.label}</button>
        ))}
      </div>
    </div>
  );

  const Toast = () => toast ? (
    <div style={{position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:C.navy, color:"#fff", padding:"12px 22px", borderRadius:50, fontSize:13, fontWeight:600, zIndex:9999, boxShadow:"0 10px 30px rgba(27,22,64,.4)", whiteSpace:"nowrap"}}>{toast}</div>
  ) : null;

  const Header = () => {
    const cinzel = "'Cinzel', 'Times New Roman', serif";
    const fillPct = pirYearProgress();
    const months = monthsSinceLastPIR();
    const tooltip = months >= 12 ? "¡Año completo! Próximo PIR en breve" : `${months}/12 meses desde el último PIR (24 ene)`;
    return (
      <div style={{position:"relative", background:"linear-gradient(90deg, #2D165E 0%, #4A268A 100%)", borderRadius:18, padding:"14px 20px", marginBottom:14, overflow:"hidden", boxShadow:"0 8px 22px rgba(45,22,94,.35)"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&display=swap');`}</style>
        <svg viewBox="0 0 540 90" preserveAspectRatio="xMidYMid slice" style={{position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.22, filter:"blur(1.2px)", pointerEvents:"none"}}>
          <g stroke="#fff" strokeWidth="0.45" fill="#fff" fillOpacity="0.92">
            <line x1="25" y1="22" x2="75" y2="58"/><line x1="75" y1="58" x2="125" y2="20"/><line x1="125" y1="20" x2="170" y2="62"/><line x1="170" y1="62" x2="215" y2="18"/><line x1="215" y1="18" x2="260" y2="50"/><line x1="260" y1="50" x2="300" y2="74"/><line x1="300" y1="74" x2="335" y2="25"/><line x1="335" y1="25" x2="380" y2="58"/><line x1="380" y1="58" x2="420" y2="18"/><line x1="420" y1="18" x2="460" y2="50"/><line x1="460" y1="50" x2="500" y2="74"/><line x1="500" y1="74" x2="525" y2="30"/>
            <line x1="50" y1="78" x2="125" y2="20"/><line x1="125" y1="20" x2="170" y2="14"/><line x1="215" y1="18" x2="260" y2="10"/><line x1="335" y1="25" x2="380" y2="14"/><line x1="170" y1="62" x2="260" y2="50"/><line x1="260" y1="50" x2="335" y2="25"/><line x1="380" y1="58" x2="460" y2="50"/><line x1="50" y1="78" x2="170" y2="62"/><line x1="170" y1="62" x2="300" y2="74"/><line x1="300" y1="74" x2="420" y2="78"/><line x1="420" y1="78" x2="500" y2="74"/><line x1="125" y1="20" x2="215" y2="18"/><line x1="335" y1="25" x2="420" y2="18"/><line x1="25" y1="22" x2="125" y2="20"/>
            <circle cx="25" cy="22" r="1.8"/><circle cx="75" cy="58" r="1.8"/><circle cx="125" cy="20" r="1.8"/><circle cx="170" cy="62" r="1.8"/><circle cx="215" cy="18" r="1.8"/><circle cx="260" cy="50" r="1.8"/><circle cx="300" cy="74" r="1.8"/><circle cx="335" cy="25" r="1.8"/><circle cx="380" cy="58" r="1.8"/><circle cx="420" cy="18" r="1.8"/><circle cx="460" cy="50" r="1.8"/><circle cx="500" cy="74" r="1.8"/><circle cx="525" cy="30" r="1.8"/>
            <circle cx="50" cy="78" r="1.5"/><circle cx="170" cy="14" r="1.5"/><circle cx="260" cy="10" r="1.5"/><circle cx="380" cy="14" r="1.5"/><circle cx="420" cy="78" r="1.5"/>
          </g>
        </svg>
        <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span style={{fontFamily:cinzel, fontWeight:900, fontSize:24, letterSpacing:1.5, lineHeight:1, color:"#fff"}}>R0 PIR</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div title={tooltip} style={{position:"relative", width:120, height:22, borderRadius:999, background:"rgba(0,0,0,.45)", border:"2px solid #C0C0C0", overflow:"hidden", boxShadow:"0 0 8px rgba(192,192,192,.35), inset 0 1px 4px rgba(0,0,0,.6)", cursor:"help"}}>
              <div style={{position:"absolute", top:0, bottom:0, left:0, width:`${fillPct}%`, background:"linear-gradient(90deg, #1E40AF 0%, #10B981 100%)", borderRadius:999}}/>
              <div style={{position:"absolute", top:2, left:5, right:5, height:"38%", background:"linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 100%)", borderRadius:999, pointerEvents:"none"}}/>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:4}}>
              <span style={{fontFamily:cinzel, fontWeight:700, fontSize:15, color:"#C0C0C0", letterSpacing:1, textShadow:"0 1px 2px rgba(0,0,0,.5)"}}>R1</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#D4D4D8"><path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/></svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs_cfg = [
    {id:"home", l:"Inicio"},
    {id:"exam", l:"Examen", d:!questions.length},
    {id:"results", l:"Resultados", d:!questions.length},
    {id:"flashcards", l:`Mazo${due.length?` · ${due.length}`:""}`},
    {id:"stats", l:"Progreso"},
    {id:"import", l:"Importar"}
  ];

  const TabBar = () => (
    <div style={{display:"flex", gap:4, padding:5, background:C.surface, border:`1px solid ${C.line}`, borderRadius:999, marginBottom:16, overflowX:"auto", boxShadow:"0 1px 2px rgba(20,15,60,.03)"}}>
      {tabs_cfg.map(t => (
        <button key={t.id} onClick={()=>!t.d && setTab(t.id)} disabled={t.d}
          style={{...pillBtn(tab===t.id, {pad:"8px 16px", size:12.5, ghost:true}), opacity: t.d ? .3 : 1, cursor: t.d ? "not-allowed" : "pointer", whiteSpace:"nowrap", flex:"0 0 auto"}}>
          {t.l}
        </button>
      ))}
    </div>
  );

  const wrap = ch => (
    <div style={{fontFamily:"'Inter','Segoe UI',system-ui,-apple-system,sans-serif", maxWidth:820, margin:"0 auto", padding:"16px 14px", color:C.ink, background:C.bg, minHeight:"100vh"}}>
      <Header/><TabBar/><Toast/>{ch}
    </div>
  );

  // Mientras carga el banco, muestra loader CON DIAGNÓSTICO EN VIVO
  if (bankLoading) return wrap(
    <div style={card({padding:24})}>
      <div style={{textAlign:"center", marginBottom:18}}>
        <div style={{fontSize:32}}>⏳</div>
        <div style={{marginTop:10, color:C.ink, fontWeight:700, fontSize:15}}>Cargando banco de preguntas…</div>
        <div style={{marginTop:4, color:C.muted, fontSize:12}}>{loadDiag.stage}</div>
      </div>

      <div style={{padding:12, background:"#0F172A", borderRadius:10, fontFamily:"ui-monospace, monospace", fontSize:11, color:"#86EFAC", maxHeight:240, overflowY:"auto", lineHeight:1.5}}>
        {loadDiag.details.length === 0
          ? <div style={{color:"#6B7280"}}>Esperando inicio…</div>
          : loadDiag.details.map((line, i) => <div key={i}>{line}</div>)
        }
      </div>

      <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:8}}>
        <button
          onClick={() => { setBankLoading(false); setBank([]); setBankSizes({}); }}
          style={{...pillBtn(true, {pad:"10px 18px"}), background:C.warn, width:"100%"}}
        >
          🚨 SALTAR carga (entrar con banco vacío)
        </button>
        <div style={{fontSize:11, color:C.muted, textAlign:"center", lineHeight:1.5}}>
          Si lleva más de 15s atascado, pulsa el botón para entrar a la app.
          Tus preguntas no se borran, solo no se cargarán en esta sesión.
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────
  // PESTAÑA: IMPORTAR
  // ───────────────────────────────────────────────
  if (tab === "import") return wrap(
    <div>
      <div style={card({marginBottom:14})}>
        <div style={{fontWeight:900, fontSize:17, color:C.ink, marginBottom:6}}>📥 Importar preguntas</div>
        <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14}}>
          Pega el JSON generado por el prompt PIR. Acepta tanto el formato del prompt
          (<code style={{background:C.v50, padding:"1px 5px", borderRadius:4}}>tema, asignatura, pregunta, opciones, respuesta_correcta, justificacion_tecnica</code>)
          como el formato compacto (<code style={{background:C.v50, padding:"1px 5px", borderRadius:4}}>id, s, t, e, o, c, x, r</code>).
        </div>

        <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Asignatura destino</div>
        <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14}}>
          {Object.keys(SUBJECTS).map(s => (
            <button key={s} onClick={()=>setImpSubject(s)} style={pillBtn(impSubject===s, {pad:"7px 14px", size:12})}>{s}</button>
          ))}
        </div>

        <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>JSON</div>
        <textarea
          value={impText}
          onChange={e => setImpText(e.target.value)}
          placeholder='[{"tema":"...","asignatura":"...","pregunta":"...","opciones":["1. ...","2. ...","3. ...","4. ..."],"respuesta_correcta":1,"justificacion_tecnica":"..."}]'
          style={{
            width:"100%", minHeight:200, padding:12, borderRadius:12,
            border:`1.5px solid ${C.line}`, fontFamily:"ui-monospace, monospace",
            fontSize:12, lineHeight:1.5, resize:"vertical", color:C.ink,
            background:C.bg, outline:"none"
          }}
        />

        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <button onClick={parseImport} style={pillBtn(true, {pad:"10px 20px"})}>👁 Previsualizar</button>
          <button onClick={()=>{setImpText(""); setImpPreview(null); setImpReport(null); setImpMsg("");}} style={pillBtn(false, {pad:"10px 16px", ghost:true})}>Limpiar</button>
        </div>

        {impMsg && (
          <div style={{
            marginTop:12, padding:11, borderRadius:11,
            background: impMsg.startsWith("❌") ? "#FEF2F2" : impMsg.startsWith("✓") ? "#F0FDF4" : C.v50,
            border:`1px solid ${impMsg.startsWith("❌") ? C.err+"55" : impMsg.startsWith("✓") ? C.ok+"55" : C.v200}`,
            color: impMsg.startsWith("❌") ? C.err : impMsg.startsWith("✓") ? "#065F46" : C.v700,
            fontSize:13, fontWeight:600
          }}>{impMsg}</div>
        )}

        {impReport && (() => {
          const r = impReport;
          const stateColors = {
            ok: { bg: "#F0FDF4", border: C.ok, text: "#065F46", icon: "✅" },
            warn: { bg: "#FFFBEB", border: C.warn, text: "#92400E", icon: "⚠️" },
            fail: { bg: "#FEF2F2", border: C.err, text: "#7F1D1D", icon: "❌" },
            manual: { bg: C.v50, border: C.v300, text: C.v700, icon: "👁️" }
          };
          const scoreColor = r.score_global >= 85 ? C.ok : r.score_global >= 70 ? C.warn : C.err;
          const scoreLabel = r.score_global >= 85 ? "✅ APTO PARA IMPORTAR" : r.score_global >= 70 ? "⚠️ APTO CON OBSERVACIONES" : "❌ REVISAR ANTES DE IMPORTAR";
          return (
            <div style={{marginTop:14, padding:16, background:C.surface, borderRadius:14, border:`2px solid ${scoreColor}`, boxShadow:`0 4px 14px ${scoreColor}20`}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8}}>
                <div style={{fontWeight:900, fontSize:15, color:C.ink}}>🔍 Análisis de calidad ({r.n_total} preguntas)</div>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <span style={{fontSize:30, fontWeight:900, color:scoreColor, letterSpacing:-1}}>{r.score_global}</span>
                  <span style={{fontSize:13, fontWeight:700, color:scoreColor}}>/100</span>
                </div>
              </div>
              <div style={{padding:"8px 14px", background:`${scoreColor}15`, borderRadius:10, fontSize:12.5, fontWeight:700, color:scoreColor, marginBottom:14, textAlign:"center"}}>
                {scoreLabel}
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {Object.entries(r.ejes).map(([key, eje]) => {
                  const c = stateColors[eje.estado];
                  return (
                    <div key={key} style={{padding:"10px 12px", background:c.bg, borderRadius:10, border:`1px solid ${c.border}40`}}>
                      <div style={{display:"flex", justifyContent:"space-between", gap:8, alignItems:"flex-start", flexWrap:"wrap"}}>
                        <div style={{flex:1, minWidth:200}}>
                          <div style={{fontWeight:700, fontSize:13, color:c.text, marginBottom:3}}>
                            {c.icon} {eje.nombre}
                          </div>
                          <div style={{fontSize:11.5, color:c.text, opacity:0.85, lineHeight:1.5}}>{eje.detalle}</div>
                          {eje.items && eje.items.length > 0 && (
                            <div style={{marginTop:6, fontSize:11, color:c.text, opacity:0.8, lineHeight:1.5, fontFamily:"ui-monospace, monospace"}}>
                              {eje.items.map((it, idx) => (
                                <div key={idx}>· Pregunta {it.idx}: ratio {it.ratio}× ({it.correct_len} vs {it.avg_others} chars promedio)</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{marginTop:12, padding:10, background:C.v50, borderRadius:10, fontSize:11.5, color:C.v700, lineHeight:1.6}}>
                <strong>👁️ Ejes manuales (E1, E2):</strong> requieren tu lectura porque no se pueden validar automáticamente.
                Verifica que la respuesta correcta sea realmente correcta y que los distractores sean plausibles.
              </div>
            </div>
          );
        })()}

        {impPreview && (
          <div style={{marginTop:14, padding:14, background:C.v50, borderRadius:14, border:`1px solid ${C.v200}`}}>
            <div style={{fontWeight:800, fontSize:13, color:C.v700, marginBottom:8}}>
              Vista previa: {impPreview.normalized.length} preguntas → {impPreview.subject}
            </div>
            <div style={{maxHeight:180, overflowY:"auto", fontSize:11.5, color:C.muted, lineHeight:1.6}}>
              {impPreview.normalized.slice(0, 5).map((q,i) => (
                <div key={i} style={{padding:"6px 0", borderBottom:`1px solid ${C.v100}`}}>
                  <strong style={{color:C.ink}}>{i+1}.</strong> {q.e.slice(0, 100)}…
                  <div style={{fontSize:10.5, color:C.v500, marginTop:2}}>Tema: {q.t.join(", ")}</div>
                </div>
              ))}
              {impPreview.normalized.length > 5 && <div style={{padding:"6px 0", fontStyle:"italic"}}>… y {impPreview.normalized.length - 5} más</div>}
            </div>
            <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
              <button onClick={()=>confirmImport("append")} style={{...pillBtn(true, {pad:"10px 18px"}), background:C.ok}}>
                ➕ Añadir al banco existente
              </button>
              <button onClick={()=>{
                if (confirm(`¿Reemplazar TODO el banco de "${impPreview.subject}" por estas ${impPreview.normalized.length} preguntas?`)) confirmImport("replace");
              }} style={{...pillBtn(true, {pad:"10px 18px"}), background:C.warn}}>
                🔁 Reemplazar banco completo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── BLOQUE: Generar flashcards desde banco ─── */}
      <div style={card({marginBottom:14})}>
        <div style={{fontWeight:900, fontSize:17, color:C.ink, marginBottom:6}}>🃏 Generar flashcards desde el banco</div>
        <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14}}>
          Añade al mazo todas las preguntas del banco según los filtros que elijas. Cada pregunta se incorpora como flashcard
          con repetición espaciada. Las que ya están en el mazo se omiten automáticamente.
        </div>

        <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Asignatura</div>
        <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14}}>
          {Object.keys(SUBJECTS).filter(s => (bankSizes[s] || 0) > 0).map(s => (
            <button key={s} onClick={()=>{setFcGenSubject(s); setFcGenTopic("__all__");}} style={pillBtn(fcGenSubject===s, {pad:"7px 14px", size:12})}>{s}</button>
          ))}
          {Object.keys(SUBJECTS).filter(s => (bankSizes[s] || 0) > 0).length === 0 && (
            <span style={{fontSize:12, color:C.muted, fontStyle:"italic"}}>Aún no hay preguntas en ningún banco. Importa primero un JSON arriba.</span>
          )}
        </div>

        {(bankSizes[fcGenSubject] || 0) > 0 && (
          <>
            <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Tema</div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, maxHeight:140, overflowY:"auto"}}>
              <button onClick={()=>setFcGenTopic("__all__")} style={pillBtn(fcGenTopic==="__all__", {pad:"7px 14px", size:12})}>
                ✓ Todos los temas
              </button>
              {SUBJECTS[fcGenSubject].filter(t => bank.some(q => q.s === fcGenSubject && (q.t || []).includes(t))).map(t => {
                const count = bank.filter(q => q.s === fcGenSubject && (q.t || []).includes(t)).length;
                return (
                  <button key={t} onClick={()=>setFcGenTopic(t)} style={pillBtn(fcGenTopic===t, {pad:"7px 14px", size:12})}>
                    {t} <span style={{opacity:.7, fontSize:10.5, marginLeft:4}}>({count})</span>
                  </button>
                );
              })}
            </div>

            {(() => {
              const pool = bank.filter(q => q.s === fcGenSubject && (fcGenTopic === "__all__" || (q.t || []).includes(fcGenTopic)));
              const existingIds = new Set(deck.map(c => c.id));
              const newOnes = pool.filter(q => !existingIds.has(q.id)).length;
              const alreadyIn = pool.length - newOnes;
              return (
                <div style={{padding:"10px 14px", background:C.v50, borderRadius:12, marginTop:4, marginBottom:12, fontSize:13, color:C.v700, fontWeight:600, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6}}>
                  <span>📚 {pool.length} disponibles · 🆕 {newOnes} nuevas{alreadyIn > 0 ? ` · ✓ ${alreadyIn} ya en mazo` : ""}</span>
                  <button
                    onClick={addBankSubsetToDeck}
                    disabled={newOnes === 0}
                    style={{...pillBtn(true, {pad:"9px 18px", size:13}), background: newOnes === 0 ? C.muted : `linear-gradient(135deg, ${C.v700}, ${C.v500})`, opacity: newOnes === 0 ? .5 : 1, cursor: newOnes === 0 ? "not-allowed" : "pointer"}}
                  >
                    🃏 Añadir {newOnes} al mazo
                  </button>
                </div>
              );
            })()}
          </>
        )}
      </div>

      <div style={card()}>
        <div style={{fontWeight:800, fontSize:14, color:C.ink, marginBottom:12}}>📊 Estado del banco por asignatura</div>
        {Object.keys(SUBJECTS).map(s => {
          const n = bankSizes[s] || 0;
          return (
            <div key={s} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.line}`, gap:8, flexWrap:"wrap"}}>
              <div style={{flex:1, minWidth:180, fontSize:13, color:C.ink, fontWeight:600}}>{s}</div>
              <div style={{display:"flex", alignItems:"center", gap:6}}>
                <span style={{fontSize:13, fontWeight:800, color: n>0 ? C.v700 : C.muted, minWidth:40, textAlign:"right"}}>{n}</span>
                <span style={{fontSize:11, color:C.muted}}>preg.</span>
                <button onClick={()=>exportSubject(s)} disabled={n===0} style={{...pillBtn(false, {pad:"5px 10px", size:11, ghost:true}), opacity: n===0 ? .3 : 1}}>📤 Exportar</button>
                <button onClick={()=>clearSubject(s)} disabled={n===0} style={{...pillBtn(false, {pad:"5px 10px", size:11, ghost:true}), opacity: n===0 ? .3 : 1, color:C.err}}>🗑️ Vaciar</button>
              </div>
            </div>
          );
        })}
        <div style={{marginTop:14, padding:12, background:C.v50, borderRadius:12, fontSize:11.5, color:C.v700, lineHeight:1.6}}>
          💡 <strong>Tip:</strong> Cada asignatura admite hasta ≈2.500-3.000 preguntas (límite ~5 MB por clave de almacenamiento).
          Si te acercas al límite, exporta el JSON y trocéalo manualmente.
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────
  // RESTO DE PESTAÑAS (idénticas al original, usando `bank` en lugar de `BANK`)
  // ───────────────────────────────────────────────

  // HOME
  if (tab==="home") {
    // Carrusel de asignaturas (ciclando)
    const subjList = Object.keys(SUBJECTS);
    const featuredSubject = subjList[homeIdx % subjList.length];
    const featTopics = SUBJECTS[featuredSubject];
    const featTot = subjTotal(featuredSubject);
    const featPct = featTot.total > 0 ? Math.round(featTot.correct/featTot.total*100) : null;
    const featBank = bankCount(featuredSubject);
    // Cobertura: temas con al menos 1 pregunta en banco
    const topicsWithBank = featTopics.filter(t => bankCount(featuredSubject, [t]) > 0).length;
    const coveragePct = featTopics.length > 0 ? Math.round(topicsWithBank/featTopics.length*100) : 0;

    // Áreas de mejora: temas con peor % aciertos (mín 3 intentos, < 75%)
    // Calculamos intentos/aciertos por tema agregando desde qstats por pregunta
    const topicAggregate = {};
    bank.filter(q => q.s === featuredSubject).forEach(q => {
      const qs = qstats[q.id];
      if (!qs || qs.a === 0) return;
      q.t.forEach(topic => {
        if (!featTopics.includes(topic)) return;
        if (!topicAggregate[topic]) topicAggregate[topic] = { a:0, c:0 };
        topicAggregate[topic].a += qs.a;
        topicAggregate[topic].c += qs.c;
      });
    });
    const weakTopics = Object.entries(topicAggregate)
      .filter(([_, v]) => v.a >= 3 && v.c/v.a < 0.75)
      .map(([t, v]) => ({ topic: t, pct: Math.round(v.c/v.a*100), attempts: v.a }))
      .sort((a,b) => a.pct - b.pct)
      .slice(0, 3);

    // Errores frecuentes: preguntas con más fallos absolutos (a - c)
    const frequentErrors = bank
      .filter(q => q.s === featuredSubject)
      .map(q => {
        const qs = qstats[q.id];
        if (!qs || qs.a === 0) return null;
        const fails = qs.a - qs.c;
        return fails > 0 ? { q, fails, attempts: qs.a } : null;
      })
      .filter(Boolean)
      .sort((a,b) => b.fails - a.fails)
      .slice(0, 3);

    const hasData = featTot.total > 0;
    const navPrev = () => setHomeIdx(i => (i - 1 + subjList.length) % subjList.length);
    const navNext = () => setHomeIdx(i => (i + 1) % subjList.length);

    return wrap(
      <div>
        {step===1 && (
          <>
            {/* TARJETA PRINCIPAL — ANCHO COMPLETO CON NAVEGACIÓN */}
            <div style={card({padding:"18px 20px", marginBottom:10})}>
              {/* Cabecera con flechas */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:14}}>
                <button onClick={navPrev} style={{width:34, height:34, borderRadius:"50%", border:"none", background:C.v50, color:C.v700, cursor:"pointer", fontSize:18, fontWeight:800, fontFamily:"inherit", flexShrink:0, transition:"all .15s"}}
                  onMouseEnter={e => e.currentTarget.style.background = C.v100}
                  onMouseLeave={e => e.currentTarget.style.background = C.v50}>‹</button>
                <div style={{flex:1, textAlign:"center"}}>
                  <div style={{fontWeight:800, fontSize:15, color:C.ink, lineHeight:1.2}}>{featuredSubject}</div>
                  <div style={{fontSize:10.5, color:C.muted, marginTop:3, fontWeight:600, letterSpacing:.4}}>
                    {homeIdx % subjList.length + 1} de {subjList.length}
                  </div>
                </div>
                <button onClick={navNext} style={{width:34, height:34, borderRadius:"50%", border:"none", background:C.v50, color:C.v700, cursor:"pointer", fontSize:18, fontWeight:800, fontFamily:"inherit", flexShrink:0, transition:"all .15s"}}
                  onMouseEnter={e => e.currentTarget.style.background = C.v100}
                  onMouseLeave={e => e.currentTarget.style.background = C.v50}>›</button>
              </div>

              {/* Bloque principal */}
              {featBank === 0 ? (
                <div style={{padding:"22px 12px", textAlign:"center", background:C.v50, borderRadius:14, color:C.muted, fontSize:13, lineHeight:1.6}}>
                  Aún no hay preguntas en el banco para esta asignatura.
                </div>
              ) : (
                <>
                  <div style={{fontSize:42, fontWeight:900, color:C.ink, letterSpacing:-1, lineHeight:1.1}}>
                    {featPct !== null ? `${featPct}%` : "—"}
                  </div>
                  <div style={{background:C.v50, borderRadius:99, height:6, marginTop:10}}>
                    <div style={{background:`linear-gradient(90deg, ${C.v700}, ${C.v500})`, borderRadius:99, height:6, width:`${featPct||0}%`, transition:"width .5s"}}/>
                  </div>
                  <div style={{display:"flex", gap:6, marginTop:12, flexWrap:"wrap", fontSize:11}}>
                    <span style={{display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:99, background:C.v50, color:C.v700, fontWeight:700}}>
                      📖 {topicsWithBank}/{featTopics.length} temas
                    </span>
                    <span style={{display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:99, background:C.v50, color:C.v700, fontWeight:700}}>
                      {coveragePct}% cobertura
                    </span>
                    <span style={{display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:99, background:C.v50, color:C.v700, fontWeight:700}}>
                      📚 {featBank} en banco
                    </span>
                  </div>

                  {/* Áreas de mejora */}
                  {weakTopics.length > 0 && (
                    <div style={{marginTop:14, padding:"12px 14px", background:"#FEF3C7", borderRadius:14, border:`1px solid ${C.warn}55`}}>
                      <div style={{fontWeight:800, fontSize:12, color:"#92400E", marginBottom:8, letterSpacing:.4}}>⚠️ Áreas de mejora</div>
                      {weakTopics.map((w, i) => (
                        <div key={w.topic} style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, padding:"5px 0", borderTop: i>0 ? `1px solid ${C.warn}33` : "none"}}>
                          <span style={{fontSize:12, color:"#78350F", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{w.topic}</span>
                          <span style={{display:"flex", gap:8, alignItems:"center", flexShrink:0}}>
                            <span style={{fontSize:12, fontWeight:800, color:colorOf(w.pct)}}>{w.pct}%</span>
                            <span style={{fontSize:10.5, color:C.muted, fontWeight:600}}>{w.attempts}p</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Errores frecuentes */}
                  {frequentErrors.length > 0 && (
                    <div style={{marginTop:10, padding:"12px 14px", background:"#FEF2F2", borderRadius:14, border:`1px solid ${C.err}33`}}>
                      <div style={{fontWeight:800, fontSize:12, color:"#7F1D1D", marginBottom:8, letterSpacing:.4}}>🔥 Errores frecuentes</div>
                      {frequentErrors.map((fe, i) => (
                        <div key={fe.q.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, padding:"6px 0", borderTop: i>0 ? `1px solid ${C.err}22` : "none"}}>
                          <span style={{fontSize:11.5, color:"#7F1D1D", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", lineHeight:1.4}}>{fe.q.e}</span>
                          <span style={{fontSize:11, color:C.err, fontWeight:800, flexShrink:0, background:"#FEE2E2", padding:"2px 8px", borderRadius:99}}>
                            {fe.fails}/{fe.attempts} fallos
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Estado vacío de datos */}
                  {!hasData && (
                    <div style={{marginTop:12, padding:"10px 12px", background:C.v50, borderRadius:12, fontSize:11.5, color:C.muted, textAlign:"center", lineHeight:1.5}}>
                      Aún no hay datos de exámenes para esta asignatura. Las áreas de mejora y errores frecuentes aparecerán cuando completes algún examen.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* FRANJA HORIZONTAL DE FLASHCARDS */}
            <div style={{background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`, color:"#fff", borderRadius:18, padding:"12px 16px", marginBottom:16, boxShadow:"0 6px 20px rgba(27,22,64,.22)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
              <div style={{display:"flex", alignItems:"center", gap:14, flex:1, minWidth:180}}>
                <span style={{fontWeight:800, fontSize:13, letterSpacing:.3, opacity:.95}}>🃏 Flashcards</span>
                <div style={{display:"flex", gap:14, fontSize:11.5}}>
                  <span><span style={{color:"#FCA5A5", fontWeight:800, fontSize:14}}>{due.length}</span> <span style={{opacity:.7}}>hoy</span></span>
                  <span><span style={{color:C.peach, fontWeight:800, fontSize:14}}>{pending.length}</span> <span style={{opacity:.7}}>prog.</span></span>
                  <span><span style={{color:"#fff", fontWeight:800, fontSize:14}}>{deck.length}</span> <span style={{opacity:.7}}>total</span></span>
                </div>
              </div>
              <button onClick={()=>setTab("flashcards")} disabled={!deck.length}
                style={{background: deck.length ? "#fff" : "rgba(255,255,255,.15)", color: deck.length ? C.navy : "rgba(255,255,255,.5)", border:"none", borderRadius:99, padding:"7px 16px", fontWeight:800, fontSize:11.5, letterSpacing:.5, cursor: deck.length ? "pointer" : "not-allowed", fontFamily:"inherit", textTransform:"uppercase", flexShrink:0}}>
                Estudiar
              </button>
            </div>
          </>
        )}

        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:14, padding:"4px 4px"}}>
          {[1,2,3].map(s => (
            <div key={s} style={{display:"flex", alignItems:"center", gap:8}}>
              <div onClick={()=>s<step && setStep(s)} style={{width:30, height:30, borderRadius:"50%", background: step>=s ? C.v700 : C.v50, color: step>=s ? "#fff" : C.v300, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, cursor: s<step ? "pointer" : "default", boxShadow: step>=s ? `0 4px 10px ${C.v700}40` : "none", transition:"all .25s"}}>{step>s ? "✓" : s}</div>
              {s<3 && <div style={{width:34, height:2, background: step>s ? C.v300 : C.line, borderRadius:2}}/>}
            </div>
          ))}
          <span style={{fontSize:12, color:C.v700, marginLeft:6, fontWeight:700, letterSpacing:.3}}>
            {step===1 ? "Asignatura" : step===2 ? "Temas" : "Filtros y configuración"}
          </span>
        </div>

        {step===1 && (
          <div style={card({marginBottom:12})}>
            <div style={{fontWeight:800, fontSize:15, color:C.ink, marginBottom:14}}>1 · Elige la asignatura</div>
            <div style={{display:"flex", flexDirection:"column", gap:9}}>
              {Object.keys(SUBJECTS).map(s => {
                const tot = subjTotal(s);
                const sp = tot.total > 0 ? Math.round(tot.correct/tot.total*100) : null;
                const bq = bankCount(s);
                const sel = subject===s;
                const empty = bq === 0;
                return (
                  <button key={s} disabled={empty}
                    onClick={()=>{ setSubject(s); setSelTopics([]); setStep(2); }}
                    style={{...softBtn(sel), textAlign:"left", padding:"14px 18px", fontSize:14, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, opacity: empty ? .4 : 1, cursor: empty ? "not-allowed" : "pointer"}}>
                    <span style={{fontWeight:700}}>{s}</span>
                    <span style={{display:"flex", gap:8, alignItems:"center", fontSize:12, color:C.muted}}>
                      {sp !== null && <span style={{color:colorOf(sp), fontWeight:800, background:`${colorOf(sp)}15`, padding:"2px 9px", borderRadius:99}}>{sp}%</span>}
                      {bq > 0 ? <span style={tagChip("navy")}>📚 {bq}</span> : <span style={{fontSize:10.5, fontWeight:700, color:C.muted}}>SIN PREGUNTAS</span>}
                      {!empty && <span style={{color:C.v500, fontWeight:700}}>{SUBJECTS[s].length} temas →</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{marginTop:14, padding:11, background:C.v50, borderRadius:12, fontSize:12, color:C.v700, textAlign:"center"}}>
              ¿Sin preguntas? Ve a la pestaña <strong>Importar</strong> y pega tu JSON.
            </div>
          </div>
        )}

        {step===2 && subject && (
          <div style={card({marginBottom:12})}>
            <div style={{fontWeight:800, fontSize:15, color:C.ink, marginBottom:4}}>
              2 · Temas <span style={{fontWeight:500, color:C.muted, fontSize:13}}>· {subject}</span>
            </div>
            <div style={{fontSize:12, color:C.muted, marginBottom:12}}>Selecciona uno o varios temas (o todos los disponibles)</div>
            <div style={{display:"flex", gap:7, marginBottom:12, flexWrap:"wrap"}}>
              <button onClick={()=>setSelTopics(SUBJECTS[subject].filter(t=>bankCount(subject,[t])>0))} style={pillBtn(false, {pad:"6px 14px", size:12})}>✓ Todos disponibles</button>
              <button onClick={()=>setSelTopics([])} style={pillBtn(false, {pad:"6px 14px", size:12, ghost:true})}>✗ Ninguno</button>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8}}>
              {SUBJECTS[subject].map(t => {
                const st = getTS(subject, t);
                const tp = st.total > 0 ? Math.round(st.correct/st.total*100) : null;
                const bq = bankCount(subject, [t]);
                const sel = selTopics.includes(t);
                const empty = bq === 0;
                return (
                  <button key={t} disabled={empty}
                    onClick={()=>setSelTopics(p => sel ? p.filter(x=>x!==t) : [...p,t])}
                    style={{...softBtn(sel), textAlign:"left", padding:"10px 12px", fontSize:13, display:"flex", flexDirection:"column", gap:3, alignItems:"flex-start", opacity: empty ? .4 : 1, cursor: empty ? "not-allowed" : "pointer"}}>
                    <span style={{fontWeight:600}}>{t}</span>
                    <span style={{fontSize:10.5, fontWeight:500, display:"flex", gap:6, opacity:.85}}>
                      {tp !== null ? <span style={{color:colorOf(tp), fontWeight:800}}>{tp}%</span> : <span style={{color:C.muted}}>Sin datos</span>}
                      {bq > 0 ? <span style={{color:C.v500}}>📚{bq}</span> : <span style={{color:C.muted}}>—</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex", gap:8, marginTop:14}}>
              <button onClick={()=>setStep(1)} style={pillBtn(false, {pad:"10px 18px", ghost:true})}>← Atrás</button>
              <button onClick={()=>{ if (!selTopics.length) { setErr("Selecciona al menos un tema."); return; } setErr(""); setStep(3); }} style={{...pillBtn(true, {pad:"10px 22px"}), flex:1}}>Continuar →</button>
            </div>
            {err && <div style={{marginTop:8, color:C.err, fontSize:12}}>{err}</div>}
          </div>
        )}

        {step===3 && (
          <div>
            <div style={card({marginBottom:11})}>
              <div style={{fontWeight:800, fontSize:15, color:C.ink, marginBottom:14}}>3 · Filtros</div>
              {filterRow("Origen", fOrigen, [
                {id:"todas", label:"Todas"},{id:"creada", label:"Creadas"},{id:"oficial", label:"De convocatoria"}
              ], (v) => { setFOrigen(v); if (v !== "oficial") setFConvocatoria("todas"); })}
              {fOrigen === "oficial" && availableYears.length === 0 && (
                <div style={{padding:"9px 13px", background:"#FEF3C7", border:`1px solid ${C.warn}55`, borderRadius:11, marginTop:-2, marginBottom:12, fontSize:12, color:"#92400E", lineHeight:1.5}}>
                  Aún no hay preguntas oficiales de convocatoria en el banco para los temas seleccionados.
                </div>
              )}
              {fOrigen === "oficial" && availableYears.length > 0 && filterRow("Año de convocatoria", fConvocatoria, [
                {id:"todas", label:"Todos los años"}, ...availableYears.map(y => ({id:String(y), label:String(y)}))
              ], setFConvocatoria)}
              {filterRow("Estado", fEstado, [{id:"todas", label:"Todas"},{id:"falladas", label:"Falladas"},{id:"no_vistas", label:"Nuevas"}], setFEstado)}
              {filterRow("Dificultad (según % de aciertos)", fDificultad, [{id:"todas", label:"Todas"},{id:"facil", label:"Fácil"},{id:"media", label:"Media"},{id:"dificil", label:"Difícil"}], setFDificultad)}
              {filterRow("Recencia", fRecencia, [{id:"todas", label:"Todas"},{id:"nunca", label:"Nunca vistas"},{id:"mas7", label:"Hace +7 días"},{id:"mas30", label:"Hace +30 días"}], setFRecencia)}
              <div style={{padding:"10px 14px", background:C.v50, borderRadius:12, marginTop:8, fontSize:13, color:C.v700, fontWeight:600, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span>📚 Disponibles con estos filtros</span>
                <span style={{fontSize:18, fontWeight:900, color: poolCount>0 ? C.v700 : C.err}}>{poolCount}</span>
              </div>
            </div>

            <div style={card({marginBottom:11})}>
              <div style={{fontWeight:700, fontSize:14, marginBottom:10, color:C.ink}}>Número de preguntas</div>
              <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                {[10,15,25,40].map(n => (
                  <button key={n} onClick={()=>setNumQ(n)} disabled={n > poolCount}
                    style={{...pillBtn(numQ===n, {pad:"11px 22px", size:15}), opacity: n > poolCount ? .35 : 1, cursor: n > poolCount ? "not-allowed" : "pointer"}}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setNumQ("todas")} disabled={poolCount===0}
                  style={{...pillBtn(numQ==="todas", {pad:"11px 22px", size:15}), opacity: poolCount===0 ? .35 : 1, cursor: poolCount===0 ? "not-allowed" : "pointer"}}>
                  Todas{numQ==="todas" && poolCount>0 ? ` (${poolCount})` : ""}
                </button>
              </div>
              {poolCount > 0 && typeof numQ === "number" && poolCount < numQ && (
                <div style={{fontSize:11, color:C.muted, marginTop:8}}>
                  Solo hay {poolCount} preguntas disponibles. Se generará un examen con {poolCount}.
                </div>
              )}
            </div>

            {err && (
              <div style={{background:"#FEF2F2", border:`1px solid ${C.err}33`, borderRadius:14, padding:11, marginBottom:11, color:C.err, fontSize:13, fontWeight:600}}>{err}</div>
            )}

            <div style={{display:"flex", gap:8}}>
              <button onClick={()=>{ setStep(2); setErr(""); }} style={pillBtn(false, {pad:"14px 20px", ghost:true})}>← Atrás</button>
              <button onClick={generate} disabled={poolCount===0}
                style={{flex:1, padding:"14px 18px", borderRadius:999, border:"none", background: poolCount===0 ? "#A0AEC0" : `linear-gradient(135deg, ${C.v800}, ${C.v500})`, color:"#fff", fontSize:15, fontWeight:800, cursor: poolCount===0 ? "not-allowed" : "pointer", fontFamily:"inherit", letterSpacing:.3, boxShadow: poolCount===0 ? "none" : `0 8px 22px ${C.v700}40`}}>
                🚀 Generar examen
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // EXAM
  if (tab==="exam") {
    const q = questions[curQ];
    const optKeys = Object.keys(q.o);
    const prog = Math.round(Object.keys(answers).length/questions.length*100);
    return wrap(
      <div>
        <div style={{background:C.v100, borderRadius:99, height:7, marginBottom:6, overflow:"hidden"}}>
          <div style={{background:`linear-gradient(90deg, ${C.v700}, ${C.v500})`, borderRadius:99, height:7, width:`${prog}%`, transition:"width .35s"}}/>
        </div>
        <div style={{fontSize:12, color:C.muted, marginBottom:14, display:"flex", justifyContent:"space-between"}}>
          <span style={{color:C.v700, fontWeight:700}}>{examMeta.current.subject}</span>
          <span style={{fontWeight:600}}>{Object.keys(answers).length}/{questions.length}</span>
        </div>
        <div style={card({marginBottom:14})}>
          <div style={{fontSize:11, fontWeight:800, color:C.v500, letterSpacing:1.8, marginBottom:9, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span>PREGUNTA {q.numero} / {questions.length}</span>
            {q.origen==="oficial" && q.convocatoria && (<span style={tagChip("peach")}>PIR {q.convocatoria}</span>)}
          </div>
          <div style={{fontSize:15.5, lineHeight:1.85, fontWeight:500, marginBottom:18, color:C.ink}}>{q.e}</div>
          <div style={{display:"flex", flexDirection:"column", gap:9}}>
            {optKeys.map(opt => {
              const sel = answers[curQ]===opt;
              return (
                <button key={opt} onClick={()=>setAnswers(p=>({...p, [curQ]:opt}))}
                  style={{display:"flex", gap:13, alignItems:"flex-start", padding:"12px 16px", borderRadius:14, border:`2px solid ${sel?C.v600:C.line}`, background: sel ? `linear-gradient(135deg, ${C.v700}, ${C.v500})` : C.surface, color: sel ? "#fff" : C.ink, cursor:"pointer", textAlign:"left", fontSize:14, lineHeight:1.55, fontFamily:"inherit", transition:"all .15s", boxShadow: sel ? `0 6px 18px ${C.v700}30` : "none"}}>
                  <span style={{fontWeight:800, minWidth:24, color: sel ? "#fff" : C.v500}}>{opt})</span>
                  <span>{q.o[opt]}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap"}}>
          <button onClick={()=>setCurQ(p=>Math.max(0,p-1))} disabled={curQ===0}
            style={{...pillBtn(false, {pad:"10px 18px", ghost:true}), opacity: curQ===0 ? .35 : 1}}>← Anterior</button>
          <div style={{display:"flex", gap:4, flexWrap:"wrap", justifyContent:"center", maxWidth:380}}>
            {questions.map((_,i)=>(
              <button key={i} onClick={()=>setCurQ(i)}
                style={{width:24, height:24, borderRadius:"50%", border:`2px solid ${i===curQ?C.v700:"transparent"}`, background: answers[i] ? C.v500 : C.v50, cursor:"pointer", fontSize:9.5, fontWeight:700, color: answers[i] ? "#fff" : C.v300}}>{i+1}</button>
            ))}
          </div>
          {curQ < questions.length-1
            ? <button onClick={()=>setCurQ(p=>p+1)} style={pillBtn(true, {pad:"11px 22px"})}>Siguiente →</button>
            : <button onClick={submitExam} style={{...pillBtn(true, {pad:"11px 22px"}), background:`linear-gradient(135deg, ${C.v800}, ${C.v500})`, boxShadow:`0 8px 20px ${C.v700}40`}}>✅ Entregar</button>}
        </div>
        {err && (<div style={{marginTop:10, color:C.err, fontSize:13, background:"#FEF2F2", padding:10, borderRadius:12, border:`1px solid ${C.err}33`}}>{err}</div>)}
      </div>
    );
  }

  // RESULTS
  if (tab==="results") {
    const q = questions[curQ];
    const optKeys = Object.keys(q.o);
    const ua = answers[curQ];
    const ok = ua === q.c;
    const passed = pct >= 70;
    return wrap(
      <div>
        <div style={{position:"relative", overflow:"hidden", background: passed ? `linear-gradient(135deg, ${C.v800} 0%, ${C.v500} 100%)` : `linear-gradient(135deg, #7F1D1D 0%, ${C.err} 100%)`, borderRadius:24, padding:"24px 26px", marginBottom:16, color:"#fff", textAlign:"center", boxShadow:`0 12px 32px rgba(46,16,101,.25)`}}>
          <div style={{position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,.18), transparent 60%)"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:54, fontWeight:900, lineHeight:1, letterSpacing:-1}}>{score}<span style={{fontSize:26, opacity:.6}}>/{questions.length}</span></div>
            <div style={{fontSize:20, marginTop:5, fontWeight:800}}>{pct}%</div>
            <div style={{fontSize:12, opacity:.85, marginTop:5, fontWeight:600, letterSpacing:.5}}>{pct>=80 ? "🏆 Excelente" : pct>=60 ? "✅ Aprobado" : "❌ A repasar"}</div>
            {failed.length > 0 && (
              <button onClick={addToDeck} style={{marginTop:13, padding:"10px 20px", borderRadius:99, border:"2px solid rgba(255,255,255,.6)", background:"rgba(255,255,255,.12)", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:12.5, fontFamily:"inherit", letterSpacing:.3, backdropFilter:"blur(10px)"}}>
                🃏 Añadir {failed.length} falladas al mazo
              </button>
            )}
          </div>
        </div>
        <div style={card({border:`2px solid ${ok?C.ok:C.err}`, marginBottom:13})}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:9, flexWrap:"wrap", gap:6}}>
            <span style={{fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1.2}}>PREGUNTA {q.numero}/{questions.length}</span>
            <span style={{fontSize:12, fontWeight:800, color:ok?C.ok:C.err, letterSpacing:.5}}>{ok ? "✓ CORRECTA" : "✗ INCORRECTA"}</span>
          </div>
          <div style={{fontSize:15.5, lineHeight:1.8, fontWeight:500, marginBottom:14, color:C.ink}}>{q.e}</div>
          <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:13}}>
            {optKeys.map(opt => {
              const ic = opt === q.c;
              const iu = opt === ua;
              return (
                <div key={opt} style={{display:"flex", gap:13, alignItems:"flex-start", padding:"10px 14px", borderRadius:12, border:`2px solid ${ic?C.ok:iu?C.err:C.line}`, background: ic?"#F0FDF4":iu?"#FEF2F2":C.surface, color: ic?"#065F46":iu?"#7F1D1D":C.ink, fontSize:14}}>
                  <span style={{fontWeight:800, minWidth:24}}>{opt})</span>
                  <span style={{flex:1}}>{q.o[opt]}</span>
                  {ic && <span style={{fontWeight:800}}>✓</span>}
                  {iu && !ic && <span style={{fontWeight:800}}>✗</span>}
                </div>
              );
            })}
          </div>
          <button onClick={()=>setShowExpl(p=>({...p, [curQ]:!p[curQ]}))} style={pillBtn(false, {pad:"9px 16px", size:13, ghost:true})}>
            {showExpl[curQ] ? "🔼 Ocultar" : "💡 Explicación y referencias"}
          </button>
          {showExpl[curQ] && (
            <div style={{marginTop:10, display:"flex", flexDirection:"column", gap:8}}>
              <div style={{padding:13, borderRadius:14, background:"#FFFBEB", border:`1px solid ${C.warn}55`, fontSize:13, lineHeight:1.7, color:"#78350F"}}>{q.x}</div>
              {q.r && (<div style={{padding:11, borderRadius:14, background:C.v50, border:`1px solid ${C.v200}`, fontSize:12, color:C.v700, lineHeight:1.6}}><strong>📚 Refs:</strong> {q.r}</div>)}
            </div>
          )}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
          <button onClick={()=>setCurQ(p=>Math.max(0,p-1))} disabled={curQ===0} style={{...pillBtn(false, {pad:"10px 18px", ghost:true}), opacity: curQ===0 ? .35 : 1}}>← Anterior</button>
          <div style={{display:"flex", gap:4, flexWrap:"wrap", justifyContent:"center", maxWidth:380}}>
            {questions.map((q2,i)=>(
              <button key={i} onClick={()=>setCurQ(i)} style={{width:24, height:24, borderRadius:"50%", border:`2px solid ${i===curQ?C.ink:"transparent"}`, background: answers[i]===q2.c ? C.ok : C.err, cursor:"pointer", fontSize:9.5, fontWeight:700, color:"#fff"}}>{i+1}</button>
            ))}
          </div>
          <button onClick={()=>setCurQ(p=>Math.min(questions.length-1, p+1))} disabled={curQ===questions.length-1}
            style={{...pillBtn(false, {pad:"10px 18px", ghost:true}), opacity: curQ===questions.length-1 ? .35 : 1}}>Siguiente →</button>
        </div>
      </div>
    );
  }

  // FLASHCARDS
  if (tab==="flashcards") return wrap(
    <div>
      <div style={{background:`linear-gradient(160deg, ${C.navy} 0%, ${C.navy2} 100%)`, color:"#fff", borderRadius:22, padding:"18px 22px", marginBottom:14, boxShadow:"0 10px 28px rgba(27,22,64,.25)"}}>
        <div style={{fontWeight:800, fontSize:14, marginBottom:12}}>Flashcards</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10}}>
          {[
            {l:"Hoy", v:due.length, c:"#FCA5A5"},
            {l:"Programadas", v:pending.length, c:C.peach},
            {l:"Aprendidas", v:learnedCards.length, c:"#86EFAC"},
            {l:"Total", v:deck.length, c:"#fff"}
          ].map(s => (
            <div key={s.l} style={{textAlign:"center"}}>
              <div style={{fontSize:24, fontWeight:900, color:s.c, letterSpacing:-.5}}>{s.v}</div>
              <div style={{fontSize:10.5, opacity:.75, marginTop:2, letterSpacing:.3}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.v50, border:`1px solid ${C.v100}`, borderRadius:14, padding:"10px 15px", fontSize:12, color:C.v700, marginBottom:14}}>
        <strong>Repetición espaciada:</strong> 1→2→5→7→15 días · <strong>{LEARN_N} aciertos consecutivos</strong> = aprendida ✓
      </div>
      {due.length === 0 ? (
        <div style={{...card({textAlign:"center", padding:"50px 24px"})}}>
          <div style={{fontSize:48}}>🎉</div>
          <div style={{fontSize:17, fontWeight:800, marginTop:11, color:C.ink}}>¡Al día con el repaso!</div>
          <div style={{color:C.muted, marginTop:6, fontSize:13}}>
            {pending.length > 0 ? `${pending.length} tarjetas programadas próximamente.` : "Haz un examen y añade falladas para empezar."}
          </div>
        </div>
      ) : (
        <>
          <div style={{fontSize:12, color:C.muted, marginBottom:8, fontWeight:600}}>
            Tarjeta {Math.min(fcIdx+1,due.length)}/{due.length} · Caja {fcCard.box+1}/5 · Racha {fcCard.correctStreak}/{LEARN_N}
          </div>
          <div onClick={()=>!flipped && setFlipped(true)}
            style={{...card({minHeight:240, cursor: flipped ? "default" : "pointer", marginBottom:12, position:"relative", boxShadow:"0 12px 30px rgba(76,29,149,.12)"})}}>
            <div style={{display:"flex", gap:4, marginBottom:13}}>
              {SR_INT.map((_,i) => (
                <div key={i} style={{height:5, flex:1, borderRadius:3, background: i<=fcCard.box ? `linear-gradient(90deg, ${C.v700}, ${C.v500})` : C.v50}}/>
              ))}
            </div>
            {!flipped ? (
              <>
                {(() => {
                  const isTrueFalseStyle = /\b(se[ñn]ale|indique|marque)\s+la\s+(afirmaci[oó]n\s+)?(verdadera|falsa|correcta|incorrecta)/i.test(fcCard.e || "");
                  const hasRecall = !!fcCard.pa;
                  const needsOptions = !hasRecall && isTrueFalseStyle;
                  return (
                    <>
                      <div style={{fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1.5, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6}}>
                        <span>{hasRecall ? "❓ PREGUNTA ABIERTA" : needsOptions ? "📝 PREGUNTA DE EXAMEN" : "❓ PREGUNTA"}</span>
                        {hasRecall && <span style={{fontSize:9.5, color:C.v500, fontWeight:700, background:C.v50, padding:"2px 8px", borderRadius:99}}>RECALL</span>}
                        {needsOptions && <span style={{fontSize:9.5, color:C.peachInk, fontWeight:700, background:C.peach, padding:"2px 8px", borderRadius:99}}>CON OPCIONES</span>}
                      </div>
                      <div style={{fontSize:16, lineHeight:1.85, fontWeight:500, color:C.ink, marginBottom: needsOptions ? 12 : 0}}>{fcCard.pa || fcCard.e}</div>
                      {needsOptions && (
                        <>
                          <div style={{fontSize:10.5, color:C.peachInk, fontWeight:600, fontStyle:"italic", marginBottom:8, padding:"6px 10px", background:C.peach+"60", borderRadius:8, borderLeft:`3px solid ${C.peachInk}`}}>
                            ⚠️ Esta pregunta requiere ver las opciones. Responde mentalmente cuál es la correcta.
                          </div>
                          <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:8}}>
                            {Object.keys(fcCard.o).map(opt => (
                              <div key={opt} style={{display:"flex", gap:10, padding:"8px 12px", borderRadius:10, border:`1.5px solid ${C.line}`, background:C.surface, color:C.ink, fontSize:13, lineHeight:1.5}}>
                                <span style={{fontWeight:800, minWidth:22, color:C.v500}}>{opt})</span>
                                <span style={{flex:1}}>{fcCard.o[opt]}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <div style={{position:"absolute", bottom:14, right:18, fontSize:11, color:C.v300, fontWeight:600}}>Toca para ver ▼</div>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <div style={{fontSize:11, fontWeight:800, color:C.ok, letterSpacing:1.5, marginBottom:10}}>✅ RESPUESTA</div>
                {fcCard.pa && (
                  <div style={{fontSize:11.5, color:C.muted, marginBottom:10, fontStyle:"italic", lineHeight:1.5, padding:"8px 12px", background:C.v50, borderRadius:10, borderLeft:`3px solid ${C.v300}`}}>
                    <strong style={{color:C.v700, fontStyle:"normal"}}>Versión examen:</strong> {fcCard.e}
                  </div>
                )}
                <div style={{display:"flex", flexDirection:"column", gap:7, marginBottom:11}}>
                  {Object.keys(fcCard.o).map(opt => {
                    const ic = opt === fcCard.c;
                    return (
                      <div key={opt} style={{display:"flex", gap:10, padding:"9px 13px", borderRadius:12, border:`2px solid ${ic?C.ok:C.line}`, background: ic ? "#F0FDF4" : C.surface, color: ic ? "#065F46" : C.muted, fontSize:13}}>
                        <span style={{fontWeight:800, minWidth:24}}>{opt})</span>
                        <span style={{flex:1}}>{fcCard.o[opt]}</span>
                        {ic && <span style={{fontWeight:800}}>✓</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{padding:11, borderRadius:14, background:"#FFFBEB", border:`1px solid ${C.warn}55`, fontSize:13, lineHeight:1.65, color:"#78350F", marginBottom:8}}>{fcCard.x}</div>
                {fcCard.r && (<div style={{padding:10, borderRadius:14, background:C.v50, border:`1px solid ${C.v200}`, fontSize:12, color:C.v700}}><strong>📚</strong> {fcCard.r}</div>)}
              </>
            )}
          </div>
          {flipped ? (
            <div style={{display:"flex", gap:11}}>
              <button onClick={()=>handleFC(false)} style={{flex:1, padding:16, borderRadius:18, border:"none", background:C.err, color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 18px ${C.err}40`}}>✗ No lo sabía</button>
              <button onClick={()=>handleFC(true)} style={{flex:1, padding:16, borderRadius:18, border:"none", background:C.ok, color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 18px ${C.ok}40`}}>✓ Lo sabía</button>
            </div>
          ) : (
            <button onClick={()=>setFlipped(true)} style={{width:"100%", padding:14, borderRadius:18, border:"none", background:`linear-gradient(135deg, ${C.v700}, ${C.v500})`, color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 8px 22px ${C.v700}40`}}>👁 Ver respuesta</button>
          )}
        </>
      )}
      {pending.length > 0 && (
        <div style={{...card(), marginTop:14}}>
          <div style={{fontWeight:800, fontSize:14, color:C.ink, marginBottom:10}}>📅 Próximas revisiones</div>
          {pending.sort((a,b)=>a.next_review.localeCompare(b.next_review)).slice(0,5).map(c => (
            <div key={c.id} style={{display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.line}`, gap:8, fontSize:13}}>
              <span style={{flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:C.ink}}>{(c.pa || c.e)?.slice(0,65)}…</span>
              <span style={{fontSize:11, color:C.v700, whiteSpace:"nowrap", background:C.v50, padding:"3px 9px", borderRadius:99, fontWeight:600}}>📅 {c.next_review}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // STATS
  return wrap(
    <div>
      <div style={{fontWeight:900, fontSize:18, color:C.ink, marginBottom:14, letterSpacing:-.3}}>📈 Progreso por asignatura y tema</div>
      {Object.keys(SUBJECTS).map(subj => {
        const tot = subjTotal(subj);
        const sp = tot.total > 0 ? Math.round(tot.correct/tot.total*100) : null;
        const subjBank = bankCount(subj);
        return (
          <div key={subj} style={{...card(), marginBottom:14, opacity: subjBank===0 ? .5 : 1}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11, flexWrap:"wrap", gap:6}}>
              <div style={{fontWeight:800, fontSize:15, color:C.ink}}>{subj}</div>
              <div style={{display:"flex", gap:11, alignItems:"center"}}>
                {sp !== null && <span style={{fontWeight:900, color:colorOf(sp), fontSize:20, letterSpacing:-.5}}>{sp}%</span>}
                <span style={{fontSize:12, color:C.muted, fontWeight:600}}>{tot.total} preguntas</span>
              </div>
            </div>
            {tot.total > 0 && (
              <div style={{background:C.v50, borderRadius:99, height:6, marginBottom:14, overflow:"hidden"}}>
                <div style={{background:`linear-gradient(90deg, ${colorOf(sp)}, ${colorOf(sp)}dd)`, borderRadius:99, height:6, width:`${sp}%`, transition:"width .5s"}}/>
              </div>
            )}
            <div>
              {SUBJECTS[subj].map((t,i) => {
                const st = getTS(subj, t);
                const tp = st.total > 0 ? Math.round(st.correct/st.total*100) : null;
                const bq = bankCount(subj, [t]);
                const last = stats[subj]?.[t]?.sessions?.slice(-1)[0];
                return (
                  <div key={t} style={{display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom: i<SUBJECTS[subj].length-1 ? `1px solid ${C.line}` : "none", flexWrap:"wrap", opacity: bq===0 ? .5 : 1}}>
                    <div style={{flex:1, minWidth:150}}>
                      <div style={{fontSize:13, color:C.ink, display:"flex", alignItems:"center", gap:6, fontWeight:500}}>
                        {t}
                        {bq > 0 && <span style={tagChip("navy")}>📚{bq}</span>}
                      </div>
                      {last && <div style={{fontSize:10.5, color:C.muted, marginTop:2}}>Última: {last.date}</div>}
                    </div>
                    {tp !== null ? (
                      <div style={{display:"flex", alignItems:"center", gap:8}}>
                        <div style={{width:78, background:C.v50, borderRadius:99, height:5, overflow:"hidden"}}>
                          <div style={{background:colorOf(tp), borderRadius:99, height:5, width:`${tp}%`}}/>
                        </div>
                        <span style={{fontSize:12.5, fontWeight:800, color:colorOf(tp), minWidth:32}}>{tp}%</span>
                        <span style={{fontSize:11, color:C.muted}}>{st.total}p</span>
                      </div>
                    ) : (
                      <span style={{fontSize:11, color:C.muted, fontStyle:"italic"}}>Sin datos</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {Object.keys(stats).length === 0 && (
        <div style={{textAlign:"center", padding:"50px", color:C.muted}}>
          <div style={{fontSize:42}}>📊</div>
          <div style={{marginTop:11, fontSize:15, fontWeight:600}}>Haz tu primer examen para ver el progreso</div>
        </div>
      )}
    </div>
  );
}
