// RITUAIS_CATALOG — descrições no padrão do livro (Normal / Discente / Verdadeiro)
// Resumos mecânicos públicos; use o livro oficial Jambô para texto completo.
const RITUAIS_CATALOG = [
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '',
    efeito: 'Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.',
    dados: 'Normal: +1d6', dadosDiscente: 'Discente (+2 PE): +2d6. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.',
    desc: 'Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.\n\nDiscente (+2 PE): muda o bônus de dano para +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o bônus de dano para +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você imbui a arma ou munições com Energia, fazendo com que causem +1d6 de dano de Energia.',
    dados: 'Normal: +1d6 Energia', dadosDiscente: 'Discente (+2 PE): +2d6. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.',
    desc: 'Você imbui a arma ou munições com Energia, fazendo com que causem +1d6 de dano de Energia.\n\nDiscente (+2 PE): muda o bônus de dano para +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o bônus de dano para +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você imbui a arma ou munições com Morte, fazendo com que causem +1d6 de dano de Morte.',
    dados: 'Normal: +1d6 Morte', dadosDiscente: 'Discente (+2 PE): +2d6. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.',
    desc: 'Você imbui a arma ou munições com Morte, fazendo com que causem +1d6 de dano de Morte.\n\nDiscente (+2 PE): muda o bônus de dano para +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o bônus de dano para +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você imbui a arma ou munições com Sangue, fazendo com que causem +1d6 de dano de Sangue.',
    dados: 'Normal: +1d6 Sangue', dadosDiscente: 'Discente (+2 PE): +2d6. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.',
    desc: 'Você imbui a arma ou munições com Sangue, fazendo com que causem +1d6 de dano de Sangue.\n\nDiscente (+2 PE): muda o bônus de dano para +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o bônus de dano para +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Tecnologia', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 acessório ou arma de fogo', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modificação a sua escolha.',
    dados: 'Normal: 1 modificação', dadosDiscente: 'Discente (+2 PE): 2 modificações. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): 3 modificações. Requer 3º círculo e afinidade.',
    desc: 'Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modificação a sua escolha.\n\nDiscente (+2 PE): muda para duas modificações. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda para três modificações. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Arma Atroz', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 arma corpo a corpo', duracao: 'Sustentada',
    resistencia: '',
    efeito: 'A arma é recoberta por veias carmesim e passa a exalar uma aura de violência. Ela fornece +2 em testes de ataque e +1 na margem de ameaça.',
    dados: 'Normal: +2 ataque, +1 ameaça', dadosDiscente: 'Discente (+2 PE): +5 em testes de ataque. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): +5 ataque, +2 ameaça e +2 no multiplicador de crítico. Requer 3º círculo e afinidade.',
    desc: 'A arma é recoberta por veias carmesim e passa a exalar uma aura de violência. Ela fornece +2 em testes de ataque e +1 na margem de ameaça.\n\nDiscente (+2 PE): muda o bônus para +5 em testes de ataque. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o bônus para +5 em testes de ataque e +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Armadura de Sangue', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça que fornece +5 em Defesa. Esse bônus é cumulativo com outros rituais, mas não com bônus fornecido por equipamento.',
    dados: 'Normal: +5 Defesa', dadosDiscente: 'Discente (+5 PE): +10 Defesa e resistência a balístico, corte, impacto e perfuração 5. Requer 3º círculo.', dadosVerdadeiro: 'Verdadeiro (+9 PE): +15 Defesa e resistência a balístico, corte, impacto e perfuração 10. Requer 4º círculo e afinidade.',
    desc: 'Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça que fornece +5 em Defesa. Esse bônus é cumulativo com outros rituais, mas não com bônus fornecido por equipamento.\n\nDiscente (+5 PE): muda o efeito para “fornece +10 na Defesa e resistência a balístico, corte, impacto e perfuração 5”. Requer 3º círculo.\n\nVerdadeiro (+9 PE): muda o efeito para “fornece +15 na Defesa e resistência a balístico, corte, impacto e perfuração 10”. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Cicatrização', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'Você acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente.',
    dados: 'Normal: 3d8+3 PV (envelhece 1 ano)', dadosDiscente: 'Discente (+2 PE): 5d8+5 PV. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+9 PE): alcance curto; forma ampliada.',
    desc: 'Você acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente.\n\nDiscente (+2 PE): aumenta a cura para 5d8+5 PV. Requer 2º círculo.\n\nVerdadeiro (+9 PE): muda o alcance para curto e amplia o efeito (consultar livro oficial).'
  },
  {
    nome: 'Compreensão Paranormal', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você entende qualquer linguagem escrita ou falada da Realidade.',
    dados: 'Normal: compreende linguagens', dadosDiscente: 'Discente (+2 PE): alcance curto, alvos escolhidos. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): fala, entende e escreve qualquer idioma humano. Requer 3º círculo.',
    desc: 'Você entende qualquer linguagem escrita ou falada da Realidade.\n\nDiscente (+2 PE): muda o alcance para curto e o alvo para alvos escolhidos. Requer 2º círculo.\n\nVerdadeiro (+5 PE): em vez do normal, você pode falar, entender e escrever qualquer idioma humano. Requer 3º círculo.'
  },
  {
    nome: 'Consumir Manancial', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'Você suga uma pequena porção do tempo de vida de plantas, insetos e até mesmo do solo ao redor, gerando Lodo e recebendo 3d6 pontos de vida temporários. Os PV temporários desaparecem ao final da cena.',
    dados: 'Normal: 3d6 PV temporários', dadosDiscente: 'Discente (+2 PE): 6d6 PV temporários. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): área esfera; forma ampliada.',
    desc: 'Você suga uma pequena porção do tempo de vida de plantas, insetos e até mesmo do solo ao redor, gerando Lodo e recebendo 3d6 pontos de vida temporários. Os PV temporários desaparecem ao final da cena.\n\nDiscente (+2 PE): muda os PV temporários recebidos para 6d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o alvo para área (esfera) e amplia o efeito (consultar livro oficial).'
  },
  {
    nome: 'Decadência', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude reduz à metade',
    efeito: 'Espirais de trevas envolvem sua mão e definham o alvo, que sofre 2d8+2 pontos de dano de Morte.',
    dados: 'Normal: 2d8+2 Morte', dadosDiscente: 'Discente (+2 PE): 3d8+3, sem resistência; pode ir na arma', dadosVerdadeiro: 'Verdadeiro (+5 PE): explosão 6m, 8d8+8. Requer 3º círculo.',
    desc: 'Espirais de trevas envolvem sua mão e definham o alvo, que sofre 2d8+2 pontos de dano de Morte.\n\nDiscente (+2 PE): muda a resistência para “nenhuma” e o dano para 3d8+3. Como parte da execução do ritual, você transfere as espirais para uma arma e faz um ataque corpo a corpo contra o alvo com esta arma. Se acertar, causa o dano da arma e do ritual, somados.\n\nVerdadeiro (+5 PE): muda o alcance para pessoal, o alvo para área (explosão com 6m de raio) e o dano para 8d8+8. As espirais afetam todos os seres na área. Requer 3º círculo.'
  },
  {
    nome: 'Definhar', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Fortitude parcial',
    efeito: 'Você dispara uma lufada de cinzas que drena as forças do alvo. O alvo fica fatigado. Se passar no teste de resistência, em vez disso fica vulnerável.',
    dados: 'Normal: fatigado (ou vulnerável se passar)', dadosDiscente: 'Discente (+2 PE): exausto (ou fatigado se passar). Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): até 5 seres. Requer 3º círculo e afinidade com Morte.',
    desc: 'Você dispara uma lufada de cinzas que drena as forças do alvo. O alvo fica fatigado. Se passar no teste de resistência, em vez disso fica vulnerável.\n\nDiscente (+2 PE): em vez do normal, o alvo fica exausto. Se passar na resistência, fica fatigado. Requer 2º círculo.\n\nVerdadeiro (+5 PE): como discente, mas muda o alvo para até 5 seres. Requer 3º círculo e afinidade com Morte.'
  },
  {
    nome: 'Eletrocussão', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Reflexos reduz à metade',
    efeito: 'Você descarrega uma corrente voltaica no alvo. O alvo sofre 4d6 pontos de dano de Energia (Reflexos reduz à metade).',
    dados: 'Normal: 4d6 Energia', dadosDiscente: 'Discente: dano maior / mais alvos', dadosVerdadeiro: 'Verdadeiro (+7 PE): 8d6. Requer 3º círculo.',
    desc: 'Você descarrega uma corrente voltaica no alvo. O alvo sofre 4d6 pontos de dano de Energia (Reflexos reduz à metade).\n\nDiscente: aumenta o dano ou o número de alvos (consultar livro oficial).\n\nVerdadeiro (+7 PE): muda o dano para 8d6. Requer 3º círculo.'
  },
  {
    nome: 'Embaralhar', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você cria cópias ilusórias que confundem atacantes. Um oponente deve ver as cópias para ser confundido. Você recebe bônus em Defesa.',
    dados: 'Normal: cópias / bônus Defesa', dadosDiscente: 'Discente (+2 PE): 5 cópias (+10 Defesa). Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): 8 cópias (+16 Defesa); destruir cópia ofusca 1 rodada. Requer 3º círculo.',
    desc: 'Você cria cópias ilusórias que confundem atacantes. Um oponente deve ver as cópias para ser confundido. Se você estiver invisível, ou o atacante fechar os olhos, você não recebe o bônus (mas o atacante sofre as penalidades normais por não enxergar).\n\nDiscente (+2 PE): muda o número de cópias para 5 (e o bônus na Defesa para +10). Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o número de cópias para 8 (e o bônus na Defesa para +16). Além do normal, toda vez que uma cópia é destruída, emite um clarão de luz. O ser que destruiu a cópia fica ofuscado por uma rodada. Requer 3º círculo.'
  },
  {
    nome: 'Enfeitiçar', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: 'Vontade anula',
    efeito: 'Este ritual torna o alvo prestativo. Ele não fica sob seu controle, mas percebe suas palavras e ações da maneira mais favorável possível.',
    dados: 'Normal: prestativo', dadosDiscente: 'Discente (+2 PE): sugere uma ação aceitável. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): afeta todos no alcance. Requer 3º círculo.',
    desc: 'Este ritual torna o alvo prestativo. Ele não fica sob seu controle, mas percebe suas palavras e ações da maneira mais favorável possível.\n\nDiscente (+2 PE): em vez do normal, você sugere uma ação para o alvo e ele obedece. A sugestão deve parecer aceitável, a critério do mestre. Requer 2º círculo.\n\nVerdadeiro (+5 PE): afeta todos os alvos dentro do alcance. Requer 3º círculo.'
  },
  {
    nome: 'Esfolar', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Reflexos parcial',
    efeito: 'Você usa seu corpo como passagem para o Sangue, projetando agulhas e lâminas rubras praticamente imperceptíveis contra o alvo. O ser sofre 3d4+3 pontos de dano de corte e fica sangrando. Se passar no teste de resistência, sofre apenas metade do dano e evita a condição.',
    dados: 'Normal: 3d4+3 corte + sangrando', dadosDiscente: 'Discente (+2 PE): alcance médio, 5d4+5, explosão 6m. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): alcance longo, 10d4+10, explosão 6m; passar não evita condição. Requer 3º círculo.',
    desc: 'Você usa seu corpo como passagem para o Sangue, projetando agulhas e lâminas rubras praticamente imperceptíveis contra o alvo. O ser sofre 3d4+3 pontos de dano de corte e fica sangrando. Se passar no teste de resistência, sofre apenas metade do dano e evita a condição.\n\nDiscente (+2 PE): muda o alcance para médio, o dano para 5d4+5 e o alvo para explosão com 6m de raio. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda o alcance para longo, o dano para 10d4+10 e o alvo para explosão com 6m de raio. Passar no teste de resistência não evita a condição. Requer 3º círculo.'
  },
  {
    nome: 'Alterar Memória', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 pessoa', duracao: 'Instantânea',
    resistencia: 'Vontade anula',
    efeito: 'Você invade a mente do alvo e altera ou apaga suas memórias recentes.',
    dados: 'Normal: memórias recentes', dadosDiscente: 'Discente: até 1d4 dias', dadosVerdadeiro: 'Verdadeiro (+4 PE): até 24 horas atrás. Requer 4º círculo.',
    desc: 'Você invade a mente do alvo e altera ou apaga suas memórias recentes.\n\nDiscente: pode afetar memórias de até 1d4 dias.\n\nVerdadeiro (+4 PE): você pode alterar ou apagar memórias de até 24 horas atrás. Requer 4º círculo.'
  },
  {
    nome: 'Controle Mental', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio', area: '', alvo: '1 pessoa ou animal', duracao: 'Sustentada',
    resistencia: 'Vontade parcial',
    efeito: 'Você domina a mente do alvo, que obedece todos os seus comandos, exceto ordens suicidas. Um alvo tem direito a um teste de Vontade no final de cada um de seus turnos para se livrar do efeito. Alvos que passarem no teste ficam pasmos por 1 rodada (apenas uma vez por cena).',
    dados: 'Normal: controle 1 alvo', dadosDiscente: 'Discente (+5 PE): até 5 pessoas ou animais', dadosVerdadeiro: 'Verdadeiro (+10 PE): até 10 pessoas ou animais. Requer afinidade com Conhecimento.',
    desc: 'Você domina a mente do alvo, que obedece todos os seus comandos, exceto ordens suicidas. Um alvo tem direito a um teste de Vontade no final de cada um de seus turnos para se livrar do efeito. Alvos que passarem no teste ficam pasmos por 1 rodada (apenas uma vez por cena).\n\nDiscente (+5 PE): muda o alvo para até cinco pessoas ou animais.\n\nVerdadeiro (+10 PE): muda o alvo para até dez pessoas ou animais. Requer afinidade com Conhecimento.'
  },
  {
    nome: 'Convocação Instantânea', circulo: '3', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Ilimitado', area: '', alvo: '1 objeto de até 2 espaços', duracao: 'Instantânea',
    resistencia: 'Vontade anula',
    efeito: 'Você invoca um objeto de qualquer lugar para sua mão. O item deve ter sido previamente preparado.',
    dados: 'Normal: objeto até 2 espaços', dadosDiscente: 'Discente (+4 PE): objeto até 10 espaços', dadosVerdadeiro: 'Verdadeiro (+9 PE): forma ampliada',
    desc: 'Você invoca um objeto de qualquer lugar para sua mão. O item deve ter sido previamente preparado.\n\nDiscente (+4 PE): muda o alvo para um objeto de até 10 espaços.\n\nVerdadeiro (+9 PE): amplia ainda mais o alvo (consultar livro oficial).'
  },
  {
    nome: 'Esconder dos Olhos', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Livre', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: '1 rodada',
    resistencia: '',
    efeito: 'Você fica invisível, incluindo seu equipamento, recebendo camuflagem total e +15 em testes de Furtividade. Seres que não possam vê-lo ficam desprevenidos contra seus ataques.',
    dados: 'Normal: invisível 1 rodada, +15 Furtividade', dadosDiscente: 'Discente (+3 PE): duração sustentada; esfera de invisibilidade', dadosVerdadeiro: 'Verdadeiro (+7 PE): toque, 1 ser, sustentada; não dissipa com ataque. Requer 4º círculo e afinidade.',
    desc: 'Você fica invisível, incluindo seu equipamento, recebendo camuflagem total e +15 em testes de Furtividade. Seres que não possam vê-lo ficam desprevenidos contra seus ataques.\n\nDiscente (+3 PE): muda a duração para sustentada. Em vez do normal, você gera uma esfera de invisibilidade.\n\nVerdadeiro (+7 PE): muda a execução para ação padrão, o alcance para toque, o alvo para 1 ser e a duração para sustentada. O efeito não é dissipado caso o alvo faça um ataque ou ação hostil. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Invadir Mente', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio ou toque', area: '', alvo: '1 ser ou 2 pessoas voluntárias', duracao: 'Instantânea ou 1 dia',
    resistencia: 'Vontade parcial',
    efeito: 'Você pode escolher rajada mental (dano) ou ligação telepática entre duas pessoas.',
    dados: 'Normal: rajada ou ligação telepática', dadosDiscente: 'Discente (+3 PE): dano maior / ligação 1h. Requer 3º círculo.', dadosVerdadeiro: 'Verdadeiro (+7 PE): 10d6 em seres escolhidos / vínculo com até 5 pessoas. Requer 4º círculo.',
    desc: 'Você invade a mente do alvo. Pode escolher rajada mental (dano mental) ou ligação telepática entre duas pessoas (você pode ser uma delas) por 1 dia.\n\nDiscente (+3 PE): se escolher rajada mental, aumenta o dano; se ligação telepática, duração de 1 hora. Requer 3º círculo.\n\nVerdadeiro (+7 PE): se rajada mental, dano 10d6 em seres escolhidos; se ligação, vínculo entre até 5 pessoas. Requer 4º círculo.'
  },
  {
    nome: 'Inexistir', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Vontade parcial',
    efeito: 'Este é um ritual extremamente cruel. Você toca o alvo com a intenção de apagá-lo por completo da existência. Independente do resultado do teste de resistência, se os PV do alvo forem reduzidos a 0 ou menos, ele será completamente apagado.',
    dados: 'Normal: dano alto de Conhecimento', dadosDiscente: 'Discente (+5 PE): 15d12+15 (resistido 3d12)', dadosVerdadeiro: 'Verdadeiro (+10 PE): 20d12+20 (resistido 4d12). Requer afinidade.',
    desc: 'Este é um ritual extremamente cruel, que já condenou grandes agentes da Ordem ao oblívio. Você toca o alvo com a intenção de apagá-lo por completo da existência. Independente do resultado do teste de resistência, se os PV do alvo forem reduzidos a 0 ou menos, ele será completamente apagado, não restando nenhum traço de sua existência.\n\nDiscente (+5 PE): muda o dano para 15d12+15 e o dano resistido para 3d12.\n\nVerdadeiro (+10 PE): muda o dano para 20d12+20 e o dano resistido para 4d12. Requer afinidade.'
  },
  {
    nome: 'Ouvir os Sussurros', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'O ritual conecta você com os sussurros e memórias ecoadas pelo Outro Lado, que você pode consultar para receber conhecimento proibido sobre uma pergunta.',
    dados: 'Normal: 1 pergunta (sim/não/ninguém sabe)', dadosDiscente: 'Discente (+2 PE): pergunta sobre evento em até 1 dia. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro (+5 PE): 5 rodadas, 1 pergunta por rodada. Execução 10 min.',
    desc: 'O ritual conecta você com os sussurros, memórias ecoadas pelo Outro Lado, que você pode consultar para receber conhecimento proibido em relação a uma pergunta respondível com sim, não ou ninguém sabe.\n\nDiscente (+2 PE): muda a execução para 1 minuto. Em vez do normal, você consulta os ecos sobre um evento que poderá acontecer até um dia no futuro. Requer 2º círculo.\n\nVerdadeiro (+5 PE): muda a execução para 10 minutos e a duração para 5 rodadas. Você pode fazer uma pergunta por rodada.'
  },
  {
    nome: 'Proteção contra Rituais', circulo: '2', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Pessoal / Toque', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: '',
    efeito: 'O alvo recebe resistência a dano paranormal 5 e +5 em testes de resistência contra rituais e habilidades de criaturas paranormais.',
    dados: 'Normal: resist. paranormal 5 e +5 em testes', dadosDiscente: 'Discente (+3 PE): até 5 seres tocados. Requer 3º círculo.', dadosVerdadeiro: 'Verdadeiro (+6 PE): resist. 10 e +10 em testes; até 5 seres.',
    desc: 'O alvo recebe resistência a dano paranormal 5 e +5 em testes de resistência contra rituais e habilidades de criaturas paranormais.\n\nDiscente (+3 PE): muda o alvo para até 5 seres tocados. Requer 3º círculo.\n\nVerdadeiro (+6 PE): muda o alvo para até 5 seres tocados, a resistência a dano para 10 e o bônus em testes de resistência para +10.'
  },
  {
    nome: 'Vidência', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Ilimitado', area: '', alvo: '1 ser', duracao: '5 rodadas',
    resistencia: 'Vontade anula',
    efeito: 'Através de uma superfície reflexiva (espelho, água, tela), você vê e ouve o alvo por 5 rodadas.',
    dados: 'Normal: 5 rodadas de visão/audição', dadosDiscente: 'Discente: duração maior', dadosVerdadeiro: 'Verdadeiro: observação máxima',
    desc: 'Através de uma superfície reflexiva (espelho, água, TV), você vê e ouve o alvo por 5 rodadas se ele falhar em Vontade.\n\nDiscente / Verdadeiro: ampliam duração ou qualidade (consultar livro oficial).'
  },
];
