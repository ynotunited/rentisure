document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const nav = document.querySelector('#top-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            nav.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        } else {
            nav.classList.remove('scrolled');
            nav.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
        }
    });

    // Waitlist Form Submission
    const waitlistForm = document.querySelector('#waitlist-form');
    const feedback = document.querySelector('#form-feedback');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect data
            const email = waitlistForm.querySelector('input[type="email"]').value;
            const role = waitlistForm.querySelector('select').value;
            
            console.log(`Waitlist signup: Email - ${email}, Role - ${role}`);
            
            // Simple visual feedback
            waitlistForm.classList.add('hidden');
            feedback.classList.remove('hidden');
            feedback.innerHTML = `<h3>Welcome to the club!</h3><p>We've added <strong>${email}</strong> to our ${role} waitlist. Stay tuned for early access.</p>`;
        });
    }

    // Scroll to section smoothing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple RentiScore animate score logic (placeholder for interactive Skia-like feel)
    const scoreNum = document.querySelector('.score-num');
    if (scoreNum) {
        let currentScore = 0;
        const targetScore = 850;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (out-cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const count = Math.floor(easedProgress * targetScore);
            scoreNum.textContent = count;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        // Simple Intersection Observer to start animation when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                requestAnimationFrame(animate);
                observer.unobserve(entries[0].target);
            }
        });
        
        observer.observe(scoreNum);
    }
});
