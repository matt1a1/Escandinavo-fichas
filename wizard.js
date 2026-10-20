
const REGISTRO_KEY = 'escandinavo-agentes-registro';
const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';

function lerAgentes(){ try{ return JSON.parse(localStorage.getItem(REGISTRO_KEY)) || []; }catch(e){ return []; } }
function salvarAgentes(lista){ localStorage.setItem(REGISTRO_KEY, JSON.stringify(lista)); }
function lerCampanhas(){ try{ return JSON.parse(localStorage.getItem(CAMPANHAS_KEY)) || []; }catch(e){ return []; } }
function salvarCampanhas(lista){ localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(lista)); }

const CLASSE_LABEL = { combatente:'Combatente', especialista:'Especialista', ocultista:'Ocultista', mundano:'Mundano' };

const TIPOS_FICHA = {
  ordem: {
    id: 'ordem',
    nome: 'Ficha Ordem Paranormal',
    desc: 'Regras e limitações oficiais do sistema. Ideal para mesas fiéis ao livro.',
    icon: '◈'
  },
  custom: {
    id: 'custom',
    nome: 'Ficha Customizada',
    desc: 'Sem limites de atributos, vida, sanidade, esforço, defesa e perícias. Cálculos automáticos ainda funcionam e você pode sobrescrever valores.',
    icon: '✎'
  },
  mascaras: {
    id: 'mascaras',
    nome: 'Ficha das Máscaras',
    desc: 'Inspirada em Hexatombe. Inclui o botão “Colocar Máscara” com tema vermelho e poderes da máscara.',
    icon: '🎭'
  }
};

function formatarData(ts){
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR');
}

function renderAgentes(){
  const grid = document.getElementById('ag-grid');
  if (!grid) return;
  const searchEl = document.getElementById('ag-search');
  const termo = ((searchEl && searchEl.value) || '').toLowerCase();
  let lista = lerAgentes().sort((a,b)=> b.atualizadoEm - a.atualizadoEm);
  if (termo) lista = lista.filter(a => (a.nome||'').toLowerCase().includes(termo));
  const countEl = document.getElementById('ag-count');
  if (countEl) countEl.textContent = lerAgentes().length;
  grid.innerHTML = '';
  if (!lista.length){
    grid.innerHTML = '<div class="ag-empty">Nenhum agente ainda. Clique em "Novo Agente" para criar sua primeira ficha.</div>';
    return;
  }
  lista.forEach(a => {
    const card = document.createElement('div');
    card.className = 'ag-card';
    const tipoLabel = (TIPOS_FICHA[a.tipoFicha] || TIPOS_FICHA.ordem).nome.replace('Ficha ', '');
    const tipoBadge = a.tipoFicha && a.tipoFicha !== 'ordem'
      ? `<span class="ag-tipo-badge tipo-${a.tipoFicha}">${tipoLabel}</span>`
      : '';
    card.innerHTML = `
      <button class="del" title="Excluir" data-id="${a.id}">✕</button>
      <div class="avatar">◈</div>
      <h3>${a.nome || 'Sem nome'}</h3>
      <div class="meta">${CLASSE_LABEL[a.classe] || a.classe || '—'} · NEX ${a.nex ?? 5}% · atualizado em ${formatarData(a.atualizadoEm)}</div>
      ${tipoBadge}
      <a class="acessar" href="ficha.html?id=${encodeURIComponent(a.id)}">Acessar Ficha</a>
    `;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', () => {
    if (!confirm('Excluir este agente? Essa ação não pode ser desfeita.')) return;
    const id = btn.dataset.id;
    salvarAgentes(lerAgentes().filter(a => a.id !== id));
    localStorage.removeItem('escandinavo-ficha-' + id);
    renderAgentes();
  }));
}
window.renderAgentes = renderAgentes;
(function(){ var s=document.getElementById('ag-search'); if(s) s.addEventListener('input', renderAgentes); })();

function renderCampanhas(){
  const grid = document.getElementById('camp-grid');
  if (!grid) return;
  const lista = lerCampanhas().sort((a,b)=> b.criadaEm - a.criadaEm);
  const countEl = document.getElementById('camp-count');
  if (countEl) countEl.textContent = lista.length;
  grid.innerHTML = '';
  if (!lista.length){
    grid.innerHTML = '<div class="ag-empty">Nenhuma campanha ainda. Crie uma para organizar suas mesas.</div>';
    return;
  }
  lista.forEach(c => {
    const card = document.createElement('div');
    card.className = 'ag-card';
    card.innerHTML = `<div class="avatar">📋</div><h3>${c.nome}</h3><div class="meta">Iniciada em: ${formatarData(c.criadaEm)}</div>`;
    grid.appendChild(card);
  });
}
window.renderCampanhas = renderCampanhas;

