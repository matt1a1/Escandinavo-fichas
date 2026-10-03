/* app-hotfix.js — restaura binds e renders essenciais se app.js estiver incompleto */
(function () {
  function bindIf(id, ev, fn) {
    var el = document.getElementById(id);
    if (!el || el.dataset.hotfixBound) return;
    el.dataset.hotfixBound = '1';
    el.addEventListener(ev, fn);
  }
  function install() {
    if (typeof state === 'undefined') return false;
    bindIf('btn-add-hab', 'click', function () {
      if (!state.habilidades) state.habilidades = [];
      state.habilidades.push({ nome: '', desc: '' });
      if (typeof renderHabilidades === 'function') renderHabilidades();
      if (typeof scheduleSave === 'function') scheduleSave();
    });
    if (typeof renderHabilidades === 'function') {
      try { renderHabilidades(); } catch (e) {}
    }
    return true;
  }
  var n = 0;
  var t = setInterval(function () {
    n++;
    if (install() || n > 100) clearInterval(t);
  }, 100);
})();
