/* ============================================
   MARCELLO TECH — MAIN JS (FINAL)
   ============================================ */

/* ---- STATE ---- */
let currentPage     = 'home';
let isTransitioning = false;
let typingTimer     = null;

/* ---- DOM REFS ---- */
const navbar         = document.getElementById('navbar');
const pageTransition = document.getElementById('pageTransition');
const navLinks       = document.getElementById('navLinks');
const hamburger      = document.getElementById('hamburger');

/* ============================================================
   BOOT (Entry Point)
   ============================================================ */
function bootApp() {
  updateNavActive('home');
  initHamburger();
  initCursorGlow();
  setPageHeroColors();
  initImageLoading();
  initRevealAnimations();
  animateCounters();
  triggerHomeAnimations();
  initTypingEffect();
  setTimeout(handleScrollReveal, 150);

  // Outside-click closes mobile menu
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    }
  });

  // ESC closes mobile menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    }
  });

  console.log('%c MARCELLO TECH', 'color:#3b82f6;font-size:24px;font-weight:bold;');
  console.log('%cLearn Today. Lead Tomorrow.', 'color:#8b5cf6;font-size:14px;');
}

/* ============================================================
   NAVIGATION / SPA ROUTING
   ============================================================ */
function navigateTo(page) {
  if (page === currentPage || isTransitioning) return;
  isTransitioning = true;

  // Close mobile menu
  navLinks.classList.remove('mobile-open');
  hamburger.classList.remove('open');

  // Slide overlay in
  if (pageTransition) {
    pageTransition.classList.add('active');
  }

  setTimeout(() => {
    // Swap pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    currentPage = page;
    updateNavActive(page);
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Slide overlay out
    setTimeout(() => {
      if (pageTransition) {
        pageTransition.classList.remove('active');
        pageTransition.classList.add('exit');
      }

      setTimeout(() => {
        if (pageTransition) {
          pageTransition.classList.remove('exit');
        }
        isTransitioning = false;

        // Re-init animations for new page
        initRevealAnimations();
        setTimeout(handleScrollReveal, 60);

        if (page === 'home') {
          animateCounters();
          triggerHomeAnimations();
          initTypingEffect();
        }
      }, 550);
    }, 80);
  }, 460);
}

function updateNavActive(page) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const link = document.getElementById('nav-' + page);
  if (link) link.classList.add('active');
}

function toggleMobileMenu() {
  navLinks.classList.toggle('mobile-open');
  hamburger.classList.toggle('open');
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  handleScrollReveal();
}, { passive: true });

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initRevealAnimations() {
  const sel = `#page-${currentPage} .reveal,
               #page-${currentPage} .reveal-left,
               #page-${currentPage} .reveal-right`;

  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.remove('visible');
    el.style.transitionDelay = (i * 0.07) + 's';
  });

  setTimeout(handleScrollReveal, 120);
}

function handleScrollReveal() {
  const winH = window.innerHeight;
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (el.getBoundingClientRect().top < winH - 60) {
      el.classList.add('visible');
    }
  });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
    const target   = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;
    counter.textContent = '0';

    const tick = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(tick); }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

/* ============================================================
   TYPING EFFECT (Hero)
   ============================================================ */
function initTypingEffect() {
  if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }

  const lines = [
    'Tech Journey',
    'AI & ML Mastery',
    'Data Science Career',
    'Full Stack Skills',
    'Cyber Security Path',
  ];

  const el = document.querySelector('.hero-title-gradient');
  if (!el) return;

  // Add blinking cursor via pseudo-element trick
  el.style.borderRight = '2px solid #3b82f6';
  el.style.paddingRight = '4px';
  el.style.animation = 'none';

  let idx = 0, ch = 0, deleting = false;

  function tick() {
    const line = lines[idx];
    if (!deleting) {
      el.textContent = line.slice(0, ch + 1);
      ch++;
      if (ch === line.length) {
        deleting = true;
        typingTimer = setTimeout(tick, 2400);
        return;
      }
    } else {
      el.textContent = line.slice(0, ch - 1);
      ch--;
      if (ch === 0) {
        deleting = false;
        idx = (idx + 1) % lines.length;
      }
    }
    typingTimer = setTimeout(tick, deleting ? 45 : 85);
  }

  typingTimer = setTimeout(tick, 1200);
}

/* ============================================================
   3D TILT ON CARDS
   ============================================================ */
