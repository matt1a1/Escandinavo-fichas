/**
 * campanhas.js — carrega versão completa com fallback (não trava se CDN falhar)
 */
(function () {
  if (window.__escCampanhasLoading) return;
  window.__escCampanhasLoading = true;

  var SOURCES = [
    'https://cdn.jsdelivr.net/gh/matt1a1/Escandinavo-fichas@fd05ebb6e802/campanhas.js',
    'https://raw.githubusercontent.com/matt1a1/Escandinavo-fichas/fd05ebb6e802/campanhas.js'
  ];

  function onReady() {
    if (typeof window.renderCampanhas === 'function') {
      window.__escCampanhasRender = window.renderCampanhas;
    }
    var n = 0;
    var iv = setInterval(function () {
      if (typeof window.__escCampanhasRender === 'function') {
        if (window.renderCampanhas !== window.__escCampanhasRender) {
          window.renderCampanhas = window.__escCampanhasRender;
        }
        try {
          var v = document.getElementById('view-campanhas');
          if (v && !v.hidden) window.__escCampanhasRender();
        } catch (e) {}
      }
      if (++n > 40) clearInterval(iv);
    }, 300);
    console.log('[campanhas] full loaded');
  }

  function tryLoad(i) {
    if (i >= SOURCES.length) {
      console.warn('[campanhas] CDN/raw falhou — usando render básico do wizard');
      return;
    }
    var s = document.createElement('script');
    s.src = SOURCES[i] + (SOURCES[i].indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    s.onload = onReady;
    s.onerror = function () {
      console.warn('[campanhas] falha fonte', i);
      tryLoad(i + 1);
    };
    document.head.appendChild(s);
  }
  tryLoad(0);
})();
