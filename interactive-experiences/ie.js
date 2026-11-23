/* =====================================================================
   PAGE SHELL — Interactive Experiences
   language switch (AR / EN, same as every page), footer "Back to the main page"
   (lands on the main page's Services in the same language), then starts the hero.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var lang = root.lang === 'ar' ? 'ar' : 'en';

  function applyLang() {
    document.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.getAttribute('data-' + lang); });
    var sw = document.getElementById('langBlob');
    if (sw) { sw.textContent = lang === 'ar' ? 'EN' : 'AR'; sw.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'); }
  }
  var sw = document.getElementById('langBlob');
  if (sw) sw.addEventListener('click', function () {
    lang = lang === 'ar' ? 'en' : 'ar';
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { sessionStorage.setItem('nehLang', lang); } catch (e) {}
    applyLang();
    if (window.IEHero && window.IEHero.fit) window.IEHero.fit();
  });
  var home = document.getElementById('ieHome');
  if (home) home.addEventListener('click', function () { try { sessionStorage.setItem('nehGo', 'services'); sessionStorage.setItem('nehLang', lang); } catch (e) {} });
  applyLang();

  if (window.IEHero) window.IEHero.play();
})();
