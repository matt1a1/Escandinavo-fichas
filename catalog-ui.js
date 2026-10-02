/* catalog-ui.js — catálogo de rituais no estilo Arquivos Secretos (card + clique pra descrição) */
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
  var q = (document.getElementById('ritual-search') && document.getElementById('ritual-search').value || '').trim().toLowerCase();
  var el = (document.getElementById('ritual-filter-elemento') && document.getElementById('ritual-filter-elemento').value) || '';
  var cir = (document.getElementById('ritual-filter-circulo') && document.getElementById('ritual-filter-circulo').value) || '';
  return RITUAIS_CATALOG.filter(function (r) {
    if (el && r.elemento !== el) return false;
    if (cir && String(r.circulo) !== String(cir)) return false;
    if (!q) return true;
    var blob = [r.nome, r.elemento, r.efeito, r.desc, r.alvo, r.dados, r.dadosDiscente, r.dadosVerdadeiro].join(' ').toLowerCase();
    return blob.indexOf(q) !== -1;
  });
}

function ensureRitualCatalogStyles() {
  if (document.getElementById('ritual-catalog-style')) return;
  var s = document.createElement('style');
  s.id = 'ritual-catalog-style';
  s.textContent = [
    '#ritual-catalog-list.catalog-list, #ritual-catalog-list {',
    '  display:flex; flex-direction:column; gap:10px;',
    '  max-height:420px; overflow-y:auto; padding-right:2px;',
    '}',
    '#ritual-catalog-list .rit-card {',
    '  border:1px solid rgba(255,255,255,0.1); background:#16161f;',
    '  border-radius:12px; padding:12px 14px;',
    '}',
    '#ritual-catalog-list .rit-card:hover { border-color:rgba(255,255,255,0.18); }',
    '#ritual-catalog-list .rit-card.open { border-color:rgba(124,92,255,0.4); }',
    '#ritual-catalog-list .rit-card-head {',
    '  display:flex; align-items:flex-start; justify-content:space-between;',
    '  gap:12px; cursor:pointer;',
    '}',
    '#ritual-catalog-list .rit-card-info { flex:1; min-width:0; }',
    '#ritual-catalog-list .rit-card-name {',
    '  font-size:0.95rem; font-weight:700; color:#f2f2f8; margin:0 0 6px;',
    '  line-height:1.3;',
    '}',
    '#ritual-catalog-list .rit-card-tags { display:flex; flex-wrap:wrap; gap:6px; }',
    '#ritual-catalog-list .rit-tag {',
    '  font-size:0.68rem; padding:3px 8px; border-radius:999px;',
    '  border:1px solid rgba(255,255,255,0.12); color:#b8b8c8;',
    '  background:rgba(255,255,255,0.04);',
    '}',
    '#ritual-catalog-list .rit-tag.el-Conhecimento { color:#9ecbff; border-color:rgba(158,203,255,0.4); background:rgba(158,203,255,0.12); }',
    '#ritual-catalog-list .rit-tag.el-Energia { color:#c9a0ff; border-color:rgba(201,160,255,0.4); background:rgba(201,160,255,0.12); }',
    '#ritual-catalog-list .rit-tag.el-Morte { color:#c0c0c0; border-color:rgba(160,160,160,0.4); background:rgba(160,160,160,0.12); }',
    '#ritual-catalog-list .rit-tag.el-Sangue { color:#ff8a8a; border-color:rgba(255,122,122,0.4); background:rgba(255,122,122,0.12); }',
    '#ritual-catalog-list .rit-tag.el-Medo { color:#ffe08a; border-color:rgba(255,224,138,0.4); background:rgba(255,224,138,0.12); }',
    '#ritual-catalog-list .rit-add {',
    '  flex-shrink:0; white-space:nowrap; padding:8px 14px !important;',
    '  font-size:0.8rem !important; min-height:36px; cursor:pointer;',
    '}',
    '#ritual-catalog-list .rit-card-desc {',
    '  display:none; font-size:0.84rem; line-height:1.5; color:#d0d0dc;',
    '  white-space:pre-wrap; margin:10px 0 0; padding-top:10px;',
    '  border-top:1px solid rgba(255,255,255,0.08); word-break:break-word;',
    '}',
    '#ritual-catalog-list .rit-card.open .rit-card-desc { display:block; }',
    '#ritual-catalog-list .rit-empty {',
    '  font-size:0.85rem; color:#9a9ab0; padding:24px 8px; text-align:center;',
    '}'
  ].join('\n');
  document.head.appendChild(s);
}

