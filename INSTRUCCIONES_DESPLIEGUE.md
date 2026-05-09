# Cómo desplegar la app en Vercel + GitHub

Tiempo estimado: 20-30 minutos. No hace falta saber programar.

---

## Paso 1 — Crear cuenta de GitHub

1. Ve a [github.com](https://github.com).
2. Click en **"Sign up"** (esquina superior derecha).
3. Email, contraseña, nombre de usuario (elige uno corto que te guste, será visible). Por ejemplo: `andrea-pir`.
4. Verifica el email.

## Paso 2 — Crear un repositorio nuevo

1. Una vez dentro de GitHub, click en el botón **"+"** (arriba derecha) → **"New repository"**.
2. **Repository name**: `r0-pir` (o el nombre que quieras).
3. **Description** (opcional): "Mi app PIR".
4. Marca **"Public"** (o "Private" si prefieres, igual funciona en Vercel gratis).
5. **NO** marques nada más (ni README, ni .gitignore, ni licencia — los traemos nosotros).
6. Click en **"Create repository"**.

Te llevará a una página vacía con instrucciones. **Ignóralas todas**, vamos a subir los archivos por la web.

## Paso 3 — Subir los archivos del proyecto

En la misma página, busca el enlace **"uploading an existing file"** (suele estar en una línea que dice "or push an existing repository...").

Si no lo ves, navega hasta:
```
https://github.com/TU-USUARIO/r0-pir/upload/main
```
(reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub)

Verás una zona donde **arrastrar y soltar archivos**.

### Qué archivos subir

Descomprime el ZIP que te he preparado. Tendrás una carpeta `r0-pir-app` con:

```
r0-pir-app/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── INSTRUCCIONES_DESPLIEGUE.md
└── src/
    ├── main.jsx
    └── Angie.jsx
```

### Cómo subirlos

1. Abre la carpeta `r0-pir-app` en tu explorador de archivos.
2. **Selecciona TODOS los archivos y la subcarpeta `src`** (Ctrl+A o seleccionando uno a uno).
3. **Arrástralos a la zona de "drag files here"** del navegador.
4. GitHub los subirá manteniendo la estructura (la carpeta `src` se sube como tal).

### Confirmar

1. Abajo, en **"Commit changes"**:
   - Mensaje: `Initial commit` (o lo que quieras).
   - Marca "Commit directly to the `main` branch".
2. Click **"Commit changes"**.

GitHub te llevará a la vista del repositorio con todos los archivos arriba. ✅

## Paso 4 — Crear cuenta de Vercel

1. Ve a [vercel.com](https://vercel.com).
2. Click en **"Sign Up"**.
3. Elige **"Continue with GitHub"** → te pide autorizar Vercel a leer tus repositorios → acepta.
4. Te creará la cuenta automáticamente.
5. Si te pide elegir un plan, selecciona el **"Hobby"** (gratuito, para uso personal).

## Paso 5 — Desplegar el repositorio

1. En el dashboard de Vercel, click en **"Add New..."** → **"Project"**.
2. Te muestra una lista de tus repositorios de GitHub.
3. Busca **"r0-pir"** (el que acabas de crear).
4. Click en **"Import"** al lado.

### Configuración del proyecto

Vercel detectará que es un proyecto Vite y rellenará casi todo solo:

- **Framework Preset**: Vite (lo detecta solo).
- **Root Directory**: déjalo en `./` (raíz).
- **Build Command**: `npm run build` (ya viene puesto).
- **Output Directory**: `dist` (ya viene puesto).
- **Install Command**: `npm install` (ya viene puesto).

**No toques nada**, solo click en **"Deploy"**.

## Paso 6 — Esperar el primer despliegue

- Verás una pantalla con animación tipo "construcción".
- Tarda entre 30 segundos y 2 minutos la primera vez.
- Cuando termine, verás "Congratulations!" con confeti y una vista previa de tu app.

## Paso 7 — Acceder a tu app

1. En el dashboard de tu proyecto en Vercel verás la URL: algo como `r0-pir.vercel.app` o `r0-pir-tu-usuario.vercel.app`.
2. Click en la URL → se abre tu app.
3. **Guarda esa URL en favoritos**. Es tu app personal.

## Paso 8 — Importar las preguntas

1. Abre tu URL en el navegador.
2. Ve a la pestaña **"Importar"**.
3. Pega cada uno de los 6 archivos JSON (uno por uno) que te pasó Claude:
   - `tema1_esquizofrenia_v2.json`
   - `tema2_animo_v2.json`
   - `tema3_ansiedad_v2.json`
   - `tema4_toc_v2.json`
   - `tema5_trauma_v2.json`
   - `tema6_disociativos_v2.json`
4. Asignatura destino: **Clínica Adultos**.
5. **Previsualizar** → **Añadir al banco existente**.

¡Listo! Tu app online con 178 preguntas. 🎉

---

## Cómo editar la app después

Cada vez que quieras un cambio:

1. **Pide el cambio a Claude** en cualquier chat.
2. Claude te dará un archivo nuevo (normalmente `src/Angie.jsx`).
3. **Vas a tu repo en GitHub**: `github.com/TU-USUARIO/r0-pir`.
4. Click en `src` → click en `Angie.jsx`.
5. Click en el icono de **lápiz ✏️** (arriba derecha del archivo).
6. Selecciona todo el contenido (Ctrl+A) y bórralo.
7. Pega el nuevo código.
8. Baja al final → "Commit changes" → "Commit changes" otra vez.
9. Vercel detecta el cambio y redespliega solo. **En 30 segundos tu URL ya tiene la versión nueva.**

---

## Backups recomendados

Una vez al mes (o cuando importes muchas preguntas nuevas):

1. Abre tu app.
2. Pestaña **"Importar"** → bloque **"Estado del banco"**.
3. Pulsa **"📤 Exportar"** en cada asignatura.
4. Pega en un Bloc de notas y guarda con fecha: `Backup_ClinicaAdultos_2026-05-09.json`.

Las preguntas viven en `localStorage` del navegador. Si limpias caché o cambias de navegador, se pierden. **Por eso los backups en JSON son tu seguro de vida.**
