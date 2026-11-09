/* Prueba del importador de Biblias: genera la RV1909 en cada formato soportado, la importa
 * y verifica que los 31.000+ versículos queden idénticos.  Uso: node pruebas/probar-importar.js */
const path = require('path');
globalThis.window = globalThis;
require(path.join(__dirname, '../js/libros.js'));
require(path.join(__dirname, '../data/rv1909.js'));
const Imp = require(path.join(__dirname, '../js/importar-biblia.js'));
const initSqlJs = require('sql.js');

const B = window.BIBLIA_RV1909, L = window.Libros.libros;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const recorrer = f => B.libros.forEach((caps, b) => caps.forEach((vs, c) => vs.forEach((t, v) => f(b, c + 1, v + 1, t))));
const INGLES = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', 'I Samuel', 'II Samuel', 'I Kings', 'II Kings', 'I Chronicles', 'II Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'I Corinthians', 'II Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', 'I Thessalonians', 'II Thessalonians', 'I Timothy', 'II Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', 'I Peter', 'II Peter', 'I John', 'II John', 'III John', 'Jude', 'Revelation of John'];

function generar(formato) {
  let s = '';
  switch (formato) {
    case 'JSON libros (scrollmapper)':
      return JSON.stringify({ translation: 'Prueba', books: B.libros.map((caps, b) => ({ name: INGLES[b], chapters: caps.map((vs, c) => ({ chapter: c + 1, verses: vs.map((t, v) => ({ verse: v + 1, text: t })) })) })) });
    case 'JSON anidado (abbrev/chapters)':
      return JSON.stringify(B.libros.map((caps, b) => ({ abbrev: 'x' + b, chapters: caps })));
    case 'JSON FreeShow (number)':
      return JSON.stringify({ name: 'Prueba', books: B.libros.map((caps, b) => ({ number: b + 1, name: L[b].nombre, chapters: caps.map((vs, c) => ({ number: c + 1, verses: vs.map((t, v) => ({ number: v + 1, text: t })) })) })) });
    case 'JSON lista plana':
      { const a = []; recorrer((b, c, v, t) => a.push({ book: L[b].nombre, chapter: c, verse: v, text: t })); return JSON.stringify(a); }
    case 'Zefania XML':
      s = '<?xml version="1.0"?><XMLBIBLE biblename="Prueba">';
      B.libros.forEach((caps, b) => { s += `<BIBLEBOOK bnumber="${b + 1}" bname="${L[b].nombre}">`;
        caps.forEach((vs, c) => { s += `<CHAPTER cnumber="${c + 1}">` + vs.map((t, v) => `<VERS vnumber="${v + 1}">${esc(t)}</VERS>`).join('') + '</CHAPTER>'; }); s += '</BIBLEBOOK>'; });
      return s + '</XMLBIBLE>';
    case 'OSIS XML (contenedor)':
      s = '<osis><osisText><header><work><title>Prueba</title></work></header>';
      B.libros.forEach((caps, b) => { s += `<div type="book" osisID="${Imp.OSIS[b]}">`;
        caps.forEach((vs, c) => { s += `<chapter osisID="${Imp.OSIS[b]}.${c + 1}">` + vs.map((t, v) => `<verse osisID="${Imp.OSIS[b]}.${c + 1}.${v + 1}">${esc(t)}</verse>`).join('') + '</chapter>'; }); s += '</div>'; });
      return s + '</osisText></osis>';
    case 'OSIS XML (hitos sID/eID)':
      s = '<osis><osisText>';
      recorrer((b, c, v, t) => { const id = `${Imp.OSIS[b]}.${c}.${v}`; s += `<verse sID="${id}" osisID="${id}"/>${esc(t)}<verse eID="${id}"/>`; });
      return s + '</osisText></osis>';
    case 'OpenSong XML':
      s = '<?xml version="1.0"?><bible n="Prueba">';
      B.libros.forEach((caps, b) => { s += `<b n="${L[b].nombre}">`;
        caps.forEach((vs, c) => { s += `<c n="${c + 1}">` + vs.map((t, v) => `<v n="${v + 1}">${esc(t)}</v>`).join('') + '</c>'; }); s += '</b>'; });
      return s + '</bible>';
    case 'Texto "Libro cap:ver texto"':
      recorrer((b, c, v, t) => { s += `${L[b].nombre} ${c}:${v} ${t}\n`; }); return s;
    case 'TSV numérico':
      recorrer((b, c, v, t) => { s += `${b + 1}\t${c}\t${v}\t${t}\n`; }); return s;
    case 'CSV':
      s = 'libro,capitulo,versiculo,texto\n'; recorrer((b, c, v, t) => { s += `"${L[b].nombre}",${c},${v},"${t.replace(/"/g, '""')}"\n`; }); return s;
  }
}

