/* arquivos-secretos-catalog-q2.js */
(function () {
  var root = typeof window !== 'undefined' ? window : this;
  var DATA = [{"nome":"Forma Suprema (As Máscaras)","tipo":"regra","livro":"Hexatombe I","desc":"Ativar: ação de movimento + 6 SAN (+2 SAN/rodada extra). Ganha +20 PV, +10 PE, +10 Defesa, dano +2 dados, +5 em testes, +5 DT, até 3 habilidades novas/extras. Desativar ação livre (risco de morrendo se <20 PV)."},{"nome":"Garra do Harpia","tipo":"item","livro":"Hexatombe II","desc":"Arma tática corpo a corpo."},{"nome":"Bloody Mary Batizada","tipo":"item","livro":"Hexatombe II","desc":"Item paranormal de Sangue."},{"nome":"Paçoca","tipo":"item","livro":"Hexatombe II","desc":"Consumível."},{"nome":"Crânio Dominador","tipo":"item","livro":"Hexatombe II","desc":"Item paranormal."},{"nome":"Gaiola do Corvo","tipo":"item","livro":"Hexatombe II","desc":"Item paranormal."},{"nome":"Camiseta Psikolera","tipo":"item","livro":"Hexatombe II","desc":"Vestimenta."},{"nome":"Dupla Obsessiva (Maça + Florete)","tipo":"item","livro":"Hexatombe II","desc":"Par de armas."},{"nome":"Armaduras de Guevara","tipo":"item","livro":"Hexatombe II","desc":"Proteção."},{"nome":"Influencer Paranormal","tipo":"origem","livro":"Anfitrião","desc":"De início, você nunca acreditou nas lendas urbanas e vídeos de fantasmas, então resolveu se aproveitar daqueles que acreditam. Foi produzindo conteúdos falsos e duvidosos para a internet que você descobriu a dura verdade por trás da Membrana.\n\n**Perícias treinadas.** Enganação e Tecnologia.\n\n**Registrar o Paranormal.** Uma vez por cena, você pode gastar uma ação padrão e 2 PE para criar um registro de uma criatura paranormal ou ritual."},{"nome":"Caçador de Recompensas","tipo":"origem","livro":"Anfitrião","desc":"Sua sede pelo dinheiro fácil sempre te guiou.\n\n**Perícias treinadas.** Crime e Investigação.\n\n**Quem Não Arrisca, Não Petisca.** 1x por cena, ao fazer um teste com alguma penalidade, pode ignorar a penalidade."},{"nome":"Granada Ctrl+C Ctrl+V","tipo":"item","livro":"Anfitrião","desc":"Granada especial."}];
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
