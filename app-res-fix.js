/* app-res-fix.js v3 — setas de Vida/Sanidade/Esforço
   Delegação em capture (sem clone). Atual pode passar do máximo. */
(function () {
  if (window.__appResFixV3) return;
  window.__appResFixV3 = true;

  function S() {
    return (typeof state !== 'undefined') ? state : null;
  }

  function patchClamp() {
    if (typeof window.clampRecurso === 'function' && window.clampRecurso.__overMax) return;
    window.clampRecurso = function (atual, max) {
      if (atual == null || atual === undefined) return max;
      var v = Number(atual);
      if (isNaN(v)) return max;
      return Math.max(0, v);
    };
    window.clampRecurso.__overMax = true;
  }

  function handleRes(btn) {
    var st = S();
    if (!st || typeof calcularRecursos !== 'function') return;
    var res = btn.dataset.res;
    var delta = Number(btn.dataset.delta || 0);
    if (!delta) return;
    var r = calcularRecursos();
    if (res === 'vida') {
      st.vidaAtual = Math.max(0, (st.vidaAtual != null ? Number(st.vidaAtual) : r.pvMax) + delta);
    } else if (res === 'sanidade') {
      st.sanAtual = Math.max(0, (st.sanAtual != null ? Number(st.sanAtual) : r.sanMax) + delta);
    } else if (res === 'esforco') {
      st.peAtual = Math.max(0, (st.peAtual != null ? Number(st.peAtual) : r.peMax) + delta);
    } else {
      return;
    }
    if (typeof renderRecursos === 'function') {
      try { renderRecursos(); } catch (e) {}
    }
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
  }

  function onClick(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var btn = t.closest('.res-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    handleRes(btn);
  }

  document.addEventListener('click', onClick, true);

  var n = 0;
  var t = setInterval(function () {
    n++;
    patchClamp();
    if (n > 40) clearInterval(t);
  }, 200);
  setInterval(patchClamp, 2000);
})();
