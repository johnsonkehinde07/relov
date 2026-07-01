/* ========================================
   JS/faq.js - FAQ Page Logic
   ======================================== */

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('❓ FAQ page loaded');
});

/* ========================================
   TOGGLE FAQ
   ======================================== */
function toggleFAQ(button) {
    // Get the answer container (next sibling)
    const answer = button.nextElementSibling;
    if (!answer) return;
    
    // Get the icon inside the button
    const icon = button.querySelector('i');
    if (!icon) return;
    
    // Check if this FAQ is currently open
    const isOpen = answer.classList.contains('open');
    
    // Find the parent category section
    const parent = button.closest('.faq-category-section');
    if (parent) {
        // Close all other FAQs in the same category
        const allAnswers = parent.querySelectorAll('.faq-answer');
        allAnswers.forEach(function(el) {
            if (el !== answer) {
                el.classList.remove('open');
                const btn = el.previousElementSibling;
                if (btn) {
                    const btnIcon = btn.querySelector('i');
                    if (btnIcon) {
                        btnIcon.classList.remove('rotated');
                    }
                }
            }
        });
    }
    
    // Toggle this FAQ
    if (isOpen) {
        answer.classList.remove('open');
        icon.classList.remove('rotated');
    } else {
        answer.classList.add('open');
        icon.classList.add('rotated');
    }
}

/* ========================================
   FILTER FAQS BY CATEGORY
   ======================================== */
function filterFAQs(category) {
    console.log('Filtering by:', category);
    
    // Update active tab
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide categories
    const sections = document.querySelectorAll('.faq-category-section');
    sections.forEach(function(section) {
        const sectionCategory = section.getAttribute('data-category');
        
        if (category === 'all') {
            section.style.display = 'block';
            section.classList.remove('hidden');
        } else if (sectionCategory === category) {
            section.style.display = 'block';
            section.classList.remove('hidden');
        } else {
            section.style.display = 'none';
            section.classList.add('hidden');
        }
    });
    
    // Close all open FAQs when filtering
    const openAnswers = document.querySelectorAll('.faq-answer.open');
    openAnswers.forEach(function(answer) {
        answer.classList.remove('open');
        const btn = answer.previousElementSibling;
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('rotated');
            }
        }
    });
    
    // Scroll to top of FAQ content
    const faqContent = document.querySelector('.faq-content');
    if (faqContent) {
        faqContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ========================================
   NAVBAR FUNCTIONS
   ======================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', function() {
    const mobileLinks = document.querySelectorAll('#mobileMenu a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const menu = document.getElementById('mobileMenu');
            if (menu) {
                menu.classList.remove('active');
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
});