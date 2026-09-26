// Campanhas completas — lista, acessar, excluir, adicionar agentes, editar nome (modal)
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
    var modal = document.getElementById('modal-renomear-camp');
    var input = document.getElementById('input-nome-campanha');
    if (!modal || !input) return;
    input.value = c.nome || '';
    input.style.borderColor = '';
    modal.hidden = false;
    setTimeout(function () { input.focus(); input.select(); }, 50);
  }

  function fecharModalRenomear() {
    var modal = document.getElementById('modal-renomear-camp');
    if (modal) modal.hidden = true;
  }

  function salvarNomeCampanha() {
    var input = document.getElementById('input-nome-campanha');
    if (!input) return;
    var n = (input.value || '').trim();
    if (!n) {
      input.style.borderColor = 'var(--ag-danger)';
      input.focus();
      return;
    }
    input.style.borderColor = '';
    atualizarCampanha(campanhaAtualId, { nome: n });
    fecharModalRenomear();
    abrirCampanha(campanhaAtualId);
  }

  function ensureModalRenomear() {
    if (document.getElementById('modal-renomear-camp')) return;
    var div = document.createElement('div');
    div.id = 'modal-renomear-camp';
    div.className = 'wizard-overlay';
    div.hidden = true;
    div.innerHTML =
      '<div class="modal-box" style="max-width:420px">' +
        '<div class="wizard-top">' +
          '<span class="brand">Editar campanha</span>' +
          '<button type="button" class="btn-ghost" id="modal-renomear-close">Fechar</button>' +
        '</div>' +
        '<div class="modal-box-body">' +
          '<label for="input-nome-campanha" style="display:block;font-size:.85rem;color:var(--ag-text-dim);margin-bottom:8px">Nome da campanha</label>' +
          '<input type="text" id="input-nome-campanha" class="ag-search" style="margin-bottom:18px" placeholder="Ex: Escandinavo" maxlength="80" />' +
          '<div style="display:flex;justify-content:flex-end;gap:10px">' +
            '<button type="button" class="btn-ghost" id="btn-renomear-cancelar">Cancelar</button>' +
            '<button type="button" class="btn-primary" id="btn-renomear-salvar">Salvar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(div);
  }

  function bind() {
    ensureModalRenomear();

    var btnNova = document.getElementById('btn-nova-campanha');
    if (btnNova) {
      var novo = btnNova.cloneNode(true);
      btnNova.parentNode.replaceChild(novo, btnNova);
      novo.addEventListener('click', function () {
        campanhaAtualId = null;
        var modal = document.getElementById('modal-renomear-camp');
        var input = document.getElementById('input-nome-campanha');
        if (!modal || !input) return;
        input.value = '';
        input.style.borderColor = '';
        modal.hidden = false;
        // modo criar
        modal.dataset.modo = 'criar';
        var brand = modal.querySelector('.brand');
        if (brand) brand.textContent = 'Nova campanha';
        setTimeout(function () { input.focus(); }, 50);
      });
    }

    var btnVoltar = document.getElementById('btn-voltar-campanhas');
    if (btnVoltar) btnVoltar.addEventListener('click', function () { renderCampanhas(); });

    var btnAdd = document.getElementById('btn-camp-add-agentes');
    if (btnAdd) btnAdd.addEventListener('click', abrirModalAgentes);

    var btnClose = document.getElementById('modal-add-agentes-close');
    if (btnClose) btnClose.addEventListener('click', function () {
      document.getElementById('modal-add-agentes').hidden = true;
    });

    var btnConf = document.getElementById('btn-confirmar-agentes');
    if (btnConf) btnConf.addEventListener('click', confirmarAgentes);

    var btnEdit = document.getElementById('btn-camp-editar');
    if (btnEdit) btnEdit.addEventListener('click', function () {
      var modal = document.getElementById('modal-renomear-camp');
      if (modal) modal.dataset.modo = 'editar';
      var brand = modal && modal.querySelector('.brand');
      if (brand) brand.textContent = 'Editar campanha';
      renomearCampanha();
    });

    var titulo = document.getElementById('camp-detail-nome');
    if (titulo) {
      titulo.style.cursor = 'pointer';
      titulo.title = 'Clique para editar o nome';
      titulo.addEventListener('click', function () {
        var modal = document.getElementById('modal-renomear-camp');
        if (modal) modal.dataset.modo = 'editar';
        var brand = modal && modal.querySelector('.brand');
        if (brand) brand.textContent = 'Editar campanha';
        renomearCampanha();
      });
    }

    // Modal renomear / criar
    function onSalvarNome() {
      var modal = document.getElementById('modal-renomear-camp');
      var modo = modal && modal.dataset.modo;
      var input = document.getElementById('input-nome-campanha');
      if (!input) return;
      var n = (input.value || '').trim();
      if (!n) {
        input.style.borderColor = 'var(--ag-danger)';
        input.focus();
        return;
      }
      input.style.borderColor = '';
      if (modo === 'criar') {
        var lista = lerCampanhas();
        lista.push({
          id: 'camp_' + Date.now().toString(36),
          nome: n,
          agentes: [],
          jogadoresLista: [],
          capa: null,
          criadaEm: Date.now()
        });
        salvarCampanhas(lista);
        fecharModalRenomear();
        renderCampanhas();
      } else {
        salvarNomeCampanha();
      }
    }

    var btnRenClose = document.getElementById('modal-renomear-close');
    if (btnRenClose) btnRenClose.addEventListener('click', fecharModalRenomear);
    var btnRenCancel = document.getElementById('btn-renomear-cancelar');
    if (btnRenCancel) btnRenCancel.addEventListener('click', fecharModalRenomear);
    var btnRenSave = document.getElementById('btn-renomear-salvar');
    if (btnRenSave) btnRenSave.addEventListener('click', onSalvarNome);
    var inputNomeCamp = document.getElementById('input-nome-campanha');
    if (inputNomeCamp) {
      inputNomeCamp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); onSalvarNome(); }
        if (e.key === 'Escape') fecharModalRenomear();
      });
    }

    var btnCapa = document.getElementById('btn-camp-capa');
    var fileCapa = document.getElementById('camp-capa-file');
    if (btnCapa && fileCapa) {
      btnCapa.addEventListener('click', function () { fileCapa.click(); });
      fileCapa.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          atualizarCampanha(campanhaAtualId, { capa: reader.result });
          abrirCampanha(campanhaAtualId);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
    }

    document.querySelectorAll('.camp-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.camp-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var which = tab.dataset.campTab;
        document.getElementById('camp-tab-agentes').hidden = which !== 'agentes';
        document.getElementById('camp-tab-jogadores').hidden = which !== 'jogadores';
      });
    });

    document.querySelectorAll('.ag-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        var view = link.dataset.view;
        var detail = document.getElementById('view-camp-detail');
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
