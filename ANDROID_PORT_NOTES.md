# Notas de Viabilidade — Port HTML → Kotlin/Android

> Referente aos mockups HTML deste repositório (`index.html`, `config.html`, `continuar.html`, `cronica.html`, `diario.html`, `grupo.html`, `nevoa.html`/`nevoa_v1.html`, `nova_campanha.html`, `salvar.html`). Este arquivo existe porque o projeto Kotlin vai viver em outra pasta/repositório — copie este arquivo pra lá.

## 1. Coisas que exigem substituição real (não é só "portar")

- **QR Code** (`nova_campanha.html`, usa a lib `html5-qrcode`)
  → CameraX + ML Kit Barcode Scanning (ou ZXing). Precisa de permissão `CAMERA` em runtime. Não funciona em emulador sem câmera virtual configurada.

- **Exportar/Importar backup** (`config.html`, usa `<a download>` com data URI e `<input type=file>`)
  → Storage Access Framework: `ACTION_CREATE_DOCUMENT` (exportar) e `ACTION_OPEN_DOCUMENT` (importar).

- **`localStorage`** (usado em todas as telas: campanha ativa, personagens, diário, saves)
  → Room (SQLite) ou DataStore, com repositório/ViewModel compartilhado entre telas em vez de chave-valor global.

- **Navegação por `<a href="pagina.html">` + estado via localStorage**
  → Navigation Compose com argumentos tipados + ViewModels compartilhados (por ex. um `CampaignViewModel` escopado no grafo de navegação).

- **Fontes via Google Fonts CDN** (`Cinzel`, `Alegreya Sans`, `Crimson Pro`) **e `Celtic Garamond` via `local()`** (que nem carrega no navegador do usuário — cai no fallback serif mesmo no protótipo)
  → Baixar os arquivos de fonte e embutir em `res/font/`. Como a fonte "Celtic Garamond" já está quebrada no HTML, não há nada de visual a perder ao trocar.

- **Ícones Phosphor via CDN** (`@phosphor-icons/web`)
  → Material Symbols, ou baixar o pacote Phosphor como vetores/drawables (`ImageVector`/XML).

- **Imagens hotlinkadas do Google Drive** (`lh3.googleusercontent.com/d/...`)
  → Virar assets locais (`drawable`/`res/raw`). Links do Drive são frágeis (podem expirar ou exigir permissão de acesso).

- **Fallback de imagem `onerror` para placehold.co** (ícones de atributos em `grupo.html`)
  → Lógica de placeholder/error do Coil ou Glide, apontando pra um drawable local em vez de um serviço online.

## 2. Player de música "Ecos/OST" — requisito: tocar com tela bloqueada

Confirmado com o usuário: o player precisa continuar tocando mesmo com a tela do celular bloqueada.

- ExoPlayer/MediaPlayer são só motores de reprodução (play/pause/seek/volume + listener de estado) — **não têm UI própria pra áudio**. O `PlayerView` pronto do ExoPlayer é só pra vídeo; pra áudio ninguém usa. **O popover customizado do mockup (`config.html`, artwork circular com glow, dropdown de playlist, progress bar, slider em losango, botão "Atenuar p/ Narrar") pode ser replicado pixel a pixel dentro do app**, sem nenhuma restrição de layout.
- Pra tocar com tela bloqueada / app em background é **obrigatório**:
  - Media3 **`MediaSessionService`**
  - **Foreground Service** com `foregroundServiceType="mediaPlayback"`
  - Permissões: `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` (Android 14+), `POST_NOTIFICATIONS` (runtime, Android 13+) — esse tipo de serviço é obrigado a mostrar notificação enquanto toca.
  - O `ExoPlayer` já gerencia o WakeLock sozinho (`setWakeMode`), não precisa implementar isso na mão.
- **Onde o design é livre / onde não é:**
  - Dentro do app (o popover "Ecos"): 100% livre.
  - Notificação / tela de bloqueio (NowPlaying): usa `MediaStyle` notification — dá pra controlar artwork, título, subtítulo, quais botões aparecem e cor de destaque, mas o formato do card em si é padronizado pelo Android (igual Spotify/YouTube Music) e não é redesenhável.
