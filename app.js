// ===== ESTADO DA FICHA =====
const state = {
  nome: '',
  jogador: '',
  origem: 'investigador',
  classe: 'ocultista',
  nex: 5,
  patente: 'Recruta',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  pericias: {},
  vidaAtual: null,
  sanAtual: null,
  peAtual: null,
  aparencia: '',
  personalidade: '',
  historico: '',
  objetivo: '',
  anotacoes: '',
  habilidades: [],
  rituais: [],
  itens: [],
  ataques: [],
  pp: 0,
  credito: 'Baixo',
  itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
};

const STORAGE_KEY = 'escandinavo-ficha-v1';
let saveTimer = null;
let ataqueEditIndex = null;

function getAttr(key) { return state.atributos[key] ?? 1; }
function pontosDisponiveis() {
  const soma = Object.values(state.atributos).reduce((a, b) => a + b, 0);
  return 9 - soma;
}
function calcularRecursos() {
  const cls = CLASSES[state.classe];
  const nexSteps = Math.floor(state.nex / 5);
  const pv = cls.pvBase + getAttr('vig') + (nexSteps - 1) * (cls.pvPorNex + getAttr('vig'));
  const san = cls.sanBase + (nexSteps - 1) * cls.sanPorNex;
  const pe = cls.peBase + getAttr('pre') + (nexSteps - 1) * (cls.pePorNex + getAttr('pre'));
  return { pvMax: Math.max(1, pv), sanMax: Math.max(1, san), peMax: Math.max(1, pe) };
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
  if (rank === 0 && other === 0) delete state.pericias[id];
  else state.pericias[id] = { rank, other };
}
function setPericiaOther(id, other) {
  const rank = getPericiaRank(id);
  if (rank === 0 && other === 0) delete state.pericias[id];
  else state.pericias[id] = { rank, other };
}
function calcularEsquiva() {
  const base = calcularDefesa();
  const bonus = getPericiaBonus('reflexos');
  return bonus > 0 ? base + bonus : base;
}
function calcularBloqueio() { return getPericiaBonus('fortitude'); }
function calcularCargaMax() { return Math.max(1, getAttr('for')) * 5; }
function calcularDTRituais() { return 10 + getAttr('pre') + Math.floor(state.nex / 10); }
function periciasMax() {
  const cls = CLASSES[state.classe];
  const origem = ORIGENS[state.origem];
  return (cls.periciasBase || 1) + getAttr('int') + (origem?.pericias?.length ?? 2);
}

