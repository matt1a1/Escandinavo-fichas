/* combat-stats-fix.js v7
 * Regras oficiais (Livro Básico p.36 e p.88):
 * - Defesa = 10 + Agilidade + modificadores (armadura, escudo, habilidades, condições)
 *   SEM mínimo artificial de 15 — sobe/desce com a AGI
 * - Esquiva (reação, exige Reflexos treinado): + bônus de Reflexos na Defesa contra aquele ataque
 * - Bloqueio (reação, exige Fortitude treinada, só corpo a corpo): RD = bônus de Fortitude
 *   (NÃO altera a Defesa)
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

  function periciaTreinada(id) {
    return typeof getPericiaRank === 'function' && getPericiaRank(id) > 0;
  }

  function bonusPericia(id) {
    return typeof getPericiaBonus === 'function' ? getPericiaBonus(id) : 0;
  }

  function install() {
    if (typeof state === 'undefined') return false;
    if (typeof getAttr !== 'function') return false;

    // Defesa: 10 + AGI + armadura + escudo (sem mínimo artificial)
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

    // Defesa final = raw + bônus passivos de habilidades
    window.calcularDefesa = function () {
      return window.__calcDefesaRaw() + bonusDefesaDeHabilidades();
    };

    // Esquiva: se treinado em Reflexos, Defesa + bônus de Reflexos (valor potencial)
    // Se não treinado, mostra a própria Defesa (não pode usar a reação)
    window.calcularEsquiva = function () {
      var def = calcularDefesa();
      if (!periciaTreinada('reflexos')) return def;
      return def + bonusPericia('reflexos');
    };

    // Bloqueio: RD = bônus de Fortitude (só se treinado). NÃO soma na Defesa.
    window.calcularBloqueio = function () {
      if (!periciaTreinada('fortitude')) return 0;
      return bonusPericia('fortitude');
    };

    // Alias explícito (mesmo valor)
    window.calcularBloqueioRD = function () {
      return calcularBloqueio();
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
