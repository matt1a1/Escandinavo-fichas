// ===== ESTADO DA FICHA =====
const state = {
  nome: '',
  jogador: '',
  origem: 'investigador',
  classe: 'ocultista',
  nex: 5,
  patente: 'Recruta',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  periciasTreinadas: {}, // id -> true
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

function pontosUsados() {
  let total = 0;
  for (const v of Object.values(state.atributos)) {
    total += v;
  }
  // Começa com 5 (todos em 1) → 4 pontos livres = máximo 9
  // Se baixar um para 0, tem 5 pontos livres = máximo 9 ainda (0+1+1+1+3 etc)
  return total - 5; // pontos gastos além do mínimo
}

function pontosDisponiveis() {
  // 4 pontos base. Se algum atributo estiver em 0, ganha +1
  const temZero = Object.values(state.atributos).some((v) => v === 0);
  const base = temZero ? 5 : 4;
  const usados = Object.values(state.atributos).reduce((a, b) => a + b, 0) - 5 + (temZero ? 1 : 0);
  // Forma mais clara:
  // Soma atual dos atributos
  const soma = Object.values(state.atributos).reduce((a, b) => a + b, 0);
  // Máximo permitido: 5 (todos 1) + 4 = 9, ou se tiver 0: 4 + 5 = 9
  const maxSoma = 9;
  return maxSoma - soma;
}

function calcularRecursos() {
  const cls = CLASSES[state.classe];
  const nexSteps = Math.floor(state.nex / 5); // a cada 5% de NEX

  // Em NEX 5% = 1 passo
  const passos = Math.max(1, nexSteps);

  const pvMax = cls.pvBase + getAttr('vig') + (passos - 1) * (cls.pvPorNex + getAttr('vig'));
  // Simplificação oficial comum em mesas: base + VIG no nível 1 (NEX 5%)
  // e depois + (basePorNex + VIG) a cada +5% NEX

  // Versão mais fiel usada pela maioria das mesas e fichas digitais:
  // PV = base da classe + Vigor  (em NEX 5%)
  // A cada +5% NEX: + (pvPorNex + Vigor)
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

function calcularEsquiva() {
  const base = calcularDefesa();
  if (state.periciasTreinadas['reflexos']) {
    return base + 5; // treinado em Reflexos
  }
  return base;
}

function calcularBloqueio() {
  if (state.periciasTreinadas['fortitude']) {
    return 5; // valor de treinamento
  }
  return 0;
}

function calcularCargaMax() {
  return Math.max(1, getAttr('for')) * 5;
}

function calcularDTRituais() {
  // DT base comum = 10 + PRE ou similar; muitas mesas usam 10 + NEX/10 + PRE
  return 10 + getAttr('pre') + Math.floor(state.nex / 10);
}

function periciasMax() {
  const cls = CLASSES[state.classe];
  const origem = ORIGENS[state.origem];
  const origemCount = origem?.pericias?.length ?? 2;
  // Fórmula usada pela comunidade e fichas oficiais aproximadas:
  // Ocultista / Combatente: 1 + INT + origem
  // Especialista: 3 + INT + origem (ou 7+INT em algumas interpretações antigas)
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

  // Clamp
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
  document.getElementById('pe-turno').textContent = 1; // base
  document.getElementById('proficiencias').textContent = CLASSES[state.classe].proficiencias;
  document.getElementById('carga-max').textContent = calcularCargaMax();
  document.getElementById('dt-rituais').textContent = calcularDTRituais();
}

function renderPericias() {
  const list = document.getElementById('pericias-list');
  list.innerHTML = '';

  const treinadas = Object.keys(state.periciasTreinadas).filter((k) => state.periciasTreinadas[k]).length;
  document.getElementById('pericias-count').textContent = treinadas;
  document.getElementById('pericias-max').textContent = periciasMax();

  PERICIAS.forEach((p) => {
    const trained = !!state.periciasTreinadas[p.id];
    const bonus = trained ? 5 : 0;

    const row = document.createElement('div');
    row.className = 'pericia-row' + (trained ? ' trained' : '');
    row.innerHTML = `
      <div class="pericia-nome">
        ${p.nome}
        <span class="attr-tag">${p.attr}</span>
      </div>
      <div class="pericia-bonus ${bonus ? 'has-bonus' : ''}">${bonus ? `+${bonus}` : '—'}</div>
      <div class="pericia-treino">${trained ? '5' : '0'}</div>
      <div class="pericia-outros">0</div>
      <div></div>
    `;
    row.addEventListener('click', () => {
      if (state.periciasTreinadas[p.id]) {
        delete state.periciasTreinadas[p.id];
      } else {
        // Verifica limite
        const atuais = Object.keys(state.periciasTreinadas).filter((k) => state.periciasTreinadas[k]).length;
        if (atuais >= periciasMax()) {
          alert(`Você já atingiu o limite de perícias treinadas (${periciasMax()}). Aumente o Intelecto ou escolha outra classe/origem.`);
          return;
        }
        state.periciasTreinadas[p.id] = true;
      }
      renderPericias();
      renderRecursos(); // atualiza bloqueio/esquiva
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
  // Remove perícias antigas de origem? Não — o usuário controla.
  // Apenas adiciona as da origem atual se ainda não tiver.
  origem.pericias.forEach((id) => {
    state.periciasTreinadas[id] = true;
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
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

// ===== EVENTOS =====
function bindEvents() {
  // Atributos
  document.querySelectorAll('.attr-item').forEach((el) => {
    const key = el.dataset.attr;
    el.querySelectorAll('.attr-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = +btn.dataset.delta;
        let val = state.atributos[key] + delta;
        if (val < 0) val = 0;
        if (val > 5) val = 5; // limite prático (criação max 3, depois sobe)
        // Na criação o ideal é max 3, mas permitimos mais para NEX alto
        state.atributos[key] = val;
        // Recalcula recursos se VIG ou PRE mudou
        state.vidaAtual = null;
        state.peAtual = null;
        renderAtributos();
        renderRecursos();
        renderPericias();
      });
    });
  });

  // NEX
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

  // Recursos manuais
  document.querySelectorAll('.res-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const res = btn.dataset.res;
      const delta = +btn.dataset.delta;
      const { pvMax, sanMax, peMax } = calcularRecursos();
      if (res === 'vida') {
        state.vidaAtual = Math.max(0, Math.min(pvMax, (state.vidaAtual ?? pvMax) + delta));
      } else if (res === 'sanidade') {
        state.sanAtual = Math.max(0, Math.min(sanMax, (state.sanAtual ?? sanMax) + delta));
      } else if (res === 'esforco') {
        state.peAtual = Math.max(0, Math.min(peMax, (state.peAtual ?? peMax) + delta));
      }
      renderRecursos();
    });
  });

  // Classe e Origem
  document.getElementById('classe').addEventListener('change', (e) => {
    state.classe = e.target.value;
    state.vidaAtual = null;
    state.sanAtual = null;
    state.peAtual = null;
    // Adiciona habilidades iniciais se lista estiver vazia
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

  // Campos de texto
  ['nome', 'jogador', 'patente', 'aparencia', 'personalidade', 'historico', 'objetivo', 'anotacoes', 'credito'].forEach((id) => {
    document.getElementById(id).addEventListener('input', (e) => {
      state[id] = e.target.value;
    });
  });
  document.getElementById('pp').addEventListener('input', (e) => {
    state.pp = parseInt(e.target.value) || 0;
  });

  // Tabs
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Adicionar itens
  document.getElementById('btn-add-hab').addEventListener('click', () => {
    state.habilidades.push({ nome: '', desc: '' });
    renderHabilidades();
  });
  document.getElementById('btn-add-ritual').addEventListener('click', () => {
    state.rituais.push({ nome: '', circulo: '', desc: '' });
    renderRituais();
  });
  document.getElementById('btn-add-item').addEventListener('click', () => {
    state.itens.push({ nome: '', categoria: '0', espacos: 1, desc: '' });
    renderItens();
  });
  document.getElementById('btn-add-ataque').addEventListener('click', () => {
    state.ataques.push({ nome: '', teste: '', dano: '', desc: '' });
    renderAtaques();
  });

  // Export / Import / New / Print
  document.getElementById('btn-export').addEventListener('click', exportJSON);
  document.getElementById('btn-import').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
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
    nome: '',
    jogador: '',
    origem: 'investigador',
    classe: 'ocultista',
    nex: 5,
    patente: 'Recruta',
    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
    periciasTreinadas: {},
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
  });
  applyOrigemPericias();
  const cls = CLASSES[state.classe];
  state.habilidades = cls.habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  renderAll();
}

// ===== INIT =====
function init() {
  applyOrigemPericias();
  const cls = CLASSES[state.classe];
  state.habilidades = cls.habilidadesIniciais.map((n) => ({ nome: n, desc: '' }));
  bindEvents();
  renderAll();
}

init();
