# Notas — ícones e nomes (protótipos v2)

Anotado em 2026-09-29. Nada abaixo foi aplicado ainda: são sugestões aguardando decisão.

## Já feito nesta rodada

- `cronica.html`: pulso da luz do próximo tempo (`.spot.next .glow`, keyframe `breathe`).
  Vai de opacidade 0 a .45, com gradiente turquesa intermediário; sem sombra extra no
  estado `next`. Se ainda ficar forte, baixar o `.45`; se fraco, subir.

## Menu inferior (`app.js`, função `nav`)

Problema: três ícones de livro seguidos (`library_books`, `auto_stories`, `book_5`).

| Item | Hoje | Sugestão | Alternativa |
|---|---|---|---|
| Diário | `auto_stories` | `history_edu` (pena e pergaminho) | `ink_pen`, `edit_note` |
| Grupo | `groups` | `shield_person` | `swords` |
| Salvar | `book_5` | `fireplace` (lareira) | `bookmark`, `save` |

## Abas do personagem (`grupo.html`, função `tabs`)

| Aba | Hoje | Sugestão |
|---|---|---|
| Status | `monitor_heart` | `favorite` |
| Atributos | `star` (colide com "Ação lendária" dos Ecos) | `swords` (alt.: `military_tech`, `psychology`) |
| Itens | `backpack` | manter |
| Ecos | `history_edu` | `mist` (alt.: `flare`, `nights_stay`); não usar `graphic_eq` (lembra áudio) |
| Cartas | `playing_cards` | manter |

Todos os nomes acima foram conferidos contra o Google Fonts (existem). **Não existem:**
`campfire`, `vault`, `quill`, `sword`, `feather`, `lantern`, `bonfire`, `flame`.

Ponto de UX (skill ui-ux-pro-max): abas inativas mostram só o ícone e têm 40×42px;
a skill pede alvo de toque de 44px (`grupo.html:20`).

## Nomes

- **Diário** → "Relatos" (temático) ou "Notas" (funcional). Separa de "Crônica".
- **Grupo** → "Heróis" (modo Jogador: "Herói"). Evitei "Companhia" porque "Companheiros" é
  tipo de criatura em Salvar. A aba "Heróis" de Salvar é outro contexto.
- **Salvar** → manter.
- Colisão fora dos ícones: botão "Ecos" do cabeçalho (áudio) vs. aba "Ecos" (Ecos da Ruína).
  Se confundir, renomear o botão para "Música" ou "Áudio".

## Pacote de ícones mais temático

**game-icons.net** via **Iconify** (4.133 ícones, CC BY 3.0, atribuição irrelevante em uso pessoal).

- Busca: `https://api.iconify.design/search?query=<termo>&prefix=game-icons`
- SVG: `https://api.iconify.design/game-icons/<nome>.svg` (ex.: `crossed-swords`)
- Protótipo web: `<iconify-icon icon="game-icons:crossed-swords">`, sem baixar nada;
  a cor segue `currentColor`.
- Compose: sem integração por nome. Cada SVG é um único path 512×512; o `pathData` do
  `VectorDrawable` aceita quase sem mudança → gerar XMLs em `res/drawable/` e usar
  `Icon(painterResource(...), tint = ...)`. Claude faz a busca e a geração; o usuário só aprova.
- Não misturar com Material no mesmo conjunto de identidade (traço varia); manter Material
  nos ícones utilitários (voltar, configurações, info, check).

## Próximo passo proposto

1. Escolher: "Relatos" ou "Notas"; `fireplace` ou `bookmark` para Salvar.
2. Aplicar ícones e nomes em `v2/app.js` e `v2/grupo.html` (e `<title>` das páginas).
3. Opcional: comparar lado a lado com game-icons no protótipo antes de mexer no Android;
   se não agradar, volta ao Material desfazendo as trocas.
