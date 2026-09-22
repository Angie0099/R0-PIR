import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'banco');
const files = new Map();
const load = (name) => {
  if (!files.has(name)) files.set(name, JSON.parse(fs.readFileSync(path.join(root, name), 'utf8')));
  return files.get(name);
};
const locate = (id) => {
  for (const name of fs.readdirSync(root).filter((x) => x.endsWith('.json') && x !== 'manifest.json')) {
    const rows = load(name);
    const index = rows.findIndex((row) => row.id === id);
    if (index >= 0) return { name, rows, index, row: rows[index] };
  }
  throw new Error(`No se encontró ${id}`);
};
const fix = (id, destination, topic, q) => {
  const source = locate(id);
  const row = { ...source.row, s: q.s || source.row.s, t: [topic], e: q.e, o: q.o, c: q.c, x: q.x, r: q.r, v: 'VALIDADA_ORIGINAL' };
  if (source.name === destination) source.rows[source.index] = row;
  else {
    source.rows.splice(source.index, 1);
    load(destination).push(row);
  }
  console.log(`${id}: ${source.name} -> ${destination} / ${topic}`);
};

fix('Simu 16 comentado_001', 'tratamientos_adultos.json', 'Tratamiento del TOC y relacionados', {
  e: 'En el tratamiento del trastorno de acumulación, ¿para qué puede emplearse una escala visual de imágenes?',
  o: { a: 'Para diagnosticar por sí sola el trastorno', b: 'Para sustituir la entrevista clínica', c: 'Para medir exclusivamente síntomas depresivos', d: 'Para graduar el nivel de desorden y monitorizar el cambio' }, c: 'd',
  x: 'La d es correcta: las escalas visuales de desorden permiten graduar la acumulación en distintas habitaciones y seguir el cambio terapéutico. No sustituyen la evaluación clínica ni constituyen por sí solas un diagnóstico.',
  r: 'Frost, R. O. et al. (2008). Development and validation of the Clutter Image Rating. Journal of Psychopathology and Behavioral Assessment, 30, 193–203.'
});
fix('Simu 12 comentado_183', 'tratamientos_adultos.json', 'Tratamiento de los trastornos de personalidad', {
  s: 'Tratamientos Adultos', e: '¿Cuál de las siguientes afirmaciones sobre STEPPS es INCORRECTA?',
  o: { a: 'Es un programa grupal de entrenamiento en regulación emocional y solución de problemas', b: 'Se ha aplicado principalmente al trastorno límite de la personalidad', c: 'Es una psicoterapia individual centrada exclusivamente en interpretar la transferencia', d: 'Incluye la participación de una red de apoyo o equipo de refuerzo' }, c: 'c',
  x: 'La c es incorrecta: STEPPS es un programa grupal cognitivo-conductual y basado en habilidades para el TLP; no es una terapia individual centrada exclusivamente en la transferencia. Incluye sistemas de apoyo que refuerzan las habilidades aprendidas.',
  r: 'Blum, N. et al. (2008). Systems Training for Emotional Predictability and Problem Solving (STEPPS) for outpatients with borderline personality disorder. American Journal of Psychiatry, 165, 468–478.'
});
fix('Simu 14 comentado _074', 'tratamientos_adultos.json', 'Tratamiento del TOC y relacionados', {
  e: 'En el TOC, ¿qué relación mantiene la neutralización con la exposición con prevención de respuesta (EPR)?',
  o: { a: 'Es el mecanismo terapéutico principal de la exposición', b: 'Debe añadirse siempre al final de cada ensayo', c: 'Potencia la extinción al reducir de inmediato la ansiedad', d: 'Debe identificarse y prevenirse porque funciona como una respuesta compulsiva' }, c: 'd',
  x: 'La d es correcta: una neutralización manifiesta o encubierta reduce transitoriamente el malestar y actúa como compulsión. Permitirla durante la exposición impide la prevención de respuesta y mantiene el ciclo obsesivo-compulsivo.',
  r: 'National Institute for Health and Care Excellence. OCD and BDD: treatment (CG31); Foa, E. B. et al. Exposure and response prevention for OCD.'
});
fix('SmCm22PIR2025 (1)_115', 'tratamientos_infantiles.json', 'Trastorno del Espectro Autista', {
  s: 'Tratamientos Infantiles', e: 'Respecto al tratamiento farmacológico del trastorno del espectro autista (TEA), señale la afirmación correcta:',
  o: { a: 'Existe un fármaco que trata los déficits nucleares de comunicación social del TEA', b: 'Risperidona y aripiprazol pueden reducir irritabilidad grave asociada al TEA en población pediátrica', c: 'La fenfluramina es un ISRS de primera elección en el TEA', d: 'Naltrexona constituye el tratamiento farmacológico habitual de los síntomas nucleares' }, c: 'b',
  x: 'La b es correcta: risperidona y aripiprazol cuentan con indicación para la irritabilidad asociada al autismo en determinadas edades. La medicación se dirige a síntomas asociados, no a los déficits nucleares del TEA; fenfluramina no es un ISRS y naltrexona no es tratamiento habitual.',
  r: 'U.S. Food and Drug Administration. Prescribing information: Risperdal; Abilify. NICE CG170, Autism spectrum disorder in under 19s: support and management.'
});
fix('SmCm22PIR2025 (1)_121', 'tratamientos_adultos.json', 'Tratamiento del trauma y TEPT', {
  e: 'Sobre el entrenamiento en inoculación del estrés aplicado al TEPT, señale la afirmación INCORRECTA:',
  o: { a: 'Fue desarrollado por Meichenbaum', b: 'Veronen y Kilpatrick lo adaptaron para víctimas de agresión sexual', c: 'Su objetivo distintivo es procesar de forma exhaustiva los recuerdos traumáticos mediante exposición prolongada', d: 'Incluye psicoeducación y entrenamiento en habilidades de afrontamiento' }, c: 'c',
  x: 'La c es incorrecta: la inoculación de estrés se centra en enseñar habilidades para manejar ansiedad y estrés; puede incorporar ejercicios de exposición, pero no se define por el procesamiento exhaustivo del recuerdo propio de terapias centradas en exposición prolongada.',
  r: 'Meichenbaum, D. (1985). Stress Inoculation Training. Pergamon; Veronen, L. J. y Kilpatrick, D. G. (1983). Stress management for rape victims.'
});
fix('SmCm2PIR2024_151', 'tratamientos_infantiles.json', 'Trastornos de ansiedad infantojuvenil', {
  e: '¿Cuál NO es una característica propia de las escenificaciones emotivas para las fobias infantiles?',
  o: { a: 'Se emplean especialmente con niños pequeños', b: 'Se suscitan emociones positivas incompatibles con la ansiedad', c: 'Se utilizan juego, modelado y refuerzo social', d: 'Su componente imprescindible es entrenar relajación muscular progresiva' }, c: 'd',
  x: 'La d es correcta: las escenificaciones emotivas combinan exposición gradual en un contexto de juego con modelado y refuerzo, generando emociones positivas incompatibles con el miedo. No requieren como componente imprescindible la relajación muscular progresiva.',
  r: 'Méndez, F. X. et al. Tratamiento de las fobias infantiles mediante escenificaciones emotivas; Manual de terapia de conducta en la infancia.'
});
fix('SmCm24PIR2025 (1)_077', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: 'La Terapia Personal de Hogarty para la esquizofrenia se caracteriza por ser:',
  o: { a: 'Una intervención psicoeducativa exclusivamente familiar', b: 'Una intervención individual por fases orientada a reconocer vulnerabilidad, señales de estrés y prevenir recaídas', c: 'Una terapia breve de exposición para alucinaciones', d: 'Una TCC centrada únicamente en discutir la veracidad de delirios' }, c: 'b',
  x: 'La b es correcta: la Personal Therapy de Hogarty es una intervención individual, gradual y sensible a la recuperación que trabaja conciencia de vulnerabilidad, regulación de activación, señales de estrés y adaptación social. No es una intervención familiar ni una TCC exclusiva para delirios.',
  r: 'Hogarty, G. E. (2002). Personal Therapy for Schizophrenia and Related Disorders. Guilford Press.'
});
fix('Simu 32 comentado hardcore 2_095', 'tratamientos_adultos.json', 'Tratamiento de la depresión y trastornos del ánimo', {
  s: 'Tratamientos Adultos', e: '¿Qué nivel de evidencia se ha atribuido en la clasificación SIGN a la terapia centrada en la familia añadida a la farmacoterapia para el trastorno bipolar?',
  o: { a: '1++', b: '1−', c: '2+', d: '4' }, c: 'a',
  x: 'La a es correcta en el sistema de referencia del manual: la terapia centrada en la familia, combinada con farmacoterapia, se apoya en ensayos controlados y revisiones de alta calidad. La notación pertenece a SIGN y no debe confundirse con grados de recomendación.',
  r: 'Fonseca-Pedrero, E. (coord.). Manual de tratamientos psicológicos: Adultos, capítulo de trastorno bipolar; Scottish Intercollegiate Guidelines Network, grading system.'
});
fix('Simu 6 comentado__166', 'tratamientos_infantiles.json', 'Trauma y malos tratos infantojuveniles', {
  e: '¿Cuál de los siguientes programas se emplea específicamente en el tratamiento de niños y adolescentes que han sufrido maltrato o experiencias traumáticas?',
  o: { a: 'ACTION de Stark y Kendall', b: 'Triple P de Sanders', c: 'FORTIUS de Méndez', d: 'Terapia cognitivo-conductual focalizada en el trauma de Cohen y colaboradores' }, c: 'd',
  x: 'La d es correcta: la TF-CBT de Cohen, Mannarino y Deblinger fue desarrollada para menores con síntomas relacionados con experiencias traumáticas, incluido el abuso. ACTION aborda depresión; FORTIUS, fortaleza psicológica; Triple P es entrenamiento parental.',
  r: 'Cohen, J. A., Mannarino, A. P. y Deblinger, E. (2017). Treating Trauma and Traumatic Grief in Children and Adolescents. Guilford Press.'
});
fix('SmCm29PIR2025_006', 'tratamientos_adultos.json', 'Tratamiento de las adicciones', {
  e: 'En programas conductuales para el trastorno por consumo de cannabis, ¿qué componente aporta refuerzo tangible contingente a la abstinencia verificada?',
  o: { a: 'Entrevista motivacional', b: 'Exposición a estímulos', c: 'Manejo de contingencias', d: 'Entrenamiento autógeno' }, c: 'c',
  x: 'La c es correcta: el manejo de contingencias entrega incentivos ligados a objetivos observables, como muestras biológicas negativas. La entrevista motivacional trabaja disposición al cambio, pero no administra refuerzos contingentes.',
  r: 'National Institute on Drug Abuse. Cannabis (Marijuana) DrugFacts: available treatments; Budney, A. J. et al. (2006). Marijuana dependence and its treatment.'
});
fix('PERSEVER___SIMULACRO_COMENTADO_JULIO-UNO-23_066', 'clinica_adultos.json', 'Trastornos disociativos', {
  s: 'Clínica Adultos', e: 'Según la teoría neodisociativa de Kihlstrom, ¿qué afirmación describe mejor los trastornos disociativos?',
  o: { a: 'Son primariamente trastornos de identidad sin alteración funcional de la memoria', b: 'La memoria se organiza como una jerarquía rígida sin redes asociativas', c: 'Se altera la conexión entre recuerdos autobiográficos y la representación mental del yo', d: 'Se deterioran por igual la memoria episódica explícita y la memoria semántica' }, c: 'c',
  x: 'La c es correcta: Kihlstrom destaca una desconexión funcional entre recuerdos autobiográficos y la representación del yo. La memoria semántica suele preservarse, por lo que la d es falsa.',
  r: 'Kihlstrom, J. F. (2005). Dissociative disorders. Annual Review of Clinical Psychology, 1, 227–253. https://doi.org/10.1146/annurev.clinpsy.1.102803.143925'
});
fix('SmCm10PIR2025_105', 'tratamientos_infantiles.json', 'Trastornos de excreción infantojuvenil', {
  s: 'Tratamientos Infantiles', e: 'Señale la afirmación correcta sobre el tratamiento farmacológico de la enuresis:',
  o: { a: 'La imipramina es un análogo de la hormona antidiurética', b: 'La fluoxetina es el tratamiento farmacológico de elección', c: 'Los fármacos mantienen habitualmente su efecto tras retirarlos mejor que la alarma', d: 'La oxibutinina puede estar indicada cuando existe inestabilidad vesical o síntomas diurnos' }, c: 'd',
  x: 'La d es correcta: la oxibutinina, un antimuscarínico, puede considerarse ante vejiga hiperactiva o síntomas diurnos seleccionados. La desmopresina es el análogo de la hormona antidiurética; imipramina es tricíclica y fluoxetina no es tratamiento de elección.',
  r: 'International Children’s Continence Society. Management and treatment of nocturnal enuresis—updated standardization document. Journal of Pediatric Urology (2020).'
});
fix('SmCm22PIR2025 (1)_110', 'tratamientos_adultos.json', 'Tratamiento de los trastornos neurocognitivos', {
  e: '¿Cuál de los siguientes es un programa estructurado de psicoestimulación cognitiva para personas con demencia?',
  o: { a: 'Programa de Psicoestimulación Integral (PPI)', b: 'Programa de Yanguas y colaboradores de apoyo al cuidador', c: 'Método Montessori como programa farmacológico', d: 'Terapia de reminiscencia como denominación del PPI' }, c: 'a',
  x: 'La a es correcta: el PPI es un programa de intervención cognitiva integral diseñado para estimular capacidades conservadas en personas con demencia. Montessori y reminiscencia son enfoques distintos, no sinónimos del PPI.',
  r: 'Tárraga, L. y Boada, M. (eds.). Volver a empezar: ejercicios prácticos de estimulación cognitiva para enfermos de Alzheimer. Fundación ACE.'
});
fix('SmCm11PIR2025_110', 'tratamientos_adultos.json', 'Tratamiento de los trastornos disociativos', {
  e: 'En el tratamiento orientado por fases de los trastornos disociativos complejos, ¿qué fobia se considera más generalizada y se aborda desde la primera fase?',
  o: { a: 'Fobia a la vida cotidiana', b: 'Fobia a la experiencia interna', c: 'Fobia exclusiva a recuerdos traumáticos', d: 'Fobia a las partes disociativas únicamente en la tercera fase' }, c: 'b',
  x: 'La b es correcta: la fobia a acciones y experiencias mentales internas es transversal y se trabaja desde la fase inicial de estabilización y desarrollo de habilidades. El recuerdo traumático se aborda de forma gradual en la fase de tratamiento de memorias.',
  r: 'Van der Hart, O., Nijenhuis, E. R. S. y Steele, K. (2006). The Haunted Self. Norton.'
});
fix('SEPTIEMBRE-UNO-24_COMENTADO_084', 'tratamientos_infantiles.json', 'Trastornos depresivos y bipolares infantojuvenil', {
  e: 'Respecto a programas multicomponentes para la depresión infantil y adolescente, señale la afirmación correcta:',
  o: { a: 'El CAD-A de Lewinsohn fue diseñado para niños de 3 a 8 años', b: 'ACTION de Stark se desarrolló para escolares, aproximadamente entre 9 y 13 años', c: 'ACTION se diseñó específicamente para adultos jóvenes', d: 'El CAD-A excluye activación conductual y habilidades sociales' }, c: 'b',
  x: 'La b es correcta: ACTION es un programa cognitivo-conductual grupal para depresión infantil en edad escolar. El CAD-A se dirige a adolescentes e incluye actividades agradables, habilidades sociales, autocontrol y trabajo cognitivo.',
  r: 'Stark, K. D. et al. ACTION treatment program for depressed youth; Lewinsohn, P. M. et al. Coping With Depression Course for Adolescents.'
});
fix('SmCm23PIR2025 (2)_178', 'tratamientos_adultos.json', 'Tratamiento de los trastornos de ansiedad', {
  e: 'Una ventaja clínica de la exposición mediante realidad virtual en fobias específicas es:',
  o: { a: 'Que el hardware siempre tiene un coste inferior a cualquier otra modalidad', b: 'Que permite graduar y controlar con precisión la intensidad de los estímulos', c: 'Que necesariamente es más barata que la exposición en imaginación', d: 'Que elimina la necesidad de provocar activación emocional' }, c: 'b',
  x: 'La b es correcta: el terapeuta puede controlar y repetir parámetros del estímulo de forma graduada. El coste depende de la tecnología y la exposición eficaz requiere activación emocional, no su eliminación.',
  r: 'Carl, E. et al. (2019). Virtual reality exposure therapy for anxiety and related disorders: a meta-analysis. Journal of Anxiety Disorders, 61, 27–36.'
});
fix('SmCm22PIR2025 (1)_113', 'tratamientos_adultos.json', 'Tratamiento de la depresión y trastornos del ánimo', {
  e: '¿Cuál de los siguientes tratamientos NO fue diseñado para tratar la depresión?',
  o: { a: 'Terapia cognitiva de Beck', b: 'Terapia interpersonal de Klerman y Weissman', c: 'Activación conductual de Jacobson y colaboradores', d: 'MERIT de Lysaker y colaboradores' }, c: 'd',
  x: 'La d es correcta: MERIT es una terapia metacognitiva integradora desarrollada para psicosis. Las otras tres intervenciones cuentan con modelos y protocolos específicos para depresión.',
  r: 'Lysaker, P. H. et al. (2020). Metacognitive Reflection and Insight Therapy; NICE NG222, Depression in adults.'
});
fix('SM_JULIO_1_SOL_1_121', 'tratamientos_adultos.json', 'Tratamiento de los trastornos de personalidad', {
  e: '¿Qué asociación entre una psicoterapia para el trastorno límite de la personalidad y sus autores es correcta?',
  o: { a: 'Terapia basada en la mentalización — Linehan', b: 'Terapia dialéctica conductual — Young', c: 'Psicoterapia centrada en la transferencia — Clarkin, Yeomans y Kernberg', d: 'Terapia centrada en esquemas — Bateman y Fonagy' }, c: 'c',
  x: 'La c es correcta. La terapia basada en la mentalización se asocia a Bateman y Fonagy; la dialéctica conductual, a Linehan; la centrada en esquemas, a Young; y la centrada en la transferencia, a Clarkin, Yeomans y Kernberg.',
  r: 'American Psychological Association, Clinical Practice Guideline for the Treatment of Borderline Personality Disorder (2024).'
});
fix('Simu 15 comentado_162', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: '¿Cuál de las siguientes afirmaciones sobre MERIT en el tratamiento de la psicosis es correcta?',
  o: { a: 'Se limita a disputar creencias psicóticas aisladas', b: 'Busca integrar experiencias y significados personales para mejorar la metacognición y la agencia', c: 'Pretende descubrir un yo verdadero fijo y transparente', d: 'Atribuye siempre los problemas de autorreflexión al apego' }, c: 'b',
  x: 'La b es correcta: MERIT trabaja de forma integradora con la narrativa y la red de significados de la persona para favorecer autorreflexión, comprensión de otras mentes, descentramiento y dominio. No se limita a disputar síntomas concretos.',
  r: 'Lysaker, P. H. et al. (2020). Metacognitive Reflection and Insight Therapy: A Recovery-Oriented Treatment Approach for Psychosis. Routledge.'
});
fix('SM_ABRIL_1_SOL_1_101', 'tratamientos_infantiles.json', 'Conducta suicida y autolesión infantojuvenil', {
  s: 'Tratamientos Infantiles', e: '¿Qué afirmación describe correctamente Teens Options for Change (TOC)?',
  o: { a: 'Es una hospitalización breve para adolescentes ya ingresados', b: 'Se reserva únicamente para intentos suicidas de máxima letalidad', c: 'Es un tratamiento prolongado centrado en el consumo de alcohol', d: 'Es una intervención breve para adolescentes detectados con riesgo suicida en urgencias que no requieren hospitalización' }, c: 'd',
  x: 'La d es correcta: TOC se diseñó como intervención breve y motivacional para adolescentes cribados como en riesgo en servicios de urgencias y susceptibles de alta, con el objetivo de aumentar seguridad, motivación y vinculación asistencial.',
  r: 'King, C. A. et al. (2009). A randomized controlled trial of a brief intervention for adolescent suicide risk in the emergency department.'
});
fix('SmCm24PIR2025 (1)_076', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: '¿Cuál NO es una recomendación general adecuada al planificar el tratamiento psicológico de la esquizofrenia?',
  o: { a: 'Construir una alianza terapéutica y favorecer la adherencia', b: 'Ofrecer psicoeducación al paciente y, cuando proceda, a la familia', c: 'Elegir la intervención solo por preferencia del terapeuta, sin considerar necesidades ni valores del paciente', d: 'Intervenir sobre el funcionamiento social y la recuperación personal' }, c: 'c',
  x: 'La c es incorrecta: la selección debe individualizarse según necesidades, objetivos, preferencias, contexto y evidencia, mediante decisión compartida. Alianza, psicoeducación y recuperación funcional son recomendaciones habituales.',
  r: 'NICE CG178, Psychosis and schizophrenia in adults: prevention and management; APA Practice Guideline for the Treatment of Patients With Schizophrenia (2020).'
});
fix('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_097', 'tratamientos_adultos.json', 'Tratamiento de los trastornos del sueño', {
  e: 'Respecto a la asociación entre duración del sueño y mortalidad, señale la afirmación INCORRECTA:',
  o: { a: 'Dormir menos de 6 horas implica de forma uniforme más riesgo que dormir más de 9 horas', b: 'El sueño corto se ha relacionado con vías proinflamatorias', c: 'Apnea obstructiva y depresión pueden confundir o mediar parte de la asociación', d: 'Sueño corto se asocia con obesidad, diabetes, hipertensión y enfermedad cardiovascular' }, c: 'a',
  x: 'La a es incorrecta: la asociación suele describirse como una curva en U, y en numerosos metaanálisis el sueño largo muestra una asociación con mortalidad al menos comparable o superior a la del sueño corto. La asociación observacional no demuestra causalidad.',
  r: 'Cappuccio, F. P. et al. (2010). Sleep duration and all-cause mortality: a systematic review and meta-analysis. Sleep, 33, 585–592.'
});
fix('SmCm18PIR2025_162', 'tratamientos_adultos.json', 'Tratamiento de los trastornos somáticos', {
  e: '¿Qué tratamiento de la hipocondría se presenta como un curso que ayuda a comprender la percepción de los síntomas físicos?',
  o: { a: 'Tratamiento de Martínez y Botella', b: 'Terapia cognitivo-educativa de Barsky y colaboradores', c: 'Terapia de Warwick y Salkovskis', d: 'Terapia de Avia' }, c: 'b',
  x: 'La b es correcta: el enfoque de Barsky se plantea como un curso educativo sobre amplificación somatosensorial, atención a sensaciones e interpretación de síntomas, con una relación semejante a la de profesor y alumno.',
  r: 'Barsky, A. J. et al. (2004). A randomized trial of cognitive behavior therapy for hypochondriasis. New England Journal of Medicine, 350, 1464–1470.'
});
fix('SmCm4PIR2024_168', 'tratamientos_adultos.json', 'Tratamiento de los trastornos de ansiedad', {
  e: 'Frente al programa cognitivo de Clark, ¿qué rasgo fue especialmente característico del programa de control del pánico de Barlow y Craske?',
  o: { a: 'La exposición repetida a sensaciones interoceptivas temidas', b: 'La interpretación psicodinámica de los ataques', c: 'La supresión sistemática de toda activación fisiológica', d: 'El uso obligatorio de relajación profunda' }, c: 'a',
  x: 'La a es correcta: el programa de control del pánico de Barlow incorporó de forma central la exposición interoceptiva para debilitar el miedo a las sensaciones corporales. El modelo de Clark dio mayor peso a la reevaluación de interpretaciones catastróficas y experimentos conductuales.',
  r: 'Barlow, D. H. y Craske, M. G. (2007). Mastery of Your Anxiety and Panic; Clark, D. M. (1986). A cognitive approach to panic.'
});
fix('SmCm20PIR2025 (1)_185', 'tratamientos_infantiles.json', 'Trastornos de conducta infantojuvenil', {
  s: 'Tratamientos Infantiles', e: '¿En el tratamiento de qué problema se utiliza el programa de Fresnillo-Poza?',
  o: { a: 'Trastorno por déficit de atención con hiperactividad', b: 'Problemas de conducta y familias disfuncionales o de alto riesgo', c: 'Trastornos específicos del aprendizaje', d: 'Trastorno de ansiedad generalizada' }, c: 'b',
  x: 'La b es correcta: es un programa de intervención familiar dirigido a mejorar prácticas educativas y funcionamiento familiar en contextos de riesgo, con especial atención a problemas de conducta. No es un protocolo específico para TDAH, aprendizaje o TAG.',
  r: 'Fresnillo-Poza, V., Fresnillo-Lobo, R. y Fresnillo-Poza, M. L. Escuela de Padres. Área de Servicios Sociales, Ayuntamiento de Madrid.'
});
fix('PERSEVER___SIMULACRO_COMENTADO_JUNIO-DOS-23_134', 'tratamientos_adultos.json', 'Tratamiento de la depresión y trastornos del ánimo', {
  e: '¿Cuál de las siguientes es una intervención administrada principalmente mediante una plataforma web para el trastorno bipolar?',
  o: { a: 'MONARCA', b: 'ORBIT', c: 'PRISM', d: 'SIMPLe' }, c: 'b',
  x: 'La b es correcta: ORBIT es una intervención web orientada a recuperación y calidad de vida. MONARCA, PRISM y SIMPLe se desarrollaron principalmente como intervenciones apoyadas en teléfonos inteligentes.',
  r: 'Gliddon, E. et al. (2019). Online and mobile technologies for self-management in bipolar disorder; ORBIT randomized controlled trial.'
});
fix('Simu 8 comentado _201', 'psicologia_basica.json', 'Emoción', {
  s: 'Psicología Básica', e: 'En la clasificación de emociones básicas de Ekman, ¿cuál se considera una emoción autoconsciente y no una emoción básica?',
  o: { a: 'Asco', b: 'Miedo', c: 'Ira', d: 'Culpa' }, c: 'd',
  x: 'La d es correcta: la culpa requiere autoevaluación respecto a normas o conducta propia y se clasifica como emoción autoconsciente. Asco, miedo e ira forman parte del conjunto clásico de emociones básicas de Ekman.',
  r: 'Ekman, P. (1992). An argument for basic emotions. Cognition and Emotion, 6, 169–200.'
});
fix('SmCm4PIR2024_147', 'tratamientos_adultos.json', 'Técnicas psicológicas generales', {
  e: 'El ejercicio de dirigir la mirada hacia el centro de la frente y dejar surgir imaginativamente un color forma parte de:',
  o: { a: 'EMDR', b: 'Visualización mindfulness', c: 'Entrenamiento autógeno', d: 'Exposición interoceptiva' }, c: 'c',
  x: 'La c es correcta: se trata de un ejercicio de imaginación asociado al entrenamiento autógeno avanzado, no de estimulación bilateral EMDR ni de exposición interoceptiva.',
  r: 'Schultz, J. H. y Luthe, W. Autogenic Training: A Psychophysiologic Approach in Psychotherapy.'
});
fix('Simu 12 comentado_171', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: 'Respecto al riesgo de suicidio en personas con psicosis, señale la afirmación correcta:',
  o: { a: 'La adversidad socioeconómica y el aislamiento social pueden aumentar el riesgo', b: 'Construir una creencia alternativa al delirio elimina por sí solo el riesgo', c: 'La recuperación clínica basta y hace innecesario valorar el funcionamiento social', d: 'La esperanza permite omitir la evaluación directa de ideación y planes suicidas' }, c: 'a',
  x: 'La a es correcta: el riesgo es multicausal e incluye factores clínicos y sociales. Ningún cambio cognitivo aislado elimina el riesgo; deben evaluarse directamente ideación, planes, intentos previos, desesperanza, consumo, apoyo y condiciones sociales.',
  r: 'Hor, K. y Taylor, M. (2010). Suicide and schizophrenia: a systematic review of rates and risk factors. Journal of Psychopharmacology, 24, 81–90.'
});
fix('SmCm20PIR2024_091', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: '¿Qué terapia cognitivo-conductual para la psicosis incluye la «normalización racional», situando las experiencias psicóticas en un continuo con experiencias normales?',
  o: { a: 'Terapia de focalización de Bentall, Haddock y Slade', b: 'Terapia para alucinaciones de Perron y Munson', c: 'Terapia cognitivo-conductual de Kingdon y Turkington', d: 'Terapia de Chadwick, Birchwood y Trower' }, c: 'c',
  x: 'La c es correcta: Kingdon y Turkington utilizan normalización racional, desafío verbal colaborativo y pruebas de realidad para construir explicaciones menos estigmatizantes y más comprensibles de la experiencia psicótica.',
  r: 'Kingdon, D. G. y Turkington, D. (1994). Cognitive-Behavioral Therapy of Schizophrenia. Guilford Press.'
});
fix('SmCm3PIR2024_134', 'tratamientos_adultos.json', 'Tratamiento de la psicosis y esquizofrenia', {
  e: '¿En qué principio se apoya la terapia centrada en la compasión (CFT) aplicada a la psicosis?',
  o: { a: 'Comprender y regular la interacción entre los sistemas de amenaza, impulso y calma-afiliación', b: 'Seleccionar exclusivamente los valores vitales más coherentes', c: 'Discutir la veracidad de cada síntoma como técnica central', d: 'Atribuir toda experiencia psicótica a un déficit de apego' }, c: 'a',
  x: 'La a es correcta: CFT formula el sufrimiento mediante sistemas de regulación emocional —amenaza, impulso y calma/afiliación— y entrena una relación compasiva con uno mismo y las experiencias difíciles. El trabajo exclusivo con valores caracteriza más a ACT.',
  r: 'Gilbert, P. (2010). Compassion Focused Therapy. Routledge; Braehler, C. et al. (2013). Exploring change processes in compassion focused therapy in psychosis.'
});

for (const [name, rows] of files) fs.writeFileSync(path.join(root, name), JSON.stringify(rows));
