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
    if (cats.length === 0) {
      box.innerHTML = '';
      return;
    }
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
      const hasAnyForClass = getCatalog().some(h => h.classe === currentClass);
      if (!hasAnyForClass) {
        list.innerHTML = '<p class="empty-msg">Catálogo desta seção ainda não disponível.<br><small>Use Combatente, Especialista ou Ocultista.</small></p>';
      } else {
        list.innerHTML = '<p class="empty-msg">Nenhuma habilidade encontrada.</p>';
      }
      return;
    }
    list.innerHTML = items.map(h => {
      const have = alreadyHave(h.nome);
      const meta = [
        h.nex ? 'NEX ' + h.nex : '',
        h.pe && h.pe !== '—' ? h.pe : ''
      ].filter(Boolean).join(' · ');
      return (
        '<div class="hab-catalog-item">' +
          '<div class="hab-catalog-head">' +
            '<div class="hab-catalog-title">' +
              '<strong>' + escapeHtml(h.nome) + '</strong>' +
              (meta ? '<span class="hab-meta">' + escapeHtml(meta) + '</span>' : '') +
            '</div>' +
            '<button type="button" class="btn-add-hab' + (have ? ' have' : '') + '" data-nome="' + escapeAttr(h.nome) + '" title="' + (have ? 'Já adicionada' : 'Adicionar') + '">' + (have ? '✓' : '+') + '</button>' +
          '</div>' +
          '<p class="hab-catalog-desc">' + escapeHtml(h.desc || '') + '</p>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('.hab-catalog-head').forEach(head => {
      head.addEventListener('click', (e) => {
        if (e.target.closest('.btn-add-hab')) return;
        const item = head.closest('.hab-catalog-item');
        if (item) item.classList.toggle('open');
      });
    });

    list.querySelectorAll('.btn-add-hab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nome = btn.dataset.nome;
        if (!nome) return;
        const item = getCatalog().find(h => h.nome === nome);
        if (!item) return;
        if (typeof state === 'undefined') return;
        if (!Array.isArray(state.habilidades)) state.habilidades = [];
        if (alreadyHave(nome)) return;
        const meta = [
          item.nex ? 'NEX ' + item.nex : '',
          item.pe && item.pe !== '—' ? 'Custo: ' + item.pe : '',
          item.categoria
        ].filter(Boolean).join(' · ');
        state.habilidades.push({
          nome: item.nome,
          desc: item.desc + (meta ? '\n(' + meta + ')' : ''),
          pe: item.pe || ''
        });
        if (typeof scheduleSave === 'function') scheduleSave();
        else if (typeof saveState === 'function') saveState();
        if (typeof renderHabilidades === 'function') renderHabilidades();
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof renderItens === 'function') renderItens();
        renderList();
      });
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  function bind() {
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

    qsa('.hab-class-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.hab-class-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentClass = btn.dataset.habClass || 'Combatente';
        currentCat = '';
        renderChips();
        renderList();
      });
    });

    const searchEl = qs('#hab-search');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        search = searchEl.value || '';
        renderList();
      });
    }
  }

  function init() {
    try {
      bind();
      renderChips();
      renderList();
      window.__habRenderList = renderList;
      window.__habRenderChips = renderChips;
    } catch (err) {
      console.error('habilidades-ui init error:', err);
    }
  }
  window.initHabilidadesUI = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
