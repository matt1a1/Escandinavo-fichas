/** Força textos oficiais dos Poderes Paranormais (Livro Básico, sem resumo) */
(function () {
  var OFICIAIS = [
  // ===== PODERES PARANORMAIS (Livro Básico — texto oficial integral, SEM RESUMO) =====
  { nome: 'Expansão de Conhecimento', classe: 'Poderes Paranormais', categoria: 'Conhecimento', nex: '', pe: '—',
    desc: 'Você se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreensão. Você aprende um poder de classe que não pertença à sua classe (caso o poder possua pré-requisitos, você precisa preenchê-los). Pré: Conhecimento 1. Afinidade: você aprende um segundo poder de classe que não pertença à sua classe.' },
  { nome: 'Percepção Paranormal', classe: 'Poderes Paranormais', categoria: 'Conhecimento', nex: '', pe: '—',
    desc: 'O Conhecimento sussurra em sua mente. Em cenas de investigação, sempre que fizer um teste para procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Você deve aceitar a segunda rolagem, mesmo que seja menor que a primeira. Afinidade: você pode rolar novamente até dois dados com resultado menor que 10.' },
  { nome: 'Precognição', classe: 'Poderes Paranormais', categoria: 'Conhecimento', nex: '', pe: '—',
    desc: 'Você possui um “sexto sentido” que o avisa do perigo antes que ele aconteça. Você recebe +2 em Defesa e em testes de resistência. Pré: Conhecimento 1. Afinidade: você fica imune à condição desprevenido.' },
  { nome: 'Sensitivo', classe: 'Poderes Paranormais', categoria: 'Conhecimento', nex: '', pe: '—',
    desc: 'Você consegue sentir as emoções e intenções de outros seres, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição. Afinidade: quando você faz um teste oposto usando uma dessas perícias, o oponente sofre −1d.' },
  { nome: 'Visão do Oculto', classe: 'Poderes Paranormais', categoria: 'Conhecimento', nex: '', pe: '—',
    desc: 'Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente. Você recebe +5 em testes de Percepção e enxerga no escuro. Afinidade: você ignora camuflagem.' },
  { nome: 'Afortunado', classe: 'Poderes Paranormais', categoria: 'Energia', nex: '', pe: '—',
    desc: 'A Energia considera resultados medíocres entediantes. Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20. Afinidade: além disso, uma vez por teste, você pode rolar novamente um resultado 1 em d20.' },
  { nome: 'Campo Protetor', classe: 'Poderes Paranormais', categoria: 'Energia', nex: '', pe: '1 PE',
    desc: 'Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa. Pré: Energia 1. Afinidade: quando usa este poder, você também recebe +5 em Reflexos e, até o início do seu próximo turno, se passar em um teste de Reflexos que reduziria o dano à metade, em vez disso não sofre nenhum dano.' },
  { nome: 'Causalidade Fortuita', classe: 'Poderes Paranormais', categoria: 'Energia', nex: '', pe: '—',
    desc: 'A Energia o conduz rumo a descobertas. Em cenas de investigação, a DT para procurar pistas diminui em −5 para você até você encontrar uma pista. Afinidade: a DT para procurar pistas sempre diminui em −5 para você.' },
  { nome: 'Golpe de Sorte', classe: 'Poderes Paranormais', categoria: 'Energia', nex: '', pe: '—',
    desc: 'Seus ataques recebem +1 na margem de ameaça. Pré: Energia 1. Afinidade: seus ataques recebem +1 no multiplicador de crítico.' },
  { nome: 'Manipular Entropia', classe: 'Poderes Paranormais', categoria: 'Energia', nex: '', pe: '2 PE',
    desc: 'Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior. Quando outro ser em alcance curto faz um teste de perícia, você pode gastar 2 PE para forçá-lo a rolar novamente. Você deve usar este poder antes de o mestre anunciar o resultado. Pré: Energia 1. Afinidade: você pode gastar 2 PE para fazer o alvo rolar novamente todos os dados do teste.' },
  { nome: 'Encarar a Morte', classe: 'Poderes Paranormais', categoria: 'Morte', nex: '', pe: '—',
    desc: 'Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seu limite de gasto de PE por turno aumenta em +1. Afinidade: o limite aumenta em +2 em vez de +1.' },
  { nome: 'Escapar da Morte', classe: 'Poderes Paranormais', categoria: 'Morte', nex: '', pe: '—',
    desc: 'A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV ou menos, você pode gastar uma quantidade de PE igual à metade do dano (arredondada para cima) para ficar com 1 PV. Afinidade: você fica com uma quantidade de PV igual ao PE gasto, até no máximo 10 PV.' },
  { nome: 'Potencial Aprimorado', classe: 'Poderes Paranormais', categoria: 'Morte', nex: '', pe: '—',
    desc: 'A Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo. Ex.: se escolher este poder em NEX 50%, recebe 10 PE; ao subir para 55%, recebe +1 PE, e assim por diante. Afinidade: você recebe +2 PE por NEX.' },
  { nome: 'Potencial Reaproveitado', classe: 'Poderes Paranormais', categoria: 'Morte', nex: '', pe: '—',
    desc: 'Você absorve os momentos desperdiçados de outros seres. Uma vez por rodada, quando passa num teste de resistência, você recupera 1 PE. Afinidade: recupera 2 PE em vez de 1.' },
  { nome: 'Surto Temporal', classe: 'Poderes Paranormais', categoria: 'Morte', nex: '', pe: '3 PE',
    desc: 'A sua percepção temporal se torna distorcida e espiralizada, fazendo com que a noção de passagem do tempo nunca mais seja a mesma para você. Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional. Pré: Morte 2. Afinidade: em vez disso, você faz um turno inteiro adicional no final do seu turno.' },
  { nome: 'Anatomia Insana', classe: 'Poderes Paranormais', categoria: 'Sangue', nex: '', pe: '—',
    desc: 'O seu corpo é transfigurado e parece desenvolver um instinto próprio separado da sua consciência. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. Pré: Sangue 1. Afinidade: em vez disso, você é imune aos efeitos de acerto crítico e ataque furtivo.' },
  { nome: 'Arma de Sangue', classe: 'Poderes Paranormais', categoria: 'Sangue', nex: '', pe: '2 PE',
    desc: 'O Sangue devora parte de seu corpo e se manifesta como parte de você. Ação de movimento + 2 PE: produz garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. Ela é considerada uma arma simples leve especial. Quando você usa a ação atacar, pode gastar 1 PE para fazer um ataque corpo a corpo adicional com essa arma. Dura até o fim da cena. Afinidade: a arma se torna permanente e causa 1d10 de dano de Sangue.' },
  { nome: 'Sangue de Ferro', classe: 'Poderes Paranormais', categoria: 'Sangue', nex: '', pe: '—',
    desc: 'O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo. Ex.: se escolher este poder em NEX 50%, recebe 20 PV; ao subir para 55%, recebe +2 PV, e assim por diante. Afinidade: você recebe +5 em Fortitude e se torna imune a venenos e doenças.' },
  { nome: 'Sangue Fervente', classe: 'Poderes Paranormais', categoria: 'Sangue', nex: '', pe: '—',
    desc: 'A intensidade da dor desperta em você sentimentos bestiais e prazerosos. Enquanto estiver machucado, você recebe +1 em Agilidade ou Força, à sua escolha (escolha sempre que este efeito for ativado). Pré: Sangue 2. Afinidade: o bônus em Agilidade ou Força aumenta para +2.' },
  { nome: 'Sangue Vivo', classe: 'Poderes Paranormais', categoria: 'Sangue', nex: '', pe: '—',
    desc: 'A carnificina não pode parar, o Sangue precisa continuar fluindo. Na primeira vez que ficar machucado durante uma cena, você recebe Cura Acelerada 2. Esse efeito nunca cura você acima da metade dos PV máximos (você nunca deixa de estar machucado) e termina no fim da cena ou caso você perca a condição machucado. Afinidade: a Cura Acelerada aumenta para 5.' },
  { nome: 'Aprender Ritual', classe: 'Poderes Paranormais', categoria: 'Varia', nex: '', pe: '—',
    desc: 'Através de uma conexão com as memórias de ocultistas do passado e os segredos das Entidades, você aprende e pode lançar um Ritual de 1º Círculo à sua escolha. Você pode escolher esse poder quantas vezes quiser, mas ainda está sujeito ao limite de rituais conhecidos. Quando aprende um Ritual novo através desse poder você pode escolher substituir um ritual que já conhece. A partir de 45% de NEX, quando comprar esse poder, você pode aprender um Ritual de 2º Círculo e, a partir de 75% de NEX, pode aprender um Ritual de 3º Círculo. Rituais aprendidos dessa forma contam como poderes do elemento do ritual.' },
  { nome: 'Resistir a <Elemento>', classe: 'Poderes Paranormais', categoria: 'Varia', nex: '', pe: '—',
    desc: 'Escolha entre Conhecimento, Energia, Morte ou Sangue. Você recebe Resistência Paranormal 5 contra efeitos desse elemento. Este poder conta como um poder do elemento escolhido. Afinidade: aumenta a Resistência concedida por esse poder para 10.' }
  ];
  function apply() {
    var cat = (typeof HABILIDADES_CATALOG !== 'undefined' && Array.isArray(HABILIDADES_CATALOG))
      ? HABILIDADES_CATALOG
      : (window.HABILIDADES_CATALOG_EXTRA || null);
    if (!cat) return false;
    for (var i = cat.length - 1; i >= 0; i--) {
      var h = cat[i];
      if (!h) continue;
      if (h.classe === 'Poderes Paranormais') { cat.splice(i, 1); continue; }
      var wrong = ['Conhecimento Primordial','Expandir Conhecimento','Ler Fímbria','Mercador da Ordem',
        'Atrair Energia','Descarga','Eletrocussão','Velocidade Sobrenatural','Consumir Alma','Olfato Mortal',
        'Sangue Frio','Zumbificar','Armamento Ostentação','Escudo de Sangue','Sangue Fermentado','Sede de Sangue','Vampirismo'];
      if (wrong.indexOf(h.nome) >= 0 && (!h.classe || h.classe === '')) cat.splice(i, 1);
    }
    OFICIAIS.forEach(function (p) { cat.push(p); });
    console.log('[poderes-oficiais] ' + OFICIAIS.length + ' poderes com texto integral');
    return true;
  }
  var n = 0;
  var iv = setInterval(function () {
    if (apply() || ++n > 40) clearInterval(iv);
  }, 200);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
