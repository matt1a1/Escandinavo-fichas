/* catalog-ui.js — busca e filtros do catálogo de rituais */
function ritualFromCatalog(r) {
  return {
    nome: r.nome || '',
    elemento: r.elemento || 'Conhecimento',
    circulo: String(r.circulo || '1'),
    execucao: r.execucao || 'Padrão',
    alcance: r.alcance || 'Pessoal',
    area: r.area || '',
    alvo: r.alvo || '',
    duracao: r.duracao || '',
    efeito: r.efeito || '',
    resistencia: r.resistencia || '',
    dados: r.dados || '',
    dadosDiscente: r.dadosDiscente || '',
    dadosVerdadeiro: r.dadosVerdadeiro || '',
    imagem: '',
    desc: r.desc || '',
  };
}

function getFilteredRituals() {
  if (typeof RITUAIS_CATALOG === 'undefined') return [];
  const q = (document.getElementById('ritual-search')?.value || '').trim().toLowerCase();
  const el = document.getElementById('ritual-filter-elemento')?.value || '';
  const cir = document.getElementById('ritual-filter-circulo')?.value || '';
  return RITUAIS_CATALOG.filter((r) => {
    if (el && r.elemento !== el) return false;
    if (cir && String(r.circulo) !== String(cir)) return false;
    if (!q) return true;
    const blob = [r.nome, r.elemento, r.efeito, r.desc, r.alvo, r.dados, r.dadosDiscente, r.dadosVerdadeiro].join(' ').toLowerCase();
    return blob.includes(q);
  });
}

function renderRitualCatalog() {
  const list = document.getElementById('ritual-catalog-list');
  const countEl = document.getElementById('catalog-count');
  if (!list) return;
  const items = getFilteredRituals();
  if (countEl) countEl.textContent = items.length + ' ritual(is)';
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<p class="empty-msg">Nenhum ritual encontrado.</p>';
    return;
  }
  items.forEach((r) => {
    const idx = RITUAIS_CATALOG.indexOf(r);
    const card = document.createElement('div');
    card.className = 'catalog-item';
    const elClass = 'el-' + (r.elemento || '').replace(/\s+/g, '');
    // Corpo principal = descrição completa (efeito + Discente + Verdadeiro)
    const body = r.desc || r.efeito || '';
    card.innerHTML =
      '<div class="catalog-item-main"><h5>' + escapeHtml(r.nome) + '</h5>' +
      '<div class="catalog-item-meta">' +
      '<span class="catalog-tag ' + elClass + '">' + escapeHtml(r.elemento || '') + ' ' + escapeHtml(String(r.circulo || '')) + '</span>' +
      (r.execucao ? '<span class="catalog-tag">Execução: ' + escapeHtml(r.execucao) + '</span>' : '') +
      (r.alcance ? '<span class="catalog-tag">Alcance: ' + escapeHtml(r.alcance) + '</span>' : '') +
      (r.alvo ? '<span class="catalog-tag">Alvo: ' + escapeHtml(r.alvo) + '</span>' : '') +
      (r.duracao ? '<span class="catalog-tag">Duração: ' + escapeHtml(r.duracao) + '</span>' : '') +
      (r.resistencia ? '<span class="catalog-tag">Resistência: ' + escapeHtml(r.resistencia) + '</span>' : '') +
      '</div></div>' +
      '<div class="catalog-item-actions">' +
      '<button type="button" class="btn primary small" data-add-catalog="' + idx + '">Adicionar</button>' +
      '<button type="button" class="btn small" data-view-catalog="' + idx + '">Ver</button></div>' +
      (body ? '<p class="catalog-item-desc ritual-body" style="white-space:pre-wrap;margin-top:8px;">' + escapeHtml(body) + '</p>' : '');
    list.appendChild(card);
  });
  list.querySelectorAll('[data-add-catalog]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const r = RITUAIS_CATALOG[+btn.dataset.addCatalog];
      if (!r) return;
      state.rituais.push(ritualFromCatalog(r));
      scheduleSave();
      renderRituais();
    });
  });
  list.querySelectorAll('[data-view-catalog]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const r = RITUAIS_CATALOG[+btn.dataset.viewCatalog];
      if (!r || typeof openRitualModal !== 'function') return;
      openRitualModal(null);
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
      set('rit-nome', r.nome);
      set('rit-elemento', r.elemento || 'Conhecimento');
      set('rit-circulo', r.circulo || 1);
      set('rit-execucao', r.execucao || 'Padrão');
      set('rit-alcance', r.alcance || 'Pessoal');
      set('rit-area', r.area);
      set('rit-alvo', r.alvo);
      set('rit-duracao', r.duracao);
      set('rit-efeito', r.efeito);
      set('rit-resistencia', r.resistencia);
      set('rit-dados', r.dados);
      set('rit-dados-discente', r.dadosDiscente);
      set('rit-dados-verdadeiro', r.dadosVerdadeiro);
      set('rit-desc', r.desc);
    });
  });
}

function initRitualCatalogUI() {
  ['ritual-search', 'ritual-filter-elemento', 'ritual-filter-circulo'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => renderRitualCatalog());
  });
  renderRitualCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initRitualCatalogUI, 50);
});
