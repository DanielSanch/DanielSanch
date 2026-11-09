/* Prueba de escritorio de los puntos CON IA (Claude Haiku) usando las mismas predicaciones simuladas.
 * Uso:  cd pruebas && npm install && ANTHROPIC_API_KEY=sk-ant-... node probar-puntos-ia.js
 * Simula el servicio en vivo: después de cada fragmento envía los últimos 3 minutos de transcripción. */
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk').default;
const PuntosIA = require(path.join(__dirname, '../js/puntos-ia.js'));
const escenarios = require('./escenarios-predica.js');

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta la clave: ANTHROPIC_API_KEY=sk-ant-... node probar-puntos-ia.js');
    process.exit(1);
  }
  const cliente = new Anthropic();
  let tokensEntrada = 0, tokensSalida = 0, llamadas = 0;
  for (const e of escenarios) {
    console.log('\n=== ' + e.nombre);
    console.log('  Esperado:'); e.esperado.forEach((x, i) => console.log('    ' + (i + 1) + '. ' + x));
    if (!e.esperado.length) console.log('    (nada)');
    let mostrados = [];
    const lineas = [];
    for (const [t, f] of e.frases) {
      lineas.push({ t, f });
      const recientes = lineas.filter(l => t - l.t <= 180).map(l => '[' + l.t + '] ' + l.f).join('\n');
      try {
        const r = await PuntosIA.pedirPuntos(cliente, { transcripcion: recientes, puntosMostrados: mostrados });
        llamadas++; tokensEntrada += r.uso.input_tokens; tokensSalida += r.uso.output_tokens;
        // Igual que en la app: solo se muestra lo que tiene confianza >= 0.7
        const nuevos = r.puntos.filter(p => p.confianza >= 0.7);
        for (const p of nuevos) {
          const previo = mostrados.find(m => m.n === p.n);
          if (!previo) console.log('    [t=' + t + '] muestra ' + p.n + '. ' + p.titulo + '  (confianza ' + p.confianza + ')');
          else if (previo.titulo !== p.titulo) console.log('    [t=' + t + '] corrige ' + p.n + '. ' + previo.titulo + '  ->  ' + p.titulo);
        }
        mostrados = mostrados.filter(m => !nuevos.find(p => p.n === m.n)).concat(nuevos.map(p => ({ n: p.n, titulo: p.titulo })))
          .sort((a, b) => a.n - b.n);
        if (r.aviso) console.log('    aviso: ' + r.aviso);
      } catch (err) {
        if (err instanceof Anthropic.AuthenticationError) { console.error('Clave de API inválida o ausente.'); process.exit(1); }
        else if (err instanceof Anthropic.RateLimitError) console.error('    límite de uso, se omite este fragmento');
        else if (err instanceof Anthropic.APIConnectionError) { console.error('Sin conexión con la API.'); process.exit(1); }
        else throw err;
      }
    }
    console.log('  En pantalla al final (con IA):');
    mostrados.forEach(m => console.log('    ' + m.n + '. ' + m.titulo));
    if (!mostrados.length) console.log('    (nada)');
  }
  const costo = tokensEntrada / 1e6 * 0.10 + tokensSalida / 1e6 * 0.50;
  console.log('\nLlamadas: ' + llamadas + ' · tokens entrada ' + tokensEntrada + ' · salida ' + tokensSalida +
    ' · costo aprox. US$' + costo.toFixed(4));
}
main();
