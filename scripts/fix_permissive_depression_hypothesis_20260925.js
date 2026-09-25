import fs from 'node:fs';

const file = 'public/banco/clinica_adultos.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const question = data.find(q => q.id === 'SmCm5PIR2024_131');
if (!question) throw new Error('Pregunta no encontrada');

question.o.d = 'El déficit en la neurotransmisión serotoninérgica predispone a la aparición de la depresión, presentándose el estado depresivo si hay además un incremento en la neurotransmisión catecolaminérgica';
question.c = 'c';
question.x = 'Según la hipótesis permisiva, el déficit serotoninérgico predispone al trastorno afectivo. Si se acompaña de un déficit catecolaminérgico aparece depresión; si se acompaña de un incremento catecolaminérgico, el estado esperado es maníaco.';
question.r = 'Belloch, Sandín y Ramos. Manual de psicopatología: trastornos depresivos.';
question.v = 'VALIDADA';

fs.writeFileSync(file, `${JSON.stringify(data)}\n`);
console.log('Pregunta SmCm5PIR2024_131 corregida: clave c.');
