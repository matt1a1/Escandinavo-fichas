/* arquivos-secretos-hellhunters.js — AS#09 Hellhunters */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Treinado pela Hell Hunters","tipo":"origem","livro":"Hellhunters","desc":"Perícias: escolha (Luta e Fortitude) ou (Pontaria e Reflexos). Poder Resistência do Treinamento: se Luta+Fortitude, +2 PV no NEX 5% e +1 PV a cada 10% de NEX; se Pontaria+Reflexos, +1 PE no NEX 5% e +1 PE a cada 10% de NEX."},{"nome":"Veterano de Conflito Armado","tipo":"origem","livro":"Hellhunters","desc":"Perícias: Luta, Pontaria. Poder Full Metal Jacket: ao fazer teste de Luta ou Pontaria com alguma penalidade, gasta 2 PE para ignorar essa penalidade no teste."},{"nome":"Tática — Analisar Perigo","tipo":"regra","livro":"Hellhunters","desc":"Treinado, DT 15. Ação de movimento para analisar perigo específico; até o fim do próximo turno, +2 em testes e Defesa relacionados (+1 a cada 5 acima da DT). Só 1x por cena."},{"nome":"Municiador Ambulante","tipo":"poder","livro":"Hellhunters","classe":"Combatente","desc":"Pré-req Int 2. Nova ação de interlúdio municiar: prepara pacotes de munição equivalentes a 1d6 por ponto de Intelecto, sem ocupar espaço de carga."},{"nome":"Ripostar Ousado","tipo":"poder","livro":"Hellhunters","classe":"Combatente","desc":"Pré-req Agi 2, treinado em Luta. Ao ser alvo de ataque corpo a corpo, antes de saber se foi atingido, gasta 2 PE para reação de defesa com contra-ataque: +5 Defesa e, se o atacante errar, +5 no teste do contra-ataque."},{"nome":"Tática de Abordagem","tipo":"poder","livro":"Hellhunters","desc":"Pré-req Int 1, veterano em Tática. Interlúdio tática de abordagem: plano vs ameaça; Tática DT 10 gera 1d6 de tática (+1 dado/5 acima). Gastos como reação: +1d6 teste, dano ou cura. 1x/cena."},{"nome":"Tiro Intuitivo","tipo":"poder","livro":"Hellhunters","desc":"Pré-req veterano em Pontaria. Ao mirar, gasta 2 PE para +2 na margem de ameaça do ataque à distância."},{"nome":"CQB","tipo":"trilha","livro":"Hellhunters","classe":"Combatente","trilha":"Incursor","nex":"10%","desc":"Treino em Pontaria (ou Luta se já treinado; se ambas, +2 nas duas); 1 PE anula –5 em Pontaria contra alvo engajado em corpo a corpo."},{"nome":"Entrada Explosiva","tipo":"trilha","livro":"Hellhunters","classe":"Combatente","trilha":"Incursor","nex":"40%","desc":"+5 em testes para implantar/usar explosivos; 1 PE para implantar mina/carga com ação de movimento."},{"nome":"Proteger Reféns","tipo":"trilha","livro":"Hellhunters","classe":"Combatente","trilha":"Incursor","nex":"65%","desc":"A até 3m de refém: se ele for alvo de efeito negativo, 2 PE como reação para virar o alvo (+2 PE metade do dano). Até 3 reféns."},{"nome":"Alvo-prioritário","tipo":"trilha","livro":"Hellhunters","classe":"Combatente","trilha":"Incursor","nex":"99%","desc":"Mestre revela VD na linha de visão; 5 PE marca alvo-prioritário: VD≤200 dano zera PV; VD≥201 +5 margem de ameaça."},{"nome":"Companheiro Drone","tipo":"trilha","livro":"Hellhunters","classe":"Especialista","trilha":"Piloto de Drone","nex":"10%","desc":"Ganha Drone de Combate Tático como aliado (tipo à escolha). Consertar: 1 interlúdio com peças, ou 2 para adquirir novo."},{"nome":"Protetor dos Drones","tipo":"trilha","livro":"Hellhunters","classe":"Especialista","trilha":"Piloto de Drone","nex":"40%","desc":"1 modificação no drone sem contar no limite; 3 PE evita efeito negativo no drone."},{"nome":"Ás dos Drones","tipo":"trilha","livro":"Hellhunters","classe":"Especialista","trilha":"Piloto de Drone","nex":"65%","desc":"2 modificações (total 3) sem limite; ao falhar teste com drone, 3 PE para tentar de novo (1x)."},{"nome":"Mestre dos Drones","tipo":"trilha","livro":"Hellhunters","classe":"Especialista","trilha":"Piloto de Drone","nex":"99%","desc":"3 modificações (total 6) sem limite — ou segundo drone com 3 mods; evitar efeito negativo custa 1 PE."},{"nome":"Central de Drones","tipo":"regra","livro":"Hellhunters","desc":"Regalia de veículo: ocupantes +5 em Tecnologia para drones; 1x/rodada guardar/pegar drone é ação livre."},{"nome":"Estação de Armas","tipo":"regra","livro":"Hellhunters","desc":"Regalia de veículo: instala arma 2 mãos; passageiro opera com Pontaria sem penalidade de veículo em movimento."},{"nome":"Lançadores de Fumaça","tipo":"regra","livro":"Hellhunters","desc":"Regalia de veículo: 1x/cena, ação de movimento cria nuvem de fumaça ao redor (efeito granada de fumaça)."},{"nome":"Sistema de Drone de Combate Tático","tipo":"regra","livro":"Hellhunters","desc":"Aliado drone: opera com 2 mãos; desloca 6m (12m voando), até 5km do controle. Tipos: Atirador, Espião, Hacker, Inteligente, Médico, Protetor, Utilitário. Mods dão tipo extra e sobem categoria (até IV)."},{"nome":"Aríete Portátil","tipo":"item","livro":"Hellhunters","categoria":"I","espacos":"2","desc":"Operacional. 2 mãos; +10 em testes para arrombar."},{"nome":"Boroscópio Articulado","tipo":"item","livro":"Hellhunters","categoria":"I","espacos":"1","desc":"Operacional. 2 mãos; câmera cabo 3m, visão no escuro; Investigação/Percepção sem entrar no ambiente."},{"nome":"Capacete Tático","tipo":"item","livro":"Hellhunters","categoria":"II","espacos":"1","desc":"Proteção pesada. 25% (1 em 1d4) de ignorar dano adicional de crítico ou Ataque Furtivo."},{"nome":"Designated Marksman Rifle (DMR)","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"3","desc":"Arma tática 2 mãos, médio; 2d10 balístico, 19/x3; libera Ataque Furtivo até médio; veterano mirando +5 margem; balas longas."},{"nome":"Drone de Combate Tático","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Operacional 2 mãos; aliado drone (tipos AS#09); inclui câmera filmadora. Escolha o tipo: Atirador, Espião, Hacker, Inteligente, Médico, Protetor ou Utilitário."},{"nome":"Drone Atirador","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: +1d20 em testes de ataque. Habilidade Metralhar Tudo: 2 PE, se acertar o ataque causa +2d8 balístico. Opera com 2 mãos (bônus passivo sempre); desloca 6m (12m voando); até 5km do controle."},{"nome":"Drone Espião","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: +1d20 em Investigação/Percepção onde o drone ajude; câmera com visão no escuro. Habilidade Captação Térmica e de Áudio: 2 PE até o fim da cena — visão térmica (ignora camuflagem) e testes de Tecnologia para captar ondas de rádio."},{"nome":"Drone Hacker","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: +1d20 em Tecnologia onde o drone ajude; pode hackear à distância segura. Habilidade Acelerar e Ocultar: ao hackear como ação completa, 2 PE evita a penalidade; se falhar, pode tentar de novo (1x); falhar por 5+ permite gastar 3 PE para evitar ser rastreado."},{"nome":"Drone Inteligente","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: funciona por comando de voz, não precisa das mãos. Habilidade Braços Articulados: 2 PE até o fim da cena — ativa braços que carregam até 5 espaços de itens e fazem trabalhos manuais simples."},{"nome":"Drone Médico","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: conta como treinado em Medicina (ou +1d20 se já for treinado). Habilidade Robô ao Resgate: 2 PE cura 2d8+2 PV de um alvo adjacente ao drone."},{"nome":"Drone Protetor","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: +5 na Defesa. Habilidade Alerta de Ameaça: 2 PE num teste de resistência dá +5 nesse teste."},{"nome":"Drone Utilitário","tipo":"item","livro":"Hellhunters","categoria":"III","espacos":"2","desc":"Tipo de Drone de Combate Tático. Bônus passivo: escolhe 1 perícia (exceto Fortitude/Luta/Pontaria/Reflexos/Vontade, fixa depois): +1d20 nela. Habilidade Meu Amigo Drone: ao falhar num teste dessa perícia, 3 PE para tentar de novo (1x)."},{"nome":"Escudo Balístico LED","tipo":"item","livro":"Hellhunters","categoria":"II","espacos":"2","desc":"Proteção pesada 1 mão; +2 Defesa, RD balístico 10; cobertura leve; lanterna 9m; ofusca 1 alvo curto 1 rodada."},{"nome":"Espingarda Serrada","tipo":"item","livro":"Hellhunters","categoria":"I","espacos":"1","desc":"Arma tática 1 mão, curto; 3d6 balístico 20/x3; metade do dano em médio+; cartuchos."},{"nome":"Lançador de Granadas Portátil","tipo":"item","livro":"Hellhunters","categoria":"II","espacos":"1","desc":"Versão compacta do Lançador de Granadas; carrega 1 granada 40mm."},{"nome":"Machado Tático","tipo":"item","livro":"Hellhunters","categoria":"II","espacos":"1","desc":"Corpo a corpo tática 1 mão ágil arremessável curto; 1d8 corte 20/x3; +2 em contra-ataque; em bloqueio 2 PE + sacrificar = +20 RD."},{"nome":"Pistola Taser","tipo":"item","livro":"Hellhunters","categoria":"II","espacos":"1","desc":"Disparo 1 mão curto; 2d6 eletricidade 20/x3; atordoa 1 rodada (Fort DT Agi); 1x/cena por alvo; dardos condutores."},{"nome":"Dardos Condutores","tipo":"item","livro":"Hellhunters","categoria":"I","espacos":"1","desc":"Munição da Pistola Taser; pacote 20 ataques; capacidade 10 dardos por carregamento."},{"nome":"Modificações para Drones","tipo":"regra","livro":"Hellhunters","desc":"Cada modificação dá ao drone um segundo (ou mais) tipo de aliado drone, acumulando bônus e habilidades; cada modificação sobe a categoria do drone em I (até IV); efeitos semelhantes não se acumulam entre si."}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;

  if (typeof ORIGENS !== 'undefined') {
    if (!ORIGENS.treinado_hell_hunters) {
      ORIGENS.treinado_hell_hunters = {
        nome: 'Treinado pela Hell Hunters',
        pericias: ['luta', 'fortitude'],
        poder: 'Resistência do Treinamento'
      };
    }
    if (!ORIGENS.veterano_conflito_armado) {
      ORIGENS.veterano_conflito_armado = {
        nome: 'Veterano de Conflito Armado',
        pericias: ['luta', 'pontaria'],
        poder: 'Full Metal Jacket'
      };
    }
  }

  if (typeof HABILIDADES_CATALOG !== 'undefined') {
    if (typeof HABILIDADES_CATEGORIAS === 'undefined') root.HABILIDADES_CATEGORIAS = {};
    DATA.forEach(function (e) {
      if (e.tipo !== 'trilha' && e.tipo !== 'poder') return;
      var cls = e.classe || '';
      if (/combatente/i.test(cls)) cls = 'Combatente';
      else if (/especialista/i.test(cls)) cls = 'Especialista';
      else if (/ocultista/i.test(cls)) cls = 'Ocultista';
      else cls = 'Poderes Paranormais';
      var cat;
      if (e.tipo === 'trilha') cat = e.trilha || e.nome;
      else if (cls === 'Combatente') cat = 'Poderes de Combatente';
      else if (cls === 'Especialista') cat = 'Poderes de Especialista';
      else if (cls === 'Ocultista') cat = 'Poderes de Ocultista';
      else cat = 'Varia';
      if (!HABILIDADES_CATEGORIAS[cls]) HABILIDADES_CATEGORIAS[cls] = [];
      if (HABILIDADES_CATEGORIAS[cls].indexOf(cat) === -1) HABILIDADES_CATEGORIAS[cls].push(cat);
      if (HABILIDADES_CATALOG.some(function (h) { return h.classe === cls && h.nome === e.nome; })) return;
      HABILIDADES_CATALOG.push({
        nome: e.nome, classe: cls, categoria: cat, nex: e.nex || '', pe: '',
        desc: '[Arquivos Secretos — Hellhunters] ' + (e.desc || '')
      });
    });
    if (typeof root.refreshHabilidadesCatalog === 'function') try { root.refreshHabilidadesCatalog(); } catch (err) {}
  }

  if (typeof ITENS_CATALOG !== 'undefined') {
    DATA.forEach(function (e) {
      if (e.tipo !== 'item') return;
      if (ITENS_CATALOG.some(function (i) { return (i.nome || '').toLowerCase() === (e.nome || '').toLowerCase(); })) return;
      ITENS_CATALOG.push({
        nome: e.nome, tipo: 'paranormal', categoria: e.categoria || 'I',
        espacos: e.espacos || '1',
        desc: '[Arquivos Secretos — Hellhunters] ' + (e.desc || ''),
        livro: 'Hellhunters'
      });
    });
  }

  try {
    document.dispatchEvent(new CustomEvent('arquivos-secretos-ready', { detail: { total: AS.length, source: 'hellhunters' } }));
  } catch (err) {}
})();
