const state = {
  nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
  tipoFicha: 'ordem',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
  vidaAtual: null, sanAtual: null, peAtual: null,
  aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
  habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
  itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
  pvMaxOverride: null, sanMaxOverride: null, peMaxOverride: null,
};
function isFichaCustom() { return !!(state && state.tipoFicha === 'custom'); }
function isFichaLivre() { return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras')); }
window.isFichaCustom = isFichaCustom;
window.isFichaLivre = isFichaLivre;
const AGENTES_REGISTRO_KEY = 'escandinavo-agentes-registro';
function getAgenteIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'v1';
}
const AGENTE_ID = getAgenteIdFromUrl();
const STORAGE_KEY = 'escandinavo-ficha-' + AGENTE_ID;
function lerRegistroAgentes() {
  try { return JSON.parse(localStorage.getItem(AGENTES_REGISTRO_KEY)) || []; }
  catch (e) { return []; }
}
function syncAgenteRegistro() {
  try {
    const registro = lerRegistroAgentes();
    const idx = registro.findIndex((a) => a.id === AGENTE_ID);
    const prev = idx >= 0 ? registro[idx] : {};
    const entrada = {
      id: AGENTE_ID,
      nome: state.nome || 'Sem nome',
      classe: state.classe,
      origem: state.origem,
      nex: state.nex,
      tipoFicha: state.tipoFicha || prev.tipoFicha || 'ordem',
      atualizadoEm: Date.now(),
    };
    if (idx === -1) registro.push(entrada); else registro[idx] = Object.assign({}, prev, entrada);
    localStorage.setItem(AGENTES_REGISTRO_KEY, JSON.stringify(registro));
  } catch (e) {}
}
let saveTimer = null;
let ataqueEditIndex = null;
let ritualEditIndex = null;
let itemEditIndex = null;
window._atkExtras = [];
function getAttr(key) { return state.atributos[key] ?? 1; }
function nexAumentosAtributo() {
  const n = Number(state.nex) || 5;
  let q = 0;
  if (n >= 20) q++;
  if (n >= 50) q++;
  if (n >= 80) q++;
  if (n >= 95) q++;
  return q;
}
function pontosDisponiveis() {
  if (isFichaCustom()) return 999;
  const gastos = Object.values(state.atributos).reduce((a, b) => a + b, 0);
  return 9 + nexAumentosAtributo() - gastos;
}
function pontosAcimaDe3() {
  return Object.values(state.atributos).reduce((n, v) => n + Math.max(0, Number(v) - 3), 0);
}
function normalizarAtributosNex() {
  if (isFichaCustom()) return;
  const extra = nexAumentosAtributo();
  const keys = ['for', 'agi', 'int', 'pre', 'vig'];
  while (pontosAcimaDe3() > extra) {
    let best = null;
    keys.forEach((k) => {
      if (state.atributos[k] > 3 && (best == null || state.atributos[k] > state.atributos[best])) best = k;
    });
    if (!best) break;
    state.atributos[best] -= 1;
  }
}
function grauPorRodada() { return 2 + getAttr('int'); }
function grauLimite() {
  if (isFichaCustom()) return 99;
  const por = grauPorRodada();
  if (state.nex >= 70) return por * 2;
  if (state.nex >= 35) return por;
  return 0;
}
function grauCusto(rank) {
  if (rank >= 15) return 2;
  if (rank >= 10) return 1;
  return 0;
}
function grauUsosExceto(id) {
  return PERICIAS.reduce((n, p) => n + (p.id === id ? 0 : grauCusto(getPericiaRank(p.id))), 0);
}
function grauUsos() { return grauUsosExceto(null); }
function rankMaxNex() {
  if (isFichaCustom()) return 15;
  if (state.nex >= 70) return 15;
  if (state.nex >= 35) return 10;
  return 5;
}
let lastResourceMax = { pv: null, san: null, pe: null };
function nexNiveis(nex) {
  const n = Math.max(5, Number(nex) || 5);
  if (n >= 99) return 20;
  return Math.floor(n / 5);
}
function temHabilidade(nome) {
  const alvo = String(nome || '').toLowerCase();
  return (state.habilidades || []).some((h) => String(h.nome || '').toLowerCase() === alvo);
}
function calcularRecursos() {
  const cls = CLASSES[state.classe] || CLASSES.ocultista;
  const niveis = nexNiveis(state.nex);
  const extra = Math.max(0, niveis - 1);
  const vig = getAttr('vig');
  const pre = getAttr('pre');
  let pv = cls.pvBase + vig + extra * (cls.pvPorNex + vig);
  let pe = cls.peBase + pre + extra * (cls.pePorNex + pre);
  let san = cls.sanBase + extra * cls.sanPorNex;
  if (temHabilidade('Sangue de Ferro')) pv += 2 * niveis;
  if (temHabilidade('Potencial Aprimorado')) pe += niveis;
  if (state.pvMaxOverride != null && state.pvMaxOverride !== '') pv = Number(state.pvMaxOverride) || pv;
  if (state.sanMaxOverride != null && state.sanMaxOverride !== '') san = Number(state.sanMaxOverride) || san;
  if (state.peMaxOverride != null && state.peMaxOverride !== '') pe = Number(state.peMaxOverride) || pe;
  return { pvMax: Math.max(1, pv), sanMax: Math.max(1, san), peMax: Math.max(1, pe), niveis, cls };
}
function calcularPeTurno() {
  const n = Math.max(5, Number(state.nex) || 5);
  return 1 + Math.floor((n >= 99 ? 99 : n) / 10);
}
function peritoEscala(nex) {
  const n = Number(nex) || 5;
  if (n >= 85) return { pe: 5, dado: '1d12' };
  if (n >= 55) return { pe: 4, dado: '1d8' };
  if (n >= 25) return { pe: 3, dado: '1d6' };
  return { pe: 2, dado: '1d4' };
}
function circuloOcultista(nex) {
  const n = Number(nex) || 5;
  if (n >= 85) return 4;
  if (n >= 55) return 3;
  if (n >= 25) return 2;
  return 1;
}
function clampRecurso(atual, max, last) {
  if (atual === null || atual === undefined) return max;
  if (last != null) atual = atual + (max - last);
  return Math.max(0, Math.min(max, atual));
}
function calcularDefesa() {
  let def = 10 + getAttr('agi');
  let prot = 0, escudo = 0;
  (state.itens || []).forEach((item) => {
    if (item.tipo !== 'protecao') return;
    const d = Number(item.defesa) || 0;
    if (/escudo/i.test(item.nome || '')) escudo += d;
    else if (d > prot) prot = d;
  });
  return def + prot + escudo;
}
function calcularCargaMax() {
  let f = getAttr('for');
  if (temHabilidade('Inventário Otimizado')) f += getAttr('int');
  let max = f <= 0 ? 2 : f * 5;
  (state.itens || []).forEach((item) => {
    if (/mochila militar/i.test(item.nome || '')) max += 2;
  });
  return max;
}
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
function getPericiaAttrKey(id) {
  const p = PERICIAS.find((x) => x.id === id);
  const map = { FOR: 'for', AGI: 'agi', INT: 'int', PRE: 'pre', VIG: 'vig' };
  return map[(p?.attr || '').toUpperCase()] || 'int';
}
function getPericiaTeste(id) {
  return getAttr(getPericiaAttrKey(id)) + getPericiaRank(id) + getPericiaOther(id);
}
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
function calcularDTRituais() { return 10 + getAttr('pre') + Math.floor(state.nex / 10); }
function periciasMax() {
  if (isFichaCustom()) return 99;
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
  try {
    state.atualizadoEm = Date.now();
    if (state.tipoFicha == null) state.tipoFicha = 'ordem';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncAgenteRegistro();
    setSaveStatus('Salvo automaticamente', 'saved');
  } catch (e) { setSaveStatus('Erro ao salvar', ''); }
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
    if (!state.atributos || typeof state.atributos !== 'object') state.atributos = { for: 1, agi: 1, int: 1, pre: 1, vig: 1 };
    if (!state.itensLimite) state.itensLimite = { I: 2, II: 0, III: 0, IV: 0 };
    if (!state.pericias) state.pericias = {};
    if (!state.ataques) state.ataques = [];
    if (!state.rituais) state.rituais = [];
    if (!state.habilidades) state.habilidades = [];
    if (!state.itens) state.itens = [];
    if (state.tipoFicha == null || state.tipoFicha === '') state.tipoFicha = 'ordem';
    if (!('pvMaxOverride' in state)) state.pvMaxOverride = null;
    if (!('sanMaxOverride' in state)) state.sanMaxOverride = null;
    if (!('peMaxOverride' in state)) state.peMaxOverride = null;
    return true;
  } catch (e) { return false; }
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}
function renderAtributos() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    el.querySelector('.attr-value').textContent = state.atributos[el.dataset.attr];
  });
  const pts = pontosDisponiveis();
  const el = document.getElementById('attr-points');
  if (el) { el.textContent = pts; el.style.color = pts < 0 ? 'var(--danger)' : 'var(--accent)'; }
  const hint = document.getElementById('attr-nex-hint');
  if (hint) {
    if (isFichaCustom()) {
      hint.textContent = ' · Ficha Customizada: sem limite de pontos nem teto de atributo (0–20)';
    } else {
      const extra = nexAumentosAtributo();
      const marcas = [20, 50, 80, 95].filter((n) => state.nex >= n).map((n) => n + '%');
      hint.textContent = extra
        ? ' · máx. inicial 3 · Aumento de Atributo +' + extra + '/4 (' + marcas.join(', ') + ' · até 5)'
        : ' · começam em 1 · 4 pontos · máx. inicial 3 · baixar a 0 dá +1 ponto';
    }
  }
}
function renderRecursos() {
  const { pvMax, sanMax, peMax, cls } = calcularRecursos();
  state.vidaAtual = clampRecurso(state.vidaAtual, pvMax, lastResourceMax.pv);
  state.sanAtual = clampRecurso(state.sanAtual, sanMax, lastResourceMax.san);
  state.peAtual = clampRecurso(state.peAtual, peMax, lastResourceMax.pe);
  lastResourceMax = { pv: pvMax, san: sanMax, pe: peMax };
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('vida-atual', state.vidaAtual); set('vida-max', pvMax);
  set('san-atual', state.sanAtual); set('san-max', sanMax);
  set('pe-atual', state.peAtual); set('pe-max', peMax);
  set('defesa', calcularDefesa()); set('bloqueio', calcularBloqueio()); set('esquiva', calcularEsquiva());
  set('pe-turno', calcularPeTurno()); set('proficiencias', cls.proficiencias);
  set('carga-max', calcularCargaMax()); set('dt-rituais', calcularDTRituais());
}
function renderPericias() {
  const list = document.getElementById('pericias-list');
  if (!list) return;
  list.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'pericia-row pericia-head';
  head.innerHTML = '<div>Perícia</div><div>Bônus</div><div>Treino</div><div>Outros</div><div></div>';
  list.appendChild(head);
  const pc = document.getElementById('pericias-count');
  if (pc) pc.textContent = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
  const pm = document.getElementById('pericias-max');
  if (pm) pm.textContent = periciasMax();
  const ranks = [0, 5, 10, 15];
  const rankLabel = { 0: '0', 5: '5', 10: '10 Vet.', 15: '15 Exp.' };
  PERICIAS.forEach((p) => {
    const rank = getPericiaRank(p.id);
    const other = getPericiaOther(p.id);
    const bonus = getPericiaBonus(p.id);
    const bonusTxt = bonus > 0 ? '+' + bonus : String(bonus);
    const row = document.createElement('div');
    row.className = 'pericia-row' + (rank > 0 ? ' trained' : '');
    row.innerHTML = '<div class="pericia-nome">' + p.nome + ' <span class="attr-tag">' + p.attr + '</span></div><div class="pericia-bonus ' + (bonus ? 'has-bonus' : '') + '">' + bonusTxt + '</div><div class="pericia-treino"><select class="rank-select">' + ranks.map((r) => '<option value="' + r + '" ' + (r === rank ? 'selected' : '') + '>' + rankLabel[r] + '</option>').join('') + '</select></div><div class="pericia-outros"><input type="number" class="other-input" value="' + other + '" min="-20" max="50" /></div><div></div>';
    const select = row.querySelector('.rank-select');
    select.addEventListener('change', (e) => {
      const novo = parseInt(e.target.value, 10);
      if (!isFichaCustom() && rank === 0 && novo > 0) {
        const atuais = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
        if (atuais >= periciasMax()) { alert('Limite de perícias atingido.'); e.target.value = String(rank); return; }
      }
      if (!isFichaCustom() && novo >= 10 && rank < 5) { alert('Grau de Treinamento só vale em perícia já treinada (5).'); e.target.value = String(rank); return; }
      if (!isFichaCustom() && novo > rankMaxNex()) { alert(novo >= 15 ? 'Expert (15) só a partir de NEX 70%.' : 'Veterano (10) só a partir de NEX 35%.'); e.target.value = String(rank); return; }
      if (!isFichaCustom() && grauUsosExceto(p.id) + grauCusto(novo) > grauLimite()) { alert('Limite de Grau de Treinamento.'); e.target.value = String(rank); return; }
      setPericiaRank(p.id, novo); renderPericias(); renderRecursos(); scheduleSave();
    });
    row.querySelector('.other-input').addEventListener('change', (e) => { setPericiaOther(p.id, parseInt(e.target.value, 10) || 0); renderPericias(); renderRecursos(); scheduleSave(); });
    list.appendChild(row);
  });
}
function renderOrigemSelect() {
  const sel = document.getElementById('origem');
  if (!sel) return;
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
function applyClassePericias() {
  const fixas = CLASSES[state.classe]?.periciasFixas || [];
  fixas.forEach((id) => { if (getPericiaRank(id) === 0) setPericiaRank(id, 5); });
}
function renderHabilidades() {
  const list = document.getElementById('habilidades-list');
  if (!list) return;
  list.innerHTML = '';
  if (!state.habilidades.length) { list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>'; return; }
  state.habilidades.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = '<input type="text" value="' + escapeHtml(h.nome) + '" data-field="nome" data-idx="' + i + '" placeholder="Nome" /><textarea data-field="desc" data-idx="' + i + '">' + escapeHtml(h.desc || '') + '</textarea><div class="item-actions"><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('change', (e) => { state.habilidades[+e.target.dataset.idx][e.target.dataset.field] = e.target.value; scheduleSave(); }));
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.habilidades.splice(+btn.dataset.idx, 1); scheduleSave(); renderHabilidades(); renderRecursos(); }));
}
function renderRituais() {
  const list = document.getElementById('rituais-list');
  if (!list) return;
  list.innerHTML = '';
  if (!state.rituais.length) { list.innerHTML = '<p class="empty-msg">Você ainda não possui rituais.</p>'; return; }
  state.rituais.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'ataque-card';
    card.innerHTML = '<h4>' + escapeHtml(r.nome || 'Ritual') + '</h4><div class="item-actions"><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.rituais.splice(+btn.dataset.idx, 1); scheduleSave(); renderRituais(); }));
}
function renderAtaques() {
  const list = document.getElementById('ataques-list');
  if (!list) return;
  list.innerHTML = '';
  if (!(state.ataques || []).length) { list.innerHTML = '<p class="empty-msg">Nenhum ataque.</p>'; return; }
  state.ataques.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'ataque-card';
    card.innerHTML = '<h4>' + escapeHtml(a.nome || 'Ataque') + '</h4><div class="item-actions"><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.ataques.splice(+btn.dataset.idx, 1); saveState(); renderAtaques(); }));
}
function renderItens() {
  const list = document.getElementById('itens-list');
  if (!list) return;
  list.innerHTML = '';
  if (!(state.itens || []).length) { list.innerHTML = '<p class="empty-msg">Inventário vazio.</p>'; return; }
  state.itens.forEach((it, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = '<strong>' + escapeHtml(it.nome || 'Item') + '</strong><div class="item-actions"><button type="button" class="btn-remove" data-idx="' + i + '">Remover</button></div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => btn.addEventListener('click', () => { state.itens.splice(+btn.dataset.idx, 1); scheduleSave(); renderItens(); renderRecursos(); }));
}
function renderAll() {
  renderAtributos(); renderRecursos(); renderPericias(); renderOrigemSelect();
  renderHabilidades(); renderRituais(); renderAtaques(); renderItens();
  const nexEl = document.getElementById('nex-display');
  if (nexEl) nexEl.textContent = state.nex + '%';
  ['nome','jogador','aparencia','personalidade','historico','objetivo','anotacoes'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && state[id] != null) el.value = state[id];
  });
  const cls = document.getElementById('classe');
  if (cls) cls.value = state.classe;
  const pat = document.getElementById('patente');
  if (pat) pat.value = state.patente;
  const cred = document.getElementById('credito');
  if (cred) cred.value = state.credito;
  const pp = document.getElementById('pp');
  if (pp) pp.value = state.pp;
}
function bindEvents() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    el.querySelectorAll('.attr-btn').forEach((btn) => btn.addEventListener('click', () => {
      const delta = +btn.dataset.delta;
      let val = state.atributos[key] + delta;
      if (isFichaCustom()) {
        if (val < 0) val = 0;
        if (val > 20) val = 20;
      } else {
        if (val < 0) val = 0;
        if (val > 5) val = 5;
        if (delta > 0) {
          if (pontosDisponiveis() <= 0) return;
          const acimaDepois = pontosAcimaDe3() - Math.max(0, state.atributos[key] - 3) + Math.max(0, val - 3);
          if (acimaDepois > nexAumentosAtributo()) {
            alert('O máximo inicial de cada atributo é 3. Aumento de Atributo (NEX 20%, 50%, 80% e 95%) permite subir até 5.');
            return;
          }
        }
      }
      if (val === state.atributos[key]) return;
      state.atributos[key] = val;
      renderAtributos(); renderRecursos(); renderPericias(); scheduleSave();
    }));
  });
  document.querySelectorAll('.nex-btn').forEach((btn) => btn.addEventListener('click', () => {
    state.nex = Math.max(5, Math.min(99, state.nex + +btn.dataset.delta));
    const nd = document.getElementById('nex-display');
    if (nd) nd.textContent = state.nex + '%';
    normalizarAtributosNex();
    renderAtributos(); renderRecursos(); renderPericias(); scheduleSave();
  }));
  document.querySelectorAll('.res-btn').forEach((btn) => btn.addEventListener('click', () => {
    const res = btn.dataset.res; const delta = +btn.dataset.delta;
    const { pvMax, sanMax, peMax } = calcularRecursos();
    if (res === 'vida') state.vidaAtual = Math.max(0, Math.min(pvMax, (state.vidaAtual ?? pvMax) + delta));
    else if (res === 'sanidade') state.sanAtual = Math.max(0, Math.min(sanMax, (state.sanAtual ?? sanMax) + delta));
    else if (res === 'esforco') state.peAtual = Math.max(0, Math.min(peMax, (state.peAtual ?? peMax) + delta));
    renderRecursos(); scheduleSave();
  }));
  const origemEl = document.getElementById('origem');
  if (origemEl) origemEl.addEventListener('change', (e) => { state.origem = e.target.value; applyOrigemPericias(); renderPericias(); renderRecursos(); scheduleSave(); });
  const classeEl = document.getElementById('classe');
  if (classeEl) classeEl.addEventListener('change', (e) => { state.classe = e.target.value; applyClassePericias(); renderAll(); scheduleSave(); });
  ['nome','jogador','aparencia','personalidade','historico','objetivo','anotacoes'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', (e) => { state[id] = e.target.value; scheduleSave(); });
  });
  const ppEl = document.getElementById('pp');
  if (ppEl) ppEl.addEventListener('input', (e) => { state.pp = parseInt(e.target.value) || 0; scheduleSave(); });
  const btnNew = document.getElementById('btn-new');
  if (btnNew) btnNew.addEventListener('click', () => {
    if (!confirm('Criar uma nova ficha?')) return;
    const tipoKeep = state.tipoFicha || 'ordem';
    Object.assign(state, {
      nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
      tipoFicha: tipoKeep,
      atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
      vidaAtual: null, sanAtual: null, peAtual: null,
      aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
      habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
      itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
      pvMaxOverride: null, sanMaxOverride: null, peMaxOverride: null,
    });
    applyOrigemPericias(); applyClassePericias();
    state.habilidades = (CLASSES[state.classe]?.habilidadesIniciais || []).map((n) => ({ nome: n, desc: '' }));
    lastResourceMax = { pv: null, san: null, pe: null };
    saveState(); renderAll();
  });
  // ABAS — Descrição / Habilidades / Rituais / Inventário / Combate / Arquivos Secretos
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (!target) return;
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
  const btnAddHab = document.getElementById('btn-add-hab');
  if (btnAddHab) btnAddHab.addEventListener('click', () => {
    if (!state.habilidades) state.habilidades = [];
    state.habilidades.push({ nome: '', desc: '' });
    renderHabilidades(); scheduleSave();
  });
  const btnAddRitual = document.getElementById('btn-add-ritual');
  if (btnAddRitual) btnAddRitual.addEventListener('click', () => {
    if (typeof openRitualModal === 'function') openRitualModal(null);
    else {
      if (!state.rituais) state.rituais = [];
      state.rituais.push({ nome: 'Novo ritual', desc: '' });
      renderRituais(); scheduleSave();
    }
  });
  const btnAddItem = document.getElementById('btn-add-item');
  if (btnAddItem) btnAddItem.addEventListener('click', () => {
    if (typeof openItemModal === 'function') { openItemModal._tipo = 'geral'; openItemModal(null); }
    else {
      if (!state.itens) state.itens = [];
      state.itens.push({ nome: 'Novo item', tipo: 'geral' });
      renderItens(); scheduleSave();
    }
  });
  const btnAddAtk = document.getElementById('btn-add-ataque');
  if (btnAddAtk) btnAddAtk.addEventListener('click', () => {
    if (typeof openAtaqueModal === 'function') openAtaqueModal(null);
    else {
      if (!state.ataques) state.ataques = [];
      state.ataques.push({ nome: 'Novo ataque' });
      renderAtaques(); scheduleSave();
    }
  });
}
function init() {
  const loaded = loadState();
  if (!loaded) {
    applyOrigemPericias();
    applyClassePericias();
    state.habilidades = (CLASSES[state.classe]?.habilidadesIniciais || []).map((n) => ({ nome: n, desc: '' }));
  } else {
    applyClassePericias();
  }
  normalizarAtributosNex();
  bindEvents(); renderAll();
  setSaveStatus(loaded ? 'Ficha restaurada' : 'Salvo automaticamente', 'saved');
}
init();