function initTiltEffect() {
  document.querySelectorAll(
    '#page-home .home-course-card, #page-home .testimonial-card'
  ).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  6;
      card.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   FLOATING GEOMETRIC SHAPES (Hero bg)
   ============================================================ */
function createFloatingShapes() {
  const container = document.querySelector('.hero .hero-bg-orbs');
  if (!container) return;
  // Remove old shapes first
  container.querySelectorAll('.float-shape').forEach(s => s.remove());

  const glyphs = ['+', '·', '∘', '⸰'];
  for (let i = 0; i < 9; i++) {
    const el = document.createElement('div');
    el.className = 'float-shape';
    el.textContent = glyphs[i % glyphs.length];
    const size  = Math.random() * 24 + 12;
    const delay = Math.random() * 5;
    const dur   = Math.random() * 7 + 6;
    el.style.cssText = `
      position:absolute; pointer-events:none; user-select:none; z-index:0;
      color:rgba(59,130,246,${(Math.random() * 0.12 + 0.04).toFixed(2)});
      font-size:${size}px;
      left:${Math.random() * 95}%;
      top:${Math.random() * 95}%;
      animation:float ${dur}s ease-in-out ${delay}s infinite;
    `;
    container.appendChild(el);
  }
}

/* ============================================================
   PAGE HERO ORB COLOURS
   ============================================================ */
function setPageHeroColors() {
  const map = {
    courses : ['#3b82f6', '#8b5cf6'],
    about   : ['#60a5fa', '#3b82f6'],
    contact : ['#8b5cf6', '#06b6d4'],
  };
  Object.entries(map).forEach(([page, [c1, c2]]) => {
    const o1 = document.querySelector(`.${page}-page-hero .orb-1`);
    const o2 = document.querySelector(`.${page}-page-hero .orb-2`);
    if (o1) o1.style.background = `radial-gradient(circle, ${c1}, transparent)`;
    if (o2) o2.style.background = `radial-gradient(circle, ${c2}, transparent)`;
  });
}

/* ============================================================
   HAMBURGER ANIMATION STYLES
   ============================================================ */
function initHamburger() {
  const s = document.createElement('style');
  s.textContent = `
    .nav-hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    .nav-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
    .nav-hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
  `;
  document.head.appendChild(s);
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:320px; height:320px; border-radius:50%; pointer-events:none;
    background:radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
    z-index:0; transform:translate(-50%,-50%); will-change:left,top;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function loop() {
    gx += (mx - gx) * 0.1;
    gy += (my - gy) * 0.1;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ============================================================
   IMAGE FADE-IN ON LOAD
   ============================================================ */
function initImageLoading() {
  document.querySelectorAll('img').forEach(img => {
    img.style.cssText += 'opacity:0;transition:opacity 0.6s ease;';
    const show = () => { img.style.opacity = '1'; };
    if (img.complete && img.naturalWidth) { show(); return; }
    img.addEventListener('load',  show);
    img.addEventListener('error', () => {
      // Graceful fallback
      img.style.display = 'none';
      const fb = document.createElement('div');
      fb.style.cssText = `
        width:100%; height:100%; min-height:200px;
        background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.15));
        display:flex; align-items:center; justify-content:center;
        font-size:3rem; border-radius:inherit;
      `;
      fb.textContent = '';
      img.parentNode.insertBefore(fb, img.nextSibling);
    });
  });
}

/* ============================================================
   FAQ TOGGLE
   ============================================================ */
function toggleFaq(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

/* ============================================================
   FORM SUBMISSION
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();

  const btn      = document.getElementById('submitBtn');
  const form     = document.getElementById('registrationForm');
  const first    = document.getElementById('firstName').value.trim();
  const last     = document.getElementById('lastName').value.trim();
  const email    = document.getElementById('email').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const course   = document.getElementById('course').value;

  if (!first || !last || !email || !phone || !course) {
    showToast('[Warning]', 'Missing Fields', 'Please fill in all required fields.', '#f59e0b');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('[Error]', 'Invalid Email', 'Please enter a valid email address.', '#ef4444');
    return;
  }
  if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
    showToast('[Error]', 'Invalid Phone', 'Please enter a valid 10-digit phone number.', '#ef4444');
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.style.opacity = '0.75';
  btn.innerHTML = `<span style="display:inline-block;animation:rotate-slow 0.6s linear infinite;"></span>&nbsp; Submitting...`;

  setTimeout(() => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerHTML = 'Submit Registration';
    form.reset();
    showToast('[Success]', 'Registration Submitted!', `Thanks ${first}! We'll contact you within 24 hours.`, '#10b981');
  }, 1800);
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(icon, title, msg, color) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('.toast-icon').textContent  = icon;
  t.querySelector('.toast-title').textContent = title;
  t.querySelector('.toast-msg').textContent   = msg;
  t.style.borderColor = color + '55';
  t.style.boxShadow   = `0 0 30px ${color}33, 0 20px 50px rgba(0,0,0,0.5)`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

/* ============================================================
   TRIGGER HOME-SPECIFIC EFFECTS
   ============================================================ */
function triggerHomeAnimations() {
  initTiltEffect();
  createFloatingShapes();
}

/* ============================================================
   GLOBAL EXPOSE
   ============================================================ */
window.navigateTo       = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.handleFormSubmit = handleFormSubmit;
window.toggleFaq        = toggleFaq;

/* ============================================================
   ENTRY POINT
   ============================================================ */
document.addEventListener('DOMContentLoaded', bootApp);
