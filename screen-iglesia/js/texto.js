/* Utilidades de texto en español: normalización y números dichos en palabras. */
(function () {
  'use strict';

  function normalizar(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/(\d)\s*[:.,]\s*(\d)/g, '$1 : $2')   // 3:16, 3.16, 3,16
      .replace(/(\d)\s*-\s*(\d)/g, '$1 al $2')       // 16-18
      .replace(/\b(\d)\.?(?:ª|º|era|ra|ro|da|do|a|o)(?=\s|$)/g, '$1') // 1a, 1ra, 2da
      .replace(/[¿?¡!;"“”«»()\[\]]/g, ' ')
      .replace(/[,.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokens(s) {
    const n = normalizar(s);
    return n ? n.split(' ') : [];
  }

  const UNIDADES = {
    cero: 0, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
    diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17,
    dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintiun: 21, veintidos: 22, veintitres: 23,
    veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29
  };
  const DECENAS = { treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90 };

  /** Convierte secuencias de números en palabras a dígitos: "ciento diecinueve" -> "119". */
  function numerosEnPalabras(toks) {
    const out = [];
    let i = 0;
    while (i < toks.length) {
      let t = toks[i];
      let valor = null, j = i;
      if (t === 'cien') { valor = 100; j = i + 1; }
      else if (t === 'ciento') {
        valor = 100; j = i + 1;
        const r = leerMenorCien(toks, j);
        if (r) { valor += r.v; j = r.j; }
      } else {
        const r = leerMenorCien(toks, i);
        if (r) { valor = r.v; j = r.j; }
      }
      if (valor !== null) { out.push(String(valor)); i = j; }
      else { out.push(t); i++; }
    }
    return out;
  }

  function leerMenorCien(toks, i) {
    const t = toks[i];
    if (t in UNIDADES) return { v: UNIDADES[t], j: i + 1 };
    if (t in DECENAS) {
      let v = DECENAS[t], j = i + 1;
      if (toks[j] === 'y' && toks[j + 1] in UNIDADES && UNIDADES[toks[j + 1]] < 10 && UNIDADES[toks[j + 1]] > 0) {
        v += UNIDADES[toks[j + 1]]; j += 2;
      }
      return { v, j };
    }
    return null;
  }

  const STOP = new Set(('a al ante bajo con contra de del desde el en entre hacia hasta la las le les lo los mas me mi mis ' +
    'muy nos o para pero por que se si sin sobre su sus te tu tus un una unas uno unos y ya yo es son fue era ' +
    'este esta estos estas ese esa eso esto aqui alli como cuando donde porque pues tambien entonces asi hay ha han ' +
    'he hemos ser estar tiene tienen tener vamos va van voy dice dijo decir hoy ahora todo toda todos todas cada ' +
    'algo nada mismo misma otro otra otros otras bien mal solo no ni le algun alguna eh ah oh amen aleluya gloria ' +
    'hermanos hermano hermana iglesia gracias ustedes usted ellos ellas nosotros vosotros el ella').split(' '));

  window.Texto = { normalizar, tokens, numerosEnPalabras, STOP };
})();
