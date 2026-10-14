// Poderes de Origem — alinhados ao Livro Básico (26 origens) + Arquivos Secretos
// Garante categoria "Origens" no catálogo de Habilidades e força re-render.
(function () {
  if (typeof HABILIDADES_CATALOG === 'undefined') {
    window.HABILIDADES_CATALOG = [];
  }
  if (typeof HABILIDADES_CATEGORIAS === 'undefined') {
    window.HABILIDADES_CATEGORIAS = {};
  }
  // Sempre força a categoria (outros scripts podem sobrescrever o objeto)
  HABILIDADES_CATEGORIAS['Origens'] = ['Poder de Origem'];

  var poderes = [
    { nome: 'Saber é Poder', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste usando Intelecto, gasta 2 PE para +5 nesse teste.' },
    { nome: 'Técnica Medicinal', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Ao curar alguém, soma seu Intelecto ao total de PV curados.' },
    { nome: 'Vislumbres do Passado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por sessão, teste de Intelecto (DT 10) para reconhecer pessoas/lugares de antes da amnésia; sucesso dá 1d4 PE temporários e, a critério do mestre, uma informação útil.' },
    { nome: 'Magnum Opus', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por missão, determina que alguém numa cena de interação o reconhece por uma obra famosa: +5 em Presença e perícias baseadas em Presença contra essa pessoa (o mestre pode estender a outras situações de reconhecimento).' },
    { nome: '110%', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria), gasta 2 PE para +5.' },
    { nome: 'Ingrediente Secreto', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em cena de interlúdio, ao fazer a ação "alimentar-se" para cozinhar algo especial, você e todos que também se alimentarem recebem o benefício de dois pratos (se escolherem o mesmo benefício duas vezes, os efeitos se acumulam).' },
    { nome: 'O Crime Compensa', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'No fim de uma missão, escolhe um item encontrado nela; na próxima missão, pode incluí-lo no inventário sem contar no limite de itens por patente.' },
    { nome: 'Traços do Outro Lado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Ganha um poder paranormal à escolha, mas começa o jogo com metade da Sanidade normal da sua classe.' },
    { nome: 'Calejado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+1 PV para cada 5% de NEX.' },
    { nome: 'Ferramenta Favorita', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe um item de categoria 0 que seja uma ferramenta. Em testes de perícia com essa ferramenta, você pode gastar 1 PE para rolar novamente um dos dados.' },
    { nome: 'Processo Otimizado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de perícia usando Intelecto (exceto Ocultismo), gasta 2 PE para +5.' },
    { nome: 'Faro para Pistas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por cena, ao fazer um teste de Investigação ou Percepção, pode rolar dois dados e usar o melhor.' },
    { nome: 'Mão Pesada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seus ataques desarmados causam 1d6 de dano e você pode gastar 1 PE para fazer um ataque desarmado como ação livre após um ataque corpo a corpo.' },
    { nome: 'Patrocinador da Ordem', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe um item de categoria II no início de cada missão (escolhido pelo mestre, relacionado à missão).' },
    { nome: 'Posição de Combate', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'No início do seu turno, gasta 2 PE para receber +2 na Defesa e +5 em testes de resistência até o início do próximo turno.' },
    { nome: 'Para Bellum', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você sempre tem um arsenal: no início de cada missão, recebe uma arma de fogo leve ou uma arma corpo a corpo simples (categoria 0 ou I) sem contar no limite de itens.' },
    { nome: 'Ferramenta de Trabalho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe uma perícia de Profissão. Em testes dessa perícia, rola com vantagem (dois dados, usa o melhor).' },
    { nome: 'Patrulha', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em cenas de investigação, você e aliados em alcance curto recebem +2 em testes de Percepção.' },
    { nome: 'Acalentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por cena, ação padrão: um aliado em alcance curto recupera 1d6+seu Presença PV ou SAN (escolha dele).' },
    { nome: 'Espírito Cívico', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: 'Gasta 1 PE para conceder +5 em um teste de perícia de um aliado em alcance curto (reação, quando ele faz o teste).' },
    { nome: 'Eu Já Sabia', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por sessão, declara que já sabia de uma informação que o mestre acabou de revelar; recebe 1d4 PE temporários.' },
    { nome: 'Desbravador', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de Sobrevivência ou para se orientar, gasta 2 PE para +5.' },
    { nome: 'Motor de Busca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de Tecnologia ou Investigação envolvendo redes/computadores, gasta 2 PE para +5.' },
    { nome: 'Impostor', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de Enganação ou Crime, gasta 2 PE para +5.' },
    { nome: 'Dedicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe duas perícias treinadas pela origem; em testes delas, pode gastar 1 PE para rolar novamente um dos dados.' },
    { nome: 'Cicatrizes Psicológicas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Quando falha em um teste de Vontade contra medo ou efeito mental, pode gastar 2 PE para ter sucesso; se falhar, +1d20 no próximo teste até o fim da cena.' },
    { nome: 'Registrar o Paranormal', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: '1x por cena, ação padrão + 2 PE: cria um registro (foto/vídeo) de criatura ou ritual da cena. Em interlúdio, gasta o registro para +5 em identificar criatura/presença ou para memorizar o ritual até o próximo interlúdio (não conta no limite).' },
    { nome: 'Quem Não Arrisca, Não Petisca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por cena, ao fazer um teste com alguma penalidade, pode ignorar a penalidade; se falhar, +1d20 no próximo teste até o fim da cena.' },
    { nome: 'Minha Teoria Absurda', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por interlúdio, teoria sobre a investigação: se boa, 1d4+1 PE temp.; se confirmar na missão, +1 PE máximo permanente.' },
    { nome: 'Turno Invertido', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por missão, benefícios de dormir sem dormir; +2 contra efeitos que tentem deixar inconsciente.' },
    { nome: 'Existe uma Explicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de Ocultismo, gasta 2 PE para usar Ciências no lugar.' },
    { nome: 'Forças para Enfrentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Trauma de cobaia: cena que toque nele deixa abalado, mas 2 PE concede imunidade a medo até o fim da cena.' },
    { nome: 'Técnicas de Contenção', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em manobra de combate, gasta 2 PE para +5 no teste.' },
    { nome: 'O Que Restou', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe um elemento (exceto Medo); RD 10 contra ele, mas –3 SAN no 1º contato da cena.' },
    { nome: 'Sussurros e Vultos', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em Diplomacia, Enganação, Intimidação ou Intuição, pode perder 2 SAN para +5 no teste.' },
    { nome: 'Resistência do Treinamento', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Se escolheu Luta+Fortitude: +2 PV no NEX 5% e +1 PV a cada 10% de NEX. Se Pontaria+Reflexos: +1 PE no NEX 5% e +1 PE a cada 10% de NEX.' },
    { nome: 'Full Metal Jacket', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Ao fazer teste de Luta ou Pontaria com alguma penalidade, gasta 2 PE para ignorar essa penalidade no teste.' }
  ];

  // Upsert: garante presença de todos os poderes de origem
  var adicionados = 0;
  poderes.forEach(function (p) {
    var idx = -1;
    for (var i = 0; i < HABILIDADES_CATALOG.length; i++) {
      var h = HABILIDADES_CATALOG[i];
      if (h && h.classe === 'Origens' && h.nome === p.nome) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      HABILIDADES_CATALOG.push(p);
      adicionados++;
    } else {
      // Mantém desc se já foi expandida por outro script (texto oficial longo);
      // só preenche se estiver vazia/curta
      var cur = HABILIDADES_CATALOG[idx];
      if (!cur.desc || cur.desc.length < 20) {
        cur.desc = p.desc;
      }
      cur.categoria = 'Poder de Origem';
      cur.classe = 'Origens';
      if (p.pe) cur.pe = p.pe;
    }
  });

  function doRefresh() {
    try {
      if (typeof window.refreshHabilidadesCatalog === 'function') {
        window.refreshHabilidadesCatalog();
      }
      if (typeof window.__habRenderList === 'function') window.__habRenderList();
      if (typeof window.__habRenderChips === 'function') window.__habRenderChips();
    } catch (e) {}
  }

  doRefresh();
  setTimeout(doRefresh, 400);
  setTimeout(doRefresh, 1200);
  setTimeout(doRefresh, 2500);

  console.log('[origens-poderes] ' + poderes.length + ' poderes (novos: ' + adicionados + ')');
})();
