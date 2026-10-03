/* ficha-custom-limits.js — reforça limites liberados na ficha custom (pós app.js) */
(function () {
  function custom() {
    return (typeof state !== 'undefined' && state.tipoFicha === 'custom')
      || (typeof isFichaCustom === 'function' && isFichaCustom());
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (typeof getAttr !== 'function') return false;

    window.isFichaCustom = function () {
      return !!(state && state.tipoFicha === 'custom');
    };

    if (typeof pontosDisponiveis === 'function' && !pontosDisponiveis.__c) {
      var _p = pontosDisponiveis;
      window.pontosDisponiveis = function () {
        if (custom()) return 999;
        return _p.apply(this, arguments);
      };
      window.pontosDisponiveis.__c = true;
    }

    if (typeof normalizarAtributosNex === 'function' && !normalizarAtributosNex.__c) {
      var _n = normalizarAtributosNex;
      window.normalizarAtributosNex = function () {
        if (custom()) return;
        return _n.apply(this, arguments);
      };
      window.normalizarAtributosNex.__c = true;
    }

    if (typeof rankMaxNex === 'function' && !rankMaxNex.__c) {
      var _r = rankMaxNex;
      window.rankMaxNex = function () {
        if (custom()) return 15;
        return _r.apply(this, arguments);
      };
      window.rankMaxNex.__c = true;
    }

    if (typeof grauLimite === 'function' && !grauLimite.__c) {
      var _g = grauLimite;
      window.grauLimite = function () {
        if (custom()) return 99;
        return _g.apply(this, arguments);
      };
      window.grauLimite.__c = true;
    }

    if (typeof periciasMax === 'function' && !periciasMax.__c) {
      var _pm = periciasMax;
      window.periciasMax = function () {
        if (custom()) return 99;
        return _pm.apply(this, arguments);
      };
      window.periciasMax.__c = true;
    }

    if (typeof calcularRecursos === 'function' && !calcularRecursos.__cOverride) {
      var _cr = calcularRecursos;
      window.calcularRecursos = function () {
        var r = _cr.apply(this, arguments);
        if (custom()) {
          if (state.pvMaxOverride != null && state.pvMaxOverride !== '')
            r.pvMax = Math.max(1, Number(state.pvMaxOverride) || r.pvMax);
          if (state.sanMaxOverride != null && state.sanMaxOverride !== '')
            r.sanMax = Math.max(1, Number(state.sanMaxOverride) || r.sanMax);
          if (state.peMaxOverride != null && state.peMaxOverride !== '')
            r.peMax = Math.max(1, Number(state.peMaxOverride) || r.peMax);
        }
        return r;
      };
      window.calcularRecursos.__cOverride = true;
    }

    if (!window.__customAttrRebound) {
      document.querySelectorAll('.attr-item').forEach(function (el) {
        var key = el.dataset.attr;
        el.querySelectorAll('.attr-btn').forEach(function (btn) {
          var neo = btn.cloneNode(true);
          btn.parentNode.replaceChild(neo, btn);
          neo.addEventListener('click', function () {
            var delta = +neo.dataset.delta;
            var val = (state.atributos[key] || 0) + delta;
            if (custom()) {
              if (val < 0) val = 0;
              if (val > 20) val = 20;
            } else {
              if (val < 0) val = 0;
              if (val > 5) val = 5;
              if (delta > 0) {
                if (typeof pontosDisponiveis === 'function' && pontosDisponiveis() <= 0) return;
                if (typeof pontosAcimaDe3 === 'function' && typeof nexAumentosAtributo === 'function') {
                  var acimaDepois = pontosAcimaDe3() - Math.max(0, state.atributos[key] - 3) + Math.max(0, val - 3);
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
            if (typeof renderItens === 'function') renderItens();
            if (typeof scheduleSave === 'function') scheduleSave();
          });
        });
      });
      window.__customAttrRebound = true;
    }

    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 100) clearInterval(t);
  }, 100);
})();
