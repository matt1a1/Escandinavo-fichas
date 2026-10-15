/* camp-ameacas.js — botão + aba + modal para vincular Ameaças (criaturas) à campanha */
(function () {
  if (window.__campAmeacas) return;
  window.__campAmeacas = true;

  var CRI_KEY = 'escandinavo-criaturas-registro';

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function lerCriaturas() {
    try { return JSON.parse(localStorage.getItem(CRI_KEY) || '[]') || []; } catch (e) { return []; }
  }

  function campId() {
    if (typeof window.__campGetAtualId === 'function') return window.__campGetAtualId();
    return null;
  }

  function getCamp(id) {
    if (typeof window.__campGetCampanha === 'function') return window.__campGetCampanha(id);
    return null;
  }

  function atualizar(id, patch) {
    if (typeof window.__campAtualizar === 'function') return window.__campAtualizar(id, patch);
  }

  function ensureUI() {
    var actions = document.querySelector('.camp-detail-actions');
    if (actions && !document.getElementById('btn-camp-add-ameaca')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-outline';
      btn.id = 'btn-camp-add-ameaca';
      btn.textContent = 'Adicionar Ameaça';
      var after = document.getElementById('btn-camp-add-npc')
        || document.getElementById('btn-camp-add-agentes')
        || actions.lastElementChild;
      if (after && after.nextSibling) actions.insertBefore(btn, after.nextSibling);
      else actions.appendChild(btn);
    }

    var tabs = document.querySelector('.camp-tabs');
    if (tabs && !tabs.querySelector('[data-camp-tab="ameacas"]')) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'camp-tab';
      tab.dataset.campTab = 'ameacas';
      tab.textContent = 'Ameaças';
      tabs.appendChild(tab);
    }

    var detail = document.getElementById('view-camp-detail');
    if (detail && !document.getElementById('camp-tab-ameacas')) {
      var panel = document.createElement('div');
      panel.id = 'camp-tab-ameacas';
      panel.className = 'camp-tab-panel';
      panel.hidden = true;
      panel.innerHTML = '<div class="camp-agentes-grid" id="camp-ameacas-grid"></div>';
      detail.appendChild(panel);
    }

    if (!document.getElementById('modal-add-ameacas')) {
      var wrap = document.createElement('div');
      wrap.className = 'wizard-overlay';
      wrap.id = 'modal-add-ameacas';
      wrap.hidden = true;
      wrap.innerHTML =
        '<div class="modal-box">' +
        '  <div class="wizard-top">' +
        '    <span class="brand">Adicionar Ameaças</span>' +
        '    <button type="button" class="btn-ghost" id="modal-add-ameacas-close">Fechar</button>' +
        '  </div>' +
        '  <div class="modal-box-body">' +
        '    <p style="color:var(--ag-text-dim,#8888a0);margin:0 0 14px">Selecione as criaturas/ameaças para vincular a esta campanha.</p>' +
        '    <div id="modal-ameacas-lista" class="modal-agentes-lista"></div>' +
        '    <div style="display:flex;justify-content:flex-end;margin-top:18px">' +
        '      <button type="button" class="btn-primary" id="btn-confirmar-ameacas">Confirmar</button>' +
        '    </div>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(wrap);
    }
  }

  function renderAmeacas() {
    ensureUI();
    var grid = document.getElementById('camp-ameacas-grid');
    var id = campId();
    var c = id ? getCamp(id) : null;
    if (!grid) return;
    if (!c) {
      grid.innerHTML = '<div class="ag-empty">Abra uma campanha para ver as ameaças.</div>';
      return;
    }
    var ids = c.ameacas || c.criaturas || [];
    var reg = lerCriaturas();
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhuma ameaça nesta campanha. Use “Adicionar Ameaça”.</div>';
      return;
    }
    ids.forEach(function (cid) {
      var a = reg.find(function (x) { return x.id === cid; }) || { id: cid, nome: 'Ameaça removida', classe: '—' };
      var card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.style.position = 'relative';
      card.innerHTML =
        '<button type="button" class="rm-ag rm-ameaca" data-id="' + escapeHtml(a.id) + '" title="Remover da campanha">✕</button>' +
        '<h3>' + escapeHtml(a.nome || 'Sem nome') + '</h3>' +
        '<div class="meta">' + escapeHtml(a.gerador || a.classe || 'Criatura') +
        (a.nex != null ? ' · NEX ' + a.nex + '%' : '') + '</div>' +
        '<a class="btn-acessar acessar" href="ficha.html?id=' + encodeURIComponent(a.id) + '">Acessar Ficha</a>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-ameaca').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var cid = campId();
        if (!cid) return;
        var c2 = getCamp(cid);
        if (!c2) return;
        var novos = (c2.ameacas || c2.criaturas || []).filter(function (x) { return x !== btn.dataset.id; });
        atualizar(cid, { ameacas: novos, criaturas: novos });
        renderAmeacas();
      });
    });
  }

  function openModal() {
    ensureUI();
    var modal = document.getElementById('modal-add-ameacas');
    var lista = document.getElementById('modal-ameacas-lista');
    var id = campId();
    var c = id ? getCamp(id) : null;
    if (!modal || !lista || !c) return;
    var ja = {};
    (c.ameacas || c.criaturas || []).forEach(function (x) { ja[x] = true; });
    var criaturas = lerCriaturas().sort(function (a, b) {
      return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
    });
    if (!criaturas.length) {
      lista.innerHTML = '<div class="ag-empty">Nenhuma criatura/ameaça criada ainda. Vá em “Criatura/Ameaça” e use + Nova Criatura.</div>';
    } else {
      lista.innerHTML = criaturas.map(function (a) {
        return '<label class="modal-ag-item" style="display:flex;align-items:center;gap:10px;padding:8px 4px;cursor:pointer">' +
          '<input type="checkbox" value="' + escapeHtml(a.id) + '"' + (ja[a.id] ? ' checked' : '') + ' />' +
          '<span><strong>' + escapeHtml(a.nome || 'Sem nome') + '</strong>' +
          '<span style="color:var(--ag-text-dim,#888);font-size:.85em"> · ' +
          escapeHtml(a.gerador || a.classe || 'Criatura') + '</span></span></label>';
      }).join('');
    }
    modal.hidden = false;
  }

  function confirmModal() {
    var id = campId();
    if (!id) return;
    var checks = document.querySelectorAll('#modal-ameacas-lista input[type="checkbox"]');
    var ids = [];
    checks.forEach(function (ch) { if (ch.checked) ids.push(ch.value); });
    atualizar(id, { ameacas: ids, criaturas: ids });
    var modal = document.getElementById('modal-add-ameacas');
    if (modal) modal.hidden = true;
    document.querySelectorAll('.camp-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.campTab === 'ameacas');
    });
    var elAg = document.getElementById('camp-tab-agentes');
    var elJog = document.getElementById('camp-tab-jogadores');
    var elNpc = document.getElementById('camp-tab-npcs');
    var elAm = document.getElementById('camp-tab-ameacas');
    if (elAg) elAg.hidden = true;
    if (elJog) elJog.hidden = true;
    if (elNpc) elNpc.hidden = true;
    if (elAm) elAm.hidden = false;
    renderAmeacas();
  }

  function bindTabs() {
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      if (tab._ameacaBound) return;
      tab._ameacaBound = true;
      tab.addEventListener('click', function () {
        var which = tab.dataset.campTab;
        document.querySelectorAll('.camp-tab').forEach(function (t) {
          t.classList.toggle('active', t === tab);
        });
        var elAg = document.getElementById('camp-tab-agentes');
        var elJog = document.getElementById('camp-tab-jogadores');
        var elNpc = document.getElementById('camp-tab-npcs');
        var elAm = document.getElementById('camp-tab-ameacas');
        if (elAg) elAg.hidden = which !== 'agentes';
        if (elJog) elJog.hidden = which !== 'jogadores';
        if (elNpc) elNpc.hidden = which !== 'npcs';
        if (elAm) elAm.hidden = which !== 'ameacas';
        if (which === 'ameacas') renderAmeacas();
        if (which === 'npcs' && typeof window.__campRenderNpcs === 'function') window.__campRenderNpcs();
      });
    });
  }

  function bindButtons() {
    ensureUI();
    var btn = document.getElementById('btn-camp-add-ameaca');
    if (btn && !btn._ameacaBound) {
      btn._ameacaBound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }
    var close = document.getElementById('modal-add-ameacas-close');
    if (close && !close._ameacaBound) {
      close._ameacaBound = true;
      close.addEventListener('click', function () {
        var m = document.getElementById('modal-add-ameacas');
        if (m) m.hidden = true;
      });
    }
    var conf = document.getElementById('btn-confirmar-ameacas');
    if (conf && !conf._ameacaBound) {
      conf._ameacaBound = true;
      conf.addEventListener('click', confirmModal);
    }
    bindTabs();
  }

  var prevEnhance = window.__campEnhanceOpen;
  window.__campEnhanceOpen = function (id) {
    if (typeof prevEnhance === 'function') {
      try { prevEnhance(id); } catch (e) {}
    }
    ensureUI();
    bindButtons();
  };
  window.__campRenderAmeacas = renderAmeacas;

  function start() {
    ensureUI();
    bindButtons();
    setInterval(function () {
      ensureUI();
      bindButtons();
    }, 2000);
    console.log('[camp-ameacas] ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
