/* ============================================================
   RentiSure — Premium Animation Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. SCROLL PROGRESS BAR
  ---------------------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #10B981, #059669, #34d399);
    z-index: 9999; transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(16,185,129,0.6);
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  }, { passive: true });


  /* ----------------------------------------------------------
     2. ANIMATED BACKGROUND ORBS (hero section)
  ---------------------------------------------------------- */
  const hero = document.getElementById('hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    canvas.style.cssText = `
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0; opacity: 0.55;
    `;
    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let mouse = { x: 0, y: 0 };
    let animFrame;

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 600,
      r: 120 + Math.random() * 180,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: i % 2 === 0
        ? `rgba(16,185,129,${0.06 + Math.random() * 0.08})`
        : `rgba(5,150,105,${0.04 + Math.random() * 0.06})`,
    }));

    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    function drawOrbs() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((orb, i) => {
        // Gentle mouse attraction
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        orb.x += orb.dx + dx * 0.0008;
        orb.y += orb.dy + dy * 0.0008;

        // Bounce off edges
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      animFrame = requestAnimationFrame(drawOrbs);
    }
    drawOrbs();
  }


  /* ----------------------------------------------------------
     3. STAGGERED REVEAL ON SCROLL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if section has multiple cards
        const cards = entry.target.querySelectorAll('.reveal-child');
        if (cards.length) {
          cards.forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('active');
            }, idx * 120);
          });
        }
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     4. ANIMATED COUNTERS (social proof numbers)
  ---------------------------------------------------------- */
  function animateCounter(el) {
    const raw = el.dataset.target || el.textContent;
    const isNaira = raw.includes('₦');
    const isPercent = raw.includes('%');
    const isPlus = raw.includes('+');
    const numStr = raw.replace(/[₦%+,M]/g, '');
    const isMillion = raw.includes('M');
    const target = parseFloat(numStr);
    const duration = 2000;
    const start = performance.now();

    function format(val) {
      if (isMillion) return `${isNaira ? '₦' : ''}${val.toFixed(0)}M${isPlus ? '+' : ''}`;
      if (isPercent) return `${Math.floor(val)}%`;
      return `${isPlus ? '' : ''}${Math.floor(val).toLocaleString()}${isPlus ? '+' : ''}`;
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = format(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));


  /* ----------------------------------------------------------
     5. SCORE RING — SVG draw-on animation
  ---------------------------------------------------------- */
  const scoreSection = document.getElementById('rentscore');
  if (scoreSection) {
    const scoreNum = scoreSection.querySelector('#score-counter');
    if (scoreNum) {
      const scoreObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const target = 852;
          const duration = 2200;
          const t0 = performance.now();
          function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            scoreNum.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          scoreObserver.unobserve(entries[0].target);
        }
      }, { threshold: 0.4 });
      scoreObserver.observe(scoreSection);
    }
  }


  /* ----------------------------------------------------------
     6. MAGNETIC BUTTONS
  ---------------------------------------------------------- */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0) scale(1)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });


  /* ----------------------------------------------------------
     7. RENT SLIDER — live update
  ---------------------------------------------------------- */
  const slider = document.getElementById('rent-slider');
  const rentDisplay = document.getElementById('rent-value-display');
  const monthlyDisplay = document.getElementById('monthly-display');

  if (slider) {
    function updateSlider() {
      const val = parseInt(slider.value);
      const monthly = Math.round((val / 12) * 1.075);
      rentDisplay.textContent = `₦${val.toLocaleString()}`;
      monthlyDisplay.textContent = `₦${monthly.toLocaleString()}`;
      // Animate the thumb glow
      slider.style.setProperty('--thumb-glow', `0 0 12px rgba(16,185,129,0.7)`);
    }
    slider.addEventListener('input', updateSlider);
    updateSlider();
  }


  /* ----------------------------------------------------------
     8. WAITLIST FORM
  ---------------------------------------------------------- */
  const waitlistForm = document.querySelector('#waitlist-form');
  const feedback = document.querySelector('#form-feedback');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = waitlistForm.querySelector('input[type="email"]').value;
      const btn = waitlistForm.querySelector('button[type="submit"]');
      btn.textContent = '✓ You\'re on the list!';
      btn.style.background = '#10B981';
      btn.disabled = true;
      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.innerHTML = `<p class="text-primary font-semibold">🎉 <strong>${email}</strong> is on the waitlist. We'll be in touch!</p>`;
      }
    });
  }


  /* ----------------------------------------------------------
     9. SMOOTH ANCHOR SCROLLING
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ----------------------------------------------------------
     10. TILT EFFECT on feature cards
  ---------------------------------------------------------- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
  });


  /* ----------------------------------------------------------
     11. TYPING HEADLINE EFFECT
  ---------------------------------------------------------- */
  const typingEl = document.getElementById('typing-word');
  if (typingEl) {
    const words = ['Stress.', 'Scams.', 'Delays.', 'Anxiety.'];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      if (!deleting) {
        typingEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typingEl.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    type();
  }


  /* ----------------------------------------------------------
     12. APK DOWNLOAD LINKS
  ---------------------------------------------------------- */
  const APK_URL = window.RENTISURE_APK_URL || '#';
  document.querySelectorAll('[data-apk-link]').forEach(el => {
    el.href = APK_URL;
  });

});
