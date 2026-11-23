/* =====================================================================
   HERO SEQUENCE — the opening scene, identical on every screen size
   (only sizes change, computed from the hero by IEStage):
     1 empty background ........ 0    → 0.5 s
     2 hand + screen enter ..... 0.5  → 1.6 s  (hand from the left, the screen right behind it from the right)
       they close the gap ...... 1.6  → 1.95 s
     3 touch + flash ........... 1.95 s    strong white/violet light that holds, then stays as a bright point
     4 retreat ................. 2.3  → 3.1 s  (both leave the frame; the bright point stays on the anchor)
     5 sphere forms ............ 3.0  → 4.4 s  (out of that same point, no dip, no jump) — big and bright
     6 sphere alone ............ 4.4  → 4.8 s
       settles ................. 4.8  → 6.0 s  (≈30% smaller, lighter, behind the titles; background waves fade in)
     7 titles appear ........... 5.2  → 6.2 s  (above the sphere)
     8 idle: sphere is interactive (mouse / touch)
   One timeline, driven by requestAnimationFrame, so every element always
   reads the same anchor. Reduced motion → no travel, just a calm fade.
   ===================================================================== */
(function () {
  'use strict';

  var SPEED = 1.5;   // Nov 22: the whole scene plays 1.5× faster (≈4 s instead of ≈6 s); the timings below keep their proportions
  var T = { start: 0.5, handIn: [0.5, 1.5], screenIn: [0.6, 1.6], close: [1.6, 1.95], touch: 1.95,
            out: [2.3, 3.1], sphere: [3.0, 4.4], settle: [4.8, 6.0], label: 5.2, title: 5.45, live: 6.2 };
  var SETTLED = { light: 0.85 }, PEAK = 1.35;   // sphere: final brightness and peak brightness (final size: settled(), 0.75 phone / 0.8 laptop)

  var hero, hand, screen, flash, label, title, m, gap = 0, offL = 0, offR = 0;
  var t = 0, last = 0, raf = 0, done = false;

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var span = function (a, b) { return clamp((t - a) / (b - a)); };
  var outCubic = function (p) { return 1 - Math.pow(1 - p, 3); };
  var inOut = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var inCubic = function (p) { return p * p * p; };

  /* the intro sits just under the settled sphere (never on top of the title), on every screen size */
  function fitText() {
    var h1 = document.getElementById('ieTitle'), intro = document.getElementById('ieIntro');
    if (!h1 || !intro || !m) return;
    var hr = hero.getBoundingClientRect(), tr = h1.getBoundingClientRect();
    var titleBottom = tr.bottom - hr.top;                                   // in hero pixels
    var rs = window.IESphere.radius() * settled().size;                    // the sphere's final radius
    var gap = m.W < 760 ? 14 : 18;
    intro.style.marginTop = Math.max(gap, m.ay + rs + gap - titleBottom) + 'px';
  }
  function settled() { return { size: m && m.W < 760 ? 0.75 : 0.8, light: SETTLED.light }; }

  function layout() {
    m = window.IEStage.measure(hero);
    hand.style.width = m.hand.w + 'px'; screen.style.width = m.screen.w + 'px';
    gap = Math.min(m.W, m.H) * 0.07;                       // distance left between fingertip and glass before the touch
    offL = -(m.hand.x + m.hand.w) - 20;                    // hand fully outside, to the left
    offR = m.W - m.screen.x + 20;                          // screen fully outside, to the right
    var fs = Math.min(m.W, m.H) * 0.8;                     // flash size
    flash.style.width = flash.style.height = fs + 'px';
    flash.style.left = (m.ax - fs / 2) + 'px'; flash.style.top = (m.ay - fs / 2) + 'px';
    window.IESphere.layout(m);
    if (window.IEWaves) window.IEWaves.layout(m);
    fitText();
    render();
  }

  function render() {
    // ---- hand: in from the left, close the gap, back out to the left (its wrist always beyond the edge)
    var hx;
    if (t < T.close[0]) hx = offL + (-gap - offL) * outCubic(span(T.handIn[0], T.handIn[1]));
    else if (t < T.out[0]) hx = -gap + gap * inOut(span(T.close[0], T.close[1]));
    else hx = offL * inCubic(span(T.out[0], T.out[1]));
    // ---- screen: in from the right, same rhythm, back out to the right
    var sx;
    if (t < T.close[0]) sx = offR + (gap - offR) * outCubic(span(T.screenIn[0], T.screenIn[1]));
    else if (t < T.out[0]) sx = gap - gap * inOut(span(T.close[0], T.close[1]));
    else sx = offR * inCubic(span(T.out[0], T.out[1]));
    var shown = t >= T.start && t < T.out[1];
    hand.style.opacity = shown ? 1 : 0; screen.style.opacity = shown ? 1 : 0;
    hand.style.transform = 'translate3d(' + (m.hand.x + hx) + 'px,' + m.hand.y + 'px,0)';
    screen.style.transform = 'translate3d(' + (m.screen.x + sx) + 'px,' + m.screen.y + 'px,0)';

    // ---- flash on the anchor: sharp rise, holds strong, then shrinks to a bright point that STAYS
    //      until the sphere's own seed of light has taken over (no fading out and back in)
    var ft = t - T.touch, f = 0, sc = 0.3;
    if (ft >= 0) {
      f = 1;
      if (ft < 0.07) sc = 0.4 + 0.6 * (ft / 0.07);                         // burst
      else if (ft < 0.42) sc = 1 + 0.04 * Math.sin(ft * 30);               // hold, alive
      else sc = 1 - 0.7 * outCubic(clamp((ft - 0.42) / 0.5));             // shrink to the point
      f *= 1 - span(T.sphere[0] + 0.25, T.sphere[0] + 0.8);               // hand-over to the sphere's seed (same place, same brightness)
    }
    flash.style.opacity = f; flash.style.transform = 'scale(' + sc + ')';

    // ---- sphere: grows big and bright, then settles smaller and lighter behind the titles
    window.IESphere.setGrow(t < T.sphere[0] ? 0 : span(T.sphere[0], T.sphere[1]));
    var gl = span(T.sphere[0], T.sphere[1]), st = inOut(span(T.settle[0], T.settle[1]));
    var S = settled();
    window.IESphere.setLook(1 - (1 - S.size) * st, (0.85 + (PEAK - 0.85) * gl) * (1 - st) + S.light * st);
    hero.classList.toggle('ie-waves-on', t >= T.settle[0]);
    // ---- titles
    hero.classList.toggle('ie-show-label', t >= T.label);
    hero.classList.toggle('ie-show-title', t >= T.title);
    if (t >= T.live && !done) { done = true; window.IESphere.setInteractive(true); }
  }

  function tick(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;   // clamped: a slow frame never skips a scene
    t += dt * SPEED;
    render();
    if (t < T.live + 0.1) raf = requestAnimationFrame(tick);
    else { hand.style.display = screen.style.display = 'none'; }           // finished: nothing left to move but the sphere
  }

  function play() {
    hero = document.getElementById('ieHero'); hand = document.getElementById('ieHand'); screen = document.getElementById('ieScreen');
    flash = document.getElementById('ieFlash'); label = document.getElementById('ieLabel'); title = document.getElementById('ieTitle');
    if (!hero || !window.IEStage || !window.IESphere) return;
    window.IESphere.init(document.getElementById('ieSphere'), hero);
    if (window.IEWaves) window.IEWaves.init(document.getElementById('ieWaves'), hero);
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { layout(); }) : null;
    if (ro) ro.observe(hero); else addEventListener('resize', layout);

    var ready = [hand, screen].map(function (img) { return img.decode ? img.decode().catch(function () {}) : Promise.resolve(); });
    if (document.fonts && document.fonts.ready) ready.push(document.fonts.ready);
    Promise.race([Promise.all(ready), new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
      layout();
      window.IESphere.start();
      if (window.IEWaves) window.IEWaves.start();
      if (reduced) {   // calm version: no travel, no flash — the sphere and titles simply fade in
        t = T.live; hero.classList.add('ie-reduced'); render(); hand.style.display = screen.style.display = 'none';
        return;
      }
      hero.classList.add('ie-playing');
      // review aid: ?t=4.6 freezes the scene at that second (to check the touch point, the flash, the sphere...)
      var freeze = null; try { freeze = parseFloat(new URLSearchParams(location.search).get('t')); } catch (e) {}
      if (freeze >= 0) { t = freeze; render(); if (t >= T.out[1]) hand.style.display = screen.style.display = 'none'; return; }
      raf = requestAnimationFrame(tick);
    });
  }

  window.IEHero = { play: play, fit: function () { if (hero) fitText(); } };
})();
