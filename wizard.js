// shim: carrega wizard estável e protege renderCampanhas do campanhas.js
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@e6204034a368b95cb1b16b83ed9928093c2aa53a/wizard.js';
  s.onload = function () {
    // Wizard antigo define renderCampanhas simples (clipboard) — restaura o do campanhas.js
    function restore() {
      if (typeof window.__escCampanhasRender === 'function') {
        window.renderCampanhas = window.__escCampanhasRender;
      }
    }
    restore();
    setTimeout(restore, 100);
    setTimeout(restore, 500);
    setTimeout(restore, 1500);
    // Se a aba campanhas estiver aberta com cards errados, re-renderiza
    setTimeout(function () {
      restore();
      try {
        var grid = document.getElementById('camp-grid');
        if (grid && grid.querySelector('.ag-card') && !grid.querySelector('.camp-card')) {
          if (typeof window.renderCampanhas === 'function') window.renderCampanhas();
        }
      } catch (e) {}
    }, 800);
    console.log('[wizard] stable loaded + campanhas protected');
  };
  s.onerror = function () { console.error('[wizard] fail load from CDN'); };
  document.head.appendChild(s);
})();
