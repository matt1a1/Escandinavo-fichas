// Patch: menu ⋯ nos cards de agentes (substitui o X)
(function () {
  var KEY = 'escandinavo-agentes-registro';
  function patch() {
    if (typeof renderAgentes !== 'function') return;
    var orig = renderAgentes;
    window.renderAgentes = function () {
      orig.apply(this, arguments);
      var grid = document.getElementById('ag-grid');
      if (!grid) return;
      grid.querySelectorAll('.ag-card').forEach(function (card) {
        if (card.querySelector('.ag-menu')) return;
        var del = card.querySelector('.del');
        var id = del && del.dataset.id;
        if (!id) return;
        if (window.EscandinavoShare && window.EscandinavoShare.menuHtml) {
          var wrap = document.createElement('div');
          wrap.innerHTML = window.EscandinavoShare.menuHtml(id);
          var menu = wrap.firstChild;
          if (del) del.replaceWith(menu);
          else card.insertBefore(menu, card.firstChild);
        }
      });
      if (window.EscandinavoShare && window.EscandinavoShare.bindCardMenus) {
        window.EscandinavoShare.bindCardMenus(grid, KEY, window.renderAgentes);
      }
    };
    try { window.renderAgentes(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(patch, 100); });
  else setTimeout(patch, 100);
})();
