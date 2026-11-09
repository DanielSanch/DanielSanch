/* Importador de versiones de la Biblia desde archivos que tenga la iglesia.
 * El archivo se lee en el navegador y se guarda SOLO en este computador (nunca se sube a internet).
 *
 * Formatos aceptados:
 *  - JSON: varias estructuras comunes (libros/capítulos/versículos, lista plana de versículos, etc.)
 *  - XML: Zefania (.xml), OSIS (.xml / .osis), OpenSong (sin extensión o .xml)
 *  - SQLite: MyBible (.SQLite3), e-Sword (.bblx), MySword (.bbl.mybible), OpenLP (.sqlite)
 *  - JSON de FreeShow (books/chapters/verses con "number")
 *  - Texto / CSV / TSV: "Juan 3:16 texto", "43|3|16|texto", "libro,capitulo,versiculo,texto"
 *
 * Resultado: { nombre, abrev, libros: [66][capítulos][versículos] } con el canon de 66 libros.
 * Funciona en el navegador (window.ImportarBiblia) y en Node (module.exports) para las pruebas.
 */
(function (raiz) {
  'use strict';

  const OSIS = ('Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song ' +
    'Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor ' +
    'Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev').split(' ');
  const INGLES = ('genesis exodus leviticus numbers deuteronomy joshua judges ruth 1samuel 2samuel 1kings 2kings ' +
    '1chronicles 2chronicles ezra nehemiah esther job psalms proverbs ecclesiastes songofsolomon isaiah jeremiah ' +
    'lamentations ezekiel daniel hosea joel amos obadiah jonah micah nahum habakkuk zephaniah haggai zechariah malachi ' +
    'matthew mark luke john acts romans 1corinthians 2corinthians galatians ephesians philippians colossians ' +
    '1thessalonians 2thessalonians 1timothy 2timothy titus philemon hebrews james 1peter 2peter 1john 2john 3john jude ' +
    'revelation').split(' ');
  // MyBible numera los libros 10, 20, 30... (con huecos para los deuterocanónicos)
  const MYBIBLE = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 190, 220, 230, 240, 250, 260,
    290, 300, 310, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520,
    530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730];

  function sinTildes(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  /** Devuelve el índice 0..65 de un libro a partir de número, código OSIS o nombre (español o inglés). */
  function indiceLibro(valor) {
    if (valor === null || valor === undefined) return -1;
    if (typeof valor === 'number' || /^\d+$/.test(String(valor).trim())) {
      const n = +valor; return n >= 1 && n <= 66 ? n - 1 : -1;
    }
    const crudo = String(valor).trim();
    const o = OSIS.findIndex(x => x.toLowerCase() === crudo.toLowerCase());
    if (o >= 0) return o;
    const s0 = sinTildes(crudo).replace(/[.\s_-]+/g, ' ').trim();
    if (!/^(i{1,3}|[123]\w*|primer[oa]?|segund[oa]|tercer[oa]?)\b/.test(s0)) {
      const directo = buscarNombre(s0);
      if (directo >= 0) return directo;
    }
    const s = s0.replace(/^(iii|3ra|3a|tercera|tercero|3)\s*/, '3 ').replace(/^(ii|2da|2a|segunda|segundo|2)\s*/, '2 ')
      .replace(/^(i|1ra|1a|primera|primero|1)\s+/, '1 ').replace(/^(1)(?=[a-z])/, '1 ');
    return buscarNombre(s);
  }

  function buscarNombre(s) {
    const compacto = s.replace(/\s+/g, '').replace(/ofjohn$/, '').replace(/^psalm$/, 'psalms').replace(/^songofsongs$/, 'songofsolomon');
    const e = INGLES.indexOf(compacto);
    if (e >= 0) return e;
    const m = s.match(/^([123])\s*(.+)$/);
    const num = m ? +m[1] : 0;
    const base = (m ? m[2] : s).replace(/^(de|a)\s+(los\s+)?/, '').replace(/^(carta|epistola)\s+(de\s+|a\s+(los\s+)?)?/, '').split(' ')[0];
    const L = raiz.Libros;
    const entrada = L && L.porBase[base];
    if (entrada) return num ? (entrada.numerado[num] ?? -1) : (entrada.simple ?? entrada.numerado[1] ?? -1);
    // abreviaturas en español: "Gn", "Ex", "1 Co", "Ap"...
    if (L && base.length >= 2) {
      const sub = (abr, nom) => { let k = 0; for (const ch of nom) if (ch === abr[k]) k++; return k === abr.length && nom[0] === abr[0]; };
      let cand = L.libros.filter(l => l.num === num && l.base.startsWith(base));
      if (cand.length !== 1) cand = L.libros.filter(l => l.num === num && sub(base, l.base));
      if (cand.length === 1) return cand[0].i;
    }
    return -1;
  }

  function nuevaBiblia() { return Array.from({ length: 66 }, () => []); }
  function poner(libros, b, c, v, texto) {
    if (b < 0 || b > 65 || !(c >= 1) || !(v >= 1)) return false;
    const caps = libros[b];
    caps[c - 1] = caps[c - 1] || [];
    const t = limpiar(texto);
    caps[c - 1][v - 1] = caps[c - 1][v - 1] ? caps[c - 1][v - 1] + ' ' + t : t;
    return true;
  }

  const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  function limpiar(t) {
    return String(t || '')
      .replace(/<(note|NOTE|f|S|n|h|gr|DIV|title)\b[^>]*>[\s\S]*?<\/\1>/g, ' ') // notas, números Strong, títulos
      .replace(/<[^>]+>/g, ' ')
      .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#'
        ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m))
      .replace(/\s+/g, ' ').trim();
  }
  function limpiarRTF(t) {
    return String(t || '').replace(/\{\\[^{}]*\}/g, ' ').replace(/\\'([0-9a-f]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\u(-?\d+)\??/g, (m, n) => String.fromCharCode(n < 0 ? +n + 65536 : +n))
      .replace(/\\[a-z]+-?\d* ?/gi, ' ').replace(/[{}]/g, ' ');
  }
  function attr(s, nombre) {
    const m = s.match(new RegExp('\\b' + nombre + '\\s*=\\s*"([^"]*)"', 'i')) || s.match(new RegExp('\\b' + nombre + "\\s*=\\s*'([^']*)'", 'i'));
    return m ? m[1] : null;
  }

  /* ---------- JSON ---------- */
  function desdeJSON(d) {
    const libros = nuevaBiblia();
    let nombre = '';
    if (d && Array.isArray(d.libros)) { // formato propio
      return { nombre: d.nombre, abrev: d.abrev, libros: d.libros };
    }
    if (d && !Array.isArray(d) && (d.books || d.Books)) { nombre = typeof d.translation === 'string' ? d.translation : (d.name || ''); d = d.books || d.Books; }
    if (Array.isArray(d) && d.length && (d[0].chapters || d[0].capitulos)) {
      d.forEach((b, pos) => {
        let i = b.number ? indiceLibro(b.number) : indiceLibro(b.name ?? b.nombre ?? b.book ?? b.abbrev ?? b.id);
        if (i < 0 && d.length === 66) i = pos;
        (b.chapters || b.capitulos).forEach((c, ci) => {
          const vs = Array.isArray(c) ? c : (c.verses || c.versiculos || []);
          const cn = Array.isArray(c) ? ci + 1 : +(c.chapter ?? c.capitulo ?? c.number ?? ci + 1);
          vs.forEach((v, vi) => typeof v === 'string' ? poner(libros, i, cn, vi + 1, v)
            : poner(libros, i, cn, +(v.verse ?? v.versiculo ?? v.number ?? vi + 1), v.text ?? v.texto ?? v.value));
        });
      });
      return { nombre, libros };
    }
    const lista = Array.isArray(d) ? d : (d.verses || d.versiculos || []);
    if (lista.length && typeof lista[0] === 'object') {
      lista.forEach(v => poner(libros, indiceLibro(v.book_id ?? v.book ?? v.libro ?? v.book_name ?? v.b),
        +(v.chapter ?? v.capitulo ?? v.c), +(v.verse ?? v.versiculo ?? v.v), v.text ?? v.texto ?? v.t));
      return { nombre, libros };
    }
    throw new Error('No reconozco la estructura de este JSON.');
  }

  /* ---------- XML ---------- */
  function desdeXML(x) {
    const libros = nuevaBiblia();
    let nombre = '';
    if (/<XMLBIBLE\b/i.test(x) || /<BIBLEBOOK\b/i.test(x)) { // Zefania
      nombre = limpiar((x.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || attr(x.match(/<XMLBIBLE[^>]*>/i)?.[0] || '', 'biblename') || '');
      for (const b of x.matchAll(/<BIBLEBOOK\b([^>]*)>([\s\S]*?)<\/BIBLEBOOK>/gi)) {
        let i = indiceLibro(attr(b[1], 'bnumber'));
        if (i < 0) i = indiceLibro(attr(b[1], 'bname'));
        for (const c of b[2].matchAll(/<CHAPTER\b([^>]*)>([\s\S]*?)<\/CHAPTER>/gi))
          for (const v of c[2].matchAll(/<VERS\b([^>]*)>([\s\S]*?)<\/VERS>/gi))
            poner(libros, i, +attr(c[1], 'cnumber'), +attr(v[1], 'vnumber'), v[2]);
      }
      return { nombre, libros };
    }
    if (/<osis\b/i.test(x) || /osisID=/.test(x)) { // OSIS
      nombre = limpiar((x.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
      const ref = r => { const p = r.split(/\s+/)[0].split('.'); return [indiceLibro(p[0]), +p[1], +p[2]]; };
      for (const v of x.matchAll(/<verse\b(?=[^>]*\bosisID=)(?![^>]*\/>)[^>]*\bosisID="([^"]+)"[^>]*>([\s\S]*?)<\/verse>/g)) {
        const [b, c, n] = ref(v[1]); poner(libros, b, c, n, v[2]);
      }
      for (const v of x.matchAll(/<verse\b[^>]*\bsID="([^"]+)"[^>]*\/>([\s\S]*?)<verse\b[^>]*\beID="\1"[^>]*\/>/g)) {
        const id = (v[0].match(/osisID="([^"]+)"/) || [])[1] || v[1];
        const [b, c, n] = ref(id); poner(libros, b, c, n, v[2]);
      }
      return { nombre, libros };
    }
    if (/<bible\b/i.test(x) && /<b\b/i.test(x)) { // OpenSong
      nombre = attr(x.match(/<bible\b[^>]*>/i)[0], 'n') || '';
      let pos = 0;
      for (const b of x.matchAll(/<b\b([^>]*)>([\s\S]*?)<\/b>/gi)) {
        let i = indiceLibro(attr(b[1], 'n'));
        if (i < 0) i = pos;
        pos++;
        for (const c of b[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/gi))
          for (const v of c[2].matchAll(/<v\b([^>]*)>([\s\S]*?)<\/v>/gi))
            poner(libros, i, +attr(c[1], 'n'), +attr(v[1], 'n'), v[2]);
      }
      return { nombre, libros };
    }
    throw new Error('Este XML no parece Zefania, OSIS ni OpenSong.');
  }

  /* ---------- Texto / CSV ---------- */
  function desdeTexto(t) {
    const libros = nuevaBiblia();
    const lineas = t.split(/\r?\n/);
    let ok = 0;
    const sep = /\t/.test(lineas[0]) ? '\t' : /\|/.test(lineas[0]) ? '|' : null;
    for (const linea of lineas) {
      if (!linea.trim()) continue;
      let m;
      if (sep) {
        const p = linea.split(sep);
        if (p.length >= 4 && /^\d+$/.test(p[1]) && /^\d+$/.test(p[2])) { ok += poner(libros, indiceLibro(p[0]), +p[1], +p[2], p.slice(3).join(' ')); continue; }
        if (p.length >= 2 && (m = p[0].match(/^(.+?)\s+(\d+)\s*[:.]\s*(\d+)$/))) { ok += poner(libros, indiceLibro(m[1]), +m[2], +m[3], p.slice(1).join(' ')); continue; }
      }
      if ((m = linea.match(/^"?([^",]+?)"?\s*,\s*"?(\d+)"?\s*,\s*"?(\d+)"?\s*,\s*"?([\s\S]*?)"?\s*$/))) { ok += poner(libros, indiceLibro(m[1]), +m[2], +m[3], m[4].replace(/""/g, '"')); continue; }
      if ((m = linea.match(/^\s*((?:[123]\s*)?[A-Za-zÁÉÍÓÚÑáéíóúñ.]+(?:\s+(?:de\s+los\s+)?[A-Za-zÁÉÍÓÚÑáéíóúñ]+)?)\s+(\d+)\s*[:.]\s*(\d+)\s+(.+)$/))) { ok += poner(libros, indiceLibro(m[1]), +m[2], +m[3], m[4]); }
    }
    if (!ok) throw new Error('No encontré versículos en este archivo de texto.');
    return { nombre: '', libros };
  }

  /* ---------- SQLite (MyBible, e-Sword, MySword) ---------- */
  function desdeSQLite(bytes, SQL) {
    const db = new SQL.Database(new Uint8Array(bytes));
    const tablas = db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.map(r => String(r[0]).toLowerCase()) || [];
    const libros = nuevaBiblia();
    let nombre = '';
    try {
      if (tablas.includes('verses')) { // MyBible
        const info = db.exec("SELECT name, value FROM info");
        if (info[0]) info[0].values.forEach(([k, v]) => { if (k === 'description') nombre = v; });
        for (const [b, c, v, t] of db.exec('SELECT book_number, chapter, verse, text FROM verses')[0].values)
          poner(libros, MYBIBLE.indexOf(+b), +c, +v, t);
      } else if (tablas.includes('bible')) { // e-Sword / MySword
        const det = tablas.includes('details') ? db.exec('SELECT * FROM Details')[0] : null;
        if (det) { const k = det.columns.findIndex(c => /description|title/i.test(c)); if (k >= 0) nombre = det.values[0][k]; }
        for (const [b, c, v, t] of db.exec('SELECT Book, Chapter, Verse, Scripture FROM Bible')[0].values)
          poner(libros, +b - 1, +c, +v, limpiarRTF(t));
      } else if (tablas.includes('verse') && tablas.includes('book')) { // OpenLP (.sqlite de su carpeta de datos)
        const meta = tablas.includes('metadata') ? db.exec("SELECT key, value FROM metadata WHERE key='name'")[0] : null;
        if (meta) nombre = meta.values[0][1];
        const ref = {};
        for (const [id, r] of db.exec('SELECT id, book_reference_id FROM book')[0].values) ref[id] = +r - 1;
        for (const [b, c, v, t] of db.exec('SELECT book_id, chapter, verse, text FROM verse')[0].values)
          poner(libros, ref[b], +c, +v, t);
      } else throw new Error('Esta base de datos no parece MyBible, e-Sword, MySword ni OpenLP.');
    } finally { db.close(); }
    return { nombre, libros };
  }

  /** Revisa que la Biblia importada esté completa y devuelve un resumen. */
  function validar(biblia) {
    const faltan = [];
    let caps = 0, versos = 0;
    biblia.libros.forEach((l, i) => {
      if (!l.length) faltan.push(i);
      l.forEach(c => { caps++; versos += (c || []).filter(Boolean).length; });
    });
    for (let i = 0; i < 66; i++) for (let c = 0; c < biblia.libros[i].length; c++) {
      biblia.libros[i][c] = Array.from(biblia.libros[i][c] || [], v => v || '');
    }
    return { libros: 66 - faltan.length, librosFaltantes: faltan, capitulos: caps, versiculos: versos };
  }

  /** Importa a partir del nombre del archivo y su contenido (texto o ArrayBuffer). */
  async function importar(nombreArchivo, contenido, opciones) {
    opciones = opciones || {};
    const ext = (nombreArchivo.toLowerCase().match(/\.([a-z0-9]+)$/) || [])[1] || '';
    let bytes = contenido instanceof ArrayBuffer ? new Uint8Array(contenido) : (contenido instanceof Uint8Array ? contenido : null);
    let biblia;
    const esSQLite = bytes && String.fromCharCode(...bytes.slice(0, 15)) === 'SQLite format 3';
    if (esSQLite || ['sqlite3', 'bblx', 'mybible', 'sqlite', 'db'].includes(ext)) {
      const SQL = opciones.SQL || await cargarSQLjs();
      biblia = desdeSQLite(bytes, SQL);
    } else {
      const texto = bytes ? new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '') : String(contenido).replace(/^﻿/, '');
      const inicio = texto.trimStart()[0];
      if (inicio === '{' || inicio === '[') biblia = desdeJSON(JSON.parse(texto));
      else if (inicio === '<') biblia = desdeXML(texto);
      else biblia = desdeTexto(texto);
    }
    biblia.resumen = validar(biblia);
    biblia.nombre = biblia.nombre || nombreArchivo.replace(/\.[^.]+$/, '');
    return biblia;
  }

  async function cargarSQLjs() {
    if (raiz.initSqlJs) return raiz.initSqlJs({ locateFile: f => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + f });
    await new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
      s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar el lector de SQLite (¿sin internet?).'));
      document.head.appendChild(s);
    });
    return raiz.initSqlJs({ locateFile: f => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + f });
  }

  const api = { importar, indiceLibro, desdeJSON, desdeXML, desdeTexto, desdeSQLite, validar, MYBIBLE, OSIS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.ImportarBiblia = api;
})(typeof window !== 'undefined' ? window : globalThis);
