// UI do catálogo de Habilidades (classes / trilhas)
(function () {
  let currentClass = 'Combatente';
  let currentCat = '';
  let search = '';

  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function getCatalog() {
    return typeof HABILIDADES_CATALOG !== 'undefined' ? HABILIDADES_CATALOG : [];
  }

  function getCategorias(cls) {
    if (typeof HABILIDADES_CATEGORIAS !== 'undefined' && HABILIDADES_CATEGORIAS[cls]) {
      return HABILIDADES_CATEGORIAS[cls];
    }
    const set = new Set(getCatalog().filter(h => h.classe === cls).map(h => h.categoria));
    return Array.from(set);
  }

  function renderChips() {
    const box = qs('#hab-cat-chips');
    if (!box) return;
    const cats = getCategorias(currentClass);
    if (!currentCat || !cats.includes(currentCat)) currentCat = cats[0] || '';
    box.innerHTML = cats.map(c =>
      '<button type="button" class="hab-chip' + (c === currentCat ? ' active' : '') + '" data-hab-cat="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'
    ).join('');
    box.querySelectorAll('.hab-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCat = btn.dataset.habCat;
        renderChips();
        renderList();
      });
    });
  }

  function filtered() {
    const q = search.trim().toLowerCase();
    return getCatalog().filter(h => {
      if (h.classe !== currentClass) return false;
      if (currentCat && h.categoria !== currentCat) return false;
      if (!q) return true;
      return (h.nome + ' ' + h.desc + ' ' + (h.nex || '') + ' ' + (h.pe || '')).toLowerCase().includes(q);
    });
  }

  function alreadyHave(nome) {
    if (typeof state === 'undefined' || !state.habilidades) return false;
    return state.habilidades.some(x => (x.nome || '').toLowerCase() === nome.toLowerCase());
  }

  function renderList() {
    const list = qs('#hab-catalog-list');
    if (!list) return;
    const items = filtered();
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-msg">Nenhuma habilidade encontrada.</p>';
      return;
    }
    list.innerHTML = items.map((h) => {
      const have = alreadyHave(h.nome);
      const nexBadge = h.nex ? '<span class="hab-nex">' + escapeHtml(h.nex) + '</span>' : '';
      const peBadge = h.pe && h.pe !== '—' && h.pe !== '—' ? '<span class="hab-pe">' + escapeHtml(h.pe) + '</span>' : '';
      return (
        '<div class="hab-card">' +
          '<div class="hab-card-head">' +
            '<div class="hab-card-left">' +
              '<span class="hab-card-title">' + escapeHtml(h.nome) + '</span>' +
              nexBadge +
              peBadge +
            '</div>' +
            '<button type="button" class="btn-add-hab' + (have ? ' have' : '') + '" data-nome="' + escapeAttr(h.nome) + '" title="' + (have ? 'Já adicionada' : 'Adicionar') + '">' + (have ? '✓' : '+') + '</button>' +
          '</div>' +
          '<div class="hab-card-body" hidden>' +
            '<div class="hab-cat-label">' + escapeHtml(h.categoria) + (h.pe ? ' · Custo: ' + escapeHtml(h.pe) : '') + '</div>' +
            '<p class="hab-card-desc">' + escapeHtml(h.desc) + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Expand/collapse card
    list.querySelectorAll('.hab-card-head').forEach(head => {
      head.addEventListener('click', (e) => {
        if (e.target.closest('.btn-add-hab')) return;
        const card = head.parentElement;
        const body = card.querySelector('.hab-card-body');
        const open = !body.hidden;
        body.hidden = open;
        card.classList.toggle('open', !open);
      });
    });

    // Add ability button
    list.querySelectorAll('.btn-add-hab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nome = btn.dataset.nome;
        const item = getCatalog().find(x => x.nome === nome);
        if (!item || typeof state === 'undefined') return;
        if (alreadyHave(nome)) return;
        const meta = [
          item.nex ? 'NEX ' + item.nex : '',
          item.pe && item.pe !== '—' && item.pe !== '—' ? 'Custo: ' + item.pe : '',
          item.categoria
        ].filter(Boolean).join(' · ');
        state.habilidades.push({
          nome: item.nome,
          desc: item.desc + (meta ? '\n(' + meta + ')' : ''),
          pe: item.pe || ''
        });
        if (typeof saveState === 'function') saveState();
        if (typeof renderHabilidades === 'function') renderHabilidades();
        renderList();
      });
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  function bind() {
    // Subtabs: Catálogo / Minhas Habilidades
    qsa('.hab-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.hab-subtab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.habView;
        const cat = qs('#hab-view-catalog');
        const mine = qs('#hab-view-mine');
        if (view === 'mine') {
          if (cat) cat.hidden = true;
          if (mine) mine.hidden = false;
          if (typeof renderHabilidades === 'function') renderHabilidades();
        } else {
          if (cat) cat.hidden = false;
          if (mine) mine.hidden = true;
          renderChips();
          renderList();
        }
      });
    });

    // Class tabs: Combatente / Especialista / Ocultista / Origens / Poderes
    qsa('.hab-class-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.hab-class-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentClass = btn.dataset.habClass;
        currentCat = '';
        renderChips();
        renderList();
      });
    });

    // Search
    const searchEl = qs('#hab-search');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        search = searchEl.value;
        renderList();
      });
    }
  }

  function init() {
    bind();
    renderChips();
    renderList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.refreshHabilidadesCatalog = function () {
    renderChips();
    renderList();
  };
})();
