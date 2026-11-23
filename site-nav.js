/* =====================================================================
   SITE MENU — shared by every page.
   Load it with defer and two attributes on the script element:
     home page:            src = site-nav.js     data-page = home
     page in a sub-folder: src = ../site-nav.js  data-page = brand | inter  data-base = ../
   Labels follow the page language (html[lang]) each time the menu opens.
   ===================================================================== */
(function () {
  'use strict';
  var me = document.currentScript, base = (me && me.getAttribute('data-base')) || '', page = (me && me.getAttribute('data-page')) || 'home';
  var root = document.documentElement;
  var T = {
    en: { menu: 'Open menu', close: 'Close menu', home: 'Home', services: 'Services', brand: 'Visual Systems and Advertising Campaigns',
      inter: 'Interactive Experiences', contact: 'Contact me', soon: 'Soon' },
    ar: { menu: 'فتح القائمة', close: 'إغلاق القائمة', home: 'الرئيسية', services: 'الخدمات', brand: 'الأنظمة البصرية والحملات الإعلانية',
      inter: 'تصميم التجارب التفاعلية', contact: 'تواصل معي', soon: 'قريبًا' }
  };
  var lang = function () { return root.lang === 'ar' ? 'ar' : 'en'; };
  var brandUrl = function () { return base + 'brand-identities/index.html' + (lang() === 'ar' ? '?lang=ar' : ''); };
  var interUrl = function () { return base + 'interactive-experiences/index.html' + (lang() === 'ar' ? '?lang=ar' : ''); };

  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nav-btn'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'siteNav');
  btn.innerHTML = '<i></i><i></i><i></i>';
  var panel = document.createElement('nav');
  panel.className = 'nav-panel'; panel.id = 'siteNav'; panel.setAttribute('aria-hidden', 'true');
  var scrim = document.createElement('div'); scrim.className = 'nav-scrim'; scrim.setAttribute('aria-hidden', 'true');
  scrim.addEventListener('click', function () { open(false); });
  document.body.appendChild(scrim); document.body.appendChild(panel); document.body.appendChild(btn);

  function render() {
    var t = T[lang()];
    btn.setAttribute('aria-label', root.classList.contains('nav-open') ? t.close : t.menu);
    panel.setAttribute('aria-label', t.services);
    panel.innerHTML = '<ul class="nav-list">' +
      '<li><a class="nav-top" href="' + (page === 'home' ? '#top' : base + 'index.html') + '" data-go="home">' + t.home + '</a></li>' +
      '<li><a class="nav-top" href="' + (page === 'home' ? '#services' : base + 'index.html#services') + '" data-go="services">' + t.services + '</a>' +
        '<ul class="nav-sub">' +
          '<li><a href="' + brandUrl() + '" data-go="brand"' + (page === 'brand' ? ' aria-current="page"' : '') + '>' + t.brand + '</a></li>' +
          '<li><a href="' + interUrl() + '" data-go="inter"' + (page === 'inter' ? ' aria-current="page"' : '') + '>' + t.inter + '</a></li>' +
        '</ul></li>' +
      '<li><a class="nav-top" href="' + (page === 'home' ? '#contact' : base + 'index.html#contact') + '" data-go="contact">' + t.contact + '</a></li></ul>';
  }
  function open(on) {
    root.classList.toggle('nav-open', on);
    btn.setAttribute('aria-expanded', String(on)); panel.setAttribute('aria-hidden', String(!on));
    if (on) { render(); var f = panel.querySelector('a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 350); }
    else btn.focus({ preventScroll: true });
    btn.setAttribute('aria-label', T[lang()][on ? 'close' : 'menu']);
  }
  btn.addEventListener('click', function () { open(!root.classList.contains('nav-open')); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('nav-open')) open(false); });
  panel.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    var go = a.getAttribute('data-go');
    try { if (go === 'brand' || go === 'inter') { sessionStorage.setItem('nehFrom', 'services'); sessionStorage.setItem('nehLang', lang()); }
          if ((go === 'services' || go === 'contact') && page !== 'home') sessionStorage.setItem('nehGo', go); } catch (x) {}
    if (go === 'brand' && page === 'brand' || go === 'inter' && page === 'inter') { e.preventDefault(); open(false); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (page === 'home' && (go === 'home' || go === 'services' || go === 'contact')) {
      e.preventDefault(); open(false);
      var el = go === 'home' ? null : document.getElementById(go);
      setTimeout(function () { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
    }
  });
  render();
})();
