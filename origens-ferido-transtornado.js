/**
 * Origens: Ferido por Ritual + Transtornado Arrependido
 * Textos oficiais integrais (sem resumo).
 */
(function () {
  var root = typeof window !== 'undefined' ? window : this;

  if (typeof ORIGENS === 'undefined') root.ORIGENS = {};
  if (!ORIGENS.ferido_por_ritual) {
    ORIGENS.ferido_por_ritual = {
      nome: 'Ferido por Ritual',
      pericias: ['ocultismo', 'vontade'],
      poder: 'Mácula Ritualística'
    };
  }
  if (!ORIGENS.transtornado_arrependido) {
    ORIGENS.transtornado_arrependido = {
      nome: 'Transtornado Arrependido',
      pericias: ['luta', 'ocultismo'],
      poder: 'Sofrimento de Sangue'
    };
  }

  if (typeof HABILIDADES_CATALOG === 'undefined') root.HABILIDADES_CATALOG = [];
  if (typeof HABILIDADES_CATEGORIAS === 'undefined') root.HABILIDADES_CATEGORIAS = {};
  HABILIDADES_CATEGORIAS['Origens'] = HABILIDADES_CATEGORIAS['Origens'] || ['Poder de Origem'];

  var poderes = [
    {
      nome: 'Mácula Ritualística',
      classe: 'Origens',
      categoria: 'Poder de Origem',
      nex: '',
      pe: '—',
      desc:
        'Você tinha uma vida ordinária, até sofrer os efeitos paranormais de um ritual (escolha entre Sangue, Morte, Conhecimento ou Energia). A partir de então, sua existência mundana foi deturpada pelo Outro Lado. Perícias treinadas: Ocultismo e 1 perícia definida pelo elemento do ritual (Fortitude para Sangue, Vontade para Morte e Conhecimento ou Reflexos para Energia). A entidade marcou você com um ritual de 1º círculo a sua escolha do elemento correspondente. Você aprende a conjurar o ritual. Além disso, uma vez por cena, pode conjurá-lo sem gastar PE (mas ainda precisa gastar PE para qualquer efeito adicional, como formas avançadas). Esse ritual não conta no seu limite de rituais conhecidos. Em contrapartida, sofre –5 em testes de resistência contra efeitos (como rituais ou poderes paranormais) desse elemento.'
    },
    {
      nome: 'Sofrimento de Sangue',
      classe: 'Origens',
      categoria: 'Poder de Origem',
      nex: '',
      pe: '—',
      desc:
        'Você já caminhou entre os Transtornados. Talvez tenha sido um seguidor cego, seduzido pelas promessas de transcendência por meio da carne e da dor. Talvez tenha conhecido a natureza visceral do culto desde o início e ainda assim escolheu mergulhar no delírio. Seja como for, em algum momento algo rompeu o ciclo. Você se libertou, mas ainda sente o eco dos rituais e a presença do Sangue sussurrando na própria carne. Perícias Treinadas: Luta e Ocultismo. Eles podem tentar... mas já não dói mais. Você recebe RD 2/mental. Para cada dois rituais de Sangue ou poderes paranormais de Sangue que possua, a RD aumenta em +1. Contudo, a lembrança das desgraças que você viveu causa pesadelos horríveis, que o impedem de repousar tranquilamente. Sua condição de descanso é sempre uma categoria pior (luxuosa se torna confortável, confortável se torna normal e normal se torna precária).'
    }
  ];

  poderes.forEach(function (p) {
    var exists = HABILIDADES_CATALOG.some(function (h) {
      return h.classe === 'Origens' && h.nome === p.nome;
    });
    if (!exists) HABILIDADES_CATALOG.push(p);
  });

  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var asOrigens = [
    {
      nome: 'Ferido por Ritual',
      tipo: 'origem',
      livro: 'OPRPG',
      desc:
        'Você tinha uma vida ordinária, até sofrer os efeitos paranormais de um ritual (escolha entre Sangue, Morte, Conhecimento ou Energia). A partir de então, sua existência mundana foi deturpada pelo Outro Lado. Perícias treinadas. Ocultismo e 1 perícia definida pelo elemento do ritual (Fortitude para Sangue, Vontade para Morte e Conhecimento ou Reflexos para Energia). Mácula Ritualística. A entidade marcou você com um ritual de 1º círculo a sua escolha do elemento correspondente. Você aprende a conjurar o ritual. Além disso, uma vez por cena, pode conjurá-lo sem gastar PE (mas ainda precisa gastar PE para qualquer efeito adicional, como formas avançadas). Esse ritual não conta no seu limite de rituais conhecidos. Em contrapartida, sofre –5 em testes de resistência contra efeitos (como rituais ou poderes paranormais) desse elemento.'
    },
    {
      nome: 'Transtornado Arrependido',
      tipo: 'origem',
      livro: 'OPRPG',
      desc:
        'Você já caminhou entre os Transtornados. Talvez tenha sido um seguidor cego, seduzido pelas promessas de transcendência por meio da carne e da dor. Talvez tenha conhecido a natureza visceral do culto desde o início e ainda assim escolheu mergulhar no delírio. Seja como for, em algum momento algo rompeu o ciclo. Você se libertou, mas ainda sente o eco dos rituais e a presença do Sangue sussurrando na própria carne. Perícias Treinadas. Luta e Ocultismo. Sofrimento de Sangue. Eles podem tentar... mas já não dói mais. Você recebe RD 2/mental. Para cada dois rituais de Sangue ou poderes paranormais de Sangue que possua, a RD aumenta em +1. Contudo, a lembrança das desgraças que você viveu causa pesadelos horríveis, que o impedem de repousar tranquilamente. Sua condição de descanso é sempre uma categoria pior (luxuosa se torna confortável, confortável se torna normal e normal se torna precária).'
    }
  ];
  asOrigens.forEach(function (e) {
    var exists = root.ARQUIVOS_SECRETOS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome;
    });
    if (!exists) root.ARQUIVOS_SECRETOS.push(e);
  });

  console.log('[origens] Ferido por Ritual + Transtornado Arrependido');
})();
