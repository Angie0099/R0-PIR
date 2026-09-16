const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'banco', 'tratamientos_adultos.json');
const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
const q = bank.find(item => item.id === 'DICIEMBRE-UNO-24_COMENTADO_158');
if (!q) throw new Error('No se encontró la pregunta que debe actualizarse');
Object.assign(q, {
  e: 'Si una persona que toma valproato inicia lamotrigina, ¿qué precaución farmacológica es especialmente importante?',
  o: {
    a: 'Utilizar una pauta de titulación más lenta y dosis iniciales menores de lamotrigina por el aumento de su concentración y del riesgo de erupción grave.',
    b: 'Comenzar lamotrigina directamente a la dosis máxima.',
    c: 'Retirar el valproato de forma brusca sin supervisión.',
    d: 'Considerar que ambos fármacos carecen de interacción.'
  },
  c: 'a',
  x: 'El valproato inhibe el metabolismo de lamotrigina, aumenta su exposición y eleva el riesgo de reacciones cutáneas graves. Por ello deben respetarse dosis iniciales menores y una titulación más lenta, siguiendo la ficha técnica y la vigilancia clínica.',
  r: 'European Medicines Agency. Lamotrigine: Summary of Product Characteristics; National Institute for Health and Care Excellence (actualización 2025). Bipolar disorder: assessment and management (CG185), recomendaciones sobre lamotrigina y valproato.',
  v: 'VALIDADA_ORIGINAL'
});
fs.writeFileSync(file, JSON.stringify(bank));
console.log('Pregunta clásica de valproato y ciclación rápida sustituida por una interacción farmacológica vigente.');
