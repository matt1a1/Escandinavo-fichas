/* arquivos-secretos-part2.js — finaliza load */
(function () {
  if (typeof window !== 'undefined' && typeof ARQUIVOS_SECRETOS !== 'undefined') {
    window.ARQUIVOS_SECRETOS = ARQUIVOS_SECRETOS;
  }
  try {
    document.dispatchEvent(new CustomEvent('arquivos-secretos-ready', {
      detail: { total: (typeof ARQUIVOS_SECRETOS !== 'undefined' ? ARQUIVOS_SECRETOS.length : 0) }
    }));
  } catch (e) {}
})();
