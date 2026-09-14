const state = {
  nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
  vidaAtual: null, sanAtual: null, peAtual: null,
  aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
  habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
  itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
};
const STORAGE_KEY = 'escandinavo-ficha-v1';
let saveTimer = null;
let ataqueEditIndex = null;
let ritualEditIndex = null;
window._atkExtras = [];
function getAttr(key) { return state.atributos[key] ?? 1; }
function pontosDisponiveis() { return 9 - Object.values(state.atributos).reduce((a, b) => a + b, 0); }
function calcularRecursos() {
  const cls = CLASSES[state.classe];
  const n = Math.floor(state.nex / 5);
  return {
    pvMax: Math.max(1, cls.pvBase + getAttr('vig') + (n - 1) * (cls.pvPorNex + getAttr('vig'))),
    sanMax: Math.max(1, cls.sanBase + (n - 1) * cls.sanPorNex),
    peMax: Math.max(1, cls.peBase + getAttr('pre') + (n - 1) * (cls.pePorNex + getAttr('pre'))),
  };
}
function calcularDefesa() { return 10 + getAttr('agi'); }
function getPericiaRank(id) {
  const p = state.pericias[id];
  if (typeof p === 'number') return p;
  if (p && typeof p === 'object') return Number(p.rank) || 0;
  return 0;
}
function getPericiaOther(id) {
  const p = state.pericias[id];
  if (p && typeof p === 'object') return Number(p.other) || 0;
  return 0;
}
function getPericiaBonus(id) { return getPericiaRank(id) + getPericiaOther(id); }
function setPericiaRank(id, rank) {
  const other = getPericiaOther(id);
  if (rank === 0 && other === 0) delete state.pericias[id]; else state.pericias[id] = { rank, other };
}
function setPericiaOther(id, other) {
  const rank = getPericiaRank(id);
  if (rank === 0 && other === 0) delete state.pericias[id]; else state.pericias[id] = { rank, other };
}
function calcularEsquiva() { const b = getPericiaBonus('reflexos'); return b > 0 ? calcularDefesa() + b : calcularDefesa(); }
function calcularBloqueio() { return getPericiaBonus('fortitude'); }
function calcularCargaMax() { return Math.max(1, getAttr('for')) * 5; }
function calcularDTRituais() { return 10 + getAttr('pre') + Math.floor(state.nex / 10); }
function periciasMax() {
  const cls = CLASSES[state.classe];
  const o = ORIGENS[state.origem];
  return (cls.periciasBase || 1) + getAttr('int') + (o?.pericias?.length ?? 2);
}
function setSaveStatus(text, cls) {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'save-status' + (cls ? ' ' + cls : '');
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setSaveStatus('Salvo automaticamente', 'saved'); }
  catch (e) { setSaveStatus('Erro ao salvar', ''); }
}
function scheduleSave() {
  setSaveStatus('Salvando…', 'saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 400);
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    Object.assign(state, JSON.parse(raw));
    if (!state.itensLimite) state.itensLimite = { I: 2, II: 0, III: 0, IV: 0 };
    if (!state.pericias) state.pericias = {};
    if (!state.ataques) state.ataques = [];
    if (!state.rituais) state.rituais = [];
    return true;
  } catch (e) { return false; }
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function renderAtributos() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    el.querySelector('.attr-value').textContent = state.atributos[el.dataset.attr];
  });
  const pts = pontosDisponiveis();
  const el = document.getElementById('attr-points');
  el.textContent = pts;
  el.style.color = pts < 0 ? 'var(--danger)' : 'var(--accent)';
}
function renderRecursos() {
  const { pvMax, sanMax, peMax } = calcularRecursos();
  if (state.vidaAtual === null) state.vidaAtual = pvMax;
  if (state.sanAtual === null) state.sanAtual = sanMax;
  if (state.peAtual === null) state.peAtual = peMax;
  state.vidaAtual = Math.min(state.vidaAtual, pvMax);
  state.sanAtual = Math.min(state.sanAtual, sanMax);
  state.peAtual = Math.min(state.peAtual, peMax);
  document.getElementById('vida-atual').textContent = state.vidaAtual;
  document.getElementById('vida-max').textContent = pvMax;
  document.getElementById('san-atual').textContent = state.sanAtual;
  document.getElementById('san-max').textContent = sanMax;
  document.getElementById('pe-atual').textContent = state.peAtual;
  document.getElementById('pe-max').textContent = peMax;
  document.getElementById('defesa').textContent = calcularDefesa();
  document.getElementById('bloqueio').textContent = calcularBloqueio();
  document.getElementById('esquiva').textContent = calcularEsquiva();
  document.getElementById('pe-turno').textContent = 1;
  document.getElementById('proficiencias').textContent = CLASSES[state.classe].proficiencias;
  const cm = document.getElementById('carga-max');
  if (cm) cm.textContent = calcularCargaMax();
  document.getElementById('dt-rituais').textContent = calcularDTRituais();
}
function renderPericias() {
  const list = document.getElementById('pericias-list');
  list.innerHTML = '';
  document.getElementById('pericias-count').textContent = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
  document.getElementById('pericias-max').textContent = periciasMax();
  const ranks = [0, 5, 10, 15];
  PERICIAS.forEach((p) => {
    const rank = getPericiaRank(p.id);
    const other = getPericiaOther(p.id);
    const bonus = rank + other;
    const row = document.createElement('div');
    row.className = 'pericia-row' + (rank > 0 ? ' trained' : '');
    row.innerHTML = `<div class="pericia-nome">${p.nome} <span class="attr-tag">${p.attr}</span></div><div class="pericia-bonus ${bonus ? 'has-bonus' : ''}">${bonus ? '+' + bonus : '—'}</div><div class="pericia-treino"><select class="rank-select">${ranks.map((r) => `<option value="${r}" ${r === rank ? 'selected' : ''}>${r}</option>`).join('')}</select></div><div class="pericia-outros"><input type="number" class="other-input" value="${other}" min="-20" max="50" /></div><div></div>`;
    const select = row.querySelector('.rank-select');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', (e) => {
      const novo = parseInt(e.target.value, 10);
      if (rank === 0 && novo > 0) {
        const atuais = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
        if (atuais >= periciasMax()) { alert('Limite de perícias atingido.'); e.target.value = '0'; return; }
      }
      setPericiaRank(p.id, novo); renderPericias(); renderRecursos(); scheduleSave();
    });
    const oi = row.querySelector('.other-input');
    oi.addEventListener('click', (e) => e.stopPropagation());
    oi.addEventListener('change', (e) => { setPericiaOther(p.id, parseInt(e.target.value, 10) || 0); renderPericias(); renderRecursos(); scheduleSave(); });
    list.appendChild(row);
  });
}
function renderOrigemSelect() {
  const sel = document.getElementById('origem');
  sel.innerHTML = '';
  for (const [id, o] of Object.entries(ORIGENS)) {
    const opt = document.createElement('option');
    opt.value = id; opt.textContent = o.nome;
    if (id === state.origem) opt.selected = true;
    sel.appendChild(opt);
  }
}
function applyOrigemPericias() {
  const o = ORIGENS[state.origem];
  if (!o) return;
  o.pericias.forEach((id) => { if (getPericiaRank(id) === 0) setPericiaRank(id, 5); });
}
function renderHabilidades() {
  const list = document.getElementById('habilidades-list');
  list.innerHTML = '';
  if (!state.habilidades.length) { list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>'; return; }
  state.habilidades.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(h.nome)}" data-field="nome" data-idx="${i}" placeholder="Nome" /><textarea data-field="desc" data-idx="${i}">${escapeHtml(h.desc || '')}</textarea><div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('change', (e) => { state.habilidades[+e.target.dataset.idx][e.target.dataset.field] = e.target.value; scheduleSave(); }));
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.habilidades.splice(+btn.dataset.idx, 1); scheduleSave(); renderHabilidades(); }));
}
function renderRituais() {
  const list = document.getElementById('rituais-list');
  list.innerHTML = '';
  if (!state.rituais.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui rituais.</p>'; return; }
  state.rituais.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'ataque-card';
    const parts = [];
    if (r.elemento) parts.push('Elemento: <strong>' + escapeHtml(r.elemento) + '</strong>');
    if (r.circulo != null && r.circulo !== '') parts.push('Círculo: <strong>' + escapeHtml(String(r.circulo)) + '</strong>');
    if (r.execucao) parts.push('Execução: <strong>' + escapeHtml(r.execucao) + '</strong>');
    if (r.alcance) parts.push('Alcance: <strong>' + escapeHtml(r.alcance) + '</strong>');
    if (r.area) parts.push('Área: <strong>' + escapeHtml(r.area) + '</strong>');
    if (r.alvo) parts.push('Alvo: <strong>' + escapeHtml(r.alvo) + '</strong>');
    if (r.duracao) parts.push('Duração: <strong>' + escapeHtml(r.duracao) + '</strong>');
    if (r.efeito) parts.push('Efeito: <strong>' + escapeHtml(r.efeito) + '</strong>');
    if (r.resistencia) parts.push('Resistência: <strong>' + escapeHtml(r.resistencia) + '</strong>');
    if (r.dados) parts.push('Dados: <strong>' + escapeHtml(r.dados) + '</strong>');
    if (r.dadosDiscente) parts.push('Discente: <strong>' + escapeHtml(r.dadosDiscente) + '</strong>');
    if (r.dadosVerdadeiro) parts.push('Verdadeiro: <strong>' + escapeHtml(r.dadosVerdadeiro) + '</strong>');
    card.innerHTML = (r.imagem ? '<img class="ataque-thumb" src="' + r.imagem + '" alt="" />' : '') +
      '<h4>' + escapeHtml(r.nome || 'Ritual') + '</h4>' +
      (parts.length ? '<div class="ataque-meta"><span>' + parts.join('</span><span>') + '</span></div>' : '') +
      (r.desc ? '<p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:6px;">' + escapeHtml(r.desc) + '</p>' : '') +
      '<div class="item-actions"><button type="button" class="btn small" data-edit-ritual="' + i + '">Editar</button><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.rituais.splice(+btn.dataset.idx, 1); scheduleSave(); renderRituais(); }));
  list.querySelectorAll('[data-edit-ritual]').forEach((btn) => btn.addEventListener('click', () => openRitualModal(+btn.dataset.editRitual)));
}
function renderItens() {
  const list = document.getElementById('itens-list');
  list.innerHTML = '';
  const counts = { I: 0, II: 0, III: 0, IV: 0 };
  let carga = 0;
  state.itens.forEach((item) => {
    const cat = (item.categoria || '0').toString().toUpperCase();
    if (counts[cat] !== undefined) counts[cat]++;
    carga += Number(item.espacos) || 0;
  });
  if (document.getElementById('count-I')) {
    ['I','II','III','IV'].forEach((c) => { document.getElementById('count-' + c).textContent = counts[c]; document.getElementById('limite-' + c).value = state.itensLimite[c] ?? 0; });
    document.getElementById('carga-atual').textContent = carga;
    document.getElementById('carga-max').textContent = calcularCargaMax();
  }
  const pi = document.getElementById('patente-inv');
  if (pi) pi.value = state.patente;
  if (!state.itens.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui itens.</p>'; return; }
  const tipoLabel = { arma: 'Arma', municao: 'Munição', protecao: 'Proteção', geral: 'Geral', amaldicoado: 'Item Amaldiçoado' };
  state.itens.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = '<span class="item-tipo-tag">' + (tipoLabel[item.tipo] || 'Geral') + '</span><input type="text" value="' + escapeHtml(item.nome) + '" data-field="nome" data-idx="' + i + '" /><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;"><input type="text" value="' + escapeHtml(item.categoria || '0') + '" data-field="categoria" data-idx="' + i + '" /><input type="number" value="' + (item.espacos ?? 1) + '" data-field="espacos" data-idx="' + i + '" min="0" /></div><textarea data-field="desc" data-idx="' + i + '">' + escapeHtml(item.desc || '') + '</textarea><div class="item-actions"><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('change', (e) => {
    let val = e.target.value;
    if (e.target.dataset.field === 'espacos') val = parseInt(val) || 0;
    state.itens[+e.target.dataset.idx][e.target.dataset.field] = val;
    scheduleSave(); renderItens();
  }));
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.itens.splice(+btn.dataset.idx, 1); scheduleSave(); renderItens(); }));
}
function renderAtaques() {
  const list = document.getElementById('ataques-list');
  list.innerHTML = '';
  if (!state.ataques.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui ataques.</p>'; return; }
  state.ataques.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'ataque-card';
    const crit = a.critico != null ? a.critico : 20;
    const mult = a.multiplicador != null ? a.multiplicador : 2;
    const extra = Array.isArray(a.danosExtra) && a.danosExtra.length ? a.danosExtra.join(', ') : (a.danoExtra || '');
    card.innerHTML = (a.imagem ? '<img class="ataque-thumb" src="' + a.imagem + '" alt="" />' : '') +
      '<h4>' + escapeHtml(a.nome || 'Ataque') + '</h4><div class="ataque-meta">' +
      '<span>Dano: <strong>' + escapeHtml(a.dano || '—') + '</strong></span>' +
      '<span>Crítico: <strong>' + crit + '/' + mult + 'x</strong></span>' +
      '<span>Bônus: <strong>' + (a.bonusAtaque ?? 0) + '</strong></span>' +
      '<span>Tipo: <strong>' + escapeHtml(a.tipoDano || '—') + '</strong></span>' +
      '<span>Perícia: <strong>' + escapeHtml(a.pericia || '—') + '</strong></span>' +
      (extra ? '<span>Extra: <strong>' + escapeHtml(extra) + '</strong></span>' : '') +
      '</div><div class="item-actions"><button type="button" class="btn small" data-edit="' + i + '">Editar</button><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.ataques.splice(+btn.dataset.idx, 1); saveState(); renderAtaques(); }));
  list.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => openAtaqueModal(+btn.dataset.edit)));
}
function renderAll() {
  document.getElementById('nome').value = state.nome;
  document.getElementById('jogador').value = state.jogador;
  document.getElementById('classe').value = state.classe;
  document.getElementById('nex-display').textContent = state.nex + '%';
  document.getElementById('patente').value = state.patente;
  document.getElementById('aparencia').value = state.aparencia;
  document.getElementById('personalidade').value = state.personalidade;
  document.getElementById('historico').value = state.historico;
  document.getElementById('objetivo').value = state.objetivo;
  document.getElementById('anotacoes').value = state.anotacoes;
  document.getElementById('pp').value = state.pp;
  document.getElementById('credito').value = state.credito;
  renderOrigemSelect(); renderAtributos(); renderRecursos();
  renderPericias(); renderHabilidades(); renderRituais(); renderItens(); renderAtaques();
}
function setRitualImagePreview(dataUrl) {
  const preview = document.getElementById('rit-img-preview');
  const placeholder = document.getElementById('rit-img-placeholder');
  if (!preview) return;
  if (dataUrl) { preview.src = dataUrl; preview.hidden = false; if (placeholder) placeholder.hidden = true; }
  else { preview.src = ''; preview.hidden = true; if (placeholder) placeholder.hidden = false; }
  preview.dataset.url = dataUrl || '';
}
function openRitualModal(index) {
  ritualEditIndex = index;
  const modal = document.getElementById('modal-ritual');
  const title = document.getElementById('modal-ritual-title');
  const btn = document.getElementById('btn-salvar-ritual');
  const fileInput = document.getElementById('rit-imagem');
  if (fileInput) fileInput.value = '';
  if (index === null || index === undefined) {
    title.textContent = 'Novo Ritual'; btn.textContent = 'Adicionar';
    document.getElementById('rit-nome').value = 'Novo Ritual';
    document.getElementById('rit-elemento').value = 'Conhecimento';
    document.getElementById('rit-circulo').value = 1;
    document.getElementById('rit-execucao').value = 'Padrão';
    document.getElementById('rit-alcance').value = 'Pessoal';
    document.getElementById('rit-area').value = '';
    document.getElementById('rit-alvo').value = '';
    document.getElementById('rit-duracao').value = '';
    document.getElementById('rit-efeito').value = '';
    document.getElementById('rit-resistencia').value = '';
    document.getElementById('rit-dados').value = '';
    document.getElementById('rit-dados-discente').value = '';
    document.getElementById('rit-dados-verdadeiro').value = '';
    document.getElementById('rit-desc').value = '';
    setRitualImagePreview('');
  } else {
    const r = state.rituais[index];
    title.textContent = 'Editar Ritual'; btn.textContent = 'Salvar';
    document.getElementById('rit-nome').value = r.nome || '';
    document.getElementById('rit-elemento').value = r.elemento || 'Conhecimento';
    document.getElementById('rit-circulo').value = r.circulo ?? 1;
    document.getElementById('rit-execucao').value = r.execucao || 'Padrão';
    document.getElementById('rit-alcance').value = r.alcance || 'Pessoal';
    document.getElementById('rit-area').value = r.area || '';
    document.getElementById('rit-alvo').value = r.alvo || '';
    document.getElementById('rit-duracao').value = r.duracao || '';
    document.getElementById('rit-efeito').value = r.efeito || '';
    document.getElementById('rit-resistencia').value = r.resistencia || '';
    document.getElementById('rit-dados').value = r.dados || '';
    document.getElementById('rit-dados-discente').value = r.dadosDiscente || '';
    document.getElementById('rit-dados-verdadeiro').value = r.dadosVerdadeiro || '';
    document.getElementById('rit-desc').value = r.desc || '';
    setRitualImagePreview(r.imagem || '');
  }
  modal.hidden = false;
}
// ... (continuing with the rest of the original file to make it complete)
