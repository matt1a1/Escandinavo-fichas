// ===== ESTADO DA FICHA =====
const state = {
  nome: '',
  jogador: '',
  origem: 'investigador',
  classe: 'ocultista',
  nex: 5,
  patente: 'Recruta',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  pericias: {}, // id -> 0 | 5 | 10 | 15
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
};

// ===== UTILITÁRIOS =====
function getAttr(key) {
  return state.atributos[key] ?? 1;
}

function pontosDisponiveis() {
  const soma = Object.values(state.atributos).reduce((a, b) => a + b, 0);
  const maxSoma = 9;
  return maxSoma - soma;
}

function calcularRecursos() {
  const cls = CLASSES[state.classe];
  const nexSteps = Math.floor(state.nex / 5);
  const pv = cls.pvBase + getAttr('vig') + (nexSteps - 1) * (cls.pvPorNex + getAttr('vig'));
  const san = cls.sanBase + (nexSteps - 1) * cls.sanPorNex;
  const pe = cls.peBase + getAttr('pre') + (nexSteps - 1) * (cls.pePorNex + getAttr('pre'));
  return {
    pvMax: Math.max(1, pv),
    sanMax: Math.max(1, san),
    peMax: Math.max(1, pe),
  };
}

function calcularDefesa() {
  return 10 + getAttr('agi');
}

function getPericiaBonus(id) {
  return state.pericias[id] || 0;
}

function calcularEsquiva() {
  const base = calcularDefesa();
  const bonus = getPericiaBonus('reflexos');
  return bonus > 0 ? base + bonus : base;
}

function calcularBloqueio() {
  return getPericiaBonus('fortitude');
}

function calcularCargaMax() {
  return Math.max(1, getAttr('for')) * 5;
}

function calcularDTRituais() {
  return 10 + getAttr('pre') + Math.floor(state.nex / 10);
}

function periciasMax() {
  const cls = CLASSES[state.classe];
  const origem = ORIGENS[state.origem];
  const origemCount = origem?.pericias?.length ?? 2;
  return (cls.periciasBase || 1) + getAttr('int') + origemCount;
}

// ===== RENDER =====
function renderAtributos() {
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    const val = state.atributos[key];
    el.querySelector('.attr-value').textContent = val;
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
  document.getElementById('carga-max').textContent = calcularCargaMax();
  document.getElementById('dt-rituais').textContent = calcularDTRituais();
}

