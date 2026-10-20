/**
 * wizard.js — carrega versão completa (CDN) com anti-cache
 */
(function () {
  if (window.__escWizardLoading) return;
  window.__escWizardLoading = true;

  function onReady() {
    function restore() {
      if (typeof window.__escCampanhasRender === 'function') {
        window.renderCampanhas = window.__escCampanhasRender;
      }
    }
    restore();
    setTimeout(restore, 100);
    setTimeout(restore, 500);
    setTimeout(restore, 1500);
    console.log('[wizard] loaded real2');
  }

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@e6204034a368b95cb1b16b83ed9928093c2aa53a/wizard.js?t=' + Date.now();
  s.onload = onReady;
  s.onerror = function () { console.error('[wizard] CDN fail'); };
  document.head.appendChild(s);
})();
