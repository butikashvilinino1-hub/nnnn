/**
 * AURA Modern Landing Page JavaScript
 * Handles navigation, mobile menu, animations, dynamic counters,
 * interactive card spotlight, category filtering, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Sticky Header & Elevation on Scroll
    // ----------------------------------------------------
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    const handleScroll = () => {
        const scrollPos = window.scrollY;

        // Header glassmorphism shadow
        if (scrollPos > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollTopBtn) {
            if (scrollPos > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Scroll to top click
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------
    // 2. Mobile Menu Drawer Toggle
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-cta a');

    const toggleMobileMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', isOpen);
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => toggleMobileMenu());

        // Close when clicking mobile links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(true));
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMobileMenu(true);
            }
        });
    }

    // ----------------------------------------------------
    // 3. Navigation Active Link Highlighting (IntersectionObserver)
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ----------------------------------------------------
    // 4. Animated Number Counters (About Section)
    // ----------------------------------------------------
    const statsGrid = document.getElementById('stats-grid');
    const counterElements = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    const animateCounters = () => {
        counterElements.forEach(counter => {
            const targetVal = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const isDecimal = String(targetVal).includes('.');
            const duration = 1800; // ms
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out expo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = easeProgress * targetVal;

                if (isDecimal) {
                    counter.textContent = currentVal.toFixed(1) + suffix;
                } else {
                    counter.textContent = Math.floor(currentVal) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = (isDecimal ? targetVal.toFixed(1) : targetVal) + suffix;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsGrid);
    }

    // ----------------------------------------------------
    // 5. Features Category Filtering
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.getAttribute('data-filter');

            featureCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ----------------------------------------------------
    // 6. Interactive Mouse Spotlight Effect on Feature Cards
    // ----------------------------------------------------
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ----------------------------------------------------
    // 7. Character Counter for Message Textarea
    // ----------------------------------------------------
    const messageInput = document.getElementById('userMessage');
    const charCount = document.getElementById('charCount');

    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const len = messageInput.value.length;
            charCount.textContent = `${len}/500`;
            if (len >= 480) {
                charCount.style.color = '#ff5f56';
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        });
    }

    // ----------------------------------------------------
    // 8. Toast Notification System
    // ----------------------------------------------------
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    const showToast = (title, message) => {
        if (!toast) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;

        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    };

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
            clearTimeout(toastTimeout);
        });
    }

    // ----------------------------------------------------
    // 9. Contact Form Real-Time Validation & Async Submit
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn = document.getElementById('submitBtn');

    // Validation helpers
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const clearError = (inputEl, errorEl) => {
        const wrapper = inputEl.closest('.input-wrapper');
        if (wrapper) wrapper.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    };

    const setError = (inputEl, errorEl, msg) => {
        const wrapper = inputEl.closest('.input-wrapper');
        if (wrapper) wrapper.classList.add('error');
        if (errorEl) errorEl.textContent = msg;
    };

    // Live clear on input
    if (nameInput) {
        nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    }
    if (emailInput) {
        emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    }
    if (messageInput) {
        messageInput.addEventListener('input', () => clearError(messageInput, messageError));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const nameVal = nameInput.value.trim();
            const emailVal = emailInput.value.trim();
            const messageVal = messageInput.value.trim();

            // Validate Name
            if (!nameVal) {
                setError(nameInput, nameError, 'გთხოვთ მიუთითოთ სახელი');
                isValid = false;
            } else if (nameVal.length < 2) {
                setError(nameInput, nameError, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს');
                isValid = false;
            } else {
                clearError(nameInput, nameError);
            }

            // Validate Email
            if (!emailVal) {
                setError(emailInput, emailError, 'გთხოვთ მიუთითოთ ელექტრონული ფოსტა');
                isValid = false;
            } else if (!validateEmail(emailVal)) {
                setError(emailInput, emailError, 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი');
                isValid = false;
            } else {
                clearError(emailInput, emailError);
            }

            // Validate Message
            if (!messageVal) {
                setError(messageInput, messageError, 'გთხოვთ დაწეროთ თქვენი შეტყობინება');
                isValid = false;
            } else if (messageVal.length < 10) {
                setError(messageInput, messageError, 'შეტყობინება უნდა იყოს მინიმუმ 10 სიმბოლო');
                isValid = false;
            } else {
                clearError(messageInput, messageError);
            }

            if (!isValid) return;

            // Simulate form submission
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Show success toast
                showToast(
                    'შეტყობინება გაგზავნილია! ✨',
                    `მადლობა, ${nameVal}! თქვენი მოთხოვნა მიღებულია. ჩვენი გუნდი მალე დაგიკავშირდებათ.`
                );

                // Reset form
                contactForm.reset();
                if (charCount) charCount.textContent = '0/500';
            }, 1200);
        });
    }
});
