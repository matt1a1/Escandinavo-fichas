/* controls-fix.js — NEX ±5 e atributos ±1 (todas as fichas)
   NEX válido: 5,10,…,95,99 — de 99 o − vai para 95 (não 94) */
(function () {
  if (window.__controlsFixV3) return;
  window.__controlsFixV3 = true;

  function stepNex(cur, delta) {
    cur = Number(cur) || 5;
    if (delta > 0) {
      if (cur >= 99) return 99;
      if (cur >= 95) return 99;
      return Math.min(95, cur + 5);
    }
    if (cur <= 5) return 5;
    if (cur === 99) return 95;
    return Math.max(5, cur - 5);
  }
  window.stepNex = stepNex;

  function rebindNex() {
    document.querySelectorAll('.nex-btn').forEach(function (btn) {
      var d = Number(btn.dataset.delta);
      var txt = String(btn.textContent || '');
      if (!d || Math.abs(d) === 10 || Math.abs(d) !== 5) {
        btn.dataset.delta = (d < 0 || txt.indexOf('«') >= 0 || txt.indexOf('<') >= 0 || txt.indexOf('‹') >= 0 || txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0) ? '-5' : '5';
      }
      var neo = btn.cloneNode(true);
      neo.dataset.ctrlFix = '1';
      neo.dataset.delta = btn.dataset.delta;
      btn.parentNode.replaceChild(neo, btn);
      neo.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof state === 'undefined') return;
        var delta = Number(neo.dataset.delta) || 5;
        if (Math.abs(delta) !== 5) delta = delta < 0 ? -5 : 5;
        state.nex = stepNex(state.nex, delta);
        var nd = document.getElementById('nex-display');
        if (nd) nd.textContent = state.nex + '%';
        if (typeof normalizarAtributosNex === 'function') normalizarAtributosNex();
        if (typeof renderAtributos === 'function') renderAtributos();
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof renderPericias === 'function') renderPericias();
        if (typeof scheduleSave === 'function') scheduleSave();
        else if (typeof saveState === 'function') saveState();
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
        if (!d || Math.abs(d) === 2 || Math.abs(d) !== 1) {
          btn.dataset.delta = (d < 0 || txt.indexOf('−') >= 0 || txt.indexOf('-') >= 0) ? '-1' : '1';
        }
        var neo = btn.cloneNode(true);
        neo.dataset.ctrlFix = '1';
        neo.dataset.delta = btn.dataset.delta;
        btn.parentNode.replaceChild(neo, btn);
        neo.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
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
          else if (typeof saveState === 'function') saveState();
        });
      });
    });
  }

  function run() {
    if (typeof state === 'undefined') return false;
    if (!document.querySelector('.nex-btn, .attr-btn')) return false;
    rebindNex();
    rebindAttr();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (run() || n > 50) {
      clearInterval(t);
      setInterval(run, 2500);
    }
  }, 120);

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(run, 3000);
})();
