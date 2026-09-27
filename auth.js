/**
 * Login Google + sincronização (Firebase)
 * - Popup no desktop; redirect no mobile se popup falhar
 */
(function () {
  const REGISTRO_KEY = 'escandinavo-agentes-registro';
  const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';
  const FICHA_PREFIX = 'escandinavo-ficha-';

  let auth = null;
  let db = null;
  let currentUser = null;
  let syncing = false;

  function configOk() {
    const c = window.FIREBASE_CONFIG;
    return !!(window.FIREBASE_ENABLED && c && c.apiKey && c.apiKey !== 'COLE_AQUI' && c.projectId && c.projectId !== 'COLE_AQUI');
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 720;
  }

  function toast(msg, isErr) {
    let el = document.getElementById('auth-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-toast';
      el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:12px 18px;border-radius:10px;font-size:.9rem;max-width:92vw;box-shadow:0 8px 24px rgba(0,0,0,.45);transition:opacity .3s;text-align:center;';
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

  function ensureAuthUI() {
    if (document.getElementById('auth-bar')) {
      updateAuthUI();
      return;
    }
    const nav = document.querySelector('.ag-nav');
    if (!nav) return;

    const bar = document.createElement('div');
    bar.id = 'auth-bar';
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0;';
    bar.innerHTML =
      '<span id="auth-user" style="font-size:.8rem;color:#9797a8;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>' +
      '<button type="button" id="btn-auth-login" class="btn-primary" style="padding:8px 14px;font-size:.82rem;display:none;white-space:nowrap;">Entrar com Google</button>' +
      '<button type="button" id="btn-auth-logout" class="btn-ghost" style="padding:8px 12px;font-size:.82rem;display:none;">Sair</button>';

    nav.appendChild(bar);

    document.getElementById('btn-auth-login').onclick = function () { loginGoogle(); };
    document.getElementById('btn-auth-logout').onclick = function () { logout(); };
    updateAuthUI();
  }

  function updateAuthUI() {
    const loginBtn = document.getElementById('btn-auth-login');
    const logoutBtn = document.getElementById('btn-auth-logout');
    const userEl = document.getElementById('auth-user');
    if (!loginBtn) return;

    if (!configOk()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'none';
      if (userEl) userEl.textContent = '';
      return;
    }

    if (currentUser) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = '';
      if (userEl) userEl.textContent = currentUser.displayName || currentUser.email || 'Conta';
    } else {
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
      if (userEl) userEl.textContent = '';
    }
  }

  function loadScripts() {
    return new Promise(function (resolve, reject) {
      if (window.firebase && window.firebase.auth) {
        resolve();
        return;
      }
      function add(src) {
        return new Promise(function (res, rej) {
          const s = document.createElement('script');
          s.src = src;
          s.onload = res;
          s.onerror = function () { rej(new Error('Falha ao carregar ' + src)); };
          document.head.appendChild(s);
        });
      }
      add('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js')
        .then(function () { return add('https://www.gstatic.com/firebasejs/10.14.0/firebase-auth-compat.js'); })
        .then(function () { return add('https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore-compat.js'); })
        .then(resolve)
        .catch(reject);
    });
  }

  async function initFirebase() {
    ensureAuthUI();
    if (!configOk()) return;

    try {
      await loadScripts();
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      auth = firebase.auth();
      db = firebase.firestore();

      try {
        const redirectResult = await auth.getRedirectResult();
        if (redirectResult && redirectResult.user) {
          toast('Login ok: ' + (redirectResult.user.displayName || redirectResult.user.email));
        }
      } catch (e) {
        console.warn('redirect result', e);
        if (e.code) toast('Erro no login: ' + friendlyError(e), true);
      }

      auth.onAuthStateChanged(async function (user) {
        currentUser = user;
        updateAuthUI();
        if (user) {
          toast('Logado: ' + (user.displayName || user.email));
          await pullFromCloud();
          if (typeof renderAgentes === 'function') renderAgentes();
          if (typeof renderCampanhas === 'function') renderCampanhas();
        }
      });

      ensureAuthUI();
    } catch (e) {
      console.error('Firebase init', e);
      toast('Erro ao iniciar Firebase: ' + (e.message || e), true);
    }
  }

  function friendlyError(e) {
    const c = e.code || '';
    if (c === 'auth/popup-blocked') return 'Popup bloqueado. Permita popups ou tente de novo.';
    if (c === 'auth/popup-closed-by-user') return 'Janela fechada antes de concluir.';
    if (c === 'auth/unauthorized-domain') return 'Domínio não autorizado. Adicione matt1a1.github.io no Firebase.';
    if (c === 'auth/operation-not-allowed') return 'Login Google desativado no Firebase.';
    if (c === 'auth/network-request-failed') return 'Sem conexão com a internet.';
    if (c === 'auth/internal-error') return 'Erro interno. Tente de novo em alguns segundos.';
    return (e.message || c || 'erro desconhecido');
  }

  async function loginGoogle() {
    if (!configOk() || !auth) {
      toast('Firebase ainda não está pronto. Atualize a página (Ctrl+F5).', true);
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    toast('Abrindo login Google…');

    try {
      if (isMobile()) {
        await auth.signInWithRedirect(provider);
        return;
      }
      await auth.signInWithPopup(provider);
    } catch (e) {
      console.error('login', e);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request') {
        try {
          toast('Popup bloqueado — redirecionando…');
          await auth.signInWithRedirect(provider);
          return;
        } catch (e2) {
          toast('Falha no login: ' + friendlyError(e2), true);
          return;
        }
      }
      toast('Falha no login: ' + friendlyError(e), true);
    }
  }

  async function logout() {
    try {
      await auth.signOut();
      toast('Você saiu da conta');
      updateAuthUI();
    } catch (e) {
      toast('Erro ao sair', true);
    }
  }

  function readLocalAgentes() {
    try { return JSON.parse(localStorage.getItem(REGISTRO_KEY)) || []; } catch (e) { return []; }
  }
  function readLocalCampanhas() {
    try { return JSON.parse(localStorage.getItem(CAMPANHAS_KEY)) || []; } catch (e) { return []; }
  }
  function readLocalFicha(id) {
    try { return JSON.parse(localStorage.getItem(FICHA_PREFIX + id)); } catch (e) { return null; }
  }

  function collectLocalFichas() {
    const agentes = readLocalAgentes();
    const out = {};
    agentes.forEach(function (a) {
      const f = readLocalFicha(a.id);
      if (f) out[a.id] = f;
    });
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(FICHA_PREFIX) === 0) {
        const id = k.slice(FICHA_PREFIX.length);
        if (!out[id]) {
          try { out[id] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
        }
      }
    }
    return out;
  }

  async function pullFromCloud() {
    if (!currentUser || !db || syncing) return;
    syncing = true;
    try {
      const ref = db.collection('users').doc(currentUser.uid);
      const snap = await ref.get();
      if (!snap.exists) {
        await pushToCloud();
        toast('Conta criada — dados salvos na nuvem');
        return;
      }
      const data = snap.data() || {};
      if (Array.isArray(data.agentes)) {
        localStorage.setItem(REGISTRO_KEY, JSON.stringify(data.agentes));
      }
      if (Array.isArray(data.campanhas)) {
        localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(data.campanhas));
      }
      if (data.fichas && typeof data.fichas === 'object') {
        Object.keys(data.fichas).forEach(function (id) {
          localStorage.setItem(FICHA_PREFIX + id, JSON.stringify(data.fichas[id]));
        });
      }
      toast('Dados da conta carregados');
      await pushToCloud();
    } catch (e) {
      console.error('pull', e);
      var msg = (e.message || '');
      if (msg.indexOf('permission') !== -1 || e.code === 'permission-denied') {
        toast('Firestore bloqueou o acesso. Use regras de teste ou ajuste as rules.', true);
      } else {
        toast('Erro ao carregar da nuvem: ' + msg, true);
      }
    } finally {
      syncing = false;
    }
  }

  async function pushToCloud() {
    if (!currentUser || !db) return;
    try {
      const ref = db.collection('users').doc(currentUser.uid);
      const payload = {
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        agentes: readLocalAgentes(),
        campanhas: readLocalCampanhas(),
        fichas: collectLocalFichas()
      };
      await ref.set(payload, { merge: true });
    } catch (e) {
      console.error('push', e);
      toast('Erro ao salvar na nuvem', true);
    }
  }

  const _setItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    _setItem(key, value);
    if (!currentUser || syncing) return;
    if (key === REGISTRO_KEY || key === CAMPANHAS_KEY || (key && key.indexOf(FICHA_PREFIX) === 0)) {
      clearTimeout(window.__cloudSaveTimer);
      window.__cloudSaveTimer = setTimeout(function () { pushToCloud(); }, 800);
    }
  };

  window.EscandinavoAuth = {
    login: loginGoogle,
    logout: logout,
    push: pushToCloud,
    pull: pullFromCloud,
    user: function () { return currentUser; },
    ready: configOk
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }
})();
