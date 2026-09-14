// Catálogo de Habilidades — Ordem Paranormal RPG
// Resumos públicos (livro de regras + suplementos conhecidos). Não substitui o livro oficial.
const HABILIDADES_CATALOG = [
  // ========== COMBATENTE — PODERES DE CLASSE ==========
  { nome: 'Ataque Especial', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '5%', desc: 'Quando faz um ataque, gaste 2 PE para receber +5 no teste de ataque ou no dano. A cada avanço de NEX o bônus pode aumentar (+10, +15…) com custo adicional de PE.' },
  { nome: 'Armamento Pesado', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Você recebe proficiência com armas pesadas. Pré-requisito: Força 2.' },
  { nome: 'Artista Marcial', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Seus ataques desarmados causam 1d6 de dano letal e contam como armas ágeis. NEX 35%: 1d8. NEX 70%: 1d10.' },
  { nome: 'Ataque de Oportunidade', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Quando um ser hostil sai de um espaço adjacente ao seu, você pode gastar 1 PE e sua reação para fazer um ataque corpo a corpo contra ele.' },
  { nome: 'Combater com Duas Armas', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Se estiver empunhando duas armas (uma delas leve), quando usa a ação agredir pode fazer um ataque adicional com a outra arma.' },
  { nome: 'Combate Defensivo', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Você pode assumir postura defensiva: recebe bônus em Defesa com penalidade correspondente em testes de ataque.' },
  { nome: 'Golpe Demolidor', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Quando acerta um ataque corpo a corpo, pode tentar empurrar ou derrubar o alvo (teste oposto).' },
  { nome: 'Golpe Pesado', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Seus ataques corpo a corpo causam +2 de dano. Pode escalar com NEX.' },
  { nome: 'Incansável', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Você ignora parte das penalidades de fadiga e se recupera melhor em interlúdios.' },
  { nome: 'Presteza Atlética', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Bônus em Atletismo e em manobras de combate que envolvam força ou agilidade.' },
  { nome: 'Proteção Pesada', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Você recebe proficiência com proteções pesadas.' },
  { nome: 'Reflexos Defensivos', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Bônus em Esquiva e em reações defensivas.' },
  { nome: 'Saque Rápido', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Sacar ou guardar uma arma conta como ação livre (limites conforme o livro).' },
  { nome: 'Segurar o Gatilho', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Com armas de fogo, pode preparar um disparo para ganhar bônus ou reagir a movimentos do alvo.' },
  { nome: 'Sentidos Táticos', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Bônus em Percepção e Iniciativa; dificulta ser surpreendido em combate.' },
  { nome: 'Tanque de Guerra', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Mais resistência a dano e/ou PV temporários em combates prolongados.' },
  { nome: 'Tiro Certeiro', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Bônus em ataques à distância contra alvos em cobertura ou condições adversas.' },
  { nome: 'Tiro de Cobertura', classe: 'Combatente', categoria: 'Poderes de Combatente', nex: '', desc: 'Usa cobertura de forma eficiente ao atirar, reduzindo penalidades.' },

  // ========== COMBATENTE — ANIQUILADOR ==========
  { nome: 'A Favorita', classe: 'Combatente', categoria: 'Aniquilador', nex: '10%', desc: 'Escolha uma arma favorita. A categoria dessa arma é reduzida em I e ela ocupa 1 espaço a menos no inventário (mínimo 0).' },
  { nome: 'Técnica Secreta', classe: 'Combatente', categoria: 'Aniquilador', nex: '40%', desc: 'Categoria da favorita reduzida em II. Ao atacar com ela, gaste 2 PE para aplicar efeitos (Amplo, Destruidor); +2 PE por efeito extra.' },
  { nome: 'Técnica Sublime', classe: 'Combatente', categoria: 'Aniquilador', nex: '65%', desc: 'Novos efeitos disponíveis: Letal (+2 na margem de ameaça) e Perfurante (ignora RD 5).' },
  { nome: 'Máquina de Matar', classe: 'Combatente', categoria: 'Aniquilador', nex: '99%', desc: 'Favorita categoria -III, +2 na margem de ameaça e +1 dado de dano do mesmo tipo da arma.' },

  // ========== COMBATENTE — COMANDANTE DE CAMPO ==========
  { nome: 'Inspirar Confiança', classe: 'Combatente', categoria: 'Comandante de Campo', nex: '10%', desc: 'Gaste PE para inspirar um aliado: rerrolagem de teste ou bônus temporário em ataque/Defesa.' },
  { nome: 'Estrategista', classe: 'Combatente', categoria: 'Comandante de Campo', nex: '40%', desc: 'Gaste PE para conceder ação de movimento extra a um ou mais aliados em alcance.' },
  { nome: 'Campo Protetor', classe: 'Combatente', categoria: 'Comandante de Campo', nex: '65%', desc: 'Aliados próximos recebem bônus em Defesa e/ou resistência enquanto você estiver consciente.' },
  { nome: 'Oficial Comandante', classe: 'Combatente', categoria: 'Comandante de Campo', nex: '99%', desc: 'Ação padrão + 5 PE: aliados em alcance médio recebem uma ação padrão extra no próximo turno deles.' },

  // ========== COMBATENTE — GUERREIRO ==========
  { nome: 'Técnica Letal', classe: 'Combatente', categoria: 'Guerreiro', nex: '10%', desc: '+2 na margem de ameaça de seus ataques corpo a corpo.' },
  { nome: 'Retaliar', classe: 'Combatente', categoria: 'Guerreiro', nex: '40%', desc: 'Quando bloqueia um ataque, pode gastar PE para fazer um contra-ataque corpo a corpo.' },
  { nome: 'Potência Bruta', classe: 'Combatente', categoria: 'Guerreiro', nex: '65%', desc: 'Golpes corpo a corpo causam dano extra e/ou ignoram parte da RD do alvo.' },
  { nome: 'Potência Máxima', classe: 'Combatente', categoria: 'Guerreiro', nex: '99%', desc: 'Ao usar Ataque Especial em ataque corpo a corpo, os bônus numéricos são dobrados.' },

  // ========== COMBATENTE — OPERAÇÕES ESPECIAIS ==========
  { nome: 'Iniciativa Tática', classe: 'Combatente', categoria: 'Operações Especiais', nex: '10%', desc: 'Bônus em Iniciativa e vantagens no primeiro turno de combate.' },
  { nome: 'Movimento Tático', classe: 'Combatente', categoria: 'Operações Especiais', nex: '40%', desc: 'Pode se mover sem provocar ataques de oportunidade ou receber movimento extra ao gastar PE.' },
  { nome: 'Ação Extraordinária', classe: 'Combatente', categoria: 'Operações Especiais', nex: '65%', desc: '1x por rodada: gaste 5 PE para realizar uma ação padrão ou de movimento adicional.' },
  { nome: 'Sempre Alerta', classe: 'Combatente', categoria: 'Operações Especiais', nex: '99%', desc: 'No início de cada cena de combate, recebe uma ação padrão adicional.' },

  // ========== COMBATENTE — TROPA DE CHOQUE ==========
  { nome: 'Casca Grossa', classe: 'Combatente', categoria: 'Tropa de Choque', nex: '10%', desc: '+1 PV por cada 5% de NEX. Bloqueio com resistência extra a dano.' },
  { nome: 'Muralha', classe: 'Combatente', categoria: 'Tropa de Choque', nex: '40%', desc: 'Bônus em Defesa; pode proteger aliados adjacentes desviando ataques para si.' },
  { nome: 'Inquebrável', classe: 'Combatente', categoria: 'Tropa de Choque', nex: '65%', desc: 'Recebe RD adicional e resiste melhor a condições (sangramento, atordoado etc.).' },
  { nome: 'Último Homem de Pé', classe: 'Combatente', categoria: 'Tropa de Choque', nex: '99%', desc: '+5 Defesa e RD. Pode continuar lutando enquanto estiver no estado Morrendo (com limitações).' },

  // ========== COMBATENTE — AGENTE SECRETO (Sobrevivendo ao Horror) ==========
  { nome: 'Identidade Coberta', classe: 'Combatente', categoria: 'Agente Secreto', nex: '10%', desc: 'Bônus em Enganação e Furtividade para manter disfarces e operar sem chamar atenção.' },
  { nome: 'Operação Silenciosa', classe: 'Combatente', categoria: 'Agente Secreto', nex: '40%', desc: 'Ataques furtivos ou surpresa com armas leves/táticas causam dano adicional e dificultam alarme.' },
  { nome: 'Rede de Contatos', classe: 'Combatente', categoria: 'Agente Secreto', nex: '65%', desc: '1x por missão: gaste PE para obter informação, item ou acesso através de contatos discretos.' },
  { nome: 'Agente Fantasma', classe: 'Combatente', categoria: 'Agente Secreto', nex: '99%', desc: 'Pode desaparecer de cenas e reaparecer em posição tática (uso limitado por missão).' },

  // ========== COMBATENTE — CAÇADOR (Sobrevivendo ao Horror) ==========
  { nome: 'Marca da Caça', classe: 'Combatente', categoria: 'Caçador', nex: '10%', desc: 'Marque um alvo: recebe bônus em Percepção e ataques contra ele até o fim da cena.' },
  { nome: 'Rastrear', classe: 'Combatente', categoria: 'Caçador', nex: '40%', desc: 'Bônus altos em Investigarção/Sobrevivência para seguir rastros (mundanos ou paranormais).' },
  { nome: 'Tiro de Caçador', classe: 'Combatente', categoria: 'Caçador', nex: '65%', desc: 'Contra alvo marcado: dano extra e efeitos (sangramento, lentidão) ao gastar PE.' },
  { nome: 'Predador Apex', classe: 'Combatente', categoria: 'Caçador', nex: '99%', desc: 'Contra alvos marcados: críticos aprimorados e capacidade de finalizar alvos enfraquecidos.' },

  // ========== ESPECIALISTA — PODERES DE CLASSE ==========
  { nome: 'Eclético', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '5%', desc: 'Quando faz um teste de uma perícia, gaste 2 PE para receber os benefícios de ser treinado nela (mesmo sem treinamento).' },
  { nome: 'Perito', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '5%', desc: 'Escolha perícias treinadas (exceto Luta/Pontaria). Gaste 2 PE para somar +1d6 no teste. O dado escala com NEX (+1d8, +1d10, +1d12) com custo maior de PE.' },
  { nome: 'Artista Marcial', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Ataques desarmados: 1d6 letal e ágeis. NEX 35%: 1d8. NEX 70%: 1d10.' },
  { nome: 'Balística Avançada', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Proficiência com armas táticas de fogo e +2 no dano com armas de fogo.' },
  { nome: 'Conhecimento Aplicado', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Gaste 2 PE para usar Intelecto como atributo-base de uma perícia (exceto Luta e Pontaria). Pré: Int 2.' },
  { nome: 'Hacker', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: '+5 em Tecnologia para sistemas, redes e dispositivos digitais.' },
  { nome: 'Mãos Rápidas', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Ações de manipular objetos, sacar itens ou interagir com ambiente são mais rápidas (ação livre ou bônus).' },
  { nome: 'Mochila de Utilidades', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Um kit de perícia à sua escolha conta como categoria abaixo e ocupa 1 espaço a menos.' },
  { nome: 'Movimento Tático', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Gaste 1 PE para ignorar penalidade de terreno difícil e receber deslocamento de escalada igual ao seu até o fim do turno. Pré: treinado em Atletismo.' },
  { nome: 'Na Trilha Certa', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Em investigações, bônus cumulativo em testes sucessivos relacionados à mesma pista ao gastar PE.' },
  { nome: 'Nerd', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Repositório de conhecimento: gaste PE para receber informação útil sobre um assunto estudado na cena.' },
  { nome: 'Ninja Urbano', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Bônus em Furtividade e Acrobacia em ambientes urbanos; movimento furtivo aprimorado.' },
  { nome: 'Pensamento Ágil', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Pode gastar PE para agir fora da ordem de iniciativa ou reagendar ações em situações de pressão.' },
  { nome: 'Perito em Explosivos', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'Bônus para criar, desarmar e usar explosivos; dano e área aprimorados.' },
  { nome: 'Primeira Impressão', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '', desc: 'No primeiro teste social da cena (Diplomacia, Enganação ou Intimidação), pode gastar PE para grande bônus.' },
  { nome: 'Engenhosidade', classe: 'Especialista', categoria: 'Poderes de Especialista', nex: '40%', desc: 'Aprimora o uso de perícias e ferramentas (treinado → veterano em contextos específicos conforme NEX).' },

  // ========== ESPECIALISTA — ATIRADOR DE ELITE ==========
  { nome: 'Tiro Preciso', classe: 'Especialista', categoria: 'Atirador de Elite', nex: '10%', desc: 'Bônus em Pontaria e no dano com armas de precisão / longo alcance.' },
  { nome: 'Disparo Fatal', classe: 'Especialista', categoria: 'Atirador de Elite', nex: '40%', desc: '1x por cena: ataque preparado ou crítico com dano massivo adicional.' },
  { nome: 'Olho de Águia', classe: 'Especialista', categoria: 'Atirador de Elite', nex: '65%', desc: 'Ignora cobertura parcial; bônus em Percepção à distância.' },
  { nome: 'Assassino de Elite', classe: 'Especialista', categoria: 'Atirador de Elite', nex: '99%', desc: 'Ataques de elite podem deixar o alvo no estado Morrendo sob condições específicas (PV baixos / crítico).' },

  // ========== ESPECIALISTA — INFILTRADOR ==========
  { nome: 'Ataque Furtivo', classe: 'Especialista', categoria: 'Infiltrador', nex: '10%', desc: 'Quando ataca um alvo desprevenido ou flanqueado, gaste 1 PE para causar +1d6 de dano do mesmo tipo da arma. O número de d6 aumenta em 40%, 65% e 99%.' },
  { nome: 'Gatuno', classe: 'Especialista', categoria: 'Infiltrador', nex: '40%', desc: '+5 em Atletismo e Crime. Pode se mover em velocidade normal enquanto está escondido, sem penalidade.' },
  { nome: 'Assassinar', classe: 'Especialista', categoria: 'Infiltrador', nex: '65%', desc: 'Contra alvo desprevenido: teste especial (DT baseada em Agi) para causar dano massivo ou condição grave.' },
  { nome: 'Sombra Fugaz', classe: 'Especialista', categoria: 'Infiltrador', nex: '99%', desc: 'Pode entrar e sair de esconderijo com extrema facilidade; ataques furtivos maximizados.' },

  // ========== ESPECIALISTA — MÉDICO DE CAMPO ==========
  { nome: 'Paramédico', classe: 'Especialista', categoria: 'Médico de Campo', nex: '10%', desc: 'Gaste 2 PE ou mais em ação para curar PV de um alvo (cura escala com PE e Medicina).' },
  { nome: 'Cirurgia de Campo', classe: 'Especialista', categoria: 'Médico de Campo', nex: '40%', desc: 'Remove condições graves e recupera quantidade significativa de PV com teste de Medicina + PE.' },
  { nome: 'Antídoto Rápido', classe: 'Especialista', categoria: 'Médico de Campo', nex: '65%', desc: 'Trata venenos, doenças e efeitos paranormais com maior eficácia e menor tempo.' },
  { nome: 'Milagre Médico', classe: 'Especialista', categoria: 'Médico de Campo', nex: '99%', desc: '1x por cena: traz um aliado do estado Morrendo para consciente com PV recuperados.' },

  // ========== ESPECIALISTA — NEGOCIADOR ==========
  { nome: 'Eloquência', classe: 'Especialista', categoria: 'Negociador', nex: '10%', desc: 'Ação completa + 1 PE por alvo em alcance curto: teste de Diplomacia/Enganação/Intimidação vs Vontade. Em sucesso, alvos ficam fascinados.' },
  { nome: 'Leitura Fria', classe: 'Especialista', categoria: 'Negociador', nex: '40%', desc: 'Bônus em Intuição para ler intenções; pode forçar rerrolagens sociais adversas.' },
  { nome: 'Plano de Fuga Verbal', classe: 'Especialista', categoria: 'Negociador', nex: '65%', desc: 'Em situações sociais tensas, gaste PE para redirecionar hostilidade ou abrir caminho de retirada.' },
  { nome: 'Mestre da Lábia', classe: 'Especialista', categoria: 'Negociador', nex: '99%', desc: 'Testes sociais em grande escala; pode afetar grupos inteiros ou mudar atitude de NPCs poderosos 1x por missão.' },

  // ========== ESPECIALISTA — TÉCNICO ==========
  { nome: 'Inventário Organizado', classe: 'Especialista', categoria: 'Técnico', nex: '10%', desc: 'Recebe espaços extras de inventário para carregar equipamentos da equipe.' },
  { nome: 'Improviso Técnico', classe: 'Especialista', categoria: 'Técnico', nex: '40%', desc: 'Pode improvisar ferramentas e reparos com materiais disponíveis; bônus em Tecnologia e Profissão.' },
  { nome: 'Campo de Trabalho', classe: 'Especialista', categoria: 'Técnico', nex: '65%', desc: 'Cria área ou setup que concede bônus à equipe em investigação, cura ou combate preparado.' },
  { nome: 'Gênio da Oficina', classe: 'Especialista', categoria: 'Técnico', nex: '99%', desc: 'Modifica equipamentos de forma permanente (dentro dos limites do mestre); inventário e kits maximizados.' },

  // ========== ESPECIALISTA — BIBLIOTECÁRIO / MUAMBEIRO / PERSEVERANTE (resumo) ==========
  { nome: 'Arquivo Mental', classe: 'Especialista', categoria: 'Bibliotecário', nex: '10%', desc: 'Bônus em Ciências e Investigação; pode “consultar” conhecimento memorizado gastando PE.' },
  { nome: 'Pesquisa Acelerada', classe: 'Especialista', categoria: 'Bibliotecário', nex: '40%', desc: 'Reduz drasticamente o tempo de pesquisas e encontra pistas em documentos com mais facilidade.' },
  { nome: 'Contrabando Útil', classe: 'Especialista', categoria: 'Muambeiro', nex: '10%', desc: 'Acesso a itens de categorias superiores ocasionalmente; bônus em Crime e Negociação de equipamentos.' },
  { nome: 'Rede de Favores', classe: 'Especialista', categoria: 'Muambeiro', nex: '40%', desc: '1x por missão: obtém item ou serviço especial através de contatos duvidosos.' },
  { nome: 'Resistência Inabalável', classe: 'Especialista', categoria: 'Perseverante', nex: '10%', desc: 'Bônus em Vontade e Fortitude; mais difícil de ser abalado por medo ou dor.' },
  { nome: 'Segundo Fôlego', classe: 'Especialista', categoria: 'Perseverante', nex: '40%', desc: 'Quando fica com poucos PV/SAN, pode gastar PE para recuperar parte dos recursos 1x por cena.' },

  // ========== OCULTISTA — PODERES DE CLASSE ==========
  { nome: 'Escolhido pelo Outro Lado', classe: 'Ocultista', categoria: 'Poderes de Ocultista', nex: '5%', desc: 'Aprende rituais de 1º círculo e se conecta a um elemento do Outro Lado. Base de toda progressão de rituais do ocultista.' },
  { nome: 'Camuflar Ocultismo', classe: 'Ocultista', categoria: 'Poderes de Ocultista', nex: '', desc: 'Ação livre: esconde símbolos e sigilos. Pode gastar +2 PE ao lançar ritual para dificultar identificação.' },
  { nome: 'Especialista em Elemento', classe: 'Ocultista', categoria: 'Poderes de Ocultista', nex: '', desc: 'Escolha um elemento: a DT dos seus rituais desse elemento aumenta em +2.' },
  { nome: 'Ferramentas Paranormais', classe: 'Ocultista', categoria: 'Poderes de Ocultista', nex: '', desc: 'Catalisadores e componentes se tornam mais eficientes (redução de custo ou bônus).' },
  { nome: 'Presença Inquietante', classe: 'Ocultista', categoria: 'Poderes de Ocultista', nex: '', desc: '+5 em Enganação e Intimidação contra quem não é treinado em Ocultismo.' },

  // ========== OCULTISTA — CONDUÍTE ==========
  { nome: 'Ampliar Ritual', classe: 'Ocultista', categoria: 'Conduíte', nex: '10%', desc: 'Gaste +2 PE ao conjurar: aumenta o alcance em um passo ou dobra a área do ritual.' },
  { nome: 'Acelerar Ritual', classe: 'Ocultista', categoria: 'Conduíte', nex: '40%', desc: '1x por rodada: reduz o tempo de execução de um ritual (padrão → movimento, etc., conforme regras).' },
  { nome: 'Interferir Ritual', classe: 'Ocultista', categoria: 'Conduíte', nex: '65%', desc: 'Pode interromper, desviar ou alterar rituais de outros em alcance (teste oposto de Ocultismo).' },
  { nome: 'Mestre dos Rituais', classe: 'Ocultista', categoria: 'Conduíte', nex: '99%', desc: 'Alcance e área amplos; conjura em condições extremas e com menos restrições.' },

  // ========== OCULTISTA — LÂMINA PARANORMAL ==========
  { nome: 'Lâmina Maldita', classe: 'Ocultista', categoria: 'Lâmina Paranormal', nex: '10%', desc: 'Aprende o ritual Amaldiçoar Arma. Pode usar Ocultismo no lugar de Luta ao atacar com a arma amaldiçoada.' },
  { nome: 'Gladiador Paranormal', classe: 'Ocultista', categoria: 'Lâmina Paranormal', nex: '40%', desc: 'Quando acerta um ataque corpo a corpo, recebe 2 PE temporários (limite por cena).' },
  { nome: 'Conjuração Marcial', classe: 'Ocultista', categoria: 'Lâmina Paranormal', nex: '65%', desc: '1x por rodada: ao lançar um ritual de ação padrão, gaste 2 PE para fazer um ataque corpo a corpo como ação livre.' },
  { nome: 'Lâmina do Medo', classe: 'Ocultista', categoria: 'Lâmina Paranormal', nex: '99%', desc: 'Aprende o ritual Lâmina do Medo. 1x por cena, ao acertar, pode deixar o alvo no estado Morrendo.' },

  // ========== OCULTISTA — FLAGELADOR ==========
  { nome: 'Flagelo Interior', classe: 'Ocultista', categoria: 'Flagelador', nex: '10%', desc: 'Canaliza dor em poder: gaste PV ou SAN para obter bônus em rituais ou testes de Ocultismo.' },
  { nome: 'Sacrifício Controlado', classe: 'Ocultista', categoria: 'Flagelador', nex: '40%', desc: 'Converte dano sofrido recentemente em bônus para a próxima conjuração.' },
  { nome: 'Martírio Útil', classe: 'Ocultista', categoria: 'Flagelador', nex: '65%', desc: 'Autoflagelo (gasto de PV) concede PE temporários ou aumenta a DT de rituais.' },
  { nome: 'Sangue do Outro Lado', classe: 'Ocultista', categoria: 'Flagelador', nex: '99%', desc: 'Sacrifício supremo: rituais poderosíssimos a alto custo de PV/SAN, com efeitos devastadores.' },

  // ========== OCULTISTA — GRADUADO ==========
  { nome: 'Estudante Avançado', classe: 'Ocultista', categoria: 'Graduado', nex: '10%', desc: 'Aprende rituais adicionais ou reduz requisitos de círculo para rituais conhecidos.' },
  { nome: 'Tese Ocultista', classe: 'Ocultista', categoria: 'Graduado', nex: '40%', desc: 'Especialização: bônus em DT ou redução de PE em um tipo/elemento de ritual.' },
  { nome: 'Doutorado do Medo', classe: 'Ocultista', categoria: 'Graduado', nex: '65%', desc: 'Improvisa efeitos rituais menores com conhecimento profundo; mais flexibilidade de conjuração.' },
  { nome: 'Arquimago da Ordem', classe: 'Ocultista', categoria: 'Graduado', nex: '99%', desc: 'Máximo domínio: quantidade elevada de rituais conhecidos e conjuração otimizada.' },

  // ========== OCULTISTA — INTUITIVO ==========
  { nome: 'Intuição Paranormal', classe: 'Ocultista', categoria: 'Intuitivo', nex: '10%', desc: 'Percebe manifestações paranormais com mais facilidade (bônus em Percepção/Ocultismo para detectar).' },
  { nome: 'Presságio', classe: 'Ocultista', categoria: 'Intuitivo', nex: '40%', desc: '1x por cena: recebe visão ou vantagem em um teste crucial (ataque, resistência ou investigação).' },
  { nome: 'Sintonizar Entidade', classe: 'Ocultista', categoria: 'Intuitivo', nex: '65%', desc: 'Conecta-se temporariamente a uma entidade para bônus de elemento em rituais e testes.' },
  { nome: 'Voz do Outro Lado', classe: 'Ocultista', categoria: 'Intuitivo', nex: '99%', desc: 'Intuição quase infalível para detectar o paranormal; avisos automáticos de ameaças próximas.' },

  // ========== OCULTISTA — OUTRAS TRILHAS (resumo) ==========
  { nome: 'Exorcismo', classe: 'Ocultista', categoria: 'Exorcista', nex: '10%', desc: 'Bônus contra entidades e possessões; pode gastar PE para expulsar ou enfraquecer presenças.' },
  { nome: 'Círculo de Banimento', classe: 'Ocultista', categoria: 'Exorcista', nex: '40%', desc: 'Cria área que dificulta ações de criaturas paranormais e possessões.' },
  { nome: 'Análise Paranormal', classe: 'Ocultista', categoria: 'Parapsicólogo', nex: '10%', desc: 'Estuda mentes e fenômenos: bônus em testes para identificar poderes, rituais e estados mentais.' },
  { nome: 'Hospedeiro Consciente', classe: 'Ocultista', categoria: 'Possuído', nex: '10%', desc: 'Canaliza uma entidade de forma controlada: bônus temporários com risco de perda de controle.' },
  { nome: 'Escudo de Sangue', classe: 'Ocultista', categoria: 'Afinidade Sangue', nex: '10%', desc: 'Ao conjurar ritual de Sangue, recebe bônus na Defesa igual aos PE gastos até o próximo turno.' },
  { nome: 'Crosta de Sangue', classe: 'Ocultista', categoria: 'Afinidade Sangue', nex: '65%', desc: 'Ao conjurar ritual de Sangue, recebe PV temporários iguais aos PE gastos no ritual.' },
  { nome: 'Domínio de Sangue', classe: 'Ocultista', categoria: 'Afinidade Sangue', nex: '99%', desc: 'Imune a dano/efeitos negativos de Sangue. Pode gastar PE extras para dano máximo e/ou +10 na DT de rituais de Sangue.' },

  // ========== ORIGENS (exemplos principais) ==========
  { nome: 'Acadêmico', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias típicas: Ciências e Investigação. Poder: bônus em testes de conhecimento e pesquisa.' },
  { nome: 'Agente de Saúde', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Medicina e Percecpção/Vontade. Poder ligado a cura e diagnóstico rápido.' },
  { nome: 'Artista', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias sociais/artísticas. Poder: influenciar emoções ou distrair com performance.' },
  { nome: 'Atleta', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Atletismo e Reflexos/Fortitude. Poder: esforço físico extremo 1x por cena.' },
  { nome: 'Chef do Outro Lado', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Ocultismo e Profissão (cozinheiro). Poder: Fome do Outro Lado (efeitos através de comida/ritual).' },
  { nome: 'Criminoso', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Crime e Furtividade. Poder: contatos no submundo ou golpe sujo em combate.' },
  { nome: 'Cultista Arrependido', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Ocultismo e Vontade. Poder: resistência a efeitos de um elemento ou conhecimento de rituais básicos.' },
  { nome: 'Desgarrado', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias de sobrevivência. Poder: improvisar recursos e resistir a privações.' },
  { nome: 'Engenheiro', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Tecnologia e Profissão. Poder: reparos e improvisos mecânicos rápidos.' },
  { nome: 'Executivo', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias sociais e Intuição. Poder: recursos financeiros ou influência institucional.' },
  { nome: 'Experimentado', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Sobrevivente de evento paranormal. Poder: resistência a um tipo de efeito paranormal.' },
  { nome: 'Investigador Particular', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Investigação e Percepção. Poder: achar pistas ocultas com mais facilidade.' },
  { nome: 'Militar', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Pontaria/Luta e Fortitude. Poder: Parabellum — +2 de dano com armas de fogo (conforme texto).' },
  { nome: 'Operário', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias manuais. Poder: Ferramenta de Trabalho — bônus com ferramentas e perícias práticas.' },
  { nome: 'Religioso', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Religião e Vontade. Poder: fé como escudo contra o medo e o paranormal.' },
  { nome: 'T.I.', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias: Tecnologia e Ciências. Poder: Motor de Busca — bônus em investigação digital e sistemas.' },
  { nome: 'Trabalhador Rural / Fazendeiro', classe: 'Origens', categoria: 'Origens', nex: '', desc: 'Perícias de sobrevivência e percepção no campo. Poder ligado a resistência e conhecimento natural.' },

  // ========== PODERES PARANORMAIS ==========
  { nome: 'Aprender Ritual', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Aprende um ritual de 1º círculo (círculos maiores em NEX alto). Pode substituir um ritual já conhecido.' },
  { nome: 'Resistir a Elemento', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Resistência 10 a um elemento escolhido (Afinidade: Resistência 20).' },
  { nome: 'Afortunado', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: '1x por rolagem: rerrola resultado 1 (exceto d20). Com Afinidade: também pode rerrolar 1 em d20.' },
  { nome: 'Precognição', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Sexto sentido: sente ameaças próximas (bônus em Iniciativa/Percepção em situações de perigo).' },
  { nome: 'Zona dos Sussurros', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Marca uma área: facilita furtividade e ataques do usuário dentro dela (Conhecimento).' },
  { nome: 'Pele de Ferro', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'RD temporária ou permanente leve contra dano físico (Sangue/Morte conforme afinidade).' },
  { nome: 'Sentir o Medo', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Detecta o medo em criaturas próximas; bônus em Intimidação e em rituais de Medo.' },
  { nome: 'Eco de Energia', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Após conjurar ritual de Energia, recebe PE temporários ou bônus no próximo teste.' },
  { nome: 'Visão do Outro Lado', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Enxerga manifestações invisíveis e auras elementais por um curto período ao gastar PE.' },
  { nome: 'Afinidade Elemental', classe: 'Poderes Paranormais', categoria: 'Poderes Paranormais', nex: '', desc: 'Escolha um elemento: rituais e poderes desse elemento ficam mais fortes (DT, dano ou custo).' }
];

const HABILIDADES_CATEGORIAS = {
  'Combatente': [
    'Poderes de Combatente',
    'Aniquilador',
    'Comandante de Campo',
    'Guerreiro',
    'Operações Especiais',
    'Tropa de Choque',
    'Agente Secreto',
    'Caçador'
  ],
  'Especialista': [
    'Poderes de Especialista',
    'Atirador de Elite',
    'Infiltrador',
    'Médico de Campo',
    'Negociador',
    'Técnico',
    'Bibliotecário',
    'Muambeiro',
    'Perseverante'
  ],
  'Ocultista': [
    'Poderes de Ocultista',
    'Conduíte',
    'Lâmina Paranormal',
    'Flagelador',
    'Graduado',
    'Intuitivo',
    'Exorcista',
    'Parapsicólogo',
    'Possuído',
    'Afinidade Sangue'
  ],
  'Origens': ['Origens'],
  'Poderes Paranormais': ['Poderes Paranormais']
};
