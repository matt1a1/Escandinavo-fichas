/* arquivos-secretos-catalog-q1.js */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [{"nome":"Agrupador Ritualístico","tipo":"item","livro":"Sangue","desc":"Um item pequeno — não maior que uma faca — e de aparência variada. Você pode gastar uma ação padrão para prender um componente ou um catalisador nele, e pode ter até quatro desses itens presos nele. Componentes e catalisadores presos no agrupador contam como empunhados, desde que o agrupador esteja sendo empunhado. Se você estiver empunhando o agrupador ritualístico, todos os componentes e catalisadores presos nele também contam como empunhados. Ocultistas usam este item para segurar vários componentes e catalisadores com uma só mão.","categoria":"II","espacos":"1"},{"nome":"Amuleto Sinalizador de Elemento","tipo":"item","livro":"Sangue","desc":"Um amuleto que reage à presença de um elemento do Outro Lado. Quando um efeito do elemento escolhido é usado em alcance curto, o amuleto brilha. Você pode gastar uma ação de movimento para sintonizar o amuleto a um elemento diferente.","categoria":"I","espacos":"1"}];
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') root.ARQUIVOS_SECRETOS = [];
  var AS = root.ARQUIVOS_SECRETOS;
  DATA.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === e.tipo && x.nome === e.nome && (x.livro || '') === (e.livro || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;
})();
