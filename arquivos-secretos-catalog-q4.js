/* arquivos-secretos-catalog-q4.js */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [{"nome":"Treinado pela Hell Hunters","tipo":"origem","livro":"Hellhunters","desc":"**Perícias treinadas.** Escolha entre Luta e Fortitude ou Pontaria e Reflexos.\n\n**Resistência do Treinamento.** Se Luta+Fortitude: +2 PV no NEX 5% e +1 PV a cada 10% de NEX. Se Pontaria+Reflexos: +1 PE no NEX 5% e +1 PE a cada 10% de NEX."},{"nome":"Veterano de Conflito Armado","tipo":"origem","livro":"Hellhunters","desc":"**Perícias treinadas.** Luta e Pontaria.\n\n**Full Metal Jacket.** Quando faz um teste de Luta ou Pontaria com alguma penalidade, gasta 2 PE para ignorar a penalidade nesse teste."}];
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
