/**
 * Sincroniza personagens da campanha entre mestre e jogadores.
 * Grava agentes + agentesMeta (nome, foto, classe, NEX, owner) no Firestore.
 */
(function () {
  var KEY = 'escandinavo-campanhas-registro';
  var REG = 'escandinavo-agentes-registro';
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
  function getDb() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore();
    } catch (e) {}
    return null;
  }
  function lerCamps() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; }
  }
  function salvarCamps(lista) {
    try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch (e) {}
  }
  function lerAgentes() {
    try { return JSON.parse(localStorage.getItem(REG) || '[]') || []; } catch (e) { return []; }
  }
  function getCamp(id) {
    if (typeof window.__campGetCampanha === 'function') {
      try {
        var c = window.__campGetCampanha(id);
        if (c) return c;
      } catch (e) {}
    }
    return lerCamps().find(function (x) { return x && x.id === id; }) || null;
  }
  function atualizar(id, patch) {
    if (typeof window.__campAtualizar === 'function') {
      try { window.__campAtualizar(id, patch); return; } catch (e) {}
    }
    var lista = lerCamps();
    var i = lista.findIndex(function (x) { return x && x.id === id; });
    if (i < 0) return;
    lista[i] = Object.assign({}, lista[i], patch || {});
    salvarCamps(lista);
  }
  function campIdAtual() {
    if (typeof window.__campGetAtualId === 'function') {
      try { return window.__campGetAtualId(); } catch (e) {}
    }
    return listeningId;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function avatarHtml(foto, nome) {
    if (foto) {
      return '<div class="camp-avatar" style="background-image:url(\'' + String(foto).replace(/'/g, '%27') + '\')"></div>';
    }
    return '<div class="camp-avatar camp-avatar-fallback">' + esc((nome || '?').charAt(0).toUpperCase()) + '</div>';
  }

  function buildMetaForIds(ids, prevMeta) {
    var reg = lerAgentes();
    var meta = Object.assign({}, prevMeta || {});
    var u = uid();
    (ids || []).forEach(function (id) {
      var a = reg.find(function (x) { return x && x.id === id; });
      if (a) {
        meta[id] = Object.assign({}, meta[id] || {}, {
          nome: a.nome || (meta[id] && meta[id].nome) || 'Agente',
          foto: a.foto || (meta[id] && meta[id].foto) || '',
          classe: a.classe || (meta[id] && meta[id].classe) || '',
          nex: a.nex != null ? a.nex : ((meta[id] && meta[id].nex != null) ? meta[id].nex : 5),
          ownerUid: (meta[id] && meta[id].ownerUid) || u || null
        });
      } else if (!meta[id]) {
        meta[id] = { nome: 'Agente', foto: '', classe: '', nex: 5, ownerUid: null };
      }
    });
    return meta;
  }

  function mergeAgentes(localIds, remoteIds) {
    return Array.from(new Set([].concat(localIds || [], remoteIds || []).filter(Boolean)));
  }
  function mergeMeta(localMeta, remoteMeta) {
    var out = Object.assign({}, remoteMeta || {});
    var loc = localMeta || {};
    Object.keys(loc).forEach(function (k) {
      out[k] = Object.assign({}, out[k] || {}, loc[k] || {});
      if (loc[k]) {
        if (loc[k].nome) out[k].nome = loc[k].nome;
        if (loc[k].foto) out[k].foto = loc[k].foto;
        if (loc[k].classe) out[k].classe = loc[k].classe;
        if (loc[k].nex != null) out[k].nex = loc[k].nex;
        if (loc[k].ownerUid) out[k].ownerUid = loc[k].ownerUid;
      }
    });
    return out;
  }

  async function pushAgentes(campId) {
    var db = getDb();
    var c = getCamp(campId);
    if (!db || !c) return false;
    try {
      await db.collection('campanhas_shared').doc(campId).set({
        id: c.id,
        nome: c.nome || '',
        agentes: c.agentes || [],
        agentesMeta: c.agentesMeta || {},
        updatedAt: Date.now()
      }, { merge: true });
      console.log('[agentes-sync] push', (c.agentes || []).length, 'agentes');
      return true;
    } catch (e) {
      console.warn('[agentes-sync] push', e);
      return false;
    }
  }

  async function pullAgentes(campId) {
    var db = getDb();
    if (!db || !campId) return null;
    try {
      var snap = await db.collection('campanhas_shared').doc(campId).get();
      if (!snap.exists) return null;
      return snap.data() || {};
    } catch (e) {
      console.warn('[agentes-sync] pull', e);
      return null;
    }
  }

  function applyRemote(campId, remote) {
    if (!remote || !campId) return;
    var c = getCamp(campId);
    if (!c) return;
    var agentes = mergeAgentes(c.agentes, remote.agentes);
    var agentesMeta = mergeMeta(c.agentesMeta, remote.agentesMeta);
    var patch = { agentes: agentes, agentesMeta: agentesMeta };
    if (Array.isArray(remote.npcs) && remote.npcs.length) {
      var nmap = {};
      (c.npcs || []).forEach(function (n) { if (n && n.id) nmap[n.id] = n; });
      remote.npcs.forEach(function (n) { if (n && n.id) nmap[n.id] = Object.assign({}, nmap[n.id] || {}, n); });
      patch.npcs = Object.keys(nmap).map(function (k) { return nmap[k]; });
    }
    atualizar(campId, patch);
  }

  function podeEditar(c, agId) {
    var u = uid();
    if (!u) return false;
    if (c.ownerUid === u) return true;
    var meta = (c.agentesMeta || {})[agId];
    if (meta && meta.ownerUid === u) return true;
    try {
      return lerAgentes().some(function (a) { return a.id === agId; });
    } catch (e) { return false; }
  }

  function renderAgentes() {
    var grid = document.getElementById('camp-agentes-grid');
    var id = campIdAtual();
    var c = id ? getCamp(id) : null;
    if (!grid || !c) return;
    var reg = lerAgentes();
    var ids = c.agentes || [];
    var meta = c.agentesMeta || {};
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum personagem nesta campanha. Use “Adicionar Personagem”.</div>';
      return;
    }
    ids.forEach(function (agId) {
      var a = reg.find(function (x) { return x.id === agId; }) || {};
      var m = meta[agId] || {};
      var nome = a.nome || m.nome || 'Agente';
      var foto = a.foto || m.foto || '';
      var can = podeEditar(c, agId);
      var card = document.createElement('div');
      card.className = 'camp-ag-card' + (can ? '' : ' camp-ag-restricted');
      card.style.position = 'relative';
      var body = avatarHtml(foto, nome) + '<h3>' + esc(nome) + '</h3>';
      var classe = a.classe || m.classe || '—';
      var nex = a.nex != null ? a.nex : (m.nex != null ? m.nex : 5);
      var CLASSE = { combatente: 'Combatente', especialista: 'Especialista', ocultista: 'Ocultista' };
      var classeLabel = CLASSE[classe] || classe || '—';
      if (can) {
        body += '<div class="meta">' + esc(classeLabel) + ' · NEX ' + nex + '%</div>';
        body += '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(agId) + '">Acessar Ficha</a>';
      } else {
        body += '<div class="meta">' + esc(classeLabel) + (nex != null ? ' · NEX ' + nex + '%' : '') + '</div>';
        body += '<div class="meta camp-restricted-label" style="font-size:.75rem;color:#9797a8;font-style:italic">Personagem de outro jogador</div>';
      }
      var isOwner = (m.ownerUid && m.ownerUid === uid()) || reg.some(function (x) { return x.id === agId; });
      var isMestre = c.ownerUid && c.ownerUid === uid();
      if (isMestre || isOwner) {
        body += '<button type="button" class="rm-ag" data-id="' + esc(agId) + '" title="Remover">×</button>';
      }
      card.innerHTML = body;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-ag').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var agId = btn.dataset.id;
        var c2 = getCamp(id);
        if (!c2) return;
        var novos = (c2.agentes || []).filter(function (x) { return x !== agId; });
        var nm = Object.assign({}, c2.agentesMeta || {});
        delete nm[agId];
        atualizar(id, { agentes: novos, agentesMeta: nm });
        pushAgentes(id).then(function () { renderAgentes(); });
        renderAgentes();
      };
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
        var remote = snap.data() || {};
        applyRemote(campId, remote);
        try {
          var active = document.querySelector('.camp-tab.active');
          var which = active && active.dataset.campTab;
          if (!which || which === 'agentes') renderAgentes();
          if (which === 'npcs' && typeof window.__campRenderNpcs === 'function') window.__campRenderNpcs();
        } catch (e) {}
      }, function (err) {
        console.warn('[agentes-sync] listener', err);
      });
    } catch (e) {
      console.warn('[agentes-sync] onSnapshot', e);
    }
  }

  async function onOpen(campId) {
    if (!campId) return;
    listeningId = campId;
    var c = getCamp(campId);
    if (c && (c.agentes || []).length) {
      var meta = buildMetaForIds(c.agentes, c.agentesMeta);
      atualizar(campId, { agentesMeta: meta });
      await pushAgentes(campId);
    }
    var remote = await pullAgentes(campId);
    if (remote) applyRemote(campId, remote);
    renderAgentes();
    startListener(campId);
  }

  function bindConfirm() {
    var btn = document.getElementById('btn-confirmar-agentes');
    if (!btn || btn._agSyncBound) return;
    btn._agSyncBound = true;
    btn.addEventListener('click', function () {
      setTimeout(function () {
        var id = campIdAtual();
        if (!id) return;
        var c = getCamp(id);
        if (!c) return;
        var checks = document.querySelectorAll('#modal-agentes-lista input[type="checkbox"]');
        var ids = (c.agentes || []).slice();
        if (checks && checks.length) {
          checks.forEach(function (ch) {
            if (ch.checked && ch.value && ids.indexOf(ch.value) < 0) ids.push(ch.value);
          });
        }
        var meta = buildMetaForIds(ids, c.agentesMeta);
        atualizar(id, { agentes: ids, agentesMeta: meta });
        pushAgentes(id).then(function () { renderAgentes(); });
        renderAgentes();
      }, 80);
    }, true);
  }

  function hookAtualizar() {
    if (typeof window.__campAtualizar !== 'function') return false;
    if (window.__campAtualizar._agHooked) return true;
    var origAtualizar = window.__campAtualizar;
    window.__campAtualizar = function (id, patch) {
      origAtualizar(id, patch);
      if (patch && (patch.agentes || patch.agentesMeta || patch.npcs)) {
        if (patch.agentes) {
          var c = getCamp(id);
          var meta = buildMetaForIds(patch.agentes, (c && c.agentesMeta) || patch.agentesMeta || {});
          if (!patch.agentesMeta) {
            origAtualizar(id, { agentesMeta: meta });
          }
        }
        setTimeout(function () { pushAgentes(id); }, 50);
      }
    };
    window.__campAtualizar._agHooked = true;
    return true;
  }

  var prevEnhance = window.__campEnhanceOpen;
  window.__campEnhanceOpen = function (id) {
    if (typeof prevEnhance === 'function') {
      try { prevEnhance(id); } catch (e) {}
    }
    onOpen(id);
  };

  window.__campEnhanceAgentes = function () { renderAgentes(); };
  window.__campRenderAgentes = renderAgentes;

  function bindTabs() {
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      if (tab._agSyncBound) return;
      tab._agSyncBound = true;
      tab.addEventListener('click', function () {
        if (tab.dataset.campTab === 'agentes') {
          setTimeout(function () {
            var id = campIdAtual();
            if (id) {
              pullAgentes(id).then(function (remote) {
                if (remote) applyRemote(id, remote);
                renderAgentes();
              });
            } else renderAgentes();
          }, 40);
        }
      });
    });
  }

  function start() {
    bindConfirm();
    bindTabs();
    hookAtualizar();
    setInterval(function () {
      bindConfirm();
      hookAtualizar();
    }, 1500);
    if (!document.getElementById('camp-agentes-css')) {
      var s = document.createElement('style');
      s.id = 'camp-agentes-css';
      s.textContent =
        '.camp-avatar{width:56px;height:56px;border-radius:10px;background:#1d1d29 center/cover no-repeat;margin-bottom:8px;}' +
        '.camp-avatar-fallback{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;color:#a78bfa;background:#1d1d29;}' +
        '.camp-ag-card{position:relative;}' +
        '.rm-ag{position:absolute;top:8px;right:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;color:#9797a8;font-size:1.15rem;cursor:pointer;border-radius:6px;padding:0;z-index:2;}' +
        '.rm-ag:hover{color:#f87171;background:rgba(248,113,113,.12);}';
      document.head.appendChild(s);
    }
    console.log('[agentes-sync] ativo');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
