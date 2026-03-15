/* ============================================================
   GEEK ROOM — MAIN JAVASCRIPT
   Custom cursor · Particles · Animations · Interactions
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. PAGE LOADER
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';
})();

/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const dot    = document.querySelector('.cursor-dot');
  const ring   = document.querySelector('.cursor-ring');
  const trails = [];
  const TRAIL_COUNT = 6;

  // Build trail elements
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.opacity = (1 - i / TRAIL_COUNT) * 0.4;
    t.style.width = t.style.height = (6 - i * 0.6) + 'px';
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (ring) { rx = mx; ry = my; }
  });

  // Smooth ring + trails
  let positions = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });

  function animateCursor() {
    if (ring) {
      const dx = mx - rx, dy = my - ry;
      rx += dx * 0.12; ry += dy * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    }
    // Trail positions cascade
    positions = [{ x: mx, y: my }, ...positions.slice(0, TRAIL_COUNT - 1)];
    trails.forEach((t, i) => {
      t.x += (positions[i].x - t.x) * 0.4;
      t.y += (positions[i].y - t.y) * 0.4;
      t.el.style.left = t.x + 'px'; t.el.style.top = t.y + 'px';
    });
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hover = () => document.body.classList.add('cursor-hover');
  const unhover = () => document.body.classList.remove('cursor-hover');
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [data-hover], .gallery-item, .event-card, .filter-btn')) hover();
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [data-hover], .gallery-item, .event-card, .filter-btn')) unhover();
  });
  document.addEventListener('mouseleave', unhover);
})();

/* ─────────────────────────────────────────
   3. STICKY NAVBAR
───────────────────────────────────────── */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Hamburger toggle
  const ham = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', () => {
      links.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      ham.classList.toggle('active');
      if (ham.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      ham.classList.remove('active');
      ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // Active link highlighting
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ─────────────────────────────────────────
   4. PARTICLE CANVAS BACKGROUND
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  const COLORS = ['#00ffe7', '#00b4ff', '#7b2fff', '#ff0080'];
  const COUNT  = Math.min(120, Math.floor(window.innerWidth / 12));

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.size   = Math.random() * 1.8 + 0.4;
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse  = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      // Repel from mouse
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.5;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
      if (this.y < -20 || this.x < -50 || this.x > W + 50) this.reset();
      return a;
    }
    draw(a) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = a;
      ctx.fill();
      // Glow
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  // Lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00ffe7';
          ctx.globalAlpha = (1 - d / 120) * 0.08;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Grid overlay
  function drawGrid() {
    ctx.globalAlpha = 0.025;
    ctx.strokeStyle = '#00ffe7';
    ctx.lineWidth   = 0.5;
    const size = 60;
    for (let x = 0; x < W; x += size) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += size) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    ctx.globalAlpha = 1;
    drawLines();
    particles.forEach(p => { const a = p.update(); p.draw(a); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─────────────────────────────────────────
   5. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────
   6. ANIMATED NUMBER COUNTER
───────────────────────────────────────── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      let start    = null;
      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────
   7. PARALLAX ON HERO ELEMENTS
───────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const layers = hero.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    layers.forEach(l => {
      const speed = parseFloat(l.dataset.parallax) || 0.3;
      l.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   8. GALLERY LIGHTBOX
───────────────────────────────────────── */
(function initLightbox() {
  const lb   = document.querySelector('.lightbox');
  const img  = lb?.querySelector('img');
  const clos = lb?.querySelector('.lightbox-close');
  const prev = lb?.querySelector('.lightbox-prev');
  const next = lb?.querySelector('.lightbox-next');
  if (!lb || !img) return;

  const items = Array.from(document.querySelectorAll('.gallery-item img'));
  let current = 0;

  function open(idx) {
    current = idx;
    img.src = items[idx].src;
    img.alt = items[idx].alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showPrev() { open((current - 1 + items.length) % items.length); }
  function showNext() { open((current + 1) % items.length); }

  items.forEach((im, i) => im.parentElement.addEventListener('click', () => open(i)));
  clos?.addEventListener('click', close);
  prev?.addEventListener('click', showPrev);
  next?.addEventListener('click', showNext);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* ─────────────────────────────────────────
   9. GALLERY FILTER
───────────────────────────────────────── */
(function initGalleryFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity   = match ? '' : '0.15';
        item.style.transform = match ? '' : 'scale(0.95)';
        item.style.filter    = match ? '' : 'grayscale(1)';
        item.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
})();

/* ─────────────────────────────────────────
  10. CONTACT FORM
───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const ok  = form.querySelector('.form-success');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.style.display = 'none';
      if (ok) ok.classList.add('show');
      form.querySelectorAll('input, textarea').forEach(i => i.value = '');
    }, 1500);
  });
})();

/* ─────────────────────────────────────────
  11. LOGIN FORM
───────────────────────────────────────── */
(function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-login');
    btn.textContent = 'Authenticating...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = '✓ ACCESS GRANTED';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, #39ff14, #00ffe7)';
    }, 1600);
  });
})();

/* ─────────────────────────────────────────
  12. TYPED TEXT EFFECT
───────────────────────────────────────── */
(function initTyped() {
  const el = document.querySelector('[data-typed]');
  if (!el) return;
  const phrases = el.dataset.typed.split('|');
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const cur = phrases[pi];
    el.textContent = deleting ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    let delay = deleting ? 50 : 90;
    if (!deleting && ci === cur.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }
    setTimeout(type, delay);
  }
  type();
})();

/* ─────────────────────────────────────────
  13. CARD TILT EFFECT
───────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.event-card, .feature-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────
  14. SMOOTH SECTION TRANSITIONS (hash nav)
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─────────────────────────────────────────
  15. NEON GLOW MOUSE TRAIL (page bg)
───────────────────────────────────────── */
(function initGlowTrail() {
  const glows = [];
  const MAX   = 8;
  document.addEventListener('click', e => {
    const g = document.createElement('div');
    g.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:60px; height:60px; border-radius:50%;
      background:radial-gradient(circle, rgba(0,255,231,0.3) 0%, transparent 70%);
      transform:translate(-50%,-50%) scale(0);
      pointer-events:none; z-index:9990;
      transition: transform 0.5s ease, opacity 0.5s ease;
    `;
    document.body.appendChild(g);
    requestAnimationFrame(() => { g.style.transform = 'translate(-50%,-50%) scale(3)'; g.style.opacity = '0'; });
    setTimeout(() => g.remove(), 600);
  });
})();
