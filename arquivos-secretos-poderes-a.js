/* arquivos-secretos-poderes-a.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Cicatrizes Expostas","tipo":"poder","livro":"Sangue","desc":"Pré-req: ter cicatrizes. Ação de movimento expõe a cicatriz; enquanto exposta, todo dano causado ganha +1d8 do mesmo tipo, mas –O em Vontade/calma. Dura até o fim da cena."},{"nome":"Curiosidade Oculta","tipo":"poder","livro":"Sangue","desc":"Pré-req: Int 2. Treino em Ocultismo (ou +2 se já treinado); pode gastar 2 PE num teste de Vontade para usar Ocultismo no lugar."},{"nome":"Especialista Esotérico","tipo":"poder","livro":"Sangue","desc":"Pré-req: Int 3, ritual de 2º círculo, Domínio Esotérico. Pode combinar até 3 catalisadores ritualísticos diferentes num mesmo ritual."},{"nome":"Instintos Urbanos","tipo":"poder","livro":"Sangue","desc":"Pré-req: Agi 2. Treino em Crime (ou +2); em ambiente fechado, Crime DT 20 identifica rota de fuga → ação de movimento extra no 1º turno de fuga + 2 Defesa."},{"nome":"<Habilidade> Aprimorada","tipo":"poder","livro":"Sangue","desc":"Escolhe uma habilidade/ritual com DT; a DT para resistir sobe +2. Repetível; até 2x na mesma (total +5, não +4)."},{"nome":"Ferro Maculado","tipo":"poder","livro":"Sangue","desc":"Ao atacar com arma de disparo, gasta 2 PV para amaldiçoar a munição até o fim do turno: +1d6 dano de Sangue (multiplicado em crítico). Afinidade: +1d8.","elemento":"Sangue"},{"nome":"Placas Sanguinolentas","tipo":"poder","livro":"Sangue","desc":"Pré-req: conjurar ritual de Sangue. Ao conjurar ritual de Sangue, bônus na Defesa igual ao círculo até o início do próximo turno. Afinidade: círculo + 2.","elemento":"Sangue"},{"nome":"Sangue Corrosivo","tipo":"poder","livro":"Sangue","desc":"Ação de movimento + 1 PE: sangue corrosivo até fim da cena; ao sofrer dano de ser adjacente, causa 1d10 Sangue nele. Afinidade: 2d10.","elemento":"Sangue"},{"nome":"Sangue Prazeroso","tipo":"poder","livro":"Sangue","desc":"Pré-req: Sangue 1. Enquanto machucado, resistência a dano 5. Afinidade: +20 PV temporários 1x/cena enquanto machucado.","elemento":"Sangue"},{"nome":"Revidar Violento","tipo":"poder","livro":"Hexatombe I","desc":"Pode fazer uma segunda reação de defesa na mesma rodada, desde que seja um contra-ataque. Pré-req: For 2 ou Agi 2."},{"nome":"Predador Perfeito","tipo":"poder","livro":"Hexatombe I","desc":"Poder de Combatente. Pré-req: veterano em Luta ou Pontaria + Sobrevivência. 1x/rodada, gasta 5 PE para ação padrão adicional de ataque contra alvo em alcance curto que esteja desprevenido, caído ou agarrado."},{"nome":"Dominar Habilidade Ritualística","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req: Escolhido Pelo Outro Lado. Ganha a 1ª habilidade de uma trilha de Ocultista que não é a sua (precisa do NEX). Repetível para 2ª/3ª de outra trilha."},{"nome":"Caçador de Recompensas Aprimorado","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req origem Caçador de Recompensas ou similar. +5 em testes contra condições mentais e de medo."},{"nome":"Especialista em Correntes","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req For 2 ou Agi 2, treinado em Luta. Usa correntes/chicotes/cordas como armas táticas; alcance 3m; pode agarrar com elas."},{"nome":"Puxão Violento","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req For 2 ou Agi 2, treinado em Luta, Especialista em Correntes. Ao acertar com corrente/chicote/corda, gasta 2 PE para puxar alvo adjacente."},{"nome":"Encaixe / Acoplável","tipo":"poder","livro":"Hexatombe I","desc":"Modificação: arma 1 mão leve vira acoplável. Duas armas com Encaixe se unem (ação de movimento) em arma 2 mãos tática: dano de cada +1 dado, crítico/mult +1."},{"nome":"Prática com Materiais Ritualísticos","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2, treinado em Ocultismo, conjurar rituais. Não sofre –O para materiais específicos de uma Entidade na 1ª etapa de conjuração complexa."},{"nome":"Ataque Furtivo Expandido","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req: ter Ataque Furtivo. O bônus de dano de Ataque Furtivo sobe +1d6."},{"nome":"Sombra Viva","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 3, treinado em Furtividade. 1x/cena, ação de movimento + 3 PE: fica invisível até atacar ou fim da cena."},{"nome":"Olhar do Predador","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Pre 2. Ação de movimento + 1 PE: marca um alvo em médio; +5 em testes contra ele até fim da cena."},{"nome":"Reflexos de Aço","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Agi 3. +2 na Defesa e +1 em testes de Reflexos."},{"nome":"Corpo de Pedra","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Vig 3. Resistência a dano físico 2."},{"nome":"Mente de Ferro","tipo":"poder","livro":"Hexatombe I","desc":"Pré-req Int 2 ou Pre 2. Resistência a dano mental 5."},{"nome":"Ambidestria","tipo":"poder","livro":"Hexatombe II","desc":"Pré-req Agi 3, Combater com Duas Armas. Reduz a penalidade de combater com duas armas em 1d."},{"nome":"Entrada Triunfal","tipo":"poder","livro":"Hexatombe II","desc":"Pré-req Pre 2. No 1º turno de combate, ação de movimento grátis + +5 em Intimidação até fim do turno."}];
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
