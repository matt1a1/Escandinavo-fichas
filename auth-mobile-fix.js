/**
 * auth-mobile-fix.js v5 — login Google confiável no celular
 * - Mobile/PWA: sempre signInWithRedirect (popup falha no Chrome Android / PWA)
 * - Desktop: popup, com fallback para redirect
 * - Após voltar do Google: sincroniza UI do menu mobile
 */
(function () {
  if (window.__authMobileFixV5) return;
  window.__authMobileFixV5 = true;

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
    try {
      if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
    } catch (e) {}
    var n = 0;
    var iv = setInterval(function () {
      try {
        if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
        var user = null;
        try {
          if (window.firebase && firebase.auth) user = firebase.auth().currentUser;
        } catch (e) {}
        var loginBtn = document.getElementById('btn-login') || document.getElementById('mob-btn-login');
        var logoutBtn = document.getElementById('btn-logout') || document.getElementById('mob-btn-logout');
        if (user) {
          if (loginBtn) loginBtn.style.display = 'none';
          if (logoutBtn) logoutBtn.style.display = '';
        }
      } catch (e) {}
      if (++n > 30) clearInterval(iv);
    }, 300);
  }

  function makeProvider() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  }

  function setRedirectFlag() {
    try { sessionStorage.setItem('escandinavo-auth-redirect', '1'); } catch (e) {}
    try { localStorage.setItem('escandinavo-auth-redirect', String(Date.now())); } catch (e) {}
  }

  function clearRedirectFlag() {
    try { sessionStorage.removeItem('escandinavo-auth-redirect'); } catch (e) {}
    try { localStorage.removeItem('escandinavo-auth-redirect'); } catch (e) {}
  }

  async function doRedirectLogin(auth) {
    setRedirectFlag();
    toast('Redirecionando para o Google…');
    var provider = makeProvider();
    try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
    try { if (auth.currentUser) await auth.signOut(); } catch (e) {}
    await auth.signInWithRedirect(provider);
  }

  async function doPopupLogin(auth) {
    var provider = makeProvider();
    try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
    try { if (auth.currentUser) await auth.signOut(); } catch (e) {}
    toast('Escolha a conta Google…');
    await auth.signInWithPopup(provider);
    forceMobSync();
  }

  function patchLogin() {
    if (!window.EscandinavoAuth || typeof window.EscandinavoAuth.login !== 'function') return false;
    if (window.EscandinavoAuth.__loginPatchedV5) return true;

    window.EscandinavoAuth.login = async function () {
      try {
        if (!window.firebase || !firebase.auth) {
          toast('Firebase ainda carregando. Aguarde 1 segundo e tente de novo.', true);
          return;
        }
        var auth = firebase.auth();

        if (isMobile() || isStandalonePWA()) {
          await doRedirectLogin(auth);
          return;
        }

        try {
          await doPopupLogin(auth);
        } catch (e) {
          var c = (e && e.code) || '';
          if (
            c === 'auth/popup-blocked' ||
            c === 'auth/cancelled-popup-request' ||
            c === 'auth/popup-closed-by-user' ||
            c === 'auth/operation-not-supported-in-this-environment'
          ) {
            await doRedirectLogin(auth);
            return;
          }
          throw e;
        }
      } catch (e) {
        console.error('[auth-mobile] login', e);
        var code = (e && e.code) || '';
        var msg = (e && e.message) || String(e);
        if (code === 'auth/unauthorized-domain') {
          toast('Domínio não autorizado no Firebase. Avise o admin do site.', true);
        } else if (code === 'auth/network-request-failed') {
          toast('Sem conexão. Verifique a internet e tente de novo.', true);
        } else if (code === 'auth/redirect-cancelled-by-user' || code === 'auth/popup-closed-by-user') {
          // usuário cancelou
        } else {
          toast('Falha no login: ' + msg, true);
        }
      }
    };

    window.EscandinavoAuth.__loginPatchedV5 = true;
    window.EscandinavoAuth.__loginPatched = true;

    try {
      if (window.firebase && firebase.auth) {
        var auth = firebase.auth();
        auth.getRedirectResult().then(function (result) {
          if (result && result.user) {
            clearRedirectFlag();
            forceMobSync();
          }
        }).catch(function (e) {
          console.warn('[auth-mobile] redirectResult', e);
          if (e && e.code && e.code !== 'auth/redirect-cancelled-by-user') {
            try {
              if (sessionStorage.getItem('escandinavo-auth-redirect') || localStorage.getItem('escandinavo-auth-redirect')) {
                toast('Erro no login: ' + ((e && e.message) || e), true);
                clearRedirectFlag();
              }
            } catch (e2) {}
          }
        });

        auth.onAuthStateChanged(function (user) {
          forceMobSync();
          if (user) clearRedirectFlag();
        });
      }
    } catch (e) {}

    try {
      var flag = sessionStorage.getItem('escandinavo-auth-redirect') || localStorage.getItem('escandinavo-auth-redirect');
      if (flag) forceMobSync();
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
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(forceMobSync, 200);
  });

  console.log('[auth-mobile-fix] v5 mobile=' + isMobile() + ' pwa=' + isStandalonePWA());
})();
