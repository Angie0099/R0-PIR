# Revisión del banco R0-PIR

Fecha de revisión: 18 de agosto de 2026.

## Alcance

- Banco revisado: 15.961 preguntas, repartidas en 11 asignaturas.
- Manuales indexados: 28 PDF y 12.763 páginas.
- Páginas con texto utilizable: 11.092.
- Se comprobó la estructura, la clave de respuesta, la coherencia con la justificación,
  las referencias, los duplicados y los defectos de extracción de texto.
- Se realizó una búsqueda por página en los manuales para cada pregunta de las materias
  cubiertas. Una coincidencia automática se considera una localización documental, no una
  verificación semántica definitiva.

## Cambios aplicados al banco

- 355 claves de respuesta cambiadas porque no coincidían con la alternativa que la propia
  justificación identificaba como correcta. Se excluyeron los casos donde la explicación
  pertenecía a otra pregunta.
- 356 preguntas quedan con estado `CORREGIDA` (las 355 anteriores y una pregunta cuya
  justificación era ajena aunque la clave ya era correcta).
- 3.165 referencias añadidas: 2.327 recuperadas de las propias justificaciones y el resto
  como localizaciones provisionales de alta coincidencia en los manuales.
- 792 justificaciones modificadas: se retiraron duplicaciones exactas, marcas de agua y
  explicaciones claramente pertenecientes a otra pregunta; además se corrigieron dos casos
  manualmente (Rorschach y confabulaciones).
- 1.694 enunciados y 349 preguntas con opciones limpiadas de marcas de agua evidentes.
- 8.771 preguntas marcadas `REVISAR` para impedir que una comprobación automática se
  confunda con una validación definitiva.
- Se consultaron también 26 manuales con texto utilizable de la carpeta **Fondo Común >
  Manuales de referencia** de Google Drive. Se indexaron 38.939.794 caracteres en 8.765
  secciones correspondientes a las cinco materias que no estaban cubiertas localmente.
- 78 preguntas adicionales quedan con estado `VALIDADA_DRIVE`, justificación y referencia
  al manual: 29 de Psicobiología, 11 de Psicología Básica, 14 de Psicología Evolutiva,
  11 de Psicología Social y 13 de Personalidad y Diferencial. Solo se aceptaron respuestas
  que aparecen literalmente en el manual y cuyo contexto comparte al menos cuatro conceptos
  relevantes con el enunciado; se excluyeron preguntas negativas, dañadas o ambiguas.
- Después de incorporar esas validaciones quedan 8.693 preguntas con estado `REVISAR`.
- Tras la segunda pasada quedan 0 contradicciones detectables entre la clave guardada y la
  alternativa que la justificación señala explícitamente como correcta.
- Los 11 archivos JSON siguen siendo válidos y conservan exactamente las 15.961 preguntas
  indicadas en el manifiesto.

## Pendiente de revisión documental o redacción

- 6.861 preguntas no tienen todavía una justificación válida.
- 12.718 no tienen una referencia bibliográfica definitiva.
- 86 explicaciones pueden pertenecer a otra pregunta o tener muy poca relación con el
  enunciado y la respuesta.
- 28 preguntas tienen opciones duplicadas; 15 contienen opciones truncadas y 4 opciones
  excesivamente cortas.
- 24 grupos (48 preguntas) quedaron como duplicados exactos después de retirar marcas de
  agua. No se han eliminado automáticamente para evitar perder preguntas sin una decisión
  editorial.
- Persisten defectos de OCR que no pueden corregirse con seguridad sin reconstruir el texto
  desde la fuente: caracteres dañados, palabras unidas y palabras partidas.

## Cobertura de manuales

Los manuales locales cubren principalmente Psicología Clínica, Evaluación Psicológica,
Tratamientos, Psicoterapias y parte de Psicología Experimental. En Google Drive se localizaron
y consultaron manuales específicos para las otras 4.516 preguntas:

- Psicobiología: 1.232.
- Psicología Básica: 797.
- Psicología Evolutiva: 483.
- Psicología Social: 615.
- Psicología de la Personalidad y Diferencial: 1.389.

La segunda fuente permitió validar documentalmente 78 preguntas con un criterio conservador.
Las 4.438 restantes de ese grupo no se han marcado como verificadas cuando la coincidencia no
era inequívoca. Para completar el banco con rigor sigue siendo necesaria una revisión semántica
individual por lotes de las preguntas que permanecen en `REVISAR`.
