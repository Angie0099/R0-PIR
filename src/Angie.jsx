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
const slugSubject = (subj) => subj
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_+|_+$/g, "");
const subjectKey = (subj) => "bank:" + slugSubject(subj);
const schemaKey  = (subj) => "schema:" + slugSubject(subj);

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
// NORMALIZADOR DE ESQUEMAS IMPORTADOS
// Acepta: { asignatura, tema, secciones:[{ titulo, items:[{pista, respuesta}] }] }
// (también admite alias en inglés: title/cue/answer y el formato compacto {s,t,secciones})
// ═══════════════════════════════════════════════════════════
const normalizeSchema = (raw, idx, defaultSubject) => {
  if (!raw || typeof raw !== "object") return null;
  const secRaw = raw.secciones || raw.sections;
  if (!Array.isArray(secRaw)) return null;
  const secciones = secRaw.map(sec => ({
    titulo: sec.titulo || sec.title || "",
    items: (Array.isArray(sec.items) ? sec.items : []).map(it => ({
      pista: String(it.pista ?? it.cue ?? "").trim(),
      respuesta: String(it.respuesta ?? it.answer ?? "").trim()
    })).filter(it => it.respuesta || it.pista)
  })).filter(sec => sec.items.length > 0);
  if (secciones.length === 0) return null;
  return {
    id: raw.id || `sch_${Date.now()}_${idx}`,
    s: raw.asignatura || raw.s || defaultSubject,
    t: raw.tema || raw.t || "",
    secciones
  };
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
  const[immediate,setImmediate]=useState(false); // false = corregir al final · true = corregir al instante
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
  const[bankSizes,setBankSizes]=useState({});

  // Estado del gestor de preguntas (revisar / depurar / borrar individual)
  const[mgrSubject,setMgrSubject]=useState("Clínica Adultos");
  const[mgrTopic,setMgrTopic]=useState("__all__");
  const[mgrExpanded,setMgrExpanded]=useState(null); // id de la pregunta expandida
  const[mgrSearch,setMgrSearch]=useState("");        // buscador de texto en el gestor
  const[editing,setEditing]=useState(null);          // borrador de pregunta en edición

  // Importar: opciones extra
  const[impShuffle,setImpShuffle]=useState(false);   // barajar opciones al importar
  const importFileRef=useRef(null);                  // input de archivo para importar JSON
  const backupFileRef=useRef(null);                  // input de archivo para restaurar copia

  // Indicador de espacio usado
  const[storageInfo,setStorageInfo]=useState({used:0, pct:0});

  // ── ESQUEMAS (recuperación estructurada previa al tema) ──
  const[schemas,setSchemas]=useState([]);            // todos los esquemas cargados
  const[schSubject,setSchSubject]=useState("Clínica Adultos"); // asignatura en la pestaña Esquemas
  const[schId,setSchId]=useState(null);              // esquema abierto (id) o null = lista
  const[schAnswers,setSchAnswers]=useState({});      // respuestas escritas {sec_item: texto}
  const[schRevealed,setSchRevealed]=useState(false); // mostrar soluciones
  // Importación de esquemas
  const[impSchemaText,setImpSchemaText]=useState("");
  const[impSchemaPreview,setImpSchemaPreview]=useState(null);
  const[impSchemaMsg,setImpSchemaMsg]=useState("");
  const schemaFileRef=useRef(null);

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

  // Recalcula el espacio usado al abrir la pestaña Importar
  useEffect(() => { if (tab === "import" && !bankLoading) computeStorage(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tab, bankLoading, bank, deck]);

  // Navegación con flechas del teclado (← →) en examen y resultados
  useEffect(() => {
    if (tab !== "exam" && tab !== "results") return;
    const onKey = (e) => {
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "ArrowLeft") { setCurQ(c => Math.max(0, c - 1)); }
      else if (e.key === "ArrowRight") { setCurQ(c => Math.min(questions.length - 1, c + 1)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, questions.length]);

  // Carga de esquemas una vez listo el banco
  useEffect(() => {
    if (bankLoading) return;
    let cancelled = false;
    (async () => {
      const all = [];
      for (const subj of Object.keys(SUBJECTS)) {
        try {
          const arr = await load(schemaKey(subj), []);
          if (Array.isArray(arr)) all.push(...arr);
        } catch { /* ignora */ }
      }
      if (!cancelled) setSchemas(all);
    })();
    return () => { cancelled = true; };
  }, [bankLoading]);

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

  // Cierra el examen ya corregido y vuelve al inicio (limpia el estado del examen)
  const finishExam = () => {
    setQuestions([]); setAnswers({}); setShowExpl({}); setCurQ(0); setStep(1); setErr(""); setTab("home");
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
  const parseImport = async () => {
    setImpMsg("");
    setImpPreview(null);
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
    let normalized = [];
    const errors = [];
    data.forEach((raw, i) => {
      let n = normalizeQuestion(raw, i, impSubject);
      if (!n) { errors.push(i + 1); return; }
      n.s = impSubject; // forzar la asignatura del importador
      if (impShuffle) n = shuffleOptions(n);
      normalized.push(n);
    });
    if (normalized.length === 0) {
      setImpMsg(`❌ Ninguna pregunta válida. Errores en filas: ${errors.join(", ")}`);
      return;
    }
    // Detección de duplicados (contra el banco existente y dentro del propio lote)
    const existing = await load(subjectKey(impSubject), []);
    const existingSigs = new Set(existing.map(qSignature));
    const seen = new Set();
    let dupExisting = 0, dupInternal = 0, withIssues = 0;
    normalized = normalized.map(q => {
      const sig = qSignature(q);
      let dup = false;
      if (existingSigs.has(sig)) { dup = true; dupExisting++; }
      else if (seen.has(sig)) { dup = true; dupInternal++; }
      seen.add(sig);
      const issues = validateQuestion(q);
      if (issues.length) withIssues++;
      return { ...q, _dup: dup, _issues: issues };
    });
    const fresh = normalized.filter(q => !q._dup).length;
    setImpPreview({ normalized, errors, subject: impSubject, dupExisting, dupInternal, withIssues, fresh });
    const parts = [`✓ ${normalized.length} preguntas leídas · ${fresh} nuevas`];
    if (dupExisting + dupInternal) parts.push(`${dupExisting + dupInternal} duplicadas`);
    if (withIssues) parts.push(`${withIssues} con avisos`);
    if (errors.length) parts.push(`${errors.length} descartadas`);
    setImpMsg(parts.join(" · "));
  };

  const confirmImport = async (mode) => {
    if (!impPreview) return;
    const k = subjectKey(impPreview.subject);
    const existing = await load(k, []);
    let merged;
    if (mode === "replace") {
      // En reemplazo, quitamos duplicados internos pero conservamos todo lo del lote
      const seen = new Set();
      merged = impPreview.normalized.filter(q => {
        const sig = qSignature(q);
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      }).map(({ _dup, _issues, ...q }) => q);
    } else {
      // append: deduplicar por id Y por contenido
      const ids = new Set(existing.map(q => q.id));
      const sigs = new Set(existing.map(qSignature));
      const fresh = impPreview.normalized
        .filter(q => !ids.has(q.id) && !sigs.has(qSignature(q)) && !q._dup)
        .map(({ _dup, _issues, ...q }) => q);
      merged = [...existing, ...fresh];
    }
    const ok = await persistSubject(impPreview.subject, merged);
    if (!ok) {
      setImpMsg("❌ Error al guardar (¿supera 5 MB? prueba a dividir el bloque o haz una copia y vacía algo)");
      return;
    }
    computeStorage();
    showToast(`✅ Banco "${impPreview.subject}" actualizado: ${merged.length} preguntas totales`);
    setImpText("");
    setImpPreview(null);
    setImpMsg("");
  };

  const clearSubject = async (subj) => {
    if (!confirm(`¿Borrar TODAS las preguntas de "${subj}"? Esta acción no se puede deshacer.`)) return;
    await persistSubject(subj, []);
    showToast(`🗑️ "${subj}" vaciado`);
  };

  // ───────────────────────────────────────────────
  // BORRAR UNA SOLA PREGUNTA DEL BANCO (por id)
  // Limpia también el mazo y las estadísticas por pregunta.
  // ───────────────────────────────────────────────
  const deleteQuestionById = async (q) => {
    const subj = q.s || q._subject;
    if (!subj) { showToast("No se pudo identificar la asignatura"); return false; }
    const k = subjectKey(subj);
    const existing = await load(k, []);
    const filtered = existing.filter(x => x.id !== q.id);
    const ok = await persistSubject(subj, filtered);
    if (!ok) { showToast("❌ Error al borrar la pregunta"); return false; }
    // Limpieza: quitar la tarjeta del mazo y sus stats huérfanas
    setDeck(prev => { const n = prev.filter(c => c.id !== q.id); save(K.deck, n); return n; });
    setQstats(prev => { const n = {...prev}; delete n[q.id]; save(K.qstats, n); return n; });
    return true;
  };

  // Borrar desde el gestor (pestaña Importar)
  const deleteFromManager = async (q) => {
    if (!confirm("¿Eliminar esta pregunta del banco para siempre? El resto de preguntas se conserva.")) return;
    const ok = await deleteQuestionById(q);
    if (ok) { setMgrExpanded(null); showToast("🗑️ Pregunta eliminada"); }
  };

  // Borrar la pregunta que se está viendo en examen / resultados,
  // reindexando respuestas y explicaciones para no descuadrar el examen.
  const deleteExamQuestion = async () => {
    const q = questions[curQ];
    if (!q) return;
    if (!confirm("¿Eliminar esta pregunta del banco para siempre? No volverá a aparecer en ningún examen.")) return;
    const ok = await deleteQuestionById(q);
    if (!ok) return;
    const idx = curQ;
    const nextQs = questions.filter((_, i) => i !== idx).map((qq, i) => ({ ...qq, numero: i + 1 }));
    const remap = (obj) => {
      const out = {};
      Object.keys(obj).forEach(kStr => {
        const kk = Number(kStr);
        if (kk === idx) return;
        out[kk > idx ? kk - 1 : kk] = obj[kStr];
      });
      return out;
    };
    setAnswers(a => remap(a));
    setShowExpl(s => remap(s));
    setQuestions(nextQs);
    setCurQ(c => Math.min(c, Math.max(0, nextQs.length - 1)));
    showToast("🗑️ Pregunta eliminada del banco");
    if (nextQs.length === 0) setTab("home");
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

  // ═══════════════════════════════════════════════════════════
  // UTILIDADES NUEVAS (firma de contenido, tamaño, validación)
  // ═══════════════════════════════════════════════════════════
  // Firma normalizada del enunciado: sirve para detectar duplicados aunque
  // cambien acentos, mayúsculas o espacios.
  const qSignature = (q) => (q.e || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();

  const fmtBytes = (b) => b < 1024 ? `${b} B`
    : b < 1024 * 1024 ? `${(b/1024).toFixed(0)} KB`
    : `${(b/1024/1024).toFixed(2)} MB`;

  // Calcula el espacio aproximado usado en el almacenamiento.
  const computeStorage = async () => {
    try {
      let bytes = 0;
      const { keys } = await window.storage.list("");
      for (const kk of (keys || [])) {
        const r = await window.storage.get(kk);
        if (r && r.value) bytes += (kk.length + r.value.length) * 2; // ~2 bytes/char (UTF-16)
      }
      const LIMIT = 5 * 1024 * 1024;
      setStorageInfo({ used: bytes, pct: Math.min(100, Math.round(bytes / LIMIT * 100)) });
    } catch { /* sin datos */ }
  };

  // Valida una pregunta normalizada. Devuelve array de avisos (vacío = OK).
  const validateQuestion = (q) => {
    const issues = [];
    const keys = Object.keys(q.o || {});
    if (keys.length < 4) issues.push("menos de 4 opciones");
    if (keys.some(k => !String(q.o[k] || "").trim())) issues.push("opción vacía");
    if (!keys.includes(q.c)) issues.push("respuesta correcta fuera de rango");
    const vals = keys.map(k => String(q.o[k] || "").trim().toLowerCase());
    if (new Set(vals).size < vals.length) issues.push("opciones repetidas");
    if (!String(q.x || "").trim()) issues.push("sin justificación");
    if (!String(q.e || "").trim()) issues.push("sin enunciado");
    return issues;
  };

  // Baraja el orden de las opciones recolocando la respuesta correcta.
  const shuffleOptions = (q) => {
    const keys = Object.keys(q.o);
    if (keys.length < 2) return q;
    const correctVal = q.o[q.c];
    const vals = keys.map(k => q.o[k]);
    for (let i = vals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vals[i], vals[j]] = [vals[j], vals[i]];
    }
    const newO = {};
    keys.forEach((k, idx) => { newO[k] = vals[idx]; });
    const newC = keys.find(k => newO[k] === correctVal) || q.c;
    return { ...q, o: newO, c: newC };
  };

  // ═══════════════════════════════════════════════════════════
  // COPIA DE SEGURIDAD COMPLETA (exportar / restaurar)
  // ═══════════════════════════════════════════════════════════
  const exportAllBackup = async () => {
    try {
      const backup = { _type: "r0pir-backup", _version: 2, exported: new Date().toISOString(), banks: {}, schemas: {}, deck: [], stats: {}, qstats: {} };
      for (const subj of Object.keys(SUBJECTS)) {
        backup.banks[subj] = await load(subjectKey(subj), []);
        backup.schemas[subj] = await load(schemaKey(subj), []);
      }
      backup.deck = await load(K.deck, []);
      backup.stats = await load(K.stats, {});
      backup.qstats = await load(K.qstats, {});
      const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `r0pir-backup-${todayS()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      const totalQ = Object.values(backup.banks).reduce((n, arr) => n + arr.length, 0);
      showToast(`💾 Copia descargada · ${totalQ} preguntas`);
    } catch (e) { showToast("❌ Error al exportar: " + e.message); }
  };

  const restoreBackup = async (text, mode) => {
    let data;
    try { data = JSON.parse(text); } catch (e) { setImpMsg("❌ El archivo no es un JSON válido: " + e.message); return; }
    if (!data || typeof data !== "object" || !data.banks) { setImpMsg("❌ Este archivo no parece una copia de R0 PIR."); return; }
    try {
      for (const subj of Object.keys(SUBJECTS)) {
        const incoming = Array.isArray(data.banks[subj]) ? data.banks[subj] : [];
        if (mode === "replace") {
          await persistSubject(subj, incoming);
        } else {
          const existing = await load(subjectKey(subj), []);
          const ids = new Set(existing.map(q => q.id));
          const sigs = new Set(existing.map(qSignature));
          const fresh = incoming.filter(q => !ids.has(q.id) && !sigs.has(qSignature(q)));
          await persistSubject(subj, [...existing, ...fresh]);
        }
        // Esquemas
        const incSch = (data.schemas && Array.isArray(data.schemas[subj])) ? data.schemas[subj] : [];
        if (incSch.length) {
          if (mode === "replace") {
            await persistSchemas(subj, incSch);
          } else {
            const exSch = await load(schemaKey(subj), []);
            const temas = new Set(exSch.map(x => x.t));
            const freshSch = incSch.filter(x => !temas.has(x.t));
            await persistSchemas(subj, [...exSch, ...freshSch]);
          }
        }
      }
      if (mode === "replace") {
        if (Array.isArray(data.deck)) { await save(K.deck, data.deck); setDeck(data.deck); }
        if (data.stats) { await save(K.stats, data.stats); setStats(data.stats); }
        if (data.qstats) { await save(K.qstats, data.qstats); setQstats(data.qstats); }
      } else {
        if (Array.isArray(data.deck)) {
          const cur = await load(K.deck, []);
          const ids = new Set(cur.map(c => c.id));
          const merged = [...cur, ...data.deck.filter(c => !ids.has(c.id))];
          await save(K.deck, merged); setDeck(merged);
        }
        if (data.qstats) { const merged = { ...data.qstats, ...qstats }; await save(K.qstats, merged); setQstats(merged); }
        if (data.stats) { const merged = { ...data.stats, ...stats }; await save(K.stats, merged); setStats(merged); }
      }
      computeStorage();
      showToast("✅ Copia restaurada");
      setImpMsg("✅ Copia restaurada correctamente.");
    } catch (e) { setImpMsg("❌ Error al restaurar: " + e.message); }
  };

  const onBackupFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const replace = confirm("Restaurar copia:\n\n• Aceptar = REEMPLAZAR todo lo actual por la copia.\n• Cancelar = COMBINAR (añade lo que falte sin borrar lo que ya tienes).");
      restoreBackup(String(reader.result), replace ? "replace" : "merge");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImpText(String(reader.result)); setImpPreview(null); setImpMsg("📂 Archivo cargado. Pulsa «Previsualizar»."); };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ═══════════════════════════════════════════════════════════
  // VACIAR EL MAZO DE FLASHCARDS POR COMPLETO
  // ═══════════════════════════════════════════════════════════
  const clearAllFlashcards = async () => {
    if (deck.length === 0) { showToast("El mazo ya está vacío"); return; }
    if (!confirm(`¿Borrar TODAS las flashcards (${deck.length})? Se perderá todo el progreso de repetición espaciada.`)) return;
    if (!confirm("Confirma de nuevo: esta acción vacía el mazo por completo y no se puede deshacer.")) return;
    await saveDeck([]);
    setFcIdx(0); setFlipped(false);
    showToast("🗑️ Mazo vaciado");
  };

  // ═══════════════════════════════════════════════════════════
  // EDITAR UNA PREGUNTA EXISTENTE (desde el gestor)
  // ═══════════════════════════════════════════════════════════
  const startEdit = (q) => setEditing({ ...q, o: { ...q.o }, t: [...(q.t || [])] });
  const saveEdit = async () => {
    const q = editing;
    if (!q) return;
    const issues = validateQuestion(q);
    if (issues.length && !confirm(`Esta pregunta tiene avisos (${issues.join(", ")}). ¿Guardar de todas formas?`)) return;
    const subj = q.s;
    const k = subjectKey(subj);
    const arr = await load(k, []);
    const updated = arr.map(x => x.id === q.id
      ? { ...x, e: q.e, o: q.o, c: q.c, x: q.x, r: q.r, t: q.t, pa: q.pa }
      : x);
    const ok = await persistSubject(subj, updated);
    if (ok) { setEditing(null); showToast("✅ Pregunta actualizada"); }
    else showToast("❌ Error al guardar");
  };

  // ═══════════════════════════════════════════════════════════
  // ESQUEMAS: guardar, importar y comparar respuestas
  // ═══════════════════════════════════════════════════════════
  const persistSchemas = async (subj, arr) => {
    const ok = await save(schemaKey(subj), arr);
    if (!ok) return false;
    setSchemas(prev => [...prev.filter(x => x.s !== subj), ...arr]);
    return true;
  };

  // Normaliza texto para comparación indulgente (sin acentos, signos ni mayúsculas)
  const normTxt = (s) => String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9áéíóúñ ]/gi, " ").replace(/\s+/g, " ").trim();
  // ¿La respuesta escrita coincide razonablemente con la esperada?
  const schemaMatch = (written, expected) => {
    const a = normTxt(written), b = normTxt(expected);
    if (!a) return false;
    if (a === b) return true;
    // coincidencia si uno contiene al otro (para respuestas largas) y es suficientemente sustancial
    if (b.length >= 4 && (a.includes(b) || b.includes(a))) return true;
    return false;
  };

  const parseSchemaImport = () => {
    setImpSchemaMsg(""); setImpSchemaPreview(null);
    if (!impSchemaText.trim()) { setImpSchemaMsg("Pega el JSON del esquema antes de previsualizar."); return; }
    let data;
    try { data = JSON.parse(impSchemaText); } catch (e) { setImpSchemaMsg("❌ JSON inválido: " + e.message); return; }
    const arr = Array.isArray(data) ? data : [data];
    const normalized = [];
    const errors = [];
    arr.forEach((raw, i) => {
      const n = normalizeSchema(raw, i, schSubject);
      if (!n || !n.t) { errors.push(i + 1); return; }
      normalized.push(n);
    });
    if (normalized.length === 0) { setImpSchemaMsg(`❌ Ningún esquema válido (revisa que tenga "tema" y "secciones"). Filas con error: ${errors.join(", ")}`); return; }
    setImpSchemaPreview({ normalized, errors });
    setImpSchemaMsg(`✓ ${normalized.length} esquema(s) listo(s)${errors.length ? ` · ${errors.length} descartado(s)` : ""}`);
  };

  const confirmSchemaImport = async () => {
    if (!impSchemaPreview) return;
    // Agrupar por asignatura
    const bySubject = {};
    impSchemaPreview.normalized.forEach(sc => { (bySubject[sc.s] = bySubject[sc.s] || []).push(sc); });
    let total = 0;
    for (const subj of Object.keys(bySubject)) {
      const existing = await load(schemaKey(subj), []);
      // Reemplaza el esquema del mismo tema; añade los nuevos
      const incoming = bySubject[subj];
      const incomingTemas = new Set(incoming.map(x => x.t));
      const kept = existing.filter(x => !incomingTemas.has(x.t));
      const merged = [...kept, ...incoming];
      const ok = await persistSchemas(subj, merged);
      if (!ok) { setImpSchemaMsg("❌ Error al guardar (¿espacio lleno?)"); return; }
      total += incoming.length;
    }
    computeStorage();
    showToast(`✅ ${total} esquema(s) guardado(s)`);
    setImpSchemaText(""); setImpSchemaPreview(null); setImpSchemaMsg("");
  };

  const onSchemaFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImpSchemaText(String(reader.result)); setImpSchemaPreview(null); setImpSchemaMsg("📂 Archivo cargado. Pulsa «Previsualizar»."); };
    reader.readAsText(file);
    e.target.value = "";
  };

  const deleteSchema = async (sc) => {
    if (!confirm(`¿Eliminar el esquema de "${sc.t}"?`)) return;
    const existing = await load(schemaKey(sc.s), []);
    await persistSchemas(sc.s, existing.filter(x => x.id !== sc.id));
    setSchId(null);
    showToast("🗑️ Esquema eliminado");
  };

  const openSchema = (sc) => { setSchId(sc.id); setSchAnswers({}); setSchRevealed(false); };

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
    {id:"esquemas", l:"Esquemas"},
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
  // PESTAÑA: ESQUEMAS (recuperación estructurada previa)
  // ───────────────────────────────────────────────
  if (tab === "esquemas") {
    const subjSchemas = schemas.filter(sc => sc.s === schSubject);
    const current = schId ? schemas.find(sc => sc.id === schId) : null;
    const subjectsWithSchemas = Object.keys(SUBJECTS).filter(s => schemas.some(sc => sc.s === s));

    // Vista de un esquema concreto (rellenar huecos)
    if (current) {
      let totalItems = 0, correctItems = 0;
      current.secciones.forEach((sec, si) => sec.items.forEach((it, ii) => {
        totalItems++;
        if (schRevealed && schemaMatch(schAnswers[`${si}_${ii}`], it.respuesta)) correctItems++;
      }));
      const pct = totalItems ? Math.round(correctItems / totalItems * 100) : 0;
      return wrap(
        <div>
          <div style={card({marginBottom:12})}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:6, flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:11, fontWeight:800, color:C.v500, letterSpacing:1.5}}>📋 ESQUEMA PREVIO</div>
                <div style={{fontWeight:900, fontSize:18, color:C.ink, letterSpacing:-.3, marginTop:3}}>{current.t}</div>
                <div style={{fontSize:12, color:C.muted, marginTop:2}}>{current.s}</div>
              </div>
              <button onClick={()=>{ setSchId(null); setSchRevealed(false); setSchAnswers({}); }} style={pillBtn(false, {pad:"8px 14px", ghost:true})}>← Temas</button>
            </div>
            <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6}}>
              Rellena de memoria los huecos que recuerdes. Aunque falles, este esfuerzo prepara el repaso. Cuando termines, pulsa <strong>Comprobar</strong>.
            </div>
            {schRevealed && (
              <div style={{marginTop:12, padding:"10px 14px", borderRadius:14, background: pct>=70?"#F0FDF4":pct>=40?"#FFFBEB":"#FEF2F2", border:`1px solid ${pct>=70?C.ok:pct>=40?C.warn:C.err}44`, fontSize:13, fontWeight:700, color: pct>=70?"#065F46":pct>=40?"#92400E":"#7F1D1D"}}>
                Recordaste {correctItems} de {totalItems} ({pct}%)
              </div>
            )}
          </div>

          {current.secciones.map((sec, si) => (
            <div key={si} style={card({marginBottom:12})}>
              {sec.titulo && <div style={{fontWeight:800, fontSize:14.5, color:C.ink, marginBottom:12, paddingBottom:9, borderBottom:`2px solid ${C.v100}`}}>{sec.titulo}</div>}
              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                {sec.items.map((it, ii) => {
                  const key = `${si}_${ii}`;
                  const written = schAnswers[key] || "";
                  const ok = schRevealed && schemaMatch(written, it.respuesta);
                  return (
                    <div key={ii} style={{display:"flex", gap:10, alignItems:"flex-start", flexWrap:"wrap"}}>
                      {it.pista && <div style={{flex:"0 0 auto", minWidth:90, maxWidth:200, fontSize:13, fontWeight:700, color:C.v700, paddingTop:9}}>{it.pista}</div>}
                      <div style={{flex:1, minWidth:180}}>
                        <input
                          value={written}
                          onChange={e=>setSchAnswers(p=>({...p, [key]:e.target.value}))}
                          disabled={schRevealed}
                          placeholder="Escribe lo que recuerdes…"
                          style={{width:"100%", padding:"9px 13px", borderRadius:11, fontSize:13.5, color:C.ink, fontFamily:"inherit", outline:"none",
                            border:`1.5px solid ${schRevealed ? (ok?C.ok:C.warn) : C.line}`,
                            background: schRevealed ? (ok?"#F0FDF4":"#FFFBEB") : C.surface}}/>
                        {schRevealed && (
                          <div style={{marginTop:5, fontSize:12.5, lineHeight:1.5, color: ok?"#065F46":"#92400E"}}>
                            {ok ? "✓ " : "✗ Respuesta: "}<strong>{it.respuesta}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:4}}>
            {!schRevealed ? (
              <button onClick={()=>setSchRevealed(true)} style={{...pillBtn(true, {pad:"13px 24px"}), background:`linear-gradient(135deg, ${C.v800}, ${C.v500})`, flex:1}}>✅ Comprobar</button>
            ) : (
              <button onClick={()=>{ setSchRevealed(false); setSchAnswers({}); }} style={{...pillBtn(true, {pad:"13px 24px"}), flex:1}}>🔄 Repetir esquema</button>
            )}
            <button onClick={()=>{ setSubject(current.s); setSelTopics([current.t]); setStep(3); setSchId(null); setTab("home"); }}
              style={{...pillBtn(false, {pad:"13px 20px"}), background:C.v50}}>🚀 Examen de este tema</button>
          </div>
        </div>
      );
    }

    // Lista de esquemas por asignatura
    return wrap(
      <div>
        <div style={card({marginBottom:14})}>
          <div style={{fontWeight:900, fontSize:18, color:C.ink, letterSpacing:-.3, marginBottom:6}}>📋 Esquemas previos</div>
          <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:4}}>
            Antes de repasar un tema, intenta reconstruir su esquema de memoria (cambios de manuales, trastornos del capítulo, modelos y autores…). Recuperar la estructura antes de estudiar fija mucho mejor el contenido.
          </div>
          {subjectsWithSchemas.length === 0 && (
            <div style={{marginTop:12, padding:"12px 14px", background:C.v50, borderRadius:12, fontSize:12.5, color:C.v700, lineHeight:1.6}}>
              Aún no hay esquemas. Ve a la pestaña <strong>Importar</strong> → <strong>Importar esquemas</strong> y pega el JSON generado por tu prompt.
            </div>
          )}
        </div>

        {subjectsWithSchemas.length > 0 && (
          <div style={card()}>
            <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Asignatura</div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14}}>
              {subjectsWithSchemas.map(s => (
                <button key={s} onClick={()=>setSchSubject(s)} style={pillBtn(schSubject===s, {pad:"7px 14px", size:12})}>
                  {s} <span style={{opacity:.7, fontSize:10.5, marginLeft:4}}>({schemas.filter(sc=>sc.s===s).length})</span>
                </button>
              ))}
            </div>
            {subjSchemas.length === 0 ? (
              <div style={{fontSize:12.5, color:C.muted, fontStyle:"italic", padding:"8px 0"}}>No hay esquemas en esta asignatura.</div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {subjSchemas.map(sc => (
                  <div key={sc.id} style={{display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:14, border:`1.5px solid ${C.line}`, background:C.surface}}>
                    <div onClick={()=>openSchema(sc)} style={{flex:1, cursor:"pointer"}}>
                      <div style={{fontWeight:700, fontSize:14, color:C.ink}}>{sc.t}</div>
                      <div style={{fontSize:11.5, color:C.muted, marginTop:2}}>
                        {sc.secciones.length} sección(es) · {sc.secciones.reduce((n,se)=>n+se.items.length,0)} huecos
                      </div>
                    </div>
                    <button onClick={()=>openSchema(sc)} style={pillBtn(true, {pad:"8px 16px", size:12.5})}>Estudiar →</button>
                    <button onClick={()=>deleteSchema(sc)} title="Eliminar esquema" style={{background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:15, padding:4}}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────
  // PESTAÑA: IMPORTAR
  // ───────────────────────────────────────────────
  if (tab === "import") return wrap(
    <div>
      {/* inputs de archivo ocultos */}
      <input ref={importFileRef} type="file" accept="application/json,.json" onChange={onImportFile} style={{display:"none"}} />
      <input ref={backupFileRef} type="file" accept="application/json,.json" onChange={onBackupFile} style={{display:"none"}} />

      {/* ─── BLOQUE: Copia de seguridad ─── */}
      <div style={card({marginBottom:14, border:`1.5px solid ${C.v200}`})}>
        <div style={{fontWeight:900, fontSize:17, color:C.ink, marginBottom:6}}>💾 Copia de seguridad</div>
        <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14}}>
          Tus preguntas viven solo en este navegador. Descarga una copia con <strong>todo</strong> (preguntas, mazo y estadísticas) y guárdala a buen recaudo. Si cambias de equipo o se borran los datos, podrás restaurarla. Hazlo a menudo.
        </div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <button onClick={exportAllBackup} style={{...pillBtn(true, {pad:"11px 20px"}), background:C.ok}}>⬇️ Descargar copia completa</button>
          <button onClick={()=>backupFileRef.current && backupFileRef.current.click()} style={pillBtn(false, {pad:"11px 18px"})}>♻️ Restaurar desde archivo</button>
        </div>
        <div style={{marginTop:14}}>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:C.muted, fontWeight:600, marginBottom:5}}>
            <span>Espacio usado (límite ~5 MB)</span>
            <span style={{color: storageInfo.pct>=80 ? C.err : storageInfo.pct>=60 ? C.warn : C.v700, fontWeight:800}}>
              {fmtBytes(storageInfo.used)} · {storageInfo.pct}%
            </span>
          </div>
          <div style={{background:C.v50, borderRadius:99, height:7, overflow:"hidden"}}>
            <div style={{height:7, borderRadius:99, width:`${storageInfo.pct}%`, transition:"width .4s", background: storageInfo.pct>=80 ? C.err : storageInfo.pct>=60 ? C.warn : `linear-gradient(90deg, ${C.v700}, ${C.v500})`}}/>
          </div>
          {storageInfo.pct >= 80 && (
            <div style={{marginTop:8, fontSize:11.5, color:C.err, fontWeight:600, lineHeight:1.5}}>
              ⚠️ Cerca del límite. Descarga una copia y considera depurar preguntas para no perder datos.
            </div>
          )}
        </div>
      </div>

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

        <label style={{display:"flex", alignItems:"center", gap:8, marginTop:10, fontSize:12.5, color:C.ink, cursor:"pointer", userSelect:"none"}}>
          <input type="checkbox" checked={impShuffle} onChange={e=>setImpShuffle(e.target.checked)} style={{width:16, height:16, accentColor:C.v600, cursor:"pointer"}} />
          Barajar el orden de las opciones al importar <span style={{color:C.muted}}>(evita memorizar la letra)</span>
        </label>

        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <button onClick={parseImport} style={pillBtn(true, {pad:"10px 20px"})}>👁 Previsualizar</button>
          <button onClick={()=>importFileRef.current && importFileRef.current.click()} style={pillBtn(false, {pad:"10px 16px"})}>📂 Cargar desde archivo</button>
          <button onClick={()=>{setImpText(""); setImpPreview(null); setImpMsg("");}} style={pillBtn(false, {pad:"10px 16px", ghost:true})}>Limpiar</button>
        </div>

        {impMsg && (
          <div style={{
            marginTop:12, padding:11, borderRadius:11,
            background: impMsg.startsWith("❌") ? "#FEF2F2" : (impMsg.startsWith("✓")||impMsg.startsWith("✅")) ? "#F0FDF4" : C.v50,
            border:`1px solid ${impMsg.startsWith("❌") ? C.err+"55" : (impMsg.startsWith("✓")||impMsg.startsWith("✅")) ? C.ok+"55" : C.v200}`,
            color: impMsg.startsWith("❌") ? C.err : (impMsg.startsWith("✓")||impMsg.startsWith("✅")) ? "#065F46" : C.v700,
            fontSize:13, fontWeight:600
          }}>{impMsg}</div>
        )}

        {impPreview && (
          <div style={{marginTop:14, padding:14, background:C.v50, borderRadius:14, border:`1px solid ${C.v200}`}}>
            <div style={{fontWeight:800, fontSize:13, color:C.v700, marginBottom:8}}>
              Vista previa → {impPreview.subject}
            </div>
            <div style={{display:"flex", gap:7, flexWrap:"wrap", marginBottom:10, fontSize:11.5, fontWeight:700}}>
              <span style={{padding:"3px 10px", borderRadius:99, background:"#F0FDF4", color:"#065F46", border:`1px solid ${C.ok}44`}}>{impPreview.fresh} nuevas</span>
              {(impPreview.dupExisting + impPreview.dupInternal) > 0 && (
                <span style={{padding:"3px 10px", borderRadius:99, background:"#FFFBEB", color:"#92400E", border:`1px solid ${C.warn}55`}}>{impPreview.dupExisting + impPreview.dupInternal} duplicadas (se omiten)</span>
              )}
              {impPreview.withIssues > 0 && (
                <span style={{padding:"3px 10px", borderRadius:99, background:"#FEF2F2", color:C.err, border:`1px solid ${C.err}44`}}>{impPreview.withIssues} con avisos</span>
              )}
              {impPreview.errors.length > 0 && (
                <span style={{padding:"3px 10px", borderRadius:99, background:C.surface, color:C.muted, border:`1px solid ${C.line}`}}>{impPreview.errors.length} descartadas</span>
              )}
            </div>
            <div style={{maxHeight:200, overflowY:"auto", fontSize:11.5, color:C.muted, lineHeight:1.6}}>
              {impPreview.normalized.slice(0, 8).map((q,i) => (
                <div key={i} style={{padding:"6px 0", borderBottom:`1px solid ${C.v100}`, opacity: q._dup ? .5 : 1}}>
                  <strong style={{color:C.ink}}>{i+1}.</strong> {q.e.slice(0, 100)}…
                  <div style={{fontSize:10.5, marginTop:2, display:"flex", gap:6, flexWrap:"wrap"}}>
                    <span style={{color:C.v500}}>Tema: {(q.t||[]).join(", ")}</span>
                    {q._dup && <span style={{color:C.warn, fontWeight:700}}>· duplicada</span>}
                    {q._issues && q._issues.length > 0 && <span style={{color:C.err, fontWeight:700}}>· ⚠ {q._issues.join(", ")}</span>}
                  </div>
                </div>
              ))}
              {impPreview.normalized.length > 8 && <div style={{padding:"6px 0", fontStyle:"italic"}}>… y {impPreview.normalized.length - 8} más</div>}
            </div>
            <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
              <button onClick={()=>confirmImport("append")} disabled={impPreview.fresh===0} style={{...pillBtn(true, {pad:"10px 18px"}), background: impPreview.fresh===0 ? "#A0AEC0" : C.ok, cursor: impPreview.fresh===0 ? "not-allowed":"pointer"}}>
                ➕ Añadir {impPreview.fresh} nuevas al banco
              </button>
              <button onClick={()=>{
                if (confirm(`¿Reemplazar TODO el banco de "${impPreview.subject}" por estas preguntas?`)) confirmImport("replace");
              }} style={{...pillBtn(true, {pad:"10px 18px"}), background:C.warn}}>
                🔁 Reemplazar banco completo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── BLOQUE: Importar esquemas ─── */}
      <input ref={schemaFileRef} type="file" accept="application/json,.json" onChange={onSchemaFile} style={{display:"none"}} />
      <div style={card({marginBottom:14})}>
        <div style={{fontWeight:900, fontSize:17, color:C.ink, marginBottom:6}}>📋 Importar esquemas</div>
        <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14}}>
          Pega el JSON de uno o varios esquemas (uno por tema). Formato: <code style={{background:C.v50, padding:"1px 5px", borderRadius:4}}>{`{ asignatura, tema, secciones:[{ titulo, items:[{ pista, respuesta }] }] }`}</code>. Si ya existe un esquema para ese tema, se reemplaza.
        </div>
        <textarea
          value={impSchemaText}
          onChange={e => setImpSchemaText(e.target.value)}
          placeholder='[{"asignatura":"Clínica Adultos","tema":"Trastornos de ansiedad","secciones":[{"titulo":"Cambios DSM-5 / CIE-11","items":[{"pista":"TOC y TEPT","respuesta":"salen del capítulo de ansiedad"}]}]}]'
          style={{width:"100%", minHeight:160, padding:12, borderRadius:12, border:`1.5px solid ${C.line}`, fontFamily:"ui-monospace, monospace", fontSize:12, lineHeight:1.5, resize:"vertical", color:C.ink, background:C.bg, outline:"none"}}
        />
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <button onClick={parseSchemaImport} style={pillBtn(true, {pad:"10px 20px"})}>👁 Previsualizar</button>
          <button onClick={()=>schemaFileRef.current && schemaFileRef.current.click()} style={pillBtn(false, {pad:"10px 16px"})}>📂 Cargar desde archivo</button>
          <button onClick={()=>{setImpSchemaText(""); setImpSchemaPreview(null); setImpSchemaMsg("");}} style={pillBtn(false, {pad:"10px 16px", ghost:true})}>Limpiar</button>
        </div>
        {impSchemaMsg && (
          <div style={{marginTop:12, padding:11, borderRadius:11,
            background: impSchemaMsg.startsWith("❌") ? "#FEF2F2" : (impSchemaMsg.startsWith("✓")||impSchemaMsg.startsWith("✅")) ? "#F0FDF4" : C.v50,
            border:`1px solid ${impSchemaMsg.startsWith("❌") ? C.err+"55" : (impSchemaMsg.startsWith("✓")||impSchemaMsg.startsWith("✅")) ? C.ok+"55" : C.v200}`,
            color: impSchemaMsg.startsWith("❌") ? C.err : (impSchemaMsg.startsWith("✓")||impSchemaMsg.startsWith("✅")) ? "#065F46" : C.v700,
            fontSize:13, fontWeight:600}}>{impSchemaMsg}</div>
        )}
        {impSchemaPreview && (
          <div style={{marginTop:14, padding:14, background:C.v50, borderRadius:14, border:`1px solid ${C.v200}`}}>
            <div style={{fontWeight:800, fontSize:13, color:C.v700, marginBottom:8}}>{impSchemaPreview.normalized.length} esquema(s):</div>
            <div style={{maxHeight:180, overflowY:"auto", fontSize:12, color:C.muted, lineHeight:1.6}}>
              {impSchemaPreview.normalized.map((sc,i) => (
                <div key={i} style={{padding:"6px 0", borderBottom:`1px solid ${C.v100}`}}>
                  <strong style={{color:C.ink}}>{sc.t}</strong> <span style={{color:C.v500}}>· {sc.s}</span>
                  <div style={{fontSize:10.5, marginTop:2}}>{sc.secciones.length} sección(es) · {sc.secciones.reduce((n,se)=>n+se.items.length,0)} huecos</div>
                </div>
              ))}
            </div>
            <button onClick={confirmSchemaImport} style={{...pillBtn(true, {pad:"10px 18px"}), background:C.ok, marginTop:12}}>➕ Guardar esquemas</button>
          </div>
        )}
      </div>

      {/* ─── BLOQUE: Revisar y depurar preguntas (borrado individual) ─── */}
      <div style={card({marginBottom:14})}>
        <div style={{fontWeight:900, fontSize:17, color:C.ink, marginBottom:6}}>🗂️ Revisar y depurar preguntas</div>
        <div style={{fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14}}>
          Revisa las preguntas del banco una a una y elimina las que estén mal hechas, sean demasiado específicas o no te convenzan. Solo se borra esa pregunta; el resto se conserva.
        </div>

        {Object.keys(SUBJECTS).filter(s => (bankSizes[s] || 0) > 0).length === 0 ? (
          <div style={{fontSize:12, color:C.muted, fontStyle:"italic"}}>Aún no hay preguntas en ningún banco. Importa primero un JSON arriba.</div>
        ) : (
          <>
            <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Asignatura</div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14}}>
              {Object.keys(SUBJECTS).filter(s => (bankSizes[s] || 0) > 0).map(s => (
                <button key={s} onClick={()=>{setMgrSubject(s); setMgrTopic("__all__"); setMgrExpanded(null);}} style={pillBtn(mgrSubject===s, {pad:"7px 14px", size:12})}>
                  {s} <span style={{opacity:.7, fontSize:10.5, marginLeft:4}}>({bankSizes[s] || 0})</span>
                </button>
              ))}
            </div>

            {(bankSizes[mgrSubject] || 0) > 0 && SUBJECTS[mgrSubject].some(t => bank.some(q => q.s===mgrSubject && (q.t||[]).includes(t))) && (
              <>
                <div style={{fontSize:11.5, fontWeight:700, color:C.muted, letterSpacing:.6, marginBottom:7, textTransform:"uppercase"}}>Tema</div>
                <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, maxHeight:140, overflowY:"auto"}}>
                  <button onClick={()=>{setMgrTopic("__all__"); setMgrExpanded(null);}} style={pillBtn(mgrTopic==="__all__", {pad:"7px 14px", size:12})}>✓ Todos los temas</button>
                  {SUBJECTS[mgrSubject].filter(t => bank.some(q => q.s===mgrSubject && (q.t||[]).includes(t))).map(t => {
                    const count = bank.filter(q => q.s===mgrSubject && (q.t||[]).includes(t)).length;
                    return (
                      <button key={t} onClick={()=>{setMgrTopic(t); setMgrExpanded(null);}} style={pillBtn(mgrTopic===t, {pad:"7px 14px", size:12})}>
                        {t} <span style={{opacity:.7, fontSize:10.5, marginLeft:4}}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <input
              value={mgrSearch}
              onChange={e=>setMgrSearch(e.target.value)}
              placeholder="🔎 Buscar por texto del enunciado…"
              style={{width:"100%", padding:"10px 13px", borderRadius:12, border:`1.5px solid ${C.line}`, fontSize:13, color:C.ink, background:C.bg, outline:"none", fontFamily:"inherit", marginBottom:12}}
            />

            {(() => {
              const needle = mgrSearch.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
              const pool = bank.filter(q => {
                if (q.s !== mgrSubject) return false;
                if (mgrTopic !== "__all__" && !(q.t||[]).includes(mgrTopic)) return false;
                if (needle) {
                  const hay = ((q.e||"") + " " + Object.values(q.o||{}).join(" ")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
                  if (!hay.includes(needle)) return false;
                }
                return true;
              });
              if (pool.length === 0) {
                return <div style={{fontSize:12, color:C.muted, fontStyle:"italic", padding:"10px 0"}}>{mgrSearch ? "Ninguna pregunta coincide con la búsqueda." : "No hay preguntas con este filtro."}</div>;
              }
              return (
                <>
                  <div style={{fontSize:12, color:C.v700, fontWeight:700, marginBottom:8}}>{pool.length} pregunta{pool.length!==1?"s":""}{mgrSearch ? " (filtradas)" : ""}</div>
                  <div style={{display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflowY:"auto"}}>
                    {pool.map((q, i) => {
                      const open = mgrExpanded === q.id;
                      const isEditing = editing && editing.id === q.id;
                      const qIssues = validateQuestion(q);
                      return (
                        <div key={q.id} style={{border:`1.5px solid ${open?C.v200:C.line}`, borderRadius:14, overflow:"hidden", background: open?C.v50:C.surface}}>
                          <div onClick={()=>{ setMgrExpanded(e => e===q.id ? null : q.id); if (isEditing) setEditing(null); }}
                            style={{display:"flex", gap:10, alignItems:"flex-start", padding:"11px 13px", cursor:"pointer"}}>
                            <span style={{fontWeight:800, color:C.v500, fontSize:12.5, minWidth:24}}>{i+1}.</span>
                            <span style={{flex:1, fontSize:13, lineHeight:1.5, color:C.ink}}>
                              {open ? q.e : (q.e.length>120 ? q.e.slice(0,120)+"…" : q.e)}
                              {qIssues.length > 0 && <span style={{marginLeft:6, fontSize:10.5, color:C.err, fontWeight:700}}>⚠</span>}
                            </span>
                            <span style={{fontSize:12, color:C.muted, flexShrink:0}}>{open ? "▲" : "▼"}</span>
                          </div>
                          {open && !isEditing && (
                            <div style={{padding:"0 13px 13px 47px"}}>
                              <div style={{display:"flex", flexDirection:"column", gap:5, marginBottom:10}}>
                                {Object.keys(q.o).map(opt => {
                                  const ic = opt === q.c;
                                  return (
                                    <div key={opt} style={{display:"flex", gap:8, padding:"7px 11px", borderRadius:10, border:`1.5px solid ${ic?C.ok:C.line}`, background: ic?"#F0FDF4":C.surface, color: ic?"#065F46":C.muted, fontSize:12.5, lineHeight:1.45}}>
                                      <span style={{fontWeight:800, minWidth:18}}>{opt})</span>
                                      <span style={{flex:1}}>{q.o[opt]}</span>
                                      {ic && <span style={{fontWeight:800}}>✓</span>}
                                    </div>
                                  );
                                })}
                              </div>
                              {q.x && <div style={{padding:10, borderRadius:11, background:"#FFFBEB", border:`1px solid ${C.warn}44`, fontSize:12, lineHeight:1.6, color:"#78350F", marginBottom:8}}>{q.x}</div>}
                              {qIssues.length > 0 && <div style={{padding:"7px 10px", borderRadius:10, background:"#FEF2F2", border:`1px solid ${C.err}33`, fontSize:11.5, color:C.err, marginBottom:8, fontWeight:600}}>⚠ Avisos: {qIssues.join(", ")}</div>}
                              <div style={{display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:10}}>
                                {(q.t||[]).map(t => <span key={t} style={tagChip("navy")}>{t}</span>)}
                                {q.origen==="oficial" && q.convocatoria && <span style={tagChip("peach")}>PIR {q.convocatoria}</span>}
                              </div>
                              <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                                <button onClick={()=>startEdit(q)}
                                  style={{padding:"8px 16px", borderRadius:11, border:`1.5px solid ${C.v300}`, background:C.v50, color:C.v700, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit"}}>
                                  ✏️ Editar
                                </button>
                                <button onClick={()=>deleteFromManager(q)}
                                  style={{padding:"8px 16px", borderRadius:11, border:`1.5px solid ${C.err}`, background:"#FEF2F2", color:C.err, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit"}}>
                                  🗑 Eliminar esta pregunta
                                </button>
                              </div>
                            </div>
                          )}
                          {open && isEditing && (
                            <div style={{padding:"0 13px 14px 13px"}}>
                              <div style={{fontSize:11, fontWeight:800, color:C.v700, letterSpacing:.5, marginBottom:6, textTransform:"uppercase"}}>Enunciado</div>
                              <textarea value={editing.e} onChange={e=>setEditing(ed=>({...ed, e:e.target.value}))}
                                style={{width:"100%", minHeight:70, padding:10, borderRadius:10, border:`1.5px solid ${C.line}`, fontSize:13, lineHeight:1.5, color:C.ink, background:C.surface, outline:"none", resize:"vertical", fontFamily:"inherit", marginBottom:10}}/>
                              <div style={{fontSize:11, fontWeight:800, color:C.v700, letterSpacing:.5, marginBottom:6, textTransform:"uppercase"}}>Opciones · marca la correcta</div>
                              <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:10}}>
                                {Object.keys(editing.o).map(opt => (
                                  <div key={opt} style={{display:"flex", gap:8, alignItems:"center"}}>
                                    <label style={{display:"flex", alignItems:"center", gap:5, fontWeight:800, color: editing.c===opt ? C.ok : C.muted, cursor:"pointer", fontSize:13}}>
                                      <input type="radio" name={`correct_${q.id}`} checked={editing.c===opt} onChange={()=>setEditing(ed=>({...ed, c:opt}))} style={{accentColor:C.ok, cursor:"pointer"}}/>
                                      {opt})
                                    </label>
                                    <input value={editing.o[opt]} onChange={e=>setEditing(ed=>({...ed, o:{...ed.o, [opt]:e.target.value}}))}
                                      style={{flex:1, padding:"8px 11px", borderRadius:10, border:`1.5px solid ${editing.c===opt?C.ok:C.line}`, fontSize:12.5, color:C.ink, background: editing.c===opt?"#F0FDF4":C.surface, outline:"none", fontFamily:"inherit"}}/>
                                  </div>
                                ))}
                              </div>
                              <div style={{fontSize:11, fontWeight:800, color:C.v700, letterSpacing:.5, marginBottom:6, textTransform:"uppercase"}}>Justificación</div>
                              <textarea value={editing.x||""} onChange={e=>setEditing(ed=>({...ed, x:e.target.value}))}
                                style={{width:"100%", minHeight:60, padding:10, borderRadius:10, border:`1.5px solid ${C.line}`, fontSize:12.5, lineHeight:1.5, color:C.ink, background:C.surface, outline:"none", resize:"vertical", fontFamily:"inherit", marginBottom:10}}/>
                              <div style={{display:"flex", gap:10, flexWrap:"wrap", marginBottom:12}}>
                                <div style={{flex:1, minWidth:160}}>
                                  <div style={{fontSize:11, fontWeight:800, color:C.v700, letterSpacing:.5, marginBottom:6, textTransform:"uppercase"}}>Referencias</div>
                                  <input value={editing.r||""} onChange={e=>setEditing(ed=>({...ed, r:e.target.value}))}
                                    style={{width:"100%", padding:"8px 11px", borderRadius:10, border:`1.5px solid ${C.line}`, fontSize:12.5, color:C.ink, background:C.surface, outline:"none", fontFamily:"inherit"}}/>
                                </div>
                                <div style={{flex:1, minWidth:160}}>
                                  <div style={{fontSize:11, fontWeight:800, color:C.v700, letterSpacing:.5, marginBottom:6, textTransform:"uppercase"}}>Temas (separados por coma)</div>
                                  <input value={(editing.t||[]).join(", ")} onChange={e=>setEditing(ed=>({...ed, t:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)}))}
                                    style={{width:"100%", padding:"8px 11px", borderRadius:10, border:`1.5px solid ${C.line}`, fontSize:12.5, color:C.ink, background:C.surface, outline:"none", fontFamily:"inherit"}}/>
                                </div>
                              </div>
                              <div style={{display:"flex", gap:8}}>
                                <button onClick={saveEdit} style={{...pillBtn(true, {pad:"9px 18px"}), background:C.ok}}>✓ Guardar cambios</button>
                                <button onClick={()=>setEditing(null)} style={pillBtn(false, {pad:"9px 16px", ghost:true})}>Cancelar</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </>
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

            <div style={card({marginBottom:11})}>
              <div style={{fontWeight:700, fontSize:14, marginBottom:10, color:C.ink}}>Modo de corrección</div>
              <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                <button onClick={()=>setImmediate(false)} style={{...softBtn(!immediate), padding:"11px 18px"}}>📝 Examen · corregir al final</button>
                <button onClick={()=>setImmediate(true)} style={{...softBtn(immediate), padding:"11px 18px"}}>⚡ Estudio · corregir al instante</button>
              </div>
              <div style={{fontSize:11.5, color:C.muted, marginTop:8, lineHeight:1.5}}>
                {immediate
                  ? "En cuanto respondas cada pregunta verás si has acertado y su explicación. Al terminar, también verás el resumen."
                  : "Respondes todo el examen y se corrige al pulsar «Entregar» (modo examen real)."}
              </div>
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
    if (!q) return wrap(<div style={card()}>No hay preguntas en este examen.</div>);
    const optKeys = Object.keys(q.o);
    const prog = Math.round(Object.keys(answers).length/questions.length*100);
    const answered = answers[curQ] !== undefined;
    const showFeedback = immediate && answered; // en modo estudio, una vez respondida se revela
    const isRight = answers[curQ] === q.c;
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
              const isCorrect = opt === q.c;
              let bg = C.surface, brd = C.line, col = C.ink, sh = "none", numCol = C.v500;
              if (showFeedback) {
                if (isCorrect) { bg = "#F0FDF4"; brd = C.ok; col = "#065F46"; numCol = C.ok; }
                else if (sel) { bg = "#FEF2F2"; brd = C.err; col = "#7F1D1D"; numCol = C.err; }
              } else if (sel) {
                bg = `linear-gradient(135deg, ${C.v700}, ${C.v500})`; brd = C.v600; col = "#fff"; sh = `0 6px 18px ${C.v700}30`; numCol = "#fff";
              }
              return (
                <button key={opt}
                  onClick={()=>{ if (showFeedback) return; setAnswers(p=>({...p, [curQ]:opt})); }}
                  disabled={showFeedback}
                  style={{display:"flex", gap:13, alignItems:"flex-start", padding:"12px 16px", borderRadius:14, border:`2px solid ${brd}`, background: bg, color: col, cursor: showFeedback ? "default" : "pointer", textAlign:"left", fontSize:14, lineHeight:1.55, fontFamily:"inherit", transition:"all .15s", boxShadow: sh}}>
                  <span style={{fontWeight:800, minWidth:24, color: numCol}}>{opt})</span>
                  <span style={{flex:1}}>{q.o[opt]}</span>
                  {showFeedback && isCorrect && <span style={{fontWeight:800}}>✓</span>}
                  {showFeedback && sel && !isCorrect && <span style={{fontWeight:800}}>✗</span>}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div style={{marginTop:14}}>
              <div style={{fontSize:13.5, fontWeight:800, color: isRight ? C.ok : C.err, marginBottom:8}}>
                {isRight ? "✓ ¡Correcta!" : `✗ Incorrecta · la respuesta correcta es ${q.c})`}
              </div>
              {q.x && (<div style={{padding:13, borderRadius:14, background:"#FFFBEB", border:`1px solid ${C.warn}55`, fontSize:13, lineHeight:1.7, color:"#78350F"}}>{q.x}</div>)}
              {q.r && (<div style={{marginTop:8, padding:11, borderRadius:14, background:C.v50, border:`1px solid ${C.v200}`, fontSize:12, color:C.v700, lineHeight:1.6}}><strong>📚 Refs:</strong> {q.r}</div>)}
            </div>
          )}
          <div style={{marginTop:16, textAlign:"right"}}>
            <button onClick={deleteExamQuestion} style={{background:"transparent", border:"none", color:C.muted, fontSize:11.5, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline", padding:4}}>
              🗑 Eliminar esta pregunta del banco
            </button>
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
    if (!q) return wrap(<div style={card()}>No hay preguntas que mostrar.</div>);
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
          <div style={{marginTop:14, textAlign:"right"}}>
            <button onClick={deleteExamQuestion} style={{background:"transparent", border:"none", color:C.muted, fontSize:11.5, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline", padding:4}}>
              🗑 Eliminar esta pregunta del banco
            </button>
          </div>
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
        <button onClick={finishExam}
          style={{width:"100%", marginTop:14, padding:"14px 18px", borderRadius:999, border:"none", background:`linear-gradient(135deg, ${C.v800}, ${C.v500})`, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", letterSpacing:.3, boxShadow:`0 8px 22px ${C.v700}40`}}>
          🏁 Finalizar y volver al inicio
        </button>
      </div>
    );
  }

  // FLASHCARDS
  if (tab==="flashcards") return wrap(
    <div>
      <div style={{background:`linear-gradient(160deg, ${C.navy} 0%, ${C.navy2} 100%)`, color:"#fff", borderRadius:22, padding:"18px 22px", marginBottom:14, boxShadow:"0 10px 28px rgba(27,22,64,.25)"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:12}}>
          <div style={{fontWeight:800, fontSize:14}}>Flashcards</div>
          {deck.length > 0 && (
            <button onClick={clearAllFlashcards}
              style={{background:"rgba(239,68,68,.18)", border:"1px solid rgba(239,68,68,.5)", color:"#FCA5A5", borderRadius:99, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:.3}}>
              🗑 Vaciar mazo
            </button>
          )}
        </div>
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
