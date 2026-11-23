/* =====================================================================
   SELECTED EXPERIENCES — reveal + interactions
   - each card "switches on" (fade up + light sweep + screen flicker) when it reaches the screen;
     a fast scroll can't leave anything empty: every item already above the screen's bottom is switched on
   - laptop: the case cards lean a little towards the mouse
   - starts the background lines (IEWavesField) and the quiz orb (IEQuizOrb)
   ===================================================================== */
(function () {
  'use strict';
  var sec = document.getElementById('ieWork');
  if (!sec) return;
  var items = [].slice.call(sec.querySelectorAll('.ie-on-item'));
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function check() {
    var vh = window.innerHeight || 800, n = 0;
    items.forEach(function (el) {
      if (el.classList.contains('is-on')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9) {                                   // on screen OR already scrolled past
        var d = r.bottom < 0 ? 0 : n++ * 110;                   // a small stagger, none for what was skipped
        if (reduced || d === 0) el.classList.add('is-on'); else setTimeout(function () { el.classList.add('is-on'); }, d);
      }
    });
    items = items.filter(function (el) { return !el.classList.contains('is-on'); });
    if (!items.length) { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
  }
  var tick = false;
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; check(); }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  check();

  /* laptop: a gentle lean towards the mouse */
  if (window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
    sec.querySelectorAll('.ie-case').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        c.style.transform = 'perspective(900px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 5).toFixed(2) + 'deg) translateY(-6px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }

  /* SELECTED state (the glow that runs round the frame): hover on laptop; on phones/tablets a tap selects a card
     (and un-selects the others) — tapping outside the cards clears it */
  var cards = [].slice.call(sec.querySelectorAll('.ie-case'));
  function select(c) { cards.forEach(function (x) { x.classList.toggle('is-sel', x === c); }); }
  cards.forEach(function (c) {
    c.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') c.classList.add('is-sel'); });
    c.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') c.classList.remove('is-sel'); });
    c.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') select(c); });
    c.addEventListener('focus', function () { select(c); });
    c.addEventListener('blur', function () { c.classList.remove('is-sel'); });
  });
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' && !(e.target.closest && e.target.closest('.ie-case'))) select(null);
  }, { passive: true });

  /* cards don't open anything yet (content + case-study pages come next) */
  sec.querySelectorAll('[data-soon]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  /* phone: the cards start closer to the hero — the section rises over the empty bottom of the hero,
     always stopping a safe distance under the hero's intro text (measured, so it fits every phone) */
  var hero = document.getElementById('ieHero'), intro = document.getElementById('ieIntro');
  function pull() {
    if (!hero || !intro) return;
    var lift = 0;
    if (window.innerWidth <= 760) {
      var hb = hero.getBoundingClientRect().bottom, ib = intro.getBoundingClientRect().bottom;
      lift = Math.max(0, Math.min(260, Math.round(hb - ib - 24)));
    }
    sec.style.marginTop = lift ? -lift + 'px' : '';
    sec.style.setProperty('--ie-lift', lift + 'px');
  }
  var pt = 0;
  window.addEventListener('resize', function () { clearTimeout(pt); pt = setTimeout(pull, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(pull, 50); });
  setTimeout(pull, 400); pull();
  var lb = document.getElementById('langBlob'); if (lb) lb.addEventListener('click', function () { setTimeout(pull, 60); });

  var wv = document.getElementById('ieWorkWaves');
  if (wv && window.IEWavesField) window.IEWavesField.mount(wv, sec);
})();
