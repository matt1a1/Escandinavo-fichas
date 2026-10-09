/**
 * Interface exclusiva de exclusão + foto nos cards (agentes, NPC, criatura).
 */
(function () {
  var KEYS = {
    agentes: 'escandinavo-agentes-registro',
    npc: 'escandinavo-npcs-registro',
    criatura: 'escandinavo-criaturas-registro'
  };

  function ensureCss() {
    if (document.getElementById('card-actions-css')) return;
    var s = document.createElement('style');
    s.id = 'card-actions-css';
    s.textContent =
      '.ag-card{position:relative;}' +
      '.ag-card .avatar{width:64px;height:64px;border-radius:12px;background:#1d1d29;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:10px;background-size:cover;background-position:center;cursor:pointer;}' +
      '.ag-card .avatar.has-foto{font-size:0;color:transparent;}' +
      '.ag-menu{position:absolute;top:8px;right:8px;z-index:5;}' +
      '.ag-menu-btn{width:32px;height:32px;border:none;border-radius:8px;background:rgba(0,0,0,.35);color:#cfcfe0;font-size:1.2rem;line-height:1;cursor:pointer;}' +
      '.ag-menu-btn:hover{background:rgba(167,139,250,.25);color:#fff;}' +
      '.ag-menu-drop{position:absolute;right:0;top:36px;min-width:160px;background:#1a1a24;border:1px solid #2e2e3e;border-radius:10px;padding:6px;box-shadow:0 12px 28px rgba(0,0,0,.45);z-index:20;}' +
      '.ag-menu-drop[hidden]{display:none!important;}' +
      '.ag-menu-item{display:block;width:100%;text-align:left;border:none;background:transparent;color:#e8e8f0;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:.9rem;}' +
      '.ag-menu-item:hover{background:rgba(167,139,250,.15);}' +
      '.ag-menu-item.danger{color:#f87171;}' +
      '.ag-menu-item.danger:hover{background:rgba(248,113,113,.12);}' +
      '#esc-del-modal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:16px;}' +
      '#esc-del-modal[hidden]{display:none!important;}' +
      '#esc-del-modal .box{background:#16161f;border:1px solid #2e2e3e;border-radius:14px;padding:20px;max-width:360px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.5);}' +
      '#esc-del-modal h3{margin:0 0 8px;font-size:1.1rem;color:#f1f1f7;}' +
      '#esc-del-modal p{margin:0 0 18px;color:#9797a8;font-size:.9rem;line-height:1.4;}' +
      '#esc-del-modal .actions{display:flex;gap:10px;justify-content:flex-end;}' +
      '#esc-del-modal .btn-cancel{background:transparent;border:1px solid #3a3a4a;color:#cfcfe0;padding:10px 14px;border-radius:10px;cursor:pointer;}' +
      '#esc-del-modal .btn-del{background:#dc2626;border:none;color:#fff;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:600;}' +
      '#esc-del-modal .btn-del:hover{background:#ef4444;}' +
      '#esc-foto-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1d1d29;border:1px solid #a78bfa;color:#e8e8f0;padding:10px 16px;border-radius:999px;z-index:10000;font-size:.85rem;}' +
      '#esc-foto-toast[hidden]{display:none!important;}';
    document.head.appendChild(s);
  }

  function ensureModal() {
    if (document.getElementById('esc-del-modal')) return;
    var div = document.createElement('div');
    div.id = 'esc-del-modal';
    div.hidden = true;
    div.innerHTML =
      '<div class="box" role="dialog" aria-modal="true">' +
        '<h3 id="esc-del-title">Excluir</h3>' +
        '<p id="esc-del-msg">Essa ação não pode ser desfeita.</p>' +
        '<div class="actions">' +
          '<button type="button" class="btn-cancel" id="esc-del-cancel">Cancelar</button>' +
          '<button type="button" class="btn-del" id="esc-del-confirm">Excluir</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(div);
    div.addEventListener('click', function (e) { if (e.target === div) closeModal(); });
    document.getElementById('esc-del-cancel').addEventListener('click', closeModal);
  }

  var pending = null;
  function closeModal() {
    var m = document.getElementById('esc-del-modal');
    if (m) m.hidden = true;
    pending = null;
  }
  function openDeleteModal(opts) {
    ensureModal();
    pending = opts;
    document.getElementById('esc-del-title').textContent = opts.title || 'Excluir';
    document.getElementById('esc-del-msg').textContent = opts.message || 'Essa ação não pode ser desfeita.';
    document.getElementById('esc-del-modal').hidden = false;
    document.getElementById('esc-del-confirm').onclick = function () {
      if (!pending) return;
      var p = pending;
      closeModal();
      doDelete(p.registroKey, p.id);
      if (typeof p.onDone === 'function') p.onDone();
      else refreshAll(p.registroKey);
    };
  }

  function doDelete(registroKey, id) {
    if (!registroKey || !id) return;
    try {
      var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
      localStorage.setItem(registroKey, JSON.stringify(lista.filter(function (x) { return x && x.id !== id; })));
    } catch (e) {}
    try { localStorage.removeItem('escandinavo-ficha-' + id); } catch (e) {}
    try {
      var camps = JSON.parse(localStorage.getItem('escandinavo-campanhas-registro') || '[]') || [];
      var ch = false;
      camps.forEach(function (c) {
        if (c.agentes && c.agentes.indexOf(id) >= 0) {
          c.agentes = c.agentes.filter(function (x) { return x !== id; });
          ch = true;
        }
        if (c.agentesMeta && c.agentesMeta[id]) { delete c.agentesMeta[id]; ch = true; }
        if (c.npcs && c.npcs.length) {
          var before = c.npcs.length;
          c.npcs = c.npcs.filter(function (n) { return n && n.fichaId !== id && n.id !== id; });
          if (c.npcs.length !== before) ch = true;
        }
      });
      if (ch) localStorage.setItem('escandinavo-campanhas-registro', JSON.stringify(camps));
    } catch (e) {}
  }

  function toast(msg) {
    var t = document.getElementById('esc-foto-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'esc-foto-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.hidden = true; }, 1800);
  }

  function getFoto(registroKey, id) {
    try {
      var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
      var a = lista.find(function (x) { return x && x.id === id; });
      if (a && a.foto) return a.foto;
    } catch (e) {}
    try {
      var raw = localStorage.getItem('escandinavo-ficha-' + id);
      if (raw) {
        var f = JSON.parse(raw);
        if (f && f.foto) return f.foto;
      }
    } catch (e) {}
    return '';
  }

  function menuHtml(id) {
    return (
      '<div class="ag-menu">' +
        '<button type="button" class="ag-menu-btn" data-id="' + id + '" aria-label="Menu">⋯</button>' +
        '<div class="ag-menu-drop" hidden>' +
          '<button type="button" class="ag-menu-item" data-act="foto" data-id="' + id + '">Alterar foto</button>' +
          '<button type="button" class="ag-menu-item" data-act="share" data-id="' + id + '">Compartilhar</button>' +
          '<button type="button" class="ag-menu-item danger" data-act="del" data-id="' + id + '">Excluir</button>' +
        '</div>' +
      '</div>'
    );
  }

  function closeMenus(except) {
    document.querySelectorAll('.ag-menu-drop').forEach(function (d) {
      if (d !== except) d.hidden = true;
    });
  }

  function bindMenus(grid, registroKey) {
    if (!grid) return;
    grid.querySelectorAll('.ag-menu-btn').forEach(function (btn) {
      if (btn._cardActBound) return;
      btn._cardActBound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var drop = btn.parentElement.querySelector('.ag-menu-drop');
        var was = drop && !drop.hidden;
        closeMenus();
        if (drop && !was) drop.hidden = false;
      });
    });
    grid.querySelectorAll('.ag-menu-item').forEach(function (item) {
      if (item._cardActBound) return;
      item._cardActBound = true;
      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenus();
        var act = item.dataset.act;
        var id = item.dataset.id;
        if (!id) return;
        if (act === 'del') {
          var nome = 'esta ficha';
          try {
            var lista = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
            var found = lista.find(function (x) { return x && x.id === id; });
            if (found && found.nome) nome = '"' + found.nome + '"';
          } catch (err) {}
          openDeleteModal({
            registroKey: registroKey,
            id: id,
            title: 'Excluir ficha',
            message: 'Tem certeza que deseja excluir ' + nome + '? Essa ação não pode ser desfeita.',
            onDone: function () { refreshAll(registroKey); toast('Excluído'); }
          });
        } else if (act === 'foto') {
          if (window.EscandinavoFoto && window.EscandinavoFoto.pickAndResize) {
            window.EscandinavoFoto.pickAndResize(function (dataUrl) {
              window.EscandinavoFoto.setRegistroFoto(registroKey, id, dataUrl);
              refreshAll(registroKey);
              toast('Foto atualizada');
            });
          } else {
            alert('Ferramenta de foto não carregou. Atualize a página.');
          }
        } else if (act === 'share') {
          if (window.EscandinavoShare && window.EscandinavoShare.openShareModal) {
            var nome2 = 'Ficha';
            try {
              var l2 = JSON.parse(localStorage.getItem(registroKey) || '[]') || [];
              var f2 = l2.find(function (x) { return x && x.id === id; });
              if (f2) nome2 = f2.nome || nome2;
            } catch (err) {}
            window.EscandinavoShare.openShareModal({ id: id, registroKey: registroKey, nome: nome2 });
          }
        }
      });
    });
  }

  function applyPhotoToCard(card, registroKey) {
    var idEl = card.querySelector('.ag-menu-btn') || card.querySelector('.del') || card.querySelector('[data-id]');
    var id = idEl && (idEl.dataset.id || idEl.getAttribute('data-id'));
    if (!id) return;
    var foto = getFoto(registroKey, id);
    var av = card.querySelector('.avatar');
    if (!av) return;
    if (foto) {
      av.classList.add('has-foto');
      av.style.backgroundImage = "url('" + String(foto).replace(/'/g, '%27') + "')";
      av.style.backgroundSize = 'cover';
      av.style.backgroundPosition = 'center';
      av.textContent = '';
    }
    if (!av._fotoBound) {
      av._fotoBound = true;
      av.style.cursor = 'pointer';
      av.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!window.EscandinavoFoto || !window.EscandinavoFoto.pickAndResize) return;
        window.EscandinavoFoto.pickAndResize(function (dataUrl) {
          window.EscandinavoFoto.setRegistroFoto(registroKey, id, dataUrl);
          refreshAll(registroKey);
          toast('Foto atualizada');
        });
      });
    }
  }

  function enhanceGrid(grid, registroKey) {
    if (!grid) return;
    grid.querySelectorAll('.ag-card').forEach(function (card) {
      var del = card.querySelector('.del');
      var id = null;
      if (del) id = del.dataset.id;
      else {
        var mb = card.querySelector('.ag-menu-btn');
        if (mb) id = mb.dataset.id;
      }
      if (!id) return;
      if (!card.querySelector('.ag-menu')) {
        var wrap = document.createElement('div');
        wrap.innerHTML = menuHtml(id);
        var menu = wrap.firstChild;
        if (del) del.replaceWith(menu);
        else card.insertBefore(menu, card.firstChild);
      } else if (del) {
        del.remove();
      }
      applyPhotoToCard(card, registroKey);
    });
    bindMenus(grid, registroKey);
  }

  function refreshAll(registroKey) {
    if (registroKey === KEYS.agentes) {
      if (typeof window.renderAgentes === 'function') {
        try { window.renderAgentes(); } catch (e) {}
      }
      setTimeout(function () { enhanceGrid(document.getElementById('ag-grid'), KEYS.agentes); }, 50);
      return;
    }
    var searchId = registroKey === KEYS.npc ? 'npc-search' : 'criatura-search';
    var gridId = registroKey === KEYS.npc ? 'npc-grid' : 'criatura-grid';
    var search = document.getElementById(searchId);
    if (search) {
      try { search.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
    }
    setTimeout(function () { enhanceGrid(document.getElementById(gridId), registroKey); }, 80);
  }

  function patchShare() {
    if (!window.EscandinavoShare) return false;
    if (window.EscandinavoShare._cardActPatched) return true;
    window.EscandinavoShare.bindCardMenus = function (grid, registroKey) {
      enhanceGrid(grid, registroKey);
    };
    window.EscandinavoShare.menuHtml = menuHtml;
    window.EscandinavoShare._cardActPatched = true;
    return true;
  }

  function tick() {
    enhanceGrid(document.getElementById('ag-grid'), KEYS.agentes);
    enhanceGrid(document.getElementById('npc-grid'), KEYS.npc);
    enhanceGrid(document.getElementById('criatura-grid'), KEYS.criatura);
  }

  function start() {
    ensureCss();
    ensureModal();
    patchShare();
    tick();
    setInterval(function () { patchShare(); tick(); }, 900);
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.ag-menu')) closeMenus();
    });
    console.log('[card-actions] modal excluir + foto ok');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