function renderPericias() {
  const list = document.getElementById('pericias-list');
  list.innerHTML = '';
  const treinadas = Object.keys(state.pericias).filter((k) => (state.pericias[k] || 0) > 0).length;
  document.getElementById('pericias-count').textContent = treinadas;
  document.getElementById('pericias-max').textContent = periciasMax();
  const ranks = [0, 5, 10, 15];
  PERICIAS.forEach((p) => {
    const bonus = getPericiaBonus(p.id);
    const trained = bonus > 0;
    const row = document.createElement('div');
    row.className = 'pericia-row' + (trained ? ' trained' : '');
    row.innerHTML = `
      <div class="pericia-nome">
        ${p.nome}
        <span class="attr-tag">${p.attr}</span>
      </div>
      <div class="pericia-bonus ${bonus ? 'has-bonus' : ''}">${bonus ? `+${bonus}` : '—'}</div>
      <div class="pericia-treino">
        <select class="rank-select" data-id="${p.id}" title="Nível de treinamento">
          ${ranks.map((r) => `<option value="${r}" ${r === bonus ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="pericia-outros">0</div>
      <div></div>
    `;
    const select = row.querySelector('.rank-select');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', (e) => {
      const novo = parseInt(e.target.value, 10);
      const atual = getPericiaBonus(p.id);
      if (atual === 0 && novo > 0) {
        const atuais = Object.keys(state.pericias).filter((k) => (state.pericias[k] || 0) > 0).length;
        if (atuais >= periciasMax()) {
          alert(`Você já atingiu o limite de perícias treinadas (${periciasMax()}). Aumente o Intelecto ou escolha outra classe/origem.`);
          e.target.value = '0';
          return;
        }
      }
      if (novo === 0) {
        delete state.pericias[p.id];
      } else {
        state.pericias[p.id] = novo;
      }
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
    if (!state.pericias[id] || state.pericias[id] === 0) {
      state.pericias[id] = 5;
    }
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
    card.innerHTML = `
      <input type="text" value="${escapeHtml(h.nome)}" placeholder="Nome da habilidade" data-field="nome" data-idx="${i}" />
      <textarea placeholder="Descrição..." data-field="desc" data-idx="${i}">${escapeHtml(h.desc || '')}</textarea>
      <div class="item-actions">
        <button type="button" class="btn-remove" data-idx="${i}">Remover</button>
      </div>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      const idx = +e.target.dataset.idx;
      const field = e.target.dataset.field;
      state.habilidades[idx][field] = e.target.value;
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
    card.innerHTML = `
      <input type="text" value="${escapeHtml(r.nome)}" placeholder="Nome do ritual" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(r.circulo || '')}" placeholder="Círculo / Elemento" data-field="circulo" data-idx="${i}" />
      <textarea placeholder="Efeito, custo, DT..." data-field="desc" data-idx="${i}">${escapeHtml(r.desc || '')}</textarea>
      <div class="item-actions">
        <button type="button" class="btn-remove" data-idx="${i}">Remover</button>
      </div>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      const idx = +e.target.dataset.idx;
      const field = e.target.dataset.field;
      state.rituais[idx][field] = e.target.value;
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
  if (state.itens.length === 0) {
    list.innerHTML = '<p class="empty-msg">Você ainda não possui itens.</p>';
    return;
  }
  state.itens.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <input type="text" value="${escapeHtml(item.nome)}" placeholder="Nome do item" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(item.categoria || '')}" placeholder="Categoria (0, 1, 2...)" data-field="categoria" data-idx="${i}" />
      <input type="number" value="${item.espacos || 1}" placeholder="Espaços" data-field="espacos" data-idx="${i}" min="0" />
      <textarea placeholder="Descrição / efeito..." data-field="desc" data-idx="${i}">${escapeHtml(item.desc || '')}</textarea>
      <div class="item-actions">
        <button type="button" class="btn-remove" data-idx="${i}">Remover</button>
      </div>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      const idx = +e.target.dataset.idx;
      const field = e.target.dataset.field;
      let val = e.target.value;
      if (field === 'espacos') val = parseInt(val) || 0;
      state.itens[idx][field] = val;
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
    card.innerHTML = `
      <input type="text" value="${escapeHtml(a.nome)}" placeholder="Nome do ataque" data-field="nome" data-idx="${i}" />
      <input type="text" value="${escapeHtml(a.teste || '')}" placeholder="Teste (ex: Pontaria +5)" data-field="teste" data-idx="${i}" />
      <input type="text" value="${escapeHtml(a.dano || '')}" placeholder="Dano (ex: 1d12)" data-field="dano" data-idx="${i}" />
      <textarea placeholder="Efeitos especiais..." data-field="desc" data-idx="${i}">${escapeHtml(a.desc || '')}</textarea>
      <div class="item-actions">
        <button type="button" class="btn-remove" data-idx="${i}">Remover</button>
      </div>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('change', (e) => {
      const idx = +e.target.dataset.idx;
      const field = e.target.dataset.field;
      state.ataques[idx][field] = e.target.value;
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
        const delta = +btn.dataset.delta;
        let val = state.atributos[key] + delta;
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
      const delta = +btn.dataset.delta;
      state.nex = Math.max(5, Math.min(99, state.nex + delta));
      document.getElementById('nex-display').textContent = state.nex + '%';
      state.vidaAtual = null;
      state.sanAtual = null;
      state.peAtual = null;
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
    state.vidaAtual = null;
    state.sanAtual = null;
    state.peAtual = null;
    if (state.habilidades.length === 0) {
      const cls = CLASSES[state.classe];
      state.habilidades = cls.habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
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
  document.getElementById('btn-add-item').addEventListener('click', () => { state.itens.push({ nome: '', categoria: '0', espacos: 1, desc: '' }); renderItens(); });
  document.getElementById('btn-add-ataque').addEventListener('click', () => { state.ataques.push({ nome: '', teste: '', dano: '', desc: '' }); renderAtaques(); });
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
      const data = JSON.parse(ev.target.result);
      Object.assign(state, data);
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
  });
  applyOrigemPericias();
  const cls = CLASSES[state.classe];
  state.habilidades = cls.habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  renderAll();
}

function init() {
  applyOrigemPericias();
  const cls = CLASSES[state.classe];
  state.habilidades = cls.habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  bindEvents();
  renderAll();
}

init();
