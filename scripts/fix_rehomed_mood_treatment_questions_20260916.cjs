const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));

function get(id) {
  const q = bank.find(x => x.id === id);
  if (!q) throw new Error(`No se encontró ${id}`);
  return q;
}

Object.assign(get('MAYO-UNO-24_COMENTADO_077'), {
  t: ['Tratamiento de los trastornos alimentarios'],
  e: 'Respecto al tratamiento farmacológico de la anorexia nerviosa, señale la afirmación INCORRECTA:',
  o: {
    a: 'No existe un tratamiento farmacológico específico claramente establecido.',
    b: 'Los antidepresivos tricíclicos no se recomiendan como tratamiento de elección.',
    c: 'La evidencia disponible no permite recomendar el litio como tratamiento específico.',
    d: 'Los IMAO constituyen un tratamiento de primera elección respaldado por evidencia sólida.'
  },
  c: 'd',
  x: 'La d es incorrecta: los IMAO no constituyen un tratamiento de primera elección para la anorexia nerviosa. La rehabilitación nutricional y la psicoterapia son la base del abordaje; ningún fármaco debe emplearse como tratamiento único y el litio tampoco cuenta con respaldo suficiente como tratamiento específico.',
  r: 'Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide, capítulo de trastornos alimentarios; NICE (2017, actualización vigente). Eating disorders: recognition and treatment (NG69).',
  v: 'VALIDADA_ORIGINAL'
});

Object.assign(get('PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_163'), {
  t: ['Tratamientos transdiagnósticos'],
  e: '¿Qué descripción caracteriza correctamente al programa ESTEEM (Effective Skills to Empower Effective Men)?',
  o: {
    a: 'Es una TCC afirmativa y transdiagnóstica centrada en mecanismos relacionados con el estrés de minoría.',
    b: 'Es un protocolo aversivo específico para la cleptomanía.',
    c: 'Es un tratamiento farmacológico del trastorno explosivo intermitente.',
    d: 'Se diseñó exclusivamente para eliminar compulsiones sexuales.'
  },
  c: 'a',
  x: 'ESTEEM adapta la TCC transdiagnóstica desde un enfoque afirmativo para trabajar procesos asociados al estrés de minoría en hombres jóvenes gais y bisexuales. No se diseñó como protocolo exclusivo para un trastorno del control de los impulsos ni para eliminar compulsiones sexuales.',
  r: 'Pachankis, J. E. et al. (2015). LGB-affirmative cognitive-behavioral therapy for young adult gay and bisexual men: a randomized controlled trial. Journal of Consulting and Clinical Psychology, 83, 875-889.',
  v: 'VALIDADA_ORIGINAL'
});

Object.assign(get('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_125'), {
  t: ['Tratamientos transdiagnósticos'],
  e: 'Un estudio de ESTEEM evaluó cambios mediante la Sexual Compulsivity Scale. ¿Qué conclusión es correcta?',
  o: {
    a: 'La medida utilizada demuestra que ESTEEM se creó exclusivamente para el trastorno por comportamiento sexual compulsivo.',
    b: 'La compulsividad sexual fue una de las variables evaluadas, pero ESTEEM es una intervención afirmativa transdiagnóstica sobre estrés de minoría.',
    c: 'ESTEEM es un tratamiento específico para la piromanía.',
    d: 'ESTEEM es una intervención específica para la compra compulsiva.'
  },
  c: 'b',
  x: 'La escala utilizada fue una medida de resultado dentro de una intervención de alcance más amplio. ESTEEM se desarrolló como TCC afirmativa transdiagnóstica para hombres jóvenes gais y bisexuales y aborda mecanismos de estrés de minoría; no debe reclasificarse como tratamiento específico de compulsividad sexual.',
  r: 'Pachankis, J. E. et al. (2015). LGB-affirmative cognitive-behavioral therapy for young adult gay and bisexual men: a randomized controlled trial. Journal of Consulting and Clinical Psychology, 83, 875-889.',
  v: 'VALIDADA_ORIGINAL'
});

Object.assign(get('PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_107'), {
  t: ['Tratamiento de la depresión y trastornos del ánimo'],
  e: 'En la terapia interpersonal de Klerman y Weissman, ¿en qué área se trabajan la tristeza, la ira, la confusión o la impotencia asociadas a un cambio vital?',
  o: {
    a: 'Duelo.',
    b: 'Disputas de rol.',
    c: 'Transiciones de rol.',
    d: 'Déficits interpersonales.'
  },
  c: 'c',
  x: 'Las transiciones de rol abordan cambios vitales que exigen abandonar un papel y asumir otro, como una jubilación, migración, separación o maternidad. Se validan y elaboran la tristeza, la ira, la confusión o la impotencia vinculadas al cambio. El duelo se centra en una muerte; las disputas, en conflictos relacionales; y los déficits, en aislamiento o pobreza de vínculos.',
  r: 'Weissman, M. M., Markowitz, J. C. y Klerman, G. L. (2018). The Guide to Interpersonal Psychotherapy. Oxford University Press; Fonseca Pedrero, E. (coord.) (2021). Manual de tratamientos psicológicos: Adultos. Pirámide.',
  v: 'VALIDADA_ORIGINAL'
});

for (const id of ['MAYO-UNO-24_COMENTADO_077', 'PERSEVER___SIMULACRO_COMENTADO_OCTUBRE-DOS-23_163', 'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_125', 'PERSEVER___SIMULACRO_COMENTADO_NOVIEMBRE-DOS-23_107']) {
  const q = get(id);
  if (!q.e || !q.o || Object.keys(q.o).length !== 4 || !q.o[q.c] || !q.x || !q.r || q.v !== 'VALIDADA_ORIGINAL') throw new Error(`Control fallido: ${id}`);
}

fs.writeFileSync(file, JSON.stringify(bank));
console.log('Preguntas reubicadas y corregidas: anorexia (1), ESTEEM (2 duplicados) y TIP (1).');
