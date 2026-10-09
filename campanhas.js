// Campanhas completas — lista, acessar, excluir, adicionar agentes, editar nome (modal)
(function () {
  const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';
  const REGISTRO_KEY = 'escandinavo-agentes-registro';
  const CLASSE_LABEL = { combatente: 'Combatente', especialista: 'Especialista', ocultista: 'Ocultista' };

  function lerCampanhas() {
    try { return JSON.parse(localStorage.getItem(CAMPANHAS_KEY) || '[]'); } catch (e) { return []; }
  }
  function salvarCampanhas(arr) {
    localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(arr));
  }
  function lerAgentes() {
    try { return JSON.parse(localStorage.getItem(REGISTRO_KEY) || '[]'); } catch (e) { return []; }
  }
  function getCampanha(id) {
    return lerCampanhas().find(c => c.id === id);
  }
  function atualizarCampanha(id, patch) {
    const arr = lerCampanhas();
    const i = arr.findIndex(c => c.id === id);
    if (i < 0) return;
    arr[i] = Object.assign({}, arr[i], patch);
    salvarCampanhas(arr);
  }
  function escapeCamp(s) {
    return String(s || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
  }
  function formatarData(ts) {
    if (!ts) return '—';
    try {
      var d = new Date(ts);
      return d.toLocaleDateString('pt-BR');
    } catch (e) { return '—'; }
  }
  function uid() {
    return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var campanhaAtualId = null;

  function renderCampanhas() {
    const grid = document.getElementById('camp-grid');
    const countEl = document.getElementById('camp-count');
    if (!grid) return;
    const list = lerCampanhas();
    if (countEl) countEl.textContent = list.length;
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhuma campanha ainda. Clique em + Nova Campanha.</div>';
      return;
    }
    list.forEach(c => {
      const card = document.createElement('div');
      card.className = 'camp-card';
      const nAg = (c.agentes || []).length;
      card.innerHTML =
        '<div class="camp-body">' +
          '<h3>' + escapeCamp(c.nome || 'Sem nome') + '</h3>' +
          '<div class="meta">' + formatarData(c.criadaEm) + ' · ' + nAg + ' agente' + (nAg === 1 ? '' : 's') + '</div>' +
          '<button type="button" class="btn-acessar" data-id="' + c.id + '">Acessar</button>' +
        '</div>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-acessar').forEach(btn => {
      btn.addEventListener('click', () => abrirCampanha(btn.dataset.id));
    });
    grid.querySelectorAll('.del-camp').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Excluir esta campanha?')) return;
        salvarCampanhas(lerCampanhas().filter(c => c.id !== btn.dataset.id));
        renderCampanhas();
      });
    });
  }

  function abrirCampanha(id) {
    campanhaAtualId = id;
    const c = getCampanha(id);
    if (!c) return;
    document.querySelectorAll('.ag-view').forEach(v => v.hidden = true);
    const detailView = document.getElementById('view-camp-detail');
    if (detailView) detailView.hidden = false;
    document.getElementById('view-camp-detail').hidden = false;
    document.getElementById('camp-detail-nome').innerHTML =
      escapeCamp(c.nome || 'Campanha') + ' <button type="button" class="btn-icon-edit" id="btn-edit-camp-nome" title="Editar nome">✎</button>';
    document.getElementById('camp-detail-meta').textContent =
      'Iniciada em: ' + formatarData(c.criadaEm) + ' · ' + (c.agentes || []).length + ' agente' + ((c.agentes || []).length === 1 ? '' : 's');
    var cover = document.getElementById('camp-detail-cover');
    if (cover) {
      if (c.foto) cover.style.backgroundImage = "url('" + String(c.foto).replace(/'/g, '%27') + "')";
      else cover.style.backgroundImage = '';
    }
    document.getElementById('camp-tab-agentes').hidden = false;
    document.getElementById('camp-tab-jogadores').hidden = true;
    var tabNpc = document.getElementById('camp-tab-npcs');
    if (tabNpc) tabNpc.hidden = true;
    renderCampAgentes();
    renderCampJogadores();
    if (typeof window.__campEnhanceOpen === 'function') window.__campEnhanceOpen(id);
  }

  function renderCampAgentes() {
    const grid = document.getElementById('camp-agentes-grid');
    const c = getCampanha(campanhaAtualId);
    if (!c || !grid) return;
    const agentesReg = lerAgentes();
    const ids = c.agentes || [];
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum personagem nesta campanha.</div>';
      return;
    }
    ids.forEach(agId => {
      const a = agentesReg.find(x => x.id === agId) || { id: agId, nome: 'Agente removido', classe: '—' };
      const card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.style.position = 'relative';
      card.innerHTML =
        '<button type="button" class="rm-ag" data-id="' + a.id + '" title="Remover da campanha">×</button>' +
        '<h3>' + escapeCamp(a.nome || 'Sem nome') + '</h3>' +
        '<div class="meta">' + escapeCamp(CLASSE_LABEL[a.classe] || a.classe || '—') + ' · NEX ' + (a.nex ?? 5) + '%</div>' +
        '<a class="btn-acessar" href="ficha.html?id=' + encodeURIComponent(a.id) + '">Acessar Ficha</a>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.rm-ag').forEach(btn => {
      btn.addEventListener('click', () => {
        const c2 = getCampanha(campanhaAtualId);
        if (!c2) return;
        const novos = (c2.agentes || []).filter(id => id !== btn.dataset.id);
        atualizarCampanha(campanhaAtualId, { agentes: novos });
        renderCampAgentes();
        document.getElementById('camp-detail-meta').textContent =
          'Iniciada em: ' + formatarData(c2.criadaEm) + ' · ' + novos.length + ' agente' + (novos.length === 1 ? '' : 's');
      });
    });
    if (typeof window.__campEnhanceAgentes === 'function') window.__campEnhanceAgentes();
  }

  function renderCampJogadores() {
    const grid = document.getElementById('camp-jogadores-grid');
    const c = getCampanha(campanhaAtualId);
    if (!c || !grid) return;
    const jogs = c.members || c.jogadoresLista || [];
    grid.innerHTML = '';
    if (!jogs.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum jogador ainda. Use “Convidar para a Campanha”.</div>';
      return;
    }
    jogs.forEach(j => {
      const card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.innerHTML = '<h3>' + escapeCamp(j.nome || 'Jogador') + '</h3><div class="meta">' + escapeCamp(j.role === 'mestre' ? 'Mestre' : (j.nota || 'Jogador')) + '</div>';
      grid.appendChild(card);
    });
  }

  window.renderCampanhas = renderCampanhas;
  window.__campAbrir = abrirCampanha;
  window.__campGetCampanha = getCampanha;
  window.__campAtualizar = atualizarCampanha;
  window.__campGetAtualId = function () { return campanhaAtualId; };

  function bind() {
    var btnNova = document.getElementById('btn-nova-campanha');
    if (btnNova) btnNova.addEventListener('click', function () {
      var nome = prompt('Nome da campanha:');
      if (!nome) return;
      var arr = lerCampanhas();
      arr.push({ id: uid(), nome: nome.trim(), criadaEm: Date.now(), agentes: [], members: [] });
      salvarCampanhas(arr);
      renderCampanhas();
    });
    var btnBack = document.getElementById('btn-voltar-campanhas');
    if (btnBack) btnBack.addEventListener('click', function () {
      document.getElementById('view-camp-detail').hidden = true;
      document.getElementById('view-campanhas').hidden = false;
      renderCampanhas();
    });
    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.camp-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var which = tab.dataset.campTab;
        document.getElementById('camp-tab-agentes').hidden = which !== 'agentes';
        document.getElementById('camp-tab-jogadores').hidden = which !== 'jogadores';
        var n = document.getElementById('camp-tab-npcs');
        if (n) n.hidden = which !== 'npcs';
      });
    });
    document.querySelectorAll('.ag-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.dataset.view === 'campanhas') setTimeout(renderCampanhas, 50);
      });
    });
    renderCampanhas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
