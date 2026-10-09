/**
 * Sincronização confiável de membros da campanha.
 * - Entrar no convite grava o jogador no Firestore (transação)
 * - Mestre e jogadores veem a lista em tempo real na aba Jogadores
 */
(function () {
  var KEY = 'escandinavo-campanhas-registro';
  var unsub = null;
  var listeningId = null;

  function uid() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      if (u && u.uid) return u.uid;
    } catch (e) {}
    try {
      var fu = firebase.auth().currentUser;
      return fu && fu.uid ? fu.uid : null;
    } catch (e) {}
    return null;
  }
  function nomeUser() {
    try {
      if (window.EscandinavoAuth && EscandinavoAuth.displayName) {
        var n = EscandinavoAuth.displayName();
        if (n) return n;
      }
    } catch (e) {}
    try {
      var u = EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      if (u && (u.displayName || u.email)) return u.displayName || u.email;
    } catch (e) {}
    try {
      var fu = firebase.auth().currentUser;
      if (fu) return fu.displayName || fu.email || 'Jogador';
    } catch (e) {}
    return 'Jogador';
  }
  function fotoUser() {
    try {
      var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user();
      if (u && u.photoURL) return u.photoURL;
    } catch (e) {}
    try {
      var fu = firebase.auth().currentUser;
      if (fu && fu.photoURL) return fu.photoURL;
    } catch (e) {}
    return '';
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
    try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch (e) {}
  }
  function getCamp(id) {
    if (typeof window.__campGetCampanha === 'function') {
      try {
        var c = window.__campGetCampanha(id);
        if (c) return c;
      } catch (e) {}
    }
    return ler().find(function (x) { return x && x.id === id; }) || null;
  }
  function atualizar(id, patch) {
    if (typeof window.__campAtualizar === 'function') {
      try { window.__campAtualizar(id, patch); return; } catch (e) {}
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
  function mergeMembers(a, b) {
    var map = {};
    function add(list) {
      (list || []).forEach(function (m) {
        if (!m || !m.uid) return;
        var cur = map[m.uid];
        if (!cur) {
          map[m.uid] = Object.assign({}, m);
        } else {
          map[m.uid] = {
            uid: m.uid,
            nome: m.nome || cur.nome || 'Jogador',
            foto: m.foto || cur.foto || '',
            role: (cur.role === 'mestre' || m.role === 'mestre') ? 'mestre' : (m.role || cur.role || 'jogador'),
            joinedAt: Math.min(cur.joinedAt || Date.now(), m.joinedAt || Date.now())
          };
        }
      });
    }
    add(a);
    add(b);
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  async function addMemberRemote(campId, member) {
    var db = getDb();
    if (!db || !campId || !member || !member.uid) return false;
    try {
      var ref = db.collection('campanhas_shared').doc(campId);
      await db.runTransaction(async function (tx) {
        var snap = await tx.get(ref);
        var data = snap.exists ? (snap.data() || {}) : {};
        var members = Array.isArray(data.members) ? data.members.slice() : [];
        var idx = members.findIndex(function (m) { return m && m.uid === member.uid; });
        if (idx < 0) {
          members.push(member);
        } else {
          members[idx] = Object.assign({}, members[idx], {
            nome: member.nome || members[idx].nome,
            foto: member.foto || members[idx].foto,
            role: members[idx].role === 'mestre' ? 'mestre' : (member.role || members[idx].role || 'jogador')
          });
        }
        var payload = { members: members, updatedAt: Date.now() };
        if (!snap.exists) payload.id = campId;
        tx.set(ref, payload, { merge: true });
      });
      try {
        await db.collection('campanhas_shared').doc(campId)
          .collection('membros').doc(member.uid)
          .set(Object.assign({}, member, { updatedAt: Date.now() }), { merge: true });
      } catch (e2) {}
      console.log('[members-sync] membro gravado:', member.nome, member.uid);
      return true;
    } catch (e) {
      console.warn('[members-sync] addMemberRemote', e);
      try {
        var ref2 = db.collection('campanhas_shared').doc(campId);
        var snap2 = await ref2.get();
        var data2 = snap2.exists ? (snap2.data() || {}) : {};
        var members2 = Array.isArray(data2.members) ? data2.members.slice() : [];
        if (!members2.some(function (m) { return m && m.uid === member.uid; })) {
          members2.push(member);
        }
        await ref2.set({ members: members2, updatedAt: Date.now() }, { merge: true });
        return true;
      } catch (e3) {
        console.warn('[members-sync] fallback', e3);
        return false;
      }
    }
  }

  async function pullMembers(campId) {
    var db = getDb();
    if (!db || !campId) return [];
    var remoteMembers = [];
    try {
      var snap = await db.collection('campanhas_shared').doc(campId).get();
      if (snap.exists) {
        var d = snap.data() || {};
        remoteMembers = Array.isArray(d.members) ? d.members : [];
      }
    } catch (e) {
      console.warn('[members-sync] pull doc', e);
    }
    try {
      var sub = await db.collection('campanhas_shared').doc(campId).collection('membros').get();
      sub.forEach(function (doc) {
        var m = doc.data();
        if (m && (m.uid || doc.id)) {
          remoteMembers.push({
            uid: m.uid || doc.id,
            nome: m.nome || 'Jogador',
            foto: m.foto || '',
            role: m.role || 'jogador',
            joinedAt: m.joinedAt || Date.now()
          });
        }
      });
    } catch (e) {}
    return remoteMembers;
  }

  function applyMembersLocal(campId, remoteMembers) {
    var c = getCamp(campId);
    if (!c) return;
    var merged = mergeMembers(c.members, remoteMembers);
    atualizar(campId, { members: merged });
    return merged;
  }

  function renderJogadores() {
    var grid = document.getElementById('camp-jogadores-grid');
    var id = typeof window.__campGetAtualId === 'function' ? window.__campGetAtualId() : listeningId;
    if (!grid || !id) return;
    var c = getCamp(id);
    if (!c) return;
    var jogs = (c.members || []).slice();
    jogs.sort(function (a, b) {
      if (a.role === 'mestre' && b.role !== 'mestre') return -1;
      if (b.role === 'mestre' && a.role !== 'mestre') return 1;
      return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
    });
    grid.innerHTML = '';
    if (!jogs.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum jogador ainda. Peça para entrarem pelo link de convite (com Google).</div>';
      return;
    }
    jogs.forEach(function (j) {
      var card = document.createElement('div');
      card.className = 'camp-ag-card camp-player-card';
      var nome = j.nome || 'Jogador';
      var roleLabel = j.role === 'mestre' ? 'Mestre' : 'Jogador';
      var roleClass = j.role === 'mestre' ? 'camp-role-mestre' : 'camp-role-jogador';
      var av = j.foto
        ? '<div class="camp-avatar" style="background-image:url(\'' + String(j.foto).replace(/'/g, '%27') + '\')"></div>'
        : '<div class="camp-avatar camp-avatar-fallback">' + esc((nome || '?').charAt(0).toUpperCase()) + '</div>';
      card.innerHTML = av + '<h3>' + esc(nome) + '</h3><div class="meta"><span class="' + roleClass + '">' + roleLabel + '</span></div>';
      grid.appendChild(card);
    });
  }

  function startListener(campId) {
    var db = getDb();
    if (!db || !campId) return;
    if (unsub) {
      try { unsub(); } catch (e) {}
      unsub = null;
    }
    listeningId = campId;
    try {
      unsub = db.collection('campanhas_shared').doc(campId).onSnapshot(function (snap) {
        if (!snap.exists) return;
        var data = snap.data() || {};
        var remoteMembers = Array.isArray(data.members) ? data.members : [];
        applyMembersLocal(campId, remoteMembers);
        try {
          var active = document.querySelector('.camp-tab.active');
          if (active && active.dataset.campTab === 'jogadores') renderJogadores();
          else if (document.getElementById('camp-tab-jogadores') && !document.getElementById('camp-tab-jogadores').hidden) {
            renderJogadores();
          }
        } catch (e) {}
      }, function (err) {
        console.warn('[members-sync] listener', err);
      });
    } catch (e) {
      console.warn('[members-sync] onSnapshot', e);
    }
  }

  async function onOpen(campId) {
    if (!campId) return;
    listeningId = campId;
    var u = uid();
    if (u) {
      var member = {
        uid: u,
        nome: nomeUser(),
        foto: fotoUser(),
        role: 'jogador',
        joinedAt: Date.now()
      };
      var c = getCamp(campId);
      if (c && c.ownerUid === u) member.role = 'mestre';
      if (c) {
        var members = mergeMembers(c.members, [member]);
        if (c.ownerUid === u) {
          members = members.map(function (m) {
            return m.uid === u ? Object.assign({}, m, { role: 'mestre' }) : m;
          });
        }
        atualizar(campId, { members: members });
      }
      await addMemberRemote(campId, member);
    }
    var remote = await pullMembers(campId);
    applyMembersLocal(campId, remote);
    renderJogadores();
    startListener(campId);
  }

  var prevEnhance = window.__campEnhanceOpen;
  window.__campEnhanceOpen = function (id) {
    if (typeof prevEnhance === 'function') {
      try { prevEnhance(id); } catch (e) {}
    }
    onOpen(id);
  };

  function wrapJoin() {
    if (!window.CampanhasAPI || !window.CampanhasAPI.processarConvite) return false;
    if (window.CampanhasAPI._membersSyncWrapped) return true;
    var orig = window.CampanhasAPI.processarConvite;
    window.CampanhasAPI.processarConvite = async function (code) {
      await orig(code);
      try {
        var lista = ler();
        var c = lista.find(function (x) { return x && x.inviteCode === code; });
        if (!c) {
          var db = getDb();
          if (db && code) {
            try {
              var inv = await db.collection('campanha_invites').doc(code).get();
              if (inv.exists) {
                var campId = inv.data().campId;
                c = lista.find(function (x) { return x && x.id === campId; }) || getCamp(campId);
                if (!c) {
                  var snap = await db.collection('campanhas_shared').doc(campId).get();
                  if (snap.exists) {
                    var d = snap.data() || {};
                    c = {
                      id: campId,
                      nome: d.nome || 'Campanha',
                      ownerUid: d.ownerUid || null,
                      ownerName: d.ownerName || '',
                      inviteCode: code,
                      members: d.members || [],
                      agentes: d.agentes || [],
                      agentesMeta: d.agentesMeta || {},
                      npcs: d.npcs || [],
                      criadaEm: d.criadaEm || Date.now()
                    };
                    lista.push(c);
                    salvar(lista);
                  }
                }
              }
            } catch (e) {}
          }
        }
        if (!c) {
          lista = ler();
          lista.sort(function (a, b) { return (b.criadaEm || 0) - (a.criadaEm || 0); });
          c = lista[0];
        }
        var u = uid();
        if (!c || !u) return;
        var member = {
          uid: u,
          nome: nomeUser(),
          foto: fotoUser(),
          role: c.ownerUid === u ? 'mestre' : 'jogador',
          joinedAt: Date.now()
        };
        var members = mergeMembers(c.members, [member]);
        atualizar(c.id, { members: members, inviteCode: c.inviteCode || code });
        var ok = await addMemberRemote(c.id, member);
        console.log('[members-sync] join ok=', ok, member.nome);
        var remote = await pullMembers(c.id);
        applyMembersLocal(c.id, remote);
        if (typeof window.__campAbrir === 'function') window.__campAbrir(c.id);
        else onOpen(c.id);
      } catch (e) {
        console.warn('[members-sync] wrapJoin', e);
      }
    };
    window.CampanhasAPI._membersSyncWrapped = true;
    return true;
  }

  function bindTabs() {
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      if (tab._memBound) return;
      tab._memBound = true;
      tab.addEventListener('click', function () {
        if (tab.dataset.campTab === 'jogadores') {
          setTimeout(function () {
            var id = typeof window.__campGetAtualId === 'function' ? window.__campGetAtualId() : listeningId;
            if (id) {
              pullMembers(id).then(function (remote) {
                applyMembersLocal(id, remote);
                renderJogadores();
              });
            } else {
              renderJogadores();
            }
          }, 40);
        }
      });
    });
  }

  function start() {
    bindTabs();
    if (!wrapJoin()) {
      var t = 0, iv = setInterval(function () {
        if (wrapJoin() || ++t > 50) clearInterval(iv);
      }, 200);
    }
    if (!document.getElementById('camp-members-css')) {
      var s = document.createElement('style');
      s.id = 'camp-members-css';
      s.textContent = '.camp-avatar{width:56px;height:56px;border-radius:10px;background:#1d1d29 center/cover no-repeat;margin-bottom:8px;}.camp-avatar-fallback{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;color:#a78bfa;background:#1d1d29;}.camp-role-mestre{color:#c4b5fd;font-weight:600;}.camp-role-jogador{color:#9797a8;}';
      document.head.appendChild(s);
    }
    console.log('[members-sync] ativo');
  }

  window.__campRenderJogadores = renderJogadores;
  window.__campPullMembers = pullMembers;
  window.__campAddMemberRemote = addMemberRemote;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
