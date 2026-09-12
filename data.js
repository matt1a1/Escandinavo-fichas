// Dados oficiais de Ordem Paranormal RPG (1ª edição)

const PERICIAS = [
  { id: 'acrobacia', nome: 'Acrobacia+', attr: 'AGI', soTreinada: false },
  { id: 'adestramento', nome: 'Adestramento*', attr: 'PRE', soTreinada: true },
  { id: 'artes', nome: 'Artes*', attr: 'PRE', soTreinada: true },
  { id: 'atletismo', nome: 'Atletismo', attr: 'FOR', soTreinada: false },
  { id: 'atualidades', nome: 'Atualidades', attr: 'INT', soTreinada: false },
  { id: 'ciencias', nome: 'Ciências*', attr: 'INT', soTreinada: true },
  { id: 'crime', nome: 'Crime*+', attr: 'AGI', soTreinada: true },
  { id: 'diplomacia', nome: 'Diplomacia', attr: 'PRE', soTreinada: false },
  { id: 'enganacao', nome: 'Enganação', attr: 'PRE', soTreinada: false },
  { id: 'fortitude', nome: 'Fortitude', attr: 'VIG', soTreinada: false },
  { id: 'furtividade', nome: 'Furtividade+', attr: 'AGI', soTreinada: false },
  { id: 'iniciativa', nome: 'Iniciativa', attr: 'AGI', soTreinada: false },
  { id: 'intimidacao', nome: 'Intimidação', attr: 'PRE', soTreinada: false },
  { id: 'intuicao', nome: 'Intuição', attr: 'PRE', soTreinada: false },
  { id: 'investigacao', nome: 'Investigação', attr: 'INT', soTreinada: false },
  { id: 'luta', nome: 'Luta', attr: 'FOR', soTreinada: false },
  { id: 'medicina', nome: 'Medicina', attr: 'INT', soTreinada: false },
  { id: 'ocultismo', nome: 'Ocultismo*', attr: 'INT', soTreinada: true },
  { id: 'percepcao', nome: 'Percepção', attr: 'PRE', soTreinada: false },
  { id: 'pilotagem', nome: 'Pilotagem*', attr: 'AGI', soTreinada: true },
  { id: 'pontaria', nome: 'Pontaria', attr: 'AGI', soTreinada: false },
  { id: 'profissao', nome: 'Profissão*', attr: 'INT', soTreinada: true },
  { id: 'reflexos', nome: 'Reflexos', attr: 'AGI', soTreinada: false },
  { id: 'religiao', nome: 'Religião*', attr: 'PRE', soTreinada: true },
  { id: 'sobrevivencia', nome: 'Sobrevivência', attr: 'INT', soTreinada: false },
  { id: 'tatica', nome: 'Tática*', attr: 'INT', soTreinada: true },
  { id: 'tecnologia', nome: 'Tecnologia*', attr: 'INT', soTreinada: true },
  { id: 'vontade', nome: 'Vontade', attr: 'PRE', soTreinada: false },
];

const ORIGENS = {
  academico: {
    nome: 'Acadêmico',
    pericias: ['ciencias', 'investigacao'],
    poder: 'Saber é Poder',
  },
  agente_saude: {
    nome: 'Agente de Saúde',
    pericias: ['intuicao', 'medicina'],
    poder: 'Técnica Medicinal',
  },
  amnesico: {
    nome: 'Amnésico',
    pericias: [], // duas à escolha do mestre
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
  criminoso: {
    nome: 'Criminoso',
    pericias: ['crime', 'furtividade'],
    poder: 'O Crime Compensa',
  },
  cultista: {
    nome: 'Cultista Arrependido',
    pericias: ['ocultismo', 'religiao'],
    poder: 'Traços do Outro Lado',
  },
  desgarrado: {
    nome: 'Desgarrado',
    pericias: ['fortitude', 'sobrevivencia'],
    poder: 'Calejado',
  },
  engenheiro: {
    nome: 'Engenheiro',
    pericias: ['profissao', 'tecnologia'],
    poder: 'Ferramenta Favorita',
  },
  executivo: {
    nome: 'Executivo',
    pericias: ['diplomacia', 'profissao'],
    poder: 'Processo Otimizado',
  },
  investigador: {
    nome: 'Investigador',
    pericias: ['investigacao', 'percepcao'],
    poder: 'Faro para Pistas',
  },
  operario: {
    nome: 'Operário',
    pericias: ['fortitude', 'profissao'],
    poder: 'Ferramentas da Profissão',
  },
  policial: {
    nome: 'Policial',
    pericias: ['percepcao', 'pontaria'],
    poder: 'Patrulha',
  },
  religioso: {
    nome: 'Religioso',
    pericias: ['religiao', 'vontade'],
    poder: 'Calma Interior',
  },
  servidor: {
    nome: 'Servidor Público',
    pericias: ['diplomacia', 'intuicao'],
    poder: 'Processo Burocrático',
  },
  soldado: {
    nome: 'Soldado',
    pericias: ['luta', 'fortitude'],
    poder: 'Posição de Combate',
  },
  ti: {
    nome: 'T.I.',
    pericias: ['investigacao', 'tecnologia'],
    poder: 'Motor de Busca',
  },
  trabalhador: {
    nome: 'Trabalhador Rural',
    pericias: ['atletismo', 'sobrevivencia'],
    poder: 'Raízes',
  },
  universitario: {
    nome: 'Universitário',
    pericias: ['atualidades', 'investigacao'],
    poder: 'Estudante Aplicado',
  },
};

// Dados base por classe em NEX 5%
const CLASSES = {
  combatente: {
    nome: 'Combatente',
    pvBase: 20,
    pvPorNex: 4,
    sanBase: 12,
    sanPorNex: 3,
    peBase: 2,
    pePorNex: 2,
    periciasBase: 1, // + INT (além das de origem e obrigatórias)
    proficiencias: 'Armas simples e táticas, Proteções leves e médias',
    habilidadesIniciais: ['Ataque Especial', 'Treinamento em Luta ou Pontaria'],
  },
  especialista: {
    nome: 'Especialista',
    pvBase: 16,
    pvPorNex: 3,
    sanBase: 16,
    sanPorNex: 4,
    peBase: 3,
    pePorNex: 3,
    periciasBase: 3, // + INT (mais flexível)
    proficiencias: 'Armas simples, Proteções leves',
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
    periciasBase: 1, // + INT
    proficiencias: 'Armas simples',
    habilidadesIniciais: ['Escolhido pelo Outro Lado', 'Impostor'],
  },
};

// Quantidade de perícias treinadas = base da classe + INT + perícias da origem
// (origem já conta como treinadas)
function calcularPericiasMax(classe, int, origemPericiasCount = 2) {
  const base = CLASSES[classe]?.periciasBase ?? 1;
  // Fórmula aproximada oficial: base da classe + INT (origem já incluída no total)
  // Na prática: Combatente ~ 1+INT (+origem), Especialista ~ 3+INT (+origem), Ocultista ~ 1+INT (+origem)
  return base + int + origemPericiasCount;
}
