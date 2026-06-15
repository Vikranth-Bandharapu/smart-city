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
        // Find if user clicked a button, submit input, or anchor styled as button
        const target = e.target.closest('button, a, input[type="submit"]');
        if (!target) return;

        // Check exemptions list:
        // 1. Logo
        if (target.classList.contains('logo') || target.closest('.logo')) return;

        // 2. Navigation items
        const isNavLoginBtn = target.id === 'nav-login-btn' || target.closest('#nav-login-btn');
        const isNavSignupBtn = target.id === 'nav-signup-btn' || target.closest('#nav-signup-btn');
        const isNavbarLink = target.closest('.nav-links') && target.tagName === 'A';
        const isFooterNavLink = target.closest('.footer-nav-links') && target.tagName === 'A';

        // 3. Authentications Form Submits (handled by auth.js)
        const isAuthSubmit = target.id === 'auth-login-submit' || target.id === 'auth-signup-submit' || target.id === 'logout-btn' || target.closest('#logout-btn');
        const isAuthToggleLink = target.closest('.auth-footer') && target.tagName === 'A';

        // 4. Custom 404 Go to Home
        const isGoHome = target.id === 'home-btn' || target.classList.contains('go-home-btn');

        // 5. Mobile Hamburger toggles
        const isHamburger = target.classList.contains('hamburger') || target.closest('.hamburger');

        // 6. Dashboard navigation tabs & sidebar toggles
        const isDashboardMenu = target.closest('.sidebar-menu-item') || target.closest('.sidebar-toggle') || target.closest('.user-profile-widget');

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
            isDashboardMenu
        ) {
            return; // Allow default navigation/logic
        }

        // If it's a service/project filter button, we can toggle category but the prompt says:
        // "Except for: Logo, Login, Sign Up, Go to Home button. Every other button on the website should redirect to a custom 404 page."
        // We will strictly redirect everything else (Learn More, Submit Form, Newsletter Subscribe, etc.) to 404.html!
        e.preventDefault();
        window.location.href = '404.html';
    });
}
