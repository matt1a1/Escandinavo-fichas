/* arquivos-secretos-poderes-b.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Dominar Habilidade Ritualística","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Escolhido Pelo Outro Lado. Ganha a 1ª habilidade de uma trilha de Ocultista que não é a sua (precisa do NEX); repetível.","classe":"Ocultista"},{"nome":"Estágio Terminal","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 2. Enquanto machucado, 1x/rodada gasta 2 PE para ação de movimento extra."},{"nome":"Kian Vai Nos Salvar","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Pre 2, conjurar rituais, adorar o Kian. Aprende 1 ritual de Conhecimento de 1º (2º em NEX 25%, 3º em 55%) sem contar no limite; só um por cena."},{"nome":"Tratamento de Emergência","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2, treinado em Medicina. Ação padrão + 2 PE dá 2d10+10 PV temp. a alvo em toque (1x por alvo por cena)."},{"nome":"Arte da Música Macabra","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Pre 2, treinado em Artes e Ocultismo, conjurar. Ação padrão + 2 PE em alvo que o ouça: +5 no próximo dano, +2 margem de ameaça, +5 no próximo ataque, ou +9m alcance."},{"nome":"Sintonização Mental com Arma","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2 ou Pre 2, treinado em Ocultismo, conjurar. Interlúdio + 3 PE sintoniza arma: usa atributo à escolha para ataque e dano até próxima cena de interlúdio."},{"nome":"Sintonização Mental com Proteção","tipo":"poder","livro":"Hexatombe I","desc":"Mesmos pré-reqs. Sintoniza proteção: usa atributo à escolha para Defesa em vez de Agi; remove condição ruim/terrível para conjurar."},{"nome":"Movimentação Tática","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req For 2, treinado em Atletismo e Tática. Ao se mover em direção a cobertura ou inimigo, gasta 1 PE para o dobro do deslocamento."},{"nome":"Instintos Táticos","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Pre 2, treinado em Percepção e Tática. Imune a desprevenido; ao causar dano, gasta 2 PE para o alvo falhar em Furtividade contra você por 1 rodada."},{"nome":"Marteladas","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req For 2, treinado em Luta, Artista Marcial. Ação completa + 3 PE: 3 ataques desarmados no mesmo alvo, dano somado (RD 1x).","classe":"Combatente"},{"nome":"Liturgia de Fortalecimento Ritualístico","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int e Pre 2. Interlúdio + 2 PE: DT de um ritual conhecido sobe +2 até próxima cena de interlúdio."},{"nome":"Foco de Combate","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2. 1x/cena, ação de movimento + 2 PE: +5 em ataques até fim da cena ou até errar."},{"nome":"Golpe Preciso","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 2, treinado em Luta ou Pontaria. Gasta 2 PE para +5 no ataque (não empilha com Ataque Especial no mesmo ataque)."},{"nome":"Pele de Aço","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Vig 2. Resistência a dano 2."},{"nome":"Segundo Fôlego","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Vig 2. 1x/cena, ação de movimento recupera 2d8+2 PV."},{"nome":"Ataque em Área","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req For 2 ou Agi 2. Com arma corpo a corpo, gasta 3 PE para atingir todos adjacentes com o mesmo ataque (–1d)."},{"nome":"Especialista em Explosivos","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2, treinado em Profissão (químico) ou Tecnologia. +5 em testes para fabricar/manusear explosivos; +1d6 dano com granadas."},{"nome":"Olho Clínico","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2, treinado em Medicina. Ação de movimento: identifica PV, condições e vulnerabilidades de um alvo em curto (Percepção DT 15)."},{"nome":"Mãos Firmes","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 2. +2 em testes de Pontaria e em perícias que usem precisão manual."},{"nome":"Voz de Comando","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Pre 2. Ação de movimento + 1 PE: aliado em médio recebe +5 no próximo teste."},{"nome":"Esquiva Sobrenatural","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 3. 1x/rodada, reação + 2 PE: +5 Defesa contra um ataque."},{"nome":"Canalizar Entidade","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req conjurar rituais. Ação completa + 3 PE: próximo ritual na cena tem +1 círculo efetivo para DT/dano (máx. 4º).","classe":"Ocultista"},{"nome":"Ambidestria","tipo":"poder","livro":"Hexatombe II","desc":"Pré-req For 2 ou Agi 2, treinado em Luta. Duas armas (uma leve): agredir vira dois ataques, –1d20 até próximo turno — sem penalidade se já tem Combater com Duas Armas."},{"nome":"Entrada Triunfal","tipo":"poder","livro":"Hexatombe II","desc":"Pré-req Pre 2. 1x/sessão, ao entrar anunciando-se: +1d20 no primeiro teste (exceto Furtividade), ou transfere a aliado em longo."},{"nome":"Papinho Sedutor","tipo":"poder","livro":"Hexatombe II","desc":"Pré-req Pre 2. Gasta 1 PE para +5 em teste de Presença para seduzir; se passar, alvo fica apaixonado."}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
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

      var cat;
      if (e.elemento) { cat = e.elemento; cls = 'Poderes Paranormais'; }
      else if (cls === 'Combatente') cat = 'Poderes de Combatente';
      else if (cls === 'Especialista') cat = 'Poderes de Especialista';
      else if (cls === 'Ocultista') cat = 'Poderes de Ocultista';
      else cat = 'Varia';

      if (!HABILIDADES_CATEGORIAS[cls]) HABILIDADES_CATEGORIAS[cls] = [];
      if (HABILIDADES_CATEGORIAS[cls].indexOf(cat) === -1) HABILIDADES_CATEGORIAS[cls].push(cat);

      var exists = HABILIDADES_CATALOG.some(function (h) {
        return h.classe === cls && h.nome === e.nome;
      });
      if (exists) return;
      HABILIDADES_CATALOG.push({
        nome: e.nome,
        classe: cls,
        categoria: cat,
        nex: e.nex || '',
        pe: '',
        desc: '[Arquivos Secretos — ' + (e.livro || '') + '] ' + (e.desc || '')
      });
    });
    if (typeof root.refreshHabilidadesCatalog === 'function') {
      try { root.refreshHabilidadesCatalog(); } catch (err) {}
    }
  }
})();
