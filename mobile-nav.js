// Navegação mobile estilo drawer (CRIS)
(function () {
  function isMobile() { return window.matchMedia('(max-width: 720px)').matches; }

  function buildDrawer() {
    if (document.getElementById('mob-drawer')) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'mob-drawer-backdrop';
    backdrop.id = 'mob-drawer-backdrop';

    var drawer = document.createElement('div');
    drawer.className = 'mob-drawer';
    drawer.id = 'mob-drawer';
    drawer.innerHTML =
      '<div class="mob-drawer-head">' +
        '<button type="button" class="mob-drawer-close" id="mob-drawer-close" aria-label="Fechar">×</button>' +
      '</div>' +
      '<div class="mob-drawer-brand">◈ Escandinavo</div>' +
      '<button type="button" class="mob-drawer-link active" data-view="agentes">Agentes</button>' +
      '<button type="button" class="mob-drawer-link" data-view="campanhas">Campanhas</button>';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function close() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    }
    function open() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
    }

    document.getElementById('mob-drawer-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);

    drawer.querySelectorAll('.mob-drawer-link').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.dataset.view;
        drawer.querySelectorAll('.mob-drawer-link').forEach(function (b) {
          b.classList.toggle('active', b.dataset.view === view);
        });
        var navLink = document.querySelector('.ag-nav a[data-view="' + view + '"]');
        if (navLink) navLink.click();
        close();
      });
    });

    window.__mobDrawerOpen = open;
    window.__mobDrawerClose = close;
  }

  function injectHamburger() {
    var nav = document.querySelector('.ag-nav');
    if (!nav || document.getElementById('mob-menu-btn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mob-menu-btn';
    btn.id = 'mob-menu-btn';
    btn.setAttribute('aria-label', 'Menu');
    btn.textContent = '☰';
    btn.addEventListener('click', function () {
      buildDrawer();
      if (window.__mobDrawerOpen) window.__mobDrawerOpen();
    });

    var spacer = document.createElement('span');
    spacer.className = 'mob-nav-spacer';

    nav.insertBefore(btn, nav.firstChild);
    if (btn.nextSibling) nav.insertBefore(spacer, btn.nextSibling);
    else nav.appendChild(spacer);
  }

  function enhanceAgentCards() {
    if (!isMobile()) return;
    document.querySelectorAll('.ag-card').forEach(function (card) {
      if (card.querySelector('.ag-card-body')) return;
      var avatar = card.querySelector('.avatar');
      var h3 = card.querySelector('h3');
      var meta = card.querySelector('.meta');
      var acessar = card.querySelector('.acessar');
      var del = card.querySelector('.del');
      var body = document.createElement('div');
      body.className = 'ag-card-body';
      if (h3) body.appendChild(h3);
      if (meta) body.appendChild(meta);
      if (acessar) body.appendChild(acessar);
      if (del) body.appendChild(del);
      card.innerHTML = '';
      if (avatar) card.appendChild(avatar);
      card.appendChild(body);
    });
  }

  var gridObs = null;
  function watchGrid() {
    var grid = document.getElementById('ag-grid');
    if (!grid || gridObs) return;
    gridObs = new MutationObserver(function () {
      enhanceAgentCards();
    });
    gridObs.observe(grid, { childList: true });
    enhanceAgentCards();
  }

  function init() {
    injectHamburger();
    buildDrawer();
    watchGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', function () {
    if (!isMobile() && window.__mobDrawerClose) window.__mobDrawerClose();
  });
})();
