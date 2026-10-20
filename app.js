/**
 * app.js — carrega a versão completa estável da ficha (evita PLACEHOLDER)
 * Fonte: commit 843b631 (app completo)
 */
(function () {
  if (window.__escAppLoaded) return;
  window.__escAppLoaded = true;

  if (typeof window.isFichaCustom !== 'function') {
    window.isFichaCustom = function () {
      try {
        return !!(window.state && (window.state.tipoFicha === 'custom' || window.state.tipoFicha === 'mascaras'));
      } catch (e) { return false; }
    };
  }
  if (typeof window.isFichaLivre !== 'function') {
    window.isFichaLivre = window.isFichaCustom;
  }

  var sources = [
    'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@843b6316775cfe32a5b0826ee97d310dd7d0aff9/app.js',
    'https://raw.githubusercontent.com/matt1a1/Escandinavo-fichas/843b6316775cfe32a5b0826ee97d310dd7d0aff9/app.js'
  ];

  function tryLoad(i) {
    if (i >= sources.length) {
      console.error('[app] falha ao carregar app completo');
      return;
    }
    var s = document.createElement('script');
    s.src = sources[i] + (sources[i].indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    s.onload = function () { console.log('[app] completo carregado', i); };
    s.onerror = function () {
      console.warn('[app] falha fonte', i);
      tryLoad(i + 1);
    };
    document.head.appendChild(s);
  }
  tryLoad(0);
})();
