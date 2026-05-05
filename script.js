/* ============================================================
   Amruta Patwardhan Portfolio — Antigravity-Inspired Scripts
   Particles · GSAP Animations · Typing · Custom Cursor
   ============================================================ */

(function () {
  'use strict';

  // ── Wait for DOM & GSAP ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initThemeToggle();
    initParticles();
    initCustomCursor();
    initNavigation();
    initTypingEffect();
    initLogoTypingEffect();
    initGSAPAnimations();
    initStatCounters();
    initSkillBars();
    initFormHandler();
    initProjectCards();
  }

  /* ══════════════════════════════════════════════════════════
     PARTICLE SYSTEM
     ══════════════════════════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 180;

    mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 220 // blue-purple range
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
      const connectionColor = isLightMode ? '79, 70, 229' : '139, 92, 246';
      const particleLightness = isLightMode ? 55 : 70;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * (isLightMode ? 0.25 : 0.15);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${connectionColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, ${particleLightness}%, ${p.opacity + (isLightMode ? 0.2 : 0)})`;
        ctx.fill();
      }

      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => {
      resize();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    resize();
    createParticles();
    drawParticles();
  }

  /* ══════════════════════════════════════════════════════════
     CUSTOM CURSOR
     ══════════════════════════════════════════════════════════ */
  function initCustomCursor() {
    if (window.innerWidth < 768) return;

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let cx = -100, cy = -100;
    let fx = -100, fy = -100;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
    });

    function animate() {
      fx += (cx - fx) * 0.15;
      fy += (cy - fy) * 0.15;

      cursor.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
      follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;

      requestAnimationFrame(animate);
    }
    animate();

    // Hover effect on interactive elements
    const hoverables = document.querySelectorAll('a, button, .project-card, .skill-card, .resume-card, .contact-link, .stat-card');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
    });
  }

  /* ══════════════════════════════════════════════════════════
     NAVIGATION
     ══════════════════════════════════════════════════════════ */
  function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Scroll detection
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
      });

      // Close on link click
      links.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          links.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offset = nav ? nav.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === '#' + id) {
            if (scrollPos >= top && scrollPos < bottom) {
              link.style.color = '#a78bfa';
            } else {
              link.style.color = '';
            }
          }
        });
      });
    }

    window.addEventListener('scroll', updateActiveLink);
  }

  /* ══════════════════════════════════════════════════════════
     LOGO TYPING EFFECT
     ══════════════════════════════════════════════════════════ */
  function initLogoTypingEffect() {
    const el = document.getElementById('logo-typed-text');
    if (!el) return;

    const text = '< Amruta Patwardhan />';
    let charIndex = 0;
    let deleting = false;
    let delay = 150;

    function type() {
      if (!deleting) {
        charIndex++;
        delay = 100 + Math.random() * 50;

        if (charIndex === text.length) {
          delay = 4000;
          deleting = true;
        }
      } else {
        charIndex--;
        delay = 50;

        if (charIndex === 0) {
          deleting = false;
          delay = 1000;
        }
      }

      let currentText = text.substring(0, charIndex);
      let safeHtml = currentText.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      safeHtml = safeHtml.replace('&lt;', '<span class="logo-bracket">&lt;</span>');
      safeHtml = safeHtml.replace('/&gt;', '<span class="logo-bracket">/&gt;</span>');

      el.innerHTML = safeHtml;

      setTimeout(type, delay);
    }

    setTimeout(type, 1000);
  }

  /* ══════════════════════════════════════════════════════════
     TYPING EFFECT
     ══════════════════════════════════════════════════════════ */
  function initTypingEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const roles = [
      'PHP Laravel Developer',
      'Frontend Developer',
      'QA Engineer',
      'API Architect',
      'Full Stack Builder'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let delay = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        el.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        delay = 60 + Math.random() * 40;

        if (charIndex === currentRole.length) {
          delay = 2500; // pause at full text
          deleting = true;
        }
      } else {
        el.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        delay = 30;

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 400;
        }
      }

      setTimeout(type, delay);
    }

    // Start after hero animation
    setTimeout(type, 2000);
  }

  /* ══════════════════════════════════════════════════════════
     GSAP ANIMATIONS
     ══════════════════════════════════════════════════════════ */
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: just show everything
      document.querySelectorAll('.reveal-up, .reveal-text, .hero-title-word').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ── Hero Title Animation ──
    const heroWords = document.querySelectorAll('.hero-title-word');
    gsap.to(heroWords, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3
    });

    // ── Hero Content Stagger ──
    gsap.from('.hero-badge', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1
    });

    gsap.from('.hero-role', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.6
    });

    gsap.from('.hero-description', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.9
    });

    gsap.from('.hero-actions', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 2.2
    });

    gsap.from('.hero-scroll-indicator', {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 3
    });

    // ── Section Reveals ──
    document.querySelectorAll('.reveal-text').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    document.querySelectorAll('.reveal-up').forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 4) * 0.1
      });
    });

    // ── Timeline Line Animation ──
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
      gsap.from(timelineLine, {
        scrollTrigger: {
          trigger: timelineLine,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // ── Timeline Dot Pulse ──
    const timelineDot = document.querySelector('.timeline-dot');
    if (timelineDot) {
      gsap.from(timelineDot, {
        scrollTrigger: {
          trigger: timelineDot,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        scale: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: 0.4
      });
    }

    // ── Parallax on Hero Orbitals ──
    gsap.to('.orbital--1', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -120,
      opacity: 0
    });

    gsap.to('.orbital--2', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -80,
      opacity: 0
    });

    gsap.to('.orbital--3', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -60,
      opacity: 0
    });

    // ── Section Tag Slide-in ──
    document.querySelectorAll('.section-tag').forEach((tag) => {
      gsap.from(tag, {
        scrollTrigger: {
          trigger: tag,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     STAT COUNTERS
     ══════════════════════════════════════════════════════════ */
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => observer.observe(el));

    function animateCounter(el) {
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = easedProgress * target;

        if (isDecimal) {
          el.textContent = current.toFixed(1);
        } else {
          el.textContent = Math.floor(current).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ══════════════════════════════════════════════════════════
     SKILL BARS
     ══════════════════════════════════════════════════════════ */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill[data-width]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ══════════════════════════════════════════════════════════
     FORM HANDLER (Web3Forms API integration)
     ══════════════════════════════════════════════════════════ */
  function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      // Loading state
      btn.innerHTML = '<span>Sending...</span>';
      btn.style.pointerEvents = 'none';

      // Gather form data
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status == 200) {
          // Success state
          btn.innerHTML = '<span>Sent Successfully! ✓</span>';
          btn.style.background = 'linear-gradient(135deg, #059669, #34d399)';
          form.reset();
        } else {
          // API error state
          console.error('Web3Forms Error:', result);
          btn.innerHTML = '<span>Error Sending ✕</span>';
          btn.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
        }
      } catch (error) {
        // Network error state
        console.error('Network Error:', error);
        btn.innerHTML = '<span>Error Sending ✕</span>';
        btn.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
      }

      // Reset button after 3 seconds
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = 'auto';
        btn.style.background = '';
      }, 3000);
    });
  }

  /* ══════════════════════════════════════════════════════════
     THEME TOGGLE
     ══════════════════════════════════════════════════════════ */
  function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    const indicator = document.getElementById('theme-indicator');
    const root = document.documentElement;

    // Theme modes: dark (0), system (1), light (2)
    const themes = ['dark', 'system', 'light'];
    const stored = localStorage.getItem('portfolio-theme') || 'dark';

    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(mode) {
      const resolved = mode === 'system' ? getSystemTheme() : mode;

      if (resolved === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }

      // Update active button
      themeButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.theme === mode);
      });

      // Move indicator
      const pos = themes.indexOf(mode);
      if (indicator) indicator.setAttribute('data-pos', pos);

      localStorage.setItem('portfolio-theme', mode);
    }

    // Set initial theme
    applyTheme(stored);

    // Button clicks
    themeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
      });
    });

    // Listen for system theme changes (when in system mode)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      const current = localStorage.getItem('portfolio-theme');
      if (current === 'system') {
        applyTheme('system');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     PROJECT CARDS
     ══════════════════════════════════════════════════════════ */
  function initProjectCards() {
    const toggleButtons = document.querySelectorAll('.project-card-toggle');

    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.project-card');
        card.classList.toggle('expanded');

        // Let GSAP know the layout changed so ScrollTrigger can recalculate
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 500); // Wait for transition
        }
      });
    });
  }
})();
