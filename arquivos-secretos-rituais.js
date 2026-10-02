/* arquivos-secretos-rituais.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Passagem de Conhecimento Expandido","tipo":"ritual","livro":"Sangue","desc":"Sangue/Conhecimento, 4º círculo. Só quem já conjura Passagem de Conhecimento. Execução 1 dia · Alcance curto · Até 10 pessoas (número par) · Permanente. Divide alvos em dois grupos; troca de consciência completa. Risco de virar Anulado se aberto cedo demais.","circulo":"4","elemento":"Sangue/Conhecimento"},{"nome":"Mapa Sanguíneo","tipo":"ritual","livro":"Hexatombe I","desc":"Sangue, 2º círculo. Toque numa superfície revela localização de todos os seres num raio de 1km (Vontade). Discente: também revela condição de saúde.","circulo":"2","elemento":"Sangue"},{"nome":"Capturar Momento","tipo":"ritual","livro":"Hexatombe I","desc":"Morte, 2º círculo. Marca ponto invisível que capta imagens/sons em 18m; até 3 símbolos. Discente: pode explodir (4d8 Morte). Verdadeiro: 8d8.","circulo":"2","elemento":"Morte"},{"nome":"Labirinto Mental","tipo":"ritual","livro":"Hexatombe I","desc":"Conhecimento, 2º círculo. Prende a mente do alvo: só se move em direção aleatória por 1d4 rodadas (Vontade libera). Discente: alcance longo. Verdadeiro: alcance longo + duração cena.","circulo":"2","elemento":"Conhecimento"},{"nome":"Rajada Caótica","tipo":"ritual","livro":"Hexatombe I","desc":"Energia, 2º círculo. Raio de 8d6 Energia (Reflexos metade). Discente: 8d8. Verdadeiro: efeito recorrente 8d10 por turno até fim da cena.","circulo":"2","elemento":"Energia"},{"nome":"Backup","tipo":"ritual","livro":"Anfitrião","desc":"Energia, 2º círculo. Execução completa · Alcance curto · Duração 1 dia. Cria chamariz com sua aparência; reação troca de lugar (–2d4 SAN). Discente: permanente + ver/ouvir pela cópia. Verdadeiro: fala pela cópia + troca com explosão 6d6 Energia.","circulo":"2","elemento":"Energia"},{"nome":"Hesitação Forçada","tipo":"ritual","livro":"Panacea","desc":"Sangue/Conhecimento, 1º círculo. Execução padrão · Curto · 1 pessoa · Sustentada · Vontade parcial. No início do turno, Vontade; falha: rerrola o maior dado de qualquer teste até fim do turno. 2 sucessos seguidos encerra. Discente/Verdadeiro com upgrades.","circulo":"1","elemento":"Sangue/Conhecimento"},{"nome":"Vampirismo","tipo":"ritual","livro":"Vampyr","desc":"Ritual de Sangue, 2º círculo.\nExecução: completa · Alcance: toque · Alvo: 1 pessoa · Duração: 1 dia.\n\nEfeito: transforma o corpo de uma pessoa (viva ou morta) numa espécie de \"refeição paranormal\" até o fim da duração. Depois que o efeito acaba, aquele mesmo corpo não pode ser alvo do ritual de novo. Qualquer pessoa que gaste 1 minuto comendo parte do corpo recebe os efeitos dos \"vasos sanguíneos\" que escolher consumir — cada vaso só pode ser consumido uma vez por corpo. Os efeitos duram 1 dia, exceto os instantâneos (como recuperar PV, que já valem na hora).\n\nVasos disponíveis (versão básica):\n• Visão — +2 em testes de ataque\n• Audição — se a pessoa conjurava rituais de 1º círculo, você pode escolher um deles pra conjurar normalmente\n• Paladar — recupera 3d8+3 PV\n• Olfato — +5 em testes para rastrear aquele ser\n• Tato — se a pessoa tem treinamento numa perícia, você escolhe uma pra ficar treinado nela (ou +2 nela, se já for treinado)\n\nDiscente (+7 PE, exige 3º círculo) — mesmos vasos, valores maiores:\n• Visão: +5 em ataque\n• Audição: libera ritual de 2º círculo\n• Paladar: recupera 6d8+6 PV\n• Olfato: +10 para rastrear\n• Tato: dá veterano na perícia (ou +4 se já for veterano)\n\nVerdadeiro (+12 PE, exige 4º círculo e afinidade) — valores máximos:\n• Visão: +10 em ataque\n• Audição: libera ritual de 3º círculo\n• Paladar: recupera 9d8+9 PV\n• Olfato: +15 para rastrear\n• Tato: dá expert na perícia (ou +6 se já for expert)","circulo":"2","elemento":"Sangue"}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var idx = -1;
    for (var i = 0; i < AS.length; i++) {
      if (AS[i].tipo === e.tipo && AS[i].nome === e.nome && (AS[i].livro || '') === (e.livro || '')) {
        idx = i; break;
      }
    }
    if (idx === -1) AS.push(e);
    else AS[idx] = e;
  });
  root.ARQUIVOS_SECRETOS = AS;

  if (typeof RITUAIS_CATALOG !== 'undefined') {
    DATA.forEach(function (e) {
      var found = null;
      for (var i = 0; i < RITUAIS_CATALOG.length; i++) {
        if ((RITUAIS_CATALOG[i].nome || '').toLowerCase() === (e.nome || '').toLowerCase()) {
          found = RITUAIS_CATALOG[i];
          break;
        }
      }
      var payload = {
        nome: e.nome,
        elemento: e.elemento || '',
        circulo: String(e.circulo || ''),
        execucao: e.nome === 'Vampirismo' ? 'Completa' : '',
        alcance: e.nome === 'Vampirismo' ? 'Toque' : '',
        alvo: e.nome === 'Vampirismo' ? '1 pessoa' : '',
        duracao: e.nome === 'Vampirismo' ? '1 dia' : '',
        resistencia: '',
        desc: '[Arquivos Secretos — ' + (e.livro || '') + '] ' + (e.desc || ''),
        efeito: e.desc || '',
        livro: e.livro || 'Arquivos Secretos'
      };
      if (found) {
        Object.assign(found, payload);
      } else {
        RITUAIS_CATALOG.push(payload);
      }
    });
    if (typeof root.renderRitualCatalog === 'function') {
      try { root.renderRitualCatalog(); } catch (err) {}
    }
  }
})();
