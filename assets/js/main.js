/* ================================================================
   KAUSA — main.js
   ================================================================ */

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── NAV: scroll tint ─── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(11,15,26,0.97)'
    : 'rgba(11,15,26,0.7)';
});

/* ─── NAV: mobile burger ─── */
const burger    = document.querySelector('.nav-burger');
const navLinks  = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ─── CONTACT FORM ─── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = '✓ Mensaje enviado — nos contactaremos pronto';
    btn.style.background = '#6BE585';
    btn.style.boxShadow  = '0 0 30px rgba(107,229,133,0.3)';
    setTimeout(() => {
      btn.textContent   = 'Enviar mensaje';
      btn.style.background = '';
      btn.style.boxShadow  = '';
      contactForm.reset();
    }, 4000);
  });
}

/* ─── SERVICE CARD CTA scroll ─── */
const serviceCta = document.querySelector('.service-card--cta');
if (serviceCta) {
  serviceCta.addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ─── DIAGNOSIS CTA scroll ─── */
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ================================================================
   VALUE RING — bouncing physics for K and label
   Both elements bounce independently inside the circle.
   ================================================================ */
(function initBouncingRing() {
  const inner   = document.querySelector('.value-ring-inner');
  const kEl     = inner && inner.querySelector('.ring-k');
  const labelEl = inner && inner.querySelector('.ring-label');
  if (!kEl || !labelEl) return;

  const innerR = inner.offsetWidth / 2;  // ~190px

  // Collision radius = half element size + small buffer so it never clips the wall
  const kR     = kEl.offsetWidth     / 2 + 8;   // ~52px
  const labelR = labelEl.offsetWidth / 2 + 10;  // ~85px (text is wide)

  const elements = [
    { el: kEl,     maxD: innerR - kR,     x:  10, y: -60, vx:  0.85, vy:  0.65 },
    { el: labelEl, maxD: innerR - labelR, x: -20, y:  55, vx: -0.70, vy: -0.55 },
  ];

  function step() {
    elements.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;

      const dist = Math.sqrt(o.x * o.x + o.y * o.y);
      if (dist >= o.maxD) {
        const nx  = o.x / dist, ny = o.y / dist;
        const dot = o.vx * nx  + o.vy * ny;
        o.vx -= 2 * dot * nx;
        o.vy -= 2 * dot * ny;
        o.x = nx * (o.maxD - 1);
        o.y = ny * (o.maxD - 1);
      }

      o.el.style.transform =
        `translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`;
    });

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

/* ================================================================
   SOCIAL PROOF — staggered reveal + count-up
   ================================================================ */
(function initSocialProof() {
  const items = document.querySelectorAll('.proof-item');
  const nums  = document.querySelectorAll('.proof-num[data-count]');

  // Count-up helper
  function countUp(el) {
    const target   = +el.dataset.count;
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const duration = 1400;
    const start    = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Trigger once the strip enters the viewport
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger each item
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 140);
      });

      // Start count-up with a small delay so items are visible first
      setTimeout(() => nums.forEach(countUp), 300);

      observer.disconnect();
    });
  }, { threshold: 0.4 });

  const strip = document.querySelector('#social-proof');
  if (strip) observer.observe(strip);
})();