function escapeHtmlLocal(str) {
  if (typeof escapeHtml === 'function') return escapeHtml(str);
  return String(str == null ? '' : str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

function buildRitualBody(r) {
  var parts = [];
  if (r.execucao) parts.push('Execução: ' + r.execucao);
  if (r.alcance) parts.push('Alcance: ' + r.alcance);
  if (r.alvo) parts.push('Alvo: ' + r.alvo);
  if (r.area) parts.push('Área: ' + r.area);
  if (r.duracao) parts.push('Duração: ' + r.duracao);
  if (r.resistencia) parts.push('Resistência: ' + r.resistencia);
  var meta = parts.length ? parts.join(' · ') + '\n\n' : '';
  var body = r.desc || r.efeito || '';
  var extra = [];
  if (r.dados) extra.push('Dados: ' + r.dados);
  if (r.dadosDiscente) extra.push('Discente: ' + r.dadosDiscente);
  if (r.dadosVerdadeiro) extra.push('Verdadeiro: ' + r.dadosVerdadeiro);
  if (extra.length) body = (body ? body + '\n\n' : '') + extra.join('\n');
  return meta + body;
}

function renderRitualCatalog() {
  ensureRitualCatalogStyles();
  var list = document.getElementById('ritual-catalog-list');
  var countEl = document.getElementById('catalog-count');
  if (!list) return;
  var items = getFilteredRituals();
  if (countEl) countEl.textContent = items.length + ' ritual(is)';
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<p class="rit-empty">Nenhum ritual encontrado.</p>';
    return;
  }

  items.forEach(function (r) {
    var idx = RITUAIS_CATALOG.indexOf(r);
    var card = document.createElement('div');
    card.className = 'rit-card';

    var elKey = String(r.elemento || '').split(/[\/\s]/)[0];
    var tags = [];
    if (r.elemento || r.circulo) {
      tags.push(
        '<span class="rit-tag el-' + escapeHtmlLocal(elKey) + '">' +
        escapeHtmlLocal((r.elemento || '') + (r.circulo ? ' · ' + r.circulo + 'º' : '')) +
        '</span>'
      );
    }
    if (r.execucao) tags.push('<span class="rit-tag">' + escapeHtmlLocal(r.execucao) + '</span>');
    if (r.alcance) tags.push('<span class="rit-tag">' + escapeHtmlLocal(r.alcance) + '</span>');

    var body = buildRitualBody(r);

    card.innerHTML =
      '<div class="rit-card-head">' +
      '  <div class="rit-card-info">' +
      '    <div class="rit-card-name">' + escapeHtmlLocal(r.nome) + '</div>' +
      '    <div class="rit-card-tags">' + tags.join('') + '</div>' +
      '  </div>' +
      '  <button type="button" class="btn primary small rit-add" data-rit-add="' + idx + '">Adicionar</button>' +
      '</div>' +
      '<div class="rit-card-desc">' + escapeHtmlLocal(body) + '</div>';

    card.querySelector('.rit-card-head').addEventListener('click', function (ev) {
      if (ev.target.closest && ev.target.closest('.rit-add')) return;
      var wasOpen = card.classList.contains('open');
      list.querySelectorAll('.rit-card.open').forEach(function (c) {
        if (c !== card) c.classList.remove('open');
      });
      if (wasOpen) card.classList.remove('open');
      else card.classList.add('open');
    });

    list.appendChild(card);
  });

  list.querySelectorAll('[data-rit-add]').forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var i = +btn.getAttribute('data-rit-add');
      var r = RITUAIS_CATALOG[i];
      if (!r || typeof state === 'undefined') return;
      if (!Array.isArray(state.rituais)) state.rituais = [];
      state.rituais.push(ritualFromCatalog(r));
      if (typeof scheduleSave === 'function') scheduleSave();
      if (typeof renderRituais === 'function') renderRituais();
      btn.textContent = '✓';
      btn.disabled = true;
    });
  });
}

function initRitualCatalogUI() {
  ensureRitualCatalogStyles();
  ['ritual-search', 'ritual-filter-elemento', 'ritual-filter-circulo'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', function () {
      renderRitualCatalog();
    });
  });
  renderRitualCatalog();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initRitualCatalogUI, 50);
  });
} else {
  setTimeout(initRitualCatalogUI, 50);
}

var __ritTries = 0;
var __ritTimer = setInterval(function () {
  __ritTries++;
  if (typeof RITUAIS_CATALOG !== 'undefined' && RITUAIS_CATALOG.length) {
    renderRitualCatalog();
    if (__ritTries > 5) clearInterval(__ritTimer);
  }
  if (__ritTries > 40) clearInterval(__ritTimer);
}, 200);

window.renderRitualCatalog = renderRitualCatalog;
