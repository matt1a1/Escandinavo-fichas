/**
 * Login Google + sincronização (Firebase)
 * - Popup no desktop; no mobile tenta popup e cai em redirect
 * - Nome de conta editável
 * - Merge local + nuvem (não apaga personagens)
 */
(function () {
  const REGISTRO_KEY = 'escandinavo-agentes-registro';
  const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';
  const FICHA_PREFIX = 'escandinavo-ficha-';
  const NOME_LOCAL_KEY = 'escandinavo-nome-conta';

  let auth = null;
  let db = null;
  let currentUser = null;
  let syncing = false;
  let customName = '';

  function configOk() {
    const c = window.FIREBASE_CONFIG;
    return !!(window.FIREBASE_ENABLED && c && c.apiKey && c.apiKey !== 'COLE_AQUI' && c.projectId && c.projectId !== 'COLE_AQUI');
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 720;
  }

  function displayName() {
    if (customName && customName.trim()) return customName.trim();
    if (currentUser) return currentUser.displayName || currentUser.email || 'Conta';
    return '';
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

  function fecharModalNome() {
    const modal = document.getElementById('modal-nome-conta');
    if (modal) {
      modal.style.display = 'none';
      modal.hidden = true;
    }
  }

  function ensureNameModal() {
    if (document.getElementById('modal-nome-conta')) return;
    const wrap = document.createElement('div');
    wrap.id = 'modal-nome-conta';
    wrap.hidden = true;
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:300;display:none;align-items:center;justify-content:center;padding:16px;';
    wrap.innerHTML =
      '<div style="background:#16161f;border:1px solid #2a2a38;border-radius:12px;padding:22px;max-width:400px;width:100%;">' +
        '<h3 style="margin:0 0 6px;font-size:1.05rem;color:#f2f2f6;">Nome da conta</h3>' +
        '<p style="margin:0 0 14px;font-size:.82rem;color:#9797a8;">Esse nome aparece no site. Não altera sua conta Google.</p>' +
        '<input id="input-nome-conta" type="text" maxlength="40" placeholder="Seu nome" ' +
          'style="width:100%;padding:11px 12px;border-radius:8px;border:1px solid #2a2a38;background:#0b0b10;color:#f2f2f6;font-size:.95rem;margin-bottom:16px;box-sizing:border-box;" />' +
        '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
          '<button type="button" id="btn-nome-cancelar" style="padding:9px 14px;background:transparent;color:#9797a8;border:1px solid #2a2a38;border-radius:8px;cursor:pointer;font-size:.9rem;">Cancelar</button>' +
          '<button type="button" id="btn-nome-salvar" style="padding:9px 16px;background:#8b5cf6;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.9rem;">Salvar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) fecharModalNome();
    });
    document.getElementById('btn-nome-cancelar').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      fecharModalNome();
    });
    document.getElementById('btn-nome-salvar').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      salvarNomeConta();
    });
    document.getElementById('input-nome-conta').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') salvarNomeConta();
      if (e.key === 'Escape') fecharModalNome();
    });
  }

  function abrirEditarNome() {
    if (!currentUser) return;
    ensureNameModal();
    const modal = document.getElementById('modal-nome-conta');
    const input = document.getElementById('input-nome-conta');
    input.value = displayName();
    modal.hidden = false;
    modal.style.display = 'flex';
    setTimeout(function () { input.focus(); input.select(); }, 50);
  }

  async function salvarNomeConta() {
    const input = document.getElementById('input-nome-conta');
    const nome = (input && input.value || '').trim();
    if (!nome) {
      toast('Digite um nome', true);
      return;
    }
    if (nome.length > 40) {
      toast('Nome muito longo (máx. 40)', true);
      return;
    }
    customName = nome;
    try { localStorage.setItem(NOME_LOCAL_KEY, nome); } catch (e) {}
    updateAuthUI();
    fecharModalNome();
    toast('Nome atualizado');

    if (currentUser && db) {
      try {
        await db.collection('users').doc(currentUser.uid).set(
          { customName: nome, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );
      } catch (e) {
        console.warn('salvar nome', e);
        toast('Nome salvo localmente; falha na nuvem', true);
      }
    }
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
      '<button type="button" id="auth-user" title="Clique para alterar o nome" ' +
        'style="font-size:.8rem;color:#c4b5fd;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:transparent;border:none;cursor:pointer;padding:4px 6px;border-radius:6px;"></button>' +
      '<button type="button" id="btn-auth-login" class="btn-primary" style="padding:8px 14px;font-size:.82rem;display:none;white-space:nowrap;">Entrar com Google</button>' +
      '<button type="button" id="btn-auth-logout" class="btn-ghost" style="padding:8px 12px;font-size:.82rem;display:none;">Sair</button>';

    nav.appendChild(bar);

    document.getElementById('btn-auth-login').onclick = function () { loginGoogle(); };
    document.getElementById('btn-auth-logout').onclick = function () { logout(); };
    document.getElementById('auth-user').onclick = function () { abrirEditarNome(); };
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
      if (userEl) { userEl.textContent = ''; userEl.style.display = 'none'; }
      return;
    }

    if (currentUser) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = '';
      if (userEl) {
        userEl.style.display = '';
        userEl.textContent = displayName() + ' ✎';
        userEl.title = 'Clique para alterar o nome';
      }
    } else {
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
      if (userEl) { userEl.textContent = ''; userEl.style.display = 'none'; }
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
    try {
      customName = localStorage.getItem(NOME_LOCAL_KEY) || '';
    } catch (e) { customName = ''; }

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
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } catch (e) {
        console.warn('persistence', e);
      }

      try {
        const redirectResult = await auth.getRedirectResult();
        if (redirectResult && redirectResult.user) {
          currentUser = redirectResult.user;
          updateAuthUI();
          if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
          toast('Login ok: ' + (redirectResult.user.displayName || redirectResult.user.email));
        }
      } catch (e) {
        console.warn('redirect result', e);
        if (e && e.code && e.code !== 'auth/redirect-cancelled-by-user') {
          toast('Erro no login: ' + friendlyError(e), true);
        }
      }

      auth.onAuthStateChanged(async function (user) {
        currentUser = user;
        updateAuthUI();
        if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
        if (user) {
          toast('Logado: ' + displayName());
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
    if (c === 'auth/api-key-not-valid.-please-pass-a-valid-api-key' || c.indexOf('api-key') !== -1) return 'API key inválida. Atualize o firebase-config.';
    if (c === 'auth/internal-error') return 'Erro interno. Tente de novo em alguns segundos.';
    return (e.message || c || 'erro desconhecido');
  }

  async function loginGoogle() {
    if (!configOk() || !auth) {
      toast('Firebase ainda não está pronto. Atualize a página.', true);
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) {}

    toast('Abrindo login Google…');

    try {
      if (isMobile()) {
        try {
          await auth.signInWithPopup(provider);
          if (typeof window.__mobSyncAuth === 'function') window.__mobSyncAuth();
          return;
        } catch (popupErr) {
          console.warn('mobile popup', popupErr && popupErr.code, popupErr);
          toast('Redirecionando para o Google…');
          await auth.signInWithRedirect(provider);
          return;
        }
      }
      await auth.signInWithPopup(provider);
    } catch (e) {
      console.error('login', e);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request' || e.code === 'auth/popup-closed-by-user') {
        try {
          toast('Redirecionando para o Google…');
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

  function itemTime(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    return Number(obj.atualizadoEm) || Number(obj.updatedAt) || Number(obj.criadoEm) || 0;
  }

  /** Junta listas por id — não apaga itens locais nem da nuvem */
  function mergeById(localArr, cloudArr) {
    const map = {};
    (cloudArr || []).forEach(function (a) {
      if (a && a.id) map[a.id] = a;
    });
    (localArr || []).forEach(function (a) {
      if (!a || !a.id) return;
      const cur = map[a.id];
      if (!cur) {
        map[a.id] = a;
      } else {
        map[a.id] = itemTime(a) >= itemTime(cur) ? a : cur;
      }
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  function mergeFichas(localFichas, cloudFichas) {
    const out = {};
    const cloud = cloudFichas || {};
    const local = localFichas || {};
    Object.keys(cloud).forEach(function (id) { out[id] = cloud[id]; });
    Object.keys(local).forEach(function (id) {
      if (!out[id]) {
        out[id] = local[id];
      } else {
        out[id] = itemTime(local[id]) >= itemTime(out[id]) ? local[id] : out[id];
      }
    });
    return out;
  }

  async function pullFromCloud() {
    if (!currentUser || !db || syncing) return;
    syncing = true;
    try {
      const localAgentes = readLocalAgentes();
      const localCampanhas = readLocalCampanhas();
      const localFichas = collectLocalFichas();

      const ref = db.collection('users').doc(currentUser.uid);
      const snap = await ref.get();

      if (!snap.exists) {
        syncing = false;
        await pushToCloud();
        toast('Conta criada — seus personagens foram salvos na nuvem');
        return;
      }

      const data = snap.data() || {};
      if (data.customName && typeof data.customName === 'string') {
        customName = data.customName;
        try { localStorage.setItem(NOME_LOCAL_KEY, customName); } catch (e) {}
        updateAuthUI();
      }

      const cloudAgentes = Array.isArray(data.agentes) ? data.agentes : [];
      const cloudCampanhas = Array.isArray(data.campanhas) ? data.campanhas : [];
      const cloudFichas = (data.fichas && typeof data.fichas === 'object') ? data.fichas : {};

      const mergedAgentes = mergeById(localAgentes, cloudAgentes);
      const mergedCampanhas = mergeById(localCampanhas, cloudCampanhas);
      const mergedFichas = mergeFichas(localFichas, cloudFichas);

      localStorage.setItem(REGISTRO_KEY, JSON.stringify(mergedAgentes));
      localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(mergedCampanhas));
      Object.keys(mergedFichas).forEach(function (id) {
        localStorage.setItem(FICHA_PREFIX + id, JSON.stringify(mergedFichas[id]));
      });

      toast('Dados sincronizados');
      syncing = false;
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
        customName: customName || '',
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
    displayName: displayName,
    editName: abrirEditarNome,
    ready: configOk
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }
})();
