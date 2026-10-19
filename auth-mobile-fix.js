/**
 * auth-mobile-fix.js — versao simples (so sincroniza UI, NAO sobrescreve login)
 * Login fica por conta do auth.js estavel (popup -> fallback redirect)
 */
(function () {
  if (window.__authMobileSimple) return;
  window.__authMobileSimple = true;

  function sync() {
    try {
      if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
    } catch (e) {}
    try {
      var user = null;
      if (window.firebase && firebase.auth) user = firebase.auth().currentUser;
      if (!user && window.EscandinavoAuth && typeof window.EscandinavoAuth.user === 'function') {
        user = window.EscandinavoAuth.user();
      }
      var loginBtn = document.getElementById('btn-auth-login');
      var logoutBtn = document.getElementById('btn-auth-logout');
      var mobLogin = document.getElementById('mob-btn-login');
      var mobLogout = document.getElementById('mob-btn-logout');
      var mobEdit = document.getElementById('mob-btn-edit-name');
      var mobLabel = document.getElementById('mob-auth-label');
      if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = '';
        if (mobLogin) mobLogin.style.display = 'none';
        if (mobLogout) mobLogout.style.display = 'block';
        if (mobEdit) mobEdit.style.display = 'block';
        if (mobLabel) {
          var name = (user.displayName || user.email || 'Conta');
          try {
            var c = localStorage.getItem('escandinavo-nome-conta');
            if (c) name = c;
          } catch (e) {}
          mobLabel.textContent = 'Logado: ' + name;
        }
      }
    } catch (e) {}
  }

  var n = 0;
  var iv = setInterval(function () {
    sync();
    if (++n > 20) clearInterval(iv);
  }, 500);

  try {
    if (window.firebase && firebase.auth) {
      firebase.auth().onAuthStateChanged(function () { sync(); });
    }
  } catch (e) {}

  window.addEventListener('pageshow', function () { setTimeout(sync, 200); });
  window.addEventListener('focus', function () { setTimeout(sync, 200); });

  console.log('[auth-mobile] simple UI sync (login = auth.js)');
})();
