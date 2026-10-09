/**
 * Campanhas: sincroniza membros (nome do perfil Google) para todos,
 * melhora aba Jogadores, NPCs e layout mobile.
 */
(function () {
  var KEY = 'escandinavo-campanhas-registro';
  var pullTimer = null;
  var listeningId = null;

  function uid() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      return u && u.uid ? u.uid : null;
    } catch (e) { return null; }
  }
  function nomeUser() {
    try {
      if (window.EscandinavoAuth && EscandinavoAuth.displayName) {
        var n = EscandinavoAuth.displayName();
        if (n) return n;
      }
      var u = EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      return (u && (u.displayName || u.email)) || 'Jogador';
    } catch (e) { return 'Jogador'; }
  }
  function fotoUser() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      return (u && u.photoURL) || '';
    } catch (e) { return ''; }
  }
  function getDb() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore();
    } catch (e) {}
    return null;
  }
  function ler() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; }
  }
  function salvar(lista) {
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
  function getCamp(id) {
    if (typeof window.__campGetCampanha === 'function') {
      var c = window.__campGetCampanha(id);
      if (c) return c;
    }
    return ler().find(function (x) { return x && x.id === id; }) || null;
  }
  function atualizar(id, patch) {
    if (typeof window.__campAtualizar === 'function') {
      window.__campAtualizar(id, patch);
      return;
    }
    var lista = ler();
    var i = lista.findIndex(function (x) { return x && x.id === id; });
    if (i < 0) return;
    lista[i] = Object.assign({}, lista[i], patch || {});
    salvar(lista);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mergeMembers(localMembers, remoteMembers) {
    var map = {};
    (localMembers || []).forEach(function (m) {
      if (m && m.uid) map[m.uid] = Object.assign({}, m);
    });
    (remoteMembers || []).forEach(function (m) {
      if (!m || !m.uid) return;
      if (!map[m.uid]) {
        map[m.uid] = Object.assign({}, m);
      } else {
        var cur = map[m.uid];
        map[m.uid] = {
          uid: m.uid,
          nome: m.nome || cur.nome || 'Jogador',
          foto: m.foto || cur.foto || '',
          role: (cur.role === 'mestre' || m.role === 'mestre') ? 'mestre' : (m.role || cur.role || 'jogador'),
          joinedAt: Math.min(cur.joinedAt || Date.now(), m.joinedAt || Date.now())
        };
      }
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  async function pullShared(id) {
    var db = getDb();
    if (!db || !id) return null;
    try {
      var snap = await db.collection('campanhas_shared').doc(id).get();
      if (!snap.exists) return null;
      var remote = snap.data() || {};
      var local = getCamp(id);
      if (!local) {
        var imported = {
          id: remote.id || id,
          nome: remote.nome || 'Campanha',
          capa: remote.capa || null,
          ownerUid: remote.ownerUid || null,
          ownerName: remote.ownerName || '',
          inviteCode: remote.inviteCode || '',
          members: remote.members || [],
          agentes: remote.agentes || [],
          agentesMeta: remote.agentesMeta || {},
          npcs: remote.npcs || [],
          criadaEm: remote.criadaEm || Date.now()
        };
        var lista = ler();
        if (!lista.some(function (c) { return c.id === imported.id; })) {
          lista.push(imported);
          salvar(lista);
        }
        return imported;
      }
      var members = mergeMembers(local.members, remote.members);
      var npcs = local.npcs || [];
      if (remote.npcs && remote.npcs.length) {
        var nmap = {};
        (local.npcs || []).forEach(function (n) { if (n && n.id) nmap[n.id] = n; });
        (remote.npcs || []).forEach(function (n) { if (n && n.id) nmap[n.id] = Object.assign({}, nmap[n.id] || {}, n); });
        npcs = Object.keys(nmap).map(function (k) { return nmap[k]; });
      }
      var agentes = Array.from(new Set([].concat(local.agentes || [], remote.agentes || [])));
      var agentesMeta = Object.assign({}, remote.agentesMeta || {}, local.agentesMeta || {});
      atualizar(id, {
        members: members,
        npcs: npcs,
        agentes: agentes,
        agentesMeta: agentesMeta,
        ownerUid: local.ownerUid || remote.ownerUid || null,
        ownerName: local.ownerName || remote.ownerName || '',
        inviteCode: local.inviteCode || remote.inviteCode || '',
        nome: local.nome || remote.nome || 'Campanha'
      });
      return getCamp(id);
    } catch (e) {
      console.warn('[camp-sync] pull', e);
      return null;
    }
  }

  async function pushMembers(id) {
    var db = getDb();
    var c = getCamp(id);
    if (!db || !c) return;
    try {
      await db.collection('campanhas_shared').doc(id).set({
        id: c.id,
        nome: c.nome || '',
        ownerUid: c.ownerUid || null,
        ownerName: c.ownerName || '',
        inviteCode: c.inviteCode || '',
        members: c.members || [],
        agentes: c.agentes || [],
        agentesMeta: c.agentesMeta || {},
        npcs: c.npcs || [],
        criadaEm: c.criadaEm || Date.now(),
        updatedAt: Date.now()
      }, { merge: true });
    } catch (e) {
      console.warn('[camp-sync] push', e);
    }
  }

  function ensureSelfMember(id) {
    var u = uid();
    if (!u || !id) return;
    var c = getCamp(id);
    if (!c) return;
    var members = (c.members || []).slice();
    var idx = members.findIndex(function (m) { return m && m.uid === u; });
    var nome = nomeUser();
    var foto = fotoUser();
    var role = (c.ownerUid === u) ? 'mestre' : 'jogador';
    if (idx < 0) {
      if (!c.ownerUid) role = 'mestre';
      members.push({ uid: u, nome: nome, foto: foto, role: role, joinedAt: Date.now() });
      var patch = { members: members };
      if (!c.ownerUid) {
        patch.ownerUid = u;
        patch.ownerName = nome;
      }
      atualizar(id, patch);
      pushMembers(id);
    } else {
      var m = members[idx];
      var changed = false;
      if (nome && m.nome !== nome) { m.nome = nome; changed = true; }
      if (foto && m.foto !== foto) { m.foto = foto; changed = true; }
      if (c.ownerUid === u && m.role !== 'mestre') { m.role = 'mestre'; changed = true; }
      if (changed) {
        members[idx] = m;
        atualizar(id, { members: members });
        pushMembers(id);
      }
    }
  }

  function avatarHtml(foto, nome) {
    if (foto) {
      return '<div class="camp-avatar" style="background-image:url(\'' + String(foto).replace(/'/g, '%27') + '\')"></div>';
    }
    var ch = (nome || '?').charAt(0).toUpperCase();
    return '<div class="camp-avatar camp-avatar-fallback">' + esc(ch) + '</div>';
  }

  function renderJogadores() {
    var grid = document.getElementById('camp-jogadores-grid');
    var id = typeof window.__campGetAtualId === 'function' ? window.__campGetAtualId() : null;
    var c = id ? getCamp(id) : null;
    if (!grid) return;
    if (!c) {
      grid.innerHTML = '<div class="ag-empty">Abra uma campanha.</div>';
      return;
    }
    var jogs = (c.members || []).slice();
    jogs.sort(function (a, b) {
      if (a.role === 'mestre' && b.role !== 'mestre') return -1;
      if (b.role === 'mestre' && a.role !== 'mestre') return 1;
      return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
    });
    grid.innerHTML = '';
    if (!jogs.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum jogador ainda. Use “Convidar para a Campanha” e peça para entrarem com Google.</div>';
      return;
    }
    jogs.forEach(function (j) {
      var card = document.createElement('div');
      card.className = 'camp-ag-card camp-player-card';
      var roleLabel = j.role === 'mestre' ? 'Mestre' : 'Jogador';
      var roleClass = j.role === 'mestre' ? 'camp-role-mestre' : 'camp-role-jogador';
      card.innerHTML =
        avatarHtml(j.foto, j.nome) +
        '<h3>' + esc(j.nome || 'Jogador') + '</h3>' +
        '<div class="meta"><span class="' + roleClass + '">' + roleLabel + '</span></div>';
      grid.appendChild(card);
    });
  }

  function renderNpcsSafe() {
    if (typeof window.__campRenderNpcs === 'function') {
      try { window.__campRenderNpcs(); return; } catch (e) {}
    }
    var grid = document.getElementById('camp-npcs-grid');
    var id = typeof window.__campGetAtualId === 'function' ? window.__campGetAtualId() : null;
    var c = id ? getCamp(id) : null;
    if (!grid || !c) return;
    var npcs = c.npcs || [];
    grid.innerHTML = '';
    if (!npcs.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum NPC nesta campanha.</div>';
      return;
    }
    npcs.forEach(function (n) {
      var card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.innerHTML =
        avatarHtml(n.foto, n.nome) +
        '<h3>' + esc(n.nome || 'NPC') + '</h3>' +
        '<div class="meta">' + esc(n.tipo || n.classe || 'NPC') + '</div>' +
        (n.fichaId
          ? '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(n.fichaId) + '">Acessar Ficha</a>'
          : '');
      grid.appendChild(card);
    });
  }

  function ensureCss() {
    if (document.getElementById('camp-sync-css')) return;
    var s = document.createElement('style');
    s.id = 'camp-sync-css';
    s.textContent =
      '.camp-avatar{width:56px;height:56px;border-radius:10px;background:#1d1d29 center/cover no-repeat;margin-bottom:8px;flex-shrink:0;}' +
      '.camp-avatar-fallback{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;color:#a78bfa;background:#1d1d29;}' +
      '.camp-player-card h3{margin:0;font-size:1rem;word-break:break-word;}' +
      '.camp-role-mestre{color:#c4b5fd;font-weight:600;}' +
      '.camp-role-jogador{color:#9797a8;}' +
      '.camp-detail-actions{display:flex;flex-wrap:wrap;gap:8px;}' +
      '.camp-detail-actions .btn-outline{flex:1 1 auto;min-width:140px;text-align:center;}' +
      '.camp-ag-card{position:relative;}' +
      '.rm-ag{position:absolute;top:8px;right:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent!important;border:none!important;color:#9797a8!important;font-size:1.15rem;line-height:1;cursor:pointer;border-radius:6px;padding:0;z-index:2;}' +
      '.rm-ag:hover{color:#f87171!important;background:rgba(248,113,113,.12)!important;}' +
      '@media (max-width:720px){' +
        '.camp-detail-actions{flex-direction:column;}' +
        '.camp-detail-actions .btn-outline{width:100%;min-width:0;}' +
        '.camp-detail-header{flex-direction:row;gap:12px;}' +
        '.camp-detail-header .cover{width:64px;height:64px;min-width:64px;min-height:64px;}' +
        '.camp-detail-header h1{font-size:1.2rem;}' +
        '.camp-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;}' +
        '.camp-tab{padding:10px 12px;white-space:nowrap;}' +
        '.camp-agentes-grid{grid-template-columns:1fr;}' +
      '}';
    document.head.appendChild(s);
  }

  function bindTabs() {
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      if (tab._syncBound) return;
      tab._syncBound = true;
      tab.addEventListener('click', function () {
        var which = tab.dataset.campTab;
        setTimeout(function () {
          if (which === 'jogadores') renderJogadores();
          if (which === 'npcs') renderNpcsSafe();
        }, 30);
      });
    });
  }

  async function onOpen(id) {
    if (!id) return;
    ensureCss();
    bindTabs();
    ensureSelfMember(id);
    await pullShared(id);
    ensureSelfMember(id);
    renderJogadores();
    renderNpcsSafe();
    if (pullTimer) clearInterval(pullTimer);
    listeningId = id;
    pullTimer = setInterval(function () {
      if (listeningId !== id) return;
      var detail = document.getElementById('view-camp-detail');
      if (!detail || detail.hidden) return;
      pullShared(id).then(function () {
        var active = document.querySelector('.camp-tab.active');
        var which = active && active.dataset.campTab;
        if (which === 'jogadores') renderJogadores();
        if (which === 'npcs') renderNpcsSafe();
      });
    }, 8000);
  }

  var prevEnhance = window.__campEnhanceOpen;
  window.__campEnhanceOpen = function (id) {
    if (typeof prevEnhance === 'function') {
      try { prevEnhance(id); } catch (e) {}
    }
    onOpen(id);
  };

  window.__campRenderJogadores = renderJogadores;
  window.__campPullShared = pullShared;

  function wrapJoin() {
    if (!window.CampanhasAPI || !window.CampanhasAPI.processarConvite) return;
    if (window.CampanhasAPI._syncWrapped) return;
    var orig = window.CampanhasAPI.processarConvite;
    window.CampanhasAPI.processarConvite = async function (code) {
      await orig(code);
      try {
        var lista = ler();
        var c = lista.find(function (x) { return x && x.inviteCode === code; });
        if (c) {
          ensureSelfMember(c.id);
          await pullShared(c.id);
          await pushMembers(c.id);
        }
      } catch (e) {}
    };
    window.CampanhasAPI._syncWrapped = true;
  }

  function start() {
    ensureCss();
    bindTabs();
    wrapJoin();
    setTimeout(wrapJoin, 800);
    setTimeout(wrapJoin, 2000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  console.log('[camp-sync] members + jogadores + npcs fix ativo');
})();
