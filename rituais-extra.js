// Parte 2 — concatena ao catálogo
(function(){
  const EXTRA = [
  {
    nome: 'Perturbação', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Vontade anula',
    efeito: 'Força o alvo a obedecer a uma ordem simples. O alvo não fica sob seu controle total, mas tenta cumprir a ordem da melhor forma possível enquanto o efeito durar.',
    dados: 'Normal: ordem simples', dadosDiscente: 'Discente: ordem mais complexa', dadosVerdadeiro: 'Verdadeiro: efeito ampliado / mais alvos',
    desc: 'Força o alvo a obedecer a uma ordem simples. O alvo não fica sob seu controle total, mas tenta cumprir a ordem da melhor forma possível enquanto o efeito durar.\n\nDiscente / Verdadeiro: ampliam a complexidade da ordem ou o número de alvos (consultar livro oficial).'
  },
  {
    nome: 'Tecer Ilusão', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Ilusão', duracao: 'Cena',
    resistencia: 'Vontade descrê',
    efeito: 'Você cria uma ilusão visual ou sonora. Quem interagir com a ilusão ou passar em Vontade pode perceber que não é real.',
    dados: 'Normal: 1 ilusão visual/sonora', dadosDiscente: 'Discente: ilusão maior / mais convincente', dadosVerdadeiro: 'Verdadeiro: ilusão complexa',
    desc: 'Você cria uma ilusão visual ou sonora. Quem interagir com a ilusão ou passar em Vontade pode perceber que não é real.\n\nDiscente / Verdadeiro: tornam a ilusão maior, mais complexa ou mais difícil de resistir (consultar livro oficial).'
  },
  {
    nome: 'Terceiro Olho', circulo: '1', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Seus olhos se enchem de sigilos e você passa a enxergar auras paranormais em alcance longo. Rituais, itens amaldiçoados e criaturas emitem auras. Você sabe o elemento da aura e seu poder aproximado.',
    dados: 'Normal: ver auras paranormais (longo)', dadosDiscente: 'Discente: mais detalhe / alcance maior', dadosVerdadeiro: 'Verdadeiro: percepção máxima',
    desc: 'Seus olhos se enchem de sigilos e você passa a enxergar auras paranormais em alcance longo. Rituais, itens amaldiçoados e criaturas emitem auras. Você sabe o elemento da aura e seu poder aproximado.\n\nDiscente / Verdadeiro: aumentam o detalhe ou o alcance (consultar livro oficial).'
  },
  {
    nome: 'Coincidência Forçada', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de perícias.',
    dados: 'Normal: +2 em testes de perícias', dadosDiscente: 'Discente (+2 PE): aliados à sua escolha', dadosVerdadeiro: 'Verdadeiro: bônus maior / mais alvos',
    desc: 'Você manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de perícias.\n\nDiscente (+2 PE): muda o alvo para aliados à sua escolha.\n\nVerdadeiro: amplia o bônus ou o número de alvos (consultar livro oficial).'
  },
  {
    nome: 'Luz', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 objeto', duracao: 'Cena',
    resistencia: 'Vontade anula (veja texto)',
    efeito: 'O objeto brilha como uma lâmpada, iluminando a área. Pode ofuscar criaturas sensíveis à luz.',
    dados: 'Normal: objeto ilumina como lâmpada', dadosDiscente: 'Discente: luz mais intensa / ofusca', dadosVerdadeiro: 'Verdadeiro: luz extrema',
    desc: 'O objeto brilha como uma lâmpada, iluminando a área. Pode ofuscar criaturas sensíveis à luz.\n\nDiscente / Verdadeiro: aumentam a intensidade ou adicionam ofuscamento (consultar livro oficial).'
  },
  {
    nome: 'Polarização Caótica', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Você', duracao: 'Sustentada',
    resistencia: 'Vontade anula',
    efeito: 'Você gera uma aura magnética sobrenatural. Escolha atrair ou repelir objetos metálicos no alcance.',
    dados: 'Normal: atrair/repelir metal', dadosDiscente: 'Discente (+2 PE): arremessa até 10 objetos de uma vez', dadosVerdadeiro: 'Verdadeiro (+5 PE): alcance médio; move ser/objeto até 9m',
    desc: 'Você gera uma aura magnética sobrenatural. Escolha atrair ou repelir objetos metálicos no alcance.\n\nDiscente (+2 PE): a energia é expelida de uma vez e arremessa até 10 objetos (ou 10 espaços).\n\nVerdadeiro (+5 PE): muda o alcance para médio; você pode levitar e mover um ser ou objeto por até 9m.'
  },
  {
    nome: 'Overclock', circulo: '1', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você acelera as reações do próprio corpo com Energia pura, recebendo bônus em iniciativa e ações rápidas.',
    dados: 'Normal: aceleração corporal', dadosDiscente: 'Discente: bônus maior', dadosVerdadeiro: 'Verdadeiro: aceleração máxima',
    desc: 'Você acelera as reações do próprio corpo com Energia pura, recebendo bônus em iniciativa e ações rápidas.\n\nDiscente / Verdadeiro: aumentam o bônus (consultar livro oficial).'
  },
  {
    nome: 'Nuvem de Cinzas', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', area: 'Nuvem 6m de raio e 6m de altura', alvo: 'Área', duracao: 'Cena',
    resistencia: '',
    efeito: 'Uma nuvem de fuligem espessa eleva-se de um ponto a sua escolha, obscurecendo toda a visão — seres a até 1,5m têm camuflagem leve e seres a partir de 3m têm camuflagem total.',
    dados: 'Normal: camuflagem na nuvem', dadosDiscente: 'Discente (+2 PE): aliados escolhidos enxergam através. Requer 2º círculo.', dadosVerdadeiro: 'Verdadeiro: nuvem maior / mais densa',
    desc: 'Uma nuvem de fuligem espessa eleva-se de um ponto a sua escolha, obscurecendo toda a visão — seres a até 1,5m têm camuflagem leve e seres a partir de 3m têm camuflagem total. Um vento forte dispersa a nuvem em 4 rodadas e um vendaval a dispersa em 1 rodada.\n\nDiscente (+2 PE): você pode escolher seres no alcance ao conjurar; eles enxergam através do efeito. Requer 2º círculo.\n\nVerdadeiro: amplia a nuvem ou a densidade (consultar livro oficial).'
  },
  {
    nome: 'Apagar as Luzes', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Área', duracao: 'Cena',
    resistencia: '',
    efeito: 'Apaga fontes de luz na área, criando escuridão sobrenatural.',
    dados: 'Normal: apaga luzes na área', dadosDiscente: 'Discente: área maior', dadosVerdadeiro: 'Verdadeiro: escuridão total',
    desc: 'Apaga fontes de luz na área, criando escuridão sobrenatural.\n\nDiscente / Verdadeiro: aumentam a área ou a intensidade da escuridão (consultar livro oficial).'
  },
  {
    nome: 'Espirais da Perdição', circulo: '1', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Inimigos', duracao: 'Cena',
    resistencia: '',
    efeito: 'Inimigos sofrem penalidade em ataques e testes enquanto as espirais os envolvem.',
    dados: 'Normal: penalidade em inimigos', dadosDiscente: 'Discente: penalidade maior', dadosVerdadeiro: 'Verdadeiro: efeito máximo',
    desc: 'Inimigos sofrem penalidade em ataques e testes enquanto as espirais da perdição os envolvem.\n\nDiscente / Verdadeiro: aumentam a penalidade ou o número de alvos (consultar livro oficial).'
  },
  {
    nome: 'Corpo Adaptado', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Seu corpo se adapta à necessidade do momento — respirar em ambientes hostis, resistir a temperaturas extremas ou moldar a carne para um esforço específico.',
    dados: 'Normal: adaptação física', dadosDiscente: 'Discente: adaptação maior', dadosVerdadeiro: 'Verdadeiro: adaptação máxima',
    desc: 'Seu corpo se adapta à necessidade do momento.\n\nDiscente / Verdadeiro: aumentam o benefício (consultar livro oficial).'
  },
  {
    nome: 'Distorcer Aparência', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você ou aliado próximo', duracao: 'Cena',
    resistencia: '',
    efeito: 'Muda a aparência física do alvo (rosto, voz, porte). Não concede habilidades novas, apenas o disfarce.',
    dados: 'Normal: disfarce físico', dadosDiscente: 'Discente: disfarce melhor / em outro', dadosVerdadeiro: 'Verdadeiro: disfarce perfeito',
    desc: 'Muda a aparência física do alvo (rosto, voz, porte). Não concede habilidades novas, apenas o disfarce.\n\nDiscente / Verdadeiro: tornam o disfarce mais convincente ou permitem mais alvos (consultar livro oficial).'
  },
  {
    nome: 'Fortalecimento Sensorial', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Melhora seus sentidos e sua percepção — visão, audição, olfato e percepção de ameaças.',
    dados: 'Normal: sentidos aguçados', dadosDiscente: 'Discente: bônus maior', dadosVerdadeiro: 'Verdadeiro: percepção máxima',
    desc: 'Melhora seus sentidos e sua percepção.\n\nDiscente / Verdadeiro: aumentam o bônus (consultar livro oficial).'
  },
  {
    nome: 'Ódio Incontrolável', circulo: '1', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você ou 1 ser', duracao: 'Cena',
    resistencia: 'Vontade (se em outro)',
    efeito: 'O alvo entra em ódio incontrolável: aumenta dano corpo a corpo e perícias físicas, mas piora perícias mentais. Pode atacar aliados se não houver inimigos.',
    dados: 'Normal: fúria (+ físico, − mental)', dadosDiscente: 'Discente: fúria maior', dadosVerdadeiro: 'Verdadeiro: fúria máxima',
    desc: 'O alvo entra em ódio incontrolável: aumenta dano corpo a corpo e perícias físicas, mas piora perícias mentais. Pode atacar aliados se não houver inimigos à frente.\n\nDiscente / Verdadeiro: intensificam o efeito (consultar livro oficial).'
  },
  {
    nome: 'Cinerária', circulo: '1', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Curto', area: 'Névoa', alvo: 'Área', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você manifesta uma névoa de Medo que fortalece rituais na área. Rituais de Medo custam Sanidade.',
    dados: 'Normal: fortalece rituais na névoa', dadosDiscente: 'Discente: névoa mais forte (+ Sanidade)', dadosVerdadeiro: 'Verdadeiro: efeito máximo (+ Sanidade)',
    desc: 'Você manifesta uma névoa de Medo que fortalece rituais na área. Rituais de Medo custam Sanidade (formas avançadas custam mais).\n\nDiscente / Verdadeiro: ampliam o efeito; mais Sanidade nas formas avançadas.'
  },
  {
    nome: 'Aprimorar Mente', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: '',
    efeito: 'Fornece bônus em Intelecto ou Presença ao alvo durante a cena.',
    dados: 'Normal: bônus INT ou PRE', dadosDiscente: 'Discente: bônus maior', dadosVerdadeiro: 'Verdadeiro: bônus máximo',
    desc: 'Fornece bônus em Intelecto ou Presença ao alvo durante a cena.\n\nDiscente / Verdadeiro: aumentam o bônus (consultar livro oficial).'
  },
  {
    nome: 'Detecção de Ameaças', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Médio', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Detecta personagens hostis e armadilhas na área.',
    dados: 'Normal: detectar hostis e armadilhas', dadosDiscente: 'Discente: alcance maior', dadosVerdadeiro: 'Verdadeiro: detecção máxima',
    desc: 'Detecta personagens hostis e armadilhas na área.\n\nDiscente / Verdadeiro: aumentam o alcance ou o detalhe (consultar livro oficial).'
  },
  {
    nome: 'Localização', circulo: '2', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Ilimitado', area: '', alvo: '1 ser ou objeto conhecido', duracao: 'Cena',
    resistencia: '',
    efeito: 'Determina em que direção está um objeto ou ser a sua escolha.',
    dados: 'Normal: direção do alvo', dadosDiscente: 'Discente: mais preciso', dadosVerdadeiro: 'Verdadeiro: localização perfeita',
    desc: 'Determina em que direção está um objeto ou ser a sua escolha.\n\nDiscente / Verdadeiro: aumentam a precisão (consultar livro oficial).'
  },
  {
    nome: 'Chamas do Caos', circulo: '2', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Médio', area: '', alvo: '1 ser ou ponto', duracao: 'Instantânea',
    resistencia: 'Reflexos parcial',
    efeito: 'Você controla o fogo do caos, causando dano de Energia/fogo no alvo ou ponto escolhido.',
    dados: 'Normal: dano de fogo/caos', dadosDiscente: 'Discente: dano maior', dadosVerdadeiro: 'Verdadeiro: área ampla',
    desc: 'Você controla o fogo do caos, causando dano de Energia/fogo no alvo ou ponto escolhido.\n\nDiscente: aumenta o dano.\n\nVerdadeiro: forma em área ampla (consultar livro oficial).'
  },
  {
    nome: 'Hemofagia', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: 'Fortitude parcial',
    efeito: 'Você drena o sangue/vida do alvo, causando dano de Sangue e recuperando PV.',
    dados: 'Normal: dano + cura', dadosDiscente: 'Discente: drenagem maior', dadosVerdadeiro: 'Verdadeiro: drenagem máxima',
    desc: 'Você drena o sangue/vida do alvo, causando dano de Sangue e recuperando PV.\n\nDiscente / Verdadeiro: aumentam dano e cura (consultar livro oficial).'
  },
  {
    nome: 'Aprimorar Físico', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: '',
    efeito: 'Concede bônus em atributos físicos (Força, Agilidade ou Vigor) durante a cena.',
    dados: 'Normal: bônus físico', dadosDiscente: 'Discente: bônus maior', dadosVerdadeiro: 'Verdadeiro: bônus máximo',
    desc: 'Concede bônus em atributos físicos durante a cena.\n\nDiscente / Verdadeiro: aumentam o bônus (consultar livro oficial).'
  },
  {
    nome: 'Transfusão Vital', circulo: '2', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'Transfere pontos de vida entre você e o alvo.',
    dados: 'Normal: transferir PV', dadosDiscente: 'Discente: quantidade maior', dadosVerdadeiro: 'Verdadeiro: transferência máxima',
    desc: 'Transfere pontos de vida entre você e o alvo.\n\nDiscente / Verdadeiro: aumentam a quantidade (consultar livro oficial).'
  },
  {
    nome: 'Paradoxo', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Vontade / Fortitude',
    efeito: 'Distorce o tempo do alvo, criando um paradoxo temporal que atrapalha suas ações.',
    dados: 'Normal: paradoxo temporal', dadosDiscente: 'Discente: efeito mais forte', dadosVerdadeiro: 'Verdadeiro: efeito máximo',
    desc: 'Distorce o tempo do alvo, criando um paradoxo temporal.\n\nDiscente / Verdadeiro: agravam o paradoxo (consultar livro oficial).'
  },
  {
    nome: 'Velocidade Mortal', circulo: '2', elemento: 'Morte',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você distorce o tempo ao seu redor e fica extremamente veloz.',
    dados: 'Normal: velocidade extrema', dadosDiscente: 'Discente: ainda mais rápido', dadosVerdadeiro: 'Verdadeiro: velocidade máxima',
    desc: 'Você distorce o tempo ao seu redor e fica extremamente veloz.\n\nDiscente / Verdadeiro: aumentam o efeito (consultar livro oficial).'
  },
  {
    nome: 'Rejeitar Névoa', circulo: '2', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Área', duracao: 'Cena',
    resistencia: '',
    efeito: 'Enfraquece a conjuração de rituais na área. Custa Sanidade (Medo).',
    dados: 'Normal: enfraquece rituais', dadosDiscente: 'Discente: penalidade maior', dadosVerdadeiro: 'Verdadeiro: quase anula rituais',
    desc: 'Enfraquece a conjuração de rituais na área. Custa Sanidade (Medo).\n\nDiscente / Verdadeiro: aumentam a penalidade; mais Sanidade nas formas avançadas.'
  },
  {
    nome: 'Contato Paranormal', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: '1 dia',
    resistencia: '',
    efeito: 'Você barganha com a entidade de Conhecimento para que o auxilie durante o dia, em troca de um preço.',
    dados: 'Normal: barganha com o Outro Lado', dadosDiscente: 'Discente: barganha melhor', dadosVerdadeiro: 'Verdadeiro: barganha máxima',
    desc: 'Você barganha com a entidade de Conhecimento para que o auxilie durante o dia, em troca de um preço (a critério do mestre).\n\nDiscente / Verdadeiro: melhoram o resultado ou reduzem o preço (consultar livro oficial).'
  },
  {
    nome: 'Mergulho Mental', circulo: '3', elemento: 'Conhecimento',
    execucao: 'Completa', alcance: 'Toque', area: '', alvo: '1 ser', duracao: 'Cena',
    resistencia: 'Vontade anula',
    efeito: 'Você se infiltra na mente do alvo para explorar memórias e fazer perguntas.',
    dados: 'Normal: explorar mente', dadosDiscente: 'Discente: mais profundo', dadosVerdadeiro: 'Verdadeiro: controle/exploração total',
    desc: 'Você se infiltra na mente do alvo para explorar memórias e fazer perguntas.\n\nDiscente / Verdadeiro: acesso mais profundo (consultar livro oficial).'
  },
  {
    nome: 'Dissipar Ritual', circulo: '3', elemento: 'Medo',
    execucao: 'Padrão', alcance: 'Médio', area: '', alvo: '1 ritual ou item amaldiçoado', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'Encerra a duração de um ritual ou desativa um item amaldiçoado. Custa Sanidade.',
    dados: 'Normal: dissipar 1 ritual/item', dadosDiscente: 'Discente: área / mais alvos', dadosVerdadeiro: 'Verdadeiro: dissipacão em massa',
    desc: 'Encerra a duração de um ritual ou desativa um item amaldiçoado. Custa Sanidade (Medo).\n\nDiscente / Verdadeiro: podem afetar área ou vários efeitos.'
  },
  {
    nome: 'Forma Monstruosa', circulo: '3', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você assume uma forma monstruosa de combate de Sangue.',
    dados: 'Normal: forma monstruosa', dadosDiscente: 'Discente: forma mais forte', dadosVerdadeiro: 'Verdadeiro: forma máxima',
    desc: 'Você assume uma forma monstruosa de combate de Sangue.\n\nDiscente / Verdadeiro: aumentam o poder da forma (consultar livro oficial).'
  },
  {
    nome: 'Teletransporte', circulo: '4', elemento: 'Energia',
    execucao: 'Padrão', alcance: 'Longo', area: '', alvo: 'Você ou grupo', duracao: 'Instantânea',
    resistencia: '',
    efeito: 'Transporta instantaneamente você (e possivelmente aliados próximos).',
    dados: 'Normal: teleporte', dadosDiscente: 'Discente: mais longe / mais pessoas', dadosVerdadeiro: 'Verdadeiro: qualquer local (conforme livro)',
    desc: 'Transporta instantaneamente você (e possivelmente aliados).\n\nDiscente / Verdadeiro: aumentam distância ou alvos (consultar livro oficial).'
  },
  {
    nome: 'Possessão', circulo: '4', elemento: 'Conhecimento',
    execucao: 'Padrão', alcance: 'Longo', area: '', alvo: '1 pessoa viva ou morta', duracao: '1 dia',
    resistencia: 'Vontade anula',
    efeito: 'Você projeta sua consciência no corpo de uma pessoa viva ou morta e assume o controle total.',
    dados: 'Normal: possessão 1 dia', dadosDiscente: 'Discente: mais estável', dadosVerdadeiro: 'Verdadeiro: domínio total',
    desc: 'Você projeta sua consciência no corpo de uma pessoa viva ou morta e assume o controle total.\n\nDiscente / Verdadeiro: facilitam manter o controle (consultar livro oficial).'
  },
  {
    nome: 'Canalizar o Medo', circulo: '4', elemento: 'Medo',
    execucao: 'Completa', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Cena',
    resistencia: '',
    efeito: 'Você canaliza o Medo puro. Perde Sanidade igual ao custo em PE do ritual.',
    dados: 'Normal: poder de Medo', dadosDiscente: 'Discente: mais poder (+ Sanidade)', dadosVerdadeiro: 'Verdadeiro: forma absoluta (+ Sanidade)',
    desc: 'Você canaliza o Medo puro. Perde Sanidade igual ao custo em PE.\n\nDiscente / Verdadeiro: poder maior; mais Sanidade nas formas avançadas.'
  },
  {
    nome: 'Martírio de Sangue', circulo: '4', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Pessoal', area: '', alvo: 'Você', duracao: 'Veja texto',
    resistencia: '',
    efeito: 'Você faz o sacrifício supremo e se entrega ao Sangue, sendo devorado em uma monstruosidade bestial.',
    dados: 'Normal: transformação de martírio', dadosDiscente: 'Discente: poder maior', dadosVerdadeiro: 'Verdadeiro: poder máximo',
    desc: 'Você faz o sacrifício supremo e se entrega ao Sangue.\n\nDiscente / Verdadeiro: aumentam o poder e o custo (consultar livro oficial).'
  },
  {
    nome: 'Vínculo de Sangue', circulo: '4', elemento: 'Sangue',
    execucao: 'Padrão', alcance: 'Curto', area: '', alvo: 'Seres marcados', duracao: 'Cena',
    resistencia: '',
    efeito: 'Liga dor e dano entre alvos marcados pelo ritual.',
    dados: 'Normal: vínculo de dor', dadosDiscente: 'Discente: vínculo mais forte', dadosVerdadeiro: 'Verdadeiro: vínculo total',
    desc: 'Liga dor e dano entre alvos marcados pelo ritual.\n\nDiscente / Verdadeiro: intensificam o vínculo (consultar livro oficial).'
  }
  ];
  if (typeof RITUAIS_CATALOG !== 'undefined') RITUAIS_CATALOG.push(...EXTRA);
  else window.RITUAIS_CATALOG = EXTRA;
})();