function sqlite(SQL, tipo) {
  const db = new SQL.Database();
  if (tipo === 'MyBible') {
    db.run('CREATE TABLE info (name TEXT, value TEXT); CREATE TABLE verses (book_number INT, chapter INT, verse INT, text TEXT);');
    db.run("INSERT INTO info VALUES ('description','Prueba MyBible')");
    const st = db.prepare('INSERT INTO verses VALUES (?,?,?,?)');
    recorrer((b, c, v, t) => st.run([Imp.MYBIBLE[b], c, v, t])); st.free();
  } else if (tipo === 'OpenLP') {
    db.run('CREATE TABLE metadata (key TEXT, value TEXT); CREATE TABLE book (id INT, book_reference_id INT, testament_reference_id INT, name TEXT); CREATE TABLE verse (id INT, book_id INT, chapter INT, verse INT, text TEXT);');
    db.run("INSERT INTO metadata VALUES ('name','Prueba OpenLP')");
    B.libros.forEach((_, b) => db.run('INSERT INTO book VALUES (?,?,?,?)', [b + 101, b + 1, b < 39 ? 1 : 2, L[b].nombre]));
    const st = db.prepare('INSERT INTO verse VALUES (?,?,?,?,?)'); let k = 0;
    recorrer((b, c, v, t) => st.run([k++, b + 101, c, v, t])); st.free();
  } else {
    db.run('CREATE TABLE Details (Title TEXT, Description TEXT); CREATE TABLE Bible (Book INT, Chapter INT, Verse INT, Scripture TEXT);');
    db.run("INSERT INTO Details VALUES ('Prueba','Prueba e-Sword')");
    const st = db.prepare('INSERT INTO Bible VALUES (?,?,?,?)');
    recorrer((b, c, v, t) => st.run([b + 1, c, v, t])); st.free();
  }
  const out = db.export(); db.close(); return out;
}

function comparar(biblia) {
  let mal = 0, primero = null;
  recorrer((b, c, v, t) => { const x = (biblia.libros[b][c - 1] || [])[v - 1] || ""; // la RV1909 trae 18 versículos vacíos (versificación distinta)
    if (x !== t) { mal++; if (!primero) primero = `${L[b].nombre} ${c}:${v}: "${(x || '').slice(0, 40)}"`; } });
  return { mal, primero };
}

(async () => {
  const SQL = await initSqlJs();
  const casos = ['JSON libros (scrollmapper)', 'JSON anidado (abbrev/chapters)', 'JSON FreeShow (number)', 'JSON lista plana', 'Zefania XML',
    'OSIS XML (contenedor)', 'OSIS XML (hitos sID/eID)', 'OpenSong XML', 'Texto "Libro cap:ver texto"', 'TSV numérico', 'CSV'];
  let fallas = 0;
  for (const caso of casos) {
    const b = await Imp.importar('prueba', generar(caso), { SQL });
    const r = comparar(b); fallas += r.mal ? 1 : 0;
    console.log((r.mal ? '❌ ' : '✅ ') + caso.padEnd(32) + ` libros ${b.resumen.libros}, capítulos ${b.resumen.capitulos}, versículos ${b.resumen.versiculos}` + (r.mal ? `  — ${r.mal} distintos, ej. ${r.primero}` : ''));
  }
  for (const [tipo, archivo] of [['MyBible', 'x.SQLite3'], ['e-Sword', 'x.bblx'], ['OpenLP', 'x.sqlite']]) {
    const b = await Imp.importar(archivo, sqlite(SQL, tipo), { SQL });
    const r = comparar(b); fallas += r.mal ? 1 : 0;
    console.log((r.mal ? '❌ ' : '✅ ') + (tipo + ' (SQLite)').padEnd(32) + ` libros ${b.resumen.libros}, capítulos ${b.resumen.capitulos}, versículos ${b.resumen.versiculos} · "${b.nombre}"` + (r.mal ? `  — ${r.mal} distintos, ej. ${r.primero}` : ''));
  }
  // Nombres de libros escritos de distintas formas
  const nombres = { '1 Juan': 61, 'Primera de Juan': 61, 'I Juan': 61, '1Jn': -1, '1John': 61, 'Apocalipsis': 65, 'Salmo': 18, 'Cantar de los Cantares': 21, '2 Co': 46, 'Gn': 0, 'Hch': -1, 'Revelation of John': 65, 'III John': 63 };
  for (const [n, esperado] of Object.entries(nombres)) {
    const r = Imp.indiceLibro(n);
    if (esperado >= 0 && r !== esperado) { fallas++; console.log('❌ nombre "' + n + '" -> ' + r + ' (esperado ' + esperado + ')'); }
  }
  console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallas ? 1 : 0);
})();
