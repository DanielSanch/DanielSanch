/* Puntos de la predicación con IA (Claude Haiku).
 * Recibe la transcripción reciente (con errores de reconocimiento de voz) y los puntos ya mostrados,
 * y devuelve el tema y los puntos corregidos y coherentes. Si no hay internet o falla, el sistema
 * sigue con el extractor sin IA (puntos.js).
 * Funciona en el navegador (window.PuntosIA) y en Node (module.exports) para las pruebas.
 */
(function (raiz) {
  'use strict';

  const MODELO = 'claude-haiku-5-5';
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.2.0/+esm';

  const SISTEMA = [
    'Eres el asistente de proyección de una iglesia cristiana evangélica de habla hispana.',
    'Recibes la transcripción automática (reconocimiento de voz) de una predicación en vivo. La transcripción',
    'no tiene puntuación y trae errores: palabras mal oídas que suenan parecido ("de cierto" por "desierto",',
    '"sobras" por "obras", "grasa" por "gracia"), palabras partidas y muletillas.',
    '',
    'Tu tarea: identificar los puntos de enseñanza que el predicador ha presentado, para mostrarlos en pantalla.',
    'Reglas:',
    '- Solo incluye puntos que el predicador realmente presentó como enseñanza (con marcadores como "primer punto",',
    '  "en segundo lugar", o ideas principales que enumera o repite con énfasis). No inventes puntos ni agregues',
    '  doctrina que él no dijo.',
    '- Corrige los errores de transcripción usando el contexto y el sentido bíblico. Usa ortografía correcta con tildes.',
    '- Cada título: frase corta y clara, máximo 9 palabras, con las palabras del predicador cuando sea posible.',
    '- No incluyas avisos, saludos, agradecimientos ni instrucciones logísticas (orar, apagar celulares, ofrendas).',
    '- Los puntos ya mostrados en pantalla: conserva su redacción exacta, salvo que estén claramente mal; en ese caso',
    '  corrígelos y marca "corregido": true.',
    '- Si no hay puntos claros todavía, devuelve una lista vacía. Es mejor no mostrar nada que mostrar algo dudoso.',
    '- "confianza" de 0 a 1: qué tan seguro estás de que el punto es correcto y fue dicho como punto.',
  ].join('\n');

  const ESQUEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['tema', 'puntos'],
    properties: {
      tema: { type: 'string', description: 'Tema general de la predicación en pocas palabras, o vacío si aún no es claro.' },
      puntos: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['n', 'titulo', 'confianza', 'corregido'],
          properties: {
            n: { type: 'integer' },
            titulo: { type: 'string' },
            confianza: { type: 'number' },
            corregido: { type: 'boolean' },
          },
        },
      },
    },
  };

  function armarMensaje(transcripcion, puntosMostrados, cita) {
    const ya = puntosMostrados && puntosMostrados.length
      ? puntosMostrados.map(p => p.n + '. ' + p.titulo).join('\n')
      : '(ninguno)';
    return [
      cita ? 'Cita bíblica actual: ' + cita : '',
      'Puntos ya mostrados en pantalla:\n' + ya,
      'Transcripción reciente (los números entre corchetes son segundos):\n' + transcripcion,
    ].filter(Boolean).join('\n\n');
  }

  /** Pide los puntos a Claude. `cliente` es una instancia del SDK de Anthropic. */
  async function pedirPuntos(cliente, { transcripcion, puntosMostrados, cita, modelo }) {
    const resp = await cliente.messages.create({
      model: modelo || MODELO,
      max_tokens: 2000,
      system: SISTEMA,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: ESQUEMA } },
      messages: [{ role: 'user', content: armarMensaje(transcripcion, puntosMostrados, cita) }],
    });
    if (resp.stop_reason === 'refusal' || resp.stop_reason === 'max_tokens') {
      return { tema: '', puntos: [], aviso: 'respuesta incompleta (' + resp.stop_reason + ')' };
    }
    const bloque = resp.content.find(b => b.type === 'text');
    const datos = JSON.parse(bloque ? bloque.text : '{"tema":"","puntos":[]}');
    datos.uso = resp.usage;
    return datos;
  }

  /** Crea el cliente en el navegador cargando el SDK oficial desde el CDN. */
  async function clienteNavegador(apiKey) {
    const mod = await import(SDK_URL);
    const Anthropic = mod.default;
    // La clave queda guardada solo en este computador (localStorage). Es una app local de la iglesia.
    return { cliente: new Anthropic({ apiKey, dangerouslyAllowBrowser: true }), Anthropic };
  }

  const api = { MODELO, SISTEMA, ESQUEMA, armarMensaje, pedirPuntos, clienteNavegador };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.PuntosIA = api;
})(typeof window !== 'undefined' ? window : globalThis);
