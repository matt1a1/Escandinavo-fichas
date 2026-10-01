/* arquivos-secretos-ui.js — aba Arquivos Secretos */
(function () {
  const TIPOS = ['todos', 'origem', 'trilha', 'poder', 'ritual', 'item', 'regra'];
  const LIVROS = ['todos', 'Sangue', 'Hexatombe I', 'Hexatombe II', 'Anfitrião', 'SDOL', 'Panacea', 'Vampyr', 'Hellhunters'];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&').replace(/</g, '<')
      .replace(/>/g, '>').replace(/"/g, '"');
  }

  function ensureTab() {
    const nav = document.querySelector('.tabs');
    if (!nav || document.querySelector('[data-tab="arquivos"]')) return;

    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.tab = 'arquivos';
    btn.type = 'button';
    btn.textContent = 'Arquivos Secretos';
    nav.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'tab-content';
    panel.id = 'tab-arquivos';
    panel.innerHTML =
      '<div class="catalog-panel arq-panel">' +
      '  <div class="catalog-header">' +
      '    <h4>Arquivos Secretos</h4>' +
      '    <span class="catalog-count" id="arq-count">0</span>' +
      '  </div>' +
      '  <p class="arq-hint">Conteúdo dos livros Arquivos Secretos (01–09). Filtre e adicione à ficha.</p>' +
      '  <div class="catalog-filters arq-filters">' +
      '    <input type="search" id="arq-search" placeholder="Buscar..." autocomplete="off" />' +
      '    <select id="arq-tipo"></select>' +
      '    <select id="arq-livro"></select>' +
      '  </div>' +
      '  <div id="arq-list" class="catalog-list arq-list"></div>' +
      '</div>';

    const right = document.querySelector('.right-panel') || nav.parentNode;
    right.appendChild(panel);

    if (!document.getElementById('arq-styles')) {
      const s = document.createElement('style');
      s.id = 'arq-styles';
      s.textContent = `
        .arq-hint { font-size: 0.68rem; color: var(--text-dim, #8888a0); margin: 0 0 8px; }
        .arq-filters { grid-template-columns: 1.4fr 0.8fr 0.9fr; }
        .arq-list { max-height: calc(100vh - 220px); }
        .arq-item-meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .arq-tag-tipo { color: #c4b5fd; border-color: rgba(124,92,255,0.35); background: rgba(124,92,255,0.12); }
        .arq-tag-livro { color: #f0c674; border-color: rgba(240,198,116,0.35); background: rgba(240,198,116,0.1); }
        .tab[data-tab="arquivos"].active { color: #f0c674; border-bottom-color: #f0c674; }
      `;
      document.head.appendChild(s);
    }

    const tipoSel = document.getElementById('arq-tipo');
    const livroSel = document.getElementById('arq-livro');
    TIPOS.forEach((t) => {
      const o = document.createElement('option');
      o.value = t;
      o.textContent = t === 'todos' ? 'Todos os tipos' : t.charAt(0).toUpperCase() + t.slice(1);
      tipoSel.appendChild(o);
    });
    LIVROS.forEach((l) => {
      const o = document.createElement('option');
      o.value = l;
      o.textContent = l === 'todos' ? 'Todos os livros' : l;
      livroSel.appendChild(o);
    });

    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      panel.classList.add('active');
      renderList();
    });

    document.querySelectorAll('.tab:not([data-tab="arquivos"])').forEach((t) => {
      t.addEventListener('click', () => {
        panel.classList.remove('active');
        btn.classList.remove('active');
      });
    });

    ['arq-search', 'arq-tipo', 'arq-livro'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', renderList);
    });

    renderList();
  }

  function filtered() {
    if (typeof ARQUIVOS_SECRETOS === 'undefined') return [];
    const q = (document.getElementById('arq-search')?.value || '').trim().toLowerCase();
    const tipo = document.getElementById('arq-tipo')?.value || 'todos';
    const livro = document.getElementById('arq-livro')?.value || 'todos';
    return ARQUIVOS_SECRETOS.filter((e) => {
      if (tipo !== 'todos' && e.tipo !== tipo) return false;
      if (livro !== 'todos' && e.livro !== livro) return false;
      if (!q) return true;
      const blob = [e.nome, e.desc, e.tipo, e.livro, e.classe, e.trilha, e.elemento].join(' ').toLowerCase();
      return blob.includes(q);
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
      const prefix = e.tipo === 'origem' ? 'Origem: ' : e.tipo === 'trilha' ? 'Trilha: ' : e.tipo === 'regra' ? 'Regra: ' : '';
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
    const list = document.getElementById('arq-list');
    const count = document.getElementById('arq-count');
    if (!list) return;
    const items = filtered();
    if (count) count.textContent = items.length + ' item(ns)';
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<p class="empty-msg">Nenhum conteúdo encontrado.</p>';
      return;
    }
    items.forEach((e, idx) => {
      const card = document.createElement('div');
      card.className = 'catalog-item';
      const meta = [];
      meta.push('<span class="catalog-tag arq-tag-tipo">' + escapeHtml(e.tipo) + '</span>');
      meta.push('<span class="catalog-tag arq-tag-livro">' + escapeHtml(e.livro) + '</span>');
      if (e.nex) meta.push('<span class="catalog-tag">NEX ' + escapeHtml(e.nex) + '</span>');
      if (e.classe) meta.push('<span class="catalog-tag">' + escapeHtml(e.classe) + '</span>');
      if (e.trilha) meta.push('<span class="catalog-tag">' + escapeHtml(e.trilha) + '</span>');
      if (e.circulo) meta.push('<span class="catalog-tag">' + escapeHtml(e.circulo) + 'º</span>');
      if (e.elemento) meta.push('<span class="catalog-tag">' + escapeHtml(e.elemento) + '</span>');
      if (e.categoria) meta.push('<span class="catalog-tag">Cat. ' + escapeHtml(e.categoria) + '</span>');
      if (e.espacos) meta.push('<span class="catalog-tag">' + escapeHtml(String(e.espacos)) + ' esp.</span>');
      card.innerHTML =
        '<div class="catalog-item-main"><h5>' + escapeHtml(e.nome) + '</h5>' +
        '<div class="catalog-item-meta arq-item-meta">' + meta.join('') + '</div></div>' +
        '<div class="catalog-item-actions">' +
        '<button type="button" class="btn primary small" data-arq-add="' + idx + '">Adicionar</button></div>' +
        '<p class="catalog-item-desc" style="white-space:pre-wrap;margin-top:6px;">' + escapeHtml(e.desc) + '</p>';
      list.appendChild(card);
    });
    const current = items;
    list.querySelectorAll('[data-arq-add]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const i = +btn.dataset.arqAdd;
        if (current[i]) addToSheet(current[i]);
      });
    });
  }

  function boot() {
    let n = 0;
    const t = setInterval(() => {
      n++;
      const tabsReady = !!document.querySelector('.tabs');
      const dataReady = typeof ARQUIVOS_SECRETOS !== 'undefined';
      if ((tabsReady && dataReady) || n > 100) {
        clearInterval(t);
        if (tabsReady) ensureTab();
      }
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
