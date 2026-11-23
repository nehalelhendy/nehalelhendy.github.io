/* =====================================================================
   BACKGROUND WAVES — fine light strands floating across the hero, in the
   sphere's colours, very transparent (they only fill the space quietly).
   Canvas 2D, drawn at ~30 fps and low resolution (cheap on phones);
   stops when the hero is off screen.
   API: IEWaves.init(canvas, hero)  IEWaves.layout(m)  IEWaves.start()
   ===================================================================== */
(function () {
  'use strict';
  var TAU = Math.PI * 2;
  /* bundles: [colour, height (share of hero), amplitude (share), waves across, speed, tilt] */
  var BUNDLES = [
    [[155, 92, 255], 0.14, 0.05, 1.2, 0.16, -0.08],
    [[63, 230, 255], 0.27, 0.07, 0.9, -0.12, 0.10],
    [[255, 52, 208], 0.40, 0.06, 1.5, 0.10, -0.06],
    [[61, 107, 255], 0.52, 0.05, 2.0, -0.09, 0.12],
    [[155, 92, 255], 0.64, 0.08, 1.1, 0.13, -0.10],
    [[63, 230, 255], 0.77, 0.06, 1.7, -0.15, 0.06],
    [[255, 52, 208], 0.90, 0.05, 1.3, 0.11, -0.12]
  ];

  var STR = 9, cv, ctx, hero, W = 0, H = 0, dpr = 1, time = 0, last = 0, skip = false, visible = true, running = false, reduced = false;

  function init(canvas, heroEl) {
    cv = canvas; hero = heroEl; ctx = cv.getContext('2d');
    reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  }
  function layout(m) {
    W = m.W; H = m.H; dpr = Math.min(window.devicePixelRatio || 1, W < 760 ? 1 : 1.5);
    STR = W < 760 ? 6 : 9;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    draw();
  }
  function draw() {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    var steps = W < 760 ? 40 : 70;
    for (var b = 0; b < BUNDLES.length; b++) {
      var B = BUNDLES[b], c = B[0];
      for (var s = 0; s < STR; s++) {
        var off = (s / (STR - 1) - 0.5);
        ctx.beginPath();
        for (var j = 0; j <= steps; j++) {
          var u = j / steps, x = -20 + u * (W + 40);
          var spread = H * 0.045 * (1 + 0.6 * Math.sin(u * TAU * 0.8 + time * 0.3 + b));
          var y = H * B[1] + (u - 0.5) * H * B[5]
                + H * B[2] * Math.sin(u * TAU * B[3] + time * B[4] + b * 1.7)
                + off * spread * Math.cos(u * TAU * 0.6 - time * 0.25 + s * 0.3);
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        var edge = (s === 0 || s === STR - 1) ? 1.4 : 1;
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (0.055 * edge) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function step(now) {
    requestAnimationFrame(step);
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
    time += dt;
    skip = !skip; if (skip) return;                 // ~30 fps is plenty for such slow motion
    if (visible && !document.hidden) draw();
  }
  window.IEWaves = {
    init: init, layout: layout,
    start: function () { if (running) return; running = true; if (reduced) { draw(); return; } requestAnimationFrame(step); }
  };
})();
