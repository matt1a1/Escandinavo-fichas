/**
 * auth-ui-sync-fix.js — esconde "Entrar com Google" quando já está logado
 * Corrige atraso do onAuthStateChanged / redirect no celular
 */
(function () {
  if (window.__authUiSyncFix) return;
  window.__authUiSyncFix = true;

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
      if (window.EscandinavoAuth && typeof window.EscandinavoAuth.displayName === 'function') {
        var n = window.EscandinavoAuth.displayName();
        if (n) return n;
      }
    } catch (e) {}
    if (!u) return '';
    try {
      var custom = localStorage.getItem('escandinavo-nome-conta');
      if (custom) return custom;
    } catch (e) {}
    return u.displayName || (u.email ? u.email.split('@')[0] : 'Conta');
  }

  function setDisplay(el, show) {
    if (!el) return;
    el.style.display = show ? '' : 'none';
  }

  function syncAll() {
    var user = fbUser();
    var logged = !!user;

    setDisplay(document.getElementById('btn-auth-login'), !logged);
    setDisplay(document.getElementById('btn-auth-logout'), logged);
    var userEl = document.getElementById('auth-user');
    if (userEl) {
      if (logged) {
        userEl.style.display = '';
        userEl.textContent = displayName(user) + ' ✎';
      } else {
        userEl.style.display = 'none';
        userEl.textContent = '';
      }
    }

    setDisplay(document.getElementById('mob-btn-login'), !logged);
    setDisplay(document.getElementById('mob-btn-logout'), logged);
    setDisplay(document.getElementById('mob-btn-edit-name'), logged);
    var label = document.getElementById('mob-auth-label');
    if (label) {
      label.textContent = logged
        ? ('Logado: ' + displayName(user))
        : 'Entre para salvar na nuvem';
    }

    try {
      document.querySelectorAll('button, a').forEach(function (el) {
        var t = (el.textContent || '').trim();
        if (t === 'Entrar com Google' || t === 'Entrar') {
          if (el.id === 'btn-auth-login' || el.id === 'mob-btn-login') return;
          if (el.closest && (el.closest('.ag-nav') || el.closest('#auth-bar') || el.closest('#mob-auth-section'))) {
            el.style.display = logged ? 'none' : '';
          }
        }
      });
    } catch (e) {}

    try {
      if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
    } catch (e) {}
  }

  function patchUserFn() {
    if (!window.EscandinavoAuth) return false;
    if (window.EscandinavoAuth.__userPatched) return true;
    var orig = window.EscandinavoAuth.user;
    window.EscandinavoAuth.user = function () {
      var u = null;
      try { if (typeof orig === 'function') u = orig(); } catch (e) {}
      if (u) return u;
      try {
        if (window.firebase && firebase.auth && firebase.auth().currentUser) {
          return firebase.auth().currentUser;
        }
      } catch (e) {}
      return null;
    };
    window.EscandinavoAuth.__userPatched = true;
    return true;
  }

  function bindAuthListener() {
    try {
      if (!window.firebase || !firebase.auth) return false;
      if (window.__authUiSyncBound) return true;
      window.__authUiSyncBound = true;
      firebase.auth().onAuthStateChanged(function () {
        syncAll();
        setTimeout(syncAll, 100);
        setTimeout(syncAll, 500);
        setTimeout(syncAll, 1500);
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function boot() {
    patchUserFn();
    bindAuthListener();
    syncAll();
  }

  var n = 0;
  var iv = setInterval(function () {
    boot();
    if (++n > 40) clearInterval(iv);
  }, 250);

  setInterval(function () {
    patchUserFn();
    bindAuthListener();
    syncAll();
  }, 2000);

  window.addEventListener('pageshow', function () {
    setTimeout(syncAll, 0);
    setTimeout(syncAll, 300);
    setTimeout(syncAll, 1000);
  });
  window.addEventListener('focus', function () { setTimeout(syncAll, 200); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(syncAll, 200);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && (t.id === 'mob-menu-btn' || (t.closest && t.closest('#mob-menu-btn')))) {
      setTimeout(syncAll, 50);
      setTimeout(syncAll, 300);
    }
  }, true);

  window.__authUiSyncNow = syncAll;
  console.log('[auth-ui-sync] ativo');
})();
