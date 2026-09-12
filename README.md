# Escandinavo Fichas — Ordem Paranormal RPG

Sistema funcional de **criação e personalização de fichas** para o RPG **Ordem Paranormal** (1ª edição – Jambô Editora).

## Como usar

1. Abra o arquivo `index.html` no navegador (Chrome, Firefox, Edge…).
2. Não precisa de servidor — funciona 100% offline.

### Ou rode localmente com um servidor simples:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Depois acesse `http://localhost:8080`.

## Funcionalidades

- **Atributos** (FOR, AGI, INT, PRE, VIG) com controle de pontos de criação
- **Classes**: Combatente, Especialista e Ocultista
- **Origens** completas com perícias e poderes
- **NEX** ajustável (5% em 5%)
- Cálculo automático de:
  - Pontos de Vida
  - Sanidade
  - Pontos de Esforço
  - Defesa, Bloqueio e Esquiva
  - Carga máxima
  - DT de Rituais
- **28 Perícias** oficiais com treinamento (+5)
- Abas de **Descrição**, **Habilidades**, **Rituais**, **Inventário** e **Combate**
- Exportar / Importar ficha em JSON
- Impressão / salvar como PDF

## Estrutura

```
ordem-paranormal-fichas/
├── index.html      # Interface principal
├── styles.css      # Visual dark (inspirado nas fichas digitais)
├── data.js         # Dados oficiais (perícias, origens, classes)
├── app.js          # Lógica da aplicação
└── README.md
```

## Regras implementadas

- Atributos começam em **1**, **4 pontos** para distribuir
- Pode reduzir um atributo para **0** (+1 ponto extra)
- Máximo inicial recomendado: **3**
- PV / PE / SAN calculados conforme a classe + atributos + NEX
- Defesa = 10 + Agilidade
- Perícias treinadas concedem **+5**
- Limite de perícias treinadas baseado na classe + Intelecto + origem

## Créditos

- Sistema de regras: **Ordem Paranormal RPG** — Cellbit + Jambô Editora
- Interface inspirada nas fichas digitais da comunidade
- Este é um projeto **não-oficial** e gratuito

---

Feito para o repositório [matt1a1/Escandinavo-fichas](https://github.com/matt1a1/Escandinavo-fichas)
