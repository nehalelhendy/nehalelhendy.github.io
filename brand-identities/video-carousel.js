/* =====================================================================
   VIDEO CAROUSEL — a reusable 3D infinite video carousel
   ---------------------------------------------------------------------
   VideoCarousel.mount(el, videos, {
     lang:   'en' | 'ar',
     host:   element the full-screen player is added to (default document.body),
     paused: function () { return true while the carousel must rest },
     scroll: the scrolling box the carousel sits in (for "is it on screen")
   })  ->  { destroy() }

   · The middle card is large and plays (muted, looping); the cards beside it are
     smaller and turned in 3D; the carousel turns by itself, never ends,
     and can be dragged with the mouse or a finger.
   · Only the middle video is ever loaded / playing; the others show their poster.
   · Tap the middle card (or any card twice) = the video opens large with sound and
     full controls; closing it brings you back to the same place.
   Videos come from videos.js (direct files, HLS or Cloudflare Stream links).
   ===================================================================== */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TXT = {
    play: { en: 'Play video', ar: 'تشغيل الفيديو' },
    close: { en: 'Close', ar: 'إغلاق' },
    error: { en: 'This video could not be loaded.', ar: 'تعذّر تحميل هذا الفيديو.' },
    region: { en: 'Videos', ar: 'الفيديوهات' }
  };
  var MIN_CARDS = 7;      /* few videos are repeated so the circle never looks empty */
  var DWELL = 5200;       /* how long each video stays in the middle */
  var TURN = 950;         /* one smooth turn, in ms */

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tr(o, l) { return o == null ? '' : typeof o === 'string' ? o : (o[l] || o.en || ''); }
  var hlsOK = (function () { try { return !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'); } catch (e) { return false; } })();

  /* direct file, HLS or Cloudflare Stream -> what the <video> should load */
  function resolve(v) {
    var r = { src: v.src || '', hls: v.hls || '', poster: v.poster || '', w: v.w || 9, h: v.h || 16, title: v.title };
    if (v.stream && v.stream.id) {
      var base = 'https://' + (v.stream.customer ? v.stream.customer + '.cloudflarestream.com' : 'videodelivery.net') + '/' + encodeURIComponent(v.stream.id);
      r.hls = r.hls || base + '/manifest/video.m3u8';
      r.src = r.src || base + '/downloads/default.mp4';
      r.poster = r.poster || base + '/thumbnails/thumbnail.jpg?time=1s&height=720';
    }
    r.play = hlsOK && r.hls ? r.hls : (r.src || r.hls);
    return r;
  }
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var wrap = function (d, n) { d = ((d % n) + n) % n; return d > n / 2 ? d - n : d; };

  function mount(el, list, opt) {
    opt = opt || {};
    var lang = opt.lang || 'en', host = opt.host || document.body;
    var vids = (list || []).map(resolve).filter(function (v) { return v.play; });
    if (!vids.length) { el.innerHTML = ''; return { destroy: function () {} }; }
    var cards = []; while (cards.length < Math.max(MIN_CARDS, vids.length)) cards = cards.concat(vids);
    if (vids.length >= MIN_CARDS) cards = vids.slice();
    var n = cards.length;

    el.classList.add('vc');
    el.setAttribute('role', 'region'); el.setAttribute('aria-roledescription', 'carousel'); el.setAttribute('aria-label', tr(TXT.region, lang));
    el.innerHTML = '<div class="vc-stage" dir="ltr"><span class="vc-glow" aria-hidden="true"></span>' + cards.map(function (v, i) {
      var t = tr(v.title, lang) || tr(TXT.play, lang);
      return '<div class="vc-card" data-i="' + i + '" role="button" tabindex="-1" aria-label="' + esc(t) + '" style="--ar:' + v.w + '/' + v.h + '">' +
        '<img class="vc-poster" src="' + esc(v.poster) + '" alt="" loading="lazy" decoding="async" draggable="false">' +
        '<span class="vc-shade" aria-hidden="true"></span>' +
        '<span class="vc-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>' +
        '<span class="vc-bar" aria-hidden="true"><i></i></span>' +
        '<span class="vc-err" aria-hidden="true">' + esc(tr(TXT.error, lang)) + '</span></div>';
    }).join('') + '</div>';
    var stage = el.firstChild, C = [].slice.call(stage.querySelectorAll('.vc-card')), GLOW = stage.querySelector('.vc-glow'), SH = C.map(function (c) { return c.querySelector('.vc-shade'); });

    var pos = 0, anim = null, raf = 0, timer = 0, seen = false, held = false, modalOpen = false, dead = false, cw = 200;
    var live = { i: -1, v: null };

    /* -------- layout: where each card stands for a position --------
       The turns are CSS transitions on transform + opacity only, so the browser runs them on the GPU
       (compositor), away from everything else the page does: no stutter while videos load or play.
       Only dragging moves the cards frame by frame (they follow the finger). */
    var half = 400, last = [], zT = 0;
    function measure() { cw = C[0].getBoundingClientRect().width || cw; half = stage.getBoundingClientRect().width / 2 || half; }
    function paint(instant, dur) {
      var zs = [];
      for (var i = 0; i < n; i++) {
        var d = wrap(i - pos, n), a = Math.abs(d), s = d < 0 ? -1 : 1;
        var x = s * cw * (0.74 * Math.min(a, 1) + 0.52 * Math.max(0, Math.min(a, 2) - 1) + 0.36 * Math.max(0, a - 2));
        var z = -cw * (0.62 * Math.min(a, 1) + 0.34 * Math.max(0, a - 1));
        var ry = -s * Math.min(a, 1) * 34 - s * Math.max(0, Math.min(a, 2) - 1) * 10;
        var o = Math.max(0, Math.min(1, (half - Math.abs(x)) / (cw * 0.45), a > 2.6 ? 1 - (a - 2.6) / .5 : 1));
        var tf = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg)', op = o.toFixed(3), dim = Math.min(1, a * .62).toFixed(3);
        var L = last[i] || (last[i] = {}), c = C[i];
        /* a hidden card that wraps from one end of the circle to the other jumps there without sliding across */
        var jump = !instant && L.d != null && Math.abs(d - L.d) > n / 2;
        if (jump) { c.style.transition = 'none'; SH[i].style.transition = 'none'; }
        if (L.tf !== tf) { c.style.transform = tf; L.tf = tf; }
        if (L.op !== op) { c.style.opacity = op; L.op = op; }
        if (L.dim !== dim) { SH[i].style.opacity = dim; L.dim = dim; }
        if (jump) { void c.offsetWidth; c.style.transition = ''; SH[i].style.transition = ''; }
        L.d = d; zs.push(100 - Math.round(a * 10));
      }
      /* stacking order changes half-way through a turn, when the cards cross */
      clearTimeout(zT);
      var setZ = function () { zs.forEach(function (z, i) { if (last[i].zi !== z) { C[i].style.zIndex = z; last[i].zi = z; } }); };
      if (instant || !dur) setZ(); else zT = setTimeout(setZ, dur * .45);
    }
    function centre() { return ((Math.round(pos) % n) + n) % n; }

    /* -------- motion -------- */
    function livePos() {   /* where the cards are right now, also in the middle of a turn */
      if (!anim) return pos;
      var t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      return anim.from + (anim.to - anim.from) * ease(t);
    }
    function goTo(target, dur) {
      dur = reduce ? 0 : (dur || TURN);
      quiet();
      var from = livePos(); if (anim) clearTimeout(anim.t);
      stage.classList.remove('vc-now'); stage.style.setProperty('--vcd', dur + 'ms');
      pos = target;
      if (!dur) { anim = null; paint(true); settle(); return; }
      anim = { from: from, to: target, t0: performance.now(), dur: dur };
      paint(false, dur);
      anim.t = setTimeout(function () { anim = null; settle(); }, dur + 40);
    }
    function step(k) { goTo(Math.round(livePos()) + k); }
    function canPlay() { return !modalOpen && seen && !document.hidden && !(opt.paused && opt.paused()); }
    function resting() { return held || !canPlay(); }
    function schedule() {
      clearTimeout(timer); if (dead || reduce) return;
      timer = setTimeout(function () { if (dead) return; if (resting() || drag || anim) { schedule(); return; } step(1); }, DWELL);
    }

    /* -------- video: only the middle card loads and plays -------- */
    function quiet() {   /* while turning: the video only fades out and pauses (no loading work during the motion) */
      C.forEach(function (c) { c.classList.remove('mid'); }); GLOW.classList.remove('on');
      if (live.v) { C[live.i].classList.remove('playing'); live.v.pause(); }
    }
    function unload() {
      if (live.v) { var v = live.v, c = C[live.i]; c.classList.remove('playing', 'loading'); v.pause(); v.removeAttribute('src'); try { v.load(); } catch (e) {} v.remove(); }
      live = { i: -1, v: null };
    }
    function settle() {
      pos = Math.round(pos); var i = centre();
      C.forEach(function (c, k) { c.tabIndex = k === i ? 0 : -1; c.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      C.forEach(function (c, k) { c.classList.toggle('mid', k === i); }); GLOW.classList.add('on');
      if (live.i !== i) {
        unload();
        /* start loading the new video just after the motion has finished */
        var go = function () { if (!dead && !anim && !drag && centre() === i && live.i !== i) { load(i); sync(); } };
        if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 300 }); else setTimeout(go, 120);
      } else if (live.v) C[i].classList.add('playing');
      sync(); schedule();
    }
    function load(i) {
      var c = C[i], v = document.createElement('video'), info = cards[i];
      v.className = 'vc-video'; v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.setAttribute('aria-hidden', 'true');
      if (info.poster) v.poster = info.poster;
      c.classList.remove('err'); c.classList.add('loading');
      v.addEventListener('playing', function () { if (live.v !== v || anim || drag) return; c.classList.remove('loading'); c.classList.add('playing'); });
      v.addEventListener('timeupdate', function () { if (v.duration) c.querySelector('.vc-bar i').style.transform = 'scaleX(' + (v.currentTime / v.duration).toFixed(4) + ')'; });
      v.addEventListener('error', function () { if (live.v !== v) return; c.classList.remove('loading', 'playing'); c.classList.add('err'); });
      v.src = info.play;
      c.insertBefore(v, c.querySelector('.vc-shade'));
      live = { i: i, v: v };
    }
    function sync() {   /* play the middle video only while the carousel is on screen and nothing covers it */
      var v = live.v; if (!v || (M && v.parentNode && v.parentNode.classList.contains('vc-frame'))) return;
      if (!canPlay()) { if (!v.paused) v.pause(); }
      else if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    }

    /* -------- drag with mouse or finger -------- */
    var drag = null;
    stage.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId, hist: [[e.timeStamp, e.clientX]] };
    });
    stage.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }   /* the visitor is scrolling the page */
        if (Math.abs(dx) < 6) return;
        measure();
        drag.moved = true; drag.x = e.clientX; drag.p0 = livePos();
        if (anim) { clearTimeout(anim.t); anim = null; }
        el.classList.add('dragging'); stage.classList.add('vc-now'); quiet(); clearTimeout(timer);
        try { stage.setPointerCapture(e.pointerId); } catch (er) {}
        dx = 0;
      }
      pos = drag.p0 - dx / (cw * 0.74);
      drag.hist.push([e.timeStamp, e.clientX]); if (drag.hist.length > 6) drag.hist.shift();
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; paint(true); });
    });
    function endDrag() {
      if (!drag) return; var d = drag; drag = null;
      if (!d.moved) return;
      el.classList.remove('dragging'); cancelAnimationFrame(raf); raf = 0;
      var h = d.hist, a = h[0], b = h[h.length - 1], vel = (b[0] - a[0]) > 0 ? (b[1] - a[1]) / (b[0] - a[0]) : 0;   /* px per ms */
      var fling = Math.max(-2, Math.min(2, -vel * 180 / (cw * 0.74)));
      stage._dragEnd = performance.now();
      goTo(Math.round(pos + fling), 650);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', function () { if (drag && drag.moved) { drag.hist = [[0, 0]]; endDrag(); } drag = null; });

    /* -------- tap: a side card comes to the middle · the middle card opens large -------- */
    stage.addEventListener('click', function (e) {
      if (stage._dragEnd && performance.now() - stage._dragEnd < 260) return;
      var c = e.target.closest('.vc-card'); if (!c) return;
      var i = +c.dataset.i;
      if (i === centre() && !anim) openModal(i);
      else { var lp = livePos(); goTo(Math.round(lp) + Math.round(wrap(i - lp, n))); }
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); step(e.key === 'ArrowRight' ? 1 : -1); setTimeout(function () { C[centre()].focus({ preventScroll: true }); }, 30); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('vc-card')) { e.preventDefault(); openModal(centre()); }
    });
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') held = true; });
    el.addEventListener('pointerleave', function () { held = false; });

    /* -------- the large player: sound, full controls, X / Esc / tap outside closes -------- */
    /* The card's own video moves into the big player (and back on close): nothing is loaded or
       decoded again, so the opening is smooth and the video simply continues with sound. */
    var M = null, back = null, own = false;
    function openModal(i) {
      var info = cards[i], c = C[i];
      modalOpen = true; clearTimeout(timer);
      back = document.activeElement;
      M = document.createElement('div'); M.className = 'vc-modal'; M.setAttribute('role', 'dialog'); M.setAttribute('aria-modal', 'true'); M.setAttribute('aria-label', tr(info.title, lang) || tr(TXT.play, lang));
      M.innerHTML = '<button type="button" class="vc-x" aria-label="' + esc(tr(TXT.close, lang)) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>' +
        '<div class="vc-frame" style="--ar:' + info.w + '/' + info.h + '"><p class="vc-merr" hidden>' + esc(tr(TXT.error, lang)) + '</p></div>';
      var frame = M.querySelector('.vc-frame'), v;
      own = !(live.i === i && live.v && !c.classList.contains('err'));
      if (!own) { v = live.v; c.classList.remove('playing', 'loading'); }
      else {   /* the card's video is not ready yet: a new one */
        v = document.createElement('video'); v.preload = 'auto'; v.playsInline = true; v.setAttribute('playsinline', ''); v.loop = true;
        if (info.poster) v.poster = info.poster;
        v.src = info.play;
      }
      v.controls = true; v.removeAttribute('aria-hidden');
      v.addEventListener('error', showErr);
      frame.insertBefore(v, frame.firstChild);
      host.appendChild(M);
      v.muted = false; v.volume = 1;
      var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); });   /* if the browser refuses sound, start muted */
      M.querySelector('.vc-x').addEventListener('click', closeModal);
      M.addEventListener('click', function (e) { if (e.target === M) closeModal(); });
      requestAnimationFrame(function () { if (M) M.classList.add('on'); });
      M.querySelector('.vc-x').focus({ preventScroll: true });
    }
    function showErr() { if (M) M.querySelector('.vc-merr').removeAttribute('hidden'); }
    function closeModal() {
      if (!M) return false;
      var m = M, v = m.querySelector('video'); M = null;
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      v.removeEventListener('error', showErr);
      m.classList.remove('on');
      if (!own && live.v === v) {   /* the video goes back into its card, muted, and keeps playing there */
        v.controls = false; v.muted = true; v.setAttribute('aria-hidden', 'true');
        var c = C[live.i];
        setTimeout(function () { if (live.v === v) { c.insertBefore(v, c.querySelector('.vc-shade')); sync(); } m.remove(); }, reduce ? 0 : 300);
      } else {
        v.pause();
        setTimeout(function () { v.removeAttribute('src'); try { v.load(); } catch (e) {} m.remove(); }, reduce ? 0 : 300);
      }
      modalOpen = false;
      schedule();
      if (back && back.focus) back.focus({ preventScroll: true });
      return true;
    }
    /* Esc closes only the player (the project pop-up behind it stays open) */
    function onKey(e) {
      if (!M) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeModal(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopImmediatePropagation();   /* the pop-up's arrows must not change project */
    }
    document.addEventListener('keydown', onKey, true);

    /* -------- on screen? / tab hidden? -------- */
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { seen = es[0].isIntersecting; sync(); }, { root: opt.scroll || null, threshold: .35 }) : null;
    if (io) io.observe(el); else seen = true;
    function onVis() { sync(); }
    document.addEventListener('visibilitychange', onVis);
    var watch = setInterval(function () { if (!el.isConnected) { destroy(); return; } sync(); }, 700);   /* pop-up closed / re-rendered */
    var rt; function onResize() { clearTimeout(rt); rt = setTimeout(function () { measure(); stage.classList.add('vc-now'); paint(true); requestAnimationFrame(function () { stage.classList.remove('vc-now'); }); }, 120); }
    addEventListener('resize', onResize);

    function destroy() {
      if (dead) return; dead = true;
      clearTimeout(timer); clearInterval(watch); cancelAnimationFrame(raf); clearTimeout(zT); if (anim) clearTimeout(anim.t);
      if (io) io.disconnect();
      document.removeEventListener('keydown', onKey, true); document.removeEventListener('visibilitychange', onVis); removeEventListener('resize', onResize);
      if (M) { M.remove(); M = null; }
      unload();
    }

    stage.classList.add('vc-now'); measure(); paint(true);
    requestAnimationFrame(function () { measure(); paint(true); settle(); requestAnimationFrame(function () { stage.classList.remove('vc-now'); }); });
    return { destroy: destroy, next: function () { step(1); }, prev: function () { step(-1); } };
  }

  window.VideoCarousel = { mount: mount };
})();
