/**
 * Origens oficiais — Arquivos Secretos (textos integrais dos PDFs)
 * Sangue, Anfitrião, SDOL, Panacea, Vampyr, Hellhunters
 * REGRA: nunca resumir — texto oficial completo.
 */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  if (typeof ORIGENS === 'undefined') root.ORIGENS = {};
  if (typeof HABILIDADES_CATALOG === 'undefined') root.HABILIDADES_CATALOG = [];
  if (typeof HABILIDADES_CATEGORIAS === 'undefined') root.HABILIDADES_CATEGORIAS = {};
  HABILIDADES_CATEGORIAS['Origens'] = HABILIDADES_CATEGORIAS['Origens'] || ['Poder de Origem'];

  var origens = [
    {
      key: 'influencer_paranormal',
      nome: 'Influencer Paranormal',
      livro: 'Anfitrião',
      pericias: ['enganacao', 'tecnologia'],
      poder: 'Registrar o Paranormal',
      desc:
        'De início, você nunca acreditou nas lendas urbanas e vídeos de fantasmas, então resolveu se aproveitar daqueles que acreditam. Foi produzindo conteúdos falsos e duvidosos para a internet que você descobriu a dura verdade por trás da Membrana.\n\n**Perícias treinadas.** Enganação e Tecnologia.\n\n**Registrar o Paranormal.** Uma vez por cena, você pode gastar uma ação padrão e 2 PE para criar um registro de uma criatura paranormal ou ritual que tenha sido conjurado na mesma cena. A ação padrão deve ser gasta para tirar uma foto, fazer um vídeo ou algum tipo de registro desse tipo. Uma vez por cena, você pode gastar uma ação de interlúdio e um dos registros de criatura para receber +5 em testes de identificar criatura e presença perturbadora envolvendo a criatura fotografada até o início da próxima cena de interlúdio. Alternativamente, uma vez por cena, você pode gastar uma ação de interlúdio e um dos registros de ritual para memorizar o ritual presente no registro, podendo conjurá-lo como se o conhecesse até o início de sua próxima cena de interlúdio, desde que tenha o NEX necessário (1º círculo a partir do NEX 5%, 2º círculo a partir do NEX 45% e 3º círculo a partir do NEX 75%); você também recebe +5 em testes para identificar o ritual. Esse ritual não conta no seu limite de rituais conhecidos.'
    },
    {
      key: 'cacador_recompensas',
      nome: 'Caçador de Recompensas',
      livro: 'Anfitrião',
      pericias: ['crime', 'investigacao'],
      poder: 'Quem Não Arrisca, Não Petisca',
      desc:
        'Sua sede pelo dinheiro fácil sempre te guiou na exploração dos locais mais obscuros. Você sabe muito bem que as situações mais insalubres guardam as melhores recompensas.\n\n**Perícias treinadas.** Crime e Investigação.\n\n**Quem Não Arrisca, Não Petisca.** Você recebe +2 em testes para resistir à condições mentais e de medo. Além disso, caso falhe em algum desses testes, você recebe +1d20 no próximo teste que realizar até o fim da cena (não cumulativo com ele mesmo).'
    },
    {
      key: 'ufologo',
      nome: 'Ufólogo',
      livro: 'SDOL',
      pericias: ['ciencias', 'ocultismo'],
      poder: 'Minha Teoria Absurda',
      desc:
        'Você sempre soube que não estávamos sozinhos no universo. Muitos já te consideraram um lunático, mas algo dizia que suas teorias sempre estavam no caminho certo. As intermináveis pesquisas sobre o espaço, sinais no céu e seres de outros planetas eventualmente te fizeram perceber que o oculto não mede distâncias. Onde há medo, há algo incompreensível para espreitar.\n\n**Perícias treinadas.** Ciências e Ocultismo.\n\n**Minha Teoria Absurda.** Uma vez por cena de interlúdio, você pode gastar uma ação para apresentar ao seu grupo sua tese sobre as prováveis respostas para a investigação com a qual estão lidando. Obviamente, isso deve ser feito antes de terem todas as respostas. A critério do mestre, se suas teorias forem boas (não necessariamente corretas), você recebe 1d4+1 PE temporários que duram até serem gastos. Se, quando a missão acabar, uma de suas teorias se provar correta, você recebe +1 PE máximo e atual.'
    },
    {
      key: 'funcionario_beira_estrada',
      nome: 'Funcionário de Beira de Estrada',
      livro: 'SDOL',
      pericias: ['fortitude', 'intuicao'],
      poder: 'Turno Invertido',
      desc:
        'Longe das grandes concentrações urbanas, você dava o seu melhor para atender os viajantes cansados. Entre madrugadas adentro e caminhões barulhentos, as lendas urbanas e relatos horripilantes eventualmente chegaram aos seus ouvidos e atiçaram a sua curiosidade.\n\n**Perícias treinadas.** Fortitude e Intuição.\n\n**Turno Invertido.** Uma vez por missão, durante uma cena de interlúdio, você pode receber os benefícios da ação dormir sem precisar realizá-la. Além disso, recebe +2 em testes contra qualquer efeito que tente te deixar inconsciente.'
    },
    {
      key: 'cientista_ex_panacea',
      nome: 'Cientista Ex-Panacea',
      livro: 'Panacea',
      pericias: ['atualidades', 'ciencias'],
      poder: 'Existe uma Explicação',
      desc:
        'Ingênuo, você passou anos trabalhando para a Panacea Industries até descobrir que prestava serviços para uma grande organização responsável por aprisionar e utilizar criaturas paranormais que pesquisam para enfrentarem umas às outras. Quando soube do uso de cobaias humanas nesses experimentos, decidiu parar de apoiar as pesquisas e se voltou contra a multinacional.\n\n**Perícias treinadas.** Atualidades e Ciências.\n\n**Existe uma Explicação.** Acostumado a ver o paranormal como um assunto científico, você prefere lidar com o sobrenatural através de teorias, cálculos e testes experimentais. Quando faz um teste de Ocultismo, você pode gastar 2 PE para usar Ciências no lugar dessa perícia.'
    },
    {
      key: 'seguranca_ex_panacea',
      nome: 'Segurança Ex-Panacea',
      livro: 'Panacea',
      pericias: ['luta', 'pontaria'],
      poder: 'Técnicas de Contenção',
      desc:
        'Acreditando que trabalhava em uma multinacional dedicada à saúde e bem-estar da população, você quase enlouqueceu quando descobriu que fazia a segurança para cientistas dispostos a usar cobaias humanas em seus experimentos com o paranormal. Assim que soube a verdade, abandonou as Indústrias Panacea para acabar com a existência dela.\n\n**Perícias treinadas.** Luta e Pontaria.\n\n**Técnicas de Contenção.** Você domina técnicas de luta para conter pessoas que podem causar problemas. Quando faz uma manobra de combate, você pode gastar 2 PE para receber +5 no teste de manobra.'
    },
    {
      key: 'cobaia_sobrevivente',
      nome: 'Cobaia Sobrevivente',
      livro: 'Panacea',
      pericias: ['fortitude', 'vontade'],
      poder: 'Forças para Enfrentar',
      desc:
        'Você foi pego pelas Indústrias Panacea (ou outra organização semelhante) ainda pequeno, mas, após anos como cobaia, conseguiu sobreviver aos experimentos com o mínimo de sequelas mentais e/ou físicas. Após escapar das garras da multinacional, passou a dedicar a sua vida a encontrar meios de salvar outras pessoas do destino trágico que você evitou.\n\n**Perícias treinadas.** Fortitude e Vontade.\n\n**Forças para Enfrentar.** Ser uma cobaia por anos marcou você com experiências horríveis, mas que, às vezes, podem ser usadas como força para continuar sobrevivendo. Descreva para o mestre a parte mais traumática da sua história como cobaia. Quando estiver em uma cena em que há algo relacionado a esse trauma, à critério do mestre, você fica abalado. Entretanto, quando isso acontecer, você pode gastar 2 PE para, até o fim da cena, receber imunidade a efeitos de medo (se aplica também ao abalado desta habilidade).'
    },
    {
      key: 'exorcizado',
      nome: 'Exorcizado',
      livro: 'Vampyr',
      pericias: ['fortitude', 'ocultismo'],
      poder: 'O Que Restou',
      desc:
        'Você já esteve sob influência de uma grande força sobrenatural opressora, que dominou seu corpo para realizar façanhas incompreensíveis.\n\n**Perícias Treinadas.** Fortitude e Ocultismo.\n\n**O Que Restou.** Uma parte da criatura paranormal que o possuiu continua dentro de você. Escolha um elemento (exceto Medo). Você recebe RD 10 contra o tipo do elemento escolhido. Entretanto, sempre que entrar em contato com esse elemento pela primeira vez em uma cena (seja ao presenciar rituais, itens amaldiçoados, criaturas ou poderes paranormais), você perde 3 SAN.'
    },
    {
      key: 'sensitivo_rebelde',
      nome: 'Sensitivo Rebelde',
      livro: 'Vampyr',
      pericias: ['intuicao', 'vontade'],
      poder: 'Sussurros e Vultos',
      desc:
        'Apesar de lutar contra sua sensitividade paranormal, ela nunca te abandonou. Não importa o quanto você tentou negar, as visões continuavam voltando. Para você, nunca foi uma questão de fé. O sobrenatural sempre foi sua realidade.\n\n**Perícias Treinadas.** Intuição e Vontade.\n\n**Sussurros e Vultos.** Ao lidar com outras pessoas, inesperadamente surgem vozes e vultos na sua cabeça que, por mais assustadoras que sejam, ajudam a compreendê-las. Quando faz um teste de Diplomacia, Enganação, Intimidação ou Intuição, você pode escolher perder 2 SAN para receber +5 nesse teste.'
    },
    {
      key: 'treinado_hell_hunters',
      nome: 'Treinado pela Hell Hunters',
      livro: 'Hellhunters',
      pericias: ['luta', 'fortitude'],
      poder: 'Resistência do Treinamento',
      desc:
        'Você foi treinado pela organização Hell Hunter no combate contra o paranormal. Foi árduo, doloroso, cruel, mas nenhuma outra organização poderia te preparar melhor.\n\n**Perícias treinadas.** Escolha entre Luta e Fortitude ou Pontaria e Reflexos.\n\n**Resistência do Treinamento.** O maior rendimento do seu treinamento foi a carga extra de resistência que você adquiriu para continuar na briga. Se escolheu treinamento em Luta e Fortitude, você recebe +2 PV no NEX 5% e +1 PV para cada 10% de NEX. Se escolheu treinamento em Pontaria e Reflexos, você recebe +1 PE no NEX 5% e +1 PE para cada 10% de NEX.'
    },
    {
      key: 'veterano_conflito_armado',
      nome: 'Veterano de Conflito Armado',
      livro: 'Hellhunters',
      pericias: ['luta', 'pontaria'],
      poder: 'Full Metal Jacket',
      desc:
        'Você já vivenciou muitos conflitos armados na sua vida. Seja participando de tiroteios como um membro da SWAT ou mesmo tendo vivido a sua juventude em zonas de conflito, isso marcou a sua forma de ver o mundo. A constante exposição a violência te tornou um sobrevivente calejado, capaz de suportar a dor e seguir em frente, mesmo que o peso dos amigos caídos pelo caminho fiquem ao seu lado.\n\n**Perícias treinadas.** Luta e Pontaria.\n\n**Full Metal Jacket.** Independentemente da humanidade em seu interior, por fora, você tem um metafórico invólucro duro como metal — nada vai te impedir de continuar socando ou apertando o gatilho. Quando faz um teste de Luta ou Pontaria com alguma penalidade, você pode gastar 2 PE para ignorar a penalidade nesse teste.'
    }
  ];

  origens.forEach(function (o) {
    ORIGENS[o.key] = {
      nome: o.nome,
      pericias: o.pericias,
      poder: o.poder
    };

    var foundHab = false;
    HABILIDADES_CATALOG.forEach(function (h) {
      if (h.classe === 'Origens' && h.nome === o.poder) {
        h.desc = o.desc;
        foundHab = true;
      }
    });
    if (!foundHab) {
      HABILIDADES_CATALOG.push({
        nome: o.poder,
        classe: 'Origens',
        categoria: 'Poder de Origem',
        nex: '',
        pe: '—',
        desc: o.desc
      });
    }

    var foundAs = false;
    root.ARQUIVOS_SECRETOS.forEach(function (x) {
      if (x.tipo === 'origem' && x.nome === o.nome) {
        x.livro = o.livro;
        x.desc = o.desc;
        foundAs = true;
      }
    });
    if (!foundAs) {
      root.ARQUIVOS_SECRETOS.push({
        nome: o.nome,
        tipo: 'origem',
        livro: o.livro,
        desc: o.desc
      });
    }
  });

  console.log('[AS origens oficiais]', origens.length, 'atualizadas');
})();
