// Campanhas: carrega versão completa estável + protege contra wizard (card 📋)
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@fd05ebb6e802/campanhas.js';
  s.onload = function () {
    if (typeof window.renderCampanhas === 'function') {
      window.__escCampanhasRender = window.renderCampanhas;
    }
    var n = 0;
    var iv = setInterval(function () {
      if (typeof window.__escCampanhasRender === 'function') {
        if (window.renderCampanhas !== window.__escCampanhasRender) {
          window.renderCampanhas = window.__escCampanhasRender;
          try {
            var v = document.getElementById('view-campanhas');
            var grid = document.getElementById('camp-grid');
            if (v && !v.hidden) {
              if (!grid || grid.innerHTML.indexOf('📋') !== -1 || grid.querySelector('.camp-cover') === null) {
                window.__escCampanhasRender();
              }
            }
          } catch (e) {}
        }
      }
      if (++n > 80) clearInterval(iv);
    }, 300);
    setTimeout(function () {
      try {
        if (typeof window.__escCampanhasRender === 'function') {
          window.renderCampanhas = window.__escCampanhasRender;
          var v = document.getElementById('view-campanhas');
          if (v && !v.hidden) window.__escCampanhasRender();
        }
      } catch (e) {}
    }, 600);
    console.log('[campanhas] stable+protected loaded');
  };
  s.onerror = function () { console.error('[campanhas] fail CDN load'); };
  document.head.appendChild(s);
})();
