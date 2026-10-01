/* arquivos-secretos-poderes-d.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Ruído de Comunicação","tipo":"poder","livro":"Panacea","desc":"Gasta 1 PE: interferência em rádios/comuns em médio por 1 rodada."},{"nome":"Apaixonado por Veículos","tipo":"poder","livro":"Panacea","desc":"+5 em direção e manutenção de veículos; 1x/cena, 2 PE: ação de movimento extra no veículo."},{"nome":"Desafiar o Ego","tipo":"poder","livro":"Panacea","desc":"Ação de movimento + 2 PE: alvo em curto faz Vontade ou fica vulnerável até fim do turno."},{"nome":"Protocolo de Contenção","tipo":"poder","livro":"Panacea","desc":"+5 em testes para conter/imobilizar; manobra agarrar com +1d."},{"nome":"Antídoto Improvisado","tipo":"poder","livro":"Panacea","desc":"Ação completa + 2 PE: remove uma condição de veneno/doença de aliado em toque."},{"nome":"Injeção de Combate","tipo":"poder","livro":"Panacea","desc":"Ação de movimento: aplica medicamento em si ou adjacente como ação livre 1x/turno."},{"nome":"Análise de Amostra","tipo":"poder","livro":"Panacea","desc":"Com amostra biológica, Ciências DT 15 revela fraquezas (+5 dano vs aquele tipo por cena)."},{"nome":"Escudo Químico","tipo":"poder","livro":"Panacea","desc":"1x/cena, reação + 3 PE: RD 10 contra um ataque de ácido/fogo/frio/elétrico."},{"nome":"Nervo de Aço","tipo":"poder","livro":"Panacea","desc":"Imune a enjoado e +5 em Fortitude vs toxinas."},{"nome":"Visão do Predador","tipo":"poder","livro":"Vampyr","desc":"Em escuridão, vê como penumbra; 1 PE: visão no escuro total por cena."},{"nome":"Sede Controlada","tipo":"poder","livro":"Vampyr","desc":"Ao causar dano de Sangue, recupera 1d4 PV (máx. 1x/rodada).","elemento":"Sangue"},{"nome":"Marca da Presa","tipo":"poder","livro":"Vampyr","desc":"Ao acertar corpo a corpo, 2 PE: marca o alvo; +5 em testes contra ele até fim da cena."},{"nome":"Forma Sombria","tipo":"poder","livro":"Vampyr","desc":"1x/cena, ação de movimento + 3 PE: atravessa espaços ocupados e ganha Furtividade +5 por 1 rodada."},{"nome":"Chamado do Sangue","tipo":"poder","livro":"Vampyr","desc":"Ação padrão + 2 PE: criatura de Sangue em médio fica confusa 1 rodada (Vontade evita).","elemento":"Sangue"},{"nome":"Pele Fria","tipo":"poder","livro":"Vampyr","desc":"RD 5 a frio e +2 em Fortitude vs efeitos de Morte.","elemento":"Morte"},{"nome":"Olhos do Abismo","tipo":"poder","livro":"Vampyr","desc":"Ação de movimento + 1 PE: alvo em curto fica abalado 1 rodada (Vontade evita)."},{"nome":"Mestre do Medo","tipo":"poder","livro":"Vampyr","desc":"+5 em Intimidação; alvos amedrontados por você sofrem –1d em ataques."},{"nome":"Pacto Escarlate","tipo":"poder","livro":"Vampyr","desc":"Interlúdio + 3 PE + 3 PV: aliado ganha +1d6 em um atributo até próximo interlúdio."},{"nome":"Escudo Espiral Temporal","tipo":"poder","livro":"Vampyr","desc":"Reação + 3 PE: ignora o dano de um ataque, mas fica lento no próximo turno.","elemento":"Morte"},{"nome":"Grilhões de Lodo","tipo":"poder","livro":"Vampyr","desc":"Ação padrão + 2 PE: alvo em curto fica enredado (Reflexos evita).","elemento":"Morte"},{"nome":"Salto de Dados","tipo":"poder","livro":"Vampyr","desc":"1x/cena, 2 PE: troca de lugar com aliado em médio (ambos devem aceitar).","elemento":"Energia"},{"nome":"Ecos do Passado","tipo":"poder","livro":"Vampyr","desc":"Ação completa + 2 PE: Percepção DT 15 revela um evento recente no local (últimas 24h)."}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) { return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || ''); });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;
  if (typeof HABILIDADES_CATALOG !== 'undefined') {
    if (typeof HABILIDADES_CATEGORIAS === 'undefined') root.HABILIDADES_CATEGORIAS = {};
    DATA.forEach(function (e) {
      var cls = e.classe || '';
      if (/combatente/i.test(cls)) cls = 'Combatente';
      else if (/especialista/i.test(cls)) cls = 'Especialista';
      else if (/ocultista/i.test(cls)) cls = 'Ocultista';
      else if (e.elemento) cls = 'Poderes Paranormais';
      else cls = 'Poderes Paranormais';
      var cat = e.elemento || (cls === 'Combatente' ? 'Poderes de Combatente' : cls === 'Especialista' ? 'Poderes de Especialista' : cls === 'Ocultista' ? 'Poderes de Ocultista' : 'Varia');
      if (e.elemento) cls = 'Poderes Paranormais';
      if (!HABILIDADES_CATEGORIAS[cls]) HABILIDADES_CATEGORIAS[cls] = [];
      if (HABILIDADES_CATEGORIAS[cls].indexOf(cat) === -1) HABILIDADES_CATEGORIAS[cls].push(cat);
      if (HABILIDADES_CATALOG.some(function (h) { return h.classe === cls && h.nome === e.nome; })) return;
      HABILIDADES_CATALOG.push({ nome: e.nome, classe: cls, categoria: cat, nex: e.nex || '', pe: '', desc: '[Arquivos Secretos — ' + (e.livro || '') + '] ' + (e.desc || '') });
    });
    if (typeof root.refreshHabilidadesCatalog === 'function') try { root.refreshHabilidadesCatalog(); } catch (err) {}
  }
})();
