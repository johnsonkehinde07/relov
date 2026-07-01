/* ========================================
   JS/main.js - MAIN JAVASCRIPT
   ======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Relov is ready!');
    console.log('📱 Made with ❤️ for students');
    
    // Initialize all components
    initNavbar();
    initFAQ();
    initProductCards();
    initCategoryCards();
    initStatsAnimation();
    initHeartButtons();
    initSmoothScroll();
});

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Mobile menu toggle
    const toggleBtn = document.querySelector('.navbar-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Close mobile menu on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });
}

/* ========================================
   FAQ TOGGLE
   ======================================== */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close other FAQs
            document.querySelectorAll('.faq-answer').forEach(el => {
                if (el !== answer) {
                    el.classList.remove('open');
                    el.previousElementSibling.querySelector('i').classList.remove('rotated');
                }
            });
            
            // Toggle this FAQ
            answer.classList.toggle('open');
            icon.classList.toggle('rotated');
        });
    });
}

/* ========================================
   PRODUCT CARDS
   ======================================== */
function initProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Ignore clicks on heart button
            if (e.target.closest('.product-card-heart')) return;
            
            const title = this.querySelector('.product-card-title')?.textContent || 'Product';
            // You can replace this with actual navigation
            window.location.href = `product-detail.html?title=${encodeURIComponent(title)}`;
        });
    });
}

/* ========================================
   CATEGORY CARDS
   ======================================== */
function initCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('.category-card-title')?.textContent || '';
            // You can replace this with actual filtering
            window.location.href = `marketplace.html?category=${encodeURIComponent(category)}`;
        });
    });
}

/* ========================================
   HEART BUTTONS (Wishlist)
   ======================================== */
function initHeartButtons() {
    document.querySelectorAll('.product-card-heart').forEach(heart => {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('liked');
            
            // Update icon
            const icon = this.querySelector('i');
            if (this.classList.contains('liked')) {
                icon.className = 'fas fa-heart';
                this.style.color = '#EF4444';
            } else {
                icon.className = 'far fa-heart';
                this.style.color = '';
            }
        });
    });
}

/* ========================================
   STATS ANIMATION (On Scroll)
   ======================================== */
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    let animated = false;
    
    function animateStats() {
        if (animated || !statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            animated = true;
            statsSection.style.opacity = '1';
            statsSection.classList.add('animate-fade-in-up');
        }
    }
    
    window.addEventListener('scroll', animateStats);
    window.addEventListener('load', animateStats);
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
function initSmoothScroll() {
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
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Format currency
function formatPrice(amount) {
    return '$' + amount.toFixed(0);
}

// Time ago helper
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return count + ' ' + unit + (count > 1 ? 's' : '') + ' ago';
        }
    }
    return 'Just now';
}

// Export for use in other files
window.Relov = {
    formatPrice,
    timeAgo
};