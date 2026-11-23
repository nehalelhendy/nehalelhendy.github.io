/* =====================================================================
   ENERGY SPHERE — drawn in code on a Canvas 2D (no WebGL on this site).
   A semi-transparent ball of twisted light ribbons (purple, magenta,
   electric blue, cyan, touches of orange), each ribbon made of thin
   parallel strands, slowly rotating, its strands waving all the time.
   It grows from the exact touch point (the shared anchor) and never
   leaves it: mouse / touch only tilt it, spin it and pull it a little.

   API (used by animations/hero-sequence.js):
     IESphere.init(canvas, hero)   once
     IESphere.layout(m)            on resize (m = IEStage.measure(hero))
     IESphere.setGrow(g)           0 → 1 while the sphere forms
     IESphere.setLook(s, l)        size share + brightness (big & bright first, then smaller and lighter)
     IESphere.setInteractive(on)   after the titles: mouse / touch on
     IESphere.start() / stop()     drawing loop
   ===================================================================== */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  /* ribbons: colour, base tilt of their circle, wave / twist settings */
  var COLORS = [
    [155, 92, 255],   // purple
    [255, 52, 208],   // magenta
    [61, 107, 255],   // electric blue
    [63, 230, 255],   // cyan
    [202, 18, 194],   // site magenta
    [63, 230, 255],   // cyan
    [255, 168, 53],   // orange touch
    [118, 76, 255]    // violet-blue
  ];
  var STRANDS = 12, STEPS = 84;   // strands per ribbon (fewer on phones, set in layout)

  var cv, ctx, hero, dpr = 1, size = 0, R = 100, ribbons = [];
  var grow = 0, look = 1, lum = 1, interactive = false, running = false, raf = 0, visible = true, last = 0, time = 0;
  /* motion state */
  var yaw = 0, pitch = 0.25, roll = 0;
  var tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0;           // lean towards the pointer
  var vYaw = 0, vPitch = 0;                                   // extra spin from dragging (decays)
  var ox = 0, oy = 0, vx = 0, vy = 0, tox = 0, toy = 0;       // small pull from the base point (spring)
  var excite = 0, tExcite = 0;                                // strands move a bit more near the pointer
  var drag = null;

  function rnd(seed) { var x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); }

  function buildRibbons() {
    ribbons = [];
    for (var i = 0; i < COLORS.length; i++) {
      // a random orientation for the ribbon's circle (u, v orthonormal)
      var a = rnd(i + 1) * TAU, b = Math.acos(2 * rnd(i + 11) - 1), c = rnd(i + 21) * TAU;
      var n = [Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)];
      var t = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      var u = norm(cross(n, t)), v = cross(n, u);
      var cu = Math.cos(c), su = Math.sin(c);
      var uu = [u[0] * cu + v[0] * su, u[1] * cu + v[1] * su, u[2] * cu + v[2] * su];
      var vv = cross(n, uu);
      ribbons.push({
        u: uu, v: vv, n: n, col: COLORS[i], orange: i === 6,
        amp: 0.04 + rnd(i + 31) * 0.07,           // wave height (share of R)
        k: 2 + Math.floor(rnd(i + 41) * 3),       // waves around the circle
        sp: 0.35 + rnd(i + 51) * 0.45,            // wave speed
        tw: 1 + Math.floor(rnd(i + 61) * 2),      // narrow/wide cycles of the ribbon (whole numbers so it closes)
        wid: 0.20 + rnd(i + 71) * 0.18,           // ribbon width (share of R): a sheet of fine strands
        ph: rnd(i + 81) * TAU,
        r: 0.9 + rnd(i + 91) * 0.1                // its radius (share of R)
      });
    }
  }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  function init(canvas, heroEl) {
    cv = canvas; hero = heroEl; ctx = cv.getContext('2d');
    buildRibbons();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) last = 0; });
    // pointer: lean towards the mouse when near; drag (mouse or finger) to spin it
    hero.addEventListener('pointermove', onHover, { passive: true });
    hero.addEventListener('pointerleave', function () { if (!drag) { tTiltX = tTiltY = tox = toy = tExcite = 0; } });
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onDrag);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);
  }

  /* canvas is a square around the anchor (cheaper than the whole hero) */
  var anchorX = 0, anchorY = 0;
  function layout(m) {
    R = m.W < 760 ? Math.min(m.H * 0.36, m.W * 0.38) : Math.min(m.H * 0.40, m.W * 0.38);   // a little bigger on laptop / tablet
    anchorX = m.ax; anchorY = m.ay;
    size = Math.ceil(R * 4.2);                         // room for the wide, soft halo
    dpr = Math.min(window.devicePixelRatio || 1, m.W < 760 ? 1.75 : 2);
    STRANDS = m.W < 760 ? 9 : 12;
    cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
    cv.style.width = size + 'px'; cv.style.height = size + 'px';
    cv.style.left = (m.ax - size / 2) + 'px'; cv.style.top = (m.ay - size / 2) + 'px';
    if (!running) draw();
  }

  /* ---------- pointer ---------- */
  function local(e) { var r = hero.getBoundingClientRect(); return { x: e.clientX - r.left - anchorX, y: e.clientY - r.top - anchorY }; }
  function onHover(e) {
    if (!interactive || drag || e.pointerType !== 'mouse') return;
    var p = local(e), d = Math.hypot(p.x, p.y), Rn = R * look, reach = Rn * 2.4;
    if (d < reach) {
      var k = 1 - d / reach;
      tTiltX = Math.max(-0.4, Math.min(0.4, p.x / Rn * 0.32));
      tTiltY = Math.max(-0.4, Math.min(0.4, p.y / Rn * 0.32));
      tox = p.x / (d || 1) * Math.min(d, Rn) * 0.06; toy = p.y / (d || 1) * Math.min(d, Rn) * 0.06;
      tExcite = k;
    } else { tTiltX = tTiltY = tox = toy = tExcite = 0; }
  }
  function onDown(e) {
    if (!interactive) return;
    var p = local(e);
    if (Math.hypot(p.x, p.y) > R * look * 1.12) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), sx: p.x, sy: p.y };
    try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    cv.classList.add('is-grabbing'); tExcite = 1;
  }
  function onDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var now = performance.now(), dt = Math.max(8, now - drag.t) / 1000;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    yaw += dx * 0.009; pitch += dy * 0.009;
    vYaw = vYaw * 0.5 + (dx * 0.009 / dt) * 0.5; vPitch = vPitch * 0.5 + (dy * 0.009 / dt) * 0.5;
    var p = local(e), lim = R * look * 0.12;
    tox = Math.max(-lim, Math.min(lim, (p.x - drag.sx) * 0.25)); toy = Math.max(-lim, Math.min(lim, (p.y - drag.sy) * 0.25));
    tTiltX = Math.max(-0.4, Math.min(0.4, dx * 0.004)); tTiltY = Math.max(-0.4, Math.min(0.4, dy * 0.004));
    drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null; cv.classList.remove('is-grabbing');
    tox = toy = tTiltX = tTiltY = 0; tExcite = 0;
    vYaw = Math.max(-4, Math.min(4, vYaw)); vPitch = Math.max(-4, Math.min(4, vPitch));
  }

  /* ---------- drawing ---------- */
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  function draw() {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    if (grow <= 0) return;
    var cx = size / 2 + ox, cy = size / 2 + oy;
    var g = Math.min(1, grow), r = R * look * (0.04 + 0.96 * easeOut(g));
    ctx.globalCompositeOperation = 'lighter';

    // the seed of light it grows from: as bright as the touch point it continues, fades as the ribbons take over
    var seed = Math.max(0, 1 - g * 1.5);
    if (seed > 0) {
      var sr = R * 0.34, sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, sr);
      sg.addColorStop(0, 'rgba(255,255,255,' + seed + ')');
      sg.addColorStop(0.12, 'rgba(255,245,255,' + 0.9 * seed + ')');
      sg.addColorStop(0.35, 'rgba(222,170,255,' + 0.45 * seed + ')');
      sg.addColorStop(1, 'rgba(150,60,255,0)');
      ctx.fillStyle = sg; ctx.fillRect(cx - sr, cy - sr, sr * 2, sr * 2);
    }
    // a wide, light halo (no rim line): it only suggests the ball's glow
    var hr = r * 1.9, halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, hr);
    halo.addColorStop(0, 'rgba(130,50,210,' + 0.09 * g * lum + ')');
    halo.addColorStop(0.42, 'rgba(120,50,220,' + 0.07 * g * lum + ')');
    halo.addColorStop(0.62, 'rgba(140,60,235,' + 0.035 * g * lum + ')');
    halo.addColorStop(1, 'rgba(120,40,200,0)');
    ctx.fillStyle = halo; ctx.fillRect(cx - hr, cy - hr, hr * 2, hr * 2);
    // while it is big and bright: an extra inner light
    var boost = Math.max(0, lum - 1);
    if (boost > 0) {
      var br = r * 1.1, bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, br);
      bg.addColorStop(0, 'rgba(235,190,255,' + 0.22 * boost * g + ')');
      bg.addColorStop(0.55, 'rgba(170,90,255,' + 0.12 * boost * g + ')');
      bg.addColorStop(1, 'rgba(120,40,220,0)');
      ctx.fillStyle = bg; ctx.fillRect(cx - br, cy - br, br * 2, br * 2);
    }

    // rotation matrix (yaw → pitch → roll, plus the lean towards the pointer)
    var ay = yaw + tiltX, ap = pitch + tiltY, ar = roll;
    var cy1 = Math.cos(ay), sy1 = Math.sin(ay), cp = Math.cos(ap), sp = Math.sin(ap), cr = Math.cos(ar), sr = Math.sin(ar);
    var f = r * 3.4, wave = 1 + excite * 0.8;

    for (var i = 0; i < ribbons.length; i++) {
      var rb = ribbons[i];
      // ribbons wrap in one after another while the sphere forms
      var reveal = Math.max(0, Math.min(1, (g - i * 0.045) / 0.62));
      if (reveal <= 0) continue;
      var tEnd = TAU * easeOut(reveal), steps = Math.max(6, Math.round(STEPS * reveal));
      var col = rb.col, baseA = (rb.orange ? 0.42 : 0.33) * lum * (12 / STRANDS) * Math.min(1, reveal * 1.4);
      for (var s = 0; s < STRANDS; s++) {
        var off = (s / (STRANDS - 1) - 0.5) * rb.wid;
        var paths = [new Path2D(), new Path2D(), new Path2D()], started = [false, false, false], prev = null, prevB = -1;
        for (var j = 0; j <= steps; j++) {
          var t = (j / steps) * tEnd + rb.ph;
          var ct = Math.cos(t), st = Math.sin(t);
          // point on the ribbon's circle
          var px = rb.u[0] * ct + rb.v[0] * st, py = rb.u[1] * ct + rb.v[1] * st, pz = rb.u[2] * ct + rb.v[2] * st;
          // wave out of the circle's plane + twist of the ribbon (strands spread across it)
          var w = rb.amp * wave * Math.sin(rb.k * t + time * rb.sp * wave + rb.ph);
          // the ribbon narrows and widens as it travels (a soft "twist"), its strands never collapse to one point
          var o = off * (0.55 + 0.45 * Math.cos(rb.tw * t + time * 0.4 + rb.ph)) * (1 + 0.25 * Math.sin(2 * t + time * 0.6));
          var o2 = off * 0.35 * Math.sin(rb.tw * 2 * t - time * 0.5 + s);       // strands drift a little along the ribbon
          var nx = rb.n[0] * (w + o) + (rb.v[0] * ct - rb.u[0] * st) * o2,
              ny = rb.n[1] * (w + o) + (rb.v[1] * ct - rb.u[1] * st) * o2,
              nz = rb.n[2] * (w + o) + (rb.v[2] * ct - rb.u[2] * st) * o2;
          var x = px + nx, y = py + ny, z = pz + nz, l = Math.hypot(x, y, z) || 1;
          var rr = r * rb.r * (1 + 0.035 * Math.sin(3 * t + time * 0.9 + s)) / l;
          x *= rr; y *= rr; z *= rr;
          // rotate
          var x1 = x * cy1 + z * sy1, z1 = -x * sy1 + z * cy1;
          var y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
          var x3 = x1 * cr - y2 * sr, y3 = x1 * sr + y2 * cr;
          // perspective
          var k = f / (f - z2), X = cx + x3 * k, Y = cy + y3 * k;
          var bucket = z2 < -r * 0.3 ? 0 : z2 < r * 0.3 ? 1 : 2;   // back · middle · front
          if (prev) {
            var bb = Math.max(bucket, prevB);
            if (!started[bb]) { started[bb] = true; }
            paths[bb].moveTo(prev[0], prev[1]); paths[bb].lineTo(X, Y);
          }
          prev = [X, Y]; prevB = bucket;
        }
        var edge = (s === 0 || s === STRANDS - 1) ? 1.25 : 1;          // ribbon edges a little brighter
        var A = [0.28, 0.6, 1];
        for (var q = 0; q < 3; q++) {
          if (!started[q]) continue;
          ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + Math.min(1, baseA * A[q] * edge) + ')';
          ctx.lineWidth = q === 2 ? 1.25 : 0.9;
          ctx.stroke(paths[q]);
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function step(now) {
    raf = requestAnimationFrame(step);
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
    time += dt;
    // base motion: slow, smooth rotation
    yaw += (0.22 + vYaw) * dt; pitch += vPitch * dt;
    pitch += (0.22 + 0.18 * Math.sin(time * 0.17) - pitch) * (drag ? 0 : 1 - Math.exp(-dt * 0.6));   // drifts back to its natural angle
    roll = 0.12 * Math.sin(time * 0.13);
    var dec = Math.exp(-dt * 2.2); vYaw *= dec; vPitch *= dec;                                   // a released spin settles back gently
    var ease = 1 - Math.exp(-dt * 4);
    tiltX += (tTiltX - tiltX) * ease; tiltY += (tTiltY - tiltY) * ease; excite += (tExcite - excite) * (1 - Math.exp(-dt * 2.5));
    // spring back to the base point (never wanders away from the titles)
    var kS = 60, dS = 2 * Math.sqrt(kS) * 0.8;
    vx += ((tox - ox) * kS - vx * dS) * dt; vy += ((toy - oy) * kS - vy * dS) * dt; ox += vx * dt; oy += vy * dt;
    if (visible && !document.hidden) draw();
  }

  window.IESphere = {
    init: init, layout: layout,
    setGrow: function (g) { grow = g; },
    setLook: function (scale, light) { look = scale; lum = light; },   // size (1 = big, 0.7 = settled) and brightness
    setInteractive: function (on) { interactive = on; cv.classList.toggle('is-live', on); },
    start: function () { if (!running) { running = true; last = 0; raf = requestAnimationFrame(step); } },
    stop: function () { running = false; cancelAnimationFrame(raf); },
    radius: function () { return R; }
  };
})();
