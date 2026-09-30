/* arquivos-secretos-catalog.js — carrega JSON dos Arquivos Secretos */
var ARQUIVOS_SECRETOS = [];
(function () {
  function boot(data) {
    ARQUIVOS_SECRETOS = data || [];
    if (typeof window !== "undefined") window.ARQUIVOS_SECRETOS = ARQUIVOS_SECRETOS;
  }
  fetch("arquivos-secretos.json?v=1")
    .then(function (r) { return r.json(); })
    .then(boot)
    .catch(function () { boot([]); });
})();
