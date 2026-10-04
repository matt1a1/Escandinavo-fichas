/* ficha-custom-limits.js — reforça limites liberados na ficha custom e máscaras (pós app.js) */
(function () {
  function custom() {
    return (typeof state !== 'undefined' && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'))
      || (typeof isFichaCustom === 'function' && isFichaCustom())
      || (typeof isFichaLivre === 'function' && isFichaLivre());
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (typeof getAttr !== 'function') return false;

    // Fonte única: custom E máscaras liberam limites
    window.isFichaCustom = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
    };
    window.isFichaLivre = function () {
      return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
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

    // Perícias: na custom/máscaras, qualquer rank livre
    if (typeof renderPericias === 'function' && !renderPericias.__c) {
      var _rp = renderPericias;
      window.renderPericias = function () {
        _rp.apply(this, arguments);
        if (!custom()) return;
        document.querySelectorAll('#pericias-list .rank-select').forEach(function (sel) {
          var neo = sel.cloneNode(true);
          sel.parentNode.replaceChild(neo, sel);
          neo.addEventListener('click', function (e) { e.stopPropagation(); });
          neo.addEventListener('change', function () {
            var row = neo.closest('.pericia-row');
            var idx = Array.prototype.indexOf.call(
              document.querySelectorAll('#pericias-list .pericia-row:not(.pericia-head)'),
              row
            );
            if (idx < 0 || typeof PERICIAS === 'undefined') return;
            var p = PERICIAS[idx];
            if (!p) return;
            var novo = parseInt(neo.value, 10) || 0;
            if (typeof setPericiaRank === 'function') setPericiaRank(p.id, novo);
            if (typeof renderPericias === 'function') renderPericias();
            if (typeof renderRecursos === 'function') renderRecursos();
            if (typeof saveState === 'function') saveState(); else if (typeof scheduleSave === 'function') scheduleSave();
          });
        });
      };
      window.renderPericias.__c = true;
      try { window.renderPericias(); } catch (e) {}
    }

    if (typeof renderAtributos === 'function' && !renderAtributos.__c) {
      var _ra = renderAtributos;
      window.renderAtributos = function () {
        _ra.apply(this, arguments);
        if (custom()) {
          var hint = document.getElementById('attr-nex-hint');
          if (hint) {
            if (state.tipoFicha === 'mascaras')
              hint.textContent = ' · Ficha das Máscaras: sem limite de pontos nem teto de atributo (0–20)';
            else
              hint.textContent = ' · Ficha Customizada: sem limite de pontos nem teto de atributo (0–20)';
          }
        }
      };
      window.renderAtributos.__c = true;
    }

    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 100) clearInterval(t);
  }, 100);

  // Reaplica isFicha* periodicamente caso outro script sobrescreva
  setInterval(function () {
    if (typeof state === 'undefined') return;
    if (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras') {
      window.isFichaCustom = function () {
        return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
      };
      window.isFichaLivre = function () {
        return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras'));
      };
    }
  }, 2000);
})();
