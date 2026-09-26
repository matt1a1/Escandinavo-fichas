/* Catálogo de itens do inventário */
function itemFromCatalog(it) {
  return {
    nome: it.nome || '',
    tipo: it.tipo || 'geral',
    categoria: it.categoria || '0',
    espacos: Number(it.espacos) || 0,
    desc: it.desc || '',
    grupo: it.grupo || '',
    dano: it.dano || '',
    critico: it.critico,
    multiplicador: it.multiplicador,
    alcance: it.alcance || '',
    tipoDano: it.tipoDano || '',
    defesa: it.defesa,
    pericia: it.pericia || '',
    atributoDano: it.atributoDano || ''
  };
}

function ataqueFromItem(it) {
  if (!it || it.tipo !== 'arma' || !it.dano || it.dano === '—') return null;
  const crit = parseInt(it.critico, 10);
  return {
    nome: it.nome,
    dano: it.dano,
    critico: Number.isFinite(crit) ? crit : 20,
    multiplicador: it.multiplicador || 2,
    bonusAtaque: 0,
    tipoDano: it.tipoDano || '',
    alcance: it.alcance || '—',
    pericia: it.pericia || (it.alcance && it.alcance !== '—' ? 'Pontaria' : 'Luta'),
    atributoDano: it.atributoDano || 'Força',
    danoExtra: '',
    danosExtra: [],
    imagem: '',
    notas: it.desc || ''
  };
}

function getFilteredItensCatalog() {
  if (typeof ITENS_CATALOG === 'undefined') return [];
  const q = (document.getElementById('item-search')?.value || '').trim().toLowerCase();
  const tipo = document.getElementById('item-filter-tipo')?.value || '';
  const cat = document.getElementById('item-filter-cat')?.value || '';
  return ITENS_CATALOG.filter((it) => {
    if (tipo && it.tipo !== tipo) return false;
    if (cat && String(it.categoria) !== String(cat)) return false;
    if (!q) return true;
    const blob = [it.nome, it.grupo, it.desc, it.tipoDano, it.dano].join(' ').toLowerCase();
    return blob.includes(q);
  });
}

function renderItemCatalog() {
  const list = document.getElementById('item-catalog-list');
  const countEl = document.getElementById('item-catalog-count');
  if (!list) return;
  const items = getFilteredItensCatalog();
  if (countEl) countEl.textContent = items.length + ' item(ns)';
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<p class="empty-msg">Nenhum item encontrado.</p>';
    return;
  }
  items.forEach((it) => {
    const idx = ITENS_CATALOG.indexOf(it);
    const card = document.createElement('div');
    card.className = 'catalog-item';
    const tags = [];
    tags.push('<span class="catalog-tag">' + escapeHtml(it.grupo || '') + '</span>');
    tags.push('<span class="catalog-tag">Cat. ' + escapeHtml(String(it.categoria)) + '</span>');
    tags.push('<span class="catalog-tag">' + (it.espacos === 0 ? '0 espaços' : it.espacos + ' esp.') + '</span>');
    if (it.dano) tags.push('<span class="catalog-tag">Dano ' + escapeHtml(it.dano) + '</span>');
    if (it.defesa) tags.push('<span class="catalog-tag">Defesa +' + it.defesa + '</span>');
    if (it.alcance && it.alcance !== '—') tags.push('<span class="catalog-tag">' + escapeHtml(it.alcance) + '</span>');
    if (it.tipoDano) tags.push('<span class="catalog-tag">' + escapeHtml(it.tipoDano) + '</span>');
    card.innerHTML =
      '<div class="catalog-item-main"><h5>' + escapeHtml(it.nome) + '</h5>' +
      '<div class="catalog-item-meta">' + tags.join('') + '</div></div>' +
      '<div class="catalog-item-actions">' +
      '<button type="button" class="btn primary small" data-add-item-cat="' + idx + '">Adicionar</button></div>' +
      (it.desc ? '<p class="catalog-item-desc ritual-body" style="white-space:pre-wrap;margin-top:8px;">' + escapeHtml(it.desc) + '</p>' : '');
    list.appendChild(card);
  });
  list.querySelectorAll('[data-add-item-cat]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const it = ITENS_CATALOG[+btn.dataset.addItemCat];
      if (!it || typeof state === 'undefined') return;
      state.itens.push(itemFromCatalog(it));
      const atk = ataqueFromItem(it);
      if (atk && !(state.ataques || []).some((a) => a.nome === atk.nome)) {
        state.ataques = state.ataques || [];
        state.ataques.push(atk);
      }
      if (typeof scheduleSave === 'function') scheduleSave();
      if (typeof renderItens === 'function') renderItens();
      if (typeof renderAtaques === 'function') renderAtaques();
      if (typeof renderRecursos === 'function') renderRecursos();
    });
  });
}

function initItemCatalogUI() {
  ['item-search', 'item-filter-tipo', 'item-filter-cat'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => renderItemCatalog());
  });
  renderItemCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initItemCatalogUI, 50);
});
