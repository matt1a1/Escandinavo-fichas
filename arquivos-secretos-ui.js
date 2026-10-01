/* arquivos-secretos-ui.js — cards com descrição sob demanda */
(function () {
  const TIPOS = [
    { id: 'todos', label: 'Todos' },
    { id: 'origem', label: 'Origens' },
    { id: 'trilha', label: 'Trilhas' },
    { id: 'poder', label: 'Poderes' },
    { id: 'ritual', label: 'Rituais' },
    { id: 'item', label: 'Itens' },
    { id: 'regra', label: 'Regras' }
  ];
  const LIVROS = [
    { id: 'todos', label: 'Todos' },
    { id: 'Sangue', label: 'Sangue' },
    { id: 'Hexatombe I', label: 'Hexatombe I' },
    { id: 'Hexatombe II', label: 'Hexatombe II' },
    { id: 'Anfitrião', label: 'Anfitrião' },
    { id: 'SDOL', label: 'SDOL' },
    { id: 'Panacea', label: 'Panacea' },
    { id: 'Vampyr', label: 'Vampyr' },
    { id: 'Hellhunters', label: 'Hellhunters' }
  ];

  var stateFiltro = { tipo: 'todos', livro: 'todos', q: '' };
  var cachedItems = [];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function ensureTab() {
    var nav = document.querySelector('.tabs');
    if (!nav || document.querySelector('[data-tab="arquivos"]')) return;

    var btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.tab = 'arquivos';
    btn.type = 'button';
    btn.textContent = 'Arquivos Secretos';
    nav.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'tab-content';
    panel.id = 'tab-arquivos';
    panel.innerHTML =
      '<div class="arq-wrap">' +
      '  <div class="arq-top">' +
      '    <h4 class="arq-title">Arquivos Secretos</h4>' +
      '    <span class="arq-count" id="arq-count">0</span>' +
      '  </div>' +
      '  <input type="search" id="arq-search" class="arq-search" placeholder="Buscar por nome..." autocomplete="off" />' +
      '  <div class="arq-section">' +
      '    <span class="arq-label">Livro</span>' +
      '    <div class="arq-btns" id="arq-livros"></div>' +
      '  </div>' +
      '  <div class="arq-section">' +
      '    <span class="arq-label">Tipo</span>' +
      '    <div class="arq-btns" id="arq-tipos"></div>' +
      '  </div>' +
      '  <div id="arq-list" class="arq-list"></div>' +
      '</div>';

    var right = document.querySelector('.right-panel') || nav.parentNode;
    right.appendChild(panel);

    if (!document.getElementById('arq-styles')) {
      var s = document.createElement('style');
      s.id = 'arq-styles';
      s.textContent = [
        '#tab-arquivos .arq-wrap { display:flex; flex-direction:column; gap:12px; padding:4px 2px 12px; }',
        '#tab-arquivos .arq-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }',
        '#tab-arquivos .arq-title { margin:0; font-size:1rem; color:#f0c674; font-weight:700; }',
        '#tab-arquivos .arq-count { font-size:0.75rem; color:#f0c674; background:rgba(240,198,116,0.12); border:1px solid rgba(240,198,116,0.3); border-radius:999px; padding:3px 10px; }',
        '#tab-arquivos .arq-search { width:100%; box-sizing:border-box; padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); background:#12121a; color:#e8e8f0; font-size:0.9rem; }',
        '#tab-arquivos .arq-search:focus { outline:none; border-color:#f0c674; }',
        '#tab-arquivos .arq-section { display:flex; flex-direction:column; gap:8px; }',
        '#tab-arquivos .arq-label { font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em; color:#9a9ab0; font-weight:600; }',
        '#tab-arquivos .arq-btns { display:flex; flex-wrap:wrap; gap:8px; }',
        '#tab-arquivos .arq-chip { border:1px solid rgba(255,255,255,0.14); background:#1a1a24; color:#c8c8d8; border-radius:999px; padding:7px 14px; font-size:0.8rem; cursor:pointer; line-height:1.2; }',
        '#tab-arquivos .arq-chip:hover { border-color:rgba(240,198,116,0.5); color:#f0c674; }',
        '#tab-arquivos .arq-chip.active { background:rgba(240,198,116,0.18); border-color:#f0c674; color:#f0c674; font-weight:700; }',
        '#tab-arquivos .arq-list { display:flex; flex-direction:column; gap:10px; max-height:calc(100vh - 300px); overflow-y:auto; padding:4px 2px 24px; }',
        '#tab-arquivos .arq-card { border:1px solid rgba(255,255,255,0.1); background:#16161f; border-radius:12px; padding:12px 14px; }',
        '#tab-arquivos .arq-card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; cursor:pointer; }',
        '#tab-arquivos .arq-card-info { flex:1; min-width:0; }',
        '#tab-arquivos .arq-card-name { font-size:0.95rem; font-weight:700; color:#f2f2f8; margin:0 0 6px; line-height:1.3; }',
        '#tab-arquivos .arq-card-tags { display:flex; flex-wrap:wrap; gap:5px; }',
        '#tab-arquivos .arq-tag { font-size:0.68rem; padding:3px 8px; border-radius:999px; border:1px solid rgba(255,255,255,0.12); color:#b8b8c8; background:rgba(255,255,255,0.04); }',
        '#tab-arquivos .arq-tag-tipo { color:#c4b5fd; border-color:rgba(124,92,255,0.4); background:rgba(124,92,255,0.14); }',
        '#tab-arquivos .arq-tag-livro { color:#f0c674; border-color:rgba(240,198,116,0.4); background:rgba(240,198,116,0.12); }',
        '#tab-arquivos .arq-add { flex-shrink:0; white-space:nowrap; padding:8px 14px !important; font-size:0.8rem !important; min-height:36px; cursor:pointer; }',
        '#tab-arquivos .arq-card-desc { display:none; font-size:0.84rem; line-height:1.5; color:#d0d0dc; white-space:pre-wrap; margin:10px 0 0; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08); word-break:break-word; overflow:visible; max-height:none; }',
        '#tab-arquivos .arq-card.open .arq-card-desc { display:block; }',
        '#tab-arquivos .arq-card.open { border-color:rgba(240,198,116,0.35); }',
        '#tab-arquivos .arq-empty { font-size:0.85rem; color:#9a9ab0; padding:24px 8px; text-align:center; }',
        '.tab[data-tab="arquivos"].active { color:#f0c674; border-bottom-color:#f0c674; }'
      ].join('\n');
      document.head.appendChild(s);
    }

    var livrosEl = document.getElementById('arq-livros');
    LIVROS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'arq-chip' + (l.id === 'todos' ? ' active' : '');
      b.dataset.livro = l.id;
      b.textContent = l.label;
      b.addEventListener('click', function () {
        stateFiltro.livro = l.id;
        livrosEl.querySelectorAll('.arq-chip').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        renderList();
      });
      livrosEl.appendChild(b);
    });

    var tiposEl = document.getElementById('arq-tipos');
    TIPOS.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'arq-chip' + (t.id === 'todos' ? ' active' : '');
      b.dataset.tipo = t.id;
      b.textContent = t.label;
      b.addEventListener('click', function () {
        stateFiltro.tipo = t.id;
        tiposEl.querySelectorAll('.arq-chip').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        renderList();
      });
      tiposEl.appendChild(b);
    });

    var search = document.getElementById('arq-search');
    search.addEventListener('input', function () {
      stateFiltro.q = (search.value || '').trim().toLowerCase();
      renderList();
    });

    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      panel.classList.add('active');
      renderList();
    });

    document.querySelectorAll('.tab:not([data-tab="arquivos"])').forEach(function (t) {
      t.addEventListener('click', function () {
        panel.classList.remove('active');
        btn.classList.remove('active');
      });
    });

    renderList();
  }

  function filtered() {
    if (typeof ARQUIVOS_SECRETOS === 'undefined') return [];
    var q = stateFiltro.q;
    var tipo = stateFiltro.tipo;
    var livro = stateFiltro.livro;
    return ARQUIVOS_SECRETOS.filter(function (e) {
      if (tipo !== 'todos' && e.tipo !== tipo) return false;
      if (livro !== 'todos' && e.livro !== livro) return false;
      if (!q) return true;
      var blob = [e.nome, e.desc, e.tipo, e.livro, e.classe, e.trilha, e.elemento].join(' ').toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function addToSheet(e) {
    if (typeof window.addArquivoSecretoToSheet === 'function') {
      window.addArquivoSecretoToSheet(e);
      return;
    }
    if (!window.state) {
      alert('Ficha ainda não carregou.');
      return;
    }
    if (e.tipo === 'ritual') {
      state.rituais = state.rituais || [];
      state.rituais.push({
        nome: e.nome, elemento: e.elemento || '', circulo: e.circulo || '',
        execucao: '', alcance: '', area: '', alvo: '', duracao: '',
        efeito: e.desc, resistencia: '', dados: '', dadosDiscente: '', dadosVerdadeiro: '',
        imagem: '', desc: '[Arquivos Secretos — ' + e.livro + '] ' + e.desc
      });
      if (typeof renderRituais === 'function') renderRituais();
    } else if (e.tipo === 'item') {
      state.itens = state.itens || [];
      state.itens.push({
        nome: e.nome, tipo: 'geral', categoria: e.categoria || '0', espacos: e.espacos || '1',
        desc: '[Arquivos Secretos — ' + e.livro + '] ' + e.desc
      });
      if (typeof renderItens === 'function') renderItens();
    } else {
      state.habilidades = state.habilidades || [];
      var prefix = e.tipo === 'origem' ? 'Origem: ' : e.tipo === 'trilha' ? 'Trilha: ' : e.tipo === 'regra' ? 'Regra: ' : '';
      state.habilidades.push({
        nome: prefix + e.nome,
        desc: '[Arquivos Secretos — ' + e.livro + ']' +
          (e.nex ? ' NEX ' + e.nex + '.' : '') +
          (e.classe ? ' Classe: ' + e.classe + '.' : '') +
          (e.trilha ? ' Trilha: ' + e.trilha + '.' : '') +
          ' ' + e.desc
      });
      if (typeof renderHabilidades === 'function') renderHabilidades();
    }
    if (typeof scheduleSave === 'function') scheduleSave();
    else if (typeof saveState === 'function') saveState();
  }

  function renderList() {
    var list = document.getElementById('arq-list');
    var count = document.getElementById('arq-count');
    if (!list) return;
    var items = filtered();
    cachedItems = items;
    if (count) count.textContent = String(items.length);

    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<p class="arq-empty">Nada encontrado com esses filtros.</p>';
      return;
    }

    items.forEach(function (e, idx) {
      var tags = [];
      tags.push('<span class="arq-tag arq-tag-tipo">' + escapeHtml(e.tipo) + '</span>');
      tags.push('<span class="arq-tag arq-tag-livro">' + escapeHtml(e.livro) + '</span>');
      if (e.nex) tags.push('<span class="arq-tag">NEX ' + escapeHtml(e.nex) + '</span>');
      if (e.classe) tags.push('<span class="arq-tag">' + escapeHtml(e.classe) + '</span>');
      if (e.trilha) tags.push('<span class="arq-tag">' + escapeHtml(e.trilha) + '</span>');
      if (e.circulo) tags.push('<span class="arq-tag">' + escapeHtml(String(e.circulo)) + 'º</span>');
      if (e.elemento) tags.push('<span class="arq-tag">' + escapeHtml(e.elemento) + '</span>');
      if (e.categoria) tags.push('<span class="arq-tag">Cat. ' + escapeHtml(e.categoria) + '</span>');

      var card = document.createElement('div');
      card.className = 'arq-card';
      card.setAttribute('data-arq-idx', String(idx));

      card.innerHTML =
        '<div class="arq-card-head">' +
        '  <div class="arq-card-info">' +
        '    <div class="arq-card-name">' + escapeHtml(e.nome) + '</div>' +
        '    <div class="arq-card-tags">' + tags.join('') + '</div>' +
        '  </div>' +
        '  <button type="button" class="btn primary small arq-add" data-arq-add="' + idx + '">Adicionar</button>' +
        '</div>' +
        '<div class="arq-card-desc">' + escapeHtml(e.desc || '') + '</div>';

      card.querySelector('.arq-card-head').addEventListener('click', function (ev) {
        if (ev.target.closest && ev.target.closest('.arq-add')) return;
        var wasOpen = card.classList.contains('open');
        list.querySelectorAll('.arq-card.open').forEach(function (c) {
          if (c !== card) c.classList.remove('open');
        });
        if (wasOpen) card.classList.remove('open');
        else card.classList.add('open');
      });

      list.appendChild(card);
    });

    list.querySelectorAll('[data-arq-add]').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var i = +btn.getAttribute('data-arq-add');
        if (cachedItems[i]) addToSheet(cachedItems[i]);
      });
    });
  }

  function boot() {
    var n = 0;
    var t = setInterval(function () {
      n++;
      var tabsReady = !!document.querySelector('.tabs');
      var dataReady = typeof ARQUIVOS_SECRETOS !== 'undefined';
      if ((tabsReady && dataReady) || n > 100) {
        clearInterval(t);
        if (tabsReady) ensureTab();
      }
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
