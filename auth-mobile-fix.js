/**
 * Patch de login mobile: seletor de contas + sync UI
 * Carregar DEPOIS de auth.js
 */
(function () {
  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function forceMobSync() {
    try {
      if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
    } catch (e) {}
    var n = 0;
    var iv = setInterval(function () {
      try {
        if (window.firebase && firebase.auth && firebase.auth().currentUser) {
          if (window.EscandinavoAuth && typeof window.__mobSyncAuth === 'function') {
            window.__mobSyncAuth();
          }
        }
        if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
      } catch (e) {}
      if (++n > 25) clearInterval(iv);
    }, 400);
  }

  function patchLogin() {
    if (!window.EscandinavoAuth || typeof window.EscandinavoAuth.login !== 'function') return false;
    if (window.EscandinavoAuth.__loginPatched) return true;

    window.EscandinavoAuth.login = async function () {
      try {
        if (!window.firebase || !firebase.auth) {
          alert('Firebase ainda carregando. Aguarde 1s e tente de novo.');
          return;
        }
        var auth = firebase.auth();
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        // Força lista de contas
        provider.setCustomParameters({ prompt: 'select_account' });

        try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}

        // Sai da sessão atual para o seletor aparecer
        try { if (auth.currentUser) await auth.signOut(); } catch (e) {}

        if (isIOS()) {
          try { sessionStorage.setItem('escandinavo-auth-redirect', '1'); } catch (e) {}
          await auth.signInWithRedirect(provider);
          return;
        }

        // Android / desktop: popup com seletor
        await auth.signInWithPopup(provider);
        forceMobSync();
      } catch (e) {
        console.error('login patch', e);
        var c = (e && e.code) || '';
        if (c === 'auth/popup-blocked' || c === 'auth/cancelled-popup-request' || c === 'auth/popup-closed-by-user') {
          try {
            try { sessionStorage.setItem('escandinavo-auth-redirect', '1'); } catch (e3) {}
            var p = new firebase.auth.GoogleAuthProvider();
            p.addScope('email');
            p.addScope('profile');
            p.setCustomParameters({ prompt: 'select_account' });
            await firebase.auth().signInWithRedirect(p);
            return;
          } catch (e2) {
            alert('Falha no login: ' + ((e2 && e2.message) || e2));
            return;
          }
        }
        alert('Falha no login: ' + ((e && e.message) || e));
      }
    };

    window.EscandinavoAuth.__loginPatched = true;

    try {
      if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(function () {
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
    if (patchLogin() || tries > 40) clearInterval(t);
  }, 250);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { patchLogin(); });
  } else {
    patchLogin();
  }
})();
