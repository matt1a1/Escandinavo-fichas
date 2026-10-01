/* arquivos-secretos-poderes-c.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Instrumento Elétrico de Combate","tipo":"poder","livro":"Hexatombe II","desc":"Transforma instrumento musical em arma amaldiçoada de Energia (tática, 2 mãos, 2d8+Pre Energia).","elemento":"Energia"},{"nome":"Conhecimento de Direção Precognitiva","tipo":"poder","livro":"Hexatombe II","desc":"+5 em Percepção/Sobrevivência para se localizar. Afinidade: +10.","elemento":"Conhecimento"},{"nome":"Chuva de Balas","tipo":"poder","livro":"Anfitrião","desc":"Munição dura o dobro por cena; rajadas +2 dados de dano.","classe":"Combatente"},{"nome":"Combatente Esforçado","tipo":"poder","livro":"Anfitrião","desc":"Pré-req For 3 ou Vig 3. +1 PE por nível de NEX.","classe":"Combatente"},{"nome":"Treinamento Militarizado","tipo":"poder","livro":"Anfitrião","desc":"Exercitar 1x por interlúdio sem gastar ação; bônus +1d8 usável em dano.","classe":"Combatente"},{"nome":"Análise Conturbada","tipo":"poder","livro":"Anfitrião","desc":"Investigação: agentes rolam 1d6 em Int/Pre até fim da cena, mas perdem esse valor em SAN.","classe":"Especialista"},{"nome":"Profissão Perigo","tipo":"poder","livro":"Anfitrião","desc":"Ação completa + 4 PE: troca item destruído por outro de cat/espaços iguais. Até 3x/missão.","classe":"Especialista"},{"nome":"Quase Novo","tipo":"poder","livro":"Anfitrião","desc":"Manutenção em interlúdio: +10 PV no item e modificação temporária.","classe":"Especialista"},{"nome":"Explorador da Névoa","tipo":"poder","livro":"Anfitrião","desc":"2 PE: descobre estado da Membrana; se danificada, –1 SAN e –1 PE em conjuração.","classe":"Ocultista"},{"nome":"Sinestesia Paranormal","tipo":"poder","livro":"Anfitrião","desc":"Com Membrana danificada: –1d6 SAN e troca atributos de até 2 pares de perícias.","classe":"Ocultista"},{"nome":"Terrores Noturnos","tipo":"poder","livro":"Anfitrião","desc":"Ao dormir: 1d100 decide +2 PE ou descanso precário com poder/ritual extra 1x.","classe":"Ocultista"},{"nome":"Hackear o Destino","tipo":"poder","livro":"SDOL","desc":"1x/cena, 3 PE: rerrola um teste seu ou de aliado em curto."},{"nome":"Interface Neural","tipo":"poder","livro":"SDOL","desc":"Com acesso a rede, gasta 2 PE para substituir um teste por Tecnologia."},{"nome":"Código Aberto","tipo":"poder","livro":"SDOL","desc":"+5 em Tecnologia para abrir sistemas; 1x/cena, 2 PE para abrir sem teste (DT ≤ 20)."},{"nome":"Firewall Mental","tipo":"poder","livro":"SDOL","desc":"Resistência a dano mental igual ao Intelecto."},{"nome":"Overclock","tipo":"poder","livro":"SDOL","desc":"1x/cena, ação de movimento + 2 PE: +1 ação padrão no turno, depois fatigado."},{"nome":"Drone de Reconhecimento","tipo":"poder","livro":"SDOL","desc":"Fabricar/pilotar drone simples; Percepção à distância com Tecnologia."},{"nome":"Carga Tática","tipo":"poder","livro":"SDOL","desc":"Pré-req For 2. Ao se mover em linha reta ≥6m e atacar, +1d8 dano."},{"nome":"Cobertura Perfeita","tipo":"poder","livro":"SDOL","desc":"Em cobertura, +2 Defesa adicional e imune a crítico de longe."},{"nome":"Disparo Calculado","tipo":"poder","livro":"SDOL","desc":"Gasta 2 PE: +5 no próximo ataque de Pontaria e +1 na margem de ameaça."},{"nome":"Engenharia de Campo","tipo":"poder","livro":"SDOL","desc":"Fabricar itens categoria 0–I em interlúdio com –5 na DT."},{"nome":"Rede de Contatos","tipo":"poder","livro":"SDOL","desc":"1x/missão, gasta crédito: obtém informação ou item comum em 1 cena."},{"nome":"Piloto de Fuga","tipo":"poder","livro":"SDOL","desc":"+5 em direção em perseguições; ação de movimento extra no veículo 1x/cena."},{"nome":"Catálogo de Criaturas Ambulante","tipo":"poder","livro":"SDOL","desc":"Identifica criaturas como ação de movimento só por vestígios.","classe":"Ocultista"},{"nome":"Meditação Ocultista","tipo":"poder","livro":"SDOL","desc":"Interlúdio Meditação recupera PE conforme qualidade do descanso.","classe":"Ocultista"}];
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
