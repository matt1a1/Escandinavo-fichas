// Campanhas completas (lista, acessar, excluir, adicionar agentes, editar nome)
(function () {
  const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';
  const REGISTRO_KEY = 'escandinavo-agentes-registro';
  const CLASSE_LABEL = { combatente:'Combatente', especialista:'Especialista', ocultista:'Ocultista', mundano:'Mundano' };

  function lerCampanhas(){ try{ return JSON.parse(localStorage.getItem(CAMPANHAS_KEY)) || []; }catch(e){ return []; } }
  function salvarCampanhas(lista){ localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(lista)); }
  function lerAgentes(){ try{ return JSON.parse(localStorage.getItem(REGISTRO_KEY)) || []; }catch(e){ return []; } }
  function formatarData(ts){ return new Date(ts).toLocaleDateString('pt-BR'); }
  function escapeCamp(s) {
    return String(s == null ? '' : s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
  }

  let campanhaAtualId = null;

  function getCampanha(id) { return lerCampanhas().find(c => c.id === id) || null; }
  function atualizarCampanha(id, patch) {
    const lista = lerCampanhas();
    const i = lista.findIndex(c => c.id === id);
    if (i < 0) return;
    lista[i] = Object.assign({}, lista[i], patch);
    salvarCampanhas(lista);
  }

  function renderCampanhas() {
    const grid = document.getElementById('camp-grid');
    if (!grid) return;
    const lista = lerCampanhas().sort((a,b) => (b.criadaEm||0) - (a.criadaEm||0));
    const countEl = document.getElementById('camp-count');
    if (countEl) countEl.textContent = lista.length;
    const listView = document.getElementById('view-campanhas');
    const detailView = document.getElementById('view-camp-detail');
    if (listView) listView.hidden = false;
    if (detailView) detailView.hidden = true;
    campanhaAtualId = null;
    grid.innerHTML = '';
    if (!lista.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhuma campanha ainda. Clique em "+ Nova Campanha" para criar.</div>';
      return;
    }
    lista.forEach(c => {
      const nAg = (c.agentes || []).length;
      const coverStyle = c.capa ? "background-image:url('" + c.capa + "')" : '';
      const card = document.createElement('div');
      card.className = 'camp-card';
      card.innerHTML =
        '<div class="camp-cover" style="' + coverStyle + '">' +
          '<span class="badge">👥 ' + nAg + '</span>' +
          '<button type="button" class="del-camp" data-id="' + c.id + '" title="Excluir">🗑</button>' +
        '</div>' +
        '<div class="camp-body">' +
          '<h3>' + escapeCamp(c.nome) + '</h3>' +
          '<div class="meta">Iniciada em: ' + formatarData(c.criadaEm) + '</div>' +
          '<button type="button" class="btn-acessar" data-id="' + c.id + '">Acessar</button>' +
        '</div>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-acessar').forEach(btn => {
      btn.addEventListener('click', () => abrirCampanha(btn.dataset.id));
    });
    grid.querySelectorAll('.del-camp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!confirm('Excluir esta campanha? As fichas dos agentes não serão apagadas.')) return;
        salvarCampanhas(lerCampanhas().filter(c => c.id !== btn.dataset.id));
        renderCampanhas();
      });
    });
  }

  function abrirCampanha(id) {
    const c = getCampanha(id);
    if (!c) return;
    campanhaAtualId = id;
    document.getElementById('view-campanhas').hidden = true;
    document.getElementById('view-camp-detail').hidden = false;
    document.getElementById('camp-detail-nome').innerHTML =
      escapeCamp(c.nome || 'Campanha') + ' <span class="edit-hint">✎</span>';
    const nAg = (c.agentes || []).length;
    document.getElementById('camp-detail-meta').textContent =
      'Iniciada em: ' + formatarData(c.criadaEm) + ' · ' + nAg + ' agente' + (nAg === 1 ? '' : 's');
    const cover = document.getElementById('camp-detail-cover');
    if (c.capa) {
      cover.style.backgroundImage = "url('" + c.capa + "')";
      cover.textContent = '';
    } else {
      cover.style.backgroundImage = '';
      cover.textContent = '◈';
    }
    document.querySelectorAll('.camp-tab').forEach(t => t.classList.toggle('active', t.dataset.campTab === 'agentes'));
    document.getElementById('camp-tab-agentes').hidden = false;
    document.getElementById('camp-tab-jogadores').hidden = true;
    renderCampAgentes();
    renderCampJogadores();
  }

  function renderCampAgentes() {
    const grid = document.getElementById('camp-agentes-grid');
    const c = getCampanha(campanhaAtualId);
    if (!c || !grid) return;
    const agentesReg = lerAgentes();
    const ids = c.agentes || [];
    grid.innerHTML = '';
    if (!ids.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum agente nesta campanha. Clique em "Adicionar Agentes".</div>';
      return;
    }
    ids.forEach(agId => {
      const a = agentesReg.find(x => x.id === agId) || { id: agId, nome: 'Agente removido', classe: '—' };
      const card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.innerHTML =
        '<button type="button" class="rm-ag" data-id="' + a.id + '" title="Remover da campanha">✕</button>' +
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
  }

  function renderCampJogadores() {
    const grid = document.getElementById('camp-jogadores-grid');
    const c = getCampanha(campanhaAtualId);
    if (!c || !grid) return;
    const jogs = c.jogadoresLista || [];
    grid.innerHTML = '';
    if (!jogs.length) {
      grid.innerHTML = '<div class="ag-empty">Nenhum jogador cadastrado ainda.</div>';
      return;
    }
    jogs.forEach(j => {
      const card = document.createElement('div');
      card.className = 'camp-ag-card';
      card.innerHTML = '<h3>' + escapeCamp(j.nome || 'Jogador') + '</h3><div class="meta">' + escapeCamp(j.nota || '') + '</div>';
      grid.appendChild(card);
    });
  }

  function abrirModalAgentes() {
    const modal = document.getElementById('modal-add-agentes');
    const lista = document.getElementById('modal-agentes-lista');
    const c = getCampanha(campanhaAtualId);
    if (!c || !modal || !lista) return;
    const ja = {};
    (c.agentes || []).forEach(id => { ja[id] = true; });
    const agentes = lerAgentes().sort((a,b) => (a.nome||'').localeCompare(b.nome||''));
    if (!agentes.length) {
      lista.innerHTML = '<p class="empty-msg">Você ainda não tem fichas. Crie um agente primeiro.</p>';
    } else {
      lista.innerHTML = agentes.map(a =>
        '<label class="modal-ag-item">' +
          '<input type="checkbox" value="' + a.id + '"' + (ja[a.id] ? ' checked' : '') + ' />' +
          '<div class="info"><strong>' + escapeCamp(a.nome || 'Sem nome') + '</strong>' +
          '<span>' + escapeCamp(CLASSE_LABEL[a.classe] || a.classe || '—') + ' · NEX ' + (a.nex ?? 5) + '%</span></div>' +
        '</label>'
      ).join('');
    }
    modal.hidden = false;
  }

  function confirmarAgentes() {
    const checks = document.querySelectorAll('#modal-agentes-lista input[type="checkbox"]');
    const ids = [];
    checks.forEach(ch => { if (ch.checked) ids.push(ch.value); });
    atualizarCampanha(campanhaAtualId, { agentes: ids });
    document.getElementById('modal-add-agentes').hidden = true;
    renderCampAgentes();
    const c = getCampanha(campanhaAtualId);
    if (c) {
      document.getElementById('camp-detail-meta').textContent =
        'Iniciada em: ' + formatarData(c.criadaEm) + ' · ' + ids.length + ' agente' + (ids.length === 1 ? '' : 's');
    }
  }

  function renomearCampanha() {
    const c = getCampanha(campanhaAtualId);
    if (!c) return;
    const nome = prompt('Nome da campanha:', c.nome || '');
    if (nome === null) return;
    const n = nome.trim();
    if (!n) { alert('O nome não pode ficar vazio.'); return; }
    atualizarCampanha(campanhaAtualId, { nome: n });
    abrirCampanha(campanhaAtualId);
  }

  function bind() {
    const btnNova = document.getElementById('btn-nova-campanha');
    if (btnNova) {
      const novo = btnNova.cloneNode(true);
      btnNova.parentNode.replaceChild(novo, btnNova);
      novo.addEventListener('click', () => {
        const nome = prompt('Nome da campanha:');
        if (!nome || !nome.trim()) return;
        const lista = lerCampanhas();
        lista.push({ id: 'camp_' + Date.now().toString(36), nome: nome.trim(), agentes: [], jogadoresLista: [], capa: null, criadaEm: Date.now() });
        salvarCampanhas(lista);
        renderCampanhas();
      });
    }

    const btnVoltar = document.getElementById('btn-voltar-campanhas');
    if (btnVoltar) btnVoltar.addEventListener('click', () => renderCampanhas());

    const btnAdd = document.getElementById('btn-camp-add-agentes');
    if (btnAdd) btnAdd.addEventListener('click', abrirModalAgentes);

    const btnClose = document.getElementById('modal-add-agentes-close');
    if (btnClose) btnClose.addEventListener('click', () => { document.getElementById('modal-add-agentes').hidden = true; });

    const btnConf = document.getElementById('btn-confirmar-agentes');
    if (btnConf) btnConf.addEventListener('click', confirmarAgentes);

    const btnEdit = document.getElementById('btn-camp-editar');
    if (btnEdit) btnEdit.addEventListener('click', renomearCampanha);

    const titulo = document.getElementById('camp-detail-nome');
    if (titulo) {
      titulo.style.cursor = 'pointer';
      titulo.title = 'Clique para editar o nome';
      titulo.addEventListener('click', renomearCampanha);
    }

    const btnCapa = document.getElementById('btn-camp-capa');
    const fileCapa = document.getElementById('camp-capa-file');
    if (btnCapa && fileCapa) {
      btnCapa.addEventListener('click', () => fileCapa.click());
      fileCapa.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          atualizarCampanha(campanhaAtualId, { capa: reader.result });
          abrirCampanha(campanhaAtualId);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
    }

    document.querySelectorAll('.camp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.camp-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset.campTab;
        document.getElementById('camp-tab-agentes').hidden = which !== 'agentes';
        document.getElementById('camp-tab-jogadores').hidden = which !== 'jogadores';
      });
    });

    document.querySelectorAll('.ag-nav a').forEach(link => {
      link.addEventListener('click', () => {
        const view = link.dataset.view;
        const detail = document.getElementById('view-camp-detail');
        if (detail) detail.hidden = true;
        if (view === 'campanhas') setTimeout(renderCampanhas, 0);
      });
    });

    window.renderCampanhas = renderCampanhas;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