function setSaveStatus(text, cls) {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'save-status' + (cls ? ' ' + cls : '');
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveStatus('Salvo automaticamente', 'saved');
  } catch (e) {
    setSaveStatus('Erro ao salvar', '');
  }
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
    return true;
  } catch (e) { return false; }
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
  const treinadas = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
  document.getElementById('pericias-count').textContent = treinadas;
  document.getElementById('pericias-max').textContent = periciasMax();
  const ranks = [0, 5, 10, 15];
  PERICIAS.forEach((p) => {
    const rank = getPericiaRank(p.id);
    const other = getPericiaOther(p.id);
    const bonus = rank + other;
    const row = document.createElement('div');
    row.className = 'pericia-row' + (rank > 0 ? ' trained' : '');
    row.innerHTML = `<div class="pericia-nome">${p.nome}<span class="attr-tag">${p.attr}</span></div>
      <div class="pericia-bonus ${bonus ? 'has-bonus' : ''}">${bonus ? '+' + bonus : '—'}</div>
      <div class="pericia-treino"><select class="rank-select">${ranks.map((r) => `<option value="${r}" ${r === rank ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
      <div class="pericia-outros"><input type="number" class="other-input" value="${other}" min="-20" max="50" /></div><div></div>`;
    const select = row.querySelector('.rank-select');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', (e) => {
      const novo = parseInt(e.target.value, 10);
      if (rank === 0 && novo > 0) {
        const atuais = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
        if (atuais >= periciasMax()) {
          alert('Limite de perícias treinadas atingido (' + periciasMax() + ').');
          e.target.value = '0';
          return;
        }
      }
      setPericiaRank(p.id, novo);
      renderPericias(); renderRecursos(); scheduleSave();
    });
    const otherInput = row.querySelector('.other-input');
    otherInput.addEventListener('click', (e) => e.stopPropagation());
    otherInput.addEventListener('change', (e) => {
      setPericiaOther(p.id, parseInt(e.target.value, 10) || 0);
      renderPericias(); renderRecursos(); scheduleSave();
    });
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
  const origem = ORIGENS[state.origem];
  if (!origem) return;
  origem.pericias.forEach((id) => { if (getPericiaRank(id) === 0) setPericiaRank(id, 5); });
}
function renderHabilidades() {
  const list = document.getElementById('habilidades-list');
  list.innerHTML = '';
  if (!state.habilidades.length) { list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>'; return; }
  state.habilidades.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(h.nome)}" placeholder="Nome" data-field="nome" data-idx="${i}" />
      <textarea placeholder="Descrição..." data-field="desc" data-idx="${i}">${escapeHtml(h.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => { state.habilidades[+e.target.dataset.idx][e.target.dataset.field] = e.target.value; scheduleSave(); });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => { state.habilidades.splice(+btn.dataset.idx, 1); scheduleSave(); renderHabilidades(); });
  });
}
function renderRituais() {
  const list = document.getElementById('rituais-list');
  list.innerHTML = '';
  if (!state.rituais.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui rituais.</p>'; return; }
  state.rituais.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(r.nome)}" placeholder="Nome" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(r.circulo || '')}" placeholder="Círculo / Elemento" data-field="circulo" data-idx="${i}" />
      <textarea placeholder="Efeito..." data-field="desc" data-idx="${i}">${escapeHtml(r.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => { state.rituais[+e.target.dataset.idx][e.target.dataset.field] = e.target.value; scheduleSave(); });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => { state.rituais.splice(+btn.dataset.idx, 1); scheduleSave(); renderRituais(); });
  });
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
    document.getElementById('count-I').textContent = counts.I;
    document.getElementById('count-II').textContent = counts.II;
    document.getElementById('count-III').textContent = counts.III;
    document.getElementById('count-IV').textContent = counts.IV;
    document.getElementById('carga-atual').textContent = carga;
    document.getElementById('carga-max').textContent = calcularCargaMax();
    document.getElementById('limite-I').value = state.itensLimite.I ?? 2;
    document.getElementById('limite-II').value = state.itensLimite.II ?? 0;
    document.getElementById('limite-III').value = state.itensLimite.III ?? 0;
    document.getElementById('limite-IV').value = state.itensLimite.IV ?? 0;
  }
  const patenteInv = document.getElementById('patente-inv');
  if (patenteInv) patenteInv.value = state.patente;
  if (!state.itens.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui itens.</p>'; return; }
  const tipoLabel = { arma: 'Arma', municao: 'Munição', protecao: 'Proteção', geral: 'Geral', amaldicoado: 'Item Amaldiçoado' };
  state.itens.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<span class="item-tipo-tag">${tipoLabel[item.tipo] || 'Geral'}</span>
      <input type="text" value="${escapeHtml(item.nome)}" placeholder="Nome" data-field="nome" data-idx="${i}" />
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <input type="text" value="${escapeHtml(item.categoria || '0')}" data-field="categoria" data-idx="${i}" />
        <input type="number" value="${item.espacos ?? 1}" data-field="espacos" data-idx="${i}" min="0" />
      </div>
      <textarea data-field="desc" data-idx="${i}">${escapeHtml(item.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      let val = e.target.value;
      if (e.target.dataset.field === 'espacos') val = parseInt(val) || 0;
      state.itens[+e.target.dataset.idx][e.target.dataset.field] = val;
      scheduleSave(); renderItens();
    });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => { state.itens.splice(+btn.dataset.idx, 1); scheduleSave(); renderItens(); });
  });
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
    card.innerHTML = `<h4>${escapeHtml(a.nome || 'Ataque')}</h4>
      <div class="ataque-meta">
        <span>Dano: <strong>${escapeHtml(a.dano || '—')}</strong></span>
        <span>Crítico: <strong>${crit}/${mult}x</strong></span>
        <span>Bônus: <strong>${a.bonusAtaque ?? 0}</strong></span>
        <span>Tipo: <strong>${escapeHtml(a.tipoDano || '—')}</strong></span>
        <span>Perícia: <strong>${escapeHtml(a.pericia || '—')}</strong></span>
        <span>Atr. Dano: <strong>${escapeHtml(a.atributoDano || '—')}</strong></span>
        ${a.alcance ? `<span>Alcance: <strong>${escapeHtml(a.alcance)}</strong></span>` : ''}
        ${a.danoExtra ? `<span>Extra: <strong>${escapeHtml(a.danoExtra)}</strong></span>` : ''}
      </div>
      ${a.notas ? `<p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:6px;">${escapeHtml(a.notas)}</p>` : ''}
      <div class="item-actions">
        <button type="button" class="btn small" data-edit="${i}">Editar</button>
        <button type="button" class="btn-remove" data-idx="${i}">Remover</button>
      </div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => { state.ataques.splice(+btn.dataset.idx, 1); saveState(); renderAtaques(); });
  });
  list.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openAtaqueModal(+btn.dataset.edit));
  });
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
function openAtaqueModal(index) {
  ataqueEditIndex = index;
  const modal = document.getElementById('modal-ataque');
  const title = document.getElementById('modal-ataque-title');
  const btn = document.getElementById('btn-salvar-ataque');
  if (index === null || index === undefined) {
    title.textContent = 'Novo Ataque'; btn.textContent = 'Adicionar';
    document.getElementById('atk-nome').value = 'Novo Ataque';
    document.getElementById('atk-dano').value = '1d4';
    document.getElementById('atk-critico').value = 20;
    document.getElementById('atk-mult').value = 2;
    document.getElementById('atk-bonus').value = 0;
    document.getElementById('atk-tipo').value = 'Balístico';
    document.getElementById('atk-alcance').value = '';
    document.getElementById('atk-pericia').value = 'Luta';
    document.getElementById('atk-atributo').value = 'Força';
    document.getElementById('atk-dano-extra').value = '';
    document.getElementById('atk-notas').value = '';
  } else {
    const a = state.ataques[index];
    title.textContent = 'Editar Ataque'; btn.textContent = 'Salvar';
    document.getElementById('atk-nome').value = a.nome || '';
    document.getElementById('atk-dano').value = a.dano || '';
    document.getElementById('atk-critico').value = a.critico ?? 20;
    document.getElementById('atk-mult').value = a.multiplicador ?? 2;
    document.getElementById('atk-bonus').value = a.bonusAtaque ?? 0;
    document.getElementById('atk-tipo').value = a.tipoDano || '';
    document.getElementById('atk-alcance').value = a.alcance || '';
    document.getElementById('atk-pericia').value = a.pericia || 'Luta';
    document.getElementById('atk-atributo').value = a.atributoDano || 'Força';
    document.getElementById('atk-dano-extra').value = a.danoExtra || '';
    document.getElementById('atk-notas').value = a.notas || '';
  }
  modal.hidden = false;
  document.getElementById('atk-nome').focus();
}
function salvarAtaqueModal() {
  const nome = document.getElementById('atk-nome').value.trim();
  if (!nome) { alert('Informe o nome do ataque.'); return; }
  const ataque = {
    nome,
    dano: document.getElementById('atk-dano').value.trim() || '1d4',
    critico: parseInt(document.getElementById('atk-critico').value, 10) || 20,
    multiplicador: parseInt(document.getElementById('atk-mult').value, 10) || 2,
    bonusAtaque: parseInt(document.getElementById('atk-bonus').value, 10) || 0,
    tipoDano: document.getElementById('atk-tipo').value.trim(),
    alcance: document.getElementById('atk-alcance').value.trim(),
    pericia: document.getElementById('atk-pericia').value,
    atributoDano: document.getElementById('atk-atributo').value,
    danoExtra: document.getElementById('atk-dano-extra').value.trim(),
    notas: document.getElementById('atk-notas').value.trim(),
  };
  if (ataqueEditIndex === null || ataqueEditIndex === undefined) state.ataques.push(ataque);
  else state.ataques[ataqueEditIndex] = ataque;
  document.getElementById('modal-ataque').hidden = true;
  saveState(); renderAtaques();
}
function bindEvents() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    el.querySelectorAll('.attr-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        let val = state.atributos[key] + +btn.dataset.delta;
        if (val < 0) val = 0; if (val > 5) val = 5;
        state.atributos[key] = val;
        state.vidaAtual = null; state.peAtual = null;
        renderAtributos(); renderRecursos(); renderPericias(); scheduleSave();
      });
    });
  });
  document.querySelectorAll('.nex-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.nex = Math.max(5, Math.min(99, state.nex + +btn.dataset.delta));
      document.getElementById('nex-display').textContent = state.nex + '%';
      state.vidaAtual = null; state.sanAtual = null; state.peAtual = null;
      renderRecursos(); scheduleSave();
    });
  });
  document.querySelectorAll('.res-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const res = btn.dataset.res; const delta = +btn.dataset.delta;
      const { pvMax, sanMax, peMax } = calcularRecursos();
      if (res === 'vida') state.vidaAtual = Math.max(0, Math.min(pvMax, (state.vidaAtual ?? pvMax) + delta));
      else if (res === 'sanidade') state.sanAtual = Math.max(0, Math.min(sanMax, (state.sanAtual ?? sanMax) + delta));
      else if (res === 'esforco') state.peAtual = Math.max(0, Math.min(peMax, (state.peAtual ?? peMax) + delta));
      renderRecursos(); scheduleSave();
    });
  });
  document.getElementById('classe').addEventListener('change', (e) => {
    state.classe = e.target.value;
    state.vidaAtual = null; state.sanAtual = null; state.peAtual = null;
    if (!state.habilidades.length) state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
    scheduleSave(); renderAll();
  });
  document.getElementById('origem').addEventListener('change', (e) => {
    state.origem = e.target.value; applyOrigemPericias();
    renderPericias(); renderRecursos(); scheduleSave();
  });
  ['nome','jogador','patente','aparencia','personalidade','historico','objetivo','anotacoes','credito'].forEach((id) => {
    document.getElementById(id).addEventListener('input', (e) => { state[id] = e.target.value; scheduleSave(); });
  });
  document.getElementById('pp').addEventListener('input', (e) => { state.pp = parseInt(e.target.value) || 0; scheduleSave(); });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
  document.getElementById('btn-add-hab').addEventListener('click', () => { state.habilidades.push({ nome: '', desc: '' }); renderHabilidades(); scheduleSave(); });
  document.getElementById('btn-add-ritual').addEventListener('click', () => { state.rituais.push({ nome: '', circulo: '', desc: '' }); renderRituais(); scheduleSave(); });
  document.getElementById('btn-add-item').addEventListener('click', () => { state.itens.push({ nome: '', tipo: 'geral', categoria: '0', espacos: 1, desc: '' }); renderItens(); scheduleSave(); });
  document.querySelectorAll('.btn-type').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      state.itens.push({ nome: '', tipo, categoria: tipo === 'amaldicoado' ? 'I' : '0', espacos: 1, desc: '' });
      renderItens(); scheduleSave();
    });
  });
  ['I','II','III','IV'].forEach((cat) => {
    const el = document.getElementById('limite-' + cat);
    if (el) el.addEventListener('input', (e) => { state.itensLimite[cat] = parseInt(e.target.value) || 0; scheduleSave(); });
  });
  const patenteInv = document.getElementById('patente-inv');
  if (patenteInv) patenteInv.addEventListener('input', (e) => {
    state.patente = e.target.value;
    const main = document.getElementById('patente');
    if (main) main.value = e.target.value;
    scheduleSave();
  });
  document.getElementById('btn-add-ataque').addEventListener('click', () => openAtaqueModal(null));
  document.getElementById('btn-salvar-ataque').addEventListener('click', salvarAtaqueModal);
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => { const el = document.getElementById(btn.getAttribute('data-close')); if (el) el.hidden = true; });
  });
  document.getElementById('modal-ataque')?.addEventListener('click', (e) => { if (e.target.id === 'modal-ataque') e.target.hidden = true; });
  document.getElementById('btn-export').addEventListener('click', exportJSON);
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', importJSON);
  document.getElementById('btn-new').addEventListener('click', novaFicha);
  document.getElementById('btn-print').addEventListener('click', () => window.print());
}
function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = (state.nome || 'ficha') + '-ordem-paranormal.json'; a.click();
  URL.revokeObjectURL(url);
}
function importJSON(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      Object.assign(state, JSON.parse(ev.target.result));
      if (!state.itensLimite) state.itensLimite = { I: 2, II: 0, III: 0, IV: 0 };
      saveState(); renderAll(); alert('Ficha importada com sucesso!');
    } catch (err) { alert('Erro ao importar JSON.'); }
  };
  reader.readAsText(file); e.target.value = '';
}
function novaFicha() {
  if (!confirm('Criar uma nova ficha?')) return;
  Object.assign(state, {
    nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
    vidaAtual: null, sanAtual: null, peAtual: null,
    aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
    habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
    itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
  });
  applyOrigemPericias();
  state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  saveState(); renderAll();
}
function init() {
  const loaded = loadState();
  if (!loaded) {
    applyOrigemPericias();
    state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  }
  bindEvents(); renderAll();
  setSaveStatus(loaded ? 'Ficha restaurada' : 'Salvo automaticamente', 'saved');
}
init();
