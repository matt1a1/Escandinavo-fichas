/* controls-fix.js — NEX ±5 e atributos ±1 (sem double-bind) */
(function () {
  function rebindNex() {
    document.querySelectorAll('.nex-btn').forEach(function (btn) {
      var d = Number(btn.dataset.delta);
      if (!d || Math.abs(d) === 10) {
        var txt = String(btn.textContent || '');
        btn.dataset.delta = (d < 0 || txt.indexOf('«') >= 0 || txt.indexOf('<') >= 0 || txt.indexOf('‹') >= 0) ? '-5' : '5';
        d = Number(btn.dataset.delta);
      }
      if (Math.abs(d) !== 5) {
        btn.dataset.delta = (d < 0 ? -5 : 5);
      }
      var neo = btn.cloneNode(true);
      neo.dataset.ctrlFix = '1';
      btn.parentNode.replaceChild(neo, btn);
      neo.addEventListener('click', function () {
        if (typeof state === 'undefined') return;
        var delta = Number(neo.dataset.delta) || 5;
        if (Math.abs(delta) !== 5) delta = delta < 0 ? -5 : 5;
        state.nex = Math.max(5, Math.min(99, (Number(state.nex) || 5) + delta));
        var nd = document.getElementById('nex-display');
        if (nd) nd.textContent = state.nex + '%';
        if (typeof normalizarAtributosNex === 'function') normalizarAtributosNex();
        if (typeof renderAtributos === 'function') renderAtributos();
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof renderPericias === 'function') renderPericias();
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });
  }

  function rebindAttr() {
    document.querySelectorAll('.attr-item').forEach(function (el) {
      var key = el.dataset.attr;
      if (!key) return;
      el.querySelectorAll('.attr-btn').forEach(function (btn) {
        var d = Number(btn.dataset.delta);
        var txt = String(btn.textContent || '');
        if (!d || Math.abs(d) === 2) {
          btn.dataset.delta = (d < 0 || txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0) ? '-1' : '1';
        }
        if (Math.abs(Number(btn.dataset.delta)) !== 1) {
          btn.dataset.delta = Number(btn.dataset.delta) < 0 ? '-1' : '1';
        }
        var neo = btn.cloneNode(true);
        neo.dataset.ctrlFix = '1';
        btn.parentNode.replaceChild(neo, btn);
        neo.addEventListener('click', function () {
          if (typeof state === 'undefined' || !state.atributos) return;
          var delta = Number(neo.dataset.delta) || 1;
          if (Math.abs(delta) !== 1) delta = delta < 0 ? -1 : 1;
          var val = (Number(state.atributos[key]) || 0) + delta;
          var custom = (typeof isFichaCustom === 'function' && isFichaCustom())
            || (typeof isFichaLivre === 'function' && isFichaLivre())
            || (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras');
          if (custom) {
            if (val < 0) val = 0;
            if (val > 20) val = 20;
          } else {
            if (val < 0) val = 0;
            if (val > 5) val = 5;
            if (delta > 0) {
              if (typeof pontosDisponiveis === 'function' && pontosDisponiveis() <= 0) return;
              if (typeof pontosAcimaDe3 === 'function' && typeof nexAumentosAtributo === 'function') {
                var acimaDepois = pontosAcimaDe3() - Math.max(0, (state.atributos[key] || 0) - 3) + Math.max(0, val - 3);
                if (acimaDepois > nexAumentosAtributo()) {
                  alert('O máximo inicial de cada atributo é 3. Aumento de Atributo (NEX 20%, 50%, 80% e 95%) permite subir até 5.');
                  return;
                }
              }
            }
          }
          if (val === state.atributos[key]) return;
          state.atributos[key] = val;
          if (typeof renderAtributos === 'function') renderAtributos();
          if (typeof renderRecursos === 'function') renderRecursos();
          if (typeof renderPericias === 'function') renderPericias();
          if (typeof scheduleSave === 'function') scheduleSave();
        });
      });
    });
  }

  function run() {
    rebindNex();
    rebindAttr();
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (typeof state !== 'undefined' && document.querySelector('.nex-btn, .attr-btn')) {
      run();
      clearInterval(t);
      setTimeout(run, 800);
      setTimeout(run, 2000);
    }
    if (n > 40) clearInterval(t);
  }, 150);
})();
