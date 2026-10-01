/* arquivos-secretos-rituais.js */
(function () {
  var root = typeof window !== 'undefined' ? window : globalThis;
  var DATA = [{"nome":"Passagem de Conhecimento Expandido","tipo":"ritual","livro":"Sangue","desc":"Sangue/Conhecimento, 4º círculo. Só quem já conjura Passagem de Conhecimento. Execução 1 dia · Alcance curto · Até 10 pessoas (número par) · Permanente. Divide alvos em dois grupos; troca de consciência completa. Risco de virar Anulado se aberto cedo demais.","circulo":"4","elemento":"Sangue/Conhecimento"},{"nome":"Mapa Sanguíneo","tipo":"ritual","livro":"Hexatombe I","desc":"Sangue, 2º círculo. Toque numa superfície revela localização de todos os seres num raio de 1km (Vontade). Discente: também revela condição de saúde.","circulo":"2","elemento":"Sangue"},{"nome":"Capturar Momento","tipo":"ritual","livro":"Hexatombe I","desc":"Morte, 2º círculo. Marca ponto invisível que capta imagens/sons em 18m; até 3 símbolos. Discente: pode explodir (4d8 Morte). Verdadeiro: 8d8.","circulo":"2","elemento":"Morte"},{"nome":"Labirinto Mental","tipo":"ritual","livro":"Hexatombe I","desc":"Conhecimento, 2º círculo. Prende a mente do alvo: só se move em direção aleatória por 1d4 rodadas (Vontade libera). Discente: alcance longo. Verdadeiro: alcance longo + duração cena.","circulo":"2","elemento":"Conhecimento"},{"nome":"Rajada Caótica","tipo":"ritual","livro":"Hexatombe I","desc":"Energia, 2º círculo. Raio de 8d6 Energia (Reflexos metade). Discente: 8d8. Verdadeiro: efeito recorrente 8d10 por turno até fim da cena.","circulo":"2","elemento":"Energia"},{"nome":"Backup","tipo":"ritual","livro":"Anfitrião","desc":"Energia, 2º círculo. Execução completa · Alcance curto · Duração 1 dia. Cria chamariz com sua aparência; reação troca de lugar (–2d4 SAN). Discente: permanente + ver/ouvir pela cópia. Verdadeiro: fala pela cópia + troca com explosão 6d6 Energia.","circulo":"2","elemento":"Energia"},{"nome":"Hesitação Forçada","tipo":"ritual","livro":"Panacea","desc":"Sangue/Conhecimento, 1º círculo. Execução padrão · Curto · 1 pessoa · Sustentada · Vontade parcial. No início do turno, Vontade; falha: rerrola o maior dado de qualquer teste até fim do turno. 2 sucessos seguidos encerra. Discente/Verdadeiro com upgrades.","circulo":"1","elemento":"Sangue/Conhecimento"},{"nome":"Vampirismo","tipo":"ritual","livro":"Vampyr","desc":"Sangue, 2º círculo. Execução completa · Toque · 1 pessoa · 1 dia. Transforma corpo em refeição paranormal; quem come um vaso recebe efeito (Visão/Audição/Paladar/Olfato/Tato). Discente e Verdadeiro aumentam valores.","circulo":"2","elemento":"Sangue"}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;

  if (typeof RITUAIS_CATALOG !== 'undefined') {
    DATA.forEach(function (e) {
      var exists = RITUAIS_CATALOG.some(function (r) { return (r.nome || '').toLowerCase() === (e.nome || '').toLowerCase(); });
      if (exists) return;
      RITUAIS_CATALOG.push({
        nome: e.nome,
        elemento: e.elemento || '',
        circulo: String(e.circulo || ''),
        execucao: '',
        alcance: '',
        alvo: '',
        duracao: '',
        resistencia: '',
        desc: '[Arquivos Secretos — ' + (e.livro || '') + '] ' + (e.desc || ''),
        efeito: e.desc || '',
        livro: e.livro || 'Arquivos Secretos'
      });
    });
    if (typeof root.renderRitualCatalog === 'function') {
      try { root.renderRitualCatalog(); } catch (err) {}
    }
  }
})();
