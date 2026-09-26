
// Patch: preenche descrições das habilidades a partir do catálogo e cards no estilo definido
(function () {
  function lookupHabilidadeCatalog(nome) {
    if (typeof HABILIDADES_CATALOG === 'undefined' || !Array.isArray(HABILIDADES_CATALOG)) return null;
    const n = String(nome || '').toLowerCase();
    return HABILIDADES_CATALOG.find((h) => String(h.nome || '').toLowerCase() === n) || null;
  }
  function habilidadeFromNome(nome) {
    const cat = lookupHabilidadeCatalog(nome);
    if (cat) {
      const meta = [
        cat.nex ? 'NEX ' + cat.nex : '',
        cat.pe && cat.pe !== '\u2014' ? 'Custo: ' + cat.pe : '',
        cat.categoria || ''
      ].filter(Boolean).join(' \u00b7 ');
      return {
        nome: cat.nome,
        desc: (cat.desc || '') + (meta ? '\n(' + meta + ')' : ''),
        pe: cat.pe || '',
        nex: cat.nex || '',
        categoria: cat.categoria || ''
      };
    }
    return { nome: nome || '', desc: '', pe: '', nex: '', categoria: '' };
  }

  function escapeHtmlLocal(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.renderHabilidades = function renderHabilidades() {
    const list = document.getElementById('habilidades-list');
    if (!list || typeof state === 'undefined') return;
    list.innerHTML = '';
    if (!state.habilidades || !state.habilidades.length) {
      list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>';
      return;
    }

    let filled = false;
    state.habilidades.forEach((h) => {
      if (h && h.nome && !(h.desc && String(h.desc).trim())) {
        const fromCat = habilidadeFromNome(h.nome);
        if (fromCat.desc) {
          h.desc = fromCat.desc;
          if (fromCat.pe && !h.pe) h.pe = fromCat.pe;
          if (fromCat.nex && !h.nex) h.nex = fromCat.nex;
          if (fromCat.categoria && !h.categoria) h.categoria = fromCat.categoria;
          filled = true;
        }
      }
    });
    if (filled && typeof scheduleSave === 'function') scheduleSave();

    state.habilidades.forEach((h, i) => {
      const cat = lookupHabilidadeCatalog(h.nome) || {};
      const pe = h.pe || cat.pe || '';
      const nex = h.nex || cat.nex || '';
      const categoria = h.categoria || cat.categoria || '';
      const tags = [];
      if (nex) tags.push('<span class="hab-nex">' + escapeHtmlLocal(String(nex).indexOf('NEX') === 0 ? nex : 'NEX ' + nex) + '</span>');
      if (pe && pe !== '\u2014') tags.push('<span class="hab-pe">' + escapeHtmlLocal(pe) + '</span>');
      if (categoria) tags.push('<span class="hab-cat-tag">' + escapeHtmlLocal(categoria) + '</span>');

      const card = document.createElement('div');
      card.className = 'hab-mine-card';
      card.innerHTML =
        '<div class="hab-mine-head">' +
          '<div class="hab-mine-title-row">' +
            '<input type="text" class="hab-mine-nome" value="' + escapeHtmlLocal(h.nome || '') + '" data-field="nome" data-idx="' + i + '" placeholder="Nome da habilidade" />' +
            '<div class="hab-mine-tags">' + tags.join('') + '</div>' +
          '</div>' +
          '<button type="button" class="btn-remove" data-idx="' + i + '">Remover</button>' +
        '</div>' +
        '<textarea class="hab-mine-desc" data-field="desc" data-idx="' + i + '" rows="3" placeholder="Descri\u00e7\u00e3o da habilidade...">' + escapeHtmlLocal(h.desc || '') + '</textarea>';
      list.appendChild(card);
    });

    list.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('change', (e) => {
        const idx = +e.target.dataset.idx;
        const field = e.target.dataset.field;
        state.habilidades[idx][field] = e.target.value;
        if (field === 'nome') {
          const fromCat = habilidadeFromNome(e.target.value);
          if (fromCat.desc && !(state.habilidades[idx].desc && state.habilidades[idx].desc.trim())) {
            state.habilidades[idx].desc = fromCat.desc;
            state.habilidades[idx].pe = fromCat.pe;
            state.habilidades[idx].nex = fromCat.nex;
            state.habilidades[idx].categoria = fromCat.categoria;
            renderHabilidades();
          }
        }
        if (typeof scheduleSave === 'function') scheduleSave();
      });
    });
    list.querySelectorAll('.btn-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.habilidades.splice(+btn.dataset.idx, 1);
        if (typeof scheduleSave === 'function') scheduleSave();
        renderHabilidades();
        if (typeof renderRecursos === 'function') renderRecursos();
        if (typeof renderItens === 'function') renderItens();
      });
    });
  };

  function tryFill() {
    if (typeof state === 'undefined' || !state.habilidades) return;
    const needs = state.habilidades.some((h) => h && h.nome && !(h.desc && String(h.desc).trim()));
    if (needs) renderHabilidades();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tryFill, 500));
  } else {
    setTimeout(tryFill, 500);
  }
})();
