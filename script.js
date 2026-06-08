/* =====================================================
   INFISOFT TECHNOLOGIES — MAIN JAVASCRIPT
   Features:
   - Mobile menu toggle
   - Sticky navbar scroll effect
   - Smooth scrollspy for active nav links
   - Scroll reveal animations (IntersectionObserver)
   - Animated stat counters
   - Floating particles in hero
   - Contact form validation + success message
   - Back to Top button (floating + footer)
===================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------
       1. DOM Ready Helper
    ------------------------------------------------ */
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        initMobileMenu();
        initNavbarScroll();
        initScrollspy();
        initScrollReveal();
        initStatCounters();
        initHeroParticles();
        initContactForm();
        initBackToTop();
        initCardTilt();
    });


    /* ------------------------------------------------
       2. Mobile Menu Toggle
    ------------------------------------------------ */
    function initMobileMenu() {
        const hamburger   = document.getElementById('hamburger');
        const overlay     = document.getElementById('mobile-menu-overlay');
        const closeBtn    = document.getElementById('mobile-menu-close');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        if (!hamburger || !overlay) return;

        function openMenu() {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburger.classList.add('open');
        }

        function closeMenu() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.classList.remove('open');
        }

        hamburger.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close when any nav link is clicked
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        // Animate hamburger bars into X shape
        hamburger.addEventListener('click', function () {
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('open')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity   = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = '';
                bars[1].style.opacity   = '';
                bars[2].style.transform = '';
            }
        });

        // Reset bars on close
        function resetBars() {
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.opacity   = '';
            bars[2].style.transform = '';
        }

        if (closeBtn) closeBtn.addEventListener('click', resetBars);
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', resetBars);
        });
    }


    /* ------------------------------------------------
       3. Sticky Navbar Scroll Effect
    ------------------------------------------------ */
    function initNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        function onScroll() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }


    /* ------------------------------------------------
       4. Scrollspy — Highlight Active Nav Link
    ------------------------------------------------ */
    function initScrollspy() {
        var navLinks  = document.querySelectorAll('.nav-link');
        var sections  = [];

        // Map each nav link's href to its section element
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var section = document.querySelector(href);
                if (section) sections.push({ link: link, section: section });
            }
        });

        if (sections.length === 0) return;

        var navHeight = parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--nav-height') || '80',
            10
        );

        function updateActive() {
            var scrollY   = window.scrollY;
            var winHeight = window.innerHeight;
            var docHeight = document.documentElement.scrollHeight;
            var active    = null;

            // If near bottom of page, activate last section
            if (scrollY + winHeight >= docHeight - 40) {
                active = sections[sections.length - 1];
            } else {
                // Find the deepest section whose top is at or above the viewport midpoint
                for (var i = 0; i < sections.length; i++) {
                    var top = sections[i].section.getBoundingClientRect().top;
                    if (top <= navHeight + 20) {
                        active = sections[i];
                    }
                }
            }

            navLinks.forEach(function (l) { l.classList.remove('active'); });
            if (active) active.link.classList.add('active');
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }


    /* ------------------------------------------------
       5. Scroll Reveal Animations (IntersectionObserver)
    ------------------------------------------------ */
    function initScrollReveal() {
        var targets = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right'
        );

        if (!targets.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
        );

        targets.forEach(function (el) { observer.observe(el); });
    }


    /* ------------------------------------------------
       6. Animated Stat Counters
    ------------------------------------------------ */
    function initStatCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        var triggered = false;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !triggered) {
                        triggered = true;
                        counters.forEach(animateCounter);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        var statsSection = document.getElementById('stats');
        if (statsSection) observer.observe(statsSection);

        function animateCounter(el) {
            var target   = parseInt(el.getAttribute('data-target'), 10);
            var duration = 2000; // ms
            var start    = performance.now();
            var suffix   = target === 24 ? '/7' : target >= 100 ? '+' : '+';

            function update(now) {
                var elapsed  = now - start;
                var progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                var eased   = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + suffix;
                }
            }

            requestAnimationFrame(update);
        }
    }


    /* ------------------------------------------------
       7. Hero Floating Particles (Canvas-free, DOM-based)
    ------------------------------------------------ */
    function initHeroParticles() {
        var container = document.getElementById('particles');
        if (!container) return;

        var count = 50;

        for (var i = 0; i < count; i++) {
            var dot = document.createElement('span');
            dot.className = 'particle-dot';

            // Random properties
            var size     = Math.random() * 3 + 1;           // 1–4px
            var x        = Math.random() * 100;              // % horizontal
            var y        = Math.random() * 100;              // % vertical
            var delay    = Math.random() * 8;                // s
            var duration = 6 + Math.random() * 10;          // 6–16s
            var opacity  = Math.random() * 0.5 + 0.1;       // 0.1–0.6

            // Randomly teal/purple/orange tint
            var hues = ['124,58,237', '249,115,22', '168,85,247', '0,210,255'];
            var hue  = hues[Math.floor(Math.random() * hues.length)];

            dot.style.cssText = [
                'position:absolute',
                'border-radius:50%',
                'width:'  + size + 'px',
                'height:' + size + 'px',
                'left:'   + x + '%',
                'top:'    + y + '%',
                'background:rgba(' + hue + ',' + opacity + ')',
                'box-shadow:0 0 ' + (size * 3) + 'px rgba(' + hue + ',0.4)',
                'animation:particle-drift ' + duration + 's ' + delay + 's ease-in-out infinite alternate',
                'pointer-events:none',
            ].join(';');

            container.appendChild(dot);
        }

        // Inject the keyframe if not already present
        if (!document.getElementById('particle-style')) {
            var style = document.createElement('style');
            style.id  = 'particle-style';
            style.textContent = [
                '@keyframes particle-drift {',
                '  0%   { transform: translate(0,0) scale(1); opacity: 0.1; }',
                '  50%  { opacity: 0.6; }',
                '  100% { transform: translate(20px,-30px) scale(1.2); opacity: 0.15; }',
                '}',
            ].join('\n');
            document.head.appendChild(style);
        }
    }


    /* ------------------------------------------------
       8. Contact Form Validation & Submission
    ------------------------------------------------ */
    function initContactForm() {
        var form       = document.getElementById('contact-form');
        var successMsg = document.getElementById('form-success');
        var submitBtn  = document.getElementById('submit-btn');

        if (!form) return;

        // Input events — clear error as user types
        form.querySelectorAll('.form-input').forEach(function (input) {
            input.addEventListener('input', function () {
                clearError(input);
            });
            input.addEventListener('change', function () {
                clearError(input);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameEl    = document.getElementById('c-name');
            var emailEl   = document.getElementById('c-email');
            var phoneEl   = document.getElementById('c-phone');
            var subjectEl = document.getElementById('c-subject');
            var messageEl = document.getElementById('c-message');

            var valid = true;

            // Name — must not be empty
            if (!nameEl.value.trim()) {
                showError(nameEl); valid = false;
            } else {
                clearError(nameEl);
            }

            // Email — basic format check
            if (!validateEmail(emailEl.value.trim())) {
                showError(emailEl); valid = false;
            } else {
                clearError(emailEl);
            }

            // Phone — must not be empty
            if (!phoneEl.value.trim()) {
                showError(phoneEl); valid = false;
            } else {
                clearError(phoneEl);
            }

            // Subject
            if (!subjectEl.value.trim()) {
                showError(subjectEl); valid = false;
            } else {
                clearError(subjectEl);
            }

            // Message — at least 10 characters
            if (messageEl.value.trim().length < 10) {
                showError(messageEl); valid = false;
            } else {
                clearError(messageEl);
            }

            if (!valid) return;

            // Simulate sending
            submitBtn.disabled = true;
            var btnSpan = submitBtn.querySelector('span');
            var original = btnSpan ? btnSpan.textContent : 'Send Message';
            if (btnSpan) btnSpan.textContent = 'Sending…';

            setTimeout(function () {
                submitBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = original;

                form.reset();

                if (successMsg) {
                    successMsg.classList.add('show');
                    setTimeout(function () {
                        successMsg.classList.remove('show');
                    }, 5000);
                }
            }, 1600);
        });

        function showError(input) {
            var group = input.closest('.form-group');
            if (group) group.classList.add('has-error');
            input.classList.add('error');
        }

        function clearError(input) {
            var group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
            input.classList.remove('error');
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }


    /* ------------------------------------------------
       9. Back To Top Button (Floating + Footer)
    ------------------------------------------------ */
    function initBackToTop() {
        var floatBtn   = document.getElementById('back-to-top');
        var footerBtn  = document.getElementById('back-to-top-footer');

        function scrollToTop(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (floatBtn) {
            floatBtn.addEventListener('click', scrollToTop);

            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) {
                    floatBtn.classList.add('visible');
                } else {
                    floatBtn.classList.remove('visible');
                }
            }, { passive: true });
        }

        if (footerBtn) {
            footerBtn.addEventListener('click', scrollToTop);
        }
    }


    /* ------------------------------------------------
       10. Subtle Card Tilt Effect (mouse parallax)
           Applied to service & testimonial cards
    ------------------------------------------------ */
    function initCardTilt() {
        var cards = document.querySelectorAll(
            '.service-card, .testimonial-card, .work-card, .office-card'
        );

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect   = card.getBoundingClientRect();
                var x      = e.clientX - rect.left;
                var y      = e.clientY - rect.top;
                var cx     = rect.width  / 2;
                var cy     = rect.height / 2;
                var maxTilt = 4; // degrees

                var rotX = -((y - cy) / cy) * maxTilt;
                var rotY =  ((x - cx) / cx) * maxTilt;

                card.style.transform =
                    'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(4px)';

                // Move the radial glow to follow cursor
                var glow = card.querySelector('.service-hover-glow');
                if (glow) {
                    glow.style.background =
                        'radial-gradient(circle at ' + x + 'px ' + y + 'px, ' +
                        'rgba(124,58,237,0.10) 0%, transparent 60%)';
                }
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

})();
