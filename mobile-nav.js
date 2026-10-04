/**
 * Menu lateral estilo CRIS + login Google no celular
 * BUGFIX: EscandinavoAuth.user / displayName / editName são funções
 */
(function () {
  function isMobile() {
    return window.innerWidth <= 720;
  }

  function authUser() {
    try {
      if (!window.EscandinavoAuth || typeof window.EscandinavoAuth.user !== 'function') return null;
      return window.EscandinavoAuth.user() || null;
    } catch (e) {
      return null;
    }
  }

  function authDisplayName(user) {
    try {
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.displayName === 'function') {
        var n = window.EscandinavoAuth.displayName();
        if (n) return n;
      }
    } catch (e) {}
    if (user) return user.displayName || user.email || 'Conta';
    return '';
  }

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
      '<button type="button" class="mob-drawer-link" data-view="campanhas">Campanhas</button>' +
      '<button type="button" class="mob-drawer-link" data-view="npc">NPC</button>' +
      '<button type="button" class="mob-drawer-link" data-view="criaturas">Criatura/Ameaça</button>' +
      '<div id="mob-auth-section" style="margin-top:auto;padding:16px 20px;border-top:1px solid #2a2a38;">' +
        '<p id="mob-auth-label" style="margin:0 0 10px;font-size:.8rem;color:#9797a8;"></p>' +
        '<button type="button" id="mob-btn-login" style="width:100%;padding:12px;border:none;border-radius:8px;background:#8b5cf6;color:#fff;font-weight:600;font-size:.9rem;cursor:pointer;margin-bottom:8px;">Entrar com Google</button>' +
        '<button type="button" id="mob-btn-edit-name" style="width:100%;padding:10px;border:1px solid #2a2a38;border-radius:8px;background:transparent;color:#c4b5fd;font-size:.85rem;cursor:pointer;margin-bottom:8px;display:none;">Alterar nome</button>' +
        '<button type="button" id="mob-btn-logout" style="width:100%;padding:10px;border:1px solid #2a2a38;border-radius:8px;background:transparent;color:#f88;font-size:.85rem;cursor:pointer;display:none;">Sair</button>' +
      '</div>';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function close() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    }
    function open() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      syncAuthUI();
    }

    document.getElementById('mob-drawer-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);

    drawer.querySelectorAll('[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-view');
        drawer.querySelectorAll('[data-view]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        close();
        if (typeof window.mostrarView === 'function') window.mostrarView(view);
      });
    });

    document.getElementById('mob-btn-login').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.login === 'function') {
        window.EscandinavoAuth.login();
      } else {
        alert('Login ainda carregando. Aguarde 1 segundo e tente de novo.');
      }
    });
    document.getElementById('mob-btn-logout').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.logout === 'function') {
        window.EscandinavoAuth.logout().then(function () {
          syncAuthUI();
        }).catch(function () { syncAuthUI(); });
      }
    });
    document.getElementById('mob-btn-edit-name').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.editName === 'function') {
        window.EscandinavoAuth.editName();
      }
    });

    window.__mobDrawerOpen = open;
    window.__mobDrawerClose = close;
  }

  function syncAuthUI() {
    var loginBtn = document.getElementById('mob-btn-login');
    var logoutBtn = document.getElementById('mob-btn-logout');
    var editBtn = document.getElementById('mob-btn-edit-name');
    var label = document.getElementById('mob-auth-label');
    if (!loginBtn) return;

    var user = authUser();
    if (user) {
      loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      if (editBtn) editBtn.style.display = 'block';
      if (label) label.textContent = 'Logado: ' + authDisplayName(user);
    } else {
      loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (editBtn) editBtn.style.display = 'none';
      if (label) {
        if (window.EscandinavoAuth && window.EscandinavoAuth.ready && !window.EscandinavoAuth.ready()) {
          label.textContent = 'Login indisponível (config)';
        } else {
          label.textContent = 'Entre para salvar na nuvem';
        }
      }
    }
  }

  window.__mobSyncAuth = syncAuthUI;

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
      var h3 = card.querySelector('h3');
      var meta = card.querySelector('.meta');
      var avatar = card.querySelector('.avatar');
      if (!h3) return;
      var body = document.createElement('div');
      body.className = 'ag-card-body';
      if (h3) body.appendChild(h3);
      if (meta) body.appendChild(meta);
      if (avatar && avatar.parentNode === card) {
        card.insertBefore(body, avatar.nextSibling);
      } else {
        card.appendChild(body);
      }
    });
  }

  function boot() {
    if (!isMobile()) return;
    injectHamburger();
    buildDrawer();
    enhanceAgentCards();
    syncAuthUI();
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      syncAuthUI();
      if (tries > 30) clearInterval(t);
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('resize', function () {
    if (isMobile()) {
      injectHamburger();
      buildDrawer();
      syncAuthUI();
    }
  });

  var obs = new MutationObserver(function () {
    if (isMobile()) enhanceAgentCards();
  });
  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
