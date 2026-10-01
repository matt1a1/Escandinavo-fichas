/* arquivos-secretos-trilhas.js — 24 habilidades de trilhas dos Arquivos Secretos */
(function () {
  var TRILHAS_AS = [{"nome":"Identificação Macabra","tipo":"trilha","livro":"Sangue","desc":"Gasta 1 PE para +1d10 ao identificar item amaldiçoado/ritual; sofre só –O para identificar item amaldiçoado como ação completa.","classe":"Ocultista","trilha":"Maledictólogo","nex":"10%"},{"nome":"Compreensão de Maldições","tipo":"trilha","livro":"Sangue","desc":"Ação de interlúdio + 3 PE para estudar item amaldiçoado; teste de Ocultismo (DT 10 + 5 por categoria). Falha: perde 2d4+2 SAN. Sucesso com ritual embutido: perde 1d4+1 SAN, aprende o ritual (fora do limite), item consumido. Sem ritual: pode transferir a maldição.","classe":"Ocultista","trilha":"Maledictólogo","nex":"40%"},{"nome":"Reproduzir Maldição","tipo":"trilha","livro":"Sangue","desc":"Memoriza (interlúdio + 3 PE) uma maldição vivenciada; aplica a novo item (interlúdio + 3 PE, Ocultismo DT 10+5/cat). Falha: –2d8+2 SAN. Sucesso: –1d8+1 SAN, item recebe maldição e sobe de categoria (máx. IV).","classe":"Ocultista","trilha":"Maledictólogo","nex":"65%"},{"nome":"Maldição Suprema","tipo":"trilha","livro":"Sangue","desc":"Ao usar Reproduzir Maldição, trata o item-alvo como 3 categorias abaixo do real (permite superar limite de categoria IV temporariamente).","classe":"Ocultista","trilha":"Maledictólogo","nex":"99%"},{"nome":"Ensaio","tipo":"trilha","livro":"Hexatombe II","desc":"Nova ação de interlúdio: ensaiar combate — +1 na margem de ameaça até próxima cena de interlúdio (+2/+3/+4 em NEX 40/65/99%). Só 1x por cena; aliados podem ensaiar junto.","trilha":"Performático","nex":"10%"},{"nome":"Frase de Efeito","tipo":"trilha","livro":"Hexatombe II","desc":"Quando você ou aliado em alcance curto tira crítico, gasta 2 PE para mudar multiplicador de crítico para sua Presença (ou +1 se Pre ≤ mult atual).","trilha":"Performático","nex":"40%"},{"nome":"Mosh Pit","tipo":"trilha","livro":"Hexatombe II","desc":"Flanqueando um alvo com aliados: você e todos flanqueando/adjacentes ganham +1d6 no dano por aliado cercando (máx. +5d6).","trilha":"Performático","nex":"65%"},{"nome":"Ritmo Contagiante","tipo":"trilha","livro":"Hexatombe II","desc":"No início de combate, você e aliados em alcance médio ganham +5 Defesa até o fim; sobe +1 a cada crítico seu.","trilha":"Performático","nex":"99%"},{"nome":"Meus Bebês","tipo":"trilha","livro":"Anfitrião","desc":"Treino em Profissão (químico) ou +5; começa missão com 1 explosivo autoral (não conta no limite); +1 explosivo inicial por outra habilidade desta trilha; autorais = 1 cat. a menos.","classe":"Especialista","trilha":"Granadeiro Blaster","nex":"10%"},{"nome":"O Calor do Momento","tipo":"trilha","livro":"Anfitrião","desc":"1x/cena, ação padrão + 2 PE (+2/cat) cria explosivo autoral na hora; se não usar, explode no seu espaço no fim do turno.","classe":"Especialista","trilha":"Granadeiro Blaster","nex":"40%"},{"nome":"Fogo Amigo","tipo":"trilha","livro":"Anfitrião","desc":"Ganha Perito em Explosivos; ao adquirir de novo: +2 resistência aos próprios e +2 alvos extras na área.","classe":"Especialista","trilha":"Granadeiro Blaster","nex":"65%"},{"nome":"Memória Muscular","tipo":"trilha","livro":"Anfitrião","desc":"Você e aliados adjacentes sacam explosivo autoral como ação livre; 4 PE usa como ação de movimento.","classe":"Especialista","trilha":"Granadeiro Blaster","nex":"99%"},{"nome":"Método Intuitivo","tipo":"trilha","livro":"SDOL","desc":"Ganha Criar Selo; se adquirir de novo, dobra selos simultâneos e cria 2 por interlúdio; +1 selo/interlúdio por outra habilidade desta trilha.","classe":"Ocultista","trilha":"Criptologista do Oculto","nex":"10%"},{"nome":"Caligrafia Eficiente","tipo":"trilha","livro":"SDOL","desc":"Selos mais fáceis: quem não conhece usa Ocultismo DT 10+custo PE; +5 para identificar rituais em selos.","classe":"Ocultista","trilha":"Criptologista do Oculto","nex":"40%"},{"nome":"Decifrar à Distância","tipo":"trilha","livro":"SDOL","desc":"Usa Selo sem empunhar nem ler em voz alta (só ler mentalmente a até curto); +5 em Sigilos/Símbolos.","classe":"Ocultista","trilha":"Criptologista do Oculto","nex":"65%"},{"nome":"Selo Supremo","tipo":"trilha","livro":"SDOL","desc":"Selos dispensam teste de Ocultismo; rituais neles +5 DT, +3 dados de dano, dispensam custo de PE do círculo.","classe":"Ocultista","trilha":"Criptologista do Oculto","nex":"99%"},{"nome":"Ser Experimentado","tipo":"trilha","livro":"Vampyr","desc":"Treino em Ocultismo (ou +2); escolhe 1 elemento; –2 Diplomacia/Enganação/Intuição; experimento 1d8+1 PV. Poderes por elemento.","classe":"Especialista","trilha":"Monstruoso","nex":"10%"},{"nome":"Ser Testado","tipo":"trilha","livro":"Vampyr","desc":"Penalidade social –5; experimento 2d8+2 PV. Poderes por elemento (dano, RD, necrose, etc.).","classe":"Especialista","trilha":"Monstruoso","nex":"40%"},{"nome":"Ser Expurgado","tipo":"trilha","livro":"Vampyr","desc":"Presença –1; braço paranormal; experimento 3d8+3 PV. Braço com efeitos por elemento.","classe":"Especialista","trilha":"Monstruoso","nex":"65%"},{"nome":"Ser Apavorante","tipo":"trilha","livro":"Vampyr","desc":"Presença –1 (total –2); penalidade –10; experimento 4d8+4 PV. Forma monstruosa completa do elemento.","classe":"Especialista","trilha":"Monstruoso","nex":"99%"},{"nome":"Ser Rasgado","tipo":"trilha","livro":"Vampyr","desc":"Treino em Ocultismo (ou +2); escolhe 1 elemento; –2 sociais; escarificação 1d6 PE. Conjura rituais do elemento com PE reduzido.","classe":"Ocultista","trilha":"Monstruoso","nex":"10%"},{"nome":"Ser Dilacerado","tipo":"trilha","livro":"Vampyr","desc":"Penalidade social –5; escarificação 1d8 PE. Efeitos de conjuração por elemento.","classe":"Ocultista","trilha":"Monstruoso","nex":"40%"},{"nome":"Ser Despedaçado","tipo":"trilha","livro":"Vampyr","desc":"Presença –1; escarificação 1d10 PE. Amplia rituais do elemento.","classe":"Ocultista","trilha":"Monstruoso","nex":"65%"},{"nome":"Ser Mutilado","tipo":"trilha","livro":"Vampyr","desc":"Presença –1 (total –2); penalidade –10; escarificação 1d12 PE. Conjura sem fala/gestos + ritual de 4º círculo do elemento.","classe":"Ocultista","trilha":"Monstruoso","nex":"99%"}];

  var root = typeof window !== 'undefined' ? window : globalThis;
  if (typeof root.ARQUIVOS_SECRETOS === 'undefined') {
    root.ARQUIVOS_SECRETOS = [];
  }
  var AS = root.ARQUIVOS_SECRETOS;
  TRILHAS_AS.forEach(function (e) {
    var exists = AS.some(function (x) {
      return x.tipo === 'trilha' && x.nome === e.nome && (x.trilha || '') === (e.trilha || '');
    });
    if (!exists) AS.push(e);
  });
  root.ARQUIVOS_SECRETOS = AS;

  if (typeof HABILIDADES_CATALOG === 'undefined') return;
  if (typeof HABILIDADES_CATEGORIAS === 'undefined') {
    root.HABILIDADES_CATEGORIAS = {};
  }

  function mapClasse(e) {
    var c = e.classe || '';
    if (/combatente/i.test(c)) return 'Combatente';
    if (/especialista/i.test(c)) return 'Especialista';
    if (/ocultista/i.test(c)) return 'Ocultista';
    if (/perform/i.test(e.trilha || '')) return null;
    return 'Ocultista';
  }

  TRILHAS_AS.forEach(function (e) {
    var cat = e.trilha || e.nome;
    var classes = [];
    var mapped = mapClasse(e);
    if (mapped === null) classes = ['Combatente', 'Especialista', 'Ocultista'];
    else if (mapped) classes = [mapped];
    else classes = ['Ocultista'];

    classes.forEach(function (cls) {
      if (!HABILIDADES_CATEGORIAS[cls]) HABILIDADES_CATEGORIAS[cls] = [];
      if (HABILIDADES_CATEGORIAS[cls].indexOf(cat) === -1) {
        HABILIDADES_CATEGORIAS[cls].push(cat);
      }
      var exists = HABILIDADES_CATALOG.some(function (h) {
        return h.classe === cls && h.nome === e.nome && h.categoria === cat;
      });
      if (exists) return;
      HABILIDADES_CATALOG.push({
        nome: e.nome,
        classe: cls,
        categoria: cat,
        nex: e.nex || '',
        pe: '',
        desc: '[Arquivos Secretos — ' + (e.livro || '') + ' · Trilha ' + cat + '] ' + (e.desc || '')
      });
    });
  });

  if (typeof root.refreshHabilidadesCatalog === 'function') {
    try { root.refreshHabilidadesCatalog(); } catch (err) {}
  }
  if (typeof root.initHabilidadesUI === 'function') {
    try { root.initHabilidadesUI(); } catch (err) {}
  }
})();
