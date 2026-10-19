/**
 * auth-restore-login.js — restaura o login que funcionava
 * Mobile: tenta popup primeiro; se falhar, redirect
 * Desktop: popup
 * NAO usa login.html
 */
(function () {
  if (window.__authRestoreLogin) return;
  window.__authRestoreLogin = true;

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') ||
      (typeof window.innerWidth === 'number' && window.innerWidth <= 720);
  }

  function toast(msg, isErr) {
    try {
      if (typeof window.uiAlert === 'function') {
        window.uiAlert(String(msg), { title: isErr ? 'Erro' : 'Login' });
        return;
      }
    } catch (e) {}
    var el = document.getElementById('auth-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-toast';
      el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:12px 18px;border-radius:10px;font-size:.9rem;max-width:92vw;box-shadow:0 8px 24px rgba(0,0,0,.45);text-align:center;';
      document.body.appendChild(el);
    }
    el.style.background = isErr ? '#7f1d1d' : '#1e1b4b';
    el.style.color = '#fff';
    el.style.border = isErr ? '1px solid #ef4444' : '1px solid #8b5cf6';
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 4500);
  }

  function patch() {
    if (!window.EscandinavoAuth) return false;
    if (window.EscandinavoAuth.__restoreLogin) return true;

    window.EscandinavoAuth.login = async function () {
      try {
        if (!window.firebase || !firebase.auth) {
          toast('Firebase ainda carregando. Aguarde 1s e tente de novo.', true);
          return;
        }
        var auth = firebase.auth();
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({ prompt: 'select_account' });

        try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}

        toast('Abrindo login Google…');

        if (isMobile()) {
          try {
            await auth.signInWithPopup(provider);
            if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
            return;
          } catch (popupErr) {
            console.warn('mobile popup', popupErr && popupErr.code, popupErr);
            toast('Redirecionando para o Google…');
            try { sessionStorage.setItem('escandinavo-auth-redirect', '1'); } catch (e) {}
            await auth.signInWithRedirect(provider);
            return;
          }
        }

        try {
          await auth.signInWithPopup(provider);
          if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
        } catch (e) {
          var c = (e && e.code) || '';
          if (c === 'auth/popup-blocked' || c === 'auth/cancelled-popup-request' || c === 'auth/popup-closed-by-user') {
            toast('Redirecionando para o Google…');
            try { sessionStorage.setItem('escandinavo-auth-redirect', '1'); } catch (e3) {}
            await auth.signInWithRedirect(provider);
            return;
          }
          throw e;
        }
      } catch (e) {
        console.error('login restore', e);
        toast('Falha no login: ' + ((e && e.message) || e), true);
      }
    };

    window.EscandinavoAuth.__restoreLogin = true;
    // limpa flags dos patches antigos
    window.EscandinavoAuth.__loginPatchedV7 = false;
    window.EscandinavoAuth.__loginPatchedV6 = false;
    return true;
  }

  var n = 0;
  var iv = setInterval(function () {
    if (patch() || ++n > 50) clearInterval(iv);
  }, 200);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patch);
  } else {
    patch();
  }

  console.log('[auth-restore] login estavel ativo');
})();
