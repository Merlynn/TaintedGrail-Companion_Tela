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

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

    function header({ back = null, player = true, settings = true } = {}) {
        const el = h(`<header class="header">
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
            ? [['cronica', 'hourglass_bottom', 'Crônica'], ['condicoes', 'library_books', 'Condições'], ['diario', 'auto_stories', 'Diário'], ['grupo', 'person', 'Personagem'], ['exportar', 'share', 'Exportar']]
            : [['cronica', 'hourglass_bottom', 'Crônica'], ['condicoes', 'library_books', 'Condições'], ['diario', 'auto_stories', 'Diário'], ['grupo', 'groups', 'Grupo'], ['salvar', 'book_5', 'Salvar']];
        const el = h(`<nav class="nav"><div class="nav-inner">${items.map(([id, ic, lb]) =>
            `<a href="${id}.html" class="${id === active ? 'active' : ''}"><span class="ms">${ic}</span><span>${lb}</span></a>`).join('')}</div></nav>`);
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

    function sheet(inner) {
        const el = h(`<div class="sheet-scrim"><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${inner}</div></div>`);
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
        { name: 'Ecos de Ruína', icon: 'music_note', color: '#c2a675' },
        { name: 'Sangue e Gelo', icon: 'swords', color: '#e0706a' },
        { name: 'Névoa Espessa', icon: 'explore', color: '#8fb3c2' },
        { name: 'Taverna do Chifre', icon: 'sports_bar', color: '#d9a14a' }
    ];
    function initPlayer() {
        const st = { playing: get('playing', false), pl: get('playlist', 0), vol: get('volume', 80), muffled: get('muffled', false), eff: 0 };
        const el = h(`<div class="player" hidden role="dialog" aria-label="Player de áudio">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px">
                <div class="player-art"><span class="ms" id="kr-art"></span></div>
                <div style="flex:1;min-width:0">
                    <div class="t-label" style="margin-bottom:4px">Playlist ativa</div>
                    <div style="position:relative" id="kr-plwrap">
                        <button class="pl-trigger" id="kr-pltrig"><span id="kr-plname" class="t-title" style="font-size:.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span><span class="ms" style="color:var(--text-3)">expand_more</span></button>
                        <div class="pl-list" id="kr-pllist" hidden>${PLAYLISTS.map((p, i) => `<button data-i="${i}"><span class="ms" style="color:${p.color}">${p.icon}</span>${p.name}</button>`).join('')}</div>
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
            $('kr-art').textContent = p.icon; $('kr-art').style.color = p.color;
            el.querySelector('.player-art').style.borderColor = p.color + '66';
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

    return { get, set, role, esc, norm, h, header, nav, snackbar, confirmDialog, menu, sheet, pressPreview, swipe, swipeRow, applyZoom, ZOOMS };
})();
