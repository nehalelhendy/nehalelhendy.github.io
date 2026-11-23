/* =====================================================================
   CASE STUDY POP-UP (content in cases.js) — the same dark glass as the Brand Identities pop-up
   - station 01: the board (map) with small beige points · hover = the board video (laptop) / play button
     (phone) · click = the map large
   - a click on a point zooms the board into that spot (it stays there; click the board again to zoom out)
   - the stations follow one after another along a liquid line (the timeline, the same motion as the main
     site's Experience section): it drips down as you scroll, a drop keeps forming at its tip, and each
     station's bubble pops open with its number when the line reaches it (click = go there)
   - a small station bar stays at the bottom of the pop-up (always-available navigation)
   - stacks flip on their own (pause on hover); a click on any image opens the lightbox (zoom + pan)
   - the card: its image turns into the board video on hover (laptop) / while on screen (phone)
   No WebGL, no blur on big layers; only transform / opacity animate.
   ===================================================================== */
(function () {
  'use strict';
  var DATA = window.IE_CASES || {};
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  function L() { return root.lang === 'ar' ? 'ar' : 'en'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function txt(o, tag, cls, extra) {   /* bilingual text: ie.js' language switch rewrites every [data-en] */
    return '<' + tag + ' class="' + cls + '"' + (extra || '') + ' data-en="' + esc(o.en) + '" data-ar="' + esc(o.ar) + '">' + esc(o[L()]) + '</' + tag + '>';
  }
  function nn(i) { return (i < 9 ? '0' : '') + (i + 1); }
  var SVG = function (p, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var I_ZOOM = SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6M10.5 7.5v6M7.5 10.5h6"/>');
  var I_PLAY = SVG('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>', 'i-play');
  var I_PAUSE = SVG('<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="2.6"/>', 'i-pause');
  var I_OUT = SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6M7.5 10.5h6"/>');
  var I_CHEV = SVG('<path d="m9 5.5 6.5 6.5L9 18.5" stroke-width="2.2"/>');
  var I_CLOSE = SVG('<path d="M6 6l12 12M18 6 6 18" stroke-width="2"/>');
  var T = {
    zoom: { en: 'View larger', ar: 'عرض الصورة مكبّرة' }, play: { en: 'Play the board video', ar: 'تشغيل فيديو اللوحة' },
    close: { en: 'Close', ar: 'إغلاق' }, out: { en: 'Zoom out', ar: 'تصغير' }, zin: { en: 'Zoom in', ar: 'تكبير' }, go: { en: 'Go to', ar: 'انتقل إلى' }
  };

  var CS, POP, SCROLL, MAIN, current = null, C = null;
  var flow, line, nav, secs = [], nodes = [], navBtns = [], board, boardIn, vid, sh = 800;

  /* ================= build ================= */
  /* looping muted video (src set when it comes on screen) */
  function loopVid(dir, name) {
    return '<img class="cs-lv-po" src="' + dir + name + '-poster.webp" alt="" aria-hidden="true" draggable="false">' +
      '<video class="cs-lv" muted loop playsinline preload="none" poster="' + dir + name + '-poster.webp" data-src="' + dir + name + '.mp4"' + (name === 'cover' ? ' data-src-sm="' + dir + 'cover-sm.mp4"' : '') + ' aria-hidden="true"></video>';
  }
  var NEON = function (m) { return m && m.neon ? ' cs-neon' : ''; };
  function mediaHTML(m, dir) {
    if (m.k === 'vid') {           /* always playing; a click shows it large */
      return '<figure class="cs-fig cs-paper cs-neon" style="--r:0deg;aspect-ratio:' + m.w + '/' + m.h + '" data-video="' + dir + m.src + '.mp4" data-poster="' + dir + m.src + '-poster.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '">' +
        loopVid(dir, m.src) + '<span class="cs-sr">' + esc(m.alt || '') + '</span></figure>';
    }
    if (m.k === 'tanmon') {        /* the avatar + a button that plays its video with sound */
      return '<div class="cs-tan cs-paper" style="--r:0deg"><figure class="cs-fig" style="aspect-ratio:' + m.w + '/' + m.h + '" data-video="' + dir + m.video + '" data-poster="' + dir + m.video.replace('.mp4', '-poster.webp') + '" data-sound="1" tabindex="0" role="button" aria-label="' + esc(m.btn[L()]) + '">' +
        '<img src="' + dir + m.src + '.webp" alt="' + esc(m.alt || '') + '" width="' + m.w + '" height="' + m.h + '" loading="lazy" decoding="async" draggable="false"></figure>' +
        '<button type="button" class="cs-tan-btn"><span class="cs-tan-ic">' + I_PLAY + '</span>' + txt(m.btn, 'span', 'cs-tan-t') + '</button></div>';
    }
    if (m.k === 'carousel') {      /* centre image large + clear, the others smaller + darker; turns on its own */
      return '<div class="cs-cf cs-paper" style="--r:0deg" data-period="' + (m.every || 4000) + '">' + m.items.map(function (it, k) {
        return '<figure class="cs-cf-it cs-neon" data-k="' + k + '" data-full="' + dir + it.src + '-full.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '">' +
          '<img src="' + dir + it.src + '.webp" alt="' + esc(it.alt || '') + '" width="' + it.w + '" height="' + it.h + '" loading="lazy" decoding="async" draggable="false"><span class="cs-cf-dim" aria-hidden="true"></span></figure>';
      }).join('') +
        '<button type="button" class="cs-cf-btn cs-cf-prev" aria-label="Previous">' + I_CHEV + '</button><button type="button" class="cs-cf-btn cs-cf-next" aria-label="Next">' + I_CHEV + '</button>' +
        '<div class="cs-dots" aria-hidden="true">' + m.items.map(function (_, k) { return '<i' + (k ? '' : ' class="on"') + '></i>'; }).join('') + '</div></div>';
    }
    if (m.k === 'stack') {
      return '<div class="cs-stack cs-paper' + (m.neon ? ' is-neon' : '') + '" style="--r:-2deg">' +
        m.items.map(function (it, i) {
          if (it.v && window.innerWidth <= 900)                                 // phone: the stack shows each video's still only (lighter; laptop keeps the videos)
            return '<figure class="cs-card p' + i + '" data-full="' + dir + it.v + '-poster.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '"><img src="' + dir + it.v + '-poster.webp" alt="' + esc(it.alt || '') + '" width="' + it.w + '" height="' + it.h + '" loading="lazy" decoding="async" draggable="false"></figure>';
          if (it.v) return '<figure class="cs-card p' + i + '" data-video="' + dir + it.v + '.mp4" data-poster="' + dir + it.v + '-poster.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '">' +
            '<img class="cs-lv-po" src="' + dir + it.v + '-poster.webp" alt="" aria-hidden="true" draggable="false"><span class="cs-sr">' + esc(it.alt || '') + '</span></figure>';
          return '<figure class="cs-card p' + i + '" data-full="' + dir + it.src + '-full.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '"><img src="' + dir + it.src + '.webp" alt="' + esc(it.alt || '') + '" width="' + it.w + '" height="' + it.h + '" loading="lazy" decoding="async" draggable="false"></figure>';
        }).join('') +
        '<span class="cs-dots" aria-hidden="true">' + m.items.map(function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</span></div>';
    }
    if (m.k === 'row') {
      return '<div class="cs-row cs-paper" style="--r:0deg">' + m.items.map(function (it, i) {
        var tilt = (i % 2 ? 1 : -1) * (2 + Math.random() * 5), dy = Math.round(Math.random() * 28 - 10);   // each load lays them out a little differently
        return '<figure class="cs-fig cs-row-i" style="--t:' + tilt.toFixed(1) + 'deg;--dy:' + dy + 'px;z-index:' + (1 + Math.floor(Math.random() * 3)) + ';aspect-ratio:' + it.w + '/' + it.h + '" data-full="' + dir + it.src + '-full.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '">' +
          '<img src="' + dir + it.src + '.webp" alt="' + esc(it.alt || '') + '" width="' + it.w + '" height="' + it.h + '" loading="lazy" decoding="async" draggable="false"></figure>';
      }).join('') + '</div>';
    }
    return '<figure class="cs-fig cs-paper' + NEON(m) + '" style="--r:' + (m.r || 0) + 'deg;aspect-ratio:' + m.w + '/' + m.h + '" data-full="' + dir + (m.full || m.src + '-full') + '.webp" tabindex="0" role="button" aria-label="' + esc(T.zoom[L()]) + '">' +
      '<img src="' + dir + m.src + '.webp" alt="' + esc(m.alt || '') + '" width="' + m.w + '" height="' + m.h + '" loading="lazy" decoding="async" draggable="false"></figure>';
  }
  function boardHTML(dir) {
    var b = C.board;
    return '<div class="cs-board cs-paper" style="--r:0deg;aspect-ratio:' + b.w + '/' + b.h + '" role="button" tabindex="0" aria-label="' + esc(T.zoom[L()]) + '">' +
      '<div class="cs-board-in"><img src="' + dir + b.src + '" alt="' + esc(b.alt) + '" width="' + b.w + '" height="' + b.h + '" decoding="async" draggable="false">' +
      (b.video ? '<video class="cs-board-vid" muted loop playsinline preload="none" data-src="' + dir + b.video + '" aria-hidden="true"></video>' : '') +
      C.stations.map(function (s, i) {
        return s.hot ? '<button type="button" class="cs-hot" data-i="' + i + '" style="left:' + s.hot.x * 100 + '%;top:' + s.hot.y * 100 + '%" aria-label="' + esc(T.go[L()] + ' ' + s.t[L()]) + '">' +
          txt(s.t, 'span', 'cs-hot-name') + '</button>' : '';
      }).join('') + '</div>' +
      (b.video ? '<button type="button" class="cs-play" aria-label="' + esc(T.play[L()]) + '">' + I_PLAY + I_PAUSE + '</button>' : '') +
      '<button type="button" class="cs-out" aria-label="' + esc(T.out[L()]) + '">' + I_OUT + '</button></div>';
  }
  function build(slug) {
    C = DATA[slug]; var dir = C.dir, st = C.stations;
    var flowH = '<div class="cs-flow"><svg class="cs-line" aria-hidden="true"><defs>' +
      /* one colour down the whole length: fuchsia at the top → magenta → mauve at the end (bubbles take the colour of the liquid where they sit) */
      '<linearGradient id="csLineG" class="cs-lg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000"><stop offset="0" stop-color="#FF5FD2"/><stop offset=".5" stop-color="#CA12C2"/><stop offset="1" stop-color="#7A2E9A"/></linearGradient>' +
      '<filter id="csGoo" class="cs-goo" filterUnits="userSpaceOnUse" x="0" y="-100" width="200" height="1000" color-interpolation-filters="sRGB"><feGaussianBlur class="cs-blur" stdDeviation="7"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></defs>' +
      '<g class="cs-liquid" filter="url(#csGoo)" fill="url(#csLineG)"><path class="cs-line-path" fill="none" stroke="url(#csLineG)" stroke-linecap="round"/><g class="cs-nodes"></g><g class="cs-flowg"></g>' +
      '<circle class="cs-tip" r="0"/><circle class="cs-drip" r="0"/></g></svg>' +
      st.map(function (s, i) {
        var head = '<div class="cs-text">' + (i === 0 ? txt(C.title, 'h2', 'cs-title', ' id="csTitle"') + (C.sub ? txt(C.sub, 'p', 'cs-sub') : '') : '') +
          '<span class="cs-num">' + nn(i) + '</span>' + txt(s.t, 'h3', 'cs-h') + txt(s.p, 'p', 'cs-p') +
          '<button type="button" class="cs-more" data-en="More" data-ar="المزيد" aria-expanded="false">' + (L() === 'ar' ? 'المزيد' : 'More') + '</button></div>';
        return '<section class="cs-sec cs-l-' + (s.layout || 'hero') + '" id="cs-' + s.id + '" data-i="' + i + '">' +
          '<button type="button" class="cs-node-n" data-i="' + i + '" aria-label="' + esc(T.go[L()] + ' ' + s.t[L()]) + '">' + nn(i) + '</button>' + head +
          (i === 0 && C.board ? '<div class="cs-m cs-m0">' + boardHTML(dir) + '</div>' :
            (s.media || []).map(function (m, j) { return '<div class="cs-m cs-m' + j + '">' + mediaHTML(m, dir) + '</div>'; }).join('')) +
          '</section>';
      }).join('') + '</div>';
    MAIN.innerHTML = flowH;
    if (nav) nav.remove();
    nav = document.createElement('nav'); nav.className = 'cs-nav';
    nav.innerHTML = '<span class="cs-nav-signs">' + st.map(function (s, i) { return '<button type="button" class="cs-nav-b" data-i="' + i + '" aria-label="' + esc(T.go[L()] + ' ' + s.t[L()]) + '"><i>' + (i + 1) + '</i></button>'; }).join('') + '</span>' + txt(st[0].t, 'span', 'cs-nav-name');
    POP.appendChild(nav);

    flow = MAIN.querySelector('.cs-flow'); flow.classList.toggle('cs-lite-line', LITE_LINE);
    flow.classList.toggle('cs-green', C.frame === 'green');                 // a case can ask for the plain glowing-green frame (no animation)
    var sv = flow.querySelector('.cs-line');
    line = { svg: sv, path: sv.querySelector('.cs-line-path'), tip: sv.querySelector('.cs-tip'), drip: sv.querySelector('.cs-drip'), lg: sv.querySelector('.cs-lg'), blur: sv.querySelector('.cs-blur'),
      X: 0, amp: 0, sw: 12, endY: 0, cur: 0, beads: [] };
    for (var bi = 0; bi < 5; bi++) {                                        // bulges that keep flowing down inside the line
      var bc = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); sv.querySelector('.cs-flowg').appendChild(bc);
      line.beads.push({ c: bc, ph: bi / 5, k: 0.55 + (bi % 3) * 0.12 });
    }
    /* phone: a light line made of plain elements (no SVG filter, nothing drawn per frame) */
    var ml = document.createElement('div'); ml.className = 'cs-ml'; ml.setAttribute('aria-hidden', 'true');
    ml.innerHTML = '<i class="cs-ml-clip"><i class="cs-ml-fill"></i></i><i class="cs-ml-tip"><b></b></i>'; flow.appendChild(ml);
    line.ml = ml; line.mlClip = ml.firstChild; line.mlFill = ml.firstChild.firstChild; line.mlTip = ml.lastChild;
    secs = [].slice.call(flow.querySelectorAll('.cs-sec'));
    var NSs = 'http://www.w3.org/2000/svg', ng = sv.querySelector('.cs-nodes');
    nodes = secs.map(function (s, i) {
      var c = document.createElementNS(NSs, 'circle'); c.setAttribute('r', 0); ng.appendChild(c);
      var b = s.querySelector('.cs-node-n'); flow.appendChild(b);           // the number sits on its bubble (flow coordinates)
      return { sec: s, c: c, b: b, y: 0, r: 0, x: 0 };
    });
    navBtns = [].slice.call(nav.querySelectorAll('.cs-nav-b'));
    nodes.map(function (n) { return n.b; }).concat(navBtns).forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); jump(+b.dataset.i); }); });
    flow.querySelectorAll('.cs-stack').forEach(initStack);
    flow.querySelectorAll('.cs-cf').forEach(initCarousel);
    flow.querySelectorAll('.cs-fig').forEach(function (f) {
      f.addEventListener('click', function () { if (f.dataset.video) openVideo(f); else openZoom(f.querySelector('img'), f.dataset.full, f); });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.click(); } });
    });
    board = boardIn = vid = null;
    if (C.board) initBoard();
    flow.querySelectorAll('.cs-tan-btn').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); openVideo(b.parentNode.querySelector('.cs-fig')); });
    });
    watchLoops(); fixHamza();
    /* phone: long texts are cut to a few lines, "More" opens the rest (and "Less" closes it) */
    flow.querySelectorAll('.cs-more').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.parentNode, open = !t.classList.contains('is-open');
        t.classList.toggle('is-open', open); b.setAttribute('aria-expanded', open);
        b.setAttribute('data-en', open ? 'Less' : 'More'); b.setAttribute('data-ar', open ? 'أقل' : 'المزيد'); b.textContent = open ? (L() === 'ar' ? 'أقل' : 'Less') : (L() === 'ar' ? 'المزيد' : 'More');
      });
    });
    if ('ResizeObserver' in window) new ResizeObserver(function () { relayout(); }).observe(flow);
    active = -1;
  }

  /* Mohawla's «ؤ» carries ~0.29em of empty space after it (a font bug): pull it in, Arabic headings only,
     and only after a letter that never joins forward (so the shaping is untouched) */
  function fixHamza() {
    if (L() !== 'ar' || !MAIN) return;
    MAIN.querySelectorAll('.cs-h,.cs-title').forEach(function (el) {
      var t = el.textContent; if (t.indexOf('\u0624') < 0 || el.querySelector('.cs-hz')) return;
      el.innerHTML = esc(t).replace(/(^|[\s\u0627\u0623\u0625\u0622\u062F\u0630\u0631\u0632\u0648\u0629])\u0624/g, '$1<span class="cs-hz">\u0624</span>');
    });
  }

  /* ================= looping videos =================
     Phones only decode a few videos at once; a video over that limit stays frozen on its poster.
     So: a video plays only while on screen (in a stack: only the card on top), one that leaves the screen is
     unloaded, and a watchdog restarts any video that should be playing but stopped or froze. */
  var loopIO = null, vis = new WeakMap(), dog = 0, allV = [];
  var ctr = new WeakMap(), hov = new WeakMap(), ctrIO = null;
  function wanted(v) {
    if (CS.hidden || !vis.get(v)) return false;
    if (C && C.play === 'center') return !!(ctr.get(v) || hov.get(v));      // play: 'center' = only while in the middle of the screen (or under the mouse)
    var card = v.closest('.cs-card'); return !card || card.classList.contains('p0');
  }
  var SMALL = matchMedia('(max-width:900px)').matches;
  /* 22 Nov (approved): phones use the same liquid (goo) line as the laptop again — the flicker came from the heavy media, not the line.
     LITE_LINE = true brings back the light line (.cs-ml) if a phone ever struggles again */
  var LITE_LINE = false;
  function LITE() { return LITE_LINE && window.innerWidth <= 900; }
  function vLoad(v) { if (!v.getAttribute('src')) { v.src = vSrc(v); v.preload = 'auto'; v.load(); } }
  function vSrc(v) { return SMALL && v.dataset.srcSm ? v.dataset.srcSm : v.dataset.src; }
  function vStart(v) {
    vLoad(v);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function vStop(v, unload) {
    if (!v.paused) v.pause();
    if (unload && v.getAttribute('src')) { v.removeAttribute('src'); v.load(); v._t = -1; }
  }
  function vidSync() {
    allV.forEach(function (v) {
      var card = v.closest('.cs-card');
      if (wanted(v)) {
        if (card && !v._front) { v._front = true; if (v.readyState > 0) { try { v.currentTime = 0; } catch (e) {} } }
        vStart(v);
      } else {
        if (card) v._front = false;
        /* the stack's one video stays loaded while its stack is on screen; its still sits under it */
        if (card && !CS.hidden && vis.get(v)) { vLoad(v); vStop(v, false); }
        else vStop(v, !vis.get(v) || CS.hidden);
      }
    });
  }
  var neonIO = null;
  function watchNeon() {
    if (neonIO) neonIO.disconnect();
    var els = flow.querySelectorAll('.cs-neon:not(.cs-cf-it),.cs-stack.is-neon,.cs-cf'); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('nv'); }); return; }
    neonIO = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('nv', e.isIntersecting); }); }, { root: SCROLL, rootMargin: '40px 0px' });
    els.forEach(function (e) { neonIO.observe(e); });
  }
  function watchLoops() {
    watchNeon();
    if (loopIO) loopIO.disconnect(); clearInterval(dog);
    allV = [].slice.call(flow.querySelectorAll('video.cs-lv')); if (!allV.length) return;
    if (!('IntersectionObserver' in window)) { allV.forEach(function (v) { vis.set(v, true); }); vidSync(); return; }
    loopIO = new IntersectionObserver(function (en) { en.forEach(function (e) { vis.set(e.target, e.isIntersecting); }); vidSync(); }, { root: SCROLL, rootMargin: '160px 0px' });
    allV.forEach(function (v) {
      loopIO.observe(v);
    });
    if (ctrIO) { ctrIO.disconnect(); ctrIO = null; }
    if (C.play === 'center') {
      ctrIO = new IntersectionObserver(function (en) { en.forEach(function (e) { ctr.set(e.target, e.isIntersecting); }); vidSync(); }, { root: SCROLL, rootMargin: '-38% 0px -38% 0px' });
      allV.forEach(function (v) {
        ctrIO.observe(v);
        var f = v.closest('.cs-fig'); if (!fine || !f) return;
        f.addEventListener('mouseenter', function () { hov.set(v, true); vidSync(); });
        f.addEventListener('mouseleave', function () { hov.set(v, false); vidSync(); });
      });
    }
    dog = setInterval(function () {               /* the watchdog */
      if (CS.hidden) return;
      allV.forEach(function (v) {
        if (!wanted(v)) return;
        if (v.paused) vStart(v);
      });
    }, 1500);
  }

  /* ================= the board: points zoom in and lead to their station ================= */
  function initBoard() {
    board = flow.querySelector('.cs-board'); boardIn = board.querySelector('.cs-board-in'); vid = board.querySelector('.cs-board-vid');
    board.querySelectorAll('.cs-hot').forEach(function (h) {
      h.addEventListener('click', function (e) { e.stopPropagation(); zoomTo(+h.dataset.i); });
    });
    board.querySelector('.cs-out').addEventListener('click', function (e) { e.stopPropagation(); zoomTo(-1); });
    board.addEventListener('click', function (e) {
      if (e.target.closest('.cs-hot,.cs-play,.cs-out')) return;
      if (board.classList.contains('is-zoom')) zoomTo(-1);                     // zoomed in: a click on the board zooms back out
      else openZoom(board.querySelector('img'), C.dir + C.board.full, board);
    });
    board.addEventListener('keydown', function (e) { if (e.target === board && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); board.click(); } });
    if (!vid) return;
    vid.addEventListener('playing', function () { if (board.classList.contains('is-vid')) board.classList.add('is-playing'); });
    if (fine) { board.addEventListener('mouseenter', function () { vidOn(true); }); board.addEventListener('mouseleave', function () { vidOn(false); }); }
    board.querySelector('.cs-play').addEventListener('click', function (e) { e.stopPropagation(); vidOn(!board.classList.contains('is-vid')); });
  }
  /* zoom the board onto a point (it stays there) · -1 = back to the whole board */
  var zoomed = -1;
  function zoomTo(i) {
    if (!board || i === zoomed) return;
    zoomed = i; vidOn(false);
    board.querySelectorAll('.cs-hot').forEach(function (h) { h.classList.toggle('is-active', +h.dataset.i === i); });
    if (i < 0) { board.classList.remove('is-zoom'); boardIn.style.transform = ''; boardIn.style.setProperty('--inv', 1); return; }
    var p = C.stations[i].hot, k = 2.6, cl = function (v) { return Math.min(0, Math.max(1 - k, v)); };
    board.classList.add('is-zoom');
    boardIn.style.setProperty('--inv', (1 / k).toFixed(4));
    boardIn.style.transform = 'translate(' + (cl(0.5 - p.x * k) * 100).toFixed(2) + '%,' + (cl(0.5 - p.y * k) * 100).toFixed(2) + '%) scale(' + k + ')';
  }
  function vidOn(on) {
    if (!vid) return;
    if (on && !board.classList.contains('is-zoom')) { if (!vid.src) vid.src = vid.dataset.src; var p = vid.play(); if (p && p.catch) p.catch(function () {}); board.classList.add('is-vid'); }
    else { vid.pause(); board.classList.remove('is-vid', 'is-playing'); }
  }

  /* ================= layout: the liquid line through every station ================= */
  var lt = 0;   /* liquid time: the line keeps swaying gently, like a stream */
  function xAt(y) { return line.X + Math.sin(y / 95 + lt * 0.9) * line.amp + Math.sin(y / 37 - lt * 1.4) * line.amp * 0.3; }
  function relayout() {
    if (!current || CS.hidden) return;
    sh = SCROLL.clientHeight;
    flow.querySelectorAll('.cs-text').forEach(function (t) {                // "More" only where the text is really cut
      var p = t.querySelector('.cs-p'); t.classList.toggle('has-more', t.classList.contains('is-open') || p.scrollHeight > p.clientHeight + 2);
    });
    var W = flow.offsetWidth, H = flow.scrollHeight, mob = window.innerWidth <= 900, rtl = root.dir === 'rtl';
    var gut = parseFloat(getComputedStyle(flow).getPropertyValue('--cs-gut')) || 100;
    line.sw = mob ? 9 : 13; line.amp = mob ? 3.2 : 7; line.blur.setAttribute('stdDeviation', mob ? 5 : 7);
    line.X = rtl ? W - gut / 2 : gut / 2;
    line.svg.setAttribute('width', W); line.svg.setAttribute('height', H); line.svg.style.height = H + 'px';
    nodes.forEach(function (n) {
      var t = n.sec.querySelector('.cs-text'), num = n.sec.querySelector('.cs-num');
      n.y = n.sec.offsetTop + t.offsetTop + (num ? num.offsetTop + num.offsetHeight / 2 : 20);
      n.r = mob ? 17 : 24; n.x = xAt(n.y);
      n.c.setAttribute('cx', n.x); n.c.setAttribute('cy', n.y);
      n.b.style.left = n.x + 'px'; n.b.style.top = n.y + 'px';
    });
    line.endY = Math.min(H - 20, nodes[nodes.length - 1].y + (mob ? 160 : 240));
    if (LITE()) {
      line.ml.style.left = (line.X - line.sw / 2) + 'px'; line.ml.style.width = line.sw + 'px';
      line.mlClip.style.height = (line.endY + 40) + 'px';
      nodes.forEach(function (n) { n.x = line.X; n.b.style.left = n.x + 'px'; n.b.style.setProperty('--nc', lineCol(n.y / line.endY)); });
      line.ml.style.setProperty('--tc', lineCol(0));
    }
    var goo = line.goo = line.svg.querySelector('.cs-goo');               // the liquid effect only works on a narrow band around the line (light on phones)
    goo.setAttribute('x', line.X - 90); goo.setAttribute('width', 180); goo.setAttribute('height', H + 200);
    line.gy = null;
    line.path.setAttribute('stroke-width', line.sw);
    line.lg.setAttribute('y2', line.endY);
    if (reduce) line.cur = line.endY;
    update(); kick();
  }

  /* the line follows the scroll; a drop keeps forming under its tip; each bubble pops when the line reaches it */
  var raf = 0, last = 0;
  function easeBack(t) { var c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function cl01(v) { return Math.max(0, Math.min(1, v)); }
  function lineTarget() { return Math.max(0, Math.min(line.endY, SCROLL.scrollTop + sh * 0.62 - flow.offsetTop)); }
  function draw(now) {
    var t = now / 1000, cur = line.cur, sw = line.sw; lt = t;
    /* the liquid filter and the drawn line cover only the part on screen (+ a margin): on a phone the whole
       pop-up is many thousand pixels tall, and re-filtering all of it every frame made the scroll stutter */
    var vt = SCROLL.scrollTop - flow.offsetTop, gy = Math.round((vt - 200) / 50) * 50;
    if (line.goo && gy !== line.gy) { line.gy = gy; line.goo.setAttribute('y', gy); line.goo.setAttribute('height', sh + 400); }
    var y0 = Math.max(-40, Math.floor((vt - 160) / 16) * 16);
    /* the line is drawn only down to its tip, swaying a little each frame */
    var d = 'M ' + xAt(y0).toFixed(1) + ' ' + y0;
    for (var y = y0 + 16; y < cur; y += 16) d += ' L ' + xAt(y).toFixed(1) + ' ' + y;
    d += ' L ' + xAt(cur).toFixed(1) + ' ' + cur.toFixed(1);
    line.path.setAttribute('d', cur > 2 ? d : 'M0 0');
    /* bulges flowing down the stream, they melt into the line and the bubbles */
    line.beads.forEach(function (b) {
      var q = (t * 0.16 * b.k + b.ph) % 1, by = q * Math.max(cur - 10, 0);
      b.c.setAttribute('cx', xAt(by).toFixed(1)); b.c.setAttribute('cy', by.toFixed(1));
      b.c.setAttribute('r', cur > 60 ? (sw * (0.62 + 0.18 * Math.sin(t * 2 + b.ph * 9))).toFixed(2) : 0);
    });
    var ty = Math.max(cur, 2);
    line.tip.setAttribute('cx', xAt(ty)); line.tip.setAttribute('cy', ty); line.tip.setAttribute('r', cur > 4 ? sw * 0.78 : 0);
    var f = (t / 1.7) % 1, fall = f < 0.5 ? 0 : (f - 0.5) / 0.5;
    line.drip.setAttribute('cx', xAt(ty)); line.drip.setAttribute('cy', ty + sw * 0.3 + fall * fall * sw * 5 + Math.sin(f * Math.PI * 2) * 1.5);   // the drop stretches, breaks off and falls
    line.drip.setAttribute('r', cur > 4 ? sw * (0.42 + 0.22 * Math.min(1, f / 0.55)) * (1 - fall * 0.55) : 0);
    nodes.forEach(function (n, i) {
      var p = cl01((cur - n.y + n.r * 0.6) / (n.r * 1.8)), sc = p <= 0 ? 0 : easeBack(p);
      n.x = xAt(n.y); n.c.setAttribute('cx', n.x.toFixed(1)); n.b.style.left = n.x + 'px';
      n.c.setAttribute('r', (n.r * sc * (1 + 0.05 * Math.sin(t * 1.6 + i * 2))).toFixed(2));
      n.b.style.setProperty('--s', Math.max(0, sc).toFixed(3));
      if (p > 0.35) n.sec.classList.add('is-on');                         // the station appears as the line reaches it
    });
  }
  /* the line's colour at a point along it (0 = top fuchsia, .5 = magenta, 1 = mauve) */
  function lineCol(t) {
    var A = [255, 95, 210], B = [202, 18, 194], Z = [122, 46, 154]; t = cl01(t);
    var a = t < .5 ? A : B, b = t < .5 ? B : Z, k = t < .5 ? t * 2 : (t - .5) * 2;
    return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }).join(',') + ')';
  }
  function drawLite() {
    var cur = line.cur, E = line.endY || 1;
    var d = (E - cur).toFixed(1);                                         // a window sliding down over a fixed gradient
    line.mlClip.style.transform = 'translate3d(0,-' + d + 'px,0)'; line.mlFill.style.transform = 'translate3d(0,' + d + 'px,0)';
    line.mlTip.style.transform = 'translate3d(0,' + cur.toFixed(1) + 'px,0) scale(' + (cur > 4 ? 1 : 0) + ')';
    line.ml.style.setProperty('--tc', lineCol(cur / E));
    nodes.forEach(function (n) {
      var p = cl01((cur - n.y + n.r * 0.6) / (n.r * 1.8)), sc = p <= 0 ? 0 : easeBack(p);
      n.b.style.setProperty('--s', Math.max(0, sc).toFixed(3));
      if (p > 0.35) n.sec.classList.add('is-on');
    });
  }
  function frame(now) {
    raf = 0; if (!current || CS.hidden) return;
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    var tg = reduce ? line.endY : lineTarget();
    line.cur += (tg - line.cur) * Math.min(1, dt * 5); if (Math.abs(tg - line.cur) < 0.3) line.cur = tg;
    if (LITE()) { drawLite(); if (line.cur !== tg) raf = requestAnimationFrame(frame); return; }   // phone: rests when the line has arrived
    draw(now);
    if (!reduce) raf = requestAnimationFrame(frame);                       // keeps dripping while the case study is open
  }
  function kick() { if (!raf && current && !CS.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  /* ================= scroll → active station ================= */
  var active = -1;
  function setActive(i) {
    if (i === active) return; active = i;
    navBtns.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.classList.toggle('is-past', k < i); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    var nm = nav.querySelector('.cs-nav-name'), s = C.stations[i];
    nm.setAttribute('data-en', s.t.en); nm.setAttribute('data-ar', s.t.ar); nm.textContent = s.t[L()];
    nm.classList.remove('is-new'); void nm.offsetWidth; nm.classList.add('is-new');
  }
  function jump(i) {
    var s = secs[i], y = flow.offsetTop + s.offsetTop - (i === 0 ? 0 : Math.max(24, (sh - s.offsetHeight) / 2));
    SCROLL.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
  }
  function update() {
    if (!current) return;
    var top = SCROLL.scrollTop, mid = top + sh * 0.5, ft = flow.offsetTop;
    var a = 0; secs.forEach(function (s, i) { if (ft + s.offsetTop <= mid) a = i; });
    if (top + sh >= SCROLL.scrollHeight - 4) a = secs.length - 1;
    setActive(a);
    /* a station scrolled past above the screen is always shown (a fast scroll never leaves gaps) */
    secs.forEach(function (s) { if (!s.classList.contains('is-on') && ft + s.offsetTop + s.offsetHeight < top) s.classList.add('is-on'); });
    if (board && board.getBoundingClientRect().bottom < SCROLL.getBoundingClientRect().top) { vidOn(false); zoomTo(-1); }
    kick();
  }
  var tick = false;
  function onScroll() { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; update(); }); }

  /* ================= stacks: flip on their own; a click enlarges the card ================= */
  var stacks = [];
  function initStack(st) {
    var cards = [].slice.call(st.querySelectorAll('.cs-card')), dots = [].slice.call(st.querySelectorAll('.cs-dots i')), busy = false, idx = 0, hover = false, swiped = false;
    function order() { cards.forEach(function (c, k) { c.className = 'cs-card p' + Math.min(k, 3); }); }
    function next(dir) {
      if (busy || cards.length < 2) return; busy = true;
      cards[0].classList.add(dir < 0 ? 'is-out-b' : 'is-out');
      setTimeout(function () {
        cards.push(cards.shift()); order();
        idx = (idx + 1) % cards.length; dots.forEach(function (d, k) { d.classList.toggle('on', k === idx); });
        setTimeout(function () { busy = false; }, 420);
      }, reduce ? 0 : 360);
    }
    cards.forEach(function (c) {
      c.addEventListener('click', function () { if (swiped) return; if (c.dataset.video) openVideo(c); else openZoom(c.querySelector('img'), c.dataset.full, c); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
    });
    st.addEventListener('mouseenter', function () { hover = true; });
    st.addEventListener('mouseleave', function () { hover = false; });
    var sx = 0, sy = 0;
    st.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false; }, { passive: true });
    st.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = true; e.preventDefault(); next(dx < 0 ? 1 : -1); setTimeout(function () { swiped = false; }, 400); }
    });
    var hasV = !!st.querySelector('.cs-card[data-video]');
    if (hasV) {
      /* one video for the whole stack: it moves into the card at the front (the others only show their still) */
      var sv = document.createElement('video');
      sv.className = 'cs-lv'; sv.muted = true; sv.loop = true; sv.playsInline = true; sv.preload = 'none';
      sv.setAttribute('muted', ''); sv.setAttribute('playsinline', ''); sv.setAttribute('aria-hidden', 'true');
      var place = function () {
        var f = st.querySelector('.cs-card.p0');
        if (!f || !f.dataset.video || sv.parentNode === f) return;
        sv.pause(); if (sv.getAttribute('src')) { sv.removeAttribute('src'); sv.load(); }
        sv.dataset.src = f.dataset.video; sv.poster = f.dataset.poster; f.appendChild(sv);
        if (loopIO) loopIO.observe(sv);
      };
      place();
      var o0 = order; order = function () { o0(); place(); vidSync(); };
    }
    stacks.push({ el: st, next: next, period: hasV ? 5000 : 3200, paused: function () { return hover || (ZB && !ZB.hidden); } });
  }

  /* ================= carousel: the centre one large + clear, the others smaller + darker ================= */
  function initCarousel(cf) {
    var its = [].slice.call(cf.querySelectorAll('.cs-cf-it')), dots = [].slice.call(cf.querySelectorAll('.cs-dots i')), n = its.length, c = 0, hover = false, swiped = false;
    function show() {
      its.forEach(function (it, k) {
        var d = (k - c + n) % n, pos = d === 0 ? 'c' : (d === 1 ? 'n' : (d === n - 1 ? 'p' : 'h'));
        it.setAttribute('data-pos', pos); it.tabIndex = pos === 'c' ? 0 : -1;
      });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === c); });
    }
    function go(dir) { c = (c + dir + n) % n; show(); }
    var ent = { el: cf, next: function (d) { go(d || 1); }, period: +cf.dataset.period || 4000, paused: function () { return hover || (ZB && !ZB.hidden); } };
    function manual(d) { go(d); ent.reset && ent.reset(); }
    its.forEach(function (it) {
      it.addEventListener('click', function () {
        if (swiped) return;
        var pos = it.getAttribute('data-pos');
        if (pos === 'c') openZoom(it.querySelector('img'), it.dataset.full, it);
        else manual(pos === 'n' ? 1 : -1);
      });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.click(); } });
    });
    var rtl = function () { return L() === 'ar' ? -1 : 1; };   /* "next" sits on the reading side */
    cf.querySelector('.cs-cf-next').addEventListener('click', function () { manual(1); });
    cf.querySelector('.cs-cf-prev').addEventListener('click', function () { manual(-1); });
    cf.addEventListener('mouseenter', function () { hover = true; });
    cf.addEventListener('mouseleave', function () { hover = false; });
    var sx = 0, sy = 0;
    cf.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false; }, { passive: true });
    cf.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = true; e.preventDefault(); manual((dx < 0 ? 1 : -1) * rtl()); setTimeout(function () { swiped = false; }, 400); }
    });
    show(); stacks.push(ent);
  }
  var autoTs = [];
  function autoFlip(on) {
    autoTs.forEach(clearInterval); autoTs = []; if (!on || reduce) return;
    stacks.forEach(function (s) {
      var tick = function () {
        if (!s.el.isConnected || s.paused()) return;
        var top = SCROLL.getBoundingClientRect(), r = s.el.getBoundingClientRect();
        if (r.bottom > top.top && r.top < top.bottom) s.next(1);      // only while it is on screen
      };
      var start = function () { var t = setInterval(tick, s.period || 3200); autoTs.push(t); return t; };
      var t = start();
      s.reset = function () { clearInterval(t); autoTs = autoTs.filter(function (x) { return x !== t; }); t = start(); };
    });
  }

  /* ================= lightbox: full-quality image; zoom button / double-click = bigger + pan ================= */
  var ZB, ZIMG, ZBOX, zoomFrom = null;
  function buildZoom() {
    ZB = document.createElement('div'); ZB.className = 'cs-lb'; ZB.hidden = true; ZB.setAttribute('role', 'dialog'); ZB.setAttribute('aria-modal', 'true');
    ZB.innerHTML = '<div class="cs-lb-box"><img alt="" draggable="false"><video class="cs-lb-vid" playsinline preload="auto"></video></div>' +
      '<div class="cs-lb-ctrl"><button type="button" class="cs-lb-btn cs-lb-z">' + I_ZOOM + '</button><button type="button" class="cs-lb-btn cs-lb-x">' + I_CLOSE + '</button></div>';
    document.body.appendChild(ZB);
    ZBOX = ZB.querySelector('.cs-lb-box'); ZIMG = ZBOX.querySelector('img');
    ZB.querySelector('.cs-lb-x').addEventListener('click', closeZoom);
    ZB.querySelector('.cs-lb-z').addEventListener('click', function () { toggleZoom(null); });
    ZBOX.addEventListener('click', function (e) { if (e.target === ZBOX) closeZoom(); });
    ZIMG.addEventListener('dblclick', function (e) { toggleZoom(e); });
    var drag = null;
    ZBOX.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && ZB.classList.contains('is-z')) { drag = { x: e.clientX, y: e.clientY, l: ZBOX.scrollLeft, t: ZBOX.scrollTop }; ZBOX.classList.add('is-drag'); } });
    addEventListener('pointermove', function (e) { if (drag) { ZBOX.scrollLeft = drag.l - (e.clientX - drag.x); ZBOX.scrollTop = drag.t - (e.clientY - drag.y); } });
    addEventListener('pointerup', function () { drag = null; if (ZBOX) ZBOX.classList.remove('is-drag'); });
  }
  function layoutZoom() {
    var nw = ZIMG.naturalWidth || 1600, nh = ZIMG.naturalHeight || 1000, s = Math.min(ZBOX.clientWidth * 0.92 / nw, ZBOX.clientHeight * 0.84 / nh, 1);
    var k = ZB.classList.contains('is-z') ? Math.max(2, Math.min(1 / s, 3)) : 1;
    ZIMG.style.width = Math.round(nw * s * k) + 'px'; ZIMG.style.height = Math.round(nh * s * k) + 'px';
  }
  function toggleZoom(e) {
    var on = !ZB.classList.contains('is-z'), r = ZIMG.getBoundingClientRect();
    var px = e ? (e.clientX - r.left) / r.width : 0.5, py = e ? (e.clientY - r.top) / r.height : 0.5;
    ZB.classList.toggle('is-z', on); layoutZoom();
    if (on) { ZBOX.scrollLeft = ZIMG.offsetLeft + ZIMG.offsetWidth * px - ZBOX.clientWidth / 2; ZBOX.scrollTop = ZIMG.offsetTop + ZIMG.offsetHeight * py - ZBOX.clientHeight / 2; }
  }
  /* a video large: muted + looping, or (Tanmon) from the start with sound and controls */
  function openVideo(from) {
    if (!ZB) buildZoom();
    zoomFrom = from; ZB.classList.remove('is-z'); ZB.classList.add('is-v');
    var v = ZB.querySelector('.cs-lb-vid'), snd = !!from.dataset.sound;
    v.muted = !snd; v.loop = !snd; v.controls = snd; v.poster = from.dataset.poster || ''; v.src = from.dataset.video;
    ZB.querySelector('.cs-lb-x').setAttribute('aria-label', T.close[L()]);
    ZB.hidden = false; requestAnimationFrame(function () { ZB.classList.add('on'); });
    var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; });
    ZB.querySelector('.cs-lb-x').focus({ preventScroll: true });
  }
  function openZoom(img, full, from) {
    if (!ZB) buildZoom();
    zoomFrom = from; ZB.classList.remove('is-z', 'is-v');
    ZIMG.onload = layoutZoom; ZIMG.src = img.currentSrc || img.src; ZIMG.alt = img.alt;
    var f = new Image(); f.onload = function () { if (zoomFrom === from && !ZB.hidden) ZIMG.src = f.src; }; f.src = full;
    ZB.querySelector('.cs-lb-z').setAttribute('aria-label', T.zin[L()]); ZB.querySelector('.cs-lb-x').setAttribute('aria-label', T.close[L()]);
    ZB.hidden = false; layoutZoom();
    requestAnimationFrame(function () { ZB.classList.add('on'); });
    ZB.querySelector('.cs-lb-x').focus({ preventScroll: true });
  }
  function closeZoom() {
    if (!ZB || ZB.hidden) return false;
    ZB.classList.remove('on');
    var lv = ZB.querySelector('.cs-lb-vid'); lv.pause();
    setTimeout(function () { ZB.hidden = true; ZIMG.removeAttribute('src'); if (ZB.classList.contains('is-v')) { lv.removeAttribute('src'); lv.load(); ZB.classList.remove('is-v'); } }, reduce ? 0 : 260);
    if (zoomFrom) zoomFrom.focus({ preventScroll: true });
    zoomFrom = null; return true;
  }
  addEventListener('resize', function () { if (ZB && !ZB.hidden && !ZB.classList.contains('is-v')) layoutZoom(); });

  /* ================= open / close (browser back closes it too) ================= */
  var lastCard = null, loops = [];
  function playLoops() { loops.forEach(function (l) { if (l.on) l.play(); }); }
  function open(slug, instant) {
    if (!DATA[slug]) return;
    if (current !== slug) { current = slug; stacks = []; zoomed = -1; build(slug); }
    if (!CS.hidden) return;
    CS.hidden = false; root.classList.add('cs-lock');
    CS.querySelector('.cs-close').setAttribute('aria-label', T.close[L()]);
    SCROLL.scrollTop = 0; active = -1; if (line) line.cur = 0;
    document.querySelectorAll('.ie-case-vid').forEach(function (v) { v.pause(); });
    relayout(); autoFlip(true); watchLoops();
    if (instant) CS.classList.add('on'); else requestAnimationFrame(function () { CS.classList.add('on'); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    SCROLL.setAttribute('tabindex', '-1'); SCROLL.focus({ preventScroll: true });   // keyboard scrolling works at once; no ring on the close button
  }
  function close() {
    if (CS.hidden) return;
    closeZoom(); vidOn(false); zoomTo(-1); autoFlip(false);
    clearInterval(dog); allV.forEach(function (v) { vStop(v, true); });
    CS.classList.remove('on');
    setTimeout(function () {
      CS.hidden = true; root.classList.remove('cs-lock'); playLoops();
      window.dispatchEvent(new Event('resize'));                            // the page's canvases were resting while it was open
      if (lastCard) lastCard.focus({ preventScroll: true });
    }, reduce ? 0 : 420);
  }
  function requestClose() {
    if (history.state && history.state.cs) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); close(); }
  }
  function sync() { var s = decodeURIComponent(location.hash.slice(1)); if (DATA[s]) open(s); else close(); }

  function init() {
    CS = document.getElementById('csPop'); if (!CS) return;
    POP = CS.querySelector('.cs-pop'); SCROLL = CS.querySelector('.cs-scroll'); MAIN = CS.querySelector('.cs-inner');
    SCROLL.addEventListener('scroll', onScroll, { passive: true });
    var rt = 0; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(relayout, 120); });
    CS.querySelector('.cs-close').addEventListener('click', requestClose);
    CS.querySelector('.cs-veil').addEventListener('click', requestClose);
    addEventListener('popstate', sync);
    addEventListener('keydown', function (e) { if (!CS.hidden && e.key === 'Escape') { if (!closeZoom()) requestClose(); } });
    var lb = document.getElementById('langBlob');   /* the language switch rewrites [data-en]; the line follows the new text */
    if (lb) lb.addEventListener('click', function () {
      setTimeout(function () {
        if (!current) return;
        CS.querySelector('.cs-close').setAttribute('aria-label', T.close[L()]);
        MAIN.querySelectorAll('.cs-fig,.cs-card,.cs-board').forEach(function (b) { b.setAttribute('aria-label', T.zoom[L()]); });
        MAIN.querySelectorAll('.cs-out').forEach(function (b) { b.setAttribute('aria-label', T.out[L()]); });
        MAIN.querySelectorAll('.cs-node-n,.cs-hot').forEach(function (b) { b.setAttribute('aria-label', T.go[L()] + ' ' + C.stations[+b.dataset.i].t[L()]); });
        navBtns.forEach(function (b) { b.setAttribute('aria-label', T.go[L()] + ' ' + C.stations[+b.dataset.i].t[L()]); });
        fixHamza(); relayout();
      }, 30);
    });

    /* the cards */
    document.querySelectorAll('.ie-case[data-case]').forEach(function (a) {
      var slug = a.getAttribute('data-case'), media = a.querySelector('.ie-case-media'), v = a.querySelector('.ie-case-vid');
      a.addEventListener('click', function (e) {
        e.preventDefault(); lastCard = a;
        if (!(history.state && history.state.cs)) history.pushState({ cs: slug }, '', '#' + slug);
        open(slug);
      });
      if (!v) return;
      v.addEventListener('playing', function () { media.classList.add('is-vid'); });
      if (v.hasAttribute('data-loop')) {
        var lp = { v: v, on: true, play: function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); } };
        if (SMALL && v.dataset.srcSm && v.getAttribute('src') !== v.dataset.srcSm) { v.src = v.dataset.srcSm; lp.play(); }
        if (!v.paused || v.readyState > 2) media.classList.add('is-vid');
        setInterval(function () { if (lp.on && CS.hidden && v.paused && !document.hidden) lp.play(); }, 2000);   // keeps it moving
        loops.push(lp);
        if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { lp.on = en[0].isIntersecting; if (lp.on && CS.hidden) lp.play(); else v.pause(); }, { threshold: 0.15 }).observe(a);
        else lp.play();
        return;
      }
      var play = function () { if (!v.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
      var stop = function () { v.pause(); media.classList.remove('is-vid'); };
      if (fine) { a.addEventListener('mouseenter', play); a.addEventListener('mouseleave', stop); }
      else if ('IntersectionObserver' in window) {                         // phone / tablet: the board moves while the card is well on screen
        new IntersectionObserver(function (en) { if (en[0].isIntersecting && CS.hidden) play(); else stop(); }, { threshold: 0.6 }).observe(a);
      }
    });
    var h = decodeURIComponent(location.hash.slice(1));
    if (DATA[h]) { history.replaceState({ cs: 0 }, '', location.href); open(h, true); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
