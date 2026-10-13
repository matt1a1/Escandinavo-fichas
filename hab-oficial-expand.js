/* hab-oficial-expand.js — textos oficiais do Livro Básico (sem resumo) + formatação */
(function () {
  var M = {
    'Ataque Especial':
      'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5 (veja a Tabela 1.3). Você pode aplicar cada bônus de +5 em ataque ou dano.\n\n**Exemplo:** em NEX 55%, você pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano.',
    'Habilidade de Trilha':
      'Em NEX 10% você escolhe uma das trilhas de sua classe e recebe o primeiro poder da trilha escolhida. Você recebe um novo poder da trilha escolhida em NEX 40%, 65% e 99%.',
    'Poder de Combatente':
      'Em NEX 15%, você recebe um poder de combatente à sua escolha. Você recebe um novo poder de combatente em NEX 30% e a cada 15 pontos de NEX subsequentes, conforme indicado na tabela.',
    'Poder de Especialista':
      'Em NEX 15%, você recebe um poder de especialista à sua escolha. Você recebe um novo poder de especialista em NEX 30% e a cada 15 pontos de NEX subsequentes, conforme indicado na tabela.',
    'Poder de Ocultista':
      'Em NEX 15%, você recebe um poder de ocultista à sua escolha. Você recebe um novo poder de ocultista em NEX 30% e a cada 15 pontos de NEX subsequentes, conforme indicado na tabela.',
    'Aumento de Atributo':
      'Em NEX 20%, 50%, 80% e 95% você recebe +1 em um atributo à sua escolha. Você não pode aumentar um atributo além de 5 desta forma.',
    'Grau de Treinamento':
      'Em NEX 35% e 70%, você sobe um grau de treinamento em uma quantidade de perícias treinadas igual a 1 + Intelecto (Combatente), 5 + Intelecto (Especialista) ou 3 + Intelecto (Ocultista) — de treinado para veterano ou de veterano para expert.',
    'Versatilidade':
      'Em NEX 50%, você escolhe entre um poder de sua classe ou o primeiro poder de outra trilha da mesma classe.',
    'Acuidade com Arma':
      'Quando usa uma arma leve de corpo a corpo ou uma arma de arremesso, você pode usar sua Agilidade em vez de Força nos testes de ataque e rolagens de dano.\n\n*Pré-requisito: Agi 2.*',
    'Armamento Pesado':
      'Você recebe proficiência com armas pesadas.',
    'Artista Marcial':
      'Seus ataques desarmados causam 1d6 pontos de dano, são considerados letais e ágeis. Em NEX 35% o dano sobe para 1d8 e em NEX 70% sobe para 1d10.',
    'Ataque de Oportunidade':
      'Sempre que um inimigo sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para realizar um ataque corpo a corpo contra ele.',
    'Combater com Duas Armas':
      'Se estiver usando duas armas (e pelo menos uma delas for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –1d em todos os testes de ataque até o seu próximo turno.\n\n*Pré-requisitos: Agi 3, treinado em Luta.*',
    'Combate Defensivo':
      'Quando faz a ação agredir, você pode sofrer –1d em todos os testes de ataque até o seu próximo turno para receber +5 na Defesa até o início do seu próximo turno.\n\n*Pré-requisito: Int 2.*',
    'Golpe Demolidor':
      'Quando você quebra um objeto ou ataca um objeto, pode gastar 1 PE para causar +2 dados de dano do mesmo tipo.\n\n*Pré-requisitos: For 2, treinado em Luta.*',
    'Golpe Pesado':
      'Uma arma corpo a corpo que você empunha causa +1 dado de dano do mesmo tipo.',
    'Incansável':
      'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, usando Força ou Agilidade como atributo-base.',
    'Presteza Atlética':
      'Quando você facilita uma investigação, pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base. Se passar, o próximo aliado que usar o bônus também pode usar Força ou Agilidade.',
    'Proteção Pesada':
      'Você recebe proficiência com proteções pesadas.\n\n*Pré-requisito: NEX 30%.',
    'Reflexos Defensivos':
      'Você recebe +2 na Defesa e nos testes de resistência.\n\n*Pré-requisito: Agi 2.*',
    'Saque Rápido':
      'Sacar ou guardar itens passa a ser uma ação livre. Com a regra opcional de munição, uma vez por rodada você pode recarregar uma arma de disparo como uma ação livre.',
    'Segurar o Gatilho':
      'Quando você acerta um ataque com uma arma de fogo, pode atacar novamente o mesmo alvo, pagando 2 PE por cada ataque já feito no turno.\n\n*Pré-requisito: NEX 30%.',
    'Sentido Tático':
      'Como uma ação de movimento, você pode gastar 2 PE. Até o fim da cena, você recebe um bônus na Defesa e nos testes de resistência igual ao seu Intelecto.\n\n*Pré-requisitos: Int 2, treinado em Tática.*',
    'Eclético':
      'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nela.',
    'Perito':
      'Escolha duas perícias treinadas (exceto Luta e Pontaria). Quando faz um teste dessas perícias, você pode gastar 2 PE para rolar +1d6 e somar no resultado. Você pode pagar +1 PE para subir o dado (d8, d10, d12).',
    'Engenhosidade':
      'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para usar Intelecto no lugar do atributo-base.',
    'Balística Avançada':
      'Você recebe proficiência com armas de fogo longas e soma seu Intelecto nas rolagens de dano com essas armas.',
    'Conhecimento Aplicado':
      'Quando faz um teste de Ciências, Investigação, Medicina, Ocultismo ou Tecnologia, você pode gastar 2 PE para rolar novamente o teste.',
    'Escolhido pelo Outro Lado':
      'Você teve uma experiência paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necessários para realizar rituais. Você pode lançar rituais de 1º círculo. À medida que aumenta seu NEX, pode lançar rituais de círculos maiores (2º círculo em NEX 25%, 3º círculo em NEX 55% e 4º círculo em NEX 85%).\n\nVocê começa com três rituais de 1º círculo. Sempre que avança de NEX, aprende um ritual de qualquer círculo que possa lançar. Esses rituais não contam no seu limite de rituais conhecidos.'
  };

  function apply() {
    var c = window.HABILIDADES_CATALOG;
    if (!c || !c.length) return false;
    var n = 0;
    c.forEach(function (h) {
      if (h && h.nome && M[h.nome]) {
        h.desc = M[h.nome];
        n++;
      }
    });
    if (n) console.log('[hab-oficial-expand]', n);
    return n > 0;
  }

  if (!apply()) {
    var t = 0;
    var iv = setInterval(function () {
      if (apply() || ++t > 60) clearInterval(iv);
    }, 120);
  }
})();
