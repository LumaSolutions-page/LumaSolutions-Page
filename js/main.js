/* ==========================================================================
   Luma Solutions — interacciones
   ========================================================================== */

/* ── CONFIGURACIÓN ─────────────────────────────────────────────────────────
   Completá estos datos cuando los tengan. Mientras estén vacíos, los botones
   y enlaces correspondientes permanecen ocultos en la página.
   - whatsapp:  número con código de país, solo dígitos. Ej.: '50688887777'
   - email:     ej. 'hola@lumasolutionscr.com'
   - instagram: URL completa. Ej.: 'https://instagram.com/lumasolutionscr'
   - showPrices: true para mostrar los precios a todos los visitantes.
     Con false, se pueden ver en modo vista previa: lumasolutionscr.com/?precios=1
   ────────────────────────────────────────────────────────────────────────── */
const LUMA_CONFIG = {
  whatsapp: '',
  whatsappMessage: 'Hola Luma, quiero más información.',
  email: '',
  instagram: '',
  showPrices: false,
};

window.__lumaReady = true;

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── CONTACTOS Y PRECIOS ─────────────────────────────────────────────────── */
function applyConfig() {
  const cfg = LUMA_CONFIG;
  const links = {
    whatsapp: cfg.whatsapp && `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(cfg.whatsappMessage)}`,
    email: cfg.email && `mailto:${cfg.email}`,
    instagram: cfg.instagram,
  };

  document.querySelectorAll('[data-contact]').forEach((el) => {
    const url = links[el.dataset.contact];
    if (!url) return;
    const link = el.matches('[data-contact-link]') ? el : el.querySelector('[data-contact-link]');
    if (link) link.href = url;
    if (el.dataset.contact === 'email') {
      el.querySelectorAll('[data-contact-text]').forEach((t) => { t.textContent = cfg.email; });
    }
    if (el.dataset.contact === 'whatsapp') {
      link?.setAttribute('target', '_blank');
      link?.setAttribute('rel', 'noopener');
    }
    el.hidden = false;
  });

  document.querySelectorAll('[data-contact-group]').forEach((group) => {
    group.hidden = !group.querySelector('[data-contact]:not([hidden])');
  });

  if (cfg.showPrices || new URLSearchParams(location.search).has('precios')) {
    root.classList.add('show-prices');
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

/* ── HEADER Y MENÚ MÓVIL ─────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  const toggle = header.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 16);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('open', open);
    header.classList.toggle('menu-active', open);
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Resalta en el menú la sección visible
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
}

/* ── APARICIÓN AL HACER SCROLL ───────────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* ── LUZ QUE SIGUE AL MOUSE EN TARJETAS ──────────────────────────────────── */
function initCardSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ── PESTAÑAS (planes) ───────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];

    const activate = (tab, focus = false) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !selected;
        if (selected) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth; // reinicia la animación
          panel.classList.add('is-entering');
        }
      });
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  });
}

/* ── CONTADORES ──────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
}

/* ── CHAT ANIMADO DEL HERO ───────────────────────────────────────────────── */
function initHeroChat() {
  const chat = document.getElementById('hero-chat');
  if (!chat || reduceMotion) return;

  const messages = [...chat.querySelectorAll('.msg:not(.typing)')];
  const typing = chat.querySelector('.typing');
  const body = chat.querySelector('.chat-body');
  chat.classList.add('is-animated');

  let timer = null;
  let running = false;
  let step = 0;

  const wait = (ms, fn) => { timer = setTimeout(fn, ms); };

  const next = () => {
    if (!running) return;
    if (step >= messages.length) {
      wait(4200, () => {
        messages.forEach((m) => m.classList.remove('show'));
        step = 0;
        wait(600, next);
      });
      return;
    }
    const msg = messages[step];
    const isBot = msg.classList.contains('msg-bot');
    if (isBot) {
      body.appendChild(typing); // el indicador siempre va al final
      typing.classList.add('show');
      wait(1300, () => {
        typing.classList.remove('show');
        msg.classList.add('show');
        step += 1;
        wait(1100, next);
      });
    } else {
      msg.classList.add('show');
      step += 1;
      wait(900, next);
    }
  };

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; wait(700, next); }
    else if (!entry.isIntersecting && running) { running = false; clearTimeout(timer); }
  });
  io.observe(chat);
}

