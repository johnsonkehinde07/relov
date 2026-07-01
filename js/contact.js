/* ========================================
   JS/contact.js - Contact Page Logic
   ======================================== */

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📧 Contact page loaded');
    
    initScrollAnimations();
    setupFormValidation();
});

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.contact-method, .location-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   FORM VALIDATION
   ======================================== */
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorEl = this.parentElement.querySelector('.error-message');
                if (errorEl) errorEl.remove();
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing error
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.remove();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = `
        color: var(--danger);
        font-size: 0.8125rem;
        margin-top: 0.25rem;
        display: block;
    `;
    error.textContent = message;
    field.parentElement.appendChild(error);
}

/* ========================================
   HANDLE CONTACT FORM
   ======================================== */
function handleContactForm(event) {
    event.preventDefault();
    
    // Validate all fields
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('⚠️ Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Check consent
    const consent = document.getElementById('contactConsent');
    if (!consent.checked) {
        showToast('⚠️ Please agree to the consent terms', 'error');
        consent.style.outline = '2px solid var(--danger)';
        setTimeout(() => {
            consent.style.outline = '';
        }, 3000);
        return;
    }
    
    // Collect form data
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value.trim()
    };
    
    console.log('📧 Contact form submitted:', formData);
    
    // Show loading state
    const btn = document.getElementById('contactBtn');
    const btnText = document.getElementById('contactBtnText');
    const btnIcon = document.getElementById('contactBtnIcon');
    
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-arrow-right';
        
        // Show success modal
        document.getElementById('successModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        document.getElementById('contactForm').reset();
    }, 2000);
}

/* ========================================
   CLOSE SUCCESS MODAL
   ======================================== */
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ========================================
   CLOSE MODAL ON ESCAPE
   ======================================== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});

/* ========================================
   CLOSE MODAL ON OVERLAY CLICK
   ======================================== */
document.querySelector('.modal-overlay')?.addEventListener('click', function() {
    closeSuccessModal();
});

/* ========================================
   NAVBAR FUNCTIONS
   ======================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});