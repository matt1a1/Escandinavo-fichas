// RITUAIS_CATALOG — Livro Básico Ordem Paranormal RPG 1ª edição
// Campos: nome, circulo, elemento, execucao, alcance, alvo, duracao, resistencia, efeito, dados*, desc
// Descrições mecânicas oficiais (efeito resumido); Discente/Verdadeiro com custos oficiais.
const RITUAIS_CATALOG = [

  /* ===================== CONHECIMENTO ===================== */
  {
    nome: 'Ouvir os Sussurros', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Pessoal', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Pergunta sim/não sobre evento iminente; 1d6 (2-6 responde, 1 falha como "não").',
    dados: 'Normal: 1 pergunta', dadosDiscente: 'Discente (+2 PE): pergunta sobre evento em até 1 dia', dadosVerdadeiro: 'Verdadeiro (+5 PE): várias perguntas; "ninguém sabe" nas falhas (3º círc.)',
    desc: 'Pergunta sim/não sobre evento iminente; 1d6 (2-6 responde, 1 falha como "não").\n\nDiscente (+2 PE): pergunta sobre evento em até 1 dia.\n\nVerdadeiro (+5 PE): várias perguntas, "ninguém sabe" nas falhas. Requer 3º círculo.'
  },
  {
    nome: 'Enfeitiçar', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: 'Vontade anula',
    efeito: 'Alvo fica prestativo, +10 Diplomacia; hostil tem +5 na resistência.',
    dados: 'Normal: prestativo +10 Diplomacia', dadosDiscente: 'Discente (+2 PE): vira sugestão de ação (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): afeta todos no alcance (3º círc.)',
    desc: 'Alvo fica prestativo, +10 Diplomacia; hostil tem +5 na resistência.\n\nDiscente (+2 PE): vira sugestão de ação. Requer 2º círculo.\n\nVerdadeiro (+5 PE): afeta todos no alcance. Requer 3º círculo.'
  },
  {
    nome: 'Perturbação', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 pessoa', duracao: '1 rodada',
    resistencia: 'Vontade anula',
    efeito: 'Obriga o alvo a uma ordem simples (fugir/largar/parar/sentar/vir).',
    dados: 'Normal: ordem simples', dadosDiscente: 'Discente (+2 PE): alvo vira "1 ser" + comando "sofra" (3d8 Conhecimento)', dadosVerdadeiro: 'Verdadeiro (+5 PE): até 5 seres ou comando "ataque" (3º círc.+afinidade)',
    desc: 'Obriga o alvo a uma ordem simples (fugir/largar/parar/sentar/vir).\n\nDiscente (+2 PE): alvo vira "1 ser" + comando "sofra" (3d8 Conhecimento).\n\nVerdadeiro (+5 PE): até 5 seres ou comando "ataque". Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Tecer Ilusão', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Ilusão até 4 cubos 1,5m', duracao: 'Cena',
    resistencia: 'Vontade desacredita',
    efeito: 'Ilusão visual/sonora simples, sem dano.',
    dados: 'Normal: 4 cubos', dadosDiscente: 'Discente (+2 PE): até 8 cubos, som+imagem+textura (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): ilusão de perigo mortal, 6d6 dano se acreditar (3º círc.)',
    desc: 'Ilusão visual/sonora simples, sem dano.\n\nDiscente (+2 PE): até 8 cubos, som+imagem+textura. Requer 2º círculo.\n\nVerdadeiro (+5 PE): ilusão de perigo mortal, 6d6 dano se acreditar. Requer 3º círculo.'
  },
  {
    nome: 'Terceiro Olho', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Vê auras paranormais (fraca/moderada/poderosa) em alcance longo.',
    dados: 'Normal: auras em alcance longo', dadosDiscente: 'Discente (+2 PE): dura 1 dia', dadosVerdadeiro: 'Verdadeiro (+5 PE): vê invisíveis/incorpóreos também',
    desc: 'Vê auras paranormais (fraca/moderada/poderosa) em alcance longo.\n\nDiscente (+2 PE): dura 1 dia.\n\nVerdadeiro (+5 PE): vê invisíveis/incorpóreos também.'
  },
  {
    nome: 'Compreensão Paranormal', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser/objeto', duracao: 'Cena',
    resistencia: 'Vontade anula (involuntário)',
    efeito: 'Entende qualquer idioma humano ao tocar; sente emoções de não-inteligentes.',
    dados: 'Normal: 1 alvo', dadosDiscente: 'Discente (+2 PE): alcance curto, vários alvos (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): fala/escreve qualquer idioma (3º círc.)',
    desc: 'Entende qualquer idioma humano ao tocar; sente emoções de não-inteligentes.\n\nDiscente (+2 PE): alcance curto, vários alvos. Requer 2º círculo.\n\nVerdadeiro (+5 PE): fala/escreve qualquer idioma. Requer 3º círculo.'
  },
  {
    nome: 'Aprimorar Mente', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Cena',
    resistencia: '—',
    efeito: '+1 Intelecto ou Presença à escolha.',
    dados: 'Normal: +1 Int ou Pre', dadosDiscente: 'Discente (+3 PE): +2 (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): +3 (4º círc.+afinidade)',
    desc: '+1 Intelecto ou Presença à escolha.\n\nDiscente (+3 PE): +2. Requer 3º círculo.\n\nVerdadeiro (+7 PE): +3. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Detecção de Ameaças', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Esfera 18m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Avisa quando hostil/armadilha entra na área (Percepção DT20).',
    dados: 'Normal: aviso de ameaças', dadosDiscente: 'Discente (+3 PE): imune a desprevenido contra detectados, +5 resistência a armadilhas (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): dura 1 dia (4º círc.)',
    desc: 'Avisa quando hostil/armadilha entra na área (Percepção DT20).\n\nDiscente (+3 PE): imune a desprevenido contra detectados, +5 resistência a armadilhas. Requer 3º círculo.\n\nVerdadeiro (+5 PE): dura 1 dia. Requer 4º círculo.'
  },
  {
    nome: 'Esconder dos Olhos', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Livre', alcance: 'Pessoal', alvo: 'Você', duracao: '1 rodada',
    resistencia: '—',
    efeito: 'Invisibilidade total, +15 Furtividade; acaba ao atacar.',
    dados: 'Normal: invisível 1 rodada', dadosDiscente: 'Discente (+3 PE): esfera de invisibilidade p/ aliados a 3m, sustentada (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): alcance toque, alvo 1 ser, não quebra ao atacar (4º círc.+afinidade)',
    desc: 'Invisibilidade total, +15 Furtividade; acaba ao atacar.\n\nDiscente (+3 PE): esfera de invisibilidade para aliados a 3m, sustentada. Requer 3º círculo.\n\nVerdadeiro (+7 PE): alcance toque, alvo 1 ser, não quebra ao atacar. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Invadir Mente', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio/toque', alvo: '1 ser ou 2 voluntários', duracao: 'Instant./1 dia',
    resistencia: 'Vontade parcial/nenhuma',
    efeito: 'Rajada mental 6d6 Conhecimento OU ligação telepática 1 dia.',
    dados: 'Normal: 6d6 ou telepatia', dadosDiscente: 'Discente (+3 PE): rajada 10d6 ou telepatia com visão/audição compartilhada (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): rajada 10d6 em vários alvos, ou vínculo com até 5 pessoas (4º círc.)',
    desc: 'Rajada mental 6d6 Conhecimento OU ligação telepática 1 dia.\n\nDiscente (+3 PE): rajada 10d6 ou telepatia com visão/audição compartilhada. Requer 3º círculo.\n\nVerdadeiro (+7 PE): rajada 10d6 em vários alvos, ou vínculo com até 5 pessoas. Requer 4º círculo.'
  },
  {
    nome: 'Localização', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Círculo 90m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Indica direção/distância de pessoa ou objeto específico (bloqueável por chumbo).',
    dados: 'Normal: 90m', dadosDiscente: 'Discente (+3 PE): acha rota de saída/entrada de um lugar (1h de validade)', dadosVerdadeiro: 'Verdadeiro (+7 PE): área de 1km (4º círc.)',
    desc: 'Indica direção/distância de pessoa ou objeto específico (bloqueável por chumbo).\n\nDiscente (+3 PE): acha rota de saída/entrada de um lugar (1h de validade).\n\nVerdadeiro (+7 PE): área de 1km. Requer 4º círculo.'
  },
  {
    nome: 'Alterar Memória', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Instantânea',
    resistencia: 'Vontade anula',
    efeito: 'Apaga/altera memórias de até 1h atrás (volta em 1d4 dias).',
    dados: 'Normal: até 1h', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+4 PE): até 24h atrás (4º círc.)',
    desc: 'Apaga/altera memórias de até 1h atrás (volta em 1d4 dias).\n\nVerdadeiro (+4 PE): até 24h atrás. Requer 4º círculo.'
  },
  {
    nome: 'Contato Paranormal', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Pessoal', alvo: 'Você', duracao: '1 dia',
    resistencia: '—',
    efeito: '6d6 de "ajuda" gastáveis em testes; rolar o valor máximo custa 2 SAN.',
    dados: 'Normal: 6d6 ajuda', dadosDiscente: 'Discente (+4 PE): dados viram d8, perda de 3 SAN no máximo (4º círc.)', dadosVerdadeiro: 'Verdadeiro (+9 PE): dados viram d12, perda de 5 SAN no máximo (4º círc.+afinidade)',
    desc: '6d6 de "ajuda" gastáveis em testes; rolar o valor máximo custa 2 SAN.\n\nDiscente (+4 PE): dados viram d8, perda de 3 SAN no máximo. Requer 4º círculo.\n\nVerdadeiro (+9 PE): dados viram d12, perda de 5 SAN no máximo. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Mergulho Mental', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Sustentada',
    resistencia: 'Vontade parcial',
    efeito: 'Alvo responde sim/não sem poder mentir; você fica desprevenido enquanto sustenta.',
    dados: 'Normal: toque', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+4 PE): à distância com componente ritual (cuba+máscara), 4º círc.',
    desc: 'Alvo responde sim/não sem poder mentir; você fica desprevenido enquanto sustenta.\n\nVerdadeiro (+4 PE): à distância com componente ritual (cuba+máscara). Requer 4º círculo.'
  },
  {
    nome: 'Vidência', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Ilimitado', alvo: '1 ser', duracao: '5 rodadas',
    resistencia: 'Vontade anula',
    efeito: 'Vê/ouve o alvo à distância; bônus/penalidade conforme quanto o conhece (+10 a –10).',
    dados: 'Normal: 5 rodadas', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Vê/ouve o alvo à distância; bônus/penalidade conforme quanto o conhece (+10 a –10).'
  },
  {
    nome: 'Controle Mental', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio', alvo: '1 pessoa/animal', duracao: 'Sustentada',
    resistencia: 'Vontade parcial',
    efeito: 'Controla o alvo (exceto ordens suicidas); teste de Vontade por turno pra resistir.',
    dados: 'Normal: 1 alvo', dadosDiscente: 'Discente (+5 PE): até 5 alvos', dadosVerdadeiro: 'Verdadeiro (+10 PE): até 10 alvos (afinidade)',
    desc: 'Controla o alvo (exceto ordens suicidas); teste de Vontade por turno pra resistir.\n\nDiscente (+5 PE): até 5 alvos.\n\nVerdadeiro (+10 PE): até 10 alvos. Requer afinidade.'
  },
  {
    nome: 'Inexistir', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Vontade parcial',
    efeito: '10d12+10 dano de Conhecimento; se zerar PV, apaga o alvo da existência.',
    dados: 'Normal: 10d12+10', dadosDiscente: 'Discente (+5 PE): 15d12+15 (dano resistido 3d12)', dadosVerdadeiro: 'Verdadeiro (+10 PE): 20d12+20 (dano resistido 4d12), afinidade',
    desc: '10d12+10 dano de Conhecimento; se zerar PV, apaga o alvo da existência.\n\nDiscente (+5 PE): 15d12+15 (dano resistido 3d12).\n\nVerdadeiro (+10 PE): 20d12+20 (dano resistido 4d12). Requer afinidade.'
  },
  {
    nome: 'Possessão', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Longo', alvo: '1 pessoa viva/morta', duracao: '1 dia',
    resistencia: 'Vontade anula',
    efeito: 'Troca de consciência com o alvo, usa atributos físicos dele.',
    dados: 'Normal: troca de consciência', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Troca de consciência com o alvo, usa atributos físicos dele.'
  },

  /* ===================== ENERGIA ===================== */
  {
    nome: 'Luz', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 objeto', duracao: 'Cena',
    resistencia: 'Vontade anula',
    efeito: 'Ilumina raio de 9m.',
    dados: 'Normal: raio 9m', dadosDiscente: 'Discente (+2 PE): 4 esferas de luz móveis (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): luz solar, aliados +O Vontade, inimigos ofuscados (3º círc.)',
    desc: 'Ilumina raio de 9m.\n\nDiscente (+2 PE): 4 esferas de luz móveis. Requer 2º círculo.\n\nVerdadeiro (+5 PE): luz solar, aliados +O Vontade, inimigos ofuscados. Requer 3º círculo.'
  },
  {
    nome: 'Eletrocussão', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser/objeto', duracao: 'Instantânea',
    resistencia: 'Fortitude parcial',
    efeito: '3d6 elétrico + vulnerável 1 rodada; dobra em eletrônicos.',
    dados: 'Normal: 3d6 elétrico', dadosDiscente: 'Discente (+2 PE): linha de 30m, 6d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): vários alvos, 8d6 cada (3º círc.)',
    desc: '3d6 elétrico + vulnerável 1 rodada; dobra em eletrônicos.\n\nDiscente (+2 PE): linha de 30m, 6d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): vários alvos, 8d6 cada. Requer 3º círculo.'
  },
  {
    nome: 'Amaldiçoar Tecnologia', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 acessório/arma de fogo', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Dá 1 modificação extra ao item.',
    dados: 'Normal: 1 mod', dadosDiscente: 'Discente (+2 PE): 2 modificações (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): 3 modificações (3º círc.+afinidade)',
    desc: 'Dá 1 modificação extra ao item.\n\nDiscente (+2 PE): 2 modificações. Requer 2º círculo.\n\nVerdadeiro (+5 PE): 3 modificações. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Coincidência Forçada', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Cena',
    resistencia: '—',
    efeito: '+2 em testes de perícia.',
    dados: 'Normal: +2', dadosDiscente: 'Discente (+2 PE): aliados à escolha (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): aliados + bônus vira +5 (3º círc.+afinidade)',
    desc: '+2 em testes de perícia.\n\nDiscente (+2 PE): aliados à escolha. Requer 2º círculo.\n\nVerdadeiro (+5 PE): aliados + bônus vira +5. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Polarização Caótica', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Você', duracao: 'Sustentada',
    resistencia: 'Vontade anula',
    efeito: 'Atrai (puxa objeto metálico) ou Repele (RD5 vs projéteis).',
    dados: 'Normal: atrai/repele', dadosDiscente: 'Discente (+2 PE): instantâneo, arremessa até 10 objetos (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): alcance médio, levita/move objeto 9m',
    desc: 'Atrai (puxa objeto metálico) ou Repele (RD5 vs projéteis).\n\nDiscente (+2 PE): instantâneo, arremessa até 10 objetos. Requer 2º círculo.\n\nVerdadeiro (+5 PE): alcance médio, levita/move objeto 9m.'
  },
  {
    nome: 'Chamas do Caos', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Veja texto', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Chamejar (+1d6 fogo em arma) / Esquentar / Extinguir / Modelar chama.',
    dados: 'Normal: opções básicas', dadosDiscente: 'Discente (+3 PE): sustentada, dispara labareda 4d6 Energia (Reflexos)', dadosVerdadeiro: 'Verdadeiro (+7 PE): como discente, 8d6 (3º círc.)',
    desc: 'Chamejar (+1d6 fogo em arma) / Esquentar / Extinguir / Modelar chama.\n\nDiscente (+3 PE): sustentada, dispara labareda 4d6 Energia (Reflexos).\n\nVerdadeiro (+7 PE): como discente, 8d6. Requer 3º círculo.'
  },
  {
    nome: 'Contenção Fantasmagórica', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Médio', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Reflexos anula',
    efeito: '3 laços agarram (Defesa10/10PV/RD5 cada, Atletismo pra quebrar).',
    dados: 'Normal: 3 laços', dadosDiscente: 'Discente (+3 PE): 6 laços, escolhe alvo de cada (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): laço destruído causa 2d6+2 Energia (3º círc.+afinidade)',
    desc: '3 laços agarram (Defesa10/10PV/RD5 cada, Atletismo pra quebrar).\n\nDiscente (+3 PE): 6 laços, escolhe alvo de cada. Requer 3º círculo.\n\nVerdadeiro (+5 PE): laço destruído causa 2d6+2 Energia. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Dissonância Acústica', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Esfera 6m', duracao: 'Sustentada',
    resistencia: '—',
    efeito: 'Surdo na área; impede conjuração de rituais.',
    dados: 'Normal: surdez em esfera 6m', dadosDiscente: 'Discente (+1 PE): vira alvo objeto, área 3m de silêncio', dadosVerdadeiro: 'Verdadeiro (+3 PE): nenhum som sai, mas conjuração normal dentro (3º círc.)',
    desc: 'Surdo na área; impede conjuração de rituais.\n\nDiscente (+1 PE): vira alvo objeto, área 3m de silêncio.\n\nVerdadeiro (+3 PE): nenhum som sai, mas conjuração normal dentro. Requer 3º círculo.'
  },
  {
    nome: 'Sopro do Caos', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Varia', duracao: 'Sustentada',
    resistencia: 'Varia',
    efeito: 'Ascender (levita alvo Médio) / Sopro (empurra, cone 4,5m) / Vento (área de vento forte).',
    dados: 'Normal: até Médio', dadosDiscente: 'Discente (+3 PE): afeta Grandes', dadosVerdadeiro: 'Verdadeiro (+9 PE): afeta Enormes',
    desc: 'Ascender (levita alvo Médio) / Sopro (empurra, cone 4,5m) / Vento (área de vento forte).\n\nDiscente (+3 PE): afeta Grandes.\n\nVerdadeiro (+9 PE): afeta Enormes.'
  },
  {
    nome: 'Tela de Ruído', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: '30 PV temp. só contra balístico/corte/impacto/perfuração (ou RD15 como reação).',
    dados: 'Normal: 30 PV temp / RD15', dadosDiscente: 'Discente (+3 PE): 60 PV temp / RD30', dadosVerdadeiro: 'Verdadeiro (+7 PE): esfera protetora ao redor de objeto/ser Enorme (4º círc.)',
    desc: '30 PV temp. só contra balístico/corte/impacto/perfuração (ou RD15 como reação).\n\nDiscente (+3 PE): 60 PV temp / RD30.\n\nVerdadeiro (+7 PE): esfera protetora ao redor de objeto/ser Enorme. Requer 4º círculo.'
  },
  {
    nome: 'Convocação Instantânea', circulo: '3', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Ilimitado', alvo: '1 objeto até 2 espaços', duracao: 'Instantânea',
    resistencia: 'Vontade anula',
    efeito: 'Teleporta objeto marcado até sua mão (dono pode negar com Vontade).',
    dados: 'Normal: até 2 espaços', dadosDiscente: 'Discente (+4 PE): objeto até 10 espaços', dadosVerdadeiro: 'Verdadeiro (+9 PE): recipiente Médio de até 10 espaços, permanente',
    desc: 'Teleporta objeto marcado até sua mão (dono pode negar com Vontade).\n\nDiscente (+4 PE): objeto até 10 espaços.\n\nVerdadeiro (+9 PE): recipiente Médio de até 10 espaços, permanente.'
  },
  {
    nome: 'Salto Fantasma', circulo: '3', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Teleporta você (não precisa ver o destino, só já ter visto antes).',
    dados: 'Normal: teleporte médio', dadosDiscente: 'Discente (+2 PE): vira reação, salta 1,5m com +10 Defesa/Reflexos', dadosVerdadeiro: 'Verdadeiro (+4 PE): alcance longo, leva até 2 voluntários tocados',
    desc: 'Teleporta você (não precisa ver o destino, só já ter visto antes).\n\nDiscente (+2 PE): vira reação, salta 1,5m com +10 Defesa/Reflexos.\n\nVerdadeiro (+4 PE): alcance longo, leva até 2 voluntários tocados.'
  },
  {
    nome: 'Transfigurar Água', circulo: '3', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Longo', alvo: 'Esfera 30m', duracao: 'Cena',
    resistencia: 'Varia',
    efeito: 'Congelar/Derreter/Enchente/Evaporar (5d8 Energia)/Partir.',
    dados: 'Normal: opções básicas', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+5 PE): enchente +12m, evaporar 10d8',
    desc: 'Congelar/Derreter/Enchente/Evaporar (5d8 Energia)/Partir.\n\nVerdadeiro (+5 PE): enchente +12m, evaporar 10d8.'
  },
  {
    nome: 'Transfigurar Terra', circulo: '3', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Longo', alvo: '9 cubos 1,5m', duracao: 'Instantânea',
    resistencia: 'Varia',
    efeito: 'Amolecer (10d6 impacto)/Modelar objeto/Solidificar (agarra).',
    dados: 'Normal: 9 cubos', dadosDiscente: 'Discente (+3 PE): área vira 15 cubos', dadosVerdadeiro: 'Verdadeiro (+7 PE): afeta minerais/metais também (4º círc.)',
    desc: 'Amolecer (10d6 impacto)/Modelar objeto/Solidificar (agarra).\n\nDiscente (+3 PE): área vira 15 cubos.\n\nVerdadeiro (+7 PE): afeta minerais/metais também. Requer 4º círculo.'
  },
  {
    nome: 'Alterar Destino', circulo: '4', elemento: 'Energia',
    execucao: 'Reação', alcance: 'Pessoal', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '—',
    efeito: '+15 num teste de resistência ou na Defesa contra um ataque.',
    dados: 'Normal: +15', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+5 PE): alcance curto, protege um aliado',
    desc: '+15 num teste de resistência ou na Defesa contra um ataque.\n\nVerdadeiro (+5 PE): alcance curto, protege um aliado.'
  },
  {
    nome: 'Deflagração de Energia', circulo: '4', elemento: 'Energia',
    execucao: 'Completa', alcance: 'Pessoal', alvo: 'Explosão 15m', duracao: '—',
    resistencia: 'Fortitude parcial',
    efeito: '3d10×10 dano de Energia + quebra itens tecnológicos na área.',
    dados: 'Normal: 3d10×10', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+5 PE): afeta só alvos escolhidos',
    desc: '3d10×10 dano de Energia + quebra itens tecnológicos na área.\n\nVerdadeiro (+5 PE): afeta só alvos escolhidos.'
  },
  {
    nome: 'Teletransporte', circulo: '4', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Toque', alvo: 'Até 5 voluntários', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Teleporta até 1000km; teste de Ocultismo conforme familiaridade com o destino (DT25-35).',
    dados: 'Normal: até 1000km', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+5 PE): qualquer lugar da Terra',
    desc: 'Teleporta até 1000km; teste de Ocultismo conforme familiaridade com o destino (DT25-35).\n\nVerdadeiro (+5 PE): qualquer lugar da Terra.'
  },

  /* ===================== MORTE ===================== */
  {
    nome: 'Cicatrização', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Cura 3d8+3 PV, mas o alvo envelhece 1 ano.',
    dados: 'Normal: 3d8+3 (envelhece 1 ano)', dadosDiscente: 'Discente (+2 PE): cura 5d8+5 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+9 PE): alcance curto, vários alvos, cura 7d8+7 (4º círc.+afinidade)',
    desc: 'Cura 3d8+3 PV, mas o alvo envelhece 1 ano.\n\nDiscente (+2 PE): cura 5d8+5. Requer 2º círculo.\n\nVerdadeiro (+9 PE): alcance curto, vários alvos, cura 7d8+7. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Consumir Manancial', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Instantânea',
    resistencia: '—',
    efeito: '3d6 PV temp. sugando vida do ambiente.',
    dados: 'Normal: 3d6 PV temp', dadosDiscente: 'Discente (+2 PE): 6d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): área 6m, suga de seres vivos, 3d6 Morte neles (Fortitude), 3º círc.+afinidade',
    desc: '3d6 PV temp. sugando vida do ambiente.\n\nDiscente (+2 PE): 6d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): área 6m, suga de seres vivos, 3d6 Morte neles (Fortitude). Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Decadência', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude reduz à metade',
    efeito: '2d8+2 dano de Morte.',
    dados: 'Normal: 2d8+2 Morte', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: '2d8+2 dano de Morte.'
  },
  {
    nome: 'Definhar', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Fortitude parcial',
    efeito: 'Fatigado (ou vulnerável se resistir).',
    dados: 'Normal: fatigado/vulnerável', dadosDiscente: 'Discente (+2 PE): exausto/fatigado (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): até 5 seres (3º círc.+afinidade)',
    desc: 'Fatigado (ou vulnerável se resistir).\n\nDiscente (+2 PE): exausto/fatigado. Requer 2º círculo.\n\nVerdadeiro (+5 PE): até 5 seres. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Espirais da Perdição', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Cena',
    resistencia: '—',
    efeito: '–O em testes de ataque.',
    dados: 'Normal: –O', dadosDiscente: 'Discente (+2 PE): –OO (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+8 PE): –OO em vários alvos (3º círc.)',
    desc: '–O em testes de ataque.\n\nDiscente (+2 PE): –OO. Requer 2º círculo.\n\nVerdadeiro (+8 PE): –OO em vários alvos. Requer 3º círculo.'
  },
  {
    nome: 'Nuvem de Cinzas', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Nuvem 6m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Camuflagem leve/total conforme distância; dispersa com vento.',
    dados: 'Normal: nuvem 6m', dadosDiscente: 'Discente (+2 PE): seres escolhidos enxergam através', dadosVerdadeiro: 'Verdadeiro (+5 PE): reduz deslocamento a 3m e –2 ataque na nuvem (3º círc.)',
    desc: 'Camuflagem leve/total conforme distância; dispersa com vento.\n\nDiscente (+2 PE): seres escolhidos enxergam através.\n\nVerdadeiro (+5 PE): reduz deslocamento a 3m e –2 ataque na nuvem. Requer 3º círculo.'
  },
  {
    nome: 'Desacelerar Impacto', circulo: '2', elemento: 'Morte',
    execucao: 'Reação', alcance: 'Curto', alvo: 'Seres/objetos até 10 espaços', duracao: 'Até tocar o chão',
    resistencia: '—',
    efeito: 'Reduz velocidade de queda; metade do dano se for projétil.',
    dados: 'Normal: até 10 espaços', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+3 PE): até 100 espaços de alvos',
    desc: 'Reduz velocidade de queda; metade do dano se for projétil.\n\nVerdadeiro (+3 PE): até 100 espaços de alvos.'
  },
  {
    nome: 'Eco Espiral', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: '2 rodadas',
    resistencia: 'Fortitude reduz à metade',
    efeito: 'Cria cópia de cinzas; ao "descarregar" no 2º turno, causa dano igual ao sofrido na rodada anterior.',
    dados: 'Normal: 1 alvo, 2 rodadas', dadosDiscente: 'Discente (+3 PE): até 5 seres', dadosVerdadeiro: 'Verdadeiro (+7 PE): 3 rodadas, permite descarregar na 3ª (4º círc.+afinidade)',
    desc: 'Cria cópia de cinzas; ao "descarregar" no 2º turno, causa dano igual ao sofrido na rodada anterior.\n\nDiscente (+3 PE): até 5 seres.\n\nVerdadeiro (+7 PE): 3 rodadas, permite descarregar na 3ª. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Miasma Entrópico', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Nuvem 6m', duracao: 'Instantânea',
    resistencia: 'Fortitude parcial',
    efeito: '4d8 químico + enjoado 1 rodada.',
    dados: 'Normal: 4d8 químico', dadosDiscente: 'Discente (+3 PE): dano vira 6d8 de Morte', dadosVerdadeiro: 'Verdadeiro (+7 PE): 3 rodadas de duração, dano repete (3º círc.)',
    desc: '4d8 químico + enjoado 1 rodada.\n\nDiscente (+3 PE): dano vira 6d8 de Morte.\n\nVerdadeiro (+7 PE): 3 rodadas de duração, dano repete. Requer 3º círculo.'
  },
  {
    nome: 'Paradoxo', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Esfera 6m', duracao: 'Instantânea',
    resistencia: 'Fortitude reduz à metade',
    efeito: '6d6 dano de Morte na área.',
    dados: 'Normal: 6d6', dadosDiscente: 'Discente (+3 PE): esfera móvel 1,5m, cena, 4d6/rodada', dadosVerdadeiro: 'Verdadeiro (+7 PE): 13d6, quem zera PV pode virar cinzas (4º círc.)',
    desc: '6d6 dano de Morte na área.\n\nDiscente (+3 PE): esfera móvel 1,5m, cena, 4d6/rodada.\n\nVerdadeiro (+7 PE): 13d6, quem zera PV pode virar cinzas. Requer 4º círculo.'
  },
  {
    nome: 'Velocidade Mortal', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Sustentada',
    resistencia: '—',
    efeito: 'Ação de movimento extra por turno.',
    dados: 'Normal: movimento extra', dadosDiscente: 'Discente (+3 PE): vira ação padrão extra', dadosVerdadeiro: 'Verdadeiro (+7 PE): vários alvos (4º círc.+afinidade)',
    desc: 'Ação de movimento extra por turno.\n\nDiscente (+3 PE): vira ação padrão extra.\n\nVerdadeiro (+7 PE): vários alvos. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Âncora Temporal', circulo: '3', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Vontade parcial',
    efeito: 'Impede deslocamento (teste de Vontade por turno pra resistir).',
    dados: 'Normal: 1 alvo', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+4 PE): vários alvos',
    desc: 'Impede deslocamento (teste de Vontade por turno pra resistir).\n\nVerdadeiro (+4 PE): vários alvos.'
  },
  {
    nome: 'Poeira da Podridão', circulo: '3', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Nuvem 6m', duracao: 'Sustentada',
    resistencia: 'Fortitude (veja)',
    efeito: '4d8 dano de Morte por turno na área, impede cura por 1 rodada.',
    dados: 'Normal: 4d8/turno', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+4 PE): dano vira 4d8+16',
    desc: '4d8 dano de Morte por turno na área, impede cura por 1 rodada.\n\nVerdadeiro (+4 PE): dano vira 4d8+16.'
  },
  {
    nome: 'Tentáculos de Lodo', circulo: '3', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Círculo 6m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Manobra de agarrar (Ocultismo) todo turno; agarrado de novo = 4d6 (impacto+Morte).',
    dados: 'Normal: círculo 6m', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+5 PE): raio 9m, dano 6d6',
    desc: 'Manobra de agarrar (Ocultismo) todo turno; agarrado de novo = 4d6 (impacto+Morte).\n\nVerdadeiro (+5 PE): raio 9m, dano 6d6.'
  },
  {
    nome: 'Zerar Entropia', circulo: '3', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: 'Vontade parcial',
    efeito: 'Paralisa (ou lento se resistir); teste de Vontade por turno pra encerrar.',
    dados: 'Normal: 1 pessoa', dadosDiscente: 'Discente (+4 PE): alvo vira "1 ser" (4º círc.)', dadosVerdadeiro: 'Verdadeiro (+11 PE): vários alvos (4º círc.+afinidade)',
    desc: 'Paralisa (ou lento se resistir); teste de Vontade por turno pra encerrar.\n\nDiscente (+4 PE): alvo vira "1 ser". Requer 4º círculo.\n\nVerdadeiro (+11 PE): vários alvos. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Distorção Temporal', circulo: '4', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: '3 rodadas (bolsão)',
    resistencia: '—',
    efeito: 'Age fora do tempo normal, mas não pode se mover nem interagir.',
    dados: 'Normal: 3 rodadas', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Age fora do tempo normal, mas não pode se mover nem interagir.'
  },
  {
    nome: 'Convocar o Algoz', circulo: '4', elemento: 'Morte',
    execucao: 'Padrão', alcance: '1,5m', alvo: '1 pessoa', duracao: 'Sustentada',
    resistencia: 'Vontade/Fortitude parcial',
    efeito: 'Invoca vulto que persegue o alvo; alcançá-lo causa abalado ou colapso a 0 PV.',
    dados: 'Normal: 1 alvo', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Invoca vulto que persegue o alvo; alcançá-lo causa abalado ou colapso a 0 PV.'
  },
  {
    nome: 'Fim Inevitável', circulo: '4', elemento: 'Morte',
    execucao: 'Completa', alcance: 'Extremo', alvo: 'Vácuo 1,5m', duracao: '4 rodadas',
    resistencia: 'Fortitude parcial',
    efeito: 'Puxa tudo num raio de 90m; contato direto = 100 dano de Morte/rodada.',
    dados: 'Normal: 4 rodadas', dadosDiscente: 'Discente (+5 PE): dura 5 rodadas, você imune (afinidade)', dadosVerdadeiro: 'Verdadeiro (+10 PE): dura 6 rodadas, escolhe quem não é afetado (afinidade)',
    desc: 'Puxa tudo num raio de 90m; contato direto = 100 dano de Morte/rodada.\n\nDiscente (+5 PE): dura 5 rodadas, você imune. Requer afinidade.\n\nVerdadeiro (+10 PE): dura 6 rodadas, escolhe quem não é afetado. Requer afinidade.'
  },

  /* ===================== SANGUE ===================== */
  {
    nome: 'Arma Atroz', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 arma corpo a corpo', duracao: 'Sustentada',
    resistencia: '—',
    efeito: '+2 ataque, +1 margem de ameaça.',
    dados: 'Normal: +2 atq / +1 margem', dadosDiscente: 'Discente (+2 PE): +5 ataque (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): +5 ataque, +2 margem e multiplicador (3º círc.+afinidade)',
    desc: '+2 ataque, +1 margem de ameaça.\n\nDiscente (+2 PE): +5 ataque. Requer 2º círculo.\n\nVerdadeiro (+5 PE): +5 ataque, +2 margem e multiplicador. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Armadura de Sangue', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: '+5 Defesa (não acumula com equipamento).',
    dados: 'Normal: +5 Defesa', dadosDiscente: 'Discente (+5 PE): +10 Defesa, RD5 vs balístico/corte/impacto/perfuração (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+9 PE): +15 Defesa, RD10 (4º círc.+afinidade)',
    desc: '+5 Defesa (não acumula com equipamento).\n\nDiscente (+5 PE): +10 Defesa, RD5 vs balístico/corte/impacto/perfuração. Requer 3º círculo.\n\nVerdadeiro (+9 PE): +15 Defesa, RD10. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Corpo Adaptado', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa/animal', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Imune a calor/frio extremo, respira água/ar.',
    dados: 'Normal: 1 alvo', dadosDiscente: 'Discente (+2 PE): dura 1 dia', dadosVerdadeiro: 'Verdadeiro (+5 PE): alcance curto, vários alvos',
    desc: 'Imune a calor/frio extremo, respira água/ar.\n\nDiscente (+2 PE): dura 1 dia.\n\nVerdadeiro (+5 PE): alcance curto, vários alvos.'
  },
  {
    nome: 'Distorcer Aparência', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: 'Vontade desacredita',
    efeito: 'Muda aparência física, +10 Enganação disfarce (não muda stats).',
    dados: 'Normal: você', dadosDiscente: 'Discente (+2 PE): alcance curto, 1 ser', dadosVerdadeiro: 'Verdadeiro (+5 PE): vários alvos (3º círc.)',
    desc: 'Muda aparência física, +10 Enganação disfarce (não muda stats).\n\nDiscente (+2 PE): alcance curto, 1 ser.\n\nVerdadeiro (+5 PE): vários alvos. Requer 3º círculo.'
  },
  {
    nome: 'Fortalecimento Sensorial', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: '+O em Investigação, Luta, Percepção, Pontaria.',
    dados: 'Normal: +O em perícias', dadosDiscente: 'Discente (+2 PE): inimigos –O ao te atacar (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): imune a surpreendido/desprevenido, +10 Defesa/Reflexos (4º círc.+afinidade)',
    desc: '+O em Investigação, Luta, Percepção, Pontaria.\n\nDiscente (+2 PE): inimigos –O ao te atacar. Requer 2º círculo.\n\nVerdadeiro (+5 PE): imune a surpreendido/desprevenido, +10 Defesa/Reflexos. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Ódio Incontrolável', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: '—',
    efeito: '+2 ataque/dano corpo a corpo, RD5, mas só pode atacar (impede calma).',
    dados: 'Normal: +2 / RD5', dadosDiscente: 'Discente (+2 PE): ataque extra ao agredir', dadosVerdadeiro: 'Verdadeiro (+5 PE): bônus vira +5, metade do dano físico (3º círc.+afinidade)',
    desc: '+2 ataque/dano corpo a corpo, RD5, mas só pode atacar (impede calma).\n\nDiscente (+2 PE): ataque extra ao agredir.\n\nVerdadeiro (+5 PE): bônus vira +5, metade do dano físico. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Descarnar', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude parcial',
    efeito: '6d8 dano (corte+Sangue) + hemorragia (2d8/turno até resistir 2x).',
    dados: 'Normal: 6d8 + hemorragia 2d8', dadosDiscente: 'Discente (+3 PE): 10d8 direto, hemorragia 4d8 (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): sustentado em você, ataques corpo a corpo +4d8 e hemorragia automática (3º círc.+afinidade)',
    desc: '6d8 dano (corte+Sangue) + hemorragia (2d8/turno até resistir 2x).\n\nDiscente (+3 PE): 10d8 direto, hemorragia 4d8. Requer 3º círculo.\n\nVerdadeiro (+7 PE): sustentado em você, ataques corpo a corpo +4d8 e hemorragia automática. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Flagelo de Sangue', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: 'Fortitude parcial',
    efeito: 'Marca com ordem; desobedecer = 10d6 dano + enjoado.',
    dados: 'Normal: 1 pessoa', dadosDiscente: 'Discente (+3 PE): alvo vira "1 ser exceto criatura de Sangue" (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): dura 1 dia (4º círc.+afinidade)',
    desc: 'Marca com ordem; desobedecer = 10d6 dano + enjoado.\n\nDiscente (+3 PE): alvo vira "1 ser exceto criatura de Sangue". Requer 3º círculo.\n\nVerdadeiro (+7 PE): dura 1 dia. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Hemofagia', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude reduz à metade',
    efeito: '6d6 dano de Sangue, você recupera metade como PV.',
    dados: 'Normal: 6d6 + cura metade', dadosDiscente: 'Discente (+3 PE): sem resistência, vira ataque corpo a corpo', dadosVerdadeiro: 'Verdadeiro (+7 PE): sustentado, toca vários alvos por rodada (4º círc.)',
    desc: '6d6 dano de Sangue, você recupera metade como PV.\n\nDiscente (+3 PE): sem resistência, vira ataque corpo a corpo.\n\nVerdadeiro (+7 PE): sustentado, toca vários alvos por rodada. Requer 4º círculo.'
  },
  {
    nome: 'Transfusão Vital', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Transfere até 30 PV seus pro alvo (não fica abaixo de 1).',
    dados: 'Normal: até 30 PV', dadosDiscente: 'Discente (+3 PE): até 50 PV (3º círc.)', dadosVerdadeiro: 'Verdadeiro (+7 PE): até 100 PV (4º círc.)',
    desc: 'Transfere até 30 PV seus pro alvo (não fica abaixo de 1).\n\nDiscente (+3 PE): até 50 PV. Requer 3º círculo.\n\nVerdadeiro (+7 PE): até 100 PV. Requer 4º círculo.'
  },
  {
    nome: 'Vomitar Pestes', circulo: '3', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Médio', alvo: 'Enxame Grande', duracao: 'Sustentada',
    resistencia: 'Reflexos reduz à metade',
    efeito: '5d12 dano de Sangue/turno a quem estiver no espaço dele.',
    dados: 'Normal: 5d12/turno', dadosDiscente: 'Discente (+2 PE): agarra o alvo', dadosVerdadeiro: 'Verdadeiro (+5 PE): enxame Enorme, voo 18m',
    desc: '5d12 dano de Sangue/turno a quem estiver no espaço dele.\n\nDiscente (+2 PE): agarra o alvo.\n\nVerdadeiro (+5 PE): enxame Enorme, voo 18m.'
  },
  {
    nome: 'Ferver Sangue', circulo: '3', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Sustentada',
    resistencia: 'Fortitude parcial',
    efeito: '4d8 dano de Sangue/turno + fraco (resiste 2x seguidas encerra).',
    dados: 'Normal: 4d8/turno', dadosDiscente: '—', dadosVerdadeiro: 'Verdadeiro (+4 PE): vários alvos (4º círc.+afinidade)',
    desc: '4d8 dano de Sangue/turno + fraco (resiste 2x seguidas encerra).\n\nVerdadeiro (+4 PE): vários alvos. Requer 4º círculo e afinidade.'
  },
  {
    nome: 'Forma Monstruosa', circulo: '3', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Vira Grande, +5 ataque/dano corpo a corpo, +30 PV temp.; ataca compulsivamente.',
    dados: 'Normal: Grande +30 PV temp', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Vira Grande, +5 ataque/dano corpo a corpo, +30 PV temp.; ataca compulsivamente.'
  },
  {
    nome: 'Purgatório', circulo: '3', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Área 6m', duracao: 'Sustentada',
    resistencia: 'Fortitude parcial',
    efeito: 'Área deixa vulnerável; sair custa 6d6 dano + Fortitude ou perde a ação.',
    dados: 'Normal: área 6m', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Área deixa vulnerável; sair custa 6d6 dano + Fortitude ou perde a ação.'
  },
  {
    nome: 'Capturar o Coração', circulo: '4', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 pessoa', duracao: 'Cena',
    resistencia: 'Vontade parcial',
    efeito: 'Alvo obcecado tenta ajudar você todo turno (teste de Vontade por turno).',
    dados: 'Normal: 1 pessoa', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Alvo obcecado tenta ajudar você todo turno (teste de Vontade por turno).'
  },
  {
    nome: 'Invólucro de Carne', circulo: '4', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 clone', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Clone idêntico (mesmas stats), sem consciência, obedece ordens simples.',
    dados: 'Normal: 1 clone', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Clone idêntico (mesmas stats), sem consciência, obedece ordens simples.'
  },
  {
    nome: 'Vínculo de Sangue', circulo: '4', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Fortitude anula',
    efeito: 'Ao sofrer dano, o alvo também sofre (metade cada) ou tudo se for voluntário/invertido.',
    dados: 'Normal: vínculo', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Ao sofrer dano, o alvo também sofre (metade cada) ou tudo se for voluntário/invertido.'
  },

  /* ===================== MEDO ===================== */
  {
    nome: 'Cinerária', circulo: '1', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Nuvem 6m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Rituais conjurados dentro têm DT +5.',
    dados: 'Normal: DT +5', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Rituais conjurados dentro têm DT +5.'
  },
  {
    nome: 'Proteção contra Rituais', circulo: '2', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Cena',
    resistencia: '—',
    efeito: 'RD 5 contra dano paranormal, +5 em resistência a rituais/habilidades paranormais.',
    dados: 'Normal: RD5 +5 resist.', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'RD 5 contra dano paranormal, +5 em resistência a rituais/habilidades paranormais.'
  },
  {
    nome: 'Rejeitar Névoa', circulo: '2', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Curto', alvo: 'Nuvem 6m', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Rituais conjurados na área custam +2 PE/círculo e sobem 1 passo de execução; anula Cinerária.',
    dados: 'Normal: +2 PE e execução pior', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Rituais conjurados na área custam +2 PE/círculo e sobem 1 passo de execução; anula Cinerária.'
  },
  {
    nome: 'Dissipar Ritual', circulo: '3', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Médio', alvo: '1 ser/objeto ou esfera 3m', duracao: 'Instantânea',
    resistencia: '—',
    efeito: 'Teste de Ocultismo anula rituais ativos com DT ≤ resultado.',
    dados: 'Normal: anula por DT', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Teste de Ocultismo anula rituais ativos com DT ≤ resultado.'
  },
  {
    nome: 'Canalizar o Medo', circulo: '4', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Permanente até usar',
    resistencia: '—',
    efeito: 'Transfere um ritual conhecido (até 3º círc.) pro alvo conjurar de graça uma vez; seus PE máx. caem até isso acontecer.',
    dados: 'Normal: transfere 1 ritual', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Transfere um ritual conhecido (até 3º círc.) pro alvo conjurar de graça uma vez; seus PE máx. caem até isso acontecer.'
  },
  {
    nome: 'Conhecendo o Medo', circulo: '4', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 pessoa', duracao: 'Instantânea',
    resistencia: 'Vontade parcial',
    efeito: 'Zera a Sanidade do alvo (enlouquece) ou, se resistir, 10d6 dano mental + apavorado.',
    dados: 'Normal: zera SAN ou 10d6 mental', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Zera a Sanidade do alvo (enlouquece) ou, se resistir, 10d6 dano mental + apavorado.'
  },
  {
    nome: 'Lâmina do Medo', circulo: '4', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude parcial',
    efeito: 'Zera PV (morrendo) ou, se resistir, 10d8 dano de Medo (ignora resistências) + apavorado.',
    dados: 'Normal: zera PV ou 10d8 Medo', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Zera PV (morrendo) ou, se resistir, 10d8 dano de Medo (ignora resistências) + apavorado.'
  },
  {
    nome: 'Medo Tangível', circulo: '4', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Você', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Imune a quase todas as condições negativas mundanas e a doenças/venenos; PV físico não cai abaixo de 1.',
    dados: 'Normal: imunidade', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: 'Imune a quase todas as condições negativas mundanas e a doenças/venenos; PV físico não cai abaixo de 1.'
  },
  {
    nome: 'Presença do Medo', circulo: '4', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Pessoal', alvo: 'Emanação 9m', duracao: 'Sustentada',
    resistencia: 'Vontade reduz à metade',
    efeito: '5d8 dano mental + 5d8 dano de Medo a quem estiver na área; falha = atordoado 1 rodada (1x/cena).',
    dados: 'Normal: 5d8 + 5d8', dadosDiscente: '—', dadosVerdadeiro: '—',
    desc: '5d8 dano mental + 5d8 dano de Medo a quem estiver na área; falha = atordoado 1 rodada (1x/cena).'
  },

  /* ===================== AMALDIÇOAR ARMA (multi-elemento) ===================== */
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '—',
    efeito: 'Escolha um elemento (Conhecimento/Energia/Morte/Sangue). A arma/munição causa +1d6 de dano do elemento.',
    dados: 'Normal: +1d6', dadosDiscente: 'Discente (+2 PE): +2d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6 (3º círc.+afinidade)',
    desc: 'Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.\n\nDiscente (+2 PE): +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '—',
    efeito: 'A arma/munição causa +1d6 de dano de Energia.',
    dados: 'Normal: +1d6 Energia', dadosDiscente: 'Discente (+2 PE): +2d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6 (3º círc.+afinidade)',
    desc: 'Você imbui a arma ou munições com Energia, fazendo com que causem +1d6 de dano de Energia.\n\nDiscente (+2 PE): +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '—',
    efeito: 'A arma/munição causa +1d6 de dano de Morte.',
    dados: 'Normal: +1d6 Morte', dadosDiscente: 'Discente (+2 PE): +2d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6 (3º círc.+afinidade)',
    desc: 'Você imbui a arma ou munições com Morte, fazendo com que causem +1d6 de dano de Morte.\n\nDiscente (+2 PE): +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.'
  },
  {
    nome: 'Amaldiçoar Arma', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', alvo: '1 arma corpo a corpo ou pacote de munição', duracao: 'Cena',
    resistencia: '—',
    efeito: 'A arma/munição causa +1d6 de dano de Sangue.',
    dados: 'Normal: +1d6 Sangue', dadosDiscente: 'Discente (+2 PE): +2d6 (2º círc.)', dadosVerdadeiro: 'Verdadeiro (+5 PE): +4d6 (3º círc.+afinidade)',
    desc: 'Você imbui a arma ou munições com Sangue, fazendo com que causem +1d6 de dano de Sangue.\n\nDiscente (+2 PE): +2d6. Requer 2º círculo.\n\nVerdadeiro (+5 PE): +4d6. Requer 3º círculo e afinidade.'
  }
];
