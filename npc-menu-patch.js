// Patch: menu ⋯ nos cards de NPC/Criatura
(function () {
  function enhanceGrid(grid, key) {
    if (!grid || !window.EscandinavoShare) return;
    grid.querySelectorAll('.ag-card').forEach(function (card) {
      if (card.querySelector('.ag-menu')) return;
      var del = card.querySelector('.del');
      var id = del && del.dataset.id;
      if (!id) return;
      var wrap = document.createElement('div');
      wrap.innerHTML = window.EscandinavoShare.menuHtml(id);
      var menu = wrap.firstChild;
      if (del) del.replaceWith(menu);
      else card.insertBefore(menu, card.firstChild);
    });
    window.EscandinavoShare.bindCardMenus(grid, key, function () {
      var search = document.getElementById(key.indexOf('npc') >= 0 ? 'npc-search' : 'criatura-search');
      if (search) search.dispatchEvent(new Event('input'));
    });
  }
  function tick() {
    enhanceGrid(document.getElementById('npc-grid'), 'escandinavo-npcs-registro');
    enhanceGrid(document.getElementById('criatura-grid'), 'escandinavo-criaturas-registro');
  }
  setInterval(tick, 800);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick);
  else tick();
})();
