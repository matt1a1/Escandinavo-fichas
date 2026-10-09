/** agentes-sync v2: merge seguro */
(function () {
  var KEY = 'escandinavo-campanhas-registro', REG = 'escandinavo-agentes-registro';
  var unsub = null, listeningId = null, pushing = false;
  function uid() {
    try { var u = window.EscandinavoAuth && EscandinavoAuth.user && EscandinavoAuth.user(); if (u && u.uid) return u.uid; } catch (e) {}
    try { var fu = firebase.auth().currentUser; return fu && fu.uid ? fu.uid : null; } catch (e) {}
    return null;
  }
  function db() { try { if (window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore(); } catch (e) {} return null; }
  function ler() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } }
  function salvar(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function reg() { try { return JSON.parse(localStorage.getItem(REG) || '[]') || []; } catch (e) { return []; } }
  function getCamp(id) {
    try { if (typeof window.__campGetCampanha === 'function') { var c = window.__campGetCampanha(id); if (c) return c; } } catch (e) {}
    return ler().find(function (x) { return x && x.id === id; }) || null;
  }
  function setLocal(id, patch) {
    var lista = ler(), i = lista.findIndex(function (x) { return x && x.id === id; });
    if (i < 0) return;
    lista[i] = Object.assign({}, lista[i], patch || {});
    salvar(lista);
  }
  function campId() {
    try { if (typeof window.__campGetAtualId === 'function') { var id = window.__campGetAtualId(); if (id) return id; } } catch (e) {}
    return listeningId;
  }
  function mergeIds(a, b) { return Array.from(new Set([].concat(a || [], b || []).filter(Boolean))); }
  function mergeMeta(L, R) {
    var out = Object.assign({}, R || {}), loc = L || {};
    Object.keys(loc).forEach(function (k) {
      var r = out[k] || {}, l = loc[k] || {};
      out[k] = { nome: l.nome || r.nome || 'Agente', foto: l.foto || r.foto || '', classe: l.classe || r.classe || '',
        nex: l.nex != null ? l.nex : (r.nex != null ? r.nex : 5), ownerUid: l.ownerUid || r.ownerUid || null };
    });
    return out;
  }
  function metaMeus(ids, prev) {
    var r = reg(), meta = Object.assign({}, prev || {}), u = uid();
    (ids || []).forEach(function (id) {
      var a = r.find(function (x) { return x && x.id === id; });
      if (!a) return;
      meta[id] = { nome: a.nome || 'Agente', foto: a.foto || '', classe: a.classe || '',
        nex: a.nex != null ? a.nex : 5, ownerUid: (meta[id] && meta[id].ownerUid) || u || null };
    });
    return meta;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
  }
  function av(foto, nome) {
    if (foto) return '<div class="camp-avatar" style="background-image:url(\'' + String(foto).replace(/'/g,'%27') + '\')"></div>';
    return '<div class="camp-avatar camp-avatar-fallback">' + esc((nome||'?').charAt(0).toUpperCase()) + '</div>';
  }
  async function mergePush(campId, extraIds, extraMeta) {
    var fdb = db(); if (!fdb || !campId) return false;
    if (pushing) return false;
    pushing = true;
    try {
      var local = getCamp(campId) || {};
      var localIds = mergeIds(local.agentes, extraIds);
      var localMeta = mergeMeta(metaMeus(localIds, local.agentesMeta), extraMeta || {});
      var ref = fdb.collection('campanhas_shared').doc(campId);
      await fdb.runTransaction(async function (tx) {
        var snap = await tx.get(ref);
        var remote = snap.exists ? (snap.data() || {}) : {};
        var agentes = mergeIds(remote.agentes, localIds);
        var agentesMeta = mergeMeta(mergeMeta(localMeta, remote.agentesMeta), extraMeta || {});
        var payload = { agentes: agentes, agentesMeta: agentesMeta, updatedAt: Date.now(), __forceAgentes: true };
        if (!snap.exists) {
          payload.id = campId; payload.nome = local.nome || 'Campanha';
          payload.ownerUid = local.ownerUid || uid() || null;
          payload.members = local.members || []; payload.criadaEm = local.criadaEm || Date.now();
        }
        tx.set(ref, payload, { merge: true });
        setLocal(campId, { agentes: agentes, agentesMeta: agentesMeta });
      });
      console.log('[agentes-sync] mergePush ok');
      return true;
    } catch (e) {
      console.warn('[agentes-sync] tx', e);
      try {
        var ref2 = fdb.collection('campanhas_shared').doc(campId);
        var snap2 = await ref2.get();
        var remote2 = snap2.exists ? (snap2.data() || {}) : {};
        var local2 = getCamp(campId) || {};
        var agentes2 = mergeIds(mergeIds(remote2.agentes, local2.agentes), extraIds);
        var meta2 = mergeMeta(mergeMeta(metaMeus(agentes2, local2.agentesMeta), remote2.agentesMeta), extraMeta || {});
        await ref2.set({ agentes: agentes2, agentesMeta: meta2, updatedAt: Date.now(), __forceAgentes: true }, { merge: true });
        setLocal(campId, { agentes: agentes2, agentesMeta: meta2 });
        return true;
      } catch (e2) { console.warn('[agentes-sync] fb', e2); return false; }
    } finally { pushing = false; }
  }
  async function pull(campId) {
    var fdb = db(); if (!fdb || !campId) return;
    try {
      var snap = await fdb.collection('campanhas_shared').doc(campId).get();
      if (!snap.exists) return;
      var remote = snap.data() || {}, local = getCamp(campId) || {};
      setLocal(campId, {
        agentes: mergeIds(local.agentes, remote.agentes),
        agentesMeta: mergeMeta(metaMeus(mergeIds(local.agentes, remote.agentes), local.agentesMeta), remote.agentesMeta)
      });
    } catch (e) { console.warn('[agentes-sync] pull', e); }
  }
  function render() {
    var grid = document.getElementById('camp-agentes-grid');
    var id = campId(), c = id ? getCamp(id) : null;
    if (!grid || !c) return;
    var r = reg(), ids = c.agentes || [], meta = c.agentesMeta || {};
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum personagem nesta campanha. Use “Adicionar Personagem”.</div>';
      return;
    }
    var CL = { combatente: 'Combatente', especialista: 'Especialista', ocultista: 'Ocultista' };
    ids.forEach(function (agId) {
      var a = r.find(function (x) { return x.id === agId; }) || {};
      var m = meta[agId] || {};
      var nome = a.nome || m.nome || 'Agente', foto = a.foto || m.foto || '', u = uid();
      var can = (c.ownerUid === u) || (m.ownerUid === u) || r.some(function (x) { return x.id === agId; });
      var classe = CL[a.classe || m.classe] || a.classe || m.classe || '—';
      var nex = a.nex != null ? a.nex : (m.nex != null ? m.nex : 5);
      var card = document.createElement('div');
      card.className = 'camp-ag-card'; card.style.position = 'relative';
      var body = av(foto, nome) + '<h3>' + esc(nome) + '</h3>';
      body += '<div class="meta">' + esc(classe) + ' · NEX ' + nex + '%</div>';
      if (can) body += '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(agId) + '">Acessar Ficha</a>';
      else body += '<div class="meta" style="font-size:.75rem;color:#9797a8;font-style:italic">Personagem de outro jogador</div>';
      if (can || c.ownerUid === u) body += '<button type="button" class="rm-ag" data-id="' + esc(agId) + '" title="Remover">×</button>';
      card.innerHTML = body;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-ag').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        var agId = btn.dataset.id, c2 = getCamp(id); if (!c2) return;
        var novos = (c2.agentes || []).filter(function (x) { return x !== agId; });
        var nm = Object.assign({}, c2.agentesMeta || {}); delete nm[agId];
        setLocal(id, { agentes: novos, agentesMeta: nm });
        var fdb = db();
        if (fdb) {
          fdb.collection('campanhas_shared').doc(id).get().then(function (snap) {
            if (!snap.exists) return;
            var d = snap.data() || {};
            var ag = (d.agentes || []).filter(function (x) { return x !== agId; });
            var mt = Object.assign({}, d.agentesMeta || {}); delete mt[agId];
            return snap.ref.set({ agentes: ag, agentesMeta: mt, updatedAt: Date.now(), __forceAgentes: true }, { merge: true });
          }).then(function () { return pull(id); }).then(function () { render(); });
        }
        render();
      };
    });
  }
  function listen(campId) {
    var fdb = db(); if (!fdb || !campId) return;
    if (unsub) try { unsub(); } catch (e) {}
    unsub = null; listeningId = campId;
    try {
      unsub = fdb.collection('campanhas_shared').doc(campId).onSnapshot(function (snap) {
        if (!snap.exists || pushing) return;
        var remote = snap.data() || {}, local = getCamp(campId) || {};
        setLocal(campId, {
          agentes: mergeIds(local.agentes, remote.agentes),
          agentesMeta: mergeMeta(local.agentesMeta, remote.agentesMeta)
        });
        try {
          var active = document.querySelector('.camp-tab.active');
          if (!active || active.dataset.campTab === 'agentes') render();
        } catch (e) {}
      });
    } catch (e) {}
  }
  async function onOpen(campId) {
    if (!campId) return;
    listeningId = campId;
    await pull(campId);
    render();
    var c = getCamp(campId);
    if (c) {
      var meus = (c.agentes || []).filter(function (id) { return reg().some(function (a) { return a.id === id; }); });
      if (meus.length) {
        await mergePush(campId, meus, metaMeus(meus, c.agentesMeta));
        await pull(campId);
        render();
      }
    }
    listen(campId);
  }
  function bindConfirm() {
    var btn = document.getElementById('btn-confirmar-agentes');
    if (!btn || btn._agV2) return;
    btn._agV2 = true;
    btn.addEventListener('click', function () {
      var checked = [];
      document.querySelectorAll('#modal-agentes-lista input[type="checkbox"]').forEach(function (ch) {
        if (ch.checked && ch.value) checked.push(ch.value);
      });
      setTimeout(async function () {
        var id = campId(); if (!id) return;
        var c = getCamp(id) || {};
        var ids = mergeIds(c.agentes, checked);
        var extra = metaMeus(ids, c.agentesMeta);
        setLocal(id, { agentes: ids, agentesMeta: mergeMeta(c.agentesMeta, extra) });
        await mergePush(id, ids, extra);
        await pull(id);
        render();
      }, 150);
    }, true);
  }
  var prev = window.__campEnhanceOpen;
  window.__campEnhanceOpen = function (id) {
    if (typeof prev === 'function') try { prev(id); } catch (e) {}
    onOpen(id);
  };
  window.__campRenderAgentes = render;
  window.__campEnhanceAgentes = render;
  function start() {
    bindConfirm();
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      if (tab._agV2) return; tab._agV2 = true;
      tab.addEventListener('click', function () {
        if (tab.dataset.campTab === 'agentes') {
          setTimeout(function () {
            var id = campId();
            if (id) pull(id).then(function () { render(); });
            else render();
          }, 40);
        }
      });
    });
    var add = document.getElementById('btn-camp-add-agentes');
    if (add && !add._agV2) {
      add._agV2 = true;
      add.addEventListener('click', function () { setTimeout(bindConfirm, 200); });
    }
    setInterval(bindConfirm, 1500);
    console.log('[agentes-sync] v2 merge-safe');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
