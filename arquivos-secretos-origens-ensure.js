/* Garante origens de Arquivos Secretos visíveis + re-render */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  if (typeof ARQUIVOS_SECRETOS !== 'undefined') {
    root.ARQUIVOS_SECRETOS = ARQUIVOS_SECRETOS;
  }
  function countOrigens() {
    var AS = root.ARQUIVOS_SECRETOS || [];
    return AS.filter(function (e) { return e && e.tipo === 'origem'; }).length;
  }
  function tryRender() {
    try {
      if (typeof renderList === 'function') renderList();
      document.dispatchEvent(new CustomEvent('arquivos-secretos-ready', {
        detail: { total: (root.ARQUIVOS_SECRETOS || []).length, origens: countOrigens() }
      }));
    } catch (e) {}
    console.log('[AS] total', (root.ARQUIVOS_SECRETOS || []).length, 'origens', countOrigens());
  }
  setTimeout(tryRender, 500);
  setTimeout(tryRender, 1500);
  setTimeout(tryRender, 3000);
})();
