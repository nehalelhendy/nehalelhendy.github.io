/* =====================================================================
   BRAND IDENTITIES page — behaviour
   - language (EN / AR, same switch as the main site)
   - neon botanical flowers (SVG, generated once)
   - the six glass folders, built from projects.js
   - case studies with their own address (#slug), back/forward support
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var P = (window.BRAND_PROJECTS || []).filter(function (p) { return p && p.slug; });
  var lang = root.lang === 'ar' ? 'ar' : 'en';
  var T = function (o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.en || ''); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------------- images helpers ---------------- */
  function norm(img) { return typeof img === 'string' ? { src: img } : (img && img.src ? img : null); }
  function imagesOf(p) { return (p.images || []).map(norm).filter(Boolean); }
  function coverOf(p) {
    var all = imagesOf(p);
    if (p.cover) { var c = norm(p.cover); var hit = all.filter(function (i) { return i.src === c.src; })[0]; return hit || c; }
    return all[0] || null;
  }
  /* the cover first, then the next images (never another project's) */
  function layersOf(p) {
    var cov = coverOf(p); if (!cov) return [];
    var rest = imagesOf(p).filter(function (i) { return i.src !== cov.src; });
    var n = Math.max(1, Math.min(3, p.layers || 3));
    return [cov].concat(rest).slice(0, n);
  }

  function f1(n) { return Math.round(n * 10) / 10; }
  /* ---------------- liquid (like the main site's hero) ----------------
     Metaballs drawn on a small canvas and scaled up (cheap, no WebGL): blobs move slowly, merge,
     and where they meet their colours mix into new ones. Each blob is a two-colour gradient (top → bottom). */
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function Liquid(cv, cfg) {
    var ctx = cv.getContext('2d'), img = null, W = 0, H = 0, w = 0, h = 0, k = 1, F, CR, CG, CB, CW, FX = null;
    var B = (cfg.blobs || []).map(function (b, i) {
      return { x: b[0], y: b[1], r: b[2], c1: hex(b[3]), c2: hex(b[4]), ax: b[5] || 90, ay: b[6] || 70, sx: .05 + (i * .37 % 1) * .07, sy: .04 + (i * .61 % 1) * .06, p: i * 1.7 };
    });
    /* clusters: each liquid shape is 3 drops that slowly circle each other, so its outline is irregular and keeps changing;
       its colours drift through the cluster's palette, and clusters drift far enough to meet, merge and part again */
    (cfg.clusters || []).forEach(function (c, ci) {
      var n = c.n || 3, pal = c.cols.map(hex);
      for (var j = 0; j < n; j++) B.push({ cl: 1, x: c.x, y: c.y, ax: c.ax, ay: c.ay, sx: c.sx || .045 + ci * .011, sy: c.sy || .037 + ci * .009, p: ci * 2.1,
        r: c.r * (.62 + .38 * ((j * .618 + ci * .3) % 1)), off: c.r * (.42 + .2 * ((j * .37) % 1)), a0: j * 6.283 / n + ci, w: (ci % 2 ? -1 : 1) * (.07 + .03 * j),
        pal: pal, cs: .025 + .008 * ((ci + j) % 3), cp: ci * 1.3 + j * .7, c1: [0, 0, 0], c2: [0, 0, 0] });
    });
    function palAt(pal, f) { f = ((f % 1) + 1) % 1 * pal.length; var a = pal[f | 0], b = pal[((f | 0) + 1) % pal.length], u = f - (f | 0); u = u * u * (3 - 2 * u);
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return false;
      w = Math.max(8, Math.ceil(W / cfg.scale)); h = Math.max(8, Math.ceil(H / cfg.scale)); var n = w * h;
      cv.width = w; cv.height = h; img = ctx.createImageData(w, h); k = cfg.k(W, H);
      F = new Float32Array(n); CR = new Float32Array(n); CG = new Float32Array(n); CB = new Float32Array(n); CW = new Float32Array(n); return true;
    }
    /* each blob adds a short-range bump (1 - d²/R²)²; the liquid surface is where the sum crosses a threshold,
       so blobs keep a clear edge, stretch towards each other and merge; colours mix by weight where they meet */
    function draw(t) {
      if (!img && !size()) return;
      F.fill(0); CR.fill(0); CG.fill(0); CB.fill(0); CW.fill(0);
      var S = cfg.scale, i, x, y;
      for (i = 0; i < B.length; i++) {
        var b = B[i], r = b.r * k * (1 + .07 * Math.sin(t * b.sx * 2.3 + b.p)) / S, Rs = r * 1.6, R2 = Rs * Rs;
        var cx = (b.x * W + b.ax * k * Math.sin(t * b.sx + b.p)) / S, cy = (b.y * H + b.ay * k * Math.cos(t * b.sy + b.p * 1.3)) / S;
        if (b.cl) {
          var an = b.a0 + t * b.w, od = b.off * k * (1 + .25 * Math.sin(t * .11 + b.a0)) / S;
          cx += Math.cos(an) * od; cy += Math.sin(an) * od * .8;
          b.c1 = palAt(b.pal, t * b.cs + b.cp); b.c2 = palAt(b.pal, t * b.cs + b.cp + .4);
        }
        var x0 = Math.max(0, Math.floor(cx - Rs)), x1 = Math.min(w - 1, Math.ceil(cx + Rs)), y0 = Math.max(0, Math.floor(cy - Rs)), y1 = Math.min(h - 1, Math.ceil(cy + Rs));
        for (y = y0; y <= y1; y++) {
          var dy = y - cy, dy2 = dy * dy, tt = dy / r * .5 + .5; tt = tt < 0 ? 0 : tt > 1 ? 1 : tt;
          var cr = b.c1[0] + (b.c2[0] - b.c1[0]) * tt, cg = b.c1[1] + (b.c2[1] - b.c1[1]) * tt, cb = b.c1[2] + (b.c2[2] - b.c1[2]) * tt, row = y * w;
          for (x = x0; x <= x1; x++) {
            var dx = x - cx, d2 = dx * dx + dy2; if (d2 >= R2) continue;
            var g = 1 - d2 / R2; g *= g; var q = row + x, ww = g * g;
            F[q] += g; CR[q] += ww * cr; CG[q] += ww * cg; CB[q] += ww * cb; CW[q] += ww;
          }
        }
      }
      var d = img.data, e0 = cfg.e0, ed = cfg.e1 - cfg.e0, A = cfg.alpha * 255, n = w * h, PC = cfg.paint ? paintRows() : null;
      if (!FX || FX.length !== w + h) {   /* soft fade near the canvas sides, so no blob is ever cut by a straight line */
        FX = new Float32Array(w + h); var m = cfg.fade || 0;
        for (x = 0; x < w; x++) FX[x] = m ? Math.min(1, Math.min(x, w - 1 - x) / (w * m)) : 1;
        for (y = 0; y < h; y++) FX[w + y] = m ? Math.min(1, Math.min(y, h - 1 - y) / (h * m)) : 1;
      }
      for (i = 0; i < n; i++) {
        var a = (F[i] - e0) / ed, o = i * 4;
        if (a <= 0 || CW[i] === 0) { d[o + 3] = 0; continue; }
        a = a > 1 ? 1 : a * a * (3 - 2 * a);
        var fe = FX[i % w] * FX[w + ((i / w) | 0)]; a *= fe * fe * (3 - 2 * fe);
        if (PC) { var pr = ((i / w) | 0) * 3; d[o] = PC[pr]; d[o + 1] = PC[pr + 1]; d[o + 2] = PC[pr + 2]; d[o + 3] = a * A; continue; }
        var iw = 1 / CW[i]; d[o] = CR[i] * iw; d[o + 1] = CG[i] * iw; d[o + 2] = CB[i] * iw; d[o + 3] = a * A;
      }
      ctx.putImageData(img, 0, 0);
    }
    /* one colour per canvas row = the page background at that height (so the wave melts into the page) */
    var PCc = null, PCkey = '';
    function paintRows() {
      var r = cv.getBoundingClientRect(), top = r.top + scrollY, bh = document.body.offsetHeight, key = w + ',' + h + ',' + Math.round(top) + ',' + bh;
      if (key === PCkey) return PCc;
      PCkey = key; PCc = new Uint8ClampedArray(h * 3);
      for (var y = 0; y < h; y++) { var c = cfg.paint(top + (y + .5) * H / h, bh); PCc[y * 3] = c[0]; PCc[y * 3 + 1] = c[1]; PCc[y * 3 + 2] = c[2]; }
      return PCc;
    }
    return { size: size, draw: draw };
  }
  /* the page background (same as body in bi.css): #46074F at the top → #330540 at 900px → #1A0222 at the bottom */
  var BG0 = hex('#46074F'), BG1 = hex('#330540'), BG2 = hex('#1A0222');
  function mix(a, b, f) { f = f < 0 ? 0 : f > 1 ? 1 : f; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
  function pageBg(Y, bh) { return Y <= 900 ? mix(BG0, BG1, Y / 900) : mix(BG1, BG2, (Y - 900) / Math.max(1, bh - 900)); }
  var mobL = matchMedia('(max-width: 640px)').matches, liquids = [];
  (function () {
    var bg = document.getElementById('biLiquid'), fr = document.getElementById('biFrontLiquid');
    /* page background: x, y (0–1 of the screen), radius, colour top, colour bottom, drift x, drift y */
    if (bg) liquids.push({ el: bg, on: true, L: Liquid(bg, { scale: 2, alpha: .26, e0: .32, e1: .44, k: function (W, H) { return Math.max(.6, Math.min(W, H) / 820); },
      clusters: [
        { x: .1, y: .3, r: 70, ax: 150, ay: 110, cols: ['#CA12C2', '#7A1F9C', '#E040C8', '#5C246E'] },
        { x: .88, y: .2, r: 58, ax: 140, ay: 100, cols: ['#9B1FA8', '#E040C8', '#6A2287', '#CA12C2'] },
        { x: .22, y: .82, r: 76, ax: 180, ay: 90, cols: ['#5C246E', '#B0109F', '#8E2AA8', '#E040C8'] },
        { x: .8, y: .74, r: 64, ax: 170, ay: 120, cols: ['#E040C8', '#5C246E', '#CA12C2', '#7A1F9C'] },
        { x: .5, y: .52, r: 52, ax: 260, ay: 170, cols: ['#8E2AA8', '#CA12C2', '#6A2287', '#B0109F'] }] }) });
    /* in front of the flower: deep mauve / fuchsia liquid that hides its edges (like the wave in Nehal's reference) */
    if (fr) liquids.push({ el: fr, on: true, L: Liquid(fr, { scale: 2, alpha: 1, e0: .3, e1: .46, fade: .22, paint: pageBg, k: function (W) { return W / 760; },
      blobs: [[.2, .96, 150, '#7D0D8A', '#5C246E', 40, 18], [.52, 1.02, 175, '#CA12C2', '#7D0D8A', 50, 16], [.86, .9, 125, '#FF2A6F', '#CA12C2', 30, 26],
        [.97, .42, 80, '#5C246E', '#CA12C2', 22, 40], [.4, 1.06, 95, '#FFA835', '#FF2A6F', 60, 14], [.04, .55, 60, '#CA12C2', '#5C246E', 18, 30]] }) });
    /* laptop: soft liquid waves, a shade lighter than the page, around the hero text */
    var hw = document.getElementById('biHeroWaves');
    if (hw && !mobL) liquids.push({ el: hw, on: true, L: Liquid(hw, { scale: 3, alpha: .85, e0: .3, e1: .46, fade: .12, k: function (W) { return W / 1400; },
      blobs: [[.03, .86, 150, '#6E1684', '#540C66', 50, 26], [.17, .97, 175, '#681280', '#4E0A60', 60, 22], [.33, .92, 130, '#74198A', '#560D68', 45, 30],
        [.46, 1.02, 115, '#640F78', '#4E0A60', 40, 18], [.0, .5, 125, '#6A1480', '#500B62', 30, 50], [.07, .2, 95, '#74198A', '#580D6A', 50, 30],
        [.24, .08, 75, '#6A1480', '#520B64', 60, 20], [.44, .14, 60, '#6E1684', '#540C66', 40, 26]] }) });
    if (fr && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; liquids.forEach(function (l) { if (l.el !== bg) l.on = v; }); }).observe(document.querySelector('.bi-hero'));
    var last = 0, t0 = performance.now();
    function frame(now) {
      if (!document.hidden && !root.classList.contains('bi-lock') && now - last > 12) { last = now; var t = (now - t0) / 1000; liquids.forEach(function (l) { if (l.on) l.L.draw(t); }); }
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { liquids.forEach(function (l) { l.L.size(); l.L.draw((performance.now() - t0) / 1000); }); }, 150); });
  })();

  /* ---------------- folders ---------------- */
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  /* folder geometry (viewBox units). BACK: the rear glass panel. FRONT: the glass front with the folder step, in its own box (100 x 56). */
  var BACK = 'M10 9H90Q97 9 97 16V83Q97 90 90 90H10Q3 90 3 83V16Q3 9 10 9Z';
  var FRONT = 'M0 7Q0 0 7 0H30C37 0 38.5 10 46 10H93Q100 10 100 17V49Q100 56 93 56H7Q0 56 0 49Z';
  /* the front's blur needs a clip-path: sample the same path into a polygon (percentages, so it scales with the folder) */
  (function () {
    var ns = 'http://www.w3.org/2000/svg', sv = document.createElementNS(ns, 'svg'), pa = document.createElementNS(ns, 'path');
    sv.setAttribute('width', '0'); sv.setAttribute('height', '0'); sv.style.position = 'absolute'; pa.setAttribute('d', FRONT); sv.appendChild(pa); document.body.appendChild(sv);
    var L = pa.getTotalLength(), pts = [];
    for (var i = 0; i < 120; i++) { var q = pa.getPointAtLength(L * i / 120); pts.push(f1(q.x) + '% ' + f1(q.y / 56 * 100) + '%'); }
    sv.remove(); root.style.setProperty('--fshape', 'polygon(' + pts.join(',') + ')');
  })();
  /* shared gradients for every folder back */
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="bfBackFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6C4FF" stop-opacity=".28"/><stop offset=".5" stop-color="#7A3A96" stop-opacity=".34"/><stop offset="1" stop-color="#3A1048" stop-opacity=".6"/></linearGradient>' +
    '<linearGradient id="bfFrontRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#FFC2F2"/><stop offset=".7" stop-color="#FF5CDC"/><stop offset="1" stop-color="#C98BFF"/></linearGradient>' +
    '<linearGradient id="bfRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".3" stop-color="#FF5CDC" stop-opacity=".75"/><stop offset=".65" stop-color="#9B5CFF" stop-opacity=".35"/><stop offset="1" stop-color="#3FE6FF" stop-opacity=".7"/></linearGradient>' +
    '</defs></svg>');

  var grid = document.getElementById('biGrid');
  function docHTML(img, k, p, eager) {
    if (!img) return '<figure class="bf-doc d' + k + ' empty"></figure>';
    var alt = k === 1 ? (T(img.alt) || T(p.name) + (lang === 'ar' ? ' — معاينة الهوية' : ' — identity preview')) : '';
    return '<figure class="bf-doc d' + k + (img.fit === 'contain' ? ' fit-contain' : '') + '"' + (img.focus || img.bg ? ' style="' + (img.focus ? '--focus:' + esc(img.focus) + ';' : '') + (img.bg ? 'background:' + esc(img.bg) : '') + '"' : '') + '>' +
      '<img src="' + esc(img.src) + '" alt="' + esc(alt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async" draggable="false"></figure>';
  }
  function folderHTML(p, i) {
    var L = layersOf(p), docs = '';
    /* back to front: d3, d2, d1 (= cover) */
    for (var k = 3; k >= 1; k--) docs += (L.length ? (L[k - 1] ? docHTML(L[k - 1], k, p, i < 3) : '') : docHTML(null, k, p));
    var logo = p.logo ? '<span class="bf-logo"><img src="' + esc(p.logo) + '" alt="" loading="lazy" decoding="async"></span>' : '';
    return '<li class="bi-item" style="--d:' + i + '"><a class="bi-folder" href="#' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '" aria-label="' + esc(T(p.name)) + '">' +
      '<div class="bf-float"><div class="bf-tilt">' +
      '<svg class="bf-back" viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true"><path class="bk-fill" d="' + BACK + '"/><path class="bk-rim" d="' + BACK + '"/></svg>' +
      '<div class="bf-docs" aria-hidden="' + (L.length ? 'false' : 'true') + '">' + docs + '</div>' +
      '<span class="bf-glow" aria-hidden="true"></span>' +
      '<div class="bf-front"><span class="bf-caustic" aria-hidden="true"></span><span class="bf-shine" aria-hidden="true"></span>' +
      '</div><svg class="bf-rim" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true"><path d="' + FRONT + '"/></svg>' +
      '<div class="bf-meta">' + logo + '<span class="bf-txt"><span class="bf-name">' + esc(T(p.folderName) || T(p.name)) + '</span>' + (T(p.tagline) ? '<span class="bf-tag">' + esc(T(p.tagline)) + '</span>' : '') + '</span><span class="bf-arrow" aria-hidden="true">' + ARROW + '</span></div>' +
      '</div></div><span class="bf-shadow" aria-hidden="true"></span></a></li>';
  }
  function renderGrid() { grid.innerHTML = P.map(folderHTML).join(''); bindFolders(); }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('vis', e.isIntersecting); if (e.isIntersecting && !e.target.classList.contains('lit')) e.target.classList.add('in'); });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;

  function bindFolders() {
    grid.querySelectorAll('.bi-item').forEach(function (li, i) {
      if (io) io.observe(li); else li.classList.add('lit', 'vis');
      /* after the light-up, drop the filter so the glass blur sees the page again */
      li.addEventListener('animationend', function (e) { if (e.animationName === 'bfLight') { li.classList.remove('in'); li.classList.add('lit'); } });
      var a = li.querySelector('.bi-folder'), tilt = a.querySelector('.bf-tilt'), raf = 0, px = 0, py = 0;
      if (finePointer && !reduce) {
        a.addEventListener('pointerenter', function () { a.classList.add('on'); });
        a.addEventListener('pointermove', function (e) {
          var r = a.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5;
          if (!raf) raf = requestAnimationFrame(function () { raf = 0; a.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg'); a.style.setProperty('--rx', (6 - py * 7).toFixed(2) + 'deg'); });
        });
        a.addEventListener('pointerleave', function () { a.classList.remove('on'); a.style.setProperty('--rx', '0deg'); a.style.setProperty('--ry', '0deg'); });
      } else if (finePointer) {
        a.addEventListener('pointerenter', function () { a.classList.add('on'); });
        a.addEventListener('pointerleave', function () { a.classList.remove('on'); });
      }
      a.addEventListener('focus', function () { a.classList.add('on'); });
      a.addEventListener('blur', function () { a.classList.remove('on'); });
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var slug = a.getAttribute('data-slug');
        if (!finePointer) { a.classList.add('on'); setTimeout(function () { a.classList.remove('on'); }, 700); }
        history.pushState({ bi: 1 }, '', '#' + slug);
        openCase(slug, a);
      });
    });
  }

  /* ---------------- project pop-up + mood board ----------------
     Each project's mood board is described in projects.js (board.d = laptop, board.m = phone):
     every piece has its own place, size and tilt, so no two projects share a layout.
     Positions are in % of the board's width (cqw), so the composition scales as one picture. */
  var CASE = document.getElementById('biCase'), POP = document.getElementById('biPop'), VEIL = document.getElementById('biVeil');
  var scrollBox = document.getElementById('biScroll'), INNER = document.getElementById('biInner');
  var HEAD = document.getElementById('biHead'), BOARD = document.getElementById('biBoard');
  var current = null, lastFolder = null, mobMQ = matchMedia('(max-width: 760px)');
  function bySlug(s) { return P.filter(function (p) { return p.slug === s; })[0]; }
  var L10N = {
    kind: { en: 'Brand Identity', ar: 'هوية بصرية' }, colours: { en: 'Color palette', ar: 'الألوان' }, type: { en: 'Typography', ar: 'الخطوط' },
    est: { en: 'estimated', ar: 'تقديري' }, soon: { en: 'Project images are on their way.', ar: 'ستُضاف صور المشروع قريبًا.' },
    enlarge: { en: 'View larger', ar: 'عرض أكبر' },
    prevPage: { en: 'Previous page', ar: 'الصفحة السابقة' }, nextPage: { en: 'Next page', ar: 'الصفحة التالية' },
    bookHint: { en: 'Tap or swipe to turn the pages', ar: 'اضغط أو اسحب لتقليب الصفحات' },
    prev: { en: 'Previous', ar: 'السابق' }, next: { en: 'Next', ar: 'التالي' }, close: { en: 'Close', ar: 'إغلاق' }
  };
  function srcOf(p, s) { return /[\/.]/.test(s) ? s : 'projects/' + p.slug + '/' + s + '.webp'; }
  /* one piece of the board: [x, y, width, tilt°, layer] in % of the board width */
  function place(g, i) {
    return '--x:' + g[0] + ';--y:' + g[1] + ';--w:' + g[2] + ';--r:' + (g[3] || 0) + 'deg;z-index:' + (g[4] || 1) + ';--i:' + i;
  }
  /* the little "click me" sign on pictures that open large */
  var TAP = '<span class="mb-tap" aria-hidden="true"><svg viewBox="0 0 24 24"><path class="ray" d="M9 2.5v2.2M4.3 4.3l1.6 1.6M2.5 9h2.2M13.7 4.3l-1.6 1.6"/><path class="cur" d="M9.2 8.6l9.6 4.1-4.1 1.3 3.1 4.4-1.9 1.3-3.1-4.4-2.6 3.2z"/></svg></span>';
  function pieceHTML(p, it, g, i) {
    var st = ' style="' + place(g, i) + '"';
    if (it.k === 'cap') return '<p class="mb-cap"' + st + '>' + esc(T(it.t)) + '</p>';
    var alt = T(it.alt) || T(p.name);
    return '<figure class="mb-pc mb-' + (it.look || 'card') + (it.zi ? ' zi' : '') + (it.zoom ? ' mb-zoom" tabindex="0" role="button" aria-label="' + esc(T(L10N.enlarge) + ': ' + alt) : '') + '"' + st + '><img src="' + esc(srcOf(p, it.src)) + '" width="' + it.w + '" height="' + it.h +
      '" alt="' + esc(alt) + '" loading="' + (i < 4 ? 'eager' : 'lazy') + '" decoding="async" draggable="false">' + (it.zoom ? (it.zi ? ZI : TAP) : '') + '</figure>';
  }
  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { root: scrollBox, rootMargin: '0px 0px -6% 0px' }) : null;
  /* the menu as a real book: leaves turn on a 3D spine (front of a leaf = right page, back = left page) */
  function bookHTML(p, part) {
    var pg = part.pages, leaves = [];
    for (var i = 0; i < pg.length; i += 2) leaves.push([pg[i], pg[i + 1]]);
    var img = function (s, n) {
      return s ? '<img src="' + esc(srcOf(p, s)) + '" alt="' + esc(T(part.alt) || T(p.name)) + ' ' + n + '" loading="lazy" decoding="async" draggable="false">' : '';
    };
    var dots = ''; for (var d = 0; d <= leaves.length; d++) dots += '<i></i>';
    return '<div class="mb-bookwrap' + (part.bind === 'top' ? ' mb-bw-top' : '') + (part.tight ? ' tight' : '') + (part.sideAr && part.bind !== 'top' ? ' land' : '') + '">' +
      '<div class="mb-book' + (part.bind === 'top' ? ' mb-book-top' : '') + '" data-s="0" data-n="' + leaves.length + '" dir="ltr"' + (part.sideAr && part.bind !== 'top' ? ' style="aspect-ratio:' + part.sideAr + '"' : '') + '>' + leaves.map(function (l, i) {
        return '<div class="mb-leaf" style="--k:' + i + '"><div class="mb-face mb-front">' + img(l[0], 2 * i + 1) + '</div><div class="mb-face mb-back">' + img(l[1], 2 * i + 2) + '</div></div>';
      }).join('') + '</div>' +
      '<div class="mb-book-ctrl" dir="ltr"><button type="button" class="bi-pop-btn mb-bk-prev" aria-label="' + esc(T(L10N.prevPage)) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg></button>' +
      '<span class="mb-bk-dots">' + dots + '</span>' +
      '<button type="button" class="bi-pop-btn mb-bk-next" aria-label="' + esc(T(L10N.nextPage)) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button></div>' +
      '<p class="mb-bk-hint">' + esc(T(L10N.bookHint)) + '</p></div>';
  }
  function wireBook(wrap) {
    var book = wrap.querySelector('.mb-book'), leaves = [].slice.call(book.querySelectorAll('.mb-leaf')), n = leaves.length, s = 0;
    var dots = wrap.querySelectorAll('.mb-bk-dots i'), prevB = wrap.querySelector('.mb-bk-prev'), nextB = wrap.querySelector('.mb-bk-next');
    function paint(moving) {
      book.dataset.s = s; book.classList.toggle('at-start', s === 0); book.classList.toggle('at-end', s === n);
      leaves.forEach(function (l, i) {
        var f = i < s; l.classList.toggle('is-turned', f);
        if (n > 6) l.classList.toggle('far', i < s - 2 || i > s + 1);
        l.style.zIndex = l === moving ? 50 : (f ? i + 1 : n - i + 10);
      });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === s); });
      prevB.disabled = s === 0; nextB.disabled = s === n;
    }
    function turn(dir) {
      var to = Math.max(0, Math.min(n, s + dir)); if (to === s) return;
      var leaf = leaves[dir > 0 ? s : s - 1]; s = to; paint(leaf);
      leaf.classList.remove('turning'); void leaf.offsetWidth; leaf.classList.add('turning');
      clearTimeout(leaf._t); leaf._t = setTimeout(function () { leaf.classList.remove('turning'); paint(); }, reduce ? 0 : 1150);
    }
    prevB.addEventListener('click', function () { turn(-1); });
    nextB.addEventListener('click', function () { turn(1); });
    /* tap the right page to turn forward, the left page to turn back; swipe on touch */
    var x0 = null, moved = false;
    book.addEventListener('pointerdown', function (e) { x0 = e.clientX; moved = false; });
    book.addEventListener('pointermove', function (e) { if (x0 !== null && Math.abs(e.clientX - x0) > 12) moved = true; });
    book.addEventListener('pointerup', function (e) {
      if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
      if (moved && Math.abs(dx) > 36) { turn(dx < 0 ? 1 : -1); return; }
      var r = book.getBoundingClientRect();
      if (book.classList.contains('mb-book-top')) turn(e.clientY > r.top + r.height / 2 ? 1 : -1);   /* bound at the top: the lower page turns forward */
      else turn(e.clientX > r.left + r.width / 2 ? 1 : -1);
    });
    book.addEventListener('pointercancel', function () { x0 = null; });
    paint();
  }
  function boardHTML(p, b, set, i0) {
    return '<div class="mb-board" style="--h:' + set.h + '">' + set.items.map(function (g, i) {
      var it = b.items[g[0]]; return it ? pieceHTML(p, it, g.slice(1), i0 + i) : ''; }).join('') + '</div>';
  }
  /* social media carousel: the middle design large, its two neighbours smaller and see-through behind it; it turns by itself */
  function carouselHTML(p, b, part) {
    var its = part.items.map(function (k) { return b.items[k]; }).filter(Boolean), dots = '';
    its.forEach(function () { dots += '<i></i>'; });
    return '<div class="mb-car' + (part.lite ? ' lite' : '') + '" dir="ltr" style="--n:' + its.length + (part.ratio ? ';--ar:' + part.ratio : '') + '">' + its.map(function (it, i) {
      var alt = T(it.alt) || T(p.name);
      return '<figure class="mb-slide" data-i="' + i + '" tabindex="-1" role="button" aria-label="' + esc(alt) + '"><img src="' + esc(srcOf(p, it.src)) + '" width="' + it.w + '" height="' + it.h +
        '" alt="' + esc(alt) + '" loading="lazy" decoding="async" draggable="false">' + TAP + '</figure>'; }).join('') +
      '</div><div class="mb-car-dots" dir="ltr">' + dots + '</div>';
  }
  var carTimers = [];
  function wireCarousel(car) {
    var sl = [].slice.call(car.querySelectorAll('.mb-slide')), n = sl.length, c = 0, hold = false, seen = false, t = 0;
    var dots = car.nextElementSibling.querySelectorAll('i');
    function paint() {
      sl.forEach(function (s, i) {
        var d = ((i - c) % n + n) % n; if (d > n / 2) d -= n;   /* -1 left · 0 middle · 1 right · the rest wait behind */
        s.dataset.pos = Math.abs(d) > 1 ? 'off' : d; s.tabIndex = d === 0 ? 0 : -1;
      });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === c); });
    }
    function step(k) { c = ((c + k) % n + n) % n; paint(); }
    function tick() { if (!hold && seen && !document.hidden && !CASE.hidden) step(1); }
    if (!reduce) { t = setInterval(tick, 3200); carTimers.push(t); }
    sl.forEach(function (s, i) {
      s.addEventListener('click', function () {
        if (s.dataset.pos === '0') openZoom(s.querySelector('img')); else { c = i; paint(); }
      });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(s.querySelector('img')); } });
    });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { c = i; paint(); }); });
    car.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold = true; });
    car.addEventListener('pointerleave', function () { hold = false; });
    var x0 = null;
    car.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    car.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { step(dx < 0 ? 1 : -1); car._swiped = Date.now(); } });
    car.addEventListener('click', function (e) { if (car._swiped && Date.now() - car._swiped < 300) e.stopPropagation(); }, true);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { root: scrollBox }).observe(car); else seen = true;
    paint();
  }
  /* a picture with its text beside it (laptop) or under it (phone) */
  function storyHTML(p, b, part) {
    if (part.fade) {   /* text (intro + colour lines) beside a rounded square that fades between images */
      var ln = part.lines ? '<ul class="mb-lines">' + part.lines.map(function (l) { return '<li><b style="color:' + esc(l.c) + '">' + esc(T(l.k)) + ':</b> ' + esc(T(l.v)) + '</li>'; }).join('') + '</ul>' : '';
      return '<div class="mb-story fade"><p class="ad-p">' + esc(T(part.text)) + '</p>' + ln + '<div class="mb-fade" aria-hidden="true">' +
        part.fade.map(function (k, i) { var it = b.items[k]; return '<img class="' + (i ? '' : 'on') + '" src="' + esc(srcOf(p, it.src)) + '" width="' + it.w + '" height="' + it.h + '" alt="" loading="lazy" decoding="async" draggable="false">'; }).join('') + '</div></div>';
    }
    if (part.video) {
      var sv = T(part.scope) || null;
      return '<div class="mb-story vid">' + featHTML(p, part.video) + '<div class="mb-story-t"><p>' + esc(T(part.text)) + '</p>' +
        (sv ? '<div class="mb-scope"><b>' + esc(T(part.scopeT)) + '</b><ul>' + sv.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '') + '</div></div>';
    }
    if (part.img == null) return '<div class="mb-story only"><div class="mb-story-t"><p>' + esc(T(part.text)) + '</p></div></div>';   /* text only */
    var it = b.items[part.img], alt = T(it.alt) || T(p.name), sc = part.scope ? T(part.scope) : null;
    return '<div class="mb-story' + (part.small ? ' sm' : '') + '"><figure class="mb-pc mb-' + (it.look || 'card') + ' mb-zoom" tabindex="0" role="button" aria-label="' + esc(T(L10N.enlarge) + ': ' + alt) + '"><img src="' + esc(srcOf(p, it.src)) +
      '" width="' + it.w + '" height="' + it.h + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" draggable="false">' + TAP + '</figure>' +
      '<div class="mb-story-t"><p>' + esc(T(part.text)) + '</p>' +
      (sc ? '<div class="mb-scope"><b>' + esc(T(part.scopeT)) + '</b><ul>' + sc.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '') + '</div></div>';
  }
  /* social media as a 3x3 grid: a mauve frame moves from design to design (in a random order); the others stay a little see-through */
  var ZI = '<span class="mb-zi" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.2"/><path d="M10.2 10.2L13.5 13.5"/></svg></span>';
  function gridHTML(p, b, part, mob) {
    var ks = part.items.slice();
    /* laptop: 4 per row in 2 rows across the full width, so one design (picked at random) is left out */
    if (!mob && part.d4) ks.splice(Math.floor(Math.random() * ks.length), 1);
    /* row:true (Bombo's Books) = laptop: every design in one row · phone: 2 x 2; frame = the moving frame's colour */
    return '<div class="mb-grid' + (!mob && part.d4 ? ' g4' : '') + (part.row ? ' g-row' : '') + (part.pairs ? ' g-pairs' : '') + '" dir="ltr"' + (part.pairs ? ' data-pairs="' + (mob ? '1,2|0,3' : '0,2|1,3') + '"' : '') + (part.row ? ' style="--n:' + ks.length + (part.frame ? ';--gf:' + esc(part.frame) : '') + '"' : '') + '>' + ks.map(function (k, i) {
      var it = b.items[k]; if (!it) return ''; var alt = T(it.alt) || T(p.name);
      return '<figure class="mb-gc" tabindex="0" role="button" aria-label="' + esc(T(L10N.enlarge) + ': ' + alt) + '"><img src="' + esc(srcOf(p, it.src)) + '" width="' + it.w + '" height="' + it.h +
        '" alt="' + esc(alt) + '" loading="lazy" decoding="async" draggable="false">' + ZI + '</figure>'; }).join('') + '</div>';
  }
  function wireFade(f) {   /* each image stays a medium time, then a quick fade to the next */
    var im = [].slice.call(f.querySelectorAll('img')), c = 0;
    if (reduce || im.length < 2) return;
    carTimers.push(setInterval(function () { if (document.hidden || CASE.hidden) return; im[c].classList.remove('on'); c = (c + 1) % im.length; im[c].classList.add('on'); }, 3000));
  }
  function wireGrid(g) {
    var cs = [].slice.call(g.querySelectorAll('.mb-gc')), n = cs.length, bag = [], c, hold = false, seen = false;
    /* random order, but the frame visits every design once before any design gets it again */
    function next() {
      if (!bag.length) { for (var i = 0; i < n; i++) if (i !== c) bag.push(i); for (var j = bag.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)), t = bag[j]; bag[j] = bag[r]; bag[r] = t; } if (c != null) bag.push(c); }
      return bag.shift();
    }
    function paint() { cs.forEach(function (x, i) { x.classList.toggle('on', i === c); }); }
    function tick() { if (hold || !seen || document.hidden || CASE.hidden) return; c = next(); paint(); }
    /* pairs:true (KHALAIG) = two designs lit at a time, then the other two (laptop row: 1+3 ↔ 2+4 · phone 2x2: the diagonals) */
    if (g.dataset.pairs) {
      var sets = g.dataset.pairs.split('|').map(function (x) { return x.split(',').map(Number); }), si = 0;
      paint = function () { cs.forEach(function (x, i) { x.classList.toggle('on', sets[si].indexOf(i) > -1); }); };
      tick = function () { if (hold || !seen || document.hidden || CASE.hidden) return; si = (si + 1) % sets.length; paint(); };
      next = function () { return c; };
    }
    c = next();
    if (!reduce) carTimers.push(setInterval(tick, 2400));
    cs.forEach(function (x, i) {
      x.addEventListener('click', function () { if (!g.dataset.pairs) { c = i; paint(); } openZoom(x.querySelector('img')); });
      x.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!g.dataset.pairs) { c = i; paint(); } openZoom(x.querySelector('img')); } });
    });
    g.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold = true; });
    g.addEventListener('pointerleave', function () { hold = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { root: scrollBox }).observe(g); else seen = true;
    paint();
  }
  /* the identity's own shapes, very transparent, drifting behind the board */
  function decoHTML(p, b) {
    return b.deco ? '<div class="mb-deco" aria-hidden="true">' + b.deco.map(function (d, i) {
      return '<img src="' + esc(srcOf(p, d[0])) + '" alt="" style="--x:' + d[1] + ';--y:' + d[2] + ';--w:' + d[3] + ';--r:' + d[4] + 'deg;--o:' + d[5] + ';--i:' + i + '" loading="lazy" decoding="async" draggable="false">'; }).join('') + '</div>' : '';
  }

  /* ---- options used by برمجان المنورة (other projects never use them) ---- */
  /* a phone screen playing a silent screen recording (loops, plays only while it is on screen) */
  function phoneHTML(p, part, mob) {
    var v = part.video, vid = '<video src="' + esc(srcOf(p, v.src)) + '" poster="' + esc(srcOf(p, v.poster)) + '" muted loop playsinline preload="none" aria-label="' + esc(T(v.title)) + '"></video>';
    if (!mob && part.wide) return '<div class="mb-laptop"><div class="mb-lap-scr">' + vid + '</div><i class="mb-lap-base" aria-hidden="true"></i></div>';
    return '<div class="mb-phone"><div class="mb-phone-f" style="--ar:' + v.w + ' / ' + v.h + '">' + vid + '<i class="mb-phone-n" aria-hidden="true"></i></div></div>';
  }
  function wireInline(v) {   /* silent inline videos play only once scrolled to (from the start), and stop when scrolled away */
    v.muted = true; var on = false;
    if (!('IntersectionObserver' in window)) { v.play().catch(function () {}); return; }
    new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting && !CASE.hidden;
      if (vis && !on) { on = true; try { v.currentTime = 0; } catch (x) {} v.play().catch(function () {}); }
      else if (!vis && on) { on = false; v.pause(); }
    }, { root: scrollBox, threshold: .5 }).observe(v);
  }
  /* the official video in a glowing green frame: plays silently in place, tap = open large with sound */
  function featHTML(p, v) {
    return '<figure class="mb-feat" tabindex="0" role="button" aria-label="' + esc(T(v.title)) + '" style="--ar:' + v.w + ' / ' + v.h + '" data-src="' + esc(srcOf(p, v.src)) + '">' +
      '<video src="' + esc(srcOf(p, v.src)) + '" poster="' + esc(srcOf(p, v.poster)) + '" muted loop playsinline preload="none"></video>' +
      '<span class="mb-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span></figure>';
  }
  /* the campaign: a short text beside the designs' carousel (laptop) or above it (phone) */
  function campaignHTML(p, b, part) {
    return '<div class="mb-camp' + (part.one ? ' one' : '') + '"><p class="mb-camp-t">' + esc(T(part.text)) + '</p>' + carouselHTML(p, b, part) + '</div>';
  }
  function renderBoard(p) {
    carTimers.forEach(clearInterval); carTimers = [];
    var b = p.board, mob = mobMQ.matches;
    var parts = b ? (b.parts || [{ k: 'board', d: b.d, m: b.m }]) : null;
    if (!parts) {   /* no board yet: show the images one under the other (never stretched) */
      var imgs = imagesOf(p);
      BOARD.className = 'mb-board mb-free'; BOARD.removeAttribute('style');
      BOARD.innerHTML = imgs.length ? imgs.map(function (im, i) {
        return '<figure class="mb-flow"><img src="' + esc(im.src) + '" alt="' + esc(T(im.alt) || T(p.name)) + '" loading="lazy" decoding="async"></figure>'; }).join('')
        : '<p class="bi-empty">' + esc(T(L10N.soon)) + '</p>';
      return;
    }
    BOARD.className = 'mb-parts' + (b.titles === 'side' ? ' t-side' : '') + (b.colorsAt === 'start' ? ' c-start' : '') + (b.capBig ? ' cap-big' : ''); BOARD.removeAttribute('style');
    var n = 0;
    BOARD.innerHTML = decoHTML(p, b) + parts.map(function (pt) {
      var inner = '';
      if (pt.k === 'book') inner = bookHTML(p, pt.bindM && mob ? Object.assign({}, pt, { bind: pt.bindM }) : pt);
      else if (pt.k === 'carousel') inner = carouselHTML(p, b, pt);
      else if (pt.k === 'story') inner = storyHTML(p, b, pt);
      else if (pt.k === 'phone') inner = phoneHTML(p, pt, mob);
      else if (pt.k === 'campaign') inner = campaignHTML(p, b, pt);
      else if (pt.k === 'grid') inner = gridHTML(p, b, pt, mob);
      else if (pt.k === 'videos') inner = '<div class="vc-mount" data-set="' + esc(pt.set || p.slug) + '"></div>';   /* 3D video carousel (video-carousel.js + videos.js) */
      else if (pt.k === 'colors') inner = '<ul class="mb-colors' + (b.swatch === 'rect' ? ' rect' : '') + '">' + (p.colors || []).map(function (c) {
        var box = c.icon ? '<img class="ic" src="' + esc(srcOf(p, c.icon)) + '" alt="' + esc(T(p.name)) + ' — ' + esc(c.hex) + '" width="420" height="420" loading="lazy" decoding="async" draggable="false">'
          : '<span class="sw" style="--c:' + esc(c.hex) + '"></span>';
        return '<li title="' + esc(T(c.role)) + '">' + box + '<b>' + esc(c.hex) + '</b></li>'; }).join('') + '</ul>';
      else if (pt.k === 'type') inner = '<dl class="mb-type">' + (p.fonts || []).map(function (f) {
        return '<div><dt>' + esc(T(f.role)) + '</dt><dd>' + esc(f.name) + '</dd></div>'; }).join('') + '</dl>';
      else { var set = mob ? pt.m : pt.d; if (!set) return ''; inner = boardHTML(p, b, set, n); n += set.items.length; }
      var dir = pt.ltr ? ' dir="ltr"' : '';
      if (!pt.cap) return '<section class="mb-sec no-title"' + dir + '>' + inner + '</section>';
      /* titles beside the content on the laptop (two lines), above it on the phone (one line) */
      if (b.titles === 'side') return '<section class="mb-sec mb-side mb-sec-' + pt.k + '"><h3 class="mb-sec-t">' + T(pt.cap).split('\n').map(esc).join('<br class="dk"> ') +
        '</h3><span class="mb-rule" aria-hidden="true"></span><div class="mb-sec-c"' + dir + '>' + inner + '</div></section>';
      var title = '<h3 class="mb-sec-t' + (pt.stack ? ' st-' + pt.stack : '') + '">' + esc(T(pt.cap)) + '</h3>';
      if (pt.inline) return '<section class="mb-sec mb-inline mb-sec-' + pt.k + '">' + title + '<span class="mb-rule" aria-hidden="true"></span><div class="mb-sec-c">' + inner + '</div></section>';
      return '<section class="mb-sec mb-block mb-sec-' + pt.k + '"><div class="mb-sec-h">' + title + '<span class="mb-rule" aria-hidden="true"></span></div><div class="mb-sec-c"' + dir + '>' + inner + '</div></section>';
    }).join('');
    BOARD.querySelectorAll('.mb-book').forEach(function (bk) { wireBook(bk.parentNode); });
    BOARD.querySelectorAll('.mb-car').forEach(wireCarousel);
    BOARD.querySelectorAll('.mb-grid').forEach(wireGrid);
    BOARD.querySelectorAll('.mb-fade').forEach(wireFade);
    requestAnimationFrame(fitScope);
    /* campaign one:true (KHALAIG): the line shrinks a little if it would not fit on one line */
    requestAnimationFrame(function () { BOARD.querySelectorAll('.mb-camp.one .mb-camp-t').forEach(function (t) {
      t.style.fontSize = ''; var fs = parseFloat(getComputedStyle(t).fontSize), w = t.parentNode.clientWidth - 8;
      while (t.scrollWidth > w && fs > 9) { fs -= .5; t.style.fontSize = fs + 'px'; } }); });
    BOARD.querySelectorAll('.mb-phone video,.mb-laptop video,.mb-feat video').forEach(wireInline);
    BOARD.querySelectorAll('.mb-feat').forEach(function (f) { var go = function () { openVideo(f.dataset.src, f.querySelector('video').poster); };
      f.addEventListener('click', go); f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    BOARD.querySelectorAll('.vc-mount').forEach(function (m) { if (window.VideoCarousel) window.VideoCarousel.mount(m, (window.BRAND_VIDEOS || {})[m.dataset.set], { lang: lang, host: CASE, scroll: scrollBox, paused: function () { return CASE.hidden || !ZOOM.hidden; } }); });
    BOARD.querySelectorAll('.mb-zoom').forEach(function (z) { z.addEventListener('click', function () { openZoom(z.querySelector('img')); }); z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(z.querySelector('img')); } }); });
    BOARD.querySelectorAll('.mb-pc,.mb-cap,.mb-sec').forEach(function (el) { if (revealIO && !reduce) revealIO.observe(el); else el.classList.add('in'); });
  }
  /* tap a post: it opens large in the middle of the screen, X / Esc / tap outside closes it */
  var ZOOM = document.createElement('div'); ZOOM.className = 'mb-lightbox'; ZOOM.hidden = true;
  ZOOM.innerHTML = '<button type="button" class="bi-pop-btn mb-lb-close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button><img alt=""><video controls playsinline preload="none" hidden></video>';
  CASE.appendChild(ZOOM);
  var zoomFrom = null;
  function openZoom(img) {
    zoomFrom = img; var big = ZOOM.querySelector('img'); big.hidden = false; ZOOM.querySelector('video').hidden = true; big.src = img.currentSrc || img.src; big.alt = img.alt;
    ZOOM.querySelector('.mb-lb-close').setAttribute('aria-label', T(L10N.close));
    ZOOM.hidden = false; void ZOOM.offsetWidth; ZOOM.classList.add('on'); ZOOM.querySelector('.mb-lb-close').focus({ preventScroll: true });
  }
  function closeZoom() {
    if (ZOOM.hidden) return false;
    var zv = ZOOM.querySelector('video'); if (!zv.hidden) { zv.pause(); ZOOM.classList.remove('vid'); }
    ZOOM.classList.remove('on'); setTimeout(function () { ZOOM.hidden = true; }, reduce ? 0 : 320);
    if (zoomFrom && zoomFrom.parentNode) zoomFrom.parentNode.focus({ preventScroll: true }); return true;
  }
  ZOOM.addEventListener('click', function (e) { if (e.target !== ZOOM.querySelector('img') && e.target !== ZOOM.querySelector('video')) closeZoom(); });
  function openVideo(src, poster) {   /* the campaign video, large, with sound and every control */
    var zv = ZOOM.querySelector('video'); zoomFrom = null; ZOOM.querySelector('img').hidden = true;
    zv.hidden = false; zv.poster = poster || ''; if (zv.getAttribute('src') !== src) zv.src = src; zv.currentTime = 0; zv.muted = false;
    ZOOM.querySelector('.mb-lb-close').setAttribute('aria-label', T(L10N.close));
    ZOOM.hidden = false; ZOOM.classList.add('vid'); void ZOOM.offsetWidth; ZOOM.classList.add('on'); zv.play().catch(function () {});
    ZOOM.querySelector('.mb-lb-close').focus({ preventScroll: true });
  }
  /* laptop: the intro always fits on two lines */
  /* compact head: the title group (yellow line + name + tagline) grows until it is as tall as the square logo beside it */
  function fitCompact() {
    if (!HEAD.classList.contains('h-compact')) return;
    var lg = HEAD.querySelector('.mb-logo'), nm = HEAD.querySelector('.bi-case-name'); if (!lg || !nm) return;
    /* a long tagline stays on one line: it gets a little smaller instead of breaking (only when it would break) */
    var tg = HEAD.querySelector('.mb-tag');
    if (tg) { tg.style.fontSize = ''; tg.style.whiteSpace = 'nowrap'; var tf = parseFloat(getComputedStyle(tg).fontSize);
      for (var q = 0; q < 24 && tg.scrollWidth > tg.clientWidth + 1 && tf > 9; q++) { tf -= .5; tg.style.fontSize = tf + 'px'; } }
    var parts = [HEAD.querySelector('.bi-label'), nm, HEAD.querySelector('.mb-tag')].filter(Boolean);
    var goal = lg.getBoundingClientRect().height, box = nm.parentNode === HEAD ? null : nm.parentNode;
    var hOf = function () { var t = parts[0].getBoundingClientRect().top, b = parts[parts.length - 1].getBoundingClientRect().bottom; return b - t; };
    var lns = [].slice.call(nm.querySelectorAll('.ln'));
    /* title in fixed lines: every line is enlarged to the width of the widest one */
    var equal = function () {
      if (!lns.length) return; lns.forEach(function (l) { l.style.fontSize = ''; });
      var ws = lns.map(function (l) { return l.getBoundingClientRect().width || 1; }), wm = Math.max.apply(null, ws), fs = parseFloat(getComputedStyle(nm).fontSize);
      lns.forEach(function (l, i) { if (ws[i] < wm) l.style.fontSize = (fs * wm / ws[i]).toFixed(2) + 'px'; });
    };
    var fits = function () { equal(); return nm.scrollWidth <= nm.clientWidth + 1 && hOf() <= goal; };
    var mx = (nm.dataset.max || '64,46').split(','), lo = 12, hi = +(mobMQ.matches ? mx[1] : mx[0]);   /* headMax = [laptop, phone] for short names */
    nm.style.fontSize = hi + 'px'; if (fits()) return;
    for (var k = 0; k < 12; k++) { var mid = (lo + hi) / 2; nm.style.fontSize = mid + 'px'; if (fits()) lo = mid; else hi = mid; }
    nm.style.fontSize = lo.toFixed(1) + 'px';
  }
  function fitScope() {   /* many scope chips: they get a little smaller to stay on one line (only when they would not fit) */
    BOARD.querySelectorAll('.mb-scope ul').forEach(function (u) { var li = [].slice.call(u.children); li.forEach(function (x) { x.style.fontSize = ''; x.style.paddingInline = ''; });
      var f = li.length ? parseFloat(getComputedStyle(li[0]).fontSize) : 0;
      for (var k = 0; k < 24 && u.scrollWidth > u.clientWidth + 1 && f > 7; k++) { f -= .25; li.forEach(function (x) { x.style.fontSize = f + 'px'; x.style.paddingInline = Math.max(5, f * .7) + 'px'; }); } });
  }
  function fitIntro() {
    fitCompact(); fitScope();
    var d = HEAD.querySelector('.bi-case-desc'); if (!d) return;
    d.style.fontSize = ''; if (mobMQ.matches) return;
    var fs = parseFloat(getComputedStyle(d).fontSize), lh = parseFloat(getComputedStyle(d).lineHeight) / fs;
    for (var k = 0; k < 14 && d.getBoundingClientRect().height > fs * lh * 2.5 && fs > 12.5; k++) { fs -= .5; d.style.fontSize = fs + 'px'; }
  }
  function fillCase(p) {
    current = p;
    POP.style.setProperty('--acc', p.accent || '#9B5CFF');
    var logo = p.logo ? '<div class="mb-logo"><img src="' + esc(p.logo) + '" alt="' + esc(T(p.name)) + ' logo" decoding="async"></div>' : '';
    HEAD.className = 'mb-head' + (p.logo ? '' : ' no-logo') + (p.board && p.board.head ? ' h-' + p.board.head : '') + (p.board && p.board.logoRound ? ' lg-round' : '') + (p.board && p.board.descAt === 'title' ? ' d-title' : '') + (p.board && p.board.oneLine ? ' one-' + p.board.oneLine : '') + (p.board && p.board.desc2 ? ' d2' : '');
    HEAD.innerHTML = logo + '<div class="mb-intro"><p class="bi-label">' + esc(T(p.kind) || T(L10N.kind)) + '</p>' +
      '<h2 id="biCaseName" class="bi-case-name' + (p.nameLines && T(p.nameLines) ? ' eq' : '') + (/[\u0600-\u06FF]/.test(T(p.name)) ? '' : ' lat') + '"' + (p.board && p.board.headMax ? ' data-max="' + p.board.headMax.join(',') + '"' : '') + '>' + (p.nameLines && T(p.nameLines) ? T(p.nameLines).map(function (l) { return '<span class="ln">' + esc(l) + '</span>'; }).join('') : esc(T(p.name))) + '</h2>' +
      (T(p.tagline) ? '<p class="mb-tag">' + (p.tagBreak && (p.tagBreak === true || p.tagBreak === lang) && mobMQ.matches ? T(p.tagline).split(' · ').map(esc).join('<br>') : esc(T(p.tagline))) + '</p>' : '') +
      (T(p.description) ? '<p class="bi-case-desc">' + esc(T(p.description)) + '</p>' : '') + '</div>';
    renderBoard(p); fitIntro();
    var idx = P.indexOf(p), prev = P[(idx - 1 + P.length) % P.length], next = P[(idx + 1) % P.length];
    var bp = document.getElementById('biPrev'), bn = document.getElementById('biNext');
    bp.innerHTML = '<small>' + esc(T(L10N.prev)) + '</small>' + esc(T(prev.name)); bp.dataset.slug = prev.slug;
    bn.innerHTML = '<small>' + esc(T(L10N.next)) + '</small>' + esc(T(next.name)); bn.dataset.slug = next.slug;
    var tp = document.getElementById('biTopPrev'), tn = document.getElementById('biTopNext'), cl = document.getElementById('biCaseClose');
    tp.dataset.slug = prev.slug; tn.dataset.slug = next.slug;
    tp.setAttribute('aria-label', T(L10N.prev) + ': ' + T(prev.name)); tn.setAttribute('aria-label', T(L10N.next) + ': ' + T(next.name)); cl.setAttribute('aria-label', T(L10N.close));
    document.title = T(p.name) + ' — ' + (lang === 'ar' ? 'هويات العلامات التجارية' : 'Brand Identities');
  }
  var lastMob = mobMQ.matches;
  addEventListener('resize', function () { if (current && !CASE.hidden) fitIntro(); if (mobMQ.matches !== lastMob) { lastMob = mobMQ.matches; if (current && !CASE.hidden) renderBoard(current); } });
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  function openCase(slug, fromEl, instant) {
    var p = bySlug(slug); if (!p) { closeCase(true); return; }
    ZOOM.hidden = true; ZOOM.classList.remove('on');
    var wasOpen = !CASE.hidden;
    fillCase(p); scrollBox.scrollTop = 0;
    lastFolder = fromEl || grid.querySelector('[data-slug="' + slug + '"]');
    if (wasOpen) return;
    CASE.hidden = false; root.classList.add('bi-lock'); fitIntro();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitIntro);
    if (!instant && !reduce && CASE.animate) {
      /* the page blurs and darkens, then the glass rises softly from the folder that was clicked */
      var r = lastFolder ? lastFolder.getBoundingClientRect() : null, pr = POP.getBoundingClientRect();
      var ox = r ? ((r.left + r.width / 2 - pr.left) / pr.width * 100).toFixed(1) + '%' : '50%', oy = r ? ((r.top + r.height / 2 - pr.top) / pr.height * 100).toFixed(1) + '%' : '50%';
      POP.style.transformOrigin = ox + ' ' + oy;
      VEIL.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, easing: 'ease' });
      POP.animate([{ opacity: 0, transform: 'translateY(26px) scale(.9)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 760, easing: EASE });
      INNER.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 260, easing: EASE, fill: 'backwards' });
    }
    document.getElementById('biCaseClose').focus({ preventScroll: true });
  }
  function closeCase(instant) {
    if (CASE.hidden) return;
    var done = function () { ZOOM.hidden = true; ZOOM.classList.remove('on'); CASE.hidden = true; root.classList.remove('bi-lock'); setTitle(); if (lastFolder) lastFolder.focus({ preventScroll: true }); };
    if (instant || reduce || !CASE.animate) { done(); return; }
    VEIL.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease', fill: 'forwards' });
    var a = POP.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(18px) scale(.95)' }], { duration: 380, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    a.onfinish = function () { done(); POP.getAnimations().forEach(function (x) { x.cancel(); }); VEIL.getAnimations().forEach(function (x) { x.cancel(); }); };
  }
  function requestClose() {
    if (history.state && history.state.bi === 1) history.back();   /* popstate closes it */
    else { history.replaceState({ bi: 0 }, '', location.pathname + location.search); closeCase(); }
  }
  document.getElementById('biCaseClose').addEventListener('click', requestClose);
  VEIL.addEventListener('click', requestClose);
  /* previous / next: the board slides out and the next project's board slides in */
  function go(s, dir) {
    if (!s || !current || s === current.slug) return;
    history.replaceState(history.state, '', '#' + s);
    if (reduce || !INNER.animate) { openCase(s); return; }
    var dx = (dir > 0 ? -1 : 1) * (lang === 'ar' ? -1 : 1) * 40;
    INNER.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + dx + 'px)' }], { duration: 260, easing: 'ease-in' }).onfinish = function () {
      openCase(s);
      INNER.animate([{ opacity: 0, transform: 'translateX(' + (-dx) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: EASE });
    };
  }
  [['biPrev', -1], ['biNext', 1], ['biTopPrev', -1], ['biTopNext', 1]].forEach(function (b) {
    document.getElementById(b[0]).addEventListener('click', function () { go(this.dataset.slug, b[1]); });
  });
  addEventListener('keydown', function (e) {
    if (CASE.hidden) return;
    if (e.key === 'Escape') { if (!closeZoom()) requestClose(); return; }
    if (!ZOOM.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      var fwd = (e.key === 'ArrowRight') !== (lang === 'ar');
      go(document.getElementById(fwd ? 'biTopNext' : 'biTopPrev').dataset.slug, fwd ? 1 : -1);
    }
    if (e.key === 'Tab') {   /* keep keyboard focus inside the pop-up */
      var f = POP.querySelectorAll('button,a[href]'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  function syncRoute(instant) {
    var s = decodeURIComponent(location.hash.slice(1));
    if (s && bySlug(s)) openCase(s, null, instant); else closeCase(instant);
  }
  addEventListener('popstate', function () { syncRoute(false); });

  /* footer "Back to the main page": land on the main page's Services, in the same language (the home page reads nehGo / nehLang) */
  var homeLink = document.getElementById('biHome');
  if (homeLink) homeLink.addEventListener('click', function () { try { sessionStorage.setItem('nehGo', 'services'); sessionStorage.setItem('nehLang', lang); } catch (e) {} });

  /* coming back here with the browser's forward button: show the page again */
  addEventListener('pageshow', function (e) { if (e.persisted) { root.classList.remove('bi-enter'); root.classList.add('bi-ready'); } });

  /* ---------------- language ---------------- */
  var sw = document.getElementById('langBlob');
  function setTitle() { document.title = lang === 'ar' ? 'هويات العلامات التجارية — نهال الهندي' : 'Brand Identities — Nehal El Hendy'; }
  function setLanguage(next, first) {
    lang = next; root.lang = next; root.dir = next === 'ar' ? 'rtl' : 'ltr';
    try { sessionStorage.setItem('nehLang', next); } catch (e) {}
    document.querySelectorAll('[data-en][data-ar]').forEach(function (el) { var v = el.dataset[next]; if (v != null) el.textContent = v; });
    sw.textContent = next === 'ar' ? 'EN' : 'AR'; sw.dataset.to = next === 'ar' ? 'en' : 'ar';
    sw.setAttribute('aria-label', next === 'en' ? 'التبديل إلى العربية' : 'Switch to English');
    var u = new URL(location.href); if (next === 'ar') u.searchParams.set('lang', 'ar'); else u.searchParams.delete('lang');
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    setHero();
    showFlower(next, first);
    if (!first) { renderGrid(); grid.querySelectorAll('.bi-item').forEach(function (li) { li.classList.add('lit'); }); if (current && !CASE.hidden) fillCase(current); }
    if (CASE.hidden) setTitle();
  }
  /* ---------------- hero text ----------------
     Arabic: the title is two lines that end at the same point (the shorter line gets bigger words),
     and the lead's two lines are the same length too, clearly smaller than the title. */
  var HERO = {
    en: { title: ['Brand', 'Identities'], lead: ['Building distinctive visual worlds', 'that give brands their own personality.'] },
    /* kash: where the second title line may be stretched with kashida (ـ), so it ends where the first line ends at the same size */
    ar: { title: ['هويات العلامات', 'التجارية'], kash: [null, [3, 7, 4]], lead: ['تُبنى عوالم بصرية مميزة تمنح كل', 'علامة تجارية شخصيتها الخاصة.'] }
  };
  var hTitle = document.getElementById('biTitle'), hLead = document.getElementById('biLead'), hLabel = document.getElementById('biLabel');
  function lines(el, arr) { el.classList.add('bi-fit'); el.innerHTML = arr.map(function (s) { return '<span class="ln">' + esc(s) + '</span>'; }).join(''); }
  function setHero() { var h = HERO[lang]; lines(hTitle, h.title); lines(hLead, h.lead); fitHero(); }
  function wOf(el) { return el.getBoundingClientRect().width || 1; }
  function fitHero() {
    var h = HERO[lang], ar = lang === 'ar', box = hTitle.parentNode.getBoundingClientRect().width, mob = innerWidth <= 640;
    var T = [].slice.call(hTitle.querySelectorAll('.ln')), L = [].slice.call(hLead.querySelectorAll('.ln'));
    hLabel.style.fontSize = ''; hTitle.style.fontSize = ''; T.forEach(function (ln, i) { ln.style.fontSize = ''; ln.textContent = h.title[i]; });
    var titleW;
    if (ar) {
      /* both title lines the same size: the widest fills the width, the other is stretched with kashida to end at the same point */
      var target = Math.min(box, mob ? box * .86 : 520);
      hTitle.style.fontSize = '100px';
      var widths = T.map(wOf), wmax = Math.max.apply(null, widths);
      hTitle.style.fontSize = (100 * target / wmax).toFixed(2) + 'px';
      T.forEach(function (ln, i) {
        var slots = h.kash && h.kash[i]; if (!slots) return;
        var base = h.title[i], goal = target, best = base, bestD = Math.abs(wOf(ln) - goal), n = 0;
        while (n < 40) {
          n++; var cnt = {}; for (var j = 0; j < n; j++) { var s = slots[j % slots.length]; cnt[s] = (cnt[s] || 0) + 1; }
          var out = ''; for (var c = 0; c < base.length; c++) { if (cnt[c]) out += Array(cnt[c] + 1).join('ـ'); out += base[c]; }
          ln.textContent = out; var w = wOf(ln), d = Math.abs(w - goal);
          if (d < bestD) { bestD = d; best = out; }
          if (w > goal) break;
        }
        ln.textContent = best;
        var fs = parseFloat(getComputedStyle(hTitle).fontSize); ln.style.fontSize = (fs * goal / wOf(ln)).toFixed(2) + 'px';   /* last few pixels */
      });
      titleW = target;
    } else titleW = wOf(T[0]);
    /* the yellow line: English = narrower than "Brand" on the laptop; one line on phones */
    if (!ar) {
      hLabel.style.fontSize = '100px';
      var lw = wOf(hLabel), goalL = mob ? Math.min(box, titleW * 1.25) : titleW * .9;
      hLabel.style.fontSize = Math.min(mob ? 24 : 40, 100 * goalL / lw).toFixed(2) + 'px';
    }
    /* lead: two lines, one size; Arabic lines are spread to the same length */
    var lo = mob ? (ar ? 11.5 : 11) : 16, hi = mob ? (ar ? 13 : 13) : (ar ? 21 : 22), leadT = ar ? titleW : (mob ? box * .8 : Math.min(box, 540));
    L.forEach(function (ln) { ln.style.wordSpacing = ''; });
    hLead.style.fontSize = '100px';
    var lmax = Math.max.apply(null, L.map(wOf));
    hLead.style.fontSize = Math.max(lo, Math.min(hi, 100 * leadT / lmax)).toFixed(2) + 'px';
    if (ar) {
      var ws = L.map(wOf), T2 = Math.min(leadT, Math.max.apply(null, ws));
      L.forEach(function (ln, i) { var gaps = (ln.textContent.match(/ /g) || []).length; if (gaps && ws[i] < T2) ln.style.wordSpacing = ((T2 - ws[i]) / gaps).toFixed(2) + 'px'; });
    }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitHero(); });
  var ft; addEventListener('resize', function () { clearTimeout(ft); ft = setTimeout(fitHero, 120); });

  /* the hero flower changes with the language and lights up each time */
  function showFlower(l, first) {
    document.querySelectorAll('.bi-bloom').forEach(function (fl) {
      var on = fl.classList.contains('fl-' + l);
      fl.classList.remove('lit'); fl.classList.toggle('on', on);
      if (!on) fl.classList.remove('lit');
    });
  }
  sw.addEventListener('click', function () { setLanguage(lang === 'en' ? 'ar' : 'en'); });

  var onScroll = function () { root.classList.toggle('bi-scrolled', scrollY > 40); }; addEventListener('scroll', onScroll, { passive: true }); onScroll();
  /* ---------------- start ---------------- */
  renderGrid();
  setLanguage(lang, true);
  if (!history.state) history.replaceState({ bi: 0 }, '', location.href);
  syncRoute(true);
  document.querySelectorAll('.bi-bloom').forEach(function (fl) { fl.addEventListener('transitionend', function (e) { if (e.propertyName === 'filter' && fl.classList.contains('on')) fl.classList.add('lit'); }); });
  var reveal = function () { fitHero(); requestAnimationFrame(function () { root.classList.add('bi-ready'); setTimeout(function () { root.classList.remove('bi-enter'); }, 1100); }); };
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]).then(reveal); else reveal();
})();
