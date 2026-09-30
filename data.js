// Dados oficiais de Ordem Paranormal RPG (1ª edição)

// Estrutura alinhada ao C.R.I.S. (trainingDegree: 0|5|10|15, otherBonus, loadPenalty, onlyTrained)
const PERICIAS = [
  { id: 'acrobacia', nome: 'Acrobacia+', attr: 'AGI', onlyTrained: false, loadPenalty: true },
  { id: 'adestramento', nome: 'Adestramento*', attr: 'PRE', onlyTrained: true, loadPenalty: false },
  { id: 'artes', nome: 'Artes*', attr: 'PRE', onlyTrained: true, loadPenalty: false },
  { id: 'atletismo', nome: 'Atletismo', attr: 'FOR', onlyTrained: false, loadPenalty: true },
  { id: 'atualidades', nome: 'Atualidades', attr: 'INT', onlyTrained: false, loadPenalty: false },
  { id: 'ciencias', nome: 'Ciências*', attr: 'INT', onlyTrained: true, loadPenalty: false },
  { id: 'crime', nome: 'Crime*+', attr: 'AGI', onlyTrained: true, loadPenalty: true },
  { id: 'diplomacia', nome: 'Diplomacia', attr: 'PRE', onlyTrained: false, loadPenalty: false },
  { id: 'enganacao', nome: 'Enganação', attr: 'PRE', onlyTrained: false, loadPenalty: false },
  { id: 'fortitude', nome: 'Fortitude', attr: 'VIG', onlyTrained: false, loadPenalty: false },
  { id: 'furtividade', nome: 'Furtividade+', attr: 'AGI', onlyTrained: false, loadPenalty: true },
  { id: 'iniciativa', nome: 'Iniciativa', attr: 'AGI', onlyTrained: false, loadPenalty: false },
  { id: 'intimidacao', nome: 'Intimidação', attr: 'PRE', onlyTrained: false, loadPenalty: false },
  { id: 'intuicao', nome: 'Intuição', attr: 'PRE', onlyTrained: false, loadPenalty: false },
  { id: 'investigacao', nome: 'Investigação', attr: 'INT', onlyTrained: false, loadPenalty: false },
  { id: 'luta', nome: 'Luta', attr: 'FOR', onlyTrained: false, loadPenalty: false },
  { id: 'medicina', nome: 'Medicina', attr: 'INT', onlyTrained: false, loadPenalty: false },
  { id: 'ocultismo', nome: 'Ocultismo*', attr: 'INT', onlyTrained: true, loadPenalty: false },
  { id: 'percepcao', nome: 'Percepção', attr: 'PRE', onlyTrained: false, loadPenalty: false },
  { id: 'pilotagem', nome: 'Pilotagem*', attr: 'AGI', onlyTrained: true, loadPenalty: false },
  { id: 'pontaria', nome: 'Pontaria', attr: 'AGI', onlyTrained: false, loadPenalty: false },
  { id: 'profissao', nome: 'Profissão*', attr: 'INT', onlyTrained: true, loadPenalty: false },
  { id: 'reflexos', nome: 'Reflexos', attr: 'AGI', onlyTrained: false, loadPenalty: false },
  { id: 'religiao', nome: 'Religião*', attr: 'PRE', onlyTrained: true, loadPenalty: false },
  { id: 'sobrevivencia', nome: 'Sobrevivência', attr: 'INT', onlyTrained: false, loadPenalty: false },
  { id: 'tatica', nome: 'Tática*', attr: 'INT', onlyTrained: true, loadPenalty: false },
  { id: 'tecnologia', nome: 'Tecnologia*', attr: 'INT', onlyTrained: true, loadPenalty: false },
  { id: 'vontade', nome: 'Vontade', attr: 'PRE', onlyTrained: false, loadPenalty: false },
];

const ITEM_CATEGORIES = ['0', 'I', 'II', 'III', 'IV'];
const ELEMENTOS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Outro'];

