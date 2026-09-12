// ===== ESTADO DA FICHA =====
const state = {
  nome: '',
  jogador: '',
  origem: 'investigador',
  classe: 'ocultista',
  nex: 5,
  patente: 'Recruta',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  pericias: {}, // id -> { rank: 0|5|10|15, other: number }
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

function getAttr(key) {
  return state.atributos[key] ?? 1;
}

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
  const origemCount = origem?.pericias?.length ?? 2;
  return (cls.periciasBase || 1) + getAttr('int') + origemCount;
}

function renderAtributos() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    el.querySelector('.attr-value').textContent = state.atributos[key];
  });
  const pts = pontosDisponiveis();
  document.getElementById('attr-points').textContent = pts;
  document.getElementById('attr-points').style.color = pts < 0 ? 'var(--danger)' : 'var(--accent)';
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
  const cargaMaxEl = document.getElementById('carga-max');
  if (cargaMaxEl) cargaMaxEl.textContent = calcularCargaMax();
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
    const trained = rank > 0;
    const row = document.createElement('div');
    row.className = 'pericia-row' + (trained ? ' trained' : '');
    row.innerHTML = `
      <div class="pericia-nome">${p.nome}<span class="attr-tag">${p.attr}</span></div>
      <div class="pericia-bonus ${bonus ? 'has-bonus' : ''}">${bonus ? '+' + bonus : '—'}</div>
      <div class="pericia-treino">
        <select class="rank-select" data-id="${p.id}">
          ${ranks.map((r) => `<option value="${r}" ${r === rank ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="pericia-outros">
        <input type="number" class="other-input" data-id="${p.id}" value="${other}" min="-20" max="50" />
      </div>
      <div></div>`;
    const select = row.querySelector('.rank-select');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', (e) => {
      const novo = parseInt(e.target.value, 10);
      const atual = getPericiaRank(p.id);
      if (atual === 0 && novo > 0) {
        const atuais = Object.keys(state.pericias).filter((k) => getPericiaRank(k) > 0).length;
        if (atuais >= periciasMax()) {
          alert('Você já atingiu o limite de perícias treinadas (' + periciasMax() + ').');
          e.target.value = '0';
          return;
        }
      }
      setPericiaRank(p.id, novo);
      renderPericias();
      renderRecursos();
    });
    const otherInput = row.querySelector('.other-input');
    otherInput.addEventListener('click', (e) => e.stopPropagation());
    otherInput.addEventListener('change', (e) => {
      setPericiaOther(p.id, parseInt(e.target.value, 10) || 0);
      renderPericias();
      renderRecursos();
    });
    list.appendChild(row);
  });
}

function renderOrigemSelect() {
  const sel = document.getElementById('origem');
  sel.innerHTML = '';
  for (const [id, o] of Object.entries(ORIGENS)) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = o.nome;
    if (id === state.origem) opt.selected = true;
    sel.appendChild(opt);
  }
}

function applyOrigemPericias() {
  const origem = ORIGENS[state.origem];
  if (!origem) return;
  origem.pericias.forEach((id) => {
    if (getPericiaRank(id) === 0) setPericiaRank(id, 5);
  });
}

function renderHabilidades() {
  const list = document.getElementById('habilidades-list');
  list.innerHTML = '';
  if (state.habilidades.length === 0) {
    list.innerHTML = '<p class="empty-msg">Nenhuma habilidade adicionada ainda.</p>';
    return;
  }
  state.habilidades.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(h.nome)}" placeholder="Nome" data-field="nome" data-idx="${i}" />
      <textarea placeholder="Descrição..." data-field="desc" data-idx="${i}">${escapeHtml(h.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      state.habilidades[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
    });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.habilidades.splice(+btn.dataset.idx, 1);
      renderHabilidades();
    });
  });
}

function renderRituais() {
  const list = document.getElementById('rituais-list');
  list.innerHTML = '';
  if (state.rituais.length === 0) {
    list.innerHTML = '<p class="empty-msg">Você ainda não possui rituais.</p>';
    return;
  }
  state.rituais.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(r.nome)}" placeholder="Nome do ritual" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(r.circulo || '')}" placeholder="Círculo / Elemento" data-field="circulo" data-idx="${i}" />
      <textarea placeholder="Efeito, custo, DT..." data-field="desc" data-idx="${i}">${escapeHtml(r.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      state.rituais[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
    });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.rituais.splice(+btn.dataset.idx, 1);
      renderRituais();
    });
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
  const cI = document.getElementById('count-I');
  if (cI) {
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

  if (state.itens.length === 0) {
    list.innerHTML = '<p class="empty-msg">Você ainda não possui itens.</p>';
    return;
  }
  const tipoLabel = { arma: 'Arma', municao: 'Munição', protecao: 'Proteção', geral: 'Geral', amaldicoado: 'Item Amaldiçoado' };
  state.itens.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<span class="item-tipo-tag">${tipoLabel[item.tipo] || item.tipo || 'Geral'}</span>
      <input type="text" value="${escapeHtml(item.nome)}" placeholder="Nome do item" data-field="nome" data-idx="${i}" />
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <input type="text" value="${escapeHtml(item.categoria || '0')}" placeholder="Categoria" data-field="categoria" data-idx="${i}" />
        <input type="number" value="${item.espacos ?? 1}" placeholder="Espaços" data-field="espacos" data-idx="${i}" min="0" />
      </div>
      <textarea placeholder="Descrição / efeito..." data-field="desc" data-idx="${i}">${escapeHtml(item.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      const idx = +e.target.dataset.idx;
      const field = e.target.dataset.field;
      let val = e.target.value;
      if (field === 'espacos') val = parseInt(val) || 0;
      state.itens[idx][field] = val;
      renderItens();
    });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.itens.splice(+btn.dataset.idx, 1);
      renderItens();
    });
  });
}

function renderAtaques() {
  const list = document.getElementById('ataques-list');
  list.innerHTML = '';
  if (state.ataques.length === 0) {
    list.innerHTML = '<p class="empty-msg">Você ainda não possui ataques.</p>';
    return;
  }
  state.ataques.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<input type="text" value="${escapeHtml(a.nome)}" placeholder="Nome do ataque" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(a.teste || '')}" placeholder="Teste (ex: Pontaria +5)" data-field="teste" data-idx="${i}" />
      <input type="text" value="${escapeHtml(a.dano || '')}" placeholder="Dano (ex: 1d12)" data-field="dano" data-idx="${i}" />
      <textarea placeholder="Efeitos especiais..." data-field="desc" data-idx="${i}">${escapeHtml(a.desc || '')}</textarea>
      <div class="item-actions"><button type="button" class="btn-remove" data-idx="${i}">Remover</button></div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      state.ataques[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
    });
  });
  list.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.ataques.splice(+btn.dataset.idx, 1);
      renderAtaques();
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  renderOrigemSelect();
  renderAtributos();
  renderRecursos();
  renderPericias();
  renderHabilidades();
  renderRituais();
  renderItens();
  renderAtaques();
}

function bindEvents() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    el.querySelectorAll('.attr-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        let val = state.atributos[key] + +btn.dataset.delta;
        if (val < 0) val = 0;
        if (val > 5) val = 5;
        state.atributos[key] = val;
        state.vidaAtual = null;
        state.peAtual = null;
        renderAtributos();
        renderRecursos();
        renderPericias();
      });
    });
  });
  document.querySelectorAll('.nex-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.nex = Math.max(5, Math.min(99, state.nex + +btn.dataset.delta));
      document.getElementById('nex-display').textContent = state.nex + '%';
      state.vidaAtual = null; state.sanAtual = null; state.peAtual = null;
      renderRecursos();
    });
  });
  document.querySelectorAll('.res-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const res = btn.dataset.res;
      const delta = +btn.dataset.delta;
      const { pvMax, sanMax, peMax } = calcularRecursos();
      if (res === 'vida') state.vidaAtual = Math.max(0, Math.min(pvMax, (state.vidaAtual ?? pvMax) + delta));
      else if (res === 'sanidade') state.sanAtual = Math.max(0, Math.min(sanMax, (state.sanAtual ?? sanMax) + delta));
      else if (res === 'esforco') state.peAtual = Math.max(0, Math.min(peMax, (state.peAtual ?? peMax) + delta));
      renderRecursos();
    });
  });
  document.getElementById('classe').addEventListener('change', (e) => {
    state.classe = e.target.value;
    state.vidaAtual = null; state.sanAtual = null; state.peAtual = null;
    if (state.habilidades.length === 0) {
      state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
    }
    renderAll();
  });
  document.getElementById('origem').addEventListener('change', (e) => {
    state.origem = e.target.value;
    applyOrigemPericias();
    renderPericias();
    renderRecursos();
  });
  ['nome', 'jogador', 'patente', 'aparencia', 'personalidade', 'historico', 'objetivo', 'anotacoes', 'credito'].forEach((id) => {
    document.getElementById(id).addEventListener('input', (e) => { state[id] = e.target.value; });
  });
  document.getElementById('pp').addEventListener('input', (e) => { state.pp = parseInt(e.target.value) || 0; });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
  document.getElementById('btn-add-hab').addEventListener('click', () => { state.habilidades.push({ nome: '', desc: '' }); renderHabilidades(); });
  document.getElementById('btn-add-ritual').addEventListener('click', () => { state.rituais.push({ nome: '', circulo: '', desc: '' }); renderRituais(); });
  document.getElementById('btn-add-item').addEventListener('click', () => {
    state.itens.push({ nome: '', tipo: 'geral', categoria: '0', espacos: 1, desc: '' });
    renderItens();
  });
  document.querySelectorAll('.btn-type').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      state.itens.push({ nome: '', tipo, categoria: tipo === 'amaldicoado' ? 'I' : '0', espacos: 1, desc: '' });
      renderItens();
    });
  });
  ['I', 'II', 'III', 'IV'].forEach((cat) => {
    const el = document.getElementById('limite-' + cat);
    if (el) el.addEventListener('input', (e) => { state.itensLimite[cat] = parseInt(e.target.value) || 0; });
  });
  const patenteInv = document.getElementById('patente-inv');
  if (patenteInv) {
    patenteInv.addEventListener('input', (e) => {
      state.patente = e.target.value;
      const main = document.getElementById('patente');
      if (main) main.value = e.target.value;
    });
  }
  document.getElementById('btn-add-ataque').addEventListener('click', () => {
    state.ataques.push({ nome: '', teste: '', dano: '', desc: '' });
    renderAtaques();
  });
  document.getElementById('btn-export').addEventListener('click', exportJSON);
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', importJSON);
  document.getElementById('btn-new').addEventListener('click', novaFicha);
  document.getElementById('btn-print').addEventListener('click', () => window.print());
}

function exportJSON() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (state.nome || 'ficha') + '-ordem-paranormal.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      Object.assign(state, JSON.parse(ev.target.result));
      renderAll();
      alert('Ficha importada com sucesso!');
    } catch (err) {
      alert('Erro ao importar o arquivo JSON.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function novaFicha() {
  if (!confirm('Criar uma nova ficha? As alterações não salvas serão perdidas.')) return;
  Object.assign(state, {
    nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
    pericias: {}, vidaAtual: null, sanAtual: null, peAtual: null,
    aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
    habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
    itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
  });
  applyOrigemPericias();
  state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  renderAll();
}

function init() {
  applyOrigemPericias();
  state.habilidades = CLASSES[state.classe].habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  bindEvents();
  renderAll();
}

init();
