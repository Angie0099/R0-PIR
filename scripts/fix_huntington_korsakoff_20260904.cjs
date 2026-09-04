const fs=require('fs'),p='public/banco/clinica_adultos.json';
const a=JSON.parse(fs.readFileSync(p));
function set(id,data){const q=a.find(x=>x.id===id);if(!q)throw Error('No encontrado: '+id);Object.assign(q,data,{s:'Clínica Adultos',t:['Trastornos neurocognitivos'],v:'VALIDADA_ORIGINAL'});}
set('SmCm09PIR2025_078',{
 e:'Respecto al número de repeticiones CAG del gen HTT y la enfermedad de Huntington, señale la afirmación correcta:',
 o:{a:'Con 26 repeticiones o menos se desarrolla siempre la enfermedad.',b:'Entre 27 y 35 repeticiones existe penetrancia completa.',c:'Entre 36 y 39 repeticiones puede existir penetrancia reducida, mientras que 40 o más se asocian a penetrancia completa.',d:'La cantidad de repeticiones CAG no influye en la aparición de la enfermedad.'},
 c:'c',
 x:'La opción c es correcta: los alelos con 36–39 repeticiones CAG presentan penetrancia reducida, por lo que algunas personas desarrollan la enfermedad y otras no; con 40 o más repeticiones la penetrancia es completa. La a es falsa porque 26 o menos corresponde al rango normal. La b es falsa porque 27–35 es un alelo intermedio que no causa la enfermedad en la persona portadora, aunque puede expandirse en la descendencia. La d es falsa porque el tamaño de la expansión se relaciona con la probabilidad de desarrollar la enfermedad y, de forma general, con una edad de inicio más temprana.',
 r:'Caron, N. S., Wright, G. E. B. y Hayden, M. R. (2020, actualización 2025). Huntington Disease. GeneReviews®. University of Washington, Seattle, tabla «Classification of HTT CAG Repeat Sizes». https://www.ncbi.nlm.nih.gov/books/NBK1305/.'
});
set('SmCm10PIR2025_060',{
 e:'¿Cuál de los siguientes síntomas NO forma parte de la tétrada característica de la fase crónica del síndrome de Korsakoff?',
 o:{a:'Prosopagnosia.',b:'Amnesia anterógrada para hechos recientes.',c:'Desorientación, especialmente temporal.',d:'Confabulación o pseudorrecuerdos.'},
 c:'a',
 x:'La opción a es correcta: la prosopagnosia es una agnosia visual para rostros y no integra la tétrada característica del síndrome de Korsakoff. La b sí forma parte del cuadro: existe una alteración intensa para adquirir información nueva, acompañada habitualmente de amnesia retrógrada parcial. La c también es característica, sobre todo la desorientación temporal. La d es igualmente típica: pueden aparecer confabulaciones o pseudorrecuerdos, especialmente en fases iniciales, además de falsos reconocimientos ocasionales.',
 r:'Belloch, A., Sandín, B. y Ramos, F. (coords.) (2024). Manual de psicopatología, vol. I (4.ª ed.). McGraw Hill, capítulo «Psicopatología de la memoria», apartado sobre síndrome de Wernicke-Korsakoff, pp. 260–262.'
});
fs.writeFileSync(p,JSON.stringify(a));console.log('Corregidas 2 preguntas neurocognitivas');
