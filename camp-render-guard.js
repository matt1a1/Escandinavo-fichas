// Reclama renderCampanhas do wizard (evita card 📋)
(function () {
  function fix() {
    if (typeof window.__escCampanhasRender === 'function') {
      if (window.renderCampanhas !== window.__escCampanhasRender) {
        window.renderCampanhas = window.__escCampanhasRender;
      }
      try {
        var v = document.getElementById('view-campanhas');
        var grid = document.getElementById('camp-grid');
        if (v && !v.hidden && grid && grid.innerHTML.indexOf('📋') !== -1) {
          window.__escCampanhasRender();
        }
      } catch (e) {}
    }
  }
  setInterval(fix, 500);
  setTimeout(fix, 800);
  setTimeout(fix, 2000);
})();
