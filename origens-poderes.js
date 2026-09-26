// Poderes de Origem — preenchidos a partir do livro de regras
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
      desc: 'Uma vez por cena, quando fizer um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.' },
    { nome: 'Técnica Medicinal', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.' },
    { nome: 'Vislumbres do Passado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Uma vez por missão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil.' },
    { nome: 'Magnum Opus', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Uma vez por missão, pode determinar que um personagem em cena de Interação o reconheça. Você recebe +5 em Diplomacia, Enganação, Intuição e Intimidação contra aquele personagem.' },
    { nome: '110%', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, quando fizer um teste de perícia usando Força ou Agilidade (exceto ataques), você pode gastar 2 PE para receber +5 nesse teste.' },
    { nome: 'Ingrediente Secreto', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em interlúdios, você pode cozinhar uma refeição especial. Quem comer recupera +1d6 PV adicionais.' },
    { nome: 'O Crime Compensa', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'No final de uma missão, escolha um item encontrado. Na próxima missão, pode incluí-lo no inventário sem contar no limite de itens por Prestígio.' },
    { nome: 'Traços do Outro Lado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você possui um poder paranormal à sua escolha.' },
    { nome: 'Calejado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +5 pontos de vida.' },
    { nome: 'Ferramentas Improvisadas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha um kit de perícia e considere sua categoria uma abaixo da real (ex.: II conta como I).' },
    { nome: 'Ferramentas Favoritas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha um kit de perícia e considere sua categoria uma abaixo da real (ex.: II conta como I).' },
    { nome: 'Processos Eficientes', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em testes estendidos, pode pagar 2 PE para receber +5 no teste de perícia.' },
    { nome: 'Processo Otimizado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em testes estendidos, pode pagar 2 PE para receber +5 no teste de perícia.' },
    { nome: 'Faro para Pistas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, ao procurar pistas, pode gastar 2 PE para receber +5 nesse teste.' },
    { nome: 'Brecha', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em rolagens de dano com ataques corpo a corpo.' },
    { nome: 'Mão Pesada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em rolagens de dano com ataques corpo a corpo.' },
    { nome: 'Recursos Ilimitados', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seu limite de crédito é sempre considerado um acima do atual.' },
    { nome: 'Patrocinador da Ordem', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seu limite de crédito é sempre considerado um acima do atual.' },
    { nome: 'Posição de Combate', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'No primeiro turno de cada cena de ação, pode gastar 2 PE para receber uma ação de movimento adicional.' },
    { nome: 'Para Bellum', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em rolagens de dano com armas de fogo.' },
    { nome: 'Ferramentas de Trabalho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha uma arma simples ou tática ligada à sua profissão. Você sabe usá-la e recebe +2 de dano com ela.' },
    { nome: 'Patrulha', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em Defesa.' },
    { nome: 'Calma Interior', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Pode usar Religião no lugar de Diplomacia para acalmar. Ao acalmar, o alvo recupera 1d6 de Sanidade (em vez de 1).' },
    { nome: 'Acalentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Pode usar Religião no lugar de Diplomacia para acalmar. Ao acalmar, o alvo recupera 1d6 de Sanidade (em vez de 1).' },
    { nome: 'Por Dentro do Sistema', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: 'Ao prestar ajuda, pode gastar 1 PE para aumentar o bônus concedido em +2.' },
    { nome: 'Espírito Cívico', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: 'Ao prestar ajuda, pode gastar 1 PE para aumentar o bônus concedido em +2.' },
    { nome: 'Eu Já Sabia', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '3 PE',
      desc: 'Uma vez por cena, pode gastar 3 PE para ignorar um dano em Sanidade.' },
    { nome: 'Motor de Busca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Com acesso à internet (critério do Mestre), pode gastar 2 PE para substituir um teste de perícia por Tecnologia.' },
    { nome: 'Impostor', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, pode gastar 2 PE para substituir um teste de perícia qualquer por Enganação.' },
    { nome: 'Estudante Aplicado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Ao fazer um teste de perícia, pode gastar 2 PE para receber +1d6 nesse teste.' },
    { nome: 'Empenho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Ao fazer um teste de perícia, pode gastar 2 PE para receber +1d6 nesse teste.' }
  ];

  poderes.forEach(function (p) {
    var exists = HABILIDADES_CATALOG.some(function (h) {
      return h.classe === 'Origens' && h.nome === p.nome;
    });
    if (!exists) HABILIDADES_CATALOG.push(p);
  });
})();
