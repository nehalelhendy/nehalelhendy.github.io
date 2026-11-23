/* =====================================================================
   QUIZ — the board game (content: quiz-data.js · look: styles/quiz.css)
   Opens full screen from the quiz card ("Take the Quiz"). Flow:
   intro pop-up over the soft background → "Let's start" → the platforms appear on the road →
   the dots walk to station 1 → tap the glowing station → question pop-up → choose →
   the dots light up to the next station → … → after station 8 the cave glows → tap → the result.
   Browser back / × / Esc close it; progress is kept while the page stays open.
   ===================================================================== */
(function () {
  'use strict';
  var Q = window.IEQuizData; if (!Q) return;
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function L() { return root.lang === 'ar' ? 'ar' : 'en'; }
  function tx(o) { return o ? (o[L()] != null ? o[L()] : o.en) : ''; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function bi(o) { return ' data-en="' + esc(o.en) + '" data-ar="' + esc(o.ar) + '"'; }   // static text that ie.js swaps with the language

  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_DOOR = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H13"/><path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5"/></svg>';
  var ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var N = Q.questions.length;                 // 8
  var QZ, SC, WORLD, MAP, BG, SOFT, DOTS, CAVE, TITLE, VEIL, INTRO, BOX, XBTN, HOME;
  var stEls = [], dots = [], segs = [];       // segs[k] = dots from station k-1 to k (k = 0: road start → station 1; k = N: station 8 → cave)
  var mode = '', M = { w: 0, h: 0, x: 0, y: 0 }, built = false;
  var answers = [], cur = 0, lit = -1, started = false, walking = false, modal = null, lastBtn = null;

  /* ================= build ================= */
  function build() {
    QZ = document.getElementById('qzPop'); if (!QZ || built) return; built = true;
    var U = Q.ui;
    QZ.innerHTML =
      '<div class="qz-scroll"><div class="qz-world"><div class="qz-map">' +
        '<img class="qz-bg" alt="" decoding="async"><img class="qz-soft" alt="">' +
        '<i class="qz-dim"></i><div class="qz-dots"></div>' +
        '<button type="button" class="qz-cave"' + ' aria-label="' + esc(tx(U.reveal)) + '"><i></i><i></i></button>' +
        '<div class="qz-sky" aria-hidden="true"><p class="qz-sky-t"><span' + bi({ en: U.skyTitle.en[0], ar: U.skyTitle.ar[0] }) + '></span><span' + bi({ en: U.skyTitle.en[1], ar: U.skyTitle.ar[1] }) + '></span></p>' +
          '<p class="qz-sky-s"' + bi(U.skySub) + '></p></div>' +
        '<a class="qz-home" href="../index.html">' + ICON_DOOR + '<span class="qz-home-t"><span' + bi({ en: U.homeLines.en[0], ar: U.homeLines.ar[0] }) + '></span><span' + bi({ en: U.homeLines.en[1], ar: U.homeLines.ar[1] }) + '></span></span></a>' +
      '</div>' +
      '</div></div>' +
      '<button type="button" class="qz-x">' + ICON_X + '</button>' +
      '<div class="qz-veil"></div>' +
      '<div class="qz-box qz-intro" role="document"><div class="qz-in">' +
        '<p class="qz-label"' + bi(U.introLabel) + '></p>' +
        '<h2 class="qz-h"><span' + bi({ en: U.introTitle.en[0], ar: U.introTitle.ar[0] }) + '></span><span class="ie-grad"' + bi({ en: U.introTitle.en[1], ar: U.introTitle.ar[1] }) + '></span></h2>' +
        '<p class="qz-p"' + bi(U.introText) + '></p>' +
        '<ol class="qz-steps">' + U.steps.en.map(function (s, i) { return '<li><b>' + (i + 1) + '</b><span' + bi({ en: s, ar: U.steps.ar[i] }) + '></span></li>'; }).join('') + '</ol>' +
        '<button type="button" class="ie-btn qz-go"><span' + bi(U.start) + '></span>' + ICON_ARROW + '</button>' +
      '</div></div>' +
      '<div class="qz-box qz-modal" role="document"></div>';
    SC = QZ.querySelector('.qz-scroll'); WORLD = QZ.querySelector('.qz-world'); MAP = QZ.querySelector('.qz-map');
    BG = QZ.querySelector('.qz-bg'); SOFT = QZ.querySelector('.qz-soft'); DOTS = QZ.querySelector('.qz-dots');
    CAVE = QZ.querySelector('.qz-cave'); TITLE = QZ.querySelector('.qz-sky');
    VEIL = QZ.querySelector('.qz-veil'); INTRO = QZ.querySelector('.qz-intro'); BOX = QZ.querySelector('.qz-modal');
    XBTN = QZ.querySelector('.qz-x'); HOME = QZ.querySelector('.qz-home');
    texts();

    Q.questions.forEach(function (q, i) {
      var b = el('button', 'qz-st is-lock');
      b.type = 'button'; b.style.setProperty('--i', i); b.dataset.i = i;
      b.innerHTML = '<span class="qz-float"><span class="qz-glow"></span><img class="qz-plat" src="assets/quiz/platform.webp" alt="" draggable="false">' +
        '<span class="qz-icw"><img class="qz-ico" src="assets/quiz/icon-' + (i + 1) + '.webp" alt="" draggable="false"><span class="qz-tap" aria-hidden="true">' + ICON_OK + '</span></span></span>';
      b.addEventListener('click', function () { tapStation(i); });
      MAP.appendChild(b); stEls.push(b);
    });

    QZ.querySelector('.qz-go').addEventListener('click', start);
    CAVE.addEventListener('click', function () { if (cur >= N && !walking) { lastBtn = CAVE; openResult(); } });
    XBTN.addEventListener('click', requestClose);
    VEIL.addEventListener('click', function () { if (modal) closeModal(); });
    HOME.addEventListener('click', function () { try { sessionStorage.setItem('nehLang', L()); sessionStorage.removeItem('nehGo'); } catch (e) {} });
    var rt = 0; addEventListener('resize', function () { if (QZ.hidden) return; clearTimeout(rt); rt = setTimeout(layout, 120); });
  }
  function texts() {
    var U = Q.ui;
    QZ.querySelectorAll('[data-en]').forEach(function (e) { e.textContent = e.getAttribute('data-' + L()); });
    XBTN.setAttribute('aria-label', tx(U.close)); HOME.setAttribute('aria-label', tx(U.home));
    CAVE.setAttribute('aria-label', tx(U.reveal));
    QZ.setAttribute('aria-label', tx(U.introTitle).join(' '));
    stEls.forEach(function (b, i) { b.setAttribute('aria-label', pad(i + 1) + ' — ' + tx(Q.questions[i].topic)); });
  }

  /* ================= layout: the background covers the screen (laptop) or the width (tall phone image) ================= */
  function layout() {
    var W = QZ.clientWidth, H = QZ.clientHeight;
    var m = (W <= 760 || W / H < 1) ? 'mob' : 'lap', B = Q.boards[m], iw = B.img.w, ih = B.img.h;
    if (m !== mode) {
      mode = m; QZ.classList.toggle('is-tall', m === 'mob');
      SOFT.src = B.img.soft;
      stEls.forEach(function (b) { b.querySelector('.qz-plat').src = B.plat || 'assets/quiz/platform.webp'; });
      TITLE.hidden = !B.title;
      QZ.classList.toggle('is-bigicon', !!B.icon);
      if (B.icon) QZ.style.setProperty('--iw', B.icon); else QZ.style.removeProperty('--iw');
      BG.classList.remove('is-in'); BG.onload = function () { BG.classList.add('is-in'); };
      var big = (m === 'lap' ? W : W) * (window.devicePixelRatio || 1) > (m === 'lap' ? 1700 : 760);
      BG.src = big ? B.img.srcBig : B.img.src;
      if (BG.complete && BG.naturalWidth) BG.classList.add('is-in');
    }
    var mw, mh, x, y, worldH;
    mw = W; mh = W * ih / iw; if (mh < H) { mh = H; mw = H * iw / ih; }      // full width; taller than the screen → scroll
    x = (W - mw) / 2; y = 0; worldH = mh;
    QZ.classList.toggle('is-scroll', worldH > H + 1);
    M = { w: mw, h: mh, x: x, y: y };
    WORLD.style.height = worldH + 'px';
    MAP.style.width = mw + 'px'; MAP.style.height = mh + 'px'; MAP.style.setProperty('--mw', mw + 'px'); MAP.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';

    var pw = B.size ? B.size * mw : Math.min(0.2 * mw, 118);        // platform width
    B.st.forEach(function (p, i) {
      var b = stEls[i], s = depth(p[1]);
      b.style.left = p[0] * mw + 'px'; b.style.top = p[1] * mh + 'px'; b.style.setProperty('--w', (pw * s).toFixed(1) + 'px');
    });
    var c = B.cave; CAVE.style.left = c[0] * mw + 'px'; CAVE.style.top = c[1] * mh + 'px'; CAVE.style.setProperty('--cw', c[2] * mw + 'px');
    var hm = B.home; HOME.style.left = hm[0] * mw + 'px'; HOME.style.top = hm[1] * mh + 'px';
    if (B.title) TITLE.style.top = B.title * mh + 'px';
    makeDots(B, pw);
  }
  function depth(y) { var d = Q.boards[mode].depth, t = Math.max(0, Math.min(1, (y - d[0]) / (d[1] - d[0]))); return 0.86 + 0.24 * t; }

  /* the road as a smooth curve (Catmull-Rom through the traced points), sampled into evenly spaced dots */
  function makeDots(B, pw) {
    var P = B.path.map(function (p) { return [p[0] * M.w, p[1] * M.h]; }), fine = [];
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (var k = 0; k < 16; k++) {
        var t = k / 16, t2 = t * t, t3 = t2 * t;
        fine.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                   0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    fine.push(P[P.length - 1]);
    var ds = B.dot ? Math.max(8, B.dot[0] * M.w) : 5;
    var gap = B.dot ? ds * B.dot[1] : Math.max(13, M.w * 0.042), pts = [fine[0]], acc = 0;
    for (var j = 1; j < fine.length; j++) {
      var dx = fine[j][0] - fine[j - 1][0], dy = fine[j][1] - fine[j - 1][1]; acc += Math.sqrt(dx * dx + dy * dy);
      if (acc >= gap) { pts.push(fine[j]); acc = 0; }
    }
    // where each station (and the cave) sits on the road
    var marks = B.st.map(function (p) { return near(pts, p[0] * M.w, p[1] * M.h); });
    marks.push(pts.length - 1);
    var keep = (pw * 0.55);
    DOTS.innerHTML = ''; dots = []; segs = [];
    for (var s = 0; s <= N; s++) segs.push([]);
    pts.forEach(function (p, idx) {
      var seg = 0; while (seg < N && idx > marks[seg]) seg++;
      // keep the dots off the platforms and out of the cave mouth
      for (var q = 0; q < N; q++) { var sp = B.st[q]; if (Math.hypot(p[0] - sp[0] * M.w, (p[1] - sp[1] * M.h) * 1.6) < keep * depth(sp[1])) return; }
      if (Math.hypot(p[0] - B.cave[0] * M.w, p[1] - B.cave[1] * M.h) < B.cave[2] * M.w * 0.22) return;
      var d = el('i', 'qz-dot'); d.style.left = p[0].toFixed(1) + 'px'; d.style.top = p[1].toFixed(1) + 'px';
      d.style.setProperty('--s', depth(p[1] / M.h).toFixed(2)); d.style.setProperty('--ds', ds.toFixed(1) + 'px');
      d.style.setProperty('--a', 300 + idx * 6);
      DOTS.appendChild(d); dots.push(d); segs[seg].push(d);
    });
    // lit state survives a resize / orientation change
    for (var k2 = 0; k2 <= lit; k2++) segs[k2].forEach(function (d) { d.classList.add('is-lit'); });
  }
  function near(pts, x, y) { var b = 0, bd = 1e12; pts.forEach(function (p, i) { var d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; }

  /* ================= flow ================= */
  function start() {
    started = true; INTRO.classList.remove('on'); QZ.classList.remove('has-modal');
    QZ.classList.add('is-play');
    setTimeout(function () { walk(0); }, reduce ? 0 : 1300);
  }
  function setStates() {
    stEls.forEach(function (b, i) {
      b.classList.toggle('is-done', answers[i] != null);
      b.classList.toggle('is-on', i === cur && !walking);
      b.classList.toggle('is-lock', i > cur || (i === cur && walking));
    });
    QZ.classList.toggle('is-ready', cur >= N && !walking);
  }
  // light the dots of segment k one by one, then wake station k (or the cave)
  function walk(k) {
    walking = true; lit = k; setStates();
    var list = segs[k] || [], step = reduce ? 0 : Math.min(55, 1500 / Math.max(1, list.length));
    list.forEach(function (d, j) { d.style.setProperty('--d', Math.round(j * step)); });
    void DOTS.offsetWidth;
    list.forEach(function (d) { d.classList.add('is-lit'); });
    follow(k < N ? stEls[k] : CAVE, list.length * step);
    setTimeout(function () {
      walking = false; cur = k; setStates();
      list.forEach(function (d) { d.style.removeProperty('--d'); });
    }, reduce ? 0 : list.length * step + 380);
  }
  // scrolling board: keep the walk and the next station on screen
  function follow(target, dur) {
    if (!QZ.classList.contains('is-scroll') || !target) return;
    var ty = parseFloat(target.style.top), rel = ty - SC.scrollTop, Hh = SC.clientHeight;
    if (rel > Hh * 0.22 && rel < Hh * 0.8) return;             // already comfortably on screen
    var y = ty - Hh * 0.45;
    y = Math.max(0, Math.min(SC.scrollHeight - SC.clientHeight, y));
    if (Math.abs(SC.scrollTop - y) < 30) return;
    try { SC.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { SC.scrollTop = y; }
  }
  function tapStation(i) {
    if (!started || walking) return;
    if (i === cur || answers[i] != null) { lastBtn = stEls[i]; openQuestion(i); }
  }

  /* ================= pop-ups ================= */
  function showBox(b) {
    QZ.classList.add('has-modal'); QZ.classList.toggle('is-modal', b === BOX); b.classList.add('on');
    var sc = b.querySelector('.qz-in'); if (sc) sc.scrollTop = 0;
    var f = b.querySelector('.qz-opt.is-sel, .qz-opt, .qz-go, .qz-link'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function closeModal() {
    if (!modal) return; modal = null;
    BOX.classList.remove('on'); QZ.classList.remove('has-modal', 'is-modal');
    if (lastBtn) lastBtn.focus({ preventScroll: true });
  }
  function openQuestion(i) {
    var q = Q.questions[i], U = Q.ui;
    modal = { type: 'q', i: i };
    BOX.className = 'qz-box qz-modal qz-q';
    BOX.setAttribute('aria-label', tx(q.q));
    BOX.innerHTML = '<button type="button" class="qz-bx" aria-label="' + esc(tx(U.close)) + '">' + ICON_X + '</button><div class="qz-in">' +
      '<div class="qz-qhead"><img class="qz-qico" src="assets/quiz/icon-' + (i + 1) + '.webp" alt="">' +
      '<div><div class="qz-num">' + pad(i + 1) + ' / ' + pad(N) + ' <em>' + esc(tx(q.topic)) + '</em></div><h3 class="qz-qt">' + esc(tx(q.q)) + '</h3></div></div>' +
      '<div class="qz-opts" role="radiogroup">' + q.o.map(function (o, k) {
        var sel = answers[i] === k;
        return '<button type="button" class="qz-opt' + (sel ? ' is-sel' : '') + '" role="radio" aria-checked="' + sel + '" data-k="' + k + '"><b>' + esc(tx(o.t)) + '</b><span>' + esc(tx(o.d)) + '</span></button>';
      }).join('') + '</div></div>';
    BOX.querySelector('.qz-bx').addEventListener('click', closeModal);
    BOX.querySelectorAll('.qz-opt').forEach(function (b) { b.addEventListener('click', function () { choose(i, +b.dataset.k, b); }); });
    showBox(BOX);
  }
  function choose(i, k, btn) {
    if (modal && modal.locked) return;
    BOX.querySelectorAll('.qz-opt').forEach(function (b) { var on = b === btn; b.classList.toggle('is-sel', on); b.setAttribute('aria-checked', on); });
    var first = answers[i] == null; answers[i] = k; modal.locked = true;
    setTimeout(function () {
      closeModal();
      if (first && i === cur) { setStates(); setTimeout(function () { walk(i + 1); }, reduce ? 0 : 420); }
      else setStates();
    }, reduce ? 120 : 520);
  }

  /* ================= the result ================= */
  function compute() {
    var sc = {}; Q.types.split('').forEach(function (t) { sc[t] = 0; });
    Q.points.forEach(function (row, qi) { var p = row[answers[qi]] || {}; for (var t in p) sc[t] += p[t]; });
    var best = Math.max.apply(null, Q.types.split('').map(function (t) { return sc[t]; }));
    var tied = Q.types.split('').filter(function (t) { return sc[t] === best; });
    var g = Q.goalType.charAt(answers[0]);
    var type = tied.indexOf(g) > -1 ? g : tied[0];
    var style = answers[6] || 0;
    return { type: type, style: style, r: Q.results[type][style], img: 'assets/quiz/results/quiz-' + type + (style + 1) + '.webp', score: sc };
  }
  function specs() { return Q.specs.map(function (s) { return tx(s[1])[answers[s[0]]]; }); }
  function message(R) {
    var U = Q.ui, lines = [tx(U.msgHi), '', tx(U.msgResult) + ': ' + tx(R.r.n) + ' (' + tx(Q.typeNames[R.type]) + ')', '', tx(U.msgAnswers) + ':'];
    Q.questions.forEach(function (q, i) { lines.push('- ' + tx(q.topic) + ': ' + tx(q.o[answers[i]].t)); });
    lines.push('', tx(U.msgEnd));
    return lines.join('\n');
  }
  function openResult() {
    var R = compute(), U = Q.ui;
    // kept for the main page's contact section (it can pre-fill the message with the result and the answers)
    try { sessionStorage.setItem('nehQuiz', JSON.stringify({ result: R.type + (R.style + 1), en: message(R), lang: L() })); } catch (e) {}
    modal = { type: 'r' };
    BOX.className = 'qz-box qz-modal qz-res';
    BOX.setAttribute('aria-label', tx(R.r.n));
    BOX.innerHTML = '<button type="button" class="qz-bx" aria-label="' + esc(tx(U.close)) + '">' + ICON_X + '</button><div class="qz-in">' +
      '<figure class="qz-rimg"><img src="' + R.img + '" alt="' + esc(tx(R.r.n)) + '" width="765" height="508"></figure>' +
      '<div class="qz-rtxt">' +
        '<p class="qz-label">' + esc(tx(U.resultLabel)) + '</p>' +
        '<p class="qz-rtype">' + esc(tx(Q.typeNames[R.type])) + '</p>' +
        '<h3 class="qz-rname ie-grad">' + esc(tx(R.r.n)) + '</h3>' +
        '<p class="qz-rdesc">' + esc(tx(R.r.d)) + '</p>' +
        '<ul class="qz-specs">' + specs().map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '<div class="qz-cta"><h4>' + esc(tx(U.contactTitle)) + '</h4><p>' + esc(tx(U.contactText)) + '</p>' +
          '<a class="ie-btn qz-connect" href="' + esc(Q.connect) + '"><span>' + esc(tx(U.connectBtn)) + '</span>' + ICON_ARROW + '</a>' +
        '</div>' +
      '</div></div>';
    BOX.querySelector('.qz-bx').addEventListener('click', closeModal);
    BOX.querySelector('.qz-connect').addEventListener('click', function () { try { sessionStorage.setItem('nehLang', L()); sessionStorage.removeItem('nehGo'); } catch (e) {} });
    showBox(BOX);
  }

  /* ================= open / close (the browser's back closes it too) ================= */
  function open(instant) {
    build(); if (!QZ.hidden) return;
    QZ.hidden = false; root.classList.add('qz-lock');
    document.querySelectorAll('.ie-case-vid').forEach(function (v) { v.pause(); });
    texts(); layout();
    if (!started) { QZ.classList.add('has-modal'); INTRO.classList.add('on'); }
    if (instant || reduce) QZ.classList.add('on'); else requestAnimationFrame(function () { QZ.classList.add('on'); });
    var f = started ? (cur < N ? stEls[cur] : CAVE) : QZ.querySelector('.qz-go');
    setTimeout(function () { if (f) f.focus({ preventScroll: true }); if (started) follow(cur < N ? stEls[cur] : CAVE, 0); }, 80);
  }
  function close() {
    if (!QZ || QZ.hidden) return;
    closeModal(); QZ.classList.remove('on');
    setTimeout(function () {
      QZ.hidden = true; root.classList.remove('qz-lock');
      var cd = document.getElementById('ieQuiz'); if (cd) cd.classList.remove('is-lit');
      window.dispatchEvent(new Event('resize'));          // the page's canvases were resting while it was open
      var b = document.querySelector('#ieQuiz .ie-btn'); if (b) b.focus({ preventScroll: true });
    }, reduce ? 0 : 450);
  }
  function requestClose() {
    if (history.state && history.state.qz) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); close(); }
  }

  function init() {
    if (!document.getElementById('qzPop')) return;
    var card = document.getElementById('ieQuiz'), btn = card && card.querySelector('.ie-btn');
    if (card) {
      // tapping the card (or its button) lights the cave like the end of the quiz, then the board opens
      card.addEventListener('click', function (e) {
        e.preventDefault();
        if (card.classList.contains('is-lit')) return;
        card.classList.add('is-lit');
        setTimeout(function () {
          if (!(history.state && history.state.qz)) history.pushState({ qz: 1 }, '', '#quiz');
          open();
        }, reduce ? 0 : 800);
      });
    }
    if (btn) {
      var warm = function () { var i = new Image(); var lap = innerWidth > 760 && innerWidth / innerHeight >= 1; i.src = lap ? Q.boards.lap.img.src : Q.boards.mob.img.src; };
      btn.addEventListener('pointerenter', warm, { once: true }); btn.addEventListener('touchstart', warm, { once: true, passive: true });
    }
    addEventListener('popstate', function () { if (location.hash === '#quiz') open(); else close(); });
    addEventListener('keydown', function (e) {
      if (!QZ || QZ.hidden || e.key !== 'Escape') return;
      if (modal) closeModal(); else requestClose();
    });
    var lb = document.getElementById('langBlob');
    if (lb) lb.addEventListener('click', function () {
      setTimeout(function () {
        if (!QZ) return; texts();
        if (modal && modal.type === 'q') { var lk = modal.locked; openQuestion(modal.i); modal.locked = lk; }
        else if (modal && modal.type === 'r') openResult();
      }, 40);
    });
    if (location.hash === '#quiz') { history.replaceState({ qz: 0 }, '', location.href); open(true); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
