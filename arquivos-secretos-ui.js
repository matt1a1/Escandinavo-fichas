/* arquivos-secretos-ui.js — aba Arquivos Secretos (botões + cards expansíveis) */
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

  var stateFiltro = { tipo: 'todos', livro: 'todos', q: '', aberto: null };

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
        '.arq-wrap { display:flex; flex-direction:column; gap:10px; }',
        '.arq-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }',
        '.arq-title { margin:0; font-size:0.95rem; color:#f0c674; }',
        '.arq-count { font-size:0.72rem; color:var(--text-dim,#8888a0); background:rgba(240,198,116,0.1); border:1px solid rgba(240,198,116,0.25); border-radius:999px; padding:2px 8px; }',
        '.arq-search { width:100%; box-sizing:border-box; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.25); color:inherit; font-size:0.85rem; }',
        '.arq-search:focus { outline:none; border-color:rgba(240,198,116,0.5); }',
        '.arq-section { display:flex; flex-direction:column; gap:6px; }',
        '.arq-label { font-size:0.68rem; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-dim,#8888a0); }',
        '.arq-btns { display:flex; flex-wrap:wrap; gap:6px; }',
        '.arq-chip { border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03); color:var(--text-dim,#aaa); border-radius:999px; padding:5px 11px; font-size:0.75rem; cursor:pointer; transition:all .15s; }',
        '.arq-chip:hover { border-color:rgba(240,198,116,0.4); color:#f0c674; }',
        '.arq-chip.active { background:rgba(240,198,116,0.15); border-color:rgba(240,198,116,0.55); color:#f0c674; font-weight:600; }',
        '.arq-list { display:flex; flex-direction:column; gap:8px; max-height:calc(100vh - 280px); overflow:auto; padding-right:2px; }',
        '.arq-card { border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.18); border-radius:10px; overflow:hidden; }',
        '.arq-card-btn { width:100%; text-align:left; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; background:transparent; border:0; color:inherit; cursor:pointer; }',
        '.arq-card-btn:hover { background:rgba(255,255,255,0.03); }',
        '.arq-card-main { display:flex; flex-direction:column; gap:4px; min-width:0; }',
        '.arq-card-name { font-size:0.88rem; font-weight:600; }',
        '.arq-card-tags { display:flex; flex-wrap:wrap; gap:4px; }',
        '.arq-tag { font-size:0.65rem; padding:2px 7px; border-radius:999px; border:1px solid rgba(255,255,255,0.1); color:#bbb; }',
        '.arq-tag-tipo { color:#c4b5fd; border-color:rgba(124,92,255,0.35); background:rgba(124,92,255,0.12); }',
        '.arq-tag-livro { color:#f0c674; border-color:rgba(240,198,116,0.35); background:rgba(240,198,116,0.1); }',
        '.arq-card-arrow { font-size:0.85rem; color:var(--text-dim,#888); flex-shrink:0; }',
        '.arq-card.open .arq-card-arrow { transform:rotate(90deg); }',
        '.arq-card-body { display:none; padding:0 12px 12px; border-top:1px solid rgba(255,255,255,0.06); }',
        '.arq-card.open .arq-card-body { display:block; }',
        '.arq-card-desc { font-size:0.8rem; line-height:1.45; color:#d0d0dc; white-space:pre-wrap; margin:10px 0 12px; }',
        '.arq-add { width:100%; }',
        '.arq-empty { font-size:0.8rem; color:var(--text-dim,#888); padding:16px 4px; text-align:center; }',
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
        stateFiltro.aberto = null;
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
        stateFiltro.aberto = null;
        tiposEl.querySelectorAll('.arq-chip').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        renderList();
      });
      tiposEl.appendChild(b);
    });

    var search = document.getElementById('arq-search');
    search.addEventListener('input', function () {
      stateFiltro.q = (search.value || '').trim().toLowerCase();
      stateFiltro.aberto = null;
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
    if (count) count.textContent = items.length;

    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<p class="arq-empty">Nada encontrado com esses filtros.</p>';
      return;
    }

    items.forEach(function (e, idx) {
      var key = (e.livro || '') + '|' + (e.tipo || '') + '|' + (e.nome || '') + '|' + idx;
      var isOpen = stateFiltro.aberto === key;

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
      card.className = 'arq-card' + (isOpen ? ' open' : '');

      card.innerHTML =
        '<button type="button" class="arq-card-btn" data-arq-key="' + escapeHtml(key) + '">' +
        '  <div class="arq-card-main">' +
        '    <div class="arq-card-name">' + escapeHtml(e.nome) + '</div>' +
        '    <div class="arq-card-tags">' + tags.join('') + '</div>' +
        '  </div>' +
        '  <span class="arq-card-arrow">›</span>' +
        '</button>' +
        '<div class="arq-card-body">' +
        '  <div class="arq-card-desc">' + escapeHtml(e.desc || '') + '</div>' +
        '  <button type="button" class="btn primary small arq-add" data-arq-add="' + idx + '">Adicionar à ficha</button>' +
        '</div>';

      list.appendChild(card);
    });

    var current = items;
    list.querySelectorAll('.arq-card-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-arq-key');
        stateFiltro.aberto = (stateFiltro.aberto === key) ? null : key;
        renderList();
      });
    });
    list.querySelectorAll('[data-arq-add]').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var i = +btn.getAttribute('data-arq-add');
        if (current[i]) addToSheet(current[i]);
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
