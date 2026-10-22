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

  // Hero options. Each has portrait and landscape posters; video is optional.
  // The switcher button is for reviewing options with Samantha and is removed before launch.
  const heroes = [
    { name: 'Woodland stream', poster: 'hero-poster', video: true },
    // Anchored to the top so the mushrooms sit below the buttons on wide screens
    { name: 'Woodland edge', poster: 'hero-woodland', position: '50% 0%' },
    { name: 'Kitchen table', poster: 'hero-kitchen' },
    { name: 'Passion flower', poster: 'hero-passionflower' },
  ];
  const posterImg = document.getElementById('heroPoster');
  const posterSrc = document.getElementById('heroPosterPortrait');
  const switcher = document.getElementById('heroSwitch');
  const switchLabel = document.getElementById('heroSwitchLabel');
  const portrait = window.matchMedia('(orientation: portrait)').matches;
  let paused = false;

  const showHero = (i) => {
    const h = heroes[i];
    posterSrc.srcset = `assets/img/${h.poster}-portrait.webp`;
    posterImg.src = `assets/img/${h.poster}-landscape.webp`;
    posterImg.style.objectPosition = h.position || '';
    switchLabel.innerHTML = `Hero ${i + 1} of ${heroes.length}<span class="hero-switch__name">: ${h.name}</span>`;

    video.classList.remove('is-playing');
    video.pause();
    pause.hidden = true;
    if (!h.video || reduce.matches) { video.removeAttribute('src'); video.load(); return; }

    // Poster is the clip's first frame, so the video fades in over it with no jump
    video.addEventListener('playing', () => {
      video.classList.add('is-playing');
      pause.hidden = false;
    }, { once: true });
    video.src = portrait ? 'assets/video/hero-portrait.mp4' : 'assets/video/hero-landscape.mp4';
    paused = false;
    pause.classList.remove('is-paused');
    video.play().catch(() => {});
  };

  if (video) {
    let current = 0;
    try { current = Math.min(heroes.length - 1, Math.max(0, Number(localStorage.getItem('n2n-hero')) || 0)); } catch (e) {}
    const fromUrl = Number(new URLSearchParams(location.search).get('hero'));
    if (fromUrl >= 1 && fromUrl <= heroes.length) current = fromUrl - 1;
    showHero(current);

    switcher.hidden = false;
    switcher.addEventListener('click', () => {
      current = (current + 1) % heroes.length;
      try { localStorage.setItem('n2n-hero', String(current)); } catch (e) {}
      showHero(current);
    });

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

  // Contact form: validate in the browser, post as JSON to the Pages Function
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submit = form.querySelector('.form__submit');
    const say = (msg, isError) => { status.textContent = msg; status.classList.toggle('is-error', !!isError); };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll('input[required], textarea[required]').forEach((el) => {
        const bad = !el.value.trim() || (el.type === 'email' && !el.checkValidity());
        el.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { say('Please add your name, a valid email address and a message.', true); firstBad.focus(); return; }

      const data = Object.fromEntries(new FormData(form));
      if (!data['cf-turnstile-response']) { say('Please wait a moment for the spam check to finish, then try again.', true); return; }

      submit.disabled = true;
      say('Sending…');
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const out = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(out.error || 'send failed');
        form.reset();
        say('Thank you, your message has been sent. Samantha will be in touch.');
      } catch (err) {
        say('Sorry, that did not send. Please try again, or email Samantha@naturetonurturenutrition.co.uk.', true);
      } finally {
        submit.disabled = false;
        if (window.turnstile) window.turnstile.reset();
      }
    });
  }

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
