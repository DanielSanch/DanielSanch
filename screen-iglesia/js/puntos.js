/* Extractor de puntos de la predicación SIN IA (solo código).
 * Detecta marcadores ("primer punto", "en segundo lugar", "la tercera clave", "por último"...)
 * y valida la coherencia del título antes de mostrarlo:
 *   1) Palabras conocidas: casi todas deben existir en el vocabulario (Biblia + español común).
 *   2) Longitud razonable y al menos 2 palabras con contenido.
 *   3) Confirmación por repetición: los pastores suelen repetir el punto; si se repite,
 *      se elige la versión que más se repite (corrige errores de transcripción aislados).
 * Funciona en el navegador (window.Puntos) y en Node (module.exports) para las pruebas.
 */
(function (raiz) {
  'use strict';
  const Texto = raiz.Texto;

  const ORD_M = { primer: 1, primero: 1, segundo: 2, tercer: 3, tercero: 3, cuarto: 4, quinto: 5, sexto: 6, septimo: 7, ultimo: 99 };
  const ORD_F = { primera: 1, segunda: 2, tercera: 3, cuarta: 4, quinta: 5, sexta: 6, septima: 7, ultima: 99 };
  const SUST_M = new Set(['punto', 'principio', 'paso', 'aspecto', 'lugar', 'consejo', 'secreto', 'fundamento']);
  const SUST_F = new Set(['cosa', 'clave', 'verdad', 'leccion', 'razon', 'palabra', 'ensenanza', 'enseñanza', 'marca', 'caracteristica', 'llave']);
  const RELLENO_INICIO = new Set(['es', 'que', 'cual', 'dice', 'hermanos', 'hermano', 'mire', 'miren', 'escuchen', 'escuche',
    'anoten', 'anote', 'escriba', 'escriban', 'ahi', 'este', 'eh', 'pues', 'bueno', 'entonces', 'aqui', 'y', 'esto', 'importante',
    'bien', 'atentos', 'atento', 'porfavor']);
  const CORTE = new Set(['porque', 'pues', 'entonces', 'hermanos', 'hermano', 'amen', 'aleluya', 'verdad', 'okay', 'ok', 'mire', 'miren',
    'fijense', 'escuchen', 'cierto', 'mientras', 'aunque', 'cuando', 'como', 'si', 'pero', 'ustedes', 'saben', 'imaginense', 'vamos']);
  const FINAL_DEBIL = new Set(['de', 'del', 'y', 'que', 'el', 'la', 'los', 'las', 'en', 'a', 'al', 'un', 'una', 'por', 'para', 'con', 'es', 'se', 'su', 'mi', 'nos', 'o']);
  const COMUNES = new Set(('dios jesus cristo senor espiritu santo amor fe gracia perdon oracion orar iglesia familia vida ' +
    'proposito llamado obediencia santidad esperanza paz gozo fruto fidelidad confianza humildad servicio adoracion ' +
    'alabanza palabra biblia cruz salvacion pecado arrepentimiento milagro sanidad bendicion promesa victoria ' +
    'identidad corazon mente decisiones relacion relaciones tiempo dinero trabajo hijos padres matrimonio problemas ' +
    'crisis temor miedo ansiedad prueba pruebas proceso procesos honra honrar diezmo ofrenda generosidad ' +
    'incondicional condicional personal diario diaria constante nuevo nueva primero siempre nunca hoy mañana manana').split(' '));

  function crear(opciones) {
    opciones = opciones || {};
    const vocab = opciones.vocabulario || new Set();
    const ventanaConfirmacion = opciones.ventanaConfirmacion || 90;   // segundos para buscar repetición
    const esperaSinRepeticion = opciones.esperaSinRepeticion || 35; // si no se repite, mostrar tras X s si es muy limpio
    const historial = [];   // {t, toks}
    const candidatos = [];  // {n, t, variantes: Map(texto->{conteo, toks}), estado}
    const mostrados = [];

    function conocida(w) { return /^\d+$/.test(w) || vocab.has(w) || COMUNES.has(w) || (Texto.STOP && Texto.STOP.has(w)); }
    function contenido(toks) { return toks.filter(w => !(Texto.STOP.has(w)) && w.length > 2); }

    function tituloDesde(toks, i) {
      let j = i;
      while (j < toks.length && RELLENO_INICIO.has(toks[j]) && j - i < 7) j++;
      const out = [];
      for (; j < toks.length && out.length < 10; j++) {
        const w = toks[j];
        if (CORTE.has(w) && contenido(out).length >= 2) break;
        if (detectarMarcador(toks, j)) break; // empieza otro punto
        out.push(w);
      }
      while (out.length && FINAL_DEBIL.has(out[out.length - 1])) out.pop();
      return out;
    }

    function detectarMarcador(toks, i) {
      const a = toks[i], b = toks[i + 1], c = toks[i + 2];
      if (a in ORD_M && SUST_M.has(b)) return { n: ORD_M[a], fin: i + 2 };
      if (a === 'en' && b in ORD_M && c === 'lugar') return { n: ORD_M[b], fin: i + 3 };
      if (a in ORD_F && SUST_F.has(b)) return { n: ORD_F[a], fin: i + 2 };
      if (a === 'punto' && b === 'numero' && /^\d+$/.test(c || '')) return { n: +c, fin: i + 3 };
      if (a === 'punto' && /^\d+$/.test(b || '') && +b < 10) return { n: +b, fin: i + 2 };
      if ((a === 'por' && b === 'ultimo') || a === 'finalmente') return { n: 99, fin: i + (a === 'por' ? 2 : 1) };
      return null;
    }

    function calidad(toks) {
      if (toks.length < 2 || toks.length > 12) return 0;
      const cont = contenido(toks);
      if (cont.length < 1) return 0;
      const conocidas = toks.filter(conocida).length / toks.length;
      return conocidas;
    }

    function similares(a, b) {
      const A = new Set(contenido(a)), B = new Set(contenido(b));
      if (!A.size || !B.size) return 0;
      let inter = 0; A.forEach(w => { if (B.has(w)) inter++; });
      return inter / Math.min(A.size, B.size);
    }

    /** Agrega un fragmento final de la transcripción. t = segundos desde el inicio. */
    function agregar(texto, t) {
      const toks = Texto.numerosEnPalabras(Texto.tokens(texto));
      historial.push({ t, toks });

      // 1) Marcadores nuevos
      let desde = 0; // la confirmación solo se busca DESPUÉS del título recién dicho
      for (let i = 0; i < toks.length; i++) {
        const m = detectarMarcador(toks, i);
        if (!m) continue;
        const titulo = tituloDesde(toks, m.fin);
        desde = Math.max(desde, m.fin + titulo.length + 2);
        let n = m.n === 99 ? (candidatos.length ? Math.max(...candidatos.map(c => c.n)) + 1 : 1) : m.n;
        let cand = candidatos.find(c => c.n === n && t - c.t < 600);
        if (!cand) { cand = { n, t, variantes: new Map(), estado: 'pendiente' }; candidatos.push(cand); }
        if (titulo.length) sumarVariante(cand, titulo);
        i = m.fin;
      }

      // 2) Confirmación por repetición: buscar frases parecidas a los candidatos pendientes
      candidatos.filter(c => c.estado === 'pendiente').forEach(c => {
        if (t - c.t > ventanaConfirmacion) return;
        const mejor = mejorVariante(c);
        if (!mejor) return;
        const largo = mejor.toks.length;
        for (let i = (t === c.t ? desde : 0); i + 2 <= toks.length; i++) {
          const ventana = toks.slice(i, i + largo);
          if (similares(ventana, mejor.toks) >= 0.6) {
            // recortar la ventana a las palabras con contenido alineadas
            const recorte = recortar(ventana);
            if (recorte.length >= 2) sumarVariante(c, recorte, 0.5);
            c.repetido = (c.repetido || 0) + 1;
            break;
          }
        }
      });

      return revisar(t);
    }

    function recortar(toks) {
      const out = toks.slice();
      while (out.length && (FINAL_DEBIL.has(out[0]) || RELLENO_INICIO.has(out[0]))) out.shift();
      while (out.length && FINAL_DEBIL.has(out[out.length - 1])) out.pop();
      return out;
    }

    function sumarVariante(c, toks, peso) {
      const k = toks.join(' ');
      const v = c.variantes.get(k) || { conteo: 0, toks };
      v.conteo += (peso || 1);
      c.variantes.set(k, v);
    }

    function mejorVariante(c) {
      let mejor = null;
      c.variantes.forEach(v => {
        const s = v.conteo + calidad(v.toks);
        if (!mejor || s > mejor.s) mejor = { s, toks: v.toks, conteo: v.conteo, q: calidad(v.toks) };
      });
      return mejor;
    }

    /** Decide qué candidatos se muestran. Devuelve los puntos nuevos para mostrar. */
    function revisar(t) {
      const nuevos = [];
      candidatos.filter(c => c.estado === 'pendiente').forEach(c => {
        const m = mejorVariante(c);
        const transcurrido = t - c.t;
        if (m && (c.repetido || 0) >= 1) {
          c.estado = 'mostrado'; c.titulo = formatear(m.toks); c.motivo = 'repetido';
        } else if (m && m.q >= 1 && transcurrido >= esperaSinRepeticion) {
          c.estado = 'mostrado'; c.titulo = formatear(m.toks); c.motivo = 'limpio';
        } else if (transcurrido >= esperaSinRepeticion * 2) {
          c.estado = 'descartado'; c.motivo = m ? 'baja calidad (' + m.q.toFixed(2) + ')' : 'sin título';
          c.titulo = m ? formatear(m.toks) : '';
        }
        if (c.estado === 'mostrado') { mostrados.push(c); nuevos.push({ n: c.n, titulo: c.titulo, motivo: c.motivo }); }
      });
      return nuevos;
    }

    function formatear(toks) {
      const formas = opciones.formas || {};
      const s = toks.map(w => formas[w] || w).join(' ');
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function finalizar(t) { return revisar(t + 1000); }

    return { agregar, finalizar, candidatos, mostrados };
  }

  const api = { crear };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.Puntos = api;
})(typeof window !== 'undefined' ? window : globalThis);
