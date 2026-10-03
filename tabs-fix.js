/* tabs-fix.js — restaura navegação das abas da ficha e binds críticos */
(function () {
  function bindTabs() {
    document.querySelectorAll('.tab').forEach(function (tab) {
      if (tab.__tabBound) return;
      tab.__tabBound = true;
      tab.style.cursor = 'pointer';
      tab.style.pointerEvents = 'auto';
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = tab.getAttribute('data-tab');
        if (!target) return;
        document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
      }, true);
    });
  }

  function bindCritical() {
    // NEX
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
    // Recursos: bind só no app.js (evita delta duplo)

    // Atributos
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
    bindTabs();
    bindCritical();
    if (n > 30) clearInterval(t);
  }, 200);
})();