(function(){
  var btn = document.getElementById('btn-nova-campanha');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const nome = prompt('Nome da campanha:');
    if (!nome || !nome.trim()) return;
    const lista = lerCampanhas();
    lista.push({ id: 'camp_' + Date.now().toString(36), nome: nome.trim(), jogadores: 0, criadaEm: Date.now() });
    salvarCampanhas(lista);
    renderCampanhas();
  });
})();

function mostrarView(view) {
  const views = ['agentes', 'campanhas', 'npc', 'criaturas'];
  views.forEach(function (v) {
    const el = document.getElementById('view-' + v);
    if (el) el.hidden = v !== view;
  });
  const detail = document.getElementById('view-camp-detail');
  if (detail && view !== 'campanhas') detail.hidden = true;
  document.querySelectorAll('.ag-nav a').forEach(function (a) {
    a.classList.toggle('active', a.dataset.view === view);
  });
  document.querySelectorAll('.mob-drawer-link[data-view]').forEach(function (a) {
    a.classList.toggle('active', a.dataset.view === view);
  });
  if (view === 'campanhas' && typeof renderCampanhas === 'function') renderCampanhas();
  if (view === 'agentes' && typeof renderAgentes === 'function') renderAgentes();
}
window.mostrarView = mostrarView;

document.querySelectorAll('.ag-nav a').forEach(link => link.addEventListener('click', () => {
  const view = link.dataset.view;
  if (!view) return;
  mostrarView(view);
}));

function irParaNovoNpc() {
  mostrarView('npc');
  const btn = document.getElementById('btn-novo-npc-tab');
  if (btn) btn.focus();
}
['btn-novo-npc', 'btn-novo-npc-tab'].forEach(function (id) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', irParaNovoNpc);
});

const STEPS = ['Atributos', 'Origem', 'Classe', 'Toques Finais'];
let stepAtual = 0;
let novoAgente = { nome:'', jogador:'', origem:'', classe:'', tipoFicha:'ordem' };

function abrirWizard(){
  stepAtual = -1;
  novoAgente = { nome:'', jogador:'', origem:'', classe:'', tipoFicha:'ordem' };
  var w = document.getElementById('wizard');
  if (w) w.hidden = false;
  const brand = document.querySelector('#wizard .wizard-top .brand');
  if (brand) brand.textContent = '◈ Novo Agente';
  renderWizard();
}
function fecharWizard(){ var w=document.getElementById('wizard'); if(w) w.hidden = true; }
(function(){
  var b1=document.getElementById('btn-novo-agente');
  if(b1) b1.addEventListener('click', abrirWizard);
  var b2=document.getElementById('wizard-close');
  if(b2) b2.addEventListener('click', () => {
    if (confirm('Cancelar a criação deste agente?')) fecharWizard();
  });
})();

function renderStepsBar(){
  const bar = document.getElementById('wizard-steps');
  if (!bar) return;
  if (stepAtual < 0) {
    bar.innerHTML = '<span class="step active">Tipo de Ficha</span>';
    return;
  }
  bar.innerHTML = STEPS.map((s,i) =>
    `<span class="step${i===stepAtual?' active':''}">${s}</span>` + (i<STEPS.length-1 ? '<span class="sep">──────</span>' : '')
  ).join('');
}

function passoTipoFicha(){
  const cards = Object.values(TIPOS_FICHA).map(t => `
    <button type="button" class="tipo-ficha-card${novoAgente.tipoFicha===t.id?' selected':''}" data-tipo="${t.id}">
      <div class="tipo-ficha-icon">${t.icon}</div>
      <div class="tipo-ficha-body">
        <h3>${t.nome}</h3>
        <p>${t.desc}</p>
      </div>
    </button>
  `).join('');
  return `
    <div class="tut-text">
      <p>Escolha o <b>tipo de ficha</b> deste agente. Isso define regras, limites e recursos especiais da ficha.</p>
    </div>
    <div class="tipo-ficha-grid">${cards}</div>
    <div class="wizard-nav">
      <div></div>
      <button type="button" class="btn-primary" id="btn-avancar-tipo">Continuar</button>
    </div>
  `;
}

function origensDisponiveis(){
  return (typeof ORIGENS !== 'undefined') ? ORIGENS : {};
}

