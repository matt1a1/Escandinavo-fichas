// Poderes de Origem — alinhados ao Livro Básico (26 origens) + Arquivos Secretos
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
      desc: 'Escolhe um item de categoria 0 que seja uma ferramenta. Em testes de perícia com essa ferramenta, você pode gastar 1 PE para rolar novamente um dos dados.' },
    { nome: 'Processo Otimizado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Quando faz um teste estendido (vários testes para completar uma ação), gasta 2 PE para automaticamente passar em um dos testes (sem precisar rolar).' },
    { nome: 'Faro para Pistas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por cena, quando faz um teste para procurar por pistas, pode rolar novamente o teste (fica com o segundo resultado).' },
    { nome: 'Mão Pesada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seus ataques desarmados causam 1d6 de dano (em vez de 1d3) e podem causar dano letal ou não letal (escolhido a cada ataque).' },
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
      desc: '+1 de Sanidade para cada 5% de NEX.' },
    // Arquivos Secretos
    { nome: 'Registrar o Paranormal', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: '1x/cena, ação padrão + 2 PE: cria um registro (foto/vídeo) de uma criatura paranormal ou de um ritual conjurado na mesma cena. Depois, 1x/cena, pode gastar uma ação de interlúdio + um registro de criatura para +5 em testes de identificá-la e de resistir à presença perturbadora dela (até a próxima cena de interlúdio); ou usar um registro de ritual para memorizá-lo e poder conjurá-lo até a próxima cena de interlúdio — respeitando o NEX necessário por círculo (1º a partir de 5%, 2º a partir de 45%, 3º a partir de 75%) — com +5 para identificá-lo; esse ritual não conta no limite de rituais conhecidos.' },
    { nome: 'Quem Não Arrisca, Não Petisca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '+2 em testes para resistir a condições mentais e de medo; se falhar mesmo assim, ganha +1d20 no próximo teste que fizer até o fim da cena (não cumulativo consigo mesmo).' },
    { nome: 'Minha Teoria Absurda', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por cena de interlúdio, apresenta ao grupo uma teoria sobre a investigação (antes de terem todas as respostas); se a teoria for boa (a critério do mestre, não precisa estar certa), ganha 1d4+1 PE temporários até serem gastos; se, ao fim da missão, uma das teorias se confirmar, ganha +1 PE máximo e atual permanente.' },
    { nome: 'Turno Invertido', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: '1x por missão, numa cena de interlúdio, recebe os benefícios da ação dormir sem precisar realizá-la; além disso, +2 em testes contra qualquer efeito que tente deixá-lo inconsciente.' },
    { nome: 'Existe uma Explicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Ao fazer um teste de Ocultismo, pode gastar 2 PE para usar Ciências no lugar dessa perícia.' },
    { nome: 'Forças para Enfrentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Descreve ao mestre a parte mais traumática de ter sido cobaia; quando uma cena toca nesse trauma (a critério do mestre), fica abalado, mas pode gastar 2 PE para, até o fim da cena, ficar imune a efeitos de medo (inclusive ao próprio "abalado" desta habilidade).' },
    { nome: 'Técnicas de Contenção', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Ao fazer uma manobra de combate, pode gastar 2 PE para +5 no teste de manobra.' },
    { nome: 'O Que Restou', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolhe um elemento (exceto Medo); ganha RD 10 contra ele, mas perde 3 SAN toda vez que entra em contato com esse elemento pela primeira vez numa cena (ritual, item amaldiçoado, criatura ou poder daquele elemento).' },
    { nome: 'Sussurros e Vultos', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Num teste de Diplomacia, Enganação, Intimidação ou Intuição, pode perder 2 SAN para +5 no teste.' }
  ];

  poderes.forEach(function (p) {
    var exists = HABILIDADES_CATALOG.some(function (h) {
      return h.classe === 'Origens' && h.nome === p.nome;
    });
    if (!exists) HABILIDADES_CATALOG.push(p);
  });
})();
