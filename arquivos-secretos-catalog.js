/* arquivos-secretos-catalog.js — carrega 177 entradas dos Arquivos Secretos */
var ARQUIVOS_SECRETOS = [];
(function () {
  function done(parts) {
    ARQUIVOS_SECRETOS = (parts[0] || []).concat(parts[1] || []);
    if (typeof window !== 'undefined') window.ARQUIVOS_SECRETOS = ARQUIVOS_SECRETOS;
    try {
      document.dispatchEvent(new CustomEvent('arquivos-secretos-ready', { detail: { total: ARQUIVOS_SECRETOS.length } }));
    } catch (e) {}
  }
  Promise.all([
    fetch('arquivos-secretos-a.json?v=2').then(function (r) { return r.json(); }).catch(function () { return []; }),
    fetch('arquivos-secretos-b.json?v=2').then(function (r) { return r.json(); }).catch(function () { return []; })
  ]).then(done).catch(function () { done([[], []]); });
})();
