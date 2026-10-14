/* arquivos-secretos-catalog-part1.js — catálogo AS parte 1 */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [{"nome":"Agrupador Ritualístico","tipo":"item","livro":"Sangue","desc":"PLACEHOLDER_WILL_REPLACE"}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;
})();
