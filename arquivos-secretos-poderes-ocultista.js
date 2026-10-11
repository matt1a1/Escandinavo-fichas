/* arquivos-secretos-poderes-ocultista.js — Poderes de Ocultista (textos oficiais) */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [
    {
      nome: 'Acostumado a Maldição de <Elemento>',
      tipo: 'poder',
      livro: 'OPRPG',
      classe: 'Ocultista',
      desc:
        'Escolha um elemento (exceto Medo). Por já interagir ritualisticamente com esta entidade, quando falha em um teste relacionado ao preço da maldição de itens amaldiçoados do elemento escolhido (OPRPG, p. 145), você não perde pontos de sanidade. Você ainda sofre quaisquer outros efeitos negativos de itens amaldiçoados. Pré-requisitos: Int 2, conjurar ritual de 2º círculo do elemento escolhido.'
    },
    {
      nome: 'Reter Ritual de Combate',
      tipo: 'poder',
      livro: 'OPRPG',
      classe: 'Ocultista',
      desc:
        'Quando um ritual com duração retida está afetando negativamente um alvo, você pode mudar a duração para cena, como reação, no instante em que ele sai da linha de reter. Além disso, quando sofre uma condição que o faz deixar de reter rituais, você pode gastar uma reação e 1 PE por ritual para mudar a duração dos rituais para cena, evitando perder seus efeitos. O custo é de 1 PE por ritual. Pré-requisitos: Int 2, conjurar ritual de 1º círculo. Este poder só pode ser escolhido se estiver usando a regra opcional de Reter Ritual (p. 58).'
    },
    {
      nome: 'Ritual Intenso',
      tipo: 'poder',
      livro: 'OPRPG',
      classe: 'Ocultista',
      desc:
        'Você soma sua Presença nas rolagens de dano e de cura de seus rituais. Pré-requisito: Pre 2.'
    },
    {
      nome: 'Saúde Sobrenatural',
      tipo: 'poder',
      livro: 'OPRPG',
      classe: 'Ocultista',
      desc:
        'Uma vez por cena, você pode gastar uma ação de movimento e 3 PE para receber pontos de vida temporários iguais a sua Presença x 10. Por exemplo, se tem Pre 3, recebe 30 PV temporários. Esses pontos temporários desaparecem no fim da cena e não são cumulativos com eles mesmos. Pré-requisitos: Int 2, Pre 2, conjurar ritual de 1º círculo.'
    }
  ];

  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;

  if (typeof HABILIDADES_CATALOG !== 'undefined' && Array.isArray(HABILIDADES_CATALOG)) {
    DATA.forEach(function (e) {
      var entry = {
        nome: e.nome,
        classe: 'Ocultista',
        categoria: 'Poder de Ocultista',
        nex: '',
        pe: e.nome.indexOf('Saúde') >= 0 ? '3 PE' : e.nome.indexOf('Reter') >= 0 ? '1 PE' : '—',
        desc: e.desc
      };
      var exists = HABILIDADES_CATALOG.some(function (h) {
        return h.nome === entry.nome && h.classe === 'Ocultista';
      });
      if (!exists) HABILIDADES_CATALOG.push(entry);
    });
  }

  console.log('[arquivos-secretos] 4 poderes de Ocultista (OPRPG)');
})();