const ORIGENS = {
  academico: { nome: 'Acadêmico', pericias: ['ciencias', 'investigacao'], poder: 'Saber é Poder' },
  agente_saude: { nome: 'Agente de Saúde', pericias: ['intuicao', 'medicina'], poder: 'Técnica Medicinal' },
  amnesico: { nome: 'Amnésico', pericias: [], poder: 'Vislumbres do Passado' },
  artista: { nome: 'Artista', pericias: ['artes', 'enganacao'], poder: 'Magnum Opus' },
  atleta: { nome: 'Atleta', pericias: ['acrobacia', 'atletismo'], poder: '110%' },
  chef: { nome: 'Chef', pericias: ['fortitude', 'profissao'], poder: 'Ingrediente Secreto' },
  criminoso: { nome: 'Criminoso', pericias: ['crime', 'furtividade'], poder: 'O Crime Compensa' },
  cultista: { nome: 'Cultista Arrependido', pericias: ['ocultismo', 'religiao'], poder: 'Traços do Outro Lado' },
  desgarrado: { nome: 'Desgarrado', pericias: ['fortitude', 'sobrevivencia'], poder: 'Calejado' },
  engenheiro: { nome: 'Engenheiro', pericias: ['profissao', 'tecnologia'], poder: 'Ferramenta Favorita' },
  executivo: { nome: 'Executivo', pericias: ['diplomacia', 'profissao'], poder: 'Processo Otimizado' },
  investigador: { nome: 'Investigador', pericias: ['investigacao', 'percepcao'], poder: 'Faro para Pistas' },
  lutador: { nome: 'Lutador', pericias: ['luta', 'reflexos'], poder: 'Mão Pesada' },
  magnata: { nome: 'Magnata', pericias: ['diplomacia', 'pilotagem'], poder: 'Patrocinador da Ordem' },
  mercenaria: { nome: 'Mercenário', pericias: ['iniciativa', 'intimidacao'], poder: 'Posição de Combate' },
  militar: { nome: 'Militar', pericias: ['pontaria', 'tatica'], poder: 'Para Bellum' },
  operario: { nome: 'Operário', pericias: ['fortitude', 'profissao'], poder: 'Ferramenta de Trabalho' },
  policial: { nome: 'Policial', pericias: ['percepcao', 'pontaria'], poder: 'Patrulha' },
  religioso: { nome: 'Religioso', pericias: ['religiao', 'vontade'], poder: 'Acalentar' },
  servidor: { nome: 'Servidor Público', pericias: ['intuicao', 'vontade'], poder: 'Espírito Cívico' },
  teorico: { nome: 'Teórico da Conspiração', pericias: ['investigacao', 'ocultismo'], poder: 'Eu Já Sabia' },
  trabalhador_rural: { nome: 'Trabalhador Rural', pericias: ['adestramento', 'sobrevivencia'], poder: 'Desbravador' },
  ti: { nome: 'T.I.', pericias: ['investigacao', 'tecnologia'], poder: 'Motor de Busca' },
  trambiqueiro: { nome: 'Trambiqueiro', pericias: ['crime', 'enganacao'], poder: 'Impostor' },
  universitario: { nome: 'Universitário', pericias: ['atualidades', 'investigacao'], poder: 'Dedicação' },
  vitima: { nome: 'Vítima', pericias: ['reflexos', 'vontade'], poder: 'Cicatrizes Psicológicas' },
  // Arquivos Secretos
  influencer_paranormal: { nome: 'Influencer Paranormal', pericias: ['enganacao', 'tecnologia'], poder: 'Registrar o Paranormal' },
  cacador_recompensas: { nome: 'Caçador de Recompensas', pericias: ['crime', 'investigacao'], poder: 'Quem Não Arrisca, Não Petisca' },
  ufologo: { nome: 'Ufólogo', pericias: ['ciencias', 'ocultismo'], poder: 'Minha Teoria Absurda' },
  funcionario_beira: { nome: 'Funcionário de Beira de Estrada', pericias: ['fortitude', 'intuicao'], poder: 'Turno Invertido' },
  cientista_ex_panacea: { nome: 'Cientista Ex-Panacea', pericias: ['atualidades', 'ciencias'], poder: 'Existe uma Explicação' },
  cobaia_sobrevivente: { nome: 'Cobaia Sobrevivente', pericias: ['fortitude', 'vontade'], poder: 'Forças para Enfrentar' },
  seguranca_ex_panacea: { nome: 'Segurança Ex-Panacea', pericias: ['luta', 'pontaria'], poder: 'Técnicas de Contenção' },
  exorcizado: { nome: 'Exorcizado', pericias: ['fortitude', 'ocultismo'], poder: 'O Que Restou' },
  sensitivo_rebelde: { nome: 'Sensitivo Rebelde', pericias: ['intuicao', 'vontade'], poder: 'Sussurros e Vultos' },
};

