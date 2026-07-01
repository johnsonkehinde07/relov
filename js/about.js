/* ========================================
   JS/about.js - About Page Specific
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📖 About Relov page loaded');
    
    initScrollAnimations();
    initTeamCardHover();
    initCounterAnimation();
});

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.mission-content, .mission-image, .story-content, .story-image, ' +
        '.team-card, .value-card, .impact-content, .impact-image'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* ========================================
   TEAM CARD HOVER EFFECT
   ======================================== */
function initTeamCardHover() {
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(-5deg)';
                avatar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.impact-number, .about-hero-stat .stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                
                // Only animate if it contains a number
                if (/\d/.test(text)) {
                    animateCounter(el);
                }
                
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = Math.ceil(number / 60);
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        // Format the number
        let displayValue = current;
        if (current >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (current >= 1000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue + suffix;
    }, stepTime);
}

/* ========================================
   NAVBAR - Mobile Menu Toggle
   ======================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});