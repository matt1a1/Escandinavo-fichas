// Poderes de Origem — textos oficiais EXATOS do Livro Básico (sem resumo)
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
      desc: 'Uma vez por missão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil.' },
    { nome: 'Magnum Opus', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem envolvido em uma cena de Interação o reconheça. Você recebe +5 em testes de Diplomacia, Enganação, Intuição e Intimidação contra aquele personagem. A critério do mestre, pode receber esses bônus em outras situações nas quais seria reconhecido.' },
    { nome: '110%', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, quando fizer um teste de perícia usando Força ou Agilidade (exceto testes de ataque) você pode gastar 2 PE para receber +5 nesse teste.' },
    { nome: 'Ingrediente Secreto', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em cena de interlúdio, ao fazer a ação "alimentar-se" para cozinhar algo especial, você e todos que também se alimentarem recebem o benefício de dois pratos (se escolherem o mesmo benefício duas vezes, os efeitos se acumulam).' },
    { nome: 'O Crime Compensa', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por Prestígio.' },
    { nome: 'Traços do Outro Lado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você possui um poder paranormal à sua escolha.' },
    { nome: 'Calejado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +5 pontos de vida.' },
    { nome: 'Ferramenta Favorita', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você pode escolher um kit de perícia e considerar sua categoria como uma abaixo da real (por exemplo, um kit de perícia de categoria II conta como categoria I para você).' },
    { nome: 'Ferramentas Favoritas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você pode escolher um kit de perícia e considerar sua categoria como uma abaixo da real (por exemplo, um kit de perícia de categoria II conta como categoria I para você).' },
    { nome: 'Processo Otimizado', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Sempre que faz um teste de perícia durante um teste estendido, pode pagar 2 PE para receber +5 nesse teste.' },
    { nome: 'Faro para Pistas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 2 PE para receber +5 nesse teste.' },
    { nome: 'Mão Pesada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em rolagens de dano com ataques corpo a corpo.' },
    { nome: 'Patrocinador da Ordem', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Seu limite de crédito é sempre considerado um acima do atual.' },
    { nome: 'Posição de Combate', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.' },
    { nome: 'Para Bellum', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em rolagens de dano com armas de fogo.' },
    { nome: 'Ferramenta de Trabalho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +2 nas rolagens de dano com ela.' },
    { nome: 'Ferramentas da Profissão', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +2 nas rolagens de dano com ela.' },
    { nome: 'Patrulha', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você recebe +1 em Defesa.' },
    { nome: 'Acalentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você pode usar Religião em vez de Diplomacia para fazer a ação acalmar. Além disso, quando acalma uma pessoa, ela fica com 1d6 de Sanidade, em vez de 1.' },
    { nome: 'Espírito Cívico', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '1 PE',
      desc: 'Sempre que faz um teste para prestar ajuda, você pode gastar 1 PE para aumentar o bônus concedido em +2.' },
    { nome: 'Eu Já Sabia', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '3 PE',
      desc: 'Você não se abala com entidades ou anomalias. Afinal, sempre soube que isso tudo existia. Uma vez por cena, você pode gastar 3 PE para ignorar um dano em Sanidade.' },
    { nome: 'Desbravador', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você não sofre penalidade em deslocamento e Sobrevivência por clima ruim e por terreno difícil natural.' },
    { nome: 'Motor de Busca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'A critério do Mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.' },
    { nome: 'Computação Avançada', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'A critério do Mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.' },
    { nome: 'Impostor', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.' },
    { nome: 'Dedicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Você pode não ter muita experiência, mas compensa com dedicação e esforço. Quando faz um teste de perícia, você pode gastar 2 PE para receber +1d6 nesse teste.' },
    { nome: 'Empenho', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Você pode não ter muita experiência, mas compensa com dedicação e esforço. Quando faz um teste de perícia, você pode gastar 2 PE para receber +1d6 nesse teste.' },
    { nome: 'Cicatrizes Psicológicas', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Você já enfrentou o paranormal e sobreviveu, mas as marcas ficaram. Recebe +5 em testes de Vontade contra medo e efeitos mentais. Contudo, quando falha em um teste de Vontade, o efeito é piorado a critério do mestre.' },
    { nome: 'Registrar o Paranormal', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Uma vez por cena, você pode gastar uma ação padrão e 2 PE para criar um registro de uma criatura paranormal ou ritual que tenha sido conjurado na mesma cena. A ação padrão deve ser gasta para tirar uma foto, fazer um vídeo ou algum tipo de registro desse tipo. Uma vez por cena, você pode gastar uma ação de interlúdio e um dos registros de criatura para receber +5 em testes de identificar criatura e presença perturbadora envolvendo a criatura fotografada até o início da próxima cena de interlúdio. Alternativamente, uma vez por cena, você pode gastar uma ação de interlúdio e um dos registros de ritual para memorizar o ritual presente no registro, podendo conjurá-lo como se o conhecesse até o início de sua próxima cena de interlúdio, desde que tenha o NEX necessário (1º círculo a partir do NEX 5%, 2º círculo a partir do NEX 45% e 3º círculo a partir do NEX 75%); você também recebe +5 em testes para identificar o ritual. Esse ritual não conta no seu limite de rituais conhecidos.' },
    { nome: 'Quem Não Arrisca, Não Petisca', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Uma vez por cena, quando faz um teste de perícia com alguma penalidade, você pode ignorar essa penalidade no teste. Além disso, uma vez por missão, ao falhar em um teste, você pode rolar novamente o teste (você deve ficar com o segundo resultado).' },
    { nome: 'Minha Teoria Absurda', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Uma vez por interlúdio, você pode elaborar uma teoria absurda sobre a investigação. Se a teoria for boa (a critério do mestre), você recebe 1d4+1 PE temporários. Se a teoria se confirmar durante a missão, você recebe +1 PE máximo permanente.' },
    { nome: 'Turno Invertido', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Uma vez por missão, você pode receber os benefícios de dormir sem de fato dormir. Além disso, recebe +2 em testes de resistência contra efeitos que tentem deixá-lo inconsciente.' },
    { nome: 'Existe uma Explicação', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em um teste de Ocultismo, você pode gastar 2 PE para usar Ciências no lugar.' },
    { nome: 'Forças para Enfrentar', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Você carrega o trauma de ter sido uma cobaia. Sempre que uma cena toca nesse trauma, você fica abalado. Contudo, pode gastar 2 PE para ficar imune a efeitos de medo até o fim da cena.' },
    { nome: 'Técnicas de Contenção', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Em uma manobra de combate, você pode gastar 2 PE para receber +5 no teste.' },
    { nome: 'O Que Restou', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Escolha um elemento (exceto Medo). Você recebe RD 10 contra esse elemento. Contudo, no primeiro contato com esse elemento em cada cena, perde 3 pontos de Sanidade.' },
    { nome: 'Sussurros e Vultos', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'Em testes de Diplomacia, Enganação, Intimidação ou Intuição, você pode perder 2 pontos de Sanidade para receber +5 no teste.' },
    { nome: 'Resistência do Treinamento', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '—',
      desc: 'O maior rendimento do seu treinamento foi a carga extra de resistência que você adquiriu para continuar na briga. Se escolheu treinamento em Luta e Fortitude, você recebe +2 PV no NEX 5% e +1 PV para cada 10% de NEX. Se escolheu treinamento em Pontaria e Reflexos, você recebe +1 PE no NEX 5% e +1 PE para cada 10% de NEX.' },
    { nome: 'Full Metal Jacket', classe: 'Origens', categoria: 'Poder de Origem', nex: '', pe: '2 PE',
      desc: 'Independentemente da humanidade em seu interior, por fora, você tem um metafórico invólucro duro como metal — nada vai te impedir de continuar socando ou apertando o gatilho. Quando faz um teste de Luta ou Pontaria com alguma penalidade, você pode gastar 2 PE para ignorar a penalidade nesse teste.' }
  ];

  var adicionados = 0;
  poderes.forEach(function (p) {
    var found = null;
    for (var i = 0; i < HABILIDADES_CATALOG.length; i++) {
      var h = HABILIDADES_CATALOG[i];
      if (h && h.classe === 'Origens' && h.nome === p.nome) {
        found = h;
        break;
      }
    }
    if (found) {
      found.desc = p.desc;
      found.categoria = 'Poder de Origem';
      found.pe = p.pe;
      found.nex = p.nex || '';
    } else {
      HABILIDADES_CATALOG.push(p);
      adicionados++;
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

  console.log('[origens-poderes] ' + poderes.length + ' poderes oficiais (novos: ' + adicionados + ')');
})();
