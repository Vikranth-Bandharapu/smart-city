/* main.js - UrbanNexus Corporate Website Global Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initLoader();
    initNavbar();
    initScrollAnimations();
    initFAQ();
    initTestimonialSlider();
    initGlobalButtonRedirects();
    initPasswordToggles();
});

/* 1. Loader Logic */
function initLoader() {
    const loader = document.getElementById('loader-container');
    if (!loader) return;

    // Show loader for exactly 3 seconds, then fade out
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600); // match transition speed
    }, 3000);
}

/* 2. Sticky Navbar and Hamburger Menu */
function initNavbar() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

/* 3. Scroll Animations (Intersection Observer) */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/* 4. Contact Page FAQ Accordion */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* 5. Home Page Testimonials Slider */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // wrap around
            }
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // wrap around
            }
            updateSlider();
        });
    }
}

/* 6. Global Button & CTA Redirects to 404 */
function initGlobalButtonRedirects() {
    document.addEventListener('click', (e) => {
        // Find if user clicked a button, submit input, anchor styled as button, or notification bell
        const target = e.target.closest('button, a, input[type="submit"], .notification-bell');
        if (!target) return;

        // Check exemptions list:
        // 1. Logo
        if (target.classList.contains('logo') || target.closest('.logo')) return;

        // 2. Navigation items
        const isNavLoginBtn = target.id === 'nav-login-btn' || target.closest('#nav-login-btn') || target.id === 'nav-login-btn-mobile' || target.closest('#nav-login-btn-mobile');
        const isNavSignupBtn = target.id === 'nav-signup-btn' || target.closest('#nav-signup-btn') || target.id === 'nav-signup-btn-mobile' || target.closest('#nav-signup-btn-mobile');
        const isNavbarLink = target.closest('.nav-links') && target.tagName === 'A';
        const isFooterNavLink = target.closest('.footer-nav-links') && target.tagName === 'A';

        // 3. Authentications Form Submits (handled by auth.js)
        const isAuthSubmit = target.id === 'auth-login-submit' || target.id === 'auth-signup-submit' || target.id === 'logout-btn' || target.closest('#logout-btn') || target.classList.contains('logout-btn') || target.closest('.logout-btn');
        const isAuthToggleLink = target.closest('.auth-footer') && target.tagName === 'A';

        // 4. Custom 404 Go to Home
        const isGoHome = target.id === 'home-btn' || target.classList.contains('go-home-btn');

        // 5. Mobile Hamburger toggles
        const isHamburger = target.classList.contains('hamburger') || target.closest('.hamburger') || target.classList.contains('dash-hamburger') || target.closest('.dash-hamburger');

        // 6. Dashboard navigation tabs & sidebar toggles & overlay
        const isDashboardMenu = target.closest('.sidebar-menu-item') || target.closest('.sidebar-toggle') || target.closest('.user-profile-widget') || target.closest('.sidebar-overlay') || target.closest('#sidebar-overlay');

        // 7. Slider arrow buttons (Testimonials)
        const isSliderArrow = target.classList.contains('slider-arrow') || target.closest('.slider-arrow');

        // 8. Password Toggle (Show/Hide Password)
        const isPasswordToggle = target.classList.contains('password-toggle') || target.closest('.password-toggle');

        // 9. User Support Ticket Form
        const isSupportSubmit = target.closest('#user-ticket-form');

        // Combined Exemptions
        if (
            isNavLoginBtn || 
            isNavSignupBtn || 
            isNavbarLink || 
            isFooterNavLink ||
            isAuthSubmit || 
            isAuthToggleLink ||
            isGoHome || 
            isHamburger || 
            isDashboardMenu ||
            isSliderArrow ||
            isPasswordToggle ||
            isSupportSubmit
        ) {
            return; // Allow default navigation/logic
        }

        // Check form validation first if it's a form submission button
        const form = target.closest('form');
        if (form) {
            const isSubmit = target.type === 'submit' || target.tagName === 'BUTTON' || target.getAttribute('type') === 'submit';
            if (isSubmit) {
                // Clear any existing errors first
                clearInlineErrors(form);

                // Find all inputs in the form
                const emailInput = form.querySelector('input[type="email"]');
                const nameInput = form.querySelector('input[type="text"]');
                const messageInput = form.querySelector('textarea');
                let hasError = false;

                // Helper to setup auto-clear on input
                const setupAutoClear = (inputEl) => {
                    if (!inputEl) return;
                    if (!inputEl.dataset.hasErrorListener) {
                        inputEl.addEventListener('input', () => {
                            inputEl.style.borderColor = '';
                            const parent = inputEl.closest('.form-group') || inputEl.closest('form');
                            if (parent) {
                                const err = parent.querySelector('.form-error-msg');
                                if (err) err.remove();
                            }
                        });
                        inputEl.dataset.hasErrorListener = 'true';
                    }
                };

                // 1. Email validation
                if (emailInput) {
                    setupAutoClear(emailInput);
                    const emailValue = emailInput.value.trim();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailValue || !emailRegex.test(emailValue)) {
                        e.preventDefault();
                        showInlineError(emailInput, 'Please enter a valid email address.');
                        hasError = true;
                    }
                }

                // 2. Name validation (if required)
                if (nameInput && nameInput.hasAttribute('required')) {
                    setupAutoClear(nameInput);
                    if (!nameInput.value.trim()) {
                        e.preventDefault();
                        showInlineError(nameInput, 'Please enter your full name.');
                        hasError = true;
                    }
                }

                // 3. Message validation (if required)
                if (messageInput && messageInput.hasAttribute('required')) {
                    setupAutoClear(messageInput);
                    if (!messageInput.value.trim()) {
                        e.preventDefault();
                        showInlineError(messageInput, 'Please enter your message.');
                        hasError = true;
                    }
                }

                if (hasError) {
                    return;
                }
            }
        }

        // If it's a service/project filter button, we can toggle category but the prompt says:
        // "Except for: Logo, Login, Sign Up, Go to Home button. Every other button on the website should redirect to a custom 404 page."
        // We will strictly redirect everything else (Learn More, Submit Form, Newsletter Subscribe, etc.) to 404.html!
        e.preventDefault();
        window.location.href = '404.html';
    });
}

/* 7. Inline Form Validation Helpers */
function showInlineError(inputElement, message) {
    const parent = inputElement.closest('.form-group') || inputElement.closest('form');
    if (!parent) return;

    if (parent.tagName === 'FORM') {
        parent.style.flexWrap = 'wrap';
    }

    let errorEl = parent.querySelector('.form-error-msg');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error-msg';
        errorEl.style.color = '#f87171'; // bright red-coral
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '0.5rem';
        errorEl.style.display = 'block';
        errorEl.style.width = '100%';
        errorEl.style.flexBasis = '100%';
        errorEl.style.textAlign = 'left';
        parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
    inputElement.style.borderColor = '#f87171';
}

function clearInlineErrors(form) {
    form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    form.querySelectorAll('input, textarea, select').forEach(el => {
        el.style.borderColor = '';
    });
}

/* 8. Password Toggle Visibility */
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggleBtn => {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const input = toggleBtn.parentNode.querySelector('input');
            if (!input) return;
            
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            // Re-render Lucide icon inside the button safely
            toggleBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width: 18px; height: 18px;"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}
