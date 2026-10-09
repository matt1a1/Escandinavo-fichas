// Menu ⋯, compartilhar ficha (ver/editar), alterar foto, excluir
(function () {
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
  function getDb() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore();
    } catch (e) {}
    return null;
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
  function shareUrl(code) {
    return siteBase().replace(/\/?$/, '/') + 'ficha.html?share=' + encodeURIComponent(code);
  }

  function closeMenus() {
    document.querySelectorAll('.ag-menu-drop').forEach(function (m) { m.hidden = true; });
  }

  document.addEventListener('click', function () { closeMenus(); });

  function ensureShareModal() {
    if (document.getElementById('modal-share-ficha')) return;
    var div = document.createElement('div');
    div.id = 'modal-share-ficha';
    div.className = 'wizard-overlay';
    div.hidden = true;
    div.innerHTML =
      '<div class="modal-box" style="max-width:480px">' +
        '<div class="wizard-top">' +
          '<span class="brand">Compartilhar ficha</span>' +
          '<button type="button" class="btn-ghost" id="modal-share-close">Fechar</button>' +
        '</div>' +
        '<div class="modal-box-body">' +
          '<p id="share-ficha-nome" style="color:var(--ag-text);margin:0 0 14px;font-weight:600"></p>' +
          '<p style="color:var(--ag-text-dim);margin:0 0 14px;font-size:.9rem">Gere um link para outra pessoa abrir esta ficha. Escolha se ela pode só ver ou também editar.</p>' +
          '<label style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-bottom:8px">Permissão</label>' +
          '<div style="display:flex;gap:10px;margin-bottom:16px">' +
            '<label class="share-perm-opt"><input type="radio" name="share-perm" value="view" checked /> Só visualizar</label>' +
            '<label class="share-perm-opt"><input type="radio" name="share-perm" value="edit" /> Pode editar</label>' +
          '</div>' +
          '<button type="button" class="btn-primary" id="btn-gerar-share" style="width:100%;margin-bottom:14px">Gerar link</button>' +
          '<div id="share-result" hidden>' +
            '<label style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-bottom:6px">Link de compartilhamento</label>' +
            '<div style="display:flex;gap:8px;margin-bottom:10px">' +
              '<input type="text" id="input-share-link" readonly style="flex:1;padding:11px 12px;border-radius:8px;border:1px solid var(--ag-border);background:var(--ag-panel);color:var(--ag-text);font-size:.85rem;" />' +
              '<button type="button" class="btn-primary" id="btn-copiar-share">Copiar</button>' +
            '</div>' +
            '<div style="font-size:.78rem;color:var(--ag-text-dim)">Código: <b id="label-share-code" style="color:var(--ag-text)"></b> · <span id="label-share-perm"></span></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(div);
    document.getElementById('modal-share-close').onclick = function () { div.hidden = true; };
    div.onclick = function (e) { if (e.target === div) div.hidden = true; };
    document.getElementById('btn-copiar-share').onclick = function () {
      var input = document.getElementById('input-share-link');
      input.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      if (!ok && navigator.clipboard) {
        navigator.clipboard.writeText(input.value).then(function () { toast('Link copiado!'); });
        return;
      }
      toast(ok ? 'Link copiado!' : 'Copie manualmente (Ctrl+C)', !ok);
    };
    document.getElementById('btn-gerar-share').onclick = function () {
      gerarShare();
    };
  }

  var _shareCtx = null;

  function openShareModal(ctx) {
    _shareCtx = ctx;
    ensureShareModal();
    document.getElementById('share-ficha-nome').textContent = ctx.nome || 'Ficha';
    document.getElementById('share-result').hidden = true;
    document.getElementById('input-share-link').value = '';
    var viewRadio = document.querySelector('input[name="share-perm"][value="view"]');
    if (viewRadio) viewRadio.checked = true;
    document.getElementById('modal-share-ficha').hidden = false;
  }

  async function gerarShare() {
    if (!_shareCtx || !_shareCtx.id) return;
    if (!uid()) {
      toast('Faça login com o Google para compartilhar.', true);
      return;
    }
    var db = getDb();
    if (!db) {
      toast('Firebase não disponível. Tente de novo após o login.', true);
      return;
    }
    var permEl = document.querySelector('input[name="share-perm"]:checked');
    var perm = permEl ? permEl.value : 'view';
    var ficha = null;
    try {
      ficha = JSON.parse(localStorage.getItem('escandinavo-ficha-' + _shareCtx.id) || 'null');
    } catch (e) {}
    if (!ficha) {
      toast('Ficha não encontrada localmente.', true);
      return;
    }
    var code = genCode();
    var btn = document.getElementById('btn-gerar-share');
    btn.disabled = true;
    btn.textContent = 'Gerando…';
    try {
      await db.collection('ficha_shares').doc(code).set({
        code: code,
        fichaId: _shareCtx.id,
        ownerUid: uid(),
        ownerName: nomeUser() || 'Agente',
        perm: perm,
        nome: ficha.nome || _shareCtx.nome || 'Sem nome',
        ficha: ficha,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      var url = shareUrl(code);
      document.getElementById('input-share-link').value = url;
      document.getElementById('label-share-code').textContent = code;
      document.getElementById('label-share-perm').textContent = perm === 'edit' ? 'Pode editar' : 'Só visualizar';
      document.getElementById('share-result').hidden = false;
      toast('Link gerado!');
    } catch (e) {
      console.warn(e);
      toast('Não foi possível salvar o compartilhamento. Verifique as regras do Firestore.', true);
    }
    btn.disabled = false;
    btn.textContent = 'Gerar link';
  }

  function menuHtml(id) {
    return (
      '<div class="ag-menu">' +
        '<button type="button" class="ag-menu-btn" data-id="' + id + '" title="Opções" aria-label="Opções">⋯</button>' +
        '<div class="ag-menu-drop" hidden>' +
          '<button type="button" class="ag-menu-item" data-act="share" data-id="' + id + '">Compartilhar</button>' +
          '<button type="button" class="ag-menu-item" data-act="foto" data-id="' + id + '">Alterar foto</button>' +
          '<button type="button" class="ag-menu-item danger" data-act="del" data-id="' + id + '">Excluir</button>' +
        '</div>' +
      '</div>'
    );
  }

  function bindCardMenus(grid, registroKey, onRefresh) {
    if (!grid) return;
    grid.querySelectorAll('.ag-menu-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var drop = btn.parentElement.querySelector('.ag-menu-drop');
        var wasOpen = drop && !drop.hidden;
        closeMenus();
        if (drop && !wasOpen) drop.hidden = false;
      });
    });
    grid.querySelectorAll('.ag-menu-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenus();
        var act = item.dataset.act;
        var id = item.dataset.id;
        if (!id) return;
        if (act === 'foto') {
          if (window.EscandinavoFoto && window.EscandinavoFoto.pickAndResize) {
            window.EscandinavoFoto.pickAndResize(function (dataUrl) {
              window.EscandinavoFoto.setRegistroFoto(registroKey, id, dataUrl);
              if (typeof onRefresh === 'function') onRefresh();
            });
          }
        } else if (act === 'del') {
          if (!confirm('Excluir esta ficha? Essa ação não pode ser desfeita.')) return;
          try {
            var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
            localStorage.setItem(registroKey, JSON.stringify(lista.filter(function (x) { return x.id !== id; })));
            localStorage.removeItem('escandinavo-ficha-' + id);
          } catch (err) {}
          if (typeof onRefresh === 'function') onRefresh();
        } else if (act === 'share') {
          var nome = 'Ficha';
          try {
            var lista2 = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
            var found = lista2.find(function (x) { return x.id === id; });
            if (found) nome = found.nome || nome;
          } catch (err) {}
          openShareModal({ id: id, registroKey: registroKey, nome: nome });
        }
      });
    });
  }

  async function loadSharedFicha() {
    var code = null;
    try {
      code = new URL(location.href).searchParams.get('share');
    } catch (e) {}
    if (!code) return false;

    function waitDb(ms) {
      return new Promise(function (resolve) {
        var t0 = Date.now();
        (function tick() {
          var db = getDb();
          if (db) return resolve(db);
          if (Date.now() - t0 > ms) return resolve(null);
          setTimeout(tick, 200);
        })();
      });
    }

    toast('Carregando ficha compartilhada…');
    var db = await waitDb(8000);
    if (!db) {
      toast('Não foi possível conectar. Faça login e tente de novo.', true);
      return true;
    }
    try {
      var snap = await db.collection('ficha_shares').doc(code).get();
      if (!snap.exists) {
        toast('Link inválido ou expirado.', true);
        return true;
      }
      var data = snap.data();
      var ficha = data.ficha || {};
      var localId = 'share_' + code;
      ficha._shareCode = code;
      ficha._sharePerm = data.perm || 'view';
      ficha._shareOwner = data.ownerUid || null;
      localStorage.setItem('escandinavo-ficha-' + localId, JSON.stringify(ficha));
      if (data.perm === 'view') {
        sessionStorage.setItem('escandinavo-share-readonly', localId);
      } else {
        sessionStorage.removeItem('escandinavo-share-readonly');
      }
      if (!location.search.match(/[?&]id=/)) {
        var u = new URL(location.href);
        u.searchParams.delete('share');
        u.searchParams.set('id', localId);
        if (data.perm === 'view') u.searchParams.set('readonly', '1');
        history.replaceState({}, '', u.pathname + '?' + u.searchParams.toString());
        setTimeout(function () { location.reload(); }, 80);
      }
      if (data.perm === 'view') {
        setTimeout(applyReadonly, 1200);
        setTimeout(applyReadonly, 2500);
      }
      toast((data.nome || 'Ficha') + (data.perm === 'view' ? ' (somente leitura)' : ' (editável)'));
    } catch (e) {
      console.warn(e);
      toast('Erro ao carregar compartilhamento.', true);
    }
    return true;
  }

  function applyReadonly() {
    var ro = sessionStorage.getItem('escandinavo-share-readonly');
    var params = new URLSearchParams(location.search);
    if (!ro && params.get('readonly') !== '1') return;
    document.body.classList.add('ficha-readonly');
    document.querySelectorAll('input, textarea, select, button').forEach(function (el) {
      if (el.id === 'btn-voltar-agentes' || (el.className && String(el.className).indexOf('voltar') >= 0)) return;
      if (el.closest && el.closest('.ag-nav')) return;
      if (el.tagName === 'BUTTON' && /voltar|agentes|fechar/i.test(el.textContent || '')) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        el.readOnly = true;
        el.disabled = true;
      } else if (el.tagName === 'BUTTON') {
        el.disabled = true;
      }
    });
    var banner = document.getElementById('share-ro-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'share-ro-banner';
      banner.style.cssText = 'position:sticky;top:0;z-index:50;background:#1e1b4b;color:#c4b5fd;padding:8px 14px;text-align:center;font-size:.85rem;border-bottom:1px solid #8b5cf6;';
      banner.textContent = 'Modo somente leitura — você não pode editar esta ficha compartilhada.';
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  function hookSharedSave() {
    var _set = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      _set(key, value);
      if (key && key.indexOf('escandinavo-ficha-share_') === 0) {
        try {
          var code = key.replace('escandinavo-ficha-share_', '');
          var ficha = JSON.parse(value);
          if (ficha && ficha._sharePerm === 'edit' && ficha._shareCode) {
            var db = getDb();
            var u = uid();
            if (db && u) {
              db.collection('ficha_shares').doc(ficha._shareCode).set({
                ficha: ficha,
                updatedAt: Date.now()
              }, { merge: true }).catch(function () {});
            }
          }
        } catch (e) {}
      }
    };
  }

  window.EscandinavoShare = {
    menuHtml: menuHtml,
    bindCardMenus: bindCardMenus,
    openShareModal: openShareModal,
    loadSharedFicha: loadSharedFicha,
    applyReadonly: applyReadonly
  };

  function start() {
    hookSharedSave();
    if (location.pathname.indexOf('ficha') >= 0 || location.search.indexOf('share=') >= 0) {
      loadSharedFicha();
      if (new URLSearchParams(location.search).get('readonly') === '1') {
        setTimeout(applyReadonly, 800);
        setTimeout(applyReadonly, 2000);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
