const state = {
  nome: '', jogador: '', origem: 'investigador', classe: 'ocultista', nex: 5, patente: 'Recruta',
  tipoFicha: 'ordem',
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  pericias: {},
  vidaAtual: null, sanAtual: null, peAtual: null,
  pvMaxOverride: null, sanMaxOverride: null, peMaxOverride: null,
  aparencia: '', personalidade: '', historico: '', objetivo: '', anotacoes: '',
  habilidades: [], rituais: [], itens: [], ataques: [], pp: 0, credito: 'Baixo',
  itensLimite: { I: 2, II: 0, III: 0, IV: 0 },
  mascaraAtiva: false,
};

function isFichaCustom() { return !!(state && state.tipoFicha === 'custom'); }
function isFichaLivre() { return !!(state && (state.tipoFicha === 'custom' || state.tipoFicha === 'mascaras')); }
window.isFichaCustom = isFichaCustom;
window.isFichaLivre = isFichaLivre;

// PLACEHOLDER_RESTORE_MARKER
