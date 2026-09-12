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
- Cálculo automático de PV, Sanidade, PE, Defesa, Bloqueio, Esquiva, Carga e DT de Rituais
- **28 Perícias** oficiais com níveis **0 / 5 / 10 / 15** + campo **Outros**
- **Inventário estilo C.R.I.S.**: limites I–IV, carga, tipos (Arma, Munição, Proteção, Geral, Amaldiçoado)
- Abas de Descrição, Habilidades, Rituais, Inventário e Combate
- Exportar / Importar ficha em JSON
- Impressão / salvar como PDF

## Estrutura

```
┌── index.html
┌── styles.css
┌── data.js
┌── app.js
└── README.md
```

## Créditos

- Sistema de regras: **Ordem Paranormal RPG** — Cellbit + Jambô Editora
- Interface inspirada no C.R.I.S. e fichas digitais da comunidade
- Projeto **não-oficial** e gratuito

---

[matt1a1/Escandinavo-fichas](https://github.com/matt1a1/Escandinavo-fichas)
