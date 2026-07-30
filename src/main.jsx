// Shim de window.storage compatible con la API del artefacto de Claude.
// Backend: IndexedDB (sin el techo de ~5 MB de localStorage).
// - Migra automáticamente los datos previos de localStorage la primera vez.
// - Si IndexedDB no está disponible (p. ej. incógnito estricto), cae a localStorage.
// - Si una escritura falla de verdad, LANZA el error para que `save` en Angie.jsx lo detecte.
if (typeof window !== "undefined" && !window.storage) {
  const DB_NAME = "r0pir";
  const STORE = "kv";
  const MIGRATED_FLAG = "__migrated_ls__";
  // Prefijos de claves que usa la app y que hay que migrar desde localStorage.
  const LS_PREFIXES = ["pir:", "bank:", "schema:"];

  // ── Fallback: mismo comportamiento que la versión anterior (localStorage) ──
  const lsBackend = {
    async get(key) {
      const v = localStorage.getItem(key);
      if (v === null) return null;
      return { key, value: v, shared: false };
    },
    async set(key, value) {
      try {
        localStorage.setItem(key, value);
        return { key, value, shared: false };
      } catch (e) {
        // Lanzamos para que `save` (try/catch) lo capture y avise.
        throw e;
      }
    },
    async delete(key) {
      const had = localStorage.getItem(key) !== null;
      localStorage.removeItem(key);
      return { key, deleted: had, shared: false };
    },
    async list(prefix = "") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return { keys, prefix, shared: false };
    }
  };

  // ── Utilidades IndexedDB ──
  const req2promise = (req) =>
    new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

  const openDB = () =>
    new Promise((resolve, reject) => {
      let req;
      try {
        req = indexedDB.open(DB_NAME, 1);
      } catch (e) {
        reject(e);
        return;
      }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error("IndexedDB bloqueada"));
    });

  const store = (db, mode) => db.transaction(STORE, mode).objectStore(STORE);

  // Migración one-time: copia de localStorage a IndexedDB las claves de la app.
  const migrate = async (db) => {
    try {
      const already = await req2promise(store(db, "readonly").get(MIGRATED_FLAG));
      if (already) return;
    } catch { /* si falla la lectura del flag, intentamos migrar igualmente */ }
    try {
      const os = store(db, "readwrite");
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (LS_PREFIXES.some((pre) => k.startsWith(pre))) {
          const v = localStorage.getItem(k);
          if (v !== null) os.put(v, k);
        }
      }
      os.put(true, MIGRATED_FLAG);
      // No borramos localStorage: se conserva como copia de seguridad.
    } catch (e) {
      console.warn("Migración localStorage → IndexedDB incompleta:", e);
    }
  };

  let dbPromise = null;
  let useLS = false; // se activa si IndexedDB no está disponible

  const ready = async () => {
    if (useLS) return null;
    if (!dbPromise) {
      dbPromise = (async () => {
        const db = await openDB();
        await migrate(db);
        return db;
      })();
    }
    try {
      return await dbPromise;
    } catch (e) {
      console.warn("IndexedDB no disponible, usando localStorage:", e);
      useLS = true;
      dbPromise = null;
      return null;
    }
  };

  window.storage = {
    async get(key) {
      const db = await ready();
      if (!db) return lsBackend.get(key);
      const v = await req2promise(store(db, "readonly").get(key));
      if (v === undefined || v === null) return null;
      return { key, value: v, shared: false };
    },

    async set(key, value) {
      const db = await ready();
      if (!db) return lsBackend.set(key, value);
      try {
        await req2promise(store(db, "readwrite").put(value, key));
        return { key, value, shared: false };
      } catch (e) {
        console.error("storage.set (IndexedDB) falló:", e);
        // Lanzamos para que `save` en Angie.jsx devuelva false y la app avise.
        throw e;
      }
    },

    async delete(key) {
      const db = await ready();
      if (!db) return lsBackend.delete(key);
      const existed = await req2promise(store(db, "readonly").get(key));
      await req2promise(store(db, "readwrite").delete(key));
      return { key, deleted: existed !== undefined && existed !== null, shared: false };
    },

    async list(prefix = "") {
      const db = await ready();
      if (!db) return lsBackend.list(prefix);
      const all = await req2promise(store(db, "readonly").getAllKeys());
      const keys = (all || [])
        .filter((k) => typeof k === "string" && k !== MIGRATED_FLAG && k.startsWith(prefix));
      return { keys, prefix, shared: false };
    }
  };
}

import React from "react";
import ReactDOM from "react-dom/client";
import Angie from "./Angie.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Angie />
  </React.StrictMode>
);
