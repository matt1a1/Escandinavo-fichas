/**
 * app.js — carrega a versão completa estável da ficha (evita PLACEHOLDER no main)
 * Fonte: commit 843b631 (app completo usado pela ficha.html)
 */
(function () {
  if (window.__escAppLoaded) return;
  window.__escAppLoaded = true;

  // Helpers mínimos disponíveis antes do app completo carregar
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

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@843b6316775cfe32a5b0826ee97d310dd7d0aff9/app.js';
  s.onload = function () {
    console.log('[app] completo carregado do CDN estável');
  };
  s.onerror = function () {
    console.error('[app] falha ao carregar app completo do CDN');
  };
  document.head.appendChild(s);
})();
