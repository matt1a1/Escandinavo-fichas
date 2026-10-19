/**
 * auth-mobile-fix.js v7 — login Google no celular via login.html
 * Evita document.write do index que perdia o resultado do redirect
 */
(function () {
  if (window.__authMobileFixV7) return;
  window.__authMobileFixV7 = true;

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function isAndroid() {
    return /Android/i.test(navigator.userAgent || '');
  }
  function isStandalonePWA() {
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      if (window.navigator.standalone === true) return true;
    } catch (e) {}
    return false;
  }
  function isMobile() {
    if (isIOS() || isAndroid()) return true;
    if (isStandalonePWA()) return true;
    try {
      if (navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) <= 900) return true;
    } catch (e) {}
    return false;
  }

  function toast(msg, isErr) {
    try {
      if (typeof window.uiAlert === 'function') {
        window.uiAlert(String(msg), { title: isErr ? 'Erro' : 'Login' });
        return;
      }
    } catch (e) {}
    try { alert(String(msg)); } catch (e2) {}
  }

  function forceMobSync() {
    try { if (typeof window.__authUiSyncNow === 'function') window.__authUiSyncNow(); } catch (e) {}
    try { if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth(); } catch (e) {}
    var n = 0;
    var iv = setInterval(function () {
      try {
        if (typeof window.__authUiSyncNow === 'function') window.__authUiSyncNow();
        if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
        var user = null;
        try {
          if (window.firebase && firebase.auth) user = firebase.auth().currentUser;
        } catch (e) {}
        if (user) {
          var loginBtn = document.getElementById('btn-auth-login');
          var logoutBtn = document.getElementById('btn-auth-logout');
          var mobLogin = document.getElementById('mob-btn-login');
          var mobLogout = document.getElementById('mob-btn-logout');
          if (loginBtn) loginBtn.style.display = 'none';
          if (logoutBtn) logoutBtn.style.display = '';
          if (mobLogin) mobLogin.style.display = 'none';
          if (mobLogout) mobLogout.style.display = '';
        }
      } catch (e) {}
      if (++n > 40) clearInterval(iv);
    }, 250);
  }

  function loginPageUrl() {
    try {
      var base = location.href.replace(/[#?].*$/, '');
      if (/index\.html$/i.test(base)) base = base.replace(/index\.html$/i, '');
      if (!/\/$/.test(base)) base = base.replace(/\/[^/]*$/, '/');
      return base + 'login.html?auto=1';
    } catch (e) {
      return 'login.html?auto=1';
    }
  }

  function patchLogin() {
    if (!window.EscandinavoAuth || typeof window.EscandinavoAuth.login !== 'function') return false;
    if (window.EscandinavoAuth.__loginPatchedV7) return true;

    window.EscandinavoAuth.login = async function () {
      try {
        // Mobile: página dedicada (sem document.write)
        if (isMobile() || isStandalonePWA()) {
          toast('Abrindo login Google…');
          location.href = loginPageUrl();
          return;
        }

        if (!window.firebase || !firebase.auth) {
          toast('Firebase ainda carregando. Aguarde 1 segundo e tente de novo.', true);
          return;
        }
        var auth = firebase.auth();
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({ prompt: 'select_account' });
        try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}

        try {
          toast('Escolha a conta Google…');
          await auth.signInWithPopup(provider);
          forceMobSync();
        } catch (e) {
          var c = (e && e.code) || '';
          if (
            c === 'auth/popup-blocked' ||
            c === 'auth/cancelled-popup-request' ||
            c === 'auth/popup-closed-by-user' ||
            c === 'auth/operation-not-supported-in-this-environment'
          ) {
            location.href = loginPageUrl();
            return;
          }
          throw e;
        }
      } catch (e) {
        console.error('[auth-mobile] login', e);
        var code = (e && e.code) || '';
        var msg = (e && e.message) || String(e);
        if (code === 'auth/unauthorized-domain') {
          toast('Domínio não autorizado no Firebase. Adicione matt1a1.github.io em Authorized domains.', true);
        } else if (code === 'auth/network-request-failed') {
          toast('Sem conexão. Verifique a internet e tente de novo.', true);
        } else if (code === 'auth/redirect-cancelled-by-user' || code === 'auth/popup-closed-by-user') {
        } else {
          toast('Falha no login: ' + msg, true);
        }
      }
    };

    window.EscandinavoAuth.__loginPatchedV7 = true;
    window.EscandinavoAuth.__loginPatchedV6 = true;
    window.EscandinavoAuth.__loginPatched = true;

    // Se voltou de login.html?auth=ok
    try {
      if (/[?&]auth=ok\b/.test(location.search)) {
        forceMobSync();
        setTimeout(forceMobSync, 500);
        setTimeout(forceMobSync, 1500);
        try {
          history.replaceState({}, '', location.pathname + location.hash);
        } catch (e) {}
      }
    } catch (e) {}

    try {
      if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(function (user) {
          forceMobSync();
        });
      }
    } catch (e) {}

    forceMobSync();
    return true;
  }

  var tries = 0;
  var t = setInterval(function () {
    tries++;
    if (patchLogin() || tries > 60) clearInterval(t);
  }, 200);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { patchLogin(); });
  } else {
    patchLogin();
  }

  window.addEventListener('pageshow', function () { forceMobSync(); setTimeout(forceMobSync, 500); });
  window.addEventListener('focus', function () { setTimeout(forceMobSync, 200); });

  console.log('[auth-mobile-fix] v7 mobile=' + isMobile());
})();
