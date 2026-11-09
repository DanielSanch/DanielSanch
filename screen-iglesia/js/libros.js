/* Libros de la Biblia (canon protestante, 66 libros) con nombres y formas habladas. */
(function () {
  'use strict';
  // [nombre a mostrar, base hablada (normalizada), número (0 si no lleva), alias extra]
  const L = [
    ['Génesis', 'genesis', 0, ['gen']], ['Éxodo', 'exodo', 0, ['exo']], ['Levítico', 'levitico', 0, []],
    ['Números', 'numeros', 0, []], ['Deuteronomio', 'deuteronomio', 0, ['deuteronomios']], ['Josué', 'josue', 0, []],
    ['Jueces', 'jueces', 0, []], ['Rut', 'rut', 0, ['ruth']], ['1 Samuel', 'samuel', 1, []], ['2 Samuel', 'samuel', 2, []],
    ['1 Reyes', 'reyes', 1, []], ['2 Reyes', 'reyes', 2, []], ['1 Crónicas', 'cronicas', 1, []], ['2 Crónicas', 'cronicas', 2, []],
    ['Esdras', 'esdras', 0, []], ['Nehemías', 'nehemias', 0, []], ['Ester', 'ester', 0, ['esther']], ['Job', 'job', 0, []],
    ['Salmos', 'salmos', 0, ['salmo', 'salmon']], ['Proverbios', 'proverbios', 0, ['proverbio']],
    ['Eclesiastés', 'eclesiastes', 0, []], ['Cantares', 'cantares', 0, ['cantar']], ['Isaías', 'isaias', 0, []],
    ['Jeremías', 'jeremias', 0, []], ['Lamentaciones', 'lamentaciones', 0, []], ['Ezequiel', 'ezequiel', 0, []],
    ['Daniel', 'daniel', 0, []], ['Oseas', 'oseas', 0, []], ['Joel', 'joel', 0, []], ['Amós', 'amos', 0, []],
    ['Abdías', 'abdias', 0, []], ['Jonás', 'jonas', 0, []], ['Miqueas', 'miqueas', 0, []], ['Nahúm', 'nahum', 0, []],
    ['Habacuc', 'habacuc', 0, []], ['Sofonías', 'sofonias', 0, []], ['Hageo', 'hageo', 0, []], ['Zacarías', 'zacarias', 0, []],
    ['Malaquías', 'malaquias', 0, []], ['Mateo', 'mateo', 0, []], ['Marcos', 'marcos', 0, []], ['Lucas', 'lucas', 0, []],
    ['Juan', 'juan', 0, []], ['Hechos', 'hechos', 0, []], ['Romanos', 'romanos', 0, []], ['1 Corintios', 'corintios', 1, []],
    ['2 Corintios', 'corintios', 2, []], ['Gálatas', 'galatas', 0, []], ['Efesios', 'efesios', 0, []],
    ['Filipenses', 'filipenses', 0, []], ['Colosenses', 'colosenses', 0, []], ['1 Tesalonicenses', 'tesalonicenses', 1, []],
    ['2 Tesalonicenses', 'tesalonicenses', 2, []], ['1 Timoteo', 'timoteo', 1, []], ['2 Timoteo', 'timoteo', 2, []],
    ['Tito', 'tito', 0, []], ['Filemón', 'filemon', 0, []], ['Hebreos', 'hebreos', 0, []], ['Santiago', 'santiago', 0, []],
    ['1 Pedro', 'pedro', 1, []], ['2 Pedro', 'pedro', 2, []], ['1 Juan', 'juan', 1, []], ['2 Juan', 'juan', 2, []],
    ['3 Juan', 'juan', 3, []], ['Judas', 'judas', 0, []], ['Apocalipsis', 'apocalipsis', 0, ['revelacion']]
  ];

  const libros = L.map((x, i) => ({ i, nombre: x[0], base: x[1], num: x[2], alias: [x[1]].concat(x[3]) }));

  // Mapa base -> { sin número: idx, con número: {1: idx, 2: idx, 3: idx} }
  const porBase = {};
  libros.forEach(l => {
    l.alias.forEach(a => {
      porBase[a] = porBase[a] || { simple: null, numerado: {} };
      if (l.num) porBase[a].numerado[l.num] = l.i; else porBase[a].simple = l.i;
    });
  });

  const ORDINALES = {
    '1': 1, primera: 1, primero: 1, primer: 1, i: 1,
    '2': 2, segunda: 2, segundo: 2, ii: 2,
    '3': 3, tercera: 3, tercero: 3, tercer: 3, iii: 3
  };

  window.Libros = { libros, porBase, ORDINALES };
})();
