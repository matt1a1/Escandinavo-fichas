/**
 * auth-ui-sync-fix.js v2 — força esconder "Entrar" quando Firebase tem sessão
 */
(function () {
  if (window.__authUiSyncFixV2) return;
  window.__authUiSyncFixV2 = true;

  function fbUser() {
    try {
      if (window.firebase && firebase.auth) {
        var u = firebase.auth().currentUser;
        if (u) return u;
      }
    } catch (e) {}
    try {
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.user === 'function') {
        return window.EscandinavoAuth.user();
      }
    } catch (e) {}
    return null;
  }

  function displayName(u) {
    try {
      var custom = localStorage.getItem('escandinavo-nome-conta');
      if (custom && String(custom).trim()) return String(custom).trim();
    } catch (e) {}
    try {
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.displayName === 'function') {
        var n = window.EscandinavoAuth.displayName();
        if (n) return n;
      }
    } catch (e) {}
    if (!u) return '';
    return u.displayName || (u.email ? u.email.split('@')[0] : 'Conta');
  }

  function hide(el) {
    if (!el) return;
    el.style.setProperty('display', 'none', 'important');
  }
  function show(el, mode) {
    if (!el) return;
    el.style.setProperty('display', mode || 'block', 'important');
  }

  function syncAll() {
    var user = fbUser();
    var logged = !!user;

    try {
      document.body.classList.toggle('is-logged-in', logged);
    } catch (e) {}

    var loginBtn = document.getElementById('btn-auth-login');
    var logoutBtn = document.getElementById('btn-auth-logout');
    var userEl = document.getElementById('auth-user');
    var mobLogin = document.getElementById('mob-btn-login');
    var mobLogout = document.getElementById('mob-btn-logout');
    var mobEdit = document.getElementById('mob-btn-edit-name');
    var mobLabel = document.getElementById('mob-auth-label');

    if (logged) {
      hide(loginBtn);
      show(logoutBtn, '');
      hide(mobLogin);
      show(mobLogout, 'block');
      show(mobEdit, 'block');
      if (userEl) {
        show(userEl, '');
        userEl.textContent = displayName(user) + ' ✎';
      }
      if (mobLabel) mobLabel.textContent = 'Logado: ' + displayName(user);
    } else {
      show(loginBtn, '');
      hide(logoutBtn);
      show(mobLogin, 'block');
      hide(mobLogout);
      hide(mobEdit);
      if (userEl) {
        hide(userEl);
        userEl.textContent = '';
      }
      if (mobLabel) mobLabel.textContent = 'Entre para salvar na nuvem';
    }

    try {
      document.querySelectorAll('button, a').forEach(function (el) {
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t !== 'Entrar com Google' && t !== 'Entrar') return;
        if (el.id === 'btn-auth-login' || el.id === 'mob-btn-login') return;
        if (el.closest && (el.closest('.ag-nav') || el.closest('#auth-bar') || el.closest('#mob-auth-section'))) {
          if (logged) hide(el); else show(el, '');
        }
      });
    } catch (e) {}

    try {
      if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
    } catch (e) {}
  }

  function ensureCss() {
    if (document.getElementById('auth-ui-sync-css')) return;
    var s = document.createElement('style');
    s.id = 'auth-ui-sync-css';
    s.textContent = [
      'body.is-logged-in #btn-auth-login{display:none!important;}',
      'body.is-logged-in #mob-btn-login{display:none!important;}',
      'body:not(.is-logged-in) #btn-auth-logout{display:none!important;}',
      'body:not(.is-logged-in) #mob-btn-logout{display:none!important;}'
    ].join('');
    document.head.appendChild(s);
  }

  function bindAuth() {
    try {
      if (!window.firebase || !firebase.auth) return false;
      if (window.__authUiSyncBoundV2) return true;
      window.__authUiSyncBoundV2 = true;
      firebase.auth().onAuthStateChanged(function () {
        syncAll();
        setTimeout(syncAll, 100);
        setTimeout(syncAll, 500);
        setTimeout(syncAll, 1500);
        setTimeout(syncAll, 3000);
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function boot() {
    ensureCss();
    bindAuth();
    syncAll();
  }

  var n = 0;
  var iv = setInterval(function () {
    boot();
    if (++n > 40) clearInterval(iv);
  }, 500);

  setInterval(function () {
    ensureCss();
    bindAuth();
    syncAll();
  }, 3000);

  window.addEventListener('pageshow', function () {
    setTimeout(syncAll, 0);
    setTimeout(syncAll, 400);
    setTimeout(syncAll, 1200);
  });
  window.addEventListener('focus', function () { setTimeout(syncAll, 200); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(syncAll, 200);
  });

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && (t.id === 'mob-menu-btn' || (t.closest && t.closest('#mob-menu-btn')))) {
      setTimeout(syncAll, 50);
      setTimeout(syncAll, 300);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.__authUiSyncNow = syncAll;
  console.log('[auth-ui-sync] v2 ativo');
})();
