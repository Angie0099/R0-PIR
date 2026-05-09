# R0 PIR · Examinador con IA

App de preparación PIR (Psicólogo Interno Residente) con banco de preguntas, exámenes simulados y flashcards de repetición espaciada.

## Cómo desplegar

Ver [INSTRUCCIONES_DESPLIEGUE.md](./INSTRUCCIONES_DESPLIEGUE.md).

## Cómo editar

1. Pide a Claude el cambio que quieras.
2. Claude te da el código actualizado del archivo `src/Angie.jsx`.
3. Vas a tu repositorio de GitHub → archivo `src/Angie.jsx` → botón ✏️ → reemplaza el contenido → "Commit changes".
4. Vercel detecta el cambio y redespliega solo en ~30 segundos.

## Estructura

- `src/Angie.jsx` — el componente principal de la app (todo el código vive aquí).
- `src/main.jsx` — punto de entrada de React + shim de `window.storage` que usa `localStorage`.
- `index.html` — HTML base.
- `package.json` — dependencias (React + Vite).
- `vite.config.js` — configuración de Vite.

## Licencia

Uso personal.