- **Impacto de arquitetura:** a UI do player não segura mais uma instância de `ExoPlayer` local — ela se conecta a um `MediaController` apontando pro `MediaSessionService`. É mudança de camada de dados, não de tela.

## 3. Efeitos visuais CSS → Compose

Tudo é reproduzível. Tabela de equivalência:

| Efeito CSS visto nos mockups | Equivalente em Compose |
|---|---|
| `linear-gradient` / `radial-gradient` (overlay escuro sobre bg, glow do artwork do player, vinheta do relógio) | `Brush.linearGradient` / `Brush.radialGradient` |
| `opacity`, transições de fade | `Modifier.alpha()` + `animateFloatAsState` |
| `box-shadow` externo (glow ao redor de botão ativo) | `Modifier.shadow()` ou `drawBehind` com `BlurMaskFilter` |
| `text-shadow` | `TextStyle(shadow = Shadow(...))` |
| `clip-path: polygon(...)` (as "fitas"/ribbons de filtro do diário) | `Shape` customizado com `Path` |
| `mix-blend-mode: color-dodge` (marcador vermelho do relógio em `cronica.html`) | `graphicsLayer` + `Canvas` com `BlendMode.ColorDodge` via `saveLayer` |

**Único ponto de atenção real: `backdrop-filter: blur()`** (usado nos headers, busca fixa/sticky, e popover do player):

- **API 31+ (Android 12+)**: nativo via `Modifier.graphicsLayer { renderEffect = RenderEffect.createBlurEffect(...) }` — fica idêntico ao CSS.
- **Abaixo de API 31**: sem blur de tempo real nativo. Opções: lib **Haze** (open source, feita pra isso, com fallback automático) ou aceitar cor sólida semitransparente sem desfoque nessas versões (comportamento comum e aceitável).

Nenhum efeito visual dos mockups é bloqueador. Único trade-off é performance em blur empilhado em telas carregadas (ex. `diario.html` com blur no header + várias fitas) — ajuste fino de depois, não limitação de viabilidade.

## 4. Compatibilidade entre versões de Android (decisão de arquitetura)

Não existe "escolher a tela na instalação". Um único APK/AAB roda em todas as versões suportadas; a escolha de qual efeito/recurso usar é feita **em runtime**, checando `Build.VERSION.SDK_INT`, no nível mais granular possível (normalmente só o `Modifier`/efeito muda, não a tela inteira):

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
    BlurredHeader() // Android 12+: RenderEffect nativo
} else {
    SolidHeaderFallback() // fallback sem blur
}
```

- Recursos estáticos (cores, dimens, drawables) também podem usar qualificadores de pasta (`values-v31/`, `drawable-v31/`) quando fizer sentido — mas pra lógica de UI em Compose, o branching por `SDK_INT` é o caminho padrão.
- Vantagem sobre "decidir na instalação": se o usuário atualizar o Android do aparelho depois, o app passa a usar automaticamente o recurso nativo, sem precisar reinstalar.
- Esse mesmo princípio (branching por `SDK_INT`) vale pra qualquer outro recurso version-gated que aparecer no projeto, não só o blur.

## 5. Telas de rascunho a descartar

`nevoa.html` e `nevoa_v1.html` são versões antigas de `cronica.html` (mesma lógica de condições/relógio de passagem do tempo, layout levemente diferente). A navegação delas nem aponta mais pras telas atuais (falta link pra `diario.html`/`config.html`). Prováveis rascunhos que podem ser ignorados quando for pra Kotlin.

## 6. Coisas 100% compatíveis, só precisam virar Kotlin/Compose

- Fichas expansíveis de heróis, trilhas de saúde/energia/pavor, atributos e perícias, baralhos B/E/D/F, itens e segredos (`grupo.html`)
- Sistema de condições com números e notas, relógio de passagem do tempo (`cronica.html`)
- Diário com tags, respostas aninhadas, modal de nova nota (`diario.html`)
- Wizard de 5 passos para salvar/guardar a caixa (`salvar.html`)
- Fluxo de nova campanha: solo/multiplayer, seleção de heróis, modificadores de regra (`nova_campanha.html`)
- Tela de continuar/carregar saves com abas Cronista/Jogador (`continuar.html`)
