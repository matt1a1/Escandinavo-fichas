/* tabs-fix.js — restaura navegação das abas da ficha e binds críticos */
(function () {
  function bindTabs() {
    var tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return false;
    tabs.forEach(function (tab) {
      if (tab.dataset.tabsFixBound) return;
      tab.dataset.tabsFixBound = '1';
      tab.style.cursor = 'pointer';
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = tab.getAttribute('data-tab');
        if (!target) return;
        document.querySelectorAll('.tab').forEach(function (t) {
          t.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(function (c) {
          c.classList.remove('active');
        });
        tab.classList.add('active');
        var panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
      });
    });
    return true;
  }

  function bindSafe(id, ev, fn) {
    var el = document.getElementById(id);
    if (!el || el.dataset.tabsFixBound) return;
    el.dataset.tabsFixBound = '1';
    el.addEventListener(ev, fn);
  }

  function bindCritical() {
    bindTabs();

    bindSafe('btn-add-hab', 'click', function () {
      if (typeof state === 'undefined') return;
      if (!state.habilidades) state.habilidades = [];
      state.habilidades.push({ nome: '', desc: '' });
      if (typeof renderHabilidades === 'function') renderHabilidades();
      if (typeof scheduleSave === 'function') scheduleSave();
    });

    ['nome', 'jogador', 'patente', 'aparencia', 'personalidade', 'historico', 'objetivo', 'anotacoes', 'credito'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.dataset.tabsFixBound) return;
      el.dataset.tabsFixBound = '1';
      el.addEventListener('input', function (e) {
        if (typeof state === 'undefined') return;
        state[id] = e.target.value;
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });

    bindSafe('classe', 'change', function (e) {
      if (typeof state === 'undefined') return;
      state.classe = e.target.value;
      if (typeof applyClassePericias === 'function') applyClassePericias();
      if (typeof renderAll === 'function') renderAll();
      else {
        if (typeof renderPericias === 'function') renderPericias();
        if (typeof renderRecursos === 'function') renderRecursos();
      }
      if (typeof scheduleSave === 'function') scheduleSave();
    });
    bindSafe('origem', 'change', function (e) {
      if (typeof state === 'undefined') return;
      state.origem = e.target.value;
      if (typeof applyOrigemPericias === 'function') applyOrigemPericias();
      if (typeof renderPericias === 'function') renderPericias();
      if (typeof renderRecursos === 'function') renderRecursos();
      if (typeof scheduleSave === 'function') scheduleSave();
    });

    document.querySelectorAll('.nex-btn').forEach(function (btn) {
      if (btn.dataset.tabsFixBound) return;
      btn.dataset.tabsFixBound = '1';
      btn.addEventListener('click', function () {
        if (typeof state === 'undefined') return;
        state.nex = Math.max(5, Math.min(99, (Number(state.nex) || 5) + Number(btn.dataset.delta || 0)));
        var nd = document.getElementById('nex-display');
        if (nd) nd.textContent = state.nex + '%';
        if (typeof normalizarAtributosNex === 'function') normalizarAtributosNex();
        if (typeof renderAtributos === 'function') renderAtributos();
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof renderPericias === 'function') renderPericias();
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });

    document.querySelectorAll('.res-btn').forEach(function (btn) {
      if (btn.dataset.tabsFixBound) return;
      btn.dataset.tabsFixBound = '1';
      btn.addEventListener('click', function () {
        if (typeof state === 'undefined' || typeof calcularRecursos !== 'function') return;
        var res = btn.dataset.res;
        var delta = Number(btn.dataset.delta || 0);
        var r = calcularRecursos();
        if (res === 'vida') state.vidaAtual = Math.max(0, Math.min(r.pvMax, (state.vidaAtual ?? r.pvMax) + delta));
        else if (res === 'sanidade') state.sanAtual = Math.max(0, Math.min(r.sanMax, (state.sanAtual ?? r.sanMax) + delta));
        else if (res === 'esforco') state.peAtual = Math.max(0, Math.min(r.peMax, (state.peAtual ?? r.peMax) + delta));
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });

    document.querySelectorAll('.attr-item').forEach(function (el) {
      var key = el.dataset.attr;
      if (!key) return;
      el.querySelectorAll('.attr-btn').forEach(function (btn) {
        if (btn.dataset.tabsFixBound) return;
        btn.dataset.tabsFixBound = '1';
        btn.addEventListener('click', function () {
          if (typeof state === 'undefined' || !state.atributos) return;
          var delta = Number(btn.dataset.delta || 0);
          var val = (Number(state.atributos[key]) || 0) + delta;
          var custom = typeof isFichaCustom === 'function' && isFichaCustom();
          if (custom) {
            if (val < 0) val = 0;
            if (val > 20) val = 20;
          } else {
            if (val < 0) val = 0;
            if (val > 5) val = 5;
            if (delta > 0 && typeof pontosDisponiveis === 'function' && pontosDisponiveis() <= 0) return;
          }
          state.atributos[key] = val;
          if (typeof renderAtributos === 'function') renderAtributos();
          if (typeof renderRecursos === 'function') renderRecursos();
          if (typeof renderPericias === 'function') renderPericias();
          if (typeof scheduleSave === 'function') scheduleSave();
        });
      });
    });
  }

  var n = 0;
  var t = setInterval(function () {
    n++;
    bindCritical();
    if (n > 60) clearInterval(t);
  }, 150);

  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(function () {
      bindTabs();
    });
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
})();
