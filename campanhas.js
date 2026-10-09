// Campanhas: carrega versão estável e protege contra overwrite do wizard
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@b147a55308aa192a3d4d2c4046c54f80a9e1afbd/campanhas.js';
  s.onload = function () {
    // Guarda a implementação boa
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
            if (v && !v.hidden) window.renderCampanhas();
          } catch (e) {}
        }
      }
      if (++n > 50) clearInterval(iv);
    }, 200);
    console.log('[campanhas] stable loaded + protected');
  };
  s.onerror = function () { console.error('[campanhas] fail load from CDN'); };
  document.head.appendChild(s);
})();
