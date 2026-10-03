/* app-res-fix.js — setas 1/5 sem double-bind; atual pode > max */
(function () {
  function rebind() {
    document.querySelectorAll('.res-btn').forEach(function (btn) {
      if (btn.dataset.resFixV2) return;
      var neo = btn.cloneNode(true);
      neo.dataset.resFixV2 = '1';
      neo.dataset.resBound = '1';
      btn.parentNode.replaceChild(neo, btn);
      neo.addEventListener('click', function () {
        if (typeof state === 'undefined' || typeof calcularRecursos !== 'function') return;
        var res = neo.dataset.res;
        var delta = Number(neo.dataset.delta || 0);
        var r = calcularRecursos();
        if (res === 'vida') state.vidaAtual = Math.max(0, (state.vidaAtual != null ? Number(state.vidaAtual) : r.pvMax) + delta);
        else if (res === 'sanidade') state.sanAtual = Math.max(0, (state.sanAtual != null ? Number(state.sanAtual) : r.sanMax) + delta);
        else if (res === 'esforco') state.peAtual = Math.max(0, (state.peAtual != null ? Number(state.peAtual) : r.peMax) + delta);
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });
  }
  function patchClamp() {
    if (typeof window.clampRecurso !== 'function' || window.clampRecurso.__overMax) return;
    window.clampRecurso = function (atual, max, lastMax) {
      if (atual == null || atual === undefined) return max;
      var v = Number(atual);
      if (isNaN(v)) return max;
      return Math.max(0, v);
    };
    window.clampRecurso.__overMax = true;
  }
  var n = 0;
  var t = setInterval(function () {
    n++;
    rebind();
    patchClamp();
    if (n > 20) clearInterval(t);
  }, 250);
  setInterval(patchClamp, 300);
})();