/* ── PARTÍCULAS DEL HERO ─────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['0,201,177', '124,108,240', '34,201,122'];
  const LINK_DIST = 110;

  let w = 0, h = 0, particles = [], raf = null, inView = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.floor((w * h) / 16000));
    particles = Array.from({ length: count }, () => spawn(true));
  };

  const spawn = (initial) => ({
    x: Math.random() * w,
    y: initial ? Math.random() * h : h + 10,
    r: Math.random() * 1.4 + 0.4,
    a: Math.random() * 0.45 + 0.15,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -Math.random() * 0.3 - 0.08,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 0,
    max: 300 + Math.random() * 400,
  });

  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life > p.max || p.y < -10) particles[i] = spawn(false);
    }
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          ctx.strokeStyle = `rgba(0,201,177,${(1 - Math.sqrt(d2) / LINK_DIST) * 0.07})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      const fade = Math.min(1, p.life / 40, (p.max - p.life) / 40);
      ctx.fillStyle = `rgba(${p.c},${p.a * Math.max(fade, 0)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (!raf && inView && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

  resize();
  start();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    inView ? start() : stop();
  }).observe(canvas);
}

/* ── FORMULARIO DE CONTACTO ──────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const success = document.getElementById('form-success');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit.querySelector('.btn-label');
  const interest = document.getElementById('f-interes');
  const planInput = document.getElementById('f-plan');
  const planNote = document.getElementById('plan-note');

  // Botones "Solicitar información" / "Quiero…": preseleccionan el interés y el plan
  document.querySelectorAll('a[data-interest]').forEach((link) => {
    link.addEventListener('click', () => {
      interest.value = link.dataset.interest;
      clearError(interest);
      planInput.value = link.dataset.plan || '';
      planNote.hidden = !link.dataset.plan;
      if (link.dataset.plan) planNote.textContent = `Plan de interés: ${link.dataset.plan}`;
    });
  });

  const messages = {
    valueMissing: 'Este campo es obligatorio.',
    typeMismatch: 'Revisá que el correo sea válido.',
  };

  function showError(field) {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.add('invalid');
    let err = wrap.querySelector('.field-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field-error';
      err.id = `${field.id}-error`;
      wrap.appendChild(err);
      field.setAttribute('aria-describedby', err.id);
    }
    err.textContent = field.validity.typeMismatch ? messages.typeMismatch : messages.valueMissing;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.remove('invalid');
    wrap.querySelector('.field-error')?.remove();
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => { if (field.value && !field.checkValidity()) showError(field); });
    field.addEventListener('input', () => { if (field.checkValidity()) clearError(field); });
    field.addEventListener('change', () => { if (field.checkValidity()) clearError(field); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('error');

    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    if (invalid.length) {
      invalid.forEach(showError);
      invalid[0].focus();
      return;
    }

    submit.disabled = true;
    label.textContent = 'Enviando…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      planNote.hidden = true;
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      status.textContent = 'No pudimos enviar tu solicitud. Revisá tu conexión e intentá de nuevo.';
      status.classList.add('error');
    } finally {
      submit.disabled = false;
      label.textContent = 'Enviar solicitud';
    }
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    document.getElementById('f-nombre').focus();
  });
}

/* ── INICIO ──────────────────────────────────────────────────────────────── */
applyConfig();
initHeader();
initReveal();
initCardSpotlight();
initTabs();
initCounters();
initHeroChat();
initParticles();
initContactForm();
