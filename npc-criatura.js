/* npc-criatura.js — Aba NPC + Criatura/Ameaça: listas, ficha livre e geradores */
(function () {
  var NPC_KEY = 'escandinavo-npcs-registro';
  var CRI_KEY = 'escandinavo-criaturas-registro';

  function ler(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }
  function salvar(key, lista) { localStorage.setItem(key, JSON.stringify(lista)); }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function baseFicha(extra) {
    var f = {
      nome: '', jogador: '', origem: 'investigador', classe: 'combatente', nex: 5, patente: 'Recruta',
      tipoFicha: 'custom',
      atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
      vidaAtual: null, sanAtual: null, peAtual: null,
      pvMaxOverride: null, sanMaxOverride: null, peMaxOverride: null,
      aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
      habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
      itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
      mascaraAtiva: false,
      categoriaEntidade: 'npc'
    };
    if (extra) Object.keys(extra).forEach(function (k) { f[k] = extra[k]; });
    return f;
  }

  function criarEAbrir(registroKey, prefix, ficha, meta) {
    var id = uid(prefix);
    ficha.categoriaEntidade = meta.categoria || 'npc';
    localStorage.setItem('escandinavo-ficha-' + id, JSON.stringify(ficha));
    var reg = ler(registroKey);
    reg.push({
      id: id,
      nome: ficha.nome || meta.nomePadrao || 'Sem nome',
      classe: ficha.classe || '',
      origem: ficha.origem || '',
      nex: ficha.nex || 5,
      tipoFicha: ficha.tipoFicha || 'custom',
      gerador: meta.gerador || '',
      atualizadoEm: Date.now()
    });
    salvar(registroKey, reg);
    window.location.href = 'ficha.html?id=' + encodeURIComponent(id);
  }

  function geradorLivreNpc() {
    return baseFicha({
      nome: '',
      tipoFicha: 'custom',
      anotacoes: 'NPC — ficha livre (sem limites).'
    });
  }

  function geradorAgenteOrdem() {
    return baseFicha({
      nome: 'Agente da Ordem',
      origem: 'policial',
      classe: 'combatente',
      nex: 25,
      tipoFicha: 'custom',
      atributos: { for: 2, agi: 2, int: 1, pre: 1, vig: 2 },
      pvMaxOverride: 28,
      sanMaxOverride: 22,
      peMaxOverride: 12,
      vidaAtual: 28,
      sanAtual: 22,
      peAtual: 12,
      habilidades: [
        { nome: 'Patrulha', desc: '+2 na Defesa (origem/treino de campo).' },
        { nome: 'Ataque Especial', desc: 'Gasto de PE para ataque aprimorado.' }
      ],
      anotacoes: 'Gerado: Agente da Ordem (Arquivos Secretos). Ajuste nome e detalhes à mesa.'
    });
  }

  function geradorPanaceia() {
    return baseFicha({
      nome: 'Pesquisador da Panaceia',
      origem: 'academico',
      classe: 'especialista',
      nex: 30,
      tipoFicha: 'custom',
      atributos: { for: 1, agi: 1, int: 3, pre: 2, vig: 1 },
      pvMaxOverride: 18,
      sanMaxOverride: 30,
      peMaxOverride: 16,
      vidaAtual: 18,
      sanAtual: 30,
      peAtual: 16,
      habilidades: [
        { nome: 'Método Científico', desc: 'Bônus em Ciências e Medicina em análises prolongadas.' },
        { nome: 'Protocolo Panaceia', desc: 'Pode estabilizar aliados com equipamentos de campo.' }
      ],
      rituais: [],
      anotacoes: 'Gerado: Pesquisador da Panaceia. Foco em investigação e suporte.'
    });
  }

  function geradorHellHunter() {
    return baseFicha({
      nome: 'Hell Hunter',
      origem: 'mercenario',
      classe: 'combatente',
      nex: 40,
      tipoFicha: 'custom',
      atributos: { for: 3, agi: 2, int: 1, pre: 1, vig: 2 },
      pvMaxOverride: 36,
      sanMaxOverride: 18,
      peMaxOverride: 14,
      vidaAtual: 36,
      sanAtual: 18,
      peAtual: 14,
      habilidades: [
        { nome: 'Caçador do Inferno', desc: 'Bônus contra criaturas paranormais identificadas.' },
        { nome: 'Arsenal Improvisado', desc: 'Sabe usar armas táticas e equipamentos especiais.' }
      ],
      ataques: [{ nome: 'Espingarda ritual', dano: '3d8', tipo: 'balístico' }],
      anotacoes: 'Gerado: Hell Hunter (Arquivos Secretos). Ajuste arsenal e NEX.'
    });
  }

  function geradorCriaturaLivre() {
    return baseFicha({
      nome: '',
      tipoFicha: 'custom',
      categoriaEntidade: 'criatura',
      classe: 'combatente',
      origem: 'desgarrado',
      anotacoes: 'Criatura/Ameaça — ficha livre.'
    });
  }

  function geradorVampiro() {
    return baseFicha({
      nome: 'Vampiro',
      origem: 'vitima',
      classe: 'ocultista',
      nex: 50,
      tipoFicha: 'custom',
      categoriaEntidade: 'criatura',
      atributos: { for: 3, agi: 3, int: 2, pre: 3, vig: 2 },
      pvMaxOverride: 45,
      sanMaxOverride: 25,
      peMaxOverride: 20,
      vidaAtual: 45,
      sanAtual: 25,
      peAtual: 20,
      habilidades: [
        { nome: 'Sede de Sangue', desc: 'Ao reduzir um alvo a 0 PV, recupera 2d6+2 PV.' },
        { nome: 'Forma Noturna', desc: 'Na escuridão, +2 em Furtividade e ataque.' },
        { nome: 'Resistência Morta-Viva', desc: 'Reduz 3 de dano balístico (exceto prata/ritual).' }
      ],
      rituais: [
        { nome: 'Vampirismo', desc: 'Ritual de Sangue — transforma corpo em refeição paranormal (vasos).' }
      ],
      ataques: [
        { nome: 'Garras', dano: '2d6+3', tipo: 'cortante' },
        { nome: 'Mordida', dano: '1d8+2', tipo: 'perfurante' }
      ],
      anotacoes: 'Gerado: Vampiro. Use DT e NEX conforme a mesa. Vulnerável a rituais de Energia/Conhecimento conforme narrativa.'
    });
  }

  function ensureModal() {
    if (document.getElementById('modal-npc-criatura')) return;
    var wrap = document.createElement('div');
    wrap.id = 'modal-npc-criatura';
    wrap.className = 'wizard-overlay';
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="wizard-panel" style="max-width:560px">' +
      '  <div class="wizard-top"><div class="brand" id="nc-modal-title">Novo</div>' +
      '    <button type="button" class="btn-ghost" id="nc-modal-close">Fechar</button></div>' +
      '  <div class="wizard-body" id="nc-modal-body"></div>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) wrap.hidden = true;
    });
    document.getElementById('nc-modal-close').onclick = function () { wrap.hidden = true; };
  }

  function cardBtn(id, nome, desc) {
    return (
      '<button type="button" class="tipo-ficha-card" data-nc="' + id + '" style="text-align:left;cursor:pointer">' +
      '<strong>' + nome + '</strong>' +
      '<span style="display:block;font-size:.8rem;color:var(--ag-text-dim);margin-top:6px">' + desc + '</span>' +
      '</button>'
    );
  }

  function abrirModal(kind) {
    ensureModal();
    var modal = document.getElementById('modal-npc-criatura');
    var title = document.getElementById('nc-modal-title');
    var body = document.getElementById('nc-modal-body');
    modal.hidden = false;

    if (kind === 'npc') {
      title.textContent = 'Novo NPC';
      body.innerHTML =
        '<p style="color:var(--ag-text-dim);margin:0 0 14px;font-size:.9rem">Escolha o tipo de ficha:</p>' +
        '<div class="tipo-ficha-grid">' +
        cardBtn('livre', 'Ficha Livre', 'Totalmente editável, sem restrições.') +
        cardBtn('ordem', 'Agente da Ordem', 'Gerador automático com base nos Arquivos Secretos.') +
        cardBtn('panaceia', 'Pesquisador da Panaceia', 'Gerador automático — foco científico/suporte.') +
        cardBtn('hell', 'Hell Hunter', 'Gerador automático — caçador paranormal.') +
        '</div>';
      body.querySelectorAll('[data-nc]').forEach(function (btn) {
        btn.onclick = function () {
          var t = btn.getAttribute('data-nc');
          var ficha, gerador;
          if (t === 'livre') { ficha = geradorLivreNpc(); gerador = 'livre'; }
          else if (t === 'ordem') { ficha = geradorAgenteOrdem(); gerador = 'agente-ordem'; }
          else if (t === 'panaceia') { ficha = geradorPanaceia(); gerador = 'panaceia'; }
          else { ficha = geradorHellHunter(); gerador = 'hell-hunter'; }
          criarEAbrir(NPC_KEY, 'npc', ficha, { categoria: 'npc', gerador: gerador, nomePadrao: ficha.nome || 'NPC' });
        };
      });
    } else {
      title.textContent = 'Nova Criatura / Ameaça';
      body.innerHTML =
        '<p style="color:var(--ag-text-dim);margin:0 0 14px;font-size:.9rem">Escolha o tipo de ficha:</p>' +
        '<div class="tipo-ficha-grid">' +
        cardBtn('livre', 'Ficha Livre', 'Criatura totalmente editável.') +
        cardBtn('vampiro', 'Vampiro', 'Gerador automático da criatura Vampiro.') +
        '</div>';
      body.querySelectorAll('[data-nc]').forEach(function (btn) {
        btn.onclick = function () {
          var t = btn.getAttribute('data-nc');
          var ficha = t === 'vampiro' ? geradorVampiro() : geradorCriaturaLivre();
          criarEAbrir(CRI_KEY, 'cri', ficha, {
            categoria: 'criatura',
            gerador: t === 'vampiro' ? 'vampiro' : 'livre',
            nomePadrao: ficha.nome || 'Criatura'
          });
        };
      });
    }
  }

  function formatarData(ts) {
    try {
      var d = new Date(ts);
      return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  function renderLista(opts) {
    var lista = ler(opts.key).sort(function (a, b) { return (b.atualizadoEm || 0) - (a.atualizadoEm || 0); });
    var q = (opts.searchEl && opts.searchEl.value || '').toLowerCase().trim();
    if (q) lista = lista.filter(function (a) {
      return (a.nome || '').toLowerCase().indexOf(q) >= 0 ||
        (a.gerador || '').toLowerCase().indexOf(q) >= 0 ||
        (a.classe || '').toLowerCase().indexOf(q) >= 0;
    });
    if (opts.countEl) opts.countEl.textContent = String(ler(opts.key).length);
    var grid = opts.gridEl;
    if (!grid) return;
    grid.innerHTML = '';
    if (!lista.length) {
      grid.innerHTML = '<div class="ag-empty">' + opts.empty + '</div>';
      return;
    }
    lista.forEach(function (a) {
      var card = document.createElement('div');
      card.className = 'ag-card';
      var badge = a.gerador
        ? '<span class="ag-tipo-badge tipo-custom">' + (a.gerador || '') + '</span>'
        : '';
      card.innerHTML =
        '<button class="del" title="Excluir" data-id="' + a.id + '">✕</button>' +
        '<div class="avatar">' + opts.icon + '</div>' +
        '<h3>' + (a.nome || 'Sem nome') + '</h3>' +
        '<div class="meta">' + (a.classe || '—') + ' · NEX ' + (a.nex != null ? a.nex : 5) + '% · ' + formatarData(a.atualizadoEm) + '</div>' +
        badge +
        '<a class="acessar" href="ficha.html?id=' + encodeURIComponent(a.id) + '">Acessar Ficha</a>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Excluir? Essa ação não pode ser desfeita.')) return;
        var id = btn.dataset.id;
        salvar(opts.key, ler(opts.key).filter(function (x) { return x.id !== id; }));
        localStorage.removeItem('escandinavo-ficha-' + id);
        renderLista(opts);
      });
    });
  }

  function bind() {
    var npcOpts = {
      key: NPC_KEY,
      gridEl: document.getElementById('npc-grid'),
      countEl: document.getElementById('npc-count'),
      searchEl: document.getElementById('npc-search'),
      empty: 'Nenhum NPC ainda. Use + Novo NPC para ficha livre ou geradores.',
      icon: '👤'
    };
    var criOpts = {
      key: CRI_KEY,
      gridEl: document.getElementById('criatura-grid'),
      countEl: document.getElementById('criatura-count'),
      searchEl: document.getElementById('criatura-search'),
      empty: 'Nenhuma criatura ainda. Use + Nova Criatura para ficha livre ou gerador de Vampiro.',
      icon: '☠'
    };

    function goNpc() { abrirModal('npc'); }
    function goCri() { abrirModal('criatura'); }

    ['btn-novo-npc', 'btn-novo-npc-tab'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', goNpc);
    });
    var bc = document.getElementById('btn-nova-criatura');
    if (bc) bc.addEventListener('click', goCri);

    if (npcOpts.searchEl) npcOpts.searchEl.addEventListener('input', function () { renderLista(npcOpts); });
    if (criOpts.searchEl) criOpts.searchEl.addEventListener('input', function () { renderLista(criOpts); });

    document.querySelectorAll('[data-view]').forEach(function (a) {
      a.addEventListener('click', function () {
        setTimeout(function () {
          renderLista(npcOpts);
          renderLista(criOpts);
        }, 50);
      });
    });

    renderLista(npcOpts);
    renderLista(criOpts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
