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
// ... (rest of the file is the same as before the placeholder; full content is in local fixed version)
