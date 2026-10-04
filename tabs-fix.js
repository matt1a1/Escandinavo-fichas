/* tabs-fix.js — garante navegação de abas e campos críticos (sem double-bind NEX/attr/res) */
(function () {
  function bindTabs() {
    document.querySelectorAll('[data-tab], .tab-btn, .sheet-tab, .nav-tab').forEach(function (btn) {
      if (btn.dataset.tabsBound) return;
      btn.dataset.tabsBound = '1';
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab') || btn.dataset.tab;
        if (!tab) return;
        document.querySelectorAll('[data-tab], .tab-btn, .sheet-tab, .nav-tab').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('[data-panel], .tab-panel, .sheet-panel').forEach(function (p) {
          var id = p.getAttribute('data-panel') || p.id || '';
          var show = id === tab || id === 'panel-' + tab || id.indexOf(tab) >= 0;
          if (p.hasAttribute('hidden') || p.classList.contains('tab-panel') || p.classList.contains('sheet-panel')) {
            p.hidden = !show;
            p.classList.toggle('active', show);
          }
        });
      });
    });
  }

  function bindSafe(id, evt, fn) {
    var el = document.getElementById(id);
    if (!el || el.dataset['tabs_' + evt]) return;
    el.dataset['tabs_' + evt] = '1';
    el.addEventListener(evt, fn);
  }

  function bindCritical() {
    bindTabs();

    // Classe / origem
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
    // NEX / atributos / recursos: bind único em controls-fix.js e app-res-fix.js
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
