const KR = (() => {
    const LOGO = 'https://lh3.googleusercontent.com/d/1U3juHgIiAcpfSSQiW3nWN20MhMUx7tJR';
    const ZOOMS = [0.85, 0.925, 1, 1.1, 1.25];

    const get = (k, d) => { try { const v = localStorage.getItem('v2_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } };
    const set = (k, v) => { try { localStorage.setItem('v2_' + k, JSON.stringify(v)); } catch {} };

    const params = new URLSearchParams(location.search);
    if (params.get('modo')) set('role', params.get('modo') === 'jogador' ? 'jogador' : 'cronista');
    const role = () => get('role', 'cronista');

    const applyZoom = () => { document.documentElement.style.fontSize = (16 * ZOOMS[get('zoom', 2)]) + 'px'; };
    applyZoom();

    // Ícones temáticos (game-icons.net, CC BY 3.0) por lugar de uso; utilitários seguem no Material.
    // Cada tela/contexto tem o seu slot, mesmo quando o desenho se repete, para trocar um sem mexer nos outros.
    // icones.html permite trocar qualquer um para teste (fica em 'iconOverrides').
    const GAME_ICONS = {
        // menu inferior
        cronica: 'hourglass', condicoes: 'scroll-unfurled', diario: 'bookmarklet', grupo: 'uprising', personagem: 'spartan', salvar: 'camping-tent', exportar: 'thrown-spear',
        // nova campanha
        n_solo: 'spartan', n_multi: 'uprising', n_cronista: 'rule-book', n_jogador: 'crossed-swords', n_narrativo: 'rule-book', n_desafiador: 'skull-crossed-bones',
        h_elgan: 'candle-holder', h_gerdwyn: 'crossbow', h_iunis: 'crossed-swords', h_osbert: 'duality-mask',
        // continuar
        c_campanhas: 'rule-book', c_fichas: 'id-card', c_elgan: 'candle-holder', c_gerdwyn: 'crossbow', c_iunis: 'crossed-swords', c_osbert: 'duality-mask',
        // ficha do herói (grupo)
        t_status: 'healing-shield', t_attrs: 'skills', t_itens: 'backpack', t_cartas: 'card-play', t_ecos: 'shield-echoes',
        combate: 'crossed-swords', diplomacia: 'shaking-hands', lendaria: 'star-swirl', secreta: 'padlock', bloqueada: 'padlock', evoluida: 'muscle-up',
        // diário
        d_todos: 'book-cover', d_local: 'village', d_npc: 'robe', d_demanda: 'stabbed-note', d_personagem: 'swordman', d_nova: 'quill-ink',
        // salvar
        s_botao: 'camping-tent', s_herois: 'id-card', s_criaturas: 'paw-print', s_mapa: 'treasure-map', s_caixa: 'chest', s_resumo: 'checklist',
        s_padrons: 'deer-head', s_monarcas: 'queen-crown', s_companheiros: 'paw-print', s_guardioes: 'swords-emblem',
        s_claro: 'hourglass', s_escuro: 'hourglass', s_demanda: 'stabbed-note', s_universal: 'cube',
        // player de música
        pl_musica: 'lyre', pl_combate: 'crossed-swords', pl_exploracao: 'compass', pl_taverna: 'beer-stein',
        // configurações (catálogo de ecos)
        cf_musica: 'lyre', cf_combate: 'crossed-swords', cf_exploracao: 'compass', cf_taverna: 'beer-stein'
    };
    // Ícones próprios, montados a partir de peças do game-icons (CC BY 3.0: crédito mantido)
    // kr-grupo: escudo com chapéu de mago vazado, espada e adaga cruzadas atrás (pointy-hat, broadsword, plain-dagger)
    const CUSTOM_ICONS = {
        'kr-grupo': `<defs><mask id="kr-grupo-cut"><rect width="512" height="512" fill="#fff"/><path fill="#000" d="M416.125 42.406c-57.576.457-104.863 25.804-144.813 64.875c-41.984 41.063-75 97.61-100 155.5c.78 4.503 3.06 8.946 7.094 13.658c5.158 6.024 13.183 12.113 23.188 17.593c20.01 10.962 47.79 19.545 75.5 24.47s55.505 6.21 75.156 3.438c9.825-1.386 17.538-3.91 21.813-6.563s4.916-3.957 4.812-6.625l.72-.03c-3.408-42.828-6-88.797.092-131.94c2.82-19.972 7.668-39.434 15.22-57.624c-31.573 31.44-62.918 65.425-86.844 94.72c35.418-70.2 86.2-121.398 141.125-168.97c-11.376-1.71-22.42-2.584-33.063-2.5zM155.21 238.994a407 407 0 0 0-13.334.131c-23.138.575-44.227 2.91-61.876 7.188c-23.532 5.703-40.466 14.888-48.78 26.03c-8.317 11.144-10.08 24.667-.97 45.532c32.86 75.263 117.185 130.26 207.844 148.594c90.66 18.33 186.108.147 242.28-66.75c13.59-16.185 15.297-29.312 9.938-43.22c-5.358-13.908-19.586-28.878-40.78-42.75c-14.745-9.65-32.683-18.737-52.75-27.03c1.506 22.59 3.555 44.877 5.124 65.967v.219c.607 11.402-5.49 21.585-14.344 27.938s-20.268 10.08-33.437 12.406c-26.337 4.654-60.026 3.398-93.344-2.188c-33.317-5.585-66.085-15.466-90.28-29.312c-12.097-6.923-22.145-14.85-28.875-24.47c-6.73-9.617-9.76-21.554-6.594-33.374l.095-.375l.125-.374c7.637-21.206 16.308-42.79 26.094-64.094a634 634 0 0 0-6.133-.068zm6.634 46.662A839 839 0 0 0 153.031 309c-1.595 6.246-.4 11.407 3.907 17.563c4.374 6.25 12.28 12.923 22.844 18.968c21.128 12.09 52.4 21.78 84.095 27.095c31.694 5.314 64.016 6.28 87 2.22c11.492-2.032 20.53-5.42 25.78-9.19c5.25-3.766 6.864-6.726 6.595-11.78c-.517-6.93-1.088-14.027-1.688-21.25c-7.448 4.03-16.47 6.367-26.718 7.813c-22.732 3.206-51.79 1.665-81.03-3.532c-29.242-5.196-58.5-14.055-81.22-26.5c-11.36-6.222-21.122-13.34-28.375-21.812a59 59 0 0 1-2.376-2.938z" transform="translate(128.0 117.0) scale(0.5)"/></mask></defs><g mask="url(#kr-grupo-cut)" fill="currentColor"><g transform="translate(5.1 79.1) scale(0.98)"><g transform=""><path fill="currentColor" d="m491.844 22.533l-83.42 14.865L196.572 249.25c3.262 4.815 5.37 10.72 5.37 16.932c0 5.863-1.71 11.35-4.643 15.996a53 53 0 0 0-16.027-2.477c-15.724 0-29.904 6.89-39.69 17.796l-9.112-9.113l17.237-17.237a546 546 0 0 1-13.19-17.6l-19.443 19.44l-13.215-13.215l21.828-21.827a548 548 0 0 1-12.792-20.068L72.093 258.68l58.314 58.314a53 53 0 0 0-2.49 16.063a52.9 52.9 0 0 0 4.592 21.564l-72.14 72.14l-14.56-14.56L21.013 437l14.558 14.56l-8.607 8.608l27.246 27.246l8.606-8.61l14.56 14.56l24.798-24.8l-14.557-14.556l72.158-72.16a52.9 52.9 0 0 0 21.498 4.562a53 53 0 0 0 16.063-2.49l58.363 58.363L296.5 401.48a549 549 0 0 1-20.068-12.793l-21.83 21.83L241.39 397.3l19.442-19.44a550 550 0 0 1-17.603-13.194l-17.238 17.238l-9.16-9.16c10.905-9.785 17.795-23.965 17.795-39.69c0-5.346-.806-10.51-2.285-15.39c4.703-3.04 10.288-4.817 16.265-4.816c6.21 0 11.776 1.77 16.52 4.955L476.98 105.95zm-66.227 53.012l13.215 13.215l-191.684 191.68l-13.214-13.213zM181.273 298.39c19.257 0 34.665 15.41 34.665 34.665c0 19.256-15.408 34.666-34.665 34.666s-34.666-15.41-34.666-34.665s15.41-34.666 34.666-34.666"/></g></g><g transform="translate(30.2 104.2) scale(0.882)"><g transform="rotate(180 256 256)"><path fill="currentColor" d="M43.53 15.75c-15.73 0-28.31 12.583-28.31 28.313c0 14.086 10.092 25.644 23.5 27.906L42.687 68L68.81 41.906l2.626-2.625C69.188 25.86 57.63 15.75 43.53 15.75m33.72 44.125l-17 17c15.885 39.37 43.45 66.684 78.75 87.406a513 513 0 0 1 25.438-24.936c-22.488-35.103-51.535-62.294-87.188-79.47M322.594 79.03l-51.25 4.314c-79.356 48.134-143.878 108.1-186.72 186.53l-4.31 51.47l44.155-18.656l-2.94-34.094l-.25-3.063l1.626-2.624c35.94-58.47 79.93-109.41 141.5-141.25l2.406-1.25l2.688.25l34.125 2.906l18.97-44.53zm-62.438 66.376c-10.008 5.886-19.5 12.338-28.562 19.313c46.688 47.93 87.208 108.588 114.72 166.5l11.248 23.717l-23.718-11.28c-57.995-27.554-117.918-67.57-165.688-113.907a497 497 0 0 0-20.625 29.28c101.918 94.91 227.05 177.304 347.845 234.69c-57.063-120.125-140.038-246.18-235.22-348.314zm-43.03 31.22c-13.37 11.703-25.72 24.58-37.282 38.436c39.36 38.452 88.085 72.83 136.687 98.844c-26.054-48.633-60.754-97.847-99.405-137.28"/></g></g><path d="M120 120H392V286C392 398 316 460 256 490C196 460 120 398 120 286Z"/></g>`
    };
    if (!document.querySelector('script[src*="iconify-icon"]')) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js';
        document.head.appendChild(s);
    }
    // Migração única: trocas feitas quando um slot servia a vários lugares passam para os slots novos
    const GI_SPLIT = { personagem: ['n_solo'], grupo: ['n_multi'], salvar: ['s_botao'], cronista: ['n_cronista', 'n_narrativo', 'c_campanhas'], desafiador: ['n_desafiador'],
        combate: ['n_jogador', 'pl_combate', 'cf_combate'], s_herois: ['c_fichas'], s_criaturas: ['s_companheiros'], d_demanda: ['s_demanda'], secreta: ['bloqueada'],
        h_elgan: ['c_elgan'], h_gerdwyn: ['c_gerdwyn'], h_iunis: ['c_iunis'], h_osbert: ['c_osbert'],
        musica: ['pl_musica', 'cf_musica'], exploracao: ['pl_exploracao', 'cf_exploracao'], taverna: ['pl_taverna', 'cf_taverna'] };
    if (!get('iconSplit', false)) {
        const ov = get('iconOverrides', {});
        for (const [o, ns] of Object.entries(GI_SPLIT)) if (ov[o]) { ns.forEach(n => { ov[n] ??= ov[o]; }); if (!GAME_ICONS[o]) delete ov[o]; }
        set('iconOverrides', ov); set('iconSplit', true);
    }
    const giName = slot => ({ ...GAME_ICONS, ...get('iconOverrides', {}) })[slot];
    // class "ms" para herdar os mesmos tamanhos e cores definidos para os ícones Material
    const gi = (slot, style = '') => {
        const n = giName(slot), st = style ? ` style="${style}"` : '';
        return CUSTOM_ICONS[n]
            ? `<svg class="ms gi" viewBox="0 0 512 512" aria-hidden="true"${st}>${CUSTOM_ICONS[n]}</svg>`
            : `<iconify-icon class="ms gi" icon="game-icons:${n}" aria-hidden="true"${st}></iconify-icon>`;
    };

    // Trocas de ícones Material para teste (material.html grava em 'msOverrides'): o Material desenha
    // pelo nome escrito no elemento, então basta trocar o texto. A chave é "contexto:nome"; o contexto vem do
    // data-ic mais próximo (cabeçalho, player, aba...) ou, sem ele, do nome da página. Elementos .ms-raw ficam de fora.
    const PAGE = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    const msCtx = el => el.closest('[data-ic]')?.dataset.ic ?? PAGE;
    const msOverrides = get('msOverrides', {});
    const msSwap = root => {
        if (!Object.keys(msOverrides).length) return;
        (root.matches?.('.ms') ? [root] : []).concat([...(root.querySelectorAll?.('.ms') ?? [])]).forEach(el => {
            if (el.classList.contains('gi') || el.classList.contains('ms-raw') || el.closest('.ms-raw')) return;
            const t = el.textContent.trim(), to = msOverrides[msCtx(el) + ':' + t];
            if (to && el.dataset.msTo !== t) { el.dataset.msTo = to; el.textContent = to; }
        });
    };
    const msWatch = () => {
        msSwap(document.body);
        new MutationObserver(ms => ms.forEach(m => {
            if (m.type === 'characterData') msSwap(m.target.parentElement ?? document.body);
            else m.addedNodes.forEach(n => n.nodeType === 1 ? msSwap(n) : n.parentElement && msSwap(n.parentElement));
        })).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.body) msWatch(); else document.addEventListener('DOMContentLoaded', msWatch);

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

    function header({ back = null, player = true, settings = true } = {}) {
        const el = h(`<header class="header" data-ic="cabecalho">
            <img class="header-logo" src="${LOGO}" alt="Kings of Ruin">
            <div class="header-actions">
                ${player ? `<button class="pill-btn" id="kr-ecos" aria-label="Controle de áudio"><span class="dot"><span class="ms">music_note</span></span>Ecos</button>` : ''}
                ${settings && !back ? `<a class="icon-btn" href="config.html" aria-label="Configurações"><span class="ms">settings</span></a>` : ''}
                ${back ? `<a class="pill-btn back" href="${back}"><span class="ms" style="font-size:1rem">arrow_back</span>Voltar</a>` : ''}
            </div>
        </header>`);
        document.body.prepend(el);
        if (player) initPlayer();
    }

    function nav(active) {
        const r = role();
        const items = r === 'jogador'
            ? [['cronica', 'cronica', 'Crônica'], ['condicoes', 'condicoes', 'Condições'], ['diario', 'diario', 'Diário'], ['grupo', 'personagem', 'Personagem'], ['exportar', 'exportar', 'Exportar']]
            : [['cronica', 'cronica', 'Crônica'], ['condicoes', 'condicoes', 'Condições'], ['diario', 'diario', 'Diário'], ['grupo', 'grupo', 'Grupo'], ['salvar', 'salvar', 'Salvar']];
        const el = h(`<nav class="nav"><div class="nav-inner">${items.map(([id, ic, lb]) =>
            `<a href="${id}.html" class="${id === active ? 'active' : ''}">${gi(ic)}<span>${lb}</span></a>`).join('')}</div></nav>`);
        document.body.appendChild(el);
    }

    let snackTimer = null;
    function snackbar(msg, onUndo) {
        document.querySelector('.snackbar')?.remove();
        clearTimeout(snackTimer);
        const el = h(`<div class="snackbar" role="status"><span>${esc(msg)}</span>${onUndo ? '<button>Desfazer</button>' : ''}</div>`);
        if (!document.querySelector('.nav')) el.style.bottom = '16px';
        document.body.appendChild(el);
        if (onUndo) el.querySelector('button').onclick = () => { onUndo(); el.remove(); clearTimeout(snackTimer); };
        snackTimer = setTimeout(() => el.remove(), 5000);
    }

    function confirmDialog({ title, msg, ok = 'Confirmar', danger = false }) {
        return new Promise(res => {
            const el = h(`<div class="scrim"><div class="dialog" role="dialog" aria-modal="true">
                <h3 class="t-title">${esc(title)}</h3><p>${esc(msg)}</p>
                <div class="dialog-actions"><button class="btn" data-a="0">Cancelar</button><button class="btn ${danger ? 'danger' : ''}" data-a="1">${esc(ok)}</button></div>
            </div></div>`);
            const close = v => { el.remove(); document.removeEventListener('keydown', onKey); res(v); };
            const onKey = e => { if (e.key === 'Escape') close(false); };
            el.addEventListener('click', e => { if (e.target === el) close(false); const b = e.target.closest('[data-a]'); if (b) close(b.dataset.a === '1'); });
            document.addEventListener('keydown', onKey);
            document.body.appendChild(el);
        });
    }

    function menu(anchor, items) {
        document.querySelector('.pop-menu')?.remove();
        const el = h(`<div class="pop-menu" role="menu">${items.map((it, i) =>
            `<button role="menuitem" data-i="${i}" class="${it.danger ? 'danger' : ''}"><span class="ms outline">${it.icon}</span>${esc(it.label)}</button>`).join('')}</div>`);
        document.body.appendChild(el);
        const r = anchor.getBoundingClientRect();
        const w = el.offsetWidth, hh = el.offsetHeight;
        el.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
        el.style.top = (r.bottom + hh + 8 > innerHeight ? r.top - hh - 4 : r.bottom + 4) + 'px';
        const close = () => { el.remove(); document.removeEventListener('pointerdown', out, true); document.removeEventListener('keydown', onKey); };
        const out = e => { if (!el.contains(e.target)) close(); };
        const onKey = e => { if (e.key === 'Escape') close(); };
        setTimeout(() => document.addEventListener('pointerdown', out, true));
        document.addEventListener('keydown', onKey);
        el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { close(); items[+b.dataset.i].action(); } });
    }

    function sheet(inner, ctx) {
        const el = h(`<div class="sheet-scrim"${ctx ? ` data-ic="${ctx}"` : ''}><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${inner}</div></div>`);
        const close = () => { el.remove(); document.removeEventListener('keydown', onKey); };
        const onKey = e => { if (e.key === 'Escape') close(); };
        el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) close(); });
        document.addEventListener('keydown', onKey);
        document.body.appendChild(el);
        return { el, close };
    }

    function pressPreview(row, { onCommit, enabled = () => true }) {
        let bubble = null, current = null, active = false, startRow = null;
        const place = s => {
            const r = s.getBoundingClientRect();
            bubble.textContent = s.dataset.label ?? s.textContent.trim();
            bubble.classList.toggle('marked', s.classList.contains('marked') || s.classList.contains('c-on') || s.classList.contains('d-on'));
            bubble.style.left = (r.left + r.width / 2) + 'px';
            bubble.style.top = (r.top - 8) + 'px';
            row.querySelectorAll('.pressing').forEach(x => x.classList.remove('pressing'));
            s.classList.add('pressing');
        };
        const end = commit => {
            if (!active) return;
            active = false;
            bubble?.remove(); bubble = null;
            row.querySelectorAll('.pressing').forEach(x => x.classList.remove('pressing'));
            if (commit && current) onCommit(current);
            current = null;
        };
        row.addEventListener('pointerdown', e => {
            const s = e.target.closest('.slot');
            if (!s || s.querySelector('input') || e.button > 0) return;
            active = true; current = s; startRow = s.parentElement;
            if (enabled()) { bubble = h('<div class="press-bubble"></div>'); document.body.appendChild(bubble); place(s); }
            try { row.setPointerCapture(e.pointerId); } catch {}
        });
        row.addEventListener('pointermove', e => {
            if (!active || !bubble) return;
            const s = document.elementFromPoint(e.clientX, e.clientY)?.closest('.slot');
            if (s && s.parentElement === startRow && s !== current && !s.querySelector('input')) { current = s; place(s); }
        });
        row.addEventListener('pointerup', () => end(true));
        row.addEventListener('pointercancel', () => end(false));
    }

    function swipe(rowEl, onDelete) {
        const fg = rowEl.querySelector('.swipe-fg');
        let x0 = 0, y0 = 0, dx = 0, drag = false, down = false;
        fg.addEventListener('pointerdown', e => {
            if (e.target.closest('button, select') || (e.target.matches('input') && document.activeElement === e.target)) return;
            down = true; drag = false; x0 = e.clientX; y0 = e.clientY; dx = 0;
        });
        fg.addEventListener('pointermove', e => {
            if (!down) return;
            const mx = e.clientX - x0, my = e.clientY - y0;
            if (!drag && Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) { drag = true; fg.classList.add('dragging'); try { fg.setPointerCapture(e.pointerId); } catch {} }
            if (drag) { dx = Math.min(0, mx); fg.style.transform = `translateX(${dx}px)`; e.preventDefault(); }
        });
        const up = () => {
            if (!down) return;
            down = false; fg.classList.remove('dragging');
            if (drag && dx < -fg.offsetWidth * 0.35) {
                fg.style.transform = 'translateX(-110%)';
                setTimeout(onDelete, 180);
            } else fg.style.transform = '';
            drag = false;
        };
        fg.addEventListener('pointerup', up);
        fg.addEventListener('pointercancel', up);
    }
    const swipeRow = inner => `<div class="swipe-row"><div class="swipe-bg"><span class="ms">delete</span>Remover</div><div class="swipe-fg">${inner}</div></div>`;

    const PLAYLISTS = [
        { name: 'Ecos de Ruína', icon: 'pl_musica', color: '#c2a675' },
        { name: 'Sangue e Gelo', icon: 'pl_combate', color: '#e0706a' },
        { name: 'Névoa Espessa', icon: 'pl_exploracao', color: '#8fb3c2' },
        { name: 'Taverna do Chifre', icon: 'pl_taverna', color: '#d9a14a' }
    ];
    function initPlayer() {
        const st = { playing: get('playing', false), pl: get('playlist', 0), vol: get('volume', 80), muffled: get('muffled', false), eff: 0 };
        const el = h(`<div class="player" data-ic="player" hidden role="dialog" aria-label="Player de áudio">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px">
                <div class="player-art" id="kr-art"></div>
                <div style="flex:1;min-width:0">
                    <div class="t-label" style="margin-bottom:4px">Playlist ativa</div>
                    <div style="position:relative" id="kr-plwrap">
                        <button class="pl-trigger" id="kr-pltrig"><span id="kr-plname" class="t-title" style="font-size:.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span><span class="ms" style="color:var(--text-3)">expand_more</span></button>
                        <div class="pl-list" id="kr-pllist" hidden>${PLAYLISTS.map((p, i) => `<button data-i="${i}">${gi(p.icon, `color:${p.color}`)}${p.name}</button>`).join('')}</div>
                    </div>
                    <div class="t-meta" style="margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Faixa 1 · Vento Gélido</div>
                </div>
            </div>
            <div class="progress"><div style="width:34%"></div></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px" class="t-meta"><span>1:24</span><span>−2:15</span></div>
            <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin:8px 0 12px">
                <button class="ctrl-btn" aria-label="Faixa anterior"><span class="ms">skip_previous</span></button>
                <button class="play-btn" id="kr-play" aria-label="Tocar ou pausar"><span class="ms" id="kr-playic">play_arrow</span></button>
                <button class="ctrl-btn" aria-label="Próxima faixa"><span class="ms">skip_next</span></button>
            </div>
            <div style="border-top:1px solid var(--line);padding-top:10px">
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="ms" style="color:var(--text-3);font-size:1.25rem">volume_down</span>
                    <input type="range" class="range" id="kr-vol" min="0" max="100" step="1" aria-label="Volume">
                    <span class="ms" style="color:var(--gold);font-size:1.25rem">volume_up</span>
                </div>
                <div class="t-meta" style="text-align:center;margin:-2px 0 8px" id="kr-effv"></div>
                <button class="muffle" id="kr-muffle"><span class="ms outline" style="font-size:1.2rem">mic</span><span id="kr-mufflel"></span></button>
            </div>
        </div>`);
        document.body.appendChild(el);
        const $ = id => el.querySelector('#' + id);
        const pill = document.getElementById('kr-ecos');
        let anim = null;
        const target = () => Math.round(st.vol * (st.muffled ? 0.5 : 1));
        const drawEff = () => { $('kr-effv').textContent = st.muffled ? `Volume ${st.vol}% · tocando a ${Math.round(st.eff)}%` : `Volume ${Math.round(st.eff)}%`; };
        const fadeTo = (ms) => {
            cancelAnimationFrame(anim);
            const from = st.eff, to = target(), t0 = performance.now();
            const step = t => { const k = Math.min(1, (t - t0) / ms); st.eff = from + (to - from) * k; drawEff(); if (k < 1) anim = requestAnimationFrame(step); };
            anim = requestAnimationFrame(step);
        };
        const draw = () => {
            const p = PLAYLISTS[st.pl];
            $('kr-art').innerHTML = gi(p.icon, `color:${p.color}`);
            $('kr-art').style.borderColor = p.color + '66';
            $('kr-plname').textContent = p.name;
            el.querySelectorAll('#kr-pllist button').forEach((b, i) => b.classList.toggle('sel', i === st.pl));
            $('kr-playic').textContent = st.playing ? 'pause' : 'play_arrow';
            pill.classList.toggle('playing', st.playing);
            $('kr-vol').value = st.vol;
            $('kr-muffle').classList.toggle('on', st.muffled);
            $('kr-mufflel').textContent = st.muffled ? 'Narrando · música a 50%' : 'Atenuar para narrar';
            set('playing', st.playing); set('playlist', st.pl); set('volume', st.vol); set('muffled', st.muffled);
        };
        st.eff = target();
        const open = () => { el.hidden = false; };
        const close = () => { el.hidden = true; $('kr-pllist').hidden = true; $('kr-pltrig').classList.remove('open'); };
        pill.onclick = e => { e.stopPropagation(); el.hidden ? open() : close(); };
        document.addEventListener('pointerdown', e => { if (!el.hidden && !el.contains(e.target) && !pill.contains(e.target)) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        $('kr-pltrig').onclick = () => { const l = $('kr-pllist'); l.hidden = !l.hidden; $('kr-pltrig').classList.toggle('open', !l.hidden); };
        $('kr-pllist').onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; st.pl = +b.dataset.i; $('kr-pllist').hidden = true; $('kr-pltrig').classList.remove('open'); draw(); };
        $('kr-play').onclick = () => { st.playing = !st.playing; draw(); };
        $('kr-vol').oninput = e => { st.vol = +e.target.value; st.eff = target(); drawEff(); draw(); };
        $('kr-muffle').onclick = () => { st.muffled = !st.muffled; draw(); fadeTo(1000); };
        draw(); drawEff();
    }

    return { get, set, role, esc, norm, h, gi, GAME_ICONS, header, nav, snackbar, confirmDialog, menu, sheet, pressPreview, swipe, swipeRow, applyZoom, ZOOMS };
})();
