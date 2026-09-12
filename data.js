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

// Categorias de item (C.R.I.S. / livro)
const ITEM_CATEGORIES = ['0', 'I', 'II', 'III', 'IV'];

// Elementos de rituais
const ELEMENTOS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Outro'];

const ORIGENS = {
  academico: {
    nome: 'Acadêmico',
    pericias: ['ciencias', 'investigacao'],
    poder: 'Saber é Poder',
  },
  agente_saude: {
    nome: 'Agente de Saúde',
    pericias: ['intuicao', 'medicina'],
    poder: 'Técnicas de Primeiros Socorros',
  },
  amnesico: {
    nome: 'Amnésico',
    pericias: ['atualidades', 'investigacao'],
    poder: 'Vislumbres do Passado',
  },
  artista: {
    nome: 'Artista',
    pericias: ['artes', 'enganacao'],
    poder: 'Magnum Opus',
  },
  atleta: {
    nome: 'Atleta',
    pericias: ['acrobacia', 'atletismo'],
    poder: '110%',
  },
  chef: {
    nome: 'Chef',
    pericias: ['fortitude', 'profissao'],
    poder: 'Ingrediente Secreto',
  },
  consultor_paranormal: {
    nome: 'Consultor Paranormal',
    pericias: ['ocultismo', 'religiao'],
    poder: 'Consultoria Paranormal',
  },
  criminoso: {
    nome: 'Criminoso',
    pericias: ['crime', 'furtividade'],
    poder: 'O Crime Compensa',
  },
  engenheiro: {
    nome: 'Engenheiro',
    pericias: ['profissao', 'tecnologia'],
    poder: 'Ferramentas Favoritas',
  },
  executivo: {
    nome: 'Executivo',
    pericias: ['diplomacia', 'profissao'],
    poder: 'Por Conta da Casa',
  },
  investigador: {
    nome: 'Investigador',
    pericias: ['investigacao', 'percepcao'],
    poder: 'Achado Não é Roubado',
  },
  combatente_origem: {
    nome: 'Combatente (Origem)',
    pericias: ['luta', 'pontaria'],
    poder: 'Destruidor',
  },
  magnata: {
    nome: 'Magnata',
    pericias: ['diplomacia', 'intimidacao'],
    poder: 'Recursos Ilimitados',
  },
  mercenario: {
    nome: 'Mercenário',
    pericias: ['iniciativa', 'intimidacao'],
    poder: 'Posição de Combate',
  },
  militar: {
    nome: 'Militar',
    pericias: ['pontaria', 'tatica'],
    poder: 'Paraquedista',
  },
  religioso: {
    nome: 'Religioso',
    pericias: ['religiao', 'vontade'],
    poder: 'Acalentar',
  },
  servidor_publico: {
    nome: 'Servidor Público',
    pericias: ['intuicao', 'vontade'],
    poder: 'Espírito Cívico',
  },
  teorico_conspiracao: {
    nome: 'Teórico da Conspiração',
    pericias: ['investigacao', 'ocultismo'],
    poder: 'Eu Já Sabia',
  },
  ti: {
    nome: 'T.I.',
    pericias: ['investigacao', 'tecnologia'],
    poder: 'Motor de Busca',
  },
  trabalhador: {
    nome: 'Trabalhador',
    pericias: ['fortitude', 'profissao'],
    poder: 'Vamos Ver',
  },
  universitario: {
    nome: 'Universitário',
    pericias: ['atualidades', 'investigacao'],
    poder: 'Empolgação Acadêmica',
  },
};

const CLASSES = {
  combatente: {
    nome: 'Combatente',
    pvBase: 20,
    pvPorNex: 4,
    sanBase: 12,
    sanPorNex: 3,
    peBase: 2,
    pePorNex: 2,
    periciasBase: 1,
    proficiencias: 'Armas simples, armas táticas, proteções leves',
    habilidadesIniciais: ['Ataque Especial'],
  },
  especialista: {
    nome: 'Especialista',
    pvBase: 16,
    pvPorNex: 3,
    sanBase: 16,
    sanPorNex: 4,
    peBase: 3,
    pePorNex: 3,
    periciasBase: 3,
    proficiencias: 'Armas simples, proteções leves',
    habilidadesIniciais: ['Eclético', 'Perito'],
  },
  ocultista: {
    nome: 'Ocultista',
    pvBase: 12,
    pvPorNex: 2,
    sanBase: 20,
    sanPorNex: 5,
    peBase: 4,
    pePorNex: 4,
    periciasBase: 1,
    proficiencias: 'Armas simples',
    habilidadesIniciais: ['Escolhido pelo Outro Lado', 'Impostor'],
  },
};
