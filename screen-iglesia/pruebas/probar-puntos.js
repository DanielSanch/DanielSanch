/* Prueba de escritorio del extractor de puntos sin IA.  Uso: node pruebas/probar-puntos.js */
const path = require('path');
globalThis.window = globalThis;
require(path.join(__dirname, '../js/texto.js'));
// Vocabulario: todas las palabras de la Biblia RV1909 (normalizadas)
require(path.join(__dirname, '../data/rv1909.js'));
const vocab = new Set(), conteo = {};
for (const libro of window.BIBLIA_RV1909.libros) for (const cap of libro) for (const v of cap)
  for (const w of v.split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/)) {
    if (!w) continue; const n = window.Texto.normalizar(w); vocab.add(n);
    (conteo[n] = conteo[n] || {})[w] = (conteo[n][w] || 0) + 1;
  }
// forma escrita más común (con tildes y mayúsculas): oir -> oír, dios -> Dios
const formas = {};
for (const n in conteo) { const f = Object.entries(conteo[n]).sort((a, b) => b[1] - a[1])[0][0];
  if (n.length > 1 && (f.toLowerCase() !== n || /^[A-ZÁÉÍÓÚÑ]/.test(f))) formas[n] = (f === f.toUpperCase() && f.length > 1) ? f.toLowerCase() : f; }
const Puntos = require(path.join(__dirname, '../js/puntos.js'));
const escenarios = require('./escenarios-predica.js');

for (const e of escenarios) {
  const ext = Puntos.crear({ vocabulario: vocab, formas });
  const salida = [];
  let ultimo = 0;
  for (const [t, f] of e.frases) { ext.agregar(f, t).forEach(p => salida.push({ ...p, t })); ultimo = t; }
  ext.finalizar(ultimo).forEach(p => salida.push({ ...p, t: 'fin' }));
  console.log('\n=== ' + e.nombre);
  console.log('  Esperado:');
  e.esperado.forEach((x, i) => console.log('    ' + (i + 1) + '. ' + x));
  if (!e.esperado.length) console.log('    (nada)');
  console.log('  En pantalla (sin IA):');
  salida.forEach(p => console.log('    ' + (p.n === 99 ? '·' : p.n) + '. ' + p.titulo + '   [t=' + p.t + ', ' + p.motivo + ']'));
  if (!salida.length) console.log('    (nada)');
  const desc = ext.candidatos.filter(c => c.estado === 'descartado');
  desc.forEach(c => console.log('    (descartado ' + c.n + ': "' + c.titulo + '" - ' + c.motivo + ')'));
}
