/* combat-stats-fix.js — Bloqueio = Defesa + Fortitude (como Esquiva) */
(function () {
  function install() {
    if (typeof getPericiaBonus !== 'function' || typeof calcularDefesa !== 'function') return false;

    window.calcularBloqueio = function () {
      var b = getPericiaBonus('fortitude');
      return b > 0 ? calcularDefesa() + b : calcularDefesa();
    };

    window.calcularEsquiva = function () {
      var b = getPericiaBonus('reflexos');
      return b > 0 ? calcularDefesa() + b : calcularDefesa();
    };

    // reforça atualização ao mudar qualquer perícia
    if (!window.__combatStatsHooked && typeof renderRecursos === 'function') {
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
    }

    if (typeof renderRecursos === 'function') renderRecursos();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 80) clearInterval(t);
  }, 100);
})();
