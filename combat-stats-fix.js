/* combat-stats-fix.js
 * Bônus passivos de poderes/origens nos cálculos da ficha:
 * - Patrulha: +2 Defesa
 * - Calejado: +1 PV por 5% de NEX
 * - Cicatrizes Psicológicas: +1 SAN por 5% de NEX
 * - Dedicação: +1 PE (+1 a cada NEX ímpar) e +1 no limite de PE/turno
 * - Bloqueio/Esquiva: Defesa + Fortitude/Reflexos
 * Também aplica bônus de habilidades cujo nome/desc indique +X Defesa passivo.
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

  /** Quantos "degraus" de 5% de NEX (5% = 1, 10% = 2, ...) */
  function nexBlocos5() {
    return Math.floor(nexPct() / 5);
  }

  /** NEX ímpares no sentido do livro: 15, 25, 35... (e o +1 base da Dedicação) */
  function dedicacaoBonusPe() {
    var n = nexPct();
    var extra = 0;
    for (var m = 15; m <= n; m += 10) extra++;
    return 1 + extra;
  }

  /** Soma bônus numéricos de Defesa vindos de habilidades passivas conhecidas */
  function bonusDefesaDeHabilidades() {
    var bonus = 0;
    if (temHab('Patrulha')) bonus += 2;

    if (typeof state !== 'undefined' && Array.isArray(state.habilidades)) {
      state.habilidades.forEach(function (h) {
        var nome = String(h.nome || '');
        var desc = String(h.desc || '');
        if (/^Patrulha$/i.test(nome)) return;
        if (/\b\d+\s*PE\b/i.test(desc) && !/\+2 na Defesa/i.test(desc)) return;
        var m = desc.match(/\+(\d+)\s*(?:na\s+)?Defesa\b/i);
        if (m && !/\bapt[eé]\b|\bat[eé]\s+o\s+fim|\bat[eé]\s+seu\s+pr[oó]ximo/i.test(desc)) {
          if (/at[eé]\s+(o\s+)?(fim|pr[oó]ximo|in[ií]cio)/i.test(desc)) return;
          if (/quando\s+usa|pode\s+gastar|a[cç][aã]o\s+de\s+movimento/i.test(desc)) return;
          bonus += parseInt(m[1], 10) || 0;
        }
      });
    }
    return bonus;
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (typeof calcularDefesa !== 'function') return false;
    if (typeof getPericiaBonus !== 'function') return false;

    if (!window.__calcDefesaBase) {
      window.__calcDefesaBase = calcularDefesa;
    }
    if (!window.__calcRecursosBase && typeof calcularRecursos === 'function') {
      window.__calcRecursosBase = calcularRecursos;
    }
    if (!window.__calcPeTurnoBase && typeof calcularPeTurno === 'function') {
      window.__calcPeTurnoBase = calcularPeTurno;
    }

    window.calcularDefesa = function () {
      var base = window.__calcDefesaBase();
      return base + bonusDefesaDeHabilidades();
    };

    window.calcularBloqueio = function () {
      var b = getPericiaBonus('fortitude');
      return b > 0 ? calcularDefesa() + b : calcularDefesa();
    };

    window.calcularEsquiva = function () {
      var b = getPericiaBonus('reflexos');
      return b > 0 ? calcularDefesa() + b : calcularDefesa();
    };

    if (window.__calcRecursosBase) {
      window.calcularRecursos = function () {
        var r = window.__calcRecursosBase();
        var blocos = nexBlocos5();
        if (temHab('Calejado')) {
          r.pvMax = Math.max(1, r.pvMax + blocos);
        }
        if (temHab('Cicatrizes Psicológicas')) {
          r.sanMax = Math.max(1, r.sanMax + blocos);
        }
        if (temHab('Dedicação')) {
          r.peMax = Math.max(1, r.peMax + dedicacaoBonusPe());
        }
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
