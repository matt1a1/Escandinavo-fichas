/* combat-stats-fix.js
 * Cálculos oficiais:
 * - Defesa Passiva = 10 + AGI + armadura (+ bônus passivos, ex: Patrulha +2)
 *   mínimo 15 na ficha (exceto ficha customizada)
 * - Esquiva (precisa Reflexos treinado) = Defesa Passiva + bônus Reflexos
 * - Bloqueio (precisa Fortitude treinada): na ficha marca-se Defesa + Fortitude;
 *   efeito mecânico = RD igual ao bônus de Fortitude
 * - Bônus de origem: Calejado, Cicatrizes Psicológicas, Dedicação
 */
(function () {
  function temHab(nome) {
    if (typeof temHabilidade === 'function') return temHabilidade(nome);
    if (typeof state === 'undefined' || !state.habilidades) return false;
    var alvo = String(nome || '').toLowerCase();
    return state.habilidades.some(function (h) {
      return String(h.nome || '').toLowerCase() === alvo;
    });
  }

  function nexPct() {
    return Math.max(5, Number(state && state.nex) || 5);
  }

  function nexBlocos5() {
    return Math.floor(nexPct() / 5);
  }

  function dedicacaoBonusPe() {
    var n = nexPct();
    var extra = 0;
    for (var m = 15; m <= n; m += 10) extra++;
    return 1 + extra;
  }

  function bonusDefesaDeHabilidades() {
    var bonus = 0;
    if (temHab('Patrulha')) bonus += 2;
    if (typeof state !== 'undefined' && Array.isArray(state.habilidades)) {
      state.habilidades.forEach(function (h) {
        var nome = String(h.nome || '');
        var desc = String(h.desc || '');
        if (/^Patrulha$/i.test(nome)) return;
        if (/\b\d+\s*PE\b/i.test(desc)) return;
        var m = desc.match(/\+(\d+)\s*(?:na\s+)?Defesa\b/i);
        if (!m) return;
        if (/at[eé]\s+(o\s+)?(fim|pr[oó]ximo|in[ií]cio)/i.test(desc)) return;
        if (/quando\s+usa|pode\s+gastar|a[cç][aã]o\s+de\s+movimento/i.test(desc)) return;
        bonus += parseInt(m[1], 10) || 0;
      });
    }
    return bonus;
  }

  function floor15(v) {
    if (typeof window.__skipDefesaFloor === 'function' && window.__skipDefesaFloor()) return v;
    return Math.max(15, v);
  }

  function periciaTreinada(id) {
    return typeof getPericiaRank === 'function' && getPericiaRank(id) > 0;
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (typeof getAttr !== 'function') return false;

    window.__calcDefesaRaw = function () {
      var def = 10 + getAttr('agi');
      var prot = 0;
      var escudo = 0;
      (state.itens || []).forEach(function (item) {
        if (item.tipo !== 'protecao') return;
        var d = Number(item.defesa) || 0;
        if (/escudo/i.test(item.nome || '')) escudo += d;
        else if (d > prot) prot = d;
      });
      return def + prot + escudo;
    };

    window.calcularDefesa = function () {
      return floor15(window.__calcDefesaRaw() + bonusDefesaDeHabilidades());
    };

    window.calcularEsquiva = function () {
      var def = calcularDefesa();
      if (!periciaTreinada('reflexos')) return def;
      var b = typeof getPericiaBonus === 'function' ? getPericiaBonus('reflexos') : 0;
      return floor15(def + b);
    };

    window.calcularBloqueio = function () {
      var def = calcularDefesa();
      if (!periciaTreinada('fortitude')) return def;
      var b = typeof getPericiaBonus === 'function' ? getPericiaBonus('fortitude') : 0;
      return floor15(def + b);
    };

    window.calcularBloqueioRD = function () {
      if (!periciaTreinada('fortitude')) return 0;
      return typeof getPericiaBonus === 'function' ? getPericiaBonus('fortitude') : 0;
    };

    if (!window.__calcRecursosBase && typeof calcularRecursos === 'function') {
      window.__calcRecursosBase = calcularRecursos;
    }
    if (!window.__calcPeTurnoBase && typeof calcularPeTurno === 'function') {
      window.__calcPeTurnoBase = calcularPeTurno;
    }

    if (window.__calcRecursosBase) {
      window.calcularRecursos = function () {
        var r = window.__calcRecursosBase();
        var blocos = nexBlocos5();
        if (temHab('Calejado')) r.pvMax = Math.max(1, r.pvMax + blocos);
        if (temHab('Cicatrizes Psicológicas')) r.sanMax = Math.max(1, r.sanMax + blocos);
        if (temHab('Dedicação')) r.peMax = Math.max(1, r.peMax + dedicacaoBonusPe());
        return r;
      };
    }

    if (window.__calcPeTurnoBase) {
      window.calcularPeTurno = function () {
        var base = window.__calcPeTurnoBase();
        if (temHab('Dedicação')) base += 1;
        return base;
      };
    }

    if (!window.__combatStatsHooked) {
      window.__combatStatsHooked = true;
      document.addEventListener('change', function (e) {
        var t = e.target;
        if (!t) return;
        if (t.classList && (t.classList.contains('rank-select') || t.classList.contains('other-input'))) {
          setTimeout(function () {
            if (typeof renderRecursos === 'function') renderRecursos();
          }, 0);
        }
      });
      var origRenderHab = window.renderHabilidades;
      if (typeof origRenderHab === 'function') {
        window.renderHabilidades = function () {
          var ret = origRenderHab.apply(this, arguments);
          if (typeof renderRecursos === 'function') renderRecursos();
          return ret;
        };
      }
    }

    if (typeof renderRecursos === 'function') renderRecursos();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 100) clearInterval(t);
  }, 100);
})();
