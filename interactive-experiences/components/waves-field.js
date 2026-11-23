/* =====================================================================
   WAVES FIELD — the hero's wavy light lines, continued under the hero
   (behind the case-study cards and the quiz card). Same colours, same
   transparency and motion as components/bg-waves.js (the locked hero one),
   but sized for a tall section. Canvas 2D, ~30 fps, low resolution,
   stops when the section is off screen.
   API: IEWavesField.mount(canvas, host)
   ===================================================================== */
(function () {
  'use strict';
  var TAU = Math.PI * 2;
  /* [colour, height (share of the section), amplitude (share of the viewport), waves across, speed, tilt] */
  var BUNDLES = [
    [[155, 92, 255], 0.08, 0.05, 1.2, 0.16, -0.05],
    [[63, 230, 255], 0.24, 0.06, 0.9, -0.12, 0.06],
    [[255, 52, 208], 0.42, 0.05, 1.5, 0.10, -0.04],
    [[61, 107, 255], 0.58, 0.05, 2.0, -0.09, 0.07],
    [[155, 92, 255], 0.74, 0.07, 1.1, 0.13, -0.06],
    [[63, 230, 255], 0.90, 0.05, 1.7, -0.15, 0.04]
  ];

  function mount(cv, host) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, U = 0, dpr = 1, STR = 9, time = 0, last = 0, skip = false, visible = false, raf = 0;
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      W = cv.clientWidth || host.clientWidth; H = cv.clientHeight || host.clientHeight; U = Math.min(H, window.innerHeight || H);
      dpr = Math.min(window.devicePixelRatio || 1, W < 760 ? 1 : 1.25);
      STR = W < 760 ? 6 : 9;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      draw();
    }
    function draw() {
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
            var spread = U * 0.045 * (1 + 0.6 * Math.sin(u * TAU * 0.8 + time * 0.3 + b));
            var y = H * B[1] + (u - 0.5) * U * B[5]
                  + U * B[2] * Math.sin(u * TAU * B[3] + time * B[4] + b * 1.7)
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
      raf = 0;
      if (!visible || document.hidden) { last = 0; return; }   // nothing runs while off screen
      raf = requestAnimationFrame(step);
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      time += dt;
      skip = !skip; if (skip) return;                          // ~30 fps is plenty for such slow motion
      draw();
    }
    function wake() { if (!reduced && visible && !raf && !document.hidden) raf = requestAnimationFrame(step); }

    size();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 120); });
    if (window.ResizeObserver) new ResizeObserver(function () { if (cv.clientHeight !== H || cv.clientWidth !== W) size(); }).observe(host);
    document.addEventListener('visibilitychange', wake);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; wake(); }).observe(host);
    else { visible = true; wake(); }
  }

  window.IEWavesField = { mount: mount };
})();
