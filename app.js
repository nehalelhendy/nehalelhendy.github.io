(() => {
  const root = document.documentElement;
  const langSwitch = document.getElementById('languageSwitch');
  const scrollProgress = document.getElementById('scrollProgress');
  let language = 'en';

  function setLanguage(next) {
    language = next;
    root.lang = next;
    root.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-arabic', next === 'ar');
    document.querySelectorAll('[data-en][data-ar]').forEach((el) => {
      const value = el.dataset[next];
      if (value != null) { if (el.hasAttribute('data-html')) el.innerHTML = value; else el.textContent = value; }
    });
    langSwitch.querySelector('.lang-en').classList.toggle('lang-active', next === 'en');
    langSwitch.querySelector('.lang-ar').classList.toggle('lang-active', next === 'ar');
    langSwitch.setAttribute('aria-pressed', String(next === 'ar'));
    langSwitch.setAttribute('aria-label', next === 'en' ? 'Switch to Arabic' : 'Switch to English');
    document.title = next === 'en' ? 'Nehal El Hendy — Art Director & Senior Graphic Designer' : 'نهال الهندي — مخرجة فنية ومصممة جرافيك أولى';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = next === 'en' ? 'Nehal El Hendy — Art Director & Senior Graphic Designer. A colorful, interactive portfolio experience.' : 'نهال الهندي — مخرجة فنية ومصممة جرافيك أولى. تجربة بورتفوليو ملونة وتفاعلية.';
  }
  window.__siteSetLang = l => { setLanguage(l); if (window.__aboutLang) window.__aboutLang(l); };   // the hero's AR/EN blob switches the whole site
  langSwitch.addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));

  // the thin progress line at the top (the bottom pager / back-to-top capsule was removed on Nov 23)
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    scrollProgress.style.setProperty('--scroll-progress', `${p * 100}%`);   // Nov 23: on the bar itself (on <html> the whole page recalculated its style on every scroll)
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Nov 23: looping animations of About, Experience + Toolbox and Skills rest while their section is off screen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('neh-off', !e.isIntersecting)), { rootMargin: '200px 0px 200px 0px' });
    ['about', 'experience', 'skills'].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Default language is English as confirmed by Nehal.
  setLanguage('en');
})();
