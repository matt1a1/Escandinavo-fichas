// Poderes de Origem — alinhados ao Livro Básico (26 origens)
(function () {
  if (typeof HABILIDADES_CATALOG === 'undefined') {
    window.HABILIDADES_CATALOG = [];
  }
  if (typeof HABILIDADES_CATEGORIAS === 'undefined') {
    window.HABILIDADES_CATEGORIAS = {};
  }
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
      desc: 'Um item à escolha (exceto armas) conta como uma categoria abaixo para você.' },
    { nome: 'Processo Otimizado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Num teste estendido, ou numa ação de revisar documentos (físicos ou digitais), gasta 2 PE para +5 nesse teste.' },
    { nome: 'Faro para Pistas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: '1x por cena, ao testar para procurar pistas, gasta 1 PE para +5.' },
    { nome: 'Mão Pesada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+2 em rolagens de dano com ataques corpo a corpo.' },
    { nome: 'Patrocinador da Ordem', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seu limite de crédito é sempre considerado um nível acima do atual.' },
    { nome: 'Posição de Combate', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'No primeiro turno de uma cena de ação, gasta 2 PE para uma ação de movimento adicional.' },
    { nome: 'Para Bellum', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+2 em rolagens de dano com armas de fogo.' },
    { nome: 'Ferramenta de Trabalho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe uma arma simples ou tática coerente com sua profissão (ex: marreta para um pedreiro): passa a saber usá-la e ganha +1 em ataque, dano e margem de ameaça com ela.' },
    { nome: 'Patrulha', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+2 na Defesa.' },
    { nome: 'Acalentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+5 em Religião para acalmar; ao acalmar alguém, essa pessoa recebe 1d6 + sua Presença em SAN.' },
    { nome: 'Espírito Cívico', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: 'Ao testar para ajudar, gasta 1 PE para aumentar o bônus concedido em +2.' },
    { nome: 'Eu Já Sabia', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Resistência a dano mental igual ao seu Intelecto.' },
    { nome: 'Desbravador', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em teste de Adestramento ou Sobrevivência, gasta 2 PE para +5; além disso, não sofre penalidade de deslocamento por terreno difícil.' },
    { nome: 'Motor de Busca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Com acesso à internet, a critério do mestre, gasta 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.' },
    { nome: 'Impostor', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: '1x por cena, gasta 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.' },
    { nome: 'Dedicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...); seu limite de PE por turno também sobe em 1 (não afeta a DT dos seus efeitos).' },
    { nome: 'Cicatrizes Psicológicas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+1 de Sanidade para cada 5% de NEX.' }
  ];

  poderes.forEach(function (p) {
    var exists = HABILIDADES_CATALOG.some(function (h) {
      return h.classe === 'Origens' && h.nome === p.nome;
    });
    if (!exists) HABILIDADES_CATALOG.push(p);
  });
})();
