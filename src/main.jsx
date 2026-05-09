// Shim de window.storage compatible con la API del artefacto de Claude.
// Usa localStorage para persistir entre sesiones.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
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
        console.error("storage.set falló:", e);
        return null;
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
}

import React from "react";
import ReactDOM from "react-dom/client";
import Angie from "./Angie.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Angie />
  </React.StrictMode>
);