const CLASSE_DESCRICAO = {
  combatente: 'Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente.',
  especialista: 'Um agente que confia mais em esperteza do que em força bruta. Se vale de conhecimento técnico, raciocínio rápido ou lábia.',
  ocultista: 'Estuda e domina os mistérios paranormais para combater o próprio Outro Lado.'
};

function renderWizard(){
  renderStepsBar();
  const body = document.getElementById('wizard-body');
  if (!body) return;
  const brand = document.querySelector('#wizard .wizard-top .brand');
  if (brand) {
    if (stepAtual < 0) brand.textContent = '◈ Novo Agente';
    else {
      const t = TIPOS_FICHA[novoAgente.tipoFicha] || TIPOS_FICHA.ordem;
      brand.textContent = '◈ ' + t.nome;
    }
  }
  if (stepAtual < 0) body.innerHTML = passoTipoFicha();
  else if (stepAtual === 0) body.innerHTML = passoAtributos();
  else if (stepAtual === 1) body.innerHTML = passoOrigem();
  else if (stepAtual === 2) body.innerHTML = passoClasse();
  else body.innerHTML = passoFinais();
  ligarEventosPasso();
  window.scrollTo(0,0);
}

function passoAtributos(){
  return `
    <div class="attr-layout">
      <div class="tut-text">
        <p>Quando você cria um personagem, todos os seus atributos começam em <b>1</b> e você recebe <b>4 pontos</b> para distribuir. Você também pode reduzir um atributo para <b>0</b> para receber <b>1 ponto</b> adicional. Máximo inicial: <b>3</b>.</p>
        <p style="margin-top:14px;font-size:.88rem;opacity:.85;">Você distribui os pontos na ficha depois de criar o agente.</p>
      </div>
    </div>
    ${navBotoes(true)}
  `;
}

function passoOrigem(){
  const origens = origensDisponiveis();
  const itens = Object.entries(origens).map(([id,o]) => `
    <details class="origem-item${novoAgente.origem===id?' selected':''}" data-id="${id}">
      <summary>
        <span>${o.nome}</span>
        <button type="button" class="btn-escolher" data-id="${id}">${novoAgente.origem===id?'Selecionada':'Escolher'}</button>
      </summary>
      <div class="det">
        <div><b>Perícias treinadas:</b> ${(o.pericias||[]).length ? o.pericias.join(', ') : '—'}</div>
        <div style="margin-top:6px"><b>Poder de origem:</b> ${o.poder || '—'}</div>
      </div>
    </details>
  `).join('');
  return `
    <div class="tut-text">
      <p>O que seu personagem fazia antes de se envolver com o paranormal? A origem concede duas perícias e um poder.</p>
    </div>
    <input type="text" class="origem-search" id="origem-search" placeholder="Buscar origem..." />
    <div id="origem-lista">${itens || '<p>Nenhuma origem encontrada (verifique data.js).</p>'}</div>
    ${navBotoes(true)}
  `;
}

function passoClasse(){
  const nomes = { combatente:'Combatente', especialista:'Especialista', ocultista:'Ocultista' };
  const cards = Object.keys(nomes).map(id => `
    <div class="classe-card${novoAgente.classe===id?' selected':''}">
      <h3>${nomes[id]}</h3>
      <div class="cls-desc"><p>${CLASSE_DESCRICAO[id]}</p></div>
      <button type="button" class="btn-escolher" data-classe="${id}">${novoAgente.classe===id?'Selecionada':'Escolher'}</button>
    </div>
  `).join('');
  return `
    <div class="tut-text">
      <p>Sua classe indica o treinamento na Ordem. Ou comece como <button type="button" class="btn-primary" id="btn-mundano" style="margin-left:8px;vertical-align:middle">Mundano</button>.</p>
    </div>
    <div class="classe-grid">${cards}</div>
    ${navBotoes(true)}
  `;
}

function passoFinais(){
  const origNome = (origensDisponiveis()[novoAgente.origem]||{}).nome || 'não escolhida';
  const clsNome = CLASSE_LABEL[novoAgente.classe] || (novoAgente.classe === 'mundano' ? 'Mundano' : 'não escolhida');
  return `
    <div class="tut-text">
      <p>Dê um nome ao seu agente. O resto da ficha você preenche depois.</p>
    </div>
    <div class="finais-grid">
      <div>
        <label>Nome do agente</label>
        <input type="text" id="input-nome" value="${novoAgente.nome || ''}" placeholder="Ex: Helena Duarte" />
      </div>
      <div>
        <label>Nome do jogador</label>
        <input type="text" id="input-jogador" value="${novoAgente.jogador || ''}" placeholder="Seu nome" />
      </div>
    </div>
    <div class="resumo-box">
      <b>Resumo:</b> ${novoAgente.nome || 'Sem nome'} · ${(TIPOS_FICHA[novoAgente.tipoFicha]||TIPOS_FICHA.ordem).nome} · Origem: ${origNome} · Classe: ${clsNome}
    </div>
    ${navBotoes(true, true)}
  `;
}

