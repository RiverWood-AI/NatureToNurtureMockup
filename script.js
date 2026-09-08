(() => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  const video = document.getElementById('heroVideo');
  const pause = document.getElementById('heroPause');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Crossfade the nav from dark glass to cream glass over the first 140px of scroll
  let ticking = false;
  const paint = () => {
    const p = Math.min(1, Math.max(0, (window.scrollY - 20) / 140));
    nav.style.setProperty('--p', p.toFixed(3));
    nav.classList.toggle('nav--scrolled', p > 0.5);
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  paint();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    nav.classList.toggle('nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('nav--open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Hero video: pick portrait or landscape file. If the file is missing (placeholder stage)
  // the poster image stays visible and nothing else changes.
  if (video && !reduce.matches) {
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    const src = portrait ? 'assets/video/hero-portrait.mp4' : 'assets/video/hero-landscape.mp4';
    video.addEventListener('playing', () => {
      video.classList.add('is-playing');
      pause.hidden = false;
    }, { once: true });
    video.addEventListener('error', () => { video.remove(); }, { once: true });
    video.src = src;
    video.play().catch(() => {});

    let paused = false;
    pause.addEventListener('click', () => {
      paused = !paused;
      paused ? video.pause() : video.play();
      pause.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
      pause.classList.toggle('is-paused', paused);
    });
  }

  // Gentle reveal on section content, once
  const targets = document.querySelectorAll('.intro .wrap, .about__photo, .about__body, .services__head, .services__group, .steps li, .contact__grid > *');
  if ('IntersectionObserver' in window && !reduce.matches) {
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    targets.forEach((el) => io.observe(el));
  }

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
