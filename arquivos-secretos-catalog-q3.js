/* arquivos-secretos-catalog-q3.js */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [{"nome":"Ufólogo","tipo":"origem","livro":"SDOL","desc":"Você sempre soube que não estávamos sozinhos no universo.\n\n**Perícias treinadas.** Ciências e Ocultismo.\n\n**Minha Teoria Absurda.** 1x por interlúdio, teoria sobre a investigação: se boa, 1d4+1 PE temp.; se confirmar na missão, +1 PE máximo permanente."},{"nome":"Funcionário de Beira de Estrada","tipo":"origem","livro":"SDOL","desc":"**Perícias treinadas.** Fortitude e Intuição.\n\n**Turno Invertido.** 1x por missão, benefícios de dormir sem dormir; +2 contra efeitos que tentem deixar inconsciente."},{"nome":"Cientista Ex-Panacea","tipo":"origem","livro":"Panacea","desc":"**Perícias treinadas.** Atualidades e Ciências.\n\n**Existe uma Explicação.** Em teste de Ocultismo, gasta 2 PE para usar Ciências no lugar."},{"nome":"Cobaia Sobrevivente","tipo":"origem","livro":"Panacea","desc":"**Perícias treinadas.** Fortitude e Vontade.\n\n**Forças para Enfrentar.** Trauma de cobaia: cena que toque nele deixa abalado, mas 2 PE concede imunidade a medo até o fim da cena."},{"nome":"Segurança Ex-Panacea","tipo":"origem","livro":"Panacea","desc":"**Perícias treinadas.** Luta e Pontaria.\n\n**Técnicas de Contenção.** Em manobra de combate, gasta 2 PE para +5 no teste."},{"nome":"Exorcizado","tipo":"origem","livro":"Vampyr","desc":"**Perícias treinadas.** Fortitude e Ocultismo.\n\n**O Que Restou.** Escolhe um elemento (exceto Medo); RD 10 contra ele, mas –3 SAN no 1º contato da cena."},{"nome":"Sensitivo Rebelde","tipo":"origem","livro":"Vampyr","desc":"**Perícias treinadas.** Intuição e Vontade.\n\n**Sussurros e Vultos.** Em Diplomacia, Enganação, Intimidação ou Intuição, pode perder 2 SAN para +5 no teste."}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome;
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;
})();
