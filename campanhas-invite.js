// Convites, papéis (Mestre/Jogador), NPCs na campanha e visão restrita
(function () {
  function uid() {
    try {
      var u = window.EscandinavoAuth && window.EscandinavoAuth.user && window.EscandinavoAuth.user();
      return u && u.uid ? u.uid : null;
    } catch (e) { return null; }
  }
  function nomeUser() {
    try {
      return (window.EscandinavoAuth && window.EscandinavoAuth.displayName && window.EscandinavoAuth.displayName()) || '';
    } catch (e) { return ''; }
  }
  function fotoUser() {
    try {
      var u = window.EscandinavoAuth && window.EscandinavoAuth.user && window.EscandinavoAuth.user();
      return (u && u.photoURL) || '';
    } catch (e) { return ''; }
  }
  function toast(msg, isErr) {
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
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 4200);
  }
  function genCode() {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', o = '';
    for (var i = 0; i < 8; i++) o += a[Math.floor(Math.random() * a.length)];
    return o;
  }
  function siteBase() {
    try {
      if (location.protocol.indexOf('http') === 0) {
        return location.origin + location.pathname.replace(/[^/]*$/, '');
      }
    } catch (e) {}
    return 'https://matt1a1.github.io/Escandinavo-fichas/';
  }
  function inviteUrl(code) {
    return siteBase().replace(/\/?$/, '/') + '?convite=' + encodeURIComponent(code);
  }
  function getDb() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore();
    } catch (e) {}
    return null;
  }
  function getCamp(id) {
    return typeof window.__campGetCampanha === 'function' ? window.__campGetCampanha(id) : null;
  }
  function atualizar(id, patch) {
    if (typeof window.__campAtualizar === 'function') window.__campAtualizar(id, patch);
  }
  function isMestre(c) {
    if (!c) return false;
    var u = uid();
    if (!u) return !c.ownerUid;
    return c.ownerUid === u || (c.members || []).some(function (m) { return m.uid === u && m.role === 'mestre'; });
  }
  function isMembro(c) {
    if (!c) return false;
    var u = uid();
    if (!u) return isMestre(c);
    if (c.ownerUid === u) return true;
    return (c.members || []).some(function (m) { return m.uid === u; });
  }
  function podeEditarAgente(c, agId) {
    if (isMestre(c)) return true;
    var u = uid();
    if (!u) return false;
    var meta = (c.agentesMeta || {})[agId];
    if (meta && meta.ownerUid === u) return true;
    try {
      var reg = JSON.parse(localStorage.getItem('escandinavo-agentes-registro') || '[]');
      return reg.some(function (a) { return a.id === agId; });
    } catch (e) { return false; }
  }
  function esc(s) {
    return typeof window.__campEscape === 'function' ? window.__campEscape(s) : String(s || '');
  }
  function avatarHtml(foto, nome) {
    if (foto) return '<div class="camp-avatar" style="background-image:url(\'' + foto + '\')"></div>';
    return '<div class="camp-avatar camp-avatar-fallback">' + esc((nome || '?').charAt(0).toUpperCase()) + '</div>';
  }

  async function syncShared(c) {
    var db = getDb();
    if (!db || !c || !c.id) return;
    try {
      await db.collection('campanhas_shared').doc(c.id).set({
        id: c.id, nome: c.nome || '', capa: c.capa || null,
        ownerUid: c.ownerUid || null, ownerName: c.ownerName || '',
        inviteCode: c.inviteCode || '', members: c.members || [],
        agentes: c.agentes || [], agentesMeta: c.agentesMeta || {},
        npcs: c.npcs || [], criadaEm: c.criadaEm || Date.now(), updatedAt: Date.now()
      }, { merge: true });
      if (c.inviteCode) {
        await db.collection('campanha_invites').doc(c.inviteCode).set({
          campId: c.id, nome: c.nome || '', ownerName: c.ownerName || '', updatedAt: Date.now()
        }, { merge: true });
      }
    } catch (e) { console.warn('syncShared', e); }
  }
  async function fetchByInvite(code) {
    var db = getDb();
    if (!db || !code) return null;
    try {
      var inv = await db.collection('campanha_invites').doc(code).get();
      if (!inv.exists) return null;
      var snap = await db.collection('campanhas_shared').doc(inv.data().campId).get();
      return snap.exists ? snap.data() : null;
    } catch (e) { console.warn(e); return null; }
  }

  function ensureCss() {
    if (document.getElementById('camp-invite-css')) return;
    var s = document.createElement('style');
    s.id = 'camp-invite-css';
    s.textContent =
      '.camp-avatar{width:56px;height:56px;border-radius:10px;background:#1d1d29 center/cover no-repeat;margin-bottom:8px;}' +
      '.camp-avatar-fallback{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;color:#a78bfa;}' +
      '.camp-ag-restricted{opacity:.92;}' +
      '.camp-restricted-label{font-size:.75rem;color:#9797a8;font-style:italic;}' +
      '#btn-camp-convidar{border-color:#8b5cf6;color:#c4b5fd;}' +
      '#btn-camp-convidar:hover{background:rgba(139,92,246,.15);}';
    document.head.appendChild(s);
  }

  function ensureModalConvite() {
    if (document.getElementById('modal-convite-camp')) return;
    var div = document.createElement('div');
    div.id = 'modal-convite-camp';
    div.className = 'wizard-overlay';
    div.hidden = true;
    div.innerHTML =
      '<div class="modal-box" style="max-width:480px">' +
        '<div class="wizard-top"><span class="brand">Convidar para a Campanha</span>' +
          '<button type="button" class="btn-ghost" id="modal-convite-close">Fechar</button></div>' +
        '<div class="modal-box-body">' +
          '<p style="color:var(--ag-text-dim);margin:0 0 12px;font-size:.9rem">' +
            'Compartilhe este link. Quem entrar com Google pode vincular a própria ficha.</p>' +
          '<label style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-bottom:6px">Link de convite</label>' +
          '<div style="display:flex;gap:8px;margin-bottom:14px">' +
            '<input type="text" id="input-convite-link" readonly style="flex:1;padding:11px 12px;border-radius:8px;border:1px solid var(--ag-border);background:var(--ag-panel);color:var(--ag-text);font-size:.85rem;" />' +
            '<button type="button" class="btn-primary" id="btn-copiar-convite">Copiar</button></div>' +
          '<div style="font-size:.78rem;color:var(--ag-text-dim)">Código: <b id="label-convite-code" style="color:var(--ag-text)"></b></div>' +
        '</div></div>';
    document.body.appendChild(div);
    document.getElementById('modal-convite-close').onclick = function () { div.hidden = true; };
    div.onclick = function (e) { if (e.target === div) div.hidden = true; };
    document.getElementById('btn-copiar-convite').onclick = function () {
      var input = document.getElementById('input-convite-link');
      input.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      if (!ok && navigator.clipboard) {
        navigator.clipboard.writeText(input.value).then(function () { toast('Link copiado!'); });
        return;
      }
      toast(ok ? 'Link copiado!' : 'Copie manualmente (Ctrl+C)', !ok);
    };
  }

  function ensureModalNpc() {
    if (document.getElementById('modal-add-npc-camp')) return;
    var div = document.createElement('div');
    div.id = 'modal-add-npc-camp';
    div.className = 'wizard-overlay';
    div.hidden = true;
    div.innerHTML =
      '<div class="modal-box" style="max-width:480px">' +
        '<div class="wizard-top"><span class="brand">Adicionar NPC</span>' +
          '<button type="button" class="btn-ghost" id="modal-npc-close">Fechar</button></div>' +
        '<div class="modal-box-body">' +
          '<p style="color:var(--ag-text-dim);margin:0 0 12px;font-size:.9rem">Só o Mestre adiciona NPCs. Jogadores veem só nome e foto.</p>' +
          '<label style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-bottom:6px">Nome</label>' +
          '<input type="text" id="input-npc-nome" maxlength="60" placeholder="Ex: Informante" ' +
            'style="width:100%;padding:11px 12px;border-radius:8px;border:1px solid var(--ag-border);background:var(--ag-panel);color:var(--ag-text);margin-bottom:12px;box-sizing:border-box;" />' +
          '<label style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-bottom:6px">Tipo</label>' +
          '<input type="text" id="input-npc-tipo" maxlength="40" placeholder="Ex: Antagonista" ' +
            'style="width:100%;padding:11px 12px;border-radius:8px;border:1px solid var(--ag-border);background:var(--ag-panel);color:var(--ag-text);margin-bottom:16px;box-sizing:border-box;" />' +
          '<div style="display:flex;justify-content:flex-end;gap:10px">' +
            '<button type="button" class="btn-ghost" id="btn-npc-cancel">Cancelar</button>' +
            '<button type="button" class="btn-primary" id="btn-npc-salvar">Adicionar</button></div>' +
        '</div></div>';
    document.body.appendChild(div);
    function fechar() { div.hidden = true; }
    document.getElementById('modal-npc-close').onclick = fechar;
    document.getElementById('btn-npc-cancel').onclick = fechar;
    div.onclick = function (e) { if (e.target === div) fechar(); };
    document.getElementById('btn-npc-salvar').onclick = function () {
      var id = window.__campGetAtualId && window.__campGetAtualId();
      var c = getCamp(id);
      if (!c || !isMestre(c)) { toast('Apenas o Mestre pode adicionar NPCs.', true); return; }
      var nome = (document.getElementById('input-npc-nome').value || '').trim();
      var tipo = (document.getElementById('input-npc-tipo').value || '').trim();
      if (!nome) { toast('Informe o nome do NPC.', true); return; }
      var arr = (c.npcs || []).slice();
      arr.push({ id: 'cnpc_' + Date.now().toString(36), nome: nome, tipo: tipo || 'NPC', foto: '', fichaId: null });
      atualizar(id, { npcs: arr });
      fechar();
      if (typeof window.__campAbrir === 'function') window.__campAbrir(id);
      var tab = document.querySelector('.camp-tab[data-camp-tab="npcs"]');
      if (tab) tab.click();
    };
  }

  function renderNpcs() {
    var grid = document.getElementById('camp-npcs-grid');
    var id = window.__campGetAtualId && window.__campGetAtualId();
    var c = getCamp(id);
    if (!c || !grid) return;
    var mestre = isMestre(c);
    var npcs = c.npcs || [];
    grid.innerHTML = '';
    if (!npcs.length) {
      grid.innerHTML = '<div class="ag-empty">' + (mestre ? 'Nenhum NPC. Use “Adicionar NPC”.' : 'Nenhum NPC visível.') + '</div>';
      return;
    }
    npcs.forEach(function (n, idx) {
      var card = document.createElement('div');
      card.className = 'camp-ag-card' + (mestre ? '' : ' camp-ag-restricted');
      card.style.position = 'relative';
      var body = avatarHtml(n.foto, n.nome) + '<h3>' + esc(n.nome || 'NPC') + '</h3>';
      if (mestre) {
        body += '<div class="meta">' + esc(n.tipo || 'NPC') + '</div>';
        if (n.fichaId) body += '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(n.fichaId) + '">Acessar Ficha</a>';
        body += '<button type="button" class="rm-npc" data-idx="' + idx + '" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:#9797a8;cursor:pointer;">✕</button>';
      } else {
        body += '<div class="meta camp-restricted-label">Visão limitada</div>';
      }
      card.innerHTML = body;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-npc').forEach(function (btn) {
      btn.onclick = function () {
        var c2 = getCamp(id);
        if (!c2 || !isMestre(c2)) return;
        var arr = (c2.npcs || []).slice();
        arr.splice(parseInt(btn.dataset.idx, 10), 1);
        atualizar(id, { npcs: arr });
        renderNpcs();
      };
    });
  }

  function enhanceAgentes() {
    var id = window.__campGetAtualId && window.__campGetAtualId();
    var c = getCamp(id);
    var grid = document.getElementById('camp-agentes-grid');
    if (!c || !grid) return;
    var reg = [];
    try { reg = JSON.parse(localStorage.getItem('escandinavo-agentes-registro') || '[]'); } catch (e) {}
    var ids = c.agentes || [];
    var meta = c.agentesMeta || {};
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum personagem nesta campanha.</div>';
      return;
    }
    ids.forEach(function (agId) {
      var a = reg.find(function (x) { return x.id === agId; }) || {};
      var m = meta[agId] || {};
      var nome = a.nome || m.nome || 'Agente';
      var foto = a.foto || m.foto || '';
      var can = podeEditarAgente(c, agId);
      var card = document.createElement('div');
      card.className = 'camp-ag-card' + (can ? '' : ' camp-ag-restricted');
      card.style.position = 'relative';
      var body = avatarHtml(foto, nome) + '<h3>' + esc(nome) + '</h3>';
      if (can) {
        var classe = a.classe || m.classe || '—';
        var nex = a.nex != null ? a.nex : (m.nex != null ? m.nex : 5);
        body += '<div class="meta">' + esc(classe) + ' · NEX ' + nex + '%</div>';
        body += '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(agId) + '">Acessar Ficha</a>';
        if (isMestre(c)) {
          body += '<button type="button" class="rm-ag" data-id="' + esc(agId) + '" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:#9797a8;cursor:pointer;">✕</button>';
        }
      } else {
        body += '<div class="meta camp-restricted-label">Visão limitada</div>';
      }
      card.innerHTML = body;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-ag').forEach(function (btn) {
      btn.onclick = function () {
        var c2 = getCamp(id);
        if (!c2 || !isMestre(c2)) return;
        var novos = (c2.agentes || []).filter(function (x) { return x !== btn.dataset.id; });
        var nm = Object.assign({}, c2.agentesMeta || {});
        delete nm[btn.dataset.id];
        atualizar(id, { agentes: novos, agentesMeta: nm });
        if (typeof window.__campAbrir === 'function') window.__campAbrir(id);
      };
    });
  }

  function onOpen(campId) {
    ensureCss();
    var c = getCamp(campId);
    if (!c) return;
    if (!c.inviteCode) {
      atualizar(campId, { inviteCode: genCode() });
      c = getCamp(campId);
    }
    if (!c.ownerUid && uid()) {
      atualizar(campId, {
        ownerUid: uid(),
        ownerName: nomeUser() || 'Mestre',
        members: [{ uid: uid(), nome: nomeUser() || 'Mestre', foto: fotoUser(), role: 'mestre', joinedAt: Date.now() }]
      });
      c = getCamp(campId);
    }
    syncShared(c);

    var btnInvite = document.getElementById('btn-camp-convidar');
    var btnNpc = document.getElementById('btn-camp-add-npc');
    var btnAdd = document.getElementById('btn-camp-add-agentes');
    var btnEdit = document.getElementById('btn-camp-editar');
    if (btnInvite) btnInvite.style.display = isMestre(c) ? '' : 'none';
    if (btnNpc) btnNpc.style.display = isMestre(c) ? '' : 'none';
    if (btnEdit) btnEdit.style.display = isMestre(c) ? '' : 'none';
    if (btnAdd) {
      btnAdd.style.display = isMestre(c) || isMembro(c) ? '' : 'none';
      btnAdd.textContent = isMestre(c) ? 'Adicionar Personagem' : 'Vincular meu Personagem';
    }
    var metaEl = document.getElementById('camp-detail-meta');
    if (metaEl && c) {
      var nAg = (c.agentes || []).length;
      var nNpc = (c.npcs || []).length;
      metaEl.textContent = 'Iniciada em: ' + new Date(c.criadaEm).toLocaleDateString('pt-BR') +
        ' · ' + nAg + ' personagem' + (nAg === 1 ? '' : 's') +
        ' · ' + nNpc + ' NPC' + (nNpc === 1 ? '' : 's') +
        (isMestre(c) ? ' · Você é o Mestre' : ' · Você é Jogador');
    }
    enhanceAgentes();
  }

  async function processarConvite(code) {
    if (!code) return;
    if (!uid()) {
      toast('Faça login com o Google para aceitar o convite.', true);
      try { sessionStorage.setItem('escandinavo-pending-invite', code); } catch (e) {}
      return;
    }
    toast('Entrando na campanha…');
    var shared = await fetchByInvite(code);
    if (!shared) {
      var lista = typeof window.__campLerCampanhas === 'function' ? window.__campLerCampanhas() : [];
      shared = lista.find(function (c) { return c.inviteCode === code; });
    }
    if (!shared) { toast('Convite inválido ou expirado.', true); return; }
    var lista2 = typeof window.__campLerCampanhas === 'function' ? window.__campLerCampanhas() : [];
    var existing = lista2.find(function (c) { return c.id === shared.id; });
    var member = { uid: uid(), nome: nomeUser() || 'Jogador', foto: fotoUser(), role: shared.ownerUid === uid() ? 'mestre' : 'jogador', joinedAt: Date.now() };
    if (existing) {
      var members = (existing.members || []).slice();
      if (!members.some(function (m) { return m.uid === uid(); })) {
        members.push(member);
        atualizar(existing.id, { members: members });
      }
      toast('Você já está nesta campanha.');
      if (typeof window.__campAbrir === 'function') window.__campAbrir(existing.id);
    } else {
      var camp = {
        id: shared.id, nome: shared.nome, capa: shared.capa || null,
        ownerUid: shared.ownerUid, ownerName: shared.ownerName,
        inviteCode: shared.inviteCode || code,
        members: (shared.members || []).slice(),
        agentes: shared.agentes || [], agentesMeta: shared.agentesMeta || {},
        npcs: shared.npcs || [], criadaEm: shared.criadaEm || Date.now()
      };
      if (!camp.members.some(function (m) { return m.uid === uid(); })) camp.members.push(member);
      lista2.push(camp);
      if (typeof window.__campSalvarCampanhas === 'function') window.__campSalvarCampanhas(lista2);
      syncShared(camp);
      toast('Entrou na campanha: ' + (camp.nome || ''));
      var link = document.querySelector('.ag-nav a[data-view="campanhas"]');
      if (link) link.click();
      setTimeout(function () {
        if (typeof window.__campAbrir === 'function') window.__campAbrir(camp.id);
      }, 120);
    }
    try {
      var u = new URL(location.href);
      u.searchParams.delete('convite');
      history.replaceState({}, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  }

  function bindInviteUI() {
    ensureCss();
    ensureModalConvite();
    ensureModalNpc();
    var btnInvite = document.getElementById('btn-camp-convidar');
    if (btnInvite) {
      btnInvite.onclick = function () {
        var id = window.__campGetAtualId && window.__campGetAtualId();
        var c = getCamp(id);
        if (!c || !isMestre(c)) { toast('Apenas o Mestre pode convidar.', true); return; }
        if (!c.inviteCode) {
          atualizar(id, { inviteCode: genCode() });
          c = getCamp(id);
        }
        syncShared(c);
        document.getElementById('input-convite-link').value = inviteUrl(c.inviteCode);
        document.getElementById('label-convite-code').textContent = c.inviteCode;
        document.getElementById('modal-convite-camp').hidden = false;
      };
    }
    var btnNpc = document.getElementById('btn-camp-add-npc');
    if (btnNpc) {
      btnNpc.onclick = function () {
        var id = window.__campGetAtualId && window.__campGetAtualId();
        var c = getCamp(id);
        if (!c || !isMestre(c)) { toast('Apenas o Mestre pode adicionar NPCs.', true); return; }
        document.getElementById('input-npc-nome').value = '';
        document.getElementById('input-npc-tipo').value = '';
        document.getElementById('modal-add-npc-camp').hidden = false;
      };
    }
  }

  function checkInvite() {
    var code = null;
    try {
      var p = new URLSearchParams(location.search);
      code = p.get('convite') || p.get('invite');
    } catch (e) {}
    if (!code) {
      try { code = sessionStorage.getItem('escandinavo-pending-invite'); } catch (e) {}
    }
    if (code) {
      try { sessionStorage.removeItem('escandinavo-pending-invite'); } catch (e) {}
      processarConvite(code);
    }
  }

  window.__campEnhanceOpen = onOpen;
  window.__campEnhanceAgentes = enhanceAgentes;
  window.__campRenderNpcs = renderNpcs;
  window.CampanhasAPI = {
    isMestre: isMestre,
    isMembro: isMembro,
    podeEditarAgente: podeEditarAgente,
    processarConvite: processarConvite
  };

  function start() {
    bindInviteUI();
    setTimeout(checkInvite, 700);
    var prev = null;
    setInterval(function () {
      var u = uid();
      if (u && u !== prev) {
        prev = u;
        try {
          var pending = sessionStorage.getItem('escandinavo-pending-invite');
          if (pending) {
            sessionStorage.removeItem('escandinavo-pending-invite');
            processarConvite(pending);
          }
        } catch (e) {}
      }
    }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
