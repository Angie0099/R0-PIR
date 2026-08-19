# Revisión del banco R0-PIR

Fecha de revisión: 19 de agosto de 2026.

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
- 357 preguntas quedan con estado `CORREGIDA`. La revisión con originales corrigió además
  una pregunta que atribuía a la hipocondría una creencia fija y cierta de enfermedad; la
  respuesta correcta es trastorno delirante de tipo somático y el tema se recolocó en
  «Trastornos de síntomas somáticos y relacionados».
- 3.165 referencias añadidas: 2.327 recuperadas de las propias justificaciones y el resto
  como localizaciones provisionales de alta coincidencia en los manuales.
- 792 justificaciones modificadas: se retiraron duplicaciones exactas, marcas de agua y
  explicaciones claramente pertenecientes a otra pregunta; además se corrigieron dos casos
  manualmente (Rorschach y confabulaciones).
- 1.694 enunciados y 349 preguntas con opciones limpiadas de marcas de agua evidentes.
- 8.771 preguntas se marcaron inicialmente `REVISAR` para impedir que una comprobación automática se
  confunda con una validación definitiva.
- Se consultaron también 26 manuales con texto utilizable de la carpeta **Fondo Común >
  Manuales de referencia** de Google Drive. Se indexaron 38.939.794 caracteres en 8.765
  secciones correspondientes a las cinco materias que no estaban cubiertas localmente.
- 78 preguntas adicionales quedan con estado `VALIDADA_DRIVE`, justificación y referencia
  al manual: 29 de Psicobiología, 11 de Psicología Básica, 14 de Psicología Evolutiva,
  11 de Psicología Social y 13 de Personalidad y Diferencial. Solo se aceptaron respuestas
  que aparecen literalmente en el manual y cuyo contexto comparte al menos cuatro conceptos
  relevantes con el enunciado; se excluyeron preguntas negativas, dañadas o ambiguas.
- Se verificó que las 78 fuentes de esa tanda son manuales originales (UNED, Domjan,
  Redolar, Stahl, Papalia, Santrock, Gaviria, Sánchez-Elvira, Bermúdez y Colom), no
  materiales de academia.
- En una tercera pasada se consultaron 27 manuales originales de clasificación,
  psicopatología, tratamientos, evaluación, psicoterapias, metodología, psicobiología,
  procesos básicos, desarrollo, social y personalidad. Se indexaron más de 48,6 millones
  de caracteres en 10.497 secciones. Se excluyeron temarios, simulacros y documentos de
  academia.
- Esta tercera pasada dejó 142 preguntas con estado `VALIDADA_ORIGINAL`: 60 de Psicología
  Clínica, 38 de Evaluación, 22 de Tratamientos Adultos, 7 de Psicoterapias, 4 de Psicología
  Básica, 3 de Psicobiología, 3 de Psicología Social, 3 de Personalidad y Diferencial y 2 de
  Psicología Experimental. Se revisaron manualmente los fragmentos candidatos y se
  descartaron las coincidencias que no demostraban toda la relación preguntada.
- En total hay 220 validaciones sustentadas en manuales originales de Drive (78 de la tanda
  anterior y 142 de la nueva). Quedan 8.550 preguntas con estado `REVISAR`.
- Tras la segunda pasada quedan 0 contradicciones detectables entre la clave guardada y la
  alternativa que la justificación señala explícitamente como correcta.
- Los 11 archivos JSON siguen siendo válidos y conservan exactamente las 15.961 preguntas
  indicadas en el manifiesto.

## Pendiente de revisión documental o redacción

- 6.752 preguntas no tienen todavía una justificación válida.
- 12.651 no tienen una referencia bibliográfica definitiva.
- 85 explicaciones pueden pertenecer a otra pregunta o tener muy poca relación con el
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

Las dos pasadas de Drive permiten identificar 220 preguntas validadas con originales. Las
restantes no se han marcado como verificadas cuando la coincidencia no era inequívoca. Para
completar el banco con rigor sigue siendo necesaria una revisión semántica individual por
lotes de las preguntas que permanecen en `REVISAR`.

## Visibilidad de bloques clínicos

Los cuatro bloques comunicados como desaparecidos siguen presentes en el banco oficial:

- Trastornos neurocognitivos: 137 preguntas.
- Trastornos de la personalidad: 131 preguntas.
- Trastornos destructivos, del control de los impulsos y de la conducta: 92 preguntas.
- Trastornos de la conducta alimentaria y de la ingestión de alimentos: 274 preguntas.

La app se ha ajustado para abrir por defecto el banco oficial y volver a solicitar sus datos
sin conservar una copia antigua en caché. Esto evita que esos temas parezcan ausentes cuando
el banco local del navegador está vacío o desactualizado.
