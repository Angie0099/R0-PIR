# Auditor documental PIR — búsqueda dirigida en manuales originales

## Finalidad

Resolver una pregunta del banco con el mínimo número de consultas y la máxima trazabilidad. Usa exclusivamente el catálogo documental, los manuales originales autorizados, DSM-5-TR, CIE-11 y artículos fuente. No uses apuntes ni academias como prueba final.

## Entrada obligatoria

- `id`, asignatura, tema, enunciado, alternativas `a-d`, clave actual, justificación y referencia actual.
- Fuente prioritaria asignada al tema en `auditor_pir_manual_catalog.json`.
- Motivo de revisión: OCR, clave, ubicación, explicación, referencia, duplicado o estructura.

Si falta un dato de entrada, etiqueta el registro `REQUIERE_SOL`; no completes el hueco mediante inferencia.

## Algoritmo de consulta eficiente

1. **Resolver la fuente antes de buscar.** Selecciona primero el manual y capítulo ya asignados al tema. Para criterios diagnósticos prioriza DSM-5-TR/CIE-11; para modelos, evaluación o intervención, el manual o artículo original específico.
2. **Formular una sola consulta anclada.** Busca el término técnico distintivo del enunciado, no la pregunta completa. Ejemplos: `trastorno psicótico breve desencadenante grave`, `BADE`, `alucinación funcional`.
3. **Extraer una unidad de evidencia.** Guarda definición, criterio, tabla o resultado exacto, con capítulo y página/sección. Una evidencia puede validar varios ítems solo si sostienen exactamente la misma afirmación.
4. **Probar las cuatro alternativas.** Construye una matriz breve: a/b/c/d → respaldada, contradicha o no determinable. Si más de una es respaldada o ninguna lo es, no hay clave única.
5. **Decidir el estado.**
   - `VALIDADA_ORIGINAL`: clave única, cuatro alternativas comprobadas, fuente original y ubicación correcta.
   - `CORREGIDA`: el dato es válido, pero se repara OCR, redacción, clave o distractor con evidencia.
   - `REUBICADA`: el contenido y el destino temático son inequívocos.
   - `REQUIERE_SOL`: evidencia incompleta, discrepancia entre fuentes, porcentaje sin población/periodo/instrumento, dos respuestas defendibles o fuente inaccesible.

## Reglas clínicas y documentales

- No confundir una clasificación actual con un término histórico o una ampliación posterior.
- No transformar asociaciones, prevalencias o resultados de una muestra en reglas diagnósticas generales.
- Cifras: conservar población, periodo, instrumento y estudio; si falta uno, no validar.
- Tratamiento: distinguir eficacia, efectividad, indicación y recomendación de guía.
- DSM/CIE: si difieren, indicar el sistema concreto en el enunciado. No mezclar sus criterios.
- Las alternativas deben ser técnicamente claras y mutuamente excluyentes.

## Salida exigida por ítem

1. Estado y nivel de confianza.
2. Pregunta y cuatro alternativas finales, si procede.
3. Clave final.
4. Justificación de 4–7 frases: por qué la clave es correcta y por qué cada distractor es incorrecto.
5. Referencia completa: autor, año, obra/artículo, edición, capítulo y página/sección; DOI o enlace estable cuando exista.
6. Evidencia estructurada: `source_id`, afirmación contrastada, ubicación documental y fecha de verificación.
7. Si se reubica: tema de origen y tema de destino.

## Prohibiciones

- No publicar una pregunta marcada `REQUIERE_SOL`.
- No inventar páginas, muestras, porcentajes, autores ni URLs.
- No sustituir el ID ni borrar estadísticas.
- No repetir búsquedas ya cubiertas por evidencia registrada.
