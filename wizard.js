
const REGISTRO_KEY = 'escandinavo-agentes-registro';
const CAMPANHAS_KEY = 'escandinavo-campanhas-registro';

function lerAgentes(){ try{ return JSON.parse(localStorage.getItem(REGISTRO_KEY)) || []; }catch(e){ return []; } }
function salvarAgentes(lista){ localStorage.setItem(REGISTRO_KEY, JSON.stringify(lista)); }
function lerCampanhas(){ try{ return JSON.parse(localStorage.getItem(CAMPANHAS_KEY)) || []; }catch(e){ return []; } }
function salvarCampanhas(lista){ localStorage.setItem(CAMPANHAS_KEY, JSON.stringify(lista)); }

const CLASSE_LABEL = { combatente:'Combatente', especialista:'Especialista', ocultista:'Ocultista', mundano:'Mundano' };

function formatarData(ts){
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR');
}

function renderAgentes(){
  const grid = document.getElementById('ag-grid');
  const termo = (document.getElementById('ag-search').value || '').toLowerCase();
  let lista = lerAgentes().sort((a,b)=> b.atualizadoEm - a.atualizadoEm);
  if (termo) lista = lista.filter(a => (a.nome||'').toLowerCase().includes(termo));
  document.getElementById('ag-count').textContent = lerAgentes().length;
  grid.innerHTML = '';
  if (!lista.length){
    grid.innerHTML = '<div class="ag-empty">Nenhum agente ainda. Clique em "Novo Agente" para criar sua primeira ficha.</div>';
    return;
  }
  lista.forEach(a => {
    const card = document.createElement('div');
    card.className = 'ag-card';
    card.innerHTML = `
      <button class="del" title="Excluir" data-id="${a.id}">✕</button>
      <div class="avatar">◈</div>
      <h3>${a.nome || 'Sem nome'}</h3>
      <div class="meta">${CLASSE_LABEL[a.classe] || a.classe || '—'} · NEX ${a.nex ?? 5}% · atualizado em ${formatarData(a.atualizadoEm)}</div>
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
document.getElementById('ag-search').addEventListener('input', renderAgentes);

function renderCampanhas(){
  const grid = document.getElementById('camp-grid');
  const lista = lerCampanhas().sort((a,b)=> b.criadaEm - a.criadaEm);
  document.getElementById('camp-count').textContent = lista.length;
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

document.getElementById('btn-nova-campanha').addEventListener('click', () => {
  const nome = prompt('Nome da campanha:');
  if (!nome || !nome.trim()) return;
  const lista = lerCampanhas();
  lista.push({ id: 'camp_' + Date.now().toString(36), nome: nome.trim(), jogadores: 0, criadaEm: Date.now() });
  salvarCampanhas(lista);
  renderCampanhas();
});

document.querySelectorAll('.ag-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.ag-nav a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
  const view = link.dataset.view;
  document.getElementById('view-agentes').hidden = view !== 'agentes';
  document.getElementById('view-campanhas').hidden = view !== 'campanhas';
  if (view === 'campanhas') renderCampanhas();
}));

const STEPS = ['Atributos', 'Origem', 'Classe', 'Toques Finais'];
let stepAtual = 0;
let novoAgente = { nome:'', jogador:'', origem:'', classe:'' };

function abrirWizard(){
  stepAtual = 0;
  novoAgente = { nome:'', jogador:'', origem:'', classe:'' };
  document.getElementById('wizard').hidden = false;
  renderWizard();
}
function fecharWizard(){ document.getElementById('wizard').hidden = true; }
document.getElementById('btn-novo-agente').addEventListener('click', abrirWizard);
document.getElementById('wizard-close').addEventListener('click', () => {
  if (confirm('Cancelar a criação deste agente?')) fecharWizard();
});

function renderStepsBar(){
  const bar = document.getElementById('wizard-steps');
  bar.innerHTML = STEPS.map((s,i) =>
    `<span class="step${i===stepAtual?' active':''}">${s}</span>` + (i<STEPS.length-1 ? '<span class="sep">──────</span>' : '')
  ).join('');
}

function origensDisponiveis(){
  return (typeof ORIGENS !== 'undefined') ? ORIGENS : {};
}

const CLASSE_DESCRICAO = {
  combatente: `Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente. É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.\n\nDo mercenário especialista em armas de fogo até o perito em espadas, combatentes apresentam uma gama enorme de habilidades e técnicas especiais que aprimoram sua eficiência no campo de batalha, tornando-os membros essenciais em qualquer missão de extermínio.\n\nAlém de treinar seu corpo, o combatente também é perito em liderar seus aliados em batalha e cuidar de seu equipamento de combate, sempre preparado para assumir a linha de frente quando a coisa fica feia.`,
  especialista: `Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.\n\nCientistas, inventores, pesquisadores e técnicos de vários tipos são exemplos de especialistas, que são tão variados quanto as áreas do conhecimento e da tecnologia. Alguns ainda preferem estudar engenharia social e se tornam excelentes espiões infiltrados, ou mesmo estudam técnicas especiais de combate como artes marciais e tiro a distância, aliando conhecimento técnico e habilidade.\n\nO que une todos os especialistas é sua incrível capacidade de aprender e improvisar.`,
  ocultista: `O Outro Lado é misterioso, perigoso e, de certa forma, cativante. Muitos estudiosos das entidades se perdem em seus reinos obscuros em busca de poder, mas existem aqueles que visam compreender e dominar os mistérios paranormais para usá-los para combater o próprio Outro Lado. Esse tipo de agente não é apenas um conhecedor do oculto, como também possui talento para se conectar com elementos paranormais.\n\nAo contrário da crendice popular, ocultistas não são intrinsecamente malignos. Seria como dizer que o cientista que inventou a pólvora é culpado pelo assassino que disparou o revólver. Para a Ordem, o Paranormal é uma força que pode ser usada para os mais diversos propósitos, de acordo com a intenção de seu usuário.`,
};

function renderWizard(){
  renderStepsBar();
  const body = document.getElementById('wizard-body');
  if (stepAtual === 0) body.innerHTML = passoAtributos();
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
        <p>Quando você cria um personagem, todos os seus atributos começam em <b>1</b> e você recebe <b>4 pontos</b> para distribuir entre eles como quiser. Você também pode reduzir um atributo para <b>0</b> para receber <b>1 ponto</b> adicional. O valor máximo inicial que você pode ter em cada atributo é <b>3</b>.</p>
        <p style="margin-top:14px;font-size:.88rem;opacity:.85;">Você vai distribuir os pontos de verdade na ficha, depois de criar o agente. Aqui é só para entender a regra.</p>
      </div>
      <div class="attr-pentagon" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <polygon points="100,18 180,75 150,170 50,170 20,75" fill="none" stroke="#e8e8f0" stroke-width="1.5" opacity="0.5"/>
          <line x1="100" y1="100" x2="100" y2="18" stroke="#e8e8f0" stroke-width="1" opacity="0.35"/>
          <line x1="100" y1="100" x2="180" y2="75" stroke="#e8e8f0" stroke-width="1" opacity="0.35"/>
          <line x1="100" y1="100" x2="150" y2="170" stroke="#e8e8f0" stroke-width="1" opacity="0.35"/>
          <line x1="100" y1="100" x2="50" y2="170" stroke="#e8e8f0" stroke-width="1" opacity="0.35"/>
          <line x1="100" y1="100" x2="20" y2="75" stroke="#e8e8f0" stroke-width="1" opacity="0.35"/>
          <circle cx="100" cy="100" r="28" fill="#0a0a0e" stroke="#e8e8f0" stroke-width="1.5"/>
          <text x="100" y="104" text-anchor="middle" fill="#e8e8f0" font-size="9" font-family="sans-serif" letter-spacing="1">ATRIBUTOS</text>
        </svg>
        <div class="attr-node" style="left:50%;top:9%"><b>1</b><small>AGILIDADE<br>AGI</small></div>
        <div class="attr-node" style="left:90%;top:38%"><b>1</b><small>INTELECTO<br>INT</small></div>
        <div class="attr-node" style="left:75%;top:85%"><b>1</b><small>VIGOR<br>VIG</small></div>
        <div class="attr-node" style="left:25%;top:85%"><b>1</b><small>PRESENÇA<br>PRE</small></div>
        <div class="attr-node" style="left:10%;top:38%"><b>1</b><small>FORÇA<br>FOR</small></div>
      </div>
    </div>
    ${navBotoes(false)}
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
      <p>O que seu personagem fazia antes de se envolver com o paranormal e ingressar na Ordem da Realidade? A origem representa como a vida pregressa influencia sua carreira de investigador. Escolha uma origem que se encaixe com o conceito de seu personagem ou escolha uma aleatoriamente.</p>
      <p class="tut-highlight" style="margin-top:12px">Ao escolher uma origem, você recebe duas perícias treinadas e um poder da origem.</p>
      <p style="margin-top:10px">Cada origem apresentada a seguir é intencionalmente vaga, apenas uma ideia por onde começar. Você pode usá-la como está, para jogar rapidamente, ou colorir com quantos detalhes quiser, conforme o conceito de seu agente.</p>
      <p style="margin-top:10px;font-size:.88rem">Perícias concedidas serão adicionadas automaticamente. Perícias opcionais podem ser adicionadas ao agente após sua criação.</p>
    </div>
    <div class="origem-banner">
      <span>📜</span>
      <span>Conteúdo oficial de Ordem Paranormal. As origens vêm do livro de regras.</span>
    </div>
    <input type="text" class="origem-search" id="origem-search" placeholder="Buscar origem..." />
    <div id="origem-lista">${itens || '<p>Nenhuma origem encontrada (verifique se data.js está na mesma pasta).</p>'}</div>
    ${navBotoes(true)}
  `;
}

function passoClasse(){
  const nomes = { combatente:'Combatente', especialista:'Especialista', ocultista:'Ocultista' };
  const cards = Object.keys(nomes).map(id => `
    <div class="classe-card${novoAgente.classe===id?' selected':''}">
      <h3>${nomes[id]}</h3>
      <div class="cls-desc">${CLASSE_DESCRICAO[id].replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>')}</div>
      <button type="button" class="btn-escolher" data-classe="${id}">${novoAgente.classe===id?'Selecionada':'Escolher'}</button>
    </div>
  `).join('');
  return `
    <div class="tut-text">
      <p>Sua classe indica o treinamento que você recebeu na Ordem para enfrentar os perigos do Outro Lado. Em termos de jogo, é a sua característica mais importante, pois define o que você faz e qual é o seu papel no grupo de investigadores.</p>
      <p style="margin-top:10px;font-size:.88rem">Perícias concedidas serão adicionadas automaticamente. Perícias opcionais podem ser adicionadas ao agente após sua criação.</p>
      <p style="margin-top:12px">Como uma alternativa, você pode não escolher uma classe e começar como uma pessoa comum.
        <button type="button" class="btn-primary" id="btn-mundano" style="margin-left:8px;vertical-align:middle">Mundano</button>
      </p>
    </div>
    <div class="classe-grid">${cards}</div>
    ${navBotoes(true)}
  `;
}

function passoFinais(){
  const origNome = origensDisponiveis()[novoAgente.origem]?.nome || 'não escolhida';
  const clsNome = CLASSE_LABEL[novoAgente.classe] || (novoAgente.classe === 'mundano' ? 'Mundano' : 'não escolhida');
  return `
    <div class="tut-text">
      <p>Só falta dar um nome ao seu agente. Você poderá preencher aparência, personalidade, histórico e o resto da ficha depois — sem pressa.</p>
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
      <b>Resumo:</b> ${novoAgente.nome || 'Sem nome'} · Origem: ${origNome} · Classe: ${clsNome}
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
  const voltar = document.getElementById('btn-voltar');
  if (voltar) voltar.addEventListener('click', () => { stepAtual--; renderWizard(); });
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
      const nome = el.querySelector('summary span').textContent.toLowerCase();
      el.style.display = nome.includes(termo) ? '' : 'none';
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
  const ficha = {
    nome: novoAgente.nome || '', jogador: novoAgente.jogador || '',
    origem: origemValida, classe: classeValida, nex: 5, patente: 'Recruta',
    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {},
    vidaAtual: null, sanAtual: null, peAtual: null,
    aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
    habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
    itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
    _mundano: novoAgente.classe === 'mundano' || false,
  };
  localStorage.setItem('escandinavo-ficha-' + id, JSON.stringify(ficha));
  const registro = lerAgentes();
  registro.push({ id, nome: ficha.nome || 'Sem nome', classe: novoAgente.classe || classeValida, origem: origemValida, nex: 5, atualizadoEm: Date.now() });
  salvarAgentes(registro);
  window.location.href = 'ficha.html?id=' + encodeURIComponent(id);
}

renderAgentes();