function navBotoes(mostrarVoltar, finalizar){
  return `
    <div class="wizard-nav">
      <div>${mostrarVoltar ? '<button type="button" class="btn-ghost" id="btn-voltar">Voltar</button>' : ''}</div>
      <button type="button" class="btn-primary" id="btn-avancar">${finalizar ? 'Criar Ficha' : 'Continuar'}</button>
    </div>
  `;
}

function ligarEventosPasso(){
  document.querySelectorAll('.tipo-ficha-card').forEach(btn => {
    btn.addEventListener('click', () => {
      novoAgente.tipoFicha = btn.dataset.tipo || 'ordem';
      renderWizard();
    });
  });
  const avancarTipo = document.getElementById('btn-avancar-tipo');
  if (avancarTipo) avancarTipo.addEventListener('click', () => {
    if (!novoAgente.tipoFicha) novoAgente.tipoFicha = 'ordem';
    stepAtual = 0;
    renderWizard();
  });
  const voltar = document.getElementById('btn-voltar');
  if (voltar) voltar.addEventListener('click', () => {
    stepAtual--;
    renderWizard();
  });
  const avancar = document.getElementById('btn-avancar');
  if (avancar) avancar.addEventListener('click', () => {
    if (stepAtual === 2 && !novoAgente.classe) {
      if (!confirm('Nenhuma classe selecionada — continuar como Mundano?')) return;
    }
    if (stepAtual === 3) { criarAgente(); return; }
    stepAtual++;
    renderWizard();
  });
  document.querySelectorAll('#origem-lista .btn-escolher').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    novoAgente.origem = btn.dataset.id;
    renderWizard();
  }));
  const buscaOrigem = document.getElementById('origem-search');
  if (buscaOrigem) buscaOrigem.addEventListener('input', () => {
    const termo = buscaOrigem.value.toLowerCase();
    document.querySelectorAll('#origem-lista .origem-item').forEach(el => {
      const nome = (el.querySelector('summary span')||{}).textContent || '';
      el.style.display = nome.toLowerCase().includes(termo) ? '' : 'none';
    });
  });
  document.querySelectorAll('.classe-card .btn-escolher').forEach(btn => btn.addEventListener('click', () => {
    novoAgente.classe = btn.dataset.classe;
    renderWizard();
  }));
  const btnMundano = document.getElementById('btn-mundano');
  if (btnMundano) btnMundano.addEventListener('click', () => {
    novoAgente.classe = 'mundano';
    stepAtual++;
    renderWizard();
  });
  const inputNome = document.getElementById('input-nome');
  if (inputNome) inputNome.addEventListener('input', () => { novoAgente.nome = inputNome.value; });
  const inputJogador = document.getElementById('input-jogador');
  if (inputJogador) inputJogador.addEventListener('input', () => { novoAgente.jogador = inputJogador.value; });
}

function criarAgente(){
  const id = 'ag_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const classeValida = (novoAgente.classe && novoAgente.classe !== 'mundano') ? novoAgente.classe : 'ocultista';
  const origemValida = novoAgente.origem || 'investigador';
  const tipoFicha = (novoAgente.tipoFicha && TIPOS_FICHA[novoAgente.tipoFicha]) ? novoAgente.tipoFicha : 'ordem';
  const ficha = {
    nome: novoAgente.nome || '', jogador: novoAgente.jogador || '',
    origem: origemValida, classe: classeValida, nex: 5, patente: 'Recruta',
    tipoFicha: tipoFicha,
    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
    vidaAtual: null, sanAtual: null, peAtual: null,
    aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
    habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
    itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
    _mundano: novoAgente.classe === 'mundano' || false,
    mascaraAtiva: false,
  };
  localStorage.setItem('escandinavo-ficha-' + id, JSON.stringify(ficha));
  const registro = lerAgentes();
  registro.push({
    id,
    nome: ficha.nome || 'Sem nome',
    classe: novoAgente.classe || classeValida,
    origem: origemValida,
    nex: 5,
    tipoFicha: tipoFicha,
    atualizadoEm: Date.now()
  });
  salvarAgentes(registro);
  window.location.href = 'ficha.html?id=' + encodeURIComponent(id);
}

try { renderAgentes(); } catch (e) { console.error('[wizard] renderAgentes', e); }
