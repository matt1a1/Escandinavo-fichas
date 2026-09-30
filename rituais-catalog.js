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
  }
];