const CLASSES = {
  combatente: {
    nome: 'Combatente',
    pvBase: 20, pvPorNex: 4,
    sanBase: 12, sanPorNex: 3,
    peBase: 2, pePorNex: 2,
    periciasBase: 1,
    proficiencias: 'Armas simples e táticas, proteções leves e pesadas',
    habilidadesIniciais: ['Ataque Especial'],
  },
  especialista: {
    nome: 'Especialista',
    pvBase: 16, pvPorNex: 3,
    sanBase: 16, sanPorNex: 4,
    peBase: 3, pePorNex: 3,
    periciasBase: 7,
    proficiencias: 'Armas simples e proteções leves',
    habilidadesIniciais: ['Eclético', 'Perito'],
  },
  ocultista: {
    nome: 'Ocultista',
    pvBase: 12, pvPorNex: 2,
    sanBase: 20, sanPorNex: 5,
    peBase: 4, pePorNex: 4,
    periciasBase: 5,
    periciasFixas: ['ocultismo', 'vontade'],
    proficiencias: 'Armas simples',
    habilidadesIniciais: ['Escolhido pelo Outro Lado'],
  },
};

function periciasMaximas(classe, intelecto) {
  const base = CLASSES[classe]?.periciasBase ?? 1;
  return base + (intelecto || 0);
}

const ARMAS_PRESET = [
  { nome: 'Punho', dano: '1d3', critico: 20, multiplicador: 2, tipoDano: 'Contundente', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Faca', dano: '1d4', critico: 19, multiplicador: 2, tipoDano: 'Cortante', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Soco Inglês', dano: '1d4', critico: 20, multiplicador: 2, tipoDano: 'Contundente', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Bastão', dano: '1d6', critico: 20, multiplicador: 2, tipoDano: 'Contundente', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Machadinha', dano: '1d6', critico: 19, multiplicador: 2, tipoDano: 'Cortante', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Espada Curta', dano: '1d6', critico: 19, multiplicador: 2, tipoDano: 'Cortante', alcance: '-', pericia: 'Luta', atributoDano: 'Força', bonusAtaque: 0 },
  { nome: 'Pistola', dano: '1d12', critico: 18, multiplicador: 2, tipoDano: 'Balístico', alcance: 'Curto', pericia: 'Pontaria', atributoDano: 'Agilidade', bonusAtaque: 0 },
  { nome: 'Revólver', dano: '2d6', critico: 19, multiplicador: 3, tipoDano: 'Balístico', alcance: 'Curto', pericia: 'Pontaria', atributoDano: 'Agilidade', bonusAtaque: 0 },
  { nome: 'Espingarda', dano: '4d6', critico: 20, multiplicador: 3, tipoDano: 'Balístico', alcance: 'Curto', pericia: 'Pontaria', atributoDano: 'Agilidade', bonusAtaque: 0 },
  { nome: 'Fuzil de Assalto', dano: '2d10', critico: 19, multiplicador: 2, tipoDano: 'Balístico', alcance: 'Médio', pericia: 'Pontaria', atributoDano: 'Agilidade', bonusAtaque: 0 },
  { nome: 'Fuzil de Precisão', dano: '2d12', critico: 19, multiplicador: 3, tipoDano: 'Balístico', alcance: 'Longo', pericia: 'Pontaria', atributoDano: 'Agilidade', bonusAtaque: 0 },
];
